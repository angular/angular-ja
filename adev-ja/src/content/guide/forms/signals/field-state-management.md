# フィールドの状態管理

シグナルフォームのフィールドの状態は、バリデーションの状態（`valid`、`invalid`、`errors`など）、インタラクションの追跡（`touched`、`dirty`など）、可用性（`disabled`、`hidden`など）のためのリアクティブなシグナルを提供し、ユーザーのインタラクションに反応できるようにします。

## フィールドの状態を理解する

`form()`関数でフォームを作成すると、**フィールドツリー**が返されます。これはフォームモデルを反映したオブジェクト構造です。ツリー内の各フィールドには、ドット記法（`form.email`など）でアクセスできます。

### フィールドの状態へのアクセス {#accessing-field-state}

フィールドツリー内の任意のフィールドを関数として（`form.email()`のように）呼び出すと、`FieldState`オブジェクトが返されます。これには、フィールドのバリデーション、インタラクション、および可用性の状態を追跡するリアクティブなシグナルが含まれています。たとえば、`invalid()`シグナルは、フィールドにバリデーションエラーがあるかどうかを示します:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, required, email } from '@angular/forms/signals'

@Component({
  selector: 'app-registration',
  imports: [Field],
  template: `
    <input type="email" [field]="registrationForm.email" />

    @if (registrationForm.email().invalid()) {
      <p class="error">Email has validation errors:</p>
      <ul>
        @for (error of registrationForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `
})
export class Registration {
  registrationModel = signal({
    email: '',
    password: ''
  })

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' })
    email(schemaPath.email, { message: 'Enter a valid email address' })
  })
}
```

この例では、テンプレートは`registrationForm.email().invalid()`をチェックして、エラーメッセージを表示するかどうかを判断します。

### フィールドの状態シグナル {#field-state-signals}

最も一般的に使用されるシグナルは`value()`です。これはフィールドの現在の値へのアクセスを提供する[書き込み可能なシグナル](guide/forms/signals/models#updating-models)です:

```ts
const emailValue = registrationForm.email().value();
console.log(emailValue); // Current email string
```

`value()`に加えて、フィールドの状態には、バリデーション、インタラクションの追跡、および可用性の制御のためのシグナルが含まれています:

| カテゴリー | シグナル | 説明 |
| --------------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| **[バリデーション](#validation-state)** | `valid()` | フィールドがすべてのバリデーションルールに合格し、保留中のバリデーターがない |
| | `invalid()` | フィールドにバリデーションエラーがある |
| | `errors()` | バリデーションエラーオブジェクトの配列 |
| | `pending()` | 非同期バリデーションが進行中 |
| **[インタラクション](#interaction-state)** | `touched()` | ユーザーがフィールドにフォーカスし、フォーカスを外した（インタラクティブな場合） |
| | `dirty()` | ユーザーがフィールドを変更した（インタラクティブな場合）。値が初期状態と一致していても同様 |
| **[可用性](#availability-state)** | `disabled()` | フィールドが無効化されており、親フォームの状態に影響しない |
| | `hidden()` | フィールドを非表示にすることを示す。テンプレートでの可視性は`@if`で制御される |
| | `readonly()` | フィールドが読み取り専用であり、親フォームの状態に影響しない |

これらのシグナルを使用すると、ユーザーの行動に反応するレスポンシブなフォームのユーザー体験を構築できます。以下のセクションでは、各カテゴリーを詳しく説明します。

## バリデーション状態 {#validation-state}

バリデーション状態シグナルは、フィールドが有効かどうか、またどのようなエラーを含んでいるかを示します。

NOTE: このガイドでは、テンプレートやロジックでバリデーション状態を**使用する**こと（フィードバックを表示するために`valid()`、`invalid()`、`errors()`を読み取るなど）に焦点を当てています。バリデーションルールを**定義**したり、カスタムバリデーターを作成したりする方法については、[バリデーションガイド](guide/forms/signals/validation)を参照してください。

### 有効性のチェック {#checking-validity}

`valid()`と`invalid()`を使用してバリデーションステータスをチェックします:

```angular-ts
@Component({
  template: `
    <input type="email" [field]="loginForm.email" />

    @if (loginForm.email().invalid()) {
      <p class="error">Email is invalid</p>
    } @if (loginForm.email().valid()) {
      <p class="success">Email looks good</p>
    }
  `
})
export class Login {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)
}
```

| シグナル    | 次の場合に`true`を返します                                      |
| ----------- | --------------------------------------------------------------- |
| `valid()`   | フィールドがすべてのバリデーションルールに合格し、保留中のバリデーターがない場合 |
| `invalid()` | フィールドにバリデーションエラーがある場合                                |

コードで有効性をチェックする際、「エラーがある」と「バリデーションが保留中」を区別したい場合は、`!valid()`の代わりに`invalid()`を使用してください。これは、非同期バリデーションが保留中の場合、`valid()`と`invalid()`の両方が同時に`false`になる可能性があるためです。バリデーションが完了していないためフィールドはまだ有効ではなく、またエラーがまだ見つかっていないため無効でもありません。

### バリデーションエラーの読み取り {#reading-validation-errors}

`errors()`でバリデーションエラーの配列にアクセスします。各エラーオブジェクトには以下が含まれます:

| プロパティ | 説明                                                            |
| --------- | --------------------------------------------------------------- |
| `kind`    | 失敗したバリデーションルール（"required"や"email"など）           |
| `message` | オプションの人間が読める形式のエラーメッセージ                  |
| `field`   | エラーが発生した`FieldTree`への参照                           |

NOTE: `message`プロパティはオプションです。バリデーターはカスタムエラーメッセージを提供できますが、指定されていない場合は、エラーの`kind`値を独自メッセージにマッピングする必要があるかもしれません。

以下は、テンプレートでエラーを表示する方法の例です:

```angular-ts
@Component({
  template: `
    <input type="email" [field]="loginForm.email" />

    @if (loginForm.email().errors().length > 0) {
      <div class="errors">
        @for (error of loginForm.email().errors(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `
})
```

このアプローチでは、フィールドのすべてのエラーをループ処理し、各エラーメッセージをユーザーに表示します。

### 保留中のバリデーション {#pending-validation}

`pending()`シグナルは、非同期バリデーションが進行中であることを示します:

```angular-ts
@Component({
  template: `
    <input type="email" [field]="signupForm.email" />

    @if (signupForm.email().pending()) {
      <p>Checking if email is available...</p>
    }

    @if (signupForm.email().invalid() && !signupForm.email().pending()) {
      <p>Email is already taken</p>
    }
  `
})
```

このシグナルにより、非同期バリデーションの実行中にローディング状態を表示できます。

## インタラクション状態 {#interaction-state}

インタラクション状態は、ユーザーがフィールドを操作したかどうかを追跡し、「ユーザーがフィールドに触れた後にのみエラーを表示する」といったパターンを可能にします。

### Touched状態 {#touched-state}

`touched()`シグナルは、ユーザーがフィールドにフォーカスし、その後ブラーしたかどうかを追跡します。ユーザー操作によって（プログラム的にではなく）フィールドにフォーカスし、その後ブラーすると`true`になります。非表示、無効、読み取り専用のフィールドは非インタラクティブであり、ユーザー操作によってtouchedになることはありません。

### Dirty状態 {#dirty-state}

フォームでは、データが実際に変更されたかどうかを検出する必要があることがよくあります。たとえば、未保存の変更についてユーザーに警告したり、必要な場合にのみ保存ボタンを有効にしたりするためです。`dirty()`シグナルは、ユーザーがフィールドを変更したかどうかを追跡します。

`dirty()`シグナルは、ユーザーがインタラクティブなフィールドの値を変更すると`true`になり、値を元の値に戻しても`true`のままです:

```angular-ts
@Component({
  template: `
    <form>
      <input [field]="profileForm.name" />
      <input [field]="profileForm.bio" />

      @if (profileForm().dirty()) {
        <p class="warning">You have unsaved changes</p>
      }
    </form>
  `
})
export class Profile {
  profileModel = signal({ name: 'Alice', bio: 'Developer' })
  profileForm = form(this.profileModel)
}
```

「未保存の変更」の警告や、データが変更された場合にのみ保存ボタンを有効にするには、`dirty()`を使用します。

### Touchedとdirtyの比較 {#touched-vs-dirty}

これらのシグナルは、異なるユーザーインタラクションを追跡します:

| シグナル      | trueになる条件                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `touched()` | ユーザーがインタラクティブなフィールドにフォーカスしてブラーしたとき（何も変更しなくても）                                         |
| `dirty()`   | ユーザーがインタラクティブなフィールドを変更したとき（一度もブラーしなくても、また現在の値が初期値と一致していても） |

フィールドは、さまざまな組み合わせの状態になり得ます:

| 状態                   | シナリオ                                                  |
| ---------------------- | --------------------------------------------------------- |
| Touchedだがdirtyではない  | ユーザーがフィールドにフォーカスしてブラーしたが、変更はしなかった    |
| Touchedかつdirty | ユーザーがフィールドにフォーカスし、値を変更してブラーした |

NOTE: 非表示、無効、読み取り専用のフィールドは非インタラクティブです。これらはユーザー操作によってtouchedやdirtyになることはありません。

## 可用性状態 {#availability-state}

可用性状態シグナルは、フィールドがインタラクティブか、編集可能か、表示されるかを制御します。無効、非表示、読み取り専用のフィールドは非インタラクティブです。これらは、親フォームが有効か、touchedか、dirtyかには影響しません。

### 無効なフィールド {#disabled-fields}

`disabled()`シグナルは、フィールドがユーザー入力を受け入れるかどうかを示します。無効なフィールドはUIに表示されますが、ユーザーはそれらを操作できません。

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, disabled } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [Field],
  template: `
    <!-- TIP: `[field]`ディレクティブは、フィールドの`disabled()`状態に基づいて`disabled`属性を自動的にバインドするため、手動で`[disabled]="field().disabled()"`を追加する必要はありません -->
    <input [field]="orderForm.couponCode" />

    @if (orderForm.couponCode().disabled()) {
      <p class="info">クーポンコードは50ドルを超える注文でのみ利用可能です</p>
    }
  `
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: ''
  })

  orderForm = form(this.orderModel, schemaPath => {
    disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50)
  })
}
```

