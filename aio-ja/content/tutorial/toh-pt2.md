# ヒーローのリストを表示する

このページでは「Tour of Heroes」アプリを拡張してヒーローのリストを表示し、ユーザーがヒーローを選択してヒーローの詳細を表示できるようにします。


## ヒーローのモックを作成する

まずは、表示するためのいくつかのヒーローが必要でしょう。

最終的には、リモートのデータサーバーからそれらのヒーローを取得します。
ひとまず、サーバーからデータが返ってきたと仮定して _ヒーローのモック_ を作成しましょう。

`mock-heroes.ts` と呼ばれるファイルを `src/app/` フォルダに作成してください。
`HEROES` 定数を10人のヒーローの配列として定義し、エクスポートしてください。
ファイルは次のようになるでしょう。

<code-example path="toh-pt2/src/app/mock-heroes.ts" linenums="false"
title="src/app/mock-heroes.ts">
</code-example>

## ヒーローを表示する

あなたは `HeroesComponent` の1番上にヒーローのリストを表示しようとしています。

`HeroesComponent` クラスのファイルを開いて `HEROES` モックをインポートしてください。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="import-heroes" title="src/app/heroes/heroes.component.ts (import HEROES)">
</code-example>

これらのヒーローをバインディングするために、ヒーローを公開するクラスに `heroes` プロパティを追加してください。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="heroes">
</code-example>

### _*ngFor_ でヒーローを一覧表示する

`HeroesComponent` テンプレートを開き、次のように変更してください：

* `<h2>` を先頭に追加してください
* その下にHTMLの順不同リスト (`<ul>`) を追加してください
* `<li>` を `hero` プロパティを表示する `<ul>` の内側に挿入してください
* スタイルを設定するためにいくつかのCSSのクラスを振ります（CSSのスタイルは簡潔に記述してください）

このようになります：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="list" title="heroes.component.html (heroes template)" linenums="false">
</code-example>

これから `<li>` をこのように変更していきます：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="li">
</code-example>

