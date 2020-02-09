{@a top}
# テスト

このガイドでは、Angularアプリケーションでのユニットテスト、インテグレーションテストのヒントとテクニックについて説明します。

このガイドでは、[_ツアー・オブ・ヒーロー_チュートリアル](tutorial)によく似たサンプルの[Angular CLI](cli)で作られたアプリケーションのテストを紹介します。
このガイド内のサンプルアプリケーションとすべてのテストは検証と実験に使用できます:

- <live-example embedded-style>サンプルアプリケーション</live-example>
- <live-example stackblitz="specs">テスト</live-example>

<hr>

## セットアップ

Angular CLIは[Jasmineテストフレームワーク](https://jasmine.github.io/) を使用してAngularアプリケーションのテストを行うために必要なものすべてをダウンロードしてインストールします。

CLIで作成したプロジェクトは、すぐにテストする準備ができています。
[`ng test`](cli/test)CLIコマンドを実行するだけです:

<code-example language="sh" class="code-shell">
  ng test
</code-example>

`ng test`コマンドはアプリケーションを_ウォッチモード_でビルドし、
[Karmaテストランナー](https://karma-runner.github.io)を起動します。

コンソールのアウトプットは次のようになります:

<code-example language="sh" class="code-shell">
10% building modules 1/1 modules 0 active
...INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
...INFO [launcher]: Launching browser Chrome ...
...INFO [launcher]: Starting browser Chrome
...INFO [Chrome ...]: Connected on socket ...
Chrome ...: Executed 3 of 3 SUCCESS (0.135 secs / 0.205 secs)
</code-example>

ログの最後の行がもっとも重要です。
これはKarmaが3つのテストを走らせてすべてパスしたことを示します。

Chromeブラウザも開きます。そして"Jasmine HTML Reporter"内に次のようにテストのアウトプットを表示します。

<div class="lightbox">
  <img src='generated/images/guide/testing/initial-jasmine-html-reporter.png' alt="Jasmine HTML Reporter in the browser">
</div>

ほとんどの人にとって、このブラウザのアウトプットのほうがコンソールのログよりも読みやすいでしょう。
テスト行をクリックしてそのテストだけを再実行したり、説明をクリックして選択したテストグループ("test suite")を再実行することができます。

同時に、`ng test`コマンドは変更を監視しています。

このアクションを確認するために`app.component.ts`に小さな変更を加えて保存してみましょう。
テストが再び実行され、ブラウザが更新されます。そして新しいテストの結果が表示されます。

#### 設定

CLIはJasmineとKarmaの設定を引き受けてくれます。

`src/`フォルダ内の`karma.conf.js`と`test.ts`ファイルを編集することで
多くのオプションの微調整ができます。

`karma.conf.js`は部分的なKarma設定ファイルです。
CLIは`angular.json`内で指定されたアプリケーション構造をベースとして、`karma.conf.js`で補完をして、メモリ内にすべてのランタイムの設定を構築します。

JasmineとKarmaの設定の詳細についてはWebで検索してください。

#### 他のテストフレームワーク

他のテスティングライブラリとテストランナーでAngularアプリケーションのユニットテストを行うこともできます。
各ライブラリとランナーはそれぞれ独自のインストール手順、設定、および構文を持ちます。

詳細についてはWebで検索してください。

#### テストファイルの名前と場所

`src/app`フォルダ内部をみてください。

CLIは`AppComponent`のテストとして`app.component.spec.ts`という名前のテストファイルを生成しました。

<div class="alert is-important">

ツールがテストに使用するファイル(または、_スペック_ファイル)だと識別できるように、テストファイルの拡張子は**`.spec.ts`でないといけません**。

</div>

`app.component.ts`と`app.component.spec.ts`ファイルは同じフォルダ内に置きます。
ルートのファイル名(`app.component`の部分)は双方のファイルで同じにします。

あなた自身のプロジェクトの_すべての種類_のテストファイルにおいてこれら2つの慣習を採用してください。

{@a ci}

## 継続的インテグレーションのセットアップ

プロジェクトのバグをなくす最善の方法の1つはテストスイートを通すことですが、いつもテストを実行するというのは簡単に忘れます。
継続的インテグレーション(CI)サーバーを使用すると、プロジェクトのリポジトリーでコミットおよびプルリクエストをするたびにテストを実行できるように設定できます。

Circle CIやTravis CIのような有料のCIサービスを使用したり、Jenkinsなどを使って無料でホストすることもできます。
Circle CIやTravis CIは有料のサービスですが、オープンソースプロジェクトには無料で提供されています。
GitHubでパブリックなプロジェクトを作成し、無料でこれらのサービスを追加することができます。
Angularのレポジトリへの貢献度はCircle CIとTravis CIの一連のテストを通じて自動的に実行されます。

この記事では、Circle CIとTravis CIを実行するようにプロジェクトを設定する方法と、どちらの環境でもChromeブラウザでテストを実行できるようにテスト設定を更新する方法について説明します。


### Circle CIでプロジェクトを設定する

ステップ 1: プロジェクト直下に`.circleci`というフォルダを作成します。

ステップ 2: その新しいファルダ内に次のような内容の`config.yml`というファイルを作成します:

```
version: 2
jobs:
  build:
    working_directory: ~/my-project
    docker:
      - image: circleci/node:8-browsers
    steps:
      - checkout
      - restore_cache:
          key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run: npm install
      - save_cache:
          key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
          paths:
            - "node_modules"
      - run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
      - run: npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
```

この設定は`node_modules/`をキャッシュして、CLIコマンドを実行するために[`npm run`](https://docs.npmjs.com/cli/run-script)を使用します(`@angular/cli`がグローバルにインストールされていないため)。
2重ダッシュ(`--`)は`npm`スクリプトに引数を渡すのに必要です。

ステップ 3: 変更をコミットし、リポジトリにプッシュします。

Step 4: [Circle CIにサインアップ](https://circleci.com/docs/2.0/first-steps/)して、[あなたのプロジェクトを追加](https://circleci.com/add-projects)します。
プロジェクトのビルドが開始するはずです。

* Circle CIの詳細については、[Circle CI documentation](https://circleci.com/docs/2.0/)を参照してください。

### Travis CIでプロジェクトを設定する

ステップ 1: プロジェクト直下に次のような内容の`.travis.yml`を作成します:

```
dist: trusty
sudo: false

language: node_js
node_js:
  - "10"

addons:
  apt:
    sources:
      - google-chrome
    packages:
      - google-chrome-stable

cache:
  directories:
     - ./node_modules

install:
  - npm install

script:
  - npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
  - npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
```

TravisではChromeが付属していないため、代わりにChromiumを使用していることを除いて、Circle CIの設定と同じものです。

ステップ 2: 変更をコミットし、リポジトリにプッシュします。

ステップ 3: [Travis CIにサインアップ](https://travis-ci.org/auth)して、[あなたのプロジェクトを追加](https://travis-ci.org/profile)します。
ビルドをトリガーするために新しいコミットをプッシュする必要があるでしょう。

* Travis CIでのテストの詳細については[Travis CI documentation](https://docs.travis-ci.com/)を参照してください。

### ChromeでのCIテスト用にCLIを設定する

一般的にCLIコマンドの`ng test`と`ng e2e`があなたの環境でCIテストを実行しているとき、Chromeブラウザでのテストを実行するために設定を調整する必要があります。

[Karma JavaScriptテストランナー](https://karma-runner.github.io/latest/config/configuration-file.html)
と[Protractor](https://www.protractortest.org/#/api-overview) E2Eテスティングツールの2つの設定ファイルについて、
サンドボックスを使用せずにChromeを起動するように調整する必要があります。

この例では[ヘッドレスChrome](https://developers.google.com/web/updates/2017/04/headless-chrome#cli) を使用します。

* Karma設定ファイル、`karma.conf.js`のbrowsersの下にChromeHeadlessCIというカスタムランチャーを追加します:
```
browsers: ['Chrome'],
customLaunchers: {
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
```

* オリジナルの`protractor.conf.js`を拡張した、`protractor-ci.conf.js`という新しいファイルをE2Eテストプロジェクトのフォルダ直下に作成します:
```
const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

exports.config = config;
```

これで、`--no-sandbox`フラグを使用するために次のコマンドを実行できます:

<code-example language="sh" class="code-shell">
  ng test --no-watch --no-progress --browsers=ChromeHeadlessCI
  ng e2e --protractor-config=e2e/protractor-ci.conf.js
</code-example>

<div class="alert is-helpful">

   **Note:** 現時点では、Windows上で実行する場合は`--disable-gpu`フラグを含める必要があるでしょう。[crbug.com/737678](https://crbug.com/737678)を参照してください。

</div>

{@a code-coverage}

## カバレッジレポートを有効にする

CLIでユニットテストを実行し、コードカバレッジレポートを作成することができます。
コードカバレッジレポートは、ユニットテストで正しくテストされていないコードベースの部分を表示します。

カバレッジレポートを生成するには、プロジェクト直下で次のコマンドを実行します。

<code-example language="sh" class="code-shell">
  ng test --no-watch --code-coverage
</code-example>

テストが完了すると、コマンドはプロジェクト内に新しく`/coverage`フォルダを作成します。ソースコードとコードカバレッジ値のレポートを見るためには`index.html`ファイルを開きます。

テストするたびにコードカバレッジレポートを作成したい場合は、CLIの設定ファイル、`angular.json`で次のようなオプションを設定します:

```
  "test": {
    "options": {
      "codeCoverage": true
    }
  }
```

### コードカバレッジの適用

コードカバレッジ率から、テストされたコードの量を見積もることができます。
あなたのチームがユニットテストされている最低限の量を決定する場合、Angular CLIを使用して、この最小値を適用することができます。

たとえば、コードベースに最低80％のコードカバレッジを設定するとします。
これを有効にするには、[Karma](https://karma-runner.github.io)テストプラットフォーム設定ファイル、`karma.conf.js`を開いて、`coverageIstanbulReporter:`に次のような内容を追加します。

```
coverageIstanbulReporter: {
  reports: [ 'html', 'lcovonly' ],
  fixWebpackSourcePaths: true,
  thresholds: {
    statements: 80,
    lines: 80,
    branches: 80,
    functions: 80
  }
}
```

`thresholds`プロパティは、ユニットテストがプロジェクトで実行されたときに、ツールが最低80％のコードカバレッジを強制するようにします。

## サービスのテスト

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
適切なサービスのメソッドの[スパイ](https://jasmine.github.io/2.0/introduction.html#section-Spies)を作成することができます。

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


## コンポーネントテストの基本

コンポーネントは、Angularアプリケーションの他のすべての部品とは違い、
HTMLテンプレートとTypeScriptクラスを組み合わせています。
コンポーネントは本当にテンプレートとクラスが_一緒に動作します_。
そして、適切にコンポーネントをテストするためには、
目的どおりにそれらを一緒に動作させるテストを行う必要があります。

このようなテストでは、
Angularが行っているようにブラウザのDOMにコンポーネントのホスト要素を作成し、
コンポーネントクラスとテンプレートとして定義されたDOMとのやりとりを調査する必要があります。

Angularの`TestBed`は次のセクションで見るような、この種類のテストを容易にします。
しかし、多くの場合、DOMの関与無しで_このクラスだけでテストすること_は
コンポーネントの動作をより簡単で明白な方法で検証できます。
{@a component-class-testing}
### コンポーネントクラスのテスト

サービスクラスをテストするのと同じように、コンポーネントクラス自身をテストします。

ユーザーがボタンをクリックしたときにライトをオン/オフ(オンスクリーンメッセージで表される)
の切り替えをする`LightswitchComponent`を考えてみましょう。

<code-example
  path="testing/src/app/demo/demo.ts"
  region="LightswitchComp"
  header="app/demo/demo.ts (LightswitchComp)"></code-example>

きっと、あなたは`click()`メソッドがライトの_オン/オフ_状態を切り替えて、
メッセージを適切にセットすることをテストしたいだけだと思います。

このコンポーネントクラスには依存関係はありません。
依存関係のないサービスをテストするには、`new`でサービスを作成し、
そのAPIを叩いて、公開されている状態のエクスペクテーションをアサートします。
コンポーネントクラスでも同じことをします。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="Lightswitch"
  header="app/demo/demo.spec.ts (Lightswitch tests)"></code-example>

次は、_ツアー・オブ・ヒーロー_チュートリアルの`DashboardHeroComponent`です。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="class"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

_hero_を`@Input`プロパティにバインドし、
_selected_ `@Output`プロパティを通して発生したイベントをリッスンする
親コンポーネントのテンプレート内に表示されます。

`DashboardHeroComponent`や、
その親コンポーネントを作成せずにクラスコードが動作することをテストできます。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="class-only"
  header="app/dashboard/dashboard-hero.component.spec.ts (class tests)"></code-example>

コンポーネントに依存関係がある場合、
`TestBed`を使用してコンポーネントとその依存関係の両方を作成することができます。

次の`WelcomeComponent`は、挨拶するユーザーの名前を知っている`UserService`に依存します。

<code-example
  path="testing/src/app/welcome/welcome.component.ts"
  region="class"
  header="app/welcome/welcome.component.ts"></code-example>

まずは、このコンポーネントの最小限のニーズを満たす`UserService`のモックを作成してください。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="mock-user-service"
  header="app/welcome/welcome.component.spec.ts (MockUserService)"></code-example>

次に、**コンポーネント**と_サービス_の_両方_を`TestBed`の設定に提供して注入します。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-before-each"
  header="app/welcome/welcome.component.spec.ts (class-only setup)"></code-example>

次に、コンポーネントクラスを実行します。Angularがアプリケーションの実行時に[ライフサイクルフックメソッド](guide/lifecycle-hooks)を呼び出すことを覚えておいてください。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-tests"
  header="app/welcome/welcome.component.spec.ts (class-only tests)"></code-example>

### コンポーネントのDOMのテスト

コンポーネント_クラス_のテストは、サービスをテストするのと同じくらい簡単です。

しかし、コンポーネントはクラスだけではありません。
コンポーネントは、DOMや他のコンポーネントとやりとりします。
_クラスのみ_のテストは、クラスの動作については教えてくれます。
コンポーネントが適切にレンダリングされて、ユーザーの入力やジェスチャーに応答したり、
親コンポーネントや子コンポーネントと統合されているかどうかは確認できません。

上記の_クラスのみ_のテストでは、
コンポーネントが実際に画面上でどのように動作するかについて重要な質問に答えることはできません。

- `Lightswitch.clicked()`はユーザーが呼び出せるようなものにバインドされているのか？
- `Lightswitch.message`は表示されているのか？
- ユーザーは実際に`DashboardHeroComponent`で表示されるヒーローを選択できるのか？
- 主人公の名前は、期待された形式(つまり、大文字)で表示されるのか？
- ウェルカムメッセージは`WelcomeComponent`のテンプレートで表示されるのか？

これは、上のような単純なコンポーネントだと問題ではないかもしれません。
しかし、多くのコンポーネントは、
テンプレートに記述されているDOM要素と複雑なやりとりをしているため、
コンポーネントの状態が変わることでHTMLが表示されたり消えたりします。

この種類の質問に答えるには、
コンポーネントに関連付けられたDOM要素を作成する必要があります。
コンポーネントの状態が適切なタイミングで適切に表示されることを確認するためにDOMを検査し、
画面上でのユーザーインタラクションによって、
コンポーネントが期待どおりに動作することをシミュレートする必要があります。

この種類のテストを書くために、
`TestBed`のその他の機能と他のテストヘルパーを使用します。

#### CLIが生成したテスト

CLIが新しいコンポーネントを生成すると、
デフォルトで初期テストファイルを作成します。

たとえば、次のCLIコマンドは、`app/banner`フォルダに`BannerComponent`を生成します(インラインのテンプレートとスタイルを含む):

<code-example language="sh" class="code-shell">
ng generate component banner --inline-template --inline-style --module app
</code-example>

また、コンポーネントのテストファイル、`banner-external.component.spec.ts`の初期テストファイルを生成します。それはこのようになります:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v1"
  header="app/banner/banner-external.component.spec.ts (initial)"></code-example>

<div class="alert is-helpful">

Because `compileComponents` is asynchronous, it uses
the [`async`](api/core/testing/async) utility
function imported from `@angular/core/testing`.

Please refer to the [async](#async) section for more details.

</div>

#### セットアップを減らす

このファイルの最後の3行だけが実際にコンポーネントをテストしている部分で、
そこでしていることは、Angularがコンポーネントを作成できることのアサートです。

ファイルの残りの部分は、より高度なテストを見込んだ定型的なセットアップコードで、構成要素が相当なものに発展した場合に必要と_なるでしょう_。

以下では、これらの高度なテスト機能について学びます。
現時点では、より管理しやすいサイズにするために、このテストファイルを大幅に減らすことができます:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v2"
  header="app/banner/banner-initial.component.spec.ts (minimal)"></code-example>

この例では、`TestBed.configureTestingModule`に渡されたメタデータオブジェクトは、
単にテストするコンポーネントである`BannerComponent`を宣言します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="configureTestingModule"></code-example>

<div class="alert is-helpful">

他の何かを宣言したりインポートする必要はありません。
デフォルトのテストモジュールは、
`@angular/platform-browser`の`BrowserModule`のようなものがあらかじめ設定されています。

後でテストのニーズにあわせて、
インポート、プロバイダー、宣言の一式で`TestBed.configureTestingModule()`を呼び出します。
オプショナルな`override`メソッドを使用して、構成をさらに細かく調整できます。

</div>

{@a create-component}

#### _createComponent()_

`TestBed`を構成したら`createComponent()`メソッドを呼び出します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="createComponent"></code-example>

`TestBed.createComponent()`は、
`BannerComponent`のインスタンスを作成し、
対応する要素をテストランナーのDOMに追加し、[`ComponentFixture`](#component-fixture)を返します。

<div class="alert is-important">

`createComponent`の呼び出し後に`TestBed`を再構成しないでください。

`createComponent`メソッドは現在の`TestBed`の定義をフリーズし、
さらなる設定をできないようにします。

どの`TestBed`を構成するメソッド(`configureTestingModule()`、`get()`、`override...`メソッド)
も呼び出すことはできません。
試してみると、`TestBed`はエラーをスローします。

</div>

{@a component-fixture}

#### _ComponentFixture_

[ComponentFixture](api/core/testing/ComponentFixture)は、作成されたコンポーネントとそれが対応する要素とやりとりするためのテストハーネスです。

フィクスチャーを通してコンポーネントインスタンスにアクセスし、Jasmineのエクスペクテーションを使用して存在を確認してください:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="componentInstance"></code-example>

#### _beforeEach()_

このコンポーネントが発展するにつれて、より多くのテストを追加することになるでしょう。
個々のテストで`TestBed`の構成を複製するのではなく、
セットアップをJasmineの`beforeEach()`といくつかのサポート変数に引き出すようにリファクタリングしましょう。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v3"
 ></code-example>

次に、`fixture.nativeElement`からコンポーネントの要素を取得し、
期待されるテキストを探すテストを追加します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-2"></code-example>

{@a native-element}

#### _nativeElement_

`ComponentFixture.nativeElement`の値は、`any`型です。
のちに`DebugElement.nativeElement`もでてきますが、それも`any`型です。

Angularは、コンパイル時に`nativeElement`のHTML要素の種類やHTML要素であるかどうかを知ることはできません。
アプリケーションは、
サーバーや[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)などの_非ブラウザプラットフォーム_で実行されている可能性があります。
このようなプラットフォームでは、要素のAPIが少なくなっているか、
まったく存在していない可能性があります。

このガイド内のテストはブラウザで実行するように設計されているため、
`nativeElement`の値は常に`HTMLElement`、
またはその派生クラスの1つになります。

それが何らかの`HTMLElement`であることがわかっている場合は、
要素のツリーに深く飛び込むために標準のHTMLの`querySelector`を使用できます。

次は、パラグラフ要素を取得してバナーテキストを探すために`HTMLElement.querySelector`を呼び出すもうひとつのテストです:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-3"></code-example>

{@a debug-element}

#### _DebugElement_

Angularの_fixture_は`fixture.nativeElement`を通して直接コンポーネントの要素を提供します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="nativeElement"></code-example>

次は、`fixture.debugElement.nativeElement`として実装された、実際に便利なメソッドです。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="debugElement-nativeElement"></code-example>

要素へのこの遠回りには正当な理由があります。

`nativeElement`のプロパティは、ランタイム環境に依存します。
これらのテストは、DOMを持たない、またはDOMエミュレーションが`HTMLElement`
API全体をサポートしていない_ブラウザ以外のプラットフォーム_で実行することができます。

Angularは、サポートされているすべてのプラットフォームで安全に動作するよう、`DebugElement`の抽象化に頼ります。
Angularは、HTML要素のツリーを作成する代わりに、ランタイムのプラットフォームの_ネイティブ要素_をラップする`DebugElement`ツリーを作成します。
`nativeElement`プロパティは`DebugElement`をアンラップし、プラットフォーム固有の要素オブジェクトを返します。

このガイドのサンプルテストはブラウザでのみ実行されるように設計されているため、
テスト内の`nativeElement`は、
常にテスト内で探索できる使い慣れたメソッドとプロパティをもつ`HTMLElement`です。

次は、さきほどのテストを`fixture.debugElement.nativeElement`で再実装したものです:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-4"></code-example>

`DebugElement`には、このガイドの他の部分で説明するように、
テストに役立つ他のメソッドとプロパティがあります。

Angularコアライブラリから`DebugElement`シンボルをインポートします。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-debug-element"></code-example>

{@a by-css}
#### _By.css()_

このガイド内のテストはすべてブラウザ上で実行されますが、一部のアプリケーションは、
少なくとも、別のプラットフォームで動作することがあります。

たとえば、接続の悪いデバイスでアプリケーションをより早く起動させる戦略の一環として、コンポーネントをサーバー上で最初にレンダリングすることがあります。
サーバー側のレンダラーは、完全なHTML要素のAPIをサポートしていない可能性があります。`querySelector`をサポートしていない場合、前のテストは失敗する可能性があります。

`DebugElement`は、サポートされているすべてのプラットフォームで動作するクエリメソッドを提供します。
これらのクエリメソッドは、`DebugElement`ツリーのノードが選択基準にマッチすると`true`を返す_述語_関数を使用します。

ランタイムのプラットフォームのライブラリからインポートされた`By`クラスの助けを借りて_述語_を作成します。
次は、ブラウザプラットフォームのための`By`をインポートしています:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-by"></code-example>

次の例では`DebugElement.query()`とブラウザの`By.css`メソッドを使用して、
さきほどのテストを再実装しています。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-5"></code-example>

いくつか注目すべきことがあります:

- `By.css()`静的メソッドは[標準のCSSセレクター](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors "CSS selectors")を使用して
  `DebugElement`ノードを選択します。
- クエリはパラグラフの`DebugElement`を返します。
- パラグラフ要素を取得するためにはその結果をアンラップする必要があります。

CSSセレクターでフィルタリングし、ブラウザの_ネイティブ要素_のプロパティのみをテストする場合、`By.css`でのアプローチは過度のものになるかもしれません。

次の一連のテストで示すように、
`querySelector()`や`querySelectorAll()`などの標準的な`HTMLElement`メソッドを使用してフィルタ処理する方が簡単で、
より明確になることがよくあります。

<hr>

## コンポーネントのテストシナリオ

このガイドのほとんどを構成する次のセクションでは、
一般的なコンポーネントのテストシナリオについて探検します。

### コンポーネントバインディング

現在の`BannerComponent`は、静的なタイトルテキストをHTMLテンプレートに表示します。

少しの変更を加えた後、
次のようなコンポーネントの`title`プロパティにバインドすることによって、`BannerComponent`は動的なタイトルを表示します。

<code-example
  path="testing/src/app/banner/banner.component.ts"
  region="component"
  header="app/banner/banner.component.ts"></code-example>

これは簡単なので、
コンポーネントが実際に正しいと思われる場所にコンテンツが表示されることを確認するためにテストを追加します。

#### _&lt;h1&gt;_のクエリ

_title_プロパティのインターポレーションバインディングをラップする`<h1>`
要素の値を検証する一連のテストを書きます。

標準HTMLの`querySelector`を使用して要素を検索し、
それを`h1`という変数に割り当てるために`beforeEach`を更新します。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="setup"
  header="app/banner/banner.component.spec.ts (setup)"></code-example>

{@a detect-changes}

#### _createComponent()_はデータをバインドしない

最初のテストでは、画面にデフォルトの`title`が表示されていることを確認したいと思います。
あなたの直感は、次のような、`<h1>`を直ちに検証するテストを書くことでしょう。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default-v1"></code-example>

メッセージとともに_このテストは失敗します_:

```javascript
expected '' to contain 'Test Tour of Heroes'.
```

Angularが**変更検知**を実行したときにバインディングが発生します。

プロダクションでは、Angularがコンポーネントを作成するか、
ユーザーがキーストロークを入力するか、非同期アクティビティ(AJAXなど)が完了したときに
変更検知が自動的に起動します。

`TestBed.createComponent`は変更検知をトリガー_しません_。
この事実は改定したテストで確認されます:

<code-example
  path="testing/src/app/banner/banner.component.spec.ts" region="test-w-o-detect-changes"></code-example>

#### _detectChanges()_

あなたは`fixture.detectChanges()`を呼び出すことで、データバインディングを実行するように`TestBed`に指示する必要があります。
そうするだけで、`<h1>`は期待されたタイトルをもつようになります。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default"></code-example>

遅延した変化検知は意図的かつ便利です。
_Angularがデータバインディングを開始して[ライフサイクルフック](guide/lifecycle-hooks)を呼び出す前に_、
コンポーネントの状態を検証して変更する機会をテスターに与えます。

次は、`fixture.detectChanges()`を呼び出す_前_にコンポーネントの`title`プロパティを変更するもうひとつのテストです。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="after-change"></code-example>

{@a automatic-change-detection}

#### 自動変更検知

`BannerComponent`は、頻繁に`detectChanges`を呼び出します。
テスターの中には、Angularテスト環境が自動的に変更検知を実行することを好む人もいます。

これは`ComponentFixtureAutoDetect`プロバイダーで`TestBed`を構成することで可能です。
まず、テスティングユーティリティライブラリからインポートします:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect" header="app/banner/banner.component.detect-changes.spec.ts (import)"></code-example>

それから、それをテストモジュール構成の`providers`配列に追加します:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)"></code-example>

次は、自動変更検知がどのように機能するかを示す3つのテストです。

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect-tests" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)"></code-example>

最初のテストでは、自動変更検知の利点が示されています。

2回目と3回目のテストで重要な制限が明らかになりました。
Angularのテスト環境では、テストがコンポーネントのタイトルを変更したことが_わかりません_。
`ComponentFixtureAutoDetect`サービスは、Promiseの解決、タイマー、DOMイベントなどの非同期アクティビティに応答します。
ただし、コンポーネントプロパティの直接で同期的な更新は不可視です。
テストは変更検知の別のサイクルをトリガーするために`fixture.detectChanges()`を手動で呼び出す必要があります。

<div class="alert is-helpful">

テストフィクスチャーが変更検知を実行するかどうかに思いを巡らせるのではなく、
このガイドのサンプルは_常に_`detectChanges()`を_明示的_に呼び出します。
`detectChanges()`を厳密に必要な数以上に頻繁に呼び出しても問題はありません。

</div>

<hr>

{@a dispatch-event}

#### _dispatchEvent()_を使用してinputの値を変更する

ユーザーインプットをシミュレートするために、input要素を探して`value`プロパティをセットします。

Angularの変更検知をトリガーするために`fixture.detectChanges()`を呼び出しましょう。
しかし、本質的で中間的なステップがあります。

Angularは、input要素の`value`プロパティがセットされたことを認識していません。
`dispatchEvent()`を呼び出して要素の`input`イベントを発生させるまで、
そのプロパティは読み取られません。_そのあとに_ `detectChanges()`を呼び出します。

次の例では、正しい手順を示しています。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

### 外部ファイルを使用したコンポーネント

さきほどの`BannerComponent`は、`@Component.template`プロパティと`@Component.styles`プロパティのそれぞれで指定された_インラインテンプレート_と_インラインCSS_で定義されています。

多くのコンポーネントは、次のように変更した`BannerComponent`がするように、
`@Component.templateUrl`プロパティと`@Component.styleUrls`プロパティでそれぞれ_外部テンプレート_と
_外部CSS_を指定します。

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  region="metadata"
  header="app/banner/banner-external.component.ts (metadata)"></code-example>

この構文は、コンポーネントコンパイル時に外部ファイルを読み込むようにAngularコンパイラに指示します。

CLIで `ng test`コマンドを実行するときは、
_テストを実行する前にアプリケーションをコンパイルするので_問題になりません。

ただし、**非CLI環境**でテストを実行すると、このコンポーネントのテストは失敗するでしょう。
たとえば、[plunker](https://plnkr.co/)などのWebコーディング環境で`BannerComponent`テストを実行すると、
次のようなメッセージが表示されます:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

_テスト中に_ランタイム環境がソースコードをコンパイルすると、
このテストエラーメッセージが表示されます。

問題を解決するには、[以下](#compile-components)で説明するように`compileComponents()`を呼び出します。

{@a component-with-dependency}

### 依存関係のあるコンポーネント

コンポーネントの多くはサービスの依存関係を持ちます。

`WelcomeComponent`は、ログインしたユーザーへのウェルカムメッセージを表示します。
それは注入した`UserService`のプロパティからユーザーが誰かを知ります:

<code-example path="testing/src/app/welcome/welcome.component.ts" header="app/welcome/welcome.component.ts"></code-example>

`WelcomeComponent`には、サービスとやりとりするロジックと、このコンポーネントの値のテストをするロジックの決定権があります。
次は、スペックファイル`app/welcome/welcome.component.spec.ts`のテスティングモジュールの構成です:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="config-test-module" header="app/welcome/welcome.component.spec.ts"></code-example>

今回は、_テスト中のコンポーネント_を宣言することに加えて、
`providers`配列に`UserService`プロバイダーを追加します。
しかし、実際の`UserService`ではありません。

{@a service-test-doubles}

#### テストダブルのサービスを提供する

_テスト中のコンポーネント_に実際のサービスを注入する必要はありません。
事実、通常はテストダブル(スタブ、フェイク、スパイ、またはモック)であればよりよいです。
スペックの目的は、サービスではなくコンポーネントをテストすることであり、
実際のサービスだと問題になる可能性があります。

実際の`UserService`を注入することは悪夢になる可能性があります。
実際のサービスは、ユーザーにログイン資格情報を要求し、
認証サーバーに到達しようとします。
このような動作は補足するのが難しい場合があります。
実際の`UserService`の代わりにテストダブルを作成して登録する方がはるかに簡単で安全です。

この特定のテストスイートは、
`WelcomeComponent`とそのテストのニーズを満たす`UserService`の最小のモックを提供します:

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="user-service-stub"
  header="app/welcome/welcome.component.spec.ts"></code-example>

{@a get-injected-services}

#### 注入したサービスを取得する

テストでは、`WelcomeComponent`に注入された`UserService`(スタブ)へのアクセスが必要です。

Angularは階層的な注入システムを持ちます。
`TestBed`によって作成されたルートインジェクターからコンポーネントツリーまで、
複数のレベルのインジェクターがあります。

注入されたサービスを取得するもっとも安全な、
**常に動作する**方法は、**テスト中のコンポーネントのインジェクターから取得することです**。
コンポーネントインジェクターは、フィクスチャーの`DebugElement`のプロパティです。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="injected-service"
  header="WelcomeComponent's injector"></code-example>

{@a testbed-inject}

#### _TestBed.inject()_

`TestBed.inject()`経由でルートインジェクターからサービスを取得することも_できます_。
これは覚えやすく、あまり冗長ではありません。
しかし、Angularがコンポーネントとサービスのインスタンスをテストのルートインジェクターに注入する場合にのみ機能します。

このテストスイートでは、`UserService`の_唯一_のプロバイダーはルートテスティングモジュールなので、
`TestBed.inject()`を次のように呼び出すことは安全です:

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="inject-from-testbed"
  header="TestBed injector"></code-example>

<div class="alert is-helpful">

`TestBed.inject()`が機能しないユースケースについては、
いつ、そしてなぜかわりにコンポーネントのインジェクターからサービスを取得しなくてはいけないのかを説明する
[_コンポーネントのプロバイダーを上書きする_](#component-override)セクションを参照してください。

</div>

{@a service-from-injector}

#### 常にインジェクターからサービスを取得してください

テスト本体にあるテストモジュールに提供されている`userServiceStub`
オブジェクトを参照_しないでください_。
**それは動作しません！**
コンポーネントに注入された`userService`インスタンスは、完全に_異なる_オブジェクトであり、
提供された`userServiceStub`のクローンです。

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="stub-not-injected" header="app/welcome/welcome.component.spec.ts"></code-example>

{@a welcome-spec-setup}

#### 最後のステップとテスト

次では、`TestBed.inject()`を使用して`beforeEach()`を完了しています:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="setup" header="app/welcome/welcome.component.spec.ts"></code-example>

そして何個かのテストを書きます:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="tests" header="app/welcome/welcome.component.spec.ts"></code-example>

最初のものはサニティーテストです。これはスタブされた`UserService`が呼び出され、動作していることを確認します。

<div class="alert is-helpful">

Jasmineのマッチャーの第2引数(たとえば、 `'expected name'`)は、オプショナルの失敗ラベルです。
エクスペクテーションが失敗した場合、Jasmineはこのラベルをエクスペクテーション失敗メッセージに追加します。
複数のエクスペクテーションをもつスペックでは、何が間違っていて、どのエクスペクテーションが失敗したかを明確にするのに役立ちます。

</div>

残りのテストは、サービスが異なる値を返すときのコンポーネントのロジックを確認します。
2番目のテストでは、ユーザー名の変更の影響を検証します。
3番目のテストでは、ログインしているユーザーがいない場合、コンポーネントが適切なメッセージを表示していることを確認します。

<hr>

{@a component-with-async-service}

### 非同期サービスを使用するコンポーネント

このサンプルでは、`AboutComponent`テンプレートは`TwainComponent`をホストします。
`TwainComponent`はMark Twainの引用を表示します。

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="template"
  header="app/twain/twain.component.ts (template)"></code-example>

コンポーネントの`quote`プロパティの値は、`AsyncPipe`を経由することに注意してください。
つまり、プロパティは`Promise`または`Observable`のいずれかを返します。

この例では、`TwainComponent.getQuote()`メソッドは、
`quote`プロパティが`Observable`を返すことを示しています。

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="get-quote"
  header="app/twain/twain.component.ts (getQuote)"></code-example>

`TwainComponent`は、注入された`TwainService`から引用を取得します。
コンポーネントは、サービスが最初の引用を返せるようになる前にプレースホルダー値(`'...'`)
を設定した`Observable`を返し始めます。

`catchError`はサービスのエラーを補足し、
エラーメッセージを作成し、成功チャネルのプレースホルダー値を返します。
同じ変更検知サイクルでそのメッセージが2回更新されるのを避けるために、
時間の経過を待って`errorMessage`を設定する必要があります。

これらがテストするための機能のすべてです。

#### スパイを使用したテスト

コンポーネントをテストするときは、サービスの公開APIだけが重要です。
一般に、テスト自体はリモートサーバー呼び出しをすべきではありません。
そのような呼び出しはエミュレートする必要があります。次の`app/twain/twain.component.spec.ts`のセットアップは、これを行うための1つの方法を示しています:

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="setup"
  header="app/twain/twain.component.spec.ts (setup)"></code-example>

{@a service-spy}

スパイに注目してください。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy"></code-example>

スパイは、`getQuote`への任意の呼び出しがテストの引用のObservableを受け取るように設計されています。
実際の`getQuote()`メソッドとは異なり、このスパイはサーバーをバイパスし、
その値がすぐに利用できる同期的なObservableを返します。

`Observable`が同期的であっても、このスパイで多くの有用なテストを書くことができます。

{@a sync-tests}

#### 同期的テスト

同期的な`Observable`の主な利点は、
非同期プロセスを同期的テストにすることができる点です。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="sync-test"></code-example>

スパイの結果が同期的に返されるため、
`getQuote()`メソッドは、
Angularが`ngOnInit`を呼び出す最初の変更検知サイクルの_直後_に画面上のメッセージを更新します。

エラーパスをテストするとき、あなたはラッキーではないかもしれません。
サービスのスパイはエラーを同期的に返しますが、
コンポーネントメソッドは`setTimeout()`を呼び出します。
このテストは、JavaScriptエンジンが少なくとも1回動作しきるのを待ってから値を取得できるようにする必要があります。
テストは_非同期_に行う必要があります。

{@a fake-async}
{@a async-test-with-fakeasync}

#### _fakeAsync()_を使用した非同期テスト

`fakeAsync()`機能を使うためには、 `zone.js/dist/zone-testing`をテストセットアップファイルでインポートする必要があります。
Angular CLIで作成されたプロジェクトであれば、 `zone-testing` はすでに `src/test.ts` でインポートされています。

次のテストは、サービスが`ErrorObservable`を返すときに期待される動作を確認します。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="error-test"></code-example>

`it()`関数が次の形式の引数を受け取ることに注目してください。

```javascript
fakeAsync(() => { /* test body */ })`
```

`fakeAsync`関数は、特別な_fakeAsyncテストゾーン_でテスト本体を実行することによって、線形的なコーディングスタイルを可能にします。
テスト本体は同期的に見えます。
`Promise.then()`のようなネストされた構文はなく、制御の流れを混乱させることはありません。

<div class="alert is-helpful">

Limitation: The `fakeAsync()` function won't work if the test body makes an `XMLHttpRequest` (XHR) call.
XHR calls within a test are rare, but if you need to call XHR, see [`async()`](#async), below.

</div>

{@a tick}

#### _tick()_関数

(仮想)クロックを進めるには、[tick()](api/core/testing/tick) を呼び出さなければなりません。

[tick()](api/core/testing/tick) を呼び出すことでペンディング中のすべての非同期アクティビティが終了するまでの時間の経過をシミュレートします。
このケースでは、エラーハンドラー内の`setTimeout()`を待機します。

[tick()](api/core/testing/tick) 関数はパラメーターとしてミリ秒を受け取ります（指定されていない場合はデフォルトで0になります）。このパラメーターは、仮想クロックの進捗状況を表します。たとえば、 `fakeAsync()` テスト中に `setTimeout(fn, 100)` がある場合は、 tick(100) を使用してfnコールバックをトリガーする必要があります。

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick"></code-example>

[tick()](api/core/testing/tick) 関数は、`TestBed`と一緒にインポートするAngularテスティングユーティリティの1つです。
これは`fakeAsync()`と対になっており、`fakeAsync()`の内部でのみ呼び出すことができます。

#### fakeAsync() 内部での日時の比較

`fakeAsync()` は、 `fakeAsync()`の中の日付の差を計算できるようにするため、時間の流れをシミュレートします。

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-date"></code-example>

#### jasmine.clock と fakeAsync()

Jasmineも日付をシミュレートするための `clock` 機能を提供しています。`jasmine.clock().install()` が呼び出されてから`jasmine.clock().uninstall()`が呼び出されるまで、Angularは自動的に`fakeAsync()` の中でテストを実行します。
`fakeAsync()`は必要なく、ネストされていればエラーを投げます。

デフォルトではこの機能は無効化されています。有効にするには、 `zone-testing` をインポートするまえにグローバルフラグをセットしてください。

Angular CLIを使う場合は、 `src/test.ts` の中でこのフラグを設定してください。

```
(window as any)['__zone_symbol__fakeAsyncPatchLock'] = true;
import 'zone.js/dist/zone-testing';
```

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-clock"></code-example>

#### fakeAsync() の中でのRxJSスケジューラーの使用

`setTimeout()` や `setInterval()` を使うのと同じように `fakeAsync()` の中でRxJSスケジューラを使うこともできますが、RxJSスケジューラにパッチを当てるには `zone.js/dist/zone-patch-rxjs-fake-async` をインポートする必要があります。
<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-rxjs"></code-example>

#### より多くのmacroTasksをサポートする

デフォルトでは`fakeAsync()`は次の`macroTask`をサポートします。

- setTimeout
- setInterval
- requestAnimationFrame
- webkitRequestAnimationFrame
- mozRequestAnimationFrame

`HTMLCanvasElement.toBlob()`のような他の`macroTask`を実行したとき、`Unknown macroTask scheduled in fake async test`エラーがスローされます。

<code-tabs>
  <code-pane
    path="testing/src/app/shared/canvas.component.spec.ts"
    header="src/app/shared/canvas.component.spec.ts">
  </code-pane>
  <code-pane
    path="testing/src/app/shared/canvas.component.ts"
    header="src/app/shared/canvas.component.ts">
  </code-pane>
</code-tabs>

このようなケースをサポートしたい場合は、`beforeEach`でサポートしたい`macroTask`を定義する必要があります。
たとえば次のようになります:

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

#### 非同期のObservable

あなたはこれらのテストのテストカバレッジに満足しているかもしれません。

しかし、実際のサービスではこのように動作しないという事実に悩まされるかもしれません。
実際のサービスは、リクエストをリモートサーバーに送信します。
サーバーは応答するのに時間がかかり、
前の2つのテストのように応答をすぐには利用できないでしょう。

次のように`getQuote()`スパイから非同期的なObservableを返すと、
あなたのテストは実世界をより忠実に反映できるでしょう。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-setup"></code-example>

#### 非同期Observableヘルパー

非同期のObservableは、`asyncData`ヘルパーによって生成されました。
`asyncData`ヘルパーは、自分で作成する必要があるユーティリティ関数です。
または、サンプルコードからこれをコピーすることもできます。

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-data"
  header="testing/async-observable-helpers.ts"></code-example>

このヘルパーのObservableは、JavaScriptエンジンの次のターンで`data`の値を発行します。

[RxJSの`defer()`演算子](http://reactivex.io/documentation/operators/defer.html)は、Observableを返します。
PromiseかObservableのどちらかを返すファクトリー関数を受け取ります。
なにかしらが_defer_のObservableをサブスクライブしたとき、
そのファクトリーで作成された新しいObservableにサブスクライバーが追加されます。

`defer()`演算子は、`HttpClient`のように`Promise.resolve()`を新しいObservableに変換して、
1回発行して完了します。
サブスクライバーは、データ値を受け取った後、アンサブスクライブされます。

次は、非同期エラーを生成するための同様のヘルパーです。

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-error"></code-example>

#### さらに非同期テスト

`getQuote()`スパイが非同期Observableを返すようになったので、
ほとんどのテストは非同期でなければならないでしょう。

次は、現実世界で期待されるデータフローを示す
`fakeAsync()`テストです。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="fake-async-test"></code-example>

`ngOnInit()`の後に、引用にはプレースホルダー値(`'...'`)が表示されることに注意してください。
最初の引用はまだ届いていません。

最初の引用をObservableからフラッシュするには、[tick()](api/core/testing/tick) を呼び出します。
次に、`detectChanges()`を呼び出して、Angularに画面を更新するように指示します。

それから、引用の要素に期待されるテキストが表示することをアサートしてみましょう。

{@a async}

#### _async()_を使用した非同期テスト

`async()`機能を使うためには、 `zone.js/dist/zone-testing`をテストセットアップファイルでインポートする必要があります。
Angular CLIで作成されたプロジェクトであれば、 `zone-testing` はすでに `src/test.ts` でインポートされています。

`fakeAsync()`ユーティリティ関数にはいくつかの制限があります。
特に、テスト本体が`XMLHttpRequest` （XHR）呼び出しを行う場合は動作しません。
テスト中のXHR呼び出しはまれであるため、普通は[`fakeAsync()`](#fake-async)を使うことができます。
しかし、`XMLHttpRequest`を呼び出す必要がある場合は、`async()`について知る必要があるでしょう。

<div class="alert is-helpful">

`TestBed.compileComponents()`メソッド([下記参照](#compile-components))は、
"just-in-time"コンパイル時に外部テンプレートとcssファイルを読み込むために`XHR`を呼び出します。
`async()`ユーティリティを使用して`compileComponents()`を呼び出すテストを作成してください。

</div>

次は、さきほどの`fakeAsync()`テストを`async()`ユーティリティで書き直したものです。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-test"></code-example>

`async()`ユーティリティは、
テスターのコードを特別な_asyncテストゾーン_で実行するようにすることによって、非同期的なボイラープレートを隠してくれます。
Jasmineの`done()`は `undefined` なのでテストに渡す必要はなく、
PromiseやObservableのコールバック内で`done()`を呼び出す必要はありません。

しかし、テストの非同期性は`fixture.whenStable()`の呼び出しによって明示的になります。
これは制御の線形的なフローを壊します。

`async()` の中で `setInterval()` などの `intervalTimer()` を使用する場合は、テスト後に `clearInterval()` を使用してタイマーをキャンセルする必要があります。それ以外の場合は、 `async()` は終了しません。

{@a when-stable}

#### _whenStable_

テストは、`getQuote()` Observableが次の引用を発行するのを待つ必要があります。
[tick()](api/core/testing/tick) を呼び出す代わりに、`fixture.whenStable()`を呼び出します。

`fixture.whenStable()`は、
JavaScriptエンジンのタスクキューが空になったときに解決するPromiseを返します。
この例では、Observableが最初の引用を発行すると、タスクキューは空になります。

テストは、Promiseコールバック内で再開し、
期待されるテキストで引用の要素を更新するために`detectChanges()`を呼び出します。

{@a jasmine-done}

#### Jasmineの _done()_

`async()`関数と
`fakeAsync()`関数はAngular非同期テストを大幅に簡素化しますが、
伝統的なテクニックに立ち戻って、
[`done`コールバック](https://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support)
を受け取る関数を`it`に渡すことができます。

`done パラメーター` が `undefined` なので、 `async()` や `fakeAsync()` の中で `done()` を呼び出すことはできません。

さて、あなたはPromiseをチェーンさせ、エラーを処理し、適切な時に`done()`を呼び出す責任があります。

`done()`を使用してテスト関数を書くことは、`async()`と`fakeAsync()`よりも面倒です。
しかしコードが `intervalTimer()` や `setInterval` を含むときには時折必要です。

次は、さきほどの2つのバージョンのテストを`done()`を使用して書いたものです。
最初の1つは、コンポーネントの`quote`プロパティによってテンプレートに公開された`Observable`をサブスクライブします。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="quote-done-test"></code-example>

RxJSの`last()`演算子は、完了する前のObservableの最後の値を発行します。
これはテストの引用になります。
`subscribe`コールバックでは、以前のテストと同じ方法で、引用の要素をテストの引用で更新するために`detectChanges()`を呼び出します。

いくつかのテストでは、画面に表示されるものよりも、
注入されたサービスメソッドがどのように呼び出されるかと、どんな値が返されるかに関心があります。

偽の`TwainService`の`qetQuote()`スパイなどのサービススパイは、
その情報を提供し、ビューの状態についてアサーションを行うことができます。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy-done-test"></code-example>

<hr>

{@a marble-testing}
### コンポーネントのマーブルテスト

さきほどの`TwainComponent`テストでは、`asyncData`と`asyncError`ユーティリティを使用して、
`TwainService`からの非同期Observableの応答をシミュレートしました。

これらはあなた自身で書くことができる短くて簡単な関数です。
残念ながら、これらは多くの一般的なシナリオでは単純すぎます。
Observableは大幅な遅延の後に、複数回発行されることが多いです。
コンポーネントは、
重複する値とエラーのシーケンスで複数のObservableを調整するかもしれません。

**RxJSマーブルテスト**は、シンプル、複雑、
両方の場合のObservableのシナリオをテストするための素晴らしい方法です。
あなたはおそらく、
Observableがどのように動作するかを示す[マーブルダイアグラム](http://rxmarbles.com/)を見たことがあるでしょう。
マーブルテストでは、同様のマーブル言語を使用して、
テスト内でObservableのストリームとエクスペクテーションを指定します。

次の例では、
`TwainComponen`の2つのテストをマーブルテストで再訪します。

まず、`jasmine-marbles` npmパッケージをインストールします。
次に、必要なシンボルをインポートします。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="import-marbles"
  header="app/twain/twain.component.marbles.spec.ts (import marbles)"></code-example>

引用を取得するための完全なテストは次のようになります:

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="get-quote-test"></code-example>

Jasmineのテストが同期的であることに注意してください。
`fakeAsync()`はありません。
マーブルテストは、テストスケジューラーを使用して、同期的テストにおける時間の経過をシミュレートします。

マーブルテストの美しさは、Obsrevalbeストリームの視覚的定義にあります。
このテストでは、3つの[フレーム](#marble-frame)(`---`)を待ち、
値(`x`)を発行し、
完了(`|`)する[_コールド_ Observable](#cold-observable)を定義します。
2番目の引数では、値マーカー(`x`)を発行する値(`testQuote`)にマップします。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-quote-marbles"></code-example>

マーブルライブラリは、
テストが`getQuote`スパイの戻り値としてセットする対応するObservableを構築します。

マーブルObservableをアクティブにする準備ができたら、
次のように`TestScheduler`に用意されたタスクキューを_フラッシュ_するように指示します。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-scheduler-flush"></code-example>

このステップは、
以前の`fakeAsync()`と`async()`での例の中での [tick()](api/core/testing/tick) と`whenStable()`と似た目的を果たします。
テストのバランスはそれらの例と同じです。

### マーブルエラーテスト

次は、`getQuote()`エラーテストのマーブルテストバージョンです。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-test"></code-example>

コンポーネント自体がエラーを処理するときに`setTimeout()`を呼び出すため、
これはまだ非同期テストです。`fakeAsync()`と [tick()](api/core/testing/tick) を呼び出す必要があります。

マーブルObservableの定義を見てください。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-marbles"></code-example>

これは、3つのフレームを待ってからエラーを発行する _コールド_ Observableです。
ハッシュ(`#`)は、3番目の引数で指定されたエラーのタイミングを示します。
Observableは決して値を発行しないので、2番目の引数は`null`です。

#### マーブルテストについて学ぶ

{@a marble-frame}
_マーブルフレーム_とは、テスト時間の仮想的な単位です。
各シンボル( `-` 、`x`、`|`、`#`)は、1つのフレームの通過をマークします。

{@a cold-observable}
_コールド_ Observableはサブスクライブされるまで値を発行しません。
アプリケーションのObservableのほとんどはコールドです。
すべての[_HttpClient_](guide/http)メソッドはコールドObservableを返します。

_ホット_ Observableは購読する_前_にすでに値を発行しています。
ルーターアクティビティを報告する[_Router.events_](api/router/Router#events)Observable、
これは _ホット_ Observableです。

RxJSマーブルテストは、このガイドの範囲を超えて、豊富な題材をもちます。
[公式ドキュメント](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md)から始めて、
ウェブ上で学習してください。

<hr>

{@a component-with-input-output}

### インプットとアウトプットを使用したコンポーネント

インプットとアウトプットをもつコンポーネントは、通常、ホストコンポーネントのビューテンプレート内に配置されます。
ホストは、プロパティバインディングを使用してインプットプロパティを設定し、
イベントバインディングを使用してアウトプットプロパティによって発生したイベントをリッスンします。

テストの目標は、そのようなバインディングが期待どおりに機能することを確認することです。
テストではインプット値を設定し、アウトプットイベントをリッスンする必要があります。

`DashboardHeroComponent`は、このロール内のコンポーネントの小さな例です。
`DashboardComponent`によって提供される個々のヒーローを表示します。
そのヒーローをクリックすると、ユーザーがヒーローを選択したことを`DashboardComponent`に伝えます。

`DashboardHeroComponent`は、次のような`DashboardComponent`テンプレートに組み込まれています:

<code-example
  path="testing/src/app/dashboard/dashboard.component.html"
  region="dashboard-hero"
  header="app/dashboard/dashboard.component.html (excerpt)"></code-example>

`DashboardHeroComponent`は`*ngFor`リピーター内に配置され、
各コンポーネントの`hero`インプットプロパティにループ値を設定し、コンポーネントの`selected`イベントをリッスンします。

コンポーネントの完全な定義は次のとおりです:

{@a dashboard-hero-component}

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="component"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

この単純なコンポーネントのテストに本質的な価値はほとんどありませんが、方法を知ることには価値があります。
あなたは次のアプローチの1つを使用することができます:

- `DashboardComponent`で使用されているようにテストする。
- スタンドアロンコンポーネントとしてテストする。
- `DashboardComponent`に代替して使用されているようにテストする。

最初のアプローチとして`DashboardComponent`コンストラクターを簡単に見てみると:

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)"></code-example>

`DashboardComponent`はAngularのルーターと`HeroService`に依存します。
おそらくそれらを両方ともテストダブルと置き換える必要があります。
これは多くの作業が必要です。ルーターは特に難しそうです。

<div class="alert is-helpful">

[以下の議論](#routing-component)では、ルーターを必要とするコンポーネントのテストについて説明します。

</div>

直近の目標は、`DashboardComponent`ではなく`DashboardHeroComponent`をテストすることです。
したがって、2番目と3番目のオプションを試してみてください。

{@a dashboard-standalone}

#### _DashboardHeroComponent_ スタンドアロンテスト

スペックファイルのセットアップは次のとおりです。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="setup"
  header="app/dashboard/dashboard-hero.component.spec.ts (setup)"></code-example>

セットアップコードがどのようにコンポーネントの`hero`プロパティにテストヒーロー
(`expectedHero`)を割り当てるのか、
`DashboardComponent`が自身のリピーター内でプロパティバインディングを介してそれを設定する方法をエミュレートするかに注目してください。

次のテストでは、ヒーロー名がバインディングを介してテンプレートに伝播することを確認します。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="name-test"></code-example>

[テンプレート](#dashboard-hero-component)ではヒーロー名をAngularの`UpperCasePipe`を通して渡すので、
テストではアッパーケースの名前をもつ要素の値とマッチする必要があります。

<div class="alert is-helpful">

この小さなテストでは、
Angularテストが[コンポーネントクラスのテスト](#component-class-testing)
では不可能だったコンポーネントのビジュアル表現を低コストで、
はるかに遅く複雑なエンドツーエンドのテストに頼らずに検証する方法を示しています。

</div>

#### クリックする

ヒーローをクリックすると、ホストコンポーネント(おそらく`DashboardComponent`)
が受け取ることができる`selected`イベントが発生するはずです:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test"></code-example>

コンポーネントの`selected`プロパティは`EventEmitter`を返します。
これは利用者にはRxJS同期的`Observable`のように見えます。
テストでは、ホストコンポーネントが_暗黙的_に行うのと同じように、_明示的_にサブスクライブします。

コンポーネントが期待どおりに動作する場合、ヒーローの要素をクリックすると、
コンポーネントの`selected`プロパティに`hero`オブジェクトを発行するように指示するはずです。

テストでは、`selected`へのサブスクリプションを通じてそのイベントが検知されます。

{@a trigger-event-handler}

#### _triggerEventHandler_

さきほどのテストの`heroDe`は、ヒーローの`<div>`を表す`DebugElement`です。

これはAngularのプロパティと、ネイティブ要素とのやりとりを抽象化するメソッドを持ちます。
このテストでは、 "click"というイベント名で`DebugElement.triggerEventHandler`を呼び出します。
"click"イベントバインディングは、`DashboardHeroComponent.click()`を呼び出して応答します。

Angularの`DebugElement.triggerEventHandler`は、
その_イベント名_で_データバインドされたイベント_を発生させることができます。2番目のパラメータは、ハンドラーに渡されるイベントオブジェクトです。

このテストでは、`null`イベントオブジェクトをもつ"click"イベントがトリガーされます。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler"></code-example>

テストで
ランタイムのイベントハンドラー(コンポーネントの`click()`メソッド)
がイベントオブジェクトを使用していないことを前提(まさにこのケース)としています。

<div class="alert is-helpful">

他のハンドラーはあまり寛容ではありません。
たとえば、`RouterLink`ディレクティブは、
クリック中にどのマウスボタン(ある場合)が押されたのかを識別する`button`プロパティをもつオブジェクトを想定しています。
イベントオブジェクトがない場合、`RouterLink`ディレクティブはエラーをスローします。

</div>

#### 要素をクリックする

次のテストでは、かわりにネイティブ要素自身の`click()`メソッドを呼び出します。
これは、_このコンポーネント_では問題ありません。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-2"></code-example>

{@a click-helper}

#### _click()_ ヘルパー

ボタン、アンカー、または任意のHTML要素をクリックすることは、一般的なテストタスクです。

_クリックトリガー_プロセスを次のような`click()`関数などのヘルパーにカプセル化することで、
一貫性と容易さを実現します:

<code-example
  path="testing/src/testing/index.ts"
  region="click-event"
  header="testing/index.ts (click helper)"></code-example>

最初のパラメータは_クリックする要素_です。
必要に応じて、カスタムイベントオブジェクトを2番目のパラメータとして渡すことができます。
デフォルトは、`RouterLink`ディレクティブを含む多くのハンドラーで受け入れられる(一部の)
<a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button">左ボタンマウスイベントオブジェクト</a>です。

<div class="alert is-important">

`click()`ヘルパー関数はAngularテストユーティリティの1つでは**ありません**。
この_ガイドのサンプルコード_で定義されている関数です。
すべてのサンプルテストでこれを使用しています。
あなたがこれを好むなら、あなた自身のヘルパーのコレクションに追加してください。

</div>

次は、さきほどのテストを、クリックヘルパーを使って書き直したものです。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-3"
  header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)"></code-example>

<hr>

{@a component-inside-test-host}

### テストホスト内部のコンポーネント

さきほどのテストでは、ホストである`DashboardComponent`自身をロールプレイしました。
しかし、`DashboardHeroComponent`は、ホストコンポーネントに適切にデータバインドされているときに正常に動作するでしょうか?

実際の`DashboardComponent`でテストできますが、
特に、そのテンプレートが`*ngFor`リピーター、他のコンポーネント、
レイアウトHTML、追加のバインディング、
複数のサービスを注入するコンストラクターを持っていて、
それらのサービスとすぐにやりとりし始めるとき、
多くのセットアップが必要になる可能性があります。

これらの気が狂いそうなものを無効にするための努力を想像してみてください。
ちょうどこのような_テストホスト_でうまくいくことができる点を検証することです。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host"
  header="app/dashboard/dashboard-hero.component.spec.ts (test host)"
 ></code-example>

このテストホストは、`DashboardComponent`のように`DashboardHeroComponent`にバインドしますが、ルーター、
`HeroService`、`*ngFor`リピーターなどのノイズはありません。

テストホストは、自身のテストヒーローをコンポーネントの`hero`インプットプロパティに設定します。
これはコンポーネントの`selected`イベントを`onSelected`ハンドラーにバインドします。
このハンドラーは、発行されたヒーローを`selectedHero`プロパティに記録します。

その後、
テストでは`DashboardHeroComponent.selected`イベントが期待されるヒーローを発行したことを検証するために`selectedHero`を簡単にチェックすることができます。

_テストホスト_のテストのセットアップは、スタンドアロンテストのセットアップと似ています:

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup" header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)"></code-example>

このテストモジュールの構成では、3つの重要な違いがあります:

1. `DashboardHeroComponent`と`TestHostComponent`の両方を_宣言_します。
1. `DashboardHeroComponent`の代わりに`TestHostComponent`を_作成_します。
1. `TestHostComponent`は`DashboardHeroComponent.hero`にバインディングをセットします。

`createComponent`は、`DashboardHeroComponent`のインスタンスの代わりに`TestHostComponent`のインスタンスをもつ`fixture`を返します。

`TestHostComponent`を作成すると、
前者のテンプレート内に`DashboardHeroComponent`が表示されるため、
それを作成するという副作用があります。
ヒーロー要素(`heroEl`)のクエリは、さきほどよりも要素ツリーの深さが深いものの、テストDOM内でそれを見つけ出せます。

テスト自体はスタンドアロンバージョンとほぼ同じです:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host-tests"
  header="app/dashboard/dashboard-hero.component.spec.ts (test-host)"></code-example>

選択したイベントテストのみが異なります。
これは、選択された`DashboardHeroComponen`のヒーローが実際にホストコンポーネントへのイベントバインディングを通じて登ってきたことを確認します。

<hr>

{@a routing-component}

### ルーティングコンポーネント

_ルーティングコンポーネント_は、`Router`に別のコンポーネントにナビゲートするように指示するコンポーネントです。
`DashboardComponent`は、ユーザーがダッシュボード上の_ヒーローボタン_の1つをクリックして`HeroDetailComponent`にナビゲートできるため、
_ルーティングコンポーネント_です。

ルーティングはかなり複雑です。
`DashboardComponent`のテストは、`HeroService`と一緒に注入される`Router`が関係しているため、
部分的には厄介にみえます。

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)"></code-example>

`HeroService`をスパイでモックするのは[おなじみの話](#component-with-async-service)です。
しかし、`Router`には複雑なAPIがあり、他のサービスやアプリケーションの前提条件と絡み合っています。モックするのは難しいかもしれないでしょうか?

幸いなことに、このケースでは、`DashboardComponent`が`Router`をあまり使用していないのでそうでもないです。

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="goto-detail"
  header="app/dashboard/dashboard.component.ts (goToDetail)"></code-example>

これは_ルーティングコンポーネント_でよくあるケースです。
原則として、ルーターではなくコンポーネントをテストし、
指定された条件の下でコンポーネントが正しいアドレスでナビゲートする場合にのみ注意してください。

_このコンポーネント_のテストスイートのためのルータースパイを提供することは、
`HeroService`スパイを提供するのと同じくらい簡単です。

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="router-spy"
  header="app/dashboard/dashboard.component.spec.ts (spies)"></code-example>

次のテストでは、表示されたヒーローをクリックし、
`Router.navigateByUrl`が期待されるURLで呼び出されたことを確認します。

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="navigate-test"
  header="app/dashboard/dashboard.component.spec.ts (navigate test)"></code-example>

{@a routed-component-w-param}

### ルーテッドコンポーネント

_ルーテッドコンポーネント_は`Router`ナビゲーションの行き先です。
特にコンポーネントへのルーティングに_パラメータが含まれている_場合は、テストするのが難しい場合があります。
`HeroDetailComponent`は、そのようなルーティングの行き先である_ルーテッドコンポーネント_です。

ユーザーが_ダッシュボード_のヒーローをクリックしたとき、
`DashboardComponent`はルーターに`heroes/:id`にナビゲートするように指示します。
`:id`はルーティングパラメータであり、その値は編集するヒーローの`id`です。

`Router`はそのURLを`HeroDetailComponent`へのルーティングとマッチします。
`Router`はルーティング情報を含む`ActivatedRoute`オブジェクトを作成し、
それを`HeroDetailComponent`の新しいインスタンスに挿入します。

`HeroDetailComponent`のコンストラクターは次のようになります:

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ctor" header="app/hero/hero-detail.component.ts (constructor)"></code-example>

`HeroDetail`コンポーネントは`HeroDetailService`
経由で対応するヒーローをフェッチするために`id`パラメータを必要とします。
コンポーネントは、
`Observable`である`ActivatedRoute.paramMap`プロパティから`id`を取得する必要があります。

`ActivatedRoute.paramMap`の`id`プロパティを参照するだけでは不十分です。
コンポーネントは、`ActivatableRoute.paramMap` Observableを_サブスクライブ_し、
`id`がそのライフタイム内で変更されるように準備する必要があります。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init" header="app/hero/hero-detail.component.ts (ngOnInit)"></code-example>

<div class="alert is-helpful">

[ルーター](guide/router#route-parameters)ガイドでは、`ActivatedRoute.paramMap`について詳しく説明しています。

</div>

テストでは、コンポーネントのコンストラクターに注入された`ActivatedRoute`を操作することによって、
`HeroDetailComponent`が異なる`id`パラメータ値にどのように応答するかを調べることができます。

あなたは`Router`とデータサービスをスパイする方法を知っています。

あなたは次の理由で`ActivatedRoute`とは異なるアプローチをとるでしょう。

- `paramMap`は、
  テスト中に複数の値を出力できる`Observable`を返します。
- `ParamMap`を作成するためのルーターヘルパー関数`convertToParamMap()`が必要です。
- 他の_ルーテッドコンポーネント_のテストでは、`ActivatedRoute`のテストダブルが必要です。

これらの違いは、再利用可能なスタブクラスが必要だと言っています。

#### _ActivatedRouteStub_

次の`ActivatedRouteStub`クラスは、`ActivatedRoute`のテストダブルとして機能します。

<code-example
  path="testing/src/testing/activated-route-stub.ts"
  region="activated-route-stub"
  header="testing/activated-route-stub.ts (ActivatedRouteStub)"></code-example>

このようなヘルパーを`app`フォルダと同一階層の`testing`フォルダに配置することを検討してください。
このサンプルでは`ActivatedRouteStub`を`testing/activated-route-stub.ts`に置きます。

<div class="alert is-helpful">

  [_マーブルテストライブラリ_](#marble-testing)
  でこのスタブクラスのより能力の高いバージョンを書くことを検討してください。

</div>

{@a tests-w-test-double}

#### _ActivatedRouteStub_ を使用したテスト

Observableより取得した`id`が既存のヒーローを参照しているときのコンポーネントの動作を示すテストは次のようになります:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id" header="app/hero/hero-detail.component.spec.ts (existing id)"></code-example>

<div class="alert is-helpful">

`createComponent()`メソッドと`page`オブジェクトについては[後述](#page-object)します。
今はあなたの直感に頼ってください。

</div>

`id`が見つからない場合、コンポーネントは`HeroListComponent`にルーティングし直す必要があります。

テストスイートのセットアップは、実際にナビゲートせずにルーターをスパイしている[上記](#routing-component)と同じルータースパイを提供しました。

次のテストでは、コンポーネントが`HeroListComponent`にナビゲートしようとします。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id" header="app/hero/hero-detail.component.spec.ts (bad id)"></code-example>

このアプリは`id`パラメータを省略した`HeroDetailComponent`へのルーティングを持っていませんが、いつかそのようなルーティングを追加するかもしれません。
コンポーネントは、`id`がないときに妥当な何かを行うべきです。

この実装では、コンポーネントは新しいヒーローを作成して表示する必要があります。
新しいヒーローは`id=0`と空の`name`を持ちます。次のテストではコンポーネントが期待どおりに動作することを確認します:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="route-no-id"
  header="app/hero/hero-detail.component.spec.ts (no id)"></code-example>

<hr>
{@a nested-component-tests}

### ネストしたコンポーネントのテスト

コンポーネントテンプレートはネストしたコンポーネントをもつことが多いです。
そのテンプレートにはさらにコンポーネントが含まれるているでしょう。

コンポーネントツリーはとても深いかもしれませんが、
ほとんどの場合、ネストしたコンポーネントは、ツリーの最上部にあるコンポーネントのテストには何の役割も果たしません。

たとえば、`AppComponent`は、アンカーとその`RouterLink`ディレクティブを含むナビゲーションバーを表示します。

<code-example
  path="testing/src/app/app.component.html"
  header="app/app.component.html"></code-example>

`AppComponent`_クラス_は空ですが、
おそらく[以下の理由](#why-stubbed-routerlink-tests)で、
リンクが`RouterLink`ディレクティブに正しく配線されているかどうかを確認するためのユニットテストを書きたいかもしれません。

リンクを検証するには、ナビゲートするための`Router`は必要ではありませんし、
`Router`が_ルーテッドコンポーネント_を挿入する場所をマークするための`<router-outlet>`も必要ありません。

`BannerComponent`と`WelcomeComponent`
(`<app-banner>`と`<app-welcome>`で示される)も無関係です。

しかし、`AppComponent`をDOMに作成するテストでは、
これらの3つのコンポーネントのインスタンスも作成されます。
そのような場合は、それらを作成するために`TestBed`を設定する必要があるでしょう。

それらの宣言を怠ると、
Angularコンパイラは`AppComponent`テンプレート内の`<app-banner>`、`<app-welcome>`、および`<router-outlet>`タグを認識せず、
エラーをスローします。

実際のコンポーネントを宣言する場合は、_それら_のネストしたコンポーネントを宣言し、
ツリー内の_あらゆる_コンポーネントに注入された_すべて_のサービスも提供する必要があります。

これはリンクについての簡単な質問に答えるだけに対して過大な労力です。

このセクションでは、セットアップを最小限に抑えるための2つのテクニックについて説明します。
主要なコンポーネントのテストに集中するために、これらを単独または組み合わせて使用​​してください。

{@a stub-component}

##### 不必要なコンポーネントをスタブする

最初のテクニックでは、
テストでほとんど役割を果たさないコンポーネントとディレクティブのスタブバージョンを作成して宣言します。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="component-stubs"
  header="app/app.component.spec.ts (stub declaration)"></code-example>

スタブのセレクターは、対応する実際のコンポーネントのセレクターと一致します。
しかし、そのテンプレートとクラスは空です。

その後、`TestBed`の構成内で、
実際に必要なコンポーネント、ディレクティブ、パイプの次に宣言します。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="testbed-stubs"
  header="app/app.component.spec.ts (TestBed stubs)"></code-example>

`AppComponent`はテスト対象ですので、もちろん実際のバージョンを宣言してください。

[後述](#routerlink)する`RouterLinkDirectiveStub`は、
リンクのテストに役立つ、実際の`RouterLink`のテストバージョンです。

残りはスタブです。

{@a no-errors-schema}

#### _NO_ERRORS_SCHEMA_

2つ目のアプローチでは、`NO_ERRORS_SCHEMA`を`TestBed.schemas`メタデータに追加します。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="no-errors-schema"
  header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)"></code-example>

`NO_ERRORS_SCHEMA`は、認識できない要素と属性を無視するようにAngularコンパイラに指示します。

コンパイラは、
`TestBed`の設定で対応する`AppComponent`と`RouterLinkDirectiveStub`を宣言したため、
`<app-root>`要素と`routerLink`属性を認識します。

しかし、`<app-banner>`、`<app-welcome>`、または`<router-outlet>`が見つかった場合、コンパイラはエラーを投げません。
単に空のタグとしてレンダリングし、ブラウザはそれらを無視します。

スタブコンポーネントはもう必要ありません。

#### 両方のテクニックを使用する

これらのテクニックは、
コンポーネントの視覚的な外見を、テストの対象となるコンポーネントのテンプレート内の要素だけに縮小するので、
_浅いコンポーネントテスト_と呼ばれます。

`NO_ERRORS_SCHEMA`のアプローチは2つの方法を使うよりも簡単ですが、それを過度に使用しないでください。

また、`NO_ERRORS_SCHEMA`は、誤って省略した、
またはスペルの間違ったコンポーネントや属性についてもコンパイラに知らせないようにします。
コンパイラが瞬時に捉えていた隠されたバグを追跡する時間を無駄にすることがあります。

_スタブコンポーネント_のアプローチには別の利点があります。
_この_例のスタブは空ですが、
テストで何らかの方法でそれとやりとりする必要がある場合は、
テンプレートとクラスを取り除くことができます。

実際には、
この例のように同じセットアップ内で2つのテクニックを組み合わせます。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="mixed-setup"
  header="app/app.component.spec.ts (mixed setup)"></code-example>

Angularコンパイラは、`<app-banner>`要素の`BannerComponentStub`を作成し、
`routerLink`属性をもつアンカーに`RouterLinkStubDirective`を適用しますが、
`<app-welcome>`タグと`<router-outlet>`タグは無視します。

<hr>

{@a routerlink}
### _RouterLink_を使用したコンポーネント

実際の`RouterLinkDirective`はかなり複雑で、
他のコンポーネントや`RouterModule`のディレクティブと絡み合っています。
テストでモックして使用するには、頑張ったセットアップが必要です。

このサンプルコードの`RouterLinkDirectiveStub`は、
実際のディレクティブを、
`AppComponent`テンプレートに見られるアンカータグ配線の種類を検証するために設計された代替バージョンに置き換えます。

<code-example
  path="testing/src/testing/router-link-directive-stub.ts"
  region="router-link"
  header="testing/router-link-directive-stub.ts (RouterLinkDirectiveStub)"></code-example>

`[routerLink]`属性にバインドされたURLは、ディレクティブの`linkParams`プロパティに流れます。

`HostListener`メタデータプロパティは、
ホスト要素のクリックイベント(`AppComponent`の`<a>`アンカー要素)をスタブディレクティブの`onClick`メソッドに紐づけます。

アンカーをクリックすると、
`onClick()`メソッドをトリガーして、スタブに露出した`navigatedTo`プロパティが設定されます。
テストでは、
アンカーをクリックしたときに期待どおりのルート定義が設定されていることを確認するために`navigatedTo`を検証します。

<div class="alert is-helpful">

ルーターがそのルーティング定義でナビゲートするように正しく設定されているかどうかは、
別のテストセットで考えることです。

</div>

{@a by-directive}
{@a inject-directive}

#### _By.directive_ と注入したディレクティブ

もう少しセットアップすると、最初のデータバインディングがトリガーされ、ナビゲーションリンクへの参照が取得されます:

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="test-setup"
  header="app/app.component.spec.ts (test setup)"></code-example>

特に興味のあるポイントは3つあります:

1. `By.directive`を使用して、添付されたディレクティブでアンカー要素を見つけることができます。

1. クエリは、マッチする要素を囲むような`DebugElement`ラッパーを返します。

1. 各`DebugElement`は、
   特定の、その要素にアタッチされたディレクティブのインスタンスをもつ依存性のインジェクターを公開します。

検証のための`AppComponent`のリンクは次のとおりです:

<code-example
  path="testing/src/app/app.component.html"
  region="links"
  header="app/app.component.html (navigation links)"></code-example>

{@a app-component-tests}

これらのリンクが期待どおりに`routerLink`ディレクティブに配線されていることを確認するテストは次のようになります:

<code-example path="testing/src/app/app.component.spec.ts" region="tests" header="app/app.component.spec.ts (selected tests)"></code-example>

<div class="alert is-helpful">

_この例_の"click"テストは誤解を招きます。
これは、_コンポーネント_ではなく、`RouterLinkDirectiveStub`をテストします。
これは、ディレクティブスタブの一般的な失敗です。

このガイドには正当な目的があります。
ルーターの全機能を使用することなく、`RouterLink`要素を見つけてクリックし、結果を検証する方法を示します。
これは、ユーザーがリンクをクリックしたときに、
表示を変更したり、パラメータを再計算したり、
ナビゲーションオプションを並べ替えたりする、
より洗練されたコンポーネントをテストするために必要なスキルです。

</div>

{@a why-stubbed-routerlink-tests}

#### それらのテストは何がよいのですか?

スタブした`RouterLink`テストでは、リンクとアウトレットをもつコンポーネントが適切に設定されていること、
コンポーネントが必要なリンクを持っていること、そしてそれらすべてが期待される行き先になっていることを確認できます。
これらのテストは、ユーザーがリンクをクリックしたときにアプリケーションが対象のコンポーネントにナビゲートすることに成功するかどうかには関係ありません。

このような制限されたテストを達成するためには、`RouterLink`と`RouterOutlet`をスタブすることが最良の選択肢です。
実際のルーターに依存すると、それらは脆弱になります。
コンポーネントと無関係の理由で失敗する可能性があります。
たとえば、ナビゲーションガードによって、権限のないユーザーが`HeroListComponent`にアクセスするのを防ぐかもしれません。
これは`AppComponent`の落ち度ではなく、そのコンポーネントへの変更は失敗したテストを修正することはできません。

_別_の総合テストでは、ユーザーが認証され、許可されているかどうかなどの、
ガードに影響する条件が存在する場合にアプリケーションが期待どおりにナビゲートするかどうかを調べることができます。

<div class="alert is-helpful">

将来のガイドアップデートでは、
`RouterTestingModule`でこのようなテストを書く方法を説明します。

</div>

<hr>

{@a page-object}

### _page_ オブジェクトを使用する

`HeroDetailComponent`は、タイトル、2つのヒーローのフィールド、2つのボタンをもつシンプルなビューです。

<div class="lightbox">
  <img src='generated/images/guide/testing/hero-detail.component.png' alt="HeroDetailComponent in action">
</div>

しかし、このシンプルなフォームでも多くの複雑なテンプレートを持ちます。

<code-example
  path="testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"></code-example>

コンポーネントを実行するテストに必要なことは...

- 要素がDOMに現れる前にヒーローが到着するまで待つこと。
- タイトルテキストへの参照。
- 検証して値をセットするための名前のインプットボックスへの参照。
- クリック可能な2つのボタンへの参照。
- いくつかのコンポーネントとルーターのメソッドをスパイする。

このような小さなフォームであっても、苦しくて面倒くさい条件設定とCSS要素の選択が必要になるでしょう。

コンポーネントプロパティへのアクセスを処理し、
それらを設定するロジックをカプセル化する`Page`クラスを使用して、複雑さを克服してください。

`hero-detail.component.spec.ts`の`Page`クラスは次のとおりです。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="page"
  header="app/hero/hero-detail.component.spec.ts (Page)"></code-example>

コンポーネントの操作と検証のための重要なフックは、`Page`のインスタンスからきれいに整理され、アクセス可能になりました。

`createComponent`メソッドは`page`オブジェクトを作成し、`hero`が到着すると空白を埋め込みます。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="create-component"
  header="app/hero/hero-detail.component.spec.ts (createComponent)"></code-example>

上のセクションの[_HeroDetailComponent_のテスト](#tests-w-test-double)では、
`createComponent`と`page`がテストの短さと_方針_を保つ方法を示しています。
注意を払う必要はありません。Promiseを待つことはなく、比較する要素値のDOMを検索する必要もありません。

次は、この点を補強する`HeroDetailComponent`テストです。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="selected-tests"
  header="app/hero/hero-detail.component.spec.ts (selected tests)"></code-example>

<hr>

{@a compile-components}
### _compileComponents()_ を呼び出す
<div class="alert is-helpful">

CLIから`ng test`コマンドを使用してテストを実行する_だけ_な場合、
CLIがテストを実行する前にアプリケーションをコンパイルするのでこのセクションは無視してもかまいません。

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
  header="app/banner/banner-external.component.ts (external template & css)"></code-example>

`TestBed`がコンポーネントを作成しようとすると、テストは失敗します。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="configure-and-create"
  header="app/banner/banner.component.spec.ts (setup that fails)"
  avoid></code-example>

アプリケーションがコンパイルされていないことを思い出してください。
したがって、`createComponent()`を呼び出すと、`TestBed`は暗黙的にコンパイルされます。

これは、ソースコードがメモリ上にあるときには問題ありません。
しかし、`BannerComponent`は、
コンパイルが本質的に
_非同期_な操作である、ファイルシステムから読み取らなくてはいけない外部ファイルを必要とします。

`TestBed`を続行することが許されていれば、
テストは実行され、コンパイラが終了する前に不思議に失敗するでしょう。

さきほどのエラーメッセージは、`compileComponents()`で明示的にコンパイルするよう指示しています。

#### _compileComponents()_ は非同期

あなたは非同期テスト関数内で`compileComponents()`を呼び出す必要があります。

<div class="alert is-critical">

テスト関数を非同期にすることを怠った場合
(たとえば、後述の`async()`の使用を忘れた場合)、
このようなエラーメッセージが表示されます。

<code-example language="sh" class="code-shell" hideCopy>
Error: ViewDestroyedError: Attempt to use a destroyed view
</code-example>

</div>

典型的な方法は、セットアップロジックを2つの別々の`beforeEach()`関数に分割することです。

1. コンポーネントをコンパイルする非同期的な`beforeEach()`
1. 残りのセットアップを実行する同期的な`beforeEach()`

このパターンにしたがうには、`async()`ヘルパーを他のテストシンボルと一緒にインポートします。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="import-async"></code-example>

#### 非同期な_beforeEach_

次のように、最初の非同期な`beforeEach`を書いてください。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="async-before-each"
  header="app/banner/banner-external.component.spec.ts (async beforeEach)"></code-example>

`async()`ヘルパー関数は、セットアップを行うパラメーターなしの関数を受け取ります。

`TestBed.configureTestingModule()`メソッドは`TestBed`クラスを返します。
これにより、`compileComponents()`などの他の`TestBed`の静的メソッドの呼び出しをチェーンすることができます。

この例では、`BannerComponent`がコンパイルする唯一のコンポーネントです。
他の例では、複数のコンポーネントをもつテストモジュールを構成し、
より多くのコンポーネントを保持するアプリケーションモジュールをインポートできます。
いずれも外部ファイルを必要とする可能性があります。

`TestBed.compileComponents`メソッドは、テストモジュールで構成されたすべてのコンポーネントを非同期にコンパイルします。

<div class="alert is-important">

`compileComponents()`を呼び出した後に`TestBed`を再構成しないでください.

</div>

`compileComponents()`を呼び出すと、追加の設定を行うために現在の`TestBed`インスタンスが閉じられます。
`configureTestingModule()`や`override...`メソッドのいずれも呼び出すことはできません。
試してみると、`TestBed`はエラーをスローします。

`compileComponents()`を`TestBed.createComponent()`
を呼び出す前の最後のステップにしてください。

#### 同期的な _beforeEach_

次の、同期的な`beforeEach()`には、
コンポーネントの作成と、検証する要素のクエリの実行を含む残りの設定手順が含まれています。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="sync-before-each"
  header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)"></code-example>

テストランナーは、2番めの`beforeEach`の呼び出し前に、最初の非同期の`beforeEach`の完了を待つことができます。

#### セットアップを統合する

2つの`beforeEach()`関数を1つの非同期の`beforeEach()`に統合することができます。

`compileComponents()`メソッドはPromiseを返します。
なので、同期的コードを`then(...)`コールバックに移動することによって、
コンパイル_後_に同期的なセットアップタスクを実行できます。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="one-before-each"
  header="app/banner/banner-external.component.spec.ts (one beforeEach)"></code-example>

#### _compileComponents()_ は無害

`compileComponents()`が必要でないときに呼び出すことに害はありません。

CLIによって生成されたコンポーネントテストファイルは、
`ng test`の実行時には必要ではないのに`compileComponents()`を呼び出します。

このガイドのテストでは必要になったときだけ`commpileComponents`を呼び出します。

<hr>

{@a import-module}

### モジュールのインポートを使用してセットアップする

これまでのコンポーネントテストでは、次のようにいくつかの`declarations`でテストモジュールを構成しました:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="config-testbed"
  header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)"></code-example>

`DashboardComponent`はシンプルです。
補助を必要としません。
しかし、より複雑なコンポーネントは多くの場合、他のコンポーネント、ディレクティブ、パイプ、プロバイダーに依存し、これらもテストモジュールに追加する必要があります。

幸いにも、`TestBed.configureTestingModule`パラメータは、
`@NgModule`デコレーターに渡されるメタデータと平行です。
つまり、`providers`と`imports`を指定することもできます。

`HeroDetailComponent`は、サイズが小さく簡単な構成にもかかわらず、多くの補助が必要です。
デフォルトのテストモジュールの`CommonModule`から受け取るサポートに加えて、次のものが必要になります:

- 双方向バインディングを有効にするための`FormsModule`内の`NgModel`とその仲間
- `shared`フォルダ内の`TitleCasePipe`
- ルーターサービス(これらのテストではスタブしています)
- ヒーローデータアクセスサービス(これもスタブされています)

1つのアプローチは、次の例のように個々の部品からテストモジュールを構成することです:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-forms-module"
  header="app/hero/hero-detail.component.spec.ts (FormsModule setup)"></code-example>

<div class="alert is-helpful">

`HeroDetailComponent`は外部テンプレートとCSSファイルをもつため、
`beforeEach()`は非同期的に`TestBed.compileComponents`を呼び出します。

上記の[_`compileComponents()`の呼び出し_](#compile-components)
で説明したように、
これらのテストはAngularがブラウザ上でコンパイルしなければならない非CLI環境で実行できます。

</div>

#### 共有モジュールをインポートする

多くのアプリケーションのコンポーネントは`FormsModule`と`TitleCasePipe`を必要とするため、
開発者は頻繁に要求されるこれらのコンポーネントを組み合わせるために`SharedModule`を作成しました。

テスト構成では、この代替のセットアップのような`SharedModule`も使用できます:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-shared-module"
  header="app/hero/hero-detail.component.spec.ts (SharedModule setup)"></code-example>

インポート文の数が少なくて済むようになります(表示はしません)。

{@a feature-module-import}

#### フィーチャーモジュールをインポートする

`HeroDetailComponent`は`HeroModule`[フィーチャーモジュール](guide/feature-modules)の一部品で、
`SharedModule`を含む相互依存関係の多くを集約します。
次のような`HeroModule`をインポートするテスト構成を試してみてください:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module" header="app/hero/hero-detail.component.spec.ts (HeroModule setup)"></code-example>

これは_本当_に簡潔です。`providers`のテストダブルが残っているだけです。`HeroDetailComponent`の宣言さえもなくなりました。

実際に`HeroDetailComponent`を宣言しようとすると、
`HeroDetailComponent`が`TestBed`によって作成された`HeroModule`と`DynamicTestModule`の両方で宣言されるため、
Angularはエラーをスローします。

<div class="alert is-helpful">

フィーチャーモジュールがそうであるように、
コンポーネントのフィーチャーモジュールをインポートすることは、
モジュール内に相互依存関係が多くてモジュールが小さい場合にテストを構成するもっとも簡単な方法です。

</div>

<hr>

{@a component-override}

### コンポーネントのプロバイダーをオーバーライドする

`HeroDetailComponent`は自分自身の`HeroDetailService`を提供します。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="prototype" header="app/hero/hero-detail.component.ts (prototype)"></code-example>

`TestBed.configureTestingModule`の`providers`でコンポーネントの`HeroDetailService`をスタブすることはできません。
それらはコンポーネントではなく、_テストモジュール_のプロバイダーです。_フィクスチャーレベル_で依存性のインジェクターを準備します。

Angularはコンポーネントを、フィクスチャーインジェクターの_子_であるコンポーネント_自身_のインジェクターを使用して作成します。
コンポーネントのプロバイダー(このケースでは`HeroDetailService`)を子インジェクターに登録します。

テストでは、フィクスチャーのインジェクターから子インジェクターサービスを受け取ることができません。
また、`TestBed.configureTestingModule`ではそれらを構成することもできません。

Angularは最初からずっと本物の`HeroDetailService`のインスタンスを作成していました!

<div class="alert is-helpful">

`HeroDetailService`がリモートサーバーへの自身のXHR呼び出しを行った場合、これらのテストは失敗するか、タイムアウトになる可能性があります。
呼び出すリモートサーバーがない可能性があります。

幸いにも、`HeroDetailService`は、注入された`HeroService`へリモートデータアクセスの責任を委譲します。

<code-example path="testing/src/app/hero/hero-detail.service.ts" region="prototype" header="app/hero/hero-detail.service.ts (prototype)"></code-example>

[以前のテスト構成](#feature-module-import)では、
実際の`HeroService`をサーバー要求をインターセプトしてレスポンスを偽装する`TestHeroService`に置き換えていました。

</div>

もしあなたがとても幸運でないならどうでしょうか? `HeroService`をモックするのが難しい場合はどうすればいいですか?
`HeroDetailService`自身がサーバーへリクエストする場合はどうなりますか？

`TestBed.overrideComponent`メソッドは、コンポーネントの`providers`を、
次のセットアップの変更で示すように、管理しやすい_テストダブル_に置き換えることができます:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override" header="app/hero/hero-detail.component.spec.ts (Override setup)"></code-example>

`TestBed.configureTestingModule`が(偽の)`HeroService`を提供しなくなったことに([不要](#spy-stub)であるため)注目してください。

{@a override-component-method}

#### _overrideComponent_ メソッド

`overrideComponent` メソッドに注目してください。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method" header="app/hero/hero-detail.component.spec.ts (overrideComponent)"></code-example>

これは2つの引数を受け取ります。オーバーライドするコンポーネントタイプ(`HeroDetailComponent`)とオーバーライドメタデータオブジェクトです。
[オーバーライドメタデータオブジェクト](#metadata-override-object)は、次のように定義されるジェネリック型のオブジェクトです:

<code-example language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

メタデータオーバーライドオブジェクトは、メタデータプロパティに要素を追加または削除するか、またはこれらのプロパティを完全にリセットすることができます。
この例では、コンポーネントの`providers`のメタデータをリセットします。

型パラメータ`T`は`@Component`デコレーターに渡すメタデータの種類です

<code-example language="javascript">
  selector?: string;
  template?: string;
  templateUrl?: string;
  providers?: any[];
  ...
</code-example>

{@a spy-stub}

#### _スパイスタブ_を提供する (_HeroDetailServiceSpy_)

この例では、コンポーネントの`providers`配列を、`HeroDetailServiceSpy`を含む新しい配列で完全に置き換えます。

`HeroDetailServiceSpy`は、そのサービスのすべての必要な機能を偽装する
実際の`HeroDetailService`のスタブバージョンです。
下位レベルの`HeroService`に注入も委譲もしないので、
そのためのテストダブルを用意する必要はありません。

関連する`HeroDetailComponent`テストは、
`HeroDetailService`のメソッドがサービスメソッドをスパイすることによって呼び出されたことをアサートします。
したがって、スタブはそのメソッドをスパイとして実装します:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy" header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)"></code-example>

{@a override-tests}

#### テストを上書きする

テストでは、スパイスタブの`testHero`を操作してコンポーネントのヒーローを直接制御し、
サービスメソッドが呼び出されたことを確認できます。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests" header="app/hero/hero-detail.component.spec.ts (override tests)"></code-example>

{@a more-overrides}

#### さらに上書きする

`TestBed.overrideComponent`メソッドは、同じコンポーネントまたは異なるコンポーネントに対して複数回呼び出すことができます。
`TestBed`は同様の、他のクラスの部分を掘り下げて置き換えるための`overrideDirective`、`overrideModule`、
および`overridePipe`メソッドを提供します。

あなた自身のオプションと組み合わせを探しましょう。

<hr>

{@a attribute-directive}

## 属性ディレクティブのテスト

_属性ディレクティブ_は、要素、コンポーネントまたは別のディレクティブの動作を変更します。
その名前は、ディレクティブが適用されるホストエレメントの属性として反映されます。

サンプルアプリケーションの`HighlightDirective`は、
データバインドされた色またはデフォルトの色(ライトグレー)のいずれかに基づいて要素の背景色を設定します。
また、要素のカスタムプロパティ(`customProperty`)を、
それが可能であることを示す以外の理由なしに`true`に設定します。

<code-example path="testing/src/app/shared/highlight.directive.ts" header="app/shared/highlight.directive.ts"></code-example>

これはアプリケーション全体で使用されています。多分、`AboutComponent`内のものがもっともシンプルです:

<code-example path="testing/src/app/about/about.component.ts" header="app/about/about.component.ts"></code-example>

`AboutComponent`内の特定の`HighlightDirective`の使用をテストするには、
さきほど説明した手法(特に ["シャローテスト"](#nested-component-tests)アプローチ)のみが必要です。

<code-example path="testing/src/app/about/about.component.spec.ts" region="tests" header="app/about/about.component.spec.ts"></code-example>

しかし、単一のユースケースをテストすることは、ディレクティブの機能の全範囲を調査することにはなりません。
このディレクティブを使用しているすべてのコンポーネントを見つけてテストするのは面倒で脆く、完全にカバーすることはほとんどありません。

_クラスのみ_のテストは役に立ちますが、
このような属性ディレクティブはDOMを操作する傾向があります。
隔離されたユニットテストはDOMに触れることはないので、
ディレクティブの効果に対する信頼を促すものではありません。

よりよい解決策は、ディレクティブを適用するすべての方法を示す人工的なテストコンポーネントを作成することです。

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" header="app/shared/highlight.directive.spec.ts (TestComponent)"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="HighlightDirective spec in action">
</div>

<div class="alert is-helpful">

`<input>`は、`HighlightDirective`をインプットボックスのカラー値の名前にバインドします。
初期値にはインプットボックスの背景色であるべき"cyan"というワードが設定されています。

</div>

このコンポーネントのテストは次のとおりです:

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" header="app/shared/highlight.directive.spec.ts (selected tests)"></code-example>

いくつか注目に値するテクニックがあります:

- `By.directive`述部は、_要素の型が不明な場合_にこのディレクティブをもつ要素を取得するための優れた方法です。

- `By.css('h2：not([highlight])')`内の<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not">`:not`疑似クラス</a>は、
  ディレクティブを持たない`<h2>`要素を見つけるのに役立ちます。
  `By.css('*：not([highlight])')`は、ディレクティブを持たない要素を検出します。

- `DebugElement.styles`は、`DebugElement`抽象化のおかげで、実際のブラウザがなくても要素のスタイルにアクセスできます。
  しかし、抽象化よりも簡単で明快な場合は、`nativeElement`の利用を遠慮しないでください。

- Angularは、それが適用されている要素のインジェクターにディレクティブを追加します。
  デフォルトカラーのテストでは、
  `HighlightDirective`インスタンスの`defaultColor`を取得するために2番目の`<h2>`のインジェクターを使用しています。

- `DebugElement.properties`は、ディレクティブによって設定された人工的なカスタムプロパティへのアクセスを提供します。

<hr>

## パイプのテスト

パイプはAngularのテストユーティリティなしで簡単にテストできます。

パイプクラスには、
入力値を変換された出力値に操作する`transform`というメソッドがあります。
`transform`の実装は、
DOMとのやりとりがほとんどありません。
ほとんどのパイプはAngularの`@Pipe`メタデータとそのインターフェース以外に依存しません。

各単語の最初の文字を大文字にする`TitleCasePipe`を考えてみましょう。
次は、正規表現を使った素朴な実装です。

<code-example path="testing/src/app/shared/title-case.pipe.ts" header="app/shared/title-case.pipe.ts"></code-example>

正規表現を使用するものはすべて、十分にテストする価値があります。
シンプルにJasmineを使用して、期待されるケースとエッジケースを調べます。

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" header="app/shared/title-case.pipe.spec.ts"></code-example>

{@a write-tests}

#### DOMのテストも書く

これらは、パイプを_単独_でテストします。
`TitleCasePipe`がアプリケーションのコンポーネントに正しく適用されているかどうかはわかりません。

次のようなコンポーネントテストを追加することを検討してください:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

{@a test-debugging}

## テストのデバッグ

アプリケーションをデバッグするのと同じ方法で、ブラウザ内のスペックをデバッグします。

1. Karmaのブラウザウィンドウを表示します（前に隠れています）。
1. **DEBUG**ボタンをクリックします。新しいブラウザタブが開き、テストを再実行します。
1. ブラウザの開発者ツール（Windowsでは`Ctrl-Shift-I`、macOSでは`Command-Option-I`）を開きます。
1. "sources"セクションを選択します。
1. `1st.spec.ts`テストファイル（Control/Command-Pを押して、その後にファイル名を入力してください）を開きます。
1. テストにブレークポイントをセットします。
1. ブラウザを更新すると、ブレークポイントで停止します。

<div class="lightbox">
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma debugging">
</div>

<hr>

{@a atu-apis}

## テスティングユーティリティAPI

このセクションでは、もっとも有用なAngularテスト機能の一覧を取り上げ、その機能を要約します。

Angular テスティングユーティリティには、`TestBed`、`ComponentFixture`、およびテスト環境を制御するいくつかの関数が含まれています。
[_TestBed_](#testbed-api-summary)クラスと[_ComponentFixture_](#component-fixture-api-summary)クラスは別々に扱います。

次では、役に立ちそうな順でスタンドアロン関数の概要を説明します:

<table>
  <tr>
    <th>
      関数
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>async</code>
    </td>

    <td>

    特別な_asyncテストゾーン_内でテスト（`it`）またはセットアップ（`beforeEach`）関数の本体を実行します。
    [上記の説明](#async)を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>fakeAsync</code>
    </td>

    <td>

      特別な_fakeAsyncテストゾーン_内でテストの本体(`it`)を実行し、線形コントロールフローのコーディングスタイルを可能にします。
      [上記の説明](#fake-async)を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>tick</code>
    </td>

    <td>

      _fakeAsyncテストゾーン_内の_タイマー_と_マイクロタスク_キューの両方をフラッシュすることにより、
      時間の経過と非同期処理の完了をシミュレートします。

      <div class="alert is-helpful">

      好奇心を持った読者は、
      この長いブログ記事["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)を楽しめるかもしれません。

      </div>

      仮想クロックを指定されたミリ秒数だけ前進させ、
      その時間枠内でスケジュールされた非同期アクティビティをクリアするオプションの引数を受け入れます。
      [上記の説明](#tick)
      を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
       <code>inject</code>
    </td>

    <td>

      現在の`TestBed`インジェクターから1つ以上のサービスをテスト関数に注入します。
      コンポーネント自身によって提供されるサービスを注入することはできません。
      [debugElement.injector](#get-injected-services)の説明を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>discardPeriodicTasks</code>
    </td>

    <td>

      `fakeAsync()`テストが保留中のタイマーイベント_タスク_（キューされた`setTimeOut`および`setInterval`コールバック）を持ったまま終了すると、
      テストは失敗し、明確なエラーメッセージが表示されます。

      一般に、テストはキューにタスクが入っていない状態で終了する必要があります。
      保留中のタイマータスクが予測される場合は、
      _タスク_キューをフラッシュするために`discardPeriodicTasks`を呼び出してエラーを回避してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>flushMicrotasks</code>
    </td>

    <td>

      `fakeAsync()`テストが未解決のPromiseなどの保留中の_マイクロタスク_を持ったまま終了すると、
      テストは失敗し、明確なエラーメッセージが表示されます。

      一般に、テストはマイクロタスクが完了するのを待つべきです。
      保留中のマイクロタスクが予想される場合は、
      _マイクロタスク_キューをフラッシュするために`flushMicrotasks`を呼び出してエラーを回避してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>ComponentFixtureAutoDetect</code>
    </td>

    <td>

      [自動変更検知](#automatic-change-detection)を有効にする、サービスのプロバイダートークン。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>getTestBed</code>
    </td>

    <td>

      `TestBed`の現在のインスタンスを取得します。
      通常、`TestBed`クラスの静的クラスメソッドで十分です。
      `TestBed`インスタンスは、
      静的メソッドとしては使用できない(ほとんど使用されない)メンバーを公開します。

    </td>
  </tr>
</table>

<hr>

{@a testbed-class-summary}

#### _TestBed_ クラスの概要

`TestBed`クラスは、主要なAngularテストユーティリティの1つです。
そのAPIは巨大で、
あなたがそれを調べるまで少しの時間で圧倒されるかもしれません。
完全なAPIを吸収しようとする前に、まずこのガイドの最初の部分を読んで基礎を理解してください。

`configureTestingModule`に渡されるモジュール定義は、
`@NgModule`メタデータプロパティのサブセットです。

<code-example language="javascript">
  type TestModuleMetadata = {
    providers?: any[];
    declarations?: any[];
    imports?: any[];
    schemas?: Array&lt;SchemaMetadata | any[]&gt;;
  };
</code-example>

{@a metadata-override-object}

各オーバーライドメソッドは`MetadataOverride<T>`を受け取ります。
ここで、`T`はメソッドに適したメタデータの種類、
つまり`@NgModule`、`@Component`、`@Directive`、または`@Pipe`のパラメータです。

<code-example language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

{@a testbed-methods}
{@a testbed-api-summary}

`TestBed` APIは、`TestBed`の_グローバル_インスタンスを更新または参照する静的クラスメソッドで構成されています。

内部的には、すべての静的メソッドは、現在のランタイムの`TestBed`インスタンスのメソッドをカバーします。
これは、`getTestBed()`関数によって返されます。

`beforeEach()`_内_で`TestBed`メソッドを呼び出して、個々のテストの初期化を確実にしてください。

役に立ちそうな順に、もっとも重要な静的メソッドを説明します。

<table>
  <tr>
    <th>
      メソッド
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>configureTestingModule</code>
    </td>

    <td>

      テストシム（`karma-test-shim`、`browser-test-shim`）は、
      [初期テスト環境](guide/testing)とデフォルトテストモジュールを構築します。
      デフォルトのテストモジュールは、すべてのテスターが必要とする基本的な宣言といくつかのAngularサービスの代替で構成されています。

      `configureTestingModule`を呼び出すと、インポート、宣言（コンポーネント、ディレクティブ、パイプ）、
      およびプロバイダーの追加と削除を行い、特定のテストセットのためにテストモジュールの構成を絞り込むことができます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>compileComponents</code>
    </td>

    <td>

      テストモジュールの構成が完了したら、テストモジュールを非同期でコンパイルします。
      コンポーネントテンプレートとスタイルファイルの取得は必ず非同期であるため、
      テストモジュールコンポーネントの_いずれか_に`templateUrl`または`styleUrls`がある場合は、このメソッドを呼び出す**必要があります**。
      [上記](#compile-components)を参照してください。

      `compileComponents`を呼び出した後、`TestBed`の構成は現在のスペックの期間中フリーズされます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>createComponent&lt;T&gt;</code>
    </td>

    <td>

      現在の`TestBed`構成に基づいて、タイプ`T`のコンポーネントのインスタンスを作成します。
      `compileComponent`を呼び出した後、`TestBed`設定は現在のスペックの期間中フリーズされます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideModule</code>
    </td>
    <td>

      指定された`NgModule`のメタデータを置き換えます。モジュールは他のモジュールをインポートできることを思い出してください。
      `overrideModule`メソッドは、これらの内部モジュールの1つを変更するために、
      現在のテストモジュールに深くリーチすることができます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideComponent</code>
    </td>

    <td>

      指定されたコンポーネントクラスのメタデータを置き換えます。
      内部モジュールの深くネストしたコンポーネントでも可能です。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideDirective</code>
    </td>

    <td>

      指定されたディレクティブクラスのメタデータを置き換えます。
      内部モジュールの深くネストしたディレクティブでも可能です。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overridePipe</code>
    </td>
    <td>

      指定されたパイプクラスのメタデータを置き換えます。
      内部モジュールの深くネストしたパイプでも可能です。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-inject}
      <code>inject</code>
    </td>

    <td>

      現在の`TestBed`インジェクターからサービスを取得します。

      `inject`関数は、この用途で使用するとき、多くの場合で適切です。
      しかし、`inject`がサービスを提供できない場合は、エラーをスローします。

      サービスがオプショナルな場合はどうなるでしょうか?

      `TestBed.inject()`メソッドはオプショナルな第2引数を受け取ります。
      これはAngularがプロバイダーを見つけることができない場合に返すオブジェクトです
      （この例では`null`）:

      <code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="testbed-get-w-null" header="app/demo/demo.testbed.spec.ts"></code-example>

      `TestBed.inject`を呼び出した後、`TestBed`の構成は現在のスペックの期間中フリーズします。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-initTestEnvironment}
      <code>initTestEnvironment</code>
    </td>
    <td>

      テスト実行全体のテスト環境を初期化します。

      テストシム（`karma-test-shim`, `browser-test-shim`）がそれを呼び出してくれるので、
      それを自分で呼び出す理由はめったにありません。

      このメソッドを_1回だけ_呼び出すことができます。
      テストの実行中にこのデフォルトを変更する必要がある場合は、最初に`resetTestEnvironment`を呼び出してください。

      Angularコンパイラファクトリー、`PlatformRef`、およびデフォルトのAngularテストモジュールを指定してください。
      非ブラウザプラットフォームでの代替手段は、
      一般的な形式、`@angular/platform-<platform_name>/testing/<platform_name>`で利用できます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>resetTestEnvironment</code>
    </td>
    <td>

      デフォルトテストモジュールを含む初期のテスト環境をリセットします。

    </td>
  </tr>
</table

いくつかの`TestBed`インスタンスメソッドは静的な`TestBed`クラスメソッドがカバーしていないものです。
これらはほとんど必要ありません。

{@a component-fixture-api-summary}

#### _ComponentFixture_

`TestBed.createComponent<T>`は、
コンポーネント`T`のインスタンスを作成し、
そのコンポーネントに対して強く型付けされた`ComponentFixture`を返します。

`ComponentFixture`のプロパティとメソッドは、コンポーネント、そのDOM表現、
およびAngularの環境側面へのアクセスを提供します。

{@a component-fixture-properties}

#### _ComponentFixture_ プロパティ

テスターのためのもっとも重要なプロパティを役に立ちそうな順で紹介します。

<table>
  <tr>
    <th>
      プロパティ
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      `TestBed.createComponent`によって作成されたコンポーネントクラスのインスタンスです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>debugElement</code>
    </td>

    <td>

      コンポーネントのルート要素に関連付けられた`DebugElement`。

      `debugElement`は、テストおよびデバッグ中に、コンポーネントとそのDOM要素を把握する手がかりになります。
      これはテスターにとって重要な特性です。 最も興味深いメンバーは[以下](#debug-element-details)でカバーされています。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      コンポーネントのルートにあるネイティブなDOM要素。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>changeDetectorRef</code>
    </td>

    <td>

      コンポーネントの`ChangeDetectorRef`。

      `ChangeDetectionRef`は、
      `ChangeDetectionStrategy.OnPush`メソッドを持つコンポーネントをテストする場合や、
      コンポーネントの変更検知があなたのプログラマティックな制御下である場合に最も効果的です。

    </td>
  </tr>
</table>

{@a component-fixture-methods}

#### _ComponentFixture_ メソッド

_フィクスチャー_のメソッドにより、Angularはコンポーネントツリー上で特定のタスクを実行します。
シミュレートされたユーザーアクションに応答してAngularの動作をトリガーするためにこれらのメソッドを呼び出してください。

テスターにとってもっとも有用なメソッドは次のとおりです。

<table>
  <tr>
    <th>
      メソッド
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>detectChanges</code>
    </td>

    <td>

      コンポーネントの変更検知サイクルをトリガーします。

      コンポーネントを初期化するため（`ngOnInit`を呼び出します）、
      またはテストコードでコンポーネントのデータバウンドプロパティ値を変更したあとに呼び出してください。
      Angularは、`personComponent.name`を変更したことを認識できません。
      また、`detectChanges`を呼び出すまで、`name`のバインディングは更新されません。

      `detectChanges(false)`として呼び出さない場合、
      循環更新を確認するためにあとで `checkNoChanges` を実行してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>autoDetectChanges</code>
    </td>

    <td>

      これを`true`に設定すると、フィクスチャーは自動的に変更を検知します。

      自動検知が`true`の場合、
      テストフィクスチャーはコンポーネントの作成直後に暗黙的に`detectChanges`を呼び出します。
      そのあと、関連するゾーンイベントをリッスンし、それに応じて`detectChanges`を呼び出します。
      テストコードがコンポーネントのプロパティ値を直接変更するときは、
      おそらく`fixture.detectChanges`を呼び出してデータバインディングの更新をトリガーする必要があります。

      デフォルトは`false`です。
      テストの動作を細かく制御することを好むテスターは、`false`のままにする傾向があります。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>checkNoChanges</code>
    </td>

    <td>

      保留中の変更がないことを確認するために変更検知を実行します。 ある場合は例外をスローします。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>isStable</code>
    </td>

    <td>

      フィクスチャーが現在_安定_している場合は`true`を返します。
      完了していない非同期タスクがある場合は`false`を返します。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>whenStable</code>
    </td>

    <td>

      フィクスチャーが安定しているときに解決するPromiseを返します。

      非同期アクティビティまたは非同期変更検知が完了した後でテストを再開するには、
      そのPromiseをフックしてください。
      [上記](#when-stable)を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>destroy</code>
    </td>

    <td>

      コンポーネントの破棄をトリガーします。

    </td>
  </tr>
</table>

{@a debug-element-details}

#### _DebugElement_

`DebugElement`は、コンポーネントのDOM表現を把握する重要な手がかりになります。

`fixture.debugElement`によって返されたテストルートコンポーネントの`DebugElement`から、
フィクスチャーの要素およびコンポーネントのサブツリー全体を走査（およびクエリ）することができます。

次は、テスターにとってもっとも有用な`DebugElement`メンバーです。おおよそ役に立つ順番です:

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

      ブラウザ内の対応するDOM要素（WebWorkersの場合はnull）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>query</code>
    </td>

    <td>

      `query(predicate: Predicate<DebugElement>)`を呼び出すと、
      サブツリー内の任意の深さの[predicate](#query-predicate)にマッチする最初の`DebugElement`を返します。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>queryAll</code>
    </td>

    <td>

      `queryAll(predicate: Predicate<DebugElement>)`を呼び出すと、
      サブツリー内の任意の深さの[predicate](#query-predicate)にマッチするすべての`DebugElement`が返されます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>injector</code>
    </td>

    <td>

      ホストの依存性のインジェクター。
      たとえば、ルート要素のコンポーネントインスタンスインジェクターなどです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      要素自身のコンポーネントインスタンス（存在する場合）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>context</code>
    </td>

    <td>

      この要素の親コンテキストを提供するオブジェクト。
      この要素を管理する祖先コンポーネントインスタンスであることが多いです。

      要素が`*ngFor`内で繰り返されている場合、
      コンテキストは`$implicit`プロパティが行のインスタンス値の値である`NgForRow`です。
      例えば、`*ngFor="let hero of heroes"`内の`hero`がそうです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>children</code>
    </td>

    <td>

      直接の`DebugElement`の子です。`children`を通してツリーをたどってください。

      <div class="alert is-helpful">

      `DebugElement`には、`DebugNode`オブジェクトのリストである`childNodes`もあります。
      `DebugElement`は`DebugNode`オブジェクトから派生し、
      要素より多くのノードを持ちます。テスターは通常、プレーンなノードを無視できます。

      </div>
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>parent</code>
    </td>
    <td>

      `DebugElement`の親です。これがルート要素の場合はnullです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>name</code>
    </td>

    <td>

      要素タグ名（要素の場合）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>triggerEventHandler</code>
    </td>
    <td>

      指定した名前に対応するリスナーが、要素の`listeners`コレクション内にある場合、
      その名前でイベントをトリガーします。
      2番目のパラメータは、ハンドラが期待する_イベントオブジェクト_です。
      [上記](#trigger-event-handler)を参照してください。

      イベントにリスナーがない場合やその他の問題がある場合は、
      `nativeElement.dispatchEvent(eventObject)`を呼び出すことを検討してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>listeners</code>
    </td>

    <td>

      コンポーネントの`@Output`プロパティおよび/または要素のイベントプロパティに関連付けられたコールバック。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>providerTokens</code>
    </td>

    <td>

      このコンポーネントのインジェクタールックアップトークン。
      コンポーネント自体とコンポーネントが持つ`providers`メタデータ内のトークンが含まれます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>source</code>
    </td>

    <td>

      ソースコンポーネントテンプレート内のこの要素を見つける場所。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>references</code>
    </td>

    <td>

      テンプレートローカル変数（例：`#foo`）に関連付けられたオブジェクトの辞書。
      ローカル変数名をキーとしています。

    </td>
  </tr>
</table>

{@a query-predicate}

`DebugElement.query(predicate)` および`DebugElement.queryAll(predicate)`メソッドは、
`DebugElement`とマッチするようにソース要素のサブツリーをフィルタする述語を受け取ります。

述語は、`DebugElement`を受け取り、_truthy_な値を返す任意のメソッドです。
次の例では、"content"という名前のテンプレートローカル変数への参照を含むすべての`DebugElement`
が検索されます:

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="custom-predicate" header="app/demo/demo.testbed.spec.ts"></code-example>

Angularの`By`クラスには、共通述語の静的メソッドが3つあります。

- `By.all` - すべての要素を返します。
- `By.css(selector)` - マッチするCSSセレクターをもつ要素を返します。
- `By.directive(directive)` - ディレクティブクラスのインスタンスにマッチするAngularの要素を返します。

<code-example path="testing/src/app/hero/hero-list.component.spec.ts" region="by" header="app/hero/hero-list.component.spec.ts"></code-example>

<hr>

{@a faq}

## FAQ

{@a q-spec-file-location}

#### スペックファイルをテストするファイルの隣に置くのはなぜですか？

ユニットテストのスペックファイルは、テストするアプリケーションソースコードファイルと同じフォルダに置くことをお勧めします。

- そのようなテストは簡単に見つけることができます。
- アプリケーションの一部にテストがないかどうかを一目で確認できます。
- 近くにテストがあることで、部品がコンテキスト内でどのように動作するかを明らかにすることができます。
- あなたがソースを移動するときは、（必然的に）テストを移動することを忘れません。
- ソースファイルの名前を変更するときは、（必然的に）テストファイルの名前を変更することを忘れません。

<hr>

{@a q-specs-in-test-folder}

#### テストフォルダにスペックを入れるのはいつですか？

アプリケーションの統合的なスペックでは、
フォルダやモジュールに分散された複数のパーツの相互作用をテストできます。
それらは本当に特にどの部分にも属していないので、
1つのファイルの隣のような自然な置き場所がありません。

`tests`ディレクトリに適切なフォルダを作成する方がよい場合があります。

もちろん、テストヘルパーをテストするスペックは、
`test`フォルダ内の対応するヘルパーファイルの隣に置くほうがよいでしょう。

{@a q-e2e}

#### なぜDOM統合のE2Eテストに頼らないのでしょうか？

このガイドで説明されているコンポーネントのDOMテストでは、
多くの場合、広範な設定と高度な技術が必要ですが、
[ユニットテスト](#component-class-testing)は比較的簡単です。

#### なぜDOMの統合テストをエンドツーエンド（E2E）テストに任せないのですか？

E2Eテストは、システム全体の高レベルな検証に最適です。
しかし、ユニットテストで期待されるような包括的なテストカバレッジを与えることはできません。

E2Eテストは、ユニットテストに比べて書き込みや実行が難しいです。
頻繁に、破損した場所から遠く離れた変化また不作法のせいで容易に壊れます、

E2Eテストでは、データの欠落や不良、接続の切断、リモートサービスの障害など、
問題が発生したときにコンポーネントがどのように動作するかを簡単には明らかにできません。

データベースを更新したり、請求書を送信したり、
クレジットカードに請求したりするアプリのE2Eテストでは、
リモートリソースの偶発的な破損を防ぐために特殊なトリックとバックドアが必要です。
テストしたいコンポーネントにナビゲートすることが難しい場合もあります。

これらの多くの障害のために、
DOMテストの相互作用を可能な限りユニットテストで行う必要があります。
