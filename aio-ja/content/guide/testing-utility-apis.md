# テスティングユーティリティAPI

This page describes the most useful Angular testing features.

Angular テスティングユーティリティには、`TestBed`、`ComponentFixture`、およびテスト環境を制御するいくつかの関数が含まれています。
[_TestBed_](#testbed-api-summary)クラスと[_ComponentFixture_](#component-fixture-api-summary)クラスは別々に扱います。

次では、役に立ちそうな順でスタンドアロン関数の概要を説明します:

<table>
  <tr>
    <th>
      関数
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>waitForAsync</code>
    </td>

    <td>

    特別な_非同期テストゾーン_内でテスト（`it`）またはセットアップ（`beforeEach`）関数の本体を実行します。
    [waitForAsync](guide/testing-components-scenarios#waitForAsync)を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>fakeAsync</code>
    </td>

    <td>

      特別な_fakeAsyncテストゾーン_内でテストの本体(`it`)を実行し、線形コントロールフローのコーディングスタイルを可能にします。
      [fakeAsync](guide/testing-components-scenarios#fake-async)を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>tick</code>
    </td>

    <td>

      _fakeAsyncテストゾーン_内の_タイマー_と_マイクロタスク_キューの両方をフラッシュすることにより、
      時間の経過と非同期処理の完了をシミュレートします。

      <div class="alert is-helpful">

      好奇心を持った読者は、
      この長いブログ記事["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)を楽しめるかもしれません。

      </div>

      仮想クロックを指定されたミリ秒数だけ前進させ、
      その時間枠内でスケジュールされた非同期アクティビティをクリアするオプションの引数を受け入れます。
      [tick](guide/testing-components-scenarios#tick)
      を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
       <code>inject</code>
    </td>

    <td>

      現在の`TestBed`インジェクターから1つ以上のサービスをテスト関数に注入します。
      コンポーネント自身によって提供されるサービスを注入することはできません。
      [debugElement.injector](guide/testing-components-scenarios#get-injected-services)の説明を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>discardPeriodicTasks</code>
    </td>

    <td>

      `fakeAsync()`テストが保留中のタイマーイベント_タスク_（キューされた`setTimeOut`および`setInterval`コールバック）を持ったまま終了すると、
      テストは失敗し、明確なエラーメッセージが表示されます。

      一般に、テストはキューにタスクが入っていない状態で終了する必要があります。
      保留中のタイマータスクが予測される場合は、
      _タスク_キューをフラッシュするために`discardPeriodicTasks`を呼び出してエラーを回避してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>flushMicrotasks</code>
    </td>

    <td>

      `fakeAsync()`テストが未解決のPromiseなどの保留中の_マイクロタスク_を持ったまま終了すると、
      テストは失敗し、明確なエラーメッセージが表示されます。

      一般に、テストはマイクロタスクが完了するのを待つべきです。
      保留中のマイクロタスクが予想される場合は、
      _マイクロタスク_キューをフラッシュするために`flushMicrotasks`を呼び出してエラーを回避してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>ComponentFixtureAutoDetect</code>
    </td>

    <td>

      [自動変更検知](guide/testing-components-scenarios#automatic-change-detection)を有効にする、サービスのプロバイダートークン。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>getTestBed</code>
    </td>

    <td>

      `TestBed`の現在のインスタンスを取得します。
      通常、`TestBed`クラスの静的クラスメソッドで十分です。
      `TestBed`インスタンスは、
      静的メソッドとしては使用できない(ほとんど使用されない)メンバーを公開します。

    </td>
  </tr>
</table>

{@a testbed-class-summary}
#### _TestBed_ クラスの概要

`TestBed`クラスは、主要なAngularテストユーティリティの1つです。
そのAPIは巨大で、
あなたがそれを調べるまで少しの時間で圧倒されるかもしれません。
完全なAPIを吸収しようとする前に、まずこのガイドの最初の部分を読んで基礎を理解してください。

`configureTestingModule`に渡されるモジュール定義は、
`@NgModule`メタデータプロパティのサブセットです。

<code-example language="javascript">
  type TestModuleMetadata = {
    providers?: any[];
    declarations?: any[];
    imports?: any[];
    schemas?: Array&lt;SchemaMetadata | any[]&gt;;
  };
</code-example>

{@a metadata-override-object}

各オーバーライドメソッドは`MetadataOverride<T>`を受け取ります。
ここで、`T`はメソッドに適したメタデータの種類、
つまり`@NgModule`、`@Component`、`@Directive`、または`@Pipe`のパラメータです。

<code-example language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

{@a testbed-methods}
{@a testbed-api-summary}

`TestBed` APIは、`TestBed`の_グローバル_インスタンスを更新または参照する静的クラスメソッドで構成されています。

内部的には、すべての静的メソッドは、現在のランタイムの`TestBed`インスタンスのメソッドをカバーします。
これは、`getTestBed()`関数によって返されます。

`beforeEach()`_内_で`TestBed`メソッドを呼び出して、個々のテストの初期化を確実にしてください。

役に立ちそうな順に、もっとも重要な静的メソッドを説明します。

<table>
  <tr>
    <th>
      メソッド
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>configureTestingModule</code>
    </td>

    <td>

      テストシム（`karma-test-shim`、`browser-test-shim`）は、
      [初期テスト環境](guide/testing)とデフォルトテストモジュールを構築します。
      デフォルトのテストモジュールは、すべてのテスターが必要とする基本的な宣言といくつかのAngularサービスの代替で構成されています。

      `configureTestingModule`を呼び出すと、インポート、宣言（コンポーネント、ディレクティブ、パイプ）、
      およびプロバイダーの追加と削除を行い、特定のテストセットのためにテストモジュールの構成を絞り込むことができます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>compileComponents</code>
    </td>

    <td>

      テストモジュールの構成が完了したら、テストモジュールを非同期でコンパイルします。
      コンポーネントテンプレートとスタイルファイルの取得は必ず非同期であるため、
      テストモジュールコンポーネントの_いずれか_に`templateUrl`または`styleUrls`がある場合は、このメソッドを呼び出す**必要があります**。
      [compileComponents](guide/testing-components-scenarios#compile-components)を参照してください。

      `compileComponents`を呼び出した後、`TestBed`の構成は現在のスペックの期間中フリーズされます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>createComponent&lt;T&gt;</code>
    </td>

    <td>

      現在の`TestBed`構成に基づいて、タイプ`T`のコンポーネントのインスタンスを作成します。
      `createComponent`を呼び出した後、`TestBed`設定は現在のスペックの期間中フリーズされます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideModule</code>
    </td>
    <td>

      指定された`NgModule`のメタデータを置き換えます。モジュールは他のモジュールをインポートできることを思い出してください。
      `overrideModule`メソッドは、これらの内部モジュールの1つを変更するために、
      現在のテストモジュールに深くリーチすることができます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideComponent</code>
    </td>

    <td>

      指定されたコンポーネントクラスのメタデータを置き換えます。
      内部モジュールの深くネストしたコンポーネントでも可能です。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideDirective</code>
    </td>

    <td>

      指定されたディレクティブクラスのメタデータを置き換えます。
      内部モジュールの深くネストしたディレクティブでも可能です。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overridePipe</code>
    </td>
    <td>

      指定されたパイプクラスのメタデータを置き換えます。
      内部モジュールの深くネストしたパイプでも可能です。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-inject}
      <code>inject</code>
    </td>

    <td>

      現在の`TestBed`インジェクターからサービスを取得します。

      `inject`関数は、この用途で使用するとき、多くの場合で適切です。
      しかし、`inject`がサービスを提供できない場合は、エラーをスローします。

      サービスがオプショナルな場合はどうなるでしょうか?

      `TestBed.inject()`メソッドはオプショナルな第2引数を受け取ります。
      これはAngularがプロバイダーを見つけることができない場合に返すオブジェクトです
      （この例では`null`）:

      <code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="testbed-get-w-null" header="app/demo/demo.testbed.spec.ts"></code-example>

      `TestBed.inject`を呼び出した後、`TestBed`の構成は現在のスペックの期間中フリーズします。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-initTestEnvironment}
      <code>initTestEnvironment</code>
    </td>
    <td>

      テスト実行全体のテスト環境を初期化します。

      テストシム（`karma-test-shim`, `browser-test-shim`）がそれを呼び出してくれるので、
      それを自分で呼び出す理由はめったにありません。

      このメソッドを_1回だけ_呼び出すことができます。
      テストの実行中にこのデフォルトを変更する必要がある場合は、最初に`resetTestEnvironment`を呼び出してください。

      Angularコンパイラファクトリー、`PlatformRef`、およびデフォルトのAngularテストモジュールを指定してください。
      非ブラウザプラットフォームでの代替手段は、
      一般的な形式、`@angular/platform-<platform_name>/testing/<platform_name>`で利用できます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>resetTestEnvironment</code>
    </td>
    <td>

      デフォルトテストモジュールを含む初期のテスト環境をリセットします。

    </td>
  </tr>
</table>

いくつかの`TestBed`インスタンスメソッドは静的な`TestBed`クラスメソッドがカバーしていないものです。
これらはほとんど必要ありません。

{@a component-fixture-api-summary}

#### _ComponentFixture_

`TestBed.createComponent<T>`は、
コンポーネント`T`のインスタンスを作成し、
そのコンポーネントに対して強く型付けされた`ComponentFixture`を返します。

`ComponentFixture`のプロパティとメソッドは、コンポーネント、そのDOM表現、
およびAngularの環境側面へのアクセスを提供します。

{@a component-fixture-properties}

#### _ComponentFixture_ プロパティ

テスターのためのもっとも重要なプロパティを役に立ちそうな順で紹介します。

<table>
  <tr>
    <th>
      プロパティ
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      `TestBed.createComponent`によって作成されたコンポーネントクラスのインスタンスです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>debugElement</code>
    </td>

    <td>

      コンポーネントのルート要素に関連付けられた`DebugElement`。

      `debugElement`は、テストおよびデバッグ中に、コンポーネントとそのDOM要素を把握する手がかりになります。
      これはテスターにとって重要な特性です。 最も興味深いメンバーは[以下](#debug-element-details)でカバーされています。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      コンポーネントのルートにあるネイティブなDOM要素。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>changeDetectorRef</code>
    </td>

    <td>

      コンポーネントの`ChangeDetectorRef`。

      `ChangeDetectionRef`は、
      `ChangeDetectionStrategy.OnPush`メソッドを持つコンポーネントをテストする場合や、
      コンポーネントの変更検知があなたのプログラマティックな制御下である場合に最も効果的です。

    </td>
  </tr>
</table>

{@a component-fixture-methods}

#### _ComponentFixture_ メソッド

_フィクスチャー_のメソッドにより、Angularはコンポーネントツリー上で特定のタスクを実行します。
シミュレートされたユーザーアクションに応答してAngularの動作をトリガーするためにこれらのメソッドを呼び出してください。

テスターにとってもっとも有用なメソッドは次のとおりです。

<table>
  <tr>
    <th>
      メソッド
    </th>
    <th>
      説明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>detectChanges</code>
    </td>

    <td>

      コンポーネントの変更検知サイクルをトリガーします。

      コンポーネントを初期化するため（`ngOnInit`を呼び出します）、
      またはテストコードでコンポーネントのデータバウンドプロパティ値を変更したあとに呼び出してください。
      Angularは、`personComponent.name`を変更したことを認識できません。
      また、`detectChanges`を呼び出すまで、`name`のバインディングは更新されません。

      `detectChanges(false)`として呼び出さない場合、
      循環更新を確認するためにあとで `checkNoChanges` を実行してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>autoDetectChanges</code>
    </td>

    <td>

      これを`true`に設定すると、フィクスチャーは自動的に変更を検知します。

      自動検知が`true`の場合、
      テストフィクスチャーはコンポーネントの作成直後に暗黙的に`detectChanges`を呼び出します。
      そのあと、関連するゾーンイベントをリッスンし、それに応じて`detectChanges`を呼び出します。
      テストコードがコンポーネントのプロパティ値を直接変更するときは、
      おそらく`fixture.detectChanges`を呼び出してデータバインディングの更新をトリガーする必要があります。

      デフォルトは`false`です。
      テストの動作を細かく制御することを好むテスターは、`false`のままにする傾向があります。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>checkNoChanges</code>
    </td>

    <td>

      保留中の変更がないことを確認するために変更検知を実行します。 ある場合は例外をスローします。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>isStable</code>
    </td>

    <td>

      フィクスチャーが現在_安定_している場合は`true`を返します。
      完了していない非同期タスクがある場合は`false`を返します。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>whenStable</code>
    </td>

    <td>

      フィクスチャーが安定しているときに解決するPromiseを返します。

      非同期アクティビティまたは非同期変更検知が完了した後でテストを再開するには、
      そのPromiseをフックしてください。
      [whenStable](guide/testing-components-scenarios#when-stable)を参照してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>destroy</code>
    </td>

    <td>

      コンポーネントの破棄をトリガーします。

    </td>
  </tr>
</table>

{@a debug-element-details}

#### _DebugElement_

`DebugElement`は、コンポーネントのDOM表現を把握する重要な手がかりになります。

`fixture.debugElement`によって返されたテストルートコンポーネントの`DebugElement`から、
フィクスチャーの要素およびコンポーネントのサブツリー全体を走査（およびクエリ）することができます。

次は、テスターにとってもっとも有用な`DebugElement`メンバーです。おおよそ役に立つ順番です:

<table>
  <tr>
    <th>
      Member
    </th>
    <th>
      Description
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      ブラウザ内の対応するDOM要素。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>query</code>
    </td>

    <td>

      `query(predicate: Predicate<DebugElement>)`を呼び出すと、
      サブツリー内の任意の深さの[predicate](#query-predicate)にマッチする最初の`DebugElement`を返します。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>queryAll</code>
    </td>

    <td>

      `queryAll(predicate: Predicate<DebugElement>)`を呼び出すと、
      サブツリー内の任意の深さの[predicate](#query-predicate)にマッチするすべての`DebugElement`が返されます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>injector</code>
    </td>

    <td>

      ホストの依存性のインジェクター。
      たとえば、ルート要素のコンポーネントインスタンスインジェクターなどです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      要素自身のコンポーネントインスタンス（存在する場合）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>context</code>
    </td>

    <td>

      この要素の親コンテキストを提供するオブジェクト。
      この要素を管理する祖先コンポーネントインスタンスであることが多いです。

      要素が`*ngFor`内で繰り返されている場合、
      コンテキストは`$implicit`プロパティが行のインスタンス値の値である`NgForOf`です。
      例えば、`*ngFor="let hero of heroes"`内の`hero`がそうです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>children</code>
    </td>

    <td>

      直接の`DebugElement`の子です。`children`を通してツリーをたどってください。

      <div class="alert is-helpful">

      `DebugElement`には、`DebugNode`オブジェクトのリストである`childNodes`もあります。
      `DebugElement`は`DebugNode`オブジェクトから派生し、
      要素より多くのノードを持ちます。テスターは通常、プレーンなノードを無視できます。

      </div>
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>parent</code>
    </td>
    <td>

      `DebugElement`の親です。これがルート要素の場合はnullです。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>name</code>
    </td>

    <td>

      要素タグ名（要素の場合）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>triggerEventHandler</code>
    </td>
    <td>

      指定した名前に対応するリスナーが、要素の`listeners`コレクション内にある場合、
      その名前でイベントをトリガーします。
      2番目のパラメータは、ハンドラが期待する_イベントオブジェクト_です。
      [triggerEventHandler](guide/testing-components-scenarios#trigger-event-handler)を参照してください。

      イベントにリスナーがない場合やその他の問題がある場合は、
      `nativeElement.dispatchEvent(eventObject)`を呼び出すことを検討してください。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>listeners</code>
    </td>

    <td>

      コンポーネントの`@Output`プロパティおよび/または要素のイベントプロパティに関連付けられたコールバック。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>providerTokens</code>
    </td>

    <td>

      このコンポーネントのインジェクタールックアップトークン。
      コンポーネント自体とコンポーネントが持つ`providers`メタデータ内のトークンが含まれます。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>source</code>
    </td>

    <td>

      ソースコンポーネントテンプレート内のこの要素を見つける場所。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>references</code>
    </td>

    <td>

      テンプレートローカル変数（例：`#foo`）に関連付けられたオブジェクトの辞書で、ローカル変数名をキーとしています。

    </td>
  </tr>
</table>

{@a query-predicate}

`DebugElement.query(predicate)` および`DebugElement.queryAll(predicate)`メソッドは、
`DebugElement`とマッチするようにソース要素のサブツリーをフィルタする述語を受け取ります。

述語は、`DebugElement`を受け取り、_truthy_な値を返す任意のメソッドです。
次の例では、"content"という名前のテンプレートローカル変数への参照を含むすべての`DebugElement`
が検索されます:

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="custom-predicate" header="app/demo/demo.testbed.spec.ts"></code-example>

The Angular `By` class has three static methods for common predicates:

| Static method             | Details |
|:---                       |:---     |
| `By.all`                  | Return all elements                                                        |
| `By.css(selector)`        | Return elements with matching CSS selectors                                |
| `By.directive(directive)` | Return elements that Angular matched to an instance of the directive class |

<code-example path="testing/src/app/hero/hero-list.component.spec.ts" region="by" header="app/hero/hero-list.component.spec.ts"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2023-09-07
