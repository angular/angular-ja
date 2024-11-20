<docs-decorative-header title="Angularシグナル" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angularシグナルは、アプリケーション全体で状態がどのように使用されているかを細かく追跡するシステムであり、フレームワークがレンダリングの更新を最適化することを可能にします。
</docs-decorative-header>

Tip: この包括的なガイドを読む前に、Angularの[基本概念](essentials/signals)をご覧ください。

## シグナルとは何か？

**シグナル**は、値が変更されたときに興味のあるコンシューマーに通知する、値をラップしたものです。シグナルは、プリミティブから複雑なデータ構造まで、あらゆる値を含めることができます。

シグナルの値は、そのゲッター関数を呼び出すことで読み取ることができます。これは、Angularがシグナルがどこで使用されているかを追跡することを可能にします。

シグナルは、*書き込み可能*または*読み取り専用*のいずれかになります。

### 書き込み可能なシグナル

書き込み可能なシグナルは、値を直接更新するためのAPIを提供します。書き込み可能なシグナルは、シグナルの初期値を指定して`signal`関数を呼び出すことで作成します。

```ts
const count = signal(0);

// シグナルはゲッター関数です - 関数を呼び出すことで値を読み取ります。
console.log('The count is: ' + count());
```

書き込み可能なシグナルの値を変更するには、`.set()`で直接設定します。

```ts
count.set(3);
```

または、`.update()`メソッドを使用して、前の値から新しい値を計算します。

```ts
// カウントを1増やす。
count.update(value => value + 1);
```

書き込み可能なシグナルは、`WritableSignal`という型になります。

### 算出シグナル

**算出シグナル**は、他のシグナルから値を派生させる読み取り専用のシグナルです。算出シグナルは、`computed`関数を使用して、派生を指定することで定義します。

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

`doubleCount` シグナルは、`count` シグナルに依存しています。`count`が更新されるたびに、Angularは`doubleCount`も更新する必要があることを認識します。

#### 算出シグナルは、遅延評価とメモ化が行われる

`doubleCount`の派生関数は、最初に`doubleCount`を読み取るまで、その値を計算するために実行されません。計算された値はキャッシュされ、`doubleCount`を再び読み取ると、再計算せずにキャッシュされた値が返されます。

その後、`count`を変更すると、Angularは`doubleCount`のキャッシュされた値がもはや有効ではなくなり、次に`doubleCount`を読み取るときに新しい値が計算されることを認識します。

その結果、配列のフィルタリングなど、計算量が多い派生を算出シグナルで安全に実行できます。

#### 算出シグナルは、書き込み可能なシグナルではない

算出シグナルに値を直接割り当てることはできません。つまり、

```ts
doubleCount.set(3);
```

はコンパイルエラーになります。なぜなら、`doubleCount`は`WritableSignal`ではないからです。

#### 算出シグナルの依存関係は動的である

派生中に実際に読み取られたシグナルのみが追跡されます。たとえば、この`computed`では、`count` シグナルは`showCount` シグナルが真の場合にのみ読み取られます。

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

`conditionalCount`を読み取ると、`showCount`が偽の場合、`count` シグナルを読み取ることなく、「Nothing to see here!」というメッセージが返されます。これは、後で`count`を更新しても、`conditionalCount`のキャッシュされた値は再計算されないことを意味します。

`showCount`を真に設定して`conditionalCount`を再び読み取ると、派生が再実行されます。`showCount`が真のブランチに移り、`count`の値を示すメッセージが返されます。その後、`count`を変更すると、`conditionalCount`のキャッシュされた値が無効になります。

依存関係は、派生中に追加されるだけでなく、削除されることもできます。後で`showCount`を再び偽に設定すると、`count`は`conditionalCount`の依存関係として扱われなくなります。

## `OnPush`コンポーネントでのシグナルの読み取り

