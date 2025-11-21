# ルートの動作のカスタマイズ

Angularルーターは、アプリケーションでのルートの動作をカスタマイズできる強力な拡張ポイントを提供します。デフォルトのルーティング動作はほとんどのアプリケーションでうまく機能しますが、特定の要件では、パフォーマンスの最適化、特殊なURLハンドリング、または複雑なルーティングロジックのためにカスタム実装が必要になることがよくあります。

ルートのカスタマイズは、アプリケーションが以下を必要とする場合に価値を発揮します:

- データの再取得を避けるためのナビゲーション間での**コンポーネントの状態保持**
- ユーザーの行動やネットワークの状態に基づく**戦略的な遅延モジュール読み込み**
- **外部URLの統合**、またはレガシーシステムと並行したAngularルートの処理
- 単純なパスパターンを超えた実行時の条件に基づく**動的なルートマッチング**
  パターン

NOTE: カスタムストラテジーを実装する前に、デフォルトのルーターの動作がニーズを満たしていることを確認してください。Angularのデフォルトのルーティングは、一般的なユースケースに最適化されており、パフォーマンスとシンプルさの最良のバランスを提供します。ルートストラテジーをカスタマイズすると、コードがさらに複雑になり、慎重に管理しないとメモリ使用量にパフォーマンス上の影響を与える可能性があります。

## ルーターの設定オプション {#router-configuration-options}

`withRouterConfig`または`RouterModule.forRoot`を使用すると、追加の`RouterConfigOptions`を提供してルーターの動作を調整できます。

### キャンセルされたナビゲーションの処理 {#handle-canceled-navigations}

`canceledNavigationResolution`は、ナビゲーションがキャンセルされたときにルーターがブラウザの履歴をどのように復元するかを制御します。デフォルト値は`'replace'`で、`location.replaceState`を使用してナビゲーション前のURLに戻します。実際には、ブラウザの戻るボタンや進むボタンなどでナビゲーションのためにアドレスバーがすでに更新されている場合、ナビゲーションが失敗したりガードによって拒否されたりすると、履歴エントリは「ロールバック」で上書きされます。
`'computed'`に切り替えると、進行中の履歴インデックスがAngularのナビゲーションと同期されるため、戻るボタンのナビゲーションをキャンセルすると、元のページに戻るために進むナビゲーションがトリガーされます（逆も同様です）。

この設定は、アプリケーションが`urlUpdateStrategy: 'eager'`を使用している場合や、ガードがブラウザによって開始された`popstate`ナビゲーションを頻繁にキャンセルする場合に最も役立ちます。

```ts
provideRouter(routes, withRouterConfig({ canceledNavigationResolution: 'computed' }));
```

### 同じURLへのナビゲーションへの対応 {#react-to-same-url-navigations}

`onSameUrlNavigation`は、ユーザーが現在のURLへのナビゲーションを要求したときに何が起こるかを設定します。デフォルトの`'ignore'`は処理をスキップし、`'reload'`はガードとリゾルバーを再実行し、コンポーネントインスタンスを更新します。

これは、URLが変更されない場合でも、リストフィルター、左側のナビゲーション項目、または更新ボタンを繰り返しクリックして新しいデータ取得をトリガーしたい場合に便利です。

```ts
provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }));
```

グローバルにではなく、個々のナビゲーションでこの動作を制御できます。これにより、特定のユースケースに対してリロード動作を選択的に有効にしながら、デフォルトの`'ignore'`を維持できます。

```ts
router.navigate(['/some-path'], { onSameUrlNavigation: 'reload' });
```

### パラメータ継承の制御 {#control-parameter-inheritance}

`paramsInheritanceStrategy`は、ルートパラメータとデータが親ルートからどのように流れるかを定義します。

デフォルトの`'emptyOnly'`では、子ルートはパスが空の場合、または親がコンポーネントを宣言していない場合にのみパラメータを継承します。

```ts
provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }));
```

```ts
export const routes: Routes = [
  {
    path: 'org/:orgId',
    component: Organization,
    children: [
      {
        path: 'projects/:projectId',
        component: Project,
        children: [
          {
            path: 'customers/:customerId',
            component: Customer
          }
        ]
      }
    ]
  }
];
```

