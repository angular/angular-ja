# ルーティングの一般的なタスク

このトピックでは、Angularルーターをアプリケーションに追加することと関連する一般的なタスクの多くを実装する方法について説明します。

## ルーティングが有効なアプリケーションの生成

次のコマンドは、Angular CLIを使用して、アプリケーションルートを含む基本的なAngularアプリケーションを生成します。次の例では、アプリケーション名は `routing-app` です。

```shell
ng new routing-app
```

### ルーティング用のコンポーネントの追加

Angularルーターを使用するには、アプリケーションに少なくとも2つのコンポーネントが必要です。これにより、一方のコンポーネントからもう一方のコンポーネントにナビゲートできます。 CLIを使用してコンポーネントを作成するには、コマンドラインで次のように入力します。ここで、`first` はコンポーネントの名前です。

```shell
ng generate component first
```

この手順を2番目のコンポーネントに対して繰り返しますが、異なる名前を付けます。ここでは、新しい名前は `second` です。

<docs-code language="shell">

ng generate component second

</docs-code>

CLIは自動的に `Component` を追加するため、`first-component` と書くと、コンポーネントは `FirstComponentComponent` になります。

<docs-callout title="`base href`">

このガイドは、CLIにより生成されたAngularアプリケーションで動作します。手動で作業している場合は、`index.html` ファイルの `<head>` に `<base href="/">` があることを確認してください。
これは、`app` フォルダーがアプリケーションルートであり、`"/"` を使用することを前提としています。

</docs-callout>

### 新しいコンポーネントのインポート

新しいコンポーネントを使用するには、ファイルの先頭に示すように、`app.routes.ts` にインポートします。

<docs-code language="ts">

import {FirstComponent} from './first/first.component';
import {SecondComponent} from './second/second.component';

</docs-code>

## 基本的なルートの定義

ルートを作成するには、3つの基本的なビルディングブロックがあります。

ルートを `app.config.ts` にインポートし、`provideRouter` 関数に追加します。以下は、CLIを使用したデフォルトの `ApplicationConfig` です。

<docs-code language="ts">

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

</docs-code>

Angular CLIはこの手順を実行します。ただし、手動でアプリケーションを作成している場合、または既存のCLI以外のアプリケーションで作業している場合は、インポートと構成が正しいことを確認してください。

<docs-workflow>

<docs-step title="ルートの `Routes` 配列を設定する">

Angular CLIはこの手順を自動的に実行します。

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="`Routes` 配列にルートを定義する">

この配列の各ルートは、2つのプロパティを含むJavaScriptオブジェクトです。最初のプロパティ `path` は、ルートのURLパスを定義します。2番目のプロパティ `component` は、対応するパスにAngularが使用するコンポーネントを定義します。

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
];
```

</docs-step>

<docs-step title="アプリケーションにルートを追加する">

ルートを定義したので、アプリケーションに追加します。まず、2つのコンポーネントへのリンクを追加します。ルートを追加するアンカータグを `routerLink` 属性に割り当てます。属性の値を、ユーザーが各リンクをクリックしたときに表示するコンポーネントに設定します。次に、コンポーネントテンプレートを更新して `<router-outlet>` を含めます。この要素は、Angularに選択したルートのコンポーネントでアプリケーションビューを更新するよう通知します。

```angular-html
<h1>Angular Router App</h1>
<nav>
  <ul>
    <li><a routerLink="/first-component" routerLinkActive="active" ariaCurrentWhenActive="page">First Component</a></li>
    <li><a routerLink="/second-component" routerLinkActive="active" ariaCurrentWhenActive="page">Second Component</a></li>
  </ul>
