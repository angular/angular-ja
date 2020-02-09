# コンポーネントの相互作用

{@a top}

このクックブックには、2つ以上のコンポーネントが情報を共有する
一般的なコンポーネントの通信シナリオのレシピが含まれています。
{@a toc}

<!--

# コンテンツ

* [入力バインディングで親から子へデータを渡す](guide/component-interaction#parent-to-child)
* [セッターによって入力プロパティの変更を傍受する](guide/component-interaction#parent-to-child-setter)
* [ngOnChanges()によって入力プロパティの変更を傍受する](guide/component-interaction#parent-to-child-on-changes)
* [親が `@ViewChild()` を呼び出す](guide/component-interaction#parent-to-view-child)
* [サービスによる親と子の通信](guide/component-interaction#bidirectional-service)

-->

**<live-example name="component-interaction"></live-example>を参照してください。**.

{@a parent-to-child}

## 入力バインディングで親から子へデータを渡す

`HeroChildComponent` は、ふたつの ***入力プロパティ*** を持っています,
一般的に [@Input デコレーション](guide/template-syntax#inputs-outputs) で装飾しています。


<code-example path="component-interaction/src/app/hero-child.component.ts" header="component-interaction/src/app/hero-child.component.ts">

</code-example>



二番目の `@Input` は、子コンポーネントのプロパティ名である `masterName` を `'master'` としてエイリアスします。

`HeroParentComponent` は子の `HeroChildComponent` を `*ngFor` リピーターの中にネストし、
その `master` 文字列プロパティを子の `master` エイリアスにバインドし、
個々の繰り返しの `hero` インスタンスを子の `hero` プロパティに渡します。


<code-example path="component-interaction/src/app/hero-parent.component.ts" header="component-interaction/src/app/hero-parent.component.ts">

</code-example>



動作するアプリケーションは、三人のヒーローを表示します:


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/parent-to-child.png" alt="Parent-to-child">
</div>



<h3 class="no-toc">テストしよう</h3>

E2E は、予想とおりに、すべての子をインスタンス化と表示されることをテストします：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a parent-to-child-setter}

## セッターによって入力プロパティの変更を傍受する

親からの値を傍受して行動するために、入力プロパティのセッターを使いましょう。

子の `NameChildComponent` にある `name` 入力プロパティのセッターは、
名前から空白を削除し、空の値をデフォルトのテキストに置き換えます。


<code-example path="component-interaction/src/app/name-child.component.ts" header="component-interaction/src/app/name-child.component.ts">

</code-example>



これは `NameParentComponent`があらゆる空白を含む名前のバリエーションのデモンストレーションです：


<code-example path="component-interaction/src/app/name-parent.component.ts" header="component-interaction/src/app/name-parent.component.ts">

</code-example>



<div class="lightbox">
  <img src="generated/images/guide/component-interaction/setter.png" alt="Parent-to-child-setter">
</div>



<h3 class="no-toc">テストしよう</h3>

E2E は、空と空では無い名前を含む入力プロパティのセッターをテストします：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-setter" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a parent-to-child-on-changes}

## ngOnChanges()によって入力プロパティの変更を傍受する

`OnChanges` ライフサイクルフックのインターフェースの `ngOnChanges()` メソッドによって、入力プロパティの値の変化を検知して行動しましょう。

<div class="alert is-helpful">



複数の相互作用する入力プロパティを監視するときには、プロパティのセッターへのアプローチを推奨します。

`ngOnChanges()` については [ライフサイクル・フック](guide/lifecycle-hooks) の章で学びましょう。

</div>



この `VersionChildComponent` は、`major` と `minor` 入力プロパティの変化を検出し、これらの変化を報告するログメッセージを構成します：


<code-example path="component-interaction/src/app/version-child.component.ts" header="component-interaction/src/app/version-child.component.ts">

</code-example>



`VersionParentComponent` は `minor` と `major` の値を提供し、ボタンをそれらを変更するメソッドに結び付けます。


<code-example path="component-interaction/src/app/version-parent.component.ts" header="component-interaction/src/app/version-parent.component.ts">

</code-example>



これはボタン押下シーケンスの出力です：


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/parent-to-child-on-changes.gif" alt="Parent-to-child-onchanges">
</div>



<h3 class="no-toc">テストしよう</h3>

***両方*** の入力プロパティが初期値を設定され、
ボタンのクリックが期待された `ngOnChanges` の呼び出しと値を引き起こすことをテストします。：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-onchanges" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a child-to-parent}

## 親が子のイベントをリッスンする

子コンポーネントは、何かが起こった時にイベントを `発行する` `EventEmitter` プロパティを公開します。
親は、そのイベントプロパティにバインドし、イベントに反応します。

子の `EventEmitter` プロパティはひとつの ***出力プロパティ*** であり、
 　一般的に、この `VoterComponent` に見られるような
  [@Output デコレーション](guide/template-syntax#inputs-outputs) で装飾されます：


<code-example path="component-interaction/src/app/voter.component.ts" header="component-interaction/src/app/voter.component.ts">

</code-example>



ボタンをクリックすると、 `true` または `false` の真偽値の *ペイロード* が発生します。

親の `VoteTakerComponent` は子のイベントペイロードの `$event` に反応してカウンターを更新する
`onVoted()` イベントハンドラーをバインドします。


<code-example path="component-interaction/src/app/votetaker.component.ts" header="component-interaction/src/app/votetaker.component.ts">

</code-example>



フレームワークは、 &mdash;`$event`により表された &mdash; イベント引数をハンドラーメソッドに渡し、
メソッドは処理を行います：


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/child-to-parent.gif" alt="Child-to-parent">
</div>



<h3 class="no-toc">テストしよう</h3>

*Agree* と *Disagree* ボタンをクリックすることで適切にカウンターが更新されることをテストしましょう：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="child-to-parent" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)



## *ローカル変数* による親から子への相互作用

親のコンポーネントは、データ・バインディングを使って子のプロパティあるいは、
次の例のように、
子要素のテンプレート参照変数を作成し、
*親テンプレート内で* その変数を参照することで、
両方を実行できます。

{@a countdown-timer-example}
次は、ゼロになるまで繰り返しカウントダウンし、ロケットを発射する子の `CountdownTimerComponent`　です。
時計を制御しカウントダウンの状況のメッセージをテンプレート内に表示する
`start` と `stop` メソッドを持ちます。

<code-example path="component-interaction/src/app/countdown-timer.component.ts" header="component-interaction/src/app/countdown-timer.component.ts">

</code-example>



タイマーコンポーネントを提供する `CountdownLocalVarParentComponent` はこちらです：


<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="lv" header="component-interaction/src/app/countdown-parent.component.ts">

</code-example>



親コンポーネントは、子の `start` および `stop` メソッド、
あるいは `seconds` プロパティのどれにもデータをバインドできません。

子コンポーネントを表す `<countdown-timer>` タグに、ローカル変数 `#timer` を配置できます。
これにより、子コンポーネントへの参照が与えられ、親テンプレート内から *あらゆるプロパティやメソッド* に
アクセスすることができます。

この例では、親のボタンを子の `start` と `stop` に結びつけ、
補間を使用して子の `seconds` プロパティを表示しています。

ここで親と子が一緒に動いているのを確認できます。


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/countdown-timer-anim.gif" alt="countdown timer">
</div>



{@a countdown-tests}


<h3 class="no-toc">テストしよう</h3>

親のテンプレート内に表示されている秒と子のステータス・メッセージ内に
表示されている秒が一致していることをテストしましょう。
カウントダウンタイマーが *Stop* ボタンのクリックによって一時停止することをテストしましょう：


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="countdown-timer-tests" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)

{@a parent-to-view-child}

## 親が _@ViewChild()_ を呼び出す

*ローカル変数* のアプローチはシンプルで簡単です。
しかし、親子の結びつきは親のテンプレート内で完結する必要があるため、制限があります。
親コンポーネント *自身* は子へのアクセス権を持ちません。

仮に親のコンポーネント *クラス* のインスタンスが、子のコンポーネントの変数の読み書きの必要性、または子の
コンポーネントメソッド呼び出しの必要性があったとしても、*ローカル変数* テクニックを使うことはできません、

親コンポーネント *クラス* が、そのような種類のアクセスを要求する際、
子のコンポーネントを 親の *ViewChild* として ***注入します*** 。

次の例は、同じ[カウントダウンタイマー](guide/component-interaction#countdown-timer-example) の例
と共に説明しています。
どの外見も、どのふるまいも変わりません。
子の [CountdownTimerComponent](guide/component-interaction#countdown-timer-example) は一緒です。

<div class="alert is-helpful">



*ローカル変数* から *ViewChild* テクニックへの切り替えは、
デモンストレーションの目的のみのためです。

</div>



ここに親の `CountdownViewChildParentComponent` があります：

<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="vc" header="component-interaction/src/app/countdown-parent.component.ts">

</code-example>



親コンポーネント *クラス* に子ビューを取得するにはもう少し作業が必要です。

まず、`ViewChild` デコレーターと `AfterViewInit` ライフサイクルフックへの参照をインポートする必要があります。

次に、`@ViewChild` プロパティデコレーションを使用して、
子の `CountdownTimerComponent` をプライベートな `timerComponent` プロパティに挿入します。

`#timer` ローカル変数はコンポーネントのメタデータから削除されました。
代わりに、ボタンを親コンポーネント自身の `start` および `stop` メソッドにバインドし、
親コンポーネントの `seconds` メソッドの補間として秒の刻みを表示しましょう。

これらのメソッドは、直接注入されたタイマーコンポーネントをアクセスします。

この `ngAfterViewInit()` ライフサイクルフックは重要な妙案です。
タイマーコンポーネントは、Angularが親ビューを表示した *後* まで使用できません。
したがって、最初は `0` 秒を表示します。

その後Angularは、親ビューのカウントダウン秒の表示を更新するには *遅すぎる* 時に
`ngAfterViewInit` ライフサイクルフックを呼び出します。
 Angularの単方向データフロールールは、同じサイクル内の親ビューの更新を防ぎます。
アプリは秒を表示するようになる前に　*1ターン待つ*　必要があります。

`setTimeout()` を使用して1回の刻みを待ってから、
タイマーコンポーネントから将来の値を取得するように `seconds()` メソッドを変更します。

<h3 class="no-toc">テストしよう</h3>

以前と[同じカウントダウンタイマーのテスト](guide/component-interaction#countdown-tests)を使用してください。

[最初に戻る](guide/component-interaction#top)

{@a bidirectional-service}

## 親と子がサービスを介して通信する

親コンポーネントとその子コンポーネントは、そのインターフェースが *家族内での* 双方向通信を可能にするサービスを
共有します。

サービスインスタンスのスコープは、親コンポーネントとその子です。
このコンポーネントのサブツリー外のコンポーネントは、サービスまたはその通信にアクセスできません。

この `MissionService` は、 `MissionControlComponent` を複数の子の `AstronautComponent` に接続します。


<code-example path="component-interaction/src/app/mission.service.ts" header="component-interaction/src/app/mission.service.ts">

</code-example>



`MissionControlComponent` は、子と共有するサービスのインスタンスを(`providers` のメタデータ配列を介して)提供し、
そのインスタンスをそのコンストラクターを通じて自身に注入します。


<code-example path="component-interaction/src/app/missioncontrol.component.ts" header="component-interaction/src/app/missioncontrol.component.ts">

</code-example>



また、`AstronautComponent` はコンストラクターにサービスを挿入します。
個々の `AstronautComponent` は `MissionControlComponent` の子であるため、親のサービスインスタンスを受け取ります：


<code-example path="component-interaction/src/app/astronaut.component.ts" header="component-interaction/src/app/astronaut.component.ts">

</code-example>



<div class="alert is-helpful">



この例は `subscription` を捕捉し、 `AstronautComponent` が破棄されたときに `unsubscribe()` していることに注意してください。
これはメモリリークガードのステップです。 `AstronautComponent` のライフタイムは、
アプリ自体のライフタイムと同じなので、このアプリには実際のリスクはありません。
それは、より複雑なアプリケーションでは常に **真ではありません** 。

このガードを`MissionControlComponent`に追加しないのは、
親として`MissionService`のライフタイムを制御するためです。

</div>



*History* ログは、
親の`MissionControlComponent`と`AstronautComponent`の子の間で、
サービスによって容易になったメッセージの双方向の移動を示します：


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/bidirectional-service.gif" alt="bidirectional-service">
</div>



<h3 class="no-toc">テストしよう</h3>

親の `MissionControlComponent` と `AstronautComponent` の子の両方のボタンをクリックして、
履歴が期待とおりのものであることを確認します。


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="bidirectional-service" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[最初に戻る](guide/component-interaction#top)
