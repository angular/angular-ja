# プロパティバインディングのベストプラクティス

いくつかのガイドラインに従うことで、バグを減らし、コードを可読性高く保つことができるようにプロパティバインディングを使用できます。

## サイドエフェクトを避ける

テンプレート式の評価は、目に見える副作用があってはなりません。
テンプレート式の構文を使用して、副作用を避けるようにしてください。
一般的に、正しい構文により、プロパティバインディング式で何か他のものへの値の割り当ては不可能になります。
また、インクリメントとデクリメント演算子も使用できません。

### サイドエフェクトを生成する例

バインドしているものとは異なるものの値を変更する式があった場合、その値の変更は副作用になります。
Angularは、変更された値を表示するかしない場合があります。
Angularが変更を検出すると、エラーが発生します。

ベストプラクティスとして、値を返すプロパティとメソッドのみを使用してください。

## 適切な型を返す

テンプレート式は、ターゲットプロパティが期待する型の値を生成する必要があります。
たとえば、次のようなものを返します。

* `string`：ターゲットプロパティが文字列を期待する場合
* `number`：数値を期待する場合
* `object`：オブジェクトを期待する場合

### 文字列を渡す

次の例では、`ItemDetailComponent`の`childItem`プロパティは文字列を期待しています。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="model-property-binding"/>

`ItemDetailComponent`の`@Input()`型が`string`であることを確認します。

<docs-code header="src/app/item-detail.component.ts (setting the @Input() type)" path="adev/src/content/examples/property-binding/src/app/item-detail.component.ts" visibleRegion="input-type"/>

`AppComponent`の`parentItem`は文字列なので、`[childItem]="parentItem"`内の式`parentItem`は文字列として評価されます。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="parent-data-type"/>

`parentItem`が他の型であった場合、`childItem`の`@Input()`もその型として指定する必要があります。

### オブジェクトを渡す

この例では、`ItemListComponent`は`AppComponent`の子コンポーネントであり、`items`プロパティはオブジェクトの配列を期待しています。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="pass-object"/>

`ItemListComponent`の`@Input()`である`items`は、`Item[]`型です。

<docs-code header="src/app/item-list.component.ts" path="adev/src/content/examples/property-binding/src/app/item-list.component.ts" visibleRegion="item-input"/>

`Item`はオブジェクトであり、`id`と`name`の2つのプロパティを持つことに注意してください。

<docs-code header="src/app/item.ts" path="adev/src/content/examples/property-binding/src/app/item.ts" visibleRegion="item-class"/>

`app.component.ts`の`currentItems`は、`items.ts`の`Item`オブジェクトと同じ形状を持つオブジェクトの配列であり、`id`と`name`があります。

<docs-code header="src/app.component.ts" path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="pass-object"/>

同じ形状のオブジェクトを提供することで、Angularが`currentItems`の式を評価したときに、`items`の期待を満たします。
