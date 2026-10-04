# コンポーネントのスタイリング

TIP: このガイドでは、すでに[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

コンポーネントには、そのコンポーネントのDOMに適用されるCSSスタイルを含めることができます。

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border-radius: 50%;
    }
  `,
})
export class ProfilePhoto {}
```

また、別のファイルにスタイルを記述できます。

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto {}
```

Angularがコンポーネントをコンパイルすると、これらのスタイルはコンポーネントのJavaScript出力と共に発行されます。
つまり、コンポーネントのスタイルはJavaScriptモジュールシステムに参加します。
Angularコンポーネントをレンダリングすると、フレームワークはコンポーネントの関連するスタイルを自動的に含めます。
これは、コンポーネントを遅延読み込みする場合でも同様です。

Angularは、[Sass](https://sass-lang.com)、
[Less](https://lesscss.org)、[Stylus](https://stylus-lang.com)など、
CSSを出力するすべてのツールと連携します。

## スタイルのスコープ {#style-scoping}

各コンポーネントには、**ビューカプセル化**設定があり、フレームワークがコンポーネントのスタイルをどのようにスコープするかを決定します。
ビューカプセル化モードには、`Emulated`、`ShadowDom`、`ExperimentalIsolatedShadowDom`、`None`の4つのモードがあります。
モードは、`@Component`デコレーターで指定できます。

```angular-ts {highlight:[3]}
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto {}
```

### ViewEncapsulation.Emulated

デフォルトでは、Angularはエミュレートされたカプセル化を使用するため、
コンポーネントのスタイルは、そのコンポーネントのテンプレートで定義された要素にのみ適用されます。
このモードでは、フレームワークは各コンポーネントインスタンスに対して一意のHTML属性を生成し、
その属性をコンポーネントのテンプレート内の要素に追加し、その属性をコンポーネントのスタイルで定義されたCSSセレクターに挿入します。

このモードにより、コンポーネントのスタイルが外部に漏れて他のコンポーネントに影響を与えることがなくなります。
ただし、コンポーネントの外側に定義されたグローバルスタイルは、
エミュレートされたカプセル化を持つコンポーネント内の要素に影響を与える可能性があります。

エミュレートされたモードでは、Angularは
[`:host`](https://developer.mozilla.org/docs/Web/CSS/:host)擬似クラスをサポートします。
[`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context)擬似クラスは
モダンブラウザでは非推奨ですが、Angularのコンパイラは完全にサポートします。これらの擬似クラスは
ネイティブの[Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)
に依存せずに使用できます。
コンパイル時に、フレームワークはこれらの擬似クラスを属性に変換するため、実行時にこれらのネイティブ擬似クラスの
ルール(ブラウザの互換性、特異性など)に準拠しません。Angularの
エミュレートされたカプセル化モードは、Shadow DOMに関連するその他の擬似クラス、たとえば
`::shadow`や`::part`などはサポートしていません。

#### `::ng-deep`

Angularのエミュレートされたカプセル化モードは、カスタム擬似クラス`::ng-deep`をサポートしています。
**Angularチームは、`::ng-deep`の新しい使用を強くお勧めしません。**
これらのAPIは、下位互換性のためにのみ残っています。

セレクターに`::ng-deep`が含まれている場合、Angularはそのセレクター内でその時点以降のビューカプセル化境界の適用を停止します。`::ng-deep`に続くセレクターの任意の部分は、コンポーネントのテンプレート外の要素にマッチできます。

たとえば:

- エミュレートされたカプセル化を使用する`p a`のようなCSSルールセレクターは、`<p>`要素の子孫である`<a>`要素にマッチします。
  どちらもコンポーネント自身のテンプレート内にあります。

- `::ng-deep p a`のようなセレクターは、アプリケーション内の任意の場所にある`<p>`要素の子孫である、アプリケーション内の任意の場所にある`<a>`要素にマッチします。

  これにより、実質的にグローバルスタイルのように動作します。

- `p ::ng-deep a`では、Angularは`<p>`要素がコンポーネント自身のテンプレートから来ることを要求しますが、`<a>`要素はアプリケーション内の任意の場所にある可能性があります。

  したがって、実際には、`<a>`要素はコンポーネントのテンプレート内、または投影されたコンテンツや子コンテンツ内にある可能性があります。

- `:host ::ng-deep p a`では、`<a>`要素と`<p>`要素の両方が、コンポーネントのホスト要素の子孫である必要があります。

  それらはコンポーネントのテンプレートまたはその子コンポーネントのビューから来る可能性がありますが、アプリケーション内の他の場所からは来ません。

### ViewEncapsulation.ShadowDom

このモードは、
[Web標準のShadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)
を使用して、コンポーネント内のスタイルをスコープします。
このモードを有効にすると、Angularはコンポーネントのホスト要素にシャドウルートを添付し、コンポーネントのテンプレートとスタイルを対応するシャドウツリーにレンダリングします。

シャドウツリー内のスタイルは、そのシャドウツリー外の要素に影響を与えることができません。

ただし、`ShadowDom`カプセル化を有効にすると、スタイルのスコープ以外にも影響があります。
シャドウツリーにコンポーネントをレンダリングすると、イベントの伝播、
[`<slot>` API](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots)
とのやり取り、ブラウザの開発者ツールによる要素の表示方法に影響を与えます。
このオプションを有効にする前に、アプリケーションでShadow DOMを使用することのすべての影響を理解してください。

### ViewEncapsulation.ExperimentalIsolatedShadowDom

上記と同様に動作しますが、このモードでは、_そのコンポーネントのスタイルのみ_が
コンポーネントのテンプレート内の要素に適用されることが厳密に保証されます。グローバルスタイルはシャドウツリー内の要素に影響を与えることができず、シャドウツリー内の
スタイルはシャドウツリー外の要素に影響を与えることができません。

