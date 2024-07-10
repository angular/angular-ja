# モジュールに依存オブジェクトを提供する

プロバイダーは依存性がある値を取り出す方法を[Dependency Injection](/guide/dependency-injection)システムへ指示します。ほとんどの場合、これらの依存性はあなたが作成して提供するサービスによるものです。

この記事で説明されているプロバイダーを含む最終的なサンプルアプリケーションについては、
<live-example></live-example>を参照してください。

## サービスを提供する

すでに[Angular CLI](cli)で生成したアプリケーションがある場合は、 [`ng generate`](cli/generate) CLIコマンドをプロジェクトのルートディレクトリで実行してサービスを生成できます。 _User_はあなたの好きなサービス名に置きかえてかまいません。

```sh
ng generate service User
```

このコマンドによって次のような`UserService`スケルトンが作成されます:

<code-example path="providers/src/app/user.service.0.ts"  header="src/app/user.service.ts"></code-example>

あなたはいま、`UserService`をアプリケーションのどこにでも注入することができます。

サービス自体はCLIが生成したクラスであり、`@Injectable()` デコレーターが付与されます。デフォルトでは、このデコレーターには`provideIn`プロパティが設定されサービスのプロバイダーを作成します。このケースでは、`provideIn： 'root'`は Angularがサービスをルートインジェクターに提供すべきであることを指定しています。


## プロバイダーのスコープ

ルートアプリケーションインジェクターにサービスプロバイダーを追加すると、それはアプリケーション全体で使用することができます。さらに、それらのプロバイダーは、ルックアップトークンを持っている限り、アプリケーション内のすべてのクラスで利用可能です。

利用者が特定の`@NgModule`をインポートした場合にのみサービスを利用できるようにしたい場合を除いて、ルートインジェクターでサービスを提供すべきです。

## 遅延ロードモジュールでプロバイダーのスコープを制限する {@a limiting-provider-scope-by-lazy-loading-modules}

基本的に、CLIで生成されたアプリケーションでは、モジュールは即時ロードされます(つまり、アプリケーションの起動時にすべてロードされます)。Angularはインジェクターシステムを使用してモジュール間でのやりとりを可能にします。即時ロードされたアプリケーションでは、ルートアプリケーションインジェクターは、すべてのモジュールのすべてのプロバイダーをアプリケーション全体で利用可能にします。

この動作は、遅延ロードを使用すると必然的に変わってしまいます。遅延ロードとは、モジュールが必要になったときだけロードすることです。たとえば、ルーティングするときなどです。それらは即時ロードされるモジュールのようにすぐにロードされることはありません。つまり、ルートインジェクターはこれら遅延ロードされるモジュールについて認識しないため、そのモジュール内のプロバイダーの配列にリストされているサービスは使用できません。

<!-- KW--Make diagram here -->
<!-- KW--per Misko: not clear if the lazy modules are siblings or grand-children. They are both depending on router structure. -->

