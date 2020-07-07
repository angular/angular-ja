# TypeScriptの設定

TypeScriptは、Angularアプリケーション開発の主要言語です。
これはJavaScriptのスーパーセットで、型安全性とツールのための設計時サポートを備えています。

ブラウザはTypeScriptを直接実行できません。
TypeScriptは、*tsc*コンパイラを使用してJavaScriptに "変換"する必要があります。そのためにはいくつか設定が必要です。

このページでは、Angular開発者にとって重要なTypeScriptの構成と環境について、
主に次のファイルの詳細を説明します。

* [tsconfig.json](guide/typescript-configuration#tsconfig)&mdash;TypeScriptコンパイラの設定。
* [typings](guide/typescript-configuration#typings)&mdash;TypesScriptの宣言ファイル。


{@a tsconfig}

## 構成ファイル

A given Angular workspace contains several TypeScript configuration files.
At the root level, there are two main TypeScript configuration files: a `tsconfig.json` file and a `tsconfig.base.json` file.

The `tsconfig.json` file is a ["Solution Style"](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#support-for-solution-style-tsconfigjson-files) TypeScript configuration file.
Code editors and TypeScript’s language server use this file to improve development experience.
Compilers do not use this file.

The `tsconfig.json` file contains a list of paths to the other TypeScript configuration files used in the workspace.

<code-example lang="json" header="tsconfig.json" linenums="false">
{
 "files": [],
 "references": [
   {
     "path": "./tsconfig.app.json"
   },
   {
     "path": "./tsconfig.spec.json"
   },
   {
     "path": "./projects/my-lib/tsconfig.lib.json"
   }
 ]
}
</code-example>

The `tsconfig.base.json` file specifies the base TypeScript and Angular compiler options that all projects in the workspace inherit.

The TypeScript and Angular have a wide range of options which can be used to configure type-checking features and generated output.
For more information, see the [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) section of the TypeScript documentation.
<div class="alert is-helpful">

For more information TypeScript configuration files, see the official [TypeScript wiki](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
For details about configuration inheritance, see the [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) section.

</div>

Angular アプリケーションの最初の `tsconfig.base.json` は通常、次の例のようになります：

<code-example lang="json" header="tsconfig.json" linenums="false">
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2015",
    "module": "es2020",
    "lib": [
      "es2018",
      "dom"
    ]
  }
}
</code-example>


### Strict mode

When you create new workspaces and projects, you have the option to use Angular's strict mode, which can help you write better, more maintainable code.
For more information, see [Strict mode](/guide/strict-mode).

{@a noImplicitAny}

### *noImplicitAny* と *suppressImplicitAnyIndexErrors*

TypeScriptの開発者は、`noImplicitAny`フラグを`true`または`false`にするかどうかについては同意しません。
この問題に正解はなく、あとでフラグを変更することができます。
しかし、この選択は大規模プロジェクトにおいて大きな影響を与える可能性があるので、議論に値します。

`noImplicitAny`フラグが`false`（デフォルト）のとき、
コンパイラが変数の型を自動推論できなかった場合は、
型を`any`にデフォルト設定します。それは*暗黙の`any`*とみなされます。

`noImplicitAny`フラグが`true`で、TypeScriptコンパイラが型を推論できない場合でも、
JavaScriptファイルは生成されますが、**エラーも出力されます**。
これはより厳格な型チェックとなりますが、コンパイル時に型チェックが意図していないエラーをキャッチできるので、
多くのベテラン開発者が好む傾向にあります。

`noImplicitAny`フラグが`true`の場合でも、変数の型を`any`に設定することが可能です。

`noImplicitAny`フラグが`true`の場合、*暗黙のインデックスエラー*も発生する可能性があります。
ほとんどの開発者は、*この特定のエラー*が役立つよりも迷惑であると感じています。
次の追加フラグを使用してそれらを制御することができます：

<code-example>

  "suppressImplicitAnyIndexErrors": true

</code-example>

<div class="alert is-helpful">

TypeScriptの構成がコンパイルに与える影響の詳細については、 [Angular コンパイラオプション](guide/angular-compiler-options) および [Template の型チェック](guide/template-typecheck) を参照してください。

</div>


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

<div class="alert is-helpful">

`d.ts`ファイルを含む *typings* ファイルは、すでにAngularパッケージに含まれていますので、
追加作業を行う必要はありません。

</div>

### lib.d.ts

TypeScriptには、 `lib.d.ts`という特別な型定義ファイルが含まれています。このファイルには、JavaScriptのランタイムとDOMに存在するさまざまな一般的なJavaScript構文のアンビエント宣言が含まれています。

TypeScriptは`--target`の値に基づいて、ターゲットが`es6`なら`Promise`のような
_追加の_アンビエント宣言を追加します。

デフォルトのターゲットは`es2015`です。もし`es5`をターゲットにしていれば、新しい型定義を宣言ファイルリストに含める必要があります。

<code-example path="getting-started/tsconfig.0.json" header="tsconfig.json (lib excerpt)" region="lib"></code-example>

### 型定義ファイルのインストール

多くのライブラリ（jQuery、Jasmine、Lodashなど）は、npmパッケージに`d.ts`ファイルが *含まれていません。*
しかし幸いにも、著者やコミュニティのコントリビューターがこれらのライブラリ用の`d.ts`ファイルを作成し、
公開しています。

これらの型定義ファイルは、
[`@types/*` スコープ化パッケージ](http://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)を使って`npm`でインストールすることができ、
TypeScript 2.0以降では自動認識されます。

たとえば`jasmine`の型定義ファイルをインストールするには、`npm install @types/jasmine --save-dev`を実行します。


{@a target}

### *target*

デフォルトでは、ターゲットは`es2015`です。これはモダンブラウザでのみサポートされています。特別にレガシーブラウザをサポートするためにターゲットを`es5`に設定することができます。 [Differential loading](guide/deployment#differential-loading)もAngular CLIによって提供され、分離されたバンドルによって最新とレガシー、両方のブラウザをサポートします。
