# データの表示

HTMLテンプレートのコントロールをAngularコンポーネントのプロパティにバインドすることで、データを表示できます。

このページでは、ヒーローのリストを含むコンポーネントを作成します。
あなたはヒーロー名のリストを表示し、
条件付きでリストの下にメッセージを表示します。

最終的なUIは次のようになります：

<div class="lightbox">
  <img src="generated/images/guide/displaying-data/final.png" alt="Final UI">
</div>

<div class="alert is-helpful">



<live-example></live-example> は、このページで説明している
すべての構文とコードスニペットを示しています。


</div>


{@a interpolation}

## 補間によるコンポーネントプロパティの表示
コンポーネントプロパティを表示するもっとも簡単な方法は、
補間によってプロパティ名をバインドすることです。
補間では、プロパティ名をビューテンプレートに入れ、二重中括弧で囲みます： `{{myHero}}`

`displaying-data` という名前のワークスペースとアプリケーションを作成するために、CLIコマンド [`ng new displaying-data`](cli/new) を実行します。

<code>app.component.html</code>ファイルを削除します。この例では必要ありません。

次に、テンプレートとコンポーネントの本体を変更して
<code>app.component.ts</code>ファイルを変更します。

完了したら、このようになります。


<code-example path="displaying-data/src/app/app.component.1.ts" header="src/app/app.component.ts"></code-example>



空のコンポーネントには、`title` と　`myHero` の2つのプロパティを追加しました。

テンプレートは、二重中括弧補間を使用して
2つのコンポーネントプロパティを表示します：


<code-example path="displaying-data/src/app/app.component.1.ts" header="src/app/app.component.ts (template)" region="template"></code-example>



<div class="alert is-helpful">



