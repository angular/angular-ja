# アプリケーションシェル

## Angular CLI をインストール

まだ[Angular CLI](https://github.com/angular/angular-cli)をインストールしていない場合は、インストールしてください。

<code-example language="sh" class="code-shell">
  npm install -g @angular/cli
</code-example>  

## 新しいアプリケーションを作成

次のCLIコマンドで`angular-tour-of-heroes`という名前の新しいプロジェクトを作成します。

<code-example language="sh" class="code-shell">
  ng new angular-tour-of-heroes
</code-example>

Angular CLIが、デフォルトのアプリケーションとサポートファイルを持つ新しいプロジェクトを作成しました。

## アプリケーションをサーブする

プロジェクトディレクトリに移動し、アプリケーションを起動します。

<code-example language="sh" class="code-shell">
  cd angular-tour-of-heroes
  ng serve --open
</code-example>

<div class="l-sub-section">

`ng serve`コマンドはアプリケーションをビルド、開発用サーバーを起動し、ソースファイルを監視します。
あなたが監視されているファイルに変更を行ったときには、変更があったファイルに対し再ビルドを行います。

`--open`フラグを指定すると、`http://localhost:4200`がブラウザで開かれます。

</div>

ブラウザ上でアプリケーションが動いていることを確認してください。

## Angularのコンポーネント

表示されているページは _アプリケーションシェル_ です。
このシェルは`AppComponent`という名前のAngular**コンポーネント**から操作されます。

_コンポーネント_ はAngularアプリケーションの基礎的な構成要素です。
コンポーネントはスクリーン上にデータを表示し、ユーザーの入力を待ち受け、その入力に対しアクションを取ります。

## アプリケーションのタイトルを変更する

好きなテキストエディタまたはIDEでプロジェクトを開き、`src/app`に移動してください。

以下の3つのファイルに分割された、`AppComponent`シェルの実装が見つかります。

1. `app.component.ts`&mdash; TypeScriptで書かれたコンポーネントクラスのコードです。
1. `app.component.html`&mdash; HTMLで書かれたコンポーネントのテンプレートです。
1. `app.component.css`&mdash; このコンポーネント専用のCSSです。


コンポーネントクラスファイル(`app.component.ts`)を開き、`title`プロパティの値を`Tour of Heroes`に変更してください。

<code-example path="toh-pt0/src/app/app.component.ts" region="set-title" title="app.component.ts (class title property)" linenums="false">
</code-example>

コンポーネントのテンプレートファイル(`app.component.html`)を開き、
Angular CLIにより生成されたデフォルトのテンプレートを削除してください。
代わりに以下のHTMLを配置してください。

<code-example path="toh-pt0/src/app/app.component.html"
  title="app.component.html (template)" linenums="false">
</code-example>

二重の波括弧はAngularの*補間バインディング*の構文です。
この補間バインディングはコンポーネントの`title`プロパティの値を、HTMLのheaderタグの中に渡します。

ブラウザがページを更新し、新しいアプリケーションのタイトルが表示されます。

{@a app-wide-styles}

## アプリケーションのスタイルを追加する

ほとんどのアプリケーションは、アプリケーション全体で一貫した見た目を目指しています。
CLIはこの目的のために、空の`styles.css`を生成しました。
アプリケーション全体に適応するスタイルをそこに記述してください。

以下は、_Tour of Heroes_ サンプルアプリケーションの`style.css`の抜粋です。

<code-example path="toh-pt0/src/styles.1.css" title="src/styles.css (excerpt)">
</code-example>

## 最終的なコードのおさらい

このチュートリアルのソースコードと _Tour Of Heroes_ のグローバルスタイルシートの完成版は
<live-example></live-example>で利用可能です。

以下がこのページで述べられたコードのファイルです。

<code-tabs>

  <code-pane title="src/app/app.component.ts" path="toh-pt0/src/app/app.component.ts">
  </code-pane>

  <code-pane title="src/app/app.component.html" path="toh-pt0/src/app/app.component.html">
  </code-pane>

  <code-pane
    title="src/styles.css (excerpt)"
    path="toh-pt0/src/styles.1.css">
  </code-pane>
</code-tabs>

## まとめ

* Angular CLIを用いて初期アプリケーションの骨組みを作成しました。
* Angularのコンポーネントがデータを表示することを学びました。
* アプリケーションのタイトルを表示するために二重波カッコによる補間を使いました。
