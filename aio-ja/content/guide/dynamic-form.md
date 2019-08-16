# ダイナミックフォーム

{@a top}

フォームを手作業で実装すると、時間もコストもかかることがあります。
必要なフォームの数が多く、それらが似ており、
そして変化の激しいビジネスやレギュレーションの要件に合わせて頻繁に変更が入る場合には特にそうです。

ビジネス・オブジェクト・モデルを記述するメタデータに基づいて、
フォームを動的に作成する方がより経済的かもしれません。

このクックブックでは、`formGroup` を使って異なるコントロールタイプとバリデーションをもつ簡単なフォームを、
動的にレンダリングする方法を解説していきます。
ここで解説するのは原始的なスタート部分です。
はるかにバラエティに富んだフォーム項目、よりよいレンダリング、優れたユーザー体験をサポートするように進化するかもしれません。
そのような偉大なフォームも、すべて始まりは質素なものです。

このクックブックにおける例題は、仕事を求めるヒーローのための
オンラインアプリケーションエクスペリエンスを構築するためのダイナミックフォームです。
紹介会社は、選考プロセスを常に見直しています。
*アプリケーションコードを変更せずに* フォームを作成することができます。
{@a toc}

<live-example name="dynamic-form"></live-example> を参照してください。

{@a bootstrap}

## ブートストラップ

まず、`AppModule` と呼ばれる`NgModule`を作成しましょう。

このクックブックでは、[reactive forms](guide/reactive-forms)を用いてフォームを作成していきます。

リアクティブフォームは、`ReactiveFormsModule`と呼ばれる別の`NgModule`に属します。
したがって、リアクティブフォームのディレクティブにアクセスするためには、
`ReactiveFormsModule`を`@angular/forms`ライブラリからインポートする必要があります。

そして、`main.ts`で`AppModule`をブートストラップします。


<code-tabs>

  <code-pane header="app.module.ts" path="dynamic-form/src/app/app.module.ts">

  </code-pane>

  <code-pane header="main.ts" path="dynamic-form/src/main.ts">

  </code-pane>

</code-tabs>


{@a object-model}

## 質問のモデル

次のステップでは、フォーム機能によって必要とされるすべてのシナリオを記述できるオブジェクトモデルを定義していきます。
ヒーローの選考プロセスには、多くの質問が用意されたフォームが含まれています。
質問は、モデルのもっとも基本的なオブジェクトです。

次の`QuestionBase`は基本的な質問のクラスです。


<code-example path="dynamic-form/src/app/question-base.ts" header="src/app/question-base.ts">

</code-example>



この基底クラスから`TextboxQuestion`と`DropdownQuestion`という、
2つの新しいクラスを派生させることができます。
これは、テキストボックスとドロップダウン質問を表します。
考え方としては、フォームが特定の質問タイプにバインドされ、適切なコントロールを動的にレンダリングするということです。

`TextboxQuestion`は、`type`プロパティを介してtext、email、urlといった
複数のHTML5タイプをサポートしています。


<code-example path="dynamic-form/src/app/question-textbox.ts" header="src/app/question-textbox.ts"></code-example>



`DropdownQuestion`は、セレクトボックスに選択肢のリストを表示します。


<code-example path="dynamic-form/src/app/question-dropdown.ts" header="src/app/question-dropdown.ts"></code-example>



次に`QuestionControlService`です。
これは質問を`FormGroup`に変換するためのシンプルなサービスで、
一言でいえば、フォームグループは質問モデルのメタデータを用いて、デフォルト値とバリデーションルールをセットすることができます。


<code-example path="dynamic-form/src/app/question-control.service.ts" header="src/app/question-control.service.ts"></code-example>

{@a form-component}

## 質問フォームコンポーネント
完成したモデルを定義できたので、
ダイナミックフォームを描画するコンポーネントを作成する準備が整いました。


`DynamicFormComponent`はエントリーポイントで、フォームのメインコンテナです。

<code-tabs>

  <code-pane header="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html">

  </code-pane>

  <code-pane header="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts">

  </code-pane>

</code-tabs>



これは質問のリストを表し、それぞれは `<app-question>` コンポーネントにバインドされています。
`<app-question>` タグは、データバインドされた質問オブジェクトの値に基づいて _個々の_ 質問の詳細を表現するコンポーネントである、
DynamicFormQuestionComponentにマッチします。


<code-tabs>

  <code-pane header="dynamic-form-question.component.html" path="dynamic-form/src/app/dynamic-form-question.component.html">

  </code-pane>

  <code-pane header="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts">

  </code-pane>

</code-tabs>



このコンポーネントは、あなたのモデルに任意のタイプの質問を提示できます。
この時点では2つのタイプの質問しかありませんが、もっと多くのことを想像することができます。
`ngSwitch`は表示する質問のタイプを決定します。

どちらのコンポーネントでもAngularの**formGroup**を使用して、表示および検証のルールをもつ質問モデルから定義された、基礎となるコントロールオブジェクトにテンプレートHTMLを接続します。

`formControlName`と`formGroup`は`ReactiveFormsModule`で定義されたディレクティブです。
テンプレートは`AppModule`から`ReactiveFormsModule`をインポートしたので、
これらのディレクティブに直接アクセスできます。
{@a questionnaire-data}

## アンケートデータ

`DynamicFormComponent`は、`@Input() questions`で宣言されている配列のかたちで、質問のリストがバインディングされることを期待しています。

 求人申請のために定義した一連の質問は、`QuestionService`から返されます。
 実際のアプリでは、これらの質問をストレージから取得します。

 キーポイントは、あなたが`QuestionService`から返されたオブジェクトを通して
 ヒーローを雇用するためのアプリケーションの質問を完全に制御することです。
 アンケートのメンテナンスは、`questions`配列の
 オブジェクトを追加、更新、削除するというシンプルな作業で済みます。


<code-example path="dynamic-form/src/app/question.service.ts" header="src/app/question.service.ts">

</code-example>



最後に、`AppComponent`シェルにフォームのインスタンスを表示します。


<code-example path="dynamic-form/src/app/app.component.ts" header="app.component.ts">

</code-example>

{@a dynamic-template}

## ダイナミック テンプレート
この例ではヒーローのジョブアプリケーションをモデリングしていますが、
`QuestionService`から返されたオブジェクト以外に
特定のヒーローに関する質問は一切ありません。

これは、*質問* オブジェクトモデルと互換性がある限り、
任意のタイプの調査のコンポーネントを再利用することができるので、非常に重要です。
キーは、特定の質問についてハードコーディングされた前提を作らずに
フォームをレンダリングするために使用されるメタデータの動的データバインディングです。
コントロールのメタデータに加えて、動的なバリデーションを追加します。

*保存* ボタンは、フォームのバリデーションがパスされた状態になるまで無効となります。
フォームのバリデーションをパスした場合、*保存* をクリックすることで、アプリケーションは現在のフォームの値をJSONとしてレンダリングします。
これは、任意のユーザー入力がデータモデルにバインドされていることを証明します。
データの保存と取り込み処理については、別の機会に学習しましょう。


最終的にフォームは次のようになります:

<figure>
  <img src="generated/images/guide/dynamic-form/dynamic-form.png" alt="Dynamic-Form">
</figure>



[トップに戻る](guide/dynamic-form#top)
