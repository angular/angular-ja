# ルーターのライフサイクルとイベント

Angularルーターは、ナビゲーションの変更に応答し、ルーティングプロセス中にカスタムロジックを実行できるようにする包括的なライフサイクルフックとイベントのセットを提供します。

## 共通ルーターイベント {#common-router-events}

Angularルーターは、ナビゲーションライフサイクルを追跡するために購読できるナビゲーションイベントを発行します。これらのイベントは`Router.events`Observableを通じて利用できます。このセクションでは、ナビゲーションとエラー追跡のための一般的なルーティングライフサイクルイベント（時系列順）について説明します。

| イベント                                            | 説明                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | ナビゲーションが開始され、要求されたURLが含まれるときに発生します。                                      |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | ルーターがURLに一致するルートを決定した後、ルートの状態情報が含まれるときに発生します。                  |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | ルートガードフェーズを開始します。ルーターは`canActivate`や`canDeactivate`のようなルートガードを評価します。|
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | ガード評価の完了を通知します。結果（許可/拒否）が含まれます。                                            |
| [`ResolveStart`](api/router/ResolveStart)           | データ解決フェーズを開始します。ルートリゾルバーがデータのフェッチを開始します。                         |
| [`ResolveEnd`](api/router/ResolveEnd)               | データ解決が完了します。必要なすべてのデータが利用可能になります。                                       |
| [`NavigationEnd`](api/router/NavigationEnd)         | ナビゲーションが正常に完了したときの最終イベントです。ルーターはURLを更新します。                        |
| [`NavigationSkipped`](api/router/NavigationSkipped) | ルーターがナビゲーションをスキップするとき（例: 同じURLへのナビゲーション）に発生します。               |

以下は一般的なエラーイベントです。

| イベント                                          | 説明                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------ |
| [`NavigationCancel`](api/router/NavigationCancel) | ルーターがナビゲーションをキャンセルするときに発生します。多くの場合、ガードがfalseを返すことが原因です。|
| [`NavigationError`](api/router/NavigationError)   | ナビゲーションが失敗したときに発生します。無効なルートやリゾルバーエラーが原因である可能性があります。|

