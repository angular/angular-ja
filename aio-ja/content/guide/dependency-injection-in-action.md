# DI イン・アクション

このセクションでは、Angularの依存性の注入(DI)機能の多くについて説明します。
{@a toc}

このクックブックのコードは<live-example name="dependency-injection-in-action"></live-example>
を参照してください。

{@a nested-dependencies}

## ネストしたサービスの依存関係

注入されたサービスの _利用者_ は、そのサービスを作成する方法を知る必要はありません。
依存関係の作成とキャッシュはDIフレームワークの仕事です。
利用者は、DIフレームワークにどの依存関係が必要かを知らせるだけです。

サービスが他のサービスに依存していることはありますし、それがさらに他のサービスに依存しているかもしれません。
DIフレームワークは、これらのネストした依存関係を正しい順序で解決します。
各ステップで、
依存関係の利用者はコンストラクターで必要なものを宣言し、それをフレームワークに提供させます。

次の例では、 `AppComponent` が `LoggerService` と `UserContext` への依存を宣言します。

<code-example path="dependency-injection-in-action/src/app/app.component.ts" region="ctor" header="src/app/app.component.ts"></code-example>


`UserContext` は `LoggerService` と、特定のユーザーに関する情報を収集するサービスである
`UserService` の両方に依存します。


<code-example path="dependency-injection-in-action/src/app/user-context.service.ts" region="injectables" header="user-context.service.ts (injection)"></code-example>

Angularが `AppComponent` を作成するとき、DIフレームワークは `LoggerService` のインスタンスを作成し、 `UserContextService` の作成を開始します。
`UserContextService` も `LoggerService` が必要としますが、フレームワークはすでにそのインスタンスを持っているので、同じインスタンスを提供できます。
`UserContextService` には、フレームワークがまだ作成していない `UserService` も必要です。 `UserService` にはそれ以上の依存関係はないため、フレームワークは単純に `new` を使用してクラスをインスタンス化し、そのインスタンスを `UserContextService` コンストラクターに渡すことができます。

親の `AppComponent` は、依存先の依存関係について知る必要はありません。
コンストラクター(この場合は `LoggerService` と `UserContextService`)で必要なものを宣言すると、
フレームワークはネストした依存関係を解決します。

すべての依存関係が準備できたとき、 `AppComponent` はユーザー情報を表示します。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/logged-in-user.png" alt="Logged In User">
</figure>

{@a service-scope}

## コンポーネントサブツリーにサービスのスコープを制限する

Angularアプリケーションは、コンポーネントツリーと並列したツリー階層に配置された複数のインジェクターを持ちます。
各インジェクターは依存関係のためのシングルトンのインスタンスを作成します。
そのインジェクターがそのサービスを提供する場所すべてにその同一インスタンスが注入されます。
特定のサービスをインジェクター階層の任意のレベルで提供および作成できます。
これはつまり、サービスが複数のインジェクターによって提供される場合、サービスインスタンスは複数存在する可能性があることを意味します。

ルートインジェクターによって提供される依存関係は、アプリケーション内の *任意の場所* にある *任意* のコンポーネントに注入できます。
場合によっては、サービスの使用可能範囲をアプリケーションの特定の領域に制限したいことがあるかもしれません。
たとえば、ルートインジェクターに自動的にサービスを提供させるのではなく、
ユーザーにサービスの使用を明示的に選択させることができます。

アプリケーション階層の *特定のブランチのサブルートコンポーネント* でサービスを提供することで、
注入されるサービスのスコープをその *ブランチ* に制限することができます。
次の例では、 `HeroesBaseComponent` サブコンポーネントの `@Component()` デコレーターの `providers` 配列に
`HeroService` を追加することで、 `HeroesBaseComponent` ごとに `HeroService` インスタンスを作成する方法を説明します。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="injection" header="src/app/sorted-heroes.component.ts (HeroesBaseComponent excerpt)">

</code-example>

Angularが `HeroesBaseComponent` を作成すると、
そのコンポーネントとその子にだけ参照できる `HeroService` の新しいインスタンスも作成されます。

アプリケーション内の別の場所にある別のコンポーネントに `HeroService` を提供することもできます。
その結果、別のサービスインスタンスが別のインジェクターに存在することになります。

<div class="alert is-helpful">

