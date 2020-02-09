# 次のステップ: ツールとテクニック

基本的なAngularの構成ブロックを理解したあと、
Angularアプリケーションの開発と提供に役立つ機能とツールの詳細を学ぶことができます。

* Work through the [Tour of Heroes](tutorial/index) tutorial to get a feel for how to fit the basic building blocks together to create a well-designed application.

* Check out the [Glossary](guide/glossary) to understand Angular-specific terms and usage.

* Use the documentation to learn about key features in more depth, according to your stage of development and areas of interest.

## Application architecture

* The [NgModules](guide/ngmodules) guide provides in-depth information on the modular structure of an Angular application.

* The [Routing and navigation](guide/router) guide provides in-depth information on how to construct applications that allow a user to navigate to different [views](guide/glossary#view) within your single-page app.

* The [Dependency injection](guide/dependency-injection) guide provides in-depth information on how to construct an application such that each component class can acquire the services and objects it needs to perform its function.

## レスポンシブプログラミング

The **Components and Templates** guide provides guidance and details of the [template syntax](guide/template-syntax) that you use to display your component data when and where you want it within a view, and to collect input from users that you can respond to.

Additional pages and sections describe some basic programming techniques for Angular apps.

* [ライフサイクル・フック](guide/lifecycle-hooks): ライフサイクル・フックインターフェースを実装することで、コンポーネントの作成から破棄まで、コンポーネントの存続期間中の重要な瞬間に触れることができます。

* [Observable とイベント処理](guide/observables): コンポーネントやサービスで observable を使用して、ユーザーインタラクションイベントや非同期操作結果など、あらゆるタイプのメッセージをパブリッシュして購読する方法です。

* [Angular elements](guide/elements): How to package components as *custom elements* using Web Components, a web standard for defining new HTML elements in a framework-agnostic way.

* [フォーム](guide/forms): HTML ベースの検証とダーティーチェックを使用して、複雑なデータ入力シナリオをサポートします。

* [アニメーション](guide/animations): Angularのアニメーションライブラリを使用して、アニメーションテクニックやCSSの詳細な知識なしに
コンポーネントの動作をアニメートできます。

## クライアントとサーバーのインタラクション

Angular provides a framework for single-page apps, where most of the logic and data resides on the client.
Most apps still need to access a server using the `HttpClient` to access and save data.
For some platforms and applications, you might also want to use the PWA (Progressive Web App) model to improve the user experience.

* [HTTP](guide/http): HTTP クライアントを使用してサーバーと通信してデータを取得、保存し、サーバー側のアクションを呼び出します。

* [Server-side Rendering](guide/universal): Angular Universal は、サーバーサイドレンダリング(SSR)によってサーバー上に静的アプリケーションページを生成します。これにより、パフォーマンスを向上させ、モバイルデバイスや低パワーのデバイスで最初のページをすばやく表示し、Webクローラを手助けするために、Angular アプリケーションをサーバー上で実行できます。

* [Service WorkersとPWA](guide/service-worker-intro): service worker を使用してネットワークへの依存を減らしユーザー体験を大幅に改善します。

* [Web workers](guide/web-worker): Learn how to run CPU-intensive computations in a background thread.

## 開発サイクルのサポート

The **Development Workflow** section describes the tools and processes you use to compile, test, and  and deploy Angular applications.

* [CLIコマンドリファレンス](cli): Angular CLIは、プロジェクトの作成、アプリケーションおよびライブラリコードの生成、およびテスト、バンドル、デプロイなどのさまざまな進行中の開発タスクの実行に使用するコマンドラインツールです。

* [コンパイル](guide/aot-compiler): Angularは、開発環境用のジャストインタイム（JIT）コンパイルと、本番環境用の事前（AOT）コンパイルを提供します。

* [テスティングプラットフォーム](guide/testing): Angular フレームワークとやり取りするアプリケーションの部品において、ユニットテストを実行します。

* [デプロイメント](guide/deployment): Angular アプリケーションをリモートサーバーにデプロイする方法を学びます。

* [セキュリティガイドライン](guide/security): 一般的な Web アプリケーションの脆弱性やクロスサイトスクリプティングなどの攻撃に対する Angular の組み込みの保護機能について説明します。

* [国際化](guide/i18n):  Angular の国際化(i18n)ツールを使用して、アプリを複数の言語で利用できるようにします。

* [Accessibility](guide/accessibility): Make your app accessible to all users.


## File structure, configuration, and dependencies

* [ワークスペースとファイル構成](guide/file-structure): Angularワークスペースとプロジェクトフォルダの構造を理解する。

* [ビルドとサーブ](guide/build): 開発時、ステージング、およびプロダクションなど、プロジェクトのさまざまなビルドおよびプロキシサーバー構成を定義する方法を学びます。

* [npmパッケージ](guide/npm-packages): Angular フレームワーク、Angular CLI、Angularアプリケーションで使用されるコンポーネントは、[npm](https://docs.npmjs.com/)パッケージとしてパッケージ化され、npmレジストリを介して配布されます。 Angular CLIはデフォルトの `package.json`ファイルを作成します。このファイルは、うまく機能し、多くの一般的なアプリケーションシナリオを共同でサポートするパッケージのスターターセットを指定します。

* [TypeScript の設定](guide/typescript-configuration): TypeScript は Angular アプリケーション開発における主要な言語です。

* [ブラウザのサポート](guide/browser-support): アプリを幅広いブラウザに対応させます。

## Extending Angular

* [Angular libraries](guide/libraries): Learn about using and creating re-usable libraries.

* [Schematics](guide/schematics): Learn about customizing and extending the CLI's generation capabilities.

* [CLI builders](guide/cli-builder): Learn about customizing and extending the CLI's ability to apply tools to perform complex tasks, such as building and testing applications.
