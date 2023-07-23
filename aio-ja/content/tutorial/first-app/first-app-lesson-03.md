# はじめての Angular アプリケーション レッスン 3 - HousingLocation コンポーネントの作成

このチュートリアルレッスンでは、`HousingLocation` コンポーネントを Angular アプリケーションに追加する方法を説明します。

**所要時間**: このレッスンは 10 分程度で終了します。

## 始める前に

このレッスンは前のレッスンのコードから始まります。次のことができます。

*   レッスン 2 で作成したコードを、統合開発環境（IDE）で使用します。
*   前のレッスンのコードサンプルから開始できます。レッスン 2 から <live-example name="first-app-lesson-02"></live-example> を選んでください。
    *   StackBlitz の *live example* を使用すると、StackBlitz インターフェースが IDE になります。
    *   *download example* を使い IDE で開きます。

イントロダクションをまだ確認していない場合は、[Angular チュートリアルのイントロダクション](tutorial/first-app)を参照して、このレッスンを完了するために必要なものがすべて揃っているかどうか確認してください。

このレッスンで問題が発生した場合は、このレッスンの <live-example></live-example> から完成したコードを確認することができます。

## 終わったあと
* アプリケーションに新しいコンポーネント `HousingLocationComponent` があり、コンポーネントがアプリケーションに追加されたことを確認するメッセージが表示されます。

## レッスンのステップ

IDE でアプリケーションのコードに対して、次のステップを実行します。

### ステップ 1 - `HousingLocationComponent` の作成

このステップでは、アプリケーションに新しいコンポーネントを作成します。

IDE の **ターミナル** ペインで

1. 新しい `HousingLocationComponent` を作成するために次のコマンドを実行します。

    <code-example format="shell" language="shell">
    ng generate component HousingLocation --standalone --inline-template --skip-tests
    </code-example>

1. アプリケーションのビルドとサーブをするために、次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1.  ブラウザを開き `http://localhost:4200` に移動し、アプリケーションを見つけます。
1.  アプリケーションがエラーなく、ビルドされることを確認します。

    *注： 新しいコンポーネントを追加しても、アプリケーションのテンプレートにはまだ含まれていないため、前のレッスンと同じように表示されるはずです。*
1.  次のステップを完了するまで `ng serve` を起動したままにします。

### ステップ 2 - アプリケーションのレイアウトに新しいコンポーネントを追加

このステップでは、新しいコンポーネント `HousingLocationComponent` をアプリケーションの `HomeComponent` に追加して、アプリケーションのレイアウトに表示します。

IDE の **編集** ペインで

1.  エディタで `home.component.ts` を開きます。
1.  `home.component.ts` で、ファイルレベルの import に次の行を追加して `HousingLocationComponent` をインポートします。

    <code-example header="Import HousingLocationComponent in src/app/home/home.component.ts" path="first-app-lesson-03/src/app/home/home.component.ts" region="import-housingLocation"></code-example>

1.  次に、`@Component` メタデータの `imports` プロパティを更新し、`HousingLocationComponent` を配列に追加します。

    <code-example header="Add HousingLocationComponent to imports array in src/app/home/home.component.ts" path="first-app-lesson-03/src/app/home/home.component.ts" region="add-housingLocation-to-array"></code-example>

1.  これで、`HomeComponent` のテンプレートでコンポーネントを使用する準備ができました。`<app-housing-location>` タグへの参照が含まれるように `@Component` メタデータの `template` プロパティを更新します。

    <code-example header="Add housing location to the component template in src/app/home/home.component.ts" path="first-app-lesson-03/src/app/home/home.component.ts" region="add-housingLocation-to-template"></code-example>

### ステップ 3 - コンポーネントのスタイルを追加

このステップでは、`HousingLocationComponent` にあらかじめ書かれているスタイルをコピーして、アプリケーションが正しくレンダリングされるようにします。

1. `src/app/housing-location/housing-location.css` を開き、次のスタイルを貼り付けます。

    <code-example header="Add CSS styles to housing location to the component in src/app/housing-location/housing-location.component.css" path="first-app-lesson-03/src/app/housing-location/housing-location.component.css"></code-example>

1.  コードを保存し、ブラウザに戻り、アプリケーションがエラーなくビルドされることを確認します。画面に "housing-location works!" というメッセージが表示されるはずです。次のステップに進む前に、エラーを修正してください。

    <section class="lightbox">
    <img alt="browser frame of homes-app displaying logo, filter text input box and search button and the message 'housing-location works!" src="generated/images/guide/faa/homes-app-lesson-03-step-2.png">
    </section>


## レッスンの復習

このレッスンでは、アプリケーションに新しいコンポーネントを作成し、それをアプリケーションのレイアウトに追加しました。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [First Angular app lesson 4 -  Add a housing location interface to the application](tutorial/first-app/first-app-lesson-04)
