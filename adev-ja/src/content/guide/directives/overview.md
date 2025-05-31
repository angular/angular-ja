<docs-decorative-header title="組み込みディレクティブ" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
ディレクティブは、Angularアプリケーションの要素に追加の動作を追加するクラスです。
</docs-decorative-header>

Angularの組み込みディレクティブを使用して、フォームやリスト、スタイルおよびユーザーに見えるものを管理します。

Angularディレクティブの種類は以下のとおりです。

| ディレクティブの種類                                          | 詳細                                                                           |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [コンポーネント](guide/components)                           | テンプレートで使用されます。このタイプのディレクティブは、最も一般的なディレクティブタイプです。   |
| [属性ディレクティブ](#built-in-attribute-directives)   | 要素、コンポーネント、または他のディレクティブの外観や動作を変更します。 |

このガイドでは、組み込みの [属性ディレクティブ](#built-in-attribute-directives)を取り上げます。

## 組み込み属性ディレクティブ {#built-in-attribute-directives}

属性ディレクティブは、他のHTML要素、属性、プロパティ、およびコンポーネントの動作を監視して変更します。

最も一般的な属性ディレクティブは以下のとおりです。

| 一般的なディレクティブ                                             | 詳細                                            |
| :------------------------------------------------------------ | :------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass)        | CSS クラスのセットを追加および削除します。             |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)              | HTML スタイルのセットを追加および削除します。             |
| [`NgModel`](#displaying-and-updating-properties-with-ngmodel) | HTML フォーム要素に双方向データバインディングを追加します。 |

HELPFUL: 組み込みディレクティブは、公開APIのみを使用します。他のディレクティブがアクセスできないプライベートAPIには、特別なアクセス権がありません。

## `NgClass` を使用してクラスを追加および削除する

`ngClass` を使用して、複数のCSSクラスを同時に追加または削除します。

HELPFUL: _単一の_ クラスを追加または削除するには、`NgClass` ではなく [クラスバインディング](guide/templates/class-binding) を使用します。

### コンポーネントに `NgClass` をインポートする

`NgClass` を使用するには、コンポーネントの `imports` リストに追加します。

<docs-code header="src/app/app.component.ts (NgClass インポート)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-class"/>

### 式を使用して `NgClass` を使用

スタイルを設定する要素に、`[ngClass]` を追加して、式に等しく設定します。
この場合、`isSpecial` はブール値であり、`app.component.ts` で `true` に設定されています。
`isSpecial` がtrueのため、`ngClass` は `<div>` に `special` というクラスを適用します。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="special-div"/>

### メソッドを使用して `NgClass` を使用

1. メソッドを使用して `NgClass` を使用するには、メソッドをコンポーネントクラスに追加します。
   次の例では、`setCurrentClasses()` は3つの他のコンポーネントプロパティの `true` または `false` 状態に基づいて、3つのクラスを追加または削除するオブジェクトを使用して`currentClasses` プロパティを設定します。

   オブジェクトの各キーは、CSSクラス名です。
   キーが `true` の場合、`ngClass` はクラスを追加します。
   キーが `false` の場合、`ngClass` はクラスを削除します。

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setClasses"/>

1. テンプレートで、要素のクラスを設定するために、`currentClasses` に対する `ngClass` プロパティバインディングを追加します。

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgClass-1"/>

このユースケースでは、Angularは初期化時に、および `currentClasses` オブジェクトの再代入によって発生した変更が発生した場合に、クラスを適用します。
完全な例では、ユーザーが `Refresh currentClasses` ボタンをクリックしたときに、`ngOnInit()` を使用して最初に `setCurrentClasses()` を呼び出します。
これらの手順は、`ngClass` を実装するために必要ではありません。

## `NgStyle` を使用してインラインスタイルを設定する

HELPFUL: To add or remove a _single_ style, use [style bindings](guide/templates/binding#css-class-and-style-property-bindings) rather than `NgStyle`.

### コンポーネントに `NgStyle` をインポートする

`NgStyle` を使用するには、コンポーネントの `imports` リストに追加します。

<docs-code header="src/app/app.component.ts (NgStyle インポート)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-style"/>

`NgStyle` を使用して、コンポーネントの状態に基づいて、複数のインラインスタイルを同時に設定します。

1. `NgStyle` を使用するには、コンポーネントクラスにメソッドを追加します。

   次の例では、`setCurrentStyles()` は3つの他のコンポーネントプロパティの状態に基づいて、3つのスタイルを定義するオブジェクトを使用して `currentStyles` プロパティを設定します。

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setStyles"/>

1. 要素のスタイルを設定するには、`currentStyles` に対する `ngStyle` プロパティバインディングを追加します。

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgStyle-2"/>

このユースケースでは、Angularは初期化時と、変更が発生した場合にスタイルを適用します。
これを行うために、完全な例では、`ngOnInit()` を使用して最初に `setCurrentStyles()` を呼び出し、依存プロパティがボタンクリックを通じて変更されたときに呼び出します。
ただし、これらの手順は、`ngStyle` 自体を実装するために必要ではありません。

## `ngModel` を使用してプロパティを表示および更新する {#displaying-and-updating-properties-with-ngmodel}

`NgModel` ディレクティブを使用して、データプロパティを表示し、ユーザーが変更を加えたときにそのプロパティを更新します。

1. `FormsModule` をインポートし、AppComponentの `imports` リストに追加します。

   <docs-code header="src/app/app.component.ts (FormsModule インポート)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-forms-module" />

1. HTML `<form>` 要素に `[(ngModel)]` バインディングを追加して、プロパティ（ここでは `name`）に等しく設定します。

   <docs-code header="src/app/app.component.html (NgModel の例)" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgModel-1"/>

    この `[(ngModel)]` 構文は、データバインドプロパティのみを設定できます。

構成をカスタマイズするには、拡張フォームを記述します。これにより、プロパティとイベントバインディングが分離されます。
[プロパティバインディング](guide/templates/property-binding) を使用してプロパティを設定し、[イベントバインディング](guide/templates/event-listeners) を使用して変更に応答します。
次の例では、`<input>` 値を大文字に変更します。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="uppercase"/>

以下は、大文字バージョンを含む、すべてのバリエーションが動作している様子です。

<img alt="NgModel のバリエーション" src="assets/images/guide/built-in-directives/ng-model-anim.gif">

### `NgModel` と値アクセサー

`NgModel` ディレクティブは、[ControlValueAccessor](api/forms/ControlValueAccessor) によってサポートされている要素で機能します。
Angularは、すべての基本的なHTMLフォーム要素に対して _値アクセサー_ を提供します。
詳細については、[フォーム](guide/forms) を参照してください。

`[(ngModel)]` を非フォームの組み込み要素またはサードパーティのカスタムコンポーネントに適用するには、値アクセサーを作成する必要があります。
詳細については、[DefaultValueAccessor](api/forms/DefaultValueAccessor) に関するAPIドキュメントを参照してください。

HELPFUL: Angularコンポーネントを作成する際、Angularの [双方向バインディング構文](guide/templates/two-way-binding#how-two-way-binding-works) に従って値とイベントプロパティに名前を付ければ、値アクセサーや `NgModel` は必要ありません。

## DOM 要素のないディレクティブをホストする

Angularの `<ng-container>` は、AngularがDOMに配置しないため、スタイルやレイアウトに影響を与えないグループ化要素です。

ディレクティブをホストする単一の要素がない場合は、`<ng-container>` を使用します。

以下は、`<ng-container>` を使用した条件付きのパラグラフです。

<docs-code header="src/app/app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="ngif-ngcontainer"/>

<img alt="適切なスタイルが適用された ngcontainer パラグラフ" src="assets/images/guide/structural-directives/good-paragraph.png">

1. `FormsModule` から `ngModel` ディレクティブをインポートします。

1. `FormsModule` を、関連するAngularモジュールのインポートセクションに追加します。

1. `<option>` を条件付きで除外するには、`<option>` を `<ng-container>` でラップします。

   <docs-code header="src/app/app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="select-ngcontainer"/>

   <img alt="ngcontainer オプションは正しく機能します" src="assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## 次のステップ

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="属性ディレクティブ"/>
  <docs-pill href="guide/directives/structural-directives" title="構造ディレクティブ"/>
  <docs-pill href="guide/directives/directive-composition-api" title="ディレクティブ合成API"/>
</docs-pill-row>
