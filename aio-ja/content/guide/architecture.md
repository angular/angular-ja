# アーキテクチャー概要

Angular は、HTMLとJavaScriptまたはTypeScriptのようにJavaScriptにコンパイルできるような言語で書かれる
クライアントアプリケーションを開発するためのフレームワークです。

このフレームワークはいくつかのコアライブラリとオプショナルなライブラリからなります。

Angularアプリケーションを書くために、Angular化されたマークアップをもつHTML *テンプレート* を構成したり、
それらのテンプレートを管理するための *コンポーネント* クラスを書いたり、
アプリケーションロジックを *サービス* に追加したり、コンポーネントとサービスを *モジュール* に詰め込んだりします。

そして _ルートモジュール_ を *ブートストラップ* することでアプリを起動します。
Angularはあなたのアプリケーションのコンテンツをブラウザに表示することと、
提供した手順にしたがってユーザーの操作に応答することを引き受けます。

もちろん、それ以上のこともあります。
詳細はこのページの続きで学びます。いまのところはこの全体像に集中しましょう。

<figure>
  <img src="generated/images/guide/architecture/overview2.png" alt="overview">
</figure>

<div class="l-sub-section">

  このページで参照されているコードはここにあります。<live-example></live-example>

</div>

{@a modules}
## モジュール

<img src="generated/images/guide/architecture/module.png" alt="Component" class="left">


Angularのアプリはモジュール化されており、Angularは _NgModule_ と呼ばれる独自のモジュール方式を持っています。

NgModuleはすごいものです。
このページではモジュールを紹介します。[NgModules](guide/ngmodules) のページではさらに詳細に取り上げます。

<br class="clear">

すべてのAngularアプリは少なくともひとつのNgModuleクラス、[_ルートモジュール_](guide/bootstrapping "Bootstrapping")を持ちます。
これは慣例的に`AppModule`と呼ばれます。

小さなアプリケーションでは、_ルートモジュール_がただひとつのモジュールかもしれませんが、ほとんどのアプリはたくさんの
_機能モジュール_を持ちます。それはアプリケーションドメインに特化したコードの集合、ワークフロー、
または密接に関連した一連の機能の集合です。

_ルート_ または _機能_ にかかわらず、NgModuleは`@NgModule`デコレータをもつクラスです。

<div class="l-sub-section">

  デコレータはJavaScriptクラスを装飾する関数です。
  Angularはクラスが何を意味し、それらがどう動くべきかを知るためにメタデータをクラスに付与できる数々のデコレータを持っています。
  デコレータについてはウェブ上で
  <a href="https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.x5c2ndtx0">
  さらに学んで</a>ください。

</div>

