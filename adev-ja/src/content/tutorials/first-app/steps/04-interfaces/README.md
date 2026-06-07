# インターフェースを作成する

このレッスンではインターフェースを作成し、アプリケーションのコンポーネントに組み込む方法を紹介します。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=YkFSeUeV8Ixtz8pm"/>

## 何を学ぶか

- データ型として利用できる新しいインターフェースの作成
- サンプルデータを持つ新しいインターフェースのインスタンスの作成

## インターフェースのコンセプト概要

[Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)はアプリケーションで使用するカスタムデータ型です

Angularは強い型付けのプログラミング環境で作業できるようにするためにTypeScriptを使用しています。
強力な型チェックにより、アプリケーション内のある要素が別の要素に誤った形式のデータを送る可能性を減らせます。
このような型の不一致によるエラーはTypeScriptコンパイラによって検出され、多くの場合IDEでも検出できます。

このレッスンでは、1つの住宅物件に関するデータを表すプロパティを定義するインターフェースを作成します。

<docs-workflow>

<docs-step title="新しいAngularインターフェースを作成する">
このステップではアプリケーションに新しいインターフェースを作成します。

IDEの**ターミナル**ペインで、

1. プロジェクトディレクトリ内の、`first-app`ディレクトリに移動します。
1. `first-app`ディレクトリで、このコマンドを実行して新しいインターフェースを作成します。

   ```shell

   ng generate interface housinglocation

   ```

1. `ng serve`を実行してアプリケーションをビルドし、`http://localhost:4200`で開発サーバーを起動します。
1. ブラウザで、`http://localhost:4200`を開き、アプリケーションを表示します。
1. アプリケーションがエラーなくビルドされていることを確認します。
   次のステップに進む前に、エラーがあれば修正してください。
   </docs-step>

<docs-step title="新しいインターフェースにプロパティを追加する">
このステップでは住宅物件を表すためにアプリケーションが必要とするプロパティをインターフェースに追加します。

1.  IDEの**ターミナル**ペインで、`ng serve`コマンドがまだ実行されていない場合は起動し、アプリケーションをビルドして`http://localhost:4200`で開発サーバーを起動します。
1.  IDEの**編集**ペインで、`src/app/housinglocation.ts`を開きます。
1.  `housinglocation.ts`のデフォルトの内容を以下のコードと同じになるように置き換えて、新しいインターフェースを作成します。

      <docs-code header="src/app/housinglocation.tsをこのコードに合わせて更新する" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/housinglocation.ts" visibleLines="[1,10]" />

1.  変更を保存し、アプリケーションがエラーを表示していないことを確認します。次のステップに進む前に、エラーがあれば修正してください。

ここまでで、`id`と`name`、および場所情報を含む住宅物件データを表すインターフェースを定義しました。
</docs-step>

<docs-step title="アプリケーション用のテスト用住宅データを作成する">
インターフェースは定義しましたが、まだ使用していません。

このステップでは、インターフェースのインスタンスを作成し、サンプルデータを割り当てます。
このサンプルデータは、まだアプリケーションには表示されません。
これが表示されるようになるまでには、いくつかのレッスンを進める必要があります。

1.  IDEの**ターミナル**ペインで、`ng serve`コマンドがまだ実行されていない場合は起動し、アプリケーションをビルドして`http://localhost:4200`で開発サーバーを起動します。
1.  IDEの*編集*ペインで、`src/app/home/home.ts`を開きます。
1.  `src/app/home/home.ts`で、`Home`が新しいインターフェースを使えるように、既存の`import`文の後にこのimport文を追加します。

      <docs-code language="angular-ts" header="src/app/homse/home.tsでHomeをインポートする" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[3]"/>

1.  `src/app/home/home.ts`で、空の`export class Home {}`の定義をコンポーネント内で新しいインターフェースの単一のインスタンスを作成する次のコードに置き換えてください。

      <docs-code language="angular-ts" header="src/app/home/home.tsにサンプルデータを追加する" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[22,35]"/>

1.  `home.ts`ファイルが次の例と一致していることを確認してください。

      <docs-code language="angular-ts" header="src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[[1,7],[9,36]]" />

    `Home`クラスに`HousingLocation`型の`housingLocation`プロパティを追加することで、データがインターフェースの定義どおりであることを確認できます。もしデータがインターフェースの定義を満たしていなければ、IDEがその旨のエラーを表示して知らせてくれます。

1.  変更を保存し、アプリケーションにエラーがないことを確認してください。ブラウザを開き、アプリケーションが引き続き"housing-location works!"というメッセージを表示していることを確認してください。

      <img alt="ロゴ、フィルター用のテキスト入力ボックス、検索ボタン、そして'housing-location works!'というメッセージを表示しているhomes-appのブラウザフレーム" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

1.  次のステップに進む前に、エラーがあれば修正してください。
    </docs-step>

</docs-workflow>

SUMMARY: このレッスンでは、アプリケーションで新しいデータ型を定義するインターフェースを作成しました。
この新しいデータ型によって、`HousingLocation`データが必要となる箇所を明確に指定できます。
また、この新しいデータ型で、IDEとTypeScriptコンパイラが`HousingLocation`データが正しく使われているかどうかを検証できるようになります。

このレッスンで扱った内容の詳細については、次のページをご覧ください:

<docs-pill-row>
  <docs-pill href="cli/generate/interface" title="ng generate interface"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
