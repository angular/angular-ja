# NgModule FAQs


#### 前提条件:

次のコンセプトの基本的な理解:
* [NgModule](guide/ngmodules).

<hr />

NgModuleは機能的にまとまったブロックにアプリケーションを整理するのに役立ちます。

このページではNgModuleのデザインや実装についての多くの開発者の質問に答えてゆきます。


## どのクラスを`declarations`配列に追加すべきですか?

[宣言](guide/bootstrapping#the-declarations-array)(コンポーネント、ディレクティブ、またはパイプ)を`declarations`配列に追加してください。

これらのクラスはアプリケーションの_ちょうど1つ_のモジュールだけで宣言してください。
特定のモジュールに属している場合にモジュール内で宣言してください。

<hr/>

{@a q-declarable}

## _宣言_ is 何?

宣言とはモジュールの`declarations`配列に追加することができるクラス
(コンポーネント、ディレクティブ、パイプ)です。
宣言だけが、`declarations`に追加することができるクラスです。

<hr/>

## どのクラスを`declarations`に追加すべきでは_ない_ですか?

[宣言](guide/bootstrapping#the-declarations-array)クラスは1つのNgModuleの`declarations`配列にだけ追加してください。

次のような場合は宣言_しない_でください:

* アプリケーションのモジュール、@NgModule、もしくはサードパーティのモジュールであろうとなかろうと、他のモジュールで宣言されているクラス。
* 他のモジュールからインポートされたディレクティブの配列。
たとえば、`@angular/forms`の`FORMS_DIRECTIVES`を宣言してはいけません。`FormsModule`ですでに宣言しています。

* モジュールクラス.
* サービスクラス.
* Angularと無関係なクラスやオブジェクト。
たとえば文字列、数値、関数、エンティティーモデル、設定、ビジネスロジック、ヘルパークラスなどです。

<hr/>


## 複数の`NgModule`プロパティに同じコンポーネントが存在するのはなぜですか?

`AppComponent`はよく`declarations`と`bootstrap`の両方に追加されています。
あなたは同じコンポーネントが`declarations`、`exports`や`entryComponents`に追加されているのをみるかもしれません。

冗長にみえるかもしれませんが、それぞれのプロパティは別の機能を持っています。
1つのリストのメンバーシップは、別のリストのメンバーシップを意味するものではありません。

* `AppComponent`はこのモジュールで宣言できますが、ブートストラップされません。
* `AppComponent`はこのモジュールでブートストラップできますが、別のフィーチャーモジュール内で宣言されています。
* コンポーネントは他のモジュールでインポート(宣言はできません)、このモジュールから再エクスポートすることができます。
* 外部のコンポーネントのテンプレートに含めるためにコンポーネントをエクスポートし、
ポップアップダイアログに動的にロードすることができます。

<hr/>

## "Can't bind to 'x' since it isn't a known property of 'y'" とはどういう意味ですか?

このエラーの多くはディレクティブ"x"が宣言されていない、
または"x"が属しているNgModuleがインポートされていないことを意味します。

<div class="l-sub-section">

アプリケーション内のサブモジュールで"x"を宣言したが、それをエクスポートし忘れている可能性があります。
"x"クラスは`exports`配列に追加しない限り、他のモジュールからは見えません。

</div>

<hr/>

## 何をインポートすべきですか?

モジュールのコンポーネントのテンプレートから参照する必要があるときに
公開(エクスポート)された[宣言クラス](guide/bootstrapping#the-declarations-array)を持つNgModuleをインポートしてください。

これは`NgIf`や`NgFor`などのAngularのディレクティブにアクセスしたいときは常に
`@angular/common`から`CommonModule`をインポートすることを意味します。
直接、またはそれを[再エクスポート](guide/ngmodule-faq#q-reexport)している他のモジュールからインポートすることができます。

コンポーネントが`[(ngModel)]`両方向バインディング式を持つ場合は
`@angular/forms`から`FormsModule`をインポートしてください。

このモジュールからのコンポーネントが_共有_、
_フィーチャー_モジュールのコンポーネント、ディレクティブやパイプを組み込むときにそれをインポートしてください。

[BrowserModule]](guide/ngmodule-faq#q-browser-vs-common-module)はルートの`AppModule`でのみインポートしてください。

<hr/>

{@a q-browser-vs-common-module}

## `BrowserModule`と`CommonModule`のどちらをインポートすべきですか?

ほぼすべてのブラウザアプリケーションでは、
ルートアプリケーションモジュールである`AppModule`で`@angular/platform-browser`から`BrowserModule`をインポートすべきです。

`BrowserModule`はブラウザアプリケーションの起動と実行に不可欠なサービスを提供します。

`BrowserModule`は`@angular/common`から`CommonModule`を再エクスポートもしています。
これは`AppModule`内のコンポーネントが`NgIf`や`NgFor`のような、すべてのアプリケーションで必要なAngularディレクティブにアクセスすることができることを意味します。

`BrowserModule`を他のモジュールからインポートしてはいけません。
*フィーチャーモジュール*と*遅延ロードするモジュール*では、かわりに`CommonModule`をインポートすべきです。
それらは共通のディレクティブが必要で、アプリケーション全体のプロバイダーを再インストールするひつようはありません。

`CommonModule`をインポートすることはブラウザだけでなく、_どの_対象のプラットフォームでも使用できるようにフィーチャーモジュールを開放します。

<hr/>

{@a q-reimport}

## 同じモジュールを2回インポートするとどうなりますか?

問題ありません。3つのモジュールがすべてモジュール'A'をインポートすると、
Angularは最初の一度だけモジュール'A'を評価して、再度評価することはありません。

インポートされたモジュール内のどのレベルで `A` が現れても真です。
モジュール'B'がモジュール'A'をインポートし、モジュール'C'がモジュール'B'をインポートし、そしてモジュール'D'が`[C, B, A]`をインポートしたとき、
'D'は'C'の評価を発火します。これは'B'の評価を発火し、これは'A'を評価します。
Angularが'D'内の'B'と'A'を取得したとき、それらはすでにキャッシュされていて準備完了しています。

Angularは循環参照しているNgModuleが嫌いです。モジュール'A'がモジュール'B'をインポートして、モジュール'B'がモジュール'A'をインポートするようにしないようにしてください。

<hr/>

{@a q-reexport}

## 何をエクスポートすべきですか?

それらのテンプレートを参照している_他_のモジュール内のコンポーネント
がある場合、[宣言](guide/bootstrapping#the-declarations-array)クラスをエクスポートしてください。
_非公開_のままにしておきたい場合は、宣言クラスをエクスポートしないでください。このモジュール内で宣言された他のコンポーネントだけで見れる。

任意の宣言クラス(コンポーネント、ディレクティブ、またはパイプ)をエクスポートすることが_できます_。
このモジュール内、もしくはインポートしたNgModule内で宣言したもの。

インポートしたNgModuleすべてを再エクスポートすることが_できます_。これはそれらのエクスポートされているクラスを効果的に再エクスポートします。

NgModuleはインポートしていないモジュールをエクスポートすることもできます。

<hr/>

## 何をエクスポートすべきでは*ない*ですか?

次のようなものはエクスポートしてはいけません:

* このNgModuleで宣言されたコンポーネント内でのみ必要な、非公開のコンポーネント、ディレクティブ、パイプ。
他のNgModuleに見せたくなければ、エクスポートしてはいけません。
* 宣言ではないオブジェクト、たとえば、サービス、関数、設定やエンティティーモデルなどです。
* ルーターから動的にロードされる、またはブートストラップにだけ使用されるコンポーネント。
そのような[エントリーコンポーネント](guide/ngmodule-faq#q-entry-component-defined)は他のコンポーネントのテンプレートから選択されることはありません。
エクスポートすることに害はありませんが、利益もありません。
* 公開(エクスポート)された宣言をもたない純粋なサービスモジュール。
たとえば、`HttpClientModule`は何もエクスポートしているものがないので再エクスポートする意味はありません。
その唯一の目的はhttpサービスプロバイダーをアプリケーション全体に追加することです。

<hr/>



## クラスやモジュールを再エクスポートできますか?

もちろん。

NgModuleは他のNgModuleから選択的にクラスを集約したり、
それらを統合した便利なモジュールに再エクスポートする素晴らしい方法です。

NgModuleはNgModule全体を再エクスポートすることができます。エクスポートされたクラスのすべてを効果的に再エクスポートします。
Angular自身の`BrowserModule`は次のような2つのNgModuleをエクスポートします:

```typescript
  exports: [CommonModule, ApplicationModule]
```

NgModuleは自身の宣言、選択したインポートしたクラス、インポートしたNgModuleの組み合わせをエクスポートできます。

純粋なサービスモジュールの再エクスポートに悩まないでください。
純粋なサービスモジュールは他のNgModuleで使用できる[宣言](guide/bootstrapping#the-declarations-array)クラスをエクスポートしません。
たとえば、`HttpClientModule`は何もエクスポートしないので、再エクスポートする必要はありません。
その唯一の目的は、httpサービスプロバイダをアプリケーション全体に追加することです。


<hr/>


## `forRoot()`メソッドとは何ですか?

`forRoot()`静的メソッドは、開発者がシングルトンであることを意図したサービスとプロバイダーを簡単に設定できるようにするための規約です。`forRoot()`の良い例は、`RouterModule.forRoot()`メソッドです。

アプリケーションはルート全体でアプリケーション全体の `Router`サービスを設定するために`RouterModule.forRoot()`に`Routes`オブジェクトを渡します。
`RouterModule.forRoot()`は[ModuleWithProviders](api/core/ModuleWithProviders)を返します。
ルートの`AppModule`の`imports`配列にその結果を追加します。

`.forRoot()`の結果はルートアプリケーションモジュールである`AppModule`でだけ実行してインポートしてください。
他のモジュール、特に遅延ロードされるモジュールでインポートすると、
意に反しておそらくランタイムエラーが発生するでしょう。
詳細については[シングルトンサービス](guide/singleton-services)を参照してください。

サービスについては、`forRoot()`を使用するかわりにサービスの`@Injectable()`デコレーターに`providedIn: 'root'`を指定してください。
これはサービスを自動的にアプリケーション全体で有効にし、この結果としてデフォルトでシングルトンになります。

`RouterModule`は遅延ロードするモジュールのルートを設定するために`forChild`静的メソッドも提供しています。

`forRoot()`と`forChild()`はルートとフィーチャーモジュール
それぞれのサービスの設定を行うメソッドのための慣例的な名前です。

Angularはその名前について認識しませんが、Angular開発者はできます。
あなたがサービスプロバイダーを設定できる似たようなモジュールを書くときにこの規約にしたがってください。


<hr/>


## フィーチャーモジュールで提供されるサービスがどこでも見えるのはなぜですか?

プロバイダーはブートストラップするモジュールが持つアプリケーションのスコープの`@NgModule.providers`に追加されます。
`@NgModule.providers`にサービスプロバイダー追加することはアプリケーション全体に効果的にサービスを公開します。

1つのNgModuleをインポートしたとき、
Angularはモジュールのサービスプロバイダー(それの`providers`配列の内容)を
ルートインジェクターに追加します。


これにより、プロバイダーのルックアップトークンや、名前をしっているアプリケーション内のすべてのクラスにプロバイダーが見えるようになります。

NgModuleのインポートによる拡張性はNgModuleシステムの第一の目標です。
アプリケーションインジェクターにNgModuleのプロバイダーをマージすることは、
新しいサービスでアプリケーションすべてを充実させることがモジュールライブラリにとって簡単になります。
`HttpClientModule`を1回追加すると、すべてのアプリケーションのコンポーネントはHTTPリクエストできようになります。

しかしながら、フィーチャーモジュールで宣言したコンポーネントだけに見せたい場合は、
歓迎されない驚きのように感じるでしょう。
もし`HeroModule`が`HeroService`を提供していて、ルートの`AppModule`が`HeroModule`をインポートする場合、
`HeroModule`内で宣言したクラスだけでなく、`HeroService`の_型_を知っている任意のクラスでそのサービスを注入することができます。

サービスへのアクセスを制限するには、そのサービスを提供するNgModuleを遅延ロードすることを検討してください。詳細は[How do I restrict service scope to a module?](guide/ngmodule-faq#service-scope)を参照してください。

<hr/>

{@a q-lazy-loaded-module-provider-visibility}

## なぜ遅延ロードしたモジュールで提供されるサービスはそのモジュールだけで見れるのですか?

起動時にロードされるモジュールのプロバイダーとは異なり、
遅延ロードするモジュールのプロバイダーは*モジュールにスコープされます*。

Angularルーターがモジュールを遅延ロードするとき、新しい実行コンテキストを作成します。
その[コンテキストは自身のインジェクターを持ちます](guide/ngmodule-faq#q-why-child-injector "Why Angular creates a child injector")。これはアプリケーションインジェクターの直接の子供になります。

ルーターは遅延ロードしたモジュールのプロバイダーとそれがインポートしているNgModuleのプロバイダーをこの子供のインジェクターに追加します。

これらのプロバイダーは同じルックアップトークンを持つアプリケーションプロバイダーへの変更から隔離されます。
ルーターが遅延ロードしたコンテキスト内でコンポーネントを作成するとき、Angularはアプリケーションのルートインジェクターのサービスインスタンスよりもこれらのプロバイダーが作成したサービスインスタンスを優先します。

<hr/>


## 2つのモジュールが同じサービスを提供するとどうなりますか?

2つモジュールをインポートして、同時にロードし、同じトークンでプロバイダーを追加したとき、
2つ目のモジュールのプロバイダーが"勝ち"ます。両方のプロバイダーが同じインジェクターに追加されるからです。

Angularがそのトークンのサービスを注入するとき、
2つ目のプロバイダーからインスタンスが作成され、配信します。

このサービスを注入する_すべて_のクラスは2つ目のプロバイダーによって作成されたインスタンスを取得します。
1つ目のモジュールで宣言されたクラスであっても、2つ目のプロバイダーによって作成されたインスタンスを取得します。

NgModule Aがトークン'X'のサービスを提供していて、こちらもトークン'X'のサービスを提供しているNgModule Bをインポート場合、
NgModule Aのサービス定義が"勝ち"ます。

ルートの`AppModule`が提供するサービスはインポートしたNgModuleが提供するサービスよりも優先されます。
`AppModule`が常に勝ちます。

<hr/>

{@a service-scope}

## どのようにサービスのスコープをモジュールに制限しますか?

モジュールがアプリケーションの起動時にロードされたとき、
その`@NgModule.providers`は*アプリケーション全体のスコープ*を持ちます。
つまり、アプリケーション全体に注入することができます。

インポートしたプロバイダーは他のインポートしたNgModuleから簡単にプロバイダーで置き換えられます。
そのような置き換えはデザインによるものであることでしょう。それは意図的でなく、悪影響を及ぼす可能性があります。

原則として、プロバイダーをもつモジュールは_1回だけ_インポートしてください。できれば、アプリケーションの_ルートモジュール_内で。
それは通常、それらを設定、ラップ、オーバーライドするのに最適な場所です。

モジュールがすべてのhttpリクエストに特別なヘッダーを追加する、カスタマイズされた`HttpBackend`が必要であると仮定します。
アプリケーションの他のモジュールも`HttpBackendをカスタマイズしたり、単純に`HttpClientModule`をインポートした場合、
このモジュールの`HttpBackend`プロバイダーをオーバーライドして、特別なヘッダーが失われる可能性があります。サーバーはこのモジュールからのhttpリクエストを拒否するでしょう。

この問題を回避するためには、アプリケーションの_ルートモジュール_である`AppModule`でのみ`HttpClientModule`をインポートしてください。

このような"プロバイダーの破損"を防ぐ必要がある場合は、*起動時のモジュールの`プロバイダー`に依存してはいけません*。

できるならモジュールを遅延ロードしてください。
Angularは[遅延ロードするモジュール](guide/ngmodule-faq#q-lazy-loaded-module-provider-visibility)に自身の子供のインジェクターを与えます。
モジュールのプロバイダーはこのインジェクターで作成されたコンポーネントツリー内だけでみることができます。

アプリケーションを開始したときはモジュールを事前にロードする必要があります。
*かわりにコンポーネント内でサービスを提供してください*。

同じ例で続けます。モジュールのコンポーネントが本当にプライベートなカスタム`HttpBackend`を必要とすると仮定してください。

すべてのモジュールのコンポーネントのルートとして機能する"トップコンポーネント"を作成します。
カスタム`HttpBackend`プロバイダーをモジュールの`providers`ではなくコンポーネントの`providers`に追加してください。

Angularはコンポーネントインスタンスごとに子インジェクターを作成し、
コンポーネント自身のプロバイダーにインジェクターを追加します。

コンポーネントのの子供が`HttpBackend`サービスを呼び出すとき、
Angularはローカルの`HttpBackend`サービスを提供します。
アプリケーションのルートインジェクターに提供されたものではなく。
他のモジュールが`HttpBackend`に何をしても、子コンポーネントは適切なhttpリクエストを行います。

モジュールのトップコンポーネントの子としてモジュールコンポーネントを作成しておきなさい。

子コンポーネントをトップコンポーネントのテンプレートに埋め込むことができます。
別の方法として、指定した`<router-outlet>`でトップコンポーネントをルーティングホストに作成します。
子ルートを定義してルーターにモジュールのコンポーネントをアウトレットにロードさせます。

遅延ロードしたモジュールか、コンポーネント内でサービスを提供することでアクセスを制限することができますが、コンポーネント内でサービスを提供することでそれらのサービスのインスタンスが複数作成される可能性があります。したがって、遅延ロードのほうがより好ましいです。

<hr/>

{@a q-root-component-or-module}


## ルートの`AppModule`とルートの`AppComponent`のどちらにアプリケーション全体のプロバイダーを追加すべきですか?

アプリケーション全体のプロバイダーはその`@Injectable()`デコレーター(サービスの場合は)に`providedIn: 'root'`を指定することか、`InjectionToken`構文(トークンが提供された場合)で定義してください。この方法で自動的に作成されたプロバイダーはアプリケーション全体でユコウになり、どのモジュール内にも追加する必要はありません。

プロバイダーがこの方法(おそらくは懸命なデフォルト値をもたない)で作成できないばあいは、ルートの`AppModule`内のアプリケーション全体のプロバイダーに登録してください。`AppComponent`ではありません。

遅延ロードするモジュールとそれらのコンポーネントは`AppModule`のサービスを注入できます。
`AppComponent`のサービスを注入することはできません。

サービスが`AppComponent`ツリーの外側のコンポーネントから隠す必要がある場合に_のみ_`AppComponent`にサービスを登録してください。
これはレアなユースケースです。

より一般的に、コンポーネントよりも[NgModule内にプロバイダーを登録することをおすすめします](guide/ngmodule-faq#q-component-or-module)。

<h3 class="no-toc">ディスカッション</h3>

Angularはアプリケーションのルートインジェクターにすべてのスタートアップのモジュールプロバイダーを登録します。
ルートインジェクタープロバイダーのサービスはアプリケーションのスコープで作られます。
これは、アプリケーション全体でそれらが有効であることを意味します。

`Router`などの特定のサービスはそれらをアプリケーションのルートインジェクターに登録するときにのみ機能します。

一方、Angularは`AppComponent`自身のインジェクターで`AppComponent`のプロバイダーを登録します。
`AppComponent`のサービスはそのコンポーネントとコンポーネントツリーでのみ有効になります。
それらはコンポーネントスコープをもちます。

`AppComponent`のインジェクターはインジェクターの階層が一段下であるルートインジェクターの子供です。
ルーターを使用しないアプリケーションの場合は、ほとんどすべてのアプリケーションに該当します。
しかし、ルーティングされたアプリケーションではルーティングは
`AppComponent`サービスが存在しない場所のルートレベルで動作します。
これは遅延ロードするモジュールがそれらにリーチできないことを意味します。

<hr/>

{@a q-component-or-module}

## 他のプロバイダーをモジュールやコンポーネントに追加すべきですか?

Providers should be configured using `@Injectable` syntax. If possible, they should be provided in the application root (`providedIn: 'root'`). Services that are configured this way are lazily loaded if they are only used from a lazily loaded context.

If it's the consumer's decision whether a provider is available application-wide or not, 
then register providers in modules (`@NgModule.providers`) instead of registering in components (`@Component.providers`).

Register a provider with a component when you _must_ limit the scope of a service instance
to that component and its component tree.
Apply the same reasoning to registering a provider with a directive.

For example, an editing component that needs a private copy of a caching service should register
the service with the component.
Then each new instance of the component gets its own cached service instance.
The changes that editor makes in its service don't touch the instances elsewhere in the application.

[Always register _application-wide_ services with the root `AppModule`](guide/ngmodule-faq#q-root-component-or-module),
not the root `AppComponent`.

<hr/>

{@a q-why-bad}


## Why is it bad if a shared module provides a service to a lazy-loaded module?

### The eagerly loaded scenario
When an eagerly loaded module provides a service, for example a `UserService`, that service is available application-wide. If the root module provides `UserService` and
imports another module that provides the same `UserService`, Angular registers one of
them in the root app injector (see [What if I import the same module twice?](guide/ngmodule-faq#q-reimport)).

Then, when some component injects `UserService`, Angular finds it in the app root injector,
and delivers the app-wide singleton service. No problem.

### The lazy loaded scenario

Now consider a lazy loaded module that also provides a service called `UserService`.

When the router lazy loads a module, it creates a child injector and registers the `UserService`
provider with that child injector. The child injector is _not_ the root injector.

When Angular creates a lazy component for that module and injects `UserService`,
it finds a `UserService` provider in the lazy module's _child injector_
and creates a _new_ instance of the `UserService`.
This is an entirely different `UserService` instance
than the app-wide singleton version that Angular injected in one of the eagerly loaded components.

This scenario causes your app to create a new instance every time, instead of using the singleton.
<!--KW--What does this cause? I wasn't able to get the suggestion of this to work from
the current FAQ:
To demonstrate, run the <live-example name="ngmodule">live example</live-example>.
Modify the `SharedModule` so that it provides the `UserService` rather than the `CoreModule`.
Then toggle between the "Contact" and "Heroes" links a few times.
The username goes bonkers as the Angular creates a new `UserService` instance each time.
I'd like to see the error so I can include it.-->

<hr/>

{@a q-why-child-injector}

## Why does lazy loading create a child injector?

Angular adds `@NgModule.providers` to the application root injector, unless the NgModule is lazy-loaded.
For a lazy-loaded NgModule, Angular creates a _child injector_ and adds the module's providers to the child injector.

This means that an NgModule behaves differently depending on whether it's loaded during application start
or lazy-loaded later. Neglecting that difference can lead to [adverse consequences](guide/ngmodule-faq#q-why-bad).

Why doesn't Angular add lazy-loaded providers to the app root injector as it does for eagerly loaded NgModules?

The answer is grounded in a fundamental characteristic of the Angular dependency-injection system.
An injector can add providers _until it's first used_.
Once an injector starts creating and delivering services, its provider list is frozen; no new providers are allowed.

When an applications starts, Angular first configures the root injector with the providers of all eagerly loaded NgModules
_before_ creating its first component and injecting any of the provided services.
Once the application begins, the app root injector is closed to new providers.

Time passes and application logic triggers lazy loading of an NgModule.
Angular must add the lazy-loaded module's providers to an injector somewhere.
It can't add them to the app root injector because that injector is closed to new providers.
So Angular creates a new child injector for the lazy-loaded module context.

<hr/>

{@a q-is-it-loaded}

## How can I tell if an NgModule or service was previously loaded?

Some NgModules and their services should be loaded only once by the root `AppModule`.
Importing the module a second time by lazy loading a module could [produce errant behavior](guide/ngmodule-faq#q-why-bad)
that may be difficult to detect and diagnose.

To prevent this issue, write a constructor that attempts to inject the module or service
from the root app injector. If the injection succeeds, the class has been loaded a second time.
You can throw an error or take other remedial action.

Certain NgModules, such as `BrowserModule`, implement such a guard.
Here is a custom constructor for an NgModule called `CoreModule`.

<code-example path="ngmodule-faq/src/app/core/core.module.ts" region="ctor" title="src/app/core/core.module.ts (Constructor)" linenums="false">
</code-example>

<hr/>

{@a q-entry-component-defined}

## What is an `entry component`?

An entry component is any component that Angular loads _imperatively_ by type.

A component loaded _declaratively_ via its selector is _not_ an entry component.

Angular loads a component declaratively when
using the component's selector to locate the element in the template.
Angular then creates the HTML representation of the component and inserts it into the DOM at the selected element. These aren't entry components.

The bootstrapped root `AppComponent` is an _entry component_.
True, its selector matches an element tag in `index.html`.
But `index.html` isn't a component template and the `AppComponent`
selector doesn't match an element in any component template.

Components in route definitions are also _entry components_.
A route definition refers to a component by its _type_.
The router ignores a routed component's selector, if it even has one, and
loads the component dynamically into a `RouterOutlet`.

For more information, see [Entry Components](guide/entry-components).

<hr/>

## What's the difference between a _bootstrap_ component and an _entry component_?

A bootstrapped component _is_ an [entry component](guide/ngmodule-faq#q-entry-component-defined)
that Angular loads into the DOM during the bootstrap process (application launch).
Other entry components are loaded dynamically by other means, such as with the router.

The `@NgModule.bootstrap` property tells the compiler that this is an entry component _and_
it should generate code to bootstrap the application with this component.

There's no need to list a component in both the `bootstrap` and `entryComponents` lists,
although doing so is harmless.

For more information, see [Entry Components](guide/entry-components).

<hr/>

## When do I add components to _entryComponents_?

Most application developers won't need to add components to the `entryComponents`.

Angular adds certain components to _entry components_ automatically.
Components listed in `@NgModule.bootstrap` are added automatically.
Components referenced in router configuration are added automatically.
These two mechanisms account for almost all entry components.

If your app happens to bootstrap or dynamically load a component _by type_ in some other manner,
you must add it to `entryComponents` explicitly.

Although it's harmless to add components to this list,
it's best to add only the components that are truly _entry components_.
Don't include components that [are referenced](guide/ngmodule-faq#q-template-reference)
in the templates of other components.

For more information, see [Entry Components](guide/entry-components).

<hr/>


## Why does Angular need _entryComponents_?

The reason is _tree shaking_. For production apps you want to load the smallest, fastest code possible. The code should contain only the classes that you actually need.
It should exclude a component that's never used, whether or not that component is declared.

In fact, many libraries declare and export components you'll never use.
If you don't reference them, the tree shaker drops these components from the final code package.

If the [Angular compiler](guide/ngmodule-faq#q-angular-compiler) generated code for every declared component, it would defeat the purpose of the tree shaker.

Instead, the compiler adopts a recursive strategy that generates code only for the components you use.

The compiler starts with the entry components,
then it generates code for the declared components it [finds](guide/ngmodule-faq#q-template-reference) in an entry component's template,
then for the declared components it discovers in the templates of previously compiled components,
and so on. At the end of the process, the compiler has generated code for every entry component
and every component reachable from an entry component.

If a component isn't an _entry component_ or wasn't found in a template,
the compiler omits it.

<hr/>

## What kinds of modules should I have and how should I use them?

Every app is different. Developers have various levels of experience and comfort with the available choices.
Some suggestions and guidelines appear to have wide appeal.

### `SharedModule`
`SharedModule` is a conventional name for an `NgModule` with the components, directives, and pipes that you use
everywhere in your app. This module should consist entirely of `declarations`,
most of them exported.

The `SharedModule` may re-export other widget modules, such as `CommonModule`,
`FormsModule`, and NgModules with the UI controls that you use most widely.

The `SharedModule` should not have `providers` for reasons [explained previously](guide/ngmodule-faq#q-why-bad).
Nor should any of its imported or re-exported modules have `providers`.

Import the `SharedModule` in your _feature_ modules,
both those loaded when the app starts and those you lazy load later.

### `CoreModule`
`CoreModule` is a conventional name for an `NgModule` with `providers` for
the singleton services you load when the application starts.

Import `CoreModule` in the root `AppModule` only.
Never import `CoreModule` in any other module.

Consider making `CoreModule` a pure services module
with no `declarations`.

For more information, see [Sharing NgModules](guide/sharing-ngmodules)
and [Singleton Services](guide/singleton-services).

### Feature Modules

Feature modules are modules you create around specific application business domains, user workflows, and utility collections. They support your app by containing a particular feature,
such as routes, services, widgets, etc. To conceptualize what a feature module might be in your
app, consider that if you would put the files related to a certain functionality, like a search,
in one folder, that the contents of that folder would be a feature module that you might call
your `SearchModule`. It would contain all of the components, routing, and templates that
would make up the search functionality.

For more information, see [Feature Modules](guide/feature-modules) and
[Module Types](guide/module-types)



## What's the difference between NgModules and JavaScript Modules?

In an Angular app, NgModules and JavaScript modules work together.

In modern JavaScript, every file is a module
(see the [Modules](http://exploringjs.com/es6/ch_modules.html) page of the Exploring ES6 website).
Within each file you write an `export` statement to make parts of the module public.

An Angular NgModule is a class with the `@NgModule` decorator&mdash;JavaScript modules
don't have to have the `@NgModule` decorator. Angular's `NgModule` has `imports` and `exports` and they serve a similar purpose.

You _import_ other NgModules so you can use their exported classes in component templates.
You _export_ this NgModule's classes so they can be imported and used by components of _other_ NgModules.

For more information, see [JavaScript Modules vs. NgModules](guide/ngmodule-vs-jsmodule).

<hr/>

{@a q-template-reference}

## How does Angular find components, directives, and pipes in a template?<br>What is a <i><b>template reference</b></i>?

The [Angular compiler](guide/ngmodule-faq#q-angular-compiler) looks inside component templates
for other components, directives, and pipes. When it finds one, that's a template reference.

The Angular compiler finds a component or directive in a template when it can match the *selector* of that component or directive to some HTML in that template.

The compiler finds a pipe if the pipe's *name* appears within the pipe syntax of the template HTML.

Angular only matches selectors and pipe names for classes that are declared by this module
or exported by a module that this module imports.

<hr/>

{@a q-angular-compiler}

## What is the Angular compiler?

The Angular compiler converts the application code you write into highly performant JavaScript code.
The `@NgModule` metadata plays an important role in guiding the compilation process.

The code you write isn't immediately executable. For example, components have templates that contain custom elements, attribute directives, Angular binding declarations,
and some peculiar syntax that clearly isn't native HTML.

The Angular compiler reads the template markup,
combines it with the corresponding component class code, and emits _component factories_.

A component factory creates a pure, 100% JavaScript representation
of the component that incorporates everything described in its `@Component` metadata:
the HTML, the binding instructions, the attached styles.

Because directives and pipes appear in component templates,
the Angular compiler incorporates them into compiled component code too.

`@NgModule` metadata tells the Angular compiler what components to compile for this module and
how to link this module with other modules.
