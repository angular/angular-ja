# 軽量インジェクショントークンを使用してクライアントアプリケーションのサイズを最適化する

このページでは、ライブラリ開発者に推奨される依存性の注入手法の概念的な概要を提供します。
*軽量インジェクショントークン* を使用してライブラリを設計すると、ライブラリを使用するクライアントアプリケーションのバンドルサイズを最適化できます。

[ツリーシェイキング可能なプロバイダー](guide/architecture-services#introduction-to-services-and-dependency-injection)を使用することで、コンポーネントと注入可能なサービス間の依存関係を管理し、バンドルサイズを最適化できます。
これにより、通常、提供されたコンポーネントまたはサービスがアプリケーションで実際に使用されない場合、コンパイラはそのコードをバンドルから削除できます。

ただし、Angular がインジェクショントークンを格納する方法が原因で、そのような未使用のコンポーネントまたはサービスがバンドルに含まれてしまう可能性があります。
このページでは、軽量インジェクショントークンを使用して適切なツリーシェイキングをサポートする依存性の注入の設計パターンについて説明します。

軽量インジェクショントークンのデザインパターンは、ライブラリ開発者にとって特に重要です。
これにより、アプリケーションがライブラリの機能の一部のみを使用する場合に、未使用のコードをクライアントのアプリケーションバンドルから確実に削除できます。

アプリケーションがライブラリを使用する場合、ライブラリが提供するサービスのうち、いくつかはクライアントアプリケーションから使用されない場合があります。
この場合、アプリケーション開発者は、そのサービスがツリーシェイクされ、コンパイルされたアプリケーションのサイズに寄与しないことを期待する必要があります。
アプリケーション開発者は、ライブラリ内のツリーシェイキングの問題を認識したり修正したりすることができないため、ライブラリ開発者の責任でこれを行う必要があります。
未使用のコンポーネントが保持されないようにするには、ライブラリで軽量インジェクショントークンのデザインパターンを使用する必要があります。

## トークンが保持される場合

トークンの保持が発生する条件をよりよく説明するために、library-card コンポーネントを提供するライブラリを考えてみましょう。library-card コンポーネントには、本文が含まれ、オプションのヘッダーを含めることができます。

<code-example format="html" language="html">

&lt;lib-card&gt;
  &lt;lib-header&gt;&hellip;&lt;/lib-header&gt;
&lt;/lib-card&gt;

</code-example>

次のように、`<lib-card>` コンポーネントは `@ContentChild()` または `@ContentChildren()` を使用して `<lib-header>` と `<lib-body>` を取得する可能性が高い実装です。

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'lib-header',
  &hellip;,
})
class LibHeaderComponent {}

&commat;Component({
  selector: 'lib-card',
  &hellip;,
})
class LibCardComponent {
  &commat;ContentChild(LibHeaderComponent)
  header: LibHeaderComponent|null = null;
}

</code-example>

`<lib-header>` はオプションであるため、要素は最小形式の `<lib-card></lib-card>` でテンプレートに表示できます。
この場合、`<lib-header>` は使用されていないため、ツリーシェイクされると予想されますが、そうではありません。
これは、実際には `LibCardComponent` に `LibHeaderComponent` への参照が 2 つ含まれているためです。

<code-example format="typescript" language="typescript">

&commat;ContentChild(LibHeaderComponent) header: LibHeaderComponent;

</code-example>

*   これらの参照の 1 つは、*型の位置* にあります。つまり、`LibHeaderComponent` を型として指定しています `header: LibHeaderComponent;`。

*   もう 1 つの参照は、*値の位置* にあります。つまり、LibHeaderComponent は `@ContentChild()` パラメータデコレーターの値です `@ContentChild(LibHeaderComponent)`。

コンパイラは、これらの位置でのトークン参照を異なる方法で処理します。

*   コンパイラは、TypeScript からの変換後に *型の位置* の参照を消去するため、ツリーシェイキングには影響しません。

*   コンパイラは、実行時に *値の位置* の参照を保持する必要があります。これにより、コンポーネントがツリーシェイクされることを妨げます。

この例では、アプリケーション開発者が実際にどこからも `<lib-header>` を使用していなくても、コンパイラは値の位置にある `LibHeaderComponent` トークンを保持します。
`LibHeaderComponent` が大きい \(コード、テンプレート、およびスタイル\) 場合、それを不必要に含めると、クライアントアプリケーションのサイズが大幅に増加する可能性があります。

## 軽量インジェクショントークンパターンを使用する場合

コンポーネントがインジェクショントークンとして使用されると、ツリーシェイキングの問題が発生します。
2つのケースでそれが起こる可能性があります。

