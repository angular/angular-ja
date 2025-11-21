# リンクシグナルによる状態の派生

[算出シグナルによる状態の派生方法](/tutorials/signals/2-deriving-state-with-computed-signals)を学んだ今、ユーザーのステータスに自動的に追従する`notificationsEnabled`の算出シグナルを作成しました。しかし、ユーザーがオンラインであっても手動で通知を無効にしたい場合はどうでしょうか？そこでリンクシグナルの出番です。

リンクシグナルは、ソースシグナルとのリアクティブな接続を維持する書き込み可能なシグナルです。通常は計算に従うが、必要に応じて上書きできる状態を作成するのに最適です。

この演習では、以前のユーザーの状態システムの算出シグナル`notificationsEnabled`を書き込み可能なリンクシグナルに拡張することで、`linkedSignal()`が`computed()`とどのように異なるかを学びます。

<hr />

<docs-workflow>

<docs-step title="linkedSignal関数をインポートする">
既存のインポートに`linkedSignal`を追加します。

```ts
// Add linkedSignal to existing imports
import {Component, signal, computed, linkedSignal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="computedを同じ式でlinkedSignalに変換する">
算出シグナル`notificationsEnabled`を、まったく同じ式を使用してリンクシグナルに置き換えます。

```ts
// Previously (from lesson 2):
// notificationsEnabled = computed(() => this.userStatus() === 'online');

// Now with linkedSignal - same expression, but writable:
notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');
```

式は同じですが、linkedSignalは書き込み可能なシグナルを作成します。`userStatus`が変更されると自動的に更新されますが、手動で設定できます。
</docs-step>

<docs-step title="通知を手動で切り替えるメソッドを追加する">
リンクシグナルに直接書き込むことができることを示すメソッドを追加します。

```ts
toggleNotifications() {
  // This works with linkedSignal but would error with computed!
  this.notificationsEnabled.set(!this.notificationsEnabled());
}
```

これが主な違いです。算出シグナルは読み取り専用ですが、リンクシグナルはリアクティブな接続を維持しながら手動で更新できます。
</docs-step>

<docs-step title="テンプレートを更新して手動通知コントロールを追加する">
テンプレートを更新して、通知用のトグルボタンを追加します。

```angular-html
<div class="status-info">
  <div class="notifications">
    <strong>Notifications:</strong>
    @if (notificationsEnabled()) {
      Enabled
    } @else {
      Disabled
    }
    <button (click)="toggleNotifications()" class="override-btn">
      @if (notificationsEnabled()) {
        Disable
      } @else {
        Enable
      }
    </button>
  </div>
  <!-- existing message and working-hours divs remain -->
</div>
```

</docs-step>

<docs-step title="リアクティブな動作を観察する">
次に、動作をテストします。

1. ユーザーの状態を変更します。`notificationsEnabled`が自動的に更新されることに注目してください。
2. 通知を手動で切り替えます。算出された値を上書きします。
3. 再度ステータスを変更します。リンクシグナルは計算と再同期します。

これは、リンクシグナルが手動で設定された後でもリアクティブな接続を維持することを示しています！
</docs-step>

</docs-workflow>

すばらしい！算出シグナルとリンクシグナルの主な違いを学びました。

- **算出シグナル**: 読み取り専用で、常に他のシグナルから派生します
- **リンクシグナル**: 書き込み可能で、派生と手動更新の両方が可能です
- **算出シグナルを使用する場合**: 値が常に計算されるべきとき
- **リンクシグナルを使用する場合**: 上書き可能なデフォルトの計算が必要なとき

次のレッスンでは、[シグナルで非同期データを管理する方法](/tutorials/signals/4-managing-async-data-with-signals)を学びます！
