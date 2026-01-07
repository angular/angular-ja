# 初めてのシグナルの作成と更新

Angularシグナルチュートリアルへようこそ！[シグナル](/essentials/signals)は、状態を管理し、その状態が変化したときにUIを自動的に更新する方法を提供するAngularのリアクティブプリミティブです。

このアクティビティでは、以下の方法を学びます。

- `signal()`関数を使用して初めてのシグナルを作成する
- テンプレートでその値を表示する
- `set()`および`update()`メソッドを使用してシグナル値を更新する

シグナルを使ってインタラクティブなユーザー状態システムを構築しましょう！

<hr />

<docs-workflow>

<docs-step title="signal関数をインポートする">
コンポーネントファイルの先頭で、`@angular/core`から`signal`関数をインポートします。

```ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="コンポーネントでシグナルを作成する">
コンポーネントクラスに、`'offline'`の値で初期化される`userStatus`シグナルを追加します。

```ts
@Component({
  /* Config omitted */
})
export class App {
  userStatus = signal<'online' | 'offline'>('offline');
}
```

</docs-step>

<docs-step title="テンプレートでシグナル値を表示する">
現在のユーザー状態を表示するようにステータスインジケーターを更新します。
1. `[class]="userStatus()"`を使用してシグナルをclass属性にバインドする
2. `???`を`{{ userStatus() }}`に置き換えてステータステキストを表示する

```angular-html
<!-- Update from: -->
<div class="status-indicator offline">
  <span class="status-dot"></span>
  Status: ???
</div>

<!-- To: -->
<div class="status-indicator" [class]="userStatus()">
  <span class="status-dot"></span>
  Status: {{ userStatus() }}
</div>
```

シグナル`userStatus()`を括弧付きで呼び出してその値を読み取る方法に注目してください。
</docs-step>

<docs-step title="シグナルを更新するメソッドを追加する">
コンポーネントに、`set()`メソッドを使用してユーザー状態を変更するメソッドを追加します。

```ts
goOnline() {
  this.userStatus.set('online');
}

goOffline() {
  this.userStatus.set('offline');
}
```

`set()`メソッドは、シグナルの値を新しい値で完全に置き換えます。

</docs-step>

<docs-step title="コントロールボタンを接続する">
ボタンはすでにテンプレートにあります。次に、以下を追加してメソッドに接続します。
1. `(click)`によるクリックハンドラー
2. すでにその状態である場合の`[disabled]`による無効状態

```html
<!-- Add bindings to the existing buttons: -->
<button (click)="goOnline()" [disabled]="userStatus() === 'online'">Go Online</button>
<button (click)="goOffline()" [disabled]="userStatus() === 'offline'">Go Offline</button>
```

</docs-step>

<docs-step title="update()を使用したトグルメソッドを追加する">
オンラインとオフラインを切り替える`toggleStatus()`メソッドを`update()`メソッドを使用して追加します。

```ts
toggleStatus() {
  this.userStatus.update(current => current === 'online' ? 'offline' : 'online');
}
```

`update()`メソッドは、現在の値を受け取り、新しい値を返す関数を取ります。これは、現在の状態に基づいて既存の値を変更する必要がある場合に便利です。

</docs-step>

<docs-step title="トグルボタンハンドラーを追加する">
トグルボタンはすでにテンプレートにあります。それを`toggleStatus()`メソッドに接続します。

```html
<button (click)="toggleStatus()" class="toggle-btn">Toggle Status</button>
```

</docs-step>

</docs-workflow>

おめでとうございます！初めてのシグナルを作成し、`set()`と`update()`の両方のメソッドを使用して更新する方法を学びました。`signal()`関数は、Angularが追跡するリアクティブな値を作成し、それを更新すると、UIが自動的に変更を反映します。

次に、[computedを使用してシグナルから状態を派生させる方法](/tutorials/signals/2-deriving-state-with-computed-signals)を学びます！

<docs-callout helpful title="ChangeDetectionStrategy.OnPushについて">

このチュートリアル全体で、コンポーネントデコレーターに`ChangeDetectionStrategy.OnPush`があることに気づくかもしれません。これは、シグナルを使用するAngularコンポーネントのパフォーマンス最適化です。今のところ、これは安全に無視して構いません。シグナルを使用する際にアプリケーションの実行を高速化するのに役立つとだけ知っておいてください！詳細については、[変更検知戦略APIドキュメント](/api/core/ChangeDetectionStrategy)を参照してください。

</docs-callout>