[`*ngFor`](guide/template-syntax#ngFor) はAngularの _繰り返し_ ディレクティブです。
これは、リスト内の各要素のホスト要素を繰り返します。

この例では

* `<li>` はホスト要素です
* `heroes` は `HeroesComponent` クラスのリストです
* `hero` は各ループ毎のリストに、現在のヒーローオブジェクトを保持します

<div class="alert is-important">

`ngFor` の前のアスタリスク(*)を忘れないでください。これは構文において重要な部分です。

</div>

ブラウザを更新すると、ヒーローのリストが表示されます。

{@a styles}

### ヒーローを装飾する

ユーザーがカーソルを置いてリストからヒーローを選択するとき、ヒーローのリストは魅力的で視覚的に目立たせる必要があります。

[最初のチュートリアル](tutorial/toh-pt0#app-wide-styles) では、アプリケーション全体の基本的なスタイルを `styles.css` に設定しました。
このスタイルシートにはヒーローのリストのためのスタイルは含めていませんでいた。

`styles.css` にさらにスタイルを追加し、コンポーネントを追加するようにスタイルシートを増やし続けることができます。

あなたは特定のコンポーネントのためにプライベートなスタイルを定義し、コンポーネントが必要とするすべて &mdash; コードや、HTML、CSS&mdash; を1箇所にまとめて管理することを好むかもしれません。

このアプローチは他の場所でコンポーネントを再利用することを容易にし、グローバルに適用されたスタイルが異なる場合であってもコンポーネントが意図した外観を提供します。

プライベートなスタイルは `@Component.styles` 内にインラインで定義するか、スタイルシートファイルとして特定の `@Component.styleUrls` 配列の中で識別されるスタイルシートファイルとして定義します。

CLIが `HeroesComponent` を生成するとき、 `HeroesComponent` のために空の `heroes.component.css` が作成され
`@Component.styleUrls` はこのように指し示されます。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="metadata"
 title="src/app/heroes/heroes.component.ts (@Component)">
</code-example>

`heroes.component.css` を開いて、 `HeroesComponent` のためのプライベートなスタイルを貼り付けます。
これらは、このガイドの末尾にある [最終的なコードレビュー](#final-code-review) から見つけることができます。

<div class="alert is-important">

`@Component` のメタデータで識別されたスタイルとスタイルシートは、特定のコンポーネントにスコープされます。
`heroes.component.css` のスタイルは `HeroesComponent` にのみ適用され、他のHTMLや他のどのコンポーネント内のHTMLにも影響しません。

</div>

## Master/Detail

あなたが **master** リストの中のヒーローをクリックしたとき、コンポーネントは選択されたヒーローの **詳細** をページの下部に表示させる必要があります。

この章では、ヒーローのアイテムがクリックされるのを待ち、クリックされたらヒーローの詳細を更新してみましょう。

### クリックイベントのバインディングを追加する

クリックイベントのバインディングを `<li>` にこのように追加してください：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="selectedHero-click" title="heroes.component.html (template excerpt)" linenums="false">
</code-example>

これはAngularの [イベントバインディング](guide/template-syntax#event-binding) シンタックスにおける1つの例です。

`click` を囲っている括弧はAngularに `<li>` 要素の `click` イベントであることを伝えます。
ユーザーが `<li>` をクリックすると、Angularは `onSelect(hero)` 式を実行します。

`onSelect()` は、これから書こうとしている `HeroesComponent` のメソッドです。
Angularはこのメソッドをクリックされた `<li>` 内に表示された `hero` オブジェクトと共に呼び出します。すなわち、先ほどの `*ngFor` 式の中で定義された同じ `hero` です。

### クリックイベントのハンドラーを追加する

コンポーネントである `hero` プロパティを `selectedHero` にリネームしますが、まだ割り当てません。
これはアプリケーション起動時の _選択されたヒーロー_ ではありません。

次のようにして `onSelect()` メソッドを追加し、クリックされたヒーローをテンプレートからコンポーネントの `selectedHero` に割り当ててください。

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="on-select" title="src/app/heroes/heroes.component.ts (onSelect)" linenums="false">
</code-example>

### 詳細のテンプレートを更新する

テンプレートはもう存在していないコンポーネントの古い `hero` プロパティをまだ参照しています。
`hero` を `selectedHero` にリネームしてください。

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="selectedHero-details" title="heroes.component.html (selected hero details)" linenums="false">
</code-example>

### _*ngIf_ を使って空のdetailsを非表示にする

ブラウザを更新すると、アプリケーションは壊れてしまっています。

ブラウザの開発者ツールを開いて、コンソールの中のこのようなエラーメッセージを探してください：

<code-example language="sh" class="code-shell">
  HeroesComponent.html:3 ERROR TypeError: Cannot read property 'name' of undefined
</code-example>

リストのアイテムを1つクリックしてみましょう。
アプリは再び機能し始めたように見えるでしょう。
リストにヒーローが表示され、クリックされたヒーローがページの下部に表示されます。

### なにが起きたのか？

アプリを起動した際、 `selectedHero` は _意図的に_ `undefined` です。

`selectedHero` のプロパティを参照するテンプレート内での式のバインディングは &mdash; `{{selectedHero.name}}` のような式 &mdash; 選択されたヒーローが存在しないため _失敗_ しなければなりません。

### 修正しましょう

コンポーネントは `selectedHero` が存在する場合のみ、選択されたヒーローの詳細を表示する必要があります。

ヒーローの詳細をHTMLの `<div>` で囲ってください。
Angularの `*ngIf` ディレクティブを `<div>` に追加し、 `selectedHero` に設定してください。

<div class="alert is-important">

`ngIf` の前のアスタリスク(*)を忘れないでください。これは構文において重要な部分です。

</div>

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="ng-if" title="src/app/heroes/heroes.component.html (*ngIf)" linenums="false">
</code-example>

ブラウザを更新すると、名前の一覧が再度表示されます。
詳細のエリアは空白になっています。
ヒーローをクリックするとヒーローの詳細が表示されます。

### なぜこれが動くのか

`selectedHero` が定義されていないとき、 `ngIf` はDOMからヒーローの詳細を削除します。これらは心配する `selectedHero` へのバインディングは存在しません。

ユーザーがヒーローを選択すると `selectedHero` は値を持ち `ngIf` はヒーローの詳細をDOMの中に挿入します。

### 選択されたヒーローを装飾する

すべての `<li>` 要素が同じように見える場合 _選択されたヒーロー_ をリスト内で識別することは困難です。

もしユーザーが "Magneta" をクリックすると、そのヒーローはこのような目立った背景色で描画されるべきです：

<figure>

  <img src='generated/images/guide/toh/heroes-list-selected.png' alt="Selected hero">

</figure>

_選択されたヒーロー_ の着色は [あなたが先ほど追加したスタイル](#styles) の `.selected` CSSクラスの仕事です。
あなたはただ、ユーザーがクリックしたときに `.selected` クラスを `<li>` に適用するだけです。

Angularの [クラスバインディング](guide/template-syntax#class-binding) は条件がついたCSSクラスの追加と削除を容易にします。
ただ `[class.some-css-class]="some-condition"` をあなたが装飾させたい要素に追加するだけです。

`HeroesComponent` テンプレートの中の `<li>` に `[class.selected]` バインディングを追加してください：

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="class-selected" title="heroes.component.html (toggle the 'selected' CSS class)" linenums="false">
</code-example>

現在の行のヒーローが `selectedHero` と同じ場合、Angularは `selected` のCSSクラスを追加します。2つのヒーローが異なる場合には、Angularはクラスを削除します。

完成した `<li>` はこのようになります：

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="li" title="heroes.component.html (list item hero)" linenums="false">

</code-example>

{@a final-code-review}

## 最終的なコードレビュー

あなたのアプリはこのように見えるはずです。 <live-example></live-example>

こちらが `HeroesComponent` のスタイルを含んだ、このページで解説したコードファイルです。

<code-tabs>
  <code-pane title="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane title="src/app/heroes/heroes.component.html" path="toh-pt2/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane title="src/app/heroes/heroes.component.css" path="toh-pt2/src/app/heroes/heroes.component.css">
  </code-pane>
</code-tabs>

## まとめ

* 「Tour of Heroes」アプリはMaster/Detail画面にヒーローのリストを表示します
* ユーザーはヒーローを選択し、そのヒーローの詳細を見ることができます
* リストを表示するために `*ngFor` を使いました
* HTMLのブロックに条件を付けて表示・非表示を切り替えるために `*ngIf` を使いました
* CSSスタイルのclassを `class` バインディングで切り替えることができます
