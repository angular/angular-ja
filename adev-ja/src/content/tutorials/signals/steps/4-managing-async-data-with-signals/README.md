# Resources APIでシグナルを使った非同期データの管理

[リンクされたシグナルで状態を派生させる方法](/tutorials/signals/3-deriving-state-with-linked-signals)を学んだところで、Resource APIを使って非同期データを処理する方法を探ってみましょう。Resource APIは、組み込みのローディング状態、エラー処理、リクエスト管理を備え、シグナルを使って非同期操作を管理する強力な方法を提供します。

このアクティビティでは、`resource()`関数を使ってデータを非同期にロードする方法と、Resource APIの動作を示すユーザープロファイルローダーを構築することで、非同期操作のさまざまな状態を処理する方法を学びます。

<hr />

<docs-workflow>

<docs-step title="resource関数とAPIをインポートする" {#import-resource-function-and-api}>
既存のインポートに`resource`を追加し、フェイクAPI関数をインポートします。

```ts
// Add resource to existing imports
import {Component, signal, computed, resource, ChangeDetectionStrategy} from '@angular/core';
// Import mock API function
import {loadUser} from './user-api';
```

</docs-step>

<docs-step title="ユーザーデータ用のリソースを作成する" {#create-a-resource-for-user-data}>
ユーザーIDシグナルに基づいてユーザーデータをロードするリソースを作成するプロパティをコンポーネントクラスに追加します。

```ts
userId = signal(1);

userResource = resource({
  params: () => ({id: this.userId()}),
  loader: (params) => loadUser(params.params.id),
});
```

</docs-step>

<docs-step title="リソースと対話するメソッドを追加する" {#add-methods-to-interact-with-the-resource}>
ユーザーIDを変更し、リソースをリロードするメソッドを追加します。

```ts
loadUser(id: number) {
  this.userId.set(id);
}

reloadUser() {
  this.userResource.reload();
}
```

paramsシグナルを変更すると自動的にリロードがトリガーされます。または、`reload()`を使って手動でリロードできます。
</docs-step>

<docs-step title="リソースの状態用の算出シグナルを作成する" {#create-computed-signals-for-resource-states}>
リソースの異なる状態にアクセスするための算出シグナルを追加します。

```ts
isLoading = computed(() => this.userResource.status() === 'loading');
hasError = computed(() => this.userResource.status() === 'error');
```

リソースは、'loading'、'success'、または'error'になり得る`status()`シグナル、ロードされたデータ用の`value()`シグナル、そしてデータが利用可能かどうかを安全にチェックする`hasValue()`メソッドを提供します。
</docs-step>

<docs-step title="ボタンを接続し、リソースの状態を表示する" {#wire-up-the-buttons-and-display-resource-states}>
テンプレート構造はすでに提供されています。すべてを接続しましょう。

Part 1. **ボタンにクリックハンドラーを追加します。**

```html
<button (click)="loadUser(1)">Load User 1</button>
<button (click)="loadUser(2)">Load User 2</button>
<button (click)="loadUser(999)">Load Invalid User</button>
<button (click)="reloadUser()">Reload</button>
```

Part 2. **プレースホルダーをリソースの状態処理に置き換えます。**

```angular-html
@if (isLoading()) {
  <p>Loading user...</p>
} @else if (hasError()) {
  <p class="error">Error: {{ userResource.error()?.message }}</p>
} @else if (userResource.hasValue()) {
  <div class="user-info">
    <h3>{{ userResource.value().name }}</h3>
    <p>{{ userResource.value().email }}</p>
  </div>
}
```

リソースは、その状態をチェックするためのさまざまなメソッドを提供します。

- `isLoading()` - データフェッチ中にtrue
- `hasError()` - エラー発生時にtrue
- `userResource.hasValue()` - データが利用可能な場合にtrue
- `userResource.value()` - ロードされたデータにアクセス
- `userResource.error()` - エラー情報にアクセス

</docs-step>

</docs-workflow>

すばらしい！これでResource APIをシグナルと組み合わせて使う方法を学びました。覚えておくべき重要な概念は次のとおりです。

- **リソースはリアクティブです**: パラメータが変更されると自動的にリロードされます
- **組み込みの状態管理**: リソースは`status()`、`value()`、`error()`シグナルを提供します
- **自動クリーンアップ**: リソースはリクエストのキャンセルとクリーンアップを自動的に処理します
- **手動制御**: 必要に応じて手動でリロードしたり、リクエストを中止したりできます

次のレッスンでは、[入力シグナルでコンポーネントにデータを渡す方法](/tutorials/signals/5-component-communication-with-signals)を学びます！
