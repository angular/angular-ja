# 注入可能なサービスの作成

サービスとは、アプリケーションが必要とするあらゆる値、関数、または機能を含む広いカテゴリーです。サービスは通常、明確な目的を持った小さなクラスです。コンポーネントは、DIを使用できるクラスのひとつです。

Angularはモジュール性と再利用性を高めるために、コンポーネントとサービスを区別しています。コンポーネントのビューに関連する機能を他の種類の処理から分離することで、コンポーネントクラスを簡潔かつ効率的にすることができます。

理想的には、コンポーネントの仕事はユーザー体験を実現することだけです。コンポーネントは、データバインディングのためのプロパティとメソッドを提供し、（テンプレートによってレンダリングされる）ビューと（多くの場合、モデルの概念を含む）アプリケーションロジックとの間を仲介する必要があります。

たとえば、サーバーからのデータの取得、ユーザー入力の検証、 コンソールへの直接のログ出力などのタスクを、コンポーネントから サービスに委譲することができます。このような処理タスクを注入するサービスクラスで定義すると、 どのコンポーネントでもそのタスクを利用できるようになります。また、同じ種類のサービスでも、状況に応じて異なるプロバイダーを注入することで、 アプリケーションの柔軟性を高めることもできます。

Angularはこれらの原則を強制するものではありません。Angularは、アプリケーションロジックを簡単にサービス化し、そのサービスをDIを通してコンポーネントから利用できるようにすることで、これらの原則に沿うことを支援します。

## サービスの例

以下は、ブラウザコンソールにログを記録するサービスクラスの例です。

<code-example header="src/app/logger.service.ts (class)" path="architecture/src/app/logger.service.ts" region="class"></code-example>

サービスは他のサービスに依存することができます。
たとえば、 `HeroService` は `Logger` サービスに依存し、ヒーローを取得するために `BackendService` を使用します。
このサービスは、サーバーから非同期でヒーローを取得するために `HttpClient` サービスに依存することがあります。

<code-example header="src/app/hero.service.ts (class)" path="architecture/src/app/hero.service.ts" region="class"></code-example>

## 注入可能なサービスの作成

Angular CLIは新しいサービスを作成するコマンドを提供します。次の例では、`ng new`コマンドで作成したアプリケーションに新しいサービスを追加しています。

`src/app/heroes` フォルダに新しい `HeroService` クラスを生成するには、次のステップを実行します。

1. この[Angular CLI](cli)コマンドを実行します:

<code-example language="sh">
ng generate service heroes/hero
</code-example>

このコマンドは、次のようなデフォルトの `HeroService` を作成します。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

`@Injectable()` デコレーターは、AngularがこのクラスをDIシステムで使用できるように指定するものです。
`providedIn: 'root'`というメタデータは、`HeroService` がアプリケーション全体に公開されることを意味します。

2. ヒーローのモックデータを取得するために `mock.heroes.ts` からヒーローを返す `getHeroes()` メソッドを追加します。

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>

明確さと保守性のために、コンポーネントとサービスを別々のファイルで定義することをお勧めします。

## サービスを注入する

サービスを依存オブジェクトとしてコンポーネントに注入するには、コンポーネントの `constructor()` を使用して、コンストラクターの引数に依存オブジェクトの型を与えます。次の例では、`HeroListComponent` のコンストラクターに `HeroService` を指定しています。`HeroService` の型は `HeroService` です。このクラスは以前に `@Injectable` デコレーターでアノテーションされていたため、Angular は `HeroService` を依存オブジェクトとして認識します。

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>

## サービスを他のサービスに注入する

あるサービスが他のサービスに依存している場合、コンポーネントに注入するのと同じパターンに従います。
次の例では、 `HeroService` は、そのアクティビティを報告するために `Logger` サービスに依存しています。

まず、`Logger` サービスをインポートします。次に、`HeroService` の `constructor()` に `private logger: Logger` を指定して、`Logger` サービスを注入します。 

ここでは、`constructor()` に `Logger` という型を指定して、`Logger` のインスタンスを `logger` というプライベートフィールドに格納しています。

次のコードタブでは、`Logger` サービスと2 つのバージョンの `HeroService` を紹介します。最初のバージョンの `HeroService` は `Logger` サービスに依存していません。2番目のバージョンは `Logger` サービスに依存しています。

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

この例では、`getHeroes()` メソッドはヒーローを取得するときにメッセージを記録して `Logger` サービスを使用します。

## What's next

* [How to configure dependencies in DI](guide/dependency-injection-providers)
* [How to use `InjectionTokens` to provide and inject values other than services/classes](guide/dependency-injection-providers#configuring-dependency-providers)
* [Dependency Injection in Action](guide/dependency-injection-in-action)

@reviewed 2022-08-02