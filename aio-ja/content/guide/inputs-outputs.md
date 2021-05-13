# ディレクティブとコンポーネントの親子間でのデータ共有

Angularでよくあるパターンは、親コンポーネントと1つ以上の子コンポーネントの間でデータを共有することです。
このパターンは `@Input()` と `@Output()` ディレクティブを使って実装することができます。

<div class="alert is-helpful">

このガイドのコードスニペットを含む動作例については <live-example></live-example> を参照しましょう。

</div>

次のような階層について考えてみます:

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

`<parent-component>`は `<child-component>`のためのコンテキストとして機能します。

`@Input()`と`@Output()`は、子コンポーネントにその親コンポーネントと通信する方法を提供します。
`@Input()`を使用して、親コンポーネントは子コンポーネントのデータを更新できます。
逆に、`@Output()`を使用して、子は親コンポーネントにデータを送信できます。


{@a input}

## 子コンポーネントへのデータの送信

子のコンポーネントやディレクティブにおける`@Input()`デコレーターは、プロパティがその親コンポーネントから値を受け取れることを示します。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="Input data flow diagram of data flowing from parent to child">
</div>

`@Input()`を使用するには、親と子を設定する必要があります。

### 子コンポーネントの設定 {@a configuring-the-child-component}

子コンポーネントクラスで`@Input()`デコレーターを使用するには、次の例のように、最初に`Input`をインポートしてから、プロパティを`@Input()`でデコレートします。

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>


ここで `@Input()` が装飾しているのは `string` 型の <code class="no-auto-link">item</code> プロパティですが、`@Input()` プロパティは `number`, `string`, `boolean`, `object` など、どんな型であっても構いません。
`item` の値は親コンポーネントから来ます。

次に、子コンポーネントのテンプレートにこのように追記します:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>

### 親コンポーネントの設定 {@a configuring-the-parent-component}

次のステップでは、親コンポーネントのテンプレートでプロパティをバインドします。
この例では親コンポーネントのテンプレートは `app.component.html` です。

1. 子のセレクター（ここでは `<app-item-detail>`）を
親コンポーネントのテンプレートでのディレクティブとして使います。

2. [プロパティバインディング](guide/property-binding)を使い、子の`item`プロパティを親の`currentItem`プロパティにバインドします。

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

3. 親コンポーネントのクラスで `currentItem` の値を与えます:

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

`@Input()` を使うことで Angular は `currentItem` の値を子に渡すので、`item` は `Television` を表示します。

次の図はこの構造を説明したものです:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="Property binding diagram of the target, item, in square brackets set to the source, currentItem, on the right of an equal sign">
</div>

角括弧 (`[]`) で囲まれたターゲットは、子コンポーネントで `@Input()` で装飾したプロパティです。
等号の右側にあるバインディングのソースは、親コンポーネントからネストされたコンポーネントに渡すデータです。

### `@Input()`の変更を監視する {@a watching-for-input-changes}

