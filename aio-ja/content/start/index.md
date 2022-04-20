# 基本的なAngularアプリケーションをはじめる

Angularへようこそ！

このチュートリアルでは、カタログ、ショッピングカート、チェックアウトフォームを備えたシンプルなeコマースサイトを順を追って説明し、Angularの要点を紹介します。

すぐに始められるように、このガイドでは[StackBlitz](https://stackblitz.com/)上で（[ローカル環境のセットアップ](guide/setup-local "Setup guide")の必要なく）インタラクティブに調べて変更できる既製のシンプルなアプリケーションを使用します。
StackBlitzは、さまざまな技術を使ってプロジェクトを作成・保存・共有できるブラウザベースの開発環境です。

## 前提条件

このチュートリアルを最大限に活用するには、次の基本的な知識が必要です。

* [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML "Learning HTML: Guides and tutorials")
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "JavaScript")
* [TypeScript](https://www.typescriptlang.org/ "TypeScript documentation")

<a id="components"></a>

## サンプルアプリケーションの見学

Angularアプリケーションはコンポーネントを使って構築します。
コンポーネントはUIの中で責任のある領域を定義し、UIの機能を再利用できるようにします。

コンポーネントは3つの要素で構成されています。

|                           | Details |
|:---                       |:---     |
| **コンポーネントクラス** | データと機能を扱う|
| **HTML テンプレート** | UI を決定する |
| **コンポーネント固有のスタイル** | ルックアンドフィールを定義する|

このガイドでは、コンポーネントを使用してアプリケーションを構築する方法を説明します。

| Components             | Details |
|:---                    |:---     |
| `<app-root>` | 最初にロードするコンポーネントで、他のコンポーネントのためのコンテナ |
| `<app-top-bar>` | ストア名とチェックアウトボタン |
| `<app-product-list>` | 商品リスト |
| `<app-product-alerts>` | アプリケーションのアラートを含むコンポーネント |

<div class="lightbox">

<img alt="Online store with three components" src="generated/images/guide/start/app-components.png">

</div>

コンポーネントについては、[コンポーネント入門](guide/architecture-components "Introduction to Components and Templates")を参照してください。

<a id="new-project"></a>

## Create the sample project

サンプルプロジェクトを作成するには、<live-example name="getting-started-v0" noDownload>既製のサンプルプロジェクトをStackBlitz</live-example>で生成します。
作業を保存するには

1. StackBlitzにログインします。
1. 生成したプロジェクトをフォークします。
1. 定期的に保存します。

<div class="lightbox">

<img alt="Fork the project" src="generated/images/guide/start/fork-the-project.png">

</div>

StackBlitzでは、右側のプレビューペインにサンプルアプリケーションの起動状態が表示されます。
プレビューには2つの領域があります。

* トップバーにはストア名が表示され、*My Store*とチェックアウトボタンがあります。
* 製品リストのヘッダ、*Products*。

<div class="lightbox">

<img alt="Starter online store application" src="generated/images/guide/start/new-app-all.gif">

</div>

左側のプロジェクトセクションには、インフラストラクチャファイルや設定ファイルなど、アプリケーションを構成するソースファイルが表示されています。

チュートリアルに含まれる StackBlitz のサンプルアプリケーションを作成すると、StackBlitz がスターターファイルとモックデータを作成してくれます。
チュートリアルで使用するファイルは `src` フォルダにあります。

StackBlitzの使い方については、[StackBlitz documentation](https://developer.stackblitz.com/docs/platform/)を参照してください。

<a id="product-list"></a>

## 商品リストを作成する

このセクションでは、アプリケーションを更新して製品の一覧を表示するようにします。
`product.ts`のファイルの定義済みの商品データと `product-list.component.ts` ファイルのメソッドを使用します。
この節では、テンプレートとも呼ばれるHTMLの編集方法を説明します。

1.  `product-list`フォルダ内のテンプレートファイル `product-list.component.html` を開く。

1.  次のように `<div>` に `*ngFor` 構造ディレクティブを追加する。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="ngfor"></code-example>

    `ngFor` を使うと、`<div>` はリスト内の各商品に対して繰り返し実行されます。

    構造ディレクティブは、要素の追加、削除、操作によって DOM の構造を形成したり、再構築したりします。
    構造ディレクティブについての詳細は [構造ディレクティブ](guide/structural-directives)を参照してください。

1.  `<div>` の中に `<h3>` と `{{ product.name }}` を追加する。
    この `{{ product.name }}` 文は Angular の補間構文の例です。
    補間 `{{{ }}` は、プロパティの値をテキストとしてレンダリングします。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="interpolation"></code-example>

    プレビューペインが更新され、リスト内の各商品名が表示されます。

    <div class="lightbox">

    <img alt="Product names added to list" src="generated/images/guide/start/template-syntax-product-names.png">

    </div>

1.  各商品名を商品詳細へのリンクにするには、`{{ product.name }}` の周りに `<a>` 要素を追加します。

1.  次のように、プロパティバインディング `[ ]` 構文を用いて、タイトルを商品名に設定します。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html"></code-example>

    プレビューペインで商品名にカーソルを合わせると、商品名に "details "という単語を加えた名前のプロパティ値が表示されます。
    プロパティバインディング `[ ]` を使用すると、テンプレート式の中でプロパティ値を使用することができます。

    <div class="lightbox">

    <img alt="Product name anchor text is product name property" src="generated/images/guide/start/template-syntax-product-anchor.png">

    </div>

1.  製品の説明を追加します。
    `<p>` 要素では、`*ngIf` ディレクティブを使用して、現在の商品に説明がある場合にのみ `<p>` 要素を作成するようにします。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.3.html"></code-example>

    アプリケーションは、リスト内の各製品の名前と説明を表示するようになりました。
    最終的な製品には説明の段落がないことに注意してください。
    商品の説明プロパティが空なので、Angularは `<p>` 要素を作成しません。

    <div class="lightbox">

    <img alt="Product descriptions added to list" src="generated/images/guide/start/template-syntax-product-description.png">

    </div>

1.  ユーザーが商品を共有できるようにボタンを追加する。
    ボタンの `click` イベントを `product-list.component.ts` の `share()` メソッドにバインドします。
    イベントバインディングでは、`<button>` 要素の `(click)` イベントのように、イベントの周りに括弧 `( )` を使用します。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.4.html"></code-example>

    各商品に**Share**ボタンが追加されました。

    <div class="lightbox">

    <img alt="Share button added for each product" src="generated/images/guide/start/template-syntax-product-share-button.png">

    </div>

    **Share**ボタンをクリックすると、"The product has been shared!"というアラートが表示されます。

    <div class="lightbox">

    <img alt="Alert box indicating product has been shared" src="generated/images/guide/start/template-syntax-product-share-alert.png">

    </div>

テンプレートの編集では、Angularテンプレートのもっとも一般的な機能のいくつかを探ってきました。
詳しくは、[コンポーネントとテンプレート入門](guide/architecture-components#template-syntax "Template Syntax")を参照してください。

<a id="passing-data-in"></a>

## 子コンポーネントにデータを渡す

現在のところ、商品リストには各商品の名前と説明が表示されています。
`ProductListComponent` はまた、`products.ts` の `products` 配列からインポートしたデータを含む `products` プロパティを定義しています。

次のステップは、`ProductListComponent`から商品データを利用する新しいアラート機能を作成することです。
このアラートは商品の価格をチェックし、価格が700ドル以上の場合は、**Notify Me**ボタンを表示し、商品が販売されたときに通知を受けるために登録できるようにします。

このセクションでは、親コンポーネントである `ProductListComponent` からデータを受け取ることができる子コンポーネント `ProductAlertsComponent` を作成する方法を説明します。

1.  現在のターミナルの上にあるプラス記号をクリックすると、コンポーネントを生成するためのコマンドを実行するための新しいターミナルが作成されます。

    <div class="lightbox">

    <img alt="StackBlitz command to generate component" src="generated/images/guide/start/create-new-terminal.png">

    </div>

1.  新しいターミナルで、次のコマンドを実行して、`product-alerts`という名前の新しいコンポーネントを生成してください。

    <code-example format="shell" language="shell">

    ng generate component product-alerts
  
    </code-example>

    ジェネレーターは、コンポーネントの3つの部分のスターターファイルを作成します。

    *   `product-alerts.component.ts`
    *   `product-alerts.component.html`
    *   `product-alerts.component.css`

1.  `product-alerts.component.ts` を開く。
    `@Component()`デコレーターは、次のクラスがコンポーネントであることを示します。
    また、`@Component()` は、セレクター、テンプレート、スタイルなど、コンポーネントに関するメタデータを提供します。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="as-generated"></code-example>

    `Component()`の主な特徴は次のとおりである。

    *   `app-product-alerts`という`selector` はコンポーネントを識別します。
        慣例では、Angularのコンポーネントセレクターは接頭辞 `app-` で始まり、その後にコンポーネント名が続きます。
    
    *   テンプレートとスタイルのファイル名は、コンポーネントのHTMLとCSSを参照します。
    *   `@Component()`定義は、コンポーネントの機能を処理するクラス `ProductAlertsComponent`もエクスポートします。

1.   商品データを受け取るために `ProductAlertsComponent` を設定するには、まず `@angular/core` から `Input` をインポートします。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="imports"></code-example>

1.  `ProductAlertsComponent` クラスの定義で、`product` という名前のプロパティに `@Input()` デコレーターを付けて定義します。
    この `@Input()` デコレーターは、プロパティの値がコンポーネントの親である `ProductListComponent` から渡されることを示します。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="input-decorator"></code-example>

1.  `product-alerts.component.html`を開き、プレースホルダの段落を、製品価格が$700以上の場合に表示される**Notify Me**ボタンに置き換えます。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.1.html"></code-example>

1.  ジェネレーターは自動的に `AppModule` に `ProductAlertsComponent` を追加し、アプリケーション内の他のコンポーネントが利用できるようにしました。

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="declare-product-alerts"></code-example>
  
1.  `ProductListComponent` の子として `ProductAlertsComponent` を表示するには、`product-list.component.html` に `<app-product-alerts>` 要素を追加します。
    プロパティバインディングを使用して、現在の製品を入力としてコンポーネントに渡します。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.5.html" region="app-product-alerts"></code-example>

新しい商品アラートコンポーネントは、商品リストからの入力として商品を受け取ります。
この入力を使用して、製品の価格に基づいて **Notify Me** ボタンを表示または非表示にします。
Phone XL の価格は 700 ドル以上なので、**Notify Me** ボタンはその製品に表示されます。

<div class="lightbox">

<img alt="Product alert button added to products over $700" src="generated/images/guide/start/product-alert-button.png">

</div>

<a id="output"></a>

## 親コンポーネントにデータを渡す

**Notify Me**ボタンを動作させるには、子コンポーネントが通知して親コンポーネントにデータを渡す必要があります。
`ProductAlertsComponent`はユーザーが**Notify Me**をクリックしたときにイベントを発生させ、`ProductListComponent`はそのイベントに応答する必要があります。

  <div class="alert is-helpful">

  新しいコンポーネントには、Angular Generator が空の `constructor()`、`OnInit` インターフェース、`ngOnInit()` メソッドを含めます。
  このステップではこれらを使用しないので、次のコード例では簡潔にするために省略しています。

  </div>

1.  `product-alerts.component.ts` で、`@angular/core` から `Output` と `EventEmitter` をインポートします。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.ts" region="imports"></code-example>

1.  コンポーネントクラスで、`notify` という名前のプロパティを `@Output()` デコレーターと `EventEmitter()` のインスタンスで定義します。
    `ProductAlertsComponent`を `@Output()` で設定することで、`ProductAlertsComponent`が `notify` プロパティの値が変更されたときにイベントを発行することができます。

    <code-example path="getting-started/src/app/product-alerts/product-alerts.component.ts" header="src/app/product-alerts/product-alerts.component.ts" region="input-output"></code-example>

1.  `product-alerts.component.html`で、**Notify Me**ボタンをイベントバインディングで更新し、`notify.emit()`メソッドを呼び出すようにします。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.html"></code-example>

1.  ユーザーがボタンをクリックしたときの動作を定義します。
    親の `ProductListComponent`—`ProductAlertsComponent`ではなく—は、`ProductAlertsComponent`がイベントを発生させたときに動作します。
    `product-list.component.ts` で `onNotify()` メソッドを定義します。

    <code-example header="src/app/product-list/product-list.component.ts" path="getting-started/src/app/product-list/product-list.component.ts" region="on-notify"></code-example>

1.  `ProductAlertsComponent`からデータを受け取るように `ProductListComponent` を更新する。

    `product-list.component.html` で、`<app-product-alerts>` を製品リストコンポーネントの `onNotify()` メソッドにバインドする。
    `<app-product-alerts>` は **Notify Me** ボタンを表示するものです。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.6.html" region="on-notify"></code-example>

1.  **Notify Me**ボタンをクリックすると、"You will be notified when the product goes on sale"というアラートが表示されます。

    <div class="lightbox">

    <img alt="Product alert notification confirmation dialog" src="generated/images/guide/start/product-alert-notification.png">

    </div>

コンポーネント間の通信については、[Component Interaction](guide/component-interaction "Component interaction")を参照してください。

<a id="whats-next"></a>

## 次は何をするの？

このセクションでは、データを反復処理し、互いに通信するコンポーネントを特徴とするアプリケーションを作成しました。

Angularの探索を続け、このアプリケーションを開発するには、次の手順にしたがってください。

*   製品の詳細ページを作成するには、[アプリ内ナビゲーション](start/start-routing "Getting started: In-app navigation")に進みます。
*   [デプロイ](start/start-deployment "Getting started: Deployment")にスキップしてローカル開発に移行したり、Firebaseや独自のサーバーにアプリケーションをデプロイしたりします。

@reviewed 2022-02-28
