# パイプのテスト

Angularのテストユーティリティを使わずに[パイプ](guide/templates/pipes)をテストできます。

## `TitleCasePipe`のテスト

パイプクラスには、入力値を変換された出力値に変換する`transform`メソッドが1つあります。
`transform`の実装は、DOMとほとんどやり取りしません。
ほとんどのパイプは、`@Pipe`メタデータとインターフェース以外、Angularに依存していません。

各単語の最初の文字を大文字にする`TitleCasePipe`を考えてみましょう。
正規表現を使った実装を以下に示します。

<docs-code header="app/shared/title-case.pipe.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.ts"/>

正規表現を使用するものは、徹底的にテストする価値があります。
簡単なJasmineを使用して、期待されるケースとエッジケースを調べます。

<docs-code header="app/shared/title-case.pipe.spec.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.spec.ts" visibleRegion="excerpt"/>

## パイプテストをサポートするDOMテストの作成

これらはパイプの*単体*テストです。
これらは、`TitleCasePipe`がアプリケーションコンポーネントに適用されたときに正しく動作しているかどうかを判断できません。

このようなコンポーネントテストを追加することを考えてみましょう。

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>
