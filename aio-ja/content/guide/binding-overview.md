# バインディングを理解する

Angularテンプレートでは、バインディングはテンプレートから作成されたUIの一部(DOM要素、ディレクティブ、またはコンポーネント)とモデル(テンプレートが属するコンポーネントインスタンス)の間のライブ接続を作成します。この接続は、ビューとモデルを同期させたり、ビューでイベントやユーザーアクションが発生した時にモデルに通知したり、あるいはその両方に使用することができます。Angularの[変更検知](guide/change-detection)アルゴリズムはビューとモデルの同期を維持する役割を担っています。

次のものがバインディングの例に挙げられます:

* 文字列補間
* プロパティバインディング
* イベントバインディング
* 双方向バインディング

バインディングはふたつの部分からなります。バインドされた値を受け取る_ターゲット_と、モデルから値を生成する_テンプレート式_です。


## 構文

テンプレート式は、JavaScriptの式と似ています。
多くのJavaScriptの式のうち、次の例外を除いたものがテンプレートで有効です。

次のような副作用をもつ、もしくは副作用を促進させるJavaScriptの式は利用できません:

* 代入 (`=`, `+=`, `-=`, `...`)
* `new`、`typeof`、`instanceof`などの演算子
* <code>;</code>と<code>,</code>による式のチェイン
* `++`と`--`のインクリメント演算子とデクリメント演算子
* ES2015より新しく導入されたいくつかのオペレーター

他にも、JavaScriptの構文との顕著な違いとして、次のようなものがあります:

* `|`や`&`などのビット演算子はサポートされない
* `|`のような[新しいテンプレート式演算子](guide/template-expression-operators)

## 式のコンテキスト

補間式にはコンテキストがあります&mdash;それはその式が属するアプリケーションの特定の部分です。一般的に、このコンテキストはコンポーネントのインスタンスです。

次のスニペットでは、`recommended`式と`itemImageUrl2`式が、`AppComponent`のプロパティを参照しています。

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

式は、[テンプレート入力変数](guide/structural-directives#shorthand)や[テンプレート参照変数](guide/template-reference-variables)など、_テンプレート_のコンテキストのプロパティを参照することもできます。

次の例では、`customer`というテンプレート入力変数を使用しています。

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (テンプレート入力変数)"></code-example>

次の例では、テンプレート参照変数である`#customerInput`をあらわしています。

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (テンプレート参照変数)"></code-example>

<div class="alert is-helpful">

テンプレート式は`undefined`を除き、グローバル名前空間からは何も参照することができません。また、`window`や`document`を参照することもできません。そして、`console.log()`や`Math.max()`を直接呼び出すこともできず、式コンテキストのメンバー変数の参照に制限されます。

</div>

### 名前の衝突を防ぐ

式が評価されるコンテキストは、テンプレート変数とディレクティブのコンテキストオブジェクト&mdash;それらが存在する場合&mdash;、そして、コンポーネントのメンバー変数からなります。
これらの中で衝突する名前空間を参照した場合、Angularは次の優先順位のロジックを適用してコンテキストを決定します:

1. テンプレート変数名
1. ディレクティブのコンテキスト中の名前
1. コンポーネントのメンバー変数名

変数が別のコンテキストの変数をシャドーイングする(隠蔽する)のを避けるため、変数名は一意に保つようにします。
次の例では、`AppComponent`テンプレートが`customer`であるPadmaに挨拶しています。

`ngFor`は、`customers`配列内の各`customer`を一覧します。

<code-example path="interpolation/src/app/app.component.1.ts" region="var-collision" header="src/app/app.component.ts"></code-example>

`ngFor` 内の `customer` は _ngFor_ で定義された暗黙の `<ng-template>` のコンテキストにあります。 これは `customers` 配列の各 `customer` を参照し、"Ebony" と "Chiho" を表示します。 "Padma" は配列にないので表示されません。

一方、`<h1>` はコンポーネントクラスの `customer` プロパティの値にバインドされている "Padma" を表示します。

## 式のベストプラクティス

テンプレート式を使用する場合は、次のベストプラクティスにしたがってください:

* **短い式を使う**

可能な限り複雑な式は書かずに、プロパティ名またはメソッドの呼び出しを使用してください。ビジネスロジックをコンポーネントに保持することで、開発とテストがしやすくなります。

* **実行速度に気をつける**

Angularは[変更検知](guide/glossary#change-detection)サイクルのたびにテンプレート式を実行します。Promiseの解決、HTTPの結果、タイマーイベント、キーの押下、マウスの動きなど、多くの非同期アクションが変更検知サイクルのトリガーになります。

特に低速のデバイスでは、UXを可能な限り効率的に保つために、式は迅速に終了する必要があります。計算がより多くのリソースを必要とする場合は、値のキャッシュを検討してください。

## 目に見えない副作用を生まない

Angularの[単方向データフローモデル](guide/glossary#unidirectional-data-flow)によると、テンプレート式はターゲットプロパティの値以外のアプリケーションの状態を変更すべきではありません。コンポーネントの値を読み取っても、他の表示された値を変更してはいけません。ビューは1回のレンダリングパスを通して安定している状態でなければなりません。

  <div class="callout is-important">
    <header>冪等式は副作用を軽減する</header>

[冪等](https://ja.wikipedia.org/wiki/%E5%86%AA%E7%AD%89)式は副作用がなく、Angularの変更検知のパフォーマンスを向上させます。Angularにおいての冪等式は、依存する値のいずれかが変更されるまで、常に*全く同じもの*を返します。

依存する値はイベントループが1回まわる間に変化するべきではありません。冪等式が文字列や数値を返す場合、2回連続で呼び出すと同じ文字列や数値が返されます。式がオブジェクトを返す場合、2回連続で呼び出すと同じオブジェクト参照を返します。

  </div>

 ## 次のステップ

* [プロパティバインディング](guide/property-binding)
* [イベントバインディング](guide/event-binding)

@reviewed 2023-09-01
