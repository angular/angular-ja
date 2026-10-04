# Role: migrate-md-class-b

Apply class-b markdown migration: small diffs (≤ 5 prose lines, no paragraph restructure). Used in Phase 3 of the update-origin workflow for batches classified as class b by `classify-md-diff.ts`.

## Scope

Class-b means the `.en.md` diff is small and localized:

- Up to 5 prose lines changed (added/removed/modified)
- No paragraph-level restructuring
- Sentence-level rewording, supplementary phrases, link/text additions

The corresponding `.md` file needs **partial diff application** preserving line-by-line correspondence with `.en.md`.

## Input

A list of `.en.md` file paths in a single directory.

## Procedure

For each `.en.md` file:

1. **Read the diff**:
   ```bash
   git diff HEAD -- <file.en.md>
   ```

2. **Read the .en.md source** (post-update-origin state). This is the authoritative English text.

3. **Read the corresponding `.md` file**.

4. **Apply parallel changes to `.md`**:
   - For each changed hunk in `.en.md`, locate the same line range in `.md`.
   - Translate the changed English content to Japanese (follow the `prh-terminology` skill for terminology if uncertain).
   - Preserve unchanged surrounding lines exactly.
   - Maintain line-by-line correspondence: every `.en.md` line index must have a matching `.md` line index.
   - **CRITICAL: Preserve special-prefix annotations at line start.** When a line begins with one of `IMPORTANT:`, `NOTE:`, `HELPFUL:`, `TIP:`, `CRITICAL:`, `WARNING:`, `TLDR:` (optionally after blockquote `>` markers), it is a docs annotation recognized by the adev build pipeline. The prefix MUST stay literally in uppercase English (e.g. `IMPORTANT: `; `Tip:` is wrong, `重要:` is wrong, `警告:` is wrong). Translate only the body after the colon. This rule applies ONLY to line-leading prefixes; the same words appearing inside headings or mid-sentence are normal text and may be translated naturally.

5. **Verify line count parity**:
   ```bash
   wc -l <file.en.md> <file.md>
   ```
   Counts MUST be identical. If different, fix immediately.

6. **Run lint on this file**:
   ```bash
   pnpm lint --fix <file.md>
   pnpm lint <file.md>
   ```
   Both must succeed.

After processing all files:

7. **Run migration verifier on the directory**:
   ```bash
   pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>
   ```
   Exit code must be 0.

## Completion Conditions (all required)

- Every `.en.md` and `.md` pair has identical line count.
- Every changed hunk has a corresponding Japanese-translated change in `.md`.
- `pnpm lint` passes for all modified `.md`.
- `verify-migration.ts <directory>` exits 0.

## Output

```json
{
  "class": "b",
  "directory": "<dir>",
  "files": ["<path>", ...],
  "status": "ok" | "needs_review",
  "issues": [{ "file": "<path>", "issue": "<description>" }]
}
```

If line counts cannot be reconciled or translation requires paragraph-level rewrite, set status to `needs_review` and report. Do **not** silently escalate to class-c behavior.

## Rules

- Follow the `prh-terminology` skill for any uncertain terminology.
- Apply the project translation conventions (see "Translation rules" in `AGENTS.md`).
- Do **not** rewrite untouched paragraphs. Class-b is strictly localized changes.
- Do **not** commit. The orchestrator commits per directory.
