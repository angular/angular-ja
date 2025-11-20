# 非同期リアクティビティとリソース

IMPORTANT: `resource`は[実験的](reference/releases#experimental)です。お試しいただけますが、安定版になる前に変更される可能性があります。

ほとんどのシグナルAPIは同期的です（`signal`、`computed`、`input`など）。しかし、アプリケーションは多くの場合、非同期的に利用可能なデータを処理する必要があります。`Resource`を使用すると、非同期データをアプリケーションのシグナルベースのコードに組み込むことができます。

`Resource`を使用してあらゆる種類の非同期処理を実行できますが、`Resource`の最も一般的なユースケースはサーバーからデータを取得することです。以下は、ユーザーデータを取得するためのリソースを作成する例です。

`Resource`を作成する最も簡単な方法は、`resource`関数を使用することです。

```typescript
import {resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define a reactive computation.
  // The params value recomputes whenever any read signals change.
  params: () => ({id: userId()}),

  // Define an async loader that retrieves data.
  // The resource calls this function every time the `params` value changes.
  loader: ({params}) => fetchUser(params),
});

// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` serves 2 purposes:
    // - It acts as type guard to strip `undefined` from the type
    // - If protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }

  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

`resource`関数は、2つの主なプロパティである`params`と`loader`を持つ`ResourceOptions`オブジェクトを受け入れます。

`params`プロパティは、パラメータ値を生成するリアクティブな計算を定義します。この計算で読み取られるシグナルが変更されるたびに、リソースは新しいパラメータ値を生成します。これは`computed`と同様です。

`loader`プロパティは`ResourceLoader`を定義します。これは、状態を取得する非同期関数です。リソースは、`params`計算が新しい値を生成するたびにローダーを呼び出し、その値をローダーに渡します。詳細は下記の[Resourceローダー](#resource-loaders)を参照してください。

`Resource`には、ローダーの結果を含む`value`シグナルがあります。

## リソースローダー {#resource-loaders}

リソースを作成する際には、`ResourceLoader`を指定します。このローダーは、単一のパラメーター（`ResourceLoaderParams`オブジェクト）を受け入れ、値を返す非同期関数です。

`ResourceLoaderParams`オブジェクトには、`params`、`previous`、`abortSignal`の3つのプロパティが含まれています。

| プロパティ      | 説明                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`     | リソースの`params`計算の値。                                                                                               |
| `previous`    | `status`プロパティを含む、前の`ResourceStatus`を持つオブジェクト。                                                                    |
| `abortSignal` | [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。詳細は下記の[リクエストの中断](#aborting-requests)を参照してください。 |

`params`の計算が`undefined`を返す場合、ローダー関数は実行されず、リソースの状態は`Idle`になります。

### リクエストの中断 {#aborting-requests}

リソースが読み込み中の場合に`params`計算が変更されると、リソースは未処理の読み込み処理を中断します。

`ResourceLoaderParams`内の`abortSignal`を使用して、中断されたリクエストに応答できます。例えば、ネイティブの`fetch`関数は`AbortSignal`を受け入れます。

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // 与えられた`AbortSignal`がリクエストの中断を示している場合、
    // fetchは未処理のHTTPリクエストをキャンセルします。
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

`AbortSignal`によるリクエストのキャンセルについては、[`AbortSignal` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)を参照してください。

### 再読み込み {#reloading}

`reload`メソッドを呼び出すことで、プログラム的にリソースの`loader`をトリガーできます。

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## リソースの状態

リソースオブジェクトには、非同期ローダーの状態を読み取るためのいくつかのシグナルプロパティがあります。

| プロパティ    | 説明                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `value`     | リソースの最新の値、または値が受信されていない場合は`undefined`。                            |
| `hasValue`  | リソースが値を持っているかどうか。                                                                               |
| `error`     | リソースのローダーの実行中に発生した最新のエラー、またはエラーが発生していない場合は`undefined`。 |
| `isLoading` | リソースローダーが現在実行中かどうか。                                                               |
| `status`    | 後述のリソースの特定の`ResourceStatus`。                                                   |

`status` シグナルは、文字列定数を使用してリソースの状態を説明する特定の `ResourceStatus` を提供します。

| ステータス        | `value()`         | 説明                                                                  |
| ------------- | :---------------- | ---------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | リソースに有効なリクエストがなく、ローダーが実行されていません。                |
| `'error'`     | `undefined`       | ローダーの読み込みがエラーになりました。                                         |
| `'loading'`   | `undefined`       | `params` 値の変更の結果としてローダーが実行中です。            |
| `'reloading'` | 前の値    | リソースの `reload` メソッドの呼び出しの結果としてローダーが実行中です。 |
| `'resolved'`  | 解決された値    | ローダーが完了しました。                                                    |
| `'local'`     | ローカルに設定された値 | リソースの値が `.set()` または `.update()` を介してローカルに設定されています。        |

この状態情報を使用して、ローディングインジケーターやエラーメッセージなどのユーザーインターフェース要素を条件付きで表示できます。

## `httpResource` を使用したリアクティブデータ取得

[`httpResource`](/guide/http/http-resource) は `HttpClient` のラッパーで、リクエストの状態とレスポンスをシグナルとして提供します。これはインターセプターを含むAngular HTTPスタックを通してHTTPリクエストを行います。
