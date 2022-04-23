# テストのデバッグ

If your tests aren't working as you expect them to, you can inspect and debug them in the browser.

アプリケーションをデバッグするのと同じ方法で、ブラウザ内のスペックをデバッグします。

1.  Reveal the Karma browser window.
    See [Set up testing](guide/testing#set-up-testing) if you need help with this step.

1.  **DEBUG**ボタンをクリックします。新しいブラウザタブが開き、テストを再実行します。
1.  ブラウザの開発者ツール（Windowsでは`Ctrl-Shift-I`、macOSでは`Command-Option-I`）を開きます。
1.  "sources"セクションを選択します。
1.  `1st.spec.ts`テストファイル（Control/Command-Pを押して、その後にファイル名を入力してください）を開きます。
1.  テストにブレークポイントをセットします。
1.  ブラウザを更新すると、ブレークポイントで停止します。

<div class="lightbox">

<img alt="Karma debugging" src="generated/images/guide/testing/karma-1st-spec-debug.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
