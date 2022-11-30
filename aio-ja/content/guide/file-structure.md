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
| `angular.json`         | ワークスペース内のすべてのプロジェクトを対象としたCLIのデフォルト設定をします。CLIの使うビルド、サーブ、テストツールの設定オプションを規定します。たとえば、[Karma](https://karma-runner.github.io/)や[Protractor](https://www.protractortest.org/)などです。詳しくは [Angularワークスペースの設定](guide/workspace-config)を参照してください。 |
| `package.json`         | ワークスペース内の全プロジェクトが利用可能な[npmパッケージの依存関係](guide/npm-packages) の設定をします。具体的なフォーマットやファイルの中身については[npm documentation](https://docs.npmjs.com/files/package.json) を参照してください。|
| `package-lock.json`    | npmクライアントにより`node_modules`にインストールされたすべてのパッケージのバージョン情報を提供します。詳しくは[npm documentation](https://docs.npmjs.com/files/package-lock.json)を参照してください。yarnクライアントを利用している場合は、代わりに[yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock/)ファイルが使われます。 |
| `src/`                 | ルートレベルのアプリケーションプロジェクトのソースファイル。 |
| `node_modules`         | [npmパッケージ](guide/npm-packages)をワークスペース全体に提供します。 |
| `tsconfig.json`    | ワークスペースのプロジェクトの[TypeScript](https://www.typescriptlang.org/)の基本設定。他のすべての設定ファイルはこの基本となるファイルを継承します。詳しくはTypeScriptドキュメントの[extendsによる設定の継承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends)のセクションを参照してください。|


### アプリケーションプロジェクトファイル

デフォルトでは、CLIコマンド `ng new my-app` は "my-app" という名前のワークスペースフォルダを作成し、ワークスペースの最上位の `src/` フォルダに新しいアプリケーションスケルトンを生成します。
新しく生成されたアプリケーションには、ルートコンポーネントとテンプレートを含むルートモジュールのソースファイルが含まれています。

ワークスペースのファイル構造が整ったら、コマンドラインで `ng generate` コマンドを使用して機能とデータをアプリケーションに追加できます。
この初期ルートレベルアプリケーションは、CLIコマンドの *デフォルトアプリケーション* です（ [追加のアプリケーション](#multiple-projects) を作成したあとでデフォルトを変更しない限り）。

<div class="alert is-helpful">

   CLIをコマンドラインで使う以外に、アプリケーションのソースフォルダのファイルや設定ファイルを直接操作することも可能です。

</div>

単一アプリケーションワークスペースの場合、ワークスペースの `src/` サブフォルダーには、ルートアプリケーションのソースファイル（アプリケーションロジック、データ、およびアセット）が含まれています。
マルチプロジェクトワークスペースの場合、 `projects/` フォルダ内の追加のプロジェクトには、同じ構造の `project-name/src/` サブフォルダが含まれています。

### アプリケーションソースファイル

`src/` の最上位レベルにあるファイルで、アプリケーションのテストと実行のサポートを行います。 サブフォルダには、アプリケーションソースとアプリケーション固有の設定が含まれています。

| APPソース & 設定ファイル  | 目的 |
| :--------------------- | :------------------------------------------|
| `app/`                 | アプリケーションのロジックやデータが定義されているコンポーネントファイルが含まれています。詳しくは[後述](#app-src)を参照してください。|
| `assets/`              | 画像ファイルやその他のアセットファイルなどアプリケーションをビルドした時にそのままコピーされるべきものが格納されます。 |
| `favicon.ico`          | ブックマークバーで利用されるアプリケーションのアイコンです。|
| `index.html`           | 誰かがサイトを訪れた際に表示されるメインのHTMLページです。アプリケーションをビルドする時にCLIは自動的にすべてのJavaScriptとCSSファイルを追加するため、基本的には`<script>`や`<link>`タグを手で足す必要はありません。 |
| `main.ts`              | アプリケーションのメインエントリーポイントです。アプリケーションを[JIT compiler](guide/glossary#jit)でコンパイルし、アプリケーションのルートモジュール(AppModule)をブートストラップしてブラウザで走らせます。[AOT compiler](guide/aot-compiler)を使うこともできます。コードを変える必要はなく、CLIの`build`と`serve`コマンドに`--aot`フラグをつけるだけで利用できます。 |
| `styles.sass`          | プロジェクトに適用するスタイルをもつCSSファイルを記載します。拡張子はプロジェクトに設定したスタイルプロセッサーを反映します。|

<div class="alert is-helpful">

New Angular projects use strict mode by default. If this is not desired you can opt-out when creating the project. For more information, see [Strict mode](/guide/strict-mode).

</div>

{@a app-src}

`src/` フォルダ内の `app/` フォルダには、プロジェクトのロジックとデータが含まれています。
Angularコンポーネント、テンプレート、スタイルはここにあります。

| `src/app/` ファイル          | 目的 |
| :-------------------------- | :------------------------------------------|
| `app/app.component.ts`      | `AppComponent` という名前のアプリケーションのルートコンポーネントのロジックを定義します。 このルートコンポーネントに関連付けられたビューは、コンポーネントやサービスをアプリケーションに追加したときに [ビュー階層](guide/glossary#view-hierarchy) のルートになります。 |
| `app/app.component.html`    | ルート `AppComponent` に関連付けられているHTMLテンプレートを定義します。 |
| `app/app.component.css`     | ルート `AppComponent` の基本CSSスタイルシートを定義します。 |
| `app/app.component.spec.ts` | ルート `AppComponent` のユニットテストを定義します。 |
| `app/app.module.ts`         | `AppModule` という名前のルートモジュールを定義し、Angularにアプリケーションの組み立て方法を指示します。最初は `AppComponent` のみを宣言しています。 アプリケーションにコンポーネントを追加すると、それらをここで宣言する必要があります。 |

### アプリケーション設定ファイル {@a application-configuration-files}

ルートアプリケーション用のアプリケーション固有の設定ファイルは、ワークスペースのルートレベルにあります。
マルチプロジェクトワークスペースの場合、プロジェクト固有の設定ファイルはプロジェクトルートの `projects/project-name/` にあります。

プロジェクト固有の [TypeScript](https://www.typescriptlang.org/) 設定ファイルは、ワークスペース全体の `tsconfig.json` から継承します。

| アプリケーション固有の設定ファイル    | 目的 |
| :--------------------- | :------------------------------------------|
| `tsconfig.app.json`    | TypeScriptおよびAngularテンプレートコンパイラオプションを含む、アプリケーション固有の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) と [Angular Compiler Options](guide/angular-compiler-options)を参照してください。 |
| `tsconfig.spec.json`   | アプリケーションテスト用の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) を参照してください。 |


{@a multiple-projects}

## マルチプロジェクト

マルチプロジェクトワークスペースは、すべてのAngularプロジェクトに対して単一のリポジトリとグローバル構成を使用する企業に適しています（ "monorepo" モデル）。 マルチプロジェクトワークスペースもライブラリ開発をサポートします。

### マルチプロジェクトワークスペースの設定

ワークスペースに複数のプロジェクトを含める場合は、ワークスペースを作成するときに最初のアプリケーション生成をスキップして、ワークスペースにユニークな名前を付けることができます。
次のコマンドは、すべてのワークスペース全体の構成ファイルを使用してワークスペースを作成しますが、ルートレベルのアプリケーションは作成しません。

<code-example language="bash">
ng new my-workspace --no-create-application
</code-example>

その後、ワークスペース内でユニークな名前でアプリケーションやライブラリを生成できます。

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
      src/        --(アプリケーションのソースファイルとサポートファイル)
    my-lib/       --(生成されたライブラリ)
      ...         --(ライブラリ固有の設定)
      src/        --(ライブラリのソースファイルとサポートファイル)
</code-example>

## ライブラリプロジェクトファイル {@a library-project-files}

CLIを使用して（ `ng generate library my-lib` などのコマンドを使用して）ライブラリを生成すると、生成されたファイルはワークスペースの`projects/`フォルダに入ります。 独自のライブラリを作成する方法の詳細については、 [ライブラリの作成](guide/creating-libraries) を参照してください。

ライブラリは（アプリケーションとは異なり）独自の `package.json` 設定ファイルを持っています。

`projects/` フォルダの下の `my-lib` フォルダには、ライブラリコードが含まれています。

| ライブラリソースファイル | 目的 |
| :------------------- | :----------------------------------------------------------------------------|
| `src/lib`            | ライブラリプロジェクトのロジックとデータが含まれています。 アプリケーションプロジェクトと同様に、ライブラリプロジェクトには、コンポーネント、サービス、モジュール、ディレクティブ、およびパイプを含めることができます。 |
| `src/public-api.ts`  | ライブラリからエクスポートされたすべてのファイルを指定します。 |
| `ng-package.json`    | ライブラリを構築するために [ng-packagr](https://github.com/ng-packagr/ng-packagr) によって使用される設定ファイル。 |
| `package.json`       | このライブラリに必要な [npmパッケージの依存関係](guide/npm-packages) を設定します。 |
| `tsconfig.lib.json`  | TypeScriptおよびAngularテンプレートコンパイラオプションを含む、ライブラリ固有の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) を参照してください。 |
| `tsconfig.lib.prod.json`  | Library-specific [TypeScript](https://www.typescriptlang.org/) configuration that is used when building the library in production mode.              |
| `tsconfig.spec.json` | ライブラリテスト用の [TypeScript](https://www.typescriptlang.org/) の設定。 [TypeScriptの設定](guide/typescript-configuration) を参照してください。 |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-24
