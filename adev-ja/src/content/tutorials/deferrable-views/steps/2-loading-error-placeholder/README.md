# @loading, @error と @placeholder ブロック

遅延可能ビューを使用すると、さまざまな読み込み状態に表示するコンテンツを定義できます。

| ブロック       | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@placeholder` | デフォルトでは、遅延ブロックはトリガーされる前にコンテンツをレンダリングしません。`@placeholder`は、遅延コンテンツの読み込み前に表示するコンテンツを宣言するオプションのブロックです。Angularは読み込みが完了した後、プレースホルダーを遅延コンテンツに置き換えます。このブロックはオプションですが、Angularチームは常にプレースホルダーを含めることを推奨しています。[遅延可能ビューの完全なドキュメントで詳細を確認してください](guide/templates/defer) |
| `@loading`     | このオプションのブロックを使用すると、遅延した依存関係の読み込み中に表示するコンテンツを宣言できます。                                                                                                                                                                                                                                                                                                                                                   |
| `@error`       | このブロックを使用すると、遅延読み込みが失敗した場合に表示されるコンテンツを宣言できます。                                                                                                                                                                                                                                                                                                                                                               |

上記のすべてのサブブロックの内容は即座に読み込まれます。さらに、いくつかの機能には`@placeholder`ブロックが必要です。

このアクティビティでは、`@loading`、`@error`、`@placeholder`ブロックを使用して遅延可能ビューの状態を管理する方法を学習します。

<hr>

<docs-workflow>

<docs-step title="`@placeholder`ブロックの追加">
`app.ts`で、`@defer`ブロックに`@placeholder`ブロックを追加します。

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="`@placeholder`ブロックの構成">
`@placeholder`ブロックは、このプレースホルダーを表示する最小時間を指定するオプションのパラメーターを受け入れます。この`minimum`パラメーターは、ミリ秒(ms)または秒(s)の時間単位で指定されます。このパラメーターは、遅延した依存関係が迅速に取得された場合のプレースホルダーコンテンツの高速なちらつきを防ぐために存在します。

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="`@loading`ブロックの追加">
次に、コンポーネントテンプレートに`@loading`ブロックを追加します。

`@loading`ブロックは、2つのオプションパラメーターを受け入れます。

- `minimum`：このブロックを表示する時間
- `after`：読み込み開始後、読み込みテンプレートを表示するまでの待ち時間

どちらのパラメーターも、ミリ秒(ms)または秒(s)の時間単位で指定されます。

`@loading`ブロックに`minimum`パラメーターを`1s`、`after`パラメーターを`500ms`として含めるように`app.ts`を更新します。

```angular-html {highlight:[5,6,7]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
```

NOTE: この例では、;文字で区切られた2つのパラメーターを使用しています。

</docs-step>

<docs-step title="`@error`ブロックの追加">
最後に、`@defer`ブロックに`@error`ブロックを追加します。

```angular-html {highlight:[7,8,9]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

</docs-step>
</docs-workflow>

おめでとうございます！この時点で、遅延可能ビューについて十分に理解できたはずです。すばらしい仕事を続け、次にトリガーについて学びましょう。
