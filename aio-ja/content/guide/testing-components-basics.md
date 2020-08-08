# コンポーネントテストの基本

コンポーネントは、Angularアプリケーションの他のすべての部品とは違い、
HTMLテンプレートとTypeScriptクラスを組み合わせています。
コンポーネントは本当にテンプレートとクラスが_一緒に動作します_。
そして、適切にコンポーネントをテストするためには、目的どおりにそれらを一緒に動作させるテストを行う必要があります。

このようなテストでは、
Angularが行っているようにブラウザのDOMにコンポーネントのホスト要素を作成し、
コンポーネントクラスとテンプレートとして定義されたDOMとのやりとりを調査する必要があります。

Angularの`TestBed`は次のセクションで見るような、この種類のテストを容易にします。
しかし、多くの場合、DOMの関与無しで_このクラスだけでテストすること_は
コンポーネントの動作をより簡単で明白な方法で検証できます。

<div class="alert is-helpful">

  For the sample app that the testing guides describe, see the <live-example name="testing" embedded-style noDownload>sample app</live-example>.

  For the tests features in the testing guides, see <live-example name="testing" stackblitz="specs" noDownload>tests</live-example>.

</div>


{@a component-class-testing}

## コンポーネントクラスのテスト

サービスクラスをテストするのと同じように、コンポーネントクラス自身をテストします。

ユーザーがボタンをクリックしたときにライトをオン/オフ(オンスクリーンメッセージで表される)
の切り替えをする`LightswitchComponent`を考えてみましょう。

<code-example
  path="testing/src/app/demo/demo.ts"
  region="LightswitchComp"
  header="app/demo/demo.ts (LightswitchComp)"></code-example>

きっと、あなたは`click()`メソッドがライトの_オン/オフ_状態を切り替えて、
メッセージを適切にセットすることをテストしたいだけだと思います。

このコンポーネントクラスには依存関係はありません。これらのタイプのクラスをテストするには、依存関係のないサービスの場合と同じ手順に従います。

1. newキーワードを使用してコンポーネントを作成します。
2. APIを叩きます。
3. 公開されている状態のエクスペクテーションをアサートします。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="Lightswitch"
  header="app/demo/demo.spec.ts (Lightswitch tests)"></code-example>

次は、_ツアー・オブ・ヒーロー_チュートリアルの`DashboardHeroComponent`です。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="class"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

_hero_を`@Input`プロパティにバインドし、
_selected_ `@Output`プロパティを通して発生したイベントをリッスンする
親コンポーネントのテンプレート内に表示されます。

`DashboardHeroComponent`や、
その親コンポーネントを作成せずにクラスコードが動作することをテストできます。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="class-only"
  header="app/dashboard/dashboard-hero.component.spec.ts (class tests)"></code-example>

コンポーネントに依存関係がある場合、
`TestBed`を使用してコンポーネントとその依存関係の両方を作成することができます。

次の`WelcomeComponent`は、挨拶するユーザーの名前を知っている`UserService`に依存します。

<code-example
  path="testing/src/app/welcome/welcome.component.ts"
  region="class"
  header="app/welcome/welcome.component.ts"></code-example>

まずは、このコンポーネントの最小限のニーズを満たす`UserService`のモックを作成してください。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="mock-user-service"
  header="app/welcome/welcome.component.spec.ts (MockUserService)"></code-example>

次に、**コンポーネント**と_サービス_の_両方_を`TestBed`の設定に提供して注入します。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-before-each"
  header="app/welcome/welcome.component.spec.ts (class-only setup)"></code-example>

次に、コンポーネントクラスを実行します。Angularがアプリケーションの実行時に[ライフサイクルフックメソッド](guide/lifecycle-hooks)を呼び出すことを覚えておいてください。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-tests"
  header="app/welcome/welcome.component.spec.ts (class-only tests)"></code-example>

## コンポーネントのDOMのテスト

コンポーネント_クラス_のテストは、サービスをテストするのと同じくらい簡単です。

しかし、コンポーネントはクラスだけではありません。
コンポーネントは、DOMや他のコンポーネントとやりとりします。
_クラスのみ_のテストは、クラスの動作については教えてくれます。
コンポーネントが適切にレンダリングされて、ユーザーの入力やジェスチャーに応答したり、
親コンポーネントや子コンポーネントと統合されているかどうかは確認できません。

上記の_クラスのみ_のテストでは、
コンポーネントが実際に画面上でどのように動作するかについて重要な質問に答えることはできません。

