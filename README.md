# angular-ja

[![CircleCI](https://circleci.com/gh/angular/angular-ja/tree/master.svg?style=svg)](https://circleci.com/gh/angular/angular-ja/tree/master)

このリポジトリは[Angular](https://github.com/angular/angular)の公式サイト [angular.io](https://angular.io) を日本語に翻訳するためのものです。

現在は https://angular.jp でホストされたサイトを確認できます。

## クレジット

### コントリビューター

このプロジェクトに貢献してくれているコントリビューターのみなさんです！

<a href="https://github.com/angular/angular-ja/graphs/contributors"><img src="https://contributors-img.firebaseapp.com/image?repo=angular/angular-ja" /></a>


## コントリビューション大歓迎！

この翻訳プロジェクトにはみなさんの協力が必要です。
翻訳プロジェクトについての議論は [ng-japan slack](http://slack-invite.ngjapan.org)の `#translation` チャンネルで進行しています。

### やってほしいこと

イシューやプルリクエストをいつでもお待ちしています。

#### ドキュメントの翻訳

翻訳対象のファイルは`aio-ja`ディレクトリ内に管理されています。
まだ日本語化されていない部分についての翻訳にご協力ください

[翻訳作業のガイド](https://github.com/angular/angular-ja/blob/master/README.md#%E7%BF%BB%E8%A8%B3%E4%BD%9C%E6%A5%AD)

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
`yarn serve-and-sync`コマンドの実行中であれば、`.tmp/aio`内のファイルへの変更があるときに自動でリビルドできます。
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

**コピーしたファイルを翻訳します**。かならずしもファイル全体を翻訳してしまう必要はありません。

**注意**: 翻訳時点でのオリジナルファイルは `*.en.md` ファイルとして保存しておきます。オリジナル側に変更があったときに差異を確認するためです。

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

## [For Maintainers] originの更新

[UPDATE_ORIGIN.md](UPDATE_ORIGIN.md)
