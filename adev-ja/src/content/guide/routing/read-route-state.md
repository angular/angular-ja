# ルートの状態を読み取る {#read-route-state}

Angularルーターを使用すると、ルートに関連付けられた情報を読み取り、使用して、応答性が高く、コンテキストを認識するコンポーネントを作成できます。

## ActivatedRouteで現在のルートに関する情報を取得する {#get-information-about-the-current-route-with-activatedroute}

`ActivatedRoute`は、現在のルートに関連付けられたすべての情報を提供する`@angular/router`からのサービスです。

```angular-ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
})
export class ProductComponent {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

`ActivatedRoute`は、ルートに関するさまざまな情報を提供できます。一般的なプロパティには次のものがあります。

| プロパティ      | 詳細                                                                                                                           |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | ルートパスの`Observable`。ルートパスの各部分が文字列の配列として表現されます。                           |
| `data`        | ルートに提供される`data`オブジェクトを含む`Observable`。また、resolveガードから解決された値も含まれます。 |
| `params`      | ルートに固有の必須およびオプションのパラメーターを含む`Observable`。                                         |
| `queryParams` | すべてのルートで利用可能なクエリパラメーターを含む`Observable`。                                                       |

ルート内でアクセスできるものの完全なリストについては、[`ActivatedRoute` APIドキュメント](/api/router/ActivatedRoute)を参照してください。

## ルートスナップショットを理解する {#understanding-route-snapshots}

ページナビゲーションは時間の経過とともに発生するイベントであり、ルートスナップショットを取得することで、特定の時点でのルーターの状態にアクセスできます。

ルートスナップショットには、パラメーター、データ、子ルートなど、ルートに関する本質的な情報が含まれています。さらに、スナップショットは静的であり、将来の変更を反映しません。

ルートスナップショットにアクセスする方法の例を次に示します。

```angular-ts
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({ ... })
export class UserProfileComponent {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    // URLの例: https://www.angular.dev/users/123?role=admin&status=active#contact

    // スナップショットからルートパラメーターにアクセス
    this.userId = this.route.snapshot.paramMap.get('id');

    // 複数のルート要素にアクセス
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url,           // https://www.angular.dev
      // ルートパラメーターオブジェクト: {id: '123'}
      params: snapshot.params,
      // クエリパラメーターオブジェクト: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams,  // クエリパラメーター
    });
  }
}
```

アクセスできるすべてのプロパティの完全なリストについては、[`ActivatedRoute` APIドキュメント](/api/router/ActivatedRoute)と[`ActivatedRouteSnapshot` APIドキュメント](/api/router/ActivatedRouteSnapshot)を参照してください。

## ルート上のパラメーターを読み取る {#reading-parameters-on-a-route}

開発者はルートからルートパラメーターとクエリパラメーターの2種類のパラメーターを利用できます。

### ルートパラメーター {#route-parameters}

ルートパラメーターを使用すると、URLを介してコンポーネントにデータを渡すことができます。これは、ユーザーIDや製品IDなど、URL内の識別子に基づいて特定のコンテンツを表示したい場合に役立ちます。

パラメーター名の前にコロン (`:`) を付けることで、[ルートパラメーターを定義](/guide/routing/define-routes#define-url-paths-with-route-parameters)できます。

```angular-ts
import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];
```

`route.params`を購読することでパラメーターにアクセスできます。

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetailComponent {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // ルートパラメーターにアクセス
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }
}
```

### クエリパラメーター {#query-parameters}

