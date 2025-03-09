# カスタムビルドパイプライン

Angularアプリケーションを構築する際、Angular CLIを使用して、その構造に依存した更新機能とビルドシステムの抽象化を活用することを強くおすすめします。これにより、プロジェクトは最新のセキュリティ、パフォーマンス、APIの改善、および透過的なビルドの改善の恩恵を受けることができます。

このページでは、Angular CLIを使用しないカスタムビルドパイプラインが必要となる**まれなユースケース**について説明します。以下にリストされているすべてのツールは、Angularコミュニティのメンバーによってメンテナンスされているオープンソースのビルドプラグインです。サポートモデルとメンテナンス状況の詳細については、ドキュメントとGitHubリポジトリのURLを参照してください。

## カスタムビルドパイプラインはいつ使用すべきですか？

カスタムビルドパイプラインを維持したいニッチなユースケースがいくつかあります。次に例を示します。

* 異なるツールチェーンを使用している既存のアプリケーションがあり、それにAngularを追加したい場合
* [モジュールフェデレーション](https://module-federation.io/)に強く結びついており、バンドラーに依存しない[ネイティブフェデレーション](https://www.npmjs.com/package/@angular-architects/native-federation)を採用できない場合
* お気に入りのビルドツールを使用して、短期間の実験を作成したい場合

## どのような選択肢がありますか？

現在、[Vite プラグイン](https://www.npmjs.com/package/@analogjs/vite-plugin-angular)と[Rspack プラグイン](https://www.npmjs.com/package/@ng-rspack/build)を使用してカスタムビルドパイプラインを作成できる、十分にサポートされた2つのコミュニティツールがあります。どちらも、Angular CLIを強化する基盤となる抽象レイヤを使用しています。これらにより、柔軟なビルドパイプラインを作成できますが、手動でのメンテナンスが必要であり、自動化された更新の体験は得られません。

### Rspack

Rspackは、webpackプラグインエコシステムとの互換性を提供することを目的としたRustベースのバンドラーです。

プロジェクトがwebpackエコシステムに密接に結合されており、カスタムwebpack構成に大きく依存している場合は、Rspackを活用してビルド時間を改善できます。

Angular Rspackの詳細については、プロジェクトの[ドキュメントWebサイト](https://angular-rspack.dev/guide/migration/from-webpack)を参照してください。

### Vite

Viteは、最新のWebプロジェクト向けに、より高速で無駄のない開発エクスペリエンスを提供することを目的としたフロントエンドビルドツールです。Viteはプラグインシステムを通じて拡張可能で、エコシステムは、ユニットテストおよびブラウザテスト用のVitest、コンポーネントを分離して作成するためのStorybookなど、Viteとの統合を構築できます。Angular CLIは、Viteを開発サーバーとしても使用します。

[Angular用AnalogJS Viteプラグイン](https://www.npmjs.com/package/@analogjs/vite-plugin-angular)を使用すると、Viteを使用または上に構築されたプロジェクトまたはフレームワークでAngularを採用できます。これには、Viteを使用してAngularプロジェクトを直接開発および構築したり、既存のプロジェクトまたはパイプラインにAngularを追加したりすることが含まれます。1つの例は、[Astro and Starlight](https://analogjs.org/docs/packages/astro-angular/overview)を使用して、Angular UIコンポーネントをドキュメントWebサイトに統合することです。

AnalogJSの詳細とプラグインの使用方法については、[ドキュメントページ](https://analogjs.org/docs/packages/vite-plugin-angular/overview)を参照してください。
