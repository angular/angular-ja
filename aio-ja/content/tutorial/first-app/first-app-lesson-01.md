# レッスン 1: Hello world
この最初のレッスンは、本チュートリアルの各レッスンで新機能を追加し、完全な Angular アプリケーションを構築するための出発点として機能します。このレッスンでは、有名なテキスト"Hello World" を表示するようにアプリケーションを更新します。

**所要時間:** 約10分

**開始時のコード:** <live-example name="first-app-lesson-00"></live-example>

**完了時のコード:** <live-example name="first-app-lesson-01"></live-example>

## ここで学べること

このレッスンの後には、更新されたアプリケーションによって、あなたとあなたのIDEがAngularアプリケーションの作成を開始する準備ができていることが確認できます。

## ステップ 1 - デフォルトアプリケーションを試す

このステップでは、デフォルトのスタートアプリケーションをダウンロードした後、デフォルトの Angular アプリケーションをビルドします。
これにより、開発環境にチュートリアルを続けるために必要なものが揃っていることを確認します。

IDE の **ターミナル** ペインで:

1.  プロジェクトディレクトリで、`first-app` ディレクトリに移動します。
1.  アプリケーションの実行に必要な依存関係をインストールするために、次のコマンドを実行します。

    <code-example format="shell" language="shell">

    npm install

    </code-example>

1.  デフォルトアプリケーションのビルドとサーブをするために、次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

    アプリケーションはエラーなくビルドされるはずです。

1.  開発用コンピュータの web ブラウザで `http://localhost:4200` を開きます。
1.  ブラウザにデフォルトの web サイトが表示されることを確認します。
1.  次のステップを完了するまで、`ng serve` を実行したままにできます。

## ステップ 2 - プロジェクト内のファイルを確認

このステップでは、デフォルトの Angular アプリケーションを構成するファイルについて知ることができます。

IDE の **Explorer** ペインで:

1.  プロジェクトディレクトリで、`first-app` ディレクトリに移動します。
1.  `src` ディレクトリを開くと、これらのファイル表示されます。
    1.  ファイルエクスプローラーで、Angular アプリケーションファイル (`/src`) を見つけます。
        1.  `index.html` はアプリケーショントップレベルの HTML テンプレートです。
        1.  `style.css` はアプリケーショントップレベルのスタイルシートです。
        1.  `main.ts` はアプリケーションの実行を開始する場所です。
        1.  `favicon.ico` はどのウェブサイトにあるようなアプリケーションのアイコンです。
    1.  ファイルエクスプローラーで、Angular アプリケーションのコンポーネントファイル (`/app`) を見つけます。
        1.  `app.component.ts` は `app-root` コンポーネントを記述するためのソースファイルです。
            これは、アプリケーションのトップレベルの Angular コンポーネントです。コンポーネントは、Angular アプリケーションの基本的な構成要素です。
            コンポーネントの記述には、コンポーネントのコード、HTML テンプレート、スタイルが含まれており、このファイルに記述することも、別のファイルに記述することもできます。

            このアプリケーションでは、スタイルは別のファイルに、コンポーネントのコードと HTML テンプレートはこのファイルに入っています。
        1.  `app.component.css` はこのコンポーネントのスタイルシートです。
        1.  このディレクトリに新しいコンポーネントが追加されます。
    1.  ファイルエクスプローラーで、,アプリケーションで使用する画像を含む画像ディレクトリ (`/assets`) を見つけます。
    1.  ファイルエクスプローラーで、Angular アプリケーションのビルドや実行のために必要なサポートファイルを見つけますが、これらは通常操作するファイルではありません。
        1.  `.angular` は Angular アプリケーションをビルドするために必要なファイルがあります。
        1.  `.e2e` はアプリケーションのテストに使用されるファイルがあります。
        1.  `.node_modules` はアプリケーションが使用する node.js のパッケージがあります。
        1.  `angular.json` はアプリケーションビルドツールのために Angular アプリケーションを記述します。
        1.  `package.json` は完成したアプリケーションを実行するために `npm` (node パッケージマネージャー) によって使用されます。
        1.  `tsconfig.*` は TypeScript コンパイラに対するアプリケーションの設定を記述するファイルです。

Angular アプリケーションのプロジェクトを構成するファイルを確認したら、次のステップに進みます。

## ステップ 3 - `Hello World` の作成

このステップでは、表示するコンテンツを変更するために、Angular のプロジェクトファイルを更新します。

IDE で:

1.  `first-app/src/index.html` を開きます。
1.  `index.html` の `<title>` 要素を次のコードに置き換えて、アプリケーションのタイトルを更新します。

    <code-example header="Replace in src/index.html" path="first-app-lesson-01/src/index.html" region="app-title"></code-example>

    そして、`index.html` に加えた変更を保存します。

1.  次に `first-app/src/app/app.component.ts` を開きます。
1.  `app.component.ts` の `@Component` 定義で, `template` 行を次のコードに置き換えて app コンポーネントのテキストを更新します。

    <code-example header="Replace in src/app/app.component.ts" path="first-app-lesson-01/src/app/app.component.ts" region="app-comp-template"></code-example>

1.  `app.component.ts` の `AppComponent` クラス定義で、`title` 行を次のコードに置き換えて、コンポーネントのタイトルを変更します。

    <code-example header="Replace in src/app/app.component.ts" path="first-app-lesson-01/src/app/app.component.ts" region="app-comp-title"></code-example>

    そして、 `app.component.ts`　に加えた変更を保存します。

1.  ステップ 1 の `ng serve` コマンドを停止した場合は、IDE の**ターミナル**ウィンドウで、再度 `ng serve` を実行します。
1.  ブラウザを開いて `localhost:4200` に移動し、アプリケーションがエラーなくビルドされ、title と body に _Hello world_ が表示されることを確認します。
<section class="lightbox">
<img alt="browser frame of page displaying the text 'Hello World'" src="generated/images/guide/faa/homes-app-lesson-01-browser.png">
</section>
## レッスンの復習

このレッスンでは、デフォルトの Angular アプリケーションを更新して _Hello world_ を表示させました。
その過程で、テスト用のローカルアプリケーションをサーブするための `ng serve` コマンドについて学びました。

このレッスンに問題がある場合は、 <live-example></live-example> の完成したコードを確認してください。

## 次のステップ

[First Angular app lesson 2 - Creating Components](tutorial/first-app/first-app-lesson-02)

## より詳しい情報

このレッスンで扱うトピックの詳細については、こちらをご覧ください

* [Angular Components](/guide/component-overview)
* [Creating applications with the Angular CLI](/cli)

@reviewed 2023-10-24
