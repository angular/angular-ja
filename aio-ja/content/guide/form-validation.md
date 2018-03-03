# フォームバリデーション




ユーザー入力を検証することにより、正確さと完全性のために全体的なデータ品質を改善します。

このページでは、UIでのユーザー入力の検証方法と、リアクティブおよびテンプレート駆動フォームの両方を使用した有効な検証メッセージの表示方法を示します。これは、2つのフォームモジュールの基本的な知識を前提としています。

<div class="l-sub-section">

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
 

<div class="l-sub-section">



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

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.ts" region="form-group" title="reactive/hero-form-reactive.component.ts (validator functions)" linenums="false">
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

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.ts" region="custom-validator" title="reactive/hero-form-reactive.component.ts (validator functions)" linenums="false">
</code-example>

### テンプレート駆動型フォームへ追加

テンプレート駆動フォームでは、`FormControl`インスタンスに直接アクセスすることはできません。したがって、リアクティブフォームの場合と同じようにバリデータを渡すことはできません。代わりに、ディレクティブをテンプレートに追加する必要があります。

対応する`ForbiddenValidatorDirective`は、`forbiddenNameValidator`のラッパーとして機能します。

Angularは、ディレクティブが拡張可能なバリデータのコレクションをもつプロバイダーである`NG_VALIDATORS`プロバイダーに自身を登録するため、ディレクティブの検証プロセスにおける役割を認識します。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers" title="shared/forbidden-name.directive.ts (providers)" linenums="false">
</code-example>

ディレクティブクラスは、`Validator`インターフェイスを実装しているため、Angularフォームと簡単に統合できます。 これはどのようにそれらをまとめるかを理解するための、ディレクティブの残りの部分です:

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive" title="shared/forbidden-name.directive.ts (directive)">
</code-example>

`ForbiddenValidatorDirective`が準備されたら、`forbiddenName`セレクタを任意の入力要素に追加して、アクティブ化できます。これは一例です:

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-input" title="template/hero-form-template.component.html (forbidden-name-input)" linenums="false">

</code-example>


<div class="l-sub-section">

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


**<live-example></live-example> を実行して、リアクティブおよびテンプレート駆動の完全なサンプルコードを見ることができます。**
