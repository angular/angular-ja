# Ahead-of-time (AOT) コンパイラ

Angular アプリケーションは、主にコンポーネントとその HTML テンプレートで構成されています。Angular が提供するコンポーネントとテンプレートはブラウザで直接理解できないため、Angular アプリケーションをブラウザで実行するにはコンパイルプロセスが必要です。

Angular の [ahead-of-time (AOT) コンパイラ](guide/glossary#aot) は、ブラウザがそのコードをダウンロードして実行する _前_ に、ビルドフェーズ中にAngular HTML コードと TypeScript コードを効率的な JavaScript コードに変換します。ビルドプロセス中にアプリケーションをコンパイルすると、ブラウザでのレンダリングが速くなります。

このガイドでは、AOT コンパイラを使用してアプリケーションを効率的にコンパイルするためのメタデータの指定方法と利用可能なコンパイラオプションの適用方法について説明します。

<div class="alert is-helpful">

  <a href="https://www.youtube.com/watch?v=anphffaCZrQ">Watch Alex Rickabaugh explain the Angular compiler</a> at AngularConnect 2019.

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
   アプリケーションがすでにコンパイルされている場合は、Angular コンパイラをダウンロードする必要はありません。
   コンパイラは Angular 自体の約半分なので、これを省略するとアプリケーションのペイロードが大幅に減少します。

* *テンプレートエラーを早期に検出する*
   AOT コンパイラは、ユーザーが目にする前にビルドステップ中にテンプレートバインディングエラーを検出して
   報告します。

* *より良いセキュリティ*
   AOT は、HTML テンプレートとコンポーネントがクライアントに提供されるずっと前から JavaScript ファイルにコンパイルします。
   読み取るテンプレートがなく、危険なクライアントサイドの HTML または JavaScript の評価もないため、
   インジェクション攻撃の機会が少なくなります。

{@a overview}

## コンパイラの選択

Angular には、アプリケーションをコンパイルする2つの方法があります。

* **_Just-in-Time_ (JIT)** は実行時にブラウザ内でアプリケーションをコンパイルします。This was the default until Angular 8.
* **_Ahead-of-Time_ (AOT)** はビルド時にアプリケーションとライブラリをコンパイルします。This is the default since Angular 9.

When you run the [`ng build`](cli/build) (build only) or [`ng serve`](cli/serve) (build and serve locally) CLI commands, the type of compilation (JIT or AOT) depends on the value of the `aot` property in your build configuration specified in `angular.json`. By default, `aot` is set to `true` for new CLI apps.

詳細については、[CLI コマンドリファレンス](cli) および [Angularアプリのビルドとサーブ](guide/build)を参照してください。

## どのようにAOTは機能するか

AngularのAOTコンパイラは、Angularが管理することになるアプリケーションの部分を解釈するために**メタデータ**を抽出します。
`@Component()`や`@Input()`などの**デコレーター**において明示的に、または修飾されるクラスのコンストラクター宣言において暗黙的に、メタデータを指定できます。
メタデータは、どのようにアプリケーションのクラスのインスタンスを構築して実行時にそれらと相互作用するかをAngularに教えます。

次の例では、`@Component()` メタデータオブジェクトとクラスコンストラクターは Angular に `TypicalComponent` のインスタンスを作成し表示する方法を伝えます。

```typescript
@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>'
})
export class TypicalComponent {
  @Input() data: TypicalData;
  constructor(private someService: SomeService) { ... }
}
```

Angular コンパイラはメタデータを _1回_ 抽出し、 `TypicalComponent` に対して _ファクトリ_ を生成します。
`TypicalComponent` インスタンスを作成する必要があるとき、Angular はファクトリを呼び出します。ファクトリは注入された依存関係をもつコンポーネントクラスの新しいインスタンスにバインドされた新しいビジュアル要素を生成します。

### コンパイルフェーズ

AOTコンパイルには三つのフェーズがあります。
* フェーズ1は*コード解析*です。
   このフェーズでは、TypeScriptコンパイラと*AOTコレクター*がソース表現を作ります。コレクターは収集したメタデータを解釈しようとはしません。それはメタデータをできる限りで表現し、メタデータの構文違反を見つけたらエラーを記録します。

* フェーズ2は*コード生成*です。
   このフェーズでは、コンパイラの`StaticReflector`がフェーズ1で収集したメタデータを解釈し、メタデータの追加の検証を実行して、メタデータの制約違反を見つけたらエラーを投げます。

* フェーズ3は*テンプレート型チェック*です。
   オプションであるこのフェーズでは、Angularの*テンプレートコンパイラ*がTypeScriptコンパイラを使用して、テンプレートにおけるバインディング式を検証します。このフェーズは明示的に設定オプションの`fullTemplateTypeCheck`を設定して有効にできます。[Angularコンパイラオプション](guide/angular-compiler-options)を参照してください。


### メタデータ制約

TypeScript の _サブセット_ にメタデータを記述します。これは、次の一般的な制約に従う必要があります。

* [式の構文](#expression-syntax) をサポートされている JavaScript のサブセットに制限します
* [コード折りたたみ](#code-folding)の後、エクスポートされたシンボルだけを参照します
* コンパイラによって[サポートされている関数](#supported-functions)だけを呼び出します
* 修飾されデータバインドされたクラスメンバーはパブリックでなければなりません

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

Angular の [schema.ts](https://github.com/angular/angular/blob/master/packages/compiler-cli/src/metadata/schema.ts)
には、TypeScript インターフェースの集まりとして JSON 形式が記述されています。

</div>

{@a expression-syntax}
### 式の構文制約

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
    <td><code>'pi'</code></td>
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

 エラーを伴う `.metadata.json` ファイルを生成せずに `ngc` に構文エラーを即座に報告させたい場合は、TypeScript設定ファイルの `strictMetadataEmit` オプションを設定してください。

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
コンパイラが後でこのノードを解釈すると、アロー関数を _エクスポートされた関数_ に変換するように促すエラーが報告されます。

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
### コードの折りたたみ

コンパイラは **_エクスポートされた_** シンボルへの参照しか解決できません。
それでもコレクターは収集中に式を評価し、オリジナルの式ではなくその結果を`.metadata.json`に記録できます。
これにより、式内のエクスポートされていないシンボルを限定的に使用できます。

たとえば、コレクターは式 `1 + 2 + 3 + 4` を評価し、それを結果 `10` で置き換えることができます。
このプロセスは _折りたたみ_ と呼ばれます。この方法で縮小できる式は _折りたたみ可能_ です。

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
それでもコレクターは`template`定数をその内容をインラインにすることでメタデータ定義へ折りたたみできます。
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

`template`への参照がなくなり、コンパイラが後で`.metadata.json`における_コレクターの_出力を解釈したときにコンパイラを煩わせることはなくなりました。

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

コレクターはこの式をそれに相当する_折りたたんだ_文字列に変換します。

```
'<div>{{hero.name}}</div><div>{{hero.title}}</div>'
```

#### 折りたたみ可能な構文

次の表は、コレクターがどの式を折りたたむことができるかどうかを示しています。

<style>
  td, th {vertical-align: top}
</style>

<table>
  <tr>
    <th>構文</th>
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
    <td>可能、ターゲットが折りたたみ可能の場合</td>
  </tr>
   <tr>
    <td>配列のインデックス</td>
    <td>可能、ターゲットとインデックスが折りたたみ可能の場合</td>
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
    <td>可能、代入が折りたたみ可能の場合</td>
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
    <td>可能、オペランドが折りたたみ可能の場合</td>
  </tr>
   <tr>
    <td>サポートされている二項演算子</td>
    <td>可能、左右両方が折りたたみ可能の場合</td>
  </tr>
   <tr>
    <td>条件演算子</td>
    <td>可能、条件が折りたたみ可能の場合</td>
  </tr>
   <tr>
    <td>括弧</td>
    <td>可能、式が折りたたみ可能の場合</td>
  </tr>
</table>


式が折りたたみ可能ではない場合、コレクターはそれをコンパイラが解決するための [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) として `.metadata.json` に書き込みます。


## フェーズ 2: コード生成

コレクターは、メタデータを収集して `.metadata.json` に出力しますが、そのメタデータを理解しようとはしません。
可能な限りメタデータとして表現し、メタデータ構文の違反を検出したときにエラーを記録します。
コード生成フェーズで `.metadata.json` を解釈するのはコンパイラの仕事です。

コンパイラはコレクターがサポートするすべての構文形式を理解しますが、_セマンティックス_ がコンパイラの規則に違反している場合は、_構文として_ 正しいメタデータを拒否することがあります。

### 公開されたシンボル

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

### サポートされるクラスと関数

コレクターは関数呼び出しや`new`によるオブジェクト作成を構文が正しいものとして表現できます。
ところがコンパイラは、_特殊な_関数の呼び出しや_特殊な_オブジェクトの作成について後で生成を拒否できます。

コンパイラは、コアデコレーターのみをサポートする、そして式を戻すマクロ(関数や静的メソッド)の呼び出しのみをサポートする、特定のクラスのインスタンスのみを作成できます。
* 新しいインスタンス

   コンパイラは `@angular/core` から `InjectionToken` クラスのインスタンスを作成するメタデータのみを許可します。

* サポートされるデコレーター

   コンパイラは[`@angular/core`モジュールのAngularデコレーター](api/core#decorators)のメタデータのみサポートします。

* 関数呼び出し

   ファクトリ関数はエクスポートされた名前付き関数である必要があります。
   AOTコンパイラはファクトリ関数についてラムダ式("アロー関数")をサポートしません。

{@a function-calls}
### 関数と静的メソッドの呼び出し

コレクターは1つの`return`文を含むどんな関数や静的メソッドも受け入れます。
ところがコンパイラは、*式*を戻す関数や静的メソッドの形式のマクロのみをサポートします。

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

書き換えなしでは、ラムダはサポートされておらず`TypicalServer`はエクスポートされていないため、これは不正になります。
これを許可するため、コンパイラは自動でこんな風に書き換えます。

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

Angularコンパイラのもっとも役立つ特徴の1つは、テンプレート内の式を型チェックしてそれらが実行時にクラッシュを引き起こす前にエラーを捕捉する能力です。
テンプレート型チェックの段階では、Angular テンプレートコンパイラは TypeScript コンパイラを使用してテンプレート内のバインディング式を検証します。

プロジェクトの `tsconfig.json` の `"angularCompilerOptions"` にコンパイラオプション `"fullTemplateTypeCheck"`を追加して、
このフェーズを明示的に有効にします ([Angular コンパイラオプション](guide/angular-compiler-options)を参照)。

<div class="alert is-helpful">

[AngularのIvy](guide/ivy)においては、テンプレート型チェッカーはより厳格かつ有能に完全に書き換えられます。つまり、以前の型チェッカーが検出しないさまざまな新しいエラーを捕捉できることを意味します。

結果として、以前にビューエンジンのもとでコンパイルされたテンプレートは、Ivyでは型チェックに失敗する可能性があります。これが起こり得るのは、Ivyのより厳格なチェックが真のエラーを捕捉するため、またはアプリケーションのコードが正しく型を付けられていないため、またはアプリケーションが誤りのあるもしくは十分に明確でない型付けをしているライブラリを使用しているためです。

このより厳格な型チェックはバージョン9においてデフォルトで有効ではありませんが、`strictTemplates`設定オプションを設定することで有効にできます。

For more information about type-checking options, and about improvements to template type checking in version 9 and above, see [Template type checking](guide/template-typecheck).

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

For more information about input type narrowing, see [Input setter coercion](guide/template-typecheck#input-setter-coercion) and [Improving template type checking for custom directives](guide/structural-directives#directive-type-checks).

### null 以外の型アサーション演算子

`*ngIf` を使用するのが不便な場合、またはバインディング式の補間時にコンポーネント内の制約によって式が常に NULL 以外になることが保証されている場合は、[非 null 型アサーション演算子](guide/template-expression-operators#non-null-assertion-operator)を使用して`Object is possibly 'undefined'` エラーを抑制します。

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
