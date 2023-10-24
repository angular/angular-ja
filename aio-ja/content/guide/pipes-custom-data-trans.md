# カスタムデータ変換のためのパイプの作成

組み込みのパイプでは提供されていない変換をカプセル化するためのカスタムパイプを作成します。
次に、カスタムパイプをテンプレート式で使用し、組み込みのパイプと同じ方法で入力値を表示用の出力値に変換します。

## クラスをパイプとしてマークする

クラスをパイプとしてマークし、設定メタデータを提供するには、クラスに [`@Pipe`](/api/core/Pipe "Pipe の API リファレンス") [デコレータ](/guide/glossary#decorator--decoration "デコレータの定義") を適用します。

パイプクラス名には [UpperCamelCase](guide/glossary#case-types "ケースタイプの定義")（クラス名の一般的な慣例）を使用し、対応する `name` 文字列には [camelCase](guide/glossary#case-types "ケースタイプの定義") を使用します。
`name` にはハイフンを使用しないでください。

詳細とさらなる例については、[パイプの名前](guide/styleguide#pipe-names "Angular コーディングスタイルガイドの中のパイプの名前")を参照してください。

`name` をテンプレート式で組み込みのパイプと同じように使用します。

<div class="alert is-important">

* `declarations` フィールドにパイプを含めることで、テンプレートで使用できるようになります。例のアプリケーション内の `app.module.ts` ファイルを参照してください（<live-example></live-example>）。詳細については、[NgModules](guide/ngmodules "NgModules の紹介")を参照してください。
* カスタムパイプを登録します。[Angular CLI](cli "CLI の概要とコマンドリファレンス") [`ng generate pipe`](cli/generate#pipe "CLI コマンドリファレンス内の ng generate pipe")コマンドを使用すると、パイプが自動的に登録されます。

</div>

## PipeTransform インターフェースの使用

カスタムパイプクラスで [`PipeTransform`](/api/core/PipeTransform "PipeTransform の API リファレンス") インターフェースを実装して変換を実行します。

Angular は `transform` メソッドを最初の引数としてバインディングの値、第二の引数としてリスト形式のパラメータを渡し、変換された値を返します。

## 例: 値を指数関数的に変換する

ゲームでは、ヒーローのパワーを指数関数的に上げる変換を実装したい場合があります。
たとえば、ヒーローのスコアが2の場合、ヒーローのパワーを10倍にすると、スコアは1024になります。
この変換にはカスタムパイプを使用します。

次のコード例では、2つのコンポーネント定義が表示されます：

* `exponential-strength.pipe.ts` コンポーネントは、`transform` メソッドを持つカスタムパイプ `exponentialStrength` を定義し、変換を実行します。
    パイプに渡すためのパラメータとして `transform` メソッドに引数（`exponent`）を定義します。
* `power-booster.component.ts` コンポーネントは、パイプを使用する方法を示し、値（`2`）と指数パラメータ（`10`）を指定します。

<code-tabs>
    <code-pane header="src/app/exponential-strength.pipe.ts" path="pipes/src/app/exponential-strength.pipe.ts"></code-pane>
    <code-pane header="src/app/power-booster.component.ts" path="pipes/src/app/power-booster.component.ts"></code-pane>
</code-tabs>

ブラウザには次のように表示されます：

<code-example language="none">

Power Booster

Superpower boost: 1024

</code-example>

<div class="alert is-helpful">

`<live-example name="pipes"></live-example>`内で `exponentialStrength` パイプの動作を確認するには、テンプレート内の値とオプションの指数を変更してください。

</div>

@reviewed 2023-10-06