すべてのライフサイクルイベントのリストについては、[このガイドの完全な表](#all-router-events)を参照してください。

## ルーターイベントを購読する方法 {#how-to-subscribe-to-router-events}

特定のナビゲーションライフサイクルイベント中にコードを実行したい場合は、`router.events`を購読し、イベントのインスタンスをチェックすることで実行できます。

```ts
// Example of subscribing to router events
import {Component, inject, signal, effect} from '@angular/core';
import {Event, Router, NavigationStart, NavigationEnd} from '@angular/router';

@Component({
  /*...*/
})
export class RouterEvents {
  private readonly router = inject(Router);

  constructor() {
    // Subscribe to router events and react to events
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation starting
        console.log('Navigation starting:', event.url);
      }
      if (event instanceof NavigationEnd) {
        // Navigation completed
        console.log('Navigation completed:', event.url);
      }
    });
  }
}
```

NOTE: `@angular/router`の[`Event`](api/router/Event)型は、通常のグローバル[`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)型と同じ名前ですが、[`RouterEvent`](api/router/RouterEvent)型とは異なります。

## ルーティングイベントのデバッグ方法 {#how-to-debug-routing-events}

イベントシーケンスの可視性がない場合、ルーターナビゲーションの問題をデバッグするのは困難な場合があります。Angularは、すべてのルーターイベントをコンソールにログ記録する組み込みのデバッグ機能を提供し、ナビゲーションフローを理解し、問題が発生する場所を特定するのに役立ちます。

ルーターイベントシーケンスを検査する必要がある場合、デバッグのために内部ナビゲーションイベントのログ記録を有効にできます。これは、すべてのルーティングイベントの詳細なコンソールログ記録を有効にする設定オプション（`withDebugTracing()`）を渡すことで設定できます。

```ts
import {provideRouter, withDebugTracing} from '@angular/router';

const appRoutes: Routes = [];
bootstrapApplication(App, {
  providers: [provideRouter(appRoutes, withDebugTracing())],
});
```

詳細については、[`withDebugTracing`](api/router/withDebugTracing)に関する公式ドキュメントを参照してください。

## 一般的なユースケース {#common-use-cases}

ルーターイベントは、実際のアプリケーションで多くの実用的な機能を実現します。ルーターイベントで使用される一般的なパターンをいくつか紹介します。

### ローディングインジケーター {#loading-indicators}

ナビゲーション中にローディングインジケーターを表示します。

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

### アナリティクストラッキング {#analytics-tracking}

アナリティクス用にページビューを追跡します。

```ts
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {inject, Injectable, DestroyRef} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      // Track page views when URL changes
      if (event instanceof NavigationEnd) {
        // Send page view to analytics
        this.analytics.trackPageView(event.url);
      }
    });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    },
  };
}
```

### エラーハンドリング {#error-handling}

ナビゲーションエラーを適切に処理し、ユーザーフィードバックを提供します。

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationCancellationCode,
} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `,
})
export class ErrorHandler {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.code === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Access denied. Please check your permissions.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
```

## すべてのルーターイベント {#all-router-events}

参考として、Angularで利用可能なすべてのルーターイベントの完全なリストを以下に示します。これらのイベントはカテゴリー別に整理されており、ナビゲーション中に通常発生する順序でリストされています。

### ナビゲーションイベント {#navigation-events}

これらのイベントは、ルート認識、ガードチェック、データ解決に至るまでのコアナビゲーションプロセスを最初から追跡します。これらはナビゲーションライフサイクルの各フェーズへの可視性を提供します。

| イベント                                                  | 説明                                                        |
| :-------------------------------------------------------- | :---------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | ナビゲーションが開始されたときに発生します                  |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | ルート設定の遅延読み込みの前に発生します                      |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | 遅延読み込みされたルート設定がロードされた後に発生します      |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | ルーターがURLを解析し、ルートを認識したときに発生します     |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | ガードフェーズの開始時に発生します                          |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | ガードフェーズの終了時に発生します                          |
| [`ResolveStart`](api/router/ResolveStart)                 | 解決フェーズの開始時に発生します                            |
| [`ResolveEnd`](api/router/ResolveEnd)                     | 解決フェーズの終了時に発生します                            |

### アクティベーションイベント {#activation-events}

これらのイベントは、ルートコンポーネントがインスタンス化および初期化されるアクティベーションフェーズ中に発生します。アクティベーションイベントは、親ルートと子ルートを含むルートツリー内の各ルートに対して発生します。

| イベント                                                  | 説明                                      |
| :-------------------------------------------------------- | :---------------------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | ルートアクティベーションの開始時に発生します |
| [`ChildActivationStart`](api/router/ChildActivationStart) | 子ルートアクティベーションの開始時に発生します |
| [`ActivationEnd`](api/router/ActivationEnd)               | ルートアクティベーションの終了時に発生します |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | 子ルートアクティベーションの終了時に発生します |

### ナビゲーション完了イベント {#navigation-completion-events}

これらのイベントは、ナビゲーション試行の最終結果を表します。すべてのナビゲーションは、成功したか、キャンセルされたか、失敗したか、スキップされたかを示すこれらのイベントのいずれか1つで終了します。

| イベント                                                | 説明                                                              |
| :------------------------------------------------------ | :---------------------------------------------------------------- |
| [`NavigationEnd`](api/router/NavigationEnd)         | ナビゲーションが正常に終了したときに発生します                    |
| [`NavigationCancel`](api/router/NavigationCancel)   | ルーターがナビゲーションをキャンセルしたときに発生します          |
| [`NavigationError`](api/router/NavigationError)     | 予期しないエラーによりナビゲーションが失敗したときに発生します    |
| [`NavigationSkipped`](api/router/NavigationSkipped) | ルーターがナビゲーションをスキップしたときに発生します (例: 同じURLへのナビゲーション) |

### その他のイベント {#other-events}

メインのナビゲーションライフサイクル外で発生する追加のイベントが1つありますが、これはルーターのイベントシステムの一部です。

| イベント                        | 説明                  |
| :------------------------------ | :-------------------- |
| [`Scroll`](api/router/Scroll) | スクロール中に発生します |

## 次のステップ {#next-steps}

[ルートガード](/guide/routing/route-guards)および[一般的なルータタスク](/guide/routing/common-router-tasks)についてさらに学ぶ。
