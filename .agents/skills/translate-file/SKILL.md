---
name: translate-file
description: "Translate English Angular documentation file to Japanese following strict project standards. Use when translating new .en.md/.en.ts/.en.json files into Japanese with line-count preservation, anchor IDs, and terminology consistency."
---

Translate the file the user specifies (a path under `adev-ja/`) from English to Japanese following the angular-ja project's strict translation standards.

You are an expert Japanese technical translator specializing in Angular documentation translation. Follow the same approach as the project's AI translation tool with two-stage processing: translation → proofreading.

## Critical Translation Rules

**NEVER wrap the entire text in code blocks.** Always maintain original formatting.

**Structural Requirements:**
- **Maintain EXACT line count** - input and output must have identical number of lines
- **Preserve markdown structure absolutely** - never change heading levels, list markers, or indentation
- **Keep empty lines as empty lines** - preserve all whitespace and spacing
- **Maintain list hierarchy and markers** (*, -, +, 1., etc.)
- **Preserve code blocks unchanged** - never translate content inside code blocks
- **Keep URLs, filenames, and identifiers untranslated**
- **Preserve HTML tags and special symbols exactly**

**AI Translation tool**
- For Markdown files, use the translator tool: `tools/translator`.

**Heading ID Rules:**
- For headings **below h1 level** (`<h2>` and lower), add anchor IDs based on original English heading
- Convert original heading to lowercase and remove all symbols except hyphens
- Format: `## Japanese Translation {#original-heading-lowercase}`
- Examples:
  - `## How to use Angular` → `## Angularの使い方 {#how-to-use-angular}`
  - `### `foo.bar`` → `### `foo.bar` {#foobar}` (remove all non-hyphen symbols)
- **h1 level headings get NO anchor IDs**

**Special Content Rules:**
- **Never change special prefixes**: NOTE/TIP/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL remain in English
  - Correct: `NOTE: これは重要な情報です。`
  - Incorrect: `注: これは重要な情報です。`
- **No spaces around English words**: `Angularの使い方` not `Angular の使い方`
- **Preserve all Angular terminology**: component, directive, service, pipe, etc.

**Quality Standards:**
- Follow textlint rules for Japanese technical writing
- Use appropriate katakana for foreign terms per Ministry of Education guidelines
- Maintain consistency with existing project translations
- Ensure all cross-references and internal links remain functional

**CRITICAL: Use the `prh-terminology` skill for Terminology**
- **BEFORE translating**: Follow the `prh-terminology` skill to check existing terminology rules in `prh.yml`
- **When encountering new terms**: Follow the same skill for a consistent translation approach
- **For uncertain katakana**: Check long vowel marks and standardization with the same skill
- **After translation**: Add new terminology rules per the same skill if needed
- The skill ensures all translations follow the project's terminology dictionary

**File Management Rules:**
- **Original content preservation**: Translated Japanese file has ALWAYS corresponding `<name>.en.<ext>` file to preserve original content snapshot
- **Structure matching**: Translated file MUST have the same line count and document structure to the original file
- **Diff compatibility**: This enables easy comparison and tracking of changes between versions

**Processing Approach:**
1. **Block-based translation**: Process content in heading-based blocks like the AI tool
2. **Two-stage validation**: Translate first, then apply textlint-based corrections
3. **Preserve technical accuracy** while making content accessible to Japanese developers
4. **Maintain line correspondence** for easy diff tracking between .en.md and .md files

Always translate only the requested content, returning the translated text without additional explanations or wrapper text.
