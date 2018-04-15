# ライフサイクル・フック

<img src="generated/images/guide/lifecycle-hooks/hooks-in-sequence.png" alt="Us" class="left">

コンポーネントのライフサイクルは、Angularによって管理されています。

Angular はそれを作成し、レンダリングし、その子を作成してレンダリングし、
データバインドされたプロパティが変更されたときにチェックし、DOMから削除する前に破棄します。

Angular は **ライフサイクル・フック** を勧めます、
これらの重要な生まれる瞬間や、発生時に行動する能力を可視化します。

ディレクティブには、コンポーネントのコンテンツとビューに固有のフックを除いたライフサイクルフックのセットがあります。

{@a hooks-overview}

## コンポーネントのライフサイクル・フックの概要

ディレクティブとコンポーネントのインスタンスは、Angularがライフサイクルを作成、
更新、および破棄するにつれてライフサイクルを持ちます。
開発者は、ライフサイクルの重要な瞬間を、
Angular `core` ライブラリの　*ライフサイクル・フック*　インタフェースの1つ以上を使用します。

各インターフェースは、名前が `ng` で始まるインターフェース名である単一のフックメソッドを持っています。
例えば、 `OnInit` インタフェースは　`ngOnInit()` という名前のフックメソッドを持っています。
Angularはコンポーネントの作成直後に呼び出します。

<code-example path="lifecycle-hooks/src/app/peek-a-boo.component.ts" region="ngOnInit" title="peek-a-boo.component.ts (excerpt)" linenums="false"></code-example>

ディレクティブまたはコンポーネントは、ライフサイクルフックのすべてを実装することはなく、
フックのいくつかはコンポーネントに対してのみ意味を持ちます。
Angularは、ディレクティブ/コンポーネント・フック・メソッド *が定義されている場合にのみ呼び出す* 。

{@a hooks-purpose-timing}

## ライフサイクル・シーケンス

コンストラクタを呼び出してコンポーネント/指令を作成した *後* 、
Angularは、ライフサイクル・フック・メソッドをつぎの順序で特定の瞬間に呼び出します。

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

      Angularがデータバインドプロパティを最初に表示し、ディレクティブ/コンポーネントの入力プロパティを設定した後で、
      ディレクティブ/コンポーネントを初期化します。

      *最初* の `ngOnChanges()` の後に *一度* 呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngDoCheck()</code>
    </td>
    <td>

      Angularが検出できない、または検出できない変更を検出して、それに基づいて行動します。

      変更検知の実行中に、 `ngOnChanges()` と `ngOnInit()` の直後に呼び出されます。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentInit()</code>
    </td>
    <td>

      Angularの後に応答すると、外部コンテンツがコンポーネントのビューに投影されます。

      最初の `ngDoCheck()` の後に _1回_ 呼び出されます。

      _コンポーネントのみのフック_ 。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterContentChecked()</code>
    </td>
    <td>

      Angularの後に応答すると、コンポーネントに投影されるコンテンツがチェックされます。

      `ngAfterContentInit()` とその後の `ngDoCheck()` の後に呼び出されます。

      _コンポーネントのみのフック_ 。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewInit()</code>
    </td>
    <td>

      Angularの後に応答すると、コンポーネントのビューと子ビューが初期化されます。

      最初の `ngAfterContentChecked()` の後に _1回_ 呼び出されます。

      _コンポーネントのみのフック_ 。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngAfterViewChecked()</code>
    </td>
    <td>

      Angularの後に応答すると、コンポーネントのビューと子ビューがチェックされます。

      `ngAfterViewInit` とその後のすべての `ngAfterContentChecked()` の後に呼び出されます。

      _コンポーネントのみのフック_ 。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <code>ngOnDestroy()</code>
    </td>
    <td>

      Angularの直前のクリーンアップは、ディレクティブ/コンポーネントを破壊します。
      登録解除オブザーバブルとイベントハンドラを切り離してメモリリークを回避します。

      Angularがディレクティブ/コンポーネントを破壊する _直前_ に呼び出されます。

    </td>
  </tr>
</table>

{@a interface-optional}

## インタフェースはオプションです(技術的に)

