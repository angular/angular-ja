# サービスの作成と使用

サービスは、Angularアプリケーション全体で共有できる再利用可能なコードです。一般的に、複数のコンポーネントがアクセスする必要のあるデータ取得、ビジネスロジック、またはその他の機能を扱うために使用します。

## サービスの作成 {#creating-a-service}

次のコマンドで[Angular CLI](tools/cli)を使ってサービスを作成できます。

```bash
ng generate service CUSTOM_NAME
```

このコマンドにより、`src`ディレクトリに専用の`CUSTOM_NAME.ts`ファイルが作成されます。

TypeScriptクラスに`@Service()`デコレーターを追加して、手動でサービスを作成する方法もあります。これにより、そのクラスを注入可能な依存性として使用できることがAngularに伝播します。

次の例では、ユーザーがデータを追加したり取得したりできるサービスを定義しています。

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## サービスが利用可能になる仕組み {#how-services-become-available}

サービスで`@Injectable({ providedIn: 'root' })`を使用すると、Angularは次のことを行います:

- **アプリケーション全体で単一のインスタンス** (シングルトン) を作成します
- **アプリケーション全体で利用可能**にします (追加の設定は不要です)
- **ツリーシェイキングを有効にし**、実際に使用される場合にのみAngularがJavaScriptバンドルにサービスを含めるようにします

これは、ほとんどのサービスで推奨されるアプローチです。

## Using the `@Service` decorator {#using-the-service-decorator}

For the common case of a singleton service available throughout your application, Angular provides the `@Service` decorator as a more ergonomic alternative to `@Injectable({providedIn: 'root'})`.

The earlier `BasicDataStore` example can be rewritten with `@Service`:

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

This behaves the same as the `@Injectable({providedIn: 'root'})` version above: Angular creates a single instance, makes it available everywhere, and tree-shakes it from the bundle if it is never injected.

### Replacing the implementation with a factory {#replacing-the-implementation-with-a-factory}

If you need to control how the singleton is created, for example, to swap in a different implementation depending on the environment, pass a `factory` function.

The factory runs in an [injection context](guide/di/dependency-injection-context), so you can use [`inject()`](api/core/inject) inside it to read other dependencies.

The following `Analytics` service is a no-op locally so events don't pollute the console during development. In production, the factory reads an `ANALYTICS_ENABLED` token and returns a `GoogleAnalytics` subclass that forwards events to the real tracker:

```ts {header: "src/app/analytics.ts"}
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // No-op by default.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Dispatches an analytics event to Google Analytics
  }
}
```

NOTE: The `factory` option replaces the `useClass`, `useValue`, `useExisting`, and `useFactory` options of `@Injectable`. If you need any of those, keep using `@Injectable`.

### Opting out of automatic provisioning {#opting-out-of-automatic-provisioning}

By default, `@Service` provides the class at the root injector. If you want to provide it manually, for example, to scope it to a specific route or component, set `autoProvided: false`:

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

You are then responsible for adding the service to a `providers` array, just like with a plain `@Injectable()`:

### When to use `@Service` vs `@Injectable` {#when-to-use-service-vs-injectable}

Reach for `@Service` when you are creating a new singleton class that uses `inject()` for its dependencies. Keep using `@Injectable` when you need any of the following:

- **Constructor-based dependency injection.** `@Service` only supports the [`inject()`](api/core/inject) function.
- **Advanced provider configuration** such as `useClass`, `useValue`, `useExisting`, or `useFactory`. `@Service` exposes a single `factory` option instead.
- **Non-root scopes** such as `providedIn: 'platform'`.

## サービスを注入する

`providedIn: 'root'`でサービスを作成すると、`@angular/core`の`inject()`関数を使ってアプリケーションのどこにでも注入できます。

### コンポーネントへの注入 {#injecting-into-a-component}

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### 別のサービスへの注入 {#injecting-into-another-service}

```ts
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## 次のステップ {#next-steps}

`providedIn: 'root'`はほとんどのユースケースをカバーしていますが、Angularは、より特殊なシナリオに向けてサービスを設定する追加の方法も提供しています:

- **コンポーネント固有のインスタンス** - コンポーネントが独自の独立したサービスインスタンスを必要とする場合
- **手動設定** - 実行時の設定が必要なサービス向け
- **ファクトリープロバイダー** - 実行時の条件に基づいて動的にサービスを作成するため
- **値プロバイダー** - 設定オブジェクトや定数を提供するため

これらの高度なパターンについての詳細は、次のガイドで学ぶことができます: [依存性プロバイダーの定義](/guide/di/defining-dependency-providers).
