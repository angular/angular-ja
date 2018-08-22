{@a top}
# テスト

このガイドでは、Angularアプリケーションでのユニット、インテグレーションテストのヒントとテクニックについて説明します。

このガイドでは、[_ツアー・オブ・ヒーロー_チュートリアル](tutorial)によく似たサンプルCLIアプリケーションのテストを紹介します。
このガイド内のサンプルアプリケーションとすべてのテストは検査と実験に使用できます:

* <live-example embedded-style>サンプルアプリケーション</live-example>
* <live-example stackblitz="specs">テスト</live-example>

<hr>

## セットアップ

Angular CLIは[Jasmineテストフレームワーク](https://jasmine.github.io/)を使用してAngularアプリケーションのテストを行うために必要なものすべてをダウンロードしてインストールします。

CLIを使用して作成したプロジェクトは、すぐにテストする準備ができています。
この1つのCLIコマンドを実行するだけです:

<code-example language="sh" class="code-shell">
  ng test
</code-example>

`ng test`コマンドはアプリケーションを_ウォッチモード_でビルドして、
[karmaテストランナー](https://karma-runner.github.io/1.0/index.html)を起動します。

コンソールのアウトプットはこのようになります:

<code-example language="sh" class="code-shell">
10% building modules 1/1 modules 0 active
...INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
...INFO [launcher]: Launching browser Chrome ...
...INFO [launcher]: Starting browser Chrome
...INFO [Chrome ...]: Connected on socket ... 
Chrome ...: Executed 3 of 3 SUCCESS (0.135 secs / 0.205 secs)
</code-example>

ログの最後の行が最も重要です。
これはKarmaが3つのテストすべてをパスしたことを示します。

Chromeブラウザも開き、"Jasmine HTML Reporter"内にこのようにテストのアウトプットを表示します。

<figure>
  <img src='generated/images/guide/testing/initial-jasmine-html-reporter.png' alt="Jasmine HTML Reporter in the browser">
</figure>

ほとんどの人にとって、このブラウザのアウトプットのほうがコンソールのログよりも読みやすいでしょう。
テスト行をクリックしてそのテストだけを再実行したり、説明をクリックして選択したテストグループ("test suite")を再実行することができます。

そのあいだに、`ng test`コマンドは変更を監視しています。

このアクションを確認するために、`app.component.ts`に小さな変更を加えて保存してみましょう。
テストが再び実行され、ブラウザがリフレッシュされ、新しいテストの結果が表示されます。

#### 設定

CLIはあなたのためにJasmineとKarmaの設定を引き受けます。

`src/`フォルダ内の`karma.conf.js`と`test.ts`ファイルを編集することで、
多くのオプションの微調整ができます。

`karma.conf.js`はKarmaの設定ファイルの一部です。
CLIは`karma.conf.js`で補完された`application.json`内で指定されたアプリケーションの構造をもとにメモリ内にすべてのランタイムの設定を構築します。

JasmineとKarmaの設定の詳細についてはWebで検索してください。

#### 他のテストフレームワーク

他のテスティングライブラリーとテストランナーを使用してAngularアプリケーションのユニットテストを行うこともできます。
各ライブラリ、ランナーは独自のインストール手順、設定、および構文をもちます。

詳細はWebで検索してください。

#### テストファイルの名前と場所

`src/app`フォルダ内をみてください。

CLIは`AppComponent`のための`app.component.spec.ts`という名前のテストファイルを生成しました。

<div class="alert is-important">

ツールがテストに使用するファイル(または、_スペック_ファイル)だと識別できるように、テストファイルの拡張子は**`.spec.ts`でないといけません**。

</div>

`app.component.ts`と`app.component.spec.ts`ファイルは同じフォルダ内に置きます。
ルートファイル名(`app.component`)は両方のファイルで同じにします。

あなた自身のプロジェクトの_すべての種類_のテストファイルにおいてこれら2つの慣習を採用してください。

## サービスのテスト

サービスはユニットテストをするのに最も簡単なファイルなことが多いです。
ここでは`ValueService`のいくつかの同期、非同期ユニットテストを
Angularのテスティングユーティリティの補助なしで書いています。

<code-example path="testing/src/app/demo/demo.spec.ts" region="ValueService" title="app/demo/demo.spec.ts"></code-example>

{@a services-with-dependencies}

#### 依存関係をもつサービス

サービスはAngularがコンストラクタに注入する他のサービスに依存するということがよくあります。
多くの場合、サービスのコンストラクタ呼び出しのときに手動でそれらの依存関係を作成、
_注入_することは簡単なことです。

`MasterService`は簡単な例です:

<code-example path="testing/src/app/demo/demo.ts" region="MasterService" title="app/demo/demo.ts" linenums="false"></code-example>

`MasterService`は注入した`ValueService`の`getValue`メソッドを委譲するだけです。

これをテストする方法はいくつかあります。

<code-example path="testing/src/app/demo/demo.spec.ts" region="MasterService" title="app/demo/demo.spec.ts"></code-example>

最初のテストでは`new`を使用して`ValueService`を生成して、`MasterService`コンストラクタに渡しています。

しかし、現実のサービスを注入することは、ほとんどの依存するサービスが作成、コントロールすることが難しいのでほとんど機能しません。

かわりに、
依存をモックしたり、ダミーの値を使用したり、
適切なサービスメソッドの[スパイ](https://jasmine.github.io/2.0/introduction.html#section-Spies)を作成することができます。

<div class="alert is-helpful">

スパイは通常サービスをモックするのに最も簡単な方法であるため好まれます。

</div>

これらの標準的なテスト手法は分離したサービスのユニットテストで素晴らしいです。

しかし、ほとんどいつでもAngularの依存性の注入を使用してアプリケーションクラスにサービスを注入していて、
その使用パターンを反映したテストが必要になります。
Angularのテスティングユーティリティはどのように注入したサービスの振る舞うか調べることを簡単にします。

#### _TestBed_を使用してサービスのテストをする

あなたのアプリケーションはサービスを作成するためにAngularの[依存性の注入(DI)](guide/dependency-injection)
に頼ります。
サービスが依存するサービスをもつとき、DIはその依存するサービスを探すか作成します。
さらにその依存するサービスが自身の依存性をもつ場合、DIは同じように探すか作成します。

サービスの_利用者_として、これについて心配する必要はありません。
コンストラクタの引数の順序や、それらがどうやって作成されるのかを心配する必要はありません。

サービスの_テスター_として、サービスの依存性のファーストレベルについて少しだけ考える必要があります。
しかし、サービスの提供と生成のために`TestBed`テスティングユーティリティを使用したとき、AngularのDIにサービスの生成とコンストラクタの引数の順序を決めさせることが_できます_。

{@a testbed}

#### Angular _TestBed_

`TestBed`はAngularテスティングユーティリティで最も重要なものです。
`TestBed`はAngularの[@NgModule](guide/ngmodules)をエミュレートした、動的に生成されたAngular_テスト_モジュールを作成します。

`TestBed.configureTestingModule()`メソッドは[@NgModule](guide/ngmodules)のプロパティのほとんどをもつことができるメタデータオブジェクトを受け取ります。

サービスをテストするために、
テストやモックしたいサービスの配列を`providers`メタデータプロパティにセットします。

<code-example 
  path="testing/src/app/demo/demo.testbed.spec.ts" 
  region="value-service-before-each" 
  title="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach">
</code-example>

それからサービスのクラスを引数として`TestBed.get()`を呼び出してテスト内部でそれを注入します。

<code-example 
  path="testing/src/app/demo/demo.testbed.spec.ts" 
  region="value-service-inject-it">
</code-example>

または、もしセットアップの1部分としてサービスの注入することを選ぶならば、`beforeEach()`内部で行ってください。

<code-example 
  path="testing/src/app/demo/demo.testbed.spec.ts" 
  region="value-service-inject-before-each">
</code-example>

依存関係をもつサービスのテストをするときは、`providers`配列内にモックを提供してください。

次の例では、モックはスパイオブジェクトです。

<code-example 
  path="testing/src/app/demo/demo.testbed.spec.ts" 
  region="master-service-before-each" linenums="false">
</code-example>

このテストではさきほどと同じようにスパイを使用します。

<code-example 
  path="testing/src/app/demo/demo.testbed.spec.ts" 
  region="master-service-it">
</code-example>

{@a no-before-each}
#### _beforeEach()_を使用せずテストする

それぞれの`it()`テストのための前提条件をセットするためにこのガイド内のほとんどのテストで`beforeEach()`を呼び出します。
そしてクラスの生成とサービスの注入のために`TestBed`に頼ります。

`beforeEach()`を消して呼び出さないテストの他校と`TestBed`を使用するかわりに明示的にクラスを作成します。

このスタイルでの`MasterService`のテストを書き直す方法はこれです。

`beforeEach()`のかわりに再利用可能な、_セットアップ_関数内の準備コードから始めてください。

<code-example 
  path="testing/src/app/demo/demo.spec.ts" 
  region="no-before-each-setup"
  title="app/demo/demo.spec.ts (setup)" linenums="false">
</code-example>

`setup()`関数は`masterService`のようなテストが参照する変数を含むオブジェクトリテラルを返します。
`describe()`の本体に_準グローバル_な変数(例えば、`let masterService: MasterService`)を定義しないでください。

それから、それぞれのテストの最初の行でテストサブジェクトを操作するステップの前に`setup()`を実行し、
期待する値をアサートします。

<code-example 
  path="testing/src/app/demo/demo.spec.ts" 
  region="no-before-each-test" linenums="false">
</code-example>

必要なセットアップ変数を抽出するために
[_destructuring assignment_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)をテストで使用する方法に注目してください。

<code-example 
  path="testing/src/app/demo/demo.spec.ts" 
  region="no-before-each-setup-call">
</code-example>

多くの開発者にとってこのアプローチは伝統的な`beforeEach()`スタイルよりも明快でより明確であると感じます。

このテストガイドでは伝統的なスタイルとデフォルトの[CLI schematics](https://github.com/angular/devkit)
が生成した`beforeEech()`と`TestBed`を含むテストファイルにしたがいますが、
_この代替アプローチ_を自身のプロジェクト内で採用することは自由です。

#### HTTPサービスをテストする

リモートサーバーにHTTPコールをするデータサービスは、通常、XHRコールのためにAngularの[`HttpClient`](guide/http)サービスを注入して委譲します。

依存関係をもつ任意のサービスをテストするために注入された`HttpClient`のスパイを使用してデータサービスのテストができます。
<code-example 
  path="testing/src/app/model/hero.service.spec.ts" 
  region="test-with-spies"
  title="app/model/hero.service.spec.ts (tests with spies)">
</code-example>

<div class="alert is-important">

`HeroService`メソッドは`Observable`を返します。
あなたは(a)それを実行させるためと、(b)成功、失敗メソッドをアサートするために、オブサーバブルを_購読_する必要があります。

`subscribe()`メソッドは成功(`next`)と失敗(`error`)コールバックを受け取ります。
エラーをキャプチャーするために_両方の_コールバックを提供することを確認してください。
これを怠ると、テストランナーが完全に異なるテストに属している可能性が高い、非同期で観察不能なエラーが生成されます。

</div>

#### _HttpClientTestingModule_

データサービスと`HttpClient`の間の拡張されたやりとりはスパイでモックするには複雑で難しい場合があります。

`HttpClientTestingModule`はそれらのテストシナリオをもっと管理可能にできます。


このガイドに付属する_コードサンプル_で`HttpClientTestingModule`のデモをする前に、
このページは[Httpガイド](guide/http#testing-http-requests)に先送りにします。
これは`HttpClientTestingModule`を使用したテストの詳細をカバーします。

<div class="alert is-helpful">

このガイドのサンプルコードは`app/model/http-hero.service.spec.ts`での
_レガシー_な`HttpModule`のテストのデモもしています。

</div>


## コンポーネントテストの基本

コンポーネントは、Angularアプリケーションの他のすべての部分とは違い、
HTMLテンプレートとTypeScriptクラスを組み合わせています。
コンポーネントは本当にテンプレートとクラスが_一緒に動作します_。
そして、
適切にコンポーネントをテストするためには、
目的通りにそれらを一緒に動作させるテストをする必要があります。

このようなテストでは、
AngularがするようにブラウザのDOMにコンポーネントのホスト要素を作成し、
コンポーネントクラスとテンプレートとして定義されたDOMとのやり取りを調査する必要があります。


Angularの`TestBed`は次のセクションで見るようなこの種類のテストを容易にします。
しかし、多くの場合、DOMの関与無しで_このクラスだけでテストすること_は
コンポーネントの振る舞いをより簡単で明白な方法で検証できます。

### コンポーネントクラスのテスト

サービスクラスをテストするのと同じように、コンポーネントクラスを独自にテストします。

ユーザーがボタンをクリックしたときにライトをオン/オフ（オンスクリーンメッセージで表される）に切り替えるこの`LightswitchComponent`を考えてみましょう。

<code-example 
  path="testing/src/app/demo/demo.ts" 
  region="LightswitchComp" 
  title="app/demo/demo.ts (LightswitchComp)" linenums="false">
</code-example>

`click()`メソッドがライトの_オン/オフ_状態を切り替えるだけで、メッセージを適切に設定することをテストすることができます。
You might decide only to test that the `clicked()` method
toggles the light's _on/off_ state and sets the message appropriately.

このコンポーネントクラスは依存関係がありません。 依存関係のないサービスをテストするには、`new`でサービスを作成し、そのAPIを突き刺して、公開されている状態の期待する値をアサートします。コンポーネントクラスと同じ操作を行います。

<code-example 
  path="testing/src/app/demo/demo.spec.ts" 
  region="Lightswitch" 
  title="app/demo/demo.spec.ts (Lightswitch tests)" linenums="false">
</code-example>

ここでは_ツアー・オブ・ヒーロー_チュートリアルから`DashboardHeroComponent`についてみます。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.ts" 
  region="class" 
  title="app/dashboard/dashboard-hero.component.ts (component)" linenums="false">
</code-example>

_ヒーロー_を`@Input`プロパティにバインドし、選択された`@Output`プロパティを使用して生成されたイベントをリッスンする親コンポーネントのテンプレート内に表示されます。

`DashboardHeroComponent`またはその親コンポーネントを作成せずにクラスコードが動作することをテストできます。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" 
  region="class-only" 
  title="app/dashboard/dashboard-hero.component.spec.ts (class tests)" linenums="false">
</code-example>

コンポーネントに依存関係がある場合、`TestBed`を使用してコンポーネントとその依存関係を作成することができます。

次の`WelcomeComponent`は、`UserService`に依存して、挨拶するユーザーの名前を知っています。

<code-example 
  path="testing/src/app/welcome/welcome.component.ts" 
  region="class"
  title="app/welcome/welcome.component.ts" linenums="false">
</code-example>

まず、このコンポーネントの最小限のニーズを満たす`UserService`のモックを作成します。

<code-example 
  path="testing/src/app/welcome/welcome.component.spec.ts" 
  region="mock-user-service" 
  title="app/welcome/welcome.component.spec.ts (MockUserService)" linenums="false">
</code-example>

次に、**コンポーネント**と_サービス_の_両方_を`TestBed`の設定で提供して注入します。


<code-example 
  path="testing/src/app/welcome/welcome.component.spec.ts" 
  region="class-only-before-each" 
  title="app/welcome/welcome.component.spec.ts (class-only setup)" linenums="false">
</code-example>

次に、コンポーネントクラスを実行し、[ライフサイクルフックメソッド](guide/lifecycle-hooks)をAngularがアプリケーションの実行時に呼び出すことを覚えておいてください。

<code-example 
  path="testing/src/app/welcome/welcome.component.spec.ts" 
  region="class-only-tests" 
  title="app/welcome/welcome.component.spec.ts (class-only tests)" linenums="false">
</code-example>

### コンポーネントのDOMのテスト

コンポーネントクラスのテストは、サービスをテストするのと同じくらい簡単です。

しかし、コンポーネントは_クラスだけ_ではありません。 コンポーネントは、DOMや他のコンポーネントと対話します。 クラスのみのテストでは、クラスの動作について教えてくれます。 コンポーネントが適切にレンダリングされ、ユーザーの入力とジェスチャーに応答したり、親コンポーネントと子コンポーネントと統合されたりするかどうかは、ユーザーからはわかりません。

上記の_クラスのみ_のテストでは、コンポーネントが実際に画面上でどのように動作するかについての重要な質問に答えることはできません。

* `Lightswitch.clicked()`はユーザが呼び出せるようなものにバインドされていますか？
* `Lightswitch.message`は表示されていますか？
* ユーザーは実際に`DashboardHeroComponent`で表示されるヒーローを選択できますか？
* 主人公の名前は、大文字で表示されますか？
* ウェルカムメッセージは`WelcomeComponent`のテンプレートで表示されますか？

これらは、上に示した単純なコンポーネントの問題ではないかもしれません。 しかし、多くのコンポーネントは、テンプレートに記述されているDOM要素と複雑なやり取りをしているため、コンポーネントの状態が変わるとHTMLが表示され消えます。

これらの種類の質問に答えるには、コンポーネントに関連付けられたDOM要素を作成する必要があります。DOMを調べて、コンポーネント状態が適切なタイミングで適切に表示されることを確認し、画面とのユーザー対話をシミュレートして、 コンポーネントが期待どおりに動作するようにします。

この種のテストを作成するには、`TestBed`のその他の機能と他のテストヘルパを使用します。

#### CLIが生成したテスト

CLIは、新しいコンポーネントの生成を要求すると、デフォルトで初期テストファイルを作成します。

たとえば、次のCLIコマンドは、`app/banner`フォルダ（インラインのテンプレートとスタイル）に`BannerComponent`を生成ます:

<code-example language="sh" class="code-shell">
ng generate component banner --inline-template --inline-style --module app
</code-example>

また、このような外観のコンポーネント`banner-external.component.spec.ts`の初期テストファイルを生成します

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v1"
  title="app/banner/banner-external.component.spec.ts (initial)" linenums="false">
</code-example>

#### セットアップを減らす

このファイルの最後の3行だけが実際にコンポーネントをテストし、Angularがコンポーネントを作成できると主張します。

ファイルの残りの部分は、構成要素が相当なものに発展した場合に必要となるより高度なテストを予期する定型的なセットアップコードです。

以下のこれらの高度なテスト機能について学びます。 現時点では、このテストファイルを大幅に縮小してより管理しやすいサイズにすることができます:

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v2"
  title="app/banner/banner-initial.component.spec.ts (minimal)" linenums="false">
</code-example>

この例では、`TestBed.configureTestingModule`に渡されたメタデータオブジェクトは、単にテストするコンポーネント`BannerComponent`を宣言します。

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="configureTestingModule">
</code-example>

<div class="alert is-helpful">

宣言したり、他のものをインポートする必要はありません。 デフォルトのテストモジュールは、`@angular/platform-browser`の`BrowserModule`のようなものがあらかじめ設定されています。

後で、テストニーズに合わせて、インポート、プロバイダ、およびその他の宣言で`TestBed.configureTestingModule()`を呼び出します。 オプションのオーバーライドメソッドを使用すると、構成の側面をさらに細かく調整できます。

</div>

{@a create-component}

#### _createComponent()_

`TestBed`を設定したら`createComponent()`メソッドをよびだします。

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="createComponent">
</code-example>

`TestBed.createComponent()`は、
`BannerComponent`のインスタンスを作成し、
対応する要素をテストランナーDOMに追加し、[`ComponentFixture`](#component-fixture)を返します。

<div class="alert is-important">

`createComponent`の呼び出し後に`TestBed`を再構成しないでください。

`createComponent`メソッドは現在の`TestBed`定義をフリーズさせ、それを閉じてさらに設定します。

`configureTestingModule()`、`get()`、`override...`メソッドのいずれも、`TestBed`設定メソッドを呼び出すことはできません。 試してみると、`TestBed`はエラーを投げます。

</div>

{@a component-fixture}

#### _ComponentFixture_

[ComponentFixture](api/core/testing/ComponentFixture)は、作成されたコンポーネントおよび対応する要素と対話するためのテストハーネスです。

治具からコンポーネントインスタンスにアクセスし、ジャスミンの期待通りに存在することを確認します:

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="componentInstance">
</code-example>

#### _beforeEach()_

このコンポーネントが進化するにつれて、
より多くのテストを追加します。
各テストで`TestBed`設定を複製するのではなく、リファクタを使用して設定をJasmine `beforeEach()`といくつかのサポート変数にプルします

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v3"
  linenums="false">
</code-example>

次に、`fixture.nativeElement`からコンポーネントの要素を取得し、
期待されるテキストを探すテストを追加します。

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-2">
</code-example>

{@a native-element}

#### _nativeElement_

`ComponentFixture.nativeElement`の値には、任意の型があります。 後で`DebugElement.nativeElement`が出現し、それにも任意の型があります。

Angularは、コンパイル時に`nativeElement`のHTML要素の種類やHTML要素であるかどうかを知ることはできません。 アプリケーションは、サーバーや[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)などの_非ブラウザプラットフォーム_で実行されている可能性があります。このプラットフォームでは、要素のAPIが減少しているか、まったく存在していない可能性があります。

このガイドのテストは、ブラウザで実行するように設計されているため、`nativeElement`の値は常に`HTMLElement`またはその派生クラスの1つになります。

それが何らかの`HTMLElement`であることがわかっている場合は、標準のHTML `querySelector`を使用して要素ツリーに深く入り込むことができます。

段落要素を取得してバナーテキストを探すために`HTMLElement.querySelector`を呼び出す別のテストがあります:

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-3">
</code-example>

{@a debug-element}

#### _DebugElement_

Angularの_fixture_は`fixture.nativeElement`をとおして直接コンポーネントの要素に提供されます。

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="nativeElement">
</code-example>

これは`fixture.debugElement.nativeElement`として実装された、実際に便利なメソッドです

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="debugElement-nativeElement">
</code-example>

要素へのこの迂回路には正当な理由があります。

`nativeElement`のプロパティは、実行時環境によって異なります。
これらのテストは、
DOMを持たない、またはDOMエミュレーションが`HTMLElement` API全体をサポートしていない_ブラウザ以外のプラットフォーム_で実行することができます。

Angularは、サポートされているすべてのプラットフォームで安全に動作するよう、
`DebugElement`抽象化に依存しています。
Angularは、HTML要素ツリーを作成する代わりに、ランタイムプラットフォームの_ネイティブ要素_をラップする`DebugElement`ツリーを作成します。 `nativeElement`プロパティは`DebugElement`を展開し、プラットフォーム固有の要素オブジェクトを返します。

このガイドのサンプルテストはブラウザでのみ実行されるように設計されているため、これらのテストの`nativeElement`は、常にテスト内で探索できる使い慣れたメソッドとプロパティを持つ`HTMLElement`です。

以前のテストは`fixture.debugElement.nativeElement`で再実装されています:

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-4">
</code-example>

`DebugElement`には、このガイドの他の部分で説明するように、テストに役立つ他のメソッドとプロパティがあります。

Angularコアライブラリから`DebugElement`シンボルをインポートします。

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-debug-element">
</code-example>

{@a by-css}
#### _By.css()_

このガイドのテストはすべてブラウザ上で実行されますが、一部のアプリケーションは、
少なくとも一部のプラットフォームで異なるプラットフォームで動作することがあります。

たとえば、接続の悪いデバイスでアプリケーションをより早く起動させる戦略の一環として、コンポーネントをサーバー上で最初にレンダリングすることがあります。
サーバー側のレンダラーは、完全なHTML要素APIをサポートしていない可能性があります。`querySelector`をサポートしていない場合、前のテストは失敗する可能性があります。

`DebugElement`は、サポートされているすべてのプラットフォームで動作するクエリメソッドを提供します。 これらのクエリメソッドは、`DebugElement`ツリーのノードが選択基準に一致すると`true`を返す_述語_関数を使用します。

ランタイムプラットフォームのライブラリからインポートされた`By`クラスの助けを借りて_述語_を作成します。
ここではブラウザプラットフォームのための`By`をインポートしています:

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-by">
</code-example>

The following example re-implements the previous test with
`DebugElement.query()` and the browser's `By.css` method.

<code-example 
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-5">
</code-example>

注目すべきいくつかの観察:

* `By.css()`静的メソッドは[標準のCSSセレクター]で(https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors "CSS selectors")`DebugElement`ノードを選択します。 
* クエリは段落の`DebugElement`を返します。
* 段落要素を取得するためにはその結果をアンラップする必要があります。

CSSセレクタでフィルタリングし、ブラウザの_ネイティブ要素_のプロパティのみをテストする場合、`By.css`の手法は過度のものになる可能性があります。

次の一連のテストで示すように、`querySelector()`や`querySelectorAll()`などの標準的な`HTMLElement`メソッドを使用してフィルタ処理する方が簡単で、より明確になることがよくあります。

<hr>

## Component テストシナリオ

このガイドのほとんどを構成する以下のセクションでは、
一般的なコンポーネントのテストシナリオ

### Component binding

現在の`BannerComponent`は、静的タイトルテキストをHTMLテンプレートに表示します。

いくつか変更を加えた後、`BannerComponent`は、
このようなコンポーネントの`title`プロパティにバインドすることによって、動的なタイトルを表示します。

<code-example 
  path="testing/src/app/banner/banner.component.ts" 
  region="component"
  title="app/banner/banner.component.ts" linenums="false">
</code-example>

これは簡単なので、テストを追加して、
コンポーネントが実際に正しいと思われる場所にコンテンツが表示されることを確認します。

#### _&lt;h1&gt;_のクエリ

_タイトル_プロパティ補間バインディングをラップする`<h1>`
要素の値を検査する一連のテストを記述します。

`beforeEach`を更新して、
その要素を標準HTML `querySelector`で検索し、それを`h1`変数に割り当てます。

<code-example 
  path="testing/src/app/banner/banner.component.spec.ts" 
  region="setup" 
  title="app/banner/banner.component.spec.ts (setup)" linenums="false">
</code-example>

{@a detect-changes}

#### _createComponent()_はデータをバインドしない

最初のテストでは、画面にデフォルトの`title`が表示されていることを確認したいと思います。
あなたの本能は、このような`<h1>`を直ちに検査するテストを書くことです

<code-example 
  path="testing/src/app/banner/banner.component.spec.ts" 
  region="expect-h1-default-v1">
</code-example>

メッセージとともに_そのテストは失敗します:
```javascript
expected '' to contain 'Test Tour of Heroes'.
```

Angularが**変更検出**を実行するとバインディングが発生します。

プロダクションでは、Angularがコンポーネントを作成するか、ユーザーがキーストロークを入力するか、非同期アクティビティ（AJAXなど）が完了すると、変更検出が自動的に開始されます。

`TestBed.createComponent`は変更の検出をトリガーしません。 改正試験で確認された事実

<code-example 
  path="testing/src/app/banner/banner.component.spec.ts" region="test-w-o-detect-changes" linenums="false">
</code-example>

#### _detectChanges()_

`fixture.detectChanges()`を呼び出すことによって、データバインディングを実行するように`TestBed`に指示する必要があります。 それでは、`<h1>`は予期されたタイトルを持っています。
<code-example 
  path="testing/src/app/banner/banner.component.spec.ts" 
  region="expect-h1-default">
</code-example>

遅延変化検出は意図的かつ有用である。
テスターは、_Angularがデータバインディングを開始して[ライフサイクルフック](guide/lifecycle-hooks)を呼び出す前に_、
コンポーネントの状態を検査して変更する機会をテスターに与えます。

`fixture.detectChanges()`を呼び出す前にコンポーネントの`title`プロパティを変更する別のテストがあります。

<code-example 
  path="testing/src/app/banner/banner.component.spec.ts" 
  region="after-change">
</code-example>

{@a auto-detect-changes}

#### 自動的な変更検知

`BannerComponent`は、頻繁に`detectChanges`を呼び出します。
いくつかのテスターは、Angularテスト環境が自動的に変更検出を実行することを好みます。

これは`ComponentFixtureAutoDetect`プロバイダーで`TestBed`を設定することで可能です。
まず、テストユーティリティーライブラリからインポートします:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect" title="app/banner/banner.component.detect-changes.spec.ts (import)" linenums="false"></code-example>

次に、それをテストモジュール構成の`providers`配列に追加します:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect" title="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" linenums="false"></code-example>

自動変更検知がどのように機能するかを示す3つのテストがあります。

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect-tests" title="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" linenums="false"></code-example>

最初のテストでは、自動変更検知の利点が示されています。

2回目と3回目のテストで重要な制限が明らかになりました。
Angularのテスト環境では、テストでコンポーネントのタイトルが変更されたことが_わかりません_。
`ComponentFixtureAutoDetect`サービスは、約束の解決、タイマー、DOMイベントなどの非同期アクティビティに応答します。 ただし、コンポーネントプロパティの直接的な同期更新は不可視です。 このテストでは、`fixture.detectChanges()`を手動で呼び出して、変更検出の別のサイクルをトリガする必要があります。

<div class="alert is-helpful">

テストフィクスチャが変更検出を実行するかどうかを知るのではなく、
このガイドのサンプルは_常に_`detectChanges()`を_明示的_に呼び出します。
`detectChanges()`を厳密に必要以上に頻繁に呼び出しても問題ありません。

</div>

<hr>

{@a dispatch-event}

#### _dispatchEvent()_を使用してinputの値を変更する

ユーザー入力をシミュレートするには、input要素を見つけて`value`プロパティを設定します。

`fixture.detectChanges()`を呼び出してAngularの変更検知をトリガーします。
しかし、本質的な中間段階があります。

Angularは、input要素の`value`プロパティを設定していることを認識していません。
`dispatchEvent()`を呼び出して要素の`input`イベントを発生させるまで、
そのプロパティは読み取られません。_次に_、`detectChanges()`を呼び出します。

次の例は、正しいシーケンスを示しています。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" title="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

### 外部ファイルを使用したコンポーネント

上記の`BannerComponent`は、`@Component.template`プロパティと`@Component.styles`プロパティでそれぞれ指定された_インラインテンプレート_と_インラインCSS_で定義されています。

多くのコンポーネントは、`BannerComponent`の以下のバリアントが行うように、
`@Component.templateUrl`プロパティと`@Component.styleUrls`プロパティでそれぞれ_外部テンプレート_と
_外部CSS_を指定します。

<code-example 
  path="testing/src/app/banner/banner-external.component.ts"
  region="metadata"
  title="app/banner/banner-external.component.ts (metadata)" linenums="false">
</code-example>

この構文は、コンポーネントコンパイル時に外部ファイルを読み込むようにAngularコンパイラに指示します。

_テストを実行する前にアプリをコンパイルするので_、
CLIの `ng test`コマンドを実行すると問題はありません。

ただし、**非CLI環境**でテストを実行すると、このコンポーネントのテストが失敗することがあります。
たとえば、[plunker](http://plnkr.co/)などのWebコーディング環境で`BannerComponent`テストを実行すると、
次のようなメッセージが表示されます:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent 
which is using a "templateUrl" or "styleUrls", but they were never compiled. 
Please call "TestBed.compileComponents" before your test.
</code-example>

_テスト中に_ランタイム環境がソースコードをコンパイルすると、
このテストエラーメッセージが表示されます。

問題を解決するには、[次](#compile-components)で説明するように`compileComponents()`を呼び出します。

{@a component-with-dependency}

### 依存関係のあるコンポーネント

コンポーネントにはしばしばサービスの依存関係があります。

`WelcomeComponent`は、ログインしたユーザーへのウェルカムメッセージを表示します。
ユーザーが注入された`UserService`のプロパティに基づいているかどうかを知る:

<code-example path="testing/src/app/welcome/welcome.component.ts" title="app/welcome/welcome.component.ts" linenums="false"></code-example>

`WelcomeComponent`には、サービスとやり取りする決定ロジックがあり、このコンポーネントをテストに値するロジックにします。
specファイルのテストモジュールの設定は、`app/welcome/welcome.component.spec.ts`です:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="config-test-module" title="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

今回は、_テスト中のコンポーネント_を宣言することに加えて、
`providers`リストに`UserService`プロバイダを追加します。
しかし、実際の`UserService`ではありません。

{@a service-test-doubles}

#### テストダブルのサービスを提供する

_テスト中のコンポーネント_には、実際のサービスを注入する必要はありません。
実際には、テストの倍数（スタブ、フェイク、スパイ、またはモック）であれば通常はより良いです。
仕様の目的は、サービスではなくコンポーネントをテストすることであり、
実際のサービスは問題になる可能性があります。

実際の`UserService`を注入することは悪夢になる可能性があります。
実際のサービスは、ユーザーにログイン資格情報を要求し、
認証サーバーに到達しようとします。
これらの動作は傍受するのが難しい場合があります。
実際の`UserService`の代わりにテストダブルを作成して登録する方がはるかに簡単で安全です。

この特定のテストスイートは、
`WelcomeComponent`とそのテストのニーズを満たす`UserService`の最小のモックを提供します:

<code-example 
  path="testing/src/app/welcome/welcome.component.spec.ts" 
  region="user-service-stub" 
  title="app/welcome/welcome.component.spec.ts" linenums="false">
</code-example>

{@a get-injected-service}

#### 注入したサービスを取得する

テストでは、`WelcomeComponent`に注入された（スタブ）`UserService`へのアクセスが必要です。

Angularは階層的な注入システムを持っています。
`TestBed`によって作成されたルートインジェクターからコンポーネントツリーまで、
複数のレベルのインジェクタがあります。

注入されたサービスを取得する最も安全な方法は、
**常に動作する方法で**、**テスト中のコンポーネントのインジェクタから取得することです**。
コンポーネントインジェクタは、フィクスチャの`DebugElement`のプロパティです。

<code-example 
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="injected-service" 
  title="WelcomeComponent's injector">
</code-example>

{@a testbed-get}

#### _TestBed.get()_

`TestBed.get()`経由でルートインジェクタからサービスを取得することも_できます_。
これは覚えやすく、あまり冗長ではありません。
しかし、Angularがコンポーネントのインスタンスをテストのルートインジェクタに注入する場合にのみ機能します。

このテストスイートでは、`UserService`の_唯一_のプロバイダーはルートテストモジュールなので、
`TestBed.get()`を次のように呼び出すことは安全です:

<code-example 
  path="testing/src/app/welcome/welcome.component.spec.ts" 
  region="inject-from-testbed" 
  title="TestBed injector">
</code-example>

<div class="alert is-helpful">

`TestBed.get()`が機能しないユースケースについては、
コンポーネントのインジェクタからサービスを取得する必要がある時期と理由を説明する
[_コンポーネントのプロバイダーを上書きする_](#component-override)セクションを参照してください。

</div>

{@a service-from-injector}

#### 常にインジェクターからサービスを取得する

テスト本体にあるテストモジュールに提供されている`userServiceStub`
オブジェクトを参照_しないでください_。
**それは動作しません！**
コンポーネントに注入された`userService`インスタンスは、完全に_異なる_オブジェクトであり、
提供された`userServiceStub`のクローンです。

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="stub-not-injected" title="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

{@a welcome-spec-setup}

#### 最後のステップとテスト

`TestBed.get()`を使用して`beforeEach()`を完了します:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="setup" title="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

そしていくつかのテストがあります:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="tests" title="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

最初は健全性テストです。スタブされた`UserService`が呼び出され、動作していることを確認します。

<div class="alert is-helpful">

Jasmineのマッチャーに対する第2のパラメータ（例えば、 `'expected name'`）は、オプションの失敗ラベルである。
予想が失敗した場合、Jasmineディスプレイはこのラベルを期待失敗メッセージに付加します。
複数の期待値を持つ仕様では、何が間違っていて、どの期待値が失敗したかを明確にするのに役立ちます。

</div>

残りのテストは、サービスが異なる値を返すときにコンポーネントのロジックを確認します。
2番目のテストでは、ユーザー名の変更の影響を検証します。
3番目のテストでは、ログインしているユーザーがいない場合、コンポーネントが適切なメッセージを表示していることを確認します。

<hr>

{@a component-with-async-service}

### 非同期サービスを使用するコンポーネント

このサンプルでは、`AboutComponent`テンプレートは`TwainComponent`をホストします。
`TwainComponent`はMark Twainの引用符を表示します。

<code-example 
  path="testing/src/app/twain/twain.component.ts" 
  region="template" 
  title="app/twain/twain.component.ts (template)" linenums="false">
</code-example>

コンポーネントの`quote`プロパティの値は、`AsyncPipe`を通過することに注意してください。
つまり、プロパティは`Promise`または`Observable`のいずれかを返します。

この例では、`TwainComponent.getQuote()`メソッドは、
`quote`プロパティが`Observable`を返すことを示しています。

<code-example 
  path="testing/src/app/twain/twain.component.ts" 
  region="get-quote" 
  title="app/twain/twain.component.ts (getQuote)" linenums="false">
</code-example>

`TwainComponent`は、注入された`TwainService`から引用符を取得します。
コンポーネントは、サービスが最初の引用符を返す前に、
返された`Observable`をプレースホルダー値（`'...'`）で開始します。

`catchError`はサービスエラーを傍受し、エラーメッセージを作成し、成功チャネルのプレースホルダー値を返します。
同じ変更検出サイクルでそのメッセージを2回更新するのを避けるために、
`errorMessage`を設定するには、
チェックを待つ必要があります。

これらはすべてテストしたい機能です。

#### スパイを使用したテスト

コンポーネントをテストするときは、サービスのパブリックAPIだけが重要です。
一般に、テスト自体はリモートサーバーを呼び出すべきではありません。
彼らはそのような呼び出しをエミュレートする必要があります。この`app/twain/twain.component.spec.ts`の設定は、これを行うための1つの方法を示しています:

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="setup" 
  title="app/twain/twain.component.spec.ts (setup)" linenums="false">
</code-example>

{@a service-spy}

スパイにフォーカスしてください。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="spy">
</code-example>

スパイは、`getQuote`への任意の呼び出しがテスト見積もりで観測値を受け取れるように設計されています。
実際の`getQuote()`メソッドとは異なり、このスパイはサーバをバイパスし、
その値がすぐに利用できる同期観測値を返します。

`Observable`が同期していても、このスパイで多くの有用なテストを書くことができます。

{@a sync-tests}

#### 同期的テスト

同期`Observable`の主な利点は、
非同期プロセスを同期テストにすることができることです。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="sync-test">
</code-example>

スパイの結果が同期的に返されるため、
`getQuote()`メソッドは、
Angularが`ngOnInit`を呼び出す最初の変更検出サイクルの_直後_に画面上のメッセージを更新します。

エラー・パスをテストするときにあなたはとてもラッキーです。
サービススパイはエラーを同期的に返しますが、
コンポーネントメソッドは`setTimeout()`を呼び出します。 
のテストは、JavaScriptエンジンが少なくとも1回転以上待ってから値を取得できるようにする必要があります。
テストは_非同期_にする必要があります。

{@a fake-async}
#### _fakeAsync()_を使用した非同期テスト

次のテストは、サービスが`ErrorObservable`を返すときの予想される動作を確認します。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="error-test">
</code-example>

`it()`関数は次の形式の引数を受け取ることに注意してください。
```javascript
fakeAsync(() => { /* test body */ })`
```

`fakeAsync`関数は、特定の_fakeAsyncテストゾーン_でテスト本体を実行することによって、
線形コーディングスタイルを有効にします。
テスト本体は同期しているように見えます。
`Promise.then()`のようなネストされた構文はなく、制御の流れを混乱させることはありません。

{@a tick}

#### _tick()_関数

（仮想）クロックを進めるには、`tick()`を呼び出さなければなりません。

`tick()`を呼び出すと、保留中のすべての非同期アクティビティが終了するまでの時間がシミュレートされます。
この場合、エラーハンドラの`setTimeout()`を待機します。

`tick`関数は、`TestBed`でインポートするAngularテストユーティリティの1つです。
これは`fakeAsync`のコンパニオンであり、`fakeAsync`本体内でのみ呼び出すことができます。

#### より多くのmacroTasksをサポートする

デフォルトでは`fakeAsync`は次の`macroTask`をサポートします。

- setTimeout
- setInterval
- requestAnimationFrame
- webkitRequestAnimationFrame
- mozRequestAnimationFrame

`HTMLCanvasElement.toBlob()`のような他の`macroTask`を実行したとき、`Unknown macroTask scheduled in fake async test`エラーがスローされます。

<code-tabs>
  <code-pane
    path="testing/src/app/shared/canvas.component.spec.ts"
    title="src/app/shared/canvas.component.spec.ts" linenums="false">
  </code-pane>
  <code-pane
    path="testing/src/app/shared/canvas.component.ts"
    title="src/app/shared/canvas.component.ts" linenums="false">
  </code-pane>
</code-tabs>

このようなケースをサポートしたい場合は、`beforeEach`でサポートしたい`macroTask`を定義する必要があります。例えば:

```javascript
beforeEach(() => {
  window['__zone_symbol__FakeAsyncTestMacroTask'] = [
    {
      source: 'HTMLCanvasElement.toBlob',
      callbackArgs: [{ size: 200 }]
    }
  ];
});

it('toBlob should be able to run in fakeAsync', fakeAsync(() => {
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    let blob = null;
    canvas.toBlob(function(b) {
      blob = b;
    });
    tick();
    expect(blob.size).toBe(200);
  })
);
```

#### 非同期のオブザーバブル

これらのテストのテストカバレッジに満足しているかもしれません。

しかし、あなたは本当のサービスがこのように振る舞わないという事実に悩まされるかもしれません。
実際のサービスは、要求をリモートサーバーに送信します。
サーバーは応答するのに時間がかかり、
前の2つのテストのように応答がすぐに利用できなくなります。

このような`getQuote()`スパイから非同期観測を返すと、
あなたのテストは実世界をより忠実に反映します。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="async-setup">
</code-example>

#### 非同期オブザーバブルヘルパー

非同期のオブザーバブルは、`asyncData`ヘルパーによって生成されました。
`asyncData`ヘルパーは、自分で作成する必要があるユーティリティ関数です。
または、サンプルコードからこれをコピーすることもできます。

<code-example 
  path="testing/src/testing/async-observable-helpers.ts" 
  region="async-data"
  title="testing/async-observable-helpers.ts">
</code-example>

このヘルパーの観測結果は、JavaScriptエンジンの次のターンで`data`値を出力します。

[RxJSの`defer()`演算子](http://reactivex.io/documentation/operators/defer.html)
は、観測値を返します。
Promiseかオブザーバブルのどちらかを返すファクトリ関数を取ります。
あるものが_defer_のobservableを購読すると、
そのファクトリで作成された新しいobservableにサブスクライバが追加されます。

`defer()`演算子は、`HttpClient`のように`Promise.resolve()`を新しい観測値に変換して、
一度放出して完了します。
購読者は、データ値を受け取った後、購読を解除されます。

非同期エラーを生成するための同様のヘルパーがあります。

<code-example 
  path="testing/src/testing/async-observable-helpers.ts" 
  region="async-error">
</code-example>

#### さらに非同期テスト

`getQuote()`スパイが非同期オブザーバブルを返すようになったので、
ほとんどのテストは非同期でなければなりません。

現実世界で期待されるデータフローを示す
`fakeAsync()`テストがあります。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="fake-async-test">
</code-example>

quote要素は、`ngOnInit()`の後にプレースホルダ値（`'...'`）を表示することに注意してください。
最初の見積もりはまだ届いていません。

最初の見積もりをobservableからフラッシュするには、`tick()`を呼び出します。
次に、`detectChanges()`を呼び出して、Angularに画面を更新するように指示します。

次に、quote要素が予想されるテキストを表示することをアサートすることができます。

{@a async}

#### _async()_を使用した非同期テスト

`fakeAsync()`ユーティリティ関数にはいくつかの制限があります。
特に、テスト本体が`XHR`呼び出しを行う場合は動作しません。

テスト中の`XHR`呼び出しはまれであるため、一般的に`fakeAsync()`を使うことができます。
しかし、`XHR`を呼び出す必要がある場合は、`async()`について知りたいでしょう。

<div class="alert is-helpful">

`TestBed.compileComponents()`メソッド（[下記参照](#compile-components)）は、
"ジャストインタイム"コンパイル時に外部テンプレートとcssファイルを読み込むために`XHR`を呼び出します。
`async()`ユーティリティを使用して`compileComponents()`を呼び出すテストを作成します。

</div>

以前の`fakeAsync()`テストは、`async()`ユーティリティで再記述したものです。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="async-test">
</code-example>

`async()`ユーティリティは、
テスターのコードを特別な非同期テストゾーンで実行するように設定することによって、非同期ボイラープレートを非表示にします。
Jasmineの`done()`をテストに渡す必要はなく、
約束されたコールバックや観測可能なコールバックで`done()`を呼び出す必要はありません。

しかし、_テストの非同期性_は`fixture.whenStable()`の呼び出しによって明らかになります。
これは制御の線形フローを壊します。

{@a when-stable}

#### _whenStable_

テストは、`getQuote()`observableが次のクォートを発行するのを待つ必要があります。
`tick()`を呼び出す代わりに、`fixture.whenStable()`を呼び出します。

`fixture.whenStable()`は、JavaScriptエンジンのタスクキューが空になったときに解決する約束を返します。
この例では、オブザーバブルが最初のクォートを発行すると、
タスクキューは空になります。

テストは、promiseコールバック内で再開し、
`detectChanges()`を呼び出してquote要素を期待されるテキストで更新します。

{@a jasmine-done}

#### Jasmine _done()_

`async`関数と`fakeAsync`関数はAngular非同期テストを大幅に簡素化しますが、
従来の技術に戻って、[`done`コールバック](http://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support)関数を渡すことができます。

これで、promiseを連鎖させ、エラーを処理し、適切な時に`done()`を呼び出す責任があります。

`done()`でテスト関数を書くことは、asyncとfakeAsyncよりも面倒です。しかし時折必要です。たとえば、`intervalTimer()`またはRxJS `delay()`演算子を含むコードをテストするときは、`async`または`fakeAsync`を呼び出すことはできません。

`done()`で書かれた以前のテストの2つのバージョンがあります。最初のコンポーネントは、コンポーネントの`quote`プロパティによってテンプレートに公開された`Observable`にサブスクライブします。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="quote-done-test" linenums="false">
</code-example>

RxJS `last()`演算子は、完了する前に観測値の最後の値を出力します。
これはテスト見積もりになります。
`subscribe`コールバックは、以前のテストと同じ方法で、クォート要素をテスト引用符で更新するために`detectChanges()`を呼び出します。

いくつかのテストでは、注入されたサービスメソッドがどのように呼び出され、返された値が画面に表示されるかに、より関心があります。

偽の`TwainService`の`qetQuote()`スパイなどのサービススパイは、その情報を提供し、ビューの状態についてアサーションを行うことができます。

<code-example 
  path="testing/src/app/twain/twain.component.spec.ts" 
  region="spy-done-test" linenums="false">
</code-example>

<hr>

{@a marble-testing}
### Component marble tests

以前の`TwainComponent`テストでは、`asyncData`と`asyncError`ユーティリティを使用して、`TwainService`からの非同期観測可能な応答をシミュレートしました。

これらはあなた自身で書くことができる簡単で簡単な機能です。
残念ながら、多くの一般的なシナリオでは単純すぎます。
可観測性はしばしば重大な遅延の後に、複数回出現する。
コンポーネントは、
重複している値とエラーのシーケンスで複数のオブザーバブルを調整できます。

**RxJSマーブルテスティング**は、シンプルかつ複雑な観測可能なシナリオをテストするうえで最適な方法です。
あなたは、観測可能物がどのように働くかを示す[マーブルダイアグラム](http://rxmarbles.com/)を見たことがあります。
マーブルテストでは、同様のマーブル言語を使用して、テストで観測可能なストリームと期待値を指定します。

次の例では、マーブルテストを使用した`TwainComponen`tテストの2つを再訪します。

まず、`jasmine-marbles` npmパッケージをインストールします。
次に、必要なシンボルをインポートします。

<code-example 
  path="testing/src/app/twain/twain.component.marbles.spec.ts" 
  region="import-marbles" 
  title="app/twain/twain.component.marbles.spec.ts (import marbles)" linenums="false">
</code-example>

見積もりを取得するための完全なテストです:

<code-example 
  path="testing/src/app/twain/twain.component.marbles.spec.ts" 
  region="get-quote-test" linenums="false">
</code-example>

ジャスミンテストは同期的であることに注意してください。
`fakeAsync()`はありません。
マーブルテストは、テストスケジューラを使用して、同期テストにおける時間の経過をシミュレートします。

マーブルテストの美しさは、観測可能なストリームの視覚的定義にあります。
このテストでは、3つの[フレーム](#marble-frame)（`---`）を待ち、
値（`x`）を出力し、
完了（`|`）する[_コールド_オブザーバブル](#cold-observable)を定義します。
2番目の引数では、値マーカー（`x`）を出力値（`testQuote`）にマップします

<code-example 
  path="testing/src/app/twain/twain.component.marbles.spec.ts" 
  region="test-quote-marbles" linenums="false">
</code-example>

マーブルライブラリは、対応する観測値を構築します。
この観測値は、`getQuote`スパイの戻り値として設定されます。

マーブルの観測値をアクティブにする準備ができたら、
`TestScheduler`にこのような用意されたタスクのキューを_フラッシュ_するように指示します。

<code-example 
  path="testing/src/app/twain/twain.component.marbles.spec.ts" 
  region="test-scheduler-flush" linenums="false">
</code-example>

This step serves a purpose analogous to `tick()` and `whenStable()` in the
earlier `fakeAsync()` and `async()` examples.
The balance of the test is the same as those examples.

#### Marble error testing

Here's the marble testing version of the `getQuote()` error test.

<code-example 
  path="testing/src/app/twain/twain.component.marbles.spec.ts" 
  region="error-test" linenums="false">
</code-example>

このステップは、
以前の`fakeAsync()`および`async()`の例の`tick()`および`whenStable()`に似た目的を果たします。
テストのバランスは、それらの例と同じです。

### マーブルエラーテスティング

以下は `getQuote()`エラーテストのマーブルテストバージョンです。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-test" linenums="false">
</code-example>

コンポーネント自体がエラーを処理するときに`setTimeout()`を呼び出すため、
`fakeAsync()`と`tick()`を呼び出すことはまだ非同期テストです。

マーブルの観測可能な定義を見てください。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-marbles" linenums="false">
</code-example>

これは、3つのフレームを待ってからエラーを発する_コールド_オブザーバブルです。
ハッシュ（`#`）は、3番目の引数で指定されたエラーのタイミングを示します。
オブザーバブルが決して値を出力しないため、2番目の引数はnullです。

#### マーブルテストについて学ぶ

{@a marble-frame}
_マーブルフレーム_は、テスト時間の仮想単位です。
各記号（ `-` 、`x`、`|`、`#`）は、1つのフレームの通過をマークします。

{@a cold-observable}
あなたがそれを購読するまで、_コールド_オブザーバブルは値を生成しません。
あなたのアプリケーションのオブザーバブルのほとんどはコールドです。
すべての[_HttpClient_](guide/http)メソッドはコールドオブザーバブルを返します。

あなたがそれを購読する_前_にホットオブザーバブルがすでに価値を生み出しています。
ルーターの活動を報告する[_Router.events_](api/router/Router#events)オブザーバブル、
これはホットオブザーバブルです。

RxJSマーブルテストは、このガイドの範囲を超えて、豊富なテーマです。
[公式ドキュメント](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md)から始めて、
ウェブ上で学んでください。

<hr>

{@a component-with-input-output}

### インプットとアウトプットを使用したコンポーネント

入力と出力を持つコンポーネントは、通常、ホストコンポーネントのビューテンプレート内に表示されます。
ホストは、プロパティー・バインディングを使用して入力プロパティーを設定し、
イベント・バインディングを使用して出力プロパティーによって発生したイベントをlistenします。

テストの目的は、そのようなバインディングが期待どおりに機能することを確認することです。
テストでは入力値を設定し、出力イベントを待機する必要があります。

`DashboardHeroComponent`は、このロール内のコンポーネントの小さな例です。
`DashboardComponent`によって提供される個々のヒーローを表示します。
そのヒーローをクリックすると、ユーザーがヒーローを選択したことを`DashboardComponent`に伝えます。

`DashboardHeroComponent`は、このようにDashboardComponentテンプレートに組み込まれています:

<code-example 
  path="testing/src/app/dashboard/dashboard.component.html" 
  region="dashboard-hero" 
  title="app/dashboard/dashboard.component.html (excerpt)" linenums="false">
</code-example>

`DashboardHeroComponent`は`*ngFor`リピーターに表示され、
各コンポーネントの`hero`入力プロパティをループ値に設定し、コンポーネントの`selected`イベントをリッスンします。

コンポーネントの完全な定義は次のとおりです:

{@a dashboard-hero-component}

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.ts" 
  region="component" 
  title="app/dashboard/dashboard-hero.component.ts (component)" linenums="false">
</code-example>

この単純なコンポーネントのテストは本質的な価値はほとんどありませんが、それを知ることは価値があります。
これらのアプローチの1つを使用することができます:

* `DashboardComponent`で使用されているようにテストします。
* スタンドアロンコンポーネントとしてテストします。
* `DashboardComponent`の代わりに使用されているようにテストします。

最初のアプローチとして`DashboardComponent`コンストラクタを簡単に見てみると:

<code-example 
  path="testing/src/app/dashboard/dashboard.component.ts" 
  region="ctor" 
  title="app/dashboard/dashboard.component.ts (constructor)" linenums="false">
</code-example>

`DashboardComponent`はAngularルーターと`HeroService`によって異なります。
おそらくそれらを両方ともテストダブルと置き換える必要があります。
これは多くの作業がいります。ルータは特に難しいようです。

<div class="alert is-helpful">

[以下](#routing-component)では、ルータを必要とするコンポーネントのテストについて説明します。

</div>

すぐに目標は、`DashboardComponent`ではなく`DashboardHeroComponent`をテストすることです。
したがって、2番目と3番目のオプションを試してみてください。

{@a dashboard-standalone}

#### _DashboardHeroComponent_ スタンドアロンテスト

スペックファイルの設定は次のとおりです。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" 
  region="setup"
  title="app/dashboard/dashboard-hero.component.spec.ts (setup)" linenums="false">
</code-example>

セットアップコードがコンポーネントの`hero`プロパティにテストヒーロー
（`expectedHero`）を割り当て、
`DashboardComponent`がリピータのプロパティバインディングを介して設定する方法をエミュレートする方法に注意してください。

次のテストでは、ヒーロー名がバインディングを介してテンプレートに伝播することを確認します。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" 
  region="name-test">
</code-example>

[テンプレート](#dashboard-hero-component)はヒーロー名をAngularの`UpperCasePipe`で渡すので、
テストでは要素の値と大文字の名前が一致する必要があります。

<div class="alert is-helpful">

この小さなテストは、
Angularテストが[コンポーネントクラスのテスト](#component-class-testing
)では不可能だったコンポーネントのビジュアル表現を低コストで、
はるかに遅く複雑なエンドツーエンドのテストに頼らずに検証する方法を示しています。

</div>

#### クリックする

ヒーローをクリックすると、ホストコンポーネント（おそらく`DashboardComponent`）
が聞くことができる`selected`イベントが発生するはずです:

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test">
</code-example>

コンポーネントの`selected`プロパティは`EventEmitter`を返します。
これはコンシューマにはRxJS同期`Observable`のように見えます。
テストは、ホストコンポーネントが_暗黙的_に行うのと同じように、_明示的_にサブスクライブします。

コンポーネントが期待どおりに動作する場合、ヒーローの要素をクリックすると、
コンポーネントの`selected`プロパティに`hero`オブジェクトを放出するように指示する必要があります。

テストでは、`selected`へのサブスクリプションを通じてそのイベントが検出されます。

{@a trigger-event-handler}

#### _triggerEventHandler_

前のテストの`heroDe`は、ヒーロー`<div>`を表す`DebugElement`です。

Angularプロパティと、ネイティブ要素との相互作用を抽象化するメソッドがあります。
このテストでは、 "click"イベント名で`DebugElement.triggerEventHandler`を呼び出します。
"click"イベントバインディングは、`DashboardHeroComponent.click()`を呼び出して応答します。

Angularの`DebugElement.triggerEventHandler`は、
_イベント名_で_データバインドされたイベント_を発生させることができます。2番目のパラメータは、ハンドラに渡されるイベントオブジェクトです。

このテストでは、`null`イベントオブジェクトを持つ"click"イベントがトリガされます。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler">
</code-example>

このテストでは、
ランタイムイベントハンドラ（コンポーネントの`click()`メソッド）
がイベントオブジェクトを気にかけていないことを前提としています

<div class="alert is-helpful">

他のハンドラーはあまり寛容ではありません。
たとえば、`RouterLink`ディレクティブは、
クリック中にどのマウスボタン（ある場合）が押されたのかを識別する`button`プロパティを持つオブジェクトを想定しています。 イベントオブジェクトがない場合、`RouterLink`ディレクティブはエラーをスローします。

</div>

#### 要素をクリックする

次のテストの代替方法では、ネイティブエレメント自身の`click()`メソッドが呼び出されます。
このメソッドは、_このコンポーネント_にとっては問題ありません。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" 
  region="click-test-2">
</code-example>

{@a click-helper}
#### _click()_ ヘルパー

ボタン、アンカー、または任意のHTML要素をクリックすることは、一般的なテスト作業です。

_クリックトリガー_プロセスを以下の`click()`関数などのヘルパーにカプセル化することで、
一貫性と容易さを実現する:

<code-example 
  path="testing/src/testing/index.ts" 
  region="click-event" 
  title="testing/index.ts (click helper)" linenums="false">
</code-example>

最初のパラメータは_クリックする要素_です。
必要に応じて、カスタムイベントオブジェクトを2番目のパラメータとして渡すことができます。
デフォルトは、`RouterLink`ディレクティブを含む多くのハンドラで受け入れられる（一部の）<a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button">左ボタンマウスイベントオブジェクト</a>です。

<div class="alert is-important">

`click()`ヘルパー関数はAngularテストユーティリティの1つでは**ありません**。
この_ガイドのサンプルコード_で定義されている関数です。
すべてのサンプルテストで使用されています。
あなたが好きなら、あなた自身のヘルパーのコレクションに追加してください。

</div>

上のテストを、クリックヘルパーを使って書き直しました。

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" 
  region="click-test-3"
  title="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)">
</code-example>

<hr>

{@a component-inside-test-host}

### テストホスト内部のコンポーネント

以前のテストは、ホスト`DashboardComponent`自身の役割を果たしました。
しかし、`DashboardHeroComponent`は、ホストコンポーネントに適切にデータバインドされていると正常に動作しますか？

実際の`DashboardComponent`でテストできます。
しかし、特に、そのテンプレートが`*ngFor`リピーター、他のコンポーネント、
レイアウトHTML、追加のバインディング、
複数のサービスを注入するコンストラクタを備えていて、
それらのサービスとすぐにやりとりを開始するときに、
多くの設定が必要になる可能性があります。

これらの注意散漫を無効にするための努力を想像してみてください。
ちょうどこのような_テストホスト_でうまくいくことができる点を検証するためです

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host"
  title="app/dashboard/dashboard-hero.component.spec.ts (test host)"
  linenums="false">
</code-example>

このテストホストは、`DashboardComponent`が`DashboardHeroComponent`にバインドしますが、ルータ、
`HeroService`、または`*ngFor`リピータのノイズはありません。

テストホストは、コンポーネントの`hero`インプットプロパティをテストヒーローに設定します。
コンポーネントの`selected`イベントを`onSelected`ハンドラにバインドします。
このハンドラは、`selectedHero`プロパティに放出されたヒーローを記録します。

その後、テストでは`selectedHero`を簡単にチェックして、
`DashboardHeroComponent.selected`イベントが予想されるヒーローを発行したことを確認できます。

_テストホスト_テストの設定は、スタンドアロンテストの設定と似ています:

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup" title="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" linenums="false"></code-example>

このテストモジュールの構成では、3つの重要な違いがあります:

1. `DashboardHeroComponent`と`TestHostComponent`の両方を_宣言_します。
1. これは、`DashboardHeroComponent`の代わりに`TestHostComponent`を_作成_します。
1. `TestHostComponent`は`DashboardHeroComponent.hero`にバインディングを設定します。

`createComponent`は、`DashboardHeroComponent`のインスタンスの代わりに`TestHostComponent`のインスタンスを保持する`fixture`を返します。

`TestHostComponent`を作成すると、
前者のテンプレート内に`DashboardHeroComponent`が表示されるため、
`DashboardHeroComponent`を作成するという副作用があります。
ヒーロー要素（`heroEl`）のクエリは、以前よりも要素ツリーの深さが深いものの、テストDOMでそれを検出します。

テスト自体はスタンドアロンバージョンとほぼ同じです:

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" 
  region="test-host-tests" 
  title="app/dashboard/dashboard-hero.component.spec.ts (test-host)" linenums="false">
</code-example>

選択したイベントテストのみが異なります。
これは、選択された`DashboardHeroComponen`tのヒーローが実際にホストコンポーネントへのイベントバインディングを通じてその方法を見つけることを確認します。

<hr>

{@a routing-component}

### ルーティングコンポーネント

_ルーティングコンポーネント_は、`Router`に別のコンポーネントにナビゲートするように指示するコンポーネントです。
`DashboardComponent`は、ユーザーがダッシュボード上の_ヒーローボタン_の1つをクリックして`HeroDetailComponent`にナビゲートできるため、
_ルーティングコンポーネント_です。

ルーティングはかなり複雑です。
`DashboardComponent`のテストは、`HeroService`と一緒に注入される`Router`が関係しているため、
部分的には難しいようでした。

<code-example 
  path="testing/src/app/dashboard/dashboard.component.ts" 
  region="ctor" 
  title="app/dashboard/dashboard.component.ts (constructor)" linenums="false">
</code-example>

`HeroService`をスパイでモックするのは[おなじみの話](#component-with-async-service)です。
しかし、`Router`には複雑なAPIがあり、他のサービスやアプリケーションの前提条件と絡み合っています。モックするのは難しいかもしれませんか？

幸いなことに、このケースでは、`DashboardComponent`が`Router`であまり働いていないためそうでもないです。

<code-example 
  path="testing/src/app/dashboard/dashboard.component.ts" 
  region="goto-detail" 
  title="app/dashboard/dashboard.component.ts (goToDetail)">
</code-example>

これは_ルーティングコンポーネント_でよく発生します。
原則として、ルータではなくコンポーネントをテストし、
指定された条件の下でコンポーネントが正しいアドレスでナビゲートする場合にのみ注意してください。

_このコンポーネント_のテストスイートのためのルータースパイを提供することは、
`HeroService`スパイを提供するのと同じくらい簡単です。

<code-example 
  path="testing/src/app/dashboard/dashboard.component.spec.ts" 
  region="router-spy"
  title="app/dashboard/dashboard.component.spec.ts (spies)" linenums="false">
</code-example>

次のテストでは、表示されたヒーローをクリックし、
`Router.navigateByUrl`が期待されるURLで呼び出されたことを確認します。

<code-example 
  path="testing/src/app/dashboard/dashboard.component.spec.ts" 
  region="navigate-test" 
  title="app/dashboard/dashboard.component.spec.ts (navigate test)" linenums="false">
</code-example>

{@a routed-component-w-param}

### ルーテッドコンポーネント

_ルーテッドコンポーネント_は`Router`ナビゲーションの宛先です。
特にコンポーネントへのルートに_パラメータが含まれている_場合は、
テストするのが難しい場合があります。 `HeroDetailComponent`は、そのようなルートの宛先である_ルーテッドコンポーネント_です。

ユーザーが_ダッシュボード_のヒーローをクリックすると、
`DashboardComponent`はルーターに`heroes/:id`にナビゲートするように指示します。
`:id`はルートパラメータであり、その値は編集するヒーローの`id`です。

`Router`はそのURLを`HeroDetailComponent`へのルートと照合します。
ルーティング情報を含む`ActivatedRoute`オブジェクトを作成し、
それを`HeroDetailComponent`の新しいインスタンスに挿入します。

次は`HeroDetailComponent`のコンストラクタです:

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ctor" title="app/hero/hero-detail.component.ts (constructor)" linenums="false"></code-example>

`HeroDetail`コンポーネントは`id`パラメータを必要とするため、
`HeroDetailService`経由で対応するヒーローを取得できます。
コンポーネントは、
`Observable`である`ActivatedRoute.paramMap`プロパティから`id`を取得する必要があります。

`ActivatedRoute.paramMap`の`id`プロパティを参照するだけでは不十分です。
コンポーネントは、`ActivatableRoute.paramMap`オブザーバブルに登録し、
`id`がそのライフタイム内で変更されるように準備する必要があります。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init" title="app/hero/hero-detail.component.ts (ngOnInit)" linenums="false"></code-example>

<div class="alert is-helpful">

[ルーター](guide/router#route-parameters)ガイドは、`ActivatedRoute.paramMap`について詳しく説明しています。

</div>

テストでは、コンポーネントのコンストラクタに注入された`ActivatedRoute`を操作することによって、
`HeroDetailComponent`が異なる`id`パラメータ値にどのように応答するかを調べることができます。

あなたは`Router`とデータサービスをスパイする方法を知っています。

あなたは`ActivatedRoute`とは異なるアプローチをとるでしょう。

- `paramMap`は、テスト中に複数の値を出力できる`Observable`を返します。
- `ParamMap`を作成するには、ルーターヘルパー関数`convertToParamMap()`が必要です。
- 他の_ルーテッドコンポーネント_テストでは、`ActivatedRoute`のテストダブルが必要です。

これらの違いは、再利用可能なスタブ・クラスを主張します。

#### _ActivatedRouteStub_ 

次の`ActivatedRouteStub`クラスは、`ActivatedRoute`のテストダブルとして機能します。

<code-example 
  path="testing/src/testing/activated-route-stub.ts" 
  region="activated-route-stub" 
  title="testing/activated-route-stub.ts (ActivatedRouteStub)" linenums="false">
</code-example>

このようなヘルパーを`app`フォルダの兄弟の`testing`フォルダに配置することを検討してください。
このサンプルは`ActivatedRouteStub`を`testing/activated-route-stub.ts`に置きます。

<div class="alert is-helpful">

  [_マーブルテストライブラリ_](#marble-testing)
  でこのスタブクラスのより能力の高いバージョンを書くことを検討してください。

</div>

{@a tests-w-test-double}

#### _ActivatedRouteStub_ を使用したテスト

ここでは、観察された`id`が既存のヒーローを参照しているときのコンポーネントの動作を示すテストがあります:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id" title="app/hero/hero-detail.component.spec.ts (existing id)" linenums="false"></code-example>

<div class="alert is-helpful">

`createComponent()`メソッドとページオブジェクトについては[後述](#page-object)します。
今はあなたの直感に頼ってください。

</div>

`id`が見つからない場合、コンポーネントは`HeroListComponent`にリルートする必要があります。

テストスイートのセットアップは、実際にナビゲートせずにルータをスパイしている[上記](#routing-component)の同じルータスパイを提供しました。

このテストでは、コンポーネントが`HeroListComponent`にナビゲートしようとします。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id" title="app/hero/hero-detail.component.spec.ts (bad id)" linenums="false"></code-example>

このアプリは`id`パラメータを省略した`HeroDetailComponent`へのルートを持っていませんが、いつかそのようなルートを追加するかもしれません。
コンポーネントは、`id`がないときに妥当な何かを行うべきです。

この実装では、コンポーネントは新しいヒーローを作成して表示する必要があります。
新しいヒーローには`id=0`と空白の`name`があります:

<code-example 
  path="testing/src/app/hero/hero-detail.component.spec.ts" 
  region="route-no-id" 
  title="app/hero/hero-detail.component.spec.ts (no id)" linenums="false">
</code-example>

<hr>

### ネストしたコンポーネントのテスト

コンポーネントテンプレートには、
多くのコンポーネントが含まれるネストされたコンポーネントが含まれていることがよくあります。

コンポーネントツリーは非常に深くてもかまいません。
ほとんどの場合、ネストされたコンポーネントは、ツリーの最上部にあるコンポーネントのテストには何の役割も果たしません。

たとえば、`AppComponent`は、アンカーとその`RouterLink`ディレクティブを含むナビゲーションバーを表示します。

<code-example 
  path="testing/src/app/app.component.html" 
  title="app/app.component.html" linenums="false">
</code-example>

`AppComponent`_クラス_は空ですが、
おそらく[以下の理由](#why-stubbed-routerlink-tests)で、
リンクが`RouterLink`ディレクティブに正しく配線されているかどうかを確認するための単体テストを作成することができます。

リンクを検証するには、`Router`をナビゲートする必要はなく、`Router`が_ルーテッドコンポーネント_を挿入する場所を示すために`<router-outlet>`は必要ありません。

`BannerComponent`と`WelcomeComponen`t（`<app-banner>`と`<app-welcome>`で示される）も無関係です。

しかし、`AppComponent`をDOMに作成するテストでは、これらの3つのコンポーネントのインスタンスも作成されます。そのような場合は、`TestBed`を構成して作成する必要があります。

宣言を怠ると、Angularコンパイラは`AppComponent`テンプレートの`<app-banner>`、`<app-welcome>`、および`<router-outlet>`タグを認識せず、エラーをスローします。

実際のコンポーネントを宣言する場合は、ネストされたコンポーネントを宣言し、ツリー内の_任意_のコンポーネントに注入された_すべて_のサービスも提供する必要があります。

これは、リンクについての簡単な質問に答えるだけの努力です。

このセクションでは、セットアップを最小限に抑えるための2つの手法について説明します。
主要なコンポーネントのテストに集中するために、これらを単独または組み合わせて使用​​してください。

{@a stub-component}

##### 不必要なコンポーネントをスタブする

最初の手法では、
テストでほとんど役割を果たさないコンポーネントとディレクティブのスタブ・バージョンを作成して宣言します。

<code-example 
  path="testing/src/app/app.component.spec.ts" 
  region="component-stubs" 
  title="app/app.component.spec.ts (stub declaration)" linenums="false">
</code-example>

スタブセレクターは、対応する実数成分のセレクタと一致します。
しかし、そのテンプレートとクラスは空です。

その後、`TestBed`の設定で、
実際に必要なコンポーネント、ディレクティブ、パイプの隣に宣言します。

<code-example 
  path="testing/src/app/app.component.spec.ts" 
  region="testbed-stubs" 
  title="app/app.component.spec.ts (TestBed stubs)" linenums="false">
</code-example>

`AppComponent`はテスト対象ですので、もちろん実際のバージョンを宣言してください。

[後述]](#routerlink)する`RouterLinkDirectiveStub`は、
リンクテストに役立つ実際の`RouterLink`のテストバージョンです。

残りはスタブです。

{@a no-errors-schema}

#### *NO\_ERRORS\_SCHEMA*

2番目の方法では、`NO_ERRORS_SCHEMA`を`TestBed.schemas`メタデータに追加します。

<code-example 
  path="testing/src/app/app.component.spec.ts" 
  region="no-errors-schema" 
  title="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" linenums="false">
</code-example>

`NO_ERRORS_SCHEMA`は、認識できない要素と属性を無視するようにAngularコンパイラに指示します。

コンパイラは、`TestBed`の設定で対応する`AppComponent`と`RouterLinkDirectiveStub`を宣言したため、`<app-root>`要素と`routerLink`属性を認識します。

しかし、`<app-banner>`、`<app-welcome>`、または`<router-outlet>`が見つかった場合、
コンパイラはエラーを投げません。 単に空のタグとしてレンダリングし、ブラウザはそれらを無視します。

スタブコンポーネントはもう必要ありません。

#### 両方のテクニックを使用する

これらは、
コンポーネントの視覚的な表面をテストの対象となるコンポーネントのテンプレート内の要素だけに縮小するため、
_浅いコンポーネントテスト_の技術です。

`NO_ERRORS_SCHEMA`のアプローチは2つの方が簡単ですが、それを過度に使用しないでください。

また、`NO_ERRORS_SCHEMA`は、誤って省略した、
またはスペルの間違ったコンポーネントや属性についてコンパイラーが知らせないようにします。
コンパイラが瞬時に捉えていたファントムバグを追跡する時間を無駄にすることがあります。

_スタブコンポーネント_アプローチには別の利点があります。
_この_例のスタブは空ですが、
テストで何らかの方法でテストを行う必要がある場合は、
テンプレートとクラスを取り除くことができます。

実際には、この例のように同じ設定で2つの手法を組み合わせます。

<code-example 
  path="testing/src/app/app.component.spec.ts" 
  region="mixed-setup" 
  title="app/app.component.spec.ts (mixed setup)" linenums="false">
</code-example>

Angularコンパイラは、`<app-banner>`要素の`BannerComponentStub`を作成し、
`routerLink`属性を持つアンカーに`RouterLinkStubDirective`を適用しますが、
`<app-welcome>`タグと`<router-outlet>`タグは無視します。

<hr>

{@a routerlink}
### _RouterLink_を使用したコンポーネント

実際の`RouterLinkDirective`はかなり複雑で、
`RouterModule`の他のコンポーネントとディレクティブと絡み合っています。
テストで模擬して使用するには、挑戦的なセットアップが必要です。

このサンプルコードの`RouterLinkDirectiveStub`は、
実際のディレクティブを、
`AppComponent`テンプレートに見られるアンカータグ配線の種類を検証するために設計された代替バージョンに置き換えます。

<code-example 
  path="testing/src/testing/router-link-directive-stub.ts" 
  region="router-link" 
  title="testing/router-link-directive-stub.ts (RouterLinkDirectiveStub)" linenums="false">
</code-example>

`[routerLink]`属性にバインドされたURLは、ディレクティブの`linkParams`プロパティに流れます。

ホストメタデータプロパティは、
ホスト要素のクリックイベント（`AppComponent`の`<a>`アンカー要素）をスタブディレクティブの`onClick`メソッドに結び付けます。

アンカーをクリックすると、
`onClick()`メソッドが起動し、スタブのtelltale navigatedToプロパティが設定されます。
テストでは、`navigatedTo`を調べて、
アンカーをクリックすると予想されるルート定義が設定されていることを確認します。

<div class="alert is-helpful">

ルータがそのルート定義でナビゲートするように正しく設定されているかどうかは、別々のテストセットで考えることです。

</div>

{@a by-directive}
{@a inject-directive}

#### _By.directive_ と注入したディレクティブ

もう少しセットアップすると、最初のデータバインディングがトリガーされ、ナビゲーションリンクへの参照が取得されます:

<code-example 
  path="testing/src/app/app.component.spec.ts" 
  region="test-setup" 
  title="app/app.component.spec.ts (test setup)" linenums="false">
</code-example>

特に興味のある3つのポイント:

1. `By.directive`を使用して、添付されたディレクティブでアンカー要素を見つけることができます。

1. クエリは、一致する要素のまわりで`DebugElement`ラッパーを返します。

1. 各`DebugElement`は、
   その要素にアタッチされたディレクティブの特定のインスタンスを持つ依存インジェクタを公開します。

検証のための`AppComponent`リンクは次のとおりです:

<code-example 
  path="testing/src/app/app.component.html" 
  region="links"
  title="app/app.component.html (navigation links)" linenums="false">
</code-example>

{@a app-component-tests}

これらのリンクが期待どおりに`routerLink`ディレクティブに配線されていることを確認するテストがいくつかあります:

<code-example path="testing/src/app/app.component.spec.ts" region="tests" title="app/app.component.spec.ts (selected tests)" linenums="false"></code-example>

<div class="alert is-helpful">

_この例_の"click"テストは誤解を招きます。
これは、_コンポーネント_ではなく、`RouterLinkDirectiveStub`をテストします。
これは、ディレクティブスタブの一般的な失敗です。

このガイドには正当な目的があります。
ルータの全機能を使用することなく、`RouterLink`要素を見つけてクリックし、結果を検査する方法を示します。
これは、ユーザーがリンクをクリックしたときに、
示を変更したり、パラメータを再計算したり、ナビゲーションオプションを並べ替えたりする、
より洗練されたコンポーネントをテストするために必要なスキルです。

</div>

{@a why-stubbed-routerlink-tests}

#### それらのテストは何がよいのですか?

スタブした `RouterLink`テストでは、リンクとコンセントを持つコンポーネントが正しく設定されていること、
コンポーネントに必要なリンクがあり、すべてが期待される方向を指していることを確認できます。
これらのテストは、ユーザーがリンクをクリックしたときにアプリケーションがターゲットコンポーネントにナビゲートするのに成功するかどうかには関係ありません。

このような制限されたテストの目的には、`RouterLink`と`RouterOutlet`をスタブすることが最良の選択肢です。
実際のルータに依存すると、それらは脆弱になります。
コンポーネントと無関係の理由で失敗する可能性があります。
たとえば、ナビゲーションガードによって、権限のないユーザーが`HeroListComponent`にアクセスするのを防ぐことができます。
これは`AppComponent`の欠陥ではなく、そのコンポーネントへの変更は失敗したテストを修正することはできません。

テストの_別_のバッテリーは、ユーザーが認証され、許可されているかどうかなど、
ガードに影響する条件が存在する場合にアプリケーションが期待どおりにナビゲートするかどうかを調べることができます。

<div class="alert is-helpful">

将来のガイドアップデートでは、
`RouterTestingModule`でこのようなテストを書く方法を説明します。

</div>

<hr>

{@a page-object}

### _page_ オブジェクトを使用する

`HeroDetailComponent`は、タイトル、ヒーローフィールド2つ、ボタン2つのシンプルなビューです。

<figure>
  <img src='generated/images/guide/testing/hero-detail.component.png' alt="HeroDetailComponent in action">
</figure>

しかし、この単純な形式でも複雑なテンプレートがたくさんあります。

<code-example 
  path="testing/src/app/hero/hero-detail.component.html" title="app/hero/hero-detail.component.html" linenums="false">
</code-example>

コンポーネントが必要とするテストが必要です...

- 要素がDOMに現れる前にヒーローが到着するまで待つ。
- タイトルテキストへの参照。
- それを調べて設定するための名前入力ボックスへの参照。
- 2つのボタンをクリックすることができるように2つのボタンへの参照。
- いくつかのコンポーネントとルータの方法をスパイする。

このような小さなフォームであっても、拷問された条件設定とCSS要素の選択が混乱することがあります。

コンポーネントプロパティへのアクセスを処理し、それらを設定するロジックをカプセル化する`Page`クラスを使用して、複雑さを克服してください。

つぎは`hero-detail.component.spec.ts`の`Page`クラスです。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts" 
  region="page" 
  title="app/hero/hero-detail.component.spec.ts (Page)" linenums="false">
</code-example>

コンポーネントの操作と検査の重要なフックは、`Page`のインスタンスからきれいに整理され、アクセス可能になりました。

`createComponent`メソッドは`page`オブジェクトを作成し、`hero`が到着すると空白を埋め込みます。

<code-example 
  path="testing/src/app/hero/hero-detail.component.spec.ts" 
  region="create-component" 
  title="app/hero/hero-detail.component.spec.ts (createComponent)" linenums="false">
</code-example>

以前のセクションの[_HeroDetailComponent_ テスト](#tests-w-test-double)では、
`createComponent`と`page`がテストを短くして_メッセージ_を保持する方法を示しています。
注意を払う必要はありません。promiseを待つことなく、比較する要素値をDOMから検索する必要はありません。

この点を補強する`HeroDetailComponent`テストがいくつかあります。

<code-example 
  path="testing/src/app/hero/hero-detail.component.spec.ts" 
  region="selected-tests" 
  title="app/hero/hero-detail.component.spec.ts (selected tests)" linenums="false">
</code-example>

<hr>

{@a compile-components}
### _compileComponents()_ を呼び出す

<div class="alert is-helpful">

テストを実行する前にCLIがアプリケーションをコンパイルするので、
CLI `ng test`コマンドでテストを実行する_だけ_であれば、このセクションは無視できます。

</div>

**非CLI環境**でテストを実行すると、テストはこのようなメッセージで失敗することがあります:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent 
which is using a "templateUrl" or "styleUrls", but they were never compiled. 
Please call "TestBed.compileComponents" before your test.
</code-example>

この問題の根本原因は、
`BannerComponent`の次のバージョンのように、
テストに関係するコンポーネントの少なくとも1つが外部テンプレートまたはCSSファイルを指定していることです。

<code-example 
  path="testing/src/app/banner/banner-external.component.ts"
  title="app/banner/banner-external.component.ts (external template & css)" linenums="false">
</code-example>

`TestBed`がコンポーネントを作成しようとすると、テストは失敗します。

<code-example 
  path="testing/src/app/banner/banner.component.spec.ts"
  region="configure-and-create"
  title="app/banner/banner.component.spec.ts (setup that fails)" 
  avoid linenums="false">
</code-example>

アプリがコンパイルされていないことを思い出してください。
したがって、`createComponent()`を呼び出すと、`TestBed`は暗黙的にコンパイルされます。

これは、ソースコードがメモリにあるときには問題ありません。
しかし、`BannerComponent`は、
コンパイルが本質的に
_非同期_操作であるファイルシステムから読み取らなければならない外部ファイルを必要とします。

`TestBed`を続行することが許されていれば、
テストは実行され、コンパイラが終了する前に不思議に失敗します。

プリエンプティブエラーメッセージは、`compileComponents()`で明示的にコンパイルするよう指示します。

#### _compileComponents()_ は非同期

非同期テスト関数内で`compileComponents()`を呼び出す必要があります。

<div class="alert is-critical">

テスト機能を非同期にすることを怠った場合
（たとえば、後述の`async()`の使用を忘れた場合）、
このエラーメッセージが表示されます

<code-example language="sh" class="code-shell" hideCopy>
Error: ViewDestroyedError: Attempt to use a destroyed view
</code-example>

</div>

典型的な方法は、セットアップロジックを2つの別々の`beforeEach()`関数に分割することです。

1. コンポーネントをコンパイルする非同期の`beforeEach()`
1. 残りのセットアップを実行する同期`beforeEach()`。

このパターンに従うには、`async()`ヘルパーを他のテストシンボルとともにインポートします。

<code-example 
  path="testing/src/app/banner/banner-external.component.spec.ts" 
  region="import-async">
</code-example>

#### 非同期な_beforeEach_

このように最初の非同期`beforeEach`を書いてください。

<code-example 
  path="testing/src/app/banner/banner-external.component.spec.ts" 
  region="async-before-each" 
  title="app/banner/banner-external.component.spec.ts (async beforeEach)" linenums="false">
</code-example>

`async()`ヘルパー関数は、セットアップ本体にパラメータのない関数を取ります。

`TestBed.configureTestingModule()`メソッドは`TestBed`クラスを返します。
これにより、`compileComponents()`などの他の`TestBed`静的メソッドに呼び出しをチェーンすることができます。

この例では、`BannerComponent`はコンパイルする唯一のコンポーネントです。
他の例では、テストモジュールを複数のコンポーネントで構成し、
より多くのコンポーネントを保持するアプリケーションモジュールをインポートできます。
いずれも外部ファイルを必要とする可能性があります。

`TestBed.compileComponents`メソッドは、テストモジュールで構成されたすべてのコンポーネントを非同期にコンパイルします。

<div class="alert is-important">

`TestBed`を`compileComponents()`を呼び出して再設定しないでください.

</div>

`compileComponents()`を呼び出すと、現在の`TestBed`インスタンスが閉じられ、さらに設定が行われます。
`configureTestingModule()`や`override...`メソッドのいずれも呼び出すことはできません。
試してみると、`TestBed`はエラーを投げます。

`compileComponents()`を`TestBed.createComponent()`
を呼び出す前の最後のステップにします。

#### 同期的な _beforeEach_

2番目の同期`beforeEach()`には、
コンポーネントの作成と検査する要素のクエリを含む残りの設定手順が含まれています。

<code-example 
  path="testing/src/app/banner/banner-external.component.spec.ts" 
  region="sync-before-each" 
  title="app/banner/banner-external.component.spec.ts (synchronous beforeEach)" linenums="false">
</code-example>

テストランナーは、最初の非同期`beforeEach`が完了してから2番目を呼び出すのを待つことができます。

#### 統合セットアップ

2つの`beforeEach()`関数を1つの非同期の `beforeEach()`に統合することができます。

`compileComponents()`メソッドは、
同期コードを`then(...)`コールバックに移動することによって、
コンパイル_後_に同期セットアップタスクを実行できるようにpromiseを返します。

<code-example 
  path="testing/src/app/banner/banner-external.component.spec.ts" 
  region="one-before-each" 
  title="app/banner/banner-external.component.spec.ts (one beforeEach)" linenums="false">
</code-example>

#### _compileComponents()_ は無害

`compileComponents()`が必要でないときは、それを呼び出すことに害はありません。

CLIによって生成されたコンポーネントテストファイルは、
`ng test`の実行時には必要ではないのに`compileComponents()`を呼び出します。

<hr>

{@a import-module}

### Setup with module imports

これまでのコンポーネントテストでは、このようにいくつかの`declarations`でテストモジュールを構成しました:

<code-example 
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="config-testbed" 
  title="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)">
</code-example>

`DashboardComponent`はシンプルです。
それは助けを必要としない。
しかし、より複雑なコンポーネントは、多くの場合、他のコンポーネント、ディレクティブ、パイプ、プロバイダに依存し、これらもテストモジュールに追加する必要があります。

幸いにも、`TestBed.configureTestingModule`パラメータは、
`@NgModule`デコレータに渡されるメタデータとパラレルになります。
つまり、`providers`と`imports`を指定することもできます。

`HeroDetailComponent`は、サイズが小さく簡単な構成にもかかわらず、多くの助けが必要です。
デフォルトテストモジュール`CommonModule`から受け取るサポートに加えて:

- `FormsModule`内の`NgModel`とその友達が双方向データバインディングを有効にします。
- `TitleCasePipe`は、`shared`フォルダから取得します。
- ルータサービス（これらのテストではスタブしています）。
- ヒーローデータアクセスサービス（スタブされている）

1つのアプローチは、
この例のように個々の部分からテストモジュールを構成することです:

<code-example 
  path="testing/src/app/hero/hero-detail.component.spec.ts" 
  region="setup-forms-module" 
  title="app/hero/hero-detail.component.spec.ts (FormsModule setup)" linenums="false">
</code-example>

<div class="alert is-helpful">

`beforeEach()`は非同期で、`TestBed.compileComponents`を呼び出します。
これは、`HeroDetailComponent`に外部テンプレートとCSSファイルがあるためです。

上記の[_`compileComponents()`の呼び出し_](#compile-components)で説明したように、
これらのテストは、
Angularがブラウザでコンパイルしなければならない非CLI環境で実行できます。

</div>

#### 共有モジュールをインポートする

多くのアプリコンポーネントは`FormsModule`と`TitleCasePipe`を必要とするため、
開発者は頻繁に要求されるこれらのコンポーネントと他の頻繁に要求されるコンポーネントを組み合わせるために`SharedModule`を作成しました。

テスト構成では、この代替セットアップで見られる`SharedModule`も使用できます:

<code-example 
  path="testing/src/app/hero/hero-detail.component.spec.ts" 
  region="setup-shared-module" 
  title="app/hero/hero-detail.component.spec.ts (SharedModule setup)" linenums="false">
</code-example>

インポートステートメントの数が少なくて済むようになっています（図示せず）。

{@a feature-module-import}

#### フィーチャーモジュールをインポートする

`HeroDetailComponent`は`HeroModule`[フィーチャモジュール](guide/feature-modules)の一部で、
`SharedModule`を含む相互依存関係の多くを集約します。
このような`HeroModule`をインポートするテスト構成を試してみてください:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module" title="app/hero/hero-detail.component.spec.ts (HeroModule setup)" linenums="false"></code-example>

それは_本当_に鮮明です。`providers`のテストダブルにとどまります。
`HeroDetailComponent`宣言さえもなくなりました。

実際に、宣言しようとすると、`HeroDetailComponent`が`TestBed`によって作成された`HeroModule`と`DynamicTestModule`の両方で宣言されるため、Angularはエラーをスローします。

フィーチャモジュールがそうであるように、コンポーネントのフィーチャモジュールをインポートすることは、モジュール内に相互依存関係が多く、モジュールが小さい場合にテストを構成する最も簡単な方法です。


<div class="alert is-helpful">

フィーチャモジュールがそうであるように、
コンポーネントのフィーチャモジュールをインポートすることは、モジュール内に相互依存関係が多く、
モジュールが小さい場合にテストを構成する最も簡単な方法です。

</div>

<hr>

{@a component-override}

### コンポーネントのプロバイダーを上書きする

`HeroDetailComponent`は自身の`HeroDetailService`を提供します。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="prototype" title="app/hero/hero-detail.component.ts (prototype)" linenums="false"></code-example>

`TestBed.configureTestingModule`の`providers`でコンポーネントの`HeroDetailService`をスタブすることはできません。
それらはコンポーネントではなく、_テストモジュール_のプロバイダです。
それらは、_フィクスチャレベル_で依存インジェクタを準備します。

Angularは、フィクスチャインジェクタの_子_である_独自_のインジェクタを使用してコンポーネントを作成します。
コンポーネントのプロバイダ（この場合は`HeroDetailService`）を子インジェクタに登録します。

テストでは、フィクスチャのインジェクタからのインジェクタサービスを受けることができません。
また、`TestBed.configureTestingModule`はそれらを構成することもできません。

Angularは本物の`HeroDetailService`の新しいインスタンスを作成しています！

<div class="alert is-helpful">

`HeroDetailService`がリモートサーバーへの独自のXHR呼び出しを行った場合、
これらのテストは失敗するか、タイムアウトになる可能性があります。呼び出すリモートサーバーがない可能性があります。

幸いにも、`HeroDetailService`は、注入された`HeroService`へのリモートデータアクセスの責任を委任します。

<code-example path="testing/src/app/hero/hero-detail.service.ts" region="prototype" title="app/hero/hero-detail.service.ts (prototype)" linenums="false"></code-example>

[以前のテスト構成](#feature-module-import)では、実際の`HeroService`が、
サーバー要求をインターセプトして応答を偽装する`TestHeroService`に置き換えられました。

</div>

もしあなたがとても幸運でないなら、どうでしょうか？
`HeroService`をモックするのが難しい場合はどうすればいいですか？`HeroDetailService`が独自のサーバーリクエストを作成するとどうなりますか？

`TestBed.overrideComponent`メソッドは、コンポーネントの`providers`を、
以下のセットアップのバリエーションに示すように、管理しやすい_テストダブル_に置き換えることができます:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override" title="app/hero/hero-detail.component.spec.ts (Override setup)" linenums="false"></code-example>

`TestBed.configureTestingModule`は[不要](#spy-stub)であるため、(偽の）`HeroService`を提供しなくなりました。

{@a override-component-method}

#### _overrideComponent_ メソッド

`overrideComponent` メソッドにフォーカスしてください。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method" title="app/hero/hero-detail.component.spec.ts (overrideComponent)" linenums="false"></code-example>

オーバーライドするコンポーネントタイプ（`HeroDetailComponent`）とオーバーライドメタデータオブジェクトの2つの引数をとります。
[オーバーライドメタデータオブジェクト](#metadata-override-object)は、以下のように定義されるジェネリックオブジェクトです:

<code-example format="." language="javascript">
  type MetadataOverride<T> = {
    add?: Partial<T>;
    remove?: Partial<T>;
    set?: Partial<T>;
  };
</code-example>

メタデータオーバーライドオブジェクトは、メタデータプロパティに要素を追加または削除するか、またはこれらのプロパティを完全にリセットすることができます。
この例では、コンポーネントの`providers`のメタデータをリセットします。

型パラメータ`T`は`@Component`デコレータに渡すメタデータの種類です

<code-example format="." language="javascript">
  selector?: string;
  template?: string;
  templateUrl?: string;
  providers?: any[];
  ...
</code-example>

{@a spy-stub}

#### _スパイスタブ_を提供する (_HeroDetailServiceSpy_)

この例では、コンポーネントの`providers`配列を、`HeroDetailServiceSpy`を含む新しい配列で完全に置き換えています。

`HeroDetailServiceSpy`は、そのサービスのすべての必要な機能を偽装する、
実際の`HeroDetailService`のスタブ付きバージョンです。
下位レベルの`HeroService`にインジェクションもデリゲートもしないので、
そのためのテストダブルを用意する必要はありません。

関連する`HeroDetailComponent`テストは、
`HeroDetailService`のメソッドがサービスメソッドをスパイすることによって呼び出されたことを宣言します。
したがって、スタブはそのメソッドをスパイとして実装します:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy" title="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" linenums="false"></code-example>

{@a override-tests}

#### テストを上書きする

テストでは、スパイスタブの`testHero`を操作してコンポーネントのヒーローを直接制御し、
サービスメソッドが呼び出されたことを確認できます。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests" title="app/hero/hero-detail.component.spec.ts (override tests)" linenums="false"></code-example>

{@a more-overrides}

#### More overrides

`TestBed.overrideComponent`メソッドは、同じコンポーネントまたは異なるコンポーネントに対して複数回呼び出すことができます。
`TestBed`は、他のクラスの部分を掘り下げて置き換えるための`overrideDirective`、`overrideModule`、
および`overridePipe`の同様のメソッドを提供します。

あなた自身のオプションと組み合わせを探そう。

<hr>

{@a attribute-directive}

## Attribute Directive Testing

An _attribute directive_ modifies the behavior of an element, component or another directive.
Its name reflects the way the directive is applied: as an attribute on a host element.

The sample application's `HighlightDirective` sets the background color of an element
based on either a data bound color or a default color (lightgray).
It also sets a custom property of the element (`customProperty`) to `true`
for no reason other than to show that it can.

<code-example path="testing/src/app/shared/highlight.directive.ts" title="app/shared/highlight.directive.ts" linenums="false"></code-example>

It's used throughout the application, perhaps most simply in the `AboutComponent`:

<code-example path="testing/src/app/about/about.component.ts" title="app/about/about.component.ts" linenums="false"></code-example>

Testing the specific use of the `HighlightDirective` within the `AboutComponent` requires only the
techniques explored above (in particular the ["Shallow test"](#nested-component-tests) approach).

<code-example path="testing/src/app/about/about.component.spec.ts" region="tests" title="app/about/about.component.spec.ts" linenums="false"></code-example>

However, testing a single use case is unlikely to explore the full range of a directive's capabilities.
Finding and testing all components that use the directive is tedious, brittle, and almost as unlikely to afford full coverage.

_Class-only tests_ might be helpful,
but attribute directives like this one tend to manipulate the DOM.
Isolated unit tests don't touch the DOM and, therefore,
do not inspire confidence in the directive's efficacy.

A better solution is to create an artificial test component that demonstrates all ways to apply the directive.

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" title="app/shared/highlight.directive.spec.ts (TestComponent)" linenums="false"></code-example>

<figure>
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="HighlightDirective spec in action">
</figure>

<div class="alert is-helpful">

The `<input>` case binds the `HighlightDirective` to the name of a color value in the input box.
The initial value is the word "cyan" which should be the background color of the input box.

</div>

Here are some tests of this component:

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" title="app/shared/highlight.directive.spec.ts (selected tests)"></code-example>

A few techniques are noteworthy:

* The `By.directive` predicate is a great way to get the elements that have this directive _when their element types are unknown_.

* The <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not">`:not` pseudo-class</a>
in `By.css('h2:not([highlight])')` helps find `<h2>` elements that _do not_ have the directive.
`By.css('*:not([highlight])')` finds _any_ element that does not have the directive.

* `DebugElement.styles` affords access to element styles even in the absence of a real browser, thanks to the `DebugElement` abstraction.
But feel free to exploit the `nativeElement` when that seems easier or more clear than the abstraction.

* Angular adds a directive to the injector of the element to which it is applied.
The test for the default color uses the injector of the second `<h2>` to get its `HighlightDirective` instance
and its `defaultColor`.

* `DebugElement.properties` affords access to the artificial custom property that is set by the directive.

<hr>

## Pipe Testing

Pipes are easy to test without the Angular testing utilities.

A pipe class has one method, `transform`, that manipulates the input
value into a transformed output value.
The `transform` implementation rarely interacts with the DOM.
Most pipes have no dependence on Angular other than the `@Pipe`
metadata and an interface.

Consider a `TitleCasePipe` that capitalizes the first letter of each word.
Here's a naive implementation with a regular expression.

<code-example path="testing/src/app/shared/title-case.pipe.ts" title="app/shared/title-case.pipe.ts" linenums="false"></code-example>

Anything that uses a regular expression is worth testing thoroughly.
Use simple Jasmine to explore the expected cases and the edge cases.

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" title="app/shared/title-case.pipe.spec.ts"></code-example>

{@a write-tests}

#### Write DOM tests too

These are tests of the pipe _in isolation_.
They can't tell if the `TitleCasePipe` is working properly as applied in the application components.

Consider adding component tests such as this one:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" title="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

{@a test-debugging}

## Test debugging

Debug specs in the browser in the same way that you debug an application.

  1. Reveal the karma browser window (hidden earlier).
  1. Click the **DEBUG** button; it opens a new browser tab and re-runs the tests.
  1. Open the browser's “Developer Tools” (`Ctrl-Shift-I` on windows; `Command-Option-I` in OSX).
  1. Pick the "sources" section.
  1. Open the `1st.spec.ts` test file (Control/Command-P, then start typing the name of the file).
  1. Set a breakpoint in the test.
  1. Refresh the browser, and it stops at the breakpoint.

<figure>
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma debugging">
</figure>

<hr>

{@a atu-apis}

## Testing Utility APIs

This section takes inventory of the most useful Angular testing features and summarizes what they do.

The Angular testing utilities include the `TestBed`, the `ComponentFixture`, and a handful of functions that control the test environment.
The [_TestBed_](#testbed-api-summary) and [_ComponentFixture_](#component-fixture-api-summary) classes are covered separately.

Here's a summary of the stand-alone functions, in order of likely utility:

<table>
  <tr>
    <th>
      Function
    </th>
    <th>
      Description
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>async</code>
    </td>

    <td>

      Runs the body of a test (`it`) or setup (`beforeEach`) function within a special _async test zone_.
      See [discussion above](#async).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>fakeAsync</code>
    </td>

    <td>

      Runs the body of a test (`it`) within a special _fakeAsync test zone_, enabling
      a linear control flow coding style. See [discussion above](#fake-async).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>tick</code>
    </td>

    <td>

      Simulates the passage of time and the completion of pending asynchronous activities
      by flushing both _timer_ and _micro-task_ queues within the _fakeAsync test zone_.

      <div class="alert is-helpful">

      The curious, dedicated reader might enjoy this lengthy blog post,
      ["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

      </div>

      Accepts an optional argument that moves the virtual clock forward
      by the specified number of milliseconds,
      clearing asynchronous activities scheduled within that timeframe.
      See [discussion above](#tick).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
       <code>inject</code>
    </td>

    <td>

      Injects one or more services from the current `TestBed` injector into a test function.
      It cannot inject a service provided by the component itself.
      See discussion of the [debugElement.injector](#get-injected-services).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>discardPeriodicTasks</code>
    </td>

    <td>

      When a `fakeAsync` test ends with pending timer event _tasks_ (queued `setTimeOut` and `setInterval` callbacks),
      the test fails with a clear error message.

      In general, a test should end with no queued tasks.
      When pending timer tasks are expected, call `discardPeriodicTasks` to flush the _task_ queue
      and avoid the error.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>flushMicrotasks</code>
    </td>

    <td>

      When a `fakeAsync` test ends with pending _micro-tasks_ such as unresolved promises,
      the test fails with a clear error message.

      In general, a test should wait for micro-tasks to finish.
      When pending microtasks are expected, call `flushMicrotasks` to flush the  _micro-task_ queue
      and avoid the error.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>ComponentFixtureAutoDetect</code>
    </td>

    <td>

      A provider token for a service that turns on [automatic change detection](#automatic-change-detection).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>getTestBed</code>
    </td>

    <td>

      Gets the current instance of the `TestBed`.
      Usually unnecessary because the static class methods of the `TestBed` class are typically sufficient.
      The `TestBed` instance exposes a few rarely used members that are not available as
      static methods.

    </td>
  </tr>
</table>

<hr>

{@a testbed-class-summary}

#### _TestBed_ class summary

The `TestBed` class is one of the principal Angular testing utilities.
Its API is quite large and can be overwhelming until you've explored it,
a little at a time. Read the early part of this guide first
to get the basics before trying to absorb the full API.

The module definition passed to `configureTestingModule`
is a subset of the `@NgModule` metadata properties.

<code-example format="." language="javascript">
  type TestModuleMetadata = {
    providers?: any[];
    declarations?: any[];
    imports?: any[];
    schemas?: Array&lt;SchemaMetadata | any[]&gt;;
  };
</code-example>

{@a metadata-override-object}

Each override method takes a `MetadataOverride<T>` where `T` is the kind of metadata
appropriate to the method, that is, the parameter of an `@NgModule`,
`@Component`, `@Directive`, or `@Pipe`.

<code-example format="." language="javascript">
  type MetadataOverride<T> = {
    add?: Partial<T>;
    remove?: Partial<T>;
    set?: Partial<T>;
  };
</code-example>

{@a testbed-methods}
{@a testbed-api-summary}

The `TestBed` API consists of static class methods that either update or reference a _global_ instance of the`TestBed`.

Internally, all static methods cover methods of the current runtime `TestBed` instance,
which is also returned by the `getTestBed()` function.

Call `TestBed` methods _within_ a `beforeEach()` to ensure a fresh start before each individual test.

Here are the most important static methods, in order of likely utility.

<table>
  <tr>
    <th>
      Methods
    </th>
    <th>
      Description
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>configureTestingModule</code>
    </td>

    <td>

      The testing shims (`karma-test-shim`, `browser-test-shim`)
      establish the [initial test environment](guide/testing) and a default testing module.
      The default testing module is configured with basic declaratives and some Angular service substitutes that every tester needs.

      Call `configureTestingModule` to refine the testing module configuration for a particular set of tests
      by adding and removing imports, declarations (of components, directives, and pipes), and providers.
    
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>compileComponents</code>
    </td>

    <td>

      Compile the testing module asynchronously after you've finished configuring it.
      You **must** call this method if _any_ of the testing module components have a `templateUrl`
      or `styleUrls` because fetching component template and style files is necessarily asynchronous.
      See [above](#compile-components).

      After calling `compileComponents`, the `TestBed` configuration is frozen for the duration of the current spec.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>createComponent<T></code>
    </td>

    <td>

      Create an instance of a component of type `T` based on the current `TestBed` configuration.
      After calling `compileComponent`, the `TestBed` configuration is frozen for the duration of the current spec.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideModule</code>
    </td>
    <td>

      Replace metadata for the given `NgModule`. Recall that modules can import other modules.
      The `overrideModule` method can reach deeply into the current testing module to
      modify one of these inner modules.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideComponent</code>
    </td>

    <td>

      Replace metadata for the given component class, which could be nested deeply
      within an inner module.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideDirective</code>
    </td>

    <td>

      Replace metadata for the given directive class, which could be nested deeply
      within an inner module.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overridePipe</code>
    </td>
    <td>

      Replace metadata for the given pipe class, which could be nested deeply
      within an inner module.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-get}
      <code>get</code>
    </td>

    <td>

      Retrieve a service from the current `TestBed` injector.

      The `inject` function is often adequate for this purpose.
      But `inject` throws an error if it can't provide the service.

      What if the service is optional?

      The `TestBed.get()` method takes an optional second parameter,
      the object to return if Angular can't find the provider
      (`null` in this example):

      <code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="testbed-get-w-null" title="app/demo/demo.testbed.spec.ts" linenums="false"></code-example>

      After calling `get`, the `TestBed` configuration is frozen for the duration of the current spec.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-initTestEnvironment}
      <code>initTestEnvironment</code>
    </td>
    <td>

      Initialize the testing environment for the entire test run.

      The testing shims (`karma-test-shim`, `browser-test-shim`) call it for you
      so there is rarely a reason for you to call it yourself.

      You may call this method _exactly once_. If you must change
      this default in the middle of your test run, call `resetTestEnvironment` first.

      Specify the Angular compiler factory, a `PlatformRef`, and a default Angular testing module.
      Alternatives for non-browser platforms are available in the general form
      `@angular/platform-<platform_name>/testing/<platform_name>`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>resetTestEnvironment</code>
    </td>
    <td>

      Reset the initial test environment, including the default testing module.

    </td>
  </tr>
</table


A few of the `TestBed` instance methods are not covered by static `TestBed` _class_ methods.
These are rarely needed.

{@a component-fixture-api-summary}

#### The _ComponentFixture_

The `TestBed.createComponent<T>`
creates an instance of the component `T`
and returns a strongly typed `ComponentFixture` for that component.

The `ComponentFixture` properties and methods provide access to the component,
its DOM representation, and aspects of its Angular environment.

{@a component-fixture-properties}

#### _ComponentFixture_ properties

Here are the most important properties for testers, in order of likely utility.

<table>
  <tr>
    <th>
      Properties
    </th>
    <th>
      Description
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      The instance of the component class created by `TestBed.createComponent`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>debugElement</code>
    </td>

    <td>

      The `DebugElement` associated with the root element of the component.

      The `debugElement` provides insight into the component and its DOM element during test and debugging.
      It's a critical property for testers. The most interesting members are covered [below](#debug-element-details).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      The native DOM element at the root of the component.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>changeDetectorRef</code>
    </td>

    <td>

      The `ChangeDetectorRef` for the component.

      The `ChangeDetectorRef` is most valuable when testing a
      component that has the `ChangeDetectionStrategy.OnPush` method
      or the component's change detection is under your programmatic control.

    </td>
  </tr>
</table>

{@a component-fixture-methods}

#### _ComponentFixture_ methods

The _fixture_ methods cause Angular to perform certain tasks on the component tree.
Call these method to trigger Angular behavior in response to simulated user action.

Here are the most useful methods for testers.

<table>
  <tr>
    <th>
      Methods
    </th>
    <th>
      Description
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>detectChanges</code>
    </td>

    <td>

      Trigger a change detection cycle for the component.

      Call it to initialize the component (it calls `ngOnInit`) and after your
      test code, change the component's data bound property values.
      Angular can't see that you've changed `personComponent.name` and won't update the `name`
      binding until you call `detectChanges`.

      Runs `checkNoChanges`afterwards to confirm that there are no circular updates unless
      called as `detectChanges(false)`;

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>autoDetectChanges</code>
    </td>

    <td>

      Set this to `true` when you want the fixture to detect changes automatically.

      When autodetect is `true`, the test fixture calls `detectChanges` immediately
      after creating the component. Then it listens for pertinent zone events
      and calls `detectChanges` accordingly.
      When your test code modifies component property values directly,
      you probably still have to call `fixture.detectChanges` to trigger data binding updates.

      The default is `false`. Testers who prefer fine control over test behavior
      tend to keep it `false`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>checkNoChanges</code>
    </td>

    <td>

      Do a change detection run to make sure there are no pending changes.
      Throws an exceptions if there are.
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>isStable</code>
    </td>

    <td>

      If the fixture is currently _stable_, returns `true`.
      If there are async tasks that have not completed, returns `false`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>whenStable</code>
    </td>

    <td>

      Returns a promise that resolves when the fixture is stable.

      To resume testing after completion of asynchronous activity or
      asynchronous change detection, hook that promise.
      See [above](#when-stable).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>destroy</code>
    </td>

    <td>

      Trigger component destruction.

    </td>
  </tr>
</table>

{@a debug-element-details}

#### _DebugElement_

The `DebugElement` provides crucial insights into the component's DOM representation.

From the test root component's `DebugElement` returned by `fixture.debugElement`,
you can walk (and query) the fixture's entire element and component subtrees.

Here are the most useful `DebugElement` members for testers, in approximate order of utility:

<table>
  <tr>
    <th>
      Member
    </th>
    <th>
      Description
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      The corresponding DOM element in the browser (null for WebWorkers).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>query</code>
    </td>

    <td>

      Calling `query(predicate: Predicate<DebugElement>)` returns the first `DebugElement`
      that matches the [predicate](#query-predicate) at any depth in the subtree.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>queryAll</code>
    </td>

    <td>

      Calling `queryAll(predicate: Predicate<DebugElement>)` returns all `DebugElements`
      that matches the [predicate](#query-predicate) at any depth in subtree.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>injector</code>
    </td>

    <td>

      The host dependency injector.
      For example, the root element's component instance injector.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      The element's own component instance, if it has one.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>context</code>
    </td>

    <td>

      An object that provides parent context for this element.
      Often an ancestor component instance that governs this element.

      When an element is repeated within `*ngFor`, the context is an `NgForRow` whose `$implicit`
      property is the value of the row instance value.
      For example, the `hero` in `*ngFor="let hero of heroes"`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>children</code>
    </td>

    <td>

      The immediate `DebugElement` children. Walk the tree by descending through `children`.

      <div class="alert is-helpful">

      `DebugElement` also has `childNodes`, a list of `DebugNode` objects.
      `DebugElement` derives from `DebugNode` objects and there are often
      more nodes than elements. Testers can usually ignore plain nodes.

      </div>
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>parent</code>
    </td>
    <td>

      The `DebugElement` parent. Null if this is the root element.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>name</code>
    </td>

    <td>
    
      The element tag name, if it is an element.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>triggerEventHandler</code>
    </td>
    <td>

      Triggers the event by its name if there is a corresponding listener
      in the element's `listeners` collection.
      The second parameter is the _event object_ expected by the handler.
      See [above](#trigger-event-handler).

      If the event lacks a listener or there's some other problem,
      consider calling `nativeElement.dispatchEvent(eventObject)`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>listeners</code>
    </td>

    <td>

      The callbacks attached to the component's `@Output` properties and/or the element's event properties.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>providerTokens</code>
    </td>

    <td>

      This component's injector lookup tokens.
      Includes the component itself plus the tokens that the component lists in its `providers` metadata.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>source</code>
    </td>

    <td>

      Where to find this element in the source component template.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>references</code>
    </td>

    <td>

      Dictionary of objects associated with template local variables (e.g. `#foo`),
      keyed by the local variable name.

    </td>
  </tr>
</table>

{@a query-predicate}

The `DebugElement.query(predicate)` and `DebugElement.queryAll(predicate)` methods take a
predicate that filters the source element's subtree for matching `DebugElement`.

The predicate is any method that takes a `DebugElement` and returns a _truthy_ value.
The following example finds all `DebugElements` with a reference to a template local variable named "content":

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="custom-predicate" title="app/demo/demo.testbed.spec.ts" linenums="false"></code-example>

The Angular `By` class has three static methods for common predicates:

* `By.all` - return all elements.
* `By.css(selector)` - return elements with matching CSS selectors.
* `By.directive(directive)` - return elements that Angular matched to an instance of the directive class.

<code-example path="testing/src/app/hero/hero-list.component.spec.ts" region="by" title="app/hero/hero-list.component.spec.ts" linenums="false"></code-example>

<hr>

{@a faq}

## Frequently Asked Questions

{@a q-spec-file-location}

#### Why put spec file next to the file it tests?

It's a good idea to put unit test spec files in the same folder
as the application source code files that they test:

* Such tests are easy to find.
* You see at a glance if a part of your application lacks tests.
* Nearby tests can reveal how a part works in context.
* When you move the source (inevitable), you remember to move the test.
* When you rename the source file (inevitable), you remember to rename the test file.

<hr>

{@a q-specs-in-test-folder}

#### When would I put specs in a test folder?

Application integration specs can test the interactions of multiple parts
spread across folders and modules.
They don't really belong to any part in particular, so they don't have a
natural home next to any one file.

It's often better to create an appropriate folder for them in the `tests` directory.

Of course specs that test the test helpers belong in the `test` folder,
next to their corresponding helper files.

{@a q-e2e}
#### Why not rely on E2E tests of DOM integration?

The component DOM tests described in this guide often require extensive setup and 
advanced techniques whereas the [unit tests](#component-class-testing)
are comparatively simple.

#### Why not defer DOM integration tests to end-to-end (E2E) testing?

E2E tests are great for high-level validation of the entire system.
But they can't give you the comprehensive test coverage that you'd expect from unit tests.

E2E tests are difficult to write and perform poorly compared to unit tests.
They break easily, often due to changes or misbehavior far removed from the site of breakage.

E2E tests can't easily reveal how your components behave when things go wrong,
such as missing or bad data, lost connectivity, and remote service failures.

E2E tests for apps that update a database, 
send an invoice, or charge a credit card require special tricks and back-doors to prevent
accidental corruption of remote resources.
It can even be hard to navigate to the component you want to test.

Because of these many obstacles, you should test DOM interaction
with unit testing techniques as much as possible.
