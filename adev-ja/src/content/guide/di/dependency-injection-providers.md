# 依存関係プロバイダーの設定

前のセクションでは、クラスインスタンスを依存関係として使用する仕組みについて説明しました。
クラスに加えて、`boolean`、`string`、`Date`、オブジェクトなどの値を依存関係として使用できます。
Angularは、依存関係の設定を柔軟にするために必要なAPIを提供しており、これらの値をDIで利用可能にできます。

## プロバイダートークンの指定

プロバイダートークンとしてサービスクラスを指定した場合、インジェクターはデフォルトで`new`演算子を使用してそのクラスをインスタンス化します。

次の例では、アプリケーションコンポーネントは`Logger`インスタンスを提供します。

<docs-code header="src/app/app.component.ts" language="typescript">
providers: [Logger],
</docs-code>

ただし、DIを構成して、`Logger`プロバイダートークンを別のクラスまたはその他の値に関連付けることができます。
そのため、`Logger`が注入されると、構成された値が代わりに使用されます。

実際、クラスプロバイダーの構文は、`Provider`インターフェースで定義されたプロバイダー構成に展開される省略記号です。
Angularは、この場合の`providers`値を、次のように完全なプロバイダーオブジェクトに展開します。

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: Logger }]
</docs-code>

展開されたプロバイダー構成は、2つのプロパティを持つオブジェクトリテラルです。

- `provide`プロパティは、依存関係値を消費するためのキーとして機能するトークンを保持します。
- 2番目のプロパティはプロバイダー定義オブジェクトで、インジェクターが依存関係値を**どのように**作成するかを指示します。プロバイダー定義は、次のいずれかになります。
  - `useClass` - このオプションは、依存関係が注入されるときに、Angular DIが提供されたクラスをインスタンス化することを指示します。
  - `useExisting` - トークンにエイリアスを付けて、既存のトークンを参照できます。
  - `useFactory` - 依存関係を作成する関数を定義できます。
  - `useValue` - 依存関係として使用する静的な値を提供します。

以下のセクションでは、さまざまなプロバイダー定義の使用方法について説明します。

### クラスプロバイダー: useClass

`useClass`プロバイダーキーを使用すると、指定されたクラスの新しいインスタンスを作成して返します。

このタイプのプロバイダーを使用して、共通またはデフォルトのクラスの代替実装を置き換えることができます。
代替実装はたとえば異なる戦略を実装したり、デフォルトクラスを拡張したり、テストケースで実際のクラスの動作をエミュレートしたりできます。

次の例では、`Logger`依存関係がコンポーネントまたはその他のクラスで要求されると、`BetterLogger`がインスタンス化されます。

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: BetterLogger }]
</docs-code>

代替クラスプロバイダーが独自の依存関係を持つ場合は、親モジュールまたはコンポーネントの`providers`メタデータプロパティに両方のプロバイダーを指定します。

<docs-code header="src/app/app.component.ts" language="typescript">
[
  UserService, // `EvenBetterLogger`に必要な依存関係。
  { provide: Logger, useClass: EvenBetterLogger },
]
</docs-code>

この例では、`EvenBetterLogger`はログメッセージにユーザー名を表示します。このロガーは、注入された`UserService`インスタンスからユーザーを取得します。

<docs-code header="src/app/even-better-logger.component.ts" language="typescript"
           highlight="[[3],[6]]">
@Injectable()
export class EvenBetterLogger extends Logger {
  constructor(private userService: UserService) {}

  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}
</docs-code>

Angular DIは、`UserService`依存関係を構成する方法を知っています。なぜなら、`UserService`は上記で構成されており、インジェクターで利用可能だからです。

### エイリアスプロバイダー: useExisting

`useExisting`プロバイダーキーを使用すると、1つのトークンを別のトークンにマッピングできます。
つまり、最初のトークンは2番目のトークンに関連付けられたサービスのエイリアスになり、同じサービスオブジェクトにアクセスする2つの方法が作成されます。

次の例では、コンポーネントが新しいロガーまたは古いロガーのいずれかを要求すると、インジェクターは`NewLogger`のシングルトンインスタンスを注入します。
このように、`OldLogger`は`NewLogger`のエイリアスです。

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[4]">
[
  NewLogger,
  // NewLoggerへの参照でOldLoggerにエイリアスを付ける
  { provide: OldLogger, useExisting: NewLogger},
]
</docs-code>

注: `useClass`を使用して`OldLogger`に`NewLogger`をエイリアス付けしないようにしてください。これは、2つの異なる`NewLogger`インスタンスが作成されるためです。

### ファクトリプロバイダー: useFactory

