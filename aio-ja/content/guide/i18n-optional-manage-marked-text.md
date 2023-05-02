# カスタムIDでマークされたテキストの管理する

Angularの抽出ツールは、次のインスタンスごとに翻訳ユニットエントリをもつファイルを生成します。

*   コンポーネントテンプレート内の各`i18n`属性
*   コンポーネントコード内の各[`$localize`][AioApiLocalizeInitLocalize]タグ付きメッセージ文字列

[役立つ説明や意味を追加する][AioGuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]で説明したように、Angularは各翻訳ユニットに一意のIDを割り当てます。

次の例に、一意なIDをもつ翻訳ユニットを示します。

<code-example header="messages.fr.xlf.html" path="i18n/doc-files/messages.fr.xlf.html" region="generated-id"></code-example>

翻訳可能なテキストを変更すると、抽出ツールはその翻訳ユニットに対して新しいIDを生成します。
ほとんどの場合、原文の変更には訳文の変更も必要です。
したがって、新しいIDを使用することで、テキストの変更と翻訳の同期を保つことができます。

しかし、翻訳システムによっては、IDに特定の形式や構文を要求するものもあります。
その要件に対応するには、カスタムIDを使用してテキストをマークします。
ほとんどの開発者は、カスタムIDを使用する必要はありません。
追加のメタデータを伝えるために独自の構文を使用したい場合は、カスタムIDを使用します。
追加のメタデータには、テキストが表示されるライブラリ、コンポーネント、またはアプリケーションの領域が含まれる場合があります。

`i18n`属性や[`$localize`][AioApiLocalizeInitLocalize]タグ付きメッセージ文字列でカスタムIDを指定する場合は、`@@`というプレフィックスを使用します。
次の例では、heading要素に`introductionHeader`のカスタムIDを定義しています。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-solo-id"></code-example>

次の例では、`introductionHeader`のカスタムIDを変数に定義しています。

<!--todo: replace with code example -->

<code-example format="typescript" language="typescript">

variableText1 = &dollar;localize `:&commat;&commat;introductionHeader:Hello i18n!`;

</code-example>

カスタムIDを指定すると、抽出ツールはカスタムIDをもつ翻訳ユニットを生成します。

<code-example header="messages.fr.xlf.html" path="i18n/doc-files/messages.fr.xlf.html" region="custom-id"></code-example>

テキストを変更しても、抽出ツールはIDを変更しません。
その結果、翻訳を更新するための余分なステップを踏む必要がありません。
カスタムIDを使用することの欠点は、テキストを変更した場合、翻訳が新しく変更されたソーステキストと同期しなくなる可能性があることです。

#### 説明付きのカスタムIDを使用する

カスタムIDを説明や意味と組み合わせて使うことで、さらに翻訳者の助けになります。

次の例では、説明文の後にカスタムIDを記載しています。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-id"></code-example>

次の例では、`introductionHeader`のカスタムIDと説明を変数に定義しています。

<!--todo: replace with code example -->

<code-example format="typescript" language="typescript">

variableText2 = &dollar;localize `:An introduction header for this sample&commat;&commat;introductionHeader:Hello i18n!`;

</code-example>

次の例では、意味を付加しています。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-meaning-and-id"></code-example>

次の例では、`introductionHeader`のカスタムIDを変数に定義しています。

<!--todo: replace with code example -->

<code-example format="typescript" language="typescript">

variableText3 = &dollar;localize `:site header|An introduction header for this sample&commat;&commat;introductionHeader:Hello i18n!`;

</code-example>

#### ユニークなカスタムIDを定義する

必ずユニークなカスタムIDを定義してください。
2つの異なるテキスト要素に同じIDを使用すると、抽出ツールは最初の1つだけを抽出し、Angularは両方の元のテキスト要素の代わりに翻訳を使用します。

たとえば、次のコードでは、2つの異なるテキスト要素に同じ`myId`カスタムIDを定義しています。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-duplicate-custom-id"></code-example>

次は、フランス語の翻訳を表示したものです。

<code-example header="src/locale/messages.fr.xlf" path="i18n/doc-files/messages.fr.xlf.html" region="i18n-duplicate-custom-id"></code-example>

どちらの要素も同じカスタムIDで定義されているため、同じ翻訳\(`Bonjour`\)が使用されます。

<code-example path="i18n/doc-files/rendered-output.html"></code-example>

<!-- links -->

[AioApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API | Angular"

[AioGuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n-common-prepare#how-meanings-control-text-extraction-and-merges "How meanings control text extraction and merges - Prepare components for translations | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
