# デプロイメント

Angular アプリケーションをリモートサーバーにデプロイする準備ができたら、デプロイのためのさまざまなオプションを選択することができます。

{@a dev-deploy}
{@a copy-files}

## シンプルなデプロイオプション

アプリケーションを完全にデプロイする前に、これらの暫定的な手法のいずれかを使用して、プロセス、ビルド構成、およびデプロイされた動作をテストすることができます。

### ディスクからのビルドとサーブ

通常、開発時には `ng serve` コマンドにて、[webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server) を使用して、ローカルメモリからアプリケーションをビルド、ファイル監視、およびサーブします。
ただし、デプロイする準備ができたら、 `ng build` コマンドを使用してアプリをビルドし、ビルドされたアーティファクトを他の場所にデプロイする必要があります。

`ng build` と `ng serve` はプロジェクトをビルドする前に出力先フォルダをクリアしますが、生成されたアーティファクトを出力先フォルダに書き込むのは `ng build` コマンドのみです。

<div class="alert is-helpful">

デフォルトの出力先フォルダは `dist/project-name/` です。  
別のフォルダーに出力するには、 `angular.json` の `outputPath` を変更します。

</div>

開発プロセスが終わりに近づいたら、ローカル Web サーバーから出力先フォルダのコンテンツをサーブすることで、リモートサーバーにデプロイされたときのアプリケーションの動作をよりよく理解できます。  
ライブリロードを体験するには、2つのターミナルが必要です。

- 1つ目のターミナルで、 _watch_ モードで [`ng build` コマンド](cli/build) を実行し、アプリケーションを `dist` フォルダにコンパイルします。

  <code-example language="none" class="code-shell">

   ng build --watch

  </code-example>

  `ng serve` コマンドと同様に、ソースファイルが変更されると出力ファイルが再生成されます。

