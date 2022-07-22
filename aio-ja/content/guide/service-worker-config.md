# Service Workerの設定

This topic describes the properties of the service worker configuration file.

#### 前提条件

次の基本的理解があること

*   [Service worker overview](https://developer.chrome.com/docs/workbox/service-worker-overview/)
*   [プロダクションにおけるService Worker](guide/service-worker-devops)

<hr />

`ngsw-config.json`設定ファイルは、
Angular Service WorkerがキャッシュすべきファイルとデータのURLと、
キャッシュされたファイルとデータをどのように更新すべきかを指定します。[Angular CLI](cli)は`ng build`中に設定ファイルを作成します。
手動で`ngsw-config`ツールで作成することもできます。(`<project-name>` にはビルドしているプロジェクトの名前が入ります)

<code-example language="sh">
./node_modules/.bin/ngsw-config ./dist/&lt;project-name&gt; ./ngsw-config.json [/base/href]
</code-example>

設定ファイルはJSON形式を使用します。すべてのファイルパスは`/`で始まらなければなりません。
これはCLIプロジェクトでの展開ディレクトリに対応し、通常は `dist/<project-name>`です。

<a id="glob-patterns"></a>

Unless otherwise commented, patterns use a **limited*** glob format that internally will be converted into regex:

* `**`は、0個以上のパスセグメントに一致します。
* `*`は、厳密に0個以上の`/`を除く文字に一致します。
* `?` は、厳密に1個の`/`を除く文字に一致します。
* `!`接頭辞は、パターンを否定的なものとしてマークします。つまり、パターンに一致しないファイルのみが含まれます。

<div class="alert is-helpful">

  **\*** Pay attention that some characters with a special meaning in a regular expression are not escaped and also the pattern is not wrapped in `^`/`$` in the internal glob to regex conversion.

  *   `$` is a special character in regex that matches the end of the string and will not be automatically escaped when converting the glob pattern to a regular expression.
      If you want to literally match the `$` character, you have to escape it yourself (with `\\$`).

      <div class="alert is-important">

        For example, the glob pattern `/foo/bar/$value` results in an unmatchable expression, because it is impossible to have a string that has any characters after it has ended.

      </div>

  *   The pattern will not be automatically wrapped in `^` and `$` when converting it to a regular expression.
      Therefore, the patterns will partially match the request URLs.
      If you want your patterns to match the beginning and/or end of URLs, you can add `^`/`$` yourself.

      <div class="alert is-important">

        For example, the glob pattern `/foo/bar/*.js` will match both `.js` and `.json` files.
        If you want to only match `.js` files, use `/foo/bar/*.js$`.

      </div>

</div>

パターン例

* `/**/*.html`は、すべてのHTMLファイルを指定します。
* `/*.html`は、ルートのHTMLファイルのみを指定します。
* `!/**/*.map`は、すべてのソースマップを除外します。

## Service worker configuration properties

設定ファイルの各セクションについて後述します。

### `appData`

このセクションでは、この特定のバージョンのアプリケーションを記述するために、任意のデータを渡すことができます。`SwUpdate`サービスは、更新通知にそのデータを含めます。このセクションを使用して、UIポップアップの表示のための追加情報を提供し、ユーザーに利用可能なアップデートを通知します。

{@a index-file}
### `index`

ナビゲーション要求を満たすためにインデックスページとして機能するファイルを指定します。通常これは`/index.html`です。

### `assetGroups`

*Assets*は、アプリケーションとともに更新される、アプリケーションバージョンの一部であるリソースです。ページのオリジンドメインからロードされたリソースだけでなく、CDNや他の外部URLからロードされたサードパーティのリソースを含めることができます。ビルド時にこのような外部URLをすべて知っているわけではないので、URLパターンを照合することができます。

このフィールドには、アセットリソースのセットとそれらがキャッシュされるポリシーを定義する、一連のアセットグループが含まれます。

```json
{
  "assetGroups": [
    {
      ...
    },
    {
      ...
    }
  ]
}
```

<div class="alert is-helpful">

When the Service Worker handles a request, it checks asset groups in the order in which they appear in `ngsw-config.json`.
The first asset group that matches the requested resource handles the request.

It is recommended that you put the more specific asset groups higher in the list.
For example, an asset group that matches `/foo.js` should appear before one that matches `*.js`.

</div>

各アセットグループには、リソースグループとそれらを管理するポリシーの両方を指定します。このポリシーは、リソースがフェッチされるタイミングと、変更が検出されたときに発生する振る舞いを決定します。

アセットグループは、ここに示すTypeScriptインターフェースに従います。

```typescript
interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}
```

Each `AssetGroup` is defined by the following asset group properties.

#### `name`

`name`は必須です。これにより設定のバージョン間で特定のアセットグループを識別します。

#### `installMode`

`installMode`は、これらのリソースが最初にどのようにキャッシュされるかを決定します。`installMode`は次の2つの値のいずれかです。

* `prefetch`は、AngularService Workerに、現在のバージョンのアプリケーションをキャッシュしている間にリストされたすべてのリソースをフェッチするように指示します。これは帯域幅を大量に消費しますが、ブラウザが現在オフラインであっても、要求されたときはいつでもリソースを利用できるようにします。

* `lazy`はフロントにリソースをキャッシュしません。代わりに、Angular Service Workerはリクエストを受け取ったリソースのみをキャッシュします。これはオンデマンドキャッシングモードです。要求されないリソースはキャッシュされません。これは異なる解像度のイメージのようなものに役立ちます。そのため、Service Workerは特定の画面と向きの正しいアセットだけをキャッシュします。

デフォルトでは `prefetch` です。

#### `updateMode`

すでにキャッシュにあるリソースの場合、`updateMode`は新しいバージョンのアプリケーションが発見されたときのキャッシングの動作を決定します。以前のバージョン以降に変更されたグループ内のリソースは、`updateMode`にしたがって更新されます。

* `prefetch`は、変更されたリソースをすぐにダウンロードしてキャッシュするようにService Workerに指示します。

* `lazy`は、Service Workerにそれらのリソースをキャッシュしないように指示します。代わりに、再度それらがリクエストされるまで、それらは要求されていないものとして扱われ、アップデートを待機します。`lazy`の`updateMode`は、`installMode`も`lazy`になっている場合にのみ有効です。

デフォルトでは `installMode` と同じです。

#### `resources`

このセクションでは、キャッシュするリソースを次のグループに分けて説明します。

* `files`は、配布ディレクトリ内のファイルと一致するパターンをリストします。これらは、単一のファイルまたは複数のファイルに一致するglobのようなパターンです。

* `urls`は、実行時に照合されるURLとURLパターンの両方が含まれます。これらのリソースは直接取得されず、コンテンツハッシュもありませんが、HTTPヘッダーにしたがってキャッシュされます。これは、Google FontsサービスなどのCDNでもっとも便利です。<br>
_(否定のglobパターンはサポートされず、?は文字通り一致します。つまり、?以外の文字は一致しません)_

#### `cacheQueryOptions`

These options are used to modify the matching behavior of requests. They are passed to the browsers `Cache#match` function. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match) for details. Currently, only the following options are supported:

