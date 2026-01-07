<docs-decorative-header title="Angularシグナル" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angularシグナルは、アプリケーション全体で状態がどのように使用されているかを細かく追跡するシステムであり、フレームワークがレンダリングの更新を最適化することを可能にします。
</docs-decorative-header>

TIP: この包括的なガイドを読む前に、Angularの[基本概念](essentials/signals)をご覧ください。

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
count.update((value) => value + 1);
```

書き込み可能なシグナルは、`WritableSignal`という型になります。

#### 書き込み可能なシグナルを読み取り専用に変換する

`WritableSignal`は、シグナルの読み取り専用バージョンを返す`asReadonly()`メソッドを提供します。これは、シグナルの値をコンシューマーに公開したいが、直接変更できないようにしたい場合に便利です。

```ts
@Injectable({providedIn: 'root'})
export class CounterState {
  // プライベートな書き込み可能な状態
  private readonly _count = signal(0);

  readonly count = this._count.asReadonly(); // パブリックな読み取り専用

  increment() {
    this._count.update((v) => v + 1);
  }
}

@Component({
  /* ... */
})
export class AwesomeCounter {
  state = inject(CounterState);

  count = this.state.count; // 読み取りはできるが変更はできない

  increment() {
    this.state.increment();
  }
}
```

読み取り専用のシグナルは、元の書き込み可能なシグナルへの変更を反映しますが、`set()`または`update()`メソッドを使用して変更できません。

IMPORTANT: 読み取り専用のシグナルには、その値の深い変更を防ぐ組み込みのメカニズムは**ありません**。

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

## リアクティブコンテキスト

**リアクティブコンテキスト**は、Angularがシグナルの読み取りを監視して依存関係を確立する実行時の状態です。シグナルを読み取るコードは_コンシューマー_であり、読み取られるシグナルは_プロデューサー_です。

Angularは次の場合に自動的にリアクティブコンテキストに入ります:

- `effect`、`afterRenderEffect`のコールバックを実行する
- `computed`シグナルを評価する
- `linkedSignal`を評価する
- `resource`のparamsまたはloader関数を評価する
- コンポーネントテンプレートをレンダリングする([ホストプロパティ](guide/components/host-elements#binding-to-the-host-element)のバインディングを含む)

これらの操作中、Angularは_ライブ_接続を作成します。追跡されたシグナルが変更されると、Angularは_最終的に_コンシューマーを再実行します。

### リアクティブコンテキストをアサートする

Angularは、コードがリアクティブコンテキスト内で実行されていないことをアサートするための`assertNotInReactiveContext`ヘルパー関数を提供します。呼び出し元の関数への参照を渡すことで、アサーションが失敗した場合、エラーメッセージが正しいAPIエントリポイントを指すようにします。これにより、一般的なリアクティブコンテキストエラーよりも明確でアクションにつながるエラーメッセージが生成されます。

```ts
import {assertNotInReactiveContext} from '@angular/core';

function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // 安全に続行 - サブスクリプションロジックをここに
}
```

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

## 高度な派生 {#advanced-derivations}

`computed`はシンプルな読み取り専用の派生を処理しますが、他のシグナルに依存する書き込み可能な状態が必要な場合があります。
詳細については、[linkedSignalによる依存状態](/guide/signals/linked-signal)ガイドを参照してください。

すべてのシグナルAPIは同期的です—`signal`、`computed`、`input`など。しかし、アプリケーションは非同期に利用可能なデータを扱う必要があることがよくあります。`Resource`は、非同期データをアプリケーションのシグナルベースのコードに組み込み、そのデータに同期的にアクセスできるようにする方法を提供します。詳細については、[リソースによる非同期リアクティビティ](/guide/signals/resource)ガイドを参照してください。

## 非リアクティブAPIでの副作用の実行 {#executing-side-effects-on-non-reactive-apis}

状態の変更に反応したい場合、同期または非同期の派生が推奨されます。しかし、これがすべての可能なユースケースをカバーするわけではなく、非リアクティブAPIでシグナルの変更に反応する必要がある状況に遭遇することがあります。これらの特定のユースケースには、`effect`または`afterRenderEffect`を使用してください。詳細については、[非リアクティブAPIの副作用](/guide/signals/effect)ガイドを参照してください。

## `OnPush`コンポーネントでのシグナルの読み取り {#reading-signals-in-onpush-components}

`OnPush`コンポーネントのテンプレート内でシグナルを読み取ると、Angularはシグナルをそのコンポーネントの依存関係として追跡します。そのシグナルの値が変更されると、Angularは自動的にコンポーネントを[マーク](api/core/ChangeDetectorRef#markforcheck)して、次に変更検知が実行されたとき更新されるようにします。`OnPush`コンポーネントの詳細については、[コンポーネントのサブツリーをスキップする](best-practices/skipping-subtrees)ガイドを参照してください。

## 詳細なトピック {#advanced-topics}

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

### シグナルの型チェック

`isSignal`を使用して、値が`Signal`かどうかをチェックできます:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isSignal(count); // true
isSignal(doubled); // true
isSignal(42); // false
```

シグナルが書き込み可能かどうかを具体的にチェックするには、`isWritableSignal`を使用します:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isWritableSignal(count); // true
isWritableSignal(doubled); // false
```

## RxJSとシグナルを併用する

シグナルとRxJSの相互運用性の詳細については、[RxJSとAngularシグナルの相互運用](ecosystem/rxjs-interop) を参照してください。
