# テストのデバッグ

If your tests aren't working as you expect them to, you can inspect and debug them in the browser.

<div class="alert is-helpful">

  For the sample app that the testing guides describe, see the <live-example name="testing" embedded-style noDownload>sample app</live-example>.

  For the tests features in the testing guides, see <live-example name="testing" stackblitz="specs" noDownload>tests</live-example>.

</div>


アプリケーションをデバッグするのと同じ方法で、ブラウザ内のスペックをデバッグします。

1. Karmaのブラウザウィンドウを表示します（前に隠れています）。
1. **DEBUG**ボタンをクリックします。新しいブラウザタブが開き、テストを再実行します。
1. ブラウザの開発者ツール（Windowsでは`Ctrl-Shift-I`、macOSでは`Command-Option-I`）を開きます。
1. "sources"セクションを選択します。
1. `1st.spec.ts`テストファイル（Control/Command-Pを押して、その後にファイル名を入力してください）を開きます。
1. テストにブレークポイントをセットします。
1. ブラウザを更新すると、ブレークポイントで停止します。

<div class="lightbox">
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma debugging">
</div>

<hr>
