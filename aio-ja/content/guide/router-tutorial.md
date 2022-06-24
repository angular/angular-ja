# シングルページアプリケーションにおける Angular routes の使用

このチュートリアルでは、複数の Angular routes を使用する単一ページのアプリケーションである SPA を構築する方法について説明します。

シングルページアプリケーション \(SPA\) では、アプリケーションのすべての機能が単一の HTML ページ内に存在します。
ユーザーがアプリケーションの機能にアクセスすると、ブラウザはページを新たにロードせずに、ユーザーにとって重要な部分だけをレンダリングする必要があります。
このパターンにより、アプリケーションの UX(ユーザー体験) を大幅に向上させることができます。

ユーザーがアプリケーション内を移動する方法を定義するには、routes を使用します。
routes を追加すると、ユーザーがアプリケーションのある箇所から別の箇所に移動する方法を定義できます。
また、予期しない動作や許可されない動作から保護するために routes を設定することもできます。

このチュートリアルの内容を使用したアプリケーションの例として、<live-example></live-example> を参照してください。

## 目標

*   サンプル・アプリケーションの機能をモジュールに整理します。
*   コンポーネントへの移動方法を定義します。
*   パラメータを使用してコンポーネントに情報を渡します。
*   複数の routes をネストして routes を構築します。
*   ユーザーが routes にアクセスできるかどうかを確認します。
*   アプリケーションが未保存の変更を破棄できるかを制御します。
*   ルートデータを事前にフェッチして機能のモジュールを遅延ロードすることで、パフォーマンスを向上させます。
*   コンポーネントをロードするために特定の基準を要求します。

## 前提条件

このチュートリアルを完了するには、次の基本的な概念を理解している必要があります。

*   JavaScript
*   HTML
*   CSS
*   [Angular CLI](cli)

[Tour of Heroes tutorial](/tutorial) は役に立つかもしれませんが、必須ではありません。

## サンプル・アプリケーションを作成する

Angular CLI を使用して、新しいアプリケーション *angular-router-sample* を作成します。
このアプリケーションには、 *crisis-list* と *heroes-list* の 2 つのコンポーネントがあります。

1.  新しい Angular プロジェクト *angular-router-sample* を作成します。

    <code-example format="shell" language="shell">

    ng new angular-router-sample

    </code-example>

   `Would you like to add Angular routing?` というメッセージが表示された場合、`N` を選択します。

   `Which stylesheet format would you like to use?` というメッセージが表示された場合、`CSS` を選択します。

   しばらくすると、新しいプロジェクト `angular-router-sample` が完成します。

1.  ターミナルから `angular-router-sample` ディレクトリに移動します。
1.  コンポーネント *crisis-list* を作成します。

    <code-example format="shell" language="shell">

    ng generate component crisis-list

    </code-example>

1.  コードエディタでファイル `crisis-list.component.html` を探して、プレースホルダの内容を次の HTML に置き換えます。

    <code-example header="src/app/crisis-list/crisis-list.component.html" path="router-tutorial/src/app/crisis-list/crisis-list.component.html"></code-example>

1.  2番目のコンポーネント *heroes-list* を作成します。

    <code-example format="shell" language="shell">

    ng generate component heroes-list

    </code-example>

1.  コードエディタでファイル `heroes-list.component.html` を探して、プレースホルダの内容を次の HTML に置き換えます。

    <code-example header="src/app/heroes-list/heroes-list.component.html" path="router-tutorial/src/app/heroes-list/heroes-list.component.html"></code-example>

1.  コードエディタで `app.component.html` ファイルを開いて、内容を次のHTMLに置き換えます。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="setup"></code-example>

1. `ng service` コマンドを実行して、新しいアプリケーションが正常に動作していることを確認します。

    <code-example format="shell" language="shell">

    ng serve

    </code-example>

1.  ブラウザで `http://localhost:4200` を開きます。

    タイトルと 2 つのコンポーネントからなる HTML で構成される単一の Web ページが表示されます。

## `@angular/router` から `RouterModule` をインポートする

ルーティングを使用すると、URL のパスに応じてアプリケーションの特定のビューを表示できます。
この機能をサンプル・アプリケーションに追加するには、`app.module.ts` を更新して `RouterModule` を利用できるようにする必要があります。
このモジュールは `@angular/router` からインポートします。

