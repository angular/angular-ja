# シングルページアプリケーションでの Angular ルートの使用

このチュートリアルでは、複数のAngularルートを使用するシングルページアプリケーション (SPA) を構築する方法について説明します。

シングルページアプリケーション (SPA) では、アプリケーションのすべての機能が1つのHTMLページに存在します。
ユーザーがアプリケーションの機能にアクセスすると、ブラウザはユーザーにとって重要な部分のみをレンダリングする必要があり、新しいページをロードする必要はありません。
このパターンは、アプリケーションのユーザー体験を大幅に改善できます。

ユーザーがアプリケーション内をどのように移動するかを定義するために、ルートを使用します。
ルートを追加して、ユーザーがアプリケーションの1つの部分から別の部分にどのように移動するかを定義します。
ルートを構成して、予期しない動作や不正な動作を防止できます。

## 目標

* サンプルアプリケーションの機能をモジュールに整理する。
* コンポーネントへのナビゲーション方法を定義する。
* パラメータを使用してコンポーネントに情報を渡す。
* 複数のルートをネストしてルートを構造化する。
* ユーザーがルートにアクセスできるかどうかを確認する。
* アプリケーションが保存されていない変更を破棄できるかどうかを制御する。
* ルートデータの事前取得と機能モジュールの遅延読み込みによってパフォーマンスを向上させる。
* コンポーネントの読み込みに特定の基準を必要とする。

## サンプルアプリケーションの作成

Angular CLIを使用して、新しいアプリケーション *angular-router-sample* を作成します。
このアプリケーションには、*crisis-list* と *heroes-list* の2つのコンポーネントが含まれます。

1. 新しいAngularプロジェクト *angular-router-sample* を作成します。

    <docs-code language="shell">
    ng new angular-router-sample
    </docs-code>

    `Angular routing を追加しますか?` と表示されたら、`N` を選択します。

    `どのスタイルシート形式を使用しますか?` と表示されたら、`CSS` を選択します。

    しばらくすると、新しいプロジェクト `angular-router-sample` が準備完了します。

1. ターミナルから、`angular-router-sample` ディレクトリに移動します。
1. *crisis-list* コンポーネントを作成します。

    <docs-code language="shell">
    ng generate component crisis-list
    </docs-code>

1. コードエディタで、`crisis-list.component.html` ファイルを見つけて、プレースホルダーのコンテンツを次のHTMLに置き換えます。

    <docs-code header="src/app/crisis-list/crisis-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/crisis-list/crisis-list.component.html"/>

1. 2 番目のコンポーネント *heroes-list* を作成します。

    <docs-code language="shell">
    ng generate component heroes-list
    </docs-code>

1. コードエディタで、`heroes-list.component.html` ファイルを見つけて、プレースホルダーのコンテンツを次のHTMLに置き換えます。

    <docs-code header="src/app/heroes-list/heroes-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/heroes-list/heroes-list.component.html"/>

1. コードエディタで、`app.component.html` ファイルを開き、その内容を次の HTML に置き換えます。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="setup"/>

1. `ng serve` コマンドを実行して、新しいアプリケーションが期待通りに動作することを確認します。

    <docs-code language="shell">
    ng serve
    </docs-code>

1. ブラウザで `http://localhost:4200` を開きます。

    タイトルと2つのコンポーネントのHTMLで構成される単一のWebページが表示されます。

## ルートの定義

このセクションでは、次の2つのルートを定義します。

* `/crisis-center` ルートは、`crisis-center` コンポーネントを開きます。
* `/heroes-list` ルートは、`heroes-list` コンポーネントを開きます。

ルート定義はJavaScriptオブジェクトです。
各ルートには、通常2つのプロパティがあります。
最初のプロパティ `path` は、ルートのURLパスを指定する文字列です。
2番目のプロパティ `component` は、そのパスに対してアプリケーションに表示するコンポーネントを指定する文字列です。

1. コードエディタから、`app.routes.ts` ファイルを作成して開きます。
1. アプリケーションのルートリストを作成してエクスポートします。

    ```ts
    import {Routes} from '@angular/router';

    export const routes = [];
    ```

