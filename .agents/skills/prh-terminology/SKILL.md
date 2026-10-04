---
name: prh-terminology
description: "Manage the translation terminology dictionary prh.yml for consistent Angular-ja documentation. Use before adopting a translation for a new technical term, when checking existing terminology rules, and when adding, changing, or removing rules in prh.yml."
---

# prh-terminology: Terminology dictionary management

Maintain the Angular-ja project's translation terminology dictionary in `prh.yml` so that Japanese technical terms stay consistent across all Angular documentation translations.

**Rule**: Never guess terminology. Check `prh.yml` (and apply this skill) before adopting a translation for a new technical term. Typical moments:

- Before any translation work: check the existing rules for the terms in the file.
- For a new technical term: decide a consistent Japanese form.
- For katakana standardization: verify long vowel marks and spelling.
- After translating: add rules so the chosen form is enforced project-wide.

## prh.yml structure overview

The `prh.yml` file uses the prh (Proofreading Helper) format to enforce consistent terminology:

```yaml
version: 1
imports:
  - path: ./node_modules/prh/prh-rules/files/markdown.yml
rules:
  - expected: 正しい表記        # Preferred term
    pattern:                   # Terms to replace
      - 間違った表記1
      - 間違った表記2
    options:                   # Optional settings
      wordBoundary: true       # Match whole words only
```

## Rule categories

### 1. 言い換え (Paraphrasing rules)

Standardizes Japanese technical expressions.

- "依存性の注入" (preferred) vs "依存関係の注入" (to replace)
- "変更検知" (preferred) vs "変更検出" (to replace)

### 2. カタカナ語 (Katakana rules)

Enforces consistent katakana spelling and English preservation.

- **Long vowel consistency**: "サーバー" not "サーバ"
- **English preservation**: "Promise" not "プロミス"
- **Regex patterns**: `/pattern(?!suffix)/` to match specific cases

## How to add or modify rules

### Simple paraphrasing rule

```yaml
- expected: 推奨される表記
  pattern:
    - 置き換える表記1
    - 置き換える表記2
```

### Katakana consistency rule

```yaml
- expected: サーバー
  pattern: /サーバ(?!ー)/    # Matches "サーバ" not followed by "ー"
```

### English preservation rule

```yaml
- expected: Promise
  pattern: プロミス
```

### Complex regex rule

```yaml
- expected: ため
  pattern: /(行|作)?為(?!替)/
  regexpMustEmpty: $1        # Captured group must be empty
```

### Word boundary rule

```yaml
- expected: Service Worker
  pattern:
    - サービスワーカー
  options:
    wordBoundary: true       # Match whole words only
```

## Management procedures

### Add a new rule

1. **Identify category**: paraphrasing or katakana.
2. **Determine the preferred form**: based on project standards.
3. **List incorrect forms**: common variations to replace.
4. **Add appropriate options**: `wordBoundary`, regex patterns.

### Modify an existing rule

1. **Locate the existing rule**: search by expected term.
2. **Update patterns**: add or remove incorrect forms.
3. **Adjust options**: modify regex or boundary settings.
4. **Test impact**: consider existing translations.

### Remove a rule

1. **Verify necessity**: confirm the rule is no longer needed.
2. **Check dependencies**: ensure no conflicts with existing translations.
3. **Document the reason**: give a clear justification for the removal.

## Angular-specific terminology guidelines

### Technical terms (keep in English)

- Component, Directive, Service, Pipe
- Promise, Observable, Signal
- Router, Guard, Resolver

### Japanese translations (standardize)

- "依存性の注入" for Dependency Injection
- "変更検知" for Change Detection
- "遅延読み込み" for Lazy Loading

### Katakana consistency

- Long vowel marks: アプリケーション, サーバー, ユーザー
- Short forms: ブラウザ (not ブラウザー)

## Validation process

After modifying `prh.yml`:

1. **Test with prh**: verify the syntax is valid.
2. **Run textlint** (`pnpm lint`): check integration with linting.
3. **Test on sample files**: verify the rules work correctly.
4. **Document changes**: update the rule rationale.

## Best practices

1. **Consistency first**: align with existing project terminology.
2. **Community input**: consider Angular-ja community preferences.
3. **Technical accuracy**: maintain precision in technical terms.
4. **Readability**: balance consistency with natural Japanese.
5. **Incremental changes**: add rules gradually to avoid disruption.

Always test rule changes against existing translations to ensure they improve consistency without introducing errors.