* `ignoreSearch`: Ignore query parameters. Defaults to `false`.

### `dataGroups`

アセットリソースとは異なり、データリクエストはアプリケーションとともにバージョン管理されません。これらは、手動で構成されたポリシーにしたがってキャッシュされます。このポリシーは、API要求やその他のデータの依存関係などの状況に役立ちます。

This field contains an array of data groups, each of which defines a set of data resources and the policy by which they are cached.

```json
{
  "dataGroups": [
    {
      ...
    },
    {
      ...
    }
  ]
}
```

<div class="alert is-helpful">

When the Service Worker handles a request, it checks data groups in the order in which they appear in `ngsw-config.json`.
The first data group that matches the requested resource handles the request.

It is recommended that you put the more specific data groups higher in the list.
For example, a data group that matches `/api/foo.json` should appear before one that matches `/api/*.json`.

</div>

データグループはこのTypeScriptインターフェースに従います。

```typescript
export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    strategy?: 'freshness' | 'performance';
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}
```

Each `DataGroup` is defined by the following data group properties.

#### `name`

`assetGroups`と同様に、すべてのデータグループはそれを一意に識別する`name`を持っています。

#### `urls`

A list of URL patterns. URLs that match these patterns are cached according to this data group's policy. Only non-mutating requests (GET and HEAD) are cached.
 * Negative glob patterns are not supported.
 * `?` is matched literally; that is, it matches *only* the character `?`.

