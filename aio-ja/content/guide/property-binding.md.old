
# プロパティバインディング `[property]`

プロパティバインディングを使うことで、対象の要素のプロパティや
ディレクティブの `@Input()` デコレーターを _設定_ できます。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

## 内側への単方向 {@a one-way-in}

プロパティバインディングは、値をコンポーネントのプロパティから
対象の要素のプロパティへと、単方向に流します。

プロパティバインディングは、
対象の要素から値を読み出したり引き出したりすることには使えません。同様に、
プロパティバインディングで対象の要素のメソッドを呼び出すこともできません。
要素が発生するイベントは、 [イベントバインディング](guide/event-binding)を使ってリッスンすることができます。

対象の要素のプロパティを読んだり、メソッドを呼び出したりする必要があるときは、
API リファレンスの [ViewChild](api/core/ViewChild) や
[ContentChild](api/core/ContentChild) を参照してください。

## Examples

一番よくあるプロパティバインディングは、要素のプロパティを
コンポーネントのプロパティの値に設定するものです。例では
イメージ要素の `src` プロパティを、コンポーネントの `itemImageUrl` プロパティにバインドしています:

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

これは `colSpan` プロパティのバインディングの例です。`s` を小文字で書く属性
`colspan` とは違うことに注意してください。

<code-example path="property-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

詳しくは [MDN HTMLTableCellElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement) のドキュメントを参照してください。

For more information about `colSpan` and `colspan`, see the [Attribute binding](guide/attribute-binding#colspan) guide.

もうひとつの例ではコンポーネントが `isUnchanged` のときにボタンを無効化しています:

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

こちらはディレクティブのプロパティを設定しています:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

また、こちらはカスタムコンポーネントのモデルプロパティを設定しています&mdash;
親コンポーネントと子コンポーネントがやりとりするための優れた方法です:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

## バインディングターゲット

角括弧で囲まれた要素のプロパティは、ターゲットプロパティを識別します。
次のコードのターゲットプロパティは、img 要素の `src` プロパティです。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

代わりに `bind-` 接頭辞を使うこともできます:

<code-example path="property-binding/src/app/app.component.html" region="bind-prefix" header="src/app/app.component.html"></code-example>


ターゲットの名前が属性の名前に見えたとしても、
プロパティの名前であることがほとんどです。
この場合は `src` は `<img>` 要素のプロパティの名前です。

要素のプロパティはより一般的なターゲットかもしれませんが、
次の例のように、
Angular は最初に名前が既知のディレクティブのプロパティであるかどうかを確認します:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

技術的には、Angular は名前をディレクティブの `@Input()` 、
ディレクティブの `inputs` 配列に書かれたプロパティ名、
`@Input()` で装飾されたプロパティに対して照合します。
そのような入力はディレクティブ自身のプロパティにマッピングされます。

名前が既知のディレクティブまたは要素のプロパティと一致しない場合、Angular は “unknown directive” エラーを報告します。

<div class="alert is-helpful">

ターゲットの名前は一般にはプロパティの名前ですが、
いくつかの属性については Angular が属性-プロパティを自動でマッピングします。
`class`/`className`、`innerHtml`/`innerHTML`、`tabindex`/`tabIndex`
がその例です。

</div>


## 副作用を避ける {@a avoid-side-effects}

テンプレート式の評価には目に見える副作用はありません。
式の言語自体や、テンプレート式の記述方法は、
ある程度その役に立ちます。
プロパティバインディング式でに何か値を代入したり、
インクリメント演算子とデクリメント演算子を使用することはできません。

たとえば、式は副作用のあるプロパティやメソッドを呼び出すかもしれません。
式は `getFoo()` のようなものを呼び出すことができますが、
`getFoo()` が何をするかを知っているのはあなただけです。
もし `getFoo()` が何かを変更し、それがバインディングされていたとすると、
Angular は変更後の値を表示するかもしれないし、しないかもしれません。
Angular は変更を検知して警告のエラーを起こすかもしれません。
値を返すだけで副作用がないプロパティやメソッドを使うことが
ベストプラクティスです。

## 適切な型を返す {@a return-the-proper-type}

テンプレート式は、ターゲットプロパティが期待する値の型として
評価されるべきです。
ターゲットプロパティが文字列を期待する場合は文字列を、数値を期待する場合は数値を、
オブジェクトを期待する場合はオブジェクトを返してください。

次の例の `ItemDetailComponent` の `childItem` プロパティは文字列を期待していて、それはプロパティバインディングが送り込む型と一致しています:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

`ItemDetailComponent` を見ると `@Input` の型が文字列になっていることが確認できます:
<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)"></code-example>

`ItemDetailComponent` が期待するとおり、`AppComponent` の `parentItem` も文字列です:
<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

### オブジェクトを渡す {@a passing-in-an-object}

