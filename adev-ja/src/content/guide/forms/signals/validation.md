# バリデーション

フォームには、ユーザーが送信前に正しく完全なデータを提供することを保証するためにバリデーションが必要です。バリデーションがない場合、サーバー側でデータ品質の問題を処理し、不明瞭なエラーメッセージでユーザー体験を低下させ、すべての制約を手動でチェックする必要があるでしょう。

シグナルフォームは、スキーマベースのバリデーションアプローチを提供します。バリデーションルールはスキーマ関数を使用してフィールドにバインドされ、値が変更されると自動的に実行され、フィールド状態シグナルを通じてエラーを公開します。これにより、ユーザーがフォームを操作するにつれて更新されるリアクティブなバリデーションが可能になります。

<docs-code-multifile preview hideCode path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.css"/>
</docs-code-multifile>

## バリデーションの基本 {#validation-basics}

シグナルフォームにおけるバリデーションは、`form()`の第二引数として渡されるスキーマ関数を通じて定義されます。

### スキーマ関数 {#the-schema-function}

スキーマ関数は、バリデーションルールを定義するための`SchemaPathTree`オブジェクトを受け取ります:

<docs-code
  header="app.ts"
  path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"
  visibleLines="[21,22,23,24,25,26,27]"
  highlight="[23,24,26]"
/>

スキーマ関数はフォームの初期化中に一度だけ実行されます。バリデーションルールはスキーマパスパラメータ（`schemaPath.email`や`schemaPath.password`など）を使用してフィールドにバインドされ、フィールドの値が変更されるたびにバリデーションが自動的に実行されます。

NOTE: スキーマのコールバックパラメータ（この例では`schemaPath`）は、フォーム内のすべてのフィールドへのパスを提供する`SchemaPathTree`オブジェクトです。このパラメータには好きな名前を付けることができます。

### バリデーションの仕組み {#how-validation-works}

シグナルフォームのバリデーションは、次のパターンに従います:

1. **スキーマでバリデーションルールを定義** - スキーマ関数内でバリデーションルールをフィールドにバインドします
2. **自動実行** - フィールドの値が変更されるとバリデーションルールが実行されます
3. **エラーの伝播** - バリデーションエラーはフィールドの状態シグナルを通じて公開されます
4. **リアクティブな更新** - バリデーションの状態が変化するとUIが自動的に更新されます

インタラクティブなフィールドでは、値が変更されるたびにバリデーションが実行されます。非表示および無効化されたフィールドではバリデーションは実行されません - それらのバリデーションルールは、フィールドが再びインタラクティブになるまでスキップされます。

### バリデーションのタイミング {#validation-timing}

バリデーションルールは次の順序で実行されます:

1. **同期バリデーション** - 値が変更されると、すべての同期バリデーションルールが実行されます
2. **非同期バリデーション** - 非同期バリデーションルールは、すべての同期バリデーションルールが成功した後にのみ実行されます
3. **フィールドの状態更新** - `valid()`、`invalid()`、`errors()`、`pending()`シグナルが更新されます

同期バリデーションルール（`required()`や`email()`など）は即座に完了します。非同期バリデーションルール（`validateHttp()`など）は時間がかかる場合があり、実行中は`pending()`シグナルを`true`に設定します。

すべてのバリデーションルールは変更のたびに実行されます - バリデーションは最初のエラーで中断されません。フィールドに`required()`と`email()`の両方のバリデーションルールがある場合、両方が実行され、両方が同時にエラーを生成する可能性があります。

## 組み込みのバリデーションルール {#built-in-validation-rules}

シグナルフォームは、一般的なバリデーションシナリオのためのバリデーションルールを提供します。すべての組み込みバリデーションルールは、カスタムエラーメッセージと条件付きロジックのためのオプションオブジェクトを受け入れます。

### required() {#required}

`required()`バリデーションルールは、フィールドに値があることを保証します:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required } from '@angular/forms/signals'

