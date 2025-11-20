# バックエンドサービスとのHTTP通信を理解する

ほとんどのフロントエンドアプリケーションは、HTTPプロトコルでサーバーと通信して、データのダウンロードやアップロード、その他のバックエンドサービスへのアクセスを行う必要があります。Angularは、Angularアプリケーション用のクライアントHTTP API、`@angular/common/http`にある`HttpClient`サービスクラスを提供しています。

## HTTPクライアントサービスの機能

HTTPクライアントサービスは、以下の主要な機能を提供します。

- [型付きの応答値](guide/http/making-requests#fetching-json-data)をリクエストする機能
- 簡素化された[エラー処理](guide/http/making-requests#handling-request-failure)
- リクエストとレスポンスの[インターセプション](guide/http/interceptors)
- 強力な[テストユーティリティ](guide/http/testing)

## 次に何をするか

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="HttpClientの設定"/>
  <docs-pill href="guide/http/making-requests" title="HTTPリクエストの実行"/>
</docs-pill-row>
