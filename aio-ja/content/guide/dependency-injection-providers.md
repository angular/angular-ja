# 依存性のプロバイダー

プロバイダーを設定することで、アプリケーションが必要とする部分でサーピスを利用できるようになります。

依存性の[プロバイダー](guide/glossary#provider)は[DIトークン](guide/glossary#di-token)をもつインジェクターを設定します。DIトークンは、インジェクターが依存性の値の実行時のバージョンを提供するために使います。

## プロバイダートークンの指定 {@a specifying-a-provider-token}

サービスクラスをプロバイダートークンとして指定すると、デフォルトの動作ではインジェクターはそのクラスを`new`でインスタンス化します。

次の例では、`Logger`クラスが`Logger`インスタンスを提供します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

一方で、必要なログ機能を提供する他のオブジェクトを渡すために、代わりのプロバイダーをもつインジェクターを設定できます。

サービスクラスをもつインジェクターを設定したり、代理のクラス、オブジェクト、またはファクトリ関数を提供したりできます。


{@a token}

{@a injection-token}

## 依存性の注入のトークン

[プロバイダー](guide/glossary#provider)をもつ[インジェクター](guide/glossary#injector)を設定するとき、そのプロバイダーを[依存性の注入トークン](guide/glossary#di-token)、DIトークンと結び付けています。
インジェクターによってAngularは、内部のあらゆる依存性のマップを作成できます。
DIトークンはそのマップへのキーとして働きます。

依存性の値はインスタンスであり、そのクラス型は検索キーとして機能します。
ここでは、インジェクターは`heroService`を検索するためのトークンとして`HeroService`型を使っています。

<code-example path="dependency-injection/src/app/injector.component.ts" region="get-hero-service" header="src/app/injector.component.ts"></code-example>

`HeroService`クラス型をもつコンストラクターのパラメータを定義すると、Angularはその`HeroService`クラストークンに結び付けられたサービスを注入することを認識します:

<code-example path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature" header="src/app/heroes/hero-list.component.ts">
</code-example>

クラスは多くの依存性の値を提供しますが、拡張された`provide`オブジェクトをもって、さまざまな種類のプロバイダーをDIトークンと結び付けることができます。


{@a provide}

## プロバイダーの定義

このクラスプロバイダーの構文は省略形であり、[`Provider`インターフェース](api/core/Provider)によって定義されるプロバイダー設定へ展開します。
次の例は、`providers`配列で`Logger`クラスを提供している、クラスプロバイダーの構文です。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

Angularは、この`providers`の値を次のように完全なプロバイダーオブジェクトへ展開します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" >
</code-example>

展開されたプロバイダー設定は、2つのプロパティをもつオブジェクトリテラルです:

* `provide`プロパティは[トークン](#token)を保持し、
それは依存性の値の発見とインジェクターの設定の両方のキーとして機能します。

* 2番目のプロパティはプロバイダーの定義オブジェクトであり、依存性の値の作成方法をインジェクターに指示します。
この例のように、プロバイダーの定義キーは`useClass`にできます。
`useExisting`や`useValue`、`useFactory`にもできます。
以下で説明するように、これらの各キーは異なる型の依存性を提供します。

{@a class-provider}

## 代替クラスプロバイダーの指定

異なるクラスが同じサービスを提供できます。
たとえば次のコードは、コンポーネントが`Logger`トークンを使ってロガーを要求したとき`BetterLogger`インスタンスを返すよう、インジェクターに指示しています。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" >
</code-example>

{@a class-provider-dependencies}

### 依存性をもつクラスプロバイダーの設定

代わりのクラスプロバイダーが独自の依存性をもつ場合、親モジュールまたはコンポーネントの`providers`メタデータプロパティで両方のプロバイダーを指定します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

この例では、`EvenBetterLogger`はログメッセージにユーザー名を表示します。
このロガーは、注入された`UserService`インスタンスからユーザーを取得します。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

そのインジェクターには、この新しいログサービスとそれが依存する`UserService`の両方のプロバイダーが必要です。

{@a aliased-class-providers}

### クラスプロバイダーのエイリアス

クラスプロバイダーにエイリアス設定するには、`useExisting`プロパティを用いて`providers`配列でエイリアスとクラスプロバイダーを指定します。

次の例では、コンポーネントが新しいまたは古いロガーを要求すると、インジェクターは`NewLogger`のシングルトンのインスタンスを注入します。
このように、`OldLogger`は`NewLogger`のエイリアスです。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

`useClass`を用いて`OldLogger`を`NewLogger`にエイリアスしないようにしましょう。これは2つの異なる`NewLogger`インスタンスを作るからです。


{@a provideparent}


## クラスインターフェースのエイリアス

一般に、同じ親のエイリアスプロバイダーの変形を記述するには、次のように[forwardRef](guide/dependency-injection-in-action#forwardref)を使用します。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>

コードを簡素化するために、そのロジックをヘルパー関数へ抽出できます。この`provideParent()`ヘルパー関数を使います。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-the-parent" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>

これで、親プロバイダーをコンポーネントに追加でき、読みやすく理解しやすいです。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>


### 複数のクラスインターフェースのエイリアス {@a aliasing-multiple-class-interfaces}

それぞれが独自のクラスインターフェースのトークンをもつ、複数の親の型にエイリアス設定するには、より多くの引数を受け取る`provideParent()`を設定します。

これはデフォルトで`Parent`になりますが、異なる親クラスのインターフェース用にオプションで2番目のパラメータも受け取る改訂バージョンです。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-parent" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>

次に、異なる親の型で`provideParent()`を使うため、2番目の引数を渡します。ここでは`DifferentParent`です。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="beth-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>


{@a value-provider}

## オブジェクトの注入

オブジェクトを注入するには、インジェクターを`useValue`オプションで設定します。
次のプロバイダーオブジェクトは、`useValue`キーを使ってその変数を`Logger`トークンと結び付けています。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7"></code-example>

この例では、`SilentLogger`はロガーの役割を果たすオブジェクトです。

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"></code-example>


{@a non-class-dependencies}

### 設定オブジェクトの注入

オブジェクトリテラルに関する一般的な使用例は設定オブジェクトです。
次の設定オブジェクトは、アプリケーションのタイトルとウェブAPIのエンドポイントのアドレスを含んでいます。

<code-example path="dependency-injection/src/app/app.config.ts" region="config" header="src/app/app.config.ts (excerpt)"></code-example>

設定オブジェクトを提供して注入するには、`@NgModule()`の`providers`配列でそのオブジェクトを指定します。

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)"></code-example>

{@a injectiontoken}

### `InjectionToken`オブジェクトの使用

クラスではない依存性に関するプロバイダートークンを選ぶには、`InjectionToken`オブジェクトを定義し使用できます。
次の例では、`InjectionToken`型の`APP_CONFIG`トークンを定義しています。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

オプションの型パラメータ`<AppConfig>`とトークンの説明`app.config`は、トークンの目的を指定します。

次に、`APP_CONFIG`の`InjectionToken`オブジェクトを使って、依存性のプロバイダーをコンポーネントに登録します。

<code-example path="dependency-injection/src/app/providers.component.ts" header="src/app/providers.component.ts" region="providers-9"></code-example>

これで、設定オブジェクトを`@Inject()`パラメータデコレーターを用いてコンストラクターへ注入できます。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

{@a di-and-interfaces}

#### インターフェースと依存性の注入

TypeScriptの`AppConfig`インターフェースはクラス内での型付けをサポートしていますが、`AppConfig`インターフェースは依存性の注入では何の役割も果たしません。
TypeScriptでは、インターフェースはデザイン時の構造であり、DIフレームワークが使用できる実行時の表現やトークンを持っていません。

トランスパイラがTypeScriptをJavaScriptに変換すると、JavaScriptはインターフェースをもたないため、そのインターフェースは消滅します。

Angularが実行時に見つけるインターフェースは存在しないため、そのインターフェースをトークンにはできず、注入することもできません。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>


{@a factory-provider}
{@a factory-providers}

## ファクトリプロバイダーの使用

実行時より前には利用できない情報に基づいた、変更可能な依存の値を作成するには、ファクトリプロバイダーを使用できます。

次の例では、認可されたユーザーのみが`HeroService`で秘密のヒーローを見る必要があります。
認可は、単一のアプリケーションセッションの間に変更することがあります。異なるユーザーがログインするときのようにです。

セキュリティ上機密の情報を`UserService`に保持し`HeroService`から除外するには、`HeroService`コンストラクターにbooleanフラグを指定して、秘密のヒーローの表示を制御します。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

`isAuthorized`フラグを実装するため、ファクトリプロバイダーを使って`HeroService`のための新しいロガーのインスタンスを作ります。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

ファクトリ関数には`UserService`へのアクセスがあります。
`Logger`と`UserService`の両方をファクトリプロバイダーへ注入すると、インジェクターはそれらをファクトリ関数に渡すことができます。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory`フィールドはプロバイダーがファクトリ関数であることを指定しており、その実装は`heroServiceFactory`です。

* `deps`プロパティは、[プロバイダートークン](#token)の配列です。
その`Logger`と`UserService`クラスは、それら自身のクラスプロバイダーに関するトークンとして機能します。
インジェクターはこれらのトークンを解決し、対応するサービスを一致する`heroServiceFactory`ファクトリ関数のパラメータに注入します。

ファクトリプロバイダーをエクスポートされた変数`heroServiceProvider`で捕捉するので、ファクトリプロバイダーは再利用可能になります。

次に並べた例は、`providers`配列において`heroServiceProvider`が`HeroService`に取って代わる様子を示しています。

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts">
  </code-pane>

</code-tabs>
