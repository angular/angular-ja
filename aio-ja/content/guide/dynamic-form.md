# ダイナミックフォーム

{@a top}

フォームを手作業で実装すると、時間もコストもかかることがあります。
特に多くのフォームの実装が必要となると、お互いが似ており、
変化の激しいビジネスやレギュレーションの要件に合わせて頻繁に変更が入るでしょう｡

ビジネス・オブジェクト・モデルを記述するメタデータに基づいて
フォームを動的に作成する方が、無駄がないと思いませんか。

このクックブックでは、`formGroup` 使って異なるコントロールタイプとバリデーションをもつ簡単なフォームを、
動的にレンダリングする方法を解説していきます。
ここで解説するのは原始的なスタート部分です。
はるかにバラエティに富んだフォーム項目、よりよいレンダリング、優れたユーザーエクスペリエンスをサポートするように進化するかもしれません。
そのような偉大なフォームも、すべて始まりは質素なものです。

このクックブックでは例題として、仕事を求めるヒーローのための
オンラインアプリケーションエクスペリエンスを構築するためのダイナミックフォームです。
紹介会社は、選考プロセスを常に見直しています。
*アプリケーションコードを変更せずに* フォームを作成することができます。
{@a toc}

<live-example name="dynamic-form"></live-example> も参照してください。

{@a bootstrap}

## ブートストラップ

まず、`AppModule` と呼ばれる`NgModule`を作成しましょう。

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
設問は、モデルのもっとも基本的なオブジェクトです。

次の`QuestionBase`は基本的な設問を含有した基底クラスです。


<code-example path="dynamic-form/src/app/question-base.ts" title="src/app/question-base.ts">

</code-example>



この基底クラスから`TextboxQuestion`と`DropdownQuestion`という、2つの新しいクラスを派生させることができます。
これは、テキストボックスとドロップダウンの設問を表します。
考え方としては、フォームが特定の設問タイプにバインドされ、適切なコントロールを動的にレンダリングすることです。

`TextboxQuestion`は、`type`プロパティを介してtext、email、urlといった複数のHTML5タイプをサポートしています。


<code-example path="dynamic-form/src/app/question-textbox.ts" title="src/app/question-textbox.ts" linenums="false">

</code-example>



`DropdownQuestion`は、セレクトボックスに選択肢のリストを表示します。


<code-example path="dynamic-form/src/app/question-dropdown.ts" title="src/app/question-dropdown.ts" linenums="false">

</code-example>



次に`QuestionControlService`です。
これは設問を`FormGroup`に変換するためのシンプルなサービスで、
一言でいえば、フォームグループは設問モデルのメタデータを用いて、デフォルト値とバリデーションルールをセットすることができます。


<code-example path="dynamic-form/src/app/question-control.service.ts" title="src/app/question-control.service.ts" linenums="false">

</code-example>

{@a form-component}

## 設問フォームコンポーネント
完成したモデルを定義できたので、
ダイナミックフォームを描画するコンポーネントを作成する準備が整いました。


`DynamicFormComponent`はエントリーポイントで、フォームのメインコンテナです。

<code-tabs>

  <code-pane title="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html">

  </code-pane>

  <code-pane title="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts">

  </code-pane>

</code-tabs>



これは設問のリストを提示し、それぞれ`<app-question>`コンポーネント要素に束縛されています。
`<app-question>` タグは、データバインドされた設問オブジェクトの値に基づいて _個々の_ 設問の詳細を表現するコンポーネントである、
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

`DynamicFormComponent`は、`@Input() questions`で宣言されている配列のかたちで、設問のリストがバインディングされることを期待しています。

 求人申請のために定義した一連の設問は、`QuestionService`から返されます。
 実際のアプリでは、これらの設問をストレージから取得します。

 キーポイントは、あなたが`QuestionService`から返されたオブジェクトを通して
 ヒーローを雇用するためのアプリケーションの設問を完全に制御することです。
 アンケートのメンテナンスは、`questions`配列の
 オブジェクトを追加、更新、削除するというシンプルな作業で済みます。


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
キーは、特定の設問についてハードコーディングされた前提を作らずに
フォームをレンダリングするために使用されるメタデータの動的データバインディングです。
コントロールのメタデータに加えて、動的なバリデーションを追加します。

*保存* ボタンは、フォームがバリデーションがパスされた状態になるまで無効となります。
フォームのバリデーションをパスした場合、*保存* をクリックすることで、アプリケーションは現在のフォームの値をJSONとしてレンダリングします。
これは、任意のユーザー入力がデータモデルにバインドされていることを証明します。
データの保存と取り込み処理については、別の機会に学習しましょう。


最終的にフォームは次のようになります:

<figure>
  <img src="generated/images/guide/dynamic-form/dynamic-form.png" alt="Dynamic-Form">
</figure>



[トップに戻る](guide/dynamic-form#top)
