# 使用状況分析の収集と表示

ユーザーは [`ng analytics` CLI コマンド](analytics) を使用して、Angular CLI の使用状況データを [Google Analytics](https://support.google.com/analytics/answer/1008015?hl=en) と共有することを選択できます。
データは Angular チームと共有され、CLI を改善するために使用されます。

CLI 分析データの収集はデフォルトでは無効になっており、個々のユーザーがプロジェクトレベルで有効にする必要があります。
すべてのユーザーに対してプロジェクトレベルで有効にすることはできません。

このようにして収集されたデータは Google Analytics サイトで表示できますが、自分の組織の Analytics サイトに自動的に表示されるわけではありません。
Angular 開発グループの管理者として、Angular CLI のインスタンスを自分のチームによる Angular CLI の使用状況についての分析データを表示できるように設定できます。
この設定オプションは、ユーザーが Google と共有している可能性がある他の利用状況分析とは別に、それに加えて行われます。

## CLI 使用状況データへのアクセスを有効にする

自分のユーザーの CLI 使用状況データへのアクセスを構成するには、ng config コマンドを使用して、グローバル [`angular.json` ワークスペース構成ファイル](guide/workspace-config) にキーを追加します。
キーは、 `projects` セクション以外の、ファイルの最上位レベルの `cli.analyticsSharing` の下にあります。
キーの値は、Google Analytics によって割り当てられた組織の追跡 ID です。
この ID は、 `UA-123456-12` のような文字列です。

説明的な文字列をキー値として使用することも、CLI コマンドを実行するときにランダムキーを割り当てることもできます。
たとえば、次のコマンドは "tracking" という名前の設定キーを追加します。

<code-example language="sh">
ng config --global cli.analyticsSharing.tracking UA-123456-12
</code-example>

この機能を無効にするには、次のコマンドを実行します:

<code-example language="sh">
ng config --global cli.analyticsSharing undefined
</code-example>

## ユーザーごとのトラッキング

コマンドとフラグの固有の使用法を識別するために、グローバル構成にカスタムユーザー ID を追加できます。
そのユーザーが自分のプロジェクトに対して CLI 分析を有効にした場合、分析表示には個々の使用状況が追跡およびラベル付けされます。

<code-example language="sh">
ng config --global cli.analyticsSharing.uuid SOME_USER_NAME
</code-example>

新しいランダムユーザー ID を生成するには、次のコマンドを実行します:

<code-example language="sh">
ng config --global cli.analyticsSharing.uuid ""
</code-example>
