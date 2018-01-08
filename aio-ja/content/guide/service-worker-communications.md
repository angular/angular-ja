# Service Workerと通信する

`AppModule`に`ServiceWorkerModule`をインポートしたら、Service Workerを登録するだけではなく、Service Workerと対話してアプリケーションのキャッシュを制御するためのサービスも使えるようになります。

#### 前提条件

次の基本的理解があること
* [Service Workerを始める](guide/service-worker-getting-started)

<hr />


## `SwUpdate`サービス

`SwUpdate`サービスは、Service Workerがあなたのアプリケーションで利用可能なアップデートを発見したとき、またはそのアップデートをアクティブにしたときを示すイベントへのアクセスを提供します。

`SwUpdate`サービスは4つの操作をサポートします。
* *利用可能*なアップデートの通知を受け取る。これらは、ページが更新されたときに読み込まれる新しいバージョンのアプリケーションです。
* *アクティブ化*したアップデートの通知を受け取る。これは、Service Workerがすぐに新しいバージョンのアプリケーションのサービスを開始するときです。
* 新しい更新のためにサーバーをチェックするようにService Workerに依頼する。
* 現在のタブの最新バージョンのアプリケーションを有効にするようにService Workerに依頼する。

### 利用可能でアクティブ化したアップデート

`available`と`activated`の2つのアップデートイベントは、`SwUpdate`の`Observable`プロパティです。

<code-example path="service-worker-getting-started/src/app/log-update.service.ts" linenums="false" title="log-update.service.ts" region="sw-update"> </code-example>


これらのイベントを使用して、保留中のアップデートをユーザーに通知したり、実行中のコードが古い場合にページを更新したりすることができます。

### アップデートをチェックする

Service Workerに、サーバーにデプロイされたアップデートがあるかどうかを確認させることができます。頻繁に変更されるサイトがある場合やスケジュールに基づいて更新が行われるようにする場合は、これを選択することもできます。

`checkForUpdate()`メソッドで行います。

<code-example path="service-worker-getting-started/src/app/check-for-update.service.ts" linenums="false" title="check-for-update.service.ts" region="sw-check-update"> </code-example>


このメソッドは、更新チェックが正常に完了したことを示すPromiseを返しますが、チェックの結果アップデートが検出されたかどうかは示しません。アップデートが見つかったとしても、Service Workerは変更されたファイルを正常にダウンロードする必要があり、まだ失敗する可能性があるからです。成功した場合、availableイベントが、新しいバージョンのアプリケーションが使用可能になったことを示します。

### アップデートのアクティブ化を強制する

現在のタブを最新のアプリケーションバージョンに直ちに更新する必要がある場合は、`activateUpdate()`メソッドを使用して要求することができます。

<code-example path="service-worker-getting-started/src/app/prompt-update.service.ts" linenums="false" title="prompt-update.service.ts" region="sw-activate"> </code-example>

これを行うと、現在実行中のアプリケーションの遅延ロードが中断される可能性があります。特に遅延ロードされるチャンクが、バージョンごとに変更されるハッシュをファイル名に使用している場合です。

## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [プロダクション環境のService Worker](guide/service-worker-devops).
