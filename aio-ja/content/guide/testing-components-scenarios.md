# コンポーネントのテストシナリオ

This guide explores common component testing use cases.

<div class="alert is-helpful">

  For the sample app that the testing guides describe, see the <live-example name="testing" embedded-style noDownload>sample app</live-example>.

  For the tests features in the testing guides, see <live-example name="testing" stackblitz="specs" noDownload>tests</live-example>.

</div>

## コンポーネントバインディング

現在の`BannerComponent`は、静的なタイトルテキストをHTMLテンプレートに表示します。

少しの変更を加えた後、
次のようなコンポーネントの`title`プロパティにバインドすることによって、`BannerComponent`は動的なタイトルを表示します。

<code-example
  path="testing/src/app/banner/banner.component.ts"
  region="component"
  header="app/banner/banner.component.ts"></code-example>

これは簡単なので、
コンポーネントが実際に正しいと思われる場所にコンテンツが表示されることを確認するためにテストを追加します。

#### _&lt;h1&gt;_のクエリ

_title_プロパティのインターポレーションバインディングをラップする`<h1>`
要素の値を検証する一連のテストを書きます。

標準HTMLの`querySelector`を使用して要素を検索し、
それを`h1`という変数に割り当てるために`beforeEach`を更新します。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="setup"
  header="app/banner/banner.component.spec.ts (setup)"></code-example>

{@a detect-changes}

#### _createComponent()_はデータをバインドしない

最初のテストでは、画面にデフォルトの`title`が表示されていることを確認したいと思います。
あなたの直感は、次のような、`<h1>`を直ちに検証するテストを書くことでしょう。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default-v1"></code-example>

メッセージとともに_このテストは失敗します_:

```javascript
expected '' to contain 'Test Tour of Heroes'.
```

Angularが**変更検知**を実行したときにバインディングが発生します。

プロダクションでは、Angularがコンポーネントを作成するか、
ユーザーがキーストロークを入力するか、非同期アクティビティ(AJAXなど)が完了したときに
変更検知が自動的に起動します。

`TestBed.createComponent`は変更検知をトリガー_しません_。この事実は改定したテストで確認されます:

<code-example
  path="testing/src/app/banner/banner.component.spec.ts" region="test-w-o-detect-changes"></code-example>

#### _detectChanges()_

あなたは`fixture.detectChanges()`を呼び出すことで、データバインディングを実行するように`TestBed`に指示する必要があります。
そうするだけで、`<h1>`は期待されたタイトルをもつようになります。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default"></code-example>

遅延した変化検知は意図的かつ便利です。
_Angularがデータバインディングを開始して[ライフサイクルフック](guide/lifecycle-hooks)を呼び出す前に_、
コンポーネントの状態を検証して変更する機会をテスターに与えます。

次は、`fixture.detectChanges()`を呼び出す_前_にコンポーネントの`title`プロパティを変更するもうひとつのテストです。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="after-change"></code-example>

{@a automatic-change-detection}

#### 自動変更検知

`BannerComponent`は、頻繁に`detectChanges`を呼び出します。
テスターの中には、Angularテスト環境が自動的に変更検知を実行することを好む人もいます。

これは`ComponentFixtureAutoDetect`プロバイダーで`TestBed`を構成することで可能です。
まず、テスティングユーティリティライブラリからインポートします:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect" header="app/banner/banner.component.detect-changes.spec.ts (import)"></code-example>

それから、それをテストモジュール構成の`providers`配列に追加します:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)"></code-example>

次は、自動変更検知がどのように機能するかを示す3つのテストです。

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect-tests" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)"></code-example>

最初のテストでは、自動変更検知の利点が示されています。

2回目と3回目のテストで重要な制限が明らかになりました。
Angularのテスト環境では、テストがコンポーネントのタイトルを変更したことが_わかりません_。
`ComponentFixtureAutoDetect`サービスは、Promiseの解決、タイマー、DOMイベントなどの非同期アクティビティに応答します。
ただし、コンポーネントプロパティの直接で同期的な更新は不可視です。
テストは変更検知の別のサイクルをトリガーするために`fixture.detectChanges()`を手動で呼び出す必要があります。

<div class="alert is-helpful">

テストフィクスチャーが変更検知を実行するかどうかに思いを巡らせるのではなく、
このガイドのサンプルは_常に_`detectChanges()`を_明示的_に呼び出します。
`detectChanges()`を厳密に必要な数以上に頻繁に呼び出しても問題はありません。

</div>

<hr>

{@a dispatch-event}

#### _dispatchEvent()_を使用してinputの値を変更する

ユーザーインプットをシミュレートするために、input要素を探して`value`プロパティをセットします。

Angularの変更検知をトリガーするために`fixture.detectChanges()`を呼び出しましょう。
しかし、本質的で中間的なステップがあります。

Angularは、input要素の`value`プロパティがセットされたことを認識していません。
`dispatchEvent()`を呼び出して要素の`input`イベントを発生させるまで、
そのプロパティは読み取られません。_そのあとに_ `detectChanges()`を呼び出します。

次の例では、正しい手順を示しています。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

## 外部ファイルを使用したコンポーネント

さきほどの`BannerComponent`は、`@Component.template`プロパティと`@Component.styles`プロパティのそれぞれで指定された_インラインテンプレート_と_インラインCSS_で定義されています。

多くのコンポーネントは、次のように変更した`BannerComponent`がするように、
`@Component.templateUrl`プロパティと`@Component.styleUrls`プロパティでそれぞれ_外部テンプレート_と
_外部CSS_を指定します。

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  region="metadata"
  header="app/banner/banner-external.component.ts (metadata)"></code-example>

この構文は、コンポーネントコンパイル時に外部ファイルを読み込むようにAngularコンパイラに指示します。

CLIで `ng test`コマンドを実行するときは、
_テストを実行する前にアプリケーションをコンパイルするので_問題になりません。

