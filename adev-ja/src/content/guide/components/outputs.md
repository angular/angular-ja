# カスタムイベントと出力

Tip: このガイドは、[基本概念のガイド](essentials) を既読していることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

Angularコンポーネントは、新しい `EventEmitter` にプロパティを割り当てて `@Output` デコレーターを追加することで、カスタムイベントを定義できます。

<docs-code language="ts" highlight="">
@Component({...})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
</docs-code>

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

`EventEmitter` の `emit` メソッドを呼び出すことで、イベントを送信できます。

<docs-code language="ts" highlight="">
  this.panelClosed.emit();
</docs-code>

Angularは、`@Output` デコレーターでマークされたプロパティを**出力**と呼びます。出力を使用して、`click` のようなネイティブブラウザイベントと同様に、他のコンポーネントにデータを渡すことができます。

**Angular カスタムイベントは DOM を伝播しません。**

**出力名は、大文字と小文字が区別されます。**

コンポーネントクラスを拡張する場合、**出力は子クラスによって継承されます。**

## イベントデータの送信

`emit` を呼び出す際にイベントデータを渡すことができます。

<docs-code language="ts" highlight="">
// プリミティブ値を送信できます。
this.valueChanged.emit(7);

// カスタムイベントオブジェクトを送信できます
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
</docs-code>

テンプレートでイベントリスナーを定義する場合、`$event` 変数からイベントデータにアクセスできます。

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

## 出力名のカスタマイズ

`@Output` デコレーターは、テンプレートでイベントに異なる名前を指定できるパラメータを受け取ります。

<docs-code language="ts" highlight="">
@Component({...})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
</docs-code>

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

このエイリアスは、TypeScriptコードでのプロパティの使用には影響しません。

コンポーネントの出力のエイリアスは一般的に避けるべきですが、この機能は、元の名前のエイリアスを保持しながらプロパティの名前を変更したり、ネイティブDOMイベントの名前との衝突を回避したりするのに役立ちます。

## `@Component` デコレーターで出力名を指定する

`@Output` デコレーターに加えて、`@Component` デコレーターの `outputs` プロパティを使用して、コンポーネントの出力名を指定できます。これは、コンポーネントが基本クラスからプロパティを継承する場合に役立ちます。

<docs-code language="ts" highlight="">
// `CustomSlider` は、`BaseSlider` から `valueChanged` プロパティを継承します。
@Component({
  ...,
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

さらに、`outputs` リストでコロンの後にエイリアスを置くことで、出力のエイリアスを指定できます。

<docs-code language="ts" highlight="">
// `CustomSlider` は、`BaseSlider` から `valueChanged` プロパティを継承します。
@Component({
  ...,
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

## イベント名の選択

`HTMLElement` などのDOM要素のイベントと衝突する出力名を選ぶことは避けてください。名前が衝突すると、バインドされているプロパティがコンポーネントに属しているのか、DOM要素に属しているのかがわかりにくくなります。

コンポーネントセレクターのように、コンポーネント出力にプレフィックスを追加することは避けてください。特定の要素には、1つのコンポーネントしかホストできないため、カスタムプロパティはすべてコンポーネントに属していると見なすことができます。

出力名には常に[キャメルケース](https://en.wikipedia.org/wiki/Camel_case)を使用してください。出力名の前に「on」を付けることは避けてください。