`@Input()`プロパティの変更を監視するには、`OnChanges`を使用します。Angularの[ライフサイクルフック](guide/lifecycle-hooks)の1つです。
詳細と例については、[ライフサイクルフック](guide/lifecycle-hooks)の[`OnChanges`](guide/lifecycle-hooks#onchanges)セクションを参照しましょう。

{@a output}

## 親コンポーネントへのデータの送信

子のコンポーネントやディレクティブにおける`@Output()`デコレーターを使用すると、データを子から親に流すことができます。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="Output diagram of the data flow going from child to parent">
</div>

`@Output()`は、子コンポーネントのプロパティを、データが子から親に移動できる出入り口としてマークします。

子コンポーネントは`@Output()`プロパティを使用して、親に変更を通知するイベントを発生させます。
イベントを発生させるには、`@Output()`が`EventEmitter`の型をもつ必要があります。それは`@angular/core`のクラスであり、カスタムイベントを発行するために使用します。

以降の例は、HTMLの`<input>`から親コンポーネントの配列にデータをプッシュする、子コンポーネントに`@Output()`を設定する方法を示しています。

`@Output()`を使用するには、親と子を設定する必要があります。

### 子コンポーネントの設定 {@a configuring-the-child-component-1}

以降の例は`<input>`を特徴としていて、そこでユーザーは値を入力でき、イベントを発生させる`<button>`をクリックできます。それから`EventEmitter`はそのデータを親コンポーネントに転送します。

1. 子コンポーネントクラスに`Output`と`EventEmitter`をインポートします:

  ```js
  import { Output, EventEmitter } from '@angular/core';

  ```

1. コンポーネントクラスで、プロパティを`@Output()`でデコレートします。
  次の例の`newItemEvent`は`@Output()`が`EventEmitter`の型をもっていて、それがイベントであることを意味します。

  <code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

  この宣言のそれぞれの部分を説明するとこうなります:

    * `@Output()`: データを子から親に移動するための方法としてプロパティをマークするデコレーター関数
    * `newItemEvent`: `@Output()`の名前
    * `EventEmitter<string>`: `@Output()`の型
    * `new EventEmitter<string>()`: 新しいイベントを作ってその発行するデータの型が文字列であることをAngularに指示します

  `EventEmitter` についての詳細は [EventEmitter API ドキュメント](api/core/EventEmitter)をご覧ください。

1. 同じコンポーネントクラス内に `addNewItem()` メソッドを作ります:

  <code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

  `addNewItem()`関数は、`@Output()`の`newItemEvent`を使用して、ユーザーが`<input>`に入力した値をもつイベントを発生させます。

### 子テンプレートの設定 {@a configuring-the-childs-template}

子のテンプレートには2つのコントロールがあります。
1つ目は、[テンプレート参照変数](guide/template-reference-variables)の`#newItem`をもつHTMLの`<input>`で、そこにユーザーはアイテム名を入力します。
`#newItem`変数の`value`プロパティは、ユーザーが`<input>`に入力した内容を格納します。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

2つ目の要素は、[イベントバインディング](guide/event-binding)の`click`をもつ`<button>`です。

`(click)`イベントは、子コンポーネントクラスの`addNewItem()`メソッドにバインドされます。
`addNewItem()`メソッドは、引数として`#newItem.value`プロパティの値を取ります。

### 親コンポーネントの設定 {@a configuring-the-parent-component-1}

この例の `AppComponent` には、 `items` 配列と、その配列に項目を追加するメソッドがあります。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` メソッドは文字列として引数を取り、その文字列を `items` に追加します。

### 親テンプレートの設定 {@a configuring-the-parents-template}

1. 親のテンプレートで、親のメソッドを子のイベントにバインドします。

1. 親コンポーネントのテンプレート `app.component.html` に、子のセレクター（ここでは `<app-item-output>`）を置いてください。

  <code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

  イベントバインディングの`(newItemEvent)='addItem($event)'`は、子のイベント`newItemEvent`を親のメソッド`addItem()`に接続します。

  `$event`には、ユーザーが子テンプレートUIの`<input>`に入力するデータが含まれています。

  `@Output()`が機能していることを確認するには、親のテンプレートに以降を追加します:

  ```html
    <ul>
      <li *ngFor="let item of items">{{item}}</li>
    </ul>
  ```

  `*ngFor` で `items` 配列の中の項目を反復しています。
  子の `<input>` に値を入力してボタンをクリックすると、子はイベントを発生させ、親の `addItem()` メソッドがその値を `items` 配列に追加し、新しいアイテムを表示します。


## `@Input()` と `@Output()` を同時に使う {@a using-input-and-output-together}

次に示すとおり、同じ子コンポーネントに対して `@Input()` と `@Output()` を同時に使うことができます:

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

ターゲットとなる `item` は子コンポーネントクラスの `@Input()` プロパティで、親のプロパティ `currentItem` から値を受け取ります。
delete をクリックすると、子コンポーネントはイベント `deleteRequest` を発生させます。これは親の `crossOffItem()` メソッドの引数となります。

次の図は、子コンポーネント`<app-input-output>`上の`@Input()`と`@Output()`のさまざまな部分を示しています。

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="Diagram of an input target and an output target each bound to a source.">
</div>

子のセレクターは `<app-input-output>` で、`item` と `deleteRequest` は
子コンポーネントクラスの `@Input()` と `@Output()` プロパティです。
プロパティ `currentItem` とメソッド `crossOffItem()` は、どちらも親コンポーネントクラスのものです。

banana-in-a-box 構文 `[()]` を使うことで、プロパティとイベントバインディングを合体させることができます。
詳しくは[双方向バインディング](guide/two-way-binding)をご覧ください。
