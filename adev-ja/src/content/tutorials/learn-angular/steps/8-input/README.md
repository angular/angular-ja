# コンポーネント入力プロパティ

アプリケーション開発では、コンポーネントにデータを送信しなければならない場合があります。このデータは、コンポーネントをカスタマイズしたり、親コンポーネントから子コンポーネントに情報を送信したりするために使用できます。

Angularは、`input` と呼ばれる概念を使用しています。これは、他のフレームワークの `props` と似ています。`input` プロパティを作成するには、`input()` 関数を使用します。

NOTE: 詳しくは、[入力プロパティでデータを受け取る方法についてのガイド](/guide/components/inputs)をご覧ください。

このアクティビティでは、`input()` 関数を使用してコンポーネントに情報を送信する方法を学びます。

<hr>

`Input` プロパティを作成するには、コンポーネントクラスのプロパティを `input()` 関数で初期化します。

<docs-code header="user.ts" language="ts">
class User {
  occupation = input<string>();
}
</docs-code>

`input` を通じて値を渡す準備ができたら、属性構文を使用してテンプレートで値を設定できます。以下は例です。

<docs-code header="app.ts" language="angular-ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
class App {}
</docs-code>

`input` 関数は `InputSignal` を返します。値を読み取るには、そのシグナルを関数として呼び出します。

<docs-code header="user.ts" language="angular-ts">
@Component({
  ...
  template: `<p>ユーザーの職業は {{occupation()}} です。</p>`
})
</docs-code>

<docs-workflow>

<docs-step title="`input()` プロパティを定義する">
`user.ts` の `User` クラスに `name` という `input` プロパティを定義しましょう。型は `string` で、初期値は設定せず、`input()` を引数なしで呼び出します。また、テンプレートを更新して、文の最後で `name` プロパティを呼び出して補間しましょう。
</docs-step>

<docs-step title="`input` プロパティに値を渡す">
`app.ts` のコードを更新して、`name` プロパティに `"Simran"` の値を送信します。
<br>

コードが正常に更新されると、アプリケーションに `The user's name is Simran` と表示されます。
</docs-step>

</docs-workflow>

これは素晴らしいことですが、コンポーネント通信の片方向だけです。子コンポーネントから親コンポーネントに情報とデータを送信したい場合はどうでしょうか？次のレッスンでその方法を学びましょう。

P.S. あなたは素晴らしいです - 頑張ってください 🎉