純粋に技術的な観点から、JavaScript と Typescript の開発者はインターフェイスを省略することができます。
JavaScript言語にはインタフェースがありません。
変換されたJavaScriptからは消えてしまうため、Angularでは実行時にTypeScriptインターフェイスが表示されません。

F幸いにも、それらは必要ではありません。
フック自身の利益を得るために、ディレクティブとコンポーネントにライフサイクルフックインターフェイスを追加する必要はありません。

Angularではディレクティブクラスとコンポーネントクラスを検査し、*定義されている場合は* フックメソッドを呼び出します。
Angularは `ngOnInit()`のようなインタフェースを持つかどうかを調べ、呼び出します。

それにもかかわらず、タイピングやエディタツールの恩恵を受けるには、TypeScriptディレクティブクラスに
インターフェイスを追加することをお勧めします。

{@a other-lifecycle-hooks}

## 他の Angular ライフサイクルフック

他のAngularサブシステムは、これらのコンポーネントフックとは別のライフサイクルフックを持つことがあります。

サードパーティのライブラリは、開発者がこれらのライブラリの使用方法をより詳細に制御できるように、
フックを実装することもできます。

{@a the-sample}

## ライフサイクルの例

<live-example></live-example> は、ルート `AppComponent`
の制御下でコンポーネントとして提示された一連の演習を通して、
ライフサイクルのフックを実演しています。

それらは共通のパターンに従います： 一つの *親* コンポーネントは、ライフサイクルフックメソッド
の1つ以上を示す *子* コンポーネントのテストリグとして機能します。

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

      ディレクティブにはライフサイクル・フックもあります。
      `SpyDirective` は、それがスパイする要素が `ngOnInit` と `ngOnDestroy` フック
      を使って作成または破棄されるとログに記録できます。

      この例では、親SpyComponentによって管理される `ngFor` *hero* リピータの
       `<div>` に `SpyDirective` を適用します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#onchanges">OnChanges</a>
    </td>
    <td>

      Angularが、コンポーネント入力プロパティの1つが変更されるたびに、
      `changes` オブジェクトで `ngOnChanges()` フックを呼び出す方法を見てください。
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

      Angularが意味するものを *表示* で示します。
      `ngAfterViewInit` と `ngAfterViewChecked` フックを示します。

    </td>
  </tr>
  <tr style='vertical-align:top'>
    <td>
      <a href="#aftercontent">AfterContent</a>
    </td>
    <td>

      外部コンテンツをコンポーネントに投影する方法、および投影されたコンテンツをコンポーネント
      のビューの子供と区別する方法を示します。
      `ngAfterContentInit` と `ngAfterContentChecked` フックを示します。

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
ピーク・ア・ブー(いないいないばー)は、Angularが予想される順序でフックを呼び出す方法を示すために存在します。

このスナップショットは、*Create ...* ボタンをクリックしてから *Destroy...* ボタンをクリックした
後のログの状態を反映しています。

<figure>
  <img src="generated/images/guide/lifecycle-hooks/peek-a-boo.png" alt="Peek-a-boo">
</figure>

一連のログメッセージは、規定のフックの呼び出し順序に従います：
`OnChanges`, `OnInit`, `DoCheck` (3x), `AfterContentInit`, `AfterContentChecked` (3x),
`AfterViewInit`, `AfterViewChecked` (3x), と `OnDestroy`。

<div class="l-sub-section">

  コンストラクタは、Angularフック *そのもの* ではありません。
  コンストラクタはAngularフック自体ではありません。
  ログは、入力プロパティ（この場合は `name` プロパティ）が構築時に割り当てられた値を持たないことを確認します。

</div>

ユーザーが *Update Hero* ボタンをクリックした場合、 ログには別の `OnChanges` と `DoCheck`、
`AfterContentChecked` と `AfterViewChecked` の2つのトリプレットが表示されます。
明らかに、これらの3つのフックは *頻繁* に発火します。 これらのフックにロジックを可能な限り少なくしておきます！

次の例は、フックの詳細に焦点を当てています。


{@a spy}

## *OnInit* と *OnDestroy* をスパイする

これらの2つのスパイフックで潜伏して、要素が初期化または破壊されたときを発見します。

これは、ディレクティブのための完璧な潜入ジョブです。
英雄たちは彼らが見守られていることを決して知らないでしょう。

