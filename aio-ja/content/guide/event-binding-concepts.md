
# イベントバインディングのしくみ {@a how-event-binding-works}

イベントバインディングでは、Angularはターゲットイベントのイベントハンドラーを構成します。
独自のカスタムイベントでイベントバインディングを使用できます。

コンポーネントやディレクティブがイベントを発生させると、ハンドラーはテンプレート文を実行します。
テンプレート文は、イベントに応答してアクションを起こします。

## イベントハンドリング {@a handling-events}

イベントを処理する一般的な方法は、イベントオブジェクトの`$event`をイベントを処理するメソッドに渡すことです。
`$event`オブジェクトには、ユーザー名や画像のURLなどメソッドに必要な情報がたいてい含まれています。

ターゲットのイベントにより`$event`オブジェクトの形式が決まります。
ターゲットのイベントがネイティブのDOM要素イベントなら、`$event`は`target`や`target.value`などのプロパティをもつ[DOMのイベントオブジェクト](https://developer.mozilla.org/en-US/docs/Web/Events)です。

次のコード例では、`name`プロパティにバインドして`<input>`の`value`プロパティを設定します。


<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

この例では、次のアクションが起こります:

1. このコードは`<input>`要素の`input`イベントにバインドして、それにより変更をリッスンできます。
1. ユーザーが変更を加えると、コンポーネントは`input`イベントを発生させます。
1. バインディングは、DOMのイベントオブジェクトの`$event`を含むコンテキスト内でその式を実行します。
1. Angularは、`getValue($event.target)`を呼び出して変更されたテキストを取得し、`name`プロパティを更新します。

イベントがディレクティブやコンポーネントに属している場合、`$event`はディレクティブやコンポーネントが生成する形式になります。

<div class="alert is-helpful">

The type of `$event.target` is only `EventTarget` in the template.
In the `getValue()` method, the target is cast to an `HTMLInputElement` to allow type-safe access to its `value` property.

<code-example path="event-binding/src/app/app.component.ts" region="getValue"></code-example>

</div>
