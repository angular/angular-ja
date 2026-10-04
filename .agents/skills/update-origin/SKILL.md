---
name: update-origin
description: "Single entry point for syncing Angular upstream changes to angular-ja. Orchestrates branch creation, origin sync, diff classification, delegated migration by role, deterministic verification, per-directory commits, and PR creation. Use whenever an origin update is requested."
---

# update-origin: Origin Sync Orchestrator

Single source of truth for the origin-update workflow. **Do not perform individual file migration in the orchestrating session itself.** All per-file work follows the role instruction files in `roles/`, so the orchestrating context stays small.

## Usage

Start the workflow with the upstream commit to sync to:

```
update-origin <commit-hash>
```

`<commit-hash>` is the upstream `angular/angular` commit to sync to.

## How roles are executed

Per-file migration instructions live in `roles/<name>.md`. For each batch:

- If your harness supports delegating work to sub-agents, pass the matching `roles/<name>.md` as the instructions, together with the inputs the role lists (file paths, mode, directory), and delegate. Independent batches (for example different classes within one directory) may run in parallel.
- If it does not, follow the same `roles/<name>.md` yourself, one batch at a time, in the order given by this document.

Each role returns the report shape defined in its "Output" section. The orchestrator (this workflow) reads that report before verifying or committing.

## Phase 0: Determine the correct sync target (MANDATORY)

Never accept the user-provided `<commit-hash>` or a tag SHA at face value. The actual production angular.dev may run a commit **after** the tag (e.g. v22.0.0 was tagged at `1cb0524f82` but production was on `fa546f382d` with `versions.json` v22 entry added in between).

```bash
# 1. Fetch the production angular.dev footer "Built by Angular at <version>+sha-<short>".
#    Fetch https://angular.dev/ and extract the short SHA.
# 2. Verify the short SHA resolves in the origin submodule.
# 3. If the user-supplied hash differs from the production SHA, report and confirm.
```

For **major-version syncs only**, also classify the new content (added markdown / config under `adev/src/content/`) and ask the user which pages to translate inside this PR. The rest go in `fix: migrate untranslated files`.

## Phase 1: Preparation

Run all of these in order, halting on any failure:

```bash
# 1. Branch
git checkout -b update-origin-<commit-hash>

# 2. Verify current patches apply cleanly
pnpm test

# 3. Sync origin submodule (this updates .en.* files in adev-ja)
pnpm update-origin <commit-hash>
```

## Phase 2: Auto-commit

```bash
# 2a. Origin submodule commit
git add origin
git commit -m "chore: update origin to <commit-hash>"

# 2b. Untranslated files commit (files with no .en counterpart)
git add $(git status --porcelain | grep -E "^\s*M.*\.(md|ts|html|json)$" | grep -v "\.en\." | cut -c4-)
# Only commit if there is anything staged.
git diff --cached --quiet || git commit -m "fix: migrate untranslated files"
```

### 2c. Handle upstream-deleted pages (MANDATORY: `update-origin.ts` does NOT cleanup)

`update-origin.ts` only **copies**. Files that upstream deleted remain in `adev-ja/` as orphans and silently break navigation. List them and decide per file:

```bash
# Enumerate translated files (.en.* exists) whose upstream counterpart is gone.
# (Same idea for untranslated .md without .en.md counterpart.)
```

For each orphan, **inspect the upstream deletion commit** (`git -C origin log --diff-filter=D --oneline -- <path>`) and read its commit message **plus the additions in the same commit** to determine:

- **Deleted = retired**: no replacement → remove from `adev-ja/` (translated `.en.*` + `.md` + untranslated `.md`)
- **Deleted = moved/merged**: replacement exists upstream → record the mapping; if the prior JA translation is salvageable as reference for the replacement, preserve the `.md` as `.md.bak` (same convention as class-d structural). Delete the `.en.md` either way (no upstream original to snapshot).

Commit per outcome:
```bash
git commit -m "chore: remove pages deleted upstream"
git commit -m "chore: preserve removed page translations as .md.bak"  # when applicable
```