この例では、`valueOf(schemaPath.total)`を使用して`total`フィールドの値をチェックし、`couponCode`を無効にするべきかどうかを判断します。

NOTE: スキーマのコールバックパラメータ（この例では`schemaPath`）は、フォーム内のすべてのフィールドへのパスを提供する`SchemaPathTree`オブジェクトです。このパラメータには好きな名前を付けることができます。

`disabled()`、`hidden()`、`readonly()`のようなルールを定義する場合、ロジックコールバックは通常、分割代入される（`({valueOf})`など）`FieldContext`オブジェクトを受け取ります。バリデーションルールで一般的に使用される2つのメソッドは次のとおりです:

- `valueOf(schemaPath.otherField)` - フォーム内の別のフィールドの値を読み取ります
- `value()` - ルールが適用されるフィールドの値を含むシグナル

無効なフィールドは、親フォームのバリデーション状態には影響しません。無効なフィールドが不正な値であっても、親フォームは有効になり得ます。`disabled()`状態はインタラクティブ性とバリデーションに影響しますが、フィールドの値は変更しません。

### 非表示のフィールド {#hidden-fields}

`hidden()`シグナルは、フィールドが条件付きで非表示になるかどうかを示します。条件に基づいてフィールドを表示または非表示にするには、`@if`と共に`hidden()`を使用します:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, hidden } from '@angular/forms/signals'

