# ブラウザサポート

Angularは最新のブラウザをサポートしています。
サポートしているブラウザは次の表のとおりです。

| Browser | Supported versions |
|:---     |:---                |
| Chrome  | 2 most recent versions                      |
| Firefox | latest and extended support release \(ESR\) |
| Edge    | 2 most recent major versions                |
| Safari  | 2 most recent major versions                |
| iOS     | 2 most recent major versions                |
| Android | 2 most recent major versions                |

<div class="alert is-helpful">

Angularの開発プロセスでは、各プルリクエストに対して、すべてのサポート対象ブラウザ上でユニットテストを実行しています。ユニットテスト実行には[Sauce Labs](https://saucelabs.com/)を使用しています。

</div>

## ポリフィル {@a polyfills}

AngularはWEBプラットフォームの最新標準に基づいて構築されています。
先述したような広範囲のブラウザをターゲットにすることは困難です。なぜならそれらがモダンブラウザの機能すべてをサポートしているわけではないからです。
サポート必須なブラウザのために、ポリフィルを適用して補うことができます。
See instructions on how to include polyfills into your project below.

<div class="alert is-important">

推奨されるポリフィルはAngularアプリケーションを完全に動作させるためのものです。
リストにない機能をサポートするために追加のポリフィルが必要になるかもしれません。

</div>

<div class="alert is-helpful">

**NOTE**: <br />
Polyfills cannot magically transform an old, slow browser into a modern, fast one.

</div>

## CLIプロジェクトでポリフィルを有効にする

[Angular CLI](cli)では、ポリフィルをサポートしています。
CLIを使わずにプロジェクトを作成する場合は、[非CLIユーザーのためのポリフィル解説](#non-cli)をご覧ください。

[browser](cli/build) と [test](cli/test) のビルダーの `polyfills` オプションには、ファイルへのフルパス(例: `src/polyfills.ts`)、
現在のワークスペースからの相対パス、またはモジュール指定子(例: `zone.js`)を指定できます。

TypeScriptファイルを作成した場合は、必ず `tsconfig` ファイルの `files` プロパティに含めてください。

<code-example language="jsonc" syntax="jsonc">

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    ...
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ]
  ...
}

</code-example>

<a id="non-cli"></a>

## CLI未使用の場合のポリフィル設定

もしCLIを使用していない場合、自身で必要なポリフィルを直接WEBページ(`index.html`)に追加してください。

例:

<code-example header="src/index.html" language="html">

&lt;!-- pre-zone polyfills --&gt;
&lt;script src="node_modules/core-js/client/shim.min.js"&gt;&lt;/script&gt;
&lt;script>
  /**
   &ast; you can configure some zone flags which can disable zone interception for some
   &ast; asynchronous activities to improve startup performance - use these options only
   &ast; if you know what you are doing as it could result in hard to trace down bugs.
   */
  // &lowbar;&lowbar;Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
  // &lowbar;&lowbar;Zone_disable_on_property = true; // disable patch onProperty such as onclick
  // &lowbar;&lowbar;zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
  /*
   &ast; in Edge developer tools, the addEventListener will also be wrapped by zone.js
   &ast; with the following flag, it will bypass `zone.js` patch for Edge.
   */
  // &lowbar;&lowbar;Zone_enable_cross_context_check = true;
&lt;/script&gt;
&lt;!-- zone.js required by Angular --&gt;
&lt;script src="node_modules/zone.js/bundles/zone.umd.js"&gt;&lt;/script&gt;
&lt;!-- application polyfills --&gt;

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-11-04