#### `version`

時には、APIは下位互換性のない形式でフォーマットを変更します。新しいバージョンのアプリケーションは古いAPI形式と互換性がなく、そのAPIの既存のキャッシュされたリソースと互換性がない可能性があります。

`version`は、キャッシュされているリソースが下位互換性のない方法で更新されたこと、古いキャッシュエントリ(以前のバージョンからのキャッシュエントリ）を破棄するべきであることを示すためのメカニズムを提供します。

`version`は、整数フィールドで、デフォルトは `1` です。

#### `cacheConfig`

このセクションでは、一致したリクエストをキャッシュするポリシーを定義します。

##### `maxSize`

**Required**

キャッシュ内のエントリまたはレスポンスの最大数。オープンエンドのキャッシュは無限に成長しますが、最終的にはストレージクォータを超えたら、ストレージから追い出します。

##### `maxAge`

**Required**

`maxAge`パラメータは、レスポンスが無効であるとみなされる前にキャッシュに残ることが許される期間を示します。`maxAge`は、次の単位接尾辞を使用した継続時間文字列です。

* `d`: days
* `h`: hours
* `m`: minutes
* `s`: seconds
* `u`: milliseconds

たとえば、文字列 `3d12h`はコンテンツを3日半までキャッシュします。

##### `timeout`

この継続時間文字列は、ネットワークタイムアウトを指定します。ネットワークのタイムアウトは、キャッシュされたレスポンスが構成されている場合に、キャッシュされたレスポンスを使用する前にAngular Service Workerがネットワークが応答するまで待機する時間です。`timeout`は期間文字列で、次の単位接尾辞を使います。

* `d`: 日
* `h`: 時間
* `m`: 分
* `s`: 秒
* `u`: ミリ秒

たとえば、文字列 `5s30u` は、5秒と30ミリ秒のネットワークタイムアウトに変換されます。

##### `strategy`

Angular Service Workerは、データリソース用の2つのキャッシング戦略のいずれかを使用できます。

* デフォルトの`performance`はできるだけ速いレスポンスのために最適化します。リソースがキャッシュに存在する場合、キャッシュされたバージョンが使用され、ネットワークリクエストは作られません。これにより、よりよいパフォーマンスと引き換えに、maxAgeに依存して多少の古さを許容します。これは頻繁に変更されないリソースに適しています。たとえば、ユーザーのアバター画像です。

* `freshness`は、データをリアルタイム性で最適化し、ネットワークから要求されたデータを優先的に取り出します。`timeout`にしたがってネットワークがタイムアウトした場合にのみ、要求はキャッシュにフォールバックされます。これは、頻繁に変更されるリソースに役立ちます。たとえば、勘定残高などです。

<div class="alert is-helpful">

You can also emulate a third strategy, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), which returns cached data (if available), but also fetches fresh data from the network in the background for next time.
To use this strategy set `strategy` to `freshness` and `timeout` to `0u` in `cacheConfig`.

This will essentially do the following:

1. Try to fetch from the network first.
1. If the network request does not complete after 0ms (i.e. immediately), fall back to the cache (ignoring cache age).
1. Once the network request completes, update the cache for future requests.
1. If the resource does not exist in the cache, wait for the network request anyway.

</div>

##### `cacheOpaqueResponses`

Whether the Angular service worker should cache opaque responses or not.

If not specified, the default value depends on the data group's configured strategy:

| Strategies                             | Details |
|:---                                    |:---     |
| Groups with the `freshness` strategy   | The default value is `true` and the service worker caches opaque responses. These groups will request the data every time and only fall back to the cached response when offline or on a slow network. Therefore, it doesn't matter if the service worker caches an error response.                                    |
| Groups with the `performance` strategy | The default value is `false` and the service worker doesn't cache opaque responses. These groups would continue to return a cached response until `maxAge` expires, even if the error was due to a temporary network or server issue. Therefore, it would be problematic for the service worker to cache an error response. |

