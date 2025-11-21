# フォームモデル

フォームモデルはシグナルフォームの基盤であり、フォームデータのための単一の信頼できる情報源として機能します。このガイドでは、フォームモデルの作成方法、更新方法、そして保守性のための設計方法について説明します。

NOTE: フォームモデルは、コンポーネントの双方向バインディングに使用されるAngularの`model()`シグナルとは異なります。フォームモデルはフォームデータを格納する書き込み可能なシグナルであるのに対し、`model()`は親子コンポーネント間の通信のための入力/出力を作成します。

## フォームモデルが解決すること {#what-form-models-solve}

フォームでは、時間とともに変化するデータを管理する必要があります。明確な構造がないと、このデータはコンポーネントのプロパティ全体に散らばってしまい、変更の追跡、入力の検証、サーバーへのデータ送信が困難になります。

フォームモデルは、フォームデータを単一の書き込み可能なシグナルに集約することで、この問題を解決します。モデルが更新されると、フォームは自動的にその変更を反映します。ユーザーがフォームを操作すると、モデルもそれに応じて更新されます。

## モデルの作成

フォームモデルは、Angularの`signal()`関数で作成される書き込み可能なシグナルです。このシグナルは、フォームのデータ構造を表すオブジェクトを保持します。

```ts
import { Component, signal } from '@angular/core'
import { form, Field } from '@angular/forms/signals'

@Component({
  selector: 'app-login',
  imports: [Field],
  template: `
    <input type="email" [field]="loginForm.email" />
    <input type="password" [field]="loginForm.password" />
  `
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel)
}
```

`form()`関数はモデルのシグナルを受け取り、モデルの形状を反映した特別なオブジェクト構造である**フィールドツリー**を作成します。フィールドツリーは、ナビゲート可能（`loginForm.email`のようにドット記法で子フィールドにアクセス）であり、呼び出し可能（フィールドを関数として呼び出してその状態にアクセス）でもあります。

`[field]`ディレクティブは、各入力要素をフィールドツリー内の対応するフィールドにバインドし、UIとモデル間の自動的な双方向同期を可能にします。

### TypeScriptの型を使用する {#using-typescript-types}

TypeScriptはオブジェクトリテラルから型を推論しますが、明示的な型を定義することでコードの品質が向上し、より良いIntelliSenseのサポートが提供されます。

```ts
interface LoginData {
  email: string
  password: string
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel)
}
```

明示的な型を使用すると、フィールドツリーは完全な型安全性を提供します。`loginForm.email`へのアクセスは`FieldTree<string>`として型付けされ、存在しないプロパティにアクセスしようとするとコンパイル時エラーが発生します。

```ts
// TypeScript knows this is FieldTree<string>
const emailField = loginForm.email

// TypeScript error: Property 'username' does not exist
const usernameField = loginForm.username
```

### すべてのフィールドを初期化する {#initializing-all-fields}

フォームモデルは、フィールドツリーに含めたいすべてのフィールドに初期値を提供する必要があります。

```ts
// Good: All fields initialized
const userModel = signal({
  name: '',
  email: '',
  age: 0
})

// Avoid: Missing initial value
const userModel = signal({
  name: '',
  email: ''
  // age field is not defined - cannot access userForm.age
})
```

オプショナルなフィールドについては、明示的に`null`または空の値を設定してください:

```ts
interface UserData {
  name: string
  email: string
  phoneNumber: string | null
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null
})
```

`undefined`に設定されたフィールドは、フィールドツリーから除外されます。`{value: undefined}`を持つモデルは`{}`と全く同じように動作し、そのフィールドにアクセスすると`FieldTree`ではなく`undefined`が返されます。

### 動的なフィールドの追加 {#dynamic-field-addition}

新しいプロパティでモデルを更新することで、動的にフィールドを追加できます。フィールドツリーは、モデルの値に新しいフィールドが現れると、それらを含むように自動的に更新されます。

