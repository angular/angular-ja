# イベントバインディング `(event)`

イベントバインディングを使えば、キー操作、マウス移動、クリック、タッチなどの
イベントをリッスンすることができます。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

Angular のイベントバインディングの構文は、等号の左側にある
括弧に囲まれた **ターゲットイベント** の名前と、
等号の右側にある引用符に囲まれたテンプレート文から成り立ちます。
次のイベントバインディングはボタンのクリックイベントをリッスンし、
クリックされたらコンポーネントの `onSave()` メソッドを呼び出します:

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">
</div>

## ターゲットイベント {@a target-event}

前に示したとおり、ターゲットはボタンのクリックイベントです。

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html"></code-example>

または、標準形式として知られている接頭辞 `on-` を使うこともできます:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html"></code-example>

要素のイベントは、より一般的なターゲットかもしれませんが、次の例で示すように、
Angular は名前が既知のディレクティブのイベントプロパティと一致するかどうかを最初に調べます。

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

名前が、要素のイベントや、既知のディレクティブの出力プロパティと一致しないときは、
Angular は “unknown directive” エラーを報告します。

## *$event* とイベントハンドル文 {@a event-and-event-handling-statements}

イベントバインディングでは、Angular はターゲットイベントのイベントハンドラーをセットアップします。

イベントが発生すると、ハンドラーはテンプレート文を実行します。
通常、テンプレート文にはレシーバーが含まれます。
レシーバーでは、HTML コントロールの値をモデルに格納するなどといった、
イベントに反応したアクションを実行します。

バインディングは、イベントに関する情報を伝えます。この情報には、 `$event` という名前でイベントオブジェクト、文字列、数値などのデータ値を含めることができます。

`$event` オブジェクトの形式はターゲットのイベントによって決まります。
ターゲットのイベントがネイティブの DOM 要素イベントであれば、 `$event` は
`target` や `target.value` といったプロパティを持った
[DOM イベントオブジェクト](https://developer.mozilla.org/en-US/docs/Web/Events)です。

この例について考えてみましょう:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

このコードでは、 `name` プロパティをバインドすることで `<input>` の `value` を設定しています。
値の変化をリッスンするため、 `<input>` 要素の
`input` イベントにバインドしています。
ユーザーが値を変更すると `input` イベントが発生し、
バインディングは DOM イベントオブジェクト `$event` を含むコンテキストで文を実行します。

`name` プロパティを更新するため、パス `$event.target.value` を使って変更されたテキストを取得します。

イベントがディレクティブに属している場合&mdash;コンポーネントはディレクティブであることを思い出してください
&mdash;`$event` はディレクティブが生成する形式となります。

## `EventEmitter` によるカスタムイベント {@a custom-events-with-eventemitter}

典型的なディレクティブは、Angular の [EventEmitter](api/core/EventEmitter) によってカスタムイベントを発生させます。
ディレクティブは `EventEmitter` を作り、プロパティとして公開します。
ディレクティブはイベントを起こすために `EventEmitter.emit(payload)` を呼び出し、任意のメッセージペイロードを渡します。
親ディレクティブは、プロパティをバインドしてイベントをリッスンし、 `$event` オブジェクトを通じてペイロードにアクセスします。

`ItemDetailComponent` がアイテムの情報を表示して、ユーザーアクションに反応するものだとします。
`ItemDetailComponent` には削除ボタンがありますが、それ自身はヒーローを削除する方法を知りません。ユーザーの削除要求を伝えるイベントを発生させるだけです。

`ItemDetailComponent` の関連コードの抜粋です:


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" header="src/app/item-detail/item-detail.component.html (template)" region="line-through"></code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest"></code-example>


コンポーネントは `EventEmitter` を返す `deleteRequest` プロパティを定義しています。
ユーザーが *delete* をクリックすると、コンポーネントは `delete()` メソッドを呼び出し、
`EventEmitter` に `Item` オブジェクトを出力させます。

ホストする親コンポーネントが `ItemDetailComponent` の `deleteRequest`
にバインドしているとしましょう。

<code-example path="event-binding/src/app/app.component.html" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component"></code-example>

`deleteRequest` イベントが発生すると、Angular は親コンポーネントの
`deleteItem()` メソッドを呼び出し、 `$event` 変数の *削除するアイテム* (`ItemDetail` によって出力)
を渡します。

## テンプレート文は副作用をもつ {@a template-statements-have-side-effects}

[テンプレート式](guide/interpolation#template-expressions)は[副作用](guide/property-binding#avoid-side-effects)をもつべきではありませんが、
テンプレート文には通常副作用があります。
`deleteItem()` メソッドには、アイテムを削除するという副作用があります。

アイテムの削除によってモデルが更新され、どういうコードを書くかにもよりますが、
リモートサーバーへの問い合わせや保存といったその他の変化も引き起こします。
これらの変化はシステムを伝播していき、最終的にはさまざまなビューによって表示されます。
