# `HttpClient`のセキュリティ

`HttpClient` は、一般的な2つのHTTPセキュリティメカニズム (XSSI保護とXSRF/CSRF保護) のための組み込みサポートを提供します。

TIP: APIに [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy) を導入することも検討してください。

## XSSI 保護

クロスサイトスクリプトインクルージョン (XSSI) は、攻撃者がAPIエンドポイントからJSONデータを攻撃者が制御するページの `<script>` として読み込む [クロスサイトスクリプト](https://en.wikipedia.org/wiki/Cross-site_scripting) 攻撃の一種です。その後、さまざまなJavaScriptテクニックを使用してこのデータにアクセスできます。

XSSIを防ぐための一般的なテクニックは、JSONレスポンスを "非実行可能なプレフィックス" (通常は `)]}',\n`) で提供することです。このプレフィックスにより、JSONレスポンスが有効な実行可能なJavaScriptとして解釈されるのを防ぎます。APIがデータとして読み込まれる場合、JSONパースの前にプレフィックスを削除できます。

`HttpClient` は、レスポンスからJSONをパースする際に、このXSSIプレフィックス (存在する場合) を自動的に削除します。

## XSRF/CSRF 保護

[クロスサイトリクエストフォージェリ (XSRF または CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) は、攻撃者が認証されたユーザーをだまして、ユーザーが知らずにWebサイトでアクションを実行させる攻撃手法です。

`HttpClient` は、XSRF攻撃を防ぐために使用される [一般的なメカニズム](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) をサポートしています。HTTPリクエストを実行すると、インターセプターはデフォルトで `XSRF-TOKEN` という名前のCookieからトークンを読み取り、`X-XSRF-TOKEN` というHTTPヘッダーに設定します。ドメイン上で実行されるコードのみがCookieを読み取ることができるため、バックエンドはHTTPリクエストが攻撃者ではなくクライアントアプリケーションから来たものであると確信できます。

デフォルトでは、インターセプターは、相対URLへのすべての変更要求 (例: `POST`) にこのヘッダーを送信しますが、GET/HEADリクエストまたは絶対URLを持つリクエストには送信しません。

<docs-callout helpful title="なぜ GET リクエストは保護しないのですか?">
CSRF 保護は、バックエンドの状態を変更できるリクエストでのみ必要です。本質的に、CSRF 攻撃はドメイン境界を超えて実行され、Web の [same-origin ポリシー](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) は、攻撃するページが認証された GET リクエストの結果を取得するのを防ぎます。
</docs-callout>

この機能を利用するには、サーバーはページの読み込み時または最初のGETリクエスト時に、`XSRF-TOKEN` というJavaScriptで読み取り可能なセッションCookieにトークンを設定する必要があります。その後のリクエストでは、サーバーはCookieが `X-XSRF-TOKEN` HTTPヘッダーと一致することを確認し、ドメイン上で実行されているコードのみがリクエストを送信できたことを確認できます。トークンはユーザーごとに一意である必要があり、サーバーで検証可能である必要があります。これにより、クライアントが独自のトークンを作成することが防止されます。セキュリティを高めるために、トークンをサイトの認証Cookieのダイジェストに設定し、塩で設定します。

複数のAngularアプリケーションが同じドメインまたはサブドメインを共有する環境で衝突を防ぐには、各アプリケーションに一意のCookie名を指定します。

<docs-callout important title="HttpClient は XSRF 保護スキームのクライアント側の半分のみをサポートしています">
  バックエンドサービスは、ページの Cookie を設定し、すべての適格なリクエストにヘッダーが存在することを確認するように構成する必要があります。これを実行しないと、Angular のデフォルトの保護が無効になります。
</docs-callout>

### カスタム Cookie/ヘッダー名の構成

バックエンドサービスがXSRFトークンCookieまたはヘッダーに異なる名前を使用している場合は、`withXsrfConfiguration` を使用してデフォルト値をオーバーライドします。

以下のように `provideHttpClient` コールに追加します。

<docs-code language="ts">
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ]
};
</docs-code>

### XSRF 保護の無効化

組み込みのXSRF保護メカニズムがアプリケーションで機能しない場合は、`withNoXsrfProtection` 機能を使用して無効にできます。

<docs-code language="ts">
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withNoXsrfProtection(),
    ),
  ]
};
</docs-code>