### ViewEncapsulation.None

このモードは、コンポーネントのすべてのスタイルカプセル化を無効にします。
コンポーネントに関連付けられたすべてのスタイルはグローバルスタイルとして動作します。

NOTE: `Emulated`および`ShadowDom`モードでも、Angularはコンポーネントのスタイルが必ずしも外部のスタイルを100%上書きできることを保証しません。
競合が発生した場合、これらのスタイルはコンポーネントのスタイルと同じ詳細度（specificity）を持つと見なされます。

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
Angularはこれらの参照を*外部*スタイルとして扱います。外部スタイルは、エミュレートされたビューカプセル化の影響を受けません。

## Namespacing CSS custom properties

Angular can add a prefix to the CSS custom properties (also called CSS variables) that your
component styles declare and read. Custom properties inherit down the DOM tree, so when something
outside your application defines a custom property such as `--primary-color` on an ancestor
element, your components read that value. This matters when your application shares a page with another
application or with markup you do not control. Angular does not namespace custom properties until
you ask it to, and an application that owns its page does not need namespacing.

To scope the custom properties in your component styles to your application, add
[`provideCssVarNamespacing`](api/platform-browser/provideCssVarNamespacing) to your application's
providers. It uses the application's [`APP_ID`](api/core/APP_ID) as the namespace:

```ts {header: "app.config.ts"}
import {APP_ID, ApplicationConfig} from '@angular/core';
import {provideCssVarNamespacing} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [{provide: APP_ID, useValue: 'my-app'}, provideCssVarNamespacing()],
};
```

Angular prefixes the custom properties in your component styles with that namespace followed by an
underscore, so `--primary-color` becomes `--my-app_primary-color`. The prefix applies to
declarations, `var()` references, `@property` rules, and style bindings such as
`[style.--primary-color]`, including the style bindings a component declares in its `host` object.

`APP_ID` is `ng` unless you set it, so give each application on the page its own `APP_ID`.
Otherwise, the applications share a prefix and collide again. To use a namespace that differs from
the application id, pass it to `provideCssVarNamespacing`. Angular appends the underscore itself:
`provideCssVarNamespacing('my-app_')` produces `--my-app__primary-color`.

Angular namespaces the styles it compiles into a component: the `styles` and `styleUrl` of the
component, the styles you [write in a `<style>` element](#defining-styles-in-templates) in its
template, stylesheets its template references with a relative `<link rel="stylesheet">`, and
the styles of a component that uses `ViewEncapsulation.None`. Angular does not namespace a stylesheet the browser
loads at runtime, such as a global stylesheet your build configuration lists or an
[external style](#referencing-external-style-files) that your build does not inline.

Namespacing applies to every component Angular compiles, including the components of the libraries
you install. When a library's styles read a custom property that a global stylesheet defines, such
as the properties of a theme, the reference no longer matches, the browser uses the `var()`
fallback if there is one or otherwise
[the property's inherited or initial value](https://www.w3.org/TR/css-variables-1/#invalid-variables),
and nothing reports an error. Before you enable namespacing in an
existing application, review the custom properties that cross between your global stylesheets and
your components.

IMPORTANT: Angular rewrites custom property names only in the styles and bindings it compiles.
Everywhere else keeps the name you write, and nothing reports the mismatch.

Angular does not rewrite the name in:

- Static style attributes, such as `style="--primary-color: red"`, including the `style` entry of a
  component's `host` object.
- Object and string style bindings, such as `[style]="{'--primary-color': color}"`,
  `[style]="'--primary-color: red'"` and `ngStyle`, including the `[style]` entry of a component's
  `host` object.
- Custom property names inside a binding's value, such as
  `[style.border-color]="'var(--primary-color)'"`.
- Calls to `Renderer2.setStyle`.

Each of these produces a property that your namespaced styles no longer read. Namespace those
names yourself, as described in
[Using namespaced properties in TypeScript](#using-namespaced-properties-in-typescript).

### Opting out of namespacing

To declare or read a custom property that Angular does not namespace, such as one defined in a
global stylesheet, prefix its name with `--global--`. Angular removes `--global` and leaves the
remaining `--` and the rest of the name unchanged:

```css
:host {
  /* Declares --accent-color and reads --brand-color, not --my-app_brand-color. */
  --global--accent-color: navy;
  color: var(--global--brand-color);
}
```

Write two hyphens after `global`. A single hyphen, as in `--global-brand-color`, does not opt out,
and Angular namespaces that name like any other. Avoid names that start with `--global-` followed
by anything but a second hyphen; a future major version is planned to reject them at build time.
Angular removes `--global` in every application, including applications that never configure a
namespace.

### Using namespaced properties in TypeScript

Prefer a style binding such as `[style.--primary-color]`, which Angular namespaces for you. When
you go through a DOM API instead, pass the name you wrote in your styles to
[`CssVarNamespacer`](api/platform-browser/CssVarNamespacer), including the leading `--`:

```angular-ts {header: "profile-photo.ts"}
import {Component, ElementRef, inject} from '@angular/core';
import {CssVarNamespacer} from '@angular/platform-browser';

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border: 2px solid var(--primary-color);
    }
  `,
})
export class ProfilePhoto {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly cssVarNamespacer = inject(CssVarNamespacer);

  setPrimaryColor(color: string): void {
    this.host.style.setProperty(this.cssVarNamespacer.namespace('--primary-color'), color);
  }
}
```

Use the plain name for a property you declared with `--global--`, since Angular never namespaces
those. For everything else, `namespace` returns the name unchanged when an application configures
no namespace, so a library can call it for the custom properties its own styles declare.
