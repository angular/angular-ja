# ライフサイクルフック

コンポーネントインスタンスには、 Angular がコンポーネントクラスをインスタンス化してコンポーネントビューとその子ビューをレンダリングするときに開始するライフサイクルがあります。
Angular はデータバインドプロパティがいつ変更されたかを確認し、必要に応じてビューとコンポーネントインスタンスの両方を更新するため、ライフサイクルは変更の検出を続けます。
Angular がコンポーネントインスタンスを破棄し、レンダリングされたテンプレートを DOM から削除すると、ライフサイクルが終了します。
Angular は実行中にインスタンスを作成、更新、破棄するため、ディレクティブも同様のライフサイクルを持っています。

アプリケーションは、 [ライフサイクルフックメソッド](guide/glossary#lifecycle-hook "Definition of lifecycle hook") を使用して、コンポーネントまたはディレクティブのライフサイクルの主要イベントを利用し、新しいインスタンスを初期化し、必要に応じて変更検知を開始し、変更検知中に更新に応答し、インスタンスを削除する前にクリーンアップできます。

## 前提条件

ライフサイクルフックを使用する前に、次の基本的な知識が必要です:

* [TypeScript プログラミング](https://www.typescriptlang.org/)
* [Angularの概念](guide/architecture "Introduction to fundamental app-design concepts") で説明されている Angular アプリケーションの設計の基礎。

{@a hooks-overview}

## ライフサイクルイベントへの応答

Angular の `core` ライブラリ中の 1 つ以上の *ライフサイクルフック* インターフェースを実装することで、コンポーネントまたはディレクティブのライフサイクルのイベントに応答できます。
フックは、 Angular がインスタンスを作成、更新、または破棄するときに、適切なタイミングでコンポーネントまたはディレクティブインスタンスを操作する機会を提供します。

各インターフェースは、単一のフックメソッドのプロトタイプを定義します。その名前は、プレフィックスが `ng` のインターフェース名です。
たとえば、 `OnInit` インターフェースには `ngOnInit()` という名前のフックメソッドがあります。 このメソッドをコンポーネントまたはディレクティブクラスに実装する場合、 Angular はそのコンポーネントまたはディレクティブの入力プロパティをはじめて確認した直後にこのメソッドを呼び出します。

<code-example path="lifecycle-hooks/src/app/peek-a-boo.directive.ts" region="ngOnInit" header="peek-a-boo.directive.ts (excerpt)"></code-example>

ライフサイクルフックのすべて（またはいずれか）を実装する必要はなく、必要なものだけを実装します。

{@a hooks-purpose-timing}

### ライフサイクルイベントシーケンス

アプリケーションがそのコンストラクターを呼び出してコンポーネントまたはディレクティブをインスタンス化した後、 Angular はそのインスタンスのライフサイクルの適切な時点で実装したフックメソッドを呼び出します。

Angular は次のシーケンスでフックメソッドを実行します。 これらを使用して、次のような操作を実行できます。

<table width="100%">
  <col width="20%"></col>
  <col width="60%"></col>
  <col width="20%"></col>
  <tr>
    <th>フックメソッド</th>
    <th>目的</th>
    <th>タイミング</th>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnChanges()</code>
    </td>
    <td>

      Angular がデータバインドされた入力プロパティを設定またはリセットしたときに応答します。
      このメソッドは、現在および以前のプロパティ値の `SimpleChanges` オブジェクトを受け取ります。

      これは非常に頻繁に発生するため、ここで実行する操作はパフォーマンスに大きな影響を与えることに注意してください。
      このドキュメントの [変更検出フックの使用](#onchanges) の詳細を参照してください。

    </td>
    <td>

      （コンポーネントがバインドされた入力を持つ場合）`ngOnInit()` の前、および1つ以上のデータバインド入力プロパティが変更されるたびに呼び出されます。

      コンポーネントが入力を持たない場合や入力を提供せずに使用している場合、フレームワークは `ngOnChanges()` を呼び出さないことに注意してください。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnInit()</code>
    </td>
    <td>

      Angular が最初にデータバインドプロパティを表示し、ディレクティブまたはコンポーネントの入力プロパティを設定した後、
      ディレクティブまたはコンポーネントを初期化します。
      詳細は、このドキュメントの [コンポーネントまたはディレクティブの初期化](#oninit) を参照してください。

    </td>
    <td>

      最初の `ngOnChanges()` の後で1回呼び出されます。`ngOnInit()` is still called even when `ngOnChanges()` is not (which is the case when there are no template-bound inputs).

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngDoCheck()</code>
    </td>
    <td>

      Angular がそれ自体では検出できない、または検出できない変更を検出して対処します。
      このドキュメントの [カスタム変更検出の定義](#docheck) の詳細と例を参照してください。

    </td>
    <td>

    すべての変更検出の実行で `ngOnChanges()` の直後、および最初の実行で `ngOnInit()` の直後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentInit()</code>
    </td>
    <td>

      Angular が外部コンテンツをコンポーネントのビュー、またはディレクティブがあるビューに投影した後に応答します。

      このドキュメントの [コンテンツの変更への応答](#aftercontent) の詳細と例を参照してください。


    </td>
    <td>

      最初の `ngDoCheck()` の後で1回呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentChecked()</code>
    </td>
    <td>

      Angular がディレクティブまたはコンポーネントに投影されたコンテンツをチェックした後に応答します。

      このドキュメントの [投影されたコンテンツの変更への応答](#aftercontent) の詳細と例を参照してください。

    </td>

    <td>

      `ngAfterContentInit()` およびその後のすべての `ngDoCheck()` の後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewInit()</code>
    </td>
    <td>

      Angular がコンポーネントのビューと子ビュー、またはディレクティブを含むビューを初期化した後に応答します。

      このドキュメントの [ビューの変更に応答する](#afterview) の詳細と例を参照してください。

    </td>

    <td>

      最初の `ngAfterContentChecked()` の後で1回呼び出されます。
    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewChecked()</code>
    </td>
    <td>

      Angular がコンポーネントのビューと子ビュー、またはディレクティブを含むビューをチェックした後に応答します。

    </td>

    <td>

      `ngAfterViewInit()` およびその後のすべての `ngAfterContentChecked()` の後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnDestroy()</code>
    </td>
    <td>

      Angular がディレクティブまたはコンポーネントを破壊する直前のクリーンアップ。
      Observables をサブスクライブ解除し、イベントハンドラーを切り離して、メモリリークを回避します。
      詳細はこのドキュメントの [インスタンス破棄時のクリーンアップ](#ondestroy) をご覧ください。

    </td>

    <td>

      Angular がディレクティブまたはコンポーネントを破棄する直前に呼び出されます。

    </td>
  </tr>
</table>

{@a the-sample}

### ライフサイクル事例集

<live-example></live-example> は、
ルート `AppComponent` の制御下にあるコンポーネントとして提示される一連の演習を通じて、
ライフサイクルフックの使用法を示しています。
いずれの場合も、 *親* コンポーネントは、
1 つ以上のライフサイクルフックメソッドを示す *子* コンポーネントのテスト装置として機能します。

次の表は、簡単な説明付きの演習を示しています。
サンプルコードは、次のセクションで特定のタスクを説明するためにも使用されます。

<table width="100%">
  <col width="20%"></col>
  <col width="80%"></col>
  <tr>
    <th>コンポーネント</th>
    <th>説明</th>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#peek-a-boo">Peek-a-boo</a>
    </td>
    <td>

      すべてのライフサイクルフックを示します。
      各フックメソッドは画面上のログに書き込みます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#spy">Spy</a>
    </td>
    <td>

      カスタムディレクティブでライフサイクルフックを使用する方法を示します。
      `SpyDirective` は `ngOnInit()` および `ngOnDestroy()` フックを実装し、
      それらを使用して、要素が現在のビューに出入りするときを監視および報告します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#onchanges">OnChanges</a>
    </td>
    <td>

      コンポーネントの入力プロパティの 1 つが変更されるたびに
      Angular が `ngOnChanges()` フックを呼び出す方法を示し、
      フックメソッドに渡された `changes` オブジェクトを解釈する方法を示します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#docheck">DoCheck</a>
    </td>
    <td>

      カスタム変更検出を備えた `ngDoCheck()` メソッドを実装します。
      ログへのフックポストの変更を見て、 Angular がこのフックを呼び出す頻度を確認します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#afterview">AfterView</a>
    </td>
    <td>

      Angular における [ビュー](guide/glossary#view "Definition of view.") の意味合いを示します。
      `ngAfterViewInit()` および `ngAfterViewChecked()` フックを示します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#aftercontent">AfterContent</a>
    </td>
    <td>

      外部コンテンツをコンポーネントに投影する方法と、
      投影されたコンテンツをコンポーネントのビューの子から区別する方法を示します。
      `ngAfterContentInit()` および `ngAfterContentChecked()` フックを示します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
       <a href="#counter">Counter</a>
    </td>
    <td>

      それぞれ独自のフックを持つ、コンポーネントとディレクティブの組み合わせを示します。

    </td>
  </tr>
</table>


{@a oninit}

## コンポーネントまたはディレクティブの初期化

`ngOnInit()` メソッドを使用して、次の初期化タスクを実行します。

* コンストラクターの外で複雑な初期化を実行します。
  コンポーネントは手軽かつ安全に構築されるべきです。
  たとえば、コンポーネントコンストラクターでデータをフェッチしないでください。
  新しいコンポーネントがテスト中に作成されたとき、またはそれを表示する前に、
  リモートサーバーに接続しようとすることを心配すべきではありません。

  `ngOnInit()` は、コンポーネントが初期データをフェッチするのに適した場所です。
  例については、 [Tour of Heroesチュートリアル](tutorial/toh-pt4#oninit) を参照してください。

* Angular が入力プロパティを設定した後にコンポーネントを設定します。
  コンストラクターは、初期ローカル変数を単純な値に設定するだけです。

  ディレクティブのデータバインド入力プロパティは、 _構築後まで_ 設定されないことに注意してください。
  これらのプロパティに基づいてディレクティブを初期化する必要がある場合は、 `ngOnInit()` の実行時にそれらを設定します。

  <div class="alert is-helpful">

     `ngOnChanges()` メソッドは、これらのプロパティにアクセスする最初の機会です。
     Angular は `ngOnInit()` の前に `ngOnChanges()` を呼び出しますが、その後何度も呼び出します。
     `ngOnInit()` を呼び出すのは1回だけです。

  </div>

{@a ondestroy}

## インスタンス破棄時のクリーンアップ

クリーンアップロジックを `ngOnDestroy()` に配置します。これは、 Angular がディレクティブを破棄する前に実行する必要があるロジックです。

これは、自動的にガベージコレクションされないリソースを解放する場所です。
怠ると、メモリリークのリスクがあります。

* Observables と DOM イベントの登録解除。
* インターバルタイマーの停止。
* ディレクティブがグローバルサービスまたはアプリケーションサービスに登録したすべてのコールバックの登録解除。

`ngOnDestroy()` メソッドは、コンポーネントがなくなることをアプリケーションの別の部分に通知する時間でもあります。


## 一般的な例

次の例は、さまざまなライフサイクルイベントの呼び出しシーケンスと相対頻度、およびコンポーネントとディレクティブに対してフックを個別に、または一緒に使用する方法を示しています。

{@a peek-a-boo}

### すべてのライフサイクルイベントのシーケンスと頻度

Angular がフックを予想される順序で呼び出す方法を示すために、 `PeekABooComponent` は 1 つのコンポーネントのすべてのフックを示しています。

実際には、このデモのようにすべてのインターフェースを実装することはほとんどありません。

次のスナップショットは、ユーザーが *Create...* ボタンをクリックしてから *Destroy...* ボタンをクリックした後のログの状態を反映しています。

<div class="lightbox">
  <img src="generated/images/guide/lifecycle-hooks/peek-a-boo.png" alt="Peek-a-boo">
</div>

ログメッセージのシーケンスは、規定のフック呼び出し順序に従います:

| Hook order | Log message           |
|:---        |:---                   |
| 1          | `OnChanges`           |
| 2          | `OnInit`              |
| 3          | `DoCheck`             |
| 4          | `AfterContentInit`    |
| 5          | `AfterContentChecked` |
| 6          | `AfterViewInit`       |
| 7          | `AfterViewChecked`    |
| 8          | `DoCheck`             |
| 9          | `AfterContentChecked` |
| 10         | `AfterViewChecked`    |
| 11         | `OnDestroy`           |

<div class="alert is-helpful">

  ログでは、入力プロパティ（この場合は `name` プロパティ）は構築時に値が割り当てられていないことが確認されています。
  入力プロパティは、さらに初期化するために `onInit()` メソッドで使用できます。

</div>

ユーザーが *Update Hero* ボタンをクリックした場合、ログには別の `OnChanges`、 `DoCheck` と `AfterContentChecked` の 2 つのトリプレット、そして `AfterViewChecked` が表示されます。
これらの 3 つのフックは *頻繁* に起動するため、それらのロジックをできるだけ無駄のないようにすることが重要です。

{@a spy}

### ディレクティブを使用した DOM の監視

`Spy` の例では、コンポーネントだけでなくディレクティブにもフックメソッドを使用する方法を示しています。
`SpyDirective`は 2 つのフック `ngOnInit()` と `ngOnDestroy()`を実装して、監視対象の要素が現在のビューにあることを検出します。

このテンプレートは、親の `SpyComponent` によって管理される `ngFor` の *hero* リピーター内の `<div>` に `SpyDirective` を適用します。

この例では、初期化やクリーンアップは実行されません。
ディレクティブ自体がインスタンス化されて破棄されたときを記録することにより、ビュー内の要素の出現と非表示を追跡するだけです。

このようなスパイディレクティブは、直接変更できない DOM オブジェクトへの洞察を提供します。
You can't access the implementation of a built-in `<div>`, or modify a third party component.
You do have the option to watch these elements with a directive.

このディレクティブは、注入された `LoggerService` を介して親にメッセージを記録する
`ngOnInit()` および `ngOnDestroy()` フックを定義します。

<code-example path="lifecycle-hooks/src/app/spy.directive.ts" region="spy-directive" header="src/app/spy.directive.ts"></code-example>

ビルトインまたはコンポーネント要素にスパイを適用すると、
その要素と同時に初期化および破棄されることがわかります。
ここでは繰り返される hero の `<div>` にアタッチされています:

<code-example path="lifecycle-hooks/src/app/spy.component.html" region="template" header="src/app/spy.component.html"></code-example>

各スパイの作成と破棄は、次のように、 *フックログ* のエントリで、アタッチされた hero の `<div>` の出現と消滅をマークします。ヒーローを追加すると、新しい hero の `<div>` が作成されます。 スパイの `ngOnInit()` はそのイベントを記録します。

*リセット* ボタンは `heroes` リストをクリアします。
Angular は DOM からすべての hero の `<div>` 要素を削除し、同時にそれらのスパイディレクティブを破棄します。
スパイの `ngOnDestroy()` メソッドは最後の瞬間を報告します。

{@a counter}

### コンポーネントとディレクティブのフックを一緒に使用する

この例では、 `CounterComponent` は `ngOnChanges()` メソッドを使用して、親コンポーネントが入力 `counter` プロパティをインクリメントするたびに変更をログに記録します。

この例では、ログエントリの作成と破棄を監視するために、前の例の `SpyDirective` を `CounterComponent` ログに適用します。

{@a onchanges}

## 変更検知フックの使用 {@a using-change-detection-hooks}

Angular は ***入力プロパティ*** の変更を検出するたびに、コンポーネントまたはディレクティブの `ngOnChanges()` メソッドを呼び出します。
*onChanges* の例では、 `OnChanges()` フックをモニタリングすることでこれを示しています。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="ng-on-changes" header="on-changes.component.ts (excerpt)"></code-example>

`ngOnChanges()` メソッドは、それぞれ変更されたプロパティ名をマッピングし、現在および以前のプロパティ値を保持する
[SimpleChange](api/core/SimpleChange) オブジェクトをとります。
このフックは、変更されたプロパティを反復処理してログに記録します。

サンプルコンポーネントの `OnChangesComponent` には、 `hero` と `power` の 2 つの入力プロパティがあります:

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="inputs" header="src/app/on-changes.component.ts"></code-example>

ホストの `OnChangesParentComponent` は、次のようにそれらにバインドします。

<code-example path="lifecycle-hooks/src/app/on-changes-parent.component.html" region="on-changes" header="src/app/on-changes-parent.component.html"></code-example>

これは、ユーザーが変更を加える際のサンプルです。

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/on-changes-anim.gif' alt="OnChanges">
</div>

*power* プロパティの文字列値が変化すると、ログエントリが表示されます。
ただし、 `ngOnChanges()` メソッドは `hero.name` への変更をキャッチしないことに注意してください。
これは、 Angular が入力プロパティの値が変更されたときにのみフックを呼び出すためです。
この場合、 `hero` は入力プロパティであり、 `hero` プロパティの値は *ヒーローオブジェクトへの参照* です。
自身の `name` プロパティの値が変更されても、オブジェクトの参照は変更されませんでした。


{@a afterview}

### ビューの変更への応答

Angular は変更検知中に [ビュー階層](guide/glossary#view-hierarchy "Definition of view hierarchy definition") をトラバースするので、子の変更が自身の親に変更を引き起こそうとしないことを確認する必要があります。 このような変更は [単方向データフロー](guide/glossary#unidirectional-data-flow "Definition") の仕組みにより、適切にレンダリングされません。

予想されるデータフローを反転させる変更を行う必要がある場合は、新しい変更検知サイクルをトリガーして、その変更をレンダリングできるようにする必要があります。
例では、そのような変更を安全に行う方法を示しています。

*AfterView* サンプルは、コンポーネントの子ビューを作成した *後* に
Angular が呼び出す `AfterViewInit()` および `AfterViewChecked()` フックを調べます。

`<input>` にヒーローの名前を表示する子ビューは次のとおりです:

<code-example path="lifecycle-hooks/src/app/child-view.component.ts" region="child-view" header="ChildViewComponent"></code-example>

`AfterViewComponent` は、 *テンプレート内に* この子ビューを表示します:

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="template" header="AfterViewComponent (template)"></code-example>

次のフックは、 *子ビュー内の* 値の変更に基づいてアクションを実行します。
これは、 [@ViewChild](api/core/ViewChild) で装飾されたプロパティを介して
子ビューをクエリすることによってのみ到達できます。

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="hooks" header="AfterViewComponent (class excerpts)"></code-example>

{@a wait-a-tick}

#### ビューを更新する前に待つ

この例では、ヒーロー名が10文字を超えると `doSomething()` メソッドが画面を更新しますが、 `comment` を更新する前に tick を待ちます。

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="do-something" header="AfterViewComponent (doSomething)"></code-example>

コンポーネントのビューが構成されると `AfterViewInit()` と `AfterViewChecked()` の両方のフックが起動します。
フックがコンポーネントのデータバインド `comment` プロパティをすぐに更新するようにコードを変更すると、Angular がエラーをスローすることがわかります。

`LoggerService.tick_then()` ステートメントは、ブラウザの JavaScript サイクルの 1 ターンの間、ログの更新を延期します。
これにより、新しい変更検知サイクルがトリガーされます。

#### リーンフックメソッドを記述してパフォーマンスの問題を回避する

*AfterView* サンプルを実行すると、関心のある変更がない場合に、 Angular が `AfterViewChecked()` を呼び出す頻度に注意してください。
これらのメソッドの1つに入れるロジックまたは計算の量には十分注意してください。

<div class="lightbox">

  <img src='generated/images/guide/lifecycle-hooks/after-view-anim.gif' alt="AfterView">

</div>


{@a aftercontent}
{@a aftercontent-hooks}
{@a content-projection}

### 投影されたコンテンツの変更への応答

*コンテンツ投影*は、コンポーネントの外部からHTMLコンテンツをインポートし、
そのコンテンツをコンポーネントのテンプレートの指定された場所に挿入する方法です。
次の構成を探すことで、テンプレートのコンテンツ投影を識別できます。

  * コンポーネント要素タグ間の HTML 。
  * コンポーネントのテンプレート内の `<ng-content>` タグの存在。

<div class="alert is-helpful">

  AngularJS 開発者は、この手法を *トランスクルージョン* として知っています。

</div>

*AfterContent* サンプルでは Angular が外部コンテンツをコンポーネントに投影した *後に* Angular が呼び出す `AfterContentInit()` および `AfterContentChecked()` フックを調べます。

[前の _AfterView_](#afterview) の例のこのバリエーションを検討してください。
今回は、テンプレートに子ビューを含める代わりに、
`AfterContentComponent` の親からコンテンツをインポートします。
以下は、親のテンプレートです。

<code-example path="lifecycle-hooks/src/app/after-content-parent.component.ts" region="parent-template" header="AfterContentParentComponent (template excerpt)"></code-example>

`<app-child>` タグが `<after-content>` タグの間に隠れていることに注意してください。
*コンテンツをコンポーネントに投影する場合を除き*
コンポーネントの要素タグの間にコンテンツを配置しないでください。

次に、コンポーネントのテンプレートを見てください。

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="template" header="AfterContentComponent (template)"></code-example>

`<ng-content>` タグは、外部コンテンツの *プレースホルダー* です。
そのコンテンツを挿入する場所を Angular に伝えます。
この場合、投影されるコンテンツは、親からの `<app-child>` です。

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/projected-child-view.png' alt="Projected Content">
</div>


#### AfterContent フックの使用 {@a using-aftercontent-hooks}

*AfterContent* フックは *AfterView* フックに似ています。
主な違いは、子コンポーネントにあります。

* *AfterView* フックは、要素タグがコンポーネントのテンプレート *内に*
表示される子コンポーネントである `ViewChildren` に関係します。

* *AfterContent* フックは Angular がコンポーネントに投影した
子コンポーネントである ContentChildren に関係します。

次の *AfterContent* フックは *コンテンツの子* の値の変更に基づいてアクションを実行します。
これは [@ContentChild](api/core/ContentChild)
で装飾されたプロパティを介してクエリを実行することによってのみ到達できます。

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="hooks" header="AfterContentComponent (class excerpts)"></code-example>

{@a no-unidirectional-flow-worries}

<div class="callout is-helpful">

<header>コンテンツの更新を待つ必要はありません</header>

このコンポーネントの `doSomething()` メソッドはコンポーネントのデータバインドコメントプロパティをすぐに更新します。
[適切なレンダリングを保証するために更新を遅らせる](#wait-a-tick "Delaying updates") 必要はありません。

Angular はどちらかの *AfterView* フックを呼び出す前に両方の *AfterContent* フックを呼び出します。
Angular はこのコンポーネントのビューの構成を完了する *前に* 投影されたコンテンツの構成を完了します。
`AfterContent...` フックと `AfterView...` フックの間に小さなウィンドウがあり、ホストビューを変更できます。

</div>

<a id="docheck"></a>

## カスタム変更検知の定義 {@a defining-custom-change-detection}

`ngOnChanges()` が変更をキャッチしない場所で発生する変更を監視するには、 *DoCheck* の例に示すように、独自の変更チェックを実装できます。
この例は `ngDoCheck()` フックを使用して Angular が独自にキャッチしない変更を検出して対処する方法を示しています。

*DoCheck* サンプルは *OnChanges* サンプルを次の `ngDoCheck()` フックで拡張します:

<code-example path="lifecycle-hooks/src/app/do-check.component.ts" region="ng-do-check" header="DoCheckComponent (ngDoCheck)"></code-example>

このコードは、特定の _対象となる値_ を検査し、それらの現在の状態をキャプチャして、以前の値と比較します。
`hero` や `power` に実質的な変更がない場合は、特別なメッセージをログに書き込み `DoCheck()` が呼び出される頻度を確認できます。
結果は素晴らしいものです。

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/do-check-anim.gif' alt="DoCheck">
</div>

`ngDoCheck()` フックはヒーローの `名前` が変更されたことを検出できますが、非常にコストがかかります。
このフックは、変更が発生した場所に関係なく、
_すべての_ 変更検知サイクルの後に非常に頻繁に呼び出されます。
この例では、ユーザーが何でもできる前に20回以上呼び出されます。

これらの初期チェックのほとんどは *ページ上の他の場所にある無関係なデータ* の Angular による最初のレンダリングによってトリガーされます。
カーソルを別の `<input>` に移動するだけで、呼び出しがトリガーされます。
比較的少数の呼び出しで、関連データへの実際の変更が明らかになります。
このフックを使用する場合、実装は非常に軽量でなければならず、そうでなければユーザー体験が低下します。

@reviewed 2021-09-16