ただし、**非CLI環境**でテストを実行すると、このコンポーネントのテストは失敗するでしょう。
たとえば、[plunker](https://plnkr.co/)などのWebコーディング環境で`BannerComponent`テストを実行すると、
次のようなメッセージが表示されます:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

_テスト中に_ランタイム環境がソースコードをコンパイルすると、
このテストエラーメッセージが表示されます。

問題を解決するには、[以下](#compile-components)で説明するように`compileComponents()`を呼び出します。

{@a component-with-dependency}

### 依存関係のあるコンポーネント

コンポーネントの多くはサービスの依存関係を持ちます。

`WelcomeComponent`は、ログインしたユーザーへのウェルカムメッセージを表示します。
それは注入した`UserService`のプロパティからユーザーが誰かを知ります:

<code-example path="testing/src/app/welcome/welcome.component.ts" header="app/welcome/welcome.component.ts"></code-example>

`WelcomeComponent`には、サービスとやりとりするロジックと、このコンポーネントの値のテストをするロジックの決定権があります。
次は、スペックファイル`app/welcome/welcome.component.spec.ts`のテスティングモジュールの構成です:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="config-test-module" header="app/welcome/welcome.component.spec.ts"></code-example>

今回は、_テスト中のコンポーネント_を宣言することに加えて、
`providers`配列に`UserService`プロバイダーを追加します。
しかし、実際の`UserService`ではありません。

{@a service-test-doubles}

#### テストダブルのサービスを提供する

_テスト中のコンポーネント_に実際のサービスを注入する必要はありません。
事実、通常はテストダブル(スタブ、フェイク、スパイ、またはモック)であればよりよいです。
スペックの目的は、サービスではなくコンポーネントをテストすることであり、
実際のサービスだと問題になる可能性があります。

実際の`UserService`を注入することは悪夢になる可能性があります。
実際のサービスは、ユーザーにログイン資格情報を要求し、
認証サーバーに到達しようとします。
このような動作は補足するのが難しい場合があります。
実際の`UserService`の代わりにテストダブルを作成して登録する方がはるかに簡単で安全です。

この特定のテストスイートは、`WelcomeComponent`とそのテストのニーズを満たす`UserService`の最小のモックを提供します:

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="user-service-stub"
  header="app/welcome/welcome.component.spec.ts"></code-example>

{@a get-injected-services}

#### 注入したサービスを取得する

テストでは、`WelcomeComponent`に注入された`UserService`(スタブ)へのアクセスが必要です。

Angularは階層的な注入システムを持ちます。
`TestBed`によって作成されたルートインジェクターからコンポーネントツリーまで、
複数のレベルのインジェクターがあります。

注入されたサービスを取得するもっとも安全な、
**常に動作する**方法は、**テスト中のコンポーネントのインジェクターから取得することです**。
コンポーネントインジェクターは、フィクスチャーの`DebugElement`のプロパティです。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="injected-service"
  header="WelcomeComponent's injector"></code-example>

{@a testbed-inject}

#### _TestBed.inject()_

`TestBed.inject()`経由でルートインジェクターからサービスを取得することも_できます_。
これは覚えやすく、あまり冗長ではありません。
しかし、Angularがコンポーネントとサービスのインスタンスをテストのルートインジェクターに注入する場合にのみ機能します。

このテストスイートでは、`UserService`の_唯一_のプロバイダーはルートテスティングモジュールなので、
`TestBed.inject()`を次のように呼び出すことは安全です:

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="inject-from-testbed"
  header="TestBed injector"></code-example>

<div class="alert is-helpful">

`TestBed.inject()`が機能しないユースケースについては、
いつ、そしてなぜかわりにコンポーネントのインジェクターからサービスを取得しなくてはいけないのかを説明する
[_コンポーネントのプロバイダーを上書きする_](#component-override)セクションを参照してください。

</div>

{@a welcome-spec-setup}

#### 最後のステップとテスト

次では、`TestBed.inject()`を使用して`beforeEach()`を完了しています:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="setup" header="app/welcome/welcome.component.spec.ts"></code-example>

そして何個かのテストを書きます:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="tests" header="app/welcome/welcome.component.spec.ts"></code-example>

最初のものはサニティーテストです。これはスタブされた`UserService`が呼び出され、動作していることを確認します。

<div class="alert is-helpful">

Jasmineのマッチャーの第2引数(たとえば、 `'expected name'`)は、オプショナルの失敗ラベルです。
エクスペクテーションが失敗した場合、Jasmineはこのラベルをエクスペクテーション失敗メッセージに追加します。
複数のエクスペクテーションをもつスペックでは、何が間違っていて、どのエクスペクテーションが失敗したかを明確にするのに役立ちます。

</div>

残りのテストは、サービスが異なる値を返すときのコンポーネントのロジックを確認します。
2番目のテストでは、ユーザー名の変更の影響を検証します。
3番目のテストでは、ログインしているユーザーがいない場合、コンポーネントが適切なメッセージを表示していることを確認します。

<hr>

{@a component-with-async-service}

## 非同期サービスを使用するコンポーネント

このサンプルでは、`AboutComponent`テンプレートは`TwainComponent`をホストします。
`TwainComponent`はMark Twainの引用を表示します。

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="template"
  header="app/twain/twain.component.ts (template)"></code-example>

コンポーネントの`quote`プロパティの値は、`AsyncPipe`を経由することに注意してください。
つまり、プロパティは`Promise`または`Observable`のいずれかを返します。

この例では、`TwainComponent.getQuote()`メソッドは、
`quote`プロパティが`Observable`を返すことを示しています。

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="get-quote"
  header="app/twain/twain.component.ts (getQuote)"></code-example>

`TwainComponent`は、注入された`TwainService`から引用を取得します。
コンポーネントは、サービスが最初の引用を返せるようになる前にプレースホルダー値(`'...'`)
を設定した`Observable`を返し始めます。

`catchError`はサービスのエラーを補足し、
エラーメッセージを作成し、成功チャネルのプレースホルダー値を返します。
同じ変更検知サイクルでそのメッセージが2回更新されるのを避けるために、
時間の経過を待って`errorMessage`を設定する必要があります。

これらがテストするための機能のすべてです。

#### スパイを使用したテスト

コンポーネントをテストするときは、サービスの公開APIだけが重要です。
一般に、テスト自体はリモートサーバー呼び出しをすべきではありません。
そのような呼び出しはエミュレートする必要があります。次の`app/twain/twain.component.spec.ts`のセットアップは、これを行うための1つの方法を示しています:

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="setup"
  header="app/twain/twain.component.spec.ts (setup)"></code-example>

{@a service-spy}

スパイに注目してください。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy"></code-example>

スパイは、`getQuote`への任意の呼び出しがテストの引用のObservableを受け取るように設計されています。
実際の`getQuote()`メソッドとは異なり、このスパイはサーバーをバイパスし、
その値がすぐに利用できる同期的なObservableを返します。

`Observable`が同期的であっても、このスパイで多くの有用なテストを書くことができます。

{@a sync-tests}

#### 同期的テスト

同期的な`Observable`の主な利点は、
非同期プロセスを同期的テストにすることができる点です。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="sync-test"></code-example>

スパイの結果が同期的に返されるため、
`getQuote()`メソッドは、
Angularが`ngOnInit`を呼び出す最初の変更検知サイクルの_直後_に画面上のメッセージを更新します。

エラーパスをテストするとき、あなたはラッキーではないかもしれません。
サービスのスパイはエラーを同期的に返しますが、
コンポーネントメソッドは`setTimeout()`を呼び出します。
このテストは、JavaScriptエンジンが少なくとも1回動作しきるのを待ってから値を取得できるようにする必要があります。
テストは_非同期_に行う必要があります。

{@a fake-async}
{@a async-test-with-fakeasync}

#### _fakeAsync()_を使用した非同期テスト

`fakeAsync()`機能を使うためには、 `zone.js/dist/zone-testing`をテストセットアップファイルでインポートする必要があります。
Angular CLIで作成されたプロジェクトであれば、 `zone-testing` はすでに `src/test.ts` でインポートされています。

次のテストは、サービスが`ErrorObservable`を返すときに期待される動作を確認します。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="error-test"></code-example>

`it()`関数が次の形式の引数を受け取ることに注目してください。

```javascript
fakeAsync(() => { /* test body */ })
```

`fakeAsync`関数は、特別な_fakeAsyncテストゾーン_でテスト本体を実行することによって、線形的なコーディングスタイルを可能にします。
テスト本体は同期的に見えます。
`Promise.then()`のようなネストされた構文はなく、制御の流れを混乱させることはありません。

<div class="alert is-helpful">

Limitation: The `fakeAsync()` function won't work if the test body makes an `XMLHttpRequest` (XHR) call.
XHR calls within a test are rare, but if you need to call XHR, see [`async()`](#async), below.

</div>

{@a tick}

#### _tick()_関数

(仮想)クロックを進めるには、[tick()](api/core/testing/tick) を呼び出さなければなりません。

[tick()](api/core/testing/tick) を呼び出すことでペンディング中のすべての非同期アクティビティが終了するまでの時間の経過をシミュレートします。
このケースでは、エラーハンドラー内の`setTimeout()`を待機します。

[tick()](api/core/testing/tick)関数は、パラメーターとしてミリ秒とtickOptionsを受け入れます。ミリ秒（指定されていない場合はデフォルトの0）パラメーターは、仮想クロックの進み具合を表します。たとえば、 `fakeAsync()` テストに `setTimeout(fn, 100)`がある場合、tick(100) を使用してfnコールバックをトリガーする必要があります。 tickOptionsは、processNewMacroTasksSynchronously（デフォルトはtrue）というプロパティをもつオプションのパラメーターであり、ティック時に新規生成されたマクロタスクを呼び出すかどうかを表します。

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick"></code-example>

[tick()](api/core/testing/tick) 関数は、`TestBed`と一緒にインポートするAngularテスティングユーティリティの1つです。
これは`fakeAsync()`と対になっており、`fakeAsync()`の内部でのみ呼び出すことができます。

#### tickOptions

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick-new-macro-task-sync">
</code-example>

In this example, we have a new macro task (nested setTimeout), by default, when we `tick`, the setTimeout `outside` and `nested` will both be triggered.

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick-new-macro-task-async">
</code-example>

And in some case, we don't want to trigger the new maco task when ticking, we can use `tick(milliseconds, {processNewMacroTasksSynchronously: false})` to not invoke new maco task.

#### fakeAsync() 内部での日時の比較

`fakeAsync()` は、 `fakeAsync()`の中の日付の差を計算できるようにするため、時間の流れをシミュレートします。

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-date"></code-example>

#### jasmine.clock と fakeAsync()

Jasmineも日付をシミュレートするための `clock` 機能を提供しています。`jasmine.clock().install()` が呼び出されてから`jasmine.clock().uninstall()`が呼び出されるまで、Angularは自動的に`fakeAsync()` の中でテストを実行します。
`fakeAsync()`は必要なく、ネストされていればエラーを投げます。

デフォルトではこの機能は無効化されています。有効にするには、 `zone-testing` をインポートするまえにグローバルフラグをセットしてください。

Angular CLIを使う場合は、 `src/test.ts` の中でこのフラグを設定してください。

```
(window as any)['__zone_symbol__fakeAsyncPatchLock'] = true;
import 'zone.js/dist/zone-testing';
```

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-clock"></code-example>

#### fakeAsync() の中でのRxJSスケジューラーの使用

`setTimeout()` や `setInterval()` を使うのと同じように `fakeAsync()` の中でRxJSスケジューラを使うこともできますが、RxJSスケジューラにパッチを当てるには `zone.js/dist/zone-patch-rxjs-fake-async` をインポートする必要があります。
<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-rxjs"></code-example>

#### より多くのmacroTasksをサポートする

デフォルトでは`fakeAsync()`は次のmacro taskをサポートします。

- `setTimeout`
- `setInterval`
- `requestAnimationFrame`
- `webkitRequestAnimationFrame`
- `mozRequestAnimationFrame`

`HTMLCanvasElement.toBlob()`のような他のmacro taskを実行したとき、`Unknown macroTask scheduled in fake async test`エラーがスローされます。

<code-tabs>
  <code-pane
    header="src/app/shared/canvas.component.spec.ts (failing)"
    path="testing/src/app/shared/canvas.component.spec.ts"
    region="without-toBlob-macrotask">
  </code-pane>
  <code-pane
    header="src/app/shared/canvas.component.ts"
    path="testing/src/app/shared/canvas.component.ts"
    region="main">
  </code-pane>
</code-tabs>

このようなケースをサポートしたい場合は、`beforeEach`でサポートしたいmacro taskを定義する必要があります。
たとえば次のようになります:

<code-example
  header="src/app/shared/canvas.component.spec.ts (excerpt)"
  path="testing/src/app/shared/canvas.component.spec.ts"
  region="enable-toBlob-macrotask">
</code-example>

アプリで `<canvas>` 要素をZone.js対応にするために、 `zone-patch-canvas`  パッチをインポートする必要があることに注意してください（`polyfills.ts` または `<canvas>` を使用する特定のファイルのいずれかの中で）：

<code-example
  header="src/polyfills.ts or src/app/shared/canvas.component.ts"
  path="testing/src/app/shared/canvas.component.ts"
  region="import-canvas-patch">
</code-example>

#### 非同期のObservable

あなたはこれらのテストのテストカバレッジに満足しているかもしれません。

しかし、実際のサービスではこのように動作しないという事実に悩まされるかもしれません。
実際のサービスは、リクエストをリモートサーバーに送信します。
サーバーは応答するのに時間がかかり、
前の2つのテストのように応答をすぐには利用できないでしょう。

次のように`getQuote()`スパイから非同期的なObservableを返すと、
あなたのテストは実世界をより忠実に反映できるでしょう。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-setup"></code-example>

#### 非同期Observableヘルパー

非同期のObservableは、`asyncData`ヘルパーによって生成されました。
`asyncData`ヘルパーは、自分で作成する必要があるユーティリティ関数です。
または、サンプルコードからこれをコピーすることもできます。

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-data"
  header="testing/async-observable-helpers.ts"></code-example>

このヘルパーのObservableは、JavaScriptエンジンの次のターンで`data`の値を発行します。

[RxJSの`defer()`演算子](http://reactivex.io/documentation/operators/defer.html)は、Observableを返します。
PromiseかObservableのどちらかを返すファクトリー関数を受け取ります。
なにかしらが_defer_のObservableをサブスクライブしたとき、
そのファクトリーで作成された新しいObservableにサブスクライバーが追加されます。

`defer()`演算子は、`HttpClient`のように`Promise.resolve()`を新しいObservableに変換して、
1回発行して完了します。
サブスクライバーは、データ値を受け取った後、アンサブスクライブされます。

次は、非同期エラーを生成するための同様のヘルパーです。

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-error"></code-example>

#### さらに非同期テスト

`getQuote()`スパイが非同期Observableを返すようになったので、
ほとんどのテストは非同期でなければならないでしょう。

次は、現実世界で期待されるデータフローを示す
`fakeAsync()`テストです。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="fake-async-test"></code-example>

`ngOnInit()`の後に、引用にはプレースホルダー値(`'...'`)が表示されることに注意してください。
最初の引用はまだ届いていません。

最初の引用をObservableからフラッシュするには、[tick()](api/core/testing/tick) を呼び出します。
次に、`detectChanges()`を呼び出して、Angularに画面を更新するように指示します。

それから、引用の要素に期待されるテキストが表示することをアサートしてみましょう。

{@a async}

#### _async()_を使用した非同期テスト

`async()`機能を使うためには、 `zone.js/dist/zone-testing`をテストセットアップファイルでインポートする必要があります。
Angular CLIで作成されたプロジェクトであれば、 `zone-testing` はすでに `src/test.ts` でインポートされています。

`fakeAsync()`ユーティリティ関数にはいくつかの制限があります。
特に、テスト本体が`XMLHttpRequest` （XHR）呼び出しを行う場合は動作しません。
テスト中のXHR呼び出しはまれであるため、普通は[`fakeAsync()`](#fake-async)を使うことができます。
しかし、`XMLHttpRequest`を呼び出す必要がある場合は、`async()`について知る必要があるでしょう。

<div class="alert is-helpful">

`TestBed.compileComponents()`メソッド([下記参照](#compile-components))は、
"just-in-time"コンパイル時に外部テンプレートとcssファイルを読み込むために`XHR`を呼び出します。
`async()`ユーティリティを使用して`compileComponents()`を呼び出すテストを作成してください。

</div>

次は、さきほどの`fakeAsync()`テストを`async()`ユーティリティで書き直したものです。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-test"></code-example>

`async()`ユーティリティは、
テスターのコードを特別な_asyncテストゾーン_で実行するようにすることによって、非同期的なボイラープレートを隠してくれます。
Jasmineの`done()`は `undefined` なのでテストに渡す必要はなく、
PromiseやObservableのコールバック内で`done()`を呼び出す必要はありません。

しかし、テストの非同期性は`fixture.whenStable()`の呼び出しによって明示的になります。
これは制御の線形的なフローを壊します。

`async()` の中で `setInterval()` などの `intervalTimer()` を使用する場合は、テスト後に `clearInterval()` を使用してタイマーをキャンセルする必要があります。それ以外の場合は、 `async()` は終了しません。

{@a when-stable}

#### _whenStable_

テストは、`getQuote()` Observableが次の引用を発行するのを待つ必要があります。
[tick()](api/core/testing/tick) を呼び出す代わりに、`fixture.whenStable()`を呼び出します。

`fixture.whenStable()`は、
JavaScriptエンジンのタスクキューが空になったときに解決するPromiseを返します。
この例では、Observableが最初の引用を発行すると、タスクキューは空になります。

テストは、Promiseコールバック内で再開し、
期待されるテキストで引用の要素を更新するために`detectChanges()`を呼び出します。

{@a jasmine-done}

#### Jasmineの _done()_

`async()`関数と
`fakeAsync()`関数はAngular非同期テストを大幅に簡素化しますが、
伝統的なテクニックに立ち戻って、
[`done`コールバック](https://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support)
を受け取る関数を`it`に渡すことができます。

`done パラメーター` が `undefined` なので、 `async()` や `fakeAsync()` の中で `done()` を呼び出すことはできません。

さて、あなたはPromiseをチェーンさせ、エラーを処理し、適切な時に`done()`を呼び出す責任があります。

`done()`を使用してテスト関数を書くことは、`async()`と`fakeAsync()`よりも面倒です。
しかしコードが `intervalTimer()` や `setInterval` を含むときには時折必要です。

次は、さきほどの2つのバージョンのテストを`done()`を使用して書いたものです。
最初の1つは、コンポーネントの`quote`プロパティによってテンプレートに公開された`Observable`をサブスクライブします。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="quote-done-test"></code-example>

RxJSの`last()`演算子は、完了する前のObservableの最後の値を発行します。
これはテストの引用になります。
`subscribe`コールバックでは、以前のテストと同じ方法で、引用の要素をテストの引用で更新するために`detectChanges()`を呼び出します。

いくつかのテストでは、画面に表示されるものよりも、
注入されたサービスメソッドがどのように呼び出されるかと、どんな値が返されるかに関心があります。

偽の`TwainService`の`qetQuote()`スパイなどのサービススパイは、
その情報を提供し、ビューの状態についてアサーションを行うことができます。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy-done-test"></code-example>

<hr>

{@a marble-testing}
## コンポーネントのマーブルテスト

さきほどの`TwainComponent`テストでは、`asyncData`と`asyncError`ユーティリティを使用して、
`TwainService`からの非同期Observableの応答をシミュレートしました。

これらはあなた自身で書くことができる短くて簡単な関数です。
残念ながら、これらは多くの一般的なシナリオでは単純すぎます。
Observableは大幅な遅延の後に、複数回発行されることが多いです。
コンポーネントは、
重複する値とエラーのシーケンスで複数のObservableを調整するかもしれません。

**RxJSマーブルテスト**は、シンプル、複雑、
両方の場合のObservableのシナリオをテストするための素晴らしい方法です。
あなたはおそらく、
Observableがどのように動作するかを示す[マーブルダイアグラム](http://rxmarbles.com/)を見たことがあるでしょう。
マーブルテストでは、同様のマーブル言語を使用して、
テスト内でObservableのストリームとエクスペクテーションを指定します。

次の例では、
`TwainComponen`の2つのテストをマーブルテストで再訪します。

まず、`jasmine-marbles` npmパッケージをインストールします。
次に、必要なシンボルをインポートします。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="import-marbles"
  header="app/twain/twain.component.marbles.spec.ts (import marbles)"></code-example>

引用を取得するための完全なテストは次のようになります:

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="get-quote-test"></code-example>

Jasmineのテストが同期的であることに注意してください。
`fakeAsync()`はありません。
マーブルテストは、テストスケジューラーを使用して、同期的テストにおける時間の経過をシミュレートします。

マーブルテストの美しさは、Obsrevalbeストリームの視覚的定義にあります。
このテストでは、3つの[フレーム](#marble-frame)(`---`)を待ち、
値(`x`)を発行し、
完了(`|`)する[_コールド_ Observable](#cold-observable)を定義します。
2番目の引数では、値マーカー(`x`)を発行する値(`testQuote`)にマップします。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-quote-marbles"></code-example>

マーブルライブラリは、
テストが`getQuote`スパイの戻り値としてセットする対応するObservableを構築します。

マーブルObservableをアクティブにする準備ができたら、
次のように`TestScheduler`に用意されたタスクキューを_フラッシュ_するように指示します。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-scheduler-flush"></code-example>

このステップは、
以前の`fakeAsync()`と`async()`での例の中での [tick()](api/core/testing/tick) と`whenStable()`と似た目的を果たします。
テストのバランスはそれらの例と同じです。

## マーブルエラーテスト

次は、`getQuote()`エラーテストのマーブルテストバージョンです。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-test"></code-example>

コンポーネント自体がエラーを処理するときに`setTimeout()`を呼び出すため、
これはまだ非同期テストです。`fakeAsync()`と [tick()](api/core/testing/tick) を呼び出す必要があります。

マーブルObservableの定義を見てください。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-marbles"></code-example>

これは、3つのフレームを待ってからエラーを発行する _コールド_ Observableです。
ハッシュ(`#`)は、3番目の引数で指定されたエラーのタイミングを示します。
Observableは決して値を発行しないので、2番目の引数は`null`です。

#### マーブルテストについて学ぶ

{@a marble-frame}
_マーブルフレーム_とは、テスト時間の仮想的な単位です。
各シンボル( `-` 、`x`、`|`、`#`)は、1つのフレームの通過をマークします。

{@a cold-observable}
_コールド_ Observableはサブスクライブされるまで値を発行しません。
アプリケーションのObservableのほとんどはコールドです。
すべての[_HttpClient_](guide/http)メソッドはコールドObservableを返します。

_ホット_ Observableは購読する_前_にすでに値を発行しています。
ルーターアクティビティを報告する[_Router.events_](api/router/Router#events)Observable、
これは _ホット_ Observableです。

RxJSマーブルテストは、このガイドの範囲を超えて、豊富な題材をもちます。
[公式ドキュメント](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md)から始めて、
ウェブ上で学習してください。

<hr>

{@a component-with-input-output}

## インプットとアウトプットを使用したコンポーネント

インプットとアウトプットをもつコンポーネントは、通常、ホストコンポーネントのビューテンプレート内に配置されます。
ホストは、プロパティバインディングを使用してインプットプロパティを設定し、
イベントバインディングを使用してアウトプットプロパティによって発生したイベントをリッスンします。

テストの目標は、そのようなバインディングが期待どおりに機能することを確認することです。
テストではインプット値を設定し、アウトプットイベントをリッスンする必要があります。

`DashboardHeroComponent`は、このロール内のコンポーネントの小さな例です。
`DashboardComponent`によって提供される個々のヒーローを表示します。
そのヒーローをクリックすると、ユーザーがヒーローを選択したことを`DashboardComponent`に伝えます。

`DashboardHeroComponent`は、次のような`DashboardComponent`テンプレートに組み込まれています:

<code-example
  path="testing/src/app/dashboard/dashboard.component.html"
  region="dashboard-hero"
  header="app/dashboard/dashboard.component.html (excerpt)"></code-example>

`DashboardHeroComponent`は`*ngFor`リピーター内に配置され、
各コンポーネントの`hero`インプットプロパティにループ値を設定し、コンポーネントの`selected`イベントをリッスンします。

コンポーネントの完全な定義は次のとおりです:

{@a dashboard-hero-component}

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="component"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

この単純なコンポーネントのテストに本質的な価値はほとんどありませんが、方法を知ることには価値があります。
あなたは次のアプローチの1つを使用することができます:

- `DashboardComponent`で使用されているようにテストする。
- スタンドアロンコンポーネントとしてテストする。
- `DashboardComponent`に代替して使用されているようにテストする。

最初のアプローチとして`DashboardComponent`コンストラクターを簡単に見てみると:

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)"></code-example>

`DashboardComponent`はAngularのルーターと`HeroService`に依存します。
おそらくそれらを両方ともテストダブルと置き換える必要があります。
これは多くの作業が必要です。ルーターは特に難しそうです。

<div class="alert is-helpful">

[以下の議論](#routing-component)では、ルーターを必要とするコンポーネントのテストについて説明します。

</div>

直近の目標は、`DashboardComponent`ではなく`DashboardHeroComponent`をテストすることです。
したがって、2番目と3番目のオプションを試してみてください。

{@a dashboard-standalone}

#### _DashboardHeroComponent_ スタンドアロンテスト

スペックファイルのセットアップは次のとおりです。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="setup"
  header="app/dashboard/dashboard-hero.component.spec.ts (setup)"></code-example>

セットアップコードがどのようにコンポーネントの`hero`プロパティにテストヒーロー
(`expectedHero`)を割り当てるのか、
`DashboardComponent`が自身のリピーター内でプロパティバインディングを介してそれを設定する方法をエミュレートするかに注目してください。

次のテストでは、ヒーロー名がバインディングを介してテンプレートに伝播することを確認します。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="name-test"></code-example>

[テンプレート](#dashboard-hero-component)ではヒーロー名をAngularの`UpperCasePipe`を通して渡すので、
テストではアッパーケースの名前をもつ要素の値とマッチする必要があります。

<div class="alert is-helpful">

この小さなテストでは、
Angularテストが[コンポーネントクラスのテスト](guide/testing-components-basics#component-class-testing)
では不可能だったコンポーネントのビジュアル表現を低コストで、
はるかに遅く複雑なエンドツーエンドのテストに頼らずに検証する方法を示しています。

</div>

#### クリックする

ヒーローをクリックすると、ホストコンポーネント(おそらく`DashboardComponent`)
が受け取ることができる`selected`イベントが発生するはずです:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test"></code-example>

コンポーネントの`selected`プロパティは`EventEmitter`を返します。
これは利用者にはRxJS同期的`Observable`のように見えます。
テストでは、ホストコンポーネントが_暗黙的_に行うのと同じように、_明示的_にサブスクライブします。

コンポーネントが期待どおりに動作する場合、ヒーローの要素をクリックすると、
コンポーネントの`selected`プロパティに`hero`オブジェクトを発行するように指示するはずです。

テストでは、`selected`へのサブスクリプションを通じてそのイベントが検知されます。

{@a trigger-event-handler}

#### _triggerEventHandler_

さきほどのテストの`heroDe`は、ヒーローの`<div>`を表す`DebugElement`です。

これはAngularのプロパティと、ネイティブ要素とのやりとりを抽象化するメソッドを持ちます。
このテストでは、 "click"というイベント名で`DebugElement.triggerEventHandler`を呼び出します。
"click"イベントバインディングは、`DashboardHeroComponent.click()`を呼び出して応答します。

Angularの`DebugElement.triggerEventHandler`は、
その_イベント名_で_データバインドされたイベント_を発生させることができます。2番目のパラメータは、ハンドラーに渡されるイベントオブジェクトです。

このテストでは、`null`イベントオブジェクトをもつ"click"イベントがトリガーされます。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler"></code-example>

テストで
ランタイムのイベントハンドラー(コンポーネントの`click()`メソッド)
がイベントオブジェクトを使用していないことを前提(まさにこのケース)としています。

<div class="alert is-helpful">

他のハンドラーはあまり寛容ではありません。
たとえば、`RouterLink`ディレクティブは、
クリック中にどのマウスボタン(ある場合)が押されたのかを識別する`button`プロパティをもつオブジェクトを想定しています。
イベントオブジェクトがない場合、`RouterLink`ディレクティブはエラーをスローします。

</div>

#### 要素をクリックする

次のテストでは、かわりにネイティブ要素自身の`click()`メソッドを呼び出します。
これは、_このコンポーネント_では問題ありません。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-2"></code-example>

{@a click-helper}

#### _click()_ ヘルパー

ボタン、アンカー、または任意のHTML要素をクリックすることは、一般的なテストタスクです。

_クリックトリガー_プロセスを次のような`click()`関数などのヘルパーにカプセル化することで、
一貫性と容易さを実現します:

<code-example
  path="testing/src/testing/index.ts"
  region="click-event"
  header="testing/index.ts (click helper)"></code-example>

最初のパラメータは_クリックする要素_です。
必要に応じて、カスタムイベントオブジェクトを2番目のパラメータとして渡すことができます。
デフォルトは、`RouterLink`ディレクティブを含む多くのハンドラーで受け入れられる(一部の)
<a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button">左ボタンマウスイベントオブジェクト</a>です。

<div class="alert is-important">

`click()`ヘルパー関数はAngularテストユーティリティの1つでは**ありません**。
この_ガイドのサンプルコード_で定義されている関数です。
すべてのサンプルテストでこれを使用しています。
あなたがこれを好むなら、あなた自身のヘルパーのコレクションに追加してください。

</div>

次は、さきほどのテストを、クリックヘルパーを使って書き直したものです。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-3"
  header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)"></code-example>

<hr>

{@a component-inside-test-host}

## テストホスト内部のコンポーネント

さきほどのテストでは、ホストである`DashboardComponent`自身をロールプレイしました。
しかし、`DashboardHeroComponent`は、ホストコンポーネントに適切にデータバインドされているときに正常に動作するでしょうか?

実際の`DashboardComponent`でテストできますが、
特に、そのテンプレートが`*ngFor`リピーター、他のコンポーネント、
レイアウトHTML、追加のバインディング、
複数のサービスを注入するコンストラクターを持っていて、
それらのサービスとすぐにやりとりし始めるとき、
多くのセットアップが必要になる可能性があります。

これらの気が狂いそうなものを無効にするための努力を想像してみてください。
ちょうどこのような_テストホスト_でうまくいくことができる点を検証することです。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host"
  header="app/dashboard/dashboard-hero.component.spec.ts (test host)"
 ></code-example>

このテストホストは、`DashboardComponent`のように`DashboardHeroComponent`にバインドしますが、ルーター、
`HeroService`、`*ngFor`リピーターなどのノイズはありません。

テストホストは、自身のテストヒーローをコンポーネントの`hero`インプットプロパティに設定します。
これはコンポーネントの`selected`イベントを`onSelected`ハンドラーにバインドします。
このハンドラーは、発行されたヒーローを`selectedHero`プロパティに記録します。

その後、
テストでは`DashboardHeroComponent.selected`イベントが期待されるヒーローを発行したことを検証するために`selectedHero`を簡単にチェックすることができます。

_テストホスト_のテストのセットアップは、スタンドアロンテストのセットアップと似ています:

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup" header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)"></code-example>

このテストモジュールの構成では、3つの重要な違いがあります:

1. `DashboardHeroComponent`と`TestHostComponent`の両方を_宣言_します。
1. `DashboardHeroComponent`の代わりに`TestHostComponent`を_作成_します。
1. `TestHostComponent`は`DashboardHeroComponent.hero`にバインディングをセットします。

`createComponent`は、`DashboardHeroComponent`のインスタンスの代わりに`TestHostComponent`のインスタンスをもつ`fixture`を返します。

`TestHostComponent`を作成すると、
前者のテンプレート内に`DashboardHeroComponent`が表示されるため、
それを作成するという副作用があります。
ヒーロー要素(`heroEl`)のクエリは、さきほどよりも要素ツリーの深さが深いものの、テストDOM内でそれを見つけ出せます。

テスト自体はスタンドアロンバージョンとほぼ同じです:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host-tests"
  header="app/dashboard/dashboard-hero.component.spec.ts (test-host)"></code-example>

選択したイベントテストのみが異なります。
これは、選択された`DashboardHeroComponen`のヒーローが実際にホストコンポーネントへのイベントバインディングを通じて登ってきたことを確認します。

<hr>

{@a routing-component}

## ルーティングコンポーネント

_ルーティングコンポーネント_は、`Router`に別のコンポーネントにナビゲートするように指示するコンポーネントです。
`DashboardComponent`は、ユーザーがダッシュボード上の_ヒーローボタン_の1つをクリックして`HeroDetailComponent`にナビゲートできるため、
_ルーティングコンポーネント_です。

ルーティングはかなり複雑です。
`DashboardComponent`のテストは、`HeroService`と一緒に注入される`Router`が関係しているため、
部分的には厄介にみえます。

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)"></code-example>

`HeroService`をスパイでモックするのは[おなじみの話](#component-with-async-service)です。
しかし、`Router`には複雑なAPIがあり、他のサービスやアプリケーションの前提条件と絡み合っています。モックするのは難しいかもしれないでしょうか?

幸いなことに、このケースでは、`DashboardComponent`が`Router`をあまり使用していないのでそうでもないです。

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="goto-detail"
  header="app/dashboard/dashboard.component.ts (goToDetail)"></code-example>

これは_ルーティングコンポーネント_でよくあるケースです。
原則として、ルーターではなくコンポーネントをテストし、
指定された条件の下でコンポーネントが正しいアドレスでナビゲートする場合にのみ注意してください。

_このコンポーネント_のテストスイートのためのルータースパイを提供することは、
`HeroService`スパイを提供するのと同じくらい簡単です。

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="router-spy"
  header="app/dashboard/dashboard.component.spec.ts (spies)"></code-example>

次のテストでは、表示されたヒーローをクリックし、
`Router.navigateByUrl`が期待されるURLで呼び出されたことを確認します。

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="navigate-test"
  header="app/dashboard/dashboard.component.spec.ts (navigate test)"></code-example>

{@a routed-component-w-param}

## ルーテッドコンポーネント

_ルーテッドコンポーネント_は`Router`ナビゲーションの行き先です。
特にコンポーネントへのルーティングに_パラメータが含まれている_場合は、テストするのが難しい場合があります。
`HeroDetailComponent`は、そのようなルーティングの行き先である_ルーテッドコンポーネント_です。

ユーザーが_ダッシュボード_のヒーローをクリックしたとき、
`DashboardComponent`はルーターに`heroes/:id`にナビゲートするように指示します。
`:id`はルーティングパラメータであり、その値は編集するヒーローの`id`です。

`Router`はそのURLを`HeroDetailComponent`へのルーティングとマッチします。
`Router`はルーティング情報を含む`ActivatedRoute`オブジェクトを作成し、
それを`HeroDetailComponent`の新しいインスタンスに挿入します。

`HeroDetailComponent`のコンストラクターは次のようになります:

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ctor" header="app/hero/hero-detail.component.ts (constructor)"></code-example>

`HeroDetail`コンポーネントは`HeroDetailService`
経由で対応するヒーローをフェッチするために`id`パラメータを必要とします。
コンポーネントは、
`Observable`である`ActivatedRoute.paramMap`プロパティから`id`を取得する必要があります。

`ActivatedRoute.paramMap`の`id`プロパティを参照するだけでは不十分です。
コンポーネントは、`ActivatableRoute.paramMap` Observableを_サブスクライブ_し、
`id`がそのライフタイム内で変更されるように準備する必要があります。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init" header="app/hero/hero-detail.component.ts (ngOnInit)"></code-example>

<div class="alert is-helpful">

[Router](guide/router) ガイドの[ActivatedRoute in action](guide/router-tutorial-toh#activated-route-in-action) セクションでは、`ActivatedRoute.paramMap`について詳しく説明しています。

</div>

テストでは、コンポーネントのコンストラクターに注入された`ActivatedRoute`を操作することによって、
`HeroDetailComponent`が異なる`id`パラメータ値にどのように応答するかを調べることができます。

あなたは`Router`とデータサービスをスパイする方法を知っています。

あなたは次の理由で`ActivatedRoute`とは異なるアプローチをとるでしょう。

- `paramMap`は、
  テスト中に複数の値を出力できる`Observable`を返します。
- `ParamMap`を作成するためのルーターヘルパー関数`convertToParamMap()`が必要です。
- 他の_ルーテッドコンポーネント_のテストでは、`ActivatedRoute`のテストダブルが必要です。

これらの違いは、再利用可能なスタブクラスが必要だと言っています。

#### _ActivatedRouteStub_

次の`ActivatedRouteStub`クラスは、`ActivatedRoute`のテストダブルとして機能します。

<code-example
  path="testing/src/testing/activated-route-stub.ts"
  region="activated-route-stub"
  header="testing/activated-route-stub.ts (ActivatedRouteStub)"></code-example>

このようなヘルパーを`app`フォルダと同一階層の`testing`フォルダに配置することを検討してください。
このサンプルでは`ActivatedRouteStub`を`testing/activated-route-stub.ts`に置きます。

<div class="alert is-helpful">

  [_マーブルテストライブラリ_](#marble-testing)
  でこのスタブクラスのより能力の高いバージョンを書くことを検討してください。

</div>

{@a tests-w-test-double}

#### _ActivatedRouteStub_ を使用したテスト

Observableより取得した`id`が既存のヒーローを参照しているときのコンポーネントの動作を示すテストは次のようになります:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id" header="app/hero/hero-detail.component.spec.ts (existing id)"></code-example>

<div class="alert is-helpful">

`createComponent()`メソッドと`page`オブジェクトについては[後述](#page-object)します。
今はあなたの直感に頼ってください。

</div>

`id`が見つからない場合、コンポーネントは`HeroListComponent`にルーティングし直す必要があります。

テストスイートのセットアップは、実際にナビゲートせずにルーターをスパイしている[上記](#routing-component)と同じルータースパイを提供しました。

次のテストでは、コンポーネントが`HeroListComponent`にナビゲートしようとします。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id" header="app/hero/hero-detail.component.spec.ts (bad id)"></code-example>

このアプリは`id`パラメータを省略した`HeroDetailComponent`へのルーティングを持っていませんが、いつかそのようなルーティングを追加するかもしれません。
コンポーネントは、`id`がないときに妥当な何かを行うべきです。

この実装では、コンポーネントは新しいヒーローを作成して表示する必要があります。
新しいヒーローは`id=0`と空の`name`を持ちます。次のテストではコンポーネントが期待どおりに動作することを確認します:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="route-no-id"
  header="app/hero/hero-detail.component.spec.ts (no id)"></code-example>

<hr>
{@a nested-component-tests}

## ネストしたコンポーネントのテスト

コンポーネントテンプレートはネストしたコンポーネントをもつことが多いです。
そのテンプレートにはさらにコンポーネントが含まれるているでしょう。

コンポーネントツリーはとても深いかもしれませんが、
ほとんどの場合、ネストしたコンポーネントは、ツリーの最上部にあるコンポーネントのテストには何の役割も果たしません。

たとえば、`AppComponent`は、アンカーとその`RouterLink`ディレクティブを含むナビゲーションバーを表示します。

<code-example
  path="testing/src/app/app.component.html"
  header="app/app.component.html"></code-example>

`AppComponent`_クラス_は空ですが、
おそらく[以下の理由](#why-stubbed-routerlink-tests)で、
リンクが`RouterLink`ディレクティブに正しく配線されているかどうかを確認するためのユニットテストを書きたいかもしれません。

リンクを検証するには、ナビゲートするための`Router`は必要ではありませんし、
`Router`が_ルーテッドコンポーネント_を挿入する場所をマークするための`<router-outlet>`も必要ありません。

`BannerComponent`と`WelcomeComponent`
(`<app-banner>`と`<app-welcome>`で示される)も無関係です。

しかし、`AppComponent`をDOMに作成するテストでは、
これらの3つのコンポーネントのインスタンスも作成されます。
そのような場合は、それらを作成するために`TestBed`を設定する必要があるでしょう。

それらの宣言を怠ると、
Angularコンパイラは`AppComponent`テンプレート内の`<app-banner>`、`<app-welcome>`、および`<router-outlet>`タグを認識せず、
エラーをスローします。

実際のコンポーネントを宣言する場合は、_それら_のネストしたコンポーネントを宣言し、
ツリー内の_あらゆる_コンポーネントに注入された_すべて_のサービスも提供する必要があります。

これはリンクについての簡単な質問に答えるだけに対して過大な労力です。

このセクションでは、セットアップを最小限に抑えるための2つのテクニックについて説明します。
主要なコンポーネントのテストに集中するために、これらを単独または組み合わせて使用​​してください。

{@a stub-component}

##### 不必要なコンポーネントをスタブする

最初のテクニックでは、
テストでほとんど役割を果たさないコンポーネントとディレクティブのスタブバージョンを作成して宣言します。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="component-stubs"
  header="app/app.component.spec.ts (stub declaration)"></code-example>

スタブのセレクターは、対応する実際のコンポーネントのセレクターと一致します。
しかし、そのテンプレートとクラスは空です。

その後、`TestBed`の構成内で、
実際に必要なコンポーネント、ディレクティブ、パイプの次に宣言します。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="testbed-stubs"
  header="app/app.component.spec.ts (TestBed stubs)"></code-example>

`AppComponent`はテスト対象ですので、もちろん実際のバージョンを宣言してください。

[後述](#routerlink)する`RouterLinkDirectiveStub`は、
リンクのテストに役立つ、実際の`RouterLink`のテストバージョンです。

残りはスタブです。

{@a no-errors-schema}

#### _NO_ERRORS_SCHEMA_

2つ目のアプローチでは、`NO_ERRORS_SCHEMA`を`TestBed.schemas`メタデータに追加します。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="no-errors-schema"
  header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)"></code-example>

`NO_ERRORS_SCHEMA`は、認識できない要素と属性を無視するようにAngularコンパイラに指示します。

コンパイラは、
`TestBed`の設定で対応する`AppComponent`と`RouterLinkDirectiveStub`を宣言したため、
`<app-root>`要素と`routerLink`属性を認識します。

しかし、`<app-banner>`、`<app-welcome>`、または`<router-outlet>`が見つかった場合、コンパイラはエラーを投げません。
単に空のタグとしてレンダリングし、ブラウザはそれらを無視します。

スタブコンポーネントはもう必要ありません。

#### 両方のテクニックを使用する

これらのテクニックは、
コンポーネントの視覚的な外見を、テストの対象となるコンポーネントのテンプレート内の要素だけに縮小するので、
_浅いコンポーネントテスト_と呼ばれます。

`NO_ERRORS_SCHEMA`のアプローチは2つの方法を使うよりも簡単ですが、それを過度に使用しないでください。

また、`NO_ERRORS_SCHEMA`は、誤って省略した、
またはスペルの間違ったコンポーネントや属性についてもコンパイラに知らせないようにします。
コンパイラが瞬時に捉えていた隠されたバグを追跡する時間を無駄にすることがあります。

_スタブコンポーネント_のアプローチには別の利点があります。
_この_例のスタブは空ですが、
テストで何らかの方法でそれとやりとりする必要がある場合は、
テンプレートとクラスを取り除くことができます。

実際には、
この例のように同じセットアップ内で2つのテクニックを組み合わせます。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="mixed-setup"
  header="app/app.component.spec.ts (mixed setup)"></code-example>

Angularコンパイラは、`<app-banner>`要素の`BannerComponentStub`を作成し、
`routerLink`属性をもつアンカーに`RouterLinkStubDirective`を適用しますが、
`<app-welcome>`タグと`<router-outlet>`タグは無視します。

<hr>

{@a routerlink}
## _RouterLink_を使用したコンポーネント

実際の`RouterLinkDirective`はかなり複雑で、
他のコンポーネントや`RouterModule`のディレクティブと絡み合っています。
テストでモックして使用するには、頑張ったセットアップが必要です。

このサンプルコードの`RouterLinkDirectiveStub`は、
実際のディレクティブを、
`AppComponent`テンプレートに見られるアンカータグ配線の種類を検証するために設計された代替バージョンに置き換えます。

<code-example
  path="testing/src/testing/router-link-directive-stub.ts"
  region="router-link"
  header="testing/router-link-directive-stub.ts (RouterLinkDirectiveStub)"></code-example>

`[routerLink]`属性にバインドされたURLは、ディレクティブの`linkParams`プロパティに流れます。

`HostListener`メタデータプロパティは、
ホスト要素のクリックイベント(`AppComponent`の`<a>`アンカー要素)をスタブディレクティブの`onClick`メソッドに紐づけます。

アンカーをクリックすると、
`onClick()`メソッドをトリガーして、スタブに露出した`navigatedTo`プロパティが設定されます。
テストでは、
アンカーをクリックしたときに期待どおりのルート定義が設定されていることを確認するために`navigatedTo`を検証します。

<div class="alert is-helpful">

ルーターがそのルーティング定義でナビゲートするように正しく設定されているかどうかは、
別のテストセットで考えることです。

</div>

{@a by-directive}
{@a inject-directive}

#### _By.directive_ と注入したディレクティブ

もう少しセットアップすると、最初のデータバインディングがトリガーされ、ナビゲーションリンクへの参照が取得されます:

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="test-setup"
  header="app/app.component.spec.ts (test setup)"></code-example>

特に興味のあるポイントは3つあります:

1. `By.directive`を使用して、添付されたディレクティブでアンカー要素を見つけることができます。

1. クエリは、マッチする要素を囲むような`DebugElement`ラッパーを返します。

1. 各`DebugElement`は、
   特定の、その要素にアタッチされたディレクティブのインスタンスをもつ依存性のインジェクターを公開します。

検証のための`AppComponent`のリンクは次のとおりです:

<code-example
  path="testing/src/app/app.component.html"
  region="links"
  header="app/app.component.html (navigation links)"></code-example>

{@a app-component-tests}

これらのリンクが期待どおりに`routerLink`ディレクティブに配線されていることを確認するテストは次のようになります:

<code-example path="testing/src/app/app.component.spec.ts" region="tests" header="app/app.component.spec.ts (selected tests)"></code-example>

<div class="alert is-helpful">

_この例_の"click"テストは誤解を招きます。
これは、_コンポーネント_ではなく、`RouterLinkDirectiveStub`をテストします。
これは、ディレクティブスタブの一般的な失敗です。

このガイドには正当な目的があります。
ルーターの全機能を使用することなく、`RouterLink`要素を見つけてクリックし、結果を検証する方法を示します。
これは、ユーザーがリンクをクリックしたときに、
表示を変更したり、パラメータを再計算したり、
ナビゲーションオプションを並べ替えたりする、
より洗練されたコンポーネントをテストするために必要なスキルです。

</div>

{@a why-stubbed-routerlink-tests}

#### それらのテストは何がよいのですか?

スタブした`RouterLink`テストでは、リンクとアウトレットをもつコンポーネントが適切に設定されていること、
コンポーネントが必要なリンクを持っていること、そしてそれらすべてが期待される行き先になっていることを確認できます。
これらのテストは、ユーザーがリンクをクリックしたときにアプリケーションが対象のコンポーネントにナビゲートすることに成功するかどうかには関係ありません。

このような制限されたテストを達成するためには、`RouterLink`と`RouterOutlet`をスタブすることが最良の選択肢です。
実際のルーターに依存すると、それらは脆弱になります。
コンポーネントと無関係の理由で失敗する可能性があります。
たとえば、ナビゲーションガードによって、権限のないユーザーが`HeroListComponent`にアクセスするのを防ぐかもしれません。
これは`AppComponent`の落ち度ではなく、そのコンポーネントへの変更は失敗したテストを修正することはできません。

_別_の総合テストでは、ユーザーが認証され、許可されているかどうかなどの、
ガードに影響する条件が存在する場合にアプリケーションが期待どおりにナビゲートするかどうかを調べることができます。

<div class="alert is-helpful">

将来のガイドアップデートでは、
`RouterTestingModule`でこのようなテストを書く方法を説明します。

</div>

<hr>

{@a page-object}

## _page_ オブジェクトを使用する

`HeroDetailComponent`は、タイトル、2つのヒーローのフィールド、2つのボタンをもつシンプルなビューです。

<div class="lightbox">
  <img src='generated/images/guide/testing/hero-detail.component.png' alt="HeroDetailComponent in action">
</div>

しかし、このシンプルなフォームでも多くの複雑なテンプレートを持ちます。

<code-example
  path="testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"></code-example>

コンポーネントを実行するテストに必要なことは...

- 要素がDOMに現れる前にヒーローが到着するまで待つこと。
- タイトルテキストへの参照。
- 検証して値をセットするための名前のインプットボックスへの参照。
- クリック可能な2つのボタンへの参照。
- いくつかのコンポーネントとルーターのメソッドをスパイする。

このような小さなフォームであっても、苦しくて面倒くさい条件設定とCSS要素の選択が必要になるでしょう。

コンポーネントプロパティへのアクセスを処理し、
それらを設定するロジックをカプセル化する`Page`クラスを使用して、複雑さを克服してください。

`hero-detail.component.spec.ts`の`Page`クラスは次のとおりです。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="page"
  header="app/hero/hero-detail.component.spec.ts (Page)"></code-example>

コンポーネントの操作と検証のための重要なフックは、`Page`のインスタンスからきれいに整理され、アクセス可能になりました。

`createComponent`メソッドは`page`オブジェクトを作成し、`hero`が到着すると空白を埋め込みます。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="create-component"
  header="app/hero/hero-detail.component.spec.ts (createComponent)"></code-example>

上のセクションの[_HeroDetailComponent_のテスト](#tests-w-test-double)では、
`createComponent`と`page`がテストの短さと_方針_を保つ方法を示しています。
注意を払う必要はありません。Promiseを待つことはなく、比較する要素値のDOMを検索する必要もありません。

次は、この点を補強する`HeroDetailComponent`テストです。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="selected-tests"
  header="app/hero/hero-detail.component.spec.ts (selected tests)"></code-example>

<hr>

{@a compile-components}
## _compileComponents()_ を呼び出す
<div class="alert is-helpful">

CLIから`ng test`コマンドを使用してテストを実行する_だけ_な場合、
CLIがテストを実行する前にアプリケーションをコンパイルするのでこのセクションは無視してもかまいません。

</div>

**非CLI環境**でテストを実行すると、テストはこのようなメッセージで失敗することがあります:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

この問題の根本原因は、
`BannerComponent`の次のバージョンのように、
テストに関係するコンポーネントの少なくとも1つが外部テンプレートまたはCSSファイルを指定していることです。

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  header="app/banner/banner-external.component.ts (external template & css)"></code-example>

`TestBed`がコンポーネントを作成しようとすると、テストは失敗します。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="configure-and-create"
  header="app/banner/banner.component.spec.ts (setup that fails)"
  avoid></code-example>

アプリケーションがコンパイルされていないことを思い出してください。
したがって、`createComponent()`を呼び出すと、`TestBed`は暗黙的にコンパイルされます。

これは、ソースコードがメモリ上にあるときには問題ありません。
しかし、`BannerComponent`は、
コンパイルが本質的に
_非同期_な操作である、ファイルシステムから読み取らなくてはいけない外部ファイルを必要とします。

`TestBed`を続行することが許されていれば、
テストは実行され、コンパイラが終了する前に不思議に失敗するでしょう。

さきほどのエラーメッセージは、`compileComponents()`で明示的にコンパイルするよう指示しています。

#### _compileComponents()_ は非同期

あなたは非同期テスト関数内で`compileComponents()`を呼び出す必要があります。

<div class="alert is-critical">

テスト関数を非同期にすることを怠った場合
(たとえば、後述の`async()`の使用を忘れた場合)、
このようなエラーメッセージが表示されます。

<code-example language="sh" class="code-shell" hideCopy>
Error: ViewDestroyedError: Attempt to use a destroyed view
</code-example>

</div>

典型的な方法は、セットアップロジックを2つの別々の`beforeEach()`関数に分割することです。

1. コンポーネントをコンパイルする非同期的な`beforeEach()`
1. 残りのセットアップを実行する同期的な`beforeEach()`

このパターンにしたがうには、`async()`ヘルパーを他のテストシンボルと一緒にインポートします。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="import-async"></code-example>

#### 非同期な_beforeEach_

次のように、最初の非同期な`beforeEach`を書いてください。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="async-before-each"
  header="app/banner/banner-external.component.spec.ts (async beforeEach)"></code-example>

`async()`ヘルパー関数は、セットアップを行うパラメーターなしの関数を受け取ります。

`TestBed.configureTestingModule()`メソッドは`TestBed`クラスを返します。
これにより、`compileComponents()`などの他の`TestBed`の静的メソッドの呼び出しをチェーンすることができます。

この例では、`BannerComponent`がコンパイルする唯一のコンポーネントです。
他の例では、複数のコンポーネントをもつテストモジュールを構成し、
より多くのコンポーネントを保持するアプリケーションモジュールをインポートできます。
いずれも外部ファイルを必要とする可能性があります。

`TestBed.compileComponents`メソッドは、テストモジュールで構成されたすべてのコンポーネントを非同期にコンパイルします。

<div class="alert is-important">

`compileComponents()`を呼び出した後に`TestBed`を再構成しないでください.

</div>

`compileComponents()`を呼び出すと、追加の設定を行うために現在の`TestBed`インスタンスが閉じられます。
`configureTestingModule()`や`override...`メソッドのいずれも呼び出すことはできません。
試してみると、`TestBed`はエラーをスローします。

`compileComponents()`を`TestBed.createComponent()`
を呼び出す前の最後のステップにしてください。

#### 同期的な _beforeEach_

次の、同期的な`beforeEach()`には、
コンポーネントの作成と、検証する要素のクエリの実行を含む残りの設定手順が含まれています。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="sync-before-each"
  header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)"></code-example>

テストランナーは、2番めの`beforeEach`の呼び出し前に、最初の非同期の`beforeEach`の完了を待つことができます。

#### セットアップを統合する

2つの`beforeEach()`関数を1つの非同期の`beforeEach()`に統合することができます。

`compileComponents()`メソッドはPromiseを返します。
なので、同期的コードを`then(...)`コールバックに移動することによって、
コンパイル_後_に同期的なセットアップタスクを実行できます。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="one-before-each"
  header="app/banner/banner-external.component.spec.ts (one beforeEach)"></code-example>

#### _compileComponents()_ は無害

`compileComponents()`が必要でないときに呼び出すことに害はありません。

CLIによって生成されたコンポーネントテストファイルは、
`ng test`の実行時には必要ではないのに`compileComponents()`を呼び出します。

このガイドのテストでは必要になったときだけ`commpileComponents`を呼び出します。

<hr>

{@a import-module}

## モジュールのインポートを使用してセットアップする

これまでのコンポーネントテストでは、次のようにいくつかの`declarations`でテストモジュールを構成しました:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="config-testbed"
  header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)"></code-example>

`DashboardComponent`はシンプルです。
補助を必要としません。
しかし、より複雑なコンポーネントは多くの場合、他のコンポーネント、ディレクティブ、パイプ、プロバイダーに依存し、これらもテストモジュールに追加する必要があります。

幸いにも、`TestBed.configureTestingModule`パラメータは、
`@NgModule`デコレーターに渡されるメタデータと平行です。
つまり、`providers`と`imports`を指定することもできます。

`HeroDetailComponent`は、サイズが小さく簡単な構成にもかかわらず、多くの補助が必要です。
デフォルトのテストモジュールの`CommonModule`から受け取るサポートに加えて、次のものが必要になります:

- 双方向バインディングを有効にするための`FormsModule`内の`NgModel`とその仲間
- `shared`フォルダ内の`TitleCasePipe`
- ルーターサービス(これらのテストではスタブしています)
- ヒーローデータアクセスサービス(これもスタブされています)

1つのアプローチは、次の例のように個々の部品からテストモジュールを構成することです:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-forms-module"
  header="app/hero/hero-detail.component.spec.ts (FormsModule setup)"></code-example>

<div class="alert is-helpful">

`HeroDetailComponent`は外部テンプレートとCSSファイルをもつため、
`beforeEach()`は非同期的に`TestBed.compileComponents`を呼び出します。

上記の[_`compileComponents()`の呼び出し_](#compile-components)
で説明したように、
これらのテストはAngularがブラウザ上でコンパイルしなければならない非CLI環境で実行できます。

</div>

#### 共有モジュールをインポートする

多くのアプリケーションのコンポーネントは`FormsModule`と`TitleCasePipe`を必要とするため、
開発者は頻繁に要求されるこれらのコンポーネントを組み合わせるために`SharedModule`を作成しました。

テスト構成では、この代替のセットアップのような`SharedModule`も使用できます:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-shared-module"
  header="app/hero/hero-detail.component.spec.ts (SharedModule setup)"></code-example>

インポート文の数が少なくて済むようになります(表示はしません)。

{@a feature-module-import}

#### フィーチャーモジュールをインポートする

`HeroDetailComponent`は`HeroModule`[フィーチャーモジュール](guide/feature-modules)の一部品で、
`SharedModule`を含む相互依存関係の多くを集約します。
次のような`HeroModule`をインポートするテスト構成を試してみてください:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module" header="app/hero/hero-detail.component.spec.ts (HeroModule setup)"></code-example>

これは_本当_に簡潔です。`providers`のテストダブルが残っているだけです。`HeroDetailComponent`の宣言さえもなくなりました。

実際に`HeroDetailComponent`を宣言しようとすると、
`HeroDetailComponent`が`TestBed`によって作成された`HeroModule`と`DynamicTestModule`の両方で宣言されるため、
Angularはエラーをスローします。

<div class="alert is-helpful">

フィーチャーモジュールがそうであるように、
コンポーネントのフィーチャーモジュールをインポートすることは、
モジュール内に相互依存関係が多くてモジュールが小さい場合にテストを構成するもっとも簡単な方法です。

</div>

<hr>

{@a component-override}

## コンポーネントのプロバイダーをオーバーライドする

`HeroDetailComponent`は自分自身の`HeroDetailService`を提供します。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="prototype" header="app/hero/hero-detail.component.ts (prototype)"></code-example>

`TestBed.configureTestingModule`の`providers`でコンポーネントの`HeroDetailService`をスタブすることはできません。
それらはコンポーネントではなく、_テストモジュール_のプロバイダーです。_フィクスチャーレベル_で依存性のインジェクターを準備します。

Angularはコンポーネントを、フィクスチャーインジェクターの_子_であるコンポーネント_自身_のインジェクターを使用して作成します。
コンポーネントのプロバイダー(このケースでは`HeroDetailService`)を子インジェクターに登録します。

テストでは、フィクスチャーのインジェクターから子インジェクターサービスを受け取ることができません。
また、`TestBed.configureTestingModule`ではそれらを構成することもできません。

Angularは最初からずっと本物の`HeroDetailService`のインスタンスを作成していました!

<div class="alert is-helpful">

`HeroDetailService`がリモートサーバーへの自身のXHR呼び出しを行った場合、これらのテストは失敗するか、タイムアウトになる可能性があります。
呼び出すリモートサーバーがない可能性があります。

幸いにも、`HeroDetailService`は、注入された`HeroService`へリモートデータアクセスの責任を委譲します。

<code-example path="testing/src/app/hero/hero-detail.service.ts" region="prototype" header="app/hero/hero-detail.service.ts (prototype)"></code-example>

[以前のテスト構成](#feature-module-import)では、
実際の`HeroService`をサーバー要求をインターセプトしてレスポンスを偽装する`TestHeroService`に置き換えていました。

</div>

もしあなたがとても幸運でないならどうでしょうか? `HeroService`をモックするのが難しい場合はどうすればいいですか?
`HeroDetailService`自身がサーバーへリクエストする場合はどうなりますか？

`TestBed.overrideComponent`メソッドは、コンポーネントの`providers`を、
次のセットアップの変更で示すように、管理しやすい_テストダブル_に置き換えることができます:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override" header="app/hero/hero-detail.component.spec.ts (Override setup)"></code-example>

`TestBed.configureTestingModule`が(偽の)`HeroService`を提供しなくなったことに([不要](#spy-stub)であるため)注目してください。

{@a override-component-method}

#### _overrideComponent_ メソッド

`overrideComponent` メソッドに注目してください。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method" header="app/hero/hero-detail.component.spec.ts (overrideComponent)"></code-example>

これは2つの引数を受け取ります。オーバーライドするコンポーネントタイプ(`HeroDetailComponent`)とオーバーライドメタデータオブジェクトです。
[オーバーライドメタデータオブジェクト](guide/testing-utility-apis#metadata-override-object)は、次のように定義されるジェネリック型のオブジェクトです:

<code-example language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

メタデータオーバーライドオブジェクトは、メタデータプロパティに要素を追加または削除するか、またはこれらのプロパティを完全にリセットすることができます。
この例では、コンポーネントの`providers`のメタデータをリセットします。

型パラメータ`T`は`@Component`デコレーターに渡すメタデータの種類です

<code-example language="javascript">
  selector?: string;
  template?: string;
  templateUrl?: string;
  providers?: any[];
  ...
</code-example>

{@a spy-stub}

#### _スパイスタブ_を提供する (_HeroDetailServiceSpy_)

この例では、コンポーネントの`providers`配列を、`HeroDetailServiceSpy`を含む新しい配列で完全に置き換えます。

`HeroDetailServiceSpy`は、そのサービスのすべての必要な機能を偽装する
実際の`HeroDetailService`のスタブバージョンです。
下位レベルの`HeroService`に注入も委譲もしないので、
そのためのテストダブルを用意する必要はありません。

関連する`HeroDetailComponent`テストは、
`HeroDetailService`のメソッドがサービスメソッドをスパイすることによって呼び出されたことをアサートします。
したがって、スタブはそのメソッドをスパイとして実装します:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy" header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)"></code-example>

{@a override-tests}

#### テストを上書きする

テストでは、スパイスタブの`testHero`を操作してコンポーネントのヒーローを直接制御し、
サービスメソッドが呼び出されたことを確認できます。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests" header="app/hero/hero-detail.component.spec.ts (override tests)"></code-example>

{@a more-overrides}

#### さらに上書きする

`TestBed.overrideComponent`メソッドは、同じコンポーネントまたは異なるコンポーネントに対して複数回呼び出すことができます。
`TestBed`は同様の、他のクラスの部分を掘り下げて置き換えるための`overrideDirective`、`overrideModule`、
および`overridePipe`メソッドを提供します。

あなた自身のオプションと組み合わせを探しましょう。

<hr>
