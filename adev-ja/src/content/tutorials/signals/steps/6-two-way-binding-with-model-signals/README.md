# modelシグナルによる双方向バインディング

[inputシグナルによるコンポーネントへのデータ受け渡し](/tutorials/signals/5-component-communication-with-signals)を学習したところで、Angularの`model()` APIを使った双方向バインディングについて見ていきましょう。modelシグナルは、チェックボックス、スライダー、カスタムフォームコントロールなど、コンポーネントが値を受け取ると同時に更新する必要があるUIコンポーネントに最適です。

このアクティビティでは、親と同期を保ちながら自身の状態を管理するカスタムチェックボックスコンポーネントを作成します。

<hr />

<docs-workflow>

<docs-step title="modelシグナルでカスタムチェックボックスを設定する" {#set-up-the-custom-checkbox-with-model-signal}>
`custom-checkbox`コンポーネントに、親の値を送受信できるmodelシグナルを作成します。

```ts
// Add imports for model signals
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';

// Model signal for two-way binding
checked = model.required<boolean>();

// Optional input for label
label = input<string>('');
```

読み取り専用の`input()`シグナルとは異なり、`model()`シグナルは読み取りと書き込みの両方が可能です。
</docs-step>

<docs-step title="チェックボックスのテンプレートを作成する" {#create-the-checkbox-template}>
クリックに応答し、自身のモデルを更新するチェックボックスのテンプレートを作成します。

```html
<label class="custom-checkbox">
  <input type="checkbox" [checked]="checked()" (change)="toggle()" />
  <span class="checkmark"></span>
  {{ label() }}
</label>
```

コンポーネントはmodelシグナルから読み取り、それを更新するメソッドを持っています。
</docs-step>

<docs-step title="toggleメソッドを追加する" {#add-the-toggle-method}>
チェックボックスがクリックされたときにmodelシグナルを更新するtoggleメソッドを実装します。

```ts
toggle() {
  // This updates BOTH the component's state AND the parent's model!
  this.checked.set(!this.checked());
}
```

子コンポーネントが`this.checked.set()`を呼び出すと、変更は自動的に親に伝播されます。これが`input()`シグナルとの主な違いです。
</docs-step>

<docs-step title="親で双方向バインディングを設定する" {#set-up-two-way-binding-in-the-parent}>
まず、`app.ts`内のmodelシグナルプロパティとメソッドのコメントを解除します。

```ts
// Parent signal models
agreedToTerms = model(false);
enableNotifications = model(true);

// Methods to test two-way binding
toggleTermsFromParent() {
  this.agreedToTerms.set(!this.agreedToTerms());
}

resetAll() {
  this.agreedToTerms.set(false);
  this.enableNotifications.set(false);
}
```

次に、テンプレートを更新します。

パート1. **チェックボックスのコメントを解除し、双方向バインディングを追加します。**

- 最初のチェックボックスの`___ADD_TWO_WAY_BINDING___`を`[(checked)]="agreedToTerms"`に置き換えます。
- 2番目のチェックボックスの`___ADD_TWO_WAY_BINDING___`を`[(checked)]="enableNotifications"`に置き換えます。

パート2. **`???`プレースホルダーを@ifブロックに置き換えます。**

```angular-html
@if (agreedToTerms()) {
  Yes
} @else {
  No
}

@if (enableNotifications()) {
  Yes
} @else {
  No
}
```

パート3. **ボタンにクリックハンドラーを追加します。**

```html
<button (click)="toggleTermsFromParent()">Toggle Terms from Parent</button>
<button (click)="resetAll()">Reset All</button>
```

`[(checked)]`構文は双方向バインディングを作成します。データはコンポーネントに流れ込み、変更はシグナル自体を参照するイベントを発行することで親に流れ戻ります。このとき、シグナルゲッターを直接呼び出すことは_ありません_。
</docs-step>

<docs-step title="双方向バインディングをテストする" {#test-the-two-way-binding}>
アプリケーションを操作して、双方向バインディングの動作を確認します。

1. **チェックボックスをクリックする** - コンポーネントは自身の状態を更新し、親に通知します。
2. **「Toggle Terms from Parent」をクリックする** - 親の更新がコンポーネントに伝播されます。
3. **「Reset All」をクリックする** - 親が両方のモデルをリセットし、コンポーネントが自動的に更新されます。

親と子の両方が共有状態を更新でき、両方とも自動的に同期を保ちます！
</docs-step>

</docs-workflow>

完璧です！modelシグナルがどのように双方向バインディングを可能にするかを学びました。

- **Modelシグナル** - 読み取りと書き込みの両方が可能な値には`model()`と`model.required()`を使用します。
- **双方向バインディング** - 親シグナルを子モデルにバインドするには`[(property)]`構文を使用します。
- **UIコンポーネントに最適** - チェックボックス、フォームコントロール、および自身の状態を管理する必要があるウィジェット。
- **自動同期** - 手動のイベント処理なしで、親と子が同期を保ちます。

**`model()`と`input()`の使い分け:**

- データが下方向にのみ流れる場合（表示データ、設定）は`input()`を使用します。
- 自身の値を更新する必要があるUIコンポーネント（フォームコントロール、トグル）には`model()`を使用します。

次のレッスンでは、[サービスでのシグナルの使用](/tutorials/signals/7-using-signals-with-services)について学びます！
