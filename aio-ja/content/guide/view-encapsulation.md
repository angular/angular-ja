# ビューのカプセル化

AngularではコンポーネントのCSSスタイルはコンポーネントのビューにカプセル化され、
アプリケーションの残りの部分には影響しません。

このカプセル化が _コンポーネントごとに_ どのように行われるかを制御するには、
コンポーネントのメタデータに _ビューのカプセル化モード_ を設定します。
次のモードから選択してください：

- `ShadowDom` ビューカプセル化では、ブラウザのビルトインShadow DOM実装
（[Shadow DOM](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM)を参照）を使用して、
Shadow DOMをコンポーネントのホスト要素にアタッチし、
そのShadow DOM内にコンポーネントビューを配置します。コンポーネントのスタイルは、Shadow DOM内に含まれています。

- `Emulated` ビューカプセル化（デフォルト）は、CSSコードを事前処理（および名前変更）して、
Shadow DOMの動作をエミュレートし、CSSをコンポーネントのビューに効果的に適用します。
  詳細は、[生成されたCSSの検査](guide/view-encapsulation#inspect-generated-css) を参照してください。

- `None` は、Angularビューカプセル化を行わないことを意味します。
AngularはCSSをグローバルスタイルに追加します。
先に説明したスコープのルール、隔離および保護は適用されません。
このモードは、コンポーネントのスタイルをHTMLに貼り付けるのと本質的に同じです。

コンポーネントのカプセル化モードを設定するには、コンポーネントメタデータ内の `encapsulation` プロパティを使用します：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.shadow" header="src/app/quest-summary.component.ts"></code-example>

`ShadowDom` ビューカプセル化は、Shadow DOM をビルトインサポートしているブラウザでのみ機能します
([Can I use - Shadow DOM v1](https://caniuse.com/shadowdomv1) を参照)。サポートは未だ限定的です。
そのため、`Emulated`ビューカプセル化がデフォルトモードであり、ほとんどの場合に推奨されます。

{@a inspect-generated-css}

## 生成されたCSSの検査 {@a inspecting-generated-css}

エミュレートされたビューカプセル化を使用する場合、Angularはすべてのコンポーネントスタイルを前処理して、
標準的なShadow CSSスコープルールに近似させます。

エミュレートされたビューカプセル化が有効になっている
実行中のAngularアプリケーションのDOMでは、
各DOM要素にはいくつかの特別な属性が付加されています：

<code-example format="">
  &lt;hero-details _nghost-pmm-5>
    &lt;h2 _ngcontent-pmm-5>Mister Fantastic&lt;/h2>
    &lt;hero-team _ngcontent-pmm-5 _nghost-pmm-6>
      &lt;h3 _ngcontent-pmm-6>Team&lt;/h3>
    &lt;/hero-team>
  &lt;/hero-detail>
</code-example>

生成される属性には2種類あります。：

- ネイティブのカプセル化でShadow DOMのホストになる要素には、生成された`_nghost`属性があります。
これは、一般的にコンポーネントのホスト要素のケースです。
- コンポーネントのビュー内の要素には、この要素がどのホストのエミュレートされたShadow DOMに
属するかを識別する`_ngcontent`属性があります。

これらの属性の正確な値は重要ではありません。
それらは自動的に生成され、アプリケーションコードで参照することはありません。
しかし、生成されたコンポーネントスタイルは、DOMの`<head>`セクションにあります。

<code-example format="">
  [_nghost-pmm-5] {
    display: block;
    border: 1px solid black;
  }

  h3[_ngcontent-pmm-6] {
    background-color: white;
    border: 1px solid #777;
  }
</code-example>

これらのスタイルは後処理され、
各セレクターに`_nghost`または`_ngcontent`属性セレクターが追加されます。
これらの追加のセレクターは、このページで説明しているスコープルールを有効にします。

## Mixing encapsulation modes

Avoid mixing components that use different view encapsulation. Where it is necessary, you should be aware of how the component styles will interact.

- The styles of components with `ViewEncapsulation.Emulated` are added to the `<head>` of the document, making them available throughout the application, but are "scoped" so they only affect elements within the component's template.

- The styles of components with `ViewEncapsulation.None` are added to the `<head>` of the document, making them available throughout the application, and are not "scoped" so they can affect any element in the application.

- The styles of components with `ViewEncapsulation.ShadowDom` are only added to the shadow DOM host, ensuring that they only affect elements within the component's template.

**All the styles for `ViewEncapsulation.Emulated` and `ViewEncapsulation.None` components are also added to the shadow DOM host of each `ViewEncapsulation.ShadowDom` component.**

The result is that styling for components with `ViewEncapsulation.None` will affect matching elements within the shadow DOM.

This approach may seem counter-intuitive at first, but without it a component with `ViewEncapsulation.None` could not be used within a component with `ViewEncapsulation.ShadowDom`, since its styles would not be available.

### Examples

This section shows examples of how the styling of components with different `ViewEncapsulation` interact.

See the <live-example noDownload></live-example> to try out these components yourself.

#### No encapsulation

The first example shows a component that has `ViewEncapsulation.None`. This component colors its template elements red.

<code-example path="view-encapsulation/src/app/no-encapsulation.component.ts" header="src/app/no-encapsulation.component.ts"></code-example>>

Angular adds the styles for this component as global styles to the `<head>` of the document.

**Angular also adds the styles to all shadow DOM hosts.** Therefore, the styles are available throughout the application.

<img src="generated/images/guide/view-encapsulation/no-encapsulation.png" alt="component with no encapsulation">

#### Emulated encapsulation

The second example shows a component that has `ViewEncapsulation.Emulated`. This component colors its template elements green.

<code-example path="view-encapsulation/src/app/emulated-encapsulation.component.ts" header="src/app/emulated-encapsulation.component.ts"></code-example>>

Similar to `ViewEncapsulation.None`, Angular adds the styles for this component to the `<head>` of the document, and to all the shadow DOM hosts.
But in this case, the styles are "scoped" by the attributes described in ["Inspecting generated CSS"](#inspecting-generated-css).

Therefore, only the elements directly within this component's template will match its styles.
Since the "scoped" styles from the `EmulatedEncapsulationComponent` are very specific, they override the global styles from the `NoEncapsulationComponent`.

In this example, the `EmulatedEncapsulationComponent` contains a `NoEncapsulationComponent`.
The `NoEncapsulationComponent` is styled as expected because the scoped styles do not match elements in its template.

<img src="generated/images/guide/view-encapsulation/emulated-encapsulation.png" alt="component with no encapsulation">

#### Shadow DOM encapsulation

The third example shows a component that has `ViewEncapsulation.ShadowDom`. This component colors its template elements blue.

<code-example path="view-encapsulation/src/app/shadow-dom-encapsulation.component.ts" header="src/app/shadow-dom-encapsulation.component.ts"></code-example>>

Angular adds styles for this component only to the shadow DOM host, so they are not visible outside the shadow DOM.

Note that Angular also adds the global styles from the `NoEncapsulationComponent` and `ViewEncapsulationComponent` to the shadow DOM host, so those styles are still available to the elements in the template of this component.

In this example, the `ShadowDomEncapsulationComponent` contains both a `NoEncapsulationComponent` and `ViewEncapsulationComponent`.

The styles added by the `ShadowDomEncapsulationComponent` component are available throughout the shadow DOM of this component, and so to both the `NoEncapsulationComponent` and `ViewEncapsulationComponent`.

The `EmulatedEncapsulationComponent` has specific "scoped" styles, so the styling of this component's template is unaffected.

But since styles from `ShadowDomEncapsulationComponent` are added to the shadow host after the global styles, the `h2` style overrides the style from the `NoEncapsulationComponent`.
The result is that the `<h2>` element in the `NoEncapsulationComponent` is colored blue rather than red, which may not be what the component author intended.

<img src="generated/images/guide/view-encapsulation/shadow-dom-encapsulation.png" alt="component with no encapsulation">
