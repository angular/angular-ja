# DevToolsの概要

Angular DevTools は、Angular アプリケーションのデバッグおよびプロファイリング機能を提供するブラウザ拡張機能です。
Angular DevToolsは、[最適化設定オプション](guide/workspace-config#optimization-configuration)を無効にしてコンパイルされた (<code>{optimization:false}</code>) v12以降の Angular をサポートします。

<div class="video-container">

<iframe allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" title="DevToolsの概要" allowfullscreen frameborder="0" src="https://www.youtube.com/embed/bavWOHZM6zE"></iframe>

</div>

Angular DevTools は、[Chrome ウェブストア](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) と [Firefox アドオン](https://addons.mozilla.org/en-GB/firefox/addon/angular-devtools/) で見つけられます。

Angular DevTools をインストールしたら、ブラウザの DevTools の Angular タブで拡張機能を見つけます。

<div class="lightbox">

<img alt="devtools" src="generated/images/guide/devtools/devtools.png">

</div>

拡張機能を開くと、2 つの追加のタブが表示されます。

| タブ                        | 詳細                                                         |
|:--------------------------|:-----------------------------------------------------------|
| [Components](#components) | アプリケーション内のコンポーネントとディレクティブを探索し、それらの状態をプレビューまたは編集できます。       |
| [Profiler](#profiler)     | アプリケーションのプロファイリングを行い、変更検知の実行中にパフォーマンスのボトルネックが何であるかを理解できます。 |

<div class="lightbox">

<img alt="devtools tabs" src="generated/images/guide/devtools/devtools-tabs.png">

</div>

Angular DevTools の右上隅には、ページで実行されている Angular のバージョンと、拡張機能の最新のコミットハッシュが表示されます。

## バグレポート

[GitHub](https://github.com/angular/angular/issues) で問題と機能のリクエストを報告してください。

プロファイラーの問題を報告するには、**Save Profile** ボタンをクリックしてプロファイラーの記録をエクスポートし、ファイルとしてイシューに添付します。

<div class="alert is-helpful">

プロファイラーの記録に機密情報が含まれていないことを確認してください。

</div>

<a id="components"></a>

## アプリケーションをデバッグする

**Components** タブでは、アプリケーションの構造を調べることができます。
コンポーネントとディレクティブのインスタンスを視覚化して検査し、それらの状態をプレビューまたは変更できます。
次のいくつかのセクションでは、このタブを効果的に使用してアプリケーションをデバッグする方法を検討します。

### アプリケーションの構造を調べる

<div class="lightbox">

<img alt="component-explorer" src="generated/images/guide/devtools/component-explorer.png">

</div>

上のスクリーンショットでは、アプリケーションのコンポーネントツリーを確認できます。

コンポーネントツリーには、アプリケーション内の *コンポーネントとディレクティブ* の階層関係が表示されます。
コンポーネントまたはディレクティブインスタンスを選択すると、Angular DevTools はそのインスタンスに関する追加情報を表示します。

### プロパティを見る

コンポーネントエクスプローラーで個々のコンポーネントまたはディレクティブをクリックして選択し、それらのプロパティをプレビューします。
Angular DevTools は、プロパティとメタデータをコンポーネントツリーの右側に表示します。

マウスまたは次のキーボードショートカットを使用して、コンポーネントツリー内を移動します。

| キーボードショートカット     | 詳細                                 |
|:---                   |:-----------------------------------|
| 上下の矢印    | 前のノードと次のノードを選択する |
| 左右の矢印 | ノードの折りたたみと展開         |

コンポーネントまたはディレクティブを名前で検索するには、コンポーネントツリーの上にある検索ボックスを使用します。
次の検索結果に移動するには、`Enter` キーを押します。
前の検索結果に移動するには、`Shift + Enter` キーを押します。

<div class="lightbox">

<img alt="search" src="generated/images/guide/devtools/search.png">

</div>

### ホストノードに移動する

特定のコンポーネントまたはディレクティブのホスト要素に移動するには、コンポーネントエクスプローラーでそれらを見つけてダブルクリックします。
ブラウザの DevTools は、Chrome の Elements タブまたは Firefox の Inspector タブを開き、関連する DOM ノードを選択します。

### ソースに移動する

コンポーネントの場合、Angular DevTools では、ソースタブのコンポーネント定義に移動することもできます。
特定のコンポーネントを選択したら、プロパティビューの右上にあるアイコンをクリックします。

<div class="lightbox">

<img alt="navigate source" src="generated/images/guide/devtools/navigate-source.png">

</div>

### プロパティ値を更新する

ブラウザの DevTools と同様に、プロパティビューを使用すると、入力、出力、または別のプロパティの値を編集できます。
プロパティ値を右クリックします。
この値のタイプで編集機能が使用可能な場合は、テキスト入力が表示されます。
新しい値を入力して `Enter` を押します。

<div class="lightbox">

<img alt="update property" src="generated/images/guide/devtools/update-property.png">

</div>

### コンソールで選択したコンポーネントまたはディレクティブにアクセスする

コンソールのショートカットとして、Angular DevTools は最近選択したコンポーネントまたはディレクティブのインスタンスへのアクセスを提供します。
現在選択されているコンポーネントまたはディレクティブのインスタンスへの参照を取得するには `$ng0` と入力し、その前に選択したインスタンスの場合は `$ng1` と入力します。

<div class="lightbox">

<img alt="access console" src="generated/images/guide/devtools/access-console.png">

</div>

### ディレクティブまたはコンポーネントを選択する

ブラウザの DevTools と同様に、ページを調べて特定のコンポーネントまたはディレクティブを選択できます。
Angular DevTools 内の左上隅にある ***Inspect element*** アイコンをクリックし、ページ上の DOM 要素にカーソルを合わせます。
拡張機能は、関連するディレクティブやコンポーネントを認識し、コンポーネントツリーで対応する要素を選択できるようにします。

<div class="lightbox">

<img alt="selecting dom node" src="generated/images/guide/devtools/inspect-element.png">

</div>

<a id="profiler"></a>

## アプリケーションをプロファイリングする

**Profiler** タブでは、Angular の変更検知の実行をプレビューできます。

<div class="lightbox">

<img alt="profiler" src="generated/images/guide/devtools/profiler.png">

</div>

プロファイラーを使用すると、プロファイリングを開始したり、既存のプロファイルをインポートしたりできます。
アプリケーションのプロファイリングを開始するには、**Profiler** タブ内の左上隅にある円の上にカーソルを置き、**Start recording** をクリックします。

プロファイリング中、Angular DevTools は変更検知やライフサイクルフックの実行などの実行イベントをキャプチャします。
記録を終了するには、円をもう一度クリックして **記録を停止** します。

既存の記録をインポートすることもできます。
この機能の詳細については、[記録をインポートする](#) セクションを参照してください。

### アプリケーションの実行を理解する

次のスクリーンショットは、記録が完了した後のプロファイラーの既定の表示内容の例です。

<div class="lightbox">

<img alt="default profiler view" src="generated/images/guide/devtools/default-profiler-view.png">

</div>

ビューの上部近くに一連のバーが表示され、それぞれがアプリケーションの変更検知サイクルを象徴しています。
バーが高いほど、アプリケーションがこのサイクルで費やした時間が長いことを意味します。
バーを選択すると、DevTools は、このサイクル中にキャプチャしたすべてのコンポーネントとディレクティブを含む棒グラフをレンダリングします。

<div class="lightbox">

<img alt="profiler selected bar" src="generated/images/guide/devtools/profiler-selected-bar.png">

</div>

変更検知タイムラインの早い段階で、Angular がこのサイクルに費やした時間を確認できます。
Angular DevTools は、この時点でフレームの欠落を推定して、アプリケーションの実行がいつユーザー体験に影響を与える可能性があるかを示します。

Angular DevTools は、何が変更検知をトリガーしたか \(つまり、変更検知のソース\) も示します。

### コンポーネントの実行を理解する

バーをクリックすると、アプリケーションが特定のディレクティブまたはコンポーネントで費やした時間に関する詳細ビューが表示されます。

<div class="lightbox">

<img alt="directive details" src="generated/images/guide/devtools/directive-details.png">

</div>

この図は、NgforOf ディレクティブによって費やされた合計時間と、その中で呼び出されたメソッドを示しています。
また、選択したディレクティブの親階層も表示されます。

### 階層ビュー

<div class="lightbox">

<img alt="flame graph view" src="generated/images/guide/devtools/flame-graph-view.png">

</div>

フレームグラフのようなビューで変更検知の実行をプレビューすることもできます。
グラフ内の各タイルは、レンダーツリー内の特定の位置にある画面上の要素を表します。

たとえば、ある変更検知サイクル中にコンポーネントツリーの特定の位置に `ComponentA` があり、このコンポーネントが削除され、その代わりに Angular が `ComponentB` をレンダリングした場合、両方のコンポーネントが同じタイルに表示されます。

各タイルは、Angular がそこで費やした時間に応じて色付けされます。
DevTools は、変更検知にもっとも時間をかけたタイルとの相対的な時間によって、色の濃さを決定します。

特定のタイルをクリックすると、右側のパネルに詳細が表示されます。
タイルをダブルクリックすると拡大され、ネストされた子をプレビューできます。

### OnPushをデバッグする

Angular が変更を検知したコンポーネントをプレビューするには、フレームグラフの上にある **Change detection** チェックボックスを選択します。

このビューは、Angular が変更検知を実行したすべてのタイルを緑色で、残りを灰色で色付けします。

<div class="lightbox">

<img alt="debugging onpush" src="generated/images/guide/devtools/debugging-onpush.png">

</div>

### 記録をインポートする

記録されたプロファイリングセッションの右上にある **Save Profile** ボタンをクリックして、JSON ファイルとしてエクスポートし、ディスクに保存します。
次に、 **Choose file** をクリックして、プロファイラーの初期ビューでファイルをインポートします。

<div class="lightbox">

<img alt="save profile" src="generated/images/guide/devtools/save-profile.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
