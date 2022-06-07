# Ahead-of-time (AOT) コンパイラ

Angular アプリケーションは、主にコンポーネントとその HTML テンプレートで構成されています。Angular が提供するコンポーネントとテンプレートはブラウザで直接理解できないため、Angular アプリケーションをブラウザで実行するにはコンパイルプロセスが必要です。

Angular の [ahead-of-time (AOT) コンパイラ](guide/glossary#aot) は、ブラウザがそのコードをダウンロードして実行する _前_ に、ビルドフェーズ中にAngular HTML コードと TypeScript コードを効率的な JavaScript コードに変換します。ビルドプロセス中にアプリケーションをコンパイルすると、ブラウザでのレンダリングが速くなります。

このガイドでは、AOT コンパイラを使用してアプリケーションを効率的にコンパイルするためのメタデータの指定方法と利用可能なコンパイラオプションの適用方法について説明します。

<div class="alert is-helpful">

[Watch Alex Rickabaugh explain the Angular compiler](https://www.youtube.com/watch?v=anphffaCZrQ) at AngularConnect 2019.

</div>

<a id="why-aot"></a>

AOTを使用する理由は次のとおりです。

| Reasons                                 | Details |
|:---                                     |:---     |
| Faster rendering                        | With AOT, the browser downloads a pre-compiled version of the application. The browser loads executable code so it can render the application immediately, without waiting to compile the application first.                                       |
| Fewer asynchronous requests             | The compiler *inlines* external HTML templates and CSS style sheets within the application JavaScript, eliminating separate ajax requests for those source files.                                                                                  |
| Smaller Angular framework download size | There's no need to download the Angular compiler if the application is already compiled. The compiler is roughly half of Angular itself, so omitting it dramatically reduces the application payload.                                              |
| Detect template errors earlier          | The AOT compiler detects and reports template binding errors during the build step before users can see them.                                                                                                                                      |
| Better security                         | AOT compiles HTML templates and components into JavaScript files long before they are served to the client. With no templates to read and no risky client-side HTML or JavaScript evaluation, there are fewer opportunities for injection attacks. |

<a id="overview"></a>

## コンパイラの選択

Angular には、アプリケーションをコンパイルする2つの方法があります。

| Angular compile       | Details |
|:---                   |:---     |
| Just-in-Time \(JIT\)  | Compiles your application in the browser at runtime. This was the default until Angular 8.        |
| Ahead-of-Time \(AOT\) | Compiles your application and libraries at build time. This is the default starting in Angular 9. |

When you run the [`ng build`](cli/build) \(build only\) or [`ng serve`](cli/serve) \(build and serve locally\) CLI commands, the type of compilation \(JIT or AOT\) depends on the value of the `aot` property in your build configuration specified in `angular.json`.
By default, `aot` is set to `true` for new CLI applications.

詳細については、[CLI コマンドリファレンス](cli) および [Angularアプリのビルドとサーブ](guide/build)を参照してください。

## どのようにAOTは機能するか

AngularのAOTコンパイラは、Angularが管理することになるアプリケーションの部分を解釈するために**メタデータ**を抽出します。
`@Component()`や`@Input()`などの**デコレーター**において明示的に、または修飾されるクラスのコンストラクター宣言において暗黙的に、メタデータを指定できます。
メタデータは、どのようにアプリケーションのクラスのインスタンスを構築して実行時にそれらと相互作用するかをAngularに教えます。

次の例では、`@Component()` メタデータオブジェクトとクラスコンストラクターは Angular に `TypicalComponent` のインスタンスを作成し表示する方法を伝えます。

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'app-typical',
  template: '&lt;div&gt;A typical component for {{data.name}}&lt;/div&gt;'
})
export class TypicalComponent {
  &commat;Input() data: TypicalData;
  constructor(private someService: SomeService) { &hellip; }
}

</code-example>

Angular コンパイラはメタデータを _1回_ 抽出し、 `TypicalComponent` に対して _ファクトリ_ を生成します。
`TypicalComponent` インスタンスを作成する必要があるとき、Angular はファクトリを呼び出します。ファクトリは注入された依存関係をもつコンポーネントクラスの新しいインスタンスにバインドされた新しいビジュアル要素を生成します。

### コンパイルフェーズ

AOTコンパイルには三つのフェーズがあります。

