# NgOptimizedImageを始める

注: `NgOptimizedImage` ディレクティブは現在 [「開発者プレビュー」モード](https://angular.jp/guide/releases#developer-preview) になっています。 Angular チームはフィードバックに基づいて API を安定させ、API が完全に安定したら発表します。

`NgOptimizedImage` ディレクティブを使用すると、画像をロードするためのパフォーマンスのベストプラクティスを簡単に採用できます。

このディレクティブは、[Largest Contentful Paint (LCP)](http://web.dev/lcp) 画像の読み込みが次によって優先されることを保証します:

*   `<img>` タグに `fetchpriority` 属性を自動的に設定する
*   デフォルトで他の画像を遅延読み込みする
*   ドキュメントのheadに、対応する preconnect リンクタグがあることを検証する
*   `srcset` 属性の自動生成
*   SSR を使用している場合、[preload hint](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)を生成する

LCP 画像の読み込みを最適化することに加えて、`NgOptimizedImage` は多くの画像のベストプラクティスを適用します。

*   [画像 CDN の URL を使用して画像の最適化を適用する](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
*   `width` と `height` を必須とすることでレイアウトのずれを防ぐ
*   `width` または `height` が正しく設定されていない場合に警告する
*   レンダリング時に画像が視覚的に歪む場合に警告する

## Getting Started

#### Step 1: Import NgOptimizedImage

<code-example format="typescript" language="typescript">

import { NgOptimizedImage } from '@angular/common'

</code-example>

The directive is defined as a [standalone directive](/guide/standalone-components), so components should import it directly.

#### Step 2: (Optional) Set up a Loader

An image loader is not **required** in order to use NgOptimizedImage, but using one with an image CDN enables powerful performance features, including automatic `srcset`s for your images.

A brief guide for setting up a loader can be found in the [Configuring an Image Loader](#configuring-an-image-loader-for-ngoptimizedimage) section at the end of this page.

#### Step 3: Enable the directive

`NgOptimizedImage` ディレクティブを有効にするには、画像の `src` 属性を `ngSrc` に置き換えます。

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg"&gt;

</code-example>

If you're using a [built-in third-party loader](#built-in-loaders), make sure to omit the base URL path from `src`, as that will be prepended automatically by the loader.

### Step 4: 画像を `priority` としてマークする

ページの [LCP 画像](https://web.dev/lcp/#what-elements-are-considered) を常に `priority` としてマークして、読み込みを優先してください。

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" priority&gt;

</code-example>

画像を `priority` としてマークすると、次の最適化が適用されます。

*   `fetchpriority=high` を設定します (優先度のヒントについて詳しくは [こちら](https://web.dev/priority-hints) を参照してください)
*   `loading=eager` を設定します (ネイティブの遅延読み込みについて詳しくは [こちら](https://web.dev/browser-level-image-lazy-loading) をご覧ください)
*   Automatically generates a [preload link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload) if [rendering on the server](/guide/universal).

Angular displays a warning during development if the LCP element is an image that does not have the `priority` attribute. A page’s LCP element can vary based on a number of factors - such as the dimensions of a user's screen, so a page may have multiple images that should be marked `priority`. See [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) for more details.

#### Step 5: Include Height and Width

In order to prevent [image-related layout shifts](https://web.dev/css-web-vitals/#images-and-layout-shifts), NgOptimizedImage requires that you specify a height and width for your image, as follows:

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200"&gt;

</code-example>

For **responsive images** (images which you've styled to grow and shrink relative to the viewport), the `width` and `height` attributes should be the instrinsic size of the image file.

For **fixed size images**, the `width` and `height` attributes should reflect the desired rendered size of the image. The aspect ratio of these attributes should always match the intrinsic aspect ratio of the image.

Note: If you don't know the size of your images, consider using "fill mode" to inherit the size of the parent container, as described below:

### Using `fill` mode

In cases where you want to have an image fill a containing element, you can use the `fill` attribute. This is often useful when you want to achieve a "background image" behavior. It can also be helpful when you don't know the exact width and height of your image, but you do have a parent container with a known size that you'd like to fit your image into (see "object-fit" below).

When you add the `fill` attribute to your image, you do not need and should not include a `width` and `height`, as in this example:

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" fill&gt;

</code-example>

You can use the [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property to change how the image will fill its container. If you style your image with `object-fit: "contain"`, the image will maintain its aspect ratio and be "letterboxed" to fit the element. If you set `object-fit: "cover"`, the element will retain its aspect ratio, fully fill the element, and some content may be "cropped" off. 

See visual examples of the above at the [MDN object-fit documentation.](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)

You can also style your image with the [object-position property](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) to adjust its position within its containing element.

**Important note:** For the "fill" image to render properly, its parent element **must** be styled with `position: "relative"`, `position: "fixed"`, or `position: "absolute"`. 

### Adjusting image styling

Depending on the image's styling, adding `width` and `height` attributes may cause the image to render differently. `NgOptimizedImage` warns you if your image styling renders the image at a distorted aspect ratio.

You can typically fix this by adding `height: auto` or `width: auto` to your image styles. For more information, see the [web.dev article on the `<img>` tag](https://web.dev/patterns/web-vitals-patterns/images/img-tag).

If the `height` and `width` attribute on the image are preventing you from sizing the image the way you want with CSS, consider using "fill" mode instead, and styling the image's parent element.

## Performance Features

NgOptimizedImage includes a number of features designed to improve loading performance in your app. These features are described in this section.

### リソースヒントの追加

LCP 画像ができるだけ早くロードされるように、画像のオリジンに [`preconnect` リソースヒント](https://web.dev/preconnect-and-dns-prefetch) を追加できます。リソースヒントは常にドキュメントの `<head>` に配置します。

<code-example format="html" language="html">

&lt;link rel="preconnect" href="https://my.cdn.origin" /&gt;

</code-example>

デフォルトでは、サードパーティの画像サービスにローダーを使用する場合、開発中に `NgOptimizedImage` ディレクティブは、LCP 画像を提供するオリジンの `preconnect` リソースヒントが無いことを検出すると警告を発します。

To disable these warnings, inject the `PRECONNECT_CHECK_BLOCKLIST` token:
<code-example format="typescript" language="typescript">

providers: [
  {provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

</code-example>

### Request images at the correct size with automatic `srcset`

Defining a [`srcset` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) ensures that the browser requests an image at the right size for your user's viewport, so it doesn't waste time downloading an image that's too large. `NgOptimizedImage` generates an appropriate `srcset` for the image, based on the presence and value of the [`sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) on the image tag.

#### Fixed-size images

If your image should be "fixed" in size  (i.e. the same size across devices, except for [pixel density](https://web.dev/codelab-density-descriptors/)), there is no need to set a `sizes` attribute. A `srcset` can be generated automatically from the image's width and height attributes with no further input required. 

Example srcset generated: `<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x">`

#### Responsive images

If your image should be responsive (i.e. grow and shrink according to viewport size), then you will need to define a [`sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) to generate the `srcset`.

If you haven't used `sizes` before, a good place to start is to set it based on viewport width. For example, if your CSS causes the image to fill 100% of viewport width, set `sizes` to `100vw` and the browser will select the image in the `srcset` that is closest to the viewport width (after accounting for pixel density). If your image is only likely to take up half the screen (ex: in a sidebar), set `sizes` to `50vw` to ensure the browser selects a smaller image. And so on.

If you find that the above does not cover your desired image behavior, see the documentation on [advanced sizes values](#advanced-sizes-values).

By default, the responsive breakpoints are:

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

If you would like to customize these breakpoints, you can do so using the `IMAGE_CONFIG` provider:

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
</code-example>

If you would like to manually define a `srcset` attribute, you can provide your own using the `ngSrcset` attribute:

<code-example format="html" language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w"&gt;

</code-example>

If the `ngSrcset` attribute is present, `NgOptimizedImage` generates and sets the `srcset` based on the sizes included. Do not include image file names in `ngSrcset` - the directive infers this information from `ngSrc`. The directive supports both width descriptors (e.g. `100w`) and density descriptors (e.g. `1x`).

<code-example format="html" language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw"&gt;

</code-example>

### Disabling automatic srcset generation

To disable srcset generation for a single image, you can add the `disableOptimizedSrcset` attribute on the image:

<code-example format="html" language="html">

&lt;img ngSrc="about.jpg" disableOptimizedSrcset&gt;

</code-example>

### 画像の遅延読み込みを無効にする

デフォルトでは、`NgOptimizedImage` は `priority` とマークされていないすべての画像に対して `loading=lazy` を設定します。`loading` 属性を設定することで、優先度の低い画像に対してこの動作を無効にすることができます。この属性は値として `eager`、`auto`、`lazy` を受け入れます。[詳細については、標準の画像の `loading` 属性のドキュメントを参照してください](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading#value)。

<code-example format="html" language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" loading="eager"&gt;

</code-example>

### Advanced 'sizes' values

You may want to have images displayed at varying widths on differently-sized screens. A common example of this pattern is a grid- or column-based layout that renders a single column on mobile devices, and two columns on larger devices. You can capture this behavior in the `sizes` attribute, using a "media query" syntax, such as the following:

<code-example format="html" language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw"&gt;

</code-example>

The `sizes` attribute in the above example says "I expect this image to be 100 percent of the screen width on devices under 768px wide. Otherwise, I expect it to be 50 percent of the screen width.

For additional information about the `sizes` attribute, see [web.dev](https://web.dev/learn/design/responsive-images/#sizes) or [mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes).

## Configuring an image loader for `NgOptimizedImage`

A "loader" is a function that generates an [image transformation URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) for a given image file. When appropriate, `NgOptimizedImage` sets the size, format, and image quality transformations for an image.

`NgOptimizedImage` provides both a generic loader that applies no transformations, as well as loaders for various third-party image services. It also supports writing your own custom loader.

| Loader type| Behavior |
|:--- |:--- |
| Generic loader | The URL returned by the generic loader will always match the value of `src`. In other words, this loader applies no transformations. Sites that use Angular to serve images are the primary intended use case for this loader.|
| Loaders for third-party image services | The URL returned by the loaders for third-party image services will follow API conventions used by that particular image service. |
| Custom loaders | A custom loader's behavior is defined by its developer. You should use a custom loader if your image service isn't supported by the loaders that come preconfigured with `NgOptimizedImage`.|

Based on the image services commonly used with Angular applications, `NgOptimizedImage` provides loaders preconfigured to work with the following image services:

| Image Service | Angular API | Documentation |
|:--- |:--- |:--- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [Documentation](https://developers.cloudflare.com/images/image-resizing/) |
| Cloudinary | `provideCloudinaryLoader` | [Documentation](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit | `provideImageKitLoader` | [Documentation](https://docs.imagekit.io/) |
| Imgix | `provideImgixLoader` | [Documentation](https://docs.imgix.com/) |

To use the **generic loader** no additional code changes are necessary. This is the default behavior.

### Built-in Loaders

To use an existing loader for a **third-party image service**, add the provider factory for your chosen service to the `providers` array. In the example below, the Imgix loader is used:

<code-example format="typescript" language="typescript">
providers: [
  provideImgixLoader('https://my.base.url/'),
],
</code-example>

The base URL for your image assets should be passed to the provider factory as an argument. For most sites, this base URL should match one of the following patterns:

*   https://yoursite.yourcdn.com
*   https://subdomain.yoursite.com
*   https://subdomain.yourcdn.com/yoursite

You can learn more about the base URL structure in the docs of a corresponding CDN provider.

### Custom Loaders

To use a **custom loader**, provide your loader function as a value for the `IMAGE_LOADER` DI token. In the example below, the custom loader function returns a URL starting with `https://example.com` that includes `src` and `width` as URL parameters.

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}`;
    },
  },
],
</code-example>

A loader function for the `NgOptimizedImage` directive takes an object with the `ImageLoaderConfig` type (from `@angular/common`) as its argument and returns the absolute URL of the image asset. The `ImageLoaderConfig` object contains the `src` and `width` properties.

Note: a custom loader must support requesting images at various widths in order for `ngSrcset` to work properly.

<!-- links -->

<!-- external links -->

<!--end links -->

@reviewed 2022-11-07
