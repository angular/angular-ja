# はじめての Angular アプリケーション レッスン 4 - インターフェースの作成

このチュートリアルレッスンでは、インターフェースを作成し、アプリケーションのコンポーネントに含める方法を説明します。

**所要時間**: このレッスンは 10 分程度で終了します。

## 始める前に

このレッスンは前のレッスンのコードから始まります。次のことができます。

*   レッスン 3 で作成したコードを、統合開発環境（IDE）で使用します。
*   前のレッスンのコードサンプルから開始できます。レッスン 3 から <live-example name="first-app-lesson-03"></live-example> を選んでください。
    *   StackBlitz の *live example* を使用すると、StackBlitz インターフェースが IDE になります。
    *   *download example* を使い IDE で開きます。

イントロダクションをまだ確認していない場合は、[Angular チュートリアルのイントロダクション](tutorial/first-app)を参照して、このレッスンを完了するために必要なものがすべて揃っているかどうか確認してください。

このレッスンで問題が発生した場合は、このレッスンの <live-example></live-example> から完成したコードを確認することができます。

## 終わったあと

*  アプリケーションにデータ型として使用できる新しいインターフェースがあります。
*  アプリケーションにサンプルデータをもつ新しいインターフェースのインスタンスがあります。

## インターフェースのコンセプトプレビュー

[Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) はアプリケーションのカスタムデータ型です。 

Angular は、強く型付けされたプログラミング環境での作業を活用するため、TypeScript を使用しています。
強力な型チェックにより、アプリケーション内のある要素が不正なフォーマットのデータを別の要素に送信する可能性が低くなります。
このような型の不一致エラーは TypeScript コンパイラによってキャッチされますが、IDE でもそのようなエラーの多くはキャッチすることができます。

このレッスンでは、1 つの住宅地に関するデータを表すプロパティを定義するためのインターフェースを作成します。

## レッスンのステップ

IDE でアプリケーションのコードに対して、次のステップを実行します。

### ステップ 1 - 新しい Angular インターフェースを作成

このステップではアプリケーションに新しいインターフェースを作成します。

IDE の **ターミナル** ペインで

1.  プロジェクトディレクトリで、`first-app` ディレクトリに移動します。
1.  `first-app` ディレクトリで、新しいインターフェースを作成するために次のコマンドを実行します。

    <code-example format="shell" language="shell">

    ng generate interface housinglocation

    </code-example>

1.  アプリケーションをビルドし `http://localhost:4200` へサーブするために `ng serve` を実行します。
1.  ブラウザで `http://localhost:4200` を開き、アプリケーションを見つけます。
1.  アプリケーションがエラーなく、ビルドされることを確認します。
    次のステップに進む前に、エラーを修正してください。

### ステップ 2 - 新しいインターフェースへプロパティを追加

このステップでは、アプリケーションが住宅地を表現するために必要なプロパティをインターフェースに追加します。

1.  もし、まだ実行していない場合は、IDE の **ターミナル** ペインで `ng serve` コマンドを開始し、アプリケーションをビルドして `http://localhost:4200` へサーブします。
1.  IDE の **編集** ペインで `src/app/housinglocation.ts` ファイルを開きます。
1.  `housinglocation.ts` でデフォルトの内容を次のコードに置き換えて、この例と同じように新しいインターフェースを作成します。

    <code-example header="Update src/app/housinglocation.ts to match this code" path="first-app-lesson-04/src/app/housinglocation.ts"></code-example>

1.  変更を保存して、アプリケーションにエラーが表示されないことを確認します。次のステップに進む前に、エラーを修正してください。

この時点で、id、name、位置情報など、住宅の位置に関するデータを表現するインターフェースが定義されました。

### ステップ 3 - アプリケーションにテスト用の家を作成

インターフェースはありますが、まだ使っていません。

このステップでは、インターフェースのインスタンスを作成し、そこへサンプルデータを割り当てます。
このサンプルデータがアプリケーションに表示されるのはまだ先です。
その前にあと数回、レッスンがあります。

1.  もし、まだ実行していない場合は、IDE の **ターミナル** ペインで `ng serve` コマンドを開始し、アプリケーションをビルドして `http://localhost:4200` へサーブします。
1.  IDE の **編集** ペインで `src/app/home/home.component.ts` を開きます。
1.  `src/app/home/home.component.ts` の `HomeComponent` で新しいインターフェースを使用できるように、既存の import 文の後に次の `import` 文を追加します。

    <code-example header="Import HomeComponent in src/app/home/home.component.ts" path="first-app-lesson-04/src/app/home/home.component.ts" region="housing-location-import"></code-example>

1.  `src/app/home/home.component.ts` で空の `export class HomeComponent {}` を次のコードに置き換えて、コンポーネント内に新しいインターフェースのインスタンスをひとつ作成します。

    <code-example header="Add sample data to src/app/home/home.component.ts" path="first-app-lesson-04/src/app/home/home.component.ts" region="only-house"></code-example>

1.  `home.component.ts` ファイルがこの例のようになっていることを確認してください。

    <code-example header="src/app/home/home.component.ts" path="first-app-lesson-04/src/app/home/home.component.ts"></code-example>

    `HomeComponent` クラスに `HousingLocation` 型のプロパティ `housingLocation` を追加することで、データがインターフェースの記述と一致することを確認することができます。IDE が十分な情報を持っており、データがその記述を満たしていなかった場合、役に立つエラーを出すことができます。

1.  変更を保存して、アプリケーションにエラーがないことを確認します。ブラウザを開き、アプリケーションに "housing-location works!" と表示されたままであることを確認します。

    <section class="lightbox">
    <img alt="browser frame of homes-app displaying logo, filter text input box and search button and the message 'housing-location works!'" src="generated/images/guide/faa/homes-app-lesson-03-step-2.png">
    </section>

1.  次のステップに進む前に、エラーを修正してください。

## レッスンの復習

このレッスンでは、アプリケーションの新しいデータ型を作成するインターフェースを作成しました。
この新しいデータ型により、`HousingLocation` データが必要な場所を指定することができるようになりました。
この新しいデータ型により、IDE と TypeScript コンパイラは、`HousingLocation` データが必要な場所で使用されることを義務づけます。

このレッスンに問題がある場合は、<live-example></live-example> の完成したコードを確認してください。

## 次のステップ

* [Lesson 5 - Add an input parameter to the component](tutorial/first-app/first-app-lesson-05)


## より詳しい情報

このレッスンで扱うトピックの詳細については、こちらをご覧ください

<!-- vale Angular.Google_WordListSuggestions = NO -->

*  [ng generate interface](cli/generate#interface-command)
*  [ng generate](cli/generate)