```ts
// Start with just email
const model = signal({ email: '' })
const myForm = form(model)

// Later, add a password field
model.update(current => ({ ...current, password: '' }))
// myForm.password is now available
```

このパターンは、ユーザーの選択やロードされたデータに基づいてフィールドが関連性を持つようになる場合に役立ちます。

## モデルの値を読み取る {#reading-model-values}

フォームの値には、モデルのシグナルから直接アクセスする方法と、個々のフィールドを介してアクセスする方法の2つがあります。それぞれのアプローチは異なる目的を果たします。

### モデルから読み取る {#reading-from-the-model}

フォームの送信時など、完全なフォームデータが必要な場合は、モデルのシグナルにアクセスします:

```ts
onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Send to server
  await this.authService.login(formData);
}
```

モデルのシグナルはデータオブジェクト全体を返すため、フォームの完全な状態を扱う操作に最適です。

### フィールドの状態から読み取る {#reading-from-field-state}

フィールドツリー内の各フィールドは関数です。フィールドを呼び出すと、フィールドの値、バリデーションステータス、インタラクションの状態に対するリアクティブなシグナルを含む`FieldState`オブジェクトが返されます。

テンプレートやリアクティブな計算で個々のフィールドを扱う場合は、フィールドの状態にアクセスします:

```ts
@Component({
  template: `
    <p>Current email: {{ loginForm.email().value() }}</p>
    <p>Password length: {{ passwordLength() }}</p>
  `
})
export class LoginComponent {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)

  passwordLength = computed(() => {
    return this.loginForm.password().value().length
  })
}
```

フィールドの状態は、各フィールドの値に対するリアクティブなシグナルを提供するため、フィールド固有の情報を表示したり、派生状態を作成したりするのに適しています。

TIP: フィールドの状態には、`value()`以外にも、バリデーションの状態（例: valid、invalid、errors）、インタラクションの追跡（例: touched、dirty）、可視性（例: hidden、disabled）など、さらに多くのシグナルが含まれています。

<!-- TODO: UNCOMMENT BELOW WHEN GUIDE IS AVAILABLE -->
<!-- See the [Field State Management guide](guide/forms/signal-forms/field-state-management) for complete coverage. -->

## フォームモデルをプログラム的に更新する {#updating-form-models-programmatically}

フォームモデルは、プログラム的なメカニズムを通じて更新されます:

