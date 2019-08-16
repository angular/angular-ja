# App shell

App shell は、ビルド時にひとつの経路を介してアプリケーションの一部をレンダリングする方法です。
ブラウザが完全なクライアントバージョンをダウンロードしてそのコードをロードした後に自動的に切り替えるまでの間、静的にレンダリングされたページ (すべてのページに共通のスケルトン) をすばやく起動することで、ユーザー体験を向上させることができます。

これにより、JavaScript を初期化しなくてもブラウザで HTML と CSS を簡単にレンダリングできるため、ユーザーはアプリケーションの意味のある最初の描画をすばやく表示できます。

[App Shell モデル](https://developers.google.com/web/fundamentals/architecture/app-shell) でもっと学びましょう。

## ステップ 1: アプリケーションを準備する

これを行うには、次の CLI コマンドを使用します。
<code-example language="bash">
ng new my-app --routing
</code-example>

既存のアプリケーションでは、手動で `RouterModule` を追加して、アプリケーション内で `<router-outlet>` を定義する必要があります。

## ステップ 2: App shell を作成する

CLI を使用して App shell を自動的に作成します。

<code-example language="bash">
ng generate app-shell --client-project my-app --universal-project server-app
</code-example>

* `my-app` はクライアントアプリケーションの名前を取ります。
* `server-app` はユニバーサル (またはサーバー) アプリケーションの名前を取ります。

このコマンドを実行した後、`angular.json` 設定ファイルが更新されて、他にいくつかの変更が加わり2つの新しいターゲットが追加されていることに気付くでしょう。

<code-example language="json">
"server": {
  "builder": "@angular-devkit/build-angular:server",
  "options": {
    "outputPath": "dist/my-app-server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  }
},
"app-shell": {
  "builder": "@angular-devkit/build-angular:app-shell",
  "options": {
    "browserTarget": "my-app:build",
    "serverTarget": "my-app:server",
    "route": "shell"
  }
}
</code-example>

## ステップ 3: アプリがシェルコンテンツで構築されていることを確認します

CLI を使って `app-shell` ターゲットを構築します。

<code-example language="bash">
ng run my-app:app-shell
</code-example>

ビルド出力を確認するには、`dist/my-app/index.html` を開きます。デフォルトのテキスト `app-shell works!` を探して、App shell の経路が出力の一部としてレンダリングされたことを示します。
