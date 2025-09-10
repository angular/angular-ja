# シグナルクエリで子要素をクエリする

[ディレクティブでのシグナルの使い方](/tutorials/signals/8-using-signals-with-directives)を学んだところで、シグナルベースのクエリAPIについて見ていきましょう。これらは、子コンポーネントやディレクティブにアクセスして操作するためのリアクティブな方法を提供します。コンポーネントとディレクティブの両方がクエリを実行でき、またそれら自身もクエリされることがあります。従来のViewChildとは異なり、シグナルクエリは自動的に更新され、子コンポーネントやディレクティブへの型安全なアクセスを提供します。

このアクティビティでは、子コンポーネントとプログラムでやり取りするためにviewChildクエリを追加します。

<hr />

<docs-workflow>

<docs-step title="viewChildのインポートを追加">
まず、`app.ts`で子コンポーネントにアクセスするために`viewChild`のインポートを追加します。

```ts
import {Component, signal, computed, viewChild, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="viewChildクエリを作成">
AppコンポーネントにviewChildクエリを追加して、子コンポーネントにアクセスします。

```ts
// Query APIs to access child components
firstProduct = viewChild(ProductCard);
cartSummary = viewChild(CartSummary);
```

これらのクエリは、子コンポーネントインスタンスを参照するシグナルを作成します。
</docs-step>

<docs-step title="親メソッドを実装">
viewChildクエリを使用して、`app.ts`で子コンポーネントのメソッドを呼び出します。

```ts
showFirstProductDetails() {
  const product = this.firstProduct();
  if (product) {
    product.highlight();
  }
}

initiateCheckout() {
  const summary = this.cartSummary();
  if (summary) {
    summary.initiateCheckout();
  }
}
```

</docs-step>

<docs-step title="インタラクションをテスト">
コントロールボタンが動作するようになりました。

- **"Show First Product Details"** - ProductCardで`highlight()`を呼び出します
- **"Initiate Checkout"** - CartSummaryで`initiateCheckout()`を呼び出します

ボタンをクリックして、viewChildクエリが親コンポーネントによる子コンポーネントの動作制御をどのように可能にするかを確認してください。
</docs-step>

</docs-workflow>

完璧です！子コンポーネントのインタラクションのためにシグナルベースのクエリAPIを使用する方法を学びました。

次のレッスンでは、[effectでシグナルの変更に反応する方法](/tutorials/signals/10-reacting-to-signal-changes-with-effect)について学びます！
