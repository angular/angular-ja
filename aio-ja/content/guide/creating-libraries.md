# ライブラリを作成する

Angular の機能を拡張するために新しいライブラリを作成して公開することができます。

同じ問題を複数のアプリケーションで解決する必要があると判断した場合 (または他の開発者と解決策を共有したい場合)、それはライブラリの候補となります。
簡単な例としては、会社の Web サイトにユーザーを送信するボタンがあります。これは、会社が構築するすべてのアプリケーションに含まれています。

## はじめに

Angular CLI を使用して次のコマンドで新しいライブラリスケルトンを生成します。

<code-example language="bash">
 ng new my-workspace --create-application=false
 cd my-workspace
 ng generate library my-lib
</code-example>

The `ng generate` command creates the `projects/my-lib` folder in your workspace, which contains a component and a service inside an NgModule.

<div class="alert is-helpful">

     For more details on how a library project is structured, refer to the [Library project files](guide/file-structure#library-project-files) section of the [Project File Structure guide](guide/file-structure).

     You can use the monorepo model to use the same workspace for multiple projects.
     See [Setting up for a multi-project workspace](guide/file-structure#multiple-projects).

</div>

When you generate a new library, the workspace configuration file, `angular.json`, is updated with a project of type `library`.

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

CLI コマンドを使用してプロジェクトをビルド、テスト、およびチェックすることができます:

<code-example language="bash">
 ng build my-lib --configuration development
 ng test my-lib
 ng lint my-lib
</code-example>

プロジェクト用に構成されたビルダーは、アプリケーションプロジェクト用のデフォルトのビルダーとは異なることに注意してください。
このビルダーはライブラリーがいつも [AoT コンパイラー](guide/aot-compiler)でビルドされることを保証します。

ライブラリコードを再利用可能にするには、そのためのパブリック API を定義する必要があります。この「ユーザー層」はライブラリの使用者が使用できるものを定義します。ライブラリのユーザーは、単一のインポートパスを通してパブリック機能 (NgModules、サービスプロバイダー、一般的なユーティリティ機能など) にアクセス可能であるべきです。

ライブラリのパブリック API は、ライブラリフォルダの `public-api.ts` ファイルで管理されています。
このファイルからエクスポートされたものはすべて、ライブラリがアプリケーションにインポートされたときに公開されます。
NgModule を使用してサービスとコンポーネントを公開します。

ライブラリはインストールとメンテナンスのためにドキュメンテーション (通常は README ファイル) を提供するべきです。

## アプリケーションの一部をライブラリにリファクタリングする

ソリューションを再利用可能にするには、それがアプリケーション固有のコードに依存しないように調整する必要があります。
アプリケーション機能をライブラリに移行する際に考慮すべき点がいくつかあります。

* コンポーネントやパイプなどの宣言はステートレスとして設計する必要があります。つまり、外部変数に依存したり変わったりすることはありません。状態に依存している場合は、すべてのケースを評価し、それがアプリケーションの状態か、ライブラリが管理する状態かを判断する必要があります。

* コンポーネントが内部的にサブスクライブしている Observable は、それらのコンポーネントのライフサイクル中にクリーンアップされ、除去されるべきです。

* コンポーネントは、コンテキストを提供するための入力、およびイベントを他のコンポーネントに伝達するための出力を介してそれらの相互作用を公開する必要があります。

* すべての内部依存関係を確認してください。
   * コンポーネントまたはサービスで使用されるカスタムクラスまたはインターフェースの場合は、それらも移行が必要な追加のクラスまたはインターフェースに依存しているかどうかを確認します。
   * 同様に、ライブラリコードがサービスに依存している場合は、そのサービスを移行する必要があります。
   * ライブラリコードまたはそのテンプレートが他のライブラリ (Angular Material など) に依存している場合は、それらの依存関係を使用してライブラリを構成する必要があります。

* Consider how you provide services to client applications.

   * Services should declare their own providers, rather than declaring providers in the NgModule or a component. Declaring a provider makes that service *tree-shakable*. This practice allows the compiler to leave the service out of the bundle if it never gets injected into the application that imports the library. For more about this, see [Tree-shakable providers](guide/architecture-services#providing-services).

   * If you register global service providers or share providers across multiple NgModules, use the [`forRoot()` and `forChild()` design patterns](guide/singleton-services) provided by the [RouterModule](api/router/RouterModule).

   * If your library provides optional services that might not be used by all client applications, support proper tree-shaking for that case by using the [lightweight token design pattern](guide/lightweight-injection-tokens).

{@a integrating-with-the-cli}

## コード生成Schematicsを使ったCLIとの連携

ライブラリには通常、コンポーネント、サービス、およびプロジェクトにインポートするだけのその他の Angular アーティファクト (パイプ、ディレクティブなど) を定義する再利用可能なコードが含まれています。
ライブラリーは、公開および共有のために npm パッケージにパッケージ化されており、このパッケージには、CLI が `ng generate component` を使用して汎用スケルトンアプリケーションを作成するのと同じ方法で、プロジェクト内で直接コードを生成または変換するための手順を提供する [schematics](guide/glossary#schematic) を含めることもできます。
ライブラリと組み合わせた schematics は、たとえば Angular CLI にそのライブラリで定義された特定のコンポーネントを生成するために必要な情報を提供することができます。
One example of this is [Angular Material's navigation schematic](https://material.angular.io/guide/schematics#navigation-schematic) which configures the CDK's [BreakpointObserver](https://material.angular.io/cdk/layout/overview#breakpointobserver) and uses it with Material's [MatSideNav](https://material.angular.io/components/sidenav/overview) and [MatToolbar](https://material.angular.io/components/toolbar/overview) components.

You can create and include the following kinds of schematics.

* `ng add` がライブラリをプロジェクトに追加できるようにインストール用の schematic を含めてください。

* `ng generate` がプロジェクト内の定義済みの成果物 (コンポーネント、サービス、テストなど) に雛形を生成することができるように、生成用の schematics を含めます。

* `ng update` がライブラリの依存関係を更新し、新しいリリースでの破壊的変更の移行を提供できるように、更新 schematic を含めてください。

ライブラリーに含めるものは、実現したいタスクの種類によって決まります。
たとえば、データをドロップダウンしてアプリケーションに追加する方法を示すために、ライブラリに作成する schematic を定義することができます。
毎回異なる渡された値を含むドロップダウンのようなコンポーネントの場合は、それを共有ライブラリのコンポーネントとして指定できます。

設定ファイルを読み、その設定に基づいてフォームを生成したいとしましょう。
そのフォームがユーザーによる追加のカスタマイズを必要とするならば、それは schematic としてもっともうまくいくかもしれません。
ただし、フォームが常に同じで開発者がそれほどカスタマイズする必要がない場合は、構成を取得してフォームを生成する動的コンポーネントを作成できます。
一般に、カスタマイズが複雑になればなるほど、schematic アプローチはより有用になります。

詳細については、[Schematics の概要](guide/schematics) および [ライブラリの Schematics](guide/schematics-for-libraries) を参照してください。

## ライブラリを公開する {@a publishing-your-library}

Angular CLI と npm パッケージマネージャーを使用して、ライブラリを npm パッケージとしてビルドおよび公開します。


Angular CLI uses a tool called [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) to create packages
from your compiled code that can be published to npm.
See [Building libraries with Ivy](guide/creating-libraries#ivy-libraries) for information on the
distribution formats supported by `ng-packagr` and guidance on how
to choose the right format for your library.

You should always build libraries for distribution using the `production` configuration.
This ensures that generated output uses the appropriate optimizations and the correct package format for npm.

<code-example language="bash">
ng build my-lib
cd dist/my-lib
npm publish
</code-example>


{@a lib-assets}

## Managing assets in a library

Starting with version 9.x of the [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) tool, you can configure the tool to automatically copy assets into your library package as part of the build process.
You can use this feature when your library needs to publish optional theming files, Sass mixins, or documentation (like a changelog).

* Learn how to [copy assets into your library as part of the build](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md).

* Learn more about how to use the tool to [embed assets in CSS](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

## リンクライブラリ

公開されているライブラリで作業している間は、すべてのビルドでライブラリを再インストールしないように [npm link](https://docs.npmjs.com/cli/link) を使用できます。

ライブラリはすべての変更ごとに再ビルドする必要があります。
ライブラリをリンクするときは、ビルドステップが監視モードで実行されていること、およびライブラリの `package.json` 設定が正しいエントリポイントを指していることを確認してください。
たとえば、`main` は TypeScript ファイルではなく JavaScript ファイルを指す必要があります。

### ピア依存関係に TypeScript パスマッピングを使用する

Angular ライブラリはすべての `@angular/*` 依存関係をピア依存関係として一覧にするべきです。
これは、モジュールが Angular を要求したときに、それらがすべてまったく同じモジュールを取得することを保証します。
ライブラリが `peerDependencies` の代わりに `dependencies` に `@angular/core` をリストしていると、代わりに別の Angular モジュールを取得するかもしれず、それはアプリケーションを壊すでしょう。

ライブラリを開発している間、ライブラリが正しくコンパイルされることを保証するために `devDependencies` を通してすべてのピア依存関係をインストールしなければなりません。
リンクされたライブラリは、それ自身の `node_modules` フォルダにある、構築に使用する独自の Angular ライブラリのセットを持ちます。
ただし、これはアプリケーションのビルド中または実行中に問題を引き起こす可能性があります。

この問題を回避するには、TypeScript パスマッピングを使用して、特定の場所からモジュールを読み込むように TypeScript に指示します。
ライブラリが TypeScript 設定ファイル `./tsconfig.json` の中で使用しているすべてのピア依存関係をリストアップし、それらをアプリケーションの `node_modules` フォルダの中のローカルコピーを指すようにしてください。

```
{
  "compilerOptions": {
    // ...
    // paths are relative to `baseUrl` path.
    "paths": {
      "@angular/*": [
        "./node_modules/@angular/*"
      ]
    }
  }
}
```

このマッピングにより、ライブラリは常に必要なモジュールのローカルコピーをロードするようになります。


## アプリケーションで自身のライブラリを使う

自分のアプリケーションでライブラリを使用するためにライブラリを npm パッケージマネージャーに公開する必要はありませんが、最初にビルドする必要があります。

アプリケーションで独自のライブラリを使用するには：

* ライブラリをビルドします。 ライブラリをビルドする前に使用することはできません。
 <code-example language="bash">
 ng build my-lib
 </code-example>

* アプリケーション内で、名前でライブラリからインポートします。
 ```
 import { myExport } from 'my-lib';
 ```

### ライブラリのビルドと再ビルド

ライブラリを npm パッケージとして公開してから npm からアプリケーションにインストールし直していない場合は、ビルド手順が重要です。
たとえば、git リポジトリを複製して `npm install` を実行した場合、まだライブラリを構築していなければ、エディタは `my-lib` インポートが見つからないと表示します。

<div class="alert is-helpful">

Angular アプリケーションでライブラリから何かをインポートすると、Angular はライブラリ名とディスク上の場所の間のマッピングを探します。
ライブラリパッケージをインストールすると、マッピングは `node_modules` フォルダにあります。自身のライブラリを構築するとき、それは `tsconfig` パスでマッピングを見つけなければなりません。

Angular CLI でライブラリを生成すると自動的にそのパスが  `tsconfig` ファイルに追加されます。
Angular CLI は `tsconfig` パスを使用してビルドシステムにライブラリの場所を伝えます。

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

The CLI `build` command uses a different builder and invokes a different build tool for libraries than it does for applications.

* The  build system for apps, `@angular-devkit/build-angular`, is based on `webpack`, and is included in all new Angular CLI projects.
* The build system for libraries is based on `ng-packagr`. It is only added to your dependencies when you add a library using `ng generate library my-lib`.

The two build systems support different things, and even where they support the same things, they do those things differently.
This means that the TypeScript source can result in different JavaScript code in a built library than it would in a built application.

For this reason, an app that depends on a library should only use TypeScript path mappings that point to the *built library*.
TypeScript path mappings should *not* point to the library source `.ts` files.

</div>

{@a ivy-libraries}

## Building libraries with Ivy

There are three distribution formats that you can use when publishing a library:

* View Engine _(deprecated)_&mdash;legacy format, slated for removal in Angular version 13.
  Only use this format if you must support View Engine applications.
* partial-Ivy **(recommended)**&mdash;contains portable code that can be consumed by Ivy applications built with any version of Angular from v12 onwards.
* full-Ivy&mdash;contains private Angular Ivy instructions, which are not guaranteed to work across different versions of Angular. This format requires that the library and application are built with the _exact_ same version of Angular. This format is useful for environments where all library and application code is built directly from source.

New libraries created with Angular CLI default to partial-Ivy format.
If you are creating a new library with `ng generate library`, Angular uses Ivy by default with no further action on your part.

### Transitioning libraries to partial-Ivy format

Existing libraries, which are configured to generate the View Engine format, do not change when upgrading to later versions of Angular that use Ivy.

If you intend to publish your library to npm, compile with partial-Ivy code by setting `"compilationMode": "partial"` in `tsconfig.prod.json`.

A library that uses View Engine, rather than Ivy, has a `tsconfig.prod.json` file that contains the following:

<code-example>

"angularCompilerOptions": {
  "enableIvy": false
}

</code-example>

To convert such libraries to use the partial-Ivy format, change the `tsconfig.prod.json` file by removing the `enableIvy` option and adding the `compilationMode` option.

Enable partial-Ivy compilation by replacing `"enableIvy": false` with `"compilationMode": "partial"` as follows:

<code-example>

"angularCompilerOptions": {
  "compilationMode": "partial"
}

</code-example>

For publishing to npm use the partial-Ivy format as it is stable between patch versions of Angular.

Avoid compiling libraries with full-Ivy code if you are publishing to npm because the generated Ivy instructions are not part of Angular's public API, and so may change between patch versions.

Partial-Ivy code is not backward compatible with View Engine.
If you use the library in a View Engine application, you must compile the library into the View Engine format by setting `"enableIvy": false` in the `tsconfig.json` file.

Ivy applications can still consume the View Engine format because the Angular compatibility compiler, or `ngcc`, can convert it to Ivy.

## Ensuring library version compatibility

The Angular version used to build an application should always be the same or greater than the Angular versions used to build any of its dependent libraries.
For example, if you had a library using Angular version 12, the application that depends on that library should use Angular version 12 or later.
Angular does not support using an earlier version for the application.

<div class="alert is-helpful">

The Angular CLI uses Ivy to build applications and no longer uses View Engine.
A library or an application built with View Engine cannot consume a partial-Ivy library.

</div>

Because this process happens during the application build, it uses the same version of the Angular compiler, ensuring that the application and all of its libraries use a single version of Angular.

If you intend to publish your library to npm, compile with partial-Ivy code by setting `"compilationMode": "partial"` in `tsconfig.prod.json`.
This partial format is stable between different versions of Angular, so is safe to publish to npm.

Avoid compiling libraries with full-Ivy code if you are publishing to npm because the generated Ivy instructions are not part of Angular's public API, and so might change between patch versions.

Partial-Ivy code is not backward compatible with View Engine.
If you use the library in a View Engine application, you must compile the library into the View Engine format by setting `"enableIvy": false` in the `tsconfig.json` file.

Ivy applications can still consume the View Engine format because the Angular compatibility compiler, or `ngcc`, can convert it to Ivy in the Angular CLI.

If you've never published a package in npm before, you must create a user account. Read more in [Publishing npm Packages](https://docs.npmjs.com/getting-started/publishing-npm-packages).


## Consuming partial-Ivy code outside the Angular CLI

An application installs many Angular libraries from npm into its `node_modules` directory.
However, the code in these libraries cannot be bundled directly along with the built application as it is not fully compiled.
To finish compilation, you can use the Angular linker.

For applications that don't use the Angular CLI, the linker is available as a Babel plugin.
You can use the Babel plugin using the module `@angular/compiler-cli/linker/babel` to incorporate into your builds.
For example, you can integrate the plugin into a custom Webpack build by registering the linker as a plugin for `babel-loader`.

Previously, if you ran `yarn install` or `npm install` you had to re-run `ngcc`.
Now, libraries only need to be processed by the linker a single time, regardless of other npm operations.

The Angular linker Babel plugin supports build caching, meaning that libraries only need to be processed by the linker a single time, regardless of other npm operations.

<div class="alert is-helpful">

The Angular CLI integrates the linker plugin automatically, so if consumers of your library are using the CLI, they can install Ivy-native libraries from npm without any additional configuration.

</div>
