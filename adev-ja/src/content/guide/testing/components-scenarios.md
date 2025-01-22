# コンポーネントテストシナリオ

このガイドでは、一般的なコンポーネントテストのユースケースについて説明します。

## コンポーネントバインディング

サンプルアプリケーションでは、`BannerComponent`はHTMLテンプレートに静的なタイトルテキストを表示します。

いくつかの変更を加えた後、`BannerComponent`は、次のようにコンポーネントの`title`プロパティにバインドすることで動的なタイトルを表示します。

<docs-code header="app/banner/banner.component.ts" path="adev/src/content/examples/testing/src/app/banner/banner.component.ts" visibleRegion="component"/>

これは最小限のものですが、コンポーネントが実際に期待どおりに正しいコンテンツを表示していることを確認するためのテストを追加することにします。

### `<h1>`のクエリ

*タイトル*プロパティの補間バインディングを囲む`<h1>`要素の値を検査する一連のテストを作成します。

`beforeEach`を更新して、標準のHTML`querySelector`でその要素を見つけ、`h1`変数に割り当てます。

<docs-code header="app/banner/banner.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="setup"/>

### `createComponent()`はデータをバインドしません

最初のテストでは、画面にデフォルトの`title`が表示されることを確認したいと考えています。
直感的には、次のように`<h1>`をすぐに検査するテストを作成するでしょう。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default-v1"/>

*このテストは失敗します*、メッセージは次のとおりです。

<docs-code language="javascript">

expected '' to contain 'Test Tour of Heroes'.

</docs-code>

バインディングは、Angularが**変更検知**を実行したときに発生します。

本番環境では、Angularがコンポーネントを作成したり、ユーザーがキーストロークを入力したりしたときに、変更検知は自動的に開始されます。

`TestBed.createComponent`はデフォルトで変更検知をトリガーしません。これは、修正されたテストで確認できます。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="test-w-o-detect-changes"/>

### `detectChanges()`

`TestBed`に`fixture.detectChanges()`を呼び出してデータバインディングを実行するように指示することができます。
そうすれば初めて、`<h1>`に期待どおりのタイトルが表示されます。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default"/>

変更検知が遅延されるのは意図的なことであり、便利です。
これにより、テスターはAngularがデータバインディングを開始し、[ライフサイクルフック](guide/components/lifecycle)を呼び出す*前に*、コンポーネントの状態を検査および変更することができます。

次に、`fixture.detectChanges()`を呼び出す*前に*、コンポーネントの`title`プロパティを変更するテストを示します。

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="after-change"/>

### 自動変更検知

`BannerComponent`のテストでは、頻繁に`detectChanges`を呼び出しています。
多くのテスターは、Angularのテスト環境が本番環境のように自動的に変更検知を実行することを好みます。

これは、`TestBed`を`ComponentFixtureAutoDetect`プロバイダーで設定することで可能です。
まず、テストユーティリティライブラリからインポートします。

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (import)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="import-ComponentFixtureAutoDetect"/>

次に、テストモジュール設定の`providers`配列に追加します。

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect"/>

HELPFUL: `fixture.autoDetectChanges()`関数を代わりに使用することもできます。
これは、フィクスチャのコンポーネントの状態を更新した後、自動変更検知を有効にする場合のみです。
また、自動変更検知は`provideExperimentalZonelessChangeDetection`を使用する場合、デフォルトで有効になっており、オフにすることは推奨されません。

次に、自動変更検知がどのように機能するかを示す3つのテストを示します。

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect-tests"/>

最初のテストは、自動変更検知の利点を示しています。

2番目と3番目のテストは、重要な制限を明らかにしています。
Angularのテスト環境は、コンポーネントの`title`を変更したテストケース内で更新が行われた場合、変更検知を同期的に実行しません。
テストは、別の変更検知を待つために`await fixture.whenStable`を呼び出す必要があります。

HELPFUL: Angularは、信号ではない値への直接的な更新については知りません。
変更検知がスケジュールされるようにするための最も簡単な方法は、テンプレートで読み取られる値に信号を使用することです。

### `dispatchEvent()`を使用して入力値を変更する

ユーザー入力をシミュレートするには、入力要素を見つけ、その`value`プロパティを設定します。

しかし、重要な中間ステップがあります。

Angularは、入力要素の`value`プロパティを設定したことを知りません。
`dispatchEvent()`を呼び出して要素の`input`イベントを発生させるまで、そのプロパティを読み込みません。

次の例は、正しいシーケンスを示しています。

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>

## 外部ファイルを持つコンポーネント

前の`BannerComponent`は、それぞれ`@Component.template`と`@Component.styles`プロパティで指定された*インラインテンプレート*と*インラインcss*で定義されています。

多くのコンポーネントは、それぞれ`@Component.templateUrl`と`@Component.styleUrls`プロパティで、*外部テンプレート*と*外部css*を指定します。`BannerComponent`の次のバリアントは、そのようにします。

<docs-code header="app/banner/banner-external.component.ts (metadata)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts" visibleRegion="metadata"/>

この構文は、Angularコンパイラーに、コンポーネントのコンパイル中に外部ファイルを読み取るように指示します。

これは、CLI`ng test`コマンドを実行するときに問題になりません。なぜなら、CLIは*テストを実行する前にアプリケーションをコンパイルする*からです。

