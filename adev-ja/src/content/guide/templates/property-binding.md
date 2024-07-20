# プロパティバインディング

Angularのプロパティバインディングは、HTML要素またはディレクティブのプロパティに値を設定するのに役立ちます。プロパティバインディングを使用して、ボタン機能の切り替え、パスをプログラムで設定、コンポーネント間で値を共有などを行うことができます。

## データフローの理解

プロパティバインディングは、値をコンポーネントのプロパティからターゲット要素のプロパティに単方向に移動します。

ターゲット要素のプロパティを読み取ったり、ターゲット要素のメソッドを呼び出したりするには、[ViewChild](api/core/ViewChild) と [ContentChild](api/core/ContentChild) のAPIリファレンスを参照してください。

## プロパティへのバインディング

HELPFUL: イベントのリスニングについては、[イベントバインディング](guide/templates/event-binding) を参照してください。

要素のプロパティにバインディングするには、そのプロパティを角括弧 `[]` で囲みます。角括弧は、プロパティがターゲットプロパティであることを示します。

ターゲットプロパティは、値を割り当てる対象となるDOMプロパティです。

コンポーネントのプロパティ（`ItemDetailComponent` の `childItem` など）に文字列を割り当てるには、同じ角括弧割り当て記法を使用します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="property-binding" header="src/app/app.component.html"/>

ほとんどの場合、ターゲット名はプロパティ名になります。これは、ターゲット名が属性名のように見える場合でも同様です。

この例では、`src` は `<img>` 要素のプロパティ名です。

<!-- vale Angular.Google_WordListSuggestions = NO -->

角括弧 `[]` によって、Angularは割り当ての右辺を動的式として評価します。

<!-- vale Angular.Google_WordListSuggestions = NO -->

角括弧を省略すると、Angularは右辺を文字列リテラルとして扱い、プロパティにその静的な値を設定します。

プロパティに文字列を割り当てるには、次のコードを入力します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="no-evaluation" header="src/app/app.component.html"/>

角括弧を省略すると、`parentItem` の値ではなく、`parentItem` という文字列がレンダリングされます。

## 要素のプロパティをコンポーネントのプロパティの値に設定する

`<img>` 要素の `src` プロパティをコンポーネントのプロパティにバインディングするには、`src` を角括弧で囲み、その後ろに等号、コンポーネントのプロパティを記述します。

`itemImageUrl` プロパティを使用して、次のコードを入力します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="property-binding" header="src/app/app.component.html"/>

`itemImageUrl` プロパティをクラス（この場合は `AppComponent`）で宣言します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="item-image" header="src/app/app.component.ts"/>

### `colspan` と `colSpan`

属性 `colspan` とプロパティ `colSpan` の違いは、よく混同されます。2つの名前は、1文字しか違いません。

`colSpan` を使用してプロパティバインディングを行うには、次のコードを入力します。

<docs-code path="adev/src/content/examples/attribute-binding/src/app/app.component.html" visibleRegion="colSpan" header="src/app/app.component.html"/>

コンポーネントの `isUnchanged` プロパティが `true` の間、ボタンを無効にするには、次のコードを入力します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="disabled-button" header="src/app/app.component.html"/>

ディレクティブのプロパティを設定するには、次のコードを入力します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="class-binding" header="src/app/app.component.html"/>

親コンポーネントと子コンポーネントが互いに通信できるように、カスタムコンポーネントのモデルプロパティを設定するには、次のコードを入力します。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="model-property-binding" header="src/app/app.component.html"/>

## ボタン機能の切り替え

<!-- vale Angular.Google_WordListSuggestions = NO -->

ブール値を使用してボタンの機能を無効にするには、`disabled` DOM属性をクラスのブールプロパティにバインディングします。

<!-- vale Angular.Google_WordListSuggestions = YES -->

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.html" visibleRegion="disabled-button" header="src/app/app.component.html"/>

`AppComponent` 内の `isUnchanged` プロパティの値が `true` であるため、Angularはボタンを無効にします。

<docs-code path="adev/src/content/examples/property-binding/src/app/app.component.ts" visibleRegion="boolean" header="src/app/app.component.ts"/>

## 次に

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding-best-practices" title="プロパティバインディングのベストプラクティス"/>
  <docs-pill href="guide/templates/event-binding" title="イベントバインディング"/>
  <docs-pill href="guide/templates/interpolation" title="テキスト補間"/>
  <docs-pill href="guide/templates/class-binding" title="クラスとスタイルバインディング"/>
  <docs-pill href="guide/templates/attribute-binding" title="属性バインディング"/>
</docs-pill-row>
