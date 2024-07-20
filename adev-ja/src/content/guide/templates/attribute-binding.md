# 属性バインディング

Angularの属性バインディングを使用すると、属性の値を直接設定できます。
属性バインディングを使用すると、アクセシビリティを向上させ、アプリケーションを動的にスタイル設定し、複数のCSSクラスまたはスタイルを同時に管理できます。

## 構文

属性バインディングの構文は [プロパティバインディング](guide/templates/property-binding) に似ていますが、角括弧で囲まれた要素プロパティの代わりに、属性名の前に `attr` プレフィックスとドットを付けます。
次に、属性値を文字列に変換される式で設定します。

<docs-code language="html">

<p [attr.attribute-you-are-targeting]="expression"></p>

</docs-code>

HELPFUL: 式が `null` または `undefined` に解決されると、Angularは属性を完全に削除します。

## ARIA 属性のバインディング

属性バインディングの主なユースケースの1つは、ARIA属性を設定することです。

ARIA属性にバインドするには、次のように入力します。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="attrib-binding-aria"/>

## `colspan` へのバインディング

属性バインディングのもう1つの一般的なユースケースは、テーブルの `colspan` 属性です。 `colspan` 属性にバインディングすると、テーブルをプログラムで動的に保つことができます。 アプリケーションがテーブルに表示するデータの量に応じて、行がまたがる列の数は変わる可能性があります。

`<td>` 属性 `colspan` で属性バインディングを使用するには

1. 次の構文を使用して `colspan` 属性を指定します。 `[attr.colspan]`。
1. `[attr.colspan]` を式に等しく設定します。

次の例では、`colspan` 属性を式 `1 + 1` にバインドしています。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="colspan"/>

このバインディングにより、`<tr>` は2つの列にまたがります。

HELPFUL: プロパティ名と属性名の間に違いがある場合があります。

`colspan` は `<td>` の属性ですが、大文字の "S" を使った `colSpan` はプロパティです。
属性バインディングを使用する場合は、小文字の "s" を使った `colspan` を使用してください。

`colSpan` プロパティへのバインディング方法の詳細については、[プロパティバインディング](guide/templates/property-binding) の [`colspan` と `colSpan`](guide/templates/property-binding#colspan-and-colspan) セクションを参照してください。

## 次へ

<docs-pill-row>
  <docs-pill href="guide/templates/class-binding" title="クラスとスタイルのバインディング"/>
</docs-pill-row>
