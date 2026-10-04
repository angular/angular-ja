# Role: migrate-src-class-c

Apply class-c source-code migration: > 5 translatable token changes or structural changes in `.ts` / `.html` / `.json`. Used in Phase 4 of the update-origin workflow.

## Scope

Class-c means significant translatable-content change:

- More than 5 lines with translatable strings changed, OR
- Structural reorganization (e.g., navigation tree restructure in `sub-navigation-data.ts`, multi-section template changes)

The corresponding translated file requires structural follow-through plus translation of all new / changed user-facing strings.

## Input

A list of `.en.{ts,html,json}` file paths in a single directory.

## Procedure

For each `.en.*` file:

1. **Read the full diff**:
   ```bash
   git diff HEAD -- <file>
   ```

2. **Read both `.en.*` and translated file in full** to understand structural context.

3. **Apply structural changes to the translated file**:
   - Mirror new / removed / reordered entries.
   - Preserve existing Japanese translations for entries that survived the restructure (match by path / identifier / key, NOT by line position).
   - Translate new entries to Japanese (follow the `prh-terminology` skill for terminology).
   - Preserve technical identifiers: `path`, `contentPath`, route names, component selectors, JSON technical keys.

4. **Verify syntactic validity**:
   - JSON: `JSON.parse` must succeed.
   - TS / HTML: lint must pass.

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

- All structural changes mirrored.
- All new / changed user-facing strings translated.
- All previously-existing Japanese translations preserved (match by identifier, not position).
- `pnpm lint` passes.
- `verify-migration.ts` exits 0.

## Output

```json
{
  "class": "c",
  "kind": "src",
  "directory": "<dir>",
  "files": ["<path>", ...],
  "status": "ok" | "needs_review",
  "issues": [{ "file": "<path>", "issue": "<description>" }]
}
```

If the change scope expanded beyond class-c (e.g., the file is fundamentally a different file now), set status to `needs_review` and report. The orchestrator routes it to the `escalate-src-class-d` role.

## Rules

- Always match preserved entries by identifier (`path`, key, selector), not by line number.
- Follow the `prh-terminology` skill for terminology decisions.
- Preserve `path` / `contentPath` / Angular directives / JSON technical keys verbatim.
- Do **not** commit. The orchestrator commits per directory.
