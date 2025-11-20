<docs-decorative-header title="シグナルを使ったフォーム" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
シグナルフォームはAngularのシグナルを基に構築されており、フォームの状態を管理するためのリアクティブで型安全な方法を提供します。
</docs-decorative-header>

シグナルフォームはAngularのシグナルを使用してフォームの状態を管理し、データモデルとUI間の自動的な同期を提供します。

このガイドでは、シグナルフォームでフォームを作成するための中心的な概念を順を追って説明します。その仕組みは次のとおりです:

## 最初のフォームを作成する {#creating-your-first-form}

### 1. フォームモデルを作成する {#1-create-a-form-model}

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

### 2. フォームモデルを`form()`に渡す {#2-pass-the-form-model-to-form}

次に、フォームモデルを`form()`関数に渡して**フィールドツリー**を作成します。これはモデルの形状を反映したオブジェクト構造で、ドット記法でフィールドにアクセスできます:

```ts
form(loginModel);

// Access fields directly by property name
loginForm.email
loginForm.password
```

### 3. `[field]`ディレクティブで入力をバインドする {#3-bind-inputs-with-field-directive}

次に、`[field]`ディレクティブを使用してHTMLの入力をフォームにバインドします。これにより、それらの間に双方向バインディングが作成されます:

```html
<input type="email" [field]="loginForm.email" />
<input type="password" [field]="loginForm.password" />
```

その結果、ユーザーによる変更（フィールドへの入力など）は自動的にフォームを更新し、プログラムによる変更も表示される値を更新します:

```ts
// Update the value programmatically
loginForm.email().value.set('alice@wonderland.com');

// The model signal is also updated
console.log(loginModel().email); // 'alice@wonderland.com'
```

NOTE: `[field]`ディレクティブは、必要に応じて`required`、`disabled`、`readonly`などの属性のフィールドの状態も同期します。

### 4. `value()`でフォームフィールドの値を読み取る {#4-read-form-field-values-with-value}

フィールドを関数として呼び出すことで、フィールドの状態にアクセスできます。これにより、フィールドの値、バリデーションステータス、インタラクションの状態に対するリアクティブなシグナルを含む`FieldState`オブジェクトが返されます:

```ts
loginForm.email() // Returns FieldState with value(), valid(), touched(), etc.
```

フィールドの現在の値を読み取るには、`value()`シグナルにアクセスします:

```html
<!-- Render form value that updates automatically as user types -->
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

完全な例は次のとおりです:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## 基本的な使い方 {#basic-usage}

`[field]`ディレクティブは、すべての標準的なHTMLのinputタイプで動作します。以下は、最も一般的なパターンです:

### テキスト入力 {#text-inputs}

テキスト入力は、さまざまな`type`属性やtextareaで動作します:

```html
<!-- Text and email -->
<input type="text" [field]="form.name" />
<input type="email" [field]="form.email" />
```

#### 数値 {#numbers}

数値入力は、文字列と数値を自動的に変換します:

```html
<!-- Number - automatically converts to number type -->
<input type="number" [field]="form.age" />
```

#### 日付と時刻 {#date-and-time}

日付入力は値を`YYYY-MM-DD`形式の文字列として保存し、時刻入力は`HH:mm`形式を使用します:

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [field]="form.eventDate" />
<input type="time" [field]="form.eventTime" />
```

日付文字列をDateオブジェクトに変換する必要がある場合は、フィールドの値を`Date()`に渡すことで変換できます:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### 複数行テキスト {#multiline-text}

Textareaはテキスト入力と同じように動作します:

```html
<!-- Textarea -->
<textarea [field]="form.message" rows="4"></textarea>
```

### チェックボックス {#checkboxes}

チェックボックスはブール値にバインドされます:

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [field]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### 複数チェックボックス {#multiple-checkboxes}

複数のオプションがある場合は、それぞれに個別のブール値の`field`を作成します:

```html
<label>
  <input type="checkbox" [field]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [field]="form.smsNotifications" />
  SMS notifications
</label>
```

### ラジオボタン {#radio-buttons}

ラジオボタンはチェックボックスと同様に動作します。ラジオボタンが同じ`[field]`値を使用している限り、シグナルフォームは自動的に同じ`name`属性をすべてのラジオボタンにバインドします:

```html
<label>
  <input type="radio" value="free" [field]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [field]="form.plan" />
  Premium
</label>
```

ユーザーがラジオボタンを選択すると、フォームの`field`にはそのラジオボタンの`value`属性の値が保存されます。例えば、「Premium」を選択すると、`form.plan().value()`は`"premium"`に設定されます。

### selectドロップダウン {#select-dropdowns}

Select要素は、静的オプションと動的オプションの両方で動作します:

```html
<!-- Static options -->
<select [field]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [field]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: 複数選択(`<select multiple>`)は、現時点では`[field]`ディレクティブでサポートされていません。

## バリデーションと状態

シグナルフォームには、フォームフィールドに適用できる組み込みのバリデーターが用意されています。バリデーションを追加するには、`form()`の第2引数にスキーマ関数を渡します。この関数は、フォームモデル内のフィールドを参照できる**FieldPath**パラメーターを受け取ります:

```ts
const loginForm = form(loginModel, (fieldPath) => {
  required(fieldPath.email);
  email(fieldPath.email);
});
```

NOTE: FieldPathはデータの形状をミラーリングするだけで、値やその他の状態にアクセスできません。

一般的なバリデーターには次のものがあります:

- **`required()`** - フィールドに値があることを保証します
- **`email()`** - メール形式を検証します
- **`min()`** / **`max()`** - 数値の範囲を検証します
- **`minLength()`** / **`maxLength()`** - 文字列またはコレクションの長さを検証します
- **`pattern()`** - 正規表現パターンに対して検証します

バリデーターの第2引数にオプションオブジェクトを渡すことで、エラーメッセージをカスタマイズできます:

```ts
required(p.email, { message: 'Email is required' });
email(p.email, { message: 'Please enter a valid email address' });
```

各フォームフィールドは、シグナルを通じてそのバリデーション状態を公開します。たとえば、`field().valid()`をチェックしてバリデーションが成功したか、`field().touched()`をチェックしてユーザーが操作したかを確認し、`field().errors()`をチェックしてバリデーションエラーのリストを取得できます。

以下に完全な例を示します:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

### フィールドの状態シグナル {#field-state-signals}

すべての`field()`は、これらの状態シグナルを提供します:

| 状態         | 説明                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| `valid()`    | フィールドがすべてのバリデーションルールをパスした場合に`true`を返します     |
| `touched()`  | ユーザーがフィールドにフォーカスしてぼかした場合に`true`を返します           |
| `dirty()`    | ユーザーが値を変更した場合に`true`を返します                               |
| `disabled()` | フィールドが無効になっている場合に`true`を返します                           |
| `pending()`  | 非同期バリデーションが進行中の場合に`true`を返します                         |
| `errors()`   | `kind`と`message`プロパティを持つバリデーションエラーの配列を返します       |

TIP: ユーザーがフィールドを操作する前にバリデーションメッセージが表示されるのを避けるために、`field().touched()`がtrueになった後にのみエラーを表示してください。
