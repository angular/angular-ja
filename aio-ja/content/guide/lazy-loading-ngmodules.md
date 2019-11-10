# フィーチャーモジュールの遅延ロード

## 大まかな概要

デフォルトでは、NgModuleは積極的にロードされます。つまり、アプリがロードされるとすぐに、すぐに必要であるかどうかにかかわらず、すべてのNgModuleがロードされます。多数のルートをもつ大規模なアプリケーションの場合は、遅延ロード（必要に応じてNgModuleをロードする設計パターン）を検討してください。
遅延ロードは、初期バンドルサイズを小さくするのに役立ちます。これにより、ロード時間が短縮されます。

このページで説明している、2つの遅延ロードされたモジュールの最終的なサンプルについては
<live-example></live-example>を参照してください。

遅延ロードするフィーチャーモジュールをセットアップするための主なステップが3つあります:

1. CLIで `--route` フラグを使ってフィーチャーモジュールを作成する
1. フィーチャーモジュールのコンポーネントを作成する
1. ルート(route)を設定する

## アプリケーションをセットアップする

まだアプリケーションがない場合、CLIでアプリケーションを作成するために次のステップにしたがってください。
すでに作成している場合は[ルート(route)を設定する](#config-routes)に進んでください。
次のコマンドを実行してください。
ここでの`customer-app`はアプリケーション名です。

<code-example language="bash">
ng new customer-app --routing
</code-example>

これにより、`customer-app`というアプリケーションが作成され、さらに`--routing`フラグによって
`app-routing.module.ts`というファイルが生成されます。
このファイルはフィーチャーモジュールの遅延ロードをセットアップするために必要なファイルの1つです。
コマンド`cd customer-app`を実行してプロジェクトに移動してください。

## ルーティングをもつフィーチャーモジュールを作成する

次に、ルーティングするためのコンポーネントとフィーチャーモジュールが必要になります。
作成するために、ターミナルで次のコマンドを実行してください。`customers`はフィーチャーモジュールの名前で、`customer-list`は`customers`コンポーネントをロードするためのルート(route)パスです。

<code-example language="bash">
ng generate module customers --route customer-list --module app.module
</code-example>

これにより、`customers.module.ts`ファイルで定義された新しい遅延ロードできるモジュール`CustomersModule`をもつ、`customers`フォルダーが作成されます。コマンドは`CustomerComponent`を新しいフィーチャーモジュールに自動的に追加します。

その新モジュールは遅延ロードされることになっているため、コマンドは新フィーチャーモジュールへの参照をルートアプリケーションモジュールのファイル`app.module.ts`に追加「しません」。
代わりに、宣言したルート(route)の`customer-list`を`Routes`配列に追加します。その配列は`--module`オプションにより提供されたモジュール内で宣言されます。

<code-example language="typescript" header="src/app/app-routing.module.ts">
const routes: Routes = [
    { path: 'customer-list',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) }
    ];
</code-example>

遅延ロードの構文では、関数が後ろに続く`loadChildren`を使うことに注目してください。関数はブラウザ組み込みの動的インポート用の`import('...')`構文を用います。
インポートのパスはそのモジュールへの相対パスです。

### もう1つのフィーチャーモジュールを追加する

同じコマンドを使って、2つ目の遅延ロードのフィーチャーモジュールとルーティングとそのコンポーネントを作成します。

<code-example language="bash">
ng generate module orders --route order-list --module app.module
</code-example>

これにより`orders`という新しいフォルダーが作成され、`OrdersModule`と`OrdersRoutingModule`と、新しい`OrderComponent`ソースファイルが含まれます。
`order-list`ルート(route)は、遅延ロードの構文を使って`app-routing.module.ts`内の`Routes`配列に追加されます。

<code-example language="typescript" header="src/app/app-routing.module.ts">
const routes: Routes = [
    { path: 'customer-list',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
    { path: 'order-list',
      loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) }
    ];
</code-example>

## UIをセットアップする

アドレスバーにURLを入力することもできますが、ナビゲーションUIのほうがユーザーにとって簡単でより一般的です。
`app.component.html`のデフォルトのプレースホルダーマークアップをカスタムナビゲーションに置き換えて、
ブラウザ内でモジュールに簡単にナビゲートすることができるようにしてみましょう:


<code-example path="lazy-loading-ngmodules/src/app/app.component.html" header="app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>


今まであなたが作成したアプリをブラウザで確認するために、ターミナルで次のコマンドを入力してください:

<code-example language="bash">
ng serve
</code-example>

