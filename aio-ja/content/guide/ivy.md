# Angular Ivy

IvyはAngularの[次世代のコンパイルとパイプラインのレンダリング](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7)についてのコードネームです。
Angularリリースバージョン9では、View Engineとして知られる以前のコンパイラとランタイムの代わりに、新しいコンパイラとランタイム命令がデフォルトで使用されます。

<div class="alert is-helpful">

私達のチームによるこれらの動画で[コンパイラ](https://www.youtube.com/watch?v=anphffaCZrQ)と[ランタイム](https://www.youtube.com/watch?v=S0o-4yc2n-8)についてより学んでください。


</div>

{@a aot-and-ivy}
## AOTとIvy

Ivyを伴ったAOTコンパイルはより速く、デフォルトで使用すべきです。
ワークスペース設定ファイルの`angular.json`において、常にAOTコンパイルを使用するようにデフォルトのビルドオプションをプロジェクトに対して設定してください。
Ivyとともにアプリケーション国際化(i18n)を用いるとき、[翻訳のマージ](guide/i18n#merge)もAOTコンパイルの使用を必要とします。

<code-example language="json" header="angular.json">

{
  "projects": {
    "my-existing-project": {
      "architect": {
        "build": {
          "options": {
            ...
            "aot": true,
          }
        }
      }
    }
  }
}
</code-example>

## Ivyとライブラリ

Ivyアプリケーションは、View Engineコンパイラで作られたライブラリとともにビルドできます。
この互換性は、Angularの互換性コンパイラ(`ngcc`)として知られるツールによって提供されます。
CLIコマンドはAngularビルドの実行時に必要に応じて`ngcc`を実行します。

ライブラリの公開方法についてより詳しくは、[ライブラリを公開する](guide/creating-libraries#publishing-your-library)を参照してください。

{@a maintaining-library-compatibility}
### ライブラリの互換性を維持する

ライブラリの作者の場合、バージョン9現在でView Engineコンパイラの使用を続けるべきです。
すべてのライブラリにView Engineの使用を継続させることで、View Engineの使用を継続することを決めたアプリケーションと同様に、Ivyを使うデフォルトのv9アプリケーションとも互換性を維持することになります。

あなたのAngularライブラリのコンパイルやバンドル方法について詳しくは、[ライブラリを作成する](guide/creating-libraries)ガイドを参照してください。
AngularのCLIや`ng-packagr`へ統合されたツールを使用するときは、ライブラリは常に適切に自動でビルドされます。

{@a ivy-and-universal-app-shell}
## IvyとUniversalやApp shell
バージョン9では、[App shell](guide/app-shell)と[Angular Universal](guide/universal)に使われるサーバービルダはデフォルトで有効な`bundleDependencies`オプションをもちます。
依存関係のバンドルをオプトアウトする場合は、スタンドアロンのAngular互換性コンパイラ(`ngcc`)の実行が必要になるでしょう。これが必要なのは、そうでなければNodeがパッケージのIvyバージョンを解決できなくなるからです。

`postinstall`の[npmスクリプト](https://docs.npmjs.com/misc/scripts)を加えることで、node_modulesのインストールそれぞれの後で`ngcc`を実行できます。

<code-example language="json" header="package.json">
{
  "scripts": {
    "postinstall": "ngcc"
  }
}
</code-example>

<div class="alert is-important">

* `postinstall` スクリプトは、`ng update` や `ng add`によって実行されるものを含め、`node_modules` のすべてのインストールで実行されます。
* `--create-ivy-entry-points`を使わないでください。これが、NodeがパッケージのIvyバージョンを正しく解決しない原因になるからです。

</div>

{@a opting-out-of-angular-ivy}
## バージョン9でIvyをオプトアウトする {@a opting-out-of-ivy-in-version-9}

バージョン9では、Ivyはデフォルトです。
アップデートプロセス中、現在のワークフローとの互換性のため、Ivyのオプトアウトを選択して以前のコンパイラView Engineの使用を継続できます。

<div class="alert is-helpful">

Ivyを無効にする前に、[Ivy互換性ガイド](guide/ivy-compatibility#debugging)でデバッグの推奨事項を確認してください。

</div>

Ivyをオプトアウトするためには、もっとも一般的にはワークスペースのルートに配置された`tsconfig.app.json`の、プロジェクトのTypeScript設定において`angularCompilerOptions`を変更してください。

`enableIvy`フラグの値は、バージョン9からデフォルトで`true`に設定されています。

次の例ではIvyのオプトアウトのために`enableIvy`オプションを`false`に設定する方法を示しています。

<code-example language="json" header="tsconfig.app.json">
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ],
  "angularCompilerOptions": {
    "enableIvy": false
  }
}
</code-example>

<div class="alert is-important">

もしIvyを無効にする場合、[上で](#aot-and-ivy)説明したように、アプリケーション開発でAOTコンパイルをデフォルトにするかどうかについても再考慮したいかもしれません。

コンパイラのデフォルトを元に戻すには、設定ファイル`angular.json`においてビルドオプションの`aot: false`を設定してください。

</div>

もしIvyを無効にしつつプロジェクトが国際化を用いる場合、デフォルトで`src/polyfills.ts`に配置されているプロジェクトのポリフィルファイルから、`@angular/localize`のランタイムコンポーネントも削除できます。

削除するために、ポリフィルファイルから`import '@angular/localize/init';`の行を消してください。

<code-example language="typescript" header="polyfills.ts">
/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
</code-example>

{@a using-ssr-without-angular-ivy}
### IvyなしでSSR使用

もしIvyをオプトアウトしつつ[AngularのUniversal](guide/universal)を用いてサーバー上でAngularアプリケーションをレンダリングする場合、サーバーがブートストラップを実行する方法も変更する必要があります。

次の例は、ブートストラップモジュールとしての`AppServerModuleNgFactory`を提供するために`server.ts`ファイルをどう変更するかを示しています。

* 実際のファイル`app.server.module.ngfactory`から`AppServerModuleNgFactory`をインポートします。
* `ngExpressEngine`の呼び出しにおいて`bootstrap: AppServerModuleNgFactory`を設定します。

<code-example language="typescript" header="server.ts">
import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';

import { AppServerModuleNgFactory } from './src/app/app.server.module.ngfactory';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ivy-test/browser');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}

export * from './src/main.server';
</code-example>
