# ルートを定義する

ルートは、Angularアプリケーション内のナビゲーションのための基本的な構成要素として機能します。

## ルートとは {#what-are-routes}

Angularでは、**ルート**は特定のURLパスまたはパターンに対してどのコンポーネントをレンダリングするか、およびユーザーがそのURLにナビゲートしたときに何が起こるかに関する追加の構成オプションを定義するオブジェクトです。

次にルートの基本的な例を示します。

```ts
import {AdminPage} from './app-admin/app-admin.component';

const adminPage = {
  path: 'admin',
  component: AdminPage,
};
```

このルートの場合、ユーザーが`/admin`パスにアクセスすると、アプリケーションは`AdminPage`コンポーネントを表示します。

### アプリケーションでルートを管理する {#managing-routes-in-your-application}

ほとんどのプロジェクトでは、ファイル名に`routes`を含む別のファイルでルートを定義します。

ルートのコレクションは次のようになります。

```ts
import {Routes} from '@angular/router';
import {HomePage} from './home-page/home-page.component';
import {AdminPage} from './about-page/admin-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
];
```

Tip: Angular CLIでプロジェクトを生成した場合、ルートは`src/app/app.routes.ts`で定義されます。

### アプリケーションにルーターを追加する {#adding-the-router-to-your-application}

Angular CLIなしでAngularアプリケーションをブートストラップする場合、`providers`配列を含む構成オブジェクトを渡すことができます。

`providers`配列内で、`provideRouter`関数呼び出しとルートを追加することで、Angularルーターをアプリケーションに追加できます。

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};
```

## ルートURLパス {#route-url-paths}

### 静的なURLパス {#static-url-paths}

静的なURLパスとは、動的なパラメーターに基づいて変化しない、事前に定義されたパスを持つルートを指します。これらは`path`文字列に正確に一致し、固定された結果を持つルートです。

例としては次のものがあります。

- "/admin"
- "/blog"
- "/settings/account"

### ルートパラメーターでURLパスを定義する {#define-url-paths-with-route-parameters}

パラメーター化されたURLを使用すると、複数のURLを同じコンポーネントに許可しながら、URL内のパラメーターに基づいてデータを動的に表示する動的なパスを定義できます。

このタイプのパターンは、ルートの`path`文字列にパラメーターを追加し、各パラメーターの前にコロン(`:`)文字を付けることで定義できます。

IMPORTANT: パラメーターは、URLの[クエリ文字列](https://en.wikipedia.org/wiki/Query_string)内の情報とは異なります。
[このガイドでAngularのクエリパラメーターについて詳しく参照してください](/guide/routing/read-route-state#query-parameters)。

次の例は、URLを介して渡されたユーザーIDに基づいてユーザープロファイルコンポーネントを表示します。

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile/user-profile';

const routes: Routes = [{path: 'user/:id', component: UserProfile}];
```

この例では、`/user/leeroy`や`/user/jenkins`などのURLは`UserProfile`コンポーネントをレンダリングします。このコンポーネントは、`id`パラメーターを読み取り、それを使用してデータの取得などの追加作業を実行できます。[ルートパラメーターの読み取りの詳細については、ルート状態の読み取りガイドを参照してください](/guide/routing/read-route-state)。

有効なルートパラメーター名は、文字(a-z、A-Z)で始まり、次のもののみを含めることができます。

- 文字(a-z、A-Z)
- 数字(0-9)
- アンダーバー(\_)
- ハイフン(-)

複数のパラメーターを持つパスを定義できます。

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile/user-profile.component';
import {SocialMediaFeed} from './user-profile/social–media-feed.component';

const routes: Routes = [
  {path: 'user/:id/:social-media', component: SocialMediaFeed},
  {path: 'user/:id/', component: UserProfile},
];
```

この新しいパスにより、ユーザーは`/user/leeroy/youtube`や`/user/leeroy/bluesky`にアクセスし、ユーザーleeroyのパラメーターに基づいてそれぞれのソーシャルメディアフィードを見ることができます。

ルートパラメーターの読み取りの詳細については、[ルート状態の読み取り](/guide/routing/read-route-state)を参照してください。

### ワイルドカード {#wildcards}

特定のパスのすべてのルートをキャッチする必要がある場合、解決策は二重アスタリスク(`**`)で定義されるワイルドカードルートです。

一般的な例は、ページが見つかりませんコンポーネントの定義です。

```ts
import {Home} from './home/home.component';
import {UserProfile} from './user-profile/user-profile.component';
import {NotFound} from './not-found/not-found.component';

