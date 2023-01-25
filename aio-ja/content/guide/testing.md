<a id="top"></a>

{@searchKeywords test testing karma jasmine coverage}

# テスト

Angularアプリケーションをテストすると、アプリケーションが期待どおりに動作していることを確認できます。

## Prerequisites

Before writing tests for your Angular app, you should have a basic understanding of the following concepts:

*   [Angularの基礎](guide/architecture)
*   [JavaScript](https://javascript.info/)
*   HTML
*   CSS
*   [Angular CLI](/cli)

The testing documentation offers tips and techniques for unit and integration testing Angular applications through a sample application created with the [Angular CLI](cli).
This sample application is much like the one in the [_Tour of Heroes_ tutorial](tutorial/tour-of-heroes).

<div class="alert is-helpful">

  If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

</div>

<a id="setup"></a>

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

<code-example format="shell" language="shell">

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

</code-example>

The last line of the log shows that Karma ran three tests that all passed.

The test output is displayed in the browser using [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

<div class="lightbox">

<img alt="Jasmine HTML Reporter in the browser" src="generated/images/guide/testing/initial-jasmine-html-reporter.png">

</div>

テスト行をクリックしてそのテストだけを再実行したり、説明をクリックして選択したテストグループ("test suite")を再実行することができます。

同時に、`ng test`コマンドは変更を監視しています。

このアクションを確認するために`app.component.ts`に小さな変更を加えて保存してみましょう。
テストが再び実行され、ブラウザが更新されます。そして新しいテストの結果が表示されます。

## 設定 {@a configuration}

The Angular CLI takes care of Jasmine and Karma configuration for you. It constructs the full configuration in memory, based on options specified in the `angular.json` file.

If you want to customize Karma, you can create a `karma.conf.js` by running the following command:

<code-example format="shell" language="shell">

ng generate config karma

</code-example>

<div class="alert is-helpful">

Read more about Karma configuration in the [Karma configuration guide](http://karma-runner.github.io/6.4/config/configuration-file.html).

</div>

### 他のテストフレームワーク

他のテスティングライブラリとテストランナーでAngularアプリケーションのユニットテストを行うこともできます。
各ライブラリとランナーはそれぞれ独自のインストール手順、設定、および構文を持ちます。

### テストファイルの名前と場所

Inside the `src/app` folder the Angular CLI generated a test file for the `AppComponent` named `app.component.spec.ts`.

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

## 継続的インテグレーションでのテスト

プロジェクトのバグをなくす最善の方法の1つはテストスイートを通すことですが、いつもテストを実行するというのは簡単に忘れます。

継続的インテグレーション(CI)サーバーを使用すると、プロジェクトのリポジトリーでコミットおよびプルリクエストをするたびにテストを実行できるように設定できます。

Angular CLIアプリケーションを継続的インテグレーションでテストするために、次のコマンドを実行します。

<code-example format="shell" language="shell">

ng test --no-watch --no-progress

</code-example>

## More information on testing

After you've set up your application for testing, you might find the following testing guides useful.

|                                                                    | Details |
|:---                                                                |:---     |
| [Code coverage](guide/testing-code-coverage)                       | How much of your app your tests are covering and how to specify required amounts. |
| [Testing services](guide/testing-services)                         | How to test the services your application uses.                                   |
| [Basics of testing components](guide/testing-components-basics)    | Basics of testing Angular components.                                             |
| [Component testing scenarios](guide/testing-components-scenarios)  | Various kinds of component testing scenarios and use cases.                       |
| [Testing attribute directives](guide/testing-attribute-directives) | How to test your attribute directives.                                            |
| [Testing pipes](guide/testing-pipes)                               | How to test pipes.                                                                |
| [Debugging tests](guide/test-debugging)                            | Common testing bugs.                                                              |
| [Testing utility APIs](guide/testing-utility-apis)                 | Angular testing features.                                                         |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-01-17
