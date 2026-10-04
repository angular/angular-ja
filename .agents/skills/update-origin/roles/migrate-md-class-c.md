# Role: migrate-md-class-c

Apply class-c markdown migration: paragraph-level retranslation (≤ 30 prose lines, structural change within file). Used in Phase 3 of the update-origin workflow for batches classified as class c by `classify-md-diff.ts`.

## Scope

Class-c means the `.en.md` diff requires paragraph-level retranslation:

- 6–30 prose lines changed
- Paragraph rewriting, multiple sentence rewordings, structural reordering within the file
- Page identity preserved (still the same topic / chapter)

The corresponding `.md` file needs **paragraph-level retranslation** preserving heading IDs and line-by-line correspondence with `.en.md`.

## Input

A list of `.en.md` file paths in a single directory.

## Procedure

For each `.en.md` file:

1. **Read the full diff** to understand intent:
   ```bash
   git diff HEAD -- <file.en.md>
   ```

2. **Read both `.en.md` (post-update) and `.md` in full** to ground retranslation in context.

3. **Identify affected paragraphs** in `.en.md` (group changed hunks by paragraph).

4. **Retranslate each affected paragraph**:
   - Translate the new English paragraph to Japanese.
   - Follow the `prh-terminology` skill for terminology consistency.
   - Apply the project translation rules (see "Translation Rules Reference" in `AGENTS.md`):
     - Italic: `*text*` not `_text_`
     - Standardized terminology: 基本ガイド, 真の情報源, 即座に, 最新情報, etc.
     - Heading IDs: `{#kebab-case}` on `##` and `###` headings
   - **CRITICAL: Preserve special-prefix annotations at line start.** When a line begins with one of `IMPORTANT:`, `NOTE:`, `HELPFUL:`, `TIP:`, `CRITICAL:`, `WARNING:`, `TLDR:` (optionally after blockquote `>` markers), it is a docs annotation recognized by the adev build pipeline. The prefix MUST stay literally in uppercase English (e.g. `IMPORTANT: `; `Tip:` is wrong, `重要:` is wrong, `警告:` is wrong). Translate only the body after the colon. This rule applies ONLY to line-leading prefixes; the same words appearing inside headings or mid-sentence are normal text and may be translated naturally.
   - Preserve untouched paragraphs verbatim.
   - Maintain line-by-line correspondence with `.en.md`.

5. **Verify line count parity**:
   ```bash
   wc -l <file.en.md> <file.md>
   ```
   Counts MUST be identical.

6. **Run lint on this file**:
   ```bash
   pnpm lint --fix <file.md>
   pnpm lint <file.md>
   ```

After processing all files:

7. **Run migration verifier on the directory**:
   ```bash
   pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>
   ```
   Exit code must be 0.

## Completion Conditions (all required)

- Every `.en.md` and `.md` pair has identical line count.
- All paragraph-level changes in `.en.md` are reflected in `.md` with quality Japanese translation.
- Heading IDs are preserved or added per project convention.
- `pnpm lint` passes for all modified `.md`.
- `verify-migration.ts <directory>` exits 0.

## Output

```json
{
  "class": "c",
  "directory": "<dir>",
  "files": ["<path>", ...],
  "status": "ok" | "needs_review",
  "issues": [{ "file": "<path>", "issue": "<description>" }]
}
```

If the change scope expanded beyond class-c during analysis (e.g., page identity changed, > 50% of file rewritten), set status to `needs_review` with reason. Do **not** silently proceed as if it were class-c. The orchestrator will route it to the class-d defer flow.

## Rules

- Always read the source `.en.md` before translating. Never modify `.md` based on "what sounds natural" alone.
- Follow the `prh-terminology` skill for terminology decisions.
- Preserve `.md` content for unchanged paragraphs verbatim. Do not opportunistically refactor.
- Do **not** commit. The orchestrator commits per directory.
