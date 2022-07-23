# 新規プロジェクトの作成

`ng new`コマンドを使用して、**Tour of Heroes**のアプリケーションの作成を開始します。

チュートリアルのこの部分では、次のことを行います。

1.  環境を設定します。
1.  新しいワークスペースと初期アプリケーションプロジェクトを作成します。
1.  アプリケーションをサーブします。
1.  アプリケーションを変更します。

<div class="alert is-helpful">

To view the application's code, see the <live-example></live-example>.

</div>

## 環境を設定する

開発環境をセットアップするには、[ローカル環境の構築](guide/setup-local "Setting up for Local Development") のインストラクションに従いましょう。

## 新しいワークスペースと初期アプリケーションリンクを作成する

Angular[ワークスペース](guide/glossary#workspace)のコンテキストでアプリケーションを開発します。
_ワークスペース_には、1つ以上の[プロジェクト](guide/glossary#project)のファイルが含まれます。
_プロジェクト_とは、アプリケーションまたはライブラリを構成する一連のファイルです。

新しいワークスペースと最初のプロジェクトを作成するには：

1.  Angularワークスペースのディレクトリにいないことを確認します。
    たとえば、以前の演習の「はじめに」のワークスペースにいる場合、その親ディレクトリに移動します。

2.  次のように、`ng new`の後にアプリケーション名をつけて実行します。

    <code-example format="shell" language="shell">

    ng new angular-tour-of-heroes

    </code-example>

3.  `ng new` は、最初のプロジェクトに含めるべき機能についての情報を求めるプロンプトを表示します。
    EnterキーまたはReturnキーを押してデフォルト値を受け入れます。

`ng new` は、Angular が必要とする `npm` パッケージやその他の依存関係をインストールします。
これには数分かかることがあります。

また、`ng new`は次のワークスペースと最初のプロジェクトファイルも作成し
ます。

*   ルートディレクトリ名を `angular-tour-of-heroes` とする新しいワークスペース
*    `src/app` サブディレクトリの中のアプリケーションのスケルトンプロジェクト
*   関連する設定ファイル。

最初のアプリケーションプロジェクトには、すぐに実行できる簡単なウェルカムアプリケーションが含まれています。

## アプリケーションをサーブする

ワークスペースディレクトリに移動し、アプリケーションを起動します。

<code-example format="shell" language="shell">

cd angular-tour-of-heroes
ng serve --open

</code-example>

<div class="alert is-helpful">

`ng serve` コマンドをは次のことを行います:

* アプリケーションをビルドする
* 開発用サーバーを起動する
* ソースファイルを監視する
* 変更に応じてアプリケーションを再ビルドする

`--open`フラグを指定すると、`http://localhost:4200`がブラウザで開かれます。

</div>

ブラウザ上でアプリケーションが動いていることを確認してください。

## Angularのコンポーネント

表示されているページは _アプリケーションシェル_ です。
このシェルは`AppComponent`という名前のAngular**コンポーネント**から操作されます。

_コンポーネント_ はAngularアプリケーションの基礎的な構成要素です。
コンポーネントはスクリーン上にデータを表示し、ユーザーの入力を待ち受け、その入力に対しアクションを取ります。

## アプリケーションを変更する

お気に入りのエディタまたはIDEでプロジェクトを開いてください。スターターアプリケーションを編集するために、`src/app`ディレクトリに移動してください。
IDEで、先ほど作成した `AppComponent` を構成する、次のファイルを探します。

| Files                | Details |
|:---                  |:---     |
| `app.component.ts` | TypeScriptで書かれたコンポーネントクラスのコードです。 |
| `app.component.html` | HTMLで書かれたコンポーネントのテンプレートです。 |
| `app.component.css` | このコンポーネント専用のCSSです。 |

<div class="alert is-important">

`ng new`を実行すると、Angularは新しいアプリケーションのためのテストを作成しました。
しかし、これらの変更を行うと、新しく作成されたテストは壊れてしまいます。

Angularのテストはこのチュートリアルの範囲外であり、使用しないので問題はありません。

Angularのテストについてもっと知りたい方は、[Testing](guide/testing)をご覧ください。

</div>

### アプリケーションのタイトルを変更する

コンポーネントクラスファイル(`app.component.ts`)を開き、`title`プロパティの値を`Tour of Heroes`に変更してください。

<code-example header="app.component.ts (class title property)" path="toh-pt0/src/app/app.component.ts" region="set-title"></code-example>

コンポーネントのテンプレートファイル(`app.component.html`)を開き、`ng new`により生成されたデフォルトのテンプレートを削除してください。
代わりに次のHTMLを配置してください。

<code-example header="app.component.html (template)" path="toh-pt0/src/app/app.component.html"></code-example>

二重の波括弧はAngularの*補間バインディング*の構文です。
この補間バインディングはコンポーネントの`title`プロパティの値を、HTMLのheaderタグの中に渡します。

ブラウザがページを更新し、新しいアプリケーションのタイトルが表示されます。

<a id="app-wide-styles"></a>

### アプリケーションのスタイルを追加する

ほとんどのアプリケーションは、アプリケーション全体で一貫した見た目を目指しています。
`ng new`はこの目的のために、空の`styles.css`を生成しました。
アプリケーション全体に適用するスタイルをそこに記述してください。

`src/styles.css` を開き、次のコードをファイルに追加します。

<code-example header="src/styles.css (excerpt)" path="toh-pt0/src/styles.1.css"></code-example>

## 最終的なコードのおさらい

以下がこのページで述べられたコードのファイルです。

<code-tabs>
    <code-pane header="src/app/app.component.ts" path="toh-pt0/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.html" path="toh-pt0/src/app/app.component.html"></code-pane>
    <code-pane header="src/styles.css (excerpt)" path="toh-pt0/src/styles.1.css"></code-pane>
</code-tabs>

## まとめ

*   `ng new`を用いて初期アプリケーションの骨組みを作成しました。
*   Angularのコンポーネントがデータを表示することを学びました。
*   アプリケーションのタイトルを表示するために二重波カッコによる補間を使いました。

@reviewed 2022-02-28
