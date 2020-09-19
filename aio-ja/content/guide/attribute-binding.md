# 属性、クラス、スタイルのバインディング

テンプレート構文には、プロパティ・バインディングがあまり適していないシナリオのために、特殊な単方向バインディングがあります。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>


## 属性バインディング {@a attribute-binding}

**属性バインディング** を使うと属性の値を直接設定できます。これは、バインディングがターゲット・プロパティを設定するというルールの唯一の例外であり、属性を作成して設定する唯一のバインディングです。

通常は、文字列で属性を設定するよりも、
[プロパティバインディング](guide/property-binding)で要素のプロパティを設定する方が望ましいです。
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

{@a colspan}

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

## クラスバインディング {@a class-binding}

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


直接 `[class]` バインディングを使わずに [NgClass](guide/built-in-directives#ngclass) ディレクティブを使うこともできます。
しかし、Angular のクラスバインディングの改善により、 `NgClass` は重要な価値を提供しなくなり、将来的には削除される可能性があるため、 `NgClass` を使用せずに上記のクラスバインディング構文を使用することが望ましいです。


<hr/>

## スタイルバインディング {@a style-binding}

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

直接 `[style]` バインディングを使わずに [NgStyle](guide/built-in-directives#ngstyle) ディレクティブを使うこともできます。
しかし、Angular のスタイルバインディングの改善により、 `NgStyle` は重要な価値を提供しなくなり、将来的には削除される可能性があるため、 `NgStyle` を使用せずに上記のクラスバインディング構文を使用することが望ましいです。


<hr/>

{@a styling-precedence}

## スタイリングの優先順位

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
