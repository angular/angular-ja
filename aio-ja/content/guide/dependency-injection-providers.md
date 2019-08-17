# 依存関係プロバイダー

依存関係[プロバイダー](guide/glossary#provider)は、[DI トークン](guide/glossary#di-token)を使用してインジェクターを構成します。
DI トークンは、依存関係の値の
具体的なランタイムバージョンを提供するために使用します。
インジェクターはプロバイダーの構成に依存して、
コンポーネント、ディレクティブ、パイプ、およびその他のサービスに注入する依存関係のインスタンスを作成します。

プロバイダーではインジェクターを設定する必要があります。そうしないと、依存関係を作成する方法がわかりません。
インジェクターがサービスクラスのインスタンスを作成するもっとも明白な方法は、クラス自体を使用することです。
サービスクラス自体をプロバイダートークンとして指定した場合、デフォルトの動作では、インジェクターはそのクラスを `new` でインスタンス化します。

次の典型的な例では、`Logger` クラス自体が `Logger`インスタンスを提供します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

ただし、必要なロギング機能を提供する他のオブジェクトを配信するために、
代替プロバイダーでインジェクターを構成できます。
たとえば:
* 代替クラスを提供できます

* ロガーのようなオブジェクトを提供できます

* プロバイダーは、ロガーファクトリ関数を呼び出すことができます

{@a provide}

## `Provider` オブジェクトリテラル

クラスプロバイダーの構文は、[`Provider` インターフェイス](api/core/Provider)によって定義されたプロバイダー構成に展開される省略表現です。
次のコードスニペットは、`providers` 値として指定されたクラスが
完全なプロバイダーオブジェクトに展開される方法を示しています。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" >
</code-example>

拡張されたプロバイダー構成は、2つのプロパティをもつオブジェクトリテラルです。

* `provide` プロパティは、依存関係値の検索と
インジェクターの構成の両方のキーとして機能する[トークン](guide/dependency-injection#token)を保持します。

* 2番目のプロパティはプロバイダー定義オブジェクトで、インジェクターに依存関係値の作成方法を指示します。
プロバイダー定義キーは、例のように `useClass` にすることができます。
`useExisting`、`useValue`、または `useFactory` にすることもできます。
次に説明するように、これらの各キーは異なるタイプの依存関係を提供します。


{@a class-provider}

## 代替クラスプロバイダー

異なるクラスが同じサービスを提供できます。
たとえば、次のコードは、コンポーネントが `Logger` トークンを使用してロガーを要求したときに、
`BetterLogger` インスタンスを返すよう
インジェクターに指示します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" >
</code-example>

{@a class-provider-dependencies}

### 依存関係をもつクラスプロバイダー

別のクラス `EvenBetterLogger` は、ログメッセージにユーザー名を表示する場合があります。
このロガーは、注入された `UserService` インスタンスからユーザーを取得します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

インジェクターには、この新しいロギングサービスとその依存する `UserService` の両方のプロバイダーが必要です。  `BetterLogger` などの `useClass` プロバイダー定義キーを使用して、この代替ロガーを構成します。次の配列は、親モジュールまたはコンポーネントの `providers` メタデータオプションで両方のプロバイダーを指定します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

{@a aliased-class-providers}

### エイリアスクラスプロバイダー

古いコンポーネントが `OldLogger` クラスに依存しているとします。
`OldLogger` のインターフェースは `NewLogger` と同じですが、
何らかの理由で古いコンポーネントを更新して使用することはできません。

古いコンポーネントが `OldLogger` でメッセージをログに記録するとき、
代わりに `NewLogger` のシングルトンインスタンスで処理する必要があります。
この場合、コンポーネントが新しいロガーまたは古いロガーのいずれかを要求したときに、
依存性インジェクターはそのシングルトンインスタンスを注入する必要があります。
`OldLogger` は、`NewLogger` のエイリアスである必要があります。

`useClass` で `OldLogger` を `NewLogger` にエイリアスしようとすると、アプリ内で 2 つの異なる `NewLogger` インスタンスが作成されます。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6a"></code-example>

`NewLogger` のインスタンスが 1 つだけであることを確認するには、`useExisting` オプションで `OldLogger` のエイリアスを作成します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

{@a value-provider}

## バリュープロバイダー

インジェクターにクラスから作成するようにするよりも、既存のオブジェクトを提供する方が簡単な場合があります。
すでに作成したオブジェクトを注入するには、
`useValue` オプションでインジェクターを設定します

次のコードは、ロガーの役割を果たすオブジェクトを作成する変数を定義しています。

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"></code-example>

次のプロバイダーオブジェクトは、`useValue` キーを使用して変数を `Logger` トークンに関連付けます。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7"></code-example>

{@a non-class-dependencies}

### クラス以外の依存関係

依存関係はクラスだけではありません。
文字列、関数、またはオブジェクトを挿入したい場合があります。

アプリは、多くの場合、アプリケーションのタイトルや Web API エンドポイントのアドレスなど、
多くの小さな事実をもつ構成オブジェクトを定義します。
これらの構成オブジェクトは、常にクラスのインスタンスとは限りません。
次の例に示すように、オブジェクトリテラルにすることができます。

<code-example path="dependency-injection/src/app/app.config.ts" region="config" header="src/app/app.config.ts (excerpt)"></code-example>

{@a interface-not-valid-token}

**TypeScript インターフェースは有効なトークンではありません**

`HERO_DI_CONFIG` 定数は、AppConfig インターフェースに準拠しています。
残念ながら、TypeScript インターフェースをトークンとして使用することはできません。
TypeScript では、インターフェースはデザイン時のアーティファクトであり、DI フレームワークが使用できるランタイム表現 (トークン) を持ちません。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

<div class="alert is-helpful">

これは、インターフェースが優先される依存関係参照キーである、厳密に型指定された言語で依存関係の注入に慣れている場合、奇妙に思えるかもしれません。
ただし、JavaScript にはインターフェースがないため、TypeScript を JavaScript に変換すると、インターフェースが消えます。
実行時に Angular が見つけるためのインターフェース型の情報は残っていません。

</div>

1 つの代替方法は、`AppModule` のような NgModule で構成オブジェクトを提供および注入することです。

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)"></code-example>

クラス以外の依存関係のプロバイダートークンを選択する別のソリューションは、
`InjectionToken` オブジェクトを定義して使用することです。
次の例は、そのようなトークンを定義する方法を示しています。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

type パラメーターはオプションですが、依存関係の型を開発者とツールに伝えます。
トークンの説明は、別の開発者支援です。

`InjectionToken` オブジェクトを使用して依存関係プロバイダーを登録します:

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9"></code-example>

これで、`@Inject()` パラメーターデコレーターの助けを借りて、
構成オブジェクトをそれを必要とする任意のコンストラクターに注入できます。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

<div class="alert is-helpful">

`AppConfig` インターフェースは、依存性の注入では何の役割も果たしませんが、
クラス内の構成オブジェクトの入力をサポートします。

</div>


{@a factory-provider}
{@a factory-providers}

## ファクトリープロバイダー

実行時までは得られない情報に基づいて、
依存する値を動的に作成する必要がある場合があります。
たとえば、ブラウザセッション中に繰り返し変化する情報が必要になる場合があります。
また、注入可能なサービスは、情報のソースに独立してアクセスできない場合があります。

このような場合、*ファクトリープロバイダー*を使用できます。
ファクトリープロバイダーは、DI で動作するように設計されていないサードパーティライブラリから
依存関係のインスタンスを作成する場合にも役立ちます。

たとえば、`HeroService` が通常のユーザーから*秘密*のヒーローを隠す必要があるとします。
許可されたユーザーのみが秘密のヒーローを見ることができます。

`EvenBetterLogger` と同様に、`HeroService` は、ユーザーが秘密のヒーローを見ることが許可されているかどうかを知る必要があります。
この許可は、別のユーザーでログインするときのように、
単一のアプリケーションセッションの過程で変更される可能性があります。

`UserService` を `HeroService` に直接注入したくないとしましょう。セキュリティに敏感な情報でそのサービスを複雑にしたくないからです。
`HeroService` は、ユーザー情報に直接アクセスして、誰が許可され、
誰が許可されないかを判断することはできません。

これを解決するために、`HeroService` コンストラクターに真偽値フラグを与えて、秘密のヒーローの表示を制御します。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

`Logger` を挿入できますが、`isAuthorized` フラグを挿入することはできません。代わりに、ファクトリープロバイダーを使用して、`HeroService` の新しいロガーインスタンスを作成できます。

ファクトリープロバイダーにはファクトリー関数が必要です。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

`HeroService` は `UserService` にアクセスできませんが、ファクトリ関数はアクセスできます。
`Logger` と `UserService` の両方をファクトリープロバイダーに注入し、
インジェクターがそれらをファクトリー関数に渡すようにします。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory` フィールドは、プロバイダーが `heroServiceFactory` を実装したファクトリ関数であることを Angular に伝えます。

* `deps` プロパティは、[プロバイダートークン](guide/dependency-injection#token)の配列です。
`Logger` クラスと `UserService` クラスは、独自のクラスプロバイダーのトークンとして機能します。
インジェクターはこれらのトークンを解決し、対応するサービスを一致するファクトリー関数パラメーターに注入します。

エクスポートされた変数 `heroServiceProvider` でファクトリープロバイダーをキャプチャしたことに注意してください。
この追加手順により、ファクトリープロバイダーが再利用可能になります。
この変数を使用して、必要な場所で `HeroService` のプロバイダーを構成できます。
このサンプルでは、メタデータ `providers` 配列内の`HeroService` を
`heroServiceProvider` に置き換える `HeroesComponent` でのみ必要です。

次に、新しい実装と古い実装を並べて示します。

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts">
  </code-pane>

</code-tabs>

## Predefined tokens and multiple providers

Angular provides a number of built-in injection-token constants that you can use to customize the behavior of
various systems.

For example, you can use the following built-in tokens as hooks into the framework’s bootstrapping and initialization process.
A provider object can associate any of these injection tokens with one or more callback functions that take app-specific initialization actions.

* [PLATFORM_INITIALIZER](api/core/PLATFORM_INITIALIZER): Callback is invoked when a platform is initialized.

* [APP_BOOTSTRAP_LISTENER](api/core/APP_BOOTSTRAP_LISTENER): Callback is invoked for each component that is bootstrapped. The handler function receives the ComponentRef instance of the bootstrapped component.

* [APP_INITIALIZER](api/core/APP_INITIALIZER): Callback is invoked before an app is initialized. All registered initializers can optionally return a Promise. All initializer functions that return Promises must be resolved before the application is bootstrapped. If one of the initializers fails to resolves, the application is not bootstrapped.

The provider object can have a third option, `multi: true`, which you can use with `APP_INITIALIZER`
to register multiple handlers for the provide event.

For example, when bootstrapping an application, you can register many initializers using the same token.

```
export const APP_TOKENS = [
 { provide: PLATFORM_INITIALIZER, useFactory: platformInitialized, multi: true    },
 { provide: APP_INITIALIZER, useFactory: delayBootstrapping, multi: true },
 { provide: APP_BOOTSTRAP_LISTENER, useFactory: appBootstrapped, multi: true },
];
```

Multiple providers can be associated with a single token in other areas as well.
For example, you can register a custom form validator using the built-in [NG_VALIDATORS](api/forms/NG_VALIDATORS) token,
and provide multiple instances of a given validator provider by using the `multi: true` property in the provider object.
Angular adds your custom validators to the existing collection.

The Router also makes use of multiple providers associated with a single token.
When you provide multiple sets of routes using [RouterModule.forRoot](api/router/RouterModule#forroot)
and [RouterModule.forChild](api/router/RouterModule#forchild) in a single module,
the [ROUTES](api/router/ROUTES) token combines all the different provided sets of routes into a single value.

<div class="alert is-helpful>

Search for [Constants in API documentation](api?type=const) to find more built-in tokens.

</div>

{@a tree-shakable-provider}
{@a tree-shakable-providers}

## Tree-shakable providers

Tree shaking refers to a compiler option that removes code from the final bundle if the app doesn't reference that code.
When providers are tree-shakable, the Angular compiler removes the associated
services from the final output when it determines that your application doesn't use those services.
This significantly reduces the size of your bundles.

<div class="alert is-helpful">

Ideally, if an application isn't injecting a service, Angular shouldn't include it in the final output.
However, Angular has to be able to identify at build time whether the app will require the service or not.
Because it's always possible to inject a service directly using `injector.get(Service)`,
Angular can't identify all of the places in your code where this injection could happen,
so it has no choice but to include the service in the injector.
Thus, services in the NgModule `providers` array or at component level are not tree-shakable.

</div>

The following example of non-tree-shakable providers in Angular configures a service provider for the injector of an NgModule.

<code-example path="dependency-injection/src/app/tree-shaking/service-and-module.ts"  header="src/app/tree-shaking/service-and-modules.ts"></code-example>

You can then import this module into your application module
to make the service available for injection in your app,
as in the following example.

<code-example path="dependency-injection/src/app/tree-shaking/app.module.ts"  header="src/app/tree-shaking/app.modules.ts"></code-example>

When `ngc` runs, it compiles `AppModule` into a module factory, which contains definitions for all the providers declared in all the modules it includes. At runtime, this factory becomes an injector that instantiates these services.

Tree-shaking doesn't work here because Angular can't decide to exclude one chunk of code (the provider definition for the service within the module factory) based on whether another chunk of code (the service class) is used. To make services tree-shakable, the information about how to construct an instance of the service (the provider definition) needs to be a part of the service class itself.

### Creating tree-shakable providers

You can make a provider tree-shakable by specifying it in the `@Injectable()` decorator on the service itself, rather than in the metadata for the NgModule or component that depends on the service.

The following example shows the tree-shakable equivalent to the `ServiceModule` example above.

<code-example path="dependency-injection/src/app/tree-shaking/service.ts"  header="src/app/tree-shaking/service.ts"></code-example>

The service can be instantiated by configuring a factory function, as in the following example.

<code-example path="dependency-injection/src/app/tree-shaking/service.0.ts"  header="src/app/tree-shaking/service.0.ts"></code-example>

<div class="alert is-helpful">

To override a tree-shakable provider, configure the injector of a specific NgModule or component with another provider, using the `providers: []` array syntax of the `@NgModule()` or `@Component()` decorator.

</div>
