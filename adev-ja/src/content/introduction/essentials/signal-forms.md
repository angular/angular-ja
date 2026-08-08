<docs-decorative-header title="シグナルを使ったフォーム" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

シグナルフォームはAngularのシグナルを使用してフォームの状態を管理し、AngularのシグナルでデータモデルとUI間の自動的な同期を提供します。

このガイドでは、シグナルフォームでフォームを作成するための中心的な概念を順を追って説明します。その仕組みは次のとおりです:

## 最初のフォームを作成する {#creating-your-first-form}

### 1. `signal()`でフォームモデルを作成する {#1-create-a-form-model-with-signal}

すべてのフォームは、フォームのデータモデルを保持するシグナルを作成することから始まります:

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### 2. フォームモデルを`form()`に渡して`FieldTree`を作成する {#2-pass-the-form-model-to-form-to-create-a-fieldtree}

次に、フォームモデルを`form()`関数に渡して**フィールドツリー**を作成します。これはモデルの形状を反映したオブジェクト構造で、ドット記法でフィールドにアクセスできます。

Both the root form object and its nested properties are `FieldTree` nodes:

```ts
const loginForm = form(loginModel);

loginForm; // is a FieldTree
loginForm.email; // is also a FieldTree
```

### 3. `[formField]`ディレクティブでHTML入力をバインドする {#3-bind-html-inputs-with-field-directive}

次に、`[formField]`ディレクティブを使用してHTMLの入力をフォームにバインドします。これにより、それらの間に双方向バインディングが作成されます:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

その結果、ユーザーによる変更（フィールドへの入力など）は自動的にフォームを更新します。

NOTE: `[formField]`ディレクティブは、必要に応じて`required`、`disabled`、`readonly`などの属性のフィールドの状態も同期します。

### 4. `FieldTree`シグナルで状態を読み取る {#4-read-state-with-fieldtree-signals}

ツリーの任意の部分の状態には、`FieldTree`ノードを関数として呼び出すことでアクセスできます。これにより、値、バリデーションステータス、インタラクションの状態に対するリアクティブなシグナルを含む状態オブジェクトが返されます:

```ts
loginForm(); // Returns state for the whole form
loginForm.email(); // Returns state for the email field
```

フィールドの現在の値を読み取るには、`value()`シグナルにアクセスします:

```html
<!-- Render values that update automatically as user types -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

### 5. `set()`で値を更新する {#5-update-values-with-set}

任意のノードで`value.set()`メソッドを使用して、プログラムから値を更新できます。これにより、`FieldTree`と基になるモデルシグナルの両方が更新されます:

```ts
// Update the value programmatically
loginForm.email().value.set('alice@wonderland.com');
```

その結果、フィールドの値とモデルシグナルの両方が自動的に更新されます:

```ts
// The model signal is also updated
console.log(loginModel().email); // 'alice@wonderland.com'
```

### Complete example

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## 基本的な使い方 {#basic-usage}

`[formField]`ディレクティブは、すべての標準的なHTMLのinputタイプで動作します。以下は、最も一般的なパターンです:

### テキスト入力 {#text-inputs}

テキスト入力は、さまざまな`type`属性やtextareaで動作します:

```html
<!-- Text and email -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### 数値 {#numbers}

数値入力は、文字列と数値を自動的に変換します:

```html
<!-- Number - automatically converts to number type -->
<input type="number" [formField]="form.age" />
```

#### 日付と時刻 {#date-and-time}

日付入力は値を`YYYY-MM-DD`形式の文字列として保存し、時刻入力は`HH:mm`形式を使用します:

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

日付文字列をDateオブジェクトに変換する必要がある場合は、フィールドの値を`Date()`に渡すことで変換できます:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### 複数行テキスト {#multiline-text}

Textareaはテキスト入力と同じように動作します:

```html
<!-- Textarea -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### チェックボックス {#checkboxes}

チェックボックスはブール値にバインドされます:

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### 複数チェックボックス {#multiple-checkboxes}

複数のオプションがある場合は、それぞれに個別のブール値の`formField`を作成します:

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  SMS notifications
</label>
```

### ラジオボタン {#radio-buttons}

ラジオボタンはチェックボックスと同様に動作します。ラジオボタンが同じ`[formField]`値を使用している限り、シグナルフォームは自動的に同じ`name`属性をすべてのラジオボタンにバインドします:

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

ユーザーがラジオボタンを選択すると、フォームの`formField`にはそのラジオボタンの`value`属性の値が保存されます。例えば、「Premium」を選択すると、`form.plan().value()`は`"premium"`に設定されます。

### selectドロップダウン {#select-dropdowns}

Select要素は、静的オプションと動的オプションの両方で動作します:

```angular-html
<!-- Static options -->
<select [formField]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [formField]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: 複数選択(`<select multiple>`)は、現時点では`[formField]`ディレクティブでサポートされていません。

## バリデーションと状態 {#validation-and-state}

シグナルフォームには、フォームフィールドに適用できる組み込みのバリデーターが用意されています。バリデーションを追加するには、`form()`の第2引数にスキーマ関数を渡します:

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

スキーマ関数は、バリデーションルールを設定するためのフィールドへのパスを提供する**スキーマパス**パラメーターを受け取ります。

一般的なバリデーターには次のものがあります:

- **`required()`** - フィールドに値があることを保証します
- **`email()`** - メール形式を検証します
- **`min()`** / **`max()`** - 数値の範囲を検証します
- **`minLength()`** / **`maxLength()`** - 文字列またはコレクションの長さを検証します
- **`pattern()`** - 正規表現パターンに対して検証します

バリデーターの第2引数にオプションオブジェクトを渡すことで、エラーメッセージをカスタマイズできます:

```ts
required(schemaPath.email, {message: 'Email is required'});
email(schemaPath.email, {message: 'Please enter a valid email address'});
```

各`FieldTree`のノードは、リアクティブなシグナルを通じてそのバリデーションおよびインタラクションの状態を公開します。

### `FieldTree`の状態シグナル {#fieldtree-state-signals}

Every node in the tree, including the root form object, provides the same signals to track its state. Since every node is a `FieldTree`, the API for monitoring validity and interaction is identical at every level.

| State        | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| `valid()`    | Returns `true` if the node passes all validation rules                          |
| `invalid()`  | Returns `true` if there are validation errors                                   |
| `pending()`  | Returns `true` if async validation is in progress                               |
| `touched()`  | Returns `true` if the user has focused and blurred the field or any child field |
| `dirty()`    | Returns `true` if the value has been changed by the user                        |
| `disabled()` | Returns `true` if the node is disabled                                          |
| `readonly()` | Returns `true` if the node is readonly                                          |
| `errors()`   | Returns an array of validation errors with `kind` and `message` properties      |

### Complete example

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## 次のステップ {#next-steps}

シグナルフォームとその仕組みについてさらに詳しく学ぶには、詳細なガイドをご覧ください:

- [概要](guide/forms/signals/overview) - シグナルフォームの紹介といつ使用するか
- [フォームモデル](guide/forms/signals/models) - シグナルを使用したフォームデータの作成と管理
- [フィールドの状態管理](guide/forms/signals/field-state-management) - バリデーション状態、インタラクションの追跡、フィールドの可視性の操作
- [バリデーション](guide/forms/signals/validation) - 組み込みバリデーター、カスタムバリデーションルール、非同期バリデーション

<docs-pill-row>
  <docs-pill title="依存性の注入によるモジュール設計" href="essentials/dependency-injection" />
</docs-pill-row>
