# テンプレート中の SVG

AngularアプリケーションではSVGファイルをテンプレートとして使うことができます。
SVGをテンプレートとして使用すると、HTMLテンプレートと同様にディレクティブやバインディングを使用することができます。
これらの機能を利用して、インタラクティブなグラフィックを動的に生成することができます。

<div class="alert is-helpful">

See the <live-example name="template-syntax"></live-example> for a working example containing the code snippets in this guide.

</div>

## SVG構文の例

次の例では、SVG をテンプレートとして使用するための構文を示しています。

<code-example header="src/app/svg.component.ts" path="template-syntax/src/app/svg.component.ts"></code-example>

プロパティとイベントバインディングの動作を見るには、次のコードを `svg.component.svg` ファイルに追加します。

<code-example header="src/app/svg.component.svg" path="template-syntax/src/app/svg.component.svg"></code-example>

`click()` イベントバインディングと、プロパティバインディングの構文 (`[attr.fill]="fillColor"`)を使っている様子を確認できます。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
