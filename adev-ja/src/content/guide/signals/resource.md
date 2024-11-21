# 非同期リアクティビティとリソース

IMPORTANT: `resource`は[実験的](reference/releases#experimental)です。お試しいただけますが、安定版になる前に変更される可能性があります。

ほとんどのシグナルAPIは同期的です（`signal`、`computed`、`input`など）。しかし、アプリケーションは多くの場合、非同期的に利用可能なデータを処理する必要があります。`Resource`を使用すると、非同期データをアプリケーションのシグナルベースのコードに組み込むことができます。

`Resource`を使用してあらゆる種類の非同期処理を実行できますが、`Resource`の最も一般的なユースケースはサーバーからデータを取得することです。以下は、ユーザーデータを取得するためのリソースを作成する例です。

`Resource`を作成する最も簡単な方法は、`resource`関数を使用することです。

```typescript
import {resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // リアクティブなリクエスト計算を定義します。
  // リクエスト値は、読み取りシグナルが変更されるたびに再計算されます。
  request: () => ({id: userId()}),

  // データを取得する非同期ローダーを定義します。
  // リソースは、`request`値が変更されるたびにこの関数を呼び出します。
  loader: ({request}) => fetchUser(request),
});

// リソースのローダー関数の結果に基づいてcomputedを作成します。
const firstName = computed(() => userResource.value().firstName);
```

`resource`関数は、2つの主なプロパティである`request`と`loader`を持つ`ResourceOptions`オブジェクトを受け入れます。

`request`プロパティは、リクエスト値を生成するリアクティブな計算を定義します。この計算で読み取られるシグナルが変更されるたびに、リソースは新しいリクエスト値を生成します。これは`computed`と同様です。

`loader`プロパティは`ResourceLoader`を定義します。これは、状態を取得する非同期関数です。リソースは、`request`計算が新しい値を生成するたびにローダーを呼び出し、その値をローダーに渡します。詳細は下記の[Resourceローダー](#resource-loaders)を参照してください。

`Resource`には、ローダーの結果を含む`value`シグナルがあります。

## リソースローダー {#resource-loaders}

リソースを作成する際には、`ResourceLoader`を指定します。このローダーは、単一のパラメーター（`ResourceLoaderParams`オブジェクト）を受け入れ、値を返す非同期関数です。

`ResourceLoaderParams`オブジェクトには、`request`、`previous`、`abortSignal`の3つのプロパティが含まれています。

| プロパティ      | 説明                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`     | リソースの`request`計算の値。                                                                                               |
| `previous`    | `status`プロパティを含む、前の`ResourceStatus`を持つオブジェクト。                                                                    |
| `abortSignal` | [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。詳細は下記の[リクエストの中断](#aborting-requests)を参照してください。 |

### リクエストの中断 {#aborting-requests}

リソースが読み込み中の場合に`request`計算が変更されると、リソースは未処理のリクエストを中断します。

`ResourceLoaderParams`内の`abortSignal`を使用して、中断されたリクエストに応答できます。例えば、ネイティブの`fetch`関数は`AbortSignal`を受け入れます。

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  request: () => ({id: userId()}),
  loader: ({request, abortSignal}): Promise<User> => {
    // 与えられた`AbortSignal`がリクエストの中断を示している場合、
    // fetchは未処理のHTTPリクエストをキャンセルします。
    return fetch(`users/${request.id}`, {signal: abortSignal});
  },
});
```

`AbortSignal`によるリクエストのキャンセルについては、[`AbortSignal` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)を参照してください。

### 再読み込み {#reloading}

`reload`メソッドを呼び出すことで、プログラム的にリソースの`loader`をトリガーできます。

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  request: () => ({id: userId()}),
  loader: ({request}) => fetchUser(request),
});

// ...

userResource.reload();
```

### `undefined` リクエスト {#undefined-requests}

`undefined`のリクエスト値は、リソースがローダーを実行するのを防ぎ、リソースを`Idle`状態にします。

## リソースの状態

リソースオブジェクトには、非同期ローダーの状態を読み取るためのいくつかのシグナルプロパティがあります。

| プロパティ    | 説明                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `value`     | リソースの最新の値、または値が受信されていない場合は`undefined`。                            |
| `hasValue`  | リソースが値を持っているかどうか。                                                                               |
| `error`     | リソースのローダーの実行中に発生した最新のエラー、またはエラーが発生していない場合は`undefined`。 |
| `isLoading` | リソースローダーが現在実行中かどうか。                                                               |
| `status`    | 後述のリソースの特定の`ResourceStatus`。                                                   |

`status`シグナルは、リソースの状態を示す特定の`ResourceStatus`を提供します。

| ステータス      | `value()`         | 説明                                                                  |
| ----------- | :---------------- | ---------------------------------------------------------------------------- |
| `Idle`      | `undefined`       | リソースには有効なリクエストがなく、ローダーは実行されていません。                |
| `Error`     | `undefined`       | ローダーでエラーが発生しました。                                         |
| `Loading`   | `undefined`       | `request`値の変更の結果としてローダーが実行されています。           |
| `Reloading` | 以前の値    | リソースの`reload`メソッドの呼び出しの結果としてローダーが実行されています。 |
| `Resolved`  | 解決された値    | ローダーが完了しました。                                                    |
| `Local`     | ローカルに設定された値 | リソースの値は、`.set()`または`.update()`を介してローカルに設定されました。        |

この状態情報を使用して、ローディングインジケーターやエラーメッセージなどのユーザーインターフェース要素を条件付きで表示できます。