@Component({
  selector: 'app-registration',
  imports: [Field],
  template: `
    <form>
      <label>
        Username
        <input [field]="registrationForm.username" />
      </label>

      <label>
        Email
        <input type="email" [field]="registrationForm.email" />
      </label>

      <button type="submit">Register</button>
    </form>
  `
})
export class RegistrationComponent {
  registrationModel = signal({
    username: '',
    email: ''
  })

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' })
    required(schemaPath.email, { message: 'Email is required' })
  })
}
```

フィールドは次の場合に「空」と見なされます:

| 条件 | 例 |
| ------------------------ | ------- |
| 値が`null`である | `null` |
| 値が空文字列である | `''` |
| 値が空の配列である | `[]` |

条件付きの要件には、`when`オプションを使用します:

```ts
registrationForm = form(this.registrationModel, (schemaPath) => {
  required(schemaPath.promoCode, {
    message: 'Promo code is required for discounts',
    when: ({valueOf}) => valueOf(schemaPath.applyDiscount)
  })
})
```

このバリデーションルールは、`when`関数が`true`を返す場合にのみ実行されます。

### email() {#email}

`email()`バリデーションルールは、有効なメール形式をチェックします:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, email } from '@angular/forms/signals'

@Component({
  selector: 'app-contact',
  imports: [Field],
  template: `
    <form>
      <label>
        Your Email
        <input type="email" [field]="contactForm.email" />
      </label>
    </form>
  `
})
export class ContactComponent {
  contactModel = signal({ email: '' })

  contactForm = form(this.contactModel, (schemaPath) => {
    email(schemaPath.email, { message: 'Please enter a valid email address' })
  })
}
```

`email()`バリデーションルールは、標準的なメール形式の正規表現を使用します。`user@example.com`のようなアドレスは受け入れますが、`user@`や`@example.com`のような不正な形式のアドレスは拒否します。

### min()とmax() {#min-and-max}

`min()`と`max()`バリデーションルールは、数値に対して機能します:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, min, max } from '@angular/forms/signals'

