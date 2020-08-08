# テンプレート中の SVG

Angular では SVG を有効なテンプレートとして使うことができます。次に示すすべてのテンプレート構文は、
SVG と HTML の両方に適用できます。詳しくは SVG [1.1](https://www.w3.org/TR/SVG11/) と
[2.0](https://www.w3.org/TR/SVG2/) の仕様をご覧ください。

<div class="alert is-helpful">

See the <live-example name="template-syntax"></live-example> for a working example containing the code snippets in this guide.

</div>

なぜ SVG を画像としてアプリケーションに追加するのではなく、テンプレートとして使うのでしょうか？

SVG をテンプレートとして使うことで、HTML のときと同じようにディレクティブやバインディングを使うことができます。
つまりインタラクティブな画像を動的に生成することができます。

構文の例として次のコードスニペットをご覧ください:

<code-example path="template-syntax/src/app/svg.component.ts" header="src/app/svg.component.ts"></code-example>

次のコードを `svg.component.svg` ファイルとして追加します:

<code-example path="template-syntax/src/app/svg.component.svg" header="src/app/svg.component.svg"></code-example>

`click()` イベントバインディングと、プロパティバインディングの構文 (`[attr.fill]="fillColor"`)
を使っている様子を確認できます。
