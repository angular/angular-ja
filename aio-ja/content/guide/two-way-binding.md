# 双方向バインディング

双方向バインディングは、アプリケーション内のコンポーネントがデータを共有する方法を提供します。
双方向バインディングを使用すると、イベントをリッスンして、親と子のコンポーネント間で同時に値を更新することができます。

<div class="alert is-helpful">

このガイドのコードを含む動作例については、<live-example></live-example>を参照してください。

</div>

## 前提

双方向バインディングを最大限に活用するためには、次のような基本的な概念を理解しておく必要があります。

*   [プロパティバインディング](guide/property-binding)
*   [イベントバインディング](guide/event-binding)
*   [InputとOutput](guide/inputs-outputs)

双方向バインディングは、プロパティバインディングとイベントバインディングを組み合わせたものです。

| Bindings                                   | Details |
|:---                                        |:---     |
| [プロパティバインディング](guide/property-binding) | 特定の要素のプロパティを設定します。    |
| [イベントバインディング](guide/event-binding)       | 要素の変更イベントをリッスンします。 |

## 双方向のデータバインディングを追加する

Angularの双方向バインディング構文は、角括弧と括弧を組み合わせたもの`[()]`です。
`[()]`は、プロパティバインディングの`[]`とイベントバインディングの`()`を組み合わせた構文で、次のようになります。

<code-example header="src/app/app.component.html" path="two-way-binding/src/app/app.component.html" region="two-way-syntax"></code-example>

## 双方向バインディングのしくみ {@a how-two-way-binding-works}

双方向のデータバインディングを行うには、`@Output()`プロパティに`inputChange`というパターンを使用する必要があります。`input`は`@Input()`プロパティの名前です。
たとえば、`@Input()`プロパティが`size`の場合、`@Output()`プロパティは`sizeChange`でなければなりません。

次に示す`sizerComponent`は、`size`プロパティと`sizeChange`イベントを持ちます。
`size`プロパティは`@Input()`で、データは`sizerComponent`に流れ込みます。
`sizeChange`イベントは`@Output()`で、データは`sizerComponent`から親コンポーネントに流れます。

次に、2つのメソッドがあります。フォントサイズを小さくする`dec()`と、フォントサイズを大きくする`inc()`です。
これら2つのメソッドは、`resize()`を使って、`size`プロパティ値を最小値/最大値の制限内で変更し、新しいサイズ値を伝えるイベントを発生させます。

<code-example header="src/app/sizer.component.ts" path="two-way-binding/src/app/sizer/sizer.component.ts" region="sizer-component"></code-example>

`sizerComponent`テンプレートには2つのボタンがあり、それぞれクリックイベントを`inc()`および`dec()`にバインドしています。
ユーザーがいずれかのボタンをクリックすると、`sizerComponent`は対応するメソッドを呼び出します。
`inc()`と`dec()`の両方のメソッドは、`+1`または`-1`を指定して`resize()`メソッドを呼び出し、新しいサイズ値で `sizeChange`イベントを発生させます。

<code-example header="src/app/sizer.component.html" path="two-way-binding/src/app/sizer/sizer.component.html"></code-example>

`AppComponent`テンプレートでは、`fontSizePx`が`SizerComponent`に双方向でバインドされています。

<code-example header="src/app/app.component.html" path="two-way-binding/src/app/app.component.html" region="two-way-1"></code-example>

`AppComponent`では、`fontSizePx`値を`16`にすることで、`SizerComponent.size`の初期値を設定しています。

<code-example header="src/app/app.component.ts" path="two-way-binding/src/app/app.component.ts" region="font-size"></code-example>

ボタンをクリックすると、双方向バインディングによって`AppComponent.fontSizePx`が更新されます。
更新された`AppComponent.fontSizePx`値は、スタイルバインディングに流れ込み、表示されるテキストが大きなったり小さくなったりします。

双方向バインディングの構文は、プロパティバインディングとイベントバインディングを組み合わせた糖衣構文です。
プロパティバインディングとイベントバインディングを分離した`SizerComponent`のバインディングは、次のようになります。

<code-example header="src/app/app.component.html (expanded)" path="two-way-binding/src/app/app.component.html" region="two-way-2"></code-example>

`$event`変数には、`SizerComponent.sizeChange`イベントのペイロードが含まれています。
ユーザーがボタンをクリックすると、Angularは`$event`値を`AppComponent.fontSizePx`に代入します。

<div class="callout is-helpful">

  <header>フォームでの双方向バインディング</header>

  `x`値および`xChange`イベントパターンに従うネイティブHTML要素は存在しないため、フォーム要素との双方向バインディングには`NgModel`が必要です。
  フォームでの双方向バインディングについての詳細は、Angular [NgModel](guide/built-in-directives#ngModel)を参照してください。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
