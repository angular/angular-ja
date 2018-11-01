{@a the-hero-editor}
# ヒーローエディター

アプリケーションに基本的なタイトルが追加されました。
次に、ヒーロー情報を表示するための新しいコンポーネントを作成し、
そのコンポーネントをアプリケーションシェルに配置します。

{@a create-the-heroes-component}
## heroes コンポーネントを作成する

Angular CLIを使用して､`heroes`という名前の新しいコンポーネントを生成します。

<code-example language="sh" class="code-shell">
  ng generate component heroes
</code-example>

CLIは`src/app/heroes/`という新しいフォルダを作成し、
`HeroesComponent`に関する3つのファイルを生成します。

`HeroesComponent`のクラスファイルは次のとおりです。

<code-example 
  path="toh-pt1/src/app/heroes/heroes.component.ts" region="v1" 
  header="app/heroes/heroes.component.ts (初期バージョン)" linenums="false">
</code-example>

常にAngularコアライブラリから`Component`シンボルをインポートし、
コンポーネントクラスに`@Component`で注釈を付けます。

`@Component`は、コンポーネントのAngularメタデータを指定するデコレーター関数です。

CLIは3つのメタデータプロパティを生成しました:

1. `selector`&mdash; コンポーネントのCSS要素セレクター
1. `templateUrl`&mdash; コンポーネントのテンプレートファイルの場所
1. `styleUrls`&mdash; コンポーネントのプライベートCSSスタイルの場所

{@a selector}

[CSS要素セレクタ](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)である
`'app-heroes'`は、親コンポーネントのテンプレート内でこのコンポーネントを識別するHTML要素の名前と一致します。

