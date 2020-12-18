# ビューのカプセル化

AngularではコンポーネントのCSSスタイルはコンポーネントのビューにカプセル化され、
アプリケーションの残りの部分には影響しません。

このカプセル化が *コンポーネントごとに* どのように行われるかを制御するには、
コンポーネントのメタデータに *ビューのカプセル化モード* を設定します。
次のモードから選択してください：

* `ShadowDom` ビューカプセル化では、ブラウザのネイティブShadow DOM実装
（[MDN](https://developer.mozilla.org/ja/)サイトの
[Shadow DOM](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM)を参照）を使用して、
Shadow DOMをコンポーネントのホスト要素にアタッチし、
そのShadow DOM内にコンポーネントビューを配置します。コンポーネントのスタイルは、Shadow DOM内に含まれています。

* `Emulated` ビューカプセル化（デフォルト）は、CSSコードを事前処理（および名前変更）して、
Shadow DOMの動作をエミュレートし、CSSをコンポーネントのビューに効果的に適用します。
  詳細は、[生成されたCSSの検査](guide/view-encapsulation#inspect-generated-css) を参照してください。

* `None` は、Angularビューカプセル化を行わないことを意味します。
AngularはCSSをグローバルスタイルに追加します。
先に説明したスコープのルール、隔離および保護は適用されません。
これは、コンポーネントのスタイルをHTMLに貼り付けるのと本質的に同じです。

コンポーネントのカプセル化モードを設定するには、コンポーネントメタデータ内の `encapsulation` プロパティを使用します：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.shadow" header="src/app/quest-summary.component.ts"></code-example>

`ShadowDom` ビューカプセル化は、Shadow DOM をネイティブサポートしているブラウザでのみ機能します
( [Can I use](https://caniuse.com) サイトの
[Shadow DOM v1](https://caniuse.com/shadowdomv1) を参照)。サポートは未だ限定的です。
そのため、`Emulated`ビューカプセル化がデフォルトモードであり、
ほとんどの場合に推奨されます。

{@a inspect-generated-css}

## 生成されたCSSの検査

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

* ネイティブのカプセル化でShadow DOMのホストになる要素には、生成された`_nghost`属性があります。
これは、一般的にコンポーネントのホスト要素のケースです。
* コンポーネントのビュー内の要素には、この要素がどのホストのエミュレートされたShadow DOMに
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