@Component({
  selector: 'app-profile',
  imports: [Field],
  template: `
    <label>
      <input type="checkbox" [field]="profileForm.isPublic" />
      プロフィールを公開する
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        公開URL
        <input [field]="profileForm.publicUrl" />
      </label>
    }
  `
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: ''
  })

  profileForm = form(this.profileModel, schemaPath => {
    hidden(schemaPath.publicUrl, ({valueOf}) => !valueOf(schemaPath.isPublic))
  })
}
```

非表示のフィールドはバリデーションに参加しません。必須フィールドが非表示の場合でも、フォームの送信は妨げられません。`hidden()`状態は可用性とバリデーションに影響しますが、フィールドの値は変更しません。

### 読み取り専用フィールド {#readonly-fields}

`readonly()`シグナルは、フィールドが読み取り専用かどうかを示します。読み取り専用フィールドは値を表示しますが、ユーザーは編集できません:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, readonly } from '@angular/forms/signals'

@Component({
  selector: 'app-account',
  imports: [Field],
  template: `
    <label>
      ユーザー名（変更不可）
      <input [field]="accountForm.username" />
    </label>

    <label>
      メールアドレス
      <input [field]="accountForm.email" />
    </label>
  `
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com'
  })

  accountForm = form(this.accountModel, schemaPath => {
    readonly(schemaPath.username)
  })
}
```

