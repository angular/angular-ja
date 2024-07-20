# 補間による値の表示

補間とは、マークアップされたテキストに式を埋め込むことを指します。デフォルトでは、補間は二重中括弧 `{{` と `}}` を区切り文字として使用します。

補間がどのように機能するかを説明するために、`currentCustomer` 変数を含むAngularコンポーネントを考えてみましょう。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.ts" visibleLines="13"/>

対応するコンポーネントテンプレートで、この変数の値を表示するために補間を使用します。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="interpolation-example1"/>

Angularは `currentCustomer` を対応するコンポーネントプロパティの文字列値に置き換えます。この場合、値は `Maria` です。

次の例では、Angularは `title` と `itemImageUrl` プロパティを評価して、タイトルテキストと画像を表示します。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="component-property"/>

## 次へ

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding" title="プロパティバインディング"/>
  <docs-pill href="guide/templates/event-binding" title="イベントバインディング"/>
</docs-pill-row>
