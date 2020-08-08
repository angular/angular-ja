<!-- {@a expression-operators} -->

# テンプレート式演算子

Angular のテンプレート式言語は、JavaScript 構文のサブセットを採用し、いくつかの特定のシナリオ向けの特別な演算子を追加しています。
次のセクションでは、これらの演算子から3つを紹介します。

* [パイプ](guide/template-expression-operators#pipe)
* [セーフナビゲーション演算子](guide/template-expression-operators#safe-navigation-operator)
* [non-null 型アサーション演算子](guide/template-expression-operators#non-null-assertion-operator)

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

{@a pipe}

## パイプ演算子 (`|`)

式の結果をバインドする前に、少し変換したいときがあります。
たとえば、数値を通貨として表示する、テキストを大文字にする、リストをフィルターしてソートするといった場合です。

パイプは、入力値を受け取り、変換した値を返す、シンプルな関数です。
これらはテンプレート式でパイプ演算子 (`|`) を使うことで簡単に適用できます:

<code-example path="template-expression-operators/src/app/app.component.html" region="uppercase-pipe" header="src/app/app.component.html"></code-example>

パイプ演算子は、演算子の左側の式を、右側のパイプ関数に渡します。

複数のパイプで式をつなぐこともできます:

<code-example path="template-expression-operators/src/app/app.component.html" region="pipe-chain" header="src/app/app.component.html"></code-example>

パイプに[パラメータを適用](guide/pipes#parameterizing-a-pipe)することもできます:

<code-example path="template-expression-operators/src/app/app.component.html" region="date-pipe" header="src/app/app.component.html"></code-example>

`json` パイプはバインディングのデバッグで特に役立ちます:

<code-example path="template-expression-operators/src/app/app.component.html" region="json-pipe" header="src/app/app.component.html"></code-example>

出力結果はこのようになります:

<code-example language="json">
  { "name": "Telephone",
    "manufactureDate": "1980-02-25T05:00:00.000Z",
    "price": 98 }
</code-example>

<div class="alert is-helpful">

パイプ演算子は三項演算子 (`?:`) よりも高い優先順位を持っているので、
`a ? b : c | x` は `a ? b : (c | x)` として解釈されます。
にもかかわらず、さまざまな理由から、
`?:` の第1、第2オペランドではカッコなしでパイプ演算子を使うことはできません。
第3オペランドでもカッコを使うのがよいプラクティスです。

</div>


<hr/>

{@a safe-navigation-operator}

## セーフナビゲーション演算子 ( `?` ) と null プロパティパス

Angular のセーフナビゲーション演算子 (`?`) は、プロパティパスの `null` や `undefined`
に対するガードとなります。ここでは `item` が `null` でもビューのレンダリングが失敗することを防いでいます。

<code-example path="template-expression-operators/src/app/app.component.html" region="safe" header="src/app/app.component.html"></code-example>

`item` が `null` でも、ビューをレンダリングできますが、表示される値は空白となります; 表示されるのは "The item name is:" だけで、その後に続く文字はありません。

次は `nullItem` の例を見てみましょう。

<code-example language="html">
  The null item name is {{nullItem.name}}
</code-example>

セーフナビゲーション演算子を使っておらず、`nullItem` も `null` なので、JavaScript と Angular は `null` 参照エラーを発生させ、Angular のレンダリングプロセスは中断します:

<code-example language="bash">
  TypeError: Cannot read property 'name' of null.
</code-example>

しかし時には、特定の状況下ではプロパティパス中に
`null` 値があってもよい場合があります。
特に値が最初は null で、後からデータが来る場合です。

セーフナビゲーション演算子 (`?`) を使うことで、Angular は最初の `null` 値にヒットすると式の評価を止め、エラーを起こさずにビューをレンダリングします。

`a?.b?.c?.d` のような長いプロパティパスであっても問題なく動作します。


<hr/>

{@a non-null-assertion-operator}

## non-null アサーション演算子 ( `!` )

Typescript 2.0 以降、`--strictNullChecks` フラグを使うことで[厳密な null チェック](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript")を強制できます。TypeScript は、変数が意図せず `null` や `undefined` になってしなわないことを保証します。

このモードでは、デフォルトで、型が付いた変数が `null` や `undefined` になることを禁じます。`null` や `undefined` を禁じた型の変数に代入しなかったり、`null` や `undefined` を代入しようとすると、型チェッカーがエラーを投げます。

変数が実行時に `null` や `undefined` になることを判断できない場合にも、型チェッカーはエラーを投げます。
接尾辞として [non-null アサーション演算子 (!)](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator")を使うことで、型チェッカーがエラーを投げないようにできます。

Angular の non-null アサーション演算子 (`!`) は、Angular テンプレートでも同じ役割を果たします。
この例では `item` のプロパティが定義されていることにできます。

<code-example path="template-expression-operators/src/app/app.component.html" region="non-null" header="src/app/app.component.html"></code-example>

Angular コンパイラーがテンプレートを TypeScript のコードに置き換えるとき、
`item.color` が `null` か `undefined` になりうることを TypeScript が報告することを防げます。

[_セーフナビゲーション演算子_](guide/template-expression-operators#safe-navigation-operator "Safe navigation operator (?)")と違い、
non-null アサーション演算子は `null` や `undefined` から守ってくれるものではありません。
TypeScript の型チェッカーに、特定のプロパティ式に対する厳密な `null` チェックを一時停止させます。

non-null アサーション演算子 (`!`) の使用は任意ですが、厳密な null チェックを有効にしているときは必須となります。

{@a any-type-cast-function}

## `$any()` 型キャスト関数

バインディング式が[AOT コンパイル](guide/aot-compiler)中に型エラーを出すことがあり、その型を明記することが不可能だったり難しかったりすることがあります。
エラーをおとなしくするため、次の例で示すように `$any()` キャスト関数を使い、
式を [`any` 型](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) にキャストすることができます:

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html"></code-example>

Angular コンパイラがこのテンプレートを TypeScript コードに変換するときに、
テンプレートの型チェックで `bestByDate` が `item`
オブジェクトのメンバーではないと TypeScript が報告することを防げます。

`$any()` キャスト関数は `this` にも使うことができ、コンポーネントで宣言していない
メンバーにアクセスすることができます。

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html"></code-example>

`$any()` キャスト関数は、メソッド呼び出しが可能な場所ならバインディング式のどこでも呼び出すことができます。

