# RouterLinkを使用したナビゲーション

アプリケーションの現在の状態では、アプリケーション内に存在する内部リンクをクリックすると、ページ全体がリフレッシュされます。これは小さなアプリケーションではそれほど重要ではないように思えるかもしれませんが、ユーザーがアセットを再ダウンロードして計算をやり直す必要がある、より多くのコンテンツを持つ大きなページでは、パフォーマンスに影響を与える可能性があります。

NOTE: [アプリケーションにルートを追加する方法についての詳細ガイド](/guide/routing/common-router-tasks#add-your-routes-to-your-application)をご覧ください。

このアクティビティでは、Angular Routerを最大限活用するために、`RouterLink`ディレクティブを利用する方法を学習します。

<hr>

<docs-workflow>

<docs-step title="`RouterLink`ディレクティブのインポート">

`app.ts`で、`@angular/router`からの既存のインポートステートメントに`RouterLink`ディレクティブインポートを追加し、コンポーネントデコレーターの`imports`配列に追加します。

```ts
...
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  ...
})
```

</docs-step>

<docs-step title="テンプレートへの`routerLink`の追加">

`RouterLink`ディレクティブを使用するには、`href`属性を`routerLink`に置き換えます。この変更をテンプレートに適用してください。

```angular-ts
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  ...
  template: `
    ...
    <a routerLink="/">Home</a>
    <a routerLink="/user">User</a>
    ...
  `,
  imports: [RouterLink, RouterOutlet],
})
```

</docs-step>

</docs-workflow>

これで、ナビゲーション内のリンクをクリックしてもちらつきはなく、ページの内容自体（つまり `router-outlet`）のみが変更されます🎉

Angularでのルーティングについて学ぶことは素晴らしいことです。これは`Router` APIの表面的な部分に過ぎません。詳細については、[Angular Router ドキュメント](guide/routing)をご覧ください。
