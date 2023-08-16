# レッスン 6 - コンポーネントのテンプレートにプロパティバインディングを追加

このチュートリアルレッスンでは、テンプレートにプロパティバインディングを追加し、それを使ってコンポーネントに動的なデータを渡す方法を説明します。

**所要時間**: 〜10 分

**開始時のコード:** <live-example name="first-app-lesson-05"></live-example>

**完了時のコード:** <live-example name="first-app-lesson-06"></live-example>

## ここで学べること

*  アプリケーションの `HomeComponent` テンプレートにデータバインディングを追加します。
*  アプリケーションは `HomeComponent` から `HousingLocationComponent` にデータを送信します。

## Input のコンセプトプレビュー
このレッスンでは、プロパティバインディングを使い、テンプレート内のプロパティにデータをバインドすることで、親コンポーネントから子コンポーネントへデータを共有するプロセスを進めます。

プロパティバインディングは、変数を Angular テンプレートの `Input` に接続できます。データは動的に `Input` にバインドされます。

より詳細な説明については、[Property binding](guide/property-binding) ガイドを確認してください。

## ステップ 1 - `HomeComponent` テンプレートの <app-housing-location> タグを更新
このステップでは、`<app-housing-location>` タグにプロパティバインディングを追加します。

コードエディタで
1.  `src/app/home/home.component.ts` に移動します。
1.  `@Component` デコレーターのテンプレートプロパティで、次のコードと一致するようにコードを更新します。
    <code-example header="Add housingLocation property binding" path="first-app-lesson-06/src/app/home/home.component.ts" region="add-property-binding"></code-example>

    コンポーネントタグにプロパティバインディングを追加するときは、`[attribute] = "value"` 構文を使って、割り当てられた値を文字列値ではなくコンポーネントクラスのプロパティとして扱うことを Angular に通知します。

    右側の値は、`HomeComponent` のプロパティ名です。

## ステップ 2 - コードが引き続き機能することを確認
1.  変更を保存し、アプリケーションにエラーがないことを確認します。
1.  次のステップに進む前に、エラーを修正してください。

## レッスンの復習

このレッスンでは、新しいプロパティバインディングを追加し、クラスプロパティへの参照を渡しました。これで、`HousingLocationComponent` は、コンポーネントの表示をカスタマイズするために使用できるデータにアクセスできるようになりました。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [Lesson 7 - Add an interpolation to a component’s template](tutorial/first-app/first-app-lesson-07)

## このレッスンで取り上げたトピックの詳細について
* [Property binding](guide/property-binding)

@reviewed 2023-07-11