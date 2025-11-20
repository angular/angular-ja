# DIの実践

このガイドでは、Angularにおける依存性の注入の追加機能について説明します。

NOTE: InjectionTokenとカスタムプロバイダーの包括的な説明については、[依存性プロバイダーの定義ガイド](guide/di/defining-dependency-providers#injection-tokens)を参照してください。

## コンポーネントのDOM要素を注入する {#inject-the-components-dom-element}

開発者は避けるように努めていても、一部の視覚効果とサードパーティツールでは、直接DOMにアクセスする必要があります。
そのため、コンポーネントのDOM要素にアクセスする必要がある場合があります。

Angularは、`@Component`または`@Directive`の基になる要素を、`ElementRef`インジェクショントークンを使用してインジェクションすることで公開します。

<docs-code language="typescript" highlight="[7]">
import { Directive, ElementRef } from '@angular/core';

@Directive({
selector: '[appHighlight]'
})
export class HighlightDirective {
private element = inject(ElementRef)

update() {
this.element.nativeElement.style.color = 'red';
}
}
</docs-code>

## 前方参照を使用して循環した依存関係を解決する {#resolve-circular-dependencies-with-a-forward-reference}

TypeScriptでは、クラスの宣言順序が重要です。
定義されるまでは、クラスを直接参照できません。

これは、特に推奨される_1ファイルにつき1クラス_ルールに従っている場合は通常問題ありません。
しかし、循環参照は避けられない場合があります。
たとえば、クラス'A'がクラス'B'を参照し、'B'が'A'を参照する場合、いずれか一方を最初に定義する必要があります。

Angularの`forwardRef()`関数は、Angularが後で解決できる_間接的な_参照を作成します。

クラスが_自分自身を参照する_場合にも、同様の問題が発生します。
たとえば、`providers`配列内です。
`providers`配列は、`@Component()`デコレーター関数のプロパティであり、クラス定義の前に表示される必要があります。
`forwardRef`を使用して、このような循環参照を解消できます。

<docs-code header="app.component.ts" language="typescript" highlight="[4]">
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
</docs-code>
