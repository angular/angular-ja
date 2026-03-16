# Angularアニメーションの概要

IMPORTANT: `@angular/animations`パッケージは現在非推奨です。Angularチームは、新しく書くコードのアニメーションには`animate.enter`と`animate.leave`を使ったネイティブCSSの利用を推奨します。詳しくは、新しいenterとleaveの[アニメーションガイド](guide/animations)を参照してください。また、アプリケーションで純粋なCSSアニメーションへの移行を始める方法については、[AngularのAnimationsパッケージからの移行](guide/animations/migration)も参照してください。

アニメーションは動いているように見せる効果を生み出します。HTML要素のスタイルは時間の経過とともに変化します。
適切に設計されたアニメーションは、アプリケーションをより楽しく、分かりやすく使えるようにしますが、単なる装飾ではありません。
アニメーションは、いくつかの方法でアプリケーションとユーザー体験を向上させます。

- アニメーションがないと、ウェブページの遷移は唐突でぎこちなく感じられることがあります
- モーションはユーザー体験を大きく向上させるため、アニメーションはユーザーが自分の操作に対するアプリケーションの応答を把握する機会を与えます
- 優れたアニメーションは、必要な場所へユーザーの注意を直感的に向けます

一般的に、アニメーションには時間の経過に沿った複数のスタイルの_変化_が含まれます。
HTML要素は移動、色の変更、拡大や縮小、フェード、ページ外へのスライドができます。
これらの変化は同時にも順番にも発生します。各変化のタイミングは制御できます。