`OnPush`コンポーネントのテンプレート内でシグナルを読み取ると、Angularはシグナルをそのコンポーネントの依存関係として追跡します。そのシグナルの値が変更されると、Angularは自動的にコンポーネントを[マーク](api/core/ChangeDetectorRef#markforcheck)して、次に変更検知が実行されたとき更新されるようにします。`OnPush`コンポーネントの詳細については、[コンポーネントのサブツリーをスキップする](best-practices/skipping-subtrees)ガイドを参照してください。

## エフェクト

シグナルは、変更時に興味のあるコンシューマーへ通知するのに役立ちます。**エフェクト**は、1つ以上のシグナル値が変更されたときに実行される操作です。`effect`関数を使用してエフェクトを作成できます。

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

エフェクトは常に**少なくとも1回**実行されます。エフェクトが実行されると、シグナル値の読み取りをすべて追跡します。これらのシグナル値のいずれかが変更されると、エフェクトが再び実行されます。算出シグナルと同様に、エフェクトは依存関係を動的に追跡し、最新の処理で読み取られたシグナルのみを追跡します。

エフェクトは常に変更検知プロセス中に**非同期**で実行されます。

### エフェクトのユースケース

エフェクトは、ほとんどのアプリケーションコードでは必要ありませんが、特定の状況では役立つ場合があります。以下は、`effect`が適切なソリューションとなる状況の例です。

* 表示されているデータとその変更をログに記録する。これは、分析やデバッグツールの目的で行います。
* データを`window.localStorage`と同期させる。
* テンプレート構文では表現できないカスタムDOM動作を追加する。
* `<canvas>`、チャートライブラリ、またはその他のサードパーティUIライブラリにカスタムレンダリングを実行する。

<docs-callout critical title="エフェクトを使用しない場合">
状態変更の伝播にエフェクトを使用することは避けてください。これは、`ExpressionChangedAfterItHasBeenChecked`エラー、無限の循環更新、または不要な変更検知サイクルが発生する可能性があります。

代わりに、`computed` シグナルを使用して、他の状態に依存する状態をモデル化してください。
</docs-callout>

### 注入コンテキスト

デフォルトでは、[インジェクションコンテキスト](guide/di/dependency-injection-context)内（`inject`関数にアクセスできる場所）でのみ`effect()`を作成できます。この要件を満たす最も簡単な方法は、コンポーネント、ディレクティブ、またはサービスの`constructor`内で`effect`を呼び出すことです。

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    // 新しいEffectを登録する。
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

または、エフェクトをフィールドに割り当てることができます（これにより、説明的な名前も付けられます）。

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);

  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}
```

コンストラクターの外でエフェクトを作成するには、`Injector`を`effect`に渡すことができます。これは、`effect`のオプションを使用して行います。

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor(private injector: Injector) {}

  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }, {injector: this.injector});
  }
}
```

### エフェクトの破棄

エフェクトを作成すると、それが含まれているコンテキストが破棄されると、自動的に破棄されます。つまり、コンポーネント内で作成されたエフェクトは、コンポーネントが破棄されると破棄されます。ディレクティブ、サービスなどでも同じです。

エフェクトは`EffectRef`を返し、これを用いて`destroy()`メソッドを呼び出して手動で破棄できます。これと`manualCleanup`オプションを組み合わせることで、手動で破棄されるまで続くエフェクトを作成できます。不要になったエフェクトは確実にクリーンアップしてください。

## 詳細なトピック

### シグナルの等価関数

シグナルを作成する際には、オプションで等価関数を指定できます。これは、新しい値が前の値と実際に異なるかどうかを確認するために使用されます。

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// これは別の配列インスタンスですが、
// 深い等価関数を使用することで値は等しいと判断され、
// シグナルは更新をトリガーしません。
data.set(['test']);
```

等価関数は、書き込み可能なシグナルと算出シグナルの両方に指定できます。

HELPFUL: デフォルトでは、シグナルは参照の等価性（[`Object.is()`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比較）を使用します。

### 依存関係を追跡せずに読み取る

まれに、`computed`や`effect`などのリアクティブ関数内でシグナルを読み取るコードを実行する必要があり、依存関係を作成しない場合があります。

たとえば、`currentUser`が変更されたときに、`counter`の値をログに記録する必要があるとします。両方のシグナルを読み取る`effect`を作成できます。

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

この例では、`currentUser`または`counter`のいずれかが変更されると、メッセージがログに記録されます。しかし、`currentUser`のみが変更されたときにエフェクトを実行する必要がある場合、`counter`の読み取りは単なる付随的なものであり、`counter`が変更されても新しいメッセージはログに記録されるべきではありません。

シグナルのゲッターを`untracked`で呼び出すことで、シグナルの読み取りが追跡されないようにできます。

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

`untracked`は、エフェクトが、依存関係として扱われない外部のコードを呼び出す必要がある場合にも役立ちます。

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // `loggingService`がSignalを読み取っても、
    // このEffectの依存関係として扱われません。
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### エフェクトのクリーンアップ関数

エフェクトは長時間実行される操作を開始する可能性があります。これは、エフェクトが破棄された場合、または最初の操作が完了する前にエフェクトが再び実行された場合はキャンセルする必要があります。エフェクトを作成する際に、関数はオプションで最初の引数として`onCleanup`関数を許可できます。この`onCleanup`関数は、エフェクトの次回の実行が始まる前に、もしくはエフェクトが破棄されたときに呼び出されるコールバックを登録できます。

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

## RxJSとシグナルを併用する

シグナルとRxJSの相互運用性の詳細については、[RxJSとAngularシグナルの相互運用](ecosystem/rxjs-interop) を参照してください。
