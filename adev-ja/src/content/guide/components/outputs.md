# カスタムイベントと出力

Tip: このガイドは、[基本概念のガイド](essentials) を既読していることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

Angularコンポーネントは、`output`関数にプロパティを割り当てることでカスタムイベントを定義できます。

<docs-code language="ts" highlight="3">
@Component({/*...*/})
export class ExpandablePanel {
  panelClosed = output<void>();
}
</docs-code>

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

`output`関数は`OutputEmitterRef`を返します。`OutputEmitterRef`の`emit`メソッドを呼び出すことで、イベントを発生させることができます。

<docs-code language="ts" highlight="">
  this.panelClosed.emit();
</docs-code>

Angularでは、`output`関数で初期化されたプロパティを**出力**と呼びます。出力を使用すると、`click`などのネイティブブラウザイベントと同様に、カスタムイベントを発生させることができます。

**Angular カスタムイベントは DOM を伝播しません。**

**出力名は、大文字と小文字が区別されます。**

コンポーネントクラスを拡張する場合、**outputsは子クラスによって継承されます。**

`output`関数は、Angularコンパイラにとって特別な意味を持ちます。**`output`は、コンポーネントとディレクティブのプロパティ初期化子でのみ呼び出すことができます。**

## イベントデータの送出

`emit`を呼び出す際に、イベントデータを渡すことができます。

<docs-code language="ts" highlight="">
// プリミティブ値を送出できます。
this.valueChanged.emit(7);

// カスタムイベントオブジェクトを送出できます
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
</docs-code>

テンプレートでイベントリスナーを定義する場合、`$event`変数からイベントデータにアクセスできます。

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

## 出力名のカスタマイズ

`output`関数は、テンプレートでイベントに異なる名前を指定できるパラメーターを受け入れます。

<docs-code language="ts" highlight="">
@Component({/*...*/})
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
</docs-code>

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

このエイリアスは、TypeScriptコードでのプロパティの使用には影響しません。

一般的に、コンポーネントの出力のエイリアスは避けるべきですが、この機能は元の名前のエイリアスを保持しながらプロパティの名前を変更する場合や、ネイティブDOMイベントの名前との衝突を避ける場合に役立ちます。

## プログラムによる出力の購読

コンポーネントを動的に作成する場合は、コンポーネントインスタンスから出力イベントをプログラムで購読できます。
`OutputRef`型には`subscribe`メソッドが含まれています。

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});
```

Angularは、サブスクライバーを持つコンポーネントを破棄するときに、イベントサブスクリプションを自動的にクリーンアップします。または、イベントから手動で購読解除できます。`subscribe`関数は、`unsubscribe`メソッドを持つ`OutputRefSubscription`を返します。

```typescript
const eventSubscription = someComponent.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## イベント名の選択

HTMLElementなどのDOM要素のイベントと衝突する出力名を選択することは避けてください。名前の衝突は、バインドされたプロパティがコンポーネントのものであるか、DOM要素のものであるかについて混乱を招きます。

コンポーネントセレクターのように、コンポーネント出力にプレフィックスを追加することは避けてください。特定の要素は1つのコンポーネントしかホストできないため、カスタムプロパティはすべてコンポーネントに属すると見なすことができます。

常に[camelCase](https://en.wikipedia.org/wiki/Camel_case)出力名を使用してください。「on」で始まる出力名は避けてください。

## RxJSを使用したoutputs

outputsとRxJSの相互運用性については、[RxJS interop with component and directive outputs](ecosystem/rxjs-interop/output-interop)を参照してください。

## `@Output`デコレーターを使用した出力の宣言

Tip: Angularチームは新規プロジェクトでは`output`関数の使用を推奨していますが、
元のデコレーターベースの`@Output`APIは引き続き完全にサポートされています。

代替として、新しい`EventEmitter`にプロパティを割り当て、`@Output`デコレーターを追加することで、カスタムイベントを定義できます。

<docs-code language="ts" highlight="">
@Component({/*...*/})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
</docs-code>

`EventEmitter`の`emit`メソッドを呼び出すことで、イベントを発生させることができます。

### `@Output`デコレーターを使用したエイリアス

`@Output`デコレーターは、テンプレートでイベントに異なる名前を指定できるパラメーターを受け入れます。

<docs-code language="ts" highlight="">
@Component({/*...*/})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
</docs-code>

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

このエイリアスは、TypeScriptコードでのプロパティの使用には影響しません。

## `@Component`デコレーターでの出力の指定

`@Output`デコレーターに加えて、`@Component`デコレーターの`outputs`プロパティを使用して、コンポーネントの出力を指定できます。これは、コンポーネントが基底クラスからプロパティを継承する場合に役立ちます。

<docs-code language="ts" highlight="">
// `CustomSlider`は`BaseSlider`から`valueChanged`プロパティを継承します。
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>

`outputs`リストにエイリアスも指定できます。エイリアスは文字列の後にコロンを付けて記述します。

<docs-code language="ts" highlight="">
// `CustomSlider`は`BaseSlider`から`valueChanged`プロパティを継承します。
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
</docs-code>
