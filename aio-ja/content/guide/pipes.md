# パイプ

すべてのアプリケーションは、単純なタスクのようなところから始めます。つまり、データを取得し、変換し、ユーザーに表示します。
データの取得は、ローカル変数の作成のように単純だったり、あるいはWebSocketを介したデータのストリーミングのように複雑だったりします。

データが届いたあと、生の`toString`の値を直接ビューに挿入できますが、
これがよいユーザー体験になることはめったにありません。
たとえば、ほとんどのユースケースでは、ユーザーは<samp>Fri Apr 15 1988 00:00:00 GMT-0700 (Pacific Daylight Time)</samp>のような生の文字列ではなく、
<samp>1988年4月15日</samp>のような簡単な形式で日付を表示することを好みます。 

明らかに、いくつかの値は少しの編集によって恩恵を受けます。多くのアプリケーションの内外で
何度も同じ変換を適用したいという願望に、あなたは気付くかもしれません。
あなたはほとんどそれらをスタイルとして考えることができます。
実際、その変換はスタイルと同じようにHTMLテンプレート中で適用できるのです。

ここではHTMLで宣言できる表示値の変換方法であるAngularパイプを紹介します。

Stackblitzの<live-example></live-example>を実行し、コードをダウンロードしてください。


## パイプを使う

パイプは入力としてデータを取り込み、それを望んだ出力に変換します。
このページでは、パイプを使用してコンポーネントの誕生日プロパティを人に優しい日付に変換します。


<code-example path="pipes/src/app/hero-birthday1.component.ts" header="src/app/hero-birthday1.component.ts"></code-example>



コンポーネントのテンプレートに注目します。


<code-example path="pipes/src/app/app.component.html" region="hero-birthday-template" header="src/app/app.component.html"></code-example>



