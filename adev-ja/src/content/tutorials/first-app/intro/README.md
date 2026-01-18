# 最初のAngularアプリケーションをビルドしよう

このチュートリアルはAngularでコーディングを始めるために必要な概念を紹介するレッスンで構成されています。

レッスンの数、順番ともに自由に選べます。

補足: 動画の方が良いですか？このチュートリアルには、[YouTubeのフルコース](https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF&si=1q9889ulHp8VZ0e7)を用意しています！

<docs-video src="https://www.youtube.com/embed/xAT0lHYhHMY?si=cKUW_MGn3MesFT7o"/>

## 開始する前に

このチュートリアルを最大限に活用するために、必要な要件を満たしているか確認してください。

### あなたの経験

このチュートリアルのレッスンは次の経験を想定しています:

1. HTMLを直接編集してwebページを作成したことがある。
1. JavaScriptを使ってwebサイトのコンテンツをプログラミングしたことがある。
1. カスケーディングスタイルシート(CSS)を読み、セレクターの使い方を理解している。
1. コマンドラインを使ってコンピューター上のタスクを実行したことがある。

### あなたの環境

これらのレッスンはローカルにインストールされたAngularのツール、または組み込みエディタのどちらでも進めることができます。ローカルでのAngularの開発は、Windows, MacOSあるいはLinuxベースのシステムで行えます。

注意: このようなアラートに注意してください、ローカルエディタで作業している場合にのみ必要となる手順が示されていることがあります
	
## 最初のAngularアプリケーションの概念プレビュー

このチュートリアルでは賃貸住宅の一覧を表示し、各物件の詳細を表示するAngularアプリケーションを作ります。
このアプリケーションでは、多くのAngularアプリケーションと共通する機能を使用します。

<img alt="Homesランディングページの出力" src="assets/images/tutorials/first-app/homes-app-landing-page.png">

## ローカル開発環境

注意: このステップはローカル環境のみで必要です！

このチュートリアルを実施するために使用するコンピューター上で、コマンドラインツールを使って次の手順を実行してください。

<docs-workflow>

<docs-step title="Angularに必要な`node.js`のバージョンを確認する">
Angularはactive LTSまたはmaintenance LTSバージョンのNode.jsが必要です。お使いの`Node.js`のバージョンを確認しましょう。必要なバージョンの詳細は、[package.json file](https://unpkg.com/browse/@angular/core@15.1.5/package.json)のenginesプロパティを参照してください。

**ターミナル**のウィンドウで:

1. 次のコマンドを実行してください: `node --version`
1. 表示されたバージョンが要件を満たしているか確認してください
   </docs-step>

<docs-step title="Angularに必要とする`node.js`の適切なバージョンをインストールする">
もし`node.js`をインストールしていない場合、[nodejs.orgのインストール方法](https://nodejs.org/ja/download/)を参照してください。
</docs-step>

<docs-step title="Angularの最新バージョンをインストールする">
`node.js`と`npm`がインストールされているならば、Angularの開発を効果的に進めるためのツールである[Angular CLI](tools/cli)をインストールするのが次のステップです。

**ターミナル**ウィンドウで次のコマンドを実行してください: `npm install -g @angular/cli`.
</docs-step>

<docs-step title="統合開発環境をインストールする(IDE)">
Angularでアプリをビルドする際に使用するツールはお好きなものを選んで構いません。以下をおすすめします:

1. [Visual Studio Code](https://code.visualstudio.com/)
2. 任意ですが、開発体験を向上させるために[Angular Language Service]のインストールを推奨します(https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
3. [WebStorm](https://www.jetbrains.com/webstorm/)
   </docs-step>

<docs-step title="任意: AI対応IDEのセットアップ">

お好みのAI対応IDEでこのチュートリアルを進める場合、[Angularのプロンプトルールおよびベストプラクティスをご確認ください](/ai/develop-with-ai)。

</docs-step>

</docs-workflow>

For more information about the topics covered in this lesson, visit:
このレッスンで扱う内容についてさらに知りたい場合は、以下をご覧ください。

<docs-pill-row>
  <docs-pill href="/overview" title="Angularとは"/>
  <docs-pill href="/tools/cli/setup-local" title="ローカル環境とワークスペースのセットアップ"/>
  <docs-pill href="/cli" title="Angular CLIリファレンス"/>
</docs-pill-row>
