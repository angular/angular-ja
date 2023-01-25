# ツアー・オブ・ヒーローズ アプリケーションとチュートリアル

<div class="callout is-helpful">

<header>入門</header>

このチュートリアルでは、あなた自身のAngularアプリケーションを最初から構築します。
これは、Angularアプリケーション設計のコンセプト、ツール、および用語を学びながら、典型的な開発プロセスを経験するよい方法です。

Angularがはじめての方は、まず[**試してみよう**]（スタート）のクイックスタート・アプリケーションを試してみてください。
**試してみよう** は、既製の部分的に完成したプロジェクトをベースにしています。
StackBlitzでアプリケーションを編集し、その結果をリアルタイムで確認することができます。

**試してみよう**では、コンポーネント、テンプレート構文、ルーティング、サービス、HTTPによるデータアクセスなどの主要なトピックを網羅し、ベストプラクティスに沿って凝縮しています。

</div>

この *Tour of Heroes* チュートリアルでは、Angularの基本を紹介し、次の方法を説明します。

* Angularのローカル開発環境を構築する
* [Angular CLI](cli "CLIコマンドリファレンス")を使用してアプリケーションを開発する

作成した _ツアー・オブ・ヒーローズ_ アプリケーションは、人材派遣会社がヒーローの安定を管理するのに役立ちます。
アプリケーションには、データ駆動型アプリケーションで見つかると思われる多くの機能があります。

完成したアプリケーションは次のことができます:

* ヒーローのリストを取得する
* リスト内のヒーローを表示する
* 選択したヒーローの詳細を編集する
* ヒーローのデータの異なるビュー間を移動する

このチュートリアルでは、Angularで必要なことを何でもできるという確信を得ることができるよう、その方法を紹介します。

* 要素を表示・隠蔽する、そしてヒーローデータのリストを表示するための組み込みAngular[ディレクティブ](guide/glossary#directive "Directives definition")を使う。
* ヒーローの詳細やヒーローのリストを表示するためのAngular[コンポーネント](guide/glossary#component "Components definition")を作成する。
* 読み取り専用データのための単方向[データバインディング](guide/glossary#data-binding "Data binding definition")を使用する。
* 双方向データバインディングを用いて、モデルを更新するための編集可能なフィールドを設置する。
* キー入力やクリックといったユーザーのイベントに対しコンポーネントがもつメソッドをバインドする。
* ユーザーがマスターリストからヒーローを選択し、詳細画面でそのヒーローを編集できるようにする。
* [パイプ](guide/glossary#pipe "Pipe definition")によりデータを整形する。
* ヒーローを組み立てるための共有[サービス](guide/glossary#service "Service definition")を作成する。
* さまざまなビューとそれらのコンポーネント間を遷移可能にするために[ルーティング](guide/glossary#router "Router definition")を使用する。

Angularを始めるためにAngularのことを十分に学び、Angularは必要なことを何でもできるということを確信するでしょう。

<div class="callout is-helpful">

<header>解答</header>

すべてのチュートリアルステップを終えると、最終的なアプリケーションはこのような姿になります: 
<live-example name="toh-pt6"></live-example>

</div>

## Design your new application

これは、このチュートリアルがもっとも勇敢なヒーローを表示するダッシュボードから始まり、どこに誘導するか
という視覚的アイデアです。

<div class="lightbox">

<img alt="Output of heroes dashboard" src="generated/images/guide/toh/heroes-dashboard-1.png">

</div>

You can click the **Dashboard** and **Heroes** links in the dashboard to navigate between the views.

ダッシュボードで"Magneta"というヒーローをクリックしたら、ルーターはヒーローの名前を編集できる"Hero Details"画面を開きます。

<div class="lightbox">

<img alt="Details of hero in application" src="generated/images/guide/toh/hero-details-1.png">

</div>

”Back"ボタンをクリックすることでダッシュボードに戻ります。
上部にあるリンクは個々のメインビューに遷移させます。
"Heroes"をクリックしたら、アプリケーションは"Heroes"のリストのビューを表示します。

<div class="lightbox">

<img alt="Output of heroes list application" src="generated/images/guide/toh/heroes-list-2.png">

</div>

別のヒーローの名前をクリックすると、リストの下にある読み取り専用の小さな詳細ビューが、新しく選択されたものを反映します。

"View Details"ボタンをクリックすることで、選択されたヒーローを編集可能な詳細ビューに移ることができます。

次の図はすべての遷移の選択肢をキャプチャしたものです。

<div class="lightbox">

<img alt="View navigations" src="generated/images/guide/toh/nav-diagram.png">

</div>

以下がアプリケーションでユーザーがアクションを取っている様子です。

<div class="lightbox">

<img alt="Tour of Heroes in Action" src="generated/images/guide/toh/toh-anim.gif">

</div>

@reviewed 2022-05-16
