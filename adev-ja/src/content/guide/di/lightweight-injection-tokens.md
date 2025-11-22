# 軽量インジェクショントークンを使用したクライアントアプリケーションサイズの最適化

このページでは、ライブラリ開発者に推奨される依存性の注入テクニックの概要を概念的に説明します。
_軽量インジェクショントークン_ を使用してライブラリを設計すると、ライブラリを使用するクライアントアプリケーションのバンドルサイズを最適化できます。

ツリーシェイク可能なプロバイダーを使用することで、コンポーネントと注入可能なサービス間の依存関係の構造を管理してバンドルサイズを最適化できます。
通常、これにより、アプリケーションで実際に使用されていない提供されたコンポーネントまたはサービスが、コンパイラによってバンドルから削除されます。

Angularがインジェクショントークンを格納する方法により、使用されていないコンポーネントまたはサービスがバンドルに含まれてしまう場合があります。
このページでは、軽量なインジェクショントークンを使用することで適切なツリーシェイクをサポートする依存性の注入の設計パターンについて説明します。

軽量なインジェクショントークン設計パターンは、特にライブラリ開発者にとって重要です。
これにより、アプリケーションがライブラリの機能の一部のみを使用する場合、未使用のコードをクライアントのアプリケーションバンドルから削除できます。

アプリケーションがライブラリを使用する場合、ライブラリが提供するサービスの中には、クライアントアプリケーションで使用されないものがある場合があります。
この場合、アプリケーション開発者は、そのサービスがツリーシェイクされ、コンパイルされたアプリケーションのサイズに影響を与えないことを期待する必要があります。
アプリケーション開発者はライブラリのツリーシェイクの問題を認識したり、修正したりできないため、ライブラリ開発者の責任となります。
未使用のコンポーネントの保持を防ぐため、ライブラリでは軽量インジェクショントークン設計パターンを使用する必要があります。

## トークンが保持される場合

トークン保持が発生する状況をより明確に説明するために、ライブラリカードコンポーネントを提供するライブラリを検討してください。
このコンポーネントには本体が含まれており、オプションでヘッダーを含めることができます。

<docs-code language="html">

<lib-card>;
<lib-header>…</lib-header>;
</lib-card>;

</docs-code>

一般的な実装では、 `<lib-card>` コンポーネントは、次の例のように `@ContentChild()` または `@ContentChildren()` を使用して `<lib-header>` と `<lib-body>` を取得します。

```ts {highlight: [14]}
import {Component, ContentChild} from '@angular/core';

@Component({
  selector: 'lib-header',
  …,
})
class LibHeaderComponent {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCardComponent {
  @ContentChild(LibHeaderComponent) header: LibHeaderComponent | null = null;
}
```

`<lib-header>` はオプションなので、要素はテンプレートに最小限の形式 `<lib-card></lib-card>` で表示できます。
この場合、 `<lib-header>` は使用されず、ツリーシェイクされることを期待しますが、実際にはそうなりません。
これは、 `LibCardComponent` には `LibHeaderComponent` への参照が2つあるためです。

```ts
@ContentChild(LibHeaderComponent) header: LibHeaderComponent;
```

- これらの参照の1つは _型の位置_ にあります。つまり、 `LibHeaderComponent` を型として指定します: `header: LibHeaderComponent;`。
- もう1つの参照は _値の位置_ にあります。つまり、LibHeaderComponentは `@ContentChild()` パラメータデコレーターの値です: `@ContentChild(LibHeaderComponent)`。

コンパイラはこれらの位置にあるトークン参照を異なる方法で処理します。

- コンパイラは、TypeScriptから変換した後の _型の位置_ の参照を消去するため、ツリーシェイクには影響しません。
- コンパイラは、_値の位置_ の参照をランタイムに保持する必要があり、これが**妨げます** コンポーネントがツリーシェイクされること。

この例では、コンパイラは値位置にある `LibHeaderComponent` トークンを保持します。
これにより、アプリケーションで実際に `<lib-header>` をどこでも使用していない場合でも、参照されるコンポーネントがツリーシェイクされることがなくなります。
`LibHeaderComponent` のコード、テンプレート、スタイルを組み合わせると大きくなりすぎるため、不要に含めるとクライアントアプリケーションのサイズが大幅に増加する可能性があります。

## 軽量インジェクショントークンパターンを使用する場合

ツリーシェイクの問題は、コンポーネントがインジェクショントークンとして使用されると発生します。
これは次の2つのケースで発生します。

