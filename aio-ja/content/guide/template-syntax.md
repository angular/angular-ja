# テンプレート構文

Angular では*テンプレート*は HTML のかたまりです。
テンプレート内で特別な構文を用いて Angular の機能の多くを活用できます。

## 前提

テンプレート構文を学ぶ前に、次のことを熟知してください。

- [Angular の概念](guide/architecture)
- JavaScript
- HTML
- CSS

<!--todo: Do we still need the following section? It seems more relevant to those coming from AngularJS, which is now 7 versions ago. -->
<!-- You may be familiar with the component/template duality from your experience with model-view-controller (MVC) or model-view-viewmodel (MVVM).
In Angular, the component plays the part of the controller/viewmodel, and the template represents the view. -->

あなたのアプリケーションにおいて Angular の各テンプレートは HTML のセクションであり、ブラウザが表示するページの一部分として含めることができます。
Angular の HTML テンプレートはブラウザでちょうど通常の HTML のように、ただしより多くの機能をもって、ビューやユーザーインターフェースを描画します。

Angular の CLI で Angular アプリケーションを生成するとき、`app.component.html`ファイルはプレースホルダの HTML を含んでいるデフォルトのテンプレートです。

このテンプレート構文のガイドは、クラスとテンプレートの間でデータを連携してどのように UX/UI を制御できるかを示します。

<div class="is-helpful alert">

テンプレート構文のガイドのほとんどには、各ガイドの独自のトピックを実演する専用の動くサンプルアプリケーションがあります。
それらのすべてを 1 つのアプリケーションで一緒に見るには、包括した<live-example title="Template Syntax Live Code"></live-example>をご覧ください。

</div>

## HTML を強化

あなたのテンプレートにおいて特別な Angular 構文を用いて、アプリケーションの HTML 表現を拡張できます。
たとえば、Angular はビルトインのテンプレート関数や変数、イベントリスニング、データバインディングのような機能をもって、DOM(ドキュメントオブジェクトモデル)の値を動的に取得・設定するのを手助けします。

ほとんどの HTML 構文は有効なテンプレート構文です。
しかしながら、Angular のテンプレートはひとつのウェブページ全体の一部分であってページまるごとではないため、`<html>`や`<body>`、`<base>`のような要素を含める必要はなく、あなたは開発しているページの一部分に限定してフォーカスできます。

<div class="alert is-important">

スクリプト注入攻撃のリスクを取り除くため、Angular はテンプレートにおいて`<script>`要素をサポートしていません。
Angular は`<script>`タグを無視して、ブラウザコンソールへ警告を出力します。
詳細は、[セキュリティ](guide/security)ページをご覧ください。

</div>

## テンプレート構文の詳細

あなたは次のことに興味があるかもしれません:

| Topics                                                            | Details                                                                          |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [補間](guide/interpolation)                                       | 補間と式を HTML でどう使うかを学びます。                                         |
| [テンプレート文](guide/template-statements)                       | テンプレートでイベントに応答します。                                             |
| [バインディング構文](guide/binding-syntax)                        | アプリケーションで値を連携するためにバインディングを使います。                   |
| [プロパティバインディング](guide/property-binding)                | 対象となる要素や`@Input()`デコレーターのディレクティブのプロパティを設定します。 |
| [属性、クラス、スタイルのバインディング](guide/attribute-binding) | 属性、クラス、スタイルの値を設定します。                                         |
| [イベントバインディング](guide/event-binding)                     | イベントやあなたの HTML をリッスンします。                                       |
| [双方向バインディング](guide/two-way-binding)                     | クラスとそのテンプレート間でデータを共有します。                                 |
| [組み込みディレクティブ](guide/built-in-directives)               | HTML の動作とレイアウトをリッスンして変更します。                                |
| [テンプレート参照変数](guide/template-reference-variables)        | テンプレート内で DOM 要素を参照するために特別な変数を使います。                  |
| [Input と Output](guide/inputs-outputs)                           | 親のコンテキストと子のディレクティブやコンポーネントとの間でデータを共有します。 |
| [テンプレート式演算子](guide/template-expression-operators)       | パイプ演算子`                                                                    | `について学び、あなたの HTML における`null`や`undefined`値に対して防御します。 |
| [テンプレート内 SVG](guide/svg-in-templates)                      | インタラクティブな画像を動的に生成します。                                       |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
