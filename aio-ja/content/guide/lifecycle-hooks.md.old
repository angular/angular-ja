# ライフサイクル・フック

コンポーネントのライフサイクルは、Angularによって管理されています。

Angularは、コンポーネントとその子を作成およびレンダリングし、データバインドプロパティが変更されたときにチェックし、DOMから削除する前にそれらを破棄します。

Angularはそれらの重要な生存の瞬間を可視化し、発生時に行動できるようにする
**ライフサイクル・フック** を提供します。

ディレクティブにも一連のライフサイクル・フックがあります。

{@a hooks-overview}

## コンポーネントのライフサイクル・フックの概要

ディレクティブとコンポーネントのインスタンスは、Angularがライフサイクルを作成、
更新、および破棄するにつれてライフサイクルを持ちます。
開発者は、ライフサイクルの中の重要な瞬間を、Angular `core` ライブラリの
*ライフサイクル・フック*　インターフェースの1つあるいは複数実装することで傍受できます。

各インターフェースは、名前が `ng` で始まるインターフェース名である単一のフックメソッドを持っています。
たとえば、 `OnInit` インターフェースは　`ngOnInit()` という名前のフックメソッドを持っています。
Angularはコンポーネントの作成直後に呼び出します。

<code-example path="lifecycle-hooks/src/app/peek-a-boo.component.ts" region="ngOnInit" header="peek-a-boo.component.ts (excerpt)"></code-example>

ディレクティブやコンポーネントはライフサイクルフックすべてを実装しないでしょう。
Angularは、ディレクティブ/コンポーネント・フック・メソッド *が定義されている場合* にのみ呼び出します。

{@a hooks-purpose-timing}

## ライフサイクル・シーケンス

コンストラクターの呼び出しによってコンポーネント/ディレクティブを作成した *後に* 、
Angularはライフサイクル・フックメソッドを特定の瞬間に次の順序で呼び出します。

<table width="100%">
  <col width="20%"></col>
  <col width="80%"></col>
  <tr>
    <th>フック</th>
    <th>目的とタイミング</th>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnChanges()</code>
    </td>
    <td>

      Angular がデータバインドされた入力プロパティを(再)設定するときに応答します。
      このメソッドは、現在および以前のプロパティ値の `SimpleChanges` オブジェクトを受け取ります。

      `ngOnInit()` の前に呼び出され、データバインドされた入力プロパティが変更されるたびに呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnInit()</code>
    </td>
    <td>

      Angularがデータバインドされたプロパティを最初に表示し、ディレクティブ/コンポーネントの入力プロパティを設定した後で、
      ディレクティブ/コンポーネントを初期化します。

      *最初* の `ngOnChanges()` の後に *一度* 呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngDoCheck()</code>
    </td>
    <td>

      Angularが検出できない、または検出できない変更を検出して、それに基づいて実行します。

      変更検知の実行中に毎回、そして `ngOnChanges()` と `ngOnInit()` の直後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentInit()</code>
    </td>
    <td>

      Angularがコンポーネントのビューあるいはディレクティブが存在するビューに、外部コンテンツを投影した後に応答します。

      最初の `ngDoCheck()` の後に _1度_ 呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentChecked()</code>
    </td>
    <td>

      Angularがディレクティブ/コンポーネントに投影された外部コンテンツをチェックした後に応答します。

      `ngAfterContentInit()` とその後全ての `ngDoCheck()` の後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewInit()</code>
    </td>
    <td>

      Angularがコンポーネントのビューと子のビュー、あるいはディレクティブが存在するビューを初期化した後に応答します。

      最初の `ngAfterContentChecked()` の後に _1度_ 呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewChecked()</code>
    </td>
    <td>

      Angularがコンポーネントのビューと子のビュー、あるいはディレクティブが存在するビューをチェックした後に応答します。

      `ngAfterViewInit()` とその後のすべての `ngAfterContentChecked()` の後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnDestroy()</code>
    </td>
    <td>

      Angularがディレクティブ/コンポーネントを破棄する直前に、クリーンアップします。
      メモリリークを回避するためにObservableの購読を解除し、イベントハンドラをデタッチしましょう。

      Angularがディレクティブ/コンポーネントを破棄する _直前_ に呼び出されます。

    </td>
  </tr>
</table>

{@a interface-optional}

## インターフェースはオプションです(技術的に)

純粋に技術的な観点から、JavaScript と Typescript の開発者はインターフェースを省略することができます。
JavaScript言語にはインターフェースがありません。
変換されたJavaScriptからは消えてしまうため、Angularは実行時にTypeScriptのインターフェースを見ることはできません。

