# Angular用語集

Angularには独自の用語があります。
ほとんどのAngularの用語は、
Angularシステムの中で特別な意味をもつ常用英単語です。

ここには主要な用語といくつかのあまり馴染みのない用語を集めています。

[A](guide/glossary#A) [B](guide/glossary#B) [C](guide/glossary#C) [D](guide/glossary#D) [E](guide/glossary#E) [F](guide/glossary#F) [G](guide/glossary#G) [H](guide/glossary#H) [I](guide/glossary#I)
[J](guide/glossary#J) [K](guide/glossary#K) [L](guide/glossary#L) [M](guide/glossary#M) [N](guide/glossary#N) [O](guide/glossary#O) [P](guide/glossary#P) [Q](guide/glossary#Q) [R](guide/glossary#R)
[S](guide/glossary#S) [T](guide/glossary#T) [U](guide/glossary#U) [V](guide/glossary#V) [W](guide/glossary#W) [X](guide/glossary#X) [Y](guide/glossary#Y) [Z](guide/glossary#Z)


{@a A}
{@a aot}


## Ahead-of-time (AOT) compilation
_事前コンパイル_

Angular ahead-of-time（AOT）コンパイラは、ブラウザがコードをダウンロードして実行する前に、
Angular HTMLとTypeScriptコードをビルド段階で効率的なJavaScriptコードに変換します。
これは、運用環境での最適なコンパイルモードであり、
ロード時間の短縮とパフォーマンスの向上を実現します。

`ngc`コマンドラインツールを使用してアプリケーションをコンパイルすると、モジュールファクトリに直接ブートストラップすることができます。つまり、JavaScriptバンドルにAngularコンパイラを含める必要はありません。

[just-in-time (JIT) コンパイル](guide/glossary#jit)と比較してください。

## Angular element

[Custom Elements](guide/glossary#custom-element)としてパッケージされたAngularの[コンポーネント](guide/glossary#component)。

[_Angular Elements_](guide/elements)ガイドを参照してください。

## Annotation
_アノテーション_

クラスのメタデータを提供する構造体。[デコレーター](guide/glossary#decorator)を参照してください。


{@a attribute-directive}


{@a attribute-directives}


## Attribute directives
_属性ディレクティブ_

[ディレクティブ](guide/glossary#directive)の一種で、他のHTML要素、属性、プロパティやコンポーネントの振る舞いを監視し、変更することができます。その名前のとおり、通常これらはHTML属性として現れます。

[_属性ディレクティブ_](guide/attribute-directives)ガイドで詳しく学びましょう。


{@a B}


## Binding
_バインディング_

一般に、変数またはプロパティをデータ値に設定する方法です。
Angular内では、通常、DOMオブジェクトのプロパティと
データオブジェクトのプロパティを調整する[データバインディング](guide/glossary#data-binding)を指します。

また、"トークン"または"キー" と依存性の[プロバイダー](guide/glossary#provider)との間を結びつける、[依存性の注入](guide/glossary#dependency-injection)を指すこともあります。

## Bootstrap
_ブートストラップ_

アプリやシステムを初期化して起動する方法です。

Angularでは、アプリケーションのルートNgModule（`AppModule`）には、アプリケーションのトップレベル[コンポーネント](guide/glossary#component)を識別する`bootstrap`プロパティがあります。
ブートストラッププロセス中、Angularはこれらのコンポーネントを作成して`index.html`ホストWebページに挿入します。
同じ`index.html`に複数のアプリケーションをブートストラップすることができます。各アプリケーションには独自のコンポーネントがあります。

詳しくは、[_ブートストラップ_](guide/bootstrapping)ガイドを参照してください。

{@a C}

{@a case-conventions}
{@a dash-case}
{@a camelcase}
{@a kebab-case}

## Case conventions
_ケースの慣習_

Angularでは、[スタイルガイドの「命名」セクション](guide/styleguide#02-01)で説明しているように、さまざまな型の名前を区別するために大文字と小文字を区別します。

- camelCase : シンボル、プロパティ、メソッド、パイプ名、コンポーネントではないディレクティブのセレクタ、定数
- UpperCamelCase (or PascalCase): コンポーネント、インターフェース、NgModule、ディレクティブ、パイプなどを定義するクラスを含むクラス名
- dash-case (or "kebab-case"): ファイル名の記述部分、コンポーネントセレクタ
- underscore_case (or "snake_case"): 通常はAngularでは使われません
- UPPER_UNDERSCORE_CASE (or UPPER_SNAKE_CASE): 伝統的な定数（許容されますが、camelCaseを好みます）

{@a class-decorator}

## Class decorator
_クラスデコレーター_

指定された型のクラスを宣言し、その型に適したメタデータを提供するクラス定義の直前の[デコレーター](guide/glossary#decorator)ステートメント。

次のクラスタイプを宣言できます。
- `@Component`
- `@Directive`
- `@Pipe`
- `@Injectable`
- `@NgModule`


{@a class-field-decorator}

## Class field decorator
_クラスフィールドデコレーター_

そのフィールドの型を宣言するクラス定義内のフィールドの直前の[デコレーター](guide/glossary#decorator)ステートメント。`@Input`や`@Output`が一例です。

## CLI

[Angular CLI](https://cli.angular.io/)はプロジェクトの作成やファイルの追加、そしてテスト、バンドル、デプロイなど、さまざまな進行中の開発タスクを実行する `コマンドラインインターフェース`です。

詳しくは[クイックスタート](guide/quickstart) ガイドを参照してください。

{@a component}

## Component
_コンポーネント_

`@Component`[デコレーター](guide/glossary#decorator)をもつクラスで、これを対応する[テンプレート](guide/glossary#template)に関連付けます。 

コンポーネントは[ビュー](guide/glossary#view)を表す特別な型の[ディレクティブ](guide/glossary#directive)です。`@Component`デコレーターは`@Directive`デコレーターをテンプレート指向の機能で拡張します。

Angularコンポーネントクラスは、データを公開し、[データバインディング](guide/glossary#data-binding)を通じてビューの表示とユーザー対話ロジックの大半を処理します。

コンポーネント、テンプレート、およびビューの詳細については、[アーキテクチャ](guide/architecture)ガイドを参照してください。

{@a custom-element}

## Custom element
_カスタム要素_

現在、ほとんどのブラウザでサポートされており、他のブラウザでもpolyfillによって使用可能なWebプラットフォーム機能です（[ブラウザサポート](guide/browser-support)を参照）

カスタム要素機能は、JavaScriptコードによってコンテンツが作成および制御されるタグを定義できるようにすることで、HTMLを拡張します。カスタム要素（*Webコンポーネント*とも呼ばれます）は、[CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry)に追加されるときにブラウザによって認識されます。

APIを使用してAngularコンポーネントを変換し、ブラウザに登録し、Angularアプリ内のDOMに直接追加するHTMLで使用できるようにすることができます。カスタム要素タグは、変更検知およびデータバインディング機能を備えたコンポーネントのビューを、Angular処理なしで表示されるコンテンツに挿入します。

[動的コンポーネント](guide/glossary#dynamic-components)も参照してください。


{@a D}

## Data binding
_データバインディング_

データバインディングは、アプリケーションがデータの値をユーザーに表示し、ユーザーからのアクション(クリック、タッチ、キーストローク)に反応できるようにします。

データバインディングにおいて、HTMLウィジェットとアプリケーションデータソースの間の関係を定義することで、フレームワークが詳細を処理します。
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

## Declarable

[NgModule](guide/glossary#ngmodule)の`declarations`リストに追加できるクラス型です。

[コンポーネント](guide/glossary#component)、[ディレクティブ](guide/glossary#directive)、および[パイプ](guide/glossary#pipe)を宣言できます。

次のものを宣言しないでください
- 別のNgModuleですでに宣言されているクラス。
- 別のパッケージからインポートされたディレクティブの配列。たとえば、`@angular/forms`の`FORMS_DIRECTIVES`を宣言しないでください。
- NgModuleクラス。
- サービスクラス。
- 文字列、数値、関数、エンティティモデル、設定、ビジネスロジック、ヘルパークラスなどAngularと関係のないクラスとオブジェクト


{@a decorator}

{@a decoration}


## Decorator | decoration
_デコレーター | デコレーション_

直後のクラスまたはプロパティの定義を変更する関数。
デコレーター（アノテーションとも呼ばれる）は、実験的な（ステージ2の）JavaScript言語[機能](https://github.com/wycats/javascript-decorators)です。
TypeScriptはデコレーターのサポートを追加します。

Angularは、メタデータをクラスやプロパティに付与して、そのクラスやプロパティの意味や動作の仕方を知るデコレーターを定義します。

[クラスデコレータ](guide/glossary#class-decorator)、[クラスフィールドデコレーター](guide/glossary#class-field-decorator)を参照してください。

{@a di}


## Dependency injection
_依存性の注入_

依存性の注入は、アプリケーションの部品に求められた部品を作って送り届けるためのデザインパターンでありメカニズムです。

Angularでは、依存関係は通常はサービスですが、文字列や関数などの値でもあります。アプリケーションの[インジェクター](guide/glossary#injector)（ブートストラップ時に自動的に作成される）は、サービスまたは値の登録[プロバイダー](guide/glossary#provider)を使用して、必要に応じて依存関係を作成します。異なるプロバイダーは、同じサービスの異なる実装を提供することができます。

詳しく知るには[依存性の注入](guide/dependency-injection)ガイドを参照してください。

{@a di-token}

## DI token
_DIトークン_

[依存性の注入](guide/glossary#di) システムで使用する依存関係[プロバイダ](guide/glossary#provider)に関連付けられたルックアップ用のトークン。


{@a directive}


{@a directives}


## Directive
_ディレクティブ_

DOMの構造を変更したり、DOMやコンポーネントのデータモデルの属性を変更したりすることができる`@Directive`[デコレータ](guide/glossary#decorator)をもつクラスです。

ディレクティブクラスは通常、HTML要素または属性に関連付けられ、その要素または属性はしばしばディレクティブそのものとして参照されます。
AngularがHTML[テンプレート](guide/glossary#template)でディレクティブを検出すると、対応するディレクティブクラスインスタンスが作成され、ブラウザDOMのその部分にインスタンスコントロールが与えられます。

ディレクティブには次の3つのカテゴリがあります。
- [コンポーネント](guide/glossary#component)は、テンプレートをクラスに関連付けるために`@Component`（`@Directive`の拡張）を使用します。
- [属性ディレクティブ](guide/glossary#attribute-directive)は、ページ要素の動作と外観を変更します。
- [構造ディレクティブ](guide/glossary#structural-directive)は、DOMの構造を変更します。

Angularは`ng`接頭辞で始まるいくつかの組込みディレクティブを提供します。新しいディレクティブを作成して、独自の機能を実装することもできます。
_セレクタ_（たとえば`<my-directive>`のようなHTMLタグ）をカスタムディレクティブに関連付けて、アプリケーションで使用できる[テンプレート構文](guide/template-syntax)を拡張します。


## Domain-specific language (DSL)
_ドメイン固有言語_

特別な目的のライブラリまたはAPI。[ドメイン固有言語](https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E5%9B%BA%E6%9C%89%E8%A8%80%E8%AA%9E)を参照してください。

Angularは、[アニメーション](guide/animations)、[フォーム](guide/forms)、[ルーティング、ナビゲーション](guide/router).などのngModuleで定義されたAngularアプリケーションに関連するいくつかのドメインに対して、ドメイン固有の言語でTypeScriptを拡張します。

{@a dynamic-components}

## Dynamic component loading
_動的コンポーネント読み込み_

コンポーネントをコンパイルから除外し、DOMに追加するときにAngularの変更検知およびイベント処理フレームワークに接続する必要があるコンポーネントを実行時にDOMに追加する手法。

同じ結果でより簡単なパスを提供する[カスタム要素](guide/glossary#custom-element)も参照してください。

{@a E}

{@a ecma}

## ECMAScript

[公式のJavaScriptの言語仕様](https://ja.wikipedia.org/wiki/ECMAScript)です。

すべてのブラウザが最新のECMAScript標準をサポートしているわけではありませんが、[TypeScript](guide/glossary#typescript)のような[トランスパイラ](guide/glossary#transpile)を使用して最新の機能を使用してコードを書くことができ、ブラウザでサポートされているバージョンで動作するコードに変換されます。

詳細については、[ブラウザサポート](guide/browser-support)のページを参照してください。

{@a element}

## Element
_要素_

Angularは、レンダー固有のネイティブUIエレメントをラップする`ElementRef`クラスを定義します。これにより、Angularテンプレートとデータバインディングを使用して、ほとんどの場合、ネイティブ要素を参照せずにDOM要素にアクセスできます。

このドキュメンテーションは、一般的に要素（`ElementRef`インスタンス）またはDOM要素（必要に応じて直接アクセスできる）のいずれかを参照します。

[カスタム要素](guide/glossary#custom-element)と比較しましょう。

## Entry point
_エントリポイント_

NPMパッケージの一部を他のコードでインポートできるようにするJavaScript ID。
Angularの[スコープ化パッケージ](guide/glossary#scoped-package)にはそれぞれ、`index`という名前の付いたエントリポイントがあります。

Angularでは、[NgModule](guide/glossary#ngmodule)を使用して同じ結果を得ます。


{@a F}


{@a G}


{@a H}

{@a I}

{@a injectable}

## Injectable

[依存性の注入](guide/glossary#di)メカニズムを使用して依存性を提供するAngularクラスまたはその他の定義。注入可能なクラスは`@Injectable`[デコレータ](guide/glossary#decorator)によってマークされます。

[サービス](guide/glossary#service)とそのサービスに依存する[コンポーネント](guide/glossary#component)の両方をinjectableとしてマークする必要があります。定数値などの他の項目もinjectableになります。

{@a injector}

## Injector
_インジェクター_

Angularの[依存性の注入システム](guide/glossary#dependency-injection)におけるオブジェクトで、
指定された"依存性"をキャッシュから見つけるか、登録された[プロバイダー](guide/glossary#provider)を使用して生成できます。
インジェクタはブートストラッププロセスの一部として自動的にNgModule用に作成され、コンポーネント階層を継承します。

## Input
_インプット_

[ディレクティブ](guide/glossary#directive)を定義するとき、ディレクティブプロパティ上の`@Input`デコレーターは、
そのプロパティを[プロパティバインディング](guide/template-syntax#property-binding)の*ターゲット*として使用できるようにします。
データ値は、[テンプレート式](guide/glossary#template-expression)で識別されたデータソースから
入力プロパティに等号の右側に流れます。

詳細は、[インプット・アウトプットプロパティ](guide/template-syntax#inputs-outputs)を参照してください。


## Interpolation
_補間_

[プロパティデータバインディング](guide/glossary#data-binding)の一形態で、その二重波括弧の間の[テンプレート式](guide/glossary#template-expression)の結果を、テキストとしてレンダリングします。
そのテキストは、要素のプロパティに割り当てられるか、この例のように要素のタグの間で表示される前に、隣接したテキストに連結できます。

<code-example language="html" escape="html">
  <label>My current hero is {{hero.name}}</label>

</code-example>


補間についての詳細は[テンプレート構文](guide/template-syntax) ページの[補間](guide/template-syntax#interpolation)のセクションを参照してください。

{@a J}

## JavaScript

[ECMAScript](guide/glossary#ecma)、[TypeScript](guide/glossary#typescript)を参照してください。


{@a jit}


## Just-in-time (JIT) compilation
_実行時コンパイラ_

Angular Just-In-Time（JIT）コンパイラは、起動時にAngular HTMLとTypeScriptコードを実行時に効率的なJavaScriptコードに変換します。
Angularの`ng build`と`ng serve`CLIコマンドを実行するときのJITコンパイルはデフォルトであり、開発中には適切な選択です。JITモードは、ブートストラップのパフォーマンスを妨げる大規模なアプリケーションペイロードが発生するため、本番用として使用することは強く反対します。

[AoTコンパイル](guide/glossary#aot)と比較しましょう。

{@a K}


{@a L}

{@a lazy-load}

## Lazy loading
_遅延ロード_

遅延ロードは、アプリケーションを複数のバンドルに分割し、必要に応じてロードすることで、アプリケーションのロード時間を短縮します。
たとえば、ルートモジュールで必要とされる"eager-loaded"モジュールとは対照的に、必要に応じて依存関係を遅延ロードすることができ、起動時にロードされます。
同様に、[ルーター](guide/glossary#router)は親ビューがアクティブになっているときのみ子ビューをロードでき、必要に応じて角度アプリにロードできるカスタム要素を作成できます。

## Lifecycle hook
_ライフサイクルフック_

[ディレクティブ](guide/glossary#directive)と[コンポーネント](guide/glossary#component)が作成、更新、および破棄されるときに、ディレクティブとコンポーネントのライフサイクルに入ることを可能にするインターフェイス。

開発者は、ひとつかそれ以上の ライフサイクルフックインターフェイスを実装することで、そのライフサイクル中の重要な瞬間に介入することができます。

それぞれのインターフェイスは、 `ng`という接頭語でインターフェースを名前付けされた、ひとつのフックメソッドを持っています。
たとえば、`OnInit`インターフェースは`ngOnInit`という名前のフックメソッドを持っています。

Angularはこれらのフック関数を次の順序で呼び出します。

* `ngOnChanges`: [インプット](guide/glossary#input)/[アウトプット](guide/glossary#output)に紐付いている値が変わった時
* `ngOnInit`: 最初の`ngOnChanges`の後
* `ngDoCheck`: 開発者による任意の変更検知
* `ngAfterContentInit`: コンポーネントのコンテンツの初期化後
* `ngAfterContentChecked`: コンポーネントのコンテンツのチェック後、毎回
* `ngAfterViewInit`: コンポーネントのビュー初期化後
* `ngAfterViewChecked`: コンポーネントのビューをチェック後、毎回
* `ngOnDestroy`: ディレクティブが破棄される直前

詳細は[ライフサイクルフック](guide/lifecycle-hooks)のページを参照してください。


{@a M}

## Module
_モジュール_

一般に、モジュールは単一の目的専用のコードブロックを収集します。Angularは標準のJavaScriptモジュールを使用し、Angularモジュール、つまり`NgModule`も定義します。

JavaScript（ECMAScript）では、各ファイルはモジュールであり、ファイルに定義されているすべてのオブジェクトはそのモジュールに属します。オブジェクトをエクスポートしてパブリックにすることができ、パブリックオブジェクトを他のモジュールで使用するためにインポートすることができます。

AngularはJavaScriptモジュールまたはライブラリのコレクションとして提供されます。Angularの各ライブラリ名は`@angular`接頭辞で始まります。それらをNPMパッケージマネージャーにインストールし、JavaScriptの`import`宣言でそれらの一部をインポートします。

Angularの[NgModule](guide/glossary#ngmodule)と比較しましょう。


{@a N}

{@a ngmodule}

## NgModule

`@NgModule`[デコレータ](guide/glossary#decorator)をもつクラス定義。アプリケーションドメイン、ワークフロー、または密接に関連する一連の機能専用のコードブロックのマニフェストとして宣言され、機能します。

[JavaScriptモジュール](guide/glossary#module)と同様に、NgModuleは他のNgModuleで使用するための機能をエクスポートし、他のNgModuleからパブリック機能をインポートできます。

NgModuleクラスのメタデータは、アプリケーションが使用するコンポーネント、ディレクティブ、およびパイプをインポートおよびエクスポートのリストとともに収集します。[Declarable](guide/glossary#declarable)も参照してください。

NgModuleは、通常、エクスポートされたものが定義されているファイルの名前が付けられます。たとえば、Angularの[DatePipe](api/common/DatePipe)クラスは`date_pipe.ts`ファイル内で指定された`date_pipe`フィーチャモジュールに属します。あなたは`@angular/core`などのAngularの[スコープ化パッケージ](guide/glossary#scoped-package)からそれらをインポートします。

すべてのAngularアプリケーションにはルートモジュールがあります。慣例により、そのクラスは`AppModule`と呼ばれ、`app.module.ts`.と名づけられる名前付きのファイルに属します。

詳細は[NgModules](guide/ngmodules)ガイドを参照してください。


{@a O}

{@a observable}

## Observable

複数の値を作成し、[サブスクライバ](guide/glossary#subscriber)にプッシュします。Angularの非同期イベント処理に使用されます。`subscribe()`メソッドでサブスクライブし、新しい値、エラー、または完了の通知のためのコールバックを渡して、Observableを実行します。

Observableは、任意の型の単一または複数の値を同期的に（関数が呼び出し元に値を渡すとき）、またはスケジュールにしたがって、サブスクライバーに配信できます。サブスクライバーは、新しい値が生成されたとき、およびエラーまたは正常終了の通知を受け取ります。

Angularは、[Reactive Extensions (RxJS)](http://reactivex.io/rxjs/)というサードパーティのライブラリを使用します。 

詳細は[Observables](guide/observables)ガイドを参照してください。


{@a observer}

## Observer
_オブザーバー_

[サブスクライバ](guide/glossary#subscriber)のコールバックを定義する[Observable](guide/glossary#observable)の`subscribe()`メソッドに渡されるオブジェクト。

## Output
_アウトプット_

[ディレクティブ](guide/glossary#directive)を定義するとき、ディレクティブプロパティ上の`@Output`デコレーターは、そのプロパティを[イベントバインディング](guide/template-syntax#event-binding)の*ターゲット*として使用できるようにします。

イベントストリームは、このプロパティから、
等号の右側の[テンプレート式](guide/glossary#template-expression)で識別される受信者に*発信*されます。

詳細は[インプット・アウトプットプロパティ](guide/template-syntax#inputs-outputs)を参照してください。

{@a P}

## Pipe
_パイプ_

[ビュー](guide/glossary#view)に表示するために入力値を出力値に変換する関数を定義する`@Pipe`デコレーターをもつクラスです。

Angularはさまざまなパイプを定義していて、さらに新しいパイプを定義できます。

詳細は[パイプ](guide/pipes)のページを参照してください。

## Polyfill

ブラウザのJavaScriptの実装のギャップを埋める[NPMパッケージ](guide/npm-packages)。特定のプラットフォームで特定の機能をサポートするポリフィルについては、[ブラウザサポートガイド](guide/browser-support) を参照してください。

## Provider
_プロバイダー_

注入可能なサービスのプロバイダー&mdash;具体的には、[DIトークン](guide/glossary#token)に関連付けられたコードレシピ。[インジェクタ](guide/glossary#injector)は、それを必要とするクラスの依存関係の新しいインスタンスを作成するために使用します。

Angularは、Angularが定義するサービスのために、すべてのインジェクタに独自のプロバイダーを登録します。あなたのアプリが必要とするサービスのためにあなた自身のプロバイダーを登録することができます。

[サービス](guide/glossary#service)、[依存性の注入](guide/glossary#di)も参照してください。


{@a Q}

{@a R}

## Reactive forms
_リアクティブフォーム_

Angularのフォームをコンポーネントのコードを通じて組み立てる技法です。
別の技法としては[テンプレート駆動フォーム](guide/glossary#template-driven-forms)があります。

リアクティブフォームを組み立てる際、

* その"真実の情報源"はコンポーネントです。バリデーションはそのコンポーネントのコードを使用して定義されます。
* それぞれのコントロールはそのコンポーネントのクラスにおいて、`new FormControl()`もしくは`FormBuilder`を使って明示的に生成されます。
* そのテンプレートのinput要素は`ngModel`を使用*しません*。
* 関連するAngularディレクティブにはすべて`Form`接頭辞が付けられています。たとえば、`FormGroup`、 `FormControl`、 そして`FormControlName`などです。

リアクティブフォームは強力で柔軟なので、より複雑なデータ入力をするフォームの場合には最適です。
たとえば、動的にフォームのコントロールを生成するような場合などです。


## Router
_ルーター_

Angularアプリ内の状態と[ビュー](guide/glossary#view)間のナビゲーションを設定および実装するツール。

ルーターモジュールは、アプリケーションビューをナビゲートするために必要なサービスプロバイダーとディレクティブを提供する[NgModule](guide/glossary#ngmodule)です。[ルーティングコンポーネント](guide/glossary#routing-component)は、ルーターモジュールをインポートし、ルーターによって生成されるビューを表示することができる`RouterOutlet`要素をそのテンプレートに含みます。
 
ルーターはページ間のナビゲーションではなく、単一のページ上のビュー間のナビゲーションを定義します。URLのようなリンクを解釈して、どのビューを作成または破棄し、どのコンポーネントをロードまたはアンロードするかを決定します。これはあなたのAngularアプリで[遅延ロード](guide/glossary#lazy-load)を利用できるようにします。

詳細は、[ルーティングとナビゲーション](guide/router)のページを参照してください。

## Router module
_ルーターモジュール_

アプリケーションのビューの間を移動するのに必要なサービスプロバイダーおよびディレクティブを提供する、独立した[Angularモジュール](guide/glossary#ngmodule)です。

詳細は、[ルーティングとナビゲーション](guide/router)のページを参照してください。

## Router outlet
_ルーターアウトレット_

ルーティングコンポーネントのテンプレートのプレースホルダとして機能するディレクティブで、Angularはそれを現在のルーターの状態に基づいて動的に設定します。

## Routing component
_ルーティングコンポーネント_

ルーターのナビゲーションに基づきビューを表示する`RouterOutlet`を備えたAngular [コンポーネント](guide/glossary#component)です。

詳細は、[ルーティングとナビゲーション](guide/router)のページを参照してください。


{@a S}

## Scoped package
_スコープ化パッケージ_

関連するNPMパッケージをグループ化する方法。
NgModuleは、名前がAngularの*スコープ名*`@angular`で始まる*スコープ化パッケージ*内で配信されます。たとえば、`@angular/core`、`@angular/common`、`@angular/http`や`@angular/router`。

通常のパッケージをインポートするのと同じ方法でスコープされたパッケージをインポートします。

<code-example path="architecture/src/app/app.component.ts" linenums="false" title="architecture/src/app/app.component.ts (import)" region="import">

</code-example>


## Service
_サービス_

Angularでは、サービスは、アプリケーション全体で再利用できる非UIロジックとコードをカプセル化する[@Injectable](guide/glossary#injectable)デコレーターをもつクラスです。
Angularは、モジュール性と再利用性を高めるためにコンポーネントをサービスと区別します。

`@Injectable`メタデータは、[依存性の注入](guide/glossary#di)メカニズムによってサービスクラスを使えるようにします。injectableクラスは[プロバイダ](guide/glossary#provider)によってインスタンス化され、モジュールは、コンポーネントまたはそれを必要とするその他のサービスの必要に応じて、特定のタイプのサービスを提供できるプロバイダーのリストを保持します。

詳細は[サービスの概要](guide/architecture-services)を参照してください。

{@a structural-directive}


{@a structural-directives}


## Structural directives
_構造ディレクティブ_

DOMを変更する（要素とその子を追加、削除、または操作する）ことによって、HTMLレイアウトの形成と再形成を担当する[ディレクティブ](guide/glossary#directive)の一種。

詳細は[構造ディレクティブ](guide/structural-directives)を参照してください。

{@a subscriber}

## Subscriber
_サブスクライバー_

発行する値やメッセージを取得または生成する方法を定義する関数。この関数は、消費者が[Observable](guide/glossary#observable)の`subscribe()`メソッドを呼び出すときに実行されます。

Observableをサブスクライブすると、その実行がトリガされ、コールバックが関連付けられ、サブスクライブを解除できる`Subscription`オブジェクトが作成されます。

この`subscribe()`メソッドは、observableが提供できる通知の種類ごとに1つずつ、最大3つのコールバックをもつJavaScriptオブジェクト（「オブザーバー」と呼ばれる）を取ります。

- `next`通知は数値や文字列、オブジェクトのような値を送信します。
- `error`通知は JavaScriptエラーや例外を送信します。
- `complete`通知は値を送信しませんが、呼び出しが完了したときにハンドラが呼び出されます。コールが完了すると、スケジュールされた値が引き続き返されます。

{@a T}

## Template
_テンプレート_

テンプレートはHTMLでコンポーネントの[ビュー](guide/glossary#view)をレンダリングする方法を定義します

テンプレートは、HTMLとAngularの[データバインディング構文](guide/glossary#data-binding)、[ディレクティブ](guide/glossary#directive)、および[テンプレート式](guide/glossary#template-expression)（論理構造）を直接結合します。Angularの要素は、ページが表示される前にHTML要素を変更する値を挿入または計算します。
 
テンプレートは `@Component`[デコレータ](guide/glossary#decorator).を介して[コンポーネント](guide/glossary#component)クラスに関連付けられます。HTMLは、`template`プロパティの値としてインラインで、または`templateUrl`プロパティを介してリンクされた別のHTMLファイルで提供できます。

`TemplateRef`オブジェクトで表される追加のテンプレートは、複数のコンポーネントから参照できる代替ビューまたは _埋め込み_ ビューを定義できます。

## Template-driven forms
_テンプレート駆動フォーム_


ビューにおいてHTMLのフォームとinput要素を使用してAngularのフォームを組み立てる技法です。
別の技法としては[リアクティブフォーム](guide/glossary#reactive-forms)があります。

テンプレート駆動フォームを組み立てる際、

* "真実の情報源"はテンプレートです。バリデーションは個々のinput要素の属性を使用して定義されます。
* `ngModel`を用いた[双方向バインディング](guide/glossary#data-binding)が、コンポーネントのモデルとユーザーによるinput要素への入力との同期を維持します。
* 舞台裏では、Angularは`name`属性および双方向バインディングの設定をもつ各input要素のために、新しいコントロールを生成します。
* 関連するAngularディレクティブにはすべて`ng`接頭辞が付けられています。たとえば、`ngForm`、`ngModel`、そして`ngModelGroup`などです。

テンプレート駆動フォームは便利で短時間で作成でき、そして単純なので、多数の基本的なデータ入力をするフォームの場合にはよい選択です。

テンプレート駆動フォームを組み立てる方法の詳細は、[フォーム](guide/forms)のページを参照してください。

{@a template-expression}


## Template expression
_テンプレート式_

A TypeScript-like syntax that Angular evaluates within
a [data binding](guide/glossary#data-binding).

テンプレート式は、Angularが[データバインディング][data binding](guide/glossary#data-binding)の内部で評価する、TypeScriptに似た構文です。

テンプレート式を記述する方法の詳細は、[テンプレート構文](guide/template-syntax)ページの[テンプレート式](guide/template-syntax#template-expressions)の項を参照してください。

{@a token}

## Token
_トークン_

効率的なテーブル参照に使用される不透明な識別子。Angularでは、[DIトークン](guide/glossary#di-token)を使用して[依存性の注入](guide/glossary#di)システムの中で依存関係の[プロバイダ](guide/glossary#provider)を検索します。

{@a transpile}

## Transpile
_トランスパイル_

あるバージョンのJavaScriptを別のバージョンに変換する変換プロセス。たとえば、ES2015を古いES5バージョンにダウンレベリングします。


{@a typescript}

## TypeScript

TypeScriptはコンパイル時の型チェックと
強力なツールサポート（コード補完、リファクタリング、インラインドキュメンテーション、インテリジェントな検索など）を提供する、
オプションのタイピングシステムに特筆すべきプログラミング言語です。
多くのコードエディタとIDEは、ネイティブまたはプラグインでTypeScriptをサポートしています。

TypeScriptは、Angular開発のための推奨言語です。TypeScriptについての詳細は、[typescriptlang.org](http://www.typescriptlang.org/).を参照してください。


{@a U}

{@a V}

## View
_ビュー_

ビューは、一緒に作成および破棄できる表示要素の最小グループです。

Angularは、1つ以上の[ディレクティブ](guide/glossary#directive)、
特に [コンポーネント](guide/glossary#component)ディレクティブとその[テンプレート](guide/glossary#template)の制御下にあるビューをレンダリングします。

ビューは、コンポーネントに関連付けられた`ViewRef`インスタンスによって具体的に表されます。
コンポーネントに属するビューは_ホストビュー_と呼ばれます。
ビューは、通常、[ビュー階層](guide/glossary#view-tree)に収集されます。

ビュー内の要素のプロパティは、ユーザーの操作に応じて動的に変更できます。ビュー内の要素の構造（番号と順序）はできません。ビューコンテナ内にネストされたビューを挿入、移動、または削除することによって、要素の構造を変更できます。

ビューの階層は、ユーザーがアプリケーションを通してナビゲートする際に、通常は[ルーター](guide/glossary#router)の制御下で、動的にロードおよびアンロードすることができます。

{@a view-tree}

## View hierarchy
_ビュー階層_

1つの単位として実行できる関連ビューのツリー。ルートビューはコンポーネントの_ホストビュー_です。ホストビューは、ホストコンポーネントのアンカー要素に添付された_ビューコンテナ_（`ViewContainerRef`）に集められた、_埋め込みビュー_のツリーのルートにすることができます。ビュー階層は、Angularの変更検知の重要な部分です。

ビュー階層は、コンポーネント階層を意味するものではありません。特定の階層のコンテキストに埋め込まれたビューは、他のコンポーネントのホストビューにすることができます。これらのコンポーネントは、ホスティングコンポーネントと同じNgModule内にあることも、他のNgModuleに属することもできます。

{@a W}

## Web component

[カスタム要素](guide/glossary#custom-element)を参照してください。


{@a X}


{@a Y}


{@a Z}

## Zone

非同期タスクのセットの実行コンテキスト。イベント処理、Promise、リモートサーバーへの呼び出しなどの非同期操作を含むアプリケーションのデバッグ、プロファイリング、テストに役立ちます。

Angularアプリは、データの変更をチェックし、[データバインディング](guide/glossary#data-binding)を解決して表示される情報を更新するために、非同期イベントに応答できるZone内で実行されます。

Zoneのクライアントは、非同期操作が完了する前後にアクションを実行できます。

Zoneについての詳細は、この
[Brian Fordのビデオ](https://www.youtube.com/watch?v=3IqtmUscE_U)を参照してください。
