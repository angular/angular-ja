# Angularのロードマップ

<p class="roadmap-last-updated">Last updated: 2021-05-19</p>

Angularは、Google内からも、より広範なオープンソースコミュニティからも、多くの機能リクエストを受け取ります。 同時に、私たちのプロジェクトのリストには、メンテナンスタスク、コードのリファクタリング、潜在的なパフォーマンスの向上などがたくさん含まれています。 私たちは、Dev Relや製品管理、エンジニアリングの代表者を集めて、このリストに優先順位を付けます。 新しいプロジェクトがキューに入ると、他のプロジェクトに対する相対的な優先順位に基づいて、それらを定期的に配置します。 作業が完了すると、プロジェクトはキューの上位に移動します。

次のプロジェクトは、特定のAngularバージョンに関連付けられていません。 完了したときにリリースされ、セマンティックバージョニングにしたがって、リリーススケジュールに基づいて特定のバージョンの一部になります。 たとえば、機能追加は完成後に次のマイナーでリリースされますが、破壊的な変更が含まれている場合は次のメジャーでリリースされます。

## 進行中

### テスト環境の自動ティアダウンによるテスト時間とデバッグの改善

テスト時間を改善し、テスト間の分離を改善するために、<code>[TestBed](api/core/testing/TestBed)</code> を変更して、各テスト実行後にテスト環境を自動的にクリーンアップしたり、分解したりするようにしたいと思います。

### Deprecate and remove IE11 support

