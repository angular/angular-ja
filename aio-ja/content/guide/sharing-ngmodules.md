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

### 他のモジュールからコンポーネントまたはサービスを使用する

別のモジュールのコンポーネントを使用することと、別のモジュールのサービスを使用することの間には、重大な違いがあります。
ディレクティブ、パイプ、およびコンポーネントを使用したい場合はモジュールをインポートしてください。
サービスを含むモジュールをインポートするということは、そのサービスの新しいインスタンスを必要とすることです(通常はすでにあるサービスを再利用したい)。サービスのインスタンス化をコントロールする目的のためにモジュールのインポートを使用してください。

共有のサービスを保持するもっとも一般的な方法は、モジュールシステムではなく(モジュールをインポートすると新しいサービスのインスタンスが生成されますが、これは一般的な用途ではありません)、
Angularの[依存性の注入](guide/dependency-injection)を使用することです。

サービスの共有については[プロバイダー](guide/providers)を参照してください。


<hr />

## NgModuleのさらに詳しい情報

あなたはこちらにも興味があるかもしれません:
* [プロバイダー](guide/providers)
* [フィーチャーモジュールの種類](guide/module-types)
