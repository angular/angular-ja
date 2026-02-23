# ルートへのナビゲーション

`RouterLink`ディレクティブは、Angularのナビゲーションに対する宣言的なアプローチです。これにより、Angularのルーティングシステムとシームレスに統合される標準のアンカー要素（`<a>`）を使用できます。

## RouterLinkの使い方 {#how-to-use-routerlink}

通常のアンカー要素`<a>`に`href`属性を使用する代わりに、Angularルーティングを活用するために、適切なパスを持つ`RouterLink`ディレクティブを追加します。

```angular-ts
import {RouterLink} from '@angular/router';

@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `,
  imports: [RouterLink],
  ...
})
export class App {}
```

### 絶対リンクと相対リンクの使用 {#using-absolute-or-relative-links}

Angularルーティングにおける**相対URL**は、現在のルートの場所に対するナビゲーションパスを定義できます。これは、プロトコル（例: `http://`）と**ルートドメイン**（例: `google.com`）を含む完全なパスを持つ**絶対URL**とは対照的です。

```angular-html
<!-- Absolute URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Relative URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

この例では、最初の例は、基本概念ページに対してプロトコル（つまり`https://`）とルートドメイン（つまり`angular.dev`）が明示的に定義された完全なパスを含んでいます。対照的に、2番目の例は、ユーザーがすでに`/essentials`の正しいルートドメインにいることを前提としています。

一般的に、相対URLは、ルーティング階層内での絶対位置を知る必要がないため、アプリケーション全体でより保守しやすく、推奨されます。

### 相対URLの仕組み {#how-relative-urls-work}

Angularルーティングには、相対URLを定義するための2つの構文があります。文字列と配列です。

```angular-html
<!-- Navigates user to /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

HELPFUL: 文字列を渡すのが、相対URLを定義する最も一般的な方法です。

相対URLで動的なパラメーターを定義する必要がある場合は、配列構文を使用します。

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

さらに、Angularルーティングでは、相対パスの先頭にスラッシュ（`/`）を付けるかどうかによって、パスを現在のURLに対する相対パスにするか、ルートドメインに対する相対パスにするかを指定できます。

たとえば、ユーザーが`example.com/settings`にいる場合、さまざまなシナリオで異なる相対パスを定義する方法を次に示します。

```angular-html
<!-- Navigates to /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navigates to /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>
```

## ルートへのプログラムによるナビゲーション {#programmatic-navigation-to-routes}

`RouterLink`がテンプレートでの宣言的なナビゲーションを処理する一方で、Angularはロジック、ユーザーアクション、またはアプリケーションの状態に基づいてナビゲートする必要があるシナリオのために、プログラムによるナビゲーションを提供します。`Router`を注入することで、ルートへ動的にナビゲートし、パラメーターを渡し、TypeScriptコードでナビゲーションの動作を制御できます。

### `router.navigate()` {#router-navigate}

`router.navigate()`メソッドを使用して、URLパス配列を指定することで、ルート間をプログラムでナビゲートできます。

```angular-ts
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: ` <button (click)="navigateToProfile()">View Profile</button> `,
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    // Standard navigation
    this.router.navigate(['/profile']);

    // With route parameters
    this.router.navigate(['/users', userId]);

    // With query parameters
    this.router.navigate(['/search'], {
      queryParams: {category: 'books', sort: 'price'},
    });

    // With matrix parameters
    this.router.navigate(['/products', {featured: true, onSale: true}]);
  }
}
```

`router.navigate()`は、シンプルおよび複雑なルーティングシナリオの両方をサポートしており、ルートパラメーター、[クエリパラメーター](/guide/routing/read-route-state#query-parameters)を渡し、ナビゲーションの動作を制御できます。

また、`relativeTo`オプションを使用して、ルーティングツリー内のコンポーネントの場所に対する動的なナビゲーションパスを構築できます。

```angular-ts
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Navigate to a sibling route
  navigateToEdit() {
    // From: /users/123
    // To:   /users/123/edit
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  // Navigate to parent
  navigateToParent() {
    // From: /users/123
    // To:   /users
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
```

### `router.navigateByUrl()` {#router-navigatebyurl}

`router.navigateByUrl()`メソッドは、配列セグメントではなくURLパス文字列を使用してプログラムでナビゲートする直接的な方法を提供します。このメソッドは、完全なURLパスがあり、絶対ナビゲーションを実行する必要がある場合に最適です。特に、外部から提供されるURLやディープリンクのシナリオで役立ちます。

```ts
// Standard route navigation
router.navigateByUrl('/products');

// Navigate to nested route
router.navigateByUrl('/products/featured');

// Complete URL with parameters and fragment
router.navigateByUrl('/products/123?view=details#reviews');

// Navigate with query parameters
router.navigateByUrl('/search?category=books&sortBy=price');

// With matrix parameters
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false');
```

履歴内の現在のURLを置き換える必要がある場合、`navigateByUrl`は`replaceUrl`オプションを持つ設定オブジェクトも受け入れます。

```ts
// Replace current URL in history
router.navigateByUrl('/checkout', {
  replaceUrl: true,
});
```

## 次のステップ {#next-steps}

レスポンシブでコンテキストを認識するコンポーネントを作成するために、[ルートの状態を読み取る](/guide/routing/read-route-state)方法を学びましょう。
