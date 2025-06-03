# アウトレットにルートを表示する

`RouterOutlet`ディレクティブは、ルーターが現在のURLに対応するコンポーネントをレンダリングする場所を示すプレースホルダーです。

```angular-html
<app-header />
<router-outlet />  <!-- Angularはここにルートコンテンツを挿入します -->
<app-footer />
```

```angular-ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

この例では、アプリケーションに次のルートが定義されている場合:

```angular-ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Our Products'
  }
];
```

ユーザーが`/products`にアクセスすると、Angularは次のようにレンダリングします。

```angular-html
<app-header></app-header>
<app-products></app-products>
<app-footer></app-footer>
```

ユーザーがホームページに戻ると、Angularは次のようにレンダリングします。

```angular-html
<app-header></app-header>
<app-home></app-home>
<app-footer></app-footer>
```

ルートを表示するとき、`<router-outlet>`要素は将来のナビゲーションのための参照点としてDOMに存在し続けます。Angularはルーティングされたコンテンツをアウトレット要素の直後に兄弟要素として挿入します。

```angular-html
<!-- コンポーネントのテンプレートの内容 -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- ユーザーが/adminにアクセスしたときにページにレンダリングされるコンテンツ -->
<app-header>...</app-header>
<router-outlet></router-outlet>
<app-admin-page>...</app-admin-page>
<app-footer>...</app-footer>
```

## 子ルートでルートをネストする {#nesting-routes-with-child-routes}

アプリケーションが複雑になるにつれて、ルートコンポーネント以外のコンポーネントに相対的なルートを作成したい場合があります。これにより、URLが変更されたときにアプリケーションの一部のみが変更されるような体験を作成でき、ユーザーがページ全体がリフレッシュされたように感じるのを避けることができます。

これらの種類のネストされたルートは子ルートと呼ばれます。これは、`AppComponent`内の`<router-outlet>`に加えて、アプリケーションに2つ目の`<router-outlet>`を追加することを意味します。

この例では、`Settings`コンポーネントは、ユーザーが選択した内容に基づいて目的のパネルを表示します。子ルートについて気づくユニークな点の1つは、コンポーネントが独自の`<nav>`と`<router-outlet>`を持つことが多いことです。

```angular-html
<h1>Settings</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Profile</a></li>
    <li><a routerLink="security">Security</a></li>
  </ul>
</nav>
<router-outlet />
```

子ルートは他のルートと同様に、`path`と`component`の両方が必要です。唯一の違いは、子ルートを親ルート内の`children`配列に配置することです。

```angular-ts
const routes: Routes = [
  {
    path: 'settings-component',
    component: SettingsComponent, // これはテンプレートに<router-outlet>を持つコンポーネントです
    children: [
      {
        path: 'profile', // 子ルートのパス
        component: ProfileComponent, // ルーターがレンダリングする子ルートコンポーネント
      },
      {
        path: 'security',
        component: SecurityComponent, // ルーターがレンダリングする別の子ルートコンポーネント
      },
    ],
  },
];
```

`routes`と`<router-outlet>`の両方が正しく設定されると、アプリケーションはネストされたルートを使用するようになります！

## 名前付きアウトレットによるセカンダリールート {#secondary-routes-with-named-outlets}

ページには複数のアウトレットがある場合があります。各アウトレットに名前を割り当てて、どのコンテンツがどのアウトレットに属するかを指定できます。

```angular-html
<app-header />
<router-outlet />
<router-outlet name='read-more' />
<router-outlet name='additional-actions' />
<app-footer />
```

各アウトレットは一意の名前を持つ必要があります。名前は動的に設定または変更できません。デフォルトでは、名前は`'primary'`です。

Angularは、各ルートで定義された`outlet`プロパティにアウトレットの名前を一致させます。

```angular-ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## アウトレットのライフサイクルイベント {#outlet-lifecycle-events}

ルーターアウトレットが発行できるライフサイクルイベントは4つあります。

| イベント       | 説明                                           |
| ------------ | ---------------------------------------------- |
| `activate`   | 新しいコンポーネントがインスタンス化されたとき |
| `deactivate` | コンポーネントが破棄されたとき                 |
| `attach`     | `RouteReuseStrategy`がサブツリーをアタッチするようアウトレットに指示したとき |
| `detach`     | `RouteReuseStrategy`がサブツリーをデタッチするようアウトレットに指示したとき |

標準のイベントバインディング構文でイベントリスナーを追加できます。

```angular-html
<router-outlet
  (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'
  (attach)='onAttach($event)'
  (detach)='onDetach($event)'
/>
```

詳細については、[RouterOutletのAPIドキュメント](/api/router/RouterOutlet?tab=api)を参照してください。

## 次のステップ {#next-steps}

Angularルーターで[ルートへナビゲーションする](/guide/routing/navigate-to-routes)方法を学びましょう。
