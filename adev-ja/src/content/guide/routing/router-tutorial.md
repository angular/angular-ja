# シングルページアプリケーションでAngularルートを使う

このチュートリアルでは、複数のAngularルートを使用するシングルページアプリケーション（SPA）を構築する方法について説明します。

シングルページアプリケーション（SPA）では、アプリケーションのすべての機能が単一のHTMLページに存在します。
ユーザーがアプリケーションの機能にアクセスすると、ブラウザは新しいページを読み込む代わりに、ユーザーにとって重要な部分のみをレンダリングする必要があります。
このパターンは、アプリケーションのユーザー体験を大幅に向上させることができます。

ユーザーがアプリケーション内をどのように移動するかを定義するには、ルートを使用します。
ユーザーがアプリケーションのある部分から別の部分へ移動する方法を定義するために、ルートを追加します。
また、予期せぬ動作や不正な動作から保護するために、ルートを設定できます。

## 目的 {#objectives}

- サンプルアプリケーションの機能をモジュールに整理する。
- コンポーネントへのナビゲーション方法を定義する。
- パラメーターを使用してコンポーネントに情報を渡す。
- 複数のルートをネストしてルートを構成する。
- ユーザーがルートにアクセスできるか確認する。
- アプリケーションが未保存の変更を破棄できるかどうかを制御する。
- ルートデータのプリフェッチと機能モジュールの遅延読み込みによってパフォーマンスを向上させる。
- コンポーネントをロードするための特定の条件を要求する。

## サンプルアプリケーションを作成 {#create-a-sample-application}

Angular CLIを使用して、新しいアプリケーション_angular-router-sample_を作成します。
このアプリケーションには、_crisis-list_と_heroes-list_の2つのコンポーネントが含まれます。

1. 新しいAngularプロジェクト_angular-router-sample_を作成します。

   ```shell
   ng new angular-router-sample
   ```

   `Would you like to add Angular routing?`と表示されたら、`N`を選択します。

   `Which stylesheet format would you like to use?`と表示されたら、`CSS`を選択します。

   しばらくすると、新しいプロジェクト`angular-router-sample`の準備が整います。

1. ターミナルから、`angular-router-sample`ディレクトリに移動します。
1. コンポーネント_crisis-list_を作成します。

```shell
ng generate component crisis-list
```

1. コードエディターで、ファイル`crisis-list.component.html`を見つけて、プレースホルダーの内容を以下のHTMLに置き換えます。

<docs-code header="crisis-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/crisis-list/crisis-list.component.html"/>

1. 2番目のコンポーネント_heroes-list_を作成します。

```shell
ng generate component heroes-list
```

1. コードエディターで、ファイル`heroes-list.component.html`を見つけて、プレースホルダーの内容を以下のHTMLに置き換えます。

<docs-code header="heroes-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/heroes-list/heroes-list.component.html"/>

1. コードエディターで、ファイル`app.component.html`を開き、その内容を以下のHTMLに置き換えます。

<docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" region="setup"/>

1. 新しいアプリケーションが期待どおりに動作することを確認するには、`ng serve`コマンドを実行します。

```shell
ng serve
```

1. ブラウザで`http://localhost:4200`を開きます。

   タイトルと2つのコンポーネントのHTMLで構成される単一のWebページが表示されるはずです。

## ルートを定義する {#define-your-routes}

このセクションでは、2つのルートを定義します。

- ルート`/crisis-center`は`crisis-center`コンポーネントを開きます。
- ルート`/heroes-list`は`heroes-list`コンポーネントを開きます。

ルート定義はJavaScriptオブジェクトです。
各ルートには通常2つのプロパティがあります。
最初のプロパティである`path`は、ルートのURLパスを指定する文字列です。
2番目のプロパティである`component`は、アプリケーションがそのパスに表示すべきコンポーネントを指定する文字列です。

1. コードエディターから、`app.routes.ts`ファイルを作成して開きます。
1. アプリケーションのルートリストを作成してエクスポートします。

   ```ts
   import {Routes} from '@angular/router';

   export const routes = [];
   ```

1. 最初の2つのコンポーネントに2つのルートを追加します。

   ```ts
   {path: 'crisis-list', component: CrisisListComponent},
   {path: 'heroes-list', component: HeroesListComponent},
   ```

