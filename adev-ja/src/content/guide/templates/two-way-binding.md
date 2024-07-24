# 双方向バインディング

双方向バインディングは、アプリケーションのコンポーネントにデータを共有する方法を提供します。
親コンポーネントと子コンポーネントの間でイベントをリスンし、値を同時に更新するには、双方向バインディングを使用します。

双方向バインディングは、[プロパティバインディング](guide/templates/property-binding)とイベントバインディングを組み合わせたものです。

| バインディング                              | 詳細     |
|:---                                          |:---     |
| [プロパティバインディング](guide/templates/property-binding) | 特定の要素のプロパティを設定します。 |
| [イベントバインディング](guide/templates/event-binding)       | 要素の変更イベントをリスンします。  |

## 双方向データバインディングの追加

Angularの双方向バインディング構文は、角括弧と丸括弧を組み合わせた `[()]` です。
`[()]` 構文は、プロパティバインディングの角括弧 `[]` とイベントバインディングの丸括弧 `()` を以下のように組み合わせます。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-syntax" language="angular-html"/>

## 双方向バインディングの仕組み

双方向バインディングが機能するためには、`@Output()` プロパティは `inputChange` というパターンを使用する必要があります。ここで、`input` は `@Input()` プロパティの名前です。
たとえば、`@Input()` プロパティが `size` の場合、`@Output()` プロパティは `sizeChange` でなければなりません。

次の `sizerComponent` には、`size` 値プロパティと `sizeChange` イベントがあります。
`size` プロパティは `@Input()` なので、データは `sizerComponent` に流入できます。
`sizeChange` イベントは `@Output()` で、データが `sizerComponent` から親コンポーネントに流出することを可能にします。

次に、フォントサイズを小さくする `dec()` メソッドと、フォントサイズを大きくする `inc()` メソッドの2つのメソッドがあります。
これらの2つのメソッドは、`resize()` を使用して `size` プロパティの値を最小値/最大値の制約内で変更し、新しい `size` 値を伝えるイベントを発行します。

<docs-code header="src/app/sizer.component.ts" path="adev/src/content/examples/two-way-binding/src/app/sizer/sizer.component.ts" visibleRegion="sizer-component" language="angular-ts"/>

`sizerComponent` テンプレートには、それぞれクリックイベントを `inc()` メソッドと `dec()` メソッドにバインドする2つのボタンがあります。
ユーザーがボタンのいずれかをクリックすると、`sizerComponent` は対応するメソッドを呼び出します。
`inc()` メソッドと `dec()` メソッドの両方が、`+1` または `-1` で `resize()` メソッドを呼び出し、それは新しいサイズ値で `sizeChange` イベントを発生させます。

<docs-code header="src/app/sizer.component.html" path="adev/src/content/examples/two-way-binding/src/app/sizer/sizer.component.html"/>

`AppComponent` テンプレートでは、`fontSizePx` は `SizerComponent` に双方向にバインドされます。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-1"/>

`AppComponent` では、`fontSizePx` は `SizerComponent.size` の初期値を `16` に設定することで確立します。

<docs-code header="src/app/app.component.ts" path="adev/src/content/examples/two-way-binding/src/app/app.component.ts" visibleRegion="font-size"/>

ボタンをクリックすると、`AppComponent.fontSizePx` が更新されます。
修正された `AppComponent.fontSizePx` 値はスタイルバインディングを更新し、表示されているテキストが大きくなったり小さくなったりします。

双方向バインディング構文は、プロパティバインディングとイベントバインディングの組み合わせの省略形です。
`SizerComponent` のバインディングを別々のプロパティバインディングとイベントバインディングとして示すと、次のようになります。

<docs-code header="src/app/app.component.html (expanded)" path="adev/src/content/examples/two-way-binding/src/app/app.component.html" visibleRegion="two-way-2"/>

`$event` 変数には `SizerComponent.sizeChange` イベントのデータが含まれます。
ユーザーがボタンをクリックすると、Angularは `$event` 値を `AppComponent.fontSizePx` に割り当てます。

<docs-callout title="フォームでの双方向バインディング">

組み込みのHTML要素は `x` 値と `xChange` イベントのパターンに従わないため、フォーム要素での双方向バインディングには `NgModel` が必要です。
フォームでの双方向バインディングの使用方法の詳細については、Angularの [NgModel](guide/directives#displaying-and-updating-properties-with-ngmodel) を参照してください。

</docs-callout>
