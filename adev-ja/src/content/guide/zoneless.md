# ZoneJSを使わないAngular (Zoneless)

## なぜZonelessを使うのか？

ZoneJSを依存関係として削除する主な利点は次のとおりです。

- **パフォーマンスの向上**: ZoneJSは、アプリケーションの状態が*更新された可能性がある*タイミングの指標としてDOMイベントと非同期タスクを使用し、その後、アプリケーションのビューで変更検知を実行するためにアプリケーションの同期をトリガーします。ZoneJSは、アプリケーションの状態が実際に変更されたかどうかを把握していないため、この同期は必要以上に頻繁にトリガーされます。
- **Core Web Vitalsの改善**: ZoneJSは、ペイロードサイズと起動時間の両方で、かなりのオーバーヘッドをもたらします。
- **デバッグ体験の向上**: ZoneJSは、コードのデバッグをより困難にします。スタックトレースはZoneJSでは理解しにくくなります。また、コードがAngular Zoneの外部にあるために壊れた場合も理解しにくいです。
- **より良いエコシステム互換性**: ZoneJSはブラウザAPIをパッチ適用することで動作しますが、すべての新しいブラウザAPIに対して自動的にパッチが適用されるわけではありません。一部のAPIは、`async`/`await`のように効果的にパッチを適用できず、ZoneJSで動作するようにダウンレベルする必要があります。場合によっては、エコシステム内のライブラリも、ZoneJSがネイティブAPIにパッチを適用する方法と互換性がないことがあります。ZoneJSを依存関係として削除すると、複雑さ、モンキーパッチ、および継続的なメンテナンスのソースが削除されるため、長期的な互換性が向上します。

## アプリケーションでZonelessを有効にする

The API for enabling Zoneless is currently in developer preview. The shape of the API and underlying behavior can change in patch versions.

```typescript
// スタンドアロン ブートストラップ
bootstrapApplication(MyApp, {providers: [
  provideZonelessChangeDetection(),
]});

// NgModule ブートストラップ
platformBrowser().bootstrapModule(AppModule);
@NgModule({
  providers: [provideZonelessChangeDetection()]
})
export class AppModule {}
```

## ZoneJSの削除

Zonelessアプリケーションは、バンドルサイズを削減するために、ビルドからZoneJSを完全に削除する必要があります。ZoneJSは通常、
`angular.json`の`polyfills`オプションを介して、`build`と`test`の両方のターゲットでロードされます。ビルドから削除するには、
両方から`zone.js`と`zone.js/testing`を削除します。明示的な`polyfills.ts`ファイルを
使用するプロジェクトは、ファイルから`import 'zone.js';`と`import 'zone.js/testing';`を削除する必要があります。

ビルドからZoneJSを削除すると、`zone.js`の依存関係も不要になり、
パッケージを完全に削除できます。

```shell
npm uninstall zone.js
```

## Zoneless互換性の要件

Angularは、変更検知をいつ、どのビューで実行するかを判断するために、コアAPIからの通知に依存しています。
これらの通知には次のものが含まれます。

- `ChangeDetectorRef.markForCheck` (`AsyncPipe`によって自動的に呼び出されます)
- `ComponentRef.setInput`
- テンプレートで読み取られるシグナルの更新
- バインドされたホストまたはテンプレートリスナーのコールバック
- 上記のいずれかによってダーティーとしてマークされたビューのアタッチ

### `OnPush`互換コンポーネント

コンポーネントが上記の正しい通知メカニズムを使用していることを確認する1つの方法は、
[ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush)を使用することです。

`OnPush`変更検知戦略は必須ではありませんが、アプリケーションコンポーネントのZoneless互換性への推奨されるステップです。ライブラリコンポーネントが`ChangeDetectionStrategy.OnPush`を使用することが常に可能であるとは限りません。
ライブラリコンポーネントが`ChangeDetectionStrategy.Default`を使用する可能性のあるユーザーコンポーネントのホストである場合、子コンポーネントが`OnPush`互換ではなく、ZoneJSに依存して変更検知をトリガーする場合、子コンポーネントが更新されなくなるため、`OnPush`を使用できません。コンポーネントは、変更検知を実行する必要があるときにAngularに通知する限り（`markForCheck`の呼び出し、シグナルの使用、`AsyncPipe`など）、`Default`戦略を使用できます。
Being a host for a user component means using an API such as `ViewContainerRef.createComponent` and not just hosting a portion of a template from a user component (i.e. content projection or a using a template ref input).

