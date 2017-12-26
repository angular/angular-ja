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

たとえば、`ngClass`ディレクティブを使ってCSSクラス名を追加したり削除したりできます。

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

同じ`index.html`の中で、複数のアプリケーションをそれぞれのルートコンポーネントを使ってブートストラップできます。

{@a C}

## camelCase
_キャメルケース_

複合語や句を、_最初の文字は小文字で書き_、以降はそれぞれの単語または略語が大文字で始まるように書く方法です。

関数、プロパティ、およびメソッド名は一般的にキャメルケースでつづられます。`square`、`firstName`、および`getHeroes`が例として挙げられます。`square`は、あなたがcamelCaseでどのように1つの単語を書くかの例です。

この形式は**ロウワーキャメルケース**としても知られ、[パスカルケース](guide/glossary#pascalcase)と呼ばれる**アッパーキャメルケース**と区別します。
このドキュメンテーションでは、"キャメルケース"とは常に*ロウワーキャメルケース*のことです。


## CLI

Angular CLIはプロジェクトの作成やファイルの追加、そしてテスト、バンドル、デプロイなど、さまざまな進行中の開発タスクを実行する `コマンドラインインターフェース`です。

詳しくは[クイックスタート](guide/quickstart) ガイドを参照してください。

{@a component}


## Component
_コンポーネント_

[ビュー](guide/glossary#view)にデータを伝えること、そしてビューの表示やユーザーインタラクションを処理することを担うAngularのクラスです。

*コンポーネント*は、Angularシステムにおいてもっとも重要な構成要素のひとつです。
その実体は、[テンプレート](guide/glossary#template)を使用したAngular[ディレクティブ](guide/glossary#directive)のことです。

開発者が`@Component` [デコレーター](guide/glossary#decorator)をコンポーネントクラスに付けることによって、
Angularがコンポーネントのインスタンスを作成し、テンプレートを使ってビューとしてレンダリングするために
必要とする基本的なコンポーネントのメタデータを、そのクラスに付加します。

"MVC"あるいは"MVVM"パターンを熟知した人であれば、コンポーネントが"コントローラー"あるいは"ビューモデル"の役割だと分かるでしょう。

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

開発者は、新しいディレクティブに紐付いたカスタムHTMLマークアップ(たとえば`<my-directive>`)を作ることができます。
そのカスタムマークアップはあたかも本来のHTMLを書くかのようにHTMLテンプレートに追加できます。
このようにして、ディレクティブはHTML自身を拡張することになります。

ディレクティブは次の種類に分けられます：

* [コンポーネント](guide/glossary#component)はアプリケーションの[ビュー](guide/glossary#view)をレンダリングするHTMLテンプレートと、アプリケーションのロジックをつなげます。
通常、コンポーネントはHTML要素のことを指します。コンポーネントはAngularアプリケーションの構成要素です。

* [属性ディレクティブ](guide/glossary#attribute-directive)は他のHTML要素、属性、プロパティ、およびコンポーネントの振る舞いを監視して変更することができます。
名前から分かるように、通常、属性ディレクティブはHTML属性のことを指します。

* [構造ディレクティブ](guide/glossary#structural-directive)は要素や子要素の追加、削除、および操作によってHTMLのレイアウトを成形したり再成形することを担当するディレクティブです。

{@a E}

## ECMAScript

[公式のJavaScriptの言語仕様](https://ja.wikipedia.org/wiki/ECMAScript)です。

JavaScriptの最新の承認されたバージョンは
[ECMAScript 2017](http://www.ecma-international.org/ecma-262/8.0/)
(通称"ES2017"または"ES8")であり、多くのAngular開発者はこのバージョンか、[TypeScript](guide/glossary#typescript)のような、
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
_実行時コンパイラ_

コンポーネントやモジュールをブラウザ上でコンパイルし、アプリケーションを動的に実行します。
これは開発期間中においてはよい選択です。
ただし、プロダクション用のアプリケーションでは[事前コンパイラ](guide/glossary#aot)モードを検討してください。


{@a K}

## kebab-case
_ケバブケース_

[ダッシュケース](guide/glossary#dash-case)を参照してください。


{@a L}

## Lifecycle hooks
_ライフサイクルフック_

[ディレクティブ](guide/glossary#directive) と [コンポーネント](guide/glossary#component)は、Angularがそれらの作成、更新、破棄を管理するためのライフサイクルを持っています。

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

[ライフサイクルフック](guide/lifecycle-hooks)のページでさらに学習することができます。


{@a M}

## Module
_モジュール_

<div class="alert is-important">


Angularには2種類のモジュールがあります。
* [Angularモジュール](guide/glossary#ngmodule)。詳細や例は[Angularモジュール](guide/ngmodule)のページを参照してください。
* この節で説明するようなES2015モジュール。



</div>



単一の目的のためにまとまったコードブロックのことです。

Angularアプリケーションはモジュール化されています。

一般的に、わたしたちのアプリケーションは自分自身で作成したもの、他から取得したものの両方からなる、多くのモジュールで組み立てられています。

モジュールは、そのコード内で何か価値のあるもの、典型的にはクラスのようなものを*エクスポート*します。そのクラスを必要とするモジュールがそれを*インポート*します。

NgModuleの構造とインポート/エクスポート構文は、[ES2015モジュール標準](http://www.2ality.com/2014/09/es6-modules-final.html)に基づいています。

この標準に準拠したアプリケーションは、リクエストに応じてモジュールをロードしたり、モジュール間の依存関係を解決するためのモジュールローダーが必要です。
Angularはモジュールローダーを付属していませんし、特定のサードパーティ製のモジュールローダーをひいきにしていません。（しかし、多くのサンプルはSystemJSを利用しています。）
アプリケーション開発者は、標準に準拠した任意のモジュールローダーを選択することができます。

モジュールは慣例として、エクスポートしたものが定義されているファイルに因んで命名されます。
Angularの[DatePipe](https://github.com/angular/angular/blob/master/packages/common/src/pipes/date_pipe.ts)クラスは、
`date_pipe.ts`ファイルの中の`date_pipe`と名前付けられた機能モジュールに所属します。

開発者がAngularの機能モジュールに直接アクセスすることは、ほとんどありません。
通常それらを`@angular/core`のような、ひとつのAngularの[スコープ化パッケージ](guide/glossary#scoped-package)からインポートします。


{@a N}


## NgModule
_Angularモジュール_

アプリケーションを機能的にまとまりのあるブロックで構成するのを手助けするものです。
Angularモジュールは、`FormsModule`などのアプリケーションで必要とされている外部Angularモジュールのリストに加え、
アプリケーションで利用されるコンポーネント、ディレクティブ、パイプなどを識別します。

あらゆるAngularアプリケーションはひとつのアプリケーションルートモジュールクラスをもちます。
慣例的にそのクラスは`AppModule`と呼ばれ、`app.module.ts`ファイル内に配置されます。

詳細や例は[Angularモジュール](guide/ngmodule)を参照してください。



{@a O}

## Observable

アイテムが時間の経過とともに非同期に到着する配列です。
Observableは、バックエンドサービスからのデータなどの非同期データの管理に役立ちます。 
Observableは、AngularのイベントシステムとそのHTTPクライアントサービスを含むAngular自体で使用されます。

Observableを使用するために、AngularはReactive Extensions（RxJS）と呼ばれるサードパーティのライブラリを使用します。
Observableは、JavaScriptの次のバージョンであるES2016に提案されている機能です。


## Output
_アウトプット_

イベントバインディングの*対象*となるディレクティブのプロパティです（[テンプレート構文](guide/template-syntax)ページの[イベントバインディング](guide/template-syntax#event-binding)の項を参照してください）。
イベントはこのプロパティからレシーバーに流れ*出ます*。レシーバーはテンプレート式の中で等号の右側で識別されます。


[テンプレート構文](guide/template-syntax)ページの[インプット・アウトプットプロパティ](guide/template-syntax#inputs-outputs)のセクションを参照してください。

{@a P}

## PascalCase
_パスカルケース_

複合語や句を、それぞれの単語または略語が大文字で始まるように書く方法です。
クラス名は一般的にパスカルケースでつづられます。`Person`や`HeroDetailComponent`が例として挙げられます。

この形式は**アッパーキャメルケース**としても知られ、わたしたちが単に[キャメルケース](guide/glossary#camelcase)と呼ぶ**ロウワーキャメルケース**と区別します。
このドキュメンテーションでは、"パスカルケース"とは*アッパーキャメルケース*のことで、"キャメルケース"とは*ロウワーキャメルケース*のことです。


## Pipe
_パイプ_

Angularパイプは、入力値を出力値に変換して[ビュー](guide/glossary#view)に表示する関数です。
次に、組み込みの`currency`パイプを使用して数値を現地通貨で表示する例を示します。


<code-example language="html" escape="html">
  <label>Price: </label>{{product.price | currency}}

</code-example>


独自のカスタムパイプを作成することもできます。
詳細は[パイプ](guide/pipes)のページを参照してください。



## Provider
_プロバイダー_

_プロバイダー_は[依存性の注入](guide/glossary#dependency-injection)システムのための、新しい依存性に関するインスタンスを生成します。
プロバイダーは検索トークンを、依存性の値を作成するコード（"レシピ"と呼ばれることがあります）に紐付けます。


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

たいていのアプリケーションは多くの画面または[ビュー](guide/glossary#view)から成り立ちます。
ユーザーはリンクやボタンのクリック、そして他の類似した行為によってアプリケーションの
ビューを別のビューに差し替えさせることで、それらの間を移動します。

Angularのコンポーネントルーターは、ビューの生成と破棄を含めた、
すべてのビューの移動処理を設定し管理するための十分な機能を備えたメカニズムです。


たいていの場合、コンポーネントはビューへの経路を定義した`RouterConfig`によってルーターに接続されることになります。

[ルーティングコンポーネント](guide/glossary#routing-component)のテンプレートは`RouterOutlet`要素を持ち、
そこでルーターによって生成されたビューを表示することができます

アプリケーションの中の他のビューは、ユーザーがクリックして移動することができる`RouterLink`
ディレクティブの付いたアンカータグかボタンをもつでしょう。

詳細は、[ルーティングとナビゲーション](guide/router)のページを参照してください。

## Router module

アプリケーションのビューの間を移動するのに必要なサービスプロバイダーおよびディレクティブを提供する、
独立した[Angularモジュール](guide/glossary#ngmodule)です。

詳細は、[ルーティングとナビゲーション](guide/router)のページを参照してください。


## Routing component
_ルーティングコンポーネント_

ルーターのナビゲーションに基づきビューを表示する`RouterOutlet`を備えたAngular [コンポーネント](guide/glossary#component)です。

詳細は、[ルーティングとナビゲーション](guide/router)のページを参照してください。


{@a S}

## Scoped package
_スコープ化パッケージ_

関連するnpmパッケージをグループ化する方法です。
[npm-scope](https://docs.npmjs.com/misc/scope)ページで詳しく読むことができます。

Angularのモジュールは、`@angular/core`、`@angular/common`、`@angular/platform-browser-dynamic`、`@angular/http`、
および`@angular/router`のような、*スコープ化パッケージ*の範囲内で提供されます。

通常のパッケージをインポートするのと同じ方法でスコープされたパッケージをインポートします。
唯一の違いは、利用者の観点からは、パッケージ名は`@angular`というAngularの*スコープ名*で始まることです。


<code-example path="architecture/src/app/app.component.ts" linenums="false" title="architecture/src/app/app.component.ts (import)" region="import">

</code-example>


## Service
_サービス_


特定のビューに関連付けられていないデータやロジック、またはコンポーネント間で共有したいデータやロジックの場合は、サービスを構築します。


アプリケーションはしばしば、ヒーローデータサービスやロギングサービスのようなサービスを必要とします。

サービスは明確な目的を持ったクラスです。
わたしたちは、どのような特定のビューからも独立した機能や、
コンポーネント間にわたる共有データやロジックを提供する機能、
または外部との相互作用をカプセル化する機能を実装するために、サービスを作成することがよくあります。

詳細については、[Tour of Heroes](tutorial)チュートリアルの[サービス](tutorial/toh-pt4)のページを参照してください。

{@a snake-case}


## snake_case
_スネークケース_


複合語や句を、それぞれの単語がひとつのアンダースコア（`_`）で隔てられるように書く方法です。
この形式は*アンダースコアケース*としても知られています。

{@a structural-directive}


{@a structural-directives}


## Structural directives
_構造ディレクティブ_

[ディレクティブ](#directive)の一種で、HTMLのレイアウトを成形または再成形することができます。
典型的には要素とその子孫を追加、除去、または操作することにより行います。
`ngIf` "条件要素" ディレクティブと`ngFor` "繰り返し"ディレクティブはよく知られた例です。

詳しくは[構造ディレクティブ](guide/structural-directives)ページを参照してください。


{@a T}

## Template
_テンプレート_


テンプレートは、[ディレクティブ](guide/glossary#directive)、特に[コンポーネント](guide/glossary#component)によるサポートと一連の指示をもって[ビュー](guide/glossary#view)を描画するために、Angularが使用するHTMLの塊です。

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

## Template expression
_テンプレート式_

A TypeScript-like syntax that Angular evaluates within
a [data binding](guide/glossary#data-binding).

テンプレート式は、Angularが[データバインディング][data binding](guide/glossary#data-binding)の内部で評価する、TypeScriptに似た構文です。

テンプレート式を記述する方法の詳細は、[テンプレート構文](guide/template-syntax)ページの[テンプレート式](guide/template-syntax#template-expressions)の項を参照してください。


## Transpile
_トランスパイル_


あるJavaScriptについての形式で書かれたコード（たとえば、TypeScript）を、
別のJavaScriptについての形式（たとえば、[ES5](guide/glossary#es5)）に変換する処理のことです。

## TypeScript

大部分の[ECMAScript 2015](guide/glossary#es2015)の言語機能、および[デコレーター](guide/glossary#decorator)のような
JavaScriptの将来のバージョンにておそらく到来するであろう機能をサポートしたJavaScriptのバージョンです。


TypeScriptはそのオプショナルな型システムについても注目に値します。
それはコンパイル時の型検査と強力なツールのサポート（たとえば、"インテリセンス"、コード補完、リファクタリング、インテリジェントな検索）を提供するものです。
多くのコードエディターとIDEはTypeScriptをネイティブに、またはプラグインを用いてサポートします。

TypeScriptはAngualrの開発において推奨される言語ですが、
[ES5](guide/glossary#es5)のような他のJavaScriptの言語で書くことも歓迎します。

TypeScriptについての詳細は、[typescriptlang.org](http://www.typescriptlang.org/)を参照してください。

{@a U}

{@a V}

## View
_ビュー_


情報を表示し、そしてクリック、マウス移動、キーストロークのような
ユーザーのアクションに反応する画面の一部分です。

Angularはひとつ以上の[ディレクティブ](guide/glossary#directive)、
特に、[コンポーネント](guide/glossary#component) ディレクティブと、それらに対を成す[テンプレート](guide/glossary#template)の制御下でビューを描画します。
コンポーネントはそのような、コンポーネントをビューと呼ぶのが都合がいいと感じるほどの重要な役割を担っています。

ビューは他のビューを含むことがよくあり、あらゆるビューは動的に読み込まれたり取り出されたりするかもしれません。
典型的には[ルーター](guide/glossary#router)の制御下で、ユーザーがアプリケーション内を移動することで行われます。

{@a W}


{@a X}


{@a Y}


{@a Z}

## Zone

JavaScriptアプリケーションの非同期動作をカプセル化して横取りする仕組みです。


ブラウザーのDOMとJavaScriptがもつ非同期動作の数は限られています。
たとえば（クリック等の）DOMイベント、[Promise](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)、そして
リモートサーバーへの[XHR](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest)コールなどです。

Zoneはこれらのすべての動作を横取りし、"Zoneクライアント"に、その非同期動作の前と完了後に操作を行う機会を与えます。

AngularはアプリケーションをZoneの中で実行します。
その中でAngularは非同期イベントに反応することができ、データの変更を検査し、
[データバインディング](guide/glossary#data-binding)によって表示する情報を更新します。

Zoneについての詳細は、この
[Brian Fordのビデオ](https://www.youtube.com/watch?v=3IqtmUscE_U)を参照してください。