<div class="callout is-important">

<header>Comment on opaque responses</header>

In case you are not familiar, an [opaque response][WhatwgFetchSpecConceptFilteredResponseOpaque] is a special type of response returned when requesting a resource that is on a different origin which doesn't return CORS headers.
One of the characteristics of an opaque response is that the service worker is not allowed to read its status, meaning it can't check if the request was successful or not.
See [Introduction to fetch()][GoogleDeveloperWebUpdates201503IntroductionToFetchResponseTypes] for more details.

If you are not able to implement CORS &mdash;for example, if you don't control the origin&mdash; prefer using the `freshness` strategy for resources that result in opaque responses.

</div>

#### `cacheQueryOptions`

See [assetGroups](#assetgroups) for details.

### `navigationUrls`

このオプションのセクションでは、インデックスファイルにリダイレクトされるURLのカスタムリストを指定できます。

#### ナビゲーションリクエストの処理

Service Workerは、`asset`または`data`グループと一致しないナビゲーションリクエストを指定された[index file](#index-file)にリダイレクトします。次の場合、リクエストはナビゲーション要求とみなされます。


1. [mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)が`navigation`である。
2. `text/html`レスポンスを受け入れている（`Accept`ヘッダーの値によって決定されます）。
3. URLが特定の基準に一致する（下記参照)。

デフォルトでは、これらの基準は次のとおりです。

1. URLの最後のパスセグメントにファイル拡張子（`.`）が含まれていないこと。
2. URLに`__`を含まれていないこと。

<div class="alert is-helpful">

To configure whether navigation requests are sent through to the network or not, see the [navigationRequestStrategy](#navigation-request-strategy) section.

</div>

#### ナビゲーションリクエストURLのマッチング

ほとんどの場合、これらのデフォルト基準は問題ありませんが、異なるルールを設定することが望ましい場合があります。たとえば、Angularアプリケーションの一部ではない特定のルートを無視して、それらをサーバーに渡すことができます。

このフィールドには、実行時に照合されるURLの配列と[glob-like](#glob-patterns) URLパターンが含まれます。それには、ネガティブパターン（`!`で始まるパターン）とネガティブでないパターンの両方を含めることができます。

URLがネガティブでないURL/パターンの _いずれか_ と一致し、ネガティブなURL/パターンと _ひとつも_ 一致しないリクエストのみがナビゲーションリクエストとみなされます。一致するとURLクエリは無視されます。

フィールドが省略された場合、デフォルトは次のようになります。

```ts
[
  '/**',           // すべてのURLを含める。
  '!/**/*.*',      // ファイルへのリクエストを除外する。
  '!/**/*__*',     // 最後のセグメントに`__`を含むURLを除外する
  '!/**/*__*/**',  // その他のセグメントに`__`を含むURLを除外する
]
```

{@a navigation-request-strategy}

### `navigationRequestStrategy`

This optional property enables you to configure how the service worker handles navigation requests:

```json
{
  "navigationRequestStrategy": "freshness"
}
```

Possible values:

- `'performance'`: The default setting. Serves the specified [index file](#index-file), which is typically cached.
- `'freshness'`: Passes the requests through to the network and falls back to the `performance` behavior when offline.
  This value is useful when the server redirects the navigation requests elsewhere using an HTTP redirect (`3xx` status code).
  Reasons for using this value include:
    - Redirecting to an authentication website when authentication is not handled by the application.
    - Redirecting specific URLs to avoid breaking existing links/bookmarks after a website redesign.
    - Redirecting to a different website, such as a server-status page, while a page is temporarily down.

<div class="alert is-important">

The `freshness` strategy usually results in more requests sent to the server, which can increase response latency.
It is recommended that you use the default performance strategy whenever possible.

</div>

<!-- links -->

<!-- external links -->

[GoogleDeveloperWebUpdates201503IntroductionToFetchResponseTypes]: https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types

[WhatwgFetchSpecConceptFilteredResponseOpaque]: https://fetch.spec.whatwg.org#concept-filtered-response-opaque

<!-- end links -->

@reviewed 2022-02-28
