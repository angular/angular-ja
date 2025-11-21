# effectでシグナル変更に反応する

[シグナルクエリで子要素をクエリする](/tutorials/signals/9-query-child-elements-with-signal-queries)方法を学んだところで、effectでシグナル変更に反応する方法を探ってみましょう。effectは、依存関係が変更されると自動的に実行される関数であり、ロギング、DOM操作、API呼び出しなどの副作用に最適です。

**Important: effectは、最後に頼るべきAPIです。** 派生値には常に`computed()`を、派生と手動設定の両方が可能な値には`linkedSignal()`を優先してください。effectを使ってあるシグナルから別のシグナルにデータをコピーしていることに気づいたら、それは真の情報源をより上位に移動し、代わりに`computed()`または`linkedSignal()`を使用すべきであるという兆候です。effectは、シグナル状態を命令型で非シグナルなAPIに同期させるのに最適です。

このアクティビティでは、シグナル変更に応答する正当な副作用に対して`effect()`関数を適切に使用する方法を学びます。

<hr />

シグナルがすでに設定されているテーママネージャーアプリケーションがあります。次に、シグナル変更に自動的に反応するようにeffectを追加します。

<docs-workflow>

<docs-step title="Import effect function">
既存のインポートに`effect`を追加します。

```ts
// Add effect to existing imports
import {Component, signal, computed, effect, ChangeDetectionStrategy} from '@angular/core';
```

`effect`関数は、読み取ったシグナルが変更されると自動的に実行されるリアクティブな副作用を作成します。
</docs-step>

<docs-step title="Create an effect for local storage">
テーマが変更されたときに自動的にローカルストレージに保存するeffectを追加します。

```ts
constructor() {
  // Save theme to localStorage whenever it changes
  effect(() => {
    localStorage.setItem('theme', this.theme());
    console.log('Theme saved to localStorage:', this.theme());
  });
}
```

このeffectは、テーマシグナルが変更されるたびに実行され、ユーザーの設定を自動的に永続化します。
</docs-step>

<docs-step title="Create an effect for logging user activity">
ユーザーがログインまたはログアウトしたときにログを記録するeffectを追加します。

```ts
constructor() {
  // ... previous effect

  // Log user activity changes
  effect(() => {
    const status = this.isLoggedIn() ? 'logged in' : 'logged out';
    const user = this.username();
    console.log(`User ${user} is ${status}`);
  });
}
```

このeffectは、effectが複数のシグナルを読み取り、それらのいずれかの変更に反応できることを示しています。
</docs-step>

<docs-step title="Create an effect with cleanup">
タイマーを設定し、コンポーネントが破棄されたときにクリーンアップするeffectを追加します。

```ts
constructor() {
  // ... previous effects

  // Timer effect with cleanup
  effect((onCleanup) => {
    const interval = setInterval(() => {
      console.log('Timer tick - Current theme:', this.theme());
    }, 5000);

    // Clean up the interval when the effect is destroyed
    onCleanup(() => {
      clearInterval(interval);
      console.log('Timer cleaned up');
    });
  });
}
```

このeffectは、effectが破棄または再実行されたときにリソースをクリーンアップする方法を示しています。
</docs-step>

<docs-step title="Test the effects">
ブラウザのコンソールを開き、アプリを操作します。

- **テーマを切り替える** - ローカルストレージの保存とタイマーログを確認
- **ログイン/ログアウト** - ユーザーアクティビティのログを確認
- **タイマーを監視する** - 5秒ごとの定期的なテーマログを確認

effectは、追跡しているシグナルが変更されるたびに自動的に実行されます！
</docs-step>

</docs-workflow>

すばらしい！これで、シグナルでeffectを使用する方法を学びました。覚えておくべき主要な概念は次のとおりです。

- **effectはリアクティブである**: 読み取ったシグナルが変更されると自動的に実行されます
- **副作用のみ**: ロギング、DOM操作、API呼び出し、命令型APIへの同期に最適です
- **クリーンアップ**: `onCleanup`コールバックを使用して、タイマーやサブスクリプションなどのリソースをクリーンアップします
- **自動追跡**: effectは、読み取ったシグナルを自動的に追跡し、それらのシグナルが変更されると再実行されます

**Remember: effectは控えめに使用してください！** このレッスンでの例（localStorage同期、ロギング、タイマー）は適切な使用法です。effectを避けるべきケースは次のとおりです。

- 他のシグナルから値を派生させる場合 - 代わりに`computed()`を使用してください
- 書き込み可能な派生状態を作成する場合 - 代わりに`linkedSignal()`を使用してください
- シグナル間でデータをコピーする場合 - 共有された真の情報源を使用するように再構築してください

effectは強力ですが、`computed()`と`linkedSignal()`でユースケースを解決できない場合の最後の手段であるべきです。
