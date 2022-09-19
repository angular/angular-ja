# NgOptimizedImageを始める

注: `NgOptimizedImage` ディレクティブは現在 [「開発者プレビュー」モード](https://angular.jp/guide/releases#developer-preview) になっています。 Angular チームはフィードバックに基づいて API を安定させ、API が完全に安定したら発表します。

`NgOptimizedImage` ディレクティブを使用すると、画像をロードするためのパフォーマンスのベストプラクティスを簡単に採用できます。

`NgOptimizedImage` ディレクティブは、[LCP](http://web.dev/lcp) 画像の読み込みが次によって優先されることを保証します:

*   `<img>` タグに `fetchpriority` 属性を自動的に設定する
*   デフォルトで他の画像を遅延読み込みする
*   ドキュメントのheadに、対応する preconnect リンクタグがあることを検証する

LCP 画像の読み込みを最適化することに加えて、`NgOptimizedImage` は多くの画像のベストプラクティスを適用します。

*   [画像 URL を使用して画像の最適化を適用](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
*   `width` と `height` の設定を必須とします
*   `width` または `height` が正しく設定されていない場合に警告します
*   レンダリング時に画像が視覚的に歪む場合に警告します

## 前提

ディレクティブをアプリケーションにインポートする必要があります。さらに、画像ローダーをセットアップする必要があります。これらの手順は、[`NgOptimizedImage` の設定](/guide/image-directive-setup) チュートリアルで説明されています。

## テンプレートでの使用

### 概要

`NgOptimizedImage` ディレクティブを有効にするには、画像の `src` 属性を `rawSrc` に置き換えます。

<code-example format="html" language="html">
  &lt;img rawSrc=”cat.jpg" width="400" height="200"&gt;
</code-example>

組み込みのサードパーティローダーは、共有ベース URL を `src` の先頭に追加します。これらのローダーのいずれか (またはこれを行う他のローダー) を使用している場合は、不要な重複を防ぐために、`src` から共有ベース URL パスを必ず省略してください。

`width` および `height` 属性も設定する必要があります。これは、[画像関連のレイアウトシフト](https://web.dev/css-web-vitals/#images-and-layout-shifts) を防ぐために行われます。`width` および `height` 属性は、画像の [固有のサイズ](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size) を反映する必要があります。開発中、`NgOptimizedImage` は、`width` および `height` 属性が正しく設定されていないことを検出すると警告します。

### 画像を `priority` としてマークする

ページの [LCP 画像](https://web.dev/lcp/#what-elements-are-considered) を常に `priority` としてマークして、読み込みを優先してください。

<code-example format="html" language="html">
  &lt;img rawSrc="cat.jpg" width="400" height="200" priority&gt;
</code-example>

画像を `priority` としてマークすると、次の最適化が適用されます。

*   `fetchpriority=high` を設定します (優先度のヒントについて詳しくは [こちら](https://web.dev/priority-hints/) を参照してください)
*   `loading=eager` を設定します (ネイティブの遅延読み込みについて詳しくは [こちら](https://web.dev/browser-level-image-lazy-loading/) をご覧ください)

LCP 要素が `priority` 属性を持たない画像である場合、Angular は開発中に警告を表示します。ページの LCP 要素は、ユーザーの画面のサイズなど、さまざまな要因によって異なります。ページには、`priority` のマークを付ける必要がある複数の画像が含まれる場合があります。詳細については、[WebVitalsのCSS](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) を参照してください。

### リソースヒントの追加

LCP 画像ができるだけ早くロードされるように、画像のオリジンに [`preconnect` リソースヒント](https://web.dev/preconnect-and-dns-prefetch/) を追加できます。リソースヒントは常にドキュメントの `<head>` に配置します。

<code-example format="html" language="html">
  &lt;link rel="preconnect" href="https://my.cdn.origin" &gt;
</code-example>

デフォルトでは、サードパーティの画像サービスにローダーを使用する場合、開発中に `NgOptimizedImage` ディレクティブは、LCP 画像を提供するオリジンの `preconnect` リソースヒントが無いことを検出すると警告を発します。

これらの警告を無効にするには、選択した画像サービスのプロバイダーファクトリーに渡される引数に `{ensurePreconnect: false}` を追加します。

<code-example format="typescript" language="typescript">
providers: [
  provideImgixLoader('https://my.base.url', {ensurePreconnect: false})
],
</code-example>

### 画像スタイリングの調整

画像のスタイルによっては、`width` 属性と `height` 属性を追加することによって、画像のレンダリング結果が変化する場合があります。`NgOptimizedImage` は、画像のスタイリングによって画像が歪んだアスペクト比でレンダリングされる場合に警告します。

これは通常、画像スタイルに `height: auto` または `width: auto` を追加することで修正できます。詳細については、[`<img>` タグに関する web.dev の記事](https://web.dev/patterns/web-vitals-patterns/images/img-tag/) を参照してください。

### `srcset` 属性の処理

`<img>` タグが `srcset` 属性を定義している場合は、それを `rawSrcset` に置き換えます。

<code-example format="html" language="html">
  &lt;img rawSrc="hero.jpg" rawSrcset="100w, 200w, 300w"&gt;
</code-example>

`rawSrcset` 属性が存在する場合、`NgOptimizedImage` は構成された画像ローダーを使用して [`srcset` 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) を生成および設定します。`rawSrcset` に画像ファイル名を含めないでください。ディレクティブはこの情報を `rawSrc` から推測します。このディレクティブは、幅記述子 (例: `100w`) と密度記述子 (例: `1x`) の両方をサポートしています。

また、標準の画像の [`sizes` 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) で `rawSrcset` を使用することもできます。

<code-example format="html" language="html">
  &lt;img rawSrc="hero.jpg" rawSrcset="100w, 200w, 300w" sizes=”50vw”&gt;
</code-example>

### 画像の遅延読み込みを無効にする

デフォルトでは、`NgOptimizedImage` は `priority` とマークされていないすべての画像に対して `loading=lazy` を設定します。`loading` 属性を設定することで、優先度の低い画像に対してこの動作を無効にすることができます。この属性は値として `eager`、`auto`、`lazy` を受け入れます。[詳細については、標準の画像の `loading` 属性のドキュメントを参照してください](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading#value)。

<code-example format="html" language="html">
  &lt;img rawSrc="cat.jpg" width="400" height="200" loading="eager"&gt;
</code-example>
