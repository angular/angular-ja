# カスタムパイプ

組み込みのパイプで提供されていない変換をカプセル化するカスタムパイプを作成します。
その後、組み込みのパイプと同じように、カスタムパイプをテンプレート式で使用して、表示のために入力値を出力値に変換します。

## クラスをパイプとしてマークする

クラスをパイプとしてマークし、構成メタデータを供給するには、クラスに `@Pipe` を適用します。

パイプクラス名にはアッパーキャメルケース（クラス名の一般的な慣例）、対応する `name` 文字列にはキャメルケースを使用します。
`name` にはハイフンを使用しないでください。

詳細とその他の例については、[パイプ名](/style-guide#pipe-names "Angular コーディングスタイルガイドのパイプ名")を参照してください。

テンプレート式では、組み込みパイプと同様に `name` を使用します。

```ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'greet',
})
export class GreetPipe {}
```

## PipeTransform インターフェースを使用する

カスタムパイプクラスで [`PipeTransform`](/api/core/PipeTransform "PipeTransform の API リファレンス") インターフェースを実装して変換します。

Angularは、バインディングの値を最初の引数として、パラメータを2番目の引数としてリスト形式で `transform` メソッドを呼び出し、変換された値を返します。

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'greet',
})
export class GreetPipe implements PipeTransform {
  transform(value: string, param1: boolean, param2: boolean): string {
    return `Hello ${value}`;
  }
}
```

## 例：値を指数関数的に変換する

ゲームでは、ヒーローのパワーを上げるために値を指数関数的に上げる変換を実装したい場合があります。
たとえば、ヒーローのスコアが2の場合、ヒーローのパワーを10で指数関数的にブーストすると、スコアは1024 (`2**10`) になります。
この変換にはカスタムパイプを使用します。

次のコード例は、2つのコンポーネント定義を示しています。

| ファイル                          | 詳細 |
|:---                            |:---     |
| `exponential-strength.pipe.ts` | `transform` メソッドを持つ `exponentialStrength` という名前のカスタムパイプを定義します。このメソッドは変換を実行します。パイプに渡されるパラメータのために、`transform` メソッドに引数（`exponent`）を定義しています。 |
| `power-booster.component.ts`   | パイプの使用方法を示し、値（`2`）と指数パラメータ（`10`）を指定しています。                                                                                                                   |

<docs-code-multifile>
  <docs-code header="src/app/exponential-strength.pipe.ts" language="ts" path="adev/src/content/examples/pipes/src/app/exponential-strength.pipe.ts"/>
  <docs-code header="src/app/power-booster.component.ts" language="ts" path="adev/src/content/examples/pipes/src/app/power-booster.component.ts"/>
</docs-code-multifile>
