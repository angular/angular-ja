# Angularプロジェクトを最新に保つ

ウェブやウェブ全体のエコシステムのように、Angularは絶えず改善しています。Angularは、安定性に重点を置き、更新を容易にすることで継続的な改善のバランスをとります。Angularアプリケーションを最新の状態に保つことで、最先端の新機能のほか、最適化やバグ修正を利用することができます。

このドキュメントには、Angularアプリケーションとライブラリを最新の状態に保つのに役立つ情報とリソースが含まれています。

バージョニングのポリシーとプラクティス&mdash;サポートと廃止のプラクティス、リリーススケジュールなど&mdash;については、
[Angularのバージョニングとリリース](guide/releases "Angular versioning and releases")を参照してください。


<div class="alert is-helpful">

現在AngularJSを使用している場合は、[AngularJSからのアップグレード](guide/upgrade "Upgrading from Angular JS")を参照してください。 _AngularJS_ はすべてのv1.xバージョンのAngularの名前です。

</div>


{@a announce}
## 新リリースの通知を受け取る

新しいリリースがリリースされたときに通知を受けるには、Twitterの[@angular](https://twitter.com/angular "@angular on Twitter")をフォローするか、[Angularブログ](https://blog.angular.io "Angular blog")を購読してください。

{@a learn}
## 新機能について学ぶ

新着情報？何が変わったのか？Angularブログの[リリースアナウンス]( https://blog.angular.io/tagged/release%20notes "Angular blog - release announcements")では知る必要があるもっとも重要なことを共有します。

バージョン別にまとめた変更の完全なリストを確認するには、[Angularのチェンジログ](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log")を参照してください。


{@a checking-version-app}
## あなたのAngularバージョンを確認する

アプリケーションのAngularバージョンを確認するには、プロジェクトディレクトリ内で、`ng version`コマンドを使用します。


{@a checking-version-angular}
## Angularの最新のバージョンを見つける

直近のリリースされたAngularの安定バージョンが、[Angularドキュメンテーション](docs "Angular documentation")の左側のナビゲーションの下部に表示されます。たとえば、`stable (v5.2.9)`。

CLIコマンドの[`ng update`](cli/update)を使用してAngularの最新バージョンを見つけることもできます。デフォルトでは [`ng update`](cli/update)（追加の引数なしで）利用可能な更新が一覧表示されます。


{@a updating}
## 開発環境とアプリケーションをアップデートする

更新を簡単にするために、対話型の[Angularアップデートガイド](https://update.angular.io/ "Angular Update Guide")にには完全な手順が記載されています。

Angularアップデートガイドでは、指定した現在のバージョンと目標のバージョンに基づいて、カスタマイズされた更新手順が提供されます。アプリケーションの複雑さに合わせて、基本および高度な更新パスが含まれています。また、新しいリリースを最大限に活用するためのトラブルシューティング情報や推奨されるマニュアルの変更も含まれています。

簡単な更新のためには、CLIコマンドの[`ng update`](cli/update)で十分です。追加の引数を与えなければ、[`ng update`](cli/update) は利用可能な更新を一覧表示し、アプリケーションを最新のバージョンに更新するための推奨手順が示されます。

[Angularバージョンとリリース](guide/releases#versioning "Angular Release Practices, Versioning") は、リリースのバージョン番号に基づいて予想される変更のレベルについて説明しています。サポートされているアップデートパスについても説明します。

{@a resources}
## リソースのまとめ

* リリースアナウンス: [Angular blog - release announcements](https://blog.angular.io/tagged/release%20notes "Angular blog announcements about recent releases")

* リリースアナウンス（旧版）: [Angular blog - announcements about releases prior to August 2017](https://blog.angularjs.org/search?q=available&by-date=true "Angular blog announcements about releases prior to August 2017")

* リリース詳細: [Angularチェンジログ](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log")

* アップデート手順: [Angularアップデートガイド](https://update.angular.io/ "Angular Update Guide")

* アップデートコマンドについて: [Angular CLI `ng update` コマンドリファレンス](cli/update)

* バージョニング、リリース、サポートと廃止のプラクティス: [Angularのバージョニングとリリース](guide/releases "Angular versioning and releases")
