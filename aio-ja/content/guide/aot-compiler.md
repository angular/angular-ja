# Ahead-of-Time (AOT) コンパイラ

Angular アプリケーションは、主にコンポーネントとその HTML テンプレートで構成されています。Angular が提供するコンポーネントとテンプレートはブラウザで直接理解できないため、Angular アプリケーションをブラウザで実行するにはコンパイルプロセスが必要です。

Angular の Ahead-of-Time (AOT) コンパイラは、ブラウザがそのコードをダウンロードして実行する _前_ に、Angular HTML コードと TypeScript コードを効率的な JavaScript コードに変換します。ビルドプロセス中にアプリケーションをコンパイルすると、ブラウザでのレンダリングが速くなります。

このガイドでは、AOT コンパイラを使用してアプリケーションを効率的にコンパイルするためのメタデータの指定方法と利用可能なコンパイラオプションの適用方法について説明します。

<div class="alert is-helpful"

  AngularConnect 2016で、<a href="https://www.youtube.com/watch?v=kW9cJsvcsGo">コンパイラの作者 Tobias Bosch が Angular コンパイラについて説明しています</a>。

</div>

{@a overview}

## Angular コンパイル

Angular には、アプリケーションをコンパイルする2つの方法があります。

1. **_Just-in-Time_ (JIT)** は実行時にブラウザ内でアプリケーションをコンパイルします
1. **_Ahead-of-Time_ (AOT)** はビルド時にアプリをコンパイルします

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

{@a why-aot}

## なぜ AOT でコンパイルするのですか？

*より速いレンダリング*

AOT では、ブラウザはコンパイル済みのアプリケーションをダウンロードします。
ブラウザは実行可能コードをロードするので、最初にアプリケーションをコンパイルするのを待たずにアプリケーションをすぐにレンダリングできます。

*より少ない非同期リクエスト*

コンパイラは外部の HTML テンプレートと CSS スタイルシートをアプリケーションの JavaScript 内に組み込み、
それらのソースファイルに対する別々の ajax リクエストを排除します。

*より小さい Angular フレームワークのダウンロードサイズ*

アプリがすでにコンパイルされている場合は、Angular コンパイラをダウンロードする必要はありません。
コンパイラは Angular 自体の約半分なので、これを省略するとアプリケーションのペイロードが大幅に減少します。

*テンプレートエラーを早期に検出する*

AOT コンパイラは、ビルドステップ中にユーザーが表示される前にテンプレートバインディングエラーを検出して
報告します。

*より良いセキュリティ*

AOT は、HTML テンプレートとコンポーネントがクライアントに提供されるずっと前から JavaScript ファイルにコンパイルします。
読み取るテンプレートがなく、危険なクライアントサイドの HTML または JavaScript の評価もないため、
インジェクション攻撃の機会が少なくなります。

## アプリのコンパイルを制御する

Angular の AOT コンパイラを使用すると、次の 2 つの方法でアプリのコンパイルを制御できます。

