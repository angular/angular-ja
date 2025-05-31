# `@defer`を用いた遅延読み込み

遅延可能ビュー（別名`@defer`ブロック）は、ページの初期レンダリングに厳密に必要ないコードの読み込みを遅らせることで、アプリケーションの初期バンドルサイズを削減します。これにより、多くの場合、初期読み込みが高速化され、特にLargest Contentful Paint（LCP）とTime to First Byte（TTFB）に関してCore Web Vitals（CWV）が向上します。

この機能を使用するには、テンプレートのセクションを`@defer`ブロックで宣言的にラップします。

```angular-html
@defer {
  <large-component />
}
```

`@defer`ブロック内のコンポーネント、ディレクティブ、パイプのコードは、別のJavaScriptファイルに分割され、残りのテンプレートがレンダリングされた後、必要な場合にのみ読み込まれます。

遅延可能ビューは、さまざまなトリガーやプリフェッチオプションおよびプレースホルダー、読み込み、エラー状態の管理のためのサブブロックをサポートしています。

## どの依存関係が遅延されますか？

アプリケーションを読み込む際に、コンポーネント、ディレクティブ、パイプ、およびコンポーネントCSSスタイルを遅延させることができます。

`@defer`ブロック内の依存関係を遅延させるためには、2つの条件を満たす必要があります。

1. **スタンドアロンである必要があります。** スタンドアロンでない依存関係は遅延させることができず、`@defer`ブロック内にあっても、依然として先に読み込まれます。
1. **同じファイル内の`@defer`ブロックの外側では参照できません。** `@defer`ブロックの外側で参照される場合、またはViewChildクエリ内で参照される場合、依存関係は先に読み込まれます。

`@defer`ブロックで使用されるコンポーネント、ディレクティブ、パイプの_推移的_依存関係は、厳密にはスタンドアロンである必要はありません。推移的依存関係は依然として`NgModule`で宣言でき、遅延読み込みに参加できます。

Angularのコンパイラは、`@defer`ブロックで使用される各コンポーネント、ディレクティブ、およびパイプに対して[動的インポート](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)文を生成します。ブロックのメインコンテンツは、すべてのインポートが解決された後にレンダリングされます。Angularは、これらのインポートの特定の順序を保証しません。

## 遅延読み込みのさまざまなステージを管理する方法

`@defer`ブロックには、遅延読み込みプロセスにおけるさまざまなステージを適切に処理できるように、いくつかのサブブロックがあります。

### `@defer`

これは、遅延読み込みされるコンテンツのセクションを定義するプライマリブロックです。これは最初はレンダリングされません。遅延コンテンツは、指定された[トリガー](/guide/defer#triggers)が発生するか、`when`条件が満たされたときに読み込まれてレンダリングされます。

デフォルトでは、`@defer`ブロックはブラウザの状態が[アイドル](/guide/defer#idle)になるとトリガーされます。

```angular-html
@defer {
  <large-component />
}
```

### `@placeholder`でプレースホルダーコンテンツを表示する

デフォルトでは、`@defer`ブロックはトリガーされる前にコンテンツをレンダリングしません。

`@placeholder`は、`@defer`ブロックがトリガーされる前に表示するコンテンツを宣言するオプションのブロックです。

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>プレースホルダーコンテンツ</p>
}
```

オプションですが、特定のトリガーでは、`@placeholder`または[テンプレート参照変数](/guide/templates/variables#template-reference-variables)のいずれかの存在が必要になる場合があります。詳細については、[トリガー](/guide/defer#triggers)セクションを参照してください。

Angularは、読み込みが完了すると、プレースホルダーコンテンツをメインコンテンツに置き換えます。プレースホルダーセクションには、プレーンHTML、コンポーネント、ディレクティブ、パイプなど、あらゆるコンテンツを使用できます。_プレースホルダーブロックの依存関係は先に読み込まれます_。

`@placeholder`ブロックは、プレースホルダーコンテンツが最初にレンダリングされた後にこのプレースホルダーを表示する`minimum`時間を指定するオプションのパラメータを受け入れます。

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>プレースホルダーコンテンツ</p>
}
```

この`minimum`パラメータは、ミリ秒(ms)または秒(s)の時間増分で指定されます。このパラメータを使用して、遅延された依存関係がすばやく取得された場合にプレースホルダーコンテンツが高速でちらつくのを防ぐことができます。

### `@loading`で読み込みコンテンツを表示する

`@loading`ブロックは、遅延された依存関係が読み込まれている間に表示するコンテンツを宣言できるようにするオプションのブロックです。これは、読み込みがトリガーされると`@placeholder`ブロックを置き換えます。

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="読み込み中..." src="loading.gif" />
} @placeholder {
  <p>プレースホルダーコンテンツ</p>
}
```

その依存関係は先に読み込まれます(`@placeholder`と同様)。

`@loading`ブロックは、遅延された依存関係がすばやく取得された場合に発生する可能性のあるコンテンツの高速なちらつきを防ぐために、2つのパラメータを受け入れます。

- `minimum` - このプレースホルダーを表示する最小時間
- `after` - 読み込みが開始されてから読み込みテンプレートを表示するまでの待機時間

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="読み込み中..." src="loading.gif" />
}
```