幸いにも、それらは必要ではありません。
フックそのものの恩恵を受けるために、ディレクティブやコンポーネントにライフサイクル・フックのインターフェースを追加する必要はありません。

Angularはディレクティブとコンポーネントのクラスを調べ、フックメソッドが _定義されていたら_ それらを呼び出します。
Angularはインターフェースの有無にかかわらず、`ngOnInit()`のようなメソッドを探して呼び出します。

それでもやはり、強い型付けやエディターの恩恵を受けるためには、
TypeScriptのディレクティブクラスにインターフェースを追加することをお勧めします。

{@a other-lifecycle-hooks}

## 他の Angular ライフサイクル・フック

他のAngularサブシステムは、これらのコンポーネント・フックとは別のライフサイクル・フックをもつことがあります。

サードパーティのライブラリは、開発者がこれらのライブラリの使用方法をより詳細に制御できるように、
フックを実装することもできます。

{@a the-sample}

## ライフサイクルの例

<live-example></live-example> は、
ルートの`AppComponent`の制御下にあるコンポーネントとして与えられる一連のエクササイズを通して、
実際のライフサイクル・フックをデモンストレーションします。

それらは共通のパターンに従います： それらは、_親_ コンポーネントが1つ以上のライフサイクル・フックの
メソッドを表す _子_ コンポーネントのテスト用具として機能するという、共通のパターンに従います。

各エクササイズについて簡単に説明します：

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

      すべてのライフサイクル・フックを示します。
      各フックメソッドは画面上のログに書き込みます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#spy">Spy</a>
    </td>
    <td>

      ディレクティブもライフサイクル・フックをもちます。
      `SpyDirective` は、それがスパイする要素が `ngOnInit` と `ngOnDestroy` フック
      を使って作成または破棄されるとログに記録できます。

      この例では、親の `SpyComponent` によって管理される `ngFor` *hero* リピータの
      中にある `<div>` に `SpyDirective` を適用します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#onchanges">OnChanges</a>
    </td>
    <td>

      コンポーネント入力プロパティの1つが変更されるたびに、
      Angularがどのように`ngOnChanges()`フックを呼び出すかを見てください。
      `changes` オブジェクトの解釈方法を示します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#docheck">DoCheck</a>
    </td>
    <td>

      カスタム変更の検出を伴う `ngDoCheck()` メソッドを実装します。
      Angularがこのフックを呼び出す頻度を確認し、変更がログに記録されるのを見てください。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#afterview">AfterView</a>
    </td>
    <td>

      Angularが *ビュー* と呼ぶものを示します。
      `ngAfterViewInit` と `ngAfterViewChecked` フックをデモンストレーションします。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#aftercontent">AfterContent</a>
    </td>
    <td>

      外部コンテンツをコンポーネントに投影する方法、および投影されたコンテンツをコンポーネント
      のビューの子供と区別する方法を示します。
      `ngAfterContentInit` と `ngAfterContentChecked` フックをデモンストレーションします。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      Counter
    </td>
    <td>

      独自のフックを持つコンポーネントとディレクティブの組み合わせ
      を示します。

      この例では、`CounterComponent` は、親コンポーネントが入力カウンタのプロパティ
      をインクリメントするたびに、(`ngOnChanges` を介して)変更を記録します。
      一方、前の例の `SpyDirective` は `CounterComponent` ログに適用され、
      ログエントリが作成および破棄されるのを監視します。

    </td>
  </tr>
</table>

このページの残りの部分では、選択した演習についてさらに詳しく説明します。

{@a peek-a-boo}

## ピーク・ア・ブー(いないいないばー)：すべてのフック

`PeekABooComponent` は、1つのコンポーネント内のすべてのフックを示します。

このようなインターフェースをすべて実装することはめったにありません。
ピーク・ア・ブー(いないいないばー)は、Angularが予想される順序でAngularがフックを呼び出す様子を示すために存在します。

このスナップショットは、*Create...* ボタンをクリックしてから *Destroy...* ボタンをクリックした後のログの状態を反映しています。

<div class="lightbox">
  <img src="generated/images/guide/lifecycle-hooks/peek-a-boo.png" alt="Peek-a-boo">
</div>

一連のログメッセージは、規定のフックの呼び出し順序に従います：
`OnChanges`, `OnInit`, `DoCheck`&nbsp;(3x), `AfterContentInit`, `AfterContentChecked`&nbsp;(3x),
`AfterViewInit`, `AfterViewChecked`&nbsp;(3x), と `OnDestroy`。

