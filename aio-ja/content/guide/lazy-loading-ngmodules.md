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
To make one, enter the following command in the terminal, where `customers` is the name of the feature module, and `customer-list` is the route path for loading the `customers` component:

<code-example language="bash">
ng generate module customers --route customer-list --module app.module
</code-example>

This creates a `customers` folder with the new lazy-loadable module `CustomersModule` defined in the file `customers.module.ts`. The command automatically adds the `CustomerComponent` to the new feature module.

Because the new module is meant to be lazy-loaded, the command does NOT add a reference for the new feature module to the root application's module file, `app.module.ts`.
Instead, it adds the declared route, `customer-list` to the `Routes` array declared in the module provided as the `--module` option.

<code-example language="typescript" header="src/app/app-routing.module.ts">
const routes: Routes = [
    { path: 'customer-list',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) }
    ];
</code-example>

Notice that the lazy-loading syntax uses `loadChildren` followed by a function that uses the browser's built-in `import('...')` syntax for dynamic imports.
The import path is the relative path to the module.

### もう1つのフィーチャーモジュールを追加する

Use the same command to create a second lazy-loaded feature module with routing, along with its stub component.

<code-example language="bash">
ng generate module orders --route order-list --module app.module
</code-example>

This creates a new folder called `orders` containing an `OrdersModule` and `OrdersRoutingModule`, along with the new `OrderComponent` source files.
The `order-list` route is added to the `Routes` array in `app-routing.module.ts`, using the lazy-loading syntax.

<code-example language="typescript" header="src/app/app-routing.module.ts">
const routes: Routes = [
    { path: 'customer-list',
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
    { path: 'order-list',
      loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) }
    ];
</code-example>

## UIをセットアップする

アドレスバーにURLを入力してページを表示することもできますが、ナビゲーションするほうがほとんどのユーザーにとっては簡単です。
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

These buttons work, because the CLI automatically added the routes to the feature modules to the `routes` array in `app.module.ts`.

{@a config-routes}

## Imports and route configuration

The CLI automatically added each feature module to the routes map at the application level.
Finish this off by adding the default route.

`AppRoutingModule`内の`routes`配列を次のように更新してください:

<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>

The first two paths are the routes to the `CustomersModule` and the `OrdersModule`.
The final entry defines a default route. The empty path matches everything that doesn't match an earlier path.

### フィーチャーモジュールの内部

次に、`customers.module.ts`を見てください。もしあなたがCLIを使用していて、このページに記載されている手順にしたがっている場合は、ここで何もする必要はありません。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>

`customers.module.ts`ファイルでは、`CustomersModule`クラスが`CustomersRoutingModule`と`CustomerListComponent`にアクセスできるようにそれらをインポートします。そのあとに、`CustomersModule`が自分自身のルーティングモジュールにアクセスするために`@NgModule`の`imports`配列に`CustomersRoutingModule`を追加します。そして、`CustomerListComponent`は`declarations`配列に配置されます。これは`CustomerListComponent`が`CustomersModule`に属することを意味します。


The feature module has its own routing module, `customers-routing.module.ts`. The `AppRoutingModule` imports the feature module, `CustomersModule`, and `CustomersModule` in turn imports the `CustomersRoutingModule`.

The feature-specific routing module imports its own feature component, `CustomerListComponent`, along with the other JavaScript import statements. It also adds the route to its own component.

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>

`path`に空文字列が設定されていることに注意してください。これは、`AppRoutingModule`内のパスがすでに`customers`に設定されているからです。つまり、この`CustomersRoutingModule`内のルート(route)はすでに`customers`コンテキスト内にあります。このルーティングモジュール内のすべてのルート(route)は、子ルートとなります。

The other feature module's routing module is configured similarly.

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

`forRoot()`にはグローバルなインジェクター設定が含まれています。たとえば、Routerの設定などを行います。
`forChild()`はインジェクター設定を持たず、`RouterOutlet`や`RouterLink`のようなディレクティブを持ちます。
詳しくは、 [シングルトンサービス](guide/singleton-services) ガイドの中の [`forRoot()` パターン](guide/singleton-services#forRoot) セクションを参照してください。

<hr>

## NgModuleとルーティングの詳細

あなたはこちらにも興味があるかもしれません:
* [ルーティングとナビゲーション](guide/router)
* [プロバイダー](guide/providers)
* [フィーチャーモジュールの種類](guide/module-types)
* [Route-level code-splitting in Angular](https://web.dev/route-level-code-splitting-in-angular/)
* [Route preloading strategies in Angular](https://web.dev/route-preloading-in-angular/)
