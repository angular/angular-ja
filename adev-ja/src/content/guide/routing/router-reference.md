# ルーターリファレンス

以下のセクションでは、ルーターの基本的な概念について説明します。

## ルーターのインポート

Angular Routerは、特定のURLに対して特定のコンポーネントビューを表示するオプションのサービスです。
Angularのコアには含まれていないため、独自のライブラリパッケージ `@angular/router` に含まれています。

他のAngularパッケージと同じように、必要なものをインポートします。

```ts
import { provideRouter } from '@angular/router';
```

HELPFUL: ブラウザのURLスタイルの詳細については、[ `LocationStrategy` およびブラウザの URL スタイル](guide/routing/common-router-tasks#browser-url-styles) を参照してください。

## 設定

ルーティングされたAngularアプリケーションには、`Router` サービスのシングルトンインスタンスが1つあります。
ブラウザのURLが変更されると、そのルーターは、表示するコンポーネントを判断できる対応する `Route` を探します。

ルーターは、設定するまでルートを持ちません。
次の例では、5つのルート定義を作成し、`provideRouter` メソッドを使用してルーターを設定し、その結果を `ApplicationConfig` の `providers` 配列に追加します。

```ts
const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'heroes',
    component: HeroListComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/heroes',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];
export const appConfig: ApplicationConfig = {
    providers: [provideRouter(appRoutes, withDebugTracing())]
}
```

`routes` ルートの配列は、ナビゲーションの方法を記述します。
`ApplicationConfig` `providers` 内の `provideRouter` メソッドに渡して、ルーターを設定します。

各 `Route` は、URL `path` をコンポーネントにマッピングします。
パスに先頭のスラッシュはありません。
ルーターは、最終的なURLを解析して構築します。これにより、アプリケーションビュー間を移動する際に、相対パスと絶対パスの両方を使用できます。

2番目のルートの `:id` は、ルートパラメーターのトークンです。
`/hero/42` などのURLでは、「42」は `id` パラメーターの値です。
対応する `HeroDetailComponent` は、その値を使用して、`id` が42であるヒーローを見つけ、表示します。

3番目のルートの `data` プロパティは、この特定のルートに関連付けられた任意のデータを格納するための場所です。
`data` プロパティは、各アクティブなルート内でアクセスできます。
ページタイトル、パンくずリストのテキスト、その他の読み取り専用、静的なデータを格納するために使用します。
解決ガードを使用して動的なデータを取得します。

4番目のルートの空のパスは、アプリケーションのデフォルトパスを表します。URLのパスが空の場合に移動する場所です。これは、通常、開始時には空です。
このデフォルトルートは、`/heroes` URLのルートにリダイレクトするため、`HeroesListComponent` が表示されます。

ナビゲーションライフサイクル中に発生しているイベントを確認する必要がある場合は、`withDebugTracing` 機能があります。
これにより、ブラウザのコンソールに、各ナビゲーションライフサイクル中に発生した各ルーターイベントが出力されます。
`withDebugTracing` は、デバッグ目的でのみ使用します。
`withDebugTracing` オプションは、`provideRouter` メソッドに渡されるオブジェクトの2番目の引数として設定します。

## ルーターアウトレット

`RouterOutlet` は、ルーターライブラリのディレクティブであり、コンポーネントのように使用されます。
これは、ルーターがそのアウトレットのコンポーネントを表示する必要があるテンプレート内の場所を示すプレースホルダーとして機能します。

<docs-code language="html">

<router-outlet></router-outlet>
<!-- ルーティングされたコンポーネントはここにあります -->

</docs-code>

上記の設定により、このアプリケーションのブラウザのURLが `/heroes` になると、ルーターはそのURLをルートパス `/heroes` に一致させます。また `HeroListComponent` を、ホストコンポーネントのテンプレートに配置した `RouterOutlet` の兄弟要素として表示します。

## ルーターリンク

アンカータグのクリックなどのユーザーアクションの結果としてナビゲートするには、`RouterLink` を使用します。

次のテンプレートを検討してください。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/router/src/app/app.component.1.html"/>

アンカータグの `RouterLink` ディレクティブにより、ルーターはこれらの要素を制御します。
ナビゲーションパスは固定されているため、`routerLink` に文字列を1回バインドできます。

ナビゲーションパスがより動的であった場合、ルートリンクパラメーターの配列を返すテンプレート式にバインドできます。つまり、[リンクパラメーター配列](guide/routing/common-router-tasks#link-parameters-array) です。
ルーターは、その配列を完全な URL に解決します。

## アクティブなルーターリンク

`RouterLinkActive` ディレクティブは、現在の `RouterState` に基づいて、アクティブな `RouterLink` バインドの CSS クラスを切り替えます。

各アンカータグには、`RouterLinkActive` ディレクティブへの[プロパティバインド](guide/templates/property-binding) が表示されます。これは、

<docs-code hideCopy language="html">

routerLinkActive="..."

</docs-code>

等号、`=` の右側のテンプレート式には、ルーターがリンクがアクティブな場合に追加し、リンクが非アクティブな場合に削除するCSSクラスのスペース区切り文字列が含まれています。
`RouterLinkActive` ディレクティブを `routerLinkActive="active fluffy"` などのクラスの文字列に設定するか、そのような文字列を返すコンポーネントプロパティにバインドします。
たとえば、

<docs-code hideCopy language="typescript">

[routerLinkActive]="someStringProperty"

</docs-code>

アクティブなルートリンクは、ルートツリーの各レベルをカスケードダウンするため、親と子のルーターリンクが同時にアクティブになる可能性があります。
この動作をオーバーライドするには、`{ exact: true }` 式を使用して、`[routerLinkActiveOptions]` 入力バインドにバインドします。
`{ exact: true }` を使用することにより、特定の `RouterLink` は、そのURLが現在のURLと完全に一致する場合にのみアクティブになります。

`RouterLinkActive` を使用すると、アクティブな要素に `aria-current` 属性を簡単に適用できます。これにより、すべてのユーザーにとってよりアクセスしやすいエクスペリエンスが提供されます。詳細については、アクセシビリティのベストプラクティス[アクティブなリンクの識別セクション](/best-practices/a11y#active-links-identification) を参照してください。

## ルーターステート

各成功したナビゲーションライフサイクルの終わりに、ルーターは、ルーターの現在の状態を構成する `ActivatedRoute` オブジェクトのツリーを構築します。
`Router` サービスと `routerState` プロパティを使用して、アプリケーション内のどこからでも現在の `RouterState` にアクセスできます。

`RouterState` の各 `ActivatedRoute` は、ルートツリーを上下に移動して、親、子、兄弟ルートから情報を入手するためのメソッドを提供します。

## アクティブなルート

ルートパスとパラメーターは、[ActivatedRoute](api/router/ActivatedRoute) と呼ばれる注入されたルーターサービスを通じて利用できます。
これには、次の多くの便利な情報が含まれています。

| プロパティ        | 詳細 |
|:---             |:---     |
| `url`           | ルートパスの `Observable`。ルートパスの各部分に対する文字列の配列として表されます。                                                                                                                                                        |
| `data`          | ルートに提供された `data` オブジェクトを含む `Observable`。解決ガードからの解決済みの値も含まれています。                                                                                     |
| `params`        | ルートに固有の必須パラメーターとオプションパラメーターを含む `Observable`。                                                                                                                 |
| `paramMap`      | ルートに固有の必須パラメーターとオプションパラメーターの [マップ](api/router/ParamMap) を含む `Observable`。マップは、同じパラメーターから単一値と複数値を取得することをサポートしています。 |
| `queryParamMap` | すべてのルートで使用可能なクエリパラメーターの [マップ](api/router/ParamMap) を含む `Observable`。マップは、クエリパラメーターから単一値と複数値を取得することをサポートしています。                       |
| `queryParams`   | すべてのルートで使用可能なクエリパラメーターを含む `Observable`。                                                                                                                                        |
| `fragment`      | すべてのルートで使用可能な URL フラグメントの `Observable`。                                                                                                                                                               |
| `outlet`        | ルートをレンダリングするために使用される `RouterOutlet` の名前。名前のないアウトレットの場合、アウトレット名はプライマリです。                                                                                                                                                      |
| `routeConfig`   | ルートの構成。元のパスが含まれています。                                                                                                                                                                                        |
| `parent`        | このルートが子ルートの場合、ルートの親 `ActivatedRoute`。                                                                                                                                       |
| `firstChild`    | このルートの子ルートのリスト内の最初の `ActivatedRoute` を含みます。                                                                                                                                                                                    |
| `children`      | 現在のルートの下でアクティブ化されたすべての子ルートを含みます。                                                                                                                                            |

## ルーターイベント

各ナビゲーション中に、`Router` は、`Router.events` プロパティを通じてナビゲーションイベントを発行します。
これらのイベントは、次の表に示されています。

| ルーターイベント                                              | 詳細 |
|:---                                                       |:---     |
| [`NavigationStart`](api/router/NavigationStart)           | ナビゲーションが開始されたときにトリガーされます。                                                                                                                                                     |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | ルーターがルート構成を遅延読み込みする前にトリガーされます。                                                                     |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | ルートが遅延読み込みされた後にトリガーされます。                                                                                                                                         |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | ルーターが URL を解析し、ルートが認識されたときにトリガーされます。                                                                                                               |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | ルーターがルーティングのガードフェーズを開始したときにトリガーされます。                                                                                                                         |
| [`ChildActivationStart`](api/router/ChildActivationStart) | ルーターがルートの子のアクティブ化を開始したときにトリガーされます。                                                                                                                       |
| [`ActivationStart`](api/router/ActivationStart)           | ルーターがルートのアクティブ化を開始したときにトリガーされます。                                                                                                                                  |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | ルーターがルーティングのガードフェーズを正常に終了したときにトリガーされます。                                                                                                          |
| [`ResolveStart`](api/router/ResolveStart)                 | ルーターがルーティングの解決フェーズを開始したときにトリガーされます。                                                                                                                        |
| [`ResolveEnd`](api/router/ResolveEnd)                     | ルーターがルーティングの解決フェーズを正常に終了したときにトリガーされます。                                                                                                          |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | ルーターがルートの子のアクティブ化を終了したときにトリガーされます。                                                                                                                     |
| [`ActivationEnd`](api/router/ActivationEnd)               | ルーターがルートのアクティブ化を終了したときにトリガーされます。                                                                                                                                |
| [`NavigationEnd`](api/router/NavigationEnd)               | ナビゲーションが正常に終了したときにトリガーされます。                                                                                                                                          |
| [`NavigationCancel`](api/router/NavigationCancel)         | ナビゲーションがキャンセルされたときにトリガーされます。これは、ルートガードがナビゲーション中に `false` を返したり、`UrlTree` または `RedirectCommand` を返してリダイレクトしたりした場合に発生する可能性があります。 |
| [`NavigationError`](api/router/NavigationError)           | 予期しないエラーのためナビゲーションが失敗したときにトリガーされます。                                                                                                                           |
| [`Scroll`](api/router/Scroll)                             | スクロールイベントを表します。                                                                                                                                                         |

`withDebugTracing` 機能を有効にすると、Angularはこれらのイベントをコンソールに出力します。

## ルーターの用語

以下は、`Router` の主要な用語とその意味です。

| ルーターパーツ           | 詳細 |
|:---                   |:---     |
| `Router`              | アクティブな URL のアプリケーションコンポーネントを表示します。コンポーネント間を移動するナビゲーションを管理します。                                                                                        |
| `provideRouter`       | アプリケーションビュー間を移動するための必要なサービスプロバイダーを提供します。                                                                                        |
| `RouterModule`        | アプリケーションビュー間を移動するための必要なサービスプロバイダーとディレクティブを提供する、別の NgModule。                                                                       |
| `Routes`              | それぞれ URL パスをコンポーネントにマッピングする、ルートの配列を定義します。                                                                                                                              |
| `Route`               | URL パターンに基づいてルーターがコンポーネントにどのように移動するかを定義します。ほとんどのルートは、パスとコンポーネントタイプで構成されています。                                                                |
| `RouterOutlet`        | ルーターがビューを表示する場所を示すディレクティブ (`<router-outlet>`)。                                                                                                                 |
| `RouterLink`          | クリック可能な HTML 要素をルートにバインドするためのディレクティブ。*文字列* または *リンクパラメーターの配列* にバインドされた `routerLink` ディレクティブを含む要素をクリックすると、ナビゲーションがトリガーされます。 |
| `RouterLinkActive`    | 関連付けられた `routerLink` がアクティブ/非アクティブになったときに、HTML 要素からクラスを追加/削除するためのディレクティブ。また、アクティブなリンクの `aria-current` を設定して、アクセシビリティを向上させることもできます。                                       |
| `ActivatedRoute`      | 各ルートコンポーネントに提供されるサービス。ルートパラメーター、静的データ、解決データ、グローバルクエリパラメーター、グローバルフラグメントなどのルート固有の情報が含まれています。   |
| `RouterState`         | ルーターの現在の状態。現在のすべてのアクティブなルートのツリーと、ルートツリーを移動するための便利なメソッドを含みます。                                              |
| リンクパラメーター配列 | ルーターがルーティング命令として解釈する配列。この配列を `RouterLink` にバインドするか、`Router.navigate` メソッドの引数として渡すことができます。                        |
| ルーティングコンポーネント     | `RouterOutlet` を持つ Angular コンポーネント。ルーターナビゲーションに基づいてビューを表示します。                                                                                                      |
