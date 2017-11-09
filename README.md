# angular-ja

[![CircleCI](https://circleci.com/gh/angular/angular-ja/tree/master.svg?style=svg)](https://circleci.com/gh/angular/angular-ja/tree/master)

このリポジトリは[Angular](https://github.com/angular/angular)の公式サイト [angular.io](https://angular.io) を日本語に翻訳するためのものです。

現在は https://angular-ja.firebaseapp.com/ でホストされたサイトを確認できます。

## コントリビューター

<!---begin contributors -->
[<img alt="lacolaco" src="https://avatars3.githubusercontent.com/u/1529180?v=4&s=117" width="117">](https://github.com/lacolaco)
<!---end contributors -->

## コントリビューション大歓迎！

この翻訳プロジェクトにはみなさんの協力が必要です。

- ドキュメントの翻訳
- よりよい翻訳ワークフローの提案

イシューやプルリクエストをいつでもお待ちしています。
翻訳プロジェクトについての議論は [ng-japan slack](http://slack-invite.ngjapan.org)の `#translation` チャンネルで進行しています。

## セットアップ

### 1. リポジトリのクローン

```
$ git clone git:github.com@angular/angular-ja
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

## 翻訳作業

現在の翻訳ワークフローは以下のとおりです。

### 1. 翻訳で置き換えたいファイルを `aio-ja` ディレクトリにコピーする

`aio-ja` ディレクトリは `origin/aio` ディレクトリと同じ階層構造をもっています。
`aio-ja` ディレクトリの中のファイルはビルド時に `origin/aio` の中のファイルを上書きします。

### 2. 翻訳する

コピーしたファイルを翻訳します。かならずしもファイル全体を翻訳してしまう必要はありません。

### 3. プルリクエストを作成する

angular/angular-jaをフォークしたリポジトリに変更をプッシュし、フォーク元にプルリクエストを提出します。
プルリクエストはレビューされたのち、問題がなければマージされます
