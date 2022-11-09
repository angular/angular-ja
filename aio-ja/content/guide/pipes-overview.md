# パイプを理解する

[パイプ](guide/glossary#pipe "パイプの定義")を使って、文字列、通貨金額、日付などのデータを表示用に変換します。

## パイプとは？

パイプは、[テンプレート式](/guide/glossary#template-expression "Definition of template expression") の中で使用する、入力値を受け取って変換された値を返すシンプルな関数です。パイプはそれぞれ一度だけの宣言で、アプリケーション全体で使用することができるため便利です。
たとえば、ある日付を生の文字列形式ではなく、**April 15, 1988** として表示するためにパイプを使用します。

<div class="alert is-helpful">

このトピックで使用するサンプルアプリケーションは、<live-example name="pipes"></live-example> をご覧ください。

</div>

## 組み込みパイプ

Angularは、ロケール情報を使ってデータを整形する国際化（i18n）のための変換を含む、典型的なデータ変換のための組み込みパイプを提供します。
データの整形によく使われる組み込みパイプは次のとおりです。

*   [`DatePipe`](api/common/DatePipe): ロケールの規則にしたがって、日付の値を整形します。
*   [`UpperCasePipe`](api/common/UpperCasePipe): テキストをすべて大文字に変換します。
*   [`LowerCasePipe`](api/common/LowerCasePipe): テキストをすべて小文字に変換します。
*   [`CurrencyPipe`](api/common/CurrencyPipe): 数値から通貨文字列に変換し、ロケールの規則にしたがって整形します。
*   [`DecimalPipe`](/api/common/DecimalPipe): ロケールの規則にしたがって整形された、小数点を含む文字列に数値を変換します。
*   [`PercentPipe`](api/common/PercentPipe): 数値をロケールの規則にしたがって整形されたパーセント文字列に変換します。

<div class="alert is-helpful">

* 組み込みパイプの一覧は、[パイプの API ドキュメント](/api/common#pipes "Pipes API reference summary")を参照してください。
* 国際化 (i18n) のためのパイプの使い方については、[ロケールに応じたデータの整形][AioGuideI18nCommonFormatDataLocale]を参照してください。

</div>

独自の変換をカプセル化するパイプを作成し、テンプレート式でカスタムパイプを使用することができます。

## パイプと優先順位

パイプ演算子は三項演算子(`?:`)よりも優先順位が高く、`a ? b : c | x` は `a ? b : (c | x)`としてパースされます。
パイプ演算子は `?:` の第1オペランドと第2オペランドに括弧をつけないで使用することはできません。

優先順位の関係で、パイプを三項演算の結果に適用したい場合は、式全体を括弧で囲みます。たとえば、 `(a ? b : c) | x` です。

<code-example path="pipes/src/app/precedence.component.html" region="precedence" header="src/app/precedence.component.html"></code-example>

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"

<!-- end links -->

@reviewed 2022-04-01