[クエリパラメーター](https://developer.mozilla.org/ja-JP/docs/Web/API/URLSearchParams)は、ルート構造に影響を与えることなく、URLを介してオプションのデータを渡す柔軟な方法を提供します。ルートパラメーターとは異なり、クエリパラメーターはナビゲーションイベント間で永続化でき、フィルタリング、ソート、ページネーション、その他のステートフルなUI要素の処理に最適です。

```angular-ts
// 単一パラメーターの構造
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: { category: 'electronics' }
});

// 複数パラメーター
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1
  }
});
```

`route.queryParams`でクエリパラメーターにアクセスできます。

次に、製品リストの表示方法に影響を与えるクエリパラメーターを更新する`ProductListComponent`の例を示します。

```angular-ts
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Products list -->
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // クエリパラメーターにリアクティブにアクセス
    this.route.queryParams.subscribe(params => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // 新しいクエリパラメーターでURLを更新
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge' // 他のクエリパラメーターを保持
    });
  }
}
```

この例では、ユーザーは選択要素を使用して製品リストを名前または価格でソートできます。関連する変更ハンドラーはURLのクエリパラメーターを更新し、それが更新されたクエリパラメーターを読み取り、製品リストを更新できる変更イベントをトリガーします。

詳細については、[QueryParamsHandlingに関する公式ドキュメント](/api/router/QueryParamsHandling)を参照してください。

### マトリックスパラメーター {#matrix-parameters}

マトリックスパラメーターは、ルート全体に適用されるのではなく、特定のURLセグメントに属するオプションのパラメーターです。`?` の後に現れてグローバルに適用されるクエリパラメーターとは異なり、マトリックスパラメーターはセミコロン (`;`) を使用し、個々のパスセグメントにスコープされます。

マトリックスパラメーターは、ルート定義やマッチング動作に影響を与えることなく、特定のルートセグメントに補助的なデータを渡す必要がある場合に役立ちます。クエリパラメーターと同様に、ルート設定で定義する必要はありません。

```ts
// URL形式: /path;key=value
// 複数のパラメーター: /path;key1=value1;key2=value2

// マトリックスパラメーターでナビゲート
this.router.navigate(['/awesome-products', { view: 'grid', filter: 'new' }]);
// 結果のURL: /awesome-products;view=grid;filter=new
```

**ActivatedRouteの使用**

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts  {
  private route = inject(ActivatedRoute);

  constructor() {
    // paramsを介してマトリックスパラメーターにアクセス
    this.route.params.subscribe((params) => {
      const view = params['view']; // 例: 'grid'
      const filter = params['filter']; // 例: 'new'
    });
  }
}
```

NOTE: `ActivatedRoute`を使用する代わりに、`withComponentInputBinding`を使用する場合、マトリックスパラメーターはコンポーネント入力にもバインドされます。

## RouterLinkActiveでアクティブな現在のルートを検出する {#detect-active-current-route-with-routerlinkactive}

`RouterLinkActive`ディレクティブを使用すると、現在の有効なルートに基づいてナビゲーション要素を動的にスタイル設定できます。これは、ユーザーにアクティブなルートが何かを知らせるために、ナビゲーション要素でよく使用されます。

```angular-html
<nav>
  <a class="button"
     routerLink="/about"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    About
  </a> |
  <a class="button"
     routerLink="/settings"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    Settings
  </a>
</nav>
```

この例では、URLが対応する`routerLink`と一致すると、Angularルーターは`active-button`クラスを正しいアンカーリンクに適用し、`ariaCurrentWhenActive`を`page`に設定します。

要素に複数のクラスを追加する必要がある場合は、スペース区切りの文字列または配列を使用できます。

```angular-html
<!-- スペース区切りの文字列構文 -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- 配列構文 -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

`routerLinkActive`に値を指定すると、`ariaCurrentWhenActive`にも同じ値が定義されます。これにより、視覚障害のあるユーザー（適用されている異なるスタイルを認識できない場合がある）もアクティブなボタンを識別できます。

ariaに異なる値を定義したい場合は、`ariaCurrentWhenActive`ディレクティブを使用して明示的に値を設定する必要があります。

### ルートマッチング戦略 {#route-matching-strategy}

デフォルトでは、`RouterLinkActive`はルート内のすべての祖先を一致と見なします。

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link">
  User
</a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link">
  Role
</a>
```

ユーザーが`/user/jane/role/admin`にアクセスすると、両方のリンクに`active-link`クラスが適用されます。

### RouterLinkActiveを厳密なルート一致にのみ適用する {#only-apply-routerlinkactive-on-exact-route-matches}

厳密な一致の場合にのみクラスを適用したい場合は、`routerLinkActiveOptions`ディレクティブに`exact: true`という値を含む設定オブジェクトを提供する必要があります。

```angular-html
<a [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

ルートがどのように一致するかをより正確にしたい場合、`exact: true`は実際には一致オプションの完全なセットに対するシンタックスシュガーであることに注意する価値があります。

```angular-ts
// `exact: true`は以下と同等です
{
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact',
}

// `exact: false`は以下と同等です
{
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset',
}
```

詳細については、[isActiveMatchOptionsに関する公式ドキュメント](/api/router/IsActiveMatchOptions)を参照してください。

### RouterLinkActiveを祖先に適用する {#apply-routerlinkactive-to-an-ancestor}

`RouterLinkActive`ディレクティブは、開発者が要素を希望どおりにスタイル設定できるように、祖先要素にも適用できます。

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

詳細については、[RouterLinkActiveのAPIドキュメント](/api/router/RouterLinkActive)を参照してください。
