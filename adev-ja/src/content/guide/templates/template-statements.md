# テンプレートステートメント

テンプレートステートメントは、HTMLでユーザーイベントに応答するために使用できるメソッドまたはプロパティです。
テンプレートステートメントを使用すると、アプリケーションは動的なコンテンツの表示やフォームの送信など、アクションを通じてユーザーとやり取りできます。

次の例では、`deleteHero()` というテンプレートステートメントが、`=` 文字の右側に引用符で囲まれています。例として、`(event)="statement"` のように表記されます。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-component-statement"/>

ユーザーが **Delete hero** ボタンをクリックすると、Angularはコンポーネントクラスの `deleteHero()` メソッドを呼び出します。

テンプレートステートメントは、イベントに応答する要素、コンポーネント、またはディレクティブと共に使用します。

HELPFUL: イベントに応答することは、Angularの単方向データフローの一部です。
単一のイベントループ中に、アプリケーション内のあらゆるものを変更できます。

## 構文

[テンプレート式](guide/templates/interpolation) と同様に、テンプレートステートメントはJavaScriptに似た言語を使用します。
ただし、テンプレートステートメントのパーサーはテンプレート式のパーサーとは異なります。
さらに、テンプレートステートメントのパーサーは、基本的な代入 (`=`) と、セミコロン (`;`) で区切られたチェーン式の両方を特にサポートしています。

次のJavaScriptとテンプレート式の構文は使用できません。

* `new`
* インクリメント演算子とデクリメント演算子、`++` と `--`
* 演算子代入、`+=` や `-=` など
* ビット演算子、`|` や `&` など
* [パイプ演算子](guide/pipes)

## ステートメントコンテキスト

ステートメントには、コンテキスト — ステートメントが属するアプリケーションの特定の部分 — があります。

ステートメントは、ステートメントコンテキストにあるもののみを参照できます。ステートメントコンテキストは通常、コンポーネントインスタンスです。
たとえば、`(click)="deleteHero()"` の `deleteHero()` は、次のスニペットのコンポーネントのメソッドです。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-component-statement"/>

ステートメントコンテキストは、テンプレート自身のコンテキストのプロパティを参照もできます。
次の例では、コンポーネントのイベント処理メソッド `onSave()` は、テンプレート自身の `$event` オブジェクトを引数として受け取ります。
次の2行では、`deleteHero()` メソッドは [テンプレート入力変数](guide/directives/structural-directives#shorthand) の `hero` を受け取り、`onSubmit()` は [テンプレート参照変数](guide/templates/reference-variables) の `#heroForm` を受け取ります。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/template-syntax/src/app/app.component.html" visibleRegion="context-var-statement"/>

この例では、`$event` オブジェクト、`hero`、`#heroForm` のコンテキストはテンプレートです。

テンプレートコンテキスト名は、コンポーネントコンテキスト名より優先されます。
前述の `deleteHero(hero)` では、`hero` はコンポーネントの `hero` プロパティではなく、テンプレート入力変数です。

## ステートメントのベストプラクティス

| プラクティス              | 詳細 |
|:---                     |:---     |
| 簡潔さ                  | メソッド呼び出しや基本的なプロパティ代入を使用して、テンプレートステートメントを最小限に抑えます。                                                                                                                                                                                                         |
| コンテキスト内での作業 | テンプレートステートメントのコンテキストは、コンポーネントクラスインスタンスまたはテンプレートです。このため、テンプレートステートメントは `window` や `document` などのグローバル名前空間にあるものを参照できません。たとえば、テンプレートステートメントは `console.log()` や `Math.max()` を呼び出すことはできません。 |
