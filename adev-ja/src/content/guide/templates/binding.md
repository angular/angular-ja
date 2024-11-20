# 動的なテキスト、プロパティ、属性のバインディング

Angularでは、**バインディング**によってコンポーネントのテンプレートとそのデータ間に動的な接続が作成されます。この接続により、コンポーネントのデータの変更がレンダリングされたテンプレートに自動的に反映されます。

## テキスト補間による動的テキストのレンダリング {#render-dynamic-text-with-text-interpolation}

テンプレートで動的なテキストをバインドするには、二重中括弧を使用します。これは、Angularに内部の式を担当し、それが正しく更新されるように指示します。これは**テキスト補間**と呼ばれます。

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class AppComponent {
  theme = 'dark';
}
```

この例では、スニペットがページにレンダリングされると、Angularは`{{ theme }}`を`dark`に置き換えます。

```angular-html
<!-- Rendered Output -->
<p>Your color preference is dark.</p>
```

Angularは、最初のレンダリング時に式を評価するだけでなく、式の値が変更されると、レンダリングされたコンテンツも更新します。

テーマの例を続けると、ユーザーがページの読み込み後に`theme`の値を`'light'`に変更するボタンをクリックした場合、ページはそれに応じて以下のように更新されます。

```angular-html
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```

テキスト補間は、HTMLで通常テキストを記述する場所ならどこでも使用できます。

すべての式の値は文字列に変換されます。オブジェクトと配列は、値の`toString`メソッドを使用して変換されます。

## 動的なプロパティと属性のバインディング

Angularは、角括弧を使用して、動的な値をオブジェクトのプロパティとHTML属性にバインドすることをサポートしています。

HTML要素のDOMインスタンス、[コンポーネント](guide/components)インスタンス、または[ディレクティブ](guide/directives)インスタンスのプロパティにバインドできます。

### ネイティブ要素のプロパティ

すべてのHTML要素には、対応するDOM表現があります。たとえば、各`<button>`HTML要素は、DOM内の`HTMLButtonElement`のインスタンスに対応します。Angularでは、プロパティバインディングを使用して、要素のDOM表現に直接値を設定します。

```angular-html
<!-- ボタン要素のDOMオブジェクトの`disabled`プロパティをバインドします -->
<button [disabled]="isFormValid">Save</button>
```

この例では、`isFormValid`が変更されるたびに、Angularは`HTMLButtonElement`インスタンスの`disabled`プロパティを自動的に設定します。

### コンポーネントとディレクティブのプロパティ

要素がAngularコンポーネントの場合、同じ角括弧構文を使用して、コンポーネントの入力プロパティに値を設定するためにプロパティバインディングを使用できます。

```angular-html
<!-- `MyListbox`コンポーネントインスタンスの`value`プロパティをバインドします。 -->
<my-listbox [value]="mySelection" />
```

この例では、`mySelection`が変更されるたびに、Angularは`MyListbox`インスタンスの`value`プロパティを自動的に設定します。

ディレクティブのプロパティにもバインドできます。

```angular-html
<!-- `NgOptimizedImage`ディレクティブの`ngSrc`プロパティにバインドします  -->
<img [ngSrc]="profilePhotoUrl" alt="The current user's profile photo">
```

### 属性

対応するDOMプロパティを持たないHTML属性（ARIA属性やSVG属性など）を設定する必要がある場合は、テンプレート内の要素に属性をバインドするために`attr.`プレフィックスを使用できます。

```angular-html
<!-- `<ul>`要素の`role`属性をコンポーネントの`listRole`プロパティにバインドします。 -->
<ul [attr.role]="listRole">
```

この例では、`listRole`が変更されるたびに、Angularは`setAttribute`を呼び出して`<ul>`要素の`role`属性を自動的に設定します。

属性バインディングの値が`null`の場合、Angularは`removeAttribute`を呼び出して属性を削除します。

### プロパティと属性でのテキスト補間

二重中括弧構文を使用して、プロパティと属性にテキスト補間構文を使用できます。この構文を使用すると、Angularは代入をプロパティバインディングとして扱います。

```angular-html
<!-- 画像要素のDOMオブジェクトの`alt`プロパティに値をバインドします。 -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName }}" >
```

テキスト補間構文を使用して属性にバインドするには、属性名の前に`attr.`を付けます。

```angular-html
<button attr.aria-label="Save changes to {{ objectType }}">
```

## CSSクラスとスタイルプロパティのバインディング

Angularは、要素にCSSクラスとCSSスタイルプロパティをバインドするための追加機能をサポートしています。

### CSSクラス

CSSクラスバインディングを作成して、バインドされた値が[真偽値](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)かどうかによって、要素にCSSクラスを追加または削除できます。

```angular-html
<!-- `isExpanded`が真偽値の場合、`expanded`CSSクラスを追加します。 -->
<ul [class.expanded]="isExpanded">
```

`class`プロパティに直接バインドもできます。Angularは、3種類の値を受け付けます。

| `class`値の説明                                                                                                                                      | TypeScript型       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| スペースで区切られた1つ以上のCSSクラスを含む文字列                                                                                                   | `string`              |
| CSSクラス文字列の配列                                                                                                                                     | `string[]`            |
| 各プロパティ名がCSSクラス名で、対応する値がそのクラスが要素に適用されるかどうかを真偽値に基づいて決定するオブジェクト。 | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses"> ... </section>
    <button [class]="buttonClasses"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = ['expandable', 'elevated'];
  buttonClasses = {
    highlighted: true,
    embiggened: false,
  };
}
```

