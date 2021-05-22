# コンポーネントツリーを DI でナビゲートする

<div class="callout is-critical">
<header>Marked for archiving</header>

To ensure that you have the best experience possible, this topic is marked for archiving until we determine
that it clearly conveys the most accurate information possible.

In the meantime, this topic might be helpful: [Hierarchical injectors](guide/hierarchical-dependency-injection).

If you think this content should not be archived, please file a [GitHub issue](https://github.com/angular/angular/issues/new?template=3-docs-bug.md).

</div>

アプリケーションのコンポーネントはしばしば情報を共有する必要があります。
データバインディングやサービスの共有など、
情報を共有するために疎結合のテクニックを使用することがよくありますが、
あるコンポーネントが別のコンポーネントを直接参照することが理にかなっていることもあります。 
たとえば、そのコンポーネントの値にアクセスしたりメソッドを呼び出したりするためには、直接参照が必要です。

コンポーネントの参照を取得することは、Angular の場合少し注意が必要です。
Angular コンポーネント自体には、プログラムで調べたりナビゲートしたりできる
ツリーはありません。親子関係は間接的で、
コンポーネントの[ビューオブジェクト](guide/glossary#view)を通して確立されます。

各コンポーネントはホストビューを持ち、追加の*埋め込みビュー*をもつことができます。
コンポーネント A の埋め込みビューはコンポーネント B のホストビューであり、
コンポーネント B は埋め込みビューをもつことができます。
つまり、コンポーネントごとに[ビュー階層](guide/glossary#view-hierarchy)があり、
そのコンポーネントのホストビューがルートになります。

ビュー階層を*下に*移動するための API があります。
[API リファレンス](api/)の `Query`、`QueryList`、`ViewChildren` 
および `ContentChildren` を確認してください。

親の参照を取得するための公開 API はありません。
ただし、すべてのコンポーネントインスタンスはインジェクターのコンテナに追加されるため、
Angular の依存性の注入を使用して親のコンポーネントに到達することができます。

このセクションでは、そのためのいくつかの手法について説明します。

{@a find-parent}
{@a known-parent}


### 既知の型の親コンポーネントを見つける

標準のクラスインジェクションを使用して、型がわかっている親コンポーネントを取得します。

次の例では、親の `AlexComponent` に `CathyComponent` を含むいくつかの子があります。

{@a alex}


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-1" header="parent-finder.component.ts (AlexComponent v.1)"></code-example>



*Cathy* は、`AlexComponent` をコンストラクターに注入したあとで、
彼女が *Alex* にアクセスできるかどうかを伝えます。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="cathy" header="parent-finder.component.ts (CathyComponent)"></code-example>



安全のために [@Optional](guide/dependency-injection-in-action#optional) 修飾子があるとしても、
<live-example name="dependency-injection-in-action"></live-example> では、
`alex` パラメータが設定されている
ことを確認しています。


{@a base-parent}


### 基本クラスで親を見つけることができません

具体的な親コンポーネントクラスが*分からない*場合はどうしますか？

再利用可能なコンポーネントは、複数のコンポーネントの子になることがあります。
金融商品に関する最新ニュースを表示するためのコンポーネントを想像してください。
ビジネス上の理由から、このニュースコンポーネントは市場データの流れが
変わることで頻繁に親の商品を直接呼び出します。

このアプリケーションはおそらくたくさんの金融商品コンポーネントを定義しています。
運がよければ、それらはすべて `NewsComponent` が理解できる API を
もつ同じ基本クラスを実装しています。


<div class="alert is-helpful">



インターフェースを実装しているコンポーネントを探すことができればよかったでしょう。
TypeScript のインターフェースは、インターフェースをサポートしていない
変換後の JavaScript からは消えてしまうため、これは不可能です。
探すべきアーティファクトはありません。

</div>



これは必ずしもよいデザインではありません。
この例では、*コンポーネントが親の基本クラスを介して
その親を注入できるかどうか*を調べています。

サンプルの `CraigComponent` はこの問題を探ります。[振り返ってみると](#alex)、
`Alex` コンポーネントは `Base` という名前のクラスから*拡張*(*継承*)されています。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (Alex class signature)"></code-example>



`CraigComponent` は、その `alex` コンストラクターパラメータに `Base` の注入を試み、成功したかどうかを報告します。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="craig" header="parent-finder.component.ts (CraigComponent)"></code-example>



残念ながら、これはうまくいきません。
<live-example name="dependency-injection-in-action"></live-example>は 
`alex` パラメータが null であることを確認します。
*基本クラスで親を注入することはできません*。



{@a class-interface-parent}


### クラスインターフェースで親を探す

[クラスインターフェース](guide/dependency-injection-in-action#class-interface)を使って親コンポーネントを見つけることができます。

親はクラスインターフェーストークンの名前で*エイリアス*を自身に提供することで協力しなければなりません。

Angular は常にコンポーネントインスタンスを独自のインジェクターに追加します。
だからあなたは[先ほど](#known-parent) *Cathy* に *Alex* を注入できたのです。

[*エイリアスプロバイダー*](guide/dependency-injection-in-action#useexisting) (`useExisting` 定義をもつ `provide` オブジェクトリテラル)を作成します。
これは、同じコンポーネントインスタンスを注入し、そのプロバイダーを 
`AlexComponent` の `@Component()` メタデータの `providers` 配列に追加する*代わりの*方法を作成します。

{@a alex-providers}


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)"></code-example>


[Parent](#parent-token) はプロバイダーのクラスインターフェーストークンです。
[*forwardRef*](guide/dependency-injection-in-action#forwardref) は、`AlexComponent` が自身を参照することによって作られた循環参照を解消します。

*Alex* の3番目の子コンポーネントである *Carol* は、これまでと同じ方法で、
親をその `parent` パラメータに挿入します。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-class" header="parent-finder.component.ts (CarolComponent class)"></code-example>



これが動作中の *Alex* と家族です。

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/alex.png" alt="Alex in action">
</div>



{@a parent-tree}


### _@SkipSelf()_ を使ってツリー内の親を探す

コンポーネント階層の1つのブランチ、たとえば *Alice* -> *Barry* -> *Carol* といったものを想像してみてください。
*Alice* と *Barry* はどちらも `Parent` クラスインターフェースを実装しています。

*Barry* が問題です。彼は自分の親である *Alice* と連絡を取り、また *Carol* の親である必要があります。
つまり、*Alice* を取得するために `Parent` クラスのインターフェースを*注入*し、
*Carol* の親の条件を満たすために `Parent` を*提供*する必要があります。

*Barry* はこのようになります。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry" header="parent-finder.component.ts (BarryComponent)"></code-example>



*Barry* の `providers` 配列は、[Alex の配列](#alex-providers)とまったく同じです。
このような[エイリアスプロバイダ](guide/dependency-injection-in-action#useexisting)を書き続けるのであれば、ヘルパー関数を作成するべきです。

今は、*Barry* のコンストラクターに焦点を当てます。

<code-tabs>

  <code-pane header="Barry's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry-ctor">

  </code-pane>

  <code-pane header="Carol's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-ctor">

  </code-pane>

</code-tabs>


追加の `@SkipSelf` デコレーターを除いて、*Carol* のコンストラクターと同じです。

`@SkipSelf` が欠かせないものである理由が2つあります。

1. それはインジェクターにそれ自身の上のコンポーネントで`Parent` 依存関係の検索を開始するように指示します。
これは parent が意味するものです。

2. `@SkipSelf` デコレーターを省略した場合、Angular は循環依存エラーを送出します。

  `NG0200: Circular dependency in DI detected for BethComponent. Dependency path: BethComponent -> Parent -> BethComponent`

これが *Alice*、*Barry*、そして家族の動きです。


<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/alice.png" alt="Alice in action">
</div>

{@a parent-token}


###  親クラスのインターフェース
クラスインターフェースは基本クラスとしてではなくインターフェースとして使用される抽象クラスであることを[以前に学びました](guide/dependency-injection-in-action#class-interface)。

例では `Parent` クラスのインターフェースを定義しています。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="parent" header="parent-finder.component.ts (Parent class-interface)"></code-example>



`Parent` クラスインターフェースは、型宣言を使用して `name` プロパティを定義しますが、*実装はしません*。
`name` プロパティは、子コンポーネントが呼び出すことができる親コンポーネントの唯一のメンバーです。
そのような小さなインターフェースは、子コンポーネントクラスをその親コンポーネントから切り離すのに役立ちます。

親として機能できるコンポーネントは、`AliceComponent` と同様にクラスインターフェースを実装する必要があります。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-class-signature" header="parent-finder.component.ts (AliceComponent class signature)"></code-example>



そうすることで、コードが分かりやすくなります。しかし技術的に必要というわけではありません。
その `Base` クラスで要求されるため、`AlexComponent` は `name` プロパティを持ちますが、
そのクラスシグネチャは `Parent` を呼び出しません。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (AlexComponent class signature)"></code-example>



<div class="alert is-helpful">



`AlexComponent` は、適切なスタイルの事項として `Parent` を実装する*必要があります*。
この例は、コードがインターフェースなしでコンパイルおよび実行されることを示すため*だけ*のものではありません。


</div>
