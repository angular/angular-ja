# フィーチャーモジュールの遅延ロード

## 大まかな概要

デフォルトでは、NgModuleは積極的にロードされます。つまり、アプリがロードされるとすぐに、すぐに必要であるかどうかにかかわらず、すべてのNgModuleがロードされます。多数のルートをもつ大規模なアプリケーションの場合は、遅延ロード（必要に応じてNgModuleをロードする設計パターン）を検討してください。
遅延ロードは、初期バンドルサイズを小さくするのに役立ちます。これにより、ロード時間が短縮されます。

このページで説明している、2つの遅延ロードされたモジュールの最終的なサンプルについては
<live-example></live-example>を参照してください。

遅延ロードするフィーチャーモジュールをセットアップするための主なステップが3つあります:

1. フィーチャーモジュールを作成する
1. フィーチャーモジュールのルーティングモジュールを作成する
1. ルート(route)を設定する

## アプリケーションをセットアップする

まだアプリケーションがない場合、CLIでアプリケーションを作成するために次のステップにしたがってください。
すでに作成している場合は[ルート(route)を設定する](#config-routes)に進んでください。
次のコマンドを実行してください。
ここでの`customer-app`はアプリケーション名です。

```sh
ng new customer-app --routing
```

これにより、`customer-app`というアプリケーションが作成され、さらに`--routing`フラグによって
`app-routing.module.ts`というファイルが生成されます。
このファイルはフィーチャーモジュールの遅延ロードをセットアップするために必要なファイルの1つです。
コマンド`cd customer-app`を実行してプロジェクトに移動してください。

## ルーティングをもつフィーチャーモジュールを作成する

次に、ルーティングするためのフィーチャーモジュールが必要になります。
作成するために、ターミナルで次のコマンドを実行してください。`customers`はモジュール名です:

```sh
ng generate module customers --routing
```

これにより、内部に2つのファイル(`CustomersModule`と`CustomersRoutingModule`)をもつcustomersフォルダが作成されます。
`CustomersModule`はcustomersに関係するもののゲートキーパーとして機能します。
`CustomersRoutingModule`はcustomers関連のルーティングを処理します。
これにより、アプリケーションが成長しても構造が整理された状態を保ち、
ルーティングをそのまま維持しながらこのモジュールを再利用できるようになります。

CLIは、ファイルの先頭にJavaScriptのインポート文を追加し、
`@NgModule`の`imports`配列に`CustomersRoutingModule`を追加することによって
`CustomersRoutingModule`を`CustomersModule`にインポートします。

## フィーチャーモジュールにコンポーネントを追加する

モジュールがブラウザに遅延ロードされていることを確認するために、アプリケーションが`CustomersModule`を読み込むときにHTMLをレンダリングするコンポーネントを作成しましょう。コマンドラインで次のように入力してください:

```sh
ng generate component customers/customer-list
```

これにより、`customers`フォルダ内に、コンポーネントを構成する4つのファイルをもつ`customer-list`という名前のフォルダが作成されます。

ルーティングモジュールと同様に、
CLIは`CustomersListComponent`を`CustomersModule`にインポートします。


## もう1つのフィーチャーモジュールを追加する

もう1つの場所にルート(route)を追加するために、ルーティング設定をもつ2つ目のフィーチャモジュールを作成してみましょう:

```sh
ng generate module orders --routing
```

これにより、`OrdersModule`と`OrdersRoutingModule`をもつ`orders`という名前の新しいフォルダが作成されます。

さあ、`CustomersModule`と同様にコンテンツを作成しましょう:

```sh
ng generate component orders/order-list
```

## UIをセットアップする

アドレスバーにURLを入力してページを表示することもできますが、
ナビゲーションするほうがほとんどのユーザーにとっては簡単です。
`app.component.html`のデフォルトのプレースホルダーマークアップをカスタムナビゲーションに置き換えて、
ブラウザ内でモジュールに簡単にナビゲートすることができるようにしてみましょう:


<code-example path="lazy-loading-ngmodules/src/app/app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>



今まであなたが作成したアプリをブラウザで確認するために、ターミナルで次のコマンドを入力してください:

```sh
ng serve
```

そのあとに`localhost:4200`にアクセスしてみましょう。"app works!"という文字列と3つのボタンが表示されているはずです。

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="three buttons in the browser">
</figure>


ボタンを機能させるには、ルーティングモジュールを設定する必要があります。

{@a config-routes}

## ルート(route)を設定する

`OrdersModule`と`CustomersModule`の2つのフィーチャモジュールは、
ルーターがそれを認識するために`AppRoutingModule`に紐づけてられていなければなりません。構造は次のようになります:

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/lazy-load-relationship.jpg" width="400" alt="lazy loaded modules diagram">
</figure>


各フィーチャーモジュールは、ルーター経由で出入り口として機能します。`AppRoutingModule`では、フィーチャーモジュールへのルート(route)を設定します(このケースでは、`OrdersModule`と`CustomersModule`です)。これによって、ルーターはフィーチャーモジュールへ移動する方法を知ることができます。次に、フィーチャーモジュールは`AppRoutingModule`を`CustomersRoutingModule`や`OrdersRoutingModule`に接続します。それらのルーティングモジュールは、関連するコンポーネントをどこにロードするのかをルーターに教えます。

### アプリケーションレベルのルート(route)

`AppRoutingModule`内の`routes`配列を次のように更新してください:


<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>


インポート文は同じままです。最初の2つのパスでそれぞれ`CustomersModule`と`OrdersModule`へのルート(route)を指定しています。遅延ロードの構文では`loadChildren`に続けてブラウザの組み込みの `import('...')` 構文を使った関数を指定することに注意してください。インポートパスはそのモジュールへの相対パスです。

### フィーチャーモジュールの内部

次に、`customers.module.ts`を見てください。もしあなたがCLIを使用していて、このページに記載されている手順にしたがっている場合は、ここで何もする必要はありません。フィーチャーモジュールは、`AppRoutingModule`とフィーチャールーティングモジュール間のコネクターのようなものになります。`AppRoutingModule`が`CustomersModule`をインポートして、順に`CustomersModule`が`CustomersRoutingModule`をインポートします。


<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>



`customers.module.ts`ファイルでは、`CustomersModule`クラスが`CustomersRoutingModule`と`CustomerListComponent`にアクセスできるようにそれらをインポートします。そのあとに、`CustomersModule`が自分自身のルーティングモジュールにアクセスするために`@NgModule`の`imports`配列に`CustomersRoutingModule`を追加します。そして、`CustomerListComponent`は`declarations`配列に配置されます。これは`CustomerListComponent`が`CustomersModule`に属することを意味します。


### フィーチャーモジュールのルート(route)を設定する

次のステップでは`customers-routing.module.ts`を更新します。まず、JavaScriptのインポート文を使用して、ファイルの先頭にコンポーネントをインポートしてください。そのあとに、`CustomerListComponent`へのルート(route)を追加してください。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>


`path`に空文字列が設定されていることに注意してください。これは、`AppRoutingModule`内のパスがすでに`customers`に設定されているからです。つまり、この`CustomersRoutingModule`内のルート(route)はすでに`customers`コンテキスト内にあります。このルーティングモジュール内のすべてのルート(route)は、子ルートとなります。

`orders-routing.module.ts`でも`OrdersListComponent`をインポートし、Routes配列を設定するこの最終ステップを繰り返してください:

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)"></code-example>

