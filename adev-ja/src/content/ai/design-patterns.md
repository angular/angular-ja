# AI SDKとシグナルAPIのための設計パターン

AIおよび大規模言語モデル (LLM) APIとの対話は、非同期操作の管理、ストリーミングデータの処理、そして潜在的に遅いまたは信頼性の低いネットワークリクエストに対する応答性の高いユーザー体験の設計といった、特有の課題を伴います。Angularの[シグナル](guide/signals)と[`resource`](guide/signals/resource) APIは、これらの問題をエレガントに解決するための強力なツールを提供します。

## シグナルによるリクエストのトリガー {#triggering-requests-with-signals}

ユーザーが提供するプロンプトを扱う際の一般的なパターンは、ユーザーのライブ入力と、API呼び出しをトリガーする送信値を分離することです。

1. ユーザーが入力する際に、生の入力を1つのシグナルに保存します。
2. ユーザーが送信したとき（例: ボタンをクリックして）、最初のシグナルの内容で2番目のシグナルを更新します。
3. 2番目のシグナルを`resource`の**`params`**フィールドで使用します。

この設定により、`resource`の**`loader`**関数は、ユーザーがプロンプトを明示的に送信したときにのみ実行され、すべてのキーストロークで実行されることはありません。`loader`フィールドでは、`sessionId`や`userId`のような追加のシグナルパラメータ（永続的なLLMセッションの作成に役立ちます）を使用できます。これにより、リクエストは常にこれらのパラメータの現在の値を使用し、`loader`フィールドで定義された非同期関数を再トリガーすることはありません。

