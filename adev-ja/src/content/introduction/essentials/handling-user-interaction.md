<docs-decorative-header title="ユーザーインタラクションの処理" imgSrc="adev/src/assets/images/overview.svg"> <!-- markdownlint-disable-line -->
アプリケーション中でユーザーインタラクションを処理します。
</docs-decorative-header>

ユーザーインタラクションを処理し、それを使って作業することは、動的なアプリケーションを構築する上で重要な側面の1つです。このガイドでは、単純なユーザーインタラクションであるイベント処理について説明します。

## イベント処理

要素にイベントハンドラーを追加するには、次の手順に従います。

1. イベント名を含む属性を括弧内に追加する。
2. イベントが発生したときに実行するJavaScript文を指定する。

```angular-html
<button (click)="save()">保存</button>
```

たとえば、`click`イベントが発生したときに`transformText`関数を呼び出すボタンを作成する場合は、次のようになります。

```ts
// text-transformer.component.ts
@Component({
  standalone: true,
  selector: 'text-transformer',
  template: `
    <p>{{ announcement }}</p>
    <button (click)="transformText()">アブラカダブラ！</button>
  `,
})
export class TextTransformer {
  announcement = 'Hello again Angular!';

  transformText() {
    this.announcement = this.announcement.toUpperCase();
  }
}
```

その他の一般的なイベントリスナーの例を次に示します。

- `<input (keyup)="validateInput()" />`
- `<input (keydown)="updateInput()" />`

### $event

[イベント](https://developer.mozilla.org/ja/docs/Web/API/Event)オブジェクトにアクセスする必要がある場合、Angularは関数に渡すことができる暗黙の`$event`変数を提供します。

```angular-html
<button (click)="createUser($event)">送信</button>
```

## 次のステップ

<docs-pill-row>
  <docs-pill title="ロジックの共通化" href="essentials/sharing-logic" />
</docs-pill-row>