- `Lightswitch.clicked()`はユーザーが呼び出せるようなものにバインドされているのか？
- `Lightswitch.message`は表示されているのか？
- ユーザーは実際に`DashboardHeroComponent`で表示されるヒーローを選択できるのか？
- 主人公の名前は、期待された形式(つまり、大文字)で表示されるのか？
- ウェルカムメッセージは`WelcomeComponent`のテンプレートで表示されるのか？

これは、上のような単純なコンポーネントだと問題ではないかもしれません。
しかし、多くのコンポーネントは、
テンプレートに記述されているDOM要素と複雑なやりとりをしているため、
コンポーネントの状態が変わることでHTMLが表示されたり消えたりします。

この種類の質問に答えるには、
コンポーネントに関連付けられたDOM要素を作成する必要があります。
コンポーネントの状態が適切なタイミングで適切に表示されることを確認するためにDOMを検査し、
画面上でのユーザーインタラクションによって、
コンポーネントが期待どおりに動作することをシミュレートする必要があります。

この種類のテストを書くために、
`TestBed`のその他の機能と他のテストヘルパーを使用します。

#### CLIが生成したテスト

CLIが新しいコンポーネントを生成すると、
デフォルトで初期テストファイルを作成します。

たとえば、次のCLIコマンドは、`app/banner`フォルダに`BannerComponent`を生成します(インラインのテンプレートとスタイルを含む):

<code-example language="sh" class="code-shell">
ng generate component banner --inline-template --inline-style --module app
</code-example>

また、コンポーネントのテストファイル、`banner-external.component.spec.ts`の初期テストファイルを生成します。それはこのようになります:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v1"
  header="app/banner/banner-external.component.spec.ts (initial)"></code-example>

<div class="alert is-helpful">

Because `compileComponents` is asynchronous, it uses
the [`async`](api/core/testing/async) utility
function imported from `@angular/core/testing`.

