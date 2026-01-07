# フォームにバリデーションを追加

フォームにバリデーションを追加することは、ユーザーが有効なデータを入力することを保証するために重要です。シグナルフォームは、`form()` 関数に渡すスキーマ関数内でバリデーターを使用します。

このアクティビティでは、次の方法を学びます:

- 組み込みバリデーターをインポート
- フォームのスキーマ関数を定義
- カスタムエラーメッセージを使用して特定のフィールドにバリデーターを適用

バリデーションを追加しましょう!

<hr />

<docs-workflow>

<docs-step title="バリデーターをインポート">
`@angular/forms/signals` から `required` と `email` バリデーターをインポートします:

```ts
import {form, Field, required, email} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="フォームにスキーマ関数を追加">
`form()` 呼び出しを更新して、2番目のパラメータとしてスキーマ関数を含めます。スキーマ関数は、各フィールドにアクセスできる `fieldPath` パラメータを受け取ります:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  // Validators will go here
});
```

</docs-step>

<docs-step title="emailフィールドにバリデーションを追加">
スキーマ関数内で、emailフィールドのバリデーションを追加します。`required()` と `email()` の両方のバリデーターを使用します:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

`message` オプションは、ユーザーにカスタムエラーメッセージを提供します。
</docs-step>

<docs-step title="passwordフィールドにバリデーションを追加">
`required()` バリデーターを使用して、passwordフィールドのバリデーションを追加します:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
  required(fieldPath.password, {message: 'Password is required'});
});
```

</docs-step>

</docs-workflow>

完璧! フォームにバリデーションを追加しました。バリデーターは、ユーザーがフォームと対話すると自動的に実行されます。バリデーションが失敗すると、フィールドの状態がエラーを反映します。

次に、[テンプレートでバリデーションエラーを表示する方法](/tutorials/signal-forms/4-display-errors)を学びます!
