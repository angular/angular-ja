# 注入コンテキスト

依存性の注入 (DI) システムは、内部的に現在のインジェクターが利用可能なランタイムコンテキストに依存しています。
これは、インジェクターは、このようなコンテキストでコードが実行される場合にのみ動作することを意味します。

注入コンテキストは、次の状況で使用できます。

* DIシステムによってインスタンス化されるクラス（`@Injectable` または `@Component` など）の構築（`constructor` を使用）中。
* このようなクラスのフィールドのイニシャライザー。
* `Provider` または `@Injectable` の `useFactory` に指定されたファクトリー関数。
* `InjectionToken` に指定された `factory` 関数。
* 注入コンテキストで実行されるスタックフレーム内。

注入コンテキストにいるかどうかを知ることで、[`inject`](api/core/inject) 関数を使用してインスタンスを注入できます。

## クラスコンストラクター

DIシステムがクラスをインスタンス化するたびに、注入コンテキスト内でインスタンス化されます。これは、フレームワーク自体によって処理されます。クラスのコンストラクターは、そのランタイムコンテキストで実行され、これにより [`inject`](api/core/inject) 関数を使用してトークンを注入できます。

<docs-code language="typescript" highlight="[[3],[6]]">
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // コンテキスト内

  constructor() {
    this.service1 = inject(Service1) // コンテキスト内
  }
}
</docs-code>

## コンテキスト内のスタックフレーム

一部のAPIは、注入コンテキストで実行されるように設計されています。これは、たとえば、ルーターガードの場合です。これにより、ガード関数内で [`inject`](api/core/inject) を使用してサービスにアクセスできます。

`CanActivateFn` の例を次に示します。

<docs-code language="typescript" highlight="[3]">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</docs-code>

## 注入コンテキスト内で実行する

すでに注入コンテキスト内にいない状態で、特定の関数を注入コンテキスト内で実行したい場合は、`runInInjectionContext` を使用できます。
これには、たとえば `EnvironmentInjector` のような特定のインジェクターへのアクセスが必要です。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[9]">
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
</docs-code>

`inject` は、インジェクターが要求されたトークンを解決できる場合にのみインスタンスを返します。

## コンテキストのアサート

Angularは、現在のコンテキストが注入コンテキストであることをアサートするための `assertInInjectionContext` ヘルパー関数を提供します。

## コンテキスト外での DI の使用

注入コンテキスト外で [`inject`](api/core/inject) を呼び出したり、`assertInInjectionContext` を呼び出したりすると、[エラー NG0203](/errors/NG0203) がスローされます。
