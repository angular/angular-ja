<docs-decorative-header title="Angularとは？" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

<big style="margin-top: 2em">
Angularは、開発者が高速で信頼性の高いアプリケーションを構築できるようにするWebフレームワークです。
</big>

Googleの専門チームによって管理されているAngularは、
開発ワークフローを簡素化し効率化するためのツール、API、ライブラリの幅広いスイートを提供します。 
Angularは、チームの規模やコードベースの規模に合わせて拡張できる、
高速で信頼性の高いアプリケーションを構築するための堅牢なプラットフォームを提供します。

**コードを確認したいですか？** Angularの使い方の概要を簡単に確認するには、
[基本要素](essentials)にアクセスしてください。
ステップバイステップの手順に従いたい場合は、[チュートリアル](tutorials/learn-angular)で始めることができます。

## 開発を強力にサポートする機能

<docs-card-container>
  <docs-card title="独自のコンポーネントモデルと、
  柔軟な依存性の注入システムでコードベースを整理する" href="guide/components" link="コンポーネント入門">
  Angularのコンポーネントを使用すると、コードをうまくカプセル化して簡単に分割できます。

  汎用性の高い依存性の注入により、コードをモジュール化し、
  疎結合かつテスト可能に保つことができます。
  </docs-card>
  <docs-card title="シグナルに基づいたきめ細かなリアクティビティで高速な状態更新を実現する" href="guide/signals" link="Angularシグナルを探索">
  コンパイル時の最適化と組み合わせたきめ細かなリアクティビティモデルは、開発を簡素化し、より高速なアプリケーションの構築をデフォルトで支援します。

  アプリケーション全体で状態がどのように、どこで使用されているかを詳細に追跡し、高度に最適化された命令を通じてフレームワークが高速な更新をレンダリングできるようにします。
  </docs-card>
  <docs-card title="SSR、SSG、ハイドレーション、次世代の遅延読み込みでパフォーマンス目標を達成する" href="guide/ssr" link="SSRについて読む">
  Angularは、完全なDOMハイドレーションと並んで、サーバーサイドレンダリング (SSR) と
  静的サイト生成 (SSG) の両方をサポートします。テンプレート内の `@defer` ブロックを使用して、
  テンプレートを遅延読み込み可能な部分へ宣言的に分割することが簡単にできます。
  </docs-card>
  <docs-card title="フォームやルーティングなどのAngular公式モジュールと連携してすべてが動作することを保証します">
  [Angularのルーター](guide/routing)は、ルート保護、データ解決、遅延読み込みなど、
  機能豊富なナビゲーションツールキットを提供します。

  [Angularのフォームモジュール](guide/forms)は、
  カスタムフォーム要素とバリデーションのための標準化されたシステムを提供します。
  </docs-card>
</docs-card-container>

## これまでにない開発速度

<docs-card-container>
  <docs-card title="Angular CLIで簡単に構築、サーブ、テスト、デプロイ" href="tools/cli" link="Angular CLI">
  Angular CLI を使用すると、
  本番アプリケーションをデプロイするのに必要なコマンドでプロジェクトをあっという間に実行できます。
  </docs-card>
  <docs-card title="Angular DevToolsブラウザ拡張機能でコードを視覚的にデバッグ、分析、最適化" href="tools/devtools" link="Angular DevTools">
  Angular DevToolsはブラウザの開発者ツールと一緒に使用できます。 
  コンポーネントツリーインスペクター、依存性の注入ツリービュー、独自のパフォーマンスプロファイリングフレームチャートなど、
  アプリのデバッグと分析に役立ちます。
  </docs-card>
  <docs-card title="ng update でバージョンを見逃さない" href="cli/update" link="ng update">
  Angular CLIの `ng update` は、規則的な破壊的変更を自動的に処理する自動コード変換を実行し、
  メジャーバージョンアップデートを大幅に簡素化します。 
  最新バージョンを維持することで、アプリをできるだけ高速かつ安全に保つことができます。
  </docs-card>
  <docs-card title="お気に入りのエディタでのIDE統合で生産性を維持" href="tools/language-service" link="言語サービス">
  AngularのIDE言語サービスは、お気に入りのエディタでのコード補完、ナビゲーション、
  リファクタリング、リアルタイム診断を強化します。
  </docs-card>
</docs-card-container>

## 自信を持ってリリース

<docs-card-container>
  <docs-card title="Googleの巨大なモノレポで全コミットが検証済み" href="https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext" link="Googleのモノレポについて学ぶ">
  Angularのすべてのコミットは、Googleの内部コードリポジトリにある、
  数え切れない現実世界のシナリオを表す_数十万_のテストでチェックされてます。

  Angularは、Google Cloudを含むGoogleの最大級の製品の安定性にコミットしています。
  このコミットメントにより、変更点が十分にテストされ、後方互換性を保ち、
  可能な限り移行ツールが含まれることを保証します。
  </docs-card>
  <docs-card title="明確なサポートポリシーと予測可能なリリーススケジュール" href="reference/releases" link="バージョニングとリリース">
  Angularの予測可能な時間ベースのリリーススケジュールにより、
  組織はフレームワークの安定性と後方互換性について自信を持つことができます。
  長期サポート (LTS) ウィンドウにより、必要なときに重要なセキュリティ修正を入手できます。
  ファーストパーティの更新ツールやガイド、自動移行Schematicsは、
  アプリケーションをフレームワークとWebプラットフォームの最新の発展に合わせて最新の状態に保つのに役立ちます。
  </docs-card>
