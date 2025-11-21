# フォーム送信を追加

最後に、フォーム送信の処理方法を学びましょう。`submit()` 関数を使用して、フォームが有効なときに非同期処理を実行し、フォームにエラーがあるときに送信ボタンを無効にする方法を学びます。

このアクティビティでは、次の方法を学びます:

- `submit()` 関数をインポート
- 送信ハンドラーメソッドを作成
- `submit()` を使用して有効なときのみロジックを実行
- フォームの状態に基づいて送信ボタンを無効化

フォームを完成させましょう!

<hr />

<docs-workflow>

<docs-step title="submit関数をインポート">
`@angular/forms/signals` から `submit` 関数をインポートします:

```ts
import { form, Field, required, email, submit } from '@angular/forms/signals';
```

</docs-step>

<docs-step title="onSubmitメソッドを追加">
コンポーネントクラスで、フォーム送信を処理する `onSubmit()` メソッドを追加します:

```ts
onSubmit(event: Event) {
  event.preventDefault();
  submit(this.loginForm, async () => {
    const credentials = this.loginModel();
    console.log('Logging in with:', credentials);
    // Add your login logic here
  });
}
```

`submit()` 関数は、フォームが有効な場合にのみ非同期コールバックを実行します。また、フォームの送信状態も自動的に処理します。
</docs-step>

<docs-step title="送信ハンドラーをフォームにバインド">
テンプレートで、`onSubmit()` メソッドをフォームのsubmitイベントにバインドします:

```html
<form (submit)="onSubmit($event)">
```

</docs-step>

<docs-step title="フォームが無効なときにボタンを無効化">
フォームが無効なときに無効になるように送信ボタンを更新します:

```html
<button type="submit" [disabled]="loginForm().invalid()">
  Log in
</button>
```

これにより、フォームにバリデーションエラーがあるときの送信を防ぎます。
</docs-step>

</docs-workflow>

おめでとうございます! シグナルフォームを使用して完全なログインフォームを構築しました。

学んだことを確認し、高度なトピックを探索する準備はできましたか？[次のステップ](/tutorials/signal-forms/6-next-steps)に進みましょう!
