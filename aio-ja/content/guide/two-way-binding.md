# 双方向バインディング `[(...)]`

双方向バインディングを使うと、コンポーネントクラスとそのテンプレートとの間で
データを共有することができます。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

## 双方向バインディングの基本 {@a basics-of-two-way-binding}

双方向バインディングがすることは2つです:

1. 特定の要素のプロパティを設定します。
1. 要素の変更イベントをリッスンします。

Angular は、この目的のための特別な _双方向データバインディング_ の構文、`[()]` を提供しています。
`[(x)]` 構文は、プロパティバインディングの括弧 `[]`
とイベントバインディングの括弧 `()` を組み合わせたものです。

<div class="callout is-important">

<header>
  [( )] = banana in a box
</header>

括弧が角括弧の _中_ にあることを覚えておくために *banana in a box* を思い描いてください。

</div>

`[()]` 構文は、要素が `x` という設定可能なプロパティと
対応する `xChange` というイベントを持っているときに簡単に説明できます。
このパターンに合う `SizerComponent` は次のようになります。
これは、`size` 値プロパティと、それに付随する `sizeChange` イベントを持ちます:

<code-example path="two-way-binding/src/app/sizer/sizer.component.ts" header="src/app/sizer.component.ts"></code-example>

<code-example path="two-way-binding/src/app/sizer/sizer.component.html" header="src/app/sizer.component.html"></code-example>

`size` の初期値は、プロパティバインディングからの入力値です。
ボタンをクリックすると、
最小値/最大値の制限内で `size` が増減し、
調整されたサイズで `sizeChange` イベントが発生（発行）します。

`AppComponent.fontSizePx` が `SizerComponent` に双方向でバインドされている例は次のようになります:

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-1)" region="two-way-1"></code-example>

`AppComponent.fontSizePx` は、`SizerComponent.size` の初期値を与えます。

<code-example path="two-way-binding/src/app/app.component.ts" header="src/app/app.component.ts" region="font-size"></code-example>

ボタンをクリックすると、双方向バインディングによって `AppComponent.fontSizePx` が更新されます。
変更された `AppComponent.fontSizePx` 値は _スタイル_ バインディングに流れ込み、
表示されるテキストが大きくなったり小さくなったりします。

双方向バインディングの構文は、実際には _プロパティ_ バインディングと _イベント_ バインディングの単なる糖衣構文です。
Angular は次のように `SizerComponent` バインディングを _デシュガー_ します:

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-2)" region="two-way-2"></code-example>

`$event` 変数には、`SizerComponent.sizeChange` イベントのペイロードが含まれています。
ユーザーがボタンをクリックすると、Angular は `$event` 値を `AppComponent.fontSizePx` に割り当てます。

## フォームでの双方向バインディング {@a two-way-binding-in-forms}

双方向バインディングの構文は、プロパティとイベントを
別々にバインドするのに比べて非常に便利です。
`<input>` や `<select>` のような HTML の
form 要素を使って双方向バインディングを使うと便利です。
ただし、`x` 値および `xChange` イベントパターンに従うネイティブ HTML 要素はありません。

フォームでの双方向バインディングについての詳細は
Angular [NgModel](guide/built-in-directives#ngModel) を参照してください.
