# 構造ディレクティブの記述

このトピックでは、構造ディレクティブを作成する方法を示し、ディレクティブがどのように機能するのか、Angularがどのように短縮表記を解釈するのか、テンプレートの型エラーをキャッチするためにテンプレートガードプロパティを追加する方法など、概念的な情報を説明します。

<div class="alert is-helpful">

このトピックで使用されているサンプルコードを表示またはダウンロードするには、<live-example></live-example> を参照してください。

</div>

Angularにビルトインされているディレクティブ(たとえば、`NgIf`, `NgForOf`, `NgSwitch` など)については、[組み込みディレクティブ](guide/built-in-directives) を参照してください。

{@a unless}

## 構造ディレクティブの作成

ここでは `UnlessDirective` の作成方法と `condition` の値の設定方法について説明します。
`UnlessDirective` は `NgIf` と反対のことを行わせ、`condition` の値は `true` または `false` に設定できるようにします。
`NgIf` は、条件が `true` のときにテンプレートの内容を表示します。
`UnlessDirective` は、条件が `false` のときにテンプレートの内容を表示させます。

以下は、`UnlessDirective` のセレクターである `appUnless` をパラグラフ要素に適用したものです。
条件が `false` のとき、ブラウザは文章を表示します。

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless-1)" region="appUnless-1"></code-example>

1. Angular CLIを使って、次のコマンドを実行します。`unless` はディレクティブの名前です。

  ```bash

  ng generate directive unless

  ```

  Angularは、ディレクティブクラスを作成し、テンプレートの中でディレクティブを識別するCSSセレクターとして `appUnless` を設定します。

1. `Input`, `TemplateRef`, `ViewContainerRef` をインポートします。

  <code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (skeleton)" region="skeleton"></code-example>

1. ディレクティブのコンストラクターに、`TemplateRef` と `ViewContainerRef` をプライベート変数としてインジェクトします。

  <code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (ctor)" region="ctor"></code-example>

  `UnlessDirective` は、Angularが生成した `<ng-template>` から [埋め込みビュー](api/core/EmbeddedViewRef "API: EmbeddedViewRef") を作成し、そのビューを、ディレクティブの元のホスト要素 `<p>` に隣接する [ビューコンテナー](api/core/ViewContainerRef "API: ViewContainerRef") に挿入します。

  [`TemplateRef`](api/core/TemplateRef "API: TemplateRef")は、`<ng-template>`のコンテンツにアクセスし、[`ViewContainerRef`](api/core/ViewContainerRef "API: ViewContainerRef")は、ビューコンテナーにアクセスします。

1. セッターとしての `appUnless` `@Input()` プロパティを追加します。

  <code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (set)" region="set"></code-example>

  Angularは、条件の値が変更されるたびに `appUnless` プロパティを設定します。

    * 条件が `false` で、Angularが以前にビューを作成したことがない場合、セッターはビューコンテナーにテンプレートから埋め込みビューを作成させます。

    * 条件が `true` で、ビューが現在表示されている場合、セッターはコンテナーをクリアし、コンテナーはビューを破棄します。

完全なディレクティブは次のとおりです:

<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (excerpt)" region="no-docs"></code-example>

### ディレクティブのテスト

このセクションでは、アプリケーションを更新して `UnlessDirective` をテストします。

1. `AppComponent` に `false` に設定された `condition` を追加します。

  <code-example path="structural-directives/src/app/app.component.ts" header="src/app/app.component.ts (excerpt)" region="condition"></code-example>

1. ディレクティブを使用するようにテンプレートを更新します。
   ここで、`*appUnless` は反対の `condition`値をもつ2つの `<p>` タグ上にあります。1つは `true`、もう1つは `false` です。

  <code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless)" region="appUnless"></code-example>

  アスタリスク(`*`)は、構造ディレクティブとして `appUnless` をマークする短縮表記です。
   `condition` が `false` の場合、上の（A）の段落が表示され、下（B）の段落が消えます。
   `condition` が `true` の場合、上（A）の段落が消え、下（B）の段落が表示されます。

