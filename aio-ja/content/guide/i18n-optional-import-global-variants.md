# ロケールデータのグローバル設定をインポートする

[`ng build`][AioCliBuild]コマンドに`--localize`オプションを付けて実行すると、[Angular CLI][AioCliMain]は自動的にロケールデータを含めます。

<!--todo: replace with code-example -->

<code-example format="shell" language="shell">

ng build --localize

</code-example>

npmの`@angular/common`パッケージには、ロケールデータファイルが含まれています。
[`@angular/common/locales/global`][UnpkgBrowseAngularCommonLocalesGlobal]のロケールデータのグローバル設定が利用できます。

## フランス語を`import`する例

次の例では、フランス語\(`fr`\)のグローバル設定をインポートしています。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="global-locale"></code-example>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocalesGlobal]: https://unpkg.com/browse/@angular/common/locales/global "@angular/common/locales/global | Unpkg"

<!-- end links -->

@reviewed 2022-02-28
