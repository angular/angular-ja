# NgZone

Zoneは非同期タスクにまたがって持続する実行コンテキストです。JavaScript VMの[スレッドローカル ストレージ](http://en.wikipedia.org/wiki/Thread-local_storage)と考えることができます。
このガイドでは、AngularのNgZoneを使用して、コンポーネントの変更を自動的に検出してHTMLを更新する方法を説明します。

## 変更検知の基礎

`NgZone`の利点を理解するには、変更検知とは何か、そしてどのように機能するのかを明確に把握することが重要です。

### Angularにおけるデータ更新と表示

Angularでは、HTMLテンプレートのコントロールをAngularコンポーネントのプロパティにバインドすることにより、[データを表示](guide/displaying-data) できます。

<code-example path="displaying-data/src/app/app.component.1.ts" header="src/app/app.component.ts"></code-example>

さらに、DOMイベントをAngularコンポーネントのメソッドにバインドできます。イベントをバインドしたメソッドでは、Angularコンポーネントのプロパティを更新することもできます。これにより、テンプレートに表示される対応するデータが更新されます。

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-component" header="src/app/click-me.component.ts"></code-example>

上記の例のどちらも、コンポーネントのコードはコンポーネントのプロパティのみを更新します。
しかし、それに伴ってHTMLも自動的に更新されます。
このガイドでは、Anuglarコンポーネントからのデータに基づいて、AngularがいつどのようにHTMLをレンダリングするかを説明します。


### プレーンJavaScriptを使った変更検知

どのように変更が検知され、値が更新されるのかを明確にするには、プレーンJavaScriptで書かれた次のコードを考えてみましょう。

```javascript
<html>
  <div id="dataDiv"></div>
  <button id="btn">updateData</button>
  <canvas id="canvas"></canvas>
  <script>
    let value = 'initialValue';
    // 初期レンダリング
    detectChange();

    function renderHTML() {
      document.getElementById('dataDiv').innerText = value;
    }

    function detectChange() {
      const currentValue = document.getElementById('dataDiv').innerText;
      if (currentValue !== value) {
        renderHTML();
      }
    }

    // 例 1: ボタンクリックイベントハンドラー内でのデータ更新
    document.getElementById('btn').addEventListener('click', () => {
      // 値の更新
      value = 'button update value';
      // 手動で detectChange を呼び出す
      detectChange();
    });

    // 例 2: Http Request
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      // サーバーからのレスポンスを取得する
      value = this.responseText;
      // 手動で detectChange を呼び出す
      detectChange();
    });
    xhr.open('GET', serverUrl);
    xhr.send();

    // 例 3: setTimeout
    setTimeout(() => {
      // setTimeout コールバック内での値の更新
      value = 'timeout update value';
      // 手動で detectChange を呼び出す
      detectChange();
    }, 100);

    // 例 4: Promise.then
    Promise.resolve('promise resolved a value').then(v => {
      // Promise thenコールバック内での値の更新
      value = v;
      // 手動で detectChange を呼び出す
      detectChange();
    }, 100);

    // 例 5: その他の非同期API
    document.getElementById('canvas').toBlob(blob => {
      // canvas から blob データが生成されたときの値の更新
      value = `value updated by canvas, size is ${blob.size}`;
      // 手動で detectChange を呼び出す
      detectChange();
    });
  </script>
</html>
```

データを更新した後、データが変更されたかどうかをチェックするために手動で`detectChange()`を呼び出す必要があります。
データが変更されていた場合、更新されたデータを反映するためにHTMLをレンダリングします。

Angularでは、このステップは不要です。データの更新するたびに、HTMLは自動的に更新されます。

### アプリがHTMLを更新するとき

変更検知がどのように機能するかを理解するには、まずアプリケーションがHTMLの更新を必要とするときについて考えてみましょう。通常、更新は次のいずれかの理由によって発生します。

1. コンポーネントの初期化。たとえば、Angularアプリケーションをブートストラップするとき、Angularはブートストラップコンポーネントを読み込み、 [ApplicationRef.tick()](api/core/ApplicationRef#tick)をトリガーして変更検知とビューレンダリングを呼び出します。 [データの表示](guide/displaying-data)のサンプルのように、`AppComponent`はブートストラップコンポーネントです。このコンポーネントは`title`および`myHero`プロパティを持っており、アプリケーションはこれらをHTMLにレンダリングします。

2. イベントリスナー。次の例のように、DOMイベントリスナーはAngularコンポーネントのデータを更新し、変更検知をトリガーすることもできます。

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-component" header="src/app/click-me.component.ts"></code-example>

3. Httpデータリクエスト。Httpリクエストを介してサーバーからデータを取得することもできます。

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';
  serverUrl = 'SERVER_URL';
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get(this.serverUrl).subscribe(response => {
      // user does not need to trigger change detection manually
      this.data = response.data;
    });
  }
}
```

4. `setTimeout()` または `setInterval()` などのMacroTask。`setTimeout()`のような`macroTask`のコールバック関数でデータを更新することもできます。

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';

  ngOnInit() {
    setTimeout(() => {
      // ユーザーは手動で変更検知をトリガーする必要はない
      this.data = 'value updated';
    });
  }
}
```

