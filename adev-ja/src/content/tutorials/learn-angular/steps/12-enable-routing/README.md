# ルーティングの概要

ほとんどのアプリケーションでは、アプリケーションに複数のページが必要になる時が来ます。その時は必ず、ルーティングがユーザーにとってのパフォーマンスの重要な部分になります。

このアクティビティでは、Angular Routerを使用してアプリケーションを設定および構成する方法を学びます。

<hr>

<docs-workflow>

<docs-step title="app.routes.ts ファイルの作成">

`app.routes.ts` 内で、以下のように変更します。

1. `@angular/router` パッケージから `Routes` をインポートします。
1. `Routes` 型の `routes` という名前の定数をエクスポートし、値として `[]` を割り当てます。

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="プロバイダーへのルーティングの追加">

`app.config.ts` で、以下の手順でAngular Routerにアプリケーションを構成します。

1. `@angular/router` から `provideRouter` 関数をインポートします。
1. `./app.routes.ts` から `routes` をインポートします。
1. `providers` 配列で、`routes` を引数として `provideRouter` 関数を呼び出します。

<docs-code language="ts" highlight="[2,3,6]">
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers:[provideRouter(routes)],
};
</docs-code>

</docs-step>

<docs-step title="コンポーネントへの `RouterOutlet` のインポート">

最後に、アプリケーションがAngular Routerを使用できる状態にするには、ルーターが目的のコンテンツを表示する場所をアプリケーションに伝える必要があります。これは、`@angular/router` から `RouterOutlet` ディレクティブを使用することで実現します。

`AppComponent` のテンプレートを更新し、`<router-outlet />` を追加します。

<docs-code language="angular-ts" highlight="[11]">
import {RouterOutlet} from '@angular/router';

@Component({
  ...
  template: `
    <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
  `,
  imports:[RouterOutlet],
})
export class AppComponent {}
</docs-code>

</docs-step>

</docs-workflow>

これで、アプリケーションはAngular Routerを使用できるようになりました。素晴らしいですね！🙌

勢いを維持して、次のステップであるアプリケーションのルートの定義を学びましょう。