Please refer to the [async](guide/testing-components-scenarios#async) section for more details.

</div>

#### セットアップを減らす

このファイルの最後の3行だけが実際にコンポーネントをテストしている部分で、
そこでしていることは、Angularがコンポーネントを作成できることのアサートです。

ファイルの残りの部分は、より高度なテストを見込んだ定型的なセットアップコードで、構成要素が相当なものに発展した場合に必要と_なるでしょう_。

以下では、これらの高度なテスト機能について学びます。
現時点では、より管理しやすいサイズにするために、このテストファイルを大幅に減らすことができます:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v2"
  header="app/banner/banner-initial.component.spec.ts (minimal)"></code-example>

この例では、`TestBed.configureTestingModule`に渡されたメタデータオブジェクトは、
単にテストするコンポーネントである`BannerComponent`を宣言します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="configureTestingModule"></code-example>

<div class="alert is-helpful">

他の何かを宣言したりインポートする必要はありません。
デフォルトのテストモジュールは、
`@angular/platform-browser`の`BrowserModule`のようなものがあらかじめ設定されています。

後でテストのニーズにあわせて、
インポート、プロバイダー、宣言の一式で`TestBed.configureTestingModule()`を呼び出します。
オプショナルな`override`メソッドを使用して、構成をさらに細かく調整できます。

</div>

{@a create-component}

#### _createComponent()_

`TestBed`を構成したら`createComponent()`メソッドを呼び出します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="createComponent"></code-example>

`TestBed.createComponent()`は、
`BannerComponent`のインスタンスを作成し、
対応する要素をテストランナーのDOMに追加し、[`ComponentFixture`](#component-fixture)を返します。

<div class="alert is-important">

`createComponent`の呼び出し後に`TestBed`を再構成しないでください。

`createComponent`メソッドは現在の`TestBed`の定義をフリーズし、
さらなる設定をできないようにします。

どの`TestBed`を構成するメソッド(`configureTestingModule()`、`get()`、`override...`メソッド)
も呼び出すことはできません。
試してみると、`TestBed`はエラーをスローします。

</div>

{@a component-fixture}

#### _ComponentFixture_

[ComponentFixture](api/core/testing/ComponentFixture)は、作成されたコンポーネントとそれが対応する要素とやりとりするためのテストハーネスです。

フィクスチャーを通してコンポーネントインスタンスにアクセスし、Jasmineのエクスペクテーションを使用して存在を確認してください:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="componentInstance"></code-example>

#### _beforeEach()_

このコンポーネントが発展するにつれて、より多くのテストを追加することになるでしょう。
個々のテストで`TestBed`の構成を複製するのではなく、
セットアップをJasmineの`beforeEach()`といくつかのサポート変数に引き出すようにリファクタリングしましょう。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v3"
 ></code-example>

次に、`fixture.nativeElement`からコンポーネントの要素を取得し、
期待されるテキストを探すテストを追加します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-2"></code-example>

{@a native-element}

#### _nativeElement_

`ComponentFixture.nativeElement`の値は、`any`型です。
のちに`DebugElement.nativeElement`もでてきますが、それも`any`型です。

Angularは、コンパイル時に`nativeElement`のHTML要素の種類やHTML要素であるかどうかを知ることはできません。
アプリケーションは、
サーバーや[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)などの_非ブラウザプラットフォーム_で実行されている可能性があります。
このようなプラットフォームでは、要素のAPIが少なくなっているか、
まったく存在していない可能性があります。

このガイド内のテストはブラウザで実行するように設計されているため、
`nativeElement`の値は常に`HTMLElement`、
またはその派生クラスの1つになります。

それが何らかの`HTMLElement`であることがわかっている場合は、
要素のツリーに深く飛び込むために標準のHTMLの`querySelector`を使用できます。

次は、パラグラフ要素を取得してバナーテキストを探すために`HTMLElement.querySelector`を呼び出すもうひとつのテストです:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-3"></code-example>

{@a debug-element}

#### _DebugElement_

Angularの_fixture_は`fixture.nativeElement`を通して直接コンポーネントの要素を提供します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="nativeElement"></code-example>

次は、`fixture.debugElement.nativeElement`として実装された、実際に便利なメソッドです。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="debugElement-nativeElement"></code-example>

要素へのこの遠回りには正当な理由があります。

`nativeElement`のプロパティは、ランタイム環境に依存します。
これらのテストは、DOMを持たない、またはDOMエミュレーションが`HTMLElement`
API全体をサポートしていない_ブラウザ以外のプラットフォーム_で実行することができます。

Angularは、サポートされているすべてのプラットフォームで安全に動作するよう、`DebugElement`の抽象化に頼ります。
Angularは、HTML要素のツリーを作成する代わりに、ランタイムのプラットフォームの_ネイティブ要素_をラップする`DebugElement`ツリーを作成します。
`nativeElement`プロパティは`DebugElement`をアンラップし、プラットフォーム固有の要素オブジェクトを返します。

このガイドのサンプルテストはブラウザでのみ実行されるように設計されているため、
テスト内の`nativeElement`は、
常にテスト内で探索できる使い慣れたメソッドとプロパティをもつ`HTMLElement`です。

次は、さきほどのテストを`fixture.debugElement.nativeElement`で再実装したものです:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-4"></code-example>

`DebugElement`には、このガイドの他の部分で説明するように、
テストに役立つ他のメソッドとプロパティがあります。

Angularコアライブラリから`DebugElement`シンボルをインポートします。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-debug-element"></code-example>

{@a by-css}
#### _By.css()_

このガイド内のテストはすべてブラウザ上で実行されますが、一部のアプリケーションは、
少なくとも、別のプラットフォームで動作することがあります。

たとえば、接続の悪いデバイスでアプリケーションをより早く起動させる戦略の一環として、コンポーネントをサーバー上で最初にレンダリングすることがあります。
サーバー側のレンダラーは、完全なHTML要素のAPIをサポートしていない可能性があります。`querySelector`をサポートしていない場合、前のテストは失敗する可能性があります。

`DebugElement`は、サポートされているすべてのプラットフォームで動作するクエリメソッドを提供します。
これらのクエリメソッドは、`DebugElement`ツリーのノードが選択基準にマッチすると`true`を返す_述語_関数を使用します。

ランタイムのプラットフォームのライブラリからインポートされた`By`クラスの助けを借りて_述語_を作成します。
次は、ブラウザプラットフォームのための`By`をインポートしています:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-by"></code-example>

次の例では`DebugElement.query()`とブラウザの`By.css`メソッドを使用して、
さきほどのテストを再実装しています。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-5"></code-example>

いくつか注目すべきことがあります:

- `By.css()`静的メソッドは[標準のCSSセレクター](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors "CSS selectors")を使用して
  `DebugElement`ノードを選択します。
- クエリはパラグラフの`DebugElement`を返します。
- パラグラフ要素を取得するためにはその結果をアンラップする必要があります。

CSSセレクターでフィルタリングし、ブラウザの_ネイティブ要素_のプロパティのみをテストする場合、`By.css`でのアプローチは過度のものになるかもしれません。

次の一連のテストで示すように、
`querySelector()`や`querySelectorAll()`などの標準的な`HTMLElement`メソッドを使用してフィルタ処理する方が簡単で、
より明確になることがよくあります。