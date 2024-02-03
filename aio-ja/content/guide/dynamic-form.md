# ダイナミックフォームの構築

アンケートなどの多くの形式は、形式と意図が互いに非常に似ている場合があります。
このようなフォームのさまざまなバージョンをより速く簡単に生成するために、ビジネスオブジェクトモデルを記述するメタデータに基づいて _動的フォームテンプレート_ を作成できます。
その後、テンプレートを使用して、データモデルの変更に応じて新しいフォームを自動的に生成できます。

この手法は、急速に変化するビジネス要件や規制要件を満たすために
コンテンツを頻繁に変更する必要がある種類のフォームがある場合に特に役立ちます。
典型的なユースケースはアンケートです。 さまざまなコンテキストのユーザーから入力を取得する必要がある場合があります。
ユーザーに表示されるフォームの形式とスタイルは一定である必要がありますが、実際に尋ねる必要がある質問は状況によって異なります。

このチュートリアルでは、基本的なアンケートを提示する動的なフォームを作成します。
仕事を求めるヒーローのためのオンラインアプリケーションを構築します。
紹介会社は常に選考プロセスを常に見直していますが、動的フォームを使用することで、
アプリケーションコードを変更せずに新しいフォームをその場で作成できます。

このチュートリアルでは、次の手順について説明します。

1. プロジェクトのリアクティブフォームを有効にします。
2. フォームコントロールを表すデータモデルを確立します。
3. モデルにサンプルデータを入力します。
4. フォームコントロールを動的に作成するコンポーネントを開発します。

作成するフォームでは、入力の検証とスタイル設定を使用してユーザー体験を向上させます。
すべてのユーザー入力が有効な場合にのみ有効になる送信ボタンがあり、無効な入力には色分けとエラーメッセージでフラグが付けられます。

最初のバージョンは、より多様な質問、より優雅なレンダリング、および優れたユーザー体験をサポートするように進化する可能性があります。

<div class="alert is-helpful">

<live-example name="dynamic-form"></live-example> を参照してください。

</div>

## 前提条件

このチュートリアルを実行する前に、次のことを基本的に理解しておく必要があります。

* [TypeScript](https://www.typescriptlang.org/ 'The TypeScript language') および HTML5 プログラミング。
* [Angular アプリケーション設計](guide/architecture 'Introduction to Angular app-design concepts') の基本的な概念。
* [リアクティブフォーム](guide/reactive-forms 'Reactive forms guide') の基本的な知識。

## プロジェクトのリアクティブフォームを有効にする

ダイナミックフォームはリアクティブフォームに基づいています。 

To give the application access reactive forms directives, import `ReactiveFormsModule` from the `@angular/forms` library into the necessary components.

この例の次のコードは、ルートモジュールの設定を示しています。

<code-tabs>
    <code-pane header="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts"></code-pane>
    <code-pane header="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts"></code-pane>
</code-tabs>


{@a object-model}

## フォームオブジェクトモデルを作成する

ダイナミックフォームには、フォーム機能に必要なすべてのシナリオを記述できるオブジェクトモデルが必要です。
ヒーローアプリケーションフォームの例は、一連の質問です。つまり、フォームの各コントロールは、質問をして回答を受け入れる必要があります。

このタイプのフォームのデータモデルは質問を表す必要があります。
この例には、モデルの基本的なオブジェクトとして質問を定義する `DynamicFormQuestionComponent` が含まれています。

次の `QuestionBase` は、フォームで質問とその回答を表すことができる一連のコントロールの基本クラスです。

<code-example path="dynamic-form/src/app/question-base.ts" header="src/app/question-base.ts">

</code-example>

### コントロールクラスを定義する

この例では、このベースから、異なるコントロールタイプを表す 2 つの新しいクラス `TextboxQuestion` と `DropdownQuestion` を派生させます。
次のステップでフォームテンプレートを作成するとき、適切なコントロールを動的にレンダリングするために、これらの特定の質問タイプをインスタンス化します。

| Control type                    | Details                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TextboxQuestion` control type  | Presents a question and lets users enter input. <code-example header="src/app/question-textbox.ts" path="dynamic-form/src/app/question-textbox.ts"></code-example> The `TextboxQuestion` control type is represented in a form template using an `<input>` element. The `type` attribute of the element is defined based on the `type` field specified in the `options` argument \(for example `text`, `email`, `url`\). |
| `DropdownQuestion` control type | Presents a list of choices in a select box. <code-example header="src/app/question-dropdown.ts" path="dynamic-form/src/app/question-dropdown.ts"></code-example>                                                                                                                                                                                                                                                         |

### フォームグループを作成する

ダイナミックフォームはサービスを使用して、フォームモデルに基づき、グループ化された入力コントロールのセットを作成します。
次の `QuestionControlService` は、質問モデルのメタデータを使用する一連の `FormGroup` インスタンスを収集します。 デフォルト値と検証ルールを指定できます。

<code-example path="dynamic-form/src/app/question-control.service.ts" header="src/app/question-control.service.ts"></code-example>

{@a form-component}

## ダイナミックフォームのコンテンツを作成する

ダイナミックフォーム自体は、後の手順で追加するコンテナーコンポーネントによって表されます。
それぞれの質問は、 `DynamicFormQuestionComponent` のインスタンスと一致する `<app-question>` タグによってフォームコンポーネントのテンプレートで表されます。

`DynamicFormQuestionComponent` は、データにバインドされた質問オブジェクトの値に基づいて個々の質問の詳細をレンダリングする責任があります。
フォームは [`[formGroup]` ディレクティブ](api/forms/FormGroupDirective 'API reference') に依存して、テンプレート HTML を基礎となるコントロールオブジェクトに接続します。
`DynamicFormQuestionComponent` はフォームグループを作成し、表示および検証ルールを指定して、質問モデルで定義されたコントロールをそれらに追加します。

<code-tabs>
    <code-pane header="dynamic-form-question.component.html" path="dynamic-form/src/app/dynamic-form-question.component.html"></code-pane>
    <code-pane header="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts"></code-pane>
</code-tabs>


`DynamicFormQuestionComponent` の目的は、モデルで定義された質問タイプを提示することです。
この時点では 2 種類の質問しかありませんが、さらに多くなることを想像できます。
テンプレートの `ngSwitch` ステートメントは、表示する質問のタイプを決定します。
スイッチは、 [`formControlName`](api/forms/FormControlName 'FormControlName directive API reference') および [`formGroup`](api/forms/FormGroupDirective 'FormGroupDirective API reference') セレクターでディレクティブを使用します。 どちらのディレクティブも `ReactiveFormsModule` で定義されています。

{@a questionnaire-data}

### データの提供

個々のフォームを作成するための特定の一連の質問を提供するには、別のサービスが必要です。
この例では、ハードコードされたサンプルデータからこの質問の配列を提供するために、 `QuestionService` を作成します。
実際のアプリケーションでは、サービスはバックエンドシステムからデータをフェッチする場合があります。
けれども、重要な点は、 `QuestionService` から返されたオブジェクトを介して、ヒーローの求人応募の質問を完全に制御することです。
要件が変化しても、アンケートを維持するには `questions` 配列のオブジェクトを追加、更新、削除するだけです。


`QuestionService` は `@Input()` でバインドされたされた質問の配列の形式で、一連の質問を提供します。

<code-example path="dynamic-form/src/app/question.service.ts" header="src/app/question.service.ts">

</code-example>

<a id="dynamic-template"></a>

## ダイナミックフォームテンプレートを作成する

`DynamicFormComponent` コンポーネントは、フォームのエントリポイントとメインコンテナーであり、テンプレートで `<app-dynamic-form>` を使用して表されます。

`DynamicFormComponent` コンポーネントは、各質問を `DynamicFormQuestionComponent` と一致する `<app-question>` 要素にバインドすることで質問のリストを提示します。

<code-tabs>
    <code-pane header="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html"></code-pane>
    <code-pane header="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts"></code-pane>
</code-tabs>

### フォームを表示する

ダイナミックフォームのインスタンスを表示するために、 `AppComponent` シェルテンプレートは、 `QuestionService` によって返された `questions` 配列をフォームコンテナーコンポーネント `<app-dynamic-form>` に渡します。

<code-example path="dynamic-form/src/app/app.component.ts" header="app.component.ts">

</code-example>

この例では、ヒーローの求人アプリケーションのモデルを提供しますが、
`QuestionService` によって返されるオブジェクト以外の特定のヒーローの質問への参照はありません。
このモデルとデータの分離により、 _質問_ オブジェクトモデルと互換性がある限り、
コンポーネントをあらゆる種類の調査に再利用できます。

### 有効なデータの確保

フォームテンプレートは、メタデータの動的データバインディングを使用して、
特定の質問についてハードコードされた想定を行わずにフォームをレンダリングします。
制御メタデータとバリデーション基準の両方を動的に追加します。

有効な入力を確実にするために、フォームが有効な状態になるまで _保存_ ボタンは無効になります。
フォームが有効な場合、 _保存_ をクリックすると、アプリケーションが現在のフォームの値を JSON としてレンダリングします。

次の図は、最終的なフォームを示しています。

<div class="lightbox">
  <img src="generated/images/guide/dynamic-form/dynamic-form.png" alt="Dynamic-Form">
</div>

## 次のステップ

| Steps                                           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Different types of forms and control collection | This tutorial shows how to build a questionnaire, which is just one kind of dynamic form. The example uses `FormGroup` to collect a set of controls. For an example of a different type of dynamic form, see the section [Creating dynamic forms](guide/reactive-forms#creating-dynamic-forms 'Create dynamic forms with arrays') in the Reactive Forms guide. That example also shows how to use `FormArray` instead of `FormGroup` to collect a set of controls. |
| Validating user input                           | The section [Validating form input](guide/reactive-forms#validating-form-input 'Basic input validation') introduces the basics of how input validation works in reactive forms. <br /> The [Form validation guide](guide/form-validation 'Form validation guide') covers the topic in more depth.                                                                                                                                                                  |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-08-30
