# フィーチャーモジュールの遅延ロード

デフォルトでは、NgModuleは即時にロードされます。つまり、アプリがロードされるとすぐに、すぐに必要であるかどうかにかかわらず、すべてのNgModuleがロードされます。多数のルートをもつ大規模なアプリケーションの場合は、遅延ロード（必要に応じてNgModuleをロードする設計パターン）を検討してください。
遅延ロードは、初期バンドルサイズを小さく保つのに役立ち、これによりロード時間が短縮されます。

<div class="alert is-helpful">

このページで説明する2つの遅延ロードされたモジュールをもつ最終的なサンプルについては
<live-example></live-example>を参照してください。

</div>

{@a lazy-loading}

## Lazy loading basics

This section introduces the basic procedure for configuring a lazy-loaded route.
For a step-by-step example, see the [step-by-step setup](#step-by-step) section on this page.

To lazy load Angular modules, use `loadchildren` (instead of `component`) in your `AppRoutingModule` `routes` configuration as follows.

<code-example header="AppRoutingModule (excerpt)">

const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
  }
];

</code-example>

In the lazy-loaded module's routing module, add a route for the component.

<code-example header="Routing module for lazy loaded module (excerpt)">

const routes: Routes = [
  {
    path: '',
    component: ItemsComponent
  }
];

</code-example>

Also be sure to remove the `ItemsModule` from the `AppModule`.
For step-by-step instructions on lazy loading modules, continue with the following sections of this page.

{@a step-by-step}

## Step-by-step setup

遅延ロードするフィーチャーモジュールをセットアップするための主なステップが2つあります:

1. CLIで `--route` フラグを使ってフィーチャーモジュールを作成する
1. ルート(route)を設定する

### アプリケーションをセットアップする

まだアプリケーションを作成していない場合、次のステップにしたがってCLIを使用してアプリケーションを作成してください。
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

<div class="alert is-helpful">

`--routing`オプションはAngular/CLI 8.1以上で有効です。
[プロジェクトの更新](guide/updating)を参照してください。

</div>

### ルーティングをもつフィーチャーモジュールを作成する

次に、ルーティングするためのコンポーネントとフィーチャーモジュールが必要になります。
作成するために、ターミナルで次のコマンドを実行してください。`customers`はフィーチャーモジュールの名前です。`customers`フィーチャーモジュールをロードするパスもまた`--route`オプションを使用して`customers`に指定します。

<code-example language="bash">
ng generate module customers --route customers --module app.module
</code-example>

これにより、`customers.module.ts`ファイルで定義された新しい遅延ロード可能なモジュール`CustomersModule`をもつ、`customers`フォルダーが作成されます。コマンドは`CustomersComponent`を新しいフィーチャーモジュール内に自動的に宣言します。

新しいモジュールは遅延ロードされることを意図しているため、コマンドは新しいフィーチャーモジュールへの参照をルートアプリケーションモジュールの`app.module.ts`ファイルに追加「しません」。
代わりに、`--module`オプションで指定したモジュール内の`routes`配列に、宣言したルート(route)`customers`を追加します。

<code-example
  header="src/app/app-routing.module.ts"
  path="lazy-loading-ngmodules/src/app/app-routing.module.ts"
  region="routes-customers">
</code-example>

遅延ロード構文では、関数が後ろに続く`loadChildren`を使うことに注目してください。関数はブラウザ組み込みの動的インポート用の`import('...')`構文を用います。
インポートのパスはそのモジュールへの相対パスです。

#### もう1つのフィーチャーモジュールを追加する

同じコマンドを使って、2つ目の遅延ロードのフィーチャーモジュールとルーティングとそのスタブコンポーネントを作成します。

<code-example language="bash">
ng generate module orders --route orders --module app.module
</code-example>

これにより、`OrdersModule`と`OrdersRoutingModule`と、新しい`OrdersComponent`ソースファイルが含まれる、`orders`という新しいフォルダーが作成されます。
`--routes`オプションを使用して指定した`orders`ルート(route)は、遅延ロード構文を使用して`app-routing.module.ts`ファイル内の`routes`配列に追加されます。

