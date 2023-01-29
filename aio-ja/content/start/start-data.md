# データの管理

このガイドは、[基本的なAngularアプリケーションで始める](start)チュートリアルの第2ステップである[ナビゲーションの追加](start/start-routing "Adding navigation")をベースにしています。
この段階では、ストアアプリケーションには商品カタログがあり、商品一覧と商品詳細の2つのビューがあります。
ユーザーはリストから製品名をクリックして、別のURLあるいはrouteを使用して新しいビューに詳細を表示できます。

このチュートリアルのステップでは、次のフェーズでショッピングカートを作成する方法をガイドします。

*   商品の詳細ビューに **Buy** ボタンを追加します。このボタンは、カートサービスが管理する商品のリストに現在の商品を追加します。
*   カートの中の商品を表示するカートコンポーネントを追加します。
*   Angularの`HttpClient`を使用して `.json` ファイルから配送データを取得することで、カート内の商品の配送料金を取得するshippingコンポーネントを追加します。

<a id="create-cart-service"></a>

## ショッピングカートサービスを作成する

Angularでは、サービスはAngularの [依存性の注入システム](guide/glossary#dependency-injection-di "dependency injection definition") を使用してアプリケーションの任意の部分で使用できるクラスのインスタンスです。

現在、ユーザーは商品情報を閲覧することができ、アプリケーションでは商品変更の共有や通知をシミュレーションすることができます。

次のステップは、ユーザーが商品をカートに追加する方法を構築することです。
このセクションでは、**Buy**ボタンを追加し、カート内の製品に関する情報を保存するためのカートサービスを設定する方法を説明します。

<a id="generate-cart-service"></a>

### カートサービスを定義する

このセクションでは、ショッピングカートに追加された商品を追跡する `CartService` を作成する手順を説明します。

1.  ターミナルで次のコマンドを実行し、新しい `cart` サービスを生成します。

    <code-example format="shell" language="shell">

    ng generate service cart

    </code-example>

1.  `./products.ts` から `Product` インターフェースを `cart.service.ts` ファイルにインポートし、`CartService` クラスに、現在のカート内の商品の配列を格納する `items` プロパティを定義します。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="props"></code-example>

1.  カートへの商品の追加、商品リストの取得、商品リストのクリアを行う各メソッドを定義します:

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="methods"></code-example>

    *   `addToCart()`メソッドは、製品を `items`の配列に追加します。
    *   `getItems()` メソッドは、ユーザーがカートに追加するアイテムを収集し、各アイテムを関連する数量とともに返します。
    *   `clearCart()`メソッドはアイテムの空の配列を返し、カートを空にします。

<a id="product-details-use-cart-service"></a>

### カートサービスを使用する

このセクションでは、カートサービスを使用して商品をカートに追加する方法を説明します。

1.  `product-details.component.ts` で、カートサービスをインポートする。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service"></code-example>

1.  カートサービスを`constructor()`に追加して注入します。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="inject-cart-service"></code-example>

1.  現在の商品をカートに追加する `addToCart()` メソッドを定義します。 
    
    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

    `addToCart()` メソッドは次の3つのことを行います：

    * 現在の `product` を受け取ります。
    * カートサービスの `#addToCart()` メソッドを使用して商品をカートに追加します。
    * 商品がカートに追加されたというメッセージを表示します。

1.  `product-details.component.html` に **Buy** というラベルのボタンを追加し、`addToCart()` メソッドに `click()` イベントをバインドします。
    このコードは、現在の商品をカートに追加する**Buy**ボタンで商品詳細テンプレートを更新します。

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html"></code-example>

1.  アプリケーションを更新し、商品名をクリックして詳細を表示して、新しい**Buy**ボタンが期待どおりに表示されていることを確認します。

    <div class="lightbox">

    <img alt="Display details for selected product with a Buy button" src="generated/images/guide/start/product-details-buy.png">

    </div>
 
1.  **Buy** ボタンをクリックしてください。 商品がカートに保存されている商品のリストに追加され、メッセージが表示されます。

    <div class="lightbox">

    <img alt="Display details for selected product with a Buy button" src="generated/images/guide/start/buy-alert.png">

    </div>

## カートビューを作成する

お客様にカートを見てもらうために、2つのステップでカートビューを作成することができます。

1.  カートコンポーネントを作成し、新しいコンポーネントへのルーティングを設定します。
1.  カートの商品を表示します。

### カートコンポーネントを設定する

カートビューを作成するには、`ProductDetailsComponent`を作成し、新しいコンポーネントのルーティングを設定するのと同じ手順に従います。

1.  ターミナルで次のコマンドを実行し、`cart`という名前の新しいコンポーネントを生成します。

    <code-example format="shell" language="shell">

    ng generate component cart

    </code-example>

    このコマンドは `cart.component.ts` ファイルとそれに関連するテンプレートファイル、スタイルファイルを生成します。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1.  新しく作成した`CartComponent`が、`app.module.ts`のモジュールの`declarations`に追加されていることを確認します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="declare-cart"></code-example>

1.  引き続き `app.module.ts` に、コンポーネント `CartComponent` のルートを、`path` を `cart` として追加します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route"></code-example>

1.  **Checkout**ボタンをクリックした際に`/cart`のURLにルーティングされるようにしましょう。 
    `top-bar.component.html` に `/cart` を指す `routerLink` ディレクティブを追加します。

    <code-example header="src/app/top-bar/top-bar.component.html" path="getting-started/src/app/top-bar/top-bar.component.html" region="cart-route"></code-example>

1.  新しいカートコンポーネントを表示するには、**Checkout**ボタンをクリックします。 
    デフォルトのテキスト "cart works!" を確認できます。そしてURLのパターンは `https://getting-started.stackblitz.io/cart`です。`getting-started.stackblitz.io` の部分はStackBlitzプロジェクトによって異なる場合があります。

    <div class="lightbox">
    
    <img alt="Display cart view before customizing" src="generated/images/guide/start/cart-works.png">
    
    </div>

### カートのアイテムを表示する

ここでは、カートサービスを利用してカート内に商品を表示させる方法をご紹介します。

1.  `cart.component.ts` で、`cart.service.ts` ファイルから `CartService` をインポートする。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports"></code-example>

1.  `CartComponent` が `constructor()` に追加して `CartService` を使用できるようにするために `CartService` を注入する。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="inject-cart"></code-example>

1.  カートの商品を格納するための `items` プロパティを定義します。

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="items"></code-example>

    このコードはカートサービスの `getItems()` メソッドでitemsを設定します。
    このメソッドは [`cart.service.ts` を作成したとき](#generate-cart-service)に定義されています。

1.  ヘッダーとともにカートのテンプレートを更新し、 `<div>` と `*ngFor` を使用してカートアイテムの名前と価格を表示します。
    結果、CartComponentテンプレートは次のようになります。

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices"></code-example>

1.  カートが期待どおりに動作することを確認してください。

    1.  **My Store**をクリックしてください。
    1.  商品名をクリックすると詳細が表示されます。
    1.  カートに商品を追加するには、**Buy**をクリックしてください。
    1.  カートを見るには、**Checkout**をクリックしてください。

    <div class="lightbox">

    <img alt="Cart view with products added" src="generated/images/guide/start/cart-page-full.png">

    </div>

サービスの詳細については、 [サービスと依存性の注入のイントロダクション](guide/architecture-services "Concepts > Intro to Services and DI") を参照してください。

## 配送料金の取得

サーバーは、多くの場合、ストリームの形式でデータを返します。
ストリームは、返されたデータを簡単に変換し、そのデータをリクエストする方法を変更できるため便利です。 
Angularの `HttpClient` は外部APIからデータを取得し、ストリームとしてアプリケーションに提供する組み込みの方法です。

このセクションでは、`HttpClient`を使って外部ファイルから出荷価格を取得する方法を示します。

StackBlitzがこのガイド用に生成するアプリケーションには、定義済みの出荷データが `assets/shipping.json` に含まれています。
このデータを使用して、カート内のアイテムの送料を追加します。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json"></code-example>

### `HttpClient`を使用するように`AppModule`を設定します。

Angularの `HttpClient` を使うには、アプリケーションが `HttpClientModule` を使うように設定する必要があります。

Angularの `HttpClientModule` はアプリケーション全体で `HttpClient` サービスを利用するために必要なプロバイダーを登録します。

1.  `app.module.ts` で、ファイルの先頭にある `@angular/common/http` パッケージから `HttpClientModule` を他のインポートと一緒にインポートします。
    他にも多くのインポートがあるので、このコードスニペットでは簡潔のために省略しています。
    必ず既存のインポートはそのままにしておいてください。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import"></code-example>

1.  Angularの`HttpClient`プロバイダーをグローバルに登録するには、`AppModule`の`@NgModule()`の`imports`配列に`HttpClientModule`を追加します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module"></code-example>

### `CartService` が `HttpClient` を使用するように設定します。

次のステップは `HttpClient` サービスをサービスに注入し、アプリケーションがデータを取得して外部のAPIやリソースと対話できるようにすることです。

1.  `cart.service.ts` で、`@angular/common/http` パッケージから `HttpClient` をインポートします。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http"></code-example>

1.  `CartService`の`constructor`に `HttpClient` を注入します:

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="inject-http"></code-example>

### 配送料を取得するために `CartService` を設定します。

出荷データを `shipping.json` から取得するには、`HttpClient` の `get()`メソッドを利用することができます。

1.  `cart.service.ts` で `clearCart()` メソッドの下に、`HttpClient`の `get()` メソッドを利用した `getShippingPrices()` メソッドを定義します。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>

Angularの`HttpClient`の詳細については、 [クライアント・サーバーインタラクション](guide/http "Server interaction through HTTP")ガイド を参照してください。

## 配送コンポーネントを作成する

これで、配送データを取得するようにアプリケーションを設定したので、そのデータをレンダリングする場所を作成することができます。

1.  ターミナルで次のコマンドを実行し、`shipping`という名前のカートコンポーネントを生成します。

    <code-example format="shell" language="shell">

    ng generate component shipping

    </code-example>

    このコマンドは `shipping.component.ts` ファイルとそれに関連するテンプレートファイル、スタイルファイルを生成します。
    
    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1.  `app.module.ts` で、配送のルートを追加します。 
    `shipping` という `path` で `ShippingComponent` コンポーネントを指定します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    新しい配送コンポーネントへのリンクはまだありませんが、ルートが指定するURLを入力すると、プレビューペインにテンプレートが表示されます。 
    URLのパターンは `https://angular-ynqttp--4200.local.webcontainer.io/shipping` です。ここで、`angular-ynqttp--4200.local.webcontainer.io` の部分はStackBlitzプロジェクトによって異なる場合があります。

### `ShippingComponent` が `CartService` を使用するように設定する

このセクションでは、`ShippingComponent`を変更して、`shipping.json`ファイルからHTTP経由で配送データを取得する方法を説明します。

1.  `shipping.component.ts` で、`CartService` をインポートする。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

1.  `ShippingComponent` の `constructor()` にカートサービスを注入します。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

1.  `shippingCosts`プロパティを定義して、`CartService` の `getShippingPrices()` メソッドを用いて `shippingCosts` プロパティを設定する。
    `ngOnInit()` メソッド内で `shippingCosts` プロパティを初期化します。

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="props"></code-example>

1.  `ShippingComponent`のテンプレートで、`async`パイプを使用して配送タイプと価格を表示するように更新します:

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

    `async` パイプはデータのストリームから最新の値を返し、与えられたコンポーネントが存在する限りそれを継続します。
    Angularがそのコンポーネントを破棄すると、`async` パイプは自動的に停止します。
    `async` パイプについての詳細な情報は [AsyncPipe API documentation](api/common/AsyncPipe) を参照してください。

1.  `CartComponent` ビューから `ShippingComponent` ビューへのリンクを追加します。

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1.  更新されたカートを見るには、 **Checkout** ボタンをクリックしてください。 
    アプリケーションを変更するとプレビューが更新され、カートが空になることを忘れないでください。

    <div class="lightbox">

    <img alt="Cart with link to shipping prices" src="generated/images/guide/start/cart-empty-with-shipping-prices.png">

    </div>

    リンクをクリックして配送料金を確認してください。

    <div class="lightbox">

    <img alt="Display shipping prices" src="generated/images/guide/start/shipping-prices.png">

    </div>

## 次は何をするの？

これで、商品カタログ、ショッピングカート、配送価格を調べることができるストアアプリケーションが完成しました。

Angularの探索を続けるには。

*   ショッピングカートビューとチェックアウトフォームを追加してアプリケーションを完成させるには、[Forms for User Input](start/start-forms "Forms for User Input")に進みます。
*   [デプロイ](start/start-deployment "Deployment")をスキップしてローカル開発に移行したり、アプリケーションをFirebaseや自分のサーバーにデプロイしたりします。

@reviewed 2022-02-28
