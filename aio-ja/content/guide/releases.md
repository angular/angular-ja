# Angularのバージョンとリリース

私たちはAngularフレームワークには安定性が必要であると認識しています。安定性によって、再利用可能なコンポーネントやライブラリ、チュートリアル、ツール、学習されたプラクティスが予期せず時代遅れになることはありません。 Angularが発展するまわりのエコシステムには安定性が不可欠です。

また、Angularが進化を続けたいという願望も共有しています。私たちは、あなたが構築している基盤が継続的に改善されていること、そしてその他のウェブ・エコシステムとユーザーのニーズを常に最新の状態に保てることを確実にするよう努めています。

このドキュメントには、安定性とバランスのとれた最先端のアプリケーション開発プラットフォームを提供するために私たちが従うプラクティスが含まれています。私たちは将来の変化が常に予測可能な方法で導入されるように努めています。 Angularに依存しているすべての人に、新しい機能が追加される時期と方法を知り、時代遅れの機能が削除されたときに十分に準備されることを願っています。


<div class="alert is-helpful">

このドキュメントで説明するプラクティスは、Angular 2.0以降に適用されます。現在AngularJSを使用している場合は、[AngularJSからのアップグレード](guide/upgrade "Upgrading from Angular JS")を参照してください。 _AngularJS_はすべてのv1.xバージョンのAngularの名前です。

</div>


{@a versioning}
## Angularのバージョニング