@Component({
  selector: 'app-age-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Age
        <input type="number" [field]="ageForm.age" />
      </label>

      <label>
        Rating (1-5)
        <input type="number" [field]="ageForm.rating" />
      </label>
    </form>
  `
})
export class AgeFormComponent {
  ageModel = signal({
    age: 0,
    rating: 0
  })

  ageForm = form(this.ageModel, (schemaPath) => {
    min(schemaPath.age, 18, { message: 'You must be at least 18 years old' })
    max(schemaPath.age, 120, { message: 'Please enter a valid age' })

    min(schemaPath.rating, 1, { message: 'Rating must be at least 1' })
    max(schemaPath.rating, 5, { message: 'Rating cannot exceed 5' })
  })
}
```

動的な制約のために、算出値を使用できます:

```ts
ageForm = form(this.ageModel, (schemaPath) => {
  min(schemaPath.participants, () => this.minimumRequired(), {
    message: 'Not enough participants'
  })
})
```

### minLength()とmaxLength() {#minlength-and-maxlength}

`minLength()`と`maxLength()`バリデーションルールは、文字列と配列に対して機能します:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, minLength, maxLength } from '@angular/forms/signals'

@Component({
  selector: 'app-password-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Password
        <input type="password" [field]="passwordForm.password" />
      </label>

      <label>
        Bio
        <textarea [field]="passwordForm.bio"></textarea>
      </label>
    </form>
  `
})
export class PasswordFormComponent {
  passwordModel = signal({
    password: '',
    bio: ''
  })

  passwordForm = form(this.passwordModel, (schemaPath) => {
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' })
    maxLength(schemaPath.password, 100, { message: 'Password is too long' })

    maxLength(schemaPath.bio, 500, { message: 'Bio cannot exceed 500 characters' })
  })
}
```

文字列の場合、「length」は文字数を意味します。配列の場合、「length」は要素数を意味します。

### pattern() {#pattern}

`pattern()`バリデーションルールは、正規表現に対してバリデーションを行います:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, pattern } from '@angular/forms/signals'

@Component({
  selector: 'app-phone-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Phone Number
        <input [field]="phoneForm.phone" placeholder="555-123-4567" />
      </label>

      <label>
        Postal Code
        <input [field]="phoneForm.postalCode" placeholder="12345" />
      </label>
    </form>
  `
})
export class PhoneFormComponent {
  phoneModel = signal({
    phone: '',
    postalCode: ''
  })

  phoneForm = form(this.phoneModel, (schemaPath) => {
    pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
      message: 'Phone must be in format: 555-123-4567'
    })

    pattern(schemaPath.postalCode, /^\d{5}$/, {
      message: 'Postal code must be 5 digits'
    })
  })
}
```

一般的なパターン:

| パターンの種類 | 正規表現 | 例 |
| ---------------- | ----------------------- | ------------ |
| 電話番号 | `/^\d{3}-\d{3}-\d{4}$/` | 555-123-4567 |
| 郵便番号 (米国) | `/^\d{5}$/` | 12345 |
| 英数字 | `/^[a-zA-Z0-9]+$/` | abc123 |
| URLセーフ | `/^[a-zA-Z0-9_-]+$/` | my-url_123 |

## バリデーションエラー

バリデーションルールが失敗すると、何が問題だったかを説明するエラーオブジェクトが生成されます。エラーの構造を理解することは、ユーザーに明確なフィードバックを提供するのに役立ちます。

<!-- TODO: フィールド状態管理ガイドが公開されたらコメントを解除する

NOTE: このセクションでは、バリデーションルールが生成するエラーについて説明します。UIでバリデーションエラーを表示して使用する方法については、[フィールド状態管理ガイド](guide/forms/signal-forms/field-state-management)を参照してください。 -->

### エラーの構造 {#error-structure}

各バリデーションエラーオブジェクトには、以下のプロパティが含まれています:

| プロパティ  | 説明                                                              |
| --------- | ------------------------------------------------------------------------ |
| `kind`    | 失敗したバリデーションルール（例: "required", "email", "minLength"） |
| `message` | オプションの人間が読める形式のエラーメッセージ                                    |

組み込みのバリデーションルールは、自動的に`kind`プロパティを設定します。`message`プロパティはオプションで、バリデーションルールのオプションを通じてカスタムメッセージを提供できます。

### カスタムエラーメッセージ {#custom-error-messages}

すべての組み込みバリデーションルールは、カスタムエラーテキストのために`message`オプションを受け入れます:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required, minLength } from '@angular/forms/signals'

@Component({
  selector: 'app-signup',
  imports: [Field],
  template: `
    <form>
      <label>
        Username
        <input [field]="signupForm.username" />
      </label>

      <label>
        Password
        <input type="password" [field]="signupForm.password" />
      </label>
    </form>
  `
})
export class SignupComponent {
  signupModel = signal({
    username: '',
    password: ''
  })

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Please choose a username'
    })

    required(schemaPath.password, {
      message: 'Password cannot be empty'
    })
    minLength(schemaPath.password, 12, {
      message: 'Password must be at least 12 characters for security'
    })
  })
}
```

カスタムメッセージは、明確で具体的であり、ユーザーに問題の修正方法を伝えるべきです。「無効な入力」の代わりに、「セキュリティのため、パスワードは12文字以上である必要があります」のようにします。

### フィールドごとの複数のエラー {#multiple-errors-per-field}

フィールドに複数のバリデーションルールがある場合、各バリデーションルールは独立して実行され、エラーを生成する可能性があります:

```ts
signupForm = form(this.signupModel, (schemaPath) => {
  required(schemaPath.email, { message: 'Email is required' })
  email(schemaPath.email, { message: 'Enter a valid email address' })
  minLength(schemaPath.email, 5, { message: 'Email is too short' })
})
```

emailフィールドが空の場合、`required()`エラーのみが表示されます。ユーザーが"a@b"と入力すると、`email()`と`minLength()`の両方のエラーが表示されます。すべてのバリデーションルールが実行され、最初の失敗でバリデーションが停止することはありません。

TIP: テンプレートで`touched() && invalid()`パターンを使用すると、ユーザーがフィールドを操作する前にエラーが表示されるのを防ぐことができます。バリデーションエラーの表示に関する包括的なガイダンスについては、[フィールド状態管理ガイド](guide/forms/signal-forms/field-state-management#conditional-error-display)を参照してください。

## カスタムバリデーションルール {#custom-validation-rules}

組み込みのバリデーションルールは一般的なケースを処理しますが、ビジネスルール、複雑なフォーマット、またはドメイン固有の制約のために、カスタムバリデーションロジックが必要になることがよくあります。

### validate()の使用 {#using-validate}

`validate()`関数はカスタムバリデーションルールを作成します。これは、フィールドコンテキストにアクセスし、以下の値を返すバリデーター関数を受け取ります:

| 戻り値                | 意味             |
| --------------------- | ---------------- |
| エラーオブジェクト        | 値は無効です     |
| `null` または `undefined` | 値は有効です     |

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, validate } from '@angular/forms/signals'

@Component({
  selector: 'app-url-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Website URL
        <input [field]="urlForm.website" />
      </label>
    </form>
  `
})
export class UrlFormComponent {
  urlModel = signal({ website: '' })

