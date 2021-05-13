# 使用状況分析の収集と表示

ユーザーは [`ng analytics` CLIコマンド](analytics) を使用して、Angular CLIの使用状況データを [Google Analytics](https://support.google.com/analytics/answer/1008015?hl=en) と共有することを選択できます。
データはAngularチームと共有され、CLIを改善するために使用されます。

CLI分析データの収集はデフォルトでは無効になっており、個々のユーザーがプロジェクトレベルで有効にする必要があります。
すべてのユーザーに対してプロジェクトレベルで有効にすることはできません。

このようにして収集されたデータはGoogle Analyticsサイトで表示できますが、自分の組織のAnalyticsサイトに自動的に表示されるわけではありません。
Angular開発グループの管理者として、Angular CLIのインスタンスを自分のチームによるAngular CLIの使用状況についての分析データを表示できるように設定できます。
この設定オプションは、ユーザーがGoogleと共有している可能性がある他の利用状況分析とは別に、それに加えて行われます。

## CLI使用状況データへのアクセスを有効にする

自分のユーザーのCLI使用状況データへのアクセスを構成するには、ng configコマンドを使用して、グローバル [`angular.json` ワークスペース構成ファイル](guide/workspace-config) にキーを追加します。
キーは、 `projects` セクション以外の、ファイルの最上位レベルの `cli.analyticsSharing` の下にあります。
キーの値は、Google Analyticsによって割り当てられた組織の追跡IDです。
このIDは、 `UA-123456-12` のような文字列です。

説明的な文字列をキー値として使用することも、CLIコマンドを実行するときにランダムキーを割り当てることもできます。
たとえば、次のコマンドは "tracking" という名前の設定キーを追加します。

<code-example language="sh">
ng config --global cli.analyticsSharing.tracking UA-123456-12
</code-example>

この機能を無効にするには、次のコマンドを実行します:

<code-example language="sh">
ng config --global --remove cli.analyticsSharing
</code-example>

## ユーザーごとのトラッキング

コマンドとフラグの固有の使用法を識別するために、グローバル構成にカスタムユーザーIDを追加できます。
そのユーザーが自分のプロジェクトに対してCLI分析を有効にした場合、分析表示には個々の使用状況が追跡およびラベル付けされます。


<code-example language="sh">
ng config --global cli.analyticsSharing.user SOME_USER_NAME
</code-example>

新しいランダムユーザーIDを生成するには、次のコマンドを実行します:

<code-example language="sh">
ng config --global cli.analyticsSharing.user ""
</code-example>
