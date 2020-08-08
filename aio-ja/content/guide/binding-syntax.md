
# バインディング構文: 概要

データバインディングは、アプリケーションのデータ値を使用して、
ユーザーに表示される内容を調整するための仕組みです。
HTML に値をプッシュしたり、プルしたりすることはできますが、
これらの雑用をバインディングフレームワークに任せることで、アプリケーションの読み書きや保守が簡単になります。
あなたはバインディングソースとターゲット HTML 要素の間のバインディングを宣言するだけで、あとはフレームワークにお任せです。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

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
{@a html-attribute-vs-dom-property}

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

