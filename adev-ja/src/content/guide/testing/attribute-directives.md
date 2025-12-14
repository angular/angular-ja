# 属性ディレクティブのテスト

_属性ディレクティブ_は、要素、コンポーネント、または他のディレクティブの動作を変更します。
その名前は、ディレクティブが適用される方法、つまりホスト要素の属性として適用される方法を反映しています。

## `HighlightDirective`のテスト

サンプルアプリケーションの`HighlightDirective`は、データバインドされた色またはデフォルトの色（ライトグレー）に基づいて、要素の背景色を設定します。
また、要素のカスタムプロパティ（`customProperty`）を`true`に設定しますが、これは単に設定できることを示すためです。

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.ts"/>

これはアプリケーション全体で使用されています。おそらく最も簡単な例は`AboutComponent`です。

<docs-code header="about.component.ts" path="adev/src/content/examples/testing/src/app/about/about.component.ts"/>

`AboutComponent`内での`HighlightDirective`の特定の使用をテストするには、[Component testing scenarios](guide/testing/components-scenarios)セクションの["Nested component tests"](guide/testing/components-scenarios#nested-component-tests)で説明されているテクニックのみが必要です。

<docs-code header="about.component.spec.ts" path="adev/src/content/examples/testing/src/app/about/about.component.spec.ts" region="tests"/>

しかし、単一のユースケースをテストしても、ディレクティブの機能のすべてを調べられるとは限りません。
ディレクティブを使用するすべてのコンポーネントを見つけてテストすることは、面倒で壊れやすく、完全なカバレッジを実現する可能性もほとんどありません。

_クラスのみのテスト_は役立つ場合がありますが、このディレクティブのような属性ディレクティブは、DOMを操作する傾向があります。
孤立したユニットテストはDOMに触れないため、ディレクティブの有効性に対する信頼を得られません。

より良い解決策は、ディレクティブのすべての適用方法を示す人工的なテストコンポーネントを作成することです。

<docs-code header="highlight.directive.spec.ts (TestComponent)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" region="test-component"/>

<img alt="HighlightDirective spec in action" src="assets/images/guide/testing/highlight-directive-spec.png">

HELPFUL: `<input>`のケースでは、`HighlightDirective`を、入力ボックス内の色の値の名前とバインドしています。
初期値は単語"cyan"であり、これは入力ボックスの背景色になります。

このコンポーネントのテストをいくつか紹介します。

<docs-code header="highlight.directive.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests"/>

いくつかのテクニックが注目に値します。

- `By.directive`述語は、_要素の種類が不明な場合_、このディレクティブを持つ要素を取得する優れた方法です。
- `By.css('h2:not([highlight])')`の[`:not`擬似クラス](https://developer.mozilla.org/docs/Web/CSS/:not)は、ディレクティブを持っていない`<h2>`要素を見つけるのに役立ちます。
  `By.css('*:not([highlight])')`は、ディレクティブを持っていない_すべての_要素を見つけます。

- `DebugElement.styles`は、`DebugElement`抽象化のおかげで、実際のブラウザがなくても、要素のスタイルにアクセスできます。
  しかし、抽象化よりも簡単で明確な場合は、`nativeElement`を利用してください。

- Angularは、適用された要素のインジェクターにディレクティブを追加します。
  デフォルトの色に対するテストでは、2番目の`<h2>`のインジェクターを使用して、その`HighlightDirective`インスタンスとその`defaultColor`を取得します。

- `DebugElement.properties`は、ディレクティブによって設定された人工的なカスタムプロパティにアクセスできます。
