# `<ng-template>` を使用したテンプレートフラグメントの作成

[ネイティブの `<template>` 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) に触発されて、`<ng-template>` 要素を使用すると、**テンプレートフラグメント**、つまり動的またはプログラムによってレンダリングできるコンテンツのセクションを宣言できます。

## テンプレートフラグメントの作成

`<ng-template>` 要素を使用して、コンポーネントテンプレート内のどこにでもテンプレートフラグメントを作成できます。

```angular-html
<p>これは通常の要素です</p>

<ng-template>
  <p>これはテンプレートフラグメントです</p>
</ng-template>
```

上記のコードをレンダリングすると、`<ng-template>` 要素の内容はページにレンダリングされません。代わりに、テンプレートフラグメントへの参照を取得して、コードを記述して動的にレンダリングできます。

### フラグメントのコンテキストの結合

テンプレートフラグメントには、動的な式を含む結合を含めることができます。

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>選択した項目は {{count}} 個です。</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

テンプレートフラグメント内の式またはステートメントは、フラグメントがレンダリングされる場所とは関係なく、フラグメントが宣言されているコンポーネントに対して評価されます。

## テンプレートフラグメントへの参照の取得

テンプレートフラグメントへの参照は、次のいずれかの方法で取得できます。

- `<ng-template>` 要素に [テンプレート参照変数](/guide/templates/variables#template-reference-variables) を宣言する
- [コンポーネントまたはディレクティブクエリ](/guide/components/queries) を使用してフラグメントをクエリする
- `<ng-template>` 要素に直接適用されているディレクティブ内でフラグメントを注入する

これらのすべての場合において、フラグメントは [TemplateRef](/api/core/TemplateRef) オブジェクトによって表されます。

### テンプレート参照変数を使用したテンプレートフラグメントへの参照

テンプレート参照変数を `<ng-template>` 要素に追加することで、同じテンプレートファイル内の他の部分でそのテンプレートフラグメントを参照できます。

```angular-html
<p>これは通常の要素です</p>

<ng-template #myFragment>
  <p>これはテンプレートフラグメントです</p>
</ng-template>
```

その後、`myFragment` 変数を使用して、テンプレート内の他の場所でこのフラグメントを参照できます。

### クエリを使用したテンプレートフラグメントへの参照

[コンポーネントまたはディレクティブクエリAPI](/guide/components/queries) を使用して、テンプレートフラグメントへの参照を取得できます。

たとえば、テンプレートにテンプレートフラグメントが1つだけ含まれている場合は、`@ViewChild` クエリを使用して `TemplateRef` オブジェクトを直接クエリできます。

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>これは通常の要素です</p>

    <ng-template>
      <p>これはテンプレートフラグメントです</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  @ViewChild(TemplateRef) myFragment: TemplateRef<unknown> | undefined;
}
```

その後、他のクラスメンバーと同様に、コンポーネントコードまたはコンポーネントのテンプレート内でこのフラグメントを参照できます。

テンプレートに複数のフラグメントが含まれている場合は、各 `<ng-template>` 要素にテンプレート参照変数を追加して、その名前でフラグメントをクエリすることで、各フラグメントに名前を付けることができます。

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>これは通常の要素です</p>

    <ng-template #fragmentOne>
      <p>これはテンプレートフラグメントの 1 つです</p>
    </ng-template>

    <ng-template #fragmentTwo>
      <p>これは別のテンプレートフラグメントです</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  // 名前でクエリを行う場合、`read` オプションを使用して、
  // 要素に関連付けられている `TemplateRef` オブジェクトを取得したいことを指定できます。
  @ViewChild('fragmentOne', {read: TemplateRef}) fragmentOne: TemplateRef<unknown> | undefined;
  @ViewChild('fragmentTwo', {read: TemplateRef}) fragmentTwo: TemplateRef<unknown> | undefined;
}
```

繰り返しますが、他のクラスメンバーと同様に、コンポーネントコードまたはコンポーネントのテンプレート内でこれらのフラグメントを参照できます。

### テンプレートフラグメントの注入

ディレクティブは、そのディレクティブが `<ng-template>` 要素に直接適用されている場合、`TemplateRef` を注入できます。

```angular-ts
@Directive({
  selector: '[myDirective]'
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}
```

```angular-html
<ng-template myDirective>
  <p>これはテンプレートフラグメントの 1 つです</p>
</ng-template>
```

その後、他のクラスメンバーと同様に、ディレクティブコード内でこのフラグメントを参照できます。

## テンプレートフラグメントのレンダリング

`TemplateRef` オブジェクトへの参照を取得したら、`NgTemplateOutlet` ディレクティブを使用してテンプレート内でフラグメントをレンダリングするか、`ViewContainerRef` を使用してTypeScriptコード内でフラグメントをレンダリングできます。

### `NgTemplateOutlet` の使用