  urlForm = form(this.urlModel, (schemaPath) => {
    validate(schemaPath.website, ({value}) => {
      if (!value().startsWith('https://')) {
        return {
          kind: 'https',
          message: 'URL must start with https://'
        }
      }

      return null
    })
  })
}
```

バリデーター関数は、以下のプロパティを持つ`FieldContext`オブジェクトを受け取ります:

| プロパティ      | 型         | 説明                                        |
| --------------- | ---------- | ------------------------------------------- |
| `value`         | Signal     | 現在のフィールド値を含むSignal              |
| `state`         | FieldState | フィールドの状態への参照                    |
| `field`         | FieldTree  | フィールドツリーへの参照                    |
| `valueOf()`     | Method     | パスで指定された他のフィールドの値を取得します |
| `stateOf()`     | Method     | パスで指定された他のフィールドの状態を取得します |
| `fieldTreeOf()` | Method     | パスで指定された他のフィールドのフィールドツリーを取得します |
| `pathKeys`      | Signal     | ルートから現在のフィールドまでのパスキー    |

NOTE: 子フィールドには`key`シグナルもあり、配列アイテムのフィールドには`key`と`index`の両方のシグナルがあります。

バリデーションが失敗した場合は`kind`と`message`を持つエラーオブジェクトを返します。バリデーションが成功した場合は`null`または`undefined`を返します。

### 再利用可能なバリデーションルール {#reusable-validation-rules}

`validate()`をラップして、再利用可能なバリデーションルール関数を作成します:

```ts
function url(field: any, options?: { message?: string }) {
  validate(field, ({value}) => {
    try {
      new URL(value())
      return null
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL'
      }
    }
  })
}

