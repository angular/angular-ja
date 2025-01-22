<docs-decorative-header title="Angularロードマップ" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
ウェブにおけるAngularチームの勢いの増し方を学びましょう。
</docs-decorative-header>

オープンソースプロジェクトとして、Angularの日々のコミット、PR、勢いはすべてGitHubで追跡できます。この日々の作業がフレームワークの将来とどのように関係しているかについての透明性を高めるために、私たちのロードマップはチームの現在および将来計画されているビジョンをまとめています。

以下のプロジェクトは、特定のAngularバージョンには関連付けられていません。完成次第リリースし、リリーススケジュールに従ってセマンティックバージョニングに基づいて特定のバージョンに含まれます。例えば、破壊的変更を含む場合は次のメジャー、そうでない場合は次のマイナーで機能をリリースします。

現在、Angularはフレームワークに2つの目標を持っています。

1. [Angular開発者体験の改善](#improving-the-angular-developer-experience)と
2. [フレームワークのパフォーマンスの向上](#fast-by-default)。

具体的なプロジェクト作業でこれらの目標をどのように達成する予定かについて、読み進めてください。

## 最新のAngularを探る

ロードマップからAngularの最新機能を使用して開発を始めましょう。このリストは、ロードマップから生まれた新機能の現在の状況を表しています。

### 実験的に利用可能

* [インクリメンタルハイドレーション](/guide/incremental-hydration)
* [Zoneless変更検知](/guide/experimental/zoneless)
* [i18nブロックのハイドレーションサポート](/api/platform-browser/withI18nSupport)
* [Resource API](/guide/signals/resource)
* [Effect API](/api/core/effect)
* [Linked Signal API](/guide/signals/linked-signal)
* [ルートレベルのレンダリングモード](/guide/hybrid-rendering)

### 本番環境向け

* [Angular Signalsの探索](/guide/signals)
* [SSRでのイベントリプレイ](/api/platform-browser/withEventReplay)
* [遅延可能ビュー](/guide/defer)
* [ビルトイン制御フロー](/guide/templates/control-flow)
* [ローカル変数宣言](/guide/templates/variables)
* [シグナル入力](/guide/signals/inputs)
* [モデル入力](/guide/signals/model)
* [シグナルクエリ](/guide/signals/queries)
* [関数ベースの出力](/guide/components/output)

## Angular開発者体験の改善

### 開発速度

<docs-card-container>
  <docs-card title="Angularシグナルの提供" href="https://github.com/angular/angular/discussions/49685">
  このプロジェクトでは、シグナルをリアクティビティプリミティブとして導入することにより、Angularのリアクティビティモデルを再考しています。初期計画では、数百件の議論と開発者との会話、フィードバックセッションやユーザー体験の調査、1,000件以上のコメントを受け取った一連のRFCが行われました。

  v17リリースの一環として、Angularシグナルライブラリを開発者プレビューから卒業しました。v19では、シグナルベースのクエリ、入力、モデル入力を安定版に移行しました。次に、このプロジェクトを完了する前に、エフェクトを最終化する必要があります。
  </docs-card>
  <docs-card title="Zoneless Angular" href="">
  v18では、Angularに実験的なZonelessサポートを提供しました。これにより、バンドルにzone.jsを含めずにフレームワークを使用できるようになり、パフォーマンス、デバッグエクスペリエンス、相互運用性が向上します。初期リリースの一環として、Angular CDKとAngular MaterialにもZonelessサポートを導入しました。

  v19では、サーバーサイドレンダリングでのZonelessサポートを導入し、いくつかのエッジケースに対処し、Zonelessプロジェクトを足場するためのスキーマを作成しました。  <a href="https://fonts.google.com/">Googleフォント</a>をZonelessに移行したことで、パフォーマンスと開発者エクスペリエンスが向上し、この機能を開発者プレビューに移行する前に対処する必要があるギャップを特定できました。今後数ヶ月でさらにアップデートを予定しています。
  </docs-card>
  <docs-card title="シグナルとの統合" href="">
  フォーム、HTTP、ルーターなど、基本的なAngularパッケージとシグナルの統合を改善することに取り組んでいます。このプロジェクトの一環として、包括的な開発者エクスペリエンスを向上させるために、便利なシグナルベースのAPIまたはラッパーを導入する機会を探ります。
  </docs-card>
  <docs-card title="Angular DevToolsでのシグナルのデバッグ" href="">
  Angularでのシグナルの進化に伴い、それらをデバッグするためのより良いツールに取り組んでいます。優先度の高いリストには、シグナルを検査およびデバッグするためのUIがあります。
  </docs-card>
  <docs-card title="HMR（ホットモジュールリプレースメント）の改善" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306">
  ホットモジュールリプレースメントを有効にすることで、より高速な編集/更新サイクルを目指しています。

  Angular v19では、CSSとテンプレートのHMRの初期サポートを提供しました。このプロジェクトを完了する前に、開発者のニーズに対応していることを確認するために、フィードバックの収集を続けます。
  </docs-card>
</docs-card-container>

### Angular MaterialとCDKの改善

<docs-card-container>
  <docs-card title="新しいCDKプリミティブ" href="">
  [コンボボックス](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)のWAI-ARIAデザインパターンに基づいてカスタムコンポーネントを作成しやすくするために、新しいCDKプリミティブに取り組んでいます。Angular v14では、このプロジェクトの一環として、安定した[メニューとダイアログプリミティブ](https://material.angular.io/cdk/categories)を、v15ではリストボックスを導入しました。
  </docs-card>
  <docs-card title="Angularコンポーネントのアクセシビリティ" href="">
  WCAGなどのアクセシビリティ基準に対してAngular Materialのコンポーネントを評価し、このプロセスから生じる問題を修正することに取り組んでいます。
  </docs-card>
</docs-card-container>

### ツールの改善

<docs-card-container>
  <docs-card title="`ng test`によるユニットテストツールの近代化" href="">
  v12では、ProtractorをCypress、Nightwatch、Puppeteer、Playwright、Webdriver.ioなどの最新の代替手段に置き換えることで、Angularのエンドツーエンドテストエクスペリエンスを見直しました。次に、Angularのユニットテストエクスペリエンスを近代化するために`ng test`に取り組みたいと考えています。

  現在、既存のテストを壊さないようにJasmineをアサーションライブラリとして維持しながら、Angularプロジェクトの新しいテストランナーとして、Web Test Runner, Vitest, Jestを候補として検討しています。
  </docs-card>
  <docs-card title="Angular CLIでのNitroサポートの評価" href="https://nitro.unjs.io/">
  Nitroが提供する、より多くのデプロイオプション、さまざまなランタイムとファイルベースのルーティングとのサーバーサイドレンダリングの互換性の向上などの機能に興奮しています。2025年には、Angularのサーバーサイドレンダリングモデルにどのように適合するかを評価します。

  調査の進捗状況については、随時更新をお知らせします。
  </docs-card>
</docs-card-container>

## デフォルトで高速

<docs-card-container>
  <docs-card title="インクリメンタルハイドレーションを有効にする" href="">
  v17では、ハイドレーションを開発者プレビューから卒業し、LCPで一貫して40〜50％の改善が見られました。それ以来、インクリメンタルハイドレーションのプロトタイプを作成し、ng-confでデモを公開しました。

  v19では、`@defer`ブロックによって実現されたインクリメンタルハイドレーションを開発者プレビューモードで提供しました。試してみて、<a href="https://github.com/angular/angular/issues">フィードバックを共有してください</a>！
  </docs-card>
  <docs-card title="サーバールート設定" href="">
  サーバーでより人間工学的なルート設定を可能にすることに取り組んでいます。どのルートをサーバーサイドレンダリング、プリレンダリング、クライアントサイドレンダリングするべきかを簡単に宣言できるようにしたいと考えています。

  Angular v19では、ルートレベルのレンダリングモードの開発者プレビューを提供しました。これにより、Angularでプリレンダリング、サーバーサイドレンダリング、クライアントサイドレンダリングを行うルートを細かく設定できます。
  </docs-card>
</docs-card-container>

## 将来の作業、調査、プロトタイピング

このセクションは、将来の潜在的なプロジェクトの調査とプロトタイピングを表しています。妥当な結果は、現在のソリューションが最適なオプションであると判断することです。他のプロジェクトは、ウェブがフレームワークとともに革新を続けるにつれて、RFC、進行中のプロジェクトへの昇格、または優先順位の低下につながる可能性があります。

<docs-card-container>
  <docs-card title="シグナルフォーム" href="">
  Angularフォームに関する既存のフィードバックを分析し、開発者の要件に対応し、リアクティブな状態管理にシグナルを使用するソリューションを設計する予定です。
  </docs-card>
  <docs-card title="セレクターレス" href="">
  ボイラープレートを削減し、スタンドアロンコンポーネントの使い勝手を向上させるために、セレクターをオプションにするソリューションを設計しています。コンポーネントまたはディレクティブを使用するには、それをインポートして、コンポーネントのテンプレートで直接使用できます。

  セレクターレスはまだ計画の初期段階です。初期設計が整い、次のステップの準備ができたら、RFCを共有します。
  </docs-card>
  <docs-card title="ストリーミングサーバーサイドレンダリングの調査" href="">
  過去数回のリリースで、Angularのサーバーサイドレンダリングのストーリーをより堅牢にする取り組んできました。優先事項には、Zonelessアプリケーションのストリーミングサーバーサイドレンダリングの調査があります。
  </docs-card>
  <docs-card title="記述形式の改善の調査" href="">
  開発者調査の結果に基づいて、コンポーネント記述形式の使い勝手を改善する機会があることがわかりました。このプロセスの最初のステップは、RFCの前に要件を収集し、問題領域を理解することです。進捗状況については、随時更新をお知らせします。将来の作業では、下位互換性と相互運用性が最優先されます。
  </docs-card>
  <docs-card title="TestBedの改善" href="">
  長年にわたるフィードバックとAngularランタイムの最近の更新に基づいて、TestBedを評価し、ユニットテストを開発する際の開発者エクスペリエンスを向上させ、ボイラープレートを削減する機会を特定します。
  </docs-card>
  <docs-card title="インクリメンタルな採用" href="">
  Angularには、マルチページアプリケーションにインタラクティブ性を追加したり、異なるフレームワークで構築された既存のアプリケーション内にAngularコンポーネントを埋め込んだりするツールと柔軟性が不足していました。

  このプロジェクトの一環として、クロスフレームワークの相互運用性の要件空間と、このユースケースを可能にするためのビルドツールの提供について調査します。
  </docs-card>
</docs-card-container>

## 完了したプロジェクト

<docs-card-container>
  <docs-card title="Support two-dimensional drag-and-drop" link="Completed in Q2 2024" href="https://github.com/angular/components/issues/13372">
  As part of this project, we implemented mixed orientation support for the Angular CDK drag and drop. This is one of the repository's most highly requested features.
  </docs-card>
  <docs-card title="Event replay with SSR and prerendering" link="Completed in Q4 2024" href="https://angular.dev/api/platform-browser/withEventReplay">
  In v18 we introduced an event replay functionality when using server-side rendering or prerendering. For this feature we depend on the event dispatch primitive (previously known as jsaction) that is running on Google.com.

  In Angular v19 we graduated event replay to stable and enabled it by default for all new projects.
  </docs-card>
  <docs-card title="Integrate Angular Language Service with Schematics" link="Completed in Q4 2024" href="">
  To make it easier for developers to use modern Angular APIs, we enabled integration between the Angular language service and schematics which allows you to refactor your app with a single click.
  </docs-card>
  <docs-card title="Streamline standalone imports with Language Service" link="Completed in Q4 2024" href="">
  As part of this initiative, the language service automatically imports components and pipes in standalone and NgModule-based apps. Additionally, we've added a template diagnostic to highlight unused imports in standalone components, which should help make application bundles smaller.
  </docs-card>
  <docs-card title="Local template variables" link="Completed in Q3 2024">
  We've released the support for local template variables in Angular, see [`@let` docs](https://angular.dev/api/core/@let) for additional information.
  </docs-card>
  <docs-card title="Angular Materialのカスタマイズを拡張する" link="2024年第2四半期に完了" href="https://material.angular.io/guide/theming">
  Angular Materialコンポーネントのカスタマイズを向上させ、Material 3機能を有効にするために、トークンベースのテーマAPIを定義するためにGoogleのMaterial Designチームと協力しています。

  v17.2では、Angular Material 3の実験的なサポートを共有し、v18では安定版に卒業しました。
  </docs-card>
  <docs-card title="遅延読み込みを導入する" link="2024年第2四半期に完了" href="https://next.angular.dev/guide/defer">
  v17では、遅延コード読み込みのための使い慣れたAPIを提供する、開発者プレビューで遅延表示を提供しました。v18では、ライブラリ開発者向けの遅延表示を有効にし、APIを安定版に卒業させました。
  </docs-card>
  <docs-card title="Angular DevToolsのiframeサポート" link="2024年第2四半期に完了" href="">
  ページ内に埋め込まれたiframe内のAngularアプリケーションのデバッグとプロファイリングを有効にしました。
  </docs-card>
  <docs-card title="esbuildとviteへの既存のハイブリッドレンダリングプロジェクトの移行の自動化" link="2024年第2四半期に完了" href="tools/cli/build-system-migration">
  v17では、viteとesbuildベースのアプリケーションビルダーを提供し、新しいプロジェクトでデフォルトで有効にしました。これは、ハイブリッドレンダリングを使用するプロジェクトのビルド時間を最大87％向上させます。v18の一環として、ハイブリッドレンダリングを使用する既存のプロジェクトを新しいビルドパイプラインに移行するシェーマティックとガイドを提供しました。NgModuleは当面の間残りますが、新しいAPIの利点を活用して開発者エクスペリエンスを向上させ、構築した新機能を活用することをお勧めします。
  </docs-card>
  <docs-card title="Angular.devをAngular開発者の公式のホームにする" link="2024年第2四半期に完了" href="https://goo.gle/angular-dot-dev">
  Angular.devは、Angular開発のための新しいサイト、ドメイン、およびホームです。新しいサイトには、開発者がAngularの最新機能を使用して構築するのに役立つ、更新されたドキュメント、チュートリアル、およびガイダンスが含まれています。
  </docs-card>
  <docs-card title="組み込みの制御フローを導入する" link="2024年第2四半期に完了" href="https://next.angular.dev/essentials/conditionals-and-loops">
  v17では、新しい制御フローの開発者プレビューバージョンを提供しました。これは、テンプレートオーサリングのパフォーマンスを大幅に向上させ、使いやすさを向上させます。また、既存の`*ngIf`、`*ngFor`、`*ngSwitch`のマイグレーションを提供しており、これを実行してプロジェクトを新しい実装に移行できます。v18以降、組み込みの制御フローは安定しています。
  </docs-card>
  <docs-card title="入門チュートリアルを最新化する" link="2023年第4四半期に完了" href="">
  過去2四半期に、スタンドアロンコンポーネントに基づいた新しい[ビデオ](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF)と[テキスト](https://angular.dev/tutorials/learn-angular)チュートリアルを開発しました。
  </docs-card>
  <docs-card title="最新のバンドラーを調査する" link="2023年第4四半期に完了" href="guide/hydration">
  Angular v16では、`ng build`と`ng serve`をサポートするesbuildベースのビルダーの開発者プレビューをリリースしました。`ng serve`開発サーバーはViteとesbuildとAngularコンパイラーによる複数ファイルコンパイルを使用します。v17では、ビルドツールを開発者プレビューから卒業させ、新しいプロジェクトでデフォルトで有効にしました。これは、ハイブリッドレンダリングを使用するプロジェクトのビルド時間を最大87％向上させます。
  </docs-card>
  <docs-card title="依存性の注入のデバッグAPIを導入する" link="2023年第4四半期に完了" href="tools/devtools">
  AngularとAngular DevToolsのデバッグユーティリティを改善するために、依存性の注入ランタイムにアクセスできるAPIに取り組んでいます。このプロジェクトでは、インジェクター階層とその関連するプロバイダー全体での依存関係を探索できるデバッグメソッドを公開します。v17では、依存性の注入のライフサイクルにプラグインできる機能を提供しました。また、インジェクターツリーの可視化と、各ノード内に宣言されたプロバイダーの検査を開始しました。
  </docs-card>
  <docs-card title="スタンドアロンコンポーネントのドキュメントとシェーマティックを改善する" link="2023年第4四半期に完了" href="components">
  `ng new --standalone`シェーマティックコレクションの開発者プレビューをリリースしました。これにより、NgModuleを使用せずにアプリケーションを作成できます。v17では、新しいアプリケーションのオーサリング形式をスタンドアロンAPIに変更し、ドキュメントを反映するように変更しました。さらに、既存のアプリケーションをスタンドアロンコンポーネント、ディレクティブ、およびパイプに更新するシェーマティックを提供しました。NgModuleは当面の間残りますが、新しいAPIの利点を活用して開発者エクスペリエンスを向上させ、構築した新機能を活用することをお勧めします。
  </docs-card>
  <docs-card title="ハイドレーションとサーバーサイドレンダリングの改善を調査する" link="2023年第4四半期に完了">
  v16では、非破壊的な完全なハイドレーションの開発者プレビューをリリースしました。[hydrationガイド](guide/hydration)と[ブログ投稿](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67)で詳細を確認してください。[LCP](https://web.dev/lcp)と[CLS](https://web.dev/cls)など、Core Web Vitalsに大きな改善が見られています。ラボテストでは、実世界のアプリケーションでLCPが常に45％向上していることが観察されました。

  v17では、開発者プレビュー外のハイドレーションを開始し、サーバーサイドレンダリングのストーリーで一連の改善をしました。これには、SSGのランタイムでのルート検出、ハイブリッドレンダリングされたアプリケーションのビルド時間の最大87％の高速化、新しいプロジェクトのハイブリッドレンダリングを有効にするプロンプトが含まれます。
  </docs-card>
  <docs-card title="アプリケーション全体の非破壊的なハイドレーション" link="2023年第1四半期に完了" href="guide/hydration">
  v16では、非破壊的な完全なハイドレーションの開発者プレビューをリリースしました。これにより、Angularは、サーバーサイドレンダリングされたページで既存のDOMノードを再利用できるようになり、最初からアプリケーションを再作成する必要がなくなります。ハイドレーションガイドで詳細を確認してください。
  </docs-card>
  <docs-card title="画像ディレクティブの改善" link="2023年第1四半期に完了" href="guide/image-optimization">
  v15でAngularの画像ディレクティブを安定版としてリリースしました。画像が明示的な寸法を持つのではなく、親コンテナーに収まるようにする新しい塗りつぶしモード機能を導入しました。過去2か月で、Chrome Auroraチームは、v12以降のバージョンにディレクティブをバックポートしました。
  </docs-card>
  <docs-card title="ドキュメントの再構築" link="2023年第1四半期に完了" href="https://angular.io">
  既存のすべてのドキュメントが、一貫した一連のコンテンツタイプに収まるようにします。チュートリアルスタイルのドキュメントの過度の使用を、独立したトピックに更新します。メインのチュートリアル以外のコンテンツが、一連のガイドと緊密に結合されることなく、自己完結型であることを確認したいと考えています。2022年第2四半期に、テンプレートコンテンツと依存性の注入を再構築しました。2023年第1四半期に、HTTPガイドを改善しました。これにより、ドキュメントの再構築プロジェクトを保留にしました。
  </docs-card>
  <docs-card title="画像のパフォーマンスを向上させる" link="2022年第4四半期に完了" href="guide/image-optimization">
  AuroraチームとAngularチームは、Core Web Vitalsを改善することを目的とした画像ディレクティブの実装に取り組んでいます。v15で画像ディレクティブの安定版をリリースしました。
  </docs-card>
  <docs-card title="最新のCSS" link="2022年第4四半期に完了" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
  ウェブエコシステムは常に進化しており、Angularに最新の標準を反映させたいと考えています。このプロジェクトでは、開発者がレイアウト、スタイリングなど、ベストプラクティスに従うように、Angularで最新のCSS機能を使用するためのガイドラインを提供することを目指しています。レイアウトの公式ガイドラインを共有し、このイニシアチブの一環として、フレックスレイアウトの公開を停止しました。
  </docs-card>
  <docs-card title="ホスト要素へのディレクティブの追加をサポートする" link="2022年第4四半期に完了" href="guide/directives/directive-composition-api">
  長年の機能要求の1つは、ホスト要素にディレクティブを追加する機能を追加することです。この機能により、開発者は、継承を使用せずに、独自のコンポーネントに追加の動作を追加できます。v15では、ディレクティブの合成APIを提供しました。これにより、ディレクティブを使用してホスト要素を拡張できます。
  </docs-card>
  <docs-card title="より良いスタックトレース" link="2022年第4四半期に完了" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
  AngularとChrome DevToolsは、エラーメッセージのスタックトレースをより読みやすくするために協力しています。v15では、関連性のあるリンクされたスタックトレースをリリースしました。優先順位が低いイニシアチブとして、テンプレートのより正確な呼び出しフレーム名を提供することで、スタックトレースをより使いやすくする方法を探求していきます。
  </docs-card>
  <docs-card title="MDC Webを統合することでAngular Materialコンポーネントを強化" link="2022年第4四半期に完了" href="https://material.angular.io/guide/mdc-migration">
  MDC Webは、GoogleのMaterial Designチームが作成したライブラリであり、Material Designコンポーネントを構築するための再利用可能なプリミティブを提供します。Angularチームは、これらのプリミティブをAngular Materialに組み込んでいます。MDC Webを使用すると、Angular MaterialはMaterial Design仕様にさらに準拠し、アクセシビリティが向上し、コンポーネントの品質が向上し、チームの速度が向上します。
  </docs-card>
  <docs-card title="オプションのNgModuleのAPIを実装する" link="2022年第4四半期に完了" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
  Angularを簡素化する過程で、開発者がNgModuleを使用せずにアプリケーションを初期化し、コンポーネントをインスタンス化し、ルーターを使用できるAPIを導入しています。Angular v14では、スタンドアロンコンポーネントやディレクティブおよびパイプのAPIの開発者プレビューを導入しました。今後の数四半期で、開発者からのフィードバックを収集し、プロジェクトを最終化してAPIを安定版にします。次のステップとして、TestBed、Angular要素など、ユースケースを改善していきます。
  </docs-card>
  <docs-card title="テンプレートで保護されたフィールドへのバインドを許可する" link="2022年第2四半期に完了" href="guide/templates/binding">
  Angularコンポーネントのカプセル化を改善するために、コンポーネントインスタンスの保護されたメンバーへのバインドを有効にしました。これにより、テンプレート内で使用するフィールドやメソッドをパブリックとして公開する必要がなくなります。
  </docs-card>
  <docs-card title="高度な概念に関するガイドを公開する" link="2022年第2四半期に完了" href="https://angular.io/guide/change-detection">
  変更検知に関する詳細なガイドを開発および公開します。Angularアプリケーションのパフォーマンスプロファイリングのためのコンテンツを開発します。変更検知がZone.jsとどのように相互作用するか、いつトリガーされるか、期間をプロファイルする方法、およびパフォーマンスを最適化するための一般的な慣行を説明します。
  </docs-card>
  <docs-card title="@angular/formsの厳密な型付けを展開する" link="2022年第2四半期に完了" href="guide/forms/typed-forms">
  2021年第4四半期に、フォームの厳密な型付けを導入するためのソリューションを設計し、2022年第1四半期に関連するRFCを終了しました。現在、既存のプロジェクトの改善を可能にする自動移行ステップを備えた展開戦略を実装しています。まず、Googleの2,500を超えるプロジェクトでソリューションをテストして、外部コミュニティの円滑な移行パスを確保します。
  </docs-card>
  <docs-card title="レガシーのView Engineを削除する" link="2022年第1四半期に完了" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
  すべての社内ツールをIvyに移行したら、レガシーのView Engineを削除します。これにより、Angularの概念上のオーバーヘッドが削減され、パッケージサイズが小さくなり、メンテナンスコストが削減され、コードベースの複雑さが軽減されます。
  </docs-card>
  <docs-card title="オプションのNgModuleを使用してAngularのメンタルモデルを簡素化する" link="2022年第1四半期に完了" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
  Angularのメンタルモデルと学習プロセスを簡素化するために、NgModuleをオプションにする取り組みを進めています。この作業により、開発者はスタンドアロンコンポーネントを開発し、コンポーネントのコンパイルスコープを宣言するための代替APIを実装できます。このプロジェクトは、RFCにまとめたハイレベルな設計の議論から開始されました。
  </docs-card>
  <docs-card title="@angular/formsの厳密な型付けを設計する" link="2022年第1四半期に完了" href="guide/forms/typed-forms">
  下位互換性のない影響を最小限に抑えながら、リアクティブフォームの厳密な型チェックを実装する方法を探します。これにより、開発者は開発中に問題を早期に発見し、より優れたテキストエディターとIDEのサポートを可能にし、リアクティブフォームの型チェックを改善できます。
  </docs-card>
  <docs-card title="Angular DevToolsのフレームワークとの統合を改善する" link="2022年第1四半期に完了" href="tools/devtools">
  Angular DevToolsのフレームワークとの統合を改善するために、コードベースをangular/angularモノレポに移行しています。これには、Angular DevToolsをBazelに移行し、既存のプロセスとCIパイプラインに統合することが含まれます。
  </docs-card>
  <docs-card title="高度なコンパイラー診断を公開する" link="2022年第1四半期に完了" href="reference/extended-diagnostics">
  型チェック以外のAngularコンパイラーの診断を拡張します。他の正しさや適合性のチェックを導入して、正しさやベストプラクティスをさらに保証します。
  </docs-card>
  <docs-card title="e2eテスト戦略を更新する" link="2021年第3四半期に完了" href="guide/testing">
  将来を見据えたe2eテスト戦略を提供するために、Protractorの現状、コミュニティのイノベーション、e2eのベストプラクティスを評価し、新しい機会を探求します。取り組みの最初のステップとして、RFCを共有し、パートナーと協力して、Angular CLIと最新のe2eテストツールの統合を円滑にしました。次のステップとして、推奨事項を最終化し、移行のためのリソースリストをまとめる必要があります。
  </docs-card>
  <docs-card title="AngularライブラリがIvyを使用する" link="2021年第3四半期に完了" href="tools/libraries">
  2020年初頭に、Ivyライブラリの配布に関するRFCを共有しました。コミュニティからの貴重なフィードバックの後、プロジェクトの設計を開発しました。現在、Ivyライブラリの配布の開発に投資しています。これには、Ivyコンパイルを使用するためのライブラリパッケージ形式の更新、View Engineライブラリ形式の廃止、およびngccのブロック解除が含まれます。
  </docs-card>
  <docs-card title="自動テスト環境のティアダウンでテスト時間を短縮し、デバッグを改善する" link="2021年第3四半期に完了" href="guide/testing">
  テスト時間を短縮し、テスト間の分離を向上させるために、TestBedが各テスト実行後にテスト環境を自動的にクリーンアップしてティアダウンするように変更したいと考えています。
  </docs-card>
  <docs-card title="IE11サポートの廃止と削除" link="2021年第3四半期に完了" href="https://github.com/angular/angular/issues/41840">
  Internet Explorer 11（IE11）は、Angularがウェブプラットフォームの最新の機能を利用することを妨げてきました。このプロジェクトの一環として、最新のブラウザが提供する最新の機能への道を開くために、IE11サポートを廃止し、削除します。コミュニティからのフィードバックを収集し、今後の取り組みを決定するためにRFCを実行しました。
  </docs-card>
  <docs-card title="ES2017+をデフォルトの出力言語として活用する" link="2021年第3四半期に完了" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
  最新のブラウザをサポートすることで、JavaScriptのよりコンパクトで表現力豊かでパフォーマンスの高い新しい構文を活用できます。このプロジェクトの一環として、この取り組みを進めるためのブロッカーを調査し、それを有効にするためのステップを踏みます。
  </docs-card>
  <docs-card title="Angular DevToolsを使用したデバッグとパフォーマンスプロファイリングの高速化" link="2021年第2四半期に完了" href="tools/devtools">
  デバッグとパフォーマンスプロファイリングのためのユーティリティを提供するAngularの開発ツールに取り組んでいます。このプロジェクトの目標は、開発者がAngularアプリケーションのコンポーネント構造と変更検知を理解するのを支援することです。
  </docs-card>
  <docs-card title="統合されたAngularバージョン管理とブランチングによるリリースの合理化" link="2021年第2四半期に完了" href="reference/releases">
  Angular（angular/angular、angular/angular-cli、およびangular/components）の複数のGitHubリポジトリ間のリリース管理ツールを統合したいと考えています。この取り組みにより、インフラストラクチャを再利用し、プロセスを統一し、簡素化し、リリースプロセスの信頼性を向上させることができます。
  </docs-card>
  <docs-card title="コミットメッセージの標準化による開発者の整合性の向上" link="2021年第2四半期に完了" href="https://github.com/angular/angular">
  Angularリポジトリ（angular/angular、angular/components、およびangular/angular-cli）全体でコミットメッセージの要件と適合性を統一して、開発プロセスに整合性をもたらし、インフラストラクチャツールの再利用を可能にすることを目指しています。
  </docs-card>
  <docs-card title="Angular言語サービスをIvyに移行する" link="2021年第2四半期に完了" href="tools/language-service">
  このプロジェクトの目標は、言語サービスをIvyに移行することで、エクスペリエンスを向上させ、レガシーの依存関係を削除することです。現在、言語サービスは、Ivyアプリケーションであっても、View Engineコンパイラーと型チェックを使用しています。Angular LanguageサービスでIvyテンプレートパーサーと改善された型チェックを使用して、アプリケーションの動作と一致させることを目指しています。この移行は、View Engineの削除をブロック解除するためのステップでもあります。これにより、Angularが簡素化され、npmパッケージサイズが削減され、フレームワークの保守性が向上します。
  </docs-card>
  <docs-card title="AngularでのネイティブのTrusted Typesによるセキュリティの強化" link="2021年第2四半期に完了" href="best-practices/security">
  Googleのセキュリティチームと協力して、新しいTrusted Types APIのサポートを追加しています。このウェブプラットフォームAPIは、開発者がより安全なウェブアプリケーションを構築するのに役立ちます。
  </docs-card>
  <docs-card title="Angular CLI webpack 5によるビルド速度とバンドルサイズの最適化" link="2021年第2四半期に完了" href="tools/cli/build">
  v11リリースの一環として、Angular CLIでwebpack 5のオプトインプレビューを導入しました。安定性を確保するために、ビルド速度とバンドルサイズの改善を可能にするために、実装を改善し続けます。
  </docs-card>
  <docs-card title="Universalアプリで重要なスタイルをインライン化することでアプリを高速化する" link="2021年第1四半期に完了" href="guide/ssr">
  外部スタイルシートの読み込みはブロッキング操作であるため、ブラウザは参照されているすべてのCSSを読み込むまでアプリケーションのレンダリングを開始できません。ページのヘッダーにレンダリングブロッキングリソースがあると、ロードパフォーマンス（たとえば、最初のコンテンツフルペイント）に大きく影響することがあります。アプリケーションを高速化するために、Google Chromeチームと協力して、重要なCSSをインライン化し、残りのスタイルを非同期に読み込んでいます。
  </docs-card>
  <docs-card title="より良いAngularのエラーメッセージによるデバッグの改善" link="2021年第1四半期に完了" href="reference/errors">
  エラーメッセージは、開発者が解決するのに役立つ実行可能な情報をあまり提供していません。より発見しやすいエラーメッセージを作成するために、関連するコードを追加し、ガイドやその他の資料を開発して、よりスムーズなデバッグエクスペリエンスを実現しています。
  </docs-card>
  <docs-card title="更新された入門ドキュメントによる開発者のオンボーディングの改善" link="2021年第1四半期に完了" href="tutorials">
  ユーザーの学習プロセスを再定義し、入門ドキュメントを更新します。Angularの利点、その機能の探索方法、および開発者ができるだけ短時間でフレームワークに習熟できるようにするガイダンスを明確に示します。
  </docs-card>
  <docs-card title="コンポーネントハーネスのベストプラクティスを拡張する" link="2021年第1四半期に完了" href="https://material.angular.io/guide/using-component-harnesses">
  Angular CDKは、バージョン9でAngularにコンポーネントテストハーネスの概念を導入しました。テストハーネスにより、コンポーネントの作成者は、コンポーネントの相互作用をテストするためのサポートされているAPIを作成できます。このハーネスインフラストラクチャを改善し続け、ハーネスの使用に関するベストプラクティスを明確化しています。また、Google内部でより多くのハーネスの採用を促進しています。
  </docs-card>
  <docs-card title="コンテンツ投影のガイドを作成する" link="2021年第2四半期に完了" href="https://angular.io/docs">
  コンテンツ投影はAngularの中核となる概念ですが、ドキュメントでは十分に説明されていません。このプロジェクトの一環として、コンテンツ投影の中核となるユースケースと概念を特定して文書化したいと考えています。
  </docs-card>
  <docs-card title="ESLintに移行する" link="2020年第4四半期に完了" href="tools/cli">
  TSLintの廃止に伴い、ESLintに移行します。このプロセスの一環として、現在の推奨されるTSLint構成との下位互換性を確保し、既存のAngularアプリケーションの移行戦略を実装し、Angular CLIツールチェーンに新しいツールを導入します。
  </docs-card>
  <docs-card title="バックログさよなら作戦（別名Byelog作戦）" link="2020年第4四半期に完了" href="https://github.com/angular/angular/issues">
  コミュニティの広範なニーズを明確に理解するまで、エンジニアリング能力の最大50％を問題とPRのトリアージに積極的に投資しています。その後、エンジニアリング能力の最大20％を新しい提出内容を迅速に対応するために割り当てます。
  </docs-card>
</docs-card-container>
