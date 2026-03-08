# homeコンポーネントを作成する

このチュートリアルはAngularアプリケーションの新しい[コンポーネント](guide/components)を作成する方法を紹介します。

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=OMVaw71EIa44yIOJ"/>

## 何を学ぶか

アプリケーションに新しいコンポーネント`Home`が追加されます。

## Angularコンポーネントの概念的な概要

Angularアプリケーションはコンポーネントを中心に構築されており、Angularの基本的な構成要素です。
コンポーネントはアプリケーション内の要素の機能や見た目を提供するコード、HTMLレイアウト、CSSスタイルが含まれます。
Angularではコンポーネントの中にさらに別のコンポーネントを含めることができます。アプリケーションの機能や見た目はコンポーネン単位に分割して構成できます。

Angularでは、コンポーネントにはプロパティを定義するためのメタデータがあります。
`Home`コンポーネントを作成するときには、これらのプロパティを使用します。

- `selector`: テンプレートでAngularがコンポーネントを参照する方法を示します。
- `standalone`: コンポーネントが`NgModule`を必要とするかを示します。
- `imports`: コンポーネントの依存関係を示します。
- `template`: コンポーネントのHTMLマークアップとレイアウトを示します。
- `styleUrls`: コンポーネントが使用するCSSファイルのURLを配列で指定します。

<docs-pill-row>
  <docs-pill href="api/core/Component" title="コンポーネントについて詳しく学ぶ"/>
</docs-pill-row>

<docs-workflow>

<docs-step title="Create the `Home`">
このステップでは、アプリケーション用の新しいコンポーネントを作成します。

IDEの**ターミナル**ペインで、

1. プロジェクトディレクトリの中の、`first-app`ディレクトリを開きます。
1. 新しい`Home`コンポーネントを作成するために、次のコマンドを実行します。

   ```shell
   ng generate component home
   ```

1. アプリケーションをビルドし、開発サーバーを起動するために、次のコマンドを実行します。

   NOTE: このステップはローカル環境でのみ実施します！

   ```shell
   ng serve
   ```

1. ブラウザを開き、`http://localhost:4200`にアクセスしてアプリケーションを確認します。

1. アプリケーションがエラーなくビルドされていることを確認します。

   HELPFUL: 新しいコンポーネントを追加しましたが、まだアプリケーションのどのテンプレートにも組み込んでいませんので、前のレッスンと同様の表示になります。

1. 次のステップに進む間も、`ng serve`はそのまま実行し続けておきます。
   </docs-step>

<docs-step title="アプリケーションのレイアウトに新しいコンポーネントを追加する">
このステップでは、新しいコンポーネント`Home`をアプリのルートコンポーネントである`App`に追加し、アプリケーションのレイアウトに表示されるようにします。

IDEの**編集**ペインで、

1.  エディタで`app.ts`を開きます。
1.  `app.ts`でファイルレベルのインポートに、次の行を追加して`Home`をインポートします。

      <docs-code header="src/app/app.tsでHomeをインポートする" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[2]"/>

1.  `app.ts`の`@Component`内で、`imports`配列プロパティに`Home`を追加します。

      <docs-code header="src/app/app.tsで置き換える" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[6]"/>

1.  `app.ts`の`@Component`内で、次のHTMLコードを含むように`template`プロパティを更新します。

      <docs-code language="angular-ts" header="src/app/app.tsで置き換える" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[7,16]"/>

1.  変更を`app.ts`に保存します。
1.  `ng serve`が実行中の場合、アプリケーションは自動的に更新されます。
    実行中でない場合、再度`ng serve`を開始してください。
    `Home`コンポーネントによって、*Hello world*が*home works!*に変わるはずです。
1.  ブラウザで実行中のアプリケーションをチェックし、アプリケーションが更新されていることを確認します。

  <img alt="テキスト'home works!'を表示するページのブラウザのフレーム" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-2.png">

</docs-step>

<docs-step title="`Home`コンポーネントに機能を追加する">

このステップでは、`Home`コンポーネントに機能を追加します。

前のステップでは、`Home`のデフォルトのHTMLがアプリケーションで表示されるよう、`Home`をアプリケーションのテンプレートに追加しました。
このステップでは、後のレッスンで使用する検索フィルターとボタンを追加します。
現時点で`Home`が持つのはこれだけです。
なお、このステップでは検索用の要素をレイアウトに追加するだけで、まだ機能はありません。

(ng newで)スターターを使わずに、新しいAngularプロジェクトを作成した場合、
検索ボタンと入力欄の枠線が表示されるよう`src/styles.css`に次のグローバルスタイルを追加します。

```
:root {
  --primary-color: #605DC8;
  --secondary-color: #8B89E6;
  --accent-color: #e8e7fa;
  --shadow-color: #E8E8E8;
}

button.primary {
  padding: 10px;
  border: solid 1px var(--primary-color);
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
}
```

IDEの**編集**ペインで、

1.  `first-app`ディレクトリで、`home.ts`をエディタで開きます。
1.  `home.ts`の`@Component`で、`template`プロパティを次のコードで更新します。

      <docs-code language="angular-ts" header="src/app/home/home.tsを置き換える" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.ts" visibleLines="[5,12]"/>

1.  次に、エディタで`home.css`を開き、次のスタイルで内容を更新します。`

    NOTE: ブラウザでは、`src/app/home/home.ts`の`styles`配列にこれらのスタイルを記述可能です。

       <docs-code header="src/app/home/home.cssを置き換える" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.css"/>

1.  アプリケーションがエラーなくビルドされていることを確認してください。フィルター用の入力ボックスとボタンが表示され、スタイルが反映されているはずです。次のステップに進む前に、エラーがあれば修正してください。

   <img alt="homesアプリケーションのロゴ、フィルター入力欄、検索ボタンが表示されたブラウザ画面" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-3.png">
</docs-step>

</docs-workflow>

SUMMARY: このレッスンでは、アプリケーションに新しいコンポーネントを作成し、フィルター用の入力欄とボタンを追加しました。

このレッスンで扱った内容の詳細については、次のページをご覧ください:

<docs-pill-row>
  <docs-pill href="cli/generate/component" title="`ng generate component`"/>
  <docs-pill href="api/core/Component" title="`Component`リファレンス"/>
  <docs-pill href="guide/components" title="Angularコンポーネントの概要"/>
</docs-pill-row>
