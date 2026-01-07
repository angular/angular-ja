# 注入コンテキスト

依存性の注入 (DI) システムは、内部的に現在のインジェクターが利用可能なランタイムコンテキストに依存しています。

これは、インジェクターは、このようなコンテキストでコードが実行される場合にのみ動作することを意味します。

注入コンテキストは、次の状況で使用できます。

- DIシステムによってインスタンス化されるクラス（`@Injectable` または `@Component` など）の構築（`constructor` を使用）中。
- このようなクラスのフィールドのイニシャライザー。
- `Provider` または `@Injectable` の `useFactory` に指定されたファクトリー関数。
- `InjectionToken` に指定された `factory` 関数。
- 注入コンテキストで実行されるスタックフレーム内。

注入コンテキストにいるかどうかを知ることで、[`inject`](api/core/inject) 関数を使用してインスタンスを注入できます。

NOTE: クラスコンストラクターとフィールドイニシャライザーでの `inject()` の基本的な使用例については、[概要ガイド](/guide/di#where-can-inject-be-used)を参照してください。

## コンテキスト内のスタックフレーム

一部のAPIは、注入コンテキストで実行されるように設計されています。これは、たとえば、ルーターガードの場合です。これにより、ガード関数内で [`inject`](api/core/inject) を使用してサービスにアクセスできます。

`CanActivateFn` の例を次に示します。

```ts {highlight: [3]}
const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
};
```

## 注入コンテキスト内で実行する

すでに注入コンテキスト内にいない状態で、特定の関数を注入コンテキスト内で実行したい場合は、`runInInjectionContext` を使用できます。
これには、たとえば `EnvironmentInjector` のような特定のインジェクターへのアクセスが必要です。

```ts {highlight: [9], header"hero.service.ts"}
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // 注入されたサービスで必要な処理を行います
    });
  }
}
```

[`inject`](/api/core/inject) は、インジェクターが要求されたトークンを解決できる場合にのみインスタンスを返します。

## コンテキストのアサート

Angularは、現在のコンテキストが注入コンテキストであることをアサートし、そうでない場合は明確なエラーをスローするための `assertInInjectionContext` ヘルパー関数を提供します。呼び出し元の関数への参照を渡すと、エラーメッセージが正しいAPIエントリーポイントを指し示すようになります。これにより、デフォルトの汎用的な注入エラーよりも明確で実用的なメッセージが生成されます。

```ts
import {ElementRef, assertInInjectionContext, inject} from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
  assertInInjectionContext(injectNativeElement);
  return inject(ElementRef).nativeElement;
}
```

このヘルパーは、**注入コンテキスト内から**（コンストラクター、フィールドイニシャライザー、プロバイダーファクトリー、または `runInInjectionContext` 経由で実行されるコード）呼び出すことができます。

```ts
import {Component, inject} from '@angular/core';
import {injectNativeElement} from './dom-helpers';

@Component({
  /* … */
})
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // フィールドイニシャライザーは注入コンテキスト内で実行されます。

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // 失敗: 注入コンテキスト外で実行されます。
  }
}
```

## コンテキスト外での DI の使用

注入コンテキスト外で [`inject`](api/core/inject) を呼び出したり、`assertInInjectionContext` を呼び出したりすると、[エラー NG0203](/errors/NG0203) がスローされます。
