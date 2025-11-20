# 算出シグナルで状態を派生させる

[シグナルの作成と更新方法](/tutorials/signals/1-creating-and-updating-your-first-signal)を学んだところで、算出シグナルについて学びましょう。算出シグナルは、依存関係が変更されると自動的に更新される派生値です。他のシグナルに基づいてリアクティブな計算を作成するのに最適です。

このアクティビティでは、`computed()`関数を使用して、基になるシグナルが変更されたときに自動的に更新される派生状態を作成する方法を学びます。

ユーザーの状態シグナルから情報を派生させる算出値を追加して、ユーザーの状態システムを強化しましょう。スターターコードには、`'online'`、`'away'`、`'offline'`の3つの状態オプションが含まれています。

<hr />

<docs-workflow>

<docs-step title="computed関数をインポートする">
既存のインポートに`computed`を追加します。

```ts
// Add computed to existing imports
import {Component, signal, computed, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="通知用の算出シグナルを作成する">
ユーザーの状態に基づいて通知を有効にするかどうかを決定する算出シグナルを追加します。

```ts
notificationsEnabled = computed(() => this.userStatus() === 'online');
```

この算出シグナルは、`userStatus`シグナルが変更されるたびに自動的に再計算されます。computed関数内で`this.userStatus()`を呼び出してシグナルの値を読み取っていることに注目してください。
</docs-step>

<docs-step title="説明メッセージ用の算出シグナルを作成する">
ユーザーの状態に基づいて説明メッセージを作成する算出シグナルを追加します。

```ts
statusMessage = computed(() => {
  const status = this.userStatus();
  switch (status) {
    case 'online': return 'Available for meetings and messages';
    case 'away': return 'Temporarily away, will respond soon';
    case 'offline': return 'Not available, check back later';
    default: return 'Status unknown';
  }
});
```

これは、算出シグナルがswitch文や文字列変換を使用して、より複雑なロジックを処理できることを示しています。
</docs-step>

<docs-step title="勤務時間内の利用可能性を計算する算出シグナルを作成する">
ユーザーが勤務時間内であるかどうかを計算する算出シグナルを追加します。

```ts
isWithinWorkingHours = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const isWeekday = now.getDay() > 0 && now.getDay() < 6;
  return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
});
```

これは、算出シグナルが計算し、複数のデータソースを組み合わせることができることを示しています。`userStatus`が変更されると、値は自動的に更新されます。
</docs-step>

<docs-step title="テンプレートに算出値を表示する">
テンプレートにはすでに「Loading...」と表示されるプレースホルダーがあります。これらを算出シグナルに置き換えてください。

1. 通知については、`Loading...`を@ifブロックに置き換えます。

```angular-html
@if (notificationsEnabled()) {
  Enabled
} @else {
  Disabled
}
```

2. メッセージについては、`Loading...`を以下に置き換えます。

```angular-html
{{ statusMessage() }}
```

3. 勤務時間については、`Loading...`を@ifブロックに置き換えます。

```angular-html
@if (isWithinWorkingHours()) {
  Yes
} @else {
  No
}
```

算出シグナルは、通常のシグナルと同様に括弧を付けて呼び出されることに注目してください！
</docs-step>

</docs-workflow>

素晴らしい！これで算出シグナルの作成方法を学びました。

覚えておくべき重要な点がいくつかあります。

- **算出シグナルはリアクティブです**: 依存関係が変更されると自動的に更新されます
- **読み取り専用です**: 算出値を直接設定できません。これらは他のシグナルから派生します
- **複雑なロジックを含めることができます**: 計算、変換、派生状態に使用します
- **動的な状態に基づいてパフォーマンスの高い計算を提供します**: Angularは、依存関係が実際に変更された場合にのみ再計算します

次のレッスンでは、[linkedSignalsで状態を派生させる別の方法](/tutorials/signals/3-deriving-state-with-linked-signals)について学びます！
