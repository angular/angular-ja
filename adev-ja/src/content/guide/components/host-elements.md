# コンポーネントのホスト要素

TIP: このガイドでは、既に[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使用する場合は、まずこちらをお読みください。

Angularは、コンポーネントのセレクターに一致するすべてのHTML要素に対して、コンポーネントのインスタンスを作成します。
コンポーネントのセレクターに一致するDOM要素は、そのコンポーネントの**ホスト要素**です。
コンポーネントのテンプレートの内容は、ホスト要素内にレンダリングされます。

```angular-ts
// コンポーネントソース
@Component({
  selector: 'profile-photo',
  template: `
    <img src="profile-photo.jpg" alt="Your profile photo" />
  `,
})
export class ProfilePhoto {}
```

```angular-html
<!-- コンポーネントの使用 -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```angular-html
<!-- レンダリングされたDOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

上記の例では、`<profile-photo>`は`ProfilePhoto`コンポーネントのホスト要素です。

## ホスト要素へのバインディング

コンポーネントは、ホスト要素にプロパティ、属性、イベントをバインドできます。
これは、コンポーネントのテンプレート内の要素のバインディングと同じように動作しますが、
`@Component`デコレーターの`host`プロパティで定義されます。

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

## `@HostBinding`および`@HostListener`デコレーター

クラスメンバーに`@HostBinding`および`@HostListener`デコレーターを適用することにより、
ホスト要素にバインドできます。

`@HostBinding`を使用すると、ホストのプロパティと属性を、プロパティとメソッドにバインドできます。

```angular-ts
@Component({
  /* ... */
})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  getTabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener`を使用すると、ホスト要素にイベントリスナーをバインドできます。
デコレーターは、イベント名とオプションの引数の配列を受け取ります。

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

**常に`@HostBinding`と`@HostListener`よりも`host`プロパティの使用を優先してください。**
これらのデコレーターは、下位互換性のためにのみ存在します。

## バインディングの衝突

テンプレートでコンポーネントを使用する場合、そのコンポーネントインスタンスの要素にバインディングを追加できます。
コンポーネントは、同じプロパティまたは属性に対するホストバインディングを定義することもあります。

```angular-ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```angular-html
<profile-photo role="group" [id]="otherId" />
```

このような場合、以下のルールによってどの値が優先されるかが決まります。

- 両方の値が静的な場合、インスタンスバインディングが優先されます。
- 一方の値が静的で他方が動的な場合、動的な値が優先されます。
- 両方の値が動的な場合、コンポーネントのホストバインディングが優先されます。
