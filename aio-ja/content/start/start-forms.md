# 試してみよう: ユーザー入力にフォームを使おう

[データ管理](start/start-data "Try it: Managing Data") を終えると、オンラインストアアプリケーションには製品カタログとショッピングカートがあります。

このセクションでは、フォームベースのチェックアウト機能を追加して、チェックアウトの一部としてユーザー情報を収集する方法を説明します。

## Angularのフォーム

Angularのフォームは、標準のHTMLフォームに基づいて構築され、カスタムフォームコントロールと簡単な検証エクスペリエンスの作成に役立ちます。 Angular Reactiveフォームには2つの部分があります。フォームを保存および管理するためにコンポーネントに存在するオブジェクトと、テンプレートに存在するフォームの可視化です。

## チェックアウトフォームモデルを定義する

最初に、チェックアウトフォームモデルを設定します。コンポーネントクラスで定義されているフォームモデルは、フォームのステータスの真実の情報源です。

1. `cart.component.ts` を開きます。

1. Angularの `FormBuilder` サービスは、コントロールを生成するための便利な方法を提供します。これまでに使用した他のサービスと同様に、使用する前にサービスをインポートして注入する必要があります:

    1. `@angular/forms` パッケージから `FormBuilder` サービスをインポートします。

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
      </code-example>

      `ReactiveFormsModule`は`FormBuilder`サービスを提供します。これは`AppModule`（`app.module.ts`内）がすでにインポートしています。

    1. `FormBuilder` サービスを注入します。 

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
      </code-example>

1. `CartComponent` クラスで、フォームモデルを格納するための `checkoutForm` プロパティを定義します。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form">
    </code-example>

1. ユーザーの名前と住所を収集するために、`FormBuilder`の`group() `メソッドを使用して、`name`と `address`フィールドを含むフォームモデルで `checkoutForm`プロパティを設定します。これをコンストラクターの中括弧 `{}`の間に追加します。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. チェックアウト処理では、ユーザーはフォームデータ（自分の名前と住所）を送信する必要があります。 注文が送信されると、フォームはリセットされ、カートはクリアされます。

    `cart.component.ts` で、フォームを処理するための `onSubmit()` メソッドを定義します。 `CartService#clearCart()` メソッドを使用してカートアイテムを空にし、送信後にフォームをリセットします。 （実際のアプリでは、このメソッドはデータを外部サーバーに送信することもあります。）カートコンポーネント全体を次に示します:

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
    </code-example>

コンポーネントクラスでフォームモデルを定義したので、ビューにモデルを反映するためのチェックアウトフォームが必要です。

## チェックアウトフォームを作成する

"カート" ビューの下部にチェックアウトフォームを追加するには、次の手順を使用します。

1. `cart.component.html`を開きます。

1. テンプレートの下部に、ユーザー情報を取り込むためのHTMLフォームを追加します。

1. `formGroup` プロパティバインディングを使用して、 `checkoutForm` をテンプレート内の `form` タグにバインドします。 また、フォームを送信するための"購入"ボタンを含めてください。

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

1. `form` タグで、 `ngSubmit` イベントバインディングを使用してフォーム送信を待機し、 `checkoutForm` のvalueを指定して `onSubmit()` メソッドを呼び出します。

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html (cart component template detail)" region="checkout-form-1">
  </code-example>

1. `name` と `address` の入力フィールドを追加します。 `formControlName` 属性バインディングを使用して、 `name` と `address` の `checkoutForm` フォーム・コントロールをそれらの入力フィールドにバインドします。 最後の完成したコンポーネントは次のとおりです:

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

カートにいくつかの商品を入れた後、ユーザーは自分の商品を確認し、名前と住所を入力し、購入を送信することができます:

<div class="lightbox">
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="Cart view with checkout form">
</div>

送信を確認するには、送信した名前と住所を含むオブジェクトが表示されるはずのコンソールを開きます。

## 次のステップ

おめでとうございます！製品カタログ、ショッピングカート、およびチェックアウト機能を備えた完全なオンラインストアアプリケーションがあります。

["デプロイ"セクションに進んで](start/start-deployment "Try it: Deployment") ローカル開発に移動するか、アプリをFirebaseまたは独自のサーバーに配置します。
