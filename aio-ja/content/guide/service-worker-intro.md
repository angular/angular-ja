# Angular Service Worker イントロダクション

Service Workerは、従来のWebデプロイメントモデルを強化し、OSやハードウェア上で動作するように書かれたコードと同等の信頼性とパフォーマンスでユーザー体験できるようにアプリケーションを補強します。
AngularアプリケーションへのService Workerの追加は、アプリケーションを [Progressive Web App](https://web.dev/progressive-web-apps/) (PWAとしても知られます) に変えるためのステップのひとつです。

簡潔にいうと、Service Workerは、Webブラウザで実行され、アプリケーションのキャッシュを管理するスクリプトのことです。

Service Workerは、ネットワークプロキシとして機能します。
アプリケーションによって行われたすべてのHTTPリクエストを傍受し、応答する方法を選択できます。
たとえば、ローカルキャッシュを参照し、キャッシュされたレスポンスがある場合はそのレスポンスを送信することができます。
プロキシは、`fetch`のようなプログラム的にAPIによって作られたリクエストでも制限されません。HTMLで参照されるリソースや、最初の`index.html`へのリクエストでさえも含みます。
したがって、Service Workerベースのキャッシュは完全にプログラム可能であり、サーバー指定のキャッシュヘッダーに依存しません。

アプリケーションを構成する他のスクリプト（Angularアプリケーションなど）とは異なり、Service Workerは、ユーザーがタブを閉じた後も保持されます。
次にブラウザがアプリケーションをロードすると、Service Workerが最初にロードされ、アプリケーションのロードに必要なすべてのリソース要求をインターセプトできます。
Service Workerの設計次第では、アプリケーションを *ネットワークに接続せずに完全にロードできます*。

高速で信頼性あるネットワークであっても、ラウンドトリップ遅延はアプリケーションをロードする際に大きな遅延を招く可能性があります。
Service Workerを使用してネットワークへの依存を減らすと、ユーザー体験が大幅に向上します。

## AngularにおけるService Worker

シングルページアプリケーションとしてのAngularは、Service Workerのメリットを享受するうえで最重要な位置にあります。
バージョン5.0.0より、AngularはService Workerの実装を提供しています。
Angularの開発者は、このService Workerを利用して、低レベルのAPIをコーディングすることなく、信頼性とパフォーマンスを向上させることができます。

AngularにおけるService Workerは、低速、あるいは信頼性が低いネットワーク接続を通してアプリケーションを使用しているユーザーの体験を最適化し、古いコンテンツを配信してしまうリスクを最小限に抑えるように設計されています。

AngularにおけるService Workerの振る舞いは、次の設計目標に従います。

*   アプリケーションのキャッシュは、ネイティブアプリケーションのインストールに似ています。
    アプリケーションは1つのユニットとしてキャッシュされ、すべてのファイルが同時に更新されます。

*   実行中のアプリケーションは、すべて同じバージョンのファイルで実行され続けます。
    互換性がない可能性がある新しいバージョンからキャッシュされたファイルを突然受信し始めることはありません。

*   ユーザーがアプリケーションを更新すると、完全にキャッシュされた最新のバージョンが表示されます。
    新しいタブには最新のキャッシュされたコードが読み込まれます。

*   更新は、変更が公開された後、比較的迅速にバックグラウンドで行われます。
    以前のバージョンのアプリケーションは、アップデートがインストールされ準備が整うまで提供されます。

*   Service Workerは、可能な限り帯域幅を節約します。
    リソースは変更された場合にのみダウンロードされます。

これらの動作をサポートするために、AngularにおけるService Workerは*マニフェスト*ファイルをサーバーからロードします。
`ngsw.json`と呼ばれるファイル（[web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)と混同しないように）は、キャッシュするリソースを記述し、すべてのファイルのハッシュを含みます。
アプリケーションの更新が展開されると、マニフェストの内容が変更され、アプリケーションの新しいバージョンをダウンロードしてキャッシュする必要があることがService Workerに通知されます。
このマニフェストは、CLIに生成された`ngsw-config.json`という設定ファイルから生成されます。

Angularサービスワーカーのインストールは、[Angular CLIコマンドを実行する](guide/service-worker-getting-started#cli-command)と同じくらい簡単です。
ブラウザにAngularにおけるService Workerを登録することに加えて、Service Workerとやりとりしたり、Service Workerを制御するために使用できる、いくつかのサービスをインジェクション可能にします。
たとえば、新しい更新が利用可能になったときに通知を受けるようにアプリケーションに依頼することも、Service Workerに利用可能な更新をサーバーに確認するように依頼することもできます。

## 前提条件

To make use of all the features of Angular service worker, use the latest versions of Angular and the Angular CLI.

In order for service workers to be registered, the app must be accessed over HTTPS, not HTTP.
Browsers ignore service workers on pages that are served over an insecure connection.
The reason is that service workers are quite powerful, so extra care needs to be taken to ensure the service worker script has not been tampered with.

There is one exception to this rule: to make local development easier, browsers do _not_ require a secure connection when accessing an app on `localhost`.

### Browser support

To benefit from the Angular service worker, your app must run in a web browser that supports service workers in general.
Currently, service workers are supported in the latest versions of Chrome, Firefox, Edge, Safari, Opera, UC Browser (Android version) and Samsung Internet.
Browsers like IE and Opera Mini do not support service workers.

If the user is accessing your app via a browser that does not support service workers, the service worker is not registered and related behavior such as offline cache management and push notifications does not happen.
More specifically:

*   The browser does not download the service worker script and the `ngsw.json` manifest file
*   Active attempts to interact with the service worker, such as calling `SwUpdate.checkForUpdate()`, return rejected promises
*   The observable events of related services, such as `SwUpdate.versionUpdates`, are not triggered

It is highly recommended that you ensure that your app works even without service worker support in the browser.
Although an unsupported browser ignores service worker caching, it will still report errors if the app attempts to interact with the service worker.
For example, calling `SwUpdate.checkForUpdate()` will return rejected promises.
To avoid such an error, you can check whether the Angular service worker is enabled using `SwUpdate.isEnabled`.

To learn more about other browsers that are service worker ready, see the [Can I Use](https://caniuse.com/#feat=serviceworkers) page and [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

## 関連資料

The rest of the articles in this section specifically address the Angular implementation of service workers.

*   [Service Worker Communication](guide/service-worker-communications)
*   [Service Worker Notifications](guide/service-worker-notifications)
*   [Service Worker in Production](guide/service-worker-devops)
*   [Service Worker Configuration](guide/service-worker-config)
*   [App Shell](guide/app-shell)

Service Workerの一般的な情報については、[Service Workerの紹介](https://developers.google.com/web/fundamentals/primers/service-workers/)を参照してください。

ブラウザサポートの詳細については、[Service Workerの紹介](https://developers.google.com/web/fundamentals/primers/service-workers/)の[サポートしているブラウザを使う](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support)セクションや、Jake Archibaldの[Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready/)、[Can I Use](https://caniuse.com/#feat=serviceworkers)を参照してください。

For additional recommendations and examples, see:

* [Precaching with Angular Service Worker](https://web.dev/precaching-with-the-angular-service-worker/)
* [Creating a PWA with Angular CLI](https://web.dev/creating-pwa-with-angular-cli/)

## 次のステップへ

To begin using Angular service workers, see [Getting Started with service workers](guide/service-worker-getting-started).

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-09-06
