# ルーターレファレンス {@a router-reference}

以降のセクションでは、いくつかのコアルーターの概念にハイライトします。

{@a basics-router-imports}

### ルーターのインポート {@a router-imports}

Angularのルーターはオプションのサービスであり、指定されたURLにおける特定のコンポーネントビューを表示します。
これはAngularコアの一部ではなく、それゆえ独自のライブラリパッケージ`@angular/router`内にあります。

他のAngularパッケージと同じく、そこから必要なものをインポートします。

```
import { provideRouter } from '@angular/router';
```

<div class="alert is-helpful">

ブラウザのURLスタイルの詳細については、[`LocationStrategy`とブラウザのURLスタイル](guide/router#browser-url-styles)を参照しましょう。

</div>

{@a basics-config}

### 設定 {@a configuration}

ルーティングされたAngularアプリケーションには、`Router`サービスのシングルトンインスタンスが1つあります。
ブラウザのURLが変わると、そのルーターは対応する`Route`を探します。そのルートから表示するコンポーネントを決定できます。

ルーターは設定するまではルートをもちません。
次の例では、5つのルート定義を作成し、`provideRouter` メソッドでルーターを設定し、その結果を `ApplicationConfig` の `providers` 配列に追加しています。

```
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
    providers: [provideRouter(routes, withDebugTracing())]
}
```

<code-example path="router/src/app/app.module.0.ts" header="src/app/app.module.ts (excerpt)"></code-example>

{@a example-config}

The `routes` array of routes describes how to navigate.
Pass it to the `provideRouter` method in the `ApplicationConfig` `providers` to configure the router.

各`Route`はURLの`path`をコンポーネントにマップしています。
パスに先頭のスラッシュはありません。
ルーターは最終的なURLを解析・構築するため、アプリケーションビュー間をナビゲートするときは相対パスと絶対パスの両方を使用できます。

2番目のルートにある`:id`は、ルートのパラメータのためのトークンです。
`/hero/42`などのURLでは、"42"は`id`パラメータの値です。
対応する`HeroDetailComponent`はその値を使用して、`id`が42のヒーローを見つけて表示します。

3番目のルートにある`data`プロパティは、
この特定のルートに結び付けられた任意のデータを格納する場所です。
データプロパティはアクティブ化された各ルート内でアクセスできます。これを使用して、ページタイトル、パンくずテキスト、その他の読み取り専用の静的データなどのアイテムを保存します。
動的データを取得するには、[解決ガード](guide/router-tutorial-toh#resolve-guard)を使用できます。

4番目のルートにある空のパスは、アプリケーションのデフォルトパスを表しています &mdash; URLのパスが空のときに移動する場所で、通常は先頭にあります。
このデフォルトルートは`/Heroes`というURLのルートにリダイレクトしており、そのため`HeroesListComponent`を表示します。

If you need to see what events are happening during the navigation lifecycle, there is the `withDebugTracing` feature.
これは、各ナビゲーションライフサイクル中に発生した各ルーターイベントをブラウザコンソールに出力します。
Use `withDebugTracing` only for debugging purposes.
You set the `withDebugTracing` option in the object passed as the second argument to the `provideRouter` method.

{@a basics-router-outlet}

### ルーターアウトレット {@a router-outlet}

`RouterOutlet`はルーターライブラリからのディレクティブで、コンポーネントのように使われます。
これは、テンプレートにおけるスポットをマークするプレースホルダーとして機能し、
そこにルーターがその出口のコンポーネントを表示します。

<code-example language="html">
  &lt;router-outlet>&lt;/router-outlet>
  &lt;!-- ルーティングされたコンポーネントがここに出る -->

</code-example>

上記の設定では、このアプリケーションのブラウザURLが`/heroes`になると、ルーターはそのURLをルートパス`/heroes`に一致させ、ホストコンポーネントのテンプレートに配置した`RouterOutlet`の兄弟要素として、`HeroListComponent`を表示します。

{@a basics-router-links}

{@a router-link}

### ルーターリンク {@a router-links}

アンカータグのクリックといったユーザーアクションの結果としてナビゲートするには、`RouterLink`を使用します。

次のテンプレートに注目しましょう:

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

アンカータグ上の`RouterLink`ディレクティブは、ルーターにこれらの要素に対する制御を与えています。
そのナビゲーションパスは固定されているため、`routerLink`に文字列を割り当てることができます("ワンタイム"のバインディング)。

ナビゲーションパスがもっと動的な場合は、ルートのリンクパラメーターの配列を返すテンプレート式にバインドできます。それが、[リンクパラメータ配列](guide/router#link-parameters-array)です。
ルーターはその配列を完全なURLに解決します。

{@a router-link-active}

### アクティブなルーターリンク {@a active-router-links}

`RouterLinkActive`ディレクティブは、現在の`RouterState`に基づいてアクティブな`RouterLink`バインディングのCSSクラスを切り替えます。

各アンカータグには、`routerLinkActive="..."`のように`RouterLinkActive`ディレクティブへの[プロパティバインディング](guide/property-binding)があります。

等号`=`の右側のテンプレート式には、CSSクラスのスペース区切りの文字列が含まれています。ルーターはそれらをこのリンクがアクティブなときに追加します(リンクが非アクティブなときに削除します)。
`RouterLinkActive`ディレクティブを`routerLinkActive="active fluffy"`のようにクラスの文字列に設定するか、そのような文字列を返すコンポーネントのプロパティにバインドします。 (たとえば `[routerLinkActive]="someStringProperty"`)

アクティブなルートのリンクはルートツリーの各レベルを通じてカスケードされるため、親子のルーターのリンクは同時にアクティブにできます。
この動作をオーバーライドするには、`{ exact: true }`式で入力バインディングの`[routerLinkActiveOptions]`にバインドできます。`{ exact: true }`を使用すると、指定の`RouterLink`は、そのURLが現在のURLと完全に一致する場合にのみアクティブになります。

`RouterLinkActive` also allows you to easily apply the `aria-current` attribute to the active element, thus providing a more accessible experience for all users. For more information see the Accessibility Best Practices [Active links identification section](/guide/accessibility#active-links-identification).

<a id="basics-router-state"></a>

### ルーターの状態 {@a router-state}

各ナビゲーションライフサイクルの成功の後に、ルーターはルーターの現在の状態を構成する`ActivatedRoute`オブジェクトのツリーを構築します。`Router`サービスと`routerState`プロパティを使用して、アプリケーションのどこからでも現在の`RouterState`にアクセスできます。

`RouterState`の各`ActivatedRoute`は、ルートのツリーを上下にトラバースして、親・子・兄弟のルートから情報を取得するメソッドを提供します。

{@a activated-route}

### アクティブ化されたルート

ルートのパスとパラメータは、[ActivatedRoute](api/router/ActivatedRoute)という注入されたルーターサービスを介して利用できます。
それは以下を含む多くの有用な情報をもっています:

<table>
  <tr>
    <th>
      プロパティ
    </th>

    <th>
      説明
    </th>
  </tr>

  <tr>
    <td>
      <code>url</code>
    </td>
    <td>

    そのルートの(各)パスの`Observable`で、ルートのパスの各部分に関する文字列の配列として表されます。

    </td>
  </tr>

  <tr>
    <td>
      <code>data</code>
    </td>
    <td>

    そのルートへ提供される`data`オブジェクトを含む`Observable`。
    また、[解決ガード](guide/router-tutorial-toh#resolve-guard)からの解決済みの値も含みます。

    </td>
  </tr>

  <tr>
    <td>
      <code>params</code>
    </td>
    <td>

    An `Observable` that contains the required and [optional parameters](guide/router-tutorial-toh#optional-route-parameters) specific to the route.

    </td>
  </tr>

  <tr>
    <td>
      <code>paramMap</code>
    </td>
    <td>

    そのルート固有の、必須のおよび[オプションのパラメータ](guide/router-tutorial-toh#optional-route-parameters)の[マップ](api/router/ParamMap)を含む`Observable`。
    このマップは、同じパラメータからの単一および複数の値の取得をサポートします。

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParamMap</code>
    </td>
    <td>

    すべてのルートで利用できる[クエリパラメータ](guide/router-tutorial-toh#query-parameters)の[map](api/router/ParamMap)を含む`Observable`。
    このマップは、クエリパラメータからの単一および複数の値の取得をサポートしています。

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParams</code>
    </td>
    <td>

    An `Observable` that contains the [query parameters](guide/router-tutorial-toh#query-parameters) available to all routes.

    </td>
  </tr>

  <tr>
    <td>
      <code>fragment</code>
    </td>
    <td>

    すべてのルートで利用できるURL[フラグメント](guide/router-tutorial-toh#fragment)の`Observable`。

    </td>
  </tr>

  <tr>
    <td>
      <code>outlet</code>
    </td>
    <td>

    そのルートをレンダリングするために使われる`RouterOutlet`の名前。
    名前を付けないアウトレットは、アウトレット名はprimaryです。

    </td>
  </tr>

  <tr>
    <td>
      <code>routeConfig</code>
    </td>
    <td>

    そのルートについて使用されたルート設定で、起点のパスを含みます。

    </td>
  </tr>

    <tr>
    <td>
      <code>parent</code>
    </td>
    <td>

    このルートが[子ルート](guide/router-tutorial-toh#child-routing-component)の場合、このルートの親の`ActivatedRoute`。

    </td>
  </tr>

  <tr>
    <td>
      <code>firstChild</code>
    </td>
    <td>

    このルートの子ルートのリストにおける最初の`ActivatedRoute`を含みます。

    </td>
  </tr>

  <tr>
    <td>
      <code>children</code>
    </td>
    <td>

    現在のルート下でアクティブ化されたすべての[子ルート](guide/router-tutorial-toh#child-routing-component)を含みます。

    </td>
  </tr>
</table>

### ルーターのイベント {@a router-events}

各ナビゲーション中に、`Router`は`Router.events`プロパティを介してナビゲーションイベントを発行します。
次の表に示しているのがそのイベントです。

<table>
  <tr>
    <th>
      ルーターのイベント
    </th>

    <th>
      説明
    </th>
  </tr>

  <tr>
    <td>
      <code>NavigationStart</code>
    </td>
    <td>

      ナビゲーション開始時にトリガーされる[イベント](api/router/NavigationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadStart</code>
    </td>
    <td>

      `Router`がルート設定を[遅延ロード](guide/router-tutorial-toh#asynchronous-routing)する前にトリガーされる
      [イベント](api/router/RouteConfigLoadStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadEnd</code>
    </td>
    <td>

      ルートが遅延ロードされた後にトリガーされる[イベント](api/router/RouteConfigLoadEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>RoutesRecognized</code>
    </td>
    <td>

      ルーターがURLを解析しルートが認識されるときにトリガーされる[イベント](api/router/RoutesRecognized)。

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckStart</code>
    </td>
    <td>

      ルーターがルーティングのガード段階を開始するときにトリガーされる[イベント](api/router/GuardsCheckStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationStart</code>
    </td>
    <td>

      ルーターがルートの子たちのアクティブ化を開始するときにトリガーされる[イベント](api/router/ChildActivationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationStart</code>
    </td>
    <td>

      ルーターがルートのアクティブ化を開始するときにトリガーされる[イベント](api/router/ActivationStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckEnd</code>
    </td>
    <td>

      ルーターがルーティングのガード段階を正常に完了するときにトリガーされる[イベント](api/router/GuardsCheckEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveStart</code>
    </td>
    <td>

      ルーターがルーティングの解決段階を開始するときにトリガーされる[イベント](api/router/ResolveStart)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveEnd</code>
    </td>
    <td>

      ルーターがルーティングの解決段階を正常に完了するときにトリガーされる[イベント](api/router/ResolveEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationEnd</code>
    </td>
    <td>

      ルーターがルートの子たちのアクティブ化を完了するときにトリガーされる[イベント](api/router/ChildActivationEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationEnd</code>
    </td>
    <td>

      ルーターがルートのアクティブ化を完了するときにトリガーされる[イベント](api/router/ActivationEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationEnd</code>
    </td>
    <td>

      ナビゲーションが正常に終了するときにトリガーされる[イベント](api/router/NavigationEnd)。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationCancel</code>
    </td>
    <td>

      ナビゲーションがキャンセルされるときにトリガーされる[イベント](api/router/NavigationCancel)。
      これは、[ルートガード](guide/router-tutorial-toh#guards)がナビゲーション中にfalseを返すときや、
      `UrlTree`を返してリダイレクトするときに起こります。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationError</code>
    </td>
    <td>

      予期しないエラーによってナビゲーションが失敗するときにトリガーされる[イベント](api/router/NavigationError)。

    </td>
  </tr>

  <tr>
    <td>
      <code>Scroll</code>
    </td>
    <td>

      スクロールイベントを表す[イベント](api/router/Scroll)。

    </td>
  </tr>
</table>

When you enable the `withDebugTracing` feature, Angular logs these events to the console.
ルーターのナビゲーションイベントをフィルタリングする例については、[AngularでのObservable](guide/observables-in-angular)の[ルーターのセクション](guide/observables-in-angular#router)を参照しましょう。

### ルーター用語 {@a router-terminology}

主な`Router`用語とその意味は次のとおりです:

| Router part           | Details |
|:---                   |:---     |
| `Router`              | Displays the application component for the active URL. Manages navigation from one component to the next.                                                                                        |
| `provideRouter`       | provides the necessary service providers for navigating through application views.                                                                                        |
| `RouterModule`        | A separate NgModule that provides the necessary service providers and directives for navigating through application views.                                                                       |
| `Routes`              | Defines an array of Routes, each mapping a URL path to a component.                                                                                                                              |
| `Route`               | Defines how the router should navigate to a component based on a URL pattern. Most routes consist of a path and a component type.                                                                |
| `RouterOutlet`        | The directive \(`<router-outlet>`\) that marks where the router displays a view.                                                                                                                 |
| `RouterLink`          | The directive for binding a clickable HTML element to a route. Clicking an element with a `routerLink` directive that's bound to a *string* or a *link parameters array* triggers a navigation. |
| `RouterLinkActive`    | The directive for adding/removing classes from an HTML element when an associated `routerLink` contained on or inside the element becomes active/inactive. It can also set the `aria-current` of an active link for better accessibility.                                       |
| `ActivatedRoute`      | A service that's provided to each route component that contains route specific information such as route parameters, static data, resolve data, global query parameters, and the global fragment.   |
| `RouterState`         | The current state of the router including a tree of the currently activated routes together with convenience methods for traversing the route tree.                                              |
| Link parameters array | An array that the router interprets as a routing instruction. You can bind that array to a `RouterLink` or pass the array as an argument to the `Router.navigate` method.                        |
| Routing component     | An Angular component with a `RouterOutlet` that displays views based on router navigations.                                                                                                      |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-08-29
