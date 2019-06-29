# Angularワークスペースの設定

Angular [ワークスペース](guide/glossary#workspace) のルート階層にある `angular.json` というファイルは、Angular CLIによって提供されるビルドおよび開発ツールに対して、ワークスペース全体およびプロジェクト固有のデフォルトの設定を提供します。
設定の中で与えられたパスの値は、ルートのワークスペースフォルダと関連しています。

## 全体的なJSONの構成

`angular.json` のトップ階層では、いくつかのプロパティからワークスペースを設定し、`projects` セクションにはプロジェクトごとのオプションを設定します。 ワークスペースレベルで設定されたCLIのデフォルトは、プロジェクトレベルで設定されたデフォルトによって上書きされ、プロジェクトレベルで設定されたデフォルトはコマンドラインで上書きされます。

ファイルの最上位にある次のプロパティは、ワークスペースを設定します。

* `version`: 設定ファイルのバージョン
* `newProjectRoot`: 新しいプロジェクトが作成されるパス。ワークスペースフォルダからの絶対パスもしくは相対パス
* `defaultProject`: 引数として与えられていない場合にコマンドで使われる、デフォルトのプロジェクト名。新しいワークスペースに新しいアプリケーションを `ng new` で作成したとき、ここの値が変更されるまで、そのアプリはワークスペースのデフォルトプロジェクトになります
* `schematics` : このワークスペースの `ng generate` サブコマンドオプションのデフォルトをカスタマイズする [schematics](guide/glossary#schematic) のセット。次の[Generation schematics](#schematics) を参照してください。
* `projects` : ワークスペース内の各プロジェクト（ライブラリ、アプリ）のサブセクションと、プロジェクトごとの構成オプションが含まれます

`ng new app_name` で作成した最初のアプリは "projects" の配下にあります。

<code-example format="." language="json" linenums="false">
"projects": {
  "app_name": {
    ...
  }
  ...
}
</code-example>

`ng generate application` を使用して作成された追加の各アプリには、対応するエンドツーエンドのテストプロジェクトがあり、それぞれに独自の設定セクションがあります。
`ng generate library` を使用してライブラリプロジェクトを作成すると、そのライブラリプロジェクトも `projects` セクションに追加されます。

<div class="alert is-helpful">

  設定ファイルの `projects` セクションは、ワークスペースの構成ファイルとは正確には対応していないことに注意してください。
  * `ng new` によって作成された最初のアプリは、ワークスペースのファイル構造のトップレベルにあります。
  * 追加されたアプリ、そしてライブラリはワークスペース内の `projects` フォルダに入ります。

  さらに詳しい情報は、[ワークスペースとプロジェクトのファイル構造](guide/file-structure) をご覧ください。

</div>

## プロジェクトの設定オプション

次のようなトップ階層の設定プロパティは、`projects:<project_name>` 配下の各プロジェクトで使用できます。

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
| `root`          | ワークスペースフォルダを基準とした、このプロジェクトのルートフォルダです。ワークスペースのトップ階層にある初期アプリでは空です。 |
| `sourceRoot`    | このプロジェクトのソースファイルのルートフォルダです。 |
| `projectType`   | "application" または "library" のいずれかです。applicationはブラウザ内で独立して実行できますが、libraryでは実行できません。 |
| `prefix`        | Angularによって生成されたセレクターの先頭に追加される文字列です。アプリや機能単位でのカスタマイズができます。 |
| `schematics`    | このワークスペースの `ng generate` サブコマンドオプションのデフォルトをカスタマイズする [schematics](guide/glossary#schematic) のセット。次の[Generation schematics](#schematics) を参照してください。 |
| `architect`     | このプロジェクトでArchitectが使用するビルダーのターゲットのためのデフォルト設定です。 |

{@a schematics}
## 生成 schematics

Angularの生成 [schematics](guide/glossary#schematic) は、ファイルを追加するか既存のファイルを変更することによってプロジェクトを変更するための命令です。
デフォルトのAngular CLI `ng generate` サブコマンドの個々のschematicsは、パッケージ `@angular` にまとめられています。
サブコマンドのschematicの名称を、 `schematic-package:schematic-name` の形式で指定します;
たとえば、コンポーネントを生成するためのschematicは `@angular:component` です。

プロジェクトおよびプロジェクトの一部を生成するためにCLIによって使用されるデフォルトのschematicsのJSONスキーマは、 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/7.0.x/packages/schematics/angular/application/schema.json) パッケージに集められています。
スキーマは、 `--help` の出力に示されているように、各 `ng generate` サブコマンドに対してCLIで使用可能なオプションを記述したものです。

スキーマに示されているフィールドは、CLIサブコマンドオプションの許容される引数の値、およびデフォルトに対応しています。
ワークスペーススキーマファイルを更新して、サブコマンドオプションに別のデフォルトを設定できます。

{@a architect}

## プロジェクトツールの設定オプション {@a project-tool-configuration-options}

Architectは、提供されている設定にしたがって、コンパイルやテスト実行などの複雑なタスクを実行するためにCLIが使用するツールです。
`architect` セクションには、一連のArchitect *targets* が含まれています。
ターゲットの多くはそれらを実行するCLIコマンドに対応しています。
`ng run` コマンドを使用することでいくつかの追加の定義済みターゲットを実行できますし、あなた自身のターゲットを定義することもできます。

個々のターゲットのオブジェクトは、そのターゲットの `builder` を指定します。これは、Architectが実行するツールのnpmパッケージです。
さらに各ターゲットには、ターゲットのデフォルトオプションを設定する `options` セクションと、ターゲットの代替設定に名前をつけて指定する `configurations` セクションがあります。
次の [ビルドのターゲット](#build-target) の例を参考にしてください。

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

* `architect/build` セクションでは `ng build` コマンドのデフォルトオプションを設定します。
詳細は [ビルドのターゲット](#build-target) を参照してください。

* `architect/serve` セクションでは、ビルドのデフォルトを上書きし、 `ng serve` コマンドの追加のデフォルトを提供します。`ng build` コマンドで利用可能なオプションに加えて、アプリの提供に関連するオプションを提供します。

* `architect/e2e` セクションでは `ng e2e` コマンドを使用してエンドツーエンドテストアプリをビルドするための追加のビルドオプションのデフォルトを上書きます。

* `architect/test` セクションでは、テストビルドのためのビルドオプションのデフォルトを上書きし、 `ng test` コマンドの追加のデフォルトのテスト実行を提供します。

* `architect/lint` セクションでは、プロジェクトのソースファイルに対してコード解析を実行する `ng lint` コマンドのデフォルトオプションを設定します。Angularのデフォルトの静的解析ツールは [TSLint](https://palantir.github.io/tslint/) です。

* `architect/extract-i18n` セクションでは `ng xi18n` コマンドが使用する `ng-xi18n` ツールのデフォルトオプションを設定します。このコマンドは、マークされたメッセージ文字列をソースコードから抽出し、翻訳ファイルを出力します。

* `architect/server` セクションでは `ng run <project>:server` コマンドを使用してサーバーサイドレンダリングでUniversalアプリを作成する際のデフォルトを設定します。

* `architect/app-shell` セクションでは `ng run <project>:app-shell` コマンドを使用してprogressive web app (PWA)のためのApp Shellを作成する際のデフォルトを設定します。

一般的に、デフォルトが設定できるアプションは、各コマンドの [CLIリファレンス](cli) にリストされているコマンドオプションに対応しています。
設定ファイル内のすべてのオプションは、ダッシュケースではなく [キャメルケース](guide/glossary#case-conventions) を使用しなければならないことに注意してください。

{@a build-target}

## ビルドのターゲット

`architect/build` セクションは、`ng build` コマンドのためのデフォルトを設定します。次のトップ階層のプロパティがあります。

| PROPERTY | DESCRIPTION |
| :-------------- | :---------------------------- |
| `builder`       | このターゲットの作成に使用されたビルドツールのnpmパッケージです。デフォルトはパッケージビルダーである [webpack](https://webpack.js.org/) を使用した `@angular-devkit/build-angular:browser` です。 |
| `options`       | このセクションには、名前付けされた設定が指定されていない場合に使用される、デフォルトのビルドオプションが含まれています。詳しくは [デフォルトのビルドターゲット](#default-build-targets) をご覧ください。 |
| `configurations`| このセクションには、異なる目的のための設定を定義して名前を付けます。それはそれぞれ名前付けされた、特定の環境のためのデフォルトオプションを設定するためのセクションを含みます。詳しくは [代替ビルドの構成](#build-configs) をご覧ください。 |

{@a default-build-targets}

### デフォルトのビルドターゲット

Angularは、Architectツールと `ng run` コマンドで使用するデフォルトビルダーを定義します。
デフォルトビルダーは、複雑な操作を実行するために特定のツールを使用する実装を提供します。

これらの各デフォルトビルダーのオプションとデフォルトを定義するJSONスキーマは、 [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/7.0.x/packages/angular/cli/lib/config/schema.json) パッケージに集められています。 スキーマは、次のArchitectビルドターゲットのオプションを構成します。

* app-shell
* browser
* dev-server
* extract-i18n
* karma
* protractor
* server
* tslint

{@a build-configs}

### 代替のビルド設定

デフォルトでは、`production` 設定が定義されており、`ng build` コマンドにはこの設定を使用してビルドする `--prod` オプションがあります。`production` 設定には、ファイルのバンドル、余分な空白の最小化、コメントやデッドコードの削除、短かくて暗号のような名前を用いたコードの書き換え ("minification") など、さまざまな方法でアプリを最適化するためのデフォルトを設定します。

また、あなたの開発プロセスに適した追加の代替設定（インスタンスの `stage` など）を定義して名前を付けることもできます。さまざまな異なるビルド設定の例として、`stable` 、`archive` やAIO自体が使用する `next` 、ローカライズされたバージョンのアプリを構築するために必要なロケーション固有の設定があります。詳細については [国際化 (i18n)](guide/i18n#merge-aot) を参照してください。

{@a build-props}

### 追加のビルドとテストのオプション

デフォルトまたはターゲットビルドに設定可能なオプションは、[`ng build`](cli/build) 、[`ng serve`](cli/serve) および [`ng test`](cli/test) コマンドに対応しています。これらのオプションと設定可能な値の詳細については [CLIリファレンス](cli) を参照してください。

いくつかの追加のオプション（次のとおり）は、直接編集もしくは [`ng config`](cli/config) コマンドを使用してのみ設定可能です。

| OPTIONS PROPERTIES | DESCRIPTION |
| :------------------------- | :---------------------------- |
| `fileReplacements`         | オブジェクトとそのコンパイル時間を書き換えを含むオブジェクトです。 |
| `stylePreprocessorOptions` | スタイルのプロセッサに渡すoption-valueのペアを含むオブジェクトです。 |
| `assets`                   | プロジェクトのグローバルコンテキストに追加する静的アセットへのパスを含むオブジェクトです。デフォルトのパスは、プロジェクトのアイコンファイルとその `assets` を指しています。詳細は下記を参照してください。 |
| `styles`                   | プロジェクトのグローバルコンテキストに追加するスタイルファイルを含むオブジェクトです。Angular CLIは、CSSのインポートおよびすべての主要なCSSプリセッサをサポートしています：[sass/scss](http://sass-lang.com/) 、[less](http://lesscss.org/) や [stylus](http://stylus-lang.com/) 。 |
| `scripts`                  | プロジェクトのグローバルコンテキストに追加する、JavaScriptのスクリプトファイルを含むオブジェクトです。スクリプトはあたかもそれらが、 `index.html` の中の `<script>` タグに記述されたかのように正確にロードします。 |
| `budgets`                  | 出力が閾値のサイズに達っしたり越えたりしたときに、警告やエラーを報告するようにビルダーを設定することができます。[サイズ予算を設定する](guide/build#configure-size-budgets) を参照してください（ `test` セクションにはありません）。 |

## プロジェクトのアセットの設定

各 `build` ターゲット設定には、プロジェクトをビルドするときにそのままコピーするファイルまたはフォルダを一覧表示する `assets` 配列を含めることができます。
デフォルトでは、 `src/assets/` フォルダーと `src/favicon.ico` がコピーされます。

<code-example format="." language="json" linenums="false">
"assets": [
  "src/assets",
  "src/favicon.ico"
]
</code-example>

アセットを除外するには、アセットの設定からそれを削除します。

ワークスペースのルートを基準にした単純なパスとしてではなく、アセットをオブジェクトとして指定することで、アセットをコピーするように構成できます。
アセットを指定したオブジェクトは、次のフィールドをもつことができます。

* `glob`: `input` をベースディレクトリとして使用する [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) 。
* `input`: ワークスペースのルートからの相対パス。
* `output`: `outDir` からの相対パス（デフォルトは`dist/`*project-name*）。 セキュリティへの影響のため、CLIはプロジェクトの出力パスの外側にファイルを書き込むことはありません。
* `ignore`: 除外するglobsのリスト。

たとえば、デフォルトのアセットのパスは、次のオブジェクトを使用してより詳細に表すことができます。

<code-example format="." language="json" linenums="false">
"assets": [
  { "glob": "**/*", "input": "src/assets/", "output": "/assets/" },
  { "glob": "favicon.ico", "input": "src/", "output": "/" },
]
</code-example>

この拡張構成を使用して、プロジェクトの外部からアセットをコピーすることができます。
たとえば、次の設定はnode packageからアセットをコピーします:

<code-example format="." language="json" linenums="false">
"assets": [
 { "glob": "**/*", "input": "./node_modules/some-package/images", "output": "/some-package/" },
]
</code-example>

`node_modules/some-package/images/` の内容は `dist/some-package/` にあります。

次の例では、 `ignore` フィールドを使用して、アセットフォルダー内の特定のファイルをビルドへのコピーから除外します:

<code-example format="." language="json" linenums="false">
"assets": [
 { "glob": "**/*", "input": "src/assets/", "ignore": ["**/*.svg"], "output": "/assets/" },
]
</code-example>
