# Angularのバージョンとリリース

私たちはAngularフレームワークには安定性が必要であると認識しています。
安定性によって、再利用可能なコンポーネントやライブラリ、チュートリアル、ツール、学習されたプラクティスが予期せず時代遅れになることはありません。 
Angularが発展するまわりのエコシステムには安定性が不可欠です。

また、Angularが進化を続けたいという願望も共有しています。
私たちは、あなたが構築している基盤が継続的に改善されていること、そしてその他のウェブ・エコシステムとユーザーのニーズを常に最新の状態に保てることを確実にするよう努めています。

このドキュメントには、安定性とバランスのとれた最先端のアプリケーション開発プラットフォームを提供するために私たちが従うプラクティスが含まれています。
私たちは将来の変化が常に予測可能な方法で導入されるように努めています。 
Angularに依存しているすべての人に、新しい機能が追加される時期と方法を知り、時代遅れの機能が削除されたときに十分に準備されることを願っています。

Sometimes *breaking changes*, such as the removal of APIs or features, are necessary to innovate and stay current with evolving best practices, changing dependencies, or shifts in the web platform. These breaking changes go through a deprecation process explained in our [deprecation policy](#deprecation-policy).

To make these transitions as straightforward as possible, the Angular team makes these commitments:

*   We work hard to minimize the number of breaking changes and to provide migration tools when possible
*   We follow the deprecation policy described here, so you have time to update your applications to the latest APIs and best practices

<div class="alert is-helpful">

このドキュメントで説明するプラクティスは、Angular 2.0以降に適用されます。
現在AngularJSを使用している場合は、[AngularJSからのアップグレード](guide/upgrade "Upgrading from Angular JS")を参照してください。 
*AngularJS*はすべてのv1.xバージョンのAngularの名前です。

</div>

<a id="versioning"></a>

## Angularのバージョニング

Angularのバージョン番号は、リリースで導入された変更のレベルを示します。この[セマンティックバージョン](https://semver.org/ "Semantic Versioning Specification")管理を使用すると、新しいバージョンへの更新の潜在的な影響を理解するのに役立ちます。

Angularのバージョン番号には3つの部分があります: `major.minor.patch`。たとえば、バージョン7.2.11は、メジャーバージョン7、マイナーバージョン2、およびパッチバージョン11を示します。

バージョン番号は、リリースに含まれる変更のレベルに基づいて増えていきます。

* **メジャーリリース** には重要な新機能が含まれていますが、更新には最小限の開発者の協力が求められます。新しいメジャーリリースにアップデートするときは、アップデートスクリプト、リファクタリングコード、追加テストの実行、新しいAPIの学習が必要な場合があります。


* **マイナーリリース** には新しい小さな機能が含まれています。マイナーリリースは完全に後方互換性があります。アップデート中に開発者の協力は必要ありませんが、リリースで追加された新しいAPI、機能、および機能を使用するようにアプリケーションやライブラリを修正することもできます。サポートされているバージョンを拡張することで、マイナーバージョンのピア依存関係を更新しますが、プロジェクトにこれらの依存関係を更新を求めることはありません。


* **パッチリリース** は低リスクなバグ修正リリースです。更新中に開発者の協力は求められません。

<div class="alert is-helpful">

**Note:** As of Angular version 7, the major versions of Angular core and the CLI are aligned. This means that in order to use the CLI as you develop an Angular app, the version of `@angular/core` and the CLI need to be the same.

</div>

<a id="previews"></a>

### プレビューリリース

個々のメジャーリリースとマイナーリリースごとに、"Next"リリースとリリース候補版（`rc`）を提供することで、今後の展開を先取りできるようにしています。

* **Next:** 活発な開発とテストの下にあるリリース。ベータリリースは、`8.0.0-beta.0` のように `beta` 識別子を付加したリリースタグで示されます。

* **リリース候補:** 機能が完成し最終テストが行​​われているプレリリース。リリース候補版は、バージョン `8.1.0-rc` のように、`rc` 識別子が付加されたリリースタグで示されます。

次期バージョンのドキュメントは [next.angular.io](https://next.angular.io) から入手できます。これには、ベータ版またはリリース候補の機能およびAPIに関するすべての資料が含まれます。


{@a frequency}
## リリース周期

定期的なリリーススケジュールに向けて作業を進めており、Angularの進化と共にアップデートを計画し、調整することができます。

<div class="alert is-helpful">

日付は一般的なガイダンスとして提供されており、変更される場合があります

</div>

基本的に、次のリリースサイクルが予想されます。

* 6か月ごとのメジャーリリース

* メジャーリリースごとに1回から3回のマイナーリリース

* ほぼ毎週のパッチリリースとプレリリース（`next`または`rc`）

この一連のリリースにより、熱心な開発者は、十分に開発され、コードレビューおよび統合テストプロセスを経てすぐに新機能にアクセスできるようになります。プレリリースビルドを使用するGoogleおよびその他の開発者によって検証されています。


{@a lts}
{@a support}
## サポートポリシーとスケジュール

<div class="alert is-helpful">

推定される日付は一般的なガイダンスとして提供されており、変更される場合があります

</div>

### リリーススケジュール {@a release-schedule}

| Version | Date               |
|:--------|:-------------------|
| v17.1   | Week of 2024-01-15 |
| v17.2   | Week of 2024-02-12 |
| v17.3   | Week of 2024-03-11 |
| v18.0   | Week of 2024-05-20 |

### サポート期間 {@a support-window}

すべてのメジャーリリースは原則として18か月間サポートされます。

* 上記の[リリース周期](#frequency "Release frequency")で説明したように、定期的にスケジュールされたアップデートとパッチがリリースされる、6ヶ月の*アクティブサポート*。

* 12ヶ月の*長期サポート（LTS）*。LTS期間中は、[重要な修正とセキュリティパッチ](#lts-fixes)のみがリリースされます。

### 現在サポート中のバージョン {@a actively-supported-versions}

次の表は、サポート対象のAngularバージョンのステータスを示しています


| バージョン | 状態 | リリース     | アクティブの終了  | LTSの終了|
|:--------|:-------|:-----------|:------------|:-----------|
| ^17.0.0 | Active | 2023-11-08 | 2024-05-08  | 2025-05-15 |
| ^16.0.0 | LTS    | 2023-05-03 | 2023-11-08  | 2024-11-08 |
| ^15.0.0 | LTS    | 2022-11-18 | 2023-05-03  | 2024-05-18 |

Angularバージョン v2 から v14 のサポートは終了しました。

### LTS の修正 {@a lts-fixes}

原則として、LTSバージョンでは次のいずれかを解決するものが修正とみなされます。

* 新たに確認されたセキュリティ上の脆弱性
* LTS開始以降、ブラウザの新バージョンなどサードパーティの変更に起因して発生したリグレッション

{@a deprecation}

## 非推奨化ポリシー {@a deprecation-policy}

AngularチームがAPIや機能を削除する場合、*deprecated*とマークされます。これはAPIが廃止されたり、他のAPIに取って代わられたり、その他の方法で廃止される場合に発生します。非推奨APIは最低でも2つのメジャーバージョン（約1年間）続く非推奨フェーズまでは利用可能です。

更新に十分な時間と明確なパスがあることを確認するための、非推奨化のポリシーはこちらです。

* **告知:** [チェンジログ](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angular change log") に廃止予定のAPIおよび機能をお知らせします。廃止予定のAPIは、 [ドキュメンテーション](api?status=deprecated) に取り消し線付きで記載されています。廃止予定を発表した場合は、推奨されるアップデートパスも発表します。便利になるように、 [非推奨リスト](guide/deprecations) には廃止予定のAPIと機能の要約が含まれています。

| Deprecation stages | Details |
|:---                |:---     |
| Announcement       | We announce deprecated APIs and features in the [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angular change log"). Deprecated APIs appear in the [documentation](api?status=deprecated) with ~~strikethrough~~. When we announce a deprecation, we also announce a recommended update path. For convenience, [Deprecations](guide/deprecations) contains a summary of deprecated APIs, and features. Additionally, all deprecated APIs are annotated with `@deprecated` in the corresponding documentation, which enables text editors and IDEs to provide hints if your project depends on them.                            |
| Deprecation period | When an API or a feature is deprecated, it will remain in a supported release for a period of at least 12 months. A deprecation can be announced in any release, but the removal of a deprecated API or feature happens only in major release. Until a deprecated API or feature is removed, it is maintained according to the LTS support policy, meaning that only critical and security issues are fixed. |
| npm dependencies   | We only make npm dependency updates that require changes to your applications in a major release. In minor releases, we update peer dependencies by expanding the supported versions, but we do not require projects to update these dependencies until a future major version. This means that during minor Angular releases, npm dependency updates within Angular applications and libraries are optional.                                               |

<a id="public-api"></a>

## Compatibility policy

Angularは、多くのパッケージ、サブプロジェクト、ツールのコレクションです。プライベートAPIの偶発的な使用を防ぐために（ここで説明するプラクティスの対象を明確に理解できるように）私たちは公開APIと見なされるものとそうでないものを明文化します。詳細については、[Angularでサポートされている公開API](https://github.com/angular/angular/blob/main/docs/PUBLIC_API.md "Supported Public API Surface of Angular")を参照してください。

To guarantee backward compatibility of Angular we run a series of checks before we merge any change:

* Unit tests and integration tests
* Comparing the type definitions of the public API surface before and after the change
* Running the tests of all the applications at Google that depend on Angular

Any changes to the public API surface are made in accordance with the versioning, support, and depreciation policies previously described. In exceptional cases, such as critical security patches, fixes may introduce backwards incompatible changes. Such exceptional cases are accompanied by explicit notice on the framework's official communication channels.
<a id="updating"></a>

## Breaking change policy and update paths

Breaking change requires you to do work because the state after it is not backward compatible with the state before it. You can find the rare exceptions from this rule in the [Compatibility policy](#compatibility-policy). Examples of breaking changes are the removal of public APIs or other changes of the type definition of Angular, changing the timing of calls, or updating to a new version of a dependency of Angular, which includes breaking changes itself.

To support you in case of breaking changes in Angular:

* We follow our [deprecation policy](#deprecation-policy) before we remove a public API
* Support update automation via the `ng update` command. It provides code transformations which we often have tested ahead of time over hundreds of thousands of projects at Google
* Step by step instructions how to update from one major version to another at the ["Angular Update Guide"](https://update.angular.io/)

You can `ng update` to any version of Angular, provided that the following criteria are met:

*   The version you want to update *to* is supported.
*   The version you want to update *from* is within one major version of the version you want to
    upgrade to.

For example, you can update from version 11 to version 12, provided that version 12 is still supported.
If you want to update across multiple major versions, perform each update one major version at a time.
For example, to update from version 10 to version 12:

1.  Update from version 10 to version 11.
1.  Update from version 11 to version 12.

<a id="developer-preview"></a>

## 開発者プレビュー（Developer Preview）

たまに、「Developer Preview」というラベルで新しいAPIを紹介することがあります。これらは、十分に機能し、洗練されたAPIですが、私たちの通常の非推奨化ポリシーで安定化する準備ができていません。

これは、安定化する前に実際のアプリケーションからフィードバックを集めたい、あるいは関連するドキュメントや移行ツールが完全に完成していないのが理由です。

このドキュメントで説明されているポリシーとプラクティスは、Developer PreviewとマークされたAPIには適用されません。そのようなAPIは、フレームワークの新しいパッチバージョンであっても、いつでも変更されます。Developer Preview APIを使用する利点が、通常のセマンティック・バージョニングの利用から外れた破壊的変更のリスクに見合うかどうかは、チームで自己判断する必要があります。

## 実験的API {@a experimental}

これらのAPIはまったく安定しないか、安定する前に大きな変更がある可能性があります。

このドキュメントで説明されているポリシーとプラクティスは、実験的とマークされたAPIには適用されません。そのようなAPIは、フレームワークの新しいパッチバージョンであっても、いつでも変更される可能性があります。実験的なAPIを使用する利点が、セマンティック・バージョニングの通常の使用方法以外の変更を壊してしまうリスクに見合うかどうかは、チーム自身で判断してください。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2024-02-08
