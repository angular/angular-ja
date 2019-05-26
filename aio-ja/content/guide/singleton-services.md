# シングルトンサービス

#### 前提条件:

* [ブートストラップ](guide/bootstrapping)の基本的な理解
* [プロバイダー](guide/providers)について熟知していること

この記事で説明されている、アプリ全体でシングルトンなサービスを使用したサンプルアプリケーションについては、
すべてのドキュメント化されたNgModuleの機能を紹介している<live-example name="ngmodules"></live-example>を参照してください。

<hr />

## シングルトンサービスを提供する

Angularでシングルトンサービスを作成する方法は2種類あります:

* Declare `root` for the value of the `@Injectable()` `providedIn` property
* `AppModule`か、`AppModule`によってのみインポートされるモジュールにサービスを含める。

{@a providedIn}

### Using `providedIn`

Angular 6.0から、シングルトンサービスを作成する推奨の方法は、サービスがアプリケーションルートに提供されるように指定することです。 これは、サービスの`@Injectable`デコレーターの`providedIn`に`root`を設定することで行います:

<code-example path="providers/src/app/user.service.0.ts"  header="src/app/user.service.0.ts" linenums="false"> </code-example>


サービスのさらに詳しい情報については
[Tour of Heroesチュートリアル](tutorial)の[サービス](tutorial/toh-pt4)の章を参照してください。

### NgModule `providers` array

In apps built with Angular versions prior to 6.0, services are registered NgModule `providers` arrays as follows:

```ts
@NgModule({
  ...
  providers: [UserService],
  ...
})

```

If this NgModule were the root `AppModule`, the `UserService` would be a singleton and available
throughout the app. Though you may see it coded this way, using the `providedIn` property of the `@Injectable()` decorator on the service itself is preferable as of Angular 6.0 as it makes your services tree-shakable.

{@a forRoot}

## `forRoot()` パターン {@a the-forroot-pattern}

Generally, you'll only need `providedIn` for providing services and `forRoot()`/`forChild()` for routing. However, understanding how `forRoot()` works to make sure a service is a singleton will inform your development at a deeper level.

If a module defines both providers and declarations (components, directives, pipes),
then loading the module in multiple feature modules would duplicate the registration of the service. This could result in multiple service instances and the service would no longer behave as a singleton.

There are multiple ways to prevent this:

