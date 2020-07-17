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

テンプレート式と同様に、テンプレート *文* は JavaScript のような言語を使用します。
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

## プロパティバインディング `[property]`

プロパティバインディングを使うことで、対象の要素のプロパティや
ディレクティブの `@Input()` デコレーターを _設定_ できます。
このセクションのすべてのポイントについてのデモは
<live-example name="property-binding">プロパティバインディングの例</live-example>を参照してください。

### 内側への単方向 {@a one-way-in}

プロパティバインディングは、値をコンポーネントのプロパティから
対象の要素のプロパティへと、単方向に流します。

プロパティバインディングは、
対象の要素から値を読み出したり引き出したりすることには使えません。同様に、
プロパティバインディングで対象の要素のメソッドを呼び出すこともできません。
要素が発生するイベントは、 [イベントバインディング](guide/template-syntax#event-binding)を使ってリッスンすることができます。

対象の要素のプロパティを読んだり、メソッドを呼び出したりする必要があるときは、
API リファレンスの [ViewChild](api/core/ViewChild) や
[ContentChild](api/core/ContentChild) を参照してください。

### 例

一番よくあるプロパティバインディングは、要素のプロパティを
コンポーネントのプロパティの値に設定するものです。例では
イメージ要素の `src` プロパティを、コンポーネントの `itemImageUrl` プロパティにバインドしています:

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

これは `colSpan` プロパティのバインディングの例です。`s` を小文字で書く属性
`colspan` とは違うことに注意してください。

<code-example path="property-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

詳しくは [MDN HTMLTableCellElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement) のドキュメントを参照してください。

<!-- Add link when Attribute Binding updates are merged:
For more about `colSpan` and `colspan`, see (Attribute Binding)[guide/template-syntax]. -->

もうひとつの例ではコンポーネントが `isUnchanged` のときにボタンを無効化しています:

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

こちらはディレクティブのプロパティを設定しています:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

また、こちらはカスタムコンポーネントのモデルプロパティを設定しています&mdash;
親コンポーネントと子コンポーネントがやりとりするための優れた方法です:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

### バインディングターゲット

角括弧で囲まれた要素のプロパティは、ターゲットプロパティを識別します。
次のコードのターゲットプロパティは、img 要素の `src` プロパティです。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

代わりに `bind-` 接頭辞を使うこともできます:

<code-example path="property-binding/src/app/app.component.html" region="bind-prefix" header="src/app/app.component.html"></code-example>


ターゲットの名前が属性の名前に見えたとしても、
プロパティの名前であることがほとんどです。
この場合は `src` は `<img>` 要素のプロパティの名前です。

要素のプロパティはより一般的なターゲットかもしれませんが、
次の例のように、
Angular は最初に名前が既知のディレクティブのプロパティであるかどうかを確認します:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

技術的には、Angular は名前をディレクティブの `@Input()` 、
ディレクティブの `inputs` 配列に書かれたプロパティ名、
`@Input()` で装飾されたプロパティに対して照合します。
そのような入力はディレクティブ自身のプロパティにマッピングされます。

名前が既知のディレクティブまたは要素のプロパティと一致しない場合、Angular は “unknown directive” エラーを報告します。

<div class="alert is-helpful">

ターゲットの名前は一般にはプロパティの名前ですが、
いくつかの属性については Angular が属性-プロパティを自動でマッピングします。
`class`/`className`、`innerHtml`/`innerHTML`、`tabindex`/`tabIndex`
がその例です。

</div>


### 副作用を避ける {@a avoid-side-effects}

テンプレート式の評価には目に見える副作用はありません。
式の言語自体や、テンプレート式の記述方法は、
ある程度その役に立ちます。
プロパティバインディング式でに何か値を代入したり、
インクリメント演算子とデクリメント演算子を使用することはできません。

たとえば、式は副作用のあるプロパティやメソッドを呼び出すかもしれません。
式は `getFoo()` のようなものを呼び出すことができますが、
`getFoo()` が何をするかを知っているのはあなただけです。
もし `getFoo()` が何かを変更し、それがバインディングされていたとすると、
Angular は変更後の値を表示するかもしれないし、しないかもしれません。
Angular は変更を検知して警告のエラーを起こすかもしれません。
値を返すだけで副作用がないプロパティやメソッドを使うことが
ベストプラクティスです。

### 適切な型を返す {@a return-the-proper-type}

テンプレート式は、ターゲットプロパティが期待する値の型として
評価されるべきです。
ターゲットプロパティが文字列を期待する場合は文字列を、数値を期待する場合は数値を、
オブジェクトを期待する場合はオブジェクトを返してください。

次の例の `ItemDetailComponent` の `childItem` プロパティは文字列を期待していて、それはプロパティバインディングが送り込む型と一致しています:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

`ItemDetailComponent` を見ると `@Input` の型が文字列になっていることが確認できます:
<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)"></code-example>

`ItemDetailComponent` が期待するとおり、`AppComponent` の `parentItem` も文字列です:
<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

#### オブジェクトを渡す {@a passing-in-an-object}

先ほどの簡単な例では文字列を渡していました。
オブジェクトを渡すときの文法や考え方も似たようなものです。

`AppComponent` の中に `ItemListComponent` がネストされていて `item` プロパティがオブジェクトを期待しているものとします。

<code-example path="property-binding/src/app/app.component.html" region="pass-object" header="src/app/app.component.html"></code-example>

`items` プロパティは `ItemListComponent` の中で宣言されており、型は `Item` で `@Input()` で修飾されています:

<code-example path="property-binding/src/app/item-list/item-list.component.ts" region="item-input" header="src/app/item-list.component.ts"></code-example>

サンプルアプリでは `Item` は `id` と `name` の2つのプロパティを持ったオブジェクトです。

<code-example path="property-binding/src/app/item.ts" region="item-class" header="src/app/item.ts"></code-example>

`mock-items.ts` という別のファイルにアイテムのリストがありますが、
新しいアイテムを表示するために `app.component.ts` で別のアイテムを指定することができます:

<code-example path="property-binding/src/app/app.component.ts" region="pass-object" header="src/app.component.ts"></code-example>

この場合はオブジェクトの配列を指定していることに注意してください。この型は `items` の型であり、ネストされたコンポーネント `ListItemComponent` が求める型でもあります。

この例では `AppComponent` は別の `item` オブジェクト (`currentItems`) を指定し、
それをネストされた `ItemListComponent` に渡しています。`item.ts` に書かれた `Item` の形と `currentItems` の形が一致するため、 `ItemListComponent` はそれを使うことができます。
`item.ts` ファイルは `ItemListComponent` が `item` の定義を得るために参照しているファイルです。

### 角括弧を忘れずに {@a remember-the-brackets}

角括弧 `[]` は Angular にテンプレート式を評価するように指示します。
角括弧を省略すると Angular は文字列を定数として扱い、
その文字列で *ターゲットプロパティを初期化* します。

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>


角括弧を忘れると `parentItem` の値ではなく
`parentItem` という文字列が表示されてしまいます。

### ワンタイムの文字列の初期化 {@a one-time-string-initialization}

次のすべてが当てはまる場合は、角括弧を省略する *べき* です:

* ターゲットプロパティが文字列値を受け入れる。
* 文字列がテンプレートに直接書き込める固定値。
* この初期値が変化しない。

普段の標準の HTML ではこの方法で属性を初期化していますが、
これはディレクティブやコンポーネントのプロパティの初期化に対しても同様に機能します。
次の例では、`StringInitComponent` の `prefix` プロパティをテンプレート式ではなく固定の文字列で初期化します。
Angular はそれを設定し、それについて忘れます。

<code-example path="property-binding/src/app/app.component.html" region="string-init" header="src/app/app.component.html"></code-example>

一方で `[item]` バインディングは、コンポーネントの `currentItem` プロパティへのライブバインディングです。

### プロパティバインディング vs. 補間 {@a property-binding-vs-interpolation}

補間とプロパティバインディングのどちらかを選べるシーンがよくあります。
次のバインディングのペアは同じことをします:

<code-example path="property-binding/src/app/app.component.html" region="property-binding-interpolation" header="src/app/app.component.html"></code-example>

多くの場合、補間はプロパティバインディングよりも簡単な手段です。
データの値を文字列として表示するときは、
技術的にはどちらでもよく、読みやすさは補間に分があります。
しかし *要素のプロパティに文字列以外の値を設定する場合は、
プロパティバインディングを使う必要があります。*

### コンテンツのセキュリティ {@a content-security}

次の *悪意のある* コンテンツを想像してください。

<code-example path="property-binding/src/app/app.component.ts" region="malicious-content" header="src/app/app.component.ts"></code-example>

コンポーネントのテンプレートでは、コンテンツが補間で使われることがあります:

