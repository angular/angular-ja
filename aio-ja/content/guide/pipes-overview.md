# パイプを理解する

[パイプ](guide/glossary#pipe 'パイプの定義')を使って、文字列、通貨金額、日付などのデータを表示用に変換します。

## パイプとは？

パイプは、[テンプレート式](/guide/glossary#template-expression 'Definition of template expression') の中で使用する、入力値を受け取って変換された値を返すシンプルな関数です。パイプはそれぞれ一度だけの宣言で、アプリケーション全体で使用することができるため便利です。
たとえば、ある日付を生の文字列形式ではなく、**April 15, 1988** として表示するためにパイプを使用します。

<div class="alert is-helpful">

このトピックで使用するサンプルアプリケーションは、<live-example name="pipes"></live-example> をご覧ください。

</div>

## 組み込みパイプ

Angularは、ロケール情報を使ってデータを整形する国際化（i18n）のための変換を含む、典型的なデータ変換のための組み込みパイプを提供します。
データの整形によく使われる組み込みパイプは次のとおりです。

- [`DatePipe`](api/common/DatePipe): Formats a date value according to locale rules.
- [`UpperCasePipe`](api/common/UpperCasePipe): Transforms text to all upper case.
- [`LowerCasePipe`](api/common/LowerCasePipe): Transforms text to all lower case.
- [`CurrencyPipe`](api/common/CurrencyPipe): Transforms a number to a currency string, formatted according to locale rules.
- [`DecimalPipe`](/api/common/DecimalPipe): Transforms a number into a string with a decimal point, formatted according to locale rules.
- [`PercentPipe`](api/common/PercentPipe): Transforms a number to a percentage string, formatted according to locale rules.
- [`AsyncPipe`](api/common/AsyncPipe): Subscribe and unsubscribe to an asynchronous source such as an observable.
- [`JsonPipe`](api/common/JsonPipe): Display a component object property to the screen as JSON for debugging.

<div class="alert is-helpful">

- For a complete list of built-in pipes, see the [pipes API documentation](/api/common#pipes 'Pipes API reference summary').
- To learn more about using pipes for internationalization (i18n) efforts, see [formatting data based on locale][AioGuideI18nCommonFormatDataLocale].

</div>

独自のパイプを作成してカスタム変換をカプセル化し、組み込みパイプのようにテンプレート式で使用できます。

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale 'Format data based on locale | Angular'

<!-- end links -->

@reviewed 2023-08-14
