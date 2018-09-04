# フォームバリデーション




ユーザー入力を検証することにより、正確さと完全性のために全体的なデータ品質を改善します。

このページでは、UIでのユーザー入力の検証方法と、リアクティブおよびテンプレート駆動フォームの両方を使用した有効な検証メッセージの表示方法を示します。これは、2つのフォームモジュールの基本的な知識を前提としています。

<div class="alert is-helpful">

フォームをはじめてお使いの場合は、[テンプレート駆動フォーム](guide/forms)と[リアクティブフォーム](guide/reactive-forms)のガイドを確認してください。

</div>


## テンプレート駆動バリデーション

テンプレート駆動フォームにバリデーションを追加するには、[ネイティブHTMLフォーム](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)の検証と同じ検証属性を追加します。
Angularは、これらの属性をフレームワーク内のバリデータ関数と照合するディレクティブを使用します。

フォームコントロールの値が変更されるたびに, Angularは検証を実行し、INVALIDステータスに起因する検証エラーのリスト、あるいはVALIDステータスに起因するnullを返します。

`ngModel`をローカルテンプレートの変数にエクスポートすることで、コントロールの状態を調べることができます。
次の例では、`NgModel`を`name`という名前の変数にエクスポートします:

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-with-error-msg" title="template/hero-form-template.component.html (name)" linenums="false">

</code-example>


次の点に注意してください:

