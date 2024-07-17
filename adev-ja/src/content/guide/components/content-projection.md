# `ng-content` によるコンテンツの投影

TIP: このガイドは、[Essentials ガイド](essentials) を既読であることを前提としています。Angular を初めて使用する場合は、まずそちらを読んでください。

多くの場合、さまざまな種類のコンテンツのコンテナとして機能するコンポーネントを作成する必要があります。たとえば、カスタムカードコンポーネントを作成したい場合があります。

```ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {/* ... */}
```

**`<ng-content>` 要素を使用して、コンテンツを配置する場所を示すプレースホルダーにすることができます。**

```ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content></ng-content> </div>',
})
export class CustomCard {/* ... */}
```

TIP: `<ng-content>` は [ネイティブの `<slot>` 要素](https://developer.mozilla.org/docs/Web/HTML/Element/slot) と似ていますが、Angular 特有の機能がいくつかあります。

`<ng-content>` を使用してコンポーネントを使用すると、コンポーネントホスト要素の子要素はすべて、その `<ng-content>` の場所にレンダリングされるか、**投影**されます。

```ts
// コンポーネントソース
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {/* ... */}
```

```html
<!-- コンポーネントの使用 -->
<custom-card>
  <p>これが投影されたコンテンツです</p>
</custom-card>
```

```html
<!-- レンダリングされた DOM -->
<custom-card>
  <div class="card-shadow">
    <p>これが投影されたコンテンツです</p>
  </div>
</custom-card>
```

Angular は、このように渡されるコンポーネントの子要素を、そのコンポーネントの**コンテンツ**と呼びます。これは、コンポーネントの**ビュー**とは異なります。コンポーネントのビューとは、コンポーネントのテンプレートで定義された要素のことです。

**`<ng-content>` 要素は、コンポーネントでも DOM 要素でもありません。**代わりに、Angular にコンテンツをレンダリングする場所を伝える特別なプレースホルダーです。Angular のコンパイラは、ビルド時にすべての `<ng-content>` 要素を処理します。実行時に `<ng-content>` を挿入、削除、または変更することはできません。**<span style="text-decoration:underline;">ディレクティブ</span>**、スタイル、または任意の属性を `<ng-content>` に追加することはできません。

`<ng-content>` を `ngIf`、`ngFor`、または `ngSwitch` で条件付きで含めるべきではありません。コンポーネントコンテンツの条件付きレンダリングについては、[テンプレートフラグメント](api/core/ng-template) を参照してください。

## 複数のコンテンツプレースホルダー

Angular は、CSS セレクターに基づいて、複数の異なる要素を異なる `<ng-content>` プレースホルダーに投影することをサポートしています。上記のカードの例を拡張して、`select` 属性を使用して、カードのタイトルとカードの本文の 2 つのプレースホルダーを作成できます。

```html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body"></ng-content>
</div>
```

```html
<!-- コンポーネントの使用 -->
<custom-card>
  <card-title>こんにちは</card-title>
  <card-body>例へようこそ</card-body>
</custom-card>
```

```html
<!-- レンダリングされた DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>こんにちは</card-title>
    <div class="card-divider"></div>
    <card-body>例へようこそ</card-body>
  </div>
</custom-card>
```

`<ng-content>` プレースホルダーは、[コンポーネントセレクター](guide/components/selectors) と同じ CSS セレクターをサポートしています。

`select` 属性を持つ `<ng-content>` プレースホルダーを 1 つ以上と、`select` 属性を持たない `<ng-content>` プレースホルダーを 1 つ含める場合、後者は `select` 属性に一致しないすべての要素をキャプチャします。

```html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- "card-title" 以外のものをすべてキャプチャ -->
  <ng-content></ng-content>
</div>
```

```html
<!-- コンポーネントの使用 -->
<custom-card>
  <card-title>こんにちは</card-title>
  <img src="..." />
  <p>例へようこそ</p>
</custom-card>
```

```html
<!-- レンダリングされた DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>こんにちは</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>例へようこそ</p>
  </div>
</custom-card>
```

コンポーネントに `select` 属性を持たない `<ng-content>` プレースホルダーが含まれていない場合、コンポーネントのプレースホルダーのいずれにも一致しない要素は DOM にレンダリングされません。

## 投影のためのコンテンツのエイリアシング

Angular は、`ngProjectAs` という特別な属性をサポートしています。この属性を使用すると、任意の要素に CSS セレクターを指定できます。`ngProjectAs` を持つ要素が `<ng-content>` プレースホルダーに対してチェックされるたびに、Angular は要素の ID ではなく、`ngProjectAs` の値を比較します。

```html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content></ng-content>
</div>
```

```html
<!-- コンポーネントの使用 -->
<custom-card>
  <h3 ngProjectAs="card-title">こんにちは</h3>

  <p>例へようこそ</p>
</custom-card>
```

```html
<!-- レンダリングされた DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>こんにちは</h3>
    <div class="card-divider"></div>
    <p>例へようこそ</p>
  </div>
</custom-card>
```

`ngProjectAs` は、静的な値のみをサポートし、動的な式にバインドすることはできません。
