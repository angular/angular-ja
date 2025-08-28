# データリゾルバー

データリゾルバーを使用すると、ルートにナビゲートする前にデータをフェッチでき、コンポーネントが必要なデータをレンダリング前に確実に受け取るようにします。これにより、ローディング状態の必要性を防ぎ、重要なデータを事前に読み込むことでユーザー体験を向上させることができます。

## データリゾルバーとは？ {#what-are-data-resolvers}

データリゾルバーは、[`ResolveFn`](api/router/ResolveFn)関数を実装するサービスです。これは、ルートがアクティブになる前に実行され、API、データベース、またはその他のソースからデータをフェッチできます。解決されたデータは、[`ActivatedRoute`](api/router/ActivatedRoute)を介してコンポーネントで利用可能になります。

## データリゾルバーを使用する理由 {#why-use-data-resolvers}

データリゾルバーは、一般的なルーティングの課題を解決します。

- **空の状態を防ぐ**: コンポーネントはロード時にすぐにデータを受け取ります
- **より良いユーザー体験**: 重要なデータに対してローディングスピナーは表示されません
- **エラー処理**: ナビゲーション前にデータ取得エラーを処理します
- **データの一貫性**: レンダリング前に必要なデータが利用可能であることを保証します。これはSSRにとって重要です

## リゾルバの作成 {#creating-a-resolver}

リゾルバは、[`ResolveFn`](api/router/ResolveFn)型の関数を記述することで作成します。

これは、[`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot)と[`RouterStateSnapshot`](api/router/RouterStateSnapshot)をパラメータとして受け取ります。

以下は、[`inject`](api/core/inject)関数を使用してルートをレンダリングする前にユーザー情報を取得するリゾルバです。

```ts
import { inject } from '@angular/core';
import { UserStore, SettingsStore } from './user-store';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import type { User, Settings } from './types';

export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## ルーティングにリゾルバーを設定する {#configuring-routes-with-resolvers}

ルートに1つ以上のデータリゾルバーを追加したい場合は、ルート設定の`resolve`キーの下に追加できます。[`Routes`](api/router/Routes)型は、ルート設定の構造を定義します。

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver
    }
  }
];
```

[`resolve`設定の詳細については、APIドキュメントで確認できます。](api/router/Route#resolve)

## コンポーネントで解決済みデータにアクセスする {#accessing-resolved-data-in-components}

### ActivatedRouteを使用する {#using-activatedroute}

[`signal`](api/core/signal)関数を使用して[`ActivatedRoute`](api/router/ActivatedRoute)からスナップショットデータにアクセスすることで、コンポーネントで解決済みデータにアクセスできます。

```angular-ts
import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### withComponentInputBindingを使用する {#using-withcomponentinputbinding}

解決済みデータにアクセスする別のアプローチは、[`provideRouter`](api/router/provideRouter)でルーターを設定する際に[`withComponentInputBinding()`](api/router/withComponentInputBinding)を使用することです。これにより、解決済みデータをコンポーネントの入力として直接渡すことができます。

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
});
```

この設定により、[`input`](api/core/input)関数と、必須入力には[`input.required`](api/core/input#required)を使用して、リゾルバーキーと一致する入力をコンポーネントで定義できます。

```angular-ts
import { Component, input } from '@angular/core';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

このアプローチは、より優れた型安全性を提供し、解決済みデータにアクセスするためだけに`ActivatedRoute`を注入する必要がなくなります。

## リゾルバーでのエラー処理 {#error-handling-in-resolvers}

ナビゲーションの失敗が発生した場合、データリゾルバーでエラーを適切に処理することが重要です。そうしないと、`NavigationError`が発生し、現在のルートへのナビゲーションが失敗し、ユーザーにとって不便な体験につながります。

データリゾルバーでエラーを処理する主な方法は3つあります。

