# コンポーネントの組み立て

コンポーネントテンプレート、コンポーネントロジック、コンポーネントスタイルの更新方法を学びましたが、アプリケーションでコンポーネントをどのように使用するかについてはどうでしょうか？

コンポーネント設定の `selector` プロパティを使用すると、別のテンプレートでコンポーネントを参照する際に使用する名前が得られます。`selector` はHTMLタグのように使用します。たとえば、`app-user` はテンプレートでは `<app-user />` になります。

このアクティビティでは、コンポーネントの構成方法を学びます。

<hr/>

この例では、`UserComponent` と `AppComponent` の2つのコンポーネントがあります。

<docs-workflow>

<docs-step title="`UserComponent`への参照を追加">
`AppComponent` テンプレートを更新して、`app-user`セレクターを使用する `UserComponent` への参照を含めます。`AppComponent` のインポート配列に `UserComponent` を追加してください。これにより、`AppComponent` テンプレートで使用できるようになります。

```ts
template: `<app-user />`,
imports: [UserComponent]
```

コンポーネントは、`Username: youngTech` というメッセージを表示するようになりました。テンプレートコードを更新して、さらにマークアップを含めることができます。
</docs-step>

<docs-step title="さらにマークアップを追加">
テンプレートでは任意のHTMLマークアップを使用できるため、`AppComponent`のテンプレートを更新して、さらにHTML要素を含めてみてください。この例では、`<app-user>` 要素の親として `<section>` 要素を追加します。

```ts
template: `<section><app-user /></section>`,
```

</docs-step>

</docs-workflow>
必要なだけ多くのHTMLマークアップとコンポーネントを使用して、アプリのアイデアを実現できます。同じページにコンポーネントの複数のコピーを含めることもできます。

これは素晴らしい導入ですね。データに基づいてコンポーネントを条件付きで表示するにはどうすればよいでしょうか？詳細については、次のセクションをご覧ください。