5. `Promise.then()`などのMicroTask。その他の非同期APIはPromiseオブジェクトを返す（`fetch`など）ため、`then()`コールバック関数もデータを更新することができます。

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';

  ngOnInit() {
    Promise.resolve(1).then(v => {
      // ユーザーは手動で変更検知をトリガーする必要はない
      this.data = 'value updated';
    });
  }
}
```

6. その他の非同期操作。`addEventListener()`や`setTimeout()`、`Promise.then()`に加え、他にも非同期にデータを更新できる操作はあります。いくつかの例には`WebSocket.onmessage()`や`Canvas.toBlob()`を含みます。

上記のリストには、アプリケーションがデータを変更する可能性があるもっとも一般的なシナリオが含まれています。Angularは、データが変更された可能性があることを検知するたびに変更検知を実行します。
変更検知の結果、DOMは新しいデータで更新されます。Angularはさまざまな方法で変更を検知します。コンポーネントの初期化では、Angularは明示的に変更検知を呼び出します。[非同期操作](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)では、AngularはZoneを使用してデータが変更された可能性のある場所の変更を検知し、自動的に変更検知を実行します。


## Zoneと実行コンテキスト

Zoneは非同期タスクにまたがって持続する実行コンテキストを提供します。[実行コンテキスト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)は、実行中の現在のコード内の環境に関する情報を保持する抽象的な概念です。次の例を考えてみましょう。

```javascript
const callback = function() {
  console.log('setTimeout callback context is', this);
}

const ctx1 = { name: 'ctx1' };
const ctx2 = { name: 'ctx2' };

const func = function() {
  console.log('caller context is', this);
  setTimeout(callback);
}

