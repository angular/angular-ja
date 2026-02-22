# ルーターリファレンス

以下のセクションでは、いくつかの主要なルーターの概念と用語を取り上げています。

## ルーターイベント {#router-events}

各ナビゲーション中に、`Router`は`Router.events`プロパティを通じてナビゲーションイベントを発行します。
これらのイベントを次の表に示します。

| ルーターイベント                                          | 詳細                                                                                                                                                                |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | ナビゲーションが開始されたときにトリガーされます。                                                                                                                   |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | `Router`がルート設定を遅延読み込みする前にトリガーされます。                                                                                                             |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | ルートが遅延読み込みされた後にトリガーされます。                                                                                                                         |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | RouterがURLを解析し、ルートが認識されたときにトリガーされます。                                                                                                        |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | RouterがルーティングのGuardsフェーズを開始したときにトリガーされます。                                                                                                 |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Routerがルートの子をアクティブ化し始めたときにトリガーされます。                                                                                                       |
| [`ActivationStart`](api/router/ActivationStart)           | Routerがルートをアクティブ化し始めたときにトリガーされます。                                                                                                           |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | RouterがルーティングのGuardsフェーズを正常に完了したときにトリガーされます。                                                                                           |
| [`ResolveStart`](api/router/ResolveStart)                 | RouterがルーティングのResolveフェーズを開始したときにトリガーされます。                                                                                                |
| [`ResolveEnd`](api/router/ResolveEnd)                     | RouterがルーティングのResolveフェーズを正常に完了したときにトリガーされます。                                                                                          |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Routerがルートの子のアクティブ化を完了したときにトリガーされます。                                                                                                     |
| [`ActivationEnd`](api/router/ActivationEnd)               | Routerがルートのアクティブ化を完了したときにトリガーされます。                                                                                                         |
| [`NavigationEnd`](api/router/NavigationEnd)               | ナビゲーションが正常に終了したときにトリガーされます。                                                                                                               |
| [`NavigationCancel`](api/router/NavigationCancel)         | ナビゲーションがキャンセルされたときにトリガーされます。これは、ナビゲーション中にルートガードがfalseを返すか、`UrlTree`または`RedirectCommand`を返すことによってリダイレクトされた場合に発生します。 |
| [`NavigationError`](api/router/NavigationError)           | 予期せぬエラーによりナビゲーションが失敗したときにトリガーされます。                                                                                                   |
| [`Scroll`](api/router/Scroll)                             | スクロールイベントを表します。                                                                                                                                         |

`withDebugTracing`機能を有効にすると、Angularはこれらのイベントをコンソールにログ出力します。

## ルーター用語 {#router-terminology}

主な`Router`用語とその意味を以下に示します。

| ルーターの要素 | 詳細 |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Router`              | アクティブなURLに対応するアプリケーションコンポーネントを表示します。あるコンポーネントから次のコンポーネントへのナビゲーションを管理します。 |
| `provideRouter`       | アプリケーションビュー間をナビゲートするために必要なサービスプロバイダーを提供します。 |
| `RouterModule`        | アプリケーションビュー間をナビゲートするために必要なサービスプロバイダーとディレクティブを提供する独立したNgModuleです。 |
| `Routes`              | URLパスをコンポーネントにマッピングする`Route`の配列を定義します。 |
| `Route`               | URLパターンに基づいてルーターがコンポーネントにナビゲートする方法を定義します。ほとんどのルートは、パスとコンポーネントタイプで構成されます。 |
| `RouterOutlet`        | ルーターがビューを表示する場所を示すディレクティブ (`<router-outlet>`) です。 |
| `RouterLink`          | クリック可能なHTML要素をルートにバインドするためのディレクティブです。_文字列_または_リンクパラメーター配列_にバインドされた`routerLink`ディレクティブを持つ要素をクリックすると、ナビゲーションがトリガーされます。 |
| `RouterLinkActive`    | 関連する`routerLink`が要素内または要素上でアクティブ/非アクティブになったときに、HTML要素からクラスを追加/削除するためのディレクティブです。アクセシビリティ向上のため、アクティブなリンクの`aria-current`を設定することもできます。 |
| `ActivatedRoute`      | ルートパラメーター、静的データ、解決済みデータ、グローバルクエリパラメーター、グローバルフラグメントなどのルート固有の情報を含む、各ルートコンポーネントに提供されるサービスです。 |
| `RouterState`         | 現在アクティブなルートのツリーと、ルートツリーを走査するための便利なメソッドを含む、ルーターの現在の状態です。 |
| リンクパラメーター配列 | ルーターがルーティング命令として解釈する配列です。この配列を`RouterLink`にバインドしたり、`Router.navigate`メソッドの引数として渡したりできます。 |
| ルーティングコンポーネント | ルーターナビゲーションに基づいてビューを表示する、`RouterOutlet`を持つAngularコンポーネントです。 |

## `<base href>`

ルーターは、ナビゲーションにブラウザの[history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state')を使用します。
`pushState`を使用すると、アプリケーション内のURLパスをカスタマイズできます。例: `localhost:4200/crisis-center`。
アプリケーション内のURLは、サーバーURLと区別できない場合があります。

最新のHTML5ブラウザが最初に`pushState`をサポートしたため、多くの人がこれらのURLを「HTML5スタイル」URLと呼んでいます。

HELPFUL: HTML5スタイルのナビゲーションはルーターのデフォルトです。
[LocationStrategyとブラウザURLスタイル](guide/routing/common-router-tasks#locationstrategy-and-browser-url-styles)のセクションで、HTML5スタイルが推奨される理由、その動作を調整する方法、必要に応じて古いハッシュ\(`#`\)スタイルに切り替える方法を学びましょう。

