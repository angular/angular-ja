# 翻訳用コンポーネントの準備

プロジェクトを翻訳する準備には、次の作業を行います。

*   `i18n`属性を使用して、コンポーネントテンプレート内のテキストをマークします。
*   `i18n-`属性を使用して、コンポーネントテンプレート内の属性テキスト文字列をマークします。
*   `$localize`タグ付きメッセージ文字列を使用して、コンポーネントコード内のテキスト文字列をマークします。

## コンポーネントテンプレート内のテキストをマークする {@a mark-text-in-component-template}

コンポーネントテンプレートでは、i18nメタデータは`i18n`属性の値となります。

<code-example format="html" language="html">

&lt;element i18n="{i18n_metadata}"&gt;{string_to_translate}&lt;/element&gt;

</code-example>

`i18n`属性を使用して、コンポーネントテンプレート内の静的テキストメッセージを翻訳用にマークします。
翻訳したい固定テキストを含むすべての要素タグに配置してください。

<div class="alert is-helpful">

`i18n`属性は、Angularのツールやコンパイラが認識するカスタム属性です。

</div>

### `i18n` の例

次の`<h1>`タグは、"Hello i18n！"という簡単な英語のあいさつを表示しています。

<code-example header="src/app/app.component.html" path="i18n/doc-files/app.component.html" region="greeting"></code-example>

あいさつを翻訳用にマークするには、`<h1>`タグに`i18n`属性を追加してください。

<code-example header="src/app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute"></code-example>

### HTML要素なしでインラインテキストを翻訳する

`<ng-container>`要素を使うと、テキストの表示方法を変えずに、特定のテキストに翻訳動作を関連付けることができます。

<div class="alert is-helpful">

HTMLの各要素は、新しいDOM要素を作成します。
新しいDOM要素を作らないためには、テキストを`<ng-container>`要素で囲みます。
次の例では、`<ng-container>`要素が非表示のHTMLコメントに変換されています。

<code-example path="i18n/src/app/app.component.html" region="i18n-ng-container"></code-example>

</div>

## 要素の属性を翻訳用にマークする

コンポーネントテンプレートでは、i18nメタデータは`i18n-{attribute_name}`属性の値です。

<code-example format="html" language="html">

&lt;element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" /&gt;

</code-example>

HTML要素の属性には、コンポーネントテンプレートに表示されるテキストの残りと一緒に、翻訳されるべきテキストが含まれています。

`i18n-{attribute_name}`を任意の要素の任意の属性に使用し、`{attribute_name}`を属性名に置き換えます。
意味、説明、カスタムID を割り当てるには、次の構文を使用します。

<!--todo: replace with code-example -->

<code-example format="html" language="html">

i18n-{attribute_name}="{meaning}|{description}&commat;&commat;{id}"

</code-example>

### `i18n-title` の例

画像のタイトルを翻訳するには、この例を確認してください。
次の例では、`title`属性をもつ画像を表示しています。

<code-example header="src/app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-title"></code-example>

title属性を翻訳対象としてマークするには、次の作業を行います。

1.  `i18n-title`属性を追加する

    次の例は、`img`タグに`i18n-title`を付けて`title`属性をマークする方法を示しています。

    <code-example header="src/app/app.component.html" path="i18n/src/app/app.component.html" region="i18n-title-translate"></code-example>

## コンポーネントコード内のテキストをマークする

