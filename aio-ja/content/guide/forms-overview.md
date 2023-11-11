# Angularのフォームのイントロダクション

ユーザー入力をフォームで処理することは、多くの一般的なアプリケーションで不可欠なものです。アプリケーションはフォームを使用して、ユーザーがログインしたり、プロフィールを更新したり、機密情報を入力したり、その他の多くのデータ入力タスクを実行できるようにします。

Angularは、フォームを通じてユーザー入力を処理するための2つの異なるアプローチを提供します。リアクティブ型とテンプレート駆動型です。どちらもビューからユーザー入力イベントを取得し、ユーザー入力をバリデーションし、更新するフォームモデルとデータモデルを作成し、変更を監視する方法を提供します。

This guide provides information to help you decide which type of form works best for your situation. It introduces the common building blocks used by both approaches. It also summarizes the key differences between the two approaches, and demonstrates those differences in the context of setup, data flow, and testing.

## Prerequisites

This guide assumes that you have a basic understanding of the following.

* [TypeScript](https://www.typescriptlang.org/ "The TypeScript language") and HTML5 programming.

* Angular app-design fundamentals, as described in [Angular Concepts](guide/architecture "Introduction to Angular concepts.").

* The basics of [Angular template syntax](guide/architecture-components#template-syntax "Template syntax intro").

## Choosing an approach

Reactive forms and template-driven forms process and manage form data differently. Each approach offers different advantages.

* **Reactive forms** provide direct, explicit access to the underlying forms object model. Compared to template-driven forms, they are more robust: they're more scalable, reusable, and testable. If forms are a key part of your application, or you're already using reactive patterns for building your application, use reactive forms.

* **Template-driven forms** rely on directives in the template to create and manipulate the underlying object model. They are useful for adding a simple form to an app, such as an email list signup form. They're easy to add to an app, but they don't scale as well as reactive forms. If you have very basic form requirements and logic that can be managed solely in the template, template-driven forms could be a good fit.

## 主な違い

次の表は、リアクティブフォームとテンプレート駆動フォームの主な違いをまとめたものです。

<style>
  table {width: 100%};
  td, th {vertical-align: top};
</style>

||リアクティブ|テンプレート駆動|
|--- |--- |--- |
|[Setup of form model](#setup) | Explicit, created in component class | Implicit, created by directives |
|[Data model](#mutability-of-the-data-model) | Structured and immutable | Unstructured and mutable |
|[Data flow](#data-flow-in-forms) | Synchronous | Asynchronous |
|[Form validation](#validation) | Functions | Directives |

### Scalability

If forms are a central part of your application, scalability is very important. Being able to reuse form models across components is critical.

Reactive forms are more scalable than template-driven forms. They provide direct access to the underlying form API, and use [synchronous data flow](#data-flow-in-reactive-forms) between the view and the data model, which makes creating large-scale forms easier.
Reactive forms require less setup for testing, and testing does not require deep understanding of change detection to properly test form updates and validation.

Template-driven forms focus on simple scenarios and are not as reusable.
They abstract away the underlying form API, and use [asynchronous data flow](#data-flow-in-template-driven-forms) 
The abstraction of template-driven forms also affects testing.
Tests are deeply reliant on manual change detection execution to run properly, and require more setup.

{@a setup}

## Setting up the form model

Both reactive and template-driven forms track value changes between the form input elements that users interact with and the form data in your component model.
The two approaches share underlying building blocks, but differ in how you create and manage the common form-control instances.

### Common form foundation classes

リアクティブとテンプレート駆動の両方のフォームは、基礎となる構成要素を共有しています。

* `FormControl`は個々のフォームコントロールの値とバリデーションステータスを監視します。

* `FormGroup`はフォームコントロールのコレクションに対して同じ値とステータスを監視します。

* `FormArray`はフォームコントロールの配列に対して同じ値とステータスを監視します。

* `ControlValueAccessor`はAngularの`FormControl`インスタンスと組み込みのDOM要素との間の橋渡しをします。

{@a setup-the-form-model}

### リアクティブフォームでのセットアップ

With reactive forms, you define the form model directly in the component class.
The `[formControl]` directive links the explicitly created `FormControl` instance to a specific form element in the view, using an internal value accessor.

The following component implements an input field for a single control, using reactive forms. In this example, the form model is the `FormControl` instance.

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.ts">
</code-example>

Figure 1 shows how, in reactive forms, the form model is the source of truth; it provides the value and status of the form element at any given point in time, through the `[formControl]` directive on the input element.

**Figure 1.** *Direct access to forms model in a reactive form.*

<div class="lightbox">
  <img src="generated/images/guide/forms-overview/key-diff-reactive-forms.png" alt="Reactive forms key differences">
</div>

### テンプレート駆動フォームでのセットアップ

In template-driven forms, the form model is implicit, rather than explicit. The directive `NgModel` creates and manages a `FormControl` instance for a given form element.

The following component implements the same input field for a single control, using template-driven forms.

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.ts">
</code-example>

In a template-driven form the source of truth is the template. You do not have direct programmatic access to the `FormControl` instance, as shown in Figure 2.

**Figure 2.** *Indirect access to forms model in a template-driven form.*

<div class="lightbox">
  <img src="generated/images/guide/forms-overview/key-diff-td-forms.png" alt="Template-driven forms key differences">
</div>

{@a data-flow-in-forms}

## フォーム内のデータフロー

When an application contains a form, Angular must keep the view in sync with the component model and the component model in sync with the view.
As users change values and make selections through the view, the new values must be reflected in the data model.
Similarly, when the program logic changes values in the data model, those values must be reflected in the view.

Reactive and template-driven forms differ in how they handle data flowing from the user or from programmatic changes.
The following diagrams illustrate both kinds of data flow for each type of form, using the a favorite-color input field defined above.

{@a data-flow-in-reactive-forms}

### リアクティブフォームでのデータフロー

In reactive forms each form element in the view is directly linked to the form model (a `FormControl` instance). Updates from the view to the model and from the model to the view are synchronous and do not depend on how the UI is rendered.

The view-to-model diagram shows how data flows when an input field's value is changed from the view through the following steps.

1. ユーザーがinput要素に値を入力します。このケースでは、お気に入りの色は*Blue*です。
1. フォームのinput要素は最新の値で"input"イベントを発行します。
1. フォームのinput要素上のイベントをリッスンしているコントロール値アクセサは、新しい値をただちに`FormControl`インスタンスに渡します。
1. `FormControl`インスタンスは`valueChanges`オブジェクトを通して新しい値を発行します。
1. `valueChanges`Observableのサブスクライバーが新しい値を受け取ります。

<div class="lightbox">
  <img src="generated/images/guide/forms-overview/dataflow-reactive-forms-vtm.png" alt="Reactive forms data flow - view to model">
</div>

The model-to-view diagram shows how a programmatic change to the model is propagated to the view through the following steps.

1. ユーザーは`favoriteColorControl.setValue()`メソッドを呼び出します。これは`FormControl`の値を更新します。
1. `FormControl`インスタンスは`valueChanges`オブジェクトを通して新しい値を発行します。
1. `valueChanges`Observableのサブスクライバーが新しい値を受け取ります。
1. フォームのinput要素のコントロール値アクセサは、要素を新しい値で更新します。

<div class="lightbox">
  <img src="generated/images/guide/forms-overview/dataflow-reactive-forms-mtv.png" alt="Reactive forms data flow - model to view">
</div>

{@a data-flow-in-template-driven-forms}

### テンプレート駆動フォームでのデータフロー

In template-driven forms, each form element is linked to a directive that manages the form model internally.

The view-to-model diagram shows how data flows when an input field's value is changed from the view through the following steps.

1. ユーザーがinput要素に*Blue*と入力します。
1. input要素は値*Blue*をもつ"input"イベントを発行します。
1. input要素にアタッチされているコントロール値アクセサは`FormControl`インスタンスの`setValue()`メソッドをトリガーします。
1. `FormControl`インスタンスは`valueChanges`オブジェクトを通して新しい値を発行します。
1. `valueChanges`Observableのサブスクライバーが新しい値を受け取ります。
1. コントロール値アクセサは`ngModelChange`イベントを発行する`NgModel.viewToModelUpdate()`メソッドも呼び出します。
1. コンポーネントテンプレートは`favoriteColor`プロパティに双方向データバインディングを使っているので、コンポーネントの`favoriteColor`プロパティは
`ngModelChange`イベント(*Blue*)によって発行された値に更新されます。

<div class="lightbox">
  <img src="generated/images/guide/forms-overview/dataflow-td-forms-vtm.png" alt="Template-driven forms data flow - view to model" width="100%">
</div>

The model-to-view diagram shows how data flows from model to view when the `favoriteColor` changes from *Blue* to *Red*, through the following steps

1. コンポーネントの`favoriteColor`の値が更新されます。
1. 変更検知が開始します。
1. 変更検知中に、その入力の1つの値が変更されたので、`ngOnChanges`ライフサイクルフックが`NgModel`ディレクティブインスタンスで呼び出されます。
1. `ngOnChanges()`メソッドは、内部の`FormControl`インスタンスの値を設定するための非同期タスクをキューに入れます。
1. 変更検知が完了します。
1. 次のtickで、`FormControl`インスタンス値を設定するためのタスクが実行されます。
1. `FormControl`インスタンスは`valueChanges`オブジェクトを通して最新の値を発行します。
1. `valueChanges`Observableのサブスクライバーが新しい値を受け取ります。
1. コントロール値アクセサは、ビュー内のフォームのinput要素を最新の`favoriteColor`値で更新します。

<div class="lightbox">
  <img src="generated/images/guide/forms-overview/dataflow-td-forms-mtv.png" alt="Template-driven forms data flow - model to view" width="100%">
</div>

{@a mutability-of-the-data-model}

### Mutability of the data model

The change-tracking method plays a role in the efficiency of your application.

* **Reactive forms** keep the data model pure by providing it as an immutable data structure.
Each time a change is triggered on the data model, the `FormControl` instance returns a new data model rather than updating the existing data model.
This gives you the ability to track unique changes to the data model through the control's observable.
Change detection is more efficient because it only needs to update on unique changes.
Because data updates follow reactive patterns, you can integrate with observable operators to transform data.

* **Template-driven** forms rely on mutability with two-way data binding to update the data model in the component as changes are made in the template.
Because there are no unique changes to track on the data model when using two-way data binding, change detection is less efficient at determining when updates are required.

The difference is demonstrated in the previous examples that use the favorite-color input element.

* With reactive forms, the **`FormControl` instance** always returns a new value when the control's value is updated.

* With template-driven forms, the **favorite color property** is always modified to its new value.

{@a validation}

## フォームバリデーション

バリデーションは、一連のフォームを管理するための不可欠な部分です。あなたが必須のフィールドをチェックしているか既存のユーザー名のために外部のAPIを問い合わせているかにかかわらず、Angularはカスタムバリデータを作成する機能と同様にビルトインバリデータのセットを提供します。

* **リアクティブフォーム** はバリデーションするためのコントロールを受け取る **関数** としてカスタムバリデータを定義します。
* **テンプレート駆動フォーム** はテンプレート **ディレクティブ** に関連付けられており、バリデート関数をラップするカスタムバリデータディレクティブを提供する必要があります。

詳細については[フォームバリデーション](guide/form-validation)を参照してください。

## テスト

テストは複雑なアプリケーションで大きな役割を果たし、フォームが正しく機能していることを検証するときには、シンプルなテスト戦略が役立ちます。
リアクティブフォームとテンプレート駆動フォームは、フォームコントロールとフォームフィールドの変更に基づいてアサーションを実行するためのUIのレンダリングに異なるレベルの依存性を持っています。
次の例では、リアクティブフォームとテンプレート駆動フォームを使用してフォームをテストするプロセスを説明します。

### リアクティブフォームをテストする

リアクティブフォームはフォームとデータモデルへの同期アクセスを提供するので比較的簡単なテスト戦略を提供し、UIをレンダリングせずにテストすることができます。
これらのテストでは、状態とデータは、変更検知サイクルと相互作用することなく、コントロールを通して参照および操作されます。

The following tests use the favorite-color components from previous examples to verify the view-to-model and model-to-view data flows for a reactive form.

**Verifying view-to-model data flow**

The first example performs the following steps to verify the view-to-model data flow.

1. フォームのinput要素についてビューを参照し、テスト用のカスタムの"input"イベントを作成します。
1. input要素の新しい値を*Red*に設定して、フォームのinput要素に"input"イベントをディスパッチします。
1. コンポーネントの`favoriteColorControl`の値がinput要素からの値と一致することをアサートします。

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" region="view-to-model" header="Favorite color test - view to model">
</code-example>

The next example performs the following steps to verify the model-to-view data flow.

1. 新しい値を設定するために、`FormControl`インスタンスである`favoriteColorControl`を使います。
1. フォームのinput要素のビューを参照します。
1. コントロールに設定された新しい値がinput要素の値と一致することをアサートします。

<code-example path="forms-overview/src/app/reactive/favorite-color/favorite-color.component.spec.ts" region="model-to-view" header="Favorite color test - model to view">
</code-example>

### テンプレート駆動フォームをテストする

テンプレート駆動フォームでテストを書くには、変更検知プロセスに関する詳細な知識と、各サイクルでディレクティブがどのように実行されるかを理解して、要素が正しいタイミングで参照、テスト、または変更されるようにする必要があります。

次のテストでは、テンプレート駆動フォームのビューからモデルへ、およびモデルからビューへのデータフローを検証するために、さきほどのお気に入りの色コンポーネントを使用します。

ビューからモデルへのデータフローを検証するテストは次のようになります。

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" region="view-to-model" header="Favorite color test - view to model">
</code-example>

ビューからモデルのテストで実行される手順は次のとおりです。

1. フォームのinput要素についてビューを参照し、テスト用のカスタムの"input"イベントを作成します。
1. input要素の新しい値を*Red*に設定して、フォームのinput要素に"input"イベントをディスパッチします。
1. テストフィクスチャを通して変化検知を実行します。
1. コンポーネントの`favoriteColor`プロパティ値がinput要素の値と一致することをアサートします。

モデルからビューへのデータフローを検証するテストは次のようになります。

<code-example path="forms-overview/src/app/template/favorite-color/favorite-color.component.spec.ts" region="model-to-view" header="Favorite color test - model to view">
</code-example>

モデルからビューのテストで実行される手順は次のとおりです。

1. `favoriteColor`プロパティの値を設定するためにコンポーネントインスタンスを使います。
1. テストフィクスチャを通して変化検知を実行します。
1. `tick()`メソッドを使って`fakeAsync()`タスク内の時間の経過をシミュレートします。
1. フォームのinpuy要素のビューを参照します。
1. input要素の値がコンポーネントインスタンスの`favoriteColor`プロパティの値と一致することをアサートします。


## 次のステップ

リアクティブフォームの詳細については次のガイドを参照してください:

* [リアクティブフォーム](guide/reactive-forms)
* [フォームバリデーション](guide/form-validation#reactive-form-validation)
* [ダイナミックフォーム](guide/dynamic-form)

テンプレート駆動フォームの詳細については次のガイドを参照してください:

* [Building a template-driven form](guide/forms) tutorial
* [フォームバリデーション](guide/form-validation#template-driven-validation)
* `NgForm` directive API reference

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-09-07
