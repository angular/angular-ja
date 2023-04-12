# Angular ルーティング

シングルページアプリケーションでは、サーバーにアクセスして新しいページを取得するのではなく、特定のコンポーネントに対応した画面の一部を出したり消したりして、ユーザーへの表示を切り替えます。
ユーザーがアプリケーションのタスクを実行すると、定義したさまざまな[ビュー](guide/glossary#view "Definition of view") の間を移動する必要があります。

ある[ビュー](guide/glossary#view)から次のビューへの移動を処理するために、Angularの**`Router`**を使用します。
**`Router`**は、ブラウザのURLをビューを変更する命令として解釈することでナビゲーションします。

ルーターの主な機能を紹介するサンプルアプリケーションは、<live-example name="router"></live-example> を参照してください。

## 前提知識

ルートを作成する前に、次のことをよく理解しておく必要があります:

*   [コンポーネントの基本](guide/architecture-components)
*   [テンプレートの基本](guide/glossary#template)
*   Angularアプリケーション（基本的なAngularアプリケーションは[Angular CLI](cli)を使って生成できます。）

## Angularのルーティングを学ぶ

<div class="card-container">
  <a href="guide/router" class="docs-card" title="Common routing tasks">
    <section>一般的なルーティングのタスク</section>
    <p>Angularルーティングに関連する一般的なタスクの多くを実装する方法を学びます。</p>
    <p class="card-footer">一般的なルーティングのタスク</p>
  </a>
  <a href="guide/router-tutorial" class="docs-card" title="Routing SPA tutorial">
    <section>シングルページアプリケーション（SPA）のルーティングチュートリアル</section>
    <p>Angularのルーティングに関連するパターンを網羅したチュートリアルです。</p>
    <p class="card-footer">ルーティングチュートリアル</p>
  </a>
  <a href="guide/router-tutorial-toh" class="docs-card" title="Routing Tour of Heroes">
    <section>Tour of Heroes のルーティングチュートリアル</section>
    <p>Tour of Heroes チュートリアルにルーティング機能を追加します。</p>
    <p class="card-footer">Tour of Heroes のルーティング</p>
  </a>
  <a href="guide/routing-with-urlmatcher" class="docs-card" title="Creating custom route matches tutorial">
    <section>カスタムのルートマッチの作成チュートリアル</section>
    <p>Angularルーティングでカスタムマッチのストラテジーパターンを使用する方法を説明するチュートリアルです。</p>
    <p class="card-footer">カスタムのルートマッチのチュートリアル</p>
  </a>
  <a href="guide/router-reference" class="docs-card" title="Router reference">
    <section>ルーターリファレンス</section>
    <p>ルーターAPIのコアとなる概念を説明します。</p>
    <p class="card-footer">ルーターリファレンス</p>
  </a>
</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
