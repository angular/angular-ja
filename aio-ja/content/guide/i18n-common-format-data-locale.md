# ロケールに応じたデータフォーマット

Angularは次の組み込みデータ変換[パイプ][AioGuideGlossaryPipe]を提供します。
データ変換パイプは[`LOCALE_ID`][AioApiCoreLocaleId]トークンを使用して、各ロケールの規則に基づいてデータをフォーマットします。

| データ変換パイプ                   | 詳細 |
|:---                                        |:---     |
| [`DatePipe`][AioApiCommonDatepipe]         | 日付をフォーマットします。                             |
| [`CurrencyPipe`][AioApiCommonCurrencypipe] | 数値を通貨文字列に変換します。       |
| [`DecimalPipe`][AioApiCommonDecimalpipe]   | 数値を10進数の文字列に変換します。 |
| [`PercentPipe`][AioApiCommonPercentpipe]   | 数値をパーセンテージ文字列に変換します。     |

## DatePipeを使用して現在の日付を表示する

現在の日付を現在のロケールのフォーマットで表示するには、次のフォーマットで`DatePipe`を使用します。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

{{ today &verbar; date }}

</code-example>

## CurrencyPipeの現在のロケールをオーバーライドする

パイプに`locale`パラメータを追加して、`LOCALE_ID`トークンの現在の値をオーバーライドしてください。

通貨にアメリカ英語\(`en-US`\)を使用させるには、`CurrencyPipe`に次のフォーマットを使用します。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

{{ amount &verbar; currency : 'en-US' }}

</code-example>

<div class="alert is-helpful">

**NOTE**: <br />
`CurrencyPipe`に指定されたロケールは、アプリケーションのグローバルな`LOCALE_ID`トークンをオーバーライドします。

</div>

## 次のステップ

*   [翻訳用コンポーネントの準備][AioGuideI18nCommonPrepare]

<!-- links -->

[AioApiCommonCurrencypipe]: api/common/CurrencyPipe "CurrencyPipe | Common - API | Angular"
[AioApiCommonDatepipe]: api/common/DatePipe "DatePipe | Common - API | Angular"
[AioApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | Common - API | Angular"
[AioApiCommonPercentpipe]: api/common/PercentPipe "PercentPipe | Common - API | Angular"
[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioGuideGlossaryPipe]: guide/glossary#pipe "pipe - Glossary | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "Prepare templates for translations | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
