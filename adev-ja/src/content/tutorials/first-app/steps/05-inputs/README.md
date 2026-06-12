# コンポーネントに入力パラメーターを追加する

このチュートリアルレッスンでは`input`を作成し、それを使ってコンポーネントにデータを渡してカスタマイズする方法を紹介します。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

NOTE: この動画は古い構文を使っていますが、主要なコンセプトは今でも有効です。

## 何を学ぶか

アプリケーションの`HousingLocation`コンポーネントのテンプレートには、入力を受け取るための`HousingLocation`プロパティがあります。

## inputプロパティのコンセプト概要

[Inputs](api/core/input)を使うと、親コンポーネントから渡されるデータを子コンポーネントで受け取れるようになります。

このレッスンでは、コンポーネントで表示されるデータをカスタマイズできるようにするため、`HousingLocation`コンポーネント内に`input`プロパティを定義します。

詳しく学ぶには[inputプロパティでデータを受け取る](guide/components/inputs)ガイドと[outputを使ったカスタムイベント](guide/components/outputs)ガイドを参照して下さい。

<docs-workflow>

<docs-step title="input()関数をインポートする">
コードエディタ―で、`HousingLocation`コンポーネントに`@angular/core`から`input`ヘルパーメソッドをインポートします。

<docs-code header="housing-location.tsでinputをインポートする" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[1]"/>

</docs-step>

<docs-step title="inputプロパティを追加する">
必須のプロパティであるhousingLocationを追加し、`HousingLocationInfo`型として`input.required()`を使って初期化します。

  <docs-code header="housing-location.tsでinputプロパティを宣言する" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[12]"/>

親コンポーネントが値を必ず提供しなければならないことを示すために、`input`の`required`メソッドを呼び出す必要があります。例のアプリケーションでは、この値は設計上必ず渡されます。`.required()`を呼ぶことで、TypeScriptコンパイラがこの制約をチェックし、さらにテンプレートでコンポーネントが使用される際に、このプロパティを非nullとして扱います。

</docs-step>

<docs-step title="inputにデータを渡す">
`Home`コンポーネントからHousingLocationコンポーネントの`housingLocation`プロパティへ`housingLocation`の値を渡します。

<docs-code language="angular-ts" header="home.tsでHousingLocation用のinputプロパティを宣言する" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/home/home.ts" visibleLines="[16]"/>

</docs-step>

</docs-workflow>

SUMMARY: このレッスンでは、新しい`input`プロパティを作成しました。また、`.required`メソッドを使うことで、シグナル値が常に定義されていることを保証します。

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="inputプロパティでデータを受け取る"/>
  <docs-pill href="guide/components/outputs" title="outputを使ったカスタムイベント"/>
</docs-pill-row>
