# パイプのテスト

[パイプ](guide/pipes)はAngularのテストユーティリティなしで簡単にテストできます。

<div class="alert is-helpful">

  For a hands-on experience you can <live-example name="testing" stackblitz="specs" noDownload>run tests and explore the test code</live-example> in your browser as your read this guide.

  If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

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