`ngOnInit`は[ライフサイクルフック](guide/lifecycle-hooks#oninit)です。
Angularは、コンポーネントの作成直後に`ngOnInit`を呼び出します。
初期化ロジックを置くのに適しています。

常にコンポーネントクラスを`export`するので、`AppModule`のようにいつでも他の場所に`import`できます。

{@a add-a-hero-property}
### _hero_ プロパティを追加する

"Windstorm"という名前のヒーローのために、`HeroesComponent`に`hero`プロパティを追加します。

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" region="add-hero" header="heroes.component.ts (hero プロパティ)" linenums="false">
</code-example>

{@a show-the-hero}
### ヒーローを表示する

`heroes.component.html`テンプレートファイルを開きます。
Angular CLIで生成されたデフォルトのテキストを削除し、
それを新しい`hero`プロパティへのデータバインディングに置き換えてください。

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" header="heroes.component.html" region="show-hero-1" linenums="false">
</code-example>

{@a show-the-heroescomponent-view}
## _HeroesComponent_ ビューを表示する

`HeroesComponent`を表示するには、それをアプリケーションシェルの`AppComponent`のテンプレートに追加する必要があります。

`app-heroes`は`HeroesComponent`の[要素セレクタ](#selector)であることを思い出してください。
なので、`AppComponent`のテンプレートファイルで、タイトルの直下に`<app-heroes>`要素を追加してください。

<code-example path="toh-pt1/src/app/app.component.html" header="src/app/app.component.html" linenums="false">
</code-example>

CLIの`ng serve`コマンドがまだ実行中であれば、
ブラウザが更新され、アプリケーションのタイトルとヒーローの名前が表示されます。

{@a create-a-hero-class}
## Hero クラスを作成する

本当のヒーローは名前だけではありません。

`src/app`フォルダ内の独自のファイルに、`Hero`クラスを作成します。
それに`id`プロパティと`name`プロパティを与えます。

<code-example path="toh-pt1/src/app/hero.ts"  header="src/app/hero.ts" linenums="false">
</code-example>


`HeroesComponent`クラスに戻り、`Hero`クラスをインポートします。

コンポーネントの`hero`プロパティを`Hero`型にリファクタリングします。
それを、`1`という`id`と`Windstorm`という名前で初期化します。

改訂された`HeroesComponent`のクラスファイルは、次のようになります。

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" linenums="false"
  header= "src/app/heroes/heroes.component.ts">
</code-example>

ヒーローを文字列からオブジェクトに変更したため、ページが正しく表示されなくなりました。

{@a show-the-hero-object}
## ヒーローオブジェクトを表示する

ヒーローの名前を知らせるためにテンプレートのバインディングを更新し、
次のような詳細レイアウトで`id`と`name`の両方を表示します。

<code-example 
  path="toh-pt1/src/app/heroes/heroes.component.1.html"
  region="show-hero-2" 
  header="heroes.component.html (HeroesComponent のテンプレート)" linenums="false">
</code-example>

ブラウザが更新され、ヒーローの情報が表示されます。

{@a format-with-the-uppercasepipe}
## _UppercasePipe_ で書式設定する

`hero.name`のバインディングをこのように修正してください。
<code-example
  path="toh-pt1/src/app/heroes/heroes.component.html"
  region="pipe">
</code-example>

ブラウザが更新され、ヒーローの名前が大文字で表示されるようになります。

補間バインディングの中、パイプ演算子 ( | ) の直後にある単語`uppercase`は、
組み込みの`UppercasePipe`を起動します。

[パイプ](guide/pipes)は、文字列、通貨金額、日付や、その他の表示データを書式設定するのに適しています。
Angularは複数のビルトインパイプを備えており、あなた自身が独自のパイプを作ることもできます。

{@a edit-the-hero}
## ヒーローを編集する

ユーザーは`<input>`テキストボックスでヒーローの名前を編集できるべきです。

テキストボックスにはヒーローの`name`プロパティが _表示_ され、
ユーザーの入力時にそのプロパティが _更新_ されます。
これは、コンポーネントクラスから _画面へ_ 、
そして画面から _コンポーネントクラスへの_ データフローを意味します。

そのデータフローを自動化するには、`<input>`フォーム要素と`hero.name`プロパティとの間に双方向データバインディングを設定します。

{@a two-way-binding}
### 双方向データバインディング

`HeroesComponent`テンプレートの詳細エリアをリファクタリングすると、次のようになります。

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" region="name-input" header="src/app/heroes/heroes.component.html (HeroesComponent のテンプレート)" linenums="false">

</code-example>

**[(ngModel)]** は、Angularの双方向データバインディング構文です。

これで`hero.name`プロパティをHTMLのテキストボックスにバインドするので、
`hero.name`プロパティからテキストボックスへ、テキストボックスから`hero.name`プロパティへ、 _双方向に_ データを流すことができます。

{@a the-missing-formsmodule}
### 見つからない _FormsModule_

`[(ngModel)]`を追加したときにアプリケーションが動かなくなったことに注目してください。

エラーを表示するには、ブラウザの開発ツールを開き、
コンソールで次のようなメッセージを探します、

<code-example language="sh" class="code-shell">
Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.
</code-example>

`ngModel`は有効なAngularディレクティブですが、デフォルトでは使用できません。

これはオプションの`FormsModule`に属しており、使用するにはそのモジュールをオプトインする必要があります。

## _AppModule_

Angularでは、アプリケーションの部品がどのように合わさるかや、
アプリケーションが必要としている他のファイルやライブラリを知る必要があります。
この情報を _メタデータ_ といいます。

一部のメタデータは、コンポーネントクラスに追加した`@Component`デコレーター内にあります。
その他の重要なメタデータは[`@NgModule`](guide/ngmodules)デコレーター内にあります。

もっとも重要な`@NgModule`デコレーターは、トップレベルの **AppModule** クラスに注釈を付けます。

Angular CLI は、プロジェクトを作成するときに`src/app/app.module.ts`に`AppModule`クラスを作成しました。
ここで`FormsModule`をオプトインします。

{@a import-formsmodule}
### _FormsModule_ をインポートする

`AppModule` (`app.module.ts`) を開き、`@angular/forms`ライブラリから`FormsModule`シンボルをインポートします。

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts (FormsModule シンボルのインポート)"
 region="formsmodule-js-import">
</code-example>

それから、`FormsModule`を`@NgModule`メタデータの`imports`配列に追加します。
この配列には、アプリケーションに必要な外部モジュールのリストが含まれています。

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts ( @NgModule imports)"
region="ng-imports">
</code-example>

ブラウザが更新されると、アプリケーションは再び動作するはずです。ヒーローの名前を編集し、テキストボックスの上にある`<h2>`に即座に変更が反映されていることを確認できます。

{@a declare-heroescomponent}
### _HeroesComponent_ を宣言する

すべてのコンポーネントは、 _ただ1つの_ [NgModule](guide/ngmodules)で宣言されなければなりません。

_あなたは_ `HeroesComponent`を宣言していません。
では、なぜアプリケーションは動作したのでしょうか？

アプリケーションが動作したのは、Angular CLI が`HeroesComponent`を生成したときに、`AppModule`でそのコンポーネントの宣言を行っていたからです。

`src/app/app.module.ts`を開き、先頭付近で`HeroesComponent`がインポートされているのを見つけてください。
<code-example path="toh-pt1/src/app/app.module.ts" region="heroes-import" >
</code-example>

`HeroesComponent`は、`@NgModule.declarations`配列で宣言されています。
<code-example path="toh-pt1/src/app/app.module.ts" region="declarations">
</code-example>

`AppModule`は`AppComponent`と`HeroesComponent`の両方のアプリケーションコンポーネントを宣言しています。


{@a final-code-review}
## 最終的なコードレビュー

あなたのアプリケーションはこのように見えるはずです <live-example></live-example> 。このページで解説したコードファイルは次のとおりです。

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/app.module.ts" 
  path="toh-pt1/src/app/app.module.ts">
  </code-pane>

  <code-pane header="src/app/app.component.ts" path="toh-pt1/src/app/app.component.ts">
  </code-pane>

  <code-pane header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html">
  </code-pane>

  <code-pane header="src/app/hero.ts" 
  path="toh-pt1/src/app/hero.ts">
  </code-pane>

</code-tabs>

{@a summary}
## まとめ

* CLIを使用して、2番目の `HeroesComponent` を作成しました。
* `HeroesComponent` を `AppComponent` シェルに追加して表示しました。
* 名前をフォーマットするために、 `UppercasePipe` を適用しました。
* `ngModel` ディレクティブで双方向データバインディングを使用しました。
* `AppModule` について学びました。
* `AppModule` に `FormsModule` をインポートして、Angular `ngModel` ディレクティブを認識して適用するようにしました。
* `AppModule` でコンポーネントを宣言することの重要性を学び、CLIがあなたのためにその宣言を行っていることを認識しました。
