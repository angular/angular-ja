# Angular CLI での Web Worker の使用

[Web Worker](https://developer.mozilla.org/ja/docs/Web/API/Web_Workers_API) を使用すると、CPU を集中的に使用する計算をバックグラウンドスレッドで実行し、メインスレッドを解放してユーザーインターフェースを更新できます。

データの処理中にアプリケーションが応答しなくなった場合は、Web Worker を使用すると役立ちます。

## Web Worker を追加する

アプリケーションのどこにでも Web Worker を追加できます。処理負荷の高い計算を含むファイルが `src/app/app.component.ts` の場合、`ng generate web-worker app` を使用して Web Worker を追加できます。

このコマンドを実行すると:

- Web Worker がまだ使用されていない場合は、使用するようにプロジェクトを構成します
- `src/app/app.worker.ts` に雛形のコードを追加してメッセージを受信します:

  ```typescript
  addEventListener('message', ({ data }) => {
    const response = `worker response to ${data}`;
    postMessage(response);
  });
  ```

- Worker を使用するために、雛形のコードを `src/app/app.component.ts` に追加します:

  ```typescript
  if (typeof Worker !== 'undefined') {
    // 新しく作成します
    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  } else {
    // この環境では Web Worker はサポートされていません。
    // プログラムが引き続き正しく実行されるように、フォールバックを追加する必要があります。
  }
  ```

最初のスキャフォールディングの後、メッセージをやり取りして Web Worker を使用するようにコードをリファクタリングする必要があります。

## 注意事項

Angular プロジェクトで Web Worker を使用する際には、2つの重要な注意事項があります:

- [サーバサイドレンダリング](guide/universal) で使用される `@angular/platform-server` のような一部の環境またはプラットフォームは、Web Worker をサポートしません。これらの環境でアプリケーションが動作することを保証するために、Worker が実行するはずの計算を実行するフォールバックメカニズムを提供する必要があります。
- [**@angular/platform-webworker**](api/platform-webworker) を介して Web Worker で Angular 自体を実行することは、Angular CLI ではまだサポートされていません。
