# Angular CLI

Angular CLIは、コマンドシェルから直接Angularアプリケーションをスキャフォールド、開発、テスト、デプロイ、保守できるコマンドラインインターフェースツールです。

Angular CLIは、npmに`@angular/cli`パッケージとして公開されており、`ng`という名前のバイナリを含んでいます。`ng`を呼び出すコマンドはAngular CLIを使用しています。

<docs-callout title="ローカルセットアップなしでAngularを試す">

Angularを初めて使用する場合は、[今すぐ試す！](tutorials/learn-angular)から始めることをお勧めします。これは、すぐに使える基本的なオンラインストアアプリケーションのコンテキストでAngularの要点を紹介し、確認および変更できます。
このスタンドアロンチュートリアルは、オンライン開発のためのインタラクティブな[StackBlitz](https://stackblitz.com)環境を利用しています。
準備が整うまで、ローカル環境をセットアップする必要はありません。

</docs-callout>

<docs-card-container>
  <docs-card title="はじめに" link="開始する" href="tools/cli/setup-local">
    Angular CLIをインストールして、最初のアプリを作成およびビルドします。
  </docs-card>
  <docs-card title="コマンドリファレンス" link="詳細を見る" href="cli">
    Angularでより生産性を高めるCLIコマンドを発見します。
  </docs-card>
  <docs-card title="Schematics" link="詳細を見る" href="tools/cli/schematics">
    Schematicsを作成および実行して、アプリケーションのソースファイルを自動的に生成および変更します。
  </docs-card>
  <docs-card title="Builders" link="詳細を見る" href="tools/cli/cli-builder">
    Buildersを作成および実行して、ソースコードから生成されたビルド出力への複雑な変換を実行します。
  </docs-card>
</docs-card-container>

## CLIコマンド言語構文 {#cli-command-language-syntax}

Angular CLIは、オプション構文に関してUnix/POSIXの慣例にほぼ従っています。

### 真偽値オプション {#boolean-options}

真偽値オプションには2つの形式があります。`--this-option`はフラグを`true`に設定し、`--no-this-option`は`false`に設定します。
`--this-option=false`または`--this-option=true`を使用できます。
どちらのオプションも指定されていない場合、フラグは参照ドキュメントに記載されているデフォルトの状態のままになります。

### 配列オプション {#array-options}

配列オプションは2つの形式で指定できます。`--option value1 value2`または`--option value1 --option value2`。

### キー/値オプション {#key-value-options}

`--define`のような一部のオプションは、値として`key=value`ペアの配列を期待します。
配列オプションと同様に、キー/値オプションは2つの形式で指定できます。
`--define 'KEY_1="value1"' KEY_2=true`または`--define 'KEY_1="value1"' --define KEY_2=true`。

### 相対パス {#relative-paths}

ファイルを指定するオプションは、絶対パスとして、または現在の作業ディレクトリ（通常はワークスペースまたはプロジェクトのルート）に対する相対パスとして指定できます。
