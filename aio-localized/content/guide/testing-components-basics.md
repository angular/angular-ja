# コンポーネントテストの基本

コンポーネントは、Angular アプリケーションの他のすべての部品とは違い、
HTML テンプレートと TypeScript クラスを組み合わせています。
コンポーネントは本当にテンプレートとクラスが*一緒に動作します*。
そして、適切にコンポーネントをテストするためには、目的どおりにそれらを一緒に動作させるテストを行う必要があります。

このようなテストでは、
Angular が行っているようにブラウザの DOM にコンポーネントのホスト要素を作成し、
コンポーネントクラスとテンプレートとして定義された DOM とのやりとりを調査する必要があります。

Angular の`TestBed`は次のセクションで見るような、この種類のテストを容易にします。
しかし、多くの場合、DOM の関与無しで*このクラスだけでテストすること*は
コンポーネントの動作をより簡単で明白な方法で検証できます。

<div class="alert is-helpful">

If you'd like to experiment with the application that this guide describes, you can <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

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

きっと、あなたは`click()`メソッドがライトの*オン/オフ*状態を切り替えて、
メッセージを適切にセットすることをテストしたいだけだと思います。

このコンポーネントクラスには依存関係はありません。これらのタイプのクラスをテストするには、依存関係のないサービスの場合と同じ手順に従います。

1. new キーワードを使用してコンポーネントを作成します。
2. API を叩きます。
3. 公開されている状態のエクスペクテーションをアサートします。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="Lightswitch"
  header="app/demo/demo.spec.ts (Lightswitch tests)"></code-example>

次は、*ツアー・オブ・ヒーロー*チュートリアルの`DashboardHeroComponent`です。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="class"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

*hero*を`@Input`プロパティにバインドし、
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

次に、**コンポーネント**と*サービス*の*両方*を`TestBed`の設定に提供して注入します。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-before-each"
  header="app/welcome/welcome.component.spec.ts (class-only setup)"></code-example>

次に、コンポーネントクラスを実行します。Angular がアプリケーションの実行時に[ライフサイクルフックメソッド](guide/lifecycle-hooks)を呼び出すことを覚えておいてください。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-tests"
  header="app/welcome/welcome.component.spec.ts (class-only tests)"></code-example>

## コンポーネントの DOM のテスト

コンポーネント*クラス*のテストは、サービスをテストするのと同じくらい簡単です。

しかし、コンポーネントはクラスだけではありません。
コンポーネントは、DOM や他のコンポーネントとやりとりします。
*クラスのみ*のテストは、クラスの動作については教えてくれます。
コンポーネントが適切にレンダリングされて、ユーザーの入力やジェスチャーに応答したり、
親コンポーネントや子コンポーネントと統合されているかどうかは確認できません。

上記の*クラスのみ*のテストでは、
コンポーネントが実際に画面上でどのように動作するかについて重要な質問に答えることはできません。

- `Lightswitch.clicked()`はユーザーが呼び出せるようなものにバインドされているのか？
- `Lightswitch.message`は表示されているのか？
- ユーザーは実際に`DashboardHeroComponent`で表示されるヒーローを選択できるのか？
- 主人公の名前は、期待された形式(つまり、大文字)で表示されるのか？
- ウェルカムメッセージは`WelcomeComponent`のテンプレートで表示されるのか？

これは、上のような単純なコンポーネントだと問題ではないかもしれません。
しかし、多くのコンポーネントは、
テンプレートに記述されている DOM 要素と複雑なやりとりをしているため、
コンポーネントの状態が変わることで HTML が表示されたり消えたりします。

この種類の質問に答えるには、
コンポーネントに関連付けられた DOM 要素を作成する必要があります。
コンポーネントの状態が適切なタイミングで適切に表示されることを確認するために DOM を検査し、
画面上でのユーザーインタラクションによって、
コンポーネントが期待どおりに動作することをシミュレートする必要があります。

この種類のテストを書くために、
`TestBed`のその他の機能と他のテストヘルパーを使用します。

#### CLI が生成したテスト

CLI が新しいコンポーネントを生成すると、
デフォルトで初期テストファイルを作成します。

たとえば、次の CLI コマンドは、`app/banner`フォルダに`BannerComponent`を生成します(インラインのテンプレートとスタイルを含む):

<code-example language="sh">
ng generate component banner --inline-template --inline-style --module app
</code-example>

また、コンポーネントのテストファイル、`banner-external.component.spec.ts`の初期テストファイルを生成します。それはこのようになります:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v1"
  header="app/banner/banner-external.component.spec.ts (initial)"></code-example>

<div class="alert is-helpful">

Because `compileComponents` is asynchronous, it uses
the [`waitForAsync`](api/core/testing/waitForAsync) utility
function imported from `@angular/core/testing`.

