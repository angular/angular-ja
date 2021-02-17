# 組み込みディレクティブ {@a built-in-directives}

Angular には2種類の組み込みディレクティブがあります。[_属性_ ディレクティブ](guide/attribute-directives)と[_構造_ ディレクティブ](guide/structural-directives)です。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

自作のディレクティブの作り方といった詳細については、[属性ディレクティブ](guide/attribute-directives)や[構造ディレクティブ](guide/structural-directives)を参照してください。

{@a attribute-directives}
## 組み込み属性ディレクティブ {@a built-in-attribute-directives}

属性ディレクティブは、他の HTML 要素、属性、プロパティ、コンポーネントの
動作をリッスンして変更します。
それらは通常、HTML の属性であるかのように要素に適用されます。

[`RouterModule`](guide/router "Routing and Navigation")
や [`FormsModule`](guide/forms "Forms") などの多くの NgModule では独自の属性ディレクティブを定義しています。
もっとも一般的に使用されている属性ディレクティブは次のとおりです:

* [`NgClass`](#ngClass) - 一連の CSS クラスを追加および削除する
* [`NgStyle`](#ngStyle) - 一連の HTML スタイルを追加および削除する
* [`NgModel`](#ngModel) - HTML の form 要素への双方向データバインディング

{@a ngClass}
## `NgClass`

`ngClass` を使うと、CSS クラスの追加と削除を同時にできます。

<code-example path="built-in-directives/src/app/app.component.html" region="special-div" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

追加、削除するクラスが *ひとつだけ* のときは、`NgClass` よりも[クラスバインディング](guide/attribute-binding#class-binding)を使いましょう。

</div>

コンポーネントがもつ他の3つのプロパティの `true`/`false` 状態に基づいて、3つのクラスの追加または削除をする
コンポーネントのプロパティ `currentClasses` オブジェクトを設定する `setCurrentClasses` コンポーネントメソッド
を考えてみましょう。オブジェクトの各キーは CSS クラス名になります。
クラスを追加する必要がある場合はその値を `true` に、削除する必要がある場合は `false` にしてください。

<code-example path="built-in-directives/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts"></code-example>

`currentClasses` への `ngClass` プロパティバインディングを追加すると、それに応じて要素のクラスが設定されます: 

<code-example path="built-in-directives/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

初期化時と、依存するプロパティ変更時の両方で、
`setCurrentClasses()` を呼び出す必要があることを忘れないでください。

</div>

<hr/>

{@a ngStyle}

## `NgStyle`

`NgStyle` を使うと、コンポーネントの状態に応じて、たくさんのインラインスタイルを同時に動的に設定することができます。

### `NgStyle` を使わないケース {@a without-ngstyle}

*単一の* スタイルの値を設定するときは `NgStyle` ではなく[スタイルバインディング](guide/attribute-binding#style-binding)を使うことを検討してください。

<code-example path="built-in-directives/src/app/app.component.html" region="without-ng-style" header="src/app/app.component.html"></code-example>

*たくさん* のインラインスタイルを同時に設定するときは、`NgStyle` ディレクティブを使いましょう。

次に示すのは、コンポーネントプロパティ `currentStyles` に、
他のコンポーネントプロパティ3つの状態に基づいた3つのスタイルを定義するオブジェクトを設定する、
`setCurrentStyles()` メソッドです。

<code-example path="built-in-directives/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts"></code-example>

`currentStyles` への `ngStyle` プロパティバインディングを追加すると、それに応じて要素のスタイルが設定されます: 

<code-example path="built-in-directives/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

初期化時と、依存するプロパティ変更時の両方で、 `setCurrentStyles()` を呼び出す必要があることを忘れないでください。

</div>


{@a ngModel}
## `[(ngModel)]`: 双方向バインディング {@a ngmodel-two-way-binding}

`NgModel` ディレクティブを使うと、データプロパティを表示したり、
ユーザー操作に応じてプロパティを更新したりすることができます。例を示します:

<code-example path="built-in-directives/src/app/app.component.html" header="src/app/app.component.html (NgModel example)" region="NgModel-1"></code-example>


### `ngModel` を使うために `FormsModule` をインポートする {@a import-formsmodule-to-use-ngmodel}

双方向のデータバインディングで `ngModel` ディレクティブを使う前に、
`FormsModule` をインポートして NgModule の `imports` リストに加える必要があります。
[Forms](guide/forms#ngModel) で `FormsModule` と `ngModel` について詳しく知ることができます。

`[(ngModel)]` を使えるようにするため、次のように `FormsModule` をインポートすることを忘れないでください:

<code-example path="built-in-directives/src/app/app.module.ts" header="src/app/app.module.ts (FormsModule import)" region="import-forms-module"></code-example>


`<input>` 要素の `value` プロパティと `input` イベントへの
別々のバインディングによって、同じことができます:

<code-example path="built-in-directives/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html"></code-example>

構文を簡素化するため、`ngModel` ディレクティブは `ngModel` 入力プロパティと `ngModelChange` 出力プロパティの詳細を隠蔽しています:

<code-example path="built-in-directives/src/app/app.component.html" region="NgModelChange" header="src/app/app.component.html"></code-example>

`ngModel` データプロパティは要素の値プロパティを設定し、
`ngModelChange` イベントプロパティは要素の値の変更をリッスンします。

### `NgModel` と値アクセサ {@a ngmodel-and-value-accessors}

詳細な動作は要素によって異なるため、`NgModel` ディレクティブは、
要素をこのプロトコルに適応させる [ControlValueAccessor](api/forms/ControlValueAccessor)
がサポートする要素に対してのみ機能します。
Angular は、基本的な HTML のフォーム要素すべてについて *値アクセサ* を提供しており、
[フォーム](guide/forms)ガイドでそれらにバインドする方法を説明しています。

適切な値アクセサを作らない限り、
`[(ngModel)]` をフォーム以外のネイティブ要素またはサードパーティのカスタムコンポーネントに適用することはできません。
詳しくは [DefaultValueAccessor](api/forms/DefaultValueAccessor) の API ドキュメントを参照してください。

自作した Angular コンポーネントについては、
Angular の基本的な[双方向バインディングの構文](guide/two-way-binding)に
合った値とイベントのプロパティ名をつければ、
値アクセサを作らずに済み、`NgModel` も省略できます。
[双方向バインディング](guide/two-way-binding)セクションの `sizer` は
このテクニックの一例です。

個別の `ngModel` バインディングは、
要素のネイティブプロパティにバインドするよりもよいですが、
`[(ngModel)]` 構文を使えば宣言ひとつにバインディングをスリム化できます。

<code-example path="built-in-directives/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html"></code-example>

`[(ngModel)]` 構文ができるのは、データバウンドのプロパティの _設定_ だけです。
さらに何かする必要があるときは、展開された形式で書くことができます;
次の例では、`<input>` の値を大文字に変換しています:

<code-example path="built-in-directives/src/app/app.component.html" region="uppercase" header="src/app/app.component.html"></code-example>

大文字化を含むすべての書き方が動いている様子です:

<div class="lightbox">
  <img src='generated/images/guide/built-in-directives/ng-model-anim.gif' alt="NgModel variations">
</div>

{@a structural-directives}
## 組み込みの _構造_ ディレクティブ {@a built-in-structural-directives}

構造ディレクティブは HTML レイアウトを担当します。
それらがアタッチされているホスト要素に対する追加、削除、加工といった、
DOM 構造の形成、または再形成を行います。

このセクションでは、一般的な組み込みの構造ディレクティブについて紹介します:

* [`NgIf`](#ngIf)&mdash;条件に応じてテンプレートからサブビューを作成、または破棄します。
* [`NgFor`](#ngFor)&mdash;リストの各項目に対してノードを繰り返します。
* [`NgSwitch`](#ngSwitch)&mdash;いくつかのビューから選んで表示するディレクティブ一式です。

<div class="alert is-helpful">

構造ディレクティブについての詳細を記した
[構造ディレクティブ](guide/structural-directives)ガイドでは、
次の内容を説明しています:

* なぜ
[ディレクティブ名の先頭にアスタリスク (\*) をつけるのか](guide/structural-directives#the-asterisk--prefix)。
* ディレクティブをホストする適切な要素がないときに [`<ng-container>`](guide/structural-directives#ngcontainer "<ng-container>")
でグルーピングする方法。
* 構造ディレクティブの作り方。
* ひとつの要素には[ひとつの構造ディレクティブ](guide/structural-directives#one-per-element "one per host element")しか適用できないこと。

</div>

{@a ngIf}
## NgIf

ホスト要素に
`NgIf` ディレクティブを適用することで、DOM に要素を追加、削除することができます。
この例では、ディレクティブから条件式 `isActive` にバインドしています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`ngIf` の前にアスタリスク (`*`) をつけるのを忘れないでください。
アスタリスクについての詳細は、[構造ディレクティブ](guide/structural-directives)の
[アスタリスク (*) 接頭辞](guide/structural-directives#the-asterisk--prefix)セクションを参照してください。

</div>

`isActive` が truthy な値を返すとき、`NgIf` は
DOM に `ItemDetailComponent` を追加します。
式が falsy なら、`NgIf` は DOM から `ItemDetailComponent` を削除し、
そのコンポーネントと、そのサブコンポーネントすべてを破棄します。


### Show/hide と `NgIf` {@a showhide-vs-ngif}

要素を非表示にすることは、`NgIf` で削除することとは異なります。
次の例では、[class](guide/attribute-binding#class-binding) と
[style](guide/attribute-binding#style-binding) バインディングが、
それぞれどのように要素の表示状態を制御しているかを比較しています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html"></code-example>

要素を非表示にすると、要素とその子孫すべては DOM に残ります。
それらの要素のすべてのコンポーネントはメモリ上に残り、
Angular は変更を検出し続けることがあります。
かなりのコンピューティングリソースを使い、
不必要にパフォーマンスを低下させている可能性があります。

`NgIf` は違った動作をします。`NgIf` が `false` のとき、Angular は要素とその子孫を DOM から削除します。
コンポーネントも削除し、リソースを解放するので、
よりよいユーザー体験を提供できます。

大きなコンポーネントツリーを非表示にするときは、
より効率的な手段として `NgIf` を使うことを検討してください。

<div class="alert is-helpful">

`NgIf` と `ngIfElse` については [NgIf の API ドキュメント](api/common/NgIf)で詳しく知ることができます。

</div>

### null 対策 {@a guard-against-null}

`ngIf` のもうひとつの長所は null 対策として使えることです。
表示/非表示がとてもシンプルなユースケースで、もし null 対策が必要なら `ngIf` を使ってください。ネストされた式が `null` のプロパティにアクセスしようとすると、Angular はエラーを投げます。

次の例では、2つの `<div>` について `NgIf` で対策しています。
`currentCustomer` の名前は `currentCustomer` が存在するときだけ表示されます。
`nullCustomer` は、その値が `null` であれば表示されません。

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html"></code-example>

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2b" header="src/app/app.component.html"></code-example>

{@a ngFor}
## `NgFor`

`NgFor` は、項目のリストを表示する繰り返しディレクティブです。
ひとつの項目を表示するための HTML ブロックを定義し、
そのブロックをリストの各項目を表示するテンプレートとして使うよう Angular に伝えます。
繰り返しのプロセスは `*ngFor` に与えられたテキストが指示します。

次の例はシンプルな `<div>` に `NgFor` を適用したものです。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`ngFor` の前にアスタリスク (`*`) をつけるのを忘れないでください。
アスタリスクについての詳細は、[構造ディレクティブ](guide/structural-directives)の
[アスタリスク (*) 接頭辞](guide/structural-directives#the-asterisk--prefix)セクションを参照してください。

</div>

次の例が示すように、コンポーネント要素に対しても `NgFor` を使うことができます。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html"></code-example>

{@a microsyntax}

<div class="callout is-critical">
<header>*ngFor マイクロシンタックス</header>

`*ngFor` に与えられた文字列は[テンプレート式](guide/interpolation)ではありません。
それは*マイクロシンタックス*&mdash;Angular が解釈する独自の小さな言語です。
文字列 `"let item of items"` は次を意味します:

> *`items` 配列の各項目を取り出し、ローカルのループ変数 `item` として保存し、
繰り返しのたびにテンプレート HTML で使えるようにする。*

Angular はこの指示をホスト要素を囲む `<ng-template>` に変換し、
このテンプレートを繰り返し使って一連の新しい要素を作り、それぞれにリストの `item`
をバインディングします。
マイクロシンタックスについての詳細は[構造ディレクティブ](guide/structural-directives#microsyntax)ガイドをご覧ください。

</div>


{@a template-input-variable}

{@a template-input-variables}

### テンプレート入力変数

`item` の前にある `let` キーワードは、`item` という名前のテンプレート入力変数を作ります。
`ngFor` ディレクティブは、親コンポーネントの `items` プロパティが返す `items` 配列の中を反復し、
反復中は `item` に配列の現在の項目を設定します。

`item` を参照することで、
`ngFor` のホスト要素やその子孫から項目のプロパティにアクセスできます。
次の例では、まず補間で `item` を参照し、
次に `<app-item-detail>` コンポーネントの `item` プロパティのバインディングに渡しています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html"></code-example>

テンプレート入力変数についての詳細は
[構造ディレクティブ](guide/structural-directives#template-input-variable)をご覧ください。

### `index` を使った `*ngFor` {@a ngfor-with-index}

`NgFor` ディレクティブのコンテキストでの `index` プロパティは、
ゼロベースの各反復での配列の添字を返します。
テンプレート入力変数の中で `index` をつかまえて、それをテンプレートで使うことができます。

次の例では `index` を変数 `i` としてつかまえて、項目名とともに表示しています。

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`NgFor` は `NgForOf` ディレクティブによって実装されています。`last`、`even`、`odd` といった、その他の `NgForOf` コンテキストの変数については、
[NgForOf API リファレンス](api/common/NgForOf)をご覧ください。

</div>

{@a trackBy}
### `trackBy` を使った *ngFor {@a ngfor-with-trackby}

大きなリストで `NgFor` を使うと、項目ひとつの追加や削除といった小さな変更が、多数の DOM 操作を引き起こすことがあります。たとえば、サーバーへの再問い合わせの結果がほとんど表示済みのものであっても、すべての項目を新しく作り直してしまうことがあります。このとき Angular は、新しいオブジェクトの参照のリストが与えられたことしか分からず、新しい DOM 要素で古い DOM 要素を置き換えることしかできません。

`trackBy` を使うことで、これを効率化できます。
`NgFor` が追跡すべき値を返すメソッドを、コンポーネントに追加します。
この場合に返す値はヒーローの `id` の値です。`id` が表示済みであれば、
Angular はそれを追跡し、同じ `id` に対してはサーバーに再問い合わせしません。

<code-example path="built-in-directives/src/app/app.component.ts" region="trackByItems" header="src/app/app.component.ts"></code-example>

マイクロシンタックスの式で `trackBy` に `trackByItems()` メソッドを設定しています。

<code-example path="built-in-directives/src/app/app.component.html" region="trackBy" header="src/app/app.component.html"></code-example>

`trackBy` の効果を図示します。
"Reset items" では、新しい項目を同じ `item.id` で作っています。
"Change ids" では、新しい項目を新しい `item.id` で作っています。

* `trackBy` を使わないと、どちらのボタンでもすべての DOM 要素置き換えが発生します。
* `trackBy` を使うと、`id` を変更したときだけ要素の置き換えが発生します。

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngfor-trackby.gif" alt="Animation of trackBy">
</div>


<div class="alert is-helpful">

組み込みディレクティブは公開 API だけを使っています。
他のディレクティブが使えない非公開 API を特別に使っているといったことはありません。

</div>

{@a ngSwitch}
## `NgSwitch` ディレクティブ {@a the-ngswitch-directives}

NgSwitch は JavaScript の `switch` 文のようなものです。
いくつかの要素の中から、条件に応じてひとつの要素を表示します。
Angular は選ばれた要素だけを DOM に挿入します。
<!-- API Flagged -->
`NgSwitch` は、実際には、次の例のように協調する3つのディレクティブ
`NgSwitch`, `NgSwitchCase`, `NgSwitchDefault` の組み合わせです。

 <code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html"></code-example>

<figure>
  <img src="generated/images/guide/built-in-directives/ngswitch.gif" alt="Animation of NgSwitch">
</figure>

`NgSwitch` はコントローラーディレクティブです。`feature` のような
*スイッチ値* を返す式にバインドしてください。この例では `feature`
の値は文字列ですが、任意の型を使うことができます。

**`[ngSwitch]` へのバインド**について。`NgSwitch` は*構造*ディレクティブではなく*属性*ディレクティブなので、
`*ngSwitch` を設定しようとするとエラーになります。
これは DOM を直接操作するのではなく、対応するディレクティブの動作に手を加えています。

**`*ngSwitchCase` と `*ngSwitchDefault` へのバインド**について。
`NgSwitchCase` と `NgSwitchDefault` ディレクティブは、DOM に要素を追加、削除するため、
_構造_ ディレクティブです。

* `NgSwitchCase` は、バインドされた値がスイッチ値と同じなら DOM に要素を追加し、
異なれば DOM から要素を削除します。

* `NgSwitchDefault` は、どの `NgSwitchCase` も選択されていないときに DOM に要素を追加します。

スイッチディレクティブは、*コンポーネント要素*を追加、削除するときに特に便利です。
この例では、 `item-switch.components.ts` で定義している4つの `item` コンポーネントを切り替えています。
それぞれのコンポーネントは `item` [入力プロパティ](guide/inputs-outputs#input "Input property")を持ち、
親コンポーネントの `currentItem` にバインドされています。

スイッチディレクティブは、ネイティブ要素や Web Components に対しても動作します。
たとえば `<app-best-item>` になるケースを次のコードに置き換えることができます。

<code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html"></code-example>