const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'user/:id', component: UserProfile},
  {path: '**', component: NotFound},
];
```

このルート配列では、ユーザーが`home`と`user/:id`以外のパスにアクセスすると、アプリケーションは`NotFound`コンポーネントを表示します。

Tip: ワイルドカードルートは通常、ルート配列の最後に配置されます。

## AngularがURLを照合する方法 {#how-angular-matches-urls}

ルートを定義する際、Angularは最初の一致が優先される戦略を使用するため、順序が重要です。これは、AngularがURLをルート`path`と照合すると、それ以上ルートの確認を停止することを意味します。結果として、常に、より具体的なルートを、より具体的でないルートの前に配置してください。

次の例は、最も具体的なものから最も具体的でないものへと定義されたルートを示しています。

```ts
const routes: Routes = [
  {path: '', component: HomeComponent}, // 空のパス
  {path: 'users/new', component: NewUserComponent}, // 静的、最も具体的
  {path: 'users/:id', component: UserDetailComponent}, // 動的
  {path: 'users', component: UsersComponent}, // 静的、具体的でない
  {path: '**', component: NotFoundComponent}, // ワイルドカード - 常に最後
];
```

ユーザーが`/users/new`にアクセスした場合、Angularルーターは次の手順を実行します。

1. `''`をチェック - 一致しません
1. `users/new`をチェック - 一致します！ここで停止します
1. 一致する可能性があるにもかかわらず、`users/:id`には到達しません
1. `users`には到達しません
1. `**`には到達しません

## ルートの読み込み戦略 {#route-loading-strategies}

Angularルーティングでルートとコンポーネントがどのように、いつ読み込まれるかを理解することは、応答性の高いWebアプリケーションを構築するために不可欠です。Angularは、読み込み動作を制御するための2つの主要な戦略を提供します。

1. **即時読み込み (Eagerly loaded)**: すぐに読み込まれるルートとコンポーネント
2. **遅延読み込み (Lazily loaded)**: 必要になったときにのみ読み込まれるルートとコンポーネント

それぞれのアプローチは、異なるシナリオに対して明確な利点を提供します。

### 即時読み込みされるコンポーネント {#eagerly-loaded-components}

`component`プロパティでルートを定義すると、参照されるコンポーネントは、ルート構成と同じJavaScriptバンドルの一部として即時読み込みされます。

```ts
import {Routes} from '@angular/router';
import {HomePage} from './components/home/home-page';
import {LoginPage} from './components/auth/login-page';