func.apply(ctx1);
func.apply(ctx2);
```

`setTimeout()`のコールバック内の`this`の値は、`setTimeout()`がいつ呼び出されるかによって異なる場合があります。
したがって、非同期操作内のコンテキストを見失ってしまう可能性があります。

Zoneは`this`以外の新しいZoneコンテキストを提供します。そのZoneコンテキストは非同期操作にまたがって持続します。
次の例では、新しいZoneコンテキストを`zoneThis`としています。

```javascript
zone.run(() => {
  // Zone内です
  expect(zoneThis).toBe(zone);
  setTimeout(function() {
    // setTimeoutがスケジュールされているとき、
    // zoneThisコンテキストは同じZoneになります
    expect(zoneThis).toBe(zone);
  });
});
```

この新しいコンテキスト`zoneThis`は、`setTimeout()`コールバック関数から取得することができます。このコンテキストは、`setTimeout()`がスケジュールされているとき、同じものです。
コンテキストを取得するには、[`Zone.current`](https://github.com/angular/angular/blob/master/packages/zone.js/lib/zone.ts)を呼び出すことができます。

## Zoneと非同期ライフサイクルフック

Zone.jsは、非同期操作にライフサイクルフックを提供するだけでなく、非同期操作にまたがって持続するコンテキストを作成できます。

```javascript
const zone = Zone.current.fork({
  name: 'zone',
  onScheduleTask: function(delegate, curr, target, task) {
    console.log('new task is scheduled:', task.type, task.source);
    return delegate.scheduleTask(target, task);
  },
  onInvokeTask: function(delegate, curr, target, task, applyThis, applyArgs) {
    console.log('task will be invoked:', task.type, task.source);
    return delegate.invokeTask(target, task, applyThis, applyArgs);
  },
  onHasTask: function(delegate, curr, target, hasTaskState) {
    console.log('task state changed in the zone:', hasTaskState);
    return delegate.hasTask(target, hasTaskState);
  },
  onInvoke: function(delegate, curr, target, callback, applyThis, applyArgs) {
    console.log('the callback will be invoked:', callback);
    return delegate.invoke(target, callback, applyThis, applyArgs);
  }
});
zone.run(() => {
  setTimeout(() => {
    console.log('timeout callback is invoked.');
  });
});
```

上記の例ではいくつかのフックを備えたZoneを作成します。

`onXXXTask`フックは、タスクの状態が変化したときにトリガーされます。
*Zoneタスク* の概念は、JavaScript VMのタスクの概念とよく似ています。
- `macroTask`: `setTimeout()`など
- `microTask`: `Promise.then()`など
- `eventTask`: `element.addEventListener()`など

次に挙げるフックは、次の状況においてトリガーされます。

- `onScheduleTask`: 新しい非同期タスクがスケジュールされたときにトリガーされます。たとえば`setTimeout()`を呼び出したときです。
- `onInvokeTask`: 非同期タスクが実行されるときにトリガーされます。たとえば`setTimeout()`のコールバックが実行されるときです。
- `onHasTask`: Zone内の1種類のタスクの状態が、"stable"から"unstable"、または"unstable"から"stable"へ変化したときにトリガーされます。"stable"状態はZone内にタスクがないことを意味し、"unstable"状態はZone内で新しいタスクがスケジュールされていることを意味します。
- `onInvoke`: Zone内で同期関数が実行されるときにトリガーされます。

これらのフックを用いて、`Zone`はZone内のすべての同期および非同期の操作の状態を監視することができます。

上記の例では、次のようなアウトプットを返します。

```
the callback will be invoked: () => {
  setTimeout(() => {
    console.log('timeout callback is invoked.');
  });
}
new task is scheduled: macroTask setTimeout
task state changed in the zone: { microTask: false,
  macroTask: true,
  eventTask: false,
  change: 'macroTask' }
task will be invoked macroTask: setTimeout
timeout callback is invoked.
task state changed in the zone: { microTask: false,
  macroTask: false,
  eventTask: false,
  change: 'macroTask' }
