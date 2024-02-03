# Angular Signals

**Angular Signals**は、アプリケーションのどこでどのように状態が使用されているかを細かく追跡するシステムで、
フレームワークがレンダリングの更新を最適化できるようにします。

## Signal とは何か？

**Signal** は、値が変化したときに関心をもつ利用者に対して通知できる、値のラッパーです。

Signalの値は常にgetter関数を通して読み取られるため、AngularはSignalがどこで使用されたかを追跡できます。

Signalは、_書き込み可能_または_読み取り専用_のいずれかになります。

### 書き込み可能Signal

書き込み可能Signalは、その値を直接更新するためのAPIを提供します。書き込み可能Signalを作成するには、初期値を指定して `signal` 関数を呼び出します：

```ts
const count = signal(0);

// Signalはgetter関数で、これを呼び出すと値が読み取られます。
console.log('The count is: ' + count());
```

直接 `.set()` することで、書き込み可能Signalの値を変更できます。

```ts
count.set(3);
```

あるいは、`.update()` 使用して、前の値から新しい値を計算します。

```ts
// カウントを1だけ増加させます。
count.update(value => value + 1);
```

書き込み可能Signalは `WritableSignal` という型を持っています。

### 算出Signal

**算出Signal**は、他のSignalから派生する値を持ちます。`computed` を使用して、生成関数を指定して定義します。

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

`doubleCount` Signalは `count` に依存します。`count` が更新されるたびに、Angular は `count` と `doubleCount` のいずれかに依存するものも更新する必要があることを知ります。

#### 算出Signalは遅延評価とメモ化の両方を行う

`doubleCount`の生成関数は、`doubleCount`がはじめて読み取られるまで実行されません。計算されたらこの値はキャッシュされ、その後の`doubleCount`の読み取りは、再計算せずにキャッシュされた値を返します。

`count`が変更されると、`doubleCount`にキャッシュされた値が無効であることを伝え、`doubleCount`の次の読み取り時に値が再計算されます。

結果として、配列のフィルタリングなど、計算コストの高い処理を算出Signalで安全に実行できます。

#### 算出Signalは書き込み可能Signalではない

算出Signalに値を直接割り当てることはできません。

```ts
doubleCount.set(3);
```

これは、`doubleCount`が `WritableSignal` ではないため、コンパイルエラーになります。

#### 算出Signalの依存関係は動的である

算出時に実際に読み込まれたSignalのみが追跡されます。たとえば、この計算では `count` Signalは条件付きでしか読み込まれていません:

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

`conditionalCount`を読み込む際、`showCount`が`false`の場合、`count`シグナルを読み込まずに "Nothing to see here!"というメッセージを返します。つまり、`count`を更新しても再計算されることはありません。

その後 `showCount` を `true` に設定して `conditionalCount` を再度読み込むと算出処理は再実行され、 `showCount` が `true` である分岐をとり、`count` の値を示すメッセージを返します。`count`を変更すると、`conditionalCount`のキャッシュされた値は無効化されます。

依存関係は追加だけでなく、削除も可能であることに注意してください。後に `showCount` が再び `false` に設定された場合、`count` はもはや `conditionalCount` の依存関係とみなされません。

## `OnPush` コンポーネントでシグナルを読み取る

`OnPush`コンポーネントがテンプレートでSignalの値を使用すると、Angularはそのコンポーネントの依存関係としてSignalを追跡します。`OnPush`コンポーネントの詳細については、[Skipping component subtrees](/guide/change-detection-skipping-subtrees) ガイドを参照してください。

## Effect

Signalが役立つのは、それが変化したときに関心のある利用者に対して通知できるためです。 **Effect** は、1つまたは複数のSignalの値が変化するたびに実行される操作です。`effect`関数で Effect を作成します:

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effectは**少なくとも1回は**必ず実行される。Effect が実行されると、読み取った任意の Signal の値を追跡します。これらのSignalの値が変化するたびに、Effectが再度実行されます。算出Signalと同様に、Effectは依存関係を動的に追跡し、直近の実行で読み込まれたSignalのみを追跡します。

Effectは常に**非同期的**に、変更検知のプロセス中に実行されます。

