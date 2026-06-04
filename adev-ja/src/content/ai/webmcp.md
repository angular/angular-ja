# WebMCP

Web Model Context Protocol (WebMCP)は、Webアプリケーションがブラウザ内でネイティブに実行されるAIエージェントに構造化されたツールを直接公開できるようにする[新興のWeb標準](https://github.com/webmachinelearning/webmcp/)です。アプリケーションによって定義されたツールにより、AIアシスタントはアプリケーションと直接対話できるようになり、エージェントに追加の機能を提供し、DOM操作の必要性を減らします。

例えば、新規ユーザーを登録するアプリケーションは、エージェントがDOM操作を通じて複雑なウィザードUIを操作することを要求する代わりに、ブラウザのAIエージェントがユーザーを直接作成するためのWebMCPツールを提供する場合があります。

AngularはWebMCPの実験的サポートを提供しており、アプリケーションの依存性の注入ライフサイクルに結びついたツールを簡単に登録し、シグナルフォームを自動的にAI対応ツールに変換できます。

IMPORTANT: WebMCP仕様はライフサイクルの非常に初期の段階にあり、頻繁に変更されています。そのため、AngularにおけるWebMCPサポートは現在[**実験的**](reference/releases#experimental)です。APIはメジャーバージョン以外でも変更される可能性があります。

## アプリケーションにツールを提供する {#provide-tools-for-the-application}

アプリケーション設定で[`provideExperimentalWebMcpTools`](api/core/provideExperimentalWebMcpTools)を使用して、アプリケーションのライフサイクル全体にわたってツールを登録します。この方法で提供されたツールは、アプリケーションの初期化時に自動的に登録され、アプリケーションの破棄時に登録解除されます。

`execute`コールバックは関連付けられた`Injector`の注入コンテキストで呼び出されるため、サービスを直接[`inject`](api/core/inject)できます。

```ts {header:"main.ts"}
import {Service, inject, provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

@Service()
class Greeter {
  sayHello(): string {
    return 'Hello agent!';
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'greet',
        description: 'Greets the agent.',
        inputSchema: {type: 'object', properties: {}},
        execute: () => {
          const greeter = inject(Greeter);

          return {content: [{type: 'text', text: greeter.sayHello()}]};
        },
      },
    ]),
  ],
});
```

### ツールパラメータを定義する {#define-tool-parameters}

ツールがAIアシスタントからの入力を必要とする場合、[JSON Schema](https://json-schema.org/)構文を使用して`inputSchema`内に期待される引数を定義します。Angularはスキーマ定義に基づいて、`execute`コールバックに渡されるパラメータの型を自動的に推論します。

```ts {header:"main.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'searchCatalog',
        description: 'Searches the store catalog for products matching a query.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search keywords.',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: ({query, maxResults}) => {
          // Type of `query` is inferred as `string`.
          // Type of `maxResults` is inferred as `number | undefined`.

          // Consider validating this at runtime, since inputs may not be validated to match the schema.
          if (typeof query !== 'string') throw new Error(`Bad query: ${query}`);
          if (typeof maxResults !== 'number' && maxResults !== undefined)
            throw new Error(`Bad maxResults: ${maxResults}`);

          const limit = maxResults ?? 5;
          return {
            content: [{type: 'text', text: `Returning up to ${limit} results for "${query}".`}],
          };
        },
      },
    ]),
  ],
});
```

TIP: `required: ['param1', 'param2', ...]`を使用してそれらのパラメータの型から`undefined`を削除し、`additionalProperties: false`を使用して引数オブジェクトの型をこれらのパラメータのみに制限します。

## ルートにツールを提供する {#provide-tools-for-a-route}

複雑なアプリケーションを構築する場合、ユーザーが特定のルートを表示しているときにのみ特定のツールを利用できるようにしたい場合があります。これは、ルート定義で直接ツールを提供することで実現できます。

```ts {header:"routes.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    providers: [
      provideExperimentalWebMcpTools([
        {
          name: 'exportDashboardReports',
          description: 'Exports the current dashboard analytics.',
          inputSchema: {type: 'object', properties: {}},
          execute: () => ({
            content: [{type: 'text', text: 'Dashboard export successfully triggered.'}],
          }),
        },
      ]),
    ],
  },
];
```

NOTE: 特定のルートにツールを登録する場合、ユーザーがルートから移動したときにツールが自動的に_登録解除_されるように、ルーターを構成して[`withExperimentalAutoCleanupInjectors`](api/router/withExperimentalAutoCleanupInjectors)を使用することを検討してください。このオプションがない場合、ルートで宣言されたWebMCPツールは、ユーザーが別のルートに移動した後でもAIエージェントからアクセス可能なままになります。

```ts {header:"app.config.ts"}
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withExperimentalAutoCleanupInjectors} from '@angular/router';
import {routes} from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withExperimentalAutoCleanupInjectors())],
};
```

## サービス内でのツールの提供 {#provide-tools-within-services}

動的なユースケースの場合、[`declareExperimentalWebMcpTool`](api/core/declareExperimentalWebMcpTool)関数は注入コンテキスト内にツールを直接登録し、そのコンテキストが破棄されたときに自動的に登録を解除します。

```ts {header:"counter.ts"}
import {Service, declareExperimentalWebMcpTool, signal, inject} from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: {type: 'object', properties: {}},
      execute: () => ({
        content: [{type: 'text', text: `The count is: ${this.count()}.`}],
      }),
    });
  }
}
```

`declareExperimentalWebMcpTool`は任意の注入コンテキストで機能しますが、[名前の衝突](#name-collisions)に注意し、ルートサービスで使用することを推奨します。

## シグナルフォームの暗黙的ツール {#implicit-tools-in-signal-forms}

最小限の設定で、既存のAngularの[Signal Form](essentials/signal-forms)から暗黙的にWebMCPツールを作成できます。AngularはフォームモデルをリッチなWebMCPツールに変換し、JSONスキーマやイベントハンドラーを手動で記述することなく、高度に動的なフォームを効果的にサポートします。

### WebMCPフォーム機能の有効化 {#enable-the-webmcp-forms-feature}

まず、ルートアプリケーションのプロバイダーに[`provideExperimentalWebMcpForms`](api/forms/signals/provideExperimentalWebMcpForms)を追加します:

```ts {header:"main.ts"}
import {bootstrapApplication} from '@angular/platform-browser';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [provideExperimentalWebMcpForms()],
});
```

### Signal Formのオプトイン {#opt-in-a-signal-form}

次に、[`form`](api/forms/signals/form)を使用してSignal Formを定義する際、`experimentalWebMcpTool`設定オプションを渡して暗黙的なWebMCPツールにオプトインします。Angularはフォームのデータモデルを検査し、接続されたAIエージェント用のJSONスキーマを自動的に生成します。

```ts {header:"user-registration.ts"}
import {Component, signal} from '@angular/core';
import {form, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
})
export class UserRegistration {
  private readonly model = signal({
    firstName: '',
    lastName: '',
    age: 0,
    hobbies: ['Web Development'],
  });

  readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, {message: 'First name is mandatory.'});
      required(f.lastName, {message: 'Last name is mandatory.'});
    },
    {
      // Implicitly registers a WebMCP tool named `registerUser` with parameters derived from `model`.
      experimentalWebMcpTool: {
        name: 'registerUser',
        description: 'Registers a new user.',
      },
      submission: {
        action: async (formValue) => {
          console.log('Submitting user:', formValue);
          // ...
        },
      },
    },
  );
}
```

この例では、Angularは以下のJSONスキーマを持つWebMCPツールを生成します:

1. `model`シグナルの初期値から推論されたパラメーターとして、`firstName`、`lastName`、`age`、および`hobbies`を含みます。
2. [`required`](api/forms/signals/required)バリデーターから推論された_必須_フィールドとして、`firstName`と`lastName`を定義します。
3. `hobbies`を文字列の配列として定義し、エージェントが任意の数の趣味を提供できるようにします。

入力スキーマの推論にとどまらず、AngularはWebMCPツールをフォームの検証ロジックと送信ハンドラーにも接続します。これにより、エージェントは自身の入力によってトリガーされた検証エラーや送信中に発生した失敗を監視し、自己修正して再試行できるようになります。

NOTE: 非同期バリデーターはトリガーされ_ない_ため、送信アクションで処理する必要があります。

#### 制約事項 {#constraints}

Angularはフォームモデルの初期値からWebMCPスキーマを推論します。これには以下が必要です:

- 具体的な初期値(`''`、`0`、`false`): Angularは`null`や`undefined`からデータ型を推論できません。
- 空ではない配列(`['Hello!']`): Angularは空の配列からデータ型を推論できず、少なくとも1つの初期値を必要とします。

## ベストプラクティス {#best-practices}

以下のベストプラクティスを念頭に置いてください:

### 名前の衝突 {#name-collisions}

WebMCPは各ツールが一意の名前を持つことを要求し、同じツール名が複数回登録された場合はエラーをスローします。これは、複数回登録される可能性のあるコンテキスト(コンポーネントのコンストラクターなど)で`declareExperimentalWebMcpTool`や`provideExperimentalWebMcpTools`を呼び出すと、実行時にエラーが発生する可能性があることを意味します。

可能な限り、ツールはアプリケーションプロバイダー、ルートプロバイダー、またはルートサービスに配置することを推奨します。[Signal Formsの暗黙的ツール](#implicit-tools-in-signal-forms)を含め、コンポーネントにツールを配置する場合は、そのコンポーネントが常にページ上で最大_1回_しかレンダリングされないことを確認してください。

### ツール入力の検証 {#validate-tool-inputs}

Angularは、エージェントによって提供された入力が定義されたJSONスキーマと実際に一致するかどうかの暗黙的な検証を提供しません。信頼性を確保するために、使用する前に`execute`関数への引数を明示的に検証することを検討してください。

### テスト {#testing}

ツールを効果的にユニットテストするために、[`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill)のようなモックWebMCP実装を使用することを検討してください。
