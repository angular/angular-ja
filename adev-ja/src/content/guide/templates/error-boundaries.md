# `@boundary`によるエラーバウンダリ

IMPORTANT: `@boundary`は[開発者プレビュー](reference/releases#developer-preview)です。

Angularテンプレートは、レンダリングや変更検知中に発生するランタイムエラーを適切に処理するためのエラーバウンダリをサポートしています。

エラーバウンダリは、単一のコンポーネントの障害によってアプリケーション全体がクラッシュするのを防ぎ、ユーザーにフォールバックUIを表示する方法を提供します。

## `@boundary`と`@error`によるエラーの捕捉 {#catching-errors-with-boundary-and-error}

`@boundary`ブロックはテンプレートの一部をラップします。このバウンダリ内のコンポーネントやディレクティブが初期化または変更検知中にエラーをスローした場合、フレームワークはそのエラーを捕捉し、代わりに`@error`ブロックをレンダリングします。

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Something went wrong!</p>
}
```

## エラーオブジェクトへのアクセス {#accessing-the-error-object}

暗黙の`$error`変数を参照すると、捕捉されたエラーにアクセスできます:

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Error occurred: {{ $error.message }}</p>
}
```

## バウンダリのリセット {#resetting-the-boundary}

`@error`ブロック内で暗黙の`$reset`関数を呼び出すことで、`@boundary`のコンテンツの再レンダリングを試みることができます。呼び出されると、バウンダリの状態をリセットし、元のコンテンツのレンダリングを再試行します。

```angular-html
@boundary {
  <app-flaky-component />
} @error {
  <p>Loading failed.</p>
  <button (click)="$reset()">Try again</button>
}
```

## `when`による条件付きエラーハンドリング {#conditional-error-handling-with-when}

`when`句を使用すると、特定の種類のエラーを条件付きで処理し、異なるフォールバックUIを提供できます。Angularはエラーを捕捉したときにこの条件を評価します。

```angular-html
@boundary {
  <app-chart-dashboard />
} @error (let err; reset = $reset; when isRenderError(err)) {
  <p>Network issue. Check your connection.</p>
  <button (click)="reset()">Retry</button>
} @error {
  <p>An unexpected error occurred: {{ $error.message }}</p>
}
```

Angularは`when`句を順番に評価し、最初にtrueと評価されたものを使用するため、`@error`ブロックは条件が具体的なものから一般的なものの順に配置してください。`when`句のない最後の`@error`ブロックは、すべてのエラーを捕捉するフォールバックとして機能します。

## グローバルエラーハンドラーの統合 {#global-error-handler-integration}

バウンダリがエラーを捕捉した場合でも、Angularはグローバルな`ErrorHandler`に通知できます。カスタム`ErrorHandler`にオプションの`onViewError`フックを実装することで、捕捉されたこれらのエラーをエラー追跡サービスに記録できます。

```ts
@Injectable()
export class MyErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Handle uncaught errors
  }

  onViewError(error: Error, details: ErrorDetails): void {
    // Handle errors caught by a @boundary
    console.warn('Caught by boundary:', details.boundary);
    myErrorTrackingService.log(error);
  }
}
```

IMPORTANT: `@error`ブロック自体がエラーをスローした場合、そのエラーは1つ外側の`@boundary`に伝播します。外側に`@boundary`がなければ、Angularはそれを未処理のアプリケーションエラーとして扱います。

## コンテンツプロジェクション {#content-projection}

コンポーネントが[コンテンツプロジェクション](guide/components/content-projection)を使用している場合、`<ng-content>`を`@boundary`でラップしても、投影されたコンテンツのエラーは捕捉されません。投影されたコンテンツが属するのは、受け取る側のコンポーネントのビューではなく、コンテンツを宣言した側のビューです。

例えば、以下のテンプレートを持つラッパーコンポーネントは、そこに投影されたコンポーネントのエラーを捕捉しません。

```angular-html {avoid}
@boundary {
  <ng-content />
} @error {
  <p>Something went wrong!</p>
}
```

これらのエラーを捕捉するには、親テンプレートの`@boundary`でラッパーコンポーネントとその投影されたコンテンツをラップします。

```angular-html {prefer}
@boundary {
  <app-wrapper>
    <app-risky-component />
  </app-wrapper>
} @error {
  <p>Something went wrong!</p>
}
```

## 動的ビューとプログラムによるエラー処理 {#dynamic-views-and-programmatic-error-handling}

エラー処理はテンプレート構文に限定されません。コンポーネントや埋め込みビューを動的に作成している場合は、`onError`オプションを使用してエラーを処理できます。詳細については、プログラムによるレンダリングガイドの[レンダリングエラーの処理](guide/components/programmatic-rendering#handling-rendering-errors)セクションを参照してください。