```

`Zone`のすべての機能は、[Zone.js](https://github.com/angular/angular/tree/master/packages/zone.js/README.md)というライブラリによって提供されています。
このライブラリは、モンキーパッチを介して非同期APIをインターセプトすることにより、それらの特徴を実装しています。
モンキーパッチは、ソースコードを変更せずに、実行時に機能のデフォルトの動作を追加または変更するテクニックです。

## NgZone

Zone.jsは同期および非同期操作のすべての状態を監視できますが、AngularはさらにNgZoneと呼ばれるサービスを提供します。
このサービスは、`angular`という名前のZoneを作成し、次の条件が満たされたときに自動的に変更検知をトリガーします。

1. 同期および非同期関数が実行されたとき
1. スケジュールされた`microTask`がないとき

### NgZone `run()` と `runOutsideOfAngular()`

`Zone`は`setTimeout()`, `Promise.then()`, `addEventListener()`など、ほとんどの非同期APIを処理します。
すべての一覧は、[Zone Module document](https://github.com/angular/angular/blob/master/packages/zone.js/MODULE.md)を参照してください。
このため、これらの非同期APIについては、手動で変更検知をトリガーする必要はありません。

Zoneが処理しないサードパーティのAPIもまだあります。
これらのケースでは、`NgZone`サービスは[`run()`](api/core/NgZone#run)メソッドを提供し、angular Zoneの中で関数を実行できるようにします。
この関数および関数内で実行されるすべての非同期操作は、適切なタイミングで自動的に変更検知をトリガーします。

```typescript
export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // 新しい非同期APIはZoneで処理されません。
    // そのため、ngZone.runを使用してangular Zone内で非同期操作を行い、
    // 自動的に変更検知をトリガーする必要があります。
    this.ngZone.run(() => {
      someNewAsyncAPI(() => {
        // コンポーネントのデータを更新
      });
    });
  }
}
```

デフォルトでは、すべての非同期操作はangular Zoneの中にあり、自動的に変更検知をトリガーします。
もうひとつの一般的なケースは、変更検知をトリガーしたくない場合です。
その状況では、`NgZone`のもうひとつのメソッド、[`runOutsideAngular()`](api/core/NgZone#runoutsideangular)を使用できます。

```typescript
export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // この操作でデータが変更されないことがわかっており、
    // 変更検知を行いたくない場合は、
    // runOutsideAngularを呼び出すことができます。
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // コンポーネントのデータを更新
        // ただし変更検知をトリガーしない
      });
    });
  }
}
```

### Zone.jsのセットアップ

Zone.jsをAngularで利用できるようにするには、`zone.js`パッケージをインポートする必要があります。
Angular CLIを使用している場合はこのステップは自動で行われ、`src/polyfills.ts`に次の行が表示されます。

```typescript
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone';  // Angular CLIに含まれます
```

`zone.js`パッケージをインポートする前に、次の構成をセットすることができます。

- よりよいパフォーマンスのために、いくつかの非同期APIのモンキーパッチを無効にすることができます。
たとえば、`requestAnimationFrame()`のモンキーパッチを無効にすることで、`requestAnimationFrame()`のコールバックは変更検知をトリガーしません。
これは、アプリケーション内において`requestAnimationFrame()`のコールバックが何もデータを更新しない場合に便利です。
- 特定のDOMイベントがangular Zone内で実行されないように指定できます。たとえば、`mousemove`または`scroll`イベントが変更検知をトリガーすることを防ぐためです。

変更できる設定は他にもいくつかあります。
これらの変更を行うには、次のような`zone-flags.ts`ファイルを作成する必要があります。

```typescript
 // requestAnimationFrameのパッチを無効化する
 (window as any).__Zone_disable_requestAnimationFrame = true;

 // 指定したeventNamesのパッチを無効化する
 (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove'];
```

次に、`polyfills.ts`で`zone.js`をインポートする前に`zone-flags`をインポートします。

```typescript
/***************************************************************************************************
 * Zone JS is required by default for Angular.
 */
import `./zone-flags`;
import 'zone.js/dist/zone';  // Angular CLIに含まれます
```

設定できるものの詳細については、[Zwone.js](https://github.com/angular/angular/tree/master/packages/zone.js)ドキュメントを参照してください。

### NoopZone

`Zone`は、Angularが変更検知をトリガーするタイミングを知るのを補助し、開発者がアプリケーション開発に集中できるようにします。
デフォルトで`Zone`は読み込まれ、追加の設定をすることなく動作します。しかし、Angularを動作させるために`Zone`を使用する必要はなく、かわりに自分で変更検知をトリガーすることも選択できます。

<div class="alert is-helpful">

<h4><code>Zone</code>の無効化</h4>

**`Zone`を無効化する場合、すべての変更検知を自分で適切なタイミングにトリガーする必要があり、変更検知に関する包括的な知識が必要です。**

</div>

Zone.jsを削除するには、次のように変更します。

1. `polyfills.ts`から`zone.js`のインポートを削除します。

  ```typescript
  /***************************************************************************************************
   * Zone JS is required by default for Angular itself.
   */
  // import 'zone.js/dist/zone';  // Angular CLIに含まれます
  ```

2. `src/main.ts`で`noop` zoneを使用してAngularをブートストラップします。

  ```typescript
  platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
    .catch(err => console.error(err));
  ```
