# テスト

Angularアプリケーションをテストすると、アプリケーションが期待どおりに動作していることを確認できます。

## テストの設定

Angular CLIは、[Jasmineテストフレームワーク](https://jasmine.github.io)を使用してAngularアプリケーションをテストするために必要なものをすべてダウンロードしてインストールします。

CLIで作成したプロジェクトは、すぐにテストできます。
[`ng test`](cli/test) CLIコマンドを実行するだけです。

<docs-code language="shell">

ng test

</docs-code>

`ng test`コマンドはアプリケーションを*監視モード*でビルドし、
[Karmaテストランナー](https://karma-runner.github.io)を起動します。

コンソールの出力は次のようになります。

<docs-code language="shell">

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

</docs-code>

ログの最後の行は、Karmaが3つのテストを実行し、すべてが合格したことを示しています。

テスト出力は、[Karma Jasmine HTMLレポーター](https://github.com/dfederm/karma-jasmine-html-reporter)を使用してブラウザに表示されます。

<img alt="Jasmine HTML Reporter in the browser" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

テスト行をクリックしてそのテストのみを再実行するか、説明をクリックして選択したテストグループ（「テストスイート」）のテストを再実行します。

一方、`ng test`コマンドは変更を監視しています。

これが実際にどのように機能するかを確認するには、`app.component.ts`を少し変更して保存します。
テストが再び実行され、ブラウザが更新され、新しいテスト結果が表示されます。

## 設定

Angular CLIは、JasmineとKarmaの設定を処理します。Angular CLIは、`angular.json`ファイルで指定されたオプションに基づいて、メモリ内に完全な設定を構築します。

Karmaをカスタマイズする場合は、次のコマンドを実行して`karma.conf.js`を作成できます。

<docs-code language="shell">

ng generate config karma

</docs-code>

HELPFUL: [Karma設定ガイド](http://karma-runner.github.io/6.4/config/configuration-file.html)でKarmaの設定について詳しく知ることができます。

### その他のテストフレームワーク

Angularアプリケーションは、他のテストライブラリとテストランナーでもユニットテストできます。
各ライブラリとランナーには、それぞれ独自のインストール手順、構成、構文があります。

### テストファイル名と場所

Angular CLIは、`src/app`フォルダ内に`AppComponent`のテストファイルを`app.component.spec.ts`という名前で生成しました。

IMPORTANT: テストファイル拡張子は**`.spec.ts`でなければなりません**。これにより、ツールはファイルをテストを含むファイル（*spec*ファイルとも呼ばれる）として識別できます。

`app.component.ts`と`app.component.spec.ts`ファイルは、同じフォルダ内の兄弟です。
ルートファイル名（`app.component`）は、両方のファイルで同じです。

あらゆる種類のテストファイルに対して、これらの2つの規則を独自のプロジェクトで採用してください。

#### テストするファイルの横にspecファイルを配置する

ユニットテストのspecファイルを、
テストするアプリケーションソースコードファイルと同じフォルダに入れることをお勧めします。

* このようなテストは簡単に検索できます。
* アプリケーションの一部にテストがないかどうかをひと目で確認できます。
* 近くのテストは、一部がコンテキストでどのように機能するかを示すことができます。
* ソースを移動すると（不可避ですが）、テストも移動することを思い出します。
* ソースファイルを名前変更すると（不可避ですが）、テストファイルの名前も変更することを思い出します。

#### specファイルをテストフォルダに配置する

アプリケーションの統合specは、
フォルダとモジュールにまたがる複数の部分の相互作用をテストできます。
それらは、特にどの部分にも属していないため、
特定のファイルの横に自然な場所がありません。

多くの場合、それらに対して`tests`ディレクトリに適切なフォルダを作成する方が良いでしょう。

もちろん、テストヘルパーをテストするspecは、
対応するヘルパーファイルの隣の`test`フォルダに入ります。

## 継続的インテグレーションでのテスト

プロジェクトをバグなしに保つ最良の方法の1つは、テストスイートを使用することですが、常にテストを実行することを忘れてしまうかもしれません。

継続的インテグレーション（CI）サーバーを使用すると、プロジェクトリポジトリを設定して、すべてのコミットとプルリクエストでテストを実行できます。

Angular CLIアプリケーションを継続的インテグレーション（CI）でテストするには、次のコマンドを実行します。

<docs-code language="shell">
ng test --no-watch --no-progress --browsers=ChromeHeadless
</docs-code>

## テストに関する追加情報

アプリケーションのテストを設定したら、次のテストガイドが役立つ場合があります。

|                                                                    | 詳細 |
|:---                                                                |:---     |
| [コードカバレッジ](guide/testing/code-coverage)                       | テストがアプリケーションのどの部分をカバーしているか、および必要な量の指定方法。 |
| [サービスのテスト](guide/testing/services)                         | アプリケーションで使用しているサービスのテスト方法。                                   |
| [コンポーネントのテストの基本](guide/testing/components-basics)    | Angularコンポーネントのテストの基本。                                             |
| [コンポーネントテストシナリオ](guide/testing/components-scenarios)  | さまざまな種類のコンポーネントテストシナリオとユースケース。                       |
| [属性ディレクティブのテスト](guide/testing/attribute-directives) | 属性ディレクティブのテスト方法。                                            |
| [パイプのテスト](guide/testing/pipes)                               | パイプのテスト方法。                                                                |
| [テストのデバッグ](guide/testing/debugging)                            | 一般的なテストのバグ。                                                              |
| [ユーティリティAPIのテスト](guide/testing/utility-apis)                 | Angularのテスト機能。                                                         |
