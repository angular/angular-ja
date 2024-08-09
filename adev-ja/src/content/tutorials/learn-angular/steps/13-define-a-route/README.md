# ルートを定義する

Angular Routerを使用するようにアプリケーションを設定したので、次にルートを定義する必要があります。

このアクティビティでは、アプリケーションにルートを追加して構成する方法について学びます。

<hr>

<docs-workflow>

<docs-step title="`app.routes.ts`でルートを定義する">

アプリケーションには、(1) ホームページと (2) ユーザーページの2つのページが表示されます。

ルートを定義するには、`app.routes.ts` の `routes` 配列に、以下のプロパティを持つルートオブジェクトを追加します。

- ルートの `path` (ルートパス (例: `/`) から自動的に始まります)
- ルートで表示する `component`

```ts
import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];
```

上記のコードは、`HomeComponent` をルートとして追加する方法の例です。これで、プレイグラウンドで `UserComponent` とともに実装できます。

`UserComponent` のパスには `'user'` を使用してください。

</docs-step>

<docs-step title="ルート定義にタイトルを追加する">

ルートを正しく定義することに加えて、Angular Routerでは、ユーザーが `title` プロパティを各ルートに追加することで、ナビゲートするたびにページタイトルの設定もできます。

`app.routes.ts` で、デフォルトルート (`path: ''`) と `user` ルートに `title` プロパティを追加します。例を以下に示します。

<docs-code language="ts" highlight="[8]">
import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';

export const routes: Routes =[
  {
    path: '',
    title: 'App Home Page',
    component: HomeComponent,
  },
];
</docs-code>

</docs-step>

</docs-workflow>

このアクティビティでは、Angularアプリケーションでルートを定義および構成する方法を学びました。素晴らしいですね。🙌

アプリケーションでルーティングを完全に有効にするための道のりは、あとわずかです。頑張ってください。