1. 最初の2つのコンポーネントのルートを2つ追加します。

    ```ts
    {path: 'crisis-list', component: CrisisListComponent},
    {path: 'heroes-list', component: HeroesListComponent},
    ```

このルートリストは、JavaScriptオブジェクトの配列であり、各オブジェクトはルートのプロパティを定義します。

## `@angular/router` から `provideRouter` をインポートする

ルーティングを使用すると、URLパスに応じてアプリケーションの特定のビューを表示できます。
この機能をサンプルアプリケーションに追加するには、`app.config.ts` ファイルを更新して、ルータープロバイダー関数の `provideRouter` を使用します。
このプロバイダー関数は `@angular/router` からインポートします。

1. コードエディタから、`app.config.ts` ファイルを開きます。
1. 次のインポートステートメントを追加します。

    ```ts
    import { provideRouter } from '@angular/router';
    import { routes } from './app.routes';
    ```

1. `appConfig` のプロバイダーを更新します。

    ```ts
    providers: [provideRouter(routes)]
    ```

`NgModule` ベースのアプリケーションの場合、`provideRouter` を `AppModule` の `providers` リスト、またはアプリケーションの `bootstrapModule` に渡されるモジュールに入れます。

## `router-outlet` を使用してコンポーネントを更新する

この時点で、アプリケーションのルートを2つ定義しました。
ただし、アプリケーションは `crisis-list` コンポーネントと `heroes-list` コンポーネントの両方を `app.component.html` テンプレートにハードコードしたままです。
ルートが機能するためには、テンプレートを更新して、URLパスに基づいてコンポーネントを動的にロードする必要があります。

この機能を実装するには、テンプレートファイルに `router-outlet` ディレクティブを追加します。

1. コードエディタから、`app.component.html` ファイルを開きます。
1. 次の行を削除します。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="components"/>

1. `router-outlet` ディレクティブを追加します。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="router-outlet"/>

1. `app.component.ts` の `AppComponent` のインポートに `RouterOutlet` を追加します

    ```ts
    imports: [RouterOutlet],
    ```

ブラウザで更新されたアプリケーションを表示します。
アプリケーションタイトルのみが表示されます。
`crisis-list` コンポーネントを表示するには、ブラウザのアドレスバーのパス末尾に `crisis-list` を追加します。
たとえば、次のとおりです。

<docs-code language="text">
http://localhost:4200/crisis-list
</docs-code>

`crisis-list` コンポーネントが表示されることに注意してください。
Angularは、定義したルートを使用してコンポーネントを動的にロードしています。
同じ方法で `heroes-list` コンポーネントをロードできます。

<docs-code language="text">
http://localhost:4200/heroes-list
</docs-code>

## UI 要素を使用したナビゲーションの制御

現在、アプリケーションは2つのルートをサポートしています。
ただし、これらのルートを使用できる唯一の方法は、ユーザーがブラウザのアドレスバーにパスを手動で入力することです。
このセクションでは、ユーザーが `heroes-list` コンポーネントと `crisis-list` コンポーネント間を移動するためにクリックできる2つのリンクを追加します。
また、CSSスタイルも追加します。
これらのスタイルは必須とされませんが、現在表示されているコンポーネントのリンクを識別しやすくします。
その機能は次のセクションで追加します。

1. `app.component.html` ファイルを開き、タイトルの下に次のHTMLを追加します。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="nav"/>

    この HTML は、Angular ディレクティブ `routerLink` を使用しています。
    このディレクティブは、定義したルートをテンプレートファイルに接続します。

1. `AppComponent` のインポートリストに `RouterLink` ディレクティブを追加します。

1. `app.component.css` ファイルを開き、次のスタイルを追加します。

    <docs-code header="src/app/app.component.css" path="adev/src/content/examples/router-tutorial/src/app/app.component.css"/>

ブラウザでアプリケーションを表示すると、これらのリンクが 2 つ表示されます。
リンクをクリックすると、対応するコンポーネントが表示されます。

## アクティブなルートの識別

ユーザーは前のセクションで追加したリンクを使用してアプリケーションを移動できますが、アクティブなルートを簡単に識別する方法はありません。
Angular の `routerLinkActive` ディレクティブを使用して、この機能を追加します。

