# その他の一般的なルーティングタスク

このガイドでは、アプリケーションでAngularルーターを使用する際によくあるその他のタスクについて説明します。

## ルート情報の取得

多くの場合、ユーザーがアプリケーションをナビゲートするときに、一方のコンポーネントからもう一方のコンポーネントに情報を渡す必要があります。
たとえば、食料品のショッピングリストを表示するアプリケーションを考えてみてください。
リストの各アイテムには、一意の `id` があります。
アイテムを編集するには、ユーザーは[編集]ボタンをクリックします。これにより、`EditGroceryItem` コンポーネントが開きます。
そのコンポーネントは、食料品アイテムの `id` を取得して、ユーザーに正しい情報を表示できるようにする必要があります。

ルートを使用して、このタイプの情報をアプリケーションコンポーネントに渡します。
これを行うには、`provideRouter` を使用した `withComponentInputBinding` 機能、または `RouterModule.forRoot` の `bindToComponentInputs` オプションを使用します。

ルートから情報を取得するには:

<docs-workflow>

<docs-step title="`withComponentInputBinding` を追加する">

`provideRouter` メソッドに `withComponentInputBinding` 機能を追加します。

```ts
providers: [provideRouter(appRoutes, withComponentInputBinding())];
```

</docs-step>

<docs-step title="コンポーネントに `input` を追加する">

パラメータ名と一致する `input()` プロパティを持つようにコンポーネントを更新します。

```ts
id = input.required<string>();
hero = computed(() => this.service.getHero(id()));
```

</docs-step>
<docs-step title="Optional: Use a default value">
`withComponentInputBinding` が有効な場合、ルーターは現在のルートに基づいてすべての入力に値を割り当てます。
オプションのクエリパラメータが欠落している場合など、ルートデータが入力キーと一致しない場合、ルーターは `undefined` を割り当てます。
入力がルートによって一致しない可能性がある場合は、`input` の型に `undefined` を含める必要があります。

`input` の `transform` オプションを使用するか、`linkedSignal` でローカル状態を管理することで、デフォルト値を提供します。

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// or
id = input<string | undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTE: 静的なルートデータ、解決されたルートデータ、パスパラメータ、マトリックスパラメータ、クエリパラメータなど、すべてのルートデータをキーと値のペアでコンポーネントの入力にバインドできます。

### Disable query parameter binding

Use `ComponentInputBindingOptions` to disable query parameter binding if you manage query parameters separately:

```ts
provideRouter(appRoutes, withComponentInputBinding({queryParams: false}));
```

### Configure behavior for inputs not available in router data

By default, the router sets an input to `undefined` if it was not available in the router data during a navigation. This ensures that stale data is not retained.

If you want to avoid setting `undefined` for inputs that have _never_ been available in the router data for the active component instance, you can set the `unmatchedInputBehavior` option to `'undefinedIfStale'`:

```ts
provideRouter(appRoutes, withComponentInputBinding({unmatchedInputBehavior: 'undefinedIfStale'}));
```

When you combine `unmatchedInputBehavior: 'undefinedIfStale'` with `queryParams: false`, inputs retain their initial values unless they are explicitly provided by the router. The exception is matrix parameters: if a matrix parameter is provided in one navigation and removed in a subsequent one, the router will set the input to `undefined` to avoid retaining stale data.

```ts
provideRouter(
  appRoutes,
  withComponentInputBinding({
    queryParams: false,
    unmatchedInputBehavior: 'undefinedIfStale',
  }),
);
```

### Inherit parent route data

By default, child routes inherit parameters and data from parent routes (equivalent to `paramsInheritanceStrategy: 'always'`). This means you can access parent route info directly in child components.

If you need to restore the legacy behavior where parameters were only inherited from empty path routes, you can set `paramsInheritanceStrategy` to `'emptyOnly'`:

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

See [router configuration options](guide/routing/customizing-route-behavior#router-configuration-options) for details on other available settings.

## 404 ページの表示 {#displaying-a-404-page}

404ページを表示するには、[ワイルドカードルート](guide/routing/define-routes#wildcards) を設定します。このルートの `component` プロパティは、404ページに使用したいコンポーネントに設定します。

```ts
const routes: Routes = [
  {path: 'first-component', component: First},
  {path: 'second-component', component: Second},
  {path: '**', component: PageNotFound}, // Wildcard route for a 404 page
];
```

`path` が `**` の最後のルートは、ワイルドカードルートです。
ルーターは、要求されたURLがリストの先頭にあるパスと一致しない場合、このルートを選択し、ユーザーを `PageNotFound` にルーティングします。

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
  <span class="badge">{{ hero.id }}</span
  >{{ hero.name }}
</a>
```

オプションのルートパラメータは、`{ foo: 'foo' }` のようにオブジェクトで指定します。

```angular-html
<a [routerLink]="['/crisis-center', {foo: 'foo'}]">Crisis Center</a>
```

この構文はマトリックスパラメータを渡します。これは、特定のURLセグメントに関連付けられたオプションのパラメータです。[マトリックスパラメータ](/guide/routing/read-route-state#matrix-parameters)の詳細をご覧ください。

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
- `CrisisList` にナビゲートしており、そのルートパスは `/` ですが、スラッシュを明示的に追加する必要はありません

危機センターのルートを排他的に使用して、`App` テンプレートを再定義できます。

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- 配列の最初の項目は、親ルート \(`/crisis-center`\) を識別します
- この親ルートのパラメータはありません
- 2番目の項目は、特定の危機に関する詳細の子ルートを識別します。
- 詳細の子ルートには `id` ルートパラメータが必要です。
- 配列の2番目の項目として、Dragon Crisisの `id` を追加しました。
- 結果のパスは `/crisis-center/1` です。

また、`App`テンプレートを危機センターのルート専用に再定義できます：

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', {foo: 'foo'}]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

要約すると、ルーティングが1レベル、2レベル、または複数レベルのアプリケーションを作成できます。
リンクパラメータ配列により、任意のルーティング深度、および任意の有効なルートパスのシーケンス、\(必須\) ルーターパラメータ、および \(オプション\) ルーターパラメータオブジェクトを表すことができます。

## `LocationStrategy` とブラウザ URL のスタイル {#locationstrategy-and-browser-url-styles}

ルーターが新しいコンポーネントビューにナビゲートすると、ブラウザの場所と履歴が、そのビューのURLで更新されます。

最新のHTML5ブラウザは、[history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') をサポートしています。これは、サーバーページのリクエストをトリガーせずに、ブラウザの場所と履歴を変更するテクニックです。
ルーターは、サーバーページロードと区別できない「自然な」URLを作成できます。

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
| `HashLocationStrategy` | 「ハッシュURL」スタイル。                |

`RouterModule.forRoot()` 関数は、`LocationStrategy` を `PathLocationStrategy` に設定します。これにより、デフォルトの戦略になります。
ブートストラッププロセス中にオーバーライドを使用して、`HashLocationStrategy` に切り替えることもできます。

HELPFUL: プロバイダーとブートストラッププロセスの詳細については、[依存性の注入](guide/di/defining-dependency-providers) を参照してください。
