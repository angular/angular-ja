# DOM API の使用

TIP: このガイドは、[基本概念のガイド](essentials) をすでに読んでいることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

Angularは、ほとんどのDOM作成、更新、および削除を自動的に処理します。
ただし、コンポーネントのDOMと直接対話する必要がある場合もあるかもしれません。
コンポーネントは `ElementRef` を注入して、コンポーネントのホスト要素への参照を取得できます。

```ts
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

`nativeElement` プロパティは、
ホスト [Element](https://developer.mozilla.org/docs/Web/API/Element) インスタンスを参照します。

Angularの `afterEveryRender` および `afterNextRender` 関数を使用して、
Angularがページのレンダリングを完了したときに実行される **レンダリングコールバック** を登録できます。

```ts
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` および `afterNextRender` は、通常はコンポーネントのコンストラクターである
*注入コンテキスト*で呼び出される必要があります。

**可能な限り、DOM 操作を直接行うことは避けてください。** 
コンポーネントテンプレートでDOMの構造を表現し、バインディングを使用してそのDOMを更新することを常に優先してください。

**レンダリングコールバックは、サーバーサイドレンダリングまたはビルド時の事前レンダリング中には実行されません。**

**他の Angular ライフサイクルフック内で DOM を直接操作しないでください。** 
Angularは、レンダリングコールバック以外では、コンポーネントのDOMが完全にレンダリングされていることを保証しません。
さらに、他のライフサイクルフック中にDOMを読み取ったり変更したりすると、
[レイアウトのちらつき](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing)を引き起こすなど、
ページのパフォーマンスに悪影響を与える可能性があります。

## コンポーネントのレンダラーを使用する

コンポーネントは、`Renderer2` のインスタンスを注入して、
他のAngular機能に関連付けられた特定のDOM操作ができます。

コンポーネントの `Renderer2` によって作成されたDOM要素はすべて、
そのコンポーネントの [スタイルのカプセル化](guide/components/styling#style-scoping) に組み込まれます。

このような `Renderer2` APIは、Angularのアニメーションシステムにも関連付けられています。
`setProperty` メソッドを使用して合成アニメーションプロパティを更新し、`listen` メソッドを使用して合成アニメーションイベントのイベントリスナーを追加できます。
詳細については、[アニメーション](guide/animations) ガイドを参照してください。

これらの2つの狭いユースケース以外では、
`Renderer2` とネイティブDOM APIを使用することに違いはありません。
`Renderer2` APIは、サーバーサイドレンダリングまたはビルド時の事前レンダリングコンテキストでのDOM操作をサポートしていません。

## DOM API を使用するタイミング

Angularはほとんどのレンダリングの問題を処理しますが、一部の動作ではDOM APIを使用する必要がある場合があります。
一般的なユースケースには、以下のようなものがあります。

- 要素のフォーカスを管理する
- `getBoundingClientRect` などの要素のジオメトリを測定する
- 要素のテキストコンテンツを読み取る
- [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver)、
  [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver)、
  または[`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) などの
  ネイティブオブザーバーを設定する。

DOM要素の挿入、削除、および変更は避けてください。
特に、**要素の `innerHTML` プロパティを直接設定しないでください。** 
これは、アプリケーションを [クロスサイトスクリプティング (XSS) 攻撃](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting) に対して脆弱にする可能性があります。
Angularのテンプレートバインディングには、`innerHTML` のバインディングを含め、XSS攻撃から保護する安全対策が含まれています。
詳細については、[セキュリティガイド](best-practices/security) を参照してください。
