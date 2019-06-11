# テンプレート構文

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }
  h4 .syntax { font-size: 100%; }
</style>

Angular アプリケーションは、ユーザーが表示して実行できる機能を管理し、
これをコンポーネントクラスインスタンス(*コンポーネント*)と、そのユーザー向けテンプレートとのやりとりを通して実現します。

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

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html" linenums="false">
</code-example>

中括弧間のテキストは多くの場合、
コンポーネントのプロパティ名です。
Angular は、その名前を対応するコンポーネントプロパティの文字列値に置き換えます。

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html" linenums="false">
</code-example>

上記の例では、Angular は `title` プロパティと `itemImageUrl`
プロパティを評価して空白を埋めます。最初にタイトルテキストを表示し、次に画像を表示します。

より一般的には、中括弧間のテキストは、
Angular が最初に **評価** してから **文字列に変換** する **テンプレート式** です。
次の補間の例では、2つの数を加算していることがポイントです:

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html" linenums="false">
</code-example>

式では次の例のように `getVal()`
などのホストコンポーネントのメソッドを呼び出すことができます:

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html" linenums="false">
</code-example>

Angular は、二重中括弧内のすべての式を評価し、式の結果を文字列に変換して、
それらを隣接するリテラル文字列とリンクします。
最後に、この合成補間の結果を **要素またはディレクティブのプロパティ** に割り当てます。

要素タグ間にその結果を挿入したり、属性に割り当てるように表示します。

<div class="alert is-helpful">

ただし、
補間は Angular がプロパティバインディングに変換する特別な構文です。

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
* `|`、`?.` や `!` などの新しいテンプレート式演算子を持ちます
<!-- link to: guide/template-syntax#expression-operators -->

### 式のコンテキスト

*式のコンテキスト* は通常、 _コンポーネント_ インスタンスです。
次のスニペットでは、二重中括弧内の `recommended` と、引用符内の `itemImageUrl2`
は `AppComponent` のプロパティを参照しています。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html" linenums="false">
</code-example>

式は
テンプレート入力変数 `let customer` <!-- link to built-in-directives#template-input-variables -->
やテンプレート参照変数 `#customerInput` <!-- link to guide/template-ref-variables -->
などの _テンプレートが持つ_
コンテキストのプロパティも参照できます。

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)" linenums="false">
</code-example>

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)" linenums="false">
</code-example>

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

