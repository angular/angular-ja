# コンポーネントの制御フロー - `@for`

ウェブアプリケーションを構築する際には、特定の回数だけコードを繰り返したい場合があります。たとえば、名前の配列が与えられた場合、それぞれの名前を `<p>` タグで表示したい場合があります。

NOTE: [エッセンシャルガイドの制御フロー](/essentials/templates#control-flow-with-if-and-for) もあわせてご覧ください。

このアクティビティでは、`@for` を使用してテンプレートで要素を繰り返す方法について説明します。

<hr/>

テンプレートで要素を繰り返す機能を提供する構文は `@for` です。

コンポーネントで `@for` 構文を使用する方法の例を以下に示します。

```angular-ts
@Component({
  ...
  template: `
    @for (os of operatingSystems; track os.id) {
      {{ os.name }}
    }
  `,
})
export class App {
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'MacOS'}, {id: 'linux', name: 'Linux'}];
}
```

注意すべき点が2つあります。

- `for` に `@` プレフィックスが付いているのは、[Angular テンプレート構文](guide/templates)と呼ばれる特殊な構文であるためです。
- v16以前のアプリケーションを使用している場合は、[NgFor の Angular ドキュメント](guide/directives/structural-directives)を参照してください。

<docs-workflow>

<docs-step title="`users`プロパティを追加">
`App` クラスで、ユーザーとその名前を含む `users` というプロパティを追加します。

```ts
[{id: 0, name: 'Sarah'}, {id: 1, name: 'Amy'}, {id: 2, name: 'Rachel'}, {id: 3, name: 'Jessica'}, {id: 4, name: 'Poornima'}]
```

</docs-step>

<docs-step title="テンプレートを更新">
`@for` テンプレート構文を使用して、各ユーザー名を `p` 要素で表示するようにテンプレートを更新します。

```angular-html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

NOTE: `track` の使用は必須です。`id` またはその他のユニークな識別子を使用できます。

</docs-step>

</docs-workflow>

このタイプの機能は、制御フローと呼ばれます。次に、コンポーネントをカスタマイズして通信する方法について学びます。ちなみに、あなたは素晴らしい仕事をしています。