Carry the move-target mapping forward to Phase 5.4 (PR body).

## Phase 3: Markdown migration

### 3.1 Classify

```bash
pnpm exec tsx .agents/skills/update-origin/scripts/classify-md-diff.ts > /tmp/md-classification.json
```

Read `/tmp/md-classification.json`. **Group entries by directory** (a directory may contain multiple classes).

### 3.2 Dispatch: directory by directory

For each directory, run every class present **before verifying**. The verifier is directory-scoped, so leaving any class unprocessed within a directory makes verification fail. Roles for different classes within one directory may run in parallel when delegation is available.

| Class | Role | Behavior |
| --- | --- | --- |
| a | `roles/migrate-md-class-a.md` | Verify scope, no `.md` change |
| b | `roles/migrate-md-class-b.md` | Apply small diffs preserving line correspondence |
| c | `roles/migrate-md-class-c.md` | Paragraph-level retranslation |
| d-additive | `roles/defer-md-class-d.md` (additive mode) | Restore prior translation, insert new English sections **as-is** at corresponding positions, then refresh `.en.md` |
| d-structural | `roles/defer-md-class-d.md` (structural mode) | Backup `.md` → `.md.bak`, remove `.en.md`, reset to upstream English (full defer) |

**Class-d sub-classification (mandatory)**: Inspect the diff between old upstream English and new upstream English.

**Default to d-additive.** Only escalate to d-structural when **headings (h2 or h3) are deleted AND the count is ≥3** OR an h2 is deleted (any count). API rename, identifier swap inside fenced code blocks, table-column header changes, prose rewording with same intent, and new section insertion are **NEVER** structural signals: they are class-a/b/c/d-additive work. Quick objective gate before defer:

```bash
# Count deleted headings in the upstream diff.
git -C origin diff <old-hash>..<new-hash> -- <file.md> \
  | grep -E '^-(## |### )' | wc -l
```

If the count is <3 AND no h2 deletion, the file is d-additive. Run the class-d role in additive mode: keep the existing JA translation, insert new English sections at corresponding positions, mirror token renames in prose and tables.

Only when h2 deletion or ≥3 h3 deletions occur, use d-structural (backup `.md` → `.md.bak`, remove `.en.md`, reset to upstream English).

**Read the diff content, not just the +/- counts**: a "+30/-8" hunk where the 8 deletions are pure English rewording counts as additive.

**Special-cased files (use a dedicated role regardless of class)**:

| File | Role | Reason |
| --- | --- | --- |
| `adev-ja/src/content/reference/roadmap.md` | `roles/migrate-md-roadmap.md` | The roadmap accumulates completed work as historical records; in-progress items move to "Completed projects" rather than being replaced. The generic d roles would discard previously translated Completed entries. |

**Do not process files in the orchestrating session itself; use the roles.**

### 3.3 Verify (per directory, after all classes done)

Once every class batch in the directory has reported `status: ok`, run BOTH gates in order:

```bash
# (a) line-count + structural-marker alignment (fences/headings/annotations)
pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>

# (b) code-block content sync: every diff-added line inside fenced code blocks
#     must appear identically in the JA-side .md at the same line index.
pnpm exec tsx .agents/skills/update-origin/scripts/verify-codeblock-sync.ts main
```

Additionally, scan every changed file for stale backtick identifiers (token rename mirror leaks): inline Python equivalent until promoted to a script:

```bash
# For each changed .en.md vs <old-hash> (the origin commit before this sync):
#   removed_tokens = backtick-set(old.en.md) - backtick-set(new.en.md)
#   leftover = removed_tokens ∩ backtick-set(<file>.md)
#   leftover MUST be empty
```

A non-empty `leftover` set indicates the JA side still references identifiers that upstream renamed/removed (e.g. `values` → `value`, `panelId` → `panel`, `readonly` → host-element-application). Apply the rename and re-verify.

Both exit codes MUST be 0. If either fails, stop the workflow and report; do not commit. The codeblock check is a global scan (cheap), not a per-directory scan, so it doubles as a regression gate across all previously committed directories.

### 3.4 Commit per class within the directory