* [副作用を起こさない](guide/template-syntax#no-visible-side-effects)
* [素早い実行](guide/template-syntax#quick-execution)
* [シンプルさ](guide/template-syntax#simplicity)

{@a no-visible-side-effects}
### 副作用を起こさない

テンプレート式は、
対象のプロパティの値以外のアプリケーションの状態を変更すべきではありません。

このルールは Angular の「単方向データフロー」ポリシーに不可欠です。
コンポーネントの値を読み込むことで、他の表示された値を変えるかもしれないと決して心配すべきではありません。
ビューは1回のレンダリングパスを通して安定しているべきです。

[冪等](https://en.wikipedia.org/wiki/Idempotence)な式は、副作用がなく、
Angular の変更検知の性能を向上させるので理想的です。

Angular の項の中で冪等な式は、
その依存する値の1つが変わるまで、
*常にまったく同じもの* を返します。

依存する値は、イベントループが1回転する間に変化すべきではありません。
冪等な式が文字列または数値を返す場合、2回続けて呼び出されると同じ文字列または数値を返します。式が `array` を含むオブジェクトを返す場合、2回続けて呼び出されると同じオブジェクト *参照* を返します。

<div class="alert is-helpful">

`*ngFor` に適用される振る舞いについて1つ例外があります。`*ngFor` には、繰り返しをまたいだときに、参照の違うオブジェクトを処理できる `trackBy` 機能があります。

詳しくは、このガイドの [`trackBy` を使用した *ngFor](guide/template-syntax#ngfor-with-trackby) セクションを参照してください。

</div>

### 素早い実行 {@a quick-execution}

Angular はすべての変更検知サイクルの後にテンプレート式を実行します。
変更検知サイクルは、Promise の解決、HTTP の結果、タイマーイベント、
キープレス、マウスの移動などの多くの非同期アクティビティによって引き起こされます。

特に遅いデバイスでは、式が早く終了しなければユーザー体験が低下する可能性があります。
計算コストが高い場合、値をキャッシュすることを検討してください。

### シンプルさ {@a simplicity}

複雑なテンプレート式を書くことは可能ですが、
避けることをお勧めします。

プロパティ名、またはメソッド呼び出しは標準的であるべきです、しかし、必要なときには真偽値の否定 `!` はよいでしょう。
それ以外の場合、アプリケーションとビジネスロジックをコンポーネントに限定してください。
そうすることで、コンポーネントの開発とテストが容易になります。

<!-- end of Interpolation doc -->

<hr/>

{@a template-statements}

## テンプレート文

テンプレート **文**
は、要素、コンポーネント、ディレクティブなどのバインディングターゲットによって発生した **イベント** に応答します。
テンプレート文は [イベントバインディング](guide/template-syntax#event-binding) セクションでも触れますが、
`(event)="statement"` のように `=` 記号の右側に引用符で囲まれた形で現れます。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html" linenums="false">
</code-example>

テンプレート文には *副作用があります*。
それがイベントのポイントです。
これは、ユーザーの操作からアプリケーションの状態を更新する方法です。

イベントへの対応は、Angular の「単方向データフロー」の反対側です。
あなたは、このイベントループのターンの間に、何でも、どこでも自由に変更できます。

テンプレート式と同様に、テンプレート *文*
は JavaScript のような言語を使用します。
テンプレート文パーサーはテンプレート式パーサーとは異なり、
特に基本的な代入(`=`)と連鎖式（<code>;</code> または <code>,</code>）の両方をサポートします。

ただし、特定の JavaScript 構文は許可されていません:

* <code>new</code>
* `++` や `--` などの、インクリメント、デクリメント演算子
* `+=` and `-=` などの代入演算子
* ビット演算子 `|` や `&`
* [テンプレート式演算子](guide/template-syntax#expression-operators)

### 文のコンテキスト

式と同様に、文はコンポーネントインスタンスのイベント処理メソッドなど、
文のコンテキスト内にあるものだけを参照できます。

*文* のコンテキストは通常、コンポーネントインスタンスです。
`(click)="deleteHero()"` 内の *deleteHero* は、データがバインドされたコンポーネントのメソッドです。

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html" linenums="false">
</code-example>

文のコンテキストはテンプレート自身のコンテキストのプロパティも参照します。
次の例では、テンプレートの `$event` オブジェクト、
[テンプレート入力変数](guide/template-syntax#template-input-variable) (`let hero`)、
および [テンプレート参照変数](guide/template-syntax#ref-vars) (`#heroForm`)
がコンポーネントのイベント処理メソッドに渡されています。

<code-example path="template-syntax/src/app/app.component.html" region="context-var-statement" header="src/app/app.component.html" linenums="false">
</code-example>

テンプレートコンテキストの名前はコンポーネントコンテキストの名前よりも優先されます。
上記の `deleteHero(hero)` では、
`hero` はテンプレート入力変数であり、コンポーネントの `hero` プロパティではありません。

テンプレート文は、グローバル名前空間内のものを参照できません。
`window` や `document` を参照することはできません。
`console.log` や `Math.max` を呼び出すことはできません。

### 文のガイドライン

式と同様に、複雑なテンプレート文を書かないでください。
メソッド呼び出しまたは単純なプロパティ割り当てが一般的です。

さて、テンプレートの式と文を理解したので、
補間以外のさまざまなデータバインディング構文について学習する準備が整いました。


<hr/>

{@a binding-syntax}

## バインディング構文: 概要

データバインディングは、アプリケーションのデータ値を使用して、ユーザーに表示される内容を調整するための仕組みです。
HTML から値をプッシュしたり、プルしたりすることはできますが、
これらの雑用をバインディングフレームワークに任せることで、アプリケーションの作成、読み取り、保守が簡単になります。
バインディングソースとターゲット HTML 要素の間のバインディングを宣言して、フレームワークに任せるだけです。

Angular はさまざまな種類のデータバインディングを提供します。
このガイドでは、Angular のデータバインディングとその構文の概要を見たあとに、それらのほとんどについて説明します。

バインディングタイプは、データフローの方向によって3つのカテゴリーに分類できます。
_source-to-view_、_view-to-source_、そして双方向シーケンスの_view-to-source-to-view_です：

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
      データの方向
    </th>
    <th>
      構文
    </th>
    <th>
      タイプ
    </th>

  </tr>
  <tr>
    <td>
      データソースから<br>対象のビューへの<br>単方向
    </td>
    <td>

      <code-example>
        {{expression}}
        [target]="expression"
        bind-target="expression"
      </code-example>

    </td>
    <td>
      補間<br>
      プロパティ<br>
      属性<br>
      クラス<br>
      スタイル
    </td>
    <tr>
      <td>
        対象のビューから<br>データソースへの<br>単方向
      </td>
      <td>
        <code-example>
          (target)="statement"
          on-target="statement"
        </code-example>
      </td>
      <td>
        イベント
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

補間以外のバインディングタイプは、等号の左側に **ターゲット名** があり、区切り(`[]`、`()`)で囲まれているか、
または接頭辞が前に付いています(`bind-`、`on-`、`bindon-`)。

ターゲット名は _プロパティ_ 名です。それは _属性_ 名のように見えるかもしれませんが、そうではありません。
違いを理解するには、テンプレート HTML についての新しい考え方を発展させる必要があります。

### 新しいメンタルモデル

テンプレート HTML は、データバインディングの力とカスタムマークアップを使用して HTML のボキャブラリーを拡張する機能すべてを備えているので、
*HTML Plus* と見なしたくなります。

それ*は*本当に HTML Plus です。
しかし、あなたが慣れ親しんできた HTML とはかなり違います。
新しいメンタルモデルを必要とします。

通常の HTML 開発では、HTML 要素を使用してビジュアル構造を作成し、
文字列定数を使用して要素の属性を設定することによってそれらの要素を変更します。

<code-example path="template-syntax/src/app/app.component.html" region="img+button" header="src/app/app.component.html" linenums="false">
</code-example>

ここではまだ Angular テンプレート内で通常の方法を使用して構造を作成し、属性の値を初期化しているだけです。

それから、HTML をカプセル化するコンポーネントを使用して新しい要素を作成し、
ネイティブの HTML 要素であるかのようにそれらをテンプレートに配置する方法を学びます。

<code-example path="template-syntax/src/app/app.component.html" region="hero-detail-1" header="src/app/app.component.html" linenums="false">
</code-example>

まさに HTML Plus です。

それから、データバインディングについて学びます。最初に遭遇するバインディングは次のようになります:

<code-example path="template-syntax/src/app/app.component.html" region="disabled-button-1" header="src/app/app.component.html" linenums="false">
</code-example>

あなたはすぐにその独特の括弧表記にたどり着くでしょう。
思い描いてください。あなたの直感では、ボタンの `disabled` 属性にバインドして、
そしてコンポーネントの `isUnchanged` プロパティの現在の値にそれを設定します。

あなたの直感は正しくありません!
あなたの日々の HTML メンタルモデルは誤解を招きます。実際、いったんデータバインディングを開始すると、もうHTML *属性* を使用していないことになります。属性を設定していません。
DOM要素、コンポーネント、およびディレクティブの *プロパティ* を設定しています。

<div class="alert is-helpful">

### HTML 属性 vs. DOM プロパティ

HTML 属性と DOM プロパティの違いは、Angular バインディングがどのように機能するかを理解する上で非常に重要です。

**属性は HTML によって定義されています。プロパティは DOM(Document Object Model)によって定義されています。**

* いくつかの HTML 属性は、プロパティへの1対1のマッピングを持っています。`id` はその一例です。

* 一部の HTML 属性には対応するプロパティがありません。`colspan` はその一例です。

* 一部の DOM プロパティには対応する属性がありません。`textContent` はその一例です。

* 多くの HTML 属性はプロパティにマッピングされているように見えますが...あなたが考えるような方法ではありません!

この最後のカテゴリーは、この一般的なルールを理解するまでは混乱します。

**属性は DOM プロパティを初期化してから実行されます。プロパティ値は変えることができます。
属性値はできません。**

たとえば、ブラウザが `<input type="text" value="Bob">` をレンダリングすると、
`value` プロパティが `"Bob"` に初期化された、対応する DOM ノードが作成されます。

ユーザーが入力ボックスに「Sally」と入力すると、DOM要素の `value`*プロパティ* は「Sally」になります。
しかし、HTML の `value` *属性* は、input 要素を確認して分かるように、
その属性は変更されていません(`input.getAttribute('value')` は "Bob" を返します)。

HTML 属性の `value` は *初期値* を指定します。DOM の `value` プロパティは *現在* の値です。

`disabled` 属性は別の独特な例です。
ボタンの `disabled` *プロパティ* はデフォルトでは `false` であるため、ボタンは有効になっています。
`disabled` *属性* を追加すると、その存在だけでボタンの `disabled` *プロパティ* が `true`
に初期化されるため、ボタンは無効になります。

`disabled` *属性* の追加と削除で、ボタンの無効、有効が切り換わります。
属性の値とは無関係です。そのため、`<button disabled="false">Still Disabled</button>` と書いてボタンを有効にすることはできません。

ボタンの `disabled` *プロパティ* を(Angular バインディングなどで)設定すると、ボタンが無効または有効になります。
*プロパティ* の値は重要です。

**HTML 属性と DOM プロパティは、同じ名前であっても同じものではありません。**

</div>

繰り返すと、
**テンプレートバインディングは、*属性* ではなく *プロパティ* と *イベント* で機能します。**

<div class="callout is-helpful">

<header>
  属性のない世界
</header>

Angular の世界では、属性の唯一の役割は要素とディレクティブの状態を初期化することです。
データバインディングを作成するときは、ターゲットオブジェクトのプロパティとイベントだけを扱っています。
HTML 属性は事実上消えます。

</div>

このモデルをしっかりと念頭に置いて、バインディングターゲットについて学びましょう。

### バインディングターゲット

**データバインディングのターゲット** は DOM 内のものです。
バインディングタイプに応じて、ターゲットは
(要素 | コンポーネント | ディレクティブ)プロパティ、
(要素 | コンポーネント | ディレクティブ)イベント、または(まれに)属性名になります。
次の表はその概要です:

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
      要素&nbsp;プロパティ<br>
      コメント&nbsp;プロパティ<br>
      ディレクティブ&nbsp;プロパティ
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="property-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      イベント
    </td>
    <td>
      エレメント&nbsp;イベント<br>
      コンポーネント&nbsp;イベント<br>
      ディレクティブ&nbsp;イベント
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="event-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
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
      <code-example path="template-syntax/src/app/app.component.html" region="2-way-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
  <tr>
    <td>
      属性
    </td>
    <td>
      属性
      (例外)
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="attribute-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
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
      <code-example path="template-syntax/src/app/app.component.html" region="class-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
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
      <code-example path="template-syntax/src/app/app.component.html" region="style-binding-syntax-1" header="src/app/app.component.html" linenums="false">
      </code-example>
    </td>
  </tr>
</table>

この広い見方を念頭に置いて、バインディングタイプを詳細に見る準備が整いました。

<hr/>

{@a property-binding}

## プロパティバインディング ( <span class="syntax">[property]</span> )

ビュー要素のプロパティを設定するためにはテンプレートに **プロパティバインディング** を書いてください。
バインディングは、[テンプレート式](guide/template-syntax#template-expressions) の値をプロパティに設定します。

もっとも一般的なプロパティバインディングは、コンポーネントのプロパティ値を要素のプロパティに設定することです。
次の例は、コンポーネントの `heroImageUrl` プロパティを img 要素の `src` プロパティにバインドします:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

もう1つの例は、コンポーネントが `isUnchanged` なときにボタンを無効にします:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

もうひとつは、ディレクティブのプロパティを設定します:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

また別の例では、カスタムコンポーネントのモデルプロパティを設定します
(親コンポーネントと子コンポーネントがやりとりするための優れた方法です):

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-4" header="src/app/app.component.html" linenums="false">
</code-example>

### 単方向の *入口*

コンポーネントのデータプロパティからターゲット要素のプロパティに向かって単方向に値が流れるため、
プロパティバインディングは *単方向データバインディング* と呼ばれることが多いです。

ターゲット要素の *外* から値を引き出すためにプロパティバインディングを使用することはできません。
それを _読みこむ_ ためにターゲット要素のプロパティにバインドすることはできません。_設定_ だけできます。

<div class="alert is-helpful">

同様に、ターゲット要素上のメソッドを *呼び出す* ためにプロパティバインディングを使用することはできません。

要素がイベントを発生させた場合、[イベントバインディング](guide/template-syntax#event-binding) でそれらをリッスンすることができます。

ターゲット要素のプロパティを読みこんだり、そのメソッドの1つを呼び出したりする必要がある場合は、別の方法が必要です。
[ViewChild](api/core/ViewChild)
と
[ContentChild](api/core/ContentChild)
の API リファレンスを参照してください。

</div>

### バインディングターゲット

角括弧で囲まれた要素のプロパティは、ターゲットプロパティを識別します。
次のコードのターゲットプロパティは、img 要素の `src` プロパティです。

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

*標準形式* として知られている代替の `bind-` 接頭辞を好む人もいます:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-5" header="src/app/app.component.html" linenums="false">
</code-example>

ターゲット名は、他の何かしらの名前のように見える場合でも、常にプロパティ名です。
あなたは `src` を見て、それが属性名だと思うかもしれません。違います。img 要素のプロパティ名です。

要素のプロパティはより一般的なターゲットかもしれませんが、
次の例のように、
Angular は最初に名前が既知のディレクティブのプロパティであるかどうかを確認します:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

技術的には、Angular は名前をディレクティブの [入力](guide/template-syntax#inputs-outputs)、
つまりディレクティブの `inputs` 配列にリストされているプロパティ名の1つ、または `@Input()` で装飾されたプロパティと照合します。
そのような入力はディレクティブ自身のプロパティにマッピングされます。

</div>

名前が既知のディレクティブまたは要素のプロパティと一致しない場合、Angular は “unknown directive” エラーを報告します。

### 副作用を避けてください {@a avoid-side-effects}

前述のように、テンプレート式の評価には目に見える副作用はありません。
式の言語自体は、安全に保つための役割を果たします。
プロパティバインディング式でに何か値を代入したり、インクリメント演算子とデクリメント演算子を使用することはできません。

もちろん、式は副作用のあるプロパティやメソッドを呼び出すかもしれません。
Angular にはそれを知る方法や止める方法はありません。

式は `getFoo()` のようなものを呼び出すことができます。
あなただけが `getFoo()` が何をするのか知っています。
`getFoo()` が何かを変更し、それがたまたま何かにバインドされていると、不愉快な経験をするリスクがあります。
Angular は変更された値を表示する場合と表示しない場合があります。Angular は変更を検知して警告エラーを出すかもしれません。一般に、データプロパティか、何もせずに値を返すメソッドを使用してください。

### ふさわしい型を返してください

テンプレート式は、ターゲットプロパティが期待する値の型として評価されるべきです。
ターゲットプロパティが文字列を期待する場合は文字列を返してください。
ターゲットプロパティが数値を期待する場合は数値を返してください。
ターゲットプロパティがオブジェクトを期待する場合はオブジェクトを返してください。

`HeroDetail` コンポーネントの `hero` プロパティは `Hero` オブジェクトを期待します。それはまさにプロパティバインディングで送っているものです:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-4" header="src/app/app.component.html" linenums="false">
</code-example>

### 角括弧を忘れないでください

角括弧は Angular にテンプレート式を評価するように指示します。
角括弧を省略すると Angular は文字列を定数として扱い、
その文字列でターゲットプロパティを *初期化* します。
文字列は評価 *されません*。

次のような間違いをしないでください:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-6" header="src/app/app.component.html" linenums="false">
</code-example>

{@a one-time-initialization}

### ワンタイムの文字列の初期化

次のすべてが当てはまる場合は、角括弧を省略する *べき* です。

* ターゲットプロパティが文字列値を受け入れる。
* 文字列がテンプレートに焼き付けることができる固定値。
* この初期値が変化しない。

標準の HTML では、日常的にこの方法で属性を初期化します。
そして、ディレクティブおよびコンポーネントプロパティの初期化に対しても同様に機能します。
次の例では、`HeroDetailComponent` の `prefix` プロパティをテンプレート式ではなく固定の文字列で初期化します。
Angular はそれを設定し、それについて忘れます。

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-7" header="src/app/app.component.html" linenums="false">
</code-example>

一方、`[hero]` バインディングは、コンポーネントの `currentHero` プロパティへのライブバインディングのままです。

{@a property-binding-or-interpolation}

### プロパティバインディングか補間か?

補間とプロパティバインディングのどちらかを選択することがよくあります。
次のバインディングのペアは同じことをします:

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-vs-interpolation" header="src/app/app.component.html" linenums="false">
</code-example>

_補間_ は、多くの場合、_プロパティバインディング_ に代わる便利な方法です。

データ値を文字列としてレンダリングするときに、一方の形式を他方の形式よりも優先する技術的な理由はありません。
読みやすさに貢献する補間を支持する傾向があります。
コーディングスタイルのルールを確立し、そのルールに準拠していて、
当面の作業にとってもっとも自然に感じられる形式を選択することをお勧めします。

文字列以外のデータ値を要素のプロパティに設定するときは、_プロパティバインディング_ を使用する必要があります。

#### コンテンツのセキュリティ

次の *悪意のある* コンテンツを想像してください。

<code-example path="template-syntax/src/app/app.component.ts" region="evil-title" header="src/app/app.component.ts" linenums="false">
</code-example>

幸いなことに、Angular のデータバインディングは危険な HTML に対して警戒しています。
表示する前に値を [*サニタイズ*](guide/security#sanitization-and-security-contexts) します。
補間でもプロパティバインディングでも、
script タグ付きの HTML がブラウザに漏れることは許さない **でしょう**。

<code-example path="template-syntax/src/app/app.component.html" region="property-binding-vs-interpolation-sanitization" header="src/app/app.component.html" linenums="false">
</code-example>

補間は script タグをプロパティバインディングとは異なる方法で処理しますが、
どちらのアプローチもコンテンツを無害化します。


<figure>
  <img src='generated/images/guide/template-syntax/evil-title.png' alt="evil title made safe">
</figure>


<hr/>
{@a other-bindings}

## 属性、クラス、スタイルバインディング

テンプレートの構文は、プロパティバインディングにあまり適していないシナリオのための、特殊な単方向バインディングを提供します。

### 属性バインディング {@a attribute-binding}

**属性バインディング** を使用して属性の値を直接設定できます。

<div class="alert is-helpful">

これは、バインディングがターゲットプロパティを設定するという規則の唯一の例外です。
これは、属性を作成および設定する唯一のバインディングです。

</div>

このガイドでは、プロパティバインディングを使用して要素のプロパティを設定することは、文字列を使用して属性を設定することよりも常に推奨されることを繰り返し強調しています。
Angular が属性バインディングを提供するのはなぜでしょうか?

**バインドする要素のプロパティがない場合は、属性バインディングを使用する必要があります。**

[ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)、
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) や、table、span の属性を考えてみてください。
それらは純粋な属性です。
それらは要素のプロパティに対応しておらず、要素のプロパティを設定しません。
バインドするプロパティターゲットはありません。

あなたが次のようなものを書くとき、この事実は痛いほど明白になります。

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

次のようなエラーが発生します:

<code-example format="nocode">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

メッセージがいうように、`<td>` 要素は `colspan` プロパティを持っていません。
これは "colspan" *属性* を持っていますが、補間とプロパティバインディングは属性ではなく
*プロパティ* のみを設定できます。

そのような属性を作成してバインドするには、属性バインディングが必要です。

属性バインディングの構文は、プロパティバインディングに似ています。
角括弧間の要素のプロパティの代わりに、接頭辞 **`attr`** で始まり、
その後にドット(`.`)とその属性の名前が続きます。
次に、文字列として解決される式を使用して属性値を設定します。

計算した値を `[attr.colspan]` にバインドしましょう:

<code-example path="template-syntax/src/app/app.component.html" region="attrib-binding-colspan" header="src/app/app.component.html" linenums="false">
</code-example>

テーブルのレンダリング結果は次のようになります:

<table border="1px">
  <tr><td colspan="2">One-Two</td></tr>
  <tr><td>Five</td><td>Six</td></tr>
 </table>

属性バインディングの主な使用例の1つは、
次の例のように ARIA 属性を設定することです:

<code-example path="template-syntax/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html" linenums="false">
</code-example>


<hr/>

### クラスバインディング {@a class-binding}

**クラスバインディング** を使用して、
要素の `class` 属性に CSS のクラス名を追加、削除できます。

クラスバインディングの構文はプロパティバインディングに似ています。
角括弧間の要素のプロパティの代わりに、接頭辞 `class`
で始まり、必要に応じてドット(`.`)と CSS のクラス名が続きます: `[class.class-name]`。

次の例は、クラスバインディングを使用してアプリケーションの "special" というクラスを追加、削除する方法を示しています。
バインディングを使用せずに属性を設定する方法は次のとおりです:

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

これを希望するクラス名の文字列へのバインディングで置き換えることができます。これは全か無かの置換のバインディングです。

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

最後に、特定のクラス名にバインドできます。
Angular は、テンプレート式が truthy と評価されたときにクラスを追加します。
式が falsy な場合はクラスを削除します。

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

これは単一のクラス名を切り替えるのにはよい方法ですが、
複数のクラス名を同時に管理する場合は、通常 [NgClassディレクティブ](guide/template-syntax#ngClass) が適しています。

</div>


<hr/>

### スタイルバインディング {@a style-binding}

**スタイルバインディング** を使用してインラインスタイルを設定できます。

スタイルバインディングの構文はプロパティバインディングに似ています。
角括弧間の要素のプロパティの代わりに、接頭辞 `style` で始めます。
ドット(`.`)と CSS のスタイルのプロパティ名が続きます: `[style.style-property]`。

<code-example path="template-syntax/src/app/app.component.html" region="style-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

スタイルバインディングのスタイルの中には、単位拡張子をもつものがあります。
次の例では、フォントサイズを “em” および “%” 単位で条件付きで設定しています。

<code-example path="template-syntax/src/app/app.component.html" region="style-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

これは単一のスタイルを設定するためのすばらしい方法ですが、同時に複数のインラインスタイルを設定するときには、
[NgStyle ディレクティブ](guide/template-syntax#ngStyle) が一般的に推奨されます。

</div>

<div class="alert is-helpful">

スタイルのプロパティ名は、
上記のように [ダッシュケース](guide/glossary#dash-case) でも、
`fontSize` のように [キャメルケース](guide/glossary#camelcase) でも記述できます。

</div>

<hr/>

{@a event-binding}

## イベントバインディング `(event)`

イベントバインディングを使用すると、キーストローク、マウスの動き、クリック、タッチなどの特定のイベントをリッスンすることができます。
このセクションのポイントすべてを示す例については、
<live-example name="event-binding">イベントバインディングの例</live-example> を参照してください。

Angular のイベントバインディングの構文は、
等号の左側の括弧内の **ターゲットイベント** 名と右側の引用符で囲まれたテンプレート文で構成されます。
次のイベントバインディングは、
ボタンのクリックイベントをリッスンし、
クリックが発生するたびにコンポーネントの `onSave()` メソッドを呼び出します:

<figure>
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">
</figure>

### ターゲットイベント

上記のように、ターゲットはボタンのクリックイベントです。

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

あるいは、標準形式として知られている `on-` 接頭辞を使用してください:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html" linenums="false">
</code-example>

要素のイベントはより一般的なターゲットかもしれませんが、
次の例のように、Angular は最初に名前が既知のディレクティブのイベントプロパティと一致するかどうかを確認します:

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html" linenums="false">
</code-example>

名前が既知のディレクティブの要素のイベント、または出力プロパティと一致しない場合、Angular は
“unknown directive” エラーを報告します。


### *$event* とイベント処理文

イベントバインディング内で、Angular はターゲットイベントのイベントハンドラーを設定します。

イベントが発生すると、ハンドラーはテンプレート文を実行します。
テンプレート文は通常、レシーバーが関与します。
レシーバーは、HTML のコントロールからモデルに値を格納するなど、
イベントに応じてアクションを実行します。

バインディングはイベントに関する情報を伝えます。この情報には、イベントのオブジェクト、文字列、または数値などのデータ値を `$event` という名前で含めることができます。

ターゲットイベントは `$event` オブジェクトの形状を決定します。
ターゲットイベントがネイティブの DOM 要素イベントの場合、
`$event` は、`target` や `target.value`
などのプロパティをもつ [DOM イベントオブジェクト](https://developer.mozilla.org/en-US/docs/Web/Events) です。

次の例を考えてみてください:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html" linenums="false">
</code-example>

このコードは、`name` プロパティにバインドされている `<input>` の `value` プロパティを設定します。
この値の変更を監視するために、コードは `<input>` 要素の `input` イベントにバインドします。
ユーザーが変更を加えると、
`input` イベントが発生し、バインディングは DOM のイベントオブジェクト
`$event` を含むコンテキスト内で文を実行します。

`name` プロパティを更新するには、パス `$event.target.value` をたどって変更されたテキストを取得します。

イベントがディレクティブに属している場合(コンポーネントはディレクティブであることを思い出してください)、
`$event` はディレクティブが生成する状態をすべて持ちます。


### `EventEmitter` を使用したカスタムイベント

通常、ディレクティブは Angular の [EventEmitter](api/core/EventEmitter) を使用してカスタムイベントを発生させます。
ディレクティブは `EventEmitter` を作成し、それをプロパティとして公開します。
ディレクティブは `EventEmitter.emit(payload)` を呼び出してイベントを発火し、メッセージのペイロード(どんなものでもありえます)を渡します。
親ディレクティブは、このプロパティにバインドしてイベントをリッスンし、`$event` オブジェクトを介してペイロードにアクセスします。

商品情報を表示し、ユーザーの操作に応答する `ItemDetailComponent` を考えます。
`ItemDetailComponent` には削除ボタンがありますが、ヒーローを削除する方法は知りません。ユーザーの削除要求を報告するイベントのみを発生させることができます。

`ItemDetailComponent` からの抜粋は次のようになります:


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" linenums="false" header="src/app/item-detail/item-detail.component.html (template)" region="line-through">
</code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" linenums="false" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest">
</code-example>


コンポーネントに `EventEmitter` を返す `deleteRequest` プロパティを定義します。
ユーザーが *delete* をクリックすると、コンポーネントは `delete()` メソッドを呼び出して、
`EventEmitter` に `Item` オブジェクトを発行するように指示します。

さて、`ItemDetailComponent` の `deleteRequest`
イベントにバインドするホストの親コンポーネントを想像してください。

<code-example path="event-binding/src/app/app.component.html" linenums="false" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component">
</code-example>

`deleteRequest` イベントが発火すると、Angular は親コンポーネントの
`deleteItem()` メソッドを呼び出し、*削除するアイテム* (`ItemDetail` によって発行されたもの)
を `$event` 変数に渡します。

### テンプレート文には副作用があります

[テンプレート式](guide/template-syntax#template-expressions)
には [副作用](guide/template-syntax#avoid-side-effects) があってはいけませんが、テンプレート文には通常あります。
`deleteItem()` メソッドには副作用があります(アイテムを削除します)。

アイテムを削除することでモデルが更新され、コードによっては、
クエリやリモートサーバーへの保存など、その他の変更が起きます。
これらの変化はシステムを介して伝播し、最終的にこのビューおよび他のビューに表示されます。


<hr/>

{@a two-way}

## 双方向バインディング ( <span class="syntax">[(...)]</span> )

データプロパティの表示と、ユーザーが変更したときにそのプロパティを更新することの両方をしたいことはよくあります。

要素側では、特定の要素のプロパティを設定することと
要素の変更イベントをリッスンすることの組み合わせを取ります。

Angular は、この目的のための特別な _双方向データバインディング_ の構文、**`[(x)]`** を提供しています。
`[(x)]` 構文は、プロパティバインディングの括弧 `[x]`
とイベントバインディングの括弧 `(x)` を組み合わせたものです。

<div class="callout is-important">

<header>
  [( )] = 箱の中のバナナ
</header>

括弧が角括弧の _中_ にあることを覚えておくために *箱の中のバナナ* を思い描いてください。

</div>

`[(x)]` 構文は、要素が `x` という設定可能なプロパティと
対応する `xChange` というイベントを持っているときに簡単に説明できます。
このパターンに合う `SizerComponent` は次のようになります。
これは、`size` 値プロパティと、それに付随する `sizeChange` イベントを持ちます:

<code-example path="template-syntax/src/app/sizer.component.ts" header="src/app/sizer.component.ts">
</code-example>

`size` の初期値は、プロパティバインディングからの入力値です。
ボタンをクリックすると、最小値/最大値の制限内で `size` が増減し、
調整されたサイズで `sizeChange` イベントが発生（_発行_）します。

`AppComponent.fontSizePx` が `SizerComponent` に双方向でバインドされている例は次のようになります:

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (two-way-1)" region="two-way-1">
</code-example>

`AppComponent.fontSizePx` は、`SizerComponent.size` の初期値を設置します。
ボタンをクリックすると、双方向バインディングによって `AppComponent.fontSizePx` が更新されます。
変更された `AppComponent.fontSizePx` 値は _スタイル_ バインディングに流れ込み、
表示されるテキストが大きくなったり小さくなったりします。

双方向バインディングの構文は、実際にはプロパティバインディングとイベントバインディングの単なる糖衣構文です。
Angular は次のように `SizerComponent` バインディングを _脱糖_ します:

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (two-way-2)" region="two-way-2">
</code-example>

`$event` 変数には、`SizerComponent.sizeChange` イベントのペイロードが含まれています。
ユーザーがボタンをクリックすると、Angular は `$event` 値を `AppComponent.fontSizePx` に割り当てます。

双方向バインディングの構文は、プロパティとイベントを別々にバインドするのに比べて非常に便利です。

`<input>` や `<select>` のような HTML の form 要素を使って双方向バインディングを使うと便利です。
ただし、`x` 値および `xChange` イベントパターンに従うネイティブ HTML 要素はありません。

幸いなことに、Angular の [_NgModel_](guide/template-syntax#ngModel) ディレクティブは form 要素への双方向バインディングを可能にするブリッジとなります。


<hr/>

{@a directives}

## ビルトインディレクティブ

Angular の以前のバージョンには、70を超える組み込みディレクティブが含まれていました。
コミュニティはさらに多くの貢献をし、
内部アプリケーション用に数え切れないほどのプライベートディレクティブが作成されました。

Angular ではこれらのディレクティブの多くは必要ありません。
より能力があり表現力がある Angular のバインディングシステムで、同じ結果が得られるでしょう。
次のような単純なバインディングで記述できるときに、クリックを処理するディレクティブを作成する理由がありますか?

<code-example path="template-syntax/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html" linenums="false">
</code-example>

それでも、複雑なタスクを単純化するディレクティブから恩恵を受けます。
Angular にはまだ組み込みディレクティブが載せられていますが、多くはありません。
あなたはあなた自身のディレクティブを書くでしょうが、多くはないでしょう。

このセグメントでは、[_属性_ ディレクティブ](guide/template-syntax#attribute-directives) または [_構造_ ディレクティブ](guide/template-syntax#structural-directives) のいずれかに分類される、
もっとも頻繁に使用される組み込みディレクティブのいくつかを見直します。

<hr/>

{@a attribute-directives}

## ビルトイン _属性_ ディレクティブ

属性ディレクティブは、
他の HTML の要素、属性、プロパティ、およびコンポーネントの動作をリッスンして変更します。
それらは通常、HTML の属性であるかのように要素に適用されます。

多くの詳細については、[_属性ディレクティブ_](guide/attribute-directives) ガイドでカバーされています。
[`RouterModule`](guide/router "Routing and Navigation")
や [`FormsModule`](guide/forms "Forms") などの多くの NgModule では独自の属性ディレクティブを定義しています。
このセクションでは、もっとも一般的に使用されている属性ディレクティブについて紹介します:

* [`NgClass`](guide/template-syntax#ngClass) - 一連の CSS クラスを追加および削除する
* [`NgStyle`](guide/template-syntax#ngStyle) - 一連の HTML スタイルを追加および削除する
* [`NgModel`](guide/template-syntax#ngModel) - HTML の form 要素への双方向データバインディング


<hr/>

{@a ngClass}

### NgClass

要素の表示方法を制御するとき、通常は
CSS クラスを動的に追加および削除します。
`ngClass` にバインドして、同時に複数のクラスを追加または削除できます。

[クラスバインディング](guide/template-syntax#class-binding) は、*単一* のクラスを追加または削除することに向いています。

<code-example path="template-syntax/src/app/app.component.html" region="class-binding-3a" header="src/app/app.component.html" linenums="false">
</code-example>

同時に多くの CSS クラスを追加または削除する場合、`NgClass` ディレクティブがよりよい選択かもしれません。

`ngClass` をキーバリューのコントロールオブジェクトにバインドしてみてください。
オブジェクトの各キーは CSS クラス名になります。
クラスを追加する必要がある場合はその値を `true`、削除する必要がある場合は `false` にしてください。

コンポーネントがもつ他の3つのプロパティの `true`/`false` 状態に基づいて、3つのクラスの追加または削除をする
コンポーネントのプロパティ `currentClasses` オブジェクトを設定する `setCurrentClasses` コンポーネントメソッド
を考えてみましょう:

<code-example path="template-syntax/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts" linenums="false">
</code-example>

`ngClass` プロパティバインディングを `currentClasses` に追加するとそれに応じて要素のクラスが設定されます:

<code-example path="template-syntax/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

初期化時と、依存するプロパティ変更時の両方で、`setCurrentClasses()` をあなたが呼び出す必要があります。

</div>

<hr/>

{@a ngStyle}

### NgStyle

コンポーネントの状態に基づいて、インラインスタイルを動的に設定できます。
`NgStyle` では、たくさんのインラインスタイルを同時に設定することができます。

[スタイルバインディング](guide/template-syntax#style-binding) は、*単一* のスタイル値を設定する簡単な方法です。

<code-example path="template-syntax/src/app/app.component.html" region="NgStyle-1" header="src/app/app.component.html" linenums="false">
</code-example>

*多く* のインラインスタイルを同時に設定する場合、`NgStyle` ディレクティブがよりよい選択かもしれません。

`ngStyle` をキーバリューのコントロールオブジェクトにバインドしてみてください。
オブジェクトの各キーはスタイル名です。その値はそのスタイルに割り当てられます。

コンポーネントがもつ他の3つのプロパティの状態に基づいて、3つのスタイルを定義するコンポーネントのプロパティ
`currentStyles` オブジェクトを設定する `setCurrentStyles` コンポーネントメソッドについて考えてみましょう:

<code-example path="template-syntax/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts" linenums="false">
</code-example>

現在のスタイルに `ngStyle` プロパティバインディングを追加すると、`currentStyles` に応じて要素のスタイルが設定されます:

<code-example path="template-syntax/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

初期化時と、依存するプロパティ変更時の両方で、`setCurrentStyles()` をあなたが呼び出す必要があります。

</div>


<hr/>

{@a ngModel}

### NgModel - <span class="syntax">[(ngModel)]</span>　を使用したform要素の双方向バインディング

データ入力フォームを開発するときは、多くの場合データプロパティを表示し、
ユーザーが変更したときにそのプロパティを更新します。

`NgModel` ディレクティブを使用した双方向データバインディングにより、これが簡単になります。例は次のようになります:

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (NgModel-1)" region="NgModel-1">
</code-example>

#### _ngModel_ を使用するためには _FormsModule_ が必要

双方向データバインディングで `ngModel` ディレクティブを使用する前に、
`FormsModule` をインポートして `NgModule` のインポートリストに追加する必要があります。
[フォーム](guide/forms#ngModel) ガイドで
`FormsModule` と `ngModel` の詳細を学んでください。

`FormsModule` をインポートして `[(ngModel)]` を利用可能にする方法は次のようになります。

<code-example path="template-syntax/src/app/app.module.1.ts" linenums="false" header="src/app/app.module.ts (FormsModule import)">
</code-example>

#### <span class="syntax">[(ngModel)]</span> の内側

`name` バインディングを振り返ってみると、
`<input>` 要素の `value` プロパティと
`input` イベントへの別々のバインディングで同じ結果が得られた可能性があることに注意してください。

<code-example path="template-syntax/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html" linenums="false">
</code-example>

それは面倒です。誰がどの要素のプロパティを設定し、どの要素のイベントがユーザーの変更を引き起こしたかを覚えておくことができますか?
データプロパティを更新するために、現在表示されているテキストを入力ボックスからどのように抽出するのですか。
毎回それを調べたい人はいますか?

その `ngModel` ディレクティブは、自身の `ngModel` 入力プロパティと `ngModelChange` 出力プロパティの背後にこれらの面倒な詳細を隠蔽します。

<code-example path="template-syntax/src/app/app.component.html" region="NgModel-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

`ngModel` データプロパティは要素の `value` プロパティを設定し、
`ngModelChange` イベントプロパティは要素の値に対する変更をリッスンします。

詳細は各種類の要素に固有のものであるため、`NgModel` ディレクティブは、要素をこのプロトコルに適応させる [ControlValueAccessor](api/forms/ControlValueAccessor)
によってサポートされている要素に対してのみ機能します。
`<input>` ボックスはそれらの要素のひとつです。
Angular はすべての基本的な HTML の form 要素に
*値アクセサ* を提供し、
[_フォーム_](guide/forms) ガイドではそれらにバインドする方法を説明します。

適切な値アクセサを作成するまでは、
`[(ngModel)]` をフォーム以外のネイティブ要素またはサードパーティのカスタムコンポーネントに適用することはできません。
これは、このガイドの範囲外です。

Angular の基本的な [双方向バインディング](guide/template-syntax#two-way)
の構文に合わせて `NgModel`
を省略して値とイベントのプロパティに名前を付けることができるため、作成する Angular コンポーネントに _値アクセサ_ は必要ありません。
[上記の `sizer` の例](guide/template-syntax#two-way) は、この手法の一例です。

</div>

分離した `ngModel` バインディングは、要素のネイティブプロパティへのバインディングよりも優れています。あなたはもっとうまくやれます。

データプロパティを2回宣言する必要はありません。
Angular は、`[(ngModel)]` 構文を使用して、コンポーネントのデータプロパティの取得と設定を
1つの宣言で行えるようにします:

<code-example path="template-syntax/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html" linenums="false">
</code-example>

`[(ngModel)]` だけが必要ですか?展開された形式に戻る理由はありますか?

`[(ngModel)]` 構文はデータが連結されたプロパティのみを _設定_ できます。
もっと何か、あるいは違うことをする必要があるなら、展開された形式で書くことができます。

次のわざとらしい例は、入力値を大文字にします:

<code-example path="template-syntax/src/app/app.component.html" region="NgModel-4" header="src/app/app.component.html" linenums="false">
</code-example>

大文字バージョンを含むすべてのバリエーションは次のようになります:

<figure>
  <img src='generated/images/guide/template-syntax/ng-model-anim.gif' alt="NgModel variations">
</figure>

<hr/>

{@a structural-directives}

## ビルトイン _構造_ ディレクティブ

構造ディレクティブは HTML のレイアウトを担当します。
アタッチされたホストエレメントの追加、削除や操作によって
DOM の _構造_ を構築、または再構築します。

構造ディレクティブの深い詳細については [_構造ディレクティブ_](guide/structural-directives)
ガイドでカバーされています。
そこで次のようなことを学ぶでしょう。

* [_ディレクティブ名の接頭辞にアスタリスク_ (\*) をつける](guide/structural-directives#asterisk "The * in *ngIf")
理由。
* ディレクティブに適したホスト要素がないときに要素をグループ化するために
[`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>") を使うこと。
* あなた自身の構造ディレクティブを書く方法。
* 1つの要素には [1つの構造ディレクティブ](guide/structural-directives#one-per-element "one per host element") のみ適用できること。

_この_ セクションでは、一般的な構造ディレクティブについて紹介します。

* [`NgIf`](guide/template-syntax#ngIf) - 条件によって DOM に要素を追加または削除する
* [`NgSwitch`](guide/template-syntax#ngSwitch) - 選択肢のビューを切り替える一連のディレクティブ
* [`NgForOf`](guide/template-syntax#ngFor) - リスト内の各項目に対してテンプレートを繰り返す

<hr/>

{@a ngIf}

### NgIf

要素 (_ホスト要素_ と呼ばれる) に `NgIf` ディレクティブを適用することで、
DOM にその要素を追加、または削除できます。
次の例の `isActive` のように、条件式をディレクティブにバインドしてください。

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-critical">

`ngIf` の前にアスタリスク (`*`) を忘れないでください。

</div>

`isActive` 式が truthy な値を返すと、`NgIf` は `HeroDetailComponent` を DOM に追加します。
式が falsy な場合、`NgIf` は DOM から `HeroDetailComponent`
を削除し、そのコンポーネントとそのすべてのサブコンポーネントを破棄します。

#### 表示/非表示とは別物です

[クラス](guide/template-syntax#class-binding) または [スタイル](guide/template-syntax#style-binding)
バインディングを使用して要素の可視性を制御できます:

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html" linenums="false">
</code-example>

要素を非表示にすることは、`NgIf` で要素を削除することとはまったく異なります。

要素を非表示にしても、その要素とそのすべての子孫は DOM に残ります。
それらの要素のすべてのコンポーネントはメモリに残り、Angular
は変更をチェックし続けます。
ユーザーが見れないもののために、かなりのコンピューティングリソースを保持し、
パフォーマンスを低下させる可能性があります。

`NgIf` が `false` の場合、Angular は DOM から要素とその子孫を削除します。
それはそれらのコンポーネントを破壊し、潜在的にかなりのリソースを解放し、
より迅速なユーザー体験をもたらします。

表示/非表示のテクニックは、少数の子をもつ少数の要素に対しては問題ありません。
大きなコンポーネントツリーを隠すときは注意が必要です。`NgIf` はより安全な選択かもしれません。

#### null から保護する

`ngIf` ディレクティブは、null を防ぐためによく使用されます。
表示/非表示はガードとしては役に立ちません。
入れ子の式が `null` のプロパティにアクセスしようとすると、Angular はエラーをスローします。

次では、`NgIf` が2つの `<div>` を保護しているのがわかります。
`currentHero` の名前は `currentHero` がある場合にのみ表示されます。
`nullHero` は決して表示されません。

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

あとで説明する、
[_セーフナビゲーション演算子_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")
も参照してください。

</div>


<hr/>

{@a ngFor}

### NgForOf

`NgForOf` は _リピーター_ ディレクティブ (項目のリストを表示する方法) です。
単一の項目をどのように表示するかを定義する HTML ブロックを定義します。
リストの各項目をレンダリングするためのテンプレートとしてそのブロックを使用するように Angular に指示します。

単純な `<div>` に適用された `NgForOf` の例は次のようになります:

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html" linenums="false">
</code-example>

次の例のように、`NgForOf` をコンポーネント要素に適用することもできます:

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-critical">

`ngFor` の前にアスタリスク (`*`) を忘れないでください。

</div>

`*ngFor` に割り当てられたテキストは繰り返しのプロセスをガイドする命令です。

{@a microsyntax}

#### *ngFor マイクロシンタックス

`*ngFor` に割り当てられた文字列はテンプレート式ではありません。
それはマイクロシンタックス (Angular が解釈するそれ自身の小さな言語) です。
文字列 "let hero of heroes" の意味は、

> *`heroes` 配列内の各ヒーローを取り出し、それをローカルの `hero`
ループ変数に格納して、反復ごとにテンプレート HTML で使用できるようにします。*

Angular はこの命令をホスト要素を囲む `<ng-template>`
に変換し、次にこのテンプレートを繰り返し使用して、
リスト内の各 `hero` の要素とバインディングの新しいセットを作成します。

[_構造ディレクティブ_](guide/structural-directives#microsyntax) ガイドで _マイクロシンタックス_ について学んでください。

{@a template-input-variable}

{@a template-input-variables}

### テンプレート入力変数

`hero` の前の `let` キーワードは、`hero` という _テンプレート入力変数_ を作成します。
`NgForOf` ディレクティブは、親コンポーネントの `heroes` プロパティによって返された
`heroes` 配列を反復処理し、各反復の間、配列からの現在の項目に `hero` をセットします。

`NgForOf` ホスト要素内 (およびその子孫内) の `hero`
入力変数を参照して、ヒーローのプロパティにアクセスします。
ここでは最初に補間で参照され、次に `<hero-detail>`
コンポーネントの `hero` プロパティへのバインディングで渡されます。

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html" linenums="false">
</code-example>

_テンプレート入力変数_ については
[_構造ディレクティブ_](guide/structural-directives#template-input-variable) ガイドで学んでください。

#### *ngFor で _index_ を使用する

`NgForOf` ディレクティブコンテキストの `index` プロパティは、各繰り返し内で 0 から始まる項目のインデックスを返します。
テンプレート入力変数で `index` を取得してテンプレートで使用することができます。

次の例では、`i` という変数名で `index` を取得し、次のようにヒーロー名と一緒に表示します。

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

`NgFor` は `NgForOf` ディレクティブによって実装されます。
`last`、`even`、`odd` など、他の `NgForOf` コンテキスト値の詳細については、[NgForOf の API リファレンス](api/common/NgForOf) を参照してください。

</div>

{@a ngfor-with-trackby}

#### *ngFor で _trackBy_ を使用する

特に大きなリストでは、`NgForOf` ディレクティブのパフォーマンスが低下する可能性があります。
1つのアイテムへの小さな変更、アイテムの削除、またはアイテムの追加は、一連の DOM 操作を引き起こす可能性があります。

たとえば、サーバーに再問い合わせすると、すべての新しいヒーローオブジェクトを含むリストがリセットされる可能性があります。

全部ではないにしても、ほとんどは以前に表示されたヒーローです。
*あなた* は、各ヒーローの `id` が変わっていないことからこれを認識します。
しかし Angular は、新しいオブジェクト参照の新しいリストしか見ていません。
古い DOM 要素を破棄してすべての新しい DOM 要素を挿入する以外に選択肢はありません。

Angular は `trackBy` でこの激しい動きを避けることができます。
`NgForOf` が追跡 _すべき_ 値を返すメソッドをコンポーネントに追加します。
この場合、その値はヒーローの `id` です。

<code-example path="template-syntax/src/app/app.component.ts" region="trackByHeroes" header="src/app/app.component.ts" linenums="false">
</code-example>

マイクロシンタックスの式の中で、`trackBy` にこのメソッドをセットします。

<code-example path="template-syntax/src/app/app.component.html" region="trackBy" header="src/app/app.component.html" linenums="false">
</code-example>

次は、_trackBy_ の効果を表した図です。
"Reset heroes" は同じ `hero.id` をもつ新しいヒーローたちを作成します。
"Change ids" は新しい `hero.id` で新しいヒーローたちを作成します。

* `trackBy` がないと、両方のボタンで DOM 要素の完全な置き換えを引き起こします。
* `trackBy` があると、`id` を変更するだけで要素の置換が行われます。

<figure>
  <img src="generated/images/guide/template-syntax/ng-for-track-by-anim.gif" alt="trackBy">
</figure>


<hr/>

{@a ngSwitch}

### _NgSwitch_ ディレクティブ

*NgSwitch* は JavaScript の `switch` 文に似ています。
_スイッチ条件_ に基づいて、いくつかの要素の候補の中から _1つ_ の要素を表示できます。
Angular は *選択された* 要素だけを DOM に入れます。

次の例に示すように、*NgSwitch* は実際には3つの協調するディレクティブ、
`NgSwitch`、`NgSwitchCase`、および `NgSwitchDefault` のセットです。

<code-example path="template-syntax/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html" linenums="false">
</code-example>

<figure>
  <img src="generated/images/guide/template-syntax/switch-anim.gif" alt="trackBy">
</figure>

`NgSwitch` はコントローラーディレクティブです。*スイッチ値* を返す式をバインドしてください。
この例の `emotion` 値は文字列ですが、スイッチ値は任意の型にすることができます。

**`[ngSwitch]` にバインドしてください**。
`NgSwitch` は *構造* ディレクティブではなく *属性* ディレクティブであるため、`*ngSwitch` を設定しようとするとエラーが発生します。
それは対となるディレクティブの動作を変更します。
DOM には直接触れません。

**`*ngSwitchCase` と `*ngSwitchDefault` にバインドしてください**。
`NgSwitchCase` ディレクティブと `NgSwitchDefault` ディレクティブは、
DOM に対して要素を追加または削除するため、_構造_ ディレクティブです。

* `NgSwitchCase` は、バインドされた値がスイッチ値と等しい場合にその要素を DOM に追加します。
* `NgSwitchDefault` は、選択された `NgSwitchCase` がないときにその要素を DOM に追加します。

スイッチディレクティブは、*コンポーネントの要素* を追加したり削除したりするのに特に便利です。
この例では、`hero-switch.components.ts`
ファイルに定義されている4つの "emotional hero" コンポーネントを切り替えます。
各コンポーネントは、親コンポーネントの `currentHero` にバインドされている `hero` [入力プロパティ](guide/template-syntax#inputs-outputs "Input property") を持ちます。

スイッチディレクティブは、ネイティブ要素と Web コンポーネントに対しても同様に機能します。
たとえば、`<app-confused-hero>` スイッチのケースを次のように置き換えることができます。

<code-example path="template-syntax/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html" linenums="false">
</code-example>

<hr/>

{@a template-reference-variable}

{@a ref-vars}

{@a ref-var}

## テンプレート参照変数 ( <span class="syntax">#var</span> ) {@a template-reference-variables--var-}

**テンプレート参照変数** は多くの場合、テンプレート内の DOM 要素への参照です。
Angular コンポーネント、ディレクティブ、または
<a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">Web コンポーネント</a> への参照にすることもできます。

参照変数を宣言するには、ハッシュ記号 (#) を使用します。
`#phone` は、`<input>` 要素で `phone` 変数を宣言しています。

<code-example path="template-syntax/src/app/app.component.html" region="ref-var" header="src/app/app.component.html" linenums="false">
</code-example>

テンプレート内の _任意の場所_ で
テンプレート参照変数を参照できます。
この `<input>` で宣言された `phone` 変数はテンプレートの別の場所の `<button>` 内で使用されます

<code-example path="template-syntax/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html" linenums="false">
</code-example>

<h3 class="no-toc">参照変数がその値を取得する方法</h3>

ほとんどの場合、Angular は参照変数の値を宣言された要素に設定します。
前の例では、`phone` は _電話番号_ の `<input>` ボックスを参照しています。
電話ボタンのクリックハンドラーは、_入力_ 値をコンポーネントの `callPhone` メソッドに渡します。
しかし、ディレクティブはその振る舞いを変更し、他の何か (たとえば、それ自身) を値にセットすることができます。
`NgForm` ディレクティブはそれを行います。

次は、[フォーム](guide/forms) ガイドのフォームの例を *簡略化* したものです。

<code-example path="template-syntax/src/app/hero-form.component.html" header="src/app/hero-form.component.html" linenums="false">
</code-example>

この例では、テンプレート参照変数 `heroForm`
が3回出現し、大量の HTML で区切られています。
`heroForm` の値は何でしょうか?

`FormsModule` をインポートしたときに Angular がそれを引き継がなかった場合は、
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) になります。
実際には、`heroForm` は Angular の [NgForm](api/forms/NgForm "API: NgForm") ディレクティブへの参照で、
フォーム内のすべてのコントロールの値と有効性を追跡することができます。

ネイティブの `<form>` 要素は `form` プロパティを持ちません。
しかし、`NgForm` ディレクティブはそれを持ちます。
これは、`heroForm.form.valid` が無効な場合に送信ボタンを無効にし、
フォームコントロールツリー全体を親コンポーネントの `onSubmit` メソッドに渡す方法を説明したものです。

<h3 class="no-toc">テンプレート参照変数の警告に関する注意事項</h3>

テンプレート _参照_ 変数 (`#phone`) は、[`*ngFor`](guide/template-syntax#template-input-variable)
に見られるようなテンプレート _入力_ 変数 (`let phone`) と同じでは _ありません_。
[_構造ディレクティブ_](guide/structural-directives#template-input-variable) ガイドで違いを学んでください。

参照変数のスコープは _テンプレート全体_ です。
同じテンプレート内で同じ変数名を複数回定義しないでください。
実行時の値が予測できなくなります。

`＃` の代わりに `ref-` 接頭辞を使うことができます。
次の例では、`fax` 変数を `#fax` ではなく `ref-fax` として宣言しています。

<code-example path="template-syntax/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html" linenums="false">
</code-example>


<hr/>

{@a inputs-outputs}

## 入力、出力プロパティ

_入力_ プロパティは `@Input` デコレーターでアノテートされた _設定可能_ なプロパティです。
[プロパティバインディング](#property-binding) でデータバインドされている場合に値がプロパティに _流れ込みます_。

_出力_ プロパティは `@Output` デコレーターでアノテートされた _observable_ なプロパティです。
このプロパティはほとんどの場合 Angular の [`EventEmitter`](api/core/EventEmitter) を返します。
値は、[イベントバインディング](#event-binding) にバインドされたイベントとしてコンポーネントから _流れ出します_。

_入力_ プロパティと _出力_ プロパティを介してのみ、_他_ のコンポーネントまたはディレクティブにバインドできます。

<div class="alert is-important">

すべての **コンポーネント** は **ディレクティブ** であることを忘れないでください。

次のディスカッションでは、簡単に、_コンポーネント_ への参照について説明します。
なぜなら、このトピックはコンポーネントの作成者にとって主な問題になるからです。
</div>

<h3 class="no-toc">ディスカッション</h3>

通常、テンプレートに _それ自身のコンポーネントクラス_ をバインドしています。
このようなバインディング式では、コンポーネントのプロパティまたはメソッドは (`=`) の _右側_ にあります。

<code-example path="template-syntax/src/app/app.component.html" region="io-1" header="src/app/app.component.html" linenums="false">
</code-example>

`iconUrl` と `onSave` は `AppComponent` クラスのメンバーです。
それらは `@Input()` や `@Output` で装飾されて _いません_。
Angular は反対しません。

**コンポーネントの公開プロパティは、自身のテンプレートでいつでもバインドできます。**
_入力_ または _出力_ プロパティである必要はありません

コンポーネントのクラスとテンプレートは密接に関連しています。
それらは両方とも同じものの一部です。
それら _は_ 共にコンポーネントです。
コンポーネントクラスとそのテンプレートとの間のやり取りは、内部実装の詳細です。

### 別のコンポーネントにバインドする

_別の_ コンポーネントのプロパティにバインドすることもできます。
このようなバインディングでは、_他の_ コンポーネントのプロパティは (`=`) の _左側_ にあります。

次の例では、`AppComponent` テンプレートは、セレクターが `'app-hero-detail'` である `HeroDetailComponent` のプロパティに `AppComponent` のクラスメンバーをバインドします。

<code-example path="template-syntax/src/app/app.component.html" region="io-2" header="src/app/app.component.html" linenums="false">
</code-example>

Angular コンパイラは、次のようなエラーでこれらのバインディングを拒否することが _あります_。

<code-example language="sh" class="code-shell">
Uncaught Error: Template parse errors:
Can't bind to 'hero' since it isn't a known property of 'app-hero-detail'
</code-example>

あなたは `HeroDetailComponent` が `hero` と `deleteRequest` プロパティを持っていることを知っています。
しかし Angular コンパイラはそれらを認識しません。

**Angular コンパイラは、入力または出力プロパティでない限り、
別のコンポーネントのプロパティにバインドしません。**

このルールには正当な理由があります。

コンポーネントがそれ _自身_ のプロパティにバインドすることは問題ありません。
コンポーネント作成者はこれらのバインディングを完全に管理しています。

しかし、他のコンポーネントはそのような無制限のアクセスをもつべきではありません。
誰かがそのプロパティのいずれかにバインドすることができればあなたはあなたのコンポーネントをサポートするのに苦労するでしょう。
外部コンポーネントは、そのコンポーネントのパブリックバインディング API にしかバインドできないようにする必要があります。

Angular は、その API について _明確_ にするように求めます。
外部コンポーネントによるバインドに使用できるプロパティを決定するのは
_あなた_ 次第です。

### TypeScript の _public_ は重要ではありません

TypeScriptの _public_ および _private_
アクセス修飾子を使用してコンポーネントのパブリックバインディング API を作成することはできません。

<div class="alert is-important">

すべてのデータバインドプロパティは　TypeScript の _public_ プロパティである必要があります。
Angular は TypeScript の _private_ プロパティにはバインドしません。

</div>

Angularは、_外部_ コンポーネントがバインドを許可されているプロパティを識別するための他の方法を必要とします。
_他の方法_ とは、`@Input()` と `@Output()` デコレーターです。

### 入力プロパティと出力プロパティの宣言

このガイドのサンプルでは、​​データバインドプロパティに `@Input()` および `@Output()` デコレーターが付いているため、
`HeroDetailComponent` へのバインドは失敗しません。

<code-example path="template-syntax/src/app/hero-detail.component.ts" region="input-output-1" header="src/app/hero-detail.component.ts" linenums="false">
</code-example>

<div class="alert is-helpful">

あるいは、次の例のように、ディレクティブメタデータの
`inputs` 配列と `outputs` 配列のメンバーを識別することもできます:

<code-example path="template-syntax/src/app/hero-detail.component.ts" region="input-output-2" header="src/app/hero-detail.component.ts" linenums="false">
</code-example>

</div>

### 入力か出力か?

*入力* プロパティは通常、データ値を受け取ります。
*出力* プロパティは、`EventEmitter` オブジェクトなどのイベントプロデューサーを公開します。

_入力_ と _出力_ という用語は、ターゲットディレクティブの観点を反映しています。

<figure>
  <img src="generated/images/guide/template-syntax/input-output.png" alt="Inputs and outputs">
</figure>

`HeroDetailComponent.hero` は `HeroDetailComponent` から見た **入力** プロパティです。
データがテンプレートバインディング式からそのプロパティに *流れ込む* ためです。

`HeroDetailComponent.deleteRequest` は、`HeroDetailComponent` から見た **出力** プロパティです。
イベントがそのプロパティからテンプレートバインディング文のハンドラーに向かって *流れ出る* ためです。

<h3 id='aliasing-io'>
  入力/出力プロパティのエイリアシング
</h3>

入力/出力プロパティの公開名は、内部の名前とは異なる場合があります。

これは [属性ディレクティブ](guide/attribute-directives) の場合によくあります。
ディレクティブの利用者はディレクティブ名でバインドすることを期待します。
たとえば、`myClick` セレクター付きのディレクティブを `<div>` タグに適用すると、
`myClick` とも呼ばれるイベントプロパティにバインドすることになります。

<code-example path="template-syntax/src/app/app.component.html" region="myClick" header="src/app/app.component.html" linenums="false">
</code-example>

ただし、ディレクティブ名は、ディレクティブクラス内のプロパティ名としては不適切な選択です。
ディレクティブ名がプロパティの機能を説明することはめったにありません。
`myClick` ディレクティブ名は、クリックメッセージを発行するプロパティには適切な名前ではありません。

幸いなことに、内部的に別の名前を使用しながら、
あなたは慣習的な期待を満たすプロパティの公開名をもつことができます。
上の例では、実際には `myClick` エイリアスを *介して* ディレクティブ自身の
`clicks` プロパティにバインドしています。

次のように入力/出力デコレーターに渡すことで、プロパティ名のエイリアスを指定できます:

<code-example path="template-syntax/src/app/click.directive.ts" region="output-myClick" header="src/app/click.directive.ts" linenums="false">
</code-example>

<div class="alert is-helpful">

`inputs` および `outputs` 配列でプロパティ名をエイリアスすることもできます。
*左側* にディレクティブのプロパティ名、
*右側* にパブリックエイリアスを持ち、コロンで区切られた (`:`) 文字列を書きます:

<code-example path="template-syntax/src/app/click.directive.ts" region="output-myClick2" header="src/app/click.directive.ts" linenums="false">
</code-example>

</div>


<hr/>

{@a expression-operators}

## テンプレート式演算子

テンプレート式言語では、特定のシナリオ用にいくつかの特別な演算子を追加した JavaScript シンタックスのサブセットを採用しています。
次のセクションでは、これら2つの演算子 (_パイプ演算子_ と _セーフナビゲーション演算子_) について説明します。

{@a pipe}

### パイプ演算子 ( <span class="syntax">|</span> )

式の結果は、バインディングで使用する準備が整う前に、何らかの変換が必要になる場合があります。
たとえば、数値を通貨として表示したり、テキストを大文字にしたり、リストをフィルタして並べ替えることができます。

Angular の [パイプ](guide/pipes) は、このような小さな変換に適しています。
パイプは入力値を受け取り、変換された値を返す単純な関数です。
**パイプ演算子 (`|`)** を使用すると、テンプレート式内で簡単に適用できます:

<code-example path="template-syntax/src/app/app.component.html" region="pipes-1" header="src/app/app.component.html" linenums="false">
</code-example>

パイプ演算子は、左側の式の結果を右側のパイプ関数に渡します。

複数のパイプを通して式を連鎖することができます:

<code-example path="template-syntax/src/app/app.component.html" region="pipes-2" header="src/app/app.component.html" linenums="false">
</code-example>

また、パイプに [パラメータを適用する](guide/pipes#parameterizing-a-pipe) こともできます:

<code-example path="template-syntax/src/app/app.component.html" region="pipes-3" header="src/app/app.component.html" linenums="false">
</code-example>

`json` パイプはバインディングをデバッグするのに特に役立ちます:

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (pipes-json)" region="pipes-json">
</code-example>

生成された出力は次のようになります。

<code-example language="json">
  { "id": 0, "name": "Hercules", "emotion": "happy",
    "birthdate": "1970-02-25T08:00:00.000Z",
    "url": "http://www.imdb.com/title/tt0065832/",
    "rate": 325 }
</code-example>


<hr/>

{@a safe-navigation-operator}

### セーフナビゲーション演算子 ( <span class="syntax">?.</span> ) と null プロパティパス

Angular の **セーフナビゲーション演算子 (`?.`)**
は、プロパティパス内の null 値および undefined 値から保護するための優雅で便利な方法です。
次は、`currentHero` が null の場合にビューのレンダリングの失敗から保護します。

<code-example path="template-syntax/src/app/app.component.html" region="safe-2" header="src/app/app.component.html" linenums="false">
</code-example>

次の、`title` プロパティにバインドされたデータが null の場合はどうなるでしょうか?

<code-example path="template-syntax/src/app/app.component.html" region="safe-1" header="src/app/app.component.html" linenums="false">
</code-example>

ビューは引き続きレンダリングされますが、表示される値は空白です。"The title is" 以降は何も表示されません。
それは合理的な振る舞いです。少なくともアプリはクラッシュしません。

次の null ヒーローの `name` を表示する例のように、
テンプレート式にプロパティパスが含まれていると仮定します。

<code-example language="html">
  The null hero's name is {{nullHero.name}}
</code-example>

JavaScript は null 参照エラーをスローし、Angular も同様にスローします。

<code-example format="nocode">
  TypeError: Cannot read property 'name' of null in [null].
</code-example>

さらに悪いことに、*ビュー全体が消えます*。

これは、`hero` のプロパティが決して null にならない場合には合理的な動作です。
決して null であってはならず、それでも null であれば、
それは捕捉、修正されるべきプログラミングエラーです。
例外をスローするのは正しいことです。

一方、プロパティパスの null 値は、時々、特にデータが現状 null で、
最終的に到着するときには、問題ない場合があります。

データを待っている間、ビューは問題なくレンダリングされ、
null プロパティパスは `title` プロパティと同じように空白で表示されるべきです。

残念ながら、`currentHero` が null の場合、アプリはクラッシュします。

その問題を [*ngIf](guide/template-syntax#ngIf) で回避できます。

<code-example path="template-syntax/src/app/app.component.html" region="safe-4" header="src/app/app.component.html" linenums="false">
</code-example>

最初の null が見つかったときに式が無効になることを知っているので、
プロパティパスの一部を `&&` で連結することを試みることができます。

<code-example path="template-syntax/src/app/app.component.html" region="safe-5" header="src/app/app.component.html" linenums="false">
</code-example>

これらのアプローチにはメリットがありますが、特にプロパティパスが長いときは面倒かもしれません。
`a.b.c.d` のような長いプロパティパスのどこかで null に対する保護をすることを想像してみてください。

Angular のセーフナビゲーション演算子 (`?.`) は、プロパティパス内の null を防ぐためのより優雅で便利な方法です。
最初の null 値に到達すると、式は無効になります。
表示は空白ですが、アプリはエラーなく動作し続けます。

<code-example path="template-syntax/src/app/app.component.html" region="safe-6" header="src/app/app.component.html" linenums="false">
</code-example>

それは `a?.b?.c?.d` のような長いプロパティパスで完璧に動作します。


<hr/>

{@a non-null-assertion-operator}

### 非 null アサーション演算子 ( <span class="syntax">!</span> )

Typescript 2.0以降では、`--strictNullChecks` フラグを使用して [厳密な null チェック](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript") を強制できます。TypeScript は、変数が _意図せずに_ null または undefined にならないようにします。

このモードでは、型付き変数はデフォルトで _null_ および _undefined_ を許可しません。型チェッカーは、変数を未割り当てのままにしたり、型が _null_ および _undefined_ を許可しない変数に _null_ または _undefined_ を代入しようとした場合にエラーをスローします。

実行時に変数が null または undefined になるかを判断できない場合も、型チェッカーはエラーをスローします。
あなたはそれが起こり得ないことを知っているかもしれませんが、型チェッカーは知りません。
あなたは
[_非 null アサーション演算子 (!)_](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator") を後に追加することによってそれが起こり得ないことを型チェッカーに伝えます、

_Angular_ の **非 null アサーション演算子 (`!`)** は、Angular テンプレート内で同じ目的を果たします。

たとえば、[*ngIf](guide/template-syntax#ngIf) を使用して `hero` が定義されていることを確認したら、
`hero` のプロパティも定義されていることを表明できます。

<code-example path="template-syntax/src/app/app.component.html" region="non-null-assertion-1" header="src/app/app.component.html" linenums="false">
</code-example>

Angular コンパイラがテンプレートを TypeScript コードに変換するときに、
`hero.name` が null または undefined の可能性があることを TypeScript が報告しなくなります。

[_セーフナビゲーション演算子_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")
とは異なり、**非 null アサーション演算子** は null または undefined に対して保護しません。
そうではなく、TypeScript 型チェッカーに、特定のプロパティ式に対する厳密な null チェックを中断するように指示します。

厳密な null チェックを有効にするとき、このテンプレート演算子が必要になります。それ以外はオプションです。


<a href="#top-of-page">トップに戻る</a>

<hr/>

{@a built-in-template-functions}

## ビルトインテンプレート関数

{@a any-type-cast-function}

### `$any()` 型キャスト関数

[AOT コンパイル](guide/aot-compiler) 中にバインディング式が型エラーを引き起こし、かつ型を完全に指定することが不可能または困難である場合があります。
エラーを止めるには、次の例のように `$any()` キャスト関数を使用して式を
[`any` 型](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) にキャストします:

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html" linenums="false">
</code-example>

Angular コンパイラがこのテンプレートを TypeScript コードに変換するとき、
そのテンプレートに対して型チェックを実行したときに、
`bestByDate` が `item` オブジェクトのメンバーではないことが TypeScript から報告されなくなります。

`$any()` キャスト関数も `this`
と連携して、コンポーネントの宣言されていないメンバーへのアクセスを許可します。

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html" linenums="false">
</code-example>

`$any()` キャスト関数は、メソッド呼び出しが有効なバインディング式のどこでも機能します。