1. `set()`で[フォームモデル全体を置き換える](#replacing-form-models-with-set)
2. `update()`で[1つ以上のフィールドを更新する](#update-one-or-more-fields-with-update)
3. フィールドの状態を通じて[単一のフィールドを直接更新する](#update-a-single-field-directly-with-set)

### `set()`でフォームモデルを置き換える {#replacing-form-models-with-set}

フォームモデルで`set()`を使用して、値全体を置き換えます:

```ts
loadUserData() {
  this.userModel.set({
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  });
}

resetForm() {
  this.userModel.set({
    name: '',
    email: '',
    age: 0,
  });
}
```

このアプローチは、APIからデータを読み込む場合や、フォーム全体をリセットする場合に適しています。

### `update()`で1つ以上のフィールドを更新する {#update-one-or-more-fields-with-update}

`update()`を使用して、他のフィールドを保持しながら特定のフィールドを変更します:

```ts
updateEmail(newEmail: string) {
  this.userModel.update(current => ({
    ...current,
    email: newEmail,
  }));
}
```

このパターンは、現在のモデルの状態に基づいて1つ以上のフィールドを変更する必要がある場合に便利です。

### `set()`で単一のフィールドを直接更新する {#update-a-single-field-directly-with-set}

個々のフィールドの値に`set()`を使用して、フィールドの状態を直接更新します:

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  const currentAge = this.userForm.age().value();
  this.userForm.age().value.set(currentAge + 1);
}
```

これらは「フィールドレベルの更新」としても知られています。これらは自動的にモデルのシグナルに伝播し、両方を同期させ続けます。

### 例: APIからデータを読み込む {#example-loading-data-from-an-api}

一般的なパターンは、データを取得してモデルに投入することです:

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: ''
  })

  userForm = form(this.userModel)
  private userService = inject(UserService)

  ngOnInit() {
    this.loadUserProfile()
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile()
    this.userModel.set(userData)
  }
}
```

モデルが変更されるとフォームのフィールドは自動的に更新され、追加のコードなしで取得したデータを表示します。

## 双方向データバインディング {#two-way-data-binding}

`[field]`ディレクティブは、モデル、フォームの状態、UIの間で自動的な双方向の同期を作成します。

### データフローの仕組み {#how-data-flows}

変更は双方向に流れます:

**ユーザー入力 → モデル:**

1. ユーザーが入力要素に入力する
2. `[field]`ディレクティブが変更を検知する
3. フィールドの状態が更新される
4. モデルのシグナルが更新される

**プログラムによる更新 → UI:**

1. コードが`set()`または`update()`でモデルを更新する
2. モデルのシグナルがサブスクライバーに通知する
3. フィールドの状態が更新される
4. `[field]`ディレクティブが入力要素を更新する

この同期は自動的に行われます。モデルとUIを同期させるために、サブスクリプションやイベントハンドラーを記述する必要はありません。

### 例: 両方向 {#example-both-directions}

```ts
@Component({
  template: `
    <input type="text" [field]="userForm.name" />
    <button (click)="setName('Bob')">Set Name to Bob</button>
    <p>Current name: {{ userModel().name }}</p>
  `
})
export class UserComponent {
  userModel = signal({ name: '' })
  userForm = form(this.userModel)

  setName(name: string) {
    this.userModel.update(current => ({ ...current, name }))
    // Input automatically displays 'Bob'
  }
}
```

ユーザーが入力フィールドに入力すると、`userModel().name`が更新されます。ボタンがクリックされると、入力値は"Bob"に変わります。手動での同期コードは必要ありません。

## モデル構造のパターン {#model-structure-patterns}

フォームモデルは、フラットなオブジェクトにすることも、ネストされたオブジェクトや配列を含めることもできます。選択する構造は、フィールドへのアクセス方法やバリデーションの構成に影響します。

### フラットモデルとネストモデル {#flat-vs-nested-models}

フラットなフォームモデルは、すべてのフィールドをトップレベルに保持します:

```ts
// Flat structure
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: ''
})
```

ネストされたモデルは、関連するフィールドをグループ化します:

```ts
// Nested structure
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  }
})
```

**次のような場合は、フラットな構造を使用します:**

- フィールドに明確な概念的なグループ分けがない場合
- フィールドへのアクセスをよりシンプルにしたい場合 (`userForm.city` vs `userForm.address.city`)
- バリデーションルールが複数の潜在的なグループにまたがる場合

**次のような場合は、ネストされた構造を使用します:**

- フィールドが明確な概念的なグループ（住所など）を形成する場合
- グループ化されたデータがAPI構造と一致する場合
- グループを1つの単位としてバリデーションしたい場合

### ネストされたオブジェクトの操作 {#working-with-nested-objects}

オブジェクトパスをたどることで、ネストされたフィールドにアクセスできます:

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: ''
  },
  settings: {
    theme: 'light',
    notifications: true
  }
})

const userForm = form(userModel)

