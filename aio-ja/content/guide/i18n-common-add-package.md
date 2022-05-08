# ローカライズパッケージの追加

Angularのローカライズ機能を利用するには、[Angular CLI][AioCliMain]を使用して`@angular/localize`パッケージをプロジェクトに追加します。

`@angular/localize`パッケージを追加するには、次のコマンドを使用して、プロジェクト内の`package.json`と`polyfills.ts`を更新します。

<code-example path="i18n/doc-files/commands.sh" region="add-localize"></code-example>

<div class="alert is-helpful">

`package.json`と`polyfill.ts`については、[ワークスペースのnpm依存関係][AioGuideNpmPackages]を参照してください。

</div>

`@angular/localize`がインストールされていない状態で、プロジェクトのローカライズ版をビルドしようとすると、[Angular CLI][AioCliMain]はエラーを発生させます。

<!--todo: add example error -->

## 次のステップ

*   [IDでロケールを参照][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "Refer to locales by ID | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-10-07
