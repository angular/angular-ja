# イベントリスナーの追加

Angularは、イベント名とイベントが発生するたびに実行されるステートメントを括弧で囲むことで、テンプレート内の要素にイベントリスナーを定義することをサポートしています。

## ネイティブイベントのリスナー

HTML要素にイベントリスナーを追加する場合は、イベントを括弧 `()` で囲みます。これにより、リスナーのステートメントを指定できます。

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class AppComponent{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```

この例では、Angularは `<input>` 要素が `keyup` イベントを発行するたびに `updateField` を呼び出します。

`click`、`keydown`、`mouseover` などのネイティブイベントのリスナーを追加できます。詳細については、[MDNの要素のすべての利用可能なイベント](https://developer.mozilla.org/en-US/docs/Web/API/Element#events)をご覧ください。

## イベント引数へのアクセス

Angularは、すべてのテンプレートイベントリスナーで、イベントオブジェクトへの参照を含む `$event` という名前の変数を提供します。

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```

## キー修飾子の使用

特定のキーの特定のキーボードイベントをキャプチャする場合は、次のようなコードを記述できます。

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```

ただし、これは一般的なシナリオであるため、Angularではピリオド（`.`）文字を使用して特定のキーを指定することでイベントをフィルタリングできます。これにより、コードを簡素化できます。

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class AppComponent{
  updateField(event: KeyboardEvent): void {
    console.log('The user pressed enter in the text field.');
  }
}
```

追加のキー修飾子を追加できます。

```angular-html
<!-- Matches shift and enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

Angularは、`alt`、`control`、`meta`、`shift` の修飾子をサポートしています。

キーボードイベントにバインドするキーまたはコードを指定できます。キーとコードフィールドは、ブラウザのキーボードイベントオブジェクトのネイティブな部分です。デフォルトでは、イベントバインディングは、[キーボードイベントのキー値](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values)を使用することを前提としています。

Angularでは、組み込みの `code` サフィックスを提供することで、[キーボードイベントのコード値](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values)も指定できます。

```angular-html
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

これは、異なるオペレーティングシステム間でキーボードイベントを一貫して処理する場合に役立ちます。たとえば、MacOSデバイスでAltキーを使用する場合、`key` プロパティはAltキーで既に修飾された文字に基づいてキーを報告します。これは、Alt + Sのような組み合わせが `'ß'` の `key` 値を報告することを意味します。ただし、`code` プロパティは、生成された文字ではなく、押された物理的なまたは仮想的なボタンに対応します。

## Preventing event default behavior

If your event handler should replace the native browser behavior, you can use the event object's [`preventDefault` method](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault):

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class AppComponent{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Show overlay without updating the URL!');
  }
}
```

If the event handler statement evaluates to `false`, Angular automatically calls `preventDefault()`, similar to [native event handler attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes). *Always prefer explicitly calling `preventDefault`*, as this approach makes the code's intent obvious.