このようなスコープされた `HeroService` シングルトンの例は、
`HeroBiosComponent` 、 `HeroOfTheMonthComponent` 、および `HeroesBaseComponent` を含む添付のサンプルコードのあらゆる場所でみることができます。
これらの各コンポーネントは、自身のヒーローのコレクションを管理する自身の `HeroService` インスタンスを持ちます。

</div>


{@a multiple-service-instances}


## 複数のサービスインスタンス (サンドボックス化)

コンポーネント階層の *同じレベル* で、複数のサービスインスタンスが必要な場合があります。

良い例は、連続したコンポーネントインスタンスの状態を保持するサービスです。
コンポーネントごとに個別のサービスインスタンスが必要です。
各コンポーネントのサービスおよび状態は隔離され、各サービスごとに作業状態を持ちます。
これは、各サービス、コンポーネントインスタンスごとに動作するサンドボックスをもつため、*サンドボックス化* と呼ばれています。

{@a hero-bios-component}

次の例では、 `HeroBiosComponent` は3つの `HeroBioComponent` インスタンスを持ちます。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="simple" header="ap/hero-bios.component.ts">

</code-example>


各 `HeroBioComponent` は、単一のヒーローの経歴を編集できます。
`HeroBioComponent` は、そのヒーローをフェッチ、キャッシュおよび他の永続化操作を行うための `HeroCacheService` に依存しています。

<code-example path="dependency-injection-in-action/src/app/hero-cache.service.ts" region="service" header="src/app/hero-cache.service.ts">

</code-example>


3つの `HeroBioComponent` インスタンスは、キャッシュするヒーローが互いに競合してしまうため、
同一の `HeroCacheService` インスタンスを共有することはできません。

代わりに、各 `HeroBioComponent` は、そのメタデータの `providers` 配列に `HeroCacheService` を追加することで、
*自身* の `HeroCacheService` インスタンスを取得します。

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="component" header="src/app/hero-bio.component.ts">

</code-example>


親の `HeroBiosComponent` は値を `heroId` にバインドします。
`ngOnInit` で、そのIDをヒーローをフェッチしてキャッシュするサービスに渡します。
`hero` ゲッタープロパティは、キャッシュされているヒーローをサービスから引き出します。
テンプレートでは、このデータがバインドされたプロパティを表示します。

<live-example name="dependency-injection-in-action">live code</live-example>でこの例を見つけ、
3つの `HeroBioComponent` インスタンスごとにキャッシュされたヒーローデータが存在することを確認してください。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios.png" alt="Bios">
</figure>

{@a qualify-dependency-lookup}

## パラメータデコレーターを使って依存関係の検索を限定する

クラスが依存関係を必要とする場合、その依存関係はパラメータとしてコンストラクターに追加されます。
Angularがクラスをインスタンス化する必要があるとき、DIフレームワークに依存関係を提供するように要求します。
デフォルトでは、DIフレームワークはコンポーネントのローカルインジェクターから開始し、
必要ならルートインジェクターに到達するまでインジェクターツリーをバブリングしながら
インジェクター階層内のプロバイダーを検索します。

* プロバイダーを使用して設定された最初のインジェクターは、依存関係(サービスインスタンスまたは値)をコンストラクターに提供します。

* ルートインジェクターにプロバイダーが見つからない場合、DIフレームワークはエラーを投げます。

クラスコンストラクターのサービス値パラメータに _パラメータデコレーター_ を設定することで、
デフォルトの検索の振る舞いを変更することができます。

{@a optional}

### 依存関係を `@Optional` として `@Host` で検索を制限する

依存関係は、コンポーネント階層のどのレベルでも登録できます。
コンポーネントが依存関係を要求すると、Angularはそのコンポーネントのインジェクターから開始し、
最初の適切なプロバイダーが見つかるまでインジェクターツリーを検索します。
検索中に依存関係が見つからない場合、Angularはエラーを投げます。

場合によっては、検索を制限するか、欠落している依存関係に対応する必要があります。
コンポーネントコンストラクターのサービス値パラメータで `@Host` および `@Optional`
制限デコレーターを使用してAngularの検索の振る舞いを変更できます。

* `@Optional` プロパティデコレーターは、依存関係が見つからない場合にnullを返すようにAngularに指示します。

