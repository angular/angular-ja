# 新規プロジェクトの作成

まず、Angular CLIを使用して初期アプリケーションを作成します。
このチュートリアルでは、スターターアプリケーションを修正して拡張し、Tour of Heroesアプリケーションを作成します。

チュートリアルのこの部分では、次のことを行います。

1.  環境を設定します。
1.  新しいワークスペースと初期アプリケーションプロジェクトを作成します。
1.  アプリケーションをサーブします。
1.  アプリケーションを変更します。

<div class="alert is-helpful">

  For the sample app that this page describes, see the <live-example></live-example>.

</div>

## 環境を設定する

開発環境をセットアップするには、[ローカル環境の構築](guide/setup-local "Setting up for Local Development") のインストラクションに従いましょう。

## 新しいワークスペースと初期アプリケーションリンクを作成する

Angularワークスペースのコンテキストでアプリケーションを開発します。
[ワークスペース](guide/glossary#workspace)には、1つ以上の[プロジェクト](guide/glossary#project)のファイルが含まれます。
プロジェクトとは、アプリケーションまたはライブラリを構成する一連のファイルです。
このチュートリアルでは、新しいワークスペースを作成します。

新しいワークスペースと初期のアプリケーションプロジェクトを作成するには：

1.  Angularワークスペースフォルダにないことを確認します。
    たとえば、Getting Startedワークスペースを以前に作成した場合は、そのフォルダの親フォルダに変更します。

1.  CLIコマンド `ng new` を実行し、次に示すように、`angular-tour-of-heroes` という名前を指定します。

    <code-example format="shell" language="shell">

    ng new angular-tour-of-heroes

    </code-example>

1.  `ng new` コマンドを実行すると、最初のアプリケーションプロジェクトに含める機能に関する情報が表示されます。 
    EnterキーまたはReturnキーを押してデフォルト値を受け入れます。

Angular CLIは、必要なAngular npmパッケージおよびその他の依存関係をインストールします。
これには数分かかることがあります。

また、次のワークスペースとスタータープロジェクトファイルも作成されます。

*   `angular-tour-of-heroes`という名前のルートフォルダがある新しいワークスペース。 
*   初期スケルトンアプリケーションプロジェクト。（`src/app`サブフォルダ内） 
*   関連する設定ファイル。

最初のアプリケーションプロジェクトには、すぐに実行できる簡単なウェルカムアプリケーションが含まれています。

## アプリケーションをサーブする

ワークスペースディレクトリに移動し、アプリケーションを起動します。

<code-example format="shell" language="shell">

cd angular-tour-of-heroes
ng serve --open

</code-example>

<div class="alert is-helpful">

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

## アプリケーションを変更する

スターターアプリケーションをいくつか変更するために、好きなテキストエディタまたはIDEでプロジェクトを開き、`src/app`に移動してください。

次の3つのファイルに分割された、`AppComponent`シェルの実装が見つかります。

| Files                | Details |
|:---                  |:---     |
| `app.component.ts` | TypeScriptで書かれたコンポーネントクラスのコードです。 |
| `app.component.html` | HTMLで書かれたコンポーネントのテンプレートです。 |
| `app.component.css` | このコンポーネント専用のCSSです。 |

### アプリケーションのタイトルを変更する

コンポーネントクラスファイル(`app.component.ts`)を開き、`title`プロパティの値を`Tour of Heroes`に変更してください。

<code-example header="app.component.ts (class title property)" path="toh-pt0/src/app/app.component.ts" region="set-title"></code-example>

コンポーネントのテンプレートファイル(`app.component.html`)を開き、Angular CLIにより生成されたデフォルトのテンプレートを削除してください。
代わりに次のHTMLを配置してください。

<code-example header="app.component.html (template)" path="toh-pt0/src/app/app.component.html"></code-example>

二重の波括弧はAngularの*補間バインディング*の構文です。
この補間バインディングはコンポーネントの`title`プロパティの値を、HTMLのheaderタグの中に渡します。

ブラウザがページを更新し、新しいアプリケーションのタイトルが表示されます。

<a id="app-wide-styles"></a>

### アプリケーションのスタイルを追加する

ほとんどのアプリケーションは、アプリケーション全体で一貫した見た目を目指しています。
CLIはこの目的のために、空の`styles.css`を生成しました。
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

*   Angular CLIを用いて初期アプリケーションの骨組みを作成しました。
*   Angularのコンポーネントがデータを表示することを学びました。
*   アプリケーションのタイトルを表示するために二重波カッコによる補間を使いました。

@reviewed 2022-02-28
