# セキュリティ

このトピックでは、クロスサイトスクリプティング攻撃などの一般的なWebアプリケーションの脆弱性や攻撃に対する、Angularの組み込みの保護について説明します。
認証や認可など、アプリケーションレベルのセキュリティは扱いません。

以下で説明する攻撃と対策の詳細については、[Open Web Application Security Project (OWASP) ガイド](https://www.owasp.org/index.php/Category:OWASP_Guide_Project)を参照してください。

<a id="report-issues"></a>

<docs-callout title="脆弱性の報告">

Angularは、Google [オープンソースソフトウェア脆弱性報酬プログラム](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules)の一部です。Angularの脆弱性については、[https://bughunters.google.com で報告してください](https://bughunters.google.com/report)。

Googleがセキュリティ上の問題をどのように処理するかについては、[Googleのセキュリティポリシー](https://www.google.com/about/appsecurity)を参照してください。

</docs-callout>

## ベストプラクティス {#best-practices}

Angularアプリケーションを安全にするためのベストプラクティスをいくつか紹介します。

1. **Angularライブラリリリースを最新の状態に保つ** - Angularライブラリは定期的に更新されており、これらの更新には、以前のバージョンで見つかったセキュリティ上の欠陥の修正が含まれている場合があります。Angularの[変更ログ](https://github.com/angular/angular/blob/main/CHANGELOG.md)で、セキュリティ関連の更新を確認してください。
2. **Angularのコピーを変更しない** - Angularのプライベートなカスタマイズされたバージョンは、現在のバージョンから遅れがちであり、重要なセキュリティ修正や機能強化が含まれていない場合があります。代わりに、Angularの改善点をコミュニティと共有し、プルリクエストを作成してください。
3. **ドキュメントで"_セキュリティリスク_"とマークされているAngular APIを避ける** - 詳細については、このページの[安全な値を信頼する](#trusting-safe-values)セクションを参照してください。

## クロスサイトスクリプティング（XSS）の防止 {#preventing-cross-site-scripting}

[クロスサイトスクリプティング（XSS）](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)により、攻撃者はWebページに悪意のあるコードを挿入できます。
このようなコードは、ユーザーのログインデータやユーザーデータを盗んだり、ユーザーになりすましたりできます。
これは、Web上で最も一般的な攻撃の1つです。

XSS攻撃を阻止するには、悪意のあるコードがDocument Object Model（DOM）に入らないようにする必要があります。
攻撃者が`<script>`タグをDOMに挿入するように仕向けることができたら、攻撃者はWebサイトで任意のコードを実行できます。
攻撃は`<script>`タグに限定されません。DOMの多くの要素やプロパティはコードの実行を許可します。たとえば、`<img alt="" onerror="...">`や`<a href="javascript:...">`などです。
攻撃者が制御するデータがDOMに入ると、セキュリティの脆弱性が発生する可能性があります。

### Angularのクロスサイトスクリプティングセキュリティモデル {#angular-xss-security-model}

Angularは、XSSのバグを体系的に阻止するために、すべての値をデフォルトで信頼されていないものとして扱います。
テンプレートバインディングや補間からDOMに値が挿入されると、Angularは信頼されていない値をサニタイズしてエスケープします。
値がAngularの外部で既にサニタイズされており、安全であるとみなされる場合は、[値を信頼済みとしてマークする](#trusting-safe-values)ことでAngularに伝えます。

レンダリングに使用する値とは異なり、Angularテンプレートはデフォルトで信頼済みとみなされ、実行可能なコードとして扱われる必要があります。
ユーザー入力とテンプレート構文を連結してテンプレートを作成しないでください。
これを行うと、攻撃者はアプリケーションに[任意のコードを注入できます](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E6%94%BB%E6%92%83)。
これらの脆弱性を防ぐために、本番環境のデプロイでは常にデフォルトの[Ahead-Of-Time (AOT) テンプレートコンパイラ](#use-the-aot-template-compiler)を使用してください。

コンテンツセキュリティポリシーとTrusted Typesを使用することで、さらに保護を強化できます。
これらのWebプラットフォーム機能は、DOMレベルで動作するため、XSSの問題を防ぐための最も効果的な手段です。これにより、他の低レベルAPIを使用したバイパスはできません。
そのため、これらの機能を活用することを強くお勧めします。これを行うには、アプリケーションの[コンテンツセキュリティポリシー](#content-security-policy)を構成し、[Trusted Typesの強制](#enforcing-trusted-types)を有効にします。

### サニタイズとセキュリティコンテキスト {#sanitization-and-security-context}

_サニタイズ_とは、信頼されていない値を検査して、DOMに挿入しても安全な値に変換することです。
多くの場合、サニタイズは値をまったく変更しません。
サニタイズはコンテキストに依存します。
例えば、CSSでは無害な値も、URLでは危険な可能性があります。

Angularは、次のセキュリティコンテキストを定義しています。

| セキュリティコンテキスト | 詳細                                                                           |
| :---------------- | :-------------------------------------------------------------------------------- |
| HTML              | HTMLとして値を解釈する場合に使用します。たとえば、`innerHtml`にバインディングする場合。 |
| Style             | `style`プロパティにCSSをバインディングする場合に使用します。                                  |
| URL               | `<a href>`などのURLプロパティに使用します。                                      |
| Resource URL      | `<script src>`などのコードとして読み込まれて実行されるURL。たとえば、                                       |

Angularは、信頼されていない値をHTMLとURLに対してサニタイズします。リソースURLのサニタイズは、リソースURLに任意のコードが含まれているため、不可能です。
開発モードでは、Angularはサニタイズ中に値を変更する必要がある場合、コンソールに警告を表示します。

### サニタイズの例

次のテンプレートは、`htmlSnippet`の値をバインディングします。1つは要素の内容に補間して、もう1つは要素の`innerHTML`プロパティにバインディングします。

<docs-code header="inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

補間されたコンテンツは常にエスケープされます。HTMLは解釈されず、ブラウザは要素のテキストコンテンツに角括弧を表示します。

HTMLを解釈するには、`innerHTML`などのHTMLプロパティにバインディングします。
攻撃者が制御する可能性のある値を`innerHTML`にバインディングすると、通常はXSSの脆弱性が発生します。
たとえば、次のようにJavaScriptを実行できます。

<docs-code header="inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" region="class"/>

Angularは、値を安全ではないと認識し、自動的にサニタイズします。これにより、`script`要素は削除されますが、`<b>`要素などの安全なコンテンツは保持されます。

<img alt="補間されたHTML値とバインディングされたHTML値を示すスクリーンショット" src="assets/images/guide/security/binding-inner-html.png#small">

### DOM APIの直接使用と明示的なサニタイズ呼び出し

信頼済みタイプを強制しない限り、組み込みのブラウザDOM APIは、セキュリティの脆弱性から自動的に保護しません。
たとえば、`document`、`ElementRef`を通じてアクセスできるノード、および多くのサードパーティAPIには、安全ではないメソッドが含まれています。
同様に、DOMを操作する他のライブラリと対話する場合、Angularの補間と同じような自動サニタイズは行われない可能性があります。
可能な限り、DOMと直接対話するのを避け、代わりにAngularテンプレートを使用してください。

避けられない場合、組み込みのAngularサニタイズ関数を使用してください。
[DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize)メソッドと適切な`SecurityContext`を使用して、信頼されていない値をサニタイズします。
その関数は、[以下で説明するように](#trusting-safe-values)、`bypassSecurityTrust` 関数を使用して信頼済みとしてマークされた値も受け取り、サニタイズしません。

### 安全な値を信頼する {#trusting-safe-values}

アプリケーションは、実行可能なコードを含めたり、特定のURLから`<iframe>`を表示したり、危険な可能性のあるURLを作成したりすることが必要な場合があります。
これらの状況で自動サニタイズを回避するには、値を検査して作成方法を確認し、安全であることを確認したことをAngularに伝えます。
_注意してください_。
悪意のある可能性のある値を信頼すると、アプリケーションにセキュリティの脆弱性が発生します。
疑問がある場合は、専門のセキュリティレビュアーに相談してください。

値を信頼済みとしてマークするには、`DomSanitizer`を注入し、次のいずれかのメソッドを呼び出します。

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

覚えておいてください。値が安全かどうかはコンテキストに依存します。そのため、値の使用方法に適したコンテキストを選択してください。
次のテンプレートは、`javascript:alert(...)`呼び出しへのURLを`href`にバインディングする必要があるとします。

<docs-code header="bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="URL"/>

通常、Angularは自動的にURLをサニタイズし、危険なコードを無効にし、開発モードではこの操作をコンソールにログ出力します。
これを回避するには、`bypassSecurityTrustUrl`呼び出しを使用して、URL値を信頼済みURLとしてマークします。

<docs-code header="bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-url"/>

<img alt="信頼済みURLから作成されたアラートボックスを示すスクリーンショット" src="assets/images/guide/security/bypass-security-component.png#medium">

ユーザー入力を信頼済みの値に変換する必要がある場合は、コンポーネントメソッドを使用してください。
次のテンプレートでは、ユーザーはYouTubeビデオIDを入力し、対応するビデオを`<iframe>`に読み込むことができます。
`<iframe src>`属性はリソースURLセキュリティコンテキストです。なぜなら、信頼されていないソースは、たとえば、うっかりしたユーザーが実行する可能性のあるファイルダウンロードを密かに送り込むことができるからです。
これを防ぐために、コンポーネントのメソッドを呼び出して信頼済みビデオURLを作成すると、Angularは`<iframe src>`へのバインディングを許可します。

<docs-code header="bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="iframe"/>

<docs-code header="bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-video-url"/>

### コンテンツセキュリティポリシー {#content-security-policy}

コンテンツセキュリティポリシー（CSP）は、XSSを防ぐための防御の深化技術です。
CSPを有効にするには、Webサーバーを構成して、適切な`Content-Security-Policy` HTTPヘッダーを返すようにします。
コンテンツセキュリティポリシーについては、Google Developers Webサイトの[Web Fundamentalsガイド](https://developers.google.com/web/fundamentals/security/csp)で詳しく説明されています。

まったく新しいAngularアプリケーションに必要な最小限のポリシーは次のとおりです。

```txt
default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';
```

Angularアプリケーションを提供する際、サーバーは各リクエストのHTTPヘッダーに、ランダムに生成されたnonceを含める必要があります。
このnonceをAngularに提供する必要があります。Angularは、`<style>`要素をレンダリングするためにnonceを使用します。
Angularのnonceは、次のいずれかの方法で設定できます。

1. [ワークスペース構成](reference/configs/workspace-config#extra-build-and-test-options)で`autoCsp`オプションを`true`に設定します。
1. ルートアプリケーション要素に`ngCspNonce`属性を設定します。`index.html`を作成するときに、ヘッダーと`index.html`の両方にnonceを追加できるサーバー側のテンプレートがある場合は、この方法を使用します。
1. `CSP_NONCE`注入トークンを使用してnonceを提供します。実行時にnonceにアクセスでき、`index.html`をキャッシュする必要がある場合は、この方法を使用します。

```ts
import {bootstrapApplication, CSP_NONCE} from '@angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: CSP_NONCE,
      useValue: globalThis.myRandomNonceValue,
    },
  ],
});
```

<docs-callout title="一意のnonce">

提供するnonceは、**リクエストごとに一意である**こと、予測したり推測したりできないことを常に確認してください。
攻撃者が将来のnonceを予測できる場合、CSPによって提供される保護を回避できます。

Generating a nonce at the origin server is generally discouraged when using a CDN, as responses are frequently cached. If the server generates a nonce and the CDN caches that HTML response, every subsequent visitor receives the same "unique" value, allowing an attacker to discover the static value and bypass CSP protections.

To maintain the "one-time-use" integrity of a nonce, it should ideally be generated at the Edge layer (e.g., CDN) just before the content is delivered to the user.

</docs-callout>

NOTE: アプリケーションの[クリティカルCSSをインライン化](/tools/cli/build#critical-css-inlining)したい場合、`CSP_NONCE`トークンは使用できません。`autoCsp`オプションを使用するか、ルートアプリケーション要素に`ngCspNonce`属性を設定してください。

プロジェクトでnonceを生成できない場合は、`style-src`セクションに`'unsafe-inline'`を追加することで、インラインスタイルを許可できます。

| セクション                                         | 詳細                                                                                                                                                                                                         |
| :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`                            | ページが同じオリジンから必要なすべてのリソースを読み込むことを許可します。                                                                                                                                        |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | ページが同じオリジンからグローバルスタイル（`'self'`）を読み込むことを許可し、Angularによって`nonce-randomNonceGoesHere`で挿入されたスタイルを読み込むことを許可します。                                                                    |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | ページが同じオリジンからJavaScript（`'self'`）を読み込むことを許可し、Angular CLIによって`nonce-randomNonceGoesHere`で挿入されたスクリプトを読み込むことを許可します。これは、重要なCSSのインライン化を使用する場合にのみ必要です。 |

Angular自体が正常に機能するには、これらの設定のみが必要です。
プロジェクトが成長するにつれて、アプリケーション固有の追加機能に合わせて、CSP設定を拡張する必要がある場合があります。

### Trusted Typesの強制 {#enforcing-trusted-types}

[Trusted Types](https://w3c.github.com/trusted-types/dist/spec/)を使用して、アプリケーションをクロスサイトスクリプティング攻撃から保護することをお勧めします。
Trusted Typesは、より安全なコーディング慣行を強制することで、クロスサイトスクリプティング攻撃を防ぐために役立つ[Webプラットフォーム](https://en.wikipedia.org/wiki/Web_platform)機能です。
Trusted Typesは、アプリケーションコードの監査を簡素化するためにも役立ちます。

<docs-callout title="Trusted Types">

Trusted Typesは、アプリケーションのターゲットとするすべてのブラウザでまだ利用できない場合があります。
Trusted Types対応のアプリケーションがTrusted Typesをサポートしていないブラウザで実行される場合、アプリケーションの機能は維持されます。アプリケーションは、AngularのDomSanitizerによってXSSから保護されます。
最新のブラウザサポートについては、[caniuse.com/trusted-types](https://caniuse.com/trusted-types)を参照してください。

</docs-callout>

アプリケーションでTrusted Typesを強制するには、アプリケーションのWebサーバーを構成して、次のAngularポリシーのいずれかでHTTPヘッダーを出力する必要があります。

| ポリシー                | 詳細                                                                                                                                                                                                                                                                                     |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angular`               | このポリシーは、Angular内部のセキュリティレビュー済みコードで使用され、Trusted Typesが強制されたときにAngularが機能するために必要です。Angularによってサニタイズされた、インラインテンプレート値またはコンテンツは、このポリシーによって安全なものとして扱われます。                                          |
| `angular#bundler`       | このポリシーは、Angular CLIバンドラーが、遅延チャンクファイルを生成する場合に使用されます。                                                                                                                                                                                                             |
| `angular#unsafe-bypass` | このポリシーは、Angularの[DomSanitizer](api/platform-browser/DomSanitizer)でセキュリティをバイパスするメソッド（`bypassSecurityTrustHtml`など）を使用するアプリケーションで使用されます。これらのメソッドを使用するアプリケーションは、このポリシーを有効にする必要があります。                                  |
| `angular#unsafe-jit`    | このポリシーは、[Just-In-Time (JIT) コンパイラ](api/core/Compiler)で使用されます。アプリケーションがJITコンパイラと直接対話するか、[プラットフォームブラウザダイナミック](api/platform-browser-dynamic/platformBrowserDynamic)を使用してJITモードで実行されている場合は、このポリシーを有効にする必要があります。 |
| `angular#unsafe-upgrade` | このポリシーは[@angular/upgrade](api/upgrade/static/UpgradeModule)パッケージで使用されます。アプリケーションが AngularJS ハイブリッドの場合、このポリシーを有効にする必要があります。                                                                                                                           |

Trusted TypesのHTTPヘッダーは、次の場所で構成する必要があります。

- 本番環境のサービスインフラストラクチャ
- Angular CLI（`ng serve`）、ローカル開発とエンドツーエンドテストのために`angular.json`ファイルの`headers`プロパティを使用
- Karma（`ng test`）、ユニットテストのために`karma.config.js`ファイルの`customHeaders`プロパティを使用

Trusted TypesとAngular用に構成されたヘッダーの例を以下に示します。

```html
Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
```

Trusted TypesとAngularアプリケーション用に構成されたヘッダーの例で、Angularの[DomSanitizer](api/platform-browser/DomSanitizer)でセキュリティをバイパスするメソッドをいずれか使用しています。

```html
Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for
+'script';
```

Trusted TypesとJITを使用するAngularアプリケーション用に構成されたヘッダーの例を以下に示します。

```html
Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for
+'script';
```

遅延読み込みモジュールを使用するAngularアプリケーション用に構成されたヘッダーの例を以下に示します。

```html
Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';
```

<docs-callout title="コミュニティの貢献">

Trusted Type構成のトラブルシューティングについて詳しくは、次のリソースが役立つ場合があります。

[Trusted Typesを使用した、DOMベースのクロスサイトスクリプティング脆弱性の防止](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>

### AOTテンプレートコンパイラを使用する {#use-the-aot-template-compiler}

AOTテンプレートコンパイラは、テンプレートインジェクションと呼ばれる一連の脆弱性を防ぎ、アプリケーションのパフォーマンスを大幅に向上させます。
AOTテンプレートコンパイラは、Angular CLIアプリケーションで使用されるデフォルトのコンパイラであり、本番環境のすべてのデプロイで使用する必要があります。

AOTコンパイラ以外の選択肢としては、JITコンパイラがあります。JITコンパイラは、実行時にブラウザでテンプレートを実行可能なテンプレートコードにコンパイルします。
Angularはテンプレートコードを信頼するため、テンプレートを動的に生成してコンパイルすると、特にユーザーデータを含むテンプレートの場合、Angularの組み込みの保護を回避することになります。これは、セキュリティ上のアンチパターンです。
フォームを安全な方法で動的に構築する方法については、[動的フォーム](guide/forms/dynamic-forms)ガイドを参照してください。

### サーバー側のXSS保護　{#server-side-xss-protection}

サーバーで構築されたHTMLは、インジェクション攻撃に対して脆弱です。
Angularアプリケーションにテンプレートコードを注入することは、アプリケーションに実行可能なコードを注入することと同じです。
攻撃者は、アプリケーションを完全に制御できます。
これを防ぐために、値を自動的にエスケープしてサーバー上のXSSの脆弱性を防ぐ、テンプレート言語を使用してください。
サーバー側でテンプレート言語を使用してAngularテンプレートを作成しないでください。これには、テンプレートインジェクションの脆弱性を導入するリスクが伴います。

## HTTPレベルの脆弱性 {#http-level-vulnerabilities}

Angularには、クロスサイトリクエストフォージェリ（CSRFまたはXSRF）とクロスサイトスクリプトインクルージョン（XSSI）という、2つの一般的なHTTP脆弱性を防ぐために役立つ組み込みのサポートがあります。
これらはどちらも、主にサーバー側で軽減する必要がありますが、Angularはクライアント側の統合を容易にするためのヘルパーを提供します。

### クロスサイトリクエストフォージェリ {#cross-site-request-forgery}

クロスサイトリクエストフォージェリ（CSRFまたはXSRF）では、攻撃者は悪意のあるコードを含む別のWebページ（`evil.com`など）にユーザーを誘導します。このWebページは、アプリケーションのWebサーバー（`example-bank.com`など）に秘密裏に悪意のあるリクエストを送信します。

ユーザーが`example-bank.com`のアプリケーションにログインしているとします。
ユーザーはメールを開き、`evil.com`へのリンクをクリックします。このリンクは新しいタブで開きます。

`evil.com`ページは、すぐに`example-bank.com`に悪意のあるリクエストを送信します。
おそらく、ユーザーのアカウントから攻撃者のアカウントに資金を転送するリクエストです。
ブラウザは、認証Cookieを含む`example-bank.com`のCookieを、このリクエストとともに自動的に送信します。

`example-bank.com`サーバーにXSRF保護がない場合、サーバーはアプリケーションからの正当なリクエストと`evil.com`からの偽造リクエストを区別できません。

これを防ぐためにアプリケーションは、ユーザーリクエストが別のサイトではなく実際のアプリケーションから発信されたものであることを確認する必要があります。
サーバーとクライアントは、この攻撃を阻止するために協力する必要があります。

一般的なXSRF対策では、アプリケーションサーバーは、ランダムに作成された認証トークンをCookieで送信します。
クライアントコードはCookieを読み取り、そのトークンを使用して、すべての後続のリクエストにカスタムリクエストヘッダーを追加します。
サーバーは、受信したCookie値とリクエストヘッダー値を比較し、値が欠落している場合や一致しない場合はリクエストを拒否します。

この方法は、すべてのブラウザが_同一オリジンポリシー_を実装しているため、有効です。
Cookieが設定されているWebサイトのコードのみが、そのサイトのCookieを読み取り、そのサイトへのリクエストにカスタムヘッダーを設定できます。
つまり、アプリケーションのみが、このCookieトークンを読み取り、カスタムヘッダーを設定できます。
`evil.com`の悪意のあるコードはできません。

### `HttpClient`のXSRF/CSRFセキュリティ {#httpclient-xsrf-csrf-security}

`HttpClient`は、XSRF攻撃を防ぐために使用される[一般的なメカニズム](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token)をサポートしています。HTTPリクエストを実行すると、インターセプターはCookieからトークン（デフォルトでは`XSRF-TOKEN`）を読み取り、HTTPヘッダー（`X-XSRF-TOKEN`）として設定します。ドメイン上で実行されているコードのみがCookieを読み取ることができるため、バックエンドは、HTTPリクエストが攻撃者ではなく、クライアントアプリケーションから発信されたものであると確信できます。

デフォルトでは、インターセプターは、相対URLへのすべての変更リクエスト（`POST`など）でこのヘッダーを送信しますが、GET/HEADリクエストや絶対URLを持つリクエストでは送信しません。

<docs-callout helpful title="GETリクエストを保護しないのはなぜ？">
CSRF保護は、バックエンドのステートを変更する可能性のあるリクエストにのみ必要です。CSRF攻撃は、本来、ドメイン境界を跨いで行われるため、Webの[同一オリジンポリシー](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy)により、攻撃側のページが認証されたGETリクエストの結果を取得することはできません。
</docs-callout>

これを活用するには、サーバーは、ページの読み込み時または最初のGETリクエスト時に、`XSRF-TOKEN`というJavaScriptで読み取り可能なセッションCookieにトークンを設定する必要があります。後続のリクエストでは、サーバーは、Cookieが`X-XSRF-TOKEN` HTTPヘッダーと一致することを確認し、ドメイン上で実行されているコードのみがリクエストを送信できたことを確認できます。トークンはユーザーごとに一意である必要があり、サーバーで検証できる必要があります。これにより、クライアントが独自のトークンを作成することを防ぎます。トークンを、サイトの認証Cookieのダイジェストにソルトを付加した値に設定すると、セキュリティが向上します。

複数のAngularアプリケーションが同じドメインまたはサブドメインを共有する環境で競合を防ぐため、各アプリケーションに一意のCookie名を割り当てます。

<docs-callout important title="HttpClientは、XSRF保護スキームのクライアント側のみをサポート">
バックエンドサービスは、ページのCookieを設定し、すべての対象リクエストでヘッダーが存在することを確認するように構成する必要があります。そうしないと、Angularのデフォルトの保護は無効になります。
</docs-callout>

### カスタムCookie/ヘッダー名の構成 {#configuring-custom-cookie-header-names}

バックエンドサービスでXSRFトークンCookieやヘッダーに異なる名前を使用している場合は、`withXsrfConfiguration`を使用してデフォルト値をオーバーライドします。

次の例のように、`provideHttpClient`呼び出しに追加します。

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ],
};
```

### XSRF保護の無効化 {#disabling-xsrf-protection}

組み込みのXSRF保護メカニズムがアプリケーションで機能しない場合は、`withNoXsrfProtection`機能を使用して無効にできます。

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```

Open Web Application Security Project（OWASP）のCSRFについては、[クロスサイトリクエストフォージェリ（CSRF）](https://owasp.org/www-community/attacks/csrf)と[クロスサイトリクエストフォージェリ（CSRF）防止チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)を参照してください。
スタンフォード大学の論文[クロスサイトリクエストフォージェリに対する堅牢な防御](https://seclab.stanford.edu/websec/csrf/csrf.pdf)は、詳細な情報源です。

また、Dave Smithの[AngularConnect 2016でのXSRFに関する講演](https://www.youtube.com/watch?v=9inczw6qtpY 'Cross Site Request Funkery Securing Your Angular Apps From Evil Doers')も参照してください。

### クロスサイトスクリプトインクルージョン（XSSI） {#cross-site-script-inclusion}

クロスサイトスクリプトインクルージョンは、JSONの脆弱性としても知られており、攻撃者のWebサイトがJSON APIからデータを読み取ることを許可する可能性があります。
この攻撃は、古いブラウザで、組み込みのJavaScriptオブジェクトコンストラクターをオーバーライドし、`<script>`タグを使用してAPI URLを含めることで機能します。

この攻撃は、返されたJSONがJavaScriptとして実行可能である場合にのみ成功します。
サーバーは、すべてのJSONレスポンスの先頭に、よく知られている文字列`")]}',\n"`を使用して実行不能にすることで、攻撃を防ぐことができます。

Angularの`HttpClient`ライブラリは、この規則を認識し、さらに解析する前に、すべてのレスポンスから文字列`")]}',\n"`を自動的に削除します。

詳細については、[Google Webセキュリティブログの投稿](https://security.googleblog.com/2011/05/website-security-for-webmasters.html)のXSSIセクションを参照してください。

## Preventing Server-Side Request Forgery (SSRF)

Angular includes strict validation for `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, `X-Forwarded-Prefix` and `X-Forwarded-Port` headers in the request handling pipeline to prevent header-based [Server-Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF).

The validation rules are:

- `Host` and `X-Forwarded-Host` headers are validated against a strict allowlist and cannot contain path separators.
- `X-Forwarded-Port` header must be numeric.
- `X-Forwarded-Proto` header must be `http` or `https`.
- `X-Forwarded-Prefix` header must start with `/` and contain only alphanumeric characters, hyphens, and underscores, separated by single slashes.
- By default, all `X-Forwarded-*` headers are treated as untrusted and are removed from the request. To retain them, they must be explicitly allowed by configuring `trustProxyHeaders`.

Invalid headers trigger an error log, and unallowed proxy headers are removed from the request. Requests with unrecognized hostnames will result in a `400 Bad Request` is issued.

NOTE: Most cloud providers and CDN providers perform automatic validation of these headers before a request ever reaches the application origin. This inherent filtering significantly reduces the practical attack surface.

### Configuring allowed hosts

To allow specific hostnames, you need to add them to the allowlist. This is critical for ensuring your application works correctly and securely when deployed. The patterns support wildcards for flexible hostname matching.

You can configure the `allowedHosts` option in your `angular.json`:

```json {hideCopy}
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "security": {
              "allowedHosts": [
                "example.com",
                "*.example.com" // allows all subdomains of example.com
              ]
            }
            // ... other options
          }
        }
      }
    }
  }
}
```

You can also configure `allowedHosts` when initializing the application engine:

```typescript
const appEngine = new AngularAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});

const nodeAppEngine = new AngularNodeAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});
```

For the Node.js variant `AngularNodeAppEngine`, you can also provide `NG_ALLOWED_HOSTS` (comma-separated list) environment variable for authorizing hosts.

```bash {hideDollar}
export NG_ALLOWED_HOSTS="example.com,*.trusted-example.com"
```

IMPORTANT: You can use `*` as a value in `allowedHosts` to allow all hostnames, though this is generally discouraged and presents a security risk. Accepting any host header can expose your application to host header injection and [Server-Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) attacks. This configuration should only be used when validation for `Host` and `X-Forwarded-Host` headers is performed in another layer, such as a load balancer or reverse proxy. For better security, we recommend using an explicit list of allowed hosts whenever possible. See [GHSA-x288-3778-4hhx](https://github.com/angular/angular-cli/security/advisories/GHSA-x288-3778-4hhx) for more details.

### Configuring trusted proxy headers

By default, Angular ignores all `X-Forwarded-*` headers. If your application is behind a trusted reverse proxy (like a load balancer) that sets these headers, you can configure Angular to trust them.

You can configure `trustProxyHeaders` when initializing the application engine:

```typescript
const appEngine = new AngularAppEngine({
  trustProxyHeaders: ['x-forwarded-host', 'x-forwarded-proto'], // Trust specific headers
});

const nodeAppEngine = new AngularNodeAppEngine({
  trustProxyHeaders: true, // Trust all X-Forwarded-* headers
});
```

IMPORTANT: Only enable `trustProxyHeaders` if your application is behind a trusted proxy that strictly validates or overrides these headers. Otherwise, attackers can spoof these headers to cause [Server-Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) attacks.

## Angularアプリケーションの監査 {#auditing-angular-applications}

Angularアプリケーションは、通常のWebアプリケーションと同じセキュリティ原則に従う必要があり、同様に監査する必要があります。
セキュリティレビューで監査する必要があるAngular固有のAPI（[_bypassSecurityTrust_](#trusting-safe-values)メソッドなど）は、ドキュメントでセキュリティに敏感なものとしてマークされています。
