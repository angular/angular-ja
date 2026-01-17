# 複雑なアニメーションシーケンス

IMPORTANT: `@angular/animations` パッケージは現在非推奨です。Angularチームは、新しく書くコードのアニメーションには `animate.enter` と `animate.leave` を使ったネイティブCSSの利用を推奨します。詳しくは、新しい enter と leave の[アニメーションガイド](guide/animations/enter-and-leave)を参照してください。また、アプリで純粋なCSSアニメーションへの移行を始める方法については、[AngularのAnimationsパッケージからの移行](guide/animations/migration)も参照してください。

ここまで、単一のHTML要素のシンプルなアニメーションを学んできました。
Angularでは、ページに出入りする要素のグリッド全体やリスト全体など、連携したシーケンスもアニメーション化できます。
複数のアニメーションを並行して実行することも、個別のアニメーションを順番に実行することもできます。

複雑なアニメーションシーケンスを制御する関数は次のとおりです：

| 関数                              | 詳細                                                         |
| :-------------------------------- | :------------------------------------------------------------- |
| `query()`                         | 内側のHTML要素を1つ以上見つけます。                               |
| `stagger()`                       | 複数要素のアニメーションに段階的な遅延を適用します。                   |
| [`group()`](api/animations/group) | 複数のアニメーションステップを並行して実行します。                   |
| `sequence()`                      | アニメーションステップを順番に実行します。                         |

## query() 関数 {#the-query-function}

多くの複雑なアニメーションは、`query()` 関数で子要素を見つけ、それらにアニメーションを適用することに依存します。基本的な例は次のとおりです：