1. [withNavigationErrorHandlerでのエラー処理の一元化](#centralize-error-handling-in-withnavigationerrorhandler)
2. [ルーターイベントのサブスクリプションによるエラー管理](#managing-errors-through-a-subscription-to-router-events)
3. [リゾルバーでの直接的なエラー処理](#handling-errors-directly-in-the-resolver)

### `withNavigationErrorHandler`でのエラー処理の一元化 {#centralize-error-handling-in-withnavigationerrorhandler}

`withNavigationErrorHandler`機能は、失敗したデータリゾルバーからのエラーを含む、すべてのナビゲーションエラーを処理する一元的な方法を提供します。このアプローチにより、エラー処理ロジックが一箇所に保持され、リゾルバー間での重複したエラー処理コードが防止されます。

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withNavigationErrorHandler((error) => {
      const router = inject(Router);

      if (error?.message) {
        console.error('Navigation error occurred:', error.message)
      }

      router.navigate(['/error']);
    }))
  ]
});
```

この設定により、リゾルバーはデータ取得に集中でき、一元化されたハンドラーがエラーシナリオを管理できます。

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // No need for explicit error handling - let it bubble up
  return userStore.getUser(userId);
};
```

### ルーターイベントのサブスクリプションによるエラー管理 {#managing-errors-through-a-subscription-to-router-events}

ルーターイベントをサブスクライブし、`NavigationError`イベントをリッスンすることで、リゾルバーのエラーを処理できます。このアプローチにより、エラー処理をよりきめ細かく制御でき、カスタムのエラー回復ロジックを実装できます。

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Retry</button>
      </div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationError => event instanceof NavigationError),
      map(event => {
        this.lastFailedUrl.set(event.url);

        if (event.error) {
          console.error('Navigation error', event.error)
        }

        return 'Navigation failed. Please try again.';
      })
    ),
    { initialValue: '' }
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

このアプローチは、次のような場合に特に役立ちます。

- 失敗したナビゲーションのカスタム再試行ロジックを実装する
- 失敗の種類に基づいて特定のエラーメッセージを表示する
- 分析目的でナビゲーションの失敗を追跡する

### リゾルバーでの直接的なエラー処理 {#handling-errors-directly-in-the-resolver}

以下は、エラーをログに記録し、`Router`サービスを使用して汎用的な`/users`ページにナビゲートし直す`userResolver`の更新された例です。

```ts
import { inject } from '@angular/core';
import { ResolveFn, RedirectCommand, Router } from '@angular/router';
import { catchError, of, EMPTY } from 'rxjs';
import { UserStore } from './user-store';
import type { User } from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError(error => {
      console.error('Failed to load user:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    })
  );
};
```

## ナビゲーションの読み込みに関する考慮事項 {#navigation-loading-considerations}

データリゾルバーはコンポーネント内の読み込み状態を防ぎますが、別のUX上の考慮事項をもたらします。リゾルバーの実行中はナビゲーションがブロックされます。特にネットワークリクエストが遅い場合、ユーザーはリンクをクリックしてから新しいルートが表示されるまでに遅延を経験する可能性があります。

### ナビゲーションフィードバックの提供 {#providing-navigation-feedback}

リゾルバーの実行中のユーザー体験を向上させるには、ルーターイベントをリッスンして読み込みインジケーターを表示できます。

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

このアプローチにより、リゾルバーがデータをフェッチしている間、ナビゲーションが進行中であることをユーザーが視覚的にフィードバックとして受け取ることができます。

## ベストプラクティス {#best-practices}

- **リゾルバーを軽量に保つ**: リゾルバーは、ページが必要とする可能性のあるすべてのデータではなく、必要不可欠なデータのみをフェッチするようにしてください
- **エラーを処理する**: ユーザーに可能な限り最高の体験を提供するために、常にエラーを適切に処理することを忘れないでください
- **キャッシュを使用する**: パフォーマンスを向上させるために、解決されたデータをキャッシュすることを検討してください
- **ナビゲーションUXを考慮する**: データフェッチ中にナビゲーションがブロックされるため、リゾルバー実行中にローディングインジケーターを実装してください
- **適切なタイムアウトを設定する**: 無期限にハングしてナビゲーションをブロックする可能性のあるリゾルバーは避けてください
- **型安全性**: 解決されたデータにはTypeScriptインターフェースを使用してください
