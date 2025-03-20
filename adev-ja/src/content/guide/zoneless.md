# ZoneJSを使わないAngular (Zoneless)

## なぜZonelessを使うのか？

ZoneJSを依存関係として削除する主な利点は次のとおりです。

- **パフォーマンスの向上**: ZoneJSは、アプリケーションの状態が*更新された可能性がある*タイミングの指標としてDOMイベントと非同期タスクを使用し、その後、アプリケーションのビューで変更検知を実行するためにアプリケーションの同期をトリガーします。ZoneJSは、アプリケーションの状態が実際に変更されたかどうかを把握していないため、この同期は必要以上に頻繁にトリガーされます。
- **Core Web Vitalsの改善**: ZoneJSは、ペイロードサイズと起動時間の両方で、かなりのオーバーヘッドをもたらします。
- **デバッグ体験の向上**: ZoneJSは、コードのデバッグをより困難にします。スタックトレースはZoneJSでは理解しにくくなります。また、コードがAngular Zoneの外部にあるために壊れた場合も理解しにくいです。
- **より良いエコシステム互換性**: ZoneJSはブラウザAPIをパッチ適用することで動作しますが、すべての新しいブラウザAPIに対して自動的にパッチが適用されるわけではありません。一部のAPIは、`async`/`await`のように効果的にパッチを適用できず、ZoneJSで動作するようにダウンレベルする必要があります。場合によっては、エコシステム内のライブラリも、ZoneJSがネイティブAPIにパッチを適用する方法と互換性がないことがあります。ZoneJSを依存関係として削除すると、複雑さ、モンキーパッチ、および継続的なメンテナンスのソースが削除されるため、長期的な互換性が向上します。

## アプリケーションでZonelessを有効にする

Zonelessを有効にするためのAPIは現在、実験的機能です。その仕様や根本的な挙動は安定しておらず、
パッチバージョンで変更される可能性があります。既知の機能面での不足があり、その一例としてサーバーサイドレンダリングでアプリケーションが早期にシリアライズされるのを防ぐための使いやすいAPIが存在しないことが挙げられます。

```typescript
// スタンドアロン ブートストラップ
bootstrapApplication(MyApp, {providers: [
  provideExperimentalZonelessChangeDetection(),
]});

// NgModule ブートストラップ
platformBrowser().bootstrapModule(AppModule);
@NgModule({
  providers: [provideExperimentalZonelessChangeDetection()]
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

### `NgZone.onMicrotaskEmpty`、`NgZone.onUnstable`、`NgZone.isStable`、または`NgZone.onStable`の削除

アプリケーションとライブラリは、`NgZone.onMicrotaskEmpty`、`NgZone.onUnstable`、および`NgZone.onStable`の使用を削除する必要があります。
アプリケーションがZoneless変更検知を有効にすると、これらのObservableは発行されません。
同様に、`NgZone.isStable`は常に`true`になり、コード実行の条件として使用できません。

`NgZone.onMicrotaskEmpty`および`NgZone.onStable`のObservableは、多くの場合、タスクを実行する前にAngularが
変更検知を完了するのを待つために最もよく使用されます。代わりに、単一の変更検知を
待つ必要がある場合は`afterNextRender`、 またはいくつかの変更検知ラウンドにまたがる可能性のある
条件がある場合は`afterRender`に置き換えることができます。 他のケースでは、これらのObservableは
たまたま馴染みがあり、必要なものと似たタイミングであったために使用されています。 
コードが特定のDOM状態を待つ必要がある場合（Angularのレンダリングフックを介して間接的に待つのではなく）、
`MutationObserver`など、より簡単または直接的なDOM APIを代わりに使用できます。

<docs-callout title="NgZone.run and NgZone.runOutsideAngular are compatible with Zoneless">
`NgZone.run`と`NgZone.runOutsideAngular`は、コードをZonelessアプリケーションと互換性を持たせるために
削除する必要はありません。実際、これらの呼び出しを削除すると、ZoneJSに依然として依存しているアプリケーションで使用されるライブラリの
パフォーマンスが低下する可能性があります。
</docs-callout>

### サーバーサイドレンダリング（SSR）の`PendingTasks`

AngularでSSRを使用している場合、アプリケーションが「安定」しており、シリアライズできるかどうかを判断するために、
ZoneJSに依存していることをご存知かもしれません。シリアライズを妨げる非同期タスクがある場合、
ZoneJSを使用していないアプリケーションは、`PendingTasks`サービスを使用してAngularにこれらを認識させる必要があります。シリアライズは、
保留中のすべてのタスクが削除された最初の瞬間まで待機します。

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
await doSomeWorkThatNeedsToBeRendered();
taskCleanup();
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
  providers: [provideExperimentalZonelessChangeDetection()]
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

テストが本番コードと最も類似した動作をすることを確認するには、
可能な限り`fixture.detectChanges()`の使用を避けてください。これにより、
Angularが変更検知をスケジュールしていない場合に、
変更検知が強制的に実行されます。テストでは、これらの通知が発生していることを確認し、
テストで手動で強制的に発生させるのではなく、
Angularが状態を同期するタイミングを処理できるようにする必要があります。

### 更新が検出されることを確認するためのデバッグモードチェック

Angularは、アプリケーションがZoneless互換の方法で状態を更新していることを
確認するのに役立つ追加のツールも提供しています。`provideExperimentalCheckNoChangesForDebug`を使用すると、
通知なしにバインディングが更新されていないことを定期的に確認できます。
Zoneless変更検知によってリフレッシュされない更新済みバインディングがある場合、
Angularは`ExpressionChangedAfterItHasBeenCheckedError`を
スローします。
