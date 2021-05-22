# プロダクションにおけるService Worker

このページは、Angular Service Workerを使用するプロダクションアプリケーションのデプロイと運用についてのリファレンスです。Angular Service Workerが、より大きなプロダクション環境で、さまざまな条件下でのService Workerの振る舞い、利用可能な手段、およびフェイルセーフにどのように適合するかについて説明します。

#### 前提条件

次の基本的理解があること
* [Service Workerと通信する](guide/service-worker-communications)

## Service Workerとアプリケーションリソースのキャッシュ

概念的には、Angular Service Workerは、エンドユーザーのWebブラウザにインストールされているフォワードキャッシュまたはCDNエッジと考えることができます。Service Workerの仕事は、ネットワークを待つことなく、Angularアプリケーションがリソースまたはデータを要求したら、ローカルキャッシュからその要求を満たすことです。他のキャッシュと同様に、コンテンツの期限切れおよび更新方法に関するルールがあります。

{@a versions}

### アプリケーションのバージョン

Angular Service Workerのコンテキストでは、"バージョン"はAngularアプリケーションの特定のビルドを表すリソースの集合です。アプリケーションの新しいビルドがデプロイされるたびに、Service Workerはそのビルドを新しいバージョンのアプリケーションとして扱います。これは、単一のファイルのみが更新された場合でも当てはまります。ある時点で、Service Workerはキャッシュ内に複数のバージョンのアプリケーションをもつことができ、同時にサービスを提供している可能性があります。詳細については、後の[タブ間のアプリケーション](guide/service-worker-devops#tabs)セクションを参照してください。

アプリケーションの整合性を保つために、Angular Service Workerはすべてのファイルを一緒にバージョンとしてグループ化します。バージョンにグループ化されたファイルには、通常、HTML、JS、およびCSSファイルが含まれます。HTML、JS、およびCSSファイルは頻繁に相互参照し、特定のコンテンツに依存するため、これらのファイルのグループ化は整合性にとって不可欠です。たとえば、`index.html`ファイルに`bundle.js`を参照する`<script>`タグがあり、そのスクリプト内から`startApp()`関数を呼び出そうとするかもしれません。このバージョンの`index.html`が提供されるたびに、それに対応する`bundle.js`が提供されなければなりません。たとえば、`startApp()`関数の名前が両方のファイルで`runApp()`に変更されたとします。このシナリオでは`runApp()`を定義する新しいバンドルとともに`startApp()`を呼び出す古い`index.html`を提供することは妥当ではありません。


このファイルの整合性は、遅延読み込みモジュールの場合に特に重要です。JSバンドルは多くの遅延チャンクを参照しますが、遅延チャンクのファイル名は、アプリケーションの特定のビルドに固有のものです。実行中のバージョン`X`のアプリケーションは遅延チャンクを読み込もうとしますが、サーバーではバージョン`X+1`にすでに更新されている場合、遅延読み込み操作は失敗します。

アプリケーションのバージョン識別子は、すべてのリソースのコンテンツによって決まります。リソースの何かが変更されれば変わります。実際には、バージョンは、すべての既知のコンテンツのハッシュを持っている`ngsw.json`ファイルの内容によって決まります。キャッシュされたファイルのいずれかが変更された場合、ファイルのハッシュは`ngsw.json`で変更され、Angular Service Workerは、アクティブなファイルセットを新しいバージョンとして扱います。

Angular Service Workerのバージョン管理動作により、アプリケーションサーバーが、Angularアプリケーションに常に一貫性のあるファイルセットを持たせることを保証できます。

#### アップデートのチェック

ユーザーがアプリケーションを開いたり更新したりするたびに、Angular Service Workerは、`ngsw.json`マニフェストの更新を探して、アプリケーションのアップデートをチェックします。もしアップデートが見つかると、それは自動的にダウンロードされ、キャッシュされ、次回アプリケーションがロードされたときに配信されます。

### リソースの整合性

長いキャッシングの潜在的な副作用の1つは、無効なリソースを誤ってキャッシュすることです。通常のHTTPキャッシュでは、ハードリフレッシュまたはキャッシュの有効期限が、無効なファイルをキャッシュしてしまうという負の影響を制限します。Service Workerはこのような制約を無視し、アプリケーション全体をキャッシュします。したがって、Service Workerが正しいコンテンツを入手することが不可欠です。

リソースの整合性を保証するために、Angular Service Workerは、ハッシュを持っているリソースならすべてのハッシュを検証します。通常、[Angular CLI](cli)で作られたアプリケーションの場合、これはユーザーの`src/ngsw-config.json`で設定されている`dist`ディレクトリのすべてが対象になります。

特定のファイルが検証に失敗した場合、Angular Service Workerは、ブラウザまたは中間キャッシングの影響を排除するために、URLパラメーター"cache-busting"を使用してコンテンツを再取得しようとします。そのコンテンツも検証に失敗すると、Service Workerはアプリケーション全体のバージョンが無効であるとみなし、アプリケーションの配信を止めます。必要に応じて、Service Workerは、無効な、破損した、または古くなったコンテンツを配信するリスクが高い場合に、キャッシュを使用しないように、リクエストの処理をネットワークに戻すセーフモードに入ります。

ハッシュのミスマッチは、さまざまな理由で発生する可能性があります。

* オリジンサーバーとエンドユーザーの間のレイヤーをキャッシュすると、古いコンテンツが配信される可能性があります。
* 非アトミックなデプロイを行うと、途中段階の更新コンテンツをAngular Service Workerに見せてしまう可能性があります。
* ビルドプロセス中にエラーが発生すると、`ngsw.json`が更新されずにリソースが更新される可能性があります。その逆もまた起こり、更新されたリソースが無いのに`ngsw.json`だけが更新される状況を引き起こします。

#### ハッシュされていないコンテンツ

`ngsw.json`マニフェストの中でハッシュを持っているリソースは、マニフェストの作成時に`dist`ディレクトリにあったリソースだけになります。その他のリソース、特にCDNから読み込まれたリソースには、ビルド時に不明であるコンテンツや、アプリケーションのデプロイメントより頻繁に更新されるコンテンツがあります。

Angular Service Workerが特定のリソースを検証するためのハッシュを持っていない場合でも、その内容はキャッシュされますが、"stale while revalidate"というポリシーを使用してHTTPキャッシュヘッダーを受け入れます。つまり、キャッシュされたリソースのHTTPキャッシュヘッダーがリソースの有効期限が切れたことを示す場合、Angular Service Workerはコンテンツの配信を続けつつ、バックグラウンドでリソースを更新しようとします。このように、ハッシュされていない壊れたリソースは、設定されたライフタイムを超えてキャッシュに残りません。

{@a tabs}

### タブ間のアプリケーション

受信しているリソースのバージョンが突然変更されるか、または警告なしで問題が発生する可能性があります。このような問題の説明については、上記の[アプリケーションのバージョン](guide/service-worker-devops#versions)のセクションを参照してください。

Angular Service Workerは保証を提供します。実行中のアプリケーションは引き続き同じバージョンのアプリケーションを実行します。アプリケーションの別のインスタンスが新しいウェブブラウザタブで開かれている場合、最新バージョンのアプリケーションが提供されます。その結果、新しいタブでは元のタブとは異なるバージョンのアプリケーションが実行される可能性があります。

この保証は、通常のWebデプロイモデルで提供されているものより**強力**であることに注意することが重要です。実行中のアプリケーションより後のタイミングに遅延ロードされるコードは、Service Workerがなければ、そのアプリケーションの初期コードと同じバージョンからのものであるという保証はありません。

Angular Service Workerが実行中のアプリケーションのバージョンを変更する理由はいくつかに限られています。それらのいくつかはエラーのケースです。

* ハッシュに失敗すると、現在のバージョンが無効になります。
* 無関係のエラーが発生すると、Service Workerはセーフモードに入ります。すなわち、一時的な非活性化です。

Angular Service Workerは、特定の時点でどのバージョンが使用されているかを認識しており、タブで使用されていないバージョンをクリーンアップします。

Angular Service Workerが実行中のアプリケーションのバージョンを変更するその他の理由は、通常のイベントになります。

* ページが再読み込み、または更新された。
* `SwUpdate`サービスを介して、ページがアップデートを直ちにアクティブ化するように要求した。

### Service Workerの更新

Angular Service Workerは、Webブラウザで動作する小さなスクリプトです。
時折、Service Workerはバグフィックスや機能改善で更新されます。

Angular Service Workerは、アプリケーションが最初に開かれたとき、および一定期間使用しないでアクセスしたときにダウンロードされます。Service Workerが変更された場合、Service Workerはバックグラウンドで更新されます。

Angular Service Workerの最新情報は、アプリケーションにはわかりません。古いキャッシュは引き続き有効で、コンテンツは引き続き配信されます。ただし、Angular Service Workerのバグフィックスや機能では、古いキャッシュが無効になることがあります。この場合、アプリケーションはネットワークから透過的にリフレッシュされます。

### Service Workerを回避する

ある場合では、Service Workerを完全に回避し代わりにブラウザでリクエストを処理したい
ケースがあるかも知れません。たとえば、現在Service Workerでサポートされていない機能に依存している
場合です。(例:
[アップロードされたファイルの進捗状況の報告する](https://github.com/w3c/ServiceWorker/issues/1141)).

Service Workerを回避するために`ngsw-bypass`をリクエストヘッダーかクエリパラメータにセットすることもできます。
(ヘッダーやクエリパラメータの値は無視され、空にするか省略することもできます)

## Angular Service Workerのデバッグ

時には、問題を調査したり、設計どおりに動作しているかどうかを確認するために、実行状態のAngular Service Workerを調べることが必要な場合があります。ブラウザにはService Workerをデバッグするための組み込みツールが用意されていますが、Angular Service Worker自体にも便利なデバッグ機能があります。

### デバッグ情報の検索と分析

Angular Service Workerは、デバッグ情報を`ngsw/`仮想ディレクトリの下に公開します。現在、公開されている唯一のURLは`ngsw/state`です。このデバッグページの内容の例を次に示します。

```
NGSW Debug Info:

Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 * init post-load (update, cleanup)

Debug log:
```

#### Driver state

最初の行はドライバの状態を示します。

```
Driver state: NORMAL ((nominal))
```

`NORMAL`は、Service Workerが正常に動作しており、デグレード状態にないことを示します。

2つのデグレード状態が考えられます。

* `EXISTING_CLIENTS_ONLY`: Service Workerは、既知の最新バージョンのクリーンコピーを持っていません。古いバージョンのキャッシュは安全に使用できるので、既存のタブはキャッシュから引き続き実行されますが、新しいアプリケーションのセットがネットワークから配信されるでしょう。
The service worker will try to recover from this state when a new
version of the application is detected and installed (that is,
when a new `ngsw.json` is available).

* `SAFE_MODE`: Service Workerはキャッシュされたデータの安全性を保証できません。予期しないエラーが発生したか、またはキャッシュされたすべてのバージョンが無効です。すべてのトラフィックはネットワークから提供され、最小限のService Workerのコードを実行します。

いずれの場合も、括弧内の注釈は、Service Workerがデグレード状態に入る原因となったエラーを提示します。

どちらの状態も一時的なものであり、[Service Workerのインスタンス](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)
が存続する間だけ保存されます。
ブラウザはメモリやプロセッサの電力を節約するために、アイドル状態のService Workerを
終了させることがあります。また、ネットワークイベントに応じて新しいService Workerの
インスタンスを作成します。新しいインスタンスは、前のインスタンスの状態にかかわらず
`NORMAL`モードで起動します。

#### Latest manifest hash

```
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
```

これは、Service Workerが知っている最新のバージョンのアプリケーションのSHA1ハッシュです。


#### Last update check

```
Last update check: never
```

これは、Service Workerがアプリケーションの新しいバージョンまたはアップデートを最後に確認した時刻を示します。`never`は、まだService Workerがアップデートをチェックしたことがないことを示します。

このサンプルのデバッグファイルでは、アップデートチェックは現在スケジュールされています。次のセクションで説明します。

#### Version

```
=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65
```

この例では、Service Workerは、1つのバージョンのアプリケーションをキャッシュし、2つの異なるタブに提供するために使用しています。このバージョンハッシュは、上記の"最新のマニフェストのハッシュ"です。どちらのクライアントも最新バージョンです。各クライアントはブラウザの `Clients`APIからIDでリストされています。


#### Idle task queue

```
=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 * init post-load (update, cleanup)
```

アイドルタスクキューは、Service Workerのバックグラウンドで発生する保留中のすべてのタスクのキューです。キューにタスクがある場合は、説明とともにリストされています。この例では、Service Workerにスケジュールされたタスクが1つあり、アップデートチェックと古いキャッシュのクリーンアップを含む初期化後の操作があります。

Last update tick/run カウンターは、アイドルキューに関連する特定のイベントが発生してからの時間を示します。"Last update run"カウンターには、アイドルタスクが実際に最後に実行された時刻が表示されます。"Last update tick"は、キューが処理された最後のイベント以降の時間を示します。


#### Debug log

```
Debug log:
```

Service Worker内で発生するエラーがここに記録されます。


### デベロッパーツール

Chromeなどのブラウザは、Service Workerとやり取りするための開発ツールを提供します。そのようなツールは、適切に使用されると強力になりますが、いくつか注意事項があります。

* デベロッパーツールを使用している場合、Service Workerはバックグラウンドで稼動し続け、再起動しません。DevToolsを開いた状態での動作がユーザーの動作と異なることがあります。

* Cache Storageビューアを見ると、キャッシュは頻繁に古くなっています。Cache Storageタイトルを右クリックし、キャッシュをリフレッシュしてください。

Service WorkerペインでService Workerを停止して開始すると、アップデートのチェックがトリガーされます。

## Service Workerの安全性

あらゆる複雑なシステムと同様に、バグや壊れた設定によって、
Angular Service Workerが予期しない方法でふるまう可能性があります。
そのような問題の影響を最小限に抑えるよう設計されていますが、管理者がService Workerを迅速に非アクティブ化する必要がある場合に備えて、AngularService Workerにはフェールセーフメカニズムが組み込まれています。

### フェールセーフ {@a fail-safe}

Service Workerを非アクティブにするには、 `ngsw.json`ファイルを削除するか名前を変更します。
Service Workerの `ngsw.json`に対する要求が`404`を返すと、Service Workerはすべてのキャッシュを削除し、
自身を登録解除し、自己破棄します。

### Safety Worker {@a safety-worker}

`@angular/service-worker`NPMパッケージには`safety-worker.js`という小さなスクリプトも含まれています。
このスクリプトは読み込まれるとブラウザから自身を登録解除します。
クライアントページにすでにインストールされている
不要なService Workerを取り除く最後の手段として使用できます。

このワーカーを直接登録できないことに注意してください。
キャッシュされた状態の古いクライアントは、
別のワーカースクリプトをインストールする新しい`index.html`を見ないかもしれないからです。
代わりに、Service Workerスクリプトの登録を取り消そうとしているURLに
`safety-worker.js`のスクリプト内容を供給しなければなりません。
すべてのユーザーが古いワーカーを正常に登録解除したことが分かるまで、
引き続き行う必要があります。
ほとんどのサイトでは、古いService Worker URLに永久にSafety Workerを供給するべきこととなります。

このスクリプトは、
あなたのサイトで過去に提供されていたService Workerだけでなく
`@angular/service-worker`を無効にするためにも使用できます。

### アプリケーションの場所(URL)を変更する

ここで注意しておきたいのは、Service Workerはリダイレクトの後では動作しないということです。
あなたはすでに`The script resource is behind a redirect, which is disallowed`というエラーに遭遇したことがあるかも知れません。

これはあなたが アプリケーションの場所(URL)を変更する必要がある場合に問題となります。もし
古いURL(たとえば`example.com`)から新しいURL(たとえば`www.example.com`)
にリダイレクトを設定すると、Service Workerは動作しなくなります。
また、Service Workerから完全にサイトを読み込んでいるユーザーの場合、
リダイレクトはされません。古いService Worker(`example.com`に登録されているもの)は
更新しようとして`example.com`という古いURLにリクエストを送信します。しかし、
このURLはすでに`www.example.com`という新しい場所(URL)にリダイレクトされており
`The script resource is behind a redirect, which is disallowed`というエラーを発生させます。

この問題を解決するためには、上記のような方法で古いService Workerを解除する必要があります。
([フェールセーフ](#fail-safe)または[Safety Worker](#safety-worker))


## もっとAngular Service Workerを知りたい

次の記事がお勧めです。
* [Service Workerの設定](guide/service-worker-config).

