# デバッグテスト

テストが期待通りに動作しない場合、デフォルトのNode.js環境と実際のブラウザの両方でデバッグできます。

## Node.jsでのデバッグ {#debugging-in-nodejs}

デフォルトのNode.js環境でのデバッグは、ブラウザ固有のAPIやレンダリングに関連しない問題を診断する最も迅速な方法です。

1.  `ng test`コマンドを`--debug`フラグ付きで実行します:
    ```shell
    ng test --debug
    ```
2.  テストランナーがデバッグモードで起動し、デバッガーがアタッチされるのを待ちます。
3.  任意のデバッガーをアタッチできます。たとえば、VS Codeの組み込みNode.jsデバッガーや、Node.js用のChrome DevToolsを使用できます。

## ブラウザでのデバッグ {#debugging-in-a-browser}

Vitestと[ブラウザモード](/guide/testing/migrating-to-vitest#5-configure-browser-mode-optional)を使用したデバッグは、現在サポートされていません。

<!-- https://github.com/angular/angular-cli/issues/31652 が修正されたら、このセクションを更新してください>