コンポーネントコードでは、翻訳原文とメタデータをバッククオート文字\(<code>&#96;</code>\)で囲みます。

[`$localize`][AioApiLocalizeInitLocalize]タグ付きのメッセージ文字列を使用して、コード内の文字列を翻訳用にマークします。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

&dollar;localize `string_to_translate`;

</code-example>

i18nメタデータはコロン\(`:`\)で囲まれ、翻訳元テキストの前に付与されます。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

&dollar;localize `:{i18n_metadata}:string_to_translate`

</code-example>

### 補間テキストを含める

[`$localize`][AioApiLocalizeInitLocalize]タグ付きのメッセージ文字列には[補間][AioGuideGlossaryInterpolation]を含むことができます。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

&dollar;localize `string_to_translate &dollar;{variable_name}`;

</code-example>

### 補間プレースホルダーに名前をつける

<code-example format="typescript" language="typescript">

&dollar;localize `string_to_translate &dollar;{variable_name}:placeholder_name:`;

</code-example>

## 翻訳用i18nメタデータ

<!--todo: replace with code-example -->

<code-example>

{meaning}|{description}&commat;&commat;{custom_id}

</code-example>

次のパラメータは、コンテキストと追加情報を提供し、翻訳者の混乱を軽減します。

| メタデータパラメータ | 詳細                                                               |
|:---                |:---                                                                   |
| Custom ID          | カスタム識別子を提供します                                           |
| Description        | 追加情報またはコンテキストを提供します                             |
| Meaning            | 特定の文脈の中でテキストの意味や意図を提供します |

カスタム識別子について詳しくは、[カスタム識別子でマークされたテキストを管理する][AioGuideI18nOptionalManageMarkedText]を参照してください。

### 役立つ説明や意味を追加する {@a add-helpful-descriptions-and-meanings}

テキストメッセージを正確に翻訳するためには、翻訳者へ追加情報や文脈を提供する必要があります。

`i18n`属性または[`$localize`][AioApiLocalizeInitLocalize]タグ付きのメッセージ文字列の値として、テキストメッセージの*説明*を追加します。

次の例は、`i18n`属性の値を示しています。

<code-example header="src/app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-desc"></code-example>

次の例は、[`$localize`][AioApiLocalizeInitLocalize]タグ付きのメッセージ文字列の値を説明とともに示しています。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

&dollar;localize `:An introduction header for this sample:Hello i18n!`;

</code-example>

翻訳者は、同じ意味をもつ他のテキストと同じように翻訳するために、特定のアプリケーションコンテキストにおけるテキストメッセージの意味または意図を知る必要があります。
`i18n`属性値を*意味*から始め、*説明*と`｜`文字で区切ります。`{meaning}|{description}`

#### `h1`の例

たとえば、`<h1>`タグはサイトのヘッダーであり、それがヘッダーとして使われても、他のセクションのテキストで参照されても、同じように翻訳する必要がある、と指定することができます。

次の例では、`<h1>`タグをヘッダーとして翻訳するか、他の場所から参照するか指定する方法を示しています。

<code-example header="src/app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-meaning"></code-example>

その結果、`site header`でマークされたテキストは、*意味*がまったく同じように翻訳されます。

次のコード例では、[`$localize`][AioApiLocalizeInitLocalize]タグ付きのメッセージ文字列の値を意味と説明で示しています。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

&dollar;localize `:site header|An introduction header for this sample:Hello i18n!`;

</code-example>

<div class="callout is-helpful">

<header>
<a name="how-meanings-control-text-extraction-and-merges"></a> テキスト抽出と結合を制御する方法
</header>

Angularの抽出ツールは、テンプレート内の`i18n`属性ごとに翻訳単位エントリを生成します。
Angularの抽出ツールは、*意味*と*説明*をもとに各翻訳ユニットに一意のIDを付与します。

<div class="alert is-helpful">

Angularの抽出ツールの詳細については、[翻訳ファイルでの作業][AioGuideI18nCommonTranslationFiles]を参照してください。

</div>

同じテキスト要素で*意味*の異なるものは、異なるIDで抽出されます。
たとえば、"right"という単語が次の2つの定義で2か所で使われている場合、その単語は異なる翻訳を行い、異なる翻訳エントリとしてアプリケーションにマージされます。

*   `correct` as in "you are right"
*   `direction` as in "turn right"

同じテキスト要素が次の条件を満たす場合、テキスト要素は一度だけ抽出され、同じIDが使用されます。

*   同じ意味または定義
*   異なる説明

1つの翻訳エントリは、同じテキスト要素が現れる場所であれば、アプリケーションに再びマージされます。

</div>

## ICU式

ICU式は、条件を満たすためにコンポーネントテンプレート内の代替テキストをマークするのに役立ちます。
ICU式は、コンポーネントプロパティ、ICU節、および開中括弧\(`{`\)と閉中括弧\(`}`\)で囲まれたcase文からなります。

<!--todo: replace with code-example -->

<code-example>

{ component_property, icu_clause, case_statements }

</code-example>

コンポーネントプロパティは、変数を定義します。
ICU節は、条件文のタイプを定義します。

| ICU節                                                              | 詳細                                                            |
|:---                                                                     |:---                                                                 |
| [`plural`][AioGuideI18nCommonPrepareMarkPlurals]                        | 複数形の使用をマークします                                      |
| [`select`][AioGuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | 定義された文字列値に基づいて、代替テキストの選択肢をマークします |

翻訳を簡単にするためには、International Components for Unicode clauses \(ICU clauses\)を正規表現で使用します。

<div class="alert is-helpful">

ICUの各節は、[CLDRの複数形規則][UnicodeCldrIndexCldrSpecPluralRules]で規定された[ICUメッセージフォーマット][GithubUnicodeOrgIcuUserguideFormatParseMessages]に準拠します。

</div>

### 複数形をマークする {@a mark-plurals}

言語によって複数形のルールが異なるため、翻訳の難易度が高くなります。
他のロケールでは基数の表現が異なるため、英語と一致しない複数形カテゴリーを設定した方がよい場合があります。
一語一語の翻訳では意味をなさないような表現には、`plural`節を使用します。

<!--todo: replace with code-example -->

<code-example>

{ component_property, plural, pluralization_categories }

</code-example>

複数形カテゴリーの後に、開中括弧\(`{`\)と閉中括弧\(`}`\)で囲まれたデフォルトテキスト\(English\)を入力します。

<!--todo: replace with code-example -->

<code-example>

pluralization_category { }

</code-example>

次の複数形カテゴリーは英語で利用可能であり、ロケールによって変更される場合があります。

| 複数形カテゴリー | 詳細                    | 例                    |
|:---                    |:---                        |:---                        |
| `zero`                 | 数量はゼロ           | `=0 { }` <br /> `zero { }` |
| `one`                  | 数量は1              | `=1 { }` <br /> `one { }`  |
| `two`                  | 数量は2              | `=2 { }` <br /> `two { }`  |
| `few`                  | 数量は2以上      | `few { }`                  |
| `many`                 | 数量は大きな数字 | `many { }`                 |
| `other`                | デフォルトの数量       | `other { }`                |

複数形のカテゴリーがどれも一致しない場合、Angularは`other`を使用して、カテゴリーが見つからない場合の標準的なフォールバックに一致させます。

<!--todo: replace with code-example -->

<code-example>

other { default_quantity }

</code-example>

<div class="alert is-helpful">

複数形カテゴリーの詳細については、[CLDR - Unicode Common Locale Data Repository][UnicodeCldrMain]の[Choosing plural category names][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]をご覧ください。

</div>

<div class="callout is-important">

<a name="background-locales-may-not-support-some-pluralization-categories"></a>

<header>背景: ロケールはいくつかの複数形カテゴリをサポートしません</header>

多くのロケールでは、複数形カテゴリーのいくつかをサポートしていません。
デフォルトのロケール \(`en-US`\)は非常に単純な`plural()`関数を使用しており、`few`複数形カテゴリーをサポートしていません。
単純な`plural()`関数をもつ別のロケールとして`es`があります。
次のコード例では、[en-US `plural()`][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]関数を示しています。

<code-example path="i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy></code-example>

`plural()`関数は 1\(`one`\)か5\(`other`\)を返すだけです。
`few`カテゴリーは決してマッチしません。

</div>

#### `minutes` の例

`x`が数字の次のフレーズを英語で表示したい場合。

<!--todo: replace output code-example with screen capture image --->

<code-example>

updated x minutes ago

</code-example>

または、`x`の基数に応じて次のようなフレーズを表示させたい場合。

<!--todo: replace output code-example with screen capture image --->

<code-example>

updated just now

</code-example>

<!--todo: replace output code-example with screen capture image --->

<code-example>

updated one minute ago

</code-example>

HTMLマークアップと[補間][AioGuideGlossaryInterpolation]を利用します。
次のコード例は、先の3つの状況を`<span>`要素で表現するために、`plural`節を使用する方法を示しています。

<code-example header="src/app/app.component.html" path="i18n/src/app/app.component.html" region="i18n-plural"></code-example>

先ほどのコード例で、次の内容を確認してください。

| パラメータ                        | 詳細|
|:---                               |:---    |
| `minutes`                         | 最初のパラメータはコンポーネントプロパティに`minutes`を指定し、分数を決定します。               |
| `plural`                          | 第2パラメータは、ICU節が`plural`であることを指定します。                                                            |
| `=0 {just now}`                   | 0分の場合、複数形カテゴリーは`=0`となります。 値は`just now`です。                                        |
| `=1 {one minute}`                 | 1分の場合、複数形カテゴリーは`=1`となります。 値は`one minute`です。                                        |
| `other {{{minutes}} minutes ago}` | 基数が一致しない場合、デフォルトの複数形カテゴリーは`other`となります。値は`{{minutes}} minutes ago`です。 |

`{{minutes}}` は[補間][AioGuideGlossaryInterpolation]です。

### 選択肢とネストされた式をマークする {@a mark-alternates-and-nested-expressions}

`select`節は、定義した文字列値に基づいて代替テキストの選択肢をマークします。

<!--todo: replace with code-example -->

<code-example>

{ component_property, select, selection_categories }

</code-example>

変数の値に基づいて代替テキストを表示するために、すべての選択肢を翻訳します。

選択カテゴリーの後に、開波括弧\(`{`\)と閉波括弧\(`}`\)で囲まれたテキスト（英語）を入力してください。

<!--todo: replace with code-example -->

<code-example>

selection_category { text }

</code-example>

ロケールが異なれば文法構造も異なるため、翻訳の難易度は高くなります。
HTMLマークアップを使用してください.
どの選択カテゴリーも一致しない場合、Angularは欠落したカテゴリーの標準的なフォールバックとして`other`を使用します。

<!--todo: replace with code-example -->

<code-example>

other { default_value }

</code-example>

#### `gender`の例

次のフレーズを英語で表示したい場合。

<!--todo: replace output code-example with screen capture image --->

<code-example>

The author is other

</code-example>

そして、コンポーネントの`gender`プロパティに基づいて、次のフレーズも表示したい場合。

<!--todo: replace output code-example with screen capture image --->

<code-example>

The author is female

</code-example>

<!--todo: replace output code-example with screen capture image --->

<code-example>

The author is male

</code-example>

次のコード例では、コンポーネントの`gender`プロパティをバインドし、`select`節を使用して、先の3つの状況を`<span>`要素で表現しています。

`gender`プロパティは、次のそれぞれの文字列と出力をバインドします。

| 値  | 英語の値 |
|:---    |:---           |
| female | `female`      |
| male   | `male`        |
| other  | `other`       |

`select`節は、値を適切な翻訳にマッピングします。
次のコード例は、`select`節で使用される`gender`プロパティを示しています。

<code-example header="src/app/app.component.html" path="i18n/src/app/app.component.html" region="i18n-select"></code-example>

#### `gender`と`minutes`の例

`plural`節と`select`節など、異なる節を一緒に組み合わせてください。
次のコード例では、`gender`と`minutes`の例に基づいた、ネストされた節を示します。

<code-example header="src/app/app.component.html" path="i18n/src/app/app.component.html" region="i18n-nested"></code-example>

## 次のステップ

*   [翻訳ファイルの作業][AioGuideI18nCommonTranslationFiles]

<!-- links -->

[AioApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API  | Angular"

[AioGuideGlossaryInterpolation]: guide/glossary#interpolation "interpolation - Glossary | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "Prepare templates for translations | Angular"
[AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n-common-prepare#add-helpful-descriptions-and-meanings "Add helpful descriptions and meanings - Prepare templates for translations | Angular"
[AioGuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]: guide/i18n-common-prepare#mark-alternates-and-nested-expressions "Mark alternates and nested expressions - Prepare templates for translation | Angular"
[AioGuideI18nCommonPrepareMarkElementAttributesForTranslations]: guide/i18n-common-prepare#mark-element-attributes-for-translations "Mark element attributes for translations - Prepare templates for translations | Angular"
[AioGuideI18nCommonPrepareMarkPlurals]: guide/i18n-common-prepare#mark-plurals "Mark plurals - Prepare component for translation | Angular"
[AioGuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n-common-prepare#mark-text-in-component-template "Mark text in component template - Prepare templates for translations | Angular"

[AioGuideI18nCommonTranslationFiles]: guide/i18n-common-translation-files "Work with translation files | Angular"

[AioGuideI18nOptionalManageMarkedText]: guide/i18n-optional-manage-marked-text "Manage marked text with custom IDs | Angular"

<!-- external links -->

[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L14-L18 "Line 14 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub"

[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages "ICU Message Format - ICU Documentation | Unicode | GitHub"

[UnicodeCldrMain]: https://cldr.unicode.org "Unicode CLDR Project"
[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules "Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode"
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names "Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode"

<!-- end links -->

@reviewed 2022-02-28