補間式の内部では、コンポーネントの`birthday`の値を、
[パイプ演算子](guide/template-syntax#pipe)（|）を介して右側の[Dateパイプ](api/common/DatePipe)関数に渡します。
すべてのパイプはこのように動作します。



## ビルトインのパイプ
Angularには`DatePipe`、`UpperCasePipe`、`LowerCasePipe`、`CurrencyPipe`や`PercentPipe`というようなパイプが付属しています。
それらはすべてテンプレートで使用できます。
<div class="alert is-helpful">



これらの機能や他の多くのビルトイン機能について詳しくは、[APIリファレンス](api)の[パイプトピック](api?type=pipe)をご覧ください。
"pipe"という単語を含むエントリをフィルタリングします。

Angularは[付録](guide/pipes#no-filter-pipe)で説明されている理由のために、`FilterPipe`や`OrderByPipe`はもちません。


</div>


{@a parameterizing-a-pipe}

## パイプのパラメータ化

パイプは、任意の数のオプションパラメータを受け取り、その出力を微調整することができます。
パイプにパラメータを追加するには、パイプ名の後にコロン（：）とパラメータ値を付けます（たとえば`currency:'EUR'`など）。
パイプが複数のパラメータを受け取る場合は、値をコロンで区切ります（たとえば`slice:1:5`）。

誕生日のテンプレートを変更して、Dateパイプに書式パラメータを与えます。
ヒーローの4月15日の誕生日をフォーマットした後、出力結果は**<samp>04/15/88</samp>**のようになります。


<code-example path="pipes/src/app/app.component.html" region="format-birthday" header="src/app/app.component.html"></code-example>



パラメータ値には、文字列リテラルやコンポーネントプロパティなど、
任意の有効なテンプレート式を使用できます（[テンプレート構文](guide/template-syntax)ページの[テンプレート式](guide/template-syntax#template-expressions)セクションを参照してください）。
つまり、バインドを介して誕生日の値を制御するのと同じ方法で、バインディングを通じて書式を制御できます。

パイプのformatパラメータをコンポーネントの`format`プロパティにバインドする、2番目のコンポーネントを記述します。
そのコンポーネントのテンプレートは次のとおりです。


<code-example path="pipes/src/app/hero-birthday2.component.ts" region="template" header="src/app/hero-birthday2.component.ts (template)"></code-example>



また、テンプレートにボタンを追加し、そのクリックイベントをコンポーネントの`toggleFormat()`メソッドにバインドしました。
このメソッドは、コンポーネントの`format`プロパティを短い書式（`'shortDate'`）と長い書式（`'fullDate'`）の間で切り替えます。


<code-example path="pipes/src/app/hero-birthday2.component.ts" region="class" header="src/app/hero-birthday2.component.ts (class)"></code-example>



ボタンをクリックすると、"**<samp>04/15/1988</samp>**"と"**<samp>Friday, April 15, 1988</samp>**"の間で切り替わります。


<figure>
  <img src='generated/images/guide/pipes/date-format-toggle-anim.gif' alt="Date Format Toggle">
</figure>



<div class="alert is-helpful">



`DatePipe`のフォーマットオプションの詳細については、APIリファレンスの[Date Pipe](api/common/DatePipe)ページを参照してください。


</div>



## パイプを繋げる

便利になるような組み合わせでパイプを連鎖させることができます。
次の例では、誕生日を大文字で表示するために、
誕生日は`DatePipe`と`UpperCasePipe`を連鎖させています。
誕生日は**<samp>APR 15, 1988</samp>**のように表示されます。.


<code-example path="pipes/src/app/app.component.html" region="chained-birthday" header="src/app/app.component.html"></code-example>


この例 (**<samp>FRIDAY, APRIL 15, 1988</samp>が表示されます**) では
先ほどと同様のパイプを繋いでいますが、`date`にもパラメーターが上手く渡っています。


<code-example path="pipes/src/app/app.component.html" region="chained-parameter-birthday" header="src/app/app.component.html"></code-example>




## カスタムパイプ

独自のカスタムパイプを書くことができます。
この`ExponentialStrengthPipe`という名前のパイプはヒーローの力を高めることができます。


<code-example path="pipes/src/app/exponential-strength.pipe.ts" header="src/app/exponential-strength.pipe.ts"></code-example>



このパイプ定義は、次の重要な点を明らかにします。

* パイプはパイプメタデータで装飾されたクラスです。
* パイプクラスは、入力値の後にオプションのパラメータを受け入れ、
変換された値を返す`PipeTransform`インターフェースの`transform`メソッドを実装します
* パイプに渡された個々のパラメータについて、`transform`メソッドには引数が追加されます。
このパイプはそのような`exponent`パラメーターをもちます。
* これがパイプであることをAngularに伝えるには、
Angularコアライブラリからインポートする`@Pipe`デコレーターを適用します。
* `@Pipe`デコレーターはあなたがテンプレート式の中で使用するパイプ名を定義することができます。
名前はJavaScriptの識別子として有効である必要があります。
あなたのパイプの名前は`exponentialStrength`です。


<div class="alert is-helpful">



## *PipeTransform*インターフェース

この`transform`メソッドはパイプにとって不可欠です。
`PipeTransform`*インターフェース*は、そのメソッドを定義し、ツールとコンパイラの両方に情報を与えます。
技術的にはこれはオプションであり、Angularはこの`transform`メソッドを無関係に探して実行します。

</div>

パイプをデモンストレーションするコンポーネントが必要です。

<code-example path="pipes/src/app/power-booster.component.ts" header="src/app/power-booster.component.ts"></code-example>

<figure>
  <img src='generated/images/guide/pipes/power-booster.png' alt="Power Booster">
</figure>



次の点に注意してください。

* 組み込みパイプと同じ方法でカスタムパイプを使用します。
* パイプを`AppModule`の`declarations`配列に含める必要があります。
* パイプをクラスに注入することを選択した場合、それをあなたの `NgModule` の ` provider` 配列に提供しなければなりません。

<div class="callout is-helpful">

<header>
  declarations配列を思い出しましょう
</header>


カスタムパイプは登録する必要があります。
そうしなければ、Angularはエラーを報告します。
[Angular CLI](cli)のジェネレータはパイプを自動的に登録します。


</div>



その動作を確認するには <live-example></live-example> でテンプレートの中の値とオプションの指数を変更してみましょう。

## パワーブースト計算機

カスタムパイプをテストするためにテンプレートを更新するのは楽しいことではありません。
この例を、パイプと`ngModel`による双方向データバインディングを組み合わせた
"Power Boost Calculator"にアップグレードしましょう。


<code-example path="pipes/src/app/power-boost-calculator.component.ts" header="src/app/power-boost-calculator.component.ts">

</code-example>



<figure>
  <img src='generated/images/guide/pipes/power-boost-calculator-anim.gif' alt="Power Boost Calculator">
</figure>




{@a change-detection}


## パイプと変更検知

Angularは、すべてのDOMイベント（キーストローク、マウス移動、タイマー、およびサーバーレスポンス）の後に実行される*変更検知*のプロセスごとに、
データバインド値の変更を探します。これはコストが高くなる可能性があります。
Angularは可能な限り適切なコストを下げるよう努力しています。

パイプを使用するときには、Angularは簡単で迅速な変更検知アルゴリズムを選択します。

<h3 class="no-toc">パイプがない場合</h3>

次の例では、コンポーネントはデフォルトの積極的な変更検知ストラテジーを使用して、
`heroes`配列内のすべてのヒーローの表示を監視および更新します。テンプレートは次のとおりです。


<code-example path="pipes/src/app/flying-heroes.component.html" region="template-1" header="src/app/flying-heroes.component.html (v1)"></code-example>



対となるコンポーネントクラスはヒーローを提供し、ヒーローを配列に追加し、配列をリセットすることができます。

<code-example path="pipes/src/app/flying-heroes.component.ts" region="v1" header="src/app/flying-heroes.component.ts (v1)"></code-example>



ヒーローを追加すると、、Angularは表示を更新します。
`reset`ボタンをクリックすると、`heroes`配列がオリジナルのヒーローの配列に置き換えられ、表示が更新されます。
ヒーローを削除または変更する機能を追加した場合、Angularはこれらの変更を検出して表示を更新します。

<h3 class="no-toc"><i>FlyingHeroesPipe</i></h3>

飛行可能なヒーローだけをフィルタリングする`FlyingHeroesPipe`を`*ngFor`リピーターに追加します。

<code-example path="pipes/src/app/flying-heroes.component.html" region="template-flying-heroes" header="src/app/flying-heroes.component.html (flyers)"></code-example>



これは`FlyingHeroesPipe`の実装です。先に説明したカスタムパイプのパターンにしたがっています。

<code-example path="pipes/src/app/flying-heroes.pipe.ts" region="pure" header="src/app/flying-heroes.pipe.ts"></code-example>



<live-example></live-example> の奇妙な行動に注目してください。
飛行するヒーローを追加しても、"Heroes who fly."の下には表示されません。

あなたが望む振る舞いを得られていないにもかかわらず、Angularは壊れていません。
これは、リストまたはその要素の変更を無視する、異なる変更検知アルゴリズムを使用しているだけです。

ヒーローがどのように追加されたかを確認しましょう。

<code-example path="pipes/src/app/flying-heroes.component.ts" region="push" header="src/app/flying-heroes.component.ts"></code-example>



ヒーローを`heroes`配列に追加しています。配列への参照は変更されていません。
それは同じ配列です。それだけがAngularが気にしていることです。その視点からすれば、*同じ配列、変更なし、表示更新はありません*。

これを修正するには、新しいヒーローが追加された配列を作成し、`heroes`に割り当てます。
そうすれば、Angularは配列の参照が変更されたことを検知します。
パイプを実行し、新しい飛行ヒーローを含む新しい配列で表示を更新します。

もし配列を*変更*した場合には、パイプは呼び出されず、表示は更新されません。
しかし配列を*置き換え*た場合は、パイプが実行され、表示が更新されます。
Flying Heroesアプリケーションは、
チェックボックススイッチと追加の表示でコードを拡張し、これらの効果を体験するのに役立ちます。


<figure>
  <img src='generated/images/guide/pipes/flying-heroes-anim.gif' alt="Flying Heroes">
</figure>



配列を置換すると、Angularに信号を送信して表示を更新できます。
いつ配列を置換するか、それはデータが変更されたときです。
*この*例での簡単なルールでは、データを変更する唯一の方法は主人公を追加することです。

多くの場合、データがいつ変更されたかはわかりません。
さまざまな方法でデータを変更するアプリケーションでは特にそうですし、アプリケーションの場所が離れているときにもそうなるでしょう。
そのようなアプリケーションのコンポーネントは、通常、その変更について知ることができません。
さらに、パイプを乗せるためにコンポーネントの設計を歪めることは賢明ではありません。
コンポーネントクラスをHTMLとは独立に保つように努めます。
コンポーネントはパイプを認識していないはずです。

飛行するヒーローをフィルタリングするには、*不純なパイプ*を検討しましょう。


{@a pure-and-impure-pipes}

## 純粋なパイプと不純なパイプ

パイプには*純粋*なものと*不純*なものがあります。
パイプはデフォルトで純粋です。これまでに見たパイプはすべて純粋です。
パイプのpureフラグをfalseに設定することによって、パイプを不純にします。
このように`FlyingHeroesPipe`を不純にできます。


<code-example path="pipes/src/app/flying-heroes.pipe.ts" region="pipe-decorator" header="src/app/flying-heroes.pipe.ts"></code-example>



これをおこなう前に、純粋なものと純粋でないものとの違いを、まずは純粋なパイプから理解しましょう。

<h3 class="no-toc">純粋パイプ</h3>

Angularが*純粋なパイプ*を実行するのは、入力値に対する*純粋な変更*を検出した場合だけです。
純粋な変更とは、プリミティブな入力値への変更（`String`、`Number`、`Boolean`、`Symbol`）、
あるいはオブジェクト参照の変更です（`Date`、`Array`、`Function`、`Object`）。

Angularは（複合した）オブジェクト内の変更を無視します。
月を変更したり、配列に追加したり、オブジェクトのプロパティを更新しても、純粋なパイプは呼び出されません。

これは制限的なように見えるかもしれませんが、高速です。
オブジェクトの参照チェックは、&mdash;差分の深いチェックよりもはるかに&mdash;高速です。
そのため、Angularはパイプの実行とビューの更新の両方をスキップできるかどうかを迅速に判断できます。

このため、この変更検知ストラテジーを使用する場合は、純粋なパイプが適しています。
できない場合は、不純なパイプを使用することが*可能です*。


<div class="alert is-helpful">



あるいは、パイプをまったく使用しないかもしれません。
コンポーネントのプロパティを使ってパイプの目的を追求する方がよいかもしれません。
この点については、このページの後半で説明します。


</div>



<h3 class="no-toc">不純パイプ</h3>

Angularは、 コンポーネントの変更検知サイクルごとに*不純なパイプ*を実行します。
不純なパイプは、すべてのキーストロークやマウス移動のように、頻繁に呼び出されます。

それを念頭に置いて、細心の注意を払って不純なパイプを実装してください。
ハイコストで長時間実行するパイプは、ユーザー体験を破壊する可能性があります。


{@a impure-flying-heroes}


<h3 class="no-toc">不純な<i>FlyingHeroesPipe</i></h3>

`FlyingHeroesPipe`から`FlyingHeroesImpurePipe`にスイッチを切り替えます。
完全な実装は次のとおりです。

<code-tabs>

  <code-pane header="FlyingHeroesImpurePipe" path="pipes/src/app/flying-heroes.pipe.ts" region="impure">

  </code-pane>

  <code-pane header="FlyingHeroesPipe" path="pipes/src/app/flying-heroes.pipe.ts" region="pure">

  </code-pane>

</code-tabs>



あなたは内部が何も変わっていないということを証明するために`FlyingHeroesPipe`を継承しています。
唯一の違いは、パイプメタデータの`pure`フラグです。

この`transform`関数は簡単で速いため、不純なパイプにしてもよいでしょう。


<code-example path="pipes/src/app/flying-heroes.pipe.ts" header="src/app/flying-heroes.pipe.ts (filter)" region="filter"></code-example>



`FlyingHeroesComponent`から`FlyingHeroesImpureComponent`を派生させることができます。


<code-example path="pipes/src/app/flying-heroes-impure.component.html" header="src/app/flying-heroes-impure.component.html (excerpt)" region="template-flying-heroes"></code-example>



実質的な変更は、テンプレート内のパイプだけです。
<live-example></live-example>では、`heroes`配列を変更してヒーローを追加したときに
_flying heroes_の表示が更新されることを確認できます。


{@a async-pipe}
<h3 class="no-toc">不純な<i>AsyncPipe</i></h3>


Angularの`AsyncPipe`は不純なパイプの興味深い例です。
`AsyncPipe`は`Promise`または`Observable`を入力として受け入れ、
自動的にサブスクライブし、最終的に出力された値を返します。

`AsyncPipe`はステートフルでもあります。
パイプは入力された`Observable`のサブスクリプションを維持し、
その`Observable`から到着した値を渡し続けます。

次の例では、メッセージ文字列の`Observable`（`message$`）を
`async`パイプを使ってビューにバインドします。


<code-example path="pipes/src/app/hero-async-message.component.ts" header="src/app/hero-async-message.component.ts">

</code-example>



Asyncパイプは、コンポーネントコードから定型文を削減します。
コンポーネントは、非同期データソースを購読する必要はなく、
解決された値を抽出してバインドするために公開する必要はなく、
破棄されたときに購読を解除する必要もありません（メモリリークの強力な原因）。

<h3 class="no-toc">不純なキャッシングパイプ</h3>

不純なパイプをもうひとつ作りましょう。これはHTTP要求をおこないます。

不純なパイプは数ミリ秒ごとに呼び出されることに注意してください。
慎重にならなければ、このパイプはリクエストでサーバーを攻撃するでしょう。

次のコードでは、リクエストURLが変更されたときにのみパイプがサーバーを呼び出し、サーバーのレスポンスをキャッシュします。
このコードでは、[Angular http](guide/http)クライアントを使用してデータを取得しています。


<code-example path="pipes/src/app/fetch-json.pipe.ts" header="src/app/fetch-json.pipe.ts">

</code-example>



それではこのパイプへの2つのバインディングをテンプレートで定義するコンポーネントで、
`heroes.json`ファイルからヒーローを要求してみましょう。


<code-example path="pipes/src/app/hero-list.component.ts" header="src/app/hero-list.component.ts">

</code-example>



コンポーネントは次のようにレンダリングされます。


<figure>
  <img src='generated/images/guide/pipes/hero-list.png' alt="Hero List">
</figure>



パイプのデータ要求のブレークポイントは、次のことを示します。

* 各バインディングは、個々のパイプインスタンスを取得します。
* 各パイプインスタンスは、個々のURLとデータをキャッシュします。
* 各パイプ・インスタンスはサーバーを1回だけ呼び出します。

<h3 class="no-toc"><i>JsonPipe</i></h3>

先ほどのコードサンプルでは、​​2番目の`fetch`パイプバインディングはより多くのパイプを連鎖しています。
JSON形式の同じヒーローデータをビルトインの`JsonPipe`にチェーンして表示します。


<div class="callout is-helpful">



<header>
  JSONパイプによるデバッグ
</header>



[JsonPipe](api/common/JsonPipe)は、
不思議な障害が発生したデータバインディングや、
将来のバインディングのためのオブジェクトを検査する簡単な方法を提供します。

</div>



{@a pure-pipe-pure-fn}


<h3 class="no-toc">純粋なパイプと純粋な関数</h3>

純粋なパイプは純粋な関数を使用します。
純粋な関数は、検出可能な副作用なしに入力と戻り値を処理します。
同じ入力が与えられた場合、それらは常に同じ出力を返すべきです。

このページの前半で説明したパイプは、純粋な機能で実装されています。
ビルトインの`DatePipe`は純粋な関数による純粋なパイプであり、
`ExponentialStrengthPipe`や`FlyingHeroesPipe`もそうです。
少し前には、`FlyingHeroesImpurePipe`&mdash;純粋な関数による不純なパイプを見直しました。

ただし、*純粋なパイプ*は常に*純粋な関数*を使って実装してください。
そうしなければ、チェックした後に変更された式に関するコンソールエラーが多数表示されます。



## 次のステップ

パイプは、共通の表示値変換をカプセル化して共有するための優れた方法です。
スタイルのように使い、テンプレートの式に適用して、
ビューの魅力と利便性を高めることができます。

Angularの組み込みパイプのインベントリについては、[APIリファレンス](api?type=pipe)を参照してください。
また、カスタムパイプを作成し、それをコミュニティに提供してみてください。


{@a no-filter-pipe}



## Appendix: 付録：*FilterPipe*あるいは*OrderByPipe*の不在

Angularはリストのフィルタリングやソートにパイプを提供しません。
AngularJSに精通している開発者は、それを`filter`や`orderBy`として知っていますが、
Angularに同じものはありません。

これは見落としではありません。このようなパイプは性能が悪く、
積極的な最小化を阻害するため、Angularは提供していません。
`filter`と`orderBy`は両方とも、オブジェクトのプロパティを参照するパラメータが必要です。
このページの前半では、このようなパイプは[不純](guide/pipes#pure-and-impure-pipes)である必要があり、
Angularはほぼすべての変更検知サイクルで不純なパイプを呼び出すことを学びました。

フィルタリング、特にソートは高価な操作です。
Angularがこれらのパイプメソッドを毎秒何度も呼び出すと、ユーザー体験は中程度のサイズのリストでもひどく低下します。
`filter`そして`orderBy`はAngularJSアプリの中でよく濫用され、Angular自体が遅いという苦情につながります。
そもそも`filter`と`orderBy`を提供することでAngularJSがパフォーマンスの罠を用意しているという間接的な意味では、それは正しいです。

顕著ではないかもしれませんが、最小化における危険性も切実です。ヒーローのリストに適用されたソートパイプを想像してみてください。
リストは、ヒーローの`name`と出身の`planet`のプロパティによって次のようにソートされます。

<code-example language="html">
  &lt;!-- NOT REAL CODE! -->
  &lt;div *ngFor="let hero of heroes | orderBy:'name,planet'">&lt;/div>
</code-example>



並べ替えフィールドをテキスト文字列で指定し、パイプがインデックスなどでプロパティ値を参照することを期待します（たとえば`hero['name']`のような）。
残念ながら、積極的な最小化は`Hero`のプロパティ名を操作し、`Hero.name`や`Hero.planet`は`Hero.a`や`Hero.b`のようになります。明らかに`hero['name']`は機能しません。

積極的に最小化することを気にしない人もいますが、
Angularのプロダクトは積極的に最小化する人を妨げるべきではありません。
したがって、AngularチームはAngularが提供するすべてのものが安全に最小化されるように決めています。

Angularチームと多くの経験豊富なAngular開発者は、
フィルタリングと並べ替えロジックをコンポーネント自体に移動することを強くお勧めします。
コンポーネントは`filteredHeroes`または`sortedHeroes`プロパティを公開して、
サポートロジックを実行する時期と頻度を制御できます。
パイプに入れてアプリ全体で共有しようとした機能は、
フィルタリング/並べ替えのサービスに書き込んで、コンポーネントに注入することができます。

これらのパフォーマンスと最小化の考慮事項があなたには当てはまらない場合は、
いつでも独自のパイプ（[FlyingHeroesPipe](guide/pipes#impure-flying-heroes)のような）を作成したり、コミュニティで見つけることができます。
