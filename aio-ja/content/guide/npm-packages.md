# Npmパッケージ

 [**Angular CLI**](https://cli.angular.io/)・Angularアプリケーション・Angular本体は、[**npm**](https://docs.npmjs.com/)パッケージとして提供されているライブラリに依存しています。

これらのnpmパッケージは、Node.js®アプリケーションとして実行される[**npmクライアント**](https://docs.npmjs.com/cli/install)を使用してインストールできます。

[**yarn**](https://yarnpkg.com/en/)は、npmパッケージをインストールするための一般的な方法です。
Angular CLIは新しいプロジェクトを作成する際、`yarn`を用いてnpmパッケージをインストールしています。

<div class="alert is-helpful">

Node.jsとnpmは、Angularの開発に不可欠です。

まだインストールされていない場合は、[こちら](https://docs.npmjs.com/getting-started/installing-node "Node.jsのインストールと npmのアップデート")から入手してください。

ターミナル/コンソールウィンドウで、コマンド`node -v` および` npm -v` を実行して、**Node.js `v8.x`以上 かつ `npm 5.x`以上を実行していること**を確認します。これより古いバージョンではエラーが発生します。

他のバージョンのNode.jsとnpmを使用しているプロジェクトが存在している場合は、[nvm](https://github.com/creationix/nvm) を用いて、複数バージョンのNode.jsとnpmを管理することを検討してください。

</div>

## _package.json_

`npm`と`yarn`はともに、[**package.json**](https://docs.npmjs.com/files/package.json)に指定されているパッケージをインストールします。

CLIの `ng new` コマンドは、デフォルトの `package.json` を作成します。この `package.json` には、さまざまなアプリケーションに対応できるように、_基本的なパッケージ_ が指定されています。

また、アプリケーションの必要性に応じて、パッケージを追加・削除することができます。

このガイドでは、_基本的なパッケージ_ の中でも特に重要度が高いものに焦点を当てています。

#### *dependencies* と *devDependencies*

`package.json` には、[dependencies](guide/npm-packages#dependencies) と [devDependencies](guide/npm-packages#dev-dependencies) の２種類のパッケージ区分があります。

*dependencies* は、*アプリケーションの実行* に不可欠です。*devDependencies* は、 *アプリケーションの開発時* のみ必要となります。

{@a dependencies}

## *Dependencies*
`package.json` の `dependencies`セクションには、次のものが含まれています:

* **Angularパッケージ**: パッケージ名が `@angular/` から始まる、Angular のコアライブラリ及びオプションライブラリ

* **Supportパッケージ**: Angularアプリを実行するために必要な サードパーティー製ライブラリ

* **Polyfillパッケージ**: ブラウザのJavaScript実装の差異を埋める Polyfillsライブラリ

### Angularパッケージ

**@angular/animations**: Angularのアニメーションライブラリは、ページ遷移やリスト遷移などのアニメーション効果を簡単に定義・適用することができます。
詳細は [Animations guide](guide/animations) を参照してください。

**@angular/common**: Angularチームが提供する service/pipe/directive。
また、[`HttpClientModule`](guide/http) は、 '@angular/common/http'内にあります。

**@angular/core**: Angularの重要なランタイム部。
すべてのメタデータデコレーター・`Component`・`Directive`・依存関係注入・コンポーネントのライフサイクルフックが含まれています。

**@angular/compiler**: Angularの *テンプレートコンパイラ*。
テンプレートを理解し、アプリケーションを実行・レンダリングするコードに変換します。
通常、開発者はコンパイラと直接対話しません。ブラウザが [JITコンパイル](guide/aot-compiler) する際に、`platform-browser-dynamic`経由で間接的に使用します。

**@angular/forms**: [template-driven](guide/forms) と [reactive forms](guide/reactive-forms) のサポート。

**@angular/http**: Angularの古い、非推奨のHTTPクライアント。

**@angular/platform-browser**: すべてのDOMとブラウザ、特にDOMへのレンダリングを担う。
このパッケージには、[AOT](guide/aot-compiler) で事前コンパイルするプロダクションビルド用のアプリケーションをブートストラップするための`bootstrapModuleFactory()`メソッドも含まれています。

**@angular/platform-browser-dynamic**: [JITコンパイラ](guide/aot-compiler) を使用してクライアント上でアプリケーションをコンパイル・実行する [Providers](api/core/Provider) とメソッドを含みます。

**@angular/router**: URLが変更されると、[ルータモジュール](/guide/router) がアプリページを遷移させます。

**@angular/upgrade**: AngularJSのアプリケーションをAngularアプリケーションにアップグレードするためのユーティリティ。

{@a polyfills}

### Polyfillパッケージ

多くのブラウザでは、Angularが必要としている最新のHTML標準機能がサポートされていません。
"[Polyfills](https://en.wikipedia.org/wiki/Polyfill)" は、足りない機能を補います。
[ブラウザサポートガイド](guide/browser-support) では、どのブラウザにpolyfillsが必要で、またどのように追加するか説明しています。

デフォルトの`package.json`では、いくつかの一般的なブラウザで足りない機能を補う **[core-js](https://github.com/zloirock/core-js)** パッケージをインストールします。

### サポートパッケージ

**[rxjs](https://github.com/benlesh/RxJS)**: 多くのAngular APIは_observables_を返します。
RxJSは、JavaScriptの標準仕様を決定している[TC39](http://www.ecma-international.org/memento/TC39.htm)で現在提案されている[Observables仕様](https://github.com/zenparsing/es-observable)が実装されています。


**[zone.js](https://github.com/angular/zone.js)**: Angularは、ネイティブJavaScript操作でイベントが発生した場合、Angularの変更検知プロセスを実行するためにzone.jsに依存しています。
Zone.jsは、JavaScriptの標準仕様を決定している[TC39](http://www.ecma-international.org/memento/TC39.htm)の[仕様](https://gist.github.com/mhevery/63fdcdf7c65886051d55)の実装です。


{@a dev-dependencies}

## *DevDependencies*

`package.json`の*devDependencies*セクションにリストされているパッケージは、ローカルマシン上でのアプリケーション開発に役立ちます。

プロダクションアプリケーションでは、これらをデプロイしないでください。

**[@angular/cli](https://github.com/angular/angular-cli/)**: Angular CLIツール。


**[@angular/compiler-cli](https://github.com/angular/angular/blob/master/packages/compiler-cli/README.md)**: Angularコンパイラ。Angular CLIの`buildコマンド`と`serveコマンド`で呼び出されます。


**[@angular/language-service](https://github.com/angular/angular-cli/)**: Angular language serviceは、コンポーネントテンプレートを分析し、TypeScript対応エディタが開発者の経験を向上させるために使用できるタイプとエラーの情報を提供します。
たとえば、[VS CodeのAngular language serviceプラグイン](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)を参照してください。


**@types/... **: JasmineやNode.jsなどのサードライブラリ用のTypeScript定義ファイル。


**[codelyzer](https://www.npmjs.com/package/codelyzer)**: [Angularのスタイルガイド](guide/styleguide)に準拠しているリンター。


**jasmine/... **: [Jasmine](https://jasmine.github.io/)テストライブラリをサポートするパッケージ。


**karma/... **: [karma](https://www.npmjs.com/package/karma)テストランナーをサポートするパッケージ。


**[protractor](https://www.npmjs.com/package/protractor)**: Angularアプリケーションのエンドツーエンド（e2e）フレームワーク。 
[WebDriverJS](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs)の上に構築されています。


**[ts-node](https://www.npmjs.com/package/ts-node)**: Node.jsのためのTypeScript実行環境とREPL。


**[tslint](https://www.npmjs.com/package/tslint)**: TypeScriptコードの可読性/保守性/機能性のエラーをチェックする静的解析ツールです。


**[typescript](https://www.npmjs.com/package/typescript)**:
*tsc*（TypeScriptコンパイラ）を含む、TypeScript言語サーバー。


## とても多くのパッケージやファイルがありますね！

デフォルトの`package.json`では、プロジェクトに必要なパッケージよりも多くのパッケージがインストールされます。

特定のパッケージには、数十、数百、さらには数千のファイルが含まれ、
それらはすべてローカルマシンの`node_modulesディレクトリ`にあります。
膨大な量のファイルは威圧的ですが・・・

不必要なパッケージは削除することができますが、それをどうやって判断すればいいでしょう？
実際にはそれを心配するよりも、不必要なパッケージをそのままにしておく方がよいでしょう。
ローカルマシン上の余分なパッケージとパッケージファイルは無害です。

Angular CLIビルドプロセスは、アプリケーションに実際に必要な少数の "ベンダー" ライブラリファイルだけを1つのファイルにバンドルします。
ブラウザは、元のパッケージファイルではなく、このバンドルをダウンロードします。

詳細は、 [Deployment](guide/deployment) を参照してください。
