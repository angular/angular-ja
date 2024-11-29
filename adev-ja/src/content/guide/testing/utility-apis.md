# テストユーティリティAPI

このページでは、最も役立つAngularテスト機能について説明します。

Angularテストユーティリティには、`TestBed`、`ComponentFixture`、およびテスト環境を制御するいくつかの関数が含まれています。
[`TestBed`](#testbed-api-summary) および [`ComponentFixture`](#component-fixture-api-summary) クラスは、別途説明します。

以下は、スタンドアロン関数の概要を、ユーティリティの利用頻度順に示します。

| 関数                      | 詳細 |
|:---                          |:---     |
| `waitForAsync`               | テスト（`it`）または設定（`beforeEach`）関数の本体を、特別な *非同期テストゾーン* 内で実行します。[waitForAsync](guide/testing/components-scenarios#waitForAsync) を参照してください。                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `fakeAsync`                  | テスト（`it`）関数の本体を、特別な *fakeAsync テストゾーン* 内で実行します。これにより、線形制御フローのコーディングスタイルが可能になります。[fakeAsync](guide/testing/components-scenarios#fake-async) を参照してください。                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `tick`                       | 時間の経過と保留中の非同期アクティビティの完了をシミュレートし、*fakeAsync テストゾーン* 内の *タイマー* および *マイクロタスク* キューの両方をフラッシュします。興味のある読者向けに、この長いブログ投稿、[*タスク、マイクロタスク、キュー、スケジュール*](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules)を紹介します。オプションの引数を受け付け、仮想クロックを指定されたミリ秒数だけ進めます。これにより、その時間枠内にスケジュールされた非同期アクティビティがクリアされます。[tick](guide/testing/components-scenarios#tick) を参照してください。 |
| `inject`                     | 現在の `TestBed` インジェクターから、1 つ以上のサービスをテスト関数に注入します。これは、コンポーネント自体によって提供されるサービスを注入することはできません。[debugElement.injector](guide/testing/components-scenarios#get-injected-services) の議論を参照してください。                                                                                                                                                                                                                                                                                                                                                                          |
| `discardPeriodicTasks`       | `fakeAsync()` テストが保留中のタイマーイベント *タスク*（キューに入れられた `setTimeOut` および `setInterval` コールバック）で終了すると、テストは明確なエラーメッセージで失敗します。 <br /> 一般的に、テストはキューに入れられたタスクなしで終了する必要があります。保留中のタイマータスクが予想される場合は、`discardPeriodicTasks` を呼び出して *タスク* キューをフラッシュし、エラーを回避します。                                                                                                                                                                                                                                                                                          |
| `flushMicrotasks`            | `fakeAsync()` テストが保留中の *マイクロタスク*（未解決の Promise など）で終了すると、テストは明確なエラーメッセージで失敗します。 <br /> 一般的に、テストはマイクロタスクが完了するまで待つ必要があります。保留中のマイクロタスクが予想される場合は、`flushMicrotasks` を呼び出して *マイクロタスク* キューをフラッシュし、エラーを回避します。                                                                                                                                                                                                                                                                                                                 |
| `ComponentFixtureAutoDetect` | [自動的な変更検出](guide/testing/components-scenarios#automatic-change-detection) をオンにするサービスの提供トークン。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `getTestBed`                 | 現在の `TestBed` のインスタンスを取得します。通常、`TestBed` クラスの静的クラスメソッドが十分なため、これは不要です。`TestBed` インスタンスは、静的メソッドとして利用できない、まれに使用されるメンバーをいくつか公開します。                                                                                                                                                                                                                                                                                                                                                                                  |

## `TestBed` クラスの概要

`TestBed` クラスは、主要なAngularテストユーティリティの1つです。
APIは非常に大きく、少しづつ調べていくまで、圧倒される可能性があります。
API全体を理解しようとする前に、このガイドの前半部分を読んで、基本を理解してください。

`configureTestingModule` に渡されるモジュール定義は、`@NgModule` メタデータプロパティのサブセットです。

<docs-code language="javascript">

type TestModuleMetadata = {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata | any[]>;
};

</docs-code>

各オーバーライドメソッドは、`MetadataOverride<T>` を受け取ります。ここで `T` はメソッドに適したメタデータの種類、つまり `@NgModule`、`@Component`、`@Directive`、または `@Pipe` のパラメーターです。

<docs-code language="javascript">

type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};

</docs-code>

`TestBed` APIは、現在の `TestBed` の *グローバル* インスタンスを更新または参照する静的クラスメソッドで構成されています。

内部的には、すべての静的メソッドは、現在のランタイム `TestBed` インスタンスのメソッドをカバーしています。これは、`getTestBed()` 関数によっても返されます。

`beforeEach()` *内* で `TestBed` メソッドを呼び出して、各テストの前に新しい開始を確保します。

以下は、最も重要な静的メソッドを、ユーティリティの利用頻度順に示します。

| メソッド                                                        | 詳細 |
|:---                                                            |:---     |
| `configureTestingModule`                                       | テストシム（`karma-test-shim`、`browser-test-shim`）は、[初期テスト環境](guide/testing) とデフォルトのテストモジュールを確立します。デフォルトのテストモジュールは、基本的な宣言と、すべてのテスターに必要な、いくつかの Angular サービスの代替で構成されています。 <br /> `configureTestingModule` を呼び出して、インポート、宣言（コンポーネント、ディレクティブ、およびパイプ）、およびプロバイダーを追加および削除することで、特定のテストセットのテストモジュール構成を洗練します。                                                                                                                                              |
| `compileComponents`                                            | テストモジュールを構成し終えたら、非同期にコンパイルします。*いずれかの* テストモジュールコンポーネントに `templateUrl` または `styleUrls` がある場合は、このメソッドを **必ず** 呼び出す必要があります。これは、コンポーネントテンプレートとスタイルファイルの取得が必ず非同期であるためです。[compileComponents](guide/testing/components-scenarios#calling-compilecomponents) を参照してください。 <br /> `compileComponents` を呼び出すと、現在の仕様の期間中、`TestBed` の構成は固定されます。                                                                                                                                                                 |
| `createComponent<T>`                                     | 現在の `TestBed` の構成に基づいて、`T` 型のコンポーネントのインスタンスを作成します。`createComponent` を呼び出すと、現在の仕様の期間中、`TestBed` の構成は固定されます。                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `overrideModule`                                               | 指定された `NgModule` のメタデータを置き換えます。モジュールは他のモジュールをインポートできることに注意してください。`overrideModule` メソッドは、現在のテストモジュールを深く掘り下げて、これらの内部モジュールのいずれかを変更できます。                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `overrideComponent`                                            | 指定されたコンポーネントクラスのメタデータを置き換えます。これは、内部モジュールの中に深くネストされている可能性があります。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `overrideDirective`                                            | 指定されたディレクティブクラスのメタデータを置き換えます。これは、内部モジュールの中に深くネストされている可能性があります。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `overridePipe`                                                 | 指定されたパイプクラスのメタデータを置き換えます。これは、内部モジュールの中に深くネストされている可能性があります。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|
 `inject`                           | 現在の `TestBed` インジェクターからサービスを取得します。`inject` 関数は、この目的には多くの場合で十分です。ただし、`inject` は、サービスを提供できない場合にエラーをスローします。 <br /> サービスがオプションの場合どうすればよいですか？ <br /> `TestBed.inject()` メソッドは、オプションの第 2 パラメーターとして、Angular がプロバイダーを見つけられない場合に返すオブジェクト（この例では `null`）を取ります。 <docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="testbed-get-w-null"/> `TestBed.inject` を呼び出すと、現在の仕様の期間中、`TestBed` の構成は固定されます。 |
|
 `initTestEnvironment` | テストの実行全体でテスト環境を初期化します。 <br /> テストシム（`karma-test-shim`、`browser-test-shim`）はこれを実行するため、自分で呼び出す必要はほとんどありません。 <br /> このメソッドは *ちょうど 1 回* 呼び出します。テストの実行中にこのデフォルトを変更するには、最初に `resetTestEnvironment` を呼び出します。 <br /> Angular コンパイラーファクトリ、`PlatformRef`、およびデフォルトの Angular テストモジュールを指定します。ブラウザ以外のプラットフォームの代替手段は、`@angular/platform-<platform_name>/testing/<platform_name>` という一般的な形式で利用できます。                                                                  |
| `resetTestEnvironment`                                         | デフォルトのテストモジュールを含む、初期テスト環境をリセットします。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

`TestBed` インスタンスのメソッドのいくつかは、静的な `TestBed` *クラス* メソッドではカバーされていません。
これらは、めったに必要ありません。

## `ComponentFixture`

`TestBed.createComponent<T>` は、コンポーネント `T` のインスタンスを作成し、そのコンポーネントの強く型付けされた `ComponentFixture` を返します。

`ComponentFixture` のプロパティとメソッドは、コンポーネント、そのDOM表現、およびAngular環境の側面へのアクセスを提供します。

### `ComponentFixture` のプロパティ

以下は、テスターにとって最も重要なプロパティを、ユーティリティの利用頻度順に示します。

| プロパティ          | 詳細 |
|:---                 |:---     |
| `componentInstance` | `TestBed.createComponent` によって作成されたコンポーネントクラスのインスタンス。                                                                                                                                                                                                                          |
| `debugElement`      | コンポーネントのルート要素に関連付けられた `DebugElement`。 <br /> `debugElement` は、テストとデバッグ中に、コンポーネントとその DOM 要素に関する洞察を提供します。これは、テスターにとって重要なプロパティです。最も興味深いメンバーは、[下記](#debug-element-details) に記載されています。 |
| `nativeElement`     | コンポーネントのルートにあるネイティブ DOM 要素。                                                                                                                                                                                                                                               |
| `changeDetectorRef` | コンポーネントの `ChangeDetectorRef`。 <br /> `ChangeDetectorRef` は、コンポーネントが `ChangeDetectionStrategy.OnPush` メソッドを持っているか、コンポーネントの変更検知がプログラムによって制御されている場合に最も役立ちます。                                                   |

### `ComponentFixture` のメソッド

*fixture* メソッドは、Angularにコンポーネントツリーで特定のタスクを実行させます。
シミュレートされたユーザーアクションに応答して、Angularの動作をトリガーするには、これらのメソッドを呼び出します。

以下は、テスターにとって最も役立つメソッドです。

| メソッド             | 詳細 |
|:---                 |:---     |
| `detectChanges`     | コンポーネントの変更検知サイクルをトリガーします。 <br /> コンポーネントを初期化するには、これを呼び出します（`ngOnInit` を呼び出します）。また、テストコードの後、コンポーネントのデータバインドプロパティ値を変更します。Angular は、`personComponent.name` を変更したことを認識していないため、`detectChanges` を呼び出すまで、`name` バインディングを更新しません。 <br /> `detectChanges(false)` として呼び出さない限り、後続で `checkNoChanges` を実行して、循環的な更新がないことを確認します。                                                                                    |
| `autoDetectChanges` | `true` に設定すると、fixture が変更を自動的に検出します。 <br /> 自動検出が `true` の場合、テスト fixture はコンポーネントの作成直後に `detectChanges` を呼び出します。その後、適切なゾーンイベントを監視し、それに応じて `detectChanges` を呼び出します。テストコードでコンポーネントのプロパティ値を直接変更する場合は、それでもデータバインディングの更新をトリガーするために、`fixture.detectChanges` を呼び出す必要がある可能性があります。 <br /> デフォルトは `false` です。テストの動作を細かく制御したいテスターは、通常、これを `false` のままにします。 |
| `checkNoChanges`    | 変更検知を実行して、保留中の変更がないことを確認します。変更がある場合は、例外をスローします。                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `isStable`          | fixture が現在 *安定* している場合は、`true` を返します。非同期タスクがまだ完了していない場合は、`false` を返します。                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `whenStable`        | fixture が安定したら解決される Promise を返します。 <br /> 非同期アクティビティまたは非同期的な変更検知の完了後にテストを再開するには、その Promise をフックします。[whenStable](guide/testing/components-scenarios#when-stable) を参照してください。                                                                                                                                                                                                                                                                                                  |
| `destroy`           | コンポーネントの破棄をトリガーします。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### `DebugElement`

`DebugElement` は、コンポーネントのDOM表現に関する重要な洞察を提供します。

テストのルートコンポーネントの `DebugElement`（`fixture.debugElement` によって返される）から、fixtureの要素とコンポーネントのサブツリー全体を（クエリを使用して）移動できます。

以下は、テスターにとって最も役立つ `DebugElement` のメンバーを、ユーティリティの利用頻度順に示します。

| メンバー               | 詳細 |
|:---                   |:---     |
| `nativeElement`       | ブラウザの対応する DOM 要素                                                                                                                                                                                                                                                                        |
| `query`               | `query(predicate: Predicate<DebugElement>)` を呼び出すと、サブツリーの任意の深さで、[述語](#query-predicate) と一致する最初の `DebugElement` が返されます。                                                                                                                                                                                                                                        |
| `queryAll`            | `queryAll(predicate: Predicate<DebugElement>)` を呼び出すと、サブツリーの任意の深さで、[述語](#query-predicate) と一致するすべての `DebugElements` が返されます。                                                                                                                                                                                                                                              |
| `injector`            | ホスト依存インジェクター。たとえば、ルート要素のコンポーネントインスタンスインジェクター。                                                                                                                                                                                                                                                                                                              |
| `componentInstance`   | 要素自身のコンポーネントインスタンス（存在する場合）。                                                                                                                                                                                                                                                                                                                                                    |
| `context`             | この要素に親コンテキストを提供するオブジェクト。多くの場合、この要素を管理する祖先コンポーネントインスタンスです。 <br /> 要素が `*ngFor` 内で繰り返される場合、コンテキストは `NgForOf` で、その `$implicit` プロパティは行インスタンス値の値です。たとえば、`*ngFor="let hero of heroes"` の `hero` です。                                                                   |
| `children`            | 直近の `DebugElement` の子。`children` を介して階層を下降することで、ツリーを移動します。  `DebugElement` には `childNodes` もあり、これは `DebugNode` オブジェクトのリストです。`DebugElement` は `DebugNode` オブジェクトから派生しており、多くの場合、要素よりも多くのノードがあります。テスターは、通常、プレーンノードを無視できます。                                                                  |
| `parent`              | `DebugElement` の親。これがルート要素の場合は `null` です。                                                                                                                                                                                                                                                                                                                                            |
| `name`                | 要素が要素の場合、要素のタグ名。                                                                                                                                                                                                                                                                                                                                                              |
| `triggerEventHandler` | イベントに名前が付けられている場合、要素の `listeners` コレクションに対応するリスナーがある場合は、そのイベントをトリガーします。第 2 パラメーターは、ハンドラーで予想される *イベントオブジェクト* です。[triggerEventHandler](guide/testing/components-scenarios#trigger-event-handler) を参照してください。 <br /> イベントにリスナーがない場合や、その他の問題がある場合は、`nativeElement.dispatchEvent(eventObject)` を呼び出すことを検討してください。 |
| `listeners`           | コンポーネントの `@Output` プロパティまたは要素のイベントプロパティに添付されたコールバック。                                                                                                                                                                                                                                                                                                   |
| `providerTokens`      | このコンポーネントのインジェクターのルックアップトークン。コンポーネント自体と、コンポーネントが `providers` メタデータにリストしているトークンが含まれます。                                                                                                                                                                                                                                                            |
| `source`              | ソースコンポーネントテンプレートでこの要素を見つける場所。                                                                                                                                                                                                                                                                                                                                            |
| `references`          | テンプレートローカル変数（たとえば、`#foo`）に関連付けられているオブジェクトの辞書。ローカル変数名でキー付けされます。                                                                                                                                                                                                                                                                                        |

`DebugElement.query(predicate)` および `DebugElement.queryAll(predicate)` メソッドは、ソース要素のサブツリーをフィルター処理して、一致する `DebugElement` を見つける述語を受け取ります。

述語は、`DebugElement` を受け取り、*真偽値* を返す任意のメソッドです。
次の例は、"content" という名前のテンプレートローカル変数への参照を持つすべての `DebugElements` を見つけます。

<docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="custom-predicate"/>

Angularの `By` クラスには、一般的な述語の3つの静的メソッドがあります。

| 静的メソッド             | 詳細 |
|:---                       |:---     |
| `By.all`                  | すべての要素を返す                                                        |
| `By.css(selector)`        | 一致する CSS セレクターを持つ要素を返す                                |
| `By.directive(directive)` | ディレクティブクラスのインスタンスに Angular が一致させた要素を返す |

<docs-code header="app/hero/hero-list.component.spec.ts" path="adev/src/content/examples/testing/src/app/hero/hero-list.component.spec.ts" visibleRegion="by"/>
