# ディレクティブとコンポーネントの親子間でのデータ共有

Angularでよくあるパターンは、親コンポーネントと1つ以上の子コンポーネントの間でデータを共有することです。
このパターンは `@Input()` と `@Output()` ディレクティブを使って実装することができます。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

次のような階層について考えてみます:

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

The `<parent-component>` serves as the context for the `<child-component>`.

`@Input()` and `@Output()` give a child component a way to communicate with its parent component.
`@Input()` allows a parent component to update data in the child component.
Conversely, `@Output()` allows the child to send data to a parent component.


{@a input}

## Sending data to a child component

The `@Input()` decorator in a child component or directive signifies that the property can receive its value from its parent component.

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="Input data flow diagram">
</div>

To use `@Input()`, you must configure the parent and child.

### Configuring the child component

To use the `@Input()` decorator in a child component class, first import `Input` and then decorate the property with `@Input()`, as in the following example.

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>


ここで `@Input()` が装飾しているのは `string` 型の <code class="no-auto-link">item</code> プロパティですが、`@Input()` プロパティは `number`, `string`, `boolean`, `object` など、どんな型であっても構いません。
`item` の値は親コンポーネントから来ます。

次に、子コンポーネントのテンプレートにこのように追記します:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>

### Configuring the parent component

次のステップでは、親コンポーネントのテンプレートでプロパティをバインドします。
この例では親コンポーネントのテンプレートは `app.component.html` です。

1. 子のセレクター（ここでは `<app-item-detail>`）を
親コンポーネントのテンプレートでのディレクティブとして使います。

2. [プロパティバインディング](guide/property-binding)を使い、子のプロパティを親のプロパティにバインドします。

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

3. 親コンポーネントのクラスで `currentItem` の値を与えます:

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

`@Input()` を使うことで Angular は `currentItem` の値を子に渡すので、`item` は `Television` を表示します。

次の図はこの構造を説明したものです:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="Property binding diagram">
</div>

角括弧 (`[]`) で囲まれたターゲットは、子コンポーネントで `@Input()` で装飾したプロパティです。
等号の右側にあるバインディングのソースは、親コンポーネントからネストされたコンポーネントに渡すデータです。

### Watching for `@Input()` changes

To watch for changes on an `@Input()` property, you can use `OnChanges`, one of Angular's [lifecycle hooks](guide/lifecycle-hooks).
See the [`OnChanges`](guide/lifecycle-hooks#onchanges) section of the [Lifecycle Hooks](guide/lifecycle-hooks) guide for more details and examples.

{@a output}

## Sending data to a parent component

The `@Output()` decorator in a child component or directive allows data to flow from the child to the parent.

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="Output diagram">
</div>

`@Output()` marks a property in a child component as a doorway through which data can travel from the child to the parent.

The child component uses the `@Output()` property to raise an event to notify the parent of the change.
To raise an event, an `@Output()` must have the type of `EventEmitter`, which is a class in `@angular/core` that you use to emit custom events.

The following example shows how to set up an `@Output()` in a child component that pushes data from an HTML `<input>` to an array in the parent component.

To use `@Output()`, you must configure the parent and child.

### Configuring the child component

The following example features an `<input>` where a user can enter a value and click a `<button>` that raises an event. The `EventEmitter` then relays the data to the parent component.

1. Import `Output` and `EventEmitter` in the child component class:

```js
import { Output, EventEmitter } from '@angular/core';

```

1. In the component class, decorate a property with `@Output()`.
  The following example `newItemEvent` `@Output()` has a type of `EventEmitter`, which means it's an event.

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

この宣言のそれぞれの部分を説明するとこうなります:

* `@Output()`&mdash;プロパティがデータを子から親へ伝える玄関口であることを示すデコレーター関数
* `newItemEvent`&mdash;`@Output()` の名前
* `EventEmitter<string>`&mdash;`@Output()` の型
* `new EventEmitter<string>()`&mdash;Angular に新しいイベントエミッターを作るよう指示し、そのデータの型が文字列であることを示します。型は `number` や `boolean` のようにどのような型でも指定できます。

`EventEmitter` についての詳細は [EventEmitter API ドキュメント](api/core/EventEmitter)をご覧ください。

1. 同じコンポーネントクラス内に `addNewItem()` メソッドを作ります:

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

`addNewItem()` 関数では `@Output()` の `newItemEvent`を使ってイベントを発生させ、ユーザーが `<input>`に入力した値を送出しています。

### Configuring the child's template

The child's template has two controls.
The first is an HTML `<input>` with a [template reference variable](guide/template-reference-variables) , `#newItem`, where the user types in an item name.
The `value` property of the `#newItem` variable stores what the user types into the `<input>`.

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

2つ目の要素は[イベントバインディング](guide/event-binding)がついた `<button>` です。

`(click)` イベントは子コンポーネントのクラスの `addNewItem()` メソッドにバインドされていて、
`#newItem.value` の値が何であるかを引数に取ります。

### Configuring the parent component

この例の `AppComponent` には、 `items` 配列と、その配列に項目を追加するメソッドがあります。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` メソッドは文字列として引数を取り、その文字列を `items` に追加します。

### Configuring the parent's template

1. 親のテンプレートで、親のメソッドを子のイベントにバインドします。

1. 親コンポーネントのテンプレート `app.component.html` に、子のセレクター（ここでは `<app-item-output>`）を置いてください。

<code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

  The event binding, `(newItemEvent)='addItem($event)'`, connects the event in the child, `newItemEvent`, to the method in the parent, `addItem()`.

  The `$event` contains the data that the user types into the `<input>` in the child template UI.

  To see the `@Output()` working, you can add the following to the parent's template:

```html
  <ul>
    <li *ngFor="let item of items">{{item}}</li>
  </ul>
  ```

`*ngFor` で `items` 配列の中の項目を反復しています。
子の `<input>` に値を入力してボタンをクリックすると、子はイベントを発生させ、親の `addItem()` メソッドがその値を `items` 配列に追加し、新しいアイテムを表示します。


## `@Input()` と `@Output()` を同時に使う

次に示すとおり、同じ子コンポーネントに対して `@Input()` と `@Output()` を同時に使うことができます:

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

ターゲットとなる `item` は子コンポーネントクラスの `@Input()` プロパティで、親のプロパティ `currentItem` から値を受け取ります。
delete をクリックすると、子コンポーネントはイベント `deleteRequest` を発生させます。これは親の `crossOffItem()` メソッドの引数となります。

The following diagram shows the different parts of the `@Input()` and `@Output()` on the `<app-input-output>` child component.

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="Input/Output diagram">
</div>

子のセレクターは `<app-input-output>` で、`item` と `deleteRequest` は
子コンポーネントクラスの `@Input()` と `@Output()` プロパティです。
プロパティ `currentItem` とメソッド `crossOffItem()` は、どちらも親コンポーネントクラスのものです。

banana-in-a-box 構文 `[()]` を使うことで、プロパティとイベントバインディングを合体させることができます。
詳しくは[双方向バインディング](guide/two-way-binding)をご覧ください。