1. コードエディタから、`app.component.html` ファイルを開きます。
1. `routerLinkActive` ディレクティブを含むアンカータグを更新します。

    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="routeractivelink"/>
1. `AppComponent` の `imports` リストに `RouterLinkActive` ディレクティブを追加します。

アプリケーションを再度表示します。
ボタンのいずれかをクリックすると、そのボタンのスタイルが自動的に更新され、ユーザーにアクティブなコンポーネントが示されます。
`routerLinkActive` ディレクティブを追加すると、アプリケーションにアクティブなルートに特定の CSS クラスを適用するように指示します。
このチュートリアルでは、その CSS クラスは `activebutton` ですが、任意のクラスを使用できます。

`routerLinkActive` の `ariaCurrentWhenActive` に値を指定していることにも注意してください。これにより、視覚障碍のあるユーザー（異なるスタイリングの変化を認識できない可能性があります）も、アクティブなボタンを識別できるようになります。詳細については、アクセシビリティのベストプラクティス [アクティブなリンクの識別のセクション](/best-practices/a11y#active-links-identification) を参照してください。

## リダイレクトの追加

このチュートリアルのステップでは、ユーザーをリダイレクトして `/heroes-list` コンポーネントを表示するルートを追加します。

1. コードエディタから、`app.routes.ts` ファイルを開きます。
1. `routes` セクションを次のように更新します。

    ```ts
    {path: '', redirectTo: '/heroes-list', pathMatch: 'full'},
    ```

    この新しいルートは、パスとして空の文字列を使用していることに注意してください。
    さらに、`component` プロパティを 2 つの新しいプロパティに置き換えています。

    | プロパティ      | 詳細 |
    |:---            |:---   |
    | `redirectTo`    | このプロパティは、Angular に空のパスから `heroes-list` パスにリダイレクトするように指示します。                                                                                                                                                       |
    | `pathMatch`      | このプロパティは、Angular に URL のどの部分を一致させるかを指示します。このチュートリアルでは、このプロパティを `full` に設定する必要があります。この戦略は、パスとして空の文字列を使用する場合に推奨されます。このプロパティの詳細については、[ルート API ドキュメント](api/router/Route) を参照してください。 |

これで、アプリケーションを開くと、デフォルトで `heroes-list` コンポーネントが表示されます。

## 404 ページの追加

ユーザーが定義していないルートにアクセスしようとする可能性があります。
この動作に対処するために、404 ページを表示するのがベストプラクティスです。
このセクションでは、404 ページを作成し、ルート構成を更新して、指定されていないルートにそのページを表示します。

1. ターミナルから、新しいコンポーネント `PageNotFound` を作成します。

    <docs-code language="shell">
    ng generate component page-not-found
    </docs-code>

1. コードエディタから、`page-not-found.component.html` ファイルを開き、その内容を次のHTMLに置き換えます。

    <docs-code header="src/app/page-not-found/page-not-found.component.html" path="adev/src/content/examples/router-tutorial/src/app/page-not-found/page-not-found.component.html"/>

1. `app.routes.ts` ファイルを開き、次のルートをルートリストに追加します。

    ```ts
    {path: '**', component: PageNotFoundComponent}
    ```

    新しいルートは、`**` というパスを使用しています。
    このパスは、Angularがワイルドカードルートを識別する方法です。
    構成に存在しないルートは、すべてこのルートを使用します。

IMPORTANT: ワイルドカードルートは、配列の最後に配置されていることに注意してください。
ルートの順序は重要です。Angularはルートを順番に適用し、最初に一致したものを取得します。

`http://localhost:4200/powers` などの存在しないルートに移動してみてください。
このルートは、`app.routes.ts` ファイルで定義されているものと一致しません。
ただし、ワイルドカードルートを定義したため、アプリケーションは自動的に `PageNotFound` コンポーネントを表示します。

## 次のステップ

この時点で、Angularのルーティング機能を使用して、URLアドレスに基づいてユーザーに表示されるコンポーネントを変更する基本的なアプリケーションができました。
リダイレクトや、カスタム404ページを表示するワイルドカードルートなど、これらの機能を拡張しました。

ルーティングの詳細については、次のトピックを参照してください。

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="アプリ内ルーティングとナビゲーション"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>