```ts
@Component({ /* ... */})
export class CustomerComponent {
  private route = inject(ActivatedRoute);

  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

`'always'`を使用すると、マトリックスパラメータ、ルートデータ、および解決された値がルートツリーのさらに下で利用可能になります。これは、`/org/:orgId/projects/:projectId/customers/:customerId`のような機能領域間でコンテキスト識別子を共有する場合に便利です。

```ts
@Component({ /* ... */})
export class CustomerComponent {
  private route = inject(ActivatedRoute);

  // All parent parameters are available directly
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### URLを更新するタイミングの決定 {#decide-when-the-url-updates}

`urlUpdateStrategy`は、Angularがブラウザのアドレスバーに書き込むタイミングを決定します。デフォルトの`'deferred'`は、URLを変更する前にナビゲーションが成功するのを待ちます。ナビゲーション開始時にすぐに更新するには`'eager'`を使用します。Eagerアップデートは、ガードやエラーによってナビゲーションが失敗した場合に試行されたURLを表面化しやすくしますが、実行時間の長いガードがある場合は、進行中のURLが一時的に表示される可能性があります。

分析パイプラインが、ガードによってブロックされた場合でも試行されたルートを確認する必要がある場合にこれを検討してください。

```ts
provideRouter(routes, withRouterConfig({ urlUpdateStrategy: 'eager' }));
```

### デフォルトのクエリパラメータ処理の選択 {#choose-default-query-parameter-handling}

`defaultQueryParamsHandling`は、呼び出しが`queryParamsHandling`を指定しない場合の`Router.createUrlTree`のフォールバック動作を設定します。`'replace'`はデフォルトで、既存のクエリ文字列を置き換えます。`'merge'`は提供された値を現在の値と結合し、`'preserve'`は明示的に新しいクエリパラメータを指定しない限り、既存のクエリパラメータを保持します。

```ts
provideRouter(routes, withRouterConfig({ defaultQueryParamsHandling: 'merge' }));
```

これは、追加のパラメータが提供されたときに既存のフィルターを自動的に保持するために、検索およびフィルターページで特に役立ちます。

Angularルーターは、カスタマイズのための4つの主要な領域を公開しています。

