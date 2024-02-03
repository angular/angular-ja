# CLIの概要とコマンドリファレンス

Angular CLIは、Angularアプリケーションの初期化、開発、スキャフォールド、およびメンテナンスに使用するコマンドラインインターフェースツールです。このツールはコマンドシェルで直接使用できます。

## Angular CLIのインストール

Angular CLIのメジャーバージョンは、サポートされているAngularのメジャーバージョンに従いますが、マイナーバージョンは個別にリリースできます。

`npm` パッケージマネージャーを使用してCLIをインストールします:

<code-example format="shell" language="shell">

npm install -g &commat;angular/cli<aio-angular-dist-tag class="pln"></aio-angular-dist-tag>

</code-example>

バージョン間の変更、および以前のリリースからのアップデートに関する詳細については、GitHubのリリースタブを参照してください: https://github.com/angular/angular-cli/releases

## 基本的なワークフロー

コマンドラインから実行可能な `ng` を介してツールを起動します。
オンラインヘルプはコマンドラインで利用できます。
特定のコマンド（ [new](cli/new) など）またはオプションを簡単な説明付きでリストするには、次のように入力します。

<code-example format="shell" language="shell">

ng --help
ng new --help

</code-example>

開発サーバーで新しい基本的なAngularプロジェクトを作成、構築、および提供するには、新しいワークスペースの親ディレクトリに移動し、次のコマンドを使用します:

<code-example format="shell" language="shell">

ng new my-first-project
cd my-first-project
ng serve

</code-example>

ブラウザで http://localhost:4200/ を開き、新しいアプリケーションが実行されるのを確認します。
[ng serve](cli/serve) コマンドを使用してアプリケーションを構築し、それをローカルに配信すると、ソースファイルのいずれかを変更すると、サーバーによって自動的にアプリケーションが再構築され、ページがリロードされます。

<div class="alert is-helpful">

`ng new my-first-project`を実行すると、`my-first-project`という名前の新しいフォルダーが作業中のディレクトリに作成されます。
このフォルダの中でファイルを作成することになるので、このコマンドを実行する前に作業ディレクトリに対する十分な権限があることを確認してください。

もし作業ディレクトリがプロジェクトの正しい場所でなければ、`cd <path-to-other-directory>`コマンドで正しい場所に移動しましょう。

</div>

## ワークスペースとプロジェクトファイル

[ng new](cli/new) コマンドは *Angular workspace* フォルダを作成し、新たなアプリケーションのスケルトンを生成します。
ワークスペースには複数のアプリケーションとライブラリを含めることができます。
[ng new](cli/new) コマンドによって作成された最初のアプリケーションは、ワークスペースの最上位にあります。
ワークスペースで追加のアプリケーションまたはライブラリを生成すると、それらは `projects/` サブフォルダに入ります。

新しく生成されたアプリケーションには、ルートコンポーネントとテンプレートを含むルートモジュールのソースファイルが含まれています。
各アプリケーションにはロジック、データ、およびアセットを含む `src` フォルダがあります。

生成されたファイルを直接編集することも、CLIコマンドを使用して追加して変更することもできます。
[ng generate](cli/generate) コマンドを使用して、追加のコンポーネントやサービス用の新しいファイルを追加したり、新しいパイプやディレクティブなどのコードを追加したりします。
アプリケーションやライブラリを作成または操作する [add](cli/add) や [generate](cli/generate) などのコマンドは、ワークスペースまたはプロジェクトフォルダー内から実行する必要があります。

*   [ワークスペースとプロジェクトのファイル構造](guide/file-structure) についての詳細を参照してください。

### ワークスペースとプロジェクト構成

ひとつのワークスペース設定ファイル `angular.json` が、ワークスペースの最上位に作成されます。
ここで、CLIコマンドオプションにプロジェクトごとのデフォルトを設定し、CLIがさまざまなターゲット用にプロジェクトをビルドするときに使用する構成を指定できます。

[ng config](cli/config) コマンドを使用すると、コマンドラインから設定値を設定および取得できます。または、 `angular.json` ファイルを直接編集できます。

<div class="alert is-helpful">

**NOTE**: <br />
Option names in the configuration file must use [camelCase](guide/glossary#case-types), while option names supplied to commands must be dash-case.

</div>

*   [ワークスペースの設定](guide/workspace-config) ワークスペース設定についての詳細を参照してください。

## CLIコマンド言語構文

コマンド構文は次のとおりです:

`ng` *<command-name>* *<required-arg>* [*optional-arg*] `[options]`

*   ほとんどのコマンドと一部のオプションにはエイリアスがあります。
    別名は、各コマンドの構文ステートメントに示されています。

*   オプション名の前には二重ダッシュ（`--`）が付きます。
    オプションエイリアスの先頭には単一ダッシュ（`-`）が付きます。
    引数は前に付けられません。
    たとえば: 
    
    <code-example format="shell" language="shell">

    ng build my-app -c production

    </code-example>

*   通常、生成された成果物の名前は、コマンドの引数として指定することも、`--name`オプションで指定することもできます。

*   引数とオプションの名前は[dash-case](guide/glossary#case-types)で指定できます。
    例: `--my-option-name`

### ブール値オプション

ブール値オプションには2つの形式があります: `--this-option` はフラグを設定し、 `--no-this-option` はフラグをクリアします。
どちらのオプションも指定されていない場合、フラグはリファレンスドキュメントに記載されているデフォルトのままになります。

### Array options

Array options can be provided in two forms: `--option value1 value2` or `--option value1 --option value2`.

### 相対パス

ファイルを指定するオプションは、絶対パスとして、または現在の作業ディレクトリ（通常はワークスペースまたはプロジェクトルートのどちらか）に対する相対パスとして指定できます。

### Schematics

[ng generate](cli/generate) と [ng add](cli/add) コマンドは、アーティファクトやライブラリが生成されるか、現在のプロジェクトに追加する引数として取ります
一般的なオプションに加えて、各アーティファクトまたはライブラリは、 *schematics* で独自のオプションを定義します。
Schematicオプションは、即時コマンドオプションと同じ形式でコマンドに提供されます。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