// Access nested fields
userForm.profile.firstName // FieldTree<string>
userForm.settings.theme // FieldTree<string>
```

テンプレートでは、トップレベルのフィールドと同じ方法でネストされたフィールドをバインドします:

```ts
@Component({
  template: `
    <input [field]="userForm.profile.firstName" />
    <input [field]="userForm.profile.lastName" />

    <select [field]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### 配列の操作 {#working-with-arrays}

モデルには、アイテムのコレクションとして配列を含めることができます:

```ts
const orderModel = signal({
  customerName: '',
  items: [{ product: '', quantity: 0, price: 0 }]
})

const orderForm = form(orderModel)

// Access array items by index
orderForm.items[0].product // FieldTree<string>
orderForm.items[0].quantity // FieldTree<number>
```

オブジェクトを含む配列のアイテムは自動的に追跡IDを受け取ります。これにより、配列内でアイテムの位置が変わってもフィールドの状態を維持できます。これにより、配列が並べ替えられた場合でも、バリデーションの状態とユーザーインタラクションが正しく維持されることが保証されます。

<!-- TBD: 動的な配列や複雑な配列操作については、[配列の操作ガイド](guide/forms/signal-forms/arrays)を参照してください。 -->

## モデル設計のベストプラクティス {#model-design-best-practices}

適切に設計されたフォームモデルは、フォームの保守と拡張を容易にします。モデルを設計する際には、以下のパターンに従ってください。

### 具体的な型を使用する {#use-specific-types}

[TypeScriptの型を使用する](#using-typescript-types)で示されているように、モデルには常にインターフェースまたは型を定義してください。明示的な型は、より良いIntelliSenseを提供し、コンパイル時にエラーをキャッチし、フォームに含まれるデータに関するドキュメントとして機能します。

### すべてのフィールドを初期化する {#initialize-all-fields}

モデルのすべてのフィールドに初期値を提供してください:

```ts
// Good: All fields initialized
const taskModel = signal({
  title: '',
  description: '',
  priority: 'medium',
  completed: false
})
```

```ts
// Avoid: Partial initialization
const taskModel = signal({
  title: ''
  // Missing description, priority, completed
})
```

初期値がない場合、それらのフィールドはフィールドツリーに存在せず、フォームのインタラクションでアクセスできなくなります。

### モデルの焦点を絞る {#keep-models-focused}

各モデルは、単一のフォームまたはまとまりのある関連データのセットを表すべきです:

```ts
// Good: Focused on login
const loginModel = signal({
  email: '',
  password: ''
})
```

```ts
// Avoid: Mixing unrelated concerns
const appModel = signal({
  // Login data
  email: '',
  password: '',
  // User preferences
  theme: 'light',
  language: 'en',
  // Shopping cart
  cartItems: []
})
```

関心事ごとにモデルを分けることで、フォームが理解しやすく、再利用しやすくなります。異なるデータセットを管理する場合は、複数のフォームを作成してください。

### バリデーション要件を考慮する {#consider-validation-requirements}

バリデーションを念頭に置いてモデルを設計します。一緒にバリデーションするフィールドをグループ化してください:

```ts
// Good: Password fields grouped for comparison
interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
```

この構造により、フィールド間のバリデーション（`newPassword`が`confirmPassword`と一致するかどうかのチェックなど）がより自然になります。

### 初期状態を計画する {#plan-for-initial-state}

フォームが空の状態で始まるか、事前に入力されているかを考慮してください:

```ts
// Form that starts empty (new user)
const newUserModel = signal({
  name: '',
  email: '',
});

// Form that loads existing data
const editUserModel = signal({
  name: '',
  email: '',
});

// Later, in ngOnInit:
ngOnInit() {
  this.loadExistingUser();
}

async loadExistingUser() {
  const user = await this.userService.getUser(this.userId);
  this.editUserModel.set(user);
}
```

常に既存のデータで始まるフォームの場合、空のフィールドが一瞬表示されるのを避けるために、データが読み込まれるまでフォームのレンダリングを待つことができます。

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<!-- ## Next steps

<docs-pill-row>
  <docs-pill href="guide/forms/signal-forms/field-state-management" title="Field State Management" />
  <docs-pill href="guide/forms/signal-forms/validation" title="Validation" />
  <docs-pill href="guide/forms/signal-forms/arrays" title="Working with Arrays" />
</docs-pill-row> -->
