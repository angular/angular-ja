# `@Input` を使ったコンポーネント間の通信

アプリケーション開発では、コンポーネントにデータを送信しなければならない場合があります。このデータは、コンポーネントをカスタマイズしたり、親コンポーネントから子コンポーネントに情報を送信したりするために使用できます。

Angularは、`Input` と呼ばれる概念を使用しています。これは、他のフレームワークの `props` と似ています。`Input` プロパティを作成するには、`@Input` デコレーターを使用します。

このアクティビティでは、`@Input` デコレーターを使用してコンポーネントに情報を送信する方法を学びます。

<hr>

`Input` プロパティを作成するには、コンポーネントクラスのプロパティに `@Input` デコレーターを追加します。

<docs-code header="user.component.ts" language="ts">
class UserComponent {
  @Input() occupation = '';
}
</docs-code>

`Input` を通じて値を渡す準備ができたら、属性構文を使用してテンプレートで値を設定できます。以下は例です。

<docs-code header="app.component.ts" language="angular-ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"><app-user/>`
})
class AppComponent {}
</docs-code>

`UserComponent` で `occupation`プロパティをバインドしていることを確認してください。

<docs-code header="user.component.ts" language="angular-ts">
@Component({
  ...
  template: `<p>ユーザーの職業は {{occupation}} です。</p>`
})
</docs-code>

<docs-workflow>

<docs-step title="`@Input` プロパティを定義する">
`user.component.ts` のコードを更新して、`UserComponent` に `name` という `Input` プロパティを定義します。今のところ、初期値を `空文字列` に設定します。テンプレートを更新して、文末に `name` プロパティを補間することを忘れないでください。
</docs-step>

<docs-step title="`@Input` プロパティに値を渡す">
`app.component.ts` のコードを更新して、`name` プロパティに `"Simran"` の値を送信します。
<br>

コードが正常に更新されると、アプリケーションに `The user's name is Simran` と表示されます。
</docs-step>

</docs-workflow>

これは素晴らしいことですが、コンポーネント通信の片方向だけです。子コンポーネントから親コンポーネントに情報とデータを送信したい場合はどうでしょうか？次のレッスンでその方法を学びましょう。

P.S. あなたは素晴らしいです - 頑張ってください 🎉
