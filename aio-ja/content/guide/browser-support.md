# ブラウザサポート

Angularは最新のブラウザをサポートしています。サポートしているブラウザは次の表のとおりです。

<table>

  <tr>

<th>
      ブラウザ
</th>

<th>
      サポートバージョン
</th>

  </tr>

  <tr>

    <td>
      Chrome
    </td>

    <td>
      latest
    </td>
  </tr>

  <tr>

    <td>
      Firefox
    </td>

    <td>
      latest
    </td>
  </tr>

  <tr>

    <td>
      Edge
    </td>

    <td>
      2 most recent major versions
    </td>
  </tr>
  <tr>
    <td>
      IE
    </td>
    <td>
      11, 10, 9 ("compatibility view" mode not supported)
    </td>
  </tr>
 <tr>
   <tr>
    <td>
      IE Mobile
    </td>
    <td>
      11
    </td>
  </tr>
 <tr>
    <td>
      Safari
    </td>

    <td>
      2 most recent major versions
    </td>
  </tr>
  <tr>
    <td>
      iOS
    </td>

    <td>
      2 most recent major versions
    </td>
  </tr>
  <tr>
    <td>
      Android
    </td>

    <td>
      Nougat (7.0), Marshmallow (6.0), Lollipop (5.0, 5.1), KitKat (4.4)
    </td>
  </tr>

</table>

<div class="alert is-helpful">

Angularの開発プロセスでは、各プルリクエストに対して、すべてのサポート対象ブラウザ上でユニットテストを実行しています。
ユニットテスト実行には<a href="https://saucelabs.com/">SauceLabs</a>と
<a href="https://www.browserstack.com">Browserstack</a>を使用しています。

</div>

## ポリフィル {@a polyfills}