- トークンは、[コンテンツクエリ](guide/components/queries#content-queries)で値の位置で使用されます。
- トークンは、コンストラクター注入の型指定子として使用されます。

次の例では、 `OtherComponent` トークンの両方の使用により、 `OtherComponent` が保持され、使用されていない場合にツリーシェイクされることがなくなります。

```ts {highlight: [[2],[4]]}
class MyComponent {
  constructor(@Optional() other: OtherComponent) {}

  @ContentChild(OtherComponent) other: OtherComponent | null;
}
```

型指定子としてのみ使用されるトークンは、JavaScriptに変換されると削除されますが、依存性の注入に使用されるすべてのトークンはランタイムで必要です。
これらは実質的に `constructor(@Optional() other: OtherComponent)` を `constructor(@Optional() @Inject(OtherComponent) other)` に変更されます。
トークンはこれで値位置にあるため、ツリーシェーカーは参照を保持します。

HELPFUL: ライブラリは、[ツリーシェイク可能なプロバイダー](guide/di/dependency-injection#providing-dependency) をすべてのサービスに使用し、コンポーネントやモジュールではなく、ルートレベルで依存関係を提供する必要があります。

## 軽量インジェクショントークンの使用

軽量インジェクショントークン設計パターンは、小さな抽象クラスをインジェクショントークンとして使用し、後で実際のインプリメンテーションを提供します。
抽象クラスは保持され、ツリーシェイクされませんが、小さく、アプリケーションのサイズにはほとんど影響を与えません。

次の例は、 `LibHeaderComponent` でどのように機能するかを示しています。

```ts {highlight: [[1],[5], [15]]}
abstract class LibHeaderToken {}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeaderComponent}],
  …,
})
class LibHeaderComponent extends LibHeaderToken {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCardComponent {
  @ContentChild(LibHeaderToken) header: LibHeaderToken | null = null;
}
```

この例では、 `LibCardComponent` 実装は、型位置と値位置のいずれでも `LibHeaderComponent` を参照しなくなりました。
これにより、 `LibHeaderComponent` の完全なツリーシェイクが可能になります。
`LibHeaderToken` は保持されますが、具体的なインプリメンテーションのないクラス宣言に過ぎません。
小さく、コンパイル後に保持されてもアプリケーションのサイズにはほとんど影響を与えません。

代わりに、 `LibHeaderComponent` 自体が抽象 `LibHeaderToken` クラスを実装します。
このトークンをコンポーネント定義のプロバイダーとして安全に使用することで、Angularは具体的な型を正しく注入できます。

要約すると、軽量インジェクショントークンパターンは次のとおりです。

1. 抽象クラスとして表される軽量なインジェクショントークン。
2. 抽象クラスを実装するコンポーネント定義。
3. `@ContentChild()` または `@ContentChildren()` を使用した軽量なパターンの注入。
4. 軽量なインジェクショントークンを実装するプロバイダーであり、軽量インジェクショントークンを実装に関連付けます。

### API 定義に軽量インジェクショントークンを使用する

軽量インジェクショントークンを注入するコンポーネントは、注入されたクラスのメソッドを呼び出す必要がある場合があります。
トークンはこれで抽象クラスです。注入可能コンポーネントはそのクラスを実装するため、軽量インジェクショントークンの抽象クラスに抽象メソッドも宣言する必要があります。
メソッドの実装とそのすべてのコードオーバーヘッドは、ツリーシェイク可能な注入可能コンポーネントに存在します。
これにより、親は、存在する場合、子と型安全な方法で通信できます。

たとえば、 `LibCardComponent` はこれで `LibHeaderComponent` ではなく `LibHeaderToken` をクエリします。
次の例は、パターンにより `LibCardComponent` が `LibHeaderComponent` を実際に参照せずに `LibHeaderComponent` と通信する方法を示しています。

```ts {highlight: [[2],[9],[11],[19]]}
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeaderComponent}],
})
class LibHeaderComponent extends LibHeaderToken {
  doSomething(): void {
    // Concrete implementation of `doSomething`
  }
}

@Component({
  selector: 'lib-card',
})
class LibCardComponent implements AfterContentInit {
  @ContentChild(LibHeaderToken) header: LibHeaderToken | null = null;

  ngAfterContentInit(): void {
    if (this.header !== null) {
      this.header?.doSomething();
    }
  }
}
```

この例では、親はトークンをクエリして子コンポーネントを取得し、存在する場合、結果のコンポーネント参照を保存します。
子コンポーネントのメソッドを呼び出す前に、親コンポーネントは子コンポーネントが存在するかどうかを確認します。
子コンポーネントがツリーシェイクされている場合、子コンポーネントへのランタイム参照はありません。メソッドも呼び出されません。

### 軽量インジェクショントークンの名前付け

軽量インジェクショントークンは、コンポーネントでのみ役立ちます。
Angularスタイルガイドでは、コンポーネントに "Component" サフィックスを使用して名前を付けることを推奨しています。
例 "LibHeaderComponent" はこの規則に従っています。

コンポーネントとそのトークン間の関係を維持しながら、両者を区別する必要があります。
推奨されるスタイルは、コンポーネントのベース名にサフィックス " `Token` " を使用して軽量インジェクショントークンに名前を付けることです: " `LibHeaderToken` "。
