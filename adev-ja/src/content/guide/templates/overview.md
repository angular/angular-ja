<docs-decorative-header title="テンプレート構文" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Angularにおけるテンプレートとは、HTMLの断片です。
テンプレート内で特別な構文を使用することで、Angularの多くの機能を活用できます。
</docs-decorative-header>

Tip: この包括的なガイドに進む前に、Angularの[基本概念](essentials/rendering-dynamic-templates)をご覧ください。

すべてのAngularコンポーネントには、コンポーネントがページにレンダリングする[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)を定義する**テンプレート**があります。テンプレートを使用することで、Angularはデータが変化してもページを自動的に最新の状態に保つことができます。

テンプレートは通常、`*.component.ts`ファイルの`template`プロパティまたは`*.component.html`ファイル内にあります。詳細については、[コンポーネントに関する詳細なガイド](/guide/components)をご覧ください。

## テンプレートはどのように動作しますか？

テンプレートは、[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)構文に基づいており、組み込みのテンプレート関数、データバインディング、イベントリスニング、変数など、追加の機能が備わっています。

AngularはテンプレートをJavaScriptにコンパイルして、アプリケーションの内部的な理解を構築します。これにより、Angularがアプリケーションに自動的に適用する組み込みのレンダリング最適化が実現されます。

### 標準HTMLとの違い

テンプレートと標準HTML構文の違いには、次のようなものがあります。

- テンプレートソースコード内のコメントは、レンダリングされた出力に含まれません。
- コンポーネントとディレクティブの要素は、自己クローズできます（例：`<UserProfile />`）。
- 特定の文字（`[]`、`()`など）を持つ属性は、Angularにとって特別な意味を持ちます。詳細については、[バインディングドキュメント](guide/templates/binding)と[イベントリスナーの追加に関するドキュメント](guide/templates/event-listeners)をご覧ください。
- `@`文字は、[制御フロー](guide/templates/control-flow)などのテンプレートに動的な動作を追加するためのAngularにとって特別な意味を持ちます。リテラルの`@`文字を含めるには、HTMLエンティティコード（`&commat;`または`&#64;`）としてエスケープします。
- Angularは不要な空白文字を無視して折り畳みます。詳細については、[テンプレート内の空白](guide/templates/whitespace)をご覧ください。
- Angularは、動的コンテンツのプレースホルダーとしてコメントノードをページに追加する場合がありますが、開発者はこれらを無視できます。

さらに、ほとんどのHTML構文は有効なテンプレート構文ですが、Angularはテンプレート内の`<script>`要素をサポートしていません。詳細については、[セキュリティ](best-practices/security)ページをご覧ください。

## 次に何をするか？

以下のトピックにも興味があるかもしれません。

| トピック                                                                      | 詳細                                                                                 |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [動的なテキスト、プロパティ、属性のバインディング](guide/templates/binding) | 動的なデータをテキスト、プロパティ、属性にバインドします。                                   |
| [イベントリスナーの追加](guide/templates/event-listeners)                   | テンプレート内でイベントに応答します。                                                    |
| [双方向バインディング](guide/templates/two-way-binding)                          | 値を同時にバインドし、変更を伝播します。                                     |
| [制御フロー](guide/templates/control-flow)                                | 要素の表示、非表示、繰り返しを条件付きで行います。                                           |
| [パイプ](guide/templates/pipes)                                              | データを宣言的に変換します。                                                           |
| [ng-contentによる子コンテンツのスロット化](guide/templates/ng-content)        | コンポーネントがコンテンツをレンダリングする方法を制御します。                                                  |
| [ng-templateによるテンプレートフラグメントの作成](guide/templates/ng-template)   | テンプレートフラグメントを宣言します。                                                            |
| [ng-containerによる要素のグループ化](guide/templates/ng-container)         | 複数の要素をグループ化するか、レンダリングする場所をマークします。                      |
| [テンプレート内の変数](guide/templates/variables)                         | 変数の宣言について学びます。                                                      |
| [@deferによる遅延ロード](guide/templates/defer)                       | `@defer`を使用して遅延可能なビューを作成します。                                                  |
| [式構文](guide/templates/expression-syntax)                      | Angular式と標準JavaScriptの違いについて学びます。 |
| [テンプレート内の空白](guide/templates/whitespace)                       | Angularが空白をどのように処理するかについて学びます。                                                   |