<code-example path="property-binding/src/app/app.component.html" region="malicious-interpolated" header="src/app/app.component.html"></code-example>

幸いなことに、Angular のデータバインディングは危険な HTML に対して警戒しています。
先ほどの例では HTML がそのまま表示され、Javascript は実行されません。
Angular は、補間でもプロパティバインディングでも、
script タグが含まれた HTML をブラウザにリークすることを *許しません。*

次の例では値を表示する前に
Angular が[サニタイズ](guide/security#sanitization-and-security-contexts)しています。

<code-example path="property-binding/src/app/app.component.html" region="malicious-content" header="src/app/app.component.html"></code-example>

補間は `<script>` タグを
プロパティバインディングとは違った方法で扱いますが、
どちらの方法でもコンテンツを無害な形で表示します。
ブラウザで `evilTitle` を表示した例がこちらになります。

<code-example language="bash">
"Template &lt;script&gt;alert("evil never sleeps")&lt;/script&gt; Syntax" is the interpolated evil title.
"Template alert("evil never sleeps")Syntax" is the property bound evil title.
</code-example>

<hr/>
{@a other-bindings}

## 属性、クラス、スタイルのバインディング {@a attribute-class-and-style-bindings}

テンプレート構文には、プロパティ・バインディングがあまり適していないシナリオのために、特殊な単方向バインディングがあります。

このセクションで示す、属性、クラス、スタイルのバインディングについては <live-example name="attribute-binding"></live-example> で実際に動かすことができます。


### 属性バインディング {@a attribute-binding}

**属性バインディング** を使うと属性の値を直接設定できます。これは、バインディングがターゲット・プロパティを設定するというルールの唯一の例外であり、属性を作成して設定する唯一のバインディングです。

通常は、文字列で属性を設定するよりも、
[プロパティバインディング](guide/template-syntax#property-binding)で要素のプロパティを設定する方が望ましいです。
しかし、バインドする要素のプロパティがない場合もあるので、属性バインディングが解決策となります。

[ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) と
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) について考えてみましょう。これらは純粋に属性であり、要素のプロパティに対応しておらず、要素のプロパティを設定していません。これらの場合、バインドするプロパティターゲットはありません。

属性バインディングの構文はプロパティバインディングに似ていますが、
括弧で囲まれた要素プロパティの代わりに、接頭辞 `attr` で始まり、
その後にドット (`.`) と属性名が続きます。
文字列になる式を使うと属性値を設定でき、
式が `null` になると属性を削除します。

属性バインディングの主な使用例のひとつは、
この例のような ARIA 属性の設定です:

<code-example path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

#### `colspan` と `colSpan` {@a colspan-and-colspan}

`colspan` 属性と `colSpan` プロパティの違いに注意してください。

このように書いたとすると:

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

このようなエラーが発生するでしょう:

<code-example language="bash">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

メッセージが示すように `<td>` 要素には `colspan` プロパティがありません。
`colspan` は属性なので、そのとおりです&mdash;対応するプロパティは `S` が大文字の `colSpan` です。
補間やプロパティバインディングが設定できるのは *プロパティ* だけで、属性はできません。

代わりに、プロパティバインディングを使ってこのように書くことができます:

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

</div>


<hr/>

### クラスバインディング {@a class-binding}

素の HTML で、バインディングを使わずに `class` 属性を指定する方法はこうです:

```html
<!-- standard class attribute setting -->
<div class="foo bar">Some text</div>
```

**クラスバインディング** を使うことで、要素の `class` 属性に CSS クラス名を追加したり削除したりすることができます。

クラス単体のバインディングを作るには、接頭辞 `class` にドット (`.`) と CSS クラス名をつけます (たとえば `[class.foo]="hasFoo"`)。
Angular はバインドされた式が truthy の場合にクラスを追加し、式が falsy の場合にクラスを削除します (`undefined` の場合は例外です。詳しくは[スタイル委譲](#styling-delegation)を見てください)。

複数のクラスのバインディングを作るには、ドットがない汎用的な `[class]` バインディングを使います (たとえば `[class]="classExpr"`)。
式はクラス名をスペースで区切った文字列にすることもできますし、クラス名をキーにして truthy/falsy 式を値にしたオブジェクト形式にすることもできます。
オブジェクト形式では、Angular は関連する値が truthy の場合にのみクラスを追加します。

注意しなければならないのは、オブジェクトのような表現 (`object`, `Array`, `Map`, `Set` など) では、クラスリストを更新するためにはオブジェクト自身を変更する必要があることです。
オブジェクト自身を変更せずにプロパティを更新しても何の効果もありません。

同じクラス名について複数のバインディングがある場合は[スタイリングの優先順位](#styling-precedence)にしたがって競合が解決されます。

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
      バインディングタイプ
    </th>
    <th>
      構文
    </th>
    <th>
      入力タイプ
    </th>
    <th>
      入力値の例
    </th>
  </tr>
  <tr>
    <td>クラス単体のバインディング</td>
    <td><code>[class.foo]="hasFoo"</code></td>
    <td><code>boolean | undefined | null</code></td>
    <td><code>true</code>, <code>false</code></td>
  </tr>
  <tr>
    <td rowspan=3>複数クラスのバインディング</td>
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


直接 `[class]` バインディングを使わずに [NgClass](#ngclass) ディレクティブを使うこともできます。
しかし、Angular のクラスバインディングの改善により、 `NgClass` は重要な価値を提供しなくなり、将来的には削除される可能性があるため、 `NgClass` を使用せずに上記のクラスバインディング構文を使用することが望ましいです。


<hr/>

### スタイルバインディング {@a style-binding}

素の HTML で、バインディングを使わずに `style` 属性を指定する方法はこうです:

```html
<!-- standard style attribute setting -->
<div style="color: blue">Some text</div>
```

**スタイルバインディング** を使うことで動的にスタイルを設定できます。

スタイル単体のバインディングを作るには、接頭辞 `style` にドット (`.`) と CSS スタイルプロパティの名前をつけます (たとえば `[style.width]="width"`)。
このプロパティは、バインドされた式の値 (通常は文字列) に設定されます。
オプションで、`em` や `%` のような単位を追加して数値型を要求するようにもできます。

<div class="alert is-helpful">

_スタイルプロパティ_ の名前は前述のとおり
[dash-case](guide/glossary#dash-case) で書くこともできますし、
`fontSize` のように [camelCase](guide/glossary#camelcase) で書くこともできます。

</div>

切り替えたいスタイルが複数あるときは、ドットのない `[style]` プロパティに直接バインドできます (たとえば `[style]="styleExpr"`)。
ほとんどの場合、 `[style]` バインディングでアタッチされる式は `"width: 100px; height: 100px;"` のようなスタイルを並べた文字列です。

式には、 `{width: '100px', height: '100px'}` のように、スタイルの名前をキーに、スタイルの値を値にしたオブジェクトを与えることもできます。
注意しなければならないのは、オブジェクトのような表現 (`object`, `Array`, `Map`, `Set` など) では、スタイルリストを更新するためにはオブジェクト自身を変更する必要があることです。
オブジェクト自身を変更せずにプロパティを更新しても何の効果もありません。

同じスタイルプロパティについて複数のバインディングがある場合は[スタイリングの優先順位](#styling-precedence)にしたがって競合が解決されます。

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
      バインディングタイプ
    </th>
    <th>
      構文
    </th>
    <th>
      入力タイプ
    </th>
    <th>
      入力値の例
    </th>
  </tr>
  <tr>
    <td>スタイル単体のバインディング</td>
    <td><code>[style.width]="width"</code></td>
    <td><code>string | undefined | null</code></td>
    <td><code>"100px"</code></td>
  </tr>
  <tr>
  <tr>
    <td>単位つきのスタイル単体のバインディング</td>
    <td><code>[style.width.px]="width"</code></td>
    <td><code>number | undefined | null</code></td>
    <td><code>100</code></td>
  </tr>
    <tr>
    <td rowspan=3>複数スタイルのバインディング</td>
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

直接 `[style]` バインディングを使わずに [NgStyle](#ngstyle) ディレクティブを使うこともできます。
しかし、Angular のスタイルバインディングの改善により、 `NgStyle` は重要な価値を提供しなくなり、将来的には削除される可能性があるため、 `NgStyle` を使用せずに上記のクラスバインディング構文を使用することが望ましいです。


<hr/>

{@a styling-precedence}
### スタイリングの優先順位

ひとつの HTML 要素について、CSS のクラスリストやスタイルの値を複数のソース (たとえば複数のディレクティブからのホストバインディング) にバインドすることができます。

同じクラス名やスタイルプロパティに複数のバインディングがあるとき、Angular は優先順位のルールにしたがって競合を解決し、どのクラスやスタイルを最終的に要素に適用するかを決定します。

<div class="alert is-helpful">
<h4>スタイリングの優先順位 (高い方から低い方へ)</h4>

1. テンプレートバインディング
    1. プロパティバインディング (たとえば `<div [class.foo]="hasFoo">` や `<div [style.color]="color">`)
    1. マップバインディング (たとえば `<div [class]="classExpr">` や `<div [style]="styleExpr">`)
    1. 静的な値 (たとえば `<div class="foo">` や `<div style="color: blue">`) 
1. ディレクティブのホストバインディング
    1. プロパティバインディング (たとえば `host: {'[class.foo]': 'hasFoo'}` や `host: {'[style.color]': 'color'}`)
    1. マップバインディング (たとえば `host: {'[class]': 'classExpr'}` や `host: {'[style]': 'styleExpr'}`)
    1. 静的な値 (たとえば `host: {'class': 'foo'}` や `host: {'style': 'color: blue'}`)    
1. コンポーネントのホストバインディング
    1. プロパティバインディング (たとえば `host: {'[class.foo]': 'hasFoo'}` や `host: {'[style.color]': 'color'}`)
    1. マップバインディング (たとえば `host: {'[class]': 'classExpr'}` や `host: {'[style]': 'styleExpr'}`)
    1. 静的な値 (たとえば `host: {'class': 'foo'}` や `host: {'style': 'color: blue'}`)    

</div>

クラスやスタイルのバインディングが詳細なほど、優先度が高くなります。

特定のクラス (たとえば `[class.foo]`) へのバインディングは、汎用的な `[class]` へのバインディングよりも優先され、特定のスタイル (たとえば `[style.bar]`) へのバインディングは、汎用的な `[style]` へのバインディングよりも優先されます。

<code-example path="attribute-binding/src/app/app.component.html" region="basic-specificity" header="src/app/app.component.html"></code-example>

異なるソースからのバインディングがあるときは、詳細度のルールも適用されます。
要素は、宣言されたテンプレートから、対応するディレクティブのホストバインディングから、対応するコンポーネントのホストバインディングからのバインディングをもつことができます。

テンプレートバインディングは、要素に対して直接、排他的に適用するため、もっとも詳細度が高く、もっとも高い優先順位を持ちます。

ディレクティブは複数の場所で使えるため、ディレクティブのホストバインディングはあまり詳細でないとみなされ、テンプレートバインディングよりも優先順位が低くなります。

ディレクティブはコンポーネントの動作を拡張することがあるため、コンポーネントによるホストバインディングの優先度は低くなります。

<code-example path="attribute-binding/src/app/app.component.html" region="source-specificity" header="src/app/app.component.html"></code-example>

さらに、バインディングは静的な属性よりも優先されます。

次のケースでは `class` と `[class]` は同じ詳細度を持ちますが、 `[class]` バインディングのほうが動的なため優先度が高くなります。

<code-example path="attribute-binding/src/app/app.component.html" region="dynamic-priority" header="src/app/app.component.html"></code-example>

{@a styling-delegation}
### 優先度が低いスタイルへの委譲 {@a delegating-to-styles-with-lower-precedence}

`undefined` 値を使うことで、高い優先度のスタイルから低い優先度のスタイルに "委譲" することができます。
スタイルプロパティを `null` にするとスタイルは確実に削除される一方、 `undefined` に設定すると Angular はそのスタイルについて優先度が次に高いバインディングにフォールバックする動作をします。

たとえば次のようなテンプレートを考えます:

<code-example path="attribute-binding/src/app/app.component.html" region="style-delegation" header="src/app/app.component.html"></code-example>

`dirWithHostBinding` ディレクティブと `comp-with-host-binding` コンポーネントの両方が `[style.width]` ホストバインディングをもつとします。
そこでもし `dirWithHostBinding` がそのバインディングを `undefined` に設定すれば、 `width` プロパティは `comp-with-host-binding` のホストバインディングの値にフォールバックします。
もし `dirWithHostBinding` がそのバインディングを `null` に設定すれば、 `width` プロパティは完全に削除されます。


{@a event-binding}

## イベントバインディング `(event)`

イベントバインディングを使えば、キー操作、マウス移動、クリック、タッチなどの
イベントをリッスンすることができます。このセクションで示すすべてのポイントのデモについては
<live-example name="event-binding">イベントバインディングの例</live-example>を参照してください。

Angular のイベントバインディングの構文は、等号の左側にある
括弧に囲まれた **ターゲットイベント** の名前と、
等号の右側にある引用符に囲まれたテンプレート文から成り立ちます。
次のイベントバインディングはボタンのクリックイベントをリッスンし、
クリックされたらコンポーネントの `onSave()` メソッドを呼び出します:

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">
</div>

### ターゲットイベント {@a target-event}

前に示したとおり、ターゲットはボタンのクリックイベントです。

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html"></code-example>

または、標準形式として知られている接頭辞 `on-` を使うこともできます:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html"></code-example>

要素のイベントは、より一般的なターゲットかもしれませんが、次の例で示すように、
Angular は名前が既知のディレクティブのイベントプロパティと一致するかどうかを最初に調べます。

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

名前が、要素のイベントや、既知のディレクティブの出力プロパティと一致しないときは、
Angular は “unknown directive” エラーを報告します。


### *$event* とイベントハンドル文 {@a event-and-event-handling-statements}

イベントバインディングでは、Angular はターゲットイベントのイベントハンドラーをセットアップします。

イベントが発生すると、ハンドラーはテンプレート文を実行します。
通常、テンプレート文にはレシーバーが含まれます。
レシーバーでは、HTML コントロールの値をモデルに格納するなどといった、
イベントに反応したアクションを実行します。

バインディングは、イベントに関する情報を伝えます。この情報には、 `$event` という名前でイベントオブジェクト、文字列、数値などのデータ値を含めることができます。

`$event` オブジェクトの形式はターゲットのイベントによって決まります。
ターゲットのイベントがネイティブの DOM 要素イベントであれば、 `$event` は
`target` や `target.value` といったプロパティを持った
[DOM イベントオブジェクト](https://developer.mozilla.org/en-US/docs/Web/Events)です。

この例について考えてみましょう:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

このコードでは、 `name` プロパティをバインドすることで `<input>` の `value` を設定しています。
値の変化をリッスンするため、 `<input>` 要素の
`input` イベントにバインドしています。
ユーザーが値を変更すると `input` イベントが発生し、
バインディングは DOM イベントオブジェクト `$event` を含むコンテキストで文を実行します。

`name` プロパティを更新するため、パス `$event.target.value` を使って変更されたテキストを取得します。

イベントがディレクティブに属している場合&mdash;コンポーネントはディレクティブであることを思い出してください
&mdash;`$event` はディレクティブが生成する形式となります。


### `EventEmitter` によるカスタムイベント {@a custom-events-with-eventemitter}

典型的なディレクティブは、Angular の [EventEmitter](api/core/EventEmitter) によってカスタムイベントを発生させます。
ディレクティブは `EventEmitter` を作り、プロパティとして公開します。
ディレクティブはイベントを起こすために `EventEmitter.emit(payload)` を呼び出し、任意のメッセージペイロードを渡します。
親ディレクティブは、プロパティをバインドしてイベントをリッスンし、 `$event` オブジェクトを通じてペイロードにアクセスします。

`ItemDetailComponent` がアイテムの情報を表示して、ユーザーアクションに反応するものだとします。
`ItemDetailComponent` には削除ボタンがありますが、それ自身はヒーローを削除する方法を知りません。ユーザーの削除要求を伝えるイベントを発生させるだけです。

`ItemDetailComponent` の関連コードの抜粋です:


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" header="src/app/item-detail/item-detail.component.html (template)" region="line-through"></code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest"></code-example>


コンポーネントは `EventEmitter` を返す `deleteRequest` プロパティを定義しています。
ユーザーが *delete* をクリックすると、コンポーネントは `delete()` メソッドを呼び出し、
`EventEmitter` に `Item` オブジェクトを出力させます。

ホストする親コンポーネントが `ItemDetailComponent` の `deleteRequest`
にバインドしているとしましょう。

<code-example path="event-binding/src/app/app.component.html" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component"></code-example>

`deleteRequest` イベントが発生すると、Angular は親コンポーネントの
`deleteItem()` メソッドを呼び出し、 `$event` 変数の *削除するアイテム* (`ItemDetail` によって出力)
を渡します。

### テンプレート文は副作用をもつ {@a template-statements-have-side-effects}

[テンプレート式](guide/template-syntax#template-expressions)は[副作用](guide/template-syntax#avoid-side-effects)をもつべきではありませんが、
テンプレート文には通常副作用があります。
`deleteItem()` メソッドには、アイテムを削除するという副作用があります。

アイテムの削除によってモデルが更新され、どういうコードを書くかにもよりますが、
リモートサーバーへの問い合わせや保存といったその他の変化も引き起こします。
これらの変化はシステムを伝播していき、最終的にはさまざまなビューによって表示されます。


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
  [( )] = banana in a box
</header>

括弧が角括弧の _中_ にあることを覚えておくために *banana in a box* を思い描いてください。

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

## 組み込みディレクティブ {@a built-in-directives}

Angular には2種類の組み込みディレクティブがあります。属性ディレクティブと構造ディレクティブです。
ここでは、[_属性_ ディレクティブ](guide/template-syntax#attribute-directives)か[_構造_ ディレクティブ](guide/template-syntax#structural-directives)に分類される、
一般的な組み込みディレクティブについて見ていきます。<live-example name="built-in-directives">組み込みディレクティブの例</live-example>もあります。

自作のディレクティブの作り方といった詳細については、[属性ディレクティブ](guide/attribute-directives)や[構造ディレクティブ](guide/structural-directives)を参照してください。

<hr/>

{@a attribute-directives}

### 組み込み属性ディレクティブ {@a built-in-attribute-directives}

属性ディレクティブは、他の HTML 要素、属性、プロパティ、コンポーネントの
動作をリッスンして変更します。
それらは通常、HTML の属性であるかのように要素に適用されます。

[`RouterModule`](guide/router "Routing and Navigation")
や [`FormsModule`](guide/forms "Forms") などの多くの NgModule では独自の属性ディレクティブを定義しています。
もっとも一般的に使用されている属性ディレクティブは次のとおりです:

* [`NgClass`](guide/template-syntax#ngClass) - 一連の CSS クラスを追加および削除する
* [`NgStyle`](guide/template-syntax#ngStyle) - 一連の HTML スタイルを追加および削除する
* [`NgModel`](guide/template-syntax#ngModel) - HTML の form 要素への双方向データバインディング

<hr/>

{@a ngClass}

### `NgClass`

`ngClass` を使うと、CSS クラスの追加と削除を同時にできます。

<code-example path="built-in-directives/src/app/app.component.html" region="special-div" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

追加、削除するクラスが *ひとつだけ* のときは、`NgClass` よりも[クラスバインディング](guide/template-syntax#class-binding)を使いましょう。

</div>

コンポーネントがもつ他の3つのプロパティの `true`/`false` 状態に基づいて、3つのクラスの追加または削除をする
コンポーネントのプロパティ `currentClasses` オブジェクトを設定する `setCurrentClasses` コンポーネントメソッド
を考えてみましょう。オブジェクトの各キーは CSS クラス名になります。
クラスを追加する必要がある場合はその値を `true` に、削除する必要がある場合は `false` にしてください。

<code-example path="built-in-directives/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts"></code-example>

`currentClasses` への `ngClass` プロパティバインディングを追加すると、それに応じて要素のクラスが設定されます: 

<code-example path="built-in-directives/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

初期化時と、依存するプロパティ変更時の両方で、
`setCurrentClasses()` を呼び出す必要があることを忘れないでください。

</div>

<hr/>

{@a ngStyle}

### `NgStyle`

`NgStyle` を使うと、コンポーネントの状態に応じて、たくさんのインラインスタイルを同時に動的に設定することができます。

#### `NgStyle` を使わないケース {@a without-ngstyle}

*単一の* スタイルの値を設定するときは `NgStyle` ではなく[スタイルバインディング](guide/template-syntax#style-binding)を使うことを検討してください。

<code-example path="built-in-directives/src/app/app.component.html" region="without-ng-style" header="src/app/app.component.html"></code-example>

*たくさん* のインラインスタイルを同時に設定するときは、`NgStyle` ディレクティブを使いましょう。

次に示すのは、コンポーネントプロパティ `currentStyles` に、
他のコンポーネントプロパティ3つの状態に基づいた3つのスタイルを定義するオブジェクトを設定する、
`setCurrentStyles()` メソッドです。

<code-example path="built-in-directives/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts"></code-example>

`currentStyles` への `ngStyle` プロパティバインディングを追加すると、それに応じて要素のスタイルが設定されます: 

<code-example path="built-in-directives/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

初期化時と、依存するプロパティ変更時の両方で、 `setCurrentStyles()` を呼び出す必要があることを忘れないでください。

</div>


<hr/>

{@a ngModel}

### `[(ngModel)]`: 双方向バインディング {@a ngmodel-two-way-binding}

`NgModel` ディレクティブを使うと、データプロパティを表示したり、
ユーザー操作に応じてプロパティを更新したりすることができます。例を示します:

<code-example path="built-in-directives/src/app/app.component.html" header="src/app/app.component.html (NgModel example)" region="NgModel-1"></code-example>


#### `ngModel` を使うために `FormsModule` をインポートする {@a import-formsmodule-to-use-ngmodel}

双方向のデータバインディングで `ngModel` ディレクティブを使う前に、
`FormsModule` をインポートして NgModule の `imports` リストに加える必要があります。
[Forms](guide/forms#ngModel) で `FormsModule` と `ngModel` について詳しく知ることができます。

`[(ngModel)]` を使えるようにするため、次のように `FormsModule` をインポートすることを忘れないでください:

<code-example path="built-in-directives/src/app/app.module.ts" header="src/app/app.module.ts (FormsModule import)" region="import-forms-module"></code-example>


`<input>` 要素の `value` プロパティと `input` イベントへの
別々のバインディングによって、同じことができます:

<code-example path="built-in-directives/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html"></code-example>

構文を簡素化するため、`ngModel` ディレクティブは `ngModel` 入力プロパティと `ngModelChange` 出力プロパティの詳細を隠蔽しています:

<code-example path="built-in-directives/src/app/app.component.html" region="NgModelChange" header="src/app/app.component.html"></code-example>

`ngModel` データプロパティは要素の値プロパティを設定し、
`ngModelChange` イベントプロパティは要素の値の変更をリッスンします。

#### `NgModel` と値アクセサ {@a ngmodel-and-value-accessors}

詳細な動作は要素によって異なるため、`NgModel` ディレクティブは、
要素をこのプロトコルに適応させる [ControlValueAccessor](api/forms/ControlValueAccessor)
がサポートする要素に対してのみ機能します。
Angular は、基本的な HTML のフォーム要素すべてについて *値アクセサ* を提供しており、
[フォーム](guide/forms)ガイドでそれらにバインドする方法を説明しています。

適切な値アクセサを作らない限り、
`[(ngModel)]` をフォーム以外のネイティブ要素またはサードパーティのカスタムコンポーネントに適用することはできません。
詳しくは [DefaultValueAccessor](api/forms/DefaultValueAccessor) の API ドキュメントを参照してください。

自作した Angular コンポーネントについては、
Angular の基本的な[双方向バインディングの構文](guide/template-syntax#two-way)に
合った値とイベントのプロパティ名をつければ、
値アクセサを作らずに済み、`NgModel` も省略できます。
[双方向バインディング](guide/template-syntax#two-way)セクションの `sizer` は
このテクニックの一例です。

個別の `ngModel` バインディングは、
要素のネイティブプロパティにバインドするよりもよいですが、
`[(ngModel)]` 構文を使えば宣言ひとつにバインディングをスリム化できます。

<code-example path="built-in-directives/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html"></code-example>

`[(ngModel)]` 構文ができるのは、データバウンドのプロパティの _設定_ だけです。
さらに何かする必要があるときは、展開された形式で書くことができます;
次の例では、`<input>` の値を大文字に変換しています:

<code-example path="built-in-directives/src/app/app.component.html" region="uppercase" header="src/app/app.component.html"></code-example>

大文字化を含むすべての書き方が動いている様子です:

<div class="lightbox">
  <img src='generated/images/guide/built-in-directives/ng-model-anim.gif' alt="NgModel variations">
</div>

<hr/>

{@a structural-directives}

## 組み込みの _構造_ ディレクティブ {@a built-in-structural-directives}

構造ディレクティブは HTML レイアウトを担当します。
それらがアタッチされているホスト要素に対する追加、削除、加工といった、
DOM 構造の形成、または再形成を行います。

このセクションでは、一般的な組み込みの構造ディレクティブについて紹介します:

* [`NgIf`](guide/template-syntax#ngIf)&mdash;条件に応じてテンプレートからサブビューを作成、または破棄します。
* [`NgFor`](guide/template-syntax#ngFor)&mdash;リストの各項目に対してノードを繰り返します。
* [`NgSwitch`](guide/template-syntax#ngSwitch)&mdash;いくつかのビューから選んで表示するディレクティブ一式です。

<div class="alert is-helpful">

構造ディレクティブについての詳細を記した
[構造ディレクティブ](guide/structural-directives)ガイドでは、
次の内容を説明しています:

* なぜ
[ディレクティブ名の先頭にアスタリスク (\*) をつけるのか](guide/structural-directives#the-asterisk--prefix)。
* ディレクティブをホストする適切な要素がないときに [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
でグルーピングする方法。
* 構造ディレクティブの作り方。
* ひとつの要素には[ひとつの構造ディレクティブ](guide/structural-directives#one-per-element "one per host element")しか適用できないこと。

</div>

<hr/>

{@a ngIf}

### NgIf

ホスト要素に
`NgIf` ディレクティブを適用することで、DOM に要素を追加、削除することができます。
この例では、ディレクティブから条件式 `isActive` にバインドしています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`ngIf` の前にアスタリスク (`*`) をつけるのを忘れないでください。
アスタリスクについての詳細は、[構造ディレクティブ](guide/structural-directives)の
[アスタリスク (*) 接頭辞](guide/structural-directives#the-asterisk--prefix)セクションを参照してください。

</div>

`isActive` が truthy な値を返すとき、`NgIf` は
DOM に `ItemDetailComponent` を追加します。
式が falsy なら、`NgIf` は DOM から `ItemDetailComponent` を削除し、
そのコンポーネントと、そのサブコンポーネントすべてを破棄します。


#### Show/hide と `NgIf` {@a showhide-vs-ngif}

要素を非表示にすることは、`NgIf` で削除することとは異なります。
次の例では、[class](guide/template-syntax#class-binding) と
[style](guide/template-syntax#style-binding) バインディングが、
それぞれどのように要素の表示状態を制御しているかを比較しています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html"></code-example>

要素を非表示にすると、要素とその子孫すべては DOM に残ります。
それらの要素のすべてのコンポーネントはメモリ上に残り、
Angular は変更を検出し続けることがあります。
かなりのコンピューティングリソースを使い、
不必要にパフォーマンスを低下させている可能性があります。

`NgIf` は違った動作をします。`NgIf` が `false` のとき、Angular は要素とその子孫を DOM から削除します。
コンポーネントも削除し、リソースを解放するので、
よりよいユーザー体験を提供できます。

大きなコンポーネントツリーを非表示にするときは、
より効率的な手段として `NgIf` を使うことを検討してください。

<div class="alert is-helpful">

`NgIf` と `ngIfElse` については [NgIf の API ドキュメント](api/common/NgIf)で詳しく知ることができます。

</div>

#### null 対策 {@a guard-against-null}

`ngIf` のもうひとつの長所は null 対策として使えることです。
表示/非表示がとてもシンプルなユースケースで、もし null 対策が必要なら `ngIf` を使ってください。ネストされた式が `null` のプロパティにアクセスしようとすると、Angular はエラーを投げます。

次の例では、2つの `<div>` について `NgIf` で対策しています。
`currentCustomer` の名前は `currentCustomer` が存在するときだけ表示されます。
`nullCustomer` は、その値が `null` であれば表示されません。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html"></code-example>

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2b" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

後述する
[セーフナビゲーション演算子](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")もご覧ください。

</div>
<hr/>

{@a ngFor}
### `NgFor`

`NgFor` は、項目のリストを表示する繰り返しディレクティブです。
ひとつの項目を表示するための HTML ブロックを定義し、
そのブロックをリストの各項目を表示するテンプレートとして使うよう Angular に伝えます。
繰り返しのプロセスは `*ngFor` に与えられたテキストが指示します。

次の例はシンプルな `<div>` に `NgFor` を適用したものです。 (`ngFor` の前にアスタリスク (`*`) をつけるのを忘れないでください) 

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`ngFor` の前にアスタリスク (`*`) をつけるのを忘れないでください。
アスタリスクについての詳細は、[構造ディレクティブ](guide/structural-directives)の
[アスタリスク (*) 接頭辞](guide/structural-directives#the-asterisk--prefix)セクションを参照してください。

</div>

次の例が示すように、コンポーネント要素に対しても `NgFor` を使うことができます。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html"></code-example>

{@a microsyntax}

<div class="callout is-critical">
<header>*ngFor マイクロシンタックス</header>

`*ngFor` に与えられた文字列は[テンプレート式](guide/template-syntax#template-expressions)ではありません。
それは*マイクロシンタックス*&mdash;Angular が解釈する独自の小さな言語です。
文字列 `"let item of items"` は次を意味します:

> *`items` 配列の各項目を取り出し、ローカルのループ変数 `item` として保存し、
繰り返しのたびにテンプレート HTML で使えるようにする。*

Angular はこの指示をホスト要素を囲む `<ng-template>` に変換し、
このテンプレートを繰り返し使って一連の新しい要素を作り、それぞれにリストの `item`
をバインディングします。
マイクロシンタックスについての詳細は[構造ディレクティブ](guide/structural-directives#microsyntax)ガイドをご覧ください。

</div>


{@a template-input-variable}

{@a template-input-variables}

#### テンプレート入力変数

`item` の前にある `let` キーワードは、`item` という名前のテンプレート入力変数を作ります。
`ngFor` ディレクティブは、親コンポーネントの `items` プロパティが返す `items` 配列の中を反復し、
反復中は `item` に配列の現在の項目を設定します。

`item` を参照することで、
`ngFor` のホスト要素やその子孫から項目のプロパティにアクセスできます。
次の例では、まず補間で `item` を参照し、
次に `<app-item-detail>` コンポーネントの `item` プロパティのバインディングに渡しています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html"></code-example>

テンプレート入力変数についての詳細は
[構造ディレクティブ](guide/structural-directives#template-input-variable)をご覧ください。

#### `index` を使った `*ngFor` {@a ngfor-with-index}

`NgFor` ディレクティブのコンテキストでの `index` プロパティは、
ゼロベースの各反復での配列の添字を返します。
テンプレート入力変数の中で `index` をつかまえて、それをテンプレートで使うことができます。

次の例では `index` を変数 `i` としてつかまえて、項目名とともに表示しています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`NgFor` は `NgForOf` ディレクティブによって実装されています。`last`、`even`、`odd` といった、その他の `NgForOf` コンテキストの変数については、
[NgForOf API リファレンス](api/common/NgForOf)をご覧ください。

</div>

{@a trackBy}
#### `trackBy` を使った *ngFor {@a ngfor-with-trackby}

大きなリストで `NgFor` を使うと、項目ひとつの追加や削除といった小さな変更が、多数の DOM 操作を引き起こすことがあります。たとえば、サーバーへの再問い合わせの結果がほとんど表示済みのものであっても、すべての項目を新しく作り直してしまうことがあります。このとき Angular は、新しいオブジェクトの参照のリストが与えられたことしか分からず、新しい DOM 要素で古い DOM 要素を置き換えることしかできません。

`trackBy` を使うことで、これを効率化できます。
`NgFor` が追跡すべき値を返すメソッドを、コンポーネントに追加します。
この場合に返す値はヒーローの `id` の値です。`id` が表示済みであれば、
Angular はそれを追跡し、同じ `id` に対してはサーバーに再問い合わせしません。

<code-example path="built-in-directives/src/app/app.component.ts" region="trackByItems" header="src/app/app.component.ts"></code-example>

マイクロシンタックスの式で `trackBy` に `trackByItems()` メソッドを設定しています。

<code-example path="built-in-directives/src/app/app.component.html" region="trackBy" header="src/app/app.component.html"></code-example>

`trackBy` の効果を図示します。
"Reset items" では、新しい項目を同じ `item.id` で作っています。
"Change ids" では、新しい項目を新しい `item.id` で作っています。

* `trackBy` を使わないと、どちらのボタンでもすべての DOM 要素置き換えが発生します。
* `trackBy` を使うと、`id` を変更したときだけ要素の置き換えが発生します。

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngfor-trackby.gif" alt="Animation of trackBy">
</div>


<div class="alert is-helpful">

組み込みディレクティブは公開 API だけを使っています。
他のディレクティブが使えない非公開 API を特別に使っているといったことはありません。

</div>

<hr/>

{@a ngSwitch}
## `NgSwitch` ディレクティブ {@a the-ngswitch-directives}

NgSwitch は JavaScript の `switch` 文のようなものです。
いくつかの要素の中から、条件に応じてひとつの要素を表示します。
Angular は選ばれた要素だけを DOM に挿入します。
<!-- API Flagged -->
`NgSwitch` は、実際には、次の例のように協調する3つのディレクティブ
`NgSwitch`, `NgSwitchCase`, `NgSwitchDefault` の組み合わせです。

 <code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html"></code-example>

<figure>
  <img src="generated/images/guide/built-in-directives/ngswitch.gif" alt="Animation of NgSwitch">
</figure>

`NgSwitch` はコントローラーディレクティブです。`feature` のような
*スイッチ値* を返す式にバインドしてください。この例では `feature`
の値は文字列ですが、任意の型を使うことができます。

**`[ngSwitch]` へのバインド**について。`NgSwitch` は*構造*ディレクティブではなく*属性*ディレクティブなので、
`*ngSwitch` を設定しようとするとエラーになります。
これは DOM を直接操作するのではなく、対応するディレクティブの動作に手を加えています。

**`*ngSwitchCase` と `*ngSwitchDefault` へのバインド**について。
`NgSwitchCase` と `NgSwitchDefault` ディレクティブは、DOM に要素を追加、削除するため、
_構造_ ディレクティブです。

* `NgSwitchCase` は、バインドされた値がスイッチ値と同じなら DOM に要素を追加し、
異なれば DOM から要素を削除します。

* `NgSwitchDefault` は、どの `NgSwitchCase` も選択されていないときに DOM に要素を追加します。

スイッチディレクティブは、*コンポーネント要素*を追加、削除するときに特に便利です。
この例では、 `item-switch.components.ts` で定義している4つの `item` コンポーネントを切り替えています。
それぞれのコンポーネントは `item` [入力プロパティ](guide/template-syntax#inputs-outputs "Input property")を持ち、
親コンポーネントの `currentItem` にバインドされています。

スイッチディレクティブは、ネイティブ要素や Web Components に対しても動作します。
たとえば `<app-best-item>` になるケースを次のコードに置き換えることができます。

<code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html"></code-example>

<hr/>

{@a template-reference-variable}

{@a template-reference-variables--var-}

{@a ref-vars}

{@a ref-var}

## テンプレート参照変数 (`#var`) {@a template-reference-variables-var}

**テンプレート参照変数**は、テンプレートから DOM 要素を参照するために使うことがあります。
他にも、ディレクティブ（コンポーネントも含む）、要素、[TemplateRef](api/core/TemplateRef)、<a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web components</a> を参照することができます。

このセクションで示す文法のデモやコードスニペットについては<live-example name="template-reference-variables">テンプレート参照変数の例</live-example>で確認できます。


ハッシュ記号 (#) を使うことで参照変数を宣言できます。
次の参照変数 `#phone` は、`<input>` を参照する `phone` 変数を宣言します。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

テンプレート参照変数は、コンポーネントのテンプレートのどこからでも参照することができます。
ここでは、テンプレートの下の方に出てくる `<button>` が `phone` 変数を参照しています。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

<h3 class="no-toc">参照変数がその値を得る方法</h3> {@a how-a-reference-variable-gets-its-value}

ほとんどの場合、Angular は参照変数の値を、それが宣言された要素とします。
前の例では `phone` は電話番号の `<input>` を参照しています。
ボタンのクリックハンドラーは、`<input>` の値をコンポーネントの `callPhone()` メソッドに渡します。

`NgForm` ディレクティブはこの動作を変更することができ、値を少し違ったものに設定します。次の例では、テンプレート参照変数 `itemForm` は
HTML の中でバラバラに3回出現します。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

属性の値が ngForm でなければ、itemForm が参照する値は
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) となります。
ただし、コンポーネントとディレクティブには違いがあります。
`Component` は属性の値がなくても参照されるのに対して、
`Directive` は暗黙の参照（つまり要素）を変更しません。



しかしここでは `NgForm` があるので、`itemForm` は [NgForm](api/forms/NgForm "API: NgForm")
ディレクティブへの参照となり、フォーム内のすべてのコントロールの値や妥当性を追うことができます。

ネイティブの `<form>` 要素には `form` というプロパティはありませんが、`NgForm` ディレクティブにはあり、
`itemForm.form.valid` が無効なら送信ボタンを無効化したり、
親コンポーネントの `onSubmit()` メソッドにフォームコントロールツリー全体を渡したりできます。

<h3 class="no-toc">テンプレート参照変数の考慮事項</h3> {@a template-reference-variable-considerations}

テンプレート _参照_ 変数 (`#phone`) は、[`*ngFor`](guide/template-syntax#template-input-variable) に出てくるようなテンプレート _入力_ 変数 (`let phone`) とは異なります。
詳しくは [_構造ディレクティブ_](guide/structural-directives#template-input-variable) をご覧ください。

参照変数のスコープは、テンプレート全体です。実行時の値が予測不可能となるため、同じテンプレート内で同じ名前の変数を2回以上宣言しないでください。

#### 別の構文 {@a alternative-syntax}

`#` の代わりに、接頭辞 `ref-` を使うこともできます。
この例では `fax` 変数を `#fax` ではなく `ref-fax` で宣言しています。


<code-example path="template-reference-variables/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html"></code-example>


<hr/>

{@a inputs-outputs}

## `@Input()` と `@Output()` プロパティ {@a input-and-output-properties}

`@Input()` と `@Output()` を使うことで、
Angular は親のコンテキストと子のディレクティブやコンポーネントとの間でデータをシェアすることができます。
`@Input()` プロパティは書き込み可能で、`@Output()` プロパティは観測可能です。

このような親子関係について考えてみます:

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

ここでは `<child-component>` セレクター（つまり子のディレクティブ）が、
子のコンテキストを与える `<parent-component>` に埋め込まれています。

`@Input()` と `@Output()` は、
子が親と通信できるようにするための、
子コンポーネントの API（アプリケーションプログラミングインターフェース）
として機能します。`@Input()` と `@Output()` をポートや玄関口だと考えてみましょう
&mdash;`@Input()` はデータの入り口で、コンポーネントにデータを流し込むことができます。
`@Output()` はコンポーネントからの出口で、
子コンポーネントがデータを送り出すことができます。

この `@Input()` と `@Output()` についてのセクションには <live-example name="inputs-outputs"></live-example> があります。
ここから先のサブセクションでは、サンプリアプリのキーポイントに焦点を当てていきます。

<div class="alert is-helpful">

#### `@Input()` と `@Output()` は独立しています {@a input-and-output-are-independent}

`@Input()` と `@Output()` は、よく一緒にアプリに出てきますが、
別々に使うこともできます。
親にデータを送るだけのコンポーネントの場合は、
`@Input()` は要らず `@Output()` だけが必要です。逆もまた真で、
親からデータを受け取るだけの場合は `@Input()` だけが必要です。

</div>

{@a input}

## `@Input()` の使い方 {@a how-to-use-input}

子のコンポーネントやディレクティブの `@Input()` デコレーターを使えば、
そのコンポーネントのプロパティが親のコンポーネントから値を受け取るように Angular に指示できます。
データの流れは、
子コンポーネントからの視点で表現されていることを覚えておくとよいでしょう。
つまり、`@Input()` はデータを親コンポーネントから子コンポーネントに向けて _入力_ できます。


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="Input data flow diagram">
</div>

`@Input()` の使い方を説明するため、アプリのこれらの部分を書き換えていきます:

* 子コンポーネントのクラスとテンプレート
* 親コンポーネントのクラスとテンプレート


### 子コンポーネント {@a in-the-child}

子コンポーネントクラスで `@Input()` デコレーターを使うには、
まず `Input` をインポートし、プロパティを `@Input()` で装飾します:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>


ここで `@Input()` が装飾しているのは `string` 型の <code class="no-auto-link">item</code> プロパティですが、
`@Input()` プロパティは `number`, `string`, `boolean`, `object`
など、どんな型であっても構いません。次のセクションで説明しますが `item` の値は親コンポーネントから来ます。

次に、子コンポーネントのテンプレートにこのように追記します:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>



### 親コンポーネント {@a in-the-parent}

次のステップでは、親コンポーネントのテンプレートでプロパティをバインドします。
この例では親コンポーネントのテンプレートは `app.component.html` です。

最初に、子のセレクター（ここでは `<app-item-detail>`）を
親コンポーネントのテンプレートでのディレクティブとして使います。
次に[プロパティバインディング](guide/template-syntax#property-binding)を使い、子のプロパティを親のプロパティにバインドします。

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

次に、親コンポーネントのクラス（`app.component.ts`）で `currentItem` の値を与えます:

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

`@Input()` を使うことで Angular は `currentItem` の値を子に渡すので、`item` は `Television` を表示します。

次の図はこの構造を説明したものです:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="Property binding diagram">
</div>

角括弧 (`[]`) で囲まれたターゲットは、
子コンポーネントで `@Input()` で装飾したプロパティです。
等号の右側にあるバインディングのソースは、
親コンポーネントからネストされたコンポーネントに渡すデータです。

重要なのは、親コンポーネントから子コンポーネントのプロパティ（各カッコに囲まれた部分）にバインドするとき、
子コンポーネントのプロパティを
`@Input()` で装飾する必要があるということです。

<div class="alert is-helpful">

#### `OnChanges` と `@Input()` {@a onchanges-and-input}

`@Input()` プロパティの変更を監視するには、
Angular の[ライフサイクル・フック](guide/lifecycle-hooks#onchanges) のひとつである `OnChanges` を使うことができます。
`OnChanges` は、`@Input()` デコレーターをもつプロパティを操作するように
特別に設計されています。詳細な内容や例については、[ライフサイクル・フック](guide/lifecycle-hooks)ガイドの [`OnChanges`](guide/lifecycle-hooks#onchanges) セクションをご覧ください。

</div>

{@a output}

## `@Output()` の使い方 {@a how-to-use-output}

子のコンポーネントやディレクティブで `@Output()` デコレーターを使えば、
子 _から_ 親へデータを流すことができます。

`@Output()` プロパティは、通常は Angular の [`EventEmitter`](api/core/EventEmitter) で初期化され、[イベント](#event-binding)として値をコンポーネントの外に流します。


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="Output diagram">
</div>

`@Input()` と同じように、子コンポーネントのプロパティに対して
`@Output()` を使うことができますが、その型は
`EventEmitter` であるべきです。

`@Output()` は、子コンポーネントのプロパティが、
データを子から親に伝える玄関口となることを示します。
子コンポーネントがイベントを発火することで、
親コンポーネントが変化に気づくことができます。イベントを発火するには、
カスタムイベントを発生させるために使う `@angular/core` のクラス
`EventEmitter` と、
`@Output()` が連動します。

`@Output()` を使うには、アプリのこれらの箇所を編集してください:

* 子コンポーネントのクラスとテンプレート
* 親コンポーネントのクラスとテンプレート


次の例では、HTML の `<input>` に入力されたデータを
親コンポーネントの配列に追加するために、
子コンポーネントで `@Output()` をどのように設定するかを示します。

<div class="alert is-helpful">

HTML 要素の `<input>` と Angular のデコレーター `@Input()` は別のものです。
このドキュメントは `@Input()` と `@Output()` に関する Angular のコンポーネント間通信に関するものです。HTML 要素の `<input>` について詳しく知るには [W3C 勧告](https://www.w3.org/TR/html5/sec-forms.html#the-input-element)をご覧ください。

</div>

### 子コンポーネント {@a in-the-child-1}

この例では、ユーザーが `<input>` に値を入力し、`<button>` をクリックするとイベントが発生します。すると `EventEmitter` が親コンポーネントにデータを伝えます。

まず `Output` と `EventEmitter`
を子コンポーネントクラスでインポートしてください:

```js
import { Output, EventEmitter } from '@angular/core';

```

次も引き続き子コンポーネントのクラスで、プロパティを `@Output()` で装飾してください。
この例の `@Output()` は `newItemEvent` という名前になっていて、
型はイベントを意味する `EventEmitter` です。


<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

この宣言のそれぞれの部分を説明するとこうなります:

* `@Output()`&mdash;プロパティがデータを子から親へ伝える玄関口であることを示すデコレーター関数
* `newItemEvent`&mdash;`@Output()` の名前
* `EventEmitter<string>`&mdash;`@Output()` の型
* `new EventEmitter<string>()`&mdash;Angular に新しいイベントエミッターを作るよう指示し、そのデータの型が文字列であることを示します。型は `number` や `boolean` のようにどのような型でも指定できます。`EventEmitter` についての詳細は [EventEmitter API ドキュメント](api/core/EventEmitter)をご覧ください。

次に 同じコンポーネントクラス内に `addNewItem()` メソッドを作ります:

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

`addNewItem()` 関数では `@Output()` の `newItemEvent`
を使ってイベントを発生させ、ユーザーが `<input>`
に入力した値を送出しています。つまり、
ユーザーが UI の追加ボタンをクリックしたときに、
子が親にイベントを知らせ、そのデータを送ります。

#### 子のテンプレート {@a in-the-childs-template}

子のテンプレートには2つのコントロールがあります。
1つ目は、ユーザーが項目名を入力する HTML の `<input>` で、
[テンプレート参照変数](guide/template-syntax#ref-var)の `#newItem` がついています。
ユーザーが `<input>` に入力したものは何でも `#newItem` 変数に保存されます。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

2つ目の要素は[イベントバインディング](guide/template-syntax#event-binding)
がついた `<button>` です。
等号の左側が括弧に囲まれた `(click)` であることから、
これがイベントバインディングであることが分かります。

`(click)` イベントは子コンポーネントのクラスの `addNewItem()` メソッドにバインドされていて、
`#newItem` の値が何であるかを引数に取ります。

これで、子コンポーネントから親にデータを送るための `@Output()` と、
イベントを発生させるメソッドができました。
次のステップは親に移ります。

### 親コンポーネント {@a in-the-parent-1}

この例では親コンポーネントは `AppComponent` ですが、
子をネストさせることができるコンポーネントであれば何でも構いません。

この例の `AppComponent` には、 `items` 配列と、
その配列に項目を追加するメソッドがあります。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` メソッドは文字列として引数を取り、
その文字列を `items` に追加します。

#### 親のテンプレート {@a in-the-parents-template}

次に、親のテンプレートで、
親のメソッドを子のイベントにバインドします。
親コンポーネントのテンプレート `app.component.html` に、
子のセレクター（ここでは `<app-item-output>`）を置いてください。

<code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

イベントバインディング `(newItemEvent)='addItem($event)'` は、
子のイベント `newItemEvent` を
親のメソッド `addItem()` につなぎ、
子から親に伝えるイベントが `addItem()` の引数となるよう、Angular に指示します。
つまり、ここでデータの受け渡しが行われています。
`$event` は、子のテンプレート UI でユーザーが
`<input>` に入力したデータを持っています。

ここで、`@Output()` が動作していることを確認するために次のコードを親のテンプレートに足してみましょう:

```html
  <ul>
    <li *ngFor="let item of items">{{item}}</li>
  </ul>
  ```

`*ngFor` で `items` 配列の中の項目を反復しています。子の `<input>` に値を入力してボタンをクリックすると、子はイベントを発生させ、親の `addItem()` メソッドがその値を `items` 配列に追加し、それを表示します。


## `@Input()` と `@Output()` を同時に使う

次に示すとおり、同じ子コンポーネントに対して `@Input()` と `@Output()` を同時に使うことができます:

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

ターゲットとなる `item` は子コンポーネントクラスの `@Input()` プロパティで、親のプロパティ `currentItem` から値を受け取ります。delete をクリックすると、子コンポーネントはイベント `deleteRequest` を発生させます。これは親の `crossOffItem()` メソッドの引数となります。

次の図は、同じ子コンポーネントの `@Input()` と `@Output()` の図で、
それぞれの違いを示しています:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="Input/Output diagram">
</div>

図が示すように、入力と出力を同時に使うのは、個別に使うのと同じことです。ここで、子のセレクターは `<app-input-output>` で、`item` と `deleteRequest` は子コンポーネントクラスの `@Input()` と `@Output()` プロパティです。
プロパティ `currentItem` とメソッド `crossOffItem()` は、どちらも親コンポーネントクラスのものです。

banana-in-a-box 構文 `[()]` を使うことで、プロパティとイベントバインディングを合体させることができます。
詳しくは[双方向バインディング](guide/template-syntax#two-way)をご覧ください。

これらの動作の詳細については、前のセクションの[入力](guide/template-syntax#input)と[出力](guide/template-syntax#output)をご覧ください。動いている例を見るには<live-example name="inputs-outputs">入力と出力の例</live-example>をご覧ください。

## `@Input()` と `@Output()` の宣言 {@a input-and-output-declarations}

入力と出力を宣言するとき、
`@Input()` や `@Output()` デコレーターの代わりに、
この例で示すようにディレクティブメタデータの
`inputs` と `outputs` 配列で指定することもできます:

<code-example path="inputs-outputs/src/app/in-the-metadata/in-the-metadata.component.ts" region="metadata" header="src/app/in-the-metadata/in-the-metadata.component.ts"></code-example>

`@Directive` と `@Component` のメタデータで
`inputs` と `outputs` を宣言することは可能ですが、
次のように `@Input()` と `@Output()` デコレーターを使うのがよいプラクティスです:

<code-example path="inputs-outputs/src/app/input-output/input-output.component.ts" region="input-output" header="src/app/input-output/input-output.component.ts"></code-example>

詳しくは[スタイルガイド](guide/styleguide)の
[インプットとアウトプットのプロパティを修飾しましょう](guide/styleguide#decorate-input-and-output-properties)セクションをご覧ください。



<div class="alert is-helpful">

入力や出力を使おうとしたときに、
プロパティが存在するはずなのにテンプレートパースエラーが発生した場合は、
プロパティに `@Input()` / `@Output()` が付いているか、
`inputs`/`outputs` 配列で宣言されていることを再確認してください:

<code-example language="bash">
Uncaught Error: Template parse errors:
Can't bind to 'item' since it isn't a known property of 'app-item-detail'
</code-example>

</div>

{@a aliasing-io}

## 入出力のエイリアス {@a aliasing-inputs-and-outputs}

時々、インプット/アウトプットのパブリックな名前を、内部の名前とは異なるものにすべき場合があります。ベストプラクティスとしてはそうすべきではないのですが、
Angular はその方法を用意しています。

### メタデータでのエイリアス {@a aliasing-in-the-metadata}

メタデータの入力と出力でエイリアスを指定するには、コロン区切り (`:`)
でプロパティ名を左に、パブリックな別名を右に書いた文字列を指定します。

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias" header="src/app/aliasing/aliasing.component.ts"></code-example>


### `@Input()`/`@Output()` デコレーターでのエイリアス {@a aliasing-with-the-inputoutput-decorator}

`@Input()`/`@Output()` デコレーターにエイリアスの名前を与えることで、プロパティ名にエイリアスを指定することができます。内部の名前はそのまま残ります。

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias-input-output" header="src/app/aliasing/aliasing.component.ts"></code-example>


<hr/>

{@a expression-operators}

## テンプレート式の演算子

Angular のテンプレート式言語は、JavaScript 構文のサブセットを採用し、いくつかの特定のシナリオ向けの特別な演算子を追加しています。
次のセクションでは、これらの演算子から3つを紹介します。

* [パイプ](guide/template-syntax#pipe)
* [セーフナビゲーション演算子](guide/template-syntax#safe-navigation-operator)
* [non-null 型アサーション演算子](guide/template-syntax#non-null-assertion-operator)

{@a pipe}

### パイプ演算子 (`|`) {@a the-pipe-operator-}

式の結果をバインドする前に、少し変換したいときがあります。
たとえば、数値を通貨として表示する、テキストを大文字にする、リストをフィルターしてソートするといった場合です。

パイプは、入力値を受け取り、変換した値を返す、シンプルな関数です。
これらはテンプレート式でパイプ演算子 (`|`) を使うことで簡単に適用できます:

<code-example path="template-expression-operators/src/app/app.component.html" region="uppercase-pipe" header="src/app/app.component.html"></code-example>

パイプ演算子は、演算子の左側の式を、右側のパイプ関数に渡します。

複数のパイプで式をつなぐこともできます:

<code-example path="template-expression-operators/src/app/app.component.html" region="pipe-chain" header="src/app/app.component.html"></code-example>

パイプに[パラメータを適用](guide/pipes#parameterizing-a-pipe)することもできます:

<code-example path="template-expression-operators/src/app/app.component.html" region="date-pipe" header="src/app/app.component.html"></code-example>

`json` パイプはバインディングのデバッグで特に役立ちます:

<code-example path="template-expression-operators/src/app/app.component.html" region="json-pipe" header="src/app/app.component.html"></code-example>

出力結果はこのようになります:

<code-example language="json">
  { "name": "Telephone",
    "manufactureDate": "1980-02-25T05:00:00.000Z",
    "price": 98 }
</code-example>

<div class="alert is-helpful">

パイプ演算子は三項演算子 (`?:`) よりも高い優先順位を持っているので、
`a ? b : c | x` は `a ? b : (c | x)` として解釈されます。
にもかかわらず、さまざまな理由から、
`?:` の第1、第2オペランドではカッコなしでパイプ演算子を使うことはできません。
第3オペランドでもカッコを使うのがよいプラクティスです。

</div>


<hr/>

{@a safe-navigation-operator}

### セーフナビゲーション演算子 ( `?` ) と null プロパティパス {@a the-safe-navigation-operator----and-null-property-paths}

Angular のセーフナビゲーション演算子 (`?`) は、プロパティパスの `null` や `undefined`
に対するガードとなります。ここでは `item` が `null` でもビューのレンダリングが失敗することを防いでいます。

<code-example path="template-expression-operators/src/app/app.component.html" region="safe" header="src/app/app.component.html"></code-example>

`item` が `null` でも、ビューをレンダリングできますが、表示される値は空白となります; 表示されるのは "The item name is:" だけで、その後に続く文字はありません。

次は `nullItem` の例を見てみましょう。

<code-example language="html">
  The null item name is {{nullItem.name}}
</code-example>

セーフナビゲーション演算子を使っておらず、`nullItem` も `null` なので、JavaScript と Angular は `null` 参照エラーを発生させ、Angular のレンダリングプロセスは中断します:

<code-example language="bash">
  TypeError: Cannot read property 'name' of null.
</code-example>

しかし時には、特定の状況下ではプロパティパス中に
`null` 値があってもよい場合があります。
特に値が最初は null で、後からデータが来る場合です。

セーフナビゲーション演算子 (`?`) を使うことで、Angular は最初の `null` 値にヒットすると式の評価を止め、エラーを起こさずにビューをレンダリングします。

`a?.b?.c?.d` のような長いプロパティパスであっても問題なく動作します。


<hr/>

{@a non-null-assertion-operator}

### non-null アサーション演算子 ( `!` ) {@a the-non-null-assertion-operator---}

Typescript 2.0 以降、`--strictNullChecks` フラグを使うことで[厳密な null チェック](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript")を強制できます。TypeScript は、変数が意図せず `null` や `undefined` になってしなわないことを保証します。

このモードでは、デフォルトで、型が付いた変数が `null` や `undefined` になることを禁じます。`null` や `undefined` を禁じた型の変数に代入しなかったり、`null` や `undefined` を代入しようとすると、型チェッカーがエラーを投げます。

変数が実行時に `null` や `undefined` になることを判断できない場合にも、型チェッカーはエラーを投げます。
接尾辞として [non-null アサーション演算子 (!)](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator")を使うことで、型チェッカーがエラーを投げないようにできます。

Angular の non-null アサーション演算子 (`!`) は、Angular テンプレートでも同じ役割を果たします。
この例では `item` のプロパティが定義されていることにできます。

<code-example path="template-expression-operators/src/app/app.component.html" region="non-null" header="src/app/app.component.html"></code-example>

Angular コンパイラーがテンプレートを TypeScript のコードに置き換えるとき、
`item.color` が `null` か `undefined` になりうることを TypeScript が報告することを防げます。

[_セーフナビゲーション演算子_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?)")と違い、
non-null アサーション演算子は `null` や `undefined` から守ってくれるものではありません。
TypeScript の型チェッカーに、特定のプロパティ式に対する厳密な `null` チェックを一時停止させます。

non-null アサーション演算子 (`!`) の使用は任意ですが、厳密な null チェックを有効にしているときは必須となります。

<a href="#top-of-page">back to top</a>

<hr/>

{@a built-in-template-functions}

## 組み込みのテンプレート関数

{@a any-type-cast-function}

### `$any()` 型キャスト関数 {@a the-any-type-cast-function}

バインディング式が[AOT コンパイル](guide/aot-compiler)中に型エラーを出すことがあり、その型を明記することが不可能だったり難しかったりすることがあります。
エラーをおとなしくするため、次の例で示すように `$any()` キャスト関数を使い、
式を [`any` 型](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) にキャストすることができます:

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html"></code-example>

Angular コンパイラがこのテンプレートを TypeScript コードに変換するときに、
テンプレートの型チェックで `bestByDate` が `item`
オブジェクトのメンバーではないと TypeScript が報告することを防げます。

`$any()` キャスト関数は `this` にも使うことができ、コンポーネントで宣言していない
メンバーにアクセスすることができます。

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html"></code-example>

`$any()` キャスト関数は、メソッド呼び出しが可能な場所ならバインディング式のどこでも呼び出すことができます。

## テンプレート中の SVG {@a svg-in-templates}

Angular では SVG を有効なテンプレートとして使うことができます。次に示すすべてのテンプレート構文は、
SVG と HTML の両方に適用できます。詳しくは SVG [1.1](https://www.w3.org/TR/SVG11/) と
[2.0](https://www.w3.org/TR/SVG2/) の仕様をご覧ください。

なぜ SVG を画像としてアプリケーションに追加するのではなく、テンプレートとして使うのでしょうか？

SVG をテンプレートとして使うことで、HTML のときと同じようにディレクティブやバインディングを使うことができます。
つまりインタラクティブな画像を動的に生成することができます。

構文の例として次のコードスニペットをご覧ください:

<code-example path="template-syntax/src/app/svg.component.ts" header="src/app/svg.component.ts"></code-example>

次のコードを `svg.component.svg` ファイルとして追加します:

<code-example path="template-syntax/src/app/svg.component.svg" header="src/app/svg.component.svg"></code-example>

`click()` イベントバインディングと、プロパティバインディングの構文 (`[attr.fill]="fillColor"`)
を使っている様子を確認できます。