  <docs-pill-row>
    <docs-pill href="#route-reuse-strategy" title="ルート再利用戦略"/>
    <docs-pill href="#preloading-strategy" title="プリロード戦略"/>
    <docs-pill href="#url-handling-strategy" title="URL処理戦略"/>
    <docs-pill href="#custom-route-matchers" title="カスタムルートマッチャー"/>
  </docs-pill-row>

## ルート再利用戦略 {#route-reuse-strategy}

ルート再利用戦略は、ナビゲーション中にAngularがコンポーネントを破棄して再作成するか、再利用のために保持するかを制御します。デフォルトでは、Angularはルートから離れるときにコンポーネントインスタンスを破棄し、戻ってきたときに新しいインスタンスを作成します。

### ルート再利用を実装するタイミング {#when-to-implement-route-reuse}

カスタムルート再利用戦略は、次のような要件を持つアプリケーションにメリットがあります:

- **フォームの状態保持** - ユーザーが離れて戻ってきたときに、入力途中のフォームを維持します
- **高コストなデータの保持** - 大規模なデータセットの再取得や複雑な計算を回避します
- **スクロール位置の維持** - 長いリストや無限スクロールの実装でスクロール位置を保持します
- **タブのようなインターフェース** - タブを切り替えるときにコンポーネントの状態を維持します

### カスタムルート再利用戦略の作成 {#creating-a-custom-route-reuse-strategy}

Angularの`RouteReuseStrategy`クラスを使用すると、「デタッチされたルートハンドル」という概念を通じてナビゲーションの動作をカスタマイズできます。

「デタッチされたルートハンドル」は、Angularがコンポーネントインスタンスとそのビュー階層全体を保存する方法です。ルートがデタッチされると、Angularはコンポーネントインスタンス、その子コンポーネント、および関連するすべての状態をメモリに保持します。この保持された状態は、後でそのルートに戻ったときに再アタッチできます。

`RouteReuseStrategy`クラスは、ルートコンポーネントのライフサイクルを制御する5つのメソッドを提供します:

| メソッド                                                               | 説明                                                                                                 |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)         | ルートから離れるときに、後で再利用するためにルートを保存すべきかどうかを決定します                                 |
| [`store`](api/router/RouteReuseStrategy#store)                       | `shouldDetach`がtrueを返した場合に、デタッチされたルートハンドルを保存します                                           |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)         | 保存されたルートにナビゲートするときに、それを再アタッチすべきかどうかを決定します                                     |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                 | 以前に保存されたルートハンドルを再アタッチのために返します                                                 |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute) | ナビゲーション中に現在のルートインスタンスを破棄する代わりに、ルーターが再利用すべきかどうかを決定します |

次の例は、ルートメタデータに基づいてコンポーネントの状態を選択的に保持するカスタムルート再利用戦略を示しています:

```ts
import { RouteReuseStrategy, Route, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determines if a route should be stored for later reuse
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Stores the detached route handle when shouldDetach returns true
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Checks if a stored route should be reattached
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Returns the stored route handle for reattachment
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? this.handlers.get(key) ?? null : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determines if the router should reuse the current route instance
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

NOTE: `canMatch`ガードが関与している場合、重複したエントリにつながる可能性があるため、キーとしてルートパスを使用することは避けてください。

### カスタムルート再利用戦略を使用するようにルートを設定する {#configuring-a-route-to-use-a-custom-route-reuse-strategy}

ルートは、ルート設定メタデータを通じて再利用の動作をオプトインできます。このアプローチでは、再利用ロジックをコンポーネントのコードから分離し、コンポーネントを変更することなく動作を簡単に調整できるようにします:

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent,
    data: { reuse: true }  // Component state persists across navigations
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    // No reuse flag - component recreates on each navigation
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { reuse: true }  // Preserves search results and filter state
  }
];
```

また、Angularの依存性の注入システムを通じて、アプリケーションレベルでカスタムルート再利用戦略を設定できます。この場合、Angularは戦略の単一インスタンスを作成し、それがアプリケーション全体のすべてのルート再利用の決定を管理します:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};
```

## プリロード戦略 {#preloading-strategy}

プリロード戦略は、Angularが遅延読み込みされるルートモジュールをバックグラウンドでいつ読み込むかを決定します。遅延読み込みはモジュールのダウンロードを遅延させることで初期読み込み時間を改善しますが、ユーザーが初めて遅延ルートにナビゲートする際には依然として遅延が発生します。プリロード戦略は、ユーザーがリクエストする前にモジュールを読み込むことで、この遅延を解消します。

### 組み込みのプリロード戦略 {#built-in-preloading-strategies}

Angularは、標準で2つのプリロード戦略を提供しています:

| 戦略                                                | 説明                                                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | すべてのプリロードを無効にするデフォルトの戦略です。言い換えると、モジュールはユーザーがナビゲートしたときにのみ読み込まれます |
| [`PreloadAllModules`](api/router/PreloadAllModules) | 初期ナビゲーションの直後に、遅延読み込みされるすべてのモジュールを読み込みます                                           |

`PreloadAllModules`戦略は次のように設定できます:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

`PreloadAllModules`戦略は、すべてのモジュールをダウンロードしてもパフォーマンスに大きな影響を与えない中小規模のアプリケーションに適しています。しかし、多くのフィーチャーモジュールを持つ大規模なアプリケーションでは、より選択的なプリロードが有効な場合があります。

### カスタムプリロード戦略の作成 {#creating-a-custom-preloading-strategy}

カスタムプリロード戦略は`PreloadingStrategy`インターフェースを実装します。これには単一の`preload`メソッドが必要です。このメソッドは、ルート設定と、実際のモジュール読み込みをトリガーする関数を受け取ります。この戦略は、プリロードが完了したときにemitするObservableか、プリロードをスキップするための空のObservableを返します:

```ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes marked with data: { preload: true }
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

