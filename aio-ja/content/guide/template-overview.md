# テンプレートを理解する

Angularにおいて、テンプレートはユーザーインターフェース (UI) の一部の設計図となります。テンプレートはHTMLで記述されており、テンプレート内で特別な構文を利用することで、Angularの多くの機能を利用してアプリケーションを構築することができます。

## 前提条件

テンプレート構文を学習する前に、次のことを理解しておく必要があります。

* [Angularの概念](guide/architecture)
* JavaScript
* HTML
* CSS

## HTMLの強化

Angularは、追加機能を利用してテンプレート内のHTML構文を拡張します。  
たとえば、Angularのデータバインディング構文は、ドキュメントオブジェクトモデル (DOM) プロパティを動的に設定するのに役立ちます。

ほとんどすべてのHTML構文は有効なテンプレート構文です。ただし、AngularテンプレートはUIの一部に過ぎないため、`<html>`、`<body>`や`<base>`のような要素は含まれません。

<div class="alert is-important">

スクリプトインジェクション攻撃のリスクを排除するため、Angularはテンプレート内の`<script>`要素をサポートしません。Angularは`<script>`タグを無視し、ブラウザのコンソールに警告を出力します。
詳細については、[セキュリティ](guide/security)ページを参照してください。

</div>

## テンプレート構文の詳細

次の内容にも興味があるかもしれません。

<div class="card-container">
    <a href="guide/interpolation" class="docs-card" title="補間">
        <section>補間</section>
        <p>HTML内で補間と式を利用する方法を学びます。</p>
        <p class="card-footer">補間</p>
    </a>
    <a href="guide/property-binding" class="docs-card" title="プロパティバインディング">
        <section>プロパティバインディング</section>
        <p>ターゲット要素 または ディレクティブ @Input() デコレータのプロパティを設定します。</p>
        <p class="card-footer">プロパティバインディング</p>
    </a>
    <a href="guide/attribute-binding" class="docs-card" title="属性バインディング">
        <section>属性バインディング</section>
        <p>属性の値を設定します。</p>
        <p class="card-footer">属性バインディング</p>
    </a>
    <a href="guide/class-binding" class="docs-card" title="クラスとスタイルのバインディング">
        <section>クラスとスタイルのバインディング</section>
        <p>クラスとスタイルの値を設定します。</p>
        <p class="card-footer">クラスとスタイルのバインディング</p>
    </a>
    <a href="guide/event-binding" class="docs-card" title="イベントバインディング">
        <section>イベントバインディング</section>
        <p>イベントとHTMLをリッスンします。</p>
        <p class="card-footer">イベントバインディング</p>
    </a>
    <a href="guide/template-reference-variables" class="docs-card" title="テンプレート参照変数">
        <section>テンプレート参照変数</section>
        <p>特殊変数を利用して、テンプレート内のDOM要素を参照します。</p>
        <p class="card-footer">テンプレート参照変数</p>
    </a>
    <a href="guide/built-in-directives" class="docs-card" title="組み込みディレクティブ">
        <section>組み込みディレクティブ</section>
        <p>HTMLの動作とレイアウトをリッスンし、変更します。</p>
        <p class="card-footer">組み込みディレクティブ</p>
    </a>
    <a href="guide/inputs-outputs" class="docs-card" title="入力と出力">
        <section>入力と出力</section>
        <p>親コンテキストと子ディレクティブまたはコンポーネントとの間でデータを共有します。</p>
        <p class="card-footer">入力と出力</p>
    </a>
</div>

@reviewed 2022-05-11
