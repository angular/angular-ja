# 継承

Tip: このガイドは、すでに[基本概念のガイド](essentials)を読んだことを前提としています。Angular初心者の方は、最初にそちらをお読みください。

AngularコンポーネントはTypeScriptクラスであり、
標準のJavaScript継承セマンティクスに従います。

コンポーネントは、任意の基底クラスを拡張できます。

```ts
export class ListboxBase {
  value: string;
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  // CustomListboxは`value`プロパティを継承します。
}
```

## 他のコンポーネントとディレクティブの拡張

コンポーネントが別のコンポーネントまたはディレクティブを拡張する場合、基底クラスのデコレーターで定義されたすべてのメタデータと、基底クラスのデコレートされたメンバーを継承します。
これには、セレクター、テンプレート、スタイル、ホストバインディング、入力、出力、ライフサイクルメソッド、
およびその他の設定が含まれます。

```ts
@Component({
  selector: 'base-listbox',
  template: `
    ...
  `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  @Input() value: string;
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: `
    ...
  `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  @Input() disabled = false;
  focusActiveOption() {
    /* ... */
  }
}
```

上記の例では、`CustomListbox`は`ListboxBase`に関連付けられたすべての情報を継承し、
セレクターとテンプレートを独自の値で上書きしています。
`CustomListbox`には2つの入力(`value`や`disabled`)と、2つのイベントリスナー(`keydown`や`click`)があります。

子クラスは、最終的にすべての祖先クラスの入力、出力、ホストバインディング、
および独自の入力、出力、ホストバインディングの_ユニオン_を持ちます。

### 注入された依存性の転送

基底クラスが依存性の注入に依存している場合、
子クラスはこれらの依存性を明示的に`super`に渡す必要があります。

```ts
@Component({ ... })
export class ListboxBase {
  constructor(private element: ElementRef) { }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### ライフサイクルメソッドのオーバーライド

基底クラスが`ngOnInit`などのライフサイクルメソッドを定義する場合、
`ngOnInit`も実装する子クラスは、基底クラスの実装を*上書き*します。
基底クラスのライフサイクルメソッドを保持したい場合は、`super`で明示的にメソッドを呼び出します。

```ts
@Component({ ... })
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```
