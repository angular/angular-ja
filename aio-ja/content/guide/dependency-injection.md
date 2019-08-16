# Angular の依存性の注入

依存性の注入 (DI) は、重要なアプリケーションデザインパターンです。
Angular には独自の DI フレームワークがあります。これは通常、
Angular アプリケーションの設計で効率性とモジュール性を向上させるために使用されます。

依存関係はクラスがその機能を実行するために必要なサービスまたはオブジェクトです。
DI はクラスがそれ自身を作成するのではなく、外部ソースから依存関係を要求するコーディングパターンです。

Angular では、DI フレームワークはそのクラスがインスタンス化されるときに宣言された依存関係をクラスに提供します。このガイドでは DI が Angular でどのように機能するのか、また、DI を使用してアプリケーションを柔軟性、効率性、堅牢性、テスト可能で保守性に優れたものにする方法について説明します。

<div class="alert is-helpful">

 このガイドに付属のサンプルアプリケーションの <live-example></live-example> を実行できます。

</div>

[The Tour of Heroes](tutorial/) から
この簡単なバージョンの _heroes_ 機能を確認してください。この単純なバージョンでは DI は使用しません。私たちはそれを変換するために進めていく予定です。

<code-tabs>
  <code-pane header="src/app/heroes/heroes.component.ts" path="dependency-injection/src/app/heroes/heroes.component.1.ts" region="v1">
  </code-pane>

  <code-pane header="src/app/heroes/hero-list.component.ts" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.ts" path="dependency-injection/src/app/heroes/hero.ts">
  </code-pane>

  <code-pane header="src/app/heroes/mock-heroes.ts" path="dependency-injection/src/app/heroes/mock-heroes.ts">
  </code-pane>

</code-tabs>

`HeroesComponent` は最上位のヒーローコンポーネントです。
その唯一の目的は `HeroListComponent`を表示することで、ヒーローの名前のリストを表示します。

このバージョンの `HeroListComponent` はヒーローを `HEROES` 配列から取得しており、別の `mock-heroes` ファイルで定義されている
インメモリのコレクションです。

<code-example header="src/app/heroes/hero-list.component.ts (class)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts" region="class">
</code-example>

このアプローチはプロトタイプ作成には有効ですが、堅牢ではなく、メンテナンス性もよくありません。
このコンポーネントをテストしたり、リモートサーバーからヒーローを取得しようとする場合はすぐに、
あなたは `HeroesListComponent` の実装を変更し、
`HEROES` モックデータのすべての使用箇所を置き換えなければなりません。


## 注入可能なサービスの作成と登録

DI フレームワークを使用すると、独自のファイルで定義された注入可能な _サービス_ クラスからコンポーネントにデータを供給できます。 デモンストレーションでは、ヒーローのリストを提供する注入可能なサービスクラスを作成し、そのクラスをそのサービスのプロバイダーとして登録します。

<div class="alert is-helpful">

同じファイルに複数のクラスがあると混乱することがあります。通常はコンポーネントとサービスを別々のファイルで定義することをお勧めします。

コンポーネントとサービスを同じファイルでまとめる場合は、
まずサービスを定義してからコンポーネントを定義することが重要です。サービスの前にコンポーネントを定義すると、実行時に null 参照エラーが発生します。

この [ブログ記事](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html) で説明されているように、`forwardRef()` メソッドを利用して最初にコンポーネントを定義することができます。

