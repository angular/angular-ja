# 公開ライブラリの使用

Angular アプリケーションを構築する際には、高度な自社製ライブラリや、[Angular Material](https://material.angular.io/) などの他社製ライブラリの豊富なエコシステムを活用できます。
もっとも人気のあるものへのリンクについては、[Angular Resources](resources) のページを参照してください。

## ライブラリのインストール

ライブラリは、通常それらを Angular CLI と統合するスキーマとともに、[npm パッケージ](guide/npm-packages)として公開されます。
再利用可能なライブラリコードをアプリケーションに統合するには、パッケージをインストールし、提供されている機能を使用する場所にインポートする必要があります。公開されているほとんどのAngularライブラリでは、Angular CLI の `ng add <lib_name>` コマンドを使用できます。

`ng add` コマンドは、npm パッケージマネージャーまたは [yarn](https://yarnpkg.com/) を使用してライブラリパッケージをインストールし、パッケージに含まれている schematics を呼び出してプロジェクトコードの中に import ステートメント、フォント、テーマなどの追加をして雛形を作成します。

公開ライブラリは通常、そのライブラリをアプリに追加する方法についての README またはその他のドキュメントを提供します。
例については、[Angular Material](https://material.angular.io/) のドキュメントを参照してください。

### ライブラリの型定義

ライブラリパッケージは多くの場合、`.d.ts` ファイルに型定義を含みます。`node_modules/@angular/material` の例を参照してください。ライブラリのパッケージに型定義が含まれておらず、IDE が指摘をだす場合は、ライブラリに関連付けられている `@types/<lib_name>` パッケージをインストールする必要があります。

たとえば、`d3` という名前のライブラリがあるとします。

<code-example language="bash">
npm install d3 --save
npm install @types/d3 --save-dev
</code-example>

ワークスペースにインストールされたライブラリの `@types/` パッケージで定義された型は、そのライブラリを使用するプロジェクトの TypeScript 構成に自動的に追加されます。
TypeScript はデフォルトで `node_modules/@types` フォルダで型を探すので、各型パッケージを個別に追加する必要はありません。

ライブラリの `@types/` で利用可能な型定義がない場合でも、手動で型定義を追加して使用できます。
このようにします：

1. `src/` フォルダーに `typings.d.ts` ファイルを作成してください。このファイルは自動的にグローバル型定義として含まれます。

2. 次のコードを `src/typings.d.ts` に追加してください。

```
declare module 'host' {
  export interface Host {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }
  export function parse(url: string, queryString?: string): Host;
}
```

3. ライブラリを使用するコンポーネントまたはファイルに、次のコードを追加します。

```
import * as host from 'host';
const parsedUrl = host.parse('https://angular.io');
console.log(parsedUrl.hostname);
```

必要に応じてもっと型定義を定義できます。

## ライブラリを更新する

ライブラリは、公開者が更新することができ、そしてまた最新に保つ必要がある自身の依存関係を持っています。
インストールされているライブラリのアップデートを確認するには、[`ng update` コマンド](cli/update)を使用します。

個々のライブラリのバージョンを更新するには、`ng update <lib_name>` を使用します。Angular CLI はライブラリの最新リリースをチェックし、最新バージョンがインストール済みバージョンより新しい場合はそれをダウンロードし、最新バージョンに一致するように `package.json` を更新します。

Angular を新しいバージョンにアップデートするときは、使用しているライブラリが最新のものであることを確認する必要があります。ライブラリに相互依存関係がある場合は、それらを特定の順序で更新する必要があります。
[Angular 更新ガイド](https://update.angular.io/) を参照してください。

## 実行時グローバルスコープへのライブラリの追加

アプリにインポートされていない従来の JavaScript ライブラリは、ランタイムグローバルスコープに追加して、あたかも script タグの中にあるかのように読み込むことができます。
[CLI 構成ファイル](guide/workspace-config)の `angular.json` 内のビルドターゲットの "scripts" および "styles" オプションを使用して、ビルド時にこれを実行するように CLI を構成します。

たとえば、 [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/) ライブラリを使用するには、まず npm パッケージマネージャーを使用してライブラリとその依存関係をインストールします。

<code-example language="bash">
npm install jquery --save
npm install popper.js --save
npm install bootstrap --save
</code-example>

`angular.json` 構成ファイルで、関連するスクリプトファイルを "scripts" 配列に追加します。

```
"scripts": [
  "node_modules/jquery/dist/jquery.slim.js",
  "node_modules/popper.js/dist/umd/popper.js",
  "node_modules/bootstrap/dist/js/bootstrap.js"
],
```

Bootstrap CSS ファイルを "styles" 配列に追加します。

```
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "src/styles.css"
],
```

`ng serve` を実行または再起動して、Bootstrap 4 がアプリケーションで機能していることを確認します。

### アプリ内で実行時グローバルライブラリを使用する {@a using-runtime-global-libraries-inside-your-app}

"scripts" 配列を使用してライブラリをインポートした後は、TypeScript コード内の import 文 (`import * as $ from 'jquery';` など) を使用してインポート**しないでください**。
その場合、ライブラリの2つの異なるコピーが作成されます。1つはグローバルライブラリとしてインポートされ、もう1つはモジュールとしてインポートされます。
これは JQuery のようなプラグインをもつライブラリにとっては特に悪いです。なぜなら、個々のコピーは異なるプラグインをもつからです。

代わりに、ライブラリの型定義をダウンロードし (`npm install @types/jquery`)、ライブラリのインストール手順にしたがってください。これにより、そのライブラリによって公開されているグローバル変数にアクセスできます。

### 実行時グローバルライブラリの型定義の定義

使う必要があるグローバルライブラリがグローバル型定義を持っていないなら、手動で `src/typings.d.ts`の中で `any` として宣言することができます。たとえば：

```
declare var libraryName: any;
```

他のライブラリを拡張するスクリプトもあります。たとえば JQuery プラグインを使うと：

```
$('.test').myPlugin();
```

この場合、インストールされている `@types/jquery` には `myPlugin` が含まれていないため、`src/typings.d.ts` にインターフェースを追加する必要があります。たとえば：

```
interface JQuery {
  myPlugin(options?: any): any;
}
```

スクリプト定義の拡張機能用のインターフェースを追加しないと、IDE にエラーが表示されます。

```
[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'
```
