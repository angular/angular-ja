# コンポーネントツリーを DI でナビゲートする

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


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-1" header="parent-finder.component.ts (AlexComponent v.1)" linenums="false">

</code-example>



*Cathy* は、`AlexComponent` をコンストラクターに注入したあとで、
彼女が *Alex* にアクセスできるかどうかを伝えます。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="cathy" header="parent-finder.component.ts (CathyComponent)" linenums="false">

</code-example>



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

このアプリはおそらくたくさんの金融商品コンポーネントを定義しています。
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

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (Alex class signature)" linenums="false">

</code-example>



`CraigComponent` は、その `alex` コンストラクターパラメータに `Base` の注入を試み、成功したかどうかを報告します。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="craig" header="parent-finder.component.ts (CraigComponent)" linenums="false">

</code-example>



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


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)" linenums="false">

</code-example>


[Parent](#parent-token) はプロバイダーのクラスインターフェーストークンです。
[*forwardRef*](guide/dependency-injection-in-action#forwardref) は、
`AlexComponent` が自身を参照することによって作られた循環参照を解消します。

*Alex* の3番目の子コンポーネントである *Carol* は、これまでと同じ方法で、
親をその `parent` パラメータに挿入します。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-class" header="parent-finder.component.ts (CarolComponent class)" linenums="false">

</code-example>



これが動作中の *Alex* と家族です。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/alex.png" alt="Alex イン・アクション">
</figure>



{@a parent-tree}


### Find a parent in a tree with _@SkipSelf()_

Imagine one branch of a component hierarchy: *Alice* -> *Barry* -> *Carol*.
Both *Alice* and *Barry* implement the `Parent' class interface.

*Barry* is the problem. He needs to reach his parent, *Alice*, and also be a parent to *Carol*.
That means he must both *inject* the `Parent` class interface to get *Alice* and
*provide* a `Parent` to satisfy *Carol*.

Here's *Barry*.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry" header="parent-finder.component.ts (BarryComponent)" linenums="false">

</code-example>



*Barry*'s `providers` array looks just like [*Alex*'s](#alex-providers).
If you're going to keep writing [*alias providers*](guide/dependency-injection-in-action#useexisting) like this you should create a [helper function](#provideparent).

For now, focus on *Barry*'s constructor.

<code-tabs>

  <code-pane header="Barry's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry-ctor">

  </code-pane>

  <code-pane header="Carol's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-ctor">

  </code-pane>

</code-tabs>


It's identical to *Carol*'s constructor except for the additional `@SkipSelf` decorator.

`@SkipSelf` is essential for two reasons:

1. It tells the injector to start its search for a `Parent` dependency in a component *above* itself,
which *is* what parent means.

2. Angular throws a cyclic dependency error if you omit the `@SkipSelf` decorator.

  `Cannot instantiate cyclic dependency! (BethComponent -> Parent -> BethComponent)`

Here's *Alice*, *Barry*, and family in action.


<figure>
  <img src="generated/images/guide/dependency-injection-in-action/alice.png" alt="Alice in action">
</figure>



{@a parent-token}


###  Parent class interface
You [learned earlier](guide/dependency-injection-in-action#class-interface) that a class interface is an abstract class used as an interface rather than as a base class.

The example defines a `Parent` class interface.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="parent" header="parent-finder.component.ts (Parent class-interface)" linenums="false">

</code-example>



The `Parent` class interface defines a `name` property with a type declaration but *no implementation*.
The `name` property is the only member of a parent component that a child component can call.
Such a narrow interface helps decouple the child component class from its parent components.

A component that could serve as a parent *should* implement the class interface as the `AliceComponent` does.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-class-signature" header="parent-finder.component.ts (AliceComponent class signature)" linenums="false">

</code-example>



Doing so adds clarity to the code.  But it's not technically necessary.
Although `AlexComponent` has a `name` property, as required by its `Base` class,
its class signature doesn't mention `Parent`.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (AlexComponent class signature)" linenums="false">

</code-example>



<div class="alert is-helpful">



`AlexComponent` *should* implement `Parent` as a matter of proper style.
It doesn't in this example *only* to demonstrate that the code will compile and run without the interface.


</div>



{@a provideparent}


### `provideParent()` helper function

Writing variations of the same parent *alias provider* gets old quickly,
especially this awful mouthful with a [*forwardRef*](guide/dependency-injection-in-action#forwardref).

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

You can extract that logic into a helper function like the following.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-the-parent" header="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

Now you can add a simpler, more meaningful parent provider to your components.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>


You can do better. The current version of the helper function can only alias the `Parent` class interface.
The application might have a variety of parent types, each with its own class interface token.

Here's a revised version that defaults to `parent` but also accepts an optional second parameter for a different parent class interface.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-parent" header="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>


And here's how you could use it with a different parent type.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="beth-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts" linenums="false">

</code-example>

