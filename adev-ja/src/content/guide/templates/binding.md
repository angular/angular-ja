# バインディングを理解する

Angularのテンプレートでは、バインディングによりテンプレートから作成されたUIの一部（DOM要素、ディレクティブ、またはコンポーネント）とモデル（テンプレートが属するコンポーネントインスタンス）間にライブ接続が確立されます。この接続はビューをモデルと同期させたり、ビューでイベントやユーザーアクションが発生したときにモデルに通知したり、その両方を行うために使用できます。Angularの [変更検知](best-practices/runtime-performance) アルゴリズムは、ビューとモデルを同期させる役割を担います。

バインディングの例には、次のようなものがあります。

* テキスト補間
* プロパティバインディング
* イベントバインディング
* 双方向バインディング

バインディングには常に、_ターゲット_（バインドされた値を受け取るもの）と、_テンプレート式_（モデルから値を生成するもの）の2つの部分があります。

## 構文

テンプレート式はJavaScript式に似ています。
多くのJavaScript式は有効なテンプレート式ですが、以下の例外があります。

副作用を持つ、または副作用を促進するJavaScript式は使用できません。具体的には、以下を含みます。

* 代入 (`=`, `+=`, `-=`, `...`)
* `new`, `typeof`, または `instanceof` などの演算子
* <code>;</code> または <code>,</code> を使用した式チェーン
* インクリメントおよびデクリメント演算子 `++` および `--`
* ES2015+ の演算子のいくつか

JavaScript構文からのその他の顕著な違いには、次のようなものがあります。

* `|` や `&` などのビット単位の演算子はサポートされていません。

## 式のコンテキスト

補間された式には、式が属するアプリケーションの特定の部分であるコンテキストがあります。通常、このコンテキストはコンポーネントインスタンスです。

次のスニペットでは、`recommended` 式と `itemImageUrl2` 式は、`AppComponent` のプロパティを参照しています。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="component-context" header="src/app/app.component.html"/>

式は、[テンプレート入力変数](guide/directives/structural-directives#shorthand) や [テンプレート参照変数](guide/templates/reference-variables) などの、_テンプレート_ のコンテキストのプロパティも参照できます。

次の例では、`customer` のテンプレート入力変数を使用しています。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="template-input-variable" header="src/app/app.component.html (template input variable)"/>

次の例では、`#customerInput` のテンプレート参照変数を使用しています。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="template-reference-variable" header="src/app/app.component.html (template reference variable)"/>

HELPFUL: テンプレート式は、`undefined` を除いて、グローバル名前空間内のものは何も参照できません。 `window` や `document` は参照できません。また、`console.log()` や `Math.max()` を呼び出すことができず、式のコンテキストのメンバーの参照に限定されています。

### 名前衝突の防止

式が評価されるコンテキストは、テンプレート変数、ディレクティブのコンテキストオブジェクト（存在する場合）、およびコンポーネントのメンバーの結合です。
複数の名前空間に属する名前を参照する場合、Angularは次の優先順位ロジックを適用してコンテキストを決定します。

1. テンプレート変数名
1. ディレクティブのコンテキスト内の名前
1. コンポーネントのメンバー名

変数が別のコンテキストの変数を隠すことを防ぐために、変数名を一意に保ちます。
次の例では、`AppComponent` テンプレートは、`customer` のPadmaに挨拶します。

`@for` は、`customers` 配列内の各 `customer` をリスト表示します。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.1.ts" visibleRegion="var-collision" header="src/app/app.component.ts"/>

`@for` 内の `customer` は、_@for_ によって定義された暗黙の `<ng-template>` のコンテキストにあります。これは、`customers` 配列内の各 `customer` を参照し、"Ebony" と "Chiho" を表示します。"Padma" は、その配列内に存在しないため表示されません。

一方、`<h1>` は、コンポーネントクラスの `customer` プロパティの値にバインドされた "Padma" を表示します。

## 式のベストプラクティス

テンプレート式を使用する際には、次のベストプラクティスに従ってください。

* **短い式を使用する**

可能な限り、プロパティ名やメソッド呼び出しを使用します。アプリケーションロジックとビジネスロジックは、開発とテストが可能なコンポーネントに保持します。

* **迅速な実行**

Angularは、変更検知サイクルのたびにテンプレート式を実行します。Promise解決、HTTP結果、タイマーイベント、キー押下、マウス移動など、多くの非同期アクティビティが変更検知サイクルをトリガーします。

特に低速なデバイスでは、ユーザー体験をできるだけ効率的にするために、式は迅速に終了する必要があります。計算に多くのリソースを必要とする場合は、値をキャッシュすることを検討してください。

## 可視的な副作用なし

Angularの単方向データフローモデルに従って、テンプレート式は、ターゲットプロパティの値以外、アプリケーションの状態を変更すべきではありません。コンポーネントの値を読み取ることは、他の表示される値を変更すべきではありません。ビューは、1回のレンダリングパス全体で安定している必要があります。

  <docs-callout title='冪等な式は副作用を減らします'>

[冪等](https://ja.wikipedia.org/wiki/%E5%86%AA%E7%AD%89) な式は副作用がなく、Angularの変更検知のパフォーマンスを向上させます。Angularの用語では、冪等な式は、依存する値のいずれかが変更されるまでは、常に _まったく同じもの_ を返します。

依存する値は、イベントループの1回のターン中に変更されるべきではありません。べき等な式が文字列または数値を返す場合、それを連続して2回呼び出した場合、同じ文字列または数値を返します。式がオブジェクト（`array` を含む）を返す場合、それを連続して2回呼び出した場合、同じオブジェクト _参照_ を返します。

  </docs-callout>

## 次へ

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding" title="プロパティバインディング"/>
  <docs-pill href="guide/templates/event-binding" title="イベントバインディング"/>
</docs-pill-row>
