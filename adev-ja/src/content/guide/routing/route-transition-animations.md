# ルート遷移アニメーション

ルート遷移アニメーションは、Angularアプリケーション内の異なるビュー間を移動する際にスムーズな視覚的遷移を提供することで、ユーザー体験を向上させます。[Angular Router](/guide/routing)は、ブラウザのView Transitions APIの組み込みサポートを含んでおり、サポートされているブラウザでルート変更間のシームレスなアニメーションを可能にします。

HELPFUL: RouterのネイティブView Transitions統合は現在[デベロッパープレビュー](/reference/releases#developer-preview)中です。ネイティブView Transitionsは比較的新しいブラウザ機能であり、すべてのブラウザでのサポートは限られています。

## Viewトランジションの仕組み {#how-view-transitions-work}

Viewトランジションは、ブラウザのネイティブな[`document.startViewTransition` API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)を使用して、アプリケーションの異なる状態間でスムーズなアニメーションを作成します。このAPIは以下の手順で動作します。

1. **現在の状態をキャプチャする** - ブラウザが現在のページのスクリーンショットを撮ります
2. **DOMを更新する** - コールバック関数が実行され、DOMを更新します
3. **新しい状態をキャプチャする** - ブラウザが更新されたページの状態をキャプチャします
4. **トランジションを再生する** - ブラウザが古い状態と新しい状態の間をアニメーションします

以下に、`startViewTransition` APIの基本的な構造を示します。

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

ブラウザAPIの詳細については、[Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions)を参照してください。

## Routerがビュー遷移をどのように使用するか {#how-the-router-uses-view-transitions}

Angular Routerは、シームレスなルート変更を作成するために、ナビゲーションライフサイクルにビュー遷移を統合します。ナビゲーション中、Routerは以下を行います。

1. **ナビゲーションの準備を完了する** - ルートのマッチング、[遅延ロード](/guide/routing/define-routes#lazily-loaded-components-and-routes)、[ガード](/guide/routing/route-guards)、および[リゾルバー](/guide/routing/data-resolvers)が実行されます
2. **ビュー遷移を開始する** - ルートがアクティベーションの準備ができたときに、Routerは`startViewTransition`を呼び出します
3. **DOMを更新する** - Routerは、遷移コールバック内で新しいルートをアクティブ化し、古いルートを非アクティブ化します
4. **遷移を完了する** - Angularがレンダリングを完了すると、遷移Promiseが解決されます

Routerのビュー遷移統合は[プログレッシブエンハンスメント](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)として機能します。ブラウザがView Transitions APIをサポートしていない場合、Routerはアニメーションなしで通常のDOMを更新し、アプリケーションがすべてのブラウザで動作することを保証します。

## ルーターでのビュー遷移の有効化 {#enabling-view-transitions-in-the-router}

ビュー遷移を有効にするには、`withViewTransitions`機能を[ルーター設定](/guide/routing/define-routes#adding-the-router-to-your-application)に追加します。Angularは、スタンドアロンとNgModuleの両方のブートストラップアプローチをサポートしています。

### スタンドアロンブートストラップ {#standalone-bootstrap}

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withViewTransitions} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(MyApp, {
  providers: [provideRouter(routes, withViewTransitions())],
});
```

### NgModuleブートストラップ {#ngmodule-bootstrap}

```ts
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})],
})
export class AppRouting {}
```

[StackBlitzで「count」の例を試す](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

この例は、カウンターの更新に対して、ルーターナビゲーションが直接の`startViewTransition`呼び出しを置き換えることができる方法を示しています。

## CSSでトランジションをカスタマイズする {#customizing-transitions-with-css}

CSSを使用してビューのトランジションをカスタマイズし、独自のアニメーション効果を作成できます。ブラウザは、CSSセレクターでターゲットできる個別のトランジション要素を作成します。

カスタムトランジションを作成するには：

1. **view-transition-nameを追加する** - アニメーション化したい要素に一意の名前を割り当てる
2. **グローバルアニメーションを定義する** - グローバルスタイルでCSSアニメーションを作成する
3. **トランジション擬似要素をターゲットにする** - `::view-transition-old()`および`::view-transition-new()`セレクターを使用する

カウンター要素に回転効果を追加する例を次に示します。

```css
/* Define keyframe animations */
@keyframes rotate-out {
  to {
    transform: rotate(90deg);
  }
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg);
  }
}

/* Target view transition pseudo-elements */
::view-transition-old(count),
::view-transition-new(count) {
  animation-duration: 200ms;
  animation-name: -ua-view-transition-fade-in, rotate-in;
}

