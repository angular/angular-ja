# SVG をテンプレートとして使用

AngularアプリケーションでSVGファイルをテンプレートとして使用できます。
SVGをテンプレートとして使用する場合、HTMLテンプレートと同様にディレクティブとバインディングを使用できます。
これらの機能を使用して、動的にインタラクティブなグラフィックを生成します。

## SVG 構文例

次の例は、SVGをテンプレートとして使用するための構文を示しています。

<docs-code header="src/app/svg.component.ts" path="adev/src/content/examples/template-syntax/src/app/svg.component.ts"/>

プロパティとイベントのバインディングを実際に確認するために、次のコードを `svg.component.svg` ファイルに追加します。

<docs-code header="src/app/svg.component.svg" path="adev/src/content/examples/template-syntax/src/app/svg.component.svg"/>

この例では、`click()` イベントバインディングとプロパティバインディング構文 `[attr.fill]="fillColor"` を使用しています。
