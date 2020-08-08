# `@Input()` と `@Output()` プロパティ

`@Input()` と `@Output()` を使うことで、
Angular は親のコンテキストと子のディレクティブやコンポーネントとの間でデータをシェアすることができます。
`@Input()` プロパティは書き込み可能である一方、`@Output()` プロパティは観測可能です。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

このような親子関係について考えてみます:

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

ここでは `<child-component>` セレクター（つまり子のディレクティブ）が、
子のコンテキストを与える `<parent-component>` に埋め込まれています。

`@Input()` と `@Output()` は、
子が親と通信できるようにするための、
子コンポーネントの API（アプリケーションプログラミングインターフェース）
として機能します。`@Input()` と `@Output()` をポートや玄関口だと考えてみましょう
&mdash;`@Input()` はデータの入り口で、コンポーネントにデータを流し込むことができます。
`@Output()` はコンポーネントからの出口で、
子コンポーネントがデータを送り出すことができます。

この `@Input()` と `@Output()` についてのセクションには <live-example name="inputs-outputs"></live-example> があります。
ここから先のサブセクションでは、サンプリアプリのキーポイントに焦点を当てていきます。

<div class="alert is-helpful">

#### `@Input()` と `@Output()` は独立 {@a input-and-output-are-independent}

`@Input()` と `@Output()` は、よく一緒にアプリに出てきますが、
別々に使うこともできます。
親にデータを送るだけのコンポーネントの場合は、
`@Input()` は要らず `@Output()` だけが必要です。逆もまた真で、
親からデータを受け取るだけの場合は `@Input()` だけが必要です。

</div>

{@a input}

## `@Input()` の使い方 {@a how-to-use-input}

子のコンポーネントやディレクティブの `@Input()` デコレーターを使えば、
そのコンポーネントのプロパティが親のコンポーネントから値を受け取るように Angular に指示できます。
データの流れは、
子コンポーネントからの視点で表現されていることを覚えておくとよいでしょう。
つまり、`@Input()` はデータを親コンポーネントから子コンポーネントに向けて _入力_ できます。


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="Input data flow diagram">
</div>

`@Input()` の使い方を説明するため、アプリのこれらの部分を書き換えていきます:

* 子コンポーネントのクラスとテンプレート
* 親コンポーネントのクラスとテンプレート


### 子コンポーネント {@a in-the-child}

子コンポーネントクラスで `@Input()` デコレーターを使うには、
まず `Input` をインポートし、プロパティを `@Input()` で装飾します:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>


ここで `@Input()` が装飾しているのは `string` 型の <code class="no-auto-link">item</code> プロパティですが、
`@Input()` プロパティは `number`, `string`, `boolean`, `object`
など、どんな型であっても構いません。次のセクションで説明しますが `item` の値は親コンポーネントから来ます。

次に、子コンポーネントのテンプレートにこのように追記します:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>



### 親コンポーネント {@a in-the-parent}

次のステップでは、親コンポーネントのテンプレートでプロパティをバインドします。
この例では親コンポーネントのテンプレートは `app.component.html` です。

最初に、子のセレクター（ここでは `<app-item-detail>`）を
親コンポーネントのテンプレートでのディレクティブとして使います。
次に[プロパティバインディング](guide/property-binding)を使い、子のプロパティを親のプロパティにバインドします。

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

次に、親コンポーネントのクラス（`app.component.ts`）で `currentItem` の値を与えます:

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

`@Input()` を使うことで Angular は `currentItem` の値を子に渡すので、`item` は `Television` を表示します。

次の図はこの構造を説明したものです:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="Property binding diagram">
</div>

角括弧 (`[]`) で囲まれたターゲットは、
子コンポーネントで `@Input()` で装飾したプロパティです。
等号の右側にあるバインディングのソースは、
親コンポーネントからネストされたコンポーネントに渡すデータです。

重要なのは、親コンポーネントから子コンポーネントのプロパティ（各カッコに囲まれた部分）にバインドするとき、
子コンポーネントのプロパティを
`@Input()` で装飾する必要があるということです。

<div class="alert is-helpful">

### `OnChanges` と `@Input()` {@a onchanges-and-input}

