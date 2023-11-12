# 補間による値の表示

## 前提

* [コンポーネントとテンプレートのイントロダクション](guide/architecture-components)
* [テンプレート](guide/glossary#template)
* [バインディング構文](guide/binding-syntax)

<!--todo: needs a level 2 heading for info below -->

補間では、マークアップされたテキストに埋め込まれた式を参照します。デフォルトでは、補間は二重中括弧 `{{` と `}}` を区切り文字として使います。

補間がどのように機能するかを説明するために、`currentCustomer` 変数を含む Angular コンポーネントを考えてみましょう。

<code-example path="interpolation/src/app/app.component.ts" region="customer"></code-example>

補間を使用して、対応するコンポーネントのテンプレートでこの変数の値を表示します。

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1"></code-example>

Angular は、`currentCustomer` を対応するコンポーネントのプロパティの文字列値に置き換えます。 この場合、値は `Maria` です。

次の例では、Angular は `title` プロパティと `itemImageUrl` プロパティを評価して、タイトルのテキストと画像を表示します。

<code-example path="interpolation/src/app/app.component.html" region="component-property"></code-example>

## 次へ進む

* [プロパティバインディング](guide/property-binding)
* [イベントバインディング](guide/event-binding)

@reviewed 2023-09-01
