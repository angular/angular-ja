# フォーム入力のバリデーション

ユーザー入力の正確性と完全性を検証することで、全体的なデータ品質を向上させることができます。
このページでは、リアクティブフォームとテンプレート駆動フォームの両方で、
UIでのユーザー入力の検証方法と、有効な検証メッセージの表示方法を示します。

**前提条件**

フォームバリデーションについて読む前に、次の事項の基本を理解しておく必要があります。

* [TypeScript](https://www.typescriptlang.org/ "The TypeScript language")とHTML5を使ったプログラミング。

* [Angularアプリ設計](guide/architecture "Angular概念の紹介") の基本的な概念。

* [Angularがサポートする２種類のフォーム](guide/forms-overview "Angularのフォームのイントロダクション")。

* [テンプレート駆動フォーム](guide/forms "テンプレート駆動フォーム")または[リアクティブフォーム](guide/reactive-forms "リアクティブフォーム")、どちらかの基本。

<div class="alert is-helpful">

フォームバリデーションの説明のために、リアクティブフォームとテンプレート駆動フォームの完全なサンプルコードを入手してください。
<live-example></live-example>を起動しましょう。

</div>

{@a template-driven-validation}

## テンプレート駆動フォームのバリデーション

テンプレート駆動フォームにバリデーションを追加するには、
[ネイティブHTMLフォームバリデーション](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)と同じバリデーション属性を追加します。
Angularはディレクティブを使用して、これらの属性をフレームワークのバリデーター関数と照合します。

フォームコントロールの値が変更されるたびに、Angularはバリデーションを実行し、
INVALIDステータスになるバリデーションエラーのリスト、あるいはVALIDステータスになるnullを返します。

`ngModel`をローカルテンプレートの変数にエクスポートすることで、コントロールの状態を調べることができます。
次の例では、`NgModel`を`name`という名前の変数にエクスポートします:

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-with-error-msg" header="template/hero-form-template.component.html (name)"></code-example>

サンプルに示されている、次の点に注意してください。

* `<input>`要素は、HTMLバリデーター属性、`required`および`minlength`を保持します。
また、カスタムバリデーターディレクティブの`forbiddenName`も搭載しています。
詳細は、[カスタムバリデーター](#custom-validators)セクションを参照してください。

* `#name="ngModel"`は、`NgModel`を`name`というローカル変数にエクスポートします。
`NgModel`は、基本となる`FormControl`インスタンスの多くのプロパティを反映しているため、テンプレート内でこれを使用して、`valid`や`dirty`のようなコントロールの状態をチェックできます。
コントロールプロパティ一覧については、[AbstractControl](api/forms/AbstractControl)APIリファレンスを参照してください。

   * `<div>`要素の`*ngIf`はネストされたメッセージ`divs`のセットを表示しますが、
`name`が無効かつコントロールが`dirty`または`touched`の場合に限ります。

   * ネストされた各`<div>`は、考えられるバリデーションエラーの1つに対してカスタムメッセージを表示できます。
`required`、`minlength`、および`forbiddenName`のメッセージがあります。

{@a dirty-or-touched}

<div class="alert is-helpful">

ユーザーがフォームを編集する前にバリデーターがエラーを表示しないようにするには、コントロールの`dirty`または`touched`ステータスを確認する必要があります。

* ユーザーが監視フィールドの値を変更すると、コントロールは"dirty"としてマークされます。
* ユーザーがフォームコントロール要素をフォーカスすると、コントロールは"touched"としてマークされます。

</div>

{@a reactive-form-validation}

## リアクティブフォームのバリデーション

リアクティブフォームでは、信頼できる情報源はコンポーネントクラスです。
テンプレートの属性を介してバリデータを追加する代わりに、バリデータ関数をコンポーネントクラスのフォームコントロールモデルに直接追加します。
Angularは、コントロールの値が変更されるたびにこれらの関数を呼び出します。

### バリデーター関数

バリデーター関数には、同期バリデーターと非同期バリデーターがあります。

* **同期バリデーター** : コントロールインスタンスを取得し、ただちに一連のバリデーションエラーまたは`null`を返します。`FormControl`をインスタンス化するときに、第2引数として渡すことができます。

* **非同期バリデーター** : コントロールインスタンスを取得してPromiseまたはObservableを返し、
その後で一連のバリデーションエラーまたは`null`を返します。
`FormControl`をインスタンス化するときに、第3引数として渡すことができます。

パフォーマンス上の理由から、Angularはすべての同期バリデーターが通過する場合にのみ非同期バリデーターを実行します。エラーが設定される前にそれぞれ完了しなければなりません。

### 組み込みバリデーター関数

[独自のバリデーター関数を記述する](#custom-validators)ことも、Angularの組み込みバリデーターを使用することもできます。

`required`や`minlength`など、テンプレート駆動型フォームの属性として使用できる同じ組み込みバリデーターは、すべて`Validators`クラスの関数として使用できます。
組み込みバリデーターの完全なリストについては、[Validators](api/forms/Validators)APIリファレンスを参照してください。

ヒーローフォームをリアクティブフォームに更新するには、
今回は関数形式のフォームの、次のサンプルコードと同じ組み込みバリデーターを使用することができます。

{@a reactive-component-class}

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="form-group" header="reactive/hero-form-reactive.component.ts (validator functions)"></code-example>

このサンプルでは、`name`コントロールは、2つの組み込みバリデーター&mdash;`Validators.required`と`Validators.minLength(4)`&mdash;と1つのカスタムバリデーター`forbiddenNameValidator`を設定します。詳細は、次の[カスタムバリデーター](#custom-validators)を参照してください。

これらのバリデーターはすべて同期バリデーターであるため、2番目の引数として渡します。関数を配列として渡すことで、複数のバリデーターをサポートできます。

この例では、いくつかのgetterメソッドを追加しています。リアクティブフォームでは、親グループの`get`メソッドを通じていつでも任意のフォームコントロールにアクセスできますが、getterをテンプレートの省略名として定義すると便利な場合があります。

再度、`name`inputのテンプレートを見ると、テンプレート駆動フォームの例とかなり似ています。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="name-with-error-msg" header="reactive/hero-form-reactive.component.html (name with error msg)"></code-example>

このフォームは、ディレクティブをエクスポートしないという点で、テンプレート駆動型バージョンとは異なります。代わりに、コンポーネントクラスで定義された`name`getterを使用します。

`required`属性がまだテンプレートに存在していることに注意してください。検証には必要ありませんが、アクセシビリティの目的で保持する必要があります。

{@a custom-validators}

## カスタムバリデーター

組み込みバリデーターは、アプリケーションのユースケースとは必ずしも一致しないので、場合によってはカスタムバリデーターを作成することがあります。

このガイドの前の項目である[リアクティブフォームのサンプル](#reactive-component-class)の`forbiddenNameValidator`関数について考えてみましょう。
その関数の定義は次のようになります。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator" header="shared/forbidden-name.directive.ts (forbiddenNameValidator)"></code-example>

この関数は実際には、_特定_の禁止された名前を検出するために正規表現を取り、バリデーター関数を返すファクトリです。

このサンプルでは、禁じられた名前は"bob"なので、バリデーターは"bob"を含むいかなるヒーロー名を拒否します。
それ以外の場所では、"alice"または正規表現に一致する任意の名前を拒否することができます。

`forbiddenNameValidator`ファクトリは、設定されたバリデーター関数を返します。
この関数はAngularコントロールオブジェクトをとり、コントロール値が有効な場合はnull _または_
バリデーションエラーオブジェクトを返します。
バリデーションエラーオブジェクトは、通常、nameがバリデーションキーであるプロパティ`'forbiddenName'`と、
エラーメッセージ`{name}`に挿入できる値の任意のリストを持っています。

カスタム非同期バリデーターは同期バリデーターと似ていますが、あとでnullまたはバリデーションエラーオブジェクトを発行するPromiseまたはObservableを返す必要があります。
Observableの場合は、Observableを完了する必要があります。フォームは、検証のために発行された最後の値を使用します。

{@a adding-to-reactive-forms}

### カスタムバリデーターをリアクティブフォームに追加する

リアクティブフォームでは、関数を`FormControl`に直接渡すことでカスタムバリデーターを追加できます。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="custom-validator" header="reactive/hero-form-reactive.component.ts (validator functions)"></code-example>

{@a adding-to-template-driven-forms}

### カスタムバリデーターをテンプレート駆動フォームに追加する

テンプレート駆動フォームでは、バリデーター関数をラップしているディレクティブをテンプレートに追加します。
たとえば、対応する`ForbiddenValidatorDirective`は`forbiddenNameValidator`のラッパーとして機能します。

次の例に示すように、ディレクティブはそれ自体を`NG_VALIDATORS`プロバイダーに登録するため、Angularは検証プロセスにおけるディレクティブの役割を認識します。
`NG_VALIDATORS`は、バリデーターの拡張可能なコレクションを備えた事前定義されたプロバイダーです。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers" header="shared/forbidden-name.directive.ts (providers)"></code-example>

ディレクティブクラスは`Validator`インターフェースを実装するため、Angularのフォームと
簡単に統合できます。
これは、すべてがどのように行われるかを理解するのに役立つ残りの
ディレクティブです。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive" header="shared/forbidden-name.directive.ts (directive)">
</code-example>

`ForbiddenValidatorDirective`が準備されたら、`appForbiddenName`セレクターを任意の入力要素に追加してアクティブ化できます。
これは一例です：

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-input" header="template/hero-form-template.component.html (forbidden-name-input)"></code-example>


<div class="alert is-helpful">

カスタムバリデーションディレクティブは、`useClass`ではなく`useExisting`でインスタンス化されることに注意してください。登録されたバリデーターは、`ForbiddenValidatorDirective`_インスタンス_でなければなりません。
&mdash;`forbiddenName`プロパティを含むそのフォームのインスタンスは、
"bob"にバインドされています。

`useExisting`を`useClass`に置き換えた場合は、`forbiddenName`を持たない新しいクラスインスタンスを登録することになります。

</div>

## コントロールステータスCSSクラス

Angularは、多くのコントロールプロパティをCSSクラスとしてフォームコントロール要素に自動的にミラーリングします。これらのクラスを使用して、フォームの状態に応じてフォーム制御要素のスタイルを設定できます。
現在サポートされているクラスは次のとおりです：

* `.ng-valid`
* `.ng-invalid`
* `.ng-pending`
* `.ng-pristine`
* `.ng-dirty`
* `.ng-untouched`
* `.ng-touched`
* `.ng-submitted` (enclosing form element only)

次のサンプルでは、ヒーローフォームは`.ng-valid`と`.ng-invalid`クラスを使用して、
各フォームコントロールの境界線の色を設定しています。

<code-example path="form-validation/src/assets/forms.css" header="forms.css (status classes)">

</code-example>

## クロスフィールドバリデーション

クロスフィールドバリデーションは、フォーム内の異なる複数のフィールドの値を比較し、それらを組み合わせて許容または拒否する[カスタムバリデーター](#custom-validators "Read about custom validators")です。
たとえば、相互に互換性のないオプションを提供するフォームがある場合に、ユーザーはAまたはBを選択できるが、両方を選択できないようにすることができます。
一部のフィールド値が他の値に依存する場合もあります。たとえば、ユーザーはAが選択されている場合にのみ、Bを選択できるようにすることができます。

次のクロスバリデーションの例は、次の方法を示しています。

* 2つの兄弟コントロールの値に基づいて、リアクティブまたはテンプレートベースのフォーム入力を検証します。
* ユーザーがフォームを操作し、検証が失敗した後、説明的なエラーメッセージを表示します。

サンプルでは、クロスバリデーションを使用して、ヒーローフォームに記入することでヒーローが真のアイデンティティを明らかにしないようにしています。バリデーターは、ヒーロー名とそのalter egoが一致しないことを確認することで、これを行います。

### クロスバリデーションをリアクティブフォームに追加する

フォームの構造は次のとおりです。

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
});
```

`name`と`alterEgo`は兄弟コントロールであることに注意してください。
単一のカスタムバリデーターで両方のコントロールを評価するには、共通の祖先コントロールである`FormGroup`でバリデーションを実行する必要があります。
`FormGroup`を実行して、子コントロールの値を比較できます。

バリデーターを`FormGroup`に追加するには、作成時に2番目の引数として新しいバリデーターを渡します。

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
}, { validators: identityRevealedValidator });
```

バリデーターのコードは次のとおりです。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-validator" header="shared/identity-revealed.directive.ts"></code-example>

アイデンティティのバリデーターは、`ValidatorFn`インターフェースを実装します。Angularコントロールオブジェクトを引数としてとり、フォームが有効な場合はnullを返し、それ以外の場合は`ValidationErrors`を返します。

バリデーターは、`FormGroup`の[get](api/forms/AbstractControl#get)メソッドを呼び出すことで子コントロールを取得し、`name`と`alterEgo`コントロールの値を比較します。

値が一致しない場合、ヒーローのアイデンティティは秘密のままであり、両方とも有効となり、バリデーターはnullを返します。
値が一致する場合、ヒーローのアイデンティティは明らかになり、バリデーターはエラーオブジェクトを返すことでフォームを無効としてマークします。

よりよいユーザー体験を提供するために、フォームが無効な場合、テンプレートは適切なエラーメッセージを表示します。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="cross-validation-error-message" header="reactive/hero-form-template.component.html"></code-example>

この`*ngIf`は、`FormGroup`が`identityRevealed`バリデーターによってクロスバリデーションエラーをもつ場合に、エラーを表示しますが、これはユーザーが[フォーム入力](#dirty-or-touched)を終了した場合に限ります。

### テンプレート駆動フォームにクロスバリデーションを追加する

テンプレート駆動フォームの場合、バリデーター関数をラップするディレクティブを作成する必要があります。
次の例で示すように、[`NG_VALIDATORS` token](#adding-to-template-driven-forms "バリデーターの提供について読む")を使用して、ディレクティブをバリデーターとして提供します。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-directive" header="shared/identity-revealed.directive.ts"></code-example>

この新しいディレクティブをHTMLテンプレートに追加する必要があります。
バリデーターはフォームの最高位レベルに登録する必要があるため、このディレクティブを`form`タグに置きます。

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-register-validator" header="template/hero-form-template.component.html"></code-example>

ユーザー体験を提供するため、フォームが無効な場合は適切なエラーメッセージが表示されます。

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-error-message" header="template/hero-form-template.component.html"></code-example>

これは、テンプレート駆動フォームでもリアクティブフォームでも同じです。

## 非同期バリデーションの作成

非同期バリデーターは`AsyncValidatorFn`と`AsyncValidator`インターフェースを実装しています。
これらは、対応する同期バリデーターと非常に似ていますが、次の違いがあります。

* `validate()`関数は必ずPromiseまたはobservableを返します。
* observableは必ず有限な値を返します。つまり、ある時点で完了しなければならないということです。
無限のobservableを有限に変換するには、observableを`first`、`last`、`take`または`takeUntil`などのフィルタリングオペレーターを使用してパイプ処理を行います。

非同期バリデーションは同期バリデーションの後に行われ、また同期バリデーションが成功した場合にのみ発動します。
このチェックにより、より基本的なバリデーションメソッドで無効な入力がすでに検出されている場合に、フォームが(HTTPリクエストのような)膨大なコストのかかる非同期バリデーションを実行することを回避することができます。

非同期バリデーションが開始すると、フォームコントロールは`pending`状態になります。コントロールの`pending`プロパティを検証することで、進行中の検証についての視覚的なフィードバックを得ることができます。

一般的なUIパターンは、非同期バリデーションが実行されている間にスピナーを表示することです。次のサンプルでは、テンプレート駆動フォームでこれを実現する方法を示しています。

```html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
<app-spinner *ngIf="model.pending"></app-spinner>
```

### カスタム非同期バリデーターの実装

次のサンプルでは、非同期バリデーターはヒーローがまだ選ばれていないalter egoを選択するようにしています。
新しいヒーロー達は絶えず入隊して、古いヒーロー達はサービスを離れます。利用可能なalter egoのリストが事前に取得できないようにするためです。
潜在的なalter egoの検証をするには、バリデーターは現時点で存在するヒーローの中央データベースを確認するために、非同期オペレーションを開始する必要があります。

次のコードは、`AsyncValidator`インターフェースを実装するバリデータークラス`UniqueAlterEgoValidator`を作成しています。

<code-example path="form-validation/src/app/shared/alter-ego.directive.ts" region="async-validator"></code-example>

コンストラクターは、次のインターフェースを定義するために`HeroesService`を注入しています。

```typescript
interface HeroesService {
  isAlterEgoTaken: (alterEgo: string) => Observable<boolean>;
}
```

実際のアプリケーションでは、`HeroesService`はヒーローデータベースへHTTPリクエストを行い、alter egoが利用可能かどうかを確認します。
バリデーターの観点から見ると、サービスの実際の実装は重要ではないので、このサンプルでは`HeroesService`インターフェースに対してコードを記述するだけで済みます。

検証が開始されると、`UniqueAlterEgoValidator`は`HeroesService`の`isAlterEgoTaken()`メソッドに現在のコントロール値を委譲します。
この時点で、コントロールは`pending`としてマークされ、`validate()`メソッドから返されたobservableチェーンが完了するまでこの状態にとどまります。

`isAlterEgoTaken()`メソッドは、alter egoが利用可能かどうかをチェックするHTTPリクエストを送出し、結果として`Observable<boolean>`を返します。
`validate()`メソッドは`map`オペレーターを介してレスポンスをパイプ処理し、検証結果に変換します。

このメソッドは、他のバリデーターと同様に、フォームが有効な場合は`null`を返し、そうでない場合は`ValidationErrors`を返します。
このバリデーターは、`catchError`オペレーターを使用して潜在的なエラーを処理します。
この場合、バリデーションリクエストが失敗したからといってalter egoが無効であるとは限らないため、バリデーターは`isAlterEgoTaken()`エラーを検証の成功として扱います。
エラーを別の方法で処理し、代わりに`ValidationError`オブジェクトを返すことができます。

しばらくすると、observableチェーンが完了し、非同期検証が実行されます。
`pending`フラグは`false`に設定され、フォームの有効性が更新されます。

### Adding async validators to reactive forms

To use an async validator in reactive forms, begin by injecting the validator into the constructor of the component class.

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.2.ts" region="async-validator-inject"></code-example>

Then, pass the validator function directly to the `FormControl` to apply it.

In the following example, the `validate` function of `UniqueAlterEgoValidator` is applied to `alterEgoControl` by passing it to the control's `asyncValidators` option and binding it to the instance of `UniqueAlterEgoValidator` that was injected into `HeroFormReactiveComponent`.
The value of `asyncValidators` can be either a single async validator function, or an array of functions.
To learn more about `FormControl` options, see the [AbstractControlOptions](api/forms/AbstractControlOptions) API reference.

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.2.ts" region="async-validator-usage"></code-example>

### Adding async validators to template-driven forms

To use an async validator in template-driven forms, create a new directive and register the `NG_ASYNC_VALIDATORS` provider on it.

In the example below, the directive injects the `UniqueAlterEgoValidator` class that contains the actual validation logic and invokes it in the `validate` function, triggered by Angular when validation should happen.

<code-example path="form-validation/src/app/shared/alter-ego.directive.ts" region="async-validator-directive"></code-example>

Then, as with synchronous validators, add the directive's selector to an input to activate it.

<code-example header="template/hero-form-template.component.html (unique-alter-ego-input)" path="form-validation/src/app/template/hero-form-template.component.html" region="alterEgo-input"></code-example>

### 非同期バリデーターのパフォーマンスの最適化

デフォルトでは、すべてのバリデーターはフォーム値が変更されるたびに実行されます。これは通常、同期バリデーターではアプリケーションのパフォーマンスに目立った影響を与えません。
ただし、非同期バリデーターは通常、何らかのHTTPリクエストを実行してコントロールを検証します。キーストロークごとにHTTPリクエストを送信すると、バックエンドAPIに負担がかかる可能性があるため、可能であれば回避する必要があります。

`updateOn`プロパティを`change`(デフォルト)から`submit`または`blur`に変更することで、フォームの有効性の更新を遅らせることができます。

テンプレート駆動型フォームでは、テンプレートにプロパティを設定します。

```html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
```

リアクティブフォームでは、`FormControl`インスタンスにプロパティを設定します。

```typescript
new FormControl('', {updateOn: 'blur'});
```

## Interaction with native HTML form validation

By default, Angular disables [native HTML form validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation) by adding the `novalidate` attribute on the enclosing `<form>` and uses directives to match these attributes with validator functions in the framework. If you want to use native validation **in combination** with Angular-based validation, you can re-enable it with the `ngNativeValidate` directive. See the [API docs](api/forms/NgForm#native-dom-validation-ui) for details.

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-09-12
