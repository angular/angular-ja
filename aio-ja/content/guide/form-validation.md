# フォームバリデーション




ユーザー入力を検証することにより、正確さと完全性のために全体的なデータ品質を改善します。

このページでは、UIでのユーザー入力の検証方法と、
リアクティブおよびテンプレート駆動フォームの両方を使用した有効な検証メッセージの表示方法を示します。
これは、2つのフォームモジュールの基本的な知識を前提としています。

<div class="alert is-helpful">

フォームをはじめてお使いの場合は、[テンプレート駆動フォーム](guide/forms)と
[リアクティブフォーム](guide/reactive-forms)のガイドを確認してください。

</div>


## テンプレート駆動バリデーション {@a template-driven-validation}

テンプレート駆動フォームにバリデーションを追加するには、
[ネイティブHTMLフォーム](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)の検証と同じ検証属性を追加します。
Angularは、これらの属性をフレームワーク内のバリデータ関数と照合するディレクティブを使用します。

フォームコントロールの値が変更されるたびに、Angularは検証を実行し、
INVALIDステータスに起因する検証エラーのリスト、あるいはVALIDステータスに起因するnullを返します。

`ngModel` をローカルテンプレートの変数にエクスポートすることで、コントロールの状態を調べることができます。
次の例では、 `NgModel` を `name` という名前の変数にエクスポートします:

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-with-error-msg" header="template/hero-form-template.component.html (name)"></code-example>


次の点に注意してください:

