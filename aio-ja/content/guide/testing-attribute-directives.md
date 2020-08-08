
{@a attribute-directive}

# 属性ディレクティブのテスト

_属性ディレクティブ_は、要素、コンポーネントまたは別のディレクティブの動作を変更します。
その名前は、ディレクティブが適用されるホストエレメントの属性として反映されます。

<div class="alert is-helpful">

  For the sample app that the testing guides describe, see the <live-example name="testing" embedded-style noDownload>sample app</live-example>.

  For the tests features in the testing guides, see <live-example name="testing" stackblitz="specs" noDownload>tests</live-example>.

</div>

## Testing the `HighlightDirective`

サンプルアプリケーションの`HighlightDirective`は、
データバインドされた色またはデフォルトの色(ライトグレー)のいずれかに基づいて要素の背景色を設定します。
また、要素のカスタムプロパティ(`customProperty`)を、
それが可能であることを示す以外の理由なしに`true`に設定します。

<code-example path="testing/src/app/shared/highlight.directive.ts" header="app/shared/highlight.directive.ts"></code-example>

これはアプリケーション全体で使用されています。多分、`AboutComponent`内のものがもっともシンプルです:

<code-example path="testing/src/app/about/about.component.ts" header="app/about/about.component.ts"></code-example>

Testing the specific use of the `HighlightDirective` within the `AboutComponent` requires only the techniques explored in the ["Nested component tests"](guide/testing-components-scenarios#nested-component-tests) section of [Component testing scenarios](guide/testing-components-scenarios).
`AboutComponent`内の特定の`HighlightDirective`の使用をテストするのに必要なのは、
[コンポーネントテストシナリオ](guide/testing-components-scenarios)の["Nested component tests"](guide/testing-components-scenarios#nested-component-tests) セクションで取り上げたテクニックだけです。

<code-example path="testing/src/app/about/about.component.spec.ts" region="tests" header="app/about/about.component.spec.ts"></code-example>

しかし、単一のユースケースをテストすることは、ディレクティブの機能の全範囲を調査することにはなりません。
このディレクティブを使用しているすべてのコンポーネントを見つけてテストするのは面倒で脆く、完全にカバーすることはほとんどありません。

_クラスのみ_のテストは役に立ちますが、
このような属性ディレクティブはDOMを操作する傾向があります。
隔離されたユニットテストはDOMに触れることはないので、
ディレクティブの効果に対する信頼を促すものではありません。

よりよい解決策は、ディレクティブを適用するすべての方法を示す人工的なテストコンポーネントを作成することです。

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" header="app/shared/highlight.directive.spec.ts (TestComponent)"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="HighlightDirective spec in action">
</div>

<div class="alert is-helpful">

`<input>`は、`HighlightDirective`をインプットボックスのカラー値の名前にバインドします。
初期値にはインプットボックスの背景色であるべき"cyan"というワードが設定されています。

</div>

このコンポーネントのテストは次のとおりです:

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" header="app/shared/highlight.directive.spec.ts (selected tests)"></code-example>

いくつか注目に値するテクニックがあります:

- `By.directive`述部は、_要素の型が不明な場合_にこのディレクティブをもつ要素を取得するための優れた方法です。

- `By.css('h2：not([highlight])')`内の<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not">`:not`疑似クラス</a>は、
  ディレクティブを持たない`<h2>`要素を見つけるのに役立ちます。
  `By.css('*：not([highlight])')`は、ディレクティブを持たない要素を検出します。

- `DebugElement.styles`は、`DebugElement`抽象化のおかげで、実際のブラウザがなくても要素のスタイルにアクセスできます。
  しかし、抽象化よりも簡単で明快な場合は、`nativeElement`の利用を遠慮しないでください。

- Angularは、それが適用されている要素のインジェクターにディレクティブを追加します。
  デフォルトカラーのテストでは、
  `HighlightDirective`インスタンスの`defaultColor`を取得するために2番目の`<h2>`のインジェクターを使用しています。

- `DebugElement.properties`は、ディレクティブによって設定された人工的なカスタムプロパティへのアクセスを提供します。

<hr>
