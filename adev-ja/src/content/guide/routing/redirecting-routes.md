# ルートのリダイレクト

ルートのリダイレクトを使用すると、ユーザーをあるルートから別のルートへ自動的にナビゲートできます。ある住所宛の郵便物が別の住所に転送される郵便転送のように考えてください。これは、レガシーURLの処理、デフォルトルートの実装、またはアクセスコントロールの管理に役立ちます。

## リダイレクトの設定方法 {#how-to-configure-redirects}

ルート設定で`redirectTo`プロパティを使用してリダイレクトを定義できます。このプロパティは文字列を受け入れます。

```ts
import {Routes} from '@angular/router';

const routes: Routes = [
  // Simple redirect
  {path: 'marketing', redirectTo: 'newsletter'},

  // Redirect with path parameters
  {path: 'legacy-user/:id', redirectTo: 'users/:id'},

  // Redirect any other URLs that don't match
  // (also known as a "wildcard" redirect)
  {path: '**', redirectTo: '/login'},
];
```

この例では、3つのリダイレクトがあります。

1. ユーザーが`/marketing`パスにアクセスすると、`/newsletter`にリダイレクトされます。
2. ユーザーが`/legacy-user/:id`パスにアクセスすると、対応する`/users/:id`パスにルーティングされます。
3. ユーザーがルーターで定義されていないパスにアクセスすると、`**`ワイルドカードパス定義によりログインページにリダイレクトされます。

## `pathMatch`の理解

`pathMatch`プロパティは、AngularがURLをルートにどのように一致させるかを開発者が制御できるようにします。

`pathMatch`が受け入れる値は2つあります。

| 値         | 説明                                         |
| ---------- | -------------------------------------------- |
| `'full'`   | URLパス全体が完全に一致する必要があります    |
| `'prefix'` | URLの先頭のみが一致する必要があります        |

デフォルトでは、すべてのリダイレクトは`prefix`戦略を使用します。

### `pathMatch: 'prefix'` {#pathmatch-prefix}

`pathMatch: 'prefix'`はデフォルトの戦略であり、リダイレクトをトリガーするときにAngular Routerが後続のすべてのルートに一致させたい場合に理想的です。

```ts
export const routes: Routes = [
  // This redirect route is equivalent to…
  { path: 'news', redirectTo: 'blog },

  // This explicitly defined route redirect pathMatch
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];
```

この例では、`news`でプレフィックスされたすべてのルートは、対応する`/blog`にリダイレクトされます。以下は、ユーザーが古い`news`プレフィックスにアクセスしたときにリダイレクトされる例です。

- `/news` は `/blog` にリダイレクトされます
- `/news/article` は `/blog/article` にリダイレクトされます
- `/news/article/:id` は `/blog/article/:id` にリダイレクトされます

### `pathMatch: 'full'` {#pathmatch-full}

一方、`pathMatch: 'full'`は、Angular Routerに特定のパスのみをリダイレクトさせたい場合に役立ちます。

```ts
export const routes: Routes = [{path: '', redirectTo: '/dashboard', pathMatch: 'full'}];
```

この例では、ユーザーがルートURL（つまり`''`）にアクセスするたびに、ルーターはそのユーザーを`'/dashboard'`ページにリダイレクトします。

後続のページ（例: `/login`、`/about`、`/product/id`など）は無視され、リダイレクトはトリガーされません。

TIP: ルートページ（つまり`"/"`または`""`）でリダイレクトを設定する際は注意してください。`pathMatch: 'full'`を設定しない場合、ルーターはすべてのURLをリダイレクトします。

これをさらに説明するために、前のセクションの`news`の例で`pathMatch: 'full'`を使用した場合：

```ts
export const routes: Routes = [{path: 'news', redirectTo: '/blog', pathMatch: 'full'}];
```

これは次のことを意味します。

1. `/news`パスのみが`/blog`にリダイレクトされます。
2. `/news/articles`や`/news/articles/1`のような後続のセグメントは、新しい`/blog`プレフィックスでリダイレクトされません。

## 条件付きリダイレクト {#conditional-redirects}

`redirectTo`プロパティは、ユーザーがリダイレクトされる方法にロジックを追加するために、関数を受け入れることもできます。

[関数](api/router/RedirectFunction)は、ルートマッチングフェーズでは一部のデータが正確に不明であるため、[`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot)データの一部のみにアクセスできます。例としては、解決されたタイトル、遅延読み込みされたコンポーネントなどがあります。

通常、文字列または[`URLTree`](api/router/UrlTree)を返しますが、observableまたはpromiseを返すこともできます。

以下は、時間帯に基づいてユーザーが異なるメニューにリダイレクトされる例です。

```ts
import {Routes} from '@angular/router';
import {Menu} from './menu';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (activatedRouteSnapshot) => {
      const location = activatedRouteSnapshot.params['location'];
      const currentHour = new Date().getHours();

      // Check if user requested a specific meal via query parameter
      if (activatedRouteSnapshot.queryParams['meal']) {
        return `/restaurant/${location}/menu/${queryParams['meal']}`;
      }

      // Auto-redirect based on time of day
      if (currentHour >= 5 && currentHour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (currentHour >= 11 && currentHour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    },
  },

  // Destination routes
  {path: 'restaurant/:location/menu/breakfast', component: Menu},
  {path: 'restaurant/:location/menu/lunch', component: Menu},
  {path: 'restaurant/:location/menu/dinner', component: Menu},

  // Default redirect
  {path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full'},
];
```

詳細については、[RedirectFunctionのAPIドキュメント](api/router/RedirectFunction)を参照してください。

## 次のステップ {#next-steps}

`redirectTo`プロパティの詳細については、[APIドキュメント](api/router/Route#redirectTo)を参照してください。
