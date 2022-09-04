# 依存性プロバイダーの設定

「サービスの作成と注入」のトピックでは、依存オブジェクトとしてクラスを使用する方法について説明しました。クラス以外にも、ブール値、文字列、日付、オブジェクトなどの値を依存オブジェクトとして使用することもできます。AngularのDIは依存性の構成を柔軟にするために必要なAPIを提供しているので、DIでそれらの値を利用できます。

## プロバイダートークンの指定 {@a configuring-dependency-providers}

プロバイダートークンにサービスクラスを指定した場合、インジェクターは `new` 演算子を用いてそのクラスをインスタンス化するのがデフォルトの動作となります。

次の例では、`Logger` クラスが `Logger` のインスタンスを提供します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger"></code-example>

しかし、別のクラスや別の値を使用して、 `Logger` クラスと関連付けるように DI を設定することができます。そうすると、`Logger` が注入されたときに、この新しい値が代わりに使用されます。

実際には、クラスプロバイダーの構文は、`Provider` インターフェースで定義されたプロバイダーの構成に展開される省略表現です。

Angularはこの場合、`providers`の値を次のように完全なプロバイダーオブジェクトに展開します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" ></code-example>

展開されたプロバイダー構成は、2つのプロパティをもつオブジェクトリテラルです。
- `provide` プロパティは、依存オブジェクトを見つけ、インジェクターを設定するためのキーとなるトークンを保持します。
- 2番目のプロパティはプロバイダー定義オブジェクトで、依存オブジェクトの値の作成方法をインジェクターに指示します。プロバイダー定義のキーは、次のいずれかになります:
    - useClass - このオプションは、依存オブジェクトが注入されたときに、提供されたクラスをインスタンス化するように Angularの DI に伝えます。
    - useExisting - トークンのエイリアスを作成し、既存のトークンを参照することができます。
    - useFactory - 依存オブジェクトを生成する関数を定義することができます。
    - useValue - 依存オブジェクトとして使用されるべき静的な値を提供します。

以下では、前述のプロバイダー定義キーの使用方法について説明します。

<a id="token"></a>
<a id="injection-token"></a>

### クラスプロバイダー: useClass
`useClass` プロバイダーキーは、指定したクラスの新しいインスタンスを作成し、返すことができます。
このタイプのプロバイダーを使用すると、代替の実装を一般的なクラスやデフォルトのクラスに置き換えることができます。代替の実装は、たとえば、異なるストラテジーを実装したり、デフォルトクラスを拡張したり、テストケースで実際のクラスの振る舞いをエミュレートするといった使い方ができます。
次の例では、コンポーネントや他のクラスで `Logger` 依存が要求されたときに、 `BetterLogger` クラスがインスタンス化されるでしょう。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" ></code-example>

<a id="class-provider-dependencies"></a>

代替のクラスプロバイダーが自身の依存性をもつ場合、親モジュールまたはコンポーネントのプロバイダーのメタデータプロパティで両方のプロバイダーを指定します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

この例では、 `EvenBetterLogger` がログメッセージにユーザー名を表示します。このロガーは、注入された `UserService` インスタンスからユーザーを取得します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

AngularのDI は `UserService` の依存オブジェクトを構築する方法を知っています。なぜなら、この依存オブジェクトは上で設定され、インジェクターで利用できるからです。

### エイリアスプロバイダー: useExisting

`useExisting` プロバイダーキーにより、あるトークンを別のトークンに対応付けることができます。つまり、1つ目のトークンは2つ目のトークンに関連付けられたサービスのエイリアスであり、同じサービスオブジェクトにアクセスするための2つの方法を作成します。

次の例では、コンポーネントが新しいロガーまたは古いロガーを要求したときに、インジェクターは `NewLogger` のシングルトンインスタンスを注入します。この場合、 `OldLogger` は `NewLogger` のエイリアスです。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

`useClass` で `OldLogger` と `NewLogger` のエイリアスを作らないように注意してください。

### ファクトリープロバイダー: useFactory
`useFactory` プロバイダーキーにより、ファクトリ関数を呼び出して依存オブジェクトを作成することができます。この方法では、DI やアプリケーション内のどこかで利用可能な情報に基づいて動的な値を作成することができます。

次の例では、許可されたユーザーだけが `HeroService` にあるシークレットヒーローを見ることができます。
認証情報は、アプリケーションのセッション中に、別のユーザーがログインしたときなど、変更されることがあります。

セキュリティ上重要な情報を `UserService` に残し、 `HeroService` には残さないようにするには、 `HeroService` コンストラクターにブール値のフラグを与えて、秘密のヒーローの表示を制御してください。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

`isAuthorized` フラグを実装するために、ファクトリープロバイダーを使用して、 `HeroService` の新しいロガーインスタンスを作成します。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

ファクトリー関数は `UserService` にアクセスすることができます。
ファクトリープロバイダーに `Logger` と `UserService` の両方を注入して、インジェクターがファクトリー関数にそれらを渡せるようにします。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory` フィールドは、そのプロバイダーが `heroServiceFactory` という実装のファクトリ関数であることを指定します。

* `deps` プロパティは、プロバイダートークンの配列です。
`Logger` クラスと `UserService` クラスは、それぞれのクラスのプロバイダーを表すトークンとして機能します。
インジェクターはこれらのトークンを解決して、対応するサービスをマッチする `heroServiceFactory` ファクトリ関数の引数に注入します。

ファクトリープロバイダーをエクスポートされた変数 `heroServiceProvider` として保持することで、ファクトリープロバイダーを再利用できるようになります。

### 値プロバイダー: useValue

`useValue` キーを使用すると、DIトークンに固定値を関連付けることができます。このテクニックを使って、ウェブサイトのベースアドレスや フィーチャーフラグのような実行時の定数を提供することができます。また、ユニットテストの中で値プロバイダーを使用すると、本番データサービスの代わりにモックデータを提供することができます。次のセクションでは、`useValue` キーについて詳しく説明します。

## `InjectionToken` オブジェクトを使用する

クラス以外の依存オブジェクトのプロバイダートークンを選択するために `InjectionToken` オブジェクトを定義して使用します。次の例では、`InjectionToken` 型のトークンである `APP_CONFIG` を定義しています。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

任意指定の型パラメータ `<AppConfig>` とトークンの説明文 `app.config` で、トークンの用途を指定します。

次に、`APP_CONFIG` の `InjectionToken` オブジェクトを使用して、依存性プロバイダーをコンポーネントに登録します。

<code-example path="dependency-injection/src/app/providers.component.ts" header="src/app/providers.component.ts" region="providers-9"></code-example>

それでは、コンストラクターに `@Inject()` パラメータデコレーターを使って設定オブジェクトを注入してみましょう。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

### インターフェースとDI

TypeScriptの `AppConfig` インターフェースはクラス中での型付けをサポートしていますが、`AppConfig` インターフェースはDIでは何の役にも立ちません。
TypeScriptでは、インターフェースは設計時のものであり、DIフレームワークが使用できる実行時の表現、つまりトークンを持っていません。

トランスパイラがTypeScriptをJavaScriptに変更すると、JavaScriptにはインターフェースがないので、インターフェースが消えてしまいます。

Angularが実行時に見つけられるようなインターフェースは存在しないため、インターフェースをトークンにすることはできませんし、注入することもできません。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>


## What's next

* [Dependency Injection in Action](guide/dependency-injection-in-action)

@reviewed 2022-08-02