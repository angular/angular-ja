# テンプレート構文

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }
  h4 .syntax { font-size: 100%; }
</style>

Angular アプリケーションは、ユーザーが表示して実行できる機能を管理し、これをコンポーネントクラスインスタンス(*コンポーネント*)と、そのユーザー向けテンプレートとのやりとりを通して実現します。

あなたは、モデル・ビュー・コントローラー(MVC)やモデル・ビュー・ビューモデル(MVVM)の経験から、コンポーネント/テンプレートの相対性に精通しているかもしれません。
Angular では、コンポーネントはコントローラー/ビューモデルの一部として機能し、テンプレートはビューを表現します。

このページは、Angular のテンプレート言語に関する総合的な技術文書です。
テンプレート言語の基本的な原則を解説し、あなたがどこかで出くわすかもしれない構文の多くについて、このドキュメント内で説明します。

多くのコードスニペットでポイントとコンセプトを説明しており、
それらはすべて<live-example title="テンプレート構文のライブコード"></live-example>で確認できます。


{@a html}
## テンプレート内のHTML

HTML は Angular のテンプレート言語です。
ほとんどすべての HTML 構文は有効なテンプレート構文です。
`<script>` 要素は注目すべき例外です。
スクリプトインジェクション攻撃の危険性を排除するために禁止されています。
実際には、`<script>` は無視され、ブラウザコンソールに警告が表示されます。
詳細は [セキュリティ](guide/security) のページを参照してください。

妥当なHTMLの中には、テンプレート内ではあまり意味がないものがあります。
`<html>`、`<body>`、および `<base>` 要素には有用な役割はありません。
他のほとんどすべては有用です。

テンプレートの HTML ボキャブラリーを、新しい要素や属性として表示されるコンポーネントやディレクティブで拡張することができます。
次のセクションでは、データバインディングを通じて動的に DOM(Document Object Model)の値を取得および設定する方法を学びます。

データバインディングの最初の形式&mdash;補間&mdash;から始めて、テンプレート HTML でできることの豊富さを確認しましょう。

<hr/>

{@a interpolation}

## 補間とテンプレート式

補間を使用すると、計算された文字列を HTML 要素タグ間および属性割り当て内のテキストに組み込むことができます。
テンプレート式は、
これらの文字列を計算するために使用するものです。

補間の <live-example></live-example> では、
このセクションで説明されているすべての構文とコードスニペットを示しています。

### `{{...}}` による補間

補間では、マークアップされたテキストに埋め込まれた式を参照します。
デフォルトでは、補間は二重中括弧 `{{` と `}}` を区切り文字として使います。

次のスニペットでは、`{{ currentCustomer }}` が補間の例です。

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html"></code-example>

中括弧間のテキストは多くの場合、
コンポーネントのプロパティ名です。
Angular は、その名前を対応するコンポーネントプロパティの文字列値に置き換えます。

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html"></code-example>

上記の例では、Angular は `title` プロパティと `itemImageUrl`
プロパティを評価して空白を埋めます。最初にタイトルテキストを表示し、次に画像を表示します。

より一般的には、中括弧間のテキストは、
Angular が最初に **評価** してから **文字列に変換** する **テンプレート式** です。
次の補間の例では、2つの数を加算していることがポイントです:

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html"></code-example>

式では次の例のように `getVal()`
などのホストコンポーネントのメソッドを呼び出すことができます:

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html"></code-example>

Angular は、二重中括弧内のすべての式を評価し、式の結果を文字列に変換して、
それらを隣接するリテラル文字列とリンクします。
最後に、この合成補間の結果を **要素またはディレクティブのプロパティ** に割り当てます。

要素タグ間にその結果を挿入したり、属性に割り当てるように表示します。
ただし、補間は Angular がプロパティバインディングに変換する特別な構文です。

<div class="alert is-helpful">

`{{` および `}}` 以外のものを使用する場合は、
`Component` メタデータの
[interpolation](api/core/Component#interpolation)
オプションを使用して補間の区切り文字を設定できます。

</div>

### テンプレート式 {@a template-expressions}

テンプレート **式** は値を生成し、二重中括弧
`{{ }}` 内に表示します。
Angularは 式を実行し、それをバインディングターゲットのプロパティに割り当てます。
ターゲットは HTML 要素、コンポーネント、またはディレクティブです。

`{{1 + 1}}` 内の補間中括弧はテンプレート式 `1 + 1` を囲みます。
プロパティバインディングでは、`[property]="expression"`
のように、テンプレート式は `=` 記号の右側の引用符で囲まれます。

構文に関しては、テンプレート式は JavaScript に似ています。
いくつかの例外を除き、多くの JavaScript 式は妥当なテンプレート式です。

次のような、副作用をもつ、
または促進する JavaScript 式は使用できません:

* 代入（`=`、`+=`、`-=`、`...`）
* `new`、`typeof`、`instanceof` などの演算子
* <code>;</code> や <code>,</code> で式をつなげる
* `++` や `--` などのインクリメントおよびデクリメント演算子
* いくつかの ES2015+ 演算子

その他の JavaScript 構文との注目すべき違いは次のとおりです。

* `|` や `&` などのビット演算子はサポートされていません
* `|`、`?.` や `!` などの新しい[テンプレート式演算子](guide/template-syntax#expression-operators)を持ちます


### 式のコンテキスト

*式のコンテキスト* は通常、 _コンポーネント_ インスタンスです。
次のスニペットでは、二重中括弧内の `recommended` と、引用符内の `itemImageUrl2`
は `AppComponent` のプロパティを参照しています。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

式は
テンプレート入力変数 `let customer` <!-- link to built-in-directives#template-input-variables -->
やテンプレート参照変数 `#customerInput` <!-- link to guide/template-ref-variables -->
などの _テンプレートが持つ_
コンテキストのプロパティも参照できます。

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)"></code-example>

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)"></code-example>

式の中にある項のコンテキストは、_テンプレート変数_、ディレクティブの
_コンテキスト_ オブジェクト(ある場合)、およびコンポーネントの _メンバー_ の組み合わせです。
これらの名前空間に複数存在する名前を参照する場合は、テンプレート変数名が優先され、
その後にディレクティブの _コンテキスト_ 内の名前、
最後にコンポーネントのメンバー名が参照されます。

前の例はそのような名前の衝突を示しています。
コンポーネントは `customer` プロパティを持ち、`*ngFor` では `customer` テンプレート変数を定義しています。

<div class="alert is-helpful">

`{{customer.name}}` 内の `customer` は、コンポーネントのプロパティではなく、
テンプレート入力変数を参照しています。

テンプレート式は、`undefined`
以外のグローバル名前空間内のものを参照できません。
`window` や `document` を参照することはできません。
また、`console.log()` や `Math.max()` を呼び出すことはできず、
式のコンテキストのメンバーを参照することに制限されています。

</div>

### 式のガイドライン

テンプレート式を使う場合は、次のガイドラインにしたがってください:

