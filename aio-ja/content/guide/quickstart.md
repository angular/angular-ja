# 入門

Angularへようこそ！ Angularは、Web、モバイル、またはデスクトップ用の最新のアプリケーションを構築するのに役立ちます。

このガイドでは、簡単なAngularアプリを構築して実行する方法を説明します。 [Angular CLIツール](cli "CLIコマンドリファレンス")を使用して開発を加速し、すべてのAngularプロジェクトに役立つ[スタイルガイド](guide/styleguide "Angularスタイルガイド")の推奨事項を遵守します。


このガイドは30分以内に完了します。このガイドの最後には、最終的なコードレビューの一環として、最終的なアプリケーションコードのコピーをダウンロードするリンクがあります。 （このガイドのコマンドを実行しない場合でも、最終的なアプリケーションコードをダウンロードできます）。

{@a devenv}
{@a prerequisites}
## 前提条件

始める前に、開発環境に`Node.js®`とnpmパッケージマネージャが含まれていることを確認してください。

{@a nodejs}
### Node.js

Angularには、`Node.js` バージョン8.xまたは10.xが必要です。

* バージョンをチェックするためには、`node -v` をターミナルあるいはコンソールで実行してください。

* `Node.js`を手に入れるには、 [nodejs.org](https://nodejs.org "Nodejs.org")へ行きましょう。

{@a npm}
### npm パッケージマネージャー

Angular、Angular CLI、Angularアプリケーションは、[npmパッケージ](https://docs.npmjs.com/getting-started/what-is-npm)として利用可能なライブラリによって提供される機能に依存します。 npmパッケージをダウンロードしてインストールするには、npmパッケージマネージャが必要です。

このクイックスタートでは、デフォルトで `Node.js` とともにインストールされる[npmクライアント](https://docs.npmjs.com/cli/install)コマンドラインインターフェースを使用します。

npmクライアントがインストールされていることを確認するには、ターミナルやコンソールで`npm -v`を実行します。


{@a install-cli}

## ステップ 1: Angular CLIのインストール

Angular CLIを使用して、プロジェクトを作成し、
アプリケーションとライブラリのコードを生成し、テスト、バンドル、およびデプロイなどのさまざまな進行中の開発タスクを実行します。

Angular CLIをグローバルにインストールします。

`npm`を使用してCLIをインストールするには、ターミナルやコンソールを開き、次のコマンドを入力します。


<code-example language="sh" class="code-shell">
  npm install -g @angular/cli

</code-example>



{@a create-proj}

## ステップ 2: ワークスペースと初期アプリケーションの作成

Angular[**ワークスペース**](guide/glossary#workspace)のコンテキストでアプリケーションを開発します。ワークスペースには、1つ以上の[**プロジェクト**](guide/glossary/#project)のファイルが含まれます。プロジェクトとは、アプリケーション、ライブラリ、またはエンドツーエンド（e2e）のテストを構成する一連のファイルです。

新しいワークスペースと初期アプリケーションプロジェクトを作成するには

1. 次のように、CLIコマンド `ng new` を実行して、名前 `my-app` を指定します。

<code-example language="sh" class="code-shell">
  ng new my-app

</code-example>

2. `ng new` コマンドを実行すると、最初のアプリプロジェクトに含める機能に関する情報が表示されます。 EnterキーまたはReturnキーを押してデフォルト値を受け入れます。

Angular CLIは、必要なAngular npmパッケージおよびその他の依存関係をインストールします。これには数分かかることがあります。

また、次のワークスペースとスタータープロジェクトファイルも作成されます。 

* `my-app`という名前のルートフォルダをもつ新しいワークスペース
* `my-app`と呼ばれる最初のスケルトンアプリケーションプロジェクト（`src`サブフォルダ内）
* エンドツーエンドのテストプロジェクト（`e2e`サブフォルダ内）
* 関連する設定ファイル

最初のアプリプロジェクトには、すぐに実行できる簡単なウェルカムアプリが含まれています。

{@a serve}

## ステップ 3: アプリケーションをサーブする

Angularにはサーバーが含まれているため、アプリケーションをローカルに簡単に構築して提供することができます。

1. ワークスペースフォルダ（`my-app`）に移動します。
2. `--open`オプションを付けてCLIコマンド `ng serve` を使用してサーバーを起動します。

<code-example language="sh" class="code-shell">
  cd my-app
  ng serve --open
</code-example>

`ng serve` コマンドはサーバーを起動します。  
プロジェクトのファイル変更を監視して、変更があれば再度ビルドを行います。

`--open` （または `-o` ）オプションは`http://localhost:4200/` を自動的にブラウザで開きます。

アプリケーションで次のような挨拶文が表示されればOKです。

<figure>
  <img src='generated/images/guide/cli-quickstart/app-works.png' alt="Welcome to my-app!">
</figure>



{@a first-component}

## ステップ 4: Angularコンポーネントを編集する

[**_コンポーネント_**](guide/glossary#component)は、Angularアプリケーションの基本的なビルディングブロックです。彼らは、画面上にデータを表示し、ユーザーの入力を聞いて、その入力に基づいて行動を起こします。

最初のアプリの一環として、CLIが最初のAngularコンポーネントを作成しました。これは_ルートコンポーネント_であり、`app-root`という名前です。

1. `./src/app/app.component.ts` を開きます。
2. `title` プロパティを `'my-app'`から `'My First Angular App'`に変更します。

    <code-example path="cli-quickstart/src/app/app.component.ts" region="component" header="src/app/app.component.ts" linenums="false"></code-example>

    ブラウザが自動的に更新されて、変更したタイトルになっていますね。これでも素敵ですが、もっと見た目を良くしましょう。

3. `./src/app/app.component.css` を開いてコンポーネントにスタイルをつけていきましょう。

    <code-example path="cli-quickstart/src/app/app.component.css" header="src/app/app.component.css" linenums="false"></code-example>

見た目がよくなりましたね！

<figure>
  <img src='generated/images/guide/cli-quickstart/my-first-app.png' alt="入門アプリの表示結果">
</figure>


{@a project-file-review}

## 最終的なコードレビュー

この入門ガイドで作成したアプリの<a href="generated/zips/cli-quickstart/cli-quickstart.zip" target="_blank">サンプルをダウンロード</a>できます。

<div class="alert is-helpful">

**Tip:** ほとんどのAngularガイドには、サンプルファイルをダウンロードして[Stackblitz](http://www.stackblitz.com)でライブサンプルを実行するためのリンクが含まれているため、Angularのコンセプトとコードの動作を確認できます。


</div>


Angularプロジェクトファイルとファイル構造の詳細については、[ワークスペースとプロジェクトファイルの構造](guide/file-structure)を参照してください。


## ネクストステップ

AngularアプリケーションとAngular CLIの基本を見てきたので、これらの他の入門資料を続けてみましょう。

* [Tour of Heroesチュートリアル](tutorial "Tour of Heroes チュートリアル")では、実践的な追加学習が提供されています。それは、人材派遣会社がスーパーヒーローの従業員のグループを管理するのに役立つアプリを構築する手順を順を追って説明します。データ駆動型アプリケーションで期待される多くの機能を備えています。

        - アイテムのリストを取得して表示する 
        - 選択した項目の詳細を編集する 
        - データのさまざまなビュー間を移動する 
        
* [アーキテクチャガイド](guide/architecture "アーキテクチャガイド")では、モジュール、コンポーネント、サービス、依存性の注入（DI）などの重要な概念について説明します。特定のAngularの概念と機能に関する詳細なガイドの基礎を提供します。

チュートリアルとアーキテクチャのガイドの後で、あなたのアプリケーションにとってもっとも重要な機能に焦点を当て、このドキュメントセットの他のガイドとリファレンスを通して、あなた自身がAngularを引き続き探求する準備が整います。
