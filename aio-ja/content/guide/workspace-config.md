# Angular Workspace の設定

Angular [workspace](guide/glossary#workspace) のルートに存在する　`angular.json` というファイルは、Angular CLI によって提供されるビルドおよび開発ツールに対して、ワークスペース全体およびプロジェクト固有のデフォルトの設定を提供します。設定の中で与えられたパスの値は、ルートのワークスペースフォルダと関連しています。

## JSON の構成

`angular.json` のトップレベルでは、いくつかのプロパティから workspace を設定し、`projects` セクションにはプロジェクトごとのオプションを設定します。

* `version`: 設定ファイルのバージョン
* `newProjectRoot`: 新しいプロジェクトが作成されるパス。ワークスペースフォルダからの絶対パスもしくは相対パス
* `defaultProject`: 引数として与えられていない場合にコマンドで使われる、デフォルトのプロジェクト名。新しいワークスペースに新しいアプリケーションを `ng new` で作成したとき、ここが変更されるまで、そのアプリはワークスペースのデフォルトプロジェクトになる
* `projects` : ワークスペース内の各プロジェクト（ライブラリ、アプリ、e2eテストアプリ）のサブセクションと、プロジェクトごとの構成オプションが含まれる

`ng new app_name` で作成した最初のアプリは "projects" の配下に、対応する end-to-end のテストアプリとともに一覧で表示されます。

<code-example format="." language="none" linenums="false">
projects
  app_name
    ...
  app_name-e2e
    ...
</code-example>

`ng generate application` を使用して作成した追加の各アプリには、対応する end-to-end テストプロジェクトがあり、それぞれに独自の設定セクションがあります。
`ng generate library` を使用してライブラリプロジェクトを作成すると、そのライブラリプロジェクトも `projects` セクションに追加されます。

<div class="alert is-helpful">

  設定ファイルの `projects` セクションは、ワークスペースの構成ファイルとは正確には対応していないことに注意してください。
  * `ng new` によって作成された最初のアプリは、e2eアプリとともにワークスペースのファイル構造のトップレベルにあります。
  * 追加されたアプリ、e2eアプリ、そしてライブラリはワークスペース内の `projects` フォルダに入ります。

  さらに詳しい情報は、[Workspace and project file structure](guide/file-structure) をご覧ください。

</div>

## プロジェクトの設定

以下のような最上位の設定プロパティは、`projects:<project_name>` 配下の各プロジェクトで使用できます。

<code-example format="." language="json" linenums="false">
    "my-v7-app": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {}
    }
</code-example>

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `root`          | ワークスペースフォルダを基準とした、このプロジェクトのルートフォルダです。ワークスペースの最上位にある初期アプリでは空です。 |
| `sourceRoot`    | このプロジェクトのソースファイルのルートフォルダです。 |
| `projectType`   | "application" または "library" のいずれかです。application はブラウザ内で独立して実行できますが、library はできません。アプリとそのアプリの e2e テストアプリはどちらも application タイプです。 |
| `prefix`        | Angular が生成されたセレクタの先頭に追加する文字列です。アプリや機能単位でのカスタマイズができます。 |
| `schematics`    | このプロジェクトにおける CLI コマンドをカスタマイズする schematics を含んだオブジェクトです。 |
| `architect`     | このプロジェクトにおける Architect Builder のターゲット構成のデフォルト設定を含んだオブジェクトです。 |

## プロジェクトツールの設定

Architect はコンパイルやテスト実行などの複雑なタスクを提供されている設定に従って実行するために CLI が使用するツールです。`architect` セクションには、一連の Architect *targets* が含まれています。ターゲットの多くはそれらを実行する CLI コマンドに対応しています。`ng run` コマンドを使用することでいくつかの追加の定義済みターゲットを実行できますし、あなた自身のターゲットを実行することもできます。

