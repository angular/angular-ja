# angular-jaへのコントリビューション

## ファイル構成

- `origin`: `angular/angular` リポジトリをsubmodule管理しています
- `adev-ja`: 翻訳の原文ファイル `xxx.en.md` と 翻訳ファイル `.md` 、その他 `origin` を上書きするためのファイルを管理しています。

### adev-jaディレクトリの構成

基本的には `src/content`ディレクトリ内のMarkdownファイルに対して翻訳をおこないます。
その他必要に応じて、アプリケーションのソースコードにも手を加えます。

https://github.com/angular/angular/tree/main/adev

## 翻訳作業の流れ

翻訳作業を開始する前に、同じファイルを翻訳しようとしている人がいないかどうかを確認しましょう。
[Translation Checkout](https://github.com/angular/angular-ja/labels/type%3A%20Translation%20Checkout)ラベルのイシューを見ると、現在翻訳に取り掛かっている領域がわかります。
新しく翻訳をおこないたい場合は、まず[イシューを作成](https://github.com/angular/angular-ja/issues/new/choose)し、テンプレートにしたがって情報を記入してください。

## 軽微な修正

すでに翻訳されたドキュメントの軽微な修正は、GitHub上の `Edit` 機能でプルリクエストを作成してください。

![edit-on-github](./docs/edit-on-github.png)

## 翻訳の追加

> [!NOTE]
> まとまった量のテキストの翻訳を省力化するため、Googleの[Gemini API](https://ai.google.dev/gemini-api?hl=ja)を使ったAI翻訳を導入しています。詳細は[TRANSLATION_WITH_AI.md](./docs/TRANSLATION_WITH_AI.md)を参照してください。

未翻訳のドキュメントをあらたに翻訳するには、翻訳時点での原文を `xxx.en.md` ファイルとして保存し、`xxx.md` を翻訳します。以下のステップで翻訳を進めてください。

- `xxx.md` ファイルをコピーして `xxx.en.md` ファイルを作成する
- `xxx.md` ファイルを翻訳する


## ローカル環境のセットアップ

翻訳作業中にローカル環境でサイトを確認するためには、次の手順でセットアップを行います。

### 1. リポジトリのクローン

```
$ git clone git@github.com:angular/angular-ja.git
```

### 2. 初回のビルド

このリポジトリではsubmoduleを使って翻訳元リポジトリと統合しています。初回のビルド時にsubmoduleの同期やビルドディレクトリの初期化が行われます。15分ほどかかることがあるため、気長にお待ちください。

```
$ yarn install
$ yarn build
```

### 開発用サーバーを使った作業

開発用ローカルサーバーを起動すると、ビルド結果を確認しながら翻訳作業ができます。

```
$ yarn start
```

- デフォルトでは `http://localhost:4200` でサーバーが立ち上がります
- `adev-ja` ディレクトリ内のファイルを変更すると自動的に再ビルドされます

`start` コマンドでは、翻訳用にパッチが適用されたアプリケーションコードを含む `build` ディレクトリを初期化せずに再利用します。初期化して開始したい場合は、 `--init` オプションを指定してください。

```
$ yarn start --init
```

### 文体チェック・自動修正

textlintを使って文体チェックを行うことができます。次のコマンドで文体チェックを行い、自動修正を行うことができます。

```
$ yarn lint [--fix]
```


### ビルド

次のコマンドでデプロイ可能な生成物をビルドします。

```
$ yarn build
```

ビルドが完了すると、 `build/dist/bin/adev/build` ディレクトリにビルド結果が出力されます。
好みのツールで開発サーバーを立ててビルドされたサイトを確認できます。

**注意**

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

### 翻訳イシューの作成

翻訳作業を開始する前に、同じファイルを翻訳しようとしている人がいないかどうかを確認しましょう。
[Translation Checkout](https://github.com/angular/angular-ja/labels/type%3A%20Translation%20Checkout)ラベルのイシューを見ると、現在翻訳に取り掛かっている領域がわかります。
新しく翻訳をおこないたい場合は、まず[イシューを作成](https://github.com/angular/angular-ja/issues/new/choose)し、テンプレートにしたがって情報を記入してください。

### 翻訳プルリクエストの作成

angular/angular-jaをフォークしたリポジトリに変更をプッシュし、フォーク元にプルリクエストを提出します。
プルリクエストはレビューされたのち、問題がなければマージされます

## 翻訳のガイドライン

日本語への翻訳は、以下のガイドラインに従ってください。

### 改行位置を原文と揃える

originの変更に追従しやすくするため、翻訳した時点の原文を `xxx.en.md` ファイルとして保存しています。
可能な限り、原文と翻訳文の行数を揃え、更新時のdiffチェックが楽になるように協力してください。

### textlintに従う

基本的な表記ゆれの統一はtextlintを利用して自動修正できるようにしています。
もしtextlintでエラーが検出されれば、CIで検知され、プルリクエストがmergeできません。

### 原文のニュアンスを維持する

ドキュメンテーションは技術文書であるため、日本語としての読みやすさを維持しながら、なるべく原文のニュアンスを保ち、意訳は最低限にとどめます。

慣れるまでは機械翻訳をベースに、Angular特有の用語などを修正するようにして進めるのがおすすめです。

### カタカナ語の表記について

日本語に翻訳することが難しい単語は、カタカナ語に置き換えることがあります。
外来語をカタカナに変換するルールは、原則として文化庁による[外来語の表記][]に従うものとします。
ただし、特別な文脈であったり、通例的な表記が存在する場合は例外を認めるものとします。

[外来語の表記]: https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/gairai/

### 箇条書きでの句点（。）の有無について

箇条書きされる文の末尾に句点をつけるかどうかは、原則として次の2つのルールに従うものとします。

- 各箇条が「文章」になっているか、「こと」「とき」で終える場合、句点を付ける。
- 各箇条が「名詞」で終える場合、句点を付けない。

参考: [箇条書きでの句点「。」の有無 – 小山特許事務所](https://www.koyamapat.jp/2019/06/11/itemize/)

### 明示的な見出しIDの追加

ページ内の見出しにはリンク用のIDが付与されますが、ページ内・ページ外からのリンクには英語版の見出しIDが使われることがあります。未翻訳のガイドからのリンクを維持するために、見出しを翻訳した際には明示的なIDを追加してください。見出しIDは以下のように追加します。

```md

## ポリフィル {#polyfills}

```
