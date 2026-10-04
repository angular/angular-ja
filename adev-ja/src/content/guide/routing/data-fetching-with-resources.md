# リソースを使用したデータ取得

Angularルーターは、`resources`ルート設定を通じてAngularシグナルと統合します。これにより、`Resource`APIを使用してリアクティブにデータを取得できます。

## ルートリソースを使用する理由 {#why-use-route-resources}

ルートリソースは、従来の[データリゾルバ](/guide/routing/data-resolvers)に比べていくつかの利点を提供します:

- **並列実行**: 一致したすべてのルートにわたるルートリソースは、1ルートずつ順番にではなく同時に読み込まれます。
- **ノンブロッキングなデータ読み込み**: `nonBlocking()`を使用してルートを即座にアクティブ化し、バックグラウンドでデータを読み込んでいる間にローディングスケルトンやUI状態をレンダリングします。
- **再ナビゲーションなしの再読み込み**: 個々のリソースで`.reload()`を呼び出すか、シグナルパラメーターを更新することで、ガードを再実行したりルートを再マッチングしたりすることなくデータを更新します。
- **リアクティブなデータ取得**: リソースはAngularシグナルと直接統合されており、シグナルの依存関係が変更されたときに自動的に再評価され、`isLoading()`や`error()`のようなリアクティブなステータスシグナルを公開します。

## ルートリソースの有効化 {#enabling-route-resources}

ルートリソースを有効にするには、ルーター設定に`withRouterResources()`を提供します:

```ts
import {provideRouter, withComponentInputBinding, withRouterResources} from '@angular/router';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding(), withRouterResources())],
});
```

TIP: ルーターが解決されたリソースをコンポーネントの入力に直接バインドできるように、`withComponentInputBinding()`を有効にします。

## ルートリソースの定義 {#defining-route-resources}

ルート上のリソースは`resources`関数を使用して定義します。この関数は注入コンテキストで実行されるため、`inject()`を使用してルート定義内で直接サービス、APIクライアント、またはストアにアクセスできます。

```angular-ts
import {Component, inject, input, resource} from '@angular/core';
import {Routes} from '@angular/router';
import {UserService} from './user.service';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const userService = inject(UserService);
      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: ({params: id}) => userService.getUser(id),
        }),
      };
    },
  },
];

@Component({
  template: `<p>User: {{ user().name }}</p>`,
})
export class UserProfile {
  // The router binds only the value for blocking resources.
  user = input.required<User>();
}
```

### `ResourceContext`オブジェクト {#the-resourcecontext-object}

`resources`関数は、リアクティブなルートシグナル(`params`、`queryParams`、`fragment`、および`data`)へのアクセスを提供する`ResourceContext`を受け取ります。

### サポートされているリソースの実装 {#supported-resource-implementations}

`resources`関数は、`resource()`、`rxResource()`、またはカスタムリソースなど、任意のAngularの`Resource`実装を返すことができます。

```ts
import {Routes} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => ({
      user: rxResource({
        params: () => ctx.params()['id'],
        stream: ({params: id}) => fetchUserObservable(id),
      }),
    }),
  },
];
```

NOTE: `rxResource`は`loader`の代わりに`stream`プロパティを使用して、Observableを返す関数を受け取ります。

リソースを構成する前に非同期セットアップや動的インポートを実行する必要がある場合、`resources`関数を`async`にして`Promise`を返すこともできます。

```ts
resources: async (ctx) => {
  const {fetchUserData} = await import('./user-api');
  return {
    user: resource({
      params: () => ctx.params()['id'],
      loader: ({params: id}) => fetchUserData(id),
    }),
  };
},
```

## シグナルによるきめ細かい変更追跡 {#fine-grained-change-tracking-with-signals}

リソースは、その`params`関数が読み取るシグナルを追跡します。その値が変更されたときにのみリソースが再フェッチされるように、必要な正確な値を読み取ってください:

```ts
resources: (ctx) => ({
  products: resource({
    // Tracks only the 'category' query parameter
    params: () => ctx.queryParams()['category'],
    loader: ({params: category}) => fetchProducts(category),
  }),
}),
```

`?sort=desc`や`?page=2`などの無関係なクエリパラメーターを変更するナビゲーションでは、`category`は変更されないため、リソースは再フェッチされません。

TIP: `ctx.params()`のようにパラメーターオブジェクト全体を返すのではなく、`ctx.params()['id']`のような特定のプロパティを読み取ってください。ルーターはナビゲーションごとに新しいオブジェクトを作成するため、オブジェクト全体を返すと、個々の値が変更されていなくてもリソースが再フェッチされます。

## 並列実行 {#parallel-execution}

データリゾルバは親ルートから子ルートへ順次実行されます。親ルートのリゾルバに200ms、子ルートのリゾルバに300msかかる場合、ナビゲーションは500msブロックされます。

一致したすべてのルートのルートリソースは並行して実行されるため、同じナビゲーションは最も遅いリソースの時間である300msで完了します。

## ブロッキングリソースとノンブロッキングリソース {#blocking-and-non-blocking-resources}

デフォルトでは、`resources`から返されるすべてのリソースはブロッキングです。ルーターはデータが完全に読み込まれるまで待機してから、ルートとコンポーネントをアクティブにします。

ブロッキングリソースの場合、ルーターは解決された値をコンポーネントの入力にバインドするため、入力の型は`Resource<T>`ではなく`T`になります。ルーターはリソースが読み込まれるまでナビゲーションをブロックするため、コンポーネントが`loading`状態を監視することはなく、リソースがエラーになった場合はルーターがナビゲーションをキャンセルするため、`error`状態を監視することもありません。