Angularのバージョン番号は、リリースで導入された変更のレベルを示します。この[セマンティックバージョン](https://semver.org/ "Semantic Versioning Specification")管理を使用すると、新しいバージョンへの更新の潜在的な影響を理解するのに役立ちます。

Angularのバージョン番号には3つの部分があります: `major.minor.patch`。たとえば、バージョン7.2.11は、メジャーバージョン7、マイナーバージョン2、およびパッチバージョン11を示します。

バージョン番号は、リリースに含まれる変更のレベルに基づいて増えていきます。

* **メジャーリリース** には重要な新機能が含まれていますが、更新には最小限の開発者の協力が求められます。新しいメジャーリリースにアップデートするときは、アップデートスクリプト、リファクタリングコード、追加テストの実行、新しいAPIの学習が必要な場合があります。


* **マイナーリリース** には新しい小さな機能が含まれています。マイナーリリースは完全に後方互換性があります。アップデート中に開発者の協力は必要ありませんが、リリースで追加された新しいAPI、機能、および機能を使用するようにアプリケーションやライブラリを修正することもできます。サポートされているバージョンを拡張することで、マイナーバージョンのピア依存関係を更新しますが、プロジェクトにこれらの依存関係を更新を求めることはありません。

* **パッチリリース** は低リスクでなバグ修正リリースです。更新中に開発者の協力は求められません。


{@a updating}
### Supported update paths

In alignment with the versioning scheme described above, we commit to support the following update paths:

* **同じメジャーバージョン** 内で更新する場合は、中間バージョンをスキップしてターゲットバージョンに直接更新することができます。たとえば、7.0.0から7.2.11に更新する場合は、直接更新できます。7.2.11にアップデートする前に7.0.0から7.1.0に更新する必要はありません。

* **メジャーバージョンを別のメジャーバージョンに** 更新する場合は、 **メジャーバージョンをスキップしない** ことをお勧めします。手順にしたがって、次のメジャーバージョンに段階的に更新し、各ステップでテストし、検証します。たとえば、バージョン6.x.xからバージョン8.x.xに更新する場合は、まず最新の7.x.xリリースに更新することをお勧めします。7.x.xに正常に更新した後には、8.x.xに更新できます


See [Keeping Up-to-Date](guide/updating "Updating your projects") for more information about updating your Angular projects to the most recent version. 


{@a previews}
### Preview releases

We let you preview what's coming by providing Beta releases and Release Candidates (`rc`) for each major and minor release: 

<!-- 
* **Next:** The release that is under active development. The next release is indicated by a release tag appended with the  `next` identifier, such as  `8.1.0-next.0`. For the next version of the documentation, see [next.angular.io](https://next.angular.io). 
-->

* **Beta:** A release that is under active development and testing. A Beta release is indicated by a release tag appended with the  `beta` identifier, such as  `8.0.0-beta.0`. 

* **Release candidate:** A release that is feature complete and in final testing. A release candidate is indicated by a release tag appended with the `rc` identifier, such as version `8.1.0-rc`.

The next version of the documentation is available at [next.angular.io](https://next.angular.io). This includes any documentation for Beta or Release Candidate features and APIs. 


{@a frequency}
## リリース周期

定期的なリリーススケジュールに向けて作業を進めており、Angularの進化と共にアップデートを計画し、調整することができます。

基本的に、次のリリースサイクルが予想されます。

* 6か月ごとのメジャーリリース

* メジャーリリースごとに1回から3回のマイナーリリース

* ほぼ毎週のパッチリリース

このリリースのリズムにより、プロダクションユーザーのためのプラットフォームの安定性と信頼性を維持しながら、準備ができ次第新しい機能にアクセスできます。


{@a schedule}
## リリーススケジュール

<div class="alert is-helpful">

免責事項：日付は一般的なガイダンスとして提供され、高品質なプラットフォームの提供を確実にするために必要な場合は調整される場合があります。

</div>

次の表は、Angularの次の2つのメジャーバージョンの、現在の目標リリース日を示しています。

 日付                   | 安定版リリース | 互換性
 ---------------------- | -------------- | ----------------
 2019年 5月          | 8.0.0          | ^7.0.0
 2019年 10月/11月         | 9.0.0          | ^8.0.0

互換性に関する注記：下位互換性の約束の第一の目的は、コアフレームワークおよびツールの変更がコンポーネントおよびアプリケーションの既存のエコシステムを壊さず、Angularアプリケーションおよびコンポーネント作成者に過度のアップグレード/移行負担をかけることがないようにすることです。




{@a lts}
{@a support}
## サポートポリシーとスケジュール

メジャーリリースはすべて18か月間サポートされています。

* 上記の[リリース周期](#frequency "Release frequency")で説明したように、定期的にスケジュールされたアップデートとパッチがリリースされる、6ヶ月の*アクティブサポート*。

* 12ヶ月の*長期サポート（LTS）*。LTS期間中は、重要な修正とセキュリティパッチのみがリリースされます。

次の表は、サポート対象のAngularバージョンのステータスを示しています


バージョン | 状態 | リリース     | アクティブの終了  | LTSの終了
------- | ------ | ------------ | ------------ | ------------ 
^8.0.0  | Active | May 22, 2019 | Nov 22, 2019 | Nov 22, 2020
^7.0.0  | LTS    | Oct 18, 2018 | Apr 18, 2019 | Apr 18, 2020
^5.0.0  | LTS    | Nov 1, 2017  | May 1, 2018  | May 1, 2019

Angularバージョン^ 4.0.0と^ 5.0.0はサポートされなくなりました。


{@a deprecation}
## 廃止のプラクティス {@a deprecation-practices}


新しいベストプラクティスへの変更、依存関係の変更、（Web）プラットフォーム自体の変更と共に最新の状態に保つため、そして革新のために、ときには&quot;破壊的変更&quot;選択したAPIや機能のサポートの削除などが必要になります。

これらの移行をできるだけ簡単にするために、私たちはこれらの約束をしています。

* 私たちは、変化の激しさを最小限に抑え、可能な限り移行ツールを提供するために努めています。

* ここで説明している廃止方針に従い、アプリを最新のAPIとベストプラクティスに更新するための時間を確保します。

更新に十分な時間と明確なパスがあることを確認するための、非推奨化のポリシーはこちらです。

* **Announcement:** We announce deprecated APIs and features in the [change log](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log"). Deprecated APIs appear in the [documentation](api?status=deprecated) with ~~strikethrough.~~ When we announce a deprecation, we also announce a recommended update path. For convenience,  [Deprecations](guide/deprecations) contains a summary of deprecated APIs and features. 


* **Deprecation period:** When an API or a feature is deprecated, it will still be present in the [next two major releases](#schedule). After that, deprecated APIs and features will be candidates for removal. A deprecation can be announced in any release, but the removal of a deprecated API or feature will happen only in major release. Until a deprecated API or feature is removed, it will be maintained according to the LTS support policy, meaning that only critical and security issues will be fixed. 


* **npm dependencies:** We only make npm dependency updates that require changes to your apps in a major release. 
In minor releases, we update peer dependencies by expanding the supported versions, but we do not require projects to update these dependencies until a future major version. This means that during minor Angular releases, npm dependency updates within Angular applications and libraries are optional.




{@a public-api}
## パブリックAPI

Angularは、多くのパッケージ、サブプロジェクト、ツールのコレクションです。プライベートAPIの偶発的な使用を防ぐために&mdash;ここで説明するプラクティスの対象を明確に理解できるように&mdash;私たちはパブリックAPIと見なされるものとそうでないものを明文化します。詳細については、[AngularのサポートされたパブリックAPI](https://github.com/angular/angular/blob/master/docs/PUBLIC_API.md "Supported Public API Surface of Angular")を参照してください。

パブリックAPIのあらゆる変更は、上述ののバージョニング、サポート、および非推奨化ポリシーが適用されます。

{@a labs}
## Angular Labs

Angular Labsは、新機能を開発して迅速にイテレーションするためのイニシアチブです。Angular Labsは、Angularチームによる探索と実験のための安全な場所を提供します。

Angular Labsのプロジェクトはプロダクションで使用する準備ができておらず、プロダクションに持ち込むことを約束していません。このドキュメントで説明されているポリシーとプラクティスは、Angular Labsプロジェクトには適用されません。
