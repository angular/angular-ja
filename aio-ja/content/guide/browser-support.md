# ブラウザサポート

Angularは最新のブラウザをサポートしています。サポートしているブラウザは次の表のとおりです。

<table>
  <tr>
    <th>ブラウザ</th>
    <th>サポートバージョン</th>
  </tr>
  <tr>
    <td>Chrome</td>
    <td>latest</td>
  </tr>
  <tr>
    <td>Firefox</td>
    <td>latest and extended support release (ESR)</td>
  </tr>
  <tr>
    <td>Edge</td>
    <td>2 most recent major versions</td>
  </tr>
  <tr>
    <td>Safari</td>
    <td>2 most recent major versions</td>
  </tr>
  <tr>
    <td>iOS</td>
    <td>2 most recent major versions</td>
  </tr>
  <tr>
    <td>Android</td>
    <td>2 most recent major versions</td>
  </tr>
</table>


<div class="alert is-helpful">

Angularの開発プロセスでは、各プルリクエストに対して、すべてのサポート対象ブラウザ上でユニットテストを実行しています。
ユニットテスト実行には[Sauce Labs](https://saucelabs.com/)を使用しています。

</div>

## ポリフィル {@a polyfills}

AngularはWEBプラットフォームの最新標準に基づいて構築されています。
先述したような広範囲のブラウザをターゲットにすることは困難です。なぜならそれらがモダンブラウザの機能すべてをサポートしているわけではないからです。
サポート必須なブラウザのために、ポリフィルを適用して補うことができます。
See instructions on how to include polyfills into your project below.

<div class="alert is-important">

推奨されるポリフィルはAngularアプリケーションを完全に動作させるためのものです。
リストにない機能をサポートするために追加のポリフィルが必要になるかもしれません。
ポリフィルでは、古く遅いブラウザを最新の早いブラウザに魔法のように変換できないことに注意しましょう。

</div>

## Enabling polyfills with CLI projects

The [Angular CLI](cli) provides support for polyfills.
If you are not using the CLI to create your projects, see [Polyfill instructions for non-CLI users](#non-cli).

When you create a project with the `ng new` command, a `src/polyfills.ts` configuration file is created as part of your project folder.
このファイルには必須なポリフィルと多くのオプショナルなポリフィルがJavaScriptの`import`文で盛り込まれています。

* The npm packages for the mandatory polyfills (such as `zone.js`) are installed automatically for you when you create your project with `ng new`, and their corresponding `import` statements are already enabled in the `src/polyfills.ts` configuration file.

* If you need an _optional_ polyfill, you must install its npm package, then uncomment or create the corresponding import statement in the `src/polyfills.ts` configuration file.


{@a non-cli}

## CLI未使用の場合のポリフィル設定

もしCLIを使用していない場合、自身で必要なポリフィルを直接WEBページ(`index.html`)に追加してください。

例:

<code-example header="src/index.html" language="html">
  &lt;!-- pre-zone polyfills -->
  &lt;script src="node_modules/core-js/client/shim.min.js">&lt;/script>
  &lt;script>
    /**
     * you can configure some zone flags which can disable zone interception for some
     * asynchronous activities to improve startup performance - use these options only
     * if you know what you are doing as it could result in hard to trace down bugs..
     */
    // __Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
    // __Zone_disable_on_property = true; // disable patch onProperty such as onclick
    // __zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
    /*
     * in Edge developer tools, the addEventListener will also be wrapped by zone.js
     * with the following flag, it will bypass `zone.js` patch for Edge
     */
    // __Zone_enable_cross_context_check = true;
  &lt;/script>
  &lt;!-- zone.js required by Angular -->
  &lt;script src="node_modules/zone.js/bundles/zone.umd.js">&lt;/script>
  &lt;!-- application polyfills -->
</code-example>
