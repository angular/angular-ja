# コンポーネントの相互作用

{@a top}

このクックブックには、2つ以上のコンポーネントが情報を共有する
一般的なコンポーネントの通信シナリオのレシピが含まれています。
{@a toc}

<!--

# コンテンツ

* [親から入力バインディングを持つ子へのデータ渡し](guide/component-interaction#parent-to-child)
* [インターセプト(傍受)がセッターによるプロパティ変更を入力する](guide/component-interaction#parent-to-child-setter)
* [インターセプト(傍受)が `ngOnChanges()` によるプロパティの変更へ入力する](guide/component-interaction#parent-to-child-on-changes)
* [親が `@ViewChild()` を呼び出す](guide/component-interaction#parent-to-view-child)
* [サービスによる親と子の通信](guide/component-interaction#bidirectional-service)

-->

**<live-example name="component-interaction"></live-example>を参照してください。**.

{@a parent-to-child}

## 親から入力バインディングを持つ子へのデータ渡し

`HeroChildComponent` は、二つの ***入力プロパティ*** を持っています,
一般的に [@Input デコレーション](guide/template-syntax#inputs-outputs) で装飾しています。


<code-example path="component-interaction/src/app/hero-child.component.ts" title="component-interaction/src/app/hero-child.component.ts">

</code-example>



二番目の `@Input` は、子コンポーネント名 `masterName` を `'master'` としてエイリアスします。

`HeroParentComponent` は、内部の `*ngFor` リピーターで、子の `HeroChildComponent` を繰り返します、
それ(親)の `master` プロパティ文字列を子の `master` エイリアスに結び付け(バインディングし)ます、
そして、それぞれのインスタンスの `hero` は、子の `hero` プロパティにインスタンスします。


<code-example path="component-interaction/src/app/hero-parent.component.ts" title="component-interaction/src/app/hero-parent.component.ts">

</code-example>



動作するアプリケーションは、三人のヒーローを表示します:


<figure>
  <img src="generated/images/guide/component-interaction/parent-to-child.png" alt="Parent-to-child">
</figure>



<h3 class="no-toc">テストしよう</h3>

E2E は、予想通りに、全ての子をインスタンス化と表示化される事をテストします：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child" title="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a parent-to-child-setter}

## インターセプト(傍受)がセッターによるプロパティ変更を入力

インターセプトの為に入力プロパティのセッターを利用し、親からの値に基いて活動します。

`name` のセッターが、子の `NameChildComponent` の中のプロパティに入力し、子の `NameChildComponent`
は、名前の前後の空白を取り除き(空白をトリムし)、そしてデフォルトテキストがある空の値に置き換えする。


<code-example path="component-interaction/src/app/name-child.component.ts" title="component-interaction/src/app/name-child.component.ts">

</code-example>



ここで `NameParentComponent` は、全て空白の名前を含む名前のバリエーションをデモンストレーションします：


<code-example path="component-interaction/src/app/name-parent.component.ts" title="component-interaction/src/app/name-parent.component.ts">

</code-example>



<figure>
  <img src="generated/images/guide/component-interaction/setter.png" alt="Parent-to-child-setter">
</figure>



<h3 class="no-toc">テストしよう</h3>

E2E は、空と空では無い名前を含む入力プロパティのセッターをテストします：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-setter" title="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a parent-to-child-on-changes}

## インターセプト(傍受)が `ngOnChanges()` によるプロパティの変更へ入力

ライフサイクル・フック・インターフェースの `OnChanges` の `ngOnChanges()` メソッドによる入力プロパティー値の変化にもとづく検知し活動する。

<div class="l-sub-section">



あなたは、このアプローチ、すなわち、多くを監視し、プロパティの入力をインタラクトするプロパティの方法、を好むかもしれません。

`ngOnChanges()` については [ライフサイクル・フック](guide/lifecycle-hooks) の章で学びましょう。

</div>



この `VersionChildComponent` は、`メジャー` と `マイナー` 入力プロパティの変化を検出し、これらの変化をレポート(報告)するログメッセージを構成します：


<code-example path="component-interaction/src/app/version-child.component.ts" title="component-interaction/src/app/version-child.component.ts">

</code-example>



`VersionParentComponent` は `マイナー` と `メジャー` の値を供給し(満たし)、ボタンをそれらを変更するメソッドに結び付けます。


<code-example path="component-interaction/src/app/version-parent.component.ts" title="component-interaction/src/app/version-parent.component.ts">

</code-example>



ここに、ボタン押下シーケンスのアウトプット(出力)があります：


<figure>
  <img src="generated/images/guide/component-interaction/parent-to-child-on-changes.gif" alt="Parent-to-child-onchanges">
</figure>



<h3 class="no-toc">テストしよう</h3>

テストは、***両方*** の入力プロパティは初期値を設定し、ボタンのクリックは
`ngOnChanges` の呼出と値を期待します：



<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-onchanges" title="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a child-to-parent}

## 親は子のイベントを聞いてます

子コンポーネントは、何かが起こった時にイベントを `発行する` `EventEmitter` プロパティをむき出しにします。
親は、そのイベント・プロパティを結び付け(バインドし)、それらのイベントに反応します。

子の `EventEmitter` プロパティは、一つの ***出力プロパティ*** です、
 　一般的に、この `VoterComponent` に見られる様な
  [@Output デコレーション](guide/template-syntax#inputs-outputs) で装飾します：


<code-example path="component-interaction/src/app/voter.component.ts" title="component-interaction/src/app/voter.component.ts">

</code-example>



ボタンのクリックは、 ブールの *ペイロード* に `true` か `false` の放出を引き起こします。

親の `VoteTakerComponent` は `onVoted()` と呼ばれるイベント・ハンドラーを結び付け(バインドし)ます。`onVoted()` は、子のイベント
ペイロード `$event` に反応し、カウンターを更新します。


<code-example path="component-interaction/src/app/votetaker.component.ts" title="component-interaction/src/app/votetaker.component.ts">

</code-example>



フレームワークは、 &mdash;`$event`により表された &mdash; イベント引数をハンドラー・メソッドに渡し、
メソッドは処理を行います：


<figure>
  <img src="generated/images/guide/component-interaction/child-to-parent.gif" alt="Child-to-parent">
</figure>



<h3 class="no-toc">テストしよう</h3>

*Agree* と *Disagree* ボタンをクリックすることによる適切なカウンターが更新されるテスト：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="child-to-parent" title="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)



## *ローカル変数* による親から子への相互作用

親のコンポーネントは、データ・バインディングを使って子のプロパティ或いは、
子のメソッドを読む事はできません。どちらも、
つぎの例で見れる様に、子の要素のための参照値ひな形を
生成すると出来ます、そして、
*親のひな形による* 変数を参照します。


{@a countdown-timer-example}
次は、ゼロになるまで繰り返しカウントダウンし、ロケットを発射する子の `CountdownTimerComponent`　です。
それには、時計を制御しテンプレート内のカウントダウン状況のメッセージを表示する
`start` と `stop` メソッドを持っています。

<code-example path="component-interaction/src/app/countdown-timer.component.ts" title="component-interaction/src/app/countdown-timer.component.ts">

</code-example>



タイマー・コンポーネントを提供する `CountdownLocalVarParentComponent` はこちらです：


<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="lv" title="component-interaction/src/app/countdown-parent.component.ts">

</code-example>



親のコンポーネントは、子の `start` と `stop` メソッドにも、子の `seconds` プロパティにも
データ・バインド(データの結び付き)を出来ません。

子のコンポーネントに相当する　`<countdown-timer>` タグ内に `#timer` ローカル変数を設置する事は出来ます。
子のコンポーネントへの参照と、*いかなるプロパティまたはメソッド* へアクセスする能力と
を親のテンプレートを通じて与えます。

この例は、親のボタンを子の `start` と `stop`　に結び付け、
子の `seconds` プロパティを表示します。


ここで親と子が一緒に動いているのを確認できます。


<figure>
  <img src="generated/images/guide/component-interaction/countdown-timer-anim.gif" alt="countdown timer">
</figure>



{@a countdown-tests}


<h3 class="no-toc">テストしよう</h3>

親のテンプレート内に表示されている秒と子のステータス・メッセージ内に
表示されている秒が一致している事をテストしましょう。
カウントダウン・タイマーが *Stop* ボタンのクリックによって一時停止する事をテストしましょう：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="countdown-timer-tests" title="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a parent-to-view-child}

## 親の _@ViewChild()_ 呼び出し

*ローカル変数* は、簡素で簡単です。しかし、制限があります、何故ならば
親-子の結び付きは完全に親のテンプレート内で無ければなりません。
親コンポーネントは *それ自身* に子へのアクセスは何一つ無いです。

仮に親のコンポーネント *クラス* のインスタンスが、子のコンポーネントの変数の読み書きの必要性、または子の
コンポーネント・メソッド呼び出しの必要性があったとしても、*ローカル変数* テクニックを使う事はできません、

親コンポーネント *クラス* が、そのような種類のアクセスを要求する際、
子のコンポーネントを 親の *ViewChild* として ***注入します*** 。

つぎの例は、同じ[カウントダウン タイマー](guide/component-interaction#countdown-timer-example) の例
と共に説明しています。

どの外見も、どのふるまいも変わりません。
子の [CountdownTimerComponent](guide/component-interaction#countdown-timer-example) は一緒です。

<div class="l-sub-section">



*ローカル変数* から *ViewChild*　テクニックへの切替は、
デモンストレーションのたった一つの目的です。

</div>



ここに親があります、`CountdownViewChildParentComponent`：

<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="vc" title="component-interaction/src/app/countdown-parent.component.ts">

</code-example>



親のコンポーネント *クラス* の中に表示する子を獲得する働きをちょこっと見てみましょう。

まず始めに、 `ViewChild` デコレーターの参照をインポートする必要があります、そして `AfterViewInit` ライフサイクルをフックします。

つぎは、子の `CountdownTimerComponent`　を `@ViewChild`　プロパティ・デコレーションを付けて
プライベートな `timerComponent` プロパティとしてインジェクション(注入)します。

`#timer` ローカル変数は、コンポーネント・メタデータになります。
その代わりに、親自身の `start` と `stop` メソッドをボタンに結び付け、そして
親のコンポーネントの `seconds` メソッドとの補間により現在の秒を刻々と表示します。

これらのメソッドは、直接注入されたタイマー・コンポーネントをアクセスします。

`ngAfterViewInit()` のライフサイクル・フックは重要なコツ(名案)です。
タイマーコンポーネントは、Angular が親のビューを表示した *後* まで有効ではありません。
それは、初めは `0` 秒で表示します。

そして Angularは、*遅すぎる* 秒のカウントダウンを表示する親のビューの更新の時に
`ngAfterViewInit` ライフサイクル・フックを呼び出します。
Angularの一定方向のみのデータの流れのルールは、同じサイクルの中の親のビューの更新を妨げます。アプリケーションは、
秒を表示する前に、*1回の待ち* を持っています。

Use `setTimeout()` to wait one tick and then revise the `seconds()` method so
that it takes future values from the timer component.
一つのカチカチを待つために `setTimeout()` を使い、 `seconds()`メソッドがタイマー・コンポーネント
からの未来の値を取るように改定する。

<h3 class="no-toc">テストしよう</h3>

以前の [同じカウントダウン・タイマーのテスト](guide/component-interaction#countdown-tests) を使おう。

[最初に戻る](guide/component-interaction#top)

{@a bidirectional-service}

## サービスを介した親と子のコミュニケーション

親のコンポーネントとその子は、 *家族の範囲内で* 双方向のコミュニケーションが可能なインターフェースするサービス
を共有します。

サービス・インスタンスの範囲(スコープ)は、親コンポーネントとそれの子です。
コンポーネントの外、コンポーネントのサブツリーは、サービスへのアクセスや彼らとのコミュニケーションが有りません。

この `MissionService` は、複数の `AstronautComponent` の子と `MissionControlComponent` に繋がります。


<code-example path="component-interaction/src/app/mission.service.ts" title="component-interaction/src/app/mission.service.ts">

</code-example>



`MissionControlComponent` は、子(`providers` メタデータの配列を通して)と共有しているサービスのインスタンスと
コンストラクターを通したそれ自身のインスタンスの注入(インジェクト)の両方を提供します。


<code-example path="component-interaction/src/app/missioncontrol.component.ts" title="component-interaction/src/app/missioncontrol.component.ts">

</code-example>



`AstronautComponent` は、コンストラクター内でサービスとしてインジェクト(注入)もします。
どの `AstronautComponent` は `MissionControlComponent` の子どもです、それゆえに親のサービス・インスタンスを受信します。：


<code-example path="component-interaction/src/app/astronaut.component.ts" title="component-interaction/src/app/astronaut.component.ts">

</code-example>



<div class="l-sub-section">



注意、この例は、`subscription` と `AstronautComponent` が破棄されたときの `unsubscribe()` とを表現します。
これは、メモリーリークの防護ステップです。ここには、このアプリの現実のリスクは有りません、なぜならば lifetime `AstronautComponent` のライフタイムは、アプリそれ自身のライフタイムと同じだからです。
より複雑なアプリケーションでは、常に真であると **いうことでは無い** 。

`MissionControlComponent` には、このガードを加えられない、何故ならば、親として、
`MissionService` のライフタイムを制御するから。

</div>



*ヒストリー* ログは、メッセージが、親の `MissionControlComponent` と子の `AstronautComponent` の間で両方
方向に伝わることを示し、サービスによって容易になります：


<figure>
  <img src="generated/images/guide/component-interaction/bidirectional-service.gif" alt="bidirectional-service">
</figure>



<h3 class="no-toc">テストしよう</h3>

親の `MissionControlComponent` と子の `AstronautComponent` 両方のボタんをクリックして試験して、
ヒストリーが期待に直面するのを検証しよう。


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="bidirectional-service" title="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)