この選択的戦略は、ルートメタデータをチェックしてプリロードの動作を決定します。ルートは、その設定を通じてプリロードをオプトインできます:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: { preload: true }  // Preload immediately after initial navigation
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: { preload: false } // Only load when user navigates to reports
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
    // No preload flag - won't be preloaded
  }
];
```

### プリロードのパフォーマンスに関する考慮事項 {#performance-considerations-for-preloading}

プリロードは、ネットワーク使用量とメモリ消費量の両方に影響を与えます。プリロードされた各モジュールは帯域幅を消費し、アプリケーションのメモリフットプリントを増加させます。従量制接続のモバイルユーザーは最小限のプリロードを好むかもしれませんが、高速ネットワークのデスクトップユーザーは積極的なプリロード戦略を処理できます。

プリロードのタイミングも重要です。初期読み込み直後のプリロードは、画像やAPIコールなどの他の重要なリソースと競合する可能性があります。戦略は、アプリケーションの読み込み後の動作を考慮し、パフォーマンスの低下を避けるために他のバックグラウンドタスクと協調する必要があります。

ブラウザのリソース制限もプリロードの動作に影響します。ブラウザは同時HTTP接続を制限するため、積極的なプリロードは他のリクエストの後ろでキューに入れられる可能性があります。Service Workerは、キャッシュとネットワークリクエストをきめ細かく制御することで、プリロード戦略を補完するのに役立ちます。

## URLハンドリングストラテジー {#url-handling-strategy}

URLハンドリングストラテジーは、AngularルーターがどのURLを処理し、どのURLを無視するかを決定します。デフォルトでは、Angularはアプリケーション内のすべてのナビゲーションイベントを処理しようとしますが、実際のアプリケーションでは、他のシステムと共存したり、外部リンクを処理したり、独自のルートを管理するレガシーアプリケーションと統合したりする必要があることがよくあります。

`UrlHandlingStrategy`クラスを使用すると、Angularが管理するルートと外部リンクとの間のこの境界を制御できます。これは、アプリケーションをAngularに段階的に移行する場合や、Angularアプリケーションが他のフレームワークとURL空間を共有する必要がある場合に不可欠になります。

### カスタムURLハンドリングストラテジーの実装 {#implementing-a-custom-url-handling-strategy}

カスタムURLハンドリングストラテジーは`UrlHandlingStrategy`クラスを拡張し、3つのメソッドを実装します。`shouldProcessUrl`メソッドはAngularが特定のURLを処理すべきかどうかを判断し、`extract`はAngularが処理すべきURLの部分を返し、`merge`はURLフラグメントをURLの残りの部分と結合します:

```ts
import { Injectable } from '@angular/core';
import { UrlHandlingStrategy, UrlTree } from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Only handle URLs that start with /app or /admin
    return url.toString().startsWith('/app') ||
           url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // Return the URL unchanged if we should process it
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // Combine the URL fragment with the rest of the URL
    return newUrlPart;
  }
}
```

このストラテジーは、URL空間に明確な境界を作成します。Angularは`/app`と`/admin`のパスを処理し、それ以外はすべて無視します。このパターンは、Angularが特定のセクションを制御し、レガシーシステムが他のセクションを維持するようなレガシーアプリケーションを移行する場合にうまく機能します。

### カスタムURLハンドリングストラテジーの設定 {#configuring-a-custom-url-handling-strategy}

Angularの依存性の注入システムを通じて、カスタムストラテジーを登録できます:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UrlHandlingStrategy } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy }
  ]
};
```

## カスタムルートマッチャー {#custom-route-matchers}

デフォルトでは、Angularのルーターは定義された順序でルートを反復処理し、URLパスを各ルートのパスパターンと照合しようとします。静的セグメント、パラメーター化セグメント（`:id`）、ワイルドカード（`**`）をサポートしています。最初に一致したルートが採用され、ルーターは検索を停止します。

アプリケーションが実行時の条件、複雑なURLパターン、またはその他のカスタムルールに基づいてより高度なマッチングロジックを必要とする場合、カスタムマッチャーは標準ルートのシンプルさを損なうことなくこの柔軟性を提供します。

