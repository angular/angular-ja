# コンポーネントのテンプレートにプロパティバインディングを追加する

このチュートリアルレッスンではテンプレートにプロパティバインディングを追加する方法とコンポーネントに動的データを渡すための使用方法を紹介します。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## 何を学ぶか

- アプリケーションの`Home`テンプレートにデータバインディングが追加されます。
- アプリケーションが`Home`から`HousingLocation`にデータを送れるようになります。

## inputプロパティのコンセプト概要

このレッスンでは、プロパティバインディングを使ってテンプレート内のプロパティに値を渡し、親コンポーネントから子コンポーネントへデータを共有する方法を続けて学びます。

プロパティバインディングを使うと、Angularテンプレート内で変数を`Input`プロパティに結びつけることができます。こうして渡されたデータは`Input`に動的にバインドされます。

より詳しい説明は、ガイドの[プロパティバインディング](/guide/templates/binding#binding-dynamic-properties-and-attributes)を参照してください。

<docs-workflow>

<docs-step title="`Home`テンプレートを更新する">
このステップでは、`<app-housing-location>`タグにプロパティバインディングを追加します。

コードエディタで、

1.  `src/app/home/home.ts`に移動します
1.  `@Component`のテンプレートプロパティで、以下のコードと同じ内容になるよう更新します。
    <docs-code language="angular-ts" header="housingLocationプロパティバインディングを追加する" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.ts" visibleLines="[15,17]"/>

    コンポーネントタグにプロパティバインディングを追加する際には、`[attribute] = "value"`という構文を使います。これは割り当てた値を文字列ではなくコンポーネントクラスのプロパティとして扱うようAngularに指示するためのものです。

    右辺の値は`Home`コンポーネントのプロパティ名です。

</docs-step>

<docs-step title="コードが正しく動作することを確認する">
1.  変更を保存し、アプリケーションにエラーがないことを確認します。
1.  次のステップに進む前に、エラーがあれば修正します。
</docs-step>

</docs-workflow>

SUMMARY: このレッスンでは、新しいプロパティバインディングを追加し、クラスプロパティへの参照を渡しました。これにより、`HousingLocation`はコンポーネントの表示をカスタマイズするために利用可能なデータにアクセスできるようになりました。

このレッスンで扱った内容について、さらに詳しく知りたい場合は次のページをご覧ください:

<docs-pill-row>
  <docs-pill href="/guide/templates/binding#binding-dynamic-properties-and-attributes" title="プロパティのバインディング"/>
</docs-pill-row>