このルートリストはJavaScriptオブジェクトの配列であり、各オブジェクトがルートのプロパティを定義しています。

## `@angular/router`から`provideRouter`をインポートする {#import-providerouter-from-angularrouter}

ルーティングを使用すると、URLパスに応じてアプリケーションの特定のビューを表示できます。
この機能をサンプルアプリケーションに追加するには、`app.config.ts`ファイルを更新して、ルータープロバイダー関数である`provideRouter`を使用する必要があります。
このプロバイダー関数は`@angular/router`からインポートします。

1. コードエディターで`app.config.ts`ファイルを開きます。
1. 次のインポートステートメントを追加します。

   ```ts
   import { provideRouter } from '@angular/router';
   import { routes } from './app.routes';
   ```

1. `appConfig`のプロバイダーを更新します。

   ```ts
   providers: [provideRouter(routes)]
   ```

`NgModule`ベースのアプリケーションの場合、`provideRouter`は`AppModule`の`providers`リスト、またはアプリケーションで`bootstrapModule`に渡されるモジュールに配置します。

## `router-outlet`を使ってコンポーネントを更新する {#update-your-component-with-router-outlet}

この時点で、アプリケーションに2つのルートを定義しました。
しかし、アプリケーションの`app.component.html`テンプレートには、`crisis-list`と`heroes-list`の両コンポーネントがまだハードコードされています。
ルートが機能するためには、URLパスに基づいてコンポーネントを動的にロードするようにテンプレートを更新する必要があります。

この機能を実装するには、テンプレートファイルに`router-outlet`ディレクティブを追加します。

1. コードエディターで`app.component.html`ファイルを開きます。
1. 以下の行を削除します。

<docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" region="components"/>

1. `router-outlet`ディレクティブを追加します。

<docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" region="router-outlet"/>

1. `app.component.ts`の`AppComponent`のインポートに`RouterOutlet`を追加します。

   ```ts
   imports: [RouterOutlet],
   ```

更新されたアプリケーションをブラウザで表示します。
アプリケーションのタイトルのみが表示されるはずです。
`crisis-list`コンポーネントを表示するには、ブラウザのアドレスバーのパスの末尾に`crisis-list`を追加します。
例:

<docs-code language="http">
http://localhost:4200/crisis-list
</docs-code>

`crisis-list`コンポーネントが表示されることに注目してください。
Angularは、定義したルートを使用してコンポーネントを動的にロードしています。
同じ方法で`heroes-list`コンポーネントをロードできます。

<docs-code language="http">
http://localhost:4200/heroes-list
</docs-code>

## UI要素でナビゲーションを制御する {#control-navigation-with-ui-elements}

現在、アプリケーションは2つのルートをサポートしています。
しかし、これらのルートを使用する唯一の方法は、ユーザーがブラウザのアドレスバーにパスを手動で入力することです。
このセクションでは、ユーザーがクリックして`heroes-list`コンポーネントと`crisis-list`コンポーネント間を移動できる2つのリンクを追加します。
また、いくつかのCSSスタイルも追加します。
これらのスタイルは必須ではありませんが、現在表示されているコンポーネントのリンクを識別しやすくします。
この機能は次のセクションで追加します。

1. `app.component.html`ファイルを開き、タイトルの下に以下のHTMLを追加します。

   <docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" region="nav"/>

   このHTMLはAngularディレクティブである`routerLink`を使用しています。
   このディレクティブは、定義したルートをテンプレートファイルに接続します。

1. `app.component.ts`の`AppComponent`のimportsリストに`RouterLink`ディレクティブを追加します。

1. `app.component.css`ファイルを開き、以下のスタイルを追加します。

<docs-code header="app.component.css" path="adev/src/content/examples/router-tutorial/src/app/app.component.css"/>

ブラウザでアプリケーションを表示すると、これら2つのリンクが表示されるはずです。
リンクをクリックすると、対応するコンポーネントが表示されます。

## アクティブルートの特定 {#identify-the-active-route}

ユーザーは前のセクションで追加したリンクを使用してアプリケーションをナビゲートできますが、アクティブルートが何かを特定する簡単な方法がありません。
Angularの`routerLinkActive`ディレクティブを使用してこの機能を追加します。

1. コードエディターで、`app.component.html`ファイルを開きます。
1. アンカータグを更新して、`routerLinkActive`ディレクティブを含めるようにします。

