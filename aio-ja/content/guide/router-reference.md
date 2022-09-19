# ルーターレファレンス {@a router-reference}

以降のセクションでは、いくつかのコアルーターの概念にハイライトします。

{@a basics-router-imports}

### ルーターのインポート {@a router-imports}

Angularのルーターはオプションのサービスであり、指定されたURLにおける特定のコンポーネントビューを表示します。
これはAngularコアの一部ではなく、それゆえ独自のライブラリパッケージ`@angular/router`内にあります。

他のAngularパッケージと同じく、そこから必要なものをインポートします。

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (import)" region="import-router"></code-example>


<div class="alert is-helpful">

ブラウザのURLスタイルの詳細については、[`LocationStrategy`とブラウザのURLスタイル](guide/router#browser-url-styles)を参照しましょう。

</div>

{@a basics-config}

### 設定 {@a configuration}

ルーティングされたAngularアプリケーションには、`Router`サービスのシングルトンインスタンスが1つあります。
ブラウザのURLが変わると、そのルーターは対応する`Route`を探します。そのルートから表示するコンポーネントを決定できます。

ルーターは設定するまではルートをもちません。
次の例では、5つのルート定義を作成し、`RouterModule.forRoot()`メソッドを介してルーターを設定し、その結果を`AppModule`の`imports`配列に追加しています。

<code-example path="router/src/app/app.module.0.ts" header="src/app/app.module.ts (excerpt)"></code-example>

{@a example-config}

ルートの`appRoutes`配列は、どのようにナビゲートするかを記述しています。
これをモジュールの`imports`にある`RouterModule.forRoot()`メソッドに渡してルーターを設定します。

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

ナビゲーションライフサイクル中に何のイベントが発生しているかを確認する必要がある場合は、ルーターのデフォルト設定の一部として`enableTracing`オプションがあります。
これは、各ナビゲーションライフサイクル中に発生した各ルーターイベントをブラウザコンソールに出力します。
`enableTracing`はデバッグ目的でのみ使用しましょう。
`RouterModule.forRoot()`メソッドへの2番目の引数として渡されるオブジェクトにおいて、`enableTracing: true`オプションを設定します。

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

`enableTracing`オプションを有効にすると、Angularはこれらのイベントをコンソールにログします。
ルーターのナビゲーションイベントをフィルタリングする例については、[AngularでのObservable](guide/observables-in-angular)の[ルーターのセクション](guide/observables-in-angular#router)を参照しましょう。

### ルーター用語 {@a router-terminology}

主な`Router`用語とその意味は次のとおりです:

<table>

  <tr>

    <th>
      ルーター部分
    </th>

    <th>
      意味
    </th>

  </tr>

  <tr>

    <td>
      <code>Router</code>
    </td>

    <td>
      アクティブなURLのアプリケーションコンポーネントを表示します。
      あるコンポーネントから次のコンポーネントへのナビゲーションを管理します。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterModule</code>
    </td>

    <td>
      アプリケーションビューをナビゲートするために必要なサービスプロバイダーとディレクティブを提供する、
      別個のNgModuleです。
    </td>

  </tr>

  <tr>

    <td>
      <code>Routes</code>
    </td>

    <td>
      ルートの配列を定義します。それぞれがURLパスをコンポーネントにマッピングしています。
    </td>

  </tr>

  <tr>

    <td>
      <code>Route</code>
    </td>

    <td>
      ルーターがURLパターンに基づいてコンポーネントにナビゲートする方法を定義します。
      ほとんどのルートは、パスとコンポーネントの型で構成されます。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterOutlet</code>
    </td>

    <td>
      ルーターがビューを表示する場所をマークするディレクティブ(<code>&lt;router-outlet></code>)。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLink</code>
    </td>

    <td>
      クリック可能なHTML要素をルートにバインドするためのディレクティブ。<i>文字列</i>や<i>リンクパラメータ配列</i>にバインドされている<code>routerLink</code>ディレクティブをもつ要素をクリックすると、ナビゲーションがトリガーされます。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLinkActive</code>
    </td>

    <td>
      要素上または要素内に含まれる結び付けられた<code>routerLink</code>がアクティブ/非アクティブになったとき、HTML要素からクラスを追加/削除するためのディレクティブ。It can also set the `aria-current` of an active link for better accessibility.  
    </td>

  </tr>

  <tr>

    <td>
      <code>ActivatedRoute</code>
    </td>

    <td>
      各ルートのコンポーネントに提供されるサービス。ルートパラメータ、静的データ、解決データ、グローバルクエリパラメータ、グローバルフラグメントなどのルート固有の情報を含みます。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterState</code>
    </td>

    <td>
      ルーターの現在の状態で、現在アクティブ化されたルートのツリーとともにルートツリーをトラバースするための便利なメソッドを含みます。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>リンクパラメータ配列</i></b>
    </td>

    <td>
      ルーターがルーティングの指示として解釈する配列。
      その配列を<code>RouterLink</code>にバインドするか、<code>Router.navigate</code>メソッドの引数として渡すことができます。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>ルーティングコンポーネント</i></b>
    </td>

    <td>
      <code>RouterOutlet</code>をもつAngularのコンポーネントで、ルーターのナビゲーションに基づいてビューを表示します。
    </td>

  </tr>

</table>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
