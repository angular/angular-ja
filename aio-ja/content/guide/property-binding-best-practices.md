# プロパティバインディング ベストプラクティス

いくつかのガイドラインに従うことにより、プロパティバインディングを、バグを最小限にしてコードを読みやすくするのに役立つように使用できます。

<div class="alert is-helpful">

このガイドのコードを含む動作例については、<live-example name="property-binding"></live-example>を参照してください。

</div>

## 副作用を避ける {@a avoid-side-effects}

テンプレート式の評価は、目に見える副作用がありません。
副作用を避けるのに役立つため、テンプレート式の構文を使います。
一般に、その正しい構文によって、プロパティバインディング式で何かに値を代入することが防止されます。
この構文では、インクリメント演算子とデクリメント演算子を使うことも防がれます。

### 副作用の発生例 {@a an-example-of-producing-side-effects}

バインドしている他の何かの値を変更する式がある場合、その値の変更は副作用になります。
Angularは、変更された値を表示したり、しなかったりします。
Angularはその変更を検出すると、エラーをスローします。

ベストプラクティスとして、値を返すプロパティとメソッドのみを使用します。

## 適切な型を返す {@a return-the-proper-type}

テンプレート式は、ターゲットのプロパティが期待する値の型に評価する必要があります。
たとえば、ターゲットのプロパティが文字列を期待するなら文字列を、数値を期待するなら数値を、オブジェクトを期待するならオブジェクトを返します。

### 文字列を渡す {@a passing-in-a-string}

次の例では、`ItemDetailComponent`の`childItem`プロパティは文字列を期待しています。

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

`ItemDetailComponent`で`@Input()`の型が`string`のところを調べることで、この期待を確認できます:

<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)"></code-example>

`AppComponent`で`parentItem`は文字列です。つまり、`[childItem]="parentItem"`内の式である`parentItem`は、文字列に評価されます。

<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

`parentItem`が他の型の場合は、同様の型で`childItem`の`@Input()`を指定する必要があります。

### オブジェクトを渡す {@a passing-in-an-object}

この例では、`ItemListComponent`は`AppComponent`の子コンポーネントであり、`items`プロパティはオブジェクトの配列を期待します。

<code-example path="property-binding/src/app/app.component.html" region="pass-object" header="src/app/app.component.html"></code-example>

`ItemListComponent`では、`@Input()`の`items`は`Item[]`の型を持ちます。

<code-example path="property-binding/src/app/item-list/item-list.component.ts" region="item-input" header="src/app/item-list.component.ts"></code-example>

`Item`は`id`と`name`の2つのプロパティをもつオブジェクトであることに注意してください。

<code-example path="property-binding/src/app/item.ts" region="item-class" header="src/app/item.ts"></code-example>

`app.component.ts`では、`currentItems`は`item.ts`の`Item`オブジェクトと同じ形で`id`と`name`をもつオブジェクトの配列です。

<code-example path="property-binding/src/app/app.component.ts" region="pass-object" header="src/app.component.ts"></code-example>

同じ形のオブジェクトを提供することで、Angularが式の`currentItems`を評価するときに`items`の期待を満たします。
