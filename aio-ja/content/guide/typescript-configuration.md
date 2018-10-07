# TypeScriptの設定

TypeScriptは、Angularアプリケーション開発の主要言語です。
これはJavaScriptのスーパーセットで、型安全性とツールのための設計時サポートを備えています。

ブラウザはTypeScriptを直接実行できません。TypeScriptは、*tsc*コンパイラを使用してJavaScriptに "変換"する必要があります。
そのためにはいくつか設定が必要です。

このページでは、Angular開発者にとって重要なTypeScriptの構成と環境について、
主に次のファイルの詳細を説明します。

* [tsconfig.json](guide/typescript-configuration#tsconfig)&mdash;TypeScriptコンパイラの設定。
* [typings](guide/typescript-configuration#typings)&mdash;TypesScriptの宣言ファイル.


{@a tsconfig}



## *tsconfig.json*
通常、`tsconfig.json`というTypeScript構成ファイルをプロジェクトに追加し、
コンパイラがJavaScriptファイルを生成する際のガイドを行います。

<div class="alert is-helpful">



`tsconfig.json`の詳細については、公式の
[TypeScript wiki](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)を参照してください。

</div>



[セットアップガイド](guide/setup)では、次の`tsconfig.json`が使用されています。

<code-example path="quickstart/src/tsconfig.1.json" title="tsconfig.json" linenums="false"></code-example>

このファイルには、Angularアプリケーションに不可欠なオプションとフラグが含まれています。


{@a noImplicitAny}


### *noImplicitAny* と *suppressImplicitAnyIndexErrors*

TypeScriptの開発者は、`noImplicitAny`フラグを`true`または`false`にするかどうかについては同意しません。
この問題に正解はなく、あとでフラグを変更することができます。
しかし、この選択は大規模プロジェクトにおいて大きな影響を与える可能性があるので、議論に値します。

`noImplicitAny`フラグが`false`（デフォルト）のとき、
コンパイラが変数の型を自動推論できなかった場合は、
型を`any`にデフォルト設定します。それは*暗黙の`any`*とみなされます。

ドキュメンテーションのセットアップでは、`noImplicitAny`フラグが`true`に設定されます。
`noImplicitAny`フラグが`true`で、TypeScriptコンパイラが型を推論できない場合でも、
JavaScriptファイルは生成されますが、**エラーも出力されます**。
これはより厳格な型チェックとなりますが、コンパイル時に型チェックが意図していないエラーをキャッチできるので、
多くのベテラン開発者が好む傾向にあります。

`noImplicitAny`フラグが`true`の場合でも、変数の型を`any`に設定することが可能です。

`noImplicitAny`フラグが`true`の場合、*暗黙のインデックスエラー*も発生する可能性があります。
ほとんどの開発者は、*この特定のエラー*が役立つよりも迷惑であると感じています。
次の追加フラグを使用してそれらを制御することができます：

<code-example format=".">
  "suppressImplicitAnyIndexErrors":true

</code-example>



ドキュメンテーションのセットアップでは、このフラグも`true`に設定されます。


{@a typings}



## TypeScriptの型定義
jQuery・Jasmineテストライブラリ・Angularなどの多くのJavaScriptライブラリは、
TypeScriptコンパイラが認識できない機能と構文を用いて
JavaScript環境を拡張しています。
コンパイラが何かを認識できないと、エラーをスローします。

TypeScriptの[型定義ファイル](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)（d.tsファイル）を用いて、読み込んだライブラリについてコンパイラに指示します。

TypeScript対応エディタは、これらの型定義ファイルを活用して、ライブラリ機能の型情報を表示します。

多くのライブラリには型定義ファイルが含まれており、TypeScriptコンパイラとエディタはそれらを見つけることができます。
Angularはこのようなライブラリの1つです。
Angularアプリケーションの `node_modules/@angular/core/`フォルダには、Angularのcore部分を記述するいくつかの `d.ts`ファイルが含まれています。

**`d.ts`ファイルを含む *typings* ファイルは、すでにAngularパッケージに含まれていますので、
追加作業を行う必要はありません。**

### lib.d.ts

TypeScriptには、 `lib.d.ts`という特別な型定義ファイルが含まれています。このファイルには、JavaScriptのランタイムとDOMに存在するさまざまな一般的なJavaScript構文のアンビエント宣言が含まれています。

TypeScriptは`--target`の値に基づいて、ターゲットが`es6`なら`Promise`のような
_追加の_アンビエント宣言を追加します。

QuickStartプロジェクトは`es5`を対象としているので、
含まれる宣言ファイルリストを次のように上書きすることができます。


<code-example format=".">
  "lib": ["es2015", "dom"]

</code-example>



これにより、`es5`をターゲットとしていても、`es6`の型定義を手に入れられます。

### 型定義ファイルのインストール
多くのライブラリ（jQuery、Jasmine、Lodashなど）は、npmパッケージに`d.ts`ファイルが *含まれていません。*
しかし幸いにも、著者やコミュニティのコントリビューターがこれらのライブラリ用の`d.ts`ファイルを作成し、
公開しています。

これらの型定義ファイルは、
[`@types/*` スコープ化パッケージ](http://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)を使って`npm`でインストールすることができ、
TypeScript 2.0以降では自動認識されます。

たとえば`jasmine`の型定義ファイルをインストールするには、`npm install @types/jasmine --save-dev`を実行します。


QuickStartプロジェクトには、次の２つの*型定義ファイル*が含まれています。

* [jasmine](http://jasmine.github.io/) Jasmineテストフレームワークの型定義

* [node](https://www.npmjs.com/package/@types/node) *Node.js®*環境内のオブジェクトを参照するコード


QuickStartプロジェクトはこれらの型定義ファイルを必要としませんが、多くのサンプルで必要とされます。


{@a target}


### *target*

デフォルトのターゲットは`es5`ですが、es6互換ブラウザにのみアプリケーションをデプロイする場合は、ターゲットを`es6`に設定することができます。
しかしこの場合、`IE`などの古いブラウザでは`Syntax Error`がスローされることに留意してください。
