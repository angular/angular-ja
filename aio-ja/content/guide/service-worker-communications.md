# Service Workerと通信する

`AppModule`に`ServiceWorkerModule`をインポートしたら、Service Workerを登録するだけではなく、Service Workerと対話してアプリケーションのキャッシュを制御するためのサービスも使えるようになります。

#### 前提条件

次の基本的理解があること
* [Service Workerを始める](guide/service-worker-getting-started)


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

This method returns a `Promise<boolean>` which indicates if an update is available for activation.
The check might fail, which will cause a rejection of the `Promise`.

<div class="alert is-important">

In order to avoid negatively affecting the initial rendering of the page, `ServiceWorkerModule` waits for up to 30 seconds by default for the app to stabilize, before registering the Service Worker script.
Constantly polling for updates, for example, with [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) or RxJS' [interval()](https://rxjs.dev/api/index/function/interval), prevents the application from stabilizing and the Service Worker script is not registered with the browser until the 30 seconds upper limit is reached.

Note that this is true for any kind of polling done by your application.
Check the {@link ApplicationRef#isStable isStable} documentation for more information.

Avoid that delay by waiting for the application to stabilize first, before starting to poll for updates, as shown in the preceding example.
Alternatively, you might want to define a different {@link SwRegistrationOptions#registrationStrategy registration strategy} for the Service Worker.

</div>

### Updating to the latest version

You can update an existing tab to the latest version by reloading the page as soon as a new version is ready.
To avoid disrupting the user's progress, it is generally a good idea to prompt the user and let them confirm that it is OK to reload the page and update to the latest version:

<code-example header="prompt-update.service.ts" path="service-worker-getting-started/src/app/prompt-update.service.ts" region="sw-version-ready"></code-example>

<div class="alert is-important">

Calling {@link SwUpdate#activateUpdate SwUpdate#activateUpdate()} updates a tab to the latest version without reloading the page, but this could break the application.

Updating without reloading can create a version mismatch between the [application shell](guide/glossary#app-shell) and other page resources, such as [lazy-loaded chunks](guide/glossary#lazy-loading), whose filenames may change between versions.

You should only use `activateUpdate()`, if you are certain it is safe for your specific use case.

</div>

### Handling an unrecoverable state

In some cases, the version of the app used by the service worker to serve a client might be in a broken state that cannot be recovered from without a full page reload.

For example, imagine the following scenario:
- A user opens the app for the first time and the service worker caches the latest version of the app.
  Assume the application's cached assets include `index.html`, `main.<main-hash-1>.js` and `lazy-chunk.<lazy-hash-1>.js`.
- The user closes the app and does not open it for a while.
- After some time, a new version of the app is deployed to the server.
  This newer version includes the files `index.html`, `main.<main-hash-2>.js` and `lazy-chunk.<lazy-hash-2>.js` (note that the hashes are different now, because the content of the files changed).
  The old version is no longer available on the server.
- In the meantime, the user's browser decides to evict `lazy-chunk.<lazy-hash-1>.js` from its cache.
  Browsers might decide to evict specific (or all) resources from a cache in order to reclaim disk space.
- The user opens the app again.
  The service worker serves the latest version known to it at this point, namely the old version (`index.html` and `main.<main-hash-1>.js`).
- At some later point, the app requests the lazy bundle, `lazy-chunk.<lazy-hash-1>.js`.
- The service worker is unable to find the asset in the cache (remember that the browser evicted it).
  Nor is it able to retrieve it from the server (because the server now only has `lazy-chunk.<lazy-hash-2>.js` from the newer version).

In the preceding scenario, the service worker is not able to serve an asset that would normally be cached.
That particular app version is broken and there is no way to fix the state of the client without reloading the page.
In such cases, the service worker notifies the client by sending an `UnrecoverableStateEvent` event.
Subscribe to `SwUpdate#unrecoverable` to be notified and handle these errors.

<code-example path="service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" header="handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"></code-example>


## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [Service Workerの通知](guide/service-worker-devops).
