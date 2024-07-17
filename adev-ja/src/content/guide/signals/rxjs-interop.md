# RxJSとの相互運用

**重要:** RxJS Interopパッケージは [開発者プレビュー](reference/releases#developer-preview) で利用可能です。お試しいただけますが、安定版になるまでは変更される可能性があります。

Angularの `@angular/core/rxjs-interop` パッケージは、[Angularシグナル](guide/signals) とRxJSのObservablesを統合するための便利なユーティリティを提供します。

## `toSignal`

`toSignal` 関数を使用して、Observableの値を追跡するシグナルを作成します。これはテンプレート内の `async` パイプと似ていますが、より柔軟で、アプリケーション内のどこでも使用できます。

```ts
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // `counterObservable` の値を表す `Signal` を取得します。
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

`async` パイプと同様に、`toSignal` はObservableをすぐに購読します。これにより副作用が発生する可能性があります。`toSignal` によって作成された購読は、`toSignal` を呼び出すコンポーネントまたはサービスが破棄されると、指定されたObservableから自動的に購読解除されます。

**重要:** `toSignal` は購読を作成します。同じObservableに対して繰り返し呼び出すことは避け、代わりに返されたシグナルを再利用してください。

### 注入コンテキスト

`toSignal` は、コンポーネントまたはサービスの構築時など、[注入コンテキスト](guide/di/dependency-injection-context) で実行する必要があります。注入コンテキストが利用できない場合は、代わりに使用する `Injector` を手動で指定できます。

### 初期値

Observableは購読時に同期的に値を生成するとは限りませんが、シグナルは常に現在の値を必要とします。`toSignal` シグナルのこの「初期」値を扱う方法はいくつかあります。

#### `initialValue` オプション

上記の例のように、Observableが初めて値を発行する前にシグナルが返す値を `initialValue` オプションで指定できます。

#### `undefined` 初期値

`initialValue` を指定しない場合、生成されたシグナルは、Observableが値を発行するまでは `undefined` を返します。これは、`async` パイプが `null` を返す動作に似ています。

#### `requireSync` オプション

`BehaviorSubject` のように、同期的に値を発行することが保証されているObservableもあります。このような場合は、`requireSync: true` オプションを指定できます。

`requiredSync` が `true` の場合、`toSignal` はObservableが購読時に同期的に値を発行することを強制します。これにより、シグナルは常に値を持ち、`undefined` 型または初期値は不要になります。

### `manualCleanup`

デフォルトでは、`toSignal` は、それを作成したコンポーネントまたはサービスが破棄されると、Observableから自動的に購読解除されます。

この動作をオーバーライドするには、`manualCleanup` オプションを渡すことができます。この設定は、自然に完了するObservableに使用できます。

### エラーと完了

`toSignal` で使用されるObservableがエラーを発生させた場合、そのエラーはシグナルが読み取られるときにスローされます。

`toSignal` で使用されるObservableが完了した場合、シグナルは完了前に発行された最後の値を返します。

## `toObservable`

`toObservable` ユーティリティを使用して、シグナルの値を追跡する `Observable` を作成します。シグナルの値は、値が変更されるとObservableに値を発行する `effect` で監視されます。

```ts
import { Component, signal } from '@angular/core';

@Component(...)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(
    switchMap(query => this.http.get('/search?q=' + query ))
  );
}
```

`query` シグナルが変更されると、`query$` Observableは最新のクエリを発行し、新しいHTTPリクエストをトリガーします。

### 注入コンテキスト

`toObservable` は、コンポーネントまたはサービスの構築時など、[注入コンテキスト](guide/di/dependency-injection-context) で実行する必要があります。注入コンテキストが利用できない場合は、代わりに使用する `Injector` を手動で指定できます。

### `toObservable` のタイミング

`toObservable` は、`ReplaySubject` 内でシグナルの値を追跡するために `effect` を使用します。購読時に、最初の値（存在する場合）は同期的に発行される可能性があり、その後のすべての値は非同期になります。

Observableとは異なり、シグナルは同期的な変更通知を提供しません。シグナルの値を複数回更新しても、`toObservable` はシグナルが安定した後にのみ値を発行します。

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

ここでは、最後の値 (3) のみがログに出力されます。

### `outputFromObservable`

`outputFromObservable(...)` は、RxJSのObservableに基づいて値を発行するAngularの出力を宣言します。

```ts
class MyDir {
  nameChange$ = new Observable<string>(/* ... */);
  nameChange = outputFromObservable(this.nameChange$); // OutputRef<string>
}
```

[output() APIガイド](/guide/components/output-fn)で詳細を確認してください。

### `outputToObservable`

`outputToObservable(...)` はAngularの出力をObservableに変換します。
これにより、Angularの出力をRxJSストリームに簡単に統合できます。

```ts
outputToObservable(myComp.instance.onNameChange)
  .pipe(...)
  .subscribe(...)
```

[output() APIガイド](/guide/components/output-fn)で詳細を確認してください。