1.  コードエディタで `app.module.ts` を開きます。
1.  次の `import` 文を追加します。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="router-import"></code-example>

## 独自に routes を定義する

このセクションでは、次の 2 つの routes を定義します。

*   routes `/crisis-center` は `crisis-center` コンポーネントを開きます。
*   routes `/heroes-list` は `heroes-list` コンポーネントを開きます。

routes の定義は JavaScript のオブジェクトです。
通常、各々の routes には 2 つのプロパティがあります。
最初のプロパティ `path` は routes の URL パスを指定する文字列です。
2 番目のプロパティ `component` は、そのパスに対してアプリケーションが表示するコンポーネントです。

1.  コードエディタで `app.module.ts` を開きます。
1.  `@NgModule ()` のセクションを探します。
1.  そのセクションの `imports` の配列を次のように置き換えます。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="import-basic"></code-example>

このコードは `RouterModule` を `imports` の配列に追加します。
次に、コードは `RouterModule` の `forRoot()` メソッドを使用して 2 つの routes を定義します。
このメソッドは JavaScript のオブジェクトの配列をとり、各オブジェクトは routes のプロパティを定義します。
`forRoot()` メソッドは、アプリケーションが 1 つの `RouterModule` のみをインスタンス化することを保証します。
詳細は [Singleton Services](guide/singleton-services#forroot-and-the-router) を参照してください。

## コンポーネントを `router-outlet` で更新する

この時点で、アプリケーションに 2 つの routes を定義しました。
ただし、アプリケーションでは、単一のテンプレート `app.component.html` に `crisis-list` コンポーネントと `heroes-list` コンポーネントの両方がハードコーディングされています。
routes が正しく動作するには、テンプレートを更新して、URL パスに基づいてコンポーネントを動的にロードする必要があります。

この機能を実装するには、テンプレートファイルに `router-outlet` ディレクティブを追加します。

1.  コードエディタで `app.component.html` ファイルを開きます。
1.  次の行を削除します。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="components"></code-example>

1.  `router-outlet` ディレクティブを追加します。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="router-outlet"></code-example>

更新したアプリケーションをブラウザで表示します。
アプリケーションのタイトルのみが表示されます。
`crisis-list` コンポーネントを表示するには、ブラウザのパスの末尾に `crisis-list` を追加します。
たとえば、次のようにします。

<code-example format="https" language="https">

http://localhost:4200/crisis-list

</code-example>

`crisis-list` コンポーネントが表示されます。
Angular はコンポーネントを動的にロードするために、定義した routes を使用します。
`heroes-list` コンポーネントも同様にロードできます。

<code-example format="https" language="https">

http://localhost:4200/heroes-list

</code-example>

## UI 要素によるナビゲーションの制御

現在、アプリケーションは 2 つの routes をサポートしています。
ただし、これらの routes を使用する唯一の方法は、ユーザーがブラウザのアドレスバーに手動でパスを入力することです。
ここでは、ユーザーが `heroes-list` コンポーネントと `crisis-list` コンポーネント間を移動するためにクリックできる 2 つのリンクを追加します。
また、CSS スタイルもいくつか追加します。
これらのスタイルは必須ではありませんが、現在表示されているコンポーネントのリンクを簡単に識別できます。
この機能は、次のセクションで追加します。

1. `app.component.html` ファイルを開き、タイトルの下に次の HTML を追加します。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="nav"></code-example>

   この HTML は Angular ディレクティブ `routerLink` を使用しています。
   このディレクティブは、定義した routes をテンプレートファイルに結びつけます。

1.  `app.component.css` を開いて、次のスタイルを追加します。

    <code-example header="src/app/app.component.css" path="router-tutorial/src/app/app.component.css"></code-example>

ブラウザでアプリケーションを表示すると、次の 2 つのリンクが表示されます。
リンクをクリックすると、対応するコンポーネントが表示されます。

## アクティブな routes を特定する

ユーザーは前のセクションで追加したリンクを使用してアプリケーションをナビゲートできますが、アクティブな routes を識別する簡単な方法はありません。
この機能は Angular の`routerLinkActive` ディレクティブで追加することができます。

1.  コードエディタで `app.component.html` ファイルを開きます。
1.  アンカータグを更新して、`routerLinkActive` ディレクティブを入力します。

    <code-example header="src/app/app.component.html" path="router-tutorial/src/app/app.component.html" region="routeractivelink"></code-example>

アプリケーションを再度表示します。
いずれかのボタンをクリックすると、そのボタンのスタイルが自動的に更新され、アクティブなコンポーネントがユーザーに示されます。
`routerLinkActive` ディレクティブを追加することで、アプリケーションに特定の CSS クラスをアクティブな routes に適用するように指示します。
このチュートリアルでは、その CSS クラスは`activebutton` ですが、任意のクラスを使用できます。

Note that we are also specifying a value for the `routerLinkActive`'s `ariaCurrentWhenActive`. This makes sure that visually impaired users (which may not perceive the different styling being applied) can also identify the active button. For more information see the Accessibility Best Practices [Active links identification section](/guide/accessibility#active-links-identification).
## リダイレクトの追加

チュートリアルの手順では、`/heroes-list` コンポーネントを表示するようにユーザーをリダイレクトする routes を追加します。

1.  コードエディタで `app.module.ts` を開きます。
1.  `imports` 配列の `RouterModule` セクションを次のように更新します。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="import-redirect"></code-example>

    この新しい route は、パスとして空の文字列を使用することに注意してください。
    さらに、 `component` プロパティを 2 つの新しいプロパティに置き換えます。

    | プロパティ     | 詳細 |
    |:---          |:---     |
    | `redirectTo` | このプロパティは、空のパスから `heroes-list` パスにリダイレクトするように Angular に指示します。                                                                                                                                                                               |
    | `pathMatch`  | このプロパティは、どの程度 URL をマッチさせるかを Angular に指示します。このチュートリアルでは、このプロパティを `full` に設定する必要があります。この方法は、パスに空の文字列がある場合にお勧めします。このプロパティの詳細については、[Route API documentation](/api/router/Route) を参照してください。 |

アプリケーションを開くと、デフォルトで `heroes-list` コンポーネントが表示されます。

## 404 ページの追加

ユーザーが定義されていない route にアクセスしようとする可能性があります。
この動作に対しては 404 ページを表示することをお勧めします。
このセクションでは、404 ページを作成して、未指定のルートのページを表示するように ルートの設定を更新します。

1.  ターミナルから、新しいコンポーネント `PageNotFound` を作成します。

    <code-example format="shell" language="shell">

    ng generate component page-not-found

    </code-example>

1.  コードエディタで `page-not-found.component.html` ファイルを開き、その内容を次のHTMLに置き換えます。

    <code-example header="src/app/page-not-found/page-not-found.component.html" path="router-tutorial/src/app/page-not-found/page-not-found.component.html"></code-example>

1.  `app.module.ts` を開きます。
    `imports` 配列の `RouterModule` セクションを次のように更新します。

    <code-example header="src/app/app.module.ts" path="router-tutorial/src/app/app.module.ts" region="import-wildcard"></code-example>

    新しいルートはパス `**` を使用します。
    このパスは Angular がワイルドカードルートを識別する方法です。
    設定内の既存のルートと一致しないルートはすべて、このルートを使用します。

    <div class="alert is-important">

    ワイルドカードルートが配列の最後に配置されていることに注目してください。
    Angular は順番にルートを適用し、最初に見つかったマッチを使うので、ルートの順番は重要です。

    </div>

アプリケーション上の存在しないルート (`http://localhost:4200/powers` 等) に移動してみてください。
このルートは `app.module.ts` に定義されているものと一致しません。
しかし、あなたがワイルドカードルートを定義すると、アプリケーションは自動的に `PageNotFound` コンポーネントを表示します。

## 次のステップ

この時点で、Angular のルーティング機能を用いながら、URL アドレスに基づいてユーザーが見ることができるコンポーネントを変更する基本的なアプリケーションが完成しています。
また、これらの機能を拡張して、リダイレクトと 404 ページを表示するワイルドカードのルートを追加しました。

ルーティングの詳細については、次のトピックを参照してください。

*   [In-app Routing and Navigation](guide/router)
*   [Router API](api/router)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