<div class="alert is-helpful">

  コンストラクターは、Angularフック *そのもの* ではありません。
  ログは、入力プロパティ（この場合は `name` プロパティ）が構築時に割り当てられた値を持たないことを確認します。

</div>

ユーザーが *Update Hero* ボタンをクリックしたとき、 ログには別の `OnChanges` と、
`DoCheck`、`AfterContentChecked`、`AfterViewChecked` のトリプレットが追加で2つ表示されます。
明らかに、これらの3つのフックは *頻繁* に点火します。 これらのフックにロジックを可能な限り少なくしておきましょう！

次の例は、フックの詳細に焦点を当てています。


{@a spy}

## *OnInit* と *OnDestroy* をスパイする

これらの2つのスパイフックで潜伏して、要素が初期化または破棄されたときを発見します。

これは、ディレクティブのための完璧な潜入ジョブです。
ヒーローたちは彼らが見守られていることを決して知らないでしょう。

<div class="alert is-helpful">

  冗談はさておき、ふたつの重要な点に注意を払います：

  1. *ディレクティブ* およびコンポーネントのAngular呼び出しフックメソッド。<br><br>

  2. spyディレクティブは、直接変更できないDOMオブジェクトの洞察を提供します。
  明らかに、ネイティブの `<div>` の実装に触れることはできません。
  サードパーティのコンポーネントも変更できません。
  しかし、あなたは両方のディレクティブを見ることができます。

</div>

こそこそしたスパイ・ディレクティブはシンプルで、注入された `LoggerService` を介して親にメッセージを記録する
`ngOnInit()` と `ngOnDestroy()` フックでほぼ全体を構成しています。

<code-example path="lifecycle-hooks/src/app/spy.directive.ts" region="spy-directive" header="src/app/spy.directive.ts"></code-example>

スパイをネイティブ要素またはコンポーネント要素に適用すると、その要素と同時に初期化され、
破棄されます。
これは、繰り返しのヒーローの `<div>` に付け加えられています：

<code-example path="lifecycle-hooks/src/app/spy.component.html" region="template" header="src/app/spy.component.html"></code-example>

個々のスパイの誕生と死は、付属のヒーロー `<div>` の出生と死を、つぎに示すように
 *フック・ログ* に記入して記録します。

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/spy-directive.gif' alt="Spy Directive">
</div>

ヒーローを追加すると、新しいヒーローの `<div>` になります。 スパイの `ngOnInit()` はそのイベントを記録します。

*Reset* ボタンは `ヒーロー` リストをクリアします。
Angularはすべてのヒーローの `<div>` 要素をDOMから削除し、同時にそのスパイ・ディレクティブを破棄します。
スパイの `ngOnDestroy()` メソッドは最後の瞬間を報告します。

`ngOnInit()` と `ngOnDestroy()` メソッドは、実際のアプリケーションでもっと重要な役割を果たします。

{@a oninit}

### _OnInit()_

`ngOnInit()` を使う主な理由は2つあります。

1. 構築直後に複雑な初期化を実行する。
1. Angularが入力プロパティを設定した後コンポーネントを設定する。

経験豊富な開発者は、コンポーネントを安価で安全に構築する必要があることに同意します。

