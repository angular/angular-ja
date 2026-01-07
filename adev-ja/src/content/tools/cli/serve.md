# 開発用にAngularアプリケーションを配信する

Angular CLIアプリケーションは、`ng serve`コマンドで配信できます。
これにより、アプリケーションがコンパイルされ、不要な最適化がスキップされ、開発サーバーが起動し、その後の変更が自動的に再ビルドおよびライブリロードされます。
サーバーは`Ctrl+C`を押して停止できます。

`ng serve`は、`angular.json`で指定されたデフォルトプロジェクトの`serve`ターゲットのビルダーのみを実行します。ここでは任意のビルダーを使用できますが、最も一般的(かつデフォルト)なビルダーは`@angular/build:dev-server`です。

特定のプロジェクトで使用されているビルダーは、そのプロジェクトの`serve`ターゲットを調べることで判断できます。

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invokes the Architect target named `serve`.
        "serve": {
          "builder": "@angular/build:dev-server"
          // ...
        },
        "build": {
          /* ... */
        },
        "test": {
          /* ... */
        }
      }
    }
  }
}
```

## バックエンドサーバーへのプロキシ {#proxying-to-a-backend-server}

[プロキシサポート](https://vite.dev/config/server-options#server-proxy)を使用して、特定のURLをバックエンドサーバーに転送するには、`--proxy-config`ビルドオプションにファイルを渡します。
例えば、`http://localhost:4200/api`へのすべての呼び出しを`http://localhost:3000/api`で実行されているサーバーに転送するには、以下の手順を実行します。

1. プロジェクトの`src/`フォルダーに`proxy.conf.json`ファイルを作成します。
1. 新しいプロキシファイルに以下の内容を追加します。

```json
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

1. CLI設定ファイル`angular.json`で、`serve`ターゲットに`proxyConfig`オプションを追加します。

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          }
        }
      }
    }
  }
}
```

1. このプロキシ設定で開発サーバーを実行するには、`ng serve`を呼び出します。

NOTE: プロキシ設定ファイルに加えた変更を適用するには、`ng serve`プロセスを再起動する必要があります。

### パスマッチングの挙動はビルダーに依存する {#path-matching-behavior-depends-on-the-builder}

**`@angular/build:dev-server`** ([Vite](https://vite.dev/config/server-options#server-proxy)ベース)

- `/api`は`/api`のみにマッチします。
- `/api/*`は`/api/users`にマッチしますが、`/api/users/123`にはマッチしません。
- `/api/**`は`/api/users`と`/api/users/123`の両方にマッチします。

**`@angular-devkit/build-angular:dev-server`** ([Webpack DevServer](https://webpack.js.org/configuration/dev-server/#devserverproxy)ベース)

- `/api`は`/api`とすべてのサブパスにマッチします(`/api/**`と同等)。