<code-example
  header="src/app/app-routing.module.ts"
  path="lazy-loading-ngmodules/src/app/app-routing.module.ts"
  region="routes-customers-orders">
</code-example>

### UIをセットアップする

アドレスバーにURLを入力することもできますが、ナビゲーションUIのほうがユーザーにとって簡単でより一般的です。
`app.component.html`のデフォルトのプレースホルダーマークアップをカスタムナビゲーションに置き換えて、
ブラウザ内でモジュールに簡単にナビゲートすることができるようにしてみましょう:

<code-example path="lazy-loading-ngmodules/src/app/app.component.html" header="app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>

今まであなたが作成したアプリをブラウザで確認するために、ターミナルで次のコマンドを入力してください:

<code-example language="bash">
ng serve
</code-example>

そのあとに`localhost:4200`にアクセスしてみましょう。“customer-app” という文字列と3つのボタンが表示されているはずです。

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="three buttons in the browser">
</div>

これらのボタンは機能します。なぜならCLIが、フィーチャーモジュールへのルート(route)を`app.module.ts`内の`routes`配列に自動的に追加したからです。

{@a config-routes}

### インポートとルート(route)設定

CLIは各フィーチャーモジュールをアプリケーションレベルでのルート(route)マップへ自動的に追加します。
デフォルトのルート(route)を追加してこれを完成させましょう。`app-routing.module.ts`ファイル内の`routes`配列を次のように更新してください:

<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>

最初の2つのパスは`CustomersModule`と`OrdersModule`へのルート(route)です。
最後のエントリーはデフォルトのルート(route)です。空のパスは、それまでのパスにマッチしないものすべてにマッチします。


### フィーチャーモジュールの内部

次に、`customers.module.ts`ファイルを見てください。もしあなたがCLIを使用していて、このページに記載されている手順にしたがっている場合は、ここで何もする必要はありません。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>

`customers.module.ts`ファイルでは、`customers-routing.module.ts`と`customers.component.ts`をインポートします。`CustomersModule`が自分自身のルーティングモジュールにアクセスするために`@NgModule`の`imports`配列に`CustomersRoutingModule`を追加します。そして、`CustomersComponent`は`declarations`配列に配置されます。これは`CustomersComponent`が`CustomersModule`に属することを意味します。


次に、`app-routing.module.ts`はフィーチャーモジュール`customers.module.ts`をJavaScriptの動的インポートを使用してインポートします。

フィーチャー固有のルート定義ファイル`customers-routing.module.ts`はJavaScriptのインポート文を使用して、`customers.component.ts`内で定義された自身のフィーチャーコンポーネントをインポートします。それから`CustomersComponent`に空のパスをマップします。

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>

`AppRoutingModule`内のパスがすでに`customers`に設定されているため、ここの`path`には空文字列が設定されています。つまり、この`CustomersRoutingModule`内のルート(route)はすでに`customers`コンテキスト内にあります。このルーティングモジュール内のすべてのルート(route)は、子ルートとなります。

他のフィーチャーモジュールがもつルーティングモジュールも同様に設定されます。

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" id="orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)"></code-example>

### 動作の確認をする

モジュールが実際に遅延ロードされていることをChromeの開発者ツールで確認することができます。Macの場合は`Cmd+Option+i`、PCの場合は`Ctrl+Shift+j`を押して開発者ツールを開き、ネットワークタブに移動してください。

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600" alt="lazy loaded modules diagram">
</div>


OrdersまたはCustomersボタンをクリックしてください。もしチャンクが表示されていたら、すべてが適切に接続され、フィーチャーモジュールが遅延ロードされているということです。チャンクはOrdersとCustomersに対応して表示されますが、それぞれ1回のみ表示されます。


<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600" alt="lazy loaded modules diagram">
</div>


もう一度見たり、プロジェクトで作業した後にテストするには、ネットワークタブの左上にある斜線がついた丸をクリックして、すべてをクリアしてください:

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200" alt="lazy loaded modules diagram">
</div>


