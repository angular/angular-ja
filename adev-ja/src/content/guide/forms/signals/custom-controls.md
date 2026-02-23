# カスタムコントロール

NOTE: このガイドは、[Signal Formsの基本](essentials/signal-forms)に精通していることを前提としています。

ブラウザの組み込みフォームコントロール（`input`、`select`、`textarea`など）は一般的なケースを扱いますが、アプリケーションではしばしば特殊な入力が必要になります。カレンダーUIを持つ日付ピッカー、書式設定ツールバーを持つリッチテキストエディタ、オートコンプリート機能を持つタグセレクターなどは、すべてカスタム実装が必要です。

シグナルフォームは、特定のインターフェースを実装するあらゆるコンポーネントと連携して動作します。**コントロールインターフェース**は、コンポーネントがフォームシステムと通信するためのプロパティとシグナルを定義します。コンポーネントがこれらのインターフェースのいずれかを実装すると、`[formField]`ディレクティブが自動的にコントロールをフォームの状態、バリデーション、データバインディングに接続します。

## 基本的なカスタムコントロールの作成 {#creating-a-basic-custom-control}

最小限の実装から始めて、必要に応じて機能を追加していきましょう。

### 最小限の入力コントロール {#minimal-input-control}

基本的なカスタム入力は、`FormValueControl`インターフェースを実装し、必須の`value`モデルシグナルを定義するだけで済みます。

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-input',
  template: `
    <div class="basic-input">
      <input
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class BasicInput implements FormValueControl<string> {
  /** The current input value */
  value = model('');
}
```

### 最小限のチェックボックスコントロール {#minimal-checkbox-control}

チェックボックス形式のコントロールには、次の2つが必要です:

1. `FormField`ディレクティブがフォームコントロールとして認識できるように、`FormCheckboxControl`インターフェースを実装する
2. `checked`モデルシグナルを提供する