export const routes: Routes = [
  // HomePageとLoginPageはどちらもこの設定で直接参照されているため、
  // そのコードはこのファイルと同じJavaScriptバンドルに即時含まれます。
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
```

このようにルートコンポーネントを即時読み込みすることは、ブラウザが初期ページ読み込みの一部としてこれらのコンポーネントのすべてのJavaScriptをダウンロードして解析する必要があることを意味しますが、コンポーネントはAngularですぐに利用できます。

初期ページ読み込みに多くのJavaScriptを含めると初期読み込み時間は遅くなりますが、ユーザーがアプリケーション内を移動する際のよりシームレスな遷移につながる可能性があります。

### 遅延読み込みされるコンポーネントとルート {#lazily-loaded-components-and-routes}

`loadComponent`プロパティを使用すると、そのルートがアクティブになる時点でのみ、コンポーネントのJavaScriptを遅延読み込みできます。`loadChildren`プロパティは、ルートマッチング時に子ルートを遅延読み込みします。

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

`loadComponent`と`loadChildren`プロパティは、それぞれAngularコンポーネントまたはルートのセットに解決されるPromiseを返すローダー関数を受け入れます。ほとんどの場合、この関数は標準の[JavaScript動的インポートAPI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)を使用します。ただし、任意の非同期ローダー関数も使用できます。

遅延読み込みされるファイルが`default`エクスポートを使用している場合、エクスポートされたクラスを選択するための追加の`.then`呼び出しなしで、`import()`プロミスを直接返すことができます。

遅延読み込みルートは、初期バンドルからJavaScriptの大部分を削除することで、Angularアプリケーションの読み込み速度を大幅に向上させることができます。これらのコード部分は、ユーザーが対応するルートにアクセスしたときにのみルーターが要求する個別のJavaScript「チャンク」にコンパイルされます。

### 注入コンテキストでの遅延読み込み {#injection-context-lazy-loading}

ルーターは`loadComponent`と`loadChildren`を**現在のルートの注入コンテキスト**内で実行します。これにより、これらのローダー関数内で[`inject`](/api/core/inject)を呼び出して、そのルートで宣言されたプロバイダー、階層的な依存性の注入を介して親ルートから継承されたプロバイダー、またはグローバルに利用可能なプロバイダーにアクセスできます。これにより、コンテキストを認識した遅延読み込みが可能になります。

```ts
import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {FeatureFlags} from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // ルートのインジェクションコンテキスト内で実行されます
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard')
        : import('./dashboard/basic-dashboard');
    },
  },
];
```

### 即時ルートと遅延ルートのどちらを使用すべきか {#should-i-use-an-eager-or-a-lazy-route}

ルートが即時読み込みか遅延読み込みかを決定する際には、多くの要素を考慮する必要があります。

一般的に、プライマリランディングページには即時読み込みが推奨され、他のページは遅延読み込みされます。

NOTE: 遅延ルートは、ユーザーが要求する初期データの量を減らすという先行的なパフォーマンス上の利点がありますが、望ましくない可能性のある将来のデータ要求を追加します。これは、複数のレベルでのネストされた遅延読み込みを扱う場合に特に当てはまり、パフォーマンスに大きな影響を与える可能性があります。

## リダイレクト {#redirects}

コンポーネントをレンダリングする代わりに、別のルートにリダイレクトするルートを定義できます。

```ts
import {BlogComponent} from './home/blog.component';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
];
```

ルートを変更または削除した場合でも、一部のユーザーは古いリンクやブックマークをクリックしてそのルートにアクセスする可能性があります。そのようなユーザーを「見つかりません」ページではなく、適切な代替ルートに誘導するためにリダイレクトを追加できます。

## ページタイトル {#page-titles}

各ルートには**タイトル**を関連付けることができます。ルートがアクティブになると、Angularは[ページタイトル](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)を自動的に更新します。アクセシブルな体験を作成するためにこれらのタイトルが必要となるため、アプリケーションに適切なページタイトルを常に定義してください。

```ts
import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page',
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us',
  },
];
```

ページの `title` プロパティは、[`ResolveFn`](/api/router/ResolveFn)を使用してリゾルバー関数に動的に設定できます。

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
  ...{
    path: 'products',
    component: ProductsComponent,
    title: titleResolver,
  },
];
```