* `@Host` プロパティデコレーターは、上方向への検索を *ホストコンポーネント* で停止します。
ホストコンポーネントは通常、依存関係を要求するコンポーネントです。
ただし、このコンポーネントが *親* コンポーネントの中に投影されると、その親コン​​ポーネントがホストになります。
次の例は、この2番目のケースを扱います。

例のように、これらのデコレーターは個別に使用することも、一緒に使用することもできます。
この `HeroBiosAndContactsComponent` は、[上](guide/dependency-injection-in-action#hero-bios-component)で見た `HeroBiosComponent` の改訂版です。

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="hero-bios-and-contacts" header="src/app/hero-bios.component.ts (HeroBiosAndContactsComponent)">

</code-example>

テンプレートに注目してください:

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="template" header="dependency-injection-in-action/src/app/hero-bios.component.ts"></code-example>

`<hero-bio>` タグの間に新しい `<hero-contact>` 要素が追加されました。
Angularは、`HeroBioComponent` ビュー内に対応する `HeroContactComponent` を *投影* または *トランスクルード* して、
`HeroBioComponent` テンプレートの `<ng-content>` スロットに配置します。

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="template" header="src/app/hero-bio.component.ts (template)"></code-example>

結果は次のように、 `HeroContactComponent` にあるヒーローの電話番号が、ヒーローの説明の上に投影された状態で表示されます。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-and-content.png" alt="bio and contact">
</figure>


デコレーターを制限するデモンストレーションを行う `HeroContactComponent` は次のようになります。

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="component" header="src/app/hero-contact.component.ts">

</code-example>

コンストラクターのパラメータに注目してください。

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="ctor-params" header="src/app/hero-contact.component.ts"></code-example>

`heroCache` コンストラクタープロパティを装飾する `@Host()` 関数を使用すると、
親の `HeroBioComponent` からキャッシュサービスへの参照を取得できます。
たとえそのサービスがコンポーネントツリーの上位のコンポーネントに含まれていても、
親になければAngularはエラーを投げます。

2番目の `@Host()` 関数は、 `loggerService` コンストラクタープロパティを装飾します。
アプリ内唯一の `LoggerService` インスタンスは、 `AppComponent` レベルで提供されます。
ホストの `HeroBioComponent` は、自身の `LoggerService` プロバイダーを持ちません。

`@Optional()` でプロパティを装飾していない場合、Angularはエラーを投げます。
プロパティがオプショナルとしてマークされている場合、Angularは `loggerService` をnullに設定し、コンポーネントの残りの部分は適応します。


`HeroBiosAndContactsComponent` の動作は次のようになります。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios-and-contacts.png" alt="Bios with contact into">
</figure>



`@Host()` デコレーターをコメントアウトすると、
Angularは `AppComponent` レベルでロガーを見つけるまでインジェクターの祖先ツリーを検索します。
ロガーロジックが起動し、ヒーローの表示がロガーが見つかったことを示すマーカー
"!!!" で更新されます。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-contact-no-host.png" alt="Without @Host">
</figure>


`@Host()` デコレーターを戻して `@Optional()` をコメントアウトすると、
ホストコンポーネントレベルで必要なロガーが見つからないので、アプリケーションは例外をスローします。

`EXCEPTION: No provider for LoggerService! (HeroContactComponent -> LoggerService)`

### `@Inject` を使用してカスタムプロバイダーを設定する

カスタムプロバイダーを使用すると、組み込みのブラウザAPIなど、暗黙的な依存関係に対する具体的な実装を提供できます。次の例では、 `InjectionToken` を使用して、[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) ブラウザAPIを `BrowserStorageService`　内で依存関係として提供します。

<code-example path="dependency-injection-in-action/src/app/storage.service.ts" header="src/app/storage.service.ts">

</code-example>

`factory` 関数はブラウザの window オブジェクトの `localStorage` プロパティを返します。 `Inject` デコレーターは、依存関係のカスタムプロバイダーを指定するために使用されるコンストラクターパラメータです。このカスタムプロバイダーは今、実際のブラウザAPIと対話することなく `localStorage` のモックAPIを使用してテスト中にオーバーライドできるようになりました。

{@a skip}

### プロバイダーの検索を `@Self` と `@SkipSelf` で変更する

プロバイダーは、コンストラクターパラメータデコレーターを介して、インジェクターによってスコープ指定することもできます。次の例では、 `sessionStorage` ブラウザAPIを使用して、 `Component` クラスの `providers` 内の `BROWSER_STORAGE` トークンをオーバーライドしています。コンストラクターでは同じ `BrowserStorageService` が2回注入され、どのインジェクターがプロバイダーの依存関係を処理するかを定義するために `@Self` と `@SkipSelf` で装飾されています。

<code-example path="dependency-injection-in-action/src/app/storage.component.ts" header="src/app/storage.component.ts">

</code-example>

`@Self` デコレーターを使用すると、インジェクターはコンポーネントインジェクターのプロバイダーだけを参照します。 `@SkipSelf` デコレーターを使用すると、ローカルインジェクターをスキップして階層内を検索し、この依存関係を満たすプロバイダーを見つけることができます。 `sessionStorageService` インスタンスは `sessionStorage` ブラウザAPIを使用して `BrowserStorageService` と対話しますが、 `localStorageService` はローカルインジェクターをスキップし、 `localStorage` ブラウザAPIを使用するルートの `BrowserStorageService` を使用します。

{@a component-element}

## コンポーネントの DOM 要素を注入する

開発者はそれを避けようと努力しますが、
多くの視覚効果やjQueryなどのサードパーティ製ツールはDOMアクセスを必要とします。
その結果、あなたはコンポーネントのDOM要素にアクセスする必要があるかもしれません。

説明のために、[属性ディレクティブ](guide/attribute-directives)ページから
`HighlightDirective` の簡易版を表示します。

<code-example path="dependency-injection-in-action/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts">

</code-example>

ユーザーがディレクティブが適用されているDOM要素の上にマウスを置くと、
ディレクティブは背景をハイライト色に設定します。

Angularは、コンストラクターの `el` パラメータに注入された `ElementRef` を設定します
(`ElementRef` はDOM要素のラッパーで、
`nativeElement` プロパティは、操作するディレクティブのDOM要素を公開します)。

サンプルコードでは、ディレクティブの `myHighlight` 属性を2つの `<div>` タグに適用します。
最初は値なし(デフォルト色)、次にカラー値が割り当てられます。

<code-example path="dependency-injection-in-action/src/app/app.component.html" region="highlight" header="src/app/app.component.html (highlight)"></code-example>


次の画像は `<hero-bios-and-contacts>` タグ上でマウスオーバーしたときのエフェクトを示しています。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/highlight.png" alt="Highlighted bios">
</figure>

{@a providers}


## プロバイダーを使用して依存関係を定義する

このセクションでは、依存サービスを提供するプロバイダーの書き方を説明します。

依存性のインジェクターからサービスを受け取るには、[トークン](guide/glossary#token)を渡す必要があります。
Angularは通常、コンストラクターパラメータとその型を指定することによってこの処理を行います。
パラメータとその型はインジェクターを検索するトークンとして機能します。
Angularはこのトークンをインジェクターに渡し、結果をパラメータに割り当てます。

次はその典型的な例です。


<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="ctor" header="src/app/hero-bios.component.ts (component constructor injection)"></code-example>


Angularは、 `LoggerService` に関連付けられているサービスをインジェクターに要求し、
返された値を `logger` パラメータに割り当てます。

インジェクターがトークンに関連付けられているサービスインスタンスをすでにキャッシュしている場合は、
そのインスタンスを提供します。
そうでない場合は、トークンに関連付けられているプロバイダーを使用して作成する必要があります。

<div class="alert is-helpful">

要求されたトークンのプロバイダーがインジェクターにない場合は、その要求をその親インジェクターに委譲し、
インジェクターがなくなるまでプロセスが繰り返されます。
検索が失敗すると、要求が[オプショナル](guide/dependency-injection-in-action#optional)でない限り、インジェクターはエラーを投げます。


</div>

新しいインジェクターにはプロバイダーを持っていません。
Angularは、作成したインジェクターを優先的なプロバイダーのセットで初期化します。
あなたは自身のアプリ特有の依存関係のためにプロバイダーを設定する必要があります。


{@a defining-providers}


### プロバイダーを定義する

依存関係は、常にデフォルトのクラスをインスタンス化する方法で作成されるとは限りません。
あなたは[依存性のプロバイダー](guide/dependency-injection-providers)で他のいくつかの方法について学びました。
次の `HeroOfTheMonthComponent` の例は、多くの選択肢とその必要性を示します。
見た目はシンプルで、いくつかのプロパティと、ロガーによって生成されたログが表示されます。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/hero-of-month.png" alt="Hero of the month">
</figure>

その背後にあるコードでは、DIフレームワークが依存関係を提供する方法と場所をカスタマイズします。
このユースケースでは、[*provide* オブジェクトリテラル](guide/dependency-injection-providers#provide)を使用して定義オブジェクトをDIトークンに関連付けるためのさまざまな方法を説明します。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="hero-of-the-month" header="hero-of-the-month.component.ts">

</code-example>

`providers` 配列では、さまざまなプロバイダー定義のキー
(`useValue` 、 `useClass` 、 `useExisting` 、または `useFactory`)を使用する方法を示します。

{@a usevalue}


#### 値プロバイダー: `useValue`

`useValue` キーを使用すると、固定値をDIトークンに関連付けることができます。
Webサイトのベースアドレスや機能のフラグなどの *実行時設定定数* を提供するためにこのテクニックを使用してください。
プロダクションのデータサービスの代わりに、単体テスト内で値プロバイダーを使用してモックデータを提供することもできます。

次の `HeroOfTheMonthComponent` の例は、2つの値プロバイダーを持ちます。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-value" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

* 1つ目は、 `new` を使用して新しく `Hero` クラスのインスタンスを作成したり、自身のキャッシュされたインスタンスを使用するのではなく、
`Hero` トークンで使用するための既存の `Hero` クラスのインスタンスを提供します。
ここでは、トークンはクラスそのものです。

* 2つ目は、 `TITLE` トークンで使用するための文字列リテラルのリソースを指定します。
`TITLE` プロバイダートークンはクラスでは *ありません* が、
代わりに `InjectionToken`
インスタンスとして表現される[インジェクショントークン](guide/dependency-injection-in-action#injection-token)と呼ばれる特別な種類のプロバイダー検索のキーを使用します。

インジェクショントークンはどんな種類のプロバイダーにも使用できますが、
依存関係が文字列、数値、関数などの単純な値である場合に特に役立ちます。

*値プロバイダー* の値はここで値を指定する前に定義する必要があります。
タイトルの文字列リテラルは直接利用できます。
この例の `someHero` 変数は、次のようにファイルの前の方で設定されています。
後の方で定義される変数は使用できません。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="some-hero" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

他の種類のプロバイダーは、値を *遅延して* (つまり、インジェクションが必要になったとき)作成できます。

{@a useclass}


#### クラスプロバイダー: `useClass`

`useClass` プロバイダーキーを使用すると、指定したクラスの新しいインスタンスを作成して返すことができます。

このプロバイダーの形式を使用することで、
共通またはデフォルトクラスを *代替実装* で置き換えることができます。
代替実装では、たとえば、異なる戦略で実装したり、デフォルトクラスを拡張したり、
テストケースで実際のクラスの動作をエミュレートしたりできます。

次のコードで、 `HeroOfTheMonthComponent` の2つの例を説明します。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-class" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

1つ目のプロバイダーは、
もっとも一般的なケースであるDIトークンで作成されるクラス(`HeroService`)を展開した形式、つまり *デシュガー* したものです。
一般的には短い形式が好ましいのですが、この長い形式は詳細を明確にします。

2つ目のプロバイダーは、 `LoggerService` を `DateLoggerService` に置き換えます。
`LoggerService` はすでに `AppComponent` レベルで登録されています。
この子コンポーネントが `LoggerService` を要求するとき、代わりに `DateLoggerService` インスタンスを受け取ります。

<div class="alert is-helpful">

このコンポーネントとその子コンポーネントツリーは、 `DateLoggerService` インスタンスを受け取ります。
ツリーの外側のコンポーネントは、引き続き元の `LoggerService` インスタンスを受け取ります。

</div>

`DateLoggerService` は `LoggerService` を継承し、各メッセージに現在の日時を追加します:

<code-example path="dependency-injection-in-action/src/app/date-logger.service.ts" region="date-logger-service" header="src/app/date-logger.service.ts"></code-example>

{@a useexisting}

#### エイリアスプロバイダー: `useExisting`

`useExisting` プロバイダーキーを使用すると、あるトークンを別のトークンにマッピングできます。
実際には、1つ目のトークンは2つ目のトークンに関連付けられているサービスの
*エイリアス* であり、同じサービスオブジェクトにアクセスする2つの方法を作成していることになります。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

このテクニックを使用して、エイリアスインターフェースを介してAPIを絞り込むことができます。
次の例は、その目的で導入されたエイリアスについて説明します。

`LoggerService` が、実際の3つのメソッドと1つのプロパティよりもはるかに大きい大規模なAPIを持っていると想像してください。
あなたはAPIとして表出させる部分を実際に必要なメンバーだけに絞り込みたいかもしれません。
次の例の `MinimalLogger` [クラスインターフェース](#class-interface)ではAPIを2つのメンバーに減らします。


<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" header="src/app/minimal-logger.service.ts"></code-example>

次の例では、 `MinimalLogger` を `HeroOfTheMonthComponent` の簡易バージョンで使用するように設定します。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.1.ts" header="src/app/hero-of-the-month.component.ts (minimal version)"></code-example>

`HeroOfTheMonthComponent` コンストラクターの `logger` パラメータは `MinimalLogger` として型指定されているため、TypeScriptに対応するエディタでは `logs` および `logInfo` メンバーのみが表示されます。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/minimal-logger-intellisense.png" alt="MinimalLogger restricted API">
</figure>


裏でAngularは `logger` パラメータに `LoggingService` トークンに登録された完全なサービスを設定します。これは、[上](guide/dependency-injection-in-action#useclass)で提供された `DateLoggerService` インスタンスです。


<div class="alert is-helpful">

これは次の図のように日付のログを表示します。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/date-logger-entry.png" alt="DateLoggerService entry">
</figure>

</div>

{@a usefactory}

#### ファクトリープロバイダー: `useFactory`

次の例のように、 `useFactory`
プロバイダーキーを使用すると、ファクトリー関数を呼び出して依存オブジェクトを作成できます。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-factory" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

インジェクターは、 `useFactory`
キーの値として指定したファクトリー関数を呼び出すことによって依存する値を提供します。
この形式のプロバイダーは
`useFactory` 関数の依存関係を指定する3番目のキー `deps` を持ちます。

このテクニックを使用して、入力が *注入されたサービス* と *ローカル状態*
の組み合わせであるファクトリー関数を使用して依存オブジェクトを作成します。

依存オブジェクト(ファクトリー関数によって返される)は通常クラスインスタンスですが、
他のものもありえます。
この例での依存オブジェクトは、
"Hero of the Month" コンテストで次点のヒーロー達の名前の文字列です。

この例において、ローカル状態は数字の `2` です。これはコンポーネントが表示すべきの次点のヒーローの人数です。
状態値は、 `runnersUpFactory()` への引数として渡されます。
`runnersUpFactory()` は、渡された状態値と注入されたサービス
`Hero` および `HeroService` の両方を使用できる *プロバイダーファクトリー関数* を返します。


<code-example path="dependency-injection-in-action/src/app/runners-up.ts" region="factory-synopsis" header="runners-up.ts (excerpt)"></code-example>

プロバイダーファクトリー関数(`runnersUpFactory()` によって返される)は、
実際の依存オブジェクト(名前の文字列)を返します。

* この関数は、勝利した `Hero` と `HeroService` を引数として取ります。
Angularは、
`deps` 配列の2つの *トークン* によって識別される注入値からこれらの引数を提供します。

* この関数は、Angularが `HeroOfTheMonthComponent` の `runnersUp`
パラメータに挿入する名前の文字列を返します。

<div class="alert is-helpful">

この関数は、 `HeroService` から候補のヒーロー達を取得し、そのうちの
`2` 人を次点とし、彼らの名前を連結したものを返します。
完全なソースコードについては、<live-example name="dependency-injection-in-action"></live-example>
を参照してください。

</div>

{@a tokens}

## プロバイダートークンの代替: クラスインターフェースと 'InjectionToken'

プロバイダートークンが、返される依存オブジェクト、またはサービスと同じ型のクラスである場合は、
Angularの依存性の注入を使用するのがもっとも簡単です。

ただし、トークンはクラスである必要はなく、たとえそれがクラスであっても、
返されるオブジェクトと同じ型である必要はありません。
それが次のセクションの主題です。
{@a class-interface}

### クラスインターフェース

前の *Hero of the Month* の例では、 `MinimalLogger` クラスを `LoggerService`
のプロバイダートークンとして使用していました。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

`MinimalLogger` は抽象クラスです。

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" header="dependency-injection-in-action/src/app/minimal-logger.service.ts"></code-example>

抽象クラスは通常、拡張できるベースクラスです。
しかし、このアプリでは、 `MinimalLogger` を継承するクラスはありません。
`LoggerService` と `DateLoggerService` は、
`MinimalLogger` を継承、
または代わりにインターフェースを実装することができましたが、
どちらもしませんでした。 `MinimalLogger` はDIトークンとしてのみ使用されます。

このようにクラスを使用する場合、それは *クラスインターフェース* と呼ばれます。

[DIプロバイダー](guide/dependency-injection-providers#interface-not-valid-token)で説明されているように、
インターフェースは実行時には存在しないTypeScriptアーティファクトであるため、有効なDIトークンではありません。
この抽象クラスインターフェースを使用することで、インターフェースの厳密な型を取得し、
かつ通常のクラスと同じ方法でプロバイダートークンとしても使用できます。

クラスインターフェースには、その利用者が呼び出すことを許可されているメンバー *だけ* を定義する必要があります。
そのような制限されたインターフェースは、具体的なクラスを利用者から切り離すのに役立ちます。


<div class="alert is-helpful">

インターフェースとしてクラスを使用すると、実際のJavaScriptオブジェクトにおけるインターフェースの特性がわかります。
ただし、メモリコストを最小限に抑えるために、このクラスは　*実装を持つべきではありません* 。
`MinimalLogger` は次のような、最適化されていない、事前にミニファイされたコンストラクター関数のJavaScriptに変換されます。

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" region="minimal-logger-transpiled" header="dependency-injection-in-action/src/app/minimal-logger.service.ts"></code-example>

クラスにメンバーがないことに注目してください。
追加したメンバーの数に関係なく、それらが実装されていない限りクラスが肥大することはありません。

TypeScriptの `MinimalLogger` クラスをもう一度見て、実装がないことを確認しましょう。

</div>


{@a injection-token}


### 'InjectionToken' オブジェクト

依存オブジェクトは、日付、数値、文字列などの単純な値、
または配列や関数などの定形のないオブジェクトをとれます。

そのようなオブジェクトはアプリケーションインターフェースを持っていないので、
クラスではうまく表現できません。
それらはユニークかつシンボリックで、わかりやすい名前を持ちながらも、
同じ名前の別のトークンと衝突しないJavaScriptオブジェクトでうまく表現されます。

`InjectionToken` はこれらの特性を持ちます。
*Hero of the Month* の例、*title* の値プロバイダー、および
*runnersUp* ファクトリープロバイダーで2回それらに遭遇しました。

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="provide-injection-token" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

`TITLE` トークンは次のように作られました:

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="injection-token" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

型パラメータはオプショナルですが、依存する型を開発者やツールに伝えます。
トークンの説明はもう1つの開発者向けの補助です。


{@a di-inheritance}

## 派生クラスに注入する

他のコンポーネントを継承するコンポーネントを書くときは注意してください。
ベースコンポーネントが注入された依存関係をもつ場合は、
派生クラスにそれらを再提供、再注入し、
コンストラクターを介してベースクラスに渡す必要があります。

次の例は、`SortedHeroesComponent` は `HeroesBaseComponent`
を継承して、*ソートされた* ヒーローのリストを表示します。

<figure>
  <img src="generated/images/guide/dependency-injection-in-action/sorted-heroes.png" alt="Sorted Heroes">
</figure>

`HeroesBaseComponent` は独立しています。
それはヒーロー達を取得し、データベースから到着した順に彼らを表示するために
それ自身の `HeroService` インスタンスを要求します。

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="heroes-base" header="src/app/sorted-heroes.component.ts (HeroesBaseComponent)">

</code-example>


<div class="alert is-helpful">

### コンストラクターをシンプルに保ちましょう

コンストラクターは変数を初期化すること以上のことをしてはいけません。
このルールにより、コンポーネントがサーバーと通信するような劇的なことをすることを恐れずに、テスト中にコンポーネントを安全に構築できます。
それが、コンストラクターではなく `ngOnInit` 内から `HeroService` を呼び出す理由です。

</div>


ユーザーはヒーローをアルファベット順に見たいとします。
元のコンポーネントを変更するのではなく、それをサブクラス化して、表示する前にヒーローをソートする
`SortedHeroesComponent` を作成します。
`SortedHeroesComponent` を使用すると、ベースクラスでヒーローを取得できます。

残念ながら、Angularは `HeroService` をベースクラスに直接注入することはできません。
*この* コンポーネントに `HeroService` を再び提供して、
それからコンストラクター内のベースクラスに渡す必要があります。


<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="sorted-heroes" header="src/app/sorted-heroes.component.ts (SortedHeroesComponent)">

</code-example>


今度は `afterGetHeroes()` メソッドに注目してください。
最初の直感では、 `SortedHeroesComponent` で `ngOnInit` メソッドを作成し、そこでソートをすると思うでしょう。
しかし、Angularはベースクラスの `ngOnInit` を呼び出す前に派生クラスの `ngOnInit` を呼び出すので、ヒーロー達が到着する前に配列をソートすることになります。
それは厄介なエラーを引き起こします。

ベースクラスの `afterGetHeroes()` メソッドをオーバーライドすることで問題が解決します。

これらの複雑さは、 *コンポーネントの継承を回避すること* を主張します。


{@a forwardref}

## 前方へのクラス参照を使用して循環参照を解消する (*forwardRef*)

TypeScriptではクラス宣言の順序が重要です。
クラスが定義されるまで、そのクラスを直接参照することはできません。

これは、特に *1ファイルにつき1クラス* の推奨されるルールを厳密に守っている場合は、通常問題にはなりません。
しかし、循環参照を避けられないこともあります。
クラス 'A' がクラス 'B' を参照し、 'B' が 'A' を参照している場合は厄介です。
そのうちの1つを最初に定義する必要があります。

Angularの `forwardRef()` 関数は、Angularが遅延して解決できる *間接参照* を作成します。

*Parent Finder* のサンプルには、崩すことが不可能な循環クラス参照がたくさんあります。

`providers` 配列中の `AlexComponent` がそうであるように、
クラスが *それ自身への参照* を作るとき、あなたはこのジレンマに直面します。
`providers` 配列は `@Component()`
デコレーター関数のプロパティで、クラス定義よりも *上* に現れなければなりません。

`forwardRef` で循環参照を解消しましょう。

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)"></code-example>


<!--- Waiting for good examples

{@a directive-level-providers}

{@a element-level-providers}

## Element-level providers

A component is a specialization of directive, and the `@Component()` decorator inherits the `providers` property from `@Directive`. The injector is at the element level, so a provider configured with any element-level injector is available to any component, directive, or pipe attached to the same element.

Here's a live example that implements a custom form control, taking advantage of an injector that is shared by a component and a directive on the same element.

https://stackblitz.com/edit/basic-form-control

The component, `custom-control`, configures a provider for the DI token `NG_VALUE_ACCESSOR`.
In the template, the `FormControlName` directive is instantiated along with the custom component.
It can inject the `NG_VALUE_ACCESSOR` dependency because they share the same injector.
(Notice that this example also makes use of `forwardRef()` to resolve a circularity in the definitions.)

### Sharing a service among components

__NEED TO TURN THIS INTO FULL EXTERNAL EXAMPLE__

Suppose you want to share the same `HeroCacheService` among multiple components. One way to do this is to create a directive.

```
<ng-container heroCache>
  <hero-overview></hero-overview>
  <hero-details></hero-details>
</ng-container>
```

Use the `@Directive()` decorator to configure the provider for the service:

```
@Directive(providers:[HeroCacheService])

class heroCache{...}
```

Because the injectors for both the overview and details components are children of the injector created from the `heroCache` directive, they can inject things it provides.
If the `heroCache` directive provides the `HeroCacheService`, the two components end up sharing them.

If you want to show only one of them, use the directive to make sure __??of what??__.

`<hero-overview heroCache></hero-overview>`

 --->
