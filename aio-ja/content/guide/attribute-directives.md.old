# 属性ディレクティブ

**属性**ディレクティブは、DOM要素の見た目や動作を変更します。

<live-example header="Attribute Directive example"></live-example>を実行してください。

{@a directive-overview}

## ディレクティブの概要

Angularには、3つのディレクティブがあります。

1. コンポーネント(Components)&mdash;テンプレート付きディレクティブ
1. 構造ディレクティブ(Structural directives)&mdash;DOM要素を追加、削除してDOMレイアウトを変更するディレクティブ
1. 属性ディレクティブ(Attribute directives)&mdash;要素やコンポーネント、別のディレクティブの見た目や動作を変更するディレクティブ

*コンポーネント*は、3つのディレクティブのうち、もっとも一般的なものです。
[入門](start "Getting Started with Angular") チュートリアルでコンポーネントをはじめて見たはずです。

*構造ディレクティブ*は、ビューの構造を変更します。
2つの例としては、[NgFor](guide/built-in-directives#ngFor)と[NgIf](guide/built-in-directives#ngIf)です。
それらについては[構造ディレクティブ](guide/structural-directives)ガイドで学んでください。

*属性ディレクティブ*は、要素の属性として扱われます。
たとえば、[テンプレートシンタックス](guide/built-in-directives#ngstyle)ガイドの組み込みの
[NgStyle](guide/built-in-directives)ディレクティブは、
同時に複数の要素のスタイルを変更することができます。

## シンプルな属性ディレクティブを作成する

属性ディレクティブは、最低限`@Directive`でアノテートされたコントローラークラスを作成する必要があり、それには属性を識別するセレクターを指定します。コントローラークラスには、必要なディレクティブの動作を実装します。

このページでは、ユーザーがその要素の上を移動したときに、要素の背景色を設定するシンプルな _appHighlight_ 属性ディレクティブを作成する方法を示します。これは次のように書くことができます。

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html (applied)" region="applied"></code-example>

{@a write-directive}

ディレクティブは名前空間をサポートしないことに注意してください。

<code-example path="attribute-directives/src/app/app.component.avoid.html" header="src/app/app.component.avoid.html (unsupported)" region="unsupported"></code-example>

### ディレクティブのコードを書く

CLIコマンド [`ng generate directive`](cli/generate) をターミナル画面に入力して、ディレクティブクラスを作成します。

<code-example language="sh" class="code-shell">
ng generate directive highlight
</code-example>

CLIは、`src/app/highlight.directive.ts`と対応するテストファイル `src/app/highlight.directive.spec.ts` を作成し、ルートの`AppModule`にディレクティブのクラスを _宣言_ します。

<div class="alert is-helpful">

_ディレクティブ_ は、 _コンポーネント_ と同じ方法で[Angularモジュール](guide/ngmodules)で宣言する必要があります。

</div >

生成された`src/app/highlight.directive.ts`は次のとおりです。

<code-example path="attribute-directives/src/app/highlight.directive.0.ts" header="src/app/highlight.directive.ts"></code-example>

インポートされた`Directive`シンボルは、Angularの`@Directive`デコレーターを提供します。

`@Directive`デコレーターの唯一の設定プロパティは、ディレクティブの[CSS属性セレクタ](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors)`[appHighlight]`を指定します。

属性セレクターとして扱うには、角括弧（`[]`）を使います。Angularは、テンプレート内の`appHighlight`という名前の属性をもつ各要素を見つけ、その要素にこのディレクティブのロジックを適用します。

_属性セレクタ_ パターンは、この種のディレクティブの名前を説明します。

<div class="alert is-helpful">

#### なぜ、highlightではないのか？

*highlight*は、*appHightlight*よりも簡潔なセレクター名で正常に動作しますが、接頭辞をつけることで、標準のHTML属性と競合しないようにすることをお勧めします。これにより、サードパーティのディレクティブ名と衝突するリスクも抑えることができます。CLIは、`app`接頭辞を付与することで衝突を避けています。

`highlight`ディレクティブの名前には、`ng`をつけないようにします。その接頭辞は、Angularの予約語であり、これを使ってしまうと調査が困難な不具合が発生する恐れがあります。

</div>

`@Directive`メタデータの後には、ディレクティブのコントローラークラス(`HighlightDirective`)がきます。このクラスには、ディレクティブの(現在は空の)ロジックが含まれています。`HighlightDirective`をエクスポートすると、このディレクティブにアクセスできるようになります。

生成された`src/app/highlight.directive.ts`を次のように編集します。

<code-example path="attribute-directives/src/app/highlight.directive.1.ts" header="src/app/highlight.directive.ts"></code-example>

`import`ステートメントは、Angularの`core`ライブラリから追加の`ElementRef`シンボルを指定します。

ディレクティブのコンストラクター内で`ElementRef`を使用して、`appHighlight`を適用したDOM要素への参照を[注入](guide/dependency-injection)します。

`ElementRef`は、`nativeElement`プロパティを使用して、ホストDOM要素へ直接アクセスすることができます。

この最初の実装では、ホスト要素の背景色を黄色に設定します。

{@a apply-directive}

## 属性ディレクティブを適用する

新しい`HighlightDirective`を使用するには、ルートである`AppComponent`のテンプレートへ段落(`<p>`)要素を追加し、属性としてディレクティブを適用します。

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html" region="applied"></code-example>

次に、アプリケーションを起動して`HighlightDirective`の挙動を確認します。

<code-example language="sh" class="code-shell">
ng serve
</code-example>

要約すると、Angularは**ホスト**`<p>`要素の`appHighlight`属性を見つけました。`HighlightDirective`クラスのインスタンスを作成し、`<p>`要素の背景スタイルを黄色に設定するディレクティブのコンストラクターに`<p>`要素への参照を注入しました。

{@a respond-to-user}

## ユーザーが開始したイベントに対応する

現在、`appHighlight`は単に要素の色を設定します。ディレクティブは、よりダイナミックな動作になる可能性があります。ユーザーの要素への出入りを検出し、ハイライトカラーを設定またはクリアすることによって、応答することができます。

まず、インポートされたシンボルのリストに`HostListener`を追加します。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (imports)" region="imports"></code-example>

次に、マウスの出入りに応答する2つのイベントハンドラーを追加します。個々のイベントハンドラーは、`HostListener`デコレーターによって装飾されます。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (mouse-methods)" region="mouse-methods"></code-example>

`@HostListener`デコレーターは、属性ディレクティブをホストする要素（この場合は`<p>`）DOM要素のイベントに登録することができます。

<div class="alert is-helpful">

もちろん、標準のJavaScriptを使用してDOMへアクセスし、イベントリスナーを手動でアタッチすることもできます。そのアプローチには少なくとも3つの問題があります。

1. リスナーを正しく記述する必要があります
1. メモリリークを避けるために、ディレクティブが破棄された時にリスナーを*デタッチ*する必要があります
1. DOM APIを直接扱うことはベストプラクティスではありません

</div>

ハンドラーは、ホストのDOM要素である`el`の色を設定するヘルパーメソッドに委譲します。

ヘルパーメソッドである`highlight`がコンストラクターから抽出されました。
改訂されたコンストラクターは、単に注入された`el: ElementRef`を宣言します。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (constructor)" region="ctor"></code-example>

更新されたディレクティブは、すべてここにあります。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts"></code-example>

アプリケーションを起動し、ポインターがパラグラフ要素の上へホバーするときに背景色が表示され、ポインターが離れると消えていることを確認します。

<div class="lightbox">
  <img src="generated/images/guide/attribute-directives/highlight-directive-anim.gif" alt="Second Highlight">
</div>

{@a bindings}

## _@Input_ データバインディングでディレクティブへ値を渡す

現在、ハイライト表示の色は、ディレクティブ _内_ でハードコードされていますが、これでは柔軟性に欠けてしまいます。このセクションでは、ディレクティブを適用しながら、ハイライトカラーを設定する方法を開発者へ示します。

`@angular/core`からインポートされたシンボルのリストに`Input`を追加することから始めてください。
<code-example path="attribute-directives/src/app/highlight.directive.3.ts" header="src/app/highlight.directive.ts (imports)" region="imports"></code-example>

次のように、ディレクティブクラスに`highlightColor`プロパティを追加します。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (highlightColor)" region="color"></code-example>

{@a input}

### `@Input()`プロパティへのバインド

`@Input()`デコレーターに注目してください。ディレクティブの`highlightColor`プロパティをバインディングに使用できるように、クラスへメタデータを追加します。

*input*プロパティと呼ばれるのは、データがバインディング式からディレクティブ _へ_ 流れるためです。`@Input()`メタデータがなければ、Angularは、バインディングを拒否します。詳細は[以下](guide/attribute-directives#why-input "なぜ、@Inputを追加するのか？")を参照してください。

`AppComponent`のテンプレートに次のバリエーションを追加してみてください。

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html (excerpt)" region="color-1"></code-example>

`AppComponent`に`color`プロパティを追加してください。

<code-example path="attribute-directives/src/app/app.component.1.ts" header="src/app/app.component.ts (class)" region="class"></code-example>

プロパティバインディングでハイライトの色を制御します。

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html (excerpt)" region="color-2"></code-example>

ディレクティブを同時に適用し、このような _同じ属性_ に色を設定するとよりよいでしょう。

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (color)" region="color"></code-example>

`[appHighlight]`属性バインディングが、`<p>`要素へハイライト表示ディレクティブを適用し、プロパティバインディングでディレクティブのハイライトカラーを設定します。
両方の作業を行うには、ディレクティブの属性セレクター(`[appHighlight]`)を再利用しており、これは明快でコンパクトな構文です。

カラーのプロパティバインディングの名前になったため、ディレクティブの`highlightColor`プロパティの名前を`appHighlight`に変更する必要があります。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (renamed to match directive selector)" region="color-2"></code-example>

`appHighlight`という単語は恐ろしいプロパティ名であり、プロパティの意図を伝えていないので、これでは不愉快です。

{@a input-alias}

### @Inputエイリアスにバインドする

幸いなことに、ディレクティブのプロパティに任意の名前をつけ、バインディングのために _エイリアス_ をつけることができます。

元のプロパティ名を復元し、セレクターを`@Input()`の引数のエイリアスとして指定します。

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (color property with alias)" region="color"></code-example>

このディレクティブの _内部_ では、プロパティは`highlightColor`として知られています。
このディレクティブの _外部_ では、バインド先は`appHighlight`と呼ばれています。

これにより、望むプロパティ名とバインディング構文との、両方のベストな世界を得ます。

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (color)" region="color"></code-example>

エイリアスを介して`highlightColor`へバインディングするので、`onMouseEnter()`メソッドをそのプロパティを使用するために修正してください。誰かが`appHighlightColor`へのバインディングを怠ると、ホスト要素を赤でハイライトします。

<code-example path="attribute-directives/src/app/highlight.directive.3.ts" header="src/app/highlight.directive.ts (mouse enter)" region="mouse-enter"></code-example>

ここに、ディレクティブのクラスの最新バージョンがあります。

<code-example path="attribute-directives/src/app/highlight.directive.3.ts" header="src/app/highlight.directive.ts (excerpt)"></code-example>

## 試すためのハーネスを書く

このディレクティブが実際のどのように動作するかを想像することは難しいかもしれません。このセクションでは、`AppComponent`をハーネスに変換して、ラジオボタンからハイライトカラーを選択し、ディレクティブへ選択した色をバインドするようにします。

次のように<code>app.component.html</code>を更新します。

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (v2)" region="v2"></code-example>

初期値を持たないように`AppComponent.color`を修正してください。

<code-example path="attribute-directives/src/app/app.component.ts" header="src/app/app.component.ts (class)" region="class"></code-example>

ここにハーネスとディレクティブの動作するものがあります。

<div class="lightbox">
  <img src="generated/images/guide/attribute-directives/highlight-directive-v2-anim.gif" alt="Highlight v.2">
</div>

{@a second-property}

## 2番目のプロパティへバインドする

ハイライトディレクティブには、カスタマイズ可能なプロパティが1つあります。実際のアプリケーションでは、もっと必要な場合があります。

現時点では、デフォルトの色は(ユーザーがハイライトカラーを選択するまで)「赤」としてハードコードされています。テンプレート開発者にデフォルトの色を設定させます。

`HighlightDirective`へ`defaultColor`と呼ばれる2番目の**input**プロパティを追加します。

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (defaultColor)" region="defaultColor"></code-example>

ディレクティブの`onMouseEnter`を改訂して、最初に`highlightColor`でハイライトし、次に`defaultColor`でハイライトし、どちらのプロパティも未定義の場合は「赤」に戻します。

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (mouse-enter)" region="mouse-enter"></code-example>

すでに`appHighlight`属性へバインドしているとき、2番目のプロパティへどのようにバインドしますか？

コンポーネントの場合と同様に、必要に応じてテンプレート内で文字列を並べることで、多くのディレクティブプロパティバインディングを追加できます。

開発者は、次のテンプレートHTMLを書くことができ、どちらも`AppComponent.color`へバインドします。デフォルトの色として「紫」に戻ります。

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (defaultColor)" region="defaultColor"></code-example>

Angularは、`@Input()`デコレーターで _パブリック_ にしたため、`defaultColor`が`HighlightDirective`に属していることを知っています。

コーディングが完了したら、ハーネスがどのように機能するかを次に示します。

<div class="lightbox">
  <img src="generated/images/guide/attribute-directives/highlight-directive-final-anim.gif" alt="Final Highlight">
</div>

{@a ngNonBindable}
## `ngNonBindable`

With the built-in template primitive `ngNonBindable`, Angular won't
evaluate expressions in elements. For example:

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" header="src/app/app.component.html" region="ngNonBindable"></code-example>

The expression `{{ 1 + 1 }}` will render just as it does in your code editor,
and will not display `2`. This is helpful when you want to render code in the browser.

When you apply `ngNonBindable` to an element, it stops any binding starting at that element, including child elements. However, `ngNonBindable` still allows
directives to work to the element where you apply `ngNonBindable`. In the following example, the `appHighlight` directive will still be active but Angular will not evaluate the expression `{{ 1 + 1 }}`.

<code-example path="attribute-directives/src/app/app.component.html" linenums="false" header="src/app/app.component.html" region="ngNonBindable-with-directive"></code-example>

Additionally, if you apply `ngNonBindable` to a parent element, interpolation and binding of any sort, such as property binding, or event binding, is disabled for its children.

## サマリー

このページでは以下をカバーしました。

* 要素の動作を変更する[**属性ディレクティブ**を作成](guide/attribute-directives#write-directive)する。
* テンプレート内の要素へ[ディレクティブを適用](guide/attribute-directives#apply-directive)する。
* ディレクティブの動作を変更する[イベントに**応答**](guide/attribute-directives#respond-to-user)する。
* [ディレクティブへ値をバインド](guide/attribute-directives#bindings)する。
* [Prevent expression evaluation](guide/attribute-directives#ngNonBindable).

最終的なソースコードは次のとおりです。

<code-tabs>
  <code-pane header="app/app.component.ts" path="attribute-directives/src/app/app.component.ts"></code-pane>
  <code-pane header="app/app.component.html" path="attribute-directives/src/app/app.component.html"></code-pane>
  <code-pane header="app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.ts"></code-pane>
  <code-pane header="app/app.module.ts" path="attribute-directives/src/app/app.module.ts"></code-pane>
  <code-pane header="main.ts" path="attribute-directives/src/main.ts"></code-pane>
  <code-pane header="index.html" path="attribute-directives/src/index.html"></code-pane>
</code-tabs>


また、<live-example header="Attribute Directive example"></live-example>を体験、ダウンロードすることもできます。

{@a why-input}

### Appendix(付録): なぜ、 `@Input()` を追加するのか？

このデモでは、`highlightColor`プロパティは、`HighlightDirective`の`@Input()`プロパティです。エイリアスなしで適用されたことがわかりました。

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (color)" region="color"></code-example>

エイリアスありで適用されたこともわかりました。

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (color)" region="color"></code-example>

どちらも場合でも、`@Input()`デコレーターは、Angularにこのプロパティが _パブリック_ であり、親コンポーネントによるバインドが可能であることを伝えています。`@Input()`がなければ、Angularはプロパティへバインドすることを拒否します。

テンプレートHTMLをコンポーネントへバインドしてから、`@Input()`を使用したことはありません。
その違いは何でしょうか？

違いは、信頼の問題です。Angularは、コンポーネントのテンプレートをコンポーネントに属するものとして扱います。コンポーネントとそのテンプレートは、暗黙のうちに互いに信頼し合います。したがって、コンポーネントの独自のテンプレートは、`@Input()`デコレーターの有無にかかわらず、そのコンポーネントの任意のプロパティへバインドすることができます。

しかし、コンポーネントやディレクティブは、他のコンポーネントやディレクティブを盲目的に信頼するべきではありません。コンポーネントやディレクティブのプロパティは、デフォルトではバインディングから隠されています。それらは、Angularのバインディング機構からは _プライベート_ です。`@Input()`デコレーターで装飾されると、プロパティはAngularのバインディング機構から _パブリック_ になります。その後、他のコンポーネントやディレクティブへバインドすることができます。

バインディング内のプロパティ名の位置によって`@Input()`が必要かどうかを知ることができます。

* 等式(=)の右側のテンプレート式に表示されている場合、それはテンプレートのコンポーネントに属し、`@Input()`デコレーターは必要ありません。

* 等式(=)の左側に角括弧([])で表示されている場合、それは _他_ のコンポーネントやディレクティブに属し、そのプロパティは、`@Input()`デコレーターで飾らなければなりません。

次に、その理屈を次の例に適用します。

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (color)" region="color"></code-example>

* 右側の式の`color`プロパティは、テンプレートのコンポーネントに属します。テンプレートとそのコンポーネントは、お互いを信頼します。`color`プロパティは`@Input()`デコレーターを必要としません。

* 左側の`appHighlight`プロパティは、テンプレートのコンポーネントのプロパティではなく、`HighlightDirective`のエイリアス化されたプロパティを参照しています。これには信頼の問題があります。したがって、ディレクティブのプロパティは、`@Input()`デコレーターを持っている必要があります。