`pushState`ルーティングを機能させるには、アプリケーションの`index.html`に[`<base href>`要素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href')を追加する必要があります。
ブラウザは、CSSファイル、スクリプト、画像を相対URLで参照する際に、`<base href>`の値をプレフィックスとして使用します。

`<base>`要素は`<head>`タグの直後に追加します。
`app`フォルダがこのアプリケーションのアプリケーションルートである場合、`index.html`の`href`値をここに示されているように設定します。

```html
<base href="/" />
```

### HTML5 URLと`<base href>` {#html5-urls-and-the-base-href}

以下のガイドラインでは、URLのさまざまな部分について言及します。
この図は、それらの部分が何を参照しているかを示しています。

```text {hideCopy}
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
```

ルーターはデフォルトで[HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state')スタイルを使用しますが、その戦略を`<base href>`で設定する必要があります。

この戦略を設定する推奨される方法は、`index.html`の`<head>`に[`<base href>`要素](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href')タグを追加することです。

```angular-html
<base href="/" />
```

そのタグがないと、アプリケーションに「ディープリンク」した場合、ブラウザがリソース（画像、CSS、スクリプト）をロードできない可能性があります。

一部の開発者は、`<head>`または`index.html`にアクセスできないなどの理由で、`<base>`要素を追加できない場合があります。

そのような開発者でも、以下の2つの手順を実行することでHTML5 URLを使用できます。

1. ルーターに適切な`APP_BASE_HREF`値を提供します。
2. すべてのWebリソース（CSS、画像、スクリプト、テンプレートHTMLファイル）にルートURL（`authority`を持つURL）を使用します。
   - `<base href>`の`path`は"/"で終わる必要があります。ブラウザは、最も右の"/"に続く`path`内の文字を無視するためです。
   - `<base href>`に`query`部分が含まれている場合、`query`は、ページ内のリンクの`path`が空で`query`がない場合にのみ使用されます。
     これは、`<base href>`内の`query`が`HashLocationStrategy`を使用している場合にのみ含まれることを意味します。

   - ページ内のリンクがルートURL（`authority`を持つ）である場合、`<base href>`は使用されません。
     このように、`authority`を持つ`APP_BASE_HREF`は、Angularによって作成されたすべてのリンクが`<base href>`の値を無視するようにします。

   - `<base href>`内のフラグメントは_決して_保持されません。

`<base href>`がターゲットURIの構築にどのように使用されるかについてのより完全な情報は、参照の変換に関する[RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2)セクションを参照してください。

### `HashLocationStrategy` {#hashlocationstrategy}

`AppModule`の`RouterModule.forRoot()`の2番目の引数として、オブジェクト内で`useHash: true`を提供することで`HashLocationStrategy`を使用します。

```ts
providers: [provideRouter(appRoutes, withHashLocation())];
```

`RouterModule.forRoot`を使用する場合、これは2番目の引数`RouterModule.forRoot(routes, {useHash: true})`で`useHash: true`を使用して設定されます。