```angular-ts
import {Component, model, ChangeDetectionStrategy} from '@angular/core';
import {FormCheckboxControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-toggle',
  template: `
    <button type="button" [class.active]="checked()" (click)="toggle()">
      <span class="toggle-slider"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicToggle implements FormCheckboxControl {
  /** Whether the toggle is checked */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update((val) => !val);
  }
}
```

### カスタムコントロールの使用 {#using-your-custom-control}

コントロールを作成したら、`FormField`ディレクティブを追加することで、組み込みの入力を使用する場所ならどこでも使用できます:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {BasicInput} from './basic-input';
import {BasicToggle} from './basic-toggle';

@Component({
  imports: [FormField, BasicInput, BasicToggle],
  template: `
    <form novalidate>
      <label>
        Email
        <app-basic-input [formField]="registrationForm.email" />
      </label>

      <label>
        Accept terms
        <app-basic-toggle [formField]="registrationForm.acceptTerms" />
      </label>

      <button type="submit" [disabled]="registrationForm().invalid()">Register</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  registrationModel = signal({
    email: '',
    acceptTerms: false,
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.acceptTerms, {message: 'You must accept the terms'});
  });
}
```

NOTE: スキーマのコールバックパラメータ（この例では`schemaPath`）は、フォーム内のすべてのフィールドへのパスを提供する`SchemaPathTree`オブジェクトです。このパラメータには好きな名前を付けることができます。

`[formField]`ディレクティブは、カスタムコントロールと組み込みの入力で同じように動作します。シグナルフォームはそれらを同じように扱います - バリデーションの実行、状態の更新、データバインディングが自動的に機能します。

## コントロールインターフェースの理解 {#understanding-control-interfaces}

カスタムコントロールの動作を確認したところで、それらがシグナルフォームとどのように統合されるかを見ていきましょう。

### コントロールインターフェース {#control-interfaces}

作成した`BasicInput`と`BasicToggle`コンポーネントは、シグナルフォームにそれらとの対話方法を伝える特定のコントロールインターフェースを実装しています。

#### FormValueControl {#formvaluecontrol}

`FormValueControl`は、テキスト入力、数値入力、日付ピッカー、セレクトドロップダウンなど、単一の値を編集するほとんどの入力タイプのためのインターフェースです。コンポーネントがこのインターフェースを実装する場合：

- **必須プロパティ**: コンポーネントは`value`モデルシグナルを提供する必要があります
- **FormFieldディレクティブの役割**: フォームフィールドの値をコントロールの`value`シグナルにバインドします

IMPORTANT: `FormValueControl`を実装するコントロールは`checked`プロパティを持ってはいけません

#### FormCheckboxControl {#formcheckboxcontrol}

`FormCheckboxControl`は、トグル、スイッチなど、ブール値のオン/オフ状態を表すチェックボックスのようなコントロールのためのインターフェースです。コンポーネントがこのインターフェースを実装する場合：

- **必須プロパティ**: コンポーネントは`checked`モデルシグナルを提供する必要があります
- **Fieldディレクティブの役割**: フォームフィールドの値をコントロールの`checked`シグナルにバインドします

IMPORTANT: `FormCheckboxControl`を実装するコントロールは`value`プロパティを持ってはいけません

### オプションの状態プロパティ {#optional-state-properties}

`FormValueControl`と`FormCheckboxControl`はどちらも`FormUiControl`を拡張します。これはフォームの状態と統合するためのオプションのプロパティを提供するベースインターフェースです。

すべてのプロパティはオプションです。コントロールが必要とするものだけを実装してください。

#### インタラクションの状態 {#interaction-state}

ユーザーがコントロールを操作したときを追跡します：

| プロパティ | 目的 |
| --------- | ------------------------------------------------ |
| `touched` | ユーザーがフィールドを操作したかどうか |
| `dirty` | 値が初期状態と異なるかどうか |

#### バリデーションの状態 {#validation-state}

ユーザーにバリデーションのフィードバックを表示します：

| プロパティ | 目的 |
| --------- | --------------------------------------- |
| `errors` | 現在のバリデーションエラーの配列 |
| `valid` | フィールドが有効かどうか |
| `invalid` | フィールドにバリデーションエラーがあるかどうか |
| `pending` | 非同期バリデーションが進行中かどうか |

#### 可用性の状態 {#availability-state}

ユーザーがフィールドを操作できるかどうかを制御します：

| プロパティ | 目的 |
| ----------------- | -------------------------------------------------------- |
| `disabled` | フィールドが無効かどうか |
| `disabledReasons` | フィールドが無効になっている理由 |
| `readonly` | フィールドが読み取り専用（表示されるが編集不可）かどうか |
| `hidden` | フィールドがビューから隠されているかどうか |

NOTE: `disabledReasons`は`DisabledReason`オブジェクトの配列です。各オブジェクトは`field`プロパティ（フィールドツリーへの参照）とオプションの`message`プロパティを持ちます。メッセージには`reason.message`を介してアクセスします。

#### バリデーション制約 {#validation-constraints}

フォームからバリデーション制約の値を受け取ります：

| プロパティ | 目的 |
| ----------- | ---------------------------------------------------- |
| `required` | フィールドが必須かどうか |
| `min` | 最小数値（制約がない場合は`undefined`） |
| `max` | 最大数値（制約がない場合は`undefined`） |
| `minLength` | 最小の文字列長（制約がない場合はundefined） |
| `maxLength` | 最大の文字列長（制約がない場合はundefined） |
| `pattern` | 一致させる正規表現パターンの配列 |

#### フィールドのメタデータ {#field-metadata}

| プロパティ | 目的 |
| -------- | ------------------------------------------------------------------ |
| `name` | フィールドのname属性（フォームやアプリケーション全体で一意） |

以下の「[状態シグナルの追加](#adding-state-signals)」セクションでは、これらのプロパティをコントロールに実装する方法を示します。

### FormFieldディレクティブの仕組み {#how-the-formfield-directive-works}

`[field]`ディレクティブは、コントロールがどのインターフェースを実装しているかを検出し、適切なシグナルを自動的にバインドします：

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {CustomInput} from './custom-input';
import {CustomToggle} from './custom-toggle';

@Component({
  selector: 'app-my-form',
  imports: [FormField, CustomInput, CustomToggle],
  template: `
    <form novalidate>
      <app-custom-input [formField]="userForm.username" />
      <app-custom-toggle [formField]="userForm.subscribe" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyForm {
  formModel = signal({
    username: '',
    subscribe: false,
  });

  userForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
  });
}
```

TIP: フォームモデルの作成と管理に関する完全な情報については、[フォームモデルガイド](guide/forms/signals/models)を参照してください。

`[formField]="userForm.username"`をバインドすると、FormFieldディレクティブは次のようになります:

1. コントロールが`FormValueControl`を実装していることを検出します
2. 内部で`userForm.username().value()`にアクセスし、それをコントロールの`value`モデルシグナルにバインドします
3. フォームの状態シグナル（`disabled()`、`errors()`など）をコントロールのオプションの入力シグナルにバインドします
4. 更新はシグナルのリアクティビティを通じて自動的に行われます

## 状態シグナルの追加 {#adding-state-signals}

上記の最小限のコントロールは機能しますが、フォームの状態には応答しません。オプションの入力シグナルを追加して、コントロールが無効状態に反応したり、バリデーションエラーを表示したり、ユーザーインタラクションを追跡したりできるようにできます。

以下は、一般的な状態プロパティを実装する包括的な例です:

```angular-ts
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';
import {FormValueControl, WithOptionalFieldTree, ValidationError, DisabledReason} from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set($event.target.value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touched.set(true)"
        />

        @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        }

        @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

