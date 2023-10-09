# テンプレートでパイプを使う

パイプを適用するには、次のコード例に示すように、パイプ演算子 (`|`) をテンプレート式内で使用します。パイプの*名前*は、組み込みの [`DatePipe`](api/common/DatePipe) の場合は `date` です。

次のように表示されます。

*   `app.component.html` は誕生日を表示するために別のテンプレートで `date`を使っている。
*   `hero-birthday1.component.ts`は、誕生日の値を設定するコンポーネントの*インラインテンプレート*の一部として、同じパイプを使用している。

<code-tabs>
    <code-pane header="src/app/app.component.html" region="hero-birthday-template" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero-birthday1.component.ts" path="pipes/src/app/hero-birthday1.component.ts"></code-pane>
</code-tabs>

コンポーネントの `birthday` の値は、パイプ演算子 `|` を通して [`date`](api/common/DatePipe) 関数に渡されます。

@reviewed 2023-10-09
