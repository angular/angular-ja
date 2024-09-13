# ワークスペースとプロジェクトファイルの構造

Angularワークスペースのコンテキストでアプリケーションを開発します。
ワークスペースには、1つ以上のプロジェクトのファイルが含まれています。
プロジェクトとは、アプリケーションまたは共有可能なライブラリを構成するファイルセットのことです。

Angular CLIの `ng new` コマンドは、ワークスペースを作成します。

<docs-code language="shell">

ng new my-project

</docs-code>

このコマンドを実行すると、CLIは *my-project* という名前のルートレベルのアプリケーションを含む新しいワークスペースに、必要なAngular npmパッケージとその他の依存関係をインストールします。

デフォルトでは、`ng new` はワークスペースのルートレベルに、エンドツーエンドテストと共に初期のスケルトンアプリケーションを作成します。
このスケルトンは、実行準備が整っていて、簡単に修正できる単純なウェルカムアプリケーション用です。
ルートレベルのアプリケーションは、ワークスペースと同じ名前を持ち、ソースファイルはワークスペースの `src/` サブフォルダーにあります。

このデフォルトの動作は、各アプリケーションが独自のワークスペースに存在する、一般的な「マルチリポジトリ」開発スタイルに適しています。
初心者や中級者は、`ng new` を使用して、各アプリケーションに別々のワークスペースを作成することをお勧めします。

