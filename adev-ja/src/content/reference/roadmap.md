<docs-decorative-header title="Angularのロードマップ" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
Angularチームがウェブ上でどのように勢いを増しているかをご覧ください。
</docs-decorative-header>

オープンソースプロジェクトとして、Angularの日々のコミット、PR、勢いはすべてGitHubで追跡可能です。この日々の作業がフレームワークの将来にどのようにつながるかをより透明にするために、ロードマップはチームの現在および将来の計画されたビジョンをまとめたものです。

以下のプロジェクトは、特定のAngularバージョンには関連付けられていません。完成したらリリースし、セマンティックバージョン管理に従ってリリーススケジュールに基づいて特定のバージョンの一部になります。たとえば、破壊的変更を含む場合は、完了後の次のマイナーバージョン、または次のメジャーバージョンで機能をリリースします。

現在、Angularにはフレームワークについて2つの目標があります。

1. [Angular開発者エクスペリエンス](#improving-the-angular-developer-experience)を向上させること、および
2. [フレームワークのパフォーマンス](#fast-by-default)を向上させること。

これらの目標を特定のプロジェクト作業でどのように達成するのか、詳細を読み進めてください。

## 最新のAngularを探検する

ロードマップから最新のAngular機能で開発を始めましょう。このリストは、ロードマップの新機能の現在のステータスを表しています。

### 実験可能なもの

* [Angularシグナルを試す](guide/signals)
* [SSRでのイベントリプレイ](https://angular.dev/api/platform-browser/withEventReplay)
* [Zoneless変更検出](https://angular.dev/guide/experimental/zoneless)
* [i18nブロックのハイドレーションサポート](https://angular.dev/api/platform-browser/withI18nSupport)

### 本番環境で使用可能

* [hydration](guide/hydration)
* [遅延表示](https://angular.dev/guide/defer)
* [組み込みの制御フロー](https://angular.dev/guide/templates/control-flow)
* [Angular MaterialをMDCに移行する](https://material.angular.io/guide/mdc-migration)
* [Angular Material 3](https://material.angular.io/guide/theming)
* [スタンドアロンAPIに移行する](reference/migrations/standalone)
* [NgOptimizedImageで画像のパフォーマンスを向上させる](guide/image-optimization)
* [Injectを試す](/tutorials/learn-angular/20-inject-based-di)
* [新しいCDKディレクティブ](https://material.angular.io/cdk/categories)

## Angular開発者エクスペリエンスの向上

### 開発速度

<docs-card-container>
  <docs-card title="Angularシグナルを提供する" href="https://github.com/angular/angular/discussions/49685">
  このプロジェクトは、シグナルをリアクティビティプリミティブとして導入することで、Angularのリアクティビティモデルを再考しています。初期の計画は、数百の議論、開発者との会話、フィードバックセッション、ユーザーエクスペリエンス調査、および1,000件以上のコメントを受け取った一連のRFCを生み出しました。

  v17リリースの一環として、Angularシグナルライブラリは開発者プレビューから卒業しました。v18では、開発者プレビューで信号ベースのクエリ、入力、およびモデル入力を使用できるようになりました。次に、これらのAPIを安定版に卒業し、Angularの変更検知メカニズムに信号をより深く統合する前に、コミュニティからのフィードバックに対処し続けます。
  </docs-card>
  <docs-card title="Zoneless Angular" href="">
  v18では、Angularに実験的なzonelessサポートを提供しました。これにより、開発者はzone.jsをバンドルに含めることなくフレームワークを使用できるようになり、パフォーマンス、デバッグエクスペリエンス、および相互運用性が向上します。初期リリースの一環として、Angular CDKとAngular Materialにもzonelessサポートを導入しました。

  次のステップとして、開発者エクスペリエンスを向上させるために、APIを改善し続けます。
  </docs-card>
  <docs-card title="ローカルテンプレート変数" href="https://github.com/angular/angular/issues/15280">
  ローカルテンプレート変数は、Angularのイシュー追跡システムで最も多くの票を集めた機能の1つです。2024年第2四半期に、初期設計とプロトタイピングを開始しました。2024年後半に更新情報を期待してください。
  </docs-card>
</docs-card-container>

### Angular MaterialとCDKの改善

<docs-card-container>
  <docs-card title="新しいCDKプリミティブ" href="">
  [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)のWAI-ARIAデザインパターンに基づいてカスタムコンポーネントを作成することを容易にするために、新しいCDKプリミティブに取り組んでいます。Angular v14では、このプロジェクトの一環として、安定した[メニューとダイアログプリミティブ](https://material.angular.io/cdk/categories)が導入され、v15ではリストボックスが導入されました。
  </docs-card>
  <docs-card title="Angularコンポーネントのアクセシビリティ" href="">
  WCAGなどのアクセシビリティ標準に照らし合わせて、Angular Materialのコンポーネントを評価し、このプロセスから生じる問題を解決しています。
  </docs-card>
</docs-card-container>

### ツールの改善

<docs-card-container>
  <docs-card title="ng testでユニットテストツールを最新化する" href="">
  v12では、ProtractorをCypress、Nightwatch、WebDriver.ioなどの最新の代替手段に置き換えることで、Angularのエンドツーエンドテストエクスペリエンスを再検討しました。次に、Angularのユニットテストエクスペリエンスを最新化するために、`ng test`に取り組みたいと思います。2023年第2四半期に、実験的な[Jest](https://jestjs.io/)サポートを導入し、[発表](https://blog.angular.dev/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca)したように、Karmaから[Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)への移行を発表しました。

  今年後半には、Web Test RunnerをKarmaの代替として導入するために進捗を続け、Karmaを廃止していく予定です。
  </docs-card>
  <docs-card title="言語サービスでスタンドアロンインポートを合理化する" href="">
  このイニシアチブの一環として、言語サービスは、スタンドアロンアプリケーションとNgModuleベースのアプリケーションでコンポーネントとパイプを自動的にインポートします。さらに、アプリケーションバンドルを小さくするために、言語サービスで未使用のインポートを自動的に削除することを提案できるように取り組んでいます。
  </docs-card>
</docs-card-container>

## デフォルトで高速

<docs-card-container>
  <docs-card title="部分的ハイドレーションの調査" href="">
  v17ではハイドレーションを開発者プレビューから卒業させ、LCPで一貫して40〜50％の改善が見られました。その後、部分的なハイドレーションのプロトタイプを作成し、ng-confのステージでデモを共有しました。2024年に実験的なサポートを期待してください。
  </docs-card>
  <docs-card title="SSRおよび事前レンダリングでのイベントリプレイ" href="https://angular.dev/api/platform-browser/withEventReplay">
  v18では、サーバーサイドレンダリングまたは事前レンダリングを使用する場合のイベントリプレイ機能を導入しました。この機能は、Google.comで実行されているイベントディスパッチプリミティブ（以前はjsactionと呼ばれていました）に依存しています。

  今後数か月で、この機能に関するコミュニティからのフィードバックを収集し、安定版に卒業させる取り組みを進めます。
  </docs-card>
  <docs-card title="サーバールート構成" href="">
  サーバーでより人間工学的なルート構成を可能にするために取り組んでいます。サーバーサイドレンダリング、事前レンダリング、またはクライアントサイドレンダリングを行うルートを簡単に宣言できるようにしたいと考えています。

  現時点では、初期設計とプロトタイピング段階です。2024年後半に更新情報を期待してください。
  </docs-card>
</docs-card-container>

## 将来の作業、調査、プロトタイピング

このセクションは、将来の潜在的なプロジェクトの調査とプロトタイピングを表しています。妥当な結果は、現在のソリューションが最適なオプションであると判断することです。他のプロジェクトはウェブとフレームワークの革新が続くにつれてRFCを生み出し、進行中のプロジェクトに卒業するか優先順位が下げられる可能性があります。

<docs-card-container>
  <docs-card title="Angular DevToolsでの信号デバッグ" href="">
  Angularシグナルの進化に伴い、シグナルをデバッグするためのより優れたツールにも取り組んでいます。優先度の高いリストの1つは、シグナルベースのコンポーネントを検査およびデバッグするためのUIです。
  </docs-card>
  <docs-card title="HMR（ホットモジュールリロード）を改善する" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306">
  Angular CLIは現在、`ng serve --hmr`を使用してHMRをサポートしています。裏側では、これは主にAngularアプリケーションを最初から再レンダリングしますが、完全なページのリロードよりも優れていますが、間違いなく改善できます。最も重要なのは、この戦略は、その種の変更の頻度に合わせてスケールされた、任意の変更のターンアラウンド時間を最適化する必要があることです。将来的には、チームでHMRを改善するためのいくつかの機会を探求します。これには以下が含まれます。

- CSSのみの変更を高速化し、ページ上の既存のコンポーネントに適用します。
- Angularテンプレートのみの変更を高速化し、ページ上の既存のコンポーネントに適用します。
  </docs-card>
  <docs-card title="ストリーミングサーバーサイドレンダリングの調査" href="">
  過去数回のリリースでは、Angularのサーバーサイドレンダリングをより堅牢にするために取り組んできました。優先度の高いリストには、zonelessアプリケーションのストリーミングサーバーサイドレンダリングを調査することが含まれます。
  </docs-card>
  <docs-card title="記述フォーマットの改善のための調査" href="">
  開発者調査の結果に基づいて、コンポーネント記述フォーマットの使いやすさを改善する機会があることがわかりました。プロセスの最初のステップは、要件を収集し、RFCに進む前に問題領域を理解することです。進捗状況に応じて更新情報を共有します。将来の作業における高い優先度は、下位互換性と相互運用性です。
  </docs-card>
  <docs-card title="2次元ドラッグアンドドロップをサポートする" href="https://github.com/angular/components/issues/13372">
  このプロジェクトの一環として、Angular CDKのドラッグアンドドロップに混合方向のサポートを実装したいと思います。これは、リポジトリで最も多く要求されている機能の1つです。
  </docs-card>
  <docs-card title="Angular CLIでのNitroサポートの評価" href="https://nitro.unjs.io/">
  ポータビリティ、最小限の設計、ファイルベースのルーティングなど、Nitroが提供する機能セットに興奮しています。今年後半には、それがAngularのサーバーサイドレンダリングモデルにどのように適合するかを評価します。

  調査の進捗状況に応じて更新情報を共有します。
  </docs-card>
</docs-card-container>

## 完了したプロジェクト

<docs-card-container>
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
