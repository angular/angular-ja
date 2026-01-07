# フォームをテンプレートに接続

次に、`[field]` ディレクティブを使用してフォームをテンプレートに接続する必要があります。これにより、フォームモデルと入力要素の間に双方向データバインディングが作成されます。

このレッスンでは、次の方法を学びます:

- `Field` ディレクティブをインポート
- `[field]` ディレクティブを使用してフォームフィールドを入力にバインド
- テキスト入力とチェックボックスをフォームに接続
- テンプレートにフォームフィールド値を表示

テンプレートを配線しましょう!

<hr />

<docs-workflow>

<docs-step title="Fieldディレクティブをインポート">
`@angular/forms/signals` から `Field` ディレクティブをインポートし、コンポーネントのimports配列に追加します:

```ts
import { form, Field } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

</docs-step>

<docs-step title="emailフィールドをバインド">
テンプレートで、email入力に `[field]` ディレクティブを追加します:

```html
<input type="email" [field]="loginForm.email" />
```

`loginForm.email` 式は、フォームからemailフィールドにアクセスします。
</docs-step>

<docs-step title="passwordフィールドをバインド">
password入力に `[field]` ディレクティブを追加します:

```html
<input type="password" [field]="loginForm.password" />
```

</docs-step>

<docs-step title="checkboxフィールドをバインド">
checkbox入力に `[field]` ディレクティブを追加します:

```html
<input type="checkbox" [field]="loginForm.rememberMe" />
```

</docs-step>

<docs-step title="フォーム値を表示">
フォームの下に、現在のフォーム値を表示するデバッグセクションがあります。`.value()` を使用して各フィールド値を表示します:

```angular-html
<p>Email: {{ loginForm.email().value() }}</p>
<p>Password: {{ loginForm.password().value() ? '••••••••' : '(empty)' }}</p>
<p>Remember me: {{ loginForm.rememberMe().value() ? 'Yes' : 'No' }}</p>
```

フォームフィールド値はシグナルであるため、入力すると表示される値が自動的に更新されます。
</docs-step>

</docs-workflow>

すばらしい! フォームをテンプレートに接続し、フォーム値を表示しました。`[field]` ディレクティブは双方向データバインディングを自動的に処理します - 入力すると、`loginModel` シグナルが更新され、表示される値が即座に更新されます。

次に、[フォームにバリデーションを追加する方法](/tutorials/signal-forms/3-add-validation)を学びます!