Even though processing is grouped per directory, **commits remain per `(class, directory)`** so git history stays granular. After verify passes, for each class present in the directory (process in alphabetical order: a → b → c → d):

**Commit messages are a public surface. They must describe what changed in the documentation, never the internal class letter, agent name, or script name** (see "Public-surface hygiene" below). Use the message that matches the class, with the class itself left unstated:

```bash
# Stage only the files belonging to that class within this directory
git add <files-of-this-class>

# class a
git commit -m "fix(docs): mirror upstream code and link changes in <directory-relative-to-adev-ja>"
# class b
git commit -m "fix(docs): apply upstream wording changes in <directory-relative-to-adev-ja>"
# class c
git commit -m "fix(docs): retranslate updated sections in <directory-relative-to-adev-ja>"
# class d, additive mode
git commit -m "chore(docs): insert new upstream sections untranslated in <directory-relative-to-adev-ja>"
# class d, structural mode
git commit -m "chore(docs): reset rewritten pages to upstream English in <directory-relative-to-adev-ja>"
```

Repeat 3.2 → 3.4 for each directory until all markdown batches are processed.

## Phase 4: Source-code migration

### 4.1 Classify

```bash
pnpm exec tsx .agents/skills/update-origin/scripts/classify-src-diff.ts > /tmp/src-classification.json
```

**Group entries by directory** (same rationale as Phase 3.1).

### 4.2 Dispatch: directory by directory

For each directory, run every class present before verifying.

| Class | Role | Behavior |
| --- | --- | --- |
| a | `roles/migrate-src-class-a.md` | Mirror code-only changes |
| b | `roles/migrate-src-class-b.md` | Apply ≤5 translatable token changes |
| c | `roles/migrate-src-class-c.md` | Structural + multi-token changes |
| d | `roles/escalate-src-class-d.md` | Escalate to user: do NOT auto-modify |

### 4.3 Verify (per directory)

```bash
pnpm exec tsx .agents/skills/update-origin/scripts/verify-migration.ts <directory>
```

### 4.4 Commit per class within the directory

After verify passes, for each class present (a → b → c, **excluding d**). Same public-surface rule as Phase 3.4: the class letter never appears in the message.

```bash
git add <files-of-this-class>
# class a
git commit -m "fix(app): mirror upstream code changes in <directory-relative-to-adev-ja>"
# class b / c
git commit -m "fix(app): apply upstream changes to translated strings in <directory-relative-to-adev-ja>"
```

For class-d escalations, **stop and report to user**. Do not commit class-d files until the user resolves them.

## Phase 5: Final verification & PR

```bash
# 5.1 Patch / lint full pipeline
pnpm test
pnpm lint

# 5.2 Working tree must be clean
git status --porcelain    # must be empty

# 5.3 Angular.jp-specific configuration sanity check
grep -n "indexName" build/src/environments/environment.ts || true   # if applicable
# Confirm fixed values per "Angular.jp specific configuration rules" in `AGENTS.md`

# 5.4 Push to your own fork and create the PR against angular/angular-ja.
#     Check `git remote -v` first and use the remote that points to your fork.
git push -u <fork-remote> update-origin-<commit-hash>
gh pr create --repo angular/angular-ja --base main --head <fork-owner>:update-origin-<commit-hash> \
  --title "chore: update origin to <commit-hash>" \
  --body "$(cat <<'EOF'
## Summary
Sync angular-ja with upstream angular/angular @ <commit-hash>.

## Scope
- N markdown files and M source files updated against the new upstream English.
- Notable content changes: describe them by what a reader of the site would notice, page by page.

## Removed / moved pages (mandatory section)
For each upstream-deleted file, list: prior JA path → move target upstream path (or "retired"). For preserved `.md.bak`, note their intended re-use (reference for new page translation or archive only). If upstream deleted nothing, say so explicitly.

## Untranslated / deferred (mandatory section)
- New pages copied untranslated this PR: list
- Pages reset to upstream English with the prior translation kept as `.md.bak`: list, with the upstream reason per page
- Pages where new upstream sections were inserted untranslated in place: list

## Test plan
- [x] pnpm test
- [x] pnpm lint
- [x] Line-count and structural-marker parity checked for all `.en.*` / translated pairs
- [x] Fenced code-block content verified identical between English and Japanese for all changed files
- [x] No backtick identifier removed upstream remains on the Japanese side
EOF
)"
```

