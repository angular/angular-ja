# レッスン 7 - コンポーネントのテンプレートに補間を追加

このチュートリアルレッスンでは、テンプレートに動的なデータを表示するために、Angular テンプレートに補間を追加する方法を示します。

**所要時間**: 〜10 分

**開始時のコード:** <live-example name="first-app-lesson-06"></live-example>

**完了時のコード:** <live-example name="first-app-lesson-07"></live-example>

## ここで学べること

*  アプリケーションは `HousingLocationComponent` テンプレートに補間された値を表示します。
*  アプリケーションは住宅の位置データをブラウザにレンダリングします。

## 補間のコンセプトプレビュー
このステップでは、補間を使ってテンプレートに値（プロパティや `Input` の値）を表示します。

[テンプレート構文](guide/template-syntax) は静的なテンプレートコンテンツと動的な値や式を混ぜることをサポートしています。

Angular テンプレートで `{{ 式 }}` を使用すると、プロパティ、`Inputs`、有効な JavaScript 式から値を表示できます。

さらに詳しい説明については [補間による値の表示](guide/interpolation) ガイドを参照してください。

## ステップ 1 - 補間値を含めるために `HousingLocationComponent` テンプレートを更新
このステップでは、`HousingLocationComponent` テンプレートに新しい HTML 構造と補間値を追加します。

コードエディタで
1.  `src/app/housing-location/housing-location.component.ts` に移動します。
1.  `@Component` デコレーターのテンプレートプロパティで、既存の HTML マークアップを次のコードに置き換えます。

    <code-example header="Update HousingLocationComponent template" path="first-app-lesson-07/src/app/housing-location/housing-location.component.ts" region="add-listing-details"></code-example>

    この更新されたテンプレートコードでは、`src` 属性に `housingLocation.photo` を バインドするためにプロパティバインディングを使用します。`alt` 属性は画像の alt テキストにより多くの文脈を与えるために補間を使用します。

    `housingLocation` プロパティの`name`、`city`、`state`の値を含めるために補間を使用します。

## ステップ 2 - 変更がブラウザに表示されることを確認
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

@reviewed 2023-07-11