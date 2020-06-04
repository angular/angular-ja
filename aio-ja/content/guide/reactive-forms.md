# リアクティブフォーム

リアクティブフォームは、時間とともに値が変化するフォーム入力を処理するためのモデル駆動型アプローチを提供します。このガイドでは、基本的なフォームコントロールを作成および更新する方法、グループ内で複数のコントロールを使用する方法、フォームの値を検証する方法、実行時にコントロールを追加または削除できる動的フォームを作成する方法について説明します。

<div class="alert is-helpful">

Try this <live-example title="Reactive Forms in Stackblitz">Reactive Forms live-example</live-example>.

</div>

**Prerequisites**

Before going further into reactive forms, you should have a basic understanding of the following:

* TypeScript programming.
* Angular app-design fundamentals, as described in [Angular Concepts](guide/architecture "Introduction to Angular concepts.").
* The form-design concepts that are presented in [Introduction to Forms](guide/forms-overview "Overview of Angular forms.").

{@a intro}

## リアクティブフォームの概要

リアクティブフォームは明示的でイミュータブルなアプローチを用い、特定の時点におけるフォームの状態を管理します。フォームの状態への変更の度に、変更間でのモデルの整合性を維持する新しい状態を返します。リアクティブフォームは[Observable](guide/glossary#observable "Observable definition.")ストリームを中心に構築されており、フォーム入力や値は入力値のストリームとして提供され、同期的にアクセスができます。

またリアクティブフォームでは、リクエストのデータには一貫性があり予測性が保証されているので、テストが簡単に行えます。すべてのストリームの利用者は、データに安全にアクセスし操作することができます。

Reactive forms differ from [template-driven forms](guide/forms "Template-driven forms guide") in distinct ways. Reactive forms provide more predictability with synchronous access to the data model, immutability with observable operators, and change tracking through observable streams.

Template-driven forms allow direct access to modify data in your template, but are less explicit than reactive forms because they rely on directives embedded in the template, along with mutable data to track changes asynchronously. See the [Forms Overview](guide/forms-overview "Overview of Angular forms.") for detailed comparisons between the two paradigms.

## Adding a basic form control

There are three steps to using form controls.

1. Register the reactive forms module in your app. This module declares the reactive-form directives that you need to use reactive forms.
2. Generate a new `FormControl` instance and save it in the component.
3. Register the `FormControl` in the template.

You can then display the form by adding the component to the template.

The following examples show how to add a single form control. In the example, the user enters their name into an input field, captures that input value, and displays the current value of the form control element.

**Register the reactive forms module**

To use reactive form controls, import `ReactiveFormsModule` from the `@angular/forms` package and add it to your NgModule's `imports` array.

<code-example path="reactive-forms/src/app/app.module.ts" region="imports" header="src/app/app.module.ts (excerpt)"></code-example>

**Generate a new `FormControl`**

Use the [CLI command](cli "Using the Angular command-line interface.") `ng generate` to generate a component in your project to host the control.

<code-example language="sh" class="code-shell">

  ng generate component NameEditor

</code-example>

To register a single form control, import the `FormControl` class and create a new instance of `FormControl` to save as a class property.

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control" header="src/app/name-editor/name-editor.component.ts"></code-example>

`FormControl`のコンストラクターを使い、初期値を設定します。この場合は空文字を設定しています。このコントロールをコンポーネントクラスに作ることで、フォーム入力の状態の監視、更新、バリデーションを行うことができます。

**Register the control in the template**

コンポーネントクラスにコントロールを作成した後は、テンプレート内のフォームコントロール要素へ紐付ける必要があります。 `ReactiveFormsModule`内の`FormControlDirective`が提供する`formControl`バインディングを使い、フォームコントロールとともにテンプレートを更新します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" header="src/app/name-editor/name-editor.component.html"></code-example>

<div class="alert is-helpful">

* `ReactiveFormsModule`が提供するクラスやディレクティブの概要は、[Reactive forms API](#reactive-forms-api "API summary.")を参照してください。

* For complete syntax details of these classes and directives, see the API reference documentation for the [Forms package](api/forms "API reference.").

</div>

テンプレートバインディング構文を使うことで、フォームコントロールはテンプレート内の`name`入力要素に登録されました。フォームコントロールとDOM要素は相互に作用します。画面にモデルの変更を反映し、画面での変更をモデルに反映します。

**Display the component**

`name`が割り当てられたフォームコントロールは、コンポーネントがテンプレートに追加すると表示されます。

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-name-editor" header="src/app/app.component.html (name editor)"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/name-editor-1.png" alt="Name Editor">
</div>

{@a display-value}

### フォームコントロール値の表示

次の手順で値の表示を行います:

* テンプレートの`AsyncPipe`またはコンポーネントクラスの`subscribe()`メソッドを使い、`valueChanges`を介してフォームの値の変更を監視することができます。

* `value`プロパティから現在の値のスナップショットを表示します。

次の例では、テンプレートの補間を使ってどのように現在の値を表示するのかを示します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value" header="src/app/name-editor/name-editor.component.html (control value)"></code-example>

フォームコントロール要素を更新することで、表示されている値が変更されます。

リアクティブフォームでは、各インスタンスが提供するプロパティやメソッドからコントロールへの詳細情報にアクセスすることができます。
基底となっている[AbstractControl](api/forms/AbstractControl "API reference.")クラスのプロパティやメソッドは、フォームの状態を制御し、バリデーションのメッセージを表示するタイミングを決めるのに使われています。さらに詳しい情報は、後述の[Simple form validation](#basic-form-validation "Learn more about validating form input.")を参照してください。

`FormControl`の他のプロパティやメソッドについては、[APIリファレンス](api/forms/FormControl "Detailed syntax reference.")の項目をご覧ください。

### コントロール値の置き換え

リアクティブフォームには、コントロールの値をプログラムから変更するメソッドがあり、ユーザー操作なしにコントロールの値を柔軟に更新することができます。フォームコントロールのインスタンスは`setValue()`メソッドを提供しており、フォームコントロールの値の更新や、コントロールの構造に対して与えられた値の構造の検証を行います。たとえば、バックエンドのAPIやサービスからフォームのデータを受け取った時、`setValue()`メソッドを使いコントロールを新しい値に更新し、古い値を完全に置き換えます。

次の例では、コンポーネントクラスにメソッドを追加し、`setValue()`メソッドを使ってコントロールの値を*Nancy*へ更新します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value" header="src/app/name-editor/name-editor.component.ts (値の更新)">

</code-example>

テンプレートを更新して、名前の更新をシミュレートするボタンをつけます。**Update Name** ボタンをクリックすると、フォームコントロール要素に入力されている値が現在の値として反映されます。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value" header="src/app/name-editor/name-editor.component.html (update value)"></code-example>

フォームモデルはコントロールのデータ源なので、ボタンをクリックするとコンポーネントクラス内で入力の値が変更され、現在の値も上書きされます。

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/name-editor-2.png" alt="Name Editor Update">
</div>

<div class="alert is-helpful">

**注:** この例では、単一のコントロールを扱っています。 `setValue()`メソッドを[フォームグループ](#grouping-form-controls "Learn more about form groups.")や[フォーム配列](#creating-dynamic-forms "Learn more about dynamic forms.")のインスタンスに使用した場合には、値はグループか配列の構造に合わせる必要があります。

</div>

## フォームコントロールのグループ化 {@a grouping-form-controls}

Forms typically contain several related controls. Reactive forms provide two ways of grouping multiple related controls into a single input form.

* A form *group* defines a form with a fixed set of controls that you can manage together. Form group basics are discussed in this section. You can also [nest form groups](#nested-groups "See more about nesting groups.") to create more complex forms.
* A form *array* defines a dynamic form, where you can add and remove controls at run time. You can also nest form arrays to create more complex forms. For more about this option, see [Creating dynamic forms](#dynamic-forms "See more about form arrays.") below.

フォームコントロールのインスタンスが単一の入力欄を制御したように、フォームグループのインスタンスはフォームコントロールのインスタンスのグループ（たとえばフォームなど）の状態を管理します。フォームグループインスタンス内の個々のコントロールは、フォームグループを作る時に名前で管理されます。次の例では、どのように複数のフォームコントロールインスタンスをひとつのグループで管理するのかを示します。

`ProfileEditor`コンポーネントを生成し、`FormGroup` と `FormControl`クラスを`@angular/forms`パッケージからインポートします。

<code-example language="sh" class="code-shell">

  ng generate component ProfileEditor

</code-example>

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports" header="src/app/profile-editor/profile-editor.component.ts (imports)">

</code-example>

To add a form group to this component, take the following steps.

1. Create a `FormGroup` instance.
2. Associate the `FormGroup` model and view.
3. Save the form data.

**Create a FormGroup instance**

コンポーネントクラス内に`profileForm`という名前でプロパティを作成し、新しいフォームグループのインスタンスを設定します。フォームグループを初期化するには、名前付けされたキーとコントロールがマップされたオブジェクトをコンストラクターに渡します。

プロフィールのフォームには、`firstName` と `lastName`という名前のふたつのフォームコントロールのインスタンスを追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup" header="src/app/profile-editor/profile-editor.component.ts (フォームグループ)">

</code-example>

各コントロールはグループ内にいます。`FormGroup`インスタンスは、グループ内のコントロールの値をまとめたオブジェクトを、自身のモデルの値として提供します。フォームグループのインスタンスはフォームコントロールと同じプロパティ（`value` や `untouched`）、同じメソッド（`setValue()`など）を持っています。

**FormGroupモデルとビューの紐付け**

フォームグループは個々のコントロールの状態と変更を監視しているので、ひとつのコントロールに変更があれば、親のコントロールも新しい状態や値変更を発行します。グループのモデルはメンバーによって維持されています。モデルを定義した後、モデルをビューに反映させるようにテンプレートを更新する必要があります。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup" header="src/app/profile-editor/profile-editor.component.html (template form group)"></code-example>

フォームグループがコントロールのグループをもつように、*profile form* の`FormGroup`は`form`要素の`FormGroup`ディレクティブとバインドされ、モデルとフォームがもつinputとの間に通信レイヤーが作られることに注意してください。 `FormControlName`ディレクティブが提供する`formControlName`は、各inputと `FormGroup`内に定義されたフォームコントロールをバインドします。フォームコントロールは個々の紐付けられた要素と通信します。また、フォームグループのインスタンスへの変更のやりとりも行います。

**フォームデータの保存**

`ProfileEditor`コンポーネントはユーザーから入力を受けますが、実際のシナリオでは、フォーム値を受け取りコンポーネントの外で利用したいことがあります。`FormGroup`ディレクティブは、`form`要素が発行した`submit`イベントを監視し、コールバック関数にバインドできる`ngSubmit`イベントを発行します。

`form`タグに`ngSubmit`イベントリスナーを`onSubmit()`コールバックメソッドとあわせて追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit" header="src/app/profile-editor/profile-editor.component.html (submit event)"></code-example>

`ProfileEditor`コンポーネント内の`onSubmit()`メソッドは、現在の`profileForm`の値を取得します。フォームをカプセル化したままコンポーネントの外へフォームの値を提供するには、`EventEmitter`を使用します。次の例では`console.warn`を使い、ブラウザのコンソールにメッソージを記録します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit" header="src/app/profile-editor/profile-editor.component.ts (送信メソッド)">

</code-example>

`submit`イベントはネイティブDOMイベントを使って`form`タグから発行されます。`submit`タイプのボタンをクリックすることでイベントを発火します。**Enter** キーを押して入力完了したフォームを送信することもできます。

`button`要素を使って、フォームの下にボタンを追加してフォーム送信を発火します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button" header="src/app/profile-editor/profile-editor.component.html (submit button)"></code-example>

<div class="alert is-helpful">

**注:** 上のスニペット内のボタンは、`profileForm`が無効なときにボタンを非活性にする`disabled`バインディングが付与されています。まだバリデーションを行っていないので、ボタンは常に活性になっています。単一フォームのバリデーションは、[Validating form input](#basic-form-validation "Basic form validation.")のセクションを参照してください。

</div>

**コンポーネントの表示**

フォームを含む`ProfileEditor`コンポーネントを表示するために、コンポーネントテンプレートへ追加します。

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-profile-editor" header="src/app/app.component.html (profile editor)"></code-example>

`ProfileEditor`は、フォームグループインスタンス内の`firstName`と`lastName`のフォームコントロールインスタンスを管理できます。

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-1.png" alt="Profile Editor">
</div>

{@a nested-groups}

### ネストしたフォームグループの作成

Form groups can accept both individual form control instances and other form group instances as children. This makes composing complex form models easier to maintain and logically group together.

When building complex forms, managing the different areas of information is easier in smaller sections. Using a nested form group instance allows you to break large forms groups into smaller, more manageable ones.

To make more complex forms, use the following steps.

1. Create a nested group.
2. Group the nested form in the template.

Some types of information naturally fall into the same group. A name and address are typical examples of such nested groups, and are used in the following examples.

**Create a nested group**

To create a nested group in `profileForm`, add a nested `address` element to the form group instance.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup" header="src/app/profile-editor/profile-editor.component.ts (nested form group)"></code-example>

この例では、`address group`は、既存の`firstName`と`lastName`のコントロールを、新しく`street`、`city`、 `state`、`zip`のコントロールと組み合わせます。フォームグループ内の`address`要素はフォームグループ内の`profileForm` 要素の子であっても、値や状態変更に同じルールが適用されます。ネストしたグループからの状態や値の変更は親のフォームグループに伝播し、モデル全体の一貫性を維持します。

**テンプレート内のネストしたフォームのグループ化**

コンポーネントクラス内のモデルを更新した後、フォームグループインスタンスと入力要素をつなげるためにテンプレートを更新します。

`street` 、 `city` 、`state` 、 `zip` フィールドを含む`address`フォームグループを`ProfileEditor`テンプレートに追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname" header="src/app/profile-editor/profile-editor.component.html (template nested form group)"></code-example>

`ProfileEditor`フォームはひとつのグループとして表示されますが、モデルは論理グループ領域を表すためにさらに分解されます。

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-2.png" alt="Profile Editor Update">
</div>

<div class="alert is-helpful">

**注:** フォームグループインスンタンスの値をコンポーネントテンプレート内で表示するには、`value` プロパティと `JsonPipe`を使用します。

</div>

### Updating parts of the data model

複数のコントロールを含んだフォームグループインスタンスの値を更新する時、モデルの一部分のみを更新することができます。このセクションでは、フォームコントロールのデータモデルの特定部分を更新する方法を説明します。

モデルの更新にはふたつの方法があります。

* `setValue()`メソッドを使い、個々のコントロールに新しい値を設定します。`setValue()`メソッドはフォームグループの構造にとても厳格で、コントロールの値全体を置き換えます。

* `patchValue()`メソッドを使い、オブジェクトに定義されているプロパティの中でフォームモデルに変更のあったプロパティを置き換えます。

`setValue()`の厳格なチェックは、複雑なフォーム内のネストしたエラーを捕捉するのに役立ちます。一方、 `patchValue()`はそのエラーがあった場合には静かに失敗します。

`ProfileEditorComponent`では、下の例にある`updateProfile`メソッドを使いfirst nameとstreet addressを更新します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value" header="src/app/profile-editor/profile-editor.component.ts (値のパッチ)">

</code-example>

ユーザープロフィールをオンデマンドで更新するためにテンプレートにボタンを追加して、更新をシミュレートします。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value" header="src/app/profile-editor/profile-editor.component.html (update value)"></code-example>

ユーザーがボタンをクリックすると、`profileForm`モデルは新しい`firstName` と `street`に更新されます。`street`は`address`プロパティ内のオブジェクトとして提供されていることに注意してください。`patchValue()`メソッドはモデル構造に沿って更新が適用されるので、これが必要です。`patchValue()`はフォームモデルに定義されたプロパティのみを更新します。

## FormBuilderを使ったフォームコントロールの作成

フォームコントロールインスタンスを手動で作成するのは、複数のフォームを扱う時は反復的になることがあります。`FormBuilder`サービスはコントロールを作成するのに便利なメソッドを提供します。

Use the following steps to take advantage of this service.

1. Import the `FormBuilder` class.
2. Inject the `FormBuilder` service.
3. Generate the form contents.

The following examples show how to refactor the `ProfileEditor` component to use the form builder service to create form control and form group instances.

**Import the FormBuilder class**

`@angular/forms`パッケージから`FormBuilder`クラスをインポートします。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports" header="src/app/profile-editor/profile-editor.component.ts (インポート)">

</code-example>

**FormBuilderサービスの注入**

`FormBuilder`サービスは、リアクティブフォームモジュールが提供する注入できるプロバイダーです。コンポーネントのコンスタラクターに追加することで依存性を注入します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder" header="src/app/profile-editor/profile-editor.component.ts (コンストラクター)">

</code-example>

**フォームコントロールの作成**

`FormBuilder`は三つのメソッドを提供します: `control()`、`group()`、 `array()`。
これらは、フォームコントロール、フォームグループ、フォーム配列を含むコンポーネントクラスにインスタンスを作成するファクトリメソッドです。

`group`メソッドを使い、`profileForm`コントロールを作成します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder" header="src/app/profile-editor/profile-editor.component.ts (フォームビルダー)">

</code-example>

上記の例では、`group()`メソッドを使いモデル内のプロパティを定義しています。各コントロール名の値は配列になっており、配列の最初が初期値となっています。

<div class="alert is-helpful">

**注:** コントロールを初期値と合わせて定義できますが、コントロールに同期または非同期のバリデーションが必要な場合には、同期または非同期バリデーターを配列の2つ目と3つ目の項目に追加します。

</div>

フォームビルダーを使用する方法と、手動でインスタンスを作成する方法を比較します。

<code-tabs>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (インスタンス)">

  </code-pane>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (フォームビルダー)">

  </code-pane>

</code-tabs>

{@a basic-form-validation}

## Validating form input

_Form validation_ is used to ensure that user input is complete and correct. This section covers adding a single validator to a form control and displaying the overall form status. Form validation is covered more extensively in the [Form Validation](guide/form-validation "All about form validation.") guide.

Use the following steps to add form validation.

1. Import a validator function in your form component.
2. Add the validator to the field in the form.
3. Add logic to handle the validation status.

The most common validation is making a field required. The following example shows how to add a required validation to the `firstName` control and display the result of validation.

**バリデーター関数のインポート**

リアクティブフォームは、一般的な用途に使えるバリデーター関数のセットを含んでいます。これらの関数は、コントロールを受けてバリデーションを行い、バリデーション結果に応じてエラーオブジェクトかnullを返します。

`@angular/forms`パッケージから`Validators`クラスをインポートします。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports" header="src/app/profile-editor/profile-editor.component.ts (インポート)">

</code-example>

**必須フィールドを作成する**

`ProfileEditor`コンポーネント内で、静的な`Validators.required`メソッドを`firstName`コントロールの配列の2つ目の項目に追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator" header="src/app/profile-editor/profile-editor.component.ts (必須バリデーター)">

</code-example>

HTML5には、`required`、`minlength`、`maxlength`などのネイティブバリデーションとして使用できるビルトイン属性があります。これらのオプション属性はフォーム入力要素で使用できます。`required`属性を`firstName`入力要素に追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="required-attribute" header="src/app/profile-editor/profile-editor.component.html (required attribute)"></code-example>

<div class="alert is-important">

**注:** これらのHTML5バリデーション属性は、Angularのリアクティブフォームが提供するビルトインバリデーターと*組み合わせて*使用してください。これらを組み合わせて使用することで、テンプレートがチェックされた後に式が変更された時のエラーを防ぐことができます。

</div>

**フォームのステータスを表示する**

必須フィールドをフォームコントロールに追加すると、初期ステータスはinvalidになります。invalidステータスは親のフォームグループ要素に伝播し、ステータスがinvalidになります。現在のフォームグループインスタンスのステータスは、`status`プロパティからアクセスします。

補間を使用して現在の`profileForm`のステータスを表示させます。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status" header="src/app/profile-editor/profile-editor.component.html (display status)"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-3.png" alt="Profile Editor Validation">
</div>

`profileForm`が`firstName`フォームコントロールの必須によってinvalidになっているため、**Submit** ボタンは非活性になっています。`firstName`を入力すると、フォームはvalidになり　**Submit** ボタンは活性になります。

フォームバリデーションについて詳細は、[フォームバリデーション](guide/form-validation "All about form validation.")ガイドを参照してください。

{@a dynamic-forms}

## Creating dynamic forms

`FormArray` is an alternative to `FormGroup` for managing any number of unnamed controls. As with form group instances, you can dynamically insert and remove controls from form array instances, and the form array instance value and validation status is calculated from its child controls. However, you don't need to define a key for each control by name, so this is a great option if you don't know the number of child values in advance.

To define a dynamic form, take the following steps.

1. Import the `FormArray` class.
2. Define a `FormArray` control.
3. Access the `FormArray` control with a getter method.
4. Display the form array in a template.

The following example shows you how to manage an array of *aliases* in `ProfileEditor`.

**フォーム配列クラスのインポート**

`@angular/forms`から`FormArray`クラスをインポートして、型情報として使用します。`FormBuilder`から`FormArray`インスタンスを作成することもできます。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports" header="src/app/profile-editor/profile-editor.component.ts (インポート)">

</code-example>

**フォーム配列コントロールを定義する**

フォーム配列は、0から多数の任意の数のコントロールを配列内で定義して初期化することができます。フォーム配列を定義するために、`aliases`プロパティを`profileForm`に追加します。

`FormBuilder.array()`メソッドを使い配列を定義し、`FormBuilder.control()`メソッドで配列に初期コントロールを設定します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases" header="src/app/profile-editor/profile-editor.component.ts (エイリアスフォーム配列)">

</code-example>

フォームグループインスタンス内のエイリアスコントロールは、動的に追加されるまでは単一のコントロールが設定されています。

**フォーム配列コントロールへのアクセス**

`profileForm.get()`メソッドで繰り返し各インスタンスから取得するより、ゲッターを使う方がフォーム配列インスタンス内のエイリアスに簡単にアクセスすることができます。フォーム配列インスタンスは配列内に不特定多数のコントロールを持っています。コントロールにアクセスするにはゲッターが便利です。このアプローチは追加のコントロールについて繰り返すのも簡単です。

ゲッター構文を使用して、親のフォームグループからエイリアスのフォーム配列コントロールを取得する`aliases`クラスプロパティを作ります。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter" header="src/app/profile-editor/profile-editor.component.ts (エイリアス ゲッター)">

</code-example>

<div class="alert is-helpful">

**注:** 返されたコントロールは`AbstractControl`型なので、フォーム配列インスタンスのメソッド構文にアクセスするには、明確な型を指定する必要があります。

</div>

動的にエイリアスコントロールをエイリアスのフォーム配列へ追加するメソッドを定義します。
`FormArray.push()`メソッドは、配列へコントロールを新しいアイテムとして挿入します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias" header="src/app/profile-editor/profile-editor.component.ts (エイリアスの追加)">

</code-example>

テンプレートでは、各コントロールは別々の入力フィールドとして表示されます。

**テンプレートにフォーム配列を表示する**

フォームモデルからエイリアスを付与するには、テンプレートに追加する必要があります。`FormGroupNameDirective`が提供する`formGroupName`のように、`FormArrayNameDirective`の`formArrayName`でフォーム配列インスタンスとテンプレートへの通信をバインドします。

下のテンプレートHTMLを`formGroupName`要素の`<div>`閉じタグの後に追加してください。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname" header="src/app/profile-editor/profile-editor.component.html (aliases form array template)"></code-example>

`*ngFor`ディレクティブはエイリアスフォーム配列インスタンス内の各コントロールインスタンスを反復します。フォーム配列要素は名前がついていないため、`i`変数にインデックスを割り当て、各コントロールに渡して`formControlName`にバインドします。

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-4.png" alt="Profile Editor Aliases">
</div>

新しいエイリアスインスタンスが追加される度に、新しいフォーム配列インスタンスがインデックスに応じて制御されます。これにより、ルートコントロールの状態や値を計算する時に、個々のコントロールを追跡することができます。

**エイリアスを追加する**

最初は、フォームにはひとつの`Alias`フィールドのみです。別フィールドを追加するには **Add Alias** ボタンをクリックします。テンプレートの下の`Form Value`に表示されているフォームモデルにあるエイリアス配列のバリデーションもできます。

<div class="alert is-helpful">

**注:** 各エイリアスのフォームコントロールインスタンスの代わりに、追加フィールドをもつ別のフォームグループを作成することもできます。各アイテムのコントロールを定義するプロセスは同じです。

</div>


{@a reactive-forms-api}

### リアクティブフォーム APIの概要

The following table lists the base classes and services used to create and manage reactive form controls.
For complete syntax details, see the API reference documentation for the [Forms package](api/forms "API reference.").

#### クラス

<table>

  <tr>

    <th>
      クラス
    </th>

    <th>
      詳細
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>AbstractControl</code>
    </td>

    <td>

      具象フォームコントロールクラスである`FormControl` と `FormGroup`、`FormArray`の抽象基底クラスです。共通のふるまいやプロパティを提供します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControl</code>
    </td>

    <td>

      各フォームコントロールの値とステータスの有効性を管理します。`<input>` や `<select>`などのHTMLフォームコントロールに対応します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroup</code>
    </td>

    <td>

      `AbstractControl`インスタンスのグーループの値とステータスの有効性を管理します。グループのプロパティは子のコントロールを含んでいます。`FormGroup`がコンポーネントのトップレベルのフォームです。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArray</code>
    </td>

    <td>

    `AbstractControl`インスタンスをインデックスした配列の値とステータスの有効性を管理します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormBuilder</code>
    </td>

    <td>

      コントロールインスタンスを作成するファクトリーメソッドを提供するインジェクト可能なサービスです。

    </td>

  </tr>  

</table>

#### ディレクティブ

<table>

  <tr>

    <th>
      ディレクティブ
    </th>

    <th>
      詳細
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlDirective</code>
    </td>

    <td>

      スタンドアローンな`FormControl`インスタンスとフォームコントロール要素を同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlName</code>
    </td>

    <td>

      `FormGroup`インスタンス内の`FormControl`とフォームコントロール要素を名前を使って同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupDirective</code>
    </td>

    <td>

      `FormGroup`とDOM要素を同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupName</code>
    </td>

    <td>

      ネストした`FormGroup`インスタンスとDOM要素と同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArrayName</code>
    </td>

    <td>

      ネストした`FormArray`インスタンスとDOM要素を同期させます。

    </td>

  </tr>

</table>
