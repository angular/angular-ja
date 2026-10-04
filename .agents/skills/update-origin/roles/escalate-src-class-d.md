# Role: escalate-src-class-d

Escalate class-d source-code files (full rewrite, fundamental restructure) to user judgment. Source code cannot be reset to an untranslated state like markdown, so a human decision is required. Used in Phase 4 of the update-origin workflow.

## Scope

Class-d for source code means the file is fundamentally restructured:

- The file is effectively a different file now
- More than 100 total line changes with high translatable-token density
- Auto-migration would risk breaking navigation / templates / app behavior

Unlike markdown class-d, source-code files **cannot** be reset to "untranslated" state: they must remain functional. So this role **does NOT auto-defer**. It collects context and **escalates to the user**.

## Input

A list of `.en.{ts,html,json}` file paths.

## Procedure

For each `.en.*` file:

1. **Capture diff and current state**:
   ```bash
   git diff HEAD -- <file> > /tmp/<basename>.diff
   wc -l <file> <translated-file>
   ```

2. **Summarize**:
   - File path
   - Diff size (lines added / removed)
   - Translatable token density estimate
   - Risk areas (e.g., "removed 12 navigation entries that have Japanese translations", "wholesale template rewrite")

3. **Leave the working tree as is**: keep both `.en.*` and translated file as currently checked out by `pnpm update-origin`. Do NOT commit, do NOT translate, do NOT delete.

## Completion Conditions

- Working tree is unchanged for these files (still showing the modified state).
- A consolidated escalation report is produced.

## Output

```json
{
  "class": "d",
  "kind": "src",
  "status": "escalate",
  "files": [
    {
      "file": "<path>",
      "diffSize": { "added": <n>, "removed": <n> },
      "risk": "<short risk summary>",
      "recommendedAction": "manual-review" | "split-into-smaller-pr" | "defer-to-followup-pr"
    }
  ],
  "message": "These source-code files require human review before the origin sync can complete. Proposed actions inline."
}
```

## Rules

- Do **not** translate, edit, or revert anything.
- Do **not** commit.
- Surface the escalation report to the orchestrator. The orchestrator pauses Phase 4 until the user resolves these files manually or instructs how to proceed.
