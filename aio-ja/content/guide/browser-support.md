# ブラウザサポート

Angularは最新のブラウザをサポートしています。サポートしているブラウザは下表のとおりです。

<table>

  <tr>

<th>
      Browser
</th>

<th>
      Supported versions
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
最新ブラウザの機能すべてをサポートしているわけではないため、前述した多くのブラウザでの動作をサポートすることは困難です。

サポート必須なブラウザのために、ポリフィルを適用して補うことができます。
[後述の表](#polyfill-libs)に必要になる可能性があるポリフィルのほとんどを記載しています。

<div class="alert is-important">

推奨するポリフィルはAngularアプリケーション全体に適用されるものです。
リストにない機能をサポートするために追加のポリフィルが必要になるかもしれません。
ポリフィルでは、古く遅いブラウザを最新の早いブラウザに魔法のように変換することはできません。

</div>

## ポリフィルの有効化

[Angular CLI](cli) を使用している場合は、プロジェクトと共に自動生成された`src/polyfills.ts`を利用してポリフィルを有効化します。

このファイルはJavaScriptの`import`文で必須なポリフィルと多数の任意のポリフィルを組み込んでいます。

プロジェクトを作成し、対応する`import`文が用意ができると、_必須_ポリフィル(`zone.js`のような)のためのnpmパッケージは自動的にインストールされます。おそらくそれらを変更する必要はないでしょう。

しかし、任意のポリフィルが必要な場合、そのnpmパッケージをインストールする必要があります。
たとえば、[WEBアニメーションのポリフィルが必要な場合](http://caniuse.com/#feat=web-animation)、次のコマンドによりnpmでインストールできます。(yarnでも同様)

<code-example language="sh" class="code-shell">
  # note that the web-animations-js polyfill is only here as an example
  # it isn't a strict requirement of Angular anymore (more below)
  npm install --save web-animations-js
</code-example>

次に`polifills.ts`を開き、次のとおりに該当するインポート文のコメントを外します。

<code-example header="src/polyfills.ts">
  /**
  * Required to support Web Animations `@angular/platform-browser/animations`.
  * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
  **/
  import 'web-animations-js';  // Run `npm install --save web-animations-js`.
</code-example>

もし`polifills.ts`に求めるポリフィルがなければ、自身で追加し、次のパターンにしたがってください。

1. npmパッケージをインストールする
1. `polyfills.ts`で`import`する

<div class="alert is-helpful">

CLIを使用していない場合は、[後述の通り](#non-cli)に行ってください。
</div>

{@a polyfill-libs}

### 必須ポリフィル
サポートするブラウザ上でAngularアプリケーションを動作するためには、これらのポリフィルが必要です。


<table>

  <tr style="vertical-align: top">

    <th>
      Browsers (Desktop & Mobile)
    </th>

    <th>
      Polyfills Required
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


### 任意のブラウザ機能のポリフィル有効化

Angularのいくらかの機能では追加のポリフィルが必要になるかもしれません。

たとえば、アニメーションライブラリは標準のWEBアニメーションAPIに依存しています。しかし、現状では標準のWEBアニメーションAPIはChromeとFirefoxでしか利用できません。
(Angularにおけるweb-animations-jsへの依存は、`AnimationBuilder`を利用する場合にのみ生じます)

追加のポリフィルを必要とする可能性がある機能は次のとおりです。


<table>

  <tr style="vertical-align: top">

    <th>
      Feature
    </th>

    <th>
      Polyfill
    </th>

    <th style="width: 50%">
       Browsers (Desktop & Mobile)
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

</table>



### 推奨ポリフィル
次にフレームワーク自体のテストのために使用されるポリフィルを示します。これらはアプリケーションのためのよいスタート地点です。


<table>

  <tr>

    <th>
      Polyfill
    </th>

    <th>
      License
    </th>

    <th>
      Size*
    </th>

  </tr>

  <tr>

    <td>

      <a id='core-es7-reflect' href="https://github.com/zloirock/core-js/blob/master/es7/reflect.js">ES7/reflect</a>

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


\* 数値は縮小し、gzip圧縮されたコードを<a href="http://closure-compiler.appspot.com/home">クロージャコンパイラ</a>で計算したものです。

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
