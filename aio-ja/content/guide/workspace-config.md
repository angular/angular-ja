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

<code-example language="json">

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

## Strict mode

When you create new workspaces and projects, you have the option to use Angular's strict mode, which can help you write better, more maintainable code.
For more information, see [Strict mode](/guide/strict-mode).

## プロジェクトの設定オプション

次のようなトップ階層の設定プロパティは、`projects:<project_name>` 配下の各プロジェクトで使用できます。

<code-example language="json">

    "my-v7-app": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "app",
      "schematics": {},
      "architect": {}
    }

</code-example>

| プロパティ | 説明 |
| :-------------- | :---------------------------- |
| `root`          | ワークスペースフォルダを基準とした、このプロジェクトのルートフォルダです。ワークスペースのトップ階層にある初期アプリでは空です。 |
| `sourceRoot`    | このプロジェクトのソースファイルのルートフォルダです。 |
| `projectType`   | "application" または "library" のいずれかです。application はブラウザ内で独立して実行できますが、libraryでは実行できません。 |
| `prefix`        | Angular によって生成されたセレクターの先頭に追加される文字列です。アプリや機能単位でのカスタマイズができます。 |
| `schematics`    | このワークスペースの `ng generate` サブコマンドオプションのデフォルトをカスタマイズする [schematics](guide/glossary#schematic) のセット。次の [Generation schematics](#schematics) を参照してください。 |
| `architect`     | このプロジェクトで Architect が使用するビルダーのターゲットのためのデフォルト設定です。 |

{@a schematics}

## 生成 schematics

Angularの生成 [schematics](guide/glossary#schematic) は、ファイルを追加するか既存のファイルを変更することによってプロジェクトを変更するための命令です。
デフォルトの Angular CLI `ng generate` サブコマンドの個々のschematicsは、パッケージ `@angular` にまとめられています。
サブコマンドの schematic の名称を、`schematic-package:schematic-name` の形式で指定します;
たとえば、コンポーネントを生成するための schematic は `@angular:component` です。

プロジェクトおよびプロジェクトの一部を生成するために CLI によって使用されるデフォルトの schematics の JSON スキーマは、 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/7.0.x/packages/schematics/angular/application/schema.json) パッケージに集められています。
スキーマは、`--help` の出力に示されているように、各 `ng generate` サブコマンドに対して CLI で使用可能なオプションを記述したものです。

スキーマに示されているフィールドは、CLI サブコマンドオプションの許容される引数の値、およびデフォルトに対応しています。
ワークスペーススキーマファイルを更新して、サブコマンドオプションに別のデフォルトを設定できます。

{@a architect}

## プロジェクトツールの設定オプション {@a project-tool-configuration-options}

Architect は、コンパイルやテスト実行などの複雑なタスクを実行するために CLI が使用するツールです。
Architect は、[ターゲット](guide/glossary#target)構成にしたがって、指定された[builder](guide/glossary#builder) を実行して特定のタスクを実行するシェルです。
新しい Builder とターゲットを定義および構成して、CLI を拡張できます。
[Angular CLI Builders](guide/cli-builder) を参照してください。

{@a default-build-targets}

### デフォルトのビルドターゲット

Angular は、Architect ツールと `ng run` コマンドで使用するデフォルトビルダーを定義します。
これらの各デフォルトビルダーのオプションとデフォルトを定義する JSON スキーマは、[`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/9.0.x/packages/angular/cli/lib/config/schema.json) パッケージに集められています。 
スキーマは、次の Architect ビルドターゲットのオプションを構成します。

* app-shell
* browser
* dev-server
* extract-i18n
* karma
* protractor
* server
* tslint

### Builder ターゲットの構成

`architect` セクションには、一連の Architect ターゲットが含まれています。
ターゲットの多くはそれらを実行する CLI コマンドに対応しています。
`ng run` コマンドを使用することでいくつかの追加の定義済みターゲットを実行できますし、あなた自身のターゲットを定義することもできます。

個々のターゲットのオブジェクトは、そのターゲットの `builder` を指定します。これは、Architect が実行するツールの npm パッケージです。
さらに各ターゲットには、ターゲットのデフォルトオプションを設定する `options` セクションと、ターゲットの代替設定に名前をつけて指定する `configurations` セクションがあります。
次の [ビルドのターゲット](#build-target) の例を参考にしてください。

<code-example language="json">

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

* `architect/test` セクションでは、テストビルドのためのビルドオプションのデフォルトを上書きし、`ng test` コマンドの追加のデフォルトのテスト実行を提供します。

* `architect/lint` セクションでは、プロジェクトのソースファイルに対してコード解析を実行する `ng lint` コマンドのデフォルトオプションを設定します。Angularのデフォルトの静的解析ツールは [TSLint](https://palantir.github.io/tslint/) です。

* `architect/extract-i18n` セクションでは `ng xi18n` コマンドが使用する `ng-xi18n` ツールのデフォルトオプションを設定します。このコマンドは、マークされたメッセージ文字列をソースコードから抽出し、翻訳ファイルを出力します。

* `architect/server` セクションでは `ng run <project>:server` コマンドを使用してサーバーサイドレンダリングでUniversalアプリを作成する際のデフォルトを設定します。

* `architect/app-shell` セクションでは `ng run <project>:app-shell` コマンドを使用して progressive web app (PWA)のための App Shell を作成する際のデフォルトを設定します。

一般的に、デフォルトが設定できるアプションは、各コマンドの [CLIリファレンス](cli) にリストされているコマンドオプションに対応しています。
設定ファイル内のすべてのオプションは、ダッシュケースではなく [キャメルケース](guide/glossary#case-conventions) を使用しなければならないことに注意してください。

{@a build-target}

## ビルドのターゲット

`architect/build` セクションは、`ng build` コマンドのためのデフォルトを設定します。次のトップ階層のプロパティがあります。

| プロパティ | 説明 |
| :-------------- | :---------------------------- |
| `builder`       | このターゲットの作成に使用されたビルドツールのnpmパッケージです。アプリケーションのデフォルトのビルダー (`ng build myApp`) は `@angular-devkit/build-angular:browser` で、[webpack](https://webpack.js.org/) パッケージバンドラーを使用します。ライブラリの構築 (`ng build myLib`) には別のビルダーが使用されることに注意してください。 |
| `options`       | このセクションには、名前付けされた設定が指定されていない場合に使用される、デフォルトのビルドオプションが含まれています。詳しくは [デフォルトのビルドターゲット](#default-build-targets) をご覧ください。 |
| `configurations`| このセクションには、異なる目的のための設定を定義して名前を付けます。それはそれぞれ名前付けされた、特定の環境のためのデフォルトオプションを設定するためのセクションを含みます。詳しくは [代替ビルドの構成](#build-configs) をご覧ください。 |


{@a build-configs}

### 代替のビルド設定

デフォルトでは、`production` 設定が定義されており、`ng build` コマンドにはこの設定を使用してビルドする `--prod` オプションがあります。`production` 設定には、ファイルのバンドル、余分な空白の最小化、コメントやデッドコードの削除、短かくて暗号のような名前を用いたコードの書き換え ("minification") など、さまざまな方法でアプリを最適化するためのデフォルトを設定します。

また、あなたの開発プロセスに適した追加の代替設定（インスタンスの `stage` など）を定義して名前を付けることもできます。さまざまな異なるビルド設定の例として、`stable` 、`archive` やAIO自体が使用する `next` 、ローカライズされたバージョンのアプリを構築するために必要なロケーション固有の設定があります。詳細については [国際化 (i18n)](guide/i18n#merge-aot) を参照してください。

名前を `--configuration` コマンドラインフラグに渡すことで、代替設定を選択できます。

複数の構成名をコンマ区切りリストとして渡すこともできます。たとえば、`stage` と `fr` の両方のビルド構成を適用するには、コマンド `ng build --configuration stage,fr` を使用します。この場合、コマンドは名前付き構成を左から右に解析します。複数の構成が同じ設定を変更する場合、最後に設定された値が最後の値となります。

`--prod` コマンドラインフラグも使用される場合、最初に適用され、その設定は `--configuration` フラグで指定された設定によって上書きできます。

{@a build-props}

### 追加のビルドとテストのオプション

デフォルトまたはターゲットビルドに設定可能なオプションは、[`ng build`](cli/build) 、[`ng serve`](cli/serve) および [`ng test`](cli/test) コマンドに対応しています。これらのオプションと設定可能な値の詳細については [CLIリファレンス](cli) を参照してください。

いくつかの追加のオプションは、直接編集もしくは [`ng config`](cli/config) コマンドを使用してのみ設定可能です。

| オプションのプロパティ | 説明 |
| :------------------------- | :---------------------------- |
| `assets`                   | プロジェクトのグローバルコンテキストに追加する静的アセットへのパスを含むオブジェクトです。デフォルトのパスは、プロジェクトのアイコンファイルとその `assets` を指しています。詳細については、次の [Assets configuration](#asset-config) を参照してください。 |
| `styles`                   | プロジェクトのグローバルコンテキストに追加するスタイルファイルの配列です。Angular CLI は、CSS のインポートおよびすべての主要な CSS プリセッサをサポートしています: [sass/scss](http://sass-lang.com/)、[less](http://lesscss.org/) や [stylus](http://stylus-lang.com/)。詳細については、次の [スタイルとスクリプトの構成](#style-script-config) を参照してください。 |
| `stylePreprocessorOptions` | スタイルプリプロセッサに渡すオプションと値のペアを含むオブジェクト。詳細については、次の [スタイルとスクリプトの構成](#style-script-config) を参照してください。 |
| `scripts`                  | プロジェクトのグローバルコンテキストに追加する、JavaScript のスクリプトファイルを含むオブジェクトです。スクリプトはあたかもそれらが、`index.html` の中の `<script>` タグに記述されたかのように正確にロードします。 詳細については、次の [スタイルとスクリプトの構成](#style-script-config) を参照してください。 |
| `budgets`                  | 出力が閾値のサイズに達っしたり越えたりしたときに、警告やエラーを報告するようにビルダーを設定することができます。[サイズ予算を設定する](guide/build#configure-size-budgets) を参照してください (`test` セクションにはありません)。 |
| `fileReplacements`         | オブジェクトとそのコンパイル時間を書き換えを含むオブジェクトです。詳しくは、[ターゲット固有のファイル置換の構成](guide/build#configure-target-specific-file-replacements)を参照してください。 |

{@a complex-config}

## 複雑な設定値

オプションの `assets`、`styles`、および `scripts` には、単純なパス文字列値、または特定のフィールドをもつオブジェクト値を指定できます。
`sourceMap` および `optimization` オプションは、コマンドフラグを使用して単純なブール値に設定できますが、設定ファイルを使用して複雑な値を指定することもできます。
次のセクションでは、これらの複雑な値が各ケースでどのように使用されるかについて詳しく説明します。

{@a asset-config}

## プロジェクトのアセットの設定

各 `build` ターゲット設定には、プロジェクトをビルドするときにそのままコピーするファイルまたはフォルダを一覧表示する `assets` 配列を含めることができます。
デフォルトでは、 `src/assets/` フォルダーと `src/favicon.ico` がコピーされます。

<code-example language="json">

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

<code-example language="json">

"assets": [
  { "glob": "**/*", "input": "src/assets/", "output": "/assets/" },
  { "glob": "favicon.ico", "input": "src/", "output": "/" },
]

</code-example>

この拡張構成を使用して、プロジェクトの外部からアセットをコピーすることができます。
たとえば、次の設定は node package からアセットをコピーします:

<code-example language="json">

"assets": [
 { "glob": "**/*", "input": "./node_modules/some-package/images", "output": "/some-package/" },
]

</code-example>

`node_modules/some-package/images/` の内容は `dist/some-package/` にあります。

次の例では、 `ignore` フィールドを使用して、アセットフォルダー内の特定のファイルをビルドへのコピーから除外します:

<code-example language="json">

"assets": [
 { "glob": "**/*", "input": "src/assets/", "ignore": ["**/*.svg"], "output": "/assets/" },
]

</code-example>

{@a style-script-config}

### スタイルとスクリプトの構成

`styles` および `scripts` オプションの配列エントリは、単純なパス文字列、または追加のエントリポイントファイルを指すオブジェクトにすることができます。
関連するビルダーは、ビルド中にそのファイルとその依存関係を別個のバンドルとしてロードします。
設定オブジェクトでは、`bundleName` フィールドを使用して、エントリポイントのバンドルに名前を付けるオプションがあります。

バンドルはデフォルトでインジェクトされますが、インジェクションからバンドルを除外するために `inject` を false に設定できます。
たとえば、次のオブジェクトの値は、スタイルとスクリプトを含むバンドルを作成して名前を付け、インジェクションから除外します:

<code-example language="json">

   "styles": [
     { "input": "src/external-module/styles.scss", "inject": false, "bundleName": "external-module" }
   ],
   "scripts": [
     { "input": "src/external-module/main.js", "inject": false, "bundleName": "external-module" }
   ]

</code-example>

スタイルとスクリプトの単純なファイル参照と複雑なファイル参照を混在させることができます。

<code-example language="json">

"styles": [
  "src/styles.css",
  "src/more-styles.css",
  { "input": "src/lazy-style.scss", "inject": false },
  { "input": "src/pre-rename-style.scss", "bundleName": "renamed-style" },
]

</code-example>

{@a style-preprocessor}

#### スタイルプリプロセッサオプション

Sass と Stylus では、コンポーネントスタイルとグローバルスタイルの両方で `includePaths` 機能を利用できます。これにより、インポートのためにチェックされる追加のベースパスを追加できます。

パスを追加するには、`stylePreprocessorOptions` オプションを使用します:

<code-example language="json">

"stylePreprocessorOptions": {
  "includePaths": [
    "src/style-paths"
  ]
}

</code-example>

`src/style-paths/_variables.scss` のようなそのフォルダ内のファイルは、相対パスを必要とせずにプロジェクトのどこからでもインポートできます:

```ts
// src/app/app.component.scss
// A relative path works
@import '../style-paths/variables';
// But now this works as well
@import 'variables';
```

ユニットテストに必要な場合は、`test` ビルダーにスタイルやスクリプトを追加する必要があることに注意してください。
[アプリ内でのランタイムグローバルライブラリの使用](guide/using-libraries#using-runtime-global-libraries-inside-your-app)も参照してください。


{@a optimize-and-srcmap}

### 最適化とソースマップの構成

`optimization` および `sourceMap` コマンドオプションは単純なブールフラグです。
これらのいずれかの構成値としてオブジェクトを指定して、より詳細な指示を提供できます。

* フラグ `--optimization="true"` は、スクリプトとスタイルの両方に適用されます。次のような値を指定して、どちらかに最適化を適用できます:

<code-example language="json">

   "optimization": { "scripts": true, "styles": false }

</code-example>

* フラグ `--sourceMap="true"` は、スクリプトとスタイルの両方のソースマップを出力します。
どちらかに適用するオプションを構成できます。
非表示のソースマップを出力するか、ベンダーパッケージのソースマップを解決することもできます。
たとえば:

<code-example language="json">

   "sourceMap": { "scripts": true, "styles": false, "hidden": true, "vendor": true }

</code-example>

<div class="alert is-helpful">

   非表示のソースマップを使用する場合、ソースマップはバンドルで参照されません。
   これらは、ソースマップでエラー報告ツールのエラースタックトレースのみをマッピングするが、
   ブラウザ開発者ツールでソースマップを公開したくない場合に役立ちます。

   [Universal](guide/glossary#universal) では、スタイルの最適化を `true` に、
   スタイルのソースマップを `false` に設定することにより、HTML ページに表示されるコードを削減できます。

</div>
