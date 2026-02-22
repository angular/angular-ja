# ルーティングとナビゲーションのテスト

ルーティングとナビゲーションのテストは、ユーザーが異なるルート間を移動する際にアプリケーションが正しく動作することを保証するために不可欠です。このガイドでは、Angularアプリケーションにおけるルーティング機能のテストに関する様々な戦略について説明します。

## 前提条件 {#prerequisites}

このガイドは、以下のツールとライブラリに精通していることを前提としています。

- **[Vitest](https://vitest.dev/)** - テスト構文（`describe`、`it`、`expect`）を提供するJavaScriptテストフレームワーク
- **[Angular Testing Utilities](guide/testing)** - Angularに組み込まれているテストツール（[`TestBed`](api/core/testing/TestBed)、[`ComponentFixture`](api/core/testing/ComponentFixture)）
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - 組み込みのナビゲーションとコンポーネントテスト機能を備えた、ルーティングされたコンポーネントをテストするためのテストハーネス

## テストシナリオ {#testing-scenarios}

### ルートパラメーター {#route-parameters}

コンポーネントは、プロフィールページのユーザーIDのように、URLからのルートパラメーターに依存してデータを取得することがよくあります。

以下の例は、ルートからユーザーIDを表示する`UserProfile`コンポーネントをテストする方法を示しています。

```ts { header: 'user-profile.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {UserProfile} from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [provideRouter([{path: 'user/:id', component: UserProfile}])],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts {header: 'user-profile.ts'}
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>',
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### ルートガード {#route-guards}

ルートガードは、認証や権限などの条件に基づいてルートへのアクセスを制御します。ガードをテストする際は、依存関係のモックとナビゲーションの結果の検証に焦点を当てます。

以下の例は、認証されたユーザーのナビゲーションを許可し、認証されていないユーザーをログインページにリダイレクトする`authGuard`をテストします。

```ts {header: 'auth.guard.spec.ts'}
import {vi, type Mocked} from 'vitest';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter, Router} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthStore} from './auth-store';
import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

@Component({template: '<h1>Protected Page</h1>'})
class Protected {}

@Component({template: '<h1>Login Page</h1>'})
class Login {}

describe('authGuard', () => {
  let authStore: Mocked<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = {isAuthenticated: vi.fn().mockReturnValue(isAuthenticated)} as Mocked<AuthStore>;

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthStore, useValue: authStore},
        provideRouter([
          {path: 'protected', component: Protected, canActivate: [authGuard]},
          {path: 'login', component: Login},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', Protected);
    // The protected component should render when authenticated
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', Login);
    // The login component should render after redirect
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts {header: 'auth.guard.ts'}
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### ルーターアウトレット {#router-outlets}

ルーターアウトレットのテストは、本質的に[`Router`](api/router/Router)、アウトレット、および表示されるコンポーネント間の統合をテストしているため、より統合テストに近いものです。

異なるルートに対して異なるコンポーネントが表示されることを検証するテストを設定する方法の例を以下に示します。

```ts {header: 'app.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Component} from '@angular/core';
import {App} from './app';

@Component({
  template: '<h1>Home Page</h1>',
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>',
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          {path: '', component: MockHome},
          {path: 'about', component: MockAbout},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should display home component for default route', async () => {
    await harness.navigateByUrl('');

    expect(harness.routeNativeElement?.textContent).toContain('Home Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });
});
```

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

### ネストされたルート {#nested-routes}

ネストされたルートをテストすることで、ネストされたURLにナビゲートしたときに親コンポーネントと子コンポーネントの両方が正しくレンダリングされることを保証します。ネストされたルートは複数のレイヤーを含むため、これは重要です。

以下を確認する必要があります。

1. 親コンポーネントが適切にレンダリングされること。
2. 子コンポーネントがその内部にレンダリングされること。
3. 両方のコンポーネントがそれぞれのルートデータにアクセスできることを確認すること。

親子のルート構造をテストする例を以下に示します。

```ts {header: 'nested-routes.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Parent, Child} from './nested-components';

describe('Nested Routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Parent, Child],
      providers: [
        provideRouter([
          {
            path: 'parent',
            component: Parent,
            children: [{path: 'child', component: Child}],
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should render parent and child components for nested route', async () => {
    await harness.navigateByUrl('/parent/child');

    expect(harness.routeNativeElement?.textContent).toContain('Parent Component');
    expect(harness.routeNativeElement?.textContent).toContain('Child Component');
  });
});
```

```angular-ts {header: 'nested.ts'}
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `,
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>',
})
export class Child {}
```

### クエリパラメーターとフラグメント {#query-parameters-and-fragments}

クエリパラメーター（`?search=angular&category=web`など）とURLフラグメント（`#section1`など）は、どのコンポーネントがロードされるかには影響しませんが、コンポーネントの動作には影響を与える追加データをURLを通じて提供します。[`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams)を通じてクエリパラメーターを読み取るコンポーネントは、異なるパラメーターシナリオを正しく処理することを確認するためにテストする必要があります。

ルート定義の一部であるルートパラメーターとは異なり、クエリパラメーターはオプションであり、ルートナビゲーションをトリガーすることなく変更できます。これは、初期ロードと、クエリパラメーターが変更されたときのリアクティブな更新の両方をテストする必要があることを意味します。

クエリパラメーターとフラグメントをテストする方法の例を以下に示します。

```ts {header: 'search.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {Search} from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideRouter([{path: 'search', component: Search}])],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });
});
```

```angular-ts {header: 'search.ts'}
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: '<div>Search term: {{searchTerm()}}</div>',
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});

  searchTerm = computed(() => this.queryParams()['q'] || null);
}
```

## ルーターテストのベストプラクティス {#best-practices-for-router-testing}

1. **RouterTestingHarnessを使用する** - ルーティングされたコンポーネントをテストするには、よりクリーンなAPIを提供し、テストホストコンポーネントの必要性を排除する[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)を使用してください。これは、直接的なコンポーネントアクセス、組み込みのナビゲーション、およびより優れた型安全性を提供します。ただし、名前付きアウトレットのテストなど、カスタムホストコンポーネントを作成する必要がある一部のシナリオには適していません。
2. **外部の依存関係を慎重に処理する** - より現実的なテストのために、可能な場合は実際の実装を優先してください。実際の実装が実現不可能な場合（例：外部API）は、実際の動作を近似するフェイクを使用してください。モックやスタブは、テストを脆弱にし、信頼性を低下させる可能性があるため、最後の手段としてのみ使用してください。
3. **ナビゲーション状態をテストする** - URLの変更やコンポーネントのレンダリングを含む、ナビゲーションアクションと結果として生じるアプリケーション状態の両方を検証してください。
4. **非同期操作を処理する** - ルーターのナビゲーションは非同期です。テストでのタイミングを適切に処理するために、`async/await`を使用してください。
5. **エラーシナリオをテストする** - アプリケーションがエッジケースを適切に処理することを確認するために、無効なルート、失敗したナビゲーション、およびガードによる拒否のテストを含めてください。
6. **Angularルーターをモックしない** - 代わりに、実際のルート設定を提供し、ハーネスを使用してナビゲートしてください。これにより、テストがより堅牢になり、Angularの内部更新で壊れる可能性が低くなります。また、モックは破壊的変更を隠す可能性があるため、ルーターが更新されたときに実際の問題を確実に捕捉できます。
