# 用語集

Angularには独自の用語があります。
ほとんどのAngularの用語は、
Angularシステムの中で特別な意味をもつ常用英単語です。

ここには主要な用語といくつかのあまり馴染みのない用語を集めています。

[A](guide/glossary#A) [B](guide/glossary#B) [C](guide/glossary#C) [D](guide/glossary#D) [E](guide/glossary#E) [F](guide/glossary#F) [G](guide/glossary#G) [H](guide/glossary#H) [I](guide/glossary#I)
[J](guide/glossary#J) [K](guide/glossary#K) [L](guide/glossary#L) [M](guide/glossary#M) [N](guide/glossary#N) [O](guide/glossary#O) [P](guide/glossary#P) [Q](guide/glossary#Q) [R](guide/glossary#R)
[S](guide/glossary#S) [T](guide/glossary#T) [U](guide/glossary#U) [V](guide/glossary#V) [W](guide/glossary#W) [X](guide/glossary#X) [Y](guide/glossary#Y) [Z](guide/glossary#Z)


{@a A}
{@a aot}


## ahead-of-time (AOT) compilation
_事前コンパイル_

Angular ahead-of-time（AOT）コンパイラは、ブラウザがコードをダウンロードして実行する前に、
Angular HTMLとTypeScriptコードをビルド段階で効率的なJavaScriptコードに変換します。
これは、運用環境での最適なコンパイルモードであり、
 [just-in-time (JIT) コンパイル](guide/glossary#jit)と比較してロード時間の短縮とパフォーマンスの向上を実現します。

`ngc`コマンドラインツールを使用してアプリケーションをコンパイルすると、モジュールファクトリに直接ブートストラップすることができます。つまり、JavaScriptバンドルにAngularコンパイラを含める必要はありません。

{@a angular-element}

## Angular element

[Custom Elements](guide/glossary#custom-element)としてパッケージされたAngularの[コンポーネント](guide/glossary#component)。

[Angular Elements 概要](guide/elements)を参照してください。

{@a annotation}

## annotation
_アノテーション_

クラスのメタデータを提供する構造体。[デコレーター](guide/glossary#decorator)を参照してください。


{@a attribute-directive}


{@a attribute-directives}


## attribute directives
_属性ディレクティブ_

[ディレクティブ](guide/glossary#directive)の一種で、他のHTML要素、属性、プロパティやコンポーネントの振る舞いを監視し、変更することができます。その名前のとおり、通常これらはHTML属性として現れます。

[_属性ディレクティブ_](guide/attribute-directives)ガイドで詳しく学びましょう。


{@a B}

{@a binding}

## binding
_バインディング_

一般に、変数またはプロパティをデータ値に設定する方法です。
Angular内では、通常、DOMオブジェクトのプロパティと
データオブジェクトのプロパティを調整する[データバインディング](guide/glossary#data-binding)を指します。

また、"トークン"または"キー" と依存性の[プロバイダー](guide/glossary#provider)との間を結びつける、[依存性の注入](guide/glossary#dependency-injection)を指すこともあります。


{@a bootstrap}

## bootstrap
_ブートストラップ_

アプリやシステムを初期化して起動する方法です。

Angularでは、アプリケーションのルートNgModule（`AppModule`）には、アプリケーションのトップレベル[コンポーネント](guide/glossary#component)を識別する`bootstrap`プロパティがあります。
ブートストラッププロセス中、Angularはこれらのコンポーネントを作成して`index.html`ホストWebページに挿入します。
複数のアプリケーションを同じ`index.html`で起動することができます。各アプリケーションには独自のコンポーネントが含まれています。

詳しくは、[_ブートストラップ_](guide/bootstrapping)ガイドを参照してください。

{@a C}

{@a case-conventions}
{@a dash-case}
{@a camelcase}
{@a kebab-case}

## case types
_ケースの慣習_

Angularでは、大文字と小文字の区別があります。これについては、[命名のガイドラインセクション]の(ガイド/スタイルガイド#02-01)を参照してください。ケースタイプの概要を次に示します。

* camelCase : シンボル、プロパティ、メソッド、パイプ名、コンポーネントではないディレクティブのセレクター、定数
* UpperCamelCase (or PascalCase): コンポーネント、インタフェース、NgModule、ディレクティブおよびパイプを定義するクラスを含むクラス名
* dash-case (or "kebab-case"): ファイル名の記述部分、コンポーネントセレクタ
* underscore_case (or "snake_case"): 通常はAngularでは使用されません。
* UPPER_UNDERSCORE_CASE (or UPPER_SNAKE_CASE): 伝統的な定数（許容されますが、camelCaseを好みます）

{@a class-decorator}

## class decorator
_クラスデコレーター_

クラス定義の直前に表示される[デコレーター](guide/glossary#decorator)です。クラスが特定の型であることを宣言し、その型に適したメタデータを提供します。

次のクラスタイプを宣言できます。
* `@Component()`
* `@Directive()`
* `@Pipe()`
* `@Injectable()`
* `@NgModule()`


{@a class-field-decorator}

## class field decorator
_クラスフィールドデコレーター_

クラス定義のフィールドの直前に、そのフィールドの型を宣言する[デコレータ](guide/glossary#decorator)ステートメントを記述します。`@Input`や`@Output`などです。

{@a collection}

## collection
_コレクション_

Angularで、[npmパッケージ](guide/npm-packages)に集められた関連する[セマンティクス](guide/glossary#schematic)の集合。

{@a cli}

## command-line interface (CLI)
_コマンドラインインターフェース（CLI）_

[Angular CLI](cli)はAngular開発サイクルを管理するためのコマンドラインツールです。
これを使うことによって、[ワークスペース](guide/glossary#workspace)や[プロジェクト](guide/glossary#project)のための初期ファイルシステムの足がかりを作成したり、さまざまな要素の初期汎用バージョンのコードを追加したり変更したりする[セマンティクス](guide/glossary#schematic)を実行したりします。

* 新しいプロジェクトでCLIの使用を開始するには、[スタートアップガイド](guide/quickstart)を参照してください。
* CLIの全機能の詳細については、[CLIコマンドリファレンス](CLI)を参照してください。

[セマンティクスのCLI](#schematics-cli)も参照してください。

{@a component}

## component
_コンポーネント_

`@Component()`[デコレータ](guide/glossary#decorator)を持つクラスで、対応する[テンプレート](guide/glossary#template)と関連付けられます。コンポーネントとテンプレートによって、[ビュー](guide/glossary#view)が定義されます。
コンポーネントは、特殊なタイプの[ディレクティブ](guide/glossary#directive)です。

Angularコンポーネントクラスは、[データバインディング](guide/glossary#data-binding)を通じて、データを公開し、ビューの表示とユーザーインタラクションロジックの大部分を処理します。

コンポーネント、テンプレート、およびビューの詳細については、[アーキテクチャの概要](guide/architecture)を参照してください。

{@a custom-element}

## custom element
_カスタムエレメント_

Webプラットフォームの機能で、現在ほとんどのブラウザでサポートされており、未対応のブラウザでもpolyfillを使用して利用できます。（[ブラウザサポート](guide/browser-support)を参照）

カスタムエレメント機能はHTMLを拡張し、JavaScriptコードによってコンテンツが作成および制御されるタグを定義できるようにします。カスタムエレメント(*webコンポーネント*とも呼ばれます。)については、[CustomElementRegistry] (https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry)を参照してください。

APIを使用してAngularコンポーネントの変換を行い、ブラウザに登録してAngularアプリ内のDOMに直接追加したHTMLで使用できるようにすることができます。カスタムエレメントタグは、変更検出およびデータバインディング機能を持つコンポーネントのビューを、Angular処理なしで表示されるコンテンツに挿入します。

[動的コンポーネント読み込み](guide/glossary#dynamic-components)も参照してください。


{@a D}

{@a data-binding}

## data binding
_データバインディング_

アプリケーションがユーザーに対してデータ値を表示し、ユーザーのアクション(クリック、タッチ、キーストロークなど)に応答できるようにするプロセスのことです。

データ・バインディングでは、HTMLウィジェットとアプリケーションデータソースの間の関係を定義することで、フレームワークが詳細を処理します。
データバインディングは、アプリケーションデータ値をHTMLに手動でプッシュしたり、イベントリスナーをアタッチしたり、変更された値を画面から取得したり、アプリケーションデータ値を更新する代わりに使用できます。

データバインディングについて詳しく知るには[テンプレート構文](guide/template-syntax)の章を参照してください。

 * [補間](guide/template-syntax#interpolation).
 * [プロパティバインディング](guide/template-syntax#property-binding).
 * [イベントバインディング](guide/template-syntax#event-binding).
 * [属性バインディング](guide/template-syntax#attribute-binding).
 * [クラスバインディング](guide/template-syntax#class-binding).
 * [スタイルバインディング](guide/template-syntax#style-binding).
 * [ngModelによる双方向バインディング](guide/template-syntax#ngModel).

{@a declarable}

## declarable

[NgModule](guide/glossary#ngmodule)の`declarations`リストに追加できるクラス型です。

[コンポーネント](guide/glossary#component)、[ディレクティブ](guide/glossary#directive)、および[パイプ](guide/glossary#pipe)を宣言できます。

次のものを宣言しないでください。
 * 別のNgModuleですでに宣言されているクラス。
 * 別のパッケージからインポートされたディレクティブの配列。たとえば、`@angular/forms`の`FORMS_DIRECTIVES`を宣言しないでください。
 * NgModuleクラス。
 * サービスクラス。
 * 文字列、数値、関数、エンティティモデル、設定、ビジネスロジック、ヘルパークラスなどAngularと関係のないクラスとオブジェクト。


{@a decorator}

{@a decoration}

## decorator | decoration
_デコレーター | デコレーション_

直後のクラスまたはプロパティの定義を変更する関数。
デコレーター（アノテーションとも呼ばれる）は、実験的な（ステージ2の）JavaScript言語[機能](https://github.com/wycats/javascript-decorators)です。
TypeScriptはデコレーターのサポートを追加します。

Angularは、メタデータをクラスやプロパティに付与して、そのクラスやプロパティの意味や動作の仕方を知るデコレーターを定義します。

[クラスデコレータ](guide/glossary#class-decorator)、[クラスフィールドデコレーター](guide/glossary#class-field-decorator)を参照してください。


{@a di}

{@a dependency-injection}

## dependency injection (DI)
_依存性の注入_

アプリケーションの一部(依存関係)を作成し、他のアプリケーションに配布するためのデザインパターンとメカニズムです。

Angularでは、依存関係は通常はサービスですが、文字列や関数などの値でも構いません。
アプリケーションの[インジェクター](guide/glossary#injector)（ブートストラップ中に自動的に作成される）は、必要に応じて、設定されたサービスまたは値の[プロバイダ](guide/glossary#provider)を使用して依存関係をインスタンス化します。

詳しく知るには[依存性の注入](guide/dependency-injection)ガイドを参照してください。

{@a di-token}

## DI token
_DIトークン_

[依存性注入](guide/glossary#di)システムで使用する、依存関係[プロバイダ](guide/glossary#provider)に関連付けられた検索トークン。


{@a directive}
{@a directives}

## directive
_ディレクティブ_

DOMの構造を変更したり、DOMやコンポーネントのデータモデルの属性を変更したりできるクラスです。ディレクティブクラス定義の直前には、メタデータを提供する`@Directive()`[デコレータ](guide/glossary#decorator)が記述されます。

ディレクティブクラスは通常、HTMLの要素または属性に関連付けられ、その要素または属性はディレクティブそのものとして参照されます。
AngularはHTMLの[テンプレート](guide/glossary#template)ディレクティブを検出すると、それに一致するディレクティブクラスインスタンスを作成し、ブラウザDOMのその部分にインスタンスコントロールが与えられます。

ディレクティブには次の3つのカテゴリがあります。
- [コンポーネント](guide/glossary#component)では、`@Component()`(`@ディレクティブ()`の拡張)を使用してテンプレートをクラスに関連付けます。
- [属性ディレクティブ](guide/glossary#attribute-directive)は、ページ要素の動作と外観を変更します。
- [構造ディレクティブ](guide/glossary#structural-directive)は、DOMの構造を変更します。

Angularは`ng`接頭辞で始まるいくつかの組込みディレクティブを提供します。新しいディレクティブを作成して、独自の機能を実装することもできます。
_セレクタ_（たとえば`<my-directive>`のようなHTMLタグ）をカスタムディレクティブに関連付けて、アプリケーションで使用できる[テンプレート構文](guide/template-syntax)を拡張します。

{@a dom}

## domain-specific language (DSL)
_ドメイン固有言語_

専用ライブラリまたはAPI;[ドメイン固有言語]を参照 (https://en.wikipedia.org/wiki/Domain-specific_language).
Angularは[アニメーション](guide/animations),[フォーム](guide/forms),[ルーティングとナビゲーション](guide/router)などのNgModulesで定義されたAngularアプリに関連する多くのドメインで,ドメイン固有の言語を使ってTypeScriptを拡張しています。

{@a dynamic-components}

## dynamic component loading
_動的コンポーネント読み込み_

実行時にDOMにコンポーネントを追加する手法です。コンパイルからコンポーネントを除外し、DOMに追加するときにAngularの変更検出とイベント処理フレームワークに接続する必要があります。

[カスタム要素](guide/glossary#custom-element)も参照してください。これにより、同じ結果を簡単に得ることができます。


{@a E}

{@a eager-loading}

## eager loading
_一括読み込み_

起動時にロードされるNgModuleまたはコンポーネントは、Eager-loaded（一括読み込み）と呼ばれ、実行時にロードされるものと区別します(遅延ローディング)。
[遅延ローディング](guide/glossary#lazy-load)参照

{@a ecma}

## ECMAScript

[正式なJavaScript言語仕様] (https://en.wikipedia.org/wiki/ECMAScript).

すべてのブラウザが最新のECMAScript標準をサポートしているわけではありませんが、[トランスパイラ](guide/glossary#transpile)(例えば[TypeScript型スクリプト](guide/glossary#typescript))を使用すると、最新の機能を使用してコードを記述でき、その機能はブラウザがサポートするバージョンで実行されるコードに変換されます。

詳細については、[ブラウザのサポート](ガイド/ブラウザサポート)を参照してください。

{@a element}

## element
_要素_

Angularは、レンダリング固有のネイティブUI要素をラップする `ElementRef` クラスを定義します。
ほとんどの場合、Angularテンプレートとデータバインディングを使って、ネイティブ要素を参照せずにDOM要素にアクセスすることができます。

このドキュメンテーションは、一般的に要素（`ElementRef`インスタンス）またはDOM要素（必要に応じて直接アクセスできる）のいずれかを参照します。

[カスタム要素](guide/glossary#custom-element)とも比較してください。

{@a entry-point}

## entry point
_エントリポイント_

[npmパッケージ](guide/npm-packages)の一部を他のコードで読み込むことができるようにするJavaScriptシンボルです。
Angularの[スコープ付きパッケージ](guide/glossary#scoped-package)にはそれぞれ`index`という名前のエントリポイントがあります。

Angularでは、[NgModule](guide/glossary#ngmodule)を使用して同じ結果を得ます。

{@a F}

{@a form-control}

## form control

A instance of `FormControl`, which is a fundamental building block for Angular forms. Together with `FormGroup` and `FormArray`, tracks the value, validation, and status of a form input element.

Read more forms in the [Introduction to forms in Angular](guide/forms-overview).

{@a form-model}

## form model

The "source of truth" for the value and validation status of a form input element at a given point in time. When using [reactive forms](guide/glossary#reactive-forms), the form model is created explicitly in the component class. When using [template-driven forms](guide/glossary#template-driven-forms), the form model is implicitly created by directives.

Learn more about reactive and template-driven forms in the [Introduction to forms in Angular](guide/forms-overview).

{@a form-validation}

## form validation

A check that runs when form values change and reports whether the given values are correct and complete, according to the defined constraints. Reactive forms apply [validator functions](guide/form-validation#adding-to-reactive-forms). Template-driven forms use [validator directives](guide/form-validation#adding-to-template-driven-forms).


To learn more, see [Form Validation](guide/form-validation).

{@a G}


{@a H}

{@a I}


{@a immutability}

## immutability

The ability to alter the state of a value after its creation. [Reactive forms](guide/glossary#reactive-forms) perform immutable changes in that
each change to the data model produces a new data model rather than modifying the existing one. [Template-driven forms](guide/glossary#template-driven-forms) perform mutable changes with `NgModel` and [two-way data binding](guide/glossary#data-binding) to modify the existing data model in place.

{@a injectable}

## injectable

An Angular class or other definition that provides a dependency using the [dependency injection](guide/glossary#di) mechanism. An injectable [service](guide/glossary#service) class must be marked by the `@Injectable()` [decorator](guide/glossary#decorator). Other items, such as constant values, can also be injectable.

{@a injector}

## injector

An object in the Angular [dependency-injection](guide/glossary#dependency-injection) system
that can find a named dependency in its cache or create a dependency
using a configured [provider](guide/glossary#provider).
Injectors are created for NgModules automatically as part of the bootstrap process
and are inherited through the component hierarchy.

* An injector provides a singleton instance of a dependency, and can inject this same instance in multiple components.

* A hierarchy of injectors at the NgModule and component level can provide different instances of a dependency to their own components and child components.

* You can configure injectors with different providers that can provide different implementations of the same dependency.

Learn more about the injector hierarchy in [Hierarchical Dependency Injectors](guide/hierarchical-dependency-injection).

{@a input}

## input

When defining a [directive](guide/glossary#directive), the `@Input()` decorator on a directive property
makes that property available as a *target* of a [property binding](guide/template-syntax#property-binding).
Data values flow into an input property from the data source identified
in the [template expression](guide/glossary#template-expression) to the right of the equal sign.

To learn more, see [input and output properties](guide/template-syntax#inputs-outputs).

{@a interpolation}

## interpolation

A form of property [data binding](guide/glossary#data-binding) in which a [template expression](guide/glossary#template-expression) between double-curly braces renders as text.
That text can be concatenated with neighboring text before it is assigned to an element property
or displayed between element tags, as in this example.

<code-example language="html" escape="html">
  <label>My current hero is {{hero.name}}</label>

</code-example>


Read more about [interpolation](guide/template-syntax#interpolation) in [Template Syntax](guide/template-syntax).


{@a J}

{@a javascript}

## JavaScript

See [ECMAScript](guide/glossary#ecma), [TypeScript](guide/glossary#typescript).


{@a jit}


## just-in-time (JIT) compilation

The Angular just-in-time (JIT) compiler converts your Angular HTML and TypeScript code into
efficient JavaScript code at run time, as part of bootstrapping.

JIT compilation is the default (as opposed to AOT compilation) when you run Angular's `ng build` and `ng serve` CLI commands, and is a good choice during development.
JIT mode is strongly discouraged for production use
because it results in large application payloads that hinder the bootstrap performance.

Compare to [ahead-of-time (AOT) compilation](guide/glossary#aot).


{@a K}


{@a L}

{@a lazy-load}

## lazy loading

A process that speeds up application load time by splitting the application into multiple bundles and loading them on demand.
For example, dependencies can be lazy loaded as needed&mdash;as opposed to [eager-loaded](guide/glossary#eager-loading) modules that are required by the root module and are thus loaded on launch.

The [router](guide/glossary#router) makes use of lazy loading to load child views only when the parent view is activated.
Similarly, you can build custom elements that can be loaded into an Angular app when needed.

{@a library}

## library

In Angular, a [project](guide/glossary#project) that provides functionality that can be included in other Angular apps.
A library isn't a complete Angular app and can't run independently.

* Library developers can use the [Angular CLI](guide/glossary#cli) to `generate` scaffolding for a new library in an existing [workspace](guide/glossary#workspace), and can publish a library as an `npm` package.

* Application developers can use the [Angular CLI](guide/glossary#cli) to `add` a published library for use with an application in the same [workspace](guide/glossary#workspace).

See also [schematic](#schematic).

{@a lifecycle-hook}

## lifecycle hook

An interface that allows you to tap into the lifecycle of [directives](guide/glossary#directive) and [components](guide/glossary#component) as they are created, updated, and destroyed.

Each interface has a single hook method whose name is the interface name prefixed with `ng`.
For example, the `OnInit` interface has a hook method named `ngOnInit`.

Angular calls these hook methods in the following order:

* `ngOnChanges`: When an [input](guide/glossary#input)/[output](guide/glossary#output) binding value changes.
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

## module

In general, a module collects a block of code dedicated to a single purpose. Angular uses standard JavaScript modules and also defines an Angular module, `NgModule`.

In JavaScript (ECMAScript), each file is a module and all objects defined in the file belong to that module. Objects can exported, making them public, and public objects can be imported for use by other modules.

Angular ships as a collection of JavaScript modules (also called libraries). Each Angular library name begins with the `@angular` prefix. Install Angular libraries with the [npm package manager](https://docs.npmjs.com/getting-started/what-is-npm) and import parts of them with JavaScript `import` declarations.

Compare to [NgModule](guide/glossary#ngmodule).


{@a N}

{@a ngmodule}

## NgModule

A class definition preceded by the `@NgModule()` [decorator](guide/glossary#decorator), which declares and serves as a manifest for a block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.

Like a [JavaScript module](guide/glossary#module), an NgModule can export functionality for use by other NgModules and import public functionality from other NgModules.
The metadata for an NgModule class collects components, directives, and pipes that the application uses along with the list of imports and exports. See also [declarable](guide/glossary#declarable).

NgModules are typically named after the file in which the exported thing is defined. For example, the Angular [DatePipe](api/common/DatePipe) class belongs to a feature module named `date_pipe` in the file `date_pipe.ts`. You import them from an Angular [scoped package](guide/glossary#scoped-package) such as `@angular/core`.

Every Angular application has a root module. By convention, the class is called `AppModule` and resides in a file named `app.module.ts`.

To learn more, see [NgModules](guide/ngmodules).

{@a npm-package}

## npm package

The [npm package manager](https://docs.npmjs.com/getting-started/what-is-npm) is used to distribute and load Angular modules and libraries.

Learn more about how Angular uses [Npm Packages](guide/npm-packages).

{@a O}

{@a observable}

## observable

A producer of multiple values, which it pushes to [subscribers](guide/glossary#subscriber). Used for asynchronous event handling throughout Angular. You execute an observable by subscribing to it with its `subscribe()` method, passing callbacks for notifications of new values, errors, or completion.

Observables can deliver single or multiple values of any type to subscribers, either synchronously (as a function delivers a value to its caller) or on a schedule. A subscriber receives notification of new values as they are produced and notification of either normal completion or error completion.

Angular uses a third-party library called [Reactive Extensions (RxJS)](http://reactivex.io/rxjs/).

To learn more, see [Observables](guide/observables).


{@a observer}

## observer

An object passed to the `subscribe()` method for an [observable](guide/glossary#observable). The object defines the callbacks for the [subscriber](guide/glossary#subscriber).

{@a output}

## output

When defining a [directive](guide/glossary#directive), the `@Output{}` decorator on a directive property
makes that property available as a *target* of [event binding](guide/template-syntax#event-binding).
Events stream *out* of this property to the receiver identified
in the [template expression](guide/glossary#template-expression) to the right of the equal sign.

To learn more, see [Input and Output Properties](guide/template-syntax#inputs-outputs).


{@a P}

{@a pipe}

## pipe

A class which is preceded by the `@Pipe{}` decorator and which defines a function that transforms input values to output values for display in a [view](guide/glossary#view). Angular defines various pipes, and you can define new pipes.

To learn more, see [Pipes](guide/pipes).

{@a polyfill}

## polyfill

An [npm package](guide/npm-packages) that plugs gaps in a browser's JavaScript implementation.
See [Browser Support](guide/browser-support) for polyfills that support particular functionality for particular platforms.

{@a project}

## project

In Angular, a folder within a [workspace](guide/glossary#workspace) that contains an Angular app or [library](guide/glossary#library).
A workspace can contain multiple projects.
All apps in a workspace can use libraries in the same workspace.

{@a provider}

## provider

An object that implements one of the [`Provider`](api/core/Provider) interfaces. A provider object defines how to obtain an injectable dependency associated with a [DI token](guide/glossary#token).
An [injector](guide/glossary#injector) uses the provider to create a new instance of a dependency
for a class that requires it.

Angular registers its own providers with every injector, for services that Angular defines.
You can register your own providers for services that your app needs.

See also [service](guide/glossary#service), [dependency injection](guide/glossary#di).

Learn more in [Dependency Injection](guide/dependency-injection).


{@a Q}

{@a R}

{@a reactive-forms}

## reactive forms

A framework for building Angular forms through code in a component.
The alternative is a [template-driven form](guide/glossary#template-driven-forms).

When using reactive forms:

* The "source of truth", the form model, is defined in the component class.
* Validation is set up through validation functions rather than valdation directives.
* Each control is explicitly created in the component class by creating a `FormControl` instance manually or with `FormBuilder`.
* The template input elements do *not* use `ngModel`.
* The associated Angular directives are prefixed with `form`, such as `formControl`, `formGroup`, and `formControlName`.

The alternative is a template-driven form. For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms](guide/forms-overview).

{@a router}
{@a router-module}

## router

A tool that configures and implements navigation among states and [views](guide/glossary#view) within an Angular app.

The `Router` module is an [NgModule](guide/glossary#ngmodule) that provides the necessary service providers and directives for navigating through application views. A [routing component](guide/glossary#routing-component) is one that imports the `Router` module and whose template contains a `RouterOutlet` element where it can display views produced by the router.

The router defines navigation among views on a single page, as opposed to navigation among pages. It interprets URL-like links to determine which views to create or destroy, and which components to load or unload. It allows you to take advantage of [lazy loading](guide/glossary#lazy-load) in your Angular apps.

To learn more, see [Routing and Navigation](guide/router).

{@a router-outlet}

## router outlet

A [directive](guide/glossary#directive) that acts as a placeholder in a routing component's template. Angular dynamically renders the template based on the current router state.

{@a router-component}

## routing component

An Angular [component](guide/glossary#component) with a `RouterOutlet` directive in its template that displays views based on router navigations.

For more information, see [Routing and Navigation](guide/router).

{@a rule}

In [schematics](#schematic), a function that operates on a [file tree](#file-tree) to create, delete, or modify files in a specific manner, and returns a new `Tree` object.


{@a S}

{@a schematic}

## schematic

A scaffolding library that defines how to generate or transform a programming project by creating, modifying, refactoring, or moving files and code.
A schematic defines [rules](#rule) that operate on a virtual file system called a [tree](#file-tree).
The [Angular CLI](guide/glossary#cli) uses schematics to generate and modify [Angular projects](guide/glossary#project) and parts of projects.

* Angular provides a set of schematics for use with the CLI. See the [Angular CLI command reference](cli). The [`ng add`](cli/add) command runs schematics as part of adding a library to your project. The [`ng generate`](cli/generate) command runs schematics to create apps, libraries, and Angular code constructs.

* [Library](#library) developers can use the [Schematics CLI](#schematics-cli) to create schematics that enable the Angular CLI to add and update their published libraries, and to generate artifacts the library defines.

   For more information, see [devkit documentation](https://www.npmjs.com/package/@angular-devkit/schematics).

{@a schematics-cli}

## Schematics CLI

Schematics come with their own command-line tool.
Using Node 6.9 or above, install the Schematics CLI globally:

<code-example format="." language="bash">
npm install -g @angular-devkit/schematics-cli
</code-example>

This installs the `schematics` executable, which you can use to create a new project, add a new schematic to an existing project, or extend an existing schematic.

{@a scoped-package}

## scoped package

A way to group related [npm packages](guide/npm-packages).
NgModules are delivered within scoped packages whose names begin with the Angular *scope name* `@angular`. For example, `@angular/core`, `@angular/common`, `@angular/forms`, and `@angular/router`.

Import a scoped package in the same way that you import a normal package.

<code-example path="architecture/src/app/app.component.ts" linenums="false" header="architecture/src/app/app.component.ts (import)" region="import">

</code-example>

{@a service}

## service

In Angular, a class with the [@Injectable()](guide/glossary#injectable) decorator that encapsulates non-UI logic and code that can be reused across an application.
Angular distinguishes components from services to increase modularity and reusability.

The `@Injectable()` metadata allows the service class to be used with the [dependency injection](guide/glossary#di) mechanism.
The injectable class is instantiated by a [provider](guide/glossary#provider).
[Injectors](guide/glossary#injector) maintain lists of providers and use them to provide service instances when they are required by components or other services.

To learn more, see [Introduction to Services and Dependency Injection](guide/architecture-services).

{@a structural-directive}
{@a structural-directives}

## structural directives

A category of [directive](guide/glossary#directive) that is responsible for shaping HTML layout by modifying the DOM&mdashthat is, adding, removing, or manipulating elements and their children.

To learn more, see [Structural Directives](guide/structural-directives).

{@a subscriber}

## subscriber

A function that defines how to obtain or generate values or messages to be published. This function is executed when a consumer calls the `subscribe()` method of an [observable](guide/glossary#observable).

The act of subscribing to an observable triggers its execution, associates callbacks with it, and creates a `Subscription` object that lets you unsubscribe.

The `subscribe()` method takes a JavaScript object (called an [observer](guide/glossary#observer)) with up to three callbacks, one for each type of notification that an observable can deliver:

* The `next` notification sends a value such as a number, a string, or an object.
* The `error` notification sends a JavaScript Error or exception.
* The `complete` notification doesn't send a value, but the handler is called when the call completes. Scheduled values can continue to be returned after the call completes.

{@a T}
{@a template}

## template

Code associated with a component that defines how to render the component's [view](guide/glossary#view).

A template combines straight HTML with Angular [data-binding](guide/glossary#data-binding) syntax, [directives](guide/glossary#directive),
and [template expressions](guide/glossary#template-expression) (logical constructs).
The Angular elements insert or calculate values that modify the HTML elements before the page is displayed.

A template is associated with a [component](guide/glossary#component) class through the `@Component()` [decorator](guide/glossary#decorator). The HTML can be provided inline, as the value of the `template` property, or in a separate HTML file linked through the `templateUrl` property.

Additional templates, represented by `TemplateRef` objects, can define alternative or *embedded* views, which can be referenced from multiple components.

{@a template-drive-forms}

## template-driven forms

A format for building Angular forms using HTML forms and input elements in the view.
The alternative format uses the [reactive forms](guide/glossary#reactive-forms) framework.

When using template-driven forms:

* The "source of truth" is the template. The validation is defined using attributes on the individual input elements.
* [Two-way binding](guide/glossary#data-binding) with `ngModel` keeps the component model synchronized with the user's entry into the input elements.
* Behind the scenes, Angular creates a new control for each input element, provided you have set up a `name` attribute and two-way binding for each input.
* The associated Angular directives are prefixed with `ng` such as `ngForm`, `ngModel`, and `ngModelGroup`.

The alternative is a reactive form. For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms](guide/forms-overview).

{@a template-expression}

## template expression

A TypeScript-like syntax that Angular evaluates within a [data binding](guide/glossary#data-binding).

Read about how to write template expressions in  [Template expressions](guide/template-syntax#template-expressions).

{@a token}

## token

An opaque identifier used for efficient table lookup. In Angular, a [DI token](guide/glossary#di-token) is used to find [providers](guide/glossary#provider) of dependencies in the [dependency injection](guide/glossary#di) system.

{@a transpile}

## transpile

The translation process that transforms one version of JavaScript to another version; for example, down-leveling ES2015 to the older ES5 version.

{@a file-tree}

## tree

In [schematics](#schematic), a virtual file system represented by the `Tree` class.
Schematic [rules](#rule) take a tree object as input, operate on them, and return a new tree object.

{@a typescript}

## TypeScript

A programming language based on JavaScript that is notable for its optional typing system.
TypeScript provides compile-time type checking and strong tooling support (such as
code completion, refactoring, inline documentation, and intelligent search).
Many code editors and IDEs support TypeScript either natively or with plug-ins.

TypeScript is the preferred language for Angular development.
Read more about TypeScript at [typescriptlang.org](http://www.typescriptlang.org/).


{@a U}

{@a V}

{@a view}

## view

The smallest grouping of display elements that can be created and destroyed together.
Angular renders a view under the control of one or more [directives](guide/glossary#directive),
especially [component](guide/glossary#component) directives and their companion [templates](guide/glossary#template).

A view is specifically represented by a `ViewRef` instance associated with the component.
A view that belongs to a component is called a *host view*.
Views are typically collected into [view hierarchies](guide/glossary#view-tree).

Properties of elements in a view can change dynamically, in response to user actions;
the structure (number and order) of elements in a view can't.
You can change the structure of elements by inserting, moving, or removing nested views within their view containers.

View hierarchies can be loaded and unloaded dynamically as the user navigates through the application, typically under the control of a [router](guide/glossary#router).

{@a view-tree}

## view hierarchy

A tree of related views that can be acted on as a unit. The root view is a component's *host view*.  A host view can be the root of a tree of *embedded views*, collected in a *view container* (`ViewContainerRef`) attached to an anchor element in the hosting component. The view hierarchy is a key part of Angular change detection.

The view hierarchy doesn't imply a component hierarchy. Views that are embedded in the context of a particular hierarchy can be host views of other components. Those components can be in the same NgModule as the hosting component, or belong to other NgModules.

{@a W}
{@a web-component}

## web component

See [custom element](guide/glossary#custom-element).

{@a workspace}

## workspace

In Angular, a folder that contains [projects](guide/glossary#project) (that is, apps and libraries).
The [CLI](guide/glossary#cli) `ng new` command creates a workspace to contain projects.
Commands that create or operate on apps and libraries (such as `add` and `generate`) must be executed from within a workspace folder.

{@a X}


{@a Y}


{@a Z}
{@a zone}

## zone

An execution context for a set of asynchronous tasks. Useful for debugging, profiling, and testing apps that include asynchronous operations such as event processing, promises, and calls to remote servers.

An Angular app runs in a zone where it can respond to asynchronous events by checking for data changes and updating the information it displays by resolving [data bindings](guide/glossary#data-binding).

A zone client can take action before and after an async operation completes.

Learn more about zones in this
[Brian Ford video](https://www.youtube.com/watch?v=3IqtmUscE_U).