そのあとに`localhost:4200`にアクセスしてみましょう。"app works!"という文字列と3つのボタンが表示されているはずです。

<figure>
 <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="three buttons in the browser">
</figure>

これらのボタンは機能します。なぜならCLIが、フィーチャーモジュールへのルート(route)を`app.module.ts`内の`routes`配列に自動的に追加するからです。

{@a config-routes}

## インポートとルート(route)設定

CLIは各フィーチャーモジュールをアプリケーションレベルでのルート(route)マップへ自動的に追加します。
デフォルトのルート(route)を追加してこれを完成させましょう。
`AppRoutingModule`内の`routes`配列を次のように更新してください:

<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>

最初の2つのパスは`CustomersModule`と`OrdersModule`へのルート(route)です。
最後のエントリーはデフォルトのルート(route)です。空のパスは、それまでのパスにマッチしないものすべてにマッチします。


### フィーチャーモジュールの内部

次に、`customers.module.ts`を見てください。もしあなたがCLIを使用していて、このページに記載されている手順にしたがっている場合は、ここで何もする必要はありません。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>

`customers.module.ts`ファイルでは、`CustomersModule`クラスが`CustomersRoutingModule`と`CustomerListComponent`にアクセスできるようにそれらをインポートします。そのあとに、`CustomersModule`が自分自身のルーティングモジュールにアクセスするために`@NgModule`の`imports`配列に`CustomersRoutingModule`を追加します。そして、`CustomerListComponent`は`declarations`配列に配置されます。これは`CustomerListComponent`が`CustomersModule`に属することを意味します。


そのフィーチャーモジュールは自身のルーティングモジュール`customers-routing.module.ts`を持っています。`AppRoutingModule`はフィーチャーモジュール`CustomersModule`をインポートして、今度は`CustomersModule`が`CustomersRoutingModule`をインポートします。

そのフィーチャーの固有のルーティングモジュールは、他のJavaScriptのインポート文とともに、自身のフィーチャーコンポーネント`CustomerListComponent`をインポートします。そのコンポーネントへのルート(route)も追加します。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>

`path`に空文字列が設定されていることに注意してください。これは、`AppRoutingModule`内のパスがすでに`customers`に設定されているからです。つまり、この`CustomersRoutingModule`内のルート(route)はすでに`customers`コンテキスト内にあります。このルーティングモジュール内のすべてのルート(route)は、子ルートとなります。

他のフィーチャーモジュールがもつルーティングモジュールは、同様に設定されます。

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" id="orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)"></code-example>

## 動作の確認をする

モジュールが実際に遅延ロードされていることをChromeの開発者ツールで確認することができます。Macの場合は`Cmd+Option+i`、PCの場合は`Ctrl+Shift+j`を押して開発者ツールを開き、ネットワークタブに移動してください。

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

あなたはCLIが`RouterModule.forRoot(routes)`を`app-routing.module.ts`の`imports`配列に追加したことに気づいたかもしれません。これはAngularに、このモジュール(`AppRoutingModule`)がルーティングモジュールであることと、
`forRoot()`によってこれがルート(root)のルーティングモジュールであることを知らせます。これは渡したすべてのルート(route)を設定します。
ルーターディレクティブへアクセスできるようにしたり、`RouterService`を登録します。
`forRoot()`は`AppRoutingModule`、つまりアプリケーション内のルート(root)レベルで1回だけ使用してください。

CLIは、フィーチャールーティングモジュールにも`RouterModule.forChild(routes)`を追加します。
これにより、Angularはそのルート(route)リストが追加のルート(route)の提供のみに責任をもつことと、フィーチャーモジュールを対象としていることを知ります。
`forChild()`は複数のモジュールで使用することができます。

`forRoot()`メソッドはRouterのための*グローバルな*インジェクター設定を扱います。
`forChild()`メソッドはインジェクター設定を持ちません。それは`RouterOutlet`や`RouterLink`のようなディレクティブを使います。
詳しくは、 [シングルトンサービス](guide/singleton-services) ガイドの中の [`forRoot()` パターン](guide/singleton-services#forRoot) セクションを参照してください。

<hr>

## NgModuleとルーティングの詳細

あなたはこちらにも興味があるかもしれません:
* [ルーティングとナビゲーション](guide/router)
* [プロバイダー](guide/providers)
* [フィーチャーモジュールの種類](guide/module-types)
* [Route-level code-splitting in Angular](https://web.dev/route-level-code-splitting-in-angular/)
* [Route preloading strategies in Angular](https://web.dev/route-preloading-in-angular/)
