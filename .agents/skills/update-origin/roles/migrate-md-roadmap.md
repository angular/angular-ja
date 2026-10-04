# Role: migrate-md-roadmap

Specialized migration handler for `adev-ja/src/content/reference/roadmap.md`. The roadmap evolves by accumulating completed work as historical records, so it cannot be migrated by the generic class-a/b/c/d roles. Used in Phase 3 of the update-origin workflow whenever `roadmap.md` appears in the classifier output.

## Why roadmap.md is special

Each Angular release reshapes the roadmap by **moving in-progress items to "Completed projects"** as historical records, **adding new items**, and **occasionally deleting outdated items**. The previous Japanese translation must be preserved wherever possible: Completed projects already translated should remain in Japanese as historical documentation, even when the upstream restructured the surrounding sections.

## Inputs

- `adev-ja/src/content/reference/roadmap.md`: current state: upstream English (defer applied by the orchestrator before this role runs).
- `adev-ja/src/content/reference/roadmap.md.bak`: previous Japanese translation.
- Old upstream English: `git show main:adev-ja/src/content/reference/roadmap.en.md`.
- New upstream English: same as current `.md`.

## Hunk Classification (mandatory)

Walk every hunk in `git show main:adev-ja/src/content/reference/roadmap.en.md | diff - adev-ja/src/content/reference/roadmap.md` and classify each:

| Pattern | Action |
| --- | --- |
| **Pure addition in In-progress / Available / Future sections** (new `<docs-card>` or list entry, no removal) | Insert as English-as-is at the corresponding section; flag for follow-up translation |
| **`<docs-card>` removed from in-progress AND added to "Completed projects" with `link="Completed in ..."`** | Move the **Japanese-translated** `<docs-card>` block (from `.md.bak`) to the "Completed projects" section; do NOT replace with English. Adjust the heading's link attribute to match upstream's `Completed in ...` text. |
| **In-progress `<docs-card>` body rewritten without moving to Completed** (same title, different prose / additional context) | Keep the previous Japanese title and surrounding structure; replace the body prose with the new English as-is. Translation is a follow-up. |
| **Whole section removed** (e.g. the "Future work, explorations, and prototyping" header + its body) | Delete the corresponding Japanese section entirely from the working copy (it is no longer in upstream). |
| **Whole new section added** (new H2 with content) | Insert the new section in English as-is. |
| **Goals list expanded** (e.g. "two goals" → "three goals", with new bullet) | Update the count word and add the new bullet in English at the corresponding position. |
| **Stylistic English-only edit** (e.g. removing trailing `href=""` attribute, list markers `1.` vs `2.`) | Mirror the change so line correspondence stays exact; the visible Japanese prose around it remains. |

## Procedure

1. Verify the inputs exist (`.md`, `.md.bak`, plus `git show main:...en.md` succeeds). If not, abort.
2. Compute the diff and classify every hunk per the table above. Build an internal plan listing each hunk and its action.
3. Construct the result `.md` starting from `.md.bak` and applying the planned actions in upstream-line order:
   - Preserve every Japanese sentence that has not been touched by upstream.
   - Move Completed-projects entries from their old position to the new Completed-projects section, **keeping the Japanese text**.
   - Insert / replace English sections per the classification.
4. Recreate `.en.md` by copying `origin/adev/src/content/reference/roadmap.md`.
5. Delete `.md.bak`.
6. Verify `wc -l <file.en.md> <file.md>` are identical.
7. Per-line spot check: each hunk should have produced a `.md` line-aligned with the new `.en.md`.
8. Run `pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts adev-ja/src/content/reference`.

## Completion Conditions (all required)

- Every hunk has been classified and applied.
- Completed-projects entries that were merely moved (not rewritten) retain their previous Japanese translation.
- New / replaced sections are inserted in English as-is, line-aligned.
- Removed sections are gone.
- `wc -l` parity holds.
- `.md.bak` is deleted; `.en.md` is regenerated from upstream.

## Output

```json
{
  "file": "adev-ja/src/content/reference/roadmap.md",
  "status": "ok" | "needs_review" | "aborted",
  "hunks": [
    { "kind": "added-in-progress" | "moved-to-completed" | "rewritten-in-place" | "section-removed" | "section-added" | "goal-list-update" | "stylistic", "summary": "...", "translation_preserved": true | false }
  ],
  "lines": <n>,
  "follow_up_translation_needed": ["<short list of inserted English blocks>"]
}
```

## Rules

- **Never** wholesale-replace the file with English (the generic d-structural defer). Roadmap accumulates history; previous Completed translations must survive.
- **Never** translate inserted English (in-progress additions). That is a follow-up PR.
- **Always** preserve Japanese for items that were merely repositioned (in-progress → Completed) without prose rewrite.
- **Do not** commit; the orchestrator commits per directory.
