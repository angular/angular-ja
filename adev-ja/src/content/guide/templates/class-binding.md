# クラスとスタイルのバインディング

クラスとスタイルのバインディングを使用して、要素の `class` 属性からCSSクラス名を追加および削除したり、スタイルを動的に設定したりします。

## 単一の CSS `class` へのバインディング

単一のクラスバインディングを作成するには、次のように入力します。

`[class.sale]="onSale"`

バインドされた式 `onSale` が真の場合、Angularはクラスを追加し、式が偽の場合、クラスを削除します。ただし、`undefined` を除きます。`undefined` の動作は、要素上の異なるディレクティブで同じクラスに複数のバインディングが存在する場合に特に役立ちます。

## 複数の CSS クラスへのバインディング

複数のクラスにバインドするには、次のように入力します。

`[class]="classExpression"`

式は次のいずれかになります。

* クラス名のスペース区切り文字列。
* クラス名をキー、真または偽の式を値とするオブジェクト。
* クラス名の配列。

オブジェクト形式を使用すると、Angularは関連付けられた値が真の場合にのみクラスを追加します。

IMPORTANT: オブジェクトのような式（`object`、`Array`、`Map`、`Set` など）を使用する場合、Angularがクラスリストを更新するにはオブジェクトのIDが変更されている必要があります。
オブジェクトのIDを変更せずにプロパティを更新しても、効果はありません。

同じクラス名に複数のバインディングがある場合、Angularはスタイリングの優先順位を使用して、どのバインディングを使用するかを決定します。

次の表は、クラスバインディング構文をまとめたものです。

| バインディングの種類        | 構文                       | 入力の種類                                                                 | 入力値の例            |
|:---                             |:---                          |:---                                                                        |:---                   |
| 単一のクラスバインディング    | `[class.sale]="onSale"`     | <code>boolean | undefined | null</code>                       | `true`、`false`          |
| 複数のクラスバインディング   | `[class]="classExpression"` | `string`                                                                   | `"my-class-1 my-class-2 my-class-3"` |
| 複数のクラスバインディング   | `[class]="classExpression"` | <code>Record<string, boolean | undefined | null></code> | `{foo: true, bar: false}`      |
| 複数のクラスバインディング   | `[class]="classExpression"` | <code>Array<string></code>                                            | `['foo', 'bar']`         |

## 単一のスタイルへのバインディング

単一のスタイルバインディングを作成するには、プレフィックス `style` の後にドットとCSSスタイルの名前を続けます。

たとえば、`width` スタイルを設定するには、次のように入力します。`[style.width]="width"`

Angularは、通常は文字列であるバインドされた式の値にプロパティを設定します。オプションで、`em` や `%` などの単位拡張子を付けることができます。これには数値型が必要です。

1. スタイルをダッシュケースで記述するには、次のように入力します。

    <docs-code language="html"><nav [style.background-color]="expression"></nav></docs-code>

2. スタイルをキャメルケースで記述するには、次のように入力します。

    <docs-code language="html"><nav [style.backgroundColor]="expression"></nav></docs-code>

## 複数のスタイルへのバインディング

複数のスタイルを切り替えるには、`[style]` 属性にバインドします（例：`[style]="styleExpression"`）。`styleExpression` は次のいずれかになります。

* `"width: 100px; height: 100px; background-color: cornflowerblue;"` などのスタイルの文字列リスト。
* `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}` などの、スタイル名をキー、スタイル値を値とするオブジェクト。

`[style]` に配列をバインドすることはサポートされていないことに注意してください。

IMPORTANT: `[style]` をオブジェクト式にバインドする場合、Angularがクラスリストを更新するにはオブジェクトのIDが変更されている必要があります。
オブジェクトのIDを変更せずにプロパティを更新しても、効果はありません。

### 単一スタイルと複数スタイルのバインディングの例

<docs-code path="adev/src/content/examples/attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts"/>

同じスタイル属性に複数のバインディングがある場合、Angularはスタイリングの優先順位を使用して、どのバインディングを使用するかを決定します。

次の表は、スタイルバインディング構文をまとめたものです。

| バインディングの種類                    | 構文                       | 入力の種類                                                                 | 入力値の例            |
|:---                             |:---                          |:---                                                                        |:---                   |
| 単一のスタイルバインディング            | `[style.width]="width"`     | <code>string | undefined | null</code>                       | `"100px"`              |
| 単一のスタイルバインディング（単位付き） | `[style.width.px]="width"`  | <code>number | undefined | null</code>                       | `100`                   |
| 複数のスタイルバインディング             | `[style]="styleExpression"` | `string`                                                                   | `"width: 100px; height: 100px"` |
| 複数のスタイルバインディング             | `[style]="styleExpression"` | <code>Record<string, string | undefined | null></code> | `{width: '100px', height: '100px'}` |

## スタイリングの優先順位

単一のHTML要素には、CSSクラスリストとスタイル値が複数のソース（たとえば、複数のディレクティブからのホストバインディング）にバインドされている場合があります。

## 次へ

<docs-pill-row>
  <docs-pill href="/guide/components/styling" title="コンポーネントのスタイリング"/>
  <docs-pill href="/guide/animations" title="Angularアニメーションの概要"/>
</docs-pill-row>
