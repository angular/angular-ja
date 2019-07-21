# Bazel を使ったビルド

このガイドでは、 Bazel を使って Angular アプリケーションをビルドしテストする方法を説明します。


<div class="alert is-helpful">

このガイドは、あなたが [CLI](cli) を使った Angular アプリケーションの開発とビルドに慣れていることを前提としています。

Angular Labsの一部であり、安定版ではなく、サポートされていない API 機能について説明しています。

</div>

## Angular CLI での Bazel の使い方

`@angular/bazel` パッケージは Angular CLI で Bazel がビルドツールとして使用することを可能にするビルダーを提供します。

既存のアプリケーションで選択するには、次のコマンドを実行します。

```sh
ng add @angular/bazel
```

新しいアプリケーションでBazelを使うには、まず `@angular/bazel` をグローバルインストールしてください。

```sh
npm install -g @angular/bazel
```

それから新しいアプリケーションを作成します。

```sh
ng new --collection=@angular/bazel
```

`ng build` や `ng serve` のような Angular CLI のビルドコマンドを使う時、
裏側では Bazel が使われています。
Bazelからの出力は `dist/bin` フォルダに現れます。

> コマンドライン出力には、 Bazel からの追加のログが含まれています。
> 将来的にはこれを減らす予定です。

### Bazel の削除

Bazel の使用を中止する必要がある場合は、バックアップファイルから復元できます。

- `/angular.json.bak` から `/angular.json` に置き換えます。

## 高度な設定

<div class="alert is-helpful">

Bazel の設定を編集すると、Bazel が使用出来なくなる可能性があります。
他のビルダーのカスタム動作は、 Bazel では利用できません。

このセクションはあなたが [Bazel](https://docs.bazel.build) に精通していることを前提としています。

</div>

手動で Bazel 設定を調整することができます。

* ビルド手順をカスタマイズ
* スケールと差分によるのビルドの並列化

以下のコマンドを実行して、Bazel の初期設定ファイルの作成します:

```sh
ng build --leaveBazelFilesOnDisk
```

これで、 Angular ワークスペースに新しいファイルが見つかります:

* `/WORKSPACE` は外部の依存関係をダウンロードする方法を Bazel に伝えます。
* `/BUILD.bazel` と `/src/BUILD.bazel` はあなたのソースコードについて Bazel に伝えます。

カスタム Bazel 構成を含めた全ての機能の例を http://github.com/angular/angular-bazel-example で、見ることができます。

フロントエンドプロジェクトに Bazel を使用するためのドキュメントは https://docs.bazel.build/versions/master/bazel-and-javascript.html にリンクされています。



## Bazel の直接実行

場合によっては、 Angular CLI ビルダーを使わず、 Bazel CLI を直接実行する必要があります。
Bazel CLIは `@bazel/bazel` npmパッケージにあります。
あなたのパスに `bazel` コマンドを入れるためにグローバルインストールするか、または bazel の代わりに `$(npm bin)/bazel` を使うことができます。

Bazel の一般的なコマンドは以下の通りです。:

* `bazel build [targets]`: 指定ターゲットのデフォルト出力成果をコンパイルします。
* `bazel test [targets]`: パターンの中でどちらの `*_test` ターゲットが見つかっても、テストを実行してください。
* `bazel run [target]`: target で表されるプログラムをコンパイルしてから実行します。

入力が変わるたびにコマンドを繰り返すには（監視モード）、これらのコマンドで `bazel` を `ibazel` に置き換えてください。

出力場所は、出力成果に印刷されます。

Bazel CLI の完全なドキュメントは https://docs.bazel.build/versions/master/command-line-reference.html にあります。


## ビルドグラフの照会

Bazel はあなたのターゲットからグラフを作成するので、たくさんの役に立つ情報を見つけることができます。

graphviz のオプションの依存関係を使うと、`dot` プログラムが出来、 `bazel query` と一緒に使うことができます。:

```bash
$ bazel query --output=graph ... | dot -Tpng > graph.png
```

`bazel query` の詳細については https://docs.bazel.build/versions/master/query-how-to.html をご覧ください。


## `BUILD.bazel` ファイルのカスタマイズ

"Rules" are like plugins for Bazel. Many rule sets are available. This guide documents the ones maintained by the Angular team at Google.

Rules are used in `BUILD.bazel` files, which are markers for the packages in your workspace. Each `BUILD.bazel` file declares a separate package to Bazel, though you can have more coarse-grained distributions so that the packages you publish (for example, to `npm`) can be made up of many Bazel packages.

In the `BUILD.bazel` file, each rule must first be imported, using the `load` statement. Then the rule is called with some attributes, and the result of calling the rule is that you've declared to Bazel how it can derive some outputs given some inputs and dependencies. Then later, when you run a `bazel` command line, Bazel loads all the rules you've declared to determine an absolute ordering of what needs to be run. Note that only the rules needed to produce the requested output will actually be executed.

A list of common rules for frontend development is documented in the README at https://github.com/bazelbuild/rules_nodejs/.
