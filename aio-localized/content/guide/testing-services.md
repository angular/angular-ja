# Testing services


To check that your services are working as you intend, you can write tests specifically for them.

<div class="alert is-helpful">

  If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

</div>


サービスはユニットテストをするファイルとしてはもっとも簡単なことが多いです。
次では、`ValueService`のいくつかの同期、非同期ユニットテストを
Angularのテスティングユーティリティの補助なしで書いています。

<code-example path="testing/src/app/demo/demo.spec.ts" region="ValueService" header="app/demo/demo.spec.ts"></code-example>

{@a services-with-dependencies}

#### 依存関係をもつサービス

サービスはAngularがコンストラクターに注入する他のサービスに依存するということがよくあります。
多くの場合、サービスのコンストラクター呼び出しのときに手動でそれらの依存関係を作成、
_注入_することは簡単なことです。

`MasterService`は簡単な例です:

<code-example path="testing/src/app/demo/demo.ts" region="MasterService" header="app/demo/demo.ts"></code-example>

`MasterService`は注入した`ValueService`の`getValue`メソッドを委譲するだけです。

次では、これをテストするいくつかの方法を紹介します。

<code-example path="testing/src/app/demo/demo.spec.ts" region="MasterService" header="app/demo/demo.spec.ts"></code-example>

最初のテストでは`new`を使用して`ValueService`を作成して、それを`MasterService`コンストラクターに渡しています。

しかし、ほとんどの依存するサービスは作成してコントロールすることが難しいのと同様に、実際のサービスを注入することはほとんど機能しません。

