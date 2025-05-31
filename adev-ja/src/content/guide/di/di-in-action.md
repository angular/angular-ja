# DIの実践

このガイドでは、Angularにおける依存性の注入の追加機能について説明します。

## `@Inject`を使用したカスタムプロバイダー

カスタムプロバイダーを使用すると、組み込みのブラウザAPIなど、暗黙的な依存関係に対して具体的な実装を提供できます。
次の例では、`InjectionToken`を使用して、`BrowserStorageService`内の依存関係として[localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)ブラウザAPIを提供します。

<docs-code header="src/app/storage.service.ts" language="typescript"
           highlight="[[3,6],[12]]">
import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  public storage = inject(BROWSER_STORAGE);

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
}
</docs-code>

`factory`関数は、ブラウザのウィンドウオブジェクトに添付されている`localStorage`プロパティを返します。
The `inject` function initializes the `storage` property with an instance of the token.

このカスタムプロバイダーは、実際のブラウザAPIと対話するのではなく、モックAPIの`localStorage`を使用してテスト中にオーバーライドできます。

## コンポーネントのDOM要素を注入する

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

## 前方参照を使用して循環した依存関係を解決する

TypeScriptでは、クラスの宣言順序が重要です。
定義されるまでは、クラスを直接参照できません。

これは、特に推奨される*1ファイルにつき1クラス*ルールに従っている場合は通常問題ありません。
しかし、循環参照は避けられない場合があります。
たとえば、クラス'A'がクラス'B'を参照し、'B'が'A'を参照する場合、いずれか一方を最初に定義する必要があります。

Angularの`forwardRef()`関数は、Angularが後で解決できる*間接的な*参照を作成します。

クラスが*自分自身を参照する*場合にも、同様の問題が発生します。
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
