# ライブラリを作成する

Angular の機能を拡張するために新しいライブラリを作成して公開することができます。同じ問題を複数のアプリで解決する必要があると判断した場合 (または他の開発者と解決策を共有したい場合)、それはライブラリの候補となります。

簡単な例としては、会社の Web サイトにユーザーを送信するボタンがあります。これは、会社が構築するすべてのアプリに含まれています。

<div class="alert is-helpful">
     <p>ライブラリプロジェクトの構造の詳細については、<a href="guide/file-structure#library-project-files">ライブラリプロジェクトファイル</a>を参照してください。</p>
</div>

## はじめに

Angular CLI を使用して次のコマンドで新しいライブラリスケルトンを生成します。

<code-example language="bash">
 ng new my-workspace --create-application=false
 cd my-workspace
 ng generate library my-lib
</code-example>

<div class="alert is-helpful">
     <p>You can use the monorepo model to use the same workspace for multiple projects. See <a href="guide/file-structure#multiple-projects">Setting up for a multi-project workspace</a>.</p>
</div>

これはあなたのワークスペースに `projects/my-lib` フォルダを作成します。そこには NgModule 内のコンポーネントとサービスが含まれています。
ワークスペースの設定ファイル `angular.json` は、タイプ 'library' のプロジェクトで更新されています。

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
        "builder": "@angular-devkit/build-ng-packagr:build",
        ...
</code-example>

CLI コマンドを使用してプロジェクトをビルド、テスト、およびチェックすることができます:

<code-example language="bash">
 ng build my-lib
 ng test my-lib
 ng lint my-lib
</code-example>

プロジェクト用に構成されたビルダーは、アプリプロジェクト用のデフォルトのビルダーとは異なることに注意してください。
このビルダーは、とりわけ、`--prod` フラグを指定する必要はなく、ライブラリーがいつも [AoT コンパイラー](guide/aot-compiler)でビルドされることを保証します。

ライブラリコードを再利用可能にするには、そのためのパブリック API を定義する必要があります。この「ユーザー層」はライブラリの使用者が使用できるものを定義します。ライブラリのユーザーは、単一のインポートパスを通してパブリック機能 (NgModules、サービスプロバイダー、一般的なユーティリティ機能など) にアクセス可能であるべきです。

ライブラリのパブリック API は、ライブラリフォルダの `public-api.ts` ファイルで管理されています。
このファイルからエクスポートされたものはすべて、ライブラリがアプリケーションにインポートされたときに公開されます。
NgModule を使用してサービスとコンポーネントを公開します。

ライブラリはインストールとメンテナンスのためにドキュメンテーション (通常は README ファイル) を提供するべきです。

## アプリの一部をライブラリにリファクタリングする

ソリューションを再利用可能にするには、それがアプリ固有のコードに依存しないように調整する必要があります。
アプリケーション機能をライブラリに移行する際に考慮すべき点がいくつかあります。

* コンポーネントやパイプなどの宣言はステートレスとして設計する必要があります。つまり、外部変数に依存したり変わったりすることはありません。状態に依存している場合は、すべてのケースを評価し、それがアプリケーションの状態か、ライブラリが管理する状態かを判断する必要があります。

* コンポーネントが内部的にサブスクライブしている Observable は、それらのコンポーネントのライフサイクル中にクリーンアップされ、除去されるべきです。

* コンポーネントは、コンテキストを提供するための入力、およびイベントを他のコンポーネントに伝達するための出力を介してそれらの相互作用を公開する必要があります。

