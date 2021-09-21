# コンポーネントスタイル

Angularアプリケーションは、標準CSSでスタイルされます。これは、あなたが知っているCSSスタイルシート、
セレクター、ルール、そしてメディアクエリーついてのすべてを Angularアプリケーションに直接
適用できることを意味します。

加えて、Angularは、コンポーネントに標準スタイルシートでは無く、よりモジュールデザインを可能にする
コンポーネントと共に *コンポーネントスタイル* をバンドルできます。

このページでは、これらのコンポーネントスタイルをどのように読み込み適用するのか説明します。

Stackblitz で <live-example></live-example> を実行でき、ここからコードをダウンロードできます。

## コンポーネントスタイルを使いましょう

あなたが書くすべての Angular コンポーネントについて、HTMLテンプレートだけではなく、
そのテンプレートに付随するCSSスタイルを定義し、必要な、あらゆるセレクター、ルール、
そしてメディアクエリーを細く指定することなどを定義できます。

これを行うひとつの方法は、コンポーネントのメタデータに `styles` プロパティをセットすることです。
`styles` プロパティは、CSSコードを含む文字列の配列を使います。
通常は、次の例のようにひとつの文字列を与えます：

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts"></code-example>

## スタイルのスコープ

<div class="alert is-critical">

`@Component` メタデータで定義されたスタイルは、 _そのコンポーネントのテンプレート内でのみ適用されます_  。

</div>

テンプレート内にネストされたコンポーネント、コンポーネントに投影されたコンテントによって、_継承されることはありません_ 。

この例では、 `h1` スタイルは `HeroAppComponent` にのみ適用され、
ネストされた `HeroMainComponent` にもアプリケーションの他の場所の `<h1>` タグにも適用されません。

このスコープの制限は、 ***スタイルのモジュール性の機能*** です。

* CSSクラス名とセレクターは、各コンポーネントの文脈でもっとも合理的に利用できます。


* クラス名とセレクターは、コンポーネント内で局所的で、アプリケーションの他の場所で使われている
  クラスやセレクターと衝突しません。


* スタイルの変更は、他の場所のアプリケーションのコンポーネントスタイルに影響しません。


* 各コンポーネントのCSSコードをコンポーネントの TypeScript と HTMLコードと一緒に配置すると、
  きちんと整理されたプロジェクト構造になります。


* アプリケーション全体を検索してコードが使用されている場所を見つけることなく、
コンポーネントのCSSコードを変更または削除できます。

{@a special-selectors}

## 特別なセレクター

