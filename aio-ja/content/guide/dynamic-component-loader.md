# 動的コンポーネントローダー

コンポーネントテンプレートは常に固定ではありません。 アプリケーションは、実行時に新しいコンポーネントをロードする必要があるかもしれません。このクックブックではコンポーネントを動的に追加する方法を説明します。

このcookbookのコードの <live-example name="dynamic-component-loader"></live-example>
を参照してください。

{@a dynamic-loading}

## 動的コンポーネント読み込み

次の例は、動的広告バナーを作成する方法を示しています。

ヒーローエージェンシーは、いくつかの異なる広告がバナーを循環する広告キャンペーンを計画しています。
新しい広告コンポーネントは、いくつかの異なるチームによって頻繁に追加されます。
このため、静的なコンポーネント構造をもつテンプレートを使用することは
現実的ではありません。

代わりに、広告バナーのテンプレート内のコンポーネントへの固定参照なしに
新しいコンポーネントを読み込む方法が必要です。

Angularにはコンポーネントを動的にロードする独自のAPIが付属しています。


{@a directive}

## アンカーディレクティブ

コンポーネントを追加する前に、アンカーポイントを定義して、
Angularにコンポーネントを挿入する場所を指定する必要があります。

広告バナーは、テンプレート内の有効な挿入ポイントをマークするために、
`AdDirective` と呼ばれるヘルパー・ディレクティブを使用します。


<code-example path="dynamic-component-loader/src/app/ad.directive.ts" header="src/app/ad.directive.ts"></code-example>



`AdDirective` は動的に追加されたコンポーネントをホストする要素の
ビューコンテナへのアクセスを得るために `ViewContainerRef` を挿入します。

`@Directive` デコレーターでは、セレクター名 `adHost` に注目してください；
これは、要素にディレクティブを適用するために使用します。
次のセクションでは、その方法について説明します。

{@a loading-components}

## コンポーネントのロード

広告バナーの実装のほとんどは `ad-banner.component.ts` です。
この例では、HTMLを `@Component` デコレーターの `template` プロパティに
テンプレート文字列として入れています。

`<ng-template>` 要素はあなたが作成したディレクティブを適用する場所です。
`AdDirective` を適用するには、セレクターを `ad.directive.ts` 、 `[adHost]` から呼び出します。
それを大括弧なしで `<ng-template>` に適用してください。
これで、Angularはコンポーネントを動的にロードする場所を認識しています。


<code-example path="dynamic-component-loader/src/app/ad-banner.component.ts" region="ad-host" header="src/app/ad-banner.component.ts (template)"></code-example>



`<ng-template>` 要素は、追加の出力を表示しないため、
動的コンポーネントに適しています。


{@a resolving-components}


## コンポーネントの解決

`ad-banner.component.ts` のメソッドを詳しく見てみましょう。

`AdBannerComponent` は `AdItem` オブジェクトの配列を入力として受け取ります。
これは最終的に `AdService` から来ます。
`AdItem` オブジェクトは、ロードするコンポーネントのタイプと、そのコンポーネントにバインドするデータを指定します。
`AdService` は、広告キャンペーンを構成する実際の広告を返します。

コンポーネントの配列を `AdBannerComponent` に渡すことで、
テンプレート内の静的要素のない広告の動的リストが可能になります。

`AdBannerComponent` は `getAds()` メソッドを使って、 
`AdItems` の配列を循環し、 `loadComponent()` を呼び出すことで3秒ごとに新しいコンポーネントを読み込みます。


<code-example path="dynamic-component-loader/src/app/ad-banner.component.ts" region="class" header="src/app/ad-banner.component.ts (excerpt)"></code-example>



`loadComponent()` メソッドは、ここで、沢山の 重要な持ち上げ(heavy lifting) を行なっています。
ステップバイステップで、それを取ります。最初に、広告を選びます。


<div class="alert is-helpful">



**どのように _loadComponent()_ ひとつの広告を選ぶのか**

`loadComponent()` メソッドは、数式を使って広告を選択します。

まず、 `currentAdIndex` を設定します。これは、現在の値+1をプラスし、
それを `AdItem` 配列の長さで割って、
新しい `currentAdIndex` 値として _remainder_　を使います。
次に、その値を使用して配列から `adItem` を選択します。


</div>



次に、このコンポーネントのインスタンスに存在する `viewContainerRef` をターゲットにします。
この特定のインスタンスがどうして分かるのでしょうか？
なぜならそれが `adHost` を指していて、 `adHost` は以前に設定した、
Angularに動的コンポーネントをどこに挿入するのかを指示するためのディレクティブだからです。

あなたが思い出しているように、 `AdDirective` はコンストラクターに `ViewContainerRef` を挿入します。
これは、ディレクティブが、動的コンポーネントをホストするために使用する要素にアクセスする方法です。

コンポーネントをテンプレートに追加するには、 `ViewContainerRef` に対して `createComponent()` を呼び出します。

`createComponent()` メソッドはロードされたコンポーネントへの参照を返します。
その参照を使用して、そのプロパティに割り当てたり、そのメソッドを呼び出したりして、コンポーネントとやり取りします。



{@a common-interface}


## _AdComponent_ インターフェース

広告バナーでは、すべてのコンポーネントが共通の `AdComponent` インターフェースを実装して、
コンポーネントにデータを渡すためのAPIを標準化します。

次の2つのサンプルコンポーネントと、参照のための `AdComponent` インターフェースがあります：


<code-tabs>

  <code-pane header="hero-job-ad.component.ts" path="dynamic-component-loader/src/app/hero-job-ad.component.ts">

  </code-pane>

  <code-pane header="hero-profile.component.ts" path="dynamic-component-loader/src/app/hero-profile.component.ts">

  </code-pane>

  <code-pane header="ad.component.ts" path="dynamic-component-loader/src/app/ad.component.ts">

  </code-pane>

</code-tabs>



{@a final-ad-baner}


## 最終的な広告バナー
 最終的な広告バナーは次のようになります。

<div class="lightbox">
  <img src="generated/images/guide/dynamic-component-loader/ads-example.gif" alt="Ads">
</div>

<live-example name="dynamic-component-loader"></live-example>を参照してください。

@reviewed 2021-09-17
