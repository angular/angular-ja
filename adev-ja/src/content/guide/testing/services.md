# サービスのテスト

サービスが意図通りに動作していることを確認するには、サービス専用のテストを作成できます。

サービスは、多くの場合、ユニットテストを実行するのに最もスムーズなファイルです。
以下は、Angularテストユーティリティの助けを借りずに記述された `ValueService` の同期および非同期のユニットテストです。

<docs-code header="app/demo/demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="ValueService"/>

## 依存関係のあるサービス

サービスは、Angular がコンストラクターに注入する他のサービスに依存することがよくあります。
多くの場合、サービスのコンストラクターを呼び出す際に、これらの依存関係を手動で作成して *注入* できます。

`MasterService` は、単純な例です。

<docs-code header="app/demo/demo.ts" path="adev/src/content/examples/testing/src/app/demo/demo.ts" visibleRegion="MasterService"/>

`MasterService` は、唯一のメソッドである `getValue` を、注入された `ValueService` に委譲します。

テストを行うには、いくつかの方法があります。

<docs-code header="app/demo/demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="MasterService"/>

最初のテストでは、`new` で `ValueService` を作成し、`MasterService` コンストラクターに渡します。

ただし、実際のサービスを注入することは、ほとんどの場合、うまく機能しません。ほとんどの依存サービスは作成と制御が難しいからです。

代わりに、依存関係をモック化し、ダミー値を使用するか、関連するサービスメソッドに [スパイ](https://jasmine.github.io/tutorials/your_first_suite#section-Spies) を作成します。

HELPFUL: スパイは、通常、サービスをモック化する最良の方法なので、スパイを使用することをお勧めします。

これらの標準的なテストテクニックは、サービスを単体でユニットテストするのに適しています。

ただし、ほとんどの場合、Angular の依存関係注入を使用してサービスをアプリケーションクラスに注入します。そのため、その使用パターンを反映したテストを行う必要があります。
Angular のテストユーティリティを使用すると、注入されたサービスがどのように動作するかを簡単に調査できます。

## `TestBed` を使用したサービスのテスト

アプリケーションは、Angular の [依存関係注入 (DI)](guide/di) に依存してサービスを作成します。
サービスが依存サービスを持っている場合、DI はその依存サービスを見つけたり、作成します。
さらに、その依存サービスに独自の依存関係がある場合、DI はそれらも探し出して作成します。

サービスの *消費者* として、あなたはこれらについて心配する必要はありません。
コンストラクター引数の順序や、それらがどのように作成されるかについて心配する必要はありません。

サービスの *テスター* として、少なくともサービス依存関係の最初のレベルについて考える必要はありますが、`TestBed` テストユーティリティを使用してサービスを提供して作成し、コンストラクター引数の順序を処理するときは、Angular DI にサービスの作成を任せることができます。

## Angular `TestBed`

`TestBed` は、Angular のテストユーティリティの中で最も重要なものです。
`TestBed` は、Angular の [@NgModule](guide/ngmodules) をエミュレートする、動的に構築された Angular の *テスト* モジュールを作成します。

`TestBed.configureTestingModule()` メソッドは、[@NgModule](guide/ngmodules) のほとんどのプロパティを持つことができるメタデータオブジェクトを受け取ります。

サービスをテストするには、テストまたはモックするサービスの配列を `providers` メタデータプロパティに設定します。

<docs-code header="app/demo/demo.testbed.spec.ts (beforeEach で ValueService を提供)" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-before-each"/>

次に、サービスクラスを引数として `TestBed.inject()` を呼び出して、テスト内でサービスを注入します。

HELPFUL: `TestBed.get()` は、Angular バージョン 9 以降で非推奨になりました。
重大な変更を最小限に抑えるため、Angular は `TestBed.inject()` という新しい関数を導入しました。これは、代わりに使用する必要があります。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-it"/>

または、セットアップの一部としてサービスを注入したい場合は、`beforeEach()` 内で行います。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-before-each"> </docs-code>

依存関係のあるサービスをテストする場合は、`providers` 配列にモックを提供します。

次の例では、モックはスパイオブジェクトです。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-before-each"/>

テストでは、以前と同じように、そのスパイを使用します。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-it"/>

## `beforeEach()` を使用しないテスト

このガイドのほとんどのテストスイートでは、`beforeEach()` を呼び出して各 `it()` テストの前提条件を設定し、`TestBed` にクラスの作成とサービスの注入を任せています。

`beforeEach()` を呼び出さない、別のテストの考え方があり、`TestBed` を使用せず、クラスを明示的に作成することを好みます。

このスタイルで `MasterService` のテストの1つを書き直す方法を以下に示します。

最初に、*セットアップ* 関数に、再利用可能な準備コードを `beforeEach()` の代わりに配置します。

<docs-code header="app/demo/demo.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup"/>

`setup()` 関数は、テストで参照できる可能性のある変数 `masterService` などの変数を、オブジェクトリテラルとして返します。
`describe()` の本文には、*半グローバル* 変数（例：`let masterService: MasterService`）は定義しません。

次に、各テストは、テスト対象の操作や期待の主張を続行する前に、最初の行で `setup()` を呼び出します。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-test"/>

テストで [*デストラクチャリング代入*](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) を使用して、必要なセットアップ変数を抽出したことに注意してください。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup-call"/>

多くの開発者は、このアプローチは従来の `beforeEach()` スタイルよりもクリーンで明示的だと感じるでしょう。

このテストガイドでは、従来のスタイルと、デフォルトの [CLI スキーマ](https://github.com/angular/angular-cli) で `beforeEach()` と `TestBed` を使用してテストファイルが生成されますが、独自のプロジェクトで *この代替アプローチ* を採用することは自由です。

## HTTP サービスのテスト

リモートサーバーにHTTP呼び出しするデータサービスは、通常、Angularの [`HttpClient`](guide/http/testing) サービスを注入して委譲し、XHRを呼び出します。

依存関係が注入された `HttpClient` スパイを使用して、データサービスをテストできます。

<docs-code header="app/model/hero.service.spec.ts (スパイを使用したテスト)" path="adev/src/content/examples/testing/src/app/model/hero.service.spec.ts" visibleRegion="test-with-spies"/>

IMPORTANT: `HeroService` メソッドは `Observable` を返します。
Observableに *登録* することで、(a) 実行させ、(b) メソッドが成功したか失敗したかをアサートする必要があります。

`subscribe()` メソッドは、成功 (`next`) と失敗 (`error`) のコールバックを受け取ります。
エラーを捕捉するために、*両方の* コールバックを提供してください。
これを怠ると、非同期でキャッチされないObservableエラーが発生し、テストランナーは別のテストによるエラーであると判断する可能性があります。

## `HttpClientTestingModule`

データサービスと `HttpClient` の間の拡張されたやり取りは複雑で、スパイでモック化するのは難しい場合があります。

`HttpClientTestingModule` を使用すると、これらのテストシナリオをより管理しやすくなります。

このガイドに付属する *コードサンプル* では `HttpClientTestingModule` が示されていますが、このページでは、`HttpClientTestingModule` を使用したテストを詳しく説明している [HTTP ガイド](guide/http/testing) を参照します。
