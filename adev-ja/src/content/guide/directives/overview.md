<docs-decorative-header title="組み込みディレクティブ" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
ディレクティブは、Angularアプリケーションの要素に追加の動作を追加するクラスです。
</docs-decorative-header>

Angularの組み込みディレクティブを使用して、フォームやリスト、スタイルおよびユーザーに見えるものを管理します。

Angularディレクティブの種類は以下のとおりです。

| ディレクティブの種類                                          | 詳細                                                                           |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [コンポーネント](guide/components)                           | テンプレートで使用されます。このタイプのディレクティブは、最も一般的なディレクティブタイプです。   |
| [属性ディレクティブ](#built-in-attribute-directives)   | 要素、コンポーネント、または他のディレクティブの外観や動作を変更します。 |
| [構造ディレクティブ](#built-in-structural-directives) | DOM レイアウトを、DOM 要素の追加と削除によって変更します。                        |

このガイドでは、組み込みの [属性ディレクティブ](#built-in-attribute-directives) と [構造ディレクティブ](#built-in-structural-directives) を取り上げます。

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

## 組み込み構造ディレクティブ {#built-in-structural-directives}

構造ディレクティブは、HTMLレイアウトを担当します。
これらは、通常、付加されているホスト要素を追加、削除、および操作することによって、DOMの構造を形成または再形成します。

このセクションでは、最も一般的な組み込み構造ディレクティブを紹介します。

| 一般的な組み込み構造ディレクティブ              | 詳細                                                          |
| :------------------------------------------------- | :--------------------------------------------------------------- |
| [`NgIf`](#adding-or-removing-an-element-with-ngif) | テンプレートからサブビューを条件付きで作成または破棄します。 |
| [`NgFor`](#listing-items-with-ngfor)               | リスト内の各アイテムに対してノードを繰り返します。                           |
| [`NgSwitch`](#switching-cases-with-ngswitch)       | 代替ビューを切り替えるディレクティブのセットです。         |

詳細については、[構造ディレクティブ](guide/directives/structural-directives) を参照してください。

## `NgIf` を使用して要素を追加または削除する {#adding-or-removing-an-element-with-ngif}

ホスト要素に `NgIf` ディレクティブを適用することによって、要素を追加または削除します。

`NgIf` が `false` の場合、Angularは要素とその子孫をDOMから削除します。
次に、Angularはそれらのコンポーネントを破棄し、メモリとリソースを解放します。

### コンポーネントに `NgIf` をインポートする

`NgIf` を使用するには、コンポーネントの `imports` リストに追加します。

<docs-code header="src/app/app.component.ts (NgIf インポート)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-if"/>

### `NgIf` を使用

要素を追加または削除するには、次の例のように、`*ngIf` を条件式（例: `isActive`）にバインドします。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-1"/>

`isActive` 式が真の値を返す場合、`NgIf` は `ItemDetailComponent` をDOMに追加します。
式が偽の場合、`NgIf` は `ItemDetailComponent` をDOMから削除し、コンポーネントとそのすべてのサブコンポーネントを破棄します。

`NgIf` と `NgIfElse` の詳細については、[NgIf API ドキュメント](api/common/NgIf) を参照してください。

### `null` に対する保護

デフォルトでは、`NgIf` は `null` 値にバインドされた要素の表示を防ぎます。

`NgIf` を使用して `<div>` を保護するには、`<div>` に `*ngIf="yourProperty"` を追加します。
次の例では、`currentCustomer` が存在するため、`currentCustomer` の名前が表示されます。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-2"/>

ただし、プロパティが `null` の場合、Angularは `<div>` を表示しません。
この例では、`nullCustomer` は `null` であるため、Angularは `nullCustomer` を表示しません。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgIf-2b"/>

## `NgFor` を使用してアイテムを一覧表示する {#listing-items-with-ngfor}

`NgFor` ディレクティブを使用して、アイテムのリストを表示します。

### コンポーネントに `NgFor` をインポートする

`NgFor` を使用するには、コンポーネントの `imports` リストに追加します。

<docs-code header="src/app/app.component.ts (NgFor インポート)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-for"/>

### `NgFor` を使用

`NgFor` を使用するには、以下を行う必要があります。

1. Angularが単一のアイテムをどのようにレンダリングするかを決定するHTMLブロックを定義します。
1. アイテムを一覧表示するには、`*ngFor` に `let item of items` という省略記号を割り当てます。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-1"/>

文字列 `"let item of items"` は、Angularに以下のことを指示します。

- `items` 配列の各アイテムを、ローカルの `item` ループ変数に格納します
- 各アイテムを、各反復のテンプレート化されたHTMLで使用できるようにします
- `"let item of items"` を、ホスト要素の周りの `<ng-template>` に変換します
- リストの各 `item` に対して、`<ng-template>` を繰り返します

詳細については、[構造ディレクティブの省略記号](guide/directives/structural-directives#structural-directive-shorthand) セクションの [構造ディレクティブ](guide/directives/structural-directives) を参照してください。

### コンポーネントビューを繰り返す

コンポーネント要素を繰り返すには、セレクターに `*ngFor` を適用します。
次の例では、セレクターは `<app-item-detail>` です。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-2"/>

次の場所で、テンプレート入力変数（例: `item`）を参照します。

- `ngFor` ホスト要素内
- アイテムのプロパティにアクセスするために、ホスト要素の子孫内

次の例では、最初に補間で `item` を参照し、次に `<app-item-detail>` コンポーネントの `item` プロパティにバインディングを渡します。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-1-2"/>

テンプレート入力変数の詳細については、[構造ディレクティブの省略記号](guide/directives/structural-directives#structural-directive-shorthand) を参照してください。

### `*ngFor` の `index` を取得する

テンプレート入力変数で `*ngFor` の `index` を取得し、テンプレート内で使用します。

`*ngFor` の省略記号に、セミコロンと `let i=index` を追加します。
次の例では、`i` という名前の変数に `index` を取得し、アイテム名とともに表示します。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgFor-3"/>

`NgFor` ディレクティブコンテキストのindexプロパティは、各反復におけるアイテムの0ベースのインデックスを返します。

Angularはこの命令をホスト要素の周りの `<ng-template>` に変換し、
次にこのテンプレートを繰り返し使用して、
リストの各 `item` に対して新しい要素とバインディングのセットを作成します。
省略記号の詳細については、[構造ディレクティブ](guide/directives/structural-directives#structural-directive-shorthand) ガイドを参照してください。

## 条件が真の場合に要素を繰り返す

特定の条件が真の場合にHTMLブロックを繰り返すには、`*ngFor` 要素をラップするコンテナ要素に `*ngIf` を置きます。

詳細については、[要素ごとの構造ディレクティブ](guide/directives/structural-directives#one-structural-directive-per-element) を参照してください。

### `*ngFor` `trackBy` を使用してアイテムを追跡する

アプリケーションがサーバーに送信する呼び出しの数を減らすには、アイテムリストへの変更を追跡します。
`*ngFor` の `trackBy` プロパティを使用すると、Angularは、アイテムリスト全体をリロードするのではなく、変更されたアイテムのみを変更して再レンダリングできます。

1. `NgFor` が追跡する必要がある値を返すメソッドをコンポーネントに追加します。
   この例では、追跡する必要がある値はアイテムの `id` です。
   ブラウザがすでに `id` をレンダリングしている場合、Angularはそれを追跡し、同じ `id` についてサーバーに再クエリすることはありません。

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="trackByItems"/>

1. 省略記号式で、`trackBy` を `trackByItems()` メソッドに設定します。

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="trackBy"/>

**Change ids** は、新しい `item.id` を持つ新しいアイテムを作成します。
`trackBy` の効果の次の図では、**Reset items** は、同じ `item.id` を持つ新しいアイテムを作成します。

- `trackBy` がない場合、両方のボタンがDOM要素の完全な置き換えをトリガーします。
- `trackBy` がある場合、`id` の変更のみが要素の置き換えをトリガーします。

<img alt="trackBy のアニメーション" src="assets/images/guide/built-in-directives/ngfor-trackby.gif">

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

## `NgSwitch` を使用してケースを切り替える {#switching-cases-with-ngswitch}

JavaScriptの `switch` ステートメントと同様に、`NgSwitch` は、スイッチ条件に基づいて、いくつかの可能な要素の中から1つの要素を表示します。
Angularは、選択された要素のみをDOMに配置します。

<!--todo: API Flagged -->

`NgSwitch` は、3つのディレクティブのセットです。

| `NgSwitch` ディレクティブ | 詳細                                                                                                                                                                |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NgSwitch`            | 仲間のディレクティブの動作を変更する属性ディレクティブ。                                                                                          |
| `NgSwitchCase`        | バインドされた値がスイッチ値と等しい場合に、その要素を DOM に追加し、バインドされた値がスイッチ値と等しくない場合に、その要素を DOM から削除する構造ディレクティブ。 |
| `NgSwitchDefault`     | 選択された `NgSwitchCase` がない場合に、その要素を DOM に追加する構造ディレクティブ。                                                                        |

ディレクティブを使用するには、`NgSwitch`、`NgSwitchCase`、および `NgSwitchDefault` をコンポーネントの `imports` リストに追加します。

<docs-code header="src/app/app.component.ts (NgSwitch インポート)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-switch"/>

### `NgSwitch` を使用

1. `<div>` などの要素に、`[ngSwitch]` を追加し、スイッチ値を返す式（例: `feature`）にバインドします。
   この例の `feature` 値は文字列ですが、スイッチ値は任意の型にできます。

1. ケースの要素に、`*ngSwitchCase` と `*ngSwitchDefault` にバインドします。

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgSwitch"/>

1. 親コンポーネントで、`[ngSwitch]` 式で使用する `currentItem` を定義します。

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="item"/>

1. 各子コンポーネントで、親コンポーネントの `currentItem` にバインドされた `item` [入力プロパティ](guide/components/inputs) を追加します。
   次の2つのスニペットは、親コンポーネントと子コンポーネントの1つを示しています。
   他の子コンポーネントは、`StoutItemComponent` と同じです。

   <docs-code header="各子コンポーネント（ここでは StoutItemComponent）" path="adev/src/content/examples/built-in-directives/src/app/item-switch.component.ts" visibleRegion="input"/>

   <img alt="NgSwitch のアニメーション" src="assets/images/guide/built-in-directives/ngswitch.gif">

スイッチディレクティブは、組み込みのHTML要素とWebコンポーネントでも機能します。
たとえば、`<app-best-item>` スイッチケースを `<div>` に置き換えることができます。

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgSwitch-div"/>

## 次のステップ

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="属性ディレクティブ"/>
  <docs-pill href="guide/directives/structural-directives" title="構造ディレクティブ"/>
  <docs-pill href="guide/directives/directive-composition-api" title="ディレクティブ合成API"/>
</docs-pill-row>
