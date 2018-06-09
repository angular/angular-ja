# コンポーネントスタイル

Angularアプリケーションは、標準 CSS でスタイルされます。これは、貴方が知っているCSSスタイルシート、
セレクター、ルール、そしてメディアクエリーついてのすべてを Angularアプリケーションに直接
適用できることを意味します。

加えて、Angularは、 コンポーネントに、標準スタイルシートでは無く、よりモジュールデザインを可能にする
コンポーネントと共に *コンポーネントスタイル* をバンドルできます。

このページでは、これらのコンポーネントスタイルをどのように読み込み適用するのか説明します。

Stackblitz で <live-example></live-example> を実行でき、ここからコードをダウンロードできます。

## コンポーネントスタイルを使いましょう

あなたが書くすべての Angular コンポーネントのために、HTMLテンプレートだけでは無く、
そのテンプレートに付随する CSSスタイル、必要な、あらゆるセレクター、ルール、
そしてメディアクエリーを細く指定することなどを定義できます。

ひとつの方法は、コンポーネントメタデータに `styles` プロパティをセットすることです。
この `styles` プロパティは、CSSコードを含む、文字列の配列を使います。
一般的に、ひとつの文字を与えます、次のような例です：

<code-example path="component-styles/src/app/hero-app.component.ts" title="src/app/hero-app.component.ts" linenums="false">
</code-example>

## スタイルの有効範囲

<div class="alert is-critical">

スタイルは、 _そのテンプレートのコンポーネントにだけ適用される_  `@Component` メタデータで定義します。

</div>

テンプレートの中のコンポーネントの入れ子や、コンポーネントに投げられたコンテントでも、_引き継ぎません_ 。

この例では、 `h1` スタイルは、ただ `HeroAppComponent` だけに現れ、
ネストされた `HeroMainComponent` には無く、 `<h1>` タグは、アプリケーションの何処にも現れない。

この有効範囲の制限は、 ***モジュール式スタイルの特徴*** です。

* それぞれのコンポーネントのコンテキストの大部分の表現を作るCSSクラス名、セレクターを利用できます。


* クラス名とセレクターは、コンポーネント内で局所的で、アプリケーションの他の場所で使われている
  クラスやセレクターと衝突しません。


* スタイルの変更は、他の場所のアプリケーションのコンポーネントスタイルに影響しません。


* きちんとした、そして整然としたプロジェクト構造に至らせる
  コンポーネントの TypeScript と HTMLコードと共に、各々のコンポーネントの CSSコードを配置できます。


* アプリケーションの他の場所で使われているか探す検索を行わずに、コンポーネント CSS コードの
変更あるいは除去が可能です。

{@a special-selectors}

## 特別なセレクター

