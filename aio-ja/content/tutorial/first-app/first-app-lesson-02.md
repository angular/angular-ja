# はじめての Angular アプリケーション レッスン 2 - Home コンポーネントの作成

このチュートリアルレッスンでは、Angular アプリケーションに新しい[コンポーネント](https://angular.jp/guide/component-overview)を作成する方法を説明します。

**所要時間**: このレッスンは 10 分程度で終了します。

## 始める前に

このレッスンは前のレッスンのコードから始まります。次のことができます。

*   レッスン 1 で作成したコードを、統合開発環境（IDE）で使用します。
*   前のレッスンのコードサンプルから開始できます。レッスン 1 から <live-example name="first-app-lesson-01"></live-example> を選んでください。
    *   StackBlitz の *live example* を使用すると、StackBlitz インターフェースが IDE になります。
    *   *download example* を使い IDE で開きます。

イントロダクションをまだ確認していない場合は、[Angular チュートリアルのイントロダクション](tutorial/first-app)を参照して、このレッスンを完了するために必要なものがすべて揃っているかどうか確認してください。

このレッスンで問題が発生した場合は、このレッスンの <live-example></live-example> から完成したコードを確認することができます。

## 終わったあと

* アプリケーションに新しいコンポーネント `HomeComponent` があります。

## Angular コンポーネントのコンセプトプレビュー

Angular のアプリケーションは、Angular の構成要素であるコンポーネントを中心に構築されます。
コンポーネントには、アプリケーション内の要素の機能と外観を提供する HTML レイアウト、および CSS スタイル情報のコードが含まれています。
Angular では、コンポーネントは他のコンポーネントを含むことができます。アプリケーションの機能や外観は、コンポーネントに分割して仕切ることができます。

[レッスン 1](tutorial/first-app/first-app-lesson-01)では、`AppComponent` を更新しましたが、その機能は他のすべてのコンポーネントを含みます。
このレッスンでは、アプリケーションのホームページを表示するための `HomeComponent` を作成します。
この後のレッスンでは、より多くのコンポーネントを作成し、アプリケーションに多くの機能を提供します。

Angular では、コンポーネントはそのプロパティを定義するメタデータを持っています。
`HomeComponent` を作成する際には、次のプロパティを使用します。

*   `selector`: Angular がテンプレート内のコンポーネントを参照する方法を記述します。
*   `standalone`: コンポーネントが `ngModule` を必要とするかどうかを記述します。
*   `imports`: コンポーネントの依存関係を記述します。
*   `template`: コンポーネントの HTML マークアップとレイアウトを記述します。
*   `styleUrls`: コンポーネントが使用する CSS ファイルの URL を配列で列挙します。

コンポーネントは他にも[プロパティ](https://angular.jp/api/core/Component)を持ちますが、これらは `HomeComponent` で使用するものです。

## レッスンのステップ

IDE でアプリケーションのコードに対して、次のステップを実行します。

### ステップ 1 - `HomeComponent` の作成

このステップでは、アプリケーションに新しいコンポーネントを作成します。

IDE の **ターミナル** ペインで

1.  プロジェクトディレクトリで、`first-app` ディレクトリに移動します。
1.  新しい `HomeComponent` を作成するために次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng generate component Home --standalone --inline-template --skip-tests

    </code-example>

1.  アプリケーションをビルドとサーブするために、次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1.  ブラウザを開き `http://localhost:4200` に移動し、アプリケーションを見つけます。
1.  アプリケーションがエラーなく、ビルドされることを確認します。

    *注： 新しいコンポーネントを追加しても、アプリケーションのテンプレートにはまだ含まれていないため、前のレッスンと同じように表示されるはずです。*
1.  次のステップを完了するまで `ng serve` を起動したままにします。

### ステップ 2 - アプリケーションのレイアウトに新しいコンポーネントを追加

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

### ステップ 3 - `HomeComponent` に機能を追加

このステップでは `HomeComponent` に機能を追加します。

前のステップでは、アプリケーションのテンプレートにデフォルトの `HomeComponent` を追加して、そのデフォルトの HTML がアプリケーションに表示しました。
このステップでは、後のレッスンで使用する検索フィルタとボタンを追加します。
今のところ、`HomeComponent` にあるのはこれだけです。
このステップでは、検索要素をレイアウトに追加するだけで、まだ何の機能もないことに注意してください。

IDE の **編集** ペインで

1.  `first-app` ディレクトリで、`home.component.ts` をエディタで開く。
1.  `app.component.ts` の `@Component` の `template` プロパティを次のコードで更新します。

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