NOTE: `[field]`ディレクティブは、フィールドの`readonly()`状態に基づいて`readonly`属性を自動的にバインドするため、手動で`[readonly]="field().readonly()"`を追加する必要はありません。

無効フィールドや非表示フィールドと同様に、読み取り専用フィールドは非インタラクティブであり、親フォームの状態に影響を与えません。`readonly()`状態は編集可能性とバリデーションに影響しますが、フィールドの値は変更しません。

### それぞれをいつ使用するか {#when-to-use-each}

| 状態 | 使用する状況 | ユーザーに表示されるか | ユーザーが操作できるか | バリデーションに寄与するか |
| ------------ | ------------------------------------------------------------------- | --------------- | ----------------- | ------------------------- |
| `disabled()` | フィールドが一時的に利用できない場合（他のフィールド値に基づくなど） | はい | いいえ | いいえ |
| `hidden()` | 現在のコンテキストでフィールドが関連しない場合 | いいえ（@ifを使用） | いいえ | いいえ |
| `readonly()` | 値は表示されるべきだが、編集はできない場合 | はい | いいえ | いいえ |

## フォームレベルの状態 {#form-level-state}

ルートフォームもフィールドツリー内のフィールドです。それを関数として呼び出すと、すべての子フィールドの状態を集約した`FieldState`オブジェクトも返されます。

### フォームの状態へのアクセス {#accessing-form-state}

```angular-ts
@Component({
  template: `
    <form>
      <input [field]="loginForm.email" />
      <input [field]="loginForm.password" />

      <button [disabled]="!loginForm().valid()">Sign In</button>
    </form>
  `
})
export class Login {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)
}
```

この例では、すべての子フィールドが有効な場合にのみフォームが有効になります。これにより、フォーム全体の有効性に基づいて送信ボタンを有効化/無効化できます。

### フォームレベルのシグナル {#form-level-signals}

ルートフォームはフィールドであるため、同じシグナル（`valid()`、`invalid()`、`touched()`、`dirty()`など）を持ちます。

| シグナル      | フォームレベルの動作                                           |
| ----------- | -------------------------------------------------------------- |
| `valid()`   | すべてのインタラクティブなフィールドが有効で、保留中のバリデーターがない |
| `invalid()` | 少なくとも1つのインタラクティブなフィールドにバリデーションエラーがある   |
| `pending()` | 少なくとも1つのインタラクティブなフィールドに保留中の非同期バリデーションがある |
| `touched()` | ユーザーが少なくとも1つのインタラクティブなフィールドに触れた          |
| `dirty()`   | ユーザーが少なくとも1つのインタラクティブなフィールドを変更した        |

### フォームレベルとフィールドレベルの使い分け {#when-to-use-form-level-vs-field-level}

**フォームレベルの状態は次の場合に使用します:**

- 送信ボタンの有効/無効状態
- 「保存」ボタンの状態
- フォーム全体の有効性チェック
- 未保存の変更に関する警告

**フィールドレベルの状態は次の場合に使用します:**

- 個々のフィールドのエラーメッセージ
- フィールド固有のスタイリング
- フィールドごとのバリデーションフィードバック
- 条件付きのフィールドの可用性

## 状態の伝播 {#state-propagation}

フィールドの状態は、子フィールドから親フィールドグループを通じてルートフォームまで伝播します。

