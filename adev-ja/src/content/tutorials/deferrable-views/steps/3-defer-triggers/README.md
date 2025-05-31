# 遅延トリガー

`@defer`のデフォルトオプションは、コンポーネントの一部を遅延読み込みするのに優れた選択肢を提供しますが、遅延読み込みの体験をさらにカスタマイズすることが望ましい場合があります。

デフォルトでは、遅延コンテンツはブラウザがアイドル状態のときにロードされます。ただし、**トリガー**を指定することで、このロードが発生するタイミングをカスタマイズできます。これにより、コンポーネントに最適なロード動作を選択できます。

遅延可能ビューは、2種類のロードトリガーを提供します。

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>on</code></td>
      <td>
        組み込みトリガーのリストからトリガーを使用してトリガー条件を指定します。<br/>
        例: <code>@defer (on viewport)</code>
      </td>
    </tr>
    <tr>
      <td><code>when</code></td>
      <td>
        真偽値として評価される式としての条件です。式が真の場合、プレースホルダーは遅延読み込みされたコンテンツと交換されます。<br/>
        例: <code>@defer (when customizedCondition)</code>
      </td>
    </tr>
  </table>
</div>

`when`条件が`false`と評価された場合、`defer`ブロックはプレースホルダーに戻りません。交換は一度限りの操作です。

複数のイベントトリガーを一度に定義できます。これらのトリガーはOR条件として評価されます。

* 例: `@defer (on viewport; on timer(2s))`
* 例: `@defer (on viewport; when customizedCondition)`

このアクティビティでは、トリガーを使用して遅延可能ビューをロードする条件を指定する方法を学習します。

<hr>

<docs-workflow>

<docs-step title="`on hover`トリガーを追加する">
`app.ts`で、`@defer`ブロックに`on hover`トリガーを追加します。

<docs-code language="angular-html" hightlight="[1]">
@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

これで、プレースホルダーにホバーするまで、ページはコメントセクションをレンダリングしなくなります。
</docs-step>

<docs-step title="「すべてのコメントを表示」ボタンを追加する">
次に、ラベルが「すべてのコメントを表示」のボタンを含むようにテンプレートを更新します。ボタンに`#showComments`というテンプレート変数を設定します。

<docs-code language="angular-html" hightlight="[1]">
<button type="button" #showComments>Show all comments</button>

@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

NOTE: [テンプレート変数に関する詳細については、ドキュメントを参照してください](https://angular.dev/guide/templates/reference-variables#)。

</docs-step>

<docs-step title="`on interaction`トリガーを追加する">
テンプレート内の`@defer`ブロックを更新して、`on interaction`トリガーを使用します。`interaction`にパラメーターとして`showComments`テンプレート変数を指定します。

<docs-code language="angular-html" hightlight="[3]">
<button type="button" #showComments>Show all comments</button>

@defer (on hover; on interaction(showComments)) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

これらの変更により、ページは次の条件のいずれかが満たされるまで、コメントセクションのレンダリングを待機します。
* ユーザーがコメントセクションのプレースホルダーにホバーする
* ユーザーが「すべてのコメントを表示」ボタンをクリックする

ページをリロードして、コメントセクションをレンダリングするためのさまざまなトリガーを試すことができます。
</docs-step>
</docs-workflow>

詳細については、[遅延可能ビュー](https://angular.dev/guide/defer)のドキュメントを参照してください。
Angularの優れた機能をさらに活用するために、学習を続けてください。
