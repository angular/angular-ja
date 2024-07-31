# デバッグテスト

テストが期待通りに動作しない場合は、ブラウザでテストを検査してデバッグできます。

アプリケーションをデバッグするのと同じように、ブラウザでスペックをデバッグできます。

1. Karmaブラウザウィンドウを表示します。
    この手順で助けが必要な場合は、[テストの設定](guide/testing#set-up-testing)をご覧ください。

1. **DEBUG**ボタンをクリックして新しいブラウザタブを開き、テストを再実行します。
1. ブラウザの**開発者ツール**を開きます。Windowsでは`Ctrl-Shift-I`、macOSでは`Command-Option-I`を押します。
1. **Sources**セクションを選択します。
1. `Control/Command-P`を押して、テストファイルの名前を入力し始めると、ファイルが開きます。
1. テストにブレークポイントを設定します。
1. ブラウザを更新すると、ブレークポイントで停止します。

<img alt="Karma debugging" src="assets/images/guide/testing/karma-1st-spec-debug.png">
