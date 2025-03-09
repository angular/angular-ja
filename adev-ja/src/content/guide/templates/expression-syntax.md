# 式構文

Angular式はJavaScriptに基づいていますが、いくつかの重要な点で異なります。このガイドでは、Angular式と標準JavaScriptの類似点と相違点を説明します。

## 値リテラル

Angularは、[リテラル値](https://developer.mozilla.org/en-US/docs/Glossary/Literal)のサブセットをJavaScriptからサポートしています。

### サポートされる値リテラル

| リテラルタイプ | 例                  |
| ------------ | ------------------------------- |
| 文字列       | `'Hello'`, `"World"`            |
| ブール値      | `true`, `false`                 |
| 数値       | `123`, `3.14`                   |
| オブジェクト   | `{name: 'Alice'}`               |
| 配列        | `['Onion', 'Cheese', 'Garlic']` |
| null         | `null`                          |
| テンプレートリテラル  | `` `Hello ${name}` ``           |

### サポートされていないリテラル

| リテラルタイプ    | 例       |
| --------------- | ------------------- |
| 正規表現          | `/\d+/`             |
| タグ付きテンプレートリテラル   | `` tag`Hello ${name}` ``  |

## グローバル

Angular式は、次の[グローバル](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)をサポートしています。

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

その他のJavaScriptグローバルはサポートされていません。一般的なJavaScriptグローバルには、`Number`、`Boolean`、`NaN`、`Infinity`、`parseInt`などがあります。

## ローカル変数

Angularは、特定のコンテキストで式に使用できる特別なローカル変数を自動的に用意します。これらの特別な変数は、常にドル記号文字（`$`）で始まります。

たとえば、`@for`ブロックはループに関する情報に対応する複数のローカル変数（`$index`など）を提供します。

## どのような演算子がサポートされていますか？

### サポートされる演算子

Angularは、標準JavaScriptの次の演算子をサポートしています。

| 演算子              | 例(複数)                               |
| --------------------- | ---------------------------------------- |
| 加算/連結            | `1 + 2`                                  |
| 減算                | `52 - 3`                                 |
| 乗算                | `41 * 6`                                 |
| 除算                | `20 / 4`                                 |
| 余り（剰余）        | `17 % 5`                                 |
| 括弧                | `9 * (8 + 4)`                            |
| 条件式（三項演算子） | `a > b ? true : false`                   |
| 論理積              | `&&`                                     |
| 論理和              | `\|\|`                                   |
| 論理否定            | `!`                                      |
| null合体演算子     | `const foo = null ?? 'default'`          |
| 比較演算子          | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==` |
| 単項否定            | `const y = -x`                           |
| 単項プラス           | `const x = +y`                           |
| プロパティアクセサ    | `person['name'] = 'Mirabel'`             |

Angular式は、さらに次の非標準の演算子もサポートしています。

| 演算子                        | 例(複数)                     |
| ------------------------------- | ------------------------------ |
| [パイプ](/guides/templates/pipes) | `{{ total \| currency }}`      |
| オプショナルチェーン\*             | `someObj.someProp?.nestedProp` |
| 非nullアサーション（TypeScript） | `someObj!.someProp`            |

\*注意: オプショナルチェーンは、標準JavaScriptバージョンとは異なる動作をします。Angularのオプショナルチェーン演算子の左辺が`null`または`undefined`の場合、`undefined`ではなく`null`を返します。

### サポートされていない演算子

| 演算子              | 例(複数)                        |
| --------------------- | --------------------------------- |
| すべてのビット演算子 | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| 代入演算子          | `=`                               |
| オブジェクトのデストラクタリング | `const { name } = person`         |
| 配列のデストラクタリング   | `const [firstItem] = items`       |
| カンマ演算子        | `x = (x++, x)`                    |
| typeof                | `typeof 42`                       |
| void                  | `void 1`                          |
| in                    | `'model' in car`                  |
| instanceof            | `car instanceof Automobile`       |
| new                   | `new Car()`                       |

## 式の字句コンテキスト

Angular式は、コンポーネントクラスのコンテキストと、関連する[テンプレート変数](/guide/templates/variables)、ローカル変数、およびグローバル変数のコンテキストで評価されます。

クラスメンバーを参照する場合、`this`は常に暗黙的に使用されます。

## 宣言

一般的に、Angular式では宣言はサポートされていません。これには、以下が含まれますが、これらに限定されません。

| 宣言          | 例(複数)                                  |
| --------------- | ------------------------------------------- |
| 変数            | `let label = 'abc'`, `const item = 'apple'` |
| 関数            | `function myCustomFunction() { }`           |
| アロー関数       | `() => { }`                                 |
| クラス          | `class Rectangle { }`                       |

# イベントリスナー文

イベントハンドラーは、**式**ではなく**文**です。Angular式と同じ構文をすべてサポートしていますが、2つの重要な違いがあります。

1. 文は**代入演算子**をサポートします（ただし、分割代入はサポートされていません）。
1. 文は**パイプをサポートしていません**
