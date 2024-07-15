# Angularのプロパティバインディング

Angularのプロパティバインディングを使用すると、HTML要素、Angularコンポーネントなどのプロパティの値を設定できます。

プロパティバインディングを使用して、プロパティや属性の値を動的に設定できます。ボタン機能の切り替え、画像パスのプログラムによる設定、コンポーネント間の値の共有などを行うことができます。

このアクティビティでは、テンプレートでプロパティバインディングを使用する方法を学びます。

<hr />

要素の属性にバインドするには、属性名を角括弧で囲みます。例を以下に示します。

```ts
<img alt="photo" [src]="imageURL">
```

この例では、`src`属性の値はクラスプロパティ`imageURL`にバインドされます。`imageURL`が持つ値は、`img`タグの`src`属性として設定されます。

<docs-workflow>

<docs-step title="`isEditable`というプロパティを追加する" header="app.component.ts" language="ts">
`app.component.ts`のコードを更新し、`AppComponent`クラスに`isEditable`というプロパティを追加します。初期値は`true`に設定します。

<docs-code highlight="[2]">
export class AppComponent {
    isEditable = true;
}
</docs-code>
</docs-step>

<docs-step title="`contentEditable`にバインドする" header="app.component.ts" language="ts">
次に、`div`の`contentEditable`属性を`isEditable`プロパティにバインドします。 <code aria-label="角括弧">[]</code>構文を使用します。

<docs-code highlight="[3]">
@Component({
    ...
    template: `<div [contentEditable]="isEditable"></div>`,
})
</docs-code>
</docs-step>

</docs-workflow>

これで、divは編集可能になりました。素晴らしいですね👍

プロパティバインディングは、Angularの強力な機能の1つです。詳細については、[Angularドキュメント](guide/templates/property-binding)をご覧ください。
