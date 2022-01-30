{@a top}

# テスト

Angularアプリケーションをテストすると、アプリケーションが期待どおりに動作していることを確認できます。

## Prerequisites

Before writing tests for your Angular app, you should have a basic understanding of the following concepts:

* Angular fundamentals
* JavaScript
* HTML
* CSS
* [Angular CLI](/cli)

<hr>

The testing documentation offers tips and techniques for unit and integration testing Angular applications through a sample application created with the [Angular CLI](cli).
This sample application is much like the one in the [_Tour of Heroes_ tutorial](tutorial).

<div class="alert is-helpful">

  If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

</div>

{@a setup}

## セットアップ {@a set-up-testing}

Angular CLIは[Jasmineテストフレームワーク](https://jasmine.github.io/) を使用してAngularアプリケーションのテストを行うために必要なものすべてをダウンロードしてインストールします。

CLIで作成したプロジェクトは、すぐにテストする準備ができています。
[`ng test`](cli/test)CLIコマンドを実行するだけです:

<code-example language="sh">
  ng test
</code-example>

`ng test`コマンドはアプリケーションを_ウォッチモード_でビルドし、
[Karmaテストランナー](https://karma-runner.github.io)を起動します。

コンソールのアウトプットは次のようになります:

<code-example language="sh">
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

## 設定

CLIはJasmineとKarmaの設定を引き受けてくれます。

プロジェクトルートフォルダ内の`karma.conf.js`と`src/`フォルダ内の`test.ts`ファイルを編集することで
多くのオプションの微調整ができます。

`karma.conf.js`は部分的なKarma設定ファイルです。
CLIは`angular.json`内で指定されたアプリケーション構造をベースとして、`karma.conf.js`で補完をして、メモリ内にすべてのランタイムの設定を構築します。

JasmineとKarmaの設定の詳細についてはWebで検索してください。

### 他のテストフレームワーク

他のテスティングライブラリとテストランナーでAngularアプリケーションのユニットテストを行うこともできます。
各ライブラリとランナーはそれぞれ独自のインストール手順、設定、および構文を持ちます。

詳細についてはWebで検索してください。

### テストファイルの名前と場所

`src/app`フォルダ内部をみてください。

CLIは`AppComponent`のテストとして`app.component.spec.ts`という名前のテストファイルを生成しました。

<div class="alert is-important">

ツールがテストに使用するファイル(または、_スペック_ファイル)だと識別できるように、テストファイルの拡張子は**`.spec.ts`でないといけません**。

</div>

`app.component.ts`と`app.component.spec.ts`ファイルは同じフォルダ内に置きます。
ルートのファイル名(`app.component`の部分)は双方のファイルで同じにします。

あなた自身のプロジェクトの_すべての種類_のテストファイルにおいてこれら2つの慣習を採用してください。

{@a q-spec-file-location}

#### スペックファイルはテストするファイルの隣に置く

ユニットテストのスペックファイルは、
テストするアプリケーションソースコードファイルと同じフォルダに置くことをお勧めします。

- そのようなテストは簡単に見つけることができます。
- アプリケーションの一部にテストがないかどうかを一目で確認できます。
- 近くにテストがあることで、部品がコンテキスト内でどのように動作するかを明らかにすることができます。
- あなたがソースを移動するときは、（必然的に）テストを移動することを忘れません。
- ソースファイルの名前を変更するときは、（必然的に）テストファイルの名前を変更することを忘れません。

{@a q-specs-in-test-folder}

#### テストフォルダにスペックを入れる

アプリケーションの統合的なスペックでは、
フォルダやモジュールに分散された複数のパーツの相互作用をテストできます。
それらは本当に特にどの部分にも属していないので、
1つのファイルの隣のような自然な置き場所がありません。

`tests`ディレクトリに適切なフォルダを作成する方がよい場合があります。

もちろん、テストヘルパーをテストするスペックは、
`test`フォルダ内の対応するヘルパーファイルの隣に置くほうがよいでしょう。


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
language: node_js
node_js:
  - "10"

addons:
  chrome: stable

cache:
  directories:
     - ./node_modules

install:
  - npm install

script:
  - npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
```

TravisではChromeが付属していないため、代わりにChromiumを使用していることを除いて、Circle CIの設定と同じものです。

ステップ 2: 変更をコミットし、リポジトリにプッシュします。

ステップ 3: [Travis CIにサインアップ](https://travis-ci.org/auth)して、[あなたのプロジェクトを追加](https://travis-ci.org/profile)します。
ビルドをトリガーするために新しいコミットをプッシュする必要があるでしょう。

* Travis CIでのテストの詳細については[Travis CI documentation](https://docs.travis-ci.com/)を参照してください。

### Configure project for GitLab CI

Step 1: Create a file called `.gitlab-ci.yml` at the project root, with the following content:

```
image: node:14.15-stretch
variables:
  FF_USE_FASTZIP: "true"

cache:
  untracked: true
  policy: push
  key: ${CI_COMMIT_SHORT_SHA}
  paths:
    - node_modules/

.pull_cached_node_modules:
  cache:
    untracked: true
    key: ${CI_COMMIT_SHORT_SHA}
    policy: pull

stages:
  - setup
  - test

install:
  stage: setup
  script:
    - npm ci

test:
  stage: test
  extends: .pull_cached_node_modules
  before_script:
    - apt-get update
    - wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    - apt install -y ./google-chrome*.deb;
    - export CHROME_BIN=/usr/bin/google-chrome
  script:
    - npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
```

This configuration caches `node_modules/` in the `install` job and re-uses the cached `node_modules/` in the `test` job.

Step 2: [Sign up for GitLab CI](https://gitlab.com/users/sign_in) and [add your project](https://gitlab.com/projects/new).
You'll need to push a new commit to trigger a build.

Step 3: Commit your changes and push them to your repository.

* Learn more about GitLab CI testing from [GitLab CI/CD documentation](https://docs.gitlab.com/ee/ci/).

### Configure project for GitHub Actions

Step 1: Create a folder called `.github/workflows` at root of your project

Step 2: In the new folder, create a file called `main.yml` with the following content:

```yml
name: CI Angular app through Github Actions
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          node-version: 14.x

      - name: Setup
        run: npm ci

      - name: Test
        run: |
          npm test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
```

Step 3: [Sign up for GitHub](https://github.com/join) and [add your project](https://github.com/new). You'll need to push a new commit to trigger a build.

Step 4: Commit your changes and push them to your repository.

* Learn more about GitHub Actions from [GitHub Actions documentation](https://docs.github.com/en/actions).

### ChromeでのCIテスト用にCLIを設定する

一般的にCLIコマンドの`ng test`があなたの環境でCIテストを実行している間、Chromeブラウザでのテストを実行するために設定を調整する必要があります。

[Karma JavaScriptテストランナー](https://karma-runner.github.io/latest/config/configuration-file.html)の設定ファイルについて、
サンドボックス化を使用せずにChromeを起動するように調整する必要があります。

この例では[ヘッドレスChrome](https://developers.google.com/web/updates/2017/04/headless-chrome#cli) を使用します。

* Karma設定ファイル、`karma.conf.js`のbrowsersの下にChromeHeadlessCIというカスタムランチャーを追加します:
```
browsers: ['ChromeHeadlessCI'],
customLaunchers: {
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
```

これで、`--no-sandbox`フラグを使用するために次のコマンドを実行できます:

<code-example language="sh">
  ng test --no-watch --no-progress --browsers=ChromeHeadlessCI
</code-example>

<div class="alert is-helpful">

   **Note:** 現時点では、Windows上で実行する場合は`--disable-gpu`フラグを含める必要があるでしょう。[crbug.com/737678](https://crbug.com/737678)を参照してください。

</div>


## More info on testing

After you've set up your app for testing, you may find the following testing  guides useful.

* [Code coverage](guide/testing-code-coverage)&mdash;find out how much of your app your tests are covering and how to specify required amounts.
* [Testing services](guide/testing-services)&mdash;learn how to test the services your app uses.
* [Basics of testing components](guide/testing-components-basics)&mdash;discover the basics of testing Angular components.
* [Component testing scenarios](guide/testing-components-scenarios)&mdash;read about the various kinds of component testing scenarios and use cases.
* [Testing attribute directives](guide/testing-attribute-directives)&mdash;learn about how to test your attribute directives.
* [Testing pipes](guide/testing-pipes)&mdash;find out how to test pipes.
* [Debugging tests](guide/test-debugging)&mdash;uncover common testing bugs.
* [Testing utility APIs](guide/testing-utility-apis)&mdash;get familiar with Angular testing features.
