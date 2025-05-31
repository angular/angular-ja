# 動的フォームの作成

アンケートなどの多くのフォームは、フォーマットと意図において非常に類似している場合があります。
このようなフォームの異なるバージョンをより速く簡単に生成できるように、ビジネスオブジェクトモデルを記述するメタデータに基づいて、_動的フォームテンプレート_を作成できます。
その後、テンプレートを使用して、データモデルの変更に応じて、新しいフォームを自動的に生成します。

このテクニックは、ビジネスや規制要件の急速な変化に対応するために、コンテンツを頻繁に変更する必要があるフォームの種類を持つ場合に特に役立ちます。
一般的なユースケースはアンケートです。
さまざまなコンテキストでユーザーからの入力を受け取る必要がある場合があります。
ユーザーが見ているフォームのフォーマットとスタイルは一定に保つ必要がありますが、実際に尋ねる必要がある質問はコンテキストによって異なります。

このチュートリアルでは、基本的なアンケートを表示する動的フォームを作成します。
雇用を求めるヒーローのためのオンラインアプリケーションを構築します。
エージェンシーは常にアプリケーションプロセスをいじっていますが、
動的フォームを使用することでアプリケーションコードを変更せずに新しいフォームをオンザフライで作成できます。

このチュートリアルでは、次の手順について説明します。

1. プロジェクトでリアクティブフォームを有効にする。
1. フォームコントロールを表すデータモデルを確立する。
1. サンプルデータでモデルを埋める。
1. フォームコントロールを動的に作成するコンポーネントを開発する。

作成するフォームでは、入力検証とスタイリングを使用してユーザー体験を向上させます。
すべてのユーザー入力が有効な場合にのみ有効になる送信ボタンがあり、無効な入力を色分けとエラーメッセージでフラグ付けします。

この基本バージョンは、より多くの種類の質問、より洗練されたレンダリング、優れたユーザー体験をサポートするように進化させることができます。

## プロジェクトでリアクティブフォームを有効にする

動的フォームはリアクティブフォームに基づいています。

アプリケーションにリアクティブフォームディレクティブへのアクセス権を与えるには、必要なコンポーネントに `@angular/forms` ライブラリから `ReactiveFormsModule` をインポートします。

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## フォームオブジェクトモデルを作成する

動的フォームには、フォーム機能に必要なすべてのシナリオを記述できるオブジェクトモデルが必要です。
例のヒーローアプリケーションフォームは、一連の質問です。つまり、フォーム内の各コントロールは質問をし、回答を受け入れる必要があります。

このタイプのフォームのデータモデルは、質問を表す必要があります。
例には、`DynamicFormQuestionComponent` が含まれており、質問をモデルの基本オブジェクトとして定義しています。

次の `QuestionBase` は、フォーム内の質問とその回答を表すことができる一連のコントロールのベースクラスです。

<docs-code header="src/app/question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### コントロールクラスを定義する

このベースから、例では、異なるコントロールタイプを表す `TextboxQuestion` と `DropdownQuestion` の2つの新しいクラスを派生させます。
次のステップでフォームテンプレートを作成するときは、適切なコントロールを動的にレンダリングするために、これらの特定の質問タイプをインスタンス化します。

`TextboxQuestion` コントロールタイプは、フォームテンプレートでは `<input>` 要素を使用して表されます。質問を表示し、ユーザーが入力をできるようにします。要素の `type` 属性は、`options` 引数で指定された `type` フィールドに基づいて定義されます（例：`text`、`email`、`url`）。

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

`DropdownQuestion` コントロールタイプは、選択ボックスに選択肢のリストを表示します。

<docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### フォームグループを構成する

動的フォームは、サービスを使用して、質問モデルのメタデータに基づいて、入力コントロールのグループ化されたセットを作成します。
次の `QuestionControlService` は、質問モデルからメタデータを使用する `FormGroup` インスタンスのセットを収集します。
デフォルト値と検証ルールを指定できます。

