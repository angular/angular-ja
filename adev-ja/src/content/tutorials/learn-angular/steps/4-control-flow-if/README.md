# コンポーネントの制御フロー - `@if`

ユーザーの画面に表示するものを決定することは、アプリケーション開発における一般的なタスクです。多くの場合、決定は条件を使用してプログラム的に行われます。

テンプレートで条件付き表示を表現するために、Angularは`@if`テンプレート構文を使用します。

NOTE: [エッセンシャルガイドの制御フロー](/essentials/templates#control-flow-with-if-and-for)も参照してください。

このアクティビティでは、テンプレートで条件式を使用する方法を学びます。

<hr/>

テンプレートで要素の条件付き表示を可能にする構文は`@if`です。

コンポーネントで`@if`構文を使用する方法の例を以下に示します。

```angular-ts
@Component({
  ...
  template: `
    @if (isLoggedIn) {
      <p>Welcome back, Friend!</p>
    }
  `,
})
class App {
  isLoggedIn = true;
}
```

2つの注意すべき点があります。

- `if`に`@`プレフィックスが付いているのは、[Angularテンプレート構文](guide/templates)と呼ばれる特殊なタイプの構文だからです。
- v16以前のアプリケーションを使用している場合は、詳細については[AngularドキュメントのNgIf](guide/directives/structural-directives)を参照してください。

<docs-workflow>

<docs-step title="`isServerRunning`というプロパティを作成する">
`App`クラスに、`isServerRunning`という`boolean`型のプロパティを追加し、初期値を`true`に設定します。
</docs-step>

<docs-step title="テンプレートで`@if`を使用する">
`isServerRunning`の値が`true`の場合、`Yes, the server is running`というメッセージを表示するようにテンプレートを更新します。

</docs-step>

<docs-step title="テンプレートで`@else`を使用する">
Angularは現在、`@else`構文を使用してelseケースを定義するためのネイティブテンプレート構文をサポートしています。`else`ケースとして`No, the server is not running`というメッセージを表示するようにテンプレートを更新します。

例を以下に示します。

```angular-ts
template: `
  @if (isServerRunning) { ... }
  @else { ... }
`;
```

不足しているマークアップを埋めるためにコードを追加します。

</docs-step>

</docs-workflow>

このタイプの機能は条件付き制御フローと呼ばれます。次に、テンプレートで項目を繰り返す方法を学びます。
