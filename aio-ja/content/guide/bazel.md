# Bazel を使ったビルド

このガイドでは、 Bazel を使って Angular アプリケーションをビルドしテストする方法を説明します。


<div class="alert is-helpful">

このガイドは、あなたが [CLI](cli) を使った Angular アプリケーションの開発とビルドに慣れていることを前提としています。

Angular Labsの一部であり、安定版ではなく、サポートされていない API 機能について説明しています。

</div>

## Angular CLI での Bazel の使い方

`@angular/bazel` パッケージは Angular CLI で Bazel がビルドツールとして使用することを可能にするビルダーを提供します。

既存のアプリケーションで利用するには、次のコマンドを実行します。

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

Bazel の使用をやめる必要がある場合は、バックアップファイルから復元できます。

- `/angular.json.bak` から `/angular.json` に置き換えます。

## 高度な設定

<div class="alert is-helpful">

Bazel の設定を編集すると、Bazel が使用出来なくなる可能性があります。
他のビルダーのカスタム動作は、 Bazel では利用できません。

このセクションはあなたが [Bazel](https://docs.bazel.build) に精通していることを前提としています。

</div>

手動で Bazel 設定を調整することができます。

* ビルド手順をカスタマイズ
* スケールとインクリメンタリティのためのビルド並列化

次のコマンドを実行して、Bazel の初期設定ファイルの作成します:

```sh
ng build --leaveBazelFilesOnDisk
```

これで、 Angular ワークスペースに新しいファイルが見つかります:

* `/WORKSPACE` は外部の依存関係をダウンロードする方法を Bazel に伝えます。
* `/BUILD.bazel` と `/src/BUILD.bazel` はあなたのソースコードについて Bazel に伝えます。

カスタム Bazel 構成を含めたすべての機能の例を https://github.com/bazelbuild/rules_nodejs/tree/master/examples/angular. で、見ることができます。

フロントエンドプロジェクトに Bazel を使用するためのドキュメントは https://docs.bazel.build/versions/master/bazel-and-javascript.html にリンクされています。



## Bazel の直接実行

場合によっては、 Angular CLI ビルダーを使わず、 Bazel CLI を直接実行する必要があります。
Bazelツールは、 `@bazel/bazelisk`パッケージによって管理されます（Node.jsが` nvm`によって管理されるのと似ています）。
あなたのパスに `bazelisk` コマンドを入れるためにグローバルインストールするか、または次の bazelisk の代わりに `$(npm bin)/bazelisk` を使うことができます。

Bazel の一般的なコマンドは次のとおりです。:

* `bazelisk build [targets]`: 指定ターゲットのデフォルト出力成果をコンパイルします。
* `bazelisk test [targets]`: パターンの中で見つかったどの `*_test` ターゲットについてもテストを実行します。
* `bazelisk run [target]`: target で表されるプログラムをコンパイルしてから実行します。

入力が変わるたびにコマンドを繰り返すには（監視モード）、これらのコマンドで `bazelisk` を `ibazel` に置き換えてください。

アウトプットの場所は出力に記されます。

Bazel CLI の完全なドキュメントは https://docs.bazel.build/versions/master/command-line-reference.html にあります。


## ビルドグラフの照会

Bazel はあなたのターゲットからグラフを作成するので、たくさんの役に立つ情報を見つけることができます。

graphviz のオプションの依存関係を使うと、`dot` プログラムが手に入り、 `bazel query` と一緒に使うことができます。:

```bash
$ bazel query --output=graph ... | dot -Tpng > graph.png
```

`bazel query` の詳細については https://docs.bazel.build/versions/master/query-how-to.html をご覧ください。


## `BUILD.bazel` ファイルのカスタマイズ

"ルール" は Bazel のプラグインのようなものです。 多くのルールセットが利用可能です。 このガイドは、Google のAngular チームによって維持されているものを文書化しています。

ルールは `BUILD.bazel` ファイルで使われています。これはあなたのワークスペース内のパッケージのメーカーです。 個々の `BUILD.bazel` ファイルは Bazel への別々のパッケージを宣言しますが、あなたが（たとえば `npm` に）公開するパッケージを多くの Bazel パッケージで構成することができるようにもっと粒度の細かいディストリビューションをもつことができます。

`BUILD.bazel` ファイルでは、最初に `load` ステートメントを使って各ルールをインポートしなければなりません。 それからルールはいくつかの属性で呼び出され、そして、ルールを呼び出す結果はいくつかの入力と依存関係を与えられたいくつかの出力を引き出すことができる方法を Bazel に宣言します。 そのあとで、 `bazel`コマンドラインを実行すると、Bazelは実行する必要があるものの絶対的な順序を決定するために宣言したすべてのルールをロードします。 要求された出力を生成するために必要な規則だけが実際に実行されることに注意してください。

フロントエンド開発の一般的な規則の一覧は、 https://github.com/bazelbuild/rules_nodejs/ にあるREADMEに記載されています。
