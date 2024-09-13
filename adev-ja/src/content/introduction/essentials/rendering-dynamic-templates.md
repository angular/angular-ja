<docs-decorative-header title="動的なテンプレートのレンダリング" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Angularのテンプレート構文を使用して、動的なHTMLを作成します。
</docs-decorative-header>

これまで学んできたことは、アプリケーションをHTMLのコンポーネントに分割することを可能にしますが、これらは静的なテンプレート（つまり、変化しないコンテンツ）に限定されます。次のステップは、Angularのテンプレート構文を使用して動的なHTMLを作成する方法を学ぶことです。

## 動的なデータのレンダリング

テンプレートに動的なコンテンツを表示する必要がある場合、Angularは二重中括弧構文を使用して、静的なコンテンツと動的なコンテンツを区別します。

以下は、`TodoListItem`コンポーネントの簡略化された例です。

```angular-ts
@Component({
  selector: 'todo-list-item',
  template: `
    <p>Title: {{ taskTitle }}</p>
  `,
})
export class TodoListItem {
  taskTitle = 'Read cup of coffee';
}
```

Angularがコンポーネントをレンダリングすると、次の出力が見られます。

```angular-html
<p>Title: Read cup of coffee</p>
```

この構文は、HTML内の動的データプロパティ間の**補間**を宣言します。その結果、データが変更されるたびに、Angularは自動的にDOMを更新してプロパティの新しい値を反映します。

## 動的なプロパティ

HTML要素の標準DOMプロパティの値を動的に設定する必要がある場合、そのプロパティは角括弧で囲まれます。これにより、Angularに宣言された値が、プレーンな文字列ではなく、JavaScriptのようなステートメント（[Angularの拡張機能付き](guide/templates/binding#render-dynamic-text-with-text-interpolation)）として解釈されるべきであることを伝えます。

たとえば、HTMLでプロパティを動的に更新する一般的な例は、フォームが有効かどうかによって、フォーム送信ボタンを無効にするかどうかを決定することです。

目的のプロパティを角括弧で囲むことで、Angularに割り当てられた値が動的である（つまり、静的な文字列ではない）ことを伝えます。

```angular-ts
@Component({
  selector: 'sign-up-form',
  template: `
    <button type="submit" [disabled]="formIsInvalid">Submit</button>
  `,
})
export class SignUpForm {
  formIsInvalid = true;
}
```

この例では、`formIsInvalid`がtrueであるため、レンダリングされたHTMLは次のようになります。

```angular-html
<button type="submit" disabled>Submit</button>
```

## 動的な属性

カスタムHTML属性（例：`aria-`、`data-`など）を動的にバインドしたい場合、カスタム属性を同じ角括弧で囲むことを試みるかもしれません。

```angular-ts
@Component({
  standalone: true,
  template: `
    <button [data-test-id]="testId">Primary CTA</button>
  `,
})
export class AppBanner {
  testId = 'main-cta';
}
```

残念ながら、これは機能しません。なぜなら、カスタムHTML属性は標準DOMプロパティではないからです。これを意図したとおりに機能させるには、カスタムHTML属性の前に`attr.`プレフィックスを追加する必要があります。

```angular-ts
@Component({
  standalone: true,
  template: `
    <button [attr.data-test-id]="testId">Primary CTA</button>
  `,
})
export class AppBanner {
  testId = 'main-cta';
}
```

## 次のステップ

アプリケーションに動的なデータとテンプレートができたので、条件付きで特定の要素を非表示または表示したり、要素をループ処理したりするなど、テンプレートを強化する方法を学ぶ時がきました。

<docs-pill-row>
  <docs-pill title="条件分岐とループ" href="essentials/conditionals-and-loops" />
</docs-pill-row>
