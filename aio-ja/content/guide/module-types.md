# NgModule作成のガイドライン

このトピックでは、あなたのコードをモジュール構造にまとめるために作成可能な、さまざまなカテゴリーの[NgModules](guide/glossary#ngmodule "NgModuleの定義")について概念的な概要を提供します。
これらのカテゴリーは石のように不変なものではなく、提案です。
あなたは他の目的のためにNgModuleを作ったり、これらのカテゴリーのいくつかの特徴を結合したりしたいかもしれません。

NgModuleは、アプリを系統だててコードを他のコードから分離された特定の機能・特徴に関連付けた状態に保つ、よい方法です。
NgModuleを使って[コンポーネント](guide/glossary#component "コンポーネントの定義")と[ディレクティブ](guide/glossary#directive "ディレクティブの定義")と[パイプ](guide/glossary#pipe "パイプの定義)")をまとまりのある機能のブロックに整理してください。
それぞれのブロックを、特徴やビジネスドメイン、ワークフローやナビゲーションフロー、共通のユーティリティ・コレクション、[サービス](guide/glossary#service "サービスの定義")のための1つ以上の[プロバイダー](guide/glossary#provider "プロバイダーの定義")にフォーカスしてください。

NgModuleの詳細は、[NgModuleでアプリをまとめる](guide/ngmodules "NgModuleでアプリをまとめる")を参照してください。

<div class="alert is-helpful">

NgModuleに関連したトピックで使われるサンプルアプリについては、<live-example name="ngmodules"></live-example>を参照してください。

</div>

## NgModuleのカテゴリー概要

すべてのアプリは[ルートNgModuleによるアプリの起動](guide/bootstrapping "ルートNgModuleによるアプリの起動")から始まります。
他のNgModuleは望む方法でまとめることができます。

このトピックはNgModuleの次の一般的なカテゴリーに関するいくつかのガイドラインを提供します:

* [ドメイン](#domain): ドメインNgModuleは特徴、ビジネスドメインやユーザー体験を中心にまとめます。
* [ルーテッド](#routed): このNgModuleのトップコンポーネントは[ルーター](guide/glossary#router "ルーターの定義")のナビゲーションルートの行き先としての役割を果たします。
* [ルーティング](#routing): ルーティングNgModuleは別のNgModuleのためのルーティング設定を提供します。
* [サービス](#service): サービスNgModuleはデータアクセスとメッセージ伝達のようなユーティリティーサービスを提供します。
* [ウィジェット](#widget): ウィジェットNgModuleは1つのコンポーネントやディレクティブ、パイプを他のNgModuleで使えるようにします。
* [シェアード](#shared): シェアードNgModuleはコンポーネントやディレクティブ、パイプの一式を他のNgModuleで使えるようにします。

次のテーブルは各カテゴリーの重要な特徴を要約しています。

<table>
 <tr>
   <th style="vertical-align: top">
     NgModule
   </th>

   <th style="vertical-align: top">
     宣言
   </th>

   <th style="vertical-align: top">
     プロバイダー
   </th>

   <th style="vertical-align: top">
     エクスポート
   </th>

   <th style="vertical-align: top">
     何にインポートされるか
   </th>
 </tr>

 <tr>
   <td>ドメイン</td>
   <td>あり</td>
   <td>まれ</td>
   <td>トップコンポーネント</td>
   <td>別のドメイン、AppModule</td>
 </tr>

 <tr>
   <td>ルーテッド</td>
   <td>あり</td>
   <td>まれ</td>
   <td>なし</td>
   <td>なし</td>
 </tr>

 <tr>
   <td>ルーティング</td>
   <td>なし</td>
   <td>あり (ガード)</td>
   <td>RouterModule</td>
   <td>別のドメイン(ルーティングのため)</td>
 </tr>

 <tr>
   <td>サービス</td>
   <td>なし</td>
   <td>あり</td>
   <td>なし</td>
   <td>AppModule</td>
 </tr>

 <tr>
   <td>ウィジェット</td>
   <td>あり</td>
   <td>まれ</td>
   <td>あり</td>
   <td>別のドメイン</td>
 </tr>

 <tr>
   <td>シェアード</td>
   <td>あり</td>
   <td>なし</td>
   <td>あり</td>
   <td>別のドメイン</td>
 </tr>
</table>

{@a domain}

## ドメインNgModule

ドメインNgModuleは、顧客の編集や発注といった特定の特徴やアプリドメインに特化したユーザー体験をもたらすことに使ってください。
1つの例は<live-example name="ngmodules"></live-example>にある`ContactModule`です。

ドメインNgModuleはある一定の機能に関連したコードをまとめます。その機能を作り上げるコンポーネントとルーティング、テンプレートのすべてを含みます。
ドメインNgModuleにおけるトップコンポーネントは特徴やドメインのルートの役割を果たし、あなたがエクスポートする唯一のコンポーネントです。
プライベートにサポートするサブコンポーネントはそれの子孫になります。

ドメインNgModuleを別のNgModuleにちょうど1回だけインポートしてください。たとえばあるドメインNgModuleに、もしくはごくわずかなNgModuleを含むアプリのルートNgModule(`AppModule`)にです。

ドメインNgModuleはふつうは宣言で構成されます。
プロバイダーをめったに含みません。
もし含むなら、提供されたサービスのライフタイムはそのNgModuleのライフタイムと同じになるでしょう。

<div class="alert is-helpful">

ライフサイクルについての詳細は、[コンポーネントのライフサイクルにフックする](guide/lifecycle-hooks "コンポーネントのライフサイクルにフックする")を参照してください。

</div>

{@a routed}

## ルーテッドNgModule

ルーテッドNgModuleは、すべての[遅延ロードのNgModule](guide/lazy-loading-ngmodules "NgModuleを遅延ロードする")用に使ってください。
そのNgModuleのトップコンポーネントはルーターのナビゲーションルートの行き先として使ってください。
ルーテッドNgModuleは何もエクスポートしません。それらのコンポーネントは外部コンポーネントのテンプレートに決して現れないからです。

遅延ロードされるルーテッドNgModuleを別のNgModuleへインポートしないでください。これは即時ロードを引き起こし、遅延ロードの目的をだめにしてしまいます。

ルーテッドNgModuleはめったにプロバイダーを持ちません。なぜなら必要なとき(ルーティングのためなど)だけルーテッドNgModuleをロードするからです。
このNgModuleの`provider`配列にリストされたサービスは有効になりません。ルートインジェクターが遅延ロードのNgModuleについて認識しないからです。
もしプロバイダーを含めるなら、提供されたサービスのライフタイムはそのNgModuleのライフタイムと同じになるでしょう。
ルーテッドNgModuleで、もしくはルーテッドNgModuleがインポートするNgModuleで、アプリの広範囲に至る[シングルトンサービス](guide/singleton-services)を提供しないでください。

<div class="alert is-helpful">

プロバイダーと遅延ロードされるルーテッドNgModuleの詳細は、[プロバイダーのスコープを制限する](guide/providers#limiting-provider-scope-by-lazy-loading-modules "依存性の提供: プロバイダーのスコープを制限する")を参照してください。

</div>

{@a routing}

## ルーティングNgModule

ルーティングNgModuleは、ドメインNgModuleのためのルーティング設定を提供することに使ってください。それにより、対応するドメインNgModuleからルーティングの事柄を切り離します。
1つの例が<live-example name="ngmodules"></live-example>にある`ContactRoutingModule`です。それは対応するドメインNgModuleの`ContactModule`のためにルーティングを提供します。

<div class="alert is-helpful">

ルーティングについての概要と詳細については、[アプリ内のナビゲーション: ビューへのルーティング](guide/router "アプリ内のナビゲーション: ビューへのルーティング")を参照してください。

</div>

ルーティングNgModuleを次のタスクのために使ってください:

* ルートを定義します。
* NgModuleのインポートにルーター設定を追加します。
* NgModuleのプロバイダーにガードとリゾルバのサービスプロバイダーを追加します。

ルーティングNgModuleの名前は対応するNgModuleの名前に合わせて、語尾に`Routing`を使います。
たとえば<code>contact.module.ts</code>の<code>ContactModule</code>は、<code>contact-routing.module.ts</code>の<code>ContactRoutingModule</code>という名前のルーティングNgModuleを持っています。

ルーティングNgModuleをその対応するNgModuleにのみインポートしてください。
対応するNgModuleがルートの<code>AppModule</code>なら、<code>AppRoutingModule</code>がルーター設定を<code>RouterModule.forRoot(routes)</code>を使ってそのインポートに追加します。
他のすべてのルーティングNgModuleは子であり、<code>RouterModule.forChild(routes)</code>をインポートします。

ルーティングNgModuleでは利便性のために<code>RouterModule</code>を再エクスポートしてください。それにより対応するNgModuleのコンポーネントは<code>RouterLink</code>や<code>RouterOutlet</code>のようなルーターのディレクティブへのアクセス権を持ちます。

ルーティングNgModuleでは宣言を使わないでください。
コンポーネントとディレクティブとパイプは、ルーティングNgModuleではなくその対応するドメインNgModuleの責任です。

{@a service}

## サービスNgModule

サービスNgModuleは、データアクセスやメッセージ伝達のようなユーティリティーサービスを提供することに使ってください。
理想的なサービスNgModuleは完全にプロバイダーで構成され、宣言を持ちません。
Angularの`HttpClientModule`はサービスNgModuleの好例です。

サービスNgModuleをインポートするにはルートの`AppModule`のみを使ってください。

{@a widget}

## ウィジェットNgModule

ウィジェットNgModuleは、コンポーネントやディレクティブ、パイプを外部のNgModuleで有効にすることに使ってください。
テンプレートでウィジェットを必要とするNgModuleにウィジェットNgModuleをインポートしてください。
多くのサードパーティのUIコンポーネントライブラリはウィジェットNgModuleとして提供されています。

ウィジェットNgModuleは完全に宣言で構成するものとし、そのほとんどはエクスポートされます。
めったにプロバイダーを持ちません。

{@a shared}

## シェアードNgModule

共通に使われるディレクティブとパイプとコンポーネントを1つのNgModule(典型的には`SharedModule`という名前)に入れてください。それから、アプリの他の部分でそれを必要とするところならどこでもそのNgModuleをインポートしてください。
[遅延ロードのNgModule](guide/lazy-loading-ngmodules "NgModuleを遅延ロードする")を含むあなたのドメインNgModuleで、シェアードNgModuleをインポートできます。
1つの例が<live-example name="ngmodules"></live-example>にある`SharedModule`で、カスタムパイプの`AwesomePipe`と`HighlightDirective`ディレクティブを提供しています。

シェアードNgModuleはプロバイダーを含まないようにし、同じく、それがインポートしたか再エクスポートしたどんなNgModuleもプロバイダーを含まないようにします。

あなたのコードをまとめ上げて合理化するための、共有のモジュールを使う方法について学ぶには、[アプリでNgModuleを共有する](guide/sharing-ngmodules "アプリでNgModuleを共有する")を参照してください。

## 次のステップ

あなたは次のことにも関心があるかもしれません:

* NgModuleの詳細は、[NgModuleでアプリをまとめる](guide/ngmodules "NgModuleでアプリをまとめる")を参照してください。
* ルートNgModuleの詳細を学ぶには、[ルートNgModuleによるアプリの起動](guide/bootstrapping "ルートNgModuleによるアプリの起動")を参照してください。
* よく使用されるAngularのNgModuleとそれらをアプリにインポートする方法について学ぶには、[よく使用されるモジュール](guide/frequent-ngmodules "よく使用されるモジュール")を参照してください。
* NgModuleのメタデータのプロパティについての完全な説明は、[NgModuleのメタデータを使う](guide/ngmodule-api "NgModuleのメタデータを使う")を参照してください。

NgModuleのロードと依存性とサービスの使用を管理したい場合、次を参照してください:

* アプリ開始時のNgModuleの即時ロードや、ルーターによるNgModuleの非同期の遅延ロードについて学ぶには、[フィーチャーモジュールの遅延ロード](guide/lazy-loading-ngmodules)を参照してください。
* あなたのアプリ用にサービスや他の依存を提供する方法を理解するには、[NgModuleのために依存性を提供する](guide/providers "NgModuleのために依存性を提供する")を参照してください。
* NgModuleで使うためのシングルトンサービスを作成する方法について学ぶには、[サービスをシングルトンにする](guide/singleton-services "サービスをシングルトンにする")を参照してください。
