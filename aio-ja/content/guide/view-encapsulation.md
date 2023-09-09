# ビューのカプセル化

Angularでは、コンポーネントのスタイルをコンポーネントのホスト要素内にカプセル化し、アプリケーションの他の部分に影響を与えないようにすることができます。

`Component` デコレーターは [`encapsulation`](api/core/Component#encapsulation) オプションを提供し、コンポーネント単位でカプセル化の適用方法を制御することができます。

次のモードから選択できます:

<!-- vale off -->

| モード                         | 詳細 |
|:---                           |:---     |
| `ViewEncapsulation.ShadowDom` | Angularはブラウザ組込みの[Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Shadow_DOM)を使用して、コンポーネントのホスト要素として使用されるShadowRoot内にコンポーネントのビューを閉じ込め、提供されたスタイルを分離された方法で適用します。 |
| `ViewEncapsulation.Emulated`  | AngularはコンポーネントのCSSセレクターを変更し、コンポーネントのビューにのみ適用され、アプリケーション内の他の要素には影響しないようにします。詳細は[生成されたCSSの検証](guide/view-encapsulation#inspect-generated-css)を参照してください。 |
| `ViewEncapsulation.None`      | Angularはいかなるビューのカプセル化も適用しません。つまり、コンポーネントに指定されたスタイルは実際にグローバルに適用され、アプリケーション内に存在するあらゆるHTML要素に影響を与える可能性があります。このモードは本質的に、スタイルをHTML自体に含めるのと同じです。 |

<a id="inspect-generated-css"></a>

## 生成されたCSSの検証

<!-- vale on -->

エミュレートされたビューのカプセル化を使用する場合、Angularはすべてのコンポーネントのスタイルを事前処理し、コンポーネントのビューにのみ適用されるようにします。

実行中のAngularアプリケーションのDOMでは、エミュレートされたビューのカプセル化を使用しているコンポーネントに属する要素には、いくつかの特別な属性が付加されています:

<code-example language="html">

&lt;hero-details _nghost-pmm-5&gt;
  &lt;h2 _ngcontent-pmm-5&gt;Mister Fantastic&lt;/h2&gt;
  &lt;hero-team &lowbar;ngcontent-pmm-5 &lowbar;nghost-pmm-6&gt;
    &lt;h3 _ngcontent-pmm-6&gt;Team&lt;/h3&gt;
  &lt;/hero-team&gt;
&lt;/hero-details&gt;

</code-example>

これらの属性には2種類あります:

| 属性   | 詳細 |
|:---          |:---     |
| `_nghost`    | コンポーネントのビューを含む要素に追加され、ネイティブの Shadow DOM カプセル化では ShadowRoots に該当します。これは通常、コンポーネントのホスト要素で見られます。          |
| `_ngcontent` | コンポーネントのビュー内の子要素に追加され、それらがそれぞれのエミュレートされた ShadowRoots 内の要素(一致する `_nghost` 属性をもつホスト要素)と照合するために使用されます。 |

これらの属性の正確な値は、Angularのプライベートな実装の詳細です。
これらは自動的に生成されるので、アプリケーションコードでは決して参照しないでください。

生成されたコンポーネントスタイルは、DOMの`<head>`セクションに注入されます:

<code-example format="css" language="css">

[_nghost-pmm-5] {
  display: block;
  border: 1px solid black;
}
h3[_ngcontent-pmm-6] {
  background-color: white;
  border: 1px solid #777;
}

</code-example>

これらのスタイルは、各CSSセレクターが適切な `_nghost` または `_ngcontent` 属性で補完されるように後処理されます。
変更されたセレクターによって、コンポーネントビューに適用されるスタイルが分離され、的を絞ったものになります。

## カプセル化モードの混在

前述したように、カプセル化モードはコンポーネントのデコレーターでコンポーネントごとに指定します。つまり、アプリケーション内で、異なるカプセル化方式を使用するコンポーネントをもつことができるということです。

可能ではありますが、これはお勧めできません。
もし本当に必要であれば、異なるカプセル化モードを使用するコンポーネントのスタイルが互いにどのように影響しあうかを意識する必要があります:

| モード                         | 詳細 |
|:---                           |:---     |
| `ViewEncapsulation.Emulated`  | コンポーネントのスタイルはドキュメントの `<head>` に追加され、アプリケーション全体で利用できるようになりますが、そのセレクターはそれぞれのコンポーネントのテンプレート内の要素にのみ影響します。 |
| `ViewEncapsulation.None`      | コンポーネントのスタイルはドキュメントの `<head>` に追加され、アプリケーション全体で利用できるようになるため、完全にグローバルなものとなり、ドキュメント内の一致するすべての要素に影響を与えます。         |
| `ViewEncapsulation.ShadowDom` | コンポーネントのスタイルはShadow DOMホストにのみ追加され、それぞれのコンポーネントのビュー内の要素にのみ影響することを保証します。                                                           |

<div class="alert is-helpful">

ViewEncapsulation.Emulated` コンポーネントと `ViewEncapsulation.None` コンポーネントのスタイルは、それぞれ `ViewEncapsulation.ShadowDom` コンポーネントの Shadow DOM ホストにも追加されます。

これは、`ViewEncapsulation.None`をもつコンポーネントのスタイルは、Shadow DOM内のマッチする要素に影響を与えることを意味します。

このアプローチは、最初は直感に反するように見えるかもしれません。しかし、これがなければ、`ViewEncapsulation.None`を使用するコンポーネントは、`ViewEncapsulation.ShadowDom`を使用するコンポーネント内で、そのスタイルが使用できないため、異なるレンダリングになってしまいます。

</div>

### 使用例

このセクションでは、異なる `ViewEncapsulation` をもつコンポーネントのスタイリングがどのように相互作用するかの例を示します。

<live-example noDownload></live-example> を参照して、これらのコンポーネントを自分で試してみてください。

#### カプセル化なし

最初の例では、`ViewEncapsulation.None`をもつコンポーネントを示します。
このコンポーネントはテンプレート要素を赤色に着色します。

<code-example header="src/app/no-encapsulation.component.ts" path="view-encapsulation/src/app/no-encapsulation.component.ts"></code-example>

Angularはこのコンポーネントのスタイルをグローバルスタイルとしてドキュメントの`<head>`に追加します。

すでに述べたように、AngularはすべてのShadow DOMホストにもスタイルを追加し、アプリケーション全体でスタイルを利用できるようにします。

<div class="lightbox">

<img alt="component with no encapsulation" src="generated/images/guide/view-encapsulation/no-encapsulation.png">

</div>

#### エミュレートされたカプセル化

2つ目の例では、`ViewEncapsulation.Emulated`をもつコンポーネントを示します。
このコンポーネントはテンプレート要素を緑色に着色します。

<code-example header="src/app/emulated-encapsulation.component.ts" path="view-encapsulation/src/app/emulated-encapsulation.component.ts"></code-example>

`ViewEncapsulation.None`と同様に、Angularはこのコンポーネントのスタイルをドキュメントの`<head>`に追加しますが、「スコープ化された」スタイルを使用します。

このコンポーネントのテンプレートに直接含まれる要素だけが、このコンポーネントのスタイルと対応します。
`EmulatedEncapsulationComponent`の「スコープ化された」スタイルは詳細度が高いので、`NoEncapsulationComponent`のグローバルスタイルを上書きします。

この例では、 `EmulatedEncapsulationComponent` は `NoEncapsulationComponent` を含んでいますが、 `EmulatedEncapsulationComponent` の「スコープ化された」スタイルはそのテンプレートの要素にマッチしないため、 `NoEncapsulationComponent` は期待どおりにスタイリングされます。

<div class="lightbox">

<img alt="component with no encapsulation" src="generated/images/guide/view-encapsulation/emulated-encapsulation.png">

</div>

#### Shadow DOMカプセル化

3つ目の例は、`ViewEncapsulation.ShadowDom`をもつコンポーネントです。
このコンポーネントはテンプレート要素を青く着色します。

<code-example header="src/app/shadow-dom-encapsulation.component.ts" path="view-encapsulation/src/app/shadow-dom-encapsulation.component.ts"></code-example>

AngularはこのコンポーネントのスタイルをShadow DOMホストのみに追加するので、Shadow DOMの外には表示されません。

<div class="alert is-helpful">

**注意**: <br />
Angularはまた、`NoEncapsulationComponent`と`EmulatedEncapsulationComponent`のグローバルスタイルをShadow DOMホストに追加します。これらのスタイルは、このコンポーネントのテンプレート内の要素でも使用できます。

</div>

この例では、`ShadowDomEncapsulationComponent` は `NoEncapsulationComponent` と `EmulatedEncapsulationComponent` の両方を含んでいます。

`ShadowDomEncapsulationComponent` コンポーネントによって追加されたスタイルは、このコンポーネントの Shadow DOM 全体で有効であり、`NoEncapsulationComponent` と `EmulatedEncapsulationComponent` の両方でも有効です。

`EmulatedEncapsulationComponent`は詳細度の高い 「スコープ化された」スタイルを持っているので、このコンポーネントのテンプレートのスタイリングに影響されることはありません。

`ShadowDomEncapsulationComponent` のスタイルはグローバルスタイルの後に Shadow ホストに追加されるため、`h2` のスタイルは `NoEncapsulationComponent` のスタイルを上書きします。
その結果、`NoEncapsulationComponent` の `<h2>` 要素は赤ではなく青に着色されます。

<div class="lightbox">

<img alt="component with no encapsulation" src="generated/images/guide/view-encapsulation/shadow-dom-encapsulation.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-04-21