ルートタイトルは、[`TitleStrategy`](/api/router/TitleStrategy) 抽象クラスを継承するサービスを介しても設定できます。デフォルトでは、Angularは[`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy)を使用します。

### ページタイトルのためのTitleStrategyの使用 {#using-titlestrategy-for-page-titles}

ドキュメントタイトルの構成方法を一元的に制御する必要がある高度なシナリオでは、`TitleStrategy`を実装します。

`TitleStrategy`は、Angularが使用するデフォルトのタイトル戦略をオーバーライドするために提供できるトークンです。カスタムの`TitleStrategy`を提供して、アプリケーションのサフィックスの追加、パンくずリストからのタイトルのフォーマット、ルートデータからのタイトルの動的生成などの規約を実装できます。

```ts
import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleStrategy, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // PageTitleは、ルートの"Title"が設定されている場合はそれと等しくなります
    // 設定されていない場合は、index.htmlで指定された"title"を使用します
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

カスタム戦略を使用するには、アプリケーションレベルで`TitleStrategy`トークンを使用してそれを提供します。

```ts
import {provideRouter, TitleStrategy} from '@angular/router';
import {AppTitleStrategy} from './app-title.strategy';

export const appConfig = {
  providers: [provideRouter(routes), {provide: TitleStrategy, useClass: AppTitleStrategy}],
};
```

## 依存性の注入のためのルートレベルプロバイダー {#route-level-providers-for-dependency-injection}

各ルートには、[依存性の注入](/guide/di)を介してそのルートのコンテンツに依存性を提供する`providers`プロパティがあります。

これが役立つ一般的なシナリオには、ユーザーが管理者であるかどうかに基づいて異なるサービスを持つアプリケーションが含まれます。

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [AdminService, {provide: ADMIN_API_KEY, useValue: '12345'}],
    children: [
      {path: 'users', component: AdminUsersComponent},
      {path: 'teams', component: AdminTeamsComponent},
    ],
  },
  // ... other application routes that don't
  //     have access to ADMIN_API_KEY or AdminService.
];
```

このコードサンプルでは、`admin`パスには`ADMIN_API_KEY`という保護されたデータプロパティが含まれており、そのセクション内の子にのみ利用できます。結果として、他のパスは`ADMIN_API_KEY`を介して提供されるデータにアクセスできません。

Angularのプロバイダーと注入に関する詳細については、[依存性の注入ガイド](/guide/di)を参照してください。

## ルートにデータを関連付ける {#associating-data-with-routes}

ルートデータを使用すると、ルートに追加情報を付加できます。このデータに基づいてコンポーネントの動作を設定できます。

ルートデータを扱う方法は2つあります。定数として保持される静的データと、実行時の条件に基づいて変化する動的データです。

### 静的データ {#static-data}

`data`プロパティを介して任意の静的データをルートに関連付けることで、ルート固有のメタデータ（例: 分析トラッキング、権限など）を一元化できます。

```ts
import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ProductsComponent} from './products/products.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: {analyticsId: '456'},
  },
  {
    path: '',
    component: HomeComponent,
    data: {analyticsId: '123'},
  },
];
```

このコードサンプルでは、ホームページとアバウトページが特定の`analyticsId`で構成されており、それぞれのコンポーネントでページトラッキング分析に使用されます。

この静的データは`ActivatedRoute`を注入することで読み取ることができます。詳細については、[ルート状態の読み取り](/guide/routing/read-route-state)を参照してください。

### データリゾルバーによる動的データ {#dynamic-data-with-data-resolvers}

ルートに動的データを提供する必要がある場合は、[ルートデータリゾルバーに関するガイド](/guide/routing/data-resolvers)を参照してください。

## ネストされたルート {#nested-routes}

ネストされたルートは、子ルートとも呼ばれ、URLに基づいてサブビューが変化する、より複雑なナビゲーションルートを管理するための一般的な手法です。

<img alt="ネストされたルートを示す図" src="assets/images/guide/router/nested-routing-diagram.svg">

`children`プロパティを使用して、任意のルート定義に子ルートを追加できます。

```ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductComponent,
    children: [
      {
        path: 'info',
        component: ProductInfoComponent,
      },
      {
        path: 'reviews',
        component: ProductReviewsComponent,
      },
    ],
  },
];
```

上記の例では、ユーザーがURLに基づいて製品情報またはレビューのどちらを表示するかを変更できる製品ページのルートを定義しています。

`children`プロパティは`Route`オブジェクトの配列を受け入れます。

子ルートを表示するには、親コンポーネント（上記の例では`ProductComponent`）に独自の`<router-outlet>`を含めます。

```angular-html
<!-- ProductComponent -->
<article>
  <h1>Product {{ id }}</h1>
  <router-outlet />
</article>
```

設定に子ルートを追加し、コンポーネントに`<router-outlet>`を追加すると、子ルートに一致するURL間のナビゲーションは、ネストされたアウトレットのみを更新します。

## 次のステップ {#next-steps}

[アウトレットでルートのコンテンツを表示する方法](/guide/routing/show-routes-with-outlets)を学びましょう。

