# ユーザー入力にフォームを使う

このガイドは[入門チュートリアル](start "Get started with a basic Angular app")の[データ管理](start/start-data "Try it: Managing Data")ステップの上に成り立っています。

このセクションでは、フォームベースのチェックアウト機能を追加して、チェックアウトの一部としてユーザー情報を収集する方法を説明します。

## チェックアウトフォームモデルを定義する

このステップでは、コンポーネントクラスにチェックアウトフォームモデルを設定する方法を説明します。
フォームモデルは、フォームの状態を決定します。

1. `cart.component.ts` を開きます。

1. `@angular/forms` パッケージから `FormBuilder` サービスをインポートします。
  このサービスは、コントロールを生成するための便利な方法を提供します。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
  </code-example>

1. `FormBuilder` サービスを `CartComponent` の `constructor()` に注入します。
  このサービスは `ReactiveFormsModule` モジュールの一部で、すでにインポート済みです。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
  </code-example>

1. ユーザーの名前と住所を取得するために、`FormBuilder`の`group()`メソッドを使用して`name`と`address`フィールドを含む`checkoutForm` プロパティをフォームモデルに設定します。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. フォームを処理するための `onSubmit()` メソッドを定義します。
  このメソッドにより、ユーザーは自分の名前と住所を入力することができます。
  また、このメソッドは `CartService` の `clearCart()` メソッドを利用してフォームをリセットし、カートをクリアします。

  カートコンポーネントクラス全体は次のようになります。

  <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
  </code-example>

## チェックアウトフォームを作成する

カートビューの下部にチェックアウトフォームを追加するには、次の手順を使用します。

1. `cart.component.html` の下部に、HTMLの `<form>` 要素と **Purchase** ボタンを追加します。

1. `formGroup` プロパティバインディングを使用して、 `checkoutForm` をテンプレート内の HTMLの`form` 要素にバインドします。

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

1. `form` タグで、 `ngSubmit` イベントバインディングを使用してフォーム送信を待機し、 `checkoutForm` のvalueを指定して `onSubmit()` メソッドを呼び出します。

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html (cart component template detail)" region="checkout-form-1">
  </code-example>

1. `name`と`address`のそれぞれに`<input>`フィールドを追加し、それぞれに `formControlName` 属性を付加します。
  完全なコンポーネントは次のとおりです。

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

カートにいくつかの商品を入れた後、ユーザーは自分の商品を確認し、名前と住所を入力し、購入を送信することができます。

<div class="lightbox">
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="Cart view with checkout form">
</div>

送信を確認するには、送信した名前と住所を含むオブジェクトを見るためにコンソールを開きます。

## 次のステップ

製品カタログ、ショッピングカート、およびチェックアウト機能を備えた完全なオンラインストアアプリケーションができました。

["デプロイ"セクションに進んで](start/start-deployment "Try it: Deployment") ローカル開発に移動するか、アプリケーションをFirebaseまたは独自のサーバーに配置します。

@reviewed 2021-09-15
