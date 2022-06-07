# Angularアニメーション・イントロダクション

アニメーションは動きの錯覚を提供します(時間の経過と共にHTML要素のスタイルが変化します)。
うまく設計されたアニメーションはアプリケーションをより楽しく使いやすくすることができます。しかし、ただの飾りではありません。
アニメーションは、さまざまな方法でアプリケーション・ユーザー体験を向上させることができます:

*   アニメーションがなければ、Webページの遷移は突然で不快感を与えるかもしれません。
*   モーションはユーザー体験を大幅に向上させます。アニメーションはユーザーの操作に対するアプリケーションの応答を検出する機会を与えます。
*   よいアニメーションは直感的にユーザーの注意を必要な場所に呼びよせます。

通常、アニメーションは時間の経過と共に複数のスタイルの*変形*を引き起こします。
HTML要素は、ページの移動、色の変更、拡大または縮小、フェード、またはスライドさせることができます。
これらの変形は同時、または逐次的に行うことができます。あなたは各変形のタイミングを制御することができます。

AngularのアニメーションシステムはCSSの機能に基づいて構築されています。つまり、ブラウザがアニメーション化可能であるあらゆるプロパティをアニメーション化できます。
これには、位置、サイズ、変形、色、ボーダーなどが含まれます。
W3Cは[CSS Transitions](https://www.w3.org/TR/css-transitions-1/)のページでアニメーション可能なプロパティのリストを管理しています。

## このガイドについて {@a about-this-guide}

このガイドでは、Angularアニメーションをプロジェクトに追加して使い始めるために、Angularアニメーションの基本的な機能について説明します。

このガイドで説明されている機能(と、関連するAngularアニメーションガイドで説明されている高度な機能)は、<live-example></live-example>のサンプルアプリケーションでデモを確認することができます。

#### 前提条件

このガイドでは、次のセクションで説明されているような基本的なAngularアプリケーションの作成に精通していることを前提としています:

*   [チュートリアル](tutorial)
*   [アーキテクチャオーバービュー](guide/architecture)

## はじめよう

アニメーションのための主なAngularモジュールは、`@angular/animations`と`@angular/platform-browser`です。
CLIを使用して新しいプロジェクトを作成すると、これらの依存関係がプロジェクトに自動的に追加されます。

Angularアニメーションをプロジェクトに追加するには、標準のAngularの機能と一緒にアニメーション固有のモジュールをインポートしてください。

### ステップ1: アニメーションモジュールを有効にする

`BrowserAnimationsModule`をインポートしてください。これによってアニメーション機能をAngularのルートアプリケーションモジュールに取り込みます。

<code-example header="src/app/app.module.ts" path="animations/src/app/app.module.1.ts"></code-example>

<div class="alert is-helpful">

**NOTE**: <br />
CLIを使用してアプリケーションを作成しているときは、ルートアプリケーションモジュールである`app.module.ts`は`src/app`フォルダ内に配置されます。

</div>

### ステップ2: コンポーネントファイル内にアニメーション関数をインポートする

コンポーネントファイルで特定のアニメーション関数を使用する場合は、それらの関数を`@angular/animations`からインポートしてください。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="imports"></code-example>

<div class="alert is-helpful">

**NOTE**: <br />
このページの最後にある[利用可能なアニメーション関数の概要](guide/animations#animation-api-summary)を参照してください。

</div>

### ステップ3: アニメーションメタデータプロパティを追加する

コンポーネントファイル内の`@Component()`デコレーター内に`animations:`というメタデータプロパティを追加してください。
アニメーションを定義したトリガーを`animations`メタデータプロパティ内に配置します。

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="decorator" language="typescript"></code-example>

## 遷移アニメーション

単一のHTML要素をある状態から別の状態に変更するシンプルな遷移をアニメーション化しましょう。
たとえば、ユーザーの最後の操作から、ボタンが**Open**または**Closed**のいずれかを表示するように指定できます。
ボタンが`open`状態では表示され黄色になり、
`closed`状態になると透明で緑色になります。

HTMLでは、これらの属性は色や不透明度などの通常のCSSスタイルを使用して設定されます。
Angularでは、`style()`関数を使用して、アニメーションで使用する一連のCSSスタイルを指定します。
アニメーションの状態に対して一連のスタイルをまとめて、その状態に対して`open`や`closed`などの名前を付けることができます。

<div class="alert is-helpful">

Let's create a new `open-close` component to animate with simple transitions.

Run the following command in terminal to generate the component:

<code-example format="shell" language="shell">

ng g component open-close

</code-example>

This will create the component at `src/app/open-close.component.ts`.

</div>

### アニメーションの状態とスタイル

各遷移の終了時に呼び出す個別の状態を定義するためには、Angularの[`state()`](api/animations/state)関数を使用します。
この関数は、`open`や`closed`のようなユニークな名前と
`style()`関数の2つの引数をとります。

`style()`関数を使って、指定された状態名に関連付けるスタイルのセットを定義します。
ダッシュを含むスタイル属性は`'background-color'`のように引用符で囲むか、`backgroundColor`のように、[*camelCase*](guide/glossary#case-conventions)を使用しなければなりません。

Angularの[`state()`](api/animations/state)関数がCSSスタイル属性を設定する`style⁣()`関数とどのように機能するかを見てみましょう。
次のコードスニペットでは、複数のスタイル属性が状態に対して同時に設定されています。
`open`状態では、ボタンの高さは200ピクセル、不透明度は1、背景色は黄色になります。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state1"></code-example>

次の`closed`状態では、ボタンの高さは100ピクセル、不透明度は0.7、背景色は青になります。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state2"></code-example>

### 遷移とタイミング

Angularでは、アニメーションなしで複数のスタイルを設定できます。
しかし、このままでは、ボタンはフェード、収縮やその他の変化が起きたことを視認できるなにかがなく瞬時に変形されます。

突然の変形をなくすためには、アニメーションの*遷移*を定義して一定の期間にわたってある状態と別の状態の間で発生する変更を指定する必要があります。`transition()`関数は2つの引数を受け取ります。最初の引数は2つの遷移状態間の方向を定義する式を受け取り、2つ目の引数は ひとつまたは複数の `animate()`関数を受け取ります。


デュレーション、ディレイ、イージングを定義したり、遷移の実行中にスタイルを定義するスタイル関数を指定するには、`animate()`関数を使用します。`animate()`関数を使用して複数ステップアニメーションの`keyframes()`関数を定義することもできます。これらの定義は`animate()`関数の第2引数に置かれます。

#### アニメーションメタデータ: デュレーション、ディレイ、イージング

`animate()`関数(遷移関数の第2引数)では`timings`と`styles`の入力パラメータを受け取ります。

`timings`パラメータは、数値または3つの部分で定義された文字列のいずれかを取ります。

<code-example format="typescript" language="typescript">

animate (duration)

</code-example>

or

<code-example format="typescript" language="typescript">

animate ('duration delay easing')

</code-example>

最初の部分、`duration`は必須です。デュレーションは、クオートのない数値で表現されたミリ秒、またはクオートと時間指定子を含む秒単位で表現することができます。たとえば、10分の1秒のデュレーションは、次のように表現することができます:

*   純粋な数値(ミリ秒単位): 
    `100`

*   文字列(ミリ秒単位): 
    `'100ms'`

*   文字列(秒単位):
    `'0.1s'`

2つ目の引数、`delay`は`duration`と同じような構文を持ちます。たとえば:

*   100ms待機してから200msかけて実行する: `'0.2s 100ms'`

3番目の引数、`easing`は実行時にアニメーションの[加速と減速](https://easings.net/)を制御します。たとえば、`ease-in`は、アニメーションをゆっくりと開始させ、進行とともに速度を上げます。

*   100ms待機してから200msかけて実行する。
    減速曲線を使用して速く始動し、ゆっくりと休止点に向かって減速する: 
    `'0.2s 100ms ease-out'`

*   ディレイなしで200msかけて実行する。
    標準曲線を使用してゆっくりと開始し、途中で加速し、最後にゆっくり減速する: 
    `'0.2s ease-in-out'`

*   ただちに開始し、200msかけて実行する。
    加速カーブを使用して低速で始まり、完全な速度で終了する: 
    `'0.2s ease-in'`

<div class="alert is-helpful">

**NOTE**: <br />
イージングカーブの一般的な情報については、マテリアルデザインのウェブサイトの[Natural easing curves](https://material.io/design/motion/speed.html#easing)を参照してください。

</div>

次の例では、状態間の1秒の遷移で、`open`から`closed`への状態遷移を提供しています。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="transition1"></code-example>

上のコードスニペットでは、`=>`演算子は単方向の遷移、 `<=>`は双方向の遷移を表します。遷移内では、`animate()`は遷移にかかる時間を指定します。この場合、`open`から`closed`への状態変化は1秒であり、ここでは`1s`と表現されます。

次の例では、0.5秒の遷移アニメーションの運動曲線を使用して、`closed`状態から`open`状態への状態遷移を追加します。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="transition2"></code-example>

<div class="alert is-helpful">

**Note:** [`state`](api/animations/state)関数と`transition`関数の中でスタイルを使用する際にいくつか追加の注意点があります。

* 各遷移の最後に適用されるスタイルを定義するには、[`state()`](api/animations/state) を使用します。これはアニメーションが完了した後も持続します。

* 中間のスタイルを定義するには、`transition()`を使います。これは、アニメーション中に動きの錯覚を作り出します。

* アニメーションが無効になったとき、`transition()`のスタイルはスキップできますが、[`state()`](api/animations/state) のスタイルはスキップできません。

* 同じ`transition()`引数に複数の状態のペアを含めることができます:<br/> `transition( 'on => off, off => void' )`。
</div>

### アニメーションをトリガーする

アニメーションがいつ開始するか検知するために、Angularは*トリガー*を必要とします。HTMLテンプレートのトリガーする要素にアタッチできるようにするために、`trigger()`関数は状態と遷移をまとめて、アニメーションに名前を付けます。

`trigger()`関数は、変更を監視するためにプロパティ名を記述します。変更が発生すると、トリガーはその定義に含まれるアクションを開始します。これらのアクションは、あとで説明するような、遷移関数やその他の関数にすることができます。

この例では、トリガーに`openClose`という名前をつけて、`button`要素にアタッチします。トリガーには、`open`状態と`close`状態、および2つの遷移のタイミングを記述します。

<div class="alert is-helpful">

**NOTE**: <br />
各`trigger()`関数呼び出しの中では、1つの要素はある時点で1つの状態にしかなれません。ただし、一度に複数のトリガーをアクティブにすることは可能です。

</div>

### アニメーションを定義してHTMLテンプレートに適用する

アニメーションは、アニメーション化されるHTML要素を制御するコンポーネントのメタデータで定義されます。アニメーションを定義するコードを`@Component()`デコレーター内の`animations:`プロパティ下に配置します。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="component"></code-example>

コンポーネントのアニメーショントリガーを定義したら、トリガー名を角括弧で囲み、その前に`@`記号を付けてそのコンポーネントのテンプレート内の要素にアタッチすることができます。
それから、次に示すように標準のAngularプロパティバインディング構文を使用して、トリガーをテンプレート式にバインドできます。ここで、`triggerName`はトリガーの名前で、`expression`は定義されたアニメーションの状態として評価されます。

<code-example format="typescript" language="typescript">

&lt;div [&commat;triggerName]="expression"&gt;&hellip;&lt;/div&gt;;

</code-example>

式の値が新しい状態に変わると、アニメーションが実行またはトリガーされます。

次のコードスニペットでは、トリガーを`isOpen`プロパティの値にバインドします。

<code-example header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html" region="trigger"></code-example>

この例では、`isOpen`式が`open`または`closed`の定義された状態として評価されたとき、状態変更のトリガー`openClose`を通知します。
それから、状態変更をハンドルし、状態変更アニメーションを開始するのは、`openClose`のコードにゆだねます。

ページに出入りする要素(DOMに挿入または削除される要素)では、アニメーションを条件付きにすることができます。たとえば、HTMLテンプレートのアニメーショントリガーで`*ngIf`を使用する場合などです。

<div class="alert is-helpful">

**NOTE**: <br />
コンポーネントファイル内で、アニメーションを定義するトリガーを`@Component()`デコレーターの`animations`プロパティの値に設定してください。

HTMLテンプレートファイル内では、定義されたアニメーションをアニメーション化されるHTML要素にアタッチするためにトリガー名を使用してください。

</div>

### コードレビュー

遷移の例で説明したコードファイルは次のとおりです。

<code-tabs>
    <code-pane header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="component"></code-pane>
    <code-pane header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html" region="trigger"></code-pane>
    <code-pane header="src/app/open-close.component.css" path="animations/src/app/open-close.component.css"></code-pane>
</code-tabs>

### まとめ

あなたは、`style()`と[`state()`](api/animations/state)と`animate()`を使って2つの状態間の遷移にアニメーションを追加する方法を学びました。

Angularアニメーションの高度な機能については、アニメーションセクションの[遷移とトリガー](guide/transition-and-triggers)の高度なテクニックから開始して学ぶことができます。

<a id="animation-api-summary"></a>

## アニメーションAPIの概要

`@angular/animations`モジュールによって提供される関数的APIはAngularアプリケーションのアニメーションを作成して制御するためのドメイン固有言語(DSL)を提供します。コア関数と関連するデータ構造の完全なリストと構文の詳細については、[APIリファレンス](api/animations)を参照してください。

| Function name                     | What it does                                                                                                                                                                                                |
|:---                               |:---                                                                                                                                                                                                         |
| `trigger()`                       | Kicks off the animation and serves as a container for all other animation function calls. HTML template binds to `triggerName`. Use the first argument to declare a unique trigger name. Uses array syntax. |
| `style()`                         | Defines one or more CSS styles to use in animations. Controls the visual appearance of HTML elements during animations. Uses object syntax.                                                                 |
| [`state()`](api/animations/state) | Creates a named set of CSS styles that should be applied on successful transition to a given state. The state can then be referenced by name within other animation functions.                              |
| `animate()`                       | Specifies the timing information for a transition. Optional values for `delay` and `easing`. Can contain `style()` calls within.                                                                            |
| `transition()`                    | Defines the animation sequence between two named states. Uses array syntax.                                                                                                                                 |
| `keyframes()`                     | Allows a sequential change between styles within a specified time interval. Use within `animate()`. Can include multiple `style()` calls within each `keyframe()`. Uses array syntax.                       |
| [`group()`](api/animations/group) | Specifies a group of animation steps \(*inner animations*\) to be run in parallel. Animation continues only after all inner animation steps have completed. Used within `sequence()` or `transition()`.     |
| `query()`                         | Finds one or more inner HTML elements within the current element.                                                                                                                                           |
| `sequence()`                      | Specifies a list of animation steps that are run sequentially, one by one.                                                                                                                                  |
| `stagger()`                       | Staggers the starting time for animations for multiple elements.                                                                                                                                            |
| `animation()`                     | Produces a reusable animation that can be invoked from elsewhere. Used together with `useAnimation()`.                                                                                                      |
| `useAnimation()`                  | Activates a reusable animation. Used with `animation()`.                                                                                                                                                    |
| `animateChild()`                  | Allows animations on child components to be run within the same timeframe as the parent.                                                                                                                    |

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

*   [遷移とトリガー](guide/transition-and-triggers)
*   [複雑なアニメーションシーケンス](guide/complex-animation-sequences)
*   [再利用可能なアニメーション](guide/reusable-animations)
*   [ルート遷移アニメーション](guide/route-animations)

<div class="alert is-helpful">

完全なアニメーションの[デモ](http://animationsftw.in/#/)と[プレゼンテーション](https://www.youtube.com/watch?v=JhNo3Wvj6UQ&feature=youtu.be&t=2h47m53s)を参照してください。これは2017年11月のAngularConnectカンファレンスで発表されたものです。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