### 子の状態が親フォームに与える影響 {#how-child-state-affects-parent-forms}

子フィールドが無効になると、その親フィールドグループも無効になり、ルートフォームも同様に無効になります。子がtouchedまたはdirtyになると、親フィールドグループとルートフォームはその変更を反映します。この集約により、フィールドやフォーム全体など、あらゆるレベルで有効性をチェックできます。

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  address: {
    street: '',
    city: '',
  },
});

const userForm = form(userModel);

// firstNameが無効な場合、profileも無効になります
userForm.profile.firstName().invalid() === true;
// → userForm.profile().invalid() === true
// → userForm().invalid() === true
```

### 非表示、無効、読み取り専用のフィールド {#hidden-disabled-and-readonly-fields}

非表示、無効、読み取り専用のフィールドは非インタラクティブであり、親フォームの状態に影響を与えません:

```ts
const orderModel = signal({
  customerName: '',
  requiresShipping: false,
  shippingAddress: '',
});

const orderForm = form(orderModel, (schemaPath) => {
  hidden(schemaPath.shippingAddress, ({valueOf}) => !valueOf(schemaPath.requiresShipping));
});
```

この例では、`shippingAddress`が非表示の場合、フォームの有効性には影響しません。その結果、`shippingAddress`が空で必須であっても、フォームは有効になり得ます。

この動作により、非表示、無効、または読み取り専用のフィールドがフォームの送信をブロックしたり、有効性、touched、dirtyの状態に影響を与えたりするのを防ぎます。

## テンプレートでの状態の使用 {#using-state-in-templates}

フィールド状態シグナルはAngularテンプレートとシームレスに統合され、手動のイベントハンドリングなしでリアクティブなフォームのユーザー体験を可能にします。

### 条件付きのエラー表示 {#conditional-error-display}

ユーザーがフィールドを操作した後にのみエラーを表示します:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, email } from '@angular/forms/signals'

@Component({
  selector: 'app-signup',
  imports: [Field],
  template: `
    <label>
      Email
      <input type="email" [field]="signupForm.email" />
    </label>

    @if (signupForm.email().touched() && signupForm.email().invalid()) {
      <p class="error">{{ signupForm.email().errors()[0].message }}</p>
    }
  `
})
export class Signup {
  signupModel = signal({ email: '', password: '' })

  signupForm = form(this.signupModel, schemaPath => {
    email(schemaPath.email)
  })
}
```

このパターンは、ユーザーがフィールドを操作する機会を得る前にエラーが表示されるのを防ぎます。エラーは、ユーザーがフィールドにフォーカスしてから離れた後にのみ表示されます。

### 条件付きのフィールドの可用性 {#conditional-field-availability}

`hidden()`シグナルを`@if`とともに使用して、条件付きでフィールドを表示または非表示にします:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, hidden } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [Field],
  template: `
    <label>
      <input type="checkbox" [field]="orderForm.requiresShipping" />
      Requires shipping
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Shipping Address
        <input [field]="orderForm.shippingAddress" />
      </label>
    }
  `
})
export class Order {
  orderModel = signal({
    requiresShipping: false,
    shippingAddress: ''
  })

  orderForm = form(this.orderModel, schemaPath => {
    hidden(schemaPath.shippingAddress, ({valueOf}) => !valueOf(schemaPath.requiresShipping))
  })
}
```

非表示のフィールドはバリデーションに参加しないため、たとえ非表示のフィールドがそうでなければ無効であってもフォームを送信できます。

## コンポーネントロジックでのフィールド状態の使用 {#using-field-state-in-component-logic}

フィールド状態のシグナルは、Angularのリアクティブプリミティブである`computed()`や`effect()`と連携して、高度なフォームロジックを実現します。

### 送信前のバリデーションチェック {#validation-checks-before-submission}

コンポーネントメソッドでフォームの有効性をチェックします:

```ts
export class Registration {
  registrationModel = signal({
    username: '',
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel);

  async onSubmit() {
    // Wait for any pending async validation
    if (this.registrationForm().pending()) {
      console.log('Waiting for validation...');
      return;
    }

    // Guard against invalid submissions
    if (this.registrationForm().invalid()) {
      console.error('Form is invalid');
      return;
    }

    const data = this.registrationModel();
    await this.api.register(data);
  }
}
```

これにより、有効で完全にバリデーションされたデータのみがAPIに到達することが保証されます。

### computedによる派生状態 {#derived-state-with-computed}

フィールド状態に基づいてcomputedシグナルを作成すると、基礎となるフィールドの状態が変化したときに自動的に更新されます:

```ts
export class Password {
  passwordModel = signal({password: '', confirmPassword: ''});
  passwordForm = form(this.passwordModel);

