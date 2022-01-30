# Angular Service Worker イントロダクション

Service Worker は、従来の Web デプロイメントモデルを強化し、OS やハードウェア上で動作するように書かれたコードと同等の信頼性とパフォーマンスでユーザー体験できるようにアプリケーションを補強します。Angular アプリケーションへの Service Worker の追加は、アプリケーションを [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) (PWA としても知られます) に変えるためのステップのひとつです。

簡潔にいうと、Service Worker は、Web ブラウザで実行され、アプリケーションのキャッシュを管理するスクリプトのことです。

Service Worker は、ネットワークプロキシとして機能します。アプリケーションによって行われたすべての HTTP リクエストを傍受し、応答する方法を選択できます。たとえば、ローカルキャッシュを参照し、キャッシュされたレスポンスがある場合はそのレスポンスを送信することができます。プロキシは、`fetch`のようなプログラム的に API によって作られたリクエストでも制限されません。HTML で参照されるリソースや、最初の`index.html`へのリクエストでさえも含みます。したがって、Service Worker ベースのキャッシュは完全にプログラム可能であり、サーバー指定のキャッシュヘッダーに依存しません。

アプリケーションを構成する他のスクリプト（Angular アプリケーションなど）とは異なり、Service Worker は、ユーザーがタブを閉じた後も保持されます。次にブラウザがアプリケーションをロードすると、Service Worker が最初にロードされ、アプリケーションのロードに必要なすべてのリソース要求をインターセプトできます。Service Worker の設計次第では、アプリケーションを _ネットワークに接続せずに完全にロードできます_。

高速で信頼性あるネットワークであっても、ラウンドトリップ遅延はアプリケーションをロードする際に大きな遅延を招く可能性があります。Service Worker を使用してネットワークへの依存を減らすと、ユーザー体験が大幅に向上します。

## Angular における Service Worker

シングルページアプリケーションとしての Angular は、Service Worker のメリットを享受するうえで最重要な位置にあります。バージョン 5.0.0 より、Angular は Service Worker の実装を提供しています。Angular の開発者は、この Service Worker を利用して、低レベルの API をコーディングすることなく、信頼性とパフォーマンスを向上させることができます。

Angular における Service Worker は、低速、あるいは信頼性が低いネットワーク接続を通してアプリケーションを使用しているユーザーの体験を最適化し、古いコンテンツを配信してしまうリスクを最小限に抑えるように設計されています。

Angular における Service Worker の振る舞いは、次の設計目標に従います。

- アプリケーションのキャッシュは、ネイティブアプリケーションのインストールに似ています。アプリケーションは 1 つのユニットとしてキャッシュされ、すべてのファイルが同時に更新されます。
- 実行中のアプリケーションは、すべて同じバージョンのファイルで実行され続けます。互換性がない可能性がある新しいバージョンからキャッシュされたファイルを突然受信し始めることはありません。
- ユーザーがアプリケーションを更新すると、完全にキャッシュされた最新のバージョンが表示されます。新しいタブには最新のキャッシュされたコードが読み込まれます。
- 更新は、変更が公開された後、比較的迅速にバックグラウンドで行われます。以前のバージョンのアプリケーションは、アップデートがインストールされ準備が整うまで提供されます。
- Service Worker は、可能な限り帯域幅を節約します。リソースは変更された場合にのみダウンロードされます。

これらの動作をサポートするために、Angular における Service Worker は*マニフェスト*ファイルをサーバーからロードします。`ngsw.json`と呼ばれるファイル（[web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)と混同しないように）は、キャッシュするリソースを記述し、すべてのファイルのハッシュを含みます。アプリケーションの更新が展開されると、マニフェストの内容が変更され、アプリケーションの新しいバージョンをダウンロードしてキャッシュする必要があることが Service Worker に通知されます。このマニフェストは、CLI に生成された`ngsw-config.json`という設定ファイルから生成されます。

Angular における Service Worker のインストールは、`NgModule`に含めるだけです。ブラウザに Angular における Service Worker を登録することに加えて、Service Worker とやりとりしたり、Service Worker を制御するために使用できる、いくつかのサービスをインジェクション可能にします。たとえば、新しい更新が利用可能になったときに通知を受けるようにアプリケーションに依頼することも、Service Worker に利用可能な更新をサーバーに確認するように依頼することもできます。

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

- The browser does not download the service worker script and `ngsw.json` manifest file.
- Active attempts to interact with the service worker, such as calling `SwUpdate.checkForUpdate()`, return rejected promises.
- The observable events of related services, such as `SwUpdate.available`, are not triggered.

It is highly recommended that you ensure that your app works even without service worker support in the browser.
Although an unsupported browser ignores service worker caching, it will still report errors if the app attempts to interact with the service worker.
For example, calling `SwUpdate.checkForUpdate()` will return rejected promises.
To avoid such an error, you can check whether the Angular service worker is enabled using `SwUpdate.isEnabled`.

To learn more about other browsers that are service worker ready, see the [Can I Use](https://caniuse.com/#feat=serviceworkers) page and [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

## 関連資料

The rest of the articles in this section specifically address the Angular implementation of service workers.

- [App Shell](guide/app-shell)
- [Service Worker Communication](guide/service-worker-communications)
- [Service Worker Notifications](guide/service-worker-notifications)
- [Service Worker in Production](guide/service-worker-devops)
- [Service Worker Configuration](guide/service-worker-config)

Service Worker の一般的な情報については、[Service Worker の紹介](https://developers.google.com/web/fundamentals/primers/service-workers/)を参照してください。

ブラウザサポートの詳細については、[Service Worker の紹介](https://developers.google.com/web/fundamentals/primers/service-workers/)の[サポートしているブラウザを使う](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support)セクションや、Jake Archibald の[Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready/)、[Can I Use](https://caniuse.com/#feat=serviceworkers)を参照してください。

For additional recommendations and examples, see:

- [Precaching with Angular Service Worker](https://web.dev/precaching-with-the-angular-service-worker/)
- [Creating a PWA with Angular CLI](https://web.dev/creating-pwa-with-angular-cli/)

## 次のステップへ

To begin using Angular service workers, see [Getting Started with service workers](guide/service-worker-getting-started).