`NgModule` はモジュールを説明するプロパティをもつひとつのメタデータオブジェクトを引数に取るデコレータ関数です。
もっとも重要なプロパティは
* `declarations` - そのモジュールに属す _ビュークラス_群です。
Angularには3種類のビュークラス: [components](guide/architecture#components), [directives](guide/architecture#directives), [pipes](guide/pipes)
があります。

* `exports` - 他のモジュールのコンポーネント[テンプレート](guide/architecture#templates)から見えて、使えるべき
declarationsのサブセットです。

* `imports` - _この_モジュールで宣言されたコンポーネントテンプレートで必要なクラスをエクスポートする他のモジュール。

* `providers` - このモジュールがグローバルコレクションに提供する[サービス](guide/architecture#services)のクリエイター、サービスのグローバルコレクション;
これらはこのアプリのすべてのパーツからアクセス可能になります。

* `bootstrap` - メインアプリケーションビュー（_ルートコンポーネント_と呼ばれます）これはアプリの他のすべてのビューをホストしています。
_ルートモジュール_のみがこの`bootstrap`プロパティをセットすべきです。

これがシンプルなルートモジュールです。

<code-example path="architecture/src/app/mini-app.ts" region="module" title="src/app/app.module.ts" linenums="false"></code-example>

<div class="l-sub-section">

  `AppComponent`を`export`しているのは、コンポーネントをエクスポートするためにどう`exports`配列を使うかを示すためです。
  これは実はこの例の中では必要のないものです。
  ルートモジュールは何も_エクスポート_する必要はありません。
  なぜなら、他のコンポーネントはルートモジュールを_インポート_する必要がないためです。

</div>

ルートモジュールを_ブートストラップ_することでアプリケーションを起動します。
開発中はこのファイルのような`main.ts`内で`AppModule`を起動することになります。

<code-example path="architecture/src/main.ts" title="src/main.ts" linenums="false"></code-example>

### NgModules vs. JavaScript モジュール

NgModule &mdash; `@NgModule` で装飾されたクラス &mdash; はAngularの基礎的な機能です。

JavaScriptもオブジェクトのコレクションを管理するためのモジュールシステムを持っています。
それは NgModule システムとはまったく異なり、関係のないものです。

JavaScriptでは各_ファイル_はモジュールで、またそのファイル内で定義されているオブジェクトはそのモジュールに属します。
モジュールは`export`キーワードをつけることで、いくつかのオブジェクトをpublicとして宣言することができます。
他のJavaScriptモジュールは*インポート文*を使うことで、他のモジュールからのpublicオブジェクトにアクセスできます。

<code-example path="architecture/src/app/app.module.ts" region="imports" linenums="false"></code-example>

<code-example path="architecture/src/app/app.module.ts" region="export" linenums="false"></code-example>

<div class="l-sub-section">
  <a href="http://exploringjs.com/es6/ch_modules.html">ウェブ上でさらにJavaScriptモジュールシステムについて学んでください</a>
</div>

相違があり、_補完しあう_ 2つのモジュールシステムがあります。アプリを書くためにこれら両方を使用しましょう。

### Angular ライブラリ

<img src="generated/images/guide/architecture/library-module.png" alt="Component" class="left">

AngularはJavaScriptのモジュールの集まりとして出荷します。ライブラリモジュールとして考えることができます。

それぞれのAngularライブラリの名前は`@angular`プレフィックスから始まります。

**npm**パッケージマネージャーでインストールすることができ、JavaScriptの`import`文によって、それらのパーツをインポートできます。

<br class="clear">

たとえば、`@angular/core`ライブラリから`Component`デコレータをインポートするためには次のようにします。

<code-example path="architecture/src/app/app.component.ts" region="import" linenums="false"></code-example>

また、Angular _ライブラリ_からNgModuleをインポートするにはJavaScriptのインポート文を使います。

<code-example path="architecture/src/app/mini-app.ts" region="import-browser-module" linenums="false"></code-example>

上記のシンプルなルートモジュールの例では、アプリケーションモジュールは`BrowswerModule`に含まれる部品を必要とします。
その部品にアクセスするためには、次のように`@NgModule`のメタデータの`imports`に追加します。

<code-example path="architecture/src/app/mini-app.ts" region="ngmodule-imports" linenums="false"></code-example>

このように、AngularとJavaScriptモジュールシステムの両方を_一緒に_使います。

この2つのシステムは`imports`と`exports`という共通の用語を共有するため、混乱しやすいです。
ですが諦めないでください。その混乱は時間と経験によってクリアになっていきます。

<div class="l-sub-section">

  [NgModules](guide/ngmodules)のページでさらに学びましょう。

</div>

<hr/>

{@a components}
## コンポーネント

<img src="generated/images/guide/architecture/hero-component.png" alt="Component" class="left">

_コンポーネント_ は*ビュー*と呼ばれる画面の一部分をコントロールします。

たとえば、次のビューはコンポーネントによりコントロールされます。

* ナビゲーションのリンクをもつアプリケーションのルート。
* ヒーローのリスト。
* ヒーローエディター。

コンポーネントのアプリケーションロジック&mdash;ビューをサポートするもの&mdash;はクラスの中に定義します。
クラスはプロパティとメソッドのAPIを通じてビューとやり取りします。

{@a component-code}

たとえば、この`HeroListComponent`はサービスから取得するヒーローの配列を返す`heroes`プロパティを持ちます。
`HeroListComponent`はユーザーがリストから1人のヒーローを選択するためにクリックしたときに`selectedHero`プロパティをセットする`selectHero()`メソッドも持ちます。

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (class)" region="class"></code-example>

Angularはユーザーがアプリケーション内を移動する中でコンポーネントを作成し、更新し、破棄します。
アプリは上で宣言した`ngOnInit()`のような[ライフサイクルフック](guide/lifecycle-hooks)を通じてライフサイクルの各時点でアクションを起こすことができます。

<hr/>

{@a templates}
## テンプレート

<img src="generated/images/guide/architecture/template.png" alt="Template" class="left">

コンポーネントのビューをそれに対応する**テンプレート**で定義します。
テンプレートはAngularにどうコンポーネントを描画するかを教えるHTMLの一形式です。

テンプレートは通常のHTMLと似ていますが、いくつかの点で異なります。
次は`HeroListComponent`のテンプレートです。

<code-example path="architecture/src/app/hero-list.component.html" title="src/app/hero-list.component.html"></code-example>

このテンプレートは典型的なHTML要素の`<h2>`と`<p>`を使用していますが、これもいくつかの違いがあります。
`*ngFor`, `{{hero.name}}`, `(click)`, `[hero]`, そして `<app-hero-detail>` といったコードはAngularの[テンプレートシンタックス](guide/template-syntax)を使用しています。

テンプレートの最後の行、`<app-hero-detail>`タグは新しいコンポーネント`HeroDetailComponent`を表すカスタム要素です。

`HeroDetailComponent`はレビューしてきた`HeroListComponent`とは*異なる*コンポーネントです。
`HeroDetailComponent` (まだ見せていません) は`HeroListComponent`で表示されたリストから
ユーザーが選択した特定のヒーローの情報を示すものです。
`HeroDetailComponent`は`HeroListComponent`の**子**です。

<img src="generated/images/guide/architecture/component-tree.png" alt="Metadata" class="left">

`<app-hero-detail>`がネイティブHTML要素の中で違和感なく置かれていることに注目してください。
カスタムコンポーネントは同じレイアウトでシームレスにネイティブHTMLと混ざり合います。

<hr class="clear"/>

{@a metadata}
## メタデータ

<img src="generated/images/guide/architecture/metadata.png" alt="Metadata" class="left">

メタデータはAngularにクラスをどのように扱うかを教えます。

<br class="clear">

`HeroListComponent`の[このコードを見返す](guide/architecture#component-code)と、それがただのクラスだということが分かるでしょう。
フレームワークの形跡もありませんし、"Angular"がその中にあるわけでもありません。

実際、`HeroListComponent`は本当に*ただのクラス*です。これは*Angularにそれについて教える*までコンポーネントではありません。

Angularに`HeroListComponent`がコンポーネントであると教えるためには、そのクラスに**metadata**を与えます。

TypeScriptは、**デコレータ**を使うことでメタデータを付与します。
これは`HeroListComponent`のためのいくつかのメタデータです。

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (metadata)" region="metadata"></code-example>

これは`@Component`デコレータで、その直下にあるクラスがコンポーネントクラスであると特定するものです。

`@Component`デコレータはAngularがコンポーネントとそのビューを作成して表示するのに必要な情報をもつ設定情報を取ります。

これはもっともよく使う`@Component`設定オプションの一例です:

* `selector`: Angularが*親*HTML内の`<app-hero-list>`が見つかった場所にこのコンポーネントのインスタンスを作成して挿入するように指示するCSSセレクタです。
たとえば、もしアプリのHTMLが `<app-hero-list></app-hero-list>`を含んでいたら、Angularは`HeroListComponent`のインスタンスをそれらのタグの間に挿入します。

* `templateUrl`: [上](guide/architecture#templates)で示した、このコンポーネントのHTMLテンプレートのモジュール相対アドレスです。

* `providers`: このコンポーネントが必要とするサービスに対する**依存性の注入のプロバイダー**の配列。
これはAngularにこのコンポーネントのコンストラクタが`HeroService`を必要としていることを指示する方法なので、
これは表示すべきヒーローのリストを取得することができます。

<img src="generated/images/guide/architecture/template-metadata-component.png" alt="Metadata" class="left">

@Componentのメタデータは、コンポーネントに対して指定した主要な構成要素を取得する場所をAngularに通知します。

テンプレート、メタデータ、そしてコンポーネントが一緒にビューを記述します。

他のメタデータデコレータを同じような方法で適用し、Angularの動作をガイドします。
`@Injectable`, `@Input`, そして `@Output` はよく使われるデコレータです。

<br class="clear">

アーキテクチャ上で考慮しておくべきことは、Angularが何をすべきかを知るために、コードにメタデータを追加しなければいけないということです。

<hr/>

{@a data-binding}
## データバインディング

フレームワークなしの場合、HTMLコントロールに値をプッシュし、ユーザーのレスポンスをアクションと値の更新に変える責任が出てくるでしょう。
このようなpush/pull側のロジックを手で書くのは面倒で、エラーが起こりやすく、経験豊富なjQueryプログラマが読むことができる悪夢です。

<img src="generated/images/guide/architecture/databinding.png" alt="Data Binding" class="left">

Angularはテンプレート内のパーツとコンポーネント内のパーツを対応させるメカニズム、**データバインディング**をサポートしています。
バインディングマークアップをテンプレートHTMLに追加して、Angularに両サイドをどう連携させるかを通知します。

ダイアグラムで示したように、4つの形式のデータバインディングのシンタックスがあります。
各形式は方向を持ちます。&mdash;DOMへ、DOMから、または双方向です。

<br class="clear">

[例](guide/architecture#templates)の`HeroListComponent`のテンプレートは3つの形式を持ちます。

<code-example path="architecture/src/app/hero-list.component.1.html" linenums="false" title="src/app/hero-list.component.html (binding)" region="binding"></code-example>

* `{{hero.name}}` [*補完*](guide/displaying-data#interpolation)は`<li>`要素内にコンポーネントの`hero.name`プロパティの値を表示します。

* `[hero]` [*プロパティバインディング*](guide/displaying-data#interpolation)は、親の`HeroListComponent`の`selectedHero`の値を、
子の`HeroDetailComponent`の`hero`プロパティに渡します。

* `(click)` [*イベントバインディング*](guide/user-input#click)はヒーロー名がクリックされたときに、
このコンポーネントの`selectHero`メソッドを呼び出します。

**双方向データバインディング** は重要な4つ目の形式で、プロパティバインディングとデータバインディングをひとつの記述にまとめたもので、
`ngModel`ディレクティブを使用します。
つぎが`HeroDetailComponent`のテンプレートからの例です。

<code-example path="architecture/src/app/hero-detail.component.html" linenums="false" title="src/app/hero-detail.component.html (ngModel)" region="ngModel"></code-example>

双方向バインディングでは、プロパティの値がプロパティバインディングとして、コンポーネントからインプットボックスに渡ります。
ユーザーが値を変更すると、イベントバインディングとしてコンポーネントに戻り、最新の値にプロパティがリセットされます。

Angularはアプリケーションコンポーネントツリーのルートからすべての子コンポーネントまで、
JavaScriptのイベントサイクルごとに1回、*すべての*データバインディングを処理します。

<figure>
  <img src="generated/images/guide/architecture/component-databinding.png" alt="Data Binding">
</figure>

データバインディングはテンプレートとそのコンポーネント間のコミュニケーションにおいて非常に重要な役割を果たします。

<figure>
  <img src="generated/images/guide/architecture/parent-child-binding.png" alt="Parent/Child binding">
</figure>

データバインディングはまた親コンポーネントと子コンポーネント間のコミュニケーションについても重要です。

<hr/>

{@a directives}
## ディレクティブ

<img src="generated/images/guide/architecture/directive.png" alt="Parent child" class="left">

Angularのテンプレートは*動的*です。Angularがそれらをレンダリングする際、
**directive**により与えられる指示によりDOMに変換されます。

ディレクティブは`@Directive`デコレータをもったクラスです。
コンポーネントは*テンプレートをもったディレクティブ*です。
`@Component`デコレータは実際はテンプレート指向の機能で拡張された`@Directive`です。

<div class="l-sub-section">

  **コンポーネントは厳密にはディレクティブ** ですが、
  コンポーネントはとても特徴的で、Angularアプリケーションの中心にあり、このアーキテクチャの概要ではコンポーネントをディレクティブとは切り離します。
 
</div>

2つの種類のディレクティブが存在します: _構造_ディレクティブと_属性_ディレクティブです。

それらは要素タグの中に属性として現れることがよくあり、名前により指定されることもありますが、
割り当てやバインディングにより指定されることの方が多いです。

それらは要素タグの中に属性としてよく現れますが、名前により指定されたり、さらには割り当てやバインディングでよく使用されます。

**構造**ディレクティブはDOM内で追加、削除または置き換えることでレイアウトを変更します。

[テンプレート例](guide/architecture#templates) では2つのビルトイン構造ディレクティブを使用しています。

<code-example path="architecture/src/app/hero-list.component.1.html" linenums="false" title="src/app/hero-list.component.html (structural)" region="structural"></code-example>

* [`*ngFor`](guide/displaying-data#ngFor) はAngularに`heroes`リストの各ヒーローにつきひとつの`<li>`を置くように指示します。
* [`*ngIf`](guide/displaying-data#ngIf) は選択されたヒーローが存在するときに限り`HeroDetail`コンポーネントを含みます。

**属性**ディレクティブは実際の要素の見た目や挙動を変更します。
テンプレート内ではそれらは普通のHTML属性のようです。したがってそのような名前がついています。

`ngModel`ディレクティブは属性ディレクティブの例で、双方向バインディングを実現します。
`ngModel`は表示用の値プロパティと変更イベントへの応答をセットすることで、実際の要素の挙動を変更します。(典型的には`<input>`)

<code-example path="architecture/src/app/hero-detail.component.html" linenums="false" title="src/app/hero-detail.component.html (ngModel)" region="ngModel"></code-example>

Angularはさらにいくつかレイアウト構造を変更するディレクティブ(たとえば、[ngSwitch](guide/template-syntax#ngSwitch)) や、
DOM要素とコンポーネントの外見を変更するディレクティブ([ngStyle](guide/template-syntax#ngStyle)と[ngClass](guide/template-syntax#ngClass))
を持っています。

もちろん、あなたのディレクティブを書くこともできます。
`HeroListComponent`のようなコンポーネントはカスタムディレクティブのひとつの種類です。

<!-- PENDING: link to where to learn more about other kinds! -->

<hr/>

{@a services}
## サービス

<img src="generated/images/guide/architecture/service.png" alt="Service" class="left">

_サービス_はアプリケーションに必要な値、関数、または機能を含む幅広いカテゴリです。

ほとんど何でもサービスになることができます。
サービスは通常、狭く、明確な目的を持ったクラスです。
それは特定の何かをして、それをうまくやるべきです。
<br class="clear">

例では下記を含みます。

* ロギングサービス
* データサービス
* メッセージバス
* 税計算
* アプリケーション設定

サービスについて_Angular_として特別なことはなにもありません。
Angularはサービスの定義をもちません。
サービスのベースクラスも、登録する場所もありません。

しかしサービスはAngularアプリケーションの基礎となるものです。
コンポーネントはサービスの大きな消費者です。

次はブラウザコンソールにログを出力するサービスクラスの例です。

<code-example path="architecture/src/app/logger.service.ts" linenums="false" title="src/app/logger.service.ts (class)" region="class"></code-example>

`HeroService`は[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を利用してヒーローを取得します。
`HeroService`は`Logger`サービスと、サービスとの通信を処理する`BackendService`に依存しています。


<code-example path="architecture/src/app/hero.service.ts" linenums="false" title="src/app/hero.service.ts (class)" region="class"></code-example>

サービスはどこにでもあります。

コンポーネントクラスは無駄がないようにあるべきです。
それらはサーバーからデータを取得しませんし、ユーザーの入力をバリデートしませんし、コンソールにログを直接出力しません。
そのようなタスクはサービスに委譲します。

コンポーネントの仕事はユーザー体験を有効化することで、それ以上はありません。
それは(テンプレートによってレンダリングされた)ビューと、(モデルの概念を含んだ)アプリケーションロジックを仲介します。
よいコンポーネントはデータバインディングのためにプロパティとメソッドを提供します。
重要ではないことはすべてサービスに委譲します。

Angularはこれらの原則を*強制*しません。
もし3000行もある"全部入りの(kitchen sink)"コンポーネントを書いたとしても不満を言いません。

Angularはアプリケーションロジックをサービスに組み込むことを容易にし、またそれらのサービスを*依存性の注入*によって
コンポーネントで使用できるようにして、その原則に*従う*ように助けます。

<hr/>

{@a dependency-injection}
## 依存性の注入

<img src="generated/images/guide/architecture/dependency-injection.png" alt="Service" class="left">

_依存性の注入_ はそのクラスが必要とする依存を完全な形を持ったインスタンスを提供する方法のひとつです。
ほとんどの依存はサービスです。
Angularは必要とするサービスを持った状態の新しいコンポーネントを提供するために依存性の注入を使用します。

<br class="clear">

Angularはコンポーネントがどのサービスを必要としているか、そのクラスのコンストラクタのパラメータの型を見ることで知ることができます。
たとえば、`HeroListComponent`のコンストラクタは`HeroService`を必要としています。


<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (constructor)" region="ctor"></code-example>

Angularがコンポーネントを作るとき、最初にそのコンポーネントがどのサービスを必要としているか**インジェクタ**に問い合わせます。

インジェクタは前に作成したサービスインスタンスのコンテナを管理しています。
もし必要とされたサービスインスタンスがコンテナ内にない場合、インジェクタはAngularにそのサービスを返す前に
インスタンスを作成してコンテナに追加します。
リクエストされたすべてのサービスが解決されて返されると、Angularはそれらサービスを引数としてコンポーネントのコンストラクタを呼ぶことができます。
これが*依存性の注入*です。

`HeroService`の注入の処理は次のようになります。

<figure>
  <img src="generated/images/guide/architecture/injector-injects.png" alt="Service">
</figure>

インジェクタに`HeroService`がない場合、それをどうやって作るのかどう知るのでしょうか？

手短にいえば、インジェクタに`HeroService`の**プロバイダー**を事前に登録しておく必要があります。
プロバイダーはサービスを作成または返すことができるもので、普通はサービスクラスそのものです。

プロバイダーはモジュールまたはコンポーネントに登録することができます。

一般には、どこでも同じサービスインスタンスを使えるように[ルートモジュール](guide/architecture#modules)に追加します。

<code-example path="architecture/src/app/app.module.ts" linenums="false" title="src/app/app.module.ts (module providers)" region="providers"></code-example>

または、`@Component`メタデータのプロパティ`providers`に追加して、コンポーネントレベルで登録します。

<code-example path="architecture/src/app/hero-list.component.ts" linenums="false" title="src/app/hero-list.component.ts (component providers)" region="providers"></code-example>

コンポーネントレベルで登録するということは、コンポーネントが作成されるたびに、新しいサービスインスタンスを得ることになるということです。

<!-- We've vastly oversimplified dependency injection for this overview.
The full story is in the [dependency injection](guide/dependency-injection) page. -->

依存性の注入について覚えるべきポイント:

* 依存性の注入はAngularフレームワークに配線されていて、至る所で使用されています。

* *インジェクタ*はメインのメカニズムです。
  * インジェクタは作成されたサービスインスタンスのコンテナを保持しています。
  * インジェクタは*プロバイダー*から新しいサービスインスタンスを作成することができます。

* *プロバイダー*はサービスを作成するためのレシピです。

* インジェクタとともに*プロバイダー*に登録します。

<hr/>

{@a wrap-up}
## まとめ

Angularアプリケーションの8つの主要な構成要素の基礎を学びました:

* [モジュール](guide/architecture#modules)
* [コンポーネント](guide/architecture#components)
* [テンプレート](guide/architecture#templates)
* [メタデータ](guide/architecture#metadata)
* [データバインディング](guide/architecture#data-binding)
* [ディレクティブ](guide/architecture#directives)
* [サービス](guide/architecture#services)
* [依存性の注入](guide/architecture#dependency-injection)

Angularアプリケーションではこれらがすべての基礎となり、先に進むのに十分なものです。
しかし、これはあなたが知るべきことすべてではありません。

ここに少し、重要なAngularの機能とサービスについてのリストがアルファベット順であります。
ほとんどのものはこのドキュメントの中で網羅されています。(または近いうちに網羅されます。)

> [**アニメーション**](guide/animations): アニメーション技術やCSSの深い知識がなくともコンポーネントの挙動に
アニメーションをつけられるAngularのアニメーションライブラリ。

> **変更検知**: 変更検知のドキュメントでは、コンポーネントのプロパティの値が変更されたこと
いつスクリーンを更新するか、**zones**を利用してどのように非同期の動作をインターセプトして変更検知の戦略を実行するのかを
Angularがどうやって決定するのかについて網羅する予定です。

> **イベント**: イベントのドキュメントでは、コンポーネントとサービスを使用してイベントを発行し、
イベントを購読する仕組みを使ってイベントを発生させる方法について説明します。

> [**フォーム**](guide/forms): HTML-ベースのバリデーションとダーティチェックを備えた複雑なデータ入力のシナリオをサポートします。

> [**HTTP**](guide/http): HTTPクライアントを使って、サーバーと通信してデータを取得したり、保存したりサーバーサイドのアクションを呼び出します。

> [**ライフサイクルフック**](guide/lifecycle-hooks): ライフサイクルフックのインターフェイスを実装することにより、作成から破棄までのコンポーネントのライフタイムの重要な瞬間に触れることができます。

> [**パイプ**](guide/pipes): テンプレート内でパイプを使用することで、表示するために値を変換することができ、ユーザー体験を向上することができます。この通貨のパイプの式を見てみましょう。

>
> > `price | currency:'USD':true`
>
> これは42.23という金額を`$42.23`と表示します。

> [**ルーター**](guide/router): ブラウザから離れることなく、クライアントアプリケーション内でページからページへとナビゲートします。

> [**テスティング**](guide/testing): _Angular Testing Platform_を使いAngularフレームワークとやりとりして、アプリケーション部分のユニットテストを実行します。

