# アプリケーションのHousingLocationコンポーネントを作成する

このチュートリアルレッスンでは`HousingLocation`コンポーネントをAngularアプリケーションに追加する方法を紹介します。

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=U4ONEbPvtptdUHTt&amp;start=440"/>

## 何を学ぶか

- アプリケーションに新しいコンポーネント`HousingLocation`が追加され、そのコンポーネントがアプリケーションに追加されたことを確認するメッセージを表示します。

<docs-workflow>

<docs-step title="`HousingLocation`を作成する">
このステップでは、アプリケーションの新しいコンポーネントを作成します。

IDEの**ターミナル**ペインで、

1. プロジェクトのディレクトリで、`first-app`ディレクトリを開きます。

1. 新しく`HousingLocation`を作成するために、次のコマンドを実行します

   ```shell
   ng generate component housingLocation
   ```

1. アプリケーションをビルドし、開発サーバーを起動するために、次のコマンドを実行します。

   ```shell
   ng serve
   ```

   NOTE: このステップはローカル環境でのみ実施します!

1. ブラウザを開き、`http://localhost:4200`にアクセスしてアプリケーションを確認します。
1. アプリケーションがエラーなくビルドされていることを確認します。

   HELPFUL: 新しいコンポーネントを追加しましたが、まだアプリケーションのどのテンプレートにも組み込んでいませんので、前のレッスンと同様の表示になります。

1. 次のステップに進む間も、`ng serve`はそのまま実行し続けておきます。
   </docs-step>

<docs-step title="アプリケーションのレイアウトに新しいコンポーネントを追加する">
このステップでは、新しいコンポーネント`HousingLocation`をアプリケーションの`Home`に追加し、レイアウトに表示されるようにします。

IDEの*編集*ペインで:

1.  エディタで`home.ts`を開きます。
1.  `home.ts`のインポート文に次の行を追加して、`HousingLocation`をインポートします。

      <docs-code header="HousingLocationをsrc/app/home/home.tsにインポートする" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[2]"/>

1.  次に、`@Component`メタデータの`imports`プロパティの配列に`HousingLocation`を追加してを更新します。

      <docs-code  header="HousingLocationをsrc/app/home/home.tsのimports配列に追加する" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[6]"/>

1.  コンポーネントが`Home`のテンプレートで使える状態になりました。`@Component`メタデータの`template`プロパティに`<app-housing-location>`タグを追加して更新します。

      <docs-code language="angular-ts" header="src/app/home/home.ts内のコンポーネントのテンプレートにHousingLocationを追加する" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[7,17]"/>

</docs-step>

<docs-step title="コンポーネントにスタイルを追加する">
このステップでは、`HousingLocation`用にあらかじめ用意されたスタイルをアプリケーションにコピーし、アプリケーションが正しく表示されるようにします。

1. `src/app/housing-location/housing-location.css`を開き、下記のスタイルをファイルに貼り付けますします。

   NOTE: ブラウザでは、`src/app/housing-location/housing-location.ts`の`styles`配列に記載可能です。

   <docs-code header="HousingLocationのCSSスタイルをsrc/app/housing-location/housing-location.cssに追加する" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/housing-location/housing-location.css"/>

1. コードを保存し、ブラウザに戻り、エラーなくビルドされていることを確認してください。"housing-location works!"というメッセージが画面に表示されるはずです。次のステップに進む前にエラーがあれば修正してください。

   <img alt="ロゴを表示するhome-appのブラウザ画面に、テキストをフィルターする入力ボックス、検索ボタンおよびメッセージ'housing-location works!'が表示されている" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

</docs-step>

</docs-workflow>

SUMMARY: このレッスンでは、アプリケーションの新しいコンポーネントを作成し、アプリケーションのレイアウトに追加しました。
