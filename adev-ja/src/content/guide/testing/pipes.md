# パイプのテスト

Angularのテストユーティリティを使わずに[パイプ](guide/templates/pipes)をテストできます。

## `TitleCasePipe`のテスト

パイプクラスには、入力値を変換された出力値に変換する`transform`メソッドが1つあります。
`transform`の実装は、DOMとほとんどやり取りしません。
ほとんどのパイプは、`@Pipe`メタデータとインターフェース以外、Angularに依存していません。

各単語の最初の文字を大文字にする`TitleCasePipe`を考えてみましょう。
正規表現を使った実装を以下に示します。

<docs-code header="title-case.pipe.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.ts"/>

正規表現を使用するものは、徹底的にテストする価値があります。標準的な単体テスト技法を使用して、期待されるケースとエッジケースを調べることができます。

<docs-code header="title-case.pipe.spec.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt"/>

## パイプテストをサポートするDOMテストの作成

これらはパイプの_単体_テストです。
これらは、`TitleCasePipe`がアプリケーションコンポーネントに適用されたときに正しく動作しているかどうかを判断できません。

このようなコンポーネントテストを追加することを考えてみましょう。

<docs-code header="hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe"/>
