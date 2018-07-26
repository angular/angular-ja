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

プロバイダーは`@Injectable`構文を使用して設定すべきです。もし可能ならば、アプリケーションルート(`providedIn: 'root'`)に提供されるべきです。この方法で設定されたサービスは遅延ロードされたコンテキストでのみ使用される場合に遅延ロードされます。

プロバイダーがアプリケーション全体で利用可能かどうか、利用者の判断である場合、
コンポーネント内(`@Component.providers`)に登録するかわりにモジュール内(`@NgModule.providers`)にプロバイダーを登録してください。

対象のコンポーネントとそのコンポーネントツリーのインスタンスにサービスすのスコープを制限する_ひつようがある_とき、
コンポーネントにプロバイダーを登録してください。
ディレクティブにプロバイダーを登録するときも同じ理由を適用します。

たとえば、作詞しているコンポーネント、プライベートのコピーが必要、キャッシュしているサービスの、コンポーネントにサービスを登録すべきです。
それぞれのコンポーネントの新しいインスタンスは各自キャッシュされたサービスのインスタンスを得ます。
エディタがそのサービスで行う変更は、アプリケーション内の他のインスタンスには触れません。

[ いつでもルートの`AppModule`に_アプリケーション全体_ のサービスを登録してください](guide/ngmodule-faq#q-root-component-or-module)、
`AppComponent`ではありません。

<hr/>

{@a q-why-bad}


## なぜ共有モジュールが遅延ロードするモジュールにサービスを提供することがわるいことなのですか?

### 事前ロードでのシナリオ
事前ロードするモジュールがサービスを提供するとき、たとえば`UserService`、そのサービスはアプリケーション全体で有効になります。
ルートモジュールが`UserService`提供していて、`UserService`を提供する別のモジュールをインポートしている場合、Angularはそれらのう1つをルートアプリケーションインジェクターにに登録します([2つのモジュールが同じサービスを提供するとどうなりますか?](guide/ngmodule-faq#q-reimport)を参照してください)。

そのあと、コンポーネントが`UserService`を注入したとき、Angularはルートアプリケーションインジェクター内からそれをみつけて、
アプリケーション全体でシングルトンなサービスを渡します。問題ありません。

### 遅延ロードでのシナリオ

次に、`UserService`と呼ばれるサービスを提供する遅延ロードモジュールを考えてみましょう。

ルーターがモジュールを遅延ロードするとき、それは子インジェクターを作成して、その子インジェクターに`UserService`プロバイダーを登録します。
子インジェクターはルートインジェクターでは_ありません_。

Angularがそのモジュールの遅延コンポーネントを作成して`UserService`を注入するとき、
それは遅延モジュールの_子インジェクター_内の`UserService`をみつけて、
`UserService`の_新しい_インスタンスを生成します。
これは完全にAngularが事前ロードしたコンポーネントで注入した、アプリケーション全体でシングルトンなバージョンとは違うインスタンスになります。

このシナリオでは、シングルトンを使用する代わりに、毎回新しいインスタンスが作成されます。
<!--KW--What does this cause? I wasn't able to get the suggestion of this to work from
the current FAQ:
To demonstrate, run the <live-example name="ngmodule">live example</live-example>.
Modify the `SharedModule` so that it provides the `UserService` rather than the `CoreModule`.
Then toggle between the "Contact" and "Heroes" links a few times.
The username goes bonkers as the Angular creates a new `UserService` instance each time.
I'd like to see the error so I can include it.-->

<hr/>

{@a q-why-child-injector}

## なぜ遅延ロードは子インジェクターを作成するのですか?

Angularは`@NgModule.providers`をアプリケーションのルートインジェクターに追加します。NgModuleが遅延ロードしていない場合。
遅延ロードするNgModuleでは、Angularは_子インジェクター_を作成して、モジュールのプロバイダーを子インジェクターに追加します。

NgModuleが起動時にロードされるのか、遅延ロードされるのかによって動作が異なることを意味します。
その違いを軽視すると、[悪影響](guide/ngmodule-faq#q-why-bad)につながる恐れがあります。

なぜAngularは事前ロードしたNgModule同様に、遅延ロードしたプロバイダーをアプリケーションのルートインジェクターに追加しないのでしょうか?

その答えは、Angularの依存性の注入システムの基本的な特性にもとづいています。
インジェクターは_それがはじめて使用するまでに_プロバイダーを追加できます。
インジェクターがいちどサービスを作成して配送しはじめたら、そのプロバイダーのリストは固定されます。新しいプロバイダーは許容されません。

アプリケーションを起動したとき、Angularは最初にすべての最初のコンポーネントを作成して、提供されたサービスを注入する_前_の事前ロードしたNgModuleのプロバイダーでルートインジェクターを設定します。
いちどアプリケーションが起動したらアプリケーションのルートインジェクターは新しいプロバイダーを受け付けません。

時間が経過して、アプリケーションのロジックがNgModuleの遅延ロードを発火します。
Angularは、遅延ロードしたモジュールのプロバイダーをどこかのインジェクターに追加する必要があります。
アプリケーションルートインジェクターは新しいプロバイダーを受け付けないためそこに追加することはできません。
したがって、Angularは遅延ロードしたモジュールのコンテキストのための新しい子インジェクターを作成します。

<hr/>

{@a q-is-it-loaded}

## NgModuleまたはサービスが以前にロードされたかどうかをどのように確認できますか?

いくつかのNgModuleとそれらのサービスはルートの`AppModule`から一度だけロードする必要があります。
遅延ロードするモジュールから2回目にインポートするモジュールは[誤った行動](guide/ngmodule-faq#q-why-bad)をみつけて診断することが難しいでしょう。

この問題を防ぐために、ルートアプリケーションインジェクターからモジュールまたはサービスを注入するコンストラクタを書きましょう。
注入が成功した場合、クラスは2回目にロードされたということです。
エラーをスローしたり、他の是正措置を講じることができます。

特定のNgModule、たとえば`BrowserModule`のように、ガードを実装しましょう。
ここには`CoreModule`と呼ばれるNgModuleのためのカスタムコンストラクタがあります。

<code-example path="ngmodule-faq/src/app/core/core.module.ts" region="ctor" title="src/app/core/core.module.ts (Constructor)" linenums="false">
</code-example>

<hr/>

{@a q-entry-component-defined}

## `entry component`とは何ですか?

エントリーコンポーネントとはAngularが_命令的に_ロードするタイプの任意のコンポーネントです。

エントリーコンポーネントで_ない_コンポーネントはセレクター経由で_宣言的に_ロードされます。

コンポーネントのセレクターがテンプレートのエレメントに置かれているときにAngularは宣言的にコンポーネントをロードします。
AngularはそのあとコンポーネントのHTML表現を作成して、選択した要素のDOMの中に挿入します。
それらはエントリーコンポーネントではありません。

ブートストラップしたルートの`AppComponent`は_エントリーコンポーネント_です。
真実、そのセレクターは`index.html`の要素タグにマッチします。
しかし、`index.html`はコンポーネントのテンプレートではなく、`AppComponent`
のセレクターはどのコンポーネントテンプレートにもマッチしません。

ルート定義内のコンポーネントも_エントリーコンポーネント_です。
ルート定義はその_型_からコンポーネントを参照します。
ルーターはルーテッドコンポーネントのセレクターを無視します(セレクターを持っていても)。
そして`RouterOutlet`内に動的にコンポーネントをロードします。

詳細については、[エントリーコンポーネント](guide/entry-components)を参照してください。

<hr/>

## _ブートストラップ_したコンポーネントと_エントリーコンポーネント_の違いは何ですか?

ブートストラップしたコンポーネントはAngularがブートストラッププロセス(アプリケーションの起動)中にDOMにロードする[エントリーコンポーネント](guide/ngmodule-faq#q-entry-component-defined)
の1つです。
他のエントリーコンポーネントは他の理由で動的にロードされます。たとえばルーターから。

`@NgModule.bootstrap`プロパティはこれはエントリーコンポーネントでアプリケーションをこのコンポーネントでブートストラップするためコードを生成する必要があると教えます。

コンポーネントを`bootstrap`、`entryComponents`配列両方に追加する必要はありません。そうしても無害ですが。

詳細については[エントリーコンポーネント](guide/entry-components)を参照してください。

<hr/>

## いつ_エントリーコンポーネント_を追加しますか?

ほとんどのアプリケーション開発者は`entryComponents`にコンポーネントを追加する必要はありません。

Angularは特定のコンポーネントを自動的に_エントリーコンポーネント_として追加します。
`@NgModule.bootstrap`に追加したコンポーネントは自動的に追加されます。
ルーター定義によって参照されるコンポーネントは自動的に追加されます。
この2つのメカニズムによってほぼすべてのエントリーコンポーネントが占められます。


あなたのアプリケーションが他の方法でタイプ別にブートストラップまたは動的にコンポーネントをロードする場合は、それを明示的に `entryComponents`に追加する必要があります。

このリストにコンポーネントを追加することは無害ですが、
本当に_エントリーコンポーネント_であるものだけを追加するのが最善です。
ほかのコンポーネントのテンプレートで[参照される](guide/ngmodule-faq#q-template-reference)コンポーネントは含めないでください。

詳細については[エントリーコンポーネント](guide/entry-components)を参照してください。

<hr/>


## なぜAngularは_entryComponents_が必要なのですか?

_ツリーシェイキング_のためです。プロダクションのアプリケーションでは、可能な限り最小、最速のコードをロードしたいです。コードには実際に必要なクラスのみが含まれている必要があります。
そのコンポーネントが宣言されているかどうかにかかわらず、使用されていないコンポーネントは除外する必要があります。

事実、多くのライブラリは使用されないであろうコンポーネントを宣言、エクスポートしています。
それらを参照してない場合、ツリーシェイカーは最終的なコードパッケージからそれらのコンポーネントを除外します。

If the [Angularコンパイラ](guide/ngmodule-faq#q-angular-compiler)がすべての宣言したコンポーネントを生成した場合、ツリーシェイカーの目的を破ってしまうでしょう。

かわりに、コンパイラは使用するコンポーネントのみのコードを生成する再帰的な戦略を採用しています。

コンパイラはエントリーコンポーネントから開始します。
それから宣言したコンポーネントをエントリーコンポーネントのテンプレートから[探して](guide/ngmodule-faq#q-template-reference)コードを生成し、

宣言されたコンポーネントについては、以前にコンパイルされたコンポーネントのテンプレートなどで検出されます。
プロセスの最後では、コンパイラはすべてのエントリーコンポーネントとエントリーコンポーネントから到達できるすべてのコンポーネントの生成されたコードをもちます。

コンポーネントが_エントリーコンポーネント_でない、もしくはテンプレート内にない場合はコンパイラはそれを切り捨てます。

<hr/>

## どのような種類のモジュールが必要ですか、どうすれば使用できますか?

すべてのアプリケーションは違います。開発者は、さまざまなレベルの経験と快適さを利用できる選択肢を持っています。
いくつかの提案とガイドラインには、幅広い魅力があります。

### `SharedModule`
`SharedModule`は、アプリケーション内のどこでも使用するコンポーネント、ディレクティブ、パイプを持つ`NgModule`の伝統的な名前です。 このモジュールは完全に `declarations`で構成され、そのほとんどはエクスポートされます。

`SharedModule`は` CommonModule`、 `FormsModule`、NgModulesのような他のウィジェットモジュールを最も広く使用するUIコントロールで再エクスポートすることができます。

`SharedModule`は、理由のために（前に説明したように）` provider`を持つべきではありません[explained previously](guide/ngmodule-faq#q-why-bad)。
また、輸入または再輸出されたモジュールのいずれにも「提供者」がない。

あなたの_feature_モジュールに `SharedModule`をインポートし、
アプリケーションの起動時に読み込まれたものと、遅れて読み込まれたものの両方です。

### `CoreModule`
`CoreModule`はアプリケーションの起動時のシングルトンサービスのための`providers`をもつ`NgModule`のための伝統的な名前です。

`CoreModule`はルートの`AppModule`のみにインポートしてください。
他のモジュール内で`CoreModule`をインポートしないでください。


`CoreModule`を宣言のない純粋なサービスモジュールにすることを検討してください。

詳細については、[NgModuleの共有](guide/sharing-ngmodules)と
[シングルトンサービス](guide/singleton-services)を参照してください。

### フィーチャーモジュール

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
