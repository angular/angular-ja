# ライブラリの Schematics

Angular ライブラリを作成するときは、Angular CLI と統合する Schematics を提供してパッケージ化できます。
Schematics では、ユーザーは `ng add` を使用してライブラリの初期バージョンをインストールし、
`ng generate` を使用してライブラリで定義されたアーティファクトを作成し、`ng update` を使用して破壊的変更を導入するライブラリの新しいバージョンにプロジェクトを調整できます。

3種類の Schematics はすべて、ライブラリと一緒にパッケージ化するコレクションの一部とすることができます。

次の手順の完全な例については、<live-example downloadOnly>ライブラリ schematics プロジェクト</live-example>をダウンロードしてください。

## Schematics コレクションの作成

コレクションを開始するには、Schematic ファイルを作成する必要があります。
次の手順は、プロジェクトファイルを変更せずに初期サポートを追加する方法を示しています。

1. ライブラリのルートフォルダーに、`schematics/` フォルダーを作成します。

2. `schematics/` フォルダーに、最初の Schematic 用の `ng-add/` フォルダーを作成します。

3. `schematics/` フォルダーのルートレベルで、`collection.json` ファイルを作成します。

4. `collection.json` ファイルを編集して、コレクションの初期スキーマを定義します。

<code-example header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="schematics-for-libraries/projects/my-lib/schematics/collection.1.json">
</code-example>

  * `$schema` パスは、Angular Devkit コレクションスキーマを基準にしています。
  * `schematics` オブジェクトは、このコレクションの一部である名前付き schematics を記述します。
  * 最初のエントリは、`ng-add` という名前の Schematic です。説明が含まれ、Schematic が実行されたときに呼び出されるファクトリ関数を指定します。

1. ライブラリプロジェクトの `package.json` ファイルに、スキーマファイルへのパスを含む "schematics" エントリを追加します。
   Angular CLI はこのエントリを使用して、コマンドを実行するときにコレクション内の名前付き Schematics を検索します。

<code-example header="projects/my-lib/package.json (Schematics Collection Reference)" path="schematics-for-libraries/projects/my-lib/package.json" region="collection">
</code-example>

作成した最初のスキーマは、`ng add` コマンドをサポートする Schematic の場所を CLI に通知します。
これで、その Schematic を作成する準備が整いました。

## インストールサポートの提供

`ng add` コマンドの Schematic により、ユーザーの初期インストールプロセスを強化できます。
次の手順では、このタイプの Schematic を定義します。

1. <lib-root>/schematics/ng-add/ フォルダーに移動します。

2. メインファイル `index.ts` を作成します。

3. `index.ts` を開き、Schematic ファクトリ関数のソースコードを追加します。

<code-example header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts">
</code-example>

最初の `ng add` サポートを提供するために必要な唯一の手順は、`SchematicContext` を使用してインストールタスクをトリガーすることです。
タスクは、ユーザーの優先パッケージマネージャーを使用して、ライブラリをプロジェクトの `package.json` 設定ファイルに追加し、それをプロジェクトの `node_modules` ディレクトリにインストールします。

この例では、関数は現在の `Tree` を受け取り、変更せずにそれを返します。
必要に応じて、パッケージのインストール時に、ファイルの生成、設定の更新、またはライブラリに必要なその他の初期設定などの追加設定を行うことができます。

### Define dependency type

Use the `save` option of `ng-add` to configure if the library should be added to the `dependencies`, the `devDepedencies`, or not saved at all in the project's `package.json` configuration file.

<code-example header="projects/my-lib/package.json (ng-add Reference)" path="schematics-for-libraries/projects/my-lib/package.json" region="ng-add">
</code-example>

Possible values are:

  * `false` - Don't add the package to package.json
  * `true` - Add the package to the dependencies
  * `"dependencies"` - Add the package to the dependencies
  * `"devDependencies"` - Add the package to the devDependencies

## Schematics の作成