その結果、バリデーションと状態管理を備えたコントロールを使用できます:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';
import {StatefulInput} from './stateful-input';

@Component({
  imports: [FormField, StatefulInput],
  template: `
    <form novalidate>
      <label>
        Email
        <app-stateful-input [formField]="loginForm.email" />
      </label>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  loginModel = signal({email: ''});

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

ユーザーが無効なメールアドレスを入力すると、`FormField`ディレクティブが自動的に`invalid()`と`errors()`を更新します。あなたのコントロールは、そのバリデーションフィードバックを表示できます。

### 状態プロパティのシグナルタイプ {#signal-types-for-state-properties}

ほとんどの状態プロパティは`input()`（フォームからの読み取り専用）を使用します。コントロールがユーザーインタラクションに応じて更新する場合は、`touched`に`model()`を使用します。`touched`プロパティは、ニーズに応じて`model()`、`input()`、または`OutputRef`を一意にサポートします。

## 値の変換 {#value-transformation}

コントロールは、フォームモデルに格納されている値とは異なる形式で値を表示することがあります。例えば、日付ピッカーは「2024-01-15」と格納しながら「January 15, 2024」と表示したり、通貨入力は1234.56と格納しながら「$1,234.56」と表示したりします。

`@angular/core`の`linkedSignal()`を使用してモデルの値を表示用に変換し、入力イベントを処理してユーザー入力を格納形式にパースして戻します:

```angular-ts
import {formatCurrency} from '@angular/common';
import {ChangeDetectionStrategy, Component, linkedSignal, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-currency-input',
  template: `
    <input
      type="text"
      [value]="displayValue()"
      (input)="displayValue.set($event.target.value)"
      (blur)="updateModel()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyInput implements FormValueControl<number> {
  // 数値 (1234.56) を格納します
  readonly value = model.required<number>();

  // 表示値 (「1,234.56」) を格納します
  readonly displayValue = linkedSignal(() => formatCurrency(this.value(), 'en', 'USD'));

  // 表示値からモデルを更新します
  updateModel() {
    this.value.set(parseCurrency(this.displayValue()));
  }
}

// 通貨文字列を数値に変換します (例: 「USD1,234.56」 -> 1234.56)
function parseCurrency(value: string): number {
  return parseFloat(value.replace(/^[^\d-]+/, '').replace(/,/g, ''));
}
```

## バリデーションの統合 {#validation-integration}

コントロールはバリデーションの状態を表示しますが、バリデーションは実行しません。バリデーションはフォームスキーマで行われます。コントロールは`FormField`ディレクティブから`invalid()`と`errors()`シグナルを受け取り、それらを表示します（上記の`StatefulInput`の例で示されているように）。

`FormField`ディレクティブは、`required`、`min`、`max`、`minLength`、`maxLength`、`pattern`のようなバリデーション制約の値も渡します。コントロールはこれらを使用してUIを強化できます:

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // スキーマのバリデーションルールからの制約値
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

スキーマに`min()`と`max()`のバリデーションルールを追加すると、`FormField`ディレクティブはこれらの値をコントロールに渡します。これらを使用して、HTML5属性を適用したり、テンプレートに制約のヒントを表示したりします。

IMPORTANT: コントロールにバリデーションロジックを実装しないでください。バリデーションルールはフォームスキーマで定義し、コントロールにはその結果を表示させるようにしてください:

```ts {avoid}
// 悪い例：コントロール内でのバリデーション
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // これは行わないでください！
}
```

```ts {prefer}
// 良い例：スキーマでバリデーションし、コントロールは結果を表示
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## 次のステップ {#next-steps}

このガイドでは、シグナルフォームと連携するカスタムコントロールの構築について説明しました。関連ガイドでは、シグナルフォームの他の側面について探求します:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
