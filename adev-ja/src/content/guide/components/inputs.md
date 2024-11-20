# 入力プロパティによるデータの受け取り

Tip: このガイドは、既に[基本概念ガイド](essentials)を読んでいることを前提としています。Angularを初めて使用する場合は、まずそちらをお読みください。

Tip: 他のウェブフレームワークに精通している場合は、入力プロパティは_props_に似ています。

コンポーネントを使用する際に、一般的にいくつかのデータを渡したいことがあります。
コンポーネントは、**入力**を宣言することで、受け入れるデータを指定します。

<docs-code language="ts" highlight="[7]">
import {Component, input} from '@angular/core';

@Component({/*...*/})
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);
}
</docs-code>

これにより、テンプレートのプロパティにバインドできます。

```angular-html
<custom-slider [value]="50" />
```

入力にデフォルト値がある場合、TypeScriptはデフォルト値から型を推論します。

```typescript
@Component({/*...*/})
export class CustomSlider {
  // TypeScriptは、この入力が数値であると推論し、InputSignal<number>を返します。
  value = input(0);
}
```

関数のジェネリックパラメーターを指定することで、入力の型を明示的に宣言できます。

デフォルト値のない入力が設定されていない場合、その値は`undefined`になります。

```typescript
@Component({/*...*/})
export class CustomSlider {
  // `value`は設定されない可能性があるため、InputSignal<number | undefined>を生成します。
  value = input<number>();
}
```

**Angularはコンパイル時に静的に入力を記録します。**実行時に入力の追加や削除はできません。

`input`関数は、Angularコンパイラにとって特別な意味を持ちます。**`input`は、コンポーネントとディレクティブのプロパティ初期化子でのみ呼び出すことができます。**

コンポーネントクラスを拡張する場合、**入力は子クラスによって継承されます。**

**入力名は大文字と小文字が区別されます。**

## 入力の読み取り

`input`関数は`InputSignal`を返します。シグナルを呼び出すことで値を読み取ることができます。

<docs-code language="ts" highlight="[5]">
import {Component, input} from '@angular/core';

@Component({/*...*/})
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero. 
  value = input(0);

  // Create a computed expression that reads the value input
  label = computed(() => `The slider's value is ${this.value()}`); 
}
</docs-code>

`input`関数によって作成されたシグナルは読み取り専用です。

## 必須入力

`input`の代わりに`input.required`を呼び出すことで、入力が`required`であることを宣言できます。

<docs-code language="ts" highlight="[3]">
@Component({/*...*/})
export class CustomSlider {
  // Declare a required input named value. Returns an `InputSignal<number>`.
  value = input.required<number>();
}
</docs-code>

Angularは、テンプレートでコンポーネントを使用する際に、必須入力が_必ず_設定されていることを強制します。すべての必須入力を指定せずにコンポーネントを使用しようとすると、Angularはビルド時にエラーを報告します。

必須入力は、返される`InputSignal`のジェネリックパラメーターに`undefined`を自動的に含めません。

## 入力の構成

`input`関数は、入力の動作を変更できる2番目のパラメーターとしてconfigオブジェクトを受け取ります。

### 入力変換

入力がAngularによって設定されるときに、その値を変更する`transform`関数を指定できます。

<docs-code language="ts" highlight="[6]">
@Component({
  selector: 'custom-slider',
  /*...*/
})
export class CustomSlider {
  label = input('', {transform: trimString});
}

function trimString(value: string | undefined): string {
  return value?.trim() ?? '';
}
</docs-code>

```angular-html
<custom-slider [label]="systemVolume" />
```

上記の例では、`systemVolume`の値が変更されるたびに、Angularは`trimString`を実行し、`label`に結果を設定します。

入力変換の最も一般的なユースケースは、テンプレートでより広い範囲の値型を受け入れることであり、多くの場合`null`と`undefined`を含みます。

**入力変換関数は、ビルド時に静的に分析可能でなければなりません。**条件付きで、または式の評価の結果として、変換関数は設定できません。

**入力変換関数は常に[純粋関数](https://en.wikipedia.org/wiki/Pure_function)でなければなりません。**変換関数外の状態に依存すると、予期せぬ動作につながる可能性があります。

#### 型チェック

入力変換を指定すると、変換関数の引数の型によって、テンプレートで入力に設定できる値の型が決まります。

<docs-code language="ts">
@Component({/*...*/})
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
  return `${value}px`;
}
</docs-code>

