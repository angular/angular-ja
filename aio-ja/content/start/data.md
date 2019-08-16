# データ管理

[ルーティング](start/routing "Getting Started: Routing") の最後に、オンラインストアアプリケーションには、製品リストと製品詳細の2つのビューをもつ製品カタログがあります。
ユーザーはリストから製品名をクリックして、別のURL（route）を使用して新しいビューに詳細を表示できます。

このセクションでは、ショッピングカートを作成します。 あなたは:
* 商品の詳細ページに "Buy" ボタンを追加します。 これにより、現在の商品がカートサービスで管理されている商品のリストに追加されます。
* カートに追加した商品を表示するカートコンポーネントを追加します。
* Angularの`HttpClient`を使用して `.json` ファイルから配送データを取得することで、カート内の商品の配送料金を取得するshippingコンポーネントを追加します。

{@a services}
## サービス

サービスはAngularアプリケーションの不可欠な部分です。 Angularでは、サービスはAngularの [依存性の注入システム](guide/glossary#dependency-injection-di "dependency injection definition") を使用してアプリケーションの任意の部分で使用可能にできるクラスのインスタンスです。

サービスは、アプリケーションの各部分の間でデータを共有する場所です。 オンラインストアの場合、カートサービスはカートデータとメソッドを保存する場所です。

{@a create-cart-service}
## ショッピングカートサービスを作成する

この時点までで、ユーザーは製品情報を表示し、共有をシミュレートして製品の変更について通知を受けることができます。 しかし、ユーザーは商品を買うことはできません。

このセクションでは、商品の詳細ページに "Buy" ボタンを追加します。
また、商品に関する情報をカートに保存するためのカートサービスを設定します。

<div class="alert is-helpful">

後ほど、このチュートリアルの [フォーム](start/forms "Getting Started: Forms") で、このカートサービスにも、ユーザーがチェックアウトしたページからアクセスします。

</div>

{@a generate-cart-service}
### カートサービスを定義する

1. カートサービスを生成します。

    1. `app` フォルダを右クリックして `Angular Generator` を選択し、 `Service` を選択します。 新しいサービスに `cart` と名前をつけます。

        <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.1.ts"></code-example>

    1. 生成された `@Injectable()` デコレーターに `{ providedIn: 'root' }` 文が含まれていない場合は、上記のように追加します。

1. `CartService` クラスで、商品のリスト（配列）をカートに格納するためのプロパティ `items` を定義します。

    <code-example path="getting-started/src/app/cart.service.ts" region="props"></code-example>

1. カートへの商品の追加、商品リストの取得、商品リストのクリアを行う各メソッドを定義します:

    <code-example path="getting-started/src/app/cart.service.ts" region="methods"></code-example>

    <!--
    To check: StackBlitz includes the constructor. If it's important (and not obvious) that the methods be below the constructor, then we should show it or say something. 
    -->

    <!-- 
    * The `addToCart()` method appends a product to an array of `items`. 

    * The `getItems()` method collects the items added to the cart and returns each item with its associated quantity.

    * The `clearCart()` method returns an empty array of items. 
    -->

{@a product-details-use-cart-service}
### カートサービスを使用する

このセクションでは、カートサービスを使用するように商品詳細コンポーネントを更新します。
商品詳細ビューに "Buy" ボタンを追加します。
"Buy" ボタンをクリックすると、カートサービスを使用して現在の商品がカートに追加されます。

1. `product-details.component.ts` を開きます。

1. カートサービスを使用できるようにコンポーネントを設定します。

    1. カートサービスをインポートします。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service">
        </code-example>

    1. カートサービスを注入します。

        <code-example path="getting-started/src/app/product-details/product-details.component.ts" region="inject-cart-service">
        </code-example>

        <!-- 
        To do: Consider defining "inject" and describing the concept of "dependency injection"
        -->

1. 現在の商品をカートに追加する `addToCart()` メソッドを定義します。 

    `addToCart()` メソッド:
    * 現在の `product` を受け取ります。
    * カートサービスの `#addToCart()` メソッドを使用して商品をカートに追加します。
    * 商品がカートに追加されたというメッセージを表示します。
    
    <code-example path="getting-started/src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

1. 商品詳細テンプレートを更新して、現在の商品をカートに追加する "Buy" ボタンを表示します。

    1. `product-details.component.html` を開きます。

    1. "Buy" というラベルの付いたボタンを追加し、 `click()` イベントを `addToCart()` メソッドにバインドします:

        <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html">
        </code-example>

1. 新しい "Buy" ボタンを表示するには、アプリケーションを更新して製品の名前をクリックして詳細を表示します。

   <figure>
     <img src='generated/images/guide/start/product-details-buy.png' alt="Display details for selected product with a Buy button">
   </figure>
 
1. "Buy" ボタンをクリックしてください。 商品がカートに保存されている商品のリストに追加され、メッセージが表示されます。

    <figure>
      <img src='generated/images/guide/start/buy-alert.png' alt="Display details for selected product with a Buy button">
    </figure>


## カートページを作成する

この時点で、ユーザーは "Buy" をクリックして商品をカートに入れることができますが、まだカートを見ることはできません。

カートページは2つのステップで作成します:

1. カートコンポーネントを作成し、新しいコンポーネントへのルーティングを設定します。 この時点で、カートページにはデフォルトのテキストしかありません。
1. カートの商品を表示します。

### コンポーネントを設定する

カートページを作成するには、製品詳細コンポーネントを作成し、新しいコンポーネントのルーティングを設定したのと同じ手順を実行します。

1. `cart` という名前のコンポーネントを生成します。

    リマインダー: ファイルリストで、 `app` フォルダを右クリックし、フォルダを選択し `Angular Generator` を選択して `Component` を選択します。
    
    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1. カートコンポーネントのルーティング（URLパターン）を追加します。

    リマインダー: `app.module.ts` を開き、 `cart` という `path` を使用して、コンポーネント `CartComponen` のルートを追加します：

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route">
    </code-example>

    <!-- 
    To do: Can we shorten the example code to remove the extra at the bottom? 
    -->

1. 新しいカートコンポーネントを見るには、 "チェックアウト" ボタンをクリックしてください。 あなたはデフォルトのテキスト "cart works!" を確認できます。 URLは `https://getting-started.stackblitz.io/cart` となっていますが、あなたのStackBlitzプロジェクトでは `getting-started.stackblitz.io` の部分は異なるでしょう。

    （注：トップバーコンポーネントに用意されている "Checkout" ボタンは、すでに `routerLink` で `/cart` が設定されています。）

    <figure>
      <img src='generated/images/guide/start/cart-works.png' alt="Display cart page before customizing">
    </figure>


### カートのアイテムを表示する

サービスを使用して、コンポーネント間でデータを共有できます:

* 商品詳細コンポーネントは、すでにカートサービス（ `CartService` ）を使用して商品をカートに追加します。
* このセクションでは、カート内の商品を表示するためにcartサービスを使用するようにcartコンポーネントを更新します。


1. `cart.component.ts`を開きます。

1. カートサービスを使用できるようにコンポーネントを設定します。 （これは、上記のカートサービスを使用するように商品詳細コンポーネントを設定するのと同じ方法です。）

    1. `cart.service.ts` ファイルから `CartService` をインポートします。

        <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports">
        </code-example>

    1. カート情報を管理するために `CartService` を注入します。

        <code-example path="getting-started/src/app/cart/cart.component.2.ts" region="inject-cart">
        </code-example>

1. カートの商品を格納するための `items` プロパティを定義します。

    <code-example path="getting-started/src/app/cart/cart.component.2.ts" region="items">
    </code-example>

1. カートサービスの `getItems()` メソッドでitemsを設定します。 （[ `cart.service.ts` の生成時](#generate-cart-service) にこのメソッドを定義しました。）

    CartComponentクラスは次のようになります:

    <code-example path="getting-started/src/app/cart/cart.component.3.ts" region="props-services">
    </code-example>

1. ヘッダー（ "Cart" ）を使用してテンプレートを更新し、 `<div>` と `*ngFor` を使用してカートアイテムの名前と価格を表示します。

    結果、CartComponentテンプレートは次のようになります。

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices">
    </code-example>

1. カートコンポーネントをテストしてください。

    1. "My Store" をクリックして商品リストページに移動します。
    1. 製品名をクリックして詳細を表示してください。
    1. "Buy" をクリックして商品をカートに追加します。
    1. カートを見るには、 "Checkout" をクリックしてください。
    1. 他の商品を追加するには、 "My Store" をクリックして商品リストに戻ります。 上記の手順を繰り返します。

    <figure>
      <img src='generated/images/guide/start/cart-page-full.png' alt="Cart page with products added">
    </figure>


<div class="alert is-helpful">

StackBlitzのヒント：プレビューが更新されるたびに、カートはクリアされます。 アプリに変更を加えると、ページが更新されます。 カートに入れるには、商品をもう一度購入する必要があります。

</div>

<!-- 
To do: New screen shot. No shipping prices link yet. Show a few products in the cart. 
-->

<div class="alert is-helpful">

詳細情報: サービスの詳細については、 [サービスと依存性の注入のイントロダクション](guide/architecture-services "Architecture > Intro to Services and DI") を参照してください。

</div>



## 配送料金の取得
<!-- Accessing data with the HTTP client -->

サーバーから返されるデータは、多くの場合ストリームの形式を取ります。
ストリームは、返されるデータを変換したり、データの要求方法を変更したりするのを容易にするので便利です。
Angular HTTP client（ `HttpClient` ）は、外部APIからデータを取得し、それらをストリームとしてアプリケーションに提供するための組み込みの方法です。

このセクションでは、HTTPクライアントを使用して外部ファイルから配送料金を取得します。

### 定義済み配送データ

この入門ガイドのために、配送データを `assets/shipping.json` に用意しました。
このデータを使用して、カート内の商品の配送料金を追加します。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json">
</code-example>


### アプリのHttpClientを有効にする

AngularのHTTPクライアントを使用する前に、 `HttpClientModule` を使用するようにアプリを設定する必要があります。

Angularの `HttpClientModule` は、アプリケーション全体で `HttpClient` サービスの単一のインスタンスを使用するために必要なプロバイダーを登録します。
`HttpClient` サービスは、データを取得したり外部のAPIやリソースと対話したりするためにサービスに注入するものです。

1. `app.module.ts`を開きます。

  このファイルには、アプリ全体で利用できるインポートと機能が含まれています。

1. `@angular/common/http` パッケージから `HttpClientModule`をインポートします。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import">
    </code-example>

1. `HttpClientModule` をアプリモジュール（ `@NgModule` ）の `imports` 配列に追加します。

    これはAngularの `HttpClient` プロバイダーをグローバルに登録します。

    <code-example path="getting-started/src/app/app.module.ts" region="http-client-module">
    </code-example>

<!-- 
To do: Should ReactiveFormsModule already be here? Currently, it is in the starter stackblitz, so this doc assumes it is already included and not added in the forms section.
-->

<!-- 
To do: Should ReactiveFormsModule already be here? 
-->

### カートサービス用にHttpClientを有効にする

1. `cart.service.ts` を開きます。

1. `@angular/common/http` パッケージから `HttpClient` をインポートします。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http">
    </code-example>

1. `CartService` コンポーネントクラスのコンストラクターに `HttpClient` を注入します:

    <code-example path="getting-started/src/app/cart.service.ts" region="inject-http">
    </code-example>


### get()メソッドを定義する

すでに見たように、複数のコンポーネントが同じサービスを利用することができます。
このチュートリアルの後半で、shippingコンポーネントはcartサービスを使用して `shipping.json` ファイルからHTTP経由で配送データを取得します。
ここでは使用される `get()` メソッドを定義します。

1. `cart.service.ts` で作業を続けます。

1. `clearCart()` メソッドの下に、 `HttpClient#get()` メソッドを使用して[配送データ（タイプと価格）を取得する新しいメソッド `getShippingPrices()` を定義します。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>


<div class="alert is-helpful">

詳細情報: Angularの`HttpClient`の詳細については、 [HttpClientガイド](guide/http "HttpClient guide") を参照してください。

</div>




## 配送ページを定義する

アプリが配送データを取得できるようになったので、次に配送コンポーネントとそれに関連するテンプレートを作成します。

1. `shipping` という名前の新しいコンポーネントを生成します。

    リマインダー: ファイルリストで、 `app` フォルダを右クリックし、　`Angular Generator` を選択して `Component` を選択します。
    
    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. `app.module.ts` で、配送のルートを追加します。 `shipping` という `path` で `ShippingComponent` コンポーネントを指定します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    新しい配送コンポーネントは、他のコンポーネントにはまだ接続されていませんが、そのルートで指定されたURLを入力することによって、プレビューを表示できます。 URLのパターンは https://getting-started.stackblitz.io/shipping ですが、あなたのStackBlitzプロジェクトでは `getting-started.stackblitz.io` の部分は異なるでしょう。

1. カートサービスを使用して、 `shipping.json` ファイルからHTTP経由で配送データを取得するよう配送コンポーネントを変更します。

    1. カートサービスをインポートします。

        <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

    1. `shippingCosts` プロパティを定義します。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="props"></code-example>

    1. カートサービスを `ShippingComponent` クラスに注入します:

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

    1. カートサービスの `getShippingPrices()` メソッドを使用して `shippingCosts` プロパティを設定します。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="ctor"></code-example>

1. 配送コンポーネントのテンプレートで、asyncパイプを使用して配送タイプと価格を表示するように更新します:

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

    <!--
    To decide: Should we describe async pipe
    -->

1. カートページから配送ページへのリンクを追加します:

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. 配送料金の機能をテストします:
    
    更新されたカートを見るには、 "チェックアウト" ボタンをクリックしてください。 （アプリを変更するとプレビューが更新され、カートが空になることを忘れないでください。）

    <figure>
      <img src='generated/images/guide/start/cart-empty-with-shipping-prices.png' alt="Cart with link to shipping prices">
    </figure>

    リンクをクリックして配送料金を確認してください。

    <figure>
      <img src='generated/images/guide/start/shipping-prices.png' alt="Display shipping prices">
    </figure>


## 次のステップ

おめでとうございます！ 商品カタログとショッピングカートを含むオンラインストアアプリケーションがあります。 配送料金を調べて表示することもできます。

Angularの探索を続けるには、次のいずれかのオプションを選択してください:
* ショッピングカートページとフォームベースのチェックアウト機能を追加してアプリを完成させるには、 ["フォーム"セクションに進んで](start/forms "Getting Started: Forms") ください。 チェックアウトの一環としてユーザー情報を収集するためのフォームを作成します。
* ["デプロイ" セクションに進んで](start/deployment "Getting Started: Deployment") ローカル開発に移行するか、アプリをFirebaseまたは独自のサーバーにデプロイします。
