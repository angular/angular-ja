# 補間とテンプレート式

補間を使用すると、計算された文字列を HTML 要素タグ間および属性割り当て内のテキストに組み込むことができます。
テンプレート式は、
これらの文字列を計算するために使用するものです。

<div class="alert is-helpful">

See the <live-example></live-example> for all of
the syntax and code snippets in this guide.

</div>

## 補間 `{{...}}`

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
ただし、補間は Angular が *プロパティバインディング* に変換する特別な構文です。

<div class="alert is-helpful">

`{{` および `}}` 以外のものを使用する場合は、
`Component` メタデータの
[interpolation](api/core/Component#interpolation)
オプションを使用して補間の区切り文字を設定できます。

</div>

## テンプレート式 {@a template-expressions}

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
* `|`、`?.` や `!` などの新しい[テンプレート式演算子](guide/template-expression-operators)を持ちます

## 式のコンテキスト

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

## 式のガイドライン

テンプレート式を使う場合は、次のガイドラインにしたがってください:

* [シンプルさ](guide/interpolation#simplicity)
* [素早い実行](guide/interpolation#quick-execution)
* [副作用を起こさない](guide/interpolation#no-visible-side-effects)

### シンプルさ {@a simplicity}

複雑なテンプレート式を書くことは可能ですが、
避けることをお勧めします。

プロパティ名、またはメソッド呼び出しは標準的であるべきです、しかし、必要なときには真偽値の否定 `!` はよいでしょう。
それ以外の場合、アプリケーションとビジネスロジックをコンポーネントに限定してください。
そうすることで、コンポーネントの開発とテストが容易になります。

### 素早い実行 {@a quick-execution}

Angular はすべての変更検知サイクルの後にテンプレート式を実行します。
変更検知サイクルは、Promise の解決、HTTP の結果、タイマーイベント、
キープレス、マウスの移動などの多くの非同期アクティビティによって引き起こされます。

特に遅いデバイスでは、式が早く終了しなければユーザー体験が低下する可能性があります。
計算コストが高い場合、値をキャッシュすることを検討してください。

### 副作用を起こさない {@a no-visible-side-effects}

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

`*ngFor` に適用される振る舞いについて1つ例外があります。`*ngFor` には、繰り返しをまたいだときに、参照の違うオブジェクトを処理できる `trackBy` 機能があります。詳しくは、このガイドの [`trackBy` を使用した *ngFor](guide/built-in-directives#ngfor-with-trackby) セクションを参照してください。

</div>
