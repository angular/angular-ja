# インクリメンタルハイドレーション

**インクリメンタルハイドレーション**は、アプリケーションの一部を非ハイドレーション状態のままにし、必要に応じてそれらのセクションのハイドレーションを*段階的に*トリガーできる、高度なタイプの[ハイドレーション](guide/hydration)です。

## インクリメンタルハイドレーションを使用する理由

インクリメンタルハイドレーションは、完全なアプリケーションハイドレーションを基盤としたパフォーマンス向上策です。完全なアプリケーションハイドレーションと同等のエンドユーザー体験を提供しながら、より小さな初期バンドルを作成できます。バンドルサイズが小さくなると、初期ロード時間が短縮され、[First Input Delay (FID)](https://web.dev/fid)と[Cumulative Layout Shift (CLS)](https://web.dev/cls)が改善されます。

インクリメンタルハイドレーションを使用すると、以前は遅延できなかった可能性のあるコンテンツに遅延可能ビュー(`@defer`)を使用できるようになります。具体的には、画面の上部に表示されるコンテンツに遅延可能ビューを使用できるようになりました。インクリメンタルハイドレーション以前は、画面の上部に`@defer`ブロックを配置すると、プレースホルダーコンテンツがレンダリングされ、その後`@defer`ブロックのメインテンプレートコンテンツに置き換えられます。これにより、レイアウトシフトが発生します。インクリメンタルハイドレーションを使用すると、`@defer`ブロックのメインテンプレートは、ハイドレーション時にレイアウトシフトなしでレンダリングされます。

## Angularでインクリメンタルハイドレーションを有効にする方法

ハイドレーションによるサーバーサイドレンダリング(SSR)を既に使用しているアプリケーションでインクリメンタルハイドレーションを有効にできます。サーバーサイドレンダリングを有効にするには[Angular SSRガイド](guide/ssr)を、ハイドレーションを有効にするには[Angularハイドレーションガイド](guide/hydration)を参照してください。

`provideClientHydration`プロバイダーに`withIncrementalHydration()`関数を追加することで、インクリメンタルハイドレーションを有効にします。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withIncrementalHydration())]
});
```

インクリメンタルハイドレーションは[イベントリプレイ](guide/hydration#capturing-and-replaying-events)に依存し、自動的に有効にします。既にリストに`withEventReplay()`がある場合は、インクリメンタルハイドレーションを有効にした後、安全に削除できます。

## インクリメンタルハイドレーションの動作方法

インクリメンタルハイドレーションは、完全なアプリケーション[ハイドレーション](guide/hydration)、[遅延可能ビュー](guide/defer)、および[イベントリプレイ](guide/hydration#capturing-and-replaying-events)を基盤として構築されています。インクリメンタルハイドレーションを使用すると、インクリメンタルハイドレーションの境界を定義する`@defer`ブロックに追加のトリガーを追加できます。`defer`ブロックに`hydrate`トリガーを追加すると、Angularはサーバーサイドレンダリング中にその`defer`ブロックの依存関係をロードし、`@placeholder`ではなくメインテンプレートをレンダリングする必要があることを認識します。クライアントサイドレンダリングの場合、依存関係はまだ遅延され、`hydrate`トリガーが起動するまで`defer`ブロックのコンテンツは非ハイドレーション状態のままです。そのトリガーは、`defer`ブロックに依存関係を取得してコンテンツをハイドレーションするよう指示します。ハイドレーションの前にユーザーによってトリガーされたブラウザイベント、特にコンポーネントに登録されたリスナーと一致するイベントは、キューに入れられ、ハイドレーションプロセスが完了すると再生されます。

## トリガーによるコンテンツのハイドレーション制御

Angularが遅延コンテンツをロードしてハイドレーションするタイミングを制御する**ハイドレーショントリガー**を指定できます。これらは、通常の`@defer`トリガーとともに使用できる追加のトリガーです。

各`@defer`ブロックには、セミコロン(`;`)で区切られた複数のハイドレーションイベントトリガーを含めることができます。Angularは、いずれかのトリガーが起動するとハイドレーションを開始します。

ハイドレーショントリガーには、`hydrate on`、`hydrate when`、`hydrate never`の3種類があります。

### `hydrate on`

`hydrate on`は、`@defer`ブロックのハイドレーションがトリガーされる条件を指定します。

使用可能なトリガーは次のとおりです。

| トリガー                                             | 説明                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| [`hydrate on idle`](#hydrate-on-idle)               | ブラウザがアイドル状態になったときにトリガーされます。                                     |
| [`hydrate on viewport`](#hydrate-on-viewport)       | 指定されたコンテンツがビューポートに入ったときにトリガーされます。                    |
| [`hydrate on interaction`](#hydrate-on-interaction) | ユーザーが指定された要素と対話したときにトリガーされます。                |
| [`hydrate on hover`](#hydrate-on-hover)             | マウスが指定された領域にホバーしたときにトリガーされます。                     |
| [`hydrate on immediate`](#hydrate-on-immediate)     | 非遅延コンテンツのレンダリングが完了した直後にトリガーされます。 |
| [`hydrate on timer`](#hydrate-on-timer)             | 特定の期間後にトリガーされます。                                     |

#### `hydrate on idle`

`hydrate on idle`トリガーは、`requestIdleCallback`に基づいてブラウザがアイドル状態に達すると、遅延可能ビューの依存関係をロードし、コンテンツをハイドレーションします。

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on viewport`

