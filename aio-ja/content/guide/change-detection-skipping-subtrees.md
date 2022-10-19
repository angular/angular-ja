# コンポーネントサブツリーのスキップ

JavaScript はデフォルトで、複数の異なるコンポーネントから参照できるミュータブルなデータ構造を使用します。 Angular はコンポーネントツリー全体で変更検知を実行し、データ構造の最新の状態が DOM に反映されるようにします。

ほとんどのアプリケーションでは、変更検知は十分に高速です。 ただし、アプリケーションに特に大きなコンポーネントツリーがある場合、アプリケーション全体で変更検知を実行すると、パフォーマンスの問題が発生する可能性があります。 コンポーネントツリーのサブセットでのみ実行するように変更検知を構成することで、これに対処できます。

アプリケーションの一部が状態変化の影響を受けていないことが確実な場合は、[OnPush](https://angular.io/api/core/ChangeDetectionStrategy) を使用してコンポーネントサブツリー全体の変更検知をスキップできます。


## OnPushの使用

OnPush 変更検知は、次の場合に **のみ** コンポーネントサブツリーの変更検知を実行するように Angular に指示します。
* サブツリーのルートコンポーネントが、テンプレートバインディングの結果として新しい入力を受け取る場合。 Angular は、入力の現在値と過去値を `==` で比較します。
* サブツリーのルートコンポーネントまたはその子のいずれかでイベント _(たとえば、イベントバインディング、出力バインディング、または `@HostListener` を使用して)_ を処理する場合。Angular は、OnPush 変更検知を使用しているかどうかにかかわらず、これを処理します。

`@Component` デコレーターで、コンポーネントの変更検知戦略を `OnPush` に設定できます。

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

## 一般的な変更検知シナリオ

このセクションでは、いくつかの一般的な変更検知シナリオを調べて、Angular の動作を説明します。

## イベントがデフォルトの変更検知を備えたコンポーネントによって処理される場合

Angular が `OnPush` 戦略なしでコンポーネント内のイベントを処理する場合、フレームワークはコンポーネントツリー全体で変更検知を実行します。 Angular は、 `OnPush` を使用し、新しい入力を受け取っていない親をもつ子孫コンポーネントサブツリーをスキップします。

例として、`MainComponent` の変更検知戦略を `OnPush` に設定し、ユーザーがルートに `MainComponent` をもつサブツリーの外部のコンポーネントと対話する場合、Angular は次の図のすべての緑色のコンポーネント (`AppComponent`、`HeaderComponent`、`SearchComponent`、`ButtonComponent`) をチェックします。 `MainComponent` は新しい入力を受け取ります。

<div class="lightbox">
  <img alt="非 OnPush コンポーネントからの変更検出の伝達" src="generated/images/guide/change-detection/event-trigger.svg">
</div>

## イベントがOnPushをもつコンポーネントによって処理される場合

Angular が OnPush 戦略を使用してコンポーネント内のイベントを処理する場合、フレームワークはコンポーネントツリー全体で変更検知を実行します。 Angular は、新しい入力を受け取っておらず、イベントを処理したコンポーネントの外部にある、OnPush を使用するルートをもつコンポーネントサブツリーを無視します。

例として、Angular が `MainComponent` 内のイベントを処理する場合、フレームワークはコンポーネントツリー全体で変更検知を実行します。 `OnPush` があり、イベントがそのスコープ外で発生したため、Angular はルート `LoginComponent` をもつサブツリーを無視します。

<div class="lightbox">
  <img alt="OnPush コンポーネントからの変更検出の伝達" src="generated/images/guide/change-detection/on-push-trigger.svg">
</div>

## イベントがOnPushをもつコンポーネントの子孫によって処理される場合

Angular が OnPush を使用してコンポーネント内のイベントを処理する場合、フレームワークは、コンポーネントの祖先を含むコンポーネントツリー全体で変更検知を実行します。

例として、次の図では、Angular は OnPush を使用する `LoginComponent` でイベントを処理します。 `MainComponent` にも `OnPush` がありますが、Angular は `MainComponent` (`LoginComponent` の親) を含むコンポーネントサブツリー全体で変更検知を呼び出します。 `LoginComponent` はそのビューの一部であるため、Angular は `MainComponent` もチェックします。

<div class="lightbox">
  <img alt="ネストされた OnPush コンポーネントからの変更検出の伝達" src="generated/images/guide/change-detection/leaf-trigger.svg">
</div>

## OnPush を使用したコンポーネントへの新しい入力

Angular は、テンプレートバインディングの結果として入力プロパティを設定する `OnPush` を使用して、子コンポーネント内で変更検知を実行します。

たとえば、次の図では、`AppComponent` は `OnPush` をもつ `MainComponent` に新しい入力を渡します。 Angular は `MainComponent` で変更検知を実行しますが、新しい入力も受信しない限り、`OnPush` をもつ `LoginComponent` では変更検知を実行しません。

<div class="lightbox">
  <img alt="新しい入力を受け取る OnPush コンポーネントによる変更検出の伝達" src="generated/images/guide/change-detection/on-push-input.svg">
</div>

## エッジケース

* **TypeScript コード中で入力プロパティを変更する場合**。 `@ViewChild` や `@ContentChild` などの API を使用して TypeScript 中でコンポーネントへの参照を取得し、`@Input` プロパティを手動で変更すると、Angular は OnPush コンポーネントの変更検知を自動的に実行しません。 Angular で変更検知を実行する必要がある場合は、コンポーネントに `ChangeDetectorRef` を注入し、`changeDetectorRef.markForCheck()` を呼び出すことで、変更検知をスケジュールするように Angular に指示できます。
* **オブジェクトの参照を変更する場合**。 入力がミュータブルなオブジェクトを値として受け取り、オブジェクトを変更しても参照を保持する場合、Angular は変更検知を呼び出しません。 入力ポイントの以前の値と現在の値が同じ参照を指すことになるため、これは期待どおりの動作です。

@reviewed 2022-05-04
