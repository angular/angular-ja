# Usage of Angular libraries published to npm

Angular アプリケーションを構築する際には、高度な自社製ライブラリや、サードパーティライブラリの豊富なエコシステムを活用できます。
[Angular Material][AngularMaterialMain] is an example of a sophisticated first-party library.
For links to the most popular libraries, see [Angular Resources][AioResources].

## ライブラリのインストール

ライブラリは、通常それらを Angular CLI と統合するスキーマとともに、[npm パッケージ][AioGuideNpmPackages]として公開されます。
再利用可能なライブラリコードをアプリケーションに統合するには、パッケージをインストールし、提供されている機能を使用する場所にインポートする必要があります。
公開されているほとんどのAngularライブラリでは、Angular CLI の `ng add <lib_name>` コマンドを使用できます。

The `ng add` Angular CLI command uses a package manager to install the library package and invokes schematics that are included in the package to other scaffolding within the project code.
Examples of package managers include [npm][NpmjsMain] or [yarn][YarnpkgMain].
Additional scaffolding within the project code includes import statements, fonts, and themes.

公開ライブラリは通常、そのライブラリをアプリケーションに追加する方法についての `README` またはその他のドキュメントを提供します。
For an example, see the [Angular Material][AngularMaterialMain] documentation.

### ライブラリの型定義

Typically, library packages include typings in `.d.ts` files; see examples in `node_modules/@angular/material`.
If the package of your library does not include typings and your IDE complains, you might need to install the `@types/<lib_name>` package with the library.

たとえば、`d3` という名前のライブラリがあるとします。

<code-example format="shell" language="shell">

npm install d3 --save
npm install &commat;types/d3 --save-dev

</code-example>

ワークスペースにインストールされたライブラリの `@types/` パッケージで定義された型は、そのライブラリを使用するプロジェクトの TypeScript 構成に自動的に追加されます。
TypeScript はデフォルトで `node_modules/@types` ディレクトリで型を探すので、各型パッケージを個別に追加する必要はありません。

ライブラリの `@types/` で利用可能な型定義がない場合でも、手動で型定義を追加して使用できます。
このようにします：

1.  `src/` ディレクトリに `typings.d.ts` ファイルを作成してください。
    このファイルは自動的にグローバル型定義として含まれます。

1.  次のコードを `src/typings.d.ts` に追加してください。

    <code-example format="typescript" language="typescript">

    declare module 'host' {
      export interface Host {
        protocol?: string;
        hostname?: string;
        pathname?: string;
      }
      export function parse(url: string, queryString?: string): Host;
    }

    </code-example>

3. ライブラリを使用するコンポーネントまたはファイルに、次のコードを追加します。

    <code-example format="typescript" language="typescript">

    import * as host from 'host';
    const parsedUrl = host.parse('https://angular.io');
    console.log(parsedUrl.hostname);

    </code-example>

必要に応じてもっと型定義を定義できます。

## ライブラリを更新する

ライブラリは、公開者が更新することができ、そしてまた最新に保つ必要がある自身の依存関係を持っています。
To check for updates to your installed libraries, use the [`ng update`][AioCliUpdate] Angular CLI command.

個々のライブラリのバージョンを更新するには、`ng update <lib_name>` を使用します。
Angular CLI はライブラリの最新リリースをチェックし、最新バージョンがインストール済みバージョンより新しい場合はそれをダウンロードし、最新バージョンに一致するように `package.json` を更新します。

Angular を新しいバージョンにアップデートするときは、使用しているライブラリが最新のものであることを確認する必要があります。
ライブラリに相互依存関係がある場合は、それらを特定の順序で更新する必要があります。
[Angular 更新ガイド][AngularUpdateMain] を参照してください。

## 実行時グローバルスコープへのライブラリの追加

アプリケーションにインポートされていない従来の JavaScript ライブラリは、ランタイムグローバルスコープに追加して、あたかも script タグの中にあるかのように読み込むことができます。
Configure the Angular CLI to do this at build time using the `scripts` and `styles` options of the build target in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.

たとえば、 [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction] ライブラリを使用するには、まず npm パッケージマネージャーを使用してライブラリとその依存関係をインストールします。

1.  Install the library and the associated dependencies using the npm package manager:

    <code-example format="shell" language="shell">

    npm install jquery --save
    npm install popper.js --save
    npm install bootstrap --save

    </code-example>

1.  In the `angular.json` configuration file, add the associated script files to the `scripts` array:

    <code-example format="json" language="json">

    "scripts": [
      "node_modules/jquery/dist/jquery.slim.js",
      "node_modules/popper.js/dist/umd/popper.js",
      "node_modules/bootstrap/dist/js/bootstrap.js"
    ],

    </code-example>

1.  Add the `bootstrap.css` CSS file to the `styles` array:

    <code-example format="css" language="css">

    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.css",
      "src/styles.css"
    ],

    </code-example>

1.  Run or restart the `ng serve` Angular CLI command to see Bootstrap 4 work in your application.

### アプリケーション内で実行時グローバルライブラリを使用する {@a using-runtime-global-libraries-inside-your-app}

After you import a library using the "scripts" array, do **not** import it using an import statement in your TypeScript code.
The following code snippet is an example import statement.

<code-example format="typescript" language="typescript">

import * as &dollar; from 'jquery';

</code-example>

If you import it using import statements, you have two different copies of the library: one imported as a global library, and one imported as a module.
これは JQuery のようなプラグインをもつライブラリにとっては特に悪いです。なぜなら、個々のコピーは異なるプラグインをもつからです。

Instead, run the `npm install @types/jquery` Angular CLI command to download typings for your library and then follow the library installation steps.
これにより、そのライブラリによって公開されているグローバル変数にアクセスできます。

### 実行時グローバルライブラリの型定義の定義

使う必要があるグローバルライブラリがグローバル型定義を持っていないなら、手動で `src/typings.d.ts`の中で `any` として宣言することができます。

たとえば：

<code-example format="typescript" language="typescript">

declare var libraryName: any;

</code-example>

他のライブラリを拡張するスクリプトもあります。たとえば JQuery プラグインを使うと：

<code-example format="typescript" language="typescript">

&dollar;('.test').myPlugin();

</code-example>

この場合、インストールされている `@types/jquery` には `myPlugin` が含まれていないため、`src/typings.d.ts` にインターフェースを追加する必要があります。
たとえば：

<code-example format="typescript" language="typescript">

interface JQuery {
  myPlugin(options?: any): any;
}

</code-example>

スクリプト定義の拡張機能用のインターフェースを追加しないと、IDE にエラーが表示されます。

<code-example format="none" language="none">

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

</code-example>

<!-- links -->

[AioCliUpdate]: cli/update "ng update | CLI |Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"
[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

[AioResources]: resources "Explore Angular Resources | Angular"

<!-- external links -->

[AngularMaterialMain]: https://material.angular.io "Angular Material | Angular"

[AngularUpdateMain]: https://update.angular.io "Angular Update Guide | Angular"

[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction "Introduction | Bootstrap"

[NpmjsMain]: https://www.npmjs.com "npm"

[YarnpkgMain]: https://yarnpkg.com " Yarn"

<!-- end links -->

@reviewed 2022-01-05