テンプレートは、ECMAScript 2015バッククオート(<code>\`</code>)内の複数行の文字列です。
一重引用符(`'`)と同じ文字*ではない*バッククオート(<code>\`</code>)は複数行にわたって
文字列を構成することができ、
HTMLをより読みやすくします 。


</div>



Angularは自動的にコンポーネントから `title` と `myHero` プロパティの値を取り出し、
それらの値をブラウザに挿入します。
Angularは、これらのプロパティが変更されると、表示を更新します。


<div class="alert is-helpful">



より正確には、再表示は、キーストローク、タイマー完了、HTTPリクエストへの応答など、
ビューに関連する何らかの非同期イベントの後に発生します。


</div>



`AppComponent` クラスのインスタンスを作成するために、**new** を呼び出さないことに注目してください。
Angularがインスタンスを作成しています。どのように？

`@Component` デコレーターの CSSの`selector`は、`<app-root>` という名前の要素を指定します。
その要素は `index.html` ファイルのbody内のプレースホルダです：


<code-example path="displaying-data/src/index.html" header="src/index.html (body)" region="body"></code-example>



`AppComponent` クラスでブートストラップすると（<code>main.ts</code>内）、
Angularは `index.html` 内の `<app-root>` を探してそれを見つけ、
`AppComponent` をインスタンス化して、 `<app-root>` タグの中にレンダリングします。

今すぐアプリケーションを実行しましょう。 タイトルとヒーロー名が表示されます。

<div class="lightbox">
  <img src="generated/images/guide/displaying-data/title-and-hero.png" alt="Title and Hero">
</div>

次のいくつかのセクションでは、アプリケーションのコーディングの選択肢のいくつかをレビューします。


## テンプレートインラインまたはテンプレートファイル？

コンポーネントのテンプレートは、2つの場所のいずれかに格納できます。
`template` プロパティを使って *インライン* で定義するか、
あるいは別のHTMLファイルにテンプレートを定義し、
`@Component` デコレーターの `templateUrl` プロパティを使ってコンポーネントのメタデータで紐付けられます。

インラインHTMLと個別HTMLの選択は、好み、状況、
および組織ポリシーの問題です。
ここでは、テンプレートが小さく、追加のHTMLファイルなしでデモが簡単であるため、
アプリケーションはインラインHTMLを使用します。

どちらのスタイルでも、テンプレートデータバインディングはコンポーネントのプロパティへの同じアクセス権を持ちます。

<div class="alert is-helpful">

  デフォルトでは、Angular CLIコマンド [`ng generate component`](cli/generate) はテンプレートファイルを伴うコンポーネントを生成します。あなたはそれを次のようにオーバーライドできます：

  <code-example hideCopy language="sh" class="code-shell">
    ng generate component hero -it
  </code-example>

</div>


## コンストラクターまたは変数の初期化？

この例では、変数の割り当てを使用してコンポーネントを初期化していますが、コンストラクターを使用してプロパティを宣言して初期化することもできます。


<code-example path="displaying-data/src/app/app-ctor.component.1.ts" region="class"></code-example>



このアプリは、簡潔にするために、より簡潔な「変数割り当て」スタイルを使用しています。

{@a ngFor}

## ** *ngFor ** で配列プロパティを表示する

ヒーローのリストを表示するには、ヒーロー名の配列をコンポーネントに追加し、配列の最初の名前になるように `myHero` を再定義します。


<code-example path="displaying-data/src/app/app.component.2.ts" header="src/app/app.component.ts (class)" region="class"></code-example>



テンプレートでAngular `ngFor` ディレクティブを使用して、
各項目を `heroes` リストに表示します。


<code-example path="displaying-data/src/app/app.component.2.ts" header="src/app/app.component.ts (template)" region="template"></code-example>



このUIでは、HTMLの順序付けられていないリストを `<ul>`および `<li>`タグとともに使用します。
`<li>` 要素の `*ngFor` はAngular 「繰り返し」 ディレクティブです。
これは `<li>`要素（とその子要素）を「リピータテンプレート」としてマークします：


<code-example path="displaying-data/src/app/app.component.2.ts" header="src/app/app.component.ts (li)" region="li"></code-example>



<div class="alert is-important">



`*ngFor` の先頭のアスタリスク（\*）を忘れないでください。 それは構文の不可欠な部分です。
詳細については、[テンプレート構文](guide/template-syntax#ngFor) ページを参照してください.


</div>



`ngFor` 二重引用符命令の `hero` に注目してください。
これはテンプレート入力変数の例です。
さらに詳しいテンプレート入力変数については、[テンプレート構文](guide/template-syntax) ページの
[ミクロ構文](guide/template-syntax#microsyntax) セクションを読んでください。

Angularはリスト内の各項目の `<li>` を複製し、
`hero` 変数を現在の反復の項目（ヒーロー）に設定します。
Angularはその変数を二重中括弧内の補間のコンテキストとして使用します。


<div class="alert is-helpful">



この場合は、 `ngFor` は配列を表示していますが、
`ngFor` は任意の[反復可能](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)オブジェクトについて項目を繰り返すことができます。

</div>



今、ヒーローは順不同のリストに表示されます。

<div class="lightbox">
  <img src="generated/images/guide/displaying-data/hero-names-list.png" alt="After ngfor">
</div>


## データのクラスを作成する

アプリケーションのコードは、コンポーネント内に直接データを定義しますが、これはベストプラクティスではありません。
しかし、簡単なデモでは大丈夫です。

現時点では、文字列の配列に対するバインドが行われます。
実際のアプリケーションでは、ほとんどのバインディングはより特殊なオブジェクトになります。

このバインディングを特殊なオブジェクトを使用するように変換するには、
ヒーロー名の配列を `Hero` オブジェクトの配列に変換します。そのためには、 `Hero` クラスが必要です。

<code-example language="sh" class="code-shell">
  ng generate class hero
</code-example>

次のコードを使用します。


<code-example path="displaying-data/src/app/hero.ts" header="src/app/hero.ts"></code-example>



コンストラクターと2つのプロパティ、 `id` と `name` をもつクラスを定義しました。

クラスにプロパティがあるように見えないかもしれませんが、それはあります。
コンストラクターパラメータの宣言は、TypeScriptのショートカットを利用します。

最初のパラメータを考えてみましょう：


<code-example path="displaying-data/src/app/hero.ts" header="src/app/hero.ts (id)" region="id"></code-example>



簡単な構文で多くのことをしています。：

* コンストラクターパラメータとその型を宣言します。
* 同じ名前のパブリックプロパティを宣言します。
* クラスのインスタンスを作成するときに、対応する引数でそのプロパティを初期化します。



### Heroクラスの使用

`Hero` クラスをインポートした後、`AppComponent.heroes` プロパティは `Hero` オブジェクト
の _型付きの_ 配列を返すことができます：


<code-example path="displaying-data/src/app/app.component.3.ts" header="src/app/app.component.ts (heroes)" region="heroes"></code-example>



次に、テンプレートを更新します。
現時点では、ヒーローの`id` と `name` が表示されます。
ヒーローの `name` プロパティだけを表示するように修正しました。


<code-example path="displaying-data/src/app/app.component.3.ts" header="src/app/app.component.ts (template)" region="template"></code-example>



ディスプレイは同じように見えますが、コードはきれいになります。

{@a ngIf}

## NgIfによる条件付き表示

アプリケーションは時には、特定の状況下でのみビューまたはビューの一部を表示する必要があります。

3人以上のヒーローがいる場合、メッセージを表示するように例を変更しましょう。

Angular `ngIf` ディレクティブは _真偽_ 条件に基づいて要素を挿入または削除します。
実際の動作を確認するには、テンプレートの一番下に次の段落を追加します。


<code-example path="displaying-data/src/app/app.component.ts" header="src/app/app.component.ts (message)" region="message"></code-example>



<div class="alert is-important">



`*ngIf` の先頭のアスタリスク（\*）を忘れないでください。 それは構文の不可欠な部分です。
さらに詳しい `ngIf` と `*` については、[テンプレート構文](guide/template-syntax) ページの[ngIf セクション](guide/template-syntax#ngIf) を読んでください。


</div>



`*ngIf="heroes.length > 3"` という二重引用符で囲まれたテンプレート式は、
TypeScriptとよく似ています。
コンポーネントのヒーローのリストに3つより多いアイテムがある場合、Angularは段落をDOMに追加し、
メッセージが表示されます。 3つ以内のアイテムがある場合、 Angularは段落を省略するので、
メッセージは表示されません。 詳細については、
[テンプレート構文](guide/template-syntax) ページの
[テンプレート式](guide/template-syntax#template-expressions) を参照してください。


<div class="alert is-helpful">



Angularはメッセージを表示したり隠したりしていません。DOMから段落要素を追加したり削除したりしています。
これは、特に大規模なプロジェクトで多くのデータバインディングを含むHTMLを条件により含めたり除外したりするときに、パフォーマンスを改善します。


</div>



やってみましょう。 配列には4つの項目があるため、メッセージが表示されます。
<code>app.component.ts</code>に戻り、ヒーロー配列の要素の1つを削除またはコメントアウトします。
ブラウザは自動で更新し、メッセージは消えるでしょう。



## まとめ
これらの使い方を学びました：

* コンポーネントのプロパティを表示するための二重中括弧による **補間**。
* 配列の要素を示すための **ngFor**
* コンポーネントのための **モデルデータ** を型作り、そのプロパティを表示するためのTypeScriptクラス。
* 真偽式に基づいて条件付きでHTMLの塊を表示するための **ngIf** 。

最終的なコードはこちらです：


<code-tabs>

  <code-pane header="src/app/app.component.ts" path="displaying-data/src/app/app.component.ts" region="final">

  </code-pane>

  <code-pane header="src/app/hero.ts" path="displaying-data/src/app/hero.ts">

  </code-pane>

  <code-pane header="src/app/app.module.ts" path="displaying-data/src/app/app.module.ts">

  </code-pane>

  <code-pane header="main.ts" path="displaying-data/src/main.ts">

  </code-pane>

</code-tabs>