* `<input>` 要素は、HTML検証属性、 `required` および `minlength` を保持します。 
また、カスタムバリデータディレクティブの `forbiddenName` も持ちます。 
詳細については、[カスタムバリデータ](guide/form-validation#custom-validators)のセクションを参照してください。

* `#name="ngModel"` は、 `NgModel` を `name` というローカル変数にエクスポートします。 
`NgModel` は、基本となる `FormControl` インスタンスの多くのプロパティを反映しているため、テンプレート内でこれを使用して、 `valid` や `dirty` のようなコントロールの状態をチェックできます。
コントロールプロパティの完全なリストについては、[AbstractControl](api/forms/AbstractControl) APIリファレンスを参照してください。

* `<div>` 要素の `*ngIf` はネストされたメッセージ `divs` のセットを表示しますが、 
`name` が `dirty` か `touched` の場合にのみ表示されます。

* ネストされた各 `<div>` は、考えられる検証エラーの1つに対してカスタムメッセージを表示できます。
`required` 、 `minlength`、 および `forbiddenName` のメッセージがあります。
 

<div class="alert is-helpful">



#### なぜ、 _dirty_ と _touched_ をチェックするのでしょうか？ {@a why-check-dirty-and-touched}

ユーザーがフォームを編集する前に、アプリケーションでエラーを表示したくない場合があります。
`dirty` と `touched` のチェックはユーザーが次の2つのうちのいずれかを実行するまで、エラーが表示されることを防ぎます: 
値を変更し、コントロールをdirtyに変更します; 
フォームコントロール要素をblurするか、コントロールをtouchedするように設定します。

</div>

## リアクティブフォームバリデーション {@a reactive-form-validation}

リアクティブフォームでは, 情報源はコンポーネントクラスです。
テンプレートの属性を介してバリデータを追加する代わりに、
バリデータ関数をコンポーネントクラスのフォームコントロールモデルに直接追加します。
Angularは、コントロールの値が変更されるたびにこれらの関数を呼び出します。

### バリデータ関数

バリデータ関数には、同期バリデータと非同期バリデータの2種類があります。

* **同期バリデータ** : コントロールインスタンスを取得し、ただちに一連の検証エラーまたは `null` を返します。 `FormControl` をインスタンス化するときに、2番目の引数として渡すことができます。

* **非同期バリデータ** : コントロールインスタンスを取得し、PromiseまたはObservableを返し、あとで一連の検証エラーまたはnullを返します。 `FormControl` をインスタンス化するときに、3番目の引数として渡すことができます。

注意: パフォーマンス上の理由から、Angularはすべての同期バリデータが通過する場合にのみ非同期バリデータを実行します。エラーが設定される前にそれぞれ完了しなければなりません。

### 組み込みバリデータ

[独自のバリデータ関数を記述する](guide/form-validation#custom-validators)ことも、Angularの組み込みバリデータを使用することもできます。

`required` や `minlength` など、テンプレート駆動型フォームの属性として使用できる同じ組み込みバリデータは、すべて `Validators` クラスの関数として使用できます。組み込みバリデータの完全なリストについては、[Validators](api/forms/Validators) APIリファレンスを参照してください。

ヒーローフォームをリアクティブフォームに更新するには、
今回は同じ組み込みバリデーターを関数形式で使用することができます。次のコードを見てください:

{@a reactive-component-class}

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="form-group" header="reactive/hero-form-reactive.component.ts (validator functions)"></code-example>

注意してください:

* nameコントロールは、2つの組み込みバリデータ&mdash; `Validators.required` と `Validators.minLength(4)` &mdash;と1つのカスタムバリデータ `forbiddenNameValidator` を設定します。詳細については、このガイドの[カスタムバリデータ](guide/form-validation#custom-validators)セクションを参照してください。
* これらのバリデータはすべて同期バリデータであるため、2番目の引数として渡します。
* 複数のバリデータをサポートするには、関数を配列として渡します。
* この例では、いくつかのgetterメソッドを追加しています。リアクティブフォームでは、親グループの `get` メソッドを通じて常にフォームコントロールにアクセスできますが、
getterをテンプレートの省略名として定義すると便利なことがあります。


再度入力したnameテンプレートを見ると、テンプレート駆動型の例とかなり似ています。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="name-with-error-msg" header="reactive/hero-form-reactive.component.html (name with error msg)"></code-example>

重要なポイント:
 
 * このフォームはディレクティブをエクスポートしなくなり、
 代わりにコンポーネントクラスで定義された `name` getterを使用します。
 * `required` 属性は引き続き存在します。検証の目的では必要ではありませんが、
 CSSのスタイリングやアクセシビリティ上の理由から、テンプレートにそのスタイルを保持したい場合があります。


## カスタムバリデータ {@a custom-validators}

組み込みバリデータは、アプリケーションのユースケースとは必ずしも一致しないので、場合によってはカスタムバリデータを作成することがあります。

このガイドの前の[例](guide/form-validation#reactive-component-class)の 
`forbiddenNameValidator` 関数について考えてみましょう。
その関数の定義は次のようになります:

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator" header="shared/forbidden-name.directive.ts (forbiddenNameValidator)"></code-example>

この関数は実際には、 _特定_ の禁止された名前を検出するために正規表現を取り、バリデータ関数を返すファクトリです。

このサンプルでは、禁じられた名前は "bob" なので、バリデータは "bob" を含むヒーロー名を拒否します。
それ以外の場所では、 "alice" または正規表現で名前を拒否することができます。

`forbiddenNameValidator` ファクトリは、設定されたバリデータ関数を返します。
この関数はAngularコントロールオブジェクトをとり、コントロール値が有効な場合はnull _または_ 
検証エラーオブジェクトを返します。
検証エラーオブジェクトには、通常、nameが検証キーであるプロパティ `'forbiddenName'` と、
エラーメッセージ `{name}` に挿入できる値の順不同な辞書です。

カスタム非同期バリデータは同期バリデータと似ていますが、あとでnullまたは検証エラーオブジェクトを発行するPromiseまたはObservableを返す必要があります。
Observableの場合は、Observableを完了しなければなりません。
この時点で、フォームは検証のために発行された最後の値を使用します。

### リアクティブフォームへ追加 {@a adding-to-reactive-forms}

リアクティブフォームでは、カスタムバリデータは簡単に追加できます。
関数を `FormControl` に直接渡すだけです。

<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.1.ts" region="custom-validator" header="reactive/hero-form-reactive.component.ts (validator functions)"></code-example>

{@a adding-to-template-driven-forms}

### テンプレート駆動型フォームへ追加

テンプレート駆動フォームでは、 `FormControl` インスタンスに直接アクセスすることはできません。したがって、リアクティブフォームの場合と同じようにバリデータを渡すことはできません。代わりに、ディレクティブをテンプレートに追加する必要があります。

対応する `ForbiddenValidatorDirective` は、 `forbiddenNameValidator` のラッパーとして機能します。

Angularは、ディレクティブが拡張可能なバリデータのコレクションをもつプロバイダーである `NG_VALIDATORS` プロバイダーに自身を登録するため、ディレクティブの検証プロセスにおける役割を認識します。

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers" header="shared/forbidden-name.directive.ts (providers)"></code-example>

ディレクティブクラスは、 `Validator` インターフェースを実装しているため、
Angularフォームと簡単に統合できます。これはどのようにそれらをまとめるかを理解するための、
ディレクティブの残りの部分です:

<code-example path="form-validation/src/app/shared/forbidden-name.directive.ts" region="directive" header="shared/forbidden-name.directive.ts (directive)">
</code-example>

`ForbiddenValidatorDirective` が準備されたら、 `appForbiddenName` セレクターを任意の入力要素に追加して、アクティブ化できます。これは一例です:

<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="name-input" header="template/hero-form-template.component.html (forbidden-name-input)"></code-example>


<div class="alert is-helpful">

カスタム検証ディレクティブは、 `useClass` ではなく `useExisting` でインスタンス化されていることに気付かれるかもしれません。登録されたバリデータは、この `ForbiddenValidatorDirective` の _インスタンス_ でなければなりません&mdash; `forbiddenName` プロパティが "bob" にバインドされたフォームのインスタンス。 `useExisting` を `useClass` に置き換えた場合は、 `forbiddenName` を持たない新しいクラスインスタンスを登録することになります。

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

ヒーローフォームでは、 `.ng-valid` クラスと `.ng-invalid` クラスを使用して、各フォームコントロールの境界線の色を設定します。

<code-example path="form-validation/src/assets/forms.css" header="forms.css (status classes)">

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

名前とalterEgoは兄弟コントロールであることに注意してください。単一のカスタムバリデーターで両方のコントロールを評価するには、共通の祖先コントロールである `FormGroup` でバリデーションを実行する必要があります。こうすることで、値を比較することができる子コントロールの `FormGroup` を照会することができます。

バリデータを `FormGroup` に追加するには、作成時に2番目の引数として新しいバリデータを渡します。

```javascript
const heroForm = new FormGroup({
  'name': new FormControl(),
  'alterEgo': new FormControl(),
  'power': new FormControl()
}, { validators: identityRevealedValidator });
```

バリデータのコードは次のとおりです。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-validator" header="shared/identity-revealed.directive.ts"></code-example>

アイデンティティのバリデーターは、 `ValidatorFn` インターフェースを実装します。Angularコントロールオブジェクトを引数としてとり、フォームが有効な場合はnullを返し、それ以外の場合は `ValidationErrors` を返します。

最初に、 `FormGroup` の[get](api/forms/AbstractControl#get)メソッドを呼び出すことによって子コントロールを取得します。次に、 `name` と `alterEgo` コントロールの値を単純に比較します。

値が一致しない場合、ヒーローのアイデンティティは秘密のままであり、安全にnullを返すことができます。それ以外の場合、ヒーローのアイデンティティが明らかになり、エラーオブジェクトを返すことでフォームを無効としてマークする必要があります。

次に、ユーザー体験を向上させるために、フォームが無効な場合に適切なエラーメッセージが表示されます。
<code-example path="form-validation/src/app/reactive/hero-form-reactive.component.html" region="cross-validation-error-message" header="reactive/hero-form-template.component.html"></code-example>

次のことを確認します。
- `FormGroup` は `identityRevealed` バリデータによって返されたクロスバリデーションエラーを持ちますが、
- ユーザーはまだフォームと[対話](guide/form-validation#why-check-dirty-and-touched)していません。

### テンプレート駆動型フォームへの追加
まず、バリデータ関数をラップするディレクティブを作成する必要があります。 `NG_VALIDATORS` トークンを使用してバリデータとして提供します。理由がわからない場合や構文を完全に理解していない場合は、前の[セクション](guide/form-validation#adding-to-template-driven-forms)に戻ってください。

<code-example path="form-validation/src/app/shared/identity-revealed.directive.ts" region="cross-validation-directive" header="shared/identity-revealed.directive.ts"></code-example>

次に、このディレクティブをHTMLテンプレートに追加する必要があります。バリデーターはフォームの最上位レベルに登録する必要があるため、このディレクティブを `form` タグに置きます。
<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-register-validator" header="template/hero-form-template.component.html"></code-example>

ユーザー体験を向上させるため、フォームが無効な場合に適切なエラーメッセージが表示されます。
<code-example path="form-validation/src/app/template/hero-form-template.component.html" region="cross-validation-error-message" header="template/hero-form-template.component.html"></code-example>
次のことを確認します。
- フォームに `identityRevealed` バリデータによって返されたクロスバリデーションエラーがありますが、
- ユーザーはまだフォームと[対話](guide/form-validation#why-check-dirty-and-touched)していません。

以上で、クロスバリデーションの例が完成しました。私たちは次のことに成功しました。
- 2つの兄弟コントロールの値に基づいてフォームを検証し、
- ユーザーがフォームと対話してバリデーションが失敗した後、説明的なエラーメッセージが表示されます。

## 非同期バリデーション
このセクションでは、非同期バリデータを作成する方法を示します。[カスタムバリデータ](guide/form-validation#custom-validators)の作成に関するいくつかの基本的な知識を前提としています。

### 基礎
同期バリデータに `ValidatorFn` と `Validator` のインターフェースがあるように、非同期バリデータにも `AsyncValidatorFn` と `AsyncValidator` という独自の対があります。

これらは非常によく似ています。唯一の違いは:

* これらはPromiseまたはObservableを返さなければいけません。
* Observableから返されるのは有限でなければなりません、つまりある時点で完了しなければならないということです。無限のObservableから有限のObservableに変換するには、Observableを `first` 、 `last` 、 `take` 、 `takeUntil` などのフィルタオペレーターでパイプ処理を行います。

非同期バリデーションは同期バリデーションのあとに行われ、同期バリデーションが成功した場合にのみ実行されることに注意することが重要です。このチェックでは、より基本的な検証が失敗した場合にフォームがHTTP要求などの高価な非同期バリデーションプロセスを回避することができます。

非同期バリデーションが開始されると、フォームコントロールは `pending` 状態になります。コントロールの `pending` 中のプロパティを検査し、それを使用して進行中の検証に関する視覚的なフィードバックを与えることができます。

一般的なUIパターンは、非同期バリデーションが実行されている間にスピナーを表示することです。
次の例は、テンプレート駆動フォームでこれを実現する方法を示しています:

```html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
<app-spinner *ngIf="model.pending"></app-spinner>
```

### カスタム非同期バリデータの実装
次のセクションでは、検証が非同期的に実行されて、ヒーローがまだ取られていない別人格を確実に選択するようにしています。新しいヒーローたちは絶えず入隊しており、古いヒーローたちはこのサービスを離れることになっています。これは、事前に利用可能な別人格の一覧を持っていないことを意味します。

Observableな別人格を検証するためには、現在入隊しているすべてのヒーローの中央データベースを調べる必要があります。その処理は非同期なので、特別なバリデーターが必要です。

まずバリデータクラスを作成しましょう。

<code-example path="form-validation/src/app/shared/alter-ego.directive.ts" region="async-validator"></code-example>

ご覧のとおり、 `UniqueAlterEgoValidator` クラスは `AsyncValidator` インターフェースを実装しています。コンストラクターでは、次のインターフェースをもつ `HeroesService` を注入します。

```typescript
interface HeroesService {
  isAlterEgoTaken: (alterEgo: string) => Observable<boolean>;
}
```

現実のアプリケーションでは、 `HeroesService` はヒーローデータベースへのHTTP要求を行い、別人格が利用可能かどうかをチェックします。バリデーターの観点から見ると、実際のサービスの実装は重要ではないので、 `HeroesService` インターフェースに対してコードを記述することができます。

検証が開始されると、 `UniqueAlterEgoValidator` は `HeroesService` の `isAlterEgoTaken()` メソッドに現在のコントロール値を委譲します。この時点で、コントロールは `pending` としてマークされ、 `validate()` メソッドから返されたObservableチェーンが完了するまでこの状態にとどまります。

`isAlterEgoTaken()` メソッドは、別人格が利用可能かどうかをチェックするHTTP要求を送出し、結果として `Observable<boolean>` を返します。 `map` オペレーターを通して応答をパイプし、検証結果に変換します。常に、フォームが有効な場合は `null` を返し、そうでない場合は `ValidationErrors` を返します。 `catchError` オペレーターを使用して、潜在的なエラーを確実に処理します。

ここで、 `isAlterEgoTaken()` のエラーは、検証が成功したものとして扱われることにしました。なぜなら、検証リクエストの失敗が必ずしも別人格が無効であることを意味するとは限らないからです。エラーを別の方法で処理し、代わりに `ValidationError` オブジェクトを返すことができます。

しばらくすると、Observableチェーンが完了し、非同期バリデーションが実行されます。 `pending` フラグは `false` に設定され、フォームの有効性が更新されます。

### パフォーマンスに関する注意

デフォルトでは、フォームの値が変更されるたびに、すべてのバリデーターが実行されます。同期バリデータを使用すると、アプリケーションのパフォーマンスに大きな影響を与えることはありません。しかし、非同期バリデータでは、何らかの種類のHTTPリクエストを実行してコントロールを検証するのが一般的です。すべてのキーストロークのあとででHTTPリクエストを送信すると、バックエンドAPIに負担がかかり、可能であれば避けるべきです。

`updateOn` プロパティを `change` （デフォルト）から `submit` または `blur` に変更することでフォームの有効性の更新を遅らせることができます。

テンプレート駆動フォームの場合:

```html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
```

リアクティブフォームの場合:

```typescript
new FormControl('', {updateOn: 'blur'});
```

**<live-example></live-example> を実行して、リアクティブおよびテンプレート駆動の完全なサンプルコードを見ることができます。**
