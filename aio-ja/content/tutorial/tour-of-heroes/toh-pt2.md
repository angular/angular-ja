# 選択リストを表示する

このチュートリアルでは、次の方法を説明します。

* ヒーローのリストを表示するために Tour of Heroes アプリケーションを拡張する
* ユーザーがヒーローを選択し、ヒーローの詳細を表示できるようにする

<div class="alert is-helpful">

  For the sample app that this page describes, see the <live-example></live-example>.

</div>

## ヒーローのモックを作成する

まずは、表示するためのいくつかのヒーローを作成します。

`mock-heroes.ts` と呼ばれるファイルを `src/app/` ディレクトリに作成してください。
`HEROES` 定数を10人のヒーローの配列として定義し、エクスポートしてください。
ファイルは次のようになるでしょう。

<code-example header="src/app/mock-heroes.ts" path="toh-pt2/src/app/mock-heroes.ts"></code-example>

## ヒーローを表示する

`HeroesComponent` クラスのファイルを開いて `HEROES` モックをインポートしてください。

<code-example header="src/app/heroes/heroes.component.ts (import HEROES)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="import-heroes"></code-example>

同じファイル（`HeroesComponent`クラス）で、`heroes`という名前のコンポーネントプロパティを定義して、バインディングのために `HEROES` 配列を公開してください。

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts" region="component"></code-example>

### `*ngFor` でヒーローを一覧表示する

`HeroesComponent` テンプレートを開き、次のように変更してください：

1.  `<h2>` を先頭に追加する
2.  `<h2>`の下に、`<ul>` 要素を追加する
3.  `<ul>` 要素の中に、`<li>` を挿入する
4.  `<span>`要素内の`hero`のプロパティを表示する`<li>`内に`<button>`を配置する
5.  コンポーネントのスタイルを設定するためのCSSクラスを追加する

このようになります：

<code-example header="heroes.component.html (heroes template)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="list"></code-example>

これは一人のヒーローを示しています。それらをすべてリストするには、ヒーローのリストを反復処理するために、 `*ngFor*` を `<li>` に追加します。

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="li">
</code-example>