1. ブラウザで `condition`値を変更して表示するには、ステータスとボタンを表示するマークアップを追加します。

  <code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html" region="toggle-info"></code-example>

このディレクティブが機能することを確認するには、ボタンをクリックして `condition` の値を変更します。

  <div class="lightbox">
    <img src='generated/images/guide/structural-directives/unless-anim.gif' alt="UnlessDirective in action">
  </div>


{@a shorthand}
{@a asterisk}

## 構造ディレクティブの短縮表記 {@a structural-directive-shorthand}

`*ngIf` などの構造ディレクティブのアスタリスク `*` 構文は、Angularがより長い形式に解釈するための短縮表記です。
Angularは、構造ディレクティブの前のアスタリスクを、ホスト要素とその子孫を囲む `<ng-template>` に変換します。

以下は、`hero` が存在する場合にヒーローの名前を表示する `*ngIf` の例です:

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (asterisk)" region="asterisk"></code-example>

`*ngIf` ディレクティブは `<ng-template>` に移動し、角括弧 `[ngIf]` でバインドされたプロパティになります。
クラス属性を含む残りの `<div>` は、`<ng-template>` 内に移動します。

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-template)" region="ngif-template"></code-example>

Angularは実際の `<ng-template>`要素を作成せず、代わりに `<div>` とコメントノードプレースホルダーのみをDOMにレンダリングします。

```html
<!--bindings={
  "ng-reflect-ng-if": "[object Object]"
}-->
<div _ngcontent-c0>Mr. Nice</div>

```

次の例では、アスタリスクを使用する短縮記法の `*ngFor`形式と `<ng-template>`形式を比較しています:

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (inside-ngfor)" region="inside-ngfor"></code-example>

ここでは、`ngFor`構造ディレクティブに関連するすべてのものが `<ng-template>` に適用されます。
要素上の他のバインディングや属性はすべて、`<ng-template>`内の `<div>` 要素に適用されます。
ホスト要素上の他の修飾子は、`ngFor` の文字列に加えて、要素が `<ng-template>`内を移動する際にもそのまま適用されます。
この例では、`[class.odd]="odd"` は `<div>` に残ります。

`let` キーワードは、テンプレート内で参照できるテンプレート入力変数を宣言します。
この例の入力変数は、 `hero`、`i`、および `odd` です。
パーサーは、 `let hero`、`let i`、および `let odd` を `let-hero`、`let-i`、および `let-odd` という名前の変数に変換します。
`let-i`変数と `let-odd`変数は `let i = index` と `let odd = odd` になります。
Angularは `i` と `odd` をコンテキストの `index` と `odd` プロパティを現在の値に設定します。

パーサーはパスカルケース(PascalCase)をすべてのディレクティブに適用し、それらの前に `ngFor` などのディレクティブの属性名を付けます。
たとえば、`ngFor` の入力プロパティである `of` と `trackBy` は、`ngForOf` と  `ngForTrackBy` にマッピングされます。
`NgFor`ディレクティブがリストをループすると、独自のコンテキストオブジェクトのプロパティが設定およびリセットされます。
これらのプロパティには、`index`、`odd`、および `$implicit` という名前の特別なプロパティを含めることができますが、
これらに限定されません。

Angularは `let-hero` をコンテキストの `$implicit` プロパティの値に設定します。これは `NgFor` が現在のイテレーション中に `hero` で初期化したものです。

詳細については [NgFor API](api/common/NgForOf "API: NgFor") と [NgForOf API](api/common/NgForOf) のドキュメントを参照してください。

### `<ng-template>` を使用してテンプレートフラグメントを作成する

Angularの `<ng-template>`要素は、デフォルトでは何もレンダリングしないテンプレートを定義します。
`<ng-template>`を使用すると、コンテンツを手動でレンダリングして、コンテンツの表示方法を完全に制御できます。