</docs-card-container>

## あらゆる規模で機能する

<docs-card-container>
  <docs-card title="国際化サポートで世界中のユーザーにリーチ" href="guide/i18n" link="国際化">
  Angularの国際化機能は、メッセージの翻訳とフォーマットを処理し、
  Unicode標準のICU構文のサポートを含みます。
  </docs-card>
  <docs-card title="デフォルトでセキュリティを確保してユーザーを保護する" href="best-practices/security" link="セキュリティ">
  Googleの世界クラスのセキュリティエンジニアとのコラボレーションにより、
  Angularはデフォルトで安全な開発を目指しています。 
  HTMLサニタイズやTrusted Typesサポートなどの組み込みセキュリティ機能により、
  クロスサイトスクリプティングやクロスサイトリクエストフォージェリなどの一般的な脆弱性からユーザーを保護します。
  </docs-card>
  <docs-card title="Viteとesbuildで大規模チームの生産性を維持" href="tools/cli/build-system-migration" link="ESBuildとVite">
  Angular CLIには、ViteとESBuildを使用した高速で最新のビルドパイプラインが含まれています。
  開発者は、数十万行のコードを含むプロジェクトを1分未満でビルドしていると報告しています。
  </docs-card>
  <docs-card title="Googleの最大級のWebアプリで実証済み">
  Googleの大規模なプロダクトはAngularのアーキテクチャに基づいて構築されており、[Google Fonts](https://fonts.google.com/)から[Google Cloud](https://console.cloud.google.com)まで、
  Angularのスケーラビリティをさらに向上させる新機能の開発に役立っています。
  </docs-card>
</docs-card-container>

## オープンソースファースト

<docs-card-container>
  <docs-card title="GitHubでオープンに開発" href="https://github.com/angular/angular" link="GitHubでスターを送る">
  私たちが何に取り組んでいるのか興味がありますか？ すべてのPRとコミットはGitHubで公開されています。問題やバグに遭遇しましたか？GitHubのイシューを定期的に分類して、コミュニティに反応し、関わりを持ち、直面している現実世界の問題を解決できるようにしています。
  </docs-card>
  <docs-card title="開発の透明性" href="roadmap" link="公開ロードマップを読む">
  私たちのチームは、現在および将来の作業のロードマップを公開しており、あなたのフィードバックを大切にしています。大きな機能変更に関するフィードバックを収集し、コミュニティの声を聞きながらAngularの将来の方向性を形作るために、Request for Comments (RFC) を公開しています。
  </docs-card>
</docs-card-container>

## 活気のあるコミュニティ

<docs-card-container>
  <docs-card title="学習コース、ブログ、資料" href="https://devlibrary.withgoogle.com/products/angular?sort=added" link="DevLibraryをチェック">
  私たちのコミュニティには才能ある開発者、ライター、インストラクター、ポッドキャスターなどがいます。Google for Developersのライブラリは、新人から経験豊富な開発者までが継続的に開発するための高品質なリソースのほんの一例です。
  </docs-card>
  <docs-card title="オープンソース" href="https://github.com/angular/angular/blob/main/CONTRIBUTING.md" link="Angularに貢献しよう">
  私たちは、Angularをすべての人に適したフレームワークにするオープンソースコントリビューターに感謝しています。ドキュメントのタイプミスを修正することから主要な機能を追加することまで、興味のある方は誰でもGitHubで始めることを歓迎します。
  </docs-card>
  <docs-card title="コミュニティパートナーシップ" href="https://developers.google.com/community/experts/directory?specialization=angular" link="Angular GDEに会う">
  私たちのチームは、個人、教育者、企業と提携して、開発者を常にサポートできるようにしています。AngularのGoogle Developer Experts (GDE) は、世界中のコミュニティリーダーを代表して、Angularでの教育、組織化、開発を行っています。エンタープライズパートナーシップは、Angularがテクノロジー業界のリーダーにとって優れたスケーラビリティを実現できるようにします。
  </docs-card>
  <docs-card title="他のGoogleテクノロジーとのパートナーシップ">
  Angularは、他のGoogleテクノロジーやチームと緊密に連携してWebを改善しています。

  ChromeのAuroraとの継続的なパートナーシップにより、NgOptimizedImageなどの組み込みパフォーマンス最適化やAngularのCore Web Vitalsの改善など、Web全体でのユーザー体験の向上を積極的に探求しています。

  また、[Firebase](https://firebase.google.com/)、[Tensorflow](https://www.tensorflow.org/)、[Flutter](https://flutter.dev/)、[Material Design](https://m3.material.io/)、[Google Cloud](https://cloud.google.com/) と連携して、開発者ワークフロー全体で有意義な統合を提供しています。
  </docs-card>
</docs-card-container>

<docs-callout title="勢いに乗ろう！">
  <docs-pill-row>
    <docs-pill href="roadmap" title="Angularのロードマップを読む"/>
    <docs-pill href="playground" title="プレイグラウンドを試す"/>
    <docs-pill href="tutorials" title="チュートリアルで学ぶ"/>
    <docs-pill href="https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF" title="YouTubeのコースを見る"/>
    <docs-pill href="api" title="APIを参照する"/>
  </docs-pill-row>
</docs-callout>
