# クラスとスタイルのバインディング

クラスおよびスタイルバインディングを使用して、要素の `class` 属性から CSS クラス名を追加および削除し、スタイルを動的に設定します。

## 前提条件

* [プロパティバインディング](guide/property-binding)

## 単一の CSS`class`へのバインド

単一のクラスバインディングを作成するには、次のように入力します:

`[class.sale]="onSale"`

Angular は、バインドされた式 `onSale` が true の場合にクラスを追加し、式が偽の場合にクラスを削除します (`undefined` を除く)。  詳細については、[スタイル委任](guide/style-precedence#styling-delegation) を参照してください。

## 複数の CSS クラスへのバインド

複数のクラスにバインドするには、次のように入力します:

`[class]="classExpression"`

式は次のいずれかです:

* スペースで区切られたクラス名の文字列。
* クラス名をキーとし、真または偽の式を値とするオブジェクト。
* クラス名の配列。

オブジェクト形式では、関連付けられた値が真である場合にのみ、Angular はクラスを追加します。

<div class="alert is-important">

`object`、`Array`、`Map`、`Set` などのオブジェクトのような式では、Angular がクラスリストを更新するために、オブジェクトの ID を変更する必要があります。
オブジェクト ID を変更せずにプロパティを更新しても効果はありません。

</div>

同じクラス名に複数のバインディングがある場合、Angular は [スタイリングの優先順位](guide/style-precedence) を使用して、使用するバインディングを決定します。

次の表は、クラスバインディングの構文をまとめたものです。

| バインディング形式         | 構文                      | 入力方式                                                                  | 入力値の例 |
|:---                  |:---                         |:---                                                                         |:---                  |
| 単一クラスバインディング | `[class.sale]="onSale"`     | <code>boolean &verbar; undefined &verbar; null</code>                       | `true`, `false`                      |
| マルチクラスバインディング  | `[class]="classExpression"` | `string`                                                                    | `"my-class-1 my-class-2 my-class-3"` |
| マルチクラスバインディング  | `[class]="classExpression"` | <code>Record&lt;string, boolean &verbar; undefined &verbar; null&gt;</code> | `{foo: true, bar: false}`            |
| マルチクラスバインディング  | `[class]="classExpression"` | <code>Array&lt;string&gt;</code>                                            | `['foo', 'bar']`                     |

## 単一のスタイルへのバインド

単一のスタイルバインディングを作成するには、プレフィックス `style` の後にドットと CSS スタイルの名前を付けて使用します。

たとえば、`width` スタイルを設定するには、次のように入力します:  `[style.width]="width"`

Angular は、通常は文字列であるバインドされた式の値にプロパティを設定します。 必要に応じて、数値型を必要とする`em`や`%`などの単位拡張を追加できます。

1. dash-case でスタイルを記述するには、次のように入力します:

    <code-example language="html">&lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;</code-example>

2. スタイルを camelCase で記述するには、次のように入力します:

    <code-example language="html">&lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;</code-example>

## 複数のスタイルへのバインド

複数のスタイルを切り替えるには、`[style]` 属性にバインドします (例: `[style]="styleExpression"`)。  `styleExpression` は次のいずれかです:

* `"width: 100px; height: 100px; background-color: cornflowerblue;"` などのスタイルの文字列リスト。
* `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}` のように、スタイル名をキーとし、スタイル値を値とするオブジェクト。

`[style]` への配列のバインドはサポートされていないことに注意してください。

<div class="alert is-important">

`[style]` をオブジェクト式にバインドする場合、Angular がクラスリストを更新するには、オブジェクトの ID を変更する必要があります。
オブジェクト ID を変更せずにプロパティを更新しても効果はありません。

</div>

### 単一および複数スタイルのバインディングの例

<code-example path="attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts"></code-example>

同じスタイル属性に複数のバインディングがある場合、Angular は [スタイリングの優先順位](guide/style-precedence) を使用して、使用するバインディングを決定します。

次の表は、スタイル バインディングの構文をまとめたものです。

| バインディング形式                    | 構文                      | 入力方式                                                                 | 入力値の例 |
|:---                             |:---                         |:---                                                                        |:---                  |
| 単一スタイルバインディング            | `[style.width]="width"`     | <code>string &verbar; undefined &verbar; null</code>                       | `"100px"`                           |
| 単位付きの単一スタイルバインディング | `[style.width.px]="width"`  | <code>number &verbar; undefined &verbar; null</code>                       | `100`                               |
| マルチスタイルバインディング             | `[style]="styleExpression"` | `string`                                                                   | `"width: 100px; height: 100px"`     |
| マルチスタイルバインディング             | `[style]="styleExpression"` | <code>Record&lt;string, string &verbar; undefined &verbar; null&gt;</code> | `{width: '100px', height: '100px'}` |

{@a styling-precedence}
## スタイリングの優先順位

1 つの HTML 要素は、その CSS クラス リストとスタイル値を複数のソース (たとえば、複数のディレクティブからのホスト バインディング) にバインドできます。

## 次のお勧め

* [コンポーネント スタイル](https://angular.io/guide/component-styles)
* [Angular アニメーションの紹介](https://angular.io/guide/animations)

@reviewed 2022-05-09
