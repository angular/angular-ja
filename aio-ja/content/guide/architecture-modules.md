# モジュールのイントロダクション

<img src="generated/images/guide/architecture/module.png" alt="モジュール" class="left">

Angularアプリケーションはモジュール式であり、Angularは _NgModules_ という独自のモジュール方式を備えています。NgModuleは、アプリケーションドメイン、ワークフロー、または密接に関連する一連の機能をまとめたコードブロックのコンテナです。コンポーネント、サービスプロバイダ、およびNgModuleに含めることで定義されたスコープを持つ他のコードファイルを含めることができます。他のNgModuleからエクスポートされた機能をインポートしたり、他のNgModuleで使用するために選択した機能をエクスポートすることができます。

すべてのAngularアプリケーションには少なくとも1つのNgModuleクラスがあり、[_rootモジュール_](guide/bootstrapping)は通常`AppModule`と呼ばれ、`app.module.ts`という名前のファイルにあります。 ルートのNgModuleを*ブートストラップする*ことでアプリを起動します。

小さなアプリケーションには1つのNgModuleしかないかもしれませんが、ほとんどのアプリケーションにはより多くの機能があります。アプリの _root_ NgModuleは、任意の深さの階層に子NgModuleを含めることができるので、その名前が付けられています。

## NgModule メタデータ

NgModuleは`@NgModule`で装飾されたクラスとして定義されています。`@NgModule`デコレータは、モジュールを記述するプロパティーを持つ単一のメタデータ・オブジェクトを取得する機能です。最も重要なプロパティは次のとおりです。

* `declarations`&mdash;このNgModuleに属する[コンポーネント](guide/architecture-components)、_ディレクティブ_、および _パイプ_

* `exports`&mdash;他のNgModuleの _コンポーネントテンプレート_ で可視で使用可能な宣言のサブセット。

* `imports`&mdash;エクスポートされたクラスが _この_ NgModuleで宣言されたコンポーネントテンプレートによって必要とされる他のモジュール。

* `providers`&mdash;このNgModuleが[サービス](guide/architecture-services)のグローバルなコレクションに貢献するサービスの作成元。それらはアプリのすべての部分でアクセス可能になります。 （コンポーネントレベルでプロバイダを指定することもでき、よく推奨されます）

* `bootstrap`&mdash; _ルートコンポーネント_ と呼ばれるメインアプリケーションビューで、他のすべてのアプリケーションビューをホストします。_ルートNgModule_ だけがこの`bootstrap`プロパティを設定する必要があります。

シンプルなルートNgModuleの定義は次のとおりです。

<code-example path="architecture/src/app/mini-app.ts" region="module" title="src/app/app.module.ts" linenums="false"></code-example>

<div class="alert is-helpful">

  `AppComponent`の`export`はエクスポートする方法を示しています。 この例では実際には必要ありません。 ルートNgModuleは、他のモジュールがルートNgModuleを _インポート_ する必要がないため、何も _エクスポート_ する必要はありません。

</div>

## NgModules とコンポーネント

NgModules provide a _compilation context_ for their components. A root NgModule always has a root component that is created during bootstrap, but any NgModule can include any number of additional components, which can be loaded through the router or created through the template. The components that belong to an NgModule share a compilation context.

<figure>

<img src="generated/images/guide/architecture/compilation-context.png" alt="Component compilation context" class="left">

</figure>

<br class="clear">

A component and its template together define a _view_. A component can contain a _view hierarchy_, which allows you to define arbitrarily complex areas of the screen that can be created, modified, and destroyed as a unit. A view hierarchy can mix views defined in components that belong to different NgModules. This is often the case, especially for UI libraries.

<figure>

<img src="generated/images/guide/architecture/view-hierarchy.png" alt="View hierarchy" class="left">

</figure>

<br class="clear">

When you create a component, it is associated directly with a single view, called the _host view_. The host view can be the root of a view hierarchy, which can contain _embedded views_, which are in turn the host views of other components. Those components can be in the same NgModule, or can be imported from other NgModules. Views in the tree can be nested to any depth.

<div class="alert is-helpful">
    The hierarchical structure of views is a key factor in the way Angular detects and responds to changes in the DOM and app data. 
</div>

## NgModules and JavaScript modules

The NgModule system is different from and unrelated to the JavaScript (ES2015) module system for managing collections of JavaScript objects. These are two different and _complementary_ module systems. You can use them both to write your apps.

In JavaScript each _file_ is a module and all objects defined in the file belong to that module.
The module declares some objects to be public by marking them with the `export` key word.
Other JavaScript modules use *import statements* to access public objects from other modules.

<code-example path="architecture/src/app/app.module.ts" region="imports" linenums="false"></code-example>

<code-example path="architecture/src/app/app.module.ts" region="export" linenums="false"></code-example>

<div class="alert is-helpful">
  <a href="http://exploringjs.com/es6/ch_modules.html">Learn more about the JavaScript module system on the web.</a>
</div>

## Angular libraries

<img src="generated/images/guide/architecture/library-module.png" alt="Component" class="left">

Angular ships as a collection of JavaScript modules. You can think of them as library modules. Each Angular library name begins with the `@angular` prefix. Install them with the `npm` package manager and import parts of them with JavaScript `import` statements.

<br class="clear">

For example, import Angular's `Component` decorator from the `@angular/core` library like this:

<code-example path="architecture/src/app/app.component.ts" region="import" linenums="false"></code-example>

You also import NgModules from Angular _libraries_ using JavaScript import statements. 
For example, the following code imports the `BrowserModule` NgModule from the `platform-browser` library:

<code-example path="architecture/src/app/mini-app.ts" region="import-browser-module" linenums="false"></code-example>

In the example of the simple root module above, the application module needs material from within the `BrowserModule`. To access that material, add it to the `@NgModule` metadata `imports` like this.

<code-example path="architecture/src/app/mini-app.ts" region="ngmodule-imports" linenums="false"></code-example>

In this way you're using both the Angular and JavaScript module systems _together_. Although it's easy to confuse the two systems, which share the common vocabulary of "imports" and "exports", you will become familiar with the different contexts in which they are used.

<div class="alert is-helpful">

  Learn more from the [NgModules](guide/ngmodules) page.

</div>

<hr/>
