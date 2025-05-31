# `linkedSignal`による依存状態

`signal`関数は、Angularコードで状態を保持するために使用できます。この状態は、他の状態に依存することがあります。例えば、ユーザーが注文の配送方法を選択できるコンポーネントを考えてみましょう。

```typescript
@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // デフォルトで最初の配送オプションを選択します。
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}
```

この例では、`selectedOption`は最初のオプションにデフォルト設定されますが、ユーザーが別のオプションを選択すると変更されます。しかし、`shippingOptions`はシグナルであり、その値は変更される可能性があります！`shippingOptions`が変更されると、`selectedOption`はもはや有効なオプションではない値を含む可能性があります。

**`linkedSignal`関数は、本質的に他の状態に_リンク_された状態を保持するシグナルを作成できます。**上記の例を再考すると、`linkedSignal`は`signal`を置き換えることができます。

```typescript
@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // selectedOptionを最初の配送オプションに初期化します。
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

`linkedSignal`は`signal`と同様に動作しますが、重要な違いが1つあります。デフォルト値を渡す代わりに、`computed`のように*算出関数*を渡します。算出値が変更されると、`linkedSignal`の値は計算結果に変更されます。これは、`linkedSignal`が常に有効な値を持つようにするのに役立ちます。

次の例は、`linkedSignal`の値がリンクされた状態に基づいてどのように変化するかを示しています。

```typescript
const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);
console.log(selectedOption()); // 'Ground'

selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'
```

## 以前の状態を考慮する

場合によっては、`linkedSignal`の計算で`linkedSignal`の以前の値を考慮する必要があります。

上記の例では、`shippingOptions`が変更されると、`selectedOption`は常に最初のオプションに戻って更新されます。しかし、選択したオプションがリスト内にまだ存在する場合は、ユーザーの選択を維持したい場合があります。これを実現するには、別々の*ソース*と*算出*を使用して`linkedSignal`を作成できます。

```typescript
interface ShippingMethod {
  id: number;
  name: string;
}

@Component({/* ... */})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    { id: 0, name: 'Ground' },
    { id: 1, name: 'Air' },
    { id: 2, name: 'Sea' },
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // `selectedOption` is set to the `computation` result whenever this `source` changes.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // If the newOptions contain the previously selected option, preserve that selection.
      // Otherwise, default to the first option.
      return (
        newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0]
      );
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      { id: 0, name: 'Email' },
      { id: 1, name: 'Sea' },
      { id: 2, name: 'Postal Service' },
    ]);
  }
}
```

`linkedSignal`を作成する際には、算出関数だけを提供する代わりに、個別の`source`プロパティと`computation`プロパティを持つオブジェクトを渡すことができます。

`source`は、`computed`やコンポーネントの`input`などの任意のシグナルにできます。`source`の値が変更されると、`linkedSignal`は提供された`computation`の結果にその値を更新します。

`computation`は、`source`の新しい値と`previous`オブジェクトを受け取る関数です。`previous`オブジェクトには、`previous.source`（`source`の以前の値）、`previous.value`（`computation`の以前の結果）の2つのプロパティがあります。これらの以前の値を使用して、計算の新しい結果を決定できます。

HELPFUL: When using the `previous` parameter, it is necessary to provide the generic type arguments of `linkedSignal` explicitly. The first generic type corresponds with the type of `source` and the second generic type determines the output type of `computation`.  

## カスタムの等価比較

`linkedSignal`は他のシグナルと同様に、カスタムの等価比較関数を設定できます。この関数は、下流の依存関係によって`linkedSignal`の値（計算結果）が変更されたかどうかを判断するために使用されます。

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // `id`が同じであれば、ユーザーは同じとみなします。
  equal: (a, b) => a.id === b.id,
});

// または、`source`と`computation`を分ける場合
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: user => user,
  equal: (a, b) => a.id === b.id,
});
```
