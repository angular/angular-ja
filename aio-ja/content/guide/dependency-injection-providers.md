# 依存関係プロバイダー

依存関係[プロバイダー](guide/glossary#provider)は、[DI トークン](guide/glossary#di-token)を使用してインジェクターを構成します。
DI トークンは、依存関係の値の
具体的なランタイムバージョンを提供するために使用します。
インジェクターはプロバイダーの構成に依存して、
コンポーネント、ディレクティブ、パイプ、およびその他のサービスに注入する依存関係のインスタンスを作成します。

プロバイダーではインジェクターを設定する必要があります。そうしないと、依存関係を作成する方法がわかりません。
インジェクターがサービスクラスのインスタンスを作成するもっとも明白な方法は、クラス自体を使用することです。
サービスクラス自体をプロバイダートークンとして指定した場合、デフォルトの動作では、インジェクターはそのクラスを `new` でインスタンス化します。

次の典型的な例では、`Logger` クラス自体が `Logger`インスタンスを提供します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

ただし、必要なロギング機能を提供する他のオブジェクトを配信するために、
代替プロバイダーでインジェクターを構成できます。
たとえば:
* 代替クラスを提供できます

* ロガーのようなオブジェクトを提供できます

* プロバイダーは、ロガーファクトリ関数を呼び出すことができます

{@a provide}

## `Provider` オブジェクトリテラル

クラスプロバイダーの構文は、[`Provider` インターフェイス](api/core/Provider)によって定義されたプロバイダー構成に展開される省略表現です。
次のコードスニペットは、`providers` 値として指定されたクラスが
完全なプロバイダーオブジェクトに展開される方法を示しています。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" >
</code-example>

拡張されたプロバイダー構成は、2つのプロパティをもつオブジェクトリテラルです。

* `provide` プロパティは、依存関係値の検索と
インジェクターの構成の両方のキーとして機能する[トークン](guide/dependency-injection#token)を保持します。

* 2番目のプロパティはプロバイダー定義オブジェクトで、インジェクターに依存関係値の作成方法を指示します。
プロバイダー定義キーは、例のように `useClass` にすることができます。
`useExisting`、`useValue`、または `useFactory` にすることもできます。
次に説明するように、これらの各キーは異なるタイプの依存関係を提供します。


{@a class-provider}

## 代替クラスプロバイダー

異なるクラスが同じサービスを提供できます。
たとえば、次のコードは、コンポーネントが `Logger` トークンを使用してロガーを要求したときに、
`BetterLogger` インスタンスを返すよう
インジェクターに指示します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" >
</code-example>

{@a class-provider-dependencies}

### 依存関係をもつクラスプロバイダー

別のクラス `EvenBetterLogger` は、ログメッセージにユーザー名を表示する場合があります。
このロガーは、注入された `UserService` インスタンスからユーザーを取得します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

インジェクターには、この新しいロギングサービスとその依存する `UserService` の両方のプロバイダーが必要です。  `BetterLogger` などの `useClass` プロバイダー定義キーを使用して、この代替ロガーを構成します。次の配列は、親モジュールまたはコンポーネントの `providers` メタデータオプションで両方のプロバイダーを指定します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

{@a aliased-class-providers}

### エイリアスクラスプロバイダー

古いコンポーネントが `OldLogger` クラスに依存しているとします。
`OldLogger` のインターフェースは `NewLogger` と同じですが、
何らかの理由で古いコンポーネントを更新して使用することはできません。

古いコンポーネントが `OldLogger` でメッセージをログに記録するとき、
代わりに `NewLogger` のシングルトンインスタンスで処理する必要があります。
この場合、コンポーネントが新しいロガーまたは古いロガーのいずれかを要求したときに、
依存性インジェクターはそのシングルトンインスタンスを注入する必要があります。
`OldLogger` は、`NewLogger` のエイリアスである必要があります。

`useClass` で `OldLogger` を `NewLogger` にエイリアスしようとすると、アプリ内で 2 つの異なる `NewLogger` インスタンスが作成されます。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6a"></code-example>

`NewLogger` のインスタンスが 1 つだけであることを確認するには、`useExisting` オプションで `OldLogger` のエイリアスを作成します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

{@a value-provider}

## バリュープロバイダー

インジェクターにクラスから作成するようにするよりも、既存のオブジェクトを提供する方が簡単な場合があります。
すでに作成したオブジェクトを注入するには、
`useValue` オプションでインジェクターを設定します

次のコードは、ロガーの役割を果たすオブジェクトを作成する変数を定義しています。

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"></code-example>

次のプロバイダーオブジェクトは、`useValue` キーを使用して変数を `Logger` トークンに関連付けます。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7"></code-example>

{@a non-class-dependencies}

### クラス以外の依存関係

依存関係はクラスだけではありません。
文字列、関数、またはオブジェクトを挿入したい場合があります。

アプリは、多くの場合、アプリケーションのタイトルや Web API エンドポイントのアドレスなど、
多くの小さな事実をもつ構成オブジェクトを定義します。
これらの構成オブジェクトは、常にクラスのインスタンスとは限りません。
次の例に示すように、オブジェクトリテラルにすることができます。

<code-example path="dependency-injection/src/app/app.config.ts" region="config" header="src/app/app.config.ts (excerpt)"></code-example>

{@a interface-not-valid-token}

**TypeScript インターフェースは有効なトークンではありません**

`HERO_DI_CONFIG` 定数は、AppConfig インターフェースに準拠しています。
残念ながら、TypeScript インターフェースをトークンとして使用することはできません。
TypeScript では、インターフェースはデザイン時のアーティファクトであり、DI フレームワークが使用できるランタイム表現 (トークン) を持ちません。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

<div class="alert is-helpful">

これは、インターフェースが優先される依存関係参照キーである、厳密に型指定された言語で依存関係の注入に慣れている場合、奇妙に思えるかもしれません。
ただし、JavaScript にはインターフェースがないため、TypeScript を JavaScript に変換すると、インターフェースが消えます。
実行時に Angular が見つけるためのインターフェース型の情報は残っていません。

</div>

1 つの代替方法は、`AppModule` のような NgModule で構成オブジェクトを提供および注入することです。

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)"></code-example>

クラス以外の依存関係のプロバイダートークンを選択する別のソリューションは、
`InjectionToken` オブジェクトを定義して使用することです。
次の例は、そのようなトークンを定義する方法を示しています。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

type パラメーターはオプションですが、依存関係の型を開発者とツールに伝えます。
トークンの説明は、別の開発者への助けになります。

`InjectionToken` オブジェクトを使用して依存関係プロバイダーを登録します:

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9"></code-example>

これで、`@Inject()` パラメーターデコレーターの助けを借りて、
構成オブジェクトをそれを必要とする任意のコンストラクターに注入できます。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

<div class="alert is-helpful">

`AppConfig` インターフェースは、依存性の注入では何の役割も果たしませんが、
クラス内の構成オブジェクトの入力をサポートします。

</div>


{@a factory-provider}
{@a factory-providers}

## ファクトリープロバイダー

実行時までは得られない情報に基づいて、
依存する値を動的に作成する必要がある場合があります。
たとえば、ブラウザセッション中に繰り返し変化する情報が必要になる場合があります。
また、注入可能なサービスは、情報のソースに独立してアクセスできない場合があります。

このような場合、*ファクトリープロバイダー*を使用できます。
ファクトリープロバイダーは、DI で動作するように設計されていないサードパーティライブラリから
依存関係のインスタンスを作成する場合にも役立ちます。

たとえば、`HeroService` が通常のユーザーから*秘密*のヒーローを隠す必要があるとします。
許可されたユーザーのみが秘密のヒーローを見ることができます。

`EvenBetterLogger` と同様に、`HeroService` は、ユーザーが秘密のヒーローを見ることが許可されているかどうかを知る必要があります。
この許可は、別のユーザーでログインするときのように、
単一のアプリケーションセッションの過程で変更される可能性があります。

`UserService` を `HeroService` に直接注入したくないとしましょう。セキュリティに敏感な情報でそのサービスを複雑にしたくないからです。
`HeroService` は、ユーザー情報に直接アクセスして、誰が許可され、
誰が許可されないかを判断することはできません。

これを解決するために、`HeroService` コンストラクターに真偽値フラグを与えて、秘密のヒーローの表示を制御します。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

`Logger` を挿入できますが、`isAuthorized` フラグを挿入することはできません。代わりに、ファクトリープロバイダーを使用して、`HeroService` の新しいロガーインスタンスを作成できます。

ファクトリープロバイダーにはファクトリー関数が必要です。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

`HeroService` は `UserService` にアクセスできませんが、ファクトリ関数はアクセスできます。
`Logger` と `UserService` の両方をファクトリープロバイダーに注入し、
インジェクターがそれらをファクトリー関数に渡すようにします。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory` フィールドは、プロバイダーが `heroServiceFactory` を実装したファクトリ関数であることを Angular に伝えます。

* `deps` プロパティは、[プロバイダートークン](guide/dependency-injection#token)の配列です。
`Logger` クラスと `UserService` クラスは、独自のクラスプロバイダーのトークンとして機能します。
インジェクターはこれらのトークンを解決し、対応するサービスを一致するファクトリー関数パラメーターに注入します。

エクスポートされた変数 `heroServiceProvider` でファクトリープロバイダーをキャプチャしたことに注意してください。
この追加手順により、ファクトリープロバイダーが再利用可能になります。
この変数を使用して、必要な場所で `HeroService` のプロバイダーを構成できます。
このサンプルでは、メタデータ `providers` 配列内の`HeroService` を
`heroServiceProvider` に置き換える `HeroesComponent` でのみ必要です。

次に、新しい実装と古い実装を並べて示します。

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts">
  </code-pane>

</code-tabs>

## 事前定義されたトークンと複数のプロバイダー

Angular は、さまざまなシステムの動作をカスタマイズするために使用できる多数の
組み込みインジェクショントークン定数を提供します。

たとえば、次の組み込みトークンをフレームワークのブートストラップおよび初期化プロセスへのフックとして使用できます。
プロバイダーオブジェクトは、これらのインジェクショントークンを、アプリ固有の初期化アクションを実行する1つ以上のコールバック関数に関連付けることができます。

* [PLATFORM_INITIALIZER](api/core/PLATFORM_INITIALIZER): プラットフォームが初期化されると、コールバックが呼び出されます。

* [APP_BOOTSTRAP_LISTENER](api/core/APP_BOOTSTRAP_LISTENER): ブートストラップされる各コンポーネントに対してコールバックが呼び出されます。 ハンドラー関数は、ブートストラップされたコンポーネントの ComponentRef インスタンスを受け取ります。

* [APP_INITIALIZER](api/core/APP_INITIALIZER): コールバックは、アプリが初期化される前に呼び出されます。 登録されているすべてのイニシャライザは、オプションで Promise を返すことができます。Promise を返すすべてのイニシャライザ関数は、アプリケーションがブートストラップされる前に解決する必要があります。イニシャライザの1つが解決に失敗した場合、アプリケーションはブートストラップされません。

プロバイダーオブジェクトには、3番目の `multi: true` オプションを指定できます。
これは、`APP_INITIALIZER` とともに使用して、提供イベントの複数のハンドラーを登録できます。

たとえば、アプリケーションをブートストラップするとき、同じトークンを使用して多くのイニシャライザを登録できます。

```
export const APP_TOKENS = [
 { provide: PLATFORM_INITIALIZER, useFactory: platformInitialized, multi: true },
 { provide: APP_INITIALIZER, useFactory: delayBootstrapping, multi: true },
 { provide: APP_BOOTSTRAP_LISTENER, useFactory: appBootstrapped, multi: true },
];
```

他の領域でも、複数のプロバイダーを単一のトークンに関連付けることができます。
たとえば、組み込みの [NG_VALIDATORS](api/forms/NG_VALIDATORS) トークンを使用してカスタムフォームバリデーターを登録し、
プロバイダーオブジェクトの `multi: true` プロパティを使用して、特定のバリデータープロバイダーの複数のインスタンスを提供できます。
Angular は、既存のコレクションにカスタムバリデーターを追加します。

ルーターは、単一のトークンに関連付けられた複数のプロバイダーも利用します。
1 つのモジュールで [RouterModule.forRoot](api/router/RouterModule#forroot)
および [RouterModule.forChild](api/router/RouterModule#forchild) を使用して複数のルートセットを提供する場合、
[ROUTES](api/router/ROUTES) トークンは、提供されたすべての異なるルートセットを単一の値に結合します。

<div class="alert is-helpful>

[API ドキュメントの定数](api?type=const) を検索して、組み込みトークンを見つけます。

</div>

{@a tree-shakable-provider}
{@a tree-shakable-providers}

## ツリーシェイキング可能なプロバイダー

ツリーシェーキングとは、アプリがそのコードを参照しない場合に最終バンドルからコードを削除するコンパイラオプションのことです。
プロバイダーがツリーシェイキング可能である場合、Angular コンパイラーは、アプリケーションがそれらのサービスを
使用していないと判断すると、関連するサービスを最終出力から削除します。
これにより、バンドルのサイズが大幅に削減されます。

<div class="alert is-helpful">

理想的には、アプリケーションがサービスを注入しない場合、Angular はそれを最終出力に含めるべきではありません。
ただし、Angular は、ビルド時にアプリがサービスを必要とするかどうかを識別できる必要があります。
`injector.get(Service)` を使用してサービスを直接注入することは常に可能であるため、
Angular はこのインジェクションが発生する可能性のあるコード内のすべての場所を特定できず、
インジェクターにサービスを含める以外に選択肢はありません。
したがって、NgModule の `providers` 配列またはコンポーネントレベルのサービスはツリーシェイキング可能ではありません。

</div>

Angular のツリーシェイキング可能ではないプロバイダーの次の例は、NgModule のインジェクターのサービスプロバイダーを構成します。

<code-example path="dependency-injection/src/app/tree-shaking/service-and-module.ts"  header="src/app/tree-shaking/service-and-modules.ts"></code-example>

次の例のように、
このモジュールをアプリケーションモジュールにインポートして、
アプリでサービスを注入できるようにします。

<code-example path="dependency-injection/src/app/tree-shaking/app.module.ts"  header="src/app/tree-shaking/app.modules.ts"></code-example>

`ngc` が実行されると、`AppModule` がモジュールファクトリーにコンパイルされます。モジュールファクトリーには、含まれるすべてのモジュールで宣言されたすべてのプロバイダーの定義が含まれます。実行時に、このファクトリーはこれらのサービスをインスタンス化するインジェクターになります。

Angular は、コードの別のチャンク (サービスクラス) が使用されているかどうかに基づいてコードの1つのチャンク (モジュールファクトリ内のサービスのプロバイダー定義) を除外することを決定できないため、ここではツリーシェーキングは機能しません。サービスをツリーシェイキング可能にするには、サービスのインスタンス (プロバイダー定義) の構築方法に関する情報がサービスクラス自体の一部である必要があります。

### ツリーシェイキング可能なプロバイダーの作成

サービスに依存する NgModule またはコンポーネントのメタデータではなく、サービス自体の `@Injectable()` デコレーターで指定することで、プロバイダーをツリーシェイキング可能にできます。

次の例は、上記の `ServiceModule` の例に相当するツリーシェイキング可能なサービスを示しています。

<code-example path="dependency-injection/src/app/tree-shaking/service.ts"  header="src/app/tree-shaking/service.ts"></code-example>

次の例のように、ファクトリー関数を構成することにより、サービスをインスタンス化できます。

<code-example path="dependency-injection/src/app/tree-shaking/service.0.ts"  header="src/app/tree-shaking/service.0.ts"></code-example>

<div class="alert is-helpful">

ツリーシェイキング可能なプロバイダーをオーバーライドするには、特定の NgModule またはコンポーネントのインジェクターを別のプロバイダーで設定し、`@NgModule()` または `@Component()` デコレーターの `providers: []`配列構文を使用します。

</div>
