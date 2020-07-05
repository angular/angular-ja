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

<code-example path="service-worker-getting-started/src/app/log-update.service.ts" header="log-update.service.ts" region="sw-update"></code-example>


これらのイベントを使用して、保留中のアップデートをユーザーに通知したり、実行中のコードが古い場合にページを更新したりすることができます。

### アップデートをチェックする

Service Workerに、サーバーにデプロイされたアップデートがあるかどうかを確認させることができます。
The service worker checks for updates during initialization and on each navigation request&mdash;that is, when the user navigates from a different address to your app.
However, you might choose to manually check for updates if you have a site that changes frequently or want updates to happen on a schedule.

`checkForUpdate()`メソッドで行います。

<code-example path="service-worker-getting-started/src/app/check-for-update.service.ts" header="check-for-update.service.ts"></code-example>

このメソッドは、更新チェックが正常に完了したことを示すPromiseを返しますが、チェックの結果アップデートが検出されたかどうかは示しません。アップデートが見つかったとしても、Service Workerは変更されたファイルを正常にダウンロードする必要があり、まだ失敗する可能性があるからです。成功した場合、availableイベントが、新しいバージョンのアプリケーションが使用可能になったことを示します。

<div class="alert is-important">

In order to avoid negatively affecting the initial rendering of the page, `ServiceWorkerModule` waits for up to 30 seconds by default for the app to stabilize, before registering the Service Worker script.
Constantly polling for updates, for example, with [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) or RxJS' [interval()](https://rxjs.dev/api/index/function/interval), will prevent the app from stabilizing and the Service Worker script will not be registered with the browser until the 30 seconds upper limit is reached.

Note that this is true for any kind of polling done by your application.
Check the {@link ApplicationRef#isStable isStable} documentation for more information.

You can avoid that delay by waiting for the app to stabilize first, before starting to poll for updates, as shown in the example above.
Alternatively, you might want to define a different {@link SwRegistrationOptions#registrationStrategy registration strategy} for the Service Worker.

</div>

### アップデートのアクティブ化を強制する

現在のタブを最新のアプリケーションバージョンに直ちに更新する必要がある場合は、`activateUpdate()`メソッドを使用して要求することができます。

<code-example path="service-worker-getting-started/src/app/prompt-update.service.ts" header="prompt-update.service.ts" region="sw-activate"></code-example>

<div class="alert is-important">

Calling `activateUpdate()` without reloading the page could break lazy-loading in a currently running app, especially if the lazy-loaded chunks use filenames with hashes, which change every version.
Therefore, it is recommended to reload the page once the promise returned by `activateUpdate()` is resolved.

</div>

## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [プロダクション環境のService Worker](guide/service-worker-devops).
