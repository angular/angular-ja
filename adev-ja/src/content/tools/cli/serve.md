# 開発用にAngularアプリケーションを配信する

Angular CLIアプリケーションは、`ng serve`コマンドで配信できます。
これにより、アプリケーションがコンパイルされ、不要な最適化がスキップされ、開発サーバーが起動し、その後の変更が自動的に再ビルドおよびライブリロードされます。
サーバーは`Ctrl+C`を押して停止できます。

`ng serve`は、`angular.json`で指定されたデフォルトプロジェクトの`serve`ターゲットのビルダーのみを実行します。
ここでは任意のビルダーを使用できますが、最も一般的（かつデフォルト）なビルダーは`@angular-devkit/build-angular:dev-server`です。

特定のプロジェクトで使用されているビルダーは、そのプロジェクトの`serve`ターゲットを調べることで判断できます。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invokes the Architect target named `serve`.
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          // ...
        },
        "build": { /* ... */ }
        "test": { /* ... */ }
      }
    }
  }
}

</docs-code>

このページでは、`@angular-devkit/build-angular:dev-server`の使用法とオプションについて説明します。

## バックエンドサーバーへのプロキシ {#proxying-to-a-backend-server}

[プロキシサポート](https://webpack.js.org/configuration/dev-server/#devserverproxy)を使用して、特定のURLをバックエンドサーバーに転送するには、`--proxy-config`ビルドオプションにファイルを渡します。
例えば、`http://localhost:4200/api`へのすべての呼び出しを`http://localhost:3000/api`で実行されているサーバーに転送するには、以下の手順を実行します。

1. プロジェクトの`src/`フォルダーに`proxy.conf.json`ファイルを作成します。
1. 新しいプロキシファイルに以下の内容を追加します。

    <docs-code language="json">

    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }

    </docs-code>

1. CLI設定ファイル`angular.json`で、`serve`ターゲットに`proxyConfig`オプションを追加します。

    <docs-code language="json">

    {
      "projects": {
        "my-app": {
          "architect": {
            "serve": {
              "builder": "@angular-devkit/build-angular:dev-server",
              "options": {
                "proxyConfig": "src/proxy.conf.json"
              }
            }
          }
        }
      }
    }

    </docs-code>

1. このプロキシ設定で開発サーバーを実行するには、`ng serve`を呼び出します。

プロキシ設定ファイルを編集して設定オプションを追加します。以下にいくつかの例を示します。
すべてのオプションの詳細については、`@angular-devkit/build-angular:browser`を使用する場合は[webpack DevServerドキュメント](https://webpack.js.org/configuration/dev-server/#devserverproxy)を、または`@angular-devkit/build-angular:browser-esbuild`または`@angular-devkit/build-angular:application`を使用する場合は[Vite DevServerドキュメント](https://vite.dev/config/server-options#server-proxy)を参照してください。

NOTE: プロキシ設定ファイルを編集した場合、変更を有効にするには`ng serve`プロセスを再起動する必要があります。

## `localhost`の解決 {#localhost-resolution}

Nodeバージョン17以降、Nodeは`http://localhost:<port>`を`http://127.0.0.1:<port>`に常に解決するとは限りません
これは各マシンの設定に依存します。

もし`localhost`URLをターゲットとするプロキシを使用している際に`ECONNREFUSED`エラーが発生した場合、
ターゲットを`http://localhost:<port>`から`http://127.0.0.1:<port>`に更新することで、この問題を解決できます。

[`http-proxy-middleware`のドキュメント`](https://github.com/chimurai/http-proxy-middleware#nodejs-17-econnrefused-issue-with-ipv6-and-localhost-705)を参照してください。
詳細については。