`@angular/common` の `NgTemplateOutlet` ディレクティブは、`TemplateRef` を受け取り、アウトレットに要素を持つ要素の**兄弟**としてフラグメントをレンダリングします。通常、`NgTemplateOutlet` は [`<ng-container>` 要素](/guide/templates/ng-container) で使用する必要があります。

まず、`NgTemplateOutlet` をインポートします:
```typescript
import { NgTemplateOutlet } from '@angular/common';
```

次の例では、テンプレートフラグメントを宣言し、そのフラグメントを `NgTemplateOutlet` を使用して `<ng-container>` 要素にレンダリングします。

```angular-html
<p>これは通常の要素です</p>

<ng-template #myFragment>
  <p>これはフラグメントです</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

この例では、次のレンダリングされたDOMが生成されます。

```angular-html
<p>これは通常の要素です</p>
<p>これはフラグメントです</p>
```

### `ViewContainerRef` の使用

**ビューコンテナ**は、Angularのコンポーネントツリー内の、コンテンツを含めることができるノードです。コンポーネントまたはディレクティブはすべて、`ViewContainerRef` を注入して、そのコンポーネントまたはディレクティブのDOM内の位置に対応するビューコンテナへの参照を取得できます。

`ViewContainerRef` の `createEmbeddedView` メソッドを使用して、テンプレートフラグメントを動的にレンダリングできます。`ViewContainerRef` を使用してフラグメントをレンダリングすると、Angularは、`ViewContainerRef` を注入したコンポーネントまたはディレクティブの次の兄弟として、そのフラグメントをDOMに追加します。

次の例は、テンプレートフラグメントへの参照を入力として受け取り、ボタンクリック時にそのフラグメントをDOMにレンダリングするコンポーネントを示しています。

```angular-ts
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>フラグメントを含むコンポーネント</h2>
    <ng-template #myFragment>
      <p>これがフラグメントです</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">表示</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();

  showFragment() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}
```

上記の例では、「表示」ボタンをクリックすると、次の出力が生成されます。

```angular-html
<component-with-fragment>
  <h2>フラグメントを含むコンポーネント>
  <my-outlet>
    <button>表示</button>
  </my-outlet>
  <p>これがフラグメントです</p>
</component-with-fragment>
```

## テンプレートフラグメントのレンダリング時のパラメータの受け渡し

`<ng-template>` を使用してテンプレートフラグメントを宣言する際、さらにフラグメントで受け入れられるパラメータを宣言できます。フラグメントをレンダリングする際には、これらのパラメータに対応する `context` オブジェクトを最適に渡すことができます。このコンテキストオブジェクトのデータは、結合式やステートメント内で使用できます。また、フラグメントが宣言されているコンポーネントからのデータも参照できます。

各パラメータは、`let-` プレフィックスを付けた属性として記述され、値はコンテキストオブジェクトのプロパティ名と一致しています。

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>選択したのは: {{pizzaTopping}}</p>
</ng-template>
```

### `NgTemplateOutlet` の使用

`ngTemplateOutletContext` 入力にコンテキストオブジェクトを結合できます。

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>選択したのは: {{pizzaTopping}}</p>
</ng-template>

<ng-container
  [ngTemplateOutlet]="myFragment"
  [ngTemplateOutletContext]="{topping: '玉ねぎ'}"
/>
```

### `ViewContainerRef` の使用

`createEmbeddedView` に対する2番目の引数として、コンテキストオブジェクトを渡すことができます。

```angular-ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: '玉ねぎ'});
```

## 構造ディレクティブ

**構造ディレクティブ**とは、次のいずれかの条件を満たすディレクティブです。

- `TemplateRef` を注入する
- `ViewContainerRef` を注入し、注入された `TemplateRef` をプログラムによってレンダリングする

Angularは、構造ディレクティブ向けの特別な便利な構文をサポートしています。ディレクティブを要素に適用し、ディレクティブのセレクターの前にアスタリスク (`*`) 文字を付けると、Angularは要素全体とそのコンテンツ全体をテンプレートフラグメントとして解釈します。

```angular-html
<section *myDirective>
  <p>これがフラグメントです</p>
</section>
```

これは、次のコードと同じです。

```angular-html
<ng-template myDirective>
  <section>
    <p>これがフラグメントです</p>
  </section>
</ng-template>
```

開発者は通常、構造ディレクティブを使用して、フラグメントを条件付きでレンダリングしたり、フラグメントを複数回レンダリングしたりします。

詳細については、[構造ディレクティブ](/guide/directives/structural-directives) を参照してください。

## さらなるリソース

`ng-template` が他のライブラリで使用される方法の例については、以下を確認してください。

- [Angular Material のタブ](https://material.angular.dev/components/tabs/overview) - タブがアクティブになるまで、DOMに何もレンダリングされません
- [Angular Material のテーブル](https://material.angular.dev/components/table/overview) - 開発者は、データをレンダリングするさまざまな方法を定義できます