構造ディレクティブがない状態で、一部の要素を `<ng-template>`でラップすると、それらの要素は表示されなくなります。
次の例では、Angularはフレーズの中の真ん中の "Hip!"をレンダリングしません。"Hip! Hip! Hooray!" の真ん中の "Hip!" は、`<ng-template>` で囲まれているためにレンダリングされません。

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (template-tag)" region="template-tag"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/structural-directives/template-rendering.png' alt="template tag rendering">
</div>

## 構造ディレクティブの構文リファレンス

独自の構造ディレクティブを作成する場合は、次の構文を使用してください:

```
*:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )*"
```

次の表では、構造ディレクティブ構文の各部分について説明します:

<table>

  <tr>
    <td><code>prefix</code></td>
    <td>HTML属性接頭辞</td>
  </tr>
  <tr>
    <td><code>key</code></td>
    <td>HTML属性キー</td>
  </tr>
  <tr>
    <td><code>local</code></td>
    <td>テンプレートで使用されるローカル変数名</td>
  </tr>
  <tr>
    <td><code>export</code></td>
    <td>指定された名前でディレクティブによってエクスポートされた値</td>
  </tr>
  <tr>
    <td><code>expression</code></td>
    <td>標準のAngular式</td>
  </tr>
</table>

<table>
  <tr>
    <th></th>
  </tr>
  <tr>
    <td colspan="3"><code>keyExp = :key ":"? :expression ("as" :local)? ";"? </code></td>
  </tr>
  <tr>
    <td colspan="3"><code>let = "let" :local "=" :export ";"?</code></td>
  </tr>
  <tr>
    <td colspan="3"><code>as = :export "as" :local ";"?</code></td>
  </tr>
</table>

### どのようにAngularが短縮表記を変換するか

Angularは、構造ディレクティブの短縮表記を次のように通常のバインディング構文に変換します:

<table>
  <tr>
    <th>短縮表記</th>
    <th>変換</th>
  </tr>
  <tr>
    <td><code>prefix</code> と そのままの <code>expression</code></td>
    <td><code>[prefix]="expression"</code></td>
  </tr>
  <tr>
    <td><code>keyExp</code></td>
    <td><code>[prefixKey] "expression"
    (let-prefixKey="export")</code>
    <br />
    <code>prefix</code> が
    <code>key</code> に追加されていることに注意してください
    </td>
  </tr>
  <tr>
    <td><code>let</code></td>
    <td><code>let-local="export"</code></td>
  </tr>
</table>

### 短縮表記 例

次の表に、簡単な例を示します:

<table>
  <tr>
    <th>短縮表記</th>
    <th>Angularが構文を解釈する方法</th>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3]"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3] as items; trackBy: myTrack; index as i"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]" let-items="ngForOf" [ngForTrackBy]="myTrack" let-i="index"&gt;</code>
    </td>
  </tr>
  <tr>
    <td><code>*ngIf="exp"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngIf="exp as value"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp" let-value="ngIf"&gt;</code></td>
  </tr>
</table>

{@a directive-type-checks}

<!-- To do follow up PR: move this section to a more general location because it also applies to attribute directives. -->
## 独自ディレクティブのテンプレート型チェックの改善

テンプレートガードプロパティをディレクティブ定義に追加することで、独自ディレクティブのテンプレート型チェックを改善できます。
これらのプロパティは、Angularのテンプレート型チェッカーがコンパイル時にテンプレートの間違いを見つけるのに役立ち、ランタイムエラーを回避できます。
これらのプロパティは次のとおりです:

* プロパティ `ngTemplateGuard_(someInputProperty)` を使用すると、テンプレート内の入力式により正確な型を指定できます。
* `ngTemplateContextGuard` 静的プロパティは、テンプレートコンテキストの型を宣言します。

このセクションでは、両方の種類の型ガードプロパティの例を示します。
詳細については、[テンプレート型チェック](guide/template-typecheck "Template type-checking guide")を参照してください。