しかし、**CLI以外の環境**でテストを実行する場合、このコンポーネントのテストは失敗する可能性があります。
たとえば、[plunker](https://plnkr.co)などのWebコーディング環境で`BannerComponent`のテストを実行すると、次のようなメッセージが表示されます。

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

このテストエラーメッセージは、ランタイム環境が*テスト自体の実行中に*ソースコードをコンパイルするときに発生します。

この問題を解決するには、次の[compileComponentsの呼び出し](#calling-compilecomponents)セクションで説明されているように、`compileComponents()`を呼び出します。

## 依存関係を持つコンポーネント

コンポーネントは、多くの場合、サービス依存関係を持ちます。

`WelcomeComponent`は、ログインしたユーザーに歓迎メッセージを表示します。
これは、注入された`UserService`のプロパティに基づいて、ユーザーが誰かを知っています。

<docs-code header="app/welcome/welcome.component.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.ts"/>

`WelcomeComponent`には、サービスと対話する意思決定ロジックがあり、このコンポーネントのテスト価値を高めています。

### サービステストダブルを提供する

*テスト対象のコンポーネント*は、実際のサービスを提供する必要はありません。

実際の`UserService`を注入するのは難しい場合があります。
実際のサービスは、ユーザーにログイン資格情報の入力を求めて、認証サーバーにアクセスしようとするかもしれません。
これらの動作は、インターセプトするのが難しい場合があります。テストダブルを使用すると、テストが本番環境とは異なる動作をするため、控えめに使用してください。

### 注入されたサービスを取得する

テストでは、`WelcomeComponent`に注入された`UserService`にアクセスする必要があります。

Angularには、階層的な注入システムがあります。
`TestBed`によって作成されたルートインジェクターから、コンポーネントツリーを下って、複数のレベルにインジェクターが存在する可能性があります。

注入されたサービスを取得する最も安全な方法は、*常に動作する*方法であり、
*テスト対象のコンポーネント*のインジェクターから取得することです。
コンポーネントインジェクターは、フィクスチャの`DebugElement`のプロパティです。

<docs-code header="WelcomeComponent's injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="injected-service"/>

HELPFUL: これは_通常_は必要ありません。サービスは、多くの場合、ルートまたは`TestBed`のオーバーライドで提供され、`TestBed.inject()`を使用してより簡単に取得できます（下記参照）。

### `TestBed.inject()`

これは、フィクスチャの`DebugElement`を使用してサービスを取得するよりも覚えやすく、冗長性が少なくなります。

このテストスイートでは、`UserService`のプロバイダーはルートテストモジュールのみであるため、次のように`TestBed.inject()`を呼び出すのは安全です。

<docs-code header="TestBed injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="inject-from-testbed" />

HELPFUL: `TestBed.inject()`が機能しないユースケースについては、[*コンポーネントプロバイダーのオーバーライド*](#override-component-providers)セクションを参照してください。このセクションでは、いつ、なぜフィクスチャのインジェクターの代わりにコンポーネントのインジェクターからサービスを取得する必要があるのかを説明しています。

### 最終的な設定とテスト

次に、`TestBed.inject()`を使用した完全な`beforeEach()`を示します。

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="setup"/>

次に、いくつかのテストを示します。

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="tests"/>

最初のテストは、健全性テストです。これは、`UserService`が呼び出され、機能していることを確認します。

HELPFUL: withContext関数（たとえば、`'expected name'`）は、オプションの失敗ラベルです。
期待値が失敗した場合、Jasmineは期待値の失敗メッセージにこのラベルを追加します。
複数の期待値を持つスペックでは、何が間違っていたのか、どの期待値が失敗したのかを明確にするのに役立ちます。

残りのテストは、サービスが異なる値を返した場合に、コンポーネントのロジックが正しいことを確認します。
2番目のテストは、ユーザー名の変更の効果を検証します。
3番目のテストは、ログインしたユーザーがいない場合に、コンポーネントが適切なメッセージを表示することを確認します。

## 非同期サービスを持つコンポーネント

このサンプルでは、`AboutComponent`テンプレートは`TwainComponent`をホストしています。
`TwainComponent`は、マーク・トウェインの引用を表示します。

<docs-code header="app/twain/twain.component.ts (template)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="template" />

HELPFUL: コンポーネントの`quote`プロパティの値は、`AsyncPipe`を通過します。
つまり、プロパティは`Promise`または`Observable`のいずれかを返します。

この例では、`TwainComponent.getQuote()`メソッドは、`quote`プロパティが`Observable`を返すと伝えています。

<docs-code header="app/twain/twain.component.ts (getQuote)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="get-quote"/>

`TwainComponent`は、注入された`TwainService`から引用を取得します。
コンポーネントは、サービスが最初の引用を返す前に、プレースホルダー値（`'...'`）で返された`Observable`を開始します。

`catchError`はサービスエラーをインターセプトし、エラーメッセージを準備し、成功チャネルでプレースホルダー値を返します。

これらはすべて、テストしたい機能です。

### スパイによるテスト

コンポーネントをテストする場合は、サービスのパブリックAPIのみが問題になります。
一般的に、テスト自体がリモートサーバーへの呼び出しを行わないようにする必要があります。
そのような呼び出しをエミュレートする必要があります。
この`app/twain/twain.component.spec.ts`のセットアップは、その方法の1つを示しています。

<docs-code header="app/twain/twain.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="setup"/>

スパイに注目してください。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="spy"/>

スパイは、`getQuote`への呼び出しが、テスト引用を含むObservableを受け取るように設計されています。
実際の`getQuote()`メソッドとは異なり、このスパイはサーバーをバイパスし、値がすぐに利用可能な同期Observableを返します。

このスパイを使用すると、`Observable`が同期的なものであっても、多くの役立つテストを作成できます。

HELPFUL: スパイの使用は、テストに必要なものに限定するのが最善です。必要なもの以上のモックやスパイを作成すると、壊れやすくなる可能性があります。コンポーネントとインジェクタブルが進化するにつれて、関連のないテストは、それ以外ではテストに影響を与えないのに十分な動作をモックしなくなったために失敗する可能性があります。


### `fakeAsync()`による非同期テスト

`fakeAsync()`機能を使用するには、テストセットアップファイルに`zone.js/testing`をインポートする必要があります。
Angular CLIでプロジェクトを作成した場合、`zone-testing`はすでに`src/test.ts`にインポートされています。

次のテストは、サービスが`ErrorObservable`を返した場合に期待される動作を確認します。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="error-test"/>

HELPFUL: `it()`関数は、次の形式の引数を受け取ります。

<docs-code language="javascript">

fakeAsync(() => { /*test body*/ })

</docs-code>

`fakeAsync()`関数は、特別な`fakeAsync test zone`でテスト本体を実行することで、線形のコーディングスタイルを可能にします。
テスト本体は同期的に見えるようになります。
制御フローを妨げるネストされた構文（`Promise.then()`など）はありません。

HELPFUL: 制限事項: `fakeAsync()`関数は、テスト本体が`XMLHttpRequest`（XHR）呼び出しをすると機能しません。
テスト内のXHR呼び出しはまれですが、XHRを呼び出す必要がある場合は、[`waitForAsync()`](#waitForAsync)セクションを参照してください。

IMPORTANT: `fakeAsync`ゾーン内で発生する非同期タスクは、`flush`または`tick`を使用して手動で実行する必要があることに注意してください。
`fakeAsync`テストヘルパーを使用して時間を進めずに、完了するまで待つと（つまり、`fixture.whenStable`を使用）、テストは失敗する可能性が高いです。
詳細については、以下を参照してください。

### `tick()`関数

[tick()](api/core/testing/tick)を呼び出して、仮想クロックを進める必要があります。

[tick()](api/core/testing/tick)を呼び出すと、保留中の非同期アクティビティがすべて完了するまで、仮想クロックが前進します。
この場合、Observableの`setTimeout()`を待ちます。

[tick()](api/core/testing/tick)関数は、`millis`と`tickOptions`をパラメーターとして受け取ります。`millis`パラメーターは、仮想クロックがどれだけ進むかを指定し、指定されていない場合はデフォルトで`0`になります。
たとえば、`fakeAsync()`テストに`setTimeout(fn, 100)`がある場合、`fn`のコールバックをトリガーするには、`tick(100)`を使用する必要があります。
オプションの`tickOptions`パラメーターには、`processNewMacroTasksSynchronously`という名前のプロパティがあります。`processNewMacroTasksSynchronously`プロパティは、ティック時に新しい生成されたマクロタスクを呼び出すかどうかを表し、デフォルトでは`true`です。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick"/>

[tick()](api/core/testing/tick)関数は、`TestBed`でインポートするAngularのテストユーティリティの1つです。
これは`fakeAsync()`の仲間であり、`fakeAsync()`本体内でのみ呼び出すことができます。

### tickOptions

この例では、ネストされた`setTimeout`関数が新しいマクロタスクです。デフォルトでは、`tick`がsetTimeoutの場合、`outside`と`nested`の両方がトリガーされます。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-sync"/>

場合によっては、ティック時に新しいマクロタスクをトリガーしたくない場合があります。`tick(millis, {processNewMacroTasksSynchronously: false})`を使用して、新しいマクロタスクを呼び出さないようにすることができます。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-async"/>

### `fakeAsync()`内の日付の比較

`fakeAsync()`は時間の経過をシミュレートするため、`fakeAsync()`内で日付の差を計算することができます。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-date"/>

### `jasmine.clock`と`fakeAsync()`

Jasmineは、日付をモックするための`clock`機能も提供しています。
Angularは、`jasmine.clock().install()`が`fakeAsync()`メソッド内で呼び出された後、`jasmine.clock().uninstall()`が呼び出されるまで実行されるテストを自動的に実行します。
`fakeAsync()`は必要なく、ネストされている場合はエラーをスローします。

デフォルトでは、この機能はオフになっています。
有効にするには、`zone-testing`をインポートする前にグローバルフラグを設定します。

Angular CLIを使用している場合は、`src/test.ts`でこのフラグを設定します。

<docs-code language="typescript">

[window as any]('&lowbar;&lowbar;zone&lowbar;symbol__fakeAsyncPatchLock') = true;
import 'zone.js/testing';

</docs-code>

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-clock"/>

### `fakeAsync()`内のRxJSスケジューラーの使用

`setTimeout()`や`setInterval()`と同様に、`fakeAsync()`でRxJSスケジューラーを使用することもできますが、RxJSスケジューラーをパッチするために`zone.js/plugins/zone-patch-rxjs-fake-async`をインポートする必要があります。

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-rxjs"/>

### より多くのmacroTasksをサポートする

デフォルトでは、`fakeAsync()`は次のmacroTasksをサポートしています。

* `setTimeout`
* `setInterval`
* `requestAnimationFrame`
* `webkitRequestAnimationFrame`
* `mozRequestAnimationFrame`

`HTMLCanvasElement.toBlob()`などの他のmacroTasksを実行すると、「fake async testで不明なmacroTaskがスケジュールされました」というエラーがスローされます。

<docs-code-multifile>
    <docs-code header="src/app/shared/canvas.component.spec.ts (failing)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="without-toBlob-macrotask"/>
    <docs-code header="src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="main"/>
</docs-code-multifile>

このような場合をサポートしたい場合は、サポートするmacroTasksを`beforeEach()`で定義する必要があります。
たとえば、次のようになります。

<docs-code header="src/app/shared/canvas.component.spec.ts (excerpt)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="enable-toBlob-macrotask"/>

HELPFUL: アプリで`<canvas>`要素をZone.js対応にするには、`zone-patch-canvas`パッチをインポートする必要があります（`polyfills.ts`または`<canvas>`を使用する特定のファイルにインポートします）。

<docs-code header="src/polyfills.ts or src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="import-canvas-patch"/>

### 非同期Observable

これらのテストのテストカバレッジに満足しているかもしれません。

しかし、実際のサービスが完全にこのようには動作していないという事実で悩んでいるかもしれません。
実際のサービスは、リモートサーバーにリクエストを送信します。
サーバーは応答するまでに時間がかかり、応答は前の2つのテストのようにすぐに利用できるわけではありません。

テストでは、次のように`getQuote()`スパイから*非同期*Observableを返すと、現実の世界をより忠実に反映することができます。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-setup"/>

### 非同期Observableのヘルパー

非同期Observableは、`asyncData`ヘルパーによって生成されました。
`asyncData`ヘルパーは、自分で記述するか、サンプルコードからこのヘルパーをコピーする必要があるユーティリティ関数です。

<docs-code header="testing/async-observable-helpers.ts" path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-data"/>

このヘルパーのObservableは、JavaScriptエンジンの次のターンで`data`値を発行します。

[RxJS `defer()`演算子](http://reactivex.io/documentation/operators/defer.html)は、Observableを返します。
これは、`Promise`または`Observable`のいずれかを返すファクトリ関数を取得します。
何かが*defer*のObservableを購読すると、そのファクトリで作成された新しいObservableに購読者を追加します。

`defer()`演算子は、`Promise.resolve()`を、`HttpClient`のように一度発行して完了する新しいObservableに変換します。
購読者は、`data`値を受け取ると購読解除されます。

非同期エラーを生成するための同様のヘルパーがあります。

<docs-code path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-error"/>

### さらなる非同期テスト

`getQuote()`スパイが非同期Observableを返すようになったので、ほとんどのテストも非同期にする必要があります。

次に、現実の世界で期待されるデータフローを示す`fakeAsync()`テストを示します。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="fake-async-test"/>

引用要素には、`ngOnInit()`の後、プレースホルダー値（`'...'`）が表示されます。
まだ最初の引用は届いていません。

Observableから最初の引用をフラッシュするには、[tick()](api/core/testing/tick)を呼び出します。
次に、`detectChanges()`を呼び出して、Angularに画面を更新するように指示します。

その後、引用要素に期待どおりのテキストが表示されていることをアサートできます。

### `fakeAsync()`を使わない非同期テスト

次に、前の`fakeAsync()`テストを`async`で書き直したものを示します。

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-test"/>

### `whenStable`

テストは、`getQuote()`Observableが次の引用を発行するまで待つ必要があります。
[tick()](api/core/testing/tick)を呼び出す代わりに、`fixture.whenStable()`を呼び出します。

`fixture.whenStable()`は、JavaScriptエンジンのタスクキューが空になったときに解決されるプロミスを返します。
この例では、タスクキューはObservableが最初の引用を発行したときに空になります。


## 入力と出力を持つコンポーネント

入力と出力を持つコンポーネントは、通常、ホストコンポーネントのビューテンプレート内に表示されます。
ホストは、プロパティバインディングを使用して入力プロパティを設定し、イベントバインディングを使用して出力プロパティによって発生したイベントをリスンします。

テストの目標は、そのようなバインディングが期待どおりに機能することを確認することです。
テストでは、入力値を設定し、出力イベントをリスンする必要があります。

`DashboardHeroComponent`は、この役割を果たすコンポーネントの小さな例です。
これは、`DashboardComponent`によって提供された個々のヒーローを表示します。
そのヒーローをクリックすると、`DashboardComponent`にユーザーがヒーローを選択したことを伝えます。

`DashboardHeroComponent`は、次のように`DashboardComponent`テンプレートに埋め込まれています。

<docs-code header="app/dashboard/dashboard.component.html (excerpt)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.html" visibleRegion="dashboard-hero"/>

`DashboardHeroComponent`は`*ngFor`リピーター内に表示され、各コンポーネントの`hero`入力プロパティはループする値に設定され、コンポーネントの`selected`イベントをリスンします。

コンポーネントの完全な定義を次に示します。

<docs-code header="app/dashboard/dashboard-hero.component.ts (component)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.ts" visibleRegion="component"/>

この単純なコンポーネントをテストすることは、ほとんど内在的な価値はありませんが、テスト方法を知る価値はあります。
次のいずれかの方法を使用します。

* `DashboardComponent`で使用されているようにテストする
* スタンドアロンコンポーネントとしてテストする
* `DashboardComponent`の代替として使用されているようにテストする

当面の目標は、`DashboardComponent`ではなく`DashboardHeroComponent`をテストすることなので、2番目と3番目のオプションを試してみましょう。

### `DashboardHeroComponent`をスタンドアロンでテストする

スペックファイルの設定の重要な部分を次に示します。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="setup"/>

設定コードは、コンポーネントの`hero`プロパティにテストヒーロー（`expectedHero`）を割り当てています。これは、`DashboardComponent`がリピーターのプロパティバインディングを使用して設定する方法をエミュレートしています。

次のテストは、ヒーロー名がバインディングを使用してテンプレートに伝播されることを検証します。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="name-test"/>

[テンプレート](#dashboard-hero-component)は、ヒーロー名をAngularの`UpperCasePipe`を通して渡すため、テストでは要素値を大文字の名前と照合する必要があります。

### クリック

ヒーローをクリックすると、ホストコンポーネント（`DashboardComponent`と推測される）が聞き取ることができる`selected`イベントが発生するはずです。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test"/>

コンポーネントの`selected`プロパティは、`EventEmitter`を返します。これは、消費者にとってはRxJSの同期`Observable`のように見えます。
テストは、ホストコンポーネントが*暗黙的に*行うように、*明示的に*これを購読します。

コンポーネントが期待どおりに動作すれば、ヒーローの要素をクリックすると、コンポーネントの`selected`プロパティに`hero`オブジェクトを発行するように指示されます。

テストは、`selected`への購読を通じてそのイベントを検出します。

### `triggerEventHandler`

前のテストの`heroDe`は、ヒーロー`<div>`を表す`DebugElement`です。

これは、ネイティブ要素との対話を抽象化するAngularのプロパティとメソッドを持っています。
このテストは、"click"イベント名で`DebugElement.triggerEventHandler`を呼び出します。
"click"イベントバインディングは、`DashboardHeroComponent.click()`を呼び出すことで応答します。

Angularの`DebugElement.triggerEventHandler`は、*イベント名*を使用して、*データバインドされたイベント*を発生させることができます。
2番目のパラメーターは、ハンドラーに渡されるイベントオブジェクトです。

テストでは、"click"イベントをトリガーしました。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="trigger-event-handler"/>

この場合、テストでは、ランタイムイベントハンドラーであるコンポーネントの`click()`メソッドがイベントオブジェクトを気にしないことを正しく想定しています。

HELPFUL: 他のハンドラーは、それほど寛容ではありません。
たとえば、`RouterLink`ディレクティブは、クリック時にどのマウスボタンが押されたかを識別する`button`プロパティを持つオブジェクトを期待しています。
`RouterLink`ディレクティブは、イベントオブジェクトが不足している場合、エラーをスローします。

### 要素をクリックする

次のテストの代替案は、ネイティブ要素自身の`click()`メソッドを呼び出します。これは、*このコンポーネント*には完全に適しています。

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-2"/>

### `click()`ヘルパー

ボタン、アンカー、または任意のHTML要素をクリックすることは、一般的なテストタスクです。

次の`click()`関数のようなヘルパーに*クリックをトリガーする*プロセスをカプセル化することで、それを一貫性があり、簡単に行うことができます。

<docs-code header="testing/index.ts (click helper)" path="adev/src/content/examples/testing/src/testing/index.ts" visibleRegion="click-event"/>

最初の引数は、*クリックする要素*です。
必要に応じて、2番目の引数としてカスタムイベントオブジェクトを渡すことができます。
デフォルトは、`RouterLink`ディレクティブを含む多くのハンドラーで受け入れられる、部分的な[左ボタンのマウスイベントオブジェクト](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)です。

IMPORTANT: `click()`ヘルパー関数は、Angularのテストユーティリティの**1つではありません**。
これは、*このガイドのサンプルコード*で定義された関数です。
サンプルテストはすべてこれを利用しています。
気に入ったら、自分のヘルパーのコレクションに追加してください。

次に、クリックヘルパーを使用した前のテストを示します。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-3"/>

## テストホスト内のコンポーネント

前のテストは、ホスト`DashboardComponent`の役割を自身で演じていました。
しかし、`DashboardHeroComponent`は、ホストコンポーネントに適切にデータバインドされている場合、正しく動作するでしょうか？

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host"/>

テストホストは、コンポーネントの`hero`入力プロパティをテストヒーローで設定します。
これは、コンポーネントの`selected`イベントを`onSelected`ハンドラーにバインドし、これは`selectedHero`プロパティに発行されたヒーローを記録します。

後で、テストは`selectedHero`をチェックして、`DashboardHeroComponent.selected`イベントが期待どおりのヒーローを発行したことを確認できます。

`test-host`テストの設定は、スタンドアロンテストの設定に似ています。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-setup"/>

このテストモジュール設定は、3つの重要な違いを示しています。

* `DashboardHeroComponent`と`TestHostComponent`の両方を*インポート*します
* `DashboardHeroComponent`ではなく`TestHostComponent`を*作成*します
* `TestHostComponent`は、バインディングで`DashboardHeroComponent.hero`を設定します

`createComponent`は、`DashboardHeroComponent`のインスタンスではなく、`TestHostComponent`のインスタンスを保持する`fixture`を返します。

`TestHostComponent`を作成すると、後者が前者のテンプレート内に表示されているため、`DashboardHeroComponent`が作成されます。
ヒーロー要素（`heroEl`）のクエリは、テストDOM内で見つかりますが、前のテストよりも要素ツリーの深さが大きくなります。

テスト自体は、スタンドアロンバージョンとほとんど同じです。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test-host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-tests"/>

選択されたイベントテストのみが異なります。
これは、選択された`DashboardHeroComponent`のヒーローが、実際にイベントバインディングを通じてホストコンポーネントに到達することを確認します。

## ルーティングコンポーネント

*ルーティングコンポーネント*は、`Router`に別のコンポーネントにナビゲートするように指示するコンポーネントです。
`DashboardComponent`は、ユーザーがダッシュボードの*ヒーローボタン*の1つをクリックすることで`HeroDetailComponent`にナビゲートできるため、*ルーティングコンポーネント*です。

Angularは、`HttpClient`に依存するコードをより効果的にテストするために、テストヘルパーを提供しています。`provideRouter`関数はテストモジュール内でも直接使えます。

<docs-code header="app/dashboard/dashboard.component.spec.ts" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="router-harness"/>

次のテストは、表示されているヒーローをクリックし、期待されるURLにナビゲートしたことを確認します。

<docs-code header="app/dashboard/dashboard.component.spec.ts (navigate test)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="navigate-test"/>

## ルーティングされたコンポーネント

*ルーティングされたコンポーネント*は、`Router`ナビゲーションの宛先です。
特に、コンポーネントへのルートに*パラメーターが含まれている場合*、テストが難しくなる場合があります。
`HeroDetailComponent`は、このようなルートの宛先である*ルーティングされたコンポーネント*です。

ユーザーが*Dashboard*のヒーローをクリックすると、`DashboardComponent`は`Router`に`heroes/:id`にナビゲートするように指示します。
`:id`は、編集するヒーローの`id`であるルートパラメーターです。

`Router`は、そのURLを`HeroDetailComponent`へのルートと照合します。
これは、ルーティング情報を持つ`ActivatedRoute`オブジェクトを作成し、`HeroDetailComponent`の新しいインスタンスに注入します。

`HeroDetailComponent`のコンストラクターを次に示します。

<docs-code header="app/hero/hero-detail.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ctor"/>

`HeroDetail`コンポーネントは、`id`パラメーターが必要であり、これにより`HeroDetailService`を使用して対応するヒーローを取得できます。
コンポーネントは、`Observable`である`ActivatedRoute.paramMap`プロパティから`id`を取得する必要があります。

コンポーネントは、`ActivatedRoute.paramMap`の`id`プロパティを参照することはできません。
コンポーネントは、`ActivatedRoute.paramMap`Observableを*購読*し、ライフタイム中に`id`が変更される場合に備えておく必要があります。

<docs-code header="app/hero/hero-detail.component.ts (ngOnInit)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ng-on-init"/>

テストでは、異なるルートにナビゲートすることで、`HeroDetailComponent`が異なる`id`パラメーター値にどのように応答するかを調べることができます。

### `RouterTestingHarness`によるテスト

次に、観察された`id`が既存のヒーローを参照している場合に、コンポーネントの動作を示すテストを示します。

<docs-code header="app/hero/hero-detail.component.spec.ts (existing id)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="route-good-id"/>

HELPFUL: 後のセクションでは、`createComponent()`メソッドと`page`オブジェクトについて説明します。
今のところ、直感的に理解してください。

`id`が見つからない場合、コンポーネントは`HeroListComponent`にリダイレクトする必要があります。

テストスイートの設定では、同じルーターハーネスが提供されました[上記を参照](#routing-component)。

このテストは、コンポーネントが`HeroListComponent`へのナビゲーションを試みると予想しています。

<docs-code header="app/hero/hero-detail.component.spec.ts (bad id)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="route-bad-id"/>

## ネストされたコンポーネントテスト

コンポーネントテンプレートには、多くの場合、ネストされたコンポーネントが含まれています。そのテンプレートには、さらに多くのコンポーネントが含まれている場合があります。

コンポーネントツリーは非常に深くなる可能性があり、ネストされたコンポーネントはツリーの先頭に配置されたコンポーネントをテストする際に役割を果たさないことがあります。

たとえば、`AppComponent`は、アンカーと`RouterLink`ディレクティブを持つナビゲーションバーを表示します。

<docs-code header="app/app.component.html" path="adev/src/content/examples/testing/src/app/app.component.html"/>

ナビゲーションではなくリンクを検証するために、`Router`が*ルーティングされたコンポーネント*を挿入する場所を示す`<router-outlet>`も必要ありません。

`BannerComponent`と`WelcomeComponent`（`<app-banner>`と`<app-welcome>`で示されています）も関係ありません。

しかし、DOMに`AppComponent`を作成するテストは、これらの3つのコンポーネントのインスタンスも作成し、それを許可した場合、`TestBed`を設定してそれらを作成する必要があります。

それらを宣言することを怠ると、Angularコンパイラーは`AppComponent`テンプレートの`<app-banner>`、`<app-welcome>`、および`<router-outlet>`タグを認識せず、エラーをスローします。

実際のコンポーネントを宣言すると、*それら*のネストされたコンポーネントも宣言し、ツリー内の*任意の*コンポーネントに注入された*すべての*サービスを提供する必要があります。

このセクションでは、セットアップを最小限にするための2つのテクニックについて説明します。
これらを単独で、または組み合わせて使用して、主要なコンポーネントのテストに集中してください。

### 不要なコンポーネントのスタブ化

最初のテクニックでは、テストでほとんど役割を果たさないコンポーネントとディレクティブのスタブバージョンを作成して宣言します。

<docs-code header="app/app.component.spec.ts (stub declaration)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="component-stubs"/>

スタブセレクターは、対応する実際のコンポーネントのセレクターと一致します。
しかし、それらのテンプレートとクラスは空です。

次に、`TestBed`設定内で、実際にする必要があるコンポーネント、ディレクティブ、パイプの横に宣言します。

<docs-code header="app/app.component.spec.ts (TestBed stubs)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="testbed-stubs"/>

`AppComponent`はテスト対象なので、当然、実際のバージョンを宣言します。

残りはスタブです。

### `NO_ERRORS_SCHEMA`

2番目の方法では、`TestBed.schemas`メタデータに`NO_ERRORS_SCHEMA`を追加します。

<docs-code header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="no-errors-schema"/>

`NO_ERRORS_SCHEMA`は、Angularコンパイラーに、認識されていない要素と属性を無視するように指示します。

コンパイラーは、`TestBed`設定で対応する`AppComponent`と`RouterLink`を宣言したため、`<app-root>`要素と`routerLink`属性を認識します。

しかし、コンパイラーは`<app-banner>`、`<app-welcome>`、または`<router-outlet>`に遭遇してもエラーをスローしません。
単にそれらを空のタグとしてレンダリングし、ブラウザはそれらを無視します。

スタブコンポーネントは不要になりました。

### 2つのテクニックを組み合わせて使用する

これらは、*シャローコンポーネントテスト*のためのテクニックであり、コンポーネントの視覚的な表面を、テストにとって重要なコンポーネントのテンプレート内の要素だけに制限するため、そう呼ばれています。

`NO_ERRORS_SCHEMA`アプローチは2つのうちより簡単ですが、使い過ぎないでください。

`NO_ERRORS_SCHEMA`は、コンパイラーが意図的に省略した、または誤ってスペルミスをした、見逃したコンポーネントと属性について警告するのを防ぎます。
コンパイラーが瞬時に検出できたはずの幽霊バグを追いかけて何時間も無駄にする可能性があります。

*スタブコンポーネント*アプローチには、もう1つの利点があります。
*この*例ではスタブは空でしたが、テストでそれらと何らかの形で対話する必要がある場合は、縮小されたテンプレートとクラスを与えることができます。

実際には、次の例のように、2つのテクニックを同じセットアップに組み合わせます。

<docs-code header="app/app.component.spec.ts (mixed setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="mixed-setup"/>

Angularコンパイラーは、`<app-banner>`要素に対して`BannerStubComponent`を作成し、`routerLink`属性を持つアンカーに`RouterLink`を適用しますが、`<app-welcome>`と`<router-outlet>`タグは無視します。

### `By.directive`と注入されたディレクティブ

さらに少しセットアップすると、初期データバインディングがトリガーされ、ナビゲーションリンクへの参照が取得されます。

<docs-code header="app/app.component.spec.ts (test setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="test-setup"/>

3つの重要なポイントを次に示します。

* `By.directive`を使用して、アタッチされたディレクティブを持つアンカー要素を見つけます
* クエリは、一致する要素をラップする`DebugElement`ラッパーを返します
* 各`DebugElement`は、その要素にアタッチされたディレクティブの特定のインスタンスを含む依存関係インジェクターを公開します

`AppComponent`が検証するリンクは次のとおりです。

<docs-code header="app/app.component.html (navigation links)" path="adev/src/content/examples/testing/src/app/app.component.html" visibleRegion="links"/>

次に、これらのリンクが期待どおりに`routerLink`ディレクティブに配線されていることを確認するテストを示します。

<docs-code header="app/app.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="tests"/>

## `page`オブジェクトの使用

`HeroDetailComponent`は、タイトル、2つのヒーローフィールド、2つのボタンを持つ単純なビューです。

しかし、この単純な形式でも、テンプレートの複雑さはたくさんあります。

<docs-code
  path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"/>

コンポーネントをテストするものは、…

* ヒーローが到着するまで待つ必要がある
* タイトルテキストへの参照
* 検査および設定するための名前入力ボックスへの参照
* クリックできる2つのボタンへの参照

このような小さなフォームでも、むち打ちの条件付きセットアップとCSS要素の選択の混乱を招く可能性があります。

コンポーネントのプロパティへのアクセスを処理し、それらを設定するロジックをカプセル化する`Page`クラスを使用して、複雑さを抑制します。

次に、`hero-detail.component.spec.ts`の`Page`クラスを示します。

<docs-code header="app/hero/hero-detail.component.spec.ts (Page)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="page"/>

これで、コンポーネントの操作と検査のための重要なフックが、整理され、`Page`のインスタンスからアクセスできるようになりました。

`createComponent`メソッドは、`page`オブジェクトを作成し、`hero`が到着すると空白を埋めます。

<docs-code header="app/hero/hero-detail.component.spec.ts (createComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="create-component"/>

次に、ポイントを強化するための`HeroDetailComponent`のテストをいくつか示します。

<docs-code header="app/hero/hero-detail.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="selected-tests"/>

## `compileComponents()`の呼び出し

HELPFUL: CLI`ng test`コマンドでのみテストを実行している場合は、このセクションを無視してください。なぜなら、CLIはテストを実行する前にアプリケーションをコンパイルするからです。

**CLI以外の環境**でテストを実行する場合、テストは次のようなメッセージで失敗する可能性があります。

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

問題の根本は、テストに関与するコンポーネントの少なくとも1つが、`BannerComponent`の次のバージョンで行われているように、外部テンプレートまたはCSSファイルを指定していることです。

<docs-code header="app/banner/banner-external.component.ts (external template & css)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts"/>

テストは、`TestBed`がコンポーネントの作成を試みたときに失敗します。

<docs-code avoid header="app/banner/banner-external.component.spec.ts (setup that fails)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="setup-may-fail"/>

アプリケーションはコンパイルされていないことを思い出してください。
そのため、`createComponent()`を呼び出すと、`TestBed`は暗黙的にコンパイルします。

これは、ソースコードがメモリ内にある場合は問題ありません。
しかし、`BannerComponent`は外部ファイルが必要であり、コンパイラーはファイルシステムからそれらを読み取る必要があります。これは本質的に*非同期*操作です。

`TestBed`が続行することを許可すると、テストが実行され、コンパイラーが完了する前に、不可解な理由で失敗します。

予防的なエラーメッセージは、`compileComponents()`で明示的にコンパイルするように指示しています。

### `compileComponents()`は非同期です

`compileComponents()`は、非同期テスト関数内で呼び出す必要があります。

CRITICAL: テスト関数を非同期にするのを怠ると（たとえば、[waitForAsync()](#waitForAsync)の使用を忘れると）、次のようなエラーメッセージが表示されます。

<docs-code hideCopy language="shell">

Error: ViewDestroyedError: Attempt to use a destroyed view

</docs-code>

一般的なアプローチは、セットアップロジックを2つの別の`beforeEach()`関数に分割することです。

| 関数                    | 詳細                       |
| :----------------------- | :---------------------------- |
| 非同期`beforeEach()` | コンポーネントをコンパイルする |
| 同期`beforeEach()`  | 残りのセットアップを実行する  |

### 非同期`beforeEach`

最初の非同期`beforeEach`は、次のように記述します。

<docs-code header="app/banner/banner-external.component.spec.ts (async beforeEach)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="async-before-each"/>

`TestBed.configureTestingModule()`メソッドは、`TestBed`クラスを返し、`compileComponents()`などの他の`TestBed`の静的メソッドへの呼び出しをチェーンすることができます。

この例では、`BannerComponent`はコンパイルする必要がある唯一のコンポーネントです。
他の例では、複数のコンポーネントでテストモジュールを設定し、さらに多くのコンポーネントを保持するアプリケーションモジュールをインポートする場合があります。
それらのいずれかが外部ファイルが必要になる可能性があります。

`TestBed.compileComponents`メソッドは、テストモジュールで設定されたすべてのコンポーネントを非同期的にコンパイルします。

IMPORTANT: `compileComponents()`を呼び出した後、`TestBed`を再設定しないでください。

`compileComponents()`を呼び出すと、現在の`TestBed`インスタンスがさらに設定されなくなります。
`configureTestingModule()`や`override...`メソッドなど、`TestBed`の構成メソッドをさらに呼び出すことはできません。
`TestBed`は、試行するとエラーをスローします。

`compileComponents()`を、`TestBed.createComponent()`を呼び出す前の最後のステップにしてください。

### 同期`beforeEach`

2番目の、同期`beforeEach()`には、残りのセットアップ手順が含まれます。これには、コンポーネントの作成と、検査する要素のクエリが含まれます。

<docs-code header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="sync-before-each"/>

テストランナーは、最初の非同期`beforeEach`が終了するまで待ってから、2番目を呼び出します。

### 統合された設定

2つの`beforeEach()`関数を、1つの非同期`beforeEach()`に統合できます。

`compileComponents()`メソッドはプロミスを返すため、同期セットアップタスクを*コンパイル後*に実行することができます。そのため、同期コードを`await`キーワードの後に移動します。この時点で、プロミスは解決されています。

<docs-code header="app/banner/banner-external.component.spec.ts (one beforeEach)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.spec.ts" visibleRegion="one-before-each"/>

### `compileComponents()`は安全です

`compileComponents()`を呼び出しても、必要ない場合でも害はありません。

CLIによって生成されたコンポーネントテストファイルは、`ng test`を実行しているときは不要ですが、`compileComponents()`を呼び出します。

このガイドのテストでは、必要に応じてのみ`compileComponents`を呼び出します。

## モジュールインポートによるセットアップ

以前のコンポーネントテストでは、次のようにテストモジュールをいくつかの`declarations`で設定していました。

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="config-testbed"/>

`DashboardComponent`はシンプルです。
助けは必要ありません。
しかし、より複雑なコンポーネントは、多くの場合、他のコンポーネント、ディレクティブ、パイプ、およびプロバイダーに依存しており、これらをテストモジュールにも追加する必要があります。

幸いなことに、`TestBed.configureTestingModule`のパラメーターは、`@NgModule`デコレーターに渡されるメタデータと並行しているため、`providers`と`imports`も指定できます。

`HeroDetailComponent`は、小さいサイズでシンプルな構造にもかかわらず、多くの助けを必要としています。
デフォルトのテストモジュール`CommonModule`からサポートを受けることに加えて、次のようなものが必要です。

* `FormsModule`の`NgModel`など、双方向データバインディングを有効にする
* `shared`フォルダの`TitleCasePipe`
* ルーターサービス
* ヒーローのデータアクセスサービス

1つのアプローチは、次の例のように、個々のピースからテストモジュールを設定することです。

<docs-code header="app/hero/hero-detail.component.spec.ts (FormsModule setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-forms-module"/>

HELPFUL: `beforeEach()`が非同期であり、`TestBed.compileComponents`を呼び出していることに注意してください。なぜなら、`HeroDetailComponent`は外部テンプレートとcssファイルを持っているからです。

[compileComponentsの呼び出し](#calling-compilecomponents)で説明されているように、これらのテストは、Angularがブラウザでそれらをコンパイルする必要がある、CLI以外の環境で実行することができます。

### 共有モジュールのインポート

多くのアプリケーションコンポーネントが`FormsModule`と`TitleCasePipe`を必要とするため、開発者は`SharedModule`を作成して、これらと他の頻繁に要求される部分を組み合わせました。

テスト設定では、次の例のように、`SharedModule`も使用できます。

<docs-code header="app/hero/hero-detail.component.spec.ts (SharedModule setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-shared-module"/>

これは少しタイトで小さく、インポートステートメントが少なくなります。この例では示されていません。

### 機能モジュールのインポート

`HeroDetailComponent`は、`SharedModule`など、相互依存する部分をさらにまとめた`HeroModule` [機能モジュール](guide/ngmodules/feature-modules)の一部です。
次のような`HeroModule`をインポートするテスト設定を試してみましょう。

<docs-code header="app/hero/hero-detail.component.spec.ts (HeroModule setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-hero-module"/>

`providers`の*テストダブル*のみが残ります。
`HeroDetailComponent`の宣言でさえなくなっています。

実際、宣言しようとすると、Angularはエラーをスローします。なぜなら、`HeroDetailComponent`は`HeroModule`と`TestBed`によって作成された`DynamicTestModule`の両方で宣言されているからです。

HELPFUL: コンポーネントの機能モジュールをインポートすると、モジュール内に多くの相互依存関係があり、モジュールが小さい場合（機能モジュールは通常小さい）にテストを設定する最良の方法になる場合があります。

## コンポーネントプロバイダーのオーバーライド

`HeroDetailComponent`は独自の`HeroDetailService`を提供します。

<docs-code header="app/hero/hero-detail.component.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="prototype"/>

`TestBed.configureTestingModule`の`providers`でコンポーネントの`HeroDetailService`をスタブすることはできません。
それらは*テストモジュール*のプロバイダーであり、コンポーネントのプロバイダーではありません。
それらは*フィクスチャレベル*で依存関係インジェクターを準備します。

Angularは、コンポーネントを*独自の*インジェクターで作成します。これは、フィクスチャインジェクターの*子*です。
これは、コンポーネントのプロバイダー（この場合は`HeroDetailService`）を子インジェクターに登録します。

テストは、フィクスチャインジェクターから子インジェクターのサービスを取得できません。
`TestBed.configureTestingModule`もそれらを設定することはできません。

Angularは、ずっと前から実際の`HeroDetailService`の新しいインスタンスを作成していました！

HELPFUL: これらのテストは、`HeroDetailService`がリモートサーバーに独自のXHR呼び出しを行う場合、失敗したり、タイムアウトしたりする可能性があります。
呼び出すリモートサーバーがない可能性があります。

幸いなことに、`HeroDetailService`は、リモートデータアクセスの責任を注入された`HeroService`に委任しています。

<docs-code header="app/hero/hero-detail.service.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.service.ts" visibleRegion="prototype"/>

[前のテスト設定](#import-a-feature-module)は、実際の`HeroService`を`TestHeroService`に置き換えます。これは、サーバーリクエストをインターセプトし、その応答を偽造します。

もし、そんなに恵まれていなかったらどうでしょうか？
`HeroService`を偽造するのが難しい場合はどうでしょうか？
`HeroDetailService`が独自のサーバーリクエストを行う場合はどうでしょうか？

`TestBed.overrideComponent`メソッドは、次のようなセットアップのバリエーションのように、コンポーネントの`providers`を管理しやすい*テストダブル*に置き換えることができます。

<docs-code header="app/hero/hero-detail.component.spec.ts (Override setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-override"/>

`TestBed.configureTestingModule`は、[不要になったため](#spy-stub)、偽の`HeroService`を提供しなくなっていることに注意してください。

### `overrideComponent`メソッド

`overrideComponent`メソッドに注目してください。

<docs-code header="app/hero/hero-detail.component.spec.ts (overrideComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-component-method"/>

これは、2つの引数を取ります。オーバーライドするコンポーネントタイプ（`HeroDetailComponent`）と、オーバーライドメタデータオブジェクトです。
[オーバーライドメタデータオブジェクト](guide/testing/utility-apis#metadata-override-object)は、次のように定義された汎用型です。

<docs-code language="javascript">

type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};

</docs-code>

メタデータオーバーライドオブジェクトは、メタデータプロパティの要素を追加および削除するか、それらのプロパティを完全にリセットできます。
この例では、コンポーネントの`providers`メタデータをリセットします。

型パラメーター`T`は、`@Component`デコレーターに渡すメタデータの種類です。

<docs-code language="javascript">

selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…

</docs-code>

### *スパイスタブ*（`HeroDetailServiceSpy`）を提供する

この例では、コンポーネントの`providers`配列を、`HeroDetailServiceSpy`を含む新しい配列に完全に置き換えます。

`HeroDetailServiceSpy`は、実際の`HeroDetailService`のスタブバージョンであり、そのサービスに必要なすべての機能を偽造します。
これは、下位の`HeroService`を注入したり、委任したりしないため、そのためのテストダブルを提供する必要はありません。

関連する`HeroDetailComponent`のテストは、サービスメソッドをスパイすることで、`HeroDetailService`のメソッドが呼び出されたことをアサートします。
それに応じて、スタブはメソッドをスパイとして実装します。

<docs-code header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="hds-spy"/>

### オーバーライドテスト

これでテストは、スパイスタブの`testHero`を操作することでコンポーネントのヒーローを直接制御し、サービスメソッドが呼び出されたことを確認できます。

<docs-code header="app/hero/hero-detail.component.spec.ts (override tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-tests"/>

### さらなるオーバーライド

`TestBed.overrideComponent`メソッドは、同じコンポーネントまたは異なるコンポーネントに対して複数回呼び出すことができます。
`TestBed`はこれらの他のクラスの一部を掘り下げて置き換えるために、`overrideDirective`や`overrideModule`、`overridePipe`などの類似のメソッドを提供します。

これらのオプションと組み合わせを自分で調べてみてください。
