# Observable からデータを取り出す

Observableを使用すると、アプリケーションの各部分間でメッセージを渡すことができます。
Observableは、イベント処理、非同期プログラミング、複数値の処理に使用できます。
Observableは、同期的に（関数が呼び出し元に値を渡すように）、またはスケジュールに従って非同期的に、任意の型の単一値または複数値を提供できます。

組み込みの [`AsyncPipe`](api/common/AsyncPipe "API description of AsyncPipe") を使用して、Observableを入力として受け取り、入力に自動的にサブスクライブします。
このパイプがない場合、コンポーネントコードはObservableの値を使用するためにObservableにサブスクライブし、解決された値を抽出してバインディングのために公開し、Observableが破棄されたときにサブスクライブを解除してメモリリークを防ぐ必要があります。
`AsyncPipe` は、Observableから値が到着するたびにサブスクリプションを維持し、そのObservableから値を提供し続けるためにコンポーネントの定型コードを節約するパイプです。

次のコード例では、メッセージ文字列 (`message$`) のObservableを、`async` パイプを使用してビューにバインドしています。

<!-- TODO: Enable preview if this example does not depend on Zone/ or if we run the example with Zone. -->
<docs-code header="src/app/hero-async-message.component.ts"
           path="adev/src/content/examples/pipes/src/app/hero-async-message.component.ts" />