|     | Phase                  | Details |
|:--- |:---                    |:---     |
| 1   | code analysis          | In this phase, the TypeScript compiler and *AOT collector* create a representation of the source. The collector does not attempt to interpret the metadata it collects. It represents the metadata as best it can and records errors when it detects a metadata syntax violation.                        |
| 2   | code generation        | In this phase, the compiler's `StaticReflector` interprets the metadata collected in phase 1, performs additional validation of the metadata, and throws an error if it detects a metadata restriction violation.                                                                                        |
| 3   | template type checking | In this optional phase, the Angular *template compiler* uses the TypeScript compiler to validate the binding expressions in templates. You can enable this phase explicitly by setting the `fullTemplateTypeCheck` configuration option; see [Angular compiler options](guide/angular-compiler-options). |

### メタデータ制約

TypeScript の _サブセット_ にメタデータを記述します。これは、次の一般的な制約に従う必要があります。

*   [式の構文](#expression-syntax) をサポートされている JavaScript のサブセットに制限します
*   [コード折りたたみ](#code-folding)の後、エクスポートされたシンボルだけを参照します
*   コンパイラによって[サポートされている関数](#supported-functions)だけを呼び出します
*   修飾されデータバインドされたクラスメンバーはパブリックでなければなりません

AOTコンパイル用のアプリケーションを準備するための追加のガイドラインと説明については、[Angular: Writing AOT-friendly applications](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f)を参照してください。

<div class="alert is-helpful">

AOTコンパイルでのエラーは一般的に、コンパイラの要求(以降でより完全に説明します)に準拠しないメタデータによって起こります。
これらの問題の理解と解決のヘルプは、[AOTメタデータエラー](guide/aot-metadata-errors)を参照してください。

</div>

### AOTコンパイルを設定する

[TypeScript設定ファイル](guide/typescript-configuration)においてオプションを加えることで、コンパイルプロセスを制御できます。利用可能なオプションの完全なリストについては[Angularコンパイラオプション](guide/angular-compiler-options)を参照してください。

## フェーズ 1: コード解析

TypeScriptコンパイラは最初のフェーズの解析的な仕事をいくつかします。それは、アプリケーションコードを生成するためにAOTコンパイラが必要とする型情報をもつ、_型定義ファイル_`.d.ts`を発行します。
同時に、AOT**コレクター**はAngularデコレーターに記録されたメタデータを解析し、`.d.ts`ファイルごとに1つの**`.metadata.json`**ファイルにメタデータ情報を出力します。

`.metadata.json` は、[抽象構文木 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として表されるデコレーターのメタデータの全体的な構造の図と考えることができます。

<div class="alert is-helpful">

Angular の [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts)
には、TypeScript インターフェースの集まりとして JSON 形式が記述されています。

</div>

<a id="expression-syntax"></a>

### 式の構文制約

AOTコレクター は JavaScript のサブセットしか理解できません。
次の限られた構文でメタデータオブジェクトを定義します。

| Syntax                    | Example |
|:---                       |:---     |
| Literal object            | `{cherry: true, apple: true, mincemeat: false}`                        |
| Literal array             | `['cherries', 'flour', 'sugar']`                                       |
| Spread in literal array   | `['apples', 'flour', ...]`                                |
| Calls                     | `bake(ingredients)`                                                    |
| New                       | `new Oven()`                                                           |
| Property access           | `pie.slice`                                                            |
| Array index               | `ingredients[0]`                                                       |
| Identity reference        | `Component`                                                            |
| A template string         | <code>&grave;pie is &dollar;{multiplier} times better than cake&grave;</code> |
| Literal string            | `'pi'`                                                                 |
| Literal number            | `3.14153265`                                                           |
| Literal boolean           | `true`                                                                 |
| Literal null              | `null`                                                                 |
| Supported prefix operator | `!cake`                                                                |
| Supported binary operator | `a+b`                                                                  |
| Conditional operator      | `a ? b : c`                                                            |
| Parentheses               | `(a+b)`                                                                |

式がサポートされていない構文を使う場合、コレクターはエラーノードを `.metadata.json` ファイルに書き込みます。アプリケーションコードを生成するためにその部分のメタデータが必要な場合、
コンパイラは後でエラーを報告します。

<div class="alert is-helpful">

 エラーを伴う `.metadata.json` ファイルを生成せずに `ngc` に構文エラーを即座に報告させたい場合は、TypeScript設定ファイルの `strictMetadataEmit` オプションを設定してください。

<code-example format="json" language="json">

"angularCompilerOptions": {
  &hellip;
  "strictMetadataEmit" : true
}

</code-example>

Angular ライブラリはすべての Angular の `.metadata.json` ファイルがクリーンであることを保証するためにこのオプションを持っています、そして自身のライブラリを構築するとき同じことをするのはベストプラクティスです。

</div>

<a id="function-expression"></a>
<a id="arrow-functions"></a>

### アロー関数は使えません

AOTコンパイラは[関数式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function)および
_ラムダ_ 関数とも呼ばれる[アロー関数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)をサポートしていません。

次のコンポーネントデコレーターを考えてみましょう。

<code-example format="typescript" language="typescript">

&commat;Component({
  &hellip;
  providers: [{provide: server, useFactory: () =&gt; new Server()}]
})

</code-example>

AOTコレクターはメタデータ式ではアロー関数 `() => new Server()` をサポートしません。
関数の代わりにエラーノードを生成します。
コンパイラが後でこのノードを解釈すると、アロー関数を _エクスポートされた関数_ に変換するように促すエラーが報告されます。

これを変換することでエラーを修正できます。

<code-example format="typescript" language="typescript">

export function serverFactory() {
  return new Server();
}

&commat;Component({
  &hellip;
  providers: [{provide: server, useFactory: serverFactory}]
})

</code-example>

バージョン 5 以降、コンパイラは `.js` ファイルを出力しながらこの書き換えを自動的に実行します。

<a id="exported-symbols"></a>
<a id="code-folding"></a>

### コードの折りたたみ

コンパイラは **_エクスポートされた_** シンボルへの参照しか解決できません。
それでもコレクターは収集中に式を評価し、オリジナルの式ではなくその結果を`.metadata.json`に記録できます。
これにより、式内のエクスポートされていないシンボルを限定的に使用できます。

たとえば、コレクターは式 `1 + 2 + 3 + 4` を評価し、それを結果 `10` で置き換えることができます。
このプロセスは _折りたたみ_ と呼ばれます。この方法で縮小できる式は _折りたたみ可能_ です。

<a id="var-declaration"></a>

コレクターはモジュールローカルな `const` 宣言と初期化された `var` と `let` 宣言への参照を評価することができ、事実上 `.metadata.json` ファイルからそれらを削除します。

次のコンポーネント定義を考えてみてください。

<code-example format="typescript" language="typescript">

const template = '&lt;div&gt;{{hero.name}}&lt;/div&gt;';

&commat;Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  &commat;Input() hero: Hero;
}

</code-example>

エクスポートされていないので、コンパイラは `template` 定数を参照できませんでした。
それでもコレクターは`template`定数をその内容をインラインにすることでメタデータ定義へ折りたたみできます。
効果はあなたが書いた場合と同じです。

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'app-hero',
  template: '&lt;div&gt;{{hero.name}}&lt;/div&gt;'
})
export class HeroComponent {
  &commat;Input() hero: Hero;
}

</code-example>

`template`への参照がなくなり、コンパイラが後で`.metadata.json`における_コレクターの_出力を解釈したときにコンパイラを煩わせることはなくなりました。

別の式に `template` 定数を含めることでこの例をさらに一歩進めることができます。

<code-example format="typescript" language="typescript">

const template = '&lt;div&gt;{{hero.name}}&lt;/div&gt;';

&commat;Component({
  selector: 'app-hero',
  template: template + '&lt;div&gt;{{hero.title}}&lt;/div&gt;'
})
export class HeroComponent {
  &commat;Input() hero: Hero;
}

</code-example>

コレクターはこの式をそれに相当する_折りたたんだ_文字列に変換します。

<code-example format="typescript" language="typescript">

'&lt;div&gt;{{hero.name}}&lt;/div&gt;&lt;div&gt;{{hero.title}}&lt;/div&gt;'

</code-example>

#### 折りたたみ可能な構文

次の表は、コレクターがどの式を折りたたむことができるかどうかを示しています。

| Syntax                           | Foldable |
|:---                              |:---      |
| Literal object                   | yes                                      |
| Literal array                    | yes                                      |
| Spread in literal array          | no                                       |
| Calls                            | no                                       |
| New                              | no                                       |
| Property access                  | yes, if target is foldable               |
| Array index                      | yes, if target and index are foldable    |
| Identity reference               | yes, if it is a reference to a local     |
| A template with no substitutions | yes                                      |
| A template with substitutions    | yes, if the substitutions are foldable   |
| Literal string                   | yes                                      |
| Literal number                   | yes                                      |
| Literal boolean                  | yes                                      |
| Literal null                     | yes                                      |
| Supported prefix operator        | yes, if operand is foldable              |
| Supported binary operator        | yes, if both left and right are foldable |
| Conditional operator             | yes, if condition is foldable            |
| Parentheses                      | yes, if the expression is foldable       |

式が折りたたみ可能ではない場合、コレクターはそれをコンパイラが解決するための [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として `.metadata.json` に書き込みます。


## フェーズ 2: コード生成

コレクターは、メタデータを収集して `.metadata.json` に出力しますが、そのメタデータを理解しようとはしません。
可能な限りメタデータとして表現し、メタデータ構文の違反を検出したときにエラーを記録します。
コード生成フェーズで `.metadata.json` を解釈するのはコンパイラの仕事です。

コンパイラはコレクターがサポートするすべての構文形式を理解しますが、_セマンティックス_ がコンパイラの規則に違反している場合は、_構文として_ 正しいメタデータを拒否することがあります。

### 公開されたシンボル

コンパイラは _エクスポートされたシンボル_ しか参照できません。

*   デコレートされたコンポーネントクラスメンバは公開されている必要があります。`@Input()` プロパティを非公開にしたり、保護することはできません。
*   データバインドプロパティも公開されている必要があります。

<!--<code-example format="typescript" language="typescript">

// BAD CODE - title is private
&commat;Component({
  selector: 'app-root',
  template: '&lt;h1&gt;{{title}}&lt;/h1&gt;'
})
export class AppComponent {
  private title = 'My App'; // Bad
}

</code-example>-->

<a id="supported-functions"></a>

### サポートされるクラスと関数

コレクターは関数呼び出しや`new`によるオブジェクト作成を構文が正しいものとして表現できます。
ところがコンパイラは、_特殊な_関数の呼び出しや_特殊な_オブジェクトの作成について後で生成を拒否できます。

コンパイラは、コアデコレーターのみをサポートする、そして式を戻すマクロ(関数や静的メソッド)の呼び出しのみをサポートする、特定のクラスのインスタンスのみを作成できます。

| Compiler action      | Details |
|:---                  |:---     |
| New instances        | The compiler only allows metadata that create instances of the class `InjectionToken` from `@angular/core`.                                            |
| Supported decorators | The compiler only supports metadata for the [Angular decorators in the `@angular/core` module](api/core#decorators).                                   |
| Function calls       | Factory functions must be exported, named functions. The AOT compiler does not support lambda expressions \("arrow functions"\) for factory functions. |

<a id="function-calls"></a>

### 関数と静的メソッドの呼び出し

コレクターは1つの`return`文を含むどんな関数や静的メソッドも受け入れます。
ところがコンパイラは、*式*を戻す関数や静的メソッドの形式のマクロのみをサポートします。

たとえば、次の関数を考えてください:

<code-example format="typescript" language="typescript">

export function wrapInArray&lt;T&gt;(value: T): T[] {
  return [value];
}

</code-example>

メタデータ定義の中で `wrapInArray` を呼び出すことができます。それはコンパイラの制限的な JavaScript サブセットに準拠する式の値を返すからです。

このように `wrapInArray()` を使うかもしれません:

<code-example format="typescript" language="typescript">

&commat;NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}

</code-example>

コンパイラはこの使用法を、あなたが書いたかのように扱います:

<code-example format="typescript" language="typescript">

&commat;NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}

</code-example>

Angular の [`RouterModule`](api/router/RouterModule) は、ルートと子ルートを宣言するのに役立つように、2つのマクロ静的メソッド `forRoot` と `forChild` をエクスポートします。
これらのメソッドの[ソースコード](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 "RouterModule.forRoot source code")を調べて、
複雑な [NgModules](guide/ngmodules) の構成をマクロで簡単にする方法を確認してください。

<a id="metadata-rewriting"></a>

### メタデータの書き換え

コンパイラは `useClass`、`useValue`、`useFactory`、および `data` の各フィールドを含むオブジェクトリテラルを特別に扱い、これらのフィールドの1つを初期化する式をエクスポートされた変数に変換します。この変数が式を置き換えます。
これらの式を書き換えるこのプロセスは、式に含まれる可能性があるものに対するすべての制限を取り除きます。
なぜならば、コンパイラは式の値を知る必要がなく、つまり値への参照だけを生成できればよいからです。

あなたはこんな風に書くかもしれません:

<code-example format="typescript" language="typescript">

class TypicalServer {

}

&commat;NgModule({
  providers: [{provide: SERVER, useFactory: () =&gt; TypicalServer}]
})
export class TypicalModule {}

</code-example>

書き換えなしでは、ラムダはサポートされておらず`TypicalServer`はエクスポートされていないため、これは不正になります。
これを許可するため、コンパイラは自動でこんな風に書き換えます。

<code-example format="typescript" language="typescript">

class TypicalServer {

}

export const &theta;0 = () =&gt; new TypicalServer();

&commat;NgModule({
  providers: [{provide: SERVER, useFactory: &theta;0}]
})
export class TypicalModule {}

</code-example>

これにより、コンパイラは、`ɵ0` の値に何が含まれているのかを知らなくても、ファクトリー内で `ɵ0` への参照を生成できます。

コンパイラは `.js` ファイルの発行中に書き換えを行います。
ただし、これは `.d.ts` ファイルを書き換えないため、TypeScript はそれをエクスポートとして認識しません。したがって、それは ES モジュールのエクスポートされた API を汚染しません。


<a id="binding-expression-validation"></a>

## フェーズ 3: テンプレート型チェック

Angularコンパイラのもっとも役立つ特徴の1つは、テンプレート内の式を型チェックしてそれらが実行時にクラッシュを引き起こす前にエラーを捕捉する能力です。
テンプレート型チェックの段階では、Angular テンプレートコンパイラは TypeScript コンパイラを使用してテンプレート内のバインディング式を検証します。

プロジェクトの `tsconfig.json` の `"angularCompilerOptions"` にコンパイラオプション `"fullTemplateTypeCheck"`を追加して、
このフェーズを明示的に有効にします ([Angular コンパイラオプション](guide/angular-compiler-options)を参照)。

テンプレート検証では、
`.ts` ファイル内のコードに対して TypeScript コンパイラによって型エラーが報告されるのと同様に、
テンプレートバインディング式で型エラーが検出されるとエラーメッセージが表示されます。

たとえば、次のコンポーネントを考えてみましょう:

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}'
})
class MyComponent {
  person?: Person;
}

