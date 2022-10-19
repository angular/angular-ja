# App shell

App shell は、ビルド時にひとつの経路を介してアプリケーションの一部をレンダリングする方法です。
ブラウザが完全なクライアントバージョンをダウンロードしてそのコードをロードした後に自動的に切り替えるまでの間、静的にレンダリングされたページ (すべてのページに共通のスケルトン) をすばやく起動することで、ユーザー体験を向上させることができます。

これにより、JavaScript を初期化しなくてもブラウザで HTML と CSS を簡単にレンダリングできるため、ユーザーはアプリケーションの意味のある最初の描画をすばやく表示できます。

[App Shell モデル](https://developers.google.com/web/fundamentals/architecture/app-shell) でもっと学びましょう。

## ステップ 1: アプリケーションを準備する

これを行うには、次の Angular CLI コマンドを使用します。

<code-example format="shell" language="shell">

ng new my-app --routing

</code-example>

既存のアプリケーションでは、手動で `RouterModule` を追加して、アプリケーション内で `<router-outlet>` を定義する必要があります。

## ステップ 2: App shell を作成する

Angular CLI を使用して App shell を自動的に作成します。

<code-example format="shell" language="shell">

ng generate app-shell

</code-example>

For more information about this command see [App shell command](cli/generate#app-shell-command). 

このコマンドを実行した後、`angular.json` 設定ファイルが更新されて、他にいくつかの変更が加わり2つの新しいターゲットが追加されていることに気付くでしょう。

<code-example language="json">

"server": {
  "builder": "&commat;angular-devkit/build-angular:server",
  "defaultConfiguration": "production",
  "options": {
    "outputPath": "dist/my-app/server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  },
  "configurations": {
    "development": {
      "outputHashing": "none",
    },
    "production": {
      "outputHashing": "media",
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "sourceMap": false,
      "optimization": true
    }
  }
},
"app-shell": {
  "builder": "&commat;angular-devkit/build-angular:app-shell",
  "defaultConfiguration": "production",
  "options": {
    "route": "shell"
  },
  "configurations": {
    "development": {
      "browserTarget": "my-app:build:development",
      "serverTarget": "my-app:server:development",
    },
    "production": {
      "browserTarget": "my-app:build:production",
      "serverTarget": "my-app:server:production"
    }
  }
}

</code-example>

## ステップ 3: アプリケーションがシェルコンテンツで構築されていることを確認します

Angular CLI を使って `app-shell` ターゲットを構築します。

<code-example format="shell" language="shell">

ng run my-app:app-shell:development

</code-example>

あるいは、プロダクション設定を利用します。

<code-example format="shell" language="shell">

ng run my-app:app-shell:production

</code-example>

ビルド出力を確認するには、 <code class="no-auto-link">dist/my-app/browser/index.html</code> を開きます。
デフォルトのテキスト `app-shell works!` を探して、App shell の経路が出力の一部としてレンダリングされたことを示します。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