先ほどの簡単な例では文字列を渡していました。
オブジェクトを渡すときの文法や考え方も似たようなものです。

`AppComponent` の中に `ItemListComponent` がネストされていて `item` プロパティがオブジェクトを期待しているものとします。

<code-example path="property-binding/src/app/app.component.html" region="pass-object" header="src/app/app.component.html"></code-example>

`items` プロパティは `ItemListComponent` の中で宣言されており、型は `Item` で `@Input()` で修飾されています:

<code-example path="property-binding/src/app/item-list/item-list.component.ts" region="item-input" header="src/app/item-list.component.ts"></code-example>

サンプルアプリでは `Item` は `id` と `name` の2つのプロパティを持ったオブジェクトです。

<code-example path="property-binding/src/app/item.ts" region="item-class" header="src/app/item.ts"></code-example>

`mock-items.ts` という別のファイルにアイテムのリストがありますが、
新しいアイテムを表示するために `app.component.ts` で別のアイテムを指定することができます:

<code-example path="property-binding/src/app/app.component.ts" region="pass-object" header="src/app.component.ts"></code-example>

この場合はオブジェクトの配列を指定していることに注意してください。この型は `items` の型であり、ネストされたコンポーネント `ListItemComponent` が求める型でもあります。

この例では `AppComponent` は別の `item` オブジェクト (`currentItems`) を指定し、
それをネストされた `ItemListComponent` に渡しています。`item.ts` に書かれた `Item` の形と `currentItems` の形が一致するため、 `ItemListComponent` はそれを使うことができます。
`item.ts` ファイルは `ItemListComponent` が `item` の定義を得るために参照しているファイルです。

## 角括弧を忘れずに {@a remember-the-brackets}

角括弧 `[]` は Angular にテンプレート式を評価するように指示します。
角括弧を省略すると Angular は文字列を定数として扱い、
その文字列で *ターゲットプロパティを初期化* します。

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>


角括弧を忘れると `parentItem` の値ではなく
`parentItem` という文字列が表示されてしまいます。

## ワンタイムの文字列の初期化 {@a one-time-string-initialization}

次のすべてが当てはまる場合は、角括弧を省略する *べき* です:

* ターゲットプロパティが文字列値を受け入れる。
* 文字列がテンプレートに直接書き込める固定値。
* この初期値が変化しない。

普段の標準の HTML ではこの方法で属性を初期化していますが、
これはディレクティブやコンポーネントのプロパティの初期化に対しても同様に機能します。
次の例では、`StringInitComponent` の `prefix` プロパティをテンプレート式ではなく固定の文字列で初期化します。
Angular はそれを設定し、それについて忘れます。

<code-example path="property-binding/src/app/app.component.html" region="string-init" header="src/app/app.component.html"></code-example>

一方で `[item]` バインディングは、コンポーネントの `currentItem` プロパティへのライブバインディングです。

## プロパティバインディング vs. 補間 {@a property-binding-vs-interpolation}

補間とプロパティバインディングのどちらかを選べるシーンがよくあります。
次のバインディングのペアは同じことをします:

<code-example path="property-binding/src/app/app.component.html" region="property-binding-interpolation" header="src/app/app.component.html"></code-example>

多くの場合、補間はプロパティバインディングよりも簡単な手段です。
データの値を文字列として表示するときは、
技術的にはどちらでもよく、読みやすさは補間に分があります。
しかし *要素のプロパティに文字列以外の値を設定する場合は、
プロパティバインディングを使う必要があります。*

## コンテンツのセキュリティ {@a content-security}

次の *悪意のある* コンテンツを想像してください。

<code-example path="property-binding/src/app/app.component.ts" region="malicious-content" header="src/app/app.component.ts"></code-example>

コンポーネントのテンプレートでは、コンテンツが補間で使われることがあります:

<code-example path="property-binding/src/app/app.component.html" region="malicious-interpolated" header="src/app/app.component.html"></code-example>

幸いなことに、Angular のデータバインディングは危険な HTML に対して警戒しています。
先ほどの例では HTML がそのまま表示され、Javascript は実行されません。
Angular は、補間でもプロパティバインディングでも、
script タグが含まれた HTML をブラウザにリークすることを *許しません。*

次の例では値を表示する前に
Angular が[サニタイズ](guide/security#sanitization-and-security-contexts)しています。

<code-example path="property-binding/src/app/app.component.html" region="malicious-content" header="src/app/app.component.html"></code-example>

補間は `<script>` タグを
プロパティバインディングとは違った方法で扱いますが、
どちらの方法でもコンテンツを無害な形で表示します。
ブラウザで `evilTitle` を表示した例がこちらになります。

<code-example language="bash">
"Template &lt;script&gt;alert("evil never sleeps")&lt;/script&gt; Syntax" is the interpolated evil title.
"Template alert("evil never sleeps")Syntax" is the property bound evil title.
</code-example>
