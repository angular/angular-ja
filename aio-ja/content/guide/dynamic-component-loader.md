# 動的コンポーネントローダー

コンポーネントテンプレートは常に固定ではありません。 
アプリケーションは、実行時に新しいコンポーネントをロードする必要があるかもしれません。
このクックブックではコンポーネントを動的に追加する方法を説明します。

このcookbookのコードの <live-example name="dynamic-component-loader"></live-example>を参照してください。

<a id="dynamic-loading"></a>

## 動的コンポーネント読み込み

The following example shows how to build a dynamic ad banner.

The hero agency is planning an ad campaign with several different ads cycling through the banner.
New ad components are added frequently by several different teams.
This makes it impractical to use a template with a static component structure.

Instead, you need a way to load a new component without a fixed reference to the component in the ad banner's template.

The `NgComponentOutlet` directive can be used to instantiate components and insert them into the current view. This directive allows you to provide a component class that should be rendered, as well as component inputs to be used during initialization.

<code-example header="src/app/ad-banner.component.ts" path="dynamic-component-loader/src/app/ad-banner.component.ts" region="component"></code-example>

The `AdBannerComponent` class injects the `AdService` service and requests a list of ads. 
The "current ad" index is set to `0` initially to indicate that the first ad should be displayed. 
When a user clicks the "Next" button, the index is increased by one. 
Once the index reaches the length of the ads array, the index is reset back to `0`.

In the template, the `currentAd` getter is used to retrieve a current ad. 
If the value changes, Angular picks it up and reflects the changes in the UI.

## Different components from the service

Components returned from the `AdService` service and used in `NgComponentOutlet` in the `AdBannerComponent` template can be different. 
Angular detects if a component class has changed and updates the UI accordingly.

次の2つのサンプルコンポーネントと、参照のための `AdComponent` インターフェースがあります：

<code-tabs>
    <code-pane header="hero-job-ad.component.ts" path="dynamic-component-loader/src/app/hero-job-ad.component.ts"></code-pane>
    <code-pane header="hero-profile.component.ts" path="dynamic-component-loader/src/app/hero-profile.component.ts"></code-pane>
    <code-pane header="ad.service.ts" path="dynamic-component-loader/src/app/ad.service.ts"></code-pane>
</code-tabs>

<a id="final-ad-baner"></a>

## 最終的な広告バナー

最終的な広告バナーは次のようになります。

<div class="lightbox">

<img alt="Ads" src="generated/images/guide/dynamic-component-loader/ads-example.gif">

</div>

<live-example name="dynamic-component-loader"></live-example>を参照してください。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-04-18