Schematics をライブラリと一緒にバンドルするには、ライブラリを設定して Schematics を個別にビルドしてから、それらをバンドルに追加する必要があります。
ライブラリをビルドした *後*、Schematics をビルドする必要があります。これにより、Schematics は正しいディレクトリに配置されます。

* ライブラリには、Schematics を分散ライブラリにコンパイルする方法の手順が記載されたカスタム Typescript 設定ファイルが必要です。

* Schematics をライブラリバンドルに追加するには、ライブラリの `package.json` ファイルにスクリプトを追加します。

Angular ワークスペースにライブラリプロジェクト `my-lib` があるとします。
ライブラリに Schematics のビルド方法を伝えるには、ライブラリのビルドを設定する `tsconfig.lib.json` ファイルの隣に `tsconfig.schematics.json` ファイルを追加します。

1. `tsconfig.schematics.json` ファイルを編集して、次の内容を追加します。

<code-example header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="schematics-for-libraries/projects/my-lib/tsconfig.schematics.json">
</code-example>

  * `rootDir` は、`schematics/` フォルダーにコンパイルされる入力ファイルが含まれていることを指定します。

  * `outDir` はライブラリの出力フォルダーにマップされます。デフォルトでは、これはワークスペースのルートにある `dist/my-lib` フォルダーです。

1. Schematics ソースファイルがライブラリバンドルにコンパイルされるようにするには、ライブラリプロジェクトのルートフォルダー (`projects/my-lib`) の `package.json` ファイルに次のスクリプトを追加します。

<code-example header="projects/my-lib/package.json (Build Scripts)" path="schematics-for-libraries/projects/my-lib/package.json">
</code-example>

  * `build` スクリプトは、カスタム `tsconfig.schematics.json` ファイルを使用して Schematic をコンパイルします。
  * `copy:*` ステートメントは、ファイル構造を保持するために、コンパイルされた Schematic ファイルをライブラリ出力フォルダーの適切な場所にコピーします。
  * `build` スクリプトが完了すると、`postbuild` スクリプトが Schematic ファイルをコピーします。

## 生成サポートの提供

名前付きの Schematic をコレクションに追加すると、ユーザーは `ng generate` コマンドを使用して、ライブラリで定義されたアーティファクトを作成できます。

ライブラリは、いくつかの設定を必要とする `my-service` サービスを定義していると想定します。 ユーザーが次の CLI コマンドを使用してそれを生成できるようにする必要があります。

<code-example language="bash">
ng generate my-lib:my-service
</code-example>

まず、`schematics` フォルダに新しいサブフォルダ、`my-service` を作成します。

### 新しい Schematic を設定

コレクションに Schematic を追加するときは、コレクションのスキーマでそれをポイントし、ユーザーがコマンドに渡すことができるオプションを定義した設定ファイルを提供する必要があります。

1. 新しい Schematic のサブフォルダーを指すように `schematics/collection.json` ファイルを編集し、新しい Schematic の入力を指定するスキーマファイルへのポインターを含めます。

<code-example header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="schematics-for-libraries/projects/my-lib/schematics/collection.json">
</code-example>

1. `<lib-root>/schematics/my-service/` フォルダーに移動します。

2. `schema.json` ファイルを作成し、Schematic で使用可能なオプションを定義します。

<code-example header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json">
</code-example>

  * *id*: コレクション内のスキーマの一意のID。
  * *title*: 人が読むことのできるスキーマの説明。
  * *type*: プロパティによって提供されるタイプの記述子。
  * *properties*: Schematic で使用可能なオプションを定義するオブジェクト。

  各オプションは、キーをタイプ、説明、およびオプションのエイリアスに関連付けます。
  タイプは期待する値の型を定義し、ユーザーが Schematic の使用方法のヘルプを要求すると、説明が表示されます。

  Schematic オプションの追加のカスタマイズについては、ワークスペーススキーマを参照してください。

1. `schema.ts` ファイルを作成し、`schema.json` ファイルで定義されたオプションの値を格納するインターフェースを定義します。

