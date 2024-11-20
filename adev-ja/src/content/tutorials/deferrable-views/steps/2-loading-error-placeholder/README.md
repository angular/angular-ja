# @loading, @error と @placeholder ブロック

遅延可能ビューを使用すると、さまざまな読み込み状態に表示するコンテンツを定義できます。

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>@placeholder</code></td>
      <td>
        デフォルトでは、遅延ブロックはトリガーされる前にコンテンツをレンダリングしません。<code>@placeholder</code>は、遅延コンテンツの読み込み前に表示するコンテンツを宣言するオプションのブロックです。Angularは読み込みが完了した後、プレースホルダーを遅延コンテンツに置き換えます。このブロックはオプションですが、Angularチームは常にプレースホルダーを含めることを推奨しています。
        <a href="https://angular.dev/guide/defer#triggers" target="_blank">
          遅延可能ビューの完全なドキュメントで詳細を確認してください
        </a>
      </td>
    </tr>
    <tr>
      <td><code>@loading</code></td>
      <td>
        このオプションのブロックを使用すると、遅延した依存関係の読み込み中に表示するコンテンツを宣言できます。
      </td>
    </tr>
    <tr>
      <td><code>@error</code></td>
      <td>
        このブロックを使用すると、遅延読み込みが失敗した場合に表示されるコンテンツを宣言できます。
      </td>
    </tr>
  </table>
</div>

上記のすべてのサブブロックの内容は、事前に読み込まれます。さらに、いくつかの機能には<code>@placeholder</code>ブロックが必要です。

このアクティビティでは、<code>@loading</code>、<code>@error</code>、<code>@placeholder</code>ブロックを使用して遅延可能ビューの状態を管理する方法を学習します。

<hr>

<docs-workflow>

<docs-step title="`@placeholder`ブロックの追加">
`app.component.ts`で、`@defer`ブロックに`@placeholder`ブロックを追加します。

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
</docs-code>
</docs-step>

<docs-step title="`@placeholder`ブロックの構成">
`@placeholder`ブロックは、このプレースホルダーを表示する最小時間を指定するオプションのパラメーターを受け入れます。この`minimum`パラメーターは、ミリ秒(ms)または秒(s)の時間単位で指定されます。このパラメーターは、遅延した依存関係が迅速に取得された場合のプレースホルダーコンテンツの高速なちらつきを防ぐために存在します。

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
</docs-code>
</docs-step>

<docs-step title="`@loading`ブロックの追加">
次に、コンポーネントテンプレートに`@loading`ブロックを追加します。

`@loading`ブロックは、2つのオプションパラメーターを受け入れます。

* `minimum`：このブロックを表示する時間
* `after`：読み込み開始後、読み込みテンプレートを表示するまでの待ち時間

どちらのパラメーターも、ミリ秒(ms)または秒(s)の時間単位で指定されます。

`@loading`ブロックに`minimum`パラメーターを`1s`、`after`パラメーターを`500ms`として含めるように`app.component.ts`を更新します。

<docs-code language="angular-html" highlight="[5,6,7]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
</docs-code>

NOTE: この例では、;文字で区切られた2つのパラメーターを使用しています。

</docs-step>

<docs-step title="`@error`ブロックの追加">
最後に、`@defer`ブロックに`@error`ブロックを追加します。

<docs-code language="angular-html" highlight="[7,8,9]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>
</docs-step>
</docs-workflow>

おめでとうございます！この時点で、遅延可能ビューについて十分に理解できたはずです。素晴らしい仕事を続け、次にトリガーについて学びましょう。
