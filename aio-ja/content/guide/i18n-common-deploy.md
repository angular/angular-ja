# 複数ロケールのデプロイ

もし`myapp`があなたのプロジェクトの配布可能なファイルを含むディレクトリであれば、通常、ロケールディレクトリで異なるロケール用に異なるバージョンを利用できるようにします。
たとえば、フランス語版は`myapp/fr`ディレクトリに、スペイン語版は`myapp/es`ディレクトリに配置されます。

HTMLの`base`タグと`href`属性は、相対リンクのベースとなるURI（URL）を指定します。
ワークスペースのビルド設定ファイル[`angular.json`][AioGuideWorkspaceConfig]の`"localize"`オプションに`true`またはロケール ID の配列を指定すると、CLI はアプリケーションのバージョンごとにベース`href`を調整します。
アプリケーションの各バージョンでベースとなる `href` を調整するために、CLIは設定した `"baseHref"` にロケールを追加します。
ワークスペース構築設定ファイル [`angular.json`][AioGuideWorkspaceConfig] に、各ロケールの `"baseHref"` を指定しましょう。
次の例では、`"baseHref"`に空文字列を指定しています。

<code-example header="angular.json" path="i18n/angular.json" region="i18n-baseHref"></code-example>

また、コンパイル時にベースとなる `href` を宣言するには、[`ng build`][AioCliBuild] で CLI `--baseHref` オプションを使用します。

## サーバーを設定する

複数言語の典型的な展開では、各言語を異なるサブディレクトリから提供します。
ユーザーは、`Accept-Language` HTTPヘッダを使用してブラウザで定義された優先言語へリダイレクトされます。
ユーザーが優先言語を定義していない場合、または優先言語が利用できない場合、サーバーはデフォルトの言語にフォールバックします。
言語を変更するには、現在の場所を別のサブディレクトリに変更します。
サブディレクトリの変更は、多くの場合、アプリケーションに実装されているメニューを使って行われます。

<div class="alert is-helpful">

リモートサーバーにアプリケーションをデプロイする方法については、[デプロイ][AioGuideDeployment]を参照してください。

</div>

### Nginxの例

次の例は、Nginxの設定を表示します。

<code-example path="i18n/doc-files/nginx.conf" language="nginx"></code-example>

### Apacheの例

次の例は、Apacheの設定を表示します。

<code-example path="i18n/doc-files/apache2.conf" language="apache"></code-example>

<!-- links -->

[AioCliBuild]: cli/build "ng build | CLI | Angular"

[AioGuideDeployment]: guide/deployment "Deployment | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
