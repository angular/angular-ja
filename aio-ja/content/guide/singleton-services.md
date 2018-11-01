# シングルトンサービス

#### 前提条件:

* [ブートストラップ](guide/bootstrapping)の基本的な理解
* [プロバイダー](guide/providers)について熟知していること

この記事で説明されている、アプリ全体でシングルトンなサービスを使用したサンプルアプリケーションについては、
すべてのドキュメント化されたNgModuleの機能を紹介している<live-example name="ngmodules"></live-example>を参照してください。

<hr />

## シングルトンサービスを提供する

Angularでシングルトンサービスを作成する方法は2種類あります:

* サービスがアプリケーションルートで提供されるように宣言する。
* `AppModule`か、`AppModule`によってのみインポートされるモジュールにサービスを含める。

Angular 6.0から、シングルトンサービスを作成する推奨の方法は、サービスがアプリケーションルートに提供されるように指定することです。 これは、サービスの`@Injectable`デコレーターの`providedIn`に`root`を設定することで行います:

<code-example path="providers/src/app/user.service.0.ts"  header="src/app/user.service.0.ts" linenums="false"> </code-example>


サービスのさらに詳しい情報については
[Tour of Heroesチュートリアル](tutorial)の[サービス](tutorial/toh-pt4)の章を参照してください。


## `forRoot()`

あるモジュールがプロバイダーと宣言(コンポーネント、ディレクティブ、パイプ)の両方を提供していて、たとえばルート(route)などの子インジェクターにロードするとプロバイダーのインスタンスが重複してしまいます。プロバイダーの重複は、おそらくシングルトンであるルート(root)インスタンスを参照するときに問題を引き起こすでしょう。このためAngularは、同一モジュールを`provider`をもつモジュールとしてルート(root)モジュールから、`provider`を持たないモジュールとして子モジュールからインポートできるように、プロバイダーをモジュールから分離する方法を提供します。

1. `forRoot()`(この名前は慣習的なものです)という静的メソッドをモジュールに作成します。
2. 次に説明する方法で`forRoot`メソッド内にプロバイダーを配置します。

<!-- MH: show a simple example how to do that without going to deep into it. -->

より具体的にするために、例として`RouterModule`について考えてみましょう。`RouterModule`は`Router`サービスと`RouterOutlet`ディレクティブを提供する必要があります。`RouterModule`はアプリケーションが1つの`Router`を持ち、かつ少なくとも1つの`RouterOutlet`を持てるようにするため、ルート(root)アプリケーションモジュールによってインポートする必要があります。また、`RouterOutlet`ディレクティブをサブルート(sub-route)用のテンプレート内に置けるようにするため、個々のルート(route)コンポーネントでインポートしなければなりません。

`RouterModule`に`forRoot()`がなければ、個々のルート(route)コンポーネントで新しい`Router`インスタンスが作成されるでしょう。`Router`は1つだけしか存在してはいけないため、アプリケーションを破壊するでしょう。この理由から、`RouterModule`は`RouterOutlet`をどこでも利用できるようにするため、その宣言を持っていますが、`Router`プロバイダーは`forRoot()`内にしか存在しません。その結果、ルート(root)アプリケーションモジュールは`RouterModule.forRoot(...)`をインポートして`Router`を取得します。対してすべてのルート(route)コンポーネントは`Router`を含まない`RouterModule`をインポートします。

もしもあなたがプロバイダーと宣言の両方を提供するモジュールを持っている場合は、このパターンを使用して分割してみましょう。

プロバイダーをアプリケーションに追加するモジュールは、
`forRoot()`
メソッドからプロバイダーを設定する機能を提供することができます。

`forRoot()`はサービスの設定を行うオブジェクトを受け取り、
[ModuleWithProviders](api/core/ModuleWithProviders)を返します。
これは次のようなプロパティをもつシンプルなオブジェクトです:

* `ngModule`: この例では`CoreModule`というクラスです。
* `providers`: 設定するプロバイダー。

<live-example name="ngmodules">live example</live-example>では、
ルート(root)の`AppModule`は`CoreModule`をインポートし、
`providers`を`AppModule`プロバイダーに追加します。
具体的には、
Angularは`@NgModule.providers`
にリストされている項目を追加する前にすべてのインポートされるプロバイダーを蓄積してゆきます。
このシーケンスは、
あなたが明示的に`AppModule`プロバイダーに追加したプロバイダーが、インポートされたプロバイダーよりも優先されることを保証します。

