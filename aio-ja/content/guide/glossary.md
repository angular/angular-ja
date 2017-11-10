# Angular用語集

Angularには独自の用語があります。
ほとんどのAngularの用語は、Angularシステムの中で特別な意味をもつ常用英単語です。

ここには主要な用語といくつかのあまり馴染みのない用語を集めています。

[A](guide/glossary#A) [B](guide/glossary#B) [C](guide/glossary#C) [D](guide/glossary#D) [E](guide/glossary#E) [F](guide/glossary#F) [G](guide/glossary#G) [H](guide/glossary#H) [I](guide/glossary#I)
[J](guide/glossary#J) [K](guide/glossary#K) [L](guide/glossary#L) [M](guide/glossary#M) [N](guide/glossary#N) [O](guide/glossary#O) [P](guide/glossary#P) [Q](guide/glossary#Q) [R](guide/glossary#R)
[S](guide/glossary#S) [T](guide/glossary#T) [U](guide/glossary#U) [V](guide/glossary#V) [W](guide/glossary#W) [X](guide/glossary#X) [Y](guide/glossary#Y) [Z](guide/glossary#Z)


{@a A}
{@a aot}


## Ahead-of-time (AOT) compilation
_事前コンパイル_

Angularアプリケーションは、開発者が開発時にコンパイルすることができます。
compiler-cli、別名`ngc`を使用してアプリケーションをコンパイルすることで、Module Factoryを直接起動することができます。
つまり、JavaScriptのバンドルの中にAngularのコンパイラは必要ありません。
また、事前コンパイルしたアプリケーションは読み込み時間が短縮され、パフォーマンスも向上する利点があります。

## Annotation
_アノテーション_

[デコレーター](guide/glossary#decorator)のことを指します。


{@a attribute-directive}


{@a attribute-directives}


## Attribute directives
_属性ディレクティブ_

[ディレクティブ](guide/glossary#directive)の一種で、他のHTML要素、属性、プロパティやコンポーネントの振る舞いを監視し、変更することができます。その名前のとおり、通常これらはHTML属性として現れます。

例えば、`ngClass`ディレクティブを使ってCSSクラス名を追加したり削除したりできます。

[_属性ディレクティブ_](guide/attribute-directives)ガイドで詳しく学びましょう。


{@a B}

## Barrel
_バレル_

バレルは、複数のES2015モジュールをひとつのES2015モジュールに*まとめてエクスポートする*方法です。
バレル自身は、ES2015モジュールのファイルであり、*選択された*他のES2015モジュールのエクスポートを再エクスポートします。

例として、`heroes`フォルダにある、3つのES2015モジュールをイメージしてください：

<code-example>
  // heroes/hero.component.ts
  export class HeroComponent {}

  // heroes/hero.model.ts
  export class Hero {}

  // heroes/hero.service.ts
  export class HeroService {}
</code-example>



バレル無しでは、3つのインポート文を書く必要があります。

<code-example>
  import { HeroComponent } from '../heroes/hero.component.ts';
  import { Hero }          from '../heroes/hero.model.ts';
  import { HeroService }   from '../heroes/hero.service.ts';
</code-example>



これらすべてをエクスポートしている`heroes`フォルダ（慣例的に`index`と呼ばれます）にバレルを追加できます。

<code-example>
  export * from './hero.model.ts';   // re-export all of its exports
  export * from './hero.service.ts'; // re-export all of its exports
  export { HeroComponent } from './hero.component.ts'; // re-export the named thing
</code-example>



これでバレルから必要なものをインポートできるようになります。

<code-example>
  import { Hero, HeroService } from '../heroes'; // index is implied
</code-example>



Angularの[スコープ化パッケージ](guide/glossary#scoped-package)それぞれが`index`という名前のバレルを持っています。

<div class="alert is-important">



同じ目的のために、[Angularモジュール](guide/glossary#ngmodule)を使うことがあるので覚えておきましょう。


</div>

## Binding
_バインディング_

ほとんどの場合、[データバインディング](guide/glossary#data-binding)のことを指します。
その役割は、HTMLオブジェクトのプロパティと、データオブジェクトのプロパティを結びつけることです。

また、"トークン"または"キー" と依存性の[プロバイダー](guide/glossary#provider)との間を結びつける、[依存性の注入](guide/glossary#dependency-injection)を指すこともあります。

## Bootstrap
_ブートストラップ_


アプリケーションルートのNgModule (`AppModule`) を使って "ブートストラップ"することでAngularアプリケーションが起動します。

ブートストラップは、アプリケーションにロードされる最初のコンポーネントであるアプリケーションの最上位の「ルート」[コンポーネント](guide/glossary#component)を識別します。
詳細については、[セットアップ](guide/setup)を参照してください。

同じ`index.html`の中で、複数のアプリケーションをそれぞれのルートコンポーネントを使ってブートストラップできます。

{@a C}

## camelCase
_キャメルケース_

複合語や句を、_最初の文字は小文字で書き_、以降はそれぞれの単語または略語が大文字で始まるように書く方法です。

関数、プロパティ、およびメソッド名は一般的にキャメルケースでつづられます。`square`、`firstName`、および`getHeroes`が例として挙げられます。`square`は、あなたがcamelCaseでどのように1つの単語を書くかの例です。

この形式は**ロウワーキャメルケース**としても知られ、[パスカルケース](guide/glossary#pascalcase)と呼ばれる**アッパーキャメルケース**と区別します。
このドキュメンテーションでは、"キャメルケース"とは常に*ロウワーキャメルケース*のことです。


{@a component}


## Component
_コンポーネント_

[ビュー](guide/glossary#view)にデータを伝えること、そしてビューの表示やユーザーインタラクションを処理することを担うAngularのクラスです。

*コンポーネント*は、Angularシステムにおいてもっとも重要な構成要素のひとつです。
その実体は、[テンプレート](guide/glossary#template)を使用したAngular[ディレクティブ](guide/glossary#directive)のことです。

開発者が`@Component` [デコレーター](guide/glossary#decorator)をコンポーネントクラスに付けることによって、
Angularがコンポーネントのインスタンスを作成し、テンプレートを使ってビューとしてレンダリングするために
必要とする基本的なコンポーネントのメタデータを、そのクラスに付加します。

"MVC"あるいは"MVVM"パターンを熟知した人であれば、コンポーネントが"コントローラー"あるいは"ビューモデル"の役割だとわかるでしょう。

{@a D}

## dash-case
_ダッシュケース_

複合語や句を、それぞれの単語がひとつのダッシュやハイフン (`-`) で隔てられるように書く方法です。
この形式はケバブケースとしても知られています。

(`my-app`のような)[ディレクティブ](guide/glossary#directive)セレクターや(`hero-list.component.ts`のような)ファイル名
は、よくダッシュケースで記述されます。


## Data binding
_データバインディング_

アプリケーションはデータの値をユーザーに表示し、ユーザーからのアクション(クリック、タッチ、キーストローク)に反応します。

データバインディングにおいて、HTMLウィジェットとアプリケーションデータソースの間の関係を定義することで、フレームワークが詳細を処理します。
データバインディングは、アプリケーションデータ値をHTMLに手動でプッシュしたり、イベントリスナーをアタッチしたり、変更された値を画面から取得したり、アプリケーションデータ値を更新する代わりに使用できます。

Angularは、多様なデータバインディング操作と宣言構文をサポートする高機能なデータバインディングフレームワークを供えています。

データバインディングについて詳しく知るには[テンプレート構文](guide/template-syntax)の章を参照してください。

 * [補間](guide/template-syntax#interpolation).
 * [プロパティバインディング](guide/template-syntax#property-binding).
 * [イベントバインディング](guide/template-syntax#event-binding).
 * [属性バインディング](guide/template-syntax#attribute-binding).
 * [クラスバインディング](guide/template-syntax#class-binding).
 * [スタイルバインディング](guide/template-syntax#style-binding).
 * [ngModelによる双方向バインディング](guide/template-syntax#ngModel).


{@a decorator}


{@a decoration}


## Decorator | decoration
_デコレーター | デコレーション_

デコレーターは*関数*であり、クラス、メンバー（プロパティおよびメソッド）、および関数の引数にメタデータを付加します。

デコレーターはJavaScript言語のステージ2の実験的な[機能](https://github.com/wycats/javascript-decorators)で、TypeScript で実装されています。

デコレーターを適用するには、修飾する対象の直上か左にデコレーターを配置します。

Angularは独自のデコレーターを持っており、Angularとアプリケーションの部品が協調して動く手助けをします。
こちらは、クラスをAngularの[コンポーネント](guide/glossary#component)と識別する`@Component`デコレーター、およびそのコンポーネントの`name`プロパティに適用される`@Input`デコレーターの例です。
ここでは省略した`@Component`の引数オブジェクトには、関連するコンポーネントのメタデータを含めます。
```
@Component({...})
export class AppComponent {
  constructor(@Inject('SpecialFoo') public foo:Foo) {}
  @Input() name:string;
}
```
デコレーターの範囲は、それが修飾するJavaScript言語の機能に限られます。
ここでいう修飾は、同一ファイルの中でそれ以降にある他のクラスにまで及ぶわけではありません。


<div class="alert is-important">



デコレーターを適用する際には、常に丸括弧`()`を含めてください。


</div>


## Dependency injection
_依存性の注入_

依存性の注入は、アプリケーションの部品に求められた部品を作って送り届けるためのデザインパターンでありメカニズムです。

Angularの開発者は、ひとつのことだけをするシンプルな部品をたくさん定義することでアプリケーションを組み立てることを好み、その後、実行時にそれぞれをつなぎます。

これらの部品は他の部品に依存していることがよくあります。Angularの[コンポーネント](guide/glossary#component)部分は
データを取得し計算を処理するサービス部分に依存しているかもしれません。"A" 部分が他の "B" 部分に依存しているとき、
"A" は "B" に依存している、または "B" は "A" の依存性であるといいます。

"依存性の注入システム" に "A" を作成させてすべての依存性を扱わせることができます。
もし "A" が "B" を必要とし、かつ "B" が "C" を必要とするならば、
このシステムは依存性の連鎖を解決したうえで、完全に準備された "A" を返してくれます。

Angularは独自で洗練された依存性の注入システムを提供し利用しています。
必要なときに必要な場所でアプリケーションの部品を他の部品へ "注入すること" によって、アプリケーションを組み立てて実行します。

その中心には、要求によって依存している値を返す[`インジェクター`](guide/glossary#injector)があります。
`injector.get(token)`という式は、与えられたトークンに関連する依存性の値を返します。

トークンはAngularの型(`InjectionToken`)です。わたしたちが直接トークンを扱うことはめったにありません。
ほとんどのメソッドはクラス名(`Foo`)もしくは文字列("foo")を受け入れて、Angularがトークンに変換するからです。
わたしたちが`injector.get(Foo)`と書くときには、インジェクターは`Foo`クラスのためのトークンに関連した値を返します。
通常その値は`Foo`クラスのインスタンスそのものです。

Angularは、表示のために[`コンポーネント`](guide/glossary#component)を作るような処理において、似た要求を内部的にしています。

この`インジェクター`は、トークンと依存性の値とのマップを内部的に管理しています。
もし`インジェクター`が与えられたトークンにマップされた値を見つけられないときには、そのトークンの`プロバイダー`を使って新しく値を作成します。

[プロバイダー](guide/glossary#provider)は、特定のトークンに関連した依存性の値の新しいインスタンスを作成するためのレシピです。

インジェクターは、内部的なプロバイダーのレジストリの中にそのトークンのための`プロバイダー`があるときにのみ、依存性の値を作成することができます。
プロバイダーをレジストリに登録しておくことは、準備段階において非常に重要なことです。

Angularは、すべてのインジェクターにいくつか独自のプロバイダーを登録します。
そしてわたしたちは自分のプロバイダーを登録できます。

詳しく知るには[依存性の注入](guide/dependency-injection)の章を参照してください。


{@a directive}


{@a directives}


## Directive
_ディレクティブ_

ブラウザのDOM内で、HTML要素を作成し変形し相互に作用することを担当する、Angularのクラスです。
ディレクティブはAngularのもっとも基本的な機能です。

ディレクティブはほとんどの場合HTML要素もしくは属性と連携します。
その要素や属性をディレクティブ自身としてよく参照します。

AngularはHTMLテンプレートの中にディレクティブを見つけると、対応するディレクティブクラスのインスタンスを作成し、
そのインスタンスにブラウザのDOMの一部における制御を与えます。

開発者は、新しいディレクティブに紐付いたカスタムHTMLマークアップ(例えば`<my-directive>`)を作ることができます。
そのカスタムマークアップはあたかも本来のHTMLを書くかのようにHTMLテンプレートに追加できます。
このようにして、ディレクティブはHTML自身を拡張することになります。

ディレクティブは次の種類に分けられます：

* [コンポーネント](guide/glossary#component)はアプリケーションの[ビュー](guide/glossary#view)をレンダリングするHTMLテンプレートと、アプリケーションのロジックをつなげます。
通常、コンポーネントはHTML要素のことを指します。コンポーネントはAngularアプリケーションの構成要素です。

* [属性ディレクティブ](guide/glossary#attribute-directive)は他のHTML要素、属性、プロパティ、およびコンポーネントの振る舞いを監視して変更することができます。
名前からわかるように、通常、属性ディレクティブはHTML属性のことを指します。

* [構造ディレクティブ](guide/glossary#structural-directive)は要素や子要素の追加、削除、および操作によってHTMLのレイアウトを成形したり再成形することを担当するディレクティブです。

{@a E}

## ECMAScript

[公式のJavaScriptの言語仕様](https://ja.wikipedia.org/wiki/ECMAScript)です。

JavaScriptの最新の承認されたバージョンは
[ECMAScript 2017](http://www.ecma-international.org/ecma-262/8.0/)
(通称"ES2017"または"ES8")であり、多くのAngular開発者はこのバージョンか、[TypeScript](#typesScript)のような、
このバージョンの対応に取り組む言語のいずれかを使用してアプリケーションを書くでしょう。

今日の大部分のモダンブラウザーは、それよりもずっと古い"ECMAScript 5"(通称ES5)標準しかサポートしていません。
ES2017、ES2016、 ES2015か、それらと互換性のある言語で書かれたアプリケーションは、
ES5 JavaScriptに"[トランスパイル](guide/glossary#transpile)"されなければなりません。

Angularアプリケーションを、ES5で直接書くこともできます。

## ES2015

[ECMAScript 2015](guide/glossary#ecmascript)の簡略表現です。


## ES5

ECMAScript 5の簡略表現で、ほとんどのモダンブラウザーで動くJavaScriptのバージョンです。
[ECMAScript](guide/glossary#ecmascript)を参照してください。

## ES6

[ECMAScript 2015](guide/glossary#ecmascript)の簡略表現です。


{@a F}


{@a G}


{@a H}

{@a I}

## Injector
_インジェクター_

Angularの[依存性の注入システム](guide/glossary#dependency-injection)におけるオブジェクトで、
指定された"依存性"をキャッシュから見つけるか、登録された[プロバイダー](guide/glossary#provider)を使用して生成できます。

## Input
_インプット_

[プロパティバインディング](guide/template-syntax#property-binding)([テンプレート構文](guide/template-syntax)のページで詳しく説明されています)の*対象*になるディレクティブプロパティです。
データ値はデータソースからこのプロパティに流れ*こみます*。データソースはテンプレートの中で等号の右側で識別されます。

[テンプレート構文](guide/template-syntax)ページの[インプット・アウトプットプロパティ](guide/template-syntax#inputs-outputs)のセクションを参照してください。

## Interpolation
_補間_

[プロパティデータバインディング](guide/glossary#data-binding)の一形態で、その二重波括弧の間の[テンプレート式](guide/glossary#template-expression)の結果を、テキストとしてレンダリングします。
そのテキストは、要素のプロパティに割り当てられるか、この例のように要素のタグの間で表示される前に、隣接したテキストに連結されることがあります。

<code-example language="html" escape="html">
  <label>My current hero is {{hero.name}}</label>

</code-example>



補間についての詳細は[テンプレート構文](guide/template-syntax) ページの[補間](guide/template-syntax#interpolation)のセクションを参照してください。

{@a J}

{@a jit}


## Just-in-time (JIT) compilation

A bootstrapping method of compiling components and modules in the browser
and launching the application dynamically. Just-in-time mode is a good choice during development.
Consider using the [ahead-of-time](guide/glossary#aot) mode for production apps.


{@a K}

## kebab-case

See [dash-case](guide/glossary#dash-case).


{@a L}

## Lifecycle hooks

[Directives](guide/glossary#directive) and [components](guide/glossary#component) have a lifecycle
managed by Angular as it creates, updates, and destroys them.

You can tap into key moments in that lifecycle by implementing
one or more of the lifecycle hook interfaces.

Each interface has a single hook method whose name is the interface name prefixed with `ng`.
For example, the `OnInit` interface has a hook method named `ngOnInit`.

Angular calls these hook methods in the following order:

* `ngOnChanges`: when an [input](guide/glossary#input)/[output](guide/glossary#output) binding value changes.
* `ngOnInit`: after the first `ngOnChanges`.
* `ngDoCheck`: developer's custom change detection.
* `ngAfterContentInit`: after component content initialized.
* `ngAfterContentChecked`: after every check of component content.
* `ngAfterViewInit`: after a component's views are initialized.
* `ngAfterViewChecked`: after every check of a component's views.
* `ngOnDestroy`: just before the directive is destroyed.

Read more in the [Lifecycle Hooks](guide/lifecycle-hooks) page.


{@a M}

## Module

<div class="alert is-important">


Angular has the following types of modules:

* [NgModules](guide/glossary#ngmodule).
For details and examples, see the [NgModules](guide/ngmodule) page.
* ES2015 modules, as described in this section.


</div>



A cohesive block of code dedicated to a single purpose.

Angular apps are modular.

In general, you assemble an application from many modules, both the ones you write and the ones you acquire from others.

A module *exports* something of value in that code, typically one thing such as a class;
a module that needs that class *imports* it.

The structure of NgModules and the import/export syntax
is based on the [ES2015 module standard](http://www.2ality.com/2014/09/es6-modules-final.html).

An application that adheres to this standard requires a module loader to
load modules on request and resolve inter-module dependencies.
Angular doesn't include a module loader and doesn't have a preference
for any particular third-party library (although most examples use SystemJS).
You can use any module library that conforms to the standard.

Modules are typically named after the file in which the exported thing is defined.
The Angular [DatePipe](https://github.com/angular/angular/blob/master/packages/common/src/pipes/date_pipe.ts)
class belongs to a feature module named `date_pipe` in the file `date_pipe.ts`.

You rarely access Angular feature modules directly. You usually import them from an Angular [scoped package](guide/glossary#scoped-package) such as `@angular/core`.


{@a N}


## NgModule


Helps you organize an application into cohesive blocks of functionality.
An NgModule identifies the components, directives, and pipes that the application uses along with the list of external NgModules that the application needs, such as `FormsModule`.

Every Angular application has an application root-module class. By convention, the class is
called `AppModule` and resides in a file named `app.module.ts`.

For details and examples, see [NgModules](guide/ngmodule).


{@a O}

## Observable

An array whose items arrive asynchronously over time.
Observables help you manage asynchronous data, such as data coming from a backend service.
Observables are used within Angular itself, including Angular's event system and its HTTP client service.

To use observables, Angular uses a third-party library called Reactive Extensions (RxJS).
Observables are a proposed feature for ES2016, the next version of JavaScript.


## Output

A directive property that can be the *target* of event binding
(read more in the [event binding](guide/template-syntax#event-binding)
section of the [Template Syntax](guide/template-syntax) page).
Events stream *out* of this property to the receiver identified
in the template expression to the right of the equal sign.

See the [Input and output properties](guide/template-syntax#inputs-outputs) section of the [Template Syntax](guide/template-syntax) page.


{@a P}

## PascalCase

The practice of writing individual words, compound words, or phrases such that each word or abbreviation begins with a capital letter.
Class names are typically spelled in PascalCase. For example, `Person` and `HeroDetailComponent`.

This form is also known as *upper camel case* to distinguish it from *lower camel case* or simply [camelCase](guide/glossary#camelcase).
In this documentation, "PascalCase" means *upper camel case* and  "camelCase" means *lower camel case*.


## Pipe

An Angular pipe is a function that transforms input values to output values for
display in a [view](guide/glossary#view).
Here's an example that uses the built-in `currency` pipe to display
a numeric value in the local currency.


<code-example language="html" escape="html">
  <label>Price: </label>{{product.price | currency}}

</code-example>



You can also write your own custom pipes.
Read more in the page on [pipes](guide/pipes).


## Provider

A _provider_ creates a new instance of a dependency for the
[dependency injection](guide/glossary#dependency-injection) system.
It relates a lookup token to code&mdash;sometimes called a "recipe"&mdash;that can create a dependency value.


{@a Q}

{@a R}

## Reactive forms

A technique for building Angular forms through code in a component.
The alternative technique is [template-driven forms](guide/glossary#template-driven-forms).

When building reactive forms:

* The "source of truth" is the component. The validation is defined using code in the component.
* Each control is explicitly created in the component class with `new FormControl()` or with `FormBuilder`.
* The template input elements do *not* use `ngModel`.
* The associated Angular directives are all prefixed with `Form`, such as `FormGroup`, `FormControl`, and `FormControlName`.

Reactive forms are powerful, flexible, and a good choice for more complex data-entry form scenarios, such as dynamic generation of form controls.


## Router

Most applications consist of many screens or [views](guide/glossary#view).
The user navigates among them by clicking links and buttons,
and performing other similar actions that cause the application to
replace one view with another.

The Angular component router is a richly featured mechanism for configuring and managing the entire view navigation process, including the creation and destruction
of views.

In most cases, components become attached to a router by means
of a `RouterConfig` that defines routes to views.

A [routing component's](guide/glossary#routing-component) template has a `RouterOutlet` element
where it can display views produced by the router.

Other views in the application likely have anchor tags or buttons with `RouterLink`
directives that users can click to navigate.

For more information, see the [Routing & Navigation](guide/router) page.


## Router module

A separate [NgModule](guide/glossary#ngmodule) that provides the necessary service providers and directives for navigating through application views.

For more information, see the [Routing & Navigation](guide/router) page.


## Routing component

An Angular [component](guide/glossary#component) with a `RouterOutlet` that displays views based on router navigations.

For more information, see the [Routing & Navigation](guide/router) page.


{@a S}

## Scoped package

A way to group related *npm* packages.
Read more at the [npm-scope](https://docs.npmjs.com/misc/scope) page.

NgModules are delivered within *scoped packages* such as `@angular/core`,
`@angular/common`, `@angular/platform-browser-dynamic`, `@angular/http`, and `@angular/router`.

Import a scoped package the same way that you import a normal package.
The only difference, from a consumer perspective,
is that the scoped package name begins with the Angular *scope name*, `@angular`.


<code-example path="architecture/src/app/app.component.ts" linenums="false" title="architecture/src/app/app.component.ts (import)" region="import">

</code-example>


## Service

For data or logic that is not associated
with a specific view or that you want to share across components, build services.

Applications often require services such as a hero data service or a logging service.

A service is a class with a focused purpose.
You often create a service to implement features that are
independent from any specific view,
provide shared data or logic across components, or encapsulate external interactions.

Applications often require services such as a data service or a logging service.

For more information, see the [Services](tutorial/toh-pt4) page of the [Tour of Heroes](tutorial) tutorial.


{@a snake-case}


## snake_case

The practice of writing compound words or phrases such that an
underscore (`_`) separates one word from the next. This form is also known as *underscore case*.


{@a structural-directive}


{@a structural-directives}


## Structural directives

A category of [directive](guide/glossary#directive) that can
shape or reshape HTML layout, typically by adding and removing elements in the DOM.
The `ngIf` "conditional element" directive and the `ngFor` "repeater" directive are well-known examples.

Read more in the [Structural Directives](guide/structural-directives) page.


{@a T}

## Template

A chunk of HTML that Angular uses to render a [view](guide/glossary#view) with
the support and guidance of an Angular [directive](guide/glossary#directive),
most notably a [component](guide/glossary#component).


## Template-driven forms

A technique for building Angular forms using HTML forms and input elements in the view.
The alternate technique is [Reactive Forms](guide/glossary#reactive-forms).

When building template-driven forms:

* The "source of truth" is the template. The validation is defined using attributes on the individual input elements.
* [Two-way binding](guide/glossary#data-binding) with `ngModel` keeps the component model synchronized with the user's entry into the input elements.
* Behind the scenes, Angular creates a new control for each input element, provided you have set up a `name` attribute and two-way binding for each input.
* The associated Angular directives are all prefixed with `ng` such as `ngForm`, `ngModel`, and `ngModelGroup`.

Template-driven forms are convenient, quick, and simple. They are a good choice for many basic data-entry form scenarios.

Read about how to build template-driven forms
in the [Forms](guide/forms) page.


## Template expression

A TypeScript-like syntax that Angular evaluates within
a [data binding](guide/glossary#data-binding).

Read about how to write template expressions
in the [Template expressions](guide/template-syntax#template-expressions) section
of the [Template Syntax](guide/template-syntax) page.


## Transpile

The process of transforming code written in one form of JavaScript
(such as TypeScript) into another form of JavaScript  (such as [ES5](guide/glossary#es5)).


## TypeScript

A version of JavaScript that supports most [ECMAScript 2015](guide/glossary#es2015)
language features such as [decorators](guide/glossary#decorator).

TypeScript is also notable for its optional typing system, which provides
compile-time type checking and strong tooling support (such as "intellisense,"
code completion, refactoring, and intelligent search). Many code editors
and IDEs support TypeScript either natively or with plugins.

TypeScript is the preferred language for Angular development, although
you can use other JavaScript dialects such as [ES5](guide/glossary#es5).

Read more about TypeScript at [typescriptlang.org](http://www.typescriptlang.org/).


{@a U}

{@a V}

## View

A portion of the screen that displays information and responds
to user actions such as clicks, mouse moves, and keystrokes.

Angular renders a view under the control of one or more [directives](guide/glossary#directive),
especially  [component](guide/glossary#component) directives and their companion [templates](guide/glossary#template).
The component plays such a prominent role that it's often
convenient to refer to a component as a view.

Views often contain other views. Any view might be loaded and unloaded
dynamically as the user navigates through the application, typically
under the control of a [router](guide/glossary#router).


{@a W}


{@a X}


{@a Y}


{@a Z}

## Zone

A mechanism for encapsulating and intercepting
a JavaScript application's asynchronous activity.

The browser DOM and JavaScript have a limited number
of asynchronous activities, such as DOM events (for example, clicks),
[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), and
[XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
calls to remote servers.

Zones intercept all of these activities and give a "zone client" the opportunity
to take action before and after the async activity finishes.

Angular runs your application in a zone where it can respond to
asynchronous events by checking for data changes and updating
the information it displays via [data bindings](guide/glossary#data-binding).

Learn more about zones in this
[Brian Ford video](https://www.youtube.com/watch?v=3IqtmUscE_U).