| 例                                     | 詳細                                                                                                                                                                                               |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query()` の後に `animate()`           | 単純なHTML要素をクエリし、直接アニメーションを適用するために使用します。                                                                                                                             |
| `query()` の後に `animateChild()`      | それ自体にアニメーションメタデータが適用された子要素をクエリし、そのアニメーションをトリガーします\(そうしないと、現在の要素／親要素のアニメーションによってブロックされてしまいます\)。 |

`query()` の最初の引数は [CSSセレクター](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) 文字列で、次のAngular固有のトークンも含められます：

| トークン                    | 詳細                                      |
| :------------------------- | :------------------------------------------- |
| `:enter` <br /> `:leave`   | enter/leaveする要素用。                       |
| `:animating`               | 現在アニメーション中の要素用。                  |
| `@*` <br /> `@triggerName` | 任意のトリガー、または特定のトリガーを持つ要素用。 |
| `:self`                    | アニメーション対象の要素自身。                  |

<docs-callout title="enter と leave する要素">

すべての子要素が実際に enter/leaveする要素として扱われるわけではありません。これは直感に反して混乱しやすい場合があります。詳しくは[queryのAPIドキュメント](api/animations/query#entering-and-leaving-elements)を参照してください。

また、アニメーションの例\(アニメーションの[導入セクション](guide/legacy-animations#about-this-guide)で紹介します\)のQueryingタブでも、この挙動を図で確認できます。

</docs-callout>

## query() と stagger() 関数を使って複数の要素をアニメーション化する {#animate-multiple-elements-using-query-and-stagger-functions}

`query()` で子要素をクエリしたあと、`stagger()` 関数を使うと、アニメーション化される各項目の間に時間差を定義でき、要素を順番に遅らせてアニメーションできます。

次の例は、`query()` と `stagger()` 関数を使って、（ヒーローの）リストに要素を追加するときに、上から下へ少しずつ遅らせながら順番にアニメーションする方法を示します。

- `query()` を使って、特定の条件を満たしてページに入ってくる要素を探します。
- それぞれの要素に対して、`style()` を使い、同じ初期スタイルを設定します。
  透明にし、`transform` を使って位置をずらしておくことで、所定の位置にスライドして入ってくるようにします。

- `stagger()` を使って各アニメーションを30ミリ秒ずつ遅らせます。
- カスタム定義のイージングカーブを使って各要素を0.5秒かけてアニメーションし、フェードインと`transform`の解除を同時に行います。

<docs-code header="hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" region="page-animations"/>

## group() 関数を使った並行アニメーション {#parallel-animation-using-group-function}

ここまで、連続する各アニメーションの間に遅延を入れる方法を見てきました。
しかし、並行して実行されるアニメーションを設定したい場合もあるでしょう。
たとえば、同じ要素の2つのCSSプロパティをアニメーションしたいが、それぞれで異なる `easing` 関数を使いたい場合があります。
そのような場合は、アニメーションの [`group()`](api/animations/group) 関数を使用できます。

HELPFUL: [`group()`](api/animations/group) 関数は、アニメーション化される要素ではなく、アニメーションの _ステップ_ をグループ化するために使います。

次の例は、`:enter` と `:leave` の両方で [`group()`](api/animations/group) を使用し、2つの異なるタイミング設定を適用します。これにより、同じ要素に2つの独立したアニメーションを並行して適用できます。

<docs-code header="hero-list-groups.component.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.component.ts" region="animationdef"/>

## 順次アニメーションと並行アニメーション {#sequential-vs-parallel-animations}

複雑なアニメーションでは、同時に多くのことが起きえます。
では、複数のアニメーションが1つずつ順番に実行されるアニメーションを作りたい場合はどうでしょうか？先ほどは [`group()`](api/animations/group) を使って、複数のアニメーションを同時に並行実行しました。

別の関数 `sequence()` を使うと、同じアニメーションを1つずつ順番に実行できます。
`sequence()` の中では、アニメーションステップは `style()` または `animate()` 関数呼び出しで構成されます。

- `style()` を使って、指定したスタイルデータを即座に適用します。
- `animate()` を使って、指定した時間間隔にわたってスタイルデータを適用します。

## フィルターアニメーションの例 {#filter-animation-example}

例のページにある別のアニメーションも見てみましょう。
Filter/Staggerタブで、**Search Heroes** テキストボックスに `Magnet` や `tornado` などの文字を入力します。

フィルターは入力に合わせてリアルタイムに動作します。
文字を入力するごとにフィルターが徐々に厳しくなり、要素がページから消えていきます。
フィルターボックスの文字を削除すると、ヒーローのリストが徐々にページに再表示されます。

HTMLテンプレートには `filterAnimation` というトリガーが含まれます。

<docs-code header="hero-list-page.component.html" path="adev/src/content/examples/animations/src/app/hero-list-page.component.html" region="filter-animations" language="angular-html"/>

コンポーネントのデコレーターにある `filterAnimation` には3つのトランジションが含まれます。

<docs-code header="hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" region="filter-animations"/>

この例のコードは次のタスクを実行します：

- ユーザーがこのページを初めて開いたり移動してきたりしたときはアニメーションをスキップします\(フィルターアニメーションは既に存在する要素を絞り込むものであるため、DOM内に既に存在する要素に対してのみ動作します\)。
- 検索入力の値に基づいてヒーローをフィルタリングします。

変更のたびに次の処理を行います：

- DOMから離脱する要素は、不透明度と幅を0に設定して非表示にします。
- DOMに入ってくる要素を300ミリ秒かけてアニメーションします。
  アニメーション中は、要素が既定の幅と不透明度になります。

- DOMに入ってくる要素／離脱する要素が複数ある場合は、ページ上部から順に、各要素の間に50ミリ秒の遅延を入れてアニメーションをずらします。

## 並び替えられるリストの項目をアニメーション化する {#animating-the-items-of-a-reordering-list}

Angularは既定で `*ngFor` のリスト項目を正しくアニメーション化しますが、並び順が変わると正しくアニメーションできなくなります。
これは、どの要素がどれなのかを追跡できなくなり、アニメーションが壊れてしまうためです。
こうした要素をAngularが追跡できるようにする唯一の方法は、`NgForOf` ディレクティブに `TrackByFunction` を割り当てることです。
これにより、Angularは常にどの要素がどれなのかを把握できるため、常に正しい要素に正しいアニメーションを適用できます。

IMPORTANT: 実行時に並び順が変わる可能性のある `*ngFor` リストの項目をアニメーション化する必要がある場合は、常に `TrackByFunction` を使用してください。

## アニメーションとコンポーネントのビューカプセル化 {#animations-and-component-view-encapsulation}

AngularのアニメーションはコンポーネントのDOM構造に基づいており、直接 [ビューカプセル化](guide/components/styling#style-scoping) を考慮しません。つまり、`ViewEncapsulation.Emulated` を使用するコンポーネントは、`ViewEncapsulation.None` を使用している場合とまったく同じように振る舞います（`ViewEncapsulation.ShadowDom` と `ViewEncapsulation.ExperimentalIsolatedShadowDom` は、後述するように異なる挙動になります）。

たとえば、（このガイドの残りでも登場する）`query()` 関数を、エミュレートされたビューカプセル化を使用しているコンポーネントツリーの最上部に適用すると、そのクエリはツリーのどの深さにあるDOM要素も特定でき（その結果アニメーション化でき）ます。

一方、`ViewEncapsulation.ShadowDom` と `ViewEncapsulation.ExperimentalIsolatedShadowDom` は、DOM要素を [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot) 要素の内側に「隠す」ことでコンポーネントのDOM構造を変更します。こうしたDOM操作は、アニメーションの実装が単純なDOM構造に依存し、`ShadowRoot` 要素を考慮しないため、一部のアニメーションが正しく動作しない原因になります。そのため、ShadowDomのビューカプセル化を使用するコンポーネントを含むビューにアニメーションを適用することは避けることを推奨します。

## アニメーションシーケンスのまとめ {#animation-sequence-summary}

複数要素をアニメーション化するAngularの関数は、まず `query()` で内側の要素を見つけることから始まります。たとえば、`<div>` 内のすべての画像を収集する場合です。
残りの関数である `stagger()`、[`group()`](api/animations/group)、`sequence()` では、カスケード（段階的な遅延）を適用したり、複数のアニメーションステップをどのように適用するかを制御したりできます。

## Angularアニメーションについてさらに詳しく {#more-on-angular-animations}

以下の項目にも興味があるかもしれません：

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Angularアニメーションの概要"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="トランジションとトリガー"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="再利用可能なアニメーション"/>
  <docs-pill href="guide/routing/route-transition-animations" title="ルート遷移アニメーション"/>
  <docs-pill href="guide/animations/migration" title="ネイティブCSSアニメーションへの移行"/>
</docs-pill-row>