* `<input>`要素は、HTML検証属性、`required`および`minlength`を保持します。 また、カスタムバリデータディレクティブの`forbiddenName`も持ちます。 詳細については、[カスタムバリデータ](guide/form-validation#custom-validators)のセクションを参照してください。

* `#name="ngModel"`は、`NgModel`を`name`というローカル変数にエクスポートします。 `NgModel`は、基本となる`FormControl`インスタンスの多くのプロパティを反映しているため、テンプレート内でこれを使用して、`valid`や`dirty`のようなコントロールの状態をチェックできます。コントロールプロパティの完全なリストについては、[AbstractControl](api/forms/AbstractControl) APIリファレンスを参照してください。

* `<div>`要素の`*ngIf`はネストされたメッセージ`divs`のセットを表示しますが、`name`が`dirty`か`touched`の場合にのみ表示されます。

* ネストされた各`<div>`は、考えられる検証エラーの1つに対してカスタムメッセージを表示できます。 `required`、`minlength`、および`forbiddenName`のメッセージがあります。
 

<div class="alert is-helpful">


{@a why-check-dirty-and-touched}

#### なぜ、_dirty_と_touched_ をチェックするのでしょうか？

ユーザーがフォームを編集する前に、アプリケーションでエラーを表示したくない場合があります。`dirty`と`touched`のチェックはユーザーが次の2つのうちのいずれかを実行するまで、エラーが表示されることを防ぎます: 値を変更し,コントロールをdirtyに変更します; フォームコントロール要素をblurするか、コントロールをtouthedするように設定します。

</div>

## リアクティブフォームバリデーション

リアクティブフォームでは, 情報源はコンポーネントクラスです。テンプレートの属性を介してバリデータを追加する代わりに、バリデータ関数をコンポーネントクラスのフォームコントロールモデルに直接追加します。Angularは、コントロールの値が変更されるたびにこれらの関数を呼び出します。

### バリデータ関数

バリデータ関数には、同期バリデータと非同期バリデータの2種類があります。

* **同期バリデータ**: コントロールインスタンスを取得し、ただちに一連の検証エラーまたは`null`を返します。`FormControl`をインスタンス化するときに、2番目の引数として渡すことができます。

* **非同期バリデータ**: コントロールインスタンスを取得し、PromiseまたはObservableを返し、あとで一連の検証エラーまたはnullを返します。 `FormControl`をインスタンス化するときに、3番目の引数として渡すことができます。

注意: パフォーマンス上の理由から、Angularはすべての同期バリデータが通過する場合にのみ非同期バリデータを実行します。エラーが設定される前にそれぞれ完了しなければなりません。

### 組み込みバリデータ

[独自のバリデータ関数を記述する](guide/form-validation#custom-validators)ことも、Angularの組み込みバリデータを使用することもできます。

`required`や`minlength`など、テンプレート駆動型フォームの属性として使用できる同じ組み込みバリデータは、すべて`Validators`クラスの関数として使用できます。組み込みバリデータの完全なリストについては、[Validators](api/forms/Validators) APIリファレンスを参照してください。

ヒーローフォームをリアクティブフォームに更新するには,今回は同じ組み込みバリデーターを関数形式で使用することができます。次のコードを見てください:

{@a reactive-component-class}

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="form-group" title="reactive/hero-form-reactive.component.ts (validator functions)" linenums="false">
</code-example>

注意してください:

* nameコントロールは、2つの組み込みバリデータ&mdash;`Validators.required`と`Validators.minLength(4)`&mdash;と1つのカスタムバリデータ`forbiddenNameValidator`を設定します。詳細については、このガイドの[カスタムバリデータ](guide/form-validation#custom-validators)セクションを参照してください。
* これらのバリデータはすべて同期バリデータであるため、2番目の引数として渡します。
* 複数のバリデータをサポートするには、関数を配列として渡します。
* この例では、いくつかのgetterメソッドを追加しています。リアクティブフォームでは、親グループの`get`メソッドを通じて常にフォームコントロールにアクセスできますが、getterをテンプレートの省略名として定義すると便利なことがあります。


再度入力したnameテンプレートを見ると、テンプレート駆動型の例とかなり似ています。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="name-with-error-msg" title="reactive/hero-form-reactive.component.html (name with error msg)" linenums="false">
</code-example>

重要なポイント:
 
 * このフォームはディレクティブをエクスポートしなくなり、代わりにコンポーネントクラスで定義された`name`getterを使用します。
 * `required`属性は引き続き存在します。検証の目的では必要ではありませんが、CSSのスタイリングやアクセシビリティ上の理由から、テンプレートにそのスタイルを保持したい場合があります。

{@a custom-validators}
## カスタムバリデータ

組み込みバリデータは、アプリケーションのユースケースとは必ずしも一致しないので、場合によってはカスタムバリデータを作成することがあります。

このガイドの前の[例](guide/form-validation#reactive-component-class)の`forbiddenNameValidator`関数について考えてみましょう。その関数の定義は次のようになります:

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator" title="shared/forbidden-name.directive.ts (forbiddenNameValidator)" linenums="false">
</code-example>

この関数は実際には、_特定_ の禁止された名前を検出するために正規表現を取り、バリデータ関数を返すファクトリです。

このサンプルでは、 禁じられた名前は "bob"なので、バリデータは "bob"を含むヒーロー名を拒否します。
それ以外の場所では、 "alice"または正規表現で名前を拒否することができます。

`forbiddenNameValidator`ファクトリは、設定されたバリデータ関数を返します。
この関数はAngularコントロールオブジェクトをとり、コントロール値が有効な場合はnull _または_ 検証エラーオブジェクトを返します。
検証エラーオブジェクトには、通常、nameが検証キーであるプロパティ`'forbiddenName'`と,エラーメッセージ`{name}`に挿入できる値の順不同な辞書です。

カスタム非同期バリデータは同期バリデータと似ていますが、あとでnullまたは検証エラーオブジェクトを発行するPromiseまたはObservableを返す必要があります。Observableの場合は、Observableを完了しなければなりません。この時点で、フォームは検証のために発行された最後の値を使用します。

### リアクティブフォームへ追加

リアクティブフォームでは、カスタムバリデータは簡単に追加できます。関数を`FormControl`に直接渡すだけです。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="custom-validator" title="reactive/hero-form-reactive.component.ts (validator functions)" linenums="false">
</code-example>

{@a adding-to-template-driven-forms}

### テンプレート駆動型フォームへ追加

テンプレート駆動フォームでは、`FormControl`インスタンスに直接アクセスすることはできません。したがって、リアクティブフォームの場合と同じようにバリデータを渡すことはできません。代わりに、ディレクティブをテンプレートに追加する必要があります。

対応する`ForbiddenValidatorDirective`は、`forbiddenNameValidator`のラッパーとして機能します。

Angularは、ディレクティブが拡張可能なバリデータのコレクションをもつプロバイダーである`NG_VALIDATORS`プロバイダーに自身を登録するため、ディレクティブの検証プロセスにおける役割を認識します。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers" title="shared/forbidden-name.directive.ts (providers)" linenums="false">
</code-example>

ディレクティブクラスは、`Validator`インターフェイスを実装しているため、Angularフォームと簡単に統合できます。 これはどのようにそれらをまとめるかを理解するための、ディレクティブの残りの部分です:

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive" title="shared/forbidden-name.directive.ts (directive)">
</code-example>

`ForbiddenValidatorDirective`が準備されたら、`appForbiddenName`セレクターを任意の入力要素に追加して、アクティブ化できます。これは一例です:

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-input" title="template/hero-form-template.component.html (forbidden-name-input)" linenums="false">

</code-example>


<div class="alert is-helpful">

カスタム検証ディレクティブは、`useClass`ではなく`useExisting`でインスタンス化されていることに気付かれるかもしれません。登録されたバリデータは、この`ForbiddenValidatorDirective`の _インスタンス_ でなければなりません&mdash;`forbiddenName`プロパティが "bob"にバインドされたフォームのインスタンス。`useExisting`を`useClass`に置き換えた場合は、`forbiddenName`を持たない新しいクラスインスタンスを登録することになります。

</div>

## コントロールステータスCSSクラス

Angularは、AngularJSと同様に、多くのコントロールプロパティをCSSクラスとしてフォームコントロール要素に自動的に反映します。これらのクラスを使用して、フォームの状態に応じてフォームコントロール要素にスタイルを設定できます。現在サポートされているクラスは次のとおりです:

* `.ng-valid`
* `.ng-invalid`
* `.ng-pending`
* `.ng-pristine`
* `.ng-dirty`
* `.ng-untouched`
* `.ng-touched`

ヒーローフォームでは、`.ng-valid`クラスと`.ng-invalid`クラスを使用して、各フォームコントロールの境界線の色を設定します。

<code-example path="form-validation/src/assets/forms.css" title="forms.css (status classes)">

</code-example>

## クロスフィールドバリデーション
このセクションでは、クロスフィールドバリデーションを実行する方法を示します。カスタムバリデータの作成に関するいくつかの基本的な知識を前提としています。

<div class="alert is-helpful">

カスタムバリデータを作成したことがない場合は、まず[カスタムバリデータセクション](guide/form-validation#custom-validators)を確認してください。

</div>
 
次のセクションでは、ヒーローフォームに記入することで、ヒーローが本当のアイデンティティを明らかにしないようにします。ヒーロー名と別人格が一致しないことを検証することでこれを行います。

### リアクティブフォームへの追加

フォームの構造は次のとおりです

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
});
```

名前とalterEgoは兄弟コントロールであることに注意してください。単一のカスタムバリデーターで両方のコントロールを評価するには、共通の祖先コントロールである`FormGroup`でバリデーションを実行する必要があります。こうすることで、値を比較することができる子コントロールの`FormGroup`を照会することができます。

バリデータを`FormGroup`に追加するには、作成時に2番目の引数として新しいバリデータを渡します。

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
}, { validators: identityRevealedValidator });
```

バリデータのコードは次のとおりです。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-validator" title="shared/identity-revealed.directive.ts" linenums="false">
</code-example>

アイデンティティのバリデーターは、`ValidatorFn`インターフェースを実装します。 Angularコントロールオブジェクトを引数としてとり、フォームが有効な場合はnullを返し、それ以外の場合は`ValidationErrors`を返します。

最初に、`FormGroup`の[get](api/forms/AbstractControl#get)メソッドを呼び出すことによって子コントロールを取得します。次に、`name`と`alterEgo`コントロールの値を単純に比較します。

値が一致しない場合、ヒーローのアイデンティティは秘密のままであり、安全にnullを返すことができます。それ以外の場合、ヒーローのアイデンティティが明らかになり、エラーオブジェクトを返すことでフォームを無効としてマークする必要があります。

次に、ユーザーエクスペリエンスを向上させるために、フォームが無効な場合に適切なエラーメッセージが表示されます。
<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="cross-validation-error-message" title="reactive/hero-form-template.component.html" linenums="false">
</code-example>

次のことを確認します。
- `FormGroup`は`identityRevealed`バリデータによって返されたクロスバリデーションエラーを持ちますが、
- ユーザーはまだフォームと[対話](guide/form-validation#why-check-dirty-and-touched)していません。

### テンプレート駆動型フォームへの追加
まず、バリデータ関数をラップするディレクティブを作成する必要があります。 `NG_VALIDATORS`トークンを使用してバリデータとして提供します。理由がわからない場合や構文を完全に理解していない場合は、前の[セクション](guide/form-validation#adding-to-template-driven-forms)に戻ってください。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-directive" title="shared/identity-revealed.directive.ts" linenums="false">
</code-example>

次に、このディレクティブをHTMLテンプレートに追加する必要があります。バリデーターはフォームの最上位レベルに登録する必要があるため、このディレクティブを`form`タグに置きます。
<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-register-validator" title="template/hero-form-template.component.html" linenums="false">
</code-example>

ユーザーエクスペリエンスを向上させるため、フォームが無効な場合に適切なエラーメッセージが表示されます。
<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-error-message" title="template/hero-form-template.component.html" linenums="false">
</code-example>

次のことを確認します。
- フォームに`identityRevealed`バリデータによって返されたクロスバリデーションエラーがありますが、
- ユーザーはまだフォームと[対話](guide/form-validation#why-check-dirty-and-touched)していません。

以上で、クロスバリデーションの例が完成しました。私たちは次のことに成功しました。
- 2つの兄弟コントロールの値に基づいてフォームを検証し、
- ユーザーがフォームと対話してバリデーションが失敗した後、説明的なエラーメッセージが表示されます。

## Async Validation
This section shows how to create asynchronous validators. It assumes some basic knowledge of creating [custom validators](guide/form-validation#custom-validators).

### The Basics
Just like synchronous validators have the `ValidatorFn` and `Validator` interfaces, asynchronous validators have their own counterparts: `AsyncValidatorFn` and `AsyncValidator`.

They are very similar with the only difference being:

* They must return a Promise or an Observable,
* The observable returned must be finite, meaning it must complete at some point. To convert an infinite observable into a finite one, pipe the observable through a filtering operator such as `first`, `last`, `take`, or `takeUntil`.

It is important to note that the asynchronous validation happens after the synchronous validation, and is performed only if the synchronous validation is successful. This check allows forms to avoid potentially expensive async validation processes such as an HTTP request if more basic validation methods fail.

After asynchronous validation begins, the form control enters a `pending` state. You can inspect the control's `pending` property and use it to give visual feedback about the ongoing validation.

A common UI pattern is to show a spinner while the async validation is being performed. The following example presents how to achieve this with template-driven forms:

```html
<input [(ngModel)}="name" #model="ngModel" appSomeAsyncValidator>
<app-spinner *ngIf="model.pending"></app-spinner>
```

### Implementing Custom Async Validator
In the following section, validation is performed asynchronously to ensure that our heroes pick an alter ego that is not already taken. New heroes are constantly enlisting and old heroes are leaving the service. That means that we do not have the list of available alter egos ahead of time.

To validate the potential alter ego, we need to consult a central database of all currently enlisted heroes. The process is asynchronous, so we need a special validator for that.

Let's start by creating the validator class.

<code-example path="form-validation/src/app/shared/alter-ego.directive.ts" region="async-validator" linenums="false"></code-example>

As you can see, the `UniqueAlterEgoValidator` class implements the `AsyncValidator` interface. In the constructor, we inject the `HeroesService` that has the following interface:

```typescript
interface HeroesService {
  isAlterEgoTaken: (alterEgo: string) => Observable<boolean>;
}
```

In a real world application, the `HeroesService` is responsible for making an HTTP request to the hero database to check if the alter ego is available. From the validator's point of view, the actual implementation of the service is not important, so we can just code against the `HeroesService` interface.

As the validation begins, the `UniqueAlterEgoValidator` delegates to the `HeroesService` `isAlterEgoTaken()` method with the current control value. At this point the control is marked as `pending` and remains in this state until the observable chain returned from the `validate()` method completes.

The `isAlterEgoTaken()` method dispatches an HTTP request that checks if the alter ego is available, and returns `Observable<boolean>` as the result. We pipe the response through the `map` operator and transform it into a validation result. As always, we return `null` if the form is valid, and `ValidationErrors` if it is not. We make sure to handle any potential errors with the `catchError` operator.

Here we decided that `isAlterEgoTaken()` error is treated as a successful validation, because failure to make a validation request does not necessarily mean that the alter ego is invalid. You could handle the error differently and return the `ValidationError` object instead.

After some time passes, the observable chain completes and the async validation is done. The `pending` flag is set to `false`, and the form validity is updated.

### Note on performance

By default, all validators are run after every form value change. With synchronous validators, this will not likely have a noticeable impact on application performance. However, it's common for async validators to perform some kind of HTTP request to validate the control. Dispatching an HTTP request after every keystroke could put a strain on the backend API, and should be avoided if possible.

We can delay updating the form validity by changing the `updateOn` property from `change` (default) to `submit` or `blur`.

With template-driven forms:

```html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
```

With reactive forms:

```typescript
new FormControl('', {updateOn: 'blur'});
```

**<live-example></live-example> を実行して、リアクティブおよびテンプレート駆動の完全なサンプルコードを見ることができます。**