::view-transition-old(count) {
  animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

IMPORTANT: ビューのトランジションアニメーションは、コンポーネントスタイルではなく、グローバルスタイルファイルで定義してください。Angularの[ビューカプセル化](/guide/components/styling#style-scoping)はコンポーネントスタイルをスコープするため、トランジション擬似要素を正しくターゲットできなくなります。

[StackBlitzで更新された「count」の例を試す](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## onViewTransitionCreatedによる高度なトランジション制御 {#advanced-transition-control-with-onviewtransitioncreated}

`withViewTransitions`機能は、ビュー遷移を高度に制御するための`onViewTransitionCreated`コールバックを含むオプションオブジェクトを受け入れます。このコールバックは次のとおりです。

- [インジェクションコンテキスト](/guide/di/dependency-injection-context#run-within-an-injection-context)で実行されます
- 以下を含む[`ViewTransitionInfo`](/api/router/ViewTransitionInfo)オブジェクトを受け取ります。
  - `startViewTransition`からの`ViewTransition`インスタンス
  - ナビゲート元のルートに対する[`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot)
  - ナビゲート先のルートに対する[`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot)

このコールバックを使用して、ナビゲーションコンテキストに基づいてトランジション動作をカスタマイズできます。たとえば、特定のナビゲーションタイプではトランジションをスキップできます。

```ts
import {inject} from '@angular/core';
import {Router, withViewTransitions, isActive} from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.currentNavigation()!.finalUrl!;

    // Skip transition if only fragment or query params change
    const config = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    const isTargetRouteCurrent = isActive(targetUrl, router, config);

    if (isTargetRouteCurrent()) {
      transition.skipTransition();
    }
  },
});
```

この例では、ナビゲーションが[URLフラグメントまたはクエリパラメータ](/guide/routing/read-route-state#query-parameters)のみを変更する場合（同じページ内のアンカーリンクなど）にビュー遷移をスキップします。`skipTransition()`メソッドは、ナビゲーションの完了を許可しながらアニメーションを防止します。

## Chrome ExplainerのAngularへの適応例 {#examples-from-the-chrome-explainer-adapted-to-angular}

以下の例は、ChromeチームのドキュメントからAngular Routerで使用するために適応された、さまざまなビュー遷移テクニックを示しています。

### 遷移する要素は同じDOM要素である必要はない {#transitioning-elements-dont-need-to-be-the-same-dom-element}

要素は、同じ`view-transition-name`を共有している限り、異なるDOM要素間をスムーズに遷移できます。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [Angular Example on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### カスタムエントリー/イグジットアニメーション {#custom-entry-and-exit-animations}

ルート遷移中にビューポートに出入りする要素に対して、ユニークなアニメーションを作成します。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [Angular Example on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### 非同期DOM更新とコンテンツの待機 {#async-dom-updates-and-waiting-for-content}

Angular Routerは、追加コンテンツの読み込みを待つよりも、即時遷移を優先します。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTE: Angular Routerはビュー遷移を遅延させる方法を提供していません。この設計上の選択により、追加コンテンツを待っている間にページが非インタラクティブになるのを防ぎます。Chromeのドキュメントが指摘するように、「この間、ページはフリーズするため、ここでの遅延は最小限に抑えるべきです…場合によっては、遅延を完全に避け、すでに持っているコンテンツを使用する方が良いでしょう。」

### ビュー遷移タイプで複数のビュー遷移スタイルを処理する {#handle-multiple-view-transition-styles-with-view-transition-types}

ナビゲーションコンテキストに基づいて異なるアニメーションスタイルを適用するために、ビュー遷移タイプを使用します。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [Angular Example on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### ビュー遷移ルートのクラス名で複数のビュー遷移スタイルを処理する（非推奨） {#handle-multiple-view-transition-styles-with-a-class-name-on-the-view-transition-root-deprecated}

このアプローチは、遷移ルート要素のCSSクラスを使用してアニメーションスタイルを制御します。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [Angular Example on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### 他のアニメーションをフリーズさせずに遷移する {#transitioning-without-freezing-other-animations}

ビュー遷移中に他のページアニメーションを維持し、よりダイナミックなユーザー体験を作成します。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [Angular Example on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### JavaScriptでアニメーション化する {#animating-with-javascript}

複雑なアニメーションシナリオのために、JavaScript APIを使用してビュー遷移をプログラムで制御します。

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [Angular Example on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
