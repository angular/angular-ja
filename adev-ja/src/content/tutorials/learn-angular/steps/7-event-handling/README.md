# イベント処理

イベント処理は、ウェブアプリケーションにインタラクティブな機能をもたらします。開発者として、ボタンのクリック、フォームの送信など、ユーザーの操作に応答できます。

NOTE: 詳しくは、[エッセンシャルガイドのユーザー操作の処理](/essentials/templates#handling-user-interaction)をご覧ください。

このアクティビティでは、イベントハンドラーを追加する方法を学びます。

<hr />

Angularでは、`()`という構文を使ってイベントにバインドします。特定の要素に対して、バインドしたいイベントを括弧で囲み、イベントハンドラーを設定します。この`button`の例を見てください。

```angular-ts
@Component({
    ...
    template: `<button (click)="greet()">`
})
class App {
    greet() {
        console.log('Hello, there 👋');
    }
}
```

この例では、`greet()`関数はボタンがクリックされるたびに実行されます。`greet()`の構文には、末尾に括弧が含まれていることに注意してください。

では、実際に試してみましょう。

<docs-workflow>

<docs-step title="イベントハンドラーを追加">
`App`クラスに`onMouseOver`イベントハンドラー関数を追加します。以下のコードを実装に使用します。

```ts
onMouseOver() {
    this.message = 'Way to go 🚀';
}
```

</docs-step>

<docs-step title="テンプレートイベントにバインド">
`app.t`のテンプレートコードを更新し、`section`要素の`mouseover`イベントにバインドします。

```angular-html
<section (mouseover)="onMouseOver()">
```

</docs-step>

</docs-workflow>

これで、ほんの数ステップでAngularの最初のイベントハンドラーを作成できました。うまくいっているようです。素晴らしいですね。頑張ってください。
