# ハイドレーション

## ハイドレーションとは {#what-is-hydration}

ハイドレーションとは、サーバーサイドでレンダリングされたアプリケーションをクライアントで復元するプロセスです。これには、サーバーでレンダリングされたDOM構造の再利用、アプリケーション状態の永続化、サーバーによってすでに取得されたアプリケーションデータの転送、その他のプロセスが含まれます。

## ハイドレーションが重要な理由 {#why-is-hydration-important}

ハイドレーションは、DOMノードの再作成という余分な作業を回避することで、アプリケーションのパフォーマンスを向上させます。Angularは実行時に既存のDOM要素をアプリケーションの構造に一致させようとし、可能な場合はDOMノードを再利用します。これにより、First Input Delay ([FID](https://web.dev/fid/)) やLargest Contentful Paint ([LCP](https://web.dev/lcp/))、Cumulative Layout Shift ([CLS](https://web.dev/cls/)) の削減など、[Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) の統計を使用して測定できるパフォーマンスが向上します。これらの数値を改善することは、SEOパフォーマンスなどにも良い影響を与えます。

ハイドレーションが有効になっていない場合、サーバーサイドでレンダリングされたAngularアプリケーションは、アプリケーションのDOMを破棄して再レンダリングするため、目に見えるUIのちらつきが発生する場合があります。この再レンダリングは、[LCP](https://web.dev/lcp/) などの [Core Web Vitals](https://web.dev/learn-core-web-vitals/) に悪影響を与え、レイアウトシフトを引き起こす可能性があります。ハイドレーションを有効にすると、既存のDOMを再利用でき、ちらつきを防ぎます。

## Angularでハイドレーションを有効にする方法 {#how-do-you-enable-hydration-in-angular}

ハイドレーションは、サーバーサイドレンダリング (SSR) アプリケーションでのみ有効にできます。まず、[Angular SSRガイド](guide/ssr)に従ってサーバーサイドレンダリングを有効にしてください。

### Angular CLIを使用する {#using-angular-cli}

Angular CLIを使用してSSRを有効にした場合 (アプリケーション作成時、または後で `ng add @angular/ssr` を介して有効にした場合)、ハイドレーションを有効にするコードはすでにアプリケーションに含まれているはずです。

### 手動セットアップ {#manual-setup}

カスタムセットアップを使用しており、Angular CLIを使用してSSRを有効にしなかった場合は、メインアプリケーションコンポーネントまたはモジュールにアクセスし、`@angular/platform-browser` から `provideClientHydration` をインポートすることで、手動でハイドレーションを有効にできます。その後、そのプロバイダーをアプリケーションのブートストラッププロバイダーリストに追加します。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```

あるいは、NgModulesを使用している場合は、ルートアプリケーションモジュールのプロバイダーリストに `provideClientHydration` を追加します。

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANT: `provideClientHydration()` の呼び出しが、**サーバー**でアプリケーションをブートストラップするために使用されるプロバイダーセットにも含まれていることを確認してください。デフォルトのプロジェクト構造 ( `ng new` コマンドで生成されたもの) を持つアプリケーションでは、このモジュールはサーバーモジュールによってインポートされるため、ルート `AppModule` への呼び出しを追加するだけで十分です。カスタムセットアップを使用している場合は、サーバーブートストラップ設定のプロバイダーリストに `provideClientHydration()` の呼び出しを追加してください。

### ハイドレーションが有効になっていることを確認する {#verify-that-hydration-is-enabled}

ハイドレーションを設定し、サーバーを起動したら、ブラウザでアプリケーションをロードします。

HELPFUL: Angularの構成要素に切り替えるか、`ngSkipHydration` を使用して、ハイドレーションが完全に機能する前に、DOMの直接操作のインスタンスを修正する必要があるでしょう。詳細については、[制約](#constraints)、[DOMの直接操作](#direct-dom-manipulation)、および[特定のコンポーネントのハイドレーションをスキップする方法](#how-to-skip-hydration-for-particular-components)を参照してください。

開発モードでアプリケーションを実行している間は、ブラウザで開発者ツールを開き、コンソールを表示することで、ハイドレーションが有効になっていることを確認できます。ハイドレーションされたコンポーネントとノードの数など、ハイドレーション関連の統計を含むメッセージが表示されるはずです。Angularは、サードパーティライブラリから提供されるものを含め、ページにレンダリングされたすべてのコンポーネントに基づいて統計を計算します。

[Angular DevToolsブラウザ拡張機能](tools/devtools)を使用して、ページのコンポーネントのハイドレーションステータスを確認できます。Angular DevToolsでは、ページのどの部分がハイドレーションされたかを示すオーバーレイを有効にもできます。ハイドレーションの不一致エラーがある場合、DevToolsはエラーの原因となったコンポーネントも強調表示します。

## イベントのキャプチャとリプレイ {#capturing-and-replaying-events}

アプリケーションがサーバーでレンダリングされると、生成されたHTMLがロードされ次第、ブラウザに表示されます。ユーザーはページを操作できると考えるかもしれませんが、ハイドレーションが完了するまでイベントリスナーはアタッチされません。v18以降では、ハイドレーションの前に発生したすべてのイベントをキャプチャし、ハイドレーションが完了した後にそれらのイベントをリプレイできるようにするイベントリプレイ機能を有効にできます。たとえば、`withEventReplay()` 関数を使用して有効にできます。

```typescript
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
```

### イベントリプレイの仕組み {#how-event-replay-works}
イベントリプレイは、ハイドレーションプロセスが完了する前にトリガーされたユーザーイベントをキャプチャすることで、ユーザー体験を向上させる機能です。その後、それらのイベントがリプレイされ、インタラクションが失われないようにします。

イベントリプレイは主に3つのフェーズに分かれています。

- **ユーザーインタラクションのキャプチャ**<br>
**ハイドレーション**の前に、イベントリプレイは、クリックやその他のブラウザネイティブイベントなど、ユーザーが行う可能性のあるすべてのインタラクションをキャプチャして保存します。

- **イベントの保存**<br>
**イベントコントラクト**は、前のステップで記録されたすべてのインタラクションをメモリに保持し、後でリプレイするために失われないようにします。

- **イベントの再実行**<br>
**ハイドレーション**が完了すると、Angularはキャプチャされたイベントを再呼び出しします。

イベントリプレイは、`click`、`mouseover`、`focusin` などの _ネイティブブラウザイベント_ をサポートしています。イベントリプレイを強化するライブラリであるJSActionについて詳しく知りたい場合は、[readme](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme) を参照してください。

---

この機能は、ハイドレーションの前に実行されたユーザーアクションが無視されるのを防ぎ、一貫したユーザー体験を保証します。NOTE: [インクリメンタルハイドレーション](guide/incremental-hydration)を有効にしている場合、イベントリプレイは内部的に自動で有効になります。

## 制約 {#constraints}

ハイドレーションは、ハイドレーションが有効になっていない場合には存在しないいくつかの制約をアプリケーションに課します。アプリケーションは、サーバーとクライアントの両方で同じ生成されたDOM構造を持つ必要があります。ハイドレーションのプロセスは、DOMツリーが両方の場所で同じ構造を持つことを期待します。これには、Angularがサーバーでのレンダリング中に生成する空白やコメントノードも含まれます。これらの空白やノードは、サーバーサイドレンダリングプロセスによって生成されたHTMLに存在する必要があります。

IMPORTANT: サーバーサイドレンダリング操作によって生成されたHTMLは、サーバーとクライアントの間で変更されてはなりません。

サーバーとクライアントのDOMツリー構造に不一致がある場合、ハイドレーションプロセスは、期待されたものと実際にDOMに存在するものを一致させようとするときに問題に遭遇します。ネイティブDOM APIを使用してDOMを直接操作するコンポーネントが最も一般的な原因です。

### DOMの直接操作 {#direct-dom-manipulation}

ネイティブDOM APIを使用してDOMを操作したり、`innerHTML` または `outerHTML` を使用したりするコンポーネントがある場合、ハイドレーションプロセスはエラーに遭遇します。DOM操作が問題となる具体的なケースは、`document` へのアクセス、特定の要素のクエリ、`appendChild` を使用した追加ノードの注入などです。DOMノードをデタッチして別の場所に移動することもエラーにつながります。

これは、AngularがこれらのDOM変更を認識せず、ハイドレーションプロセス中にそれらを解決できないためです。Angularは特定の構造を期待しますが、ハイドレーションを試みるときに異なる構造に遭遇します。この不一致はハイドレーションの失敗につながり、DOM不一致エラー ([下記参照](#errors)) をスローします。

このようなDOM操作を避けるために、コンポーネントをリファクタリングするのが最善です。可能であれば、Angular APIを使用して作業してください。この動作をリファクタリングできない場合は、ハイドレーションに適したソリューションにリファクタリングできるまで、`ngSkipHydration` 属性 ([下記参照](#how-to-skip-hydration-for-particular-components)) を使用してください。

### 有効なHTML構造 {#valid-html-structure}

コンポーネントテンプレートに有効なHTML構造がない場合、ハイドレーション中にDOM不一致エラーが発生する可能性のあるケースがいくつかあります。

例として、この問題の最も一般的なケースをいくつか示します。

- `<tbody>` のない `<table>`
- `<p>` 内の `<div>`
- 別の `<a>` 内の `<a>`

HTMLが有効かどうか不明な場合は、[構文バリデーター](https://validator.w3.org/)を使用して確認できます。

NOTE: HTML標準ではテーブル内に `<tbody>` 要素を必須としていませんが、最新のブラウザは `<tbody>` を宣言していないテーブルに自動的に `<tbody>` 要素を作成します。この不整合のため、ハイドレーションエラーを避けるために、テーブルでは常に `<tbody>` 要素を明示的に宣言してください。

### preserveWhitespaces設定 {#preserve-whitespaces-configuration}

ハイドレーション機能を使用する場合、`preserveWhitespaces` のデフォルト設定である `false` を使用することをお勧めします。この設定がtsconfigにない場合、値は `false` であり、変更は不要です。`preserveWhitespaces: true` をtsconfigに追加して空白の保持を有効にすることを選択した場合、ハイドレーションで問題が発生する可能性があります。これはまだ完全にサポートされている構成ではありません。

HELPFUL: この設定が、サーバーの `tsconfig.server.json` とブラウザビルドの `tsconfig.app.json` で**一貫して**設定されていることを確認してください。値が一致しないと、ハイドレーションが壊れます。

この設定をtsconfigで設定することを選択した場合、デフォルトで `tsconfig.server.json` が継承する `tsconfig.app.json` のみに設定することをお勧めします。

### カスタムまたはNoop Zone.jsはまだサポートされていません {#custom-or-oop-zonejs-are-not-yet-supported}

ハイドレーションは、アプリケーション内でZone.jsが安定したときにZone.jsからのシグナルに依存しており、これによりAngularはサーバーでシリアル化プロセスを開始したり、クライアントでハイドレーション後のクリーンアップを実行して未請求のDOMノードを削除したりできます。

カスタムまたは「noop」Zone.jsの実装を提供すると、「安定」イベントのタイミングが異なり、シリアル化またはクリーンアップが早すぎたり遅すぎたりする可能性があります。これはまだ完全にサポートされている構成ではなく、カスタムZone.js実装の `onStable` イベントのタイミングを調整する必要がある場合があります。

## エラー {#errors}

ノードの不一致から、`ngSkipHydration` が無効なホストノードで使用されたケースまで、ハイドレーション関連のいくつかのエラーに遭遇する可能性があります。最も一般的なエラーケースは、ネイティブAPIを使用したDOMの直接操作が原因で発生するもので、ハイドレーションがサーバーによってレンダリングされたクライアント上の期待されるDOMツリー構造を見つけたり一致させたりできないというものです。この種のエラーに遭遇するもう1つのケースは、以前の[有効なHTML構造](#valid-html-structure)セクションで述べました。したがって、テンプレート内のHTMLが有効な構造を使用していることを確認すれば、そのエラーケースを回避できます。

ハイドレーション関連のエラーの完全なリファレンスについては、[エラーリファレンスガイド](/errors)を参照してください。

## 特定のコンポーネントのハイドレーションをスキップする方法 {#how-to-skip-hydration-for-particular-components}

一部のコンポーネントは、[DOMの直接操作](#direct-dom-manipulation)のような前述の問題により、ハイドレーションが有効になっていると正しく機能しない場合があります。回避策として、コンポーネントのタグに `ngSkipHydration` 属性を追加して、コンポーネント全体のハイドレーションをスキップできます。

```angular-html
<app-example ngSkipHydration />
```

あるいは、`ngSkipHydration` をホストバインディングとして設定できます。

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

`ngSkipHydration` 属性は、Angularにコンポーネント全体とその子孫のハイドレーションをスキップさせます。この属性を使用すると、コンポーネントはハイドレーションが有効になっていないかのように動作し、自身を破棄して再レンダリングします。

HELPFUL: これによりレンダリングの問題は修正されますが、このコンポーネント (およびその子孫) ではハイドレーションの恩恵を受けられないことを意味します。ハイドレーションを壊すパターン (例: DOMの直接操作) を避けるために、コンポーネントの実装を調整して、ハイドレーションスキップのアノテーションを削除できるようにする必要があります。

`ngSkipHydration` 属性は、コンポーネントのホストノードでのみ使用できます。この属性が他のノードに追加された場合、Angularはエラーをスローします。

ルートアプリケーションコンポーネントに `ngSkipHydration` 属性を追加すると、アプリケーション全体のハイドレーションが実質的に無効になることに注意してください。この属性の使用には注意と検討が必要です。これは最後の手段の回避策として意図されています。ハイドレーションを壊すコンポーネントは、修正が必要なバグと見なされるべきです。

## ハイドレーションのタイミングとアプリケーションの安定性 {#hydration-timing-and-application-stability}

アプリケーションの安定性は、ハイドレーションプロセスにおいて重要な部分です。ハイドレーションおよびハイドレーション後のプロセスは、アプリケーションが安定性を報告した後にのみ発生します。安定性が遅延する可能性のある方法はいくつかあります。例としては、タイムアウトとインターバルの設定、未解決のPromise、保留中のマイクロタスクなどがあります。これらの場合、アプリケーションが10秒後に安定状態に達していないことを示す [アプリケーションが不安定なままです](errors/NG0506) エラーに遭遇する可能性があります。アプリケーションがすぐにハイドレーションされない場合は、アプリケーションの安定性に影響を与えているものを見直し、これらの遅延を引き起こさないようにリファクタリングしてください。

## I18N {#i18n}

HELPFUL: デフォルトでは、Angularはi18nブロックを使用するコンポーネントのハイドレーションをスキップし、それらのコンポーネントを最初から再レンダリングします。

i18nブロックのハイドレーションを有効にするには、`provideClientHydration` の呼び出しに [`withI18nSupport`](/api/platform-browser/withI18nSupport) を追加します。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## サーバーサイドとクライアントサイドでの一貫したレンダリング {#consistent-rendering-across-server-side-and-client-side}
サーバーサイドレンダリング時とクライアントサイドレンダリング時で異なるコンテンツを表示する `@if` ブロックやその他の条件分岐 (Angularの `isPlatformBrowser` 関数を `@if` ブロックで使用するなど) を導入することは避けてください。これらのレンダリングの違いはレイアウトシフトを引き起こし、ユーザー体験とCore Web Vitalsに悪影響を与えます。

## DOM操作を伴うサードパーティライブラリ {#third-party-libraries-with-dom-manipulation}

レンダリングのためにDOM操作に依存するサードパーティライブラリが多数存在します。D3チャートはその典型的な例です。これらのライブラリはハイドレーションなしでは機能しましたが、ハイドレーションが有効な場合はDOM不一致エラーを引き起こす可能性があります。現時点では、これらのライブラリのいずれかを使用してDOM不一致エラーが発生した場合、そのライブラリを使用してレンダリングするコンポーネントに `ngSkipHydration` 属性を追加できます。

## DOM操作を伴うサードパーティスクリプト {#third-party-scripts-with-dom-manipulation}

広告トラッカーやアナリティクスなど、多くのサードパーティスクリプトは、ハイドレーションが行われる前にDOMを変更します。これらのスクリプトは、ページがAngularが期待する構造と一致しなくなるため、ハイドレーションエラーを引き起こす可能性があります。可能な限り、この種のスクリプトをハイドレーション後まで遅らせることを推奨します。[`AfterNextRender`](api/core/afterNextRender) を使用して、ハイドレーション後のプロセスが完了するまでスクリプトを遅延させることを検討してください。

## インクリメンタルハイドレーション {#incremental-hydration}

インクリメンタルハイドレーションは、ハイドレーションがいつ発生するかをよりきめ細かく制御できる、高度なハイドレーション形式です。詳細については、[インクリメンタルハイドレーションガイド](guide/incremental-hydration)を参照してください。