<div class="l-sub-section">

  冗談はさておき、二つの重要な点に注意を払います：

  1. *ディレクティブ* およびコンポーネントのAngular呼び出しフックメソッド。<br><br>

  2. spyディレクティブは、直接変更できないDOMオブジェクトの洞察を提供します。
  明らかに、ネイティブの `<div>` の実装に触れることはできません。
  第三者コンポーネントも変更できません。
  しかし、あなたは両方の指示を見ることができます。

</div>

こそこそしたスパイ指令はシンプルで、注入された `LoggerService` を介して親にメッセージを記録する
`ngOnInit()` と `ngOnDestroy()` フックでほぼ完全に構成されています。

<code-example path="lifecycle-hooks/src/app/spy.directive.ts" region="spy-directive" title="src/app/spy.directive.ts" linenums="false"></code-example>

スパイをネイティブコンポーネントまたはコンポーネントに適用すると、そのエレメントと同時に、
スパイを初期化して破棄します。
これは、繰り返しのヒーロー `<div>` に添付されています：

<code-example path="lifecycle-hooks/src/app/spy.component.html" region="template" title="src/app/spy.component.html" linenums="false"></code-example>

それぞれのスパイの出生と死は、付属の英雄 `<div>`の出生と死を、以下に示すように
 *フック・ログ* に記入して記録します。

<figure>
  <img src='generated/images/guide/lifecycle-hooks/spy-directive.gif' alt="Spy Directive">
</figure>

主人公を追加すると、新しいヒーロー `<div>` になります。 スパイの `ngOnInit()` はそのイベントを記録します。

*Reset* ボタンは `ヒーロー` リストをクリアします。
Angularはすべてのヒーローの `<div>` 要素をDOMから削除し、同時にそのスパイ・ディレクティブを破棄します。
Tスパイの `ngOnDestroy()` メソッドは最後の瞬間を報告します。

T`ngOnInit()` と `ngOnDestroy()` メソッドは、実際のアプリケーションでもっと重要な役割を果たします。

{@a oninit}

### _OnInit()_

`ngOnInit()` を使う主な理由は2つあります。

1. 構築直後に複雑な初期化を実行する。
1. Angularが入力プロパティを設定した後コンポーネントを設定する。

経験豊富な開発者は、コンポーネントを安価で安全に構築する必要があることに同意します。

