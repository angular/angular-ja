# ワークスペースとプロジェクトのファイル構造

アプリケーションはAngular[ワークスペース](guide/glossary#workspace)のコンテキストで開発されます。 ワークスペースには1つ、または複数の[プロジェクト](guide/glossary#project)のファイルが含まれています。プロジェクトとは、スタンドアロンのアプリケーション、共有ライブラリを含むファイル群のことを指します。

Angular CLIの `ng new` コマンドはワークスペースを作成します。

<code-example language="bash">
ng new &lt;my-project&gt;
</code-example>

このコマンドを実行すると、CLIは必要なAngular npmパッケージとその他の依存関係を新しいワークスペースに *my-project* という名前のルートレベルのアプリケーションと共にインストールします。
ワークスペースのルートフォルダには、さまざまなサポートファイルと設定ファイル、およびカスタマイズ可能な生成された説明テキストを含むREADMEファイルが含まれています。

デフォルトで `ng new` は、ワークスペースのルートレベルに初期スケルトンアプリケーションをそのエンドツーエンドテストと共に作成します。
スケルトンは、実行する準備ができていて変更が簡単な、シンプルなWelcomeアプリケーション用です。
ルートレベルのアプリケーションはワークスペースと同じ名前を持ち、ソースファイルはワークスペースの `src/` サブフォルダーにあります。

このデフォルトの動作は、各アプリケーションが独自のワークスペースに存在する典型的な「マルチリポジトリ」開発スタイルに適しています。
初心者および中級者は、アプリケーションごとに別々のワークスペースを作成するために `ng new` を使用することをお勧めします。

Angularは [複数のプロジェクト](#multiple-projects) をもつワークスペースもサポートします。
このタイプの開発環境は、 [共有可能なライブラリ](guide/glossary#library) を開発している上級ユーザー、
および単一リポジトリとすべてのAngularプロジェクトのグローバル構成を備えた "monorepo" 開発スタイルを使用する企業に適しています。

monorepoワークスペースをセットアップするには、ルートアプリケーションの作成をスキップする必要があります。
次の [マルチプロジェクトワークスペースの設定](#multiple-projects) を参照してください。

## ワークスペースの設定ファイル

ワークスペース内のすべてのプロジェクトは [CLI構成コンテキスト](guide/workspace-config) を共有します。
ワークスペースの最上位には、ワークスペース全体の設定ファイル、ルートレベルのアプリケーション用の設定ファイル、およびルートレベルのアプリケーションのソースファイルとテストファイル用のサブフォルダがあります。

| ワークスペースの設定ファイル | 目的 |
| :--------------------- | :------------------------------------------|
| `.editorconfig`        | コードエディタ向けの設定です。 [EditorConfig](https://editorconfig.org/)を参照してください。 |
| `.gitignore`           | [Git](https://git-scm.com/)に無視してほしい、意図的な未追跡ファイルの指定をします。 |
| `README.md`            | 紹介用のドキュメントです。|
| `angular.json`         | ワークスペース内のすべてのプロジェクトを対象としたCLIのデフォルト設定をします。CLIの使うビルド、サーブ、テストツールの設定オプションを規定します。たとえば、[TSLint](https://palantir.github.io/tslint/)、[Karma](https://karma-runner.github.io/)や[Protractor](http://www.protractortest.org/)などです。詳しくは [Angularワークスペースの設定](guide/workspace-config)を参照してください。 |
| `package.json`         | ワークスペース内の全プロジェクトが利用可能な[npmパッケージの依存関係](guide/npm-packages) の設定をします。具体的なフォーマットやファイルの中身については[npm documentation](https://docs.npmjs.com/files/package.json) を参照してください。|
| `package-lock.json`    | npmクライアントにより`node_modules`にインストールされたすべてのパッケージのバージョン情報を提供します。詳しくは[npm documentation](https://docs.npmjs.com/files/package-lock.json)を参照してください。yarnクライアントを利用している場合は、代わりに[yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock/)ファイルが使われます。 |
| `src/`                 | ルートレベルのアプリケーションプロジェクトのソースファイル。 |
| `node_modules`         | [npmパッケージ](guide/npm-packages)をワークスペース全体に提供します。 |
| `tsconfig.json`         | The `tsconfig.json` file is a ["Solution Style"](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#support-for-solution-style-tsconfigjson-files) TypeScript configuration file. Code editors and TypeScript’s language server use this file to improve development experience. Compilers do not use this file. |
| `tsconfig.base.json`    | The base [TypeScript](https://www.typescriptlang.org/) configuration for projects in the workspace. All other configuration files inherit from this base file. For more information, see the [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) section of the TypeScript documentation.|
| `tslint.json`          | ワークスペース内のアプリケーションが利用する[TSLint](https://palantir.github.io/tslint/)のデフォルト設定です。 |


### アプリケーションプロジェクトファイル

デフォルトでは、CLIコマンド `ng new my-app` は "my-app" という名前のワークスペースフォルダを作成し、ワークスペースの最上位の `src/` フォルダに新しいアプリケーションスケルトンを生成します。
新しく生成されたアプリケーションには、ルートコンポーネントとテンプレートを含むルートモジュールのソースファイルが含まれています。

ワークスペースのファイル構造が整ったら、コマンドラインで `ng generate` コマンドを使用して機能とデータをアプリケーションに追加できます。
この初期ルートレベルアプリケーションは、CLIコマンドの *デフォルトアプリケーション* です（ [追加のアプリケーション](#multiple-projects) を作成したあとでデフォルトを変更しない限り）。

<div class="alert is-helpful">

   CLIをコマンドラインで使う以外に、[Angular Console](https://angularconsole.com/) のようなインタラクティブな開発環境を利用することもできます。また、アプリケーションのソースフォルダのファイルや設定ファイルを直接操作することも可能です。

</div>

単一アプリケーションワークスペースの場合、ワークスペースの `src/` サブフォルダーには、ルートアプリケーションのソースファイル（アプリケーションロジック、データ、およびアセット）が含まれています。
マルチプロジェクトワークスペースの場合、 `projects/` フォルダ内の追加のプロジェクトには、同じ構造の `project-name/src/` サブフォルダが含まれています。

### アプリケーションソースファイル

`src/` の最上位レベルにあるファイルで、アプリケーションのテストと実行のサポートを行います。 サブフォルダには、アプリケーションソースとアプリケーション固有の設定が含まれています。

| APPソース & 設定ファイル  | 目的 |
| :--------------------- | :------------------------------------------|
| `app/`                 | アプリケーションのロジックやデータが定義されているコンポーネントファイルが含まれています。詳しくは[後述](#app-src)を参照してください。|
| `assets/`              | 画像ファイルやその他のアセットファイルなどアプリケーションをビルドした時にそのままコピーされるべきものが格納されます。 | 
| `environments/`        | 特定のターゲット環境向けのビルド設定を持ちます。デフォルトでは名前のない標準開発環境と本番("prod")環境が用意されています。追加でターゲット環境設定を定義することができます。 |
| `favicon.ico`          | ブックマークバーで利用されるアプリケーションのアイコンです。|
| `index.html`           | 誰かがサイトを訪れた際に表示されるメインのHTMLページです。アプリケーションをビルドする時にCLIは自動的にすべてのJavaScriptとCSSファイルを追加するため、基本的には`<script>`や`<link>`タグを手で足す必要はありません。 |
| `main.ts`              | アプリケーションのメインエントリーポイントです。アプリケーションを[JIT compiler](guide/glossary#jit)でコンパイルし、アプリケーションのルートモジュール(AppModule)をブートストラップしてブラウザで走らせます。[AOT compiler](guide/aot-compiler)を使うこともできます。コードを変える必要はなく、CLIの`build`と`serve`コマンドに`--aot`フラグをつけるだけで利用できます。 |
| `polyfills.ts`         | ブラウザサポートのためのpolyfillスクリプトを提供します。|
| `styles.sass`          | プロジェクトに適用するスタイルをもつCSSファイルを記載します。拡張子はプロジェクトに設定したスタイルプロセッサーを反映します。|
| `test.ts`              | Angular特有の設定をもつ単体テストのメインエントリーポイントです。基本的にこのファイルを編集する必要はありません。|

<div class="alert is-helpful">

If you create an application using Angular's strict mode, you will also have an additional `package.json` file in the `src/app` directory. For more information, see [Strict mode](/guide/strict-mode).

</div>

{@a app-src}

`src/` フォルダ内の `app/` フォルダには、プロジェクトのロジックとデータが含まれています。
Angularコンポーネント、テンプレート、スタイルはここにあります。

| `src/app/` ファイル          | 目的 |
| :-------------------------- | :------------------------------------------|
| `app/app.component.ts`      | `AppComponent` という名前のアプリのルートコンポーネントのロジックを定義します。 このルートコンポーネントに関連付けられたビューは、コンポーネントやサービスをアプリケーションに追加したときに [ビュー階層](guide/glossary#view-hierarchy) のルートになります。 |
| `app/app.component.html`    | ルート `AppComponent` に関連付けられているHTMLテンプレートを定義します。 |
| `app/app.component.css`     | ルート `AppComponent` の基本CSSスタイルシートを定義します。 |
| `app/app.component.spec.ts` | ルート `AppComponent` のユニットテストを定義します。 |
| `app/app.module.ts`         | `AppModule` という名前のルートモジュールを定義し、Angularにアプリケーションの組み立て方法を指示します。最初は `AppComponent` のみを宣言しています。 アプリにコンポーネントを追加すると、それらをここで宣言する必要があります。 |
| `app/package.json`              | This file is generated only in applications created using `--strict` mode. This file is not used by package managers. It is used to tell the tools and bundlers whether the code under this directory is free of non-local [side-effects](guide/strict-mode#side-effect). |

### アプリケーション設定ファイル {@a application-configuration-files}

ルートアプリケーション用のアプリケーション固有の設定ファイルは、ワークスペースのルートレベルにあります。
マルチプロジェクトワークスペースの場合、プロジェクト固有の設定ファイルはプロジェクトルートの `projects/project-name/` にあります。

プロジェクト固有の [TypeScript](https://www.typescriptlang.org/) 設定ファイルは、ワークスペース全体の `tsconfig.base.json` から継承し、プロジェクト固有の [TSLint](https://palantir.github.io/tslint/) 設定ファイルは、ワークスペース全体の `tslint.json` から継承します。

| アプリケーション固有の設定ファイル    | 目的 |
| :--------------------- | :------------------------------------------|
| `.browserslistrc`         | ターゲットブラウザとさまざまなフロントエンドツールのNode.jsのバージョンの共有設定をします。詳しくは[Browserslist on GitHub](https://github.com/browserslist/browserslist) を参照してください。 |
| `karma.conf.js`      | アプリケーション固有の [Karma](https://karma-runner.github.io/2.0/config/configuration-file.html) の設定。 |
| `tsconfig.app.json`    | TypeScriptおよびAngularテンプレートコンパイラオプションを含む、アプリケーション固有の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) と [Angular Compiler Options](guide/angular-compiler-options)を参照してください。 |
| `tsconfig.spec.json`   | アプリケーションテスト用の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) を参照してください。 |
| `tslint.json`          | アプリケーション固有の [TSLint](https://palantir.github.io/tslint/) の設定。 |

### エンドツーエンドテストのファイル

`e2e/` フォルダはルートレベルのアプリケーションに対応したエンドツーエンドテストの設定とソースファイルを持ちます。

マルチプロジェクトワークスペースの場合、アプリケーション固有のエンドツーエンドテストはプロジェクトルートの下 `projects/project-name/e2e/` にあります。

<code-example language="none">
  e2e/
     src/                 (end-to-end tests for my-app)
        app.e2e-spec.ts
        app.po.ts
    protractor.conf.js  (テストツールの設定)
    tsconfig.json   (ワークスペースのtsconfig.jsonから引き継いだTypeScriptの設定)
</code-example>

{@a multiple-projects}

## マルチプロジェクト

マルチプロジェクトワークスペースは、すべてのAngularプロジェクトに対して単一のリポジトリとグローバル構成を使用する企業に適しています（ "monorepo" モデル）。 マルチプロジェクトワークスペースもライブラリ開発をサポートします。

### マルチプロジェクトワークスペースの設定

ワークスペースに複数のプロジェクトを含める場合は、ワークスペースを作成するときに最初のアプリケーション生成をスキップして、ワークスペースにユニークな名前を付けることができます。
次のコマンドは、すべてのワークスペース全体の構成ファイルを使用してワークスペースを作成しますが、ルートレベルのアプリケーションは作成しません。

<code-example language="bash">
ng new my-workspace --createApplication="false"
</code-example>

その後、ワークスペース内でユニークな名前でアプリやライブラリを生成できます。

<code-example language="bash">
cd my-workspace
ng generate application my-first-app
</code-example>

### マルチプロジェクトのファイル構造

最初に明示的に生成されたアプリケーションは、ワークスペース内の他のすべてのプロジェクトと共に `projects/` フォルダーに入ります。
新しく生成されたライブラリも `projects/` の下に追加されています。
この方法でプロジェクトを作成すると、ワークスペースのファイル構造は、 [ワークスペース構成ファイル](guide/workspace-config) 、 `angular.json` の構造と完全に一致します。

<code-example language="none">
my-workspace/
  ...             (ワークスペース全体の設定ファイル)
  projects/       (生成されたアプリケーションとライブラリ)
    my-first-app/ --(明示的に生成されたアプリケーション)
      ...         --(アプリケーション固有の設定)
      e2e/        ----(対応するe2eテスト)
         src/     ----(e2eテストソース)
         ...      ----(e2e固有の設定)
      src/        --(アプリケーションのソースファイルとサポートファイル)
    my-lib/       --(生成されたライブラリ)
      ...         --(ライブラリ固有の設定)
      src/        --(ライブラリのソースファイルとサポートファイル)
</code-example>

## ライブラリプロジェクトファイル {@a library-project-files}

CLIを使用して（ `ng generate library my-lib` などのコマンドを使用して）ライブラリを生成すると、生成されたファイルはワークスペースのprojects/フォルダに入ります。 独自のライブラリを作成する方法の詳細については、 [ライブラリの作成](guide/creating-libraries) を参照してください。

ライブラリは（アプリケーションや関連するe2eプロジェクトとは異なり）独自の `package.json` 設定ファイルを持っています。

`projects/` フォルダの下の `my-lib` フォルダには、ライブラリコードが含まれています。

| ライブラリソースファイル | 目的 |
| :------------------- | :----------------------------------------------------------------------------|
| `src/lib`            | ライブラリプロジェクトのロジックとデータが含まれています。 アプリケーションプロジェクトと同様に、ライブラリプロジェクトには、コンポーネント、サービス、モジュール、ディレクティブ、およびパイプを含めることができます。 |
| `src/test.ts`        | 単体テストの主な入り口で、ライブラリ固有の設定がいくつかあります。通常このファイルを編集する必要はありません。 |
| `src/public-api.ts`  | ライブラリからエクスポートされたすべてのファイルを指定します。 |
| `karma.conf.js`      | ライブラリ固有の [Karma](https://karma-runner.github.io/2.0/config/configuration-file.html) の設定 |
| `ng-package.json`    | ライブラリを構築するために [ng-packagr](https://github.com/ng-packagr/ng-packagr) によって使用される設定ファイル。 |
| `package.json`       | このライブラリに必要な [npmパッケージの依存関係](guide/npm-packages) を設定します。 |
| `tsconfig.lib.json`  | TypeScriptおよびAngularテンプレートコンパイラオプションを含む、ライブラリ固有の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) を参照してください。 |
| `tsconfig.spec.json` | ライブラリテスト用の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) を参照してください。 |
| `tslint.json`        | ライブラリ固有の [TSLint](https://palantir.github.io/tslint/) の設定 |