`CoreModule`をインポートし、その`forRoot()`メソッドを一度だけ`AppModule`で使用してください。なぜなら、それによってサービスを登録し、かつ、それらのサービスをあなたのアプリに一度だけ登録したいからです。それらを複数回登録してしまうと、複数のサービスインスタンスが生成されてランタイムエラーが発生しアプリケーションが終了してしまうでしょう。

`CoreModule`にコアの`UserService`の設定を行う
`forRoot()`メソッドを追加することもできます。

次の例では、オプショナルで注入された`UserServiceConfig`がコアの`UserService`を拡張しています。
`UserServiceConfig`が存在する場合、`UserService`はその設定からユーザー名をセットします。

<code-example path="ngmodules/src/app/core/user.service.ts" region="ctor" header="src/app/core/user.service.ts (constructor)" linenums="false">

</code-example>

ここでの`forRoot()`は`UserServiceConfig`オブジェクトを受け取ります:

<code-example path="ngmodules/src/app/core/core.module.ts" region="for-root" header="src/app/core/core.module.ts (forRoot)" linenums="false">

</code-example>

最後に`AppModule`の`imports`配列の中で呼び出します。

<code-example path="ngmodules/src/app/app.module.ts" region="import-for-root" header="src/app/app.module.ts (imports)" linenums="false">

</code-example>

アプリケーションはデフォルトの "Sherlock Holmes"のかわりに、"Miss Marple"をユーザーとして表示します。

ファイルの先頭にJavaScriptのインポートとして`CoreModule`を_import_することを忘れないでください。複数の`@NgModule`の`imports`リストに追加してはいけません。

<!-- KW--Does this mean that if we need it elsewhere we only import it at the top? I thought the services would all be available since we were importing it into `AppModule` in `providers`. -->

## `CoreModule`の再インポートを防ぐ

ルート(root)の`AppModule`だけが`CoreModule`をインポートすべきです。
もし遅延ロードするモジュールもそれをインポートした場合、
アプリケーションはサービスの[複数インスタンス](guide/ngmodule-faq#q-why-bad)を生成することになります。

遅延ロードするモジュールで`CoreModule`を再インポートすることを防ぎたい場合、次のような`CoreModule`コンストラクターを追加してください。

<code-example path="ngmodules/src/app/core/core.module.ts" region="ctor" header="src/app/core/core.module.ts" linenums="false">

</code-example>

コンストラクターはAngularにコンストラクター自身が`CoreModule`を注入するよう指示します。
もしもAngularが_現在_のインジェクター内の`CoreModule`を参照した場合、
この注入は循環参照となります。
`@SkipSelf`デコレーターは"インジェクター階層の上にある先祖のインジェクター内の`CoreModule`を参照する"
という意味になります。

コンストラクターが`AppModule`で意図どおりに実行される場合、
`CoreModule`のインスタンスを提供できる祖先のインジェクターは存在しないでしょう。そして、インジェクターは中断するはずです。

デフォルトでは、
インジェクターが要求したプロバイダーを見つけられなかったときはエラーをスローします。
`@Optional`デコレーターはサービスが見つからなくてもOKという意味になります。
インジェクターは`null`を返し、`parentModule`パラメーターはnullになり、
コンストラクターは無事終了します。

`CoreModule`を`CustomersModule`のような遅延ロードするモジュールに不適切にインポートするときは違います。

Angularは、遅延ロードするモジュールをルート(root)インジェクターの_子供_である、それ自身のインジェクターを使用して作成します。
`@SkipSelf`によって、
Angularは親インジェクター(今回はルートインジェクターになります)の`CoreModule`を参照します。
もちろん、ルート(root)の`AppModule`によってインポートされたインスタンスを参照します。
今度は`parentModule`が存在するのでコンストラクターはエラーをスローします。

ここでは、参考のために全体のなかの2つのファイルを紹介します:

<code-tabs linenums="false">
 <code-pane
   header="app.module.ts"
   path="ngmodules/src/app/app.module.ts">
 </code-pane>
 <code-pane
   header="core.module.ts"
   region="whole-core-module"
   path="ngmodules/src/app/core/core.module.ts">
 </code-pane>
</code-tabs>


<hr>

## NgModuleについてのさらに詳しい情報

あなたはこちらにも興味があるかもしれません:
* [モジュールの共有](guide/sharing-ngmodules)ではこのページで取り上げられている概念を詳しく説明します。
* [遅延ロードモジュール](guide/lazy-loading-ngmodules)
* [NgModule FAQ](guide/ngmodule-faq)