* サービスは (NgModule やコンポーネントでプロバイダーを宣言するのではなく) 独自のプロバイダーを宣言する必要があります。そのため、それらは*ツリーシェイク可能*です。これにより、ライブラリをインポートするアプリケーションにサービスがインジェクトされることがない場合、コンパイラはサービスをバンドルから除外することができます。これについて詳しくは、[ツリーシェイク可能プロバイダ](guide/dependency-injection-providers#tree-shakable-providers) を参照してください。

* グローバルサービスプロバイダーを登録したり、複数の NgModule にわたってプロバイダーを共有したりする場合は、[RouterModule](api/router/RouterModule)で提供されている [`forRoot()` および `forChild()` パターン](guide/singleton-services) を使用してください。

* すべての内部依存関係を確認してください。
   * コンポーネントまたはサービスで使用されるカスタムクラスまたはインターフェースの場合は、それらも移行が必要な追加のクラスまたはインターフェースに依存しているかどうかを確認します。
   * 同様に、ライブラリコードがサービスに依存している場合は、そのサービスを移行する必要があります。
   * ライブラリコードまたはそのテンプレートが他のライブラリ (Angular Material など) に依存している場合は、それらの依存関係を使用してライブラリを構成する必要があります。

## 再利用可能なコードと schematics

ライブラリには通常、コンポーネント、サービス、およびプロジェクトにインポートするだけのその他の Angular アーティファクト (パイプ、ディレクティブなど) を定義する再利用可能なコードが含まれています。
ライブラリーは、公開および共有のために npm パッケージにパッケージ化されており、このパッケージには、CLI が `ng generate component` を使用して汎用スケルトンアプリケーションを作成するのと同じ方法で、プロジェクト内で直接コードを生成または変換するための手順を提供する [schematics](guide/glossary#schematic) を含めることもできます。
ライブラリと組み合わせた schematics は、たとえば Angular CLI にそのライブラリで定義された特定のコンポーネントを生成するために必要な情報を提供することができます。

ライブラリーに含めるものは、実現したいタスクの種類によって決まります。
たとえば、データをドロップダウンしてアプリに追加する方法を示すために、ライブラリに作成する schematic を定義することができます。
毎回異なる渡された値を含むドロップダウンのようなコンポーネントの場合は、それを共有ライブラリのコンポーネントとして指定できます。

設定ファイルを読み、その設定に基づいてフォームを生成したいとしましょう。
そのフォームがユーザーによる追加のカスタマイズを必要とするならば、それは schematic としてもっともうまくいくかもしれません。
ただし、フォームが常に同じで開発者がそれほどカスタマイズする必要がない場合は、構成を取得してフォームを生成する動的コンポーネントを作成できます。
一般に、カスタマイズが複雑になればなるほど、schematic アプローチはより有用になります。

{@a integrating-with-the-cli}

## CLI との統合

ライブラリには、Angular CLI と統合するための [schematics](guide/glossary#schematic) を含めることができます。

* `ng add` がライブラリをプロジェクトに追加できるようにインストール用の schematic を含めてください。

* `ng generate` がプロジェクト内の定義済みの成果物 (コンポーネント、サービス、テストなど) に雛形を生成することができるように、生成用の schematics を含めます。

* `ng update` がライブラリの依存関係を更新し、新しいリリースでの破壊的変更の移行を提供できるように、更新 schematic を含めてください。

詳細については、[Schematics の概要](guide/schematics) および [ライブラリの Schematics](guide/schematics-for-libraries) を参照してください。

## ライブラリを公開する {@a publishing-your-library}

Angular CLI と npm パッケージマネージャーを使用して、ライブラリを npm パッケージとしてビルドおよび公開します。 It is not recommended to publish Ivy libraries to NPM repositories. Before publishing a library to NPM, build it using the `--prod` flag which will use the older compiler and runtime known as View Engine instead of Ivy.

<code-example language="bash">
ng build my-lib --prod
cd dist/my-lib
npm publish
</code-example>

これまでに npm でパッケージを公開したことがない場合は、ユーザーアカウントを作成する必要があります。[npm パッケージの公開](https://docs.npmjs.com/getting-started/publishing-npm-packages)で詳細を読んでください。


## リンクライブラリ

公開されているライブラリで作業している間は、すべてのビルドでライブラリを再インストールしないように [npm link](https://docs.npmjs.com/cli/link) を使用できます。

ライブラリはすべての変更ごとに再ビルドする必要があります。
ライブラリをリンクするときは、ビルドステップが監視モードで実行されていること、およびライブラリの `package.json` 設定が正しいエントリポイントを指していることを確認してください。
たとえば、`main` は TypeScript ファイルではなく JavaScript ファイルを指す必要があります。

## ピア依存関係に TypeScript パスマッピングを使用する

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


## アプリで自身のライブラリを使う

自分のアプリケーションでライブラリを使用するためにライブラリを npm パッケージマネージャーに公開する必要はありませんが、最初にビルドする必要があります。

アプリで独自のライブラリを使用するには：

* ライブラリをビルドします。 ライブラリをビルドする前に使用することはできません。
 <code-example language="bash">
 ng build my-lib
 </code-example>

* アプリ内で、名前でライブラリからインポートします。
 ```
 import { myExport } from 'my-lib';
 ```

### ライブラリのビルドと再ビルド

ライブラリを npm パッケージとして公開してから npm からアプリケーションにインストールし直していない場合は、ビルド手順が重要です。
たとえば、git リポジトリを複製して `npm install` を実行した場合、まだライブラリを構築していなければ、エディタは `my-lib` インポートが見つからないと表示します。

<div class="alert is-helpful">

Angular アプリでライブラリから何かをインポートすると、Angular はライブラリ名とディスク上の場所の間のマッピングを探します。
ライブラリパッケージをインストールすると、マッピングは `node_modules` フォルダにあります。自身のライブラリを構築するとき、それは `tsconfig` パスでマッピングを見つけなければなりません。

Angular CLI でライブラリを生成すると自動的にそのパスが  `tsconfig` ファイルに追加されます。
Angular CLI は `tsconfig` パスを使用してビルドシステムにライブラリの場所を伝えます。

</div>

ライブラリへの変更がアプリに反映されていないことが判明した場合、アプリはおそらくライブラリの古いビルドを使用しています。

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

{@a lib-assets}

### Managing library assets with ng-packagr

Starting with version 9.x of the [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) tool, you can configure the tool to automatically copy assets into your library package as part of the build process.
You can use this feature when your library needs to publish optional theming files, Sass mixins, or documentation (like a changelog).

* Learn how to [copy assets into your library as part of the build](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md).

* Learn more about how to use the tool to [embed assets in CSS](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).