`@Input()` プロパティの変更を監視するには、
Angular の[ライフサイクル・フック](guide/lifecycle-hooks#onchanges) のひとつである `OnChanges` を使うことができます。
`OnChanges` は、`@Input()` デコレーターをもつプロパティを操作するように
特別に設計されています。詳細な内容や例については、[ライフサイクル・フック](guide/lifecycle-hooks)ガイドの [`OnChanges`](guide/lifecycle-hooks#onchanges) セクションをご覧ください。

</div>

{@a output}

## `@Output()` の使い方 {@a how-to-use-output}

子のコンポーネントやディレクティブで `@Output()` デコレーターを使えば、
子 _から_ 親へデータを流すことができます。

`@Output()` プロパティは、通常は Angular の [`EventEmitter`](api/core/EventEmitter) で初期化され、[イベント](guide/event-binding)として値をコンポーネントの外に流します。


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="Output diagram">
</div>

`@Input()` と同じように、子コンポーネントのプロパティに対して
`@Output()` を使うことができますが、その型は
`EventEmitter` であるべきです。

`@Output()` は、子コンポーネントのプロパティが、
データを子から親に伝える玄関口となることを示します。
子コンポーネントがイベントを発火することで、
親コンポーネントが変化に気づくことができます。イベントを発火するには、
カスタムイベントを発生させるために使う `@angular/core` のクラス
`EventEmitter` と、
`@Output()` が連動します。

`@Output()` を使うには、アプリのこれらの箇所を編集してください:

* 子コンポーネントのクラスとテンプレート
* 親コンポーネントのクラスとテンプレート


次の例では、HTML の `<input>` に入力されたデータを
親コンポーネントの配列に追加するために、
子コンポーネントで `@Output()` をどのように設定するかを示します。

<div class="alert is-helpful">

HTML 要素の `<input>` と Angular のデコレーター `@Input()` は別のものです。
このドキュメントは `@Input()` と `@Output()` に関する Angular のコンポーネント間通信に関するものです。HTML 要素の `<input>` について詳しく知るには [W3C 勧告](https://www.w3.org/TR/html5/sec-forms.html#the-input-element)をご覧ください。

</div>

## 子コンポーネント

この例では、ユーザーが `<input>` に値を入力し、`<button>` をクリックするとイベントが発生します。すると `EventEmitter` が親コンポーネントにデータを伝えます。

まず `Output` と `EventEmitter`
を子コンポーネントクラスでインポートしてください:

```js
import { Output, EventEmitter } from '@angular/core';

```

次も引き続き子コンポーネントのクラスで、プロパティを `@Output()` で装飾してください。
この例の `@Output()` は `newItemEvent` という名前になっていて、
型はイベントを意味する `EventEmitter` です。


<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

この宣言のそれぞれの部分を説明するとこうなります:

* `@Output()`&mdash;プロパティがデータを子から親へ伝える玄関口であることを示すデコレーター関数
* `newItemEvent`&mdash;`@Output()` の名前
* `EventEmitter<string>`&mdash;`@Output()` の型
* `new EventEmitter<string>()`&mdash;Angular に新しいイベントエミッターを作るよう指示し、そのデータの型が文字列であることを示します。型は `number` や `boolean` のようにどのような型でも指定できます。`EventEmitter` についての詳細は [EventEmitter API ドキュメント](api/core/EventEmitter)をご覧ください。

次に 同じコンポーネントクラス内に `addNewItem()` メソッドを作ります:

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

`addNewItem()` 関数では `@Output()` の `newItemEvent`
を使ってイベントを発生させ、ユーザーが `<input>`
に入力した値を送出しています。つまり、
ユーザーが UI の追加ボタンをクリックしたときに、
子が親にイベントを知らせ、そのデータを送ります。

### 子のテンプレート

子のテンプレートには2つのコントロールがあります。
1つ目は、ユーザーが項目名を入力する HTML の `<input>` で、
[テンプレート参照変数](guide/template-reference-variables)の `#newItem` がついています。
ユーザーが `<input>` に入力したものは何でも `#newItem` 変数に保存されます。

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

2つ目の要素は[イベントバインディング](guide/event-binding)
がついた `<button>` です。
等号の左側が括弧に囲まれた `(click)` であることから、
これがイベントバインディングであることが分かります。

`(click)` イベントは子コンポーネントのクラスの `addNewItem()` メソッドにバインドされていて、
`#newItem` の値が何であるかを引数に取ります。

これで、子コンポーネントから親にデータを送るための `@Output()` と、
イベントを発生させるメソッドができました。
次のステップは親に移ります。

## 親コンポーネント

この例では親コンポーネントは `AppComponent` ですが、
子をネストさせることができるコンポーネントであれば何でも構いません。

この例の `AppComponent` には、 `items` 配列と、
その配列に項目を追加するメソッドがあります。

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

`addItem()` メソッドは文字列として引数を取り、
その文字列を `items` に追加します。

### 親のテンプレート

次に、親のテンプレートで、
親のメソッドを子のイベントにバインドします。
親コンポーネントのテンプレート `app.component.html` に、
子のセレクター（ここでは `<app-item-output>`）を置いてください。

<code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

イベントバインディング `(newItemEvent)='addItem($event)'` は、
子のイベント `newItemEvent` を
親のメソッド `addItem()` につなぎ、
子から親に伝えるイベントが `addItem()` の引数となるよう、Angular に指示します。
つまり、ここでデータの受け渡しが行われています。
`$event` は、子のテンプレート UI でユーザーが
`<input>` に入力したデータを持っています。

ここで、`@Output()` が動作していることを確認するために次のコードを親のテンプレートに足してみましょう:

```html
  <ul>
    <li *ngFor="let item of items">{{item}}</li>
  </ul>
  ```

`*ngFor` で `items` 配列の中の項目を反復しています。子の `<input>` に値を入力してボタンをクリックすると、子はイベントを発生させ、親の `addItem()` メソッドがその値を `items` 配列に追加し、それを表示します。


## `@Input()` と `@Output()` を同時に使う

次に示すとおり、同じ子コンポーネントに対して `@Input()` と `@Output()` を同時に使うことができます:

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

ターゲットとなる `item` は子コンポーネントクラスの `@Input()` プロパティで、親のプロパティ `currentItem` から値を受け取ります。delete をクリックすると、子コンポーネントはイベント `deleteRequest` を発生させます。これは親の `crossOffItem()` メソッドの引数となります。

次の図は、同じ子コンポーネントの `@Input()` と `@Output()` の図で、
それぞれの違いを示しています:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="Input/Output diagram">
</div>

図が示すように、入力と出力を同時に使うのは、個別に使うのと同じことです。ここで、子のセレクターは `<app-input-output>` で、`item` と `deleteRequest` は子コンポーネントクラスの `@Input()` と `@Output()` プロパティです。
プロパティ `currentItem` とメソッド `crossOffItem()` は、どちらも親コンポーネントクラスのものです。

banana-in-a-box 構文 `[()]` を使うことで、プロパティとイベントバインディングを合体させることができます。
詳しくは[双方向バインディング](guide/two-way-binding)をご覧ください。

## `@Input()` と `@Output()` の宣言

入力と出力を宣言するとき、
`@Input()` や `@Output()` デコレーターの代わりに、
この例で示すようにディレクティブメタデータの
`inputs` と `outputs` 配列で指定することもできます:

<code-example path="inputs-outputs/src/app/in-the-metadata/in-the-metadata.component.ts" region="metadata" header="src/app/in-the-metadata/in-the-metadata.component.ts"></code-example>

`@Directive` と `@Component` のメタデータで
`inputs` と `outputs` を宣言することは可能ですが、
次のように `@Input()` と `@Output()` デコレーターを使うのがよいプラクティスです:

<code-example path="inputs-outputs/src/app/input-output/input-output.component.ts" region="input-output" header="src/app/input-output/input-output.component.ts"></code-example>

詳しくは[スタイルガイド](guide/styleguide)の
[インプットとアウトプットのプロパティを修飾しましょう](guide/styleguide#decorate-input-and-output-properties)セクションをご覧ください。



<div class="alert is-helpful">

入力や出力を使おうとしたときに、
プロパティが存在するはずなのにテンプレートパースエラーが発生した場合は、
プロパティに `@Input()` / `@Output()` が付いているか、
`inputs`/`outputs` 配列で宣言されていることを再確認してください:

<code-example language="bash">
Uncaught Error: Template parse errors:
Can't bind to 'item' since it isn't a known property of 'app-item-detail'
</code-example>

</div>

{@a aliasing-io}

## 入出力のエイリアス

時々、インプット/アウトプットのパブリックな名前を、内部の名前とは異なるものにすべき場合があります。ベストプラクティスとしてはそうすべきではないのですが、
Angular はその方法を用意しています。

### メタデータでのエイリアス

メタデータの入力と出力でエイリアスを指定するには、コロン区切り (`:`)
でプロパティ名を左に、パブリックな別名を右に書いた文字列を指定します。

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias" header="src/app/aliasing/aliasing.component.ts"></code-example>


### `@Input()`/`@Output()` デコレーターでのエイリアス

`@Input()`/`@Output()` デコレーターにエイリアスの名前を与えることで、プロパティ名にエイリアスを指定することができます。内部の名前はそのまま残ります。

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias-input-output" header="src/app/aliasing/aliasing.component.ts"></code-example>
