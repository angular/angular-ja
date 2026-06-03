# DIの実践

このガイドでは、Angularにおける依存性の注入 (DI) の追加機能について説明します。

NOTE: InjectionTokenとカスタムプロバイダーの包括的な説明については、[依存性プロバイダーの定義ガイド](guide/di/defining-dependency-providers#injection-tokens)を参照してください。

## コンポーネントのDOM要素を注入する {#inject-the-components-dom-element}

一般的に開発者は避けるものですが、一部の視覚効果やサードパーティツールでは、直接DOMにアクセスする必要があります。
そのような場合には、コンポーネントのDOM要素にアクセスする必要が生じることがあります。

Angularは、`@Component`または`@Directive`の基になるDOM要素を、`ElementRef`トークンを使用したインジェクションを通じて公開します。

```ts {highlight:[7]}
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```

## ホスト要素のタグ名を注入する {#inject-the-host-elements-tag-name}

ホスト要素のタグ名を取得するには、`HOST_TAG_NAME`トークンを使用して注入します。

```ts
import {Directive, HOST_TAG_NAME, inject} from '@angular/core';

@Directive({
  selector: '[roleButton]',
})
export class RoleButtonDirective {
  private tagName = inject(HOST_TAG_NAME);

  onAction() {
    switch (this.tagName) {
      case 'button':
        // ボタンアクションを処理
        break;
      case 'a':
        // アンカーアクションを処理
        break;
      default:
        // その他の要素を処理
        break;
    }
  }
}
```

NOTE: ホスト要素がタグ名を持たない可能性がある場合（例: `ng-container`または`ng-template`）、注入をオプションにしてください。

## 前方参照を使用して循環した依存関係を解決する {#resolve-circular-dependencies-with-a-forward-reference}

TypeScriptでは、クラスの宣言順序が重要です。
クラスは定義するまで直接参照できません。

これは、特に推奨される_1ファイルにつき1クラス_ルールに従っている場合は通常問題ありません。
しかし、場合によっては循環参照が避けられないことがあります。
たとえば、クラス'A'がクラス'B'を参照し、クラス'B'がクラス'A'を参照する場合、いずれか一方を最初に定義する必要があります。

Angularの`forwardRef()`関数は、Angularが後で解決できる_間接的な_参照を作成します。

クラスが_自分自身を参照する_場合にも、同様の問題が発生します。
たとえば、`providers`配列内です。
`providers`配列は、`@Component()`デコレーター関数のプロパティであり、クラス定義の前に表示される必要があります。
このような循環参照は`forwardRef`を使用して解決できます。

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