代わりにUIで読み込み状態を処理するには、リソースを`nonBlocking()`でラップします。ルーターはコンポーネントを即座にアクティブにし、完全な`Resource<T>`オブジェクトをコンポーネントの入力にバインドします。これにより、`isLoading()`、`error()`、およびその他のリソースシグナルにアクセスできるようになります。

```angular-ts
import {Component, input, Resource, resource} from '@angular/core';
import {Routes, nonBlocking} from '@angular/router';

const routes: Routes = [
  {
    path: 'reports',
    component: Reports,
    resources: () => ({
      reportData: nonBlocking(
        resource({
          loader: () => fetchHeavyReportData(),
        }),
      ),
    }),
  },
];

@Component({
  template: `
    @if (reportData().isLoading()) {
      <p>Loading...</p>
    } @else if (reportData().error()) {
      <p>Error loading report.</p>
    } @else if (reportData().hasValue()) {
      <report-view [data]="reportData().value()" />
    }
  `,
})
export class Reports {
  reportData = input.required<Resource<ReportData>>();
}
```

NOTE: ブロッキングリソースがエラーになった場合、ルーターはナビゲーションをキャンセルし、`NavigationError`イベントを発行します。`nonBlocking()`でラップされたリソースはナビゲーションを完了し、その`error()`シグナルを通じて失敗を公開します。

### リソースからのリダイレクト {#redirecting-from-a-resource}

ブロッキングリソースがユーザーをリダイレクトする必要がある場合（例えば、アイテムが見つからない場合など）、リソースローダー内で`RedirectCommand`をスローします。ルーターは現在のナビゲーションをキャンセルし、指定されたURLにリダイレクトします:

```ts
import {inject, resource} from '@angular/core';
import {RedirectCommand, Router, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const router = inject(Router);

      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: async ({params: id}) => {
            const user = await fetchUser(id);
            if (!user) {
              throw new RedirectCommand(router.parseUrl('/not-found'));
            }
            return user;
          },
        }),
      };
    },
  },
];
```

## 再ナビゲーションなしでのリソースの再読み込み {#reloading-resources-without-renavigation}

データリゾルバを使用する場合、データの再取得にはルートナビゲーション（例えば、`onSameUrlNavigation: 'reload'`を使用したナビゲーション）が必要であり、これによりルートの再マッチングとガードおよびリゾルバの再実行が行われます。

ルートリソースは、その場でデータを更新するための2つの方法をサポートしています:

1. **プログラムによる再読み込み**: `Resource`インスタンスで`.reload()`を呼び出します。
2. **リアクティブな再読み込み**: アプリケーションのフィルターや状態シグナルなど、リソースの`params`関数が読み取るシグナルを更新することで、ローダーを再実行します。

ルーターはブロッキングリソースの値のみをコンポーネントの入力にバインドするため、`.reload()`を呼び出したりステータスシグナルを検査したりする必要がある場合は、`ActivatedRoute`または`ActivatedRouteSnapshot`から`Resource`インスタンスを読み取ります:

```angular-ts
import {Component, inject, input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <p>User: {{ user().name }}</p>
    <button (click)="refreshUser()">Refresh</button>
  `,
})
export class UserProfile {
  user = input.required<User>();
  private userResource = inject(ActivatedRoute).resources?.['user'];

  refreshUser() {
    // Reloads only this specific resource without renavigating the route
    this.userResource?.reload();
  }
}
```

## 保留中のナビゲーション時の過渡的状態 {#transitional-states-during-pending-navigations}

ナビゲーションが保留中の間、ルーターは`ActivatedRoute`で公開するリソースをフリーズし、中間の`loading`および`reloading`状態を隠蔽します。

`/user/1`から`/user/2`へナビゲートし、ルーターが`UserProfile`コンポーネントを再利用する場合、コンポーネントは`/user/2`が解決されるまで`/user/1`のデータをレンダリングし続けます。その後、ルーターはリソースのフリーズを解除し、UIは読み込み中のちらつきなしに新しいデータへ直接遷移します。

ルーターは、`resources`関数が`resource()`のような書き込み可能なリソースを返す場合でも、これらのリソースを読み取り専用として公開します。リソースのシグナルを読み取って`reload()`を呼び出すことはできますが、`set()`や`update()`は呼び出せません。アクティブなナビゲーション中やロールバック回復中の`reload()`呼び出しは、ルーターの遷移トラッキングを中断できないように`false`を返します。

### キャンセル時のロールバック回復 {#rollback-recovery-on-cancellation}

ナビゲーションが（例えばガードによって）キャンセルされた場合、ルーターは状態ツリーを前の状態に戻します。この復元により、ルートパラメーターなどのリソースのシグナル依存関係が前の値に戻る可能性があります。

パラメーターが元に戻ったため、リソースは古いパラメーターのデータを取得するために新しい読み込みを自動的に開始する場合があります。すでに表示されていたデータの読み込み状態がちらつくのを防ぐため、ルーターはリソースが復元された状態で安定するまで、UIに以前のリソーススナップショットを保持します。

TIP: リソースローダーによって提供される`abortSignal`を非同期呼び出し（`fetch`など）に転送してください。ルーターがパラメーターをロールバックしたり、ナビゲーションを置き換えたりすると、保留中のリクエストは適切に中止されます: `loader: ({params: id, abortSignal}) => fetchUser(id, {signal: abortSignal})`。
