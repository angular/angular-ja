# Other common Routing Tasks

This guide covers some other common tasks associated with using Angular router in your application.

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

パラメータの名前と一致する `input()` プロパティを持つようにコンポーネントを更新します。

```ts
id = input.required<string>()
hero = computed(() => this.service.getHero(heroId));
```

NOTE: すべてのルートデータを、キーと値のペアでコンポーネントの入力にバインドできます。静的なルートデータ、解決されたルートデータ、パスパラメータ、マトリックスパラメータ、クエリパラメータです。
親コンポーネントのルート情報を使用する場合は、ルーターの `paramsInheritanceStrategy` オプションを設定する必要があります。
`withRouterConfig({paramsInheritanceStrategy: 'always'})`

</docs-step>

</docs-workflow>

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