- 2つ目のターミナルで、Web サーバー（[lite-server](https://github.com/johnpapa/lite-server)など）をインストールし、出力先フォルダに対して実行します。たとえば：

  <code-example language="none" class="code-shell">

   lite-server --baseDir="dist/project-name"

  </code-example>

  サーバーは、新しいファイルが出力されると、ブラウザを自動的にリロードします。

<div class="alert is-critical">

この方法は開発とテストのみを目的としており、アプリケーションをデプロイするためのサポートされた方法、または安全な方法ではありません。

</div>

### CLI を利用した自動デプロイ

Angular CLI コマンドの `ng deploy`（バージョン8.3.0で導入）は、プロジェクトに関連づけられた `deploy` [CLI ビルダー](https://angular.io/guide/cli-builder)を実行します。
多くのサードパーティビルダーは、さまざまなプラットフォームに対してのデプロイ機能を実装しています。 `ng add [パッケージ名]` を実行することで、それらをプロジェクトに追加することができます。

デプロイメント機能を備えたパッケージを追加すると、選択したプロジェクトの `deploy` セクションでワークスペース設定（ `angular.json` ファイル）が自動的に更新されます。その後、 `ng deploy` コマンドを使用してそのプロジェクトをデプロイできます。

たとえば、次のコマンドは、プロジェクトを Firebase に自動的にデプロイします。

<code-example language="none" class="code-shell">
ng add @angular/fire
ng deploy
</code-example>

このコマンドはインタラクティブです。この場合、 Firebase アカウントを持っているか、なければ作成してそのアカウントを使用して認証する必要があります。このコマンドで、デプロイする Firebase プロジェクトを選択するように求められます。

コマンドがアプリケーションの最適なビルド（ `ng deploy --prod` と同等）を実行した後、プロダクション用のアセットを Firebase にアップロードします。

次の表にて、さまざまなプラットフォームへのデプロイ機能を実装するパッケージのリストを見つけることができます。各パッケージの `deploy` コマンドには、異なるコマンドラインオプションが必要な場合があります。次のパッケージ名に関連付けられているリンクをたどると、さらに読むことができます。

| デプロイ先                                                   | パッケージ                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| [Firebase hosting](https://firebase.google.com/docs/hosting) | [`@angular/fire`](https://npmjs.org/package/@angular/fire)                     |
| [Azure](https://azure.microsoft.com/en-us/)                  | [`@azure/ng-deploy`](https://npmjs.org/package/@azure/ng-deploy)               |
| [Now](https://zeit.co/now)                                   | [`@zeit/ng-deploy`](https://npmjs.org/package/@zeit/ng-deploy)                 |
| [Netlify](https://www.netlify.com/)                          | [`@netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy) |
| [GitHub pages](https://pages.github.com/)                    | [`angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)         |

もし自己管理しているサーバーにデプロイする場合、またはお気に入りのクラウドプラットフォーム用のビルダーがない場合は、 `ng deploy` コマンドを使用できるビルダーを作成するか、このガイドを読んで手動であなたのアプリをデプロイする方法を学習することができます。

### リモートサーバーへの基本的なデプロイ

もっとも単純なデプロイの場合は、プロダクション用ビルドを作成し、出力ディレクトリをそのまま Web サーバーにコピーします。

1. プロダクション用ビルドから開始します

  <code-example language="none" class="code-shell">

    ng build --prod

  </code-example>

2. 出力フォルダー（デフォルトでは `dist/` ）内の _すべて_ をサーバー上のフォルダーにコピーします。

3. 不足しているファイルのリクエストを `index.html` にリダイレクトするようにサーバーを設定します。
   サーバー側リダイレクトの詳細は [こちら](#fallback) にて学習できます。

これは、アプリケーションのもっとも簡単なプロダクション環境へのデプロイです。

{@a deploy-to-github}

### GitHub pages へのデプロイ

Angular アプリをデプロイするもう1つの簡単な方法は、[GitHub Pages](https://help.github.com/articles/what-is-github-pages/) を使用することです。

1. アカウントがない場合は [GitHub アカウントを作成する](https://github.com/join) 、次に [リポジトリを作成する](https://help.github.com/articles/create-a-repo/) 。  
   GitHub でユーザー名とプロジェクト名を書き留めます。

2. Angular CLI コマンド [ng build](cli/build) とここに示すオプションを使用して、Github プロジェクト名を使用してプロジェクトをビルドします:

  <code-example language="none" class="code-shell">

    ng build --prod --output-path docs --base-href /&lt;project_name&gt;/

  </code-example>

3. ビルドが完了したら、 `docs/index.html`のコピーを作成し、`docs/404.html` という名前を付けます。

4. 変更をコミットしてプッシュします。

5. GitHub プロジェクトページで、[publish from the docs folder](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch) に設定します。

デプロイされたページは次の URL で見ることができます:  
 `https://<user_name>.github.io/<project_name>/`

<div class="alert is-helpful">

[angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages) をチェックしてください。これはあなたのためにこれをすべて行い、追加機能を備えたフル機能のパッケージです。

</div>

<hr>

{@a server-configuration}

## サーバー構成

このセクションでは、サーバーまたはサーバーにデプロイされたファイルに対して行った変更について説明します。

{@a fallback}

### ルーティングされたアプリは、`index.html` にフォールバックする必要があります

Angular アプリケーションは、単純な静的 HTML サーバーで提供するのに最適な候補です。
アプリケーションページを動的に構成するためにサーバー側エンジンは必要ありません。なぜなら Angular はクライアント側でそれを行うからです。

アプリケーションが Angular ルーターを使用する場合、サーバーを構成する必要があります。
サーバーに存在しないファイルを要求されたときにアプリケーションのホストページ（ `index.html` ）を返します。

{@a deep-link}

ルーティングされたアプリケーションは、「ディープリンク」をサポートする必要があります。  
_deep link_ は、アプリ内のコンポーネントへのパスを指定する URL です。  
たとえば、`http://www.mysite.com/heroes/42` はヒーローの詳細ページへの _ディープリンク_ で、`id：42` のヒーローを表示します。

ユーザーが実行中のクライアント内からその URL に移動しても問題はありません。  
Angular ルーターは URL を解釈し、そのページとヒーローにルーティングを行います。

ただし、メール内のリンクをクリックして、ブラウザのアドレスバーに入力したり、
または、ヒーローの詳細ページでブラウザを更新するだけです &mdash;  
これらのアクションはすべて、実行中のアプリケーションの _外部の_ ブラウザ自体によって処理されます。  
ブラウザは、ルーターをバイパスして、その URL を直接サーバーにリクエストします。

静的サーバーは、 `http://www.mysite.com/` のリクエストを受信すると、定期的に `index.html` を返します。
しかし、 `http://www.mysite.com/heroes/42` を拒否し、 `404-Not Found` エラーを返し、
代わりに `index.html` を返すように設定されています。

#### フォールバック構成の例

すべてのサーバーで機能する単一の構成はありません。
次のセクションでは、もっとも一般的なサーバーのいくつかの構成について説明します。
リストは決して網羅的ではありませんが、よい出発点をあなたに提供してくれるはずです。

- [Apache](https://httpd.apache.org/):
  次に示されているように、 `.htaccess` ファイルに [書き換えルール](http://httpd.apache.org/docs/current/mod/mod_rewrite.html) を追加します(https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess/):

    <code-example>
      RewriteEngine On
      &#35 If an existing asset or directory is requested go to it as it is
      RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
      RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
      RewriteRule ^ - [L]<br>
      &#35 If the requested resource doesn't exist, use index.html
      RewriteRule ^ /index.html
    </code-example>

* [Nginx](http://nginx.org/): `try_files` を使用し、[フロントコントローラーパターン Web アプリケーション](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps) で `index.html` をサーブするように変更します:

  ```
  try_files $uri $uri/ /index.html;
  ```

- [IIS](https://www.iis.net/): 示されているものと同様の書き換えルールを `web.config` に追加します。
  [こちら](http://stackoverflow.com/a/26152011/2116927):

    <code-example format='.' language="xml">
      &lt;system.webServer&gt;
        &lt;rewrite&gt;
          &lt;rules&gt;
            &lt;rule name="Angular Routes" stopProcessing="true"&gt;
              &lt;match url=".*" /&gt;
              &lt;conditions logicalGrouping="MatchAll"&gt;
                &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt;
                &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt;
              &lt;/conditions&gt;
              &lt;action type="Rewrite" url="/index.html" /&gt;
            &lt;/rule&gt;
          &lt;/rules&gt;
        &lt;/rewrite&gt;
      &lt;/system.webServer&gt;
    </code-example>

* [GitHub Pages](https://pages.github.com/): GitHub Pages サーバーを [直接構成](https://github.com/isaacs/github/issues/408) することはできませんが、404ページを追加できます。  
   `index.html`を`404.html`にコピーします。  
  それでも404レスポンスとして提供されますが、ブラウザはそのページを処理し、アプリを適切にロードします。  
  次のこともお勧めします。  
  [master の docs/ でサーブする](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)
  や
  [.nojekyll ファイルを生成する](https://www.bennadel.com/blog/3181-including-node-modules-and-vendors-folders-in-your-github-pages-site.htm)

- [Firebase のホスティング](https://firebase.google.com/docs/hosting/):[書き換えルール](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites)を追加する。

    <code-example language="json">
      "rewrites": [ {
        "source": "**",
        "destination": "/index.html"
      } ]
    </code-example>

{@a cors}

### 別のサーバーからのサービスのリクエスト（CORS）

Angular 開発者は、サービスリクエスト（通常はデータサービスリクエスト）を行うときに、アプリケーション自身のホストサーバー以外のサーバーに対して、<a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing" title="クロスオリジンリソース共有">
<i>クロスオリジンリソース共有</i></a>エラーに遭遇する場合があります。
サーバーが明示的に許可しない限り、ブラウザはそのようなリクエストを禁止します。

クライアントアプリケーションがこれらのエラーについてできることは何もありません。
サーバーは、アプリケーションからのリクエストを受け入れるように構成する必要があります。
<a href="http://enable-cors.org/server.html" title="CORSサーバーを有効にする">enable-cors.org</a> で、特定のサーバーの CORS を有効にする方法について読んでください。

<hr>

{@a optimize}

## プロダクションの最適化

`--prod` *meta-flag*は、次のビルド最適化機能を使用します。

- [Ahead-of-Time (AOT) コンパイラ](guide/aot-compiler): Angular コンポーネントテンプレートをプリコンパイルします。
- [プロダクションモード](#enable-prod-mode): _本番モード_ を有効にする本番環境をデプロイします。
- バンドル: 多くのアプリケーションとライブラリファイルをいくつかのバンドルに連結します。
- ミニファイ: 余分な空白、コメント、およびオプションのトークンを削除します。
- 難読化: 短い暗号化された変数名と関数名を使用するようにコードを書き換えます。
- デッドコード除去: 参照されていないモジュールと多くの未使用コードを削除します。

CLI ビルドオプションとその機能の詳細については、[`ng build`](cli/build) を参照してください。

{@a enable-prod-mode}

### ランタイムプロダクションモードを有効にする

ビルドの最適化に加えて、Angular にはランタイムプロダクションモードもあります。ブラウザコンソールの次のメッセージで分かるように、Angular アプリはデフォルトでは開発モードで実行されます。

<code-example format="nocode">

  Angular is running in the development mode. Call enableProdMode() to enable the production mode.

</code-example>

_プロダクションモード_ に切り替えると、二重変更検知サイクルなどの開発固有のチェックが無効になり、実行が高速になります。

`--prod` コマンドラインフラグを使用してプロダクションビルドを有効にすると、ランタイムプロダクションモードも有効になります。

{@a lazy-loading}

### 遅延ロード

アプリの起動時に絶対に欠かせないアプリケーションモジュールのみをロードすることで、起動時間を劇的に短縮できます。

オンデマンドで[アプリが起動するまで待つ](guide/router#preloading 'Preloading')か [遅延ロード](guide/router#asynchronous-routing 'Lazy loading')を行うかといった方法で、他のすべてのモジュール（および関連するコード）の読み込みを遅延するように、Angular Router を構成します。

<div class="callout is-helpful">

<header>遅延ロードされたモジュールから何かを即時にインポートしないでください</header>

モジュールを遅延ロードするつもりなら、アプリの起動時に熱心にロードされるファイル（ルート `AppModule` など）をインポートしないように注意してください。  
これを行うと、モジュールが直ちにロードされてしまいます。

バンドル構成では、遅延ロードを考慮する必要があります。
遅延ロードされたモジュールは JavaScript にインポートされないため、バンドラーはそれらをデフォルトで除外します。
バンドラーはルーターの構成を知らず、遅延ロードされたモジュール用に個別のバンドルを作成できません。
これらのバンドルは手動で作成する必要があります。

CLI は遅延ロードされた `NgModules` を自動的に認識し、それらの個別のバンドルを作成する [Angular Ahead-of-Time Webpack プラグイン](https://github.com/angular/angular-cli/tree/master/packages/%40ngtools/webpack) を実行します。

</div>

{@a measure}

### パフォーマンスを計測する

アプリケーションを遅くしている原因が明確かつ正確に理解できているとき、何を最適化するかについては適切な決定を下すことができます。  
原因は、あなたが考えているとおりではないかもしれません。  
目に見えるメリットがなかったり、アプリの動作が遅くなるようなものを最適化するために、多くの時間とお金を無駄にすることもあります。  
自分にとって重要な環境で実行するときは、アプリケーションの実際の動作を計測する必要があります。

<a href="https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing" title="Chrome DevTools Network Performance">Chrome DevTools ネットワークパフォーマンスページ</a>は、パフォーマンスの測定について学習を始めるのに適した場所です。

デプロイが成功したことを確認するのにも役立つ [WebPageTest](https://www.webpagetest.org/) ツールも適切な選択肢です。

{@a inspect-bundle}

### バンドルを検査する

<a href="https://github.com/danvk/source-map-explorer/blob/master/README.md">source-map-explorer</a> ツールは、プロダクションビルド後に生成された JavaScript バンドルを検査するのにもっとも適した方法です。

`source-map-explorer` をインストール:

<code-example language="none" class="code-shell">

  npm install source-map-explorer --save-dev

</code-example>

_ソースマップを含めて_ プロダクション用のアプリをビルドする。

<code-example language="none" class="code-shell">

  ng build --prod --source-map

</code-example>

生成されたバンドルを `dist/` フォルダーにリストします。

<code-example language="none" class="code-shell">

  ls dist/*.bundle.js

</code-example>

エクスプローラーを実行して、バンドルの1つのグラフィカルな表現を生成します。  
次の例は、_main_ バンドルのグラフを表示しています。

<code-example language="none" class="code-shell">

  node_modules/.bin/source-map-explorer dist/main.*.bundle.js

</code-example>

`source-map-explorer` はバンドルで生成されたソースマップを分析し、バンドルに含まれるクラスを正確に示したすべての依存関係のマップを描画します。

これは、`cli-quickstart` というサンプルアプリの _main_ バンドルの出力です。

<figure>
  <img src="generated/images/guide/deployment/quickstart-sourcemap-explorer.png" alt="quickstart sourcemap explorer">
</figure>

{@a base-tag}

## `base` タグ

HTML の [_&lt;base href="..."/&gt;_](/guide/router) は、画像、スクリプト、スタイルシートなどのアセットへの相対 URL を解決するためのベースパスを指定します。
たとえば、 `<base href="/my/app/">` を指定すると、ブラウザは `some/place/foo.jpg` を `my/app/some/place/foo.jpg` へのサーバーのリクエストとして URL を解決します。  
ナビゲーション中に、Angular ルーターは _base href_ をコンポーネント、テンプレート、およびモジュールファイルへのベースパスとして使用します。

<div class="alert is-helpful">

[_APP_BASE_HREF_](api/common/APP_BASE_HREF 'API: APP_BASE_HREF') の代替案も閲覧してください。

</div>

開発中は、通常 `index.html` を格納しているフォルダーでサーバーを起動します。  
これがルートフォルダーであり、 `/` がアプリのルートであるため、 `index.html` の上部近くに `<base href="/">` を追加します。

ただし、共有サーバーまたは運用サーバーでは、サブフォルダーからアプリを提供できます。  
たとえば、アプリを読み込む URL が `http://www.mysite.com/my/app/` のような場合、
サブフォルダーは `my/app/`であり、 `<base href ="/my/app/">` をサーバーバージョンの `index.html` に追加する必要があります。

`base` タグの設定が間違っていると、アプリの読み込みに失敗し、ブラウザコンソールに見つからないファイルに対して `404-Not Found` エラーが表示されます。_tried_ を見てそれらのファイルを見つけ、base タグを適切に調整します。

{@a differential-loading}

## 差分ロード

Web アプリケーションを構築する場合、アプリケーションが大部分のブラウザと互換性があることを確認することが目標です。
JavaScript が進化し続け、新機能が導入されても、すべてのブラウザにてこれらの新機能のサポートが同じペースで更新されるわけではありません。

TypeScript を使用して開発で作成したコードはコンパイルされ、ほとんどのブラウザと互換性のある JavaScript 構文であるES2015にバンドルされます。  
最新のブラウザはすべてES2015以降をサポートしていますが、ほとんどの場合、サポートしていないブラウザからアプリケーションにアクセスするユーザーを考慮する必要があります。  
古いブラウザを対象とする場合、[polyfills](guide/browser-support#polyfills) は、これらのブラウザでサポートされている古いバージョンの JavaScript には存在しない機能を提供することにより、ギャップを埋めることができます。

互換性を最大化するために、コンパイルされたすべてのコードと必要なポリフィルを含む単一のバンドルを出荷できます。  
ただし、最新のブラウザを使用しているユーザーは、不要なポリフィルに伴うバンドルサイズの増加という代価を支払う必要はありません。  
Angular CLI バージョン8以降でデフォルトでサポートされている差分ロードは、この問題を解決します。

差分ロードは、デプロイされたアプリケーションの一部として CLI が2つの個別のバンドルを構築する戦略です。

- 最初のバンドルには最新のES2015構文が含まれており、最新のブラウザの組み込みサポートを利用し、ポリフィルの出荷を減らし、バンドルサイズを小さくしています。

- 2番目のバンドルには、必要なすべてのポリフィルとともに、古いES5構文のコードが含まれています。これにより、バンドルサイズが大きくなりますが、古いブラウザがサポートされます。

この戦略により、複数のブラウザをサポートする Web アプリケーションを引き続き構築できますが、ブラウザが必要とする必要なコードのみをロードできます。

### 差分ビルド

Angular CLI は、デプロイの _build_ プロセスの一部として、差分ロードを処理します。  
`ng build` コマンドは、ブラウザのサポート要件とコンパイルターゲットに基づいて、差分ロードに使用される必要なバンドルを生成します。

Angular CLI は、差分ロードに2つの構成を使用します:

- ブラウザリスト
  `browserslist` 設定ファイルはアプリケーション [プロジェクト構造](guide/file-structure#application-configuration-files) に含まれ、アプリケーションがサポートする最小のブラウザを提供します。
  完全な構成オプションについては、[Browserslist spec](https://github.com/browserslist/browserslist) を参照してください。

- TypeScript の構成
  TypeScript 設定ファイルである `tsconfig.json` では、`compilerOptions` セクションの `target` でコードがコンパイルされる ECMAScript ターゲットバージョンを決定します。  
  最新のブラウザはES2015をネイティブでサポートしますが、ES5はレガシーブラウザをサポートするためにより一般的に使用されます。

<div class="alert is-helpful">

現在、差分ロードは、コンパイル `ターゲット` として `es2015` を使用する場合にのみサポートされます。
`es2015` よりも新しいターゲットで使用すると、ビルド時に警告が発せられます。

</div>

CLI は Browserslist 設定を照会し、`target` をチェックして、レガシーブラウザのサポートが必要かどうかを判断します。  
これら2つの構成の組み合わせにより、 _build_ の作成時に複数のバンドルが生成されるかどうかが決まります。  
[ng build](cli/build) を使用して開発ビルドを作成し、差分ロードが有効になっている場合、生成される出力はよりシンプルで簡単にデバッグできるため、コンパイルされたコードのソースマップに依存しにくくなります。  
[`ng build --prod`](cli/build) を使用してプロダクションビルドを作成する場合、CLI は上記で定義された構成を使用して、アプリケーションのデプロイメント用にビルドするバンドルを決定します。

`index.html` ファイルもビルドプロセス中に変更され、差分ロードを可能にする script タグが含まれます。
`ng build`を使用してビルド中に生成される `index.html` ファイルからの次のサンプル出力を参照してください。

<code-example language="html">
&lt;body>
  &lt;app-root>&lt;/app-root>
  &lt;script src="runtime-es2015.js" type="module">&lt;/script>
  &lt;script src="runtime-es5.js" nomodule>&lt;/script>
  &lt;script src="polyfills-es2015.js" type="module">&lt;/script>
  &lt;script src="polyfills-es5.js" nomodule>&lt;/script>
  &lt;script src="styles-es2015.js" type="module">&lt;/script>
  &lt;script src="styles-es5.js" nomodule>&lt;/script>
  &lt;script src="vendor-es2015.js" type="module">&lt;/script>
  &lt;script src="vendor-es5.js" nomodule>&lt;/script>
  &lt;script src="main-es2015.js" type="module">&lt;/script>
  &lt;script src="main-es5.js" nomodule>&lt;/script>
&lt;/body>
</code-example>

各 script タグには、 `type="module"` または `nomodule` 属性があります。
ES モジュールをネイティブでサポートするブラウザは、 `module` タイプ属性をもつスクリプトのみをロードし、`nomodule` 属性をもつスクリプトを無視します。
レガシーブラウザは、 `nomodule` 属性をもつスクリプトのみをロードし、ES モジュールをロードする `module` タイプの script タグを無視します。

<div class="alert is-helpful">

一部のレガシーブラウザはまだ両方のバンドルをダウンロードしますが、上記の属性に基づいて適切なスクリプトのみを実行します。
この問題の詳細については、[こちら](https://github.com/philipwalton/webpack-esnext-boilerplate/issues/1) をご覧ください。

</div>

差分読み込みを有効にするための構成については、次の [構成テーブル](#configuration-table) を参照してください。

### 差分ロードの構成

差分ロードは、Angular CLI バージョン8以降でデフォルトでサポートされています。  
ワークスペースの各アプリケーションプロジェクトに対して、アプリケーションプロジェクトの `browserslist` ファイルと `tsconfig.json` ファイルに基づいてビルドの生成方法を構成できます。

新しく作成された Angular アプリケーションの場合、デフォルトの `browserslist` は次のようになります:

```
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE9-11 # For IE9-11 support, remove 'not'.
```

`tsconfig.json` は次のようになります:

<code-example language="json">

{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "esnext",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}

</code-example>

デフォルトでは、IE9-11などのレガシーブラウザは無視され、コンパイルターゲットはES2015です。その結果、これにより2つのビルドが生成され、差分ロードが有効になります。ES2015サポートのないブラウザを無視すると、単一のビルドが作成されます。
さまざまな構成に基づいた差分ロードのビルド結果を確認するには、次の表を参照してください。

<div class="alert is-important">

上記の構成でどのブラウザがサポートされているか、ブラウザのサポート要件を満たす設定を確認するには[ブラウザリストの互換性ページ](https://browserl.ist/?q=%3E+0.5%25%2C+last+2+versions%2C+Firefox+ESR%2C+not+dead%2C+not+IE+9-11)を参照してください。

</div>

{@a configuration-table }

| ES5ブラウザリスト結果 | ES ターゲット | ビルド結果                                      |
| ---------------------- | ------------- | ----------------------------------------------- |
| 無効                   | es5         | シングルビルド                                  |
| 有効                   | es5         | シングルビルド 条件付きポリフィル付き           |
| 無効                   | es2015      | シングルビルド                                  |
| 有効                   | es2015      | 差分ロード (2つのビルド 条件付きポリフィル付き |

ES5ブラウザリスト結果が `無効` の場合、ES5ブラウザのサポートは必要ありません。
それ以外の場合は、ES5ブラウザのサポートが必要です。

### 差分ロードのオプトアウト

予期しない問題が発生する場合、またはレガシーブラウザサポート専用にES5をターゲットにする必要がある場合は、差分ロードを明示的に無効にすることができます。

明示的に差分ロードを無効にするには:

- `browserslist` 設定ファイルで `dead` または `IE` ブラウザの前にある `not`キーワードを削除して有効にします。
- `compilerOptions` の `target` を `es5` に設定します。

{@a test-and-serve}

## 古いブラウザでのローカル開発

Angular CLI バージョン8以降では、デフォルトで `ng build` コマンドの差分読み込みが有効になっています。  
ただし、`ng serve`、`ng test`、`ng e2e` コマンドは、IE11などのモジュールをサポートしない古いブラウザでは実行できない単一のES2015ビルドを生成します。

開発中にES5コードを実行する場合は、差分ロードを完全に無効にすることができます。  
ただし、差分ロードの利点を維持するには、`ng serve`、`ng e2e`、`ng test` の複数の構成を定義することをお勧めします。

{@a differential-serve}

### ES5のサーバーの構成

これを `ng serve` に対して行うには、`tsconfig.app.json` とは別に次の内容の `tsconfig-es5.app.json` という新しいファイルを作成します。

<code-example language="json">

{
 "extends": "./tsconfig.app.json",
 "compilerOptions": {
     "target": "es5"
  }
}

</code-example>

`angular.json` では、`build` および `serve` ターゲットの下に2つの新しい設定セクションを追加して、新しい TypeScript 設定を指すようにします。

<code-example language="json">

"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
      ...
  },
  "configurations": {
    "production": {
        ...
    },
    "es5": {
      "tsConfig": "./tsconfig-es5.app.json"
    }
  }
},
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
      ...
  },
  "configurations": {
    "production": {
     ...
    },
    "es5": {
      "browserTarget": "<app-name>:build:es5"
    }
  }
},

</code-example>

この設定で `ng serve` コマンドを実行できます。
`<app-name>` (`"<app-name>:build:es5"` 内) を `angular.json` の `projects` の下に表示されるアプリの実際の名前に置き換えてください。たとえば、アプリ名が `myAngularApp` の場合、設定は `"browserTarget"： "myAngularApp：build：es5"` になります。

<code-example language="none" class="code-shell">

ng serve --configuration es5

</code-example>

{@a differential-test}

### テストコマンドの構成

次の内容で、`tsconfig.spec.json` とは別に `tsconfig-es5.spec.json` という新しいファイルを作成します。

<code-example language="json">

{
 "extends": "./tsconfig.spec.json",
 "compilerOptions": {
     "target": "es5"
  }
}

</code-example>

<code-example language="json">

"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    ...
  },
  "configurations": {
    "es5": {
      "tsConfig": "./tsconfig-es5.spec.json"
    }
  }
},

</code-example>

その後、この構成でテストを実行できます

<code-example language="none" class="code-shell">

ng test --configuration es5

</code-example>

### e2e コマンドの構成

上記の説明にしたがって [ES5サーバー構成](guide/deployment#differential-serve) を作成し、E2Eターゲット用にES5構成を構成します。

<code-example language="json">

"e2e": {
  "builder": "@angular-devkit/build-angular:protractor",
  "options": {
    ...
  },
  "configurations": {
    "production": {
      ...
	},
    "es5": {
      "devServerTarget": "<app-name>:serve:es5"
    }
  }
},

</code-example>

この設定で `ng e2e`コマンドを実行できます。 `<app-name>`（ `"<app-name>：serve：es5"`内）を実際のアプリの名前に置き換えてください。これは `angular.json` の `projects` の下に表示されます。たとえば、アプリ名が `myAngularApp` の場合、設定は`"devServerTarget": "myAngularApp：serve：es5"` になります。

<code-example language="none" class="code-shell">

ng e2e --configuration es5

</code-example>