<div class="alert is-helpful">

  Angular チームリーダーであるMisko Heveryが、
  複雑なコンストラクターロジックを避けるべき
  [理由を説明します](http://misko.hevery.com/code-reviewers-guide/flaw-constructor-does-real-work/)

</div>

コンポーネントコンストラクターでデータをフェッチしないでください。
新しいコンポーネントが、テスト中に作成されたとき、または表示する前に、
リモートサーバーに接続しようとすることを心配すべきではありません。
コンストラクターは、初期のローカル変数を単純な値に設定すること以外は、やるべきではありません。

`ngOnInit()` は、コンポーネントが初期データを取得するのに適しています。
[ツアー・オブ・ヒーローズ チュートリアル](tutorial/toh-pt4#oninit)のガイドはその方法を示しています。


ディレクティブのデータバインドされた入力プロパティは、_構築後_ まで設定されません。
これは、それらのプロパティに基づいてディレクティブを初期化する必要がある場合には、問題になります。
これらは `ngOnInit()` の実行時には設定されています。

<div class="alert is-helpful">

  `ngOnChanges()` メソッドは、それらのプロパティにアクセスする最初の機会です。
  Angularは `ngOnInit()` の前に `ngOnChanges()` を呼び出し、その後何度も呼び出します。
  `ngOnInit()`は一度だけ呼び出されます。

</div>

Angularを使用すると、コンポーネントを作成した _すぐ_ 後で、`ngOnInit()` メソッドを呼び出すことができます。
これは、重たい初期化ロジックが属する場所です。

{@a ondestroy}

### _OnDestroy()_

`ngOnDestroy()` にクリーンアップ・ロジックを入れます、これは、Angularがディレクティブを破棄する前に実行しなければならないロジックです。

これは、アプリケーションの別の部分にコンポーネントが終了することを通知するためのタイミングです。

これは自動的にガベージ・コレクションされないリソースを解放する場所です。
ObservableとDOMイベントの購読を解除しましょう。インターバルタイマーを停止しましょう。
このディレクティブがグローバル・サービスまたはアプリケーション・サービスに登録したすべてのコールバックを登録解除しましょう。
あなたがそれを怠ると、メモリーリークが発生する可能性があります。

{@a onchanges}

## _OnChanges()_

Angularは、コンポーネント(またはディレクティブ)の ***入力プロパティ***　への変更を検出するたびに、その `ngOnChanges()` メソッドを呼び出します。
この例は `OnChanges` フックを監視します。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="ng-on-changes" header="on-changes.component.ts (excerpt)"></code-example>

`ngOnChanges()` メソッドは、変更された各プロパティの名前と、現在および前のプロパティ値を保持する
[SimpleChange](api/core/SimpleChange) オブジェクトをマップするオブジェクトを受け取ります。
このフックは、変更されたプロパティを反復処理してログに記録します。

サンプルのコンポーネントである `OnChangesComponent` は、` hero` と `power` の2つの入力プロパティを持っています。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="inputs" header="src/app/on-changes.component.ts"></code-example>

ホストの `OnChangesParentComponent` は次のようにそれらにバインドします：

<code-example path="lifecycle-hooks/src/app/on-changes-parent.component.html" region="on-changes" header="src/app/on-changes-parent.component.html"></code-example>

ここでは、ユーザーが変更を加えたときの実際のサンプルを示します。

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/on-changes-anim.gif' alt="OnChanges">
</div>

ログエントリは、*power* プロパティの文字列値として表示されます。
しかし、 `ngOnChanges` は `hero.name` への変更をキャッチしません。
はじめはそれに驚きます。

Angularは、入力プロパティの値が変更されたときにのみフックを呼び出します。
`hero` プロパティの値は、*ヒーローオブジェクトへの参照です* 。
Angularは、ヒーロー自身の `name` プロパティが変更されても気にしません。
ヒーローオブジェクトの *参照* は変わらなかったので、Angularの観点から報告する変更はありません！

{@a docheck}

## _DoCheck()_

Angularがそれ自身で捕捉しない変更を検出し、それに対応するために `DoCheck` フックを使います。

<div class="alert is-helpful">

  Angularが見落とした変更を検出するには、このメソッドを使用します。

</div>

*DoCheck* サンプルは *OnChanges* サンプルを次の `ngDoCheck()` フックで拡張します：

<code-example path="lifecycle-hooks/src/app/do-check.component.ts" region="ng-do-check" header="DoCheckComponent (ngDoCheck)"></code-example>

このコードは、特定の _関心のある値_ を検査し、現在の状態を以前の値とキャプチャして比較します。
`hero` や `power` に実質的な変更がないときに特別なメッセージをログに書き込むので、 `DoCheck` が呼び出される
頻度を知ることができます。 この結果はわかりやすいです：

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/do-check-anim.gif' alt="DoCheck">
</div>

`ngDoCheck()` フックはヒーローの `name` が変更された時を検出できますが、恐ろしいコストがあります。
このフックは非常に頻繁に呼び出されます&mdash;変更が発生した場所に関係なく _すべて_ の変更検知サイクルの後で。
この例では、ユーザーが何かをする前に20回以上呼び出されています。

これらの初期チェックのほとんどは、Angularが最初に *関連しないデータをページの他の場所で* レンダリングすることによってトリガーされます。
別の `<input>` にマウスを移動するだけで呼び出しがトリガーされます。
関連するデータへの実際の変更を明らかにする呼び出しは比較的少ないです。
明らかに、私たちの実装は非常に軽量でなければならず、そうでなければユーザー体験は苦しくなります。

{@a afterview}

## AfterView

*AfterView* サンプルは、コンポーネントの子ビューを作成した *後* 、Angularが呼び出す `AfterViewInit()` および
`AfterViewChecked()` フックを調べます。

ここでは、 `<input>` にヒーローの名前を表示する子ビューがあります：

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="child-view" header="ChildComponent"></code-example>

`AfterViewComponent` は、この子ビューを *テンプレート内* に表示します：

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="template" header="AfterViewComponent (template)"></code-example>

次のフックは、子ビュー *内の値の変更* に基づいてアクションを実行します。
[@ViewChild](api/core/ViewChild) で
装飾されたプロパティを使用して子ビューを照会することによってのみ到達できます。


<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="hooks" header="AfterViewComponent (class excerpts)"></code-example>

{@a wait-a-tick}

### 単方向データフローのルールに従う
ヒーロー名が10文字を超えると、 `doSomething()` メソッドは画面を更新します。

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="do-something" header="AfterViewComponent (doSomething)"></code-example>

なぜ `doSomething()` メソッドは `comment` を更新する前にティックを待つのでしょうか？

Angularの単方向データフローのルールは、ビューが構成された *後* の更新を禁止します。
これら両方のフックはコンポーネントのビューが構成された _後_ に発火します。

Angularは、フックがコンポーネントのデータバインドされた `comment` プロパティを直ちに更新する場合、
エラーをスローします(試してみてください)。
`LoggerService.tick_then()` は、ブラウザの JavaScript サイクルの1度転分の
ログ更新を延期します。

*AfterView* の実際の動作はこれです：

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/after-view-anim.gif' alt="AfterView">
</div>

Angularは `AfterViewChecked()` を頻繁に呼び出し、興味のある変更がない場合が多いことに注意してください。
パフォーマンスの問題を回避するために、小さなフックメソッドを記述しましょう。

{@a aftercontent}

## AfterContent

*AfterContent* のサンプルは、Angularが外部コンテンツをコンポーネントに投影した *後* に
Angularが呼び出す `AfterContentInit()` および `AfterContentChecked()` フックを調べます。

{@a content-projection}

### コンテンツ投影

*コンテンツ投影* は、コンポーネントの外部からHTMLコンテンツをインポートし、
そのコンテンツをコンポーネントのテンプレートに指定された場所に挿入する方法です。

<div class="alert is-helpful">

  AngularJSの開発者は、この手法を *transclusion* として認識しています。

</div>

[前の_AfterView_](guide/lifecycle-hooks#afterview) の例でこの変化を考えてみましょう。
今回は、テンプレート内に子ビューを含めるのではなく、 `AfterContentComponent` の親からコンテンツをインポートします。
親のテンプレートは次のとおりです：

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="parent-template" header="AfterContentParentComponent (template excerpt)"></code-example>

`<app-child>` タグは `<after-content>` タグの間に挟まれています。
そのコンテンツをコンポーネントに投影するつもりでない限り、コンポーネントの要素タグ
*の間にコンテンツを置かないでください*。

コンポーネントのテンプレートを見てみましょう：

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="template" header="AfterContentComponent (template)"></code-example>

`<ng-content>` タグは、外部コンテンツの *プレースホルダー* です。
Angularはそのコンテンツをどこに挿入するかを指示します。
この場合、投影されるコンテンツは親からの `<app-child>` です。

<div class="lightbox">
  <img src='generated/images/guide/lifecycle-hooks/projected-child-view.png' alt="Projected Content">
</div>

<div class="alert is-helpful">

  *コンテンツ投影* の兆候は2つあります：

  * コンポーネント要素タグ間のHTML。
  * コンポーネントのテンプレート中の `<ng-content>` タグの存在。

</div>

{@a aftercontent-hooks}

### AfterContent フック

*AfterContent* フックは *AfterView* フックと似ています。
重要な違いは、子コンポーネントにあります。

* *AfterView* フックは、要素のタグがコンポーネントのテンプレート *内に*
表示されている子コンポーネントである `ViewChildren` に関係します。

* *AfterContent* フックは、Angularがコンポーネントに投影した子コンポーネントである
`ContentChildren` に関係します。

次の *AfterContent* フックは、[@ContentChild](api/core/ContentChild) で装飾された
プロパティを介してそれらを照会することによってのみ達することができる
*子コンテント* の値を変更することに基づいてアクションを実行します。

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="hooks" header="AfterContentComponent (class excerpts)"></code-example>

{@a no-unidirectional-flow-worries}

### _AfterContent_ で単方向フローの心配はありません

このコンポーネントの `doSomething()` メソッドは、コンポーネントのデータバインドされた `comment` プロパティを直ちに更新します。
[待つ必要は](guide/lifecycle-hooks#wait-a-tick) ありません。

Angularは *AfterView* フックのいずれかを呼び出す前に *AfterContent* フックを呼び出すことを思い出してください。
Angularは、このコンポーネントのビューの構成を完了する前に投影されたコンテンツの構成を完了します。
`AfterContent ...` と `AfterView ...` フックの間にはホストビューを変更するためのわずかな時間帯があります。