ルーターは、パスマッチングが行われる前のルートマッチングフェーズでカスタムマッチャーを評価します。マッチャーが成功したマッチを返すと、URLからパラメーターを抽出でき、標準のルートパラメーターと同様に、アクティブ化されたコンポーネントで利用できるようになります。

### カスタムマッチャーの作成 {#creating-a-custom-matcher}

カスタムマッチャーは、URLセグメントを受け取り、消費されたセグメントとパラメーターを含むマッチ結果、またはマッチしなかったことを示すnullを返す関数です。このマッチャー関数は、Angularがルートのpathプロパティを評価する前に実行されます:

```ts
import { Route, UrlSegment, UrlSegmentGroup, UrlMatchResult } from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route
): UrlMatchResult | null {
  // Matching logic here
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {})
      }
    };
  }
  return null;
}
```

### バージョンベースのルーティングの実装 {#implementing-version-based-routing}

URL内のバージョン番号に基づいてルーティングする必要があるAPIドキュメントサイトを考えてみましょう。バージョンが異なれば、コンポーネントの構造や機能セットも異なる場合があります:

```ts
import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // Match patterns like /v1/docs, /v2.1/docs, /v3.0.1/docs
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2),  // Consume version and 'docs'
      posParams: {
        version: segments[0],  // Make version available as a parameter
        section: segments[1]   // Make section available too
      }
    };
  }
  return null;
}

// Route configuration
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: DocumentationComponent
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs'
  }
];
```

コンポーネントは、ルート入力を介して抽出されたパラメーターを受け取ります:

```angular-ts
import { Component, input, inject } from '@angular/core';
import { resource } from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Loading documentation...</div>
    } @else if (documentation.error()) {
      <div>Error loading documentation</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `
})
export class DocumentationComponent {
  // Route parameters are automatically bound to signal inputs
  version = input.required<string>();  // Receives the version parameter
  section = input.required<string>();  // Receives the section parameter

  private docsService = inject(DocumentationService);

  // Resource automatically loads documentation when version or section changes
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section()
      }
    },
    loader: ({ params }) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    }
  })
}
```

### ロケールを意識したルーティング {#locale-aware-routing}

国際的なアプリケーションでは、URLにロケール情報がエンコードされることがよくあります。カスタムマッチャーは、ロケールコードを抽出し、ロケールをパラメーターとして利用可能にしながら、適切なコンポーネントにルーティングできます:

```ts
// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // This is a locale prefix, consume it and continue matching
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0]
        }
      };
    } else {
      // No locale prefix, use default locale
      return {
        consumed: [],  // Don't consume any segments
        posParams: {
          locale: new UrlSegment('en', {})
        }
      };
    }
  }

  return null;
}
```

### 複雑なビジネスロジックのマッチング {#complex-business-logic-matching}

カスタムマッチャーは、パスパターンで表現するのが厄介なビジネスルールを実装するのに優れています。製品の種類によって製品URLが異なるパターンに従うeコマースサイトを考えてみましょう:

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Books: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {})
      }
    };
  }

  // Electronics: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1]
      }
    };
  }

  // Clothing: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2]
      }
    };
  }

  return null;
}
```

### カスタムマッチャーのパフォーマンスに関する考慮事項 {#performance-considerations-for-custom-matchers}

カスタムマッチャーは、マッチが見つかるまですべてのナビゲーション試行で実行されます。その結果、複雑なマッチングロジックは、特に多くのルートを持つアプリケーションにおいて、ナビゲーションパフォーマンスに影響を与える可能性があります。マッチャーは焦点を絞り、効率的に保ちましょう:

- マッチが不可能な場合は早期にリターンする
- API呼び出しや複雑な正規表現のような高コストな操作を避ける
- 繰り返し現れるURLパターンの結果をキャッシュすることを検討する

カスタムマッチャーは複雑なルーティング要件をエレガントに解決しますが、使いすぎるとルート設定の理解と保守が難しくなる可能性があります。標準のパスマッチングでは本当に不十分なシナリオのために、カスタムマッチャーを予約しておきましょう。
