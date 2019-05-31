# ワークスペースとプロジェクトのファイル構造

アプリケーションはAngular[ワークスペース](guide/glossary#workspace)のコンテキストで開発されます。 ワークスペースには1つ、または複数の[プロジェクト](guide/glossary#project)のファイルが含まれています。プロジェクトとは、スタンドアロンのアプリケーション、共有ライブラリを含むファイル群のことを指します。

The Angular CLI `ng new` command creates a workspace.

<code-example language="bash" linenums="false">
ng new &lt;my-project&gt;
</code-example>

When you run this command, the CLI installs the necessary Angular npm packages and other dependencies in a new workspace, with a root-level application named *my-project*.
The workspace root folder contains various support and configuration files, and a README file with generated descriptive text that you can customize.

By default, `ng new` creates an initial skeleton application at the root level of the workspace, along with its end-to-end tests.
The skeleton is for a simple Welcome application that is ready to run and easy to modify.
The root-level application has the same name as the workspace, and the source files reside in the `src/` subfolder of the workspace.

This default behavior is suitable for a typical "multi-repo" development style where each application resides in its own workspace.
Beginners and intermediate users are encouraged to use `ng new` to create a separate workspace for each application.

Angular also supports workspaces with [multiple projects](#multiple-projects).
This type of development environment is suitable for advanced users who are developing [shareable libraries](guide/glossary#library),
and for enterprises that use a "monorepo" development style, with a single repository and global configuration for all Angular projects.

To set up a monorepo workspace, you should skip the creating the root application.
See [Setting up for a multi-project workspace](#multiple-projects) below.

## ワークスペースの設定ファイル

All projects within a workspace share a [CLI configuration context](guide/workspace-config).
The top level of the workspace contains workspace-wide configuration files, configuration files for the root-level application, and subfolders for the root-level application source and test files.

| ワークスペースの設定ファイル    | 　目的 |
| :--------------------- | :------------------------------------------|
| `.editorconfig`        | コードエディタ向けの設定です。 [EditorConfig](https://editorconfig.org/)を参照してください。 |
| `.gitignore`           | [Git](https://git-scm.com/)に無視してほしい、意図的な未追跡ファイルの指定をします。 |
| `README.md`            | 紹介用のドキュメントです。|
| `angular.json`         | ワークスペース内のすべてのプロジェクトを対象としたCLIのデフォルト設定をします。CLIの使うビルド、サーブ、テストツールの設定オプションを規定します。たとえば、[TSLint](https://palantir.github.io/tslint/)、[Karma](https://karma-runner.github.io/)や[Protractor](http://www.protractortest.org/)などです。詳しくは [Angular Workspace Configuration](guide/workspace-config)を参照してください。 |
| `package.json`         | ワークスペース内の全プロジェクトが利用可能な[npm package dependencies](guide/npm-packages) の設定をします。具体的なフォーマットやファイルの中身については[npm documentation](https://docs.npmjs.com/files/package.json) を参照してください。|
| `package-lock.json`    | npmクライアントにより`node_modules`にインストールされたすべてのパッケージのバージョン情報を提供します。詳しくは[npm documentation](https://docs.npmjs.com/files/package-lock.json)を参照してください。yarnクライアントを利用している場合は、代わりに[yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock/)ファイルが使われます。 |
| `src/`                  | Source files for the root-level application project. |
| `node_modules`         | [npm packages](guide/npm-packages)をワークスペース全体に提供します。 |
| `tsconfig.json`        | ワークスペース内のアプリケーションが利用する[TypeScript](https://www.typescriptlang.org/) のデフォルト設定です。この中にはTypeScriptとAngularテンプレートのコンパイラオプションが含まれます。[TypeScript Configuration](guide/typescript-configuration)を参照してください。 |
| `tslint.json`          | ワークスペース内のアプリケーションが利用する[TSLint](https://palantir.github.io/tslint/)のデフォルト設定です。 |


### アプリケーションプロジェクトファイル

By default, the CLI command `ng new my-app` creates a workspace folder named "my-app" and generates a new application skeleton in a `src/` folder at the top level of the workspace.
A newly generated application contains source files for a root module, with a root component and template.

When the workspace file structure is in place, you can use the `ng generate` command on the command line to add functionality and data to the application.
This initial root-level application is the *default app* for CLI commands (unless you change the default after creating [additional apps](#multiple-projects)).

<div class="alert is-helpful">

   CLIをコマンドラインで使う以外に、[Angular Console](https://angularconsole.com/) のようなインタラクティブな開発環境を利用することもできます。また、アプリケーションのソースフォルダのファイルや設定ファイルを直接操作することも可能です。

</div>

For a single-application workspace, the `src/` subfolder of the workspace contains the source files (application logic, data, and assets) for the root  application.
For a multi-project workspace, additional projects in the `projects/` folder contain a `project-name/src/` subfolder with the same structure.

### Application source files

Files at the top level of `src/` support testing and running your  application. Subfolders contain the application source and  application-specific configuration.

| APPソース & 設定ファイル    | 目的 |
| :--------------------- | :------------------------------------------|
| `app/`                 | アプリケーションのロジックやデータが定義されているコンポーネントファイルが含まれています。詳しくは[後述](#app-src)を参照してください。|
| `assets/`              | 画像ファイルやその他のアセットファイルなどアプリケーションをビルドした時にそのままコピーされるべきものが格納されます。 | 
| `environments/`        | 特定のターゲット環境向けのビルド設定を持ちます。デフォルトでは名前のない標準開発環境と本番("prod")環境が用意されています。追加でターゲット環境設定を定義することができます。 |
| `favicon.ico`          | ブックマークバーで利用されるアプリケーションのアイコンです。|
| `index.html`           | 誰かがサイトを訪れた際に表示されるメインのHTMLページです。アプリケーションをビルドする時にCLIは自動的にすべてのJavaScriptとCSSファイルを追加するため、基本的には`<script>`や`<link>`タグを手で足す必要はありません。 |
| `main.ts`              | アプリケーションのメインエントリーポイントです。アプリケーションを[JIT compiler](https://angular.io/guide/glossary#jit)でコンパイルし、アプリケーションのルートモジュール(AppModule)をブートストラップしてブラウザで走らせます。[AOT compiler](https://angular.io/guide/aot-compiler)を使うこともできます。コードを変える必要はなく、CLIの`build`と`serve`コマンドに`--aot`フラグをつけるだけで利用できます。 |
| `polyfills.ts`         | ブラウザサポートのためのpolyfillスクリプトを提供します。|
| `styles.sass`          | プロジェクトに適用するスタイルをもつCSSファイルを記載します。拡張子はプロジェクトに設定したスタイルプロセッサーを反映します。|
| `test.ts`              | Angular特有の設定をもつ単体テストのメインエントリーポイントです。基本的にこのファイルを編集する必要はありません。|

{@a app-src}

Inside the `src/` folder, the `app/` folder contains your project's logic and data.
Angular components, templates, and styles go here.

| `src/app/` FILES | PURPOSE |
| :-------------------------- | :------------------------------------------|
| `app/app.component.ts`      | Defines the logic for the app's root component, named `AppComponent`. The view associated with this root component becomes the root of the [view hierarchy](guide/glossary#view-hierarchy) as you add components and services to your  application. |
| `app/app.component.html`    | Defines the HTML template associated with the root `AppComponent`. |
| `app/app.component.css`     | Defines the base CSS stylesheet for the root `AppComponent`. |
| `app/app.component.spec.ts` | Defines a unit test for the root `AppComponent`. |
| `app/app.module.ts`         | Defines the root module, named `AppModule`, that tells Angular how to assemble the application. Initially declares only the `AppComponent`. As you add more components to the app, they must be declared here. |

### Application configuration files

The application-specific configuration files for the root application reside at the workspace root level.
For a multi-project workspace, project-specific configuration files are in the project root, under `projects/project-name/`.

Project-specific [TypeScript](https://www.typescriptlang.org/) configuration files inherit from the workspace-wide `tsconfig.json`, and project-specific [TSLint](https://palantir.github.io/tslint/) configuration files inherit from the workspace-wide `tslint.json`.

| APPLICATION-SPECIFIC CONFIG FILES    | PURPOSE |
| :--------------------- | :------------------------------------------|
| `browserslist`         | ターゲットブラウザとさまざまなフロントエンドツールのNode.jsのバージョンの共有設定をします。詳しくは[Browserslist on GitHub](https://github.com/browserslist/browserslist)を参照してください。 |
| `karma.conf.js`      | Application-specific [Karma](https://karma-runner.github.io/2.0/config/configuration-file.html) configuration. |
| `tsconfig.app.json`    | Application-specific [TypeScript](https://www.typescriptlang.org/) configuration, including TypeScript and Angular template compiler options. See [TypeScript Configuration](guide/typescript-configuration). |
| `tsconfig.spec.json`   | [TypeScript](https://www.typescriptlang.org/) configuration for the application tests. See [TypeScript Configuration](guide/typescript-configuration). |
| `tslint.json`          | Application-specific [TSLint](https://palantir.github.io/tslint/) configuration. |

### End-to-end test files

`e2e/` フォルダはルートレベルのアプリケーションに対応したエンドツーエンドテストの設定とソースファイルを持ちます。

For a multi-project workspace, application-specific end-to-end tests are in the project root, under `projects/project-name/e2e/`.

<code-example language="none" linenums="false">
  e2e/
     src/                 (end-to-end tests for my-app)
        app.e2e-spec.ts
        app.po.ts
    protractor.conf.js  (テストツールの設定)
    tsconfig.json   (ワークスペースのtsconfig.jsonから引き継いだTypeScriptの設定)
</code-example>

{@a multiple-projects}

## Multiple projects

A multi-project workspace is suitable for an enterprise that uses a single repository and global configuration for all Angular projects (the "monorepo" model). A multi-project workspace also supports library development.

### Setting up for a multi-project workspace

If you intend to have multiple projects in a workspace, you can skip the initial application generation when you create the workspace, and give the workspace a unique name.
The following command creates a workspace with all of the workspace-wide configuration files, but no root-level application.

<code-example language="bash" linenums="false">
ng new my-workspace --createApplication="false"
</code-example>

You can then generate apps and libraries with names that are unique within the workspace.

<code-example language="bash" linenums="false">
cd my-workspace
ng generate application my-first-app
</code-example>

### Multiple project file structure

The first explicitly generated application goes into the `projects/` folder along with all other projects in the workspace.
Newly generated libraries are also added under `projects/`.
When you create projects this way, the file structure of the workspace is entirely consistent with the structure of the [workspace configuration file](guide/workspace-config), `angular.json`.

<code-example language="none" linenums="false">
my-workspace/
  ...             (workspace-wide config files)
  projects/       (generated applications and libraries)
    my-first-app/ --(an explicitly generated application)
      ...         --(application-specific config)
      e2e/        ----(corresponding e2e tests)
         src/     ----(e2e tests source)
         ...      ----(e2e-specific config)
      src/        --(source and support files for application)
    my-lib/       --(a generated library)
      ...         --(library-specific config)
      src/        --source and support files for library)
</code-example>

## Library project files

When you generate a library using the CLI (with a command such as `ng generate library my-lib`), the generated files go into the projects/ folder of the workspace. For more information about creating your own libraries, see  [Creating Libraries](https://angular.io/guide/creating-libraries).

Libraries (unlike applications and their associated e2e projects) have their own `package.json` configuration files.

Under the `projects/` folder, the `my-lib` folder contains your library code.

| LIBRARY SOURCE FILES | PURPOSE                                                                      |
| :------------------- | :----------------------------------------------------------------------------|
| `src/lib`           |  Contains your library project's logic and data. Like an application project, a library project can contain components, services, modules, directives, and pipes.                                                            |
| `src/test.ts`       | The main entry point for your unit tests, with some library-specific configuration. You don't typically need to edit this file.                                                                                            |
| `src/public-api.ts`  | Specifies all files that are exported from your library.                                                                                                                                                                     |
| `karma.conf.js`      | Library-specific [Karma](https://karma-runner.github.io/2.0/config/configuration-file.html) configuration.                                                                                                                   |
| `ng-package.json`    | Configuration file used by [ng-packagr](https://github.com/ng-packagr/ng-packagr) for building your library.                                                                                                                 |
| `package.json`       | Configures [npm package dependencies](guide/npm-packages) that are required for this library.                                                                                                                                |
| `tsconfig.lib.json`  | Library-specific [TypeScript](https://www.typescriptlang.org/) configuration, including TypeScript and Angular template compiler options. See [TypeScript Configuration](guide/typescript-configuration).            |
| `tsconfig.spec.json` | [TypeScript](https://www.typescriptlang.org/) configuration for the library tests. See [TypeScript Configuration](guide/typescript-configuration).                                                                     |
| `tslint.json`        | Library-specific [TSLint](https://palantir.github.io/tslint/) configuration. |
