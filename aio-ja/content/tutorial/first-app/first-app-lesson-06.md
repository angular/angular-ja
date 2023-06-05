# レッスン 6 - コンポーネントのテンプレートにプロパティバインディングを追加

このチュートリアルレッスンでは、テンプレートにプロパティバインディングを追加し、それを使ってコンポーネントに動的なデータを渡す方法を説明します。

**所要時間**: このレッスンは 5 分程度で終了します。

## 始める前に

このレッスンは前のレッスンのコードから始まります。次のことができます。

*   レッスン 5 で作成したコードを、統合開発環境（IDE）で使用します。
*   前のレッスンのコードサンプルから開始できます。レッスン 5 から <live-example name="first-app-lesson-05"></live-example> を選んでください。
    *   StackBlitz の *live example* を使用すると、StackBlitz インターフェースが IDE になります。
    *   *download example* を使い IDE で開きます。

イントロダクションをまだ確認していない場合は、[Angular チュートリアルのイントロダクション](tutorial/first-app)を参照して、このレッスンを完了するために必要なものがすべて揃っているかどうか確認してください。

このレッスンで問題が発生した場合は、このレッスンの <live-example></live-example> から完成したコードを確認することができます。

## 終わったあと

*  アプリケーションの `HomeComponent` テンプレートにデータバインディングがあります。
*  アプリケーションは `HomeComponent` から `HousingLocationComponent` にデータを送信します。

## Input のコンセプトプレビュー
レッスン 5 では、`HousingLocationComponent` のプロパティに `@Input` デコレーターを追加して、コンポーネントがデータを受信できるようにしました。このレッスンでは、テンプレート内のこれらのプロパティにデータをバインドすることで、親コンポーネントから子コンポーネントにデータを共有するプロセスを続けます。Angular にはデータバインディングの形式がいくつかありますが、このレッスンではプロパティバインディングを使用します。

プロパティバインディングは、変数を Angular テンプレートの `Input` に接続できます。データは動的に `Input` にバインドされます。

より詳細な説明については、[Property binding](guide/property-binding) ガイドを確認してください。

## レッスンのステップ

IDE でアプリケーションのコードに対して、次のステップを実行します。

### ステップ 1 - `HomeComponent` テンプレートの <app-housing-location> タグを更新
このステップでは、`<app-housing-location>` タグにプロパティバインディングを追加します。

コードエディタで
1.  `src/app/home/home.component.ts` に移動します。
1.  `@Component` デコレーターのテンプレートプロパティで、次のコードと一致するようにコードを更新します。
    <code-example header="Add housingLocation property binding" path="first-app-lesson-06/src/app/home/home.component.ts" region="add-property-binding"></code-example>

    コンポーネントタグにプロパティバインディングを追加するときは、`[attribute] = "value"` 構文を使って、割り当てられた値を文字列値ではなくコンポーネントクラスのプロパティとして扱うことを Angular に通知します。

    右側の値は、`HomeComponent` のプロパティ名です。

### ステップ 2 - コードが引き続き機能することを確認
1.  変更を保存し、アプリケーションにエラーがないことを確認します。
1.  次のステップに進む前に、エラーを修正してください。

## レッスンの復習

このレッスンでは、新しいプロパティバインディングを追加し、クラスプロパティへの参照を渡しました。これで、`HousingLocationComponent` は、コンポーネントの表示をカスタマイズするために使用できるデータにアクセスできるようになりました。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [Lesson 7 - Add an interpolation to a component’s template](tutorial/first-app/first-app-lesson-07)

## このレッスンで取り上げるトピックの詳細については、次を参照
* [Property binding](guide/property-binding)