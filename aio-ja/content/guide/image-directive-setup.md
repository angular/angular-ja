# `NgOptimizedImage`の設定

<div class="alert is-important">

`NgOptimizedImage` ディレクティブは [開発者プレビュー](https://angular.jp/guide/releases#developer-preview) で利用可能です。
試すことはできますが、安定版となるまでに変更される可能性があります。

</div>

このチュートリアルでは、`NgOptimizedImage` の設定方法について説明します。 `NgOptimizedImage` の使用に関する情報については、[NgOptimizedImageを始める](/guide/image-directive) を参照してください。

## `NgOptimizedImage`のインポート

`@angular/common` モジュールから `NgOptimizedImage` をインポートできます。ディレクティブは [スタンドアロンディレクティブ](/guide/standalone-components) として定義されているため、コンポーネントはそれを直接インポートする必要があります。

## `ImageLoader`を構成する

「ローダー」は、特定の画像ファイルの [画像変換URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) を生成する関数です。適切に実装されている場合、`NgOptimizedImage` は画像のサイズ、フォーマット、および画質変換を設定します。

`NgOptimizedImage` は、さまざまなサードパーティの画像サービス用のローダーだけでなく、汎用ローダーも提供します。また、独自のカスタムローダーの作成もサポートしています。

| ローダータイプ| 振る舞い |
|:--- |:--- |
| 汎用ローダー | 汎用ローダーによって返される URL は、常に `src` の値と一致します。つまり、このローダーは変換を適用しません。 Angular を使用して画像を提供するサイトは、このローダーの主な使用例です。|
| サードパーティの画像サービスのローダー | サードパーティの画像サービスのローダーによって返される URL は、その特定の画像サービスで使用される API 規則に従います。 |
| カスタムローダー | カスタムローダーの動作は、その開発者によって定義されます。 `NgOptimizedImage` で事前構成されたローダーが画像サービスでサポートされていない場合は、カスタムローダーを使用する必要があります。|

Angular アプリケーションで一般的に使用される画像サービスに基づいて、`NgOptimizedImage` は、次の画像サービスで動作するように事前構成されたローダーを提供します。

| 画像サービス | Angular API | ドキュメンテーション |
|:--- |:--- |:--- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [ドキュメンテーション](https://developers.cloudflare.com/images/image-resizing/) |
| Cloudinary | `provideCloudinaryLoader` | [ドキュメンテーション](https://cloudinary.com/documentation/resizing_and_cropping) |  |
| ImageKit | `provideImageKitLoader` | [ドキュメンテーション](https://docs.imagekit.io/) |
| Imgix | `provideImgixLoader` | [ドキュメンテーション](https://docs.imgix.com/) |

`NgOptimizedImage` を使用するには、画像ローダーを構成する必要があります。

これらの手順では、`NgOptimizedImage` で使用する画像ローダーをセットアップする方法について説明します。

1. NgModule またはスタンドアロンコンポーネントの `imports` セクションに追加することで、`NgOptimizedImage` ディレクティブをアプリケーションにインポートします。

<code-example format="typescript" language="typescript">
import { NgOptimizedImage } from '@angular/common';
// 適切な NgModule に NgOptimizedImage を含めます
@NgModule({
  imports: [
    // ... その他のインポート
    NgOptimizedImage,
  ],
})

class AppModule {}
</code-example>

<code-example format="typescript" language="typescript">
@Component({
  standalone: true,
  imports: [
    // ... その他のインポート
    NgOptimizedImage,
  ],
})

class MyStandaloneComponent {}
</code-example>

2. 使用するローダーを構成します。

**汎用ローダー**を使用する場合: 追加のコード変更は必要ありません。

**サードパーティの画像サービス**に既存のローダーを使用する場合: 選択したサービスのプロバイダーファクトリーを `providers` 配列に追加します。次の例では、Imgix ローダーが使用されています。

<code-example format="typescript" language="typescript">
providers: [
  provideImgixLoader('https://my.base.url/'),
],
</code-example>

画像アセットのベース URL は、引数としてプロバイダーファクトリーに渡す必要があります。ほとんどのサイトでは、このベース URL は次のパターンのいずれかに一致する必要があります。

*   https://yoursite.yourcdn.com
*   https://subdomain.yoursite.com
*   https://subdomain.yourcdn.com/yoursite

ベース URL 構造の詳細については、対応する CDN プロバイダーのドキュメントを参照してください。

**カスタムローダー**を使用する場合: ローダー関数を `IMAGE_LOADER` DIトークンの値として指定します。次の例では、カスタムローダー関数は、URL パラメーターとして `src` と `width` を含み `https://example.com` で始まる URL を返します。

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

`NgOptimizedImage` ディレクティブのローダー関数は、引数として (`@angular/common` の) `ImageLoaderConfig` 型をもつオブジェクトを取り、画像アセットの絶対 URL を返します。 `ImageLoaderConfig` オブジェクトには、`src` および `width` プロパティが含まれています。

注: カスタムローダーは、`ngSrcset` が適切に機能するために、さまざまな幅の画像の要求をサポートする必要があります。