多くのAI SDKは、API呼び出しをするためのヘルパーメソッドを提供しています。例えば、GenkitクライアントライブラリはGenkitフローを呼び出すための`runFlow`メソッドを公開しており、これを`resource`の`loader`から呼び出すことができます。他のAPIについては、[`httpResource`](guide/signals/resource#reactive-data-fetching-with-httpresource)を使用できます。

以下の例は、AIが生成したストーリーの一部をフェッチする`resource`を示しています。`loader`は、`storyInput`シグナルが変更されたときにのみトリガーされます。

```ts
// A resource that fetches three parts of an AI generated story
storyResource = resource({
  // The default value to use before the first request or on error
  defaultValue: DEFAULT_STORY,
  // The loader is re-triggered when this signal changes
  params: () => this.storyInput(),
  // The async function to fetch data
  loader: ({params}): Promise<StoryData> => {
    // The params value is the current value of the storyInput signal
    const url = this.endpoint();
    return runFlow({
      url,
      input: {
        userInput: params,
        sessionId: this.storyService.sessionId(), // Read from another signal
      },
    });
  },
});
```

## テンプレート用のLLMデータ準備 {#preparing-llm-data-for-templates}

LLM APIを設定して構造化データを返すことができます。`resource`をLLMからの期待される出力に厳密に型付けすることで、より良い型安全性とエディターのオートコンプリートが提供されます。

リソースから派生した状態を管理するには、`computed`シグナルまたは`linkedSignal`を使用します。`linkedSignal`は[以前の値へのアクセスを提供する](guide/signals/linked-signal)ため、以下を含むさまざまなAI関連のユースケースに役立ちます。

- チャット履歴の構築
- LLMがコンテンツを生成している間、テンプレートが表示するデータを保持またはカスタマイズする

以下の例では、`storyParts`は`linkedSignal`であり、`storyResource`から返された最新のストーリーパーツを既存のストーリーパーツの配列に追加します。

```ts
storyParts = linkedSignal<string[], string[]>({
  // The source signal that triggers the computation
  source: () => this.storyResource.value().storyParts,
  // The computation function
  computation: (newStoryParts, previous) => {
    // Get the previous value of this linkedSignal, or an empty array
    const existingStoryParts = previous?.value || [];
    // Return a new array with the old and new parts
    return [...existingStoryParts, ...newStoryParts];
  },
});
```

## パフォーマンスとユーザー体験 {#performance-and-user-experience}

LLM APIは、従来のより決定論的なAPIよりも低速でエラーが発生しやすい場合があります。Angularのいくつかの機能を使用して、高性能でユーザーフレンドリーなインターフェースを構築できます。

- **スコープ付きローディング:** データを直接使用するコンポーネントに`resource`を配置します。これにより、変更検知サイクル（特にゾーンレスアプリケーションで）を制限し、アプリケーションの他の部分がブロックされるのを防ぎます。データが複数のコンポーネント間で共有される必要がある場合は、サービスから`resource`を提供します。
- **SSRとハイドレーション:** インクリメンタルハイドレーションを備えたサーバーサイドレンダリング (SSR) を使用して、初期ページコンテンツを素早くレンダリングします。AI生成コンテンツのプレースホルダーを表示し、コンポーネントがクライアントでハイドレートされるまでデータのフェッチを遅延させることができます。
- **ローディング状態:** `resource`の`LOADING` [ステータス](guide/signals/resource#resource-status)を使用して、リクエスト処理中にスピナーのようなインジケーターを表示します。このステータスは、初期ロードとリロードの両方をカバーします。
- **エラー処理と再試行:** `resource`の[**`reload()`**](guide/signals/resource#reloading)メソッドを、ユーザーが失敗したリクエストを再試行する簡単な方法として使用します。これはAI生成コンテンツに依存する場合により頻繁に発生する可能性があります。

次の例は、ローディングと再試行機能を備えたAI生成画像を動的に表示するレスポンシブUIを作成する方法を示しています。

```angular-html
<!-- Display a loading spinner while the LLM generates the image -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
  <!-- Dynamically populates the src attribute with the generated image URL -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
  <!-- Provides a retry option if the request fails  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
    <p>Failed to load image. Click to retry.</p>
  </div>
}
```

## AIパターンを実践する: チャット応答のストリーミング {#ai-patterns-in-action-streaming-chat-responses}

インターフェースは、LLMベースのAPIからの部分的な結果を、応答データが到着するにつれて段階的に表示することがよくあります。Angularのresource APIは、この種のパターンをサポートするために応答をストリーミングする機能を提供します。`resource`の`stream`プロパティは、時間の経過とともにシグナル値に更新を適用するために使用できる非同期関数を受け入れます。更新されるシグナルは、ストリーミングされるデータを表します。

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Calls a Genkit streaming flow using the streamFlow method
    // exposed by the Genkit client SDK
    const response = streamFlow({
      url: '/streamCharacters',
      input: 10,
    });

    (async () => {
      for await (const chunk of response.stream) {
        data.update((prev) => {
          if ('value' in prev) {
            return {value: `${prev.value} ${chunk}`};
          } else {
            return {error: chunk as unknown as Error};
          }
        });
      }
    })();

    return data;
  },
});
```

`characters`メンバーは非同期に更新され、テンプレートに表示できます。

```angular-html
@if (characters.isLoading()) {
  <p>Loading...</p>
} @else if (characters.hasValue()) {
  <p>{{ characters.value() }}</p>
} @else {
  <p>{{ characters.error() }}</p>
}
```

サーバー側では、例えば`server.ts`で、定義されたエンドポイントがストリーミングされるデータをクライアントに送信します。以下のコードはGenkitフレームワークでGeminiを使用していますが、この手法はLLMからのストリーミング応答をサポートする他のAPIにも適用できます。

```ts
import {startFlowServer} from '@genkit-ai/express';
import {genkit} from 'genkit/beta';
import {googleAI, gemini20Flash} from '@genkit-ai/googleai';

const ai = genkit({plugins: [googleAI()]});

export const streamCharacters = ai.defineFlow(
  {
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (count, {sendChunk}) => {
    const {response, stream} = ai.generateStream({
      model: gemini20Flash,
      config: {
        temperature: 1,
      },
      prompt: `Generate ${count} different RPG game characters.`,
    });

    (async () => {
      for await (const chunk of stream) {
        sendChunk(chunk.content[0].text!);
      }
    })();

    return (await response).text;
  },
);

startFlowServer({
  flows: [streamCharacters],
});
```
