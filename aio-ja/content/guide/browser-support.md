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
      11<br>10<br>9
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
      Nougat (7.0)<br>Marshmallow (6.0)<br>Lollipop (5.0, 5.1)<br>KitKat (4.4)
    </td>
  </tr>

</table>

<div class="alert is-helpful">

Angularの開発プロセスでは、各プルリクエストに対して、すべてのサポート対象ブラウザ上でユニットテストを実行しています。
ユニットテスト実行には<a href="https://saucelabs.com/">SauceLabs</a>と
<a href="https://www.browserstack.com">Browserstack</a>を使用しています。

</div>


## ポリフィル

AngularはWEBプラットフォームの最新標準に基づいて構築されています。
先述したような広範囲のブラウザをターゲットにすることは困難です。なぜならそれらがモダンブラウザの機能すべてをサポートしているわけではないからです。

サポート必須なブラウザのために、ポリフィルを適用して補うことができます。
[後述の表](#polyfill-libs)に必要になる可能性があるポリフィルのほとんどを記載しています。

<div class="alert is-important">

推奨されるポリフィルはAngularアプリケーションを完全に動作させるためのものです。
リストにない機能をサポートするために追加のポリフィルが必要になるかもしれません。
ポリフィルでは、古く遅いブラウザを最新の早いブラウザに魔法のように変換できないことに注意しましょう。

</div>

## ポリフィルを有効化する

[Angular CLI](cli) を使用している場合は、プロジェクトと共に自動生成された`src/polyfills.ts`を利用してポリフィルを有効化します。

このファイルには必須なポリフィルと多くのオプショナルなポリフィルがJavaScriptの`import`文で盛り込まれています。

必須なポリフィルのnpmパッケージは、プロジェクトを作成したときに自動的にインストールされていて、対応する`import`文が用意されています。あなたがそれに触ることはないでしょう。

しかし、オプショナルなポリフィルが必要な場合、そのnpmパッケージをインストールする必要があります。
たとえば、[WEBアニメーションのポリフィルが必要な場合](http://caniuse.com/#feat=web-animation)、次のコマンドによりnpmでインストールできます。(yarnでも同様)

<code-example language="sh" class="code-shell">
  # note that the web-animations-js polyfill is only here as an example
  # it isn't a strict requirement of Angular anymore (more below)
  npm install --save web-animations-js
</code-example>

それから`polyfills.ts`を開き、次のように該当するインポート文のコメントを外します。

<code-example header="src/polyfills.ts">
  /**
  * Required to support Web Animations `@angular/platform-browser/animations`.
  * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
  **/
  import 'web-animations-js';  // Run `npm install --save web-animations-js`.
</code-example>

もし`polyfills.ts`に求めるポリフィルがなければ、自身で追加し、次のパターンにしたがってください。

1. npmパッケージをインストールする
1. `polyfills.ts`で`import`する

<div class="alert is-helpful">

CLIを使用していない場合は、[後述のとおり](#non-cli)に行ってください。
</div>

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
      Chrome, Firefox, Edge, Safari 9+
    </td>

    <td>

      [ES7/reflect](guide/browser-support#core-es7-reflect) (JIT only)

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      Safari 7 & 8, IE10 & 11, Android 4.1+
    </td>

    <td>

      [ES6](guide/browser-support#core-es6)

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      IE9
    </td>

    <td>

      [ES6<br>classList](guide/browser-support#classlist)

    </td>

  </tr>

</table>


### ポリフィルが必要なオプショナルのブラウザ機能

Angularのいくつかの機能では追加のポリフィルが必要になるかもしれません。

たとえば、アニメーションライブラリは標準のWeb Animation APIに依存しています。しかし、現状では標準のWeb Animation APIはChromeとFirefoxでしか利用できません。
(Angularにおけるweb-animations-jsへの依存は、`AnimationBuilder`を利用する場合にのみ生じます)

追加のポリフィルを必要とする可能性がある機能は次のとおりです。


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

      [JIT compilation](guide/aot-compiler).

      Required to reflect for metadata.
    </td>

    <td>

      [ES7/reflect](guide/browser-support#core-es7-reflect)

    </td>

    <td>
      All current browsers. Enabled by default.
      Can remove if you always use AOT and only use Angular decorators.
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Animations](guide/animations)
      <br>Only if `Animation Builder` is used within the application--standard
      animation support in Angular doesn't require any polyfills (as of NG6).

    </td>

    <td>

      [Web Animations](guide/browser-support#web-animations)

    </td>

    <td>
      <p>If AnimationBuilder is used then the polyfill will enable scrubbing
      support for IE/Edge and Safari (Chrome and Firefox support this natively).</p>
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
      All but Chrome, Firefox, Edge, IE11 and Safari 10
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

       [NgClass](api/common/NgClass) 
       
       on SVG elements
    </td>

    <td>

      [classList](guide/browser-support#classlist)

    </td>

    <td>
      IE10, IE11
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Http](guide/http) 
      
      when sending and receiving binary data
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

      [Router](guide/router) 
      
      when using [hash-based routing](guide/router#appendix-locationstrategy-and-browser-url-styles)
    </td>

    <td>

      [ES7/array](guide/browser-support#core-es7-array)

    </td>

    <td>
      IE 11
    </td>

  </tr>

</table>



### 推奨ポリフィル ##
次に示すのはフレームワークそのものをテストするために使われているポリフィルです。これらはアプリケーションのためのよいスタート地点です。


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

      <a id='core-es7-reflect' href="https://github.com/zloirock/core-js/tree/v2/fn/reflect">ES7/reflect</a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0.5KB
    </td>

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

      <a id='core-es6' href="https://github.com/zloirock/core-js">ES6</a>

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


\* 数値は縮小し、gzip圧縮されたコードを<a href="http://closure-compiler.appspot.com/home">closure compiler</a>で計算したものです。

{@a non-cli}
## CLI未使用の場合のポリフィル設定

もしCLIを使用していない場合、自身で必要なポリフィルを直接WEBページ(`index.html`)に追加してください。おそらくこのようになります。

<code-example header="src/index.html">
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