両方のパラメータは、ミリ秒(ms)または秒(s)の時間増分で指定されます。さらに、両方のパラメータのタイマーは、読み込みがトリガーされた直後に開始されます。

### 遅延読み込みが失敗した場合に`@error`でエラー状態を表示する

`@error`ブロックは、遅延読み込みが失敗した場合に表示するオプションのブロックです。`@placeholder`や`@loading`と同様に、`@error`ブロックの依存関係は先に読み込まれます。

```angular-html
@defer {
  <large-component />
} @error {
  <p>大型コンポーネントの読み込みに失敗しました。</p>
}
```

## トリガーを使用した遅延コンテンツ読み込みの制御

遅延コンテンツがいつ読み込まれて表示されるかを制御する**トリガー**を指定できます。

`@defer`ブロックがトリガーされると、プレースホルダーコンテンツが遅延読み込みされたコンテンツに置き換えられます。

複数のイベントトリガーを、セミコロン(`;`)で区切って定義でき、OR条件として評価されます。

トリガーには、`on`と`when`の2種類があります。

### `on`

`on`は、`@defer`ブロックがトリガーされる条件を指定します。

使用可能なトリガーは次のとおりです。

| トリガー                       | 説明                                                            |
| ----------------------------- | ---------------------------------------------------------------------- |
| [`idle`](#idle)               | ブラウザがアイドル状態になるとトリガーされます。                                     |
| [`viewport`](#viewport)       | 指定されたコンテンツがビューポートに入るとトリガーされます。                    |
| [`interaction`](#interaction) | ユーザーが指定された要素と対話するとトリガーされます。                |
| [`hover`](#hover)             | マウスが指定された領域にホバーするとトリガーされます。                     |
| [`immediate`](#immediate)     | 遅延されていないコンテンツのレンダリングが完了した直後にトリガーされます。 |
| [`timer`](#timer)             | 特定の期間後にトリガーされます。                                     |

#### `idle`

`idle`トリガーは、ブラウザがrequestIdleCallbackに基づいてアイドル状態に達すると、遅延コンテンツを読み込みます。これは、`@defer`ブロックのデフォルトの動作です。

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

#### `viewport`

`viewport`トリガーは、[Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)を使用して、指定されたコンテンツがビューポートに入ると、遅延コンテンツを読み込みます。観測されるコンテンツは、`@placeholder`コンテンツまたは明示的な要素参照にできます。

デフォルトでは、`@defer`は、プレースホルダーがビューポートに入っているかどうかを観察します。このように使用されるプレースホルダーは、単一のルート要素を持つ必要があります。

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

または、`@defer`ブロックと同じテンプレート内に、ビューポートに入っているかどうかが監視される要素として[テンプレート参照変数](/guide/templates/variables)を指定できます。この変数は、ビューポートトリガーのパラメータとして渡されます。

```angular-html
<div #greeting>こんにちは！</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

#### `interaction`

`interaction`トリガーは、ユーザーが`click`または`keydown`イベントを通じて指定された要素と対話すると、遅延コンテンツを読み込みます。

デフォルトでは、プレースホルダーが対話要素として機能します。このように使用されるプレースホルダーは、単一のルート要素を持つ必要があります。

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

Alternatively, you can specify a [template reference variable](/guide/templates/variables) in the same template as the `@defer` block as the element that is watched for interactions. This variable is passed in as a parameter on the viewport trigger.

```angular-html
<div #greeting>こんにちは！</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

`hover`トリガーは、マウスが`mouseover`イベントと`focusin`イベントを通じてトリガーされた領域にホバーすると、遅延コンテンツを読み込みます。

デフォルトでは、プレースホルダーが対話要素として機能します。このように使用されるプレースホルダーは、単一のルート要素を持つ必要があります。

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

または、`@defer`ブロックと同じテンプレート内に、ビューポートに入っているかどうかが監視される要素として[テンプレート参照変数](/guide/templates/variables)を指定できます。この変数は、ビューポートトリガーのパラメータとして渡されます。

```angular-html
<div #greeting>こんにちは！</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

`immediate`トリガーは、遅延コンテンツをすぐに読み込みます。これは、遅延ブロックは、他のすべての遅延されていないコンテンツのレンダリングが完了するとすぐに読み込まれることを意味します。

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

#### `timer`

`timer`トリガーは、指定された期間後に遅延コンテンツを読み込みます。

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

期間パラメータは、ミリ秒(`ms`)または秒(`s`)で指定する必要があります。

### `when`

`when`トリガーは、カスタムの条件式を受け取り、条件が真になったときに遅延コンテンツを読み込みます。

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

これは1回限りの操作です。`@defer`ブロックは、真になった後に偽の値に変更された場合、プレースホルダーに復帰しません。

## `prefetch`でデータをプリフェッチする

遅延コンテンツが表示される条件を指定することに加えて、**プリフェッチトリガー**をオプションで指定できます。このトリガーを使用すると、`@defer`ブロックに関連付けられたJavaScriptを、遅延コンテンツが表示される前に読み込むことができます。

プリフェッチを使用すると、ユーザーが実際に`@defer`ブロックを表示または対話する前に、ユーザーがすぐに対話する可能性のあるリソースのプリフェッチを開始します。これにより、リソースをより高速に利用できるようにするなど、より高度な動作が可能になります。

プリフェッチトリガーは、ブロックのメイントリガーと同様に指定できますが、`prefetch`キーワードを前に付けます。ブロックのメイントリガーとプリフェッチトリガーは、セミコロン(`;`)で区切られます。

次の例では、プリフェッチはブラウザがアイドル状態になると開始され、ブロックのコンテンツは、ユーザーがプレースホルダーと対話したときにのみレンダリングされます。

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>大型コンポーネントのプレースホルダー</div>
}
```

## `@defer`ブロックのテスト

Angularは、`@defer`ブロックのテストと、テスト中のさまざまな状態のトリガーを簡素化するTestBed APIを提供しています。デフォルトでは、テスト内の`@defer`ブロックは、実際のアプリケーションで`@defer`ブロックが動作するのと同じように動作します。状態を手動でステップ実行する場合は、TestBedの構成で`@defer`ブロックの動作を`Manual`に切り替えることができます。

```angular-ts
it('さまざまな状態で`@defer`ブロックをレンダリングする', async () => {
  // 手動制御のために`@defer`ブロックの動作を"一時停止"状態から開始するように構成します。
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
  // コンポーネントのfixtureを作成します。
  const componentFixture = TestBed.createComponent(ComponentA);
  // すべての`@defer`ブロックのfixtureを取得し、最初のブロックを取得します。
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // デフォルトでプレースホルダー状態をレンダリングします。
  expect(componentFixture.nativeElement.innerHTML).toContain('プレースホルダー');
  // 読み込み状態をレンダリングし、レンダリングされた出力を検証します。
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('読み込み中');
  // 最終状態をレンダリングし、出力を検証します。
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## `@defer`は`NgModule`と連携しますか？

`@defer`ブロックは、スタンドアロンコンポーネントと`NgModule`ベースのコンポーネント、ディレクティブ、パイプの両方と互換性があります。ただし、**スタンドアロンコンポーネント、ディレクティブ、パイプのみを遅延させることができます。**`NgModule`ベースの依存関係は遅延されず、先に読み込まれたバンドルに含まれます。

## `@defer`は、サーバーサイドレンダリング(SSR)と静的サイト生成(SSG)とどのように連携しますか？

デフォルトでは、サーバー上でアプリケーションをレンダリングする際(SSRまたはSSGを使用する場合)、`@defer`ブロックは常にその`@placeholder`(プレースホルダーが指定されていない場合は何も表示されません)をレンダリングし、トリガーは呼び出されません。クライアント側では、`@placeholder`の内容が水和され、トリガーがアクティブになります。

サーバー上(SSRとSSGの両方)で`@defer`ブロックのメインコンテンツをレンダリングするには、[Incremental Hydration機能](/guide/incremental-hydration)を有効にして、必要なブロックの`hydrate`トリガーを構成できます。

## ビューを遅延させるためのベストプラクティス

### ネストされた`@defer`ブロックによるカスケード読み込みを避ける

ネストされた`@defer`ブロックがある場合は、同時に読み込まれないように、異なるトリガーを指定する必要があります。これにより、カスケードリクエストが発生し、ページ読み込みのパフォーマンスが低下する可能性があります。

### レイアウトのシフトを避ける

初期読み込み時にユーザーのビューポートに表示されるコンポーネントを遅延させることは避けてください。これを行うと、累積レイアウトシフト(CLS)が増加するため、Core Web Vitalsに悪影響を与える可能性があります。

必要な場合、初期ページレンダリング中にコンテンツが読み込まれる`immediate`、`timer`、`viewport`、カスタム`when`トリガーは避けてください。
