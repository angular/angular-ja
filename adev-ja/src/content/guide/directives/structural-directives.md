# 構造ディレクティブ

構造ディレクティブは、`<ng-template>`要素に適用され、その`<ng-template>`の内容を条件付きまたは繰り返しでレンダリングするディレクティブです。

## 使用例

このガイドでは、指定されたデータソースからデータを取得し、そのデータが利用可能になったときにテンプレートをレンダリングする構造ディレクティブを作成します。このディレクティブは、SQLキーワード`SELECT`にちなんで`SelectDirective`と呼ばれ、属性セレクター`[select]`と一致させます。

`SelectDirective`には、使用するデータソースの名前を指定する入力があり、`selectFrom`と呼びます。この入力の`select`プレフィックスは、[省略記法](#structural-directive-shorthand)にとって重要です。ディレクティブは、選択されたデータを提供するテンプレートコンテキストを使用して、`<ng-template>`をインスタンス化します。

以下は、`<ng-template>`に直接このディレクティブを適用した例です。

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

構造ディレクティブは、データが利用可能になるまで待機してから、`<ng-template>`をレンダリングできます。

HELPFUL: Angularの`<ng-template>`要素は、デフォルトでは何もレンダリングしないテンプレートを定義します。構造ディレクティブを適用せずに`<ng-template>`で要素をラップした場合、それらの要素はレンダリングされません。

詳細については、[ng-template API](api/core/ng-template)のドキュメントを参照してください。

## 構造ディレクティブの省略記法 {#structural-directive-shorthand}

Angularは、構造ディレクティブの省略記法をサポートしており、`<ng-template>`要素を明示的に記述する必要がなくなります。

構造ディレクティブは、アスタリスク(`*`)をディレクティブ属性セレクターの前に付けることで、要素に直接適用できます。たとえば、`*select`のようにします。Angularは、構造ディレクティブの前にあるアスタリスクを、ディレクティブをホストし、要素とその子孫を囲む`<ng-template>`に変換します。

以下は、`SelectDirective`を使用した例です。

```angular-html
<p *select="let data from source">The data is: {{data}}</p>
```

この例は、構造ディレクティブの省略記法の柔軟性を示しており、これはマイクロシンタックスと呼ばれることもあります。

このように使用した場合、構造ディレクティブとそのバインディングのみが`<ng-template>`に適用されます。`<p>`タグの他の属性やバインディングはそのまま残されます。たとえば、次の2つの形式は同等です。

```angular-html
<!-- 省略記法: -->
<p class="data-view" *select="let data from source">The data is: {{data}}</p>

<!-- 長形式の記法: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{data}}</p>
</ng-template>
```

省略記法は、一連の規則によって展開されます。以下に、より詳細な[文法](#structural-directive-syntax-reference)が定義されていますが、上記の例では、この変換を次のように説明できます。

`*select`式の最初の部分は`let data`で、テンプレート変数`data`を宣言しています。割り当てが続かないため、テンプレート変数はテンプレートコンテキストプロパティ`$implicit`にバインドされます。

2番目の構文は、キーと式のペアである`from source`です。`from`はバインディングキーで、`source`は通常のテンプレート式です。バインディングキーは、PascalCaseに変換し、構造ディレクティブセレクターを先頭に付けることで、プロパティにマップされます。`from`キーは`selectFrom`にマップされ、次に式`source`にバインドされます。そのため、多くの構造ディレクティブは、すべて構造ディレクティブのセレクターで始まるプレフィックスを持つ入力を持つことになります。

## 要素あたりの構造ディレクティブは1つのみ {#one-structural-directive-per-element}

省略記法を使用する場合、要素ごとに適用できる構造ディレクティブは1つだけです。これは、ディレクティブが展開される`<ng-template>`要素が1つしかないためです。複数のディレクティブには、複数の子ネストされた`<ng-template>`が必要であり、どのディレクティブを最初にすべきかは明確ではありません。`<ng-container>`は、同じ物理的なDOM要素またはコンポーネントに複数の構造ディレクティブを適用する必要がある場合に、ラッパーレイヤーを作成するために使用できます。これにより、ユーザーはネストされた構造を定義できます。

## 構造ディレクティブの作成

このセクションでは、`SelectDirective`の作成について説明します。

<docs-workflow>
<docs-step title="ディレクティブを生成">
Angular CLIを使用して、次のコマンドを実行します。ここで、`select`はディレクティブの名前です。

```shell
ng generate directive select
```

Angularは、ディレクティブクラスを作成し、テンプレートでディレクティブを識別するCSSセレクター`[select]`を指定します。
</docs-step>
<docs-step title="ディレクティブを構造化">
`TemplateRef`と`ViewContainerRef`をインポートします。`TemplateRef`と`ViewContainerRef`をプライベート変数としてディレクティブコンストラクターにインジェクトします。

```ts
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  constructor(private templateRef: TemplateRef, private ViewContainerRef: ViewContainerRef) {}
}

```

</docs-step>
<docs-step title="'selectFrom'入力を追加">
`selectFrom` `@Input()`プロパティを追加します。

```ts
export class SelectDirective {
  // ...

  @Input({required: true}) selectFrom!: DataSource;
}
```

</docs-step>
<docs-step title="ビジネスロジックを追加">
`SelectDirective`が、入力を持つ構造ディレクティブとしてスキャフォールディングされたので、データを取得し、テンプレートをデータと共にレンダリングするロジックを追加できます。

```ts
export class SelectDirective {
  // ...

  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // テンプレートコンテキストに`$implicit`キーでデータを含むオブジェクトが含まれるように、
      // 埋め込みビューを作成します。
      $implicit: data,
    });
  }
}
```

</docs-step>
</docs-workflow>

これで`SelectDirective`は起動して実行できるようになりました。次のステップとして、[テンプレートタイプチェックのサポートを追加](#typing-the-directives-context)できます。

## 構造ディレクティブの構文リファレンス

独自の構造ディレクティブを作成する際は、次の構文を使用します。

<docs-code hideCopy language="typescript">

*:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )*"

</docs-code>

次のパターンは、構造ディレクティブ文法の各部分を説明しています。

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| キーワード      | 詳細                                            |
| :----------- | :------------------------------------------------- |
| `prefix`     | HTML属性キー                                 |
| `key`        | HTML属性キー                                 |
| `local`      | テンプレートで使用されるローカル変数名           |
| `export`     | 与えられた名前の下でディレクティブによってエクスポートされる値 |
| `expression` | 標準的なAngular式                        |

### Angularが省略記法をどのように変換するか

Angularは、構造ディレクティブの省略記法を次の通常のバインディング構文に変換します。

| 省略記法 | 変換 |
|:--- |:--- |
| `prefix`と裸の`expression` | `[prefix]="expression"` |
| `keyExp` | `[prefixKey]="expression"` (`prefix`が`key`に追加されます) |
| `let local` | `let-local="export"` |

### 省略記法の例

次の表は、省略記法の例を示しています。

| 省略記法 | Angularが構文をどのように解釈するか |
|:--- |:--- |
| `*ngFor="let item of [1,2,3]"` | `<ng-template ngFor let-item [ngForOf]="[1, 2, 3]">` |
| `*ngFor="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template ngFor let-item [ngForOf]="[1,2,3]" let-items="ngForOf" [ngForTrackBy]="myTrack" let-i="index">` |
| `*ngIf="exp"`| `<ng-template [ngIf]="exp">` |
| `*ngIf="exp as value"` | `<ng-template [ngIf]="exp" let-value="ngIf">` |

## カスタムディレクティブのテンプレートタイプチェックを改善する

カスタムディレクティブのテンプレートタイプチェックを改善するには、ディレクティブ定義にテンプレートガードを追加します。
これらのガードは、Angularテンプレートタイプチェッカーがコンパイル時にテンプレート内の間違いを見つけるのに役立ち、ランタイムエラーを回避できます。
2種類のガードが可能です。

* `ngTemplateGuard_(input)`を使用すると、特定の入力の型に基づいて入力式をどのように絞り込むかを制御できます。
* `ngTemplateContextGuard`は、ディレクティブ自体の型に基づいて、テンプレートのコンテキストオブジェクトの型を判断するために使用されます。

このセクションでは、両方の種類のガードの例を示します。
詳細については、[テンプレートタイプチェック](tools/cli/template-typecheck "テンプレートタイプチェックガイド")を参照してください。

### テンプレートガードによるタイプの絞り込み

テンプレート内の構造ディレクティブは、そのテンプレートがランタイムにレンダリングされるかどうかを制御します。一部の構造ディレクティブは、入力式の型に基づいてタイプの絞り込みを実行したいと考えています。

入力ガードで可能な絞り込みは2つあります。

* TypeScriptの型アサーション関数に基づいて入力式を絞り込む。
* 入力式の真偽値に基づいて入力式を絞り込む。

型アサーション関数を定義して入力式を絞り込むには、次の手順を実行します。

```ts
// このディレクティブは、アクターがユーザーの場合にのみテンプレートをレンダリングします。
// テンプレート内では、`actor`式の型が`User`に絞り込まれていることを
// アサートしたいと考えています。
@Directive(...)
class ActorIsUser {
  @Input() actor: User|Robot;

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User|Robot): expr is User {
    // 実際にはreturn文は不要ですが、
    // TypeScriptエラーを防ぐために含めています。
    return true;
  }
}
```

タイプチェックは、`ngTemplateGuard_actor`が入力にバインドされた式に対してアサートされたかのように、テンプレート内で動作します。

一部のディレクティブは、入力の真偽値が真の場合にのみテンプレートをレンダリングします。真偽値の完全な意味を型アサーション関数で捉えることはできないため、代わりに`'binding'`というリテラル型を使用して、テンプレートタイプチェッカーに、バインディング式自体をガードとして使用する必要があることを示すことができます。

```ts
@Directive(...)
class CustomIf {
  @Input() condition!: any;

  static ngTemplateGuard_condition: 'binding';
}
```

テンプレートタイプチェッカーは、`condition`にバインドされた式がテンプレート内で真であるとアサートされたかのように動作します。

### ディレクティブのコンテキストの型付け {#typing-the-directives-context}

構造ディレクティブがインスタンス化されたテンプレートにコンテキストを提供する場合、ディレクティブ自体型に基づいてコンテキストの型を導き出すことができる静的`ngTemplateContextGuard`型アサーション関数を提供することで、テンプレート内でそのコンテキストを正しく型付けできます。これは、ディレクティブの型がジェネリックである場合に役立ちます。

上記の`SelectDirective`では、データソースがジェネリックであっても、`ngTemplateContextGuard`を実装してデータ型を正しく指定できます。

```ts
// テンプレートコンテキストのインターフェースを宣言します。
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // ディレクティブのジェネリック型`T`は、
  // 入力に渡される`DataSource`型から推測されます。
  @Input({required: true}) selectFrom!: DataSource<T>;

  // ジェネリック型のディレクティブを使用して、コンテキストの型を絞り込みます。
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // 前述のように、ガードの本体は実行時に使用されず、
    // TypeScriptエラーを防ぐためだけに含まれています。
    return true;
  }
}
```