</nav>
<!-- The routed views render in the <router-outlet>-->
<router-outlet />
```

`AppComponent` の `imports` 配列に `RouterLink`、`RouterLinkActive`、`RouterOutlet` を追加する必要もあります。

```ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'routing-app';
}
```

</docs-step>

</docs-workflow>

### ルートの順序 {#route-order}

ルートの順序は重要です。なぜなら、`Router` はルートの照合時に最初に一致したものが勝ちという戦略を使用するため、より具体的なルートは、より一般的なルートよりも上に配置する必要があるからです。
静的なパスを持つルートを最初にリストし、次に空のパスルートをリストします。これは、デフォルトのルートと一致します。
[ワイルドカードルート](guide/routing/common-router-tasks#setting-up-wildcard-routes) は、最後に来ます。これは、すべてのURLと一致します。`Router` は、他のルートが最初に一致しない場合にのみ、このルートを選択します。

## ルート情報の取得

多くの場合、ユーザーがアプリケーションをナビゲートするときに、一方のコンポーネントからもう一方のコンポーネントに情報を渡す必要があります。
たとえば、食料品のショッピングリストを表示するアプリケーションを考えてみてください。
リストの各アイテムには、一意の `id` があります。
アイテムを編集するには、ユーザーは[編集]ボタンをクリックします。これにより、`EditGroceryItem` コンポーネントが開きます。
そのコンポーネントは、食料品アイテムの `id` を取得して、ユーザーに正しい情報を表示できるようにする必要があります。

ルートを使用して、このタイプの情報をアプリケーションコンポーネントに渡します。
これを行うには、`provideRouter` を使用した [withComponentInputBinding](api/router/withComponentInputBinding) 機能、または `RouterModule.forRoot` の `bindToComponentInputs` オプションを使用します。

ルートから情報を入手するには:

<docs-workflow>

<docs-step title="`withComponentInputBinding` を追加する">

`provideRouter` メソッドに `withComponentInputBinding` 機能を追加します。

```ts
providers: [
  provideRouter(appRoutes, withComponentInputBinding()),
]
```

</docs-step>

<docs-step title="コンポーネントに `Input` を追加する">

パラメータの名前と一致する `Input` を持つようにコンポーネントを更新します。

```ts
@Input()
set id(heroId: string) {
  this.hero$ = this.service.getHero(heroId);
}
```

NOTE: すべてのルートデータを、キーと値のペアでコンポーネントの入力にバインドできます。静的なルートデータ、解決されたルートデータ、パスパラメータ、マトリックスパラメータ、クエリパラメータです。
親コンポーネントのルート情報を使用する場合は、ルーターの `paramsInheritanceStrategy` オプションを設定する必要があります。
`withRouterConfig({paramsInheritanceStrategy: 'always'})`

</docs-step>

</docs-workflow>

## ワイルドカードルートの設定 {#setting-up-wildcard-routes}

正常に機能するアプリケーションは、ユーザーがアプリケーションに存在しない部分にナビゲートしようとした場合、正常に処理する必要があります。
アプリケーションにこの機能を追加するには、ワイルドカードルートを設定します。
Angularルーターは、要求されたURLがルーターパスと一致しない場合、このルートを選択します。

ワイルドカードルートを設定するには、`routes` 定義に次のコードを追加します。

<docs-code>

{ path: '**', component: <component-name> }

</docs-code>

2つのアスタリスク `**` は、Angularにこの `routes` 定義がワイルドカードルートであることを示します。
`component` プロパティには、アプリケーション内の任意のコンポーネントを定義できます。
一般的な選択肢としては、アプリケーション固有の `PageNotFoundComponent` があります。これは、ユーザーに [404 ページを表示](guide/routing/common-router-tasks#displaying-a-404-page) するために定義できます。または、アプリケーションのメインコンポーネントへのリダイレクトです。
ワイルドカードルートは、最後のルートです。これは、すべてのURLと一致します。
ルートの順序が重要な理由の詳細については、[ルートの順序](guide/routing/common-router-tasks#route-order) を参照してください。

## 404 ページの表示

404ページを表示するには、[ワイルドカードルート](guide/routing/common-router-tasks#setting-up-wildcard-routes) を設定します。このルートの `component` プロパティは、404ページに使用したいコンポーネントに設定します。

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

`path` が `**` の最後のルートは、ワイルドカードルートです。
ルーターは、要求されたURLがリストの先頭にあるパスと一致しない場合、このルートを選択し、ユーザーを `PageNotFoundComponent` に送信します。

## リダイレクトの設定 {#setting-up-redirects}

リダイレクトを設定するには、リダイレクト元の `path`、リダイレクト先の `component`、およびルーターにURLとどのように一致させるかを指示する `pathMatch` 値を指定してルートを構成します。

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

この例では、3番目のルートはリダイレクトです。そのため、ルーターは `first-component` ルートをデフォルトで選択します。
このリダイレクトは、ワイルドカードルートの前にあることに注意してください。
ここでは、`path: ''` は、初期の相対URL \(`''`\) を使用するという意味です。

場合によっては、リダイレクトは単純な静的なリダイレクトではありません。
`redirectTo` プロパティは、文字列または `UrlTree` を返す、より複雑なロジックを持つ関数にもできます。

```ts
const routes: Routes = [
  { path: "first-component", component: FirstComponent },
  {
    path: "old-user-page",
    redirectTo: ({ queryParams }) => {
      const errorHandler = inject(ErrorHandler);
      const userIdParam = queryParams['userId'];
      if (userIdParam !== undefined) {
        return `/user/${userIdParam}`;
      } else {
        errorHandler.handleError(new Error('Attempted navigation to user page without user ID.'));
        return `/not-found`;
      }
    },
  },
  { path: "user/:userId", component: OtherComponent },
];
```

## ネストしたルート {#nesting-routes}

アプリケーションがより複雑になるにつれて、ルートコンポーネント以外のコンポーネントを基準とするルートを作成したい場合があります。
これらのタイプのネストしたルートは、子ルートと呼ばれます。
これは、`AppComponent` にある `<router-outlet>` に加えて、アプリケーションに2番目の `<router-outlet>` を追加することを意味します。

この例では、`child-a` と `child-b` の2つの追加の子コンポーネントがあります。
ここでは、`FirstComponent` には独自の `<nav>` と、`AppComponent` にあるものに加えて2番目の `<router-outlet>` があります。

```angular-html
<h2>First Component</h2>

