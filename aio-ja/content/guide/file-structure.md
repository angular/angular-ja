# ワークスペースとプロジェクトのファイル構造

アプリケーションはAngular[ワークスペース](guide/glossary#workspace)のコンテキストで開発されます。 ワークスペースには1つ、または複数の[プロジェクト](guide/glossary#project)のファイルが含まれています。プロジェクトとは、スタンドアロンのアプリケーション、ライブラリやエンドツーエンド(e2e)テストセットを含むファイル群のことを指します。

Angular CLIの`ng new <project_name>`コマンドで開発を始めることができます。このコマンドを走らせると、CLIは必要なAngularのnpmパッケージとその他の依存関係を新しいワークスペースにインストールします。このとき、ルートフォルダの名前は*project_name*になります。
同時に次のワークスペースとスタータープロジェクトのファイルも作成します。

* *project_name*と呼ばれる初期スケルトンアプリケーションプロジェクト(`src/`サブフォルダ内)
* エンドツーエンド(e2e)テストプロジェクト(`e2e/`サブフォルダ内)
* 関連する設定ファイル

初期のアプリケーションプロジェクトにはすぐに起動できる状態のシンプルなWelcomeアプリケーションが含まれています。

## ワークスペースのファイル

ワークスペースの一番上の階層にはワークスペース全体に関わる設定ファイルが置かれています。

| ワークスペースの設定ファイル    | 　目的 |
| :--------------------- | :------------------------------------------|
| `.editorconfig`        | コードエディタ向けの設定です。 [EditorConfig](https://editorconfig.org/)を参照してください。 |
| `.gitignore`           | [Git](https://git-scm.com/)に無視してほしい、意図的な未追跡ファイルの指定をします。 |
| `angular.json`         | ワークスペース内のすべてのプロジェクトを対象としたCLIのデフォルト設定をします。CLIの使うビルド、サーブ、テストツールの設定オプションを規定します。たとえば、[TSLint](https://palantir.github.io/tslint/)、[Karma](https://karma-runner.github.io/)や[Protractor](http://www.protractortest.org/)などです。詳しくは [Angular Workspace Configuration](guide/workspace-config)を参照してください。 |
| `node_modules`         | [npm packages](guide/npm-packages)をワークスペース全体に提供します。 |
| `package.json`         | ワークスペース内の全プロジェクトが利用可能な[npm package dependencies](guide/npm-packages) の設定をします。具体的なフォーマットやファイルの中身については[npm documentation](https://docs.npmjs.com/files/package.json) を参照してください。|
| `package-lock.json`    | npmクライアントにより`node_modules`にインストールされたすべてのパッケージのバージョン情報を提供します。詳しくは[npm documentation](https://docs.npmjs.com/files/package-lock.json)を参照してください。yarnクライアントを利用している場合は、代わりに[yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock/)ファイルが使われます。 |
| `tsconfig.json`        | ワークスペース内のアプリケーションが利用する[TypeScript](https://www.typescriptlang.org/) のデフォルト設定です。この中にはTypeScriptとAngularテンプレートのコンパイラオプションが含まれます。[TypeScript Configuration](guide/typescript-configuration)を参照してください。 |
| `tslint.json`          | ワークスペース内のアプリケーションが利用する[TSLint](https://palantir.github.io/tslint/)のデフォルト設定です。 |
| `README.md`            | 紹介用のドキュメントです。|

ワークスペース内のすべてのプロジェクトは [CLI configuration context](guide/workspace-config)を共有します。
プロジェクト毎の[TypeScript](https://www.typescriptlang.org/)設定ファイルはワークスペース全体向けの`tsconfig.*.json`を受け継ぎます。また、アプリケーション毎の[TSLint](https://palantir.github.io/tslint/)設定ファイルもワークスペース全体向けの`tslint.json`を受け継ぎます。

### デフォルトのアプリケーションプロジェクトファイル

CLIの`ng new my-app`コマンドは"my-app"という名前のワークスペースフォルダを作成して、新しいアプリケーションスケルトンを生成します。
この初期アプリケーションは(追加でアプリケーションを作成してデフォルトを変更しない限り)CLIコマンドの*デフォルトアプリケーション*になります。

新しく生成されたアプリケーションはルートモジュールのソースファイルを持っています。これには、ルートコンポーネントとテンプレートが含まれます。
ワークスペースのファイル構造が正しく整えられている場合は、`ng generate`コマンドを使い、コマンドラインから機能やデータを初期アプリケーションに追加することができます。

<div class="alert is-helpful">

   CLIをコマンドラインで使う以外に、[Angular Console](https://angularconsole.com/) のようなインタラクティブな開発環境を利用することもできます。また、アプリケーションのソースフォルダのファイルや設定ファイルを直接操作することも可能です。

</div>

`src/`サブフォルダは初期アプリケーション向けの設定ファイルと共にソースフォルダ(アプリケーションのロジック、データ、アセット)を持っています。
ワークスペース全体向けの`node_modules`依存関係はこのプロジェクトからも参照可能です。

| APPソース & 設定ファイル    | 目的 |
| :--------------------- | :------------------------------------------|
| `app/`                 | アプリケーションのロジックやデータが定義されているコンポーネントファイルが含まれています。詳しくは[App source folder](#app-src)を参照してください。|
| `assets/`              | 画像ファイルやその他のアセットファイルなどアプリケーションをビルドした時にそのままコピーされるべきものが格納されます。 | 
| `environments/`        | 特定のターゲット環境向けのビルド設定を持ちます。デフォルトでは名前のない標準開発環境と本番("prod")環境が用意されています。追加でターゲット環境設定を定義することができます。 |
| `browserlist`          | ターゲットブラウザとさまざまなフロントエンドツールのNode.jsのバージョンの共有設定をします。詳しくは[Browserlist on GitHub](https://github.com/browserslist/browserslist)を参照してください。 |
| `favicon.ico`          | ブックマークバーで利用されるアプリケーションのアイコンです。|
| `index.html`           | 誰かがサイトを訪れた際に表示されるメインのHTMLページです。アプリケーションをビルドする時にCLIは自動的にすべてのJavaScriptとCSSファイルを追加するため、基本的には`<script>`や`<link>`タグを手で足す必要はありません。 |
| `main.ts`              | アプリケーションのメインエントリーポイントです。アプリケーションを[JIT compiler](https://angular.io/guide/glossary#jit)でコンパイルし、アプリケーションのルートモジュール(AppModule)をブートストラップしてブラウザで走らせます。[AOT compiler](https://angular.io/guide/aot-compiler)を使うこともできます。コードを変える必要はなく、CLIの`build`と`serve`コマンドに`--aot`フラグをつけるだけで利用できます。 |
| `polyfills.ts`         | ブラウザサポートのためのpolyfillスクリプトを提供します。|
| `styles.sass`          | プロジェクトに適用するスタイルをもつCSSファイルを記載します。拡張子はプロジェクトに設定したスタイルプロセッサーを反映します。|
| `test.ts`              | Angular特有の設定をもつ単体テストのメインエントリーポイントです。基本的にこのファイルを編集する必要はありません。|
| `tsconfig.app.json`   | ワークスペース全体向けの`tsconfig.json`ファイルを受け継ぐものです。 |
| `tsconfig.spec.json`  | ワークスペース全体向けの`tsconfig.json`ファイルを受け継ぐものです。 |
| `tslint.json`         | ワークスペース全体向けの`tslint.json`ファイルを受け継ぐものです。|

### アプリケーションプロジェクトのデフォルトe2eファイル

`e2e/`サブフォルダは初期アプリケーションに対応したエンドツーエンドテストの設定とソースファイルを持ちます。ワークスペース全体向けの`node_modules`依存関係はこのプロジェクトからも参照可能です。

<code-example language="none" linenums="false">
my-app/
  e2e/                  (my-appのe2eテストアプリ)
    src/                (アプリのソースファイル)
    protractor.conf.js  (テストツールの設定)
    tsconfig.e2e.json   (ワークスペースのtsconfig.jsonから引き継いだTypeScriptの設定)
</code-example>

### 追加のアプリケーション、ライブラリ向けのプロジェクトフォルダ

ワークスペースに新たなプロジェクトを作成した時、CLIは新たな*ワークスペース*の`/projects`フォルダを作成し、そこに生成されたファイルを追加します。

アプリケーションを作成する(`ng generate application my-other-app`)と、CLIは`projects/`内にアプリケーション、及びそのアプリケーションのe2eテストのためのフォルダを追加します。新たに生成されたライブラリも`projects/`内に入ります。

<code-example language="none" linenums="false">
my-app/
  ...
  projects/           (追加のアプリとライブラリ)
    my-other-app/     (2つ目のアプリ)
      src/
      (config files)
    my-other-app-e2e/  (対応するe2eテスト) 
      src/
      (config files)
    my-lib/            (生成されたライブラリ)
      (config files)
</code-example>

{@a app-src}
## アプリケーションソースフォルダ

`src/`の中にある`app/`フォルダはアプリケーションのロジックとデータを含んでいます。Angularのコンポーネント、テンプレート、スタイルはここに入リます。`assets/`サブフォルダには画像などアプリケーションの必要なものが含まれています。`src/`の一番上の階層に位置するファイルはテストやアプリケーションの起動をサポートします。

| アプリケーションソースファイル | 目的 |
| :-------------------------- | :------------------------------------------|
| `app/app.component.ts`      | アプリケーションのルートコンポーネントである`AppComponent`のロジックを定義します。コンポーネントやサービスをアプリケーションに追加する時に、このルートコンポーネントに紐づいているビューは[view hierarchy](guide/glossary#view-hierarchy)のルートになリます。|
| `app/app.component.html`    | ルートである`AppComponent`のHTMLテンプレートを定義します。|
| `app/app.component.css`     | ルートである`AppComponent`のCSSスタイルシートを定義します。|
| `app/app.component.spec.ts` | ルートである`AppComponent`の単体テストを定義します。|
| `app/app.module.ts`         | Angularにアプリケーションを組み立てる方法を伝えるルートモジュールである`AppModule`を定義します。最初の状態ではただ`AppComponent`を宣言しているだけです。 アプリケーションにコンポーネントを足す時は、ここに宣言をする必要があります。 |
| `assets/*`                  | アプリケーションがビルドされる際にそのままコピーされるべき画像及びその他のファイルを持ちます。 |