上記の例は、以下のDOMをレンダリングします。

```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

Angularは、有効なCSSクラス名ではない文字列値を無視します。

静的CSSクラスを使用する場合、`class`に直接バインドする場合、および特定のクラスをバインドする場合、Angularはレンダリングされた結果ですべてのクラスをインテリジェントに組み合わせます。

```angular-ts
@Component({
  template: `<ul class="list" [class]="listType" [class.expanded]="isExpanded"> ...`,
  ...
})
export class Listbox {
  listType = 'box';
  isExpanded = true;
}
```

上記の例では、Angularは`ul`要素を3つのCSSクラスすべてでレンダリングします。

```angular-html
<ul class="list box expanded">
```

Angularは、レンダリングされた要素のCSSクラスの特定の順序を保証しません。

`class`を配列かオブジェクトにバインドする場合、Angularは以前の値と現在の値を三重等号演算子(`===`)を使用して比較します。これらの値を変更する場合は、Angularが更新を適用するために新しいオブジェクトか配列インスタンスを作成する必要があります。

要素に同じCSSクラスの複数のバインディングがある場合、Angularはスタイルの優先順位に従って競合を解決します。

### CSSスタイルプロパティ

要素に直接CSSスタイルプロパティをバインドできます。

```angular-html
<!-- `isExpanded`プロパティに基づいてCSSの`display`プロパティを設定します。 -->
<section [style.display]="isExpanded ? 'block' : 'none'">
```

単位を受け付けるCSSプロパティについては、さらに単位を指定できます。

```angular-html
<!-- `sectionHeightInPixels`プロパティに基づいてCSSの`height`プロパティをピクセル値に設定します。 -->
<section [style.height.px]="sectionHeightInPixels">
```

複数のスタイル値を1つのバインディングで設定もできます。Angularは、以下の種類の値を受け付けます。

| `style`値の説明                                                                                              | TypeScript型       |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `"display: flex; margin: 8px"`などの、0個以上のCSS宣言を含む文字列。                                | `string`              |
| 各プロパティ名がCSSプロパティ名で、対応する値がそのCSSプロパティの値であるオブジェクト。 | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [style]="listStyles"> ... </ul>
    <section [style]="sectionStyles"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = 'display: flex; padding: 8px';
  sectionStyles = {
    border: '1px solid black',
    'font-weight': 'bold',
  };
}
```

上記の例は、以下のDOMをレンダリングします。

```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

`style`をオブジェクトにバインドする場合、Angularは以前の値と現在の値を3つ等しい演算子(`===`)を使用して比較します。これらの値を変更する場合は、Angularが更新を適用するために、新しいオブジェクトインスタンスを作成する必要があります。

要素に同じスタイルプロパティの複数のバインディングがある場合、Angularはスタイルの優先順位に従って競合を解決します。