IE11 has been preventing Angular from taking advantage of some of the modern features of the Web platform. As part of this project we are going to deprecate and remove IE11 support to open the path for modern features that evergreen browsers provide. We ran an [RFC](https://github.com/angular/angular/issues/41840) to collected feedback from the community and decide on next steps to move forward.

### Leverage ES2017+ as the default output language

Supporting modern browsers will allow us to leverage the more compact, expressive, and performant new syntax of JavaScript. As part of this project we’ll investigate what are the blockers to move forward with this effort and take the steps forward to enable it.

### リグレッションを検出するためにパフォーマンス・ダッシュボードを刷新

Angularがパフォーマンス基準に沿ったものであることを確認するために、コード変更のたびに実行するベンチマークのセットを用意しています。コード変更後にフレームワークのランタイムがリグレッションしないようにするために、ダッシュボードが踏む既存のインフラの一部を改良する必要があります。

### [MDC Web](https://material.io/develop/web/)の統合によるAngular Material Componentsの強化

MDC Webは、GoogleのMaterial Designチームが作成したライブラリで、Material Designコンポーネントを構築するための再利用可能なプリミティブを提供します。 AngularチームはこれらのプリミティブをAngular Materialに組み込んでいます。 MDC Webを使用すると、Angular MaterialがMaterial Designの仕様により密接に連携し、アクセシビリティが拡張され、全体的にコンポーネントの品質が向上し、チームの速度が向上します。

### Angular component accessibility

We're evaluating components in Angular Material against accessibility standards such as WCAG and working to fix any issues that arise from this process.

### レガシー[View Engine](guide/ivy)の削除

すべての内部ツールのIvyへの移行が完了したら、レガシーView Engineを削除して、Angularの概念的オーバーヘッドを小さくし、パッケージサイズを小さくして、メンテナンスコストを削減し、コードベースの複雑さを減らします。

### Publish guides on advanced concepts

Develop and publish an in-depth guide on change detection. Develop content for performance profiling of Angular applications. Cover how change detection interacts with Zone.js and explain when it gets triggered, how to profile its duration, as well as common practices for performance optimization.

### E2Eテスト戦略のアップデート

将来を見据えたe2eテスト戦略を確実に提供するために、Protractorの現状、コミュニティによるイノベーション、e2eのベストプラクティスを評価し、新しい可能性を模索したいと考えています。As first steps of the effort, we shared an [RFC](https://github.com/angular/protractor/issues/5502) and worked with partners to ensure smooth integration between the Angular CLI and state of the art tooling for e2e testing. As the next step, we need to finalize the recommendations and compile a list of resources for the transition.

### Ivyを利用したAngularライブラリ

2020年の初め、私たちはIvyライブラリ配布のための[RFC](https://github.com/angular/angular/issues/38366)を共有しました。コミュニティからの貴重なフィードバックの後、私たちはプロジェクトのデザインを開発しました。現在、Ivyコンパイルを利用するためのライブラリパッケージフォーマットの更新、View Engineライブラリフォーマットの非推奨のブロック解除、[ngcc](guide/glossary#ngcc)など、Ivyライブラリ配布の開発に投資しています。

### 将来のRxJSの変更（v7以降）にスムーズに対応できるようにする

Angular開発者がRxJSの最新機能を活用し、フレームワークの次のメジャーリリースにスムーズに移行できるようにしたいと考えています。この目的のために、RxJSのv7以降の変更の範囲を調査および文書化し、更新戦略を計画します。

### オプショナルのNgModulesを使用したシンプルなAngularメンタルモデル

Angularメンタルモデルと学習経路を簡略化するために、NgModulesをオプションにすることに取り組みます。この作業により、開発者はスタンドアロンコンポーネントを開発し、コンポーネントのコンパイルスコープを宣言するための代替APIを実装できます。

## 将来

### Investigate micro frontend architecture for scalable development processes

Look into independent deployability and development of large-scale applications to improve efficiency and productivity. The Angular community has an established story for micro frontend support. As part of this effort, we’d investigate what would be the correct abstractions to provide better support.

### 開発者が使いやすい `@angular/forms` の厳格なタイピングを実現

リアクティブフォームのより厳密な型チェックの実装に取り組みます。 このようにして、開発者は開発中により多くの問題をキャッチし、テキストエディターとIDEへのより優れたサポートを有効にし、リアクティブフォームの型チェックを改善できます。

### Zone.jsのオプトアウトでのフレームワーク機能のフル活用

Zone.jsをAngularアプリケーションからオプショナルにするための計画を設計して実装します。これにより、フレームワークを簡素化し、デバッグを改善し、アプリケーションバンドルのサイズを縮小します。さらに、これにより、現在Zone.jsでサポートされていないネイティブのasync/await構文を利用できるようになります。

### ngc を tsc プラグインディストリビューションとして使用することによるビルドのパフォーマンス向上

Angular コンパイラを TypeScript コンパイラのプラグインとして配布することで、開発者のビルドパフォーマンスを大幅に向上させ、メンテナンスコストを削減することができます。

### Support adding directives to host elements

A long-standing feature request is to add the ability to add directives to host elements. The feature will allow developers to augment their own components with additional behaviors without using inheritance. The project will require substantial effort in terms of the definition of APIs, semantics, and implementation.

### 使いやすいコンポーネントレベルのコード分割API

Webアプリケーションの一般的な問題は、初期ロード時間が遅いことです。それを改善するひとつの方法は、コンポーネントレベルでより細かいコード分割を適用することです。このプラクティスを促進するために、より使いやすいコード分割APIに取り組みます。

<details class="completed-details" open="true">
<summary>
  <h2>Completed</h2>
  <span class="actions">
    <span class="action-expand">Show all</span>
    <span class="action-collapse">Hide all</span>
    <i class="material-icons expand">expand_more</i>
  </span>
</summary>
<div class="details-content">

### Accelerated debugging and performance profiling with Angular DevTools

_Completed Q2 2021_

デバッグやパフォーマンスプロファイリングのためのユーティリティを提供するAngularの開発ツールに取り組んでいます。このプロジェクトでは、Angularアプリケーションのコンポーネント構造や変更検知を開発者が理解できるようにすることを目的としています。

### 統合されたAngularのバージョニングとブランチでリリースを効率化

_Completed Q2 2021_

Angularの複数のGitHubリポジトリ（[angular/angular](https://github.com/angular/angular)、[angular/angular-cli](https://github.com/angular/angular-cli)、および[angular/components](https://github.com/angular/components)）間でリリース管理ツールを統合したいと考えています。この取り組みにより、インフラストラクチャの再利用、プロセスの統一と簡素化、リリースプロセスの信頼性の向上が可能になります。

### コミットメッセージの標準化による開発者の一貫性の向上

_Completed Q2 2021_

開発プロセスに一貫性を持たせ、インフラストラクチャツールを再利用するために、Angularリポジトリ全体（[angular/angular](https://github.com/angular/angular)、[angular/components](https://github.com/angular/components)、および[angular/angular-cli](https://github.com/angular/angular-cli)）でコミットメッセージの要件と準拠を統一したいと考えています。

### Angularの言語サービスをIvyに移行する

_Completed Q2 2021_

このプロジェクトの目標は、言語サービスをIvyに移行することでエクスペリエンスを向上させ、レガシーな依存関係を取り除くことです。現在、言語サービスは Ivy アプリケーションでも View Engine コンパイラと型チェックを使用しています。私たちは、アプリケーションの動作に合わせてAngular LanguageサービスにIvyのテンプレートパーサーと改良された型チェックを使用したいと考えています。また、今回の移行はView Engineの削除のブロック解除に向けた一歩となり、Angularの簡素化、npmのパッケージサイズの縮小、フレームワークの保守性の向上につながります。

### ネイティブな[Trusted Types](https://web.dev/trusted-types/)でAngularのセキュリティを強化する

_Completed Q2 2021_

Googleのセキュリティチームと協力して、新しいTrusted Types APIのサポートを追加します。 このWebプラットフォームAPIは、開発者がより安全なWebアプリケーションを構築するのに役立ちます。

### Angular CLI webpack 5でビルド速度とバンドルサイズを最適化

_Completed Q2 2021_

v11リリースの一環として、Angular CLIでwebpack 5のオプトインプレビューを導入しました。安定性を確保するために、ビルド速度とバンドルサイズの改善を可能にするための実装を引き続きイテレーションしていきます。

### ユニバーサルアプリケーションにおける重要なスタイルのインライン化によるアプリケーション高速化

_Completed Q1 2021_

外部スタイルシートの読み込みはブロッキング操作であり、ブラウザは参照されているすべての CSS を読み込むまでアプリケーションのレンダリングを開始できないことを意味します。ページのヘッダーにレンダーブロッキングリソースがあると、そのロードパフォーマンスに大きな影響を与える可能性があり、たとえば、[First contentful paint](https://web.dev/first-contentful-paint/)などです。アプリケーションを高速化するために、Google Chrome チームと協力して、重要な CSS をインライン化し、残りのスタイルを非同期にロードします。

### よりよいAngularエラーメッセージでデバッグを改善

_Completed Q1 2021_

エラーメッセージは、開発者がそれらを解決するのに役立つ実用的な情報が限られていることがよくあります。私たちは、よりスムーズなデバッグ体験を保証するために、関連するコード、開発ガイド、およびその他の資料を追加することで、エラーメッセージをより発見しやすくするために取り組んでいます。

### 刷新された入門ドキュメントによる開発者のオンボーディングの改善

_Completed Q1 2021_

ユーザーの学習ジャーニーを再定義し、入門ドキュメントを更新します。 Angularの利点とその機能を探る方法を明確に述べ、開発者が可能な限り短時間でフレームワークに習熟できるようにガイダンスを提供します。

### Expand component harnesses best practices

_Completed Q1 2021_

Angular CDK introduced the concept of [component test harnesses](https://material.angular.io/cdk/test-harnesses) to Angular in version 9. Test harnesses allow component authors to create supported APIs for testing component interactions. We're continuing to improve this harness infrastructure and clarifying the best practices around using harnesses. We're also working to drive more harness adoption inside of Google.

### Author a guide for content projection

_Completed Q2 2021_

Content projection is a core Angular concept that does not have the presence it deserves in the documentation. As part of this project we want to identify the core use cases and concepts for content projection and document them.

### Migrate to ESLint

_Completed Q4 2020_

With the deprecation of TSLint we will be moving to ESLint. As part of the process, we will work on ensuring backward compatibility with our current recommended TSLint configuration, implement a migration strategy for existing Angular applications and introduce new tooling to the Angular CLI toolchain.

### Operation Bye Bye Backlog (aka Operation Byelog) 

_Completed Q4 2020_

We are actively investing up to 50% of our engineering capacity on triaging issues and PRs until we have a clear understanding of broader community needs. After that, we'll commit up to 20% of our engineering capacity to keep up with new submissions promptly.

</div>
</details>