[`*ngFor`](guide/built-in-directives#ngFor) はAngularの *反復* ディレクティブです。
これは、リスト内の各要素に対してホスト要素を繰り返します。

この例の構文は次のとおりです。

| Syntax   | Details |
|:---      |:---     |
|`<li>`  | ホスト要素です |
|`heroes`  |  モックのヒーローリストを保持する`HeroesComponent` クラスのリストです |
|`hero`  | 各ループ毎のリストに、現在のヒーローオブジェクトを保持します |

<div class="alert is-important">

`ngFor` の前のアスタリスク(*)を忘れないでください。
これは構文において重要な部分です。

</div>

ブラウザを更新すると、ヒーローのリストが表示されます。

<div class="callout is-helpful">

<header>Interactive elements</header>

Inside the `<li>` element, add a `<button>` element to wrap the hero's details, and then make the hero clickable. To improve accessibility, use HTML elements that are inherently interactive instead of adding an event listeners to a non-interactive elements. In this case, the interactive  `<button>` element is instead of adding an event to the `<li>` element.

For more details on accessibility, see [Accessibility in Angular](guide/accessibility).

</div>

<a id="styles"></a>

### ヒーローを装飾する

ユーザーがカーソルを置いてリストからヒーローを選択するとき、
ヒーローのリストは魅力的で視覚的に目立たせる必要があります。

[最初のチュートリアル](tutorial/tour-of-heroes/toh-pt0#app-wide-styles) では、アプリケーション全体の基本的なスタイルを `styles.css` に設定しました。
このスタイルシートにはヒーローのリストのためのスタイルは含めていませんでした。

`styles.css` にさらにスタイルを追加し、コンポーネントを追加するときにそのスタイルシートを拡大し続けることができます

あなたは特定のコンポーネントのためにプライベートなスタイルを定義し、コンポーネントが必要とするすべて &mdash; コードや、HTML、CSS&mdash; を1箇所にまとめて管理することを好むかもしれません。

このアプローチは他の場所でコンポーネントを再利用することを容易にし、グローバルに適用されたスタイルが異なる場合であってもコンポーネントが意図した外観を提供します。

プライベートなスタイルは `@Component.styles` 配列内にインラインで定義するか、スタイルシートファイルとして特定の `@Component.styleUrls` 配列の中で識別されるスタイルシートファイルとして定義します。

`ng generate` が `HeroesComponent` を生成するとき、 `HeroesComponent` のために空の `heroes.component.css` が作成され、`@Component.styleUrls` はこのように指し示されます。

<code-example header="src/app/heroes/heroes.component.ts (@Component)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="metadata"></code-example>

`heroes.component.css` を開いて、 `HeroesComponent` のためのプライベートなスタイルを貼り付けます。これらは、このガイドの末尾にある [最終的なコードレビュー](#final-code-review) から見つけることができます。

<div class="alert is-important">

`@Component` のメタデータで識別されたスタイルとスタイルシートは、特定のコンポーネントにスコープされます。
`heroes.component.css` のスタイルは `HeroesComponent` にのみ適用され、他のHTMLや他のどのコンポーネント内のHTMLにも影響しません。

</div>

## 詳細の表示

あなたがリストの中のヒーローをクリックしたとき、コンポーネントは選択されたヒーローの詳細をページの下部に表示させる必要があります。

この章では、ヒーローのアイテムがクリックされるのを待ち、クリックされたらヒーローの詳細を更新してみましょう。

### クリックイベントのバインディングを追加する

Add a click event binding to the `<button>` in the `<li>` like this:

<code-example header="heroes.component.html (template excerpt)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="selectedHero-click"></code-example>

これはAngularの [イベントバインディング](guide/event-binding) シンタックスにおける1つの例です。

`click` を囲っている括弧はAngularに `<li>` 要素の `click` イベントであることを伝えます。
ユーザーが `<li>` をクリックすると、Angularは `onSelect(hero)` 式を実行します。

次のセクションでは、 `HeroesComponent`で`onSelect()`メソッドを定義して、`*ngFor`式で定義されたヒーローを表示します。

### クリックイベントのハンドラーを追加する

Rename the component's `hero` property to `selectedHero` but don't assign any value to it since there is no *selected hero* when the application starts.

次のようにして `onSelect()` メソッドを追加し、クリックされたヒーローをテンプレートからコンポーネントの `selectedHero` に割り当ててください。

<code-example header="src/app/heroes/heroes.component.ts (onSelect)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="on-select"></code-example>

### 詳細セクションを追加する

現在、コンポーネントテンプレートにはリストがあります。
リストのヒーローをクリックして、そのヒーローの詳細を表示するには、
それをテンプレートでレンダリングするための詳細セクションが必要です。
`heroes.component.html`のリストセクションの下に以下を追加します。

<code-example header="heroes.component.html (selected hero details)" path="toh-pt2/src/app/heroes/heroes.component.html" region="selectedHero-details"></code-example>

The hero details should only be displayed when a hero is selected. When a component is created initially, there is no selected hero, so we add the `*ngIf` directive to the `<div>` that wraps the hero details, to instruct Angular to render the section only when the `selectedHero` is actually defined (after it has been selected by clicking on a hero).

<div class="alert is-important">

`ngIf` の前のアスタリスク(*)を忘れないでください。これは構文において重要な部分です。

</div>

### 選択されたヒーローを装飾する

選択されたヒーローを識別しやすくするために、[先に追加したスタイル](#styles)の中の`.selected`というCSSクラスを使用することができます。
ユーザーがクリックしたときに `.selected` クラスを `<li>` に適用するには、クラスバインディングを使用します。

<div class="lightbox">

<img alt="Selected hero with dark background and light text that differentiates it from unselected list items" src="generated/images/guide/toh/heroes-list-selected.png">

</div>

Angularの [クラスバインディング](guide/class-binding) は条件に応じたCSSクラスの追加と削除ができます。
装飾したい要素に `[class.some-css-class]="some-condition"` を追加するだけです。

Add the following `[class.selected]` binding to the `<button>` in the `HeroesComponent` template:

<code-example header="heroes.component.html (toggle the 'selected' CSS class)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="class-selected"></code-example>

現在の行のヒーローが `selectedHero` と同じ場合、Angularは `selected` のCSSクラスを追加します。2つのヒーローが異なる場合には、Angularはそのクラスを削除します。

完成した `<li>` はこのようになります：

<code-example header="heroes.component.html (list item hero)" path="toh-pt2/src/app/heroes/heroes.component.html" region="li"></code-example>

<a id="final-code-review"></a>

## 最終的なコードレビュー

こちらが `HeroesComponent` のスタイルを含んだ、このページで解説したコードファイルです。

<code-tabs>
    <code-pane header="src/app/mock-heroes.ts" path="toh-pt2/src/app/mock-heroes.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt2/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.css" path="toh-pt2/src/app/heroes/heroes.component.css"></code-pane>
</code-tabs>

## まとめ

*   「Tour of Heroes」アプリケーションはヒーローのリストと詳細ビューを表示します
*   ユーザーはヒーローを選択し、そのヒーローの詳細を見ることができます
*   リストを表示するために `*ngFor` を使いました
*   HTMLのブロックを条件付きで含める、または除外するために `*ngIf` を使いました
*   CSSスタイルのクラスを `class` バインディングで切り替えることができます

@reviewed 2022-05-23
