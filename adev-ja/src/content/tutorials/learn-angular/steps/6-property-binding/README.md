# Angularのプロパティバインディング

Angularのプロパティバインディングを使用すると、HTML要素、Angularコンポーネントなどのプロパティの値を設定できます。

プロパティバインディングを使用して、プロパティや属性の値を動的に設定できます。ボタン機能の切り替え、画像パスのプログラムによる設定、コンポーネント間の値の共有などを行うことができます。

NOTE: 詳しくは、[エッセンシャルガイドの動的なプロパティや属性の設定](/essentials/templates#setting-dynamic-properties-and-attributes)もご覧ください。

このアクティビティでは、テンプレートでプロパティバインディングを使用する方法を学びます。

<hr />

要素の属性にバインドするには、属性名を角括弧で囲みます。例を以下に示します。

```angular-html
<img alt="photo" [src]="imageURL" />
```

この例では、`src`属性の値はクラスプロパティ`imageURL`にバインドされます。`imageURL`が持つ値は、`img`タグの`src`属性として設定されます。

<docs-workflow>

<docs-step title="`isEditable`というプロパティを追加する" header="app.ts" language="ts">
`app.ts`のコードを更新し、`App`クラスに`isEditable`というプロパティを追加します。初期値は`true`に設定します。

```ts {highlight:[2]}
export class App {
  isEditable = true;
}
```

</docs-step>

<docs-step title="`contentEditable`にバインドする" header="app.ts" language="ts">
次に、`div`の`contentEditable`属性を`isEditable`プロパティにバインドします。 <code aria-label="角括弧">[]</code>構文を使用します。

```angular-ts {highlight:[3]}
@Component({
  ...
  template: `<div [contentEditable]="isEditable"></div>`,
})
```

</docs-step>

</docs-workflow>

これで、divは編集可能になりました。すばらしいですね👍

プロパティバインディングは、Angularの強力な機能の1つです。詳細については、[Angularドキュメント](guide/templates/binding#css-class-and-style-property-bindings)をご覧ください。
