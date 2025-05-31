# `ng-content` を使ったコンテンツの投影

TIP: このガイドは、すでに [基本概念のガイド](essentials) を読んだことを前提としています。Angularを初めて使う場合は、まずそちらを読んでください。

多くの場合、さまざまな種類のコンテンツを格納するコンポーネントを作成する必要があります。
例えば、カスタムカードコンポーネントを作成したいとします。

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {/* ... */}
```

**`<ng-content>`要素は、コンテンツを配置する場所を示すプレースホルダーとして使用できます。**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content></ng-content> </div>',
})
export class CustomCard {/* ... */}
```

TIP: `<ng-content>`は、
[ネイティブの`<slot>`要素](https://developer.mozilla.org/docs/Web/HTML/Element/slot)と似ていますが、
Angular固有の機能も備えています。

`<ng-content>`を使用したコンポーネントを使用する場合、
コンポーネントホスト要素の子要素はすべて、その`<ng-content>`の場所にレンダリング、あるいは**投影されます**:

```angular-ts
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

```angular-html
<!-- コンポーネントの利用 -->
<custom-card>
  <p>これは投影されたコンテンツです</p>
</custom-card>
```

```angular-html
<!-- レンダリングされたDOM -->
<custom-card>
  <div class="card-shadow">
    <p>これは投影されたコンテンツです</p>
  </div>
</custom-card>
```

Angularは、このように渡されるコンポーネントの子要素を、そのコンポーネントの**コンテンツ**と呼びます。
これはコンポーネントの**ビュー**とは異なります。
ビューは、コンポーネントのテンプレートで定義された要素を指します。

**`<ng-content>`要素は、コンポーネントでもDOM要素でもありません。**
代わりに、コンテンツをレンダリングする場所をAngularに伝える特別なプレースホルダーです。
Angularのコンパイラは、ビルド時にすべての`<ng-content>`要素を処理します。
実行時に`<ng-content>`の挿入や削除、変更はできません。ディレクティブやスタイル、任意の属性も`<ng-content>`には追加できません。

`<ng-content>`を`@if`、`@for`、または`@switch`によって条件付きで含めるべきではありません。
Angularは常にレンダリングされたコンテンツのDOMノードをインスタンス化して作成します。
その`<ng-content>`プレースホルダが非表示であってもです。コンポーネントコンテンツの条件付きレンダリングについては
[テンプレートフラグメント](api/core/ng-template)を参照してください。

## 複数のコンテンツプレースホルダー

Angularは、CSSセレクターに基づいて、複数の異なる要素を異なる`<ng-content>`プレースホルダーへの投影をサポートしています。
上記のカードの例を拡張して、`select`属性を使用して、
カードのタイトルと本文の2つのプレースホルダーを作成できます。

```angular-html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body"></ng-content>
</div>
```

```angular-html
<!-- コンポーネントの利用 -->
<custom-card>
  <card-title>こんにちは</card-title>
  <card-body>例へようこそ</card-body>
</custom-card>
```

```angular-html
<!-- レンダリングされたDOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>こんにちは</card-title>
    <div class="card-divider"></div>
    <card-body>例へようこそ</card-body>
  </div>
</custom-card>
```

`<ng-content>`プレースホルダーは、
[コンポーネントセレクター](guide/components/selectors)と同じCSSセレクターをサポートしています。

`select`属性を持つ`<ng-content>`プレースホルダーを1つ以上、
`select`属性を持たない`<ng-content>`プレースホルダーを1つ含める場合、
後者は`select`属性に一致しなかったすべての要素をキャプチャします。

```angular-html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- "card-title"以外をすべてキャプチャ -->
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- コンポーネントの利用 -->
<custom-card>
  <card-title>こんにちは</card-title>
  <img src="..." />
  <p>例へようこそ</p>
</custom-card>
```

```angular-html
<!-- レンダリングされたDOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>こんにちは</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>例へようこそ</p>
  </div>
</custom-card>
```

コンポーネントに`select`属性を持たない`<ng-content>`プレースホルダーが含まれていない場合、
コンポーネントのいずれかのプレースホルダーに一致しない要素はDOMにレンダリングされません。

## フォールバックコンテンツ

Angularは、コンポーネントの`<ng-content>`プレースホルダーに一致する子コンテンツがない場合、コンポーネントの`<ng-content>`プレースホルダーに*フォールバックコンテンツ*を表示できます。`<ng-content>`要素自体に子コンテンツを追加することで、フォールバックコンテンツを指定できます。

```angular-html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```

```angular-html
<!-- コンポーネントの利用 -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- No card-body provided -->
</custom-card>
```

```angular-html
<!-- レンダリングされたDOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```

## 投影のためのコンテンツのエイリアシング

Angularは、任意の要素にCSSセレクターを指定できる特殊な属性`ngProjectAs`をサポートしています。
`ngProjectAs`を持つ要素が`<ng-content>`プレースホルダーに対してチェックされると、
Angularは要素のIDではなく`ngProjectAs`の値と比較します。

```angular-html
<!-- コンポーネントテンプレート -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- コンポーネントの利用 -->
<custom-card>
  <h3 ngProjectAs="card-title">こんにちは</h3>

  <p>例へようこそ</p>
</custom-card>
```

```angular-html
<!-- レンダリングされたDOM -->
<custom-card>
  <div class="card-shadow">
    <h3>こんにちは</h3>
    <div class="card-divider"></div>
    <p>例へようこそ</p>
  </div>
</custom-card>
```

`ngProjectAs`は静的な値のみをサポートし、動的な式にはバインドできません。
