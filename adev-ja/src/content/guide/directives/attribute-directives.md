# 属性ディレクティブ

属性ディレクティブを使用して、DOM要素とAngularコンポーネントの外観や動作を変更します。

## 属性ディレクティブの作成

このセクションでは、ホスト要素の背景色を黄色に設定するハイライトディレクティブを作成する方法について説明します。

1. ディレクティブを作成するには、CLIコマンド[`ng generate directive`](tools/cli/schematics)を使用します。

    <docs-code language="shell">

    ng generate directive highlight

    </docs-code>

    CLIは`src/app/highlight.directive.ts`と、対応するテストファイル`src/app/highlight.directive.spec.ts`を作成します。

    <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.0.ts"/>

    `@Directive()`デコレーターの構成プロパティは、ディレクティブのCSS属性セレクター`[appHighlight]`を指定します。

1. `@angular/core`から`ElementRef`をインポートします。
    `ElementRef`は、`nativeElement`プロパティを通じてホストDOM要素（`appHighlight`を適用する要素）への直接アクセスを提供します。

1. ディレクティブの`constructor()`に`ElementRef`を追加して、ホストDOM要素への参照を[注入](guide/di)します。

1. 背景を黄色に設定するロジックを`HighlightDirective`クラスに追加します。

    <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

HELPFUL: ディレクティブは*ネームスペース*をサポートしていません。

<docs-code header="src/app/app.component.avoid.html (unsupported)" path="adev/src/content/examples/attribute-directives/src/app/app.component.avoid.html" visibleRegion="unsupported"/>

## 属性ディレクティブの適用

1. `HighlightDirective`を使用するには、ディレクティブを属性として持つ`<p>`要素をHTMLテンプレートに追加します。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" visibleRegion="applied"/>

Angularは`HighlightDirective`クラスのインスタンスを作成し、`<p>`要素への参照をディレクティブのコンストラクターに注入します。これにより、`<p>`要素の背景スタイルが黄色に設定されます。

## ユーザーイベントの処理

このセクションでは、ユーザーが要素内または要素外にマウスを移動したときに検出する方法と、ハイライトカラーを設定またはクリアして応答する方法について説明します。

1. `@angular/core`から`HostListener`をインポートします。

    <docs-code header="src/app/highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="imports"/>

1. マウスが入りまたは出たときに応答する2つのイベントハンドラーを追加します。それぞれに`@HostListener()`デコレーターを使用します。

    <docs-code header="src/app/highlight.directive.ts (mouse-methods)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="mouse-methods"/>

`@HostListener()`デコレーターを使用して、属性ディレクティブをホストするDOM要素（この場合は`<p>`）のイベントを購読します。

HELPFUL: ハンドラーは、ホストDOM要素`el`に色を設定するヘルパーメソッド`highlight()`に委任します。

完全なディレクティブは次のとおりです。

<docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

ポインタが段落要素の上にホバーすると背景色が表示され、ポインタが外れると背景色が消えます。

<img alt="Second Highlight" src="assets/images/guide/attribute-directives/highlight-directive-anim.gif">

## 属性ディレクティブに値を渡す

このセクションでは、`HighlightDirective`を適用するときにハイライトカラーを設定する方法について説明します。

1. `highlight.directive.ts`で、`@angular/core`から`Input`をインポートします。

    <docs-code header="src/app/highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="imports"/>

1. `appHighlight` `input`プロパティを追加します。

    <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="input"/>

    `input`関数は、ディレクティブの`appHighlight`プロパティをバインディングで使用できるようにするメタデータをクラスに追加します。

2. `app.component.ts`で、`AppComponent`に`color`プロパティを追加します。

    <docs-code header="src/app/app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" visibleRegion="class"/>

3. ディレクティブと色を同時に適用するには、`appHighlight`ディレクティブセレクターを使用してプロパティバインディングを使用し、それを`color`に設定します。

    <docs-code header="src/app/app.component.html (color)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="color"/>

    `[appHighlight]`属性バインディングは次の2つのタスクを実行します。

    * `<p>`要素にハイライトディレクティブを適用する
    * プロパティバインディングを使用してディレクティブのハイライトカラーを設定する

### ユーザー入力を使用して値を設定する

このセクションでは、カラー選択を`appHighlight`ディレクティブにバインドするラジオボタンを追加する方法について説明します。

1. 色を選択するためのマークアップを`app.component.html`に追加します。

    <docs-code header="src/app/app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="v2"/>

1. `AppComponent.color`を修正して、初期値を持たないようにします。

    <docs-code header="src/app/app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" visibleRegion="class"/>

1. `highlight.directive.ts`で、`onMouseEnter`メソッドを修正して、最初に`appHighlight`でハイライトしようとします。`appHighlight`が`undefined`の場合は`red`にフォールバックします。

    <docs-code header="src/app/highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="mouse-enter"/>

1. アプリケーションを起動して、ユーザーがラジオボタンで色を選択できることを確認します。

    <img alt="Animated gif of the refactored highlight directive changing color according to the radio button the user selects" src="assets/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## 2番目のプロパティにバインドする

このセクションでは、開発者がデフォルトカラーを設定できるようにアプリケーションを構成する方法について説明します。

1. `HighlightDirective`に`defaultColor`という名前の2番目の`Input()`プロパティを追加します。

    <docs-code header="src/app/highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="defaultColor"/>

1. ディレクティブの`onMouseEnter`を修正して、最初に`appHighlight`でハイライトしようとします。次に`defaultColor`でハイライトしようとします。両方のプロパティが`undefined`の場合は`red`にフォールバックします。

    <docs-code header="src/app/highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="mouse-enter"/>

1. `AppComponent.color`にバインドし、デフォルトカラーとして「violet」を使用するには、次のHTMLを追加します。
    この場合、`defaultColor`バインディングは、静的であるため、角括弧`[]`を使用しません。

    <docs-code header="src/app/app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="defaultColor"/>

    コンポーネントと同様に、ホスト要素に複数のディレクティブプロパティバインディングを追加できます。

デフォルトカラーは、デフォルトカラーバインディングがない場合は赤です。
ユーザーが色を選択すると、選択した色がアクティブなハイライトカラーになります。

<img alt="Animated gif of final highlight directive that shows red color with no binding and violet with the default color set. When user selects color, the selection takes precedence." src="assets/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## `NgNonBindable`を使用してAngularの処理を無効にする

ブラウザでの式評価を防ぐには、ホスト要素に`ngNonBindable`を追加します。
`ngNonBindable`は、テンプレート内の補間、ディレクティブ、バインディングを無効にします。

次の例では、式`{{ 1 + 1 }}`はコードエディタと同じようにレンダリングされ、`2`は表示されません。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable"/>

`ngNonBindable`を要素に適用すると、その要素の子要素のバインディングが停止します。
ただし、`ngNonBindable`は、`ngNonBindable`を適用した要素に対しては、ディレクティブを動作させます。
次の例では、`appHighlight`ディレクティブはアクティブですが、Angularは式`{{ 1 + 1 }}`を評価しません。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable-with-directive"/>

`ngNonBindable`を親要素に適用すると、Angularは要素の子要素に対して、プロパティバインディングやイベントバインディングなどあらゆる種類の補間とバインディングを無効にします。
