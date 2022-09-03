# Angular の依存性の注入

依存性はクラスがその機能を実行するために必要なサービスまたはオブジェクトです。
依存性の注入 (DI) はクラスがそれを作成するのではなく、外部ソースから依存関係を要求するデザインパターンです。

AngularのDIフレームワークは、インスタンス化時にクラスへの依存性を提供します。
AngularのDIを使用することで、アプリケーションの柔軟性とモジュール性を高めることができます。

<div class="alert is-helpful">

 このガイドのコードスニペットを含む作業例については、<live-example></live-example>を参照してください。

</div>

## 注入可能なサービスの作成

`src/app/heroes` フォルダに新しく `HeroService` を生成するには、次の[Angular CLI](cli)コマンドを使用します。

<code-example language="sh">
ng generate service heroes/hero
</code-example>

このコマンドは次のデフォルトの `HeroService` を作成します。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts （CLIにより生成）">
</code-example>

`@Injectable()` デコレーターは、AngularがDIシステムでこのクラスを使用できることを指定します。
`providedIn: 'root'` メタデータは、`HeroService` がアプリケーション全体で有効であることを意味します。

次に、ヒーローのモックデータを取得するために、`mock.heroes.ts` からヒーローを返す `getHeroes()` メソッドを追加します。

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>

明確さと保守性のために、コンポーネントとサービスを別々のファイルで定義することを推奨します。

同じファイルでコンポーネントとサービスを組み合わせる場合は、最初にサービスを定義し、次にコンポーネントを定義することが重要です。
サービスの前にコンポーネントを定義すると、Angularは実行時のnull参照エラーを返します。


{@a injector-config} 
{@a bootstrap}

## サービスの注入

サービスを注入すると、コンポーネントからサービスが見えるようになります。

コンポーネントの `constructor()` でコンポーネントに依存オブジェクトを注入するために、依存オブジェクトの型をコンストラクターの引数に指定します。
次の例では、`HeroListComponent` コンストラクターで `HeroService` を指定しています。
`heroService` のタイプは `HeroService` です。

<code-example header="src/app/heroes/hero-list.component (constructor シグネチャ)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>


詳細については、[モジュールに依存オブジェクトを提供する](guide/providers) と [階層的インジェクター](guide/hierarchical-dependency-injection) を参照してください。

{@a service-needs-service}

## 他のサービスでのサービスの使用

サービスが別のサービスに依存している場合は、コンポーネントに注入するのと同じパターンに従います。
次の例では、`HeroService` は、アクティビティを報告する `Logger` サービスに依存しています。

まず、`Logger` サービスをインポートします。
次に、括弧内に `private logger: Logger` を指定することによって、`HeroService` `constructor()` で `Logger` サービスを注入します。

`constructor()` がパラメーターを持ったクラスを作成するときは、Angularが正しいサービスを注入できるように、それらのパラメータに関する型とメタデータを指定します。

ここで、`constructor()` は `Logger` の型を指定し、`Logger` のインスタンスを `logger` と呼ばれるプライベートフィールドに格納します。


次のコードタブには、`Logger` サービスと2つのバージョンの `HeroService` が含まれています。
`HeroService` の最初のバージョンは、`Logger` サービスに依存しません。
改訂された２番目のバージョンは、`Logger` サービスに依存します。

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

この例では、`getHeroes()` メソッドは、ヒーローをフェッチするときにメッセージをログに記録することで `Logger` サービスを使用します。

## 次は何ですか

* [依存オブジェクトプロバイダー](guide/dependency-injection-providers)
* [DIトークンとプロバイダー](guide/dependency-injection-providers)
* [実践的な依存性の注入](guide/dependency-injection-in-action)
