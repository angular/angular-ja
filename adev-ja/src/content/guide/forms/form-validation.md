# フォーム入力の検証

正確性と完全性を確保するために、ユーザー入力を検証することで、データ品質を全体的に向上させることができます。
このページでは、UIからのユーザー入力を検証し、リアクティブフォームとテンプレート駆動フォームの両方で、役立つ検証メッセージを表示する方法について説明します。

## テンプレート駆動フォームでの入力検証

テンプレート駆動フォームに検証を追加するには、[ネイティブHTMLフォーム検証](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation)の場合と同じように、検証属性を追加します。
Angularは、これらの属性をフレームワーク内のバリデーター関数と一致させるためにディレクティブを使用します。

フォームコントロールの値が変更されるたびに、Angularは検証し、検証エラーのリスト（`INVALID`ステータスをもたらす）または`null`（`VALID`ステータスをもたらす）を生成します。

その後、`ngModel`をローカルテンプレート変数にエクスポートすることで、コントロールの状態を調べることができます。
次の例では、`NgModel`を`name`という変数にエクスポートします。

<docs-code header="template/actor-form-template.component.html (name)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-with-error-msg"/>

例で示されている次の機能に注目してください。

* `<input>`要素には、HTML検証属性(`required`と`minlength`)があります。
    また、カスタムバリデーターディレクティブ`forbiddenName`もあります。
    詳細については、[カスタムバリデーター](#defining-custom-validators)セクションを参照してください。

* `#name="ngModel"`は、`NgModel`を`name`というローカル変数にエクスポートします。
    `NgModel`は、基になる`FormControl`インスタンスの多くのプロパティをミラーリングしているため、テンプレート内でこれを使用して、`valid`や`dirty`などのコントロールの状態を確認できます。
    コントロールプロパティの完全なリストについては、[AbstractControl](api/forms/AbstractControl) APIリファレンスを参照してください。

  * The outermost `@if` reveals a set of nested messages but only if the `name` is invalid and the control is either `dirty` or `touched`.

  * Each nested `@if` can present a custom message for one of the possible validation errors.
        `required`、`minlength`、`forbiddenName`のメッセージがあります。

HELPFUL: ユーザーがフォームを編集する機会がある前に、バリデーターがエラーを表示しないようにするには、コントロールの`dirty`または`touched`状態のいずれかをチェックする必要があります。

* ユーザーが監視対象のフィールドの値を変更すると、コントロールは「dirty」としてマークされます。
* ユーザーがフォームコントロール要素からフォーカスを外すと、コントロールは「touched」としてマークされます。

## リアクティブフォームでの入力検証

リアクティブフォームでは、真実の源はコンポーネントクラスです。
テンプレートで属性を通じてバリデーターを追加する代わりに、コンポーネントクラスのフォームコントロールモデルに直接バリデーター関数を追加します。
その後、Angularは、コントロールの値が変更されるたびにこれらの関数を呼び出します。

### バリデーター関数

バリデーター関数は、同期または非同期にすることができます。

| バリデーターの種類   | 詳細 |
|:---              |:---     |
| 同期バリデーター  | コントロールインスタンスを受け取り、検証エラーのセットまたは`null`をすぐに返す同期関数。`FormControl`をインスタンス化する際に、第2引数として渡します。                       |
| 非同期バリデーター | コントロールインスタンスを受け取り、後で検証エラーのセットまたは`null`を発行するPromiseまたはObservableを返す非同期関数。`FormControl`をインスタンス化する際に、第3引数として渡します。 |

パフォーマンス上の理由から、Angularは、すべての同期バリデーターが合格した場合にのみ非同期バリデーターを実行します。
各バリデーターは、エラーが設定される前に完了する必要があります。

### 組み込みのバリデーター関数

[独自のバリデーター関数](#defining-custom-validators)を作成することも、Angularの組み込みのバリデーターのいくつかを使用することもできます。

`required`や`minlength`など、テンプレート駆動フォームで属性として使用できるものと同じ組み込みバリデーターはすべて、`Validators`クラスから関数として使用できます。
組み込みのバリデーターの完全なリストについては、[Validators](api/forms/Validators) APIリファレンスを参照してください。

アクターフォームをリアクティブフォームに更新するには、いくつかの組み込みバリデーターを使用します。
今回は、関数形式で、次の例のようにします。

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="form-group"/>

この例では、`name`コントロールは、2つの組み込みバリデーター(`Validators.required`と`Validators.minLength(4)`)と、1つのカスタムバリデーター`forbiddenNameValidator`を設定しています。

これらすべてのバリデーターは同期であるため、第2引数として渡されます。
関数を配列として渡すことで、複数のバリデーターをサポートできることに注意してください。

この例では、いくつかのゲッターメソッドも追加されています。
リアクティブフォームでは、常に親グループの`get`メソッドを通じて任意のフォームコントロールにアクセスできますが、テンプレートの省略形としてゲッターを定義することが便利な場合があります。

`name`入力のテンプレートをもう一度見ると、テンプレート駆動の例とかなり似ています。

<docs-code header="reactive/actor-form-reactive.component.html (name with error msg)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="name-with-error-msg"/>

このフォームは、テンプレート駆動バージョンとは、ディレクティブをエクスポートしなくなった点が異なります。代わりに、コンポーネントクラスで定義された`name`ゲッターを使用します。

`required`属性は、テンプレートにまだ存在することに注意してください。検証には必要ありませんが、アクセシビリティの目的で保持する必要があります。

## カスタムバリデーターの定義 {#defining-custom-validators}

組み込みのバリデーターは、アプリケーションのユースケースに常に一致するわけではありません。そのため、カスタムバリデーターを作成する必要がある場合があります。

前の例の`forbiddenNameValidator`関数を考えてみてください。
その関数の定義は次のようになります。

<docs-code header="shared/forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="custom-validator"/>

関数は、*特定の*禁止されている名前を検出するための正規表現を受け取り、バリデーター関数を返すファクトリです。

このサンプルでは、禁止されている名前は「bob」なので、バリデーターは「bob」を含むアクター名をすべて拒否します。
他の場所では、「alice」や、構成された正規表現に一致する名前を拒否することもできます。

`forbiddenNameValidator`ファクトリは、構成されたバリデーター関数を返します。
その関数はAngularコントロールオブジェクトを受け取り、コントロール値が有効な場合は`null`を返し、無効な場合は検証エラーオブジェクトを返します。
検証エラーオブジェクトには通常、検証キーの名前である`'forbiddenName'`というプロパティと、エラーメッセージに挿入できる任意の値の辞書である`{name}`という値を持つプロパティがあります。

カスタム非同期バリデーターは同期バリデーターに似ていますが、代わりに後で`null`または検証エラーオブジェクトを発行するPromiseまたはオブザーバブルを返す必要があります。
オブザーバブルの場合、オブザーバブルは完了する必要があります。その時点で、フォームは最後の発行された値を検証に使用します。

### カスタムバリデーターをリアクティブフォームに追加する

リアクティブフォームでは、`FormControl`に直接関数を渡すことで、カスタムバリデーターを追加します。

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="custom-validator"/>

### カスタムバリデーターをテンプレート駆動フォームに追加する

テンプレート駆動フォームでは、テンプレートにディレクティブを追加します。ディレクティブは、バリデーター関数をラップします。
たとえば、対応する`ForbiddenValidatorDirective`は、`forbiddenNameValidator`のラッパーとして機能します。

Angularは、ディレクティブが`NG_VALIDATORS`プロバイダーに自身を登録するため、ディレクティブの検証プロセスにおける役割を認識します。次の例に示すように。
`NG_VALIDATORS`は、拡張可能なバリデーターのコレクションを持つ、定義済みのプロバイダーです。

<docs-code header="shared/forbidden-name.directive.ts (providers)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive-providers"/>

その後、ディレクティブクラスは`Validator`インターフェースを実装するため、Angularフォームと簡単に統合できます。
以下は、ディレクティブ全体の概要です。

<docs-code header="shared/forbidden-name.directive.ts (directive)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive"/>

`ForbiddenValidatorDirective`の準備ができたら、セレクター`appForbiddenName`を入力要素に追加して、アクティブ化できます。
たとえば、次のとおりです。

<docs-code header="template/actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-input"/>

HELPFUL: カスタム検証ディレクティブが`useExisting`ではなく`useClass`でインスタンス化されていることに注意してください。
登録されたバリデーターは、`ForbiddenValidatorDirective`の*このインスタンス*である必要があります。フォーム内のインスタンスで、`forbiddenName`プロパティが「bob」にバインドされています。

`useExisting`を`useClass`に置き換えると、`forbiddenName`を持たない新しいクラスインスタンスを登録することになります。

## コントロールステータスCSSクラス {#control-status-css-classes}

Angularは、多くのコントロールプロパティをフォームコントロール要素にCSSクラスとして自動的にミラーリングします。
これらのクラスを使用して、フォームの状態に応じてフォームコントロール要素のスタイルを設定します。
現在サポートされているクラスは次のとおりです。

* `.ng-valid`
* `.ng-invalid`
* `.ng-pending`
* `.ng-pristine`
* `.ng-dirty`
* `.ng-untouched`
* `.ng-touched`
* `.ng-submitted` （囲んでいるフォーム要素のみ）

次の例では、アクターフォームは`.ng-valid`と`.ng-invalid`クラスを使用して、
各フォームコントロールの境界線の色を設定しています。

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## クロスフィールド検証

クロスフィールドバリデーターは、フォーム内の異なるフィールドの値を比較し、組み合わせで受け入れるか拒否する[カスタムバリデーター](#defining-custom-validators "カスタムバリデーターについて読む")です。
たとえば、互いに非互換なオプションを提供するフォームがある場合、ユーザーはAまたはBを選択できますが、両方は選択できません。
フィールドの値によっては、他の値に依存する場合もあります。ユーザーは、Aを選択した場合にのみBを選択できます。

次のクロス検証の例は、次の方法を示しています。

* 2つの兄弟コントロールの値に基づいて、リアクティブまたはテンプレートベースのフォーム入力を検証する
* ユーザーがフォームとやり取りし、検証に失敗した場合に、説明的なエラーメッセージを表示する

これらの例では、クロス検証を使用して、アクターがアクターフォームに記入することで、役割で同じ名前を再利用しないようにしています。
バリデーターは、アクター名と役割が一致しないことを確認することで、これを実現します。

### クロス検証をリアクティブフォームに追加する

フォームは、次の構造になっています。

<docs-code language="javascript">

const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
});

</docs-code>

`name`と`role`は兄弟コントロールであることに注意してください。
1つのカスタムバリデーターで両方のコントロールを評価するには、共通の祖先コントロールである`FormGroup`で検証する必要があります。
子コントロールを取得するために`FormGroup`をクエリして、値を比較します。

`FormGroup`にバリデーターを追加するには、作成時に第2引数として新しいバリデーターを渡します。

<docs-code language="javascript">

const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl()
}, { validators: unambiguousRoleValidator });

</docs-code>

バリデーターのコードは次のとおりです。

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-validator"/>

`unambiguousRoleValidator`バリデーターは、`ValidatorFn`インターフェースを実装しています。
これはAngularコントロールオブジェクトを引数として受け取り、フォームが有効な場合は`null`を返し、無効な場合は`ValidationErrors`を返します。

バリデーターは、`FormGroup`の[get](api/forms/AbstractControl#get)メソッドを呼び出して子コントロールを取得し、`name`コントロールと`role`コントロールの値を比較します。

値が一致しない場合、役割は曖昧ではなく、両方が有効で、バリデーターは`null`を返します。
値が一致する場合、アクターの役割は曖昧で、バリデーターはエラーオブジェクトを返すことでフォームを無効にする必要があります。

より良いユーザーエクスペリエンスを提供するために、フォームが無効な場合、テンプレートに適切なエラーメッセージが表示されます。

<docs-code header="reactive/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="cross-validation-error-message"/>

この`@if`は、`FormGroup`に`unambiguousRoleValidator`バリデーターが返したクロス検証エラーがある場合に、エラーを表示しますが、ユーザーが[フォームとやり取りを完了](#control-status-css-classes)した場合のみです。

### クロス検証をテンプレート駆動フォームに追加する

テンプレート駆動フォームの場合、バリデーター関数をラップするディレクティブを作成する必要があります。
次の例に示すように、[`NG_VALIDATORS`トークン](/api/forms/NG_VALIDATORS)を使用して、そのディレクティブをバリデーターとして提供します。

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-directive"/>

新しいディレクティブをHTMLテンプレートに追加する必要があります。
バリデーターはフォームの最上位レベルで登録する必要があるため、次のテンプレートは`form`タグにディレクティブを配置しています。

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-register-validator"/>

より良いユーザーエクスペリエンスを提供するために、フォームが無効な場合、適切なエラーメッセージが表示されます。

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-error-message"/>

これは、テンプレート駆動フォームとリアクティブフォームの両方で同じです。

## 非同期バリデーターの作成

非同期バリデーターは、`AsyncValidatorFn`と`AsyncValidator`インターフェースを実装します。
これらは、同期バリデーターと非常に似ており、次の点が異なります。

* `validate()`関数はPromiseまたはオブザーバブルを返す必要があります。
* 返されるオブザーバブルは有限である必要があります。つまり、ある時点で完了する必要があります。
    無限のオブザーバブルを有限のオブザーバブルに変換するには、オブザーバブルを`first`、`last`、`take`、`takeUntil`などのフィルタリング演算子でパイプします。

非同期検証は、同期検証の後に実行され、同期検証が成功した場合にのみ実行されます。
このチェックにより、フォームは、基本的な検証方法がすでに無効な入力を検出している場合、潜在的にコストのかかる非同期検証プロセス（HTTPリクエストなど）を回避できます。

非同期検証が開始されると、フォームコントロールは`pending`状態になります。
コントロールの`pending`プロパティを調べ、それを利用して、進行中の検証操作に関する視覚的なフィードバックを提供します。

一般的なUIパターンは、非同期検証の実行中にスピナーを表示することです。
次の例は、テンプレート駆動フォームでこれを実現する方法を示しています。

<docs-code language="html">

<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
@if(model.pending) {
  <app-spinner />
}

</docs-code>

### カスタム非同期バリデーターの実装

次の例では、非同期バリデーターは、アクターがすでに割り当てられている役割にキャストされないようにします。
新しいアクターは常にオーディションを受けており、古いアクターは引退しているため、利用可能な役割のリストを事前に取得はできません。
潜在的な役割のエントリを検証するために、バリデーターは、現在キャストされているすべてのアクターの中央データベースを照会する非同期操作を開始する必要があります。

次のコードは、`AsyncValidator`インターフェースを実装するバリデータークラス`UniqueRoleValidator`を作成します。

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator"/>

The `actorsService` property is initialized with an instance of the `ActorsService` token, which defines the following interface.

<docs-code language="typescript">
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
</docs-code>

実際のアプリケーションでは、`ActorsService`は、アクターデータベースにHTTPリクエストを送信して役割が利用可能かどうかを確認する役割を担います。
バリデーターの観点から、サービスの実際の実装は重要でないため、例では`ActorsService`インターフェースに対してのみコードを作成できます。

検証が始まると、`UnambiguousRoleValidator`は、現在のコントロール値で`ActorsService`の`isRoleTaken()`メソッドに委任します。
この時点で、コントロールは`pending`としてマークされ、`validate()`メソッドから返されるObservableチェーンが完了するまで、この状態を維持します。

`isRoleTaken()`メソッドは、役割が利用可能かどうかを確認するHTTPリクエストをディスパッチし、結果として`Observable<boolean>`を返します。
`validate()`メソッドは、応答を`map`演算子でパイプし、検証結果に変換します。

その後、メソッドは、他のバリデーターと同様に、フォームが有効な場合は`null`を返し、無効な場合は`ValidationErrors`を返します。
このバリデーターは、`catchError`演算子を使用して、潜在的なエラーを処理します。
この場合、バリデーターは`isRoleTaken()`エラーを正常な検証として扱います。検証リクエストの実行に失敗したとしても、役割が無効であるとは限りません。
エラーを異なる方法で処理し、代わりに`ValidationError`オブジェクトを返すこともできます。

しばらくすると、Observableチェーンが完了し、非同期検証が完了します。
`pending`フラグは`false`に設定され、フォームの有効性が更新されます。

### 非同期バリデーターをリアクティブフォームに追加する

リアクティブフォームで非同期バリデーターを使用するには、最初にバリデーターをコンポーネントクラスのプロパティに注入します。

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-inject"/>

次に、バリデーター関数を`FormControl`に直接渡して、適用します。

次の例では、`UnambiguousRoleValidator`の`validate`関数が、`roleControl`に適用されています。この関数をコントロールの`asyncValidators`オプションに渡し、`ActorFormReactiveComponent`に注入された`UnambiguousRoleValidator`のインスタンスにバインドしています。
`asyncValidators`の値は、単一の非同期バリデーター関数、または関数の配列にすることができます。
`FormControl`オプションの詳細については、[AbstractControlOptions](api/forms/AbstractControlOptions) APIリファレンスを参照してください。

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-usage"/>

### 非同期バリデーターをテンプレート駆動フォームに追加する

テンプレート駆動フォームで非同期バリデーターを使用するには、新しいディレクティブを作成し、そのディレクティブに`NG_ASYNC_VALIDATORS`プロバイダーを登録します。

次の例では、ディレクティブは、実際の検証ロジックを含む`UniqueRoleValidator`クラスを注入し、検証を実行する必要があるときにAngularによってトリガーされる`validate`関数でそれを呼び出します。

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator-directive"/>

その後、同期バリデーターと同様に、ディレクティブのセレクターを入力に追加して、アクティブ化します。

<docs-code header="template/actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="role-input"/>

### 非同期バリデーターのパフォーマンスの最適化

デフォルトでは、すべてのバリデーターは、フォームの値が変更されるたびに実行されます。
同期バリデーターの場合、これは通常、アプリケーションのパフォーマンスに目立った影響を与えません。
ただし、非同期バリデーターは通常、コントロールを検証するために何らかのHTTPリクエストを実行します。
キーストロークごとにHTTPリクエストをディスパッチすると、バックエンドAPIに負担がかかる可能性があり、可能な限り回避する必要があります。

`updateOn`プロパティを`change`（デフォルト）から`submit`または`blur`に変更することで、フォームの有効性の更新を遅らせることができます。

テンプレート駆動フォームでは、テンプレートでプロパティを設定します。

<docs-code language="html">
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
</docs-code>

リアクティブフォームでは、`FormControl`インスタンスでプロパティを設定します。

<docs-code language="typescript">
new FormControl('', {updateOn: 'blur'});
</docs-code>

## ネイティブHTMLフォーム検証との相互作用

デフォルトでは、Angularは囲んでいる`<form>`に`novalidate`属性を追加することで[ネイティブHTMLフォーム検証](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation)を無効にし、これらの属性をフレームワーク内のバリデーター関数と一致させるためにディレクティブを使用します。
ネイティブ検証を**組み合わせて**Angularベースの検証を使用したい場合は、`ngNativeValidate`ディレクティブを使用して、ネイティブ検証を再び有効にできます。
詳細については、[APIドキュメント](api/forms/NgForm#native-dom-validation-ui)を参照してください。
