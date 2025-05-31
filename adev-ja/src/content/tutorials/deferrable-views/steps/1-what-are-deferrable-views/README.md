# 遅延可能ビューとは？

完全にレンダリングされたAngularページには、多くの異なるコンポーネント、ディレクティブ、パイプが含まれている場合があります。ページの特定の部分はユーザーにすぐに表示する必要がありますが、後で表示されるまで待つことができる部分もあります。
Angularの*遅延可能ビュー*は`@defer`構文を使用して、すぐに表示する必要のないページの部分のJavaScriptのダウンロードをAngularに待たせることで、アプリケーションの高速化に役立ちます。

このアクティビティでは、遅延可能ビューを使用してコンポーネントテンプレートのセクションのロードを遅延させる方法を学習します。

<hr>

<docs-workflow>

<docs-step title="`@defer`ブロックをテンプレートの一部分に追加する。">
`app.ts`で、`@defer`ブロックで`article-comments`コンポーネントをラップして、ロードを遅延させます。

<docs-code language="angular-html">
@defer {
  <article-comments />
}
</docs-code>

デフォルトでは、`@defer`はブラウザがアイドル状態のときに`article-comments`コンポーネントをロードします。

ブラウザの開発者コンソールで、`article-comments-component`の遅延チャンクファイルが個別にロードされていることがわかります（ファイル名は実行ごとに変わる可能性があります）。

<docs-code language="markdown">
Initial chunk files | Names                      |  Raw size
chunk-NNSQHFIE.js   | -                          | 769.00 kB | 
main.js             | main                       | 229.25 kB | 

Lazy chunk files    | Names                      |  Raw size
chunk-T5UYXUSI.js   | article-comments-component |   1.84 kB |
</docs-code>

</docs-step>
</docs-workflow>


よくできました！あなたは遅延可能ビューの基本を学びました。