それぞれのターゲットのオブジェクトは、そのターゲットの `builder` を指定します。これは、Architect が実行するツールの npm パッケージです。さらに、各ターゲットには、ターゲットのデフォルトオプションを設定する `options` セクションと、ターゲットの代替設定を指定して指定する `configurations` セクションがあります。以下の [Build target](#build-target) の例を参考にしてください。

<code-example format="." language="json" linenums="false">
      "architect": {
        "build": { },
        "serve": { },
        "e2e" : { },
        "test": { },
        "lint": { },
        "extract-i18n": { },
        "server": { },
        "app-shell": { }
      }
</code-example>

* `architect/build` セクションでは `ng build` コマンドのデフォルトオプションを設定します。詳細は [Build target](#build-target) を参照してください。

* `architect/serve` セクションでは、ビルドのデフォルトを上書き `ng serve` コマンドの追加のデフォルトを提供します。`ng build` コマンドで利用可能なオプションに加えて、アプリの提供に関連するオプションを提供します。

* `architect/e2e` セクションでは `ng e2e` コマンドを使用して end-to-end テストアプリをビルドするための追加のデフォルトのビルドオプションを上書きします。

* `architect/test` セクションでは、テストビルドのためのデフォルトのビルドオプションを上書き `ng test` コマンドの追加のデフォルトのテスト実行を提供します。

* `architect/lint` セクションでは、プロジェクトのソースファイルに対してコード解析を実行する `ng lint` コマンドのデフォルトオプションを設定します。Angular のデフォルトの静的解析ツールは [TSLint](https://palantir.github.io/tslint/) です。

* `architect/extract-i18n` セクションでは `ng xi18n` コマンドが使用する `ng-xi18n` ツールのデフォルトオプションを設定します。このコマンドは、マークされたメッセージ文字列をソースコードから抽出し、翻訳ファイルを出力します。

* `architect/server` セクションでは `ng run <project>:server` コマンドを使用してサーバサイドレンダリングで Universal アプリを作成する際の、デフォルトを設定します。

* `architect/app-shell` セクションでは `ng run <project>:app-shell` コマンドを使用して progressive web app (PWA) アプリ用のアプリシェルを作成する際の、デフォルトを設定します。

一般的に、デフォルトが設定できるアプションは、各コマンドの [CLI reference page](cli) にリストされているコマンドオプションに対応しています。
設定ファイル内のすべてのオプションは、dashCaseではなく [camelCase](guide/glossary#case-conventions) を使用しなければならないことに注意してください。

{@a build-target}

## ビルドのターゲット

`architect/build` セクションは、`ng build` コマンドのためのデフォルトを設定します。以下の最上位のプロパティがあります。

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `builder`       | このターゲットの作成に使用されたビルドツールの npm パッケージです。デフォルトはパッケージビルダーである [webpack](https://webpack.js.org/) を使用した `@angular-devkit/build-angular:browser` です。 |
| `options`       | このセクションには、名前付けされた設定が指定されていない場合に使用される、デフォルトのビルドオプションが含まれています。詳しくは [Default build options](#build-props) をご覧ください。 |
| `configurations`| このセクションには、名前付けした異なる目的のための設定を定義します。それはそれぞれ名前付けされた、特定の環境のためのデフォルトオプションを設定するためのセクションを含みます。詳しくは [Alternate build configurations](#build-configs) をご覧ください。 |

{@a build-configs}

### 代替ビルドの設定

デフォルトでは、`production` 設定が定義されており、`ng build` コマンドにはこの設定を使用してビルドする `--prod` オプションがあります。`production` 設定には、ファイルのバンドル、余分な空白の最小化、コメントやデッドコードの削除、コードを短く書き換え、短い暗号名を使用するためのコードの書き換え ("minification") など、さまざまな方法でアプリを最適化するためのデフォルトを設定します。

また、あなたの開発プロセスに適した追加の代替設定（インスタンスの `stage` など）を定義して名前を付けることもできます。様々な異なるビルド設定の例として、`stable` 、`archive` やAIO自体が使用する `next` 、ローかアライズされたバージョンのアプリを構築するために必要なロケーション固有の設定があります。詳細については [Internationalization (i18n)](guide/i18n#merge-aot) を参照してください。
これらのオプションとその可能な値の詳細については、CLI解説書を参照してください。

{@a build-props}

### 追加のビルドとテストのオプション

デフォルトまたはターゲットビルドに設定可能なオプションは、[`ng build`](cli/build) 、 [`ng serve`](cli/serve) および [`ng test`](cli/test) コマンドに対応しています。これらのオプションと設定可能な値の詳細については [CLI Reference](cli) を参照してください。

いくつかの追加のオプション（以下の通り）は、直接編集もしくは `ng config` コマンドを使用してのみ設定可能です。

| OPTIONS PROPERTIES | DESCRIPTION |
| :------------------------- | :---------------------------- |
| `fileReplacements`         | ファイルを含むオブジェクトとそのコンパイル時間を書き換えます。 |
| `stylePreprocessorOptions` | スタイルのプロセッサに渡す option-value のペアを含むオブジェクトです。 |
| `assets`                   | プロジェクトのグローバルコンテキストに追加する静的アセットへのパスを含むオブジェクト。デフォルトのパスは、プロジェクトのアイコンファイルとその `assets` を指しています。 |
| `styles`                   | プロジェクトのグローバルコンテキストに追加するスタイルファイルを含むオブジェクト。Angular CLIは、CSSのインポートおよびすべての主要なCSSプリセッサをサポートしています：[sass/scss](http://sass-lang.com/) 、[less](http://lesscss.org/) や [stylus](http://stylus-lang.com/)。 |
| `scripts`                  | プロジェクトのグローバルコンテキストに追加する、JavaScriptのスクリプトファイルを含むオブジェクト。スクリプトはあたかもそれらが、`index.html` の中の `<script>` タグに記述されたかのように正確にロードします。 |
| `budgets`                  | アプリ全体または一部の size-budget タイプと閾値です。出力が閾値のサイズ以上になったときに計画もしくはエラーを報告できるようにビルダーを設定できます。[Configure size budgets](guide/build#configure-size-budgets) を参照してください（`test` セクションにはありません）。 |
