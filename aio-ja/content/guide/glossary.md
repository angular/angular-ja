# 用語集 {@a glossary}

Angularには独自の用語があります。
ほとんどのAngular用語は、
Angularシステム内で特定の意味をもつ一般的な英単語やコンピュータ語句です。

この用語集には、
もっとも顕著な用語と、
独特なまたは予期しない定義をもつあまり馴染みのない用語をリストしています。

[A](#A) [B](#B) [C](#C) [D](#D) [E](#E) [F](#F) [G](#G) [H](#H) [I](#I)
[J](#J) [K](#K) [L](#L) [M](#M) [N](#N) [O](#O) [P](#P) [Q](#Q) [R](#R)
[S](#S) [T](#T) [U](#U) [V](#V) [W](#W) [X](#X) [Y](#Y) [Z](#Z)


{@a A}
{@a aot}


## 事前(AOT)コンパイル {@a ahead-of-time-aot-compilation}

Angularの事前(AOT)コンパイラは、
ブラウザがコードをダウンロードして実行する前のビルドフェーズ中に、
AngularのHTMLとTypeScriptコードを効率的なJavaScriptコードに変換します。
これは本番環境に最適なコンパイルモードであり、[実行時(JIT)コンパイル](#jit)と比較して、ロード時間が短縮され、パフォーマンスが向上します。

`ngc`コマンドラインツールを使用してアプリケーションをコンパイルすることで、モジュールファクトリに直接ブートストラップできるため、JavaScriptバンドルにAngularコンパイラを含める必要はありません。

{@a angular-element}

## Angular element

An Angular [component](#component) packaged as a [custom element](#custom-element).

Learn more in [Angular Elements Overview](guide/elements).

{@a annotation}

## アノテーション

クラスに関するメタデータを提供する構造。[デコレーター](#decorator)を参照しましょう。

{@a app-shell}

## app-shell

App shell is a way to render a portion of your application via a route at build time.
This gives users a meaningful first paint of your application that appears quickly because the browser can render static HTML and CSS without the need to initialize JavaScript.

Learn more in [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell).

You can use the Angular CLI to [generate](cli/generate#app-shell) an app shell.
This can improve the user experience by quickly launching a static rendered page (a skeleton common to all pages) while the browser downloads the full client version and switches to it automatically after the code loads.

See also [Service Worker and PWA](guide/service-worker-intro).
{@a architect}

## Architect

The tool that the CLI uses to perform complex tasks such as compilation and test running, according to a provided configuration.
Architect is a shell that runs a [builder](#builder) (defined in an [npm package](#npm-package)) with a given [target configuration](#target).

In the [workspace configuration file](guide/workspace-config#project-tool-configuration-options), an "architect" section provides configuration options for Architect builders.

For example, a built-in builder for linting is defined in the package `@angular-devkit/build_angular:tslint`, which uses the [TSLint](https://palantir.github.io/tslint/) tool to perform linting, with a configuration specified in a `tslint.json` file.

Use the [CLI command `ng run`](cli/run) to invoke a builder by specifying a [target configuration](#target) associated with that builder.
Integrators can add builders to enable tools and workflows to run through the Angular CLI. For example, a custom builder can replace the third-party tools used by the built-in implementations for CLI commands such as `ng build` or `ng test`.

{@a attribute-directive}


{@a attribute-directives}


## 属性ディレクティブ

[ディレクティブ](#directive)の一種。
他のHTML要素、属性、プロパティ、コンポーネントの動作をリッスンし変更できます。
これらは通常、HTML属性として表されるため、この名前が付けられています。

[属性ディレクティブ](guide/attribute-directives)でさらに学びましょう。


{@a B}

{@a binding}

## バインディング

Generally, the practice of setting a variable or property to a data value.
Within Angular, typically refers to [data binding](#data-binding),
which coordinates DOM object properties with data object properties.

Sometimes refers to a [dependency-injection](#dependency-injection) binding
between a [token](#token) and a dependency [provider](#provider).

{@a bootstrap}

## ブートストラップ

アプリやシステムを初期化して起動する方法。

Angularでは、アプリのルートNgModule(`AppModule`)には、アプリのトップレベル[コンポーネント](#component)を識別する`bootstrap`プロパティがあります。
ブートストラッププロセス中に、Angularはこれらのコンポーネントを作成してホストのWebページ`index.html`に挿入します。
同じ`index.html`で複数のアプリをブートストラップできます。各アプリには独自のコンポーネントが含まれています。

詳細は[ブートストラップ](guide/bootstrapping)で学びましょう。

{@a builder}

## ビルダ

A function that uses the [Architect](#architect) API to perform a complex process such as "build" or "test".
The builder code is defined in an [npm package](#npm-package).

For example, [BrowserBuilder](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/build_angular/src/browser) runs a [webpack](https://webpack.js.org/) build for a browser target and [KarmaBuilder](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/build_angular/src/karma) starts the Karma server and runs a webpack build for unit tests.

The [CLI command `ng run`](cli/run) invokes a builder with a specific [target configuration](#target).
The [workspace configuration](guide/workspace-config) file, `angular.json`, contains default configurations for built-in builders.

{@a C}

{@a case-conventions}
{@a dash-case}
{@a camelcase}
{@a kebab-case}

## ケースタイプ {@a case-types}

Angularは、スタイルガイドの[命名ガイドラインのセクション](guide/styleguide#02-01)で説明されるように、大文字と小文字の慣例を使用してさまざまな型の名前を区別します。 ケースタイプの概要は次のとおりです:

* camelCase : シンボル、プロパティ、メソッド、パイプの名前や、コンポーネントではないディレクティブのセレクター、定数。
標準のまたはローワーキャメルケースは、項目の最初の文字に小文字を使用します。たとえば、"selectedHero"。

* UpperCamelCase (またはPascalCase): クラス名。これはコンポーネント、インターフェース、NgModule、ディレクティブ、パイプを定義するクラスを含みます。
アッパーキャメルケースは、項目の最初の文字に大文字を使用します。たとえば、"HeroListComponent"。

* dash-case (または"kebab-case"): 説明部分でのファイル名、コンポーネントのセレクター。たとえば、"app-hero-list"。

* underscore_case (または"snake_case"): 通常、Angularでは使用しません。スネークケースは、アンダースコアで繋げた単語を使用します。
たとえば、"convert_link_mode"。

* UPPER_UNDERSCORE_CASE (またはUPPER_SNAKE_CASE、SCREAMING_SNAKE_CASE): 従来の定数(許容されますが、camelCaseが好まれます)。
アッパースネークケースは、アンダースコアで繋げたすべて大文字の単語を使用します。たとえば、"FIX_ME"。

{@a change-detection}

## 変更検知

The mechanism by which the Angular framework synchronizes the state of an application's UI with the state of the data.
The change detector checks the current state of the data model whenever it runs, and maintains it as the previous state to compare on the next iteration.

As the application logic updates component data, values that are bound to DOM properties in the view can change.
The change detector is responsible for updating the view to reflect the current data model.
Similarly, the user can interact with the UI, causing events that change the state of the data model.
These events can trigger change detection.

Using the default ("CheckAlways") change-detection strategy, the change detector goes through the [view hierarchy](#view-tree) on each VM turn to check every [data-bound property](#data-binding) in the template. In the first phase, it compares the current state of the dependent data with the previous state, and collects changes.
In the second phase, it updates the page DOM to reflect any new data values.

If you set the `OnPush` ("CheckOnce") change-detection strategy, the change detector runs only when [explicitly invoked] (api/core/ChangeDetectorRef), or when it is triggered by an `Input` reference change or event handler. This typically improves performance. For more information, see [Optimize Angular's change detection](https://web.dev/faster-angular-change-detection/).

{@a class-decorator}

## クラスデコレーター

クラス定義の直前に現れる[デコレーター](#decorator)。クラスが指定された型であることを宣言し、その型に適したメタデータを提供します。

次のデコレーターはAngularのクラス型を宣言できます:
* `@Component()`
* `@Directive()`
* `@Pipe()`
* `@Injectable()`
* `@NgModule()`


{@a class-field-decorator}

## クラスフィールドデコレーター

クラス定義においてフィールド直前の[デコレーター](#decorator)文であり、そのフィールドの型を宣言します。いくつかの例は`@Input`と`@Output`です。

{@a collection}

## コレクション

In Angular, a set of related [schematics](#schematic) collected in an [npm package](#npm-package).

{@a cli}

## コマンドラインインターフェース(CLI) {@a command-line-interface-cli}

The [Angular CLI](cli) is a command-line tool for managing the Angular development cycle. Use it to create the initial filesystem scaffolding for a [workspace](#workspace) or [project](#project), and to run [schematics](#schematic) that add and modify code for initial generic versions of various elements. The CLI supports all stages of the development cycle, including building, testing, bundling, and deployment.

* To begin using the CLI for a new project, see [Local Environment Setup](guide/setup-local "Setting up for Local Development").
* To learn more about the full capabilities of the CLI, see the [CLI command reference](cli).

See also [Schematics CLI](#schematics-cli).

{@a component}

## コンポーネント

`@Component()`[デコレーター](#decorator)の付いたクラス。その対となる[テンプレート](#template)と関連付けます。コンポーネントのクラスとテンプレートが一緒になって、[ビュー](#view)を定義します。
コンポーネントは、[ディレクティブ](#directive)の特別な型です。
`@Component()`デコレーターは、テンプレート指向の機能をもつ`@Directive()`デコレーターを継承します。

Angularのコンポーネントクラスは、[データバインディング](#data-binding)を介して、データを公開し、ビューの表示とユーザーインタラクションのロジックのほとんどを処理する役割を果たします。

コンポーネントクラスやテンプレート、ビューについて詳しくは、[Angularの概念の紹介](guide/architecture)を参照しましょう。


## 設定 {@a configuration}

See  [workspace configuration](#cli-config)

{@a content-projection}

## コンテンツ投影

A way to insert DOM content from outside a component into the component's view in a designated spot.

For more information, see [Responding to changes in content](guide/lifecycle-hooks#content-projection).

{@a custom-element}

## カスタム要素

A web platform feature, currently supported by most browsers and available in other browsers through polyfills (see [Browser support](guide/browser-support)).

The custom element feature extends HTML by allowing you to define a tag whose content is created and controlled by JavaScript code. A custom element (also called a *web component*) is recognized by a browser when it's added to the [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).

You can use the API to transform an Angular component so that it can be registered with the browser and used in any HTML that you add directly to the DOM within an Angular app. The custom element tag inserts the component's view, with change-detection and data-binding functionality, into content that would otherwise be displayed without Angular processing.

See [Angular element](#angular-element).

See also [dynamic component loading](#dynamic-components).


{@a D}

{@a data-binding}

## データバインディング

アプリがデータ値をユーザーに表示し、
ユーザーのアクション(クリック、タッチ、キーストロークなど)に応答するようにするプロセス。

データバインディングでは、HTMLウィジェットとデータソース間の関係を定義し、
フレームワークに詳細を処理させます。
データバインディングは、手動でアプリケーションデータ値をHTMLにプッシュし、
イベントリスナーを付けて、画面から変更値をプルし、
アプリケーションのデータ値を更新することの、代替手段です。

次のバインディング形式について、Angularの[テンプレート構文](guide/template-syntax)で参照しましょう:

 * [補間](guide/interpolation)
 * [プロパティバインディング](guide/property-binding)
 * [イベントバインディング](guide/event-binding)
 * [属性バインディング](guide/attribute-binding)
 * [クラスバインディング](guide/attribute-binding#class-binding)
 * [スタイルバインディング](guide/attribute-binding#style-binding)
 * [ngModelで双方向のデータバインディング](guide/built-in-directives#ngModel)

{@a declarable}

## 宣言

[NgModule](#ngmodule)の`declarations`リストに追加できるクラス型。
[コンポーネント](#component)と[ディレクティブ](#directive)、[パイプ](#pipe)を宣言できます。

次のものは宣言しないでください:
* 別のNgModuleですでに宣言されているクラス。
* 別のパッケージからインポートされたディレクティブの配列。たとえば、`@angular/forms`由来の`FORMS_DIRECTIVES`を宣言しないでください。
* NgModuleクラス。
* サービスクラス。
* Angularではないクラスとオブジェクト。たとえば文字列、数値、関数、エンティティモデル、設定、ビジネスロジック、ヘルパークラスなど。


{@a decorator}

{@a decoration}

## デコレーター | デコレーション {@a decorator--decoration}

クラスやプロパティの定義を変更する関数。デコレーター(*アノテーション*とも呼ばれます)は、実験的な(ステージ2)[JavaScript言語機能](https://github.com/wycats/javascript-decorators)です。
TypeScriptはデコレーターのサポートを追加しています。

Angularは、メタデータをクラスやプロパティに付けるデコレーターを定義して、
それらのクラスやプロパティが何を意味し、どのように機能するかを認識できるようにします。

[クラスデコレーター](#class-decorator)、[クラスフィールドデコレーター](#class-field-decorator)を参照しましょう。

{@a di}

{@a dependency-injection}

## 依存性の注入(DI) {@a dependency-injection-di}

アプリケーションのある部分(依存性)を作成して、それらを必要とするアプリケーションの他の部分に届けるための、デザインパターンとメカニズム。

Angularでは、依存性は通常サービスですが、文字列や関数などの値にすることもできます。
アプリのための[インジェクター](#injector)(ブートストラップ中に自動的に作成される)は、サービスや値について設定した[プロバイダー](#provider)を使用して、必要に応じて依存性をインスタンス化します。

[依存性の注入](guide/dependency-injection)でさらに学びましょう。

{@a di-token}

## DIトークン

[依存性の注入](#di)システムで使用するための、依存性の[プロバイダー](#provider)に関連付けられた検索トークン。

{@a differential-loading}

## differential loading

1つのアプリケーション用に2つのバンドルを作成するビルド手法。1つ目の、小さなバンドルは最新のブラウザ用です。2つ目の、より大きなバンドルを使用すると、最新のブラウザAPIすべてはサポートしていない古いブラウザ(IE11など)でアプリケーションを正しく実行できます。

詳しくは[デプロイメント](guide/deployment#differential-loading)のガイドを参照してください。


{@a directive}
{@a directives}

## ディレクティブ

1つのクラスです。DOMの構造を変更したり、DOMにおける属性とコンポーネントデータモデルを変更したりできます。ディレクティブのクラス定義の直前には、メタデータを提供する`@Directive()`[デコレーター](#decorator)があります。

ディレクティブクラスは通常、HTML要素や属性に関連付けられており、この要素や属性は、しばしばそのディレクティブ自身を指し示します。AngularはHTML[テンプレート](#template)でディレクティブを見つけると、一致するディレクティブクラスのインスタンスを作成し、ブラウザDOMのその部分の制御をインスタンスに渡します。

ディレクティブには3つの種類があります:
* [コンポーネント](#component)は、`@Component()`(`@Directive()`の拡張)を使用して、テンプレートをクラスに関連付けます。

* [属性ディレクティブ](#attribute-directive)は、ページ要素の動作と外観を変更します。

* [構造ディレクティブ](#structural-directive)は、DOMの構造を変更します。

Angularは、接頭語の`ng`で始まる組み込みディレクティブをいくつか提供します。
新しいディレクティブを作成して、独自の機能を実装することもできます。
*セレクター*(`<my-directive>`などのHTMLタグ)をカスタムディレクティブに関連付けることで、あなたのアプリで使用できる[テンプレート構文](guide/template-syntax)を拡張します。

`NgIf`などの**UpperCamelCase**は、ディレクティブのクラスを示します。
プロパティとディレクティブの動作を説明するときに**UpperCamelCase**を使用できます。

`ngIf`などの**lowerCamelCase**は、ディレクティブの属性名を示します。
HTMLテンプレートの要素にディレクティブを適用する方法を説明するときに、**lowerCamelCase**を使用できます。

{@a dom}

## ドメイン固有言語(DSL) {@a domain-specific-language-dsl}

A special-purpose library or API; see [Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language).
Angular extends TypeScript with domain-specific languages for a number of domains relevant to Angular apps, defined in NgModules such as [animations](guide/animations), [forms](guide/forms), and [routing and navigation](guide/router).

{@a dynamic-components}

## 動的コンポーネントロード

実行時にコンポーネントをDOMに追加するための手法。コンポーネントをコンパイルから除外し、それをDOMに追加するときに、Angularの変更検知およびイベント処理フレームワークに接続する必要があります。

同じ結果でより簡単な方法を提供する[カスタム要素](#custom-element)も参照してください。


{@a E}

{@a eager-loading}

## 即時ロード

起動時にロードされるNgModuleやコンポーネントは、
実行時にロード(遅延ロード)されるものと区別するために、即時ロードと呼ばれます。
[遅延ロード](#lazy-load)を参照してください。


{@a ecma}

## ECMAScript {@a ecmascript}

The [official JavaScript language specification](https://en.wikipedia.org/wiki/ECMAScript).

Not all browsers support the latest ECMAScript standard, but you can use a [transpiler](#transpile) (like [TypeScript](#typescript)) to write code using the latest features, which will then be transpiled to code that runs on versions that are supported by browsers.

To learn more, see [Browser Support](guide/browser-support).


{@a element}

## 要素

Angular defines an `ElementRef` class to wrap render-specific native UI elements.
In most cases, this allows you to use Angular templates and data binding to access DOM elements
without reference to the native element.

The documentation generally refers to *elements* (`ElementRef` instances), as distinct from  *DOM elements*
(which can be accessed directly if necessary).

Compare to [custom element](#custom-element).

{@a entry-point}

## エントリーポイント

A [JavaScript module](#module) that is intended to be imported by a user of [an
npm package](guide/npm-packages). An entry-point module typically re-exports
symbols from other internal modules. A package can contain multiple
entry points. For example, the `@angular/core` package has two entry-point
modules, which can be imported using the module names `@angular/core` and
`@angular/core/testing`.

{@a F}

{@a form-control}

## フォームコントロール

A instance of `FormControl`, which is a fundamental building block for Angular forms. Together with `FormGroup` and `FormArray`, tracks the value, validation, and status of a form input element.

Read more forms in the [Introduction to forms in Angular](guide/forms-overview).

{@a form-model}

## フォームモデル

The "source of truth" for the value and validation status of a form input element at a given point in time. When using [reactive forms](#reactive-forms), the form model is created explicitly in the component class. When using [template-driven forms](#template-driven-forms), the form model is implicitly created by directives.

Learn more about reactive and template-driven forms in the [Introduction to forms in Angular](guide/forms-overview).

{@a form-validation}

## フォームバリデーション

A check that runs when form values change and reports whether the given values are correct and complete, according to the defined constraints. Reactive forms apply [validator functions](guide/form-validation#adding-to-reactive-forms). Template-driven forms use [validator directives](guide/form-validation#adding-to-template-driven-forms).


To learn more, see [Form Validation](guide/form-validation).

{@a G}


{@a H}

{@a I}


{@a immutability}

## 不変性

The ability to alter the state of a value after its creation. [Reactive forms](#reactive-forms) perform immutable changes in that
each change to the data model produces a new data model rather than modifying the existing one. [Template-driven forms](#template-driven-forms) perform mutable changes with `NgModel` and [two-way data binding](#data-binding) to modify the existing data model in place.

{@a injectable}

## injectable

[依存性の注入](#di)のメカニズムを使用して依存性を提供するAngularクラスやその他の定義。injectableの[サービス](#service)クラスは、`@Injectable()`[デコレーター](#decorator)でマークする必要があります。定数値などの他のアイテムもinjectableにできます。

{@a injector}

## インジェクター

Angularの[依存性の注入](#dependency-injection)システムにおけるオブジェクトであり、
そのキャッシュ内で名前のある依存性を検索したり、
設定した[プロバイダー](#provider)を使用して依存性を作成したりできます。
インジェクターは、ブートストラッププロセスの一環としてNgModuleのために自動的に作成され、
コンポーネント階層を通じて継承されます。

* インジェクターは依存性のシングルトンのインスタンスを提供し、この同じインスタンスを複数のコンポーネントに注入できます。

* NgModuleレベルとコンポーネントレベルでのインジェクター階層は、依存性の別のインスタンスをその所属するコンポーネントと子コンポーネントへ提供できます。

* 同じ依存性の別の実装を提供できるさまざまなプロバイダーを用いてインジェクターを構成できます。

[階層的インジェクター](guide/hierarchical-dependency-injection)にて、インジェクター階層の詳細を学びましょう。

{@a input}

## Input

When defining a [directive](#directive), the `@Input()` decorator on a directive property
makes that property available as a *target* of a [property binding](guide/property-binding).
Data values flow into an input property from the data source identified
in the [template expression](#template-expression) to the right of the equal sign.

To learn more, see [input and output properties](guide/inputs-outputs).

{@a interpolation}

## 補間

A form of property [data binding](#data-binding) in which a [template expression](#template-expression) between double-curly braces renders as text.
That text can be concatenated with neighboring text before it is assigned to an element property
or displayed between element tags, as in this example.

```html
<label>My current hero is {{hero.name}}</label>
```


Read more in the [Interpolation](guide/interpolation) guide.

{@a ivy}

## Ivy

IvyはAngularの[次世代のコンパイルとパイプラインのレンダリング](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7)についてのコードネームです。
Angularリリースバージョン9では、[ビューエンジン](#ve)として知られる以前のコンパイラとランタイムの代わりに、新しいコンパイラとランタイム命令がデフォルトで使用されます。

[Angular Ivy](guide/ivy)を参照してください。


{@a J}

{@a javascript}

## JavaScript

See [ECMAScript](#ecma), [TypeScript](#typescript).


{@a jit}


## 実行時(JIT)コンパイル {@a just-in-time-jit-compilation}

Angularの実行時(JIT)コンパイラは、ブートストラップの一部として、
実行時にAngularのHTMLとTypeScriptコードを効率的なJavaScriptコードに変換します。

JITコンパイルは、Angularの`ng build`と`ng serve`CLIコマンドを実行するときのデフォルトであり(AOTコンパイルとは対照的に)、開発時のよい選択です。
JITモードは本番環境での使用は強くお勧めしません。
ブートストラップのパフォーマンスを妨げる大きなアプリケーションペイロードをもたらすためです。

[事前(AOT)コンパイル](#aot)と比較しましょう。


{@a K}


{@a L}

{@a lazy-load}

## 遅延ロード {@a lazy-loading}

アプリケーションを複数のバンドルに分割し、オンデマンドでロードすることにより、アプリケーションのロード時間を短縮するプロセス。
たとえば、依存性は必要に応じて遅延ロードできます。対照的に、[即時ロード](#eager-loading)のモジュールはルートモジュールに必要であり、それゆえ起動時にロードされます。

[ルーター](#router)は遅延ロードを利用して、親ビューがアクティブ化されている場合にのみ子ビューをロードします。
同様に、Angularアプリに必要なときにロードできるカスタム要素を構築できます。

{@a library}

## ライブラリ

In Angular, a [project](#project) that provides functionality that can be included in other Angular apps.
A library isn't a complete Angular app and can't run independently.
(To add re-usable Angular functionality to non-Angular web apps, you can use Angular [custom elements](#angular-element).)

* Library developers can use the [Angular CLI](#cli) to `generate` scaffolding for a new library in an existing [workspace](#workspace), and can publish a library as an `npm` package.

* Application developers can use the [Angular CLI](#cli) to `add` a published library for use with an application in the same [workspace](#workspace).

See also [schematic](#schematic).

{@a lifecycle-hook}

## ライフサイクルフック

An interface that allows you to tap into the lifecycle of [directives](#directive) and [components](#component) as they are created, updated, and destroyed.

Each interface has a single hook method whose name is the interface name prefixed with `ng`.
For example, the `OnInit` interface has a hook method named `ngOnInit`.

Angular calls these hook methods in the following order:

* `ngOnChanges`: When an [input](#input)/[output](#output) binding value changes.
* `ngOnInit`: After the first `ngOnChanges`.
* `ngDoCheck`: Developer's custom change detection.
* `ngAfterContentInit`: After component content initialized.
* `ngAfterContentChecked`: After every check of component content.
* `ngAfterViewInit`: After a component's views are initialized.
* `ngAfterViewChecked`: After every check of a component's views.
* `ngOnDestroy`: Just before the directive is destroyed.

To learn more, see [Lifecycle Hooks](guide/lifecycle-hooks).

{@a M}

{@a module}

## モジュール

In general, a module collects a block of code dedicated to a single purpose. Angular uses standard JavaScript modules and also defines an Angular module, `NgModule`.

In JavaScript (ECMAScript), each file is a module and all objects defined in the file belong to that module. Objects can exported, making them public, and public objects can be imported for use by other modules.

Angular ships as a collection of JavaScript modules (also called libraries). Each Angular library name begins with the `@angular` prefix. Install Angular libraries with the [npm package manager](https://docs.npmjs.com/getting-started/what-is-npm) and import parts of them with JavaScript `import` declarations.

Compare to [NgModule](#ngmodule).


{@a N}

{@a ngcc}

## ngcc

Angular compatibility compiler.
If you build your app using [Ivy](#ivy), but it depends on libraries that have not been compiled with Ivy, the CLI uses `ngcc` to automatically update the dependent libraries to use Ivy.


{@a ngmodule}

## NgModule

`@NgModule()`[デコレーター](#decorator)が前に付いたクラス定義。これはコードブロックのためのマニフェストとして宣言および機能し、アプリケーションドメインやワークフロー、密接に関連する一連の機能に専念します。

[JavaScriptのモジュール](#module)のように、NgModuleは、他のNgModuleでの使用のために機能をエクスポートでき、他のNgModuleから公開の機能をインポートできます。
NgModuleクラスのメタデータは、コンポーネント、ディレクティブ、パイプを集めます。それらを、アプリケーションがインポートとエクスポートのリストと一緒に使います。[宣言](#declarable)も参照してください。

NgModuleは通常、エクスポートされたものが定義されているファイルにちなんで名前を付けます。たとえば、Angularの[DatePipe](api/common/DatePipe)クラスは、`date_pipe.ts`ファイルで`date_pipe`という名前の機能モジュールに属しています。それらは`@angular/core`といったAngularの[スコープパッケージ](#scoped-package)からインポートします。

すべてのAngularアプリケーションにはルートモジュールがあります。慣例で、そのクラスは`AppModule`と呼ばれ`app.module.ts`という名前のファイルに存在します。

もっと学ぶには、[NgModule](guide/ngmodules)を参照してください。

{@a npm-package}

## npmパッケージ

The [npm package manager](https://docs.npmjs.com/getting-started/what-is-npm) is used to distribute and load Angular modules and libraries.

Learn more about how Angular uses [Npm Packages](guide/npm-packages).

{@a ngc}

## ngc
`ngc` is a Typescript-to-Javascript transpiler that processes Angular decorators, metadata, and templates, and emits JavaScript code.
The most recent implementation is internally referred to as `ngtsc` because it's a minimalistic wrapper around the TypeScript compiler `tsc` that adds a transform for processing Angular code.

{@a O}

{@a observable}

## observable

A producer of multiple values, which it pushes to [subscribers](#subscriber). Used for asynchronous event handling throughout Angular. You execute an observable by subscribing to it with its `subscribe()` method, passing callbacks for notifications of new values, errors, or completion.

Observables can deliver single or multiple values of any type to subscribers, either synchronously (as a function delivers a value to its caller) or on a schedule. A subscriber receives notification of new values as they are produced and notification of either normal completion or error completion.

Angular uses a third-party library called [Reactive Extensions (RxJS)](https://rxjs.dev/).

To learn more, see [Observables](guide/observables).


{@a observer}

## オブザーバー

An object passed to the `subscribe()` method for an [observable](#observable). The object defines the callbacks for the [subscriber](#subscriber).

{@a output}

## Output

When defining a [directive](#directive), the `@Output{}` decorator on a directive property
makes that property available as a *target* of [event binding](guide/event-binding).
Events stream *out* of this property to the receiver identified
in the [template expression](#template-expression) to the right of the equal sign.

To learn more, see [Input and Output Properties](guide/inputs-outputs).


{@a P}

{@a pipe}

## パイプ

A class which is preceded by the `@Pipe{}` decorator and which defines a function that transforms input values to output values for display in a [view](#view). Angular defines various pipes, and you can define new pipes.

To learn more, see [Pipes](guide/pipes).

{@a platform}

## プラットフォーム

In Angular terminology, a platform is the context in which an Angular application runs.
The most common platform for Angular applications is a web browser, but it can also be an operating system for a mobile device, or a web server.

Support for the various Angular run-time platforms is provided by the `@angular/platform-*` packages. These packages allow applications that make use of `@angular/core` and `@angular/common` to execute in different environments by providing implementation for gathering user input and rendering UIs for the given platform. Isolating platform-specific functionality allows the developer to make platform-independent use of the rest of the framework.

* When running in a web browser, [`BrowserModule`](api/platform-browser/BrowserModule) is imported from the `platform-browser` package, and supports services that simplify security and event processing, and allows applications to access browser-specific features, such as interpreting keyboard input and controlling the title of the document being displayed. All applications running in the browser use the same platform service.

* When [server-side rendering](#server-side-rendering) (SSR) is used, the [`platform-server`](api/platform-server) package provides web server implementations of the `DOM`, `XMLHttpRequest`, and other low-level features that don't rely on a browser.

{@a polyfill}

## ポリフィル

An [npm package](guide/npm-packages) that plugs gaps in a browser's JavaScript implementation.
See [Browser Support](guide/browser-support) for polyfills that support particular functionality for particular platforms.

{@a project}

## プロジェクト

In the Angular CLI, a standalone application or [library](#library) that can be created or modified by a CLI command.

A project, as generated by the [`ng new`](cli/new), contains the set of source files, resources, and configuration files that you need to develop and test the application using the CLI. Projects can also be created with the `ng generate application` and `ng generate library` commands.

For more information, see [Project File Structure](guide/file-structure).

The [`angular.json`](guide/workspace-config) file configures all projects in a [workspace](#workspace).

{@a provider}

## プロバイダー

[`Provider`](api/core/Provider)インターフェースの1つを実装するオブジェクト。プロバイダーオブジェクトは、[DIトークン](#token)に関連付けられた注入可能な依存性を取得する方法を定義します。
[インジェクター](#injector)はプロバイダーを使用して、
必要とするクラスのために依存性の新しいインスタンスを作成します。

Angularは、Angularが定義するサービスのために、すべてのインジェクターに独自のプロバイダーを登録します。
あなたは、アプリに必要なサービスのために、独自のプロバイダーを登録できます。

[サービス](#service)と[依存性の注入](#di)も参照してください。

[依存性の注入](guide/dependency-injection)でさらに学びましょう。


{@a Q}

{@a R}

{@a reactive-forms}

## リアクティブフォーム

A framework for building Angular forms through code in a component.
The alternative is a [template-driven form](#template-driven-forms).

When using reactive forms:

* The "source of truth", the form model, is defined in the component class.
* Validation is set up through validation functions rather than validation directives.
* Each control is explicitly created in the component class by creating a `FormControl` instance manually or with `FormBuilder`.
* The template input elements do *not* use `ngModel`.
* The associated Angular directives are prefixed with `form`, such as `formControl`, `formGroup`, and `formControlName`.

The alternative is a template-driven form. For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms](guide/forms-overview).

{@a resolver}

## リゾルバ

[Resolve](api/router/Resolve "APIリファレンス")インターフェース(または[resolve()メソッド](api/router/Resolve#resolve "APIリファレンス")と同じ特徴をもつ関数)を実装するクラス。要求されたルートへのナビゲーションの完了前に必要な、データを生成または取得するために、これを使用します。

リゾルバが実行するのは、ルートツリーのすべての[ルートガード](#route-guard "定義")が実行され成功したあとです。

[ガードの解決](guide/router-tutorial-toh#resolve-guard "ルーティングテクニックのチュートリアル")を使用して動的データを取得する例を参照してください。

{@a route-guard}

## ルートガード

ルーティングアプリケーションで、要求されたルートへのナビゲーションを制御するメソッド。
ガードは、ルートをアクティブ化または非アクティブ化できるかどうかと、遅延ロードのモジュールをロードできるかどうかを決定します。

詳しくは[ルーティングとナビゲーション](guide/router#preventing-unauthorized-access "Examples")のガイドで学びましょう。


{@a router}
{@a router-module}

## ルーター

Angularアプリ内の状態と[ビュー](#view)間のナビゲーションを設定および実装するツール。

`Router`モジュールは[NgModule](#ngmodule)であり、アプリケーションビューをナビゲートするために必要なサービスプロバイダーとディレクティブを提供します。[ルーティングコンポーネント](#routing-component)は`Router`モジュールをインポートするコンポーネントです。そのテンプレートには`RouterOutlet`要素が含まれており、ルーターによって生成されたビューをそこに表示できます。

ルーターはページ間のナビゲーションではなく、シングルページ上のビュー間のナビゲーションを定義します。URLのようなリンクを解釈して、どのビューを作成または破棄するか、どのコンポーネントをロードまたはアンロードするかを決定します。これにより、あなたのAngularアプリで[遅延ロード](#lazy-load)を利用できます。

詳しく学ぶには、[ルーティングとナビゲーション](guide/router)を参照してください。

{@a router-outlet}

## ルーターアウトレット

ルーティングコンポーネントのテンプレートでプレースホルダとして機能する[ディレクティブ](#directive)。Angularは、現在のルーターの状態に基づいてテンプレートを動的にレンダリングします。

{@a router-component}

## ルーティングコンポーネント {@a routing-component}

そのテンプレートに`RouterOutlet`ディレクティブをもつAngularの[コンポーネント](#component)。ルーターのナビゲーションに基づいてビューを表示します。

詳しくは、[ルーティングとナビゲーション](guide/router)を参照してください。

{@a rule}

## ルール

In [schematics](#schematic), a function that operates on a [file tree](#file-tree) to create, delete, or modify files in a specific manner.

{@a S}

{@a schematic}

## schematic

A scaffolding library that defines how to generate or transform a programming project by creating, modifying, refactoring, or moving files and code.
A schematic defines [rules](#rule) that operate on a virtual file system called a [tree](#file-tree).

The [Angular CLI](#cli) uses schematics to generate and modify [Angular projects](#project) and parts of projects.

* Angular provides a set of schematics for use with the CLI. See the [Angular CLI command reference](cli). The [`ng add`](cli/add) command runs schematics as part of adding a library to your project. The [`ng generate`](cli/generate) command runs schematics to create apps, libraries, and Angular code constructs.

* [Library](#library) developers can create schematics that enable the Angular CLI to add and update their published libraries, and to generate artifacts the library defines.
Add these schematics to the npm package that you use to publish and share your library.

For more information, see [Schematics](guide/schematics) and [Integrating Libraries with the CLI](guide/creating-libraries#integrating-with-the-cli).

{@a schematics-cli}

## Schematics CLI

Schematics come with their own command-line tool.
Using Node 6.9 or above, install the Schematics CLI globally:

<code-example language="bash">
npm install -g @angular-devkit/schematics-cli
</code-example>

This installs the `schematics` executable, which you can use to create a new schematics [collection](#collection) with an initial named schematic. The collection folder is a workspace for schematics. You can also use the `schematics` command to add a new schematic to an existing collection, or extend an existing schematic.

{@a scoped-package}

## スコープパッケージ

A way to group related [npm packages](guide/npm-packages).
NgModules are delivered within scoped packages whose names begin with the Angular *scope name* `@angular`. For example, `@angular/core`, `@angular/common`, `@angular/forms`, and `@angular/router`.

Import a scoped package in the same way that you import a normal package.

<code-example path="architecture/src/app/app.component.ts" header="architecture/src/app/app.component.ts (import)" region="import">

</code-example>

{@a server-side-rendering}

## サーバーサイドレンダリング

A technique that generates static application pages on the server, and can generate and serve those pages in response to requests from browsers.
It can also pre-generate pages as HTML files that you serve later.

This technique can improve performance on mobile and low-powered devices and improve the user experience by showing a static first page quickly while the client-side app is loading.
The static version can also make your app more visible to web crawlers.

You can easily prepare an app for server-side rendering by using the [CLI](#cli) to run the [Angular Universal](#universal) tool, using the `@nguniversal/express-engine` [schematic](#schematic).


{@a service}

## サービス

Angularにおいて、[@Injectable()](#injectable)デコレーターの付いたクラス。アプリケーション全体で再利用できる非UIロジックとコードをカプセル化するものです。
Angularは、コンポーネントとサービスを区別して、モジュール性と再利用性を向上させます。

`@Injectable()`メタデータによって、サービスクラスを[依存性の注入](#di)のメカニズムで使用できます。
injectableクラスは[プロバイダー](#provider)によってインスタンス化されます。
[インジェクター](#injector)はプロバイダーのリストを維持し、コンポーネントや他のサービスで必要なときにそれらを使用してサービスのインスタンスを提供します。

もっと学ぶには、[サービスと依存性の注入のイントロダクション](guide/architecture-services)を参照してください。

{@a structural-directive}
{@a structural-directives}

## 構造ディレクティブ

[ディレクティブ](#directive)の一種。DOMを変更してHTMLレイアウトを形成する役割です。つまり、要素とそれらの子を追加、削除、操作します。

詳しく学ぶには、[構造ディレクティブ](guide/structural-directives)を参照しましょう。

{@a subscriber}

## サブスクライバー

A function that defines how to obtain or generate values or messages to be published. This function is executed when a consumer calls the `subscribe()` method of an [observable](#observable).

The act of subscribing to an observable triggers its execution, associates callbacks with it, and creates a `Subscription` object that lets you unsubscribe.

The `subscribe()` method takes a JavaScript object (called an [observer](#observer)) with up to three callbacks, one for each type of notification that an observable can deliver:

* The `next` notification sends a value such as a number, a string, or an object.
* The `error` notification sends a JavaScript Error or exception.
* The `complete` notification doesn't send a value, but the handler is called when the call completes. Scheduled values can continue to be returned after the call completes.

{@a T}

{@a target}

## ターゲット

A buildable or runnable subset of a [project](#project), configured as an object in the [workspace configuration file](guide/workspace-config#project-tool-configuration-options), and executed by an [Architect](#architect) [builder](#builder).

In the `angular.json` file, each project has an "architect" section that contains targets which configure builders. Some of these targets correspond to [CLI commands](#cli), such as `build`, `serve`, `test`, and `lint`.

For example, the Architect builder invoked by the `ng build` command to compile a project uses a particular build tool, and has a default configuration with values that you can override on the command line. The `build` target also defines an alternate configuration for a "development" build, which you can invoke with the `--configuration development` flag on the `build` command.

The Architect tool provides a set of builders. The [`ng new` command](cli/new) provides a set of targets for the initial application project. The [`ng generate application`](cli/generate#application) and [`ng generate library`](cli/generate#library) commands provide a set of targets for each new [project](#project). These targets, their options and configurations, can be customized to meet the needs of your project. For example, you may want to add a "staging" or "testing" configuration to a project's "build" target.

You can also define a custom builder, and add a target to the project configuration that uses your custom builder. You can then run the target using the [`ng run`](cli/run) CLI command.

{@a template}

## テンプレート

Code that defines how to render a component's [view](#view).

A template combines straight HTML with Angular [data-binding](#data-binding) syntax, [directives](#directive),
and [template expressions](#template-expression) (logical constructs).
The Angular elements insert or calculate values that modify the HTML elements before the page is displayed. Learn more about Angular template language in the [Template Syntax](guide/template-syntax) guide.

A template is associated with a [component class](#component) through the `@Component()` [decorator](#decorator). The template code can be provided inline, as the value of the `template` property, or in a separate HTML file linked through the `templateUrl` property.

Additional templates, represented by `TemplateRef` objects, can define alternative or *embedded* views, which can be referenced from multiple components.

{@a template-driven-forms}

## テンプレート駆動フォーム

A format for building Angular forms using HTML forms and input elements in the view.
The alternative format uses the [reactive forms](#reactive-forms) framework.

When using template-driven forms:

* The "source of truth" is the template. The validation is defined using attributes on the individual input elements.
* [Two-way binding](#data-binding) with `ngModel` keeps the component model synchronized with the user's entry into the input elements.
* Behind the scenes, Angular creates a new control for each input element, provided you have set up a `name` attribute and two-way binding for each input.
* The associated Angular directives are prefixed with `ng` such as `ngForm`, `ngModel`, and `ngModelGroup`.

The alternative is a reactive form. For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms](guide/forms-overview).

{@a template-expression}

## テンプレート式

A TypeScript-like syntax that Angular evaluates within a [data binding](#data-binding).

Read about how to write template expressions in the [template expressions](guide/interpolation#template-expressions) section of the [Interpolation](guide/interpolation) guide.

{@a template-reference-variable}

## テンプレート参照変数

A variable defined in a template that references an instance associated with an element, such as a directive instance, component instance, template as in `TemplateRef`, or DOM element.
After declaring a template reference variable on an element in a template,
you can access values from that variable elsewhere within the same template.
The following example defines a template reference variable named `#phone`.

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

For more information, see the [Template reference variable](guide/template-reference-variables) guide.


{@a template-input-variable}

## テンプレートインプット変数

A template input variable is a variable you can reference within a single instance of the template. You declare a template input variable using the `let` keyword as in `let customer`.

```
 <tr *ngFor="let customer of customers;">
     <td>{{customer.customerNo}}</td>
     <td>{{customer.name}}</td>
     <td>{{customer.address}}</td>
     <td>{{customer.city}}</td>
     <td>{{customer.state}}</td>
     <button (click)="selectedCustomer=customer">Select</button>
   </tr>
```

Read and learn more about [template input variables](guide/template-reference-variables#template-input-variable).


{@a token}

## トークン

効率的なテーブル検索のために使用される不明瞭な識別子。Angularでは[DIトークン](#di-token)が、[依存性の注入](#di)システムにおいて依存性の[プロバイダー](#provider)を見つけるために使用されます。

{@a transpile}

## トランスパイル

The translation process that transforms one version of JavaScript to another version; for example, down-leveling ES2015 to the older ES5 version.

{@a file-tree}

## tree {@a tree}

In [schematics](#schematic), a virtual file system represented by the `Tree` class.
Schematic [rules](#rule) take a tree object as input, operate on them, and return a new tree object.

{@a typescript}

## TypeScript

A programming language based on JavaScript that is notable for its optional typing system.
TypeScript provides compile-time type checking and strong tooling support (such as
code completion, refactoring, inline documentation, and intelligent search).
Many code editors and IDEs support TypeScript either natively or with plug-ins.

TypeScript is the preferred language for Angular development.
Read more about TypeScript at [typescriptlang.org](https://www.typescriptlang.org/).

## TypeScript設定ファイル {@a typescript-configuration-file}

A file specifies the root files and the compiler options required to compile a TypeScript project. For more information, see [TypeScript configuration](/guide/typescript-configuration).


{@a U}

{@a unidirectional-data-flow}

## 単方向データフロー

A data flow model where the component tree is always checked for changes in one direction (parent to child), which prevents cycles in the change detection graph.

In practice, this means that data in Angular flows downward during change detection.
A parent component can easily change values in its child components because the parent is checked first.
A failure could occur, however, if a child component tries to change a value in its parent during change detection (inverting the expected data flow), because the parent component has already been rendered.
In development mode, Angular throws the `ExpressionChangedAfterItHasBeenCheckedError` error if your app attempts to do this, rather than silently failing to render the new value.

To avoid this error, a [lifecycle hook](guide/lifecycle-hooks) method that seeks to make such a change should trigger a new change detection run. The new run follows the same direction as before, but succeeds in picking up the new value.

{@a universal}

## Universal

A tool for implementing [server-side rendering](#server-side-rendering) of an Angular application.
When integrated with an app, Universal generates and serves static pages on the server in response to requests from browsers.
The initial static page serves as a fast-loading placeholder while the full application is being prepared for normal execution in the browser.

To learn more, see [Angular Universal: server-side rendering](guide/universal).

{@a V}

{@a view}

## ビュー

The smallest grouping of display elements that can be created and destroyed together.
Angular renders a view under the control of one or more [directives](#directive).

A [component](#component) class and its associated [template](#template) define a view.
A view is specifically represented by a `ViewRef` instance associated with a component.
A view that belongs immediately to a component is called a *host view*.
Views are typically collected into [view hierarchies](#view-tree).

Properties of elements in a view can change dynamically, in response to user actions;
the structure (number and order) of elements in a view can't.
You can change the structure of elements by inserting, moving, or removing nested views within their view containers.

View hierarchies can be loaded and unloaded dynamically as the user navigates through the application, typically under the control of a [router](#router).

{@a ve}

## ビューエンジン {@a view-engine}

The compilation and rendering pipeline used by Angular before version 9. Compare [Ivy](#ivy).


{@a view-tree}

## ビュー階層 {@a view-hierarchy}

A tree of related views that can be acted on as a unit. The root view is a component's *host view*. A host view can be the root of a tree of *embedded views*, collected in a *view container* (`ViewContainerRef`) attached to an anchor element in the hosting component. The view hierarchy is a key part of Angular [change detection](#change-detection).

The view hierarchy doesn't imply a component hierarchy. Views that are embedded in the context of a particular hierarchy can be host views of other components. Those components can be in the same NgModule as the hosting component, or belong to other NgModules.

{@a W}
{@a web-component}

## web component

See [custom element](#custom-element).

{@a workspace}

## ワークスペース

A collection of Angular [projects](#project) (that is, applications and libraries) powered by the [Angular CLI] (#cli) that are typically co-located in a single source-control repository (such as [git](https://git-scm.com/)).

The [CLI](#cli) [`ng new` command](cli/new) creates a file system directory (the "workspace root").
In the workspace root, it also creates the workspace [configuration file](#configuration) (`angular.json`) and, by default, an initial application project with the same name.

Commands that create or operate on apps and libraries (such as `add` and `generate`) must be executed from within a workspace folder.

For more information, see [Workspace Configuration](guide/workspace-config).

{@a cli-config}

{@a config}

## ワークスペース設定 {@a workspace-configuration}

A file named `angular.json` at the root level of an Angular [workspace](#workspace) provides workspace-wide and project-specific configuration defaults for build and development tools that are provided by or integrated with the [Angular CLI](#cli).

For more information, see [Workspace Configuration](guide/workspace-config).

Additional project-specific configuration files are used by tools, such as `package.json` for the [npm package manager](#npm-package), `tsconfig.json` for [TypeScript transpilation](#transpile), and `tslint.json` for [TSLint](https://palantir.github.io/tslint/).

For more information, see [Workspace and Project File Structure](guide/file-structure).

{@a X}


{@a Y}


{@a Z}
{@a zone}

## zone

An execution context for a set of asynchronous tasks. Useful for debugging, profiling, and testing apps that include asynchronous operations such as event processing, promises, and calls to remote servers.

An Angular app runs in a zone where it can respond to asynchronous events by checking for data changes and updating the information it displays by resolving [data bindings](#data-binding).

A zone client can take action before and after an async operation completes.

Learn more about zones in this
[Brian Ford video](https://www.youtube.com/watch?v=3IqtmUscE_U).
