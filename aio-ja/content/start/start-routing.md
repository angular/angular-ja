# ナビゲーションの追加

このガイドは、入門チュートリアルの最初のステップである[基本的なAngularアプリをはじめる](start "Get started with a basic Angular app")をベースにしています。

この段階では、オンラインストアアプリケーションは基本的な商品カタログを持っています。

次のセクションでは、アプリケーションに次の機能を追加していきます。

*   アドレスバーにURLを入力して、対応する商品ページに移動します。
*   ページ上のリンクをクリックして、単一ページのアプリケーション内を移動します。
*   ブラウザの戻るボタンと進むボタンをクリックして、ブラウザの履歴を直感的にナビゲートします。

<a id="define-routes"></a>

## URLパスをコンポーネントに関連付ける

アプリケーションはすでにAngularの `Router` を使って `ProductListComponent` に移動しています。
このセクションでは、個々の商品の詳細を表示するためのルートを定義する方法を示します。

1.  商品詳細用の新しいコンポーネントを生成します。
    ターミナルで次のコマンドを実行し、新しい `product-details` コンポーネントを生成します。

    <code-example format="shell" language="shell">

    ng generate component product-details

    </code-example>

1.  `app.module.ts`では、`path`に`products/:productId`、`component`に`ProductDetailsComponent`を指定して、製品詳細のルートを追加します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="product-details-route"></code-example>

1.  `product-list.component.html`を開きます。

1.  製品名のアンカーに `product.id` をパラメータとして `routerLink` を含めるように変更します。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.html" region="router-link"></code-example>

    `RouterLink` ディレクティブはルーターにアンカー要素を制御させます。 
    この場合、ルーティング（URL）は1つの固定セグメント（`/products`）を含みます。
    最後のセグメントは可変で、現在の製品の`id`プロパティを挿入します。 
    たとえば、`id`が1の商品のURLは`https://getting-started-myfork.stackblitz.io/products/1`のようになります。

1.  製品名をクリックして、ルーターが意図したとおりに動作することを確認します。
    アプリケーションは `ProductDetailsComponent` を表示するはずです。

    プレビューウィンドウのURLが変わることに注意してください。 
    最後のセグメントは `products/#`で、`#`はあなたがクリックしたルートの数字です。

    <div class="lightbox">

    <img alt="Product details view with updated URL" src="generated/images/guide/start/product-details-works.png">

    </div>

## 商品の詳細を見る

`ProductDetailsComponent`は各商品の表示を処理する。
AngularのルーターはブラウザのURLと[定義したルート](#define-routes)に基づいてコンポーネントを表示します。

ここでは、ルーターを利用して `products` のデータとルート情報を組み合わせて、各商品の詳細を表示します。

1.  `product-details.component.ts` で、`@angular/router` から `ActivatedRoute` を、`../products` から `products` の配列をインポートする。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="imports"></code-example>

1.  `product` プロパティを定義する。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="product-prop"></code-example>

1.  コンストラクターの括弧内に引数として `private route: ActivatedRoute` を追加し、`ActivatedRoute` を `constructor()` に注入する。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="props-methods"></code-example>

    `ActivatedRoute`は、ルーターがロードする各ルーティングコンポーネントごとに固有です。
    ルーティング、そのパラメータ、およびそのルーティングに関連する追加データに関する情報が含まれています。

    `ActivatedRoute` を注入することで、サービスを使用するようにコンポーネントを設定しています。
    [データの管理](start/start-data "Try it: Managing Data") ページでサービスの詳細を説明しています。

1.  `ngOnInit()`メソッドで、ルーティングパラメータから`productId`を取り出し、`products`配列から対応する製品を取得します。

    <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="get-product"></code-example>

    ルートパラメータは、ルートで定義するパス変数に対応します。
    ルートパラメータにアクセスするためにここでは`route.snapshot`を使います。これは特定の瞬間にアクティブなルートについての情報を格納した`ActivatedRouteSnapshot`です。
    ルートに一致するURLは、`productId`を提供します。 
    Angularは `productId`を使用して、それぞれ固有の製品の詳細を表示します。

1.  商品の詳細を `*ngIf` で表示するように `ProductDetailsComponent` テンプレートを更新します。
    商品が存在する場合、`<div>` には名前、価格、説明が表示されます。

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html" region="details"></code-example>

    この行 `<h4>{{ product.price | currency }}</h4>` は、`currency` パイプを使用して `product.price` を数値から通貨文字列に変換しています。
    パイプとは、HTML テンプレート内のデータを変換する方法です。
    Angularのパイプについての詳細は、[パイプ](guide/pipes "Pipes")を参照してください。

ユーザーが製品リストの名前をクリックすると、ルーターは製品の別個のURLに移動し、`ProductDetailsComponent`を表示し、製品の詳細を表示します。

<div class="lightbox">

<img alt="Product details page with updated URL and full details displayed" src="generated/images/guide/start/product-details-routed.png">

</div>

Angularのルーターについての詳細は[ルーティングと画面遷移](guide/router "ルーティングと画面遷移ガイド")をご覧ください。

## 次は何をするの？

アプリケーションを設定して、商品の詳細を表示できるようにしました。

Angularの探索を続けるには。

*   ショッピングカート機能を追加したり、カートデータを管理したり、配送価格の外部データを取得したりするには、[データの管理](start/start-data "Try it: Managing Data")に進みます。
*   アプリケーションをFirebaseにデプロイしたり、ローカル開発に移行したりするには、[デプロイ](start/start-deployment "Try it: Deployment")をスキップしてください。

@reviewed 2022-02-28
