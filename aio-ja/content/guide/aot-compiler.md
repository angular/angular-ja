# Ahead-of-time (AOT) コンパイラ

Angular アプリケーションは、主にコンポーネントとその HTML テンプレートで構成されています。Angular が提供するコンポーネントとテンプレートはブラウザで直接理解できないため、Angular アプリケーションをブラウザで実行するにはコンパイルプロセスが必要です。

Angular の [ahead-of-time (AOT) コンパイラ](guide/glossary#aot) は、ブラウザがそのコードをダウンロードして実行する _前_ に、Angular HTML コードと TypeScript コードを効率的な JavaScript コードに変換します。ビルドプロセス中にアプリケーションをコンパイルすると、ブラウザでのレンダリングが速くなります。

このガイドでは、AOT コンパイラを使用してアプリケーションを効率的にコンパイルするためのメタデータの指定方法と利用可能なコンパイラオプションの適用方法について説明します。

<div class="alert is-helpful">

  AngularConnect 2016で、<a href="https://www.youtube.com/watch?v=kW9cJsvcsGo">コンパイラの作者 Tobias Bosch が Angular コンパイラについて説明しています</a>。

</div>

{@a why-aot}

AOTを使用する理由は次のとおりです。

* *より速いレンダリング*
   AOT では、ブラウザはコンパイル済みのアプリケーションをダウンロードします。
   ブラウザは実行可能コードをロードするので、最初にアプリケーションをコンパイルするのを待たずにアプリケーションをすぐにレンダリングできます。

* *より少ない非同期リクエスト*
   コンパイラは外部の HTML テンプレートと CSS スタイルシートをアプリケーションの JavaScript 内に _インライン化し_ 、
   それらのソースファイルに対する別々の ajax リクエストを排除します。

* *より小さい Angular フレームワークのダウンロードサイズ*
   アプリがすでにコンパイルされている場合は、Angular コンパイラをダウンロードする必要はありません。
   コンパイラは Angular 自体の約半分なので、これを省略するとアプリケーションのペイロードが大幅に減少します。

* *テンプレートエラーを早期に検出する*
   AOT コンパイラは、ビルドステップ中にユーザーが表示される前にテンプレートバインディングエラーを検出して
   報告します。

* *より良いセキュリティ*
   AOT は、HTML テンプレートとコンポーネントがクライアントに提供されるずっと前から JavaScript ファイルにコンパイルします。
   読み取るテンプレートがなく、危険なクライアントサイドの HTML または JavaScript の評価もないため、
   インジェクション攻撃の機会が少なくなります。

{@a overview}

## Choosing a compiler

Angular には、アプリケーションをコンパイルする2つの方法があります。

* **_Just-in-Time_ (JIT)** は実行時にブラウザ内でアプリケーションをコンパイルします
* **_Ahead-of-Time_ (AOT)** はビルド時にアプリをコンパイルします

JIT コンパイルは [`ng build`](cli/build) (ビルドのみ) あるいは [`ng serve`](cli/serve) (ローカルでビルドしてサーブする) CLI コマンドを実行したときのデフォルトです。

<code-example language="sh" class="code-shell">
  ng build
  ng serve
</code-example>

{@a compile}

AOT コンパイルをするには、`ng build` または `ng serve` コマンドに `--aot` オプションを含めます。

<code-example language="sh" class="code-shell">
  ng build --aot
  ng serve --aot
</code-example>

<div class="alert is-helpful">

`--prod` メタフラグを付けた `ng build` コマンド (`ng build --prod`) はデフォルトで AOT でコンパイルします。

詳細については、[CLI コマンドリファレンス](cli) および [Angular アプリの構築と提供](guide/build)を参照してください。

</div>

## How AOT works

The Angular AOT compiler extracts **metadata** to interpret the parts of the application that Angular is supposed to manage.
You can specify the metadata explicitly in **decorators** such as `@Component()` and `@Input()`, or implicitly in the constructor declarations of the decorated classes.
The metadata tells Angular how to construct instances of your application classes and interact with them at runtime.

次の例では、`@Component()` メタデータオブジェクトとクラスコンストラクターは Angular に `TypicalComponent` のインスタンスを作成し表示する方法を伝えます。

```typescript
@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>'
)}
export class TypicalComponent {
  @Input() data: TypicalData;
  constructor(private someService: SomeService) { ... }
}
```

Angular コンパイラはメタデータを _1回_ 抽出し、 `TypicalComponent` に対して _ファクトリ_ を生成します。
`TypicalComponent` インスタンスを作成する必要があるとき、Angular はファクトリを呼び出します。ファクトリは注入された依存関係をもつコンポーネントクラスの新しいインスタンスにバインドされた新しいビジュアル要素を生成します。

### Compilation phases

here are three phases of AOT compilation.
* Phase 1 is *code analysis*.
   In this phase, the TypeScript compiler and  *AOT collector* create a representation of the source. The collector does not attempt to interpret the metadata it collects. It represents the metadata as best it can and records errors when it detects a metadata syntax violation.

* Phase 2 is *code generation*.
    In this phase, the compiler's `StaticReflector` interprets the metadata collected in phase 1, performs additional validation of the metadata, and throws an error if it detects a metadata restriction violation.

* Phase 3 is *template type checking*.
   In this optional phase, the Angular *template compiler* uses the TypeScript compiler to validate the binding expressions in templates. You can enable this phase explicitly by setting the `fullTemplateTypeCheck` configuration option; see [Angular compiler options](guide/angular-compiler-options).


### Metadata restrictions

TypeScript の _サブセット_ にメタデータを記述します。これは、次の一般的な制約に従う必要があります。

* [式の構文](#expression-syntax) をサポートされている JavaScript のサブセットに制限します
* [コード折りたたみ](#code-folding) の後にエクスポートされたシンボルだけを参照します
* コンパイラによって[サポートされている関数](#supported-functions)だけを呼び出します
* 装飾されデータバインドされたクラスメンバーはパブリックでなければなりません

For additional guidelines and instructions on preparing an application for AOT compilation, see [Angular: Writing AOT-friendly applications](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f).

<div class="alert is-helpful">

Errors in AOT compilation commonly occur because of metadata that does not conform to the compiler's requirements (as described more fully below).
For help in understanding and resolving these problems, see [AOT Metadata Errors](guide/aot-metadata-errors).

</div>

### Configuring AOT compilation

You can provide options in the `tsconfig.json` [TypeScript configuration file](guide/typescript-configuration) that control the compilation process. See [Angular compiler options](guide/angular-compiler-options) for a complete list of available options.

## Phase 1: Code analysis

The TypeScript compiler does some of the analytic work of the first phase. It emits the `.d.ts` _type definition files_ with type information that the AOT compiler needs to generate application code.
At the same time, the AOT **collector** analyzes the metadata recorded in the Angular decorators and outputs metadata information in **`.metadata.json`** files, one per `.d.ts` file.

`.metadata.json` は、[抽象構文木 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として表されるデコレーターのメタデータの全体的な構造の図と考えることができます。

<div class="alert is-helpful">

Angular の [schema.ts](https://github.com/angular/angular/blob/master/packages/compiler-cli/src/metadata/schema.ts)
には、TypeScript インターフェースの集まりとして JSON 形式が記述されています。

</div>

{@a expression-syntax}
### Expression syntax limitations

AOTコレクター は JavaScript のサブセットしか理解できません。
次の限られた構文でメタデータオブジェクトを定義します。

<style>
  td, th {vertical-align: top}
</style>

<table>
  <tr>
    <th>構文</th>
    <th>例</th>
  </tr>
  <tr>
    <td>オブジェクトリテラル</td>
    <td><code>{cherry: true, apple: true, mincemeat: false}</code></td>
  </tr>
  <tr>
    <td>配列リテラル</td>
    <td><code>['cherries', 'flour', 'sugar']</code></td>
  </tr>
  <tr>
    <td>拡張配列リテラル</td>
    <td><code>['apples', 'flour', ...the_rest]</code></td>
  </tr>
   <tr>
    <td>コール</td>
    <td><code>bake(ingredients)</code></td>
  </tr>
   <tr>
    <td>New</td>
    <td><code>new Oven()</code></td>
  </tr>
   <tr>
    <td>プロパティアクセス</td>
    <td><code>pie.slice</code></td>
  </tr>
   <tr>
    <td>配列のインデックス</td>
    <td><code>ingredients[0]</code></td>
  </tr>
   <tr>
    <td>ID 参照</td>
    <td><code>Component</code></td>
  </tr>
   <tr>
    <td>テンプレート文字列</td>
    <td><code>`pie is ${multiplier} times better than cake`</code></td>
   <tr>
    <td>文字列リテラル</td>
    <td><code>pi</code></td>
  </tr>
   <tr>
    <td>数値リテラル</td>
    <td><code>3.14153265</code></td>
  </tr>
   <tr>
    <td>真偽値リテラル</td>
    <td><code>true</code></td>
  </tr>
   <tr>
    <td>null リテラル</td>
    <td><code>null</code></td>
  </tr>
   <tr>
    <td>サポートされている接頭演算子</td>
    <td><code>!cake</code></td>
  </tr>
   <tr>
    <td>サポートされている二項演算子</td>
    <td><code>a+b</code></td>
  </tr>
   <tr>
    <td>条件演算子</td>
    <td><code>a ? b : c</code></td>
  </tr>
   <tr>
    <td>括弧</td>
    <td><code>(a+b)</code></td>
  </tr>
</table>


式がサポートされていない構文を使う場合、コレクターはエラーノードを `.metadata.json` ファイルに書き込みます。アプリケーションコードを生成するためにその部分のメタデータが必要な場合、
コンパイラは後でエラーを報告します。

<div class="alert is-helpful">

 エラーを伴う `.metadata.json` ファイルを生成せずに `ngc` に構文エラーを即座に報告させたい場合は、TypeScript設定ファイル `tsconfig.json` の `strictMetadataEmit` オプションを設定してください。

```
  "angularCompilerOptions": {
   ...
   "strictMetadataEmit" : true
 }
 ```

Angular ライブラリはすべての Angular の `.metadata.json` ファイルがクリーンであることを保証するためにこのオプションを持っています、そして自身のライブラリを構築するとき同じことをするのはベストプラクティスです。

</div>

{@a function-expression}
{@a arrow-functions}
### アロー関数は使えません

AOTコンパイラは[関数式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/function)および
_ラムダ_ 関数とも呼ばれる[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)をサポートしていません。

次のコンポーネントデコレーターを考えてみましょう。

```typescript
@Component({
  ...
  providers: [{provide: server, useFactory: () => new Server()}]
})
```

AOTコレクターはメタデータ式ではアロー関数 `() => new Server()` をサポートしません。
関数の代わりにエラーノードを生成します。
コンパイラが後でこのノードを解釈すると、アロー関数を _exported 関数_ に変換するように促すエラーが報告されます。

これを変換することでエラーを修正できます。

```typescript
export function serverFactory() {
  return new Server();
}

@Component({
  ...
  providers: [{provide: server, useFactory: serverFactory}]
})
```

バージョン 5 以降、コンパイラは `.js` ファイルを出力しながらこの書き換えを自動的に実行します。

{@a exported-symbols}
{@a code-folding}
### Code folding

コンパイラは **_exported_** シンボルへの参照しか解決できません。
The collector, however, can evaluate an expression during collection and record the result in the `.metadata.json`, rather than the original expression.
This allows you to make limited use of non-exported symbols within expressions.

たとえば、コレクターは式 `1 + 2 + 3 + 4` を評価し、それを結果 `10` で置き換えることができます。
このプロセスは _フォールディング_ と呼ばれます。この方法で縮小できる式は _foldable_ です。

{@a var-declaration}
コレクターはモジュールローカルな `const` 宣言と初期化された `var` と `let` 宣言への参照を評価することができ、事実上 `.metadata.json` ファイルからそれらを削除します。

次のコンポーネント定義を考えてみてください。

```typescript
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  @Input() hero: Hero;
}
```

エクスポートされていないので、コンパイラは `template` 定数を参照できませんでした。
The collector, however, can fold the `template` constant into the metadata definition by in-lining its contents.
効果はあなたが書いた場合と同じです。

```typescript
@Component({
  selector: 'app-hero',
  template: '<div>{{hero.name}}</div>'
})
export class HeroComponent {
  @Input() hero: Hero;
}
```

`template` への参照がなくなり、コンパイラが後で `.metadata.json` の _コレクター's_ の出力を解釈したときにコンパイラを煩わせることはなくなりました。

別の式に `template` 定数を含めることでこの例をさらに一歩進めることができます。

```typescript
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero.title}}</div>'
})
export class HeroComponent {
  @Input() hero: Hero;
}
```

コレクターはこの式をそれに相当する _folded_ 文字列に変換します。

```
'<div>{{hero.name}}</div><div>{{hero.title}}</div>'
```

#### 折りたたみ可能なシンタックス

次の表は、コレクターがどの式を折りたたむことができるかどうかを示しています。

<style>
  td, th {vertical-align: top}
</style>

<table>
  <tr>
    <th>シンタックス</th>
    <th>折りたたみ可能</th>
  </tr>
  <tr>
    <td>オブジェクトリテラル</td>
    <td>可能</td>
  </tr>
  <tr>
    <td>配列リテラル</td>
    <td>可能</td>
  </tr>
  <tr>
    <td>拡張配列リテラル</td>
    <td>不可</td>
  </tr>
   <tr>
    <td>コール</td>
    <td>不可</td>
  </tr>
   <tr>
    <td>New</td>
    <td>不可</td>
  </tr>
   <tr>
    <td>プロパティアクセス</td>
    <td>可能、ターゲットが折りたたみ式の場合</td>
  </tr>
   <tr>
    <td>配列のインデックス</td>
    <td>可能、ターゲットとインデックスが折りたたみ式の場合</td>
  </tr>
   <tr>
    <td>ID 参照</td>
    <td>可能、それがローカルへの参照であれば</td>
  </tr>
   <tr>
    <td>置換のないテンプレート</td>
    <td>可能</td>
  </tr>
   <tr>
    <td>置換を含むテンプレート</td>
    <td>可能、代入が折りたたみ式の場合</td>
  </tr>
   <tr>
    <td>文字列リテラル</td>
    <td>可能</td>
  </tr>
   <tr>
    <td>数値リテラル</td>
    <td>可能</td>
  </tr>
   <tr>
    <td>真偽値リテラル</td>
    <td>可能</td>
  </tr>
   <tr>
    <td>null リテラル</td>
    <td>可能</td>
  </tr>
   <tr>
    <td>サポートされている接頭演算子</td>
    <td>オペランドが折りたたみ可能ならば可能</td>
  </tr>
   <tr>
    <td>サポートされている二項演算子</td>
    <td>可能、左右両方が折りたたみ式の場合</td>
  </tr>
   <tr>
    <td>条件演算子</td>
    <td>可能、条件が折りたたみ式の場合</td>
  </tr>
   <tr>
    <td>括弧</td>
    <td>可能、式が折りたたみ式の場合</td>
  </tr>
</table>


式が折りたたみ式ではない場合、コレクターはそれをコンパイラが解決するための [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として `.metadata.json` に書き込みます。


## フェーズ 2: コードの生成

コレクターは、メタデータを収集して `.metadata.json` に出力しますが、そのメタデータを理解しようとはしません。
可能な限りメタデータとして表現し、メタデータ構文の違反を検出したときにエラーを記録します。
コード生成フェーズで `.metadata.json` を解釈するのはコンパイラの仕事です。

コンパイラはコレクターがサポートするすべての構文形式を理解しますが、_セマンティックス_ がコンパイラの規則に違反している場合は、_構文として_ 正しいメタデータを拒否することがあります。

### Public symbols

コンパイラは _エクスポートされたシンボル_ しか参照できません。

* デコレートされたコンポーネントクラスメンバは公開されている必要があります。`@Input()` プロパティを非公開にしたり、保護することはできません。
* データバインドプロパティも公開されている必要があります。

```typescript
// BAD CODE - title is private
@Component({
  selector: 'app-root',
  template: '<h1>{{title}}</h1>'
})
export class AppComponent {
  private title = 'My App'; // Bad
}
```

{@a supported-functions}

### Supported classes and functions

The collector can represent a function call or object creation with `new` as long as the syntax is valid.
The compiler, however, can later refuse to generate a call to a _particular_ function or creation of a _particular_ object.

The compiler can only create instances of certain classes, supports only core decorators, and only supports calls to macros (functions or static methods) that return expressions.
* New instances

   コンパイラは `@angular/core` から `InjectionToken` クラスのインスタンスを作成するメタデータのみを許可します。

* Supported decorators

   The compiler only supports metadata for the [Angular decorators in the `@angular/core` module](api/core#decorators).

* Function calls

   Factory functions must be exported, named functions.
   The AOT compiler does not support lambda expressions ("arrow functions") for factory functions.

{@a function-calls}
### Functions and static method calls

The collector accepts any function or static method that contains a single `return` statement.
The compiler, however, only supports macros in the form of functions or static methods that return an *expression*.

たとえば、次の関数を考えてください:

```typescript
export function wrapInArray<T>(value: T): T[] {
  return [value];
}
```

メタデータ定義の中で `wrapInArray` を呼び出すことができます。それはコンパイラの制限的な JavaScript サブセットに準拠する式の値を返すからです。

このように `wrapInArray()` を使うかもしれません:

```typescript
@NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}
```

コンパイラはこの使用法を、あなたが書いたかのように扱います:

```typescript
@NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}
```
Angular の [`RouterModule`](api/router/RouterModule) は、ルートと子ルートを宣言するのに役立つように、2つのマクロ静的メソッド `forRoot` と `forChild` をエクスポートします。
これらのメソッドの[ソースコード](https://github.com/angular/angular/blob/master/packages/router/src/router_module.ts#L139 "RouterModule.forRoot source code")を調べて、
複雑な [NgModules](guide/ngmodules) の構成をマクロで簡単にする方法を確認してください。

{@a metadata-rewriting}

### メタデータの書き換え

コンパイラは `useClass`、`useValue`、`useFactory`、および `data` の各フィールドを含むオブジェクトリテラルを特別に扱い、これらのフィールドの1つを初期化する式をエクスポートされた変数に変換します。この変数が式を置き換えます。
これらの式を書き換えるこのプロセスは、式に含まれる可能性があるものに対するすべての制限を取り除きます。
なぜならば、コンパイラは式の値を知る必要がなく、つまり値への参照だけを生成できればよいからです。

あなたはこんな風に書くかもしれません:

```typescript
class TypicalServer {

}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}]
})
export class TypicalModule {}
```

Without rewriting, this would be invalid because lambdas are not supported and `TypicalServer` is not exported.
To allow this, the compiler automatically rewrites this to something like:

```typescript
class TypicalServer {

}

export const ɵ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: ɵ0}]
})
export class TypicalModule {}
```

これにより、コンパイラは、`ɵ0` の値に何が含まれているのかを知らなくても、ファクトリー内で `ɵ0` への参照を生成できます。

コンパイラは `.js` ファイルの発行中に書き換えを行います。
ただし、これは `.d.ts` ファイルを書き換えないため、TypeScript はそれをエクスポートとして認識しません。したがって、それは ES モジュールのエクスポートされた API を汚染しません。


{@a binding-expression-validation}
## フェーズ 3: テンプレート型チェック

One of the Angular compiler's most helpful features is the ability to type-check expressions within templates, and catch any errors before they cause crashes at runtime.
テンプレート型チェックの段階では、Angular テンプレートコンパイラは TypeScript コンパイラを使用してテンプレート内のバインディング式を検証します。

プロジェクトの `tsconfig.json` の `"angularCompilerOptions"` にコンパイラオプション `"fullTemplateTypeCheck"`を追加して、
このフェーズを明示的に有効にします ([Angular コンパイラオプション](guide/angular-compiler-options)を参照)。

<div class="alert is-helpful>

In [Angular Ivy](guide/ivy), the template type checker has been completely rewritten to be more capable as well as stricter, meaning it can catch a variety of new errors that the previous type checker would not detect.

As a result, templates that previously compiled under View Engine can fail type checking under Ivy. This can happen because Ivy's stricter checking catches genuine errors, or because application code is not typed correctly, or because the application uses libraries in which typings are inaccurate or not specific enough.

This stricter type checking is not enabled by default in version 9, but can be enabled by setting the `strictTemplates` configuration option.
We do expect to make strict type checking the default in the future.

<!-- For more information about type-checking options, and about improvements to template type checking in version 9 and above, see [Template type checking](guide/template-type-checking). -->

</div>

テンプレート検証では、
`.ts` ファイル内のコードに対して TypeScript コンパイラによって型エラーが報告されるのと同様に、
テンプレートバインディング式で型エラーが検出されるとエラーメッセージが表示されます。

たとえば、次のコンポーネントを考えてみましょう:

```typescript
@Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}'
})
class MyComponent {
  person?: Person;
}
```

これにより次のエラーが発生します:

```
my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?
```

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

```typescript
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.addresss.street}} </span>'
})
class MyComponent {
  person?: Person;
}
```

`*ngIf` を使用すると、TypeScript コンパイラは、バインディング式で使用されている `person` が `undefined` になることはないと推測できます。

#### カスタムの `ngIf` に似たディレクティブ

`*ngIf` のように動作するディレクティブは、`*ngIf` のように扱うためのテンプレートコンパイラへのシグナルである静的メンバーマーカーを含めることで、同じ扱いが必要であることを宣言できます。`*ngIf` のこの静的メンバは次のとおりです。

```typescript
  public static ngIfUseIfTypeGuard: void;
```

これは、`NgIf` ディレクティブの入力プロパティ `ngIf` がそのテンプレートの使用に対する保護として扱われるべきであることを宣言します。つまり、`ngIf` 入力プロパティが true の場合にのみテンプレートがインスタンス化されることを意味します。


### null 以外の型アサーション演算子

`*ngIf` を使用するのが不便な場合、またはバインディング式の補間時にコンポーネント内の制約によって式が常に NULL 以外になることが保証されている場合は、[非 null 型アサーション演算子](guide/template-syntax#non-null-assertion-operator)を使用して`Object is possibly 'undefined'` エラーを抑制します。

次の例では、`person` プロパティと `address` プロパティは常に一緒に設定されているため、`person` が null 以外の場合、`address` は常に null 以外の値になります。
TypeScript やテンプレートコンパイラにこの制約を記述するのに便利な方法はありませんが、この例では `address!.street` を使用してエラーを抑制しています。

```typescript
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}
```

コンポーネントのリファクタリングはこの制約を破る可能性があるため、非 null アサーション演算子は控えめに使用してください。

この例では、次に示すように`*ngIf` に `address` のチェックを含めることをお勧めします:

```typescript
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person && address"> {{person.name}} lives on {{address.street}} </span>'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}
```