<docs-code header="src/app/question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## 動的フォームコンテンツを構成する

動的フォーム自体は、後で追加するコンテナーコンポーネントで表されます。
各質問は、フォームコンポーネントのテンプレートで、`DynamicFormQuestionComponent` のインスタンスと一致する `<app-question>` タグで表されます。

`DynamicFormQuestionComponent` は、データバインドされた質問オブジェクトの値に基づいて、個々の質問の詳細をレンダリングする責任があります。
フォームは、[`[formGroup]` ディレクティブ](api/forms/FormGroupDirective "API リファレンス") に依存して、テンプレートHTMLを基礎となるコントロールオブジェクトに接続します。
`DynamicFormQuestionComponent` は、フォームグループを作成し、質問モデルにより定義されたコントロールでそれらを埋め、表示と検証ルールを指定します。

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

`DynamicFormQuestionComponent` の目標は、モデルで定義された質問タイプを提示することです。
現時点では質問タイプが2つしかありませんが、さらに多くのタイプが考えられます。
テンプレートの `@switch` ブロックは、表示する質問タイプを決定します。
スイッチは、[`formControlName`](api/forms/FormControlName "FormControlName ディレクティブ API リファレンス") と [`formGroup`](api/forms/FormGroupDirective "FormGroupDirective API リファレンス") セレクターを持つディレクティブを使用します。
両方のディレクティブは `ReactiveFormsModule` で定義されています。

### データを供給する

個々のフォームを構築するために、特定の質問セットを供給するサービスも必要です。
この演習では、ハードコードされたサンプルデータからこの質問の配列を供給する `QuestionService` を作成します。
実際のアプリケーションでは、サービスはバックエンドシステムからデータを取得する可能性があります。
ただし、重要な点は、ヒーローの求人質問を `QuestionService` から返されるオブジェクトを通じて完全に制御できることです。
要件が変更された場合にアンケートを維持するには、`questions` 配列からオブジェクトを追加、更新、削除するだけです。

`QuestionService` は、`input()` questionsにバインドされた配列の形式で、質問セットを供給します。

<docs-code header="src/app/question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## 動的フォームテンプレートを作成する

`DynamicFormComponent` コンポーネントは、テンプレートで `<app-dynamic-form>` を使用して表されるフォームのエントリポイントであり、メインコンテナーです。

`DynamicFormComponent` コンポーネントは、各質問を、`DynamicFormQuestionComponent` と一致する `<app-question>` 要素にバインドすることによって、質問のリストを表示します。

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### フォームを表示する

動的フォームのインスタンスを表示するには、`AppComponent` シェルテンプレートは、`QuestionService` から返された `questions` 配列を、フォームコンテナーコンポーネント `<app-dynamic-form>` に渡します。

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

このモデルとデータの分離により、_質問_ オブジェクトモデルと互換性がある限り、あらゆるタイプのアンケートにコンポーネントを再利用できます。

### 有効なデータを確保する

フォームテンプレートは、特定の質問についてハードコードされた仮定を一切行わずに、メタデータの動的データバインドを使用してフォームをレンダリングします。
コントロールメタデータと検証基準の両方を動的に追加します。

有効な入力を確保するために、フォームが有効な状態になるまで、_保存_ ボタンは無効になっています。
フォームが有効になったら、_保存_ をクリックすると、アプリケーションは現在のフォーム値をJSONとしてレンダリングします。

次の図は、最終的なフォームを示しています。

<img alt="Dynamic-Form" src="assets/images/guide/dynamic-form/dynamic-form.png">

## 次のステップ

<docs-pill-row>
  <docs-pill title="フォーム入力の検証" href="guide/forms/reactive-forms#validating-form-input" />
  <docs-pill title="フォーム検証ガイド" href="guide/forms/form-validation" />
</docs-pill-row>
