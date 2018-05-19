# ダイナミックフォーム

{@a top}

フォームを手作業で作っていくと、時間もコストもかかることがあります。
特に多数のものが必要な場合は、お互いが似ており、
変化の激しいビジネスやレギュレーションの要件に合わせて頻繁に変更が入るでしょう｡

ビジネス・オブジェクト・モデルを記述するメタデータに基づいて、
フォームを動的に作成する方がより経済的です。

このクックブックでは、`formGroup` 使って異なるコントロールタイプとバリデーションを持つ簡単なフォームを、
動的にレンダリングする方法を解説していきます。
これは基本的なスタートです。
はるかに豊富な質問、より優雅なレンダリング、優れたユーザーエクスペリエンスをサポートするように進化するかもしれません。
そのような偉大さはすべて謙虚な始まりです。

このクックブックの例は、仕事を求めるヒーローのための
オンラインアプリケーションを構築するための動的なフォームです。
紹介会社は、選考プロセスを常に見直しています。
アプリケーションコードを変更せずにフォームを作成することができます。
{@a toc}

<live-example name="dynamic-form"></live-example> も参照してください。

{@a bootstrap}

## ブートストラップ

まず、`AppModule` と呼ばれる`NgModule`を作成します。

このクックブックでは、[reactive forms](guide/reactive-forms)を用いてフォームを作成していきます。

リアクティブフォームは、`ReactiveFormsModule`と呼ばれる別の`NgModule`に属します。
したがって、リアクティブフォームのディレクティブにアクセスするためには、`@ActiveFormsModule`を`@angular/forms`ライブラリからインポートする必要があります。

そして、`main.ts`で`AppModule`をブートストラップします。


<code-tabs>

  <code-pane title="app.module.ts" path="dynamic-form/src/app/app.module.ts">

  </code-pane>

  <code-pane title="main.ts" path="dynamic-form/src/main.ts">

  </code-pane>

</code-tabs>


{@a object-model}

## 設問モデル

次のステップでは、フォーム機能によって必要とされるすべてのシナリオを記述できるオブジェクトモデルを定義していきます。
ヒーローの選考プロセスには、多くの設問が用意されたフォームが含まれています。
設問は、モデルの最も基本的なオブジェクトです。

次の`QuestionBase`は基本的な設問を含有した基底クラスです。


<code-example path="dynamic-form/src/app/question-base.ts" title="src/app/question-base.ts">

</code-example>



この基底クラスから`TextboxQuestion`と`DropdownQuestion`という、2つの新しいクラスを派生させることができます。
これは、テキストボックスとドロップダウンの設問を表します。
考え方としては、フォームが特定の設問タイプにバインドされ、適切なコントロールを動的にレンダリングすることです。

`TextboxQuestion`は、`type`プロパティを介してtext、email、urlなどの複数のHTML5のタイプをサポートしています。


<code-example path="dynamic-form/src/app/question-textbox.ts" title="src/app/question-textbox.ts" linenums="false">

</code-example>



`DropdownQuestion`は、セレクトボックスに選択肢のリストを表示します。


<code-example path="dynamic-form/src/app/question-dropdown.ts" title="src/app/question-dropdown.ts" linenums="false">

</code-example>



次に`QuestionControlService`です。
これは設問を`FormGroup`に変換するためのシンプルなサービスで、
一言で言えば、フォームグループは質問モデルのメタデータを用いて、デフォルト値とバリデーションルールをセットすることができます。


<code-example path="dynamic-form/src/app/question-control.service.ts" title="src/app/question-control.service.ts" linenums="false">

</code-example>

{@a form-component}

## 設問フォームコンポーネント
完成したモデルを定義したので、
動的フォームを表すコンポーネントを作成する準備が整いました。


`DynamicFormComponent`はエントリーポイントで、フォームのメインコンテナです。

<code-tabs>

  <code-pane title="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html">

  </code-pane>

  <code-pane title="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts">

  </code-pane>

</code-tabs>



これは設問のリストを提示し、それぞれ`<app-question>`コンポーネント要素に束縛されています。
`<app-question>` タグは、データバインドされた質問オブジェクトの値に基づいて _個々の_ 質問の詳細を表現するコンポーネントである、
DynamicFormQuestionComponentにマッチします。


<code-tabs>

  <code-pane title="dynamic-form-question.component.html" path="dynamic-form/src/app/dynamic-form-question.component.html">

  </code-pane>

  <code-pane title="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts">

  </code-pane>

</code-tabs>



このコンポーネントは、あなたのモデルに任意のタイプの設問を提示できます。
この時点では2つのタイプの設問しかありませんが、もっと多くのことを想像することができます。
`ngSwitch`は表示する設問のタイプを決定します。

両方のコンポーネントでAngular *formGroup* を使用してテンプレートHTMLを基礎となるコントロールオブジェクトに接続し、設問モデルから表示およびバリデーションルールを使用して読み込みます。

`formControlName`と`formGroup`は`ReactiveFormsModule`で定義されたディレクティブです。
テンプレートは`AppModule`から`ReactiveFormsModule`をインポートしたので、
これらのディレクティブに直接アクセスできます。
{@a questionnaire-data}

## アンケートデータ

`DynamicFormComponent`は`@Input() questions`に束縛された配列の形で設問のリストを期待しています。

 求人申請のために定義した一連の設問は、`QuestionService`から返されます。
 実際のアプリでは、これらの設問をストレージから取得します。

 キーポイントは、あなたが`QuestionService`から返されたオブジェクトを通して
 ヒーロージョブのアプリケーションの質問を完全に制御することです。
 アンケートのメンテナンスは、`questions`配列から
 オブジェクトを追加、更新、削除するという単純な作業です。


<code-example path="dynamic-form/src/app/question.service.ts" title="src/app/question.service.ts">

</code-example>



最後に、`AppComponent`シェルにフォームのインスタンスを表示します。


<code-example path="dynamic-form/src/app/app.component.ts" title="app.component.ts">

</code-example>

{@a dynamic-template}

## ダイナミック テンプレート
この例ではヒーローのジョブアプリケーションをモデリングしていますが、
`QuestionService` によって返されたオブジェクトの外で
特定のヒーローの設問への参照はありません。

これは、*設問* オブジェクトモデルと互換性がある限り、
任意のタイプの調査のコンポーネントを再利用することができるので、非常に重要です。
キーは、特定の質問についてハードコーディングされた前提を作らずに
フォームをレンダリングするために使用されるメタデータの動的データバインディングです。
コントロールのメタデータに加えて、動的なバリデーションを追加します。

*保存* ボタンは、フォームが有効な状態になるまで無効になります。
フォームが有効な場合、*保存* をクリックすると、アプリケーションは現在のフォームの値をJSONとしてレンダリングします。
これは、任意のユーザ入力がデータモデルにバインドされていることを証明します。
データの保存と取り込み処理については、別の機会に学習しましょう。


最終的にフォームは次のようになります:

<figure>
  <img src="generated/images/guide/dynamic-form/dynamic-form.png" alt="Dynamic-Form">
</figure>



[トップに戻る](guide/dynamic-form#top)