*   トークンが、[コンテンツクエリ](guide/lifecycle-hooks#using-aftercontent-hooks "See more about using content queries.")の値の位置で使用されている場合。
*   トークンが、コンストラクターで依存性を注入する際の型指定子として使用されている場合。

次の例では、`OtherComponent` トークンを上記の両方の場合で使用しているため、`OtherComponent` は保持されます \(つまり、使用されていない場合にツリーシェイクされることが妨げられています\)。

<code-example format="typescript" language="typescript">

class MyComponent {
  constructor(&commat;Optional() other: OtherComponent) {}

  &commat;ContentChild(OtherComponent)
  other: OtherComponent|null;
}

</code-example>

型指定子としてのみ使用されるトークンは JavaScript に変換されると削除されますが、依存性の注入に使用されるすべてのトークンは実行時に必要となります。
これらは実質的に `constructor(@Optional() other: OtherComponent)` を `constructor(@Optional() @Inject(OtherComponent) other)` に変更します。
その結果、トークンは値の位置にあるため、ツリーシェイカーが参照を保持することになります。

<div class="alert is helpful">

すべてのサービスについて、ライブラリは、コンポーネントコンストラクターではなくルートレベルで依存関係を提供する、[ツリーシェイキング可能なプロバイダー](guide/architecture-services#introduction-to-services-and-dependency-injection)を使用する必要があります。

</div>

## 軽量インジェクショントークンの使用

軽量インジェクショントークンのデザインパターンは、小さな抽象クラスをインジェクショントークンとして使用し、後の段階で実際の実装を提供することで構成されます。
抽象クラスは \(ツリーシェイクされず\) 保持されますが、小さいため、アプリケーションのサイズに実質的な影響はありません。

次の例は、これが `LibHeaderComponent` に対してどのように機能するかを示しています。

<code-example format="typescript" language="typescript">

abstract class LibHeaderToken {}

&commat;Component({
  selector: 'lib-header',
  providers: [
    {provide: LibHeaderToken, useExisting: LibHeaderComponent}
  ]
  &hellip;,
})
class LibHeaderComponent extends LibHeaderToken {}

&commat;Component({
  selector: 'lib-card',
  &hellip;,
})
class LibCardComponent {
  &commat;ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;
}

</code-example>

この例では、`LibCardComponent` の実装は、型の位置または値の位置のいずれからも `LibHeaderComponent` を参照しなくなりました。
これにより、`LibHeaderComponent` の完全なツリー シェイキングが行われます。
`LibHeaderToken` は保持されますが、それはクラス宣言のみであり、具体的な実装はありません。
これは小さく、コンパイル後に保持されても、アプリケーションのサイズに実質的な影響を与えません。

代わりに、`LibHeaderComponent` 自体が抽象的な `LibHeaderToken` クラスを実装します。
そのトークンをコンポーネント定義のプロバイダーとして安全に使用できるため、Angular は具象型を正しく注入できます。

要約すると、軽量インジェクショントークンパターンは次の要素で構成されます。

1.  抽象クラスとして表される軽量インジェクショントークン
1.  抽象クラスを実装するコンポーネント定義
1.  ` @ContentChild()` または `@ContentChildren()` を使用した軽量パターンの注入
1.  軽量インジェクショントークンを実装に関連付ける、軽量インジェクショントークンの実装内のプロバイダー

### API 定義に軽量インジェクショントークンを使用する

軽量インジェクショントークンを注入するコンポーネントは、インジェクトされたクラスでメソッドを呼び出す必要がある場合があります。
トークンが抽象クラスになり、注入可能なコンポーネントがそのクラスを実装するため、抽象軽量インジェクショントークンクラスで抽象メソッドも宣言する必要があります。
メソッドの実装 (コード上のすべてのオーバーヘッドを含む) は、ツリーシェイクと注入が可能なコンポーネントに存在します。
これにより、親は子 (存在する場合) と型安全な方法で通信できます。

たとえば、 `LibCardComponent` は `LibHeaderComponent` ではなく `LibHeaderToken` をクエリするようになりました。
次の例は、実際に `LibHeaderComponent` を参照せずに、パターンによって `LibCardComponent` が `LibHeaderComponent` と通信する方法を示しています。

<code-example format="typescript" language="typescript">

abstract class LibHeaderToken {
  abstract doSomething(): void;
}

&commat;Component({
  selector: 'lib-header',
  providers: [
    {provide: LibHeaderToken, useExisting: LibHeaderComponent}
  ]
  &hellip;,
})
class LibHeaderComponent extends LibHeaderToken {
  doSomething(): void {
    // Concrete implementation of `doSomething`
  }
}

&commat;Component({
  selector: 'lib-card',
  &hellip;,
})
class LibCardComponent implement AfterContentInit {
  &commat;ContentChild(LibHeaderToken)
  header: LibHeaderToken|null = null;

  ngAfterContentInit(): void {
    this.header &amp;&amp; this.header.doSomething();
  }
}

</code-example>

この例では、親は子コンポーネントを取得するためにトークンをクエリし、存在する場合は結果として得られたコンポーネント参照を保存します。
子でメソッドを呼び出す前に、親コンポーネントは子コンポーネントが存在するかどうかを確認します。
子コンポーネントがツリーシェイクされている場合、そのコンポーネントへのランタイムでの参照はなく、そのメソッドへの呼び出しもありません。

### 軽量インジェクショントークンの命名

軽量インジェクショントークンは、コンポーネントでのみ役立ちます。
Angular スタイルガイドでは、"Component" 接尾辞を使用してコンポーネントに名前を付けることを提案しています。
"LibHeaderComponent" の例は、この規則に従います。

コンポーネントとそのトークンの関係を維持しながらそれらを区別するには、コンポーネントのベース名に接尾辞 "`Token`" を付けて、軽量インジェクショントークン "`LibHeaderToken`" に名前を付けるスタイルをお勧めします。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
