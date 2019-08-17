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

### Non-class dependencies

Not all dependencies are classes.
Sometimes you want to inject a string, function, or object.

Apps often define configuration objects with lots of small facts,
like the title of the application or the address of a web API endpoint.
These configuration objects aren't always instances of a class.
They can be object literals, as shown in the following example.

<code-example path="dependency-injection/src/app/app.config.ts" region="config" header="src/app/app.config.ts (excerpt)"></code-example>

{@a interface-not-valid-token}

**TypeScript interfaces are not valid tokens**

The `HERO_DI_CONFIG` constant conforms to the `AppConfig` interface.
Unfortunately, you cannot use a TypeScript interface as a token.
In TypeScript, an interface is a design-time artifact, and doesn't have a runtime representation (token) that the DI framework can use.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

<div class="alert is-helpful">

This might seem strange if you're used to dependency injection in strongly typed languages where an interface is the preferred dependency lookup key.
However, JavaScript, doesn't have interfaces, so when TypeScript is transpiled to JavaScript, the interface disappears.
There is no interface type information left for Angular to find at runtime.

</div>

One alternative is to provide and inject the configuration object in an NgModule like `AppModule`.

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)"></code-example>

Another solution to choosing a provider token for non-class dependencies is
to define and use an `InjectionToken` object.
The following example shows how to define such a token.

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

The type parameter, while optional, conveys the dependency's type to developers and tooling.
The token description is another developer aid.

Register the dependency provider using the `InjectionToken` object:

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9"></code-example>

Now you can inject the configuration object into any constructor that needs it, with
the help of an `@Inject()` parameter decorator.

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

<div class="alert is-helpful">

Although the `AppConfig` interface plays no role in dependency injection,
it supports typing of the configuration object within the class.

</div>


{@a factory-provider}
{@a factory-providers}

## Factory providers

Sometimes you need to create a dependent value dynamically,
based on information you won't have until run time.
For example, you might need information that changes repeatedly in the course of the browser session.
Also, your injectable service might not have independent access to the source of the information.

In cases like this you can use a *factory provider*.
Factory providers can also be useful when creating an instance of a dependency from
a third-party library that wasn't designed to work with DI.

For example, suppose `HeroService` must hide *secret* heroes from normal users.
Only authorized users should see secret heroes.

Like  `EvenBetterLogger`, `HeroService` needs to know if the user is authorized to see secret heroes.
That authorization can change during the course of a single application session,
as when you log in a different user.

Let's say you don't want to inject `UserService` directly into `HeroService`, because you don't want to complicate that service with security-sensitive information.
`HeroService` won't have direct access to the user information to decide
who is authorized and who isn't.

To resolve this, we give the `HeroService` constructor a boolean flag to control display of secret heroes.

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

You can inject `Logger`, but you can't inject the  `isAuthorized` flag. Instead, you can use a factory provider to create a new logger instance for `HeroService`.

A factory provider needs a factory function.

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

Although `HeroService` has no access to `UserService`, the factory function does.
You inject both `Logger` and `UserService` into the factory provider
and let the injector pass them along to the factory function.

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* The `useFactory` field tells Angular that the provider is a factory function whose implementation is `heroServiceFactory`.

* The `deps` property is an array of [provider tokens](guide/dependency-injection#token).
The `Logger` and `UserService` classes serve as tokens for their own class providers.
The injector resolves these tokens and injects the corresponding services into the matching factory function parameters.

Notice that you captured the factory provider in an exported variable, `heroServiceProvider`.
This extra step makes the factory provider reusable.
You can configure a provider of `HeroService` with this variable wherever you need it.
In this sample, you need it only in `HeroesComponent`,
where `heroServiceProvider` replaces `HeroService` in the metadata `providers` array.

The following shows the new and the old implementations side-by-side.

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