{@a narrowing-input-types}

### テンプレートガードを使用して、テンプレート内の型要件をより具体的にする

テンプレート内の構造ディレクティブは、その入力式に基づいて、そのテンプレートが実行時にレンダリングされるかどうかを制御します。
コンパイラがテンプレートの型エラーを検出しやすくするために、テンプレート内で入力式が発生した場合には、指令の入力式に要求される型をできるだけ細かく指定する必要があります。

型ガード関数は、入力式の予想される型を、実行時にテンプレート内のディレクティブに渡される可能性のある型のサブセットに絞り込みます。
このような関数を提供して、型チェッカーがコンパイル時に式の適切な型を推測できるようにします。

たとえば、`NgIf` の実装では、型の絞り込みを使用して、`*ngIf` への入力式が `true` である場合にのみテンプレートがインスタンス化されるようにしています。
特定の型要件を提供するために、`NgIf` ディレクティブは
[静的プロパティ `ngTemplateGuard_ngIf: 'binding'`](api/common/NgIf#static-properties) を定義しています。
`binding` の値は、入力式を評価して型の要件を満たすという、一般的な型の絞り込みのための特殊なケースです。

テンプレート内のディレクティブへの入力式に、より具体的な型を提供するには、ディレクティブに `ngTemplateGuard_xx`プロパティを追加します。ここでの静的プロパティ名の接尾辞 `xx` は `@Input()` フィールド名です。
プロパティの値は、戻り値の型に基づく一般的な型絞り関数、または `NgIf`の場合のように文字列 `"binding"` のいずれかになります。

たとえば、テンプレート式の結果を入力として受け取る次の構造ディレクティブについて考えてみます:

<code-example language="ts" header="IfLoadedDirective">
export type Loaded<T> = { type: 'loaded', data: T };
export type Loading = { type: 'loading' };
export type LoadingState<T> = Loaded<T> | Loading;
export class IfLoadedDirective<T> {
    @Input('ifLoaded') set state(state: LoadingState<T>) {}
    static ngTemplateGuard_state<T>(dir: IfLoadedDirective<T>, expr: LoadingState<T>): expr is Loaded<T> { return true; };
}

export interface Person {
  name: string;
}

@Component({
  template: `&lt;div *ifLoaded="state">{{ state.data }}&lt;/div>`,
})
export class AppComponent {
  state: LoadingState<Person>;
}
</code-example>

この例では、`LoadingState<T>` は、`Loaded<T>` または `Loading` の2つの状態のいずれかを許可します。ディレクティブの `state` を入力として使用される式は、その時点でのロード状態が不明であるため、包括的な `LoadingState` 型です。

`ifLoadedDirective` の定義では、絞り込みの動作を表現する静的関数 `ngTemplateGuard_state` を宣言しています。
`AppComponent` テンプレートの中で、`*ifLoaded` 構造ディレクティブは、`state` が実際に `Loaded<Person>` である場合にのみ、このテンプレートをレンダリングすべきです。
型ガードにより、型チェッカーはテンプレート内の `state` の許容する型が `Loaded<T>` であることを推論し、さらに `T` が `Person` のインスタンスでなければならないことを推論します。

{@a narrowing-context-type}

### ディレクティブのコンテキスト入力

構造ディレクティブがインスタンス化されたテンプレートにコンテキストを提供している場合、静的な `ngTemplateContextGuard` 関数を用意することで、テンプレート内部で適切な型を参照し入力することができます。
次のスニペットはそのような関数の例を示しています。

<code-example language="ts" header="myDirective.ts">
@Directive({…})
export class ExampleDirective {
    // テンプレートチェッカーが、このディレクティブのテンプレートが
    // レンダリングされるコンテキストの型を認識していることを確認してください。
    static ngTemplateContextGuard(dir: ExampleDirective, ctx: unknown): ctx is ExampleContext { return true; };

    // …
}
</code-example>
