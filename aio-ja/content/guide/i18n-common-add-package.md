# ローカライズパッケージの追加

Angularのローカライズ機能を利用するには、[Angular CLI][AioCliMain]を使用して`@angular/localize`パッケージをプロジェクトに追加します。

`@angular/localize`パッケージを追加するには、次のコマンドを使用して、プロジェクト内の`package.json`と TypeScript 設定ファイルを更新します。

<code-example path="i18n/doc-files/commands.sh" region="add-localize"></code-example>

It adds `types: ["@angular/localize"]` in the TypeScript configuration files as well as the reference to the type definition of `@angular/localize` at the top of the `main.ts` file.

<div class="alert is-helpful">

`package.json`と`tsconfig.json`については、[ワークスペースのnpm依存関係][AioGuideNpmPackages]と[TypeScript 設定][AioGuideTsConfig]を参照してください。

</div>

If `@angular/localize` is not installed and you try to build a localized version of your project (for example, while using the `i18n` attributes in templates), the [Angular CLI][AioCliMain] will generate an error, which would contain the steps that you can take to enable i18n for your project.

## Options

| OPTION           | DESCRIPTION | VALUE TYPE | DEFAULT VALUE
|:---              |:---    |:------     |:------
| `--project`      | The name of the project. | `string` |
| `--use-at-runtime` | If set, then `$localize` can be used at runtime. Also `@angular/localize` gets included in the `dependencies` section of `package.json`, rather than `devDependencies`, which is the default.  | `boolean` | `false`

For more available options, see [ng add][AioCliAdd] in [Angular CLI][AioCliMain].
## What's next

*   [@angular/localize API][AioApiLocalize]
*   [Refer to locales by ID][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "Refer to locales by ID | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

[AioGuideTsConfig]: guide/typescript-configuration "TypeScript Configuration | Angular"

[AioCliAdd]: cli/add "ng add | CLI | Angular"

[AioApiLocalize]: api/localize "$localize | @angular/localize - API | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2023-03-10
