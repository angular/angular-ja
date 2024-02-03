# ロケールデータのグローバル設定をインポートする

[`ng build`][AioCliBuild]コマンドに`--localize`オプションを付けて実行すると、[Angular CLI][AioCliMain]は自動的にロケールデータを含めます。

<!--todo: replace with code-example -->

<code-example format="shell" language="shell">

ng build --localize

</code-example>

<div class="alert-is-helpful">

The initial installation of Angular already contains locale data for English in the United States \(`en-US`\).
The [Angular CLI][AioCliMain] automatically includes the locale data and sets the `LOCALE_ID` value when you use the `--localize` option with [`ng build`][AioCliBuild] command.

</div>

npmの`@angular/common`パッケージには、ロケールデータファイルが含まれています。
[`@angular/common/locales/global`][UnpkgBrowseAngularCommonLocalesGlobal]のロケールデータのグローバル設定が利用できます。

## フランス語を`import`する例

たとえば、アプリケーションをブートストラップする `main.ts` で、フランス語のグローバルバリアントをインポートできます。

<code-example header="src/main.ts (import locale)" path="i18n/src/main.ts" region="global-locale"></code-example>

<div class="alert is-helpful">

In an `NgModules` application, you would import it in your `app.module`.

</div>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocalesGlobal]: https://unpkg.com/browse/@angular/common/locales/global "@angular/common/locales/global | Unpkg"

<!-- end links -->

@reviewed 2023-08-30
