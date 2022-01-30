# Angular とは何か？

このトピックは Angular を理解するのに役立ちます。Angular とは何であるか、Angular が提供する利点、そしてあなたがアプリケーションを作るときに何が期待できるのか、といったことです。

Angular は[TypeScript](https://www.typescriptlang.org/)上に作られた開発プラットフォームです。プラットフォームとして Angular には次のことが含まれます：

- スケーラブルなウェブアプリケーションを構築するためのコンポーネントベースのフレームワーク
- ルーティング、フォーム管理、クライアントとサーバー間の通信など、さまざまな機能をカバーする、十分に統合されたライブラリのコレクション
- コードの開発、ビルド、テスト、更新を支援する一連の開発者ツール

Angular を使用すると、ひとりの開発者によるプロジェクトからエンタープライズレベルのアプリケーションまで拡張できるプラットフォームを利用できます。Angular は、更新を可能な限り簡単にするように設計されているため、最小限の労力で最新の開発を利用できます。何よりも、Angular エコシステムは、170 万人を超える開発者、ライブラリ作成者、コンテンツ作成者からなる多様なグループで構成されています。

<div class="alert is-helpful">

このガイドのコードスニペットを含む実用的な例については <live-example name="what-is-angular"></live-example> を参照してください。

</div>

{@a essentials}

## Angular アプリケーション：基本事項

このセクションでは、Angular の背後にある中心的なアイデアについて説明します。これらのアイデアを理解すると、アプリケーションをより効果的に設計および構築するのに役立ちます。

{@a components}

### コンポーネント

コンポーネントは、アプリケーションを組み立てる構成要素です。コンポーネントには、`@Component()`デコレーターを付けた TypeScript のクラス、HTML テンプレート、およびスタイルが含まれます。`@Component()`デコレーターには、次の Angular 固有の情報を指定します。

- コンポーネントがテンプレートでどのように使用されるかを定義する CSS セレクター。このセレクターに一致するテンプレート内の HTML 要素は、コンポーネントのインスタンスになります。
- コンポーネントのレンダリング方法を Angular に指示する HTML テンプレート。
- テンプレートの HTML 要素の外観を定義する CSS スタイルのオプションのセット。

以下は最小限の Angular コンポーネントです。

<code-example
  path="what-is-angular/src/app/hello-world/hello-world.component.ts"></code-example>

このコンポーネントを使用するには、テンプレートに次のように記述します。

<code-example path="what-is-angular/src/app/app.component.html" region="hello-world-selector"></code-example>

Angular がこのコンポーネントをレンダリングすると、結果の DOM は次のようになります。

<code-example path="what-is-angular/src/app/hello-world-example.html" language="html"></code-example>

Angular のコンポーネントモデルは、強力なカプセル化と直感的なアプリケーション構造を提供します。また、コンポーネントは、アプリケーションのユニットテストを容易にし、コード全体の読みやすさを向上させます。

コンポーネントでできることの詳細については、[コンポーネント](guide/component-overview)セクションを参照してください。

{@a templates}

### テンプレート

すべてのコンポーネントには、そのコンポーネントのレンダリング方法を宣言する HTML テンプレートがあります。このテンプレートは、インラインまたはファイルパスで定義します。

Angular は、コンポーネントから動的な値を挿入できる追加の構文で HTML を拡張します。コンポーネントの状態が変化すると、Angular はレンダリングされた DOM を自動的に更新します。次の例に示すように、この機能の応用例のひとつは動的なテキストの挿入です。

<code-example path="what-is-angular/src/app/hello-world-interpolation/hello-world-interpolation.component.html" region="say-hello"></code-example>

メッセージの値は、コンポーネントクラスから取得されます。

<code-example path="what-is-angular/src/app/hello-world-interpolation/hello-world-interpolation.component.ts"></code-example>

アプリケーションがコンポーネントとそのテンプレートをロードすると、ユーザーには次のように表示されます。

<code-example language="html">
&lt;p&gt;Hello, World!&lt;/p&gt;
</code-example>

二重中括弧の使用に注意してください。二重中括弧は Angular にそれらの中の内容を補間するように指示します。

Angular はプロパティバインディングもサポートしており、HTML 要素のプロパティと属性の値を設定し、アプリケーションのプレゼンテーションロジックに値を渡すのに役立ちます。

<code-example path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html" region="bindings"></code-example>

角かっこが使用されていることに注意してください。この構文は、プロパティまたは属性をコンポーネントクラスの値にバインドしていることを示しています。

キーストローク、マウスの動き、クリック、タッチなどのユーザーアクションを待ち受けて応答するためにイベントリスナーを宣言します。括弧内にイベント名を指定して、イベントリスナーを宣言します。

<code-example path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html" region="event-binding"></code-example>

前の例では、コンポーネントクラスで定義されているメソッドを呼び出しています。

<code-example path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.ts" region="method"></code-example>

以下は、Angular のテンプレート内での補間、プロパティバインディング、イベントバインディングの組み合わせ例です。

<code-tabs linenums="true">
  <code-pane
    header="hello-world-bindings.component.ts"
    path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.ts">
  </code-pane>
  <code-pane
    header="hello-world-bindings.component.html"
    path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html"
    linenums="false">
  </code-pane>
</code-tabs>

[ディレクティブ](guide/built-in-directives)を使用して、テンプレートに機能を追加します。Angular でもっとも人気のあるディレクティブは`*ngIf`と`*ngFor`です。ディレクティブを使用して、DOM 構造を動的に変更するなど、さまざまな作業を実行します。また、独自のカスタムディレクティブを作成して、優れたユーザー体験を作成します。

次のコードは、`*ngIf`ディレクティブの例です。

<code-tabs linenums="true">
  <code-pane
    header="hello-world-ngif.component.ts"
    path="what-is-angular/src/app/hello-world-ngif/hello-world-ngif.component.ts">
  </code-pane>
  <code-pane
    header="hello-world-ngif.component.html"
    path="what-is-angular/src/app/hello-world-ngif/hello-world-ngif.component.html"
    linenums="false">
  </code-pane>
</code-tabs>

Angular の宣言型テンプレートを使えば、アプリケーションのロジックとプレゼンテーションをきれいに分けることができます。テンプレートは標準的な HTML をベースにしており、構築、維持、更新が容易です。

テンプレートの詳細については、[テンプレート](guide/template-syntax)セクションを参照してください。

{@a di}

### 依存性の注入

依存性の注入を使用すると、インスタンス化を行わなくても、TypeScript クラスの依存性を宣言できます。代わりに、Angular がインスタンス化を処理します。このデザインパターンにより、よりテスト可能で柔軟なコードを記述できます。依存性の注入を理解することは Angular の使用を開始するために必須ではありませんが、ベストプラクティスとして Angular の多くの側面である程度使用しているので、理解しておくことを強くお勧めします。

依存性の注入がどのように機能するかを説明するために、次の例を考えてください。最初のファイル`logger.service.ts`は`Logger`クラスを定義しています。このクラスには、コンソールに数値を記録する`writeCount`関数が含まれています。

<code-example path="what-is-angular/src/app/logger.service.ts"></code-example>

次に、`hello-world-di.component.ts`ファイルは Angular コンポーネントを定義しています。このコンポーネントには、`Logger`クラスの`writeCount`関数を使用するボタンが含まれています。その関数にアクセスするために、コンストラクターに`private logger: Logger`を追加することにより、`Logger`サービスが`HelloWorldDI`クラスに注入されます。

<code-example path="what-is-angular/src/app/hello-world-di/hello-world-di.component.ts"></code-example>

依存性の注入と Angular の詳細については、[Angular の依存性の注入](guide/dependency-injection)セクションを参照してください。

{@a cli}

## Angular CLI

Angular CLI は、Angular アプリケーションを開発するための、もっとも速く、分かりやすく、お勧めの方法です。Angular CLI を使用すると、多くの作業をトラブルなく行うことができます。ここではその例を紹介します。

<table>
<tr>
<td><a href="cli/build">ng build</a></td>
<td>Angularアプリを出力ディレクトリにコンパイルします。</td>
</tr>
<tr>
<td><a href="cli/serve">ng serve</a></td>
<td>アプリケーションをビルドして提供し、ファイルの変更時に再ビルドします。</td>
</tr>
<tr>
<td><a href="cli/generate">ng generate</a></td>
<td>Schematicに基づいてファイルを生成または変更します。</td>
</tr>
<tr>
<td><a href="cli/test">ng test</a></td>
<td>特定のプロジェクトで単体テストを実行します。</td>
</tr>
<tr>
<td><a href="cli/e2e">ng e2e</a></td>
<td>Angularアプリケーションをビルドして提供し、エンドツーエンドのテストを実行します。</td>
</tr>
</table>

Angular CLI は、アプリケーションを構築するための貴重なツールです。

Angular CLI の詳細については、[CLI リファレンス](/cli)セクションを参照してください。

{@a 1p-libraries}

## ファーストパーティライブラリ

[Angular アプリケーション：基本事項](#essentials)では、Angular アプリケーションを構築するときに使用するいくつかの主要なアーキテクチャ要素の概要を説明しています。しかし、Angular の多くの利点は、アプリケーションが成長し、サイトナビゲーションやユーザー入力などの機能を追加したいときに実際に明らかになります。Angular プラットフォームを使用して、Angular が提供する多くのファーストパーティライブラリの 1 つを組み込みましょう。

利用可能なライブラリには、次のものがあります。

<table>
<tr>
<td><a href="guide/router">Angular Router</a></td>
<td>Angularコンポーネントに基づく高度なクライアント側のナビゲーションとルーティング。遅延読み込み、ネストされたルート、カスタムパスマッチングなどをサポートします。</td>
</tr>
<tr>
<td><a href="guide/forms-overview">Angular Forms</td>
<td>フォームへの介入と検証のための統一されたシステム。</td>
<tr>
<td><a href="guide/http">Angular HttpClient</a></td>
<td>より高度なクライアント/サーバー通信を強化できる堅牢なHTTPクライアント。</td>
</tr>
<tr>
<td><a href="guide/animations">Angular Animations</a></td>
<td>アプリケーションの状態に基づいてアニメーションを駆動するリッチなシステム。</td>
</tr>
<tr>
<td><a href="guide/service-worker-intro">Angular PWA</a>
<td>Service WorkerやWebアプリマニフェストを含むプログレッシブWebアプリケーション（PWA）を構築するためのツール。</td>
</tr>
<tr>
<td><a href="guide/schematics">Angular Schematics</td>
<td>大規模な開発を簡素化する自動化されたスキャフォールディング、リファクタリング、および更新ツール。</td>
</tr>
</table>

これらのライブラリは、アプリケーションの機能を拡張すると同時に、アプリケーションを独自のものにする機能にさらに集中できるようにします。また、Angular フレームワークにシームレスに統合され、同時に更新されるように設計されていることを知りながら、これらのライブラリを追加しましょう。

これらのライブラリは、アプリケーションに機能を追加したり、特定の問題を解決したりするのに役立つ場合にのみ必要です。

## 次のステップ

このトピックでは、Angular とは何か、Angular が提供する利点、そしてアプリケーションの構築を始める際に期待されることについて、簡単に説明することを目的としています。

Angular の動作を確認するには、[はじめに](start)のチュートリアルを参照してください。このチュートリアルでは[stackblitz.com](https://stackblitz.com/)を使い、インストールすることなく Angular の実用的な例を探索することができます。

Angular の機能をさらに詳しく調べるには、[Angular を理解する](guide/component-overview)と[開発者ガイド](guide/router)のセクションを読むことをお勧めします。

@reviewed 2021-10-28
