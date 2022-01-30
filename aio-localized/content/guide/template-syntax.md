# テンプレート構文

Angularでは*テンプレート*はHTMLのかたまりです。
テンプレート内で特別な構文を用いてAngularの機能の多くを活用できます。


## 前提

テンプレート構文を学ぶ前に、次のことを熟知してください。

* [Angularの概念](guide/architecture)
* JavaScript
* HTML
* CSS


<!-- Do we still need the following section? It seems more relevant to those coming from AngularJS, which is now 7 versions ago. -->
<!-- You may be familiar with the component/template duality from your experience with model-view-controller (MVC) or model-view-viewmodel (MVVM).
In Angular, the component plays the part of the controller/viewmodel, and the template represents the view. -->

<hr />

あなたのアプリケーションにおいてAngularの各テンプレートはHTMLのセクションであり、ブラウザが表示するページの一部分として含めることができます。
AngularのHTMLテンプレートはブラウザでちょうど通常のHTMLのように、ただしより多くの機能をもって、ビューやユーザーインターフェースを描画します。

AngularのCLIでAngularアプリケーションを生成するとき、`app.component.html`ファイルはプレースホルダのHTMLを含んでいるデフォルトのテンプレートです。

このテンプレート構文のガイドは、クラスとテンプレートの間でデータを連携してどのようにUX/UIを制御できるかを示します。

<div class="is-helpful alert">

テンプレート構文のガイドのほとんどには、各ガイドの独自のトピックを実演する専用の動くサンプルアプリケーションがあります。
それらのすべてを1つのアプリケーションで一緒に見るには、包括した<live-example title="Template Syntax Live Code"></live-example>をご覧ください。

</div>


## HTMLを強化

あなたのテンプレートにおいて特別なAngular構文を用いて、アプリケーションのHTML表現を拡張できます。
たとえば、Angularはビルトインのテンプレート関数や変数、イベントリスニング、データバインディングのような機能をもって、DOM(ドキュメントオブジェクトモデル)の値を動的に取得・設定するのを手助けします。

ほとんどのHTML構文は有効なテンプレート構文です。
しかしながら、Angularのテンプレートはひとつのウェブページ全体の一部分であってページまるごとではないため、`<html>`や`<body>`、`<base>`のような要素を含める必要はなく、あなたは開発しているページの一部分に限定してフォーカスできます。


<div class="alert is-important">

スクリプト注入攻撃のリスクを取り除くため、Angularはテンプレートにおいて`<script>`要素をサポートしていません。
Angularは`<script>`タグを無視して、ブラウザコンソールへ警告を出力します。
詳細は、[セキュリティ](guide/security)ページをご覧ください。

</div>


## テンプレート構文の詳細

あなたは次のことに興味があるかもしれません:

* [補間](guide/interpolation): 補間と式をHTMLでどう使うかを学びます。
* [テンプレート文](guide/template-statements): テンプレートでイベントに応答します。
* [バインディング構文](guide/binding-syntax): アプリケーションで値を連携するためにバインディングを使います。
* [プロパティバインディング](guide/property-binding): 対象となる要素や`@Input()`デコレーターのディレクティブのプロパティを設定します。
* [属性、クラス、スタイルのバインディング](guide/attribute-binding): 属性、クラス、スタイルの値を設定します。
* [イベントバインディング](guide/event-binding): イベントやあなたのHTMLをリッスンします。
* [双方向バインディング](guide/two-way-binding): クラスとそのテンプレート間でデータを共有します。
* [組み込みディレクティブ](guide/built-in-directives): HTMLの動作とレイアウトをリッスンして変更します。
* [テンプレート参照変数](guide/template-reference-variables): テンプレート内でDOM要素を参照するために特別な変数を使います。
* [InputとOutput](guide/inputs-outputs): 親のコンテキストと子のディレクティブやコンポーネントとの間でデータを共有します。
* [テンプレート式演算子](guide/template-expression-operators): パイプ演算子`|`について学び、あなたのHTMLにおける`null`や`undefined`値に対して防御します。
* [テンプレート内SVG](guide/svg-in-templates): インタラクティブな画像を動的に生成します。
