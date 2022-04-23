# 選択リストを表示する

このページでは「Tour of Heroes」アプリケーションを拡張してヒーローのリストを表示し、ユーザーがヒーローを選択してヒーローの詳細を表示できるようにします。

<div class="alert is-helpful">

  For the sample app that this page describes, see the <live-example></live-example>.

</div>

## ヒーローのモックを作成する

まずは、表示するためのいくつかのヒーローが必要でしょう。

最終的には、リモートのデータサーバーからそれらのヒーローを取得します。
ひとまず、サーバーからデータが返ってきたと仮定して _ヒーローのモック_ を作成しましょう。

`mock-heroes.ts` と呼ばれるファイルを `src/app/` フォルダに作成してください。
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

* `<h2>` を先頭に追加してください
* その下にHTMLの順不同リスト (`<ul>`) を追加してください
* `<li>` を `hero` プロパティを表示する `<ul>` の内側に挿入してください
* スタイルを設定するためにいくつかのCSSのクラスを振ります（CSSのスタイルは間もなく追加します）

このようになります：

<code-example header="heroes.component.html (heroes template)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="list"></code-example>

これは一人のヒーローを示しています。それらをすべてリストするには、ヒーローのリストを反復処理するために、 `*ngFor*` を `<li>` に追加します。

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="li">
</code-example>

プロパティ 'hero' が存在しないため、エラーが表示されます。個々のヒーローにアクセスしてすべてのヒーローをリストアップするには、`<li>` に `*ngFor` を追加してヒーローのリストを繰り返し表示します。

この例の構文は次のとおりです。

| Syntax   | Details |
|:---      |:---     |
|`<li>`  | ホスト要素です |
|`heroes`  |  モックのヒーローリストを保持する`HeroesComponent` クラスのリストです |
|`hero`  | 各ループ毎のリストに、現在のヒーローオブジェクトを保持します |

<div class="alert is-important">

`ngFor` の前のアスタリスク(*)を忘れないでください。これは構文において重要な部分です。

</div>

ブラウザを更新すると、ヒーローのリストが表示されます。

<a id="styles"></a>

### ヒーローを装飾する

ユーザーがカーソルを置いてリストからヒーローを選択するとき、ヒーローのリストは魅力的で視覚的に目立たせる必要があります。

