# Role: defer-md-class-d

Handle class-d markdown files during Phase 3 of the update-origin workflow. The orchestrator chooses one of two modes per file based on the actual content of the upstream diff.

## Mode selection (assigned by orchestrator)

The orchestrator inspects `git show main:<file.en.md> | diff - <file.en.md>` and tells you which mode to run:

**Default mode is d-additive.** Only escalate to d-structural under the objective gate below.

- **`d-additive`** (default): Existing Japanese translation must survive; new English sections are inserted as-is at corresponding positions and flagged for follow-up translation. Token renames (`values` → `value`, `panelId` → `panel`, etc.) in prose and tables MUST be mirrored to JA on the same line. This is normal additive work, not a structural signal.
- **`d-structural`**: Reserved for cases where the page has been so heavily restructured that the prior translation is unsalvageable. **Objective gate**: at least one h2 deletion OR ≥3 h3 deletions in the upstream diff. Count with:

  ```bash
  git -C origin diff cea6588bb3..<new-hash> -- adev/<path>.md | grep -E '^-(## |### )' | wc -l
  ```

  API rename, identifier swap, table-column changes, prose rewording, and new section insertion are **NEVER** structural signals by themselves. If the gate is not met, run additive even if you feel uncertain.

## Input

- A list of `.en.md` file paths under one directory.
- A mode (`d-additive` or `d-structural`).

The post-`pnpm update-origin` state is: `.en.md` already reflects new upstream English; `.md` still holds the old Japanese translation.

---

## Mode A: `d-additive`

**Goal**: keep the existing Japanese translation; only insert the new English blocks (untranslated) at the corresponding positions, and refresh `.en.md`.

### Procedure (per file)

1. **Compute the additive diff** between old upstream English and new upstream English:
   ```bash
   git show main:<file.en.md> > /tmp/old.en.md
   diff /tmp/old.en.md <file.en.md>
   ```
   Each hunk should be either pure additions (`>` lines only) or near-additive (≤2 `<` lines whose deletion does not affect the corresponding Japanese meaning).

2. **Read the current `.md`** (existing Japanese translation, line-aligned with the OLD `.en.md`).

3. **For each additive hunk**, find the anchor in the existing `.md` (use the surrounding unchanged context lines from the diff, which are the same in old `.en.md` and current `.md` line indices) and **insert the new English block as-is** at that position. Do NOT translate inserted blocks; that is a follow-up.

4. **For near-additive hunks** (English rewording that does not change Japanese meaning), leave the existing Japanese line untouched. Do not replace working translations with English.

5. **Verify line count parity** with the new `.en.md`:
   ```bash
   wc -l <file.en.md> <file.md>
   ```
   Counts MUST be identical.

6. **Verify structural alignment** (fenced code fences, headings, line-prefix annotations) by running:
   ```bash
   pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>
   ```
   Exit code MUST be 0.

### Output (additive)

```json
{
  "class": "d",
  "mode": "d-additive",
  "directory": "<dir>",
  "files": [
    {
      "file": "<path>",
      "status": "ok" | "needs_review",
      "inserted_blocks": ["<short summary of each English block left untranslated>"]
    }
  ]
}
```

The orchestrator commits the result (message per Phase 3.4 of `SKILL.md`). Additive blocks are deferred translation work, just embedded in place rather than as `.md.bak`.

---

## Mode B: `d-structural`

**Goal**: Full defer. Reset `.md` to upstream English; preserve prior Japanese as `.md.bak` for human re-translation reference.

### Procedure (per file)

1. **Back up the existing Japanese translation**:
   ```bash
   mv <file.md> <file.md.bak>
   ```

2. **Delete the `.en.md`** (the new English source will replace it as plain English):
   ```bash
   rm <file.en.md>
   ```

3. **Restore the upstream English file at the translated-file path** (untranslated state):
   ```bash
   cp origin/adev/<relative-path>/<filename>.md <file.md>
   ```
   Use the path relative to `origin/adev/` corresponding to the file under `adev-ja/`.

   Result: `<file.md>` is now plain English (matching upstream), `<file.md.bak>` holds the previous Japanese translation for future re-translation, and `<file.en.md>` is absent, meaning "untranslated" by project convention.

4. **Verify**:
   - `<file.md>` exists and matches `origin/adev/.../<filename>.md` byte-for-byte.
   - `<file.md.bak>` exists.
   - `<file.en.md>` does NOT exist.

### Output (structural)

```json
{
  "class": "d",
  "mode": "d-structural",
  "directory": "<dir>",
  "files": [
    {
      "file": "<path>",
      "backup": "<path>.bak",
      "status": "deferred"
    }
  ]
}
```

The orchestrator commits the result (message per Phase 3.4 of `SKILL.md`).

---

## Rules (apply to both modes)

- Do **not** translate any inserted English in this role. Translation is a follow-up.
- Do **not** modify untouched Japanese content.
- In `d-additive`, never silently switch to `d-structural` mid-file. If a hunk turns out to be non-additive, abort with `status: needs_review` and report the hunk; the orchestrator will re-route as `d-structural`.
- Do **not** commit. The orchestrator commits per directory.
