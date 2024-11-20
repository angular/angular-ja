# コンポーネントのスタイリング

Tip: このガイドでは、すでに[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

コンポーネントには、そのコンポーネントのDOMに適用されるCSSスタイルを含めることができます。

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }
</docs-code>

また、別のファイルにスタイルを記述できます。

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
</docs-code>

Angularがコンポーネントをコンパイルすると、これらのスタイルはコンポーネントのJavaScript出力と共に発行されます。
つまり、コンポーネントのスタイルはJavaScriptモジュールシステムに参加します。
Angularコンポーネントをレンダリングすると、フレームワークはコンポーネントの関連するスタイルを自動的に含めます。
これは、コンポーネントを遅延読み込みする場合でも同様です。

Angularは、[Sass](https://sass-lang.com)、
[less](https://lesscss.org)、[stylus](https://stylus-lang.com)など、
CSSを出力するすべてのツールと連携します。

## スタイルのスコープ

各コンポーネントには、**ビューカプセル化**設定があり、フレームワークがコンポーネントのスタイルをどのようにスコープするかを決定します。
ビューカプセル化モードには、`Emulated`、`ShadowDom`、`None`の3つのモードがあります。
モードは、`@Component`デコレーターで指定できます。

<docs-code language="angular-ts" highlight="[3]">
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
</docs-code>

### ViewEncapsulation.Emulated

デフォルトでは、Angularはエミュレートされたカプセル化を使用するため、
コンポーネントのスタイルは、そのコンポーネントのテンプレートで定義された要素にのみ適用されます。
このモードでは、フレームワークは各コンポーネントインスタンスに対して一意のHTML属性を生成し、
その属性をコンポーネントのテンプレート内の要素に追加し、その属性をコンポーネントのスタイルで定義されたCSSセレクターに挿入します。

このモードにより、コンポーネントのスタイルが外部に漏れて他のコンポーネントに影響を与えることがなくなります。
ただし、コンポーネントの外側に定義されたグローバルスタイルは、
エミュレートされたカプセル化を持つコンポーネント内の要素に影響を与える可能性があります。

エミュレートされたモードでは、Angularは
[`:host`](https://developer.mozilla.org/docs/Web/CSS/:host)
および[`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context)擬似
クラスを、
[Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)
を使用せずにサポートします。
コンパイル時に、フレームワークはこれらの擬似クラスを属性に変換するため、実行時にこれらのネイティブ擬似クラスのルール(ブラウザの互換性、特異性など)に準拠しません。
Angularのエミュレートされたカプセル化モードは、
`::shadow`や`::part`など、Shadow DOMに関連するその他の擬似クラスをサポートしていません。

#### `::ng-deep`

Angularのエミュレートされたカプセル化モードは、カスタム擬似クラス`::ng-deep`をサポートしています。
この擬似クラスをCSSルールに適用すると、そのルールのカプセル化が無効になり、実質的にグローバルスタイルになります。
**Angularチームは、`::ng-deep`の新しい使用を強くお勧めしません。**
これらのAPIは、下位互換性のためにのみ残っています。

### ViewEncapsulation.ShadowDom

このモードは、
[Web標準のShadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)
を使用して、コンポーネント内のスタイルをスコープします。
このモードを有効にすると、Angularはコンポーネントのホスト要素にシャドウルートを添付し、コンポーネントのテンプレートとスタイルを対応するシャドウツリーにレンダリングします。

このモードでは、_コンポーネントのスタイルのみ_がコンポーネントのテンプレート内の要素に適用されることが厳密に保証されます。
グローバルスタイルはシャドウツリー内の要素に影響を与えることができず、
シャドウツリー内のスタイルはシャドウツリー外の要素に影響を与えることができません。

ただし、`ShadowDom`カプセル化を有効にすると、スタイルのスコープ以外にも影響があります。
シャドウツリーにコンポーネントをレンダリングすると、イベントの伝播、
[`<slot>` API](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots)
とのやり取り、ブラウザの開発者ツールによる要素の表示方法に影響を与えます。
このオプションを有効にする前に、アプリケーションでShadow DOMを使用することのすべての影響を理解してください。

### ViewEncapsulation.None

このモードは、コンポーネントのすべてのスタイルカプセル化を無効にします。
コンポーネントに関連付けられたすべてのスタイルはグローバルスタイルとして動作します。

## テンプレートでのスタイルの定義

コンポーネントのテンプレートで`<style>`要素を使用すると、追加のスタイルを定義できます。
コンポーネントのビューカプセル化モードはこのように定義されたスタイルに適用されます。

Angularは、スタイル要素内のバインディングをサポートしていません。

## 外部スタイルファイルの参照

コンポーネントのテンプレートは、
[`<link>`要素](https://developer.mozilla.org/docs/Web/HTML/Element/link)
を使用してCSSファイルを参照できます。さらに、CSSは
[ `@import` at-rule](https://developer.mozilla.org/docs/Web/CSS/@import)
を使用してCSSファイルを参照できます。
Angularはこれらの参照を_外部_スタイルとして扱います。外部スタイルは、エミュレートされたビューカプセル化の影響を受けません。
