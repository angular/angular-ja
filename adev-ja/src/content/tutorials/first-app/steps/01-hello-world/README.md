# Hello world

最初のレッスンは、このチュートリアル全体で完全なAngularアプリケーションを作り上げていくための出発点となります。このレッスンでは、アプリケーションを更新して有名な「Hello World」というテキストを表示します。

<docs-video src="https://www.youtube.com/embed/UnOwDuliqZA?si=uML-cDRbrxmYdD_9"/>

## 何を学ぶか

このレッスン後の更新済みアプリケーションが、あなたとIDEがAngularアプリケーションを作り始める準備ができていることを示します。

NOTE: 組み込みエディタで作業をする場合、[ステップ4](#hello-worldを作成する)に進んでください。
ブラウザのプレイグラウンドで作業する時は、アプリケーションを実行するために`ng serve`を使う必要はありません。`ng generate`のような他のコマンドは右側にあるコンソールウィンドウで実行できます。

<docs-workflow>

<docs-step title="デフォルトアプリケーションをダウンロードする">
まずはコードエディタの右上のペインにある「ダウンロード」アイコンをクリックしてください。すると、このチュートリアル用のソースコードを含む`.zip`ファイルがダウンロードされます。ダウンロードしたファイルをローカルのターミナルやIDEで開き、デフォルトアプリケーションのテストに進んでください。

チュートリアルのどのステップでも、このアイコンをクリックすることでそのステップのソースコードをダウンロードし、そこから作業を始めることができます。
</docs-step>

<docs-step title="デフォルトアプリケーションをテストする">
このステップでは、デフォルトの開始アプリケーションをダウンロードした後に、Angularのデフォルトアプリケーションをビルドします。
これが問題なく行えれば、チュートリアルを続けるために必要なを開発環境が整っていることを確認できます。

IDEの**ターミナル**ペインで:

1. プロジェクトディレクトリで、`first-app`ディレクトリに移動します。
1. アプリケーションを実行するのに必要な依存関係をインストールするため、次のコマンドを実行します。

   ```shell
   npm install
   ```

1. デフォルトアプリケーションをビルドし、開発サーバーを起動するため、次のコマンドを実行します。

   ```shell
   ng serve
   ```

   アプリケーションはエラーなくビルドされるはずです。

1. 開発マシンのWebブラウザで、`http://localhost:4200`を開きます。
1. ブラウザでデフォルトのWebサイトが表示できることを確認します。
1. 次のステップに進む間も、`ng serve`は起動したままで構いません。
   </docs-step>

<docs-step title="プロジェクトのファイルをレビューする">
このステップでは、Angularのデフォルトアプリケーションを構成するファイルについて述べます。

IDEの**エクスプローラー**ペイン:

1. プロジェクトディレクトリで`first-app`ディレクトリに移動します。
1. `src`ディレクトリを開いて内容を確認します。
   1. ファイルエクスプローラーで、(`/src`)ディレクトリにあるAngularアプリケーションのファイルを確認します。
      1. `index.html`はアプリケーションのトップレベルのHTMLテンプレートです。
      1. `styles.css`はアプリケーションのトップレベルのスタイルシートです。
      1. `main.ts`はアプリケーションの実行が開始されるエントリポイントです。
      1. `favicon.ico`は一般的なWebサイトと同様のアプリケーションのアイコンです。
   1. (`/app`)ディレクトリにあるコンポーネント関連のファイルを確認します。
      1. `app.ts`は`app-root`コンポーネントを定義するソースファイルです。
         これはアプリケーションのトップレベルのAngularコンポーネントで、コンポーネントはAngularアプリケーションの基本的な構成要素です。
         コンポーネントの定義にはコンポーネントのコード、HTMLテンプレート、スタイルが含まれ、これらは１つのファイルにまとめることも、別ファイルに分けることもできます。

         このアプリケーションでは、スタイルが別ファイルですが、コンポーネントのコードとHTMLテンプレートがこのファイルに含まれています。

      1. `app.css`はこのコンポーネントのスタイルシートです。
      1. 新しいコンポーネントはこのディレクトリに追加されます。

   1. ディレクトリ(`/assets`)にはアプリケーションで使用される画像が含まれています。
   1. Angularアプリケーションのビルドと実行に必要ですが、通常は直接操作しないファイルやディレクトリもあります。
      1. `.angular`はAngularアプリケーションをビルドするのに必要なファイルを含みます。
      1. `.e2e`はアプリケーションをテストするのに使用されるファイルを含みます。
      1. `.node_modules`はアプリケーションが使用するnode.jsのパッケージを含みます。
      1. `angular.json`はAngularアプリケーションの情報をアプリケーションのビルドツールに渡します。
      1. `package.json`は`npm`(Node.jsのパッケージマネージャー)によって完成したアプリケーションを実行するのに使用されます。
      1. `tsconfig.*`はTypeScriptコンパイラに対するアプリケーションの設定を記述するファイルです。

Angularアプリケーションプロジェクトを構成するファイルを確認したら、次のステップに進んでください。
</docs-step>

<docs-step title="`Hello World`を作成する">
このステップでは、表示内容を変更するためにAngularプロジェクトのファイルを更新します。

あなたのIDEで:

1. `first-app/src/index.html`を開いてください。
   NOTE: このステップと次のステップはローカル環境だけが対象です。

1. `index.html`で、`<title>`要素を次のコードで置き換えてアプリケーションのタイトルを更新してください。

   <docs-code header="src/index.htmlを置き換えてください" path="adev/src/content/tutorials/first-app/steps/02-Home/src/index.html" visibleLines="[5]"/>

   その次に、変更した`index.html`を保存してください。

1. 次に`first-app/src/app/app.ts`を開いてください。
1. `app.ts`の`@Component`の定義内にある、`template`の行を次のコードに置き換えてアプリケーションコンポーネントの表示テキストを変更します。

   <docs-code language="angular-ts" header="src/app/app.tsを置き換えてください" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[6,8]"/>

1. `app.ts`の`App`クラスの定義で、`title`の行を次のコードに置き換えてコンポーネントのタイトルを変更します。

   <docs-code header="src/app/app.tsを置き換えてください" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[11,13]"/>

   その次に、変更した`app.ts`を保存してください.

1. ステップ1での`ng serve`コマンドを停止していた場合は、IDEの**Terminal**ウィンドウで、`ng serve`を再度実行してください。
1. ブラウザを開き、`localhost:4200`にアクセスし、アプリケーションがエラーがなくビルドされ、タイトルに**Homes**、本文に**Hello world**が表示されることを確認してください。
   <img alt="テキスト'Hello World'を表示するページのブラウザのフレーム" src="assets/images/tutorials/first-app/homes-app-lesson-01-browser.png">
   </docs-step>

</docs-workflow>

SUMMARY: このレッスンでは、Angularのデフォルトアプリケーションを更新し、**Hello world**を表示するように更新しました。
その過程で、ローカル環境でアプリケーションをテストするためのコマンドである`ng serve`について学びました。

このレッスンで扱った内容の詳細については、次のページをご覧ください:

<docs-pill-row>
  <docs-pill href="guide/components" title="Angularコンポーネント"/>
  <docs-pill href="tools/cli" title="Angular CLIを使ったアプリケーションの作成"/>
</docs-pill-row>
