# サービスのテスト

サービスが意図通りに動作していることを確認するには、サービス専用のテストを作成できます。

サービスは、多くの場合、ユニットテストを実行するのに最もスムーズなファイルです。
以下は、Angularテストユーティリティの助けを借りずに記述された `ValueService` の同期および非同期のユニットテストです。

<docs-code header="demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="ValueService"/>

## `TestBed` を使用したサービスのテスト {#testing-services-with-the-testbed}

アプリケーションは、Angular の [依存関係注入 (DI)](guide/di) に依存してサービスを作成します。
サービスが依存サービスを持っている場合、DI はその依存サービスを見つけたり、作成します。
さらに、その依存サービスに独自の依存関係がある場合、DI はそれらも探し出して作成します。

サービスの _消費者_ として、あなたはこれらについて心配する必要はありません。
コンストラクター引数の順序や、それらがどのように作成されるかについて心配する必要はありません。

サービスの _テスター_ として、少なくともサービス依存関係の最初のレベルについて考える必要はありますが、`TestBed` テストユーティリティを使用してサービスを提供して作成し、コンストラクター引数の順序を処理するときは、Angular DI にサービスの作成を任せることができます。

## Angular `TestBed` {#angular-testbed}

`TestBed` は、Angular のテストユーティリティの中で最も重要なものです。
`TestBed` は、Angular の [@NgModule](guide/ngmodules) をエミュレートする、動的に構築された Angular の _テスト_ モジュールを作成します。

`TestBed.configureTestingModule()` メソッドは、[@NgModule](guide/ngmodules) のほとんどのプロパティを持つことができるメタデータオブジェクトを受け取ります。

サービスをテストするには、テストまたはモックするサービスの配列を `providers` メタデータプロパティに設定します。

<docs-code header="demo.testbed.spec.ts (beforeEach で ValueService を提供)" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-before-each"/>

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

## `beforeEach()` を使用しないテスト {#testing-without-beforeeach}

このガイドのほとんどのテストスイートでは、`beforeEach()` を呼び出して各 `it()` テストの前提条件を設定し、`TestBed` にクラスの作成とサービスの注入を任せています。

`beforeEach()` を呼び出さない、別のテストの考え方があり、`TestBed` を使用せず、クラスを明示的に作成することを好みます。

このスタイルで `MasterService` のテストの1つを書き直す方法を以下に示します。

最初に、_セットアップ_ 関数に、再利用可能な準備コードを `beforeEach()` の代わりに配置します。

<docs-code header="demo.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup"/>

`setup()` 関数は、テストで参照できる可能性のある変数 `masterService` などの変数を、オブジェクトリテラルとして返します。
`describe()` の本文には、_半グローバル_ 変数（例：`let masterService: MasterService`）は定義しません。

次に、各テストは、テスト対象の操作や期待の主張を続行する前に、最初の行で `setup()` を呼び出します。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-test"/>

テストで [_デストラクチャリング代入_](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) を使用して、必要なセットアップ変数を抽出したことに注意してください。

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup-call"/>

多くの開発者は、このアプローチは従来の `beforeEach()` スタイルよりもクリーンで明示的だと感じるでしょう。

このテストガイドでは、従来のスタイルと、デフォルトの [CLI スキーマ](https://github.com/angular/angular-cli) で `beforeEach()` と `TestBed` を使用してテストファイルが生成されますが、独自のプロジェクトで _この代替アプローチ_ を採用することは自由です。

## HTTP サービスのテスト {#testing-http-services}

リモートサーバーにHTTP呼び出しするデータサービスは、通常、Angularの [`HttpClient`](guide/http/testing) サービスを注入して委譲し、XHRを呼び出します。

依存関係が注入された `HttpClient` スパイを使用して、データサービスをテストできます。

<docs-code header="hero.service.spec.ts (スパイを使用したテスト)" path="adev/src/content/examples/testing/src/app/model/hero.service.spec.ts" visibleRegion="test-with-spies"/>

IMPORTANT: `HeroService` メソッドは `Observable` を返します。
Observableに _登録_ することで、(a) 実行させ、(b) メソッドが成功したか失敗したかをアサートする必要があります。

`subscribe()` メソッドは、成功 (`next`) と失敗 (`error`) のコールバックを受け取ります。
エラーを捕捉するために、_両方の_ コールバックを提供してください。
これを怠ると、非同期でキャッチされないObservableエラーが発生し、テストランナーは別のテストによるエラーであると判断する可能性があります。

## `HttpClientTestingModule` {#httpclienttestingmodule}

データサービスと `HttpClient` の間の拡張されたやり取りは複雑で、スパイでモック化するのは難しい場合があります。

`HttpClientTestingModule` を使用すると、これらのテストシナリオをより管理しやすくなります。

このガイドに付属する _コードサンプル_ では `HttpClientTestingModule` が示されていますが、このページでは、`HttpClientTestingModule` を使用したテストを詳しく説明している [HTTP ガイド](guide/http/testing) を参照します。
