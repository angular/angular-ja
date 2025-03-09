# 双方向バインディング

**双方向バインディング**は、要素に値をバインドすると同時に、その要素が変更をバインディングを通じて伝播できるようにする、簡潔な方法です。

## 構文

双方向バインディングの構文は、角括弧`[]`と丸括弧`()`を組み合わせた`[()]`です。これはプロパティバインディングの構文`[]`とイベントバインディングの構文`()`を組み合わせたものです。Angularコミュニティでは、この構文を非公式に「バナナインボックス」と呼んでいます。

## フォームコントロールでの双方向バインディング

開発者は、ユーザーがコントロールを操作したときに、コンポーネントデータとフォームコントロールを同期させるため、双方向バインディングを頻繁に使用します。例えば、ユーザーがテキスト入力に入力すると、コンポーネントの状態が更新されます。

次の例では、ページの`firstName`属性が動的に更新されます。

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `
})
export class AppComponent {
  firstName = 'Ada';
}
```

ネイティブフォームコントロールで双方向バインディングを使用するには、次の手順を実行する必要があります。

1. `@angular/forms`から`FormsModule`をインポートする
2. 双方向バインディング構文（例：`[(ngModel)]`）で`ngModel`ディレクティブを使用する
3. 更新する状態（例：`firstName`）を割り当てる

これらが設定されると、Angularはテキスト入力の更新がコンポーネントの状態に正しく反映されるようにします。

[`NgModel`](guide/directives#displaying-and-updating-properties-with-ngmodel)の詳細については、公式ドキュメントを参照してください。

## コンポーネント間の双方向バインディング

親コンポーネントと子コンポーネント間の双方向バインディングを活用するには、フォーム要素と比較して、より多くの設定が必要です。

ここでは、`AppComponent`が初期カウント状態を設定しますが、カウンターのUIを更新およびレンダリングするためのロジックは、主にその子である`CounterComponent`にある例を示します。

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

### コンポーネント間の双方向バインディングを有効にする

上記の例をコアに分解すると、コンポーネントの双方向バインディングごとに、次のものが必要です。

子コンポーネントは`model`プロパティを含んでいる必要があります。

これは簡略化された例です。

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({ // Omitted for brevity })
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

親コンポーネントには、次のものが必要です。

1. `model`プロパティ名を双方向バインディング構文で囲む。
2. プロパティまたはシグナルを`model`プロパティに割り当てる。

これは簡略化された例です。

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```