<code-example header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts">
</code-example>

  * *name*: 作成したサービスに与える名前。
  * *path*: Schematic に渡されたパスをオーバーライドします。デフォルトのパス値は、現在の作業ディレクトリに基づいています。
  * *project*: Schematic を実行する特定のプロジェクトを与えます。Schematic では、オプションがユーザーによって与えられない場合、デフォルトとなります。

### テンプレートファイルの追加

アーティファクトをプロジェクトに追加するには、Schematic に独自のテンプレートファイルが必要です。
Schematic テンプレートは、コードと変数置換を実行する特別な構文をサポートしています。

1. `schematics/my-service/` フォルダー内に `files/` フォルダーを作成します。

2. ファイルの生成に使用できるテンプレートを定義する `__name@dasherize__.service.ts.template` という名前のファイルを作成します。このテンプレートは、Angularの `HttpClient` がすでにコンストラクターに挿入されたサービスを生成します。

<code-example lang="ts" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service {
  constructor(private http: HttpClient) { }
}

</code-example>

* `classify` メソッドと `dasherize` メソッドは、Schematic がソーステンプレートとファイル名を変換するために使用するユーティリティ関数です。

* `name` は、ファクトリ関数からのプロパティとして与えられます。スキーマで定義した `name` と同じです。

### ファクトリー関数の追加

これでインフラストラクチャが整ったので、ユーザーのプロジェクトで必要な変更を実行するメイン関数を定義できます。

Schematics フレームワークは、パステンプレートとコンテンツテンプレートの両方をサポートするファイルテンプレートシステムを提供します。
システムは、入力 `Tree` にロードされたファイルまたはパス内で定義されたプレースホルダーを操作します。
`Rule` に渡された値を使用してこれらを埋めます。

これらのデータ構造と構文の詳細については、[Schematics の README](https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/schematics/README.md) を参照してください。

1. メインファイル `index.ts` を作成し、Schematic ファクトリ関数のソースコードを追加します。

2. 最初に、必要な Schematics の定義をインポートします。 Schematics フレームワークは、Schematic の実行時にルールを作成および使用するための多くのユーティリティ関数を提供します。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schematics-imports">
</code-example>

1. Schematic のオプションのタイプ情報を提供する定義されたスキーマインターフェースをインポートします。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schema-imports">
</code-example>

1. 生成 Schematic を構築するには、空のルールファクトリから始めます。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" region="factory">
</code-example>

この単純なルールファクトリは、変更をせずにツリーを返します。
オプションは、`ng generate` コマンドから渡されるオプション値です。

## 生成ルールの定義

これで、ユーザーのアプリケーションを実際に変更してライブラリで定義されたサービス用に設定するコードを作成するためのフレームワークが整いました。

ユーザーがライブラリをインストールした Angular ワークスペースには、複数のプロジェクト (アプリケーションとライブラリ) が含まれています。
ユーザーは、コマンドラインでプロジェクトを指定するか、デフォルトにすることができます。
どちらの場合でも、プロジェクト設定から情報を取得できるように、コードはこの Schematic が適用されている特定のプロジェクトを識別する必要があります。

これは、ファクトリ関数に渡される `Tree` オブジェクトを使用して行うことができます。
`Tree` メソッドを使用すると、ワークスペース内の完全なファイルツリーにアクセスできるため、Schematic の実行中にファイルを読み書きできます。

### プロジェクト設定の取得

1. 目的のプロジェクトを判別するには、`Tree.read()` メソッドを使用して、ワークスペースのルートにあるワークスペース設定ファイル `angular.json` の内容を読み取ります。
   次のコードをファクトリー関数に追加します。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="workspace">
</code-example>

  * コンテキストが存在することを確認し、適切なエラーをスローしてください。

  * コンテンツを文字列に読み込んだ後、構造を解析して JSON オブジェクトに変換し、`WorkspaceSchema` に入力します。

1. `WorkspaceSchema` には、指定されていない場合に使用するプロジェクトを決定するための `defaultProject` 値を含む、ワークスペース設定のすべてのプロパティが含まれています。
   `ng generate` コマンドでプロジェクトが明示的に指定されていない場合は、その値をフォールバックとして使用します。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Default Project)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-fallback">
