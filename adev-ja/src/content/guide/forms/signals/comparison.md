# 他のフォームアプローチとの比較

Angularは、シグナルフォーム、リアクティブフォーム、テンプレート駆動フォームという3つのフォーム構築アプローチを提供します。それぞれ、状態管理、バリデーション、データフローのための異なるパターンを持っています。このガイドは、その違いを理解し、あなたのプロジェクトに適したアプローチを選択するのに役立ちます。

NOTE: シグナルフォームはAngular v21の時点では[experimental](reference/releases#experimental)です。APIは安定化する前に変更される可能性があります。

## クイック比較 {#quick-comparison}

| 機能             | シグナルフォーム                   | リアクティブフォーム                  | テンプレート駆動フォーム|
| ---------------- | ---------------------------------- | ------------------------------------- | ----------------------- |
| 信頼できる情報源 | ユーザー定義の書き込み可能なシグナルモデル | `FormControl`/`FormGroup`             | コンポーネント内のユーザーモデル |
| 型安全性         | モデルから推論                     | 型付きフォームで明示的に指定          | 最小限                  |
| バリデーション   | パスベースのバリデーターを持つスキーマ | コントロールに渡されるバリデーターのリスト | ディレクティブベース    |
| 状態管理         | シグナルベース                     | Observableベース                      | Angularによる管理       |
| セットアップ     | シグナル + スキーマ関数            | FormControlツリー                     | テンプレート内のNgModel |
| 最適な用途       | シグナルベースのアプリケーション             | 複雑なフォーム                        | シンプルなフォーム      |
| 学習曲線         | 中                                 | 中〜高                                | 低                      |
| ステータス       | 実験的 (v21+)                      | 安定                                  | 安定                    |

## 例: ログインフォーム {#by-example-login-form}

違いを理解する最善の方法は、3つのアプローチすべてで実装された同じフォームを見ることです。

<docs-code-multifile>
  <docs-code header="シグナルフォーム" path="adev/src/content/examples/signal-forms/src/comparison/app/signal-forms.ts"/>
  <docs-code header="リアクティブフォーム" path="adev/src/content/examples/signal-forms/src/comparison/app/reactive-forms.ts"/>
  <docs-code header="テンプレート駆動フォーム" path="adev/src/content/examples/signal-forms/src/comparison/app/template-driven-forms.ts"/>
</docs-code-multifile>

## 違いを理解する

3つのアプローチは、フォームの作成と保守の方法に影響を与える異なる設計上の選択をしています。これらの違いは、各アプローチがフォームの状態をどこに保存し、バリデーションをどのように管理するかに起因します。

### フォームデータがどこに存在するか {#where-your-form-data-lives}

最も根本的な違いは、各アプローチがフォームの値の「信頼できる情報源 (source of truth)」をどこに置くかです。

シグナルフォームは、書き込み可能なシグナルにデータを保存します。現在のフォームの値が必要な場合は、シグナルを呼び出します。

```ts
const credentials = this.loginModel(); // { email: '...', password: '...' }
```

これにより、フォームデータは単一のリアクティブなコンテナに保持され、値が変更されると自動的にAngularに通知されます。フォームの構造は、データモデルを正確に反映します。

Reactive Formsは、`FormControl`と`FormGroup`のインスタンス内にデータを保存します。フォームの階層を通じて値にアクセスします。

```ts
const credentials = this.loginForm.value; // { email: '...', password: '...' }
```

これにより、フォームの状態管理がコンポーネントのデータモデルから分離されます。フォームの構造は明示的ですが、より多くのセットアップコードが必要です。

テンプレート駆動フォームは、コンポーネントのプロパティにデータを保存します。値に直接アクセスします。

```ts
const credentials = { email: this.email, password: this.password };
```

これは最も直接的なアプローチですが、値が必要なときに手動で組み立てる必要があります。Angularは、テンプレート内のディレクティブを通じてフォームの状態を管理します。

### バリデーションの仕組み {#how-validation-works}

各アプローチはバリデーションルールを異なる方法で定義し、バリデーションロジックがどこに存在し、どのように保守するかに影響します。

シグナルフォームは、バリデーターをフィールドパスにバインドするスキーマ関数を使用します。

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, { message: 'Email is required' });
  email(fieldPath.email, { message: 'Enter a valid email address' });
});
```

すべてのバリデーションルールが1か所にまとめられます。スキーマ関数はフォーム作成時に一度だけ実行され、フィールドの値が変更されるとバリデーターが自動的に実行されます。エラーメッセージはバリデーション定義の一部です。

Reactive Formsは、コントロールを作成するときにバリデーターをアタッチします。

```ts
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email])
});
```

バリデーターは、フォーム構造内の個々のコントロールに結び付けられます。これにより、バリデーションがフォーム定義全体に分散されます。エラーメッセージは通常、テンプレート内に記述します。

テンプレート駆動フォームは、テンプレート内でディレクティブ属性を使用します。

```html
<input [(ngModel)]="email" required email />
```

バリデーションルールは、HTMLとともにテンプレート内に記述されます。これにより、バリデーションはUIの近くに保たれますが、ロジックはテンプレートとコンポーネントに分散します。

### 型安全性とオートコンプリート {#type-safety-and-autocomplete}

TypeScriptの統合はアプローチによって大きく異なり、コンパイラがエラーを回避するのにどれだけ役立つかに影響します。

シグナルフォームは、モデル構造から型を推論します。

```ts
const loginModel = signal({ email: '', password: '' });
const loginForm = form(loginModel);
// TypeScript knows: loginForm.email exists and returns FieldState<string>
```

シグナルでデータ構造を一度定義すると、TypeScriptはどのフィールドが存在し、その型が何かを自動的に認識します。`loginForm.username`（存在しない）にアクセスすると、型エラーが発生します。

Reactive Formsは、型付きフォームで明示的な型アノテーションを必要とします。

```ts
const loginForm = new FormGroup({
  email: new FormControl<string>(''),
  password: new FormControl<string>('')
});
// TypeScript knows: loginForm.controls.email is FormControl<string>
```

各コントロールの型を個別に指定します。TypeScriptはフォーム構造を検証しますが、型情報はデータモデルとは別に保守します。

テンプレート駆動フォームは、最小限の型安全性しか提供しません。

```ts
email = '';
password = '';
// TypeScript only knows these are strings, no form-level typing
```

TypeScriptはコンポーネントのプロパティを理解しますが、フォームの構造やバリデーションについては何も知りません。フォーム操作に対するコンパイル時チェックが失われます。

## アプローチを選択する

### 次の場合はシグナルフォームを使用します: {#use-signal-forms-if}

- 新しいシグナルベースのアプリケーションを構築している (Angular v21+)
- モデル構造から推論される型安全性が欲しい
- 実験的な機能の利用に抵抗がない
- スキーマベースのバリデーションに魅力を感じる
- チームがシグナルに精通している

### 次の場合はReactive Formsを使用します: {#use-reactive-forms-if}

- 本番環境で利用できる安定性が必要である
- 複雑で動的なフォームを構築している
- Observableベースのパターンを好む
- フォームの状態をきめ細かく制御する必要がある
- 既存のリアクティブフォームのコードベースで作業している

### 次の場合はTemplate-driven Formsを使用します: {#use-template-driven-forms-if}

- シンプルなフォーム（ログイン、問い合わせ、検索）を構築している
- 迅速なプロトタイピングを行っている
- フォームロジックが単純である
- フォームロジックをテンプレート内に保持することを好む
- 既存のテンプレート駆動フォームのコードベースで作業している

## 次のステップ {#next-steps}

各アプローチについてさらに学ぶには:

- **シグナルフォーム**: [概要ガイド](guide/forms/signals/overview)から始めるか、[フォームモデル](guide/forms/signals/models)、[バリデーション](guide/forms/signals/validation)、[フィールド状態管理](guide/forms/signals/field-state-management)を詳しく見てください
- **リアクティブフォーム**: Angularドキュメントの[リアクティブフォームガイド](guide/forms/reactive-forms)を参照してください
- **テンプレート駆動フォーム**: Angularドキュメントの[テンプレート駆動フォームガイド](guide/forms/template-driven-forms)を参照してください
