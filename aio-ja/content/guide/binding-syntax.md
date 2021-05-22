
# バインディング構文

データバインディングは、アプリケーションの状態に基づいて自動的にページを最新の状態に保ちます。
データバインディングを使用して、画像のソース、ボタンの状態、特定のユーザーのデータなどを指定することができます。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>


### データバインディングとHTML {@a data-binding-and-html}

Developers can customize HTML by specifying attributes with string values.
In the following example, `class`, `src`, and `disabled` modify the `<div>`, `<img>`, and `<button>` elements respectively.

```html
<div class="special">Plain old HTML</div>
<img src="images/item.png">
<button disabled>Save</button>
```

データバインディングを使えば、ボタンの状態などを制御することができます:

<code-example path="binding-syntax/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

バインディングの対象は、ボタンの DOM 要素の `disabled` プロパティで、属性ではないことに注意してください。
データバインディングは、DOM 要素、コンポーネント、ディレクティブのプロパティに対するもので、HTML属性に対するものではありません。

{@a html-attribute-vs-dom-property}

### HTML属性とDOMプロパティ

Angular binding distinguishes between HTML attributes and DOM properties.

Attributes initialize DOM properties and you can configure them to modify an element's behavior.
Properties are features of DOM nodes.

* いくつかの HTML 属性は、プロパティへの1対1のマッピングを持っています。`id` はその一例です。

* 一部の HTML 属性には対応するプロパティがありません。`aria-*` はその一例です。

* 一部の DOM プロパティには対応する属性がありません。`textContent` はその一例です。

<div class="alert is-important">

たとえ同じ名前だったとしても、 *HTML 属性* と *DOM プロパティ* は別物だということを肝に銘じておきましょう。

</div>

Angular での HTML 属性の役割は、要素やディレクティブの状態を初期化することだけです。

データバインディングを書くときは、対象のオブジェクトの DOMプロパティとイベントだけを扱います。

#### 例 1: `<input>`

ブラウザが `<input type="text" value="Sarah">` をレンダリングするとき、
ブラウザは `value` プロパティが "Sarah" で初期化された DOM ノードを作ります。

```html
<input type="text" value="Sarah">
```

ユーザーが `<input>` に「Sally」と入力すると、DOM 要素の `value` プロパティは「Sally」になります。
しかし、`input.getAttribute('value')` で HTML の `value` 属性を見れば分かるとおり、 *属性* は変わらず「Sarah」のままです。

HTML 属性の `value` は *初期値* を指定します。DOM の `value` プロパティは *現在* の値です。

実際に動くアプリケーションで属性と DOM プロパティの違いを見るには、<live-example name="binding-syntax"></live-example> のバインディング構文を見てください。

#### 例 2: disabled ボタン

ボタンの `disabled` *プロパティ* のデフォルトは `false` なので、ボタンは有効な状態です。

`disabled` *属性* を追加すると、その存在だけでボタンの`disabled` *プロパティ* が `true` に初期化されるため、ボタンは無効になります。

```html
<button disabled>Test Button</button>
```

`disabled` *属性* の追加と削除で、ボタンの無効、有効が切り換わります。
しかし *属性* の値とは無関係なため、`<button disabled="false">Still Disabled</button>` と書いてボタンを有効にすることはできません。

ボタンの状態を制御するには `disabled` *プロパティ* を設定します。

#### Property and attribute comparison

技術的には属性バインディング `[attr.disabled]` を設定することはできますが、値は次のように異なります。プロパティバインディングが真偽値を必要とするのに対して、対応する属性バインディングは、値が `null` かそうでないかを見ています。
Consider the following:

```html
<input [disabled]="condition ? true : false">
<input [attr.disabled]="condition ? 'disabled' : null">
```

The first line, which uses the `disabled` property, uses a boolean value.
The second line, which uses the disabled attribute checks for `null`.

一般的には、属性バインディングよりもプロパティバインディングを使ったほうが、ブーリアンの値なのでより直感的で、構文も短く、パフォーマンスもよいです。

実際に動くアプリケーションで `disabled` ボタンの動作を見るには、<live-example></live-example> のバインディング構文を見てください。
この例ではコンポーネントから disabled プロパティをトグルする方法を示しています。


## Types of data binding

Angularは、データフローの方向に応じて3つのカテゴリーのデータバインディングを提供します。

* ソースからビューへ
* ビューからソースへ
* 双方向シーケンス

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


Binding types other than interpolation have a target name to the left of the equal sign.
The target of a binding is a property or event, which you surround with square brackets, `[]`, parentheses, `()`, or both, `[()]`.

The binding punctuation of `[]`, `()`, `[()]`, and the prefix specify the direction of data flow.

* Use `[]` to bind from source to view.
* Use `()` to bind from view to source.
* Use `[()]` to bind in a two way sequence of view to source to view.


Place the expression or statement to the right of the equal sign within double quotes, `""`.
For more information see [Interpolation](guide/interpolation) and [Template statements](guide/template-statements).

## バインディングタイプとターゲット {@a binding-types-and-targets}

The target of a data binding can be a property, an event, or an attribute name.
Every public member of a source directive is automatically available for binding in a template expression or statement.
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