Please refer to the [waitForAsync](guide/testing-components-scenarios#waitForAsync) section for more details.

</div>

#### セットアップを減らす

このファイルの最後の 3 行だけが実際にコンポーネントをテストしている部分で、
そこでしていることは、Angular がコンポーネントを作成できることのアサートです。

ファイルの残りの部分は、より高度なテストを見込んだ定型的なセットアップコードで、構成要素が相当なものに発展した場合に必要と*なるでしょう*。

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
対応する要素をテストランナーの DOM に追加し、[`ComponentFixture`](#component-fixture)を返します。

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

フィクスチャーを通してコンポーネントインスタンスにアクセスし、Jasmine のエクスペクテーションを使用して存在を確認してください:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="componentInstance"></code-example>

#### _beforeEach()_

このコンポーネントが発展するにつれて、より多くのテストを追加することになるでしょう。
個々のテストで`TestBed`の構成を複製するのではなく、
セットアップを Jasmine の`beforeEach()`といくつかのサポート変数に引き出すようにリファクタリングしましょう。

<code-example
path="testing/src/app/banner/banner-initial.component.spec.ts"
region="v3"

> </code-example>

次に、`fixture.nativeElement`からコンポーネントの要素を取得し、
期待されるテキストを探すテストを追加します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-2"></code-example>

{@a native-element}

#### _nativeElement_

`ComponentFixture.nativeElement`の値は、`any`型です。
のちに`DebugElement.nativeElement`もでてきますが、それも`any`型です。

Angular は、コンパイル時に`nativeElement`の HTML 要素の種類や HTML 要素であるかどうかを知ることはできません。
アプリケーションは、
サーバーや[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)などの*非ブラウザプラットフォーム*で実行されている可能性があります。
このようなプラットフォームでは、要素の API が少なくなっているか、
まったく存在していない可能性があります。

このガイド内のテストはブラウザで実行するように設計されているため、
`nativeElement`の値は常に`HTMLElement`、
またはその派生クラスの 1 つになります。

それが何らかの`HTMLElement`であることがわかっている場合は、
要素のツリーに深く飛び込むために標準の HTML の`querySelector`を使用できます。

次は、パラグラフ要素を取得してバナーテキストを探すために`HTMLElement.querySelector`を呼び出すもうひとつのテストです:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-3"></code-example>

{@a debug-element}

#### _DebugElement_

Angular の*fixture*は`fixture.nativeElement`を通して直接コンポーネントの要素を提供します。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="nativeElement"></code-example>

次は、`fixture.debugElement.nativeElement`として実装された、実際に便利なメソッドです。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="debugElement-nativeElement"></code-example>

要素へのこの遠回りには正当な理由があります。

`nativeElement`のプロパティは、ランタイム環境に依存します。
これらのテストは、DOM を持たない、または DOM エミュレーションが`HTMLElement`
API 全体をサポートしていない*ブラウザ以外のプラットフォーム*で実行することができます。

Angular は、サポートされているすべてのプラットフォームで安全に動作するよう、`DebugElement`の抽象化に頼ります。
Angular は、HTML 要素のツリーを作成する代わりに、ランタイムのプラットフォームの*ネイティブ要素*をラップする`DebugElement`ツリーを作成します。
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

Angular コアライブラリから`DebugElement`シンボルをインポートします。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-debug-element"></code-example>

{@a by-css}

#### _By.css()_

このガイド内のテストはすべてブラウザ上で実行されますが、一部のアプリケーションは、
少なくとも、別のプラットフォームで動作することがあります。

たとえば、接続の悪いデバイスでアプリケーションをより早く起動させる戦略の一環として、コンポーネントをサーバー上で最初にレンダリングすることがあります。
サーバー側のレンダラーは、完全な HTML 要素の API をサポートしていない可能性があります。`querySelector`をサポートしていない場合、前のテストは失敗する可能性があります。

`DebugElement`は、サポートされているすべてのプラットフォームで動作するクエリメソッドを提供します。
これらのクエリメソッドは、`DebugElement`ツリーのノードが選択基準にマッチすると`true`を返す*述語*関数を使用します。

ランタイムのプラットフォームのライブラリからインポートされた`By`クラスの助けを借りて*述語*を作成します。
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

- `By.css()`静的メソッドは[標準の CSS セレクター](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors 'CSS selectors')を使用して
  `DebugElement`ノードを選択します。
- クエリはパラグラフの`DebugElement`を返します。
- パラグラフ要素を取得するためにはその結果をアンラップする必要があります。

CSS セレクターでフィルタリングし、ブラウザの*ネイティブ要素*のプロパティのみをテストする場合、`By.css`でのアプローチは過度のものになるかもしれません。

`querySelector()`や`querySelectorAll()`などの標準的な`HTMLElement`メソッドを使用してフィルタ処理する方が簡単で、
より明確になることがよくあります。
