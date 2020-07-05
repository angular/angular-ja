# 構造ディレクティブ

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }

</style>



このガイドでは、Angular が **構造ディレクティブ** を使って DOM を操作する方法と、
同じことをするために独自の構造ディレクティブを作成する方法について説明します。

<live-example></live-example> から試してみてください。


{@a definition}



## 構造ディレクティブとは?

構造ディレクティブは HTML のレイアウトを担当します。
それらは、通常は要素を追加、削除、または操作することによって、
DOM の _構造_ を構築または再構成します。

他のディレクティブと同様に、_ホスト要素_ に構造ディレクティブを適用します。
ディレクティブはそのあとに、そのホスト要素とその子孫でするはずだったことをすべて行います。

構造ディレクティブは簡単に認識できます。
次の例のように、アスタリスク (*) がディレクティブ属性名の前に付きます。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif)" region="ngif"></code-example>



角括弧なし。括弧なし。`*ngIf` に文字列をセットするだけです。

このガイドでは、[アスタリスク (*) は便利な表記法](guide/structural-directives#asterisk) であること、
文字列は通常のテンプレート式ではなく
[_マイクロシンタックス_](guide/structural-directives#microsyntax) であることを学びます。
Angular はこの表記法を、`<ng-template>`
でホスト要素とその子孫を囲むマークアップにデシュガーします。
個々の構造ディレクティブは、そのテンプレートを使用して何か違うことをします。

3つの一般的なビルトイン構造ディレクティブ
([NgIf](guide/template-syntax#ngIf)、[NgFor](guide/template-syntax#ngFor)、[NgSwitch...](guide/template-syntax#ngSwitch)) は、
[_テンプレート構文_](guide/template-syntax) ガイドで説明されており、
Angular のドキュメント全体のサンプルで見られます。テンプレートの例は次のようになります:


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (built-in)" region="built-in"></code-example>



このガイドでは、それらの _使い方_ を繰り返すことはしません。しかし、
_それらがどのように機能するのか_、そして構造ディレクティブを [あなた自身で書く方法](guide/structural-directives#unless) を説明します。


<div class="callout is-helpful">



<header>
  ディレクティブのつづり
</header>


このガイド全体を通して、あなたはディレクティブが _UpperCamelCase_ と _lowerCamelCase_ の両方でつづられているのを見るでしょう。
すでに `NgIf` と `ngIf` を見たことがあるでしょう。それには理由があります。
`NgIf` はディレクティブの _クラス_ を参照します。
`ngIf` はディレクティブの _属性名_ を参照します。

ディレクティブの _クラス_ は _UpperCamelCase_ (`NgIf`) でつづられます。
ディレクティブの _属性名_ は _lowerCamelCase_ (`ngIf`) でつづられます。
このガイドでは、そのプロパティとディレクティブが何をするのかについて話すときにディレクティブ
_クラス_ を参照します。
このガイドでは、HTML テンプレートの要素にディレクティブをどのように適用するかを説明するときに
_属性名_ を参照します。


</div>



<div class="alert is-helpful">



Angular ディレクティブには他にも (1)&nbsp;コンポーネントと (2)&nbsp;属性ディレクティブの2つの種類があります。
他の場所で詳しく説明しています。

*コンポーネント* は、ネイティブの HTML 要素のように HTML の領域を管理します。
技術的にみると、それはテンプレート付きのディレクティブです。

[*属性* ディレクティブ](guide/attribute-directives)
は、要素、コンポーネント、または他のディレクティブの外観または動作を変更します。
たとえば、ビルトインの [`NgStyle`](guide/template-syntax#ngStyle)
ディレクティブは同時にいくつかの要素スタイルを変更します。

1つのホスト要素に複数の _属性_ ディレクティブを適用できます。
1つのホスト要素に適用できる _構造_ ディレクティブは [1つだけ](guide/structural-directives#one-per-element) です。


</div>



{@a ngIf}



## NgIf ケーススタディ

`NgIf` はもっとも単純で、もっとも理解しやすい構造ディレクティブです。
真偽値を返す式を受け取り、DOM のチャンク全体を追加、削除します。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-true)" region="ngif-true"></code-example>



`ngIf` ディレクティブは CSS で要素を非表示にするのではなく、DOM に物理的に追加、削除します。
ブラウザの開発者ツールを使用して DOM を調査し、その事実を確認してください。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/element-not-in-dom.png' alt="ngIf=false element not in DOM">
</div>



上のパラグラフは DOM に存在します。下の使われていないパラグラフは存在しません。
その代わりに "bindings" についてのコメントが置かれます (これについては [後](guide/structural-directives#asterisk) で詳しく説明します)。

条件が false の場合、`NgIf` はそのホスト要素を DOM から削除し、
それを DOM イベント (それが作成したアタッチメント) からデタッチし、
コンポーネントを Angular の変更検知からデタッチし、そして破棄します。
コンポーネントと DOM ノードはガベージコレクトされ、メモリを解放することができます。

### *非表示* にするのではなく *削除する* のはなぜですか？

ディレクティブは、`display` スタイルを `none` に設定することによって、不要なパラグラフを非表示にすることができます。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (display-none)" region="display-none"></code-example>



見えない間も要素は DOM に残ります。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/element-display-in-dom.png' alt="hidden element still in DOM">
</div>



非表示と削除の違いは、単純なパラグラフでは問題になりません。
ホスト要素がリソースを集中的に使用するコンポーネントにアタッチされている場合が問題です。
そのようなコンポーネントの動作は、隠れていても継続します。
コンポーネントはその DOM 要素にアタッチされたままです。それはイベントをリッスンし続けます。
Angular はデータバインディングに影響を与える可能性のある変更をチェックし続けます。
コンポーネントが何をしていようとも、それは継続します。

不可視ですが、コンポーネント (とそのすべての子孫コンポーネント) はリソースを拘束します。
パフォーマンスとメモリの負担が大きくなり、応答性が低下する可能性があり、そしてユーザーは何も見えません。

肯定的な面では、要素を再表示するのは速いです。
コンポーネントの以前の状態は保持され、表示する準備が整っています。
コンポーネントは再初期化されません (これは、コストがかかる可能性がある操作です)。
そのため、表示、非表示するのが正しいこともあります。

しかし、それらを回避するための説得力のある理由がない場合は、`NgIf`
のような構造ディレクティブを使用して、ユーザーが表示できない DOM 要素を削除し、
未使用のリソースを回復することをお勧めします。

**これらの同じ考慮事項は、組み込みであろうとカスタムであろうと、すべての構造ディレクティブに適用されます。**
構造ディレクティブを適用する前に一時停止して、要素の追加と削除、
およびコンポーネントの作成と破棄の影響を検討することをお勧めします。


{@a asterisk}

{@a the-asterisk--prefix}

## アスタリスク (*) 接頭辞

あなたは、ディレクティブ名の前にアスタリスク (*)
が付いていることに気付き、それがなぜ必要なのか、また何をするのか疑問に思ったはずです。

次では、`hero` が存在する場合、`*ngIf` はヒーローの名前を表示します。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (asterisk)" region="asterisk"></code-example>



アスタリスクはもう少し複雑なものの "糖衣構文" です。
内部的には、Angular は次のように `*ngIf` _属性_ を含んだ `<ng-template>` _要素_ に変換し、ホスト要素を囲みます。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-template)" region="ngif-template"></code-example>



* `*ngIf` ディレクティブは `<ng-template>` 要素に移動し、そこでプロパティバインディング `[ngIf]` になりました。
* class 属性を含む残りの `<div>` は、`<ng-template>` 要素内に移動しました。

最初の形式は実際にはレンダリングされず、最終結果だけが DOM に入ります。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/hero-div-in-dom.png' alt="hero div in DOM">
</div>



Angular は実際のレンダリング中に `<ng-template>` のコンテンツを利用し、
`<ng-template>` を診断コメントに置き換えました。

[`NgFor`](guide/structural-directives#ngFor) ディレクティブと [`NgSwitch...`](guide/structural-directives#ngSwitch) ディレクティブは同じパターンに従います。


{@a ngFor}



## _*ngFor_ の内側

Angular は、同じ方法で `*ngFor` をアスタリスク (*) 構文から `<ng-template>` _要素_ に変換します。

両方の方法で書かれた `NgFor` のフル機能のアプリケーションは次のようになります:


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (inside-ngfor)" region="inside-ngfor"></code-example>



これは `ngIf` よりも明らかに複雑で、そしてそれはそのとおりです。
`NgFor` ディレクティブには、このガイドに示されている `NgIf` よりも多くの機能 (必須およびオプション) があります。
最低でも `NgFor` はループ変数 (`let hero`) とリスト (`heroes`) が必要です。

これらの機能は、`ngFor` に割り当てられた Angular の [マイクロシンタックス](guide/structural-directives#microsyntax) で記述した文字列で有効にします。


<div class="alert is-helpful">



`ngFor` 文字列の _外側_ のものはすべて、
`<ng-template>` の内側に移動するときにホスト要素 (`<div>`) に残ります。
この例では、`[class.odd]="odd"` は `<div>` 上に残ったままになります。


</div>



{@a microsyntax}


## マイクロシンタックス

Angular のマイクロシンタックスを使用すると、コンパクトでわかりやすい文字列でディレクティブを設定できます。
マイクロシンタックスパーサーはその文字列を `<ng-template>` の属性に変換します。

* `let` キーワードは、テンプレート内で参照する [_テンプレート入力変数_](guide/structural-directives#template-input-variable) を宣言します。
この例の入力変数は、`hero`、`i`、および `odd` です。
パーサーは、`let hero`、`let i`、`let odd` を、
`let-hero`、`let-i`、`let-odd` という名前の変数に変換します。

* マイクロシンタックスパーサーは、すべてのディレクティブをタイトルケースにして、`ngFor`などのディレクティブの属性名の接頭辞を付けます。
たとえば、`ngFor`入力プロパティでは、
`of`と`trackBy`は、それぞれ`ngForOf`と`ngForTrackBy`になります。
このようにして、ディレクティブはリストが `heros` で、トラックごとに呼ばれる関数が `trackById` であることを認識します。

* `NgFor` ディレクティブはリストをループしながら、自身の _コンテキスト_ オブジェクトのプロパティを設定およびリセットします。
これらのプロパティには、`index`、`odd`、および`$implicit`という名前の特別なプロパティを含めることができますが、
これらに限定されません。

* `let-i` 変数と `let-odd` 変数は、`let i=index`、`let odd=odd` と定義されました。
Angular は、コンテキストの `index`、`odd` プロパティにの現在の値を設定します。

* `let-hero` のコンテキストプロパティは指定されませんでした。
それを表すソースは暗黙的です。
Angular は、現在のイテレーションで `NgFor`
がヒーローで初期化したコンテキストの `$implicit` プロパティの値を `let-hero` に設定します。

* [`NgFor`のAPI ガイド](api/common/NgForOf "API: NgFor")
では、追加の `NgFor` ディレクティブプロパティとコンテキストプロパティについて説明しています。

* `NgForOf`ディレクティブが`NgFor`を実装しています。追加の `NgForOf` ディレクティブプロパティとコンテキストプロパティ [NgForOf APIリファレンス](api/common/NgForOf) を参照してください。

### Writing your own structural directives

These microsyntax mechanisms are also available to you when you write your own structural directives.
For example, microsyntax in Angular allows you to write `<div *ngFor="let item of items">{{item}}</div>`
instead of `<ng-template ngFor let-item [ngForOf]="items"><div>{{item}}</div></ng-template>`.
The following sections provide detailed information on constraints, grammar,
and translation of microsyntax.

### Constraints

Microsyntax must meet the following requirements:

- It must be known ahead of time so that IDEs can parse it without knowing the underlying semantics of the directive or what directives are present.
- It must translate to key-value attributes in the DOM.

### Grammar

When you write your own structural directives, use the following grammar:

```
*:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )*"
```

The following tables describe each portion of the microsyntax grammar.

<!-- What should I put in the table headers? -->

<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td><code>prefix</code></td>
    <td>HTML attribute key</td>
  </tr>
  <tr>
    <td><code>key</code></td>
    <td>HTML attribute key</td>
  </tr>
  <tr>
    <td><code>local</code></td>
    <td>local variable name used in the template</td>
  </tr>
  <tr>
    <td><code>export</code></td>
    <td>value exported by the directive under a given name</td>
  </tr>
  <tr>
    <td><code>expression</code></td>
    <td>standard Angular expression</td>
  </tr>
</table>

<!-- The items in this table seem different. Is there another name for how we should describe them? -->
<table>
  <tr>
    <th></th>
  </tr>
  <tr>
    <td colspan="3"><code>keyExp = :key ":"? :expression ("as" :local)? ";"? </code></td>
  </tr>
  <tr>
    <td colspan="3"><code>let = "let" :local "=" :export ";"?</code></td>
  </tr>
  <tr>
    <td colspan="3"><code>as = :export "as" :local ";"?</code></td>
  </tr>
</table>


### Translation

A microsyntax is translated to the normal binding syntax as follows:

<!-- What to put in the table headers below? Are these correct?-->
<table>
  <tr>
    <th>Microsyntax</th>
    <th>Translation</th>
  </tr>
  <tr>
    <td><code>prefix</code> and naked <code>expression</code></td>
    <td><code>[prefix]="expression"</code></td>
  </tr>
  <tr>
    <td><code>keyExp</code></td>
    <td><code>[prefixKey] "expression"
    (let-prefixKey="export")</code>
    <br />
    Notice that the <code>prefix</code>
    is added to the <code>key</code>
    </td>
  </tr>
  <tr>
    <td><code>let</code></td>
    <td><code>let-local="export"</code></td>
  </tr>
</table>

### Microsyntax examples

The following table demonstrates how Angular desugars microsyntax.

<table>
  <tr>
    <th>Microsyntax</th>
    <th>Desugared</th>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3]"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3] as items; trackBy: myTrack; index as i"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]" let-items="ngForOf" [ngForTrackBy]="myTrack" let-i="index"&gt;</code>
    </td>
  </tr>
  <tr>
    <td><code>*ngIf="exp"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngIf="exp as value"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp" let-value="ngIf"&gt;</code></td>
  </tr>
</table>

[`NgIf` のソースコード](https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_if.ts "Source: NgIf")
と
[`NgForOf`](https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts "Source: NgForOf")
を勉強することはさらなる学習のためのよい方法です。


{@a template-input-variable}


{@a template-input-variables}


## テンプレート入力変数

_テンプレート入力変数_ は、テンプレートの単一インスタンス _内_ で参照できる変数です。この例には、`hero`、`i`、および `odd`
のようないくつかの変数が含まれます。
すべてのキーワードの前には `let` が付きます。

_テンプレート入力変数_ は、
[テンプレート _参照_ 変数](guide/template-syntax#ref-vars) と
_意味的_ にも _構文的_ にも同じでは **ありません**。

`let` キーワード (`let hero`) を使ってテンプレート _入力_ 変数を宣言します。
変数のスコープは、繰り返されるテンプレートの _単一インスタンス_ に制限されています。
他の構造ディレクティブの定義でも同じ変数名を使用できます。

変数名の前に `#` (`#var`) を付けてテンプレート _参照_ 変数を宣言します。
_参照_ 変数は、それにアタッチされた要素、コンポーネント、またはをディレクティブを参照します。
それは _テンプレート全体_ の _どこからでも_ アクセスできます。

テンプレート _入力_ 変数名とテンプレート _参照_ 変数名は、個々の名前空間を持ちます。
`let hero` 内の `hero` は、`#hero` として宣言された `hero` と同じ変数になることはありません。


{@a one-per-element}


## ホスト要素ごとに1つの構造ディレクティブ {@a one-structural-directive-per-host-element}

あるとき、あなたは指定した条件が true なものだけで HTML ブロックを繰り返したいと思います。
あなたは同じホスト要素に `*ngFor` と `*ngIf` の両方を配置 _しよう_ とするでしょう。
Angular はそれを許しません。1つの要素に適用できる構造ディレクティブは1つだけです。

その理由は単純です。構造ディレクティブは、ホスト要素とその子孫を使って複雑なことを行えます。
2つのディレクティブが同じホスト要素を要求するとき、どちらが優先されるでしょうか?
`NgIf` と `NgFor` のどちらが先になるでしょうか。
`NgIf` は `NgFor` の効果をキャンセルできるでしょうか?もしそうなら (そしてそれはそうあるべきだと思われる)、Angular は他の構造ディレクティブをキャンセルする能力をどのように一般化すべきでしょうか?

これらの質問に対する簡単な答えはありません。複数の構造ディレクティブを禁止することでその質問を無意味にします。
このユースケースでは簡単な解決策があります。`*ngFor` 要素をラップするコンテナ要素に `*ngIf` を追加します。
一方または両方の要素を[`ng-container`](guide/structural-directives#ngcontainer)にすることができるので、余分な階層の HTML を導入する必要はありません。


{@a ngSwitch}



## _NgSwitch_ ディレクティブの内側

Angular の _NgSwitch_ は、実際には `NgSwitch`、`NgSwitchCase`、および `NgSwitchDefault` の協調的なディレクティブのセットです。

例は次のようになります。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngswitch)" region="ngswitch"></code-example>



`NgSwitch` (`hero.emotion`) に割り当てられたスイッチ値は、
(もしあれば) どのスイッチケースが表示されるかを決定します。

`NgSwitch` 自体は構造ディレクティブではありません。
他の2つのスイッチディレクティブの動作を制御するのは _属性_ ディレクティブです。
それが `*ngSwitch` と書かず、`[ngSwitch]` と書く理由です。

`NgSwitchCase` と `NgSwitchDefault` _は_ 構造ディレクティブです。
アスタリスク (*) 接頭辞表記を使用してそれらを要素にアタッチします。
`NgSwitchCase` は、その値がスイッチ値と一致するとき、そのホスト要素を表示します。
兄弟の `NgSwitchCase` が1つもスイッチ値と一致しないときは、`NgSwitchDefault` がそのホスト要素を表示します。


<div class="alert is-helpful">



ディレクティブを適用する要素はその _ホスト_ 要素です。
`*ngSwitchCase` が happy のときのホスト要素は `<happy-hero>` です。
`*ngSwitchDefault` のホスト要素は `<unknown-hero>` です。


</div>



他の構造ディレクティブと同様に、`NgSwitchCase` と `NgSwitchDefault` は
`<ng-template>` 要素形式にデシュガーすることができます。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngswitch-template)" region="ngswitch-template"></code-example>



{@a prefer-asterisk}


## アスタリスク (*) 構文を優先しましょう

アスタリスク (*) 構文は、デシュガーされた形式よりも明確です。
ディレクティブをホストする要素が1つもない場合は、
[&lt;ng-container&gt;](guide/structural-directives#ng-container) を使用してください。

構造ディレクティブをテンプレート内の _属性_ または _要素_ 形式で適用することには
それほどよい理由はありませんが、Angular が `<ng-template>` を作成し、
それがどのように機能するかを理解することは重要です。あなたがあなた自身の構造ディレクティブを書くとき、`<ng-template>` を参照するでしょう。


{@a template}



## *&lt;ng-template&gt;*

&lt;ng-template&gt; は HTML をレンダリングするための Angular の要素です。
直接表示されることはありません。
実際、ビューをレンダリングする前に、Angular は `<ng-template>` とその内容をコメントに _置き換えます_。

構造ディレクティブがなく、単に `<ng-template>`
でいくつかの要素をラップすると、それらの要素は消えます。
次は、"Hip! Hip! Hooray!" というフレーズ内の中央の "Hip!" の結末です。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (template-tag)" region="template-tag"></code-example>



Angular は中央の "Hip!" を消去し、歓声と熱狂をやや抑えます。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/template-rendering.png' alt="template tag rendering">
</div>



[自身の構造ディレクティブを書く](guide/structural-directives#unless) ときに見て分かるように、
構造ディレクティブは `<ng-template>` に働かせます。


{@a ngcontainer}


{@a ng-container}



## 兄弟要素を &lt;ng-container&gt; でグルーピングする

構造ディレクティブをホストできる・すべき _ルート_ 要素がしばしばあります。
リスト要素 (`<li>`) は `NgFor` リピーターの典型的なホスト要素です。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngfor-li)" region="ngfor-li"></code-example>



ホスト要素がない場合は、通常、コンテンツを `<div>` などのネイティブ HTML コンテナ要素にラップし、
そのラッパーにディレクティブをアタッチできます。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif)" region="ngif"></code-example>



単一の _ルート_ の下に要素をグループピングするために別のコンテナ要素
(通常は `<span>` や `<div>`) を導入しても通常は無害です。
_通常は_ ... でも _いつでも_ ではありません。

CSS スタイルは新しいレイアウトを想定も対応もしないので、
グルーピングした要素はテンプレートの外観を崩すかもしれません。
たとえば、次のようなパラグラフのレイアウトがあるとします。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-span)" region="ngif-span"></code-example>



また、`<p>` 内の `<span>` に適用される CSS スタイルルールもあります。


<code-example path="structural-directives/src/app/app.component.css" header="src/app/app.component.css (p-span)" region="p-span"></code-example>



構築されたパラグラフは変にレンダリングされます。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/bad-paragraph.png' alt="spanned paragraph with bad style">
</div>



他の場所での使用を意図した `p span` のスタイルが、ここでは誤って適用されました。

もうひとつの問題: いくつかの HTML 要素はすべての直系の子が特定の型であることを要求します。
たとえば、`<select>` 要素には `<option>` の子が必要です。
_options_ を条件付きの `<div>` または `<span>` で囲むことはできません。

これを試すと、


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (select-span)" region="select-span"></code-example>



ドロップダウンは空になります。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/bad-select.png' alt="spanned options don't work">
</div>



ブラウザは、`<span>` 内に `<option>` を表示しません。

### &lt;ng-container&gt; で助ける

Angularの `<ng-container>` はスタイルやレイアウトを接続しないグルーピング要素です。
Angular は _それを DOM 内に配置しません_。

次もまた条件付きのパラグラフです。今回は `<ng-container>` を使用します。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-ngcontainer)" region="ngif-ngcontainer"></code-example>



正しくレンダリングされます。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/good-paragraph.png' alt="ngcontainer paragraph with proper style">
</div>



`<ng-container>` で _選択した_ `<option>` を条件付きで除外します。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (select-ngcontainer)" region="select-ngcontainer"></code-example>



ドロップダウンは正しく動きます。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/select-ngcontainer-anim.gif' alt="ngcontainer options work properly">
</div>

<div class="alert is-helpful">

**Note:**  ngModel ディレクティブは Angular の FormsModule の一部として宣言されていて、それを使用したい場合は Angular のモジュールメタデータの imports: [...] セクション内に FormsModule を追加する必要があります。

</div>


`<ng-container>` は Angular パーサーによって認識される構文要素です。
ディレクティブ、コンポーネント、クラス、またはインターフェースではありません。
JavaScript の `if` ブロックの中括弧のようなものです:


<code-example language="javascript">
  if (someCondition) {
    statement1;
    statement2;
    statement3;
  }

</code-example>



中括弧がなければ、JavaScript は、あなたがそれらすべてを単一ブロックとして条件付きで実行する意図があっても、
最初の文のみを実行するでしょう。
`<ng-container>` は Angular テンプレート内での同様のニーズを満たします。


{@a unless}



## 構造ディレクティブを書く

このセクションでは、`NgIf` の逆を行う
`UnlessDirective` 構造ディレクティブを作成します。
条件が `true` の場合、`NgIf` はテンプレートの内容を表示します。
`UnlessDirective` は、条件が ***false*** のときに内容を表示します。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless-1)" region="appUnless-1"></code-example>



ディレクティブの作成はコンポーネントの作成と似ています。

* (`Component` デコレーターの代わりに) `Directive` デコレーターをインポートします。

* `Input`、`TemplateRef`、および `ViewContainerRef` シンボルをインポートします。_どんな_ 構造ディレクティブでもそれらを必要とするでしょう。

* ディレクティブクラスにデコレーターを適用します。

* テンプレート内の要素に適用されたときにディレクティブを識別する CSS *属性セレクター* を設定します。

次は、始めの部分です:


<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (skeleton)" region="skeleton"></code-example>



ディレクティブの _セレクター_ は、通常、
ディレクティブの角括弧内の **属性名** `[appUnless]` です。
角括弧は CSS <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors" title="MDN: Attribute selectors">属性セレクター</a> を定義します。

ディレクティブの _属性名_は _lowerCamelCase_ でつづり、接頭辞で始める必要があります。
`ng` を使わないでください。
その接頭辞は Angular に属します。
あなたやあなたの会社に合った短いものを選んでください。この例では、接頭辞は `app` です。


ディレクティブの _クラス_ 名は [スタイルガイド](guide/styleguide#02-03 "Angular Style Guide") にしたがって `Directive` で終わります。
Angular 自身のディレクティブは違います。

### _TemplateRef_ と _ViewContainerRef_

このような単純な構造ディレクティブは、
Angular が生成した
`<ng-template>` から [_埋め込みビュー_](api/core/EmbeddedViewRef "API: EmbeddedViewRef") を作成し、
そのビューをディレクティブの元の `<p>`
ホスト要素に隣接する [_ビューコンテナ_](api/core/ViewContainerRef "API: ViewContainerRef") に挿入します。

[`TemplateRef`](api/core/TemplateRef "API: TemplateRef") で `<ng-template>`
の内容を取得し、
[`ViewContainerRef`](api/core/ViewContainerRef "API: ViewContainerRef")
を通して _ビューコンテナ_ にアクセスします。

両方をディレクティブのコンストラクターにクラスのプライベート変数として注入します。


<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (ctor)" region="ctor"></code-example>



### _appUnless_ プロパティ

ディレクティブの利用者は true/false 条件を `[appUnless]` にバインドすることを期待しています。
つまり、ディレクティブには `@Input` で装飾された `appUnless` プロパティが必要です。


<div class="alert is-helpful">



[_テンプレート構文_](guide/template-syntax#inputs-outputs) ガイドの `@Input` について参照してください。


</div>



<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (set)" region="set"></code-example>



Angular は、条件の値が変わるたびに `appUnless` プロパティをセットします。
`appUnless` プロパティが機能するために、セッターが必要です。

* 条件が falsy で、ビューが以前に作成されていない場合は、
テンプレートから _埋め込みビュー_ を作成するように _ビューコンテナ_ に指示します。

* 条件が truthy でビューが現在表示されている場合は、
コンテナをクリアしてビューも破棄します。

誰も `appUnless` プロパティを読みこまないため、ゲッターは必要ありません。

完成したディレクティブのコードは次のようになります:


<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (excerpt)" region="no-docs"></code-example>



このディレクティブを `AppModule` の `declarations` 配列に追加します。

それから、それを試すためにいくつかの HTML を作成します。


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless)" region="appUnless"></code-example>



`condition` が falsy のとき、上段 (A) のパラグラフが表示され、下段 (B) のパラグラフが削除されます。
`condition` が truthy のとき、上段 (A) パラグラフが削除され、下段 (B) パラグラフが表示されます。


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/unless-anim.gif' alt="UnlessDirective in action">
</div>

{@a directive-type-checks}

## Improving template type checking for custom directives

You can improve template type checking for custom directives by adding template guard properties to your directive definition.
These properties help the Angular template type checker find mistakes in the template at compile time, which can avoid runtime errors those mistakes can cause.

Use the type-guard properties to inform the template type checker of an expected type, thus improving compile-time type-checking for that template.

* A property `ngTemplateGuard_(someInputProperty)` lets you specify a more accurate type for an input expression within the template.
* The `ngTemplateContextGuard` static property declares the type of the template context.

This section provides example of both kinds of type-guard property.

<div class="alert is-helpful">

   For more information, see [Template type checking guide](guide/template-typecheck "Template type-checking guide").

</div>

{@a narrowing-input-types}

### Make in-template type requirements more specific with template guards

A structural directive in a template controls whether that template is rendered at run time, based on its input expression.
To help the compiler catch template type errors, you should specify as closely as possible the required type of a directive's input expression when it occurs inside the template.

A type guard function *narrows* the expected type of an input expression to a subset of types that might be passed to the directive within the template at run time.
You can provide such a function to help the type-checker infer the proper type for the expression at compile time.

For example, the `NgIf` implementation uses type-narrowing to ensure that the
template is only instantiated if the input expression to `*ngIf` is truthy.
To provide the specific type requirement, the `NgIf` directive defines a [static property `ngTemplateGuard_ngIf: 'binding'`](api/common/NgIf#static-properties).
The `binding` value is a special case for a common kind of type-narrowing where the input expression is evaluated in order to satisfy the type requirement.

To provide a more specific type for an input expression to a directive within the template, add a `ngTemplateGuard_xx` property to the directive, where the suffix to the static property name is the `@Input` field name.
The value of the property can be either a general type-narrowing function based on its return type, or the string `"binding"` as in the case of `NgIf`.

For example, consider the following structural directive that takes the result of a template expression as an input.

<code-example language="ts" header="IfLoadedDirective">
export type Loaded<T> = { type: 'loaded', data: T };
export type Loading = { type: 'loading' };
export type LoadingState<T> = Loaded<T> | Loading;
export class IfLoadedDirective<T> {
    @Input('ifLoaded') set state(state: LoadingState<T>) {}
    static ngTemplateGuard_state<T>(dir: IfLoadedDirective<T>, expr: LoadingState<T>): expr is Loaded<T> { return true; };
export interface Person {
  name: string;
}

@Component({
  template: `<div *ifLoaded="state">{{ state.data }}</div>`,
})
export class AppComponent {
  state: LoadingState<Person>;
}
</code-example>

In this example, the `LoadingState<T>` type permits either of two states, `Loaded<T>` or `Loading`. The expression used as the directive’s `state` input is of the umbrella type `LoadingState`, as it’s unknown what the loading state is at that point.

The `IfLoadedDirective` definition declares the static field `ngTemplateGuard_state`, which expresses the narrowing behavior.
Within the `AppComponent` template, the `*ifLoaded` structural directive should render this template only when `state` is actually `Loaded<Person>`.
The type guard allows the type checker to infer that the acceptable type of `state` within the template is a `Loaded<T>`, and further infer that `T` must be an instance of `Person`.

{@a narrowing-context-type}

### Typing the directive's context

If your structural directive provides a context to the instantiated template, you can properly type it inside the template by providing a static `ngTemplateContextGuard` function.
The following snippet shows an example of such a function.

<code-example language="ts" header="myDirective.ts">
@Directive({…})
export class ExampleDirective {
    // Make sure the template checker knows the type of the context with which the
    // template of this directive will be rendered
    static ngTemplateContextGuard(dir: ExampleDirective, ctx: unknown): ctx is ExampleContext { return true; };

    // …
}
</code-example>



{@a summary}



## まとめ

<live-example></live-example> の例で、このガイドのソースコードを試してダウンロードすることができます。

`src/app/` フォルダのソースは次のようになります。


<code-tabs>

  <code-pane header="app.component.ts" path="structural-directives/src/app/app.component.ts">

  </code-pane>

  <code-pane header="app.component.html" path="structural-directives/src/app/app.component.html">

  </code-pane>

  <code-pane header="app.component.css" path="structural-directives/src/app/app.component.css">

  </code-pane>

  <code-pane header="app.module.ts" path="structural-directives/src/app/app.module.ts">

  </code-pane>

  <code-pane header="hero.ts" path="structural-directives/src/app/hero.ts">

  </code-pane>

  <code-pane header="hero-switch.components.ts" path="structural-directives/src/app/hero-switch.components.ts">

  </code-pane>

  <code-pane header="unless.directive.ts" path="structural-directives/src/app/unless.directive.ts">

  </code-pane>

</code-tabs>



あなたは次のことを学びました。

* 構造ディレクティブは HTML レイアウトを操作すること。
* 適切なホスト要素がない場合は、[`<ng-container>`](guide/structural-directives#ngcontainer) をグルーピング要素として使用すること。
* Angular が [アスタリスク (*) 構文](guide/structural-directives#asterisk) を `<ng-template>` に置き換えること。
* `NgIf`、`NgFor`、および `NgSwitch `の組み込みディレクティブがどのように機能するか。
* [`<ng-template>`](guide/structural-directives#template) に展開する [_マイクロシンタックス_](guide/structural-directives#microsyntax) について。
*  [カスタム構造ディレクティブ](guide/structural-directives#unless) を書く方法 (`UnlessDirective` より)。
