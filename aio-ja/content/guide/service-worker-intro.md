# Angular Service Worker イントロダクション

Service Workerは、従来のWebデプロイメントモデルを強化し、ネイティブにインストールされたコードと同等の信頼性とパフォーマンスでユーザー体験できるようにアプリケーションを補強します。

簡潔にいうと、Service Workerは、Webブラウザで実行され、アプリケーションのキャッシュを管理するスクリプトのことです。

Service Workerは、ネットワークプロキシとして機能します。アプリケーションによって行われたすべてのHTTPリクエストを傍受し、応答する方法を選択できます。たとえば、ローカルキャッシュを参照し、キャッシュされたレスポンスがある場合はそのレスポンスを送信することができます。プロキシは、`fetch`のようなプログラム的にAPIによって作られたリクエストでも制限されません。HTMLで参照されるリソースや、最初の`index.html`へのリクエストでさえも含みます。したがって、Service Workerベースのキャッシュは完全にプログラム可能であり、サーバー指定のキャッシュヘッダーに依存しません。

アプリケーションを構成する他のスクリプト（Angularアプリなど）とは異なり、Service Workerは、ユーザーがタブを閉じた後も保持されます。次にブラウザがアプリケーションをロードすると、Service Workerが最初にロードされ、アプリケーションのロードに必要なすべてのリソース要求をインターセプトできます。Service Workerの設計次第では、アプリケーションを *ネットワークに接続せずに完全にロードできます*。

高速で信頼性あるネットワークであっても、ラウンドトリップ遅延はアプリケーションをロードする際に大きな遅延を招く可能性があります。Service Workerを使用してネットワークへの依存を減らすと、ユーザー体験が大幅に向上します。


## AngularにおけるService Worker

シングルページアプリケーションとしてのAngularは、Service Workerのメリットを享受するうえで最重要な位置にあります。バージョン5.0.0より、AngularはService Workerの実装を提供しています。Angularの開発者は、このService Workerを利用して、低レベルのAPIをコーディングすることなく、信頼性とパフォーマンスを向上させることができます。

AngularにおけるService Workerは、低速、あるいは信頼性が低いネットワーク接続を通してアプリケーションを使用しているユーザーの体験を最適化し、古いコンテンツを配信してしまうリスクを最小限に抑えるように設計されています。

AngularにおけるService Workerの振る舞いは、次の設計目標に従います。

* アプリケーションのキャッシュは、ネイティブアプリケーションのインストールに似ています。アプリケーションは1つのユニットとしてキャッシュされ、すべてのファイルが同時に更新されます。
* 実行中のアプリケーションは、すべて同じバージョンのファイルで実行され続けます。互換性がない可能性がある新しいバージョンからキャッシュされたファイルを突然受信し始めることはありません。
* ユーザーがアプリケーションを更新すると、完全にキャッシュされた最新のバージョンが表示されます。新しいタブには最新のキャッシュされたコードが読み込まれます。
* 更新は、変更が公開された後、比較的迅速にバックグラウンドで行われます。以前のバージョンのアプリケーションは、アップデートがインストールされ準備が整うまで提供されます。
* Service Workerは、可能な限り帯域幅を節約します。リソースは変更された場合にのみダウンロードされます。

これらの動作をサポートするために、AngularにおけるService Workerは*マニフェスト*ファイルをサーバーからロードします。マニフェストは、キャッシュするリソースを記述し、すべてのファイルのハッシュを含みます。アプリケーションの更新が展開されると、マニフェストの内容が変更され、アプリケーションの新しいバージョンをダウンロードしてキャッシュする必要があることがService Workerに通知されます。このマニフェストは、CLIに生成された`ngsw-config.json`という設定ファイルから生成されます。

AngularにおけるService Workerのインストールは、`NgModule`に含めるだけです。ブラウザにAngularにおけるService Workerを登録することに加えて、Service Workerとやりとりしたり、Service Workerを制御するために使用できる、いくつかのサービスをインジェクション可能にします。たとえば、新しい更新が利用可能になったときに通知を受けるようにアプリケーションに依頼することも、Service Workerに利用可能な更新をサーバーに確認するように依頼することもできます。

## 前提条件

アプリケーションは、Service WorkerをサポートするWebブラウザで実行する必要があります。現在、ChromeとFirefoxの最新バージョンでサポートされています。他のブラウザについては、[Can I Use](http://caniuse.com/#feat=serviceworkers)ページを参照してください。

## 関連資料

Service Workerの一般的な情報については、[Service Workerの紹介](https://developers.google.com/web/fundamentals/primers/service-workers/)を参照してください。

ブラウザサポートの詳細については、[Service Workerの紹介](https://developers.google.com/web/fundamentals/primers/service-workers/)の[サポートしているブラウザを使う](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support)セクションや、Jake Archibaldの[Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready/)、[Can I Use](http://caniuse.com/#feat=serviceworkers)を参照してください。

このドキュメンテーションの続きでは、Service WorkerをAngularに実装することに取り組みます。

## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [Service Workerを始める](guide/service-worker-getting-started)