  // Compute password strength indicator
  passwordStrength = computed(() => {
    const password = this.passwordForm.password().value();
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  });

  // Check if all required fields are filled
  allFieldsFilled = computed(() => {
    return (
      this.passwordForm.password().value().length > 0 &&
      this.passwordForm.confirmPassword().value().length > 0
    );
  });
}
```

### プログラムによる状態変更 {#programmatic-state-changes}

フィールドの状態は通常、ユーザーインタラクション（タイピング、フォーカス、ブラー）によって更新されますが、プログラムで制御する必要がある場合もあります。一般的なシナリオには、フォームの送信やフォームのリセットが含まれます。

#### フォームの送信 {#form-submission}

ユーザーがフォームを送信するときは、`submit()`関数を使用してバリデーションを処理し、エラーを表示します:

```ts
import {Component, signal} from '@angular/core';
import {form, submit, required, email} from '@angular/forms/signals';

export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username);
    email(schemaPath.email);
    required(schemaPath.password);
  });

  onSubmit() {
    submit(this.registrationForm, async () => {
      this.submitToServer();
    });
  }

  submitToServer() {
    // Send data to server
  }
}
```

`submit()`関数は、すべてのフィールドを自動的にtouchedとしてマークし（バリデーションエラーを表示）、フォームが有効な場合にのみコールバックを実行します。

#### 送信後のフォームのリセット {#resetting-forms-after-submission}

フォームを正常に送信した後、ユーザーインタラクションの履歴とフィールドの値の両方をクリアして、初期状態に戻したい場合があります。`reset()`メソッドはtouchedフラグとdirtyフラグをクリアしますが、フィールドの値は変更しないため、モデルを別途更新する必要があります:

```ts
export class Contact {
  contactModel = signal({name: '', email: '', message: ''});
  contactForm = form(this.contactModel);

  async onSubmit() {
    if (!this.contactForm().valid()) return;

    await this.api.sendMessage(this.contactModel());

    // Clear interaction state (touched, dirty)
    this.contactForm().reset();

    // Clear values
    this.contactModel.set({name: '', email: '', message: ''});
  }
}
```

この2段階のリセットにより、古いエラーメッセージやdirty状態のインジケーターを表示することなく、フォームが新しい入力に対応できるようになります。

## バリデーション状態に基づいたスタイリング {#styling-based-on-validation-state}

バリデーション状態に基づいてCSSクラスをバインドすることで、フォームにカスタムスタイルを適用できます:

```angular-ts
import { Component, signal } from '@angular/core'
import { form, Field, email } from '@angular/forms/signals'

@Component({
  template: `
    <input
      type="email"
      [field]="form.email"
      [class.is-invalid]="form.email().touched() && form.email().invalid()"
      [class.is-valid]="form.email().touched() && form.email().valid()"
    />
  `,
  styles: `
    input.is-invalid {
      border: 2px solid red;
      background-color: white;
    }

    input.is-valid {
      border: 2px solid green;
    }
  `
})
export class StyleExample {
  model = signal({ email: '' })

  form = form(this.model, schemaPath => {
    email(schemaPath.email)
  })
}
```

`touched()`とバリデーション状態の両方をチェックすることで、ユーザーがフィールドを操作した後にのみスタイルが表示されるようになります。

## 次のステップ {#next-steps}

このガイドでは、バリデーションと可用性ステータスの処理、インタラクションの追跡、フィールド状態の伝播について説明しました。関連ガイドでは、シグナルフォームの他の側面について探求します:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