</code-example>

1. これでプロジェクト名がわかったので、それを使用してプロジェクト固有の設定情報を取得します。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Project)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-info">
</code-example>

   `workspace projects` オブジェクトには、プロジェクト固有の設定情報がすべて含まれています。

1. `options.path` は、Schematic が適用された後の Schematic テンプレートファイルの移動先を決定します。

   Schematic のスキーマの `path` オプションは、デフォルトで現在の作業ディレクトリに置き換えられます。
   `path` が定義されていない場合は、`projectType` とともにプロジェクト設定の `sourceRoot` を使用します。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="path">
</code-example>

### ルールの定義

`Rule` は、外部テンプレートファイルを使用してそれらを変換し、変換されたテンプレートを使用して別の `Rule` オブジェクトを返すことができます。 テンプレートを使用して、Schematic に必要なカスタムファイルを生成できます。

1. 次のコードをファクトリー関数に追加します。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="template">
</code-example>

  * `apply()` メソッドは、ソースに複数のルールを適用し、変換されたソースを返します。 ソースとルールの配列の2つの引数を取ります。
  * `url()` メソッドは、Schematic に対して、ファイルシステムからソースファイルを読み取ります。
  * `applyTemplates()` メソッドは、Schematic テンプレートと Schematic ファイル名で使用できるようにするメソッドとプロパティの引数を受け取り、`Rule` を返します。 ここで、`classify()`メソッドと `dasherize()` メソッド、および `name` プロパティを定義します。
  * `classify()` メソッドは値を受け取り、タイトルケースの値を返します。たとえば、提供された名前が `my service` の場合、`MyService` として返されます。
  * `dasherize()` メソッドは値を受け取り、その値を破線と小文字で返します。たとえば、提供された名前が MyService の場合、`my-service` として返されます。
  * `move` メソッドは、Schematic が適用されたときに、与えられたソースファイルを目的の場所に移動します。

1. 最後に、ルールファクトリはルールを返す必要があります。

<code-example header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="chain">
</code-example>

  `chain()` メソッドを使用すると、複数のルールを1つのルールに結合できるため、1つの Schematic で複数の操作を実行できます。
  ここでは、テンプレートルールと Schematic によって実行されるコードをマージするだけです。

Schematic ルール関数の完全な例をご覧ください。

<code-example header="projects/my-lib/schematics/my-service/index.ts" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts">
</code-example>

ルールとユーティリティメソッドの詳細については、[Provided Rules](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/schematics#provided-rules) を参照してください。

## ライブラリ Schematic の実行

ライブラリと Schematics を作成したら、Schematics コレクションをインストールしてプロジェクトに対して実行できます。 次の手順は、上記で作成した Schematic を使用してサービスを生成する方法を示しています。

### ライブラリと schematics の構築

ワークスペースのルートから、ライブラリの `ng build` コマンドを実行します。

<code-example language="bash">

  ng build my-lib

</code-example>

次に、ライブラリディレクトリに移動して、Schematic をビルドします。

<code-example language="bash">

  cd projects/my-lib
  npm run build

</code-example>

### ライブラリのリンク

ライブラリと Schematics がパッケージ化され、ワー​​クスペースのルートにある `dist/my-lib` フォルダーに配置されます。 Schematic を実行するには、ライブラリを `node_modules` フォルダーにリンクする必要があります。 ワークスペースのルートから、配布可能なライブラリへのパスを指定して `npm link` コマンドを実行します。

<code-example language="bash">

npm link dist/my-lib

</code-example>

### Schematic の実行

ライブラリがインストールされたので、`ng generate` コマンドを使用して Schematic を実行できます。

<code-example language="bash">

ng generate my-lib:my-service --name my-data

</code-example>

コンソールで、Schematic が実行され、`my-data.service.ts` ファイルが app フォルダーに作成されたことがわかります。

<code-example language="bash" hideCopy="true">

CREATE src/app/my-data.service.ts (208 bytes)

</code-example>
