# モジュールのイントロダクション

Angularアプリケーションはモジュール型のアプリケーションで、 *NgModules* という独自のモジュール方式を備えています。
NgModuleは、アプリケーションドメイン、ワークフロー、または密接に関連する一連の機能をまとめたコードブロックのコンテナです。それは、コンポーネントと、サービスプロバイダーと、および、包含するNgModuleによってスコープが規定された他のコードファイルとを含めることができます。他のNgModuleからエクスポートされた機能をインポートしたり、他のNgModuleで使用するために選択した機能をエクスポートします。

すべてのAngularアプリケーションには少なくとも1つのNgModuleクラスがあり、[*ルートモジュール*](guide/bootstrapping)は通常`AppModule`と呼ばれ、`app.module.ts`という名前のファイルにあります。ルートのNgModuleを*ブートストラップする*ことでアプリを起動します。

小さなアプリケーションには1つのNgModuleしかないかもしれませんが、ほとんどのアプリケーションにはより多くの *フィーチャーモジュール* があります。アプリの *ルート* NgModuleは、任意の深さの階層に子NgModuleを含めることができるので、その名前が付けられています。

## NgModule メタデータ

NgModuleは`@NgModule`で装飾されたクラスとして定義されています。`@NgModule`デコレーターは、モジュールを記述するプロパティーをもつ単一のメタデータ・オブジェクトを取得する機能です。もっとも重要なプロパティは次のとおりです。

* `declarations`: このNgModuleに属する[コンポーネント](guide/architecture-components)、*ディレクティブ*、および *パイプ*

* `exports`: 他のNgModuleの *コンポーネントテンプレート* で可視で使用可能な宣言のサブセット。

* `imports`: エクスポートされたクラスが *この* NgModuleで宣言されたコンポーネントテンプレートによって必要とされる他のモジュール。

* `providers`: このNgModuleが[サービス](guide/architecture-services)のグローバルなコレクションに貢献するサービスの作成元。それらはアプリのすべての部分でアクセス可能になります。 （コンポーネントレベルでプロバイダーを指定することもでき、しばしば好まれます）

* `bootstrap`:  *ルートコンポーネント* と呼ばれるメインアプリケーションビューで、他のすべてのアプリケーションビューをホストします。*ルートNgModule* だけがこの`bootstrap`プロパティを設定する必要があります。

単純なルートNgModuleの定義は次のとおりです。

<code-example path="architecture/src/app/mini-app.ts" region="module" header="src/app/app.module.ts"></code-example>

<div class="alert is-helpful">

  ここでは説明のために`AppComponent`が`exports`プロパティに含まれています。しかしこの例では実際には必要ありません。他のモジュールはルートNgModuleを *インポート* する必要がないため、ルートNgModuleは何も *エクスポート* する必要はありません。

</div>

## NgModules とコンポーネント

NgModuleは、そのコンポーネントの *コンパイルコンテキスト* を提供します。ルートNgModuleには常にブートストラップ時に作成されるルートコンポーネントがありますが、任意のNgModuleに追加のコンポーネントをいくつでも含めることができます。これらのコンポーネントは、ルーター経由でロードするか、テンプレートから作成することができます。NgModuleに属するコンポーネントは、コンパイルコンテキストを共有します。

<figure>

<img src="generated/images/guide/architecture/compilation-context.png" alt="コンポーネントコンパイルコンテキスト" class="left">

</figure>

<br class="clear">

コンポーネントとそのテンプレートは一緒に *ビュー* を定義します。コンポーネントには、*ビュー階層* を含めることができます。これにより、画面の任意の複雑な領域を定義し、ユニットとして作成、変更、および破棄することができます。ビュー階層は、異なるNgModuleに属するコンポーネントで定義されたビューを混在させることができます。これは多くの場合、特にUIライブラリの場合に当てはまります。

<figure>

<img src="generated/images/guide/architecture/view-hierarchy.png" alt="ビュー階層" class="left">

</figure>

<br class="clear">

コンポーネントを作成すると、そのコンポーネントは *ホストビュー* という単一のビューに直接関連付けられます。ホストビューは、他のコンポーネントのホストビューである *埋め込みビュー* を含むことができるビュー階層のルートにすることができます。これらのコンポーネントは、同じNgModuleに存在することも、他のNgModuleからインポートすることもできます。 ツリー内のビューは、任意の深さにネストすることができます。

<div class="alert is-helpful">

**注意:** ビューの階層構造は、AngularがDOMおよびアプリケーションデータの変更を検出して対応する方法における重要な要素です。

</div>

## NgModules と JavaScript モジュール

NgModuleシステムは、JavaScriptオブジェクトのコレクションを管理するJavaScript（ES2015）モジュールシステムとは異なり、関連しません。これら2つは、 *相補的な* モジュールシステムです。両方を使ってアプリを書くことができます。

JavaScriptでは、各 *ファイル* はモジュールであり、ファイルに定義されているすべてのオブジェクトはそのモジュールに属します。
モジュールは、いくつかのオブジェクトを`export`キーワードでマークすることによって、それらを公開することを宣言します。
他のJavaScriptモジュールはimportステートメントを使用して、他のモジュールのパブリックオブジェクトにアクセスします。

<code-example path="architecture/src/app/app.module.ts" region="imports"></code-example>

<code-example path="architecture/src/app/app.module.ts" region="export"></code-example>

<div class="alert is-helpful">
  <a href="http://exploringjs.com/es6/ch_modules.html">ウェブ上のJavaScriptモジュールシステムの詳細をご覧ください。</a>
</div>

## Angular ライブラリ

<img src="generated/images/guide/architecture/library-module.png" alt="コンポーネント" class="left">

Angularは、JavaScriptモジュールのコレクションを読み込みます。それらをライブラリモジュールと考えることができるでしょう。Angularライブラリの各名前は、`@angular`接頭辞で始まります。それらをNodeパッケージマネージャー `npm` でインストールし、JavaScriptの`import`ステートメントでそれらの一部をインポートします。

<br class="clear">

たとえば、Angularの`Component`デコレーターを`@angular/core`ライブラリから次のようにインポートします。

<code-example path="architecture/src/app/app.component.ts" region="import"></code-example>

また、JavaScriptのimportステートメントを使用してAngular *ライブラリ* からNgModuleをインポートします。
たとえば、次のコードは `BrowserModule` NgModuleを ` platform-browser` ライブラリからインポートします。

<code-example path="architecture/src/app/mini-app.ts" region="import-browser-module"></code-example>

上の単純なルートモジュールの例では、アプリケーションモジュールは `BrowserModule`内のものを必要とします。
そのものにアクセスするには、このように`@NgModule`メタデータの`imports`に追加します。

<code-example path="architecture/src/app/mini-app.ts" region="ngmodule-imports"></code-example>

このように、AngularとJavaScriptのモジュールシステムを *共に* 使用しています。2つのシステムはいずれも"imports"と"exports"という語彙を共通して持っており混乱しやすいですが、使用するにつれてコンテキストの違いに慣れるでしょう。

<div class="alert is-helpful">

  詳細については[NgModules](guide/ngmodules)ガイドから確認してください。

</div>
