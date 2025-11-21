# バリデーションエラーを表示

フォームをバリデートできるようになったので、ユーザーにバリデーションエラーを表示することが重要です。

このアクティビティでは、次の方法を学びます:

- バリデーションシグナルでフィールドの状態にアクセス
- `@if` を使用してエラーを条件付きで表示
- `@for` でエラーをループ
- ユーザーの対話後にのみエラーを表示

バリデーションフィードバックを表示しましょう!

<hr />

<docs-workflow>

<docs-step title="emailフィールドのエラー表示を追加">
email入力の下に、条件付きエラー表示を追加します。これは、フィールドが無効でタッチ済みの両方である場合にのみエラーを表示します:

```html
<label>
  Email
  <input type="email" [field]="loginForm.email" />
</label>
@if (loginForm.email().invalid() && loginForm.email().touched()) {
  <div class="error">
    @for (error of loginForm.email().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

`loginForm.email()` 呼び出しは、フィールドの状態シグナルにアクセスします。`invalid()` メソッドは、バリデーションが失敗したときに `true` を返し、`touched()` は、ユーザーがフィールドと対話した後に `true` を返し、`errors()` は、カスタムメッセージを含むバリデーションエラーの配列を提供します。
</docs-step>

<docs-step title="passwordフィールドのエラー表示を追加">
password入力の下に、passwordエラーの同じパターンを追加します:

```html
<label>
  Password
  <input type="password" [field]="loginForm.password" />
</label>
@if (loginForm.password().invalid() && loginForm.password().touched()) {
  <div class="error">
    @for (error of loginForm.password().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

</docs-step>

</docs-workflow>

素晴らしい! フォームにエラー表示を追加しました。エラーは、ユーザーがフィールドと対話した後にのみ表示され、邪魔にならずに役立つフィードバックを提供します。

次に、[フォーム送信の処理方法](/tutorials/signal-forms/5-add-submission)を学びます!
