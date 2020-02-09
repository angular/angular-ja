{@a top}

# ドキュメントのタイトルの設定

あなたのアプリケーションは、あなたが望むようにブラウザのタイトルバーを設定できますす。
このクックブックではその方法を説明します。

参照 <live-example name="set-document-title"></live-example> 。

## *&lt;title&gt;* での問題

わかりやすい方法は、次のようにHTMLの`<title>`コンポーネントのプロパティをバインドする方法です。

<code-example format=''>
  &lt;title&gt;{{This_Does_Not_Work}}&lt;/title&gt;
</code-example>

すみません、これは動作しません。
アプリケーションのルートコンポーネントは `<body>`タグ内に含まれる要素です。
HTMLの `<title>`は、ドキュメントの`<head>`の中にあり、ボディの外側にあるため、Angularのデータバインディングにはアクセスできません。

ブラウザの `document`オブジェクトを使ってタイトルを手動で設定できます。
その実装は汚く、いつかブラウザの外でアプリケーションを実行する可能性をいつの間にか害します。

<div class="alert is-helpful">

  ブラウザの外でアプリケーションを実行すると、ほぼ瞬時に表示される初回のアプリケーションレンダリング時間と検索エンジン最適化のために、
  サーバーサイドの事前レンダリングを利用できます。
  つまり、Webワーカー内から実行して、マルチスレッドによってアプリケーションの応答性を向上させることができることを意味します。
  また、デスクトップに届けるために、Electron.jsやWindows Universalの中でアプリケーションを実行できることを意味します。

</div>

## `Title`サービスの使用

幸いなことに、Angularは *ブラウザプラットフォーム* の一部として `Title`サービスを提供することで隔たりを埋めます。
その[Title](api/platform-browser/Title)サービスは、現在のHTMLドキュメントのタイトルを取得および設定するためのAPIを提供する単純なクラスです。

* `getTitle() : string`&mdash;現在のHTMLドキュメントのタイトルを取得します。
* `setTitle( newTitle : string )`&mdash;現在のHTMLドキュメントのタイトルを設定します。

`Title`サービスをルートの`AppComponent`に入れ、それを呼び出すバインド可能な`setTitle`関数を公開することができます。


<code-example path="set-document-title/src/app/app.component.ts" region="class" header="src/app/app.component.ts (class)"></code-example>

この関数を3つのアンカータグにバインドしてください、すると、ほら！

<div class="lightbox">
  <img src="generated/images/guide/set-document-title/set-title-anim.gif" alt="Set title">
</div>

これが完璧な解決策です。

<code-tabs>
  <code-pane header="src/main.ts" path="set-document-title/src/main.ts"></code-pane>
  <code-pane header="src/app/app.module.ts" path="set-document-title/src/app/app.module.ts"></code-pane>
  <code-pane header="src/app/app.component.ts" path="set-document-title/src/app/app.component.ts"></code-pane>
</code-tabs>

## `bootstrap`に`Title`サービスを提供する理由

一般的には、アプリケーション全体のサービスをルートアプリケーションコンポーネントの`AppComponent`で提供したいと思います。

このクックブックでは、ランタイムのAngular環境を設定するために予約できる場所であるブートストラップの間に`Title`サービスを登録することを勧めます。

それはまさにあなたがしていることです。
`Title`サービスはAngular *ブラウザプラットフォーム* の一部です。
もし別のプラットフォームでアプリケーションを起動するのであれば、そのプラットフォーム用の「ドキュメントタイトル」の概念を理解している別の`Title`サービスを提供するべきでしょう。
理想的には、アプリケーション自体はランタイム環境を知りませんし、気にしません。
