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

## イベントのデフォルト動作の防止 {#preventing-event-default-behavior}

イベントハンドラーがネイティブのブラウザ動作を置き換える必要がある場合は、イベントオブジェクトの [`preventDefault` メソッド](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)を使用できます。

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

イベントハンドラーのステートメントが `false` と評価された場合、Angularは自動的に `preventDefault()` を呼び出します。これは、[ネイティブのイベントハンドラー属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes)と同様です。_常に明示的に `preventDefault` を呼び出すことを推奨します_。このアプローチによって、コードの意図が明確になります。

## イベント処理の拡張 {#extend-event-handling}

Angularのイベントシステムは、`EVENT_MANAGER_PLUGINS` インジェクショントークンで登録されたカスタムイベントプラグインを介して拡張可能です。

### Event Pluginの実装 {#implementing-event-plugin}

カスタムイベントプラグインを作成するには、`EventManagerPlugin` クラスを拡張し、必要なメソッドを実装します。

```ts
import { Injectable } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define which events this plugin supports
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Handle the event registration
  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ) {
    // Parse the event: e.g., "click.debounce.500"
    // event: "click", delay: 500
    const [event, method , delay = 300 ] = eventName.split('.');

    let timeoutId: number;

    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
          handler(event);
      }, delay);
    };

    element.addEventListener(event, listener);

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

アプリケーションのプロバイダーで `EVENT_MANAGER_PLUGINS` トークンを使用してカスタムプラグインを登録します。

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DebounceEventPlugin } from './debounce-event-plugin';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true
    }
  ]
});
```

登録後、テンプレート内でカスタムイベント構文を使用できます。`host` プロパティでも使用できます。

```angular-ts
@Component({
  template: `
    <input
      type="text"
      (input.debounce.500)="onSearch($event.target.value)"
      placeholder="Search..."
    />
  `,
  ...
})
export class Search {
 onSearch(query: string): void {
    console.log('Searching for:', query);
  }
}
```

```ts
@Component({
  ...,
  host: {
    '(click.debounce.500)': 'handleDebouncedClick()',
  },
})
export class AwesomeCard {
  handleDebouncedClick(): void {
   console.log('Debounced click!');
  }
}
```
