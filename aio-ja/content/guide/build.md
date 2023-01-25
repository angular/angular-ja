# Angularアプリケーションのビルドとサーブ {@a building-and-serving-angular-apps}

このページではAngularプロジェクトのビルド固有の設定オプションを取り上げます。

{@a app-environments}

## アプリケーション環境の設定 {@a configuring-application-environments}

`development`や`staging`など、異なるデフォルト設定を持ったさまざまな名前付きビルド設定をプロジェクトに定義することができます。

それぞれの名前付き設定は、`build`、`serve`や`test`など、さまざまな[builderターゲット](guide/glossary#target)に適用されるオプションすべてについてデフォルト設定をもつことができます。[Angular CLI](cli)の`build`、`serve`、そして`test`コマンドは、ファイルを目的のターゲット環境に適したバージョンに置き換えることができます。

### 環境固有のデフォルトの設定 {@a configure-environment-specific-defaults}

Using the Angular CLI, start by running the [generate environments command](cli/generate#environments-command) shown here to create the `src/environments/` directory and configure the project to use these files.

<code-example format="shell" language="shell">

ng generate environments

</code-example>

The project's `src/environments/` directory contains the base configuration file, `environment.ts`, which provides configuration for `production`, the default environment.
You can override default values for additional environments, such as `development` and `staging`, in target-specific configuration files.

例:

<div class="filetree">
    <div class="file">
        myProject/src/environments
    </div>
    <div class="children">
        <div class="file">
          environment.ts
        </div>
        <div class="file">
          environment.development.ts
        </div>
        <div class="file">
          environment.staging.ts
        </div>
    </div>
</div>

基本ファイル`environment.ts`には、デフォルトの環境設定が含まれています。例:

<code-example format="typescript" language="typescript">

export const environment = {
  production: true
};

</code-example>

環境が指定されない場合、`build`コマンドはこれをビルドターゲットとして使用します。
環境オブジェクトの追加プロパティとして、あるいは個別のオブジェクトとして、さらに変数を追加することができます。
たとえば、次はデフォルト環境に変数のデフォルト値を追加しています:

<code-example format="typescript" language="typescript">

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

</code-example>

`environment.development.ts`のようなターゲット固有の設定ファイルを追加することができます。
次の内容は開発ビルドターゲットのデフォルト値を設定しています:

<code-example format="typescript" language="typescript">

export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};

</code-example>

### アプリケーションでの環境固有の変数の使用 {@a using-environment-specific-variables-in-your-app}

次のアプリケーション構造は`development`環境および`staging`環境用のビルドターゲットを設定しています:

<div class="filetree">
    <div class="file">
        src
    </div>
    <div class="children">
        <div class="file">
          app
        </div>
        <div class="children">
            <div class="file">
              app.component.html
            </div>
            <div class="file">
              app.component.ts
            </div>
        </div>
        <div class="file">
          environments
        </div>
        <div class="children">
            <div class="file">
              environment.ts
            </div>
            <div class="file">
              environment.development.ts
            </div>
            <div class="file">
              environment.staging.ts
            </div>
        </div>
    </div>
</div>

定義した環境設定を使用するには、コンポーネントでオリジナルの環境ファイルをインポートしなければなりません:

<code-example format="typescript" language="typescript">

import { environment } from './../environments/environment';

</code-example>

これによりbuildコマンドとserveコマンドが特定のビルドターゲット用の設定を見つけることができるようになります。

次のコンポーネントファイル(`app.component.ts`)の中のコードは設定ファイルで定義された環境変数を使用しています。

<code-example format="typescript" language="typescript">

  import { Component } from '&commat;angular/core';
  import { environment } from './../environments/environment';

  &commat;Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {
    constructor() {
      console.log(environment.production); // Logs false for development environment
    }

    title = 'app works!';
  }

</code-example>

<a id="file-replacement"></a>

## ターゲット固有ファイルの置換の設定 {@a configure-target-specific-file-replacements}

メインのCLI設定ファイル`angular.json`には、各ビルドターゲットの設定に`fileReplacements`セクションが含まれており、これによりTypeScriptプログラム中の任意のファイルをターゲット固有バージョンのものに置き換えることができます。
これは本番やステージングなどの固有の環境をターゲットとするビルドにおいて、ターゲット固有のコードや変数を含めるのに便利です。

デフォルトではファイルは置き換えられません。
固有のビルドターゲット用のファイルの置き換えを追加することができます。
例:

<code-example format="json" language="json">

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        &hellip;

</code-example>

これは `ng build --configuration development` を使って開発設定でビルドするとき、`src/environment/environment.ts`ファイルはターゲット固有バージョンの`src/environment/environment.development.ts`ファイルに置き換えられることを意味します。

必要に応じてさらに設定を追加することができます。ステージング環境を追加するには、`src/environments/environment.ts`をコピーして`src/environments/environment.staging.ts`を作り、それから`staging`設定を`angular.json`に追加してください:

<code-example format="json" language="json">

  "configurations": {
    "development": { &hellip; },
    "production": { &hellip; },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

</code-example>

このターゲット環境にもさらに設定オプションを追加することができます。
ビルドでサポートされているオプションはすべてビルドターゲット設定でオーバーライドすることができます。

ステージング設定を使ってビルドするには、次のコマンドを実行してください:

<code-example language="sh">
 ng build --configuration=staging
</code-example>

もし`angular.json`の"serve:configurations"セクションにターゲットとなるビルド設定を追加すれば、それを使用するように`serve`コマンドを設定することもできます:

<code-example format="json" language="json">

  "serve": {
    "builder": "&commat;angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-project-name:build"
    },
    "configurations": {
      "development": {
        "browserTarget": "your-project-name:build:development"
      },
      "production": {
        "browserTarget": "your-project-name:build:production"
      },
      "staging": {
        "browserTarget": "your-project-name:build:staging"
      }
    }
  },

</code-example>

<a id="size-budgets"></a>
<a id="configure-size-budgets"></a>

## サイズ予算の設定 {@a configuring-size-budgets}

アプリケーションの機能性が増すにつれて、それらのサイズも大きくなります。
CLIを使用すると、サイズにしきい値を設定してアプリケーションの一部が定義したサイズ境界内に収まるようにすることができます。

CLI設定ファイル（`angular.json`）内の、各[環境設定](#app-environments)用の`budgets`セクションで、サイズの境界を定義してください。

<code-example format="json" language="json">

{
  &hellip;
  "configurations": {
    "production": {
      &hellip;
      "budgets": []
    }
  }
}

</code-example>

アプリケーション全体、および特定の部分に対して、サイズ予算を指定することができます。
各予算エントリは、特定の種類の予算を設定します。
次の形式でサイズ値を指定してください:

| Size value      | Details                                                                     |
| :-------------- | :-------------------------------------------------------------------------- |
| `123` or `123b` | バイト単位のサイズ |
| `123kb`         | キロバイト単位のサイズ |
| `123mb`         | メガバイト単位のサイズ |
| `12%`           | ベースラインに対するサイズの割合。（ベースライン値には無効） |

予算を設定した場合、アプリケーションの特定の部分が設定した境界サイズに達するか超えた際に、ビルドシステムによって警告または報告が行われ、エラーが発生します。

各予算エントリは、次のプロパティをもつJSONオブジェクトです:

| Property       | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | The type of budget. One of: <table> <thead> <tr> <th> Value </th> <th> Details </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> The size of a specific bundle. </td> </tr> <tr> <td> <code>initial</code> </td> <td> The size of JavaScript needed for bootstrapping the application. Defaults to warning at 500kb and erroring at 1mb. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> The size of all scripts. </td> </tr> <tr> <td> <code>all</code> </td> <td> The size of the entire application. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> This size of any one component stylesheet. Defaults to warning at 2kb and erroring at 4kb. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> The size of any one script. </td> </tr> <tr> <td> <code>any</code> </td> <td> The size of any file. </td> </tr> </tbody> </table> |
| name           | The name of the bundle \(for `type=bundle`\).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| baseline       | The baseline size for comparison.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| maximumWarning | The maximum threshold for warning relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| maximumError   | The maximum threshold for error relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| minimumWarning | The minimum threshold for warning relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| minimumError   | The minimum threshold for error relative to the baseline.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| warning        | The threshold for warning relative to the baseline \(min &amp max\).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| error          | The threshold for error relative to the baseline \(min &amp max\).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

{@a commonjs }
## CommonJS の依存関係の設定 {@a configuring-commonjs-dependencies}

<div class="alert is-important">

Angular アプリケーションでは、CommonJS モジュールに依存することは避けた方がよいでしょう。
CommonJS モジュールに依存すると、バンドラーやミニファイヤーがアプリケーションを最適化できなくなり、結果的にバンドルサイズが大きくなります。
代わりに、アプリケーション全体で [ECMAScript モジュール](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)を使用することをお勧めします。
詳細については、[How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles/) を参照してください。

</div>

Angular CLI はブラウザアプリケーションが CommonJS モジュールに依存していることを検知すると警告を出力します。
これらの警告を無効にするには、`angular.json` ファイルにある `build` オプションの `allowedCommonJsDependencies` オプションに CommonJS モジュール名を追加します。

<code-example lang="json">
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     ...
   }
   ...
},
</code-example>

