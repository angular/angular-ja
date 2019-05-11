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
* いくつかの ES2015+ オペレーター

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
  <img src='generated/images/guide/event-binding/syntax-diagram.svg' alt="Syntax diagram">
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


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" linenums="false" header="src/app/item-detail/item-detail.component.ts (template)" region="line-through">
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

## Built-in _structural_ directives

Structural directives are responsible for HTML layout.
They shape or reshape the DOM's _structure_, typically by adding, removing, and manipulating
the host elements to which they are attached.

The deep details of structural directives are covered in the
[_Structural Directives_](guide/structural-directives) guide
where you'll learn:

* why you
[_prefix the directive name with an asterisk_ (\*)](guide/structural-directives#asterisk "The * in *ngIf").
* to use [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
to group elements when there is no suitable host element for the directive.
* how to write your own structural directive.
* that you can only apply [one structural directive](guide/structural-directives#one-per-element "one per host element") to an element.

_This_ section is an introduction to the common structural directives:

* [`NgIf`](guide/template-syntax#ngIf) - conditionally add or remove an element from the DOM
* [`NgSwitch`](guide/template-syntax#ngSwitch) - a set of directives that switch among alternative views
* [NgForOf](guide/template-syntax#ngFor) - repeat a template for each item in a list

<hr/>

{@a ngIf}

### NgIf

You can add or remove an element from the DOM by applying an `NgIf` directive to
that element (called the _host element_).
Bind the directive to a condition expression like `isActive` in this example.

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-critical">

Don't forget the asterisk (`*`) in front of `ngIf`.

</div>

When the `isActive` expression returns a truthy value, `NgIf` adds the `HeroDetailComponent` to the DOM.
When the expression is falsy, `NgIf` removes the `HeroDetailComponent`
from the DOM, destroying that component and all of its sub-components.

#### Show/hide is not the same thing

You can control the visibility of an element with a
[class](guide/template-syntax#class-binding) or [style](guide/template-syntax#style-binding) binding:

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html" linenums="false">
</code-example>

Hiding an element is quite different from removing an element with `NgIf`.

When you hide an element, that element and all of its descendents remain in the DOM.
All components for those elements stay in memory and
Angular may continue to check for changes.
You could be holding onto considerable computing resources and degrading performance,
for something the user can't see.

When `NgIf` is `false`, Angular removes the element and its descendents from the DOM.
It destroys their components, potentially freeing up substantial resources,
resulting in a more responsive user experience.

The show/hide technique is fine for a few elements with few children.
You should be wary when hiding large component trees; `NgIf` may be the safer choice.

#### Guard against null

The `ngIf` directive is often used to guard against null.
Show/hide is useless as a guard.
Angular will throw an error if a nested expression tries to access a property of `null`.

Here we see `NgIf` guarding two `<div>`s.
The `currentHero` name will appear only when there is a `currentHero`.
The `nullHero` will never be displayed.

<code-example path="template-syntax/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

See also the
[_safe navigation operator_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)")
described below.

</div>


<hr/>

{@a ngFor}

### NgForOf

`NgForOf` is a _repeater_ directive &mdash; a way to present a list of items.
You define a block of HTML that defines how a single item should be displayed.
You tell Angular to use that block as a template for rendering each item in the list.

Here is an example of `NgForOf` applied to a simple `<div>`:

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html" linenums="false">
</code-example>

You can also apply an `NgForOf` to a component element, as in this example:

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-critical">

Don't forget the asterisk (`*`) in front of `ngFor`.

</div>

The text assigned to `*ngFor` is the instruction that guides the repeater process.

{@a microsyntax}

#### *ngFor microsyntax

The string assigned to `*ngFor` is not a [template expression](guide/template-syntax#template-expressions).
It's a *microsyntax* &mdash; a little language of its own that Angular interprets.
The string `"let hero of heroes"` means:

> *Take each hero in the `heroes` array, store it in the local `hero` looping variable, and
make it available to the templated HTML for each iteration.*

Angular translates this instruction into a `<ng-template>` around the host element,
then uses this template repeatedly to create a new set of elements and bindings for each `hero`
in the list.

Learn about the _microsyntax_ in the [_Structural Directives_](guide/structural-directives#microsyntax) guide.

{@a template-input-variable}

{@a template-input-variables}

### Template input variables

The `let` keyword before `hero` creates a _template input variable_ called `hero`.
The `NgForOf` directive iterates over the `heroes` array returned by the parent component's `heroes` property
and sets `hero` to the current item from the array during each iteration.

You reference the `hero` input variable within the `NgForOf` host element
(and within its descendants) to access the hero's properties.
Here it is referenced first in an interpolation
and then passed in a binding to the `hero` property of the `<hero-detail>` component.

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html" linenums="false">
</code-example>

Learn more about _template input variables_ in the
[_Structural Directives_](guide/structural-directives#template-input-variable) guide.

#### *ngFor with _index_

The `index` property of the `NgForOf` directive context returns the zero-based index of the item in each iteration.
You can capture the `index` in a template input variable and use it in the template.

The next example captures the `index` in a variable named `i` and displays it with the hero name like this.

<code-example path="template-syntax/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html" linenums="false">
</code-example>

<div class="alert is-helpful">

`NgFor` is implemented by the `NgForOf` directive. Read more about the other `NgForOf` context values such as `last`, `even`,
and `odd` in the [NgForOf API reference](api/common/NgForOf).

</div>

{@a trackBy}

#### *ngFor with _trackBy_

The `NgForOf` directive may perform poorly, especially with large lists.
A small change to one item, an item removed, or an item added can trigger a cascade of DOM manipulations.

For example, re-querying the server could reset the list with all new hero objects.

Most, if not all, are previously displayed heroes.
*You* know this because the `id` of each hero hasn't changed.
But Angular sees only a fresh list of new object references.
It has no choice but to tear down the old DOM elements and insert all new DOM elements.

Angular can avoid this churn with `trackBy`.
Add a method to the component that returns the value `NgForOf` _should_ track.
In this case, that value is the hero's `id`.

<code-example path="template-syntax/src/app/app.component.ts" region="trackByHeroes" header="src/app/app.component.ts" linenums="false">
</code-example>

In the microsyntax expression, set `trackBy` to this method.

<code-example path="template-syntax/src/app/app.component.html" region="trackBy" header="src/app/app.component.html" linenums="false">
</code-example>

Here is an illustration of the _trackBy_ effect.
"Reset heroes" creates new heroes with the same `hero.id`s.
"Change ids" creates new heroes with new `hero.id`s.

* With no `trackBy`, both buttons trigger complete DOM element replacement.
* With `trackBy`, only changing the `id` triggers element replacement.

<figure>
  <img src="generated/images/guide/template-syntax/ng-for-track-by-anim.gif" alt="trackBy">
</figure>


<hr/>

{@a ngSwitch}

### The _NgSwitch_ directives

*NgSwitch* is like the JavaScript `switch` statement.
It can display _one_ element from among several possible elements, based on a _switch condition_.
Angular puts only the *selected* element into the DOM.

*NgSwitch* is actually a set of three, cooperating directives:
`NgSwitch`, `NgSwitchCase`, and `NgSwitchDefault` as seen in this example.

<code-example path="template-syntax/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html" linenums="false">
</code-example>

<figure>
  <img src="generated/images/guide/template-syntax/switch-anim.gif" alt="trackBy">
</figure>

`NgSwitch` is the controller directive. Bind it to an expression that returns the *switch value*.
The `emotion` value in this example is a string, but the switch value can be of any type.

**Bind to `[ngSwitch]`**. You'll get an error if you try to set `*ngSwitch` because
`NgSwitch` is an *attribute* directive, not a *structural* directive.
It changes the behavior of its companion directives.
It doesn't touch the DOM directly.

**Bind to `*ngSwitchCase` and `*ngSwitchDefault`**.
The `NgSwitchCase` and `NgSwitchDefault` directives are _structural_ directives
because they add or remove elements from the DOM.

* `NgSwitchCase` adds its element to the DOM when its bound value equals the switch value.
* `NgSwitchDefault` adds its element to the DOM when there is no selected `NgSwitchCase`.

The switch directives are particularly useful for adding and removing *component elements*.
This example switches among four "emotional hero" components defined in the `hero-switch.components.ts` file.
Each component has a `hero` [input property](guide/template-syntax#inputs-outputs "Input property")
which is bound to the `currentHero` of the parent component.

Switch directives work as well with native elements and web components too.
For example, you could replace the `<confused-hero>` switch case with the following.

<code-example path="template-syntax/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html" linenums="false">
</code-example>

<hr/>

{@a template-reference-variable}

{@a ref-vars}

{@a ref-var}

## Template reference variables ( <span class="syntax">#var</span> )

A **template reference variable** is often a reference to a DOM element within a template.
It can also be a reference to an Angular component or directive or a
<a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web component</a>.

Use the hash symbol (#) to declare a reference variable.
The `#phone` declares a `phone` variable on an `<input>` element.

<code-example path="template-syntax/src/app/app.component.html" region="ref-var" header="src/app/app.component.html" linenums="false">
</code-example>

You can refer to a template reference variable _anywhere_ in the template.
The `phone` variable declared on this `<input>` is
consumed in a `<button>` on the other side of the template

<code-example path="template-syntax/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html" linenums="false">
</code-example>

<h3 class="no-toc">How a reference variable gets its value</h3>

In most cases, Angular sets the reference variable's value to the element on which it was declared.
In the previous example, `phone` refers to the _phone number_ `<input>` box.
The phone button click handler passes the _input_ value to the component's `callPhone` method.
But a directive can change that behavior and set the value to something else, such as itself.
The `NgForm` directive does that.

The following is a *simplified* version of the form example in the [Forms](guide/forms) guide.

<code-example path="template-syntax/src/app/hero-form.component.html" header="src/app/hero-form.component.html" linenums="false">
</code-example>

A template reference variable, `heroForm`, appears three times in this example, separated
by a large amount of HTML.
What is the value of `heroForm`?

If Angular hadn't taken it over when you imported the `FormsModule`,
it would be the [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement).
The `heroForm` is actually a reference to an Angular [NgForm](api/forms/NgForm "API: NgForm")
directive with the ability to track the value and validity of every control in the form.

The native `<form>` element doesn't have a `form` property.
But the `NgForm` directive does, which explains how you can disable the submit button
if the `heroForm.form.valid` is invalid and pass the entire form control tree
to the parent component's `onSubmit` method.

<h3 class="no-toc">Template reference variable warning notes</h3>

A template _reference_ variable (`#phone`) is _not_ the same as a template _input_ variable (`let phone`)
such as you might see in an [`*ngFor`](guide/template-syntax#template-input-variable).
Learn the difference in the [_Structural Directives_](guide/structural-directives#template-input-variable) guide.

The scope of a reference variable is the _entire template_.
Do not define the same variable name more than once in the same template.
The runtime value will be unpredictable.

You can use the `ref-` prefix alternative to `#`.
This example declares the `fax` variable as `ref-fax` instead of `#fax`.

<code-example path="template-syntax/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html" linenums="false">
</code-example>


<hr/>

{@a inputs-outputs}

## Input and Output properties

An _Input_ property is a _settable_ property annotated with an `@Input` decorator.
Values flow _into_ the property when it is data bound with a [property binding](#property-binding)

An _Output_ property is an _observable_ property annotated with an `@Output` decorator.
The property almost always returns an Angular [`EventEmitter`](api/core/EventEmitter).
Values flow _out_ of the component as events bound with an [event binding](#event-binding).

You can only bind to _another_ component or directive through its _Input_ and _Output_ properties.

<div class="alert is-important">

Remember that all **components** are **directives**.

The following discussion refers to _components_ for brevity and
because this topic is mostly a concern for component authors.
</div>

<h3 class="no-toc">Discussion</h3>

You are usually binding a template to its _own component class_.
In such binding expressions, the component's property or method is to the _right_ of the (`=`).

<code-example path="template-syntax/src/app/app.component.html" region="io-1" header="src/app/app.component.html" linenums="false">
</code-example>

The `iconUrl` and `onSave` are members of the `AppComponent` class.
They are _not_ decorated with `@Input()` or `@Output`.
Angular does not object.

**You can always bind to a public property of a component in its own template.**
It doesn't have to be an _Input_ or _Output_ property

A component's class and template are closely coupled.
They are both parts of the same thing.
Together they _are_ the component.
Exchanges between a component class and its template are internal implementation details.

### Binding to a different component

You can also bind to a property of a _different_ component.
In such bindings, the _other_ component's property is to the _left_ of the (`=`).

In the following example, the `AppComponent` template binds `AppComponent` class members to properties of the `HeroDetailComponent` whose selector is `'app-hero-detail'`.

<code-example path="template-syntax/src/app/app.component.html" region="io-2" header="src/app/app.component.html" linenums="false">
</code-example>

The Angular compiler _may_ reject these bindings with errors like this one:

<code-example language="sh" class="code-shell">
Uncaught Error: Template parse errors:
Can't bind to 'hero' since it isn't a known property of 'app-hero-detail'
</code-example>

You know that `HeroDetailComponent` has `hero` and `deleteRequest` properties.
But the Angular compiler refuses to recognize them.

**The Angular compiler won't bind to properties of a different component
unless they are Input or Output properties**.

There's a good reason for this rule.

It's OK for a component to bind to its _own_ properties.
The component author is in complete control of those bindings.

But other components shouldn't have that kind of unrestricted access.
You'd have a hard time supporting your component if anyone could bind to any of its properties.
Outside components should only be able to bind to the component's public binding API.

Angular asks you to be _explicit_ about that API.
It's up to _you_ to decide which properties are available for binding by
external components.

#### TypeScript _public_ doesn't matter

You can't use the TypeScript _public_ and _private_ access modifiers to
shape the component's public binding API.

<div class="alert is-important">

All data bound properties must be TypeScript _public_ properties.
Angular never binds to a TypeScript _private_ property.

</div>

Angular requires some other way to identify properties that _outside_ components are allowed to bind to.
That _other way_ is the `@Input()` and `@Output()` decorators.

### Declaring Input and Output properties

In the sample for this guide, the bindings to `HeroDetailComponent` do not fail
because the data bound properties are annotated with `@Input()` and `@Output()` decorators.

<code-example path="template-syntax/src/app/hero-detail.component.ts" region="input-output-1" header="src/app/hero-detail.component.ts" linenums="false">
</code-example>

<div class="alert is-helpful">

Alternatively, you can identify members in the `inputs` and `outputs` arrays
of the directive metadata, as in this example:

<code-example path="template-syntax/src/app/hero-detail.component.ts" region="input-output-2" header="src/app/hero-detail.component.ts" linenums="false">
</code-example>

</div>

### Input or output?

*Input* properties usually receive data values.
*Output* properties expose event producers, such as `EventEmitter` objects.

The terms _input_ and _output_ reflect the perspective of the target directive.

<figure>
  <img src="generated/images/guide/template-syntax/input-output.png" alt="Inputs and outputs">
</figure>

`HeroDetailComponent.hero` is an **input** property from the perspective of `HeroDetailComponent`
because data flows *into* that property from a template binding expression.

`HeroDetailComponent.deleteRequest` is an **output** property from the perspective of `HeroDetailComponent`
because events stream *out* of that property and toward the handler in a template binding statement.

<h3 id='aliasing-io'>
  Aliasing input/output properties
</h3>

Sometimes the public name of an input/output property should be different from the internal name.

This is frequently the case with [attribute directives](guide/attribute-directives).
Directive consumers expect to bind to the name of the directive.
For example, when you apply a directive with a `myClick` selector to a `<div>` tag,
you expect to bind to an event property that is also called `myClick`.

<code-example path="template-syntax/src/app/app.component.html" region="myClick" header="src/app/app.component.html" linenums="false">
</code-example>

However, the directive name is often a poor choice for the name of a property within the directive class.
The directive name rarely describes what the property does.
The `myClick` directive name is not a good name for a property that emits click messages.

Fortunately, you can have a public name for the property that meets conventional expectations,
while using a different name internally.
In the example immediately above, you are actually binding *through the* `myClick` *alias* to
the directive's own `clicks` property.

You can specify the alias for the property name by passing it into the input/output decorator like this:

<code-example path="template-syntax/src/app/click.directive.ts" region="output-myClick" header="src/app/click.directive.ts" linenums="false">
</code-example>

<div class="alert is-helpful">

You can also alias property names in the `inputs` and `outputs` arrays.
You write a colon-delimited (`:`) string with
the directive property name on the *left* and the public alias on the *right*:

<code-example path="template-syntax/src/app/click.directive.ts" region="output-myClick2" header="src/app/click.directive.ts" linenums="false">
</code-example>

</div>


<hr/>

{@a expression-operators}

## Template expression operators

The template expression language employs a subset of JavaScript syntax supplemented with a few special operators
for specific scenarios. The next sections cover two of these operators: _pipe_ and _safe navigation operator_.

{@a pipe}

### The pipe operator ( <span class="syntax">|</span> )

The result of an expression might require some transformation before you're ready to use it in a binding.
For example, you might display a number as a currency, force text to uppercase, or filter a list and sort it.

Angular [pipes](guide/pipes) are a good choice for small transformations such as these.
Pipes are simple functions that accept an input value and return a transformed value.
They're easy to apply within template expressions, using the **pipe operator (`|`)**:

<code-example path="template-syntax/src/app/app.component.html" region="pipes-1" header="src/app/app.component.html" linenums="false">
</code-example>

The pipe operator passes the result of an expression on the left to a pipe function on the right.

You can chain expressions through multiple pipes:

<code-example path="template-syntax/src/app/app.component.html" region="pipes-2" header="src/app/app.component.html" linenums="false">
</code-example>

And you can also [apply parameters](guide/pipes#parameterizing-a-pipe) to a pipe:

<code-example path="template-syntax/src/app/app.component.html" region="pipes-3" header="src/app/app.component.html" linenums="false">
</code-example>

The `json` pipe is particularly helpful for debugging bindings:

<code-example path="template-syntax/src/app/app.component.html" linenums="false" header="src/app/app.component.html (pipes-json)" region="pipes-json">
</code-example>

The generated output would look something like this

<code-example language="json">
  { "id": 0, "name": "Hercules", "emotion": "happy",
    "birthdate": "1970-02-25T08:00:00.000Z",
    "url": "http://www.imdb.com/title/tt0065832/",
    "rate": 325 }
</code-example>


<hr/>

{@a safe-navigation-operator}

### The safe navigation operator ( <span class="syntax">?.</span> ) and null property paths

The Angular **safe navigation operator (`?.`)** is a fluent and convenient way to
guard against null and undefined values in property paths.
Here it is, protecting against a view render failure if the `currentHero` is null.

<code-example path="template-syntax/src/app/app.component.html" region="safe-2" header="src/app/app.component.html" linenums="false">
</code-example>

What happens when the following data bound `title` property is null?

<code-example path="template-syntax/src/app/app.component.html" region="safe-1" header="src/app/app.component.html" linenums="false">
</code-example>

The view still renders but the displayed value is blank; you see only "The title is" with nothing after it.
That is reasonable behavior. At least the app doesn't crash.

Suppose the template expression involves a property path, as in this next example
that displays the `name` of a null hero.

<code-example language="html">
  The null hero's name is {{nullHero.name}}
</code-example>

JavaScript throws a null reference error, and so does Angular:

<code-example format="nocode">
  TypeError: Cannot read property 'name' of null in [null].
</code-example>

Worse, the *entire view disappears*.

This would be reasonable behavior if the `hero` property could never be null.
If it must never be null and yet it is null,
that's a programming error that should be caught and fixed.
Throwing an exception is the right thing to do.

On the other hand, null values in the property path may be OK from time to time,
especially when the data are null now and will arrive eventually.

While waiting for data, the view should render without complaint, and
the null property path should display as blank just as the `title` property does.

Unfortunately, the app crashes when the `currentHero` is null.

You could code around that problem with [*ngIf](guide/template-syntax#ngIf).

<code-example path="template-syntax/src/app/app.component.html" region="safe-4" header="src/app/app.component.html" linenums="false">
</code-example>

You could try to chain parts of the property path with `&&`, knowing that the expression bails out
when it encounters the first null.

<code-example path="template-syntax/src/app/app.component.html" region="safe-5" header="src/app/app.component.html" linenums="false">
</code-example>

These approaches have merit but can be cumbersome, especially if the property path is long.
Imagine guarding against a null somewhere in a long property path such as `a.b.c.d`.

The Angular safe navigation operator (`?.`) is a more fluent and convenient way to guard against nulls in property paths.
The expression bails out when it hits the first null value.
The display is blank, but the app keeps rolling without errors.

<code-example path="template-syntax/src/app/app.component.html" region="safe-6" header="src/app/app.component.html" linenums="false">
</code-example>

It works perfectly with long property paths such as `a?.b?.c?.d`.


<hr/>

{@a non-null-assertion-operator}

### The non-null assertion operator ( <span class="syntax">!</span> )

As of Typescript 2.0, you can enforce [strict null checking](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript") with the `--strictNullChecks` flag. TypeScript then ensures that no variable is _unintentionally_ null or undefined.

In this mode, typed variables disallow null and undefined by default. The type checker throws an error if you leave a variable unassigned or try to assign null or undefined to a variable whose type disallows null and undefined.

The type checker also throws an error if it can't determine whether a variable will be null or undefined at runtime.
You may know that can't happen but the type checker doesn't know.
You tell the type checker that it can't happen by applying the post-fix
[_non-null assertion operator (!)_](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator").

The _Angular_ **non-null assertion operator (`!`)** serves the same purpose in an Angular template.

For example, after you use [*ngIf](guide/template-syntax#ngIf) to check that `hero` is defined, you can assert that
`hero` properties are also defined.

<code-example path="template-syntax/src/app/app.component.html" region="non-null-assertion-1" header="src/app/app.component.html" linenums="false">
</code-example>

When the Angular compiler turns your template into TypeScript code,
it prevents TypeScript from reporting that `hero.name` might be null or undefined.

Unlike the [_safe navigation operator_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)"),
the **non-null assertion operator** does not guard against null or undefined.
Rather it tells the TypeScript type checker to suspend strict null checks for a specific property expression.

You'll need this template operator when you turn on strict null checks. It's optional otherwise.


<a href="#top-of-page">back to top</a>

<hr/>

{@a built-in-template-functions}

## Built-in template functions

{@a any-type-cast-function}

### The `$any()` type cast function

Sometimes a binding expression triggers a type error during [AOT compilation](guide/aot-compiler) and it is not possible or difficult
to fully specify the type. To silence the error, you can use the `$any()` cast function to cast
the expression to [the `any` type](http://www.typescriptlang.org/docs/handbook/basic-types.html#any) as in the following example:

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html" linenums="false">
</code-example>

When the Angular compiler turns this template into TypeScript code,
it prevents TypeScript from reporting that `bestByDate` is not a member of the `item`
object when it runs type checking on the template.

The `$any()` cast function also works with `this` to allow access to undeclared members of
the component.

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html" linenums="false">
</code-example>

The `$any()` cast function works anywhere in a binding expression where a method call is valid.
