<docs-decorative-header title="テンプレート構文" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Angularの *テンプレート* はHTMLの断片です。
テンプレート内で特別な構文を使用すると、Angularの多くの機能を活用できます。
</docs-decorative-header>

Tip: この包括的なガイドに進む前に、Angularの[基本概念](essentials/rendering-dynamic-templates) を確認してください。

<!--todo: 以下のセクションは、まだ必要ですか？これは、AngularJS から来た人にとってはより関連性があるように思えます。AngularJS は、今では 7 バージョンも前のものです。 -->
<!-- コンポーネント/テンプレートのデュアルリティは、モデル-ビュー-コントローラー (MVC) またはモデル-ビュー-ビューモデル (MVVM) の経験からご存知かもしれません。
Angular では、コンポーネントはコントローラー/ビューモデルの役割を果たし、テンプレートはビューを表します。 -->

アプリケーション内の各Angularテンプレートは、ブラウザに表示されるページの一部として含めるHTMLセクションです。
Angular HTMLテンプレートは通常のHTMLと同様に、ブラウザでビュー、つまりユーザーインターフェースをレンダリングしますが、はるかに多くの機能を備えています。

Angular CLIを使用してAngularアプリケーションを生成すると、`app.component.html` ファイルは、プレースホルダーのHTMLを含むデフォルトのテンプレートになります。

テンプレート構文ガイドでは、クラスとテンプレート間のデータを調整することで、UX/UIを制御する方法を示します。

## HTMLを強化する

テンプレート内で特別なAngular構文を使用して、アプリケーションのHTMLボキャブラリを拡張します。
たとえば、Angularは、組み込みのテンプレート関数、変数、イベントリスニング、データバインディングなどの機能を使用して、DOM (Document Object Model) の値を動的に取得および設定するのに役立ちます。

ほぼすべてのHTML構文は有効なテンプレート構文です。
ただし、Angularテンプレートは、全体的なWebページの一部であり、ページ全体ではないため、`<html>`、`<body>`、または `<base>` などの要素を含める必要はありません。開発中のページの特定の部分に集中できます。

IMPORTANT: スクリプトインジェクション攻撃のリスクを排除するために、Angularはテンプレートでの `<script>` 要素をサポートしていません。
Angularは `<script>` タグを無視し、ブラウザコンソールに警告を出力します。
詳細については、[セキュリティ](best-practices/security) ページを参照してください。

## テンプレート構文についてさらに詳しく

次の項目にも興味があるかもしれません。

| トピック                                                                    | 詳細                                                                       |
| :------------------------------------------------------------------------ | :---------------------------------------------------------------------------- |
| [補間](guide/templates/interpolation)                            | HTML で補間と式を使用する方法を学ぶ。                       |
| [テンプレートステートメント](guide/templates/template-statements)                | テンプレートでイベントに応答する。                                          |
| [バインディング構文](guide/templates/binding)                                 | バインディングを使用してアプリケーション内の値を調整する。                         |
| [プロパティバインディング](guide/templates/property-binding)                      | ターゲット要素のプロパティまたはディレクティブ `@Input()` デコレーターを設定する。         |
| [属性、クラス、スタイルバインディング](guide/templates/attribute-binding) | 属性、クラス、スタイルの値を設定する。                             |
| [イベントバインディング](guide/templates/event-binding)                            | HTML でイベントをリスンする。                                              |
| [双方向バインディング](guide/templates/two-way-binding)                        | クラスとそのテンプレート間でデータを共有する。                                  |
| [制御フロー](guide/templates/control-flow)                              | 要素を条件付きで表示、非表示、繰り返しするための Angular の構文。   |
| [ローカルテンプレート変数](guide/templates/let-template-variables)        | テンプレート内で変数を定義して再利用する。                                  |
| [組み込みディレクティブ](guide/directives)                                   | HTML の動作とレイアウトをリスンして変更する。                         |
| [テンプレート参照変数](guide/templates/reference-variables)       | 特殊な変数を使用して、テンプレート内の DOM 要素を参照する。           |
| [入力](guide/components/inputs)                                         | 入力プロパティを使用してデータを受け入れる。                                          |
| [出力](guide/components/outputs)                                       | 出力を使用してカスタムイベントを発生させる。                                                    |
| [テンプレート内のSVG](guide/templates/svg-in-templates)                      | 動的にインタラクティブなグラフィックを生成する。                                    |
