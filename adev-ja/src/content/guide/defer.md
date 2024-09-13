# 遅延可能なビュー

## 概要

遅延可能なビューは、コンポーネントテンプレート内で、そのテンプレート内の特定の依存関係の読み込みを遅延させるために使用できます。これらの依存関係には、コンポーネントやディレクティブ、パイプおよび関連するCSSが含まれます。この機能を使用するには、テンプレートのセクションを、読み込み条件を指定する `@defer` ブロックで宣言的にラップできます。

遅延可能なビューは一連の[トリガー](guide/defer#triggers)と[プリフェッチ](guide/defer#prefetching)、そして[プレースホルダー](guide/defer#placeholder)や[読み込み中](guide/defer#loading)、[エラー](guide/defer#error)の状態管理に使用されるいくつかのサブブロックをサポートしています。また、[`when`](guide/defer#when)と[`prefetch when`](guide/defer#prefetching)を使用してカスタム条件を作成できます。

```angular-html
@defer {
  <large-component />
}
```

## 遅延可能なビューを使用する理由

遅延可能なビュー（`@defer` ブロックとも呼ばれます）は、アプリケーションの初期バンドルサイズを削減したり、後で読み込まれる可能性のある重いコンポーネントを遅延させたりするために使用できる強力なツールです。これにより、初期読み込みが高速化され、Core Web Vitals（CWV）の結果が向上するはずです。コンポーネントの一部を後で読み込むように遅延させると、特に最大コンテンツフルペイント（LCP）と最初のバイトまでの時間（TTFB）が向上します。

Note:  レイアウトシフトが発生する可能性のある遅延読み込みコンポーネントは、依存関係が読み込まれた後に折り畳み以下にあるか、ユーザーにまだ表示されていない場所に配置することを強くお勧めします。

## どの依存関係が遅延読み込み可能ですか？

`@defer` ブロック内の依存関係が遅延されるためには、次の2つの条件を満たす必要があります。

1. スタンドアロンである必要があります。スタンドアロンではない依存関係は遅延できず、`@defer` ブロック内であっても、引き続き即時的に読み込まれます。

2. 同じファイルから、`@defer` ブロックの外側では直接参照されていない必要があります。これには、ViewChildクエリも含まれます。

遅延ブロックで使用されるコンポーネント、ディレクティブ、パイプの推移的な依存関係は、スタンドアロンまたはNgModuleベースにでき、引き続き遅延されます。

## ブロック

`@defer` ブロックには、遅延読み込みプロセス中のさまざまな段階を適切に処理できるように、いくつかのサブブロックがあります。

### `@defer`

メインの `@defer` ブロックの内容は、遅延読み込みされるコンテンツのセクションです。最初はレンダリングされず、すべてのコンテンツは、指定された[トリガー](guide/defer#triggers)または `when` 条件が満たされ、依存関係がフェッチされると表示されます。デフォルトでは、`@defer` ブロックは、ブラウザの状態が[アイドル状態](guide/defer#on-idle)になるとトリガーされます。

### `@placeholder`

デフォルトでは、遅延ブロックは、トリガーされる前にコンテンツをレンダリングしません。`@placeholder` は、遅延ブロックがトリガーされる前に表示されるコンテンツを宣言するオプションのブロックです。このプレースホルダーコンテンツは、読み込みが完了すると、メインコンテンツに置き換えられます。プレースホルダーセクションには、プレーンHTML、コンポーネント、ディレクティブ、パイプなど、あらゆるコンテンツを使用できます。ただし、プレースホルダーブロックの依存関係は即時的に読み込まれることに注意してください。

Note:  最良のユーザー体験を実現するためには、常に `@placeholder` ブロックを指定する必要があります。

`@placeholder` ブロックは、プレースホルダーを表示する `minimum` 時間を指定するオプションのパラメーターを受け取ります。この `minimum` パラメーターは、ミリ秒 (ms) または秒 (s) の時間増分で指定されます。このパラメーターは、遅延された依存関係がすばやくフェッチされた場合に、プレースホルダーコンテンツの高速なちらつきを防ぐために存在します。`@placeholder` ブロックの `minimum` タイマーは、この `@placeholder` ブロックの初期レンダリングが完了した後に開始されます。

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>プレースホルダーコンテンツ</p>
}
```

Note:  特定のトリガーでは、[テンプレート参照変数](guide/templates/variables#template-reference-variables)のいずれか、または `@placeholder` のいずれかの存在が必要な場合があります。詳細については、[トリガー](guide/defer#triggers)セクションを参照してください。

### `@loading`

`@loading` ブロックは、遅延された依存関係の読み込み中に表示されるコンテンツを宣言できるオプションのブロックです。その依存関係は即時的に読み込まれます（`@placeholder` と同様）。

たとえば、読み込みスピナーを表示できます。読み込みがトリガーされると、`@loading` ブロックは `@placeholder` ブロックを置き換えます。

`@loading` ブロックは、プレースホルダーを表示する `minimum` 時間と、読み込みを開始してから読み込みテンプレートを表示するまでの待ち時間 `after` を指定する2つのオプションのパラメーターを受け取ります。`minimum` と `after` パラメーターは、ミリ秒 (ms) または秒 (s) の時間増分で指定されます。`@placeholder` と同様に、これらのパラメーターは、遅延された依存関係がすばやくフェッチされた場合に、コンテンツの高速なちらつきを防ぐために存在します。`@loading` ブロックの `minimum` と `after` の両方のタイマーは、読み込みがトリガーされた直後に開始されます。

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="読み込み中..." src="loading.gif" />
}
```

### `@error`

`@error` ブロックを使用すると、遅延読み込みが失敗した場合に表示されるコンテンツを宣言できます。`@placeholder` や `@loading` と同様に、`@error` ブロックの依存関係は即時的に読み込まれます。`@error` ブロックはオプションです。

```angular-html
@defer {
  <calendar-cmp />
} @error {
  <p>カレンダーを読み込めませんでした</p>
}
```

## トリガー

`@defer` ブロックがトリガーされると、プレースホルダーコンテンツが遅延読み込みされたコンテンツに置き換えられます。このスワップがトリガーされるタイミングを構成するオプションは、`on` と `when` の2つです。

<a id="on"></a>
`on` は、以下の利用可能なトリガーのリストからトリガーを使用して、トリガー条件を指定します。例としては、インタラクション時やビューポート時などがあります。

複数のイベントトリガーを一度に定義できます。たとえば、`on interaction; on timer(5s)` は、ユーザーがプレースホルダーとインタラクションした場合、または5秒後に遅延ブロックがトリガーされることを意味します。

Note:  複数の `on` トリガーは、常にOR条件です。同様に、`on` と `when` 条件を組み合わせた場合も、OR条件になります。

```angular-html
@defer (on viewport; on timer(5s)) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

<a id="when"></a>
`when` は、ブール値を返す式として条件を指定します。この式が真になると、プレースホルダーは遅延読み込みされたコンテンツに置き換えられます（依存関係をフェッチする必要がある場合は非同期操作になる可能性があります）。

Note:  `when` 条件が `false` に戻った場合、遅延ブロックはプレースホルダーに戻りません。スワップは1回限りの操作です。ブロック内のコンテンツを条件付きでレンダリングする必要がある場合は、ブロック自体内に `if` 条件を使用できます。

```angular-html
@defer (when cond) {
  <calendar-cmp />
}
```

`when` と `on` の両方を1つのステートメントで一緒に使用できます。いずれかの条件が満たされると、スワップがトリガーされます。

```angular-html
@defer (on viewport; when cond) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

### on idle

`idle` は、ブラウザがアイドル状態になったときに遅延読み込みをトリガーします（内部的には `requestIdleCallback` APIを使用して検出されます）。これは、遅延ブロックのデフォルトの動作です。

### on viewport

`viewport` は、指定されたコンテンツが[`IntersectionObserver` API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)を使用してビューポートに入ったときに遅延ブロックをトリガーします。これは、プレースホルダーコンテンツまたは要素参照にできます。

デフォルトでは、プレースホルダーは、単一のルート要素ノードである限り、ビューポートに入るために監視される要素として機能します。

```angular-html
@defer (on viewport) {
  <calendar-cmp />
} @placeholder {
  <div>カレンダーのプレースホルダー</div>
}
```

または、`@defer` ブロックと同じテンプレート内の[テンプレート参照変数](guide/templates/variables#template-reference-variables)を、ビューポートに入るために監視される要素として指定できます。この変数は、ビューポートトリガーのパラメーターとして渡されます。

```angular-html
<div #greeting>こんにちは！</div>

@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

### on interaction

`interaction` は、ユーザーが `click` または `keydown` イベントで指定された要素とインタラクションしたときに遅延ブロックをトリガーします。

デフォルトでは、プレースホルダーは、単一のルート要素ノードである限り、インタラクション要素として機能します。

```angular-html
@defer (on interaction) {
  <calendar-cmp />
} @placeholder {
  <div>カレンダーのプレースホルダー</div>
}
```

または、[テンプレート参照変数](guide/templates/variables#template-reference-variables)をインタラクションをトリガーする要素として指定できます。この変数は、インタラクショントリガーのパラメーターとして渡されます。

```angular-html
<button type="button" #greeting>こんにちは！</button>

@defer (on interaction(greeting)) {
  <calendar-cmp />
} @placeholder {
  <div>カレンダーのプレースホルダー</div>
}
```

### on hover

`hover` は、マウスがトリガーエリアにホバーしたときに遅延読み込みをトリガーします。これに使用されるイベントは、`mouseenter` と `focusin` です。

デフォルトでは、プレースホルダーは、単一のルート要素ノードである限り、ホバー要素として機能します。

```angular-html
@defer (on hover) {
  <calendar-cmp />
} @placeholder {
  <div>カレンダーのプレースホルダー</div>
}
```

または、[テンプレート参照変数](guide/templates/variables#template-reference-variables)をホバー要素として指定できます。この変数は、ホバートリガーのパラメーターとして渡されます。

```angular-html
<div #greeting>こんにちは！</div>

@defer (on hover(greeting)) {
  <calendar-cmp />
} @placeholder {
  <div>カレンダーのプレースホルダー</div>
}
```

### on immediate

`immediate` は、遅延読み込みをすぐにトリガーします。つまり、クライアントがレンダリングを完了すると、遅延チャンクがすぐにフェッチを開始します。

```angular-html
@defer (on immediate) {
  <calendar-cmp />
} @placeholder {
  <div>カレンダーのプレースホルダー</div>
}
```

### on timer

`timer(x)` は、指定された期間後にトリガーされます。期間は必須であり、`ms` または `s` で指定できます。

```angular-html
@defer (on timer(500ms)) {
  <calendar-cmp />
}
```

## プリフェッチ

`@defer` を使用すると、依存関係のプリフェッチをトリガーする条件を指定できます。`prefetch` キーワードを使用できます。`prefetch` 構文は、メインの遅延条件と同様に機能し、`when` または `on` を受け取ってトリガーを宣言します。

この場合、遅延に関連付けられた `when` と `on` はレンダリングするタイミングを制御し、`prefetch when` と `prefetch on` はリソースをフェッチするタイミングを制御します。これにより、ユーザーが実際に遅延ブロックを見たか、またはインタラクションしないうちにリソースのプリフェッチを開始してすぐにインタラクションする可能性があるため、リソースをより高速に利用できるようにするためのより高度な動作が可能になります。

次の例では、プリフェッチはブラウザがアイドル状態になったときに開始され、ブロックの内容はインタラクション時にレンダリングされます。

```angular-html
@defer (on interaction; prefetch on idle) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

## テスト

Angularは、`@defer` ブロックのテストと、テスト中のさまざまな状態のトリガーを簡素化するTestBed APIを提供します。デフォルトでは、テスト内の `@defer` ブロックは、実際のアプリケーションで遅延ブロックが動作するのと同じように動作します。状態を手動でステップ実行する場合は、TestBedの構成で遅延ブロックの動作を `Manual` に切り替えることができます。

```typescript
it('should render a defer block in different states', async () => {
  // configures the defer block behavior to start in "paused" state for manual control.
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});

  @Component({
    // ...
    template: `
      @defer {
        <large-component />
      } @placeholder {
        プレースホルダー
      } @loading {
        読み込み中...
      }
    `
  })
  class ComponentA {}

  // Create component fixture.
  const componentFixture = TestBed.createComponent(ComponentA);

  // Retrieve the list of all defer block fixtures and get the first block.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];

  // Renders placeholder state by default.
  expect(componentFixture.nativeElement.innerHTML).toContain('プレースホルダー');

  // Render loading state and verify rendered output.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('読み込み中');

  // Render final state and verify the output.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## サーバーサイドレンダリング（SSR）と静的サイト生成（SSG）での動作

サーバーでアプリケーションをレンダリングする場合（SSRまたはSSGを使用）、遅延ブロックは常に `@placeholder` をレンダリングします（プレースホルダーが指定されていない場合は何もレンダリングしません）。トリガーはサーバーでは無視されます。

## `NgModule` での動作

`@defer` ブロックは、スタンドアロンコンポーネントとNgModuleベースのコンポーネント、ディレクティブ、パイプの両方で使用できます。スタンドアロンとNgModuleベースの依存関係を `@defer` ブロック内で使用できますが、**遅延できるのはスタンドアロンコンポーネント、ディレクティブ、パイプのみです**。NgModuleベースの依存関係は、即時的に読み込まれたバンドルに含まれます。

## ネストされた `@defer` ブロックとカスケード読み込みの回避

複数の `@defer` ブロックをネストすると、カスケード要求が発生することがあります。その例としては、immediateトリガーを持つ `@defer` ブロックに、別のimmediateトリガーを持つネストされた `@defer` ブロックがある場合が挙げられます。ネストされた `@defer` ブロックがある場合は、内側のブロックに異なる条件を設定して、同時にトリガーされないようにし、カスケード要求が発生しないようにしてください。

## レイアウトシフトの回避

初期読み込み時にユーザーのビューポートに表示されるコンポーネントは遅延させないことをお勧めします。これにより、累積レイアウトシフト（CLS）が増加し、Core Web Vitalsに悪影響を及ぼします。この領域のコンポーネントを遅延させる場合は、初期レンダリング中にコンテンツが読み込まれる原因となる `immediate`、`timer`、`viewport`、およびカスタム `when` 条件を避けるのが最適です。
