# パイプのテスト

[パイプ](guide/pipes-overview)は Angular のテストユーティリティなしで簡単にテストできます。

<div class="alert is-helpful">

If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

</div>

## Testing the `TitleCasePipe`

パイプクラスには、入力値を変換された出力値に操作する`transform`というメソッドがあります。
`transform`の実装は、DOM とのやりとりがほとんどありません。
ほとんどのパイプは Angular の`@Pipe`メタデータとそのインターフェース以外に依存しません。

各単語の最初の文字を大文字にする`TitleCasePipe`を考えてみましょう。
次は、正規表現を使った素朴な実装です。

<code-example header="app/shared/title-case.pipe.ts" path="testing/src/app/shared/title-case.pipe.ts"></code-example>

正規表現を使用するものはすべて、十分にテストする価値があります。
シンプルに Jasmine を使用して、期待されるケースとエッジケースを調べます。

<code-example header="app/shared/title-case.pipe.spec.ts" path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt"></code-example>

<a id="write-tests"></a>

## Writing DOM tests to support a pipe test

これらは、パイプを*単独*でテストします。
`TitleCasePipe`がアプリケーションのコンポーネントに正しく適用されているかどうかはわかりません。

次のようなコンポーネントテストを追加することを検討してください:

<code-example header="app/hero/hero-detail.component.spec.ts (pipe test)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-09-07
