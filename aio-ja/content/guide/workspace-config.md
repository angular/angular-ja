# Angularワークスペースの設定

Angular [ワークスペース](guide/glossary#workspace) のルート階層にある `angular.json` ファイルは、Angular CLIによって提供されるビルドおよび開発ツールに対して、ワークスペース全体およびプロジェクト固有のデフォルトの設定を提供します。
設定の中で指定されたパスの値は、ルートであるワークスペースフォルダが基準となります。

## 一般的なJSONの構造

At the top-level of `angular.json`, a few properties configure the workspace and a `projects` section contains the remaining per-project configuration options.
You can override Angular CLI defaults set at the workspace level through defaults set at the project level.
You can also override defaults set at the project level using the command line.

ファイルの最上位にある次のプロパティは、ワークスペースを設定します。

| Properties       | Details |
|:---              |:---     |
| `version`        | 設定ファイルのバージョン                                                                                                                                                                                                       |
| `newProjectRoot` | 新しいプロジェクトが作成されるパス。ワークスペースフォルダからの絶対パスもしくは相対パス                                                                                                                                                   |
| `cli`            | A set of options that customize the [Angular CLI](cli). See the [Angular CLI configuration options](#cli-configuration-options) section.                                                                                                      |
| `schematics`     | このワークスペースの `ng generate` サブコマンドオプションのデフォルトをカスタマイズする [schematics](guide/glossary#schematic) のセット。[Generation schematics](#schematics) を参照してください。                                               |
| `projects`       | Contains a subsection for each library or application in the workspace, with the per-project configuration options.                                                                                                       |

`ng new app_name` で作成した最初のアプリケーションは "projects" の配下にあります。

<code-example language="json">

"projects": {
  "app_name": {
    &hellip;
  }
  &hellip;
}

</code-example>

`ng generate library` を使用してライブラリプロジェクトを作成すると、そのライブラリプロジェクトも `projects` セクションに追加されます。

<div class="alert is-helpful">

  **NOTE**: <br />
  設定ファイルの `projects` セクションは、ワークスペースの構成ファイルとは正確には対応していないことに注意してください。

  *   `ng new` によって作成された最初のアプリケーションは、ワークスペースのファイル構造のトップレベルにあります。
  *   追加されたアプリケーション、そしてライブラリはワークスペース内の `projects` フォルダに入ります。

  さらに詳しい情報は、[ワークスペースとプロジェクトのファイル構造](guide/file-structure) をご覧ください。

</div>

<a id="cli-configuration-options"></a>

## Angular CLI configuration options

The following configuration properties are a set of options that customize the Angular CLI.

| Property              | Details                                                                                       | Value type                                              |
|:---                   |:---                                                                                           |:---                                                     |
| `analytics`           | Share anonymous [usage data](cli/analytics) with the Angular Team.            | `boolean` &verbar; `ci`                                 |
| `cache`               | Control [persistent disk cache](cli/cache) used by [Angular CLI Builders](guide/cli-builder). | [Cache options](#cache-options)                         |
| `schematicCollections`| A list of default schematics collections to use.                                              | `string[]`                                              |
| `packageManager`      | The preferred package manager tool to use.                                                    | `npm` &verbar; `cnpm` &verbar; `pnpm` &verbar;`yarn`    |
| `warnings`            | Control Angular CLI specific console warnings.                                                        | [Warnings options](#warnings-options)                   |


### Cache options

| Property      | Description                                           | Value Type               | Default Value    |
| :------------ | :---------------------------------------------------- | :----------------------- | :--------------- |
| `enabled`     | Configure whether disk caching is enabled.            | `boolean`                | `true`           |
| `environment` | Configure in which environment disk cache is enabled. | `local` \| `ci` \| `all` | `local`          |
| `path`        | The directory used to stored cache results.           | `string`                 | `.angular/cache` |

### Warnings options

| Property          | Description                                                                     | Value Type | Default Value |
| :---------------- | :------------------------------------------------------------------------------ | :--------- | :------------ |
| `versionMismatch` | Show a warning when the global Angular CLI version is newer than the local one. | `boolean`  | `true`        |

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
| `root`          | ワークスペースディレクトリを基準とした、このプロジェクトのルートディレクトリです。ワークスペースのトップ階層にある初期アプリケーションでは空です。 |
| `sourceRoot`    | このプロジェクトのソースファイルのルートディレクトリです。 |
| `projectType`   | "application" または "library" のいずれかです。application はブラウザ内で独立して実行できますが、libraryでは実行できません。 |
| `prefix`        | Angular によって生成されたセレクターの先頭に追加される文字列です。アプリケーションや機能単位でのカスタマイズができます。 |
| `schematics`    | このワークスペースの `ng generate` サブコマンドオプションのデフォルトをカスタマイズする [schematics](guide/glossary#schematic) のセット。次の [Generation schematics](#schematics) を参照してください。 |
| `architect`     | このプロジェクトで Architect が使用するビルダーのターゲットのためのデフォルト設定です。 |

{@a schematics}

## 生成 schematics {@a generation-schematics}

Angularの生成 [schematics](guide/glossary#schematic) は、ファイルを追加するか既存のファイルを変更することによってプロジェクトを変更するための命令です。
デフォルトの Angular CLI `ng generate` サブコマンドの個々のschematicsは、パッケージ `@schematics/angular` にまとめられています。
サブコマンドの schematic の名称を、`schematic-package:schematic-name` の形式で指定します;
たとえば、コンポーネントを生成するための schematic は `@schematics/angular:component` です。

プロジェクトおよびプロジェクトの一部を生成するために CLI によって使用されるデフォルトの schematics の JSON スキーマは、 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) パッケージに集められています。
スキーマは、`--help` の出力に示されているように、各 `ng generate` サブコマンドに対して CLI で使用可能なオプションを記述したものです。

スキーマに示されているフィールドは、CLI サブコマンドオプションの許容される引数の値、およびデフォルトに対応しています。
ワークスペーススキーマファイルを更新して、サブコマンドオプションに別のデフォルトを設定できます。

{@a architect}

## プロジェクトツールの設定オプション {@a project-tool-configuration-options}

Architect は、コンパイルやテスト実行などの複雑なタスクを実行するために CLI が使用するツールです。
Architect は、[ターゲット](guide/glossary#target)設定にしたがって、指定された[ビルダ](guide/glossary#builder) を実行して特定のタスクを実行するシェルです。
新しいビルダとターゲットを定義および構成して、CLIを拡張できます。
[Angular CLI Builders](guide/cli-builder) を参照してください。

{@a default-build-targets}

### デフォルトのArchitectビルダとターゲット {@a default-architect-builders-and-targets}

Angularは、特定のCLIコマンドや一般的な`ng run`コマンドで使用するデフォルトのビルダを定義します。
これらのデフォルトの各ビルダについてオプションとデフォルトを定義するJSONスキーマは、[`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) パッケージに収集されています。
スキーマは、次のビルダについてオプションを構成します。

<!-- vale Angular.Google_WordListWarnings = NO -->

*   [application](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/application/schema.json)
*   [app-shell](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/app-shell/schema.json)
*   [browser](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/browser/schema.json)
*   [dev-server](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/dev-server/schema.json)
*   [extract-i18n](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/extract-i18n/schema.json)
*   [karma](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/karma/schema.json)
*   [server](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/server/schema.json)

<!-- vale Angular.Google_WordListWarnings = YES -->

### ビルダのターゲットの設定

`angular.json`の`architect`セクションには、Architectのターゲットのセットが含まれています。
ターゲットの多くはそれらを実行する CLI コマンドに対応しています。
`ng run` コマンドを使用することでいくつかの追加の定義済みターゲットを実行できますし、あなた自身のターゲットを定義することもできます。

個々のターゲットのオブジェクトは、そのターゲットの `builder` を指定します。これは、Architect が実行するツールの npm パッケージです。
さらに各ターゲットには、ターゲットのデフォルトオプションを設定する `options` セクションと、ターゲットの代替設定に名前をつけて指定する `configurations` セクションがあります。
次の [ビルドのターゲット](#build-target) の例を参考にしてください。

<code-example language="json">

"architect": {
  "build": {},
  "serve": {},
  "e2e" : {},
  "test": {},
  "lint": {},
  "extract-i18n": {},
  "server": {},
  "app-shell": {}
}

</code-example>

| Sections                 | Details |
|:---                      |:---     |
| `architect/build`        | Configures defaults for options of the `ng build` command. See the [Build target](#build-target) section for more information.                                                                                   |
| `architect/serve`        | Overrides build defaults and supplies extra serve defaults for the `ng serve` command. Besides the options available for the `ng build` command, it adds options related to serving the application. |
| `architect/e2e`          | Overrides build-option defaults for building end-to-end testing applications using the `ng e2e` command.                                                                                                         |
| `architect/test`         | Overrides build-option defaults for test builds and supplies extra test-running defaults for the `ng test` command.                                                                                         |
| `architect/lint`         | Configures defaults for options of the `ng lint` command, which performs code analysis on project source files.                                                                                                  |
| `architect/extract-i18n` | Configures defaults for options of the `ng extract-i18n` command, which extracts marked message strings from source code and outputs translation files.                                                          |
| `architect/server`       | Configures defaults for creating a Universal application with server-side rendering, using the `ng run <project>:server` command.                                                                                |
| `architect/app-shell`    | Configures defaults for creating an application shell for a progressive web application \(PWA\), using the `ng run <project>:app-shell` command.                                                                 |

一般的に、デフォルトが設定できるアプションは、各コマンドの [Angular CLIリファレンス](cli) にリストされているコマンドオプションに対応しています。
**NOTE**: 設定ファイル内のすべてのオプションは、ダッシュケースではなく [キャメルケース](guide/glossary#case-conventions) を使用しなければならないことに注意してください。

{@a build-target}

## ビルドのターゲット

`architect/build` セクションは、`ng build` コマンドのためのデフォルトを設定します。次のトップ階層のプロパティがあります。

| プロパティ | 説明 |
| :-------------- | :---------------------------- |
| `builder`       | このターゲットを作成するために使用されるビルドツールの npm パッケージ。アプリケーションのデフォルトのビルダー(`ng build myApp`) は `@angular-devkit/build-angular:application` で、[esbuild](https://esbuild.github.io/) パッケージ bundler を使用します。 <div class="alert is-helpful"> **NOTE**: A different builder is used for building a library \(`ng build myLib`\). </div> |
| `options`       | このセクションには、名前付けされた設定が指定されていない場合に使用される、デフォルトのビルドオプションが含まれています。詳しくは [デフォルトのビルドターゲット](#default-build-targets) をご覧ください。 |
| `configurations`| このセクションには、異なる目的のための設定を定義して名前を付けます。それはそれぞれ名前付けされた、特定の環境のためのデフォルトオプションを設定するためのセクションを含みます。詳しくは [代替ビルドの構成](#build-configs) をご覧ください。 |

{@a build-configs}

### 代替のビルド設定

Angular CLI comes with two build configurations: `production` and `development`. By default, the `ng build` command uses the `production` configuration, which applies a number of build optimizations, including:

*   Bundling files
*   Minimizing excess whitespace
*   Removing comments and dead code
*   Rewriting code to use short, mangled names, also known as minification

また、あなたの開発プロセスに適した追加の代替設定（インスタンスの `stage` など）を定義して名前を付けることもできます。さまざまな異なるビルド設定の例として、`stable` 、`archive` やAIO自体が使用する `next` 、ローカライズされたバージョンのアプリケーションを構築するために必要なロケーション固有の設定があります。詳細については [国際化 (i18n)][AioGuideI18nCommonMerge] を参照してください。

名前を `--configuration` コマンドラインフラグに渡すことで、代替設定を選択できます。

複数の構成名をコンマ区切りリストとして渡すこともできます。たとえば、`stage` と `fr` の両方のビルド構成を適用するには、コマンド `ng build --configuration stage,fr` を使用します。この場合、コマンドは名前付き構成を左から右に解析します。複数の構成が同じ設定を変更する場合、最後に設定された値が最後の値となります。 So in this example, if both `stage` and `fr` configurations set the output path the value in `fr` would get used.

<a id="build-props"></a>

### 追加のビルドとテストのオプション

デフォルトまたはターゲットビルドに設定可能なオプションは、[`ng build`](cli/build) 、[`ng serve`](cli/serve) および [`ng test`](cli/test) コマンドに対応しています。これらのオプションと設定可能な値の詳細については [Angular CLIリファレンス](cli) を参照してください。

いくつかの追加のオプションは、直接編集もしくは [`ng config`](cli/config) コマンドを使用してのみ設定可能です。

| オプションのプロパティ | 説明 |
| :------------------------- | :---------------------------- |
| `assets`                   | プロジェクトのグローバルコンテキストに追加する静的アセットへのパスを含むオブジェクトです。デフォルトのパスは、プロジェクトのアイコンファイルとその `assets` を指しています。詳細については、次の [Assets configuration](#asset-config) を参照してください。 |
| `styles`                   | プロジェクトのグローバルコンテキストに追加するスタイルファイルの配列です。Angular CLI は、CSS のインポートおよびすべての主要な CSS プリセッサをサポートしています: [sass/scss](https://sass-lang.com/)および[less](http://lesscss.org/)。詳細については、次の [スタイルとスクリプトの構成](#style-script-config) を参照してください。 |
| `stylePreprocessorOptions` | スタイルプリプロセッサに渡すオプションと値のペアを含むオブジェクト。詳細については、次の [スタイルとスクリプトの構成](#style-script-config) を参照してください。 |
| `scripts`                  | プロジェクトのグローバルコンテキストに追加する、JavaScript のスクリプトファイルを含むオブジェクトです。スクリプトはあたかもそれらが、`index.html` の中の `<script>` タグに記述されたかのように正確にロードします。 詳細については、次の [スタイルとスクリプトの構成](#style-script-config) を参照してください。 |
| `budgets`                  | 出力が閾値のサイズに達したり越えたりしたときに、警告やエラーを報告するようにビルダを設定することができます。[サイズ予算を設定する](guide/build#configure-size-budgets) を参照してください (`test` セクションにはありません)。 |
| `fileReplacements`         | オブジェクトとそのコンパイル時間を書き換えを含むオブジェクトです。詳しくは、[ターゲット固有のファイル置換の構成](guide/build#configure-target-specific-file-replacements)を参照してください。 |
`index`                    | Configures the generation of the application's HTML index. See more in [Index configuration](#index-config). \(Only available in `browser` section.\)                                                                                                         |                                                                                                        |                                                                                                      

<a id="complex-config"></a>

## 複雑な設定値

オプションの `assets`、`index`、`styles`、および `scripts` には、単純なパス文字列値、または特定のフィールドをもつオブジェクト値を指定できます。
`sourceMap` および `optimization` オプションは、コマンドフラグを使用して単純なブール値に設定できますが、設定ファイルを使用して複雑な値を指定することもできます。

次のセクションでは、これらの複雑な値が各ケースでどのように使用されるかについて詳しく説明します。

<a id="asset-config"></a>

### アセットの設定 {@a assets-configuration}

各`build`ターゲット設定には、ファイルやフォルダをリストする`assets`配列を含めることができます。それらはプロジェクトのビルド時にそのままコピーされます。
デフォルトでは、 `src/assets/` ディレクトリと `src/favicon.ico` がコピーされます。

<code-example language="json">

"assets": [
  "src/assets",
  "src/favicon.ico"
]

</code-example>

<!-- vale off -->

アセットを除外するには、アセットの設定からそれを削除します。

ワークスペースのルートを基準にした単純なパスとしてではなく、アセットをオブジェクトとして指定することで、アセットをコピーするように構成できます。
アセットを指定したオブジェクトは、次のフィールドをもつことができます。

| Fields           | Details |
|:---              |:---     |
| `glob`           | A [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) using `input` as base directory.                                                              |
| `input`          | A path relative to the workspace root.                                                                                                                                 |
| `output`         | A path relative to `outDir` \(default is `dist/project-name`\). Because of the security implications, the Angular CLI never writes files outside of the project output path. |
| `ignore`         | A list of globs to exclude.                                                                                                                                            |
| `followSymlinks` | Allow glob patterns to follow symlink directories. This allows subdirectories of the symlink to be searched. Defaults to `false`.                                      |

たとえば、デフォルトのアセットのパスは、次のオブジェクトを使用してより詳細に表すことができます。

<!-- vale on -->

<code-example language="json">

"assets": [
  {
    "glob": "**/*",
    "input": "src/assets/",
    "output": "/assets/"
  },
  {
    "glob": "favicon.ico",
    "input": "src/",
    "output": "/"
  }
]

</code-example>

この拡張構成を使用して、プロジェクトの外部からアセットをコピーすることができます。
たとえば、次の設定は node package からアセットをコピーします:

<code-example language="json">

"assets": [
 {
   "glob": "**/*",
   "input": "./node_modules/some-package/images",
   "output": "/some-package/"
 }
]

</code-example>

<!-- vale Angular.Google_Will = NO -->

`node_modules/some-package/images/` の内容は `dist/some-package/` にあります。

<!-- vale Angular.Google_Will = YES -->

次の例では、 `ignore` フィールドを使用して、アセットフォルダー内の特定のファイルをビルドへのコピーから除外します:

<code-example language="json">

"assets": [
 {
   "glob": "**/*",
   "input": "src/assets/",
   "ignore": ["**/*.svg"],
   "output": "/assets/"
 }
]

</code-example>

{@a style-script-config}

### スタイルとスクリプトの設定 {@a styles-and-scripts-configuration}

`styles` および `scripts` オプションの配列エントリは、単純なパス文字列、または追加のエントリポイントファイルを指すオブジェクトにすることができます。
関連するビルダは、ビルド中にそのファイルとその依存関係を別個のバンドルとしてロードします。
設定オブジェクトでは、`bundleName` フィールドを使用して、エントリポイントのバンドルに名前を付けるオプションがあります。

バンドルはデフォルトでインジェクトされますが、インジェクションからバンドルを除外するために `inject` を false に設定できます。
たとえば、次のオブジェクトの値は、スタイルとスクリプトを含むバンドルを作成して名前を付け、インジェクションから除外します:

<code-example language="json">

   "styles": [
     {
       "input": "src/external-module/styles.scss",
       "inject": false,
       "bundleName": "external-module"
     }
   ],
   "scripts": [
     {
       "input": "src/external-module/main.js",
       "inject": false,
       "bundleName": "external-module"
     }
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

<a id="style-preprocessor"></a>

#### スタイルプリプロセッサオプション

Sassでは、コンポーネントスタイルとグローバルスタイルの両方で `includePaths` 機能を利用できます。これにより、インポートのためにチェックされる追加のベースパスを追加できます。

パスを追加するには、`stylePreprocessorOptions` オプションを使用します:

<code-example language="json">

"stylePreprocessorOptions": {
  "includePaths": [
    "src/style-paths"
  ]
}

</code-example>

`src/style-paths/_variables.scss` のようなそのディレクトリ内のファイルは、相対パスを必要とせずにプロジェクトのどこからでもインポートできます:

<code-example language="typescript">

// src/app/app.component.scss
// A relative path works
@import '../style-paths/variables';
// But now this works as well
@import 'variables';

</code-example>

**NOTE**: ユニットテストに必要な場合は、`test`ビルダにスタイルやスクリプトを追加する必要があることに注意してください。
[アプリケーション内でのランタイムグローバルライブラリの使用](guide/using-libraries#using-runtime-global-libraries-inside-your-app)も参照してください。

### Optimization configuration

The `optimization` browser builder option can be either a Boolean or an Object for more fine-tune configuration. This option enables various optimizations of the build output, including:

<!-- vale Angular.Angular_Spelling = NO-->

*   Minification of scripts and styles
*   Tree-shaking
*   Dead-code elimination
*   Inlining of critical CSS
*   Fonts inlining

<!-- vale Angular.Angular_Spelling = YES-->

Several options can be used to fine-tune the optimization of an application.

| Option    | Description                                                                     | Value Type                                                               | Default Value |
|:---       |:---                                                                             |:---                                                                      |:---           |
| `scripts` | Enables optimization of the scripts output.                                     | `boolean`                                                                | `true`        |
| `styles`  | Enables optimization of the styles output.                                      | `boolean` \| [Styles optimization options](#styles-optimization-options) | `true`        |
| `fonts`   | Enables optimization for fonts. <br /> **NOTE**: This requires internet access. | `boolean` \| [Fonts optimization options](#fonts-optimization-options)   | `true`        |

#### Styles optimization options

<!-- vale Angular.Angular_Spelling = NO -->

| Option           | Description                                                                                                              | Value Type | Default Value |
|:---              |:---                                                                                                                      |:---        |:---           |
| `minify`         | Minify CSS definitions by removing extraneous whitespace and comments, merging identifiers, and minimizing values.        | `boolean`  | `true`        |
| `inlineCritical` | Extract and inline critical CSS definitions to improve [First Contentful Paint](https://web.dev/first-contentful-paint). | `boolean`  | `true`        |

<div class="alert is-helpful">

[Angular CLI](cli "CLI command reference") uses `Critters` to perform critical CSS inlining. For more information about this package see the [Critters README](https://github.com/GoogleChromeLabs/critters#readme).

</div>

#### Fonts optimization options

| Option   | Description                                                                                                                                                                                                                          | Value Type | Default Value |
|:---      |:---                                                                                                                                                                                                                                  |:---        |:---           |
| `inline` | Reduce [render blocking requests](https://web.dev/render-blocking-resources) by inlining external Google Fonts and Adobe Fonts CSS definitions in the application's HTML index file. <br /> **NOTE**: This requires internet access. | `boolean`  | `true`        |

<!-- vale Angular.Angular_Spelling = YES -->

You can supply a value such as the following to apply optimization to one or the other:

<code-example language="json">

"optimization": {
  "scripts": true,
  "styles": {
    "minify": true,
    "inlineCritical": true
  },
  "fonts": true
}

</code-example>

<div class="alert is-helpful">

   [SSR](guide/glossary#server-side-rendering) では、スタイルの最適化を `true` に、スタイルのソースマップを `false` に設定することにより、HTML ページに表示されるコードを削減できます。

</div>

### Source map configuration

The `sourceMap` browser builder option can be either a Boolean or an Object for more fine-tune configuration to control the source maps of an application.

| Option    | Description                                        | Value Type | Default Value |
|:---       |:---                                                |:---        |:---           |
| `scripts` | Output source maps for all scripts.                | `boolean`  | `true`        |
| `styles`  | Output source maps for all styles.                 | `boolean`  | `true`        |
| `vendor`  | Resolve vendor packages source maps.               | `boolean`  | `false`       |
| `hidden`  | Output source maps used for error reporting tools. | `boolean`  | `false`       |

The example below shows how to toggle one or more values to configure the source map outputs:

<code-example language="json">

"sourceMap": {
  "scripts": true,
  "styles": false,
  "hidden": true,
  "vendor": true
}

</code-example>

<div class="alert is-helpful">

   非表示のソースマップを使用する場合、ソースマップはバンドルで参照されません。
   これらは、ソースマップでエラー報告ツールのエラースタックトレースのみをマッピングするが、ブラウザ開発者ツールでソースマップを公開したくない場合に役立ちます。

</div>

<a id="index-config"></a>

### Index configuration

Configures the generation of the application's HTML index.

The `index` option can be either a String or an Object for more fine-tune configuration.

When supplying the value as a String the filename of the specified path will be used for the generated file and will be created in the root of the application's configured output path.

#### Index options
| Options  | Details                                                                                                                                                                          | Value type | Default value |
|:---      |:---                                                                                                                                                                              |:---        |:---           |
| `input`  | The path of a file to use for the application's generated HTML index.                                                                                                            | `string`   |               |
| `output` | The output path of the application's generated HTML index file. The full provided path will be used and will be considered relative to the application's configured output path. | `string`   | `index.html`  |


<!-- links -->

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Common Internationalization task #6: Merge translations into the application | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2023-10-24
