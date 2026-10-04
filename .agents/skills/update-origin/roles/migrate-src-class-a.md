# Role: migrate-src-class-a

Apply class-a source-code migration: changes that do NOT affect translatable tokens (logic / type / structure only). For `.ts` / `.html` / `.json` files. Used in Phase 4 of the update-origin workflow.

## Scope

Class-a means the diff in `.en.{ts,html,json}` does **not** touch translatable text:

- Pure code-logic / type / import changes
- Non-text attribute changes in HTML
- Schema-only JSON changes (no user-facing strings)

The corresponding `.{ts,html,json}` should follow the same code-level changes but its translated strings remain untouched.

## Input

A list of `.en.{ts,html,json}` file paths in a single directory.

## Procedure

For each `.en.*` file:

1. **Read the diff**:
   ```bash
   git diff HEAD -- <file>
   ```
   Confirm no translatable token (label/title/description/text-node/JSON user-facing string) is affected. If any is, **abort and report**.

2. **Apply the same code-level changes to the translated file** while preserving Japanese strings:
   - For `.ts`: mirror import / type / logic changes, keep `label:` / `title:` etc. values in Japanese.
   - For `.html`: mirror tag / attribute / directive changes, keep text nodes in Japanese.
   - For `.json`: mirror non-string-value changes, keep translated string values intact.

3. **Verify the translated file is syntactically valid**:
   - `.ts` / `.html`: rely on `pnpm lint`.
   - `.json`: ensure `JSON.parse` succeeds (project test step covers this).

4. **Run lint on this file**:
   ```bash
   pnpm lint --fix <file.translated>
   pnpm lint <file.translated>
   ```

After processing all files:

5. **Run migration verifier on the directory**:
   ```bash
   pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>
   ```
   Exit code must be 0.

## Completion Conditions

- Every `.en.*` and translated pair exists.
- Code-level changes mirrored in translated file.
- No Japanese translation strings altered.
- `pnpm lint` passes.
- `verify-migration.ts` exits 0.

## Output

```json
{
  "class": "a",
  "kind": "src",
  "directory": "<dir>",
  "files": ["<path>", ...],
  "status": "ok" | "aborted",
  "reason": "<if aborted>"
}
```

## Rules

- Do **not** alter translated user-facing strings.
- Source code line counts are NOT enforced (unlike markdown).
- Do **not** commit. The orchestrator commits per directory.
