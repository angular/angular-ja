# TypeScript の設定

TypeScript は、Angular アプリケーション開発の主要言語です。
これは JavaScript のスーパーセットで、型安全性とツールのための設計時サポートを備えています。

ブラウザは TypeScript を直接実行できません。
TypeScript は、*tsc*コンパイラを使用して JavaScript に "変換"する必要があります。そのためにはいくつか設定が必要です。

このページでは、Angular 開発者にとって重要な TypeScript の構成と環境について、
主に次のファイルの詳細を説明します。

- [tsconfig.json](guide/typescript-configuration#tsconfig)&mdash;TypeScript コンパイラの設定。
- [typings](guide/typescript-configuration#typings)&mdash;TypesScript の宣言ファイル。

{@a tsconfig}

## 設定ファイル

既定の Angular ワークスペースには、いくつかの TypeScript 設定ファイルが含まれています。
ルートにある`tsconfig.json`は、ワークスペース内のすべてのプロジェクトが継承する基本となる TypeScript と Angular コンパイラオプションを指定します。

<div class="alert is-helpful">

See the [Angular compiler options](guide/angular-compiler-options) guide for information about what Angular specific options are available.

</div>

TypeScript と Angular には、型チェック機能と生成される出力を設定するために使用できる幅広いオプションがあります。
詳しくは TypeScript ドキュメントの[extends による設定の継承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends)のセクションを参照してください。

<div class="alert is-helpful">

TypeScript 設定ファイルの詳細は、公式の[TypeScript wiki](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)を参照してください。
設定の継承について詳しくは、[extends による設定の継承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends)のセクションを参照してください。

</div>

Angular アプリケーションの最初の `tsconfig.json` は通常、次の例のようになります：

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

{@a noImplicitAny}

### _noImplicitAny_ と _suppressImplicitAnyIndexErrors_

TypeScript の開発者は、`noImplicitAny`フラグを`true`または`false`にするかどうかについては同意しません。
この問題に正解はなく、あとでフラグを変更することができます。
しかし、この選択は大規模プロジェクトにおいて大きな影響を与える可能性があるので、議論に値します。

`noImplicitAny`フラグが`false`（デフォルト）のとき、
コンパイラが変数の型を自動推論できなかった場合は、
型を`any`にデフォルト設定します。それは*暗黙の`any`*とみなされます。

`noImplicitAny`フラグが`true`で、TypeScript コンパイラが型を推論できない場合でも、
JavaScript ファイルは生成されますが、**エラーも出力されます**。
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

TypeScript の構成がコンパイルに与える影響の詳細については、 [Angular コンパイラオプション](guide/angular-compiler-options) および [テンプレートの型チェック](guide/template-typecheck) を参照してください。

</div>

{@a typings}

## TypeScript の型定義

jQuery・Jasmine テストライブラリ・Angular などの多くの JavaScript ライブラリは、
TypeScript コンパイラが認識できない機能と構文を用いて
JavaScript 環境を拡張しています。
コンパイラが何かを認識できないと、エラーをスローします。

TypeScript の[型定義ファイル](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)（d.ts ファイル）を用いて、読み込んだライブラリについてコンパイラに指示します。

TypeScript 対応エディタは、これらの型定義ファイルを活用して、ライブラリ機能の型情報を表示します。

多くのライブラリには型定義ファイルが含まれており、TypeScript コンパイラとエディタはそれらを見つけることができます。
Angular はこのようなライブラリの 1 つです。
Angular アプリケーションの `node_modules/@angular/core/`フォルダには、Angular の core 部分を記述するいくつかの `d.ts`ファイルが含まれています。

<div class="alert is-helpful">

`d.ts`ファイルを含む _typings_ ファイルは、すでに Angular パッケージに含まれていますので、
追加作業を行う必要はありません。

</div>

### lib.d.ts

TypeScript には、 `lib.d.ts`という特別な型定義ファイルが含まれています。このファイルには、JavaScript のランタイムと DOM に存在するさまざまな一般的な JavaScript 構文のアンビエント宣言が含まれています。

TypeScript は`--target`の値に基づいて、ターゲットが`es6`なら`Promise`のような
*追加の*アンビエント宣言を追加します。

デフォルトのターゲットは`es2015`です。もし`es5`をターゲットにしていれば、新しい型定義を宣言ファイルリストに含める必要があります。

<code-example path="getting-started/tsconfig.0.json" header="tsconfig.json (lib excerpt)" region="lib"></code-example>

### 型定義ファイルのインストール

多くのライブラリ（jQuery、Jasmine、Lodash など）は、npm パッケージに`d.ts`ファイルが _含まれていません。_
しかし幸いにも、著者やコミュニティのコントリビューターがこれらのライブラリ用の`d.ts`ファイルを作成し、
公開しています。

これらの型定義ファイルは、
[`@types/*` スコープ化パッケージ](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)を使って`npm`でインストールすることができます。

Which ambient declaration files in `@types/*` are automatically included is determined by
the [`types` TypeScript compiler option](https://www.typescriptlang.org/tsconfig#types). The Angular
CLI generates a `tsconfig.app.json` file which is used to build an application, in which the
`types` compiler option is set to `[]` to disable automatic inclusion of declarations
from `@types/*`. Similarly, the `tsconfig.spec.json` file is used for testing and sets
`"types": ["jasmine"]` to allow using Jasmine's ambient declarations in tests.

After installing `@types/*` declarations, you have to update the `tsconfig.app.json` and
`tsconfig.spec.json` files to add the newly installed declarations to the list of `types`. If the
declarations are only meant for testing, then only the `tsconfig.spec.json` file should be updated.

For instance, to install typings for `chai` you run `npm install @types/chai --save-dev` and then
update `tsconfig.spec.json` to add `"chai"` to the list of `types`.

{@a target}

### _target_

By default, the target is `es2017`, which is supported in modern browsers.
