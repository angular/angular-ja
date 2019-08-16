# 階層的な依存性の注入

Angularの依存性の注入システムは_階層的_です。
アプリのコンポーネントツリーと並行する形でインジェクターツリーを持ちます。
そのコンポーネントツリーの任意の階層でインジェクターを再設定できます。

このガイドでは、このシステムとそれをどのように使用するかを詳しくみていきます。
ここでは、この<live-example></live-example>をベースにした例を使用します。

{@a ngmodule-vs-comp}
{@a where-to-register}

## プロバイダーを設定する場所

インジェクター階層内の個別のインジェクターでプロバイダーを設定できます。
内部のプラットフォームレベルのインジェクターは、実行中のすべてのアプリで共有されます。
`AppModule`インジェクターはアプリ全体のインジェクター階層のルートです。
そして、NgModuleの中のディレクティブレベルのインジェクターはコンポーネント階層の構造に従います。

プロバイダーを設定する場所を選択することで、最終的なバンドルサイズ、サービスの_スコープ_、およびサービスの_ライフタイム_が変わります。

サービス自体の`@Injectable()`デコレーター(通常はアプリのルートレベルで)でプロバイダーを指定すると、CLIのプロダクションビルドで使用されているような最適化ツールは*ツリーシェイキング*を実行できます。これによって、アプリで使用されていないサービスが削除されます。ツリーシェイキングの結果、バンドルサイズがより小さくなります。

