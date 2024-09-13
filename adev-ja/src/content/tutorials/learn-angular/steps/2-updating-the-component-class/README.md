# コンポーネントクラスの更新

Angularでは、コンポーネントのロジックと動作は、コンポーネントのTypeScriptクラスで定義されます。

このアクティビティでは、コンポーネントクラスの更新方法と、[補間](/guide/templates/binding#render-dynamic-text-with-text-interpolation)の使用方法について学習します。

<hr />

<docs-workflow>

<docs-step title="`city`というプロパティを追加">
`AppComponent`クラスに`city`というプロパティを追加することで、コンポーネントクラスを更新します。

```ts
export class AppComponent {
  city = 'San Francisco';
}
```

`city`プロパティは`string`型ですが、[TypeScriptでの型推論](https://www.typescriptlang.org/docs/handbook/type-inference.html)により、型を省略できます。`city`プロパティは`AppComponent`クラスで使用でき、コンポーネントテンプレートで参照できます。

<br>

テンプレートでクラスプロパティを使用するには、`{{ }}`構文を使用する必要があります。
</docs-step>

<docs-step title="コンポーネントテンプレートの更新">
以下のHTMLに一致するように、`template`プロパティを更新します。

```ts
template: `Hello {{ city }}`,
```

これは補間の例であり、Angularテンプレート構文の一部です。これにより、テンプレートに動的なテキストを配置するだけでなく、多くのことができます。この構文を使用して、関数呼び出し、式の記述なども実行できます。
</docs-step>

<docs-step title="補間のさらなる練習">
試してみてください - 内容が`1 + 1`である別の`{{ }}`を追加します。

```ts
template: `Hello {{ city }}, {{ 1 + 1 }}`,
```

Angularは`{{ }}`の内容を評価し、出力結果をテンプレートにレンダリングします。
</docs-step>

</docs-workflow>

これはAngularテンプレートで可能なことのほんの一部です。さらに学び続けて、詳細を調べてください。
