# シングルトンサービス

A singleton service is a service for which only once instance exists in an app.

この記事で説明されている、アプリ全体でシングルトンなサービスを使用したサンプルアプリケーションについては、
すべてのドキュメント化されたNgModuleの機能を紹介している<live-example name="ngmodules"></live-example>を参照してください。

## シングルトンサービスを提供する

Angularでシングルトンサービスを作成する方法は2種類あります:

* `@Injectable()`の`providedIn`プロパティに対して`root`を宣言する。
* `AppModule`か、`AppModule`によってのみインポートされるモジュールにサービスを含める。

{@a providedIn}

### `providedIn` を使う

Angular 6.0から、シングルトンサービスを作成する推奨の方法は、サービスがアプリケーションルートに提供されるように指定することです。 これは、サービスの`@Injectable`デコレーターの`providedIn`に`root`を設定することで行います:

<code-example path="providers/src/app/user.service.0.ts"  header="src/app/user.service.ts"></code-example>


サービスのさらに詳しい情報については
[Tour of Heroesチュートリアル](tutorial)の[サービス](tutorial/toh-pt4)の章を参照してください。

### NgModule の `providers` 配列

Angularのバージョン6.0未満で作成されたアプリケーションでは、サービスは次のようにNgModuleの`provider`配列に登録されます。

```ts
@NgModule({
  ...
  providers: [UserService],
  ...
})

```

このNgModuleがルート(root)の`AppModule`だった場合、`UserService`はシングルトンになり、アプリケーション全体から利用可能です。
上記のようなコードを見ることがあるかもしれませんが、Angular 6.0以降ではサービスがツリーシェイク可能になるため、サービス自身に`@Injectable()`デコレーターの`providedIn`プロパティを使用することが望ましいです。

{@a forRoot}

## `forRoot()` パターン {@a the-forroot-pattern}

通常、サービスを提供するために必要なのは `providedIn` だけで、`forRoot()`/`forChild()`はルーティングのためにのみ使用されます。しかしながら、サービスがシングルトンであるために`forRoot()`がどのように動作するかを理解することは、技術に対する理解を深めることに繋がります。

モジュールがprovidersとdeclarations（components、directives、pipes）を定義している場合、
モジュールを複数のフィーチャーモジュールにロードすると、サービスの登録が重複します。その結果、複数のサービスのインスタンスが生成される可能性があり、サービスはシングルトンとして動作しなくなります。

これを防ぐ方法は複数あります：

* サービスをモジュールで定義するかわりに、[`providedIn`構文](guide/singleton-services#providedIn)を使用する。
* サービスを独自のモジュールに分割する。
* モジュール内で`forRoot()`と`forChild()`メソッドを定義する。

<div class="alert is-helpful">

**注:** このシナリオを見ることができるアプリの例が２つあります。ルーティングモジュールと`GreetingModule`に`forRoot()`と`forChild()`を含んでいる、より高度な<live-example noDownload  name="ngmodules">NgModules live example</live-example>と、より単純な<live-example name="lazy-loading-ngmodules" noDownload>Lazy Loading live example</live-example>です。導入の説明は [フィーチャーモジュールの遅延ロード](guide/lazy-loading-ngmodules) ガイドを参照してください。

</div>


モジュールからプロバイダーを分離するには、`forRoot()`を利用します。
これにより、`providers`をもつルートモジュールと、
`providers`をもたない子モジュールにそのモジュールをインポートできます。

1. モジュール上に静的メソッド`forRoot()`を作成します。
2. `forRoot()`メソッド内にprovidersを配置します。

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts"></code-example>


{@a forRoot-router}

### `forRoot()`と`Router`

`RouterModule`は`Router`サービスを提供し、`RouterOutlet`や`routerLink`などのルーターディレクティブも提供します。ルートアプリケーションモジュールは`RouterModule`をインポートするので、アプリケーションは`Router`を持ち、ルートアプリケーションコンポーネントはルーターディレクティブにアクセスできます。すべての機能モジュールは、そのコンポーネントがテンプレートにルーターディレクティブを配置できるように、`RouterModule`もインポートする必要があります。

`RouterModule`に`forRoot()`がない場合、個々のフィーチャーモジュールは新しい`Router`インスタンスを生成します。`Router`は１つしか存在できないため、アプリケーションは停止します。`forRoot()`メソッドを使用すると、ルートアプリケーションモジュールは`RouterModule.forRoot(...)`をインポートして`Router`を取得し、すべてのフィーチャモジュールは別の`Router`をインスタンス化しない`RouterModule.forChild(...)`をインポートします。

<div class="alert is-helpful">

**注:** providersとdeclarationsの両方をもつモジュールがある場合、
それらを分離するテクニックとして
これを使うことが _可能_ で、レガシーアプリケーションでこのパターンが見られるかもしれません。
しかしAngular 6.0以降では,サービス提供のベストプラクティスは
`@Injectable()` `providedIn` プロパティです。

</div>

### `forRoot()`の仕組み

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

<code-example path="ngmodules/src/app/greeting/user.service.ts" region="ctor" header="src/app/greeting/user.service.ts (constructor)"></code-example>

ここでの`forRoot()`は`UserServiceConfig`オブジェクトを受け取ります:

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts (forRoot)"></code-example>

最後に`AppModule`の`imports`配列の中で呼び出します。次のスニペットでは、
ファイルの他の部分は省略されています。完全なファイルについては、<live-example name="ngmodules"></live-example>を参照するか、このドキュメントの次のセクションに進んでください。

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="ctor" header="src/app/greeting/greeting.module.ts"></code-example>

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

<code-tabs>
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
