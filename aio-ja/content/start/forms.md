# フォーム

[Managing Data](start/data "Getting Started: Managing Data") の最後に、オンラインストアアプリケーションには製品カタログとショッピングカートがあります。

このセクションでは、フォームベースのチェックアウト機能を追加してアプリを完成させます。 チェックアウトの一環としてユーザー情報を収集するためのフォームを作成します。

## Angularのフォーム

Angularのフォームは、HTMLベースのフォームの標準機能を利用し、カスタムフォームコントロールの作成を支援し、優れたバリデーション体験を提供するためのオーケストレーションレイヤを追加します。Angular Reactiveフォームには、フォームを格納および管理するためにコンポーネント内に存在するオブジェクトと、テンプレート内に存在するフォームの視覚化という2つの部分があります。

## チェックアウトフォームモデルを定義する

まず、チェックアウトフォームモデルを設定します。フォームモデルはフォームのステータスの真実の源であり、コンポーネントクラスで定義されています。

1. `cart.component.ts` を開きます。

1. Angularの `FormBuilder` サービスは、コントロールを生成するための便利な方法を提供します。これまでに使用した他のサービスと同様に、使用する前にサービスをインポートして注入する必要があります:

    1. `@angular/forms` パッケージから `FormBuilder` サービスをインポートします。

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
      </code-example>

      `FormBuilder` サービスは `ReactiveFormsModule` によって提供されます。これは、以前に変更した `AppModule` （ `app.module.ts` ）ですでに定義されています。

    1. `FormBuilder` サービスを注入します。 

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
      </code-example>

1. `CartComponent` クラスで、フォームモデルを格納するための `checkoutForm` プロパティを定義します。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form">
    </code-example>

1. チェックアウト中に、アプリはユーザーに名前と住所の入力を求めます。後でその情報を収集できるように、 `FormBuilder#group()` メソッドを使用して、 `name` フィールドと `address` フィールドを含むフォームモデルで `checkoutForm` プロパティを設定します。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. チェックアウト処理では、ユーザーはフォームデータ（自分の名前と住所）を送信できる必要があります。 注文が送信されると、フォームはリセットされ、カートはクリアされます。

    `cart.component.ts` で、フォームを処理するための `onSubmit()` メソッドを定義します。 `CartService#clearCart()` メソッドを使用してカートアイテムを空にし、送信後にフォームをリセットします。 （実際のアプリでは、このメソッドはデータを外部サーバーに送信することもあります。）

    カートコンポーネント全体を次に示します:

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
    </code-example>

フォームモデルはコンポーネントクラスで定義されています。 モデルをビューに反映させるには、チェックアウトフォームが必要です。

## チェックアウトフォームを作成する

次に、"カート"ページの下部にチェックアウトフォームを追加します。

1. `cart.component.html`を開きます。

1. テンプレートの下部に、ユーザー情報を取り込むための空のHTMLフォームを追加します。

1. `formGroup` プロパティバインディングを使用して、 `checkoutForm` をテンプレート内の `form` タグにバインドします。 また、フォームを送信するための"購入"ボタンを含めてください。

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

1. `form` タグで、 `ngSubmit` イベントバインディングを使用してフォーム送信を待機し、 `checkoutForm` のvalueを指定して `onSubmit()` メソッドを呼び出します。

  <code-example path="getting-started/src/app/cart/cart.component.html" region="checkout-form-1">
  </code-example>

1. `name` と `address` の入力フィールドを追加します。 `formControlName` 属性バインディングを使用して、 `name` と `address` の `checkoutForm` フォーム・コントロールをそれらの入力フィールドにバインドします。 最後の完成したコンポーネントは次のとおりです:

  <code-example path="getting-started/src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

カートにいくつかの商品を入れた後、ユーザーは自分の商品を確認し、名前と住所を入力し、購入を送信することができます:

<figure>
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="Cart page with checkout form">
</figure>


## 次のステップ

おめでとうございます！製品カタログ、ショッピングカート、およびチェックアウト機能を備えた完全なオンラインストアアプリケーションがあります。

["配置"セクションに進んで](start/deployment "Getting Started: Deployment") ローカル開発に移動するか、アプリをFirebaseまたは独自のサーバーに配置します。
