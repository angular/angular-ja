# Angularにおける未処理エラー

Angularアプリケーションの実行中に、一部のコードがエラーをスローすることがあります。これらのエラーが未処理のままだと、予期しない動作や応答しないUIにつながる可能性があります。このガイドでは、アプリケーションコードで明示的にキャッチされないエラーをAngularがどのように扱うかについて説明します。アプリケーション内で独自のエラーハンドリングロジックを記述するためのガイダンスについては、JavaScriptとAngularにおけるエラーハンドリングのベストプラクティスを参照してください。

Angularのエラーハンドリング戦略における基本原則は、可能な限り呼び出し元で開発者にエラーを表面化させることです。このアプローチにより、操作を開始したコードがエラーを理解し、適切に処理し、適切なアプリケーションの状態を決定するために必要なコンテキストを持つことが保証されます。エラーをその発生源で可視化することで、開発者は失敗した操作に特化したエラーハンドリングを実装でき、回復やエンドユーザーへの有益なフィードバック提供に関連する情報にアクセスできます。これはまた、原因を理解するのに十分なコンテキストなしにエラーが報告される「過度に一般的なエラー」というコードの臭いを避けるのにも役立ちます。

たとえば、APIからユーザーデータを取得するコンポーネントを考えてみましょう。API呼び出しするコードには、潜在的なネットワークの問題やAPIから返されるエラーを管理するために、エラーハンドリング（例：`try...catch`ブロックやRxJSの`catchError`オペレーターの使用）を含めるべきです。これにより、コンポーネントはエラーを未処理のまま伝播させるのではなく、ユーザーフレンドリーなエラーメッセージを表示したり、リクエストを再試行したりできます。

## 未処理のエラーは`ErrorHandler`に報告されます

Angularは未処理のエラーをアプリケーションのルート`ErrorHandler`に報告します。カスタムの`ErrorHandler`を提供する場合、`bootstrapApplication`の呼び出しの一部として`ApplicationConfig`で提供します。

Angularアプリケーションを構築する際、フレームワークによって自動的に呼び出されるコードを書くことがよくあります。例えば、Angularはコンポーネントがテンプレートに表示されるときに、そのコンポーネントのコンストラクターとライフサイクルメソッドを呼び出す責任があります。フレームワークがあなたのコードを実行するとき、エラーを適切に処理するために`try`ブロックを追加できる合理的な場所はありません。このような状況では、Angularはエラーをキャッチし、`ErrorHandler`に送信します。

Angularは、あなたのコードから直接呼び出されるAPIの内部のエラーをキャッチし_ません_。例えば、エラーをスローするメソッドを持つサービスがあり、そのメソッドをコンポーネントで呼び出した場合、Angularはそのエラーを自動的にキャッチしません。あなたは`try...catch`のようなメカニズムを使用してそれを処理する責任があります。

Angularは、ユーザーのPromiseやObservableからの_非同期_エラーを、次の場合にのみキャッチします:

- Angularが非同期操作の結果を待って使用するための明示的な契約がある場合、そして
- エラーが戻り値や状態に現れない場合。

例えば、`AsyncPipe`と`PendingTasks.run`はエラーを`ErrorHandler`に転送しますが、`resource`は`status`と`error`プロパティでエラーを提示します。

Angularが`ErrorHandler`に報告するエラーは、_予期しない_エラーです。これらのエラーは回復不能であるか、アプリケーションの状態が破損していることを示している可能性があります。アプリケーションは、エラーが発生した場所で可能な限り`try`ブロックや適切なエラーハンドリング演算子（RxJSの`catchError`など）を使用してエラー処理を提供すべきであり、`ErrorHandler`に依存するべきではありません。`ErrorHandler`は、致命的な可能性のあるエラーをエラートラッキングおよびロギングインフラストラクチャに報告するメカニズムとしてのみ、最も頻繁かつ適切に使用されます。

```ts
export class GlobalErrorHandler implements ErrorHandler {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);

  handleError(error: any) {
    const url = this.router.url;
    const errorMessage = error?.message ?? 'unknown';

    this.analyticsService.trackEvent({
      eventName: 'exception',
      description: `Screen: ${url} | ${errorMessage}`,
    });

    console.error(GlobalErrorHandler.name, {error});
  }
}
```

### `TestBed`はデフォルトでエラーを再スローします {#testbed-rethrows-errors-by-default}

多くの場合、`ErrorHandler`はエラーをログに記録するだけで、アプリケーションの実行を継続させることがあります。しかし、テストでは、ほとんどの場合、これらのエラーを表面化させたいと考えます。Angularの`TestBed`は、フレームワークによってキャッチされたエラーが意図せず見逃されたり無視されたりしないように、予期しないエラーを再スローします。まれに、テストがエラーによってアプリケーションが無応答になったりクラッシュしたりしないことを特に確認しようとすることがあります。このような状況では、`TestBed.configureTestingModule({rethrowApplicationErrors: false})`を使用して、[`TestBed`がアプリケーションエラーを再スローし_ない_ように設定できます](api/core/testing/TestModuleMetadata#rethrowApplicationErrors)。

## グローバルエラーリスナー {#global-error-listeners}

アプリケーションコードやフレームワークのアプリケーションインスタンスによってキャッチされなかったエラーは、グローバルスコープに到達することがあります。グローバルスコープに到達したエラーは、対処しないと意図しない結果を引き起こす可能性があります。ブラウザ以外の環境では、プロセスがクラッシュする原因になることがあります。ブラウザでは、これらのエラーは報告されず、サイトの訪問者はブラウザコンソールでエラーを見ることになるかもしれません。Angularは、これらの問題に対応するため、両方の環境にグローバルリスナーを提供しています。

### クライアントサイドレンダリング {#client-side-rendering}

[ApplicationConfig](guide/di/dependency-injection#at-the-application-root-level-using-applicationconfig)に[`provideBrowserGlobalErrorListeners()`](/api/core/provideBrowserGlobalErrorListeners)を追加すると、ブラウザウィンドウに`'error'`と`'unhandledrejection'`リスナーが追加され、それらのエラーが`ErrorHandler`に転送されます。Angular CLIは、デフォルトでこのプロバイダーを使用して新しいアプリケーションを生成します。Angularチームは、ほとんどのアプリケーションで、フレームワークの組み込みリスナーまたは独自のカスタムリスナーのいずれかを使用して、これらのグローバルエラーを処理することを推奨しています。カスタムリスナーを提供する場合は、`provideBrowserGlobalErrorListeners`を削除できます。

### サーバーサイドおよびハイブリッドレンダリング {#server-side-and-hybrid-rendering}

[AngularのSSR](guide/ssr)を使用する場合、Angularは自動的に`'unhandledRejection'`と`'uncaughtException'`リスナーをサーバープロセスに追加します。これらのハンドラーはサーバーのクラッシュを防ぎ、代わりにキャプチャされたエラーをコンソールに記録します。

IMPORTANT: アプリケーションがZone.jsを使用している場合、`'unhandledRejection'`ハンドラーのみが追加されます。Zone.jsが存在する場合、アプリケーションのZone内で発生したエラーはすでにアプリケーションの`ErrorHandler`に転送されており、サーバープロセスには到達しません。
