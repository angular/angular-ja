# Angular におけるアクセシビリティ

Web は視覚・運動障害をもつ方を含む、さまざまな方によって利用されています。
そのような方が Web 上のアプリケーションを利用しやすくなるための、さまざまな支援技術が存在します。
さらに、アプリケーションがよりよいアクセシビリティをもつように設計することですべてのユーザーのユーザー体験が向上することでしょう。

アクセシビリティをもつアプリケーションを設計する上での課題や技術に関するより詳細な内容は、Google の [Web Fundamentals](https://developers.google.com/web/fundamentals/) の[アクセシビリティ](https://developers.google.com/web/fundamentals/accessibility/#what_is_accessibility) 章を参照してください。

このページには、支援技術を必要とする方を含むすべてのユーザーにとって使いやすいAngular アプリケーションを設計するためのベストプラクティスが記述されています。

<div class="alert is-helpful">

  For the sample application that this page describes, see the <live-example></live-example>.

</div>

## アクセシビリティのための属性

Web 上でのアクセシビリティを構築するためには、セマンティックな意味情報が欠落しないように[Accessible Rich Internet Applications \(ARIA\) 属性](https://developers.google.com/web/fundamentals/accessibility/semantics-aria)を設定します。
アクセシビリティ関連の属性の値を制御するためには [属性バインディング](guide/attribute-binding)テンプレート記法を使います。

ARIA の仕様は DOM 要素のプロパティよりも、HTML の属性に依存しています。Angular 内で ARIA 属性をバインドするためにはプレフィックスとして `attr.` を使用してください。

<code-example format="html" language="html">

&lt;!-- Use attr. when binding to an ARIA attribute --&gt;
&lt;button [attr.aria-label]="myActionLabel"&gt;&hellip;&lt;/button&gt;

</code-example>

<div class="alert is-helpful">

**NOTE** <br />
この記法は属性を _バインドする_ 場合にだけ必要です。
静的な ARIA 属性には特別な記法は必要ありません。

<code-example format="html" language="html">

&lt;!-- Static ARIA attributes require no extra syntax --&gt;
&lt;button aria-label="Save document"&gt;&hellip;&lt;/button&gt;

</code-example>

</div>

<div class="alert is-helpful">

   規約により、HTML の属性の名前には小文字が使われます(`tabindex`)。一方でプロパティにはキャメルケースを使われます(`tabIndex`)。

   属性とプロパティの違いについて詳しい背景は [バインディング構文](guide/binding-syntax#html-attribute-vs-dom-property)ガイドを参照してください。

</div>

## Angular UI コンポーネント

Angular チームによってメンテナンスされている [Angular Material](https://material.angular.io/) ライブラリはアクセシビリティをもつように作られた、再利用可能な UI コンポーネントの集まりです。
[Component Development Kit (CDK)](https://material.angular.io/cdk/categories) には、さまざまな分野のアクセシビリティをサポートするためのツールを提供する `a11y` パッケージが含まれています。
たとえば、

*   `LiveAnnouncer` は `aria-live` 領域を使用する、スクリーンリーダー利用者へメッセージを伝えるために使います。
    詳しい情報は W3C の文書の [aria-live 領域](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#aria-live) を参照してください。

*   `cdkTrapFocus` ディレクティブは要素中のタブキーによるフォーカスを検知します。
    アクセシビリティの提供や、モーダルダイアログのようにフォーカスを強制させるコンポーネントを作成する際に使います。

上記のものや他のツールについての詳細は [Angular CDK アクセシビリティの概要](https://material.angular.io/cdk/a11y/overview) を参照してください。

### ネイティブ要素を補強する

HTML のネイティブ要素はアクセシビリティにとって重要な、多くの標準的な動作パターンを捕捉します。
Angular コンポーネントを作成する際は、すでにサポートされている挙動を再実装するのではなく、これらのネイティブ要素をできるだけ直接再利用してください。

たとえば、新しく色々なボタンのためにカスタム要素を作成するのではなく、属性のセレクターにネイティブの `<button>` 要素を使用したコンポーネントを作成することができます。
これは `<button>` と `<a>` に典型的に適用できますが、他の多くのタイプの要素にも使うことができるでしょう。

Angular Material において上記のパターンのサンプルは 
[`MatButton`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/button/button.ts#L67-L69) や [`MatTabNav`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/tabs/tab-nav-bar/tab-nav-bar.ts#L139) 、[`MatTable`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/table/table.ts#L22) などがあります。

### ネイティブ要素にコンテナを使う

適切なネイティブ要素を使うためにコンテナ要素が必要になる場合があります。
たとえば、ネイティブの `<input>` 要素は子要素をもつことができません。そのため、テキスト入力のカスタムコンポーネントは`<input>` を追加の要素で囲む必要があります。
カスタムコンポーネントのテンプレートの中に `<input>` をそのまま追加した場合は、コンポーネントを使う際に任意のプロパティや属性を input 要素に設定することができなくなります。
代わりに、コンテンツ投影を使ったコンテナコンポーネントを作成することでコンポーネントの API でネイティブ制御ができます。

このパターンのサンプルとして、[`MatFormField`](https://material.angular.io/components/form-field/overview) があります。

## ケーススタディ: 独自のプログレスバーを実装する

次のサンプルではアクセシビリティ関連の属性を制御するために、ホストバインディングを使ったプログレスバーを作る方法を説明します。

*   このコンポーネントは標準の HTML 属性の `role` と ARIA 属性の両方をもつ、アクセシビリティが有効の要素を定義します。
    ARIA 属性の `aria-valuenow` はユーザーの入力にひもづきます。

    <code-example header="src/app/progress-bar.component.ts" path="accessibility/src/app/progress-bar.component.ts" region="progressbar-component"></code-example>

*   このテンプレートでは、 `aria-label` 属性によってスクリーンリーダーからの制御を可能にしています。

    <code-example header="src/app/app.component.html" path="accessibility/src/app/app.component.html" region="template"></code-example>

## Routing

### Focus management after navigation

UI の中で[フォーカス](https://developers.google.com/web/fundamentals/accessibility/focus/)を追跡し、制御することはアクセシビリティを設計する上で重要な検討事項です。
Angular のルーティングを使う際は画面遷移時にページのフォーカスがどこに当たるかを決めておくべきです。

視覚的な合図のみに頼ることを避けるために、ページ遷移後にルーティングのコードがフォーカスを更新するようにしてください。
フォーカスを更新するタイミングを知るためには、`Router` サービスの `NavigationEnd` イベントを使います。

次のサンプルでは画面遷移後に DOM 中のメインのコンテンツヘッダーを見つけ、フォーカスを当てる方法を紹介します。

<code-example format="typescript" language="typescript">

router.events.pipe(filter(e =&gt; e instanceof NavigationEnd)).subscribe(() =&gt; {
  const mainHeader = document.querySelector('&num;main-content-header')
  if (mainHeader) {
    mainHeader.focus();
  }
});

</code-example>

実際のアプリケーションでは、フォーカスが当たる要素はアプリケーションの構造やレイアウトに依存します。
フォーカスが当たった要素はビューにルーティングされたメインのコンテンツへ移ることのできる場所へユーザーを配置するべきです。
ルートが変わった後にフォーカスが `body` 要素へ戻る状況は避けた方がよいでしょう。

### Active links identification

CSS classes applied to active `RouterLink` elements, such as `RouterLinkActive`, provide a visual cue to identify the active link.
Unfortunately, a visual cue doesn't help blind or visually impaired users.
Applying the `aria-current` attribute to the element can help identify the active link.
For more information, see [Mozilla Developer Network \(MDN\) aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)).

The `RouterLinkActive` directive provides the `ariaCurrentWhenActive` input which sets the `aria-current` to a specified value when the link becomes active.

The following example shows how to apply the `active-page` class to active links as well as setting their `aria-current` attribute to `"page"` when they are active:

```html
    <nav>
      <a routerLink="home"
         routerLinkActive="active-page"
         ariaCurrentWhenActive="page">
        Home
      </a>
      <a routerLink="about"
         routerLinkActive="active-page"
         ariaCurrentWhenActive="page">
        About
      </a>
      <a routerLink="shop"
         routerLinkActive="active-page"
         ariaCurrentWhenActive="page">
        Shop
      </a>
    </nav>
```

<!-- vale Angular.Angular_Spelling = NO -->

## More information

*   [Accessibility - Google Web Fundamentals](https://developers.google.com/web/fundamentals/accessibility)
*   [ARIA specification and authoring practices](https://www.w3.org/TR/wai-aria/)
*   [Material Design - Accessibility](https://material.io/design/usability/accessibility.html)
*   [Smashing Magazine](https://www.smashingmagazine.com/search/?q=accessibility)
*   [Inclusive Components](https://inclusive-components.design/)
*   [Accessibility Resources and Code Examples](https://dequeuniversity.com/resources/)
*   [W3C - Web Accessibility Initiative](https://www.w3.org/WAI/people-use-web/)
*   [Rob Dodson A11ycasts](https://www.youtube.com/watch?v=HtTyRajRuyY)
*   [Angular ESLint](https://github.com/angular-eslint/angular-eslint#functionality) ではアクセシビリティ標準に適合しているかを確認するための助けとなる Lint のルールが提供されています。

<!-- vale Angular.Angular_Spelling = YES -->

書籍

<!-- vale Angular.Google_Quotes = NO -->

*   "A Web for Everyone: Designing Accessible User Experiences," Sarah Horton and Whitney Quesenbery
*   "Inclusive Design Patterns," Heydon Pickering

<!-- vale Angular.Google_Quotes = YES -->

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
