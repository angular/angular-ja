# レッスン 5: コンポーネントに入力パラメータを追加

このチュートリアル・レッスンでは、コンポーネント `@Input()` を作成し、それを使用してカスタマイズのためにデータをコンポーネントに渡す方法を示します。

**所要時間**: 〜10 分

**開始時のコード:** <live-example name="first-app-lesson-04"></live-example>

**完了時のコード:** <live-example name="first-app-lesson-05"></live-example>

## ここで学べること

アプリケーションの `HousingLocationComponent` テンプレートに、入力を受け取るための `HousingLocation` プロパティを追加します。

## Input のコンセプトプレビュー
[Input](api/core/Input) により、コンポーネントはデータを共有することができます。データ共有の方向は親コンポーネントから子コンポーネントになります。

このレッスンでは、`HousingLocationComponent` コンポーネントで `@Input()` プロパティを定義し、コンポーネントに表示されるデータをカスタマイズできるようになります。

詳しくは、[子ディレクティブと親コンポーネント間のデータ共有](guide/inputs-outputs) ガイドを参照してください。

## ステップ 1 - Input デコレーターをインポート
このステップでは、`Input` デコレーターをクラスにインポートします。

コードエディタで
1.  `src/app/housing-location/housing-location.component.ts` に移動します。
1.  `Input` と `HousingLocation` を含むように、ファイルのインポートを更新します。

    <code-example header="Import HousingLocationComponent and Input in src/app/housing-location/housing-location.component.ts" path="first-app-lesson-05/src/app/housing-location/housing-location.component.ts" region="add-imports"></code-example>

## ステップ 2 - Input プロパティを追加
1.  同じファイルの `HousingLocationComponent` クラスに `HousingLocation` 型の `housingLocation` プロパティを追加します。プロパティ名の後に `!` を付け `@Input()` デコレーターでプレフィックスを付けます。

    <code-example header="Import HousingLocationComponent and Input in src/app/housing-location/housing-location.component.ts" path="first-app-lesson-05/src/app/housing-location/housing-location.component.ts" region="add-housing-location-property"></code-example>

    `!` を付ける必要があるのは、入力に値が渡されることを期待しているためです。この場合、デフォルト値はありません。このアプリケーション例では、値が渡されることがわかっているため、これは仕様です。感嘆符は非 null アサーション演算子と呼ばれ、このプロパティの値が null または undefined にならないことを TypeScript コンパイラに伝えます。

1.  変更を保存し、アプリケーションにエラーがないことを確認します。

1.  次のステップに進む前に、エラーを修正してください。

## レッスンの復習

このレッスンでは、`@Input()` デコレーターで装飾された新しいプロパティを作成しました。また、非 null アサーション演算子を使用して、新しいプロパティの値が `null` または `undefined` にならないことをコンパイラに通知しました。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [Lesson 6 - Add a property binding to an component’s template](tutorial/first-app/first-app-lesson-06)

## このレッスンで取り上げるトピックの詳細については、次を参照
* [ディレクティブとコンポーネントの親子間でのデータ共有](guide/inputs-outputs)

@reviewed 2023-07-11