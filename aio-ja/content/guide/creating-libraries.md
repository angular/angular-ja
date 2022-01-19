# ライブラリを作成する {@a creating-libraries}

このページでは、Angularの機能を拡張するための新しいライブラリを作成し公開する方法の概要を説明します。

同じ問題を複数のアプリケーションで解決する必要があると判断した場合 (または他の開発者と解決策を共有したい場合)、それはライブラリの候補となります。
簡単な例としては、会社の Web サイトにユーザーを送信するボタンがあります。これは、会社が構築するすべてのアプリケーションに含まれています。

## はじめに {@a getting-started}

Angular CLI を使用して次のコマンドで新しいワークスペースに新しいライブラリスケルトンを生成します。

<code-example language="bash">
 ng new my-workspace --no-create-application
 cd my-workspace
 ng generate library my-lib
</code-example>

<div class="callout is-important">

<header>ライブラリに名前を付ける</header>

  後でnpmなどの公開のパッケージレジストリでライブラリを公開したい場合は、ライブラリの名前を選択する際に十分に注意する必要があります。[ライブラリを公開する](guide/creating-libraries#publishing-your-library)を参照しましょう。

  `ng-library`のような接頭辞が`ng-`である名前の使用は避けましょう。接頭辞`ng-`は、Angularフレームワークとそのライブラリで使用される予約済みのキーワードです。ライブラリがAngularでの使用に適していることを示すために使用される慣行として、接頭辞`ngx-`が推奨されます。それはまた、レジストリの利用者にとって、異なるJavaScriptフレームワークのライブラリと区別するための優れた示唆でもあります。

</div>

この`ng generate`コマンドは、ワークスペースに`projects/my-lib`フォルダーを作成します。それは、NgModule内にコンポーネントとサービスを含んでいます。

<div class="alert is-helpful">

     ライブラリプロジェクトがどのように構築されるか詳細については、[プロジェクトファイル構造ガイド](guide/file-structure)の[ライブラリプロジェクトファイル](guide/file-structure#library-project-files)セクションを参照しましょう。

     複数のプロジェクトで同じワークスペースを使うために、単一リポジトリのモデルを使用できます。
     [マルチプロジェクトのワークスペース設定](guide/file-structure#multiple-projects)を参照しましょう。

</div>

新しいライブラリを生成すると、ワークスペース設定ファイル`angular.json`が`library`タイプのプロジェクトで更新されます。

<code-example format="json">
"projects": {
  ...
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:ng-packagr",
        ...
</code-example>

CLI コマンドを使用してプロジェクトをビルド、テスト、およびリントができます:

<code-example language="bash">
 ng build my-lib --configuration development
 ng test my-lib
 ng lint my-lib
</code-example>

このプロジェクト用に構成されたビルダーは、アプリケーションプロジェクト用のデフォルトのビルダーとは異なることに注意してください。
このビルダーはライブラリーがいつも [AoT コンパイラー](guide/aot-compiler)でビルドされることを保証します。

ライブラリコードを再利用可能にするには、そのためのパブリック API を定義する必要があります。この「ユーザー層」はライブラリの使用者が使用できるものを定義します。ライブラリのユーザーは、単一のインポートパスを通してパブリック機能 (NgModules、サービスプロバイダー、一般的なユーティリティ機能など) にアクセス可能であるべきです。

ライブラリのパブリック API は、ライブラリフォルダの `public-api.ts` ファイルで管理されています。
このファイルからエクスポートされたものはすべて、ライブラリがアプリケーションにインポートされたときに公開されます。
NgModule を使用してサービスとコンポーネントを公開します。

ライブラリはインストールとメンテナンスのためにドキュメンテーション (通常は README ファイル) を提供するべきです。

## アプリケーションの一部をライブラリにリファクタリングする {@a refactoring-parts-of-an-app-into-a-library}

ソリューションを再利用可能にするには、それがアプリケーション固有のコードに依存しないように調整する必要があります。
アプリケーション機能をライブラリに移行する際に考慮すべき点がいくつかあります。

* コンポーネントやパイプなどの宣言はステートレスとして設計する必要があります。つまり、外部変数に依存したり外部変数を変更したりしないという意味です。状態に依存している場合は、すべてのケースを評価し、それがアプリケーションの状態か、ライブラリが管理する状態かを判断する必要があります。

* コンポーネントが内部的にサブスクライブしている Observable は、それらのコンポーネントのライフサイクル中にクリーンアップされ、除去されるべきです。

* コンポーネントは、コンテキストを提供するための入力と、他のコンポーネントにイベントを伝達するための出力を通じて、相互作用を公開する必要があります。

* すべての内部依存関係を確認してください。
   * コンポーネントまたはサービスで使用されるカスタムクラスまたはインターフェースの場合は、それらも移行が必要な追加のクラスまたはインターフェースに依存しているかどうかを確認します。
   * 同様に、ライブラリコードがサービスに依存している場合は、そのサービスを移行する必要があります。
   * ライブラリコードまたはそのテンプレートが他のライブラリ (Angular Material など) に依存している場合は、それらの依存関係を使用してライブラリを構成する必要があります。

* クライアントアプリケーションにサービスを提供する方法を検討しましょう。

   * サービスは、NgModuleやコンポーネントでプロバイダーを定義するのではなく、独自のプロバイダーを定義する必要があります。プロバイダーを定義すると、そのサービスは*ツリーシェイク可能*になります。この方法により、もしライブラリをインポートするアプリケーションにサービスが注入されない場合、コンパイラはサービスをバンドルから除外できます。詳しくは、[ツリーシェイク可能なプロバイダー](guide/architecture-services#providing-services)を参照しましょう。

   * グローバルサービスプロバイダーを登録するか、複数のNgModule間でプロバイダーを共有する場合は、[RouterModule](api/router/RouterModule)によって提供される[`forRoot()`と`forChild()`のデザインパターン](guide/singleton-services)を使用しましょう。

   * すべてのクライアントアプリケーションで使用されない可能性のある、オプションのサービスをライブラリが提供している場合は、[軽量トークンデザインパターン](guide/lightweight-injection-tokens)を利用して、その場合の適切なツリーシェイクをサポートします。

{@a integrating-with-the-cli}

## コード生成Schematicsを使ったCLIとの連携 {@a integrating-with-the-cli-using-code-generation-schematics}

ライブラリには通常、*再利用可能なコード*が含まれています。それは、プロジェクトにインポートするコンポーネントやサービス、その他のAngularアーティファクト(パイプ、ディレクティブ)を定義しています。
ライブラリは公開・共有のためにnpmパッケージにパッケージ化されています。
このパッケージには[schematic](guide/glossary#schematic)を含めることもできます。これは、CLIが`ng generate component`で汎用的な新しいコンポーネントを作成するのと同様に、プロジェクトに直接コードを生成または変換するための手順を提供します。
ライブラリと一緒にパッケージ化されたschematicは、たとえば、そのライブラリで定義された特定の機能や機能のセットを設定・使用するコンポーネントを生成するための、必要な情報をAngular CLIに提供できます。
この一例は[Angular Materialのnavigation schematic](https://material.angular.io/guide/schematics#navigation-schematic)です。これは、CDKの[BreakpointObserver](https://material.angular.io/cdk/layout/overview#breakpointobserver)を設定し、それをMaterialの[MatSideNav](https://material.angular.io/components/sidenav/overview)と[MatToolbar](https://material.angular.io/components/toolbar/overview)コンポーネントで使用しています。

次の種類のschematicを作成して含めることができます。

* インストールのschematicを含めると、`ng add`で、ライブラリをプロジェクトに追加できます。

* 生成のschematicをライブラリに含めると、`ng generate`で、定義したアーティファクト(コンポーネント、サービス、テスト)の足場をプロジェクトに作れます。

* 更新のschematicを含めると、`ng update`で、ライブラリの依存関係を更新し新しいリリースでの破壊的変更のための移行を提供できます。

ライブラリーに含めるものは、実現したいタスクの種類によって決まります。
たとえば、既定のデータで事前入力されたドロップダウンを作成し、それをアプリケーションに追加する方法を示すschematicを定義できます。
毎回異なる渡された値を含むドロップダウンが必要な場合は、指定の設定でそれを作成するschematicをライブラリは定義できます。その後、開発者は `ng generate`を使って、独自のアプリケーション用にインスタンスを設定できます。

設定ファイルを読み、その設定に基づいてフォームを生成したいとしましょう。
そのフォームがライブラリを使用している開発者による追加のカスタマイズが必要な場合は、それはschematicとしてもっともうまくいくかもしれません。
ただし、フォームが常に同じで開発者がそれほどカスタマイズする必要がない場合は、設定を取得してフォームを生成する動的コンポーネントを作成できます。
一般に、カスタマイズが複雑になればなるほど、schematic アプローチはより有用になります。

詳細については、[Schematics の概要](guide/schematics) および [ライブラリの Schematics](guide/schematics-for-libraries) を参照してください。

## ライブラリを公開する {@a publishing-your-library}

Angular CLI と npm パッケージマネージャーを使用して、ライブラリを npm パッケージとしてビルドおよび公開します。


Angular CLIは、[ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md)と呼ばれるツールを使用して、
コンパイルされたコードからnpmに公開できるパッケージを作成します。
`ng-packagr`でサポートされている配布形式の情報と、
ライブラリに適切な形式を選択する方法のガイダンスについては、
[Ivyでライブラリをビルドする](guide/creating-libraries#ivy-libraries)を参照してください。

常に`production`設定を使用して配布用のライブラリをビルドする必要があります。
これにより、生成された出力がnpmの適切な最適化と正しいパッケージ形式を使用することが保証されます。

<code-example language="bash">
ng build my-lib
cd dist/my-lib
npm publish
</code-example>


{@a lib-assets}

## ライブラリ内のアセットの管理 {@a managing-assets-in-a-library}

In your Angular library, the distributable can include additional assets like theming files, Sass mixins, or documentation (like a changelog).
For more information [copy assets into your library as part of the build](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) and [embed assets in component styles](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

<div class="alert is-important">

When including additional assets like Sass mixins or pre-compiled CSS. You need to add these manually to the conditional ["exports"](guide/angular-package-format/#exports) in the `package.json` of the primary entrypoint.

`ng-packagr` will merge handwritten `"exports"` with the auto-generated ones, allowing for library authors to configure additional export subpaths, or custom conditions.

<code-example language="json">
"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}
</code-example>

The above is an extract from the [@angular/material](https://unpkg.com/browse/@angular/material/package.json) distributable.
</div>

## Peer dependencies
Angularのライブラリは、ライブラリが依存するすべての`@angular/*`の依存関係をピア依存関係としてリストする必要があります。
これは、モジュールが Angular を要求したときに、それらがすべてまったく同じモジュールを取得することを保証します。
ライブラリが `peerDependencies` の代わりに `dependencies` に `@angular/core` をリストしていると、代わりに別の Angular モジュールを取得するかもしれず、それはアプリケーションを壊すでしょう。

## Using your own library in applications

You don't have to publish your library to the npm package manager to use it the same workspace, but you do have to build it first.

To use your own library in an application:

* ライブラリをビルドします。 ライブラリをビルドする前に使用することはできません。
 <code-example language="bash">
 ng build my-lib
 </code-example>

* アプリケーション内で、名前でライブラリからインポートします。
 ```
 import { myExport } from 'my-lib';
 ```

### ライブラリのビルドと再ビルド {@a building-and-rebuilding-your-library}

ライブラリをnpmパッケージとして公開しておらず、パッケージをnpmからアプリケーションにインストールし直していない場合は、ビルド手順が重要です。
たとえば、git リポジトリをクローンして `npm install` を実行した場合、まだライブラリをビルドしていなければ、エディタは `my-lib` インポートが見つからないと表示します。

<div class="alert is-helpful">

Angular アプリケーションでライブラリから何かをインポートすると、Angular はライブラリ名とディスク上の場所の間のマッピングを探します。
ライブラリパッケージをインストールすると、マッピングは `node_modules` フォルダにあります。自身のライブラリをビルドするとき、それは `tsconfig` パスでマッピングを見つけなければなりません。

Angular CLI でライブラリを生成すると自動的にそのパスが  `tsconfig` ファイルに追加されます。
Angular CLI は `tsconfig` パスを使用してビルドシステムにライブラリの場所を伝えます。

For more information, see [Path mapping overview](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

</div>

ライブラリへの変更がアプリケーションに反映されていないことが判明した場合、アプリケーションはおそらくライブラリの古いビルドを使用しています。

ライブラリを変更するときはいつでもライブラリを再ビルドできますが、この追加の手順には時間がかかります。
*インクリメンタルビルド*機能はライブラリ開発の経験を向上させます。
ファイルが変更されるたびに、修正されたファイルを出力する部分ビルドが実行されます。

開発環境では、インクリメンタルビルドをバックグラウンドプロセスとして実行することができます。この機能を利用するには、build コマンドに `--watch` フラグを追加してください。

<code-example language="bash">
ng build my-lib --watch
</code-example>

<div class="alert is-important">

CLIの`build`コマンドは、アプリケーションの場合とは異なるビルダーを使用し、ライブラリに対して異なるビルドツールを呼び出します。

* アプリケーションのビルドシステム`@angular-devkit/build-angular`は`webpack`に基づいており、すべての新しいAngular CLIプロジェクトに含まれています。
* ライブラリのビルドシステムは`ng-packagr`に基づいています。それは、`ng generate library my-lib`を使ってライブラリを追加した場合にのみ、依存関係に追加されます。

2つのビルドシステムは異なるものをサポートし、同じものをサポートしている場合でも、それらの動作は異なります。
これは、TypeScriptソースが、ビルドされたアプリケーションでの場合とは違って、ビルドされたライブラリにおいては異なるJavaScriptコードをもたらす可能性があることを意味します。

このため、ライブラリに依存するアプリケーションは、*ビルドされたライブラリ*を指すTypeScriptのパスマッピングのみを使用する必要があります。
TypeScriptのパスマッピングは、ライブラリソースの`.ts`ファイルを指すべきではありません。

</div>

{@a ivy-libraries}

## Publishing libraries

ライブラリを公開するときに使用できる配布形式は2つあります:

* 部分的なIvy **(推奨)** &mdash; v12以降のバージョンのAngularでビルドされたIvyアプリケーションで利用できる、移植可能なコードが含まれています。
* 完全なIvy &mdash; プライベートのAngularのIvy命令を含んでいて、Angularの異なるバージョン間での動作が保証されていません。この形式では、ライブラリとアプリケーションが_正確に_同じバージョンのAngularでビルドされている必要があります。この形式は、すべてのライブラリおよびアプリケーションコードがソースから直接ビルドされる環境で役立ちます。

npmに公開するには、Angularのパッチバージョン間で安定の、部分的なIvy形式を使用します。

npmに公開する場合は、ライブラリを完全なIvyコードでコンパイルしないようにします。その生成されたIvy命令はAngularのパブリックAPIの一部ではなく、パッチバージョン間で変更される可能性があるからです。

## ライブラリバージョンの互換性の確保 {@a ensuring-library-version-compatibility}

アプリケーションのビルドに使用されるAngularのバージョンは、依存ライブラリのビルドに使用されるAngularのバージョン以上である必要があります。
たとえば、Angularバージョン13を使用するライブラリがある場合、そのライブラリに依存するアプリケーションはAngularバージョン13以上を使用する必要があります。
Angularは、アプリケーションに以前のバージョンを使用することをサポートしていません。


ライブラリをnpmに公開したい場合は、`tsconfig.prod.json`で`"compilationMode": "partial"`を設定して、部分的なIvyコードでコンパイルします。
この部分的な形式はAngularの異なるバージョン間で安定しているため、npmに安全に公開できます。Code with this format is processed during the application build using the same version of the Angular compiler, ensuring that the application and all of its libraries use a single version of Angular.


npmに公開する場合は、ライブラリを完全なIvyコードでコンパイルしないようにします。その生成されたIvy命令はAngularのパブリックAPIの一部ではなく、パッチバージョン間で変更される可能性があるからです。

これまでnpmでパッケージを公開したことがない場合は、ユーザーアカウントを作成する必要があります。詳しくは[npmパッケージを公開](https://docs.npmjs.com/getting-started/publishing-npm-packages)を参照しましょう。

## Angular CLIの外部で部分的なIvyのコードを利用 {@a consuming-partial-ivy-code-outside-the-angular-cli}

アプリケーションはたくさんのAngularライブラリをnpmからその`node_modules`ディレクトリにインストールします。
しかし、これらのライブラリのコードはビルドされたアプリケーションと直接一緒にはバンドルできません。それが完全にはコンパイルされていないためです。
コンパイルを完了させるために、Angularのリンカーを使用できます。

Angular CLIを使わないアプリケーションの場合、リンカーは[Babel](https://babeljs.io/)プラグインとして利用できます。
The plugin is to be imported from `@angular/compiler-cli/linker/babel`.

The Angular linker Babel plugin supports build caching, meaning that libraries only need to be processed by the linker a single time, regardless of other npm operations.

Example of integrating the plugin into a custom [Webpack](https://webpack.js.org/) build by registering the linker as a [Babel](https://babeljs.io/) plugin using [babel-loader](https://webpack.js.org/loaders/babel-loader/#options).

<code-example
  path="angular-linker-plugin/webpack.config.mjs"
  region="webpack-config"
  header="webpack.config.mjs">
</code-example>

<div class="alert is-helpful">

Angular CLIはリンカープラグインを自動的に統合するため、ライブラリの利用者がCLIを使用している場合、Ivyネイティブのライブラリをnpmから追加の設定なしでインストールできます。

</div>

@reviewed 2021-11-03
