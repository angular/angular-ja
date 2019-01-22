# コンポーネントツリーを DI でナビゲートする

アプリケーションのコンポーネントはしばしば情報を共有する必要があります。
データバインディングやサービスの共有など、
情報を共有するために疎結合技法を使用することがよくありますが、
あるコンポーネントが別のコンポーネントを直接参照することが理にかなっていることもあります。 
たとえば、そのコンポーネントの値にアクセスしたりメソッドを呼び出したりするためには、直接参照が必要です。

コンポーネントの参照を取得することは、Angular の場合少し注意が必要です。
Angular コンポーネント自体には、プログラムで調べたりナビゲートしたりできる
ツリーはありません。親子関係は間接的で、
コンポーネントの[ビューオブジェクト](guide/glossary#view)を通して確立されます。

各コンポーネントはホストビューを持ち、追加の*埋め込みビュー*を持つことができます。
コンポーネント A の埋め込みビューはコンポーネント B のホストビューであり、
コンポーネント B は埋め込みビューを持つことができます。
つまり、コンポーネントごとに[ビュー階層](guide/glossary#view-hierarchy)があり、
そのコンポーネントのホストビューがルートになります。

ビュー階層を*下に*移動するための API があります。
[API リファレンス](api/)の `Query`、`QueryList`、`ViewChildren` 
および `ContentChildren` を確認してください。

親の参照を取得するための公開 API はありません。
ただし、すべてのコンポーネントインスタンスはインジェクターのコンテナに追加されるため、
Angular の依存性注入を使用して親のコンポーネントに到達することができます。

このセクションでは、そのためのいくつかの手法について説明します。

{@a find-parent}
{@a known-parent}


### 既知の型の親コンポーネントを見つける

標準のクラスインジェクションを使用して、型がわかっている親コンポーネントを取得します。

次の例では、親の `AlexComponent` に `CathyComponent` を含むいくつかの子があります。

{@a alex}


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-1" header="parent-finder.component.ts (AlexComponent v.1)" linenums="false">

</code-example>



*Cathy* は、`AlexComponent` をコンストラクターに注入した後で、
彼女が *Alex* にアクセスできるかどうかを伝えます。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="cathy" header="parent-finder.component.ts (CathyComponent)" linenums="false">

</code-example>



安全のために [@Optional](guide/dependency-injection-in-action#optional) 修飾子があるとしても、
<live-example name="dependency-injection-in-action"></live-example> では、
`alex` パラメータが設定されている
ことを確認しています。


{@a base-parent}


### Unable to find a parent by its base class

What if you *don't* know the concrete parent component class?

A re-usable component might be a child of multiple components.
Imagine a component for rendering breaking news about a financial instrument.
For business reasons, this news component makes frequent calls
directly into its parent instrument as changing market data streams by.

The app probably defines more than a dozen financial instrument components.
If you're lucky, they all implement the same base class
whose API your `NewsComponent` understands.


<div class="alert is-helpful">



Looking for components that implement an interface would be better.
That's not possible because TypeScript interfaces disappear
from the transpiled JavaScript, which doesn't support interfaces.
There's no artifact to look for.

</div>



This isn't necessarily good design.
This example is examining *whether a component can
inject its parent via the parent's base class*.

The sample's `CraigComponent` explores this question. [Looking back](#alex),
you see that the `Alex` component *extends* (*inherits*) from a class named `Base`.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (Alex class signature)" linenums="false">

</code-example>



The `CraigComponent` tries to inject `Base` into its `alex` constructor parameter and reports if it succeeded.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="craig" header="parent-finder.component.ts (CraigComponent)" linenums="false">

</code-example>



Unfortunately, this doesn't work.
The <live-example name="dependency-injection-in-action"></live-example>
confirms that the `alex` parameter is null.
*You cannot inject a parent by its base class.*



{@a class-interface-parent}


### Find a parent by its class interface

You can find a parent component with a [class interface](guide/dependency-injection-in-action#class-interface).

The parent must cooperate by providing an *alias* to itself in the name of a class interface token.

Recall that Angular always adds a component instance to its own injector;
that's why you could inject *Alex* into *Cathy* [earlier](#known-parent).

Write an [*alias provider*](guide/dependency-injection-in-action#useexisting)&mdash;a `provide` object literal with a `useExisting`
definition&mdash;that creates an *alternative* way to inject the same component instance
and add that provider to the `providers` array of the `@Component()` metadata for the `AlexComponent`.

{@a alex-providers}


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)" linenums="false">

</code-example>


[Parent](#parent-token) is the provider's class interface token.
The [*forwardRef*](guide/dependency-injection-in-action#forwardref) breaks the circular reference you just created by having the `AlexComponent` refer to itself.

*Carol*, the third of *Alex*'s child components, injects the parent into its `parent` parameter,
the same way you've done it before.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-class" header="parent-finder.component.ts (CarolComponent class)" linenums="false">

</code-example>



Here's *Alex* and family in action.

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/alex.png" alt="Alex in action">
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

