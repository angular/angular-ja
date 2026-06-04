# サービスの作成と使用

サービスは、Angularアプリケーション全体で共有できる再利用可能なコードです。一般的に、複数のコンポーネントがアクセスする必要のあるデータ取得、ビジネスロジック、またはその他の機能を扱うために使用します。

## サービスの作成 {#creating-a-service}

次のコマンドで[Angular CLI](tools/cli)を使ってサービスを作成できます。

```bash
ng generate service CUSTOM_NAME
```

このコマンドにより、`src`ディレクトリに専用の`CUSTOM_NAME.ts`ファイルが作成されます。

TypeScriptクラスに`@Injectable()`デコレーターを追加して、手動でサービスを作成する方法もあります。これにより、そのクラスを注入可能な依存性として使用できることがAngularに伝播します。

次の例では、ユーザーがデータを追加したり取得したりできるサービスを定義しています。

```ts
// 📄 src/app/basic-data-store.ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
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
import {inject, Injectable} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Injectable({
  providedIn: 'root',
})
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
