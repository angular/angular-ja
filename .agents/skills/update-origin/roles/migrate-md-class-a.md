# Role: migrate-md-class-a

Apply class-a markdown migration: low-risk changes that nevertheless may need to be mirrored to the Japanese `.md` (code in fenced blocks, URLs, prose identifiers). Used in Phase 3 of the update-origin workflow for batches classified as class a by `classify-md-diff.ts`.

## Scope

Class-a means the diff is **small and structurally simple**, but it is NOT automatically a no-op for the Japanese side. You MUST mirror three categories of change to the `.md`:

1. **Code inside fenced code blocks**: the code is shared verbatim with the upstream English; if upstream renames an import, identifier, or value, the Japanese-side fenced block must be updated to the same code.
2. **URLs / link paths in markdown links**: the `](path)` value must match upstream exactly (e.g. `(guide/components)` → `(/guide/components)`).
3. **Code identifiers in prose backticks**: when a backtick token in prose changes (e.g. `item.key` → `item.value`, `getHarnesses` → `getAllHarnesses`), the Japanese prose on the same line must adopt the new token.

The Japanese `.md` only stays byte-identical when ALL of the following hold:

- The diff is purely an English-prose typo (e.g. `manubar` → `menubar`, `exisiting` → `existing`) where the Japanese translation already conveyed the correct meaning naturally.
- No code inside fenced blocks changed.
- No URL / link path changed.
- No backtick identifier in prose changed.

## Input

A list of `.en.md` file paths (already updated on disk by `pnpm update-origin`). All files share one directory.

## Procedure

1. **Inspect the diff**: For each `.en.md`, run:
   ```bash
   git diff HEAD -- <file.en.md>
   ```
   Walk EVERY hunk and classify each change:
   - (a) Fenced code block content change → mirror to `.md`.
   - (b) URL / link path change → mirror to `.md`.
   - (c) Backtick identifier change in prose → mirror to `.md` on the same line (Japanese prose around it stays).
   - (d) Pure English-prose typo with no semantic identifier change → leave `.md` unchanged.
   - (e) Anything else (semantic prose change, structural change) → abort and report; this is not class-a.

2. **Apply mirroring edits to `.md`** for any (a), (b), (c) changes from step 1. Each edit must be on the SAME line index as the corresponding change in `.en.md` (line correspondence is preserved). Do NOT translate; just replace the changed token / URL / code while keeping the surrounding Japanese prose intact.

3. **Verify line count parity**:
   ```bash
   wc -l <file.en.md> <file.md>
   ```
   Counts MUST be identical.

4. **Per-line spot check**: For each line touched in `.en.md`, read the same line index in `.md` and confirm:
   - All backtick code tokens that appear in `.en.md`'s line also appear in `.md`'s line (substring match).
   - All `](url)` link paths in `.en.md`'s line also appear in `.md`'s line.
   - Any fenced code block content matches verbatim between sides.

   If a token / URL is missing on the JA side, fix it before completing.

## Completion Conditions (all required)

- Every (a), (b), (c) hunk has been mirrored to the corresponding `.md` line.
- `wc -l` matches between every `.en.md` and `.md`.
- Per-line spot check passes for all changed lines.

## Output

Return a JSON-shaped summary:

```json
{
  "class": "a",
  "directory": "<dir>",
  "files": ["<path>", ...],
  "status": "ok" | "aborted",
  "reason": "<if aborted>"
}
```

## Rules

- Do **not** translate. Class-a only mirrors code / URL / identifier-token changes; surrounding Japanese prose stays.
- Do **not** rewrite or restructure paragraphs. If the diff requires that, abort with `status: aborted` and report; the orchestrator will reclassify.
- Do **not** run `pnpm lint --fix` here.
- Do **not** commit. The orchestrator commits per directory.
