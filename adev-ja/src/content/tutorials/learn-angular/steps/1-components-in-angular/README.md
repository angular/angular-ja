# Angular のコンポーネント

コンポーネントは、あらゆるAngularアプリケーションの基礎となる基本要素です。各コンポーネントには、次の3つの部分があります。

- TypeScriptクラス
- HTMLテンプレート
- CSSスタイル

NOTE: 詳しくは[エッセンシャルガイドのコンポーネント](/essentials/components)をご覧ください。

このアクティビティでは、コンポーネントのテンプレートとスタイルを更新する方法を学習します。

<hr />

これはAngularを始めるのに最適な機会です。

<docs-workflow>

<docs-step title="コンポーネントテンプレートの更新">
`template` プロパティを `Hello Universe` と読み取れるように更新します。

```ts
template: `
  Hello Universe
`,
```

HTMLテンプレートを変更すると、プレビューがメッセージで更新されます。さらに一歩進んで、テキストの色を変更してみましょう。
</docs-step>

<docs-step title="コンポーネントスタイルの更新">
スタイル値を更新し、`color` プロパティを `blue` から `#a144eb` に変更します。

```ts
styles: `
  :host {
    color: #a144eb;
  }
`,
```

プレビューを確認すると、テキストの色が変更されていることがわかります。
</docs-step>

</docs-workflow>

Angularでは、ブラウザでサポートされているすべてのCSSとHTMLを使用できます。必要に応じて、テンプレートとスタイルを別々のファイルにも保存できます。
