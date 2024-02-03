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

[Angular CLI](cli)では、ポリフィルをサポートしています。
新しいプロジェクトが作成されると、CLI は `src/polyfills.ts` ファイルも作成します。
アプリケーションがポリフィルを必要とする場合は、`src/polyfills.ts` ファイルに追加してください。

CLIを使ってプロジェクトを作成しない場合は、[CLI非使用の場合のポリフィル設定](#non-cli) セクションを参照してください。

カスタムポリフィル用のTypeScriptファイルを作成する場合は、必ず`tsconfig`ファイルの`files`プロパティにインクルードしてください。

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

## CLI非使用の場合のポリフィル設定

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