Angularルーターがモジュールを遅延ロードすると、新しいインジェクターが作成されます。
このインジェクターは、ルートアプリケーションインジェクターの子供となります。
インジェクターのツリーを想像してみてください。単一のルートインジェクターと、個々の遅延ロードされるモジュールのための子インジェクターがあります。
This child injector gets populated with all the module-specific providers, if any. 
Look up resolution for every provider follows the [rules of dependency injection hierarchy](guide/hierarchical-dependency-injection#resolution-rules). 

Any component created within a lazy loaded module's context, such as by router navigation, gets its own local instance of child provided services, not the instance in the root application injector.
Components in external modules continue to receive the instances created for the application root injector.

遅延ロードするモジュールでサービスを提供することはできますが、すべてのサービスを遅延ロードすることはできません。たとえば、ルーターなど、ルートモジュールでのみ機能するモジュールもあります。ルーターは、ブラウザ内のグローバルのlocationオブジェクトを使用して動作します。

Angularバージョン9からは、遅延ロードのモジュールそれぞれにあるサービスの新しいインスタンスを提供できます。次のコードはこの機能を`UserService`に加えています。

<code-example path="providers/src/app/user.service.2.ts"  header="src/app/user.service.ts"></code-example>

`providedIn: 'any'`により、すべての即時ロードされたモジュールはシングルトンのインスタンスを共有します。しかし、次の図のように、遅延ロードのモジュールは自身のユニークなインスタンスをそれぞれ取得します。

<img src="generated/images/guide/providers/any-provider.svg" alt="any-provider-scope" class="left">


## コンポーネントでプロバイダーのスコープを制限する

プロバイダーのスコープを制限するもうひとつの方法は、制限したいサービスをコンポーネントの`providers`配列に追加することです。
コンポーネントのプロバイダーとNgModuleのプロバイダーは、おたがいに独立しています。
この方法は、自分自身にサービスを必要とするモジュールを即時ロードしたいときに役立ちます。
コンポーネントにサービスを提供すると、サービスはそのコンポーネントとその子孫だけに制限されます。
同じモジュールにある他のコンポーネントからはアクセスできません。

<code-example path="providers/src/app/app.component.ts" region="component-providers" header="src/app/app.component.ts"></code-example>


## モジュールとコンポーネントのどちらでサービスを提供するか

一般的に、アプリケーション全体で必要ならルートモジュール、提供するサービスのスコープを絞りたいなら遅延ロードされるモジュールでサービスを提供してください。

ルーターはルートレベルで動作するので、プロバイダーをたとえ`AppComponent`であってもコンポーネントに配置すると、ルーターに依存する遅延ロードされるモジュールはそれらを見ることができません。

<!-- KW--Make a diagram here -->
サービスのインスタンスをコンポーネントおよびそのコンポーネントツリー、つまりその子コンポーネントに限定する必要がある場合は、プロバイダーをコンポーネントに登録してください。たとえば、`UserService`のキャッシュのプライベートコピーが必要であるユーザー編集コンポーネント `UserEditorComponent`は、`UserEditorComponent`に`UserService`を登録すべきです。そうすることで、個々の`UserEditorComponent`の新しいインスタンスごとに、自身のキャッシュされたサービスのインスタンスを得ることができます。

{@a singleton-services}
{@a component-child-injectors}

## インジェクター階層とサービスのインスタンス {@a injector-hierarchy-and-service-instances}

サービスは1つのインジェクターのスコープ内においてシングルトンです。つまり、特定のインジェクターにおいて、あるサービスのインスタンスは最大で1つです。

AngularのDIには[階層的な注入システム](guide/hierarchical-dependency-injection)があります。これは、ネストされたインジェクターが独自のサービスインスタンスを作成できることを意味します。
Angularは、`@Component()`で指定された`providers`をもつコンポーネントの新しいインスタンスを作成するたびに、そのインスタンス用に新しい子インジェクターも作成します。
同様に、実行時に新しいNgModuleが遅延ロードされると、AngularはそのNgModule用に、独自のプロバイダーをもつインジェクターを作成できます。

子モジュールとコンポーネントのインジェクターは互いに独立しており、提供されるサービスの独自の別個のインスタンスを作成します。AngularがNgModuleやコンポーネントのインスタンスを破棄すると、そのインジェクターと、インジェクターのサービスのインスタンスも破棄します。

詳しくは、[階層的インジェクター](guide/hierarchical-dependency-injection)を参照してください。


## NgModuleについてのさらに詳しい情報

あなたはこちらにも興味があるかもしれません:
* [シングルトンサービス](guide/singleton-services)では、このページで取り上げられている概念を詳しく説明しています。
* [モジュールの遅延ロード](guide/lazy-loading-ngmodules)
* [依存性プロバイダー](guide/dependency-injection-providers)
* [NgModule FAQ](guide/ngmodule-faq)
