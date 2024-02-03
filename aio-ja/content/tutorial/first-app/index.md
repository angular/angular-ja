# はじめてのAngularアプリケーションを作ろう

このチュートリアルは、Angular でコーディングを始めるために知っておくべき Angular の概念を紹介するレッスンで構成されています。

あなたが望む分だけやってもいいですし、どんな順番でやってもかまいません。

## 始める前に

このチュートリアルを最大限に活用するには、成功するために必要なこれらのものがあることを確認してください。

<!-- markdownLint-disable MD001 -->

### 経験

このチュートリアルのレッスンは、あなたが次の経験を持っていることを前提としています:

1.  HTML を直接編集して、HTML の Web ページを作成したことがある
1.  JavaScript で Web サイトのコンテンツをプログラミングしたことがある
1.  Cascading Style Sheet （CSS） の内容を読んだことがあり、セレクターの使い方を理解している
1.  コンピュータでタスクを実行するためのコマンドライン命令を使用している

### 使用するもの

これらのレッスンは、Angular ツールのローカルインストールを使用するか、ウェブブラウザで StackBlitz を使用して完了することができます。ローカルでの Angular 開発は、Windows、MacOS、Linux ベースのシステムで完了できます。

## はじめての Angular アプリケーションのコンセプトプレビュー

このチュートリアルのレッスンでは、賃貸住宅をリストアップし、個々の住宅の詳細を表示するシンプルな Angular アプリケーションを作成します。
このアプリケーションは、多くの Angular アプリケーションに共通する機能を使用しています。
<section class="lightbox">
  <img alt="Output of heroes dashboard" src="generated/images/guide/faa/homes-app-landing-page.png">
</section>

## ローカル開発環境

このチュートリアルに使用するコンピュータのコマンドラインツールで、次の手順を実行します。

## ステップ 1 - Angular が必要とする `node.js` のバージョンの特定

Angular は Node のアクティブ LTS 版またはメンテナンス LTS 版が必要です。`node.js` のバージョンを確認しましょう。特定のバージョンの要件については、[package.json ファイル](https://unpkg.com/browse/@angular/core@15.1.5/package.json)の engines プロパティを参照してください。

**ターミナル**ウィンドウから:
1. 次のコマンドを実行: `node --version`
1. 表示されたバージョン番号が条件を満たしていることを確認

## ステップ 2 - Angular 用の正しいバージョンの node.js をインストール

`node.js` のバージョンがインストールされていない場合は、[nodejs.org のインストール方法](https://nodejs.org/en/download/)にしたがってください。


## ステップ 3 - Angular の最新版をインストール

`node.js` と `npm` がインストールされたら、次は Angular を効果的に開発するためのツールを提供する[Angular CLI](/cli)をインストールします。

**ターミナル**ウィンドウから次のコマンドを実行します: `npm install -g @angular/cli`

## ステップ 4 - 統合開発環境(IDE)のインストール

Angular アプリケーションの構築には好みのツールを自由にお使いください。私たちは以下を推奨しています:

1. [Visual Studio Code](https://code.visualstudio.com/)
2. オプションですが、推奨されるステップとして、[Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)をインストールすることで、開発者体験をさらに向上させることができます。

## レッスンの復習

このレッスンでは、このチュートリアルで構築するアプリケーションについて学び、Angular アプリケーションを開発するためにローカルコンピュータを準備しました。

## 次のステップ

* [First Angular app lesson 1 - Hello world](tutorial/first-app/first-app-lesson-01)

## より詳しい情報

このレッスンで扱うトピックの詳細については、こちらをご覧ください

* [What is Angular](/guide/what-is-angular)
* [Angular CLI Reference](/cli)

@reviewed 2023-07-12