かわりに、
依存性をモックしたり、ダミーの値を使用したり、
適切なサービスのメソッドの[スパイ](https://jasmine.github.io/tutorials/your_first_suite#section-Spies)を作成することができます。

<div class="alert is-helpful">

スパイは通常、サービスをモックするのにもっとも簡単な方法であるため好まれます。

</div>

これらの標準的なテストテクニックはサービスのユニットテストを隔離して行うための素晴らしい方法です。

しかし、Angularの依存性の注入を使用してアプリケーションクラスにサービスを注入している場合は、
ほとんどこのパターンを使用して反映したテストが必要になります。
Angularのテスティングユーティリティを使用することで注入されたサービスの動作を簡単に調査することができます。

#### _TestBed_を使用してサービスのテストをする

あなたのアプリケーションはサービスを作成するためにAngularの[依存性の注入(DI)](guide/dependency-injection)
に頼っています。
あるサービスが依存するサービスをもつとき、DIはその依存するサービスを探すか作成します。
さらにその依存するサービス自身が依存性をもつ場合、DIは同じように探すか作成します。

サービスの_利用者_としては、これについて心配する必要はありません。
コンストラクターの引数の順序や、それらがどうやって作成されるのかを心配する必要はありません。

サービスの_テスター_としては、サービスの依存性の第一階層について少しだけ考える必要がありますが、
サービスの提供と作成に`TestBed`テスティングユーティリティを使用すれば、
AngularのDIにサービスの作成とコンストラクター引数の順序を決めさせることが_できます_。

{@a testbed}

#### Angular _TestBed_

`TestBed`はAngularのテスティングユーティリティでもっとも重要です。
`TestBed`はAngularの[@NgModule](guide/ngmodules)をエミュレートした、
動的に生成されたAngular_テスト_モジュールを作成します。

`TestBed.configureTestingModule()`メソッドは[@NgModule](guide/ngmodules)で渡すことができるプロパティとほぼ同じプロパティをもつメタデータオブジェクトを受け取ります。

サービスをテストするために、
テストやモックしたいサービスの配列を`providers`メタデータプロパティにセットします。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-before-each"
  header="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach)">
</code-example>

それからサービスのクラスを引数として`TestBed.inject()`を呼び出して、テスト内部でそれを注入してください。

<div class="alert is-helpful">

**Note:** We used to have `TestBed.get()` instead of `TestBed.inject()`.
The `get` method wasn't type safe, it always returned `any`, and this is error prone.
We decided to migrate to a new function instead of updating the existing one given
the large scale use that would have an immense amount of breaking changes.

</div>

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-inject-it"></code-example>

もしくは、セットアップ部分でサービスを注入したい場合は、`beforeEach()`内で行ってください。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-inject-before-each"></code-example>

依存関係をもつサービスのテストをするときは、`providers`配列内にモックを提供してください。

次の例では、モックはスパイオブジェクトです。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="master-service-before-each"></code-example>

このテストではさきほどと同様にスパイを使用します。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="master-service-it"></code-example>

{@a no-before-each}
#### _beforeEach()_を使用せずにテストする

各`it()`内のテストの前提条件をセットするために、このガイド内のほとんどのテストスイートでは`beforeEach()`を呼び出して、
クラスの作成とサービスの注入のために`TestBed`に頼っています。

他のテストの流派では`beforeEach()`を呼び出さず、さらに`TestBed`を使用するよりはむしろ明示的にクラスを作成することを好みます。

このスタイルで`MasterService`のテストを書き直す方法は次のようになります。

`beforeEach()`のかわりに_setup_関数内に再利用可能な準備するためのコードを置くところから始めてください。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-setup"
  header="app/demo/demo.spec.ts (setup)"></code-example>

`setup()`関数は`masterService`のような、
テストが参照する変数を含むオブジェクトリテラルを返します。
`describe()`の中身に_準グローバル_な変数
(たとえば、`let masterService: MasterService`)を定義していません。

それから、個々のテストの最初の行、
続く行でテスト対象の操作とエクスペクテーションのアサートをするステップの前に`setup()`を実行します。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-test"></code-example>

必要なセットアップ変数を抽出するために
どのように[_分割代入_](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
をテストで使用するかに注目してみてください。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-setup-call"></code-example>

多くの開発者にとって、このアプローチは伝統的な`beforeEach()`
スタイルよりも明快でより明確であると感じるでしょう。

このテストガイドでは伝統的なスタイルとデフォルトの
[CLI schematics](https://github.com/angular/angular-cli)
が生成した`beforeEech()`と`TestBed`を含むテストファイルにしたがいますが、
_この代替アプローチ_を自身のプロジェクト内で採用することは自由です。

#### HTTPサービスをテストする

リモートサーバーに対してHTTP呼び出しをするデータサービスは、通常、
XHR呼び出しのためのAngularの[`HttpClient`](guide/http)サービスを注入して委譲します。

依存関係をもつ任意のサービスをテストするために、注入された`HttpClient`のスパイを使用して
データサービスのテストができます。
<code-example
  path="testing/src/app/model/hero.service.spec.ts"
  region="test-with-spies"
  header="app/model/hero.service.spec.ts (tests with spies)"></code-example>

<div class="alert is-important">

`HeroService`メソッドは`Observable`を返します。
あなたは(a)それを実行させるためと、(b)成功、失敗するメソッドをアサートするために、
Observableを_サブスクライブ_する必要があります。

`subscribe()`メソッドは成功(`next`)と失敗(`error`)のコールバックを受け取ります。
エラーをキャプチャーするために_両方の_コールバックを提供していることを確認してください。
これを怠ると、テストランナーはまったく別のテストが原因かもしれない、
非同期で補足不可能なエラーを生成するでしょう。

</div>

#### _HttpClientTestingModule_

データサービスと`HttpClient`間の拡張相互作用は、
スパイを使用してモックするには複雑で難しい場合があります。

`HttpClientTestingModule`はそれらのテストシナリオをさらに管理しやすくします。

このガイドに付属する_コードサンプル_では`HttpClientTestingModule`のデモをしますが、
このページでは`HttpClientTestingModule`を使用したテストの詳細をカバーをしている
[Httpガイド](guide/http#testing-http-requests)に先送りします。
