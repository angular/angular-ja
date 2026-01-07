# NgOptimizedImage の使用開始

`NgOptimizedImage` ディレクティブは、画像の読み込みにおけるパフォーマンスのベストプラクティスを簡単に採用できるようにします。

このディレクティブは、[Largest Contentful Paint (LCP)](http://web.dev/lcp) 画像の読み込みが以下の方法で優先されるようにします。

- `<img>` タグに `fetchpriority` 属性を自動的に設定する
- デフォルトで他の画像を遅延読み込みする
- ドキュメントのヘッドにプリコネクトリンクタグを自動的に生成する
- `srcset` 属性を自動的に生成する
- アプリケーションがSSRを使用している場合、[プリロードヒント](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload)を生成する

LCP画像の読み込みを最適化することに加えて、`NgOptimizedImage` は以下のようないくつかの画像のベストプラクティスを強制します。

- [画像最適化を適用するための画像CDNのURLの使用](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
- `width` と `height` を要求することでレイアウトシフトを防ぐ
- `width` または `height` が誤って設定されている場合に警告する
- 画像がレンダリング時に視覚的に歪む場合に警告する

CSSで背景画像を使用している場合は、[こちらから開始してください](#how-to-migrate-your-background-image)。

**NOTE: `NgOptimizedImage` ディレクティブはAngularバージョン15で安定版機能となりましたが、バックポートされており、バージョン13.4.0および14.3.0でも安定版機能として利用可能です。**

## はじめに {#getting-started}

<docs-workflow>
<docs-step title="`NgOptimizedImage`ディレクティブのインポート">
`NgOptimizedImage`ディレクティブを`@angular/common`からインポートします。

```ts
import {NgOptimizedImage} from '@angular/common';
```

そして、スタンドアロンコンポーネントまたはNgModuleの`imports`配列に含めます。

```ts
imports: [
  NgOptimizedImage,
  // ...
],
```

</docs-step>
<docs-step title="(オプション)ローダーの設定">
NgOptimizedImageを使用するために画像ローダーは**必須ではありません**が、画像CDNと組み合わせて使用すると、画像の自動`srcset`を含む強力なパフォーマンス機能が有効になります。

ローダーの設定に関する簡単なガイドは、このページの最後にある[画像ローダーの設定](#configuring-an-image-loader-for-ngoptimizedimage)セクションにあります。
</docs-step>
<docs-step title="ディレクティブの有効化">
`NgOptimizedImage`ディレクティブを有効にするには、画像の`src`属性を`ngSrc`に置き換えます。

```html
<img ngSrc="cat.jpg" />
```

[組み込みのサードパーティローダー](#built-in-loaders)を使用している場合は、`src`からベースURLパスを省略してください。これはローダーによって自動的に前置されます。
</docs-step>
<docs-step title="画像を`priority`としてマークする">
ページの[LCP画像](https://web.dev/lcp/#what-elements-are-considered)は、その読み込みを優先するために常に`priority`としてマークしてください。

```html
<img ngSrc="cat.jpg" width="400" height="200" priority />
```

画像を`priority`としてマークすると、以下の最適化が適用されます。

- `fetchpriority=high`を設定します（プライオリティヒントの詳細については[こちら](https://web.dev/priority-hints)を参照してください）
- `loading=eager`を設定します（ネイティブ遅延読み込みの詳細については[こちら](https://web.dev/browser-level-image-lazy-loading)を参照してください）
- [サーバーでレンダリング](guide/ssr)する場合、[プリロードリンク要素](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload)を自動的に生成します。

LCP要素が`priority`属性を持たない画像である場合、Angularは開発中に警告を表示します。ページのLCP要素は、ユーザーの画面の寸法など、さまざまな要因に基づいて変化する可能性があるため、ページには`priority`としてマークすべき複数の画像が存在する場合があります。詳細については、[CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp)を参照してください。
</docs-step>
<docs-step title="幅と高さを含める">
[画像関連のレイアウトシフト](https://web.dev/css-web-vitals/#images-and-layout-shifts)を防ぐため、NgOptimizedImageでは次のように画像の高さと幅を指定する必要があります。

```html
<img ngSrc="cat.jpg" width="400" height="200" />
```

**レスポンシブ画像**（ビューポートに対して拡大縮小するようにスタイル設定された画像）の場合、`width`および`height`属性は画像ファイルの固有のサイズである必要があります。レスポンシブ画像の場合、[`sizes`の値を設定する](#responsive-images)ことも重要です。

**固定サイズ画像**の場合、`width`および`height`属性は画像の目的のレンダリングサイズを反映する必要があります。これらの属性のアスペクト比は、常に画像の固有のアスペクト比と一致する必要があります。

NOTE: 画像のサイズが不明な場合は、以下で説明するように、親コンテナのサイズを継承するために「フィルモード」の使用を検討してください。
</docs-step>
</docs-workflow>

## `fill`モードの使用 {#using-fill-mode}

画像をコンテナ要素にフィットさせたい場合、`fill`属性を使用できます。これは、「背景画像」のような動作を実現したい場合にしばしば役立ちます。また、画像の正確な幅と高さが不明な場合でも、既知のサイズを持つ親コンテナに画像をフィットさせたい場合に役立ちます（下記の「object-fit」を参照）。

画像に`fill`属性を追加する場合、以下の例のように`width`と`height`を含める必要はなく、含めるべきではありません。

```html
<img ngSrc="cat.jpg" fill />
```

[object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit)CSSプロパティを使用して、画像がコンテナをどのように埋めるかを変更できます。画像を`object-fit: "contain"`でスタイル設定すると、画像はアスペクト比を維持し、要素にフィットするように「レターボックス」されます。`object-fit: "cover"`を設定すると、要素はアスペクト比を維持し、要素を完全に埋めますが、一部のコンテンツは「切り取られる」場合があります。

上記の視覚的な例は、[MDN object-fitドキュメント](https://developer.mozilla.org/docs/Web/CSS/object-fit)を参照してください。

[object-positionプロパティ](https://developer.mozilla.org/docs/Web/CSS/object-position)を使用して画像をスタイル設定し、コンテナ要素内での位置を調整できます。

IMPORTANT:「fill」画像が適切にレンダリングされるには、その親要素は`position: "relative"`、`position: "fixed"`、または`position: "absolute"`でスタイル設定されている**必要があります**。

## 背景画像の移行方法 {#how-to-migrate-your-background-image}

`background-image`から`NgOptimizedImage`へ移行するための簡単なステップバイステッププロセスです。これらのステップでは、画像背景を持つ要素を「コンテナ要素」と呼びます。

1. コンテナ要素から`background-image`スタイルを削除します。
2. コンテナ要素が`position: "relative"`、`position: "fixed"`、または`position: "absolute"`を持つことを確認します。
3. コンテナ要素の子として新しい画像要素を作成し、`ngSrc`を使用して`NgOptimizedImage`ディレクティブを有効にします。
4. その要素に`fill`属性を付与します。`height`と`width`を含めないでください。
5. この画像が[LCP要素](https://web.dev/lcp/)である可能性があると考える場合は、画像要素に`priority`属性を追加します。

背景画像がコンテナをどのように埋めるかは、[フィルモードの使用](#using-fill-mode)セクションで説明されているように調整できます。

## プレースホルダーの使用 {#using-placeholders}

### 自動プレースホルダー {#automatic-placeholders}

NgOptimizedImageは、CDNまたは画像ホストが自動画像リサイズを提供している場合、画像の低解像度の自動プレースホルダーを表示できます。この機能を利用するには、画像に`placeholder`属性を追加します。

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder />
```

この属性を追加すると、指定された画像ローダーを使用して、画像の2番目の小さいバージョンが自動的にリクエストされます。この小さい画像は、画像が読み込まれる間、CSSのぼかしを伴う`background-image`スタイルとして適用されます。画像ローダーが提供されていない場合、プレースホルダー画像は生成されず、エラーがスローされます。

生成されるプレースホルダーのデフォルトサイズは幅30pxです。このサイズは、以下に示すように`IMAGE_CONFIG`プロバイダーでピクセル値を指定することで変更できます。

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
```

ぼかされたプレースホルダーの周りにシャープなエッジが必要な場合は、画像を`overflow: hidden`スタイルを持つコンテナ`<div>`でラップできます。`<div>`が画像と同じサイズである限り（例えば`width: fit-content`スタイルを使用するなど）、プレースホルダーの「ぼやけたエッジ」は非表示になります。

### データURLプレースホルダー {#data-url-placeholders}

画像ローダーなしで、base64 [データURL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)を使用してプレースホルダーを指定できます。データURLの形式は`data:image/[imagetype];[data]`で、`[imagetype]`は`png`のような画像形式、`[data]`は画像のbase64エンコーディングです。このエンコーディングはコマンドラインまたはJavaScriptで行うことができます。具体的なコマンドについては、[MDNドキュメント](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format)を参照してください。データが切り詰められたデータURLプレースホルダーの例を以下に示します。

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder="data:image/png;base64,iVBORw0K..." />
```

しかし、大きなデータURLはAngularバンドルのサイズを増やし、ページロードを遅くします。画像ローダーを使用できない場合、Angularチームはbase64プレースホルダー画像を4KB未満に保ち、重要な画像にのみ使用することを推奨しています。プレースホルダーの寸法を小さくすることに加えて、画像形式や画像を保存する際に使用するパラメーターの変更も検討してください。非常に低い解像度では、これらのパラメーターがファイルサイズに大きな影響を与える可能性があります。

### ぼかしなしプレースホルダー {#non-blurred-placeholders}

デフォルトでは、NgOptimizedImageは画像プレースホルダーにCSSのぼかし効果を適用します。ぼかしなしでプレースホルダーをレンダリングするには、`blur`プロパティをfalseに設定したオブジェクトを含む`placeholderConfig`引数を指定します。例:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder [placeholderConfig]="{blur: false}" />
```

## 画像のスタイル調整 {#adjusting-image-styling}

画像のスタイル設定によっては、`width`属性と`height`属性を追加すると画像の表示が異なる場合があります。`NgOptimizedImage`は、画像のスタイル設定によって画像が歪んだアスペクト比で表示される場合に警告します。

通常、画像のスタイルに`height: auto`または`width: auto`を追加することでこれを修正できます。詳細については、[`<img>`タグに関するweb.devの記事](https://web.dev/patterns/web-vitals-patterns/images/img-tag)を参照してください。

画像の`width`属性と`height`属性が、CSSで画像を希望どおりにサイズ調整するのを妨げている場合は、代わりに`fill`モードを使用し、画像の親要素をスタイル設定することを検討してください。

## パフォーマンス機能 {#performance-features}

NgOptimizedImageには、アプリケーションの読み込みパフォーマンスを向上させるために設計された多くの機能が含まれています。これらの機能は本セクションで説明します。

### リソースヒントの追加 {#add-resource-hints}

画像オリジンに対する[`preconnect`リソースヒント](https://web.dev/preconnect-and-dns-prefetch)は、LCP画像が可能な限り迅速に読み込まれることを保証します。

プリコネクトリンクは、[ローダー](#configuring-an-image-loader-for-ngoptimizedimage)への引数として提供されたドメインに対して自動的に生成されます。画像オリジンを自動的に識別できない場合、またはLCP画像に対してプリコネクトリンクが検出されない場合、`NgOptimizedImage`は開発中に警告を表示します。その場合、`index.html`にリソースヒントを手動で追加する必要があります。ドキュメントの`<head>`内に、以下に示すように`rel="preconnect"`を持つ`link`タグを追加します。

```html
<link rel="preconnect" href="https://my.cdn.origin" />
```

プリコネクト警告を無効にするには、`PRECONNECT_CHECK_BLOCKLIST`トークンをインジェクトします。

```ts

providers: [
{provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

```

自動プリコネクト生成に関する詳細情報は[こちら](#why-is-a-preconnect-element-not-being-generated-for-my-image-domain)を参照してください。

### 自動`srcset`による適切なサイズの画像リクエスト {#request-images-at-the-correct-size-with-automatic-srcset}

[`srcset`属性](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)を定義することで、ブラウザがユーザーのビューポートに適切なサイズの画像をリクエストするようになります。これにより、大きすぎる画像をダウンロードする時間の無駄を省きます。`NgOptimizedImage`は、画像タグの[`sizes`属性](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)の有無と値に基づいて、画像に適切な`srcset`を生成します。

#### 固定サイズの画像 {#fixed-size-images}

画像がサイズ「固定」である（つまり、[ピクセル密度](https://web.dev/codelab-density-descriptors/)を除いてデバイス間で同じサイズ）場合、`sizes`属性を設定する必要はありません。画像の`width`属性と`height`属性から、追加の入力なしで`srcset`を自動的に生成できます。

生成されるsrcsetの例:

```html
<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x" />
```

#### レスポンシブ画像 {#responsive-images}

画像がレスポンシブである（つまり、ビューポートサイズに応じて拡大縮小する）場合、`srcset`を生成するために[`sizes`属性](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)を定義する必要があります。

`sizes`を以前に使用したことがない場合、ビューポート幅に基づいて設定することから始めるのが良いでしょう。例えば、CSSによって画像がビューポート幅の100%を占める場合、`sizes`を`100vw`に設定すると、ブラウザは（ピクセル密度を考慮した上で）ビューポート幅に最も近い`srcset`内の画像を選択します。画像が画面の半分しか占めない可能性が高い場合（例: サイドバー内）、ブラウザがより小さな画像を選択するように`sizes`を`50vw`に設定します。以下同様です。

上記が目的の画像動作をカバーしない場合、[高度なsizes値](#advanced-sizes-values)に関するドキュメントを参照してください。

NOTE: `NgOptimizedImage`は、提供された`sizes`値の前に自動的に`"auto"`を付加します。これは`sizes="auto"`をサポートするブラウザでのsrcset選択の精度を高める最適化であり、サポートしないブラウザでは無視されます。

デフォルトでは、レスポンシブブレークポイントは次のとおりです:

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

これらのブレークポイントをカスタマイズしたい場合、`IMAGE_CONFIG`プロバイダーを使用して行うことができます:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
```

`srcset`属性を手動で定義したい場合、`ngSrcset`属性を使用して独自のものを指定できます:

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" />
```

`ngSrcset`属性が存在する場合、`NgOptimizedImage`は含まれるサイズに基づいて`srcset`を生成および設定します。`ngSrcset`に画像ファイル名を含めないでください。ディレクティブはこの情報を`ngSrc`から推測します。このディレクティブは、幅記述子（例: `100w`）と密度記述子（例: `1x`）の両方をサポートしています。

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw" />
```

### 自動srcset生成の無効化 {#disabling-automatic-srcset-generation}

単一の画像に対してsrcset生成を無効にするには、画像に`disableOptimizedSrcset`属性を追加できます。

```html
<img ngSrc="about.jpg" disableOptimizedSrcset />
```

### 画像の遅延読み込みの無効化 {#disabling-image-lazy-loading}

デフォルトでは、`NgOptimizedImage`は`priority`とマークされていないすべての画像に対して`loading=lazy`を設定します。優先度の低い画像に対してこの動作を無効にするには、`loading`属性を設定します。この属性は`eager`、`auto`、`lazy`の値をサポートします。詳細については、[標準の画像`loading`属性に関するドキュメントを参照してください](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading#value)。

```html
<img ngSrc="cat.jpg" width="400" height="200" loading="eager" />
```

### 画像のデコード制御 {#controlling-image-decoding}

デフォルトでは、`NgOptimizedImage`はすべての画像に対して`decoding="auto"`を設定します。これにより、ブラウザは画像が取得された後にデコードする最適なタイミングを決定できます。画像が`priority`としてマークされている場合、Angularは自動的に`decoding="sync"`を設定し、画像ができるだけ早くデコードされてペイントされるようにし、**Largest Contentful Paint(LCP)**パフォーマンスの向上に役立ちます。

`decoding`属性を明示的に設定することで、この動作をオーバーライドできます。
詳細については、[標準の画像`decoding`属性に関するドキュメントを参照してください](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding)。

```html
<!-- デフォルト: decodingは'auto' -->
<img ngSrc="gallery/landscape.jpg" width="1200" height="800" />

<!-- メインスレッドのブロックを避けるため、画像を非同期にデコードする -->
<img ngSrc="gallery/preview.jpg" width="600" height="400" decoding="async" />

<!-- Priority画像は自動的にdecoding="sync"を使用する -->
<img ngSrc="awesome.jpg" width="500" height="625" priority />

<!-- ピクセルが必要な場合は即座にデコードする（ブロックする可能性あり） -->
<img ngSrc="hero.jpg" width="1600" height="900" decoding="sync" />
```

**許可される値**

- `auto`（デフォルト）: ブラウザが最適な戦略を選択します。
- `async`: 画像を非同期にデコードし、可能な場合はメインスレッドのブロックを避けます。
- `sync`: 画像を即座にデコードします。レンダリングをブロックする可能性がありますが、画像が利用可能になり次第ピクセルが準備されることを保証します。

### 高度な'sizes'値 {#advanced-sizes-values}

異なるサイズの画面で画像を異なる幅で表示したい場合があります。このパターンの一般的な例は、モバイルデバイスでは単一の列を、より大きなデバイスでは2つの列をレンダリングするグリッドベースまたはカラムベースのレイアウトです。この動作は、以下のような「メディアクエリ」構文を使用して`sizes`属性で表現できます。

```html
<img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw" />
```

上記の例の`sizes`属性は、「この画像は幅768px未満のデバイスでは画面幅の100%になることを想定しています。それ以外の場合は、画面幅の50%になることを想定しています。」という意味です。

`sizes`属性に関する追加情報については、[web.dev](https://web.dev/learn/design/responsive-images/#sizes)または[mdn](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)を参照してください。

## NgOptimizedImageの画像ローダーを設定する {#configuring-an-image-loader-for-ngoptimizedimage}

「ローダー」とは、指定された画像ファイルに対して[画像変換URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)を生成する関数です。必要に応じて、`NgOptimizedImage`は画像のサイズ、フォーマット、画質の変換を設定します。

`NgOptimizedImage`は、変換を適用しない汎用ローダーと、様々なサードパーティ画像サービス用のローダーの両方を提供します。また、独自のカスタムローダーを作成することもサポートしています。

| ローダーの種類                         | 動作                                                                                                                                             |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 汎用ローダー                           | 汎用ローダーが返すURLは常に`src`の値と一致します。つまり、このローダーは変換を適用しません。Angularを使用して画像を配信するサイトが、このローダーの主な想定されるユースケースです。 |
| サードパーティ画像サービス用ローダー   | サードパーティ画像サービス用ローダーが返すURLは、その特定の画像サービスで使用されるAPI規約に従います。                                                |
| カスタムローダー                       | カスタムローダーの動作は、その開発者によって定義されます。`NgOptimizedImage`に事前設定されているローダーで画像サービスがサポートされていない場合は、カスタムローダーを使用する必要があります。 |

Angularアプリケーションで一般的に使用される画像サービスに基づいて、`NgOptimizedImage`は以下の画像サービスで動作するように事前設定されたローダーを提供します。

| 画像サービス              | Angular API               | ドキュメント                                                                |
| :------------------------ | :------------------------ | :-------------------------------------------------------------------------- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [ドキュメント](https://developers.cloudflare.com/images/image-resizing/)   |
| Cloudinary                | `provideCloudinaryLoader` | [ドキュメント](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit                  | `provideImageKitLoader`   | [ドキュメント](https://docs.imagekit.io/)                                  |
| Imgix                     | `provideImgixLoader`      | [ドキュメント](https://docs.imgix.com/)                                    |
| Netlify                   | `provideNetlifyLoader`    | [ドキュメント](https://docs.netlify.com/image-cdn/overview/)               |

**汎用ローダー**を使用するために、追加のコード変更は不要です。これがデフォルトの動作です。

### 組み込みローダー {#built-in-loaders}

**サードパーティ画像サービス**用の既存のローダーを使用するには、選択したサービスのプロバイダーファクトリを`providers`配列に追加します。以下の例では、Imgixローダーが使用されています。

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

画像アセットのベースURLは、プロバイダーファクトリに引数として渡す必要があります。ほとんどのサイトでは、このベースURLは以下のいずれかのパターンに一致する必要があります。

- <https://yoursite.yourcdn.com>
- <https://subdomain.yoursite.com>
- <https://subdomain.yourcdn.com/yoursite>

ベースURL構造の詳細については、対応するCDNプロバイダーのドキュメントで確認できます。

### カスタムローダー {#custom-loaders}

**カスタムローダー**を使用するには、`IMAGE_LOADER` DIトークンの値としてローダー関数を提供します。以下の例では、カスタムローダー関数は`https://example.com`で始まるURLを返し、`src`と`width`をURLパラメータとして含んでいます。

```ts
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}`;
    },
  },
],
```

`NgOptimizedImage`ディレクティブのローダー関数は、`ImageLoaderConfig`型（`@angular/common`から）のオブジェクトを引数として受け取り、画像アセットの絶対URLを返します。`ImageLoaderConfig`オブジェクトには、`src`プロパティと、オプションの`width`および`loaderParams`プロパティが含まれています。

NOTE: `width`プロパティが常に存在するとは限りませんが、`ngSrcset`が正しく機能するためには、カスタムローダーが様々な幅で画像をリクエストすることをサポートするためにこれを使用する必要があります。

### `loaderParams`プロパティ {#the-loaderparams-property}

`NgOptimizedImage`ディレクティブには、`loaderParams`と呼ばれる追加の属性があり、これはカスタムローダーの使用をサポートするために特別に設計されています。`loaderParams`属性は、任意のプロパティを持つオブジェクトを値として受け取りますが、それ自体では何も行いません。`loaderParams`内のデータは、カスタムローダーに渡される`ImageLoaderConfig`オブジェクトに追加され、ローダーの動作を制御するために使用できます。

`loaderParams`の一般的な用途は、高度な画像CDN機能を制御することです。

### カスタムローダーの例 {#example-custom-loader}

以下にカスタムローダー関数の例を示します。この例の関数は`src`と`width`を連結し、`loaderParams`を使用して角丸のためのカスタムCDN機能を制御します。

```ts
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
```

上記の例では、カスタムローダーの機能を制御するために「roundedCorners」というプロパティ名を考案したことに注意してください。この機能は、画像を生成する際に次のように使用できます。

```html
<img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}" />
```

## よくある質問 {#frequently-asked-questions}

### NgOptimizedImageは`background-image`CSSプロパティをサポートしていますか？ {#does-ngoptimizedimage-support-the-background-image-css-property}

NgOptimizedImageは`background-image`CSSプロパティを直接サポートしていませんが、別の要素の背景として画像を使用するユースケースに容易に対応できるように設計されています。

`background-image`からNgOptimizedImageへの移行の段階的なプロセスについては、上記の[背景画像の移行方法](#how-to-migrate-your-background-image)セクションを参照してください。

### NgOptimizedImageで`src`を使用できないのはなぜですか？ {#why-cant-i-use-src-with-ngoptimizedimage}

`ngSrc`属性は、ブラウザが画像を読み込む方法に関する技術的な考慮事項から、NgOptimizedImageのトリガーとして選択されました。NgOptimizedImageは`loading`属性にプログラムによる変更を加えます。ブラウザがこれらの変更が行われる前に`src`属性を認識すると、画像ファイルの積極的なダウンロードを開始し、読み込みの変更は無視されます。

### 画像ドメインのプリコネクト要素が生成されないのはなぜですか？ {#why-is-a-preconnect-element-not-being-generated-for-my-image-domain}

プリコネクトの生成は、アプリケーションの静的解析に基づいて実行されます。つまり、画像ドメインは、次の例のように、ローダーパラメーターに直接含める必要があります。

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

変数を使用してドメイン文字列をローダーに渡している場合、またはローダーを使用していない場合、静的解析はドメインを識別できず、プリコネクトリンクは生成されません。この場合、[上記で説明されている](#add-resource-hints)ように、ドキュメントのヘッドにプリコネクトリンクを手動で追加する必要があります。

### 同じページで2つの異なる画像ドメインを使用できますか？ {#can-i-use-two-different-image-domains-in-the-same-page}

[画像ローダー](#configuring-an-image-loader-for-ngoptimizedimage)プロバイダーパターンは、コンポーネント内で単一の画像CDNのみを使用するという一般的なユースケースに対して、可能な限りシンプルになるように設計されています。ただし、単一のプロバイダーを使用して複数の画像CDNを管理することは依然として非常に可能です。

これを行うには、[カスタム画像ローダー](#custom-loaders)を作成し、[`loaderParams`プロパティ](#the-loaderparams-property)を使用して、どの画像CDNを使用すべきかを指定するフラグを渡し、そのフラグに基づいて適切なローダーを呼び出すことをお勧めします。

### 優先するCDN用の新しい組み込みローダーを追加できますか？ {#can-you-add-a-new-built-in-loader-for-my-preferred-cdn}

メンテナンス上の理由から、現在Angularリポジトリで追加の組み込みローダーをサポートする予定はありません。代わりに、開発者には追加の画像ローダーをサードパーティパッケージとして公開することを推奨しています。

### これを`<picture>`タグで使用できますか？ {#can-i-use-this-with-the-picture-tag}

いいえ、しかしこれは私たちのロードマップにありますので、ご期待ください。

この機能を待っている場合は、Githubのイシューを[こちら](https://github.com/angular/angular/issues/56594)でアップボートしてください。

### Chrome DevToolsでLCP画像を見つけるにはどうすればよいですか？ {#how-do-i-find-my-lcp-image-with-chrome-devtools}

1. Chrome DevToolsのパフォーマンスタブを使用して、左上にある「プロファイリングを開始してページを再読み込み」ボタンをクリックします。これはページ更新アイコンのように見えます。

2. これにより、Angularアプリケーションのプロファイリングスナップショットがトリガーされます。

3. プロファイリング結果が利用可能になったら、タイミングセクションで「LCP」を選択します。

4. 下部のパネルに概要エントリが表示されます。「関連ノード」の行でLCP要素を見つけることができます。それをクリックすると、要素がElementsパネルに表示されます。

<img alt="Chrome DevToolsのLCP" src="assets/images/guide/image-optimization/devtools-lcp.png">

NOTE: これは、テストしているページのビューポート内のLCP要素のみを識別します。より小さな画面のLCP要素を識別するために、モバイルエミュレーションを使用することも推奨されます。