</code-example>

これにより次のエラーが発生します:

<code-example format="output" hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

</code-example>

エラーメッセージで報告されたファイル名、つまり `my.component.ts.MyComponent.html` は、
`MyComponent` クラステンプレートの内容を保持するテンプレートコンパイラによって生成された合成ファイルです。
コンパイラはこのファイルをディスクに書き込みません。
行番号と列番号は、クラスの `@Component` アノテーションのテンプレート文字列 (この場合は `MyComponent`) を基準にしています。
コンポーネントが`template`の代わりに `templateUrl` を使用する場合、エラーは合成ファイルの代わりに `templateUrl` によって参照される HTML ファイルで報告されます。

エラー位置は、エラーのある補間式を含むテキストノードの始まりです。
エラーが `[value]="person.address.street"`のような属性バインディングにある場合、
エラーの場所はエラーを含む属性の場所です。

検証では、TypeScript 型チェッカーと TypeScript コンパイラに提供されるオプションを使用して、
型検証の詳細度を制御します。
たとえば、`strictTypeChecks` が指定されている場合、上記のエラーメッセージと同様に、
エラー  ```my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'``` が報告されます。

### タイプナローイング

`ngIf` ディレクティブで使用されている式は、Angular テンプレートコンパイラで型候補を絞り込むために使用されます。
これは、TypeScript で `if` 式が行うのと同じ方法です。
たとえば、上のテンプレートで `Object is possibly 'undefined'` エラーになるのを避けるために、`person` の値が次のように初期化されている場合にのみ補間を実行するようにオブジェクトを修正します。

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>'
})
class MyComponent {
  person?: Person;
}