コンポーネントスタイルには、Shadow DOMスタイルスコーピング([W3C](https://www.w3.org) サイトの
[CSS スコーピング モデル レベル 1](https://www.w3.org/TR/css-scoping-1) ページに記述されています)
の世界からの特別な *セレクター* がいくつかあります。
次のセクションでは、これらのセレクターについて説明します。

### :host

`:host` 擬似クラスセレクターを使用して、(コンポーネントのテンプレートの *内部の* ターゲティング要素とは対象的に)
コンポーネントを *ホスト* する要素のスタイルをターゲットにします。


<code-example path="component-styles/src/app/hero-details.component.css" region="host" header="src/app/hero-details.component.css"></code-example>

`:host` セレクターは、ホスト要素をターゲットにする唯一の方法です。
コンポーネント自身のテンプレートの一部ではないため、他のセレクターを使用してコンポーネント内
からホスト要素に到達することはできません。ホスト要素は、親コンポーネントのテンプレート内にあります。

*関数形式* を使用して、`:host` の後のカッコ内に別なセレクターを含むことで、
ホストスタイルを条件付きで適用します。

次の例では、ホスト要素を再びターゲットにしていますが、`active` CSS クラスも持っている場合に限ります。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" header="src/app/hero-details.component.css"></code-example>

`:host` セレクターは他のセレクターと組み合わせることもできます。
子要素を選択するには、 `:host` の後ろにセレクターを追加します。たとえば、`:host h2` を使って、コンポーネントのビュー内にあるすべての `<h2>` 要素をターゲットにすることができます。

<div class="alert is-helpful">

コンポーネントのビューの外側のコンテキストに基づいてコンポーネントのスタイルを決めるために、`:host` セレクターの前に (`:host-context` 以外の) セレクターを追加してはいけません。このようなセレクターはコンポーネントのビューにスコープされておらず、外側のコンテキストを選択してしまいますが、これはネイティブな動作ではありません。そのような場合には、`:host-context` セレクターを使用してください。

</div>

### :host-context

場合によっては、コンポーネントのビューの *外* にある条件に基づいてスタイルを適用すると便利です。
たとえば、CSSのテーマクラスをドキュメントの `<body>` 要素に適用すると、
それに基づいてコンポーネントの外観を変更することができます。

`:host()` の関数形式と同じように動作する `:host-context()` 疑似クラスセレクターを使用します。
`:host-context()` セレクターは、コンポーネントのホスト要素の先祖のうち、ドキュメントルートまでのCSSクラスを探します。
`:host-context()` セレクターは、別のセレクターと組み合わせたときに便利です。

次の例では、コンポーネント *内* のすべての `<h2>` 要素に `background-color`　のスタイルを適用します。
ただし、一部の祖先要素にCSSクラス `theme-light` がある場合にのみ適用されます。

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" header="src/app/hero-details.component.css"></code-example>

### (非推奨) `/deep/` 、 `>>>` と `::ng-deep` {@a deprecated-deep--and-ng-deep}

コンポーネントスタイルは通常、コンポーネント自身のテンプレートのHTMLにのみ適用されます。

擬似クラス `::ng-deep` を任意の CSS ルールに適用すると、そのルールに対するビューのカプセル化が
完全に無効になります。また、`::ng-deep` が適用されたすべてのスタイルは、グローバルなスタイルになります。指定されたスタイルを
現在のコンポーネントとそのすべての子孫に適用するには、必ず `::ng-deep` の前に `:host` セレクターを含めるように
してください。擬似セレクター `:host` を使用せずに `::ng-deep` コンビネーターを使用すると、スタイルが
他のコンポーネントに波及する可能性があります。

次の例では、ホスト要素からこのコンポーネントを経由してDOM内のすべての子要素に至るまで、
すべての `<h3>` 要素を対象としています。

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" header="src/app/hero-details.component.css"></code-example>

`/deep/` コンビネーターには、別名 `>>>`　と `::ng-deep` があります。

<div class="alert is-important">

`/deep/`、 `>>>` および `::ng-deep` は、 *エミュレートされた* ビューカプセル化でのみ使用してください。
Emulatedは、デフォルトでもっともよく使用されるビューカプセル化です。
詳細については、[ビューのカプセル化](guide/view-encapsulation) セクションを参照してください。

</div>

<div class="alert is-important">

shadow-piercing子孫コンビネータは廃止され、主要なツールや[ブラウザからサポートが削除されています](https://www.chromestatus.com/feature/6750456638341120) 。
そのため、Angular (`/deep/`、 `>>>` および `::ng-deep` の3つすべて) のサポートを落とす予定です。
それまでは、ツールの幅広い互換性のために、`::ng-deep` を選択すべきです。

</div>

{@a loading-styles}

## コンポーネントスタイルの読み込み

コンポーネントにスタイルを追加する方法は、いくつかあります。

* `styles` または `styleUrls` メタデータの設定
* HTML テンプレート内のインライン
* CSS のインポート

前に概説した範囲指定のルールは、これらの読み込みパターンのそれぞれに適用されます。 

### コンポーネントメタデータ内のスタイル

`styles` 配列プロパティを `@Component` デコレーター に追加できます。

配列の各文字列は、このコンポーネントのCSSを定義します。

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts (CSS inline)">
</code-example>

<div class="alert is-critical">

注意： これらのスタイルは、 _このコンポーネントにのみ_ 適用されます。
テンプレート内にネストされたコンポーネントやコンポーネントに投影されたコンテンツによって _継承されることはありません_ 。

</div>

Angular CLIコマンド [`ng generate component`](cli/generate) は、 `--inline-style` フラグを使用してコンポーネントを作成するときに空の `styles` 配列を定義します。

<code-example language="sh">
ng generate component hero-app --inline-style
</code-example>

### コンポーネントメタデータ内のスタイルファイル

コンポーネントの `@Component` デコレーターに `styleUrls` プロパティを追加すると、
外部CSSファイルからスタイルをロードできます。

<code-tabs>
  <code-pane header="src/app/hero-app.component.ts (CSS in file)" path="component-styles/src/app/hero-app.component.1.ts"></code-pane>
  <code-pane header="src/app/hero-app.component.css" path="component-styles/src/app/hero-app.component.css"></code-pane>
</code-tabs>

<div class="alert is-critical">

注意： スタイルファイルのスタイルは、 _このコンポーネントにのみ_ 適用されます。
テンプレート内にネストされたコンポーネントやコンポーネントに投影されたコンテンツによって _継承されることはありません_ 。

</div>

<div class="alert is-helpful">

  複数のスタイルファイル、または `styles` と `styleUrls` の組み合わせを指定することもできます。

</div>

Angular CLIコマンド [`ng generate component`](cli/generate) を `--inline-style` フラグなしで使用すると、空のスタイルファイルを生成し、コンポーネントの生成された `styleUrls` で参照します。

<code-example language="sh">
ng generate component hero-app
</code-example>

### インラインスタイルテンプレート

`<style>` タグの中に入れることで、
CSSスタイルをHTMLテンプレートに直接埋め込むことができます。

<code-example path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles" header="src/app/hero-controls.component.ts">
</code-example>

### リンクタグテンプレート

コンポーネントのHTMLテンプレートに `<link>` タグを記述することもできます。

<code-example path="component-styles/src/app/hero-team.component.ts" region="stylelink" header="src/app/hero-team.component.ts">
</code-example>

<div class="alert is-critical">

CLIを使用して構築する場合は、[Assets configuration guide](guide/workspace-config#assets-configuration) の説明にしたがって、リンクされたスタイルファイルをアセットに含めてサーバーにコピーしてください。

リンクタグのhref URLがアプリケーションルートまたはコンポーネントファイルのどちらへの相対パスであっても、CLIはスタイルシートを取り込みます。

</div>

### CSS @imports

標準のCSS `@import` ルールを使用して CSSファイルを CSSファイルにインポートすることもできます。
詳細は、[MDN](https://developer.mozilla.org/ja) サイトの
[`@import`](https://developer.mozilla.org/ja/docs/Web/CSS/@import) を参照してください。

この場合、インポートするファイルの URL は、CSSファイルに対して相対指定です。

<code-example path="component-styles/src/app/hero-details.component.css" region="import" header="src/app/hero-details.component.css (excerpt)">
</code-example>

### 外部およびグローバルスタイルファイル

CLIを使用して構築する場合、外部スタイルファイルを含む _すべての外部アセット_ を含めるように `angular.json` を設定する必要があります。

デフォルトでグローバルな `styles.css` ファイルを事前設定している `styles` セクションに、 **グローバル** スタイルファイルを登録します。

もっと学びたい場合は、 [Styles configuration guide](guide/workspace-config#styles-and-scripts-configuration) を参照してください。


### CSS以外のスタイルファイル

CLIを使用して構築する場合、
スタイルファイルを、次の例のように、 [sass](https://sass-lang.com/)、または [less](http://lesscss.org/) に書き込んで、`@Component.styleUrls` メタデータに適切な拡張子 (`.scss`, `.less`, `.styl`) をもつファイルを次のように指定できます：

<code-example>
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
...
</code-example>

CLIビルドプロセスは、適切なCSSプリプロセッサを実行します。

`ng generate component` を使用してコンポーネントファイルを生成する場合、CLI は、デフォルトで空の CSS　スタイルファイル(`.css`)を生成します。
[Workspace configuration guide](guide/workspace-config#generation-schematics) 
で説明されているように、CLIのデフォルトのプリプロセッサを設定することができます。

<div class="alert is-important">

CLIはインラインスタイルにプリプロセッサを適用できないため、`@Component.styles` 配列に追加されたスタイル文字列は _CSSで記述する必要があります_ 。

</div>

@reviewed 2021-09-17
