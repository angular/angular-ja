# npmパッケージ

Angularフレームワーク、 Angular CLI、 Angularアプリケーションを使用したコンポーネントは[npmパッケージ](https://docs.npmjs.com/getting-started/what-is-npm "What is npm?")としてパッケージ化され、 [npmレジストリ](https://docs.npmjs.com/)を通して提供されます。

これらのnpmパッケージをダウンロードしインストールするには[npm CLIクライアント](https://docs.npmjs.com/cli/install)を使用します。npm CLIクライアントは[Node.js®](https://nodejs.org "Nodejs.org")アプリケーションとしてインストールされ実行されます。デフォルトではAngular CLIはnpmを使用します。

または、npmパッケージをダウンロードしインストールするために[yarnクライアント](https://yarnpkg.com/)も使用できます。


<div class="alert is-helpful">

Node.jsとnpmの必要なバージョンとインストール方法については [ローカル環境の構築](guide/setup-local "Setting up for Local Development") を参照してください。

もしすでに他のバージョンのNode.jsとnpmを使用したプロジェクトがマシン上にある場合、[nvm](https://github.com/creationix/nvm)を使って複数のバージョンのNode.jsとnpmを管理することを検討してください。

</div>


## `package.json`

`npm` と `yarn` は共に[`package.json`](https://docs.npmjs.com/files/package.json)ファイルで特定されたパッケージをインストールします。

CLIコマンドの `ng new` は新しいワークスペースを作成するときに `package.json` ファイルを作成します。
この `package.json` はCLIがワークスペースを作成するときに作成される最初のアプリケーションプロジェクトを含む、ワークスペース内のすべてのプロジェクトから使用されます。

はじめは、この `package.json` は_パッケージのスターターセット_を含んでいます。そのパッケージの一部はAngularが必要としているものや一般的なアプリケーションシナリオをサポートするものです。
アプリケーションが成長するにつれて `package.json` にパッケージを追加します。
パッケージを削除することもできます。

`package.json` は2つのグループのパッケージで構成されています。

* [Dependencies](guide/npm-packages#dependencies) はアプリケーションを*実行するため*に不可欠です。
* [DevDependencies](guide/npm-packages#dev-dependencies) はアプリケーションを*開発するため* だけに必要です。

<div class="alert is-helpful">

**ライブラリ開発者へ**: デフォルトでは、CLIコマンドの [`ng generate library`](cli/generate) は新しいライブラリのための `package.json` を生成します。この `package.json` はnpmにライブラリを公開するときに利用されます。
詳細については、CLI Wikiの [Library Support](guide/creating-libraries)ページを見てください。
</div>


{@a dependencies}
## dependencies

`package.json` の `dependencies` 部分に列挙されたパッケージはアプリケーションを*実行するため*に不可欠なものです。

`package.json` の `dependencies` 部分は次のものを含んでいます。

* [**Angularパッケージ**](#angular-packages): Angularのコアとオプションのモジュールです。これらのパッケージ名は `@angular/` で始まります。

* [**サポートパッケージ**](#support-packages): Angularアプリケーションを実行するために無くてはならないサードパーティのライブラリです。

* [**ポリフィルパッケージ**](#polyfills): ポリフィルはブラウザのJavaScript実装のギャップを埋めます。

新しい依存関係を追加するためには、 [`ng add`](cli/add) コマンドを使ってください。

{@a angular-packages}
### Angularパッケージ

次のAngularのパッケージは新しいAngularワークスペース用のデフォルトの `package.json` ファイルの依存関係として含まれています。
Angularのパッケージの完全な一覧は、[API reference](api?type=package) を見てください。


パッケージ名                                                                            | 説明
----------------------------------------   | --------------------------------------------------
[**@angular/animations**](api/animations)                                               | Angularのアニメーションライブラリを使用すると、ページやリストのトランジションといったアニメーション効果を簡単に定義して適用できます。詳しくは [Animations guide](guide/animations) を見てください。.
[**@angular/common**](api/common)                                                       | 一般的に必要なサービスやパイプ、ディレクティブがAngularチームによって提供されています。 [`HttpClientModule`](api/common/http/HttpClientModule) もここの [`@angular/common/http`](api/common/http) というサブフォルダにあります。詳しくは [HttpClient guide](guide/http) を見てください。
**@angular/compiler**                                                                   | Angularのテンプレートのコンパイラです。テンプレートを解釈し、アプリケーションが実行・表示可能なコードに変換します。 通常はコンパイラに直接触れないでください。そうではなくブラウザ上でJITコンパイルするときに `platform-browser-dynamic` を通して間接的に使用します。詳しくは [Ahead-of-time Compilation guide](guide/aot-compiler)を見てください。
[**@angular/core**](api/core)                                                           | すべてのアプリケーションに必要とされるフレームワークの重要なランタイム部分です。すべてのメタデータデコレーター、`Component` 、 `Directive `、依存性の注入、コンポーネントのライフサイクルフックを含みます。
[**@angular/forms**](api/forms)                                                         | [テンプレート駆動のフォーム](guide/forms)と[リアクティブフォーム](guide/reactive-forms)の両方をサポートします。アプリケーションに最適なフォームアプローチの選択についての情報は [Introduction to forms](guide/forms-overview) を見てください。
[**@angular/<br />platform&#8209;browser**](api/platform-browser)                       | DOMとブラウザに関連したすべて、特にDOMへのレンダリングを手助けする部分です。このパッケージは[AOT](guide/aot-compiler)で事前コンパイルしたプロダクションビルド用のアプリケーションをブートストラップするための `bootstrapModuleFactory()` メソッドも含んでいます。
[**@angular/<br />platform&#8209;browser&#8209;dynamic**](api/platform-browser-dynamic) | [JITコンパイラ](guide/aot-compiler)を使用してクライアント上でアプリケーションをコンパイル、実行するための[providers](api/core/Provider)とメソッドを含んでいます。
[**@angular/router**](api/router)                                                       | ルーターモジュールはブラウザのURLの変化に合わせてアプリケーション間を遷移します。詳しくは[Routing and Navigation](guide/router)を見てください。


{@a support-packages}
### サポートパッケージ

次のサポートパッケージは新しいAngularワークスペース用のデフォルトの `package.json` ファイルに依存関係として含まれています。


Package name                                      | Description
----------------------------------------   | --------------------------------------------------
[**rxjs**](https://github.com/ReactiveX/rxjs)     | 多くのAngularのAPIは[_Observable_](guide/glossary#observable)を返します。RxJSはJavaScript言語の標準を策定する[TC39](https://www.ecma-international.org/memento/tc39.htm)委員会に現在提案されている[Observables仕様](https://github.com/tc39/proposal-observable)を実装したものです。
[**zone.js**](https://github.com/angular/zone.js) | Angularはzone.jsに依存しています。これはネイティブのJavaScriptの作用でイベントが発生した時にAngularの変更検知プロセスを実行するためのものです。Zone.jsは JavaScript言語の標準を策定する[TC39](https://www.ecma-international.org/memento/tc39.htm)委員会に現在提案されている[仕様](https://gist.github.com/mhevery/63fdcdf7c65886051d55)を実装したものです。


{@a polyfills}
### ポリフィルパッケージ

多くのブラウザはAngularが必要とする最新のHTML標準の一部の機能をネイティブでサポートしていません。
[_Polyfills_](https://en.wikipedia.org/wiki/Polyfill_(programming))は不足している機能をエミュレートできます。
[ブラウザサポート](guide/browser-support)はどのブラウザがポリフィルを必要としていて
ポリフィルの追加方法が説明されています。


{@a dev-dependencies}

## DevDependencies

`package.json` の `devDependencies` 部分に列挙されたパッケージはローカルマシン上でアプリケーションを開発するのを手助けするものです。本番向けアプリケーションと一緒にこれらのパッケージをデプロイしないでください。

新しく `devDependency` に追加するには、次のいずれかのコマンドを利用してください。

<code-example language="sh">
  npm install --save-dev &lt;package-name&gt;
</code-example>

<code-example language="sh">
  yarn add --dev &lt;package-name&gt;
</code-example>

次の`devDependencies`は新しいAngularワークスペース用のデフォルトの`package.json`ファイルで提供されています。


パッケージ名                                                                                  | 説明
----------------------------------------   | -----------------------------------
[**@angular&#8209;devkit/<br />build&#8209;angular**](https://github.com/angular/angular-cli/) | Angularのビルドツール
[**@angular/cli**](https://github.com/angular/angular-cli/)                                    | Angularのコマンドラインツール
**@angular/<br />compiler&#8209;cli**                                                          | Angular CLIの `ng build` と `ng serve` コマンドから呼び出されるAngularのコンパイラ
**@types/... **                                                                                | JasmineやNode.jsといったサードパーティライブラリのTypeScriptの型定義ファイルです。
**jasmine/... **                                                                               | [Jasmine](https://jasmine.github.io/)テストライブラリをサポートするパッケージです。
**karma/... **                                                                                 | [karma](https://www.npmjs.com/package/karma)テストランナーをサポートするパッケージです。
[**typescript**](https://www.npmjs.com/package/typescript)                                     | *tsc*(TypeScript Compiler)を含むTypeScriptのランゲージサーバー


## 関連情報

 Angular CLIがパッケージをどう扱うかについての情報は次のガイドを見てください。
 
 * [ビルドとサーブ](guide/build)ではパッケージを組み合わせて開発ビルドを作成する方法を説明します。
 * [デプロイ](guide/deployment)ではパッケージを組み合わせて本番ビルドを作成する方法を説明します。
