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

Angularフォームの基本的な構成要素である`FormControl`のインスタンス。「FormGroup」 および 「FormArray」 とともに、フォーム入力要素の値、検証、およびステータスを追跡します。

Read more forms in the [Introduction to forms in Angular](guide/forms-overview).

{@a form-model}

## form model

特定の時点におけるフォーム入力要素の値および検証ステータスの「真実を語る資料」です。[reactive forms](guide/glossary#reactive-forms)を使用する場合、フォームモデルはコンポーネントクラスで明示的に作成されます。[template-driven forms](guide/glossary#template-driven-forms)を使用する場合、フォームモデルはディレクティブによって暗黙的に作成されます。


Learn more about reactive and template-driven forms in the [Introduction to forms in Angular](guide/forms-overview).

{@a form-validation}

## form validation

A check that runs when form values change and reports whether the given values are correct and complete, according to the defined constraints. Reactive forms apply [validator functions](guide/form-validation#adding-to-reactive-forms). Template-driven forms use [validator directives](guide/form-validation#adding-to-template-driven-forms).

フォームの値が変更されたときに実行され、指定された値が定義された制約に従って正しく完全であるかどうかを報告するチェック。リアクティブフォームは[バリデータ関数]を適用します(guide/form-validation#adding-to-reactive-forms)。テンプレート駆動型フォームでは、[バリデータディレクティブ](gguide/form-validation#adding-to-template-driven-forms)が使用されます。


To learn more, see [Form Validation](guide/form-validation).

{@a G}


{@a H}

{@a I}


{@a immutability}

## immutability

The ability to alter the state of a value after its creation. [Reactive forms](guide/glossary#reactive-forms) perform immutable changes in that
each change to the data model produces a new data model rather than modifying the existing one. [Template-driven forms](guide/glossary#template-driven-forms) perform mutable changes with `NgModel` and [two-way data binding](guide/glossary#data-binding) to modify the existing data model in place.

値の作成後に値の状態を変更する機能。[リアクティブフォーム](guide/glossary#reactive-forms)は、データ・モデルを変更するたびに、既存のデータ・モデルを変更するのではなく、新しいデータ・モデルを生成するという不変の変更を行います。[テンプレート駆動型フォーム](guide/glossary#template-driven-forms)は、`NgModel`と[双方向データバインディング](guide/glossary#data-binding)を使用して可変の変更を実行し、既存のデータモデルを適切に変更します。

{@a injectable}

## injectable

An Angular class or other definition that provides a dependency using the [dependency injection](guide/glossary#di) mechanism. An injectable [service](guide/glossary#service) class must be marked by the `@Injectable()` [decorator](guide/glossary#decorator). Other items, such as constant values, can also be injectable.

[依存性注入](guide/glossary#di)メカニズムを使用して依存関係を提供するAngularクラスまたはその他の定義。
注入可能な[サービス](guide/glossary#service)クラスは、`@Injectable()`(guide/glossary#decorator)[デコレーター]で示されなければなりません。定数値のような他のアイテムも注入可能であり得る。

{@a injector}

## injector

Angular[依存性注入](guide/glossary#dependency-injection)システムのオブジェクト
キャッシュ内で名前付き依存関係を検索するか、または依存関係を作成する
構成済みの[プロバイダ](guide/glossary#provider)を使用します。
ブートストラップ・プロセスの一部として、NgModules用のインジェクタが自動的に作成される
コンポーネント階層を通じて継承されます。

* インジェクターは依存関係のシングルトン・インスタンスを提供し、この同じインスタンスを複数のコンポーネントに注入することができます。

* NgModuleおよびコンポーネント・レベルでのインジェクターの階層は、それぞれのコンポーネントおよび子コンポーネントに対する依存関係のさまざまなインスタンスを提供することができます。

* 同じ依存関係の異なる実装を提供できる異なるプロバイダを持つインジェクタを構成できます。

インジェクタ階層の詳細については、[階層依存性インジェクタ](guide/hierarchical-dependency-injection)を参照してください。

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

[指示](ガイド/用語集#ディレクティブ)を定義する場合、ディレクティブ・プロパティの`@Input()`デコレータによって、そのプロパティを[プロパティバインディング](guide/template-syntax#property-binding)の*target*として使用できるようになります。

データ値は、等号の右側にある[テンプレート式](ガイド/用語集#template-expression)で識別されるデータ・ソースから入力プロパティに渡されます。

When defining a [directive](guide/glossary#template-expression), the `@Input()` decorator on a directive property
makes that property available as a *target* of a [property binding](guide/template-syntax#property-binding).
Data values flow into an input property from the data source identified
in the [template expression](guide/glossary#template-expression) to the right of the equal sign.

To learn more, see [input and output properties](guide/template-syntax#inputs-outputs).

{@a interpolation}

## interpolation

プロパティ[データバインディング](ガイド/用語集#data-binding)の形式で、二重中括弧の間の[テンプレート式](ガイド/用語集#template-expression)はテキストとして描画されます。
この例のように、このテキストを隣接するテキストと連結してから要素プロパティに割り当てるか、要素タグ間に表示することができます。

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

Angular just-in-time(JIT)コンパイラは,ブートストラップの一環として,Angular HTMLとTypeScriptコードを実行時に効率的なJavaScriptコードに変換します。

JITコンパイルはAngularの`ng build`や`ng service`CLIコマンドを実行する際のデフォルト(AOTコンパイルとは対照的に)であり、開発時には良い選択です。
JITモードは、ブートストラップのパフォーマンスを妨げる大きなアプリケーション・ペイロードを引き起こすため、本番環境での使用は強くお勧めしません。

Compare to [ahead-of-time (AOT) compilation](guide/glossary#aot).


{@a K}


{@a L}

{@a lazy-load}

## lazy loading

A process that speeds up application load time by splitting the application into multiple bundles and loading them on demand.
For example, dependencies can be lazy loaded as needed&mdash;as opposed to [eager-loaded](guide/glossary#eager-loading) modules that are required by the root module and are thus loaded on launch.

The [router](guide/glossary#router) makes use of lazy loading to load child views only when the parent view is activated.
Similarly, you can build custom elements that can be loaded into an Angular app when needed.

アプリケーションを複数のバンドルに分割し、必要に応じてロードすることで、アプリケーションのロード時間を短縮するプロセス。
たとえば、必要に応じて依存関係を遅延読み込みできます。&mdash;これは、ルートモジュールが必要とし、起動時にロードされる [eager-loaded](guide/glossary#eager-loading)モジュールとは対照的です。

[ルーター](guide/glossary#router)では、親ビューがアクティブになっている場合にのみ子ビューの読み込みに遅延読み込みが使用されます。
同様に、必要に応じてAngularアプリにロードできるカスタム要素を作成することもできる。

{@a library}

## library

In Angular, a [project](guide/glossary#project) that provides functionality that can be included in other Angular apps.
A library isn't a complete Angular app and can't run independently.

* Library developers can use the [Angular CLI](guide/glossary#cli) to `generate` scaffolding for a new library in an existing [workspace](guide/glossary#workspace), and can publish a library as an `npm` package.

* Application developers can use the [Angular CLI](guide/glossary#cli) to `add` a published library for use with an application in the same [workspace](guide/glossary#workspace).

Angularでは、他のAngularアプリに含めることができる機能を提供する[プロジェクト](guide/glossary#project)。

ライブラリは完全なAngularアプリではなく,独立して実行することはできない。

* ライブラリ開発者は、[Angular CLI](guide/glossary#cli)を使用して、既存の[ワークスペース](guide/glossary#workspace)内の新しいライブラリのための基盤を`generate`することができ、ライブラリを 「npm」 パッケージとして公開することができる。

* アプリケーション開発者は、[Angular CLI](guide/glossary#cli)を使用して、同じ[ワークスペース](guide/glossary#workspace)内のアプリケーションで使用するために公開されたライブラリを追加できます。

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

[directives](guide/glossary#directive)および[components](guide/glossary#component)の作成、更新、および破棄のライフサイクルを利用できるインタフェース。

各インタフェースには単一のフックメソッドがあり、その名前はインタフェース名の先頭に 「ng」 が付きます。
たとえば、 「OnInit」 インタフェースには、 「ngOnInit」 という名前のフックメソッドがあります。

Angularはこれらのフックメソッドを次の順序で呼び出します。

* `ngOnChanges`:[input](guide/glossary#input)/[output](guide/glossary#output)バインド値が変更されたとき。
* `ngOnInit`:最初の`ngOnChanges`.。
* `ngDoCheck`:開発者のカスタム変更検出。
* `ngAfterContentInit`:コンポーネントの内容を初期化した後。
* `ngAfterContentChecked`:コンポーネントの内容をチェックするたびに実行されます。
* `ngAfterViewInit`:コンポーネントのビューが初期化された後。
* `ngAfterViewChecked`:コンポーネントのビューをチェックするたびに実行されます。
* `ngOnDestroy` :指示が破棄される直前。

詳細については、[ライフサイクルフック](guide/lifecycle-hooks)を参照してください。


{@a M}

{@a module}

## module

In general, a module collects a block of code dedicated to a single purpose. Angular uses standard JavaScript modules and also defines an Angular module, `NgModule`.

In JavaScript (ECMAScript), each file is a module and all objects defined in the file belong to that module. Objects can exported, making them public, and public objects can be imported for use by other modules.

Angular ships as a collection of JavaScript modules (also called libraries). Each Angular library name begins with the `@angular` prefix. Install Angular libraries with the [npm package manager](https://docs.npmjs.com/getting-started/what-is-npm) and import parts of them with JavaScript `import` declarations.


一般に、モジュールは1つの目的専用のコード・ブロックを収集します。Angularは標準のJavaScriptモジュールを使用し、Angularモジュール`NgModule`も定義している。

JavaScript(ECMAScript)では、各ファイルはモジュールであり、ファイル内で定義されたすべてのオブジェクトはそのモジュールに属します。オブジェクトをエクスポートしてパブリックにしたり、パブリック・オブジェクトをインポートして他のモジュールで使用したりできます。

AngularはJavaScriptモジュール(ライブラリとも呼ばれます。)のコレクションとして出荷されている。各Angularライブラリ名は`@angular`で始まります。Angularライブラリを [npm package manager] (https://docs.npmjs.com/getting-started/what-is-npm)でインストールし、その一部をJavaScriptの`import`宣言でインポートする。

Compare to [NgModule](guide/glossary#ngmodule).


{@a N}

{@a ngmodule}

## NgModule

A class definition preceded by the `@NgModule()` [decorator](guide/glossary#decorator), which declares and serves as a manifest for a block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.

Like a [JavaScript module](guide/glossary#module), an NgModule can export functionality for use by other NgModules and import public functionality from other NgModules.
The metadata for an NgModule class collects components, directives, and pipes that the application uses along with the list of imports and exports. See also [declarable](guide/glossary#declarable).

NgModules are typically named after the file in which the exported thing is defined. For example, the Angular [DatePipe](api/common/DatePipe) class belongs to a feature module named `date_pipe` in the file `date_pipe.ts`. You import them from an Angular [scoped package](guide/glossary#scoped-package) such as `@angular/core`.

Every Angular application has a root module. By convention, the class is called `AppModule` and resides in a file named `app.module.ts`.

`@NgModule()`[デコレーター](guide/glossary#decorator)で始まるクラス定義。アプリケーションドメイン、ワークフロー、または密接に関連する機能セット専用のコードブロックを宣言し、そのマニフェストとして機能します。

[JavaScriptモジュール](guide/glossary#module)と同様に、NgModuleは他のNgModulesで使用する機能をエクスポートしたり、他のNgModulesからパブリック機能をインポートしたりできます。
NgModuleクラスのメタデータは、アプリケーションが使用するコンポーネント、ディレクティブ、およびパイプを、インポートとエクスポートの一覧と共に収集します。[declarable](guide/glossary#declarable)も参照してください。

通常、NgModulesには、エクスポートされたものが定義されているファイルの名前が付けられます。たとえば、Angular[日付パイプ](api/common/DatePipe)クラスは `date_pipe.ts`ファイルの中の`date_pipe`という名前のフィーチャモジュールに属しています。これらは、`@angular/core`などのAngular[スコープ付きパッケージ](guide/glossary#scoped-package)からインポートします。

すべてのAngularアプリケーションにはルートモジュールがあります。慣例により、このクラスは `AppModule` と呼ばれ、 `app.module.ts` という名前のファイルに格納されます。

To learn more, see [NgModules](guide/ngmodules).

{@a npm-package}

## npm package

The [npm package manager](https://docs.npmjs.com/getting-started/what-is-npm) is used to distribute and load Angular modules and libraries.

[npmパッケージマネージャー] (https://docs.npmjs.com/getting-started/what-is-npm)はAngularモジュールとライブラリの配布とロードに使用されます。

Learn more about how Angular uses [Npm Packages](guide/npm-packages).

{@a O}

{@a observable}

## observable

A producer of multiple values, which it pushes to [subscribers](guide/glossary#subscriber). Used for asynchronous event handling throughout Angular. You execute an observable by subscribing to it with its `subscribe()` method, passing callbacks for notifications of new values, errors, or completion.

Observables can deliver single or multiple values of any type to subscribers, either synchronously (as a function delivers a value to its caller) or on a schedule. A subscriber receives notification of new values as they are produced and notification of either normal completion or error completion.

複数の値を生成し、[subscriber](guide/glossary#subscriber)にプッシュします。
Angular全体の非同期イベント処理に使用される。
observableを実行するには、`subscribe()`メソッドを使ってobservableにsubscribingし、新しい値、エラー、完了の通知のためのコールバックを渡します。

観測データは、任意のタイプの単一または複数の値を、同期(関数が呼び出し元に値を渡すとき)またはスケジュールでsubscriberに配信できます。subscribersは、新しい値が生成されると通知を受け取り、正常終了またはエラー完了の通知を受け取ります。

Angular uses a third-party library called [Reactive Extensions (RxJS)](http://reactivex.io/rxjs/).

To learn more, see [Observables](guide/observables).


{@a observer}

## observer

An object passed to the `subscribe()` method for an [observable](guide/glossary#observable). The object defines the callbacks for the [subscriber](guide/glossary#subscriber).

[observable](guide/glossary#observable)のために`subscribe()`メソッドに渡されるオブジェクト。
このオブジェクトは、[subscriber](guide/glossary#subscriber)のコールバックを定義します。

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

`@Pipe{}`デコレータが先行し、入力値を出力値に変換して[ビュー](guide/glossary#view)に表示する関数を定義するクラス。Angularはさまざまなパイプを定義し、新しいパイプを定義できます。

To learn more, see [Pipes](guide/pipes).

{@a polyfill}

## polyfill

An [npm package](guide/npm-packages) that plugs gaps in a browser's JavaScript implementation.
See [Browser Support](guide/browser-support) for polyfills that support particular functionality for particular platforms.

ブラウザーのJavaScript実装のギャップを埋める[npmパッケージ](guide/npm-packages)。
特定のプラットフォームで特定の機能をサポートするポリフィルについては、[ブラウザサポート](guide/browser-support)を参照してください。
{@a project}

## project

In Angular, a folder within a [workspace](guide/glossary#workspace) that contains an Angular app or [library](guide/glossary#library).
A workspace can contain multiple projects.
All apps in a workspace can use libraries in the same workspace.

Angularでは、Angularアプリまたは[ライブラリ](guide/glossary#library)を含む[ワークスペース](guide/glossary#workspace)内のフォルダ。
ワークスペースには、複数のプロジェクトを含めることができます。
ワークスペース内のすべてのアプリケーションは、同じワークスペース内のライブラリを使用できます。

{@a provider}

## provider

An object that implements one of the [`Provider`](api/core/Provider) interfaces. A provider object defines how to obtain an injectable dependency associated with a [DI token](guide/glossary#token).
An [injector](guide/glossary#injector) uses the provider to create a new instance of a dependency
for a class that requires it.

Angular registers its own providers with every injector, for services that Angular defines.
You can register your own providers for services that your app needs.

[`Provider`](api/core/Provider)インタフェースのいずれかを実装するオブジェクト。プロバイダ・オブジェクトは、[DIトークン](guide/glossary#token)に関連付けられた注入可能な依存関係を取得する方法を定義します。
[injector](guide/glossary#injector)は、それを必要とするクラスのためにプロバイダを使用して依存関係の新しいインスタンスを作成します。


Angularは,Angularが定義するサービスに対して,すべてのインジェクタに自身のプロバイダを登録する。
アプリケーションが必要とするサービスについて、独自のプロバイダを登録できます。

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


コンポーネント内のコードを通じてAngularフォームを構築するためのフレームワーク。
代替案は、 [テンプレート駆動型フォーム](guide/glossary#template-driven-forms)です。

リアクティブフォームを使用する場合:

* フォームモデルである「真実を語る資料」は、コンポーネントクラスで定義されます。
* 検証は、検証ディレクティブではなく検証関数を使用して設定します。
* 各コントロールは、手動または 「FormBuilder」 で 「FormControl」 インスタンスを作成することによって、コンポーネントクラス内に明示的に作成されます。
* テンプレート入力要素は`ngModel`を使用しません。
* 関連するAngularディレクティブは、 「formControl」 、 「formGroup」 、 「formControlName」 などの 「form」 という接頭辞が付いています。

もう1つの方法は、テンプレート駆動型フォームです。両方式の導入と比較については、[Angular Formsの概要](guide/forms-overview)を参照。

{@a router}
{@a router-module}

## router

A tool that configures and implements navigation among states and [views](guide/glossary#view) within an Angular app.

The `Router` module is an [NgModule](guide/glossary#ngmodule) that provides the necessary service providers and directives for navigating through application views. A [routing component](guide/glossary#routing-component) is one that imports the `Router` module and whose template contains a `RouterOutlet` element where it can display views produced by the router.

The router defines navigation among views on a single page, as opposed to navigation among pages. It interprets URL-like links to determine which views to create or destroy, and which components to load or unload. It allows you to take advantage of [lazy loading](guide/glossary#lazy-load) in your Angular apps.

Angularアプリ内で状態間のナビゲーションと[ビュー](guide/glossary#view)を設定し実装するツール。

「ルーター」 モジュールは、アプリケーションビューをナビゲートするために必要なサービスプロバイダと指示を提供する[NgModule](uide/glossary#ngmodule)です。[routing component](guide/glossary#routing-component)は、 「ルータ」 モジュールをインポートするものであり、そのテンプレートは、ルータによって生成されたビューを表示することができる `RouterOutlet` 要素を含む。

ルーターは、ページ間のナビゲーションではなく、単一のページ上のビュー間のナビゲーションを定義します。URLに似たリンクを解釈して、作成または破棄するビュー、ロードまたはアンロードするコンポーネントを決定します。Angularアプリで[遅延ローディング](guide/glossary#lazy-load)を利用することができる。

To learn more, see [Routing and Navigation](guide/router).

{@a router-outlet}

## router outlet

A [directive](guide/glossary#directive) that acts as a placeholder in a routing component's template. Angular dynamically renders the template based on the current router state.

工順構成部品のテンプレートでプレースホルダとして機能する[directive](guide/glossary#directive)。Angularは、現在のルータの状態に基づいてテンプレートを動的にレンダリングします。

{@a router-component}

## routing component

An Angular [component](guide/glossary#component) with a `RouterOutlet` directive in its template that displays views based on router navigations.

テンプレートに `RouterOutlet` ディレクティブを持つAngular[component](guide/glossary#component)。ルータナビゲーションに基づいたビューを表示します。

For more information, see [Routing and Navigation](guide/router).

{@a rule}

In [schematics](#schematic), a function that operates on a [file tree](#file-tree) to create, delete, or modify files in a specific manner, and returns a new `Tree` object.

[schematics](#schematic)で、[ファイルツリー](#file-tree)上で特定の方法でファイルを作成、削除、または修正し、新しいオブジェクトを返す関数。


{@a S}

{@a schematic}

## schematic

A scaffolding library that defines how to generate or transform a programming project by creating, modifying, refactoring, or moving files and code.
A schematic defines [rules](#rule) that operate on a virtual file system called a [tree](#file-tree).
The [Angular CLI](guide/glossary#cli) uses schematics to generate and modify [Angular projects](guide/glossary#project) and parts of projects.

* Angular provides a set of schematics for use with the CLI. See the [Angular CLI command reference](cli). The [`ng add`](cli/add) command runs schematics as part of adding a library to your project. The [`ng generate`](cli/generate) command runs schematics to create apps, libraries, and Angular code constructs.

* [Library](#library) developers can use the [Schematics CLI](#schematics-cli) to create schematics that enable the Angular CLI to add and update their published libraries, and to generate artifacts the library defines.

   For more information, see [devkit documentation](https://www.npmjs.com/package/@angular-devkit/schematics).


ファイルとコードを作成、変更、リファクタリング、または移動することによって、プログラミングプロジェクトを生成または変換する方法を定義するスキャフォールドライブラリ。
回路図は、[rules](#rule)と呼ばれる仮想ファイルシステム上で動作する[ファイルツリー](#file-tree)を定義します。
[Angular　CLI](guide/glossary#cli)では、スケマティック表現を使用して、[Angular projects](ガイド/用語集#project)およびプロジェクトの一部を生成および修正します。

* AngularはCLIで使用するための一連の回路図を提供しています。[角度CLIコマンドリファレンス](cli)を参照してください。[`ng add`](cli/add)コマンドは、プロジェクトにライブラリを追加する一部として回路図を実行します。[「ng generate」 と入力します。](cli/generate)コマンドは、スケマティック表現を実行して、アプリケーション、ライブラリ、およびAngularコード構成を作成します。

* [ライブラリ](#library)の開発者は、[Schematics　CLI](#schematics-cli)を使用して、Angular CLIでパブリッシングされたライブラリを追加および更新できるようにする回路図を作成したり、ライブラリで定義されているアーティファクトを生成したりできます。

詳細については、[devkitドキュメント] (https://www.npmjs.com/package/@angular-devkit/schematics).を参照してください。

{@a schematics-cli}

## Schematics CLI

Schematics come with their own command-line tool.
Using Node 6.9 or above, install the Schematics CLI globally:

Schematicsには、独自のコマンド・ライン・ツールが付属しています。
ノード6.9以上を使用して、Schematics CLIをグローバルにインストールします。

<code-example format="." language="bash">
npm install -g @angular-devkit/schematics-cli
</code-example>

This installs the `schematics` executable, which you can use to create a new project, add a new schematic to an existing project, or extend an existing schematic.

これにより、新しいプロジェクトの作成、既存のプロジェクトへの新しい`schematics`の追加、または既存の`schematics`の拡張に使用できる`schematics`実行可能ファイルがインストールされます。

{@a scoped-package}

## scoped package

A way to group related [npm packages](guide/npm-packages).
NgModules are delivered within scoped packages whose names begin with the Angular *scope name* `@angular`. For example, `@angular/core`, `@angular/common`, `@angular/forms`, and `@angular/router`.

Import a scoped package in the same way that you import a normal package.

関連する[npmパッケージ](guide/npm-packages)をグループ化する方法。
NgModulesは、名前がAngular*scope name*`@angular`で始まるスコープ付きパッケージ内で配布されます。たとえば、`@angular/core`, `@angular/common`, `@angular/forms` 、および`@angular/router` です。

通常のパッケージをインポートする場合と同じ方法で、スコープ指定されたパッケージをインポートします。

<code-example path="architecture/src/app/app.component.ts" linenums="false" header="architecture/src/app/app.component.ts (import)" region="import">

</code-example>

{@a service}

## service

In Angular, a class with the [@Injectable()](guide/glossary#injectable) decorator that encapsulates non-UI logic and code that can be reused across an application.
Angular distinguishes components from services to increase modularity and reusability.

The `@Injectable()` metadata allows the service class to be used with the [dependency injection](guide/glossary#di) mechanism.
The injectable class is instantiated by a [provider](guide/glossary#provider).
[Injectors](guide/glossary#injector) maintain lists of providers and use them to provide service instances when they are required by components or other services.

Angularでは、非UIロジックとアプリケーション全体で再利用可能なコードをカプセル化する[@Injectable()](guide/glossary#injectable)デコレータを持つクラス。
Angularは,モジュール性と再利用性を向上させるために,コンポーネントとサービスを区別している。

`@Injectable()` メタデータを使用すると、サービス・クラスを[依存性注入](guide/glossary#di)メカニズムで使用することができます。
注入可能なクラスは、[プロバイダ](guide/glossary#provider)によってインスタンス化される。
[インジェクター](guide/glossary#injector)はプロバイダのリストを保持し、コンポーネントやその他のサービスで必要なサービスインスタンスを提供するために使用します。

To learn more, see [Introduction to Services and Dependency Injection](guide/architecture-services).

{@a structural-directive}
{@a structural-directives}

## structural directives

A category of [directive](guide/glossary#directive) that is responsible for shaping HTML layout by modifying the DOM&mdashthat is, adding, removing, or manipulating elements and their children.

[directive](guide/glossary#directive)のカテゴリ。DOMおよびmdashを変更して、要素とその子を追加、削除、または操作することで、HTMLレイアウトを形成します。

To learn more, see [Structural Directives](guide/structural-directives).

{@a subscriber}

## subscriber

A function that defines how to obtain or generate values or messages to be published. This function is executed when a consumer calls the `subscribe()` method of an [observable](guide/glossary#observable).

The act of subscribing to an observable triggers its execution, associates callbacks with it, and creates a `Subscription` object that lets you unsubscribe.

The `subscribe()` method takes a JavaScript object (called an [observer](guide/glossary#observer)) with up to three callbacks, one for each type of notification that an observable can deliver:

* The `next` notification sends a value such as a number, a string, or an object.
* The `error` notification sends a JavaScript Error or exception.
* The `complete` notification doesn't send a value, but the handler is called when the call completes. Scheduled values can continue to be returned after the call completes.

パブリッシュされる値またはメッセージを取得または生成する方法を定義する関数。この関数は、消費者が[observable](guide/glossary#observable)の`subscribe()'メソッドを呼び出したときに実行される。

observableにサブスクライブすると、observableの実行がトリガーされ、コールバックが関連付けられ、サブスクリプションを解除できる `Subscription`オブジェクトが作成されます。

`subscribe()`メソッドは、observableが配信できる通知のタイプごとにひとつずつ、最大三つのコールバックを持つJavaScriptオブジェクト((ガイド/用語集#observer)[観察者]と呼ばれています)を受け取ります。

* 「next」 通知は、数値、文字列、オブジェクトなどの値を送信します。
* 「error」 通知は、JavaScriptエラーまたは例外を送信します。
* 「complete」 通知は値を送信しませんが、呼び出しが完了するとハンドラが呼び出されます。コールが完了した後も、スケジュールされた値を引き続き返すことができます。

{@a T}
{@a template}

## template

Code associated with a component that defines how to render the component's [view](guide/glossary#view).

A template combines straight HTML with Angular [data-binding](guide/glossary#data-binding) syntax, [directives](guide/glossary#directive),
and [template expressions](guide/glossary#template-expression) (logical constructs).
The Angular elements insert or calculate values that modify the HTML elements before the page is displayed.

A template is associated with a [component](guide/glossary#component) class through the `@Component()` [decorator](guide/glossary#decorator). The HTML can be provided inline, as the value of the `template` property, or in a separate HTML file linked through the `templateUrl` property.

Additional templates, represented by `TemplateRef` objects, can define alternative or *embedded* views, which can be referenced from multiple components.

コンポーネントの[view]の描画方法を定義するコンポーネントに関連付けられたコード(guide/glossary#view)。

テンプレートは、単純なHTMLとAngular[データバインディング](guide/glossary#data-binding)構文、[ディレクティブ](guide/glossary#directive)、
[テンプレート式](guide/glossary#template-expression)(論理構造)などです。
Angular要素は、ページが表示される前にHTML要素を変更する値を挿入または計算します。

テンプレートは、`@Component`()[デコレーター](ガイド/用語集#decorator)を介して[構成部品](ガイド/用語集#コンポーネント)クラスに関連付けられます。HTMLは、 「template」 プロパティーの値としてインラインで提供することも、 「templateUrl」 プロパティーを介してリンクされた別のHTMLファイルで提供することもできます。

`TemplateRef`オブジェクトによって表される追加のテンプレートは、複数のコンポーネントから参照できる代替ビューまたは*埋め込み*ビューを定義できます。

{@a template-drive-forms}

## template-driven forms

A format for building Angular forms using HTML forms and input elements in the view.
The alternative format uses the [reactive forms](guide/glossary#reactive-forms) framework.

When using template-driven forms:

* The "source of truth" is the template. The validation is defined using attributes on the individual input elements.
* [Two-way binding](guide/glossary#data-binding) with `ngModel` keeps the component model synchronized with the user's entry into the input elements.
* Behind the scenes, Angular creates a new control for each input element, provided you have set up a `name` attribute and two-way binding for each input.
* The associated Angular directives are prefixed with `ng` such as `ngForm`, `ngModel`, and `ngModelGroup`.

ビュー内のHTMLフォームと入力要素を使用してAngularフォームを構築するためのフォーマット。
代替フォーマットは、[リアクティブフォーム](guide/glossary#data-binding)フレームワークを使用します。

テンプレート駆動フォームを使用する場合:

* 「真実の情報源」がテンプレートです。検証は、個々の入力要素の属性を使用して定義されます。
* [双方向バインド](guide/glossary#data-binding)と`ngModel`は、コンポーネントモデルをユーザの入力エレメントへのエントリと同期化します。
* Angularは舞台裏で`name`属性および双方向バインディングの設定をもつ各input要素のために、新しいコントロールを生成します。
* 関連するAngularディレクティブにはすべて`ng`接頭辞が付けられています。たとえば、`ngForm`、`ngModel`、そして`ngModelGroup`などです。

The alternative is a reactive form. For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms](guide/forms-overview).

{@a template-expression}

## template expression

A TypeScript-like syntax that Angular evaluates within a [data binding](guide/glossary#data-binding).

Read about how to write template expressions in  [テンプレート式](guide/template-syntax#template-expressions).

Angularが[データバインディング](guide/glossary#data-binding)内で評価するTypeScriptのような構文。

テンプレート式の記述方法については、[テンプレート式](guide/template-syntax#template-expressions)を参照してください。

{@a token}

## token

An opaque identifier used for efficient table lookup. In Angular, a [DI token](guide/glossary#di-token) is used to find [providers](guide/glossary#provider) of dependencies in the [dependency injection](guide/glossary#di) system.

効率的なテーブル検索に使用される不透明な識別子。Angularでは、[DIトークン](guide/glossary#di-token)を使用して[依存性注入](guide/glossary#di)システム内の依存関係の[プロバイダ](guide/glossary#provider)を検索します。

{@a transpile}

## transpile

The translation process that transforms one version of JavaScript to another version; for example, down-leveling ES2015 to the older ES5 version.

あるバージョンのJavaScriptを別のバージョンに変換する変換プロセスです。例えば、ES2015をES5の旧バージョンにダウンレベルします。

{@a file-tree}

## tree

In [schematics](#schematic), a virtual file system represented by the `Tree` class.
Schematic [rules](#rule) take a tree object as input, operate on them, and return a new tree object.

[schematics](#schematic)では、Treeクラスによって表される仮想ファイルシステム。
Schematic[rules](#rule)は、入力としてTreeオブジェクトを取り、それを操作して、新しいTreeオブジェクトを返します。

{@a typescript}

## TypeScript

A programming language based on JavaScript that is notable for its optional typing system.
TypeScript provides compile-time type checking and strong tooling support (such as
code completion, refactoring, inline documentation, and intelligent search).
Many code editors and IDEs support TypeScript either natively or with plug-ins.

TypeScript is the preferred language for Angular development.
Read more about TypeScript at [typescriptlang.org](http://www.typescriptlang.org/).

JavaScriptをベースにしたプログラミング言語で、オプションの型指定システムで知られている。
TypeScriptはコンパイル時の型チェックと強力なツールサポートを提供します (
コード補完、リファクタリング、インラインドキュメント、インテリジェント検索など)。
多くのコードエディタとIDEは、TypeScriptをネイティブまたはプラグインでサポートしています。

Angular開発においてTypeScriptは推奨される言語です。
TypeScriptの詳細については、[typescriptlang.org] (http://www.typescriptlang.org/)を参照してください。


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


一緒に作成および破棄できる表示要素の最小グループです。
Angularは一つ以上の[ディレクティブ](guide/glossary#directive)、特に[component](guide/glossary#component)ディレクティブとそれに付随する[テンプレート](guide/glossary#template)の制御下でビューをレンダリングします。

ビューは、特にコンポーネントに関連付けられた `ViewRef` インスタンスによって表されます。
コンポーネントに属するビューは、*ホストビュー* と呼ばれます。
ビューは通常、[ビュー階層](guide/glossary#view-tree)に収集されます。

ビュー内の要素のプロパティは、ユーザのアクションに応じて動的に変更できます。
ビュー内の要素の構造(番号順)はできません。
要素の構造を変更するには、ビューコンテナ内でネストされたビューを挿入、移動、削除します。

ビュー階層は、ユーザーがアプリケーション内をナビゲートするときに動的にロードおよびアンロードでき、通常は[ルーター](guide/glossary#router)の制御下にあります。

{@a view-tree}

## view hierarchy

A tree of related views that can be acted on as a unit. The root view is a component's *host view*.  A host view can be the root of a tree of *embedded views*, collected in a *view container* (`ViewContainerRef`) attached to an anchor element in the hosting component. The view hierarchy is a key part of Angular change detection.

The view hierarchy doesn't imply a component hierarchy. Views that are embedded in the context of a particular hierarchy can be host views of other components. Those components can be in the same NgModule as the hosting component, or belong to other NgModules.

1つの単位として機能する関連ビューのツリー。ルートビューは、コンポーネントの*ホストビュー*です。ホストビューは、ホストコンポーネントのアンカー要素にアタッチされた*ビューコンテナ*(`ViewContainerRef')に収集された*埋め込みビュー*のツリーのルートにすることができます。ビュー階層は、角度変化検出の重要な部分です。

ビュー階層は、コンポーネント階層を示すものではありません。特定の階層のコンテキストに埋め込まれたビューは、他のコンポーネントのホストビューにすることができます。これらのコンポーネントは、ホストコンポーネントと同じNgModule内にあっても、他のNgModuleに属していてもかまいません。

{@a W}
{@a web-component}

## web component

See [custom element](guide/glossary#custom-element).


[カスタムエレメント](guide/glossary#custom-element)を参照してください。

{@a workspace}

## workspace

In Angular, a folder that contains [projects](guide/glossary#project) (that is, apps and libraries).
The [CLI](guide/glossary#cli) `ng new` command creates a workspace to contain projects.
Commands that create or operate on apps and libraries (such as `add` and `generate`) must be executed from within a workspace folder.

Angularで、[projects](guide/glossary#project)(つまり、アプリケーションとライブラリ)を含むフォルダ。
[CLI](guide/glossary#cli)`ng new`コマンドは、プロジェクトを含むワークスペースを作成します。
アプリケーションおよびライブラリ(`add`や`generate`など)を作成または操作するコマンドは、作業領域フォルダ内から実行する必要があります。

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

一連の非同期タスクの実行コンテキスト。イベント処理、promise、リモートサーバーへの呼び出しなどの非同期操作を含むアプリケーションのデバッグ、プロファイリング、およびテストに役立ちます。

AngularアプリはZone内で動作し、データの変更をチェックし、[データバインディング](guide/glossary#data-binding)を解決することで表示される情報を更新することで非同期イベントに応答できます。

Zoneクライアントは、非同期操作の前後にアクションを実行できます。

Zoneの詳細については、ここを参照してください。
[Brian Fordのビデオ] (https://www.youtube.com/watch?v=3IqtmUscE_U)
