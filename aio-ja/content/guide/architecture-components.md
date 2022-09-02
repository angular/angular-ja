# コンポーネントとテンプレートのイントロダクション

*コンポーネント*は、[*ビュー*](guide/glossary#view "Definition of view")と呼ばれる画面のパッチを制御します。It consists
of a TypeScript class, an HTML template, and a CSS style sheet. The TypeScript class defines the interaction 
of the HTML template and the rendered DOM structure, while the style sheet describes its appearance.

An Angular application uses individual components to define and control different aspects of the application.
たとえば、個々のコンポーネントは[Tour of Heroes チュートリアル](tutorial)の次のビューを定義して制御します。

*   ナビゲーションリンクをもつアプリケーションのルート
*   ヒーローのリスト
*   ヒーローエディタ

In the following example, the `HeroListComponent` class includes:

* A `heroes` property that holds an array of heroes.
* A `selectedHero` property that holds the last hero selected by the user.
* A `selectHero()` method sets a `selectedHero` property when the user clicks to choose a hero from that list.

コンポーネントはサービスからヒーローを取得します。これはコンストラクターのTypeScript[パラメータプロパティ](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)です。
サービスは、依存性の注入システムを介してコンポーネントに提供されます。

<code-example header="src/app/hero-list.component.ts (class)" path="architecture/src/app/hero-list.component.ts" region="class"></code-example>

Angularは、ユーザーがアプリケーションを移動するときにコンポーネントを作成、更新、および破棄します。
アプリケーションは、ライフサイクルの各段階で、`ngOnInit()`などの[ライフサイクルフック](guide/lifecycle-hooks)を使用してアクションを実行できます。

## コンポーネントメタデータ {@a component-metadata}

<div class="lightbox">

<img alt="Metadata" class="left" src="generated/images/guide/architecture/metadata.png">

</div>

`@Component` デコレーターはそのすぐ下のクラスをコンポーネントクラスとして識別し、そのメタデータを指定します。
下のサンプルコードでは `HeroListComponent` がクラスであり、特殊な Angular の表記や構文がまったくないことがわかります。
あなたが `@Component` デコレーターをもつものとしてマークするまでは、コンポーネントではありません。

コンポーネントのメタデータは、コンポーネントとそのビューを作成し表示するために必要な主要なビルディングブロックを取得する場所をAngularに通知します。
特に、インラインコードを直接使用して、または参照によってテンプレートをコンポーネントに関連付けます。
同時に、コンポーネントとそのテンプレートが*ビュー*を記述します。

`@Component`メタデータは、テンプレートを格納することやテンプレートを指すことに加えて、HTMLでコンポーネントを参照する方法や必要なサービスなどを設定します。

`HeroListComponent`の基本メタデータの例を次に示します。

<code-example header="src/app/hero-list.component.ts (metadata)" path="architecture/src/app/hero-list.component.ts" region="metadata"></code-example>

この例は、もっとも役立つ `@Component` の設定オプションの一部です：

| Configuration options | Details |
|:---                   |:---     |
| `selector`            | A CSS selector that tells Angular to create and insert an instance of this component wherever it finds the corresponding tag in template HTML. For example, if an application's HTML contains `<app-hero-list></app-hero-list>`, then Angular inserts an instance of the `HeroListComponent` view between those tags. |
| `templateUrl`         | The module-relative address of this component's HTML template. Alternatively, you can provide the HTML template inline, as the value of the `template` property.  This template defines the component's *host view*.                                                                                                  |
| `providers`           | An array of [providers](guide/glossary#provider) for services that the component requires. In the example, this tells Angular how to provide the `HeroService` instance that the component's constructor uses to get the list of heroes to display.                                                                   |

## テンプレートとビュー {@a templates-and-views}

<div class="lightbox">

<img alt="Template" class="left" src="generated/images/guide/architecture/template.png">

</div>

コンポーネントのビューをその対となるテンプレートを使用して定義します。
テンプレートは、コンポーネントのレンダリング方法をAngularに伝えるHTMLの形式の１つです。

ビューは通常、階層的に配置されており、UIセクションまたはページ全体を1つの単位として変更したり表示したり非表示にしたりできます。
コンポーネントに直ちに関連付けられたテンプレートは、そのコンポーネントの*ホストビュー*を定義します。
コンポーネントは、他のコンポーネントによってホストされる、*埋め込みビュー*を含むビュー階層を定義することもできます。

<div class="lightbox">

<img alt="Component tree" class="left" src="generated/images/guide/architecture/component-tree.png">

</div>

ビュー階層は、同じ NgModule 内のコンポーネントからのビューと、異なる NgModule 内のコンポーネントからのビューを含むことができます。

## テンプレート構文 {@a template-syntax}

テンプレートは通常のHTMLと似ていますが、アプリケーションのロジックとアプリケーションとDOMデータの状態に基づいてHTMLを変更するAngular[テンプレート構文](guide/template-syntax)も含まれています。

テンプレートは*データバインディング*を使用してアプリケーションとDOMデータを調整し、表示する前に*パイプ*でデータを変換し、*ディレクティブ*を使用して表示されるものにアプリケーションロジックを適用することができます。

たとえば、チュートリアルの`HeroListComponent`のテンプレートは次のようになります。

<code-example header="src/app/hero-list.component.html" path="architecture/src/app/hero-list.component.html" ></code-example>

このテンプレートは `<h2>`や `<p>`のような典型的なHTML要素を使い、Angularテンプレート構文要素、`*ngFor`、`{{hero.name}}`、`(click)`、`[hero]`、`<app-hero-detail>`なども含みます。
テンプレート構文要素は、プログラムロジックとデータを使用してHTMLをスクリーンにレンダリングする方法をAngularに伝えます。

*   `*ngFor`ディレクティブはAngularにリストの繰り返しを指示します。
*   `{{hero.name}}`、`(click)`、`[hero]` はユーザー入力に応答してDOMとの間でプログラムデータをバインドします。
    次の[データバインディング](#data-binding)の詳細を参照してください。

*   この例の `<app-hero-detail>` タグは新しいコンポーネント `HeroDetailComponent` を表す要素です。
    `HeroDetailComponent`（コードは表示されません）は `HeroListComponent` の`hero-detail`の子ビューを定義します。
    
    このようなカスタムコンポーネントがどのように同じレイアウトのネイティブHTMLとシームレスに混在しているかに注目してください。

### データバインディング {@a data-binding}

フレームワークがなければ、自分でデータの値をHTMLコントロールにプッシュし、ユーザーの応答をアクションと値の更新に変える責任があります。
そのようなプッシュアンドプルロジックを手作業で書くことは、経験豊富なフロントエンドJavaScriptプログラマが証明できるように面倒で、エラーが起こりやすく、悪夢のように読みづらいです。

Angular は、テンプレートの部分をコンポーネントの各部分に合わせるためのメカニズムである*双方向データバインディング*をサポートしています。
テンプレートHTMLにバインディングマークアップを追加して、Angularに両側の接続方法を伝えます。

次の図は、データバインディングマークアップの4つの形式を示しています。
各形式には、DOMへ、DOMから、またはその両方の方向があります。

<div class="lightbox">

<img alt="Data Binding" class="left" src="generated/images/guide/architecture/databinding.png">

</div>

`HeroListComponent`テンプレートのこの例は、これらの3つの形式を使用しています。

<code-example header="src/app/hero-list.component.html (binding)" path="architecture/src/app/hero-list.component.1.html" region="binding"></code-example>

| Data bindings                                                            | Details |
|:---                                                                      |:---     |
| `[hero]` [property binding](guide/property-binding)                      | Passes the value of `selectedHero` from the parent `HeroListComponent` to the `hero` property of the child `HeroDetailComponent`. |
| `(click)` [event binding](guide/user-input#binding-to-user-input-events) | Calls the component's `selectHero` method when the user clicks a hero's name.                                                     |
| `{{hero.name}}` [interpolation](guide/interpolation)                     | Displays the component's `hero.name` property value within the `<button>` element.                                                |

双方向データバインディング（主に[テンプレート駆動フォーム](guide/forms)で使用される）は、単一の表記法でプロパティとイベントのバインディングを結合します。
`HeroDetailComponent` テンプレートの例は、`ngModel` ディレクティブを用いて双方向データバインディングを使用しています。

<code-example header="src/app/hero-detail.component.html (ngModel)" path="architecture/src/app/hero-detail.component.html" region="ngModel"></code-example>

双方向バインディングでは、データプロパティ値が、プロパティバインディングと同様にコンポーネントから入力ボックスに流れます。
ユーザーの変更もコンポーネントに戻り、イベントバインディングの場合と同様にプロパティを最新の値にリセットします。

Angular は、JavaScriptイベントサイクルごとに*すべての*データバインディングを1回処理しますが、
それはアプリケーションコンポーネントツリーのルートからすべての子コンポーネントを経由します。

<div class="lightbox">

<img alt="Data Binding" class="left" src="generated/images/guide/architecture/component-databinding.png">

</div>

データバインディングはテンプレートとそのコンポーネント間の通信で重要な役割を果たし、親コンポーネントと子コンポーネント間の通信においても重要です。

<div class="lightbox">

<img alt="Parent/Child binding" class="left" src="generated/images/guide/architecture/parent-child-binding.png">

</div>

### パイプ {@a pipes}

Angular のパイプを使用すると、テンプレートHTMLの表示値変換を宣言できます。
`@Pipe` デコレーターをもつクラスは、入力値を出力値に変換してビューに表示する関数を定義します。

Angular は、[date](api/common/DatePipe)パイプや[currency](api/common/CurrencyPipe)パイプなどのさまざまなパイプを定義します。完全なリストについては、[Pipes API リスト](api?type=pipe)を参照してください。
新しいパイプを定義することもできます。

HTMLテンプレートで値の変換を指定するには、[パイプ演算子 (|)](guide/pipes)を使用します。

<code-example format="html" language="html">

{{interpolated_value &verbar; pipe_name}}

</code-example>

パイプを連鎖させ、あるパイプ関数の出力を別のパイプ関数で変換することができます。パイプは、変換の実行方法を制御する引数を取ることもできます。たとえば、`date` パイプに目的のフォーマットを渡すことができます。

<code-example format="html" language="html">

&lt;!-- Default format: output 'Jun 15, 2015'--&gt;
&lt;p&gt;Today is {{today &verbar; date}}&lt;/p&gt;

&lt;!-- fullDate format: output 'Monday, June 15, 2015'--&gt;
&lt;p&gt;The date is {{today &verbar; date:'fullDate'}}&lt;/p&gt;

&lt;!-- shortTime format: output '9:43 AM'--&gt;
&lt;p&gt;The time is {{today &verbar; date:'shortTime'}}&lt;/p&gt;

</code-example>

### ディレクティブ {@a directives}

<div class="lightbox">

<img alt="Directives" class="left" src="generated/images/guide/architecture/directive.png">

</div>

Angular テンプレートは*ダイナミック*です。
Angular がレンダリングすると、*ディレクティブ*の指示にしたがってDOMが変換されます。
ディレクティブは `@Directive()` デコレーターをもつクラスです。

コンポーネントは技術的にはディレクティブです。
しかし、コンポーネントは Angular アプリケーションにとって非常に特徴的であり、Angularは `@Component()` デコレーターを定義しています。これはテンプレート指向の機能をもつ `@Directive()` デコレーターを拡張します。

コンポーネントに加えて、他に*構造*と*属性*の2つの種類のディレクティブがあります。
Angularは両方の種類のディレクティブを定義し、`@Directive()` デコレーターを使用して独自のものを定義することができます。

コンポーネントの場合と同様に、ディレクティブのメタデータは装飾されたクラスをHTMLに挿入するために使用する `selector` 要素と関連付けます。
ディレクティブは通常は属性として、要素タグ内に名前として、または割り当てやバインディングのターゲットとして表示されます。

#### 構造ディレクティブ

*構造ディレクティブ*は、DOMの要素を追加、削除、置換することによってレイアウトを変更します。
サンプルテンプレートでは、2つの組み込み構造ディレクティブを使用して、ビューのレンダリング方法にアプリケーションロジックを追加しています。

<code-example header="src/app/hero-list.component.html (structural)" path="architecture/src/app/hero-list.component.1.html" region="structural"></code-example>

| Directives                                  | Details |
|:---                                         |:---     |
| [`*ngFor`](guide/built-in-directives#ngFor) | An iterative; it tells Angular to stamp out one `<li>` per hero in the `heroes` list. |
| [`*ngIf`](guide/built-in-directives#ngIf)   | A conditional; it includes the `HeroDetail` component only if a selected hero exists. |

#### 属性ディレクティブ

*属性ディレクティブ*は、既存の要素の外観や動作を変更します。
テンプレートでは通常のHTML属性、つまり名前のように見えます。

双方向データバインディングを実装する `ngModel` ディレクティブは、属性ディレクティブの例です。
`ngModel`は、その表示値プロパティを設定し、変更イベントに応答することによって、既存の要素の動作（通常は` <input> `）を変更します。

<code-example header="src/app/hero-detail.component.html (ngModel)" path="architecture/src/app/hero-detail.component.html" region="ngModel"></code-example>

Angularには、定義済みのディレクティブが含まれています。

* [ngSwitch](guide/built-in-directives#ngSwitch) のようなレイアウト構造を変更するディレクティブ
* [ngStyle](guide/built-in-directives#ngstyle) や [ngClass](guide/built-in-directives#ngClass) などのDOM要素やコンポーネントのアスペクトを変更するディレクティブ

<div class="alert is-helpful">

[属性ディレクティブ](guide/attribute-directives)と[構造ディレクティブ](guide/structural-directives)のガイドの詳細をご覧ください。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