### `NgZone.onMicrotaskEmpty`、`NgZone.onUnstable`、`NgZone.isStable`、または`NgZone.onStable`の削除

アプリケーションとライブラリは、`NgZone.onMicrotaskEmpty`、`NgZone.onUnstable`、および`NgZone.onStable`の使用を削除する必要があります。
アプリケーションがZoneless変更検知を有効にすると、これらのObservableは発行されません。
同様に、`NgZone.isStable`は常に`true`になり、コード実行の条件として使用できません。

`NgZone.onMicrotaskEmpty`および`NgZone.onStable`のObservableは、多くの場合、タスクを実行する前にAngularが
変更検知を完了するのを待つために最もよく使用されます。代わりに、単一の変更検知を
待つ必要がある場合は`afterNextRender`、 またはいくつかの変更検知ラウンドにまたがる可能性のある
条件がある場合は`afterEveryRender`に置き換えることができます。 他のケースでは、これらのObservableは
たまたま馴染みがあり、必要なものと似たタイミングであったために使用されています。 
コードが特定のDOM状態を待つ必要がある場合（Angularのレンダリングフックを介して間接的に待つのではなく）、
`MutationObserver`など、より簡単または直接的なDOM APIを代わりに使用できます。

<docs-callout title="NgZone.run and NgZone.runOutsideAngular are compatible with Zoneless">
`NgZone.run`と`NgZone.runOutsideAngular`は、コードをZonelessアプリケーションと互換性を持たせるために
削除する必要はありません。実際、これらの呼び出しを削除すると、ZoneJSに依然として依存しているアプリケーションで使用されるライブラリの
パフォーマンスが低下する可能性があります。
</docs-callout>

### サーバーサイドレンダリング（SSR）の`PendingTasks`

If you are using SSR with Angular, you may know that it relies on ZoneJS to help determine when the application
is "stable" and can be serialized. If there are asynchronous tasks that should prevent serialization, an application
not using ZoneJS must make Angular aware of these with the [PendingTasks](/api/core/PendingTasks) service. Serialization
will wait for the first moment that all pending tasks have been removed.


The two most straightforward uses of pending tasks are the `run` method:

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

For more complicated use-cases, you can manuall add and remove a pending tasks:

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
try {
  await doSomeWorkThatNeedsToBeRendered();
} catch {
  // handle error
} finally {
  taskCleanup();
}
```

In addition, the [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent#) helper in `rxjs-interop` ensures
the application remains unstable until the observable emits, complets, errors, or is unsubscribed.

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

フレームワークは、非同期タスクが完了するまでシリアライズを防ぐために、このサービスを内部的にも使用します。これには、
進行中のルーターナビゲーションや未完了の`HttpClient`リクエストが含まれますが、これらに限定されません。

## テストとデバッグ

### `TestBed`でZonelessを使用する

Zonelessプロバイダー関数は、`TestBed`でも使用して、
テスト対象のコンポーネントがZoneless Angularアプリケーションと
互換性があることを確認できます。

```typescript
TestBed.configureTestingModule({
  providers: [provideZonelessChangeDetection()]
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

テストが本番コードと最も類似した動作をすることを確認するには、
可能な限り`fixture.detectChanges()`の使用を避けてください。これにより、
Angularが変更検知をスケジュールしていない場合に、
変更検知が強制的に実行されます。テストでは、これらの通知が発生していることを確認し、
手動で強制的に発生させるのではなく、
Angularが状態を同期するタイミングを処理できるようにする必要があります。

For existing test suites, using `fixture.detectChanges()` is a common pattern
and it is likely not worth the effort of converting these to
`await fixture.whenStable()`. `TestBed` will still enforce that the
fixture's component is `OnPush` compatible and throws `ExpressionChangedAfterItHasBeenCheckedError`
if it finds that template values were updated without a
change notification (i.e. `fixture.componentInstance.someValue = 'newValue';`).
If the component is used in production, this issue should be addressed by updating
the component to use signals for state or call `ChangeDetectorRef.markForCheck()`.
If the component is only used as a test wrapper and never used in an application,
it is acceptable to use `fixture.changeDetectorRef.markForCheck()`.

### 更新が検出されることを確認するためのデバッグモードチェック

Angular also provides an additional tool to help verify that an application is making
updates to state in a zoneless-compatible way. `provideCheckNoChangesConfig({exhaustive: true, interval: <milliseconds>})`
can be used to periodically check to ensure that no bindings have been updated
without a notification. Angular throws `ExpressionChangedAfterItHasBeenCheckedError`
if there is an updated binding that would not have refreshed by the zoneless change
detection.