Note: the PR is created **from `<fork-owner>:<branch>` to `angular/angular-ja:main`** (fork to upstream). The `--repo angular/angular-ja --head <fork-owner>:<branch>` form is required; the bare `--head <branch>` form fails with "No commits between main and <branch>".

## Rules (apply throughout)

- **Never** process per-file migration in the orchestrating session itself. Always go through the roles (delegated, or followed one by one when delegation is unavailable).
- **Never** combine multiple `(class, directory)` batches into one commit.
- **Never** verify until all classes in the directory have been processed (the verifier is directory-scoped).
- **Never** skip `verify-migration.ts`. Its exit code is the gate.
- **Never** edit `.patch` files manually. Use the Safe Patch Update Procedure if patches fail.
- **Always** match `wc -l <file.en.md> <file.md>` exactly for markdown: no exceptions.
- **Always** preserve **line-prefix** docs annotations `IMPORTANT:`, `NOTE:`, `HELPFUL:`, `TIP:`, `CRITICAL:`, `WARNING:`, `TLDR:` literally in uppercase English when they appear at the start of a line (optionally after blockquote `>`). Never lowercase or translate them (no `Tip:`, `重要:`, `警告:`, `ヒント:`). The adev build pipeline relies on these uppercase line-leading markers. The same words appearing inside heading text or mid-sentence are normal prose and may be translated.
- **Always** stop and report on any role report with `status: needs_review` / `aborted` / `escalate`.

## Public-surface hygiene (absolute)

Commit messages, PR titles, and PR bodies are read by upstream maintainers and are permanent in GitHub's history. They must contain **nothing** from this workflow's internal tooling. The following vocabulary is forbidden on those surfaces:

- Class letters and their labels: `class-a`, `md-class-b`, `src-class-c`, `class-d`, `d-additive`, `d-structural`, `md-roadmap`
- Script names: `classify-md-diff.ts`, `classify-src-diff.ts`, `verify-migration.ts`, `verify-codeblock-sync.ts`
- Role names: `migrate-md-class-*`, `defer-md-class-d`, `escalate-src-class-d`, `migrate-src-class-*`, `migrate-md-roadmap`, `prh-terminology`
- Any `.agents/` path, any skill or role name, and any absolute home path
- The word "orchestrator" and other descriptions of the internal agent topology

Describe the work by what changed in the documentation and how it was checked, not by which internal machinery produced it. "Line-count and structural-marker parity checked for all pairs" is publishable; "verify-migration.ts exits 0" is not.

Every commit message this workflow writes is subject to this rule. Applying it after the fact requires rewriting history on a pushed branch, which leaves the original text reachable through the PR's force-push timeline, so the leak is never fully undone. Get it right on the first commit.

## Prose style (applies to PR bodies and any Japanese output)

- Never use an em dash (`—`). Use a colon, parentheses, or a separate sentence.
- Avoid the punctuation habits that mark machine-generated text: em-dash asides, "not X, but Y" parallelism as a tic, and decorative arrows in prose.

## Scripts (in `scripts/` of this skill)

- `scripts/classify-md-diff.ts`: markdown diff classifier
- `scripts/classify-src-diff.ts`: source-code diff classifier
- `scripts/verify-migration.ts`: deterministic verifier (presence + line count + structural-marker alignment)
- `scripts/verify-codeblock-sync.ts`: verifies that every diff-added line inside fenced code blocks is mirrored to the JA-side `.md`

## Roles (in `roles/` of this skill)

- `roles/migrate-md-class-{a,b,c}.md`, `roles/defer-md-class-d.md`, `roles/migrate-md-roadmap.md`
- `roles/migrate-src-class-{a,b,c}.md`, `roles/escalate-src-class-d.md`
