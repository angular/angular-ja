# `animate.enter`と`animate.leave`を使ったアプリケーションのアニメーション

適切に設計されたアニメーションは、アプリケーションをより楽しく、分かりやすく使用できるようにしますが、単なる装飾ではありません。
アニメーションは、いくつかの方法でアプリケーションとユーザー体験を向上させることができます。

* アニメーションがないと、ウェブページの遷移は突然で不快に感じられることがあります
* モーションはユーザー体験を大幅に向上させるため、アニメーションはユーザーが自分のアクションに対するアプリケーションの応答を検出する機会を与えます
* 優れたアニメーションは、ワークフロー全体でユーザーの注意をスムーズに誘導できます

Angularは、アプリケーションの要素をアニメーション化するために`animate.enter`と`animate.leave`を提供します。これら2つの機能は、適切なタイミングでenterおよびleaveのCSSクラスを適用するか、サードパーティライブラリからアニメーションを適用する関数を呼び出します。`animate.enter`と`animate.leave`はディレクティブではありません。これらはAngularコンパイラによって直接サポートされる特別なAPIです。これらは要素に直接使用できるほか、ホストバインディングとしても使用できます。

## `animate.enter` {#animate.enter}

`animate.enter`はDOMに_入る_要素をアニメーション化するために使用できます。CSSクラスと、transformまたはキーフレームアニメーションのいずれかを使用して、enterアニメーションを定義できます。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="src/app/enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="src/app/enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="src/app/enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

アニメーションが完了すると、Angularは`animate.enter`で指定したクラスをDOMから削除します。アニメーションクラスは、アニメーションがアクティブな間のみ存在します。

NOTE: 要素で複数のキーフレームアニメーションまたはtransitionプロパティを使用している場合、Angularは最も長いアニメーションが完了した_後にのみ_すべてのクラスを削除します。

`animate.enter`は、制御フローや動的式など、他のAngular機能と組み合わせて使用できます。`animate.enter`は、単一のクラス文字列（複数のクラスがスペースで区切られているもの）またはクラス文字列の配列を受け入れます。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="src/app/enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="src/app/enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="src/app/enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave` {#animate.leave}

`animate.leave` を使用して、要素がDOMから_離れる_ときにアニメーションを適用できます。CSSクラスと、transformまたはキーフレームアニメーションのいずれかを使用して、離脱アニメーションを定義できます。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="src/app/leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="src/app/leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="src/app/leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

アニメーションが完了すると、Angularはアニメーション化された要素をDOMから自動的に削除します。

NOTE: 要素に複数のキーフレームアニメーションまたはtransitionプロパティを使用する場合、Angularはそれらのアニメーションの中で最も長いものが完了した_後にのみ_要素を削除します。

`animate.leave` はsignalsやその他のbindingでも使用できます。`animate.leave` は単一のクラスまたは複数のクラスで使用できます。スペースで区切られた単純な文字列として指定するか、文字列配列として指定します。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="src/app/leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="src/app/leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="src/app/leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

## イベントバインディング、関数、およびサードパーティライブラリ {#event-bindings-functions-and-third-party-libraries}

`animate.enter`と`animate.leave`はどちらも、関数呼び出しを可能にするイベントバインディング構文をサポートしています。この構文を使用して、コンポーネントコード内の関数を呼び出したり、[GSAP](https://gsap.com/)、[anime.js](https://animejs.com/)などのサードパーティのアニメーションライブラリ、またはその他のJavaScriptアニメーションライブラリを利用したり可能です。

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="src/app/leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="src/app/leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="src/app/leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

`$event`オブジェクトは`AnimationCallbackEvent`型です。これには`target`として要素が含まれ、アニメーションが終了したときにフレームワークに通知するための`animationComplete()`関数を提供します。

IMPORTANT: Angularが要素を削除するためには、`animate.leave`を使用する際に`animationComplete()`関数を**必ず**呼び出す必要があります。

`animate.leave`を使用する際に`animationComplete()`を呼び出さない場合、Angularは4秒の遅延後に自動的にその関数を呼び出します。遅延の期間は、`MAX_ANIMATION_TIMEOUT`トークンをミリ秒単位で提供することにより設定できます。

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## テスト {#testing}

TestBedは、テスト環境でアニメーションを有効または無効にするための組み込みサポートを提供します。CSSアニメーションはブラウザでの実行が必要であり、多くのAPIはテスト環境では利用できません。デフォルトでは、TestBedはテスト環境でアニメーションを無効にします。

ブラウザテスト、例えばエンドツーエンドテストでアニメーションが動作していることをテストしたい場合は、テスト設定で`animationsEnabled: true`を指定することで、TestBedをアニメーションを有効にするように設定できます。

```typescript
  TestBed.configureTestingModule({animationsEnabled: true});
```

これにより、テスト環境でのアニメーションが通常通りに動作するように設定されます。

NOTE: 一部のテスト環境では、`animationstart`、`animationend`のようなアニメーションイベントや、それらに相当するトランジションイベントを発行しません。