function phoneNumber(field: any, options?: { message?: string }) {
  validate(field, ({value}) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/

    if (!phoneRegex.test(value())) {
      return {
        kind: 'phoneNumber',
        message: options?.message || 'Phone must be in format: 555-123-4567'
      }
    }

    return null
  })
}
```

カスタムバリデーションルールは、組み込みのバリデーションルールと同じように使用できます:

```ts
urlForm = form(this.urlModel, (schemaPath) => {
  url(schemaPath.website, { message: 'Please enter a valid website URL' })
  phoneNumber(schemaPath.phone)
})
```

## クロスフィールドバリデーション {#cross-field-validation}

クロスフィールドバリデーションは、複数のフィールド値を比較または関連付けます。

クロスフィールドバリデーションの一般的なシナリオは、パスワードの確認です:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required, minLength, validate } from '@angular/forms/signals'

@Component({
  selector: 'app-password-change',
  imports: [Field],
  template: `
    <form>
      <label>
        New Password
        <input type="password" [field]="passwordForm.password" />
      </label>

      <label>
        Confirm Password
        <input type="password" [field]="passwordForm.confirmPassword" />
      </label>

      <button type="submit">Change Password</button>
    </form>
  `
})
export class PasswordChangeComponent {
  passwordModel = signal({
    password: '',
    confirmPassword: ''
  })

  passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, { message: 'Password is required' })
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' })

    required(schemaPath.confirmPassword, { message: 'Please confirm your password' })

    validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value()
      const password = valueOf(schemaPath.password)

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match'
        }
      }

      return null
    })
  })
}
```

確認用のバリデーションルールは`valueOf(schemaPath.password)`を使用してパスワードフィールドの値にアクセスし、確認用の値と比較します。このバリデーションルールはリアクティブに実行されます - どちらかのパスワードが変更されると、バリデーションが自動的に再実行されます。

## 非同期バリデーション {#async-validation}

非同期バリデーションは、サーバーでのユーザー名の利用可能性のチェックやAPIに対するバリデーションなど、外部データソースを必要とするバリデーションを処理します。

### validateHttp()の使い方 {#using-validatehttp}

`validateHttp()`関数は、HTTPベースのバリデーションを実行します:

```angular-ts
import { Component, signal, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { form, Field, required, validateHttp } from '@angular/forms/signals'

@Component({
  selector: 'app-username-form',
  imports: [Field],
  template: `
    <form>
      <label>
        Username
        <input [field]="usernameForm.username" />

        @if (usernameForm.username().pending()) {
          <span class="checking">Checking availability...</span>
        }
      </label>
    </form>
  `
})
export class UsernameFormComponent {
  http = inject(HttpClient)

  usernameModel = signal({ username: '' })

  usernameForm = form(this.usernameModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' })

    validateHttp(schemaPath.username, {
      request: ({value}) => `/api/check-username?username=${value()}`,
      onSuccess: (response: any) => {
        if (response.taken) {
          return {
            kind: 'usernameTaken',
            message: 'Username is already taken'
          }
        }
        return null
      },
      onError: (error) => ({
        kind: 'networkError',
        message: 'Could not verify username availability'
      })
    })
  })
}
```

`validateHttp()`バリデーションルール:

1. `request`関数によって返されるURLまたはリクエストを呼び出します
2. `onSuccess`を使用して、成功レスポンスをバリデーションエラーまたは`null`にマッピングします
3. `onError`を使用して、リクエストの失敗（ネットワークエラー、HTTPエラー）を処理します
4. リクエストが進行中の間、`pending()`を`true`に設定します
5. すべての同期バリデーションルールが成功した後にのみ実行されます

### ペンディング状態 {#pending-state}

非同期バリデーションの実行中、フィールドの`pending()`シグナルは`true`を返します。これを使用してローディングインジケーターを表示します:

```ts
@if (form.username().pending()) {
  <span class="spinner">Checking...</span>
}
```

`valid()`シグナルは、まだエラーがない場合でも、バリデーションがペンディング中の間は`false`を返します。`invalid()`シグナルは、エラーが存在する場合にのみ`true`を返します。

## 次のステップ {#next-steps}

このガイドでは、バリデーションルールの作成と適用について説明しました。関連ガイドでは、シグナルフォームの他の側面について解説します:

- [フォームモデルガイド](guide/forms/signal-forms/models) - フォームモデルの作成と更新
  <!-- TODO: Uncomment when Field State Management guide is published -->
  <!-- - [Field State Management guide](guide/forms/signal-forms/field-state-management) - Using validation state in templates and displaying errors -->