`hydrate on viewport`トリガーは、[Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)を使用して指定されたコンテンツがビューポートに入ったときに、
対応するアプリケーションのページの遅延可能ビューの依存関係をロードし、ハイドレーションします。

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction`

`hydrate on interaction`トリガーは、ユーザーが`click`または`keydown`イベントを通じて指定された要素と対話したときに、
遅延可能ビューの依存関係をロードし、コンテンツをハイドレーションします。

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover`

`hydrate on hover`トリガーは、`mouseover`および`focusin`イベントを通じてマウスがトリガー領域にホバーしたときに、
遅延可能ビューの依存関係をロードし、コンテンツをハイドレーションします。

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate`

`hydrate on immediate`トリガーは、遅延可能ビューの依存関係をロードし、すぐにコンテンツをハイドレーションします。
これは、他のすべての非遅延コンテンツのレンダリングが完了するとすぐに、遅延ブロックがロードされることを意味します。

```angular-html
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on timer`

`hydrate on timer`トリガーは、指定された期間後に遅延可能ビューの依存関係をロードし、コンテンツをハイドレーションします。

```angular-html
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

期間パラメーターは、ミリ秒(`ms`)または秒(`s`)で指定する必要があります。

### `hydrate when`

`hydrate when`トリガーはカスタムの条件式を受け入れ、条件が真になったときに
遅延可能ビューの依存関係をロードし、コンテンツをハイドレーションします。

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: `hydrate when`条件は、最上位の非ハイドレーション`@defer`ブロックである場合にのみトリガーされます。
トリガーに提供される条件は親コンポーネントで指定され、トリガーされる前に存在する必要があります。
親ブロックが非ハイドレーション状態の場合、その式はまだAngularによって解決できません。

### `hydrate never`

`hydrate never`を使用すると、`defer`ブロック内のコンテンツを無期限に非ハイドレーション状態のままにでき、事実上静的コンテンツになります。
これは最初のレンダリングにのみ適用されることに注意してください。
後続のクライアントサイドレンダリングでは、`hydrate never`を含む`@defer`ブロックは依存関係をロードします。ハイドレーションはサーバーサイドレンダリングされたコンテンツの最初のロードにのみ適用されるためです。
次の例では、後続のクライアントサイドレンダリングでは、ビューポートで`@defer`ブロックの依存関係がロードされます。

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: `hydrate never`を使用すると、指定された`@defer`ブロックのネストされたサブツリー全体のハイドレーションが防止されます。そのブロックの下にネストされたコンテンツに対しては、他の`hydrate`トリガーは起動しません。

## 通常のトリガーとハイドレーショントリガーの併用

ハイドレーショントリガーは、`@defer`ブロックの通常のトリガーと併用される追加のトリガーです。ハイドレーションは最初のロードの最適化であるため、ハイドレーショントリガーはその最初のロードにのみ適用されます。後続のクライアントサイドレンダリングでは、通常のトリガーが引き続き使用されます。

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder{
  <div>Example Placeholder</div>
}
```

この例では、最初のロード時に`hydrate on interaction`が適用されます。`<example-cmp />`コンポーネントとの対話でハイドレーションがトリガーされます。クライアントサイドでレンダリングされる後続のページロード（たとえば、このコンポーネントを含むページをロードするrouterLinkをクリックした場合）では、`on idle`が適用されます。

## ネストされた`@defer`ブロックとインクリメンタルハイドレーションの連携方法

Angularのコンポーネントと依存関係のシステムは階層的であるため、コンポーネントをハイドレーションするには、そのすべての親もハイドレーションされている必要があります。したがって、ネストされた非ハイドレーション`@defer`ブロックのセットの子`@defer`ブロックでハイドレーションがトリガーされた場合、ハイドレーションは最上位の非ハイドレーション`@defer`ブロックからトリガーされた子まで順にトリガーされ、その順序で実行されます。

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder{
  <div>Parent Placeholder</div>
}
```

上記の例では、ネストされた`@defer`ブロックにホバーするとハイドレーションがトリガーされます。`<parent-block-cmp />`を含む親`@defer`ブロックが最初にハイドレーションされ、その後`<child-block-cmp />`を含む子`@defer`ブロックがハイドレーションされます。

## 制約事項

インクリメンタルハイドレーションには、完全なアプリケーションハイドレーションと同じ制約事項があり、直接的なDOM操作の制限や有効なHTML構造の必要性などが含まれます。詳細については、[ハイドレーションガイドの制約事項](guide/hydration#constraints)セクションを参照してください。

## `@placeholder`ブロックはまだ指定する必要がありますか？

はい。`@placeholder`ブロックのコンテンツはインクリメンタルハイドレーションには使用されませんが、後続のクライアントサイドレンダリングの場合には`@placeholder`が必要です。コンテンツが最初のロードの一部であったルートにない場合、`@defer`ブロックコンテンツを持つルートへのナビゲーションは、通常の`@defer`ブロックのようにレンダリングされます。そのため、`@placeholder`はこれらのクライアントサイドレンダリングの場合にレンダリングされます。