<docs-code header="app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" region="routeractivelink"/>

1. `app.component.ts`の`AppComponent`の`imports`リストに`RouterLinkActive`ディレクティブを追加します。

アプリケーションを再度表示します。
いずれかのボタンをクリックすると、そのボタンのスタイルが自動的に更新され、アクティブなコンポーネントをユーザーに特定します。
`routerLinkActive`ディレクティブを追加することで、アプリケーションに特定のCSSクラスをアクティブルートに適用するよう指示します。
このチュートリアルでは、そのCSSクラスは`activebutton`ですが、好きな任意のクラスを使用できます。

Note: `routerLinkActive`の`ariaCurrentWhenActive`に値を指定していることにも注意してください。これにより、視覚に障がいのあるユーザー（適用されている異なるスタイルを認識できない可能性のあるユーザー）もアクティブなボタンを特定できます。詳細については、アクセシビリティのベストプラクティス[アクティブリンクの識別セクション](/best-practices/a11y#active-links-identification)を参照してください。

## リダイレクトの追加 {#adding-a-redirect}

このチュートリアルのステップでは、ユーザーを`/heroes-list`コンポーネントの表示にリダイレクトするルートを追加します。

1. コードエディターで`app.routes.ts`ファイルを開きます。
1. `routes`セクションを次のように更新します。

   ```ts
   {path: '', redirectTo: '/heroes-list', pathMatch: 'full'},
   ```

   この新しいルートは、パスとして空の文字列を使用していることに注意してください。
   さらに、`component`プロパティを2つの新しいプロパティに置き換えます。

   | プロパティ   | 詳細                                                                                                                                                                                                                                                                          |
   | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `redirectTo` | このプロパティは、Angularに空のパスから`heroes-list`パスへのリダイレクトを指示します。                                                                                                                                                                                        |
   | `pathMatch`  | このプロパティは、AngularにURLのどの部分を一致させるかを指示します。このチュートリアルでは、このプロパティを`full`に設定する必要があります。この戦略は、パスに空の文字列がある場合に推奨されます。このプロパティの詳細については、[Route API documentation](api/router/Route)を参照してください。 |

これでアプリケーションを開くと、デフォルトで`heroes-list`コンポーネントが表示されます。

## 404ページを追加する {#adding-a-404-page}

ユーザーが未定義のルートにアクセスしようとする可能性があります。
この動作に対応するには、404ページを表示するのがベストプラクティスです。
このセクションでは、404ページを作成し、未指定のルートに対してそのページを表示するようにルート設定を更新します。

1. ターミナルから、新しいコンポーネント`PageNotFound`を作成します。

```shell
ng generate component page-not-found
```

1. コードエディターで、`page-not-found.component.html`ファイルを開き、その内容を以下のHTMLに置き換えます。

<docs-code header="page-not-found.component.html" path="adev/src/content/examples/router-tutorial/src/app/page-not-found/page-not-found.component.html"/>

1. `app.routes.ts`ファイルを開き、以下のルートをルートリストに追加します。

   ```ts
   {path: '**', component: PageNotFoundComponent}
   ```

   新しいルートはパス`**`を使用します。
   このパスは、Angularがワイルドカードルートを識別する方法です。
   設定内の既存のルートと一致しないルートは、すべてこのルートを使用します。

IMPORTANT: ワイルドカードルートが配列の最後に配置されていることに注意してください。
Angularはルートを順番に適用し、最初に見つかった一致を使用するため、ルートの順序は重要です。

`http://localhost:4200/powers`のような、アプリケーション上に存在しないルートに移動してみてください。
このルートは、`app.routes.ts`ファイルで定義されているものと一致しません。
しかし、ワイルドカードルートを定義したため、アプリケーションは自動的に`PageNotFound`コンポーネントを表示します。

## 次のステップ {#next-steps}

この時点で、Angularのルーティング機能を使用して、URLアドレスに基づいてユーザーが見ることができるコンポーネントを変更する基本的なアプリケーションができています。
これらの機能を拡張して、リダイレクトや、カスタムの404ページを表示するためのワイルドカードルートを含めました。

ルーティングの詳細については、以下のトピックを参照してください。

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="アプリ内ルーティングとナビゲーション"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>
