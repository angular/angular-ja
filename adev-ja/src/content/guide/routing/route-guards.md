# ガードでルートアクセスを制御する

CRITICAL: クライアントサイドのガードをアクセス制御の唯一のソースとして決して信頼しないでください。Webブラウザで実行されるすべてのJavaScriptは、ブラウザを実行しているユーザーによって変更される可能性があります。クライアントサイドのガードに加えて、常にサーバーサイドでユーザー認証を強制してください。

ルートガードは、ユーザーが特定のルートに移動できるか、または特定のルートから離れることができるかを制御する関数です。それらは、ユーザーが特定のルートにアクセスできるかどうかを管理するチェックポイントのようなものです。ルートガードを使用する一般的な例には、認証とアクセス制御があります。

## ルートガードの作成 {#creating-a-route-guard}

Angular CLIを使用してルートガードを生成できます。

```bash
ng generate guard CUSTOM_NAME
```

これにより、使用する[ルートガードのタイプ](#types-of-route-guards)を選択するよう求められ、対応する`CUSTOM_NAME-guard.ts`ファイルが作成されます。

TIP: Angularプロジェクトで個別のTypeScriptファイルを作成することで、手動でルートガードを作成できます。開発者は通常、他のファイルと区別するために、ファイル名に`-guard.ts`のサフィックスを追加します。

## ルートガードの戻り値の型 {#route-guard-return-types}

すべてのルートガードは、同じ戻り値の型を共有します。これにより、ナビゲーションを制御する柔軟性が得られます。

| 戻り値の型                      | 説明                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `boolean`                       | `true` はナビゲーションを許可し、 `false` はブロックします (`CanMatch` ルートガードに関する注記を参照) |
| `UrlTree` or `RedirectCommand`  | ブロックする代わりに別のルートにリダイレクトします                                    |
| `Promise<T>` or `Observable<T>` | ルーターは最初に発行された値を使用し、その後購読を解除します                         |

Note: `CanMatch` は異なる動作をします — `false` を返すと、Angularはナビゲーションを完全にブロックする代わりに、他のマッチするルートを試行します。

## ルートガードの種類

Angularは、それぞれ異なる目的を持つ4種類のルートガードを提供します。

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

### CanActivate {#canactivate}

`CanActivate`ガードは、ユーザーがルートにアクセスできるかどうかを決定します。これは、認証と認可に最も一般的に使用されます。

以下のデフォルト引数にアクセスできます。

- `route: ActivatedRouteSnapshot` - アクティブ化されるルートに関する情報を含みます
- `state: RouterStateSnapshot` - ルーターの現在の状態を含みます

[標準のガード戻り値の型](#route-guard-return-types)を返すことができます。

```ts
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Tip: ユーザーをリダイレクトする必要がある場合は、[`URLTree`](api/router/UrlTree)または[`RedirectCommand`](api/router/RedirectCommand)を返します。`false`を返してから、プログラムでユーザーを`navigate`しては**いけません**。

詳細については、[CanActivateFnのAPIドキュメント](api/router/CanActivateFn)を参照してください。

### CanActivateChild {#canactivatechild}

`CanActivateChild`ガードは、ユーザーが特定の親ルートの子ルートにアクセスできるかどうかを決定します。これは、ネストされたルートのセクション全体を保護したい場合に役立ちます。言い換えれば、`canActivateChild`は_すべて_の子に対して実行されます。子コンポーネントの下に別の子コンポーネントがある場合、`canActivateChild`は両方のコンポーネントに対して一度実行されます。

以下のデフォルト引数にアクセスできます。

- `childRoute: ActivatedRouteSnapshot` - アクティブ化される子ルートの「将来の」スナップショット（つまり、ルーターがナビゲートしようとしている状態）に関する情報を含みます
- `state: RouterStateSnapshot` - ルーターの現在の状態を含みます

[標準のガード戻り値の型](#route-guard-return-types)を返すことができます。

```ts
export const adminChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

詳細については、[CanActivateChildFnのAPIドキュメント](api/router/CanActivateChildFn)を参照してください。

### CanDeactivate {#candeactivate}

`CanDeactivate`ガードは、ユーザーがルートを離れることができるかどうかを決定します。一般的なシナリオは、未保存のフォームからのナビゲーションを防ぐことです。

以下のデフォルト引数にアクセスできます。

- `component: T` - 非アクティブ化されるコンポーネントインスタンス
- `currentRoute: ActivatedRouteSnapshot` - 現在のルートに関する情報を含みます
- `currentState: RouterStateSnapshot` - 現在のルーターの状態を含みます
- `nextState: RouterStateSnapshot` - ナビゲート先の次のルーターの状態を含みます

[標準のガード戻り値の型](#route-guard-return-types)を返すことができます。

```ts
export const unsavedChangesGuard: CanDeactivateFn<FormComponent> = (component: FormComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
```

詳細については、[CanDeactivateFnのAPIドキュメント](api/router/CanDeactivateFn)を参照してください。

### CanMatch {#canmatch}

`CanMatch`ガードは、パスのマッチング中にルートがマッチング可能かどうかを決定します。他のガードとは異なり、拒否された場合でもナビゲーションを完全にブロックするのではなく、他のマッチングするルートを試行します。これは、機能フラグ、A/Bテスト、または条件付きルート読み込みに役立ちます。

以下のデフォルト引数にアクセスできます。

- `route: Route` - 評価されているルート設定
- `segments: UrlSegment[]` - 以前の親ルート評価によって消費されていないURLセグメント

[標準のガード戻り値の型](#route-guard-return-types)を返すことができますが、`false`を返した場合、Angularはナビゲーションを完全にブロックするのではなく、他のマッチングするルートを試行します。

```ts
export const featureToggleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

また、同じパスに対して異なるコンポーネントを使用できます。

```ts
// 📄 routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard]
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard]
  }
]
```

この例では、ユーザーが`/dashboard`にアクセスすると、正しいガードにマッチする最初のものが使用されます。

詳細については、[CanMatchFnのAPIドキュメント](api/router/CanMatchFn)を参照してください。

## ルートへのガードの適用 {#applying-guards-to-routes}

ルートガードを作成したら、ルート定義でそれらを設定する必要があります。

ガードは、単一のルートに複数のガードを適用できるように、ルート設定で配列として指定されます。それらは配列に現れる順序で実行されます。

```ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { featureToggleGuard } from './guards/feature-toggle.guard';

const routes: Routes = [
  // Basic CanActivate - 認証が必要
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // 複数のCanActivateガード - 認証と管理者ロールが必要
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard]
  },

  // CanActivate + CanDeactivate - 未保存の変更チェック付き保護ルート
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard]
  },

  // CanActivateChild - すべての子ルートを保護
  {
    path: 'users', // /user - 保護されていない
    canActivateChild: [authGuard],
    children: [
      // /users/list - 保護されている
      { path: 'list', component: UserListComponent },
      // /users/detail/:id - 保護されている
      { path: 'detail/:id', component: UserDetailComponent }
    ]
  },

  // CanMatch - 機能フラグに基づいてルートを条件付きでマッチング
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canMatch: [featureToggleGuard]
  },

  // ベータ機能が無効な場合のフォールバックルート
  {
    path: 'beta-feature',
    component: ComingSoonComponent
  }
];
```
