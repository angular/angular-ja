# インジェクションコンテキスト

依存性の注入 (DI) システムは、現在のインジェクターが使用可能なランタイムコンテキストに、内部的に依存します。
つまり、インジェクターはこのコンテキストでコードが実行される場合にのみ、機能します。

インジェクションコンテキストは、次のような場合に利用可能です。

* `@Injectable`や`@Component`など、DIシステムによってインスタンス化されるクラスの（`constructor`を介した）構築
* このようなクラスのフィールドの初期化子内
* `Provider`または`@Injectable`の`useFactory`に指定されたファクトリ関数内
* `InjectionToken`に指定された`factory`関数内
* インジェクションコンテキストで実行されるスタックフレーム内

どのような時にインジェクションコンテキスト内にいるかを知ることで、[`inject`](api/core/inject)関数を使用してインスタンスを注入できるようになります。

## クラスコンストラクター

DIシステムはクラスをインスタンス化するたびに、インジェクションコンテキストでインスタンス化を行います。これはフレームワーク自体によって処理されます。クラスのコンストラクターはそのランタイムコンテキストで実行されるため、[`inject`](api/core/inject)関数を使用してトークンを注入できます。

<code-example language="typescript">
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // コンテキスト内

  constructor() {
    this.service1 = inject(HeroService) // コンテキスト内
  }
}
</code-example>

## コンテキスト内のスタックフレーム

一部のAPIは、インジェクションコンテキストで実行されるように設計されています。これは、たとえばルーターガードの場合に当てはまります。これにより、[`inject`](api/core/inject)関数を使用して、ガード関数内でサービスにアクセスできるようになります。

`CanActivateFn`の場合の例
<code-example format="typescript" language="typescript">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</code-example>

## インジェクションコンテキスト内で実行する

インジェクションコンテキストに属さない特定の関数を、インジェクションコンテキスト内で実行したい場合は、`runInInjectionContext`を使用して実行できます。
これには、たとえば`EnvironmentInjector`などの特定のインジェクターにアクセスできる必要があります。

<code-example path="dependency-injection/src/app/heroes/hero.service.5.ts" region="run-in-context" header="src/app/heroes/hero.service.ts">
</code-example>

`inject`は、インジェクターが必要なトークンを解決できる場合にのみインスタンスを返すことに注意してください。

## コンテキストの検証

Angularは、現在のコンテキストがインジェクションコンテキストであることを検証するための`assertInInjectionContext`ヘルパー関数を提供します。

## コンテキスト外でのDIの使用

インジェクションコンテキストの外で、[`inject`](api/core/inject)や`assertInInjectionContext`を呼び出した場合、[error NG0203](/errors/NG0203)がスローされます。



@reviewed 2023-04-11