そのあとでプラットフォームに応じて、`Cmd+r`または`Ctrl+r`でリロードしてください。

## `forRoot()`と`forChild()`

あなたはCLIが`RouterModule.forRoot(routes)`を `AppRoutingModule` の`imports`配列に追加したことに気づいたかもしれません。これにより、Angularは`AppRoutingModule`がルーティングモジュールであることと、
`forRoot()`によってルート(root)のルーティングモジュールであることを認識します。これは渡したすべてのルート(route)を設定して、
ルーターディレクティブへアクセスできるようにし、`Router`サービスを登録します。
`forRoot()`は`AppRoutingModule`の中で、アプリケーション内で1回だけ使用してください。

CLIは、フィーチャールーティングモジュールにも`RouterModule.forChild(routes)`を追加します。
これにより、Angularはそのルート(route)リストが追加のルート(route)の提供のみに責任をもつことと、フィーチャーモジュールを対象としていることを認識します。
`forChild()`は複数のモジュールで使用することができます。

`forRoot()`メソッドはRouterのための*グローバルな*インジェクター設定を管理します。
`forChild()`メソッドはインジェクター設定を持ちません。それは`RouterOutlet`や`RouterLink`のようなディレクティブを使います。
詳しくは、 [シングルトンサービス](guide/singleton-services) ガイドの中の [`forRoot()` パターン](guide/singleton-services#forRoot) セクションを参照してください。

{@a preloading}

## Preloading

Preloading improves UX by loading parts of your app in the background.
You can preload modules or component data.

### Preloading modules

Preloading modules improves UX by loading parts of your app in the background so users don't have to wait for the elements to download when they activate a route.

To enable preloading of all lazy loaded modules, import the `PreloadAllModules` token from the Angular `router`.

<code-example header="AppRoutingModule (excerpt)">

import { PreloadAllModules } from '@angular/router';

</code-example>

Still in the `AppRoutingModule`, specify your preloading strategy in `forRoot()`.

<code-example header="AppRoutingModule (excerpt)">

RouterModule.forRoot(
  appRoutes,
  {
    preloadingStrategy: PreloadAllModules
  }
)

</code-example>

### Preloading component data

To preload component data, you can use a `resolver`.
Resolvers improve UX by blocking the page load until all necessary data is available to fully display the page.

#### Resolvers

Create a resolver service.
With the CLI, the command to generate a service is as follows:


<code-example language="none" class="code-shell">
  ng generate service <service-name>
</code-example>

In your service, import the following router members, implement `Resolve`, and inject the `Router` service:

<code-example header="Resolver service (excerpt)">

import { Resolve } from '@angular/router';

...

export class CrisisDetailResolverService implements Resolve<> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<> {
    // your logic goes here
  }
}

</code-example>

Import this resolver into your module's routing module.

<code-example header="Feature module's routing module (excerpt)">

import { YourResolverService }    from './your-resolver.service';

</code-example>

Add a `resolve` object to the component's `route` configuration.

<code-example header="Feature module's routing module (excerpt)">
{
  path: '/your-path',
  component: YourComponent,
  resolve: {
    crisis: YourResolverService
  }
}
</code-example>


In the component, use an `Observable` to get the data from the `ActivatedRoute`.


<code-example header="Component (excerpt)">
ngOnInit() {
  this.route.data
    .subscribe((your-parameters) => {
      // your data-specific code goes here
    });
}
</code-example>

For more information with a working example, see the [routing tutorial section on preloading](guide/router-tutorial-toh#preloading-background-loading-of-feature-areas).


<hr>

## NgModuleとルーティングの詳細

あなたはこちらにも興味があるかもしれません:
* [ルーティングとナビゲーション](guide/router)
* [プロバイダー](guide/providers)
* [フィーチャーモジュールの種類](guide/module-types)
* [Route-level code-splitting in Angular](https://web.dev/route-level-code-splitting-in-angular/)
* [Route preloading strategies in Angular](https://web.dev/route-preloading-in-angular/)