前方参照を使用して循環依存関係を解除することもできます。
[DI Cookbook](guide/dependency-injection-in-action#forwardref) の例を参照してください。

</div>

### 注入可能な service クラスの作成

[Angular CLI](cli) は、このコマンドを使用して `src/app/heroes` フォルダに新しい `HeroService` クラスを生成できます。

<code-example language="sh" class="code-shell">
ng generate service heroes/hero
</code-example>

このコマンドは次の `HeroService` スケルトンを作成します。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

`@Injectable()` は、すべての Angular サービス定義に不可欠な要素です。クラスの残りの部分は、以前と同じモックデータを返す `getHeroes` メソッドを公開するように書かれています。(実際のアプリはおそらくリモートサーバーからデータを非同期的に取得しますが、ここではサービスを注入する仕組みに焦点を当てるため無視します。)

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>


{@a injector-config}
{@a bootstrap}

### サービスプロバイダーでインジェクターを設定する

作成したクラスがサービスを提供します。`@Injectable()` デコレーターはそれを注入可能なサービスとしてマークしますが、
そのサービスの[プロバイダー](guide/glossary#provider)で Angular の[依存関係インジェクター](guide/glossary#injector)を設定するまで 
Angular は実際にはそれをどこにも注入できません。

インジェクターはサービスインスタンスを作成し、それらを `HeroListComponent` のようなクラスにインジェクトします。
Angular インジェクターを自分で作成することはめったにありません。Angular は、[ブートストラッププロセス](guide/bootstrapping)中に作成されたルートインジェクターから始めて、アプリの実行時にインジェクターを作成します。

プロバイダーはインジェクターにサービスの作成方法を伝えます。
インジェクターがサービスを作成する(または他の種類の依存関係を提供する)前に、プロバイダーによってインジェクターを設定する必要があります。

プロバイダーはサービスクラスそのものであるなら、インジェクターは `new` を使用してインスタンスを作成できます。
また、同じサービスを異なる方法で提供するために複数のクラスを定義し、
異なるプロバイダーによって異なるインジェクターを構成できます。

<div class="alert is-helpful">

インジェクターは継承されます。つまり、あるインジェクターが依存関係を解決できない場合は、
親インジェクターに解決を依頼します。
コンポーネントはそれ自身のインジェクター、
そのコンポーネントの先祖のインジェクター、
その親の NgModule のインジェクター、または `root` インジェクターからサービスを受け取ることができます。

* [さまざまな種類のプロバイダー](guide/dependency-injection-providers)についてもっと学びましょう

* [インジェクターの階層](guide/hierarchical-dependency-injection)が機能する仕組みについてもっと学びましょう

</div>

次の3つの場所のいずれかにメタデータ値を設定することで、アプリのさまざまなレベルでプロバイダーを使用してインジェクターを設定できます。

* サービス自体の `@Injectable()` デコレーターの中

* NgModule の `@NgModule()` デコレーターの中

* コンポーネントの `@Component()` デコレーターの中

`@Injectable()` デコレーターには `providedIn` メタデータオプションがあります。このオプションでは、`root` インジェクターまたは特定の NgModule のインジェクターを使用して、装飾されたサービスクラスのプロバイダーを指定できます。

`@NgModule()` および `@Component()` デコレーターには、`providers` メタデータオプションがあり、NgModule レベルまたはコンポーネントレベルのインジェクター用にプロバイダーを設定できます。

<div class="alert is-helpful">

コンポーネントはディレクティブであり、`providers` オプションは `@Directive()` から継承されます。コンポーネントと同じレベルでディレクティブとパイプのためのプロバイダーを設定することもできます。

[プロバイダーを設定する場所](guide/hierarchical-dependency-injection)の詳細を学んでください。

</div>

{@a injector-config} 
{@a bootstrap}

## サービスの注入

`HeroListComponent` が `HeroService` からヒーローを取得するためには、`new` で独自の `HeroService` インスタンスを作成するのではなく、注入される `HeroService` を要求する必要があります。

**依存型をもつコンストラクターパラメーター**を指定することで、Angular にコンポーネントのコンストラクターに依存関係を注入するように指示できます。この `HeroListComponent` コンストラクターでは、`HeroService` を注入するようにリクエストしています。

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>

もちろん、`HeroListComponent` は注入された `HeroService` を使って何かをするべきです。
これが修正されたコンポーネントで、注入されたサービスを利用しています。比較のために以前のバージョンと並べて表示します。

<code-tabs>
  <code-pane header="hero-list.component (with DI)" path="dependency-injection/src/app/heroes/hero-list.component.2.ts">
  </code-pane>

  <code-pane header="hero-list.component (without DI)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>
</code-tabs>

`HeroService` は何らかの親インジェクターで提供されなければなりません。`HeroListComponent` のコードは、`HeroService` の提供元には依存しません。
`AppModule` に `HeroService` を提供することにした場合、`HeroListComponent` は変わりません。

{@a singleton-services}
{@a component-child-injectors}

### インジェクター階層とサービスインスタンス

サービスは _インジェクターの範囲内の_ シングルトンです。つまり、特定のインジェクターにサービスのインスタンスがあったとしても1つです。

アプリにはルートインジェクターが1つだけあります。`root` レベルまたは `AppModule` レベルで `UserService` を提供することは、ルートインジェクターに登録されていることを意味します。*子インジェクター*を使用して別のプロバイダーを設定*しない限り*、アプリケーション全体には1つの `UserService` インスタンスしかなく、`UserService` を注入するすべてのクラスがこのサービスインスタンスを取得します。

Angular DI には[階層型注入システム](guide/hierarchical-dependency-injection)があります。つまり、入れ子になったインジェクターは独自のサービスインスタンスを作成できます。
Angular は定期的に入れ子になったインジェクターを作ります。Angular が `@Component()` で指定された `providers` をもつコンポーネントの新しいインスタンスを作成するたびに、そのインスタンスのための新しい*子インジェクター*も作成します。
同様に、実行時に新しい NgModule が遅延ロードされると、Angular は独自のプロバイダーを使用してそのためのインジェクターを作成できます。

子モジュールとコンポーネントインジェクターは互いに独立しており、提供されるサービスの独自のインスタンスを個別に作成します。Angular が NgModule またはコンポーネントインスタンスを破棄すると、そのインジェクターとそのインジェクターのサービスインスタンスも破棄します。

[インジェクター継承](guide/hierarchical-dependency-injection)のおかげで、
それでもこれらのコンポーネントにアプリケーション全体のサービスを注入することができます。
コンポーネントのインジェクターは、その親コンポーネントのインジェクターの子であり、アプリケーションの _ルート_ のインジェクターに至るまで、すべての先祖インジェクターを継承します。 Angularはその中にあるいずれかのインジェクターによって提供されるサービスを注入できます。

たとえば、Angular は `HeroComponent` で提供されている `HeroService` と `AppModule` で提供されている `UserService` の両方を `HeroListComponent` に注入できます。

{@a testing-the-component}

## 依存関係のあるコンポーネントのテスト

依存性の注入を使用してクラスを設計すると、クラスのテストが容易になります。
依存関係をコンストラクターのパラメータとしてリストするだけで、アプリケーション部分を効果的にテストすることができます。

たとえば、テスト用に操作できるモックサービスを使用して新しい `HeroListComponent` 
を作成できます。

<code-example path="dependency-injection/src/app/test.component.ts" region="spec" header="src/app/test.component.ts"></code-example>

<div class="alert is-helpful">

[テスト](guide/testing)ガイドでもっと学びましょう。

</div>

{@a service-needs-service}

## 他のサービスを必要とするサービス

サービスは独自の依存関係をもつことができます。 `HeroService` は非常にシンプルで、独自の依存関係はありません。ただし、ロギングサービスを介してそのアクティビティをレポートしたいとします。`Logger` パラメーターをとるコンストラクターを追加して、
同じコンストラクター注入パターンを適用できます。

これが `Logger` を注入する新しい `HeroService` で、比較のために以前のサービスと並べて表示しています。

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

コンストラクターは注入される `Logger` のインスタンスを要求し、それを `logger` というプライベートフィールドに格納します。`getHeroes()` メソッドは、ヒーローの取得を要求されたときにメッセージを記録します。

`Logger` サービスには `@Injectable()` デコレーターもあります。ただし、独自の依存関係は必要ないかもしれません。 実際、`@Injectable()` デコレーターは**すべてのサービスに必要**です。

Angular は、コンストラクターにパラメータがあるクラスを作成するときに、正しいサービスを挿入できるように、それらのパラメータについて型と注入のメタデータを探します。
Angular がそのパラメータ情報を見つけられない場合は、エラーが発生します。
Angular は、*クラスに何らかのデコレーターがある場合にのみ*パラメータ情報を見つけることができます。
`@Injectable()` デコレーターはサービスクラスの標準デコレーターです。

<div class="alert is-helpful">

 デコレーターの要件は TypeScript によって課されます。 TypeScript は通常、コードを JavaScript に[トランスパイル](guide/glossary#transpile)するときにパラメータの型情報を破棄します。クラスにデコレーターがあり、`emitDecoratorMetadata` コンパイラオプションが TypeScript の `tsconfig.json` 設定ファイルで `true` に設定されている場合、TypeScript はこの情報を保持します。CLI は `tsconfig.json` に `emitDecoratorMetadata: true` を設定します。
 
 これはあなたのサービスクラスに `@Injectable()` を置く責任があることを意味します。

</div>

{@a token}

{@a injection-token}

### 依存性の注入トークン

プロバイダーを使用してインジェクターを設定するときは、そのプロバイダーを [DI トークン](guide/glossary#di-token)と関連付けます。
インジェクターは、依存関係を要求されたときに参照する内部*トークンプロバイダー*マップを維持します。
トークンはマップへのキーです。

簡単な例では、依存値は*インスタンス*であり、
クラス*型*はそれ自身の検索キーとして機能します。
ここではトークンとして `HeroService` 型を指定することで、インジェクターから直接 `HeroService` を取得します。

<code-example path="dependency-injection/src/app/injector.component.ts" region="get-hero-service" header="src/app/injector.component.ts"></code-example>

注入されるクラスベースの依存関係を必要とするコンストラクターを書くときの動作は似ています。
`HeroService` クラス型でコンストラクターパラメータを定義すると、
Angular はその `HeroService` クラストークンに関連付けられたサービスを注入することを認識しています。

<code-example path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature" header="src/app/heroes/hero-list.component.ts">
</code-example>

多くの依存する値はクラスによって提供されますが、すべてではありません。拡張された*provide*オブジェクトを使用すると、さまざまな種類のプロバイダーを DI トークンと関連付けることができます。

* [さまざまな種類のプロバイダー](guide/dependency-injection-providers)についてもっと学びましょう

{@a optional}

### オプションの依存関係

`HeroService` には logger が*必要*ですが、それがなくても取得できる場合は
どうなりますか？

コンポーネントまたはサービスが依存関係を宣言すると、クラスコンストラクターはその依存関係をパラメータとして受け取ります。
`@Optional()` でコンストラクターパラメータに注釈を付けることで、依存関係がオプションであることを 
Angular に伝えることができます。

<code-example path="dependency-injection/src/app/providers.component.ts" region="import-optional">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-10-ctor"></code-example>

`@Optional()` を使用する場合、コードは null 値に対応している必要があります。
logger プロバイダーをどこにも登録していない場合、インジェクターは `logger` の値を 
null に設定します。

<div class="alert is-helpful">

`@Inject()` と `@Optional()` は*パラメータデコレーター*です。それらは、依存関係を必要とするクラスのコンストラクターに依存関係パラメータを注釈することによって、DI フレームワークが依存関係を提供する方法を変更します。

パラメータデコレーターの詳細については、[階層的な依存性の注入](guide/hierarchical-dependency-injection)をご覧ください。

</div>

## まとめ

このページで Angular の依存性の注入の基本を学びました。
さまざまな種類のプロバイダーを登録できます。
また、コンストラクターにパラメータを追加することで、注入されるオブジェクト(サービスなど)を
要求する方法を知っています。

次のページで、Angular の DI システムの機能と高度な特徴について詳しく説明します。

* 入れ子になったインジェクターについて詳しくは、[階層的な依存性の注入](guide/hierarchical-dependency-injection)を参照してください

* [DI トークンとプロバイダー](guide/dependency-injection-providers)についてもっと学びましょう

* [DI イン・アクション](guide/dependency-injection-in-action) は、DI を使ってできることのいくつかについてのクックブックです