上記の例では、`widthPx`入力は`number`を受け入れる一方、`InputSignal`プロパティは`string`を返します。

#### 組み込み変換

Angularには、最も一般的な2つのシナリオのための2つの組み込み変換関数が含まれています。ブール値と数値への値の強制変換です。

<docs-code language="ts">
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({/*...*/})
export class CustomSlider {
  disabled = input(false, {transform: booleanAttribute}); 
  value = input(0, {transform: numberAttribute}); 
}
</docs-code>

`booleanAttribute`は、属性の_存在_が「true」値を示す標準的なHTML[ブール属性](https://developer.mozilla.org/docs/Glossary/Boolean/HTML)の動作を模倣します。
ただし、Angularの`booleanAttribute`は、リテラル文字列`"false"`をブール値`false`として扱います。

`numberAttribute`は、与えられた値を数値として解析しようと試み、解析に失敗した場合は`NaN`を生成します。

### 入力エイリアス

`alias`オプションを指定して、テンプレートでの入力の名前を変更できます。

<docs-code language="ts" highlight="[3]">
@Component({/*...*/})
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
</docs-code>

```angular-html
<custom-slider [sliderValue]="50" />
```

このエイリアスは、TypeScriptコードでのプロパティの使用には影響しません。

一般的にコンポーネントの入力をエイリアス化することは避けるべきですが、この機能は、元の名前のエイリアスを保持しながらプロパティの名前を変更したり、ネイティブDOM要素プロパティの名前との競合を回避したりする場合に役立ちます。

## モデル入力

**モデル入力**は、コンポーネントが新しい値を親コンポーネントに伝播できるようにする特殊なタイプの入力です。

コンポーネントを作成する際に、通常の入力と同様にモデル入力を定義できます。

どちらの種類の入力も、値をプロパティにバインドすることを可能にします。しかし、**モデル入力は、コンポーネントの作者がプロパティに値を書き込むことを可能にします。**プロパティが双方向バインディングでバインドされている場合、新しい値はそのバインディングに伝播します。

```typescript
@Component({ /* ... */})
export class CustomSlider {
  // "value"という名前のモデル入力を定義します。
  value = model(0);

  increment() {
    // 新しい値でモデル入力を更新し、値をすべてのバインディングに伝播します。
    this.value.update(oldValue => oldValue + 10);
  }
}

@Component({
  /* ... */
  // 双方向バインディング構文を使用すると、スライダーの値の変更は、
  // `volume`シグナルに自動的に伝播します。
  // このバインディングは、シグナルの値ではなく、シグナルのインスタンスを使用していることに注意してください。
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // `volume`ローカル状態の書き込み可能なシグナルを作成します。
  volume = signal(0);
}
```

上記の例では、`CustomSlider`は`value`モデル入力に値を書き込むことができ、それによって`MediaControls`の`volume`シグナルに値が伝播します。このバインディングにより、`value`と`volume`の値が同期します。バインディングはシグナルの_値_ではなく、`volume`シグナルのインスタンスを渡していることに注意してください。

他の点では、モデル入力は標準入力と同様に機能します。`computed`や`effect`のようなリアクティブなコンテキスト内を含め、シグナル関数を呼び出すことで値を読み取ることができます。

テンプレートでの双方向バインディングの詳細については、[双方向バインディング](guide/templates/two-way-binding)を参照してください。

### プレーンプロパティとの双方向バインディング

プレーンなJavaScriptプロパティをモデル入力にバインドできます。

```angular-ts
@Component({
  /* ... */
  // `value`はモデル入力です。
  // 角かっこ内のかっこ記法（別名「バナナインアボックス」）は、双方向バインディングを作成します
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

上記の例では、`CustomSlider`は`checked`モデル入力に値を書き込むことができ、それによって`UserProfile`の`isAdmin`プロパティに値が伝播します。このバインディングにより、`checked`と`isAdmin`の値が同期します。

### 暗黙的な`change`イベント

コンポーネントまたはディレクティブでモデル入力を宣言すると、Angularはそのモデルに対応する[出力](guide/components/outputs)を自動的に作成します。出力の名前は、モデル入力の名前に「Change」が付いたものです。

```angular-ts
@Directive({ /* ... */ })
export class CustomCheckbox {
  // これにより、「checkedChange」という名前の出力が自動的に作成されます。
  // テンプレートで `(checkedChange)="handler()"` を使用して購読できます。
  checked = model(false);
}
```

`set`メソッドまたは`update`メソッドを呼び出すことで、モデル入力に新しい値を書き込むたびに、Angularはこの変更イベントを発生させます。

出力の詳細については、[出力によるカスタムイベント](guide/components/outputs)を参照してください。

### モデル入力のカスタマイズ

[通常の入力](guide/signals/inputs)と同様に、モデル入力を必須としてマークしたり、エイリアスを提供したりできます。

モデル入力は入力変換をサポートしません。

### モデル入力を使用する場合

コンポーネントが双方向バインディングをサポートする場合に、モデル入力を使用します。これは通常、ユーザーの操作に基づいて値を変更するためにコンポーネントが存在する場合に適しています。最も一般的には、日付ピッカーやコンボボックスなどのカスタムフォームコントロールは、主要な値にモデル入力を使用する必要があります。

# 入力名の選択

DOM要素のプロパティ（HTMLElementなど）と競合する入力名を選択することは避けてください。名前の競合は、バインドされたプロパティがコンポーネントのものであるか、DOM要素のものであるかについて混乱を招きます。

コンポーネントセレクターのように、コンポーネント入力にプレフィックスを追加することは避けてください。特定の要素は1つのコンポーネントしかホストできないため、カスタムプロパティはすべてコンポーネントに属すると見なすことができます。

# `@Input`デコレーターによる入力の宣言

Tip: Angularチームは新しいプロジェクトにはシグナルベースの`input`関数の使用を推奨していますが、元のデコレーターベースの`@Input` APIは引き続き完全にサポートされています。

コンポーネント入力を宣言する代わりに、プロパティに`@Input`デコレーターを追加できます。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input() value = 0;
}
</docs-code>

入力へのバインディングは、シグナルベースの入力とデコレーターベースの入力の両方で同じです。

```angular-html
<custom-slider [value]="50" />
```

### デコレーターベースの入力のカスタマイズ

`@Input`デコレーターは、入力の動作を変更できるconfigオブジェクトを受け取ります。

#### 必須入力

`required`オプションを指定して、特定の入力が常に値を持つ必要があることを強制できます。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
</docs-code>

すべての必須入力を指定せずにコンポーネントを使用しようとすると、Angularはビルド時にエラーを報告します。

#### 入力変換

Angularによって入力が設定されるときにその値を変更する`transform`関数を指定できます。この変換関数は、上記で説明したシグナルベースの入力の変換関数と同様に機能します。

<docs-code language="ts" highlight="[6]">
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) { return value?.trim() ?? ''; }
</docs-code>

#### 入力エイリアス

`alias`オプションを指定して、テンプレートでの入力の名前を変更できます。

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
</docs-code>

```angular-html
<custom-slider [sliderValue]="50" />
```

`@Input`デコレーターは、configオブジェクトの代わりに、エイリアスを最初のパラメーターとして受け取ります。

入力エイリアスは、上記で説明したシグナルベースの入力と同じように機能します。

### ゲッターとセッターを持つ入力

デコレーターベースの入力を使用する場合、ゲッターとセッターで実装されたプロパティを入力にできます。

<docs-code language="ts">
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

set value(newValue: number) { this.internalValue = newValue; }

private internalValue = 0; }
</docs-code>

パブリックセッターのみを定義することで、_書き込み専用_の入力を作成できます。

<docs-code language="ts">
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

private internalValue = 0; }
</docs-code>

可能な場合は、**ゲッターとセッターの代わりに入力変換を使用することをお勧めします。**

複雑なゲッターとセッター、またはコストの高いゲッターとセッターは避けてください。Angularは入力のセッターを複数回呼び出す可能性があり、セッターがDOM操作などのコストの高い処理を実行する場合、アプリケーションのパフォーマンスに悪影響を与える可能性があります。

## `@Component`デコレーターでの入力の指定

`@Input`デコレーターに加えて、`@Component`デコレーターの`inputs`プロパティを使用して、コンポーネントの入力を指定できます。これは、コンポーネントが基本クラスからプロパティを継承する場合に役立ちます。

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

文字列の後にコロンを付けてエイリアスを`inputs`リストに指定できます。

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>
