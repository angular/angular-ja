# Service Workerの設定

#### 前提条件

次の基本的理解があること
* [プロダクションにおけるService Worker](guide/service-worker-devops)

<hr />

`ngsw-config.json`設定ファイルは、
Angular Service WorkerがキャッシュすべきファイルとデータのURLと、
キャッシュされたファイルとデータをどのように更新すべきかを指定します。[Angular CLI](cli)は`ng build --prod`中に設定ファイルを作成します。
手動で`ngsw-config`ツールで作成することもできます。(`<project-name>` にはビルドしているプロジェクトの名前が入ります)

<code-example language="sh">
./node_modules/.bin/ngsw-config ./dist/&lt;project-name&gt; ./ngsw-config.json [/base/href]
</code-example>

設定ファイルはJSON形式を使用します。すべてのファイルパスは`/`で始まらなければなりません。
これはCLIプロジェクトでの展開ディレクトリに対応し、通常は `dist/<project-name>`です。

{@a glob-patterns}
特に指定のない限り、パターンは制限されたglobフォーマットを使います。

* `**`は、0個以上のパスセグメントに一致します。
* `*`は、厳密に0個以上の`/`を除く文字に一致します。
* `?` は、厳密に1個の`/`を除く文字に一致します。
* `!`接頭辞は、パターンを否定的なものとしてマークします。つまり、パターンに一致しないファイルのみが含まれます。

パターン例

* `/**/*.html`は、すべてのHTMLファイルを指定します。
* `/*.html`は、ルートのHTMLファイルのみを指定します。
* `!/**/*.map`は、すべてのソースマップを除外します。

設定ファイルの各セクションについて後述します。

## `appData`

このセクションでは、この特定のバージョンのアプリケーションを記述するために、任意のデータを渡すことができます。`SwUpdate`サービスは、更新通知にそのデータを含めます。このセクションを使用して、UIポップアップの表示のための追加情報を提供し、ユーザーに利用可能なアップデートを通知します。

{@a index-file}
## `index`

ナビゲーション要求を満たすためにインデックスページとして機能するファイルを指定します。通常これは`/index.html`です。

## `assetGroups`

*Assets*は、アプリケーションとともに更新される、アプリケーションバージョンの一部であるリソースです。ページのオリジンドメインからロードされたリソースだけでなく、CDNや他の外部URLからロードされたサードパーティのリソースを含めることができます。ビルド時にこのような外部URLをすべて知っているわけではないので、URLパターンを照合することができます。

このフィールドには、アセットリソースのセットとそれらがキャッシュされるポリシーを定義する、一連のアセットグループが含まれます。

```json
{
  "assetGroups": [{
    ...
  }, {
    ...
  }]
}
```

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

### `name`

`name`は必須です。これにより設定のバージョン間で特定のアセットグループを識別します。

### `installMode`

`installMode`は、これらのリソースが最初にどのようにキャッシュされるかを決定します。`installMode`は次の2つの値のいずれかです。

* `prefetch`は、AngularService Workerに、現在のバージョンのアプリケーションをキャッシュしている間にリストされたすべてのリソースをフェッチするように指示します。これは帯域幅を大量に消費しますが、ブラウザが現在オフラインであっても、要求されたときはいつでもリソースを利用できるようにします。

* `lazy`はフロントにリソースをキャッシュしません。代わりに、Angular Service Workerはリクエストを受け取ったリソースのみをキャッシュします。これはオンデマンドキャッシングモードです。要求されないリソースはキャッシュされません。これは異なる解像度のイメージのようなものに役立ちます。そのため、Service Workerは特定の画面と向きの正しいアセットだけをキャッシュします。

デフォルトでは `prefetch` です。

### `updateMode`

すでにキャッシュにあるリソースの場合、`updateMode`は新しいバージョンのアプリケーションが発見されたときのキャッシングの動作を決定します。以前のバージョン以降に変更されたグループ内のリソースは、`updateMode`にしたがって更新されます。

* `prefetch`は、変更されたリソースをすぐにダウンロードしてキャッシュするようにService Workerに指示します。

* `lazy`は、Service Workerにそれらのリソースをキャッシュしないように指示します。代わりに、再度それらがリクエストされるまで、それらは要求されていないものとして扱われ、アップデートを待機します。`lazy`の`updateMode`は、`installMode`も`lazy`になっている場合にのみ有効です。

デフォルトでは `installMode` と同じです。

### `resources`

このセクションでは、キャッシュするリソースを次のグループに分けて説明します。

* `files`は、配布ディレクトリ内のファイルと一致するパターンをリストします。これらは、単一のファイルまたは複数のファイルに一致するglobのようなパターンです。

* `urls`は、実行時に照合されるURLとURLパターンの両方が含まれます。これらのリソースは直接取得されず、コンテンツハッシュもありませんが、HTTPヘッダーにしたがってキャッシュされます。これは、Google FontsサービスなどのCDNでもっとも便利です。<br>
_(否定のglobパターンはサポートされず、?は文字通り一致します。つまり、?以外の文字は一致しません)_

### `cacheQueryOptions`