* `tsconfig.json` ファイルでテンプレートコンパイラオプションを提供する

      詳細は、[Angular テンプレートコンパイラのオプション](#compiler-options)を参照してください。

* [Angular メタデータを指定する](#metadata-aot)


{@a metadata-aot}
## Angular メタデータを指定する

Angular メタデータは、Angular にアプリケーションクラスのインスタンスを構築し、実行時にそれらと対話する方法を指示します。
Angular **AOT コンパイラは** Angular が管理することになっているアプリケーションの部分を解釈するために**メタデータ**を抽出します。

メタデータは `@Component()` や `@Input()` のような**デコレーター**で指定することも、これらの装飾クラスのコンストラクター宣言で暗黙的に指定することもできます。

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

Angular コンパイラはメタデータ _once_ を抽出し、 `TypicalComponent` に対して _factory_ を生成します。
`TypicalComponent` インスタンスを作成する必要があるとき、Angular はファクトリを呼び出します。ファクトリは注入された依存関係をもつコンポーネントクラスの新しいインスタンスにバインドされた新しいビジュアル要素を生成します。

## メタデータの制限

TypeScript の _subset_ にメタデータを記述します。これは、次の一般的な制約に従う必要があります。

1. [式の構文](#expression-syntax) をサポートされている JavaScript のサブセットに制限します
2. [コード折りたたみ](#folding) の後にエクスポートされたシンボルだけを参照します
3. コンパイラによって[サポートされている機能](#supported-functions)だけを呼び出します
4. 装飾されデータバインドされたクラスメンバーはパブリックでなければなりません

次のセクションではこれらの点について詳しく説明します。

## AOT の仕組み

2 つのフェーズにすると AOT コンパイラについて考えるのに役立ちます。コード分析フェーズで、ソースの表現を単純に記録します。そして、コード生成フェーズでは、コンパイラの `StaticReflector` が解釈を処理し、それが解釈するものに制限を置きます。

## フェーズ 1: 分析

TypeScript コンパイラは、最初のフェーズの分析作業の一部を行います。AOT コンパイラがアプリケーションコードを生成するために必要な型情報をもつ `.d.ts` _型定義ファイル_ を発行します。

同時に、AOT **_collector_** は Angular デコレーターに記録されたメタデータを分析し、メタデータ情報を **`.metadata.json`** ファイルに出力します。

`.metadata.json` は、[抽象構文木 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として表されるデコレーターのメタデータの全体的な構造の図と考えることができます。

<div class="alert is-helpful">

Angular の [schema.ts](https://github.com/angular/angular/blob/master/packages/compiler-cli/src/metadata/schema.ts)
には、TypeScript インターフェースの集まりとして JSON 形式が記述されています。

</div>

{@a expression-syntax}
### 式の構文

_collector_ は JavaScript のサブセットしか理解できません。
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


式がサポートされていない構文を使う場合、_collector_ はエラーノードを `.metadata.json` ファイルに書き込みます。アプリケーションコードを生成するためにその部分のメタデータが必要な場合、
コンパイラは後でエラーを報告します。

<div class="alert is-helpful">

 エラーを伴う `.metadata.json` ファイルを生成せずに `ngc` に構文エラーを即座に報告させたい場合は、`tsconfig` の `strictMetadataEmit` オプションを設定してください。

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

AOT _collector_ はメタデータ式ではアロー関数 `() => new Server()` をサポートしません。
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

{@a function-calls}
### 限定的関数呼び出し

_collector_ は、構文が有効である限り、`new` を使って関数呼び出しやオブジェクトの作成を表すことができます。 _collector_ は適切な構文だけを扱います。

しかし注意してください。コンパイラは後で、_特定の_ 関数の呼び出しや _特定の_ オブジェクトの作成を拒否することがあります。
コンパイラは少数の関数への呼び出しのみをサポートし、少数の指定クラスに対してのみ `new` を使用します。これらの関数とクラスは[下](#supported-functions)の表にあります。

{@a folding}
### フォールディング
{@a exported-symbols}
コンパイラは **_exported_** シンボルへの参照しか解決できません。
幸い、_collector_ は _folding_ を介してエクスポートされていないシンボルの限定的な使用を可能にします。

_collector_ はコレクション中に式を評価し、その結果を元の式の代わりに `.metadata.json` に記録することができます。

たとえば、_collector_ は式 `1 + 2 + 3 + 4` を評価し、それを結果 `10` で置き換えることができます。

このプロセスは _フォールディング_ と呼ばれます。この方法で縮小できる式は _foldable_ です。

{@a var-declaration}
コレクターはモジュールローカルな `const` 宣言と初期化された `var` と `let` 宣言への参照を評価することができ、
事実上 `.metadata.json` ファイルからそれらを削除します。

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

しかし _collector_ はその内容をインライン化することで `template` 定数をメタデータ定義に _折り畳む_ ことができます。
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

`template` への参照がなくなり、コンパイラが後で `.metadata.json` の _collector's_ の出力を解釈したときにコンパイラを煩わせることはなくなりました。

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

_collector_ はこの式をそれに相当する _folded_ 文字列に変換します。

`'<div>{{hero.name}}</div><div>{{hero.title}}</div>'`.

#### 折りたたみ可能なシンタックス

次の表は、_collector_ がどの式を折りたたむことができるかどうかを示しています。

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


式が折りたたみ式ではない場合、コレクタはそれをコンパイラが解決するための [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として `.metadata.json` に書き込みます。


## フェーズ 2: コードの生成

_collector_ は、収集して `.metadata.json` に出力するメタデータを理解しようとはしません。可能な限りメタデータを表し、メタデータ構文の違反を検出したときにエラーを記録します。

コード生成フェーズで `.metadata.json` を解釈するのはコンパイラの仕事です。

コンパイラは _コレクター_ がサポートするすべての構文形式を理解しますが、_セマンティックス_ がコンパイラの規則に違反している場合は、正しいメタデータを構文的に拒否することがあります。

コンパイラは _エクスポートされたシンボル_ しか参照できません。

デコレートされたコンポーネントクラスメンバは公開されている必要があります。`@Input()` プロパティを非公開にしたり、保護することはできません。

データバインドプロパティもパブリックにする必要があります。

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
もっとも重要なことは、コンパイラは特定のクラスのインスタンスを作成し、特定のデコレーターをサポートし、そして次のリストから特定の関数を呼び出すためのコードを生成するだけです。


### 新しいインスタンス

コンパイラは `@angular/core` からクラス `InjectionToken` のインスタンスを作成するメタデータのみを許可します。

### アノテーション/デコレーター

コンパイラはこれらの Angular デコレーターのメタデータのみをサポートします。

<style>
  td, th {vertical-align: top}
</style>

<table>
  <tr>
    <th>デコレーター</th>
    <th>モジュール</th>
  </tr>
    <tr>
    <td><code>Attribute</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Component</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>ContentChild</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>ContentChildren</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Directive</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Host</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>HostBinding</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>HostListner</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Inject</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Injectable</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Input</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>NgModule</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Optional</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Output</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Pipe</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>Self</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>SkipSelf</code></td>
    <td><code>@angular/core</code></td>
  </tr>
  <tr>
    <td><code>ViewChild</code></td>
    <td><code>@angular/core</code></td>
  </tr>

  </table>



### マクロ関数とマクロ静的メソッド

コンパイラーは、関数または静的の形式で
 _マクロ_ もサポートします。

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

コレクターは、マクロ関数と見なされるものを決定する際に単純化されています。
単一の `return` ステートメントしか含めることができません。

Angular の [`RouterModule`](api/router/RouterModule) は、ルートと子ルートを宣言するのに役立つように、2つのマクロ静的メソッド `forRoot` と `forChild` をエクスポートします。
これらのメソッドの[ソースコード](https://github.com/angular/angular/blob/master/packages/router/src/router_module.ts#L139 "RouterModule.forRoot source code")を調べて、
複雑な [NgModules](guide/ngmodules) の構成をマクロで簡単にする方法を確認してください。

{@a metadata-rewriting}

### メタデータ書き換え

コンパイラは `useClass`、`useValue`、`useFactory`、および `data` の各フィールドを含むオブジェクトリテラルを特別に扱います。コンパイラは、これらのフィールドの1つを初期化する式をエクスポートされた変数に変換します。この変数が式を置き換えます。
これらの式を書き換えるこのプロセスは、式の値を知る必要がなく、単に値への参照を生成できる必要があるため、式に含まれる可能性があるものに対するすべての制限を取り除きます。



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

これにより、コンパイラは、`ɵ0` の値に何が含まれているのかを知らなくても、
ファクトリー内で `ɵ0` への参照を生成できます。

コンパイラは `.js` ファイルの発行中に書き換えを行います。ただし、これは `.d.ts` ファイルを書き換えないため、TypeScript はそれをエクスポートとして認識しません。したがって、それは ES モジュールのエクスポートされた API を汚染しません。


## メタデータエラー

以下は、発生する可能性があるメタデータエラーとその説明および推奨される修正です。

[Expression form not supported](#expression-form-not-supported)<br>
[Reference to a local (non-exported) symbol](#reference-to-a-local-symbol)<br>
[Only initialized variables and constants](#only-initialized-variables)<br>
[Reference to a non-exported class](#reference-to-a-non-exported-class)<br>
[Reference to a non-exported function](#reference-to-a-non-exported-function)<br>
[Function calls are not supported](#function-calls-not-supported)<br>
[Destructured variable or constant not supported](#destructured-variable-not-supported)<br>
[Could not resolve type](#could-not-resolve-type)<br>
[Name expected](#name-expected)<br>
[Unsupported enum member name](#unsupported-enum-member-name)<br>
[Tagged template expressions are not supported](#tagged-template-expressions-not-supported)<br>
[Symbol reference expected](#symbol-reference-expected)<br>

<hr>

<h3 class="no-toc">Expression form not supported</h3>

Angularメタデータの評価中にコンパイラが理解できない式に遭遇しました。

次の例に示すように、コンパイラの[制限された式の構文](#expression-syntax)以外の言語機能で
このエラーが発生する可能性があります。

```
// ERROR
export class Fooish { ... }
...
const prop = typeof Fooish; // typeof is not valid in metadata
  ...
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  ...
```

通常のアプリケーションコードでは `typeof` と括弧表記を使うことができます。
Angular メタデータを定義する式の中でこれらの機能を使用することはできません。

Angular メタデータを作成するときはコンパイラの[制限された式の構文](#expression-syntax)に用心してこのエラーを回避し、
新しいまたは珍しい TypeScript の機能がある場合には
注意してください。

<hr>

{@a reference-to-a-local-symbol}
<h3 class="no-toc">Reference to a local (non-exported) symbol</h3>

<div class="alert is-helpful">

_(エクスポートされていない) ローカルシンボル 'シンボル名'への参照。シンボルのエクスポートを検討してください。_

</div>

コンパイラが、エクスポートされていないか初期化されていないローカルに定義されたシンボルへの参照を検出しました。

これが問題の `provider` の例です。

```
// ERROR
let foo: number; // neither exported nor initialized

@Component({
  selector: 'my-component',
  template: ... ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```
コンパイラはコンポーネントファクトリを生成します。これは `useValue` プロバイダーコードを含み、別のモジュールで生成されます。 _That_ ファクトリモジュールはローカルの (エクスポートされていない) 変数 `foo` にアクセスするためにこのソースモジュールに戻ることはできません。

`foo` を初期化することで問題を解決することができます。

```
let foo = 42; // initialized
```

あなたがこれを書いたかのように、コンパイラは式をプロバイダーに [折りたたむ](#folding) でしょう。

```
  providers: [
    { provide: Foo, useValue: 42 }
  ]
```

あるいは、実際に値がわかっているときに実行時に `foo` が代入されることを期待して `foo` をエクスポートすることで修正できます。

```
// CORRECTED
export let foo: number; // exported

@Component({
  selector: 'my-component',
  template: ... ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

`export` を追加することは、`providers` や `animations` のようなメタデータで参照されている変数に対してよく機能します。なぜなら、コンパイラはこれらの式でエクスポートされた変数に対して _参照_ を生成できるからです。それらの変数の _値_ は必要ありません。

コードを生成するためにコンパイラが _実際の値_ を必要とする場合、
`export` の追加は機能しません。
たとえば、`template` プロパティには機能しません。

```
// ERROR
export let someTemplate: string; // exported but not initialized

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

コンポーネントファクトリを生成するために、コンパイラは _すぐに_ `template` プロパティの値を必要とします。
変数参照だけでは不十分です。
宣言の先頭に `export` を付けると、単に "[`Only initialized variables and constants can be referenced`](#only-initialized-variables)" という新しいエラーが発生します。

<hr>

{@a only-initialized-variables}
<h3 class="no-toc">Only initialized variables and constants</h3>

<div class="alert is-helpful">

_この変数の値はテンプレートコンパイラで必要とされるため、初期化された変数と定数のみを参照できます。_

</div>

初期化されていないエクスポートされた変数またはスタティックフィールドへの参照をコンパイラが見つけました。
コードを生成するにはその変数の値が必要です。

次の例では、コンポーネントの `template` プロパティを、
宣言されているが _割り当てられていない_ エクスポートされた `someTemplate` 変数の値に設定しようとします。

```
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

他のモジュールから `someTemplate` をインポートしてそこで初期化するのを怠った場合にもこのエラーが発生します。

```
// ERROR - not initialized there either
import { someTemplate } from './config';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

コンパイラは実行時までテンプレート情報を取得するのを待つことができません。
テンプレートに基づいて要素を構築するための命令を含む
コンポーネントファクトリを生成できるように、
ソースコードから `someTemplate` 変数の値を静的に導出する必要があります。

このエラーを修正するには、 _同じ行の_ initializer 句に変数の初期値を指定します。

```
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

<hr>

<h3 class="no-toc">Reference to a non-exported class</h3>

<div class="alert is-helpful">

_エクスポートされていないクラス <クラス名> への参照。クラスのエクスポートを検討してください。_

</div>

メタデータはエクスポートされなかったクラスを参照しました。

たとえば、あるクラスを定義し、それをprovider配列の中でインジェクショントークンとして使用したが、
そのクラスをエクスポートしていなかったとします。

```
// ERROR
abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```

Angular は別のモジュールでクラスファクトリを生成し、そのファクトリは
[エクスポートされたクラスにのみアクセスできます](#exported-symbols)。
このエラーを修正するには、参照先クラスをエクスポートしてください。

```
// CORRECTED
export abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```
<hr>

<h3 class="no-toc">Reference to a non-exported function</h3>

メタデータはエクスポートされなかった関数を参照しました。

たとえば、プロバイダーの `useFactory` プロパティを、エクスポートされなかったローカルに定義された関数に設定したかもしれません。

```
// ERROR
function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```

Angular は別のモジュールでクラスファクトリを生成し、そのファクトリは
[エクスポートされた関数にのみアクセスできます](#exported-symbols)。
このエラーを修正するには、関数をエクスポートしてください。

```
// CORRECTED
export function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```
<hr>

{@a function-calls-not-supported}
<h3 class="no-toc">Function calls are not supported</h3>

<div class="alert is-helpful">

_関数呼び出しはサポートされていません。関数またはラムダをエクスポートされた関数への参照に置き換えることを検討してください。_

</div>

コンパイラは現在、[関数式やラムダ関数](#function-expression) をサポートしていません。
たとえば、プロバイダーの `useFactory` を、このような無名関数やアロー関数に設定することはできません。

```
// ERROR
  ...
  providers: [
    { provide: MyStrategy, useFactory: function() { ... } },
    { provide: OtherStrategy, useFactory: () => { ... } }
  ]
  ...
```
プロバイダーの `useValue` で関数やメソッドを呼び出した場合にもこのエラーが発生します。
```
// ERROR
import { calculateValue } from './utilities';

  ...
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  ...
```

このエラーを修正するには、モジュールから関数をエクスポートし、代わりに `useFactory` プロバイダーの関数を参照してください。

<code-example linenums="false">
// CORRECTED
import { calculateValue } from './utilities';

export function myStrategy() { ... }
export function otherStrategy() { ... }
export function someValueFactory() {
  return calculateValue();
}
  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy },
    { provide: OtherStrategy, useFactory: otherStrategy },
    { provide: SomeValue, useFactory: someValueFactory }
  ]
  ...
</code-example>

<hr>

{@a destructured-variable-not-supported}
<h3 class="no-toc">Destructured variable or constant not supported</h3>

<div class="alert is-helpful">

_エクスポートされた非構造化変数または定数の参照は、テンプレートコンパイラではサポートされていません。デストラクチャリングを避けるためにこれを単純化することを検討してください。_

</div>

コンパイラは [デストラクチャリング](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring) によって割り当てられた変数への参照をサポートしません。

たとえば、次のようなものを書くことはできません:

<code-example linenums="false">
// ERROR
import { configuration } from './configuration';

// destructured assignment to foo and bar
const {foo, bar} = configuration;
  ...
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  ...
</code-example>

このエラーを修正するには、非構造化された値を参照してください。

<code-example linenums="false">
// CORRECTED
import { configuration } from './configuration';
  ...
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  ...
</code-example>

<hr>

<h3 class="no-toc">Could not resolve type</h3>

コンパイラが型を検出しましたが、どのモジュールがその型をエクスポートしているのか判断できません。

これは、アンビエントタイプを参照した場合に起こります。
たとえば、`Window` 型はグローバルな `.d.ts` ファイルで宣言されているアンビエント型です。

コンポーネントコンストラクターで参照するとエラーが発生しますが、
これをコンパイラが静的に分析する必要があります。

```
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { ... }
}
```
TypeScript はアンビエントタイプを理解するため、インポートしません。
Angular コンパイラは、エクスポートまたはインポートを無視した型を理解しません。

この場合、コンパイラは `Window` トークンで何かを注入する方法を理解していません。

メタデータ式でアンビエントタイプを参照しないでください。

アンビエントタイプのインスタンスを注入する必要がある場合は、
4つのステップで問題を解決できます:

1. アンビエントタイプのインスタンスのインジェクショントークンを作成します
1. そのインスタンスを返すファクトリ関数を作成します
1. そのファクトリ関数で `useFactory` プロバイダーを追加します
1. インスタンスを注入するには `@Inject` を使います

これが実例です。

<code-example linenums="false">
// CORRECTED
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  ...
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { ... }
}
</code-example>

コンストラクター内の `Window` 型は、`@Inject(WINDOW)` を使用してインジェクションコードを生成するため、
コンパイラにとってもはや問題ではありません。

Angular は `DOCUMENT` トークンと似たようなことをするので、ブラウザの `document` オブジェクト (あるいはアプリケーションが実行されているプラットフォームによってはその抽象オブジェクト) を挿入することができます。

<code-example linenums="false">
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({ ... })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { ... }
}
</code-example>
<hr>

<h3 class="no-toc">Name expected</h3>

コンパイラは評価中の式に名前が必要です。
次の例のように、プロパティ名として番号を使用すると、これが発生する可能性があります。

```
// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]
```

プロパティの名前を数値以外のものに変更します。

```
// CORRECTED
provider: [{ provide: Foo, useValue: { '0': 'test' } }]
```

<hr>

<h3 class="no-toc">Unsupported enum member name</h3>

Angular は、メタデータで参照した [列挙型メンバー](https://www.typescriptlang.org/docs/handbook/enums.html) の値を特定できませんでした。

コンパイラは単純な enum 値を理解できますが、計算プロパティから派生したものなどの複雑な値は理解できません。

<code-example linenums="false">
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computed
}

  ...
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // bad
  ]
  ...
</code-example>

複雑なイニシャライザや計算プロパティで列挙型を参照しないでください。

<hr>

{@a tagged-template-expressions-not-supported}
<h3 class="no-toc">Tagged template expressions are not supported</h3>

<div class="alert is-helpful">

_タグ付きテンプレート式は、メタデータではサポートされていません。_

</div>

コンパイラが次のような JavaScript ES2015 [タグ付きテンプレート式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)を検出しました。
```
// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 ...
 template: '<div>' + raw + '</div>'
 ...
```
[`String.raw()`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/raw) は、JavaScript ES2015 ネイティブの
_タグ付き関数_ です。

AOT コンパイラはタグ付きテンプレート式をサポートしません。メタデータ式でそれらを避けてください。

<hr>

<h3 class="no-toc">Symbol reference expected</h3>

コンパイラは、エラーメッセージで指定された場所にあるシンボルへの参照を予期していました。

このエラーは、クラスの `extends` 節で式を使用した場合に起こります。

<!--

Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495).

-->

{@a binding-expression-validation}
  ## フェーズ 3: バインディング式の検証

  検証段階では、Angular テンプレートコンパイラは TypeScript コンパイラを使用してテンプレート内のバインディング式を検証します。
  プロジェクトの `tsconfig.json` の `"angularCompilerOptions"` にコンパイラオプション `"fullTemplateTypeCheck"`を追加して、
  このフェーズを明示的に有効にします
  ([Angular コンパイラオプション](#compiler-options)を参照)。

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

  エラーメッセージ `my.component.ts.MyComponent.html` で報告されたファイル名は、
  `MyComponent` クラステンプレートの内容を保持するテンプレートコンパイラによって生成された合成ファイルです。
  コンパイラはこのファイルをディスクに書き込みません。
  行番号と列番号は、クラスの `@Component` アノテーションのテンプレート文字列 (この場合は `MyComponent`) を基準にしています。
  コンポーネントが`template`の代わりに `templateUrl` を使用する場合、
  エラーは合成ファイルの代わりに `templateUrl` によって参照される HTML ファイルで報告されます。

  エラー位置は、エラーのある補間式を含むテキストノードの始まりです。
  エラーが `[value]="person.address.street"`のような属性バインディングにある場合、
  エラーの場所はエラーを含む属性の場所です。

  検証では、TypeScript 型チェッカーと TypeScript コンパイラに提供されるオプションを使用して、型検証の詳細度を制御します。
  たとえば、`strictTypeChecks` が指定されている場合、上記のエラーメッセージと同様に、エラー  ```my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'``` が報告されます。

  ### タイプナローイング

  `ngIf` ディレクティブで使用されている式は、Angular テンプレートコンパイラで型ユニオンを絞り込むために使用されます。
  これは、TypeScript で `if` 式が行うのと同じ方法です。
  たとえば、上のテンプレートで `Object is possibly 'undefined'` エラーになるのを避けるために、
  `person` の値が次のように初期化されている場合にのみ補間を実行するようにオブジェクトを修正します。

  ```typescript
  @Component({
    selector: 'my-component',
    template: '<span *ngIf="person"> {{person.addresss.street}} </span>'
  })
  class MyComponent {
    person?: Person;
  }
  ```

  `*ngIf` を使用すると、
  TypeScript コンパイラは、バインディング式で使用されている `person` が `undefined` になることはないと推測できます。

  #### カスタムの `ngIf` ライクディレクティブ

  `*ngIf` のように動作するディレクティブは、`*ngIf` のように扱うためのテンプレートコンパイラへのシグナルである静的メンバーマーカーを含めることで、
  同じ扱いが必要であることを宣言できます。
  `*ngIf` のこの静的メンバは次のとおりです。

  ```typescript
    public static ngIfUseIfTypeGuard: void;
  ```

  これは、`NgIf` ディレクティブの入力プロパティ `ngIf` がそのテンプレートの使用に対する保護として扱われるべきであることを宣言します。
  つまり、`ngIf` 入力プロパティが true の場合にのみ
  テンプレートがインスタンス化されることを意味します。


  ### null 以外の型アサーション演算子

  `*ngIf` を使用するのが不便な場合、
  またはバインディング式の補間時にコンポーネント内の制約によって式が常に NULL 以外になることが保証されている場合は、
  [null 以外の型アサーション演算子](guide/template-syntax#non-null-assertion-operator)を使用して
  `Object is possibly 'undefined'` エラーを抑制します。

  次の例では、`person` プロパティと `address` プロパティは常に一緒に設定されているため、
  `person` が null 以外の場合、`address` は常に null 以外の値になります。
  TypeScript やテンプレートコンパイラにこの制約を記述するのに便利な方法はありませんが、
  この例では `address!.street` を使用してエラーを抑制しています。

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

  コンポーネントのリファクタリングはこの制約を破る可能性があるため、
  null 以外のアサーション演算子は控えめに使用してください。

  この例では、次に示すように
  `*ngIf` に `address` のチェックを含めることをお勧めします:

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

  ### `$any()` を使って型チェックを無効にする

  [`$any()` キャスト疑似関数](guide/template-syntax)の呼び出しで式を囲むことによって、
  バインディング式のチェックを無効にします。
  `<any>` が使用されている場合、または `as any` キャストが使用されている場合は、
  TypeScript の場合と同様に、コンパイラはこれを `any` 型へのキャストとして扱います。

  次の例では、`Property addresss does not exist` というエラーは、
  `person` を `any` 型にキャストすることによって抑制されます。

  ```typescript
  @Component({
    selector: 'my-component',
    template: '{{$any(person).addresss.street}}'
  })
  class MyComponent {
    person?: Person;
  }
  ```

{@a tsconfig-extends}
## extends による設定の継承
TypeScript コンパイラと同様に、Angular コンパイラは `tsconfig.json` の `angularCompilerOptions` の `extends` もサポートしています。
tsconfig ファイルは、`extends` プロパティを使用して別のファイルから構成を継承できます。
`extends` は、`compilerOptions` および `angularCompilerOptions` と並行するトップレベルのプロパティです。ベースファイルの設定が最初にロードされ、次に継承設定ファイルの設定によって上書きされます。 
例:
```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    ...
  },
  "angularCompilerOptions": {
    "fullTemplateTypeCheck": true,
    "preserveWhitespaces": true,
    ...
  }
}
```
 tsconfig の extends についての詳細は [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)にあります。

{@a compiler-options}
## Angular template compiler options

The template compiler options are specified as members of the `"angularCompilerOptions"` object in the `tsconfig.json` file. Specify template compiler options along with the options supplied to the TypeScript compiler as shown here:

    ```json
    {
      "compilerOptions": {
        "experimentalDecorators": true,
                  ...
      },
      "angularCompilerOptions": {
        "fullTemplateTypeCheck": true,
        "preserveWhitespaces": true,
                  ...
      }
  }
  ```

The following section describes the Angular's template compiler options.

### *enableResourceInlining*
This option instructs the compiler to replace the `templateUrl` and `styleUrls` property in all `@Component` decorators with inlined contents in `template` and `styles` properties.
When enabled, the `.js` output of `ngc` will have no lazy-loaded `templateUrl` or `styleUrls`.

### *skipMetadataEmit*

This option tells the compiler not to produce `.metadata.json` files.
The option is `false` by default.

`.metadata.json` files contain information needed by the template compiler from a `.ts`
file that is not included in the `.d.ts` file produced by the TypeScript compiler. This information contains,
for example, the content of annotations (such as a component's template), which TypeScript
emits to the `.js` file but not to the `.d.ts` file.

This option should be set to `true` if you are using TypeScript's `--outFile` option, because the metadata files
are not valid for this style of TypeScript output. It is not recommended to use `--outFile` with
Angular. Use a bundler, such as [webpack](https://webpack.js.org/), instead.

This option can also be set to `true` when using factory summaries because the factory summaries
include a copy of the information that is in the `.metadata.json` file.

### *strictMetadataEmit*

This option tells the template compiler to report an error to the `.metadata.json`
file if `"skipMetadataEmit"` is `false`. This option is `false` by default. This should only be used when `"skipMetadataEmit"` is `false` and `"skipTemplateCodeGen"` is `true`.

This option is intended to validate the `.metadata.json` files emitted for bundling with an `npm` package. The validation is strict and can emit errors for metadata that would never produce an error when used by the template compiler. You can choose to suppress the error emitted by this option for an exported symbol by including `@dynamic` in the comment documenting the symbol.

It is valid for `.metadata.json` files to contain errors. The template compiler reports these errors
if the metadata is used to determine the contents of an annotation. The metadata
collector cannot predict the symbols that are designed for use in an annotation, so it will preemptively
include error nodes in the metadata for the exported symbols. The template compiler can then use the error
nodes to report an error if these symbols are used. If the client of a library intends to use a symbol in an annotation, the template compiler will not normally report
this until the client uses the symbol. This option allows detecting these errors during the build phase of
the library and is used, for example, in producing Angular libraries themselves.

### *skipTemplateCodegen*

This option tells the compiler to suppress emitting `.ngfactory.js` and `.ngstyle.js` files. When set,
this turns off most of the template compiler and disables reporting template diagnostics.
This option can be used to instruct the
template compiler to produce `.metadata.json` files for distribution with an `npm` package while
avoiding the production of `.ngfactory.js` and `.ngstyle.js` files that cannot be distributed to
`npm`.

### *strictInjectionParameters*

When set to `true`, this options tells the compiler to report an error for a parameter supplied
whose injection type cannot be determined. When this option is not provided or is `false`, constructor parameters of classes marked with `@Injectable` whose type cannot be resolved will
produce a warning.

*Note*: It is recommended to change this option explicitly to `true` as this option will default to `true` in the future.

### *flatModuleOutFile*

When set to `true`, this option tells the template compiler to generate a flat module
index of the given file name and the corresponding flat module metadata. Use this option when creating
flat modules that are packaged similarly to `@angular/core` and `@angular/common`. When this option
is used, the `package.json` for the library should refer
to the generated flat module index instead of the library index file. With this
option only one `.metadata.json` file is produced, which contains all the metadata necessary
for symbols exported from the library index. In the generated `.ngfactory.js` files, the flat
module index is used to import symbols that includes both the public API from the library index
as well as shrowded internal symbols.

By default the `.ts` file supplied in the `files` field is assumed to be the library index.
If more than one `.ts` file is specified, `libraryIndex` is used to select the file to use.
If more than one `.ts` file is supplied without a `libraryIndex`, an error is produced. A flat module
index `.d.ts` and `.js` will be created with the given `flatModuleOutFile` name in the same
location as the library index `.d.ts` file. For example, if a library uses the
`public_api.ts` file as the library index of the module, the `tsconfig.json` `files` field
would be `["public_api.ts"]`. The `flatModuleOutFile` options could then be set to, for
example `"index.js"`, which produces `index.d.ts` and  `index.metadata.json` files. The
library's `package.json`'s `module` field would be `"index.js"` and the `typings` field
would be `"index.d.ts"`.

### *flatModuleId*

This option specifies the preferred module id to use for importing a flat module.
References generated by the template compiler will use this module name when importing symbols
from the flat module.
This is only meaningful when `flatModuleOutFile` is also supplied. Otherwise the compiler ignores
this option.

### *generateCodeForLibraries*

This option tells the template compiler to generate factory files (`.ngfactory.js` and `.ngstyle.js`)
for `.d.ts` files with a corresponding `.metadata.json` file. This option defaults to
`true`. When this option is `false`, factory files are generated only for `.ts` files.

This option should be set to `false` when using factory summaries.

### *fullTemplateTypeCheck*

This option tells the compiler to enable the [binding expression validation](#binding-expression-validation)
phase of the template compiler which uses TypeScript to validate binding expressions.

This option is `false` by default.

*Note*: It is recommended to set this to `true` because this option will default to `true` in the future.

### *annotateForClosureCompiler*

This option tells the compiler to use [Tsickle](https://github.com/angular/tsickle) to annotate the emitted
JavaScript with [JSDoc](http://usejsdoc.org/) comments needed by the
[Closure Compiler](https://github.com/google/closure-compiler). This option defaults to `false`.

### *annotationsAs*

Use this option to modify how the Angular specific annotations are emitted to improve tree-shaking. Non-Angular
annotations and decorators are unaffected. Default is `static fields`.

<style>
  td, th {vertical-align: top}
</style>

<table>
  <tr>
    <th>Value</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>decorators</code></td>
    <td>Leave the decorators in place. This makes compilation faster. TypeScript will emit calls to the __decorate helper.  Use <code>--emitDecoratorMetadata</code> for runtime reflection.  However, the resulting code will not properly tree-shake.</td>
  </tr>
  <tr>
    <td><code>static fields</code></td>
    <td>Replace decorators with a static field in the class. Allows advanced tree-shakers like
    <a href="https://github.com/google/closure-compiler">Closure compiler</a> to remove unused classes.</td>
  </tr>
  </table>


### *trace*

This tells the compiler to print extra information while compiling templates.

### *enableLegacyTemplate*

Use of  the `<template>` element was deprecated starting in Angular 4.0 in favor of using
`<ng-template>` to avoid colliding with the DOM's element of the same name. Setting this option to
`true` enables the use of the deprecated `<template>` element. This option
is `false` by default. This option might be required by some third-party Angular libraries.

### *disableExpressionLowering*

The Angular template compiler transforms code that is used, or could be used, in an annotation
to allow it to be imported from template factory modules. See
[metadata rewriting](#metadata-rewriting) for more information.

Setting this option to `false` disables this rewriting, requiring the rewriting to be
done manually.

### *disableTypeScriptVersionCheck*

When `true`, this option tells the compiler not to check the TypeScript version.
The compiler will skip checking and will not error out when an unsupported version of TypeScript is used.
Setting this option to `true` is not recommended because unsupported versions of TypeScript might have undefined behavior.

This option is `false` by default.

### *preserveWhitespaces*

This option tells the compiler whether to remove blank text nodes from compiled templates.
As of v6, this option is `false` by default, which results in smaller emitted template factory modules.

### *allowEmptyCodegenFiles*

Tells the compiler to generate all the possible generated files even if they are empty. This option is
`false` by default. This is an option used by the Bazel build rules and is needed to simplify
how Bazel rules track file dependencies. It is not recommended to use this option outside of the Bazel
rules.