{@a browser-compat}

## ブラウザ互換性の設定 {@a configuring-browser-compatibility}

Angular CLIでは、さまざまなブラウザバージョンとの互換性を確保するために[Browserslist](https://github.com/browserslist/browserslist)を使用しています。CSSのベンダープレフィックスには [Autoprefixer](https://github.com/postcss/autoprefixer) を、JavaScriptの構文変換には [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) を使用しています。

内部的には、Angular CLI は次の `browserslist` 設定を使用し、Angular が[サポートするブラウザ](guide/browser-support) にマッチするように設定します。

  <code-example format="none" language="text">
  last 2 Chrome versions
  last 1 Firefox version
  last 2 Edge major versions
  last 2 Safari major versions
  last 2 iOS major versions
  Firefox ESR
  </code-example>


To override the internal configuration, run [`ng generate browserslist`](cli/generate#config-command), which generates a `.browserslistrc` configuration file in the the project directory.

  <code-example format="none" language="text">
  last 1 Chrome version
  last 1 Firefox version
  </code-example>

特定のブラウザやバージョンを対象にした例については、[browserslistのリポジトリ](https://github.com/browserslist/browserslist) を参照してください。

<div class="alert is-helpful">

[browsersl.ist](https://browsersl.ist) を使うと、`browserslist` クエリに対して互換性のあるブラウザを表示することができます。

</div>

{@a proxy}

## バックエンドサーバーへのプロキシ {@a proxying-to-a-backend-server}

`--proxy-config`ビルドオプションにファイルを渡すことで、`webpack dev server`の[プロキシサポート](https://webpack.js.org/configuration/dev-server/#devserverproxy)を使って、特定のURLをバックエンドサーバーに転送することができます。
たとえば、`http://localhost:4200/api`に対するすべての要求を`http://localhost:3000/api`で実行しているサーバーに転送するには、次の手順を実行してください。

1. `proxy.conf.json` ファイルを、 `package.json` と同じディレクトリにある `src/` フォルダの中に作成します。

2. 次のコンテンツを新しいプロキシファイルに追加します:

    <code-example format="json" language="json">

    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }

    </code-example>

3. CLI設定ファイル`angular.json`の中で, `serve`ターゲットに`proxyConfig`オプションを追加します:

    <code-example format="json" language="json">

      &hellip;
      "architect": {
        "serve": {
        "builder": "&commat;angular-devkit/build-angular:dev-server",
        "options": {
          "browserTarget": "your-application-name:build",
          "proxyConfig": "src/proxy.conf.json"
        },
    &hellip;

    </code-example>

4. このプロキシ設定で開発サーバーを起動するには、`ng serve`を実行します。

プロキシ設定ファイルを編集して設定オプションを追加することができます。次にいくつか例を示します。
すべてのオプションの説明については、[webpack DevServer ドキュメンテーション](https://webpack.js.org/configuration/dev-server/#devserverproxy)を参照してください。

プロキシ設定ファイルを編集した場合、変更を有効にするために`ng serve`プロセスを再起動する必要があることに注意してください。

### URL パスの書き換え {@a rewrite-the-url-path}

`pathRewrite`プロキシ設定オプションを使って実行時にURLパスを書き換えることができます。 
たとえば、次の`pathRewrite`値をプロキシ設定に指定してパスの末尾から"api"を削除することができます。

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}

</code-example>

`localhost`上にないバックエンドにアクセスする必要がある場合は、`changeOrigin`オプションも設定してください。例：

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://npmjs.org",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true
  }
}

</code-example>

プロキシが意図したとおりに動作しているかどうかを判断しやすくするためには、`logLevel`オプションを設定してください。例:

<code-example format="json" language="json">

{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "logLevel": "debug"
  }
}

</code-example>

プロキシのログレベルは`info`（デフォルト）、 `debug`、`warn`、`error`、そして`silent`です。

### 複数エントリのプロキシ {@a proxy-multiple-entries}

JavaScriptで設定を定義することで、同じターゲットに対して複数のエントリをプロキシすることができます。

（`proxy.conf.json`の代わりに）`proxy.conf.mjs`にプロキシ設定を用意し、次の例のように設定ファイルを指定してください。

<code-example format="javascript" language="javascript">

export default [
  {
    context: [
        '/my',
        '/many',
        '/endpoints',
        '/i',
        '/need',
        '/to',
        '/proxy'
    ],
    target: 'http://localhost:3000',
    secure: false
  }
];

</code-example>

CLI設定ファイル`angular.json`で、JavaScriptプロキシ設定ファイルを指定してください。

<code-example format="json" language="json">

&hellip;
"architect": {
  "serve": {
    "builder": "&commat;angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.mjs"
    },
&hellip;

</code-example>

### プロキシのバイパス {@a bypass-the-proxy}

必要に応じてプロキシをバイパスする必要がある場合、または送信前にリクエストを動的に変更する必要がある場合は、このJavaScriptの例に示すように、bypassオプションを追加してください。

<code-example format="javascript" language="javascript">

export default {
  '/api/proxy': {
    "target": 'http://localhost:3000',
    "secure": false,
    "bypass": function (req, res, proxyOptions) {
        if (req.headers.accept.includes('html')) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
        }
        req.headers['X-Custom-Header'] = 'yes';
    }
  }
};

</code-example>

### コーポレートプロキシの使用 {@a using-corporate-proxy}

もしコーポレートプロキシの背後で作業している場合は、ローカルネットワークの外部にあるURLへの要求はバックエンドが直接プロキシできません。
この場合、エージェントを使用してコーポレートプロキシを介して要求をリダイレクトするようにバックエンドプロキシを設定することができます:

<code-example format="shell" language="shell">

npm install --save-dev https-proxy-agent

</code-example>

環境変数`http_proxy`または`HTTP_PROXY`を定義した場合、`npm start`を実行した際にエージェントが自動的に追加されコーポレートプロキシを介して要求を渡します。

JavaScript設定ファイルで次の内容を使用してください。

<code-example format="javascript" language="javascript">

import HttpsProxyAgent from 'https-proxy-agent';

const proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

export default (proxyConfig) => {
  const proxyServer = process.env.http_proxy &verbar;&verbar; process.env.HTTP_PROXY;
  if (proxyServer) {
    const agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);

    for (const entry of proxyConfig) {
      entry.agent = agent;
    }
  }

  return proxyConfig;
};

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-01-17
