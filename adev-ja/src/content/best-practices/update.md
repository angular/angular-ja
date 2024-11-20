# Angular プロジェクトを最新の状態に保つ

WebやWebエコシステム全体と同様に、Angularも継続的に改善されています。
Angularは、継続的な改善と、安定性とアップデートの容易さに重点を置いてバランスを取っています。
Angularアプリケーションを最新の状態に保つことで、最先端の新しい機能、最適化、バグ修正を活用できます。

このドキュメントには、Angularアプリケーションとライブラリを最新の状態に保つための情報とリソースが含まれています。

バージョン管理ポリシーとプラクティス（サポートと非推奨のプラクティス、リリーススケジュールを含む）については、[Angular バージョン管理とリリース](reference/releases "Angular バージョン管理とリリース")をご覧ください。

HELPFUL: 現在AngularJSを使用している場合は、[AngularJS からのアップグレード](https://angular.io/guide/upgrade "Angular JS からのアップグレード")をご覧ください。
*AngularJS* は、Angularのすべてのv1.xバージョンを表します。

## 新しいリリースの通知を受け取る

新しいリリースが利用可能になったときに通知を受け取るには、Twitterで [@angular](https://x.com/angular "@angular on X (formerly Twitter)") をフォローするか、[Angular ブログ](https://blog.angular.dev "Angular ブログ")を購読してください。

## 新しい機能について学ぶ

何が新しくなったのか？何が変わったのか？最新のリリースに関する最も重要な情報をAngularブログの[リリースアナウンスメント]( https://blog.angular.dev/ "Angular ブログ - リリースアナウンスメント")で共有しています。

バージョン別に整理された変更の完全なリストを確認するには、[Angularの変更履歴](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angularの変更履歴")をご覧ください。

## Angular のバージョンを確認する

アプリケーションのAngularバージョンを確認するには、プロジェクトディレクトリ内で `ng version` コマンドを使用します。

## Angular の最新バージョンを見つける

Angularの最新の安定したリリースバージョンは、"Version"の下にある[npm](https://www.npmjs.com/package/@angular/core "Angular on npm")に表示されます。たとえば、`16.2.4`です。

また、CLIコマンド [`ng update`](cli/update) を使用して、Angularの最新バージョンを見つけることもできます。
デフォルトでは、[`ng update`](cli/update)（追加の引数なし）は、使用可能なアップデートをリストします。

## 環境とアプリケーションを更新する

アップデートを簡単に行うために、対話型の[Angularアップデートガイド](update-guide)に完全な手順を記載しています。

Angularアップデートガイドは、指定した現在のバージョンとターゲットバージョンに基づいて、カスタマイズされたアップデート手順を提供します。
アプリケーションの複雑さに合わせて、基本的なアップデートパスと高度なアップデートパスが用意されています。
また、新しいリリースを最大限に活用するためのトラブルシューティング情報と、推奨される手動変更も含まれています。

簡単なアップデートの場合は、CLIコマンド [`ng update`](cli/update) で十分です。
追加の引数なしで、[`ng update`](cli/update)は、使用可能なアップデートをリストし、アプリケーションを最新バージョンにアップデートするための推奨される手順を提供します。

[Angularのバージョン管理とリリース](reference/releases#versioning "Angular リリースプラクティス、バージョン管理")では、リリースのバージョン番号に基づいて期待できる変更レベルについて説明しています。
また、サポートされているアップデートパスについても説明しています。

## リソースの概要

* リリースアナウンスメント:
    [Angular ブログ - リリースに関する最近のアナウンスメント](https://blog.angular.dev/ "Angular ブログの最近のリリースに関するアナウンスメント")

* リリースの詳細:
    [Angularの変更履歴](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angularの変更履歴")

* アップデート手順:
    [Angular アップデートガイド](update-guide)

* アップデートコマンドリファレンス:
    [Angular CLI `ng update` コマンドリファレンス](cli/update)

* バージョン管理、リリース、サポート、および非推奨のプラクティス:
    [Angular バージョン管理とリリース](reference/releases "Angular バージョン管理とリリース")
