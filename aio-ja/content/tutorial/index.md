<h1 class="no-toc">ツアー・オブ・ヒーローズ アプリケーションとチュートリアル</h1>

<div class="callout is-helpful">
<header>入門</header>


もしあなたがAngular未経験であれば、 [**入門チュートリアル**](start) を見てください。
入門チュートリアルはこのツアー・オブ・ヒーローズと同じ主要なトピック &mdash; コンポーネント、テンプレート構文、ルーティング、サービス、HTTP経由のデータアクセス &mdash; を凝縮したフォーマットでカバーし、最新のベストプラクティスにしたがっています。

In this tutorial, you build your own app from the ground up, providing experience with the development process as well as a more thorough introduction to basic concepts.

**このツアー・オブ・ヒーローズチュートリアル** は一連のドキュメンテーション中の多くの例の概念的な基礎です。
この導入ページを読むことで、それらの例を扱うのに十分な文脈が得られます。
これら以外の例を理解するためにこのチュートリアルを行う必要はありません。 Tour of Heroesチュートリアルは、コンテキストと継続性のためにここで管理されています。

</div> 

この _ツアー・オブ・ヒーローズ_ チュートリアルはAngularの基礎への導入となります。
ローカル開発環境をセットアップし、 [Angular CLI](cli "CLI command reference") を使ってアプリケーションを開発する方法を紹介しています。

この _ツアー・オブ・ヒーローズ_ チュートリアルでは、あなたは人材派遣会社がヒーローたちを管理するためのアプリケーションを開発します。

このアプリケーションは、データ駆動型アプリケーションで期待される多くの機能を持っています。
ヒーローのリストを取得して表示し、選択したヒーローの詳細を編集し、ヒーローデータのさまざまなビュー間を遷移します。

このチュートリアルが終わるときには、あなたは次のことができるようになっています。

* 要素を表示・隠蔽する、そしてヒーローデータのリストを表示するための組み込みAngularディレクティブを使う。
* ヒーローの詳細やヒーローのリストを表示するためのAngularコンポーネントを作成する。
* 読み取り専用データのための単方向データバインディングを使用する。
* 双方向データバインディングを用いて、モデルを更新するための編集可能なフィールドを設置する。
* キー入力やクリックといったユーザーのイベントに対しコンポーネントがもつメソッドをバインドする。
* ユーザーがマスターリストからヒーローを選択し、詳細画面でそのヒーローを編集できるようにする。
* パイプによりデータを整形する。
* ヒーローを組み立てるための共有サービスを作成する。
* さまざまなビューとそれらのコンポーネント間を遷移可能にするためにルーティングを使用する。

Angularを始めるためにAngularのことを十分に学び、Angularは必要なことを何でもできるということを確信するでしょう。

<div class="callout is-helpful">
<header>解答</header>

すべてのチュートリアルステップを終えると、最終的なアプリケーションはこのような姿になります: <live-example name="toh-pt6"></live-example>

</div>


## これから何を作るか

これは、このチュートリアルがもっとも勇敢なヒーローを表示するダッシュボードから始まり、どこに誘導するか
という視覚的アイデアです。

<div class="lightbox">
  <img src='generated/images/guide/toh/heroes-dashboard-1.png' alt="Output of heroes dashboard">
</div>

ダッシュボード上の2つのリンク("Dashboard" と "Heroes")をクリックすることができ、
このダッシュボード画面とヒーローの画面を遷移します。

ダッシュボードで"Magneta"というヒーローをクリックしたら、ルーターはヒーローの名前を編集できる"Hero Details"画面を開きます。

<div class="lightbox">
  <img src='generated/images/guide/toh/hero-details-1.png' alt="Details of hero in app">
</div>

”Back"ボタンをクリックすることでダッシュボードに戻ります。
上部にあるリンクは個々のメインビューに遷移させます。
"Heroes"をクリックしたら、アプリケーションは"Heroes"のマスターリストのビューを表示します。

<div class="lightbox">
  <img src='generated/images/guide/toh/heroes-list-2.png' alt="Output of heroes list app">
</div>

別のヒーローの名前をクリックすると、リストの下にある読み取り専用の小さな詳細ビューが、新しく選択されたものを反映します。

"View Details"ボタンをクリックすることで、選択されたヒーローを編集可能な詳細ビューに移ることができます。

次の図はすべての遷移の選択肢をキャプチャしたものです。

<div class="lightbox">
  <img src='generated/images/guide/toh/nav-diagram.png' alt="View navigations">
</div>

以下がアプリケーションでユーザーがアクションを取っている様子です。

<div class="lightbox">
  <img src='generated/images/guide/toh/toh-anim.gif' alt="Tour of Heroes in Action">
</div>