* [ツリーシェイク可能なプロバイダー](guide/dependency-injection-providers#tree-shakable-providers)について詳しく学んでください。

あなたはアプリのいろいろな場所で`UserService`を注入する可能性があり、毎回同じサービスインスタンスを注入したいと思うでしょう。`root`インジェクターを通して`UserService`を提供することはよい選択であり、アプリでサービスを生成するときに[Angular CLI](cli)を使用するとデフォルトで設定されます。

<div class="alert is-helpful">
<header>プラットフォームインジェクター</header>

`providedIn: 'root'`を使うことで、_アプリ_のルートインジェクター(つまり、`AppModule`のインジェクター)を設定します。
インジェクター階層全体の実際のルートは、アプリのルートインジェクターの親である_プラットフォームインジェクター_です。
これにより複数のアプリがプラットフォームの設定を共有できます。たとえば、ブラウザには1つのURLバーしかありません。実行しているアプリの数にかかわらずです。

プラットフォームインジェクターは、ブートストラップ中に内部的に使用され、プラットフォーム固有の依存関係を設定します。`platformBrowser()`関数を使って`extraProviders`を提供することでプラットフォームレベルで追加のプラットフォーム固有のプロバイダーを設定できます。

インジェクター階層による依存関係の解決についてさらに学びましょう:
[What you always wanted to know about Angular Dependency Injection tree](https://blog.angularindepth.com/angular-dependency-injection-and-tree-shakeable-tokens-4588a8f70d5d)


</div>

*NgModuleレベル*のプロバイダーは`@NgModule()`の`providers`メタデータオプション、あるいは(ルートの`AppModule`以外のモジュールにて)`@Injectable()`の`providedIn`オプションで指定できます。

モジュールが[遅延ロード](guide/lazy-loading-ngmodules)される場合、`@NgModule()`の`providers`オプションを使用してください。そのモジュールがロードされると、モジュール自身のインジェクターがプロバイダーによって設定され、Angularはそのモジュール内に作成する任意のクラスに対応するサービスを注入できます。`@Injectable()`オプションで`providedIn: MyLazyloadModule`を使用する場合、プロバイダーがアプリケーション内の他の場所で使用されていなければ、プロバイダーはコンパイル時にツリーシェイクできます。

* [ツリーシェイク可能なプロバイダー](guide/dependency-injection-providers#tree-shakable-providers)について詳しく学んでください。

ルートレベルとモジュールレベルの両方のインジェクターでは、サービスインスタンスはアプリ、またはモジュールの存続期間中存続し、Angularはそれを必要とするすべてのクラスにこの1つのサービスインスタンスを注入します。

*コンポーネントレベル*のプロバイダーは、各コンポーネントインスタンスのインジェクターを設定します。
Angularは、対応するサービスをそのコンポーネントインスタンスまたはその下位コンポーネントインスタンスにのみ注入できます。
Angularは他の場所に同一のサービスインスタンスを注入することはできません。

コンポーネントに提供されるサービスはライフタイムが制限されている場合があります。
個々のコンポーネントインスタンスの生成時に自身のサービスインスタンスを取得します。
コンポーネントインスタンスが破棄されると、そのサービスインスタンスも破棄されます。

サンプルアプリでは、アプリケーションの起動時に`HeroComponent`が作成されます。
そしてそれは決して破棄されないので、
`HeroComponent`用に生成された`HeroService`インスタンスはアプリの存続しているあいだ存続します。
`HeroService`へのアクセスを`HeroComponent`とそのネストされた`HeroListComponent`に制限したい場合、
`HeroService`をコンポーネントレベル、つまり`HeroComponent`のメタデータ内で提供してください。

* 詳細は、次の[コンポーネントレベルの依存性の注入の例](#component-injectors)を参照してください。


{@a register-providers-injectable}

### @Injectableレベルの設定

`@Injectable()`デコレーターはすべてのサービスクラスを識別します。
サービスクラスの`providedIn`メタデータオプションでは、デコレーターが付与されたクラスをサービスのプロバイダーとして使用するためのインジェクター(通常は`root`)を指定します。
注入可能なクラスが自身のサービスを`root`インジェクターに提供するとき、そのサービスはクラスがインポートされた場所ならどこでも利用可能です。

次の例では、クラスの`@Injectable()`デコレーターを使って`HeroService`のプロバイダーを設定しています。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts"  header="src/app/heroes/heroes.service.ts" linenums="false"> </code-example>

この設定はAngularに、
アプリのルートインジェクターがコンストラクターを呼び出して`HeroService`のインスタンスを生成し、
そのインスタンスをアプリケーション全体で利用できるようにする責任があることを伝えます。

アプリのルートインジェクターでサービスを提供するのは典型的なケースです。
そして、CLIは新しいサービスを生成するとき、
あなたに代わってこの種のプロバイダーを自動的に設定します。
しかし、サービスを常にルートレベルで提供したくない場合があります。
たとえば、ユーザーにサービスの使用を明示的にオプトインさせたい場合などです。

`root`インジェクターを指定するかわりに、`providedIn`に特定のNgModuleを指定することができます。

たとえば次の例では、
`HeroModule`を含んでいる任意のインジェクターで利用できるように`@Injectable()`デコレーターはプロバイダーを設定しています。

<code-example path="dependency-injection/src/app/heroes/hero.service.4.ts"  header="src/app/heroes/hero.service.ts" linenums="false"> </code-example>

これは一般的にはNgModule自身のインジェクターを設定することと違いはありません。
ただし、NgModuleがそれを使用しない場合、
サービスはツリーシェイク可能です。
一部のコンポーネントがオプショナルで注入したい*かもしれない*特別なサービスを提供し、
そのサービスを提供するかどうかをアプリに任せることができるようなライブラリで役立ちます。

* [ツリーシェイク可能なプロバイダー](guide/dependency-injection-providers#tree-shakable-providers)について詳しく学んでください。


### @NgModuleレベルのインジェクター

プロバイダーのスコープをそのモジュールに限定するために、ルート以外のNgModuleのために`providers`メタデータオプションを使って、モジュールレベルでプロバイダーを設定できます。
これは`@Injectable()`メタデータでルート以外のモジュールを指定するのと同じですが、`providers`経由で提供されるサービスはツリーシェイクできないというのが異なる点です。

アプリの`root`インジェクターは`AppModule`インジェクターなので、通常`providedIn`に`AppModule`を指定する必要はありません。
ただし、`AppModule`の`@NgModule()`メタデータでアプリ全体のプロバイダーを設定すると、
`@Injectable()`メタデータの`root`用に設定されたものを上書きします。
こうすることで、複数のアプリで共有されるサービスのデフォルトプロバイダー以外を設定できます。

`AppModule`の`providers`リストにデフォルト以外の
[ロケーションストラテジー](guide/router#location-strategy)を追加して、
コンポーネントのルーター設定をする場合の例は次のようになります。

<code-example path="dependency-injection-in-action/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)" linenums="false">

</code-example>


{@a register-providers-component}

### @Componentレベルのインジェクター

NgModule内の個別のコンポーネントは自身のインジェクターを持ちます。
`@Component`メタデータを使ってコンポーネントレベルでプロバイダーを設定することによって、
プロバイダーのスコープをコンポーネントとその子に制限できます。

次の例は、`providers`配列で`HeroService`を指定するように`HeroesComponent`を修正したものです。`HeroService`はこのコンポーネントインスタンス、または任意の子コンポーネントインスタンスにヒーローたちを提供することができます。

<code-example path="dependency-injection/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" linenums="false">
</code-example>

### 要素インジェクター

インジェクターは実際にはコンポーネントに属しているのではなく、DOM内のコンポーネントインスタンスのアンカー要素に属しています。別のDOM要素の別のコンポーネントインスタンスは、別のインジェクターを使用します。

コンポーネントは特殊な型のディレクティブであり、
`@Component`の`providers`プロパティは`@Directive()`から継承されます。
ディレクティブも依存関係をもつことができ、
それらの`@Directive()`メタデータにプロバイダーを設定できます。
`providers`プロパティを使ってコンポーネントやディレクティブのプロバイダーを設定するとき、そのプロバイダーはアンカーDOM要素のインジェクターに属します。同一要素のコンポーネントとディレクティブはインジェクターを共有します。

<!--- TBD with examples
* For an example of how this works, see [Element-level providers](guide/dependency-injection-in-action#directive-level-providers).
--->

* [Angularの要素インジェクター](https://blog.angularindepth.com/a-curios-case-of-the-host-decorator-and-element-injectors-in-angular-582562abcf0a)についてさらに学びましょう。



## インジェクターバブリング

Tour of Heroes アプリケーション上で、このガイドのバリエーションを考えてみましょう。
一番上にあるのは`HeroesListComponent`のようないくつかのサブコンポーネントをもつ`AppComponent`です。
`HeroesListComponent`は`HeroTaxReturnComponent`のインスタンスを複数保持し管理します。
次の図は、`HeroTaxReturnComponent`インスタンスが同時に3つ開かれているときの、三階層のコンポーネントツリーの状態を表しています。

<figure>
  <img src="generated/images/guide/dependency-injection/component-hierarchy.png" alt="injector tree">
</figure>

コンポーネントが依存関係をリクエストしたとき、Angularはそのコンポーネント自身のインジェクターに登録されているプロバイダーでその依存関係を解決しようとします。
コンポーネントのインジェクターにプロバイダーがない場合は、リクエストをその親コンポーネントのインジェクターに渡します。
そのインジェクターでリクエストを解決できない場合は、ツリーの上の次の親インジェクターにリクエストを渡します。
Angularがリクエストを処理できるインジェクターを見つけるまで、または先祖インジェクターがなくなるまで、リクエストはバブリングを続けます。
先祖がなくなると、Angularはエラーをスローします。

異なるレベルで同じDIトークンのプロバイダーを登録した場合、Angularが最初にみつけたものが依存関係を解決するために使用されます。たとえば、サービスを必要としているコンポーネントのローカルにプロバイダーが登録されている場合、Angularは同じサービスの別のプロバイダーを探索することはありません。


<div class="alert is-helpful">

コンポーネントのコンストラクター内の依存するサービスのパラメータに
`@Host()`パラメータデコレーターを追加することでバブリングを抑制することができます。
プロバイダーの探索は、コンポーネントのホスト要素のインジェクターで停止します。

* `@Host`とともに、プロバイダーが見つからない場合にnullケースを処理できるようにする別のパラメータデコレーターの`@Optional`を使用している[例](guide/dependency-injection-in-action#qualify-dependency-lookup)を参照してください。

* [`@Host`デコレーターと要素インジェクター](https://blog.angularindepth.com/a-curios-case-of-the-host-decorator-and-element-injectors-in-angular-582562abcf0a)についてさらに学びましょう。

</div>

トップレベル(通常はルートの`AppModule`)のルートインジェクターにプロバイダーを登録するだけの場合、インジェクターツリーはフラットになります。
`bootstrapModule`メソッドで設定したか、自身のサービスですべてのプロバイダーを`root`で登録したかにかかわらず、すべてのリクエストはルートインジェクターにバブルアップします。

{@a component-injectors}

## コンポーネントインジェクター

さまざまなレベルで1つ以上のプロバイダーを設定する機能により、興味深く有用な可能性が生まれます。
ガイドサンプルでは、用途にあわせていくつかのシナリオを説明します。

### シナリオ: サービスの隔離

アーキテクチャ上の理由から、サービスへのアクセスをそのサービスが属するアプリケーションドメインに制限したい場合があります。
たとえば、ガイドサンプルには悪役のリストを表示する`VillainsListComponent`というものがあり、
それは悪役たちを`VillainsService`から取得します。

`VillainsService`をルートの`AppModule`(あなたが`HeroesService`を登録した場所)に提供した場合、
これは_ヒーロー_のワークフローを含め、`VillainsService`をアプリケーションのすべての場所で利用可能になります。後で`VillainsService`を修正した場合、どこかのヒーローコンポーネントの中で何かしらを壊す可能性があります。ルートの`AppModule`にサービスを提供することはその危険性を生み出します。

代わりに、`VillainsListComponent`の`providers`メタデータで`VillainsService`を次のように提供することができます:


<code-example path="hierarchical-dependency-injection/src/app/villains-list.component.ts" linenums="false" header="src/app/villains-list.component.ts (metadata)" region="metadata">

</code-example>

`VillainsListComponent`メタデータで`VillainsService`を提供し、それ以外の場所では提供しないことで、
このサービスは`VillainsListComponent`とそのサブコンポーネントツリーでのみ利用可能になります。
これはまだシングルトンですが、_悪役_ドメインにのみ存在するシングルトンです。

これで、ヒーローコンポーネントがアクセスできないことを知りました。あなたはエラーへの露出を減らしました。

### シナリオ: 複数の編集セッション

多くのアプリケーションでは、ユーザーは複数開いているタスクを同時に処理できます。
たとえば、納税申告書アプリケーションでは、作成者は複数の納税申告書を作成し、
1日を通して納税申告書を切り替えることができます。

このガイドでは、そのシナリオを Tour of Heroes のテーマの例で説明します。
スーパーヒーローのリストを表示する外側の`HeroListComponent`を想像してください。

ヒーローの納税申告書を開くために、作成者はヒーローの名前をクリックします。これにより、その申告書を編集するためのコンポーネントが開きます。
選択された各ヒーローの納税申告書は個々のコンポーネントで開き、かつ複数の申告書を同時に開くことができます。

各納税申告コンポーネントには次の特性があります。

* それぞれが納税申告書の編集セッションを持ちます。
* 他のコンポーネントの申告書に影響を与えずに納税申告書を変更することができます。
* その納税申告書への変更を保存したり、それらをキャンセルすることができます。


<figure>
  <img src="generated/images/guide/dependency-injection/hid-heroes-anim.gif" alt="Heroes in action">
</figure>

`HeroTaxReturnComponent`には変更を管理し復元するロジックがあるとします。
それはシンプルなヒーローの納税申告書では簡単なタスクでしょう。
現実世界では、リッチな納税申告書のデータモデルを使用しているため、変更管理には注意が必要です。
この例のように、その管理をヘルパーサービスに委任することができます。

`HeroTaxReturnService`は次のようになります。
これは単一の`HeroTaxReturn`をキャッシュし、その申告に対する変更を監視し、それを保存または復元することができます。
また、注入によって取得されるアプリケーション全体のシングルトンである`HeroService`に委任します。


<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.service.ts" header="src/app/hero-tax-return.service.ts">

</code-example>

これを使用している`HeroTaxReturnComponent`は次のようになります。


<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" header="src/app/hero-tax-return.component.ts">

</code-example>


_編集中の納税申告書_は、ゲッターとセッターで実装されている入力プロパティを介して到達します。
セッターはコンポーネント自身の`HeroTaxReturnService`インスタンスを収入申告書で初期化します。
ゲッターは常にそのヒーローの最新の状態を返します。
コンポーネントはまた、この納税申告書を保存および復元するようにサービスに要求します。

サービスがアプリケーション全体のシングルトンの場合、これは機能しません。
各コンポーネントは同一のサービスインスタンスを共有し、各コンポーネントは別のヒーローの納税申告書を上書きしてしまいます。

これを防ぐために、コンポーネントメタデータの`providers`プロパティを使って、サービスを提供するように`HeroTaxReturnComponent`のコンポーネントレベルのインジェクターを設定します。


<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" linenums="false" header="src/app/hero-tax-return.component.ts (providers)" region="providers">

</code-example>

`HeroTaxReturnComponent`は自身の`HeroTaxReturnService`のプロバイダーを持ちます。
すべてのコンポーネント_インスタンス_は自身のインジェクターをもつことを思い出してください。
コンポーネントレベルでサービスを提供することで、コンポーネントの_すべて_のインスタンスがそれぞれサービスのプライベートインスタンスを取得し、納税申告書が上書きされることがなくなります。


<div class="alert is-helpful">


シナリオのコードの残りの部分は、ドキュメントの他の部分で学ぶことができる他のAngularの機能とテクニックに依存しています。
<live-example></live-example>から確認し、ダウンロードすることができます。


</div>



### シナリオ: 特殊化したプロバイダー

別のレベルでサービスを再提供するもう1つの理由は、コンポーネントツリーのより深いところでそのサービスを_より特殊化した_実装で置き換えることです。

いくつかのサービスに依存する自動車コンポーネントについて考えてみましょう。
ルートインジェクター(Aとマークされている)に`CarService`、
`EngineService`、および`TiresService`という_汎用的_なプロバイダーを設定したとします。

この3つの汎用サービスから構築された、自動車を表示する自動車コンポーネント(A)を作成します。

それから、コンポーネント(B)で行われていることに適した特殊な機能をもつ、
`CarService`と`EngineService`用の独自の_専用_プロバイダーを定義する子コンポーネント(B)を作成します。

コンポーネント(B)は、`CarService`の_さらに特殊化した_プロバイダーを定義する別のコンポーネント(C)の親でもあります。


<figure>
  <img src="generated/images/guide/dependency-injection/car-components.png" alt="car components">
</figure>

舞台裏では、各コンポーネントは、そのコンポーネント自体に対して定義された0、1、または複数のプロバイダーを使用して各自のインジェクターを設定します。

もっとも深いコンポーネント(C)で`Car`インスタンスを解決するとき、
そのインジェクターは`Car`インスタンスをインジェクター(C)、`Engine`インスタンスをインジェクター(B)、
`Tires`インスタンスをルートインジェクター(A)から解決し取り出します。


<figure>
  <img src="generated/images/guide/dependency-injection/injector-tree.png" alt="car injector tree">
</figure>



<div class="alert is-helpful">


この_cars_シナリオのコードは、
<live-example></live-example>から確認してダウンロードできるサンプルの`car.components.ts`と`car.services.ts`ファイルにあります。

</div>
