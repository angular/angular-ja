# 属性バインディング　{@a attribute-binding}

Angular での属性バインディングは、属性に直接値を設定するのに役立ちます。
属性バインディングを使用することで、アクセシビリティの改善や、アプリケーションのスタイルを動的に変更し、複数の CSS クラスやスタイルを同時に管理することができます。

<div class="alert is-helpful">

このガイドのコードスニペットを含む動作例については、<live-example></live-example>をご覧ください。

</div>

## 前提条件

* [プロパティバインディング](guide/property-binding)

## 構文

属性バインディングの構文は[プロパティバインディング](guide/property-binding)に似ていますが、要素のプロパティをブラケットで囲むのではなく、属性名の前に `attr` のプレフィックスを付け、続けてドットを付けます。
そして、文字列に解決する式を使用して属性値を設定します。

<code-example format="html" language="html">

&lt;p [attr.attribute-you-are-targeting]="expression"&gt;&lt;/p&gt;

</code-example>

<div class="alert is-helpful">

式が `null` または `undefined` に解決する場合、Angular は属性を完全に削除します。

</div>

## ARIA 属性のバインディング

属性バインディングの主な用途の 1 つは ARIA 属性を設定することです。

ARIA 属性にバインドするには、次のように入力します。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria"></code-example>

<a id="colspan"></a>

## `colspan`にバインディング

属性バインディングのもう 1 つの一般的な使用例は、テーブルの `colspan` 属性です。`colspan` 属性へのバインディングは、テーブルを動的に保つのに役立ちます。   アプリケーションがテーブルに入力するデータ量に応じて、行がまたがる列の数が変わる可能性があります。

属性バインディングを `<td>` 属性 `colspan` と共に使用するには、次のようにします。
1. `colspan`属性は、次の構文で指定します:`[attr.colspan]`。
1. `[attr.colspan]`に式を設定します。

次の例では、colspan 属性を 1 + 1 の式にバインディングしています。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="colspan"></code-example>

このバインディングによって、`<tr>` は 2 つのカラムに分かれます。

<div class="alert is-helpful">

プロパティと属性の名称が異なる場合があります。

`colspan`は`<td>`の属性であり、`colSpanは`大文字の"S"があるプロパティです。
属性バインディングを使用する時は小文字の"s"を使用して、colspan を使用してください。

さらに詳しい情報については[プロパティバインディング](guide/property-binding)の[`colspan` と `colSpan`](guide/property-binding#colspan)のセクションを参照してください。

</div>

## 次のお勧め

* [クラスとスタイルのバインディング](guide/class-binding)

@reviewed 2022-05-02
