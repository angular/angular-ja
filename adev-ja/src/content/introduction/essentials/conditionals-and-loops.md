<docs-decorative-header title="条件分岐とループ" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
動的なデータに基づいてコンテンツの表示を切り替えたり、繰り返したりします。
</docs-decorative-header>

Angularのようなフレームワークを使用することの利点の1つは、開発者が遭遇する一般的な問題に対する組み込みの解決策を提供することです。これには、特定の条件に基づいてコンテンツを表示したり、アプリケーションデータに基づいてアイテムのリストをレンダリングしたりすることが含まれます。

この問題を解決するために、Angularは組み込みの制御フローブロックを使用します。これは、テンプレートがいつどのようにレンダリングされるかをフレームワークに伝えます。

## 条件付きレンダリング

開発者が遭遇する最も一般的なシナリオの1つは、条件に基づいてテンプレート内のコンテンツを表示または非表示にすることです。

この一般的な例は、ユーザーの権限レベルに基づいて、画面に特定のコントロールを表示するかどうかです。

### `@if` ブロック

JavaScriptの`if`ステートメントと同様に、Angularは`@if`制御フローブロックを使用して、テンプレートとそのコンテンツの一部を条件付きで非表示にし、表示します。

```ts
// user-controls.component.ts
@Component({
  standalone: true,
  selector: 'user-controls',
  template: `
    @if (isAdmin) {
      <button>データベースを消去</button>
    }
  `,
})
export class UserControls {
  isAdmin = true;
}
```

この例では、Angularは`isAdmin`プロパティがtrueの場合にのみ`<button>`要素をレンダリングします。それ以外の場合は、ページに表示されません。

### `@else` ブロック

`@if`ブロックは多くの状況で役立ちますが、条件が満たされない場合にフォールバックUIを表示することも一般的です。

たとえば、`UserControls`コンポーネントでは、空白の画面を表示するのではなく、ユーザーが認証されていないため何も表示されていないことをユーザーに知らせる方が役立ちます。

フォールバックが必要な場合は、JavaScriptの`else`句と同様に、`@else`ブロックを追加して同じ効果を実現します。

```ts
// user-controls.component.ts
@Component({
  standalone: true,
  selector: 'user-controls',
  template: `
    @if (isAdmin) {
      <button>データベースを消去</button>
    } @else {
      <p>権限がありません。</p>
    }
  `,
})
export class UserControls {
  isAdmin = true;
}
```

## リストのレンダリング

開発者が遭遇するもう1つの一般的なシナリオは、アイテムのリストをレンダリングする必要があることです。

### `@for` ブロック

JavaScriptの`for...of`ループと同様に、Angularは繰り返される要素をレンダリングするための`@for`ブロックを提供します。

```html
<!-- ingredient-list.component.html -->
<ul>
  @for (ingredient of ingredientList; track ingredient.name) {
    <li>{{ ingredient.quantity }} - {{ ingredient.name }}</li>
  }
</ul>
```

```ts
// ingredient-list.component.ts
@Component({
  standalone: true,
  selector: 'ingredient-list',
  templateUrl: './ingredient-list.component.html',
})
export class IngredientList {
  ingredientList = [
    {name: 'noodles', quantity: 1},
    {name: 'miso broth', quantity: 1},
    {name: 'egg', quantity: 2},
  ];
}
```

ただし、標準の`for...of`ループとは異なり、`track`キーワードが追加されていることに気付いたかもしれません。

#### `track`プロパティ

Angularが`@for`を使用して要素のリストをレンダリングすると、これらのアイテムは後で変更または移動される可能性があります。Angularは、通常、アイテムのプロパティを一意の識別子またはキーとして扱うことで、再順序付けを通じて各アイテムを追跡する必要があります。

これにより、リストへの更新がUIに正しく反映され、特に状態のある要素やアニメーションの場合に、Angular内で適切に追跡されます。

これを達成するために、`track`キーワードを使用してAngularに一意のキーを提供できます。

## 次のステップ

テンプレートがいつどのようにレンダリングされるかを決定する機能により、ほとんどのアプリケーションの重要な側面の1つであるユーザー入力の処理方法を学ぶことができます。

<docs-pill-row>
  <docs-pill title="ユーザーインタラクションの処理" href="essentials/handling-user-interaction" />
</docs-pill-row>
