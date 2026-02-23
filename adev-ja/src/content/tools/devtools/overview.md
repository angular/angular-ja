# DevToolsの概要 {#devtools-overview}

Angular DevToolsは、Angularアプリケーションのデバッグとプロファイリング機能を提供するブラウザ拡張機能です。

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Angular DevToolsは、[Chrome Web Store](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh)または[Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/)からインストールできます。

<kbd>F12</kbd>または<kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd>（WindowsまたはLinux）および<kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd>または<kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd>（Mac）を押して、任意のWebページでChromeまたはFirefoxのDevToolsを開くことができます。
ブラウザのDevToolsが開いていてAngular DevToolsがインストールされている場合は、「Angular」タブで見つけることができます。

HELPFUL: Chromeの新しいタブページではインストールされている拡張機能は実行されないため、DevToolsに「Angular」タブは表示されません。表示するには、他のページにアクセスしてください。

<img src="assets/images/guide/devtools/devtools.png" alt="アプリケーションのコンポーネントツリーを示すAngular DevToolsの概要。">

## アプリケーションを開く {#open-your-application}

拡張機能を開くと、次の3つの追加タブが表示されます。

| タブ                                      | 詳細                                                                                                                 |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| [Components](tools/devtools/component)    | アプリケーション内のコンポーネントとディレクティブを探索し、それらの状態をプレビューまたは編集できます。                    |
| [Profiler](tools/devtools/profiler)       | アプリケーションをプロファイルし、変更検知の実行中のパフォーマンスのボトルネックがどこにあるかを理解できます。 |
| [Injector Tree](tools/devtools/injectors) | 環境インジェクターと要素インジェクターの階層を視覚化できます。                                                      |

`Router Tree`や`Transfer State`などの他のタブは実験的であり、DevToolsの設定から有効にできますが、まだドキュメント化されていません。

HELPFUL: Chromiumベースのブラウザのユーザーには、[パフォーマンスパネル統合](/best-practices/profiling-with-chrome-devtools)が興味深いかもしれません。

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="Angular DevToolsの上部を示すスクリーンショットで、左上の角に2つのタブが表示されています。1つは「Components」とラベル付けされ、もう1つは「Profiler」とラベル付けされています。">

Angular DevToolsの右上隅には、ポップオーバーを開く情報ボタンがあります。
情報ポップオーバーには、ページで実行されているAngularのバージョンとDevToolsのバージョンなどが含まれています。

### Angularアプリケーションが検出されません {#angular-application-not-detected}

Angular DevToolsを開くと、「Angularアプリケーションが検出されませんでした」というエラーメッセージが表示される場合、これはページ上のAngularアプリケーションと通信できないことを意味します。
これは、検査しているWebページにAngularアプリケーションが含まれていないためです。
適切なWebページを検査していること、およびAngularアプリケーションが実行されていることを確認してください。

### プロダクション構成でビルドされたアプリケーションが検出されました {#we-detected-an-application-built-with-production-configuration}

「プロダクション構成でビルドされたアプリケーションが検出されました。Angular DevToolsは開発ビルドのみサポートしています。」というエラーメッセージが表示される場合、ページにAngularアプリケーションが見つかりましたが、プロダクション最適化でコンパイルされたことを意味します。
プロダクション用にコンパイルすると、Angular CLIはパフォーマンスを向上させるために、ページ上のJavaScriptの量を最小限に抑えるために、さまざまなデバッグ機能を削除します。これには、DevToolsと通信するために必要な機能も含まれます。

DevToolsを実行するには、最適化を無効にしてアプリケーションをコンパイルする必要があります。`ng serve`は、デフォルトでこれを実行します。
デプロイされたアプリケーションをデバッグする必要がある場合は、[`optimization`構成オプション](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`)を使用して、ビルドの最適化を無効にします。