These options are used to modify the matching behavior of requests. They are passed to the browsers `Cache#match` function. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match) for details. Currently, only the following options are supported:

* `ignoreSearch`: Ignore query parameters. Defaults to `false`.

## `dataGroups`

アセットリソースとは異なり、データリクエストはアプリケーションとともにバージョン管理されません。これらは、手動で構成されたポリシーにしたがってキャッシュされます。このポリシーは、API要求やその他のデータの依存関係などの状況に役立ちます。

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

### `name`
`assetGroups`と同様に、すべてのデータグループはそれを一意に識別する`name`を持っています。

### `urls`
A list of URL patterns. URLs that match these patterns are cached according to this data group's policy. Only non-mutating requests (GET and HEAD) are cached.
 * Negative glob patterns are not supported.
 * `?` is matched literally; that is, it matches *only* the character `?`.

### `version`
時には、APIは下位互換性のない形式でフォーマットを変更します。新しいバージョンのアプリケーションは古いAPI形式と互換性がなく、そのAPIの既存のキャッシュされたリソースと互換性がない可能性があります。

`version`は、キャッシュされているリソースが下位互換性のない方法で更新されたこと、古いキャッシュエントリ(以前のバージョンからのキャッシュエントリ）を破棄するべきであることを示すためのメカニズムを提供します。

`version`は、整数フィールドで、デフォルトは `1` です。

### `cacheConfig`
このセクションでは、一致したリクエストをキャッシュするポリシーを定義します。

#### `maxSize`
（必須）キャッシュ内のエントリまたはレスポンスの最大数。オープンエンドのキャッシュは無限に成長しますが、最終的にはストレージクォータを超えたら、ストレージから追い出します。

#### `maxAge`
（必須）`maxAge`パラメータは、レスポンスが無効であるとみなされる前にキャッシュに残ることが許される期間を示します。`maxAge`は、次の単位接尾辞を使用した継続時間文字列です。

* `d`: days
* `h`: hours
* `m`: minutes
* `s`: seconds
* `u`: milliseconds

たとえば、文字列 `3d12h`はコンテンツを3日半までキャッシュします。

#### `timeout`
この継続時間文字列は、ネットワークタイムアウトを指定します。ネットワークのタイムアウトは、キャッシュされたレスポンスが構成されている場合に、キャッシュされたレスポンスを使用する前にAngular Service Workerがネットワークが応答するまで待機する時間です。`timeout`は期間文字列で、次の単位接尾辞を使います。

* `d`: 日
* `h`: 時間
* `m`: 分
* `s`: 秒
* `u`: ミリ秒

たとえば、文字列 `5s30u` は、5秒と30ミリ秒のネットワークタイムアウトに変換されます。

#### `strategy`

Angular Service Workerは、データリソース用の2つのキャッシング戦略のいずれかを使用できます。

* デフォルトの`performance`はできるだけ速いレスポンスのために最適化します。リソースがキャッシュに存在する場合、キャッシュされたバージョンが使用され、ネットワークリクエストは作られません。これにより、よりよいパフォーマンスと引き換えに、maxAgeに依存して多少の古さを許容します。これは頻繁に変更されないリソースに適しています。たとえば、ユーザーのアバター画像です。

* `freshness`は、データをリアルタイム性で最適化し、ネットワークから要求されたデータを優先的に取り出します。`timeout`にしたがってネットワークがタイムアウトした場合にのみ、要求はキャッシュにフォールバックされます。これは、頻繁に変更されるリソースに役立ちます。たとえば、勘定残高などです。

<div class="alert is-helpful">

You can also emulate a third strategy, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), which returns cached data (if available), but also fetches fresh data from the network in the background for next time.
To use this strategy set `strategy` to `freshness` and `timeout` to `0u` in `cacheConfig`.

This will essentially do the following:

1. Try to fetch from the network first.
2. If the network request does not complete after 0ms (i.e. immediately), fall back to the cache (ignoring cache age).
3. Once the network request completes, update the cache for future requests.
4. If the resource does not exist in the cache, wait for the network request anyway.

</div>

### `cacheQueryOptions`

See [assetGroups](#assetgroups) for details.

## `navigationUrls`

このオプションのセクションでは、インデックスファイルにリダイレクトされるURLのカスタムリストを指定できます。

### ナビゲーションリクエストの処理

Service Workerは、`asset`または`data`グループと一致しないナビゲーションリクエストを指定された[index file](#index-file)にリダイレクトします。次の場合、リクエストはナビゲーション要求とみなされます。


1. [mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)が`navigation`である。
2. `text/html`レスポンスを受け入れている（`Accept`ヘッダーの値によって決定されます）。
3. URLが特定の基準に一致する（下記参照)。

デフォルトでは、これらの基準は次のとおりです。

1. URLの最後のパスセグメントにファイル拡張子（`.`）が含まれていないこと。
2. URLに`__`を含まれていないこと。

### ナビゲーションリクエストURLのマッチング

ほとんどの場合、これらのデフォルト基準は問題ありませんが、異なるルールを設定することが望ましい場合があります。たとえば、Angularアプリの一部ではない特定のルートを無視して、それらをサーバーに渡すことができます。

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
