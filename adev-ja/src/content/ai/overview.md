<!-- TODO: need an Angular + AI logo -->
<docs-decorative-header title="AIで構築" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
AI搭載アプリケーションを構築。AIで開発を加速。
</docs-decorative-header>

HELPFUL: お気に入りのAIパワードIDEで構築を始めたい方は、[プロンプトルールとベストプラクティス](/ai/develop-with-ai)をご確認ください。

生成AI (GenAI)と大規模言語モデル (LLM)は、パーソナライズされたコンテンツ、インテリジェントなレコメンデーション、メディアの生成と理解、情報の要約、動的な機能など、高度で魅力的なアプリケーション体験の作成を可能にします。

このような機能の開発は、これまで深いドメイン知識と多大なエンジニアリング作業を必要としました。しかし、新しい製品とSDKが参入障壁を下げています。Angularは、以下の理由により、AIをウェブアプリケーションに統合するのに非常に適しています。

* Angularの堅牢なテンプレートAPIにより、生成されたコンテンツから動的で整然と構成されたUIを作成できます
* データと状態を動的に管理するために設計された、強力なシグナルベースのアーキテクチャ
* AngularはAI SDKとAPIにシームレスに統合

このガイドでは、[Genkit](/ai#build-ai-powered-applications-with-genkit-and-angular)、[Firebase AI Logic](/ai#build-ai-powered-applications-with-firebase-ai-logic-and-angular)、および[Gemini API](/ai#build-ai-powered-applications-with-gemini-api-and-angular)を使用して、AngularアプリケーションにAIを組み込む方法を示します。このガイドは、AngularアプリケーションにAIを統合する方法を説明することで、AI搭載ウェブアプリケーション開発の旅を加速させるでしょう。また、このガイドでは、迅速に習得できるスターターキット、サンプルコード、一般的なワークフローのレシピなどのリソースも共有しています。

始めるには、Angularの基本的な理解が必要です。Angularは初めてですか？[必須ガイド](/essentials)または[入門チュートリアル](/tutorials)をお試しください。

NOTE: このページではGoogle AI製品との統合と例を紹介していますが、Genkitのようなツールはモデル非依存であり、独自のモデルを選択できます。多くの場合、これらの例とコードサンプルは他のサードパーティソリューションにも適用できます。

## はじめに
AI搭載アプリケーションの構築は、新しく急速に発展している分野です。どこから始め、どの技術を選択するかを決定するのは難しい場合があります。以下のセクションでは、選択できる3つのオプションを提供します。

1. *Genkit*は、フルスタックアプリケーション構築のために、[サポートされているモデルと統合APIを備えたインターフェース](https://genkit.dev)の選択肢を提供します。パーソナライズされたレコメンデーションなど、高度なバックエンドAIロジックを必要とするアプリケーションに最適です。

1. *Firebase AI Logic*は、Googleのモデル向けに安全なクライアントサイドAPIを提供し、クライアントサイド専用アプリケーションやモバイルアプリケーションを構築できます。リアルタイムテキスト分析や基本的なチャットボットなど、ブラウザで直接インタラクティブなAI機能を利用するのに最適です。

1. *Gemini API*を使用すると、APIサーフェスを通じて直接公開されるメソッドと機能を使用するアプリケーションを構築でき、フルスタックアプリケーションに最適です。カスタム画像生成やディープデータ処理など、AIモデルを直接制御する必要があるアプリケーションに適しています。

### GenkitとAngularでAI搭載アプリケーションを構築する {#build-ai-powered-applications-with-genkit-and-angular}
[Genkit](https://genkit.dev)は、ウェブアプリケーションやモバイルアプリケーションにAI搭載機能を構築するのに役立つように設計されたオープンソースツールキットです。Google、OpenAI、Anthropic、OllamaなどからのAIモデルを統合するための統合インターフェースを提供するため、ニーズに最適なモデルを探索して選択できます。サーバーサイドソリューションであるため、Genkitと統合するには、ウェブアプリケーションにはNode.jsベースのサーバーなどのサポートされているサーバー環境が必要です。たとえば、Angular SSRを使用してフルスタックアプリケーションを構築すると、サーバーサイドの開始コードが得られます。

GenkitとAngularで構築する方法の例を次に示します。

* [GenkitとAngularのスターターキットを使用したエージェントアプリ](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit)— AIでの構築は初めてですか？エージェントワークフローを備えた基本的なアプリケーションから始めましょう。初めてのAI構築体験に最適な場所です。

* [AngularアプリでGenkitを使用する](https://genkit.dev/docs/angular/)— Genkit Flows、Angular、Gemini 2.0 Flashを使用する基本的なアプリケーションを構築します。このステップバイステップのウォークスルーは、AI機能を備えたフルスタックAngularアプリケーションの作成をガイドします。

* [動的ストーリー生成アプリ](https://github.com/angular/examples/tree/main/genkit-angular-story-generator)— Genkit、Gemini、Imagen 3を搭載したエージェントAngularアプリケーションを構築し、ユーザーインタラクションに基づいてストーリーを動的に生成し、発生するイベントに付随する美しい画像パネルを特徴とする方法を学びます。より高度なユースケースを試したい場合は、ここから始めましょう。

  この例には、機能の詳細なビデオウォークスルーも含まれています。
    * [「AngularとGenkitでエージェントアプリを構築するライブ！」を見る](https://youtube.com/live/mx7yZoIa2n4?feature=share)
    * [「AngularとGenkitでエージェントアプリを構築するライブ！パート2」を見る](https://youtube.com/live/YR6LN5_o3B0?feature=share)

* [FirebaseとGoogle Cloudでエージェントアプリを構築する（バリスタの例）](https://developers.google.com/solutions/learn/agentic-barista) - FirebaseとGoogle Cloudでエージェントコーヒー注文アプリケーションを構築する方法を学びます。この例では、Firebase AI LogicとGenkitを使用しています。

### Firebase AI LogicとAngularでAI搭載アプリケーションを構築する {#build-ai-powered-applications-with-firebase-ai-logic-and-angular}
[Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase)は、Vertex AI Gemini APIやImagen APIとウェブアプリケーションやモバイルアプリケーションから直接安全にやり取りする方法を提供します。これは、アプリケーションがフルスタックまたはクライアントサイド専用のいずれかであるため、Angular開発者にとって魅力的です。クライアントサイド専用アプリケーションを開発している場合、Firebase AI LogicはウェブアプリケーションにAIを組み込むのに適しています。

Firebase AI LogicとAngularで構築する方法の例を次に示します。
* [Firebase AI Logic x Angularスターターキット](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example) - このスターターキットを使用して、タスクを実行できるチャットエージェントを備えたeコマースアプリケーションを構築します。Firebase AI LogicとAngularでの構築経験がない場合は、ここから始めましょう。

  この例には、[機能の説明と新機能の追加方法を示す詳細なビデオウォークスルー](https://youtube.com/live/4vfDz2al_BI)が含まれています。

### Gemini APIとAngularでAI搭載アプリケーションを構築する {#build-ai-powered-applications-with-gemini-api-and-angular}
[Gemini API](https://ai.google.dev/gemini-api/docs)は、音声、画像、動画、テキスト入力をサポートするGoogleの最先端モデルへのアクセスを提供します。特定のユースケースに最適化されたモデルについては、[Gemini APIドキュメントサイトで詳細を確認してください](https://ai.google.dev/gemini-api/docs/models)。

* [AIテキストエディターAngularアプリテンプレート](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - このテンプレートを使用して、テキストの洗練、テキストの拡張、テキストの形式化などのAI搭載機能を備えた完全に機能するテキストエディターから始めましょう。これは、HTTP経由でのGemini API呼び出しの経験を積むのに良い出発点です。

* [AIチャットボットアプリテンプレート](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - このテンプレートは、HTTP経由でGemini APIと通信するチャットボットユーザーインターフェースから始まります。

## AIパターン実践: チャット応答のストリーミング {#ai-patterns-in-action-streaming-chat-responses}
モデルから応答が受信されるにつれてテキストが表示されるのは、AIを使用するWebアプリケーションで一般的なUIパターンです。この非同期タスクはAngularの`resource` APIで実現できます。`resource`の`stream`プロパティは、時間の経過とともにシグナル値に更新を適用するために使用できる非同期関数を受け入れます。更新されるシグナルは、ストリーミングされるデータを表します。

```ts
characters = resource({
    stream: async () => {
      const data = signal<{ value: string } | { error: unknown }>({
        value: "",
      });

      fetch(this.url).then(async (response) => {
        if (!response.body) return;
        
        for await (const chunk of response.body) {
          const chunkText = this.decoder.decode(chunk);
          data.update((prev) => {
            if ("value" in prev) {
              return { value: `${prev.value} ${chunkText}` };
            } else {
              return { error: chunkText };
            }
          });
        }
      });

      return data;
    },
  });

```

`characters`メンバーは非同期で更新され、テンプレートに表示できます。

```html
<p>{{ characters.value() }}</p>
```

サーバー側では、例えば`server.ts`で、定義されたエンドポイントがクライアントにストリーミングされるデータを送信します。以下のコードはGemini APIを使用していますが、この手法はLLMからのストリーミング応答をサポートする他のツールやフレームワークにも適用可能です。

```ts
 app.get("/api/stream-response", async (req, res) => {
   ai.models.generateContentStream({
     model: "gemini-2.0-flash",
     contents: "Explain how AI works",
   }).then(async (response) => {
     for await (const chunk of response) {
       res.write(chunk.text);
     }
   });
 });

```
この例はGemini APIに接続していますが、ストリーミング応答をサポートする他のAPIもここで使用できます。[完全な例はAngularのGithubで見つけることができます](https://github.com/angular/examples/tree/main/streaming-example)。

## ベストプラクティス
### モデルプロバイダーへの接続とAPI認証情報の保護 {#connecting-to-model-providers-and-keeping-your-api-credentials-secure}
モデルプロバイダーに接続する際は、APIシークレットを安全に保つことが重要です。*APIキーを`environments.ts`のようなクライアントに配布されるファイルに決して含めないでください*。

アプリケーションのアーキテクチャによって、選択するAI APIとツールが決まります。具体的には、アプリケーションがクライアントサイドかサーバーサイドかに基づいて選択します。Firebase AI Logicのようなツールは、クライアントサイドのコードに対してモデルAPIへの安全な接続を提供します。Firebase AI Logic以外のAPIを使用したい場合や、別のモデルプロバイダーを使用したい場合は、プロキシサーバー、あるいは[Cloud Functions for Firebase](https://firebase.google.com/docs/functions)をプロキシとして使用し、APIキーを公開しないことを検討してください。

クライアントサイドアプリケーションを使用した接続の例については、コード: [Firebase AI Logic Angular example repository](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example)を参照してください。

APIキーを必要とするモデルAPIへのサーバーサイド接続には、`environments.ts`ではなく、シークレットマネージャーまたは環境変数を使用することを推奨します。APIキーと認証情報を保護するための標準的なベストプラクティスに従う必要があります。Firebaseは、Firebase App Hostingの最新アップデートにより、新しいシークレットマネージャーを提供するようになりました。詳細については、[公式ドキュメントを確認してください](https://firebase.google.com/docs/app-hosting/configure)。

フルスタックアプリケーションにおけるサーバーサイド接続の例については、コード: [Angular AI Example (Genkit and Angular Story Generator) repository](https://github.com/angular/examples/tree/main/genkit-angular-story-generator)を参照してください。

### ツール呼び出しを使用してアプリケーションを強化する {#use-tool-calling-to-enhance-apps}
エージェントがプロンプトに基づいて問題を解決するために行動し、ツールを使用できるエージェントワークフローを構築したい場合は、「ツール呼び出し」を使用してください。ツール呼び出し（関数呼び出しとも呼ばれる）は、LLMにそれを呼び出したアプリケーションへリクエストを返す機能を提供する方法です。開発者として、どのツールが利用可能かを定義し、ツールがどのように、いつ呼び出されるかを制御します。

ツール呼び出しは、AI統合を質疑応答の形式のチャットボットよりもさらに拡張することで、ウェブアプリケーションをさらに強化します。実際、モデルプロバイダーの関数呼び出しAPIを使用して、モデルに関数呼び出しをリクエストさせることができます。利用可能なツールは、アプリケーションのコンテキスト内でより複雑なアクションを実行するために使用できます。

[Angular examples repository](https://github.com/angular/examples)の[eコマースの例](https://github.com/angular/examples/blob/main/vertex-ai-firebase-angular-example/src/app/ai.service.ts#L88)では、LLMは、店舗内の商品のグループがいくらになるかを計算するなどのより複雑なタスクを実行するために必要なコンテキストを得るために、在庫に関する関数呼び出しをリクエストします。利用可能なAPIの範囲は、LLMによってリクエストされた関数を呼び出すかどうかも含め、開発者であるあなた次第です。実行フローの制御はあなたが保持します。例えば、サービスの一部の関数は公開できますが、そのサービスのすべての関数を公開する必要はありません。

### 非決定論的な応答の処理 {#handling-non-deterministic-responses}
モデルは非決定論的な結果を返す可能性があるため、アプリケーションはその点を考慮して設計する必要があります。アプリケーションの実装で利用できるいくつかの戦略を以下に示します。
* より決定論的な、またはより非決定論的な応答のために、プロンプトとモデルパラメーター（[温度](https://ai.google.dev/gemini-api/docs/prompting-strategies)など）を調整します。[ai.google.dev](https://ai.google.dev/)の[プロンプト戦略セクション](https://ai.google.dev/gemini-api/docs/prompting-strategies)で詳細を確認できます。
* ワークフローを進める前に人間が出力を検証する「ヒューマン・イン・ザ・ループ」戦略を使用します。オペレーター（人間または他のモデル）が出力を検証し、重要な決定を確認できるようにアプリケーションワークフローを構築します。
* ツール（または関数）呼び出しとスキーマ制約を利用して、モデルの応答を事前定義された形式に誘導および制限し、応答の予測可能性を高めます。

これらの戦略や技術を考慮しても、アプリケーション設計には適切なフォールバックを組み込む必要があります。アプリケーションの回復性に関する既存の標準に従ってください。例えば、リソースやAPIが利用できない場合にアプリケーションがクラッシュすることは許容されません。そのシナリオでは、エラーメッセージがユーザーに表示され、該当する場合は次のステップのオプションも表示されます。AIを活用したアプリケーションを構築する場合も、同様の考慮が必要です。応答が期待される出力と一致していることを確認し、一致しない場合は[グレースフルデグラデーション](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation)によって「安全な着地」を提供します。これは、LLMプロバイダーのAPI停止にも適用されます。

この例を考えてみましょう: LLMプロバイダーが応答していません。停止を処理するための潜在的な戦略は次のとおりです。
* ユーザーからの応答を、再試行シナリオ（今すぐまたは後で）で使用するために保存します。
* 機密情報を開示しない適切なメッセージで、ユーザーに停止を警告します。
* サービスが再度利用できるようになったら、後で会話を再開します。

## 次のステップ

LLMプロンプトとAI IDE設定について学ぶには、以下のガイドをご覧ください。

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="LLMプロンプトとIDE設定"/>
</docs-pill-row>
