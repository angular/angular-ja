# プロパティバインディング

Angularのプロパティバインディングは、HTML要素やディレクティブのプロパティに値を設定するのに役立ちます。プロパティバインディングを使用すると、ボタン機能の切り替え、プログラムによるパスの設定、コンポーネント間の値の共有などを行うことができます。

<div class="alert is-helpful">

このガイドのコードスニペットを含む動作例については、<live-example></live-example>を参照してください。

</div>

## 前提知識

* [コンポーネントの基礎知識](guide/architecture-components)
* [テンプレートの基礎知識](guide/glossary#template)
* [バインディング構文](guide/binding-syntax)

## データの流れを理解する

プロパティバインディングは、コンポーネントのプロパティからターゲット要素のプロパティへ、単方向に値を設定します。

<div class="alert is-helpful">

イベントをリッスンする方法については、[イベントバインディング](guide/event-binding)を参照してください。

</div>

ターゲット要素のプロパティを読み取ったり、そのメソッドを呼び出したりするには、[ViewChild](api/core/ViewChild)と[ContentChild](api/core/ContentChild)のAPIリファレンスを参照してください。

## プロパティのバインディング

要素のプロパティにバインドするには、ターゲットプロパティを角括弧`[]`で囲みます。

ターゲットプロパティは、値を割り当てたいDOMプロパティです。

ターゲットプロパティを`<img>`要素の`src`プロパティとして、値を割り当てるには、次のコードを使います。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

ほとんどの場合、ターゲット名はプロパティの名前です。属性の名前のように見える場合でも、プロパティの名前です。

この例では、`src`は`<img>`要素のプロパティ名です。

<!-- vale Angular.Google_WordListSuggestions = NO -->

角括弧`[]`をつけると、Angularは代入の右辺を動的な式として評価します。

<!-- vale Angular.Google_WordListSuggestions = NO -->

角括弧がない場合、Angularは右辺を文字列リテラルとして扱い、その静的な値をプロパティに設定します。

文字列をプロパティに割り当てるには、次のコードを使います。

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>

角括弧をつけないと、`parentItem`の値ではなく、`parentItem`という文字列が設定されます。

## 要素のプロパティをコンポーネントのプロパティ値に設定する

`<img>`要素の`src`プロパティをコンポーネントのプロパティにバインドするには、角括弧の中に`src`を入力し、イコール記号に続けてプロパティを入力します。

`itemImageUrl`プロパティを使って、次のコードを入力します。

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

コンポーネントクラス、この場合は`AppComponent`クラスで`itemImageUrl`プロパティを宣言します。

<code-example path="property-binding/src/app/app.component.ts" region="item-image" header="src/app/app.component.ts"></code-example>

{@a colspan}

#### `colspan`と`colSpan`

属性`colspan`とプロパティ`colSpan`は別のものです。名前が1文字だけ異なることに留意してください。

`colSpan`を使ってプロパティを設定するには、次のコードを使います。

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

コンポーネントの`isUnchanged`プロパティが`true`の間、ボタンを無効にするには、次のコードを使います。

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

ディレクティブのプロパティを設定するには、次のコードを使います。

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

親子コンポーネント間で通信するために、カスタムコンポーネントのモデルプロパティを設定するには、次のコードを使います。

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

## ボタンの状態を切り替える

<!-- vale Angular.Google_WordListSuggestions = NO -->

ボタンを無効化するには、`disabled`DOM属性をコンポーネントクラスのBoolean型のプロパティにバインドします。

<!-- vale Angular.Google_WordListSuggestions = YES -->

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

`AppComponent`クラスで定義されている`isUnchanged`プロパティが`true`なので、Angularはボタンを無効にします。

<code-example path="property-binding/src/app/app.component.ts" region="boolean" header="src/app/app.component.ts"></code-example>

## 次のステップ

* [プロパティバインディング ベストプラクティス](guide/property-binding-best-practices)
* [イベントバインディング](guide/event-binding)
* [補間による値の表示](guide/interpolation)
* [クラスとスタイルのバインディング](guide/class-binding)
* [属性バインディング](guide/attribute-binding)

@reviewed 2022-04-14
