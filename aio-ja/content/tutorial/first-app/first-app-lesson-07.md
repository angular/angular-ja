# レッスン 7 - コンポーネントのテンプレートに補間を追加

このチュートリアルレッスンでは、テンプレートに動的なデータを表示するために、Angular テンプレートに補間を追加する方法を示します。

**所要時間**: このレッスンは 10 分程度で終了します。

## 始める前に

このレッスンは前のレッスンのコードから始まります。次のことができます。

*   レッスン 6 で作成したコードを、統合開発環境（IDE）で使用します。
*   前のレッスンのコードサンプルから開始できます。レッスン 6 から <live-example name="first-app-lesson-06"></live-example> を選んでください。
    *   StackBlitz の *live example* を使用すると、StackBlitz インターフェースが IDE になります。
    *   *download example* を使い IDE で開きます。

イントロダクションをまだ確認していない場合は、[Angular チュートリアルのイントロダクション](tutorial/first-app)を参照して、このレッスンを完了するために必要なものがすべて揃っているかどうか確認してください。

このレッスンで問題が発生した場合は、このレッスンの <live-example></live-example> から完成したコードを確認することができます。

## 終わったあと

*  アプリケーションは `HousingLocationComponent` テンプレートに補間された値を表示します。
*  アプリケーションは住宅の位置データをブラウザにレンダリングします。

## 補間のコンセプトプレビュー
レッスン6では、開発者が `HomeComponent` から `HousingLocationComponent` にデータを渡すために、テンプレートにデータバインディングを追加しました。次のステップは、テンプレートに値（プロパティと `Input` 値）を表示することです。このタスクを達成するためには、補間を使用する必要があります。

[テンプレート構文](guide/template-syntax) は静的なテンプレートコンテンツと動的な値や式を混ぜることをサポートしています。

Angular テンプレートで `{{ 式 }}` を使用すると、プロパティ、`Inputs`、有効な JavaScript 式から値を表示できます。

さらに詳しい説明については [補間による値の表示](guide/interpolation) ガイドを参照してください。

## レッスンのステップ

IDE でアプリケーションのコードに対して、次のステップを実行します。

### ステップ 1 - 補間値を含めるために `HousingLocationComponent` テンプレートを更新
このステップでは、`HousingLocationComponent` テンプレートに新しい HTML 構造と補間値を追加します。

コードエディタで
1.  `src/app/housing-location/housing-location.component.ts` に移動します。
1.  `@Component` デコレーターのテンプレートプロパティで、既存の HTML マークアップを次のコードに置き換えます。

    <code-example header="Update HousingLocationComponent template" path="first-app-lesson-07/src/app/housing-location/housing-location.component.ts" region="add-listing-details"></code-example>

    この更新されたテンプレートコードでは、`src` 属性に `housingLocation.photo` を バインドするためにプロパティバインディングを使用します。`alt` 属性は画像の alt テキストにより多くの文脈を与えるために補間を使用します。

    `housingLocation` プロパティの名前、都市、州の値を含めるために補間を使用します。

### ステップ 2 - 変更がブラウザに表示されることを確認
1.  すべての変更を保存します。
1.  ブラウザを開くと、アプリケーションが写真、都市、州のサンプルデータを表示していることを確認できます。
    <section class="lightbox">
    <img alt="browser frame of homes-app displaying logo, filter text input box, search button and the same housing location UI card" src="generated/images/guide/faa/homes-app-lesson-07-step-2.png">
    </section>

## レッスンの復習
このレッスンでは、`HousingLocation` テンプレートに値を表示するために新しい HTML 構造を追加し、 Angular テンプレート構文を使用しました。これで、2 つの重要なスキルが得られました。
* コンポーネントにデータを渡すこと
* テンプレートへの値の補間

これらのスキルにより、アプリケーションはデータを共有し、ブラウザで動的な値を表示できるようになりました。素晴らしい仕事です。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [Lesson 8 - Use *ngFor to list objects in component](tutorial/first-app/first-app-lesson-08)

## このレッスンで取り上げたトピックの詳細について
* [補間による値の表示](/guide/interpolation)
* [テンプレート構文](guide/template-syntax)