<div class="l-sub-section">

  Misko Hevery, Angular チームリーダー、
  [理由を説明します](http://misko.hevery.com/code-reviewers-guide/flaw-constructor-does-real-work/)
  複雑なコンストラクタロジックを避ける必要があります。

</div>

コンポーネントコンストラクタでデータをフェッチしないでください。
新しいコンポーネントが、テスト中に作成されたときまたは表示する前に、
リモートサーバーに接続しようとすることを心配する必要はありません。
コンストラクターは初期のローカル変数を単純な値に設定するだけで済みません。

`ngOnInit()` は、コンポーネントが初期データを取得するのに適しています。
[ヒーローズ・ツアー・チュートリアル](tutorial/toh-pt4#oninit) は方法を示すガイドです。


ディレクティブのデータバインドされた入力プロパティは、_構築後_ まで設定されません。
これは、それらのプロパティに基づいてディレクティブを初期化する必要がある場合には問題になります。
`ngOnInit()` が実行されるときに設定されます。

<div class="l-sub-section">

  `ngOnChanges()` メソッドは、それらのプロパティにアクセスする最初の機会です。
  Angularは `ngOnInit()` の前に `ngOnChanges()` を呼び出し、その後何度も呼び出します。
  これは `ngOnInit()` を一度呼び出すだけです。

</div>

Angularを使用すると、コンポーネントを作成した後で、すぐに `ngOnInit()` メソッドを呼び出すことができます。
これは、重たい初期化ロジックが属する場所です。

{@a ondestroy}

### _OnDestroy()_

`ngOnDestroy()` にクリーンアップロジックを入れます。これは、Angularがディレクティブを破壊する前に実行しなければならないロジックです。

これは、アプリケーションの別の部分にコンポーネントが終了することを通知するためのタイミングです。

これは自動的にガベージコレクションされないリソースを解放する場所です。
ObservablesとDOMイベントの登録を解除する。 インターバルタイマーを停止する。
Uこのディレクティブがグローバルサービスまたはアプリケーションサービスに登録したすべてのコールバックを登録解除します。
あなたがそれを怠ると、メモリーリークが発生する可能性があります。

{@a onchanges}

## _OnChanges()_

Angularは、コンポーネント(またはディレクティブ)の***入力プロパティ***への変更を検出するたびに、その `ngOnChanges()` メソッドを呼び出します。
この例は `OnChanges` フックを監視します。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="ng-on-changes" title="on-changes.component.ts (excerpt)" linenums="false"></code-example>

`ngOnChanges()` メソッドは、変更された各プロパティ名を、現在および前のプロパティ値を保持する
[SimpleChange](api/core/SimpleChange) オブジェクトにマップするオブジェクトを取ります。
このフックは、変更されたプロパティを反復処理してログに記録します。

サンプルのコンポーネントである `OnChangesComponent` は、` hero` と `power` の2つの入力プロパティを持っています。

<code-example path="lifecycle-hooks/src/app/on-changes.component.ts" region="inputs" title="src/app/on-changes.component.ts" linenums="false"></code-example>

ホスト `OnChangesParentComponent` は次のようにそれらにバインドします：

<code-example path="lifecycle-hooks/src/app/on-changes-parent.component.html" region="on-changes" title="src/app/on-changes-parent.component.html"></code-example>

ここでは、ユーザーが変更を加えたときの実際のサンプルを示します。

<figure>
  <img src='generated/images/guide/lifecycle-hooks/on-changes-anim.gif' alt="OnChanges">
</figure>

ログエントリは、*power* プロパティの文字列値として表示されます。
しかし、 `ngOnChanges` は `hero.name` への変更をキャッチしません、
それは最初は驚くべきことです。

Angularは、入力プロパティの値が変更されたときにのみフックを呼び出します。
`hero` プロパティの値は、*ヒーローオブジェクトへの参照です* 。
Angularは、ヒーロー自身の `name` プロパティが変更されても気にしません。
ヒーローオブジェクト *参照* は変更されていませんでしたので、Angularの観点から報告する変更はありません！

{@a docheck}

## _DoCheck()_

Angularがそれ自身で捕捉しない変更を検出し、それに対応するために `DoCheck` フックを使います。

<div class="l-sub-section">

  Angularが見落とした変更を検出するには、このメソッドを使用します。

</div>

* DoCheck *サンプルは *OnChanges* サンプルを次の `ngDoCheck()` フックで拡張します：

<code-example path="lifecycle-hooks/src/app/do-check.component.ts" region="ng-do-check" title="DoCheckComponent (ngDoCheck)" linenums="false"></code-example>

このコードは、特定の _関心のある値_ を検査し、現在の状態を以前の値と比較してキャプチャして比較します。
「主人公」や「力」に実質的な変更がないときに特別なメッセージをログに書き込むので、 `DoCheck`が呼び出される
頻度を知ることができます。 結果は照らしている： 結果は理解の助けになっている：

<figure>
  <img src='generated/images/guide/lifecycle-hooks/do-check-anim.gif' alt="DoCheck">
</figure>

`ngDoCheck()` フックはヒーローの `name` が変更された時を検出できますが、それは恐ろしいコストがあります。
このフックは、変更が発生した場所に関係なく、すべての変更検出サイクルの後で、非常に頻繁に呼び出されます。
この例では、ユーザーが何かをする前に20回以上呼び出されています。

Most of these initial checks are triggered by Angular's first rendering of *unrelated data elsewhere on the page*.
Mere mousing into another `<input>` triggers a call.
Relatively few calls reveal actual changes to pertinent data.
Clearly our implementation must be very lightweight or the user experience suffers.

{@a afterview}

## AfterView

*AfterView* サンプルは、コンポーネントの子ビューを作成した *後* 、Angularが呼び出す `AfterViewInit()` および
`AfterViewChecked()` フックを調べます。

ここでは、 `<input>` に英雄の名前を表示する子ビューがあります：

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="child-view" title="ChildComponent" linenums="false"></code-example>

`AfterViewComponent` は、この子ビューを *テンプレート内* に表示します：

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="template" title="AfterViewComponent (template)" linenums="false"></code-example>

次のフックは、子ビュー *内の値の変更* に基づいてアクションを実行します。
[@ViewChild](api/core/ViewChild) で装飾されたプロパティを使用して子ビューを照会することによってのみ到達できます。


<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="hooks" title="AfterViewComponent (class excerpts)" linenums="false"></code-example>

{@a wait-a-tick}

### 単方向データフロールールに従う
ヒーロー名が10文字を超えると、 `doSomething()` メソッドは画面を更新します。

<code-example path="lifecycle-hooks/src/app/after-view.component.ts" region="do-something" title="AfterViewComponent (doSomething)" linenums="false"></code-example>

なぜ `doSomething()` メソッドは `comment` を更新する前にチェックを待つのですか？

Angularの単方向データフロールールは、作成 *後* のビューへの更新を禁止します。
これらのフックの両方が、コンポーネントのビューが作成された _後_ に起動します。

Angularは、フックがコンポーネントのデータバインドされた `comment` プロパティを直ちに更新する場合、
エラーをスローします(試してみてください)。
`LoggerService.tick_then()` は、ブラウザの JavaScript サイクルの1回転分の
ログ更新を延期します。

*AfterView* の実際の動作はこれです：

<figure>
  <img src='generated/images/guide/lifecycle-hooks/after-view-anim.gif' alt="AfterView">
</figure>

Angularは `AfterViewChecked()` を頻繁に呼び出します。多くの場合、興味のある変更がないときです。
リーン・フック・メソッドを記述すると、パフォーマンスの問題を回避できます。

{@a aftercontent}

## AfterContent

*AfterContent* サンプルは、AngularがAngularの *後* に呼び出す `AfterContentInit()` と 
`AfterContentChecked()` がフックし、外部コンテンツをコンポーネントに投影することを探る。

{@a content-projection}

### コンテンツ投影

*コンテンツ投影* は、コンポーネントの外部からHTMLコンテンツをインポートし、
そのコンテンツをコンポーネントのテンプレートに指定された場所に挿入する方法です。

<div class="l-sub-section">

  AngularJSの開発者は、この手法を *転帰* として認識しています。

</div>
[previous _AfterView_]
[以前の_AfterView_](guide/lifecycle-hooks#afterview) の例のこのバリエーションを考えてみましょう。
今回は、テンプレート内に子ビューを含めるのではなく、 `AfterContentComponent` の親からコンテンツをインポートします。
親のテンプレートは次のとおりです：

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="parent-template" title="AfterContentParentComponent (template excerpt)" linenums="false"></code-example>

`<my-child>` タグは `<after-content>` タグの間に挟まれています。
そのコンテンツをコンポーネントに投影するつもりでない限り、コンポーネントの要素タグ
*の間にコンテンツを置かないでください*。

コンポーネントのテンプレートを見てみましょう：

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="template" title="AfterContentComponent (template)" linenums="false"></code-example>

`<ng-content>` タグは、外部コンテンツの *プレースホルダー* です。
Angularはそのコンテンツをどこに挿入するかを指示します。
この場合、投影されるコンテンツは親からの `<my-child>` です。

<figure>
  <img src='generated/images/guide/lifecycle-hooks/projected-child-view.png' alt="Projected Content">
</figure>

<div class="l-sub-section">

  *コンテンツ投影* の兆候は2つあります：

  * コンポーネント要素タグ間のHTML。
  * コンポーネントのテンプレートに `<ng-content>` タグが存在します。

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
*コンテント チャイルド* の値を変更することに基づいてアクションを実行します。
.

<code-example path="lifecycle-hooks/src/app/after-content.component.ts" region="hooks" title="AfterContentComponent (class excerpts)" linenums="false"></code-example>

{@a no-unidirectional-flow-worries}

### _AfterContent_ で単方向フローの心配はありません

このコンポーネントの `doSomething()` メソッドは、コンポーネントのデータバインドされた `comment` プロパティを直ちに更新します。
[待つ必要は](guide/lifecycle-hooks#wait-a-tick) ありません。

Angularは *AfterView* フックのいずれかを呼び出す前に *AfterContent* フックを呼び出すことを思い出してください。
Angularは、このコンポーネントのビューの合成を完了する前に投影されたコンテンツの構成を完了します。
`AfterContent ...` と `AfterView ...` フックの間には、ホストビューを変更するための小さなウィンドウがあります。