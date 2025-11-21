# カスタムルートマッチの作成

Angular Routerは、アプリケーションのナビゲーションを支援するために使用できる強力なマッチング戦略をサポートしています。
このマッチング戦略は、パラメーター付きの静的ルート、可変ルート、ワイルドカードルートなどをサポートしています。
また、URLがより複雑な状況で独自のカスタムパターンマッチを作成できます。

このチュートリアルでは、Angularの`UrlMatcher`を使用してカスタムルートマッチャーを作成します。
このマッチャーは、URL内のTwitterハンドルを検索します。

## 目標

Angularの`UrlMatcher`を実装してカスタムルートマッチャーを作成します。

## サンプルアプリケーションの作成

Angular CLIを使用して、新しいアプリケーション_angular-custom-route-match_を作成します。
デフォルトのAngularアプリケーションフレームワークに加えて、_profile_コンポーネントも作成します。

1. 新しいAngularプロジェクト、_angular-custom-route-match_を作成します。

   ```shell
   ng new angular-custom-route-match
   ```

   `Angular routingを追加しますか？`と表示されたら、`Y`を選択します。

   `どのスタイルシート形式を使用しますか？`と表示されたら、`CSS`を選択します。

   しばらくすると、新しいプロジェクト`angular-custom-route-match`の準備が整います。

1. ターミナルから`angular-custom-route-match`ディレクトリに移動します。
1. コンポーネント、_profile_を作成します。

   ```shell
   ng generate component profile
   ```

1. コードエディタで`profile.component.html`ファイルを見つけ、プレースホルダーコンテンツを次のHTMLに置き換えます。

   <docs-code header="profile/profile.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.component.html"/>

1. コードエディタで`app.component.html`ファイルを見つけ、プレースホルダーコンテンツを次のHTMLに置き換えます。

   <docs-code header="app.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.component.html"/>

## アプリケーションのルートを構成する

アプリケーションフレームワークが整ったら、次に`app.config.ts`ファイルにルーティング機能を追加する必要があります。
このプロセスの一環として、URL内のTwitterハンドルを検索するカスタムURLマッチャーを作成します。
このハンドルは、先行する`@`シンボルによって識別されます。

1. コードエディタで`app.config.ts`ファイルを開きます。
1. Angularの`provideRouter`と`withComponentInputBinding`、およびアプリケーションルートの`import`ステートメントを追加します。

   ```ts
   import {provideRouter, withComponentInputBinding} from '@angular/router';

   import {routes} from './app.routes';
   ```

1. プロバイダー配列に`provideRouter(routes, withComponentInputBinding())`ステートメントを追加します。

1. アプリケーションルートに次のコードを追加して、カスタムルートマッチャーを定義します。

   <docs-code header="app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" visibleRegion="matcher"/>

このカスタムマッチャーは、次のタスクを実行する関数です。

- マッチャーは、配列にセグメントが1つしかないことを確認します
- マッチャーは正規表現を使用して、ユーザー名の形式が一致することを確認します
- 一致があれば、関数は完全なURLを返し、`username`ルートパラメーターをパスのサブストリングとして定義します
- 一致しなければ、関数はnullを返し、ルーターはURLと一致する他のルートを探し続けます

HELPFUL: カスタムURLマッチャーは、他のルート定義と同じように動作します。他のルートと同じように、子ルートまたは遅延読み込みルートを定義します。

## ルートパラメーターの読み取り

カスタムマッチャーが設定されたので、`profile`コンポーネントでルートパラメーターをバインドできます。

コードエディタで`profile.component.ts`ファイルを開き、`username`パラメーターと一致する`input`を作成します。
以前、`provideRouter`で`withComponentInputBinding`機能を追加しました。
これにより、`Router`はルートコンポーネントに直接情報をバインドできます。

```ts
username = input.required<string>();
```

## カスタムURLマッチャーをテストする

コードが設定されたので、カスタムURLマッチャーをテストできます。

1. ターミナルウィンドウから`ng serve`コマンドを実行します。

   ```shell
   ng serve
   ```

1. ブラウザを`http://localhost:4200`に開きます。

   `私のプロフィールに移動`という文章を含む単一のWebページが表示されます。

1. **私のプロフィール**ハイパーリンクをクリックします。

   `こんにちは、Angular！`という新しい文章がページに表示されます。

## 次のステップ

Angular Routerのパターンマッチングを使用すると、アプリケーションで動的なURLがある場合に、多くの柔軟性を得られます。
Angular Routerの詳細については、以下のトピックを参照してください。

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="アプリ内ルーティングとナビゲーション"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>

HELPFUL: このコンテンツは、[Brandon Roberts](https://twitter.com/brandontroberts)による[Angular Routerを使用したカスタムルートマッチング](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483)に基づいています。
