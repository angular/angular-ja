<docs-decorative-header title="依存性の注入" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
コードを再利用し、アプリケーションとテストの振る舞いを制御します。
</docs-decorative-header>

コンポーネント間でロジックを共有する必要がある場合、Angularは[依存性の注入](guide/di)の設計パターンを活用します。これにより、「サービス」を作成できます。サービスを使用すると、コードをコンポーネントに注入しながら、信頼できる唯一の情報源から管理できます。

## サービスとは？

サービスは、注入できる再利用可能なコードの断片です。

コンポーネントの定義と同様に、サービスは以下で構成されます。

- `@Injectable`を使用してクラスをAngularサービスとして宣言する**TypeScriptデコレーター**。`providedIn`プロパティ（通常は`'root'`）を使用して、サービスにアクセスできるアプリケーションのどの部分かを定義できます。これにより、サービスをアプリケーション内のどこからでもアクセスできます。
- サービスが注入されたときにアクセスできる目的のコードを定義する**TypeScriptクラス**

以下は、`Calculator`サービスの例です。

```angular-ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Calculator {
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

```angular-ts
import { Component, inject } from '@angular/core';
import { Calculator } from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})

export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

この例では、`Calculator`は、Angularの関数`inject`を呼び出してサービスを渡すことによって使用されています。

## 次のステップ

<docs-pill-row>
  <docs-pill title="基本概念の次のステップ" href="essentials/next-steps" />
  <docs-pill title="依存性の注入の詳細ガイド" href="guide/di" />
</docs-pill-row>
