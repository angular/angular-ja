<docs-decorative-header title="コードの共有" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
依存性の注入を使用するとコードを共有できます。
</docs-decorative-header>

コンポーネント間でロジックを共有する必要がある場合、Angularは[依存性の注入](guide/di)の設計パターンを活用します。これにより、「サービス」を作成できます。サービスを使用すると、コードをコンポーネントに注入しながら、信頼できる唯一の情報源から管理できます。

## サービスとは

サービスは、注入できる再利用可能なコードの断片です。

コンポーネントの定義と同様に、サービスは以下で構成されます。

- `@Injectable`を使用してクラスをAngularサービスとして宣言する**TypeScriptデコレーター**。`providedIn`プロパティ（通常は`'root'`）を使用して、サービスにアクセスできるアプリケーションのどの部分かを定義できます。これにより、サービスをアプリケーション内のどこからでもアクセスできます。
- サービスが注入されたときにアクセスできる目的のコードを定義する**TypeScriptクラス**

以下は、`Calculator`サービスの例です。

```ts
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## サービスの使用方法

コンポーネントでサービスを使用する場合は、次の手順を実行する必要があります。

1. サービスをインポートする
2. サービスが注入されるクラスフィールドを宣言します。クラスフィールドを、サービスを作成する組み込み関数`inject`の呼び出しの結果に割り当てます。

以下は、`Receipt`コンポーネントでの例です。

```ts
import { Component, inject } from '@angular/core';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-receipt',
  template: `<h1>合計金額は {{ totalCost }}</h1>`,
})

export class Receipt {
  private calculatorService = inject(CalculatorService);
  totalCost = this.calculatorService.add(50, 25);
}
```

この例では、`CalculatorService`は、Angular関数`inject`を呼び出してサービスを渡すことによって使用されています。

## 次のステップ

<docs-pill-row>
  <docs-pill title="基本要素の次のステップ" href="essentials/next-steps" />
</docs-pill-row>
