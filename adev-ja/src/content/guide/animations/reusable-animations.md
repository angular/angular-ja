# 再利用可能なアニメーション

IMPORTANT: `@angular/animations`パッケージは現在非推奨です。Angularチームは、新しく書くコードのアニメーションには`animate.enter`と`animate.leave`を使ったネイティブCSSの利用を推奨します。詳しくは、新しいenterとleaveの[アニメーションガイド](guide/animations)を参照してください。また、アプリケーションで純粋なCSSアニメーションへの移行を始める方法については、[AngularのAnimationsパッケージからの移行](guide/animations/migration)も参照してください。

このトピックでは、再利用可能なアニメーションを作成する方法の例をいくつか紹介します。

## 再利用可能なアニメーションを作成する {#create-reusable-animations}

再利用可能なアニメーションを作成するには、[`animation()`](api/animations/animation)関数を使って別の`.ts`ファイルにアニメーションを定義し、そのアニメーション定義を`const`のエクスポート変数として宣言します。
その後、[`useAnimation()`](api/animations/useAnimation)関数を使って、このアニメーションをアプリケーション内の任意のコンポーネントにインポートして再利用できます。

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-const"/>

前のコードスニペットでは、`transitionAnimation`をエクスポート変数として宣言することで再利用可能にしています。

HELPFUL: `height`、`opacity`、`backgroundColor`、`time`の入力値は実行時に置き換えられます。

アニメーションの一部もエクスポートできます。
たとえば、次のスニペットではアニメーションの`trigger`をエクスポートしています。

<docs-code header="animations.1.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="trigger-const"/>

ここから先は、再利用可能なアニメーション変数をコンポーネントクラスにインポートできます。
たとえば、次のコードスニペットでは`transitionAnimation`変数をインポートし、`useAnimation()`関数を通して使用しています。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.3.ts" region="reusable"/>

## Angularアニメーションについてさらに詳しく {#more-on-angular-animations}

以下の項目にも興味があるかもしれません：

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Angularアニメーションの概要"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="トランジションとトリガー"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="複雑なアニメーションシーケンス"/>
  <docs-pill href="guide/routing/route-transition-animations" title="ルート遷移アニメーション"/>
  <docs-pill href="guide/animations/migration" title="ネイティブCSSアニメーションへの移行"/>
</docs-pill-row>
