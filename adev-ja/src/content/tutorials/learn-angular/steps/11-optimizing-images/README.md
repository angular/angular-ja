# 画像の最適化

画像は多くのアプリケーションにおいて大きな部分を占め、低い [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) スコアなど、アプリケーションのパフォーマンス問題の大きな原因となる可能性があります。

画像の最適化は複雑なトピックになる可能性がありますが、Angularは `NgOptimizedImage` ディレクティブを使用して、ほとんどの処理を代行してくれます。このアクティビティでは、`NgOptimizedImage` を使用して画像を効率的に読み込む方法について学びます。

<hr>

<docs-workflow>

<docs-step title="NgOptimizedImage ディレクティブのインポート">

`NgOptimizedImage` ディレクティブを活用するには、まず `@angular/common` ライブラリからインポートし、コンポーネントの `imports` 配列に追加します。

```ts
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  ...
})
```

</docs-step>

<docs-step title="src 属性を ngSrc に更新">

`NgOptimizedImage` ディレクティブを有効にするには、`src` 属性を `ngSrc` に置き換えます。これは、静的画像ソース（`src`）と動的画像ソース（`[src]`）の両方で適用されます。

<docs-code language="angular-ts" highlight="[[9], [13]]">
import { NgOptimizedImage } from '@angular/common';

@Component({
  template: `
    ...
    <li>
      静的画像:
      <img ngSrc="/assets/logo.svg" alt="Angular ロゴ" width="32" height="32" />
    </li>
    <li>
      動的画像:
      <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
    </li>
    ...
  `,
  imports:[NgOptimizedImage],
})
</docs-code>

</docs-step>

<docs-step title="width と height 属性を追加">

上記のコード例では、各画像に `width` と `height` の両方の属性が設定されていることに注意してください。[レイアウトシフト](https://web.dev/articles/cls) を防ぐために、`NgOptimizedImage` ディレクティブでは、各画像に両方のサイズ属性を設定する必要があります。

画像に対して静的な `height` と `width` を指定できない場合、または指定したくない場合は、[fill 属性](https://web.dev/articles/cls)を使用します。画像を「背景画像」のように動作させ、そのコンテナ要素を塗りつぶすようにできます。

```angular-html
<div class="image-container"> // コンテナ div は 'position: "relative"'
  <img ngSrc="www.example.com/image.png" fill />
</div>
```

注：`fill` 画像が正しくレンダリングされるためには、その親要素は `position: "relative"`、`position: "fixed"`、または `position: "absolute"` でスタイル設定する必要があります。

</docs-step>

<docs-step title="重要な画像を優先">

読み込みパフォーマンスの最も重要な最適化の1つは、ページの読み込み時に表示される最大の画像要素である、["LCP 要素"](https://web.dev/articles/optimize-lcp) となる可能性のある画像を優先することです。読み込み時間を最適化するには、"ヒーロー画像"や、LCP要素となる可能性のある他の画像に `priority` 属性を追加してください。

```ts
<img ngSrc="www.example.com/image.png" height="600" width="800" priority />
```

</docs-step>

<docs-step title="オプション：画像ローダーを使用する">

`NgOptimizedImage` では、[画像ローダー](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage) を指定できます。これは、ディレクティブに画像のURLをどのようにフォーマットするかを指示します。ローダーを使用すると、画像を短く、相対的なURLで定義できます。

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
]
```

最終的なURLは 'https://my.base.url/image.png' になります。
```angular-html
<img ngSrc="image.png" height="600" width="800" />
```

画像ローダーは、単に利便性のためだけでなく、`NgOptimizedImage` のすべての機能を有効化するために使用します。これらの最適化と、一般的なCDN用に組み込まれているローダーの詳細については、[こちら](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage) をご覧ください。

</docs-step>

</docs-workflow>

このディレクティブをワークフローに追加することで、画像がAngularの助けを借りてベストプラクティスを使用して読み込まれるようになりました🎉

詳細については、[NgOptimizedImageのドキュメント](guide/image-optimization) をご覧ください。素晴らしい仕事を続け、次はルーティングについて学びましょう。