さて、ブラウザでアプリケーションを表示すると、3つのボタンがあなたを個々のモジュールに連れて行ってくれます。

## 動作の確認をする

モジュールが実際に遅延ロードされていることをChromeの開発者ツールで確認することができます。Macの場合は`Cmd+Option+i`、PCの場合は`Ctrl+Alt+i`を押して開発者ツールを開き、ネットワークタブに移動してください。

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600" alt="lazy loaded modules diagram">
</figure>


OrdersまたはCustomersボタンをクリックしてください。もしチャンクが表示されていたら、すべてが適切に接続され、フィーチャーモジュールが遅延ロードされているということです。チャンクはOrdersとCustomersに対応して表示されますが、それぞれ1回のみ表示されます。


<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600" alt="lazy loaded modules diagram">
</figure>


もう一度見たり、プロジェクトで作業した後にテストするには、ネットワークタブの左上にある斜線がついた丸をクリックして、すべてをクリアしてください:

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200" alt="lazy loaded modules diagram">
</figure>


そのあとでプラットフォームに応じて、`Cmd+r`または`Ctrl+r`でリロードしてください。

## `forRoot()`と`forChild()`

あなたはCLIが`RouterModule.forRoot(routes)`を`app-routing.module.ts`の`imports`配列に追加したことに気づいたかもしれません。
これは、Angularにこのモジュールが`AppRoutingModule`はルーティングモジュールであること、
`forRoot()`によってこれがルート(root)のルーティングモジュールであることを知らせます。これは渡したすべてのルート(route)を設定します。
ルーターディレクティブへアクセスできるようにしたり、`RouterService`を登録します。
`forRoot()`は`AppRoutingModule`、つまりアプリケーション内のルート(root)レベルで1回だけ使用してください。

CLIは、フィーチャールーティングモジュールにも`RouterModule.forChild(routes)`を追加します。
これにより、Angularはルート(route)リストが提供された追加のルート(route)をのみに責任をもつことと、フィーチャーモジュールを対象としていることを知ります。`forChild()`は複数のモジュールで使用することができます。

`forRoot()`にはグローバルなインジェクター設定が含まれています。たとえば、Routerの設定などを行います。`forChild()`はインジェクター設定を持たず、`RouterOutlet`や`RouterLink`のようなディレクティブを持ちます。

詳しくは、 [シングルトンサービス](guide/singleton-services) ガイドの中の [`forRoot()` パターン](guide/singleton-services#forRoot) セクションを参照してください。

<hr>

## NgModuleとルーティングの詳細

あなたはこちらにも興味があるかもしれません:
* [ルーティングとナビゲーション](guide/router)
* [プロバイダー](guide/providers)
* [フィーチャーモジュールの種類](guide/module-types)
* [Route-level code-splitting in Angular](https://web.dev/route-level-code-splitting-in-angular/)
* [Route preloading strategies in Angular](https://web.dev/route-preloading-in-angular/)
