# サービスでシグナルを使用する

[モデルシグナルによる双方向バインディング](/tutorials/signals/6-two-way-binding-with-model-signals)を学習したので、Angularサービスでシグナルを使用する方法を見ていきましょう。サービスは複数のコンポーネント間でリアクティブな状態を共有するのに最適であり、シグナルは自動的な変更検知とクリーンなリアクティブパターンを提供することで、これをさらに強力にします。

このアクティビティでは、カート表示コンポーネントが状態の変化に自動的に反応できるように、シグナルを使用してカートストアを作成する方法を学習します。

<hr />

<docs-workflow>

<docs-step title="カートストアシグナルを追加する" {#add-cart-store-signals}>
`cart-store.ts`でカートの状態をリアクティブにするために、読み取り専用シグナルと計算済みシグナルを追加します。

```ts
// Add the computed import
import {Injectable, signal, computed} from '@angular/core';

// Then add these signals to the class:

// Readonly signals
readonly cartItems = this.items.asReadonly();

// Computed signals
readonly totalQuantity = computed(() => {
  return this.items().reduce((sum, item) => sum + item.quantity, 0);
});

readonly totalPrice = computed(() => {
  return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

これらのシグナルにより、コンポーネントはカートデータと計算された合計にリアクティブにアクセスできます。`asReadonly()`メソッドは外部コードがカートアイテムを直接変更するのを防ぎ、`computed()`はソースシグナルが変更されたときに自動的に更新される派生状態を作成します。
</docs-step>

<docs-step title="数量更新メソッドを完成させる" {#complete-the-quantity-update-methods}>
`cart-display.ts`のカート表示コンポーネントは、すでにテンプレートでカートストアシグナルを使用しています。カートアイテムを変更するための数量更新メソッドを完成させます。

```ts
increaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem) {
    this.cartStore.updateQuantity(id, currentItem.quantity + 1);
  }
}

decreaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem && currentItem.quantity > 1) {
    this.cartStore.updateQuantity(id, currentItem.quantity - 1);
  }
}
```

これらのメソッドは、`cartItems()`を使用して現在のカート状態を読み取り、ストアのメソッドを通じて数量を更新します。シグナルが変更されるとUIは自動的に更新されます！
</docs-step>

<docs-step title="メインアプリケーションコンポーネントを更新する" {#update-the-main-app-component}>
`app.ts`のメインアプリケーションコンポーネントを更新して、カートサービスを使用し、カートコンポーネントを表示します。

```angular-ts
import {Component, inject} from '@angular/core';
import {CartStore} from './cart-store';
import {CartDisplay} from './cart-display';

@Component({
  selector: 'app-root',
  imports: [CartDisplay],
  template: `
    <div class="shopping-app">
      <header>
        <h1>Signals with Services Demo</h1>
        <div class="cart-badge">
          Cart: {{ cartStore.totalQuantity() }} items (\${{ cartStore.totalPrice() }})
        </div>
      </header>

      <main>
        <cart-display></cart-display>
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  cartStore = inject(CartStore);
}
```

</docs-step>

</docs-workflow>

すばらしい！サービスでシグナルを使用する方法を学びました。覚えておくべき主要な概念は次のとおりです。

- **サービスレベルシグナル**: サービスはシグナルを使用してリアクティブな状態を管理できます
- **依存性の注入**: `inject()`を使用して、コンポーネントでシグナルを持つサービスにアクセスします
- **サービス内の計算済みシグナル**: 自動的に更新される派生状態を作成します
- **読み取り専用シグナル**: 外部からの変更を防ぐために、シグナルの読み取り専用バージョンを公開します

次のレッスンでは、[ディレクティブでシグナルを使用する方法](/tutorials/signals/8-using-signals-with-directives)について学習します！
