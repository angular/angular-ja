# モジュールの共有

共有モジュールを作成すると、コードを整理し簡素化することができます。
共通で使用されるディレクティブ、パイプ、コンポーネントを1つのモジュールに配置し、
必要に応じてそのモジュールをアプリケーションの他の部分でインポートすることができます。

想像上のアプリケーションから次のようなモジュールを考えてみましょう:


```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import { NewItemDirective } from './new-item.directive';
import { OrdersPipe } from './orders.pipe';

@NgModule({
 imports:      [ CommonModule ],
 declarations: [ CustomerComponent, NewItemDirective, OrdersPipe ],
 exports:      [ CustomerComponent, NewItemDirective, OrdersPipe,
                 CommonModule, FormsModule ]
})
export class SharedModule { }
```

次の点に注目してください:

* モジュールのコンポーネントはAngularが共通部品として提供しているディレクティブを必要とするため、`CommonModule`をインポートしています。
* 便利なパイプ、ディレクティブ、コンポーネントのクラスを宣言し、エクスポートしています。
* `CommonModule`と`FormsModule`を再エクスポートしています。

`CommonModule`と`FormsModule`を再エクスポートすることによって、
この`SharedModule`をインポートする他のモジュールは、`CommonModule`から`NgIf`や`NgFor`のようなディレクティブにアクセスしたり、
`FormsModule`のディレクティブである`[(ngModel)]`をコンポーネントのプロパティにバインドしたりできます。

`SharedModule`で宣言されたコンポーネントは`[(ngModel)]`をバインドしていないかもしれず、
`SharedModule`は`FormsModule`をインポートする必要はないかもしれません。
それでも、`SharedModule`の`imports`配列に追加することなく`FormsModule`をエクスポートすることができます。
このようにすることで、
`@NgModule`デコレーターに直接インポートすることなく、
他のモジュールが`FormsModule`へアクセスできるようになります。

## NgModuleのさらに詳しい情報

あなたはこちらにも興味があるかもしれません:
* [プロバイダー](guide/providers)
* [フィーチャーモジュールの種類](guide/module-types)
