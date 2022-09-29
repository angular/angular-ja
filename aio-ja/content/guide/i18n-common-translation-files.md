# 翻訳ファイルの作業

翻訳用のコンポーネントを準備したら、[`extract-i18n`][AioCliExtractI18n] [Angular CLI][AioCliMain]を使用して、コンポーネント内のマークされたテキストを*ソース言語*ファイルに抽出します。

マークされたテキストには、[翻訳用コンポーネントの準備][AioGuideI18nCommonPrepare]で説明したように、`i18n`でマークされたテキスト、`i18n`*属性*でマークされた属性、および`$localize`でタグ付けされたテキストが含まれます。

次の手順で、プロジェクトの翻訳ファイルを作成、更新します。

1.  [ソース言語ファイルを抽出する][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
    1.  オプションで、ロケーション、フォーマット、名前を変更する。
1.  ソース言語ファイルをコピーして、[各言語の翻訳ファイルを作成する][AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]。
1.  [各翻訳ファイルを翻訳する][AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]。
1.  複数形と代替表現を別々に翻訳する。
    1.  [複数形を翻訳する][AioGuideI18nCommonTranslationFilesTranslatePlurals]。
    1.  [代替表現を翻訳する][AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]。
    1.  [ネストされた式を翻訳する][AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]。

## ソース言語ファイルを抽出する {@a extract-the-source-language-file}

ソース言語ファイルを抽出するには、次の操作を行います。

1.  ターミナルウィンドウを開く。
1.  プロジェクトのルートディレクトリに移動する。
1.  次のCLIコマンドを実行する。

    <code-example path="i18n/doc-files/commands.sh" region="extract-i18n-default"></code-example>

`extract-i18n`コマンドは、プロジェクトのルートディレクトリに`messages.xlf`という名前のソース言語ファイルを作成します。
XML Localization Interchange File Format \(XLIFF、バージョン1.2\)の詳細については、[XLIFF][WikipediaWikiXliff]を参照してください。

ソース言語ファイルの場所、フォーマット、ファイル名を変更するには、次の[`extract-i18n`][AioCliExtractI18n]コマンドオプションを使用してください。

| コマンドオプション  | 詳細 |
|:---             |:---     |
| `--format`      | 出力ファイルのフォーマットを設定する    |
| `--outFile`     | 出力ファイルのファイル名を設定する      |
| `--output-path` | 出力先ディレクトリのパスを設定する      |

### ソース言語ファイルの場所を変更する

`src/locale`ディレクトリにファイルを作成する場合、オプションで出力パスを指定します。

#### `extract-i18n --output-path`の例

次の例では、オプションで出力パスを指定しています。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-output-path"></code-example>

### ソース言語ファイルのフォーマットを変更する {@a change-the-source-language-file-format}

`extract-i18n`コマンドは、次の翻訳形式のファイルを作成します。

| 翻訳形式 | 詳細                                                                                                          | ファイル拡張子 |
|:---                |:---                                                                                                              |:---            |
| ARB                | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]           | `.arb`            |
| JSON               | [JavaScript Object Notation][JsonMain]                                                                           | `.json`           |
| XLIFF 1.2          | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                | `.xlf`            |
| XLIFF 2            | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf`            |
| XMB                | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                 | `.xmb` \(`.xtb`\) |

コマンドオプション`--format`を使って、翻訳形式を明示的に指定します。

<div class="alert is-helpful">

XMBフォーマットでは、ソース言語ファイルとして`.xmb`が生成されますが、翻訳ファイルとして`.xtb`が使用されます。

</div>

#### `extract-i18n --format`の例

次の例では、いくつかの翻訳形式を示しています。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-formats"></code-example>

### ソース言語ファイルのファイル名を変更する

抽出ツールが生成するソース言語ファイルの名前を変更するには、`--outFile`コマンドオプションを使用します。

#### `extract-i18n --out-file`の例

次の例では、出力ファイルの命名方法を示しています。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-out-file"></code-example>

## 各言語の翻訳ファイルを作成する {@a create-a-translation-file-for-each-language}

ロケールまたは言語の翻訳ファイルを作成するには、次の操作を行います。

1.  [ソース言語ファイルを抽出する][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]。
1.  ソース言語ファイルをコピーして、各言語の*翻訳*ファイルを作成する。
1.  *翻訳*ファイルの名前を変更して、ロケールを追加する。

    <code-example language="file">

    messages.xlf --&gt; message.{locale}.xlf

    </code-example>

1.  プロジェクトルートに、`locale`という名前の新しいディレクトリを作成する。

    <code-example language="file">

    src/locale

    </code-example>

1.  *翻訳*ファイルを新しいディレクトリに移動する。
1.  *翻訳*ファイルを翻訳者に送信する。
1.  アプリケーションに追加したい各言語について、上記の手順を繰り返す。

### フランス語の`extract-i18n`の例

たとえば、フランス語の翻訳ファイルを作成する場合は、次の操作を行います。

1.  `extract-i18n`コマンドを実行する。
1.  ソース言語ファイル`messages.xlf`のコピーを作成する。
1.  フランス語\(`fr`\)に翻訳するため、コピーしたファイルの名前を`messages.fr.xlf`に変更する。
1.  `fr`翻訳ファイルを`src/locale`ディレクトリに移動する。
1.  `fr`翻訳ファイルを翻訳者に送信する。

## 各翻訳ファイルを翻訳する {@a translate-each-translation-file}

あなたがその言語に堪能で、翻訳を編集する時間がある場合を除き、次のステップを行うことが多いでしょう。

1.  各翻訳ファイルを翻訳者に送信する。
1.  翻訳者は、XLIFFファイルエディターを使って、次の操作を行います。
    1.  翻訳を作成する。
    1.  翻訳を編集する。

### フランス語の翻訳プロセスの例

このプロセスを示すのに、[Angular国際化アプリケーションの例][AioGuideI18nExample]の`messages.fr.xlf`ファイルを参照します。[Angular国際化アプリケーションの例][AioGuideI18nExample]では、特別なXLIFFエディターやフランス語の知識がなくても編集できるように、フランス語の翻訳が含まれています。

次にフランス語の翻訳プロセスを示します。

1.  `messages.fr.xlf`を開き、最初の`<trans-unit>`要素を見つけます。
    これは*テキストノード*とも呼ばれる*翻訳ユニット*で、以前に`i18n`属性でマークされた`<h1>`挨拶タグの翻訳を表しています。

    <code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-hello-before"></code-example>

    `id="introductionHeader` "は[カスタムID][AioGuideI18nOptionalManageMarkedText]ですが、ソースHTMLに必要な`@@`接頭辞はありません。