* [シンプルさ](guide/template-syntax#simplicity)
* [素早い実行](guide/template-syntax#quick-execution)
* [副作用を起こさない](guide/template-syntax#no-visible-side-effects)

#### シンプルさ {@a simplicity}

複雑なテンプレート式を書くことは可能ですが、
避けることをお勧めします。

プロパティ名、またはメソッド呼び出しは標準的であるべきです、しかし、必要なときには真偽値の否定 `!` はよいでしょう。
それ以外の場合、アプリケーションとビジネスロジックをコンポーネントに限定してください。
そうすることで、コンポーネントの開発とテストが容易になります。

#### 素早い実行 {@a quick-execution}

Angular はすべての変更検知サイクルの後にテンプレート式を実行します。
変更検知サイクルは、Promise の解決、HTTP の結果、タイマーイベント、
キープレス、マウスの移動などの多くの非同期アクティビティによって引き起こされます。

特に遅いデバイスでは、式が早く終了しなければユーザー体験が低下する可能性があります。
計算コストが高い場合、値をキャッシュすることを検討してください。

#### 副作用を起こさない {@a no-visible-side-effects}

テンプレート式は、
対象のプロパティの値以外のアプリケーションの状態を変更すべきではありません。

このルールは Angular の「単方向データフロー」ポリシーに不可欠です。
コンポーネントの値を読み込むことで、他の表示された値を変えるかもしれないと決して心配すべきではありません。
ビューは1回のレンダリングパスを通して安定しているべきです。

[冪等](https://en.wikipedia.org/wiki/Idempotence)な式は、副作用がなく、
Angular の変更検知の性能を向上させるので理想的です。
Angular の項の中で冪等な式は、
その依存する値の1つが変わるまで、*常にまったく同じもの* を返します。

依存する値は、イベントループが1回転する間に変化すべきではありません。
冪等な式が文字列または数値を返す場合、2回続けて呼び出されると同じ文字列または数値を返します。式が `array` を含むオブジェクトを返す場合、2回続けて呼び出されると同じオブジェクト *参照* を返します。

<div class="alert is-helpful">

`*ngFor` に適用される振る舞いについて1つ例外があります。`*ngFor` には、繰り返しをまたいだときに、参照の違うオブジェクトを処理できる `trackBy` 機能があります。詳しくは、このガイドの [`trackBy` を使用した *ngFor](guide/template-syntax#ngfor-with-trackby) セクションを参照してください。

</div>

<!-- end of Interpolation doc -->

<hr/>

{@a template-statements}

## テンプレート文

テンプレート **文**
は、要素、コンポーネント、ディレクティブなどのバインディングターゲットによって発生した **イベント** に応答します。
テンプレート文は [イベントバインディング](guide/template-syntax#event-binding) セクションでも触れますが、
`(event)="statement"` のように `=` 記号の右側に引用符で囲まれた形で現れます。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html"></code-example>

テンプレート文には *副作用があります*。
それがイベントのポイントです。
これは、ユーザーの操作からアプリケーションの状態を更新する方法です。

イベントへの対応は、Angular の「単方向データフロー」の反対側です。
あなたは、このイベントループのターンの間に、何でも、どこでも自由に変更できます。

テンプレート式と同様に、テンプレート *文*
は JavaScript のような言語を使用します。
テンプレート文パーサーはテンプレート式パーサーとは異なり、
特に基本的な代入(`=`)と <code>;</code>による連鎖式の両方をサポートします。

ただし、特定の JavaScriptとテンプレート式の構文は許可されていません:

* <code>new</code>
* `++` や `--` などの、インクリメント、デクリメント演算子
* `+=` and `-=` などの代入演算子
* ビット演算子 `|` や `&`
* [パイプ演算子](guide/template-syntax#pipe)

### 文のコンテキスト

式と同様に、文はコンポーネントインスタンスのイベント処理メソッドなど、
文のコンテキスト内にあるものだけを参照できます。

*文* のコンテキストは通常、コンポーネントインスタンスです。
`(click)="deleteHero()"` 内の *deleteHero* は、データがバインドされたコンポーネントのメソッドです。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html"></code-example>

文のコンテキストはテンプレート自身のコンテキストのプロパティも参照します。
次の例では、テンプレートの `$event` オブジェクト、
[テンプレート入力変数](guide/template-syntax#template-input-variable) (`let hero`)、
および [テンプレート参照変数](guide/template-syntax#ref-vars) (`#heroForm`)
がコンポーネントのイベント処理メソッドに渡されています。

<code-example path="template-syntax/src/app/app.component.html" region="context-var-statement" header="src/app/app.component.html"></code-example>

テンプレートコンテキストの名前はコンポーネントコンテキストの名前よりも優先されます。
上記の `deleteHero(hero)` では、
`hero` はテンプレート入力変数であり、コンポーネントの `hero` プロパティではありません。

### 文のガイドライン

テンプレート文は、グローバル名前空間内のものを参照できません。
`window` や `document` を参照することはできません。
`console.log` や `Math.max` を呼び出すことはできません。

式と同様に、複雑なテンプレート文を書かないでください。
メソッド呼び出しまたは単純なプロパティ割り当てが一般的です。

<hr/>

{@a binding-syntax}

## バインディング構文: 概要

データバインディングは、アプリケーションのデータ値を使用して、
ユーザーに表示される内容を調整するための仕組みです。
HTML に値をプッシュしたり、プルしたりすることはできますが、
これらの雑用をバインディングフレームワークに任せることで、アプリケーションの読み書きや保守が簡単になります。
あなたはバインディングソースとターゲット HTML 要素の間のバインディングを宣言するだけで、あとはフレームワークにお任せです。

このセクションで示す構文のデモとコードスニペットについては <live-example name="binding-syntax">バインディング構文の例</live-example>を参照してください。

Angular はさまざまな種類のデータバインディングを提供します。バインディングタイプは、データフローの方向によって3つのカテゴリーに分類できます。

* _ソースからビュー_
* _ビューからソース_
* 双方向シーケンス: _ビューとソースの双方向_

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="30%">
  </col>
  <col width="50%">
  </col>
  <col width="20%">
  </col>
  <tr>
    <th>
      タイプ
    </th>
    <th>
      構文
    </th>
    <th>
      カテゴリ
    </th>

  </tr>
  <tr>
     <td>
      補間<br>
      プロパティ<br>
      属性<br>
      クラス<br>
      スタイル
    </td>
    <td>

      <code-example>
        {{expression}}
        [target]="expression"
        bind-target="expression"
      </code-example>

    </td>

    <td>
      単方向<br>データソースから<br>ビューターゲットへ
    </td>
    <tr>
      <td>
        イベント
      </td>
      <td>
        <code-example>
          (target)="statement"
          on-target="statement"
        </code-example>
      </td>

      <td>
        単方向<br>ビューターゲットから<br>データソースへ
      </td>
    </tr>
    <tr>
      <td>
        双方向
      </td>
      <td>
        <code-example>
          [(target)]="expression"
          bindon-target="expression"
        </code-example>
      </td>
      <td>
        双方向
      </td>
    </tr>
  </tr>
</table>

補間以外のバインディングタイプは、等号の左側に **ターゲット名** があり、記号(`[]`、`()`)で囲まれているか、
または接頭辞 `bind-`、`on-`、`bindon-` が前に付いています。

バインディングの *ターゲット* は、バインディングの記号 `[]`, `()`, `[()]` で囲まれたプロパティかイベントです。

すべての **ソース** ディレクティブのパブリックメンバは、自動的にバインディングできるようになっています。
テンプレートの式や文からディレクティブのメンバにアクセスするために、特別に何かをする必要はありません。


### データバインディングとHTML {@a data-binding-and-html}

通常の HTML 開発では、HTML 要素を使用して視覚的な構造を作り、
文字列定数を要素の属性に設定することによってそれらの要素を変更します。

```html
<div class="special">Plain old HTML</div>
<img src="images/item.png">
<button disabled>Save</button>
```

データバインディングを使えば、ボタンの状態などを制御することができます:

<code-example path="binding-syntax/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

バインディングの対象は、ボタンの DOM 要素の `disabled` プロパティで、属性 **ではない** ことに注意してください。
これはデータバインディング一般に適用されます。データバインディングは、DOM 要素、コンポーネント、ディレクティブの *プロパティ* に対するもので、HTML *属性* に対するものではありません。


### HTML 属性 vs. DOM プロパティ {@a html-attribute-vs-dom-property}

HTML 属性と DOM プロパティの違いは、Angular バインディングがどのように機能するかを理解する上で非常に重要です。
**属性は HTML によって定義されています。プロパティは DOM(Document Object Model)ノードからアクセスされます。**

* いくつかの HTML 属性は、プロパティへの1対1のマッピングを持っています。`id` はその一例です。

* 一部の HTML 属性には対応するプロパティがありません。`aria-*` はその一例です。

* 一部の DOM プロパティには対応する属性がありません。`textContent` はその一例です。

たとえ同じ名前だったとしても、 *HTML 属性* と *DOM プロパティ* は別物だということを肝に銘じておきましょう。
Angular での HTML 属性の役割は、要素やディレクティブの状態を初期化することだけです。

**テンプレートバインディングは *属性* ではなく *プロパティ* と *イベント* に対するものです。**

データバインディングを書くときは、対象のオブジェクトの *DOM プロパティ* と *イベント* だけを扱います。

<div class="alert is-helpful">

この一般的なルールは、属性と DOM プロパティのメンタルモデルを構築するのに役立ちます:
**属性は DOM プロパティを初期化するとその役割を終えます。
プロパティは変化します。属性は変化しません。**

このルールにはひとつだけ例外があります。
属性は `setAttribute()` で変えることができ、それによって対応する DOM プロパティも再初期化されます。

</div>

詳しくは、すべての標準 DOM 要素やそのプロパティについての API ドキュメントがある [MDN Interfaces documentation](https://developer.mozilla.org/en-US/docs/Web/API#Interfaces) を参照してください。
[`<td>` の属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td) と [`<td>` のプロパティ](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement) を見比べれば、より違いがはっきりするでしょう。
具体的には、属性のページの "DOM interface" リンクをたどることでプロパティのページに移動でき、 `HTMLTableCellElement` まで継承の階層を移動できます。


#### 例 1: `<input>`

ブラウザが `<input type="text" value="Sarah">` をレンダリングするとき、
ブラウザは `value` プロパティが "Sarah" で初期化された DOM ノードを作ります。

```html
<input type="text" value="Sarah">
```

ユーザーが `<input>` に「Sally」と入力すると、DOM 要素の `value` プロパティは「Sally」になります。
しかし、`input.getAttribute('value')` で HTML の `value` 属性を見れば分かるとおり、 *属性* は変わらず「Sarah」のままです。

HTML 属性の `value` は *初期値* を指定します。DOM の `value` プロパティは *現在* の値です。

実際に動くアプリで属性と DOM プロパティの違いを見るには、<live-example name="binding-syntax"></live-example> のバインディング構文を見てください。

#### 例 2: disabled ボタン

`disabled` 属性はもうひとつの例です。
ボタンの `disabled` *プロパティ* のデフォルトは `false` なので、ボタンは有効な状態です。

`disabled` *属性* を追加すると、その存在だけでボタンの
`disabled` *プロパティ* が `true` に初期化されるため、
ボタンは無効になります。

```html
<button disabled>Test Button</button>
```

`disabled` *属性* の追加と削除で、ボタンの無効、有効が切り換わります。
しかし *属性* の値とは無関係なため、
`<button disabled="false">Still Disabled</button>` と書いてボタンを有効にすることはできません。

ボタンの状態を制御するには `disabled` *プロパティ* を設定します。

<div class="alert is-helpful">

技術的には属性バインディング `[attr.disabled]` を設定することはできますが、値は次のように異なります。プロパティバインディングがブーリアンの値を必要とするのに対して、対応する属性バインディングは、値が `null` かそうでないかを見ています。

```html
<input [disabled]="condition ? true : false">
<input [attr.disabled]="condition ? 'disabled' : null">
```

一般的には、属性バインディングよりもプロパティバインディングを使ったほうが、ブーリアンの値なのでより直感的で、構文も短く、パフォーマンスもよいです。

</div>


実際に動くアプリで `disabled` ボタンの動作を見るには、<live-example name="binding-syntax"></live-example> のバインディング構文を見てください。この例ではコンポーネントから disabled プロパティをトグルする方法を示しています。

## バインディングタイプとターゲット {@a binding-types-and-targets}

**データバインディングのターゲット** はDOM内のものです。
バインディングタイプに応じて、ターゲットはプロパティ（要素、コンポーネント、ディレクティブ）、
イベント（要素、コンポーネント、ディレクティブ）、また時には属性の名前となります。
次の表はさまざまなバインディングタイプのターゲットをまとめたものです。

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="10%">
  </col>
  <col width="15%">
  </col>
  <col width="75%">
  </col>
  <tr>
    <th>
      タイプ
    </th>
    <th>
      ターゲット
    </th>
    <th>
      例
    </th>
  </tr>
  <tr>
    <td>
      プロパティ
    </td>
    <td>
      要素のプロパティ<br>
      コンポーネントのプロパティ<br>
      ディレクティブのプロパティ
    </td>
    <td>
      以下の <code>src</code>, <code>hero</code>, <code>ngClass</code>:
      <code-example path="template-syntax/src/app/app.component.html" region="property-binding-syntax-1"></code-example>
      <!-- For more information, see [Property Binding](guide/property-binding). -->
    </td>
  </tr>
  <tr>
    <td>
      Event
    </td>
    <td>
      要素のイベント<br>
      コンポーネントのイベント<br>
      ディレクティブのイベント
    </td>
    <td>
      以下の <code>click</code>, <code>deleteRequest</code>, <code>myClick</code>:
      <code-example path="template-syntax/src/app/app.component.html" region="event-binding-syntax-1"></code-example>
      <!-- KW--Why don't these links work in the table? -->
      <!-- <div>For more information, see [Event Binding](guide/event-binding).</div> -->
    </td>
  </tr>
  <tr>
    <td>
      双方向
    </td>
    <td>
      イベントとプロパティ
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="2-way-binding-syntax-1"></code-example>
    </td>
  </tr>
  <tr>
    <td>
      属性
    </td>
    <td>
      属性
      (例外です)
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="attribute-binding-syntax-1"></code-example>
    </td>
  </tr>
  <tr>
    <td>
      クラス
    </td>
    <td>
      <code>class</code> プロパティ
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="class-binding-syntax-1"></code-example>
    </td>
  </tr>
  <tr>
    <td>
      スタイル
    </td>
    <td>
      <code>style</code> プロパティ
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="style-binding-syntax-1"></code-example>
    </td>
  </tr>
</table>

<!-- end of binding syntax -->

<hr/>

{@a property-binding}

## Property binding `[property]`

Use property binding to _set_ properties of target elements or
directive `@Input()` decorators. For an example
demonstrating all of the points in this section, see the
<live-example name="property-binding">property binding example</live-example>.

### One-way in

Property binding flows a value in one direction,
from a component's property into a target element property.

You can't use property
binding to read or pull values out of target elements. Similarly, you cannot use
property binding to call a method on the target element.
If the element raises events, you can listen to them with an [event binding](guide/template-syntax#event-binding).

If you must read a target element property or call one of its methods,
see the API reference for [ViewChild](api/core/ViewChild) and
[ContentChild](api/core/ContentChild).

### Examples

The most common property binding sets an element property to a component
property value. An example is
binding the `src` property of an image element to a component's `itemImageUrl` property:

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

Here's an example of binding to the `colSpan` property. Notice that it's not `colspan`,
which is the attribute, spelled with a lowercase `s`.

<code-example path="property-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

For more details, see the [MDN HTMLTableCellElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement) documentation.

<!-- Add link when Attribute Binding updates are merged:
For more about `colSpan` and `colspan`, see (Attribute Binding)[guide/template-syntax]. -->

Another example is disabling a button when the component says that it `isUnchanged`:

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

Another is setting a property of a directive:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

Yet another is setting the model property of a custom component&mdash;a great way
for parent and child components to communicate:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

### Binding targets

An element property between enclosing square brackets identifies the target property.
The target property in the following code is the image element's `src` property.

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

There's also the `bind-` prefix alternative:

<code-example path="property-binding/src/app/app.component.html" region="bind-prefix" header="src/app/app.component.html"></code-example>


In most cases, the target name is the name of a property, even
when it appears to be the name of an attribute.
So in this case, `src` is the name of the `<img>` element property.

Element properties may be the more common targets,
but Angular looks first to see if the name is a property of a known directive,
as it is in the following example:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

Technically, Angular is matching the name to a directive `@Input()`,
one of the property names listed in the directive's `inputs` array
or a property decorated with `@Input()`.
Such inputs map to the directive's own properties.

If the name fails to match a property of a known directive or element, Angular reports an “unknown directive” error.

<div class="alert is-helpful">

Though the target name is usually the name of a property,
there is an automatic attribute-to-property mapping in Angular for
several common attributes. These include `class`/`className`, `innerHtml`/`innerHTML`, and
`tabindex`/`tabIndex`.

</div>


### Avoid side effects

Evaluation of a template expression should have no visible side effects.
The expression language itself, or the way you write template expressions,
helps to a certain extent;
you can't assign a value to anything in a property binding expression
nor use the increment and decrement operators.

For example, you could have an expression that invoked a property or method that had
side effects. The expression could call something like `getFoo()` where only you
know what `getFoo()` does. If `getFoo()` changes something
and you happen to be binding to that something,
Angular may or may not display the changed value. Angular may detect the
change and throw a warning error.
As a best practice, stick to properties and to methods that return
values and avoid side effects.

### Return the proper type

The template expression should evaluate to the type of value
that the target property expects.
Return a string if the target property expects a string, a number if it
expects a number, an object if it expects an object, and so on.

In the following example, the `childItem` property of the `ItemDetailComponent` expects a string, which is exactly what you're sending in the property binding:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

You can confirm this by looking in the `ItemDetailComponent` where the `@Input` type is set to a string:
<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)"></code-example>

As you can see here, the `parentItem` in `AppComponent` is a string, which the `ItemDetailComponent` expects:
<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

#### Passing in an object

The previous simple example showed passing in a string. To pass in an object,
the syntax and thinking are the same.

In this scenario, `ListItemComponent` is nested within `AppComponent` and the `item` property expects an object.

<code-example path="property-binding/src/app/app.component.html" region="pass-object" header="src/app/app.component.html"></code-example>

The `items` property is declared in the `ListItemComponent` with a type of `Item` and decorated with `@Input()`:

<code-example path="property-binding/src/app/list-item/list-item.component.ts" region="item-input" header="src/app/list-item.component.ts"></code-example>

In this sample app, an `Item` is an object that has two properties; an `id` and a `name`.

<code-example path="property-binding/src/app/item.ts" region="item-class" header="src/app/item.ts"></code-example>

While a list of items exists in another file, `mock-items.ts`, you can
specify a different item in `app.component.ts` so that the new item will render:

<code-example path="property-binding/src/app/app.component.ts" region="pass-object" header="src/app.component.ts"></code-example>

You just have to make sure, in this case, that you're supplying an array of objects because that's the type of `items` and is what the nested component, `ListItemComponent`, expects.

In this example, `AppComponent` specifies a different `item` object
(`currentItem`) and passes it to the nested `ListItemComponent`. `ListItemComponent` was able to use `currentItem` because it matches what an `Item` object is according to `item.ts`. The `item.ts` file is where
`ListItemComponent` gets its definition of an `item`.

### Remember the brackets

The brackets, `[]`, tell Angular to evaluate the template expression.
If you omit the brackets, Angular treats the string as a constant
and *initializes the target property* with that string:

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>


Omitting the brackets will render the string
`parentItem`, not the value of `parentItem`.

### One-time string initialization

You *should* omit the brackets when all of the following are true:

* The target property accepts a string value.
* The string is a fixed value that you can put directly into the template.
* This initial value never changes.

You routinely initialize attributes this way in standard HTML, and it works
just as well for directive and component property initialization.
The following example initializes the `prefix` property of the `StringInitComponent` to a fixed string,
not a template expression. Angular sets it and forgets about it.

<code-example path="property-binding/src/app/app.component.html" region="string-init" header="src/app/app.component.html"></code-example>

The `[item]` binding, on the other hand, remains a live binding to the component's `currentItem` property.

### Property binding vs. interpolation

You often have a choice between interpolation and property binding.
The following binding pairs do the same thing:

<code-example path="property-binding/src/app/app.component.html" region="property-binding-interpolation" header="src/app/app.component.html"></code-example>

Interpolation is a convenient alternative to property binding in
many cases. When rendering data values as strings, there is no
technical reason to prefer one form to the other, though readability
tends to favor interpolation. However, *when setting an element
property to a non-string data value, you must use property binding*.

### Content security

Imagine the following malicious content.

<code-example path="property-binding/src/app/app.component.ts" region="malicious-content" header="src/app/app.component.ts"></code-example>

In the component template, the content might be used with interpolation:

<code-example path="property-binding/src/app/app.component.html" region="malicious-interpolated" header="src/app/app.component.html"></code-example>

Fortunately, Angular data binding is on alert for dangerous HTML. In the above case,
the HTML displays as is, and the Javascript does not execute. Angular **does not**
allow HTML with script tags to leak into the browser, neither with interpolation
nor property binding.

In the following example, however, Angular [sanitizes](guide/security#sanitization-and-security-contexts)
the values before displaying them.

<code-example path="property-binding/src/app/app.component.html" region="malicious-content" header="src/app/app.component.html"></code-example>

Interpolation handles the `<script>` tags differently than
property binding but both approaches render the
content harmlessly. The following is the browser output
of the `evilTitle` examples.

<code-example language="bash">
"Template <script>alert("evil never sleeps")</script> Syntax" is the interpolated evil title.
"Template alert("evil never sleeps")Syntax" is the property bound evil title.
</code-example>

<hr/>
{@a other-bindings}

## Attribute, class, and style bindings

The template syntax provides specialized one-way bindings for scenarios less well-suited to property binding.

To see attribute, class, and style bindings in a functioning app, see the <live-example name="attribute-binding"></live-example> especially for this section.


### Attribute binding

Set the value of an attribute directly with an **attribute binding**. This is the only exception to the rule that a binding sets a target property and the only binding that creates and sets an attribute.

Usually, setting an element property with a [property binding](guide/template-syntax#property-binding)
is preferable to setting the attribute with a string. However, sometimes
there is no element property to bind, so attribute binding is the solution.

Consider the [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) and
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG). They are purely attributes, don't correspond to element properties, and don't set element properties. In these cases, there are no property targets to bind to.

Attribute binding syntax resembles property binding, but
instead of an element property between brackets, start with the prefix `attr`,
followed by a dot (`.`), and the name of the attribute.
You then set the attribute value, using an expression that resolves to a string,
or remove the attribute when the expression resolves to `null`.

One of the primary use cases for attribute binding
is to set ARIA attributes, as in this example:

<code-example path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

#### `colspan` and `colSpan`

Notice the difference between the `colspan` attribute and the `colSpan` property.

If you wrote something like this:

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

You'd get this error:

<code-example language="bash">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

As the message says, the `<td>` element does not have a `colspan` property. This is true
because `colspan` is an attribute&mdash;`colSpan`, with a capital `S`, is the
corresponding property. Interpolation and property binding can set only *properties*, not attributes.

Instead, you'd use property binding and write it like this:

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

</div>


<hr/>

### Class binding

Here's how to set the `class` attribute without a binding in plain HTML:

```html
<!-- standard class attribute setting -->
<div class="foo bar">Some text</div>
```

You can also add and remove CSS class names from an element's `class` attribute with a **class binding**.

To create a single class binding, start with the prefix `class` followed by a dot (`.`) and the name of the CSS class (for example, `[class.foo]="hasFoo"`). 
Angular adds the class when the bound expression is truthy, and it removes the class when the expression is falsy (with the exception of `undefined`, see [styling delegation](#styling-delegation)).

To create a binding to multiple classes, use a generic `[class]` binding without the dot (for example, `[class]="classExpr"`).
The expression can be a space-delimited string of class names, or you can format it as an object with class names as the keys and truthy/falsy expressions as the values. 
With object format, Angular will add a class only if its associated value is truthy. 

It's important to note that with any object-like expression (`object`, `Array`, `Map`, `Set`, etc), the identity of the object must change for the class list to be updated.
Updating the property without changing object identity will have no effect.

If there are multiple bindings to the same class name, conflicts are resolved using [styling precedence](#styling-precedence).

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="15%">
  </col>
  <col width="20%">
  </col>
  <col width="35%">
  </col>
  <col width="30%">
  </col>
  <tr>
    <th>
      Binding Type
    </th>
    <th>
      Syntax
    </th>
    <th>
      Input Type
    </th>
    <th>
      Example Input Values
    </th>
  </tr>
  <tr>
    <td>Single class binding</td>
    <td><code>[class.foo]="hasFoo"</code></td>
    <td><code>boolean | undefined | null</code></td>
    <td><code>true</code>, <code>false</code></td>
  </tr>
  <tr>
    <td rowspan=3>Multi-class binding</td>
    <td rowspan=3><code>[class]="classExpr"</code></td>
    <td><code>string</code></td>
    <td><code>"my-class-1 my-class-2 my-class-3"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: boolean | undefined | null}</code></td>
    <td><code>{foo: true, bar: false}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['foo', 'bar']</code></td>
  </tr>
</table>


The [NgClass](#ngclass) directive can be used as an alternative to direct `[class]` bindings. 
However, using the above class binding syntax without `NgClass` is preferred because due to improvements in class binding in Angular, `NgClass` no longer provides significant value, and might eventually be removed in the future.


<hr/>

### Style binding

Here's how to set the `style` attribute without a binding in plain HTML:

```html
<!-- standard style attribute setting -->
<div style="color: blue">Some text</div>
```

You can also set styles dynamically with a **style binding**.

To create a single style binding, start with the prefix `style` followed by a dot (`.`) and the name of the CSS style property (for example, `[style.width]="width"`). 
The property will be set to the value of the bound expression, which is normally a string.
Optionally, you can add a unit extension like `em` or `%`, which requires a number type.

<div class="alert is-helpful">

Note that a _style property_ name can be written in either
[dash-case](guide/glossary#dash-case), as shown above, or
[camelCase](guide/glossary#camelcase), such as `fontSize`.

</div>

If there are multiple styles you'd like to toggle, you can bind to the `[style]` property directly without the dot (for example, `[style]="styleExpr"`).
The expression attached to the `[style]` binding is most often a string list of styles like `"width: 100px; height: 100px;"`. 

You can also format the expression as an object with style names as the keys and style values as the values, like `{width: '100px', height: '100px'}`. 
It's important to note that with any object-like expression (`object`, `Array`, `Map`, `Set`, etc), the identity of the object must change for the class list to be updated.
Updating the property without changing object identity will have no effect.

If there are multiple bindings to the same style property, conflicts are resolved using [styling precedence rules](#styling-precedence).

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">
  <col width="15%">
  </col>
  <col width="20%">
  </col>
  <col width="35%">
  </col>
  <col width="30%">
  </col>
  <tr>
    <th>
      Binding Type
    </th>
    <th>
      Syntax
    </th>
    <th>
      Input Type
    </th>
    <th>
      Example Input Values
    </th>
  </tr>
  <tr>
    <td>Single style binding</td>
    <td><code>[style.width]="width"</code></td>
    <td><code>string | undefined | null</code></td>
    <td><code>"100px"</code></td>
  </tr>
  <tr>
  <tr>
    <td>Single style binding with units</td>
    <td><code>[style.width.px]="width"</code></td>
    <td><code>number | undefined | null</code></td>
    <td><code>100</code></td>
  </tr>
    <tr>
    <td rowspan=3>Multi-style binding</td>
    <td rowspan=3><code>[style]="styleExpr"</code></td>
    <td><code>string</code></td>
    <td><code>"width: 100px; height: 100px"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: string | undefined | null}</code></td>
    <td><code>{width: '100px', height: '100px'}</code></td>
  </tr>
  <tr>
    <td><code>Array</code><<code>string</code>></td>
    <td><code>['width', '100px']</code></td>
  </tr>
</table>

The [NgStyle](#ngstyle) directive can be used as an alternative to direct `[style]` bindings. 
However, using the above style binding syntax without `NgStyle` is preferred because due to improvements in style binding in Angular, `NgStyle` no longer provides significant value, and might eventually be removed in the future.


<hr/>

{@a styling-precedence}
### Styling Precedence

A single HTML element can have its CSS class list and style values bound to a multiple sources (for example, host bindings from multiple directives).

When there are multiple bindings to the same class name or style property, Angular uses a set of precedence rules to resolve conflicts and determine which classes or styles are ultimately applied to the element.

<div class="alert is-helpful">
<h4>Styling precedence (highest to lowest)</h4>

1. Template bindings
    1. Property binding (for example, `<div [class.foo]="hasFoo">` or `<div [style.color]="color">`)
    1. Map binding (for example, `<div [class]="classExpr">` or `<div [style]="styleExpr">`)
    1. Static value (for example, `<div class="foo">` or `<div style="color: blue">`) 
1. Directive host bindings
    1. Property binding (for example, `host: {'[class.foo]': 'hasFoo'}` or `host: {'[style.color]': 'color'}`)
    1. Map binding (for example, `host: {'[class]': 'classExpr'}` or `host: {'[style]': 'styleExpr'}`)
    1. Static value (for example, `host: {'class': 'foo'}` or `host: {'style': 'color: blue'}`)    
1. Component host bindings
    1. Property binding (for example, `host: {'[class.foo]': 'hasFoo'}` or `host: {'[style.color]': 'color'}`)
    1. Map binding (for example, `host: {'[class]': 'classExpr'}` or `host: {'[style]': 'styleExpr'}`)
    1. Static value (for example, `host: {'class': 'foo'}` or `host: {'style': 'color: blue'}`)    

</div>

The more specific a class or style binding is, the higher its precedence.

A binding to a specific class (for example, `[class.foo]`) will take precedence over a generic `[class]` binding, and a binding to a specific style (for example, `[style.bar]`) will take precedence over a generic `[style]` binding.

<code-example path="attribute-binding/src/app/app.component.html" region="basic-specificity" header="src/app/app.component.html"></code-example>

Specificity rules also apply when it comes to bindings that originate from different sources. 
It's possible for an element to have bindings in the template where it's declared, from host bindings on matched directives, and from host bindings on matched components.

Template bindings are the most specific because they apply to the element directly and exclusively, so they have the highest precedence.

Directive host bindings are considered less specific because directives can be used in multiple locations, so they have a lower precedence than template bindings.

Directives often augment component behavior, so host bindings from components have the lowest precedence. 

<code-example path="attribute-binding/src/app/app.component.html" region="source-specificity" header="src/app/app.component.html"></code-example>

In addition, bindings take precedence over static attributes. 

In the following case, `class` and `[class]` have similar specificity, but the `[class]` binding will take precedence because it is dynamic.

<code-example path="attribute-binding/src/app/app.component.html" region="dynamic-priority" header="src/app/app.component.html"></code-example>

{@a styling-delegation}
### Delegating to styles with lower precedence

It is possible for higher precedence styles to "delegate" to lower precedence styles using `undefined` values.
Whereas setting a style property to `null` ensures the style is removed, setting it to `undefined` will cause Angular to fall back to the next-highest precedence binding to that style.

For example, consider the following template: 

<code-example path="attribute-binding/src/app/app.component.html" region="style-delegation" header="src/app/app.component.html"></code-example>

Imagine that the `dirWithHostBinding` directive and the `comp-with-host-binding` component both have a `[style.width]` host binding.
In that case, if `dirWithHostBinding` sets its binding to `undefined`, the `width` property will fall back to the value of the `comp-with-host-binding` host binding.
However, if `dirWithHostBinding` sets its binding to `null`, the `width` property will be removed entirely.


{@a event-binding}

## Event binding `(event)`

Event binding allows you to listen for certain events such as
keystrokes, mouse movements, clicks, and touches. For an example
demonstrating all of the points in this section, see the <live-example name="event-binding">event binding example</live-example>.

Angular event binding syntax consists of a **target event** name
within parentheses on the left of an equal sign, and a quoted
template statement on the right.
The following event binding listens for the button's click events, calling
the component's `onSave()` method whenever a click occurs:

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">
</div>

### Target event

As above, the target is the button's click event.

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html"></code-example>

Alternatively, use the `on-` prefix, known as the canonical form:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html"></code-example>

Element events may be the more common targets, but Angular looks first to see if the name matches an event property
of a known directive, as it does in the following example:

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

If the name fails to match an element event or an output property of a known directive,
Angular reports an “unknown directive” error.


### *$event* and event handling statements

In an event binding, Angular sets up an event handler for the target event.

When the event is raised, the handler executes the template statement.
The template statement typically involves a receiver, which performs an action
in response to the event, such as storing a value from the HTML control
into a model.

The binding conveys information about the event. This information can include data values such as an event object, string, or number named `$event`.

The target event determines the shape of the `$event` object.
If the target event is a native DOM element event, then `$event` is a
[DOM event object](https://developer.mozilla.org/en-US/docs/Web/Events),
with properties such as `target` and `target.value`.

Consider this example:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

This code sets the `<input>` `value` property by binding to the `name` property.
To listen for changes to the value, the code binds to the `input`
event of the `<input>` element.
When the user makes changes, the `input` event is raised, and the binding executes
the statement within a context that includes the DOM event object, `$event`.

To update the `name` property, the changed text is retrieved by following the path `$event.target.value`.

If the event belongs to a directive&mdash;recall that components
are directives&mdash;`$event` has whatever shape the directive produces.


### Custom events with `EventEmitter`

Directives typically raise custom events with an Angular [EventEmitter](api/core/EventEmitter).
The directive creates an `EventEmitter` and exposes it as a property.
The directive calls `EventEmitter.emit(payload)` to fire an event, passing in a message payload, which can be anything.
Parent directives listen for the event by binding to this property and accessing the payload through the `$event` object.

Consider an `ItemDetailComponent` that presents item information and responds to user actions.
Although the `ItemDetailComponent` has a delete button, it doesn't know how to delete the hero. It can only raise an event reporting the user's delete request.

Here are the pertinent excerpts from that `ItemDetailComponent`:


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" header="src/app/item-detail/item-detail.component.html (template)" region="line-through"></code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest"></code-example>


The component defines a `deleteRequest` property that returns an `EventEmitter`.
When the user clicks *delete*, the component invokes the `delete()` method,
telling the `EventEmitter` to emit an `Item` object.

Now imagine a hosting parent component that binds to the `deleteRequest` event
of the `ItemDetailComponent`.

<code-example path="event-binding/src/app/app.component.html" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component"></code-example>

When the `deleteRequest` event fires, Angular calls the parent component's
`deleteItem()` method, passing the *item-to-delete* (emitted by `ItemDetail`)
in the `$event` variable.

### Template statements have side effects

Though [template expressions](guide/template-syntax#template-expressions) shouldn't have [side effects](guide/template-syntax#avoid-side-effects), template
statements usually do. The `deleteItem()` method does have
a side effect: it deletes an item.

Deleting an item updates the model, and depending on your code, triggers
other changes including queries and saving to a remote server.
These changes propagate through the system and ultimately display in this and other views.


<hr/>

{@a two-way}

## 双方向バインディング `[(...)]`

双方向バインディングを使うと、コンポーネントクラスとそのテンプレートとの間で
データを共有することができます。

このセクションで示す文法のデモやコードスニペットについては、<live-example name="two-way-binding">双方向バインディングの例</live-example> をご覧ください。

### 双方向バインディングの基本 {@a basics-of-two-way-binding}

双方向バインディングがすることは2つです:

1. 特定の要素のプロパティを設定します。
1. 要素の変更イベントをリッスンします。

Angular は、この目的のための特別な _双方向データバインディング_ の構文、`[()]` を提供しています。
`[(x)]` 構文は、プロパティバインディングの括弧 `[]`
とイベントバインディングの括弧 `()` を組み合わせたものです。

<div class="callout is-important">

<header>
  [( )] = 箱の中のバナナ
</header>

括弧が角括弧の _中_ にあることを覚えておくために *箱の中のバナナ* を思い描いてください。

</div>

`[()]` 構文は、要素が `x` という設定可能なプロパティと
対応する `xChange` というイベントを持っているときに簡単に説明できます。
このパターンに合う `SizerComponent` は次のようになります。
これは、`size` 値プロパティと、それに付随する `sizeChange` イベントを持ちます:

<code-example path="two-way-binding/src/app/sizer/sizer.component.ts" header="src/app/sizer.component.ts"></code-example>

<code-example path="two-way-binding/src/app/sizer/sizer.component.html" header="src/app/sizer.component.html"></code-example>

`size` の初期値は、プロパティバインディングからの入力値です。
ボタンをクリックすると、
最小値/最大値の制限内で `size` が増減し、
調整されたサイズで `sizeChange` イベントが発生（発行）します。

`AppComponent.fontSizePx` が `SizerComponent` に双方向でバインドされている例は次のようになります:

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-1)" region="two-way-1"></code-example>

`AppComponent.fontSizePx` は、`SizerComponent.size` の初期値を与えます。

<code-example path="two-way-binding/src/app/app.component.ts" header="src/app/app.component.ts" region="font-size"></code-example>

ボタンをクリックすると、双方向バインディングによって `AppComponent.fontSizePx` が更新されます。
変更された `AppComponent.fontSizePx` 値は _スタイル_ バインディングに流れ込み、
表示されるテキストが大きくなったり小さくなったりします。

双方向バインディングの構文は、実際には _プロパティ_ バインディングと _イベント_ バインディングの単なる糖衣構文です。
Angular は次のように `SizerComponent` バインディングを _デシュガー_ します:

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-2)" region="two-way-2"></code-example>

`$event` 変数には、`SizerComponent.sizeChange` イベントのペイロードが含まれています。
ユーザーがボタンをクリックすると、Angular は `$event` 値を `AppComponent.fontSizePx` に割り当てます。

### フォームでの双方向バインディング {@a two-way-binding-in-forms}

双方向バインディングの構文は、プロパティとイベントを
別々にバインドするのに比べて非常に便利です。
`<input>` や `<select>` のような HTML の
form 要素を使って双方向バインディングを使うと便利です。
ただし、`x` 値および `xChange` イベントパターンに従うネイティブ HTML 要素はありません。

フォームでの双方向バインディングについての詳細は
Angular [NgModel](guide/template-syntax#ngModel) を参照してください.

<hr/>

{@a directives}

## Built-in directives

Angular offers two kinds of built-in directives: attribute
directives and structural directives. This segment reviews some of the most common built-in directives,
classified as either [_attribute_ directives](guide/template-syntax#attribute-directives) or [_structural_ directives](guide/template-syntax#structural-directives) and has its own <live-example name="built-in-directives">built-in directives example</live-example>.

For more detail, including how to build your own custom directives, see [Attribute Directives](guide/attribute-directives) and [Structural Directives](guide/structural-directives).

<hr/>

{@a attribute-directives}

### Built-in attribute directives

Attribute directives listen to and modify the behavior of
other HTML elements, attributes, properties, and components.
You usually apply them to elements as if they were HTML attributes, hence the name.

Many NgModules such as the [`RouterModule`](guide/router "Routing and Navigation")
and the [`FormsModule`](guide/forms "Forms") define their own attribute directives.
The most common attribute directives are as follows:

* [`NgClass`](guide/template-syntax#ngClass)&mdash;adds and removes a set of CSS classes.
* [`NgStyle`](guide/template-syntax#ngStyle)&mdash;adds and removes a set of HTML styles.
* [`NgModel`](guide/template-syntax#ngModel)&mdash;adds two-way data binding to an HTML form element.

<hr/>

{@a ngClass}

### `NgClass`

Add or remove several CSS classes simultaneously with `ngClass`.

<code-example path="built-in-directives/src/app/app.component.html" region="special-div" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

To add or remove a *single* class, use [class binding](guide/template-syntax#class-binding) rather than `NgClass`.

</div>

Consider a `setCurrentClasses()` component method that sets a component property,
`currentClasses`, with an object that adds or removes three classes based on the
`true`/`false` state of three other component properties. Each key of the object is a CSS class name; its value is `true` if the class should be added,
`false` if it should be removed.

<code-example path="built-in-directives/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts"></code-example>

Adding an `ngClass` property binding to `currentClasses` sets the element's classes accordingly:

<code-example path="built-in-directives/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Remember that in this situation you'd call `setCurrentClasses()`,
both initially and when the dependent properties change.

</div>

<hr/>

{@a ngStyle}

### `NgStyle`

Use `NgStyle` to set many inline styles simultaneously and dynamically, based on the state of the component.

#### Without `NgStyle`

For context, consider setting a *single* style value with [style binding](guide/template-syntax#style-binding), without `NgStyle`.

<code-example path="built-in-directives/src/app/app.component.html" region="without-ng-style" header="src/app/app.component.html"></code-example>

However, to set *many* inline styles at the same time, use the `NgStyle` directive.

The following is a `setCurrentStyles()` method that sets a component
property, `currentStyles`, with an object that defines three styles,
based on the state of three other component properties:

<code-example path="built-in-directives/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts"></code-example>

Adding an `ngStyle` property binding to `currentStyles` sets the element's styles accordingly:

<code-example path="built-in-directives/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Remember to call `setCurrentStyles()`, both initially and when the dependent properties change.

</div>


<hr/>

{@a ngModel}

### `[(ngModel)]`: Two-way binding

The `NgModel` directive allows you to display a data property and
update that property when the user makes changes. Here's an example:

<code-example path="built-in-directives/src/app/app.component.html" header="src/app/app.component.html (NgModel example)" region="NgModel-1"></code-example>


#### Import `FormsModule` to use `ngModel`

Before using the `ngModel` directive in a two-way data binding,
you must import the `FormsModule` and add it to the NgModule's `imports` list.
Learn more about the `FormsModule` and `ngModel` in [Forms](guide/forms#ngModel).

Remember to import the `FormsModule` to make `[(ngModel)]` available as follows:

<code-example path="built-in-directives/src/app/app.module.ts" header="src/app/app.module.ts (FormsModule import)" region="import-forms-module"></code-example>


You could achieve the same result with separate bindings to
the `<input>` element's  `value` property and `input` event:

<code-example path="built-in-directives/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html"></code-example>

To streamline the syntax, the `ngModel` directive hides the details behind its own `ngModel` input and `ngModelChange` output properties:

<code-example path="built-in-directives/src/app/app.component.html" region="NgModelChange" header="src/app/app.component.html"></code-example>

The `ngModel` data property sets the element's value property and the `ngModelChange` event property
listens for changes to the element's value.

#### `NgModel` and value accessors

The details are specific to each kind of element and therefore the `NgModel` directive only works for an element
supported by a [ControlValueAccessor](api/forms/ControlValueAccessor)
that adapts an element to this protocol.
Angular provides *value accessors* for all of the basic HTML form elements and the
[Forms](guide/forms) guide shows how to bind to them.

You can't apply `[(ngModel)]` to a non-form native element or a
third-party custom component until you write a suitable value accessor. For more information, see
the API documentation on [DefaultValueAccessor](https://angular.io/api/forms/DefaultValueAccessor).

You don't need a value accessor for an Angular component that
you write because you can name the value and event properties
to suit Angular's basic [two-way binding syntax](guide/template-syntax#two-way)
and skip `NgModel` altogether.
The `sizer` in the
[Two-way Binding](guide/template-syntax#two-way) section is an example of this technique.

Separate `ngModel` bindings are an improvement over binding to the
element's native properties, but you can streamline the binding with a
single declaration using the `[(ngModel)]` syntax:

<code-example path="built-in-directives/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html"></code-example>

This `[(ngModel)]` syntax can only _set_ a data-bound property.
If you need to do something more, you can write the expanded form;
for example, the following changes the `<input>` value to uppercase:

<code-example path="built-in-directives/src/app/app.component.html" region="uppercase" header="src/app/app.component.html"></code-example>

Here are all variations in action, including the uppercase version:

<div class="lightbox">
  <img src='generated/images/guide/built-in-directives/ng-model-anim.gif' alt="NgModel variations">
</div>

<hr/>

{@a structural-directives}

## Built-in _structural_ directives

Structural directives are responsible for HTML layout.
They shape or reshape the DOM's structure, typically by adding, removing, and manipulating
the host elements to which they are attached.

This section is an introduction to the common built-in structural directives:

* [`NgIf`](guide/template-syntax#ngIf)&mdash;conditionally creates or destroys subviews from the template.
* [`NgFor`](guide/template-syntax#ngFor)&mdash;repeat a node for each item in a list.
* [`NgSwitch`](guide/template-syntax#ngSwitch)&mdash;a set of directives that switch among alternative views.

<div class="alert is-helpful">

The deep details of structural directives are covered in the
[Structural Directives](guide/structural-directives) guide,
which explains the following:

* Why you
[prefix the directive name with an asterisk (\*)](guide/structural-directives#the-asterisk--prefix).
* Using [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
to group elements when there is no suitable host element for the directive.
* How to write your own structural directive.
* That you can only apply [one structural directive](guide/structural-directives#one-per-element "one per host element") to an element.

</div>

<hr/>

{@a ngIf}

### NgIf

You can add or remove an element from the DOM by applying an `NgIf` directive to
a host element.
Bind the directive to a condition expression like `isActive` in this example.

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Don't forget the asterisk (`*`) in front of `ngIf`. For more information
on the asterisk, see the [asterisk (*) prefix](guide/structural-directives#the-asterisk--prefix) section of
[Structural Directives](guide/structural-directives).

</div>

When the `isActive` expression returns a truthy value, `NgIf` adds the
`ItemDetailComponent` to the DOM.
When the expression is falsy, `NgIf` removes the `ItemDetailComponent`
from the DOM, destroying that component and all of its sub-components.


#### Show/hide vs. `NgIf`

Hiding an element is different from removing it with `NgIf`.
For comparison, the following example shows how to control
the visibility of an element with a
[class](guide/template-syntax#class-binding) or [style](guide/template-syntax#style-binding) binding.

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html"></code-example>

When you hide an element, that element and all of its descendants remain in the DOM.
All components for those elements stay in memory and
Angular may continue to check for changes.
You could be holding onto considerable computing resources and degrading performance
unnecessarily.

`NgIf` works differently. When `NgIf` is `false`, Angular removes the element and its descendants from the DOM.
It destroys their components, freeing up resources, which
results in a better user experience.

If you are hiding large component trees, consider `NgIf` as a more
efficient alternative to showing/hiding.

<div class="alert is-helpful">

For more information on `NgIf` and `ngIfElse`, see the [API documentation about NgIf](api/common/NgIf).

</div>

#### Guard against null

Another advantage of `ngIf` is that you can use it to guard against null. Show/hide
is best suited for very simple use cases, so when you need a guard, opt instead for `ngIf`. Angular will throw an error if a nested expression tries to access a property of `null`.

The following shows `NgIf` guarding two `<div>`s.
The `currentCustomer` name appears only when there is a `currentCustomer`.
The `nullCustomer` will not be displayed as long as it is `null`.

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html"></code-example>

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2b" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

See also the
[safe navigation operator](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)") below.

</div>
<hr/>

{@a ngFor}
### `NgFor`

`NgFor` is a repeater directive&mdash;a way to present a list of items.
You define a block of HTML that defines how a single item should be displayed
and then you tell Angular to use that block as a template for rendering each item in the list.
The text assigned to `*ngFor` is the instruction that guides the repeater process.

The following example shows `NgFor` applied to a simple `<div>`. (Don't forget the asterisk (`*`) in front of `ngFor`.)

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html"></code-example>

You can also apply an `NgFor` to a component element, as in the following example.

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html"></code-example>

{@a microsyntax}

<div class="callout is-critical">
<header>*ngFor microsyntax</header>

The string assigned to `*ngFor` is not a [template expression](guide/template-syntax#template-expressions). Rather,
it's a *microsyntax*&mdash;a little language of its own that Angular interprets.
The string `"let item of items"` means:

> *Take each item in the `items` array, store it in the local `item` looping variable, and
make it available to the templated HTML for each iteration.*

Angular translates this instruction into an `<ng-template>` around the host element,
then uses this template repeatedly to create a new set of elements and bindings for each `item`
in the list.
For more information about microsyntax, see the [Structural Directives](guide/structural-directives#microsyntax) guide.

</div>


{@a template-input-variable}

{@a template-input-variables}

#### Template input variables

The `let` keyword before `item` creates a template input variable called `item`.
The `ngFor` directive iterates over the `items` array returned by the parent component's `items` property
and sets `item` to the current item from the array during each iteration.

Reference `item` within the `ngFor` host element
as well as within its descendants to access the item's properties.
The following example references `item` first in an interpolation
and then passes in a binding to the `item` property of the `<app-item-detail>` component.

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html"></code-example>

For more information about template input variables, see
[Structural Directives](guide/structural-directives#template-input-variable).

#### `*ngFor` with `index`

The `index` property of the `NgFor` directive context
returns the zero-based index of the item in each iteration.
You can capture the `index` in a template input variable and use it in the template.

The next example captures the `index` in a variable named `i` and displays it with the item name.

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`NgFor` is implemented by the `NgForOf` directive. Read more about the other `NgForOf` context values such as `last`, `even`,
and `odd` in the [NgForOf API reference](api/common/NgForOf).

</div>

{@a trackBy}
#### *ngFor with `trackBy`

If you use `NgFor` with large lists, a small change to one item, such as removing or adding an item, can trigger a cascade of DOM manipulations. For example, re-querying the server could reset a list with all new item objects, even when those items were previously displayed. In this case, Angular sees only a fresh list of new object references and has no choice but to replace the old DOM elements with all new DOM elements.

You can make this more efficient with `trackBy`.
Add a method to the component that returns the value `NgFor` should track.
In this case, that value is the hero's `id`. If the `id` has already been rendered,
Angular keeps track of it and doesn't re-query the server for the same `id`.

<code-example path="built-in-directives/src/app/app.component.ts" region="trackByItems" header="src/app/app.component.ts"></code-example>

In the microsyntax expression, set `trackBy` to the `trackByItems()` method.

<code-example path="built-in-directives/src/app/app.component.html" region="trackBy" header="src/app/app.component.html"></code-example>

Here is an illustration of the `trackBy` effect.
"Reset items" creates new items with the same `item.id`s.
"Change ids" creates new items with new `item.id`s.

* With no `trackBy`, both buttons trigger complete DOM element replacement.
* With `trackBy`, only changing the `id` triggers element replacement.

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngfor-trackby.gif" alt="Animation of trackBy">
</div>


<div class="alert is-helpful">

Built-in directives use only public APIs; that is,
they do not have special access to any private APIs that other directives can't access.

</div>

<hr/>

{@a ngSwitch}
## The `NgSwitch` directives

NgSwitch is like the JavaScript `switch` statement.
It displays one element from among several possible elements, based on a switch condition.
Angular puts only the selected element into the DOM.
<!-- API Flagged -->
`NgSwitch` is actually a set of three, cooperating directives:
`NgSwitch`, `NgSwitchCase`, and `NgSwitchDefault` as in the following example.

 <code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html"></code-example>

<figure>
  <img src="generated/images/guide/built-in-directives/ngswitch.gif" alt="Animation of NgSwitch">
</figure>

`NgSwitch` is the controller directive. Bind it to an expression that returns
the *switch value*, such as `feature`. Though the `feature` value in this
example is a string, the switch value can be of any type.

**Bind to `[ngSwitch]`**. You'll get an error if you try to set `*ngSwitch` because
`NgSwitch` is an *attribute* directive, not a *structural* directive.
Rather than touching the DOM directly, it changes the behavior of its companion directives.

**Bind to `*ngSwitchCase` and `*ngSwitchDefault`**.
The `NgSwitchCase` and `NgSwitchDefault` directives are _structural_ directives
because they add or remove elements from the DOM.

* `NgSwitchCase` adds its element to the DOM when its bound value equals the switch value and removes
its bound value when it doesn't equal the switch value.

* `NgSwitchDefault` adds its element to the DOM when there is no selected `NgSwitchCase`.

The switch directives are particularly useful for adding and removing *component elements*.
This example switches among four `item` components defined in the `item-switch.components.ts` file.
Each component has an `item` [input property](guide/template-syntax#inputs-outputs "Input property")
which is bound to the `currentItem` of the parent component.

Switch directives work as well with native elements and web components too.
For example, you could replace the `<app-best-item>` switch case with the following.

<code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html"></code-example>

<hr/>

{@a template-reference-variable}

{@a template-reference-variables--var-}

{@a ref-vars}

{@a ref-var}

## Template reference variables (`#var`)

A **template reference variable** is often a reference to a DOM element within a template.
It can also refer to a directive (which contains a component), an element, [TemplateRef](api/core/TemplateRef), or a <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web component</a>.

For a demonstration of the syntax and code snippets in this section, see the <live-example name="template-reference-variables">template reference variables example</live-example>.


Use the hash symbol (#) to declare a reference variable.
The following reference variable, `#phone`, declares a `phone` variable on an `<input>` element.

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

You can refer to a template reference variable anywhere in the component's template.
Here, a `<button>` further down the template refers to the `phone` variable.

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

<h3 class="no-toc">How a reference variable gets its value</h3>

In most cases, Angular sets the reference variable's value to the element on which it is declared.
In the previous example, `phone` refers to the phone number `<input>`.
The button's click handler passes the `<input>` value to the component's `callPhone()` method.

The `NgForm` directive can change that behavior and set the value to something else. In the following example, the template reference variable, `itemForm`, appears three times separated
by HTML.

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

The reference value of itemForm, without the ngForm attribute value, would be
the [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement).
There is, however, a difference between a Component and a Directive in that a `Component`
will be referenced without specifying the attribute value, and a `Directive` will not
change the implicit reference (that is, the element).



However, with `NgForm`, `itemForm` is a reference to the [NgForm](api/forms/NgForm "API: NgForm")
directive with the ability to track the value and validity of every control in the form.

The native `<form>` element doesn't have a `form` property, but the `NgForm` directive does, which allows disabling the submit button
if the `itemForm.form.valid` is invalid and passing the entire form control tree
to the parent component's `onSubmit()` method.

<h3 class="no-toc">Template reference variable considerations</h3>

A template _reference_ variable (`#phone`) is not the same as a template _input_ variable (`let phone`) such as in an [`*ngFor`](guide/template-syntax#template-input-variable).
See [_Structural Directives_](guide/structural-directives#template-input-variable) for more information.

The scope of a reference variable is the entire template. So, don't define the same variable name more than once in the same template as the runtime value will be unpredictable.

#### Alternative syntax

You can use the `ref-` prefix alternative to `#`.
This example declares the `fax` variable as `ref-fax` instead of `#fax`.


<code-example path="template-reference-variables/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html"></code-example>


<hr/>

{@a inputs-outputs}

## `@Input()` and `@Output()` properties

`@Input()` and `@Output()` allow Angular to share data between the parent context
and child directives or components. An `@Input()` property is writable
while an `@Output()` property is observable.

Consider this example of a child/parent relationship:

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

Here, the `<child-component>` selector, or child directive, is embedded
within a `<parent-component>`, which serves as the child's context.

`@Input()` and `@Output()` act as
the API, or application programming interface, of the child
component in that they allow the child to
communicate with the parent. Think of `@Input()` and `@Output()` like ports
or doorways&mdash;`@Input()` is the doorway into the component allowing data
to flow in while `@Output()` is the doorway out of the component, allowing the
child component to send data out.

This section about `@Input()` and `@Output()` has its own <live-example name="inputs-outputs"></live-example>. The following subsections highlight
key points in the sample app.

<div class="alert is-helpful">

#### `@Input()` and `@Output()` are independent

Though `@Input()` and `@Output()` often appear together in apps, you can use
them separately. If the nested
component is such that it only needs to send data to its parent, you wouldn't
need an `@Input()`, only an `@Output()`. The reverse is also true in that if the
child only needs to receive data from the parent, you'd only need `@Input()`.

</div>

{@a input}

## How to use `@Input()`

Use the `@Input()` decorator in a child component or directive to let Angular know
that a property in that component can receive its value from its parent component.
It helps to remember that the data flow is from the perspective of the
child component. So an `@Input()` allows data to be input _into_ the
child component from the parent component.


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="Input data flow diagram">
</div>

To illustrate the use of `@Input()`, edit these parts of your app:

* The child component class and template
* The parent component class and template


### In the child

To use the `@Input()` decorator in a child component class, first import
`Input` and then decorate the property with `@Input()`:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>


In this case, `@Input()` decorates the property <code class="no-auto-link">item</code>, which has
a type of `string`, however, `@Input()` properties can have any type, such as
`number`, `string`, `boolean`, or `object`. The value for `item` will come from the parent component, which the next section covers.

Next, in the child component template, add the following:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>



### In the parent

The next step is to bind the property in the parent component's template.
In this example, the parent component template is `app.component.html`.

First, use the child's selector, here `<app-item-detail>`, as a directive within the
parent component template. Then, use [property binding](guide/template-syntax#property-binding)
to bind the property in the child to the property of the parent.

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

Next, in the parent component class, `app.component.ts`, designate a value for `currentItem`:

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

With `@Input()`, Angular passes the value for `currentItem` to the child so that `item` renders as `Television`.

The following diagram shows this structure:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="Property binding diagram">
</div>

The target in the square brackets, `[]`, is the property you decorate
with `@Input()` in the child component. The binding source, the part
to the right of the equal sign, is the data that the parent
component passes to the nested component.

The key takeaway is that when binding to a child component's property in a parent component&mdash;that is, what's
in square brackets&mdash;you must
decorate the property with `@Input()` in the child component.

<div class="alert is-helpful">

#### `OnChanges` and `@Input()`

To watch for changes on an `@Input()` property, use
`OnChanges`, one of Angular's [lifecycle hooks](guide/lifecycle-hooks#onchanges).
`OnChanges` is specifically designed to work with properties that have the
`@Input()` decorator. See the [`OnChanges`](guide/lifecycle-hooks#onchanges) section of the [Lifecycle Hooks](guide/lifecycle-hooks) guide for more details and examples.

</div>

{@a output}

## How to use `@Output()`

Use the `@Output()` decorator in the child component or directive to allow data to flow from
the child _out_ to the parent.

An `@Output()` property should normally be initialized to an Angular [`EventEmitter`](api/core/EventEmitter) with values flowing out of the component as [events](#event-binding).


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="Output diagram">
</div>

Just like with `@Input()`, you can use `@Output()`
on a property of the child component but its type should be
`EventEmitter`.

`@Output()` marks a property in a child component as a doorway
through which data can travel from the child to the parent.
The child component then has to raise an event so the
parent knows something has changed. To raise an event,
`@Output()` works hand in hand with `EventEmitter`,
which is a class in `@angular/core` that you
use to emit custom events.

When you use `@Output()`, edit these parts of your app:

* The child component class and template
* The parent component class and template


The following example shows how to set up an `@Output()` in a child
component that pushes data you enter in an HTML `<input>` to an array in the
parent component.

<div class="alert is-helpful">

The HTML element `<input>` and the Angular decorator `@Input()`
are different. This documentation is about component communication in Angular as it pertains to `@Input()` and `@Output()`. For more information on the HTML element `<input>`, see the [W3C Recommendation](https://www.w3.org/TR/html5/sec-forms.html#the-input-element).

</div>

### In the child

This example features an `<input>` where a user can enter a value and click a `<button>` that raises an event. The `EventEmitter` then relays the data to the parent component.

First, be sure to import `Output` and `EventEmitter`
in the child component class:

```js
import { Output, EventEmitter } from '@angular/core';

```

Next, still in the child, decorate a property with `@Output()` in the component class.
The following example `@Output()` is called `newItemEvent` and its type is
`EventEmitter`, which means it's an event.


<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

The different parts of the above declaration are as follows:

* `@Output()`&mdash;a decorator function marking the property as a way for data to go from the child to the parent
* `newItemEvent`&mdash;the name of the `@Output()`
* `EventEmitter<string>`&mdash;the `@Output()`'s type
* `new EventEmitter<string>()`&mdash;tells Angular to create a new event emitter and that the data it emits is of type string. The type could be any type, such as `number`, `boolean`, and so on. For more information on `EventEmitter`, see the [EventEmitter API documentation](api/core/EventEmitter).

Next, create an `addNewItem()` method in the same component class:

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

The `addNewItem()` function uses the `@Output()`, `newItemEvent`,
to raise an event in which it emits the value the user
types into the `<input>`. In other words, when
the user clicks the add button in the UI, the child lets the parent know
about the event and gives that data to the parent.

#### In the child's template

The child's template has two controls. The first is an HTML `<input>` with a
[template reference variable](guide/template-syntax#ref-var) , `#newItem`,
where the user types in an item name. Whatever the user types
into the `<input>` gets stored in the `#newItem` variable.

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

The second element is a `<button>`
with an [event binding](guide/template-syntax#event-binding). You know it's
an event binding because the part to the left of the equal
sign is in parentheses, `(click)`.

The `(click)` event is bound to the `addNewItem()` method in the child component class which
takes as its argument whatever the value of `#newItem` is.

Now the child component has an `@Output()`
for sending data to the parent and a method for raising an event.
The next step is in the parent.

### In the parent

In this example, the parent component is `AppComponent`, but you could use
any component in which you could nest the child.

The `AppComponent` in this example features a list of `items`
in an array and a method for adding more items to the array.

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

The `addItem()` method takes an argument in the form of a string
and then pushes, or adds, that string to the `items` array.

#### In the parent's template

Next, in the parent's template, bind the parent's
method to the child's event. Put the child selector, here `<app-item-output>`,
within the parent component's
template, `app.component.html`.

<code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

The event binding, `(newItemEvent)='addItem($event)'`, tells
Angular to connect the event in the child, `newItemEvent`, to
the method in the parent, `addItem()`, and that the event that the child
is notifying the parent about is to be the argument of `addItem()`.
In other words, this is where the actual hand off of data takes place.
The `$event` contains the data that the user types into the `<input>`
in the child template UI.

Now, in order to see the `@Output()` working, add the following to the parent's template:

```html
  <ul>
    <li *ngFor="let item of items">{{item}}</li>
  </ul>
  ```

The `*ngFor` iterates over the items in the `items` array. When you enter a value in the child's `<input>` and click the button, the child emits the event and the parent's `addItem()` method pushes the value to the `items` array and it renders in the list.


## `@Input()` and `@Output()` together

You can use `@Input()` and `@Output()` on the same child component as in the following:

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

The target, `item`, which is an `@Input()` property in the child component class, receives its value from the parent's property, `currentItem`. When you click delete, the child component raises an event, `deleteRequest`, which is the argument for the parent's `crossOffItem()` method.

The following diagram is of an `@Input()` and an `@Output()` on the same
child component and shows the different parts of each:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="Input/Output diagram">
</div>

As the diagram shows, use inputs and outputs together in the same manner as using them separately. Here, the child selector is `<app-input-output>` with `item` and `deleteRequest` being `@Input()` and `@Output()`
properties in the child component class. The property `currentItem` and the method `crossOffItem()` are both in the parent component class.

To combine property and event bindings using the banana-in-a-box
syntax, `[()]`, see [Two-way Binding](guide/template-syntax#two-way).

For more detail on how these work, see the previous sections on [Input](guide/template-syntax#input) and [Output](guide/template-syntax#output). To see it in action, see the <live-example name="inputs-outputs">Inputs and Outputs Example</live-example>.

## `@Input()` and `@Output()` declarations

Instead of using the `@Input()` and `@Output()` decorators
to declare inputs and outputs, you can identify
members in the `inputs` and `outputs` arrays
of the directive metadata, as in this example:

<code-example path="inputs-outputs/src/app/in-the-metadata/in-the-metadata.component.ts" region="metadata" header="src/app/in-the-metadata/in-the-metadata.component.ts"></code-example>

While declaring `inputs` and `outputs` in the `@Directive` and `@Component`
metadata is possible, it is a better practice to use the `@Input()` and `@Output()`
class decorators instead, as follows:

<code-example path="inputs-outputs/src/app/input-output/input-output.component.ts" region="input-output" header="src/app/input-output/input-output.component.ts"></code-example>

See the [Decorate input and output properties](guide/styleguide#decorate-input-and-output-properties) section of the
[Style Guide](guide/styleguide) for details.



<div class="alert is-helpful">

If you get a template parse error when trying to use inputs or outputs, but you know that the
properties do indeed exist, double check
that your properties are annotated with `@Input()` / `@Output()` or that you've declared
them in an `inputs`/`outputs` array:

<code-example language="bash">
Uncaught Error: Template parse errors:
Can't bind to 'item' since it isn't a known property of 'app-item-detail'
</code-example>

</div>

{@a aliasing-io}

## Aliasing inputs and outputs

Sometimes the public name of an input/output property should be different from the internal name. While it is a best practice to avoid this situation, Angular does
offer a solution.

### Aliasing in the metadata

Alias inputs and outputs in the metadata using a colon-delimited (`:`) string with
the directive property name on the left and the public alias on the right:

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias" header="src/app/aliasing/aliasing.component.ts"></code-example>


### Aliasing with the `@Input()`/`@Output()` decorator

You can specify the alias for the property name by passing the alias name to the `@Input()`/`@Output()` decorator. The internal name remains as usual.

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias-input-output" header="src/app/aliasing/aliasing.component.ts"></code-example>


<hr/>

{@a expression-operators}

## Template expression operators

The Angular template expression language employs a subset of JavaScript syntax supplemented with a few special operators
for specific scenarios. The next sections cover three of these operators:

* [pipe](guide/template-syntax#pipe)
* [safe navigation operator](guide/template-syntax#safe-navigation-operator)
* [non-null assertion operator](guide/template-syntax#non-null-assertion-operator)

{@a pipe}

### The pipe operator (`|`)

The result of an expression might require some transformation before you're ready to use it in a binding.
For example, you might display a number as a currency, change text to uppercase, or filter a list and sort it.

Pipes are simple functions that accept an input value and return a transformed value.
They're easy to apply within template expressions, using the pipe operator (`|`):

<code-example path="template-expression-operators/src/app/app.component.html" region="uppercase-pipe" header="src/app/app.component.html"></code-example>

The pipe operator passes the result of an expression on the left to a pipe function on the right.

You can chain expressions through multiple pipes:

<code-example path="template-expression-operators/src/app/app.component.html" region="pipe-chain" header="src/app/app.component.html"></code-example>

And you can also [apply parameters](guide/pipes#parameterizing-a-pipe) to a pipe:

<code-example path="template-expression-operators/src/app/app.component.html" region="date-pipe" header="src/app/app.component.html"></code-example>

The `json` pipe is particularly helpful for debugging bindings:

<code-example path="template-expression-operators/src/app/app.component.html" region="json-pipe" header="src/app/app.component.html"></code-example>

The generated output would look something like this:

<code-example language="json">
  { "name": "Telephone",
    "manufactureDate": "1980-02-25T05:00:00.000Z",
    "price": 98 }
</code-example>

<div class="alert is-helpful">

The pipe operator has a higher precedence than the ternary operator (`?:`),
which means `a ? b : c | x` is parsed as `a ? b : (c | x)`.
Nevertheless, for a number of reasons,
the pipe operator cannot be used without parentheses in the first and second operands of `?:`.
A good practice is to use parentheses in the third operand too.

</div>


<hr/>

{@a safe-navigation-operator}

### The safe navigation operator ( `?` ) and null property paths

The Angular safe navigation operator, `?`, guards against `null` and `undefined`
values in property paths. Here, it protects against a view render failure if `item` is `null`.

<code-example path="template-expression-operators/src/app/app.component.html" region="safe" header="src/app/app.component.html"></code-example>

If `item` is `null`, the view still renders but the displayed value is blank; you see only "The item name is:" with nothing after it.

Consider the next example, with a `nullItem`.

<code-example language="html">
  The null item name is {{nullItem.name}}
</code-example>

Since there is no safe navigation operator and `nullItem` is `null`, JavaScript and Angular would throw a `null` reference error and break the rendering process of Angular:

<code-example language="bash">
  TypeError: Cannot read property 'name' of null.
</code-example>

Sometimes however, `null` values in the property
path may be OK under certain circumstances,
especially when the value starts out null but the data arrives eventually.

With the safe navigation operator, `?`, Angular stops evaluating the expression when it hits the first `null` value and renders the view without errors.

It works perfectly with long property paths such as `a?.b?.c?.d`.


<hr/>

{@a non-null-assertion-operator}

### The non-null assertion operator ( `!` )

As of Typescript 2.0, you can enforce [strict null checking](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript") with the `--strictNullChecks` flag. TypeScript then ensures that no variable is unintentionally null or undefined.

In this mode, typed variables disallow `null` and `undefined` by default. The type checker throws an error if you leave a variable unassigned or try to assign `null` or `undefined` to a variable whose type disallows `null` and `undefined`.

The type checker also throws an error if it can't determine whether a variable will be `null` or undefined at runtime. You tell the type checker not to throw an error by applying the postfix
[non-null assertion operator, !](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator").

The Angular non-null assertion operator, `!`, serves the same purpose in
an Angular template. For example, after you use [*ngIf](guide/template-syntax#ngIf)
to check that `item` is defined, you can assert that
`item` properties are also defined.

<code-example path="template-expression-operators/src/app/app.component.html" region="non-null" header="src/app/app.component.html"></code-example>

When the Angular compiler turns your template into TypeScript code,
it prevents TypeScript from reporting that `item` might be `null` or `undefined`.

Unlike the [_safe navigation operator_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?)"),
the non-null assertion operator does not guard against `null` or `undefined`.
Rather, it tells the TypeScript type checker to suspend strict `null` checks for a specific property expression.

The non-null assertion operator, `!`, is optional with the exception that you must use it when you turn on strict null checks.

<a href="#top-of-page">back to top</a>

<hr/>

{@a built-in-template-functions}

## Built-in template functions

{@a any-type-cast-function}

### The `$any()` type cast function

Sometimes a binding expression triggers a type error during [AOT compilation](guide/aot-compiler) and it is not possible or difficult to fully specify the type.
To silence the error, you can use the `$any()` cast function to cast
the expression to the [`any` type](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) as in the following example:

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html"></code-example>

When the Angular compiler turns this template into TypeScript code,
it prevents TypeScript from reporting that `bestByDate` is not a member of the `item`
object when it runs type checking on the template.

The `$any()` cast function also works with `this` to allow access to undeclared members of
the component.

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html"></code-example>

The `$any()` cast function works anywhere in a binding expression where a method call is valid.

## SVG in templates

It is possible to use SVG as valid templates in Angular. All of the template syntax below is
applicable to both SVG and HTML. Learn more in the SVG [1.1](https://www.w3.org/TR/SVG11/) and
[2.0](https://www.w3.org/TR/SVG2/) specifications.

Why would you use SVG as template, instead of simply adding it as image to your application?

When you use an SVG as the template, you are able to use directives and bindings just like with HTML
templates. This means that you will be able to dynamically generate interactive graphics.

Refer to the sample code snippet below for a syntax example:

<code-example path="template-syntax/src/app/svg.component.ts" header="src/app/svg.component.ts"></code-example>

Add the following code to your `svg.component.svg` file:

<code-example path="template-syntax/src/app/svg.component.svg" header="src/app/svg.component.svg"></code-example>

Here you can see the use of a `click()` event binding and the property binding syntax
(`[attr.fill]="fillColor"`).
