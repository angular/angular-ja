# Web workers を使用したバックグラウンド処理

[Web Workers](https://developer.mozilla.org/ja/docs/Web/API/Web_Workers_API) を使用すると、CPU 集中型の計算をバックグラウンドスレッドで実行し、
メインスレッドを解放してユーザーインターフェースを更新できます。
アプリケーションが CAD 図面の生成や幾何学的な重い計算などの多くの計算を実行している場合、 Web Workers を使用すると、アプリケーションのパフォーマンスを向上させることができます。

<div class="alert is-helpful">

CLI は、Web worker での Angular 自体の実行をサポートしていません。

</div>

## Web worker を追加する

Web Worker を既存のプロジェクトに追加するには、 Angular CLI の `ng generate` コマンドを使用します。

```bash
ng generate web-worker <location>
```

アプリケーションのどこにでも Web worker を追加できます。
たとえば、ルートコンポーネント `src/app/app.component.ts` に Web worker を追加するには、次のコマンドを実行します。

```bash
ng generate web-worker app
```

このコマンドは次のアクションを実行します。

- まだ使用していない場合、 Web workers を使用するようにプロジェクトを構成します。
- 次の雛形のコードを `src/app/app.worker.ts` に追加してメッセージを受信します。

  <code-example language="typescript" header="src/app/app.worker.ts">
  addEventListener('message', ({ data }) => {
    const response = `worker response to ${data}`;
    postMessage(response);
  });
 </code-example>

- 次の雛形のコードを worker を使用するために `src/app/app.component.ts` に追加します。

  <code-example language="typescript" header="src/app/app.component.ts">
  if (typeof Worker !== 'undefined') {
    // Create a new
    const worker = new Worker(new URL('./app.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  } else {
    // Web workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
  }
  </code-example>

この初期の雛形を生成した後、 worker との間でメッセージを送受信して、 Web worker を使用するようにコードをリファクタリングする必要があります。

<div class="alert is-important">

[サーバサイドレンダリング](guide/universal) で使用される `@angular/platform-server` などの一部の環境またはプラットフォームは、 Web workers をサポートしていません。 アプリケーションがこれらの環境で確実に機能するようにするには、 worker が実行するはずの計算を実行するフォールバックメカニズムを提供する必要があります。

</div>
