# ツアー・オブ・ヒーローズ アプリケーションとチュートリアル

<div class="callout is-helpful">

<header>入門</header>

このチュートリアルでは、独自のアプリケーションをゼロから構築し、一般的な開発プロセスの経験を提供するとともに、アプリケーション設計の基本的な概念、ツール、用語の概要を紹介します。

Angularにまったく慣れていない場合は、まず[**いますぐ試す**](start)のクイックスタートアプリケーションを試してみてください。
これは、既成の部分的に完成したプロジェクトに基づいており、StacBlitzのインタラクティブ開発環境で調査および変更でき、結果をリアルタイムで確認できます。

「試してみよう」チュートリアルでは、コンポーネント、テンプレートの構文、ルーティング、サービス、HTTPを介したデータへのアクセスなど、同じ主要なトピックを最新のベストプラクティスにしたがって要約した形式で説明しています。

</div>

この _ツアー・オブ・ヒーローズ_ のチュートリアルでは、ローカル開発環境をセットアップし、[Angular CLIツール](cli "CLI command reference")を使用してアプリケーションを開発する方法を示し、Angularの基本を紹介します。

作成した _ツアー・オブ・ヒーローズ_ アプリケーションは、人材派遣会社がヒーローの安定を管理するのに役立ちます。
アプリケーションには、データ駆動型アプリケーションで見つかると思われる多くの機能があります。
完成したアプリケーションは、ヒーローのリストを取得して表示し、選択したヒーローの詳細を編集し、ヒーローデータのさまざまなビュー間を移動します。

Angularのドキュメントで使用されている多くのサンプルで、このアプリケーションドメインの参照と拡張が見られますが、それらを理解するために、必ずしもこのチュートリアルをやり遂げる必要はありません。

このチュートリアルが終わるときには、あなたは次のことができるようになっています。

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

## これから何を作るか

これは、このチュートリアルがもっとも勇敢なヒーローを表示するダッシュボードから始まり、どこに誘導するか
という視覚的アイデアです。

<div class="lightbox">

<img alt="Output of heroes dashboard" src="generated/images/guide/toh/heroes-dashboard-1.png">

</div>

ダッシュボード上の2つのリンク("Dashboard" と "Heroes")をクリックすることができ、このダッシュボード画面とヒーローの画面を遷移します。

ダッシュボードで"Magneta"というヒーローをクリックしたら、ルーターはヒーローの名前を編集できる"Hero Details"画面を開きます。

<div class="lightbox">

<img alt="Details of hero in app" src="generated/images/guide/toh/hero-details-1.png">

</div>

”Back"ボタンをクリックすることでダッシュボードに戻ります。
上部にあるリンクは個々のメインビューに遷移させます。
"Heroes"をクリックしたら、アプリケーションは"Heroes"のマスターリストのビューを表示します。

<div class="lightbox">

<img alt="Output of heroes list app" src="generated/images/guide/toh/heroes-list-2.png">

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

@reviewed 2022-02-28
