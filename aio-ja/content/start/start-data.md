# 試してみよう: データの管理

[アプリ内ナビゲーション](start/start-routing "Try it: In-app Navigation") の最後に、オンラインストアアプリケーションには、製品リストと製品詳細の2つのビューをもつ製品カタログがあります。
ユーザーはリストから製品名をクリックして、別のURLあるいはrouteを使用して新しいビューに詳細を表示できます。

このページでは、ショッピングカートを3段階で作成します。

* 商品の詳細ビューに "Buy" ボタンを追加します。このボタンは、カートサービスが管理する商品のリストに現在の商品を追加します。
* カートの中の商品を表示するカートコンポーネントを追加します。
* Angularの`HttpClient`を使用して `.json` ファイルから配送データを取得することで、カート内の商品の配送料金を取得するshippingコンポーネントを追加します。

{@a services}
## サービス

サービスはAngularアプリケーションの不可欠な部分です。 Angularでは、サービスはAngularの [依存性の注入システム](guide/glossary#dependency-injection-di "dependency injection definition") を使用してアプリケーションの任意の部分で使用できるクラスのインスタンスです。

サービスは、アプリケーションの各部分の間でデータを共有する場所です。 オンラインストアの場合、カートサービスはカートデータとメソッドを保存する場所です。

{@a create-cart-service}
## ショッピングカートサービスを作成する

この時点までで、ユーザーは製品情報を表示し、
共有をシミュレートして製品の変更について通知を受けることができます。 
しかし、ユーザーは商品を買うことはできません。

このセクションでは、製品の詳細ページに "Buy" ボタンを追加し、
カートサービスを設定して、
カート内の製品に関する情報を保存します。

<div class="alert is-helpful">

このチュートリアルの後半の[ユーザー入力にフォームを使おう](start/start-forms "Try it: Forms for user input")では、ユーザーがチェックアウトするビューからこのカートサービスにアクセスする方法を説明しています。

</div>

{@a generate-cart-service}
### カートサービスを定義する

1. カートサービスを生成するには、`app`フォルダーを右クリックし、`Angular Generator`を選択して、`Service`を選択します。新しいサービスに`cart`という名前を付けます。

        <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.1.ts"></code-example>

    <div class="alert is-helpful>

        StackBlitzジェネレーターは、デフォルトで`app.module.ts`でカートサービスを提供する場合があります。これは、バンドル最適化手法である `@Injectable()` デコレータと `{ providedIn： 'root' }`ステートメントを使用する例とは異なります。
        サービスの詳細については、[サービスと依存性の注入の概要](guide/architecture-services "Concepts > Intro to Services and DI") を参照してください。

    </div>

    1. StackBlitzは、上記のように `{ providedIn: 'root' }` ステートメントなしで `@Injectable()`デコレーターを生成する場合があります。代わりに、ジェネレーターはデフォルトで `app.module.ts`にカートサービスを提供します。
    このチュートリアルでは、どちらの方法でも機能します。 `@Injectable()` の `{ providedIn: 'root' }` 構文は、[tree shaking](/guide/dependency-injection-providers#tree-shakable-providers) を可能にしますが、これはこのガイドの範囲外です。

1. `CartService` クラスで、商品の配列をカートに格納するためのプロパティ `items` を定義します。

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="props"></code-example>

1. カートへの商品の追加、商品リストの取得、商品リストのクリアを行う各メソッドを定義します:

   <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="methods"></code-example>

    * `addToCart()`メソッドは、製品を `items`の配列に追加します。

    * `getItems()` メソッドは、ユーザーがカートに追加するアイテムを収集し、各アイテムを関連する数量とともに返します。

    * `clearCart()`メソッドはアイテムの空の配列を返します。

{@a product-details-use-cart-service}
### カートサービスを使用する

このセクションでは、カートサービスを使用して、"Buy" ボタンを使用して商品をカートに追加する方法を説明します。

1. `product-details.component.ts` を開きます。

1. カートサービスを使用するようにコンポーネントを設定します。

    1. カートサービスをインポートします。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service">
        </code-example>

    1. カートサービスを`constructor()`に追加して注入します。

        <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="inject-cart-service">
        </code-example>

        <!-- 
        To do: Consider defining "inject" and describing the concept of "dependency injection"
        -->

1. 現在の商品をカートに追加する `addToCart()` メソッドを定義します。 

    `addToCart()` メソッドは次の3つのことを行います：
    * 現在の `product` を受け取ります。
    * カートサービスの `#addToCart()` メソッドを使用して商品をカートに追加します。
    * 商品がカートに追加されたというメッセージを表示します。
    
    <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

1. 商品詳細テンプレートを更新して、現在の商品をカートに追加する "Buy" ボタンを表示します。

    1. `product-details.component.html` を開きます。

    1. "Buy" というラベルの付いたボタンを追加し、 `click()` イベントを `addToCart()` メソッドにバインドします:

        <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html">
        </code-example>

    <div class="alert is-helpful">

    この行、 `<h4>{{ product.price | currency }}</h4>` は、`currency`パイプを使用して、 `product.price`を数値から通貨文字列に変換します。パイプは、HTMLテンプレートのデータを変換できる方法です。Angularのパイプの詳細については、[パイプ](guide/pipes "Pipes")を参照してください。

    </div>

1. 新しい "Buy" ボタンを表示するには、アプリケーションを更新して製品の名前をクリックして詳細を表示します。

    <div class="lightbox">
      <img src='generated/images/guide/start/product-details-buy.png' alt="Display details for selected product with a Buy button">
    </div>
 
1. "Buy" ボタンをクリックしてください。 商品がカートに保存されている商品のリストに追加され、メッセージが表示されます。

    <div class="lightbox">
      <img src='generated/images/guide/start/buy-alert.png' alt="Display details for selected product with a Buy button">
    </div>


## カートビューを作成する

この時点で、ユーザーは "Buy" をクリックして商品をカートに入れることができますが、まだカートを見ることはできません。

2ステップでカートビューを作成します。

1. カートコンポーネントを作成し、新しいコンポーネントへのルーティングを設定します。 この時点で、カートビューはデフォルトのテキストしかありません。
1. カートの商品を表示します。

### コンポーネントを設定する

カートビューを作成するには、最初に製品詳細コンポーネントを作成し、新しいコンポーネントのルーティングを構成したときと同じ手順にしたがってください。

1. `cart` という名前のコンポーネントを生成します。

    リマインダー: ファイルリストで、 `app` フォルダを右クリックし、フォルダを選択し `Angular Generator` を選択して `Component` を選択します。
    
    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1. カートコンポーネントのルーティング（URLパターン）を追加します。

    `app.module.ts` を開き、 `cart` という `path` を使用して、コンポーネント `CartComponent` のルートを追加します：

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route">
    </code-example>

1. "チェックアウト" ボタンを更新して、 `/cart` URLにルーティングされるようにします。

    `top-bar.component.html` を開き、`/cart` を指す `routerLink` ディレクティブを追加します。

    <code-example
        header="src/app/top-bar/top-bar.component.html"
        path="getting-started/src/app/top-bar/top-bar.component.html"
        region="cart-route">
    </code-example>

1. 新しいカートコンポーネントを表示するには、"チェックアウト" ボタンをクリックします。 デフォルトのテキスト "cart works!" を確認できます。そしてURLのパターンは `https://getting-started.stackblitz.io/cart`です。`getting-started.stackblitz.io` の部分はStackBlitzプロジェクトによって異なる場合があります。

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-works.png' alt="Display cart view before customizing">
    </div>

### カートのアイテムを表示する

サービスを使用して、コンポーネント間でデータを共有できます:

* 商品詳細コンポーネントは、すでにカートサービスを使用して商品をカートに追加します。
* このセクションでは、カートサービスを使用してカート内の製品を表示する方法を示します。


1. `cart.component.ts`を開きます。

1. カートサービスを使用できるようにコンポーネントを設定します。

    1. `cart.service.ts` ファイルから `CartService` をインポートします。

        <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports">
        </code-example>

    1. カートコンポーネントが使用できるように、`CartService` を注入します。

        <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="inject-cart">
        </code-example>

1. カートの商品を格納するための `items` プロパティを定義します。

    <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="items">
    </code-example>

1. カートサービスの `getItems()` メソッドでitemsを設定します。[`cart.service.ts` の生成時](#generate-cart-service) にこのメソッドを定義したことを思い出しましょう。

    CartComponentクラスは次のようになります:

    <code-example path="getting-started/src/app/cart/cart.component.3.ts" header="src/app/cart/cart.component.ts" region="props-services">
    </code-example>

1. ヘッダーとともにテンプレートを更新し、 `<div>` と `*ngFor` を使用してカートアイテムの名前と価格を表示します。

    結果、CartComponentテンプレートは次のようになります。

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices">
    </code-example>

1. カートコンポーネントをテストしてください。

    1. "My Store" をクリックして商品リストビューに移動します。
    1. 製品名をクリックして詳細を表示してください。
    1. "Buy" をクリックして商品をカートに追加します。
    1. カートを見るには、 "Checkout" をクリックしてください。
    1. 他の商品を追加するには、 "My Store" をクリックして商品リストに戻ります。 
    
  繰り返してカートにアイテムを追加します。

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-page-full.png' alt="Cart view with products added">
    </div>


<div class="alert is-helpful">

StackBlitzのヒント：プレビューが更新されるたびに、カートはクリアされます。 アプリに変更を加えると、ページが更新されます。 カートに入れるには、商品をもう一度購入する必要があります。

</div>

<div class="alert is-helpful">

サービスの詳細については、 [サービスと依存性の注入のイントロダクション](guide/architecture-services "Concepts > Intro to Services and DI") を参照してください。

</div>



## 配送料金の取得
<!-- Accessing data with the HTTP client -->

サーバーは、多くの場合、ストリームの形式でデータを返します。
ストリームは、返されたデータを簡単に変換し、そのデータをリクエストする方法を変更できるため便利です。 
Angular HTTPクライアント、`HttpClient` は、外部APIからデータを取得し、ストリームとしてアプリに提供する組み込みの方法です。

このセクションでは、HTTPクライアントを使用して外部ファイルから出荷価格を取得する方法を示します。

### 定義済み配送データ

StackBlitzがこのガイド用に生成するアプリには、定義済みの出荷データが `assets/shipping.json` に含まれています。
このデータを使用して、カート内のアイテムの送料を追加します。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json">
</code-example>


### `AppModule` で `HttpClient` を使う

AngularのHTTPクライアントを使用する前に、 `HttpClientModule` を使用するようにアプリを設定する必要があります。

Angularの `HttpClientModule` は、アプリケーション全体で `HttpClient` サービスの単一のインスタンスを使用するために必要なプロバイダーを登録します。

1. `app.module.ts`を開きます。

  このファイルには、アプリ全体で利用できるインポートと機能が含まれています。

1. 他のインポートとともに、ファイルの先頭にある `@angular/common/http` パッケージから` HttpClientModule`をインポートします。他にも多くのインポートが存在するため、このコードスニペットでは簡潔にするためにそれらを省略しています。既存のインポートはそのままにしておいてください。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import">
    </code-example>

1. `HttpClientModule` を `AppModule`の`@NgModule()`の`imports` 配列に追加して、Angularの` HttpClient`プロバイダーをグローバルに登録します。

    <code-example path="getting-started/src/app/app.module.ts" header="src/app/app.module.ts" region="http-client-module">
    </code-example>

### カートサービスで `HttpClient` を使う

`AppModule` が `HttpClientModule` をインポートしたので、次のステップは`HttpClient`サービスをサービスにインジェクトし、アプリがデータを取得して外部のAPIやリソースとやり取りできるようにすることです。

1. `cart.service.ts` を開きます。

1. `@angular/common/http` パッケージから `HttpClient` をインポートします。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http">
    </code-example>

1. `CartService` コンストラクターに `HttpClient` を注入します:

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="inject-http">
    </code-example>


### `get()` メソッドを定義する

複数のコンポーネントが同じサービスを利用することができます。
このチュートリアルの後半で、shippingコンポーネントはcartサービスを使用して `shipping.json` ファイルからHTTP経由で配送データを取得します。
最初に、`get()`メソッドを定義します。

1. `cart.service.ts` で作業を続けます。

1. `clearCart()`メソッドの下に、 `HttpClient`の `get()`メソッドを使用して配送データを取得する新しい` getShippingPrices()`メソッドを定義します。

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>


<div class="alert is-helpful">

Angularの`HttpClient`の詳細については、 [クライアント・サーバーインタラクション](guide/http "Server interaction through HTTP")ガイド を参照してください。

</div>

## 配送ビューを定義する

アプリで配送データを取得できるようになったので、配送コンポーネントとテンプレートを作成します。

1. `shipping` という名前の新しいコンポーネントを生成します。

    リマインダー: ファイルリストで、 `app` フォルダを右クリックし、　`Angular Generator` を選択して `Component` を選択します。
    
    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. `app.module.ts` で、配送のルートを追加します。 `shipping` という `path` で `ShippingComponent` コンポーネントを指定します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    新しい配送コンポーネントへのリンクはまだありませんが、ルートが指定するURLを入力すると、プレビューペインにテンプレートが表示されます。 URLのパターンは `https://getting-started.stackblitz.io/shipping` です。ここで、`getting-started.stackblitz.io` の部分はStackBlitzプロジェクトによって異なる場合があります。

1. カートサービスを使用して、 `shipping.json` ファイルからHTTP経由で配送データを取得するよう配送コンポーネントを変更します。

    1. カートサービスをインポートします。

        <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

    1. `shippingCosts` プロパティを定義します。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="props"></code-example>

    1. カートサービスを `ShippingComponent` コンストラクターに注入します:

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

    1. カートサービスの `getShippingPrices()` メソッドを使用して `shippingCosts` プロパティを設定します。

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" region="ctor"></code-example>

1. 配送コンポーネントのテンプレートで、`async`パイプを使用して配送タイプと価格を表示するように更新します:

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

1. カートビューから配送ビューへのリンクを追加します:

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. 配送料金の機能をテストします:
    
    更新されたカートを見るには、 "チェックアウト" ボタンをクリックしてください。 （アプリを変更するとプレビューが更新され、カートが空になることを忘れないでください。）

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-empty-with-shipping-prices.png' alt="Cart with link to shipping prices">
    </div>

    リンクをクリックして配送料金を確認してください。

    <div class="lightbox">
      <img src='generated/images/guide/start/shipping-prices.png' alt="Display shipping prices">
    </div>


## 次のステップ

おめでとうございます！ 商品カタログとショッピングカートを含むオンラインストアアプリケーションがあります。 配送料金を調べて表示することもできます。

Angularの探索を続けるには、次のいずれかのオプションを選択してください:
* ショッピングカートページとチェックアウトフォームを追加してアプリを完成させるには、 ["フォーム"セクションに進んで](start/start-forms "Try it: Forms for User Input") ください。 チェックアウトの一環としてユーザー情報を収集するためのフォームを作成します。
* ["デプロイ" セクションに進んで](start/start-deployment "Try it: Deployment") ローカル開発に移行するか、アプリをFirebaseまたは独自のサーバーにデプロイします。
