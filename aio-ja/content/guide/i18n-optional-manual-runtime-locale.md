# ランタイムロケールを手動で設定する

<!--todo: The Angular CLI sets the locale ID token as part of the translation. -->

<!--todo: To override the provider for the locale ID token. -->

Angularの初期インストールには、すでに米国英語\(`en-US`\)のロケールデータが含まれています。
[`ng build`][AioCliBuild]コマンドで`--localize`オプションを使用すると、[Angular CLI][AioCliMain]は自動的にロケールデータを含み、`LOCALE_ID`の値を設定します。

アプリケーションのランタイムロケールを自動設定以外のものに手動で設定するには、次の操作を行います。

1.  [`@angular/common/locales/`][UnpkgBrowseAngularCommonLocales]ディレクトリの言語とロケールの組み合わせから、UnicodeロケールIDを検索します。
1.  [`LOCALE_ID`][AioApiCoreLocaleId]トークンを設定します.

次の例では、`LOCALE_ID`の値をフランス語の`fr`に設定しています。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="locale-id"></code-example>

<!-- links -->

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocales]: https://unpkg.com/browse/@angular/common/locales/ "@angular/common/locales/ | Unpkg"

<!-- end links -->

@reviewed 2022-02-28
