# Angularアプリのビルドとサーブ

このページではAngularプロジェクトのビルド固有の設定オプションを取り上げます。

{@a app-environments}

## アプリケーション環境の設定

*stage*や*production*など、さまざまなデフォルト設定を持ったさまざまな名前付きビルド設定をプロジェクトに定義することができます。

それぞれの名前付き設定は、`build`、`serve`や`test`など、さまざまな[builderターゲット](guide/glossary#target)に適用されるオプションすべてについてデフォルト設定をもつことができます。[Angular CLI](cli)の`build`、`serve`、そして`test`コマンドは、ファイルを目的のターゲット環境に適したバージョンに置き換えることができます。

### 環境固有のデフォルトの設定

プロジェクトの`src/environment/`フォルダにはデフォルト環境を提供する基本設定ファイル`environment.ts`が含まれています。
ターゲット固有の設定ファイルを追加すれば、本番やステージングなどの環境用にデフォルト設定をオーバーライドすることができます。

例:

```
└──myProject/src/environments/
                   └──environment.ts
                   └──environment.prod.ts
                   └──environment.stage.ts
```

基本ファイル`environment.ts`には、デフォルトの環境設定が含まれています。例:

```
export const environment = {
  production: false
};
```

環境が指定されない場合、`build`コマンドはこれをビルドターゲットとして使用します。
環境オブジェクトの追加プロパティとして、あるいは個別のオブジェクトとして、さらに変数を追加することができます。
たとえば、次はデフォルト環境に変数のデフォルト値を追加しています:

```
export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};
```

`environment.prod.ts`のようなターゲット固有の設定ファイルを追加することができます。
次の内容は本番ビルドターゲットのデフォルト値を設定しています:

```
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};
```

### アプリで環境固有の変数の使用

次のアプリケーション構造は本番環境およびステージング環境用のビルドターゲットを設定しています:

```
└── src
    └── app
        ├── app.component.html
        └── app.component.ts
    └── environments
        ├── environment.prod.ts
        ├── environment.staging.ts
        └── environment.ts
```

定義した環境設定を使用するには、コンポーネントでオリジナルの環境ファイルをインポートしなければなりません:

```
import { environment } from './../environments/environment';
```

これによりbuildコマンドとserveコマンドが特定のビルドターゲット用の設定を見つけることができるようになります。

次のコンポーネントファイル(`app.component.ts`)の中のコードは設定ファイルで定義された環境変数を使用しています。

```
import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    console.log(environment.production); // Logs false for default environment
  }
  title = 'app works!';
}
```
{@a file-replacement}

## ターゲット固有ファイルの置換の設定 {@a configure-target-specific-file-replacements}

メインのCLI設定ファイル`angular.json`には、各ビルドターゲットの設定に`fileReplacements`セクションが含まれており、これにより任意のファイルをターゲット固有バージョンのものに置き換えることができます。
これは本番やステージングなどの固有の環境をターゲットとするビルドにおいて、ターゲット固有のコードや変数を含めるのに便利です。

デフォルトではファイルは置き換えられません。
固有のビルドターゲット用のファイルの置き換えを追加することができます。
例:

```
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    ...
```

これは（`ng build --prod`または`ng build --configuration=production`を使って）本番設定をビルドするとき、`src/environment/environment.ts`ファイルはターゲット固有バージョンの`src/environment/environment.prod.ts`ファイルに置き換えられることを意味します。

必要に応じてさらに設定を追加することができます。ステージング環境を追加するには、`src/environments/environment.ts`をコピーして`src/environments/environment.staging.ts`を作り、それから`staging`設定を`angular.json`に追加してください:

```
"configurations": {
  "production": { ... },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}
```

このターゲット環境にもさらに設定オプションを追加することができます。
ビルドでサポートされているオプションはすべてビルドターゲット設定でオーバーライドすることができます。

ステージング設定を使ってビルドするには、次のコマンドを実行してください:

<code-example language="sh" class="code-shell">
 ng build --configuration=staging
</code-example>

もし`angular.json`の"serve:configurations"セクションにターゲットとなるビルド設定を追加すれば、それを使用するように`serve`コマンドを設定することもできます:

```
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "your-project-name:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "your-project-name:build:production"
    },
    "staging": {
      "browserTarget": "your-project-name:build:staging"
    }
  }
},
```

{@a size-budgets}
{@a configure-size-budgets}

## サイズ予算の設定

アプリケーションの機能性が増すにつれて、それらのサイズも大きくなります。
CLIを使用すると、サイズにしきい値を設定してアプリケーションの一部が定義したサイズ境界内に収まるようにすることができます。

CLI設定ファイル（`angular.json`）内の、各[環境設定](#app-environments)用の`budgets`セクションで、サイズの境界を定義してください。

```
{
  ...
  "configurations": {
    "production": {
      ...
      budgets: []
    }
  }
}
```

アプリケーション全体、および特定の部分に対して、サイズ予算を指定することができます。
各予算エントリは、特定の種類の予算を設定します。
次の形式でサイズ値を指定してください:

* 123 or 123b: バイト単位のサイズ

* 123kb: キロバイト単位のサイズ

* 123mb: メガバイト単位のサイズ

* 12%: ベースラインに対するサイズの割合。（ベースライン値には無効）

予算を設定した場合、アプリの特定の部分が設定した境界サイズに達するか超えた際に、ビルドシステムによって警告または報告が行われ、エラーが発生します。

各予算エントリは、次のプロパティをもつJSONオブジェクトです:

<table>
  <tr>
    <th>プロパティ</th>
    <th>値</th>
  </tr>

  <tr>
    <td>type</td>
    <td>
    
    予算の種類。次のうちどれか:

* `bundle` - 特定のバンドルのサイズ。
* `initial` - アプリの初期サイズ。
* `allScript` - 全スクリプトのサイズ。
* `all` - アプリ全体のサイズ。
* `anyComponentStyle` - いずれか1つのコンポーネントのスタイルシートのサイズ。
* `anyScript` - いずれか1つのスクリプトのサイズ。
* `any` - いずれかのファイルのサイズ。

    </td>
  </tr>
   <tr>
    <td>name</td>
    <td>
    
    バンドルの名前（`type=bundle`の場合）。
    
    </td>
  </tr>
  <tr>
    <td>baseline</td>
    <td>比較のためのベースラインサイズ。</td>
  </tr>
  <tr>
    <td>maximumWarning</td>
    <td>ベースラインに対する警告の最大しきい値。</td>
  </tr>
  <tr>
    <td>maximumError</td>
    <td>ベースラインに対するエラーの最大しきい値。</td>
  </tr>
  <tr>
    <td>minimumWarning</td>
    <td>ベースラインに対する警告の最小しきい値。</td>
  </tr>
  <tr>
    <td>minimumError</td>
    <td>ベースラインに対するエラーの最小しきい値。</td>
  </tr>
  <tr>
    <td>warning</td>
    <td>ベースラインに対する警告のしきい値（最小および最大）。</td>
  </tr>
  <tr>
    <td>error</td>
    <td>ベースラインに対するエラーのしきい値（最小および最大）。</td>
  </tr>

 </table>


{@a browser-compat}

## ブラウザ互換性の設定

CLIは[Autoprefixer](https://github.com/postcss/autoprefixer)を使ってさまざまなブラウザやブラウザバージョンとの互換性を保証しています。
特定のブラウザをターゲットにしたり、特定のブラウザバージョンをビルドから除外したりする必要が出てくるかもしれません。

内部的には、Autoprefixerは[Browserslist](https://github.com/browserslist/browserslist)というライブラリに頼り、どのブラウザを接頭辞付きでサポートするかを判断しています。
Browserlistはパッケージ設定ファイルの`browserslist`プロパティ、または`.browserslistrc`という名前の設定ファイルから設定オプションを探します。
AutoprefixerはCSSに接頭辞をつける際に`browserslist`の設定を探します。

* パッケージ設定ファイル`package.json`にbrowserslistプロパティを追加することで、どのブラウザをターゲットにするかをAutoprefixerに伝えることができます:
```
 "browserslist": [
   "> 1%",
   "last 2 versions"
 ]
```

* あるいは、新しいファイル`.browserslistrc`をプロジェクトディレクトリに追加して、サポートしたいブラウザを指定することもできます:
```
 ### Supported Browsers
 > 1%
 last 2 versions
```

特定のブラウザとバージョンをターゲットにする方法の例については[browserslistのリポジトリ](https://github.com/browserslist/browserslist)を参照してください。

### Backward compatibility with Lighthouse

もしプログレッシブウェブアプリを作成したくてプロジェクト評価に[Lighthouse](https://developers.google.com/web/tools/lighthouse/)を使用したい場合は、[古いFlexbox](https://developers.google.com/web/tools/lighthouse/audits/old-flexbox)の接頭辞を削除するために、次の`browserslist`エントリを`package.json`に追加してください:

```
"browserslist": [
  "last 2 versions",
  "not ie <= 10",
  "not ie_mob <= 10"
]
```

### Backward compatibility with CSS grid

CSS grid layout support in Autoprefixer, which was previously on by default, is off by default in Angular 8 and higher.

To use CSS grid with IE10/11, you must explicitly enable it using the `autoplace` option.
To do this, add the following to the top of the global styles file (or within a specific css selector scope):

```
/* autoprefixer grid: autoplace /
```
or
```
/ autoprefixer grid: no-autoplace */
```

For more information, see [Autoprefixer documentation](https://autoprefixer.github.io/).


{@a proxy}

## バックエンドサーバーへのプロキシ

`--proxy-config`ビルドオプションにファイルを渡すことで、`webpack dev server`の[プロキシサポート](https://webpack.js.org/configuration/dev-server/#devserverproxy)を使って、特定のURLをバックエンドサーバーに転送することができます。
たとえば、`http://localhost:4200/api`に対するすべての要求を`http://localhost:3000/api`で実行しているサーバーに転送するには、次の手順を実行してください。

1. `proxy.conf.json` ファイルを、 `package.json` と同じディレクトリにある `src/` フォルダの中に作成します。

2. 次のコンテンツを新しいプロキシファイルに追加します:
    ```
    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }
    ```

3. CLI設定ファイル`angular.json`の中で, `serve`ターゲットに`proxyConfig`オプションを追加します:
    ```
    ...
    "architect": {
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "options": {
          "browserTarget": "your-application-name:build",
          "proxyConfig": "src/proxy.conf.json"
        },
    ...
    ```

4. このプロキシ設定で開発サーバーを起動するには、`ng serve`を実行します。

プロキシ設定ファイルを編集して設定オプションを追加することができます。次にいくつか例を示します。
すべてのオプションの説明については、[webpack DevServer ドキュメンテーション](https://webpack.js.org/configuration/dev-server/#devserverproxy)を参照してください。

プロキシ設定ファイルを編集した場合、変更を有効にするために`ng serve`プロセスを再起動する必要があることに注意してください。

### URLパスの書き換え

`pathRewrite`プロキシ設定オプションを使って実行時にURLパスを書き換えることができます。 
たとえば、次の`pathRewrite`値をプロキシ設定に指定してパスの末尾から"api"を削除することができます。

```
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

`localhost`上にないバックエンドにアクセスする必要がある場合は、`changeOrigin`オプションも設定してください。例：

```
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
```

プロキシが意図したとおりに動作しているかどうかを判断しやすくするためには、`logLevel`オプションを設定してください。例:

```
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
```

プロキシのログレベルは`info`（デフォルト）、 `debug`、`warn`、`error`、そして`silent`です。

### 複数エントリのプロキシ

JavaScriptで設定を定義することで、同じターゲットに対して複数のエントリをプロキシすることができます。

（`proxy.conf.json`の代わりに）`proxy.conf.js`にプロキシ設定を用意し、次の例のように設定ファイルを指定してください。

```
const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

CLI設定ファイル`angular.json`で、JavaScriptプロキシ設定ファイルを指定してください。

```
...
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.js"
    },
...
```

### プロキシのバイパス

必要に応じてプロキシをバイパスする必要がある場合、または送信前にリクエストを動的に変更する必要がある場合は、このJavaScriptの例に示すように、bypassオプションを追加してください。

```
const PROXY_CONFIG = {
    "/api/proxy": {
        "target": "http://localhost:3000",
        "secure": false,
        "bypass": function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html") !== -1) {
                console.log("Skipping proxy for browser request.");
                return "/index.html";
            }
            req.headers["X-Custom-Header"] = "yes";
        }
    }
}

module.exports = PROXY_CONFIG;
```

### コーポレートプロキシの使用

もしコーポレートプロキシの背後で作業している場合は、ローカルネットワークの外部にあるURLへの要求はバックエンドが直接プロキシできません。
この場合、エージェントを使用してコーポレートプロキシを介して要求をリダイレクトするようにバックエンドプロキシを設定することができます:

<code-example language="none" class="code-shell">
npm install --save-dev https-proxy-agent
</code-example>

環境変数`http_proxy`または`HTTP_PROXY`を定義した場合、`npm start`を実行した際にエージェントが自動的に追加されコーポレートプロキシを介して要求を渡します。

JavaScript設定ファイルで次の内容を使用してください。

```
var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
```
