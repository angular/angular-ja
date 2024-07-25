# 入力プロパティでデータを受け取る

Tip: このガイドは、[基本概念のガイド](essentials) を既読していることを前提としています。Angularを初めて使う場合は、まずそちらをお読みください。

Tip: 他のウェブフレームワークに精通している場合は、入力プロパティは*props*に似ています。

コンポーネントを作成する際、特定のクラスプロパティに `@Input` デコレーターを追加することで、そのプロパティを **バインド可能** にできます。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input() value = 0;
}
</docs-code>

これにより、テンプレートでプロパティにバインドできます。

```angular-html
<custom-slider [value]="50" />
```

Angularは、`@Input` デコレーターでマークされたプロパティを **入力** と呼びます。コンポーネントを使用する際、入力に値を設定することでコンポーネントにデータを渡します。

**Angular はコンパイル時に静的に入力を記録します。** 入力は、実行時に追加または削除はできません。

コンポーネントクラスを拡張する場合、**入力は子クラスによって継承されます。**

**入力名は、大文字と小文字が区別されます。**

## 入力のカスタマイズ

`@Input` デコレーターは、入力の動作を変更できる設定オブジェクトを受け取ります。

### 必須入力

`required` オプションを指定することで、特定の入力に常に値が設定されていることを強制できます。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
</docs-code>

必須入力をすべて指定せずにコンポーネントを使用しようとすると、Angularはビルド時にエラーを報告します。

### 入力変換

`transform` 関数を指定することで、Angularによって入力値が設定されるときに、入力値を変更できます。

<docs-code language="ts" highlight="[6]">
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) {
  return value?.trim() ?? '';
}
</docs-code>

```angular-html
<custom-slider [label]="systemVolume" />
```

上記の例では、`systemVolume` の値が変更されるたびに、Angularは `trimString` を実行し、`label` に結果を設定します。

入力変換の最も一般的なユースケースは、テンプレートでより幅広い値の種類（多くの場合、`null` や `undefined` を含む）を受け入れることです。

**入力変換の関数は、ビルド時に静的に解析可能である必要があります。** 変換関数を条件付きで設定したり、式評価の結果として設定したりできません。

**入力変換の関数は、常に [純粋関数](https://en.wikipedia.org/wiki/Pure_function) である必要があります。** 変換関数の外の状態に依存すると、予期しない動作につながる可能性があります。

#### 型チェック

入力変換を指定すると、変換関数のパラメーターの型によって、テンプレートで入力に設定できる値の型が決まります。

<docs-code language="ts">
@Component({...})
export class CustomSlider {
  @Input({transform: appendPx}) widthPx: string = '';
}

function appendPx(value: number) {
  return `${value}px`;
}
</docs-code>

上記の例では、`widthPx` 入力値は `number` を受け取りますが、クラスのプロパティは `string` です。

#### 組み込み変換

Angularには、最も一般的な2つのシナリオに対応する2つの組み込み変換関数が含まれています。ブール値と数値への値の強制変換です。

<docs-code language="ts">
import {Component, Input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({...})
export class CustomSlider {
  @Input({transform: booleanAttribute}) disabled = false;
  @Input({transform: numberAttribute}) number = 0;
}
</docs-code>

`booleanAttribute` は、標準のHTML [ブール属性](https://developer.mozilla.org/docs/Glossary/Boolean/HTML) の動作を模倣します。
属性の存在は "true" 値を示します。ただし、Angularの `booleanAttribute` は、リテラル文字列 `"false"` をブール値 `false` として扱います。

`numberAttribute` は、指定された値を数値に解析しようとします。解析に失敗すると、`NaN` を生成します。

### 入力エイリアス

`alias` オプションを指定することで、テンプレートでの入力の名前を変更できます。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
</docs-code>

```angular-html
<custom-slider [sliderValue]="50" />
```

このエイリアスは、TypeScriptコードでのプロパティの使用には影響しません。

一般的にコンポーネントの入力にエイリアスを使用することは避けるべきですが、この機能はプロパティの名前を変更しながら元の名前のエイリアスを保持する場合や、ネイティブDOM要素プロパティの名前との衝突を避ける場合に役立ちます。

`@Input` デコレーターは、設定オブジェクトの代わりにエイリアスを最初の引数として受け取ります。

## ゲッターとセッターを使用した入力

ゲッターとセッターを使用して実装されたプロパティは、入力にできます。

<docs-code language="ts">
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
</docs-code>

公開セッターのみを定義することで、*書き込み専用*の入力を作成できます。

<docs-code language="ts">
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
</docs-code>

可能な場合は、ゲッターとセッターの代わりに <span style="text-decoration:underline;">入力変換</span> を使用することをお勧めします。

複雑なゲッターやセッターは避けてください。Angularは、入力のセッターを複数回呼び出す場合があります。セッターがDOM操作などのコストのかかる動作をする場合、アプリケーションのパフォーマンスに悪影響を及ぼす可能性があります。

## `@Component` デコレーターで入力を指定する

`@Input` デコレーターに加えて、`@Component` デコレーターの `inputs` プロパティでコンポーネントの入力を指定できます。これは、コンポーネントが基本クラスからプロパティを継承する場合に役立ちます。

<docs-code language="ts" highlight="[4]">
// `CustomSlider` は、`BaseSlider` から `disabled` プロパティを継承します。
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

さらに、`inputs` リストで入力エイリアスを指定できます。エイリアスをコロンの後に文字列に記述します。

<docs-code language="ts" highlight="[4]">
// `CustomSlider` は、`BaseSlider` から `disabled` プロパティを継承します。
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

## 入力名の選択

DOM要素（HTMLElementなど）のプロパティと衝突する入力名は避けてください。名前の衝突は、バインドされたプロパティがコンポーネントに属しているのか、DOM要素に属しているのか混乱を生じさせます。

コンポーネントセレクターのように、コンポーネント入力にプレフィックスを追加することは避けてください。特定の要素は、1つのコンポーネントしかホストできないため、カスタムプロパティはすべてコンポーネントに属すると見なすことができます。
