# パイプのテスト

[パイプ](guide/pipes)はAngularのテストユーティリティなしで簡単にテストできます。

<div class="alert is-helpful">

  For the sample app that the testing guides describe, see the <live-example name="testing" embedded-style noDownload>sample app</live-example>.

  For the tests features in the testing guides, see <live-example name="testing" stackblitz="specs" noDownload>tests</live-example>.

</div>

## Testing the `TitleCasePipe`

パイプクラスには、
入力値を変換された出力値に操作する`transform`というメソッドがあります。
`transform`の実装は、
DOMとのやりとりがほとんどありません。
ほとんどのパイプはAngularの`@Pipe`メタデータとそのインターフェース以外に依存しません。

各単語の最初の文字を大文字にする`TitleCasePipe`を考えてみましょう。
次は、正規表現を使った素朴な実装です。

<code-example path="testing/src/app/shared/title-case.pipe.ts" header="app/shared/title-case.pipe.ts"></code-example>

正規表現を使用するものはすべて、十分にテストする価値があります。
シンプルにJasmineを使用して、期待されるケースとエッジケースを調べます。

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" header="app/shared/title-case.pipe.spec.ts"></code-example>

{@a write-tests}

## Writing DOM tests to support a pipe test

これらは、パイプを_単独_でテストします。
`TitleCasePipe`がアプリケーションのコンポーネントに正しく適用されているかどうかはわかりません。

次のようなコンポーネントテストを追加することを検討してください:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