<nav>
  <ul>
    <li><a routerLink="child-a">Child A</a></li>
    <li><a routerLink="child-b">Child B</a></li>
  </ul>
</nav>

<router-outlet />
```

子ルートは、`path` と `component` の両方を持つ必要があるという点で、他のルートと同じです。
違いは、子ルートを親ルート内の `children` 配列に配置することです。

```ts
const routes: Routes = [
  {
    path: 'first-component',
    component: FirstComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'child-a', // child route path
        component: ChildAComponent, // child route component that the router renders
      },
      {
        path: 'child-b',
        component: ChildBComponent, // another child route component that the router renders
      },
    ],
  },
];
```

## ページタイトルの設定 {#setting-the-page-title}

アプリケーションの各ページには、ブラウザ履歴で識別できるように、一意のタイトルを設定する必要があります。
`Router` は、`Route` 構成の `title` プロパティを使用して、ドキュメントのタイトルを設定します。

```ts
const routes: Routes = [
  {
    path: 'first-component',
    title: 'First component',
    component: FirstComponent,  // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'child-a',  // child route path
        title: resolvedChildATitle,
        component: ChildAComponent,  // child route component that the router renders
      },
      {
        path: 'child-b',
        title: 'child b',
        component: ChildBComponent,  // another child route component that the router renders
      },
    ],
  },
];

const resolvedChildATitle: ResolveFn<string> = () => Promise.resolve('child a');
```

HELPFUL: `title` プロパティは、静的なルート `data` や、`ResolveFn` を実装する動的な値と同じルールに従います。

`TitleStrategy` を拡張して、カスタムタイトル戦略を提供できます。

```ts
@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`My Application | ${title}`);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ]
};
```

## 相対パスの使用 {#using-relative-paths}

相対パスを使用すると、現在のURLセグメントを基準とするパスを定義できます。
次の例は、別のコンポーネント `second-component` への相対ルートを示しています。
`FirstComponent` と `SecondComponent` はツリー内で同じレベルにありますが、`SecondComponent` へのリンクは `FirstComponent` 内に配置されているため、ルーターはレベルを1つ上に移動してから2番目のディレクトリに移動して `SecondComponent` を見つける必要があります。
`SecondComponent` へのパス全体を書き出すのではなく、`../` 表記を使用してレベルを1つ上に移動します。

```angular-html
<h2>First Component</h2>

<nav>
  <ul>
    <li><a routerLink="../second-component">Relative Route to second component</a></li>
  </ul>
</nav>
<router-outlet />
```

`../` に加えて、`./` または先頭にスラッシュがないものを、現在のレベルを指定するために使用します。

### 相対ルートの指定

相対ルートを指定するには、`NavigationExtras` の `relativeTo` プロパティを使用します。
コンポーネントクラスで、`@angular/router` から `NavigationExtras` をインポートします。

次に、ナビゲーションメソッドで `relativeTo` を使用します。
ここでは、`items` を含むリンクパラメータ配列の後に、`relativeTo` プロパティが `ActivatedRoute` \(これは `this.route`\) に設定されたオブジェクトを追加します。

```ts
goToItems() {
  this.router.navigate(['items'], { relativeTo: this.route });
}
```

`navigate()` の引数は、ルーターに、現在のルートを基準にして `items` を追加するよう構成します。

`goToItems()` メソッドは、宛先URIをアクティブなルートを基準として解釈し、`items` ルートにナビゲートします。

## クエリパラメータとフラグメントへのアクセス

場合によっては、アプリケーションの機能で、ルートの一部、たとえばクエリパラメータやフラグメントにアクセスする必要があります。
この例では、ルートに `id` パラメータが含まれており、特定のヒーローページをターゲットにできます。

```ts
import { ApplicationConfig } from "@angular/core";
import { Routes } from '@angular/router';
import { HeroListComponent } from './hero-list.component';

