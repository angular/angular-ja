# AGENTS.md

Guidance for AI coding agents working in this repository. Skills are in Agent Skills format under `.agents/skills/<name>/SKILL.md`.

## Project Overview

This is the Japanese translation project for Angular's official documentation site (angular.dev). The repository translates Angular documentation from English to Japanese and hosts the localized site at https://angular.jp.

For contributor-facing background, see [CONTRIBUTING.md](./CONTRIBUTING.md) (setup, translation flow, guidelines), [UPDATE_ORIGIN.md](./UPDATE_ORIGIN.md) (manual origin update), and [docs/TRANSLATION_WITH_AI.md](./docs/TRANSLATION_WITH_AI.md) (AI translation tool). This file adds the rules agents must follow.

## Repository Architecture

### Submodule Structure

- `origin/`: Git submodule containing the upstream `angular/angular` repository
- `adev-ja/`: Japanese localized version containing both original English files (`.en.md`, `.en.ts`) and their Japanese translations (`.md`, `.ts`)
- `tools/`: Build and translation automation tools

### Translation File Patterns

- **English source files**: `filename.en.md`, `filename.en.ts`, `filename.en.json` (snapshots of original content at translation time)
- **Japanese translated files**: `filename.md`, `filename.ts`, `filename.json` (localized versions)
- **Content location**: Primarily in `adev-ja/src/content/` for Markdown documentation
- **Tutorial structure**: Interactive tutorials contain both content files (`README.md`) and configuration files (`config.json`) defining page titles and editor settings

### Build System

The project uses a custom TypeScript-based build system with Bazel integration:

- Build initialization copies and patches files from `origin/adev/` to `build/` directory
- Applies localization patches from `tools/adev-patches/`
- Japanese content from `adev-ja/` overlays the build structure

## Skills

Workflow automation lives in `.agents/skills/`. Use the skills below before reaching for ad-hoc shell commands or new tooling.

| Skill | Purpose | When to use |
| --- | --- | --- |
| `.agents/skills/update-origin/SKILL.md` | Single entry point for syncing upstream `angular/angular` into `adev-ja`. Covers branch, submodule update, diff classification, migration by role, verification, per-class commits, and PR. | Any origin sync. Never perform per-file migration in the orchestrating session itself; follow the role files in `roles/`. |
| `.agents/skills/translate-file/SKILL.md` | First-time translation of a new `.en.md` / `.en.ts` / `.en.json` file into Japanese with strict line-count and anchor-ID rules. | A file is added upstream and you are ready to translate it. NOT for diff sync of an already-translated file (that is the `update-origin` flow). |
| `.agents/skills/prh-terminology/SKILL.md` | Manage the `prh.yml` terminology dictionary. | **Always before adopting a translation for a new technical term** (see "Terminology management" below). |

### Roles used by update-origin (`.agents/skills/update-origin/roles/`)

These are instruction files for one batch of work each. If your harness supports delegating to sub-agents, pass the file as the instructions; otherwise follow it yourself in sequence. They are only used by the `update-origin` skill.

| Role | Purpose |
| --- | --- |
| `migrate-md-class-a.md` | Mirror low-risk markdown changes (code blocks, URLs, prose backtick identifiers). |
| `migrate-md-class-b.md` | Apply small line-localized markdown diffs preserving line correspondence. |
| `migrate-md-class-c.md` | Paragraph-level retranslation. |
| `defer-md-class-d.md` | Class-d defer in either `d-additive` or `d-structural` mode. |
| `migrate-md-roadmap.md` | Special handler for `reference/roadmap.md` (Completed-projects history accumulation). |
| `migrate-src-class-{a,b,c}.md` | Source-code (`.ts` / `.html` / `.json`) migration in three risk tiers. |
| `escalate-src-class-d.md` | Stops the workflow and reports class-d source files for resolution by a person. |

### Skill scripts (`.agents/skills/update-origin/scripts/`)

