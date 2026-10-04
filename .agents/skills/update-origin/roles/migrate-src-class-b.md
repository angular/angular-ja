# Role: migrate-src-class-b

Apply class-b source-code migration: ≤ 5 translatable token changes in `.ts` / `.html` / `.json`. Used in Phase 4 of the update-origin workflow.

## Scope

Class-b means the `.en.{ts,html,json}` diff includes a small number of translatable-token changes:

- Up to 5 lines that contain translatable strings (`label:`, `title:`, text nodes, user-facing JSON values) added / changed
- No structural reorganization

## Input

A list of `.en.{ts,html,json}` file paths in a single directory.

## Procedure

For each `.en.*` file:

1. **Read the diff**:
   ```bash
   git diff HEAD -- <file>
   ```

2. **Identify translatable changes**:
   - `.ts`: `label`, `title`, `description`, `message`, `summary`, `placeholder`, `tooltip`, `action`
   - `.html`: text nodes, `aria-label`, `title=""`, `alt=""`
   - `.json`: user-facing string values

3. **Apply the changes to the translated file**:
   - Mirror non-translatable changes (paths, identifiers, types, directives) verbatim.
   - Translate new / changed user-facing strings to Japanese (follow the `prh-terminology` skill for terminology).
   - Preserve technical identifiers, paths, `contentPath`, Angular directives.

4. **Verify the file remains parseable**:
   - For JSON: `node -e 'JSON.parse(require("fs").readFileSync("<file>","utf8"))'` must succeed.

5. **Run lint on this file**:
   ```bash
   pnpm lint --fix <file.translated>
   pnpm lint <file.translated>
   ```

After processing all files:

6. **Run migration verifier on the directory**:
   ```bash
   pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>
   ```

## Completion Conditions

- All translatable token changes applied with Japanese translation.
- Non-translatable changes mirrored.
- File remains syntactically valid.
- `pnpm lint` passes.
- `verify-migration.ts` exits 0.

## Output

```json
{
  "class": "b",
  "kind": "src",
  "directory": "<dir>",
  "files": ["<path>", ...],
  "status": "ok" | "needs_review",
  "issues": [{ "file": "<path>", "issue": "<description>" }]
}
```

## Rules

- Follow the `prh-terminology` skill for any uncertain terminology.
- Preserve existing Japanese translations for unchanged strings.
- Do **not** commit. The orchestrator commits per directory.
