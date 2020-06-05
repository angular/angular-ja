# パート1：基本的なAngularアプリをはじめる

Angularへようこそ！

このチュートリアルでは、カタログ、ショッピングカート、チェックアウトフォームを備えたシンプルなeコマースサイトを順を追って説明し、Angularの要点を紹介します。
すぐに始められるように、このガイドでは（[ローカル環境のセットアップ](guide/setup-local "Setup guide")の必要なく）インタラクティブに調べて変更できる既製のシンプルなアプリケーションを使用します。

<div class="callout is-helpful">
<header>Web開発は初めてですか？</header>

Angularのドキュメントを補完するための多くのリソースがあります。 MozillaのMDNドキュメントには[HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML "Learning HTML: Guides and tutorials")と[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "JavaScript")の両方の紹介が含まれています。 [TypeScriptのドキュメント](https://www.typescriptlang.org/docs/home.html "TypeScript documentation")には5分間のチュートリアルが含まれています。 [Udemy](http://www.udemy.com "Udemy online courses")や[Codecademy](https://www.codecademy.com/ "Codecademy online courses")などのさまざまなオンラインコースプラットフォームもWeb開発の基本をカバーしています。

</div> 


{@a new-project}
## サンプルプロジェクトを作成する

<h4>
<live-example name="getting-started-v0" noDownload>StackBlitzで既製のサンプルプロジェクトを作成するためこちらをクリックしてください。</live-example> 
</h4>

<div class="lightbox">
  <img src="generated/images/guide/start/new-app-all.gif" alt="Starter online store app">
</div>

* 右側のプレビューペインには、サンプルのAngularアプリの開始状態が表示されます。
トップバー（ストア名とチェックアウトアイコンを含む）と製品リストのタイトル（アプリケーションからのデータが入力され、動的に更新されます）をもつフレームを明らかにします。

* 左側のプロジェクトペインには、すべてのインフラストラクチャファイルと構成ファイルを含む、アプリケーションを構成するソースファイルが表示されます。現在選択されているファイルは、中央のエディターペインに表示されます。

ソースの構造に入る前に、次のセクションでは提供されたサンプルデータを使用して、製品リストのHTML *テンプレート* を記入する方法を示します。
これにより、ページを動的に変更および更新することがどれほど簡単かが分かるでしょう。

<div class="callout is-helpful">
<header>StackBlitz tips</header>

* StackBlitzにログインすると、作業を保存して再開できます。 
GitHubアカウントをお持ちの場合は、
そのアカウントでStackBlitzにログインできます。
進行状況を保存するには、左上のForkボタンを使用してプロジェクトをフォークし、
Saveボタンをクリックして
自分のStackBlitzアカウントに作業を保存できます。
* このチュートリアルからコード例をコピーするには、
コード例ボックスの右上にあるアイコンをクリックしてから、
クリップボードのコードスニペットをStackBlitzに貼り付けます。
* StackBlitzのプレビューペインに期待したものが表示されない場合は、
保存してから更新ボタンをクリックします。
* StackBlitzは継続的に改善されているので、
生成されたコードにわずかな違いがあるかもしれませんが、
アプリの動作は同じになります。
* チュートリアルに付随するStackBlitzサンプルアプリを生成すると、
StackBlitzはスターターファイルと
モックデータを作成します。
チュートリアル全体で使用するファイルは、
StackBlitzサンプルアプリの `src`フォルダーにあります。

</div>

<div class="alert is-important">

[StackBlitzオンライン開発環境](https://stackblitz.com/)に直接移動し、[新しいAngularワークスペースを開始する](https://stackblitz.com/fork/angular)を選択すると、一般的なこの[例のサンプル](#new-project)ではなく汎用的なスタブアプリケーションが作られます。ここで基本的な概念に入門したあとは、Angularを学習しながらインタラクティブに作業するのに役立ちます。

実際の開発では、通常、[Angular CLI](guide/glossary#command-line-interface-cli) を使用します。これは、アプリケーションを生成および変更できる強力なコマンドラインツールです。CLIを使用して新しいプロジェクトとそのすべてのパーツを作成する方法を示す完全なステップバイステップガイドについては、[Tour of Heroesチュートリアル](tutorial) を参照してください。

</div>


{@a template-syntax}
## テンプレート構文

Angularのテンプレート構文はHTMLとJavaScriptを拡張します。
このセクションでは、"Products"エリアを実装しながらテンプレート構文を紹介します。

<div class="alert is-helpful">

作業を進めるために、次の手順では、 `products.ts`ファイル（StackBlitzのサンプルで作成済み）の定義済み製品データと` product-list.component.ts`ファイルのメソッドを使用します。

</div>

1.  `product-list`フォルダーで、テンプレートファイル`product-list.component.html`を開きます。

1. 製品リストのテンプレートを変更して製品名のリストを表示します。

    1. リスト内の各商品を同じように、ページ上に順番に表示するようにします。 定義済みの製品リストを反復するには、`*ngFor`ディレクティブを使用します。次に示すように、`*ngFor`ディレクティブを`<div>`に配置します。

      <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="ngfor">
      </code-example>

      `*ngFor` によってリスト内の各製品ごとに`<div>`が繰り返されます。

      <div class="alert is-helpful">

      `*ngFor`は"構造ディレクティブ"です。 構造ディレクティブは、通常、それらが関連付けられている要素を追加、削除、および操作することによって、DOMの構造を整形または再構成します。 アスタリスク `*` の付いたディレクティブはすべて構造ディレクティブです。

      </div>

    1. 製品の名前を表示するには、補間構文 {{ }} を使用します。 補間は、プロパティの値をテキストとしてレンダリングします。 `<div>`の中に、製品のnameプロパティを補間し表示するための`<h3>`見出しを追加します。

      <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html" region="interpolation">
      </code-example>

      プレビューペインがすぐに更新されて、リスト内の各製品の名前が表示されます。

      <div class="lightbox">
        <img src="generated/images/guide/start/template-syntax-product-names.png" alt="Product names added to list">
      </div>

1. 各商品名を商品詳細へのリンクにするには、次のように`<a>`要素を追加し、プロパティバインディング `[]` 構文を使用してそのタイトルを製品名に設定します。

    <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    プレビューペインで製品名の上にポインターを置いて、
    バインドされたnameプロパティの値を確認します。
    これは、製品名に「詳細」という単語を加えたものです。
    補間 `{{}}` では、プロパティの値をテキストとしてレンダリングできます。
    プロパティバインディング `[]`を使用すると、
    テンプレート式の中でプロパティ値を使用できます。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-anchor.png" alt="Product name anchor text is product name property">
    </div>

  
1. 商品の説明を追加しましょう。 `<p>`要素で`*ngIf`ディレクティブを使用して、現在の製品に説明がある場合にのみAngularが `<p>` 要素を作成するようにします。

    <code-example path="getting-started/src/app/product-list/product-list.component.3.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    アプリはリストに各商品の名前と説明を表示します。 最後の製品には説明文がまったくないことに注意してください。 商品のdescriptionプロパティが空なので、 Angularは`<p>`要素（"Description"という単語を含む）を作成しません。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-description.png" alt="Product descriptions added to list">
    </div>

1. ユーザーが商品を友人と共有できるようにボタンを追加します。 ボタンの`click`イベントを、（`product-list.component.ts`に）定義した`share()`メソッドに紐付けます。 イベントバインディングは次の `<button>` 要素のように、イベントを囲むカッコ `( )` を使用します。

    <code-example path="getting-started/src/app/product-list/product-list.component.4.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    各製品には"Share"ボタンがあります。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-button.png" alt="Share button added for each product">
    </div>

    "Share"ボタンをテストします。

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-alert.png" alt="Alert box indicating product has been shared">
    </div>

アプリは現在、製品リストと共有機能を持っています。
その過程で、Angularのテンプレート構文の5つの一般的な機能を使用する方法を学びました。
* `*ngFor`
* `*ngIf`
* 補間 `{{ }}`
* プロパティバインディング `[ ]`
* イベントバインディング `( )`


<div class="alert is-helpful">

Angularのテンプレート構文の全機能については、[コンポーネントとテンプレートのイントロダクション](guide/architecture-components#template-syntax "Template Syntax")を参照してください。

</div>


{@a components}
## コンポーネント

*コンポーネント*は、これらの一連のUI機能を再利用できるようにするための、
UI内の責任領域を定義します。
あなたはすでに製品リストコンポーネントを使ってこれを構築しました。

コンポーネントは3つの要素で構成されています。
* **コンポーネントクラス** では、データと機能を処理します。前のセクションでは、コンポーネントクラス内の製品データと`share()`メソッドはそれぞれデータと機能を処理しました。
* **HTMLテンプレート** では、UIを決定します。 前のセクションでは、商品リストのHTMLテンプレートを変更して、各商品の名前、説明、および"Share"ボタンを表示しました。
* **コンポーネント固有スタイル** では、ルック・アンド・フィールを定義します。 
商品リストにはスタイルは定義されていませんが、
ここにはコンポーネントCSSが存在します。

<!-- 
### クラス定義

製品リストコンポーネントのクラス定義を簡単に見てみましょう。

1. `product-list`ディレクトリで、`product-list.component.ts`を開きます。

1. `@Component`デコレーターに注目してください。 これにより、テンプレート、スタイル、セレクターなど、コンポーネントに関するメタデータが提供されます。

    * `selector`はコンポーネントを識別するために使われます。 セレクターは、ページ上にHTML要素としてレンダリングされるときにAngularコンポーネントに付ける名前です。 慣例により、Angularコンポーネントセレクターは `app-`のような接頭辞で始まり、その後にコンポーネント名が続きます。

    *テンプレートとスタイルのファイル名もここにあります。 慣例により、コンポーネントの各部分は別々のファイルにあり、すべて同じディレクトリにあり、同じプレフィックスが付いています。

1. コンポーネント定義には、コンポーネントの機能を処理するエクスポートクラスも含まれています。 ここが商品リストデータと `Share()`メソッドが定義されている場所です。

### 構成
-->

Angularアプリケーションはコンポーネントのツリーで構成され、各Angularコンポーネントには特定の目的と責任があります。

現在、サンプルアプリには3つのコンポーネントがあります。

<div class="lightbox">
  <img src="generated/images/guide/start/app-components.png" alt="Online store with three components">
</div>

* `app-root`（オレンジ色のボックス）はアプリケーションシェルです。 これは最初にロードするコンポーネントであり、他のすべてのコンポーネントの親です。 これをベースページと考えることができます。
* `app-top-bar`（青い背景）は店名とチェックアウトボタンです。
* `app-product-list`（紫色のボックス）は前のセクションで修正した製品リストです。

次のセクションでは、商品リストコンポーネントの子として新しいコンポーネント（商品アラート）を追加します。


<div class="alert is-helpful">

コンポーネントとそれらがテンプレートとどのように相互作用するかについての詳細は[コンポーネントのイントロダクション](guide/architecture-components "コンポーネントとテンプレートのイントロダクション")を参照してください。

</div>


{@a input}
## Input

現在、製品リストには各製品の名前と説明が表示されています。
商品リストコンポーネントは、`products.ts`の`products`配列からインポートした各商品のデータを含む `products`プロパティも定義しています。

次のステップは、新しいアラート機能を作成します。 アラート機能は製品を入力として受け取り、それから製品の価格をチェックします。 そして、価格が700ドル以上であるならば、製品が発売されたとき、ユーザーが通知にサインアップすることを可能にする "Notify Me" ボタンを表示します。

1. 新しい商品アラートコンポーネントを作成します。

    1. `app`フォルダを右クリックし、` Angular Generator`を使って `product-alerts`という名前の新しいコンポーネントを生成します。

        <div class="lightbox">
          <img src="generated/images/guide/start/generate-component.png" alt="StackBlitz command to generate component">
        </div>

        ジェネレータは、コンポーネントの3つの部分すべてに対してスターターファイルを作成します:
        * `product-alerts.component.ts`
        * `product-alerts.component.html`
        * `product-alerts.component.css`

1. `product-alerts.component.ts`を開きます。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="as-generated"></code-example>    

    1. `@Component()`デコレーターに注目してください。 これは、次のクラスがコンポーネントであることを示しています。 テンプレート、スタイル、セレクターなど、コンポーネントに関するメタデータを提供します。

        * `selector`はコンポーネントを識別します。 セレクターは、ページ上にHTML要素としてレンダリングされるときにAngularコンポーネントに付ける名前です。 慣例により、Angularコンポーネントセレクターは接頭辞 `app-`で始まり、その後にコンポーネント名が続きます。

        * テンプレートとスタイルのファイル名は、StackBlitzが生成したHTMLとCSSファイルを参照します。

    1. コンポーネント定義はクラス（`ProductAlertsComponent`）もエクスポートします。 これはコンポーネントの機能を処理します。

1. 入力として製品を受け取るように新しい製品アラートコンポーネントを設定します。

    1. `@angular/core`から`Input`をインポートしてください。

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="imports" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

    1. `ProductAlertsComponent`クラス定義で、`@Input()`デコレーターを使って`product`という名前のプロパティを定義します。 `@Input`デコレーターはプロパティ値がコンポーネントの親（この場合は商品リストコンポーネント）から渡されることを示します。

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="input-decorator" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

1. 新しい製品警告コンポーネントのビューを定義します。

    1. `product-alerts.component.html`テンプレートを開き、商品価格が700ドル以上の場合に表示される"Notify Me"ボタンでプレースホルダーの段落を置き換えます。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.1.html"></code-example>

1. 製品リストの子として新しい製品アラートコンポーネントを表示します。

    1. `product-list.component.html`を開きます。
    
    1. 新しいコンポーネントを含めるには、HTML要素と同じようにセレクター `app-product-alert`を使います。
    
    1. プロパティバインディングを使用して、現在の商品を入力としてコンポーネントに渡します。

        <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.5.html" region="app-product-alerts"></code-example>

新しい製品アラートコンポーネントは、製品リストからの入力として製品を受け取ります。 この入力による製品の価格に基づいて、"Notify Me"ボタンを表示もしくは隠す挙動をおこないます。 Phone XLの価格が700ドルを超えているため、製品には"Notify Me"ボタンが表示されます。

<div class="lightbox">
  <img src="generated/images/guide/start/product-alert-button.png" alt="Product alert button added to products over $700">
</div>

<div class="alert is-helpful">

親から子コンポーネントへのデータの受け渡し、親からの値の傍受および処理、入力プロパティ値への変更の検出および処理の詳細については、[コンポーネントの相互作用](guide/component-interaction "コンポーネント & テンプレート > コンポーネントの相互作用")を参照してください。

</div>


{@a output}
## Output

"Notify Me"ボタンを機能させるには、次の2つの設定が必要です。

  - ユーザーが"Notify Me"をクリックしたときにイベントを発行する商品アラートコンポーネント
  - そのイベントに反応する商品リストコンポーネント

1. `product-alerts.component.ts`を開きます。

1. `@angular/core`から`Output`と`EventEmitter`をインポートします。

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.ts" region="imports"></code-example>

1. コンポーネントクラスで、`@Output()`デコレーターと `EventEmitter()` のインスタンスを使って、`notify`という名前のプロパティを定義します。 これにより、notifyプロパティの値が変更されたときに製品アラートコンポーネントがイベントを発行することが可能になります。

<div class="alert is-helpful">

  Angular CLIが新しいコンポーネントを生成すると、空のコンストラクター、 `OnInit`インターフェース、および` ngOnInit() `メソッドが含まれます。
  次の例ではそれらを使用していないため、簡潔にするためにここでは省略します。

</div>

    <code-example path="getting-started/src/app/product-alerts/product-alerts.component.ts" header="src/app/product-alerts/product-alerts.component.ts" region="input-output"></code-example>

1. 商品アラートテンプレート `product-alerts.component.html` にて、`notify.emit()`メソッドを呼び出すためのイベントバインディングで"Notify Me"ボタンを更新します。

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.html"></code-example>

1. 次に、ユーザーがボタンをクリックしたときに発生する動作を定義します。 子がイベントを発行したときにアクションするのは、親の商品リストコンポーネント（商品アラートコンポーネントではなく）であることを思い出してください。 `product-list.component.ts`ファイルで、`share()`メソッドと同様に、`onNotify()`メソッドを定義します。

    <code-example header="src/app/product-list/product-list.component.ts" path="getting-started/src/app/product-list/product-list.component.ts" region="on-notify"></code-example>

1. 最後に、製品アラートコンポーネントからの出力を受け取るように製品リストコンポーネントを更新します。

    `product-list.component.html`で、` app-product-alerts`コンポーネント（これは"Notify Me"ボタンを表示するものです）を商品リストコンポーネントの `onNotify()`メソッドにバインドします。

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.6.html" region="on-notify"></code-example>

1. "Notify Me"ボタンを試してください。

    <div class="lightbox">
      <img src="generated/images/guide/start/product-alert-notification.png" alt="Product alert notification confirmation dialog">
    </div>


<div class="alert is-helpful">

子コンポーネントからのイベントのリスニング、子プロパティの読み取り、子メソッドの呼び出し、および親子内での双方向通信のためのサービスの使用の詳細については、[コンポーネントの相互作用](guide/component-interaction "コンポーネント ＆ テンプレート > コンポーネントの相互作用")を参照してください。

</div>


{@a next-steps}
## 次のステップ

おめでとうございます！ あなたははじめてのAngularアプリを完成させました！

基本的なオンラインストアカタログがあり、商品リスト、"Share"ボタン、"Notify me"ボタンがあります。
Angularの基礎、つまりコンポーネントとテンプレートの構文について学びました。
また、コンポーネントクラスとテンプレートがどのように相互作用するのか、およびコンポーネントが相互に通信する方法も学びました。

Angularの探索を続けるには、次のいずれかのオプションを選択してください。
* ["アプリ内ナビゲーション"セクションに進む](start/start-routing "入門： アプリ内ナビゲーション")ことで、製品名をクリックしてアクセスでき、独自のURLパターンをもつ製品詳細ページを作成します。
* [先に"デプロイ"セクションに進む](start/start-deployment "入門： デプロイ")ことで、ローカル開発に移動するか、アプリをFirebaseまたは独自のサーバーにデプロイします。