1.  テキストノード内の`<source>...</source>`要素を複製し、`target`に名前を変更し、内容をフランス語のテキストに置き換えます。

    <code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;, after translation)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-hello"></code-example>

    より複雑な翻訳では、[説明や意味の要素][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]に含まれる情報や文脈が、翻訳に適した単語を選ぶのに役立ちます。

1.  他のテキストノードを翻訳します。
    次の例に、翻訳する方法を示します。

    <code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-other-nodes"></code-example>

    <div class="alert is-important">

    翻訳ユニットのIDを変更しないでください。
    各`id`属性はAngularによって生成され、コンポーネントのテキストの内容と割り当てられた意味に依存します。
    もしテキストか意味のどちらかを変更した場合、`id`属性も変更されます。
    テキストの更新とIDの管理の詳細については、[カスタムID][AioGuideI18nOptionalManageMarkedText]を参照してください。

    </div>

## 複数形を翻訳する {@a translate-plurals}

各言語の必要に応じて、複数形のケースを追加または削除してください。

<div class="alert is-helpful">

言語の複数形の規則については、[CLDRの複数形規則][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]を参照してください。

</div>

### `minute` `plural` の例

`plural`を翻訳するには, ICU形式のマッチした値を翻訳します。

*   `just now`
*   `one minute ago`
*   `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

次の例に、翻訳方法を示します。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-plural"></code-example>

## 代替表現を翻訳する {@a translate-alternate-expressions}

また、Angularは代替`select`ICU式を個別の翻訳ユニットとして抽出します。

### `gender` `select` の例

次の例に、コンポーネントテンプレート内の`select`ICU式を示します。

<code-example header="src/app/app.component.html" path="i18n/src/app/app.component.html" region="i18n-select"></code-example>

この例では、Angularは式を2つの翻訳ユニットに抽出しています。
1つ目は`select`句の外側のテキストを含み、`select`のプレースホルダー\(`<x id="ICU">`\)を使用します。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-select-1"></code-example>

<div class="alert is-important">

テキストを翻訳する際、必要に応じてプレースホルダーを移動させますが、削除しないでください。
プレースホルダーを削除すると、翻訳されたアプリケーションからICU式が削除されます。

</div>

次の例では、`select`句を含む2つ目の翻訳ユニットを示しています。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-select-2"></code-example>

次の例に、翻訳が完了した後の両方の翻訳ユニットを示します。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translated-select"></code-example>

## ネストされた式を翻訳する {@a translate-nested-expressions}

Angularはネストされた式を代替式と同じように扱います。
Angularは式を2つの翻訳ユニットに抽出します。

### ネストされた`plural`の例

次の例に、ネストした式の外側にあるテキストを含む1つ目の翻訳ユニットを示します。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested-1"></code-example>

次の例に、完全な入れ子式を含む2つ目の翻訳ユニットを示します。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested-2"></code-example>

次の例に、翻訳後の両方の翻訳ユニットを示します。

<code-example header="src/locale/messages.fr.xlf (&lt;trans-unit&gt;)" path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested"></code-example>

## 次のステップ

*   [アプリケーションに翻訳をマージ][AioGuideI18nCommonMerge]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliExtractI18n]: cli/extract-i18n "ng extract-i18n | CLI | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "Prepare templates for translations | Angular"
[AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n-common-prepare#add-helpful-descriptions-and-meanings "Add helpful descriptions and meanings - Prepare component for translation | Angular"

[AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n-common-translation-files#create-a-translation-file-for-each-language "Create a translation file for each language - Work with translation files | Angular"
[AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n-common-translation-files#extract-the-source-language-file "Extract the source language file - Work with translation files | Angular"
[AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n-common-translation-files#translate-alternate-expressions "Translate alternate expressions - Work with translation files | Angular"
[AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n-common-translation-files#translate-each-translation-file "Translate each translation file - Work with translation files | Angular"
[AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n-common-translation-files#translate-nested-expressions "Translate nested expressions - Work with translation files | Angular"
[AioGuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n-common-translation-files#translate-plurals "Translate plurals - Work with translation files | Angular"

[AioGuideI18nExample]: guide/i18n-example "Example Angular Internationalization application | Angular"

[AioGuideI18nOptionalManageMarkedText]: guide/i18n-optional-manage-marked-text "Manage marked text with custom IDs | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification "ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub"

[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html "Language Plural Rules - CLDR Charts | Unicode | GitHub"

[JsonMain]: https://www.json.org "Introducing JSON | JSON"

[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: http://docs.oasis-open.org/xliff/xliff-core/xliff-core.html "XLIFF Version 1.2 Specification | Oasis Open Docs"
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html "XLIFF Version 2.0 | Oasis Open Docs"

[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb "XMB | CLDR - Unicode Common Locale Data Repository | Unicode"

[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF "XLIFF | Wikipedia"

<!-- end links -->

@reviewed 2022-02-28