Angularは、[複数のプロジェクト](#multiple-projects) を持つワークスペースもサポートしています。
このタイプの開発環境は、共有可能なライブラリを開発している上級ユーザーや、
すべてのAngularプロジェクトに単一のレポジトリとグローバル構成を使用する「モノリポ」開発スタイルを使用する企業に適しています。

モノリポジトリワークスペースを設定するには、ルートアプリケーションの作成をスキップする必要があります。
以下の[マルチプロジェクトワークスペースの設定](#multiple-projects) を参照してください。

## ワークスペース構成ファイル {#workspace-configuration-files}

ワークスペース内のすべてのプロジェクトは、[構成](reference/configs/workspace-config) を共有します。
ワークスペースの最上位レベルには、ワークスペース全体の構成ファイル、ルートレベルのアプリケーションの構成ファイル、ルートレベルのアプリケーションのソースファイルとテストファイルのサブフォルダーが含まれています。

| ワークスペース構成ファイル | 目的                                                                                                                                                                                                                                                                                                          |
|:---                           |:---                                                                                                                                                                                                                                                                                                              |
| `.editorconfig`               | コードエディターの構成。[EditorConfig](https://editorconfig.org) を参照してください。                                                                                                                                                                                                                                    |
| `.gitignore`                  | [Git](https://git-scm.com) が無視する必要がある意図的に追跡されていないファイルを指定します。                                                                                                                                                                                                                           |
| `README.md`                   | ワークスペースのドキュメント。                                                                                                                                                                                                                                                                                 |
| `angular.json`                | ワークスペース内のすべてのプロジェクトの CLI 構成。各プロジェクトのビルド、提供、およびテスト方法の構成オプションを含みます。詳細については、[Angular ワークスペース構成](reference/configs/workspace-config) を参照してください。                                                                                     |
| `package.json`                | ワークスペース内のすべてのプロジェクトで使用可能な [npm パッケージ依存関係](reference/configs/npm-packages) を構成します。このファイルの具体的な形式と内容については、[npm ドキュメント](https://docs.npmjs.com/files/package.json) を参照してください。                                                                 |
| `package-lock.json`           | npm クライアントによって `node_modules` にインストールされたすべてのパッケージのバージョン情報を提供します。詳細については、[npm ドキュメント](https://docs.npmjs.com/files/package-lock.json) を参照してください。                                                                                                                              |
| `src/`                        | ルートレベルのアプリケーションプロジェクトのソースファイル。                                                                                                                                                                                                                                                             |
| `public/`                     | 開発サーバーによって静的ファイルとして提供される画像やその他の資産ファイルを含み、アプリケーションをビルドする際にそのままコピーされます。                                                                                             |
| `node_modules/`               | ワークスペース全体でインストールされた [npm パッケージ](reference/configs/npm-packages) 。ワークスペース全体の `node_modules` 依存関係は、すべてのプロジェクトから表示できます。                                                                                                                                                       |
| `tsconfig.json`               | ワークスペース内のプロジェクトのベースとなる [TypeScript](https://www.typescriptlang.org) 構成。その他のすべての構成ファイルはこのベースファイルから継承します。詳細については、[関連する TypeScript ドキュメント](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) を参照してください。 |

## アプリケーションプロジェクトファイル

デフォルトでは、CLIコマンド `ng new my-app` は、"my-app" という名前のワークスペースフォルダーを作成し、ワークスペースの最上位レベルの `src/` フォルダーに新しいアプリケーションスケルトンを生成します。
新しく生成されたアプリケーションには、ルートモジュール用のソースファイルが含まれており、ルートコンポーネントとテンプレートが含まれています。

ワークスペースファイル構造が整ったら、コマンドラインで `ng generate` コマンドを使用して、機能とデータをアプリケーションに追加できます。
この初期のルートレベルアプリケーションは、CLIコマンドの*デフォルトのアプリケーション*です（[追加のアプリケーション](#multiple-projects) を作成した後にデフォルトを変更しない限り）。

単一アプリケーションのワークスペースの場合、ワークスペースの `src` サブフォルダーには、ルートアプリケーションのソースファイル（アプリケーションロジック、データ、資産）が含まれています。
マルチプロジェクトのワークスペースの場合、`projects` フォルダー内の追加のプロジェクトには、`project-name/src/` サブフォルダーが含まれており、同じ構造になっています。

### アプリケーションソースファイル {#app-src}

`src/` の最上位レベルにあるファイルは、アプリケーションの実行をサポートします。
サブフォルダーには、アプリケーションのソースとアプリケーション固有の構成が含まれています。

| アプリケーションサポートファイル | 目的                                                                                                                                                                                                                           |
|:---                       |:---                                                                                                                                                                                                                               |
| `app/`                    | アプリケーションロジックとデータが定義されているコンポーネントファイルが含まれています。[以下](#app-src) の詳細を参照してください。                                                                                                                 |
| `favicon.ico`             | ブックマークバーでこのアプリケーションに使用するアイコン。                                                                                                                                                                          |
| `index.html`              | ユーザーがサイトにアクセスしたときに提供されるメインの HTML ページ。CLI は、アプリケーションをビルドするときにすべての JavaScript ファイルと CSS ファイルを自動的に追加するので、通常、手動で `<script>` または `<link>` タグを追加する必要はありません。 |
| `main.ts`                 | アプリケーションのメインのエントリポイント。                                                                                                                                                                                        |
| `styles.css`              | アプリケーション全体に適用されるグローバルな CSS スタイル。                                                                                                                                                                              |

`src` フォルダー内では、`app` フォルダーにプロジェクトのロジックとデータが含まれています。
Angularコンポーネント、テンプレート、スタイルはここにあります。

| `src/app/` ファイル        | 目的                                                                                                                                                                                                                                                                            |
|:---                     |:---                                                                                                                                                                                                                                                                                |
| `app.config.ts`         | アプリケーション構成を定義します。これは、Angular にアプリケーションをどのようにアセンブルするかを指示します。アプリケーションにさらにプロバイダーを追加する場合は、ここで宣言する必要があります。<br><br>* `--standalone` オプションを使用した場合にのみ生成されます。*                                                        |
| `app.component.ts`      | アプリケーションのルートコンポーネント (`AppComponent` と呼ばれます) を定義します。このルートコンポーネントに関連付けられたビューは、アプリケーションにコンポーネントとサービスを追加する際に、ビュー階層のルートになります。                                                                        |
| `app.component.html`    | `AppComponent` に関連付けられた HTML テンプレートを定義します。                                                                                                                                                                                                                          |
| `app.component.css`     | `AppComponent` の CSS スタイルシートを定義します。                                                                                                                                                                                                                                     |
| `app.component.spec.ts` | `AppComponent` のユニットテストを定義します。                                                                                                                                                                                                                                            |
| `app.module.ts`         | ルートモジュール (`AppModule` と呼ばれます) を定義します。これは、Angular にアプリケーションをどのようにアセンブルするかを指示します。最初は、`AppComponent` のみが宣言されます。アプリケーションにさらにコンポーネントを追加する場合は、ここで宣言する必要があります。<br><br>* `--standalone false` オプションを使用した場合にのみ生成されます。* |
| `app.routes.ts`         | アプリケーションのルーティング構成を定義します。                                                                                                                                                                                                                                   |

### アプリケーション構成ファイル

ルートアプリケーションのアプリケーション固有の構成ファイルは、ワークスペースのルートレベルにあります。
マルチプロジェクトのワークスペースの場合、プロジェクト固有の構成ファイルは、`projects/project-name/` の下のプロジェクトルートにあります。

プロジェクト固有の [TypeScript](https://www.typescriptlang.org) 構成ファイルは、ワークスペース全体の `tsconfig.json` から継承します。

| アプリケーション固有の構成ファイル | 目的                                                                                                                                                                                             |
|:---                                      |:---                                                                                                                                                                                                 |
| `tsconfig.app.json`                      | アプリケーション固有の [TypeScript 構成](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。[Angular コンパイラーオプション](reference/configs/angular-compiler-options) を含みます。 |
| `tsconfig.spec.json`                     | アプリケーションテストの [TypeScript 構成](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                                                                                  |

## 複数のプロジェクト {#multiple-projects}

マルチプロジェクトのワークスペースは、複数のAngularプロジェクトに単一のレポジトリとグローバル構成を使用する組織（「モノリポ」モデル）に適しています。
マルチプロジェクトのワークスペースは、ライブラリの開発もサポートしています。

### マルチプロジェクトワークスペースの設定

ワークスペースに複数のプロジェクトを含める場合は、ワークスペースを作成するときに、初期のアプリケーションの生成をスキップし、ワークスペースに一意の名前を付けることができます。
次のコマンドは、ワークスペース全体の構成ファイルはすべて作成しますが、ルートレベルのアプリケーションは作成しません。

<docs-code language="shell">

ng new my-workspace --no-create-application

</docs-code>

その後、ワークスペース内で一意の名前を持つアプリケーションとライブラリを生成できます。

<docs-code language="shell">

cd my-workspace
ng generate application my-app
ng generate library my-lib

</docs-code>

### 複数のプロジェクトのファイル構造

最初に明示的に生成されたアプリケーションは、`projects` フォルダーに、ワークスペース内の他のすべてのプロジェクトと共に格納されます。
新しく生成されたライブラリも `projects` の下に追加されます。
このようにプロジェクトを作成すると、ワークスペースのファイル構造は、[ワークスペース構成ファイル](reference/configs/workspace-config) の構造 (`angular.json`) と完全に一致しています。

```markdown
my-workspace/
  ├── …                (ワークスペース全体の構成ファイル)
  └── projects/        (アプリケーションとライブラリ)
      ├── my-app/      (明示的に生成されたアプリケーション)
      │   └── …        (アプリケーション固有のコードと構成)
      └── my-lib/      (生成されたライブラリ)
          └── …        (ライブラリ固有のコードと構成)
```

## ライブラリプロジェクトファイル

CLIを使用してライブラリを生成する（`ng generate library my-lib` などのコマンド）と、生成されたファイルはワークスペースの `projects/` フォルダーに格納されます。
独自のライブラリを作成する方法の詳細については、[ライブラリの作成](tools/libraries/creating-libraries) を参照してください。

アプリケーションとは異なり、ライブラリには独自の `package.json` 構成ファイルがあります。

`projects/` フォルダーの下には、`my-lib` フォルダーにライブラリコードが含まれています。

| ライブラリソースファイル     | 目的                                                                                                                                                                                         |
|:---                      |:---                                                                                                                                                                                             |
| `src/lib`                | ライブラリプロジェクトのロジックとデータが含まれています。アプリケーションプロジェクトと同様に、ライブラリプロジェクトには、コンポーネント、サービス、モジュール、ディレクティブ、パイプを含めることができます。                                |
| `src/public-api.ts`      | ライブラリからエクスポートされるすべてのファイルを指定します。                                                                                                                                        |
| `ng-package.json`        | ライブラリをビルドするために [ng-packagr](https://github.com/ng-packagr/ng-packagr) によって使用される構成ファイル。                                                                                    |
| `package.json`           | このライブラリに必要な [npm パッケージ依存関係](reference/configs/npm-packages) を構成します。                                                                                       |
| `tsconfig.lib.json`      | ライブラリ固有の [TypeScript 構成](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。[Angular コンパイラーオプション](reference/configs/angular-compiler-options) を含みます。 |
| `tsconfig.lib.prod.json` | ライブラリを production モードでビルドするときに使用されるライブラリ固有の [TypeScript 構成](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                         |
| `tsconfig.spec.json`     | ライブラリのユニットテストの [TypeScript 構成](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。                                                                       |
