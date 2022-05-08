# セキュリティ

このトピックでは、クロスサイトスクリプティングやその他一般的なWebアプリケーション脆弱性に対する
Angularでの対応について説明します。認証や認可などアプリケーションレベルのセキュリティは
ここでは扱いません。

この章で扱う内容に関するより詳細な情報は [OWASP Guide Project](https://www.owasp.org/index.php/Category:OWASP_Guide_Project) を参照してください。

この章に付属の <live-example></live-example> はその場で実行できます。

{@a report-issues}

<div class="callout is-important">

<header>脆弱性の報告</header>

Angular自身の脆弱性は [security@angular.io](mailto:security@angular.io) へ報告をお願いします。

セキュリティに関する問題を Google がどのように扱うかは
[Google's security philosophy](https://www.google.com/about/appsecurity/) を
参照してください。

</div>

{@a best-practices}

<div class="callout is-helpful">

<header>ベストプラクティス</header>

* **Angularを最新に保つ**
Angularは定期的にアップデートされており、最新版には以前のバージョンで見つかった
脆弱性の修正が含まれていることがあります。セキュリティ関連の更新については
[change log](https://github.com/angular/angular/blob/master/CHANGELOG.md) を確認してください。

* **独自のカスタマイズを行わない**
独自のカスタマイズを行うと、アップデートによるセキュリティの修正や強化の恩恵を
受けられなくなります。独自のカスタマイズを行うのではなく、その改善点をプルリクエストを通じて
コミュニティと共有してください。

* **"_Security Risk_"と明記されたAPIの使用を避ける**
この章の [Trusting safe values](guide/security#bypass-security-apis) を参照してください。

</div>

##  クロスサイトスクリプティング（XSS）

[クロスサイトスクリプティング](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)により
攻撃者は悪意のあるコードをWebページに注入することができます。
そのようなコードはユーザーデータ（特にログインデータ）を盗み出したり
ユーザーに成りすましたアクションを実行します。これはウェブ上でもっとも一般的な攻撃のひとつです。

XSS攻撃を防ぐには悪意のあるコードがDOMに挿入されるのを防ぐ必要があります。たとえば、
DOMに`<script>`タグを挿入された場合、攻撃者はそのWebサイトで任意のコードを実行できます。
攻撃は`<script>`タグだけでなくDOMの多くの要素やプロパティがその対象となります。
`<img onerror="...">`や`<a href="javascript:...">`など、
攻撃者の制御するデータがDOMに注入されることで攻撃が成立します。

### AngularによるXSS対策

XSSへの対策としてAngularはデフォルトですべての入力を信頼できない値として扱います。プロパティ、属性、スタイル、クラスバインド、テンプレート補間、これらを利用してテンプレートからDOMへ値を挿入する際、Angularは値のサニタイズとエスケープを行います。値がAngularの外部ですでにサニタイズされており安全と見なせる場合、[信頼された値](#bypass-security-apis)としてそれをマークしAngularに伝えることができます。

Angularテンプレートはレンダリングに使用される値とは異なり、デフォルトで信頼できると見なされ実行可能なコードとして扱われます。ユーザー入力とテンプレート構文を連結してテンプレートを生成してはいけません。これを行うと、攻撃者がアプリケーションに[任意のコードを挿入](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E6%94%BB%E6%92%83)できるようになります。この脆弱性を防ぐため、実稼働環境では常にデフォルトの[事前(AOT)コンパイラ](/guide/security#offline-template-compiler)を使用してください。

Content Security Policy (CSP)とTrusted Typesによる追加の保護レイヤーを利用することもできます。Webプラットフォーム上のこれら機能はDOMレベルで動作するため他の低レベルAPIを使用しても迂回できず、したがってXSSを防ぐもっとも効果的な手段になります。[Content Security Policy (CSP)](#content-security-policy)の構成と[Trusted Typesの適用](#trusted-types)でこれらの保護機能を利用することを強く推奨します。

### サニタイズとセキュリティコンテキスト {@a sanitization-and-security-contexts}

_サニタイズ_とは、信頼できない値を検査しDOMに挿入できるような安全な値に無害化することです。
多くの場合、サニタイズは値をまったく変更しません。
サニタイズはコンテキストに依存します。たとえば、CSS内は安全な値がURL内でも安全であるとは限りません。

Angular はサニタイズの際に次のいずれかのコンテキストを考慮します。

* **HTML** HTMLコードとして解釈します。値を `innerHtml` プロパティにバインドする際などに用いられます。
* **スタイル** 値を `style` プロパティにバインドする際に用いられます。
* **URL** `<a href>` などのURLに用いられます。
* **リソースURL** `<script src>` などのコードとして評価され実行されます。

Angularは **HTML**、**スタイル**、**URL** の値をサニタイズします。
**リソースURL**は任意のコードが含まれる可能性があるためサニタイズできません。
開発モードでは、サニタイズで値が変更されるとコンソールに警告が表示されます。

### サニタイズの例

次のテンプレートでは `htmlSnippet` の値を、まずテンプレート補間で要素内に展開し、
次に `innerHtml` プロパティへバインドしています。

<code-example path="security/src/app/inner-html-binding.component.html" header="src/app/inner-html-binding.component.html"></code-example>

テンプレート補間では値は常にエスケープされます。
タグの開始文字と終了文字はそのまま表示されており、HTMLとしては解釈されていません。

値をHTMLコードとして解釈するには`innerHtml`などのHTMLプロパティにバインドします。
しかし値をそのままバインドするとXSS脆弱性を引き起こす可能性があります。
たとえばJavaScriptを次のように実行できます。

<code-example path="security/src/app/inner-html-binding.component.ts" header="src/app/inner-html-binding.component.ts (class)" region="class"></code-example>

Angularは値を安全でないものとして認識し自動的にサニタイズします。これにより、`script`要素は削除されますが、`<b>`要素など安全なコンテンツは保持されます。

<div class="lightbox">
  <img src='generated/images/guide/security/binding-inner-html.png' alt='A screenshot showing interpolated and bound HTML values'>
</div>

### DOM APIの直接使用と、明示的なサニタイズ呼び出し

Trusted Typesを強制しない限り、ブラウザの提供する DOM API は脆弱性から自動的にはアプリケーションを保護してくれません。
`document` オブジェクトや `ElementRef` クラスより参照可能なノード、多くのサードパーティAPIなどには
潜在的に安全でないメソッドが含まれています。
同様に、DOMを操作する他のライブラリとやりとりする場合、Angularの補間と同じような自動サニタイズはありません。
DOMと直接対話するのではなく、可能であればAngularテンプレートを使用してください。

避けられない場合は、組み込みのAngularのサニタイズ関数を使用してください。
信頼できない値を[DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize)メソッドと適切な `SecurityContext`でサニタイズします。
この関数は、[後述](#bypass-security-apis)のように、
`bypassSecurityTrust` ...関数を使って信頼できるとマークされた値を受け取り、
それらをサニタイズしません。

{@a bypass-security-apis}

### 安全な値を信頼する

実行可能コードの注入や `<iframe>` による任意のURLの表示、潜在的な危険を伴うURLの構築、
アプリケーションによっては、これらの処理が必要になることがあるかもしれません。
これら処理のためサニタイズを一時的に無効にするには、対象の値が安全である旨をあらかじめAngularに伝える必要があります。
ただし *注意してください*。悪意のある値を誤って信頼済としてマークしてしまった場合
アプリケーションに脆弱性が混入します。
必要に応じてセキュリティ専門家のレビューを受けてください。

値を信頼済としてマークするには `DomSanitizer` を注入してコンテキストに応じ
次のいずれかのメソッドを実行します。

* `bypassSecurityTrustHtml`
* `bypassSecurityTrustScript`
* `bypassSecurityTrustStyle`
* `bypassSecurityTrustUrl`
* `bypassSecurityTrustResourceUrl`

値が安全かどうかはコンテキストによって変わります。意図した値の用途に適したメソッドを使用してください。
たとえば次のように、
URLに` javascript：alert(...)` をバインドするとします。

<code-example path="security/src/app/bypass-security.component.html" header="src/app/bypass-security.component.html (URL)" region="URL"></code-example>

通常、Angularは自動的にURLをサニタイズし、危険なコードを無効にし、
開発モードではこのアクションをコンソールに記録します。
これを防ぐには、`bypassSecurityTrustUrl`を呼び出してURLの値を信頼できるURLとしてマークします。

<code-example path="security/src/app/bypass-security.component.ts" header="src/app/bypass-security.component.ts (trust-url)" region="trust-url"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/security/bypass-security-component.png' alt='A screenshot showing an alert box created from a trusted URL'>
</div>

ユーザー入力を信頼できる値に変換する必要がある場合は、コンポーネントメソッドを使用します。
次のテンプレートでは、ユーザーはYouTubeの動画IDを入力し、対応する動画を`<iframe>`に読み込むことができます。
信頼できないソースは、たとえば、無防備なユーザーが実行する可能性があるファイルを密かにダウンロードする可能性があるため、
`<iframe src>`属性はリソースURLのセキュリティコンテキストです。
したがってコンポーネント上のメソッドを呼び出して信頼できるビデオURLを作成します。
これにより、Angularは`<iframe src>`へのバインディングを許可します


<code-example path="security/src/app/bypass-security.component.html" header="src/app/bypass-security.component.html (iframe)" region="iframe"></code-example>

<code-example path="security/src/app/bypass-security.component.ts" header="src/app/bypass-security.component.ts (trust-video-url)" region="trust-video-url"></code-example>

{@a content-security-policy}
### Content Security Policy

Content Security Policy (CSP) を用いることでより確実にXSSを防止することもできます。
CSP を有効にするには、レスポンスヘッダ `Content-Security-Policy` が適切に返却されるよう
Webサーバーを設定する必要があります。CSP に関するより詳細な情報は Google Developersサイトの
[Web Fundamentals guide](https://developers.google.com/web/fundamentals/security/csp) 
を参照してください。

初期状態のAngularに必要な最小限のポリシーは次のとおりです。

```
default-src 'self'; style-src 'self' 'unsafe-inline';
```

* `default-src 'self';` リソースの取得は取得元のページと同じオリジンからのみに制限されます。
* `style-src 'self' 'unsafe-inline';` グローバルスタイルをページと同じオリジン（`'self'`）から取得できるようにし、コンポーネントには自身のスタイルを適用（`'unsafe-inline'` - [`angular/angular#6361`](https://github.com/angular/angular/issues/6361)を参照）できるようにします。

Angular自体の動作にはこれら設定のみが必要です。ただし、プロジェクトが大きくなるにつれ、アプリケーション固有の追加機能に対応するために、この最小値を超えたCSP設定の拡張が必要になる場合があります。

{@a trusted-types}
### Trusted Typesの適用

クロスサイトスクリプティング攻撃からアプリケーションを守る方法として、[Trusted Types](https://w3c.github.io/webappsec-trusted-types/dist/spec/)を使用することをお勧めします。
Trusted Typesは、より安全なコーディング方法を適用することにより、クロスサイトスクリプティング攻撃を防ぐのに役立つ[Webプラットフォーム](https://en.wikipedia.org/wiki/Web_platform)機能です。
アプリケーションコードの監査をシンプルにするのにも役立ちます。

<div class="callout is-helpful">

Trusted Typesはアプリケーションが対応すべきすべてのブラウザでまだ利用できない可能性があります。Trusted Typesを使用したアプリケーションがTrusted Types未サポートのブラウザで実行された場合でも、アプリケーションの機能は維持され、AngularのDomSanitizerによってXSSからの保護が行われます。現在のブラウザサポートについては、[caniuse.com/trusted-types](https://caniuse.com/trusted-types)を参照してください。

</div>

アプリケーションにTrusted Typesを適用するには、次のいずれかのAngularポリシーを使用してHTTPヘッダーを出力するようWebサーバーを設定する必要があります。

* `angular` - このポリシーはAngularの内部にあるセキュリティレビュー済みのコードで使用され、Trusted Types適用下のAngularには必ず必要です。Angularによってサニタイズされたインラインテンプレート値またはコンテンツは、このポリシーにより安全なものとして扱われます。
* `angular#unsafe-bypass` - このポリシーは、`bypassSecurityTrustHtml`などセキュリティをバイパスする、Angularの[DomSanitizer](api/platform-browser/DomSanitizer)クラスのメソッドに使用されます。これらのメソッドを使用するアプリケーションは、このポリシーを有効にする必要があります。
* `angular#unsafe-jit` - このポリシーは、[JITコンパイラー](api/core/Compiler)によって使用されます。アプリケーションがJITコンパイラを直接利用する場合や[platformBrowserDynamic](api/platform-browser-dynamic/platformBrowserDynamic)でJITモードで実行されている場合、このポリシーを有効にする必要があります。

Trusted Typesに関するHTTPヘッダーは次の箇所で設定する必要があります。

* 本番環境上のインフラ
* Angular CLI（`ng serve`）、`angular.json`ファイルの`headers`プロパティで設定、ローカル開発やE2Eテストに利用
* Karma (`ng test`)、`karma.config.js`ファイルの`customHeaders`プロパティで設定、ユニットテストに利用

以下はAngular用に構成されたTrusted Types設定ヘッダーの例です。

<code-example language="html">
Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
</code-example>

以下は、Angularの[DomSanitizer](api/platform-browser/DomSanitizer)クラスのメソッドのいずれかを使用しセキュリティをバイパスする機能をもつAngularアプリケーション用のTrusted Types設定ヘッダーの例です。

<code-example language="html">
Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';
</code-example>

以下は、JITコンパイルを使用したAngularアプリケーション用のTrustedTypes設定ヘッダーの例です。

<code-example language="html">
Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';
</code-example>

<div class="callout is-helpful">

<header>Community contributions</header>

Trusted Typesの設定に関するトラブルシューティングの詳細は次の記事を参考にしてください。

[Prevent DOM-based cross-site scripting vulnerabilities with Trusted Types](https://web.dev/trusted-types/#how-to-use-trusted-types)

</div>

{@a offline-template-compiler}

### 事前(AOT)コンパイラを使う

事前(AOT)コンパイラはテンプレートインジェクションと呼ばれる脆弱性を確実に防止し
アプリケーションのパフォーマンスを大幅に向上させます。プロダクション環境では事前(AOT)コンパイラを使い、

事前(AOT)コンパイラの代わりに、実行時にブラウザ内でテンプレートを実行可能テンプレートコードにコンパイルするJITコンパイラがあります。Angularはテンプレートコードを信頼するので、テンプレート、特にユーザーデータを含むテンプレートを生成すると、Angularの組み込みの保護が回避されます。Angularはテンプレート文字列を全面的に信頼するため、動的なテンプレート生成は常にXSSの危険性を有します。フォームを安全に動的に構築する方法については[Dynamic Forms](guide/dynamic-form) のガイドを参照してください。

{@a server-side-xss}
### サーバーサイドXSSへの対策

サーバーサイドで構築されたHTMLがXSS脆弱性を有することもあります。これらをテンプレートとしてAngularへ注入することはアプリケーションに実行可能コードを注入することを意味し、この場合アプリケーションは攻撃者によって完全に制御されてしまいます。サーバーサイドでHTMLを構築する際も値のエスケープは確実に行ってください。またサーバーサイドでAngularテンプレートを生成することは避けてください。これらの処理はテンプレートインジェクションの脆弱性が発生する危険性を高めます。

{@a http}
## HTTPレベルの脆弱性

HTTPプロトコル上の脆弱性のうち代表的な2つ、クロスサイトリクエストフォージェリ（CSRF / XSRF）と
クロスサイトスクリプトインクルージョン（XSSI）に対してはAngular側での対策がサポートされています。
双方ともサーバー側での対策が必要すが、Angularはそれを容易にするようなクライアント側での機能を提供します。

{@a xsrf}
### クロスサイトリクエストフォージェリ

クロスサイトリクエストフォージェリでは、攻撃者はまず攻撃対象とは別のサイト（`evil.com`とします）へ
ユーザーを誘導しそこで悪意のあるコードを読み込ませます。次に、そのコードを
攻撃対象のサイト（`example-bank.com`とします）へリクエストするよう仕向けます。

たとえば、`example-bank.com` へログインしているユーザーが、
フィッシングメール内にある `evil.com` へのリンクを開いたとします。

`evil.com` には、`example-bank.com` へ有害なリクエスト送らせるコードが仕込まれています。
おそらくユーザーの口座から攻撃者の口座へ自動的に送金するような内容でしょう。
この場合もブラウザは `example-bank.com` 上のCookie（認証情報）は自動的に付与します。

XSRF対策が行われていない場合 `example-bank.com` は送られてきたリクエストが
自身による正当なものなのか `evil.com` によって偽装されたものなのか区別を付けられません。

こういった状況を防ぐには、アプリケーションは受け取ったリクエストが
自身によって生成された正当なものなのかそうでないのか確実に区別できなければなりません。
この対策は、サーバー側、クライアント側、双方が協調し動作することではじめて実現します。

一般的なXSRF対策では、アプリケーションサーバーは、ランダムに生成された認証トークンをCookieに送信します。
クライアントコードはCookieを読み取り、その後のすべてのリクエストにトークンを含むカスタムリクエストヘッダを追加します。
サーバーは、受信したCookieの値をリクエストヘッダの値と比較し、値がないか一致しない場合はリクエストを拒否します。

この手法は、すべてのブラウザが_same origin policy_を実装しているため効果的です。
Cookieが設定されているWebサイトのコードだけが、そのサイトからCookieを読み取り、そのサイトへのリクエストでカスタムヘッダーを設定することができます。
つまり、アプリケーションだけがこのCookieトークンを読み取り、カスタムヘッダーを設定できます。
`evil.com`の悪意のあるコードにはできません。

Angular の `HttpClient` モジュールはこれらのクライアント側の処理をサポートしています。詳しくは [HttpClient guide](/guide/http#security-xsrf-protection) の章を参照してください。

CSRFについてはオープンWebアプリケーションセキュリティプロジェクト（OWASP）の、
[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) および
[Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)を参照してください。
スタンフォード大学の論文
[Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) にも豊富な情報が掲載されています。

Dave Smith氏による
[AngularConnect 2016でのXSRFに関する発表](https://www.youtube.com/watch?v=9inczw6qtpY "Cross Site Request Funkery Securing Your Angular Apps From Evil Doers") も参照してください。

{@a xssi}
### クロスサイトスクリプトインクルージョン (XSSI)

JSON脆弱性とも呼ばれるクロスサイトスクリプトインクルージョンにより、攻撃者のWebサイトで
JSON APIからデータを読み取ることができます。この攻撃は、ビルトインのJavaScriptオブジェクトコンストラクターを
オーバーライドしてから、`<script>`タグを使用してAPI URLを含めることによって、古いブラウザで機能します。

この攻撃は、返されたJSONがJavaScriptとして実行可能な場合にのみ成功します。
サーバーはすべてのJSONレスポンスを実行不可能にするために接頭辞を付けて攻撃を防ぐことができます。
慣習的には、よく知られている文字列 `")]}',\n"` を使用します。

Angularの`HttpClient`ライブラリはこの規約を認識し、
解析前にすべてのレスポンスから文字列 `")]},\n"` を自動的に削除します。

より詳細な情報は[Google web security blog post](https://security.googleblog.com/2011/05/website-security-for-webmasters.html)の
クロスサイトスクリプトインクルージョンの項を参照してください。

{@a code-review}
## Angularアプリケーションの検査

Angularアプリケーションは通常のWebアプリケーションと同等のセキュリティが求められます。
[_bypassSecurityTrust_](guide/security#bypass-security-apis)メソッドなど、セキュリティレビューで
監査する必要のあるAngular固有のAPIは、
ドキュメントにセキュリティの影響を受けやすいとマークされています。
