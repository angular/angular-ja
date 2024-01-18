# テンプレート内でのパイプの使用

パイプを適用するために、次のコードの例に示されるように、テンプレート式内部でパイプ演算子(`|`)を使用します。

<code-example header="birthday.component.html (template)" path="pipes/src/app/birthday.component.html"></code-example>

`birthday`の値はパイプ演算子(`|`)を通じてnameが`date`の[`DatePipe`](api/common/DatePipe)に流れます。
パイプはdateをデフォルトフォーマットの**Apr 15, 1988**に変換します。

コンポーネントクラスを見てください。

<code-example header="birthday.component.ts (class)" path="pipes/src/app/birthday.component.ts"></code-example>

これは[スタンドアロンコンポーネント](guide/standalone-components)のため、すべての組み込みパイプの源である`@angular/common`から`DatePipe`をインポートします。

@reviewed 2023-08-14
