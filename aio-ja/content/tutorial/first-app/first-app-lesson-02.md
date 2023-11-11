# レッスン 2: Home コンポーネントの作成
このチュートリアルレッスンでは、Angular アプリケーションに新しい[コンポーネント](/guide/component-overview)を作成する方法を説明します。

**所要時間**: 〜10分

**開始時のコード:** <live-example name="first-app-lesson-01"></live-example>

**完了時のコード:** <live-example name="first-app-lesson-02"></live-example>

## ここで学べること

あなたのアプリケーションには新しいコンポーネント `HomeComponent` が追加されます。

## Angular コンポーネントのコンセプトプレビュー

Angular のアプリケーションは、Angular の構成要素であるコンポーネントを中心に構築されます。
コンポーネントには、アプリケーション内の要素の機能と外観を提供する HTML レイアウト、および CSS スタイル情報のコードが含まれています。
Angularでは、コンポーネントは他のコンポーネントを含むことができます。アプリケーションの機能や外観は、コンポーネント単位で分割・分離することができます。

Angular では、コンポーネントはそのプロパティを定義するメタデータを持っています。
`HomeComponent` を作成する際には、次のプロパティを使用します。

*   `selector`: Angular がテンプレート内のコンポーネントを参照する方法を記述します。
*   `standalone`: コンポーネントが NgModule` を必要とするかどうかを記述します。
*   `imports`: コンポーネントの依存関係を記述します。
*   `template`: コンポーネントの HTML マークアップとレイアウトを記述します。
*   `styleUrls`: コンポーネントが使用する CSS ファイルの URL を配列で列挙します。

[コンポーネントの詳細はこちら。](/api/core/Component)

## ステップ 1 - `HomeComponent` の作成

このステップでは、アプリケーションに新しいコンポーネントを作成します。

IDE の **ターミナル** ペインで

1.  プロジェクトディレクトリで、`first-app` ディレクトリに移動します。
1.  新しい `HomeComponent` を作成するために次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng generate component home --inline-template --skip-tests

    </code-example>

1.  アプリケーションをビルドとサーブするために、次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1.  ブラウザを開き `http://localhost:4200` に移動し、アプリケーションを見つけます。
1.  アプリケーションがエラーなく、ビルドされることを確認します。

    <div class="callout is-helpful">
      新しいコンポーネントを追加しても、アプリケーションのテンプレートにはまだ含まれていないので、前のレッスンと同じように表示されるはずです。
    </div>
1.  次のステップを完了するまで `ng serve` を起動したままにします。

## ステップ 2 - アプリケーションのレイアウトに新しいコンポーネントを追加

このステップでは、新しいコンポーネント `HomeComponent` をアプリケーションのルートコンポーネント `AppComponent` に追加して、アプリケーションのレイアウトに表示します。

IDE の **編集** ペインで

1.  エディタで `app.component.ts` を開きます。
1.  `app.component.ts` で、ファイルレベルの import に次の行を追加して `HomeComponent` をインポートします。

    <code-example header="Import HomeComponent in src/app/app.component.ts" path="first-app-lesson-02/src/app/app.component.ts" region="import-home"></code-example>

1.  `app.component.ts` の `@Component` で `imports` の配列プロパティを更新して、`HomeComponent` を追加します。

    <code-example header="Replace in src/app/app.component.ts" path="first-app-lesson-02/src/app/app.component.ts" region="app-metadata-imports"></code-example>
1.  `app.component.ts` の `@Component` で、`template` プロパティを更新して、次の HTML コードを記述します。

    <code-example header="Replace in src/app/app.component.ts" path="first-app-lesson-02/src/app/app.component.ts" region="app-metadata-template"></code-example>
1.  `app.component.ts` の変更を保存します。
1.  `ng serve` が実行されている場合、アプリケーションが更新されるはずです。
    `ng serve` を実行していない場合は、再度起動してください。
    アプリケーションは *Hello world* から `HomeComponent` の *home works!* に変更されるはずです。
1.  ブラウザで起動中のアプリケーションを確認し、アプリケーションが更新されていることを確認します。

<section class="lightbox">
<img alt="browser frame of page displaying the text 'home works!'" src="generated/images/guide/faa/homes-app-lesson-02-step-2.png">
</section>

## ステップ 3 - `HomeComponent` に機能を追加

このステップでは `HomeComponent` に機能を追加します。

前のステップでは、アプリケーションのテンプレートにデフォルトの `HomeComponent` を追加して、そのデフォルトの HTML がアプリケーションに表示しました。
このステップでは、後のレッスンで使用する検索フィルタとボタンを追加します。
今のところ、`HomeComponent` にあるのはこれだけです。
このステップでは、検索要素をレイアウトに追加するだけで、まだ何の機能もないことに注意してください。

IDE の **編集** ペインで

1.  `first-app` ディレクトリで、`home.component.ts` をエディタで開く。
1.  `home.component.ts` の `@Component` の `template` プロパティを次のコードで更新します。

    <code-example header="Replace in src/app/home/home.component.ts" path="first-app-lesson-02/src/app/home/home.component.ts" region="home-template"></code-example>

1.  次に、エディタで `home.component.css` を開き、次のスタイルでコンテンツを更新します。

    <code-example header="Replace in src/app/home/home.component.css" path="first-app-lesson-02/src/app/home/home.component.css"></code-example>

1.  アプリケーションがエラーなく、ビルドされることを確認します。
    アプリケーション内にフィルタークエリボックスとボタンが表示され、スタイルが設定されているはずです。
    次のステップに進む前に、エラーをしてください。

<section class="lightbox">
<img alt="browser frame of homes-app displaying logo, filter text input box and search button" src="generated/images/guide/faa/homes-app-lesson-02-step-3.png">
</section>

## レッスンの復習

このレッスンでは、アプリケーションに新しいコンポーネントを作成し、そのコンポーネントにフィルタ編集コントロールとボタンを追加しました。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [First Angular app lesson 3 - Create the application’s HousingLocation component](tutorial/first-app/first-app-lesson-03)

## より詳しい情報

このレッスンで扱うトピックの詳細については、こちらをご覧ください

*  [`ng generate component`](cli/generate#component-command)
*  [`Component` reference](api/core/Component)
*  [Angular components overview](guide/component-overview)

@reviewed 2023-10-24