[最初のチュートリアル](tutorial/toh-pt0#app-wide-styles) では、アプリケーション全体の基本的なスタイルを `styles.css` に設定しました。
このスタイルシートにはヒーローのリストのためのスタイルは含めていませんでした。

`styles.css` にさらにスタイルを追加し、コンポーネントを追加するときにそのスタイルシートを拡大し続けることができます

あなたは特定のコンポーネントのためにプライベートなスタイルを定義し、コンポーネントが必要とするすべて &mdash; コードや、HTML、CSS&mdash; を1箇所にまとめて管理することを好むかもしれません。

このアプローチは他の場所でコンポーネントを再利用することを容易にし、グローバルに適用されたスタイルが異なる場合であってもコンポーネントが意図した外観を提供します。

プライベートなスタイルは `@Component.styles` 配列内にインラインで定義するか、スタイルシートファイルとして特定の `@Component.styleUrls` 配列の中で識別されるスタイルシートファイルとして定義します。

CLIが `HeroesComponent` を生成するとき、 `HeroesComponent` のために空の `heroes.component.css` が作成され
`@Component.styleUrls` はこのように指し示されます。

<code-example header="src/app/heroes/heroes.component.ts (@Component)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="metadata"></code-example>

`heroes.component.css` を開いて、 `HeroesComponent` のためのプライベートなスタイルを貼り付けます。
これらは、このガイドの末尾にある [最終的なコードレビュー](#final-code-review) から見つけることができます。

<div class="alert is-important">

`@Component` のメタデータで識別されたスタイルとスタイルシートは、特定のコンポーネントにスコープされます。
`heroes.component.css` のスタイルは `HeroesComponent` にのみ適用され、他のHTMLや他のどのコンポーネント内のHTMLにも影響しません。

</div>

## 詳細の表示

あなたがリストの中のヒーローをクリックしたとき、コンポーネントは選択されたヒーローの詳細をページの下部に表示させる必要があります。

この章では、ヒーローのアイテムがクリックされるのを待ち、クリックされたらヒーローの詳細を更新してみましょう。

### クリックイベントのバインディングを追加する

次のように `<li>` にクリックイベントをバインドした `<button>` を追加します。

<code-example header="heroes.component.html (template excerpt)" path="toh-pt2/src/app/heroes/heroes.component.1.html" region="selectedHero-click"></code-example>

これはAngularの [イベントバインディング](guide/event-binding) シンタックスにおける1つの例です。

`click` を囲っている括弧はAngularに `<li>` 要素の `click` イベントであることを伝えます。
ユーザーが `<li>` をクリックすると、Angularは `onSelect(hero)` 式を実行します。

<div class="callout is-helpful">

<header>Clickable elements</header>

**NOTE**: <br />
We added the click event binding on a new `<button>` element.
While we could have added the event binding on the `<li>` element directly, it is better for accessibility purposes to use the native `<button>` element to handle clicks.

For more details on accessibility, see [Accessibility in Angular](guide/accessibility).

</div>

次のセクションでは、 `HeroesComponent`で`onSelect()`メソッドを定義して、`*ngFor`式で定義されたヒーローを表示します。


### クリックイベントのハンドラーを追加する

コンポーネントの `hero` プロパティを `selectedHero` にリネームしますが、まだ割り当てません。
アプリケーション起動時に _選択されたヒーロー_ はありません。

次のようにして `onSelect()` メソッドを追加し、クリックされたヒーローをテンプレートからコンポーネントの `selectedHero` に割り当ててください。

<code-example header="src/app/heroes/heroes.component.ts (onSelect)" path="toh-pt2/src/app/heroes/heroes.component.ts" region="on-select"></code-example>

### 詳細セクションを追加する

現在、コンポーネントテンプレートにはリストがあります。
リストのヒーローをクリックして、そのヒーローの詳細を表示するには、それをテンプレートでレンダリングするための詳細セクションが必要です。
`heroes.component.html`のリストセクションの下に以下を追加します。

<code-example header="heroes.component.html (selected hero details)" path="toh-pt2/src/app/heroes/heroes.component.html" region="selectedHero-details"></code-example>

ブラウザを更新すると、アプリケーションは壊れてしまっています。

ブラウザの開発者ツールを開いて、コンソールの中のこのようなエラーメッセージを探してください：

<code-example format="output" hideCopy language="shell">

HeroesComponent.html:3 ERROR TypeError: Cannot read property 'name' of undefined

</code-example>

### なにが起きたのか？

アプリケーションを起動した際、 `selectedHero` は _意図的に_ `undefined` です。

`selectedHero` のプロパティを参照するテンプレート内での式のバインディングは &mdash; `{{selectedHero.name}}` のような式 &mdash; 選択されたヒーローが存在しないため _失敗_ しなければなりません。

### 修正しましょう - _*ngIf_ を使って空のdetailsを非表示にする

コンポーネントは `selectedHero` が存在する場合のみ、選択されたヒーローの詳細を表示する必要があります。

ヒーローの詳細をHTMLの `<div>` で囲ってください。
Angularの `*ngIf` ディレクティブを `<div>` に追加し、 `selectedHero` に設定してください。


<div class="alert is-important">

`ngIf` の前のアスタリスク(*)を忘れないでください。これは構文において重要な部分です。

</div>

<code-example header="src/app/heroes/heroes.component.html (*ngIf)" path="toh-pt2/src/app/heroes/heroes.component.html" region="ng-if"></code-example>

ブラウザを更新すると、名前の一覧が再度表示されます。
詳細のエリアは空白になっています。
ヒーローのリストの中からヒーローをクリックし、詳細を表示しましょう。
アプリケーションは再び動き出しました。
ヒーローたちはリストの中に表示され、クリックされたヒーローの詳細はページの下部に表示されます。

### なぜこれが動くのか

`selectedHero` が定義されていないとき、 `ngIf` はDOMからヒーローの詳細を削除します。心配する `selectedHero` へのバインディングは存在しません。

ユーザーがヒーローを選択すると `selectedHero` は値を持ち `ngIf` はヒーローの詳細をDOMの中に挿入します。

### 選択されたヒーローを装飾する

選択されたヒーローを識別しやすくするために、[先に追加したスタイル](#styles)の中の`.selected`というCSSクラスを使用することができます。
ユーザーがクリックしたときに `.selected` クラスを `<li>` に適用するには、クラスバインディングを使用します。

<div class="lightbox">

<img alt="Selected hero with dark background and light text that differentiates it from unselected list items" src="generated/images/guide/toh/heroes-list-selected.png">

</div>

Angularの [クラスバインディング](guide/attribute-binding#class-binding) は条件に応じたCSSクラスの追加と削除ができます。
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
*   CSSスタイルのclassを `クラス` バインディングで切り替えることができます
    <code-example format="typescript" language="typescript">

    header="src/app/heroes/heroes.component.html (HeroesComponent's template)"

    </code-example>

@reviewed 2022-02-28
