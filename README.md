# angular-ja

[![CircleCI](https://circleci.com/gh/angular/angular-ja/tree/master.svg?style=svg)](https://circleci.com/gh/angular/angular-ja/tree/master)

このリポジトリは[Angular](https://github.com/angular/angular)の公式サイト [angular.io](https://angular.io) を日本語に翻訳するためのものです。

現在は https://angular.jp でホストされたサイトを確認できます。

## コントリビューター

<!---begin contributors -->
[<img alt="lacolaco" src="https://avatars3.githubusercontent.com/u/1529180?v=4&s=117" width="117">](https://github.com/lacolaco) |[<img alt="Allajah" src="https://avatars1.githubusercontent.com/u/5627119?v=4&s=117" width="117">](https://github.com/Allajah) |[<img alt="Pittan" src="https://avatars1.githubusercontent.com/u/6269639?v=4&s=117" width="117">](https://github.com/Pittan) |[<img alt="kappy" src="https://avatars3.githubusercontent.com/u/26835913?v=4&s=117" width="117">](https://github.com/kappy) |[<img alt="studioTeaTwo" src="https://avatars3.githubusercontent.com/u/1317305?v=4&s=117" width="117">](https://github.com/studioTeaTwo) |[<img alt="chloe463" src="https://avatars2.githubusercontent.com/u/6651523?v=4&s=117" width="117">](https://github.com/chloe463) |
:---: |:---: |:---: |:---: |:---: |:---: |
[lacolaco](https://github.com/lacolaco) |[Allajah](https://github.com/Allajah) |[Pittan](https://github.com/Pittan) |[kappy](https://github.com/kappy) |[studioTeaTwo](https://github.com/studioTeaTwo) |[chloe463](https://github.com/chloe463) |

[<img alt="imamoto" src="https://avatars2.githubusercontent.com/u/9498383?v=4&s=117" width="117">](https://github.com/imamoto) |[<img alt="shioyang" src="https://avatars0.githubusercontent.com/u/4098243?v=4&s=117" width="117">](https://github.com/shioyang) |[<img alt="MasanobuAkiba" src="https://avatars2.githubusercontent.com/u/7288676?v=4&s=117" width="117">](https://github.com/MasanobuAkiba) |[<img alt="adwd" src="https://avatars2.githubusercontent.com/u/7473222?v=4&s=117" width="117">](https://github.com/adwd) |[<img alt="massa142" src="https://avatars2.githubusercontent.com/u/5918804?v=4&s=117" width="117">](https://github.com/massa142) |
:---: |:---: |:---: |:---: |:---: |
[imamoto](https://github.com/imamoto) |[shioyang](https://github.com/shioyang) |[MasanobuAkiba](https://github.com/MasanobuAkiba) |[adwd](https://github.com/adwd) |[massa142](https://github.com/massa142) |
<!---end contributors -->

## コントリビューション大歓迎！

この翻訳プロジェクトにはみなさんの協力が必要です。
翻訳プロジェクトについての議論は [ng-japan slack](http://slack-invite.ngjapan.org)の `#translation` チャンネルで進行しています。

### やってほしいこと

イシューやプルリクエストをいつでもお待ちしています。

#### ドキュメントの翻訳

翻訳対象のファイルは`aio-ja`ディレクトリ内に管理されています。
まだ日本語化されていない部分についての翻訳にご協力ください

翻訳作業を開始する前に、同じファイルを翻訳しようとしている人がいないかどうかを確認しましょう。
[Translation Checkout](https://github.com/angular/angular-ja/labels/type%3A%20Translation%20Checkout)ラベルのイシューを見ると、現在翻訳に取り掛かっている領域がわかります。
新しく翻訳をおこないたい場合は、まず[イシューを作成](https://github.com/angular/angular-ja/issues/new)し、テンプレートにしたがって情報を記入してください。

## セットアップ

### 1. リポジトリのクローン

```
$ git clone git@github.com:angular/angular-ja.git
```

### 2. angular/angularリポジトリのダウンロード

このリポジトリではsubmoduleを使って翻訳元リポジトリと統合しています。

```
$ git submodule sync
$ git submodule update --init
```

## ローカルでのビルド

ビルドが完了すると、 `.tmp/aio/dist` ディレクトリにドキュメンテーションサイトが出力されます。
好みのツールで開発サーバーを立ててビルドされたサイトを確認できます。

```
$ ./build.sh
```

**注意**

- ビルド時間がとても長いので、コーヒーを淹れながら待ちます。
- MacOSにおいて、ビルド処理の途中でOSのファイルディスクリプタを使い切ってしまうことがあります。
  その場合は次のように最大数を増やす必要があります。

https://github.com/meteor/meteor/issues/8057#issuecomment-261011063

```
$ echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
$ echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
$ sudo sysctl -w kern.maxfiles=65536
$ sudo sysctl -w kern.maxfilesperproc=65536
$ ulimit -n 65536
```

### 差分ビルドを使った作業

一度ローカルビルドをおこなった後であれば、`.tmp/aio` ディレクトリの中で直接ファイルを書き換えて差分ビルドによりスムーズに作業できます。
`yarn serve-and-sync`コマンドの実行中であれば、`.tm@/aio`内のファイルへの変更があるときに自動でリビルドできます。
ただし`.tmp`ディレクトリ内での作業はGit管理されないので、作業後に`aio-ja`ディレクトリに反映することを忘れないようにしましょう。

```
$ cd .tmp/aio
$ yarn serve-and-sync # localhost:4200でサーバーが立ち上がります
```

## 翻訳作業

現在の翻訳ワークフローは以下のとおりです。

### 0. 翻訳宣言のイシューを作成する

翻訳作業を開始する前に、同じファイルを翻訳しようとしている人がいないかどうかを確認しましょう。
[Translation Checkout](https://github.com/angular/angular-ja/labels/type%3A%20Translation%20Checkout)ラベルのイシューを見ると、現在翻訳に取り掛かっている領域がわかります。
新しく翻訳をおこないたい場合は、まず[イシューを作成](https://github.com/angular/angular-ja/issues/new)し、テンプレートにしたがって情報を記入してください。

### 1. 翻訳で置き換えたいファイルを `aio-ja` ディレクトリにコピーする

`aio-ja` ディレクトリは `origin/aio` ディレクトリと同じ階層構造をもっています。
`aio-ja` ディレクトリの中のファイルはビルド時に `origin/aio` の中のファイルを上書きします。

### 2. 翻訳する

コピーしたファイルを翻訳します。かならずしもファイル全体を翻訳してしまう必要はありません。

### 3. プルリクエストを作成する

angular/angular-jaをフォークしたリポジトリに変更をプッシュし、フォーク元にプルリクエストを提出します。
プルリクエストはレビューされたのち、問題がなければマージされます

## aioディレクトリの構成

基本的には `content`ディレクトリ内のMarkdownファイルに対して翻訳をおこないます。
その他必要に応じて、アプリケーションのソースコードにも手を加えます。

https://github.com/angular/angular/tree/master/aio

```
origin/aio/
├── README.md
├── content # MarkdownやHTMLなどで書かれたドキュメンテーションのリソースファイル。主にここのファイルを翻訳する
│   ├── examples # サンプルコードのソースコード
│   ├── guide # ガイドドキュメントのリソース
│   ├── images # ドキュメンテーション中の画像
│   ├── marketing # リンク集やイベント情報など、Angular紹介用のリソース
│   ├── navigation.json # サイトの各種ナビゲーションの管理ファイル
│   └── tutorial # チュートリアルのリソース
├── src # angular.ioアプリケーションのソースコード
...
```