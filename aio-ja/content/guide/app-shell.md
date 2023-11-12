# App shell

App shell は、ビルド時にひとつの経路を介してアプリケーションの一部をレンダリングする方法です。
ブラウザが完全なクライアントバージョンをダウンロードしてそのコードをロードした後に自動的に切り替えるまでの間、静的にレンダリングされたページ (すべてのページに共通のスケルトン) をすばやく起動することで、ユーザー体験を向上させることができます。

これにより、JavaScript を初期化しなくてもブラウザで HTML と CSS を簡単にレンダリングできるため、ユーザーはアプリケーションの意味のある最初の描画をすばやく表示できます。

[App Shell モデル](https://developers.google.com/web/fundamentals/architecture/app-shell) でもっと学びましょう。

## ステップ 1: アプリケーションを作成する

これを行うには、次の Angular CLI コマンドを使用します。

<code-example format="shell" language="shell">

ng new my-app

</code-example>

既存のアプリケーションでは、手動で `Router` を追加して、アプリケーション内で `<router-outlet>` を定義する必要があります。

## ステップ 2: App shell を作成する

Angular CLI を使用して App shell を自動的に作成します。

<code-example format="shell" language="shell">

ng generate app-shell

</code-example>

For more information about this command see [App shell command](cli/generate#app-shell-command). 

このコマンドはアプリケーション・コードを更新し、プロジェクト構造に追加ファイルを追加します。

<code-example language="text">

  src
  ├── app
  │   ├── app.config.server.ts               # server application configuration
  │   └── app-shell                          # app-shell component
  │       ├── app-shell.component.html
  │       ├── app-shell.component.scss
  │       ├── app-shell.component.spec.ts
  │       └── app-shell.component.ts
  └── main.server.ts                         # main server application bootstrapping

</code-example>


## ステップ 3: アプリケーションがシェルコンテンツで構築されていることを確認します

<code-example format="shell" language="shell">

ng build --configuration=development

</code-example>

あるいは、プロダクション設定を利用します。

<code-example format="shell" language="shell">

ng build

</code-example>

ビルド出力を確認するには、 <code class="no-auto-link">dist/my-app/browser/index.html</code> を開きます。
デフォルトのテキスト `app-shell works!` を探して、App shell の経路が出力の一部としてレンダリングされたことを示します。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-10-20