Note: `effect()`APIはまだ[開発者プレビュー](/guide/releases#developer-preview)であり、シグナルベースのリアクティビティをコアフレームワークに統合するための作業中です。

### Effectのユースケース

Effect は、大部分のアプリケーションコードではほとんど必要とされませんが、特定の状況下では役に立つことがあります。以下は、`effect`がよい解決策となるような状況の例です：

* 表示されているデータと、それが変化したときのログを、解析やデバッグのために記録する。
* `window.localStorage`とデータを同期させる。
* テンプレート構文で表現できない独自の DOM の振る舞いを追加する。
* `<canvas>`、チャートライブラリ、その他のサードパーティ製UIライブラリへのカスタムレンダリングを実行する。

#### Effectを使用すべきでない状況

状態変化の伝達に Effect を使用しないでください。その結果、`ExpressionChangedAfterItHasBeenChecked`エラー、無限の循環更新、または不必要な変更検知サイクルが発生することがあります。

このようなリスクがあるため、EffectではSignalの書き込みはデフォルトで禁止されていますが、どうしても必要な場合は有効にすることができます。

### インジェクションコンテキスト

デフォルトでは、`effect()`関数で新しいエフェクトを登録するには、「[インジェクションコンテキスト](/guide/dependency-injection-context)」（`inject`関数へのアクセス）が必要です。これを提供するもっとも簡単な方法は、コンポーネント、ディレクティブ、またはサービスの `constructor` の中で `effect` を呼び出すことです：

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    });
  }
}
```

また、Effectをフィールドに割り当てることもできます（この場合、Effectに説明的な名前を付けることもできます）。

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()})`);
  });
}
```

コンストラクターの外で Effect を作成するには、`Injector` をオプションで `effect` に渡します：

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  constructor(private injector: Injector) {}

  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    }, {injector: this.injector});
  }
}
```

### Effect の破棄

Effect を作成すると、それを包含するコンテキストが破棄されたときに、自動的に破棄されます。つまり、コンポーネント内で作成されたEffectは、コンポーネントが破棄された時点で破棄されます。ディレクティブやサービスなどの中のEffectも同様です。

Effectは `EffectRef` を返し、それを使って `.destroy()` 操作によって手動でエフェクトを破棄することもできます。また、`manualCleanup`オプションと組み合わせることで、手動で破壊するまで持続するEffectを作成することもできます。このようなEffectが不要になった場合は、必ずクリーンアップするように注意してください。

## 高度なトピック

### Signal の等価関数

Signal を作成する際、オプションで等価関数を指定することができ、この関数は新しい値が前の値と実際に異なるかどうかをチェックするために使用されます。

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

書き込み可能Signal と算出Signalの両方に対して等価関数を設定できます。

### 依存関係を追跡せずに読み取る

まれに、`computed`や`effect`のようなリアクティブ関数でSignalを読み込むようなコードを、依存関係を作成せずに実行したいことがあります。

たとえば、`currentUser`が変化したときに、`counter`の値をログに記録する必要があるとします。両方のSignalを読み取る `effect` を作成します:

```ts
effect(() => {
  console.log(`User set to `${currentUser()}` and the counter is ${counter()}`);
});
```

この例では、`currentUser`または`counter`のどちらかが変更されたときにメッセージをログに記録します。しかし、もし `currentUser` が変更されたときだけ実行されるのであれば、`counter` の読み取りは付随的なものに過ぎず、`counter` の変更によって新しいメッセージが記録されるべきではありません。

Signal の getter を `untracked` で呼び出すことで、読み込んだ Signal が追跡されないようにできます：

```ts
effect(() => {
  console.log(`User set to `${currentUser()}` and the counter is ${untracked(counter)}`);
});
```

`untracked`は、Effectが依存関係として扱われるべきでない外部コードを呼び出す必要がある場合にも便利です：

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### Effectのクリーンアップ関数

Effect は長時間実行されるオペレーションを開始する可能性があり、最初のオペレーションが終了する前に Effect が破棄されたり、再度実行された場合にキャンセルされることがあります。Effect を作成するとき、その関数はオプションで `onCleanup` 関数を第一引数として受け取ることができます。この `onCleanup` 関数は、Effectの次の実行が始まる前、またはエフェクトが破棄されたときに呼び出されるコールバックを登録できます。

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

@reviewed 2023-06-21