コンポーネントスタイルは、いくつかの Shadow DOM スタイルのスコーピングの世界からの
特別な *セレクター* があります([W3C](https://www.w3.org) サイトの
[CSS スコーピング モデル レベル 1](https://www.w3.org/TR/css-scoping-1) ページに記述されています)。
次のセクションで、これらのセレクターを説明します。

### :host

コンポーネントを *提供する* 要素のスタイルを対象にする `:host` 偽クラスセレクターを使います(
対して、コンポーネントのテンプレートの *内部の* 要素を対象とします)。


<code-example path="component-styles/src/app/hero-details.component.css" region="host" title="src/app/hero-details.component.css" linenums="false">
</code-example>

`:host` セレクターは、ホストの要素を対象とする唯一の方法です。別のセレクターを用いて
コンポーネントの内側からホスト要素には到達できません、なぜならば、それは、コンポーネント自身の
テンプレートの一部ではないからです。ホストの要素は、親のコンポーネントのテンプレートの中にあります。

`:host` の後のカッコの中に別なセレクターを含むことにより、
条件付きのホストのスタイルを適用するために *function form* を使います。

つぎの例は、再びホストの要素を目標にします、が、`active` CSS クラスがある時だけです。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" title="src/app/hero-details.component.css" linenums="false">
</code-example>

### :host-context

時々、コンポーネントのビューの *外側* のいくつかの状態の基づいたスタイルを表すのに役立ちます。
たとえば、CSS テーマクラスは、ドキュメントの `<body>` 要素に適用させることが可能です、そして
あなたは、どのようにコンポーネントが見えるのかを変えたいと、望んでいます。

`:host-context()` 仮クラスセレクターを使いましょう、`:host()` からの関数のように働きます。
`:host-context()` セレクターは、コンポーネントのホスト要素の任意の先祖のうち、
ドキュメントルートまでのCSSクラスを探します。`:host-context()` セレクターは、他のセレクターと結びつけた時に便利です。

つぎの例は、いくつかの先祖の要素が、`theme-light` CSSクラスを備えている時の場合にのみ、
コンポーネントの *内部* のすべての `<h2>` 要素のスタイルに `background-color` を適用します。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" title="src/app/hero-details.component.css" linenums="false">
</code-example>

### (非推奨) `/deep/` 、 `>>>` と `::ng-deep`

コンポーネントスタイルは、普通は、HTML 内のコンポーネント自身のテンプレートにだけ適用されます。

`/deep/` シャドウピアスの子孫コンビネーターを利用して、子のコンポーネント ツリーを介して
すべての子のコンポーネントの見え方にスタイルを強制的におろしますます。
`/deep/` コンビネーターは、あらゆる深さのネストされたコンポーネントとして作動し、子のビューとしても
コンポーネントの子のコンテンツとしてもあてはまります。

つぎの例は、すべての `<h3>` 要素、つまり、ホストの要素から、このコンポーネントを下がり降り、
DOM のすべてのそれの子の要素まで、を対象とします。

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" title="src/app/hero-details.component.css" linenums="false">

</code-example>

`/deep/` コンビネーターには、別名 `>>>`　と `::ng-deep` があります。

<div class="alert is-important">

`/deep/`、 `>>>` と `::ng-deep` は、 *エミュレート化* ビューがカプセルされている時だけ使います。
エミュレート化は、デフォルトで、そして、大抵、ビューのカプセル化に使われます。追加の情報は、
[ビューのカプセル化制御法](guide/component-styles#view-encapsulation) セクションを参照してください。

</div>

<div class="alert is-important">

シャドウピアスの子孫コンビネーターは、非推奨で、ツールと[主要ブラウザからサポートが除去され始めています](https://www.chromestatus.com/features/6750456638341120) 。
同じように、Angular (`/deep/`、 `>>>` と `::ng-deep` の三つとも) のサポートも停止する計画です。
それまでは、ツールの幅広い互換性のために、`::ng-deep` を選択すべきです。

</div>

{@a loading-styles}

## 読み込みコンポーネント スタイル

コンポーネントにスタイルを追加する方法は、いくつかあります。

* `styles` または `styleUrls` メタデータの設定
* HTML テンプレート内のインライン
* CSS のインポート

前に概説した範囲指定のルールは、これらの読み込みパターンのそれぞれに適用されます。 

### コンポーネント メタデータ内のスタイル

`styles` 配列プロパティを `@Component` デコレーター に追加できます。

配列のそれぞれの文字は、コンポーネントに対していくつかの CSS を定義します。

<code-example path="component-styles/src/app/hero-app.component.ts" title="src/app/hero-app.component.ts (CSS inline)">
</code-example>

<div class="alert is-critical">

注意： これらのスタイルは、 _このコンポーネントにのみ_ 適用されます。
これらのスタイルは、テンプレートでネストされたどんなコンポーネントでも、あるいはコンポーネントに突出されたどんなコンテントでも、 _受継がれません_ 。

</div>

CLI は、 `--inline-styles` フラグを使ってコンポーネントを生成すれば、空の `styles` 配列を定義します。

<code-example language="sh" class="code-shell">
ng generate component hero-app --inline-style
</code-example>

### コンポーネント メタデータ内のスタイル ファイル

`styleUrls` プロパティを `@Component` デコレーターのコンポーネントに追加すると、
スタイルを外部の CSS ファイルから読み込めます。

<code-tabs>
  <code-pane title="src/app/hero-app.component.ts (CSS in file)" path="component-styles/src/app/hero-app.component.1.ts"></code-pane>
  <code-pane title="src/app/hero-app.component.css" path="component-styles/src/app/hero-app.component.css"></code-pane>
</code-tabs>

<div class="alert is-critical">

注意： スタイルファイルのスタイルは、 _このコンポーネントにのみ_ 適用されます。
これらのスタイルは、テンプレートでネストされたどんなコンポーネントでも、あるいはコンポーネントに突出されたどんなコンテントでも、 _受継がれません_ 。

</div>

<div class="l-sub-section">

  ひとつ以上のスタイルファイル、あるいは `style` と `styleUrls` の組み合わせて、定義が可能です。

</div>

CLI は、デフォルトで空のスタイルファイルを生成し、コンポーネントの生成された `styleUrls` で参照します。

<code-example language="sh" class="code-shell">
ng generate component hero-app
</code-example>

### インライン スタイル テンプレート

`<style>` タグで囲めば、HTMLテンプレート内に直に CSS　スタイルを埋め込むことも
可能です。

<code-example path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles" title="src/app/hero-controls.component.ts">
</code-example>

### リンク タグ テンプレート

コンポーネントの HTML テンプレート内に `<link>` タグを記述することも可能です。

<code-example path="component-styles/src/app/hero-team.component.ts" region="stylelink" title="src/app/hero-team.component.ts">
</code-example>

<div class="alert is-critical">

リンクタグの `href` URL は、 _**アプリケーションルート**_ からの相対指定でなければならず、
コンポーネントファイルからの相対指定では無いです。

CLI で生成するときに、[CLI ドキュメント](https://github.com/angular/angular-cli/wiki/stories-asset-configuration) に記述されているように、サーバーにコピーされた資産(アセット)の中に、必ずリンクされたスタイルファイルを含めてください。

</div>

### CSS @imports

標準 CSS `@import` ルールを利用して CSSファイルを CSSファイルの中にインポートすることも可能です。
詳しくは、[MDN](https://developer.mozilla.org) サイトの
[`@import`](https://developer.mozilla.org/en/docs/Web/CSS/@import) を参照してください。

この場合、インポートするファイルの URL は、CSSファイルに対して相対指定です。

<code-example path="component-styles/src/app/hero-details.component.css" region="import" title="src/app/hero-details.component.css (excerpt)">
</code-example>

### 外部とグローバルなスタイルファイル

CLI で生成する場合、あなたは、 `angular.json` に _全ての外部アセット_ を含め、外部スタイルファイルを含め、定義しなければなりません。

`styles` セクションで **グローバル** スタイルファイルの登録は、デフォルでは、グローバル `styles.css` と、事前定義してあります。

もっと学びたい場合は、 [CLI ドキュメント](https://github.com/angular/angular-cli/wiki/stories-global-styles) を参照してください。

### CSSスタイルでは無いファイル

CLI を使って生成しているならば、
スタイルファイルを、つぎの例のように、 [sass](http://sass-lang.com/)、 [less](http://lesscss.org/)、  あるいは、[stylus](http://stylus-lang.com/) で書け、 `@Component.styleUrls` メタデータで適切な拡張子 (`.scss`, `.less`, `.styl`) を定義します：

<code-example>
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
...
</code-example>

CLI 構築プロセスは、適切な CSS プリプロセッサを実行します。

`ng generate component` を使ってコンポーネントを生成すれば、CLI は、デフォルトで空の CSS　スタイルファイル(`.css`)を作ります。
[CLI ドキュメント](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors
"CSS プリプロセッサ統合") 
に記述してあるように、あなたのお気に入りの CSS プリプロセッサに環境設定できます。

<div class="alert is-important">

`@Component.styles` 配列に追加されたスタイル文字列は、_CSS に記述されなければならない_ 、なぜならば、CLI は、インラインスタイルのプリプロセッサに適用できないからです。

</div>

{@a view-encapsulation}

## ビューのカプセル化

前に論じた様に、コンポーネント CSS スタイルは、コンポーネントのビューの中に含まれ、
アプリケーションの残りに影響しません。

*プリコンポーネント* 基礎の上で、どのようにカプセル化が起きるのかを制御し、
コンポーネント メタデータで *ビューカプセル化モード* を設定できます。
つぎのモードから選択してください：

* `Native` ビューカプセル化は、コンポーネントのホスト要素の Shadow DOM を接続するために
ブラウザーのネイティブ Shadow DOM 実装([MDN](https://developer.mozilla.org) サイト上の
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  参照) を利用し、そして、 Shadow DOM の中のコンポーネントビューに入れます。
  コンポーネントのスタイルは、Shadow DOM と共に含まれています。

* `Emulated` ビューのカプセル化(デフォルト) は、コンポーネントのビューの CSS の CSS コードの有効なスコープの前処理(そして名前変更)
  によって、Shadow DOM の振る舞いをエミュレートします。
  詳細は、[付録 1](guide/component-styles#inspect-generated-css) を参照してください。

* `None` は、Angular にビューのカプセル化が無いことを意味します。
  Angular は、グローバルスタイルとして CSS を追加します。
  前に論じたスコープルール、分離、そして保護は、適用されません。
  これは、コンポーネントのスタイルを HTML 内に貼り付けることと本質的に同じことです。

コンポーネントのカプセル化モードを設定するために、コンポーネントメタデータの `encapsulation` プロパティを利用します：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.native" title="src/app/quest-summary.component.ts" linenums="false">
</code-example>

`Native` ビューのカプセル化は、Shadow DOM をネイティブサポートしているブラウザー上のみで動きます
( [Can I use](http://caniuse.com) サイトの
[Shadow DOM v0](http://caniuse.com/#feat=shadowdom) を参照してください)。多くのケースで、
なぜ `Emulated` ビューのカプセル化が、デフォルトモードとお勧めということ、に関する
サポートはまだ限定的です。

{@a inspect-generated-css}

## 検閲により生成された CSS

エミュレートされたビューのカプセル化を使う場合、Angular は、
標準 Shadow CSS のスコープルールを見積もるために、すべてのコンポーネントスタイルを前処理します。

エミュレートされたビューを伴った Angular アプリケーションが
稼働している DOM の中でカプセル化は可能になり、それぞれの DOM 要素は、添付された
いくつかの特別なアトリビュートを持っています：

<code-example format="">
  &lt;hero-details _nghost-pmm-5>
    &lt;h2 _ngcontent-pmm-5>Mister Fantastic&lt;/h2>
    &lt;hero-team _ngcontent-pmm-5 _nghost-pmm-6>
      &lt;h3 _ngcontent-pmm-6>Team&lt;/h3>
    &lt;/hero-team>
  &lt;/hero-detail>

</code-example>

ここには、二種類の生成されたアトリビュートがあります：

* 先天的なカプセル化内の Shadow DOM ホストのひとつの要素は、
`_nghost` アトリビュートを生成します。これは、典型的なホスト要素のコンポーネントの事例です。
* コンポーネントのビューの中の要素は、`_ngcontent` アトリビュートを持っています、これは、
この要素が属している Shadow DOM がどのホストをエミューレートしているのかを特定します。

これらのアトリビュートの正確な値は、重要ではありません。自動的に生成され、
アプリケーションコード内で決して参照しません。しかし、生成されたコンポーネントスタイルにより
対象とされ、DOM の `<head>` セクション内に有ります。

<code-example format="">
  [_nghost-pmm-5] {
    display: block;
    border: 1px solid black;
  }

  h3[_ngcontent-pmm-6] {
    background-color: white;
    border: 1px solid #777;
  }
</code-example>

これらのスタイルは、それぞれのセレクターは `_nghost` あるいは `_ngcontent`
アトリビュートセレクターと共に増強するために、前処理されます。
これらの追加のセレクターは、このページで記述されたスコープルールを可能にします。