`useFactory`プロバイダーキーを使用すると、ファクトリ関数を呼び出すことで依存関係オブジェクトを作成できます。
このアプローチでは、DIとアプリケーションの他の場所で利用可能な情報に基づいて、動的な値を作成できます。

次の例では、承認されたユーザーのみが`HeroService`で秘密のヒーローを表示できます。
承認は、別のユーザーがログインした場合など、単一のアプリケーションセッション中に変更される可能性があります。

`UserService`内のセキュリティに敏感な情報を`HeroService`から分離するには、`HeroService`コンストラクターに、秘密のヒーローの表示を制御するためのブール型のフラグを与えます。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[[4],[7]]">
class HeroService {
  constructor(
    private logger: Logger,
    private isAuthorized: boolean) { }

  getHeroes() {
    const auth = this.isAuthorized ? 'authorized' : 'unauthorized';
    this.logger.log(`Getting heroes for ${auth} user.`);
    return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
  }
}
</docs-code>

`isAuthorized`フラグを実装するには、ファクトリプロバイダーを使用して、`HeroService`の新しいロガーインスタンスを作成します。
これは、ヒーローサービスを構築する際に`Logger`を手動で渡す必要があるためです。

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript">
const heroServiceFactory = (logger: Logger, userService: UserService) =>
  new HeroService(logger, userService.user.isAuthorized);
</docs-code>

ファクトリ関数は`UserService`にアクセスできます。
`Logger`と`UserService`の両方をファクトリプロバイダーに注入して、インジェクターがファクトリ関数に渡せるようにします。

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript"
           highlight="[3,4]">
export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService]
};
</docs-code>

- `useFactory`フィールドは、プロバイダーが`heroServiceFactory`の実装であるファクトリ関数であることを指定します。
- `deps`プロパティは、プロバイダートークンの配列です。
`Logger`クラスと`UserService`クラスは、それ自身のクラスプロバイダーのトークンとして機能します。
インジェクターは、指定された順序に基づいて、これらのトークンを解決し、対応するサービスを`heroServiceFactory`ファクトリ関数の対応するパラメーターに注入します。

エクスポートされた変数`heroServiceProvider`にファクトリプロバイダーをキャプチャすると、ファクトリプロバイダーを再利用できます。

### 値プロバイダー: useValue

`useValue`キーを使用すると、静的な値をDIトークンに関連付けることができます。

このテクニックを使用して、Webサイトの基本アドレスや機能フラグなどのランタイム構成定数を提供します。
また、ユニットテストで値プロバイダーを使用して、本番データサービスの代わりにモックデータを提供できます。

次のセクションでは、`useValue`キーの詳細について説明します。

## `InjectionToken`オブジェクトの使用

非クラス依存関係のプロバイダートークンとして`InjectionToken`オブジェクトを使用します。
次の例では、`APP_CONFIG`というトークンを`InjectionToken`の型で定義しています。

<docs-code header="src/app/app.config.ts" language="typescript" highlight="[3]">
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  title: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config description');
</docs-code>

オプションの型パラメーター`<AppConfig>`とトークン説明`app.config description`は、トークンの目的を指定します。

次に、`APP_CONFIG`の`InjectionToken`オブジェクトを使用して、コンポーネントに依存関係プロバイダーを登録します。

<docs-code header="src/app/app.component.ts" language="typescript">
const MY_APP_CONFIG_VARIABLE: AppConfig = {
  title: 'Hello',
};

providers: [{ provide: APP_CONFIG, useValue: MY_APP_CONFIG_VARIABLE }]
</docs-code>

これで、`@Inject()`パラメーターデコレーターを使用して、コンストラクターに構成オブジェクトを注入できます。

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[2]">
export class AppComponent {
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.title = config.title;
  }
}
</docs-code>

### インターフェースとDI

TypeScriptの`AppConfig`インターフェースは、クラス内の型付けをサポートしますが、`AppConfig`インターフェースはDIで役割を果たしません。
TypeScriptでは、インターフェースは設計時のアーティファクトであり、DIフレームワークが使用できるランタイム表現またはトークンを持ちません。

TypeScriptがJavaScriptにトランスパイルされると、インターフェースは消えてしまいます。なぜなら、JavaScriptにはインターフェースがないからです。
Angularがランタイムでインターフェースを見つけられないため、インターフェースはトークンになることができず、インターフェースの注入もできません。

<docs-code header="src/app/app.component.ts" language="typescript">
// インターフェースをプロバイダートークンとして使用できません
[{ provide: AppConfig, useValue: MY_APP_CONFIG_VARIABLE })]
</docs-code>

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[3]">
export class AppComponent {
  // インターフェースをパラメータータイプとして使用して注入することはできません
  constructor(private config: AppConfig) {}
}
</docs-code>