Run with `pnpm exec tsx <script>`.

| Script | Role |
| --- | --- |
| `classify-md-diff.ts` | Classifies each changed `.en.md` into class a/b/c/d. |
| `classify-src-diff.ts` | Same for source files. |
| `verify-migration.ts` | Hard gate: file presence, `wc -l` parity, structural-marker alignment (fences / headings / annotation prefixes). Use `--base <ref>` to scope the structural check (default `main`). |
| `verify-codeblock-sync.ts` | Hard gate: every diff-added line inside fenced code blocks must appear verbatim at the same line index in the JA `.md`. Catches class-a mirror omissions. |

## Essential Commands

### Development Workflow

```bash
# Initial setup and build (takes ~15 minutes first time)
pnpm install
pnpm build

# Start development server (http://localhost:4201)
# Always use pnpm start. Invoking Bazel targets directly (//adev:serve etc.) is prohibited.
pnpm start

# Force clean initialization and start
pnpm start --init

# Build for production
pnpm build

# Build without initialization
pnpm build --no-init
```

### Translation Management

```bash
# Update origin submodule to specific commit
pnpm update-origin <commit-hash>

# Update origin submodule without hash (re-copy current files)
pnpm update-origin

# List files that haven't been translated yet
pnpm run list-untranslated
```

### Quality Assurance

```bash
# Lint Japanese text using textlint
pnpm lint

# Fix automatically fixable lint issues
pnpm lint --fix

# Test patch application
pnpm test

# Enhanced patch testing for migrations
pnpm test && pnpm build --no-init  # Full pipeline validation
```

**Command clarification:**

- `pnpm test`: verifies all patches apply correctly to origin files (technical validation)
- `pnpm lint`: checks Japanese text quality using textlint rules (content validation)
- When someone mentions "test failures", determine the context: patch application vs text quality issues

**Enhanced patch testing workflow.** When working with patch system changes:

1. **Pre-migration validation**: run `pnpm test` to ensure current patches apply cleanly
2. **Post-change validation**: run `pnpm test` to verify new/modified patches work
3. **Full pipeline verification**: run `pnpm build --no-init` to ensure patches integrate correctly with the build system
4. **Incremental testing**: test individual patches by temporarily moving others out of `tools/adev-patches/`

## Cross-Platform Command Verification

**CRITICAL: Verify that commands work on both macOS and Linux before using them in CI/CD workflows.**

### Shell command platform compatibility

When writing shell commands that will run in CI (Linux environment):

1. **Test locally first**: verify the command works on your development machine
2. **Check man pages**: use `man [command]` to verify flag compatibility across platforms
3. **Prefer POSIX-compliant syntax**: avoid platform-specific flags when possible
4. **Search for cross-platform alternatives**: search "Linux [command] equivalent to macOS -flag" when encountering compatibility issues

### Common platform differences

- **chmod symlink handling**: macOS uses `-H`, Linux requires the `find -L` pattern
- **find command**: the `-L` flag works on both platforms for symlink traversal
- **sed command**: macOS requires `-i ''`, Linux uses `-i` (use your editor's edit function instead to avoid this)
- **grep options**: some GNU grep extensions are not available in macOS BSD grep

### Verification workflow

Before committing commands for CI workflows:

1. Test the command locally
2. Check `man [command]` for flag descriptions
3. Search "[command] macOS Linux compatibility" if using non-standard flags
4. Prefer portable alternatives (e.g., `find -exec` over `xargs` when possible)

**Example**: making Bazel symlink outputs writable:

- Bad: `chmod -RH +w` (macOS specific, fails on Linux)
- Good: `find -L ${dir} -type f -exec chmod +w {} +` (works on both platforms)

## Translation Workflow Patterns

### Origin update process

**Single entry point**: the `update-origin` skill (`.agents/skills/update-origin/SKILL.md`), started with the upstream commit hash.

All steps (branch creation, origin sync, diff classification, role-based migration, deterministic verification, per-directory commits, PR creation) are defined there. Do NOT perform per-file migration in the orchestrating session itself; follow the role files so that context stays isolated.

**Key invariants enforced by the skill:**

- `wc -l <file.en.md> <file.md>` must be identical for every markdown pair.
- **Structural-marker alignment**: fenced code fences, headings, and line-prefix docs annotations sit at the same line index on both sides (verified by `verify-migration.ts`).
- **Code-block content sync**: every diff-added line inside a fenced code block must be mirrored verbatim to the JA-side `.md` at the same line index (verified by `verify-codeblock-sync.ts`).
- Each `(class, directory)` batch is one commit. Never combine.
- Files are classified into a/b/c/d by `classify-md-diff.ts` / `classify-src-diff.ts`. Class-d markdown splits into **d-additive** (preserve existing JA translation, insert new English sections at corresponding positions) and **d-structural** (full defer to upstream English; `.md.bak` retains prior translation). The orchestrator picks the mode by inspecting the actual diff content, not just +/- counts. Class-d source escalates to a person.
- `roadmap.md` has its own dedicated role (`migrate-md-roadmap.md`) because it accumulates "Completed projects" history that the generic class roles would discard.
- Patch failures use the Safe Patch Update Procedure (see below). Never edit `.patch` files manually.

### Translation file management

- **CRITICAL**: `pnpm run translate` is for NEW file translations only. Do NOT use it to apply diffs to existing translations.
- Copy the English file to its `.en.*` version when starting a new translation (applies to `.md`, `.ts`, `.json` files)
- Maintain line-by-line correspondence between English and Japanese files for easier diff tracking
- Preserve technical terms in English where appropriate
- Add explicit heading IDs using `{#heading-id}` syntax for cross-reference compatibility
- **File completeness requirement**: every translated file must have a corresponding `.en.*` backup file
- **Translation persistence**: some file types may be auto-reverted by build processes or linters. Verify translations persist after build/lint operations.

#### Understanding `.en.*` files

**CRITICAL: `.en.*` files are created ONLY when a Japanese translation exists.**

- **New English files from upstream** (e.g., `injectors.md`): keep the original filename, do NOT rename to `.en.md`
- **`.en.*` files purpose**: backup snapshots of the English source at translation time, created when the Japanese translation is ready
- **When to create `.en.*` files**: only after translating the file. Copy the English source to the `.en.*` version simultaneously with creating the Japanese version.
- **Example workflow**:
  - Upstream adds `new-feature.md` → copy to `adev-ja/src/content/new-feature.md` (no `.en.md` yet)
  - Ready to translate → create `new-feature.en.md` (English backup) + `new-feature.md` (Japanese translation) together
- **Never**: rename untranslated English files to `.en.*`. This breaks the localization workflow.

#### Excluding files from translation

When certain files should NOT be localized (e.g., placeholder pages, deprecated content):

1. **Add an exclusion pattern** to `tools/update-origin.ts` in the `localizedFilePatterns` array using negation syntax (`!path/to/file`)
2. **Remove the existing file** from `adev-ja/` if it was previously copied
3. **Example**: to exclude `src/content/reference/concepts/overview.md`:
   ```typescript
   [
     'src/content/**/*.md',
     '!src/content/**/license.md',
     '!src/content/kitchen-sink.md',
     '!src/content/reference/concepts/overview.md', // ← Add here
   ]
   ```
4. **Commit the changes**: remove the file from `adev-ja` and update `update-origin.ts` in the same commit

**Important**: use exact file paths for exclusions. Do NOT use glob patterns unless explicitly intending to exclude multiple files.

### AI translation integration

The project includes an AI translation tool using the Google Gemini API (details: [docs/TRANSLATION_WITH_AI.md](./docs/TRANSLATION_WITH_AI.md)):

- **Correct command**: `pnpm run translate path/to/file.md`
- **With auto-save**: `pnpm run translate -w path/to/file.md`
- Processes Markdown files in heading-based blocks
- Applies two-stage processing: translation → proofreading
- Integrates with textlint for quality assurance
- Handles rate limiting and progress tracking
- The tool automatically creates `.en.md` backup files and validates line count

#### Translation tool post-execution validation

翻訳ツール (`pnpm run translate`) 実行後、**必ず以下を検証**:

1. **`.en.md` ファイルが英語原文であることを確認**
   - 日本語が1文字でも含まれていたら翻訳ツールのバグ
   - `head -5 filename.en.md` で先頭行を確認し、英語であることを検証
   - 異常検知時は即座に `cp origin/adev/src/content/path/to/file.md adev-ja/path/to/file.en.md` で修正
2. **ナビゲーションラベルと h1 見出しの一致確認**
   - `sub-navigation-data.ts` の label と翻訳ファイルの h1 が一致するか確認
   - 不一致の場合、プロジェクト標準 (ナビゲーションラベル) に合わせて修正
   - 確認コマンド: `grep -A2 "path: 'guide/path/to/file'" adev-ja/src/app/routing/sub-navigation-data.ts`
3. **行数の最終確認**
   - `wc -l file.md file.en.md` で行数が完全一致することを確認

明白な異常 (`.en.md` に日本語、行数不一致など) を発見したら、確認を待たずに上記の標準手順で修正する。

### Patch-based localization system

The project uses git patches to apply Japanese-specific modifications to the upstream Angular codebase:

- Patches are stored in `tools/adev-patches/*.patch` and applied during the build process
- When upstream changes occur, patches may fail and require manual updating
- Use `pnpm test` (alias for `pnpm run test:patch`) to verify all patches apply correctly
- Critical rule: never manually edit patch file newlines, as this frequently corrupts the patch format
- Patches handle UI text translations, styling adjustments, and Japanese-specific functionality

#### Patch file naming conventions

- **UI translations**: `translate-[component-name].patch` (e.g., `translate-navigation.patch`, `translate-tutorial-label.patch`)
- **Bug fixes**: `fix-[issue-description].patch` (e.g., `fix-canonical-host.patch`)
- **Feature additions**: `add-[feature-name].patch` (e.g., `add-global-styles.patch`)
- **Value replacements**: `replace-[target].patch` (e.g., `replace-environment-values.patch`)

#### File vs patch migration decision matrix

**Use the patch system when:**

- The file contains UI text that rarely changes structurally
- The file is a single component with isolated translations
- Upstream changes are typically additive rather than structural
- The file has minimal Japanese-specific logic beyond text translation

**Keep separate files when:**

- The file contains extensive Japanese-specific content or logic
- The file structure differs significantly from upstream
- The file is frequently modified with complex translation needs
- The file is part of content management (`.md` files in `adev-ja/src/content/`)

#### Safe patch update procedure

When upstream changes break existing patches:

1. **Navigate to the origin directory**: `cd origin`
2. **Apply the required changes**: edit the target files to match the desired patch outcome
3. **Generate the new patch**: `git diff -- [target-files] > ../tools/adev-patches/[patch-name].patch`
4. **Restore the original files**: `git checkout -- [target-files]` (inside the `origin` submodule only)
5. **Return to the root and test**: `cd .. && pnpm test`

This approach prevents patch file corruption and ensures clean patch generation.

#### Angular.jp specific configuration rules

**CRITICAL: Angular.jp uses project-specific configurations that differ from upstream Angular.**

The following configurations MUST use fixed values, NOT dynamic generation:

- **`environment.ts` indexName**: `'angular_jp_v19'`
  - Upstream uses: `indexName: indexName` (dynamic variable)
  - Angular.jp uses: `indexName: 'angular_jp_v19'` (fixed string)
  - Reason: Angular.jp uses a dedicated Algolia index separate from upstream

**Patch update guidelines:**

- **ALWAYS review existing patch files** before modifying them to understand Angular.jp-specific requirements
- **DO NOT blindly apply upstream implementations**: Angular.jp requirements take precedence
- **VERIFY configurations** after patch updates to ensure Angular.jp-specific values are preserved
- **ASK the maintainers if uncertain** about whether to use the upstream or the Angular.jp-specific implementation

**Common mistakes to avoid:**

- Assuming upstream's dynamic configuration should be used in Angular.jp
- Updating patches without checking existing Angular.jp-specific customizations
- Skipping verification of configuration values after patch updates

#### Migrating files to/from the patch system

**Migrating TO the patch system:**

1. Follow the safe patch update procedure to create the patch
2. **Update build configuration**: remove migrated files from the `tools/update-origin.ts` `localizedFilePatterns` array
3. **Remove original files**: delete both `.html`/`.ts` and `.en.html`/`.en.ts` versions from `adev-ja/`
4. **Test the full pipeline**: run `pnpm test` and `pnpm build --no-init` to verify patch system integration

**Migrating FROM the patch system:**

1. **Add to build configuration**: include the files in the `tools/update-origin.ts` `localizedFilePatterns` array
2. **Create the file structure**: copy the upstream file to `adev-ja/` and create the `.en.*` backup version
3. **Remove the patch**: delete the corresponding patch file from `tools/adev-patches/`
4. **Apply translations**: use the appropriate translation tools to localize the separated files

## Key Technical Files

### Build configuration

- `tools/build.ts`: main build orchestration
- `tools/lib/setup.ts`: environment initialization and patching
- `tools/adev-patches/*.patch`: localization patches applied to Angular source

### Translation tools

- `tools/translator/`: AI-powered translation system
- `tools/update-origin.ts`: origin submodule sync management
- `.textlintrc`: Japanese text quality rules
- `prh.yml`: terminology consistency rules

### Content structure

- `adev-ja/src/content/`: main documentation content
- `adev-ja/src/app/sub-navigation-data.ts`: navigation configuration
- `adev-ja/shared-docs/components/`: shared UI component translations

## Important Development Notes

### Background process management

When working with long-running commands (build, lint, etc.):

- **Immediate cleanup**: stop unnecessary background processes as soon as the task is done to prevent resource waste
- **Process monitoring**: check a process's status before stopping it
- **Selective execution**: run only the commands required for the current task; avoid running parallel builds/lints unless specifically needed
- **Example cleanup pattern**: after successful build verification, stop any redundant build processes running in the background

### macOS file descriptor limits

On macOS, build processes may exhaust file descriptors. If builds fail, increase limits:

```bash
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536
```

### Translation guidelines

- Maintain the original line count for easy diffing
- Follow Japanese technical writing standards (textlint enforced)
- Use katakana for foreign terms following Ministry of Education guidelines
- Add explicit heading IDs `{#id}` when translating headings to preserve cross-references
- Remove all symbols except hyphens from heading IDs (e.g., `{#providing-context-with-llms.txt}` becomes `{#providing-context-with-llmstxt}`)
- For bullet points: add periods for complete sentences, omit for noun phrases

#### MANDATORY: Source text verification before translation

**CRITICAL: Always read the English source (`.en.*`) file BEFORE translating or modifying Japanese text.**

1. **Before any translation work**: read the corresponding `.en.*` file first to understand the original meaning and context
2. **When evaluating translation quality**: never judge "naturalness" or "correctness" from the Japanese text alone; always compare with the English source
3. **When fixing translations**: always show the format `原文: [English] → 訳: [Japanese]` to demonstrate source verification
4. **Prohibited actions**:
   - Modifying Japanese text based on "what sounds natural" without checking the source
   - Guessing the English source and translating based on assumptions
   - Agreeing with a claim about the translation before actually reading the source text
5. **Required pattern**: read the `.en.*` file → understand the source meaning → apply an accurate translation → verify line count

#### Anchor ID addition workflow

When adding anchor IDs to Japanese headings (typically triggered by CI build errors):

1. **Reference the English version**: check the corresponding `.en.md` file for the proper anchor ID format
2. **Comprehensive coverage**: add anchor IDs to ALL `##` and `###` level headings in the file, not selectively
3. **Kebab-case format**: use English-based kebab-case for anchor IDs (e.g., `{#enable-reactive-forms-for-your-project}`)
4. **Skip top-level headings**: do NOT add anchor IDs to `#` (h1) page title headings
5. **Commit immediately**: use the `fix(docs): add anchor IDs to all headings in [filename]` commit message format

## Translation Rules Reference

### Markdown syntax rules

- **Italic formatting**: use asterisk syntax `*text*` instead of underscore `_text_`, because underscore syntax doesn't parse correctly when there are no spaces around Japanese text
- **HTML entity encoding**: apply proper encoding for special characters (emojis, underscores) for better compatibility
- **Line-prefix docs annotations**: when a line begins with `IMPORTANT:`, `NOTE:`, `HELPFUL:`, `TIP:`, `CRITICAL:`, `WARNING:`, or `TLDR:` (optionally after blockquote `>` markers), the prefix is a callout marker recognized by the adev build pipeline. Keep it literal in uppercase English (`IMPORTANT: …`); translate only the body after the colon. Never lowercase or translate the prefix (no `Tip:`, `重要:`, `警告:`, `ヒント:`). The same words appearing inside a heading or mid-sentence are normal prose and may be translated naturally. Verified by the annotation-prefix drift check in `verify-migration.ts`.

### Standardized terminology

- "essentials guide" → "基本ガイド" (not "必須ガイド")
- "source-of-truth" → "真の情報源" (not "真実の源")
- "eagerly" → "即座に" (when used in contrast to lazy loading)
- "Available Now:" → "最新情報:" (for UI labels, more friendly than the literal "利用可能:")

### File-type specific translation patterns

- **HTML files**: translate text content and labels; preserve Angular directives, classes, and routing paths
- **TypeScript files**: translate `label` fields in navigation; keep `path`/`contentPath` exact; translate `action` descriptions in migrations
- **JSON files**: translate user-facing strings; preserve technical identifiers and configuration values

### Translation quality guidelines

When fixing textlint errors for redundant expressions:

- **冗長表現の修正**: 「することもできます」→「たり...たりできます」など、文脈に応じて自然な表現に変更
- **意味の保持**: 単純な文字列置換ではなく、元の文章の意味と可能性の表現を保つ
- **自然な日本語**: 「〜も使用できます」「〜も利用します」など、より読みやすい表現を選択
- **文全体の調和**: 個別の修正が文章全体の流れや論理構造を損なわないよう配慮

### Terminology management

**CRITICAL: Follow the `prh-terminology` skill (`.agents/skills/prh-terminology/SKILL.md`) for translation terminology consistency.**

The project maintains a terminology dictionary in `prh.yml`.

- **Before any translation work**: check existing terminology rules
- **For new technical terms**: determine a consistent Japanese translation
- **For katakana standardization**: verify long vowel marks and spelling
- **When adding terminology**: create new rules for project-wide consistency
- **For uncertain translations**: look up the existing rules for Angular-specific terms first

Key categories:

- **English preservation**: Promise, Observable, Signal, Component
- **Japanese standardization**: 依存性の注入, 変更検知, 遅延読み込み
- **Katakana consistency**: サーバー, ユーザー, アプリケーション (with long vowel marks)

**Rule**: never guess terminology. Consult `prh.yml` through the skill to maintain project-wide consistency.

## Community and Support

- Translation discussions occur in the Angular Japan User Group Discord `#翻訳` channel
- Create issues for coordination using the "Translation Checkout" label
- Pull requests require review and textlint compliance before merging

## Git Workflow

- The repository has strict rules preventing direct pushes to the main branch and merge commits
- Push your branch to your own fork and open the pull request from the fork to `angular/angular-ja:main`
- Run `git remote -v` to confirm which remote points to your fork before pushing

### Git operations pre-check protocol

**CRITICAL: ALWAYS verify git state BEFORE executing git operations.**

Before any git commit, push, or PR creation:

1. **Check staged changes**: run `git diff --cached` to see exactly what will be committed
2. **Verify the branch name**: run `git branch --show-current` to confirm you're on the correct branch
3. **Verify the remote before push**: run `git remote -v` to confirm the remote points to your fork
4. **Review commit scope**: ensure staged changes are logically related (e.g., don't mix patch updates with translation changes)
5. **Separate unrelated changes**: if multiple unrelated changes are staged, reset and commit them separately

**Common failure patterns to avoid:**

- Committing without checking staged changes
- Creating commits that mix multiple unrelated concerns
- Pushing to the wrong remote or branch
- Creating PRs without verifying commit contents

**Required commands before git operations:**

```bash
# Before commit
git diff --cached        # Verify staged changes
git status               # Check overall state

# Before push
git log -1               # Verify last commit message and changes
git branch --show-current  # Confirm branch name

# Before PR creation
git log <angular-ja-remote>/main..HEAD  # Review all commits in PR
```

### Commit and PR conventions

- **Commit messages**: use conventional commit format (`feat(docs): translate ... to Japanese`)
- **NO AI attribution**: never include AI co-author credits, AI tool references, or generated-by statements in:
  - Commit messages
  - PR titles
  - PR descriptions
- Keep commit messages and PR content clean and professional without AI tool acknowledgments

### PR creation process

When creating pull requests for translations:

**MANDATORY pre-PR checklist:**

1. **Search for related issues FIRST**: run `gh issue list --search "filename"` or check Translation Checkout issues
   - Template fields exist for a reason: never write "N/A" without actually checking
   - Each checkbox represents a project requirement, not an optional suggestion
2. **Verify all quality requirements**: run `pnpm lint` and check that line counts match

**PR creation steps:**

1. **Branch naming**: use the `translate/<content-area>` pattern (e.g., `translate/ai-design-patterns`)
2. **Template compliance**: all PRs must follow the `.github/pull_request_template.md` structure:
   - Include the translation checklist with checkboxes for guidelines and line count verification
   - Fill "関連Issue" with `close #<issue-number>` if a related issue exists
   - List translated files in the "備考" (remarks) section
   - Keep additional details minimal: only essential file lists are needed
3. **Fork workflow**: push to your own fork (not to `angular/angular-ja` directly) and open the PR against `angular/angular-ja:main`

For origin syncs, the PR body and commit messages follow the "Public-surface hygiene" section of the `update-origin` skill.

## Development Environment

The project requires:

- Node.js (version in `.node-version`)
- pnpm (version in the `packageManager` field of `package.json`)
- Bazel (installed automatically during build)
- For AI translation: a Google API key with Gemini access

### Tool version requirements

**CRITICAL**: some project tools have minimum version requirements that prevent functionality:

- **gh CLI**: requires v2.82.1+ due to the GitHub Projects (classic) deprecation (as of 2025-10)
  - Symptoms: `gh pr edit` fails with a "GraphQL: Projects (classic) is being deprecated" error
  - Solution: upgrade the gh CLI with your package manager
- When CLI commands fail with cryptic errors, check tool versions FIRST before troubleshooting

### Problem-solving protocol for technical errors

When encountering technical errors (CLI failures, API errors, etc.):

1. **FIRST: search the web** to check whether it is a known issue with a documented solution
2. **SECOND: check `--help`** to verify you're using the command correctly
3. **THIRD: try alternative approaches**, only after confirming no known solution exists
4. **NEVER: keep retrying without research**

**Prohibited:**

- Using `git checkout` or `git stash` while investigating build errors (uncommitted changes would be lost)
- Operations that leave the current branch