AngularのアニメーションシステムはCSSの機能の上に構築されているため、ブラウザがアニメーション可能と見なす任意のプロパティをアニメーション化できます。
これには、位置、サイズ、transform、色、境界線などが含まれます。
W3Cは、アニメーション可能なプロパティの一覧を[CSS Transitions](https://www.w3.org/TR/css-transitions-1)ページで管理しています。

## このガイドについて {#about-this-guide}

このガイドでは、プロジェクトにAngularアニメーションを追加するための基本機能を紹介します。

## はじめに {#getting-started}

アニメーションに関する主なAngularモジュールは`@angular/animations`と`@angular/platform-browser`です。

プロジェクトでAngularアニメーションを使い始めるには、標準のAngular機能とあわせてアニメーション専用モジュールをインポートします。

<docs-workflow>
<docs-step title="アニメーションモジュールを有効にする">
`@angular/platform-browser/animations/async`から`provideAnimationsAsync`をインポートし、`bootstrapApplication`関数呼び出しのprovidersリストに追加します。

```ts {header: "Enabling Animations", linenums}
bootstrapApplication(AppComponent, {
  providers: [provideAnimationsAsync()],
});
```

<docs-callout important title="アプリケーションで即時のアニメーションが必要な場合">
  アプリケーションの読み込み直後にアニメーションを実行したい場合は、
  即時読み込みされるアニメーションモジュールへ切り替える必要があります。代わりに`provideAnimations`
  を`@angular/platform-browser/animations`からインポートし、`bootstrapApplication`
  関数呼び出しでは`provideAnimationsAsync`の**代わりに**`provideAnimations`を使用します。
</docs-callout>

`NgModule`ベースのアプリケーションでは、`BrowserAnimationsModule`をインポートします。これにより、アプリケーションのルートモジュールでアニメーション機能を利用できます。

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="コンポーネントファイルにアニメーション関数をインポートする">
コンポーネントファイルで特定のアニメーション関数を使用する予定がある場合は、それらの関数を`@angular/animations`からインポートします。

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="imports"/>

このガイドの末尾で、利用可能な[すべてのアニメーション関数](#animations-api-summary)を確認できます。

</docs-step>
<docs-step title="アニメーションメタデータプロパティを追加する">
コンポーネントファイルで、`@Component()`デコレーター内に`animations:`というメタデータプロパティを追加します。
アニメーションを定義するトリガーは、`animations`メタデータプロパティ内に配置します。

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="decorator"/>
</docs-step>
</docs-workflow>

## トランジションをアニメーション化する {#animating-a-transition}

1つのHTML要素をある状態から別の状態へ変化させるトランジションを、アニメーション化してみましょう。
たとえば、ユーザーの直前の操作に応じて、ボタンに**Open**または**Closed**のどちらかを表示するように指定できます。
ボタンが`open`状態のときは表示され、黄色です。
`closed`状態のときは半透明で、青色です。

HTMLでは、これらの属性は色や不透明度などの通常のCSSスタイルで設定します。
Angularでは、アニメーションで使用するCSSスタイルのセットを指定するために`style()`関数を使用します。
スタイルのセットをアニメーション状態としてまとめ、`open`や`closed`のような名前を付けます。

HELPFUL: 単純なトランジションでアニメーション化する新しい`open-close`コンポーネントを作成しましょう。

コンポーネントを生成するには、ターミナルで次のコマンドを実行します:

```shell
ng g component open-close
```

これにより、`src/app/open-close.ts`にコンポーネントが作成されます。

### アニメーションの状態とスタイル {#animation-state-and-styles}

Angularの[`state()`](api/animations/state)関数を使用して、各トランジションの終了時に適用する状態を定義します。
この関数は2つの引数を取ります:
`open`や`closed`のような一意の名前と、`style()`関数です。

`style()`関数を使用して、指定した状態名に関連付けるスタイルのセットを定義します。
`backgroundColor`のようにダッシュを含むスタイル属性には_camelCase_を使うか、`'background-color'`のように引用符で囲む必要があります。

Angularの[`state()`](api/animations/state)関数が、CSSスタイル属性を設定する`style()`関数とどのように連携するかを見てみましょう。
このコードスニペットでは、その状態に対して複数のスタイル属性を同時に設定しています。
`open`状態では、ボタンの高さは200ピクセル、不透明度は1、背景色は黄色です。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

続く`closed`状態では、ボタンの高さは100ピクセル、不透明度は0.8、背景色は青です。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state2"/>

### トランジションとタイミング {#transitions-and-timing}

Angularでは、アニメーションなしでも複数のスタイルを設定できます。
ただし、さらに調整しなければ、ボタンはフェードや縮小などの変化を示さないまま瞬時に変形します。

変化をそれほど唐突にしないためには、2つの状態の間で一定時間かけて起こる変化を指定するアニメーション_トランジション_を定義する必要があります。
`transition()`関数は2つの引数を受け取ります:
1つ目の引数は2つのトランジション状態の方向を定義する式で、2つ目の引数は1つ以上の`animate()`ステップです。

`animate()`関数では、トランジションの長さ、遅延、イージングを定義し、トランジション中のスタイルを指定します。
`animate()`関数を使って、複数ステップのアニメーションのための`keyframes()`関数も定義できます。
これらの定義は、`animate()`関数の2つ目の引数に配置します。

#### アニメーションメタデータ: 継続時間、遅延、イージング {#animation-metadata-duration-delay-and-easing}

`animate()`関数 \(トランジション関数の2つ目の引数\) は、`timings`と`styles`の入力パラメーターを受け取ります。

`timings`パラメーターは、数値または3つの部分で定義された文字列を取ります。

```ts
animate(duration);
```

または

```ts
animate('duration delay easing');
```

最初の部分である`duration`は必須です。
継続時間は、引用符なしの数値でミリ秒として表すか、引用符付きで時間指定子を付けた秒として表せます。
たとえば、10分の1秒の継続時間は次のように表せます:

- 単なる数値で、ミリ秒として:
  `100`

- 文字列で、ミリ秒として:
  `'100ms'`

- 文字列で、秒として:
  `'0.1s'`

2つ目の引数`delay`は、`duration`と同じ構文です。
例:

- 100ms待ってから200ms実行する: `'0.2s 100ms'`

3つ目の引数`easing`は、アニメーションが実行中にどのように[加速および減速するか](https://easings.net)を制御します。
たとえば、`ease-in`はアニメーションをゆっくり開始させ、進行するにつれて速度を上げます。

- 100ms待って、200ms実行する。
  減速カーブを使用して高速に開始し、停止点に向かってゆっくり減速します:
  `'0.2s 100ms ease-out'`

- 200ms実行し、遅延はなし。
  標準カーブを使用してゆっくり開始し、中盤で加速し、終盤でゆっくり減速します:
  `'0.2s ease-in-out'`

- すぐに開始して、200ms実行する。
  加速カーブを使用してゆっくり開始し、最大速度で終わります:
  `'0.2s ease-in'`

HELPFUL: イージングカーブの一般情報については、Material Designの[Natural easing curves](https://material.io/design/motion/speed.html#easing)を参照してください。

この例では、`open`から`closed`への状態トランジションを、状態間で1秒かけて行います。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition1"/>

上のコードスニペットでは、`=>`演算子は単方向トランジションを示し、`<=>`は双方向です。
トランジション内では、`animate()`がトランジションにかかる時間を指定します。
この場合、`open`から`closed`への状態変化は1秒で、ここでは`1s`と表現しています。

この例では、`closed`状態から`open`状態への状態トランジションを、0.5秒のトランジションアニメーションで追加しています。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition2"/>

HELPFUL: [`state()`](api/animations/state)関数と`transition()`関数内でスタイルを使用する際の補足です。

- [`state()`](api/animations/state)を使用すると、各トランジションの終了時に適用されるスタイルを定義できます。これらはアニメーション完了後も保持されます
- `transition()`を使用すると、中間スタイルを定義でき、アニメーション中に動いているような錯覚を生み出します
- アニメーションが無効な場合、`transition()`のスタイルはスキップされることがありますが、[`state()`](api/animations/state)のスタイルはスキップされません
- 同じ`transition()`引数内に複数の状態ペアを含めます:

  ```ts
  transition('on => off, off => void');
  ```

### アニメーションをトリガーする {#triggering-the-animation}

アニメーションには、いつ開始すべきかを知るための_トリガー_が必要です。
`trigger()`関数は状態とトランジションをまとめ、アニメーションに名前を付けることで、HTMLテンプレート内の対象要素に関連付けられるようにします。

`trigger()`関数は、変化を監視するプロパティ名を記述します。
変化が発生すると、トリガーはその定義に含まれるアクションを開始します。
これらのアクションは、後で見るように、トランジションやその他の関数です。

この例では、トリガーに`openClose`という名前を付け、`button`要素に関連付けます。
トリガーは、open状態とclosed状態、および2つのトランジションのタイミングを記述します。

HELPFUL: 各`trigger()`関数呼び出しの中では、要素は任意の時点で1つの状態にしかなれません。
ただし、複数のトリガーを同時にアクティブにできます。

### アニメーションを定義してHTMLテンプレートにアタッチする {#defining-animations-and-attaching-them-to-the-html-template}

アニメーションは、アニメーション化するHTML要素を制御するコンポーネントのメタデータで定義します。
アニメーションを定義するコードは、`@Component()`デコレーター内の`animations:`プロパティの下に配置します。

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>

コンポーネントのアニメーショントリガーを定義したら、そのコンポーネントのテンプレート内の要素に、トリガー名を角括弧で囲み、先頭に`@`記号を付けて関連付けます。
その後、次に示すように、標準のAngularプロパティバインディング構文を使ってトリガーをテンプレート式にバインドできます。ここで、`triggerName`はトリガー名、`expression`は定義済みのアニメーション状態に評価されます。

```angular-html
<div [@triggerName]="expression">…</div>
```

式の値が新しい状態に変化すると、アニメーションが実行されます。

次のコードスニペットでは、トリガーを`isOpen`プロパティの値にバインドしています。

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>

この例では、`isOpen`式の値が定義済みの`open`または`closed`状態になると、トリガー`openClose`に状態変化を通知します。
その後は、`openClose`のコードが状態変化を処理し、状態変化アニメーションを開始します。

ページに出入りする要素 \(DOMに挿入またはDOMから削除される要素\) では、アニメーションを条件付きにできます。
たとえば、HTMLテンプレートでアニメーショントリガーと一緒に`*ngIf`を使用します。

HELPFUL: コンポーネントファイルでは、アニメーションを定義するトリガーを、`@Component()`デコレーター内の`animations:`プロパティの値として設定します。

HTMLテンプレートファイルでは、トリガー名を使って、定義したアニメーションをアニメーション化するHTML要素に関連付けます。

### コードレビュー {#code-review}

次のコードファイルが、トランジションの例で説明した内容です。

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/open-close.css"/>
</docs-code-multifile>

### まとめ {#summary}

`style()`と[`state()`](api/animations/state)、およびタイミングのための`animate()`を使用して、2つの状態間のトランジションにアニメーションを追加する方法を学びました。

より高度な機能については、[transition and triggers](guide/legacy-animations/transition-and-triggers)から読み進めてください。

## Animations APIの概要 {#animations-api-summary}

`@angular/animations`モジュールが提供する関数型APIは、Angularアプリケーションでアニメーションを作成および制御するためのドメイン固有言語 \(DSL\) を提供します。
コア関数と関連データ構造の完全な一覧と構文の詳細については、[APIリファレンス](api#animations)を参照してください。

| 関数名                           | 役割                                                                                                                                                                                                         |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                      | アニメーションを開始し、他のすべてのアニメーション関数呼び出しのコンテナーとして機能します。HTMLテンプレートは`triggerName`にバインドします。最初の引数を使って一意のトリガー名を宣言します。配列構文を使用します。 |
| `style()`                        | アニメーションで使用する1つ以上のCSSスタイルを定義します。アニメーション中のHTML要素の見た目を制御します。オブジェクト構文を使用します。                                                                   |
| [`state()`](api/animations/state) | 指定した状態へのトランジションが成功したときに適用される、名前付きのCSSスタイルセットを作成します。この状態は、他のアニメーション関数内で名前で参照できます。                                                 |
| `animate()`                      | トランジションのタイミング情報を指定します。`delay`と`easing`は省略可能です。内部に`style()`呼び出しを含められます。                                                                                       |
| `transition()`                   | 2つの名前付き状態間のアニメーションシーケンスを定義します。配列構文を使用します。                                                                                                                           |
| `keyframes()`                    | 指定した時間範囲内で順次スタイルを変化させます。`animate()`の中で使用します。各`keyframe()`の内側に複数の`style()`呼び出しを含められます。配列構文を使用します。                                            |
| [`group()`](api/animations/group) | 並列に実行するアニメーションステップのグループ（_内側のアニメーション_）を指定します。すべての内側のアニメーションステップが完了した後でのみ、アニメーションは続行されます。`sequence()`または`transition()`内で使用します。 |
| `query()`                        | 現在の要素の内側にある1つ以上のHTML要素を検索します。                                                                                                                                                        |
| `sequence()`                     | 順番に1つずつ実行されるアニメーションステップのリストを指定します。                                                                                                                                          |
| `stagger()`                      | 複数要素のアニメーション開始時刻をずらします。                                                                                                                                                                |
| `animation()`                    | 別の場所から呼び出せる再利用可能なアニメーションを生成します。`useAnimation()`と併用します。                                                                                                                 |
| `useAnimation()`                 | 再利用可能なアニメーションを有効化します。`animation()`と併用します。                                                                                                                                         |
| `animateChild()`                 | 子コンポーネントのアニメーションを、親と同じ時間枠で実行できるようにします。                                                                                                                                  |

</table>

## Angularアニメーションについてさらに詳しく {#more-on-angular-animations}

HELPFUL: 2017年11月のAngularConnectカンファレンスで紹介されたこの[プレゼンテーション](https://www.youtube.com/watch?v=rnTK9meY5us)と、付属する[ソースコード](https://github.com/matsko/animationsftw.in)も確認してください。

以下の項目にも興味があるかもしれません：

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="トランジションとトリガー"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="複雑なアニメーションシーケンス"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="再利用可能なアニメーション"/>
  <docs-pill href="guide/routing/route-transition-animations" title="ルート遷移アニメーション"/>
  <docs-pill href="guide/animations/migration" title="ネイティブCSSアニメーションへ移行する"/>
</docs-pill-row>
