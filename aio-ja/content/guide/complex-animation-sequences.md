# 複雑なアニメーションシーケンス

#### 前提

次の概念への基本的な理解:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)

<hr>

これまでは、単一のHTML要素の単純なアニメーションを学んできました。 Angularを使用すると、グリッド全体や要素リストなどの、シーケンスをもつ要素がページに出入りするときにアニメーションできます。 複数のアニメーションを並列に実行するか、個別にアニメーションを順次実行するかを選択できます。

複雑なアニメーションシーケンスを制御する関数は次のとおりです。

* `query()` 1つまたは複数の内部HTML要素を検索します。
* `stagger()` 複数要素のアニメーションにカスケーディングディレイを適用します。
* `group()` 複数のアニメーションステップを並列に実行します。 
* `sequence()` アニメーションステップを順次実行します。

{@a complex-sequence}

## query()関数とstagger()関数を使用して複数要素をアニメーションする

`query()`関数は、アニメーション化された要素内の要素を見つけることができます。 この関数は、親コンポーネント内の特定のHTML要素を対象とし、アニメーションを各要素に個別に適用します。 Angularは、ページ全体の要素を調整する際に、セットアップ、ティアダウン、クリーンアップをインテリジェントに処理します。

`stagger()`関数は、クエリーされた各項目の間にタイミングギャップを定義することができ、要素のアニメーション間を遅延させます。

ライブサンプルの「Filter/Stagger」タブには、初歩的なシーケンスであるヒーローのリストが表示されます。 ヒーローのリスト全体は、上から下へわずかに遅れてカスケードします。

次の例は、アニメーション要素の出現に`query()`関数と`stagger()`関数を使用する方法を示しています。

* `query()`を使用し、ページに入ってくる特定の条件を満たす要素を探します。

* `style()`を利用することで、同一の初期スタイルを要素のそれぞれに対して設定します。 透過させ、見えないようにし、`transform`で所定の位置にスライドできるようにします。

* `stagger()`を使用し、個々のアニメーションを30ミリ秒遅延させます。

* 独自定義のイージングカーブを使用してスクリーン上の各要素を0.5秒間アニメーションし、同時にフェードインさせtransformを解除します。

<code-example path="animations/src/app/hero-list-page.component.ts" header="src/app/hero-list-page.component.ts" region="page-animations" language="typescript"></code-example>

## group()関数を使用した並列アニメーション

連続する各アニメーションの間に遅延を追加する方法を書きました。 しかし他にも、並列に起こるアニメーションについても設定することもできます。 たとえば、同じ要素の2つのCSSプロパティをアニメーションし、それぞれに異なる`easing`関数を使用することができます。 このアニメーションは、[`group()`](api/animations/group)関数を使用することで実現できます。

<div class="alert is-helpful">

**注意:** [`group()`](api/animations/group)関数はアニメーション要素ではなく、アニメーションの*ステップ*をグループ化するために使用されます。
</div>

次の例では、 `:enter`と`:leave`それぞれがグループを使用することで、2つの異なるタイミングの構成が可能になります。 それらはパラレルに同じ要素へ適用されますが、独立して実行されます。

<code-example path="animations/src/app/hero-list-groups.component.ts" region="animationdef" header="src/app/hero-list-groups.component.ts (excerpt)" language="typescript"></code-example>

## シーケンシャル vs. 並列アニメーション

複雑なアニメーションでは、一度に多くのことが起こる可能性があります。 それでも、複数のアニメーションが連続したアニメーションを作成したい場合はどうすればよいでしょうか？ 以前は[`group()`](api/animations/group)を使うことで、同時に複数アニメーションを並列に実行していました。

`sequence()`と呼ばれる第2の関数は、前述のように、同じアニメーションを次々に実行することを可能とします。 `sequence()`の中において、アニメーションのステップは`style()`または `animate()`のいずれかの関数呼び出しで構成されます。

* `style()`を使用すると、指定されたスタイルデータを直ちに適用できます。
* `animate()`を使用すると、一定の時間間隔でスタイリングデータを適用します。

## フィルターアニメーション例

ライブサンプルページの別のアニメーションを見てみましょう。 「Filter/Stagger」ページを開き、**Search Heroes**テキストボックスに`Magnet`や`tornado`などのテキストを入力します。

入力時にフィルターがリアルタイムで機能します。 新しい文字を入力すると要素がページから離れ、フィルターが徐々に狭められていきます。 フィルターボックスの各文字を削除すると、ヒーローのリストが徐々にページに再挿入されます。

HTMLテンプレートには、`filterAnimation`というトリガーが含まれています。

<code-example path="animations/src/app/hero-list-page.component.html" header="src/app/hero-list-page.component.html" region="filter-animations"></code-example>

コンポーネントファイルには3つの遷移が含まれています。

<code-example path="animations/src/app/hero-list-page.component.ts" header="src/app/hero-list-page.component.ts" region="filter-animations" language="typescript"></code-example>

このアニメーションは次を実行します:

* ユーザーがこのページを最初に開いたり移動したりしたときに実行されるアニメーションは無視されます。 フィルターはすでに存在するものを絞り込みます。したがって、アニメーション化されるHTML要素はすべてDOMにすでに存在するとみなされます。

* フィルターマッチを実行します。

各マッチについて:

* opacityとwidthを0に設定することで、透明にして幅を持たせないようにし、要素を非表示にします。

* 要素のアニメーションは300ミリ秒を超えます。 アニメーション中、要素はデフォルトの幅と不透明度を想定します。

* 一致する要素が複数ある場合は、ページの先頭から各要素にずれがあり、各要素間に50ミリ秒の遅延があります。

## まとめ

複数要素をアニメーションするためのAngular関数は、内部要素を見つけるために`query()`で始まります。 たとえば、`<div>`内のすべての画像を収集します。 残りの関数`stagger()`、[`group()`](api/animations/group)、`sequence()`はカスケードを適用したり、複数のアニメーションステップを適用する方法を制御することができます。

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [再利用可能なアニメーション](guide/reusable-animations)
* [ルーティング遷移のアニメーション](guide/route-animations)