</code-example>

`*ngIf` を使用すると、TypeScript コンパイラは、バインディング式で使用されている `person` が `undefined` になることはないと推測できます。

For more information about input type narrowing, see [Improving template type checking for custom directives](guide/structural-directives#directive-type-checks).

### null 以外の型アサーション演算子

`*ngIf` を使用するのが不便な場合、またはバインディング式の補間時にコンポーネント内の制約によって式が常に NULL 以外になることが保証されている場合は、[非 null 型アサーション演算子](guide/template-expression-operators#non-null-assertion-operator)を使用して`Object is possibly 'undefined'` エラーを抑制します。

次の例では、`person` プロパティと `address` プロパティは常に一緒に設定されているため、`person` が null 以外の場合、`address` は常に null 以外の値になります。
TypeScript やテンプレートコンパイラにこの制約を記述するのに便利な方法はありませんが、この例では `address!.street` を使用してエラーを抑制しています。

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '&lt;span *ngIf="person"&gt; {{person.name}} lives on {{address!.street}} &lt;/span&gt;'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

</code-example>

コンポーネントのリファクタリングはこの制約を破る可能性があるため、非 null アサーション演算子は控えめに使用してください。

この例では、次に示すように`*ngIf` に `address` のチェックを含めることをお勧めします:

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '&lt;span &ast;ngIf="person &amp;&amp; address"&gt; {{person.name}} lives on {{address.street}} &lt;/span&gt;'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28