* Use the [`providedIn` syntax](guide/singleton-services#providedIn) instead of registering the service in the module.
* Separate your services into their own module.
* Define `forRoot()` and `forChild()` methods in the module.

<div class="alert is-helpful">

**Note:** There are two example apps where you can see this scenario; the more advanced <live-example noDownload>NgModules live example</live-example>, which contains `forRoot()` and `forChild()` in the routing modules and the `GreetingModule`, and the simpler <live-example name="lazy-loading-ngmodules" noDownload>Lazy Loading live example</live-example>. For an introductory explanation see the [Lazy Loading Feature Modules](guide/lazy-loading-ngmodules) guide.

</div>


Use `forRoot()` to
separate providers from a module so you can import that module into the root module
with `providers` and child modules without `providers`.

1. Create a static method `forRoot()` on the module.
2. Place the providers into the `forRoot()` method.

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts" linenums="false"> </code-example>


{@a forRoot-router}

### `forRoot()` and the `Router`

`RouterModule` provides the `Router` service, as well as router directives, such as `RouterOutlet` and `routerLink`. The root application module imports `RouterModule` so that the application has a `Router` and the root application components can access the router directives. Any feature modules must also import `RouterModule` so that their components can place router directives into their templates.

If the `RouterModule` didn’t have `forRoot()` then each feature module would instantiate a new `Router` instance, which would break the application as there can only be one `Router`. By using the `forRoot()` method, the root application module imports `RouterModule.forRoot(...)` and gets a `Router`, and all feature modules import `RouterModule.forChild(...)` which does not instantiate another `Router`.

<div class="alert is-helpful">

**Note:** If you have a module which has both providers and declarations,
you _can_ use this
technique to separate them out and you may see this pattern in legacy apps.
However, since Angular 6.0, the best practice for providing services is with the
`@Injectable()` `providedIn` property.

</div>

### How `forRoot()` works

`forRoot()`はサービスの設定を行うオブジェクトを受け取り、
[ModuleWithProviders](api/core/ModuleWithProviders)を返します。
これは次のようなプロパティをもつシンプルなオブジェクトです:

* `ngModule`: この例では `GreetingModule` というクラスです。
* `providers`: 設定するプロバイダー。

<live-example name="ngmodules">live example</live-example>では、
ルート(root)の`AppModule`は `GreetingModule` をインポートし、
`providers`を`AppModule`プロバイダーに追加します。
具体的には、
Angularは`@NgModule.providers`
にリストされている項目を追加する前にすべてのインポートされるプロバイダーを蓄積してゆきます。
このシーケンスは、
あなたが明示的に`AppModule`プロバイダーに追加したプロバイダーが、インポートされたプロバイダーよりも優先されることを保証します。

サンプルアプリでは `GreetingModule` をインポートし、その`forRoot()`メソッドを一度だけ`AppModule`で使用しています。複数のインスタンスを避けるためにこのように登録します。

`GreetingModule` に greeting の`UserService`の設定を行う
`forRoot()`メソッドを追加することもできます。

次の例では、オプショナルで注入された`UserServiceConfig`が greeting の`UserService`を拡張しています。
`UserServiceConfig`が存在する場合、`UserService`はその設定からユーザー名をセットします。

<code-example path="ngmodules/src/app/greeting/user.service.ts" region="ctor" header="src/app/greeting/user.service.ts (constructor)" linenums="false">

</code-example>

ここでの`forRoot()`は`UserServiceConfig`オブジェクトを受け取ります:

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts (forRoot)" linenums="false">

</code-example>

最後に`AppModule`の`imports`配列の中で呼び出します。In the following
snippet, other parts of the file are left out. For the complete file, see the <live-example name="ngmodules"></live-example>, or continue to the next section of this document.

<code-example path="ngmodules/src/app/app.module.ts" region="import-for-root" header="src/app/app.module.ts (imports)" linenums="false">

</code-example>

アプリケーションはデフォルトの "Sherlock Holmes"のかわりに、"Miss Marple"をユーザーとして表示します。

ファイルの先頭にJavaScriptのインポートとして`CoreModule`を_import_することを忘れないでください。複数の`@NgModule`の`imports`リストに追加してはいけません。

<!-- KW--Does this mean that if we need it elsewhere we only import it at the top? I thought the services would all be available since we were importing it into `AppModule` in `providers`. -->

## `GreetingModule` の再インポートを防ぐ

ルート(root)の`AppModule`だけが`GreetingModule`をインポートすべきです。
もし遅延ロードするモジュールもそれをインポートした場合、
アプリケーションはサービスの[複数インスタンス](guide/ngmodule-faq#q-why-bad)を生成することになります。

遅延ロードするモジュールで`GreetingModule`を再インポートすることを防ぎたい場合、次のような`GreetingModule`コンストラクターを追加してください。

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="ctor" header="src/app/greeting/greeting.module.ts" linenums="false">

</code-example>

コンストラクターはAngularにコンストラクター自身が`GreetingModule`を注入するよう指示します。
もしもAngularが_現在_のインジェクター内の`GreetingModule`を参照した場合、
この注入は循環参照となります。
`@SkipSelf()`デコレーターは"インジェクター階層の上にある先祖のインジェクター内の`GreetingModule`を参照する"
という意味になります。

コンストラクターが`AppModule`で意図どおりに実行される場合、
`GreetingModule`のインスタンスを提供できる祖先のインジェクターは存在しないでしょう。そして、インジェクターは中断するはずです。

デフォルトでは、
インジェクターが要求したプロバイダーを見つけられなかったときはエラーをスローします。
`@Optional()`デコレーターはサービスが見つからなくてもOKという意味になります。
インジェクターは`null`を返し、`parentModule`パラメーターはnullになり、
コンストラクターは無事終了します。

`GreetingModule`を`CustomersModule`のような遅延ロードするモジュールに不適切にインポートするときは違います。

Angularは、遅延ロードするモジュールをルート(root)インジェクターの_子供_である、それ自身のインジェクターを使用して作成します。
`@SkipSelf()`によって、
Angularは親インジェクター(今回はルートインジェクターになります)の`GreetingModule`を参照します。
もちろん、ルート(root)の`AppModule`によってインポートされたインスタンスを参照します。
今度は`parentModule`が存在するのでコンストラクターはエラーをスローします。

ここでは、参考のために全体のなかの2つのファイルを紹介します:

<code-tabs linenums="false">
 <code-pane header="app.module.ts" path="ngmodules/src/app/app.module.ts">
 </code-pane>
 <code-pane header="greeting.module.ts" region="whole-greeting-module" path="ngmodules/src/app/greeting/greeting.module.ts">
 </code-pane>
</code-tabs>


<hr />

## NgModuleについてのさらに詳しい情報

あなたはこちらにも興味があるかもしれません:
* [モジュールの共有](guide/sharing-ngmodules)ではこのページで取り上げられている概念を詳しく説明します。
* [遅延ロードモジュール](guide/lazy-loading-ngmodules)
* [NgModule FAQ](guide/ngmodule-faq)
