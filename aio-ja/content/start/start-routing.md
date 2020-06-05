# アプリ内ナビゲーション

[パート1](start "Get started with a basic Angular app")を終えると、オンラインストアアプリケーションは基本的な製品カタログを持っています。
アプリには可変状態やナビゲーションはありません。
URLは1つあり、そのURLには常に"My Store"ページが製品のリストとその説明とともに表示されます。

このガイドでは、Angular [ルーティング](guide/glossary#router "Router definition")を使用してユーザーにアプリ内ナビゲーションを提供する方法を示します。シングルページアプリでは、新しいページを読み込む代わりに、ユーザーがアプリケーションのどこにいるかに基づいて、さまざまなコンポーネントとデータをユーザーに表示します。

[ルーター](guide/glossary#router "Router definition")を使用すると、製品の詳細を個別の[ビュー](guide/glossary#view "View definition")に表示できます。それぞれに独自のURLがあります。ルーティングを使用すると、ユーザーが次のようなタスクを実行するときに、あるビューから次のビュー（同じページ内）に移動できます。

* アドレスバーにURLを入力して、対応するビューに移動する。
* ページ上のリンクをクリックして、新しいビューに移動する。
* ブラウザの戻るボタンと進むボタンをクリックして、ブラウザの履歴を前後にナビゲートする。

## ルーティングを登録する

このアプリは、Angularのルーティングを使用して、以前に変更した製品リストコンポーネントに移動するようにすでに設定されています。 このセクションでは、個々の製品の詳細を表示するルートを定義する方法を示します。

1. 製品詳細用の新しいコンポーネントを生成します。 コンポーネントに `product-details`という名前を付けます。

    注意： ファイルリストの中で、 `app`フォルダを右クリックし、`Angular Generator`と `Component`を選択してください。

1. `app.module.ts`に、`products/:productId`の`path`と`component`の`ProductDetailsComponent`で、商品の詳細へのルーティングを追加します。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="product-details-route">
    </code-example>

    ルーティングは、1つ以上のURLパスをコンポーネントに関連付けます。

1. ディレクティブは、ユーザーがルートまたはURLに移動する方法を定義するためにコンポーネントテンプレートを構成します。ユーザーが製品名をクリックすると、アプリにその製品の詳細が表示されます。

    1. `product-list.component.html`を開きます。

    1. リストを反復処理するときに、`*ngFor`ディレクティブを更新して、` products`配列の各インデックスを `productId`変数に割り当てるようにします。

    1. `routerLink`を含めるように製品名のアンカーを変更します。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.html" region="router-link">
    </code-example>

      RouterLinkディレクティブはルーターにアンカー要素を制御させます。 この場合、ルーティング（URL）は1つの固定セグメント（`/products`）を含み、最後のセグメントは可変で、現在の製品のidプロパティを挿入します。 たとえば、`id`が1の商品のURLは`https://getting-started-myfork.stackblitz.io/products/1`のようになります。

1. 製品名をクリックしてルーターをテストします。 このアプリには、現在"product-details works!"と常に表示されている製品詳細コンポーネントが表示されます。

    プレビューウィンドウのURLが変わることに注意してください。 最後のセグメントは `products/#`で、`#`にはあなたがクリックしたルートの数字です。

    <div class="lightbox">
      <img src="generated/images/guide/start/product-details-works.png" alt="Product details view with updated URL">
    </div>



## ルーティング情報を使う

商品詳細コンポーネントは、各商品の表示を処理します。 Angularルーターは、ブラウザのURLと定義済みのルーティングに基づいてコンポーネントを表示します。 このセクションでは、Angular Routerを使用して`products` データとルート情報を組み合わせて、各製品の特定の詳細を表示する方法を示します。

1. `product-details.component.ts`を開きます

1. 外部ファイルから製品データを使用するようにします。

    1. `@angular/router`パッケージから`ActivatedRoute`をインポートし、`../products`から`products`配列をインポートします。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="imports">
        </code-example>

    1. `product`プロパティを定義し、さらにコンストラクターの括弧内に引数として追加することで、コンストラクターに`ActivatedRoute`を注入します。

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="props-methods">
        </code-example>

        `ActivatedRoute`は、Angular Routerがロードする各ルーティングコンポーネントごとに固有です。
        ルーティング、そのパラメータ、およびそのルーティングに関連する追加データに関する情報が含まれています。

        `ActivatedRoute` を注入することで、サービスを使用するようにコンポーネントを設定しています。[データの管理](start/start-data "Try it: Managing Data") ページでサービスの詳細を説明しています。


1. `ngOnInit()`メソッドで、ルーティングパラメータをサブスクライブし、`productId`に基づいて製品を取得します。

    <code-example path="getting-started/src/app/product-details/product-details.component.1.ts" header="src/app/product-details/product-details.component.ts" region="get-product">
    </code-example>

    ルートパラメータは、ルートで定義するパス変数に対応します。ルートに一致するURLは、`productId`を提供します。 Angularは `productId`を使用して、それぞれ固有の製品の詳細を表示します。

1. テンプレートを更新して、`*ngIf`内に製品の詳細情報を表示します。

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html" region="details">
    </code-example>

商品リストコンポーネントを商品詳細コンポーネントと入れ替えて、商品詳細を表示するようになりました。

<div class="lightbox">
  <img src="generated/images/guide/start/product-details-routed.png" alt="Product details page with updated URL and full details displayed">
</div>



<div class="alert is-helpful">

Angularルーターについての詳細は[ルーティングと画面遷移](guide/router "ルーティングと画面遷移ガイド")をご覧ください。

</div>


## 次のステップ

おめでとうございます！ あなたはオンラインストアにルーティングを統合しました。

* 商品は商品一覧ビューから個々の商品にリンクされています
* ユーザーはリストから製品名をクリックして、別のURL（ルーティング）を使用して新しいビューに詳細を表示できます。

Angularの探索を続けるには、次のいずれかのオプションを選択してください。
* ["データの管理"セクションに進む](start/start-data "Try it: Managing Data")ことで、ショッピングデータ機能を追加します。 サービスを使用してカートデータを管理し、HTTPを使用して出荷価格の外部データを取得します。
* [先に"デプロイ"セクションに進む](start/start-deployment "Try it: Deployment")ことで、ローカル開発に移動するか、アプリをFirebaseまたは独自のサーバーにデプロイします。
