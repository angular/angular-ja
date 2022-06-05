# IDでロケールを参照

Angularは、テキスト文字列を国際化するのに必要な正しいロケールデータを見つけるために、Unicode*ロケール識別子* \(Unicode locale ID\)を使用します。

<div class="callout is-helpful">

<header>Unicode locale ID</header>

*   ロケールIDは [Unicode Common Locale Data Repository (CLDR) core specification][UnicodeCldrDevelopmentCoreSpecification]に準拠する。
    ロケールIDの詳細については、[Unicode言語とロケール識別子][UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798]を参照してください。

*   CLDRとAngularは、ロケールIDのベースとして[BCP 47 タグ][RfcEditorInfoBcp47]を使用します。

</div>

ロケールIDは、言語、国、およびさらなる変種や細分化のためのオプショナルコードを指定します。
ロケールIDは、言語識別子、ハイフン\(`-`\)文字、ロケール拡張子から構成されます。

<code-example>

{language_id}-{locale_extension}

</code-example>

<div class="alert is-helpful">

Angularプロジェクトを正確に翻訳するためには、国際化の対象となる言語とロケールを決定する必要があります。

多くの国では、同じ言語を共有していても、使い方が異なります。その違いは、文法、句読点、通貨、小数、日付の形式など多岐にわたります。

</div>

このガイドの例では、次の言語とロケールを使用します。

| 言語 | ロケール                   | Unicode locale ID |
|:---      |:---                      |:---               |
| 英語  | カナダ                   | `en-CA`           |
| 英語  | アメリカ合衆国 | `en-US`           |
| フランス語   | カナダ                   | `fr-CA`           |
| フランス語   | フランス                   | `fr-FR`           |

[Angularリポジトリ][GithubAngularAngularTreeMasterPackagesCommonLocales]には、一般的なロケールが含まれています。

<div class="callout is-helpful">

言語コードの一覧は、[ISO 639-2][LocStandardsIso6392]を参照してください。

</div>

## ソースロケールIDを設定する

Angular CLIを使用して、コンポーネントのテンプレートとコードを記述するソース言語を設定します。

デフォルトで、Angularはプロジェクトのソースロケールとして`en-US`を使用します。

ビルドに使用するプロジェクトのソースロケールを変更するには、次の操作を実行します。

1.  [`angular.json`][AioGuideWorkspaceConfig]ワークスペースのビルド設定ファイルを開いてください。
1.  `sourceLocale`フィールドのソースロケールを変更してください。

## 次のステップ

*   [ロケールに応じたデータフォーマット][AioGuideI18nCommonFormatDataLocale]

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"
[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/main/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

[LocStandardsIso6392]: https://www.loc.gov/standards/iso639-2 "ISO 639-2 Registration Authority | Library of Congress"

[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 "BCP 47 | RFC Editor"

[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/development/core-specification "Core Specification | Unicode CLDR Project"
[UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798]: https://cldr.unicode.org/development/core-specification#h.vgyyng33o798 "Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project"

<!-- end links -->

@reviewed 2021-10-28