AngularはWEBプラットフォームの最新標準に基づいて構築されています。
先述したような広範囲のブラウザをターゲットにすることは困難です。なぜならそれらがモダンブラウザの機能すべてをサポートしているわけではないからです。
サポート必須なブラウザのために、ポリフィルを適用して補うことができます。
[後述の表](#polyfill-libs)に必要になる可能性があるポリフィルのほとんどを記載しています。

<div class="alert is-important">

推奨されるポリフィルはAngularアプリケーションを完全に動作させるためのものです。
リストにない機能をサポートするために追加のポリフィルが必要になるかもしれません。
ポリフィルでは、古く遅いブラウザを最新の早いブラウザに魔法のように変換できないことに注意しましょう。

</div>

In Angular CLI version 8 and higher, applications are built using *differential loading*, a strategy where the CLI builds two separate bundles as part of your deployed application.

* The first bundle contains modern ES2015 syntax, takes advantage of built-in support in modern browsers, ships less polyfills, and results in a smaller bundle size.

* The second bundle contains code in the old ES5 syntax, along with all necessary polyfills. This results in a larger bundle size, but supports older browsers.

This strategy allows you to continue to build your web application to support multiple browsers, but only load the necessary code that the browser needs.
For more information about how this works, see [Differential Loading](guide/deployment#differential-loading) in the [Deployment guide](guide/deployment).

## Enabling polyfills with CLI projects

The [Angular CLI](cli) provides support for polyfills.
If you are not using the CLI to create your projects, see [Polyfill instructions for non-CLI users](#non-cli).

When you create a project with the `ng new` command, a `src/polyfills.ts` configuration file is created as part of your project folder.
このファイルには必須なポリフィルと多くのオプショナルなポリフィルがJavaScriptの`import`文で盛り込まれています。

* The npm packages for the [_mandatory_ polyfills](#polyfill-libs) (such as `zone.js`) are installed automatically for you when you create your project with `ng new`, and their corresponding `import` statements are already enabled in the `src/polyfills.ts` configuration file.

* If you need an _optional_ polyfill, you must install its npm package, then uncomment or create the corresponding import statement in the `src/polyfills.ts` configuration file.

たとえば、[WEBアニメーションのポリフィルが必要な場合](http://caniuse.com/#feat=web-animation)、次のコマンドによりnpmでインストールできます。(yarnでも同様)

<code-example language="sh" class="code-shell">
  # install the optional web animations polyfill
  npm install --save web-animations-js
</code-example>

You can then add the import statement in the `src/polyfills.ts` file.
For many polyfills, you can simply un-comment the corresponding `import` statement in the file, as in the following example.

<code-example header="src/polyfills.ts">
  /**
  * Required to support Web Animations `@angular/platform-browser/animations`.
  * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
  **/
  import 'web-animations-js';  // Run `npm install --save web-animations-js`.
</code-example>

If the polyfill you want is not already in `polyfills.ts` file, add the `import` statement by hand.


{@a polyfill-libs}

### 必須ポリフィル
サポートするブラウザ上でAngularアプリケーションを動作するためには、これらのポリフィルが必要です。

<table>

  <tr style="vertical-align: top">

    <th>
      ブラウザ
    </th>

    <th>
      必要なポリフィル
    </th>

  </tr>

  <tr style="vertical-align: top">

    <td>
      Chrome, Firefox, Edge, <br>
      Safari, Android, IE 10+
    </td>

    <td>

      [ES2015](guide/browser-support#core-es6)

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      IE 9
    </td>

    <td>

      ES2015<br>[classList](guide/browser-support#classlist)

    </td>

  </tr>

</table>


### ポリフィルが必要なオプショナルのブラウザ機能

Angularのいくつかの機能では追加のポリフィルが必要になるかもしれません。

<table>

  <tr style="vertical-align: top">

    <th>
      機能
    </th>

    <th>
      ポリフィル
    </th>

    <th style="width: 50%">
       ブラウザ
    </th>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [AnimationBuilder](api/animations/AnimationBuilder).
      (Standard animation support does not require polyfills.)

    </td>

    <td>

      [Web Animations](guide/browser-support#web-animations)

    </td>

    <td>
      <p>If AnimationBuilder is used, enables scrubbing
      support for IE/Edge and Safari.
      (Chrome and Firefox support this natively).</p>
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

    If you use the following deprecated i18n pipes:
     [date](api/common/DeprecatedDatePipe), 
     [currency](api/common/DeprecatedCurrencyPipe),
     [decimal](api/common/DeprecatedDecimalPipe), 
     [percent](api/common/DeprecatedPercentPipe)

    </td>

    <td>

      [Intl API](guide/browser-support#intl)

    </td>

    <td>
      All but Chrome, Firefox, Edge, IE 11 and Safari 10
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

       [NgClass](api/common/NgClass) on SVG elements
    </td>

    <td>

      [classList](guide/browser-support#classlist)

    </td>

    <td>
      IE 10, IE 11
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Http](guide/http) when sending and receiving binary data
    </td>

    <td>

      [Typed&nbsp;Array](guide/browser-support#typedarray)<br>

      [Blob](guide/browser-support#blob)<br>

      [FormData](guide/browser-support#formdata)

    </td>

    <td>
      IE 9
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Router](guide/router) when using
      [hash-based routing](guide/router#appendix-locationstrategy-and-browser-url-styles)
    </td>

    <td>

      [ES7/array](guide/browser-support#core-es7-array)

    </td>

    <td>
      IE 11
    </td>

  </tr>

</table>



### 推奨ポリフィル

次のポリフィルはフレームワークそのものをテストするために使われています。これらはアプリケーションのためのよいスタート地点です。


<table>

  <tr>

    <th>
      ポリフィル
    </th>

    <th>
      ライセンス
    </th>

    <th>
      サイズ*
    </th>

  </tr>

  <tr>

    <td>

      <a id='core-es7-array' href="https://github.com/zloirock/core-js/tree/v2/fn/array">ES7/array</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0.1KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='core-es6' href="https://github.com/zloirock/core-js">ES2015</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      27.4KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='classlist' href="https://github.com/eligrey/classList.js">classList</a>

    </td>

    <td>
      Public domain
    </td>

    <td>
      1KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='intl' href="https://github.com/andyearnshaw/Intl.js">Intl</a>

    </td>

    <td>
      MIT / Unicode license
    </td>

    <td>
      13.5KB
    </td>

  </tr>

  <tr>

    <td>

       <a id='web-animations' href="https://github.com/web-animations/web-animations-js">Web Animations</a>

    </td>

    <td>
      Apache
    </td>

    <td>
      14.8KB
    </td>

  </tr>

  <tr>

    <td>

      <a id='typedarray' href="https://github.com/inexorabletash/polyfill/blob/master/typedarray.js">Typed Array</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      4KB
    </td>

  </tr>

  <tr>

    <td>

       <a id='blob' href="https://github.com/eligrey/Blob.js">Blob</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      1.3KB
    </td>

  </tr>

  <tr>

    <td>

       <a id='formdata' href="https://github.com/francois2metz/html5-formdata">FormData</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0.4KB
    </td>

  </tr>

</table>


\* 数値は縮小し、gzip圧縮されたコードを
<a href="http://closure-compiler.appspot.com/home">closure compiler</a>で計算したものです。

{@a non-cli}

## CLI未使用の場合のポリフィル設定

もしCLIを使用していない場合、自身で必要なポリフィルを直接WEBページ(`index.html`)に追加してください。

例:

<code-example header="src/index.html" language="html">
  &lt;!-- pre-zone polyfills -->
  &lt;script src="node_modules/core-js/client/shim.min.js">&lt;/script>
  &lt;script src="node_modules/web-animations-js/web-animations.min.js">&lt;/script>
  &lt;script>
    /**
     * you can configure some zone flags which can disable zone interception for some
     * asynchronous activities to improve startup performance - use these options only
     * if you know what you are doing as it could result in hard to trace down bugs..
     */
    // __Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
    // __Zone_disable_on_property = true; // disable patch onProperty such as onclick
    // __zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

    /*
     * in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
     * with the following flag, it will bypass `zone.js` patch for IE/Edge
     */
    // __Zone_enable_cross_context_check = true;
  &lt;/script>
  &lt;!-- zone.js required by Angular -->
  &lt;script src="node_modules/zone.js/dist/zone.js">&lt;/script>

  &lt;!-- application polyfills -->
</code-example>