export const routes: Routes = [
  { path: 'hero/:id', component: HeroDetailComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

まず、ナビゲート元のコンポーネントで、次のメンバーをインポートします。

```ts
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
```

次に、アクティブなルートサービスを注入します。

```ts
private readonly route = inject(ActivatedRoute);
```

クラスを構成して、`heroes$` というObservable、ヒーローの `id` 番号を保持する `selectedId`、および `ngOnInit()` 内のヒーローを取得できるようにします。次のコードを追加して、選択したヒーローの `id` を取得します。
このコードスニペットは、リスト、ヒーローサービス、ヒーローを取得する関数、およびリストと詳細をレンダリングするためのHTMLが、Tour of Heroesの例と同じようにあることを前提としています。

```ts
heroes$: Observable<Hero[]>;
selectedId: number;
heroes = HEROES;

ngOnInit() {
  this.heroes$ = this.route.paramMap.pipe(
    switchMap(params => {
      this.selectedId = Number(params.get('id'));
      return this.service.getHeroes();
    })
  );
}
```

次に、ナビゲート先のコンポーネントで、次のメンバーをインポートします。

```ts
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
```

コンポーネントクラスのコンストラクターに `ActivatedRoute` と `Router` を注入して、このコンポーネントで使用できるようにします。

```ts
private readonly route = inject(ActivatedRoute);
private readonly router = inject(Router);

hero$: Observable<Hero>;

ngOnInit() {
  const heroId = this.route.snapshot.paramMap.get('id');
  this.hero$ = this.service.getHero(heroId);
}

gotoItems(hero: Hero) {
  const heroId = hero ? hero.id : null;
  // Pass along the hero id if available
  // so that the HeroList component can select that item.
  this.router.navigate(['/heroes', { id: heroId }]);
}
```

## 遅延読み込み {#lazy-loading}

必要に応じてモジュールを遅延読み込みするようにルートを構成できます。つまり、アプリケーションが起動したときにすべてのモジュールを読み込むのではなく、必要に応じてモジュールを読み込みます。
さらに、アプリケーションの一部をバックグラウンドでプリロードして、ユーザー体験を向上させることができます。

どのルートでも、`loadComponent:` を使用することで、ルーティングされるスタンドアロンコンポーネントを遅延読み込みできます。

<docs-code header="Lazy loading a standalone component" language="typescript">

const routes: Routes = [
  {
    path: 'lazy',
    loadComponent: () => import('./lazy.component').then(c => c.LazyComponent)
  }
];
</docs-code>
これは、ロードされたコンポーネントがスタンドアロンである限り機能します。


遅延読み込みとプリロードの詳細については、専用のガイド [遅延読み込み](guide/ngmodules/lazy-loading) を参照してください。

## 権限のないアクセスの防止

ルートガードを使用して、ユーザーが権限なしでアプリケーションの特定の部分にナビゲートできないようにします。
Angularでは、次のルートガードを使用できます。

<docs-pill-row>
  <docs-pill href="api/router/CanActivateFn" title="`canActivate`"/>
  <docs-pill href="api/router/CanActivateChildFn" title="`canActivateChild`"/>
  <docs-pill href="api/router/CanDeactivateFn" title="`canDeactivate`"/>
  <docs-pill href="api/router/CanMatchFn" title="`canMatch`"/>
  <docs-pill href="api/router/ResolveFn" title="`resolve`"/>
  <docs-pill href="api/router/CanLoadFn" title="`canLoad`"/>
</docs-pill-row>

ルートガードを使用するには、[コンポーネントレスルート](api/router/Route#componentless-routes) を使用することを検討してください。これにより、子ルートのガードが容易になります。

ガードのファイルを作成します。

```bash
ng generate guard your-guard
```

ガードファイルに、使用するガード関数を追加します。
次の例では、`canActivateFn` を使用してルートをガードしています。

```ts
export const yourGuardFunction: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // your  logic goes here
}
```

ルーティングモジュールで、`routes` 構成の適切なプロパティを使用します。
ここでは、`canActivate` は、ルーターに、この特定のルートへのナビゲーションを仲介するよう指示します。

```ts
{
  path: '/your-path',
  component: YourComponent,
  canActivate: [yourGuardFunction],
}
```

## リンクパラメータ配列 {#link-parameters-array}

リンクパラメータ配列には、ルーターナビゲーションの次の要素が含まれています。

- 宛先コンポーネントへのルートのパス
- ルートURLに含まれる、必須とオプションのルートパラメータ

次のように、`RouterLink` ディレクティブをこのような配列にバインドします。

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

ルートパラメータを指定する場合は、次の2つの要素の配列になります。

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span>{{ hero.name }}
</a>
```

オプションのルートパラメータは、`{ foo: 'foo' }` のようにオブジェクトで指定します。

```angular-html
<a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>
```

これらの3つの例は、ルーティングが1レベルのアプリケーションのニーズを満たしています。
ただし、危機センターなどの子ルーターを使用すると、新しいリンク配列の選択肢が生まれます。

次の最小限の `RouterLink` の例は、危機センターの指定されたデフォルトの子ルートを基に構築されています。

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

次の点を確認してください。

- 配列の最初の項目は、親ルート \(`/crisis-center`\) を識別します
- この親ルートのパラメータはありません
- 子ルートのデフォルトがないため、1つを選択する必要があります
- `CrisisListComponent` にナビゲートしており、そのルートパスは `/` ですが、スラッシュを明示的に追加する必要はありません

危機センターのルートを排他的に使用して、`AppComponent` テンプレートを再定義できます。

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- 配列の最初の項目は、親ルート \(`/crisis-center`\) を識別します
- この親ルートのパラメータはありません
- 2番目の項目は、特定の危機に関する詳細の子ルートを識別します。
- 詳細の子ルートには `id` ルートパラメータが必要です。
- 配列の2番目の項目として、Dragon Crisisの `id` を追加しました。
- 結果のパスは `/crisis-center/1` です。

また、`AppComponent`テンプレートを危機センターのルート専用に再定義できます：

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', { foo: 'foo' }]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
```

要約すると、ルーティングが1レベル、2レベル、または複数レベルのアプリケーションを作成できます。
リンクパラメータ配列により、任意のルーティング深度、および任意の有効なルートパスのシーケンス、\(必須\) ルーターパラメータ、および \(オプション\) ルーターパラメータオブジェクトを表すことができます。

## `LocationStrategy` とブラウザ URL のスタイル {#locationstrategy-and-browser-url-styles}

ルーターが新しいコンポーネントビューにナビゲートすると、ブラウザの場所と履歴が、そのビューのURLで更新されます。

最新のHTML5ブラウザは、[history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') をサポートしています。これは、サーバーページのリクエストをトリガーせずに、ブラウザの場所と履歴を変更するテクニックです。
ルーターは、ページロードが必要な場合と区別できない「自然な」URLを作成できます。

この「HTML5 pushState」スタイルの危機センターのURLを示します。

```text
localhost:3002/crisis-center
```

古いブラウザは、場所URLが変更された場合、変更が「#」\(ハッシュ\) の後に発生しない限り、サーバーにページリクエストを送信します。
ルーターは、この例外を利用して、ハッシュを含むアプリケーション内ルートURLを作成できます。
危機センターにルーティングする「ハッシュURL」を以下に示します。

```text
localhost:3002/src/#/crisis-center
```

ルーターは、2つの `LocationStrategy` プロバイダーで、両方のスタイルをサポートしています。

| プロバイダー              | 詳細                              |
| :--------------------- | :----------------------------------- |
| `PathLocationStrategy` | デフォルトの「HTML5 pushState」スタイル。 |
| `HashLocationStrategy` | 「ハッシュ URL」スタイル。                |

`RouterModule.forRoot()` 関数は、`LocationStrategy` を `PathLocationStrategy` に設定します。これにより、デフォルトの戦略になります。
ブートストラッププロセス中にオーバーライドを使用して、`HashLocationStrategy` に切り替えることもできます。

HELPFUL: プロバイダーとブートストラッププロセスの詳細については、[依存性の注入](guide/di/dependency-injection-providers) を参照してください。

## ルーティング戦略の選択

プロジェクトの開発の早い段階でルーティング戦略を選択する必要があります。なぜなら、アプリケーションが本番環境になると、サイトの訪問者はアプリケーションのURLリファレンスを使用し、それに依存するからです。

ほとんどのAngularプロジェクトは、デフォルトのHTML5スタイルを使用する必要があります。
これは、ユーザーが理解しやすいURLを生成し、サーバーサイドレンダリングを行うオプションを保持します。

サーバーで重要なページをレンダリングすることは、アプリケーションが最初にロードされたときの、知覚される応答性を大幅に向上させる可能性のあるテクニックです。
そうでなければ、起動に10秒以上かかるアプリケーションは、サーバーでレンダリングされ、ユーザーのデバイスに1秒未満で配信される可能性があります。

このオプションは、アプリケーションのURLが、ハッシュ \(`#`\) 文字を含まない通常のWeb URLに見える場合にのみ使用できます。

## `<base href>`

ルーターは、ナビゲーションにブラウザの [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') を使用します。
`pushState` を使用すると、アプリケーション内URLパスをカスタマイズできます。たとえば、`localhost:4200/crisis-center` です。
アプリケーション内URLは、サーバー URLと区別がつかない場合があります。

最新のHTML5ブラウザは、`pushState` を初めてサポートしたため、多くの人がこれらのURLを「HTML5スタイル」のURLと呼んでいます。

HELPFUL: HTML5スタイルのナビゲーションは、ルーターのデフォルトです。
[LocationStrategy とブラウザ URL のスタイル](#locationstrategy-and-browser-url-styles) セクションでは、HTML5スタイルが好ましい理由、その動作を調整する方法および必要に応じて古いハッシュ \(`#`\) スタイルに切り替える方法について説明します。

`pushState` ルーティングが機能するには、アプリケーションの `index.html` に [`<base href>` 要素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') を追加する必要があります。
ブラウザは、`<base href>` の値を使用して、CSSファイル、スクリプト、画像を参照するときに、相対URLにプレフィックスを付けます。

`<head>` タグの直後に `<base>` 要素を追加します。
`app` フォルダーがアプリケーションルートの場合、このアプリケーションの場合と同じように、`index.html` の `href` 値を次のように設定します。

<docs-code header="src/index.html (base-href)" path="adev/src/content/examples/router/src/index.html" visibleRegion="base-href"/>

### HTML5 URL と `<base href>`

次のガイドラインでは、URL の異なる部分について説明します。
この図は、これらの部分を示しています。

<docs-code hideCopy language="text">
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
</docs-code>

ルーターはデフォルトで [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') スタイルを使用しますが、`<base href>` でその戦略を構成する必要があります。

戦略を構成する推奨される方法は、`index.html` の `<head>` に [`<base href>` 要素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') タグを追加することです。

```angular-html
<base href="/">
```

このタグがないと、ブラウザはアプリケーションに「ディープリンク」するときに、リソース \(画像、CSS、スクリプト\) をロードできない場合があります。

一部の開発者は、`<head>` または `index.html` にアクセスできないため、`<base>` 要素を追加できない場合があります。

これらの開発者は、次の2つの手順を実行することで、HTML5 URLを引き続き使用できます。

1. ルーターに適切な `APP_BASE_HREF` 値を提供します。
1. すべてのWebリソース \(CSS、画像、スクリプト、テンプレートHTMLファイル\) に、ルートURL \(権限を持つURL\) を使用します。

   - `<base href>` の `path` は、スラッシュで終わる必要があります。ブラウザは、右端の "`/`" の後に続く `path` 内の文字を無視します
   - `<base href>` に `query` 部分が含まれている場合、`query` は、ページのリンクの `path` が空で `query` がない場合にのみ使用されます。
     つまり、`<base href>` の `query` は、`HashLocationStrategy` を使用する場合にのみ含まれます。

   - ページのリンクがルートURL \(権限を持つ\) の場合、`<base href>` は使用されません。
     このように、権限を持つ `APP_BASE_HREF` は、Angularによって作成されるすべてのリンクが `<base href>` 値を無視するようにします。

   - `<base href>` のフラグメントは、_決して_ 永続化されません

`<base href>` がターゲットURIを作成するためにどのように使用されるかについての詳細については、[RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) のリファレンスの変換に関するセクションを参照してください。

### `HashLocationStrategy`

`AppModule` の `RouterModule.forRoot()` の2番目の引数に `useHash: true` を提供することで、`HashLocationStrategy` を使用します。

```ts
providers: [
  provideRouter(appRoutes, withHashLocation())
]
```

`RouterModule.forRoot` を使用する場合、これは2番目の引数で `useHash: true` を指定して構成されます。`RouterModule.forRoot(routes, {useHash: true})`.
