# AngularJS から Angular へのアップグレード

*Angular* は今日そして未来の Angular の名前です。

*AngularJS* はすべてのバージョン 1.x の Angular の名前です。

AngularJS のアプリケーションはすばらしいです。
Angular へ移行する前に必ずビジネスケースを考慮してください。
ビジネスケースに重要なことはそこへ至るまでの時間と努力です。
このガイドでは AngularJS のプロジェクトを効率的にAngular のプラットフォームへ一歩ずつ移行するための組み込みツールについて記述します。

いくつかのアプリケーションでは他のものよりも移行しやすいかもしれません。また、あなた自身のために移行しやすくするための方法もたくさんあります。
アップグレード作業を始める前に準備し、AngularJS のアプリケーションをAngular に合わせることも可能です。
これらの準備作業ではソースコードを切り離し、メンテナンス性を向上し、モダンな開発ツールに合わせていくことになります。このことは移行作業を楽にするだけでなく、
既存の AngularJS アプリケーションを改善することを意味します。

移行成功の鍵は2つのフレームワークを同じアプリケーション上で動かし、AngularJS のコンポーネントを Angular にひとつずつ移行し、順次すすめていくことです。
これにより、大きく複雑なアプリケーションであっても他のビジネスを妨げることなく移行することができるでしょう。なぜなら移行作業を共同で長い時間をかけて行うことができるようになるからです。
Angular の `upgrade` モジュールはシームレスに順次アップグレードすることができるように設計されています。

## 準備 {@a preparation}

AngularJS アプリケーションを構築する方法はたくさんあります。
これらのアプリケーションを Angular にアップグレードすることを始める際、いくつかのものは他のものよりも作業が簡単なことが明らかになるでしょう。
移行を始める前からであっても、アプリケーションが将来性のあるものにするために使うことのできるいくつかの鍵となる技術やパターンがあります。

### AngularJS スタイルガイドに準拠する {@a follow-the-angularjs-style-guide}

[AngularJS スタイルガイド][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMd]にはAngularJS アプリケーションのメンテナンス性を向上させ、見通しをよくすることが証明されているパターンとプラクティスが集められています。
そこにはどのように AngularJS のソースコードを書き、構成するかについてと &mdash;同じように重要な&mdash; どのようにAngularJS のソースコードを**書かず**、構成 **しない** かについて豊富な情報が含まれています。

Angular は AngularJS の一番よい部分を再考したバージョンです。
その意味で、ゴールは AngularJS スタイルガイドと同じです。
AngularJS のよい部分はそのままに、悪い部分は避けるということです。
もちろんそれ以外にも Angular には色々なものがありますが、*スタイルガイドに従うことで AngularJS のアプリケーションをAngular により近づけることができます*。

Angular の `upgrade/static` モジュールを使って *順次移行* を簡単にするためのいくつかのルールがあります。

*   [Rule of 1][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdSingleResponsibility]にはひとつのコンポーネントにつきひとつのファイルがあるべきだと述べられています。
    これはコンポーネントを指し示したり見つけたりしやすくするだけでなく、プログラミング言語やフレームワーク間の移行をひとつずつ行うことを可能にします。
    このサンプルアプリケーションでは各コントローラーやコンポーネント、サービス、フィルターが個々のソースファイルに書かれています。

*   [Folders-by-Feature Structure][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdFoldersByFeatureStructure]と [Modularity][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdModularity]ではより抽象的なレベルで似たような原則が定義されています。
    アプリケーションの中で異なる部分は別のディレクトリや NgModule に配置するべきです。

アプリケーションがこの方法で機能ごとにレイアウトされている場合は、機能をひとつずつ移行することが可能です。
もしアプリケーションがこのようになっていなければ、準備作業として AngularJS スタイルガイドのルールを適用することを推奨します。
これはアップグレードのためだけでなく、一般的に堅実なアドバイスです！

### モジュールローダーを使う

アプリケーションのソースコードを分解しコンポーネントをひとつずつファイルに分けていくと、プロジェクトが大量の比較的小さいファイルによって構成されることになるでしょう。
これは少数の大きなファイルによって構成するよりもきれいな方法です。しかし、 `<script>`　タグですべてのファイルを HTML ページで読み込む場合は難しくなります。
それらのタグを正しい順番でメンテナンスしなければいけない場合は特にそうです。
そのため、 *モジュールローダー* を使い始めるとよいでしょう。

[SystemJS][GithubSystemjsSystemjs] や、[Webpack][GithubWebpackMain] 、[Browserify][BrowserifyMain] のようなモジュールローダーを使うことでTypeScript や ES2015 の組み込みモジュール機構を使うことができます。
アプリケーションの別々の部分でどのソースコードが共有されるべきかを明示的に指定するために`import` と `export` 機能を使うことができます。
ES5 のアプリケーションの場合は CommonJS の`require` と `module.exports`を使うことができます。
両方の場合で、モジュールローダーはアプリケーションのソースコードが正しい順番でロードされるように制御します。

アプリケーションを本番環境に出す場合、モジュールローダーは必要なものを含んだバンドルを本番環境用に作成するのに役立ちます。

### TypeScript へ移行

Angular へのアップグレード計画に TypeScript への移行も含まれる場合、アップグレードを開始する前にTypeScript のコンパイラを導入するとよいでしょう。
これにより、実際にアップグレードする時に学び、考慮しなければいけないことがひとつ減ります。
同時に、 AngularJS のソースコードで TypeScript の機能を使い始めることもできます。

TypeScript は ECMAScript 5 のスーパーセットの次世代の ECMAScript 2015 のスーパーセットであるため、TypeScript に"切り替える"にあたり、TypeScript コンパイラをインストールしてファイル名を `*.js` から `*.ts` に変える以外は必要ありません。
しかしそれをすることは便利で刺激的であるだけではもちろんありません。
次のような追加手順によってさらなる価値を生み出します。

*   モジュールローダーを使うアプリケーションでは TypeScript のインポートとエクスポート（実態は ECMAScript 2015 のインポートとエクスポート）はソースコードをモジュール単位で構成するために使うことができます。
*   型注釈は既存の関数や変数のそれらの型を定義するために順次適用することができ、ビルド時のエラー検出や自動補完、インラインのドキュメントなどの恩恵を得ることができます。
*   アロー関数や `let`、 `const` 関数のデフォルト引数、分割代入などのようなES2015 で追加される JavaScript の機能を順次追加し、ソースコードをより表現豊かにできます。
*   サービスとコントローラーを *クラス* にすることができます。
    それにより、Angular でのサービスとコンポーネントのクラスにより近くすることができ、アップグレード後の生活がよりよいものとなります。

### コンポーネントディレクティブを使う {@a using-component-directives}

Angular において、コンポーネントはユーザーインターフェースを構築する上で中心となる原始的要素です。
UI の別々の部分をコンポーネントで定義し、全体のユーザー体験として構成します。

*コンポーネントディレクティブ* を使うことで、AngularJS でもこれを行うことができます。
これらのディレクティブは自身のテンプレートやコントローラー、入力/出力のバインディングのようなAngular のコンポーネントが定義するものと同じものを定義することができます。
コンポーネントディレクティブによって構築されたアプリケーションは`ng-controller` や `ng-include` 、スコープの継承などの低レベルの機能によって構築されたアプリケーションよりもAngular に移行しやすいです。

Angular 互換にするために、 AngularJS のコンポーネントディレクティブは次のような属性を設定する必要があります。

*   `restrict: 'E'`
    コンポーネントは通常、エレメントとして使われます。

*   `scope: {}` - 分離されたスコープです。
    Angular ではコンポーネントは常に周りと分離されているため、AngularJS でも同様にすべきです。

*   `bindToController: {}`。 
    コンポーネントへ入力と出力は `$scope` の代わりにコントローラーと繋げるべきです。

*   `controller` もしくは `controllerAs`。
    コンポーネントは自身のコントローラーを持ちます。

*   `template` もしくは `templateUrl`。 
    コンポーネントは自身のテンプレートを持ちます。

コンポーネントディレクティブは次の要素を使うこともできます。

*   `transclude: true/{}` は、コンポーネントが他の場所からコンテンツをトランスクルードする場合に使います。
*   `require` は、コンポーネントが親コンポーネントのコントローラーとやりとりするために使います。

コンポーネントディレクティブでは次のような属性は使っては **いけません** 。

*   `compile`。 
    Angular ではこの属性はサポートされません。

*   `replace: true`。 
    Angular はコンポーネントのエレメントをコンポーネントのテンプレートと置換しません。
    AngularJS でもこの属性は廃止されました。

*   `priority` と `terminal`。 
    AngularJS のコンポーネントでは使うことができますが、Angular では使うことはできないのでそれらの属性に依存したコードは書かない方がよいでしょう。

Angular のアーキテクチャに合わせた、AngularJS のコンポーネントディレクティブは次のようになります。

<code-example path="upgrade-module/src/app/hero-detail.directive.ts" header="hero-detail.directive.ts"></code-example>

AngularJS 1.5 ではこれらのようなコンポーネントディレクティブを定義しやすくするために、[コンポーネント API](https://docs.angularjs.org/api/ng/type/angular.Module#component) が導入されました。
コンポーネントディレクティブでこの API を使うことには次のような利点があります。

*   ボイラープレートのソースコードを減らせる。
*   `controllerAs` のようなベストプラクティスをコンポーネントで使うように強制できる。
*   `scope` and `restrict` のようなディレクティブの属性に適切なデフォルトの値が入る。

上記のようなコンポーネントディレクティブの例はコンポーネントを使って表現すると次のようになります。

<code-example path="upgrade-module/src/app/upgrade-io/hero-detail.component.ts" region="hero-detail-io" header="hero-detail.component.ts"></code-example>

`$onInit()`　や `$onDestroy()`、`$onChanges()`のようなコントローラーのライフサイクルをフックするメソッドは AngularJS 1.5 で導入された便利な機能です。
それらは [Angular においてほぼ同様のもの][AioGuideLifecycleHooks]があるため、コンポーネントのライフサイクルのロジックをそれらを使って構成することで、Angular へのアップグレード作業を簡単にすることができます。

## ngUpgrade を使ったアップグレード {@a upgrading-with-ngupgrade}

Angular の ngUpgrade ライブラリは本当に小さいアプリケーションが対象でない限り、アップグレードにとても便利なツールです。
それを使うことで、AngularJS と Angular のコンポーネントを同じアプリケーションに混ぜたり、合わせたりすることができ、シームレスな相互運用が可能になります。
それにより、移行期間中に2つのフレームワークが自然に共存することができるため、アップグレード作業を一度にする必要がなくなります。

<div class="alert is-helpful">

The [end of life of AngularJS][AngularBlogFindingAPathForwardWithAngularjs7e186fdd4429] is December 31st, 2021.
With this event, ngUpgrade is now in a feature complete state.
We will continue publishing security and bug fixes for ngUpgrade at least until December 31st, 2023.

</div>

### ngUpgrade はどのように機能するか {@a how-ngupgrade-works}

ngUpgrade が提供する主なツールのひとつが `UpgradeModule` です。
このモジュールには Angular と AngularJS のコードの両方をサポートするハイブリッドアプリケーションをブートストラップしたり、管理するために役立つツールが含まれています。

ngUpgrade は *AngularJS と Angular を同時に動かす* ことが本当にやりたい場合に使います。
すべての Angular のコードは Angular フレームワークの中で動き、AngularJS のコードは AngularJS フレームワークの中で動きます。
これらは両方とも実際に、フレームワークの完全な機能です。
エミュレーションではないため、両方のフレームワークがもつすべての機能と自然な挙動を期待できます。

これにより、ひとつのフレームワークで管理されるコンポーネントとサービスがもう一方のフレームワークのものと相互運用することができます。
これは3つの主要な領域で発生します。
依存性の注入と DOM、変更検知です。 

#### 依存性の注入

依存性の注入は AngularJS と Angular 両方で重要な部分ですが、実際の動作には2つのフレームワークの間でいくつかの重要な違いがあります。

| AngularJS                                                                                                           | Angular                                                                                                                                                 |
|:---                                                                                                                 |:---                                                                                                                                                     |
| Dependency injection tokens are always strings                                                                      | Tokens [can have different types][AioGuideDependencyInjection].<br />They are often classes.<br />They may also be strings.                              |
| There is exactly one injector.<br />Even in multi-module applications, everything is poured into one big namespace. |  There is a [tree hierarchy of injectors][AioGuideHierarchicalDependencyInjection], with a root injector and an additional injector for each component. |

これらの違いがあるものの、依存性の注入を相互運用することはできます。
`upgrade/static` によって違いを解消し、すべてをシームレスに動作させられます。

*   AngularJS のサービスを *アップグレード* することにより、Angular のコードでつかえるようになります。
    個々のサービスの同じシングルトンインスタンスがフレームワーク間で共有されます。
    Angular ではこれらのサービスは常に *ルートのインジェクター* として扱われ、すべてのコンポーネントから利用できます。

*   Angular サービスを *ダウングレード* することにより、AngularJS のコードで使えるようになります。
    Angular のルートのインジェクターからのサービスのみダウングレードできます。
    同じシングルトンインスタンスがフレームワーク間で共有されます。
    ダウングレードされたサービスを登録する際は、AngularJS で使うための*文字列のトークン* を指定しなければなりません。

<div class="lightbox">

<img src="generated/images/guide/upgrade/injectors.png" alt="The two injectors in a hybrid application" />

</div>

#### コンポーネントと DOM

ハイブリッドの ngUpgrade の DOM の中ではアプリケーションはAngularJS と Angular のコンポーネントやディレクティブの集まりです。
これらのコンポーネントは ngUpgrade によって共存する各フレームワークの入力と出力のバインディングを使ってお互いにやりとりします。
上記に記載したように、それらは注入された依存性を通してやりとりする場合もあります。

ハイブリッドのアプリケーションを理解する上で重要なことは DOM の中のすべての要素が
必ず2つのフレームワークのどちらかによって所有されていることです。
もう一方のフレームワークでは無視されます。もしある要素が AngularJS によって所有されている場合、Angular はその要素が存在しないものとして扱います。逆も同様です。

通常、ハイブリッドのアプリケーションは AngularJS のアプリケーションとして動作を開始し、AngularJS が index.html のようなルートのテンプレートを処理します。
AngularJS のテンプレートのどこかで Angular のコンポーネントが使われた時にAngular が出てきます。
そのコンポーネントのテンプレートは Angular によって管理されることになり、Angular のコンポーネントやディレクティブを何個でも含めることができます。

さらに、2つのフレームワークをインターリーブすることができます。
次の2つの方法のうち、どちらかを使うことで2つのフレームワークの境界を
行き来することができます。

1. もう一方のフレームワークからコンポーネント使う方法。AngularJS のテンプレートで
   Angular のコンポーネントを使うか、Angular のテンプレートで AngularJS の
   テンプレートを使う。

2. もう一方のフレームワークからトランスクルードかコンテンツ投影を行う方法。
   ngUpgrade は AngularJS のトランスクルードと Angular のコンテンツ投影という
   関連した概念を橋渡しします。

<div class="lightbox">

<img src="generated/images/guide/upgrade/dom.png" alt="DOM element ownership in a hybrid application" />

</div>

もう一方のフレームワークのコンポーネントを使う際は常に
フレームワーク間の行き来が発生します。しかし、その行き来は
コンポーネントのテンプレートの要素にのみ発生します。次のように、
Angular のコンポーネントを AngularJS から使う場合を考えてみます。

<code-example language="html" escape="html">

&lt;a-component&gt;&lt;/a-component&gt;

</code-example>

DOM 要素の `<a-component>` は AngularJS の要素として管理されます。
なぜなら、AngularJS のテンプレートの中で定義されているからです。
そのため、そこには AngularJS のディレクティブのみ追加することができますが
Angular のディレクティブは *できません* 。 `<a-component>` のテンプレートの中でのみ
Angular が入ることができます。同じことが Angular から AngularJS のコンポーネントを
使う場合にもいえます。

#### 変更検知 {@a change-detection}

AngularJS では `scope.$apply()` を使ってデータバインディングの変更や更新を検知できます。
イベントが発生するごとに `scope.$apply()` が呼び出されます。これは手動ではなく、
フレームワークによって自動的に行われます。

Angular では状況が異なります。イベントごとに変更検知が発生しますが、
発生させるために `scope.$apply()` を呼び出す必要がありません。
なぜなら Angular のコードは [Angular Zone][AioApiCoreNgzone]と
呼ばれるものの中で実行されるからです。
Angular は常にコードの終了を検知するため、
いつ変更を検知するべきかも分かるのです。
コード自体で `scope.$apply()` のようなものを呼び出す必要はありません。

ハイブリッドのアプリケーションでは、`UpgradeModule` が AngularJS と
Angular のやり方を橋渡しします。次のようなことが起こります。

* アプリケーションで発生するすべてのことは Angular ゾーンの内部で実行されます。
  このことはイベントが発生した場所が AngularJS もしくは Angular のコードかにかかわらずいえることです。
  Angular ゾーンはイベントごとに Angular の変更検知を動作させます。

* `UpgradeModule` は Angular ゾーンのターンごとに AngularJS の 
  `$rootScope.$apply()` を実行します。これにより、AngularJS の変更検知が
  イベントごとに発生することになります。

<div class="lightbox">

<img src="generated/images/guide/upgrade/change_detection.png" alt="Change detection in a hybrid application" />

</div>

実用上は、AngularJS か Angular であるかにかかわらず、
`$apply()` を呼び出す必要はありません。`UpgradeModule` が
代わりにやってくれるからです。`$apply()` を呼び出すことも *できる* ため、
既存のコードから該当の箇所を削除する必要はありません。それらの呼び出しは
ハイブリッドアプリケーションの AngularJS の変更検知を追加で実行するだけです。

Angular のコンポーネントをダウングレードし、AngularJS から使う場合は
コンポーネントの入力は AngularJS の変更検知によって監視されます。
それらの入力に変更があれば、コンポーネントの中の対応するプロパティが設定されます。
コンポーネントの [OnChanges][AioApiCoreOnchanges]インターフェースを
実装することでダウングレードしてないかのように
変更をフックすることもできます。

一方、AngularJS のコンポーネントをアップグレードして Angular から使う場合、
コンポーネントディレクティブの `scope` （もしくは `bindToController` ）を使った
バインディングはすべて Anglar の変更検知でフックされます。それらは通常の Angular の入力
として扱われます。それらの値は変更があった時に、アップグレードされたコンポーネントの
スコープ（もしくはコントローラー）に書き込まれます。

### Angular の *NgModules* で UpgradeModule を使う

アプリケーションを機能ごとにまとまったブロックとして構成するために、
AngualrJS と Angular は両方とも自身のモジュールの概念を持ってみます。

それらの詳細はアーキテクチャと実装においてまったく異なります。
AngularJS では Angular のアセットを `angular.module` プロパティに追加します。
Angular ではひとつ以上の `NgModule` で修飾されたクラスを使って
Angular のアセットをメタデータに記述することができます。2つの違いはそこで花開きます。

ハイブリッドのアプリケーションでは両方のバージョンの Angular を一度に動かします。
そのため、AngularJS と Angular 両方から最低でもひとつのモジュールが必要となります。
NgModule の内部で `UpgradeModule` をインポートし、 AngularJS のモジュールを
ブートストラップすることができます。

<div class="alert is-helpful">

詳しくは [NgModules][AioGuideNgmodules]. を参照してください。

</div>

### ハイブリッドのアプリケーションをブートストラップする {@a bootstrapping-hybrid-applications}

ハイブリッドのアプリケーションをブートストラップするためには、アプリケーションの
Angular と AngularJS の部分をそれぞれブートストラップしなければいけません。
Angular の部分を先にブートストラップし、次に `UpgradeModule` を使って AngularJS の部分をブートストラップします。

AngularJS のアプリケーションでは AngularJS のアプリケーションを
ブートストラップするためのルートの AngularJS モジュールが存在します。

<code-example path="upgrade-module/src/app/ajs-bootstrap/app.module.ts" region="ng1module" header="app.module.ts"></code-example>

純粋な AngularJS のアプリケーションは HTML 中の `ng-app` ディレクティブを使って
自動的にブートストラップされます。しかしハイブリッドのアプリケーションでは
`UpgradeModule` を通して手動でブートストラップします。
そのため、ハイブリッド方式に切り替える前の予備準備として AngularJS のアプリケーションで手動で JavaScript の
[`angular.bootstrap`][AngularjsDocsApiNgFunctionAngularBootstrap] 方式を使うことがよいでしょう。

たとえば、次のような `ng-app` によるブートストラップがあるとします。

<code-example path="upgrade-module/src/index-ng-app.html"></code-example>

HTML から `ng-app` と `ng-strict-di` ディレクティブを削除し、
代わりに JavaScriptから `angular.bootstrap` を呼ぶことで
同じことができます。

<code-example path="upgrade-module/src/app/ajs-bootstrap/app.module.ts" region="bootstrap" header="app.module.ts"></code-example>

AngularJS のアプリケーションをハイブリッドに置き換え始めるために、Angular フレームワークをロードする必要があります。
これを SystemJS を使って行う方法については [クイックスタート github リポジトリ][GithubAngularQuickstart]からの抜粋が [Setup for Upgrading to AngularJS][AioGuideUpgradeSetup] に記載されています。

`npm install @angular/upgrade --save` で `@angular/upgrade` パッケージをインストールし、
`@angular/upgrade/static` パッケージへのマッピングを追加することも必要です。

<code-example path="upgrade-module/src/systemjs.config.1.js" region="upgrade-static-package" header="systemjs.config.js (map)"></code-example>

次に、`app.module.ts` ファイルを作成し、`NgModule` クラスを追加します。

<code-example path="upgrade-module/src/app/ajs-a-hybrid-bootstrap/app.module.ts" region="ngmodule" header="app.module.ts"></code-example>

この素の最小構成の `NgModule` はすべてのブラウザ上で動く Angular アプリケーションにとって必須である `BrowserModule`
をインポートします。また、サービスやコンポーネントをアップグレードしたりダウングレードするためのプロバイダーをエクスポートを
する `UpgradeModule` も `@angular/upgrade/static` からインポートします。

`AppModule` のコンストラクターでは `UpgradeModule` のインスタンスを得るために依存性の注入が行われ、
`AppModule.ngDoBootstrap` メソッドが AngularJS アプリケーションをブートストラップするために使われます。
`upgrade.bootstrap` メソッドは [angular.bootstrap][AngularjsDocsApiNgFunctionAngularBootstrap] と完全に同じ引数をとります。

<div class="alert is-helpful">

**NOTE**: AngularJS はアプリケーションのルートのテンプレートを管理するため、
`@NgModule` デコレーターに `bootstrap` の宣言を追加しないことに注意してください。

</div>

`platformBrowserDynamic.bootstrapModule` メソッドを使って `AppModule` をブートストラップできます。

<code-example path="upgrade-module/src/app/ajs-a-hybrid-bootstrap/app.module.ts" region="bootstrap" header="app.module.ts'"></code-example>

おめでとうございます！
ハイブリッドのアプリケーションが動き始めました！
既存の AngularJS のコードは以前と同じように動作します。*そして* Angular コードを追加する準備ができました。

### AngularJS のコードから Angular のコンポーネントを使う {@a using-angular-components-from-angularjs-code}

<div class="lightbox">

<img src="generated/images/guide/upgrade/ajs-to-a.png" alt="Using an Angular component from AngularJS code" class="left" />

</div>

ハイブリッドのアプリケーションを動かし始めたなら、
コードの漸進的なアップグレード作業を始めることができます。
そのための典型的な方法のひとつは AngularJS の文脈の中で Angular のコンポーネントを使うことです。
これは完全に新しいコンポーネントか AngularJS にあったものを Angular 向けに書き直したものの場合があります。

たとえば、ヒーローに関する情報を表示する、簡単な Angular コンポーネントがあるとします。

<code-example path="upgrade-module/src/app/downgrade-static/hero-detail.component.ts" header="hero-detail.component.ts"></code-example>

このコンポーネントを AngularJS から使いたいならば、 `downgradeComponent()` メソッドを使って
*ダウングレード* する必要があります。その結果、AngularJS の *ディレクティブ* として、
AngularJS のモジュールの中に登録できます。

<code-example path="upgrade-module/src/app/downgrade-static/app.module.ts" region="downgradecomponent" header="app.module.ts"></code-example>

<div class="alert is-helpful">

By default, Angular change detection will also run on the component for every
AngularJS `$digest` cycle. If you wish to only have change detection run when
the inputs change, you can set `propagateDigest` to `false` when calling
`downgradeComponent()`.

</div>

`HeroDetailComponent` は Angular のコンポーネントであるため、 `AppModule` の中で宣言
する必要があります。

<code-example path="upgrade-module/src/app/downgrade-static/app.module.ts" region="ngmodule" header="app.module.ts">
</code-example>

<div class="alert is-helpful">

すべての Angular のコンポーネントやディレクティブ、パイプは NgModule で宣言されなければなりません。

</div>

最終的に、`heroDetail` という名前で、AngularJS のテンプレートの
中にある他のディレクティブと同じように使うことができるようになります。

<code-example path="upgrade-module/src/index-downgrade-static.html" region="usecomponent">
</code-example>

<div class="alert is-helpful">

この AngularJS のコードは `heroDetail` という名前のディレクティブ要素 (`restrict: 'E'`)
だということに注意してください。AngularJS のディレクティブ要素は _名前_ に基づいてマッチします。
*ダウングレードされた Angular のコンポーネントの `selector` メタデータは無視されます。*

</div>

もちろん、ほとんどのコンポーネントはこれほど単純ではありません。
多くは *入力* と *出力* を持ち、外の世界とつながっています。
ヒーローの情報を紹介する Angular のコンポーネントに
入力と出力が加わると次のようになります。

<code-example path="upgrade-module/src/app/downgrade-io/hero-detail.component.ts" header="hero-detail.component.ts">
</code-example>

これらの入力と出力は AngularJS のテンプレートから与えることができ、`downgradeComponent()`
がそれらを紐づけてくれます。

<code-example path="upgrade-module/src/index-downgrade-io.html" region="usecomponent">
</code-example>

AngularJS のテンプレートの中であっても、 **Angular の属性記法を使って入力と出力をバインドしている** ことに
注意してください。これはコンポーネントをダウングレードするための要件です。
それ自体の式は通常 AngularJS の式のままです。

<div class="callout is-important">

<header>
  ダウングレードしたコンポーネントの属性にはケバブケースを使ってください
</header>

ダウングレードされたコンポーネントに Angular の属性記法を使うためのルールで特記すべき例外があります。
入力または出力の名前が複数の単語から構成される場合に発生します。Angular ではこのような属性は
キャメルケースを使います。

<code-example language="html">

[myHero]="hero"
(heroDeleted)="handleHeroDeleted($event)"

</code-example>

しかし AngularJS のテンプレートから使う場合、ケバブケースを使わなければなりません。

<code-example language="html">

[my-hero]="hero"
(hero-deleted)="handleHeroDeleted($event)"

</code-example>


</div>

吐かれたオブジェクトにアクセスするために、`$event` 変数を出力で使うことができます。
この場合は `Hero` オブジェクトが該当します。なぜならそれは `this.deleted.emit()`
へ渡されたオブジェクトだからです。

これは AngularJS のテンプレートであるため、Angular でバインディングされた属性であっても、
そのエレメントにある他の AngularJS のディレクティブを引き続き使うことができます。
たとえば、`ng-repeat` を使ってそのコンポーネントのコピーをいくつも簡単に作ることができます。

<code-example path="upgrade-module/src/index-downgrade-io.html" region="userepeatedcomponent"></code-example>

### Angular のコードから AngularJS のコンポーネントディレクティブを使う {@a using-angularjs-component-directives-from-angular-code}

<div class="lightbox">

<img src="generated/images/guide/upgrade/a-to-ajs.png" alt="Using an AngularJS component from Angular code" class="left" />

</div>

このように、Angular のコンポーネントとして書き、
AngularJS のコードからそれを使うことができます。
これは低レベルのコンポーネントから移行を始めて上に向かう時に役立ちます。
しかしいくつかの場合では逆の順番（高レベルのコンポーネントから始めて下に向かう方法）で
行う方が便利なときがあります。これも `upgrade/static` を使って行うことができます。
AngularJS のコンポーネントディレクティブを *アップグレード* して
Angular から使うことができます。

すべての種類の AngularJS のディレクティブがアップグレードできるわけではありません。
[上記の準備ガイドに記載された][AioGuideUpgradeUsingComponentDirectives] 形式の*コンポーネントディレクティブ* である必要があります。
互換性を保つ安全な方法は AngularJS 1.5 で導入された[コンポーネント API][AngularjsDocsApiNgTypeAngularModule]
を使うことです。

アップグレード可能なコンポーネントの簡単な例として、テンプレートとコントローラーのみもつコンポーネントがあります。

<code-example path="upgrade-module/src/app/upgrade-static/hero-detail.component.ts" region="hero-detail" header="hero-detail.component.ts"></code-example>

`UpgradeComponent` クラスを使うことでこのコンポーネントを Angular に *アップグレード* できます。
`UpgradeComponent` を拡張して Angular の **ディレクティブ** を新しく作り、`super` を
コンストラクターの中で呼び出すことで、 AngularJS のコンポーネントをアップグレードして Angular の中で使うことができます。
あとは、`AppModule` の `declarations` 配列に追加するだけです。

<code-example path="upgrade-module/src/app/upgrade-static/hero-detail.component.ts" region="hero-detail-upgrade" header="hero-detail.component.ts">
</code-example>

<code-example path="upgrade-module/src/app/upgrade-static/app.module.ts" region="hero-detail-upgrade" header="app.module.ts">
</code-example>

<div class="alert is-helpful">

アップグレードされたコンポーネントは Angular の **コンポーネント** ではなく、 **ディレクティブ** です。
なぜなら Angular は AngularJS がその下に要素を作ることを認識しないからです。
Angular ではアップグレードされたコンポーネントはディレクティブ（ただのタグ）として認識され、
Angular はその子要素に関しては気にしません。

</div>

アップグレードされたコンポーネントはもともとの AngularJS のコンポーネントディレクティブの
スコープ/コントローラーのバインディングで定義された入力と出力をもつこともできます。
そのコンポーネントを Angular のテンプレートから使う時は
**Angular のテンプレート記法** を使い、
次のルールにしたがって入力と出力を提供してください。

|                    | Binding definition            | Template syntax                                                                                                                                                                                                                |
|:---                |:---                           |:---                                                                                                                                                                                                                            |
| Attribute binding  | `myAttribute: '@myAttribute'` | `<my-component myAttribute="value">`                                                                                                                                                                                           |
| Expression binding | `myOutput: '&myOutput'`       | `<my-component (myOutput)="action()">`                                                                                                                                                                                         |
| One-way binding    | `myValue: '<myValue'`         | `<my-component [myValue]="anExpression">`                                                                                                                                                                                      |
| Two-way binding    | `myValue: '=myValue'`         | As a two-way binding:<br />`<my-component [(myValue)]="anExpression">`<br />Since most AngularJS two-way bindings actually only need a one-way binding in practice, `<my-component [myValue]="anExpression">` is often enough. |

たとえば、ヒーローの情報を表示する AngularJS のコンポーネントディレクティブに
ひとつの入力とひとつの出力があるとします。

<code-example path="upgrade-module/src/app/upgrade-io/hero-detail.component.ts" region="hero-detail-io" header="hero-detail.component.ts"></code-example>

Angular のテンプレート記法を使うことで、このコンポーネントを Angular にアップグレードし、入力と出力をアップグレードされたディレクティブに記述し、入力と出力を提供することができます。

<code-example path="upgrade-module/src/app/upgrade-io/hero-detail.component.ts" region="hero-detail-io-upgrade" header="hero-detail.component.ts"></code-example>

<code-example path="upgrade-module/src/app/upgrade-io/container.component.ts" header="container.component.ts"></code-example>

### AngularJS のコンテンツを Angular のコンポーネントへ投影する {@a projecting-angularjs-content-into-angular-components}

<div class="lightbox">

<img src="generated/images/guide/upgrade/ajs-to-a-with-projection.png" alt="Projecting AngularJS content into Angular" class="left" />

</div>

ダウングレードされた Angular のコンポーネントを AngularJS のテンプレートから
使う時、いくつかのコンテンツを *トランスクルード* する必要が出てくるかもしれません。
これをすることも可能です。Angular にトランスクルードにあたるものはないものの、
似た概念として *コンテンツ投影* があります。`upgrade/static` を使うことで、
これらの２つの機能を相互運用することができます。

Angular のコンポーネントは `<ng-content>` タグをそれらの中で使うためにコンテンツ投影
をサポートしています。そのようなコンポーネントの例がこちらです。

<code-example path="upgrade-module/src/app/ajs-to-a-projection/hero-detail.component.ts" header="hero-detail.component.ts">
</code-example>

このコンポーネントを AngularJS で使う際、それにコンテンツを与えることができます。
ちょうど AngularJS でトランスクルードされた場合のように、
Angular の `<ng-content>` タグの位置に投影されます。

<code-example path="upgrade-module/src/index-ajs-to-a-projection.html" region="usecomponent">
</code-example>

<div class="alert is-helpful">

Angular コンポーネントの中で AngularJS のコンテンツが投影された時、それは依然として
"AngularJS の領土" にいて、AngularJS フレームワークによって管理されています。

</div>

### Angular のコンテンツを AngularJS のコンポーネントディレクティブにトランスクルードする {@a transcluding-angular-content-into-angularjs-component-directives}

<img src="generated/images/guide/upgrade/a-to-ajs-with-transclusion.png" alt="Projecting Angular content into AngularJS" class="left">

ちょうど AngularJS のコンテンツを Angular のコンポーネントに投影したように、
アップグレードされたバージョンを使うことで Angular のコンテンツを AngularJS の
コンポーネントに *トランスクルードする* ことができます。

AngularJS のコンポーネントディレクティブがトランスクルードをサポートする時、
トランスクルードを行う地点を示すために `ng-transclude` ディレクティブを
テンプレートの中で使うことができます。

<code-example path="upgrade-module/src/app/a-to-ajs-transclusion/hero-detail.component.ts" header="hero-detail.component.ts">
</code-example>

もしこのコンポーネントをアップグレードして Angular から使う場合は
そのコンポーネントのタグをコンテンツと一緒に配置し、トランスクルードさせることができます。

<code-example path="upgrade-module/src/app/a-to-ajs-transclusion/container.component.ts" header="container.component.ts">
</code-example>

### AngularJS の依存性を Angular に注入できるようにする {@a making-angularjs-dependencies-injectable-to-angular}

ハイブリッドのアプリケーションを動かす時、
AngularJS の依存性を Angular のコードに注入したい状況に遭遇するかもしれません。
もしかしたらビジネスロジックが AngularJS のサービスに残っているかもしれません。
もしかしたら `$location` や `$timeout` のような AngularJS の組み込みのサービスを使いたいかもしれません。

このような状況では、AngularJS のプロバイダーを Angular に *アップグレード* することが可能です。
これにより、Angular のコードでそれらを使うことができます。たとえば、AngularJS で `HeroesService`
というサービスがあったとします。

<code-example path="upgrade-module/src/app/ajs-to-a-providers/heroes.service.ts" header="heroes.service.ts">
</code-example>

Angular の [ファクトリプロバイダー][AioGuideDependencyInjectionProvidersFactoryProviders] を使ってサービスをアップグレードすることができます。それは AngularJS の `$injector` からサービスを呼び出します。

ファクトリプロバイダーは別の `ajs-upgraded-providers.ts` ファイルで
宣言することで共存させ、参照したり新しいものを作ったり、
アップグレードの完了後に削除しやすくするやり方の方がよいでしょう。

`heroesServiceFactory` をエクスポートして
AOT コンパイラに処理させることも推奨します。

<div class="alert is-helpful">

**備考** ファクトリの中の 'heroes' という文字列は AngularJS の `HeroesService` を参照します。
AnugularJS のアプリケーションではサービス名を、たとえば "heroes" のように、トークンとして使ったり、
クラス名を作る時に "Service" 接尾辞をつけることは典型的です。

</div>

<code-example path="upgrade-module/src/app/ajs-to-a-providers/ajs-upgraded-providers.ts" header="ajs-upgraded-providers.ts">
</code-example>

`@NgModule` を追加してサービスを Angular に提供することができます。

<code-example path="upgrade-module/src/app/ajs-to-a-providers/app.module.ts" region="register" header="app.module.ts">
</code-example>

クラスを型注釈として使い、そのサービスをコンポーネントのコンストラクターの中で注入して使ってみましょう。

<code-example path="upgrade-module/src/app/ajs-to-a-providers/hero-detail.component.ts" header="hero-detail.component.ts">
</code-example>

<div class="alert is-helpful">

この例ではサービスクラスをアップグレードしました。
TypeScript の型注釈を依存性の注入をする時に使うことができます。依存関係の
扱いに影響はあたえずに、静的な型チェックの恩恵を得ることができます。
これは必須ではありませんが、どの AngularJS のサービス、ファクトリー、
プロバイダーであってもアップグレードできます。

</div>

### Angular の依存性を AngularJS に注入できるようにする {@a making-angular-dependencies-injectable-to-angularjs}

AngularJS の依存関係をアップグレードすることに加え、Angular の依存関係を
*ダウングレード* し、 AngularJS から使うこともできます。これはサービスを
Angular に移行し始めた時や、AngularJS で書かれたコンポーネントを維持しつつ
Angular で新しいサービスを作ったりする時に便利です。

たとえば、`Heroes` という Angular のサービスがあるとします。

<code-example path="upgrade-module/src/app/a-to-ajs-providers/heroes.ts" header="heroes.ts">
</code-example>

Angular のコンポーネントではモジュールの `providers` のリストに追加することで `NgModule` にプロバイダーを登録できます。

<code-example path="upgrade-module/src/app/a-to-ajs-providers/app.module.ts" region="ngmodule" header="app.module.ts">
</code-example>

`downgradeInjectable()` を使って *AngularJS のファクトリ関数* に Angular `Heroes` を入れ、
ファクトリを AngularJS のモジュールにつなぎましょう。
AngularJS での依存関係の名前は任意です。

<code-example path="upgrade-module/src/app/a-to-ajs-providers/app.module.ts" region="register" header="app.module.ts">
</code-example>

これにより、サービスが AngularJS のコードで使えるようになりました。

<code-example path="upgrade-module/src/app/a-to-ajs-providers/hero-detail.component.ts" header="hero-detail.component.ts">
</code-example>

## AngularJS を遅延読み込みする

アプリケーションを構築する時、必要なリソースが必要な時に読み込まれて欲しいことかと思います。アセットやコードにかかわらず、必要な時まで読み込みを待つことはアプリケーションを効率的にするために必要なことです。このことは異なるフレームワークをひとつのアプリケーションで動かしている場合に特にいえることです。

[遅延読み込み][AioGuideGlossaryLazyLoading]はアセットやコードのようなリソースを必要になるまで読み込みを遅らせるテクニックです。これは特に異なるフレームワークをひとつのアプリケーションで動かしているような場合に、起動時間を減らし、効率性をあげることができます。

ハイブリッド方式で大きなアプリケーションを AngularJS から Angular へ移行する場合、一番共通して使われている機能から先に移行し、あまり共通して使われていない機能は必要な場合にのみ使いたいかと思います。そのようにすることで、アプリケーションが移行中であってもシームレスなユーザー体験を提供することに役立つでしょう。

アプリケーションをレンダリングするために Angular と AngularJS の両方を使用する環境では、クライアントに送られたバンドルの中で両方のフレームワークが読み込まれます。これによりバンドルのサイズの増加とパフォーマンスの低下が起こります。

全体のアプリケーションのパフォーマンスは Angular によってレンダリングされるページをユーザーがみている場合に影響します。なぜなら AngularJS のフレームワークとアプリケーションはアクセスされていなくても読み込まれ、実行されているからです。

バンドルのサイズとパフォーマンスの問題を段階的に減らすことができます。AngularJS を別のバンドルに分離させることで [遅延読み込み][AioGuideGlossaryLazyLoading]を使い、読み込みやブートストラップ、AngularJS のレンダリングを必要な時にだけ行うことができます。この戦略では最初に読み込まれるバンドルのサイズを減らし、両方のフレームワークの読み込みが与える影響を減らすことができ、アプリケーションを可能な限り効率的に動かすことができます。

次のステップにより行うことができます。

* AngularJS のバンドルにコールバック関数を設定します。
* AngularJS のアプリケーションをブートストラップし、遅延読み込みをするためのサービスを作成します。
* AngularJS のコンテンツをルーティングするためのコンポーネントを作成します。
* AngularJS 独自の URL 向けにカスタムの `matcher` 関数を作成し、Angular の `Router` に設定します。

### AngularJS を遅延読み込みするためのサービスを作る

Angular バージョン 8 で、遅延読み込みは動的なインポート記法 `import('...')` を使って簡単に行うことができます。AngularJS を遅延読み込みするために動的なインポートを使う新しいサービスを作ります。

<code-example path="upgrade-lazy-load-ajs/src/app/lazy-loader.service.ts" header="src/app/lazy-loader.service.ts">
</code-example>

このサービスはバンドル化された AngularJS のアプリケーションを遅延読み込みするために、`import()` メソッドを使います。これにより、ユーザーがまだ必要としない部分に関しては読み込みを行わないことで、最初に読み込まれるバンドルのサイズを減らすことができます。読み込みが行われたあと、アプリケーションを手動で _ブートストラップ_ する方法を提供する必要もあります。AngularJS では [angular.bootstrap()][AngularjsDocsApiNgFunctionAngularBootstrap] メソッドを HTML 要素と一緒に使うことでアプリケーションを手動でブートストラップできます。AngularJS のアプリケーションではブートストラップするために `bootstrap` メソッドを公開しておくことも必要です。

AngularJS でグローバルのリスナーの削除などが必要に応じて実行されるために、`$rootScope.destroy()` メソッドを呼び出すメソッドを実装します。

<code-example path="upgrade-lazy-load-ajs/src/app/angularjs-app/index.ts" header="angularjs-app">
</code-example>

AngularJS のアプリケーションにはコンテンツをレンダリングする必要があるルートのみが設定されました。アプリケーションの残りのルートは Angular のルーターによって制御されます。AngularJS のアプリケーションをブートストラップするための `bootstrap` メソッドがバンドルが読み込まれたあとに、Angular アプリケーションで呼ばれます。

<div class="alert is-important">

**備考** AngularJS が読み込まれ、ブートストラップされたあとも、ルートの設定を紐づけるリスナーはルートの変更を監視し続けます。AngularJS が表示されていない時はリスナーが停止するように、 [$routeProvider][AngularjsDocsApiNgrouteProviderRouteprovider] で空のテンプレートをレンダリングする `otherwise` オプションを設定します。これにより、他のすべてのルートは Angular によって制御されます。

</div>

### AngularJS のコンテンツをレンダリングするためのコンポーネントを作る

Angular のアプリケーションでは、AngularJS のコンテンツのプレースホルダーとしてコンポーネントが必要になります。このコンポーネントは AngularJS のアプリケーションを読み込み、ブートストラップするために作成したサービスを、コンポーネントが初期化された後に使います。

<code-example path="upgrade-lazy-load-ajs/src/app/angular-js/angular-js.component.ts" header="src/app/angular-js/angular-js.component.ts">
</code-example>

Angular のルーターが AngularJS のルートにマッチした場合、`AngularJSComponent` がレンダリングされ、コンテンツが AngularJS の [`ng-view`][AngularjsDocsApiNgrouteDirectiveNgview] ディレクティブの中でレンダリングされます。ユーザーがルートの外に遷移した時は AngularJS の `$rootScope` が削除されます。

### AngularJS のルート用にカスタムマッチャーを設定する

Angular のルーターを設定するために、AngularJS の URL のためのルートを定義しなければいけません。それらの URL にマッチさせるために、`matcher` プロパティを使ってルートの設定をします。`matcher` によって URL のパスへカスタムのパターンマッチングを使うことができます。Angular のルーターは静的で可変なルートを最初にマッチしようとします。マッチするものが見つからなかった場合はルートの設定で定義されたカスタムマッチャーを参照します。カスタムマッチャーでもマッチしなかった場合は 404 などのようなページに行きます。

次の例では AngularJS のルートのためにカスタムマッチャーの関数を定義します。

<code-example path="upgrade-lazy-load-ajs/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts" region="matcher">
</code-example>

次のコードでは `matcher` プロパティとカスタムマッチャー、 `component` プロパティを `AngularJSComponent` で使い、ルートの設定にルートのオブジェクトを追加しています。

<code-example path="upgrade-lazy-load-ajs/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts">
</code-example>

アプリケーションが AngularJS を必要とするルートにマッチした場合は、AngularJS のアプリケーションは読み込まれ、ブートストラップされ、AngularJS のルートがコンテンツのレンダリングに必要な URL にマッチし、AngularJS と Angular フレームワークでアプリケーションが動きます。

## 統合された Angular Location サービスを使う {@a using-the-unified-angular-location-service}

AngularJS では [$location service][AngularjsDocsApiNgServiceLocation] がすべてのルーティングの設定とページ遷移、URL のエンコードとデコード、リダイレクト、ブラウザ API とのやりとりを制御します。Angular はこれらの処理を `Location` サービスが担当します。

AngularJS から Angular に移行する時、新しい API を使えるように、そのような責務はできるだけ Angular に移したいことでしょう。そのような移行のために、Angular は `LocationUpgradeModule` を提供しています。このモジュールは AngularJS の `$location` サービスと Angular の `Location` サービスの責務を _統合した_ location サービスを実現します。

`LocationUpgradeModule` を使うために、`@angular/common/upgrade` をインポートして、静的な `LocationUpgradeModule.config()` メソッドを使い、`AppModule` のインポートに追加します。

<code-example language="typescript">

// Other imports ...
import { LocationUpgradeModule } from '@angular/common/upgrade';

@NgModule({
  imports: [
    // Other NgModule imports...
    LocationUpgradeModule.config()
  ]
})
export class AppModule {}

</code-example>

`LocationUpgradeModule.config()` メソッドに `useHash` プロパティ をもつ `LocationStrategy` や `hashPrefix` プロパティをもつ URL 接頭辞を含む、設定のオブジェクトを渡すことができます。

`useHash` プロパティの初期値は `false` で、 `hashPrefix` の初期値は空の `string` です。上書きするには設定オブジェクトを渡してください。

<code-example language="typescript">

LocationUpgradeModule.config({
  useHash: true,
  hashPrefix: '!'
})

</code-example>

<div class="alert is-important">

**備考** `LocationUpgradeModule.config()` メソッドで使える設定オプションの詳細は `LocationUpgradeConfig` を参照してください。

</div>

これは AngularJS の `$location` プロバイダーの代わりを登録します。一度登録されたら、遷移時に実行される AngularJS におけるすべての遷移やルーティングのブロードキャストメッセージ、いずれかの必要なダイジェストサイクルは Angular によって制御されます。これにより、１つのやり方で一貫してハイブリッドアプリケーションの両側で遷移を行うことができます。

AngularJS において `$location` サービスをプロバイダーとしてつかうために、ファクトリプロバイダーを使って `$locationShim` をダウングレードする必要があります。

<code-example language="typescript">

// Other imports ...
import { $locationShim } from '@angular/common/upgrade';
import { downgradeInjectable } from '@angular/upgrade/static';

angular.module('myHybridApp', [...])
  .factory('$location', downgradeInjectable($locationShim));

</code-example>

Angular のルーターを導入したならば、AngularJS と Angular での遷移のための単一のソースコードを使ったままで、統合された location サービスを通して Angular のルーターによって実行することができます。

<!--
TODO:
Correctly document how to use AOT with SystemJS-based `ngUpgrade` apps (or better yet update the
`ngUpgrade` examples/guides to use `@angular/cli`).
See https://github.com/angular/angular/issues/35989.

## ハイブリッドのアプリケーションで事前コンパイルを使う

他の Angular アプリケーションのように、ハイブリッドのアプリケーション上でも
事前(AOT)コンパイルを利用することができます。
ハイブリッドアプリケーション向けの設定は `index.html` と `main-aot.ts` に
違いがある以外は [事前コンパイルの章](guide/aot-compiler)
で記載されている方法とほぼ同じです。

`index.html` は AngularJS のファイルを読み込む script タグがある場合が多いため、
AOT コンパイラも `index.html` にあるそれらのファイルを読み込まなければなりません。
それらを簡単にコピーするには、 `copy-dist-files.js` ファイルを個々に追加します。

ハイブリッドのアプリケーションをブートストラップするために、
元々の `AppModule` の代わりに、`AppModuleFactory` を使う必要があります。

<code-example path="upgrade-phonecat-2-hybrid/app/main-aot.ts" header="app/main-aot.ts">
</code-example>

Angular のアプリケーションの AOT の恩恵をすべて得るために必要なことは以上です！
-->

## PhoneCat のアップグレードのチュートリアル

この章では、`ngUpgrade` を使ってアプリケーションのアップグレードを準備する方法を学びます。
サンプルのアプリケーションは私たちの多くが Angular の冒険を開始したであろう、
[AngularJS のチュートリアル][AngularjsDocsTutorial]の
[Angular PhoneCat][GithubAngularAngularPhonecat]です。
これから、このアプリケーションを Angular の勇敢な新しい世界へ連れてくる方法を見ていきます。

その過程で、[準備ガイド][AioGuideUpgradePreparation] に書かれた手順を
適用する方法を見ていきます。アプリケーションを Angular に合わせ、
TypeScript で書き始めます。

This tutorial is based on the 1.5.x version of the `angular-phonecat` tutorial, which is preserved in the [1.5-snapshot][GithubAngularAngularPhonecatCommits15Snapshot] branch of the repository.
To follow along, clone the [angular-phonecat][GithubAngularAngularPhonecat] repository, check out the `1.5-snapshot` branch and apply the steps as you go.

プロジェクト構成については、このようなところから始めていきます。

<div class='filetree'>
  <div class='file'>
    angular-phonecat
  </div>
  <div class='children'>
    <div class='file'>
      bower.json
    </div>
    <div class='file'>
      karma.conf.js
    </div>
    <div class='file'>
      package.json
    </div>
    <div class='file'>
      app
    </div>
    <div class='children'>
      <div class='file'>
        core
      </div>
      <div class='children'>
        <div class='file'>
          checkmark
        </div>
        <div class='children'>
          <div class='file'>
            checkmark.filter.js
          </div>
          <div class='file'>
            checkmark.filter.spec.js
          </div>
        </div>
        <div class='file'>
          phone
        </div>
        <div class='children'>
          <div class='file'>
            phone.module.js
          </div>
          <div class='file'>
            phone.service.js
          </div>
          <div class='file'>
            phone.service.spec.js
          </div>
        </div>
        <div class='file'>
          core.module.js
        </div>
      </div>
      <div class='file'>
        phone-detail
      </div>
      <div class='children'>
        <div class='file'>
          phone-detail.component.js
        </div>
        <div class='file'>
          phone-detail.component.spec.js
        </div>
        <div class='file'>
          phone-detail.module.js
        </div>
        <div class='file'>
          phone-detail.template.html
        </div>
      </div>
      <div class='file'>
        phone-list
      </div>
      <div class='children'>
        <div class='file'>
          phone-list.component.js
        </div>
        <div class='file'>
          phone-list.component.spec.js
        </div>
        <div class='file'>
          phone-list.module.js
        </div>
        <div class='file'>
          phone-list.template.html
        </div>
      </div>
      <div class='file'>
        img
      </div>
      <div class='children'>
        <div class='file'>
           ...
        </div>
      </div>
      <div class='file'>
        phones
      </div>
      <div class='children'>
        <div class='file'>
           ...
        </div>
      </div>
      <div class='file'>
        app.animations.js
      </div>
      <div class='file'>
        app.config.js
      </div>
      <div class='file'>
        app.css
      </div>
      <div class='file'>
        app.module.js
      </div>
      <div class='file'>
        index.html
      </div>
    </div>
    <div class='file'>
      e2e-tests
    </div>
    <div class='children'>
      <div class='file'>
        protractor-conf.js
      </div>
      <div class='file'>
        scenarios.js
      </div>
    </div>
  </div>
</div>

これはかなりよい開始地点です。
ソースコードはアップグレードの[事前準備][AioGuideUpgradeFollowTheAngularjsStyleGuide] として重要な、AngularJS 1.5 のコンポーネント API を使っており、構成が [AngularJS スタイルガイド][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMd]にしたがっています。

* [Rule of 1][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdSingleResponsibility] にあるように、
  個々のコンポーネントやサービス、フィルターは個々のソースファイルにあります。

* `core` や `phone-detain`、`phone-list` モジュールは
  個々のサブディレクトリにあり、
  これらのサブディレクトリには JavaScript のコードと、
  個々の機能に特有の HTML テンプレート があります。
  これは [Folders-by-Feature Structure][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdFoldersByFeatureStructure] と[Modularity][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdModularity] のルールに書かれていることです。

* ユニットテストは [Organizing Tests][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdOrganizingTests] の
  ルールに書かれているように、アプリケーションのコードと対応するように配置され、見つけやすくなっています。

### TypeScript に切り替える

Angular のコードは TypeScript で書くようになるため、
アップグレードを始める前に TypeScript のコンパイラを導入した方がよいでしょう。

NPM を使って新しい依存関係をインストールし、Bower パッケージマネージャーから
少しずつ脱却し、最終的に Bower を削除しましょう。

始めに、TypeScript をプロジェクトへインストールしましょう。

<code-example language="shell">

npm i typescript --save-dev

</code-example>

AngularJS や AngularJS Material、Jasmine ユニットテストフレームワークのように、
事前に型がパッケージされていない既存のライブラリの型定義を
インストールします。

For the PhoneCat app, we can install the necessary type definitions by running the following command:

<code-example language="shell">

npm install @types/jasmine @types/angular @types/angular-animate @types/angular-aria @types/angular-cookies @types/angular-mocks @types/angular-resource @types/angular-route @types/angular-sanitize --save-dev

</code-example>

If you are using AngularJS Material, you can install the type definitions via:

<code-example language="shell">

npm install @types/angular-material --save-dev

</code-example>

[TypeScript 設定][AioGuideTypescriptConfiguration]ガイドに記載されているように、
プロジェクトのディレクトリにある `tsconfig.json` を使って TypeScript のコンパイラを設定してください。
`tsconfig.json` ファイルは TypeScript のコンパイラへどのように TypetScript のファイルを
CommonJS のモジュールへバンドルされた ES5 のコードに変えるかを指定します。

最後に、TypeScript のファイルを JavaScript に(`tsconfig.json` 設定ファイルに基づいて)コンパイルするために、
いくつかの npm スクリプトを `package.json` に追加します。

<code-example language="shell">

"scripts": {
  "tsc": "tsc",
  "tsc:w": "tsc -w",
  ...

</code-example>

コマンドラインから TypeScript のコンパイラを watch モードで起動します。

<code-example language="shell">

npm run tsc:w

</code-example>

このプロセスをバックグラウンドで動かし続けることで、変更を監視し、再コンパイルを行います。

次に、現在の JavaScript ファイルを TypeScript に変換します。
TypeScript は ECMAScript 5 のスーパーセットの次世代の
ECMAScript 2015 のスーパーセットであるため、ファイルの拡張子を `.js` から
`.ts` に単純に変更することで以前と同じように動きます。TypeScript のコンパイラが
実行されるとすべての `.ts` ファイルに対応する `.js` ファイルが出力されます。
実際に実行されるのはそのコンパイルされた JavaScript です。`npm start` で
プロジェクトの HTTP サーバーを起動すると、完璧に動作するアプリケーションを
ブラウザで見ることができるでしょう。

TypeScript を導入しましたが、いくつかの機能のみ利用を開始したにすぎません。
その言語が AngularJS のアプリケーションに提供できる価値はたくさんあります。

始めに、TypeScript は ES2015 のスーパーセットです。ES5 で書かれた、
どのアプリケーションも - PhoneCat の例のように - TypeScript を使うことで、
ES2015 で追加された JavaScript の新機能を相互運用することができます。
たとえば、`let` や `const`、アロー関数、関数のデフォルト引数、
分割代入などがあります。

さらに、*型安全* をコードに追加し始めることができます。これは、
実際はインストールした AngularJS の型によってすでに部分的に行われています。
コンポーネントを Angular のモジュールに登録したりしたなどに、
TypeScript は AngularJS の API が正しく呼ばれているかをチェックします。

しかし、TypeScript の型システムをさらに活用するために、
*型注釈* を使い始めることもできます。たとえば、チェックマークフィルターの
アノテーションをつけることで、引数に真偽値をとることを明示することができます。
これにより、フィルターが何をするのかを明らかにできます。

<code-example path="upgrade-phonecat-1-typescript/app/core/checkmark/checkmark.filter.ts" header="app/core/checkmark/checkmark.filter.ts"></code-example>

`Phone` サービスでは、`$resource` サービスへの依存を AngularJS の型で定義されている、
`angular.resource.IResourceService` として明示的にアノテーションをつけることができます。

<code-example path="upgrade-phonecat-1-typescript/app/core/phone/phone.service.ts" header="app/core/phone/phone.service.ts"></code-example>

location と route サービスを使っている、`app.config.ts` のアプリケーションのルーティングの設定にも
同じことをすることができます。それぞれにアノテーションをつけることで、TypeScript は
それらの API が正しい種類の引数で使われているかを検証することができます。

<code-example path="upgrade-phonecat-1-typescript/app/app.config.ts" header="app/app.config.ts"></code-example>

<div class="alert is-helpful">

インストールした [AngularJS 1.x の型注釈][NpmjsPackageTypesAngular]はAngular の開発チームによって公式にメンテナンスされているものではありません。
しかし、かなりよくカバーされています。これらの定義を使い、AngularJS 1.x のアプリケーションを完全に型注釈することは可能です。

もしこれがあなたのやりたいことであれば、`tsconfig.json` で
`noImplicitAny` 設定を有効にすることはよい考えでしょう。これにより、
TypeScript コンパイラが型注釈がまだ付いていないコードがあった場合に
警告を出すようになります。それを使ってプロジェクトへ安全に型注釈を
つけたかどうかの指標とすることができます。

</div>

TypeScript で使えるさらなる機能に *クラス* があります。
特に、コンポーネントコントローラーをクラスに変えることができます。
それにより、Angular のコンポーネントクラスに近くなり、アップグレードの
人生がより生きやすいものになります。

AngularJS ではコントローラーはコンストラクターを持ちます。
これがまさに、ES2015/TypeScript のクラスが存在する理由です。
コンポーネントコントローラーでクラスを使い、AngularJS で動かすことができます。

電話のリストのコンポーネントコントローラーの新しいクラスはこのようになります。

<code-example path="upgrade-phonecat-1-typescript/app/phone-list/phone-list.component.ts" header="app/phone-list/phone-list.component.ts"></code-example>

コントローラーの関数で行われていたことは、クラスののコンストラクター関数で
行われるようになります。静的プロパティの `$inject` を使って、
クラスへ依存性の注入のアノテーションがつけられます。
これは実行時に `PhoneListController.$inject` プロパティになります。

そのクラスはさらに3つのメンバーを宣言します。電話の配列、現在の並び替えのキー、
検索クエリです。これらはすべてコントローラーへすでに紐づけていましたが、
どこにも明示的に宣言されていませんでした。
最後の１つに関してはテンプレートでだけ参照されており、
TypeScript のコードでは実際には使われていませんでした。
しかし、見通しをよくするために、すべてをコントローラーのメンバーで定義するべきです。

Phone detail コントローラーには、2つのメンバーがあります。ひとつは
ユーザーが探している電話で、もう１つは現在表示されている画像の URL です。

<code-example path="upgrade-phonecat-1-typescript/app/phone-detail/phone-detail.component.ts" header="app/phone-detail/phone-detail.component.ts"></code-example>

これにより、コントローラーのコードはすでにかなり Angular に近いものになっています。
あとは、実際にプロジェクトへ Angular を導入するだけです。

もしプロジェクトに AnglarJS のサービスがある場合、それらはクラスへ
変換する候補として適切でしょう。なぜならコントローラーのように、
コンストラクター関数であるからです。しかし、このプロジェクトには
`Phone` ファクトリしかなく、`ngResource` ファクトリのため少々特別です。
そのため、準備段階ではそれにすることは何もありません。
代わりに、Angular のサービスへ直接変更します。

### Angular のインストール

準備作業が終わったら、PhoneCat の Angular へのアップグレードを開始します。
Angular に同梱されている  [ngUpgrade][AioGuideUpgradeUpgradingWithNgupgrade] を使って、
順次行います。終わる頃には AngularJS をプロジェクトから完全に削除することができますが、鍵となるのはアプリケーションを壊さずに１つずつ行うことです。

<div class="alert is-important">

このプロジェクトにはいくつかアニメーションがあります。
このガイドではそれらをアップグレードしません。
それに関しては [Angular animations][AioGuideAnimations] を参照してください。

</div>

SystemJS モジュールローダーと共に、Angular をプロジェクトにインストールしてください。
[アップグレードのセットアップ手順][AioGuideUpgradeSetup] の手順を行ったあとの結果を参照し、設定をそこから持ってきます。

*   Angular とその他の依存ライブラリを `package.json` に追加してください。
*   SystemJS の設定ファイル `systemjs.config.js` をプロジェクトのルートディレクトリに置きます。

これが終わったら、コマンドを実行してください。

<code-example language="shell">

npm install

</code-example>

`index.html` を通して、アプリケーションへ Angular の依存関係が読み込まれます。
しかし、最初にいくつかディレクトリのパスを調整する必要があります。
この時点でやっているように、`/app` ディレクトリの代わりに、
`node_modules` とプロジェクトのルートからからファイルをロードする必要があります。

`app/index.html` ファイルをプロジェクトのルートディレクトリに移動してください。
それから、`package.json` にある開発サーバーのルートのパスを `app` の代わりに、
プロジェクトのルートに変更します。

<code-example language="json">

"start": "http-server ./ -a localhost -p 8000 -c-1",

</code-example>

すべてをプロジェクトのルートから Web ブラウザへ配信できるようになりました。しかし、開発用の
設定に合わせるためにアプリケーションのコードのすべての画像とデータのパスを変更したくは *ない* でしょう。そのために、
`<base>` タグを `index.html` に追加することで `/app` ディレクトリの後ろで相対 URL を
解決することができます。

<code-example path="upgrade-phonecat-2-hybrid/index.html" region="base" header="index.html"></code-example>

SystemJS を通して、 Angular をロードできるようになりました。Angular のポリフィルと
SystemJS の設定を `<head>` セクションの最後に追加しましょう。それから、`System.import` を
使用して、実際のアプリケーションをロードします。

<code-example path="upgrade-phonecat-2-hybrid/index.html" region="angular" header="index.html"></code-example>

さらに、[アップグレードのセットアップ][AioGuideUpgradeSetup]の過程でインストールした、`systemjs.config.js` ファイルにいくつか修正が必要です。

SystemJS を通してロードする際、`<base>` URL を使う代わりに、
ブラウザからプロジェクトのルートを参照させてください。

`upgrade` パッケージを `npm install @angular/upgrade --save` でインストールし、`@angular/upgrade/static` パッケージへのマッピングを追加します。

<code-example path="upgrade-phonecat-2-hybrid/systemjs.config.1.js" region="paths" header="systemjs.config.js"></code-example>

### *AppModule* を作る

`AppModule` という、ルートの `NgModule` クラスを作ります。AngularJS のモジュールをもつ、
`app.module.ts` という名前のファイルがすでにあります。それを `app.module.ajs.ts` という名前に変更し、
`index.html` 中の対応するスクリプト名を変更します。
ファイルのコンテンツは変わりません。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ajs.ts" header="app.module.ajs.ts"></code-example>

新しい `app.module.ts` を最小構成の `NgModule` クラスと共に作成します。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="bare" header="app.module.ts"></code-example>

### ハイブリッドの PhoneCat をブートストラップする

次に、アプリケーションを AngularJS と Angular のコンポーネントをサポートする、
*ハイブリッドのアプリケーション* としてブートストラップします。そのあと、
個別に Angular へ変換し始めることができます。

そのアプリケーションは今はホストのページの `<html>` エレメントに紐付け垂れた、
AngularJS の　`ng-app` ディレクティブを使って、ブートストラップされています。
これはハイブリッドのアプリケーションでは動作しません。代わりに、
[ngUpgrade bootstrap][AioGuideUpgradeBootstrappingHybridApplications] 方式に切り替えてください。

始めに、`index.html` から `ng-app` アトリビュートを削除します。
そして、`AppModule` に `UpgradeModule` をインポートし、`ngDoBootstrap` メソッドをオーバーライドします。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="upgrademodule" header="app/app.module.ts"></code-example>

`ngDoBootstrap` の内部で AngularJS のモジュールをブートストラップしていることに
注意してください。引数は AngularJS を手動でブートストラップする際に
`angular.bootstrap` へ渡すものと同じです。アプリケーションのルートエレメントと、
ロードしたい AngularJS 1.x のモジュールの配列です。

最後に、`app/main.ts` で `AppModule` をブートストラップします。
このファイルは `systemjs.config.js` でエントリーポイントとして設定されています。
そのため、それはすでにブラウザによって読み込まれています。

<code-example path="upgrade-phonecat-2-hybrid/app/main.ts" region="bootstrap" header="app/main.ts"></code-example>

AngularJS と Angular を両方同時に動かすようになりました。とてもエキサイティングです！
Angular のコンポーネントはまだ動かしていません。それは次で行います。

<div class="callout is-helpful">

#### なぜ *angular* を *angular.IAngularStatic* として宣言するか

`@types/angular` は UMD モジュールとして宣言されています。
[UMD typings][GithubMicrosoftTypescriptWikiWhatsNewInTypescriptSupportForUmdModuleDefinitions] が動作する方法の都合上、一度 ES6 の `import` 文を使った場合、すべての UMD 型のモジュールもグローバルに利用する代わりに `import` 文を使ってインポートする必要があります。

AngularJS は `index.html` で script タグを使ってロードされています。そのため、
アプリケーション全体へグローバルにアクセスでき、`angular` 変数の同じインスタンスを使っています。
もし、`import * as angular from 'angular'` を代わりに使った場合は、AngularJS を
正しくロードするために、AngularJS のアプリケーションのすべてのファイルで
ES2015 のモジュールを使う必要があります。

これはかなり努力が必要で、特に Angular へコードを移行している段階では
あまり見合うものではありません。
代わりに、`angular` を `angular.IAngularStatic` として宣言することで、
グローバル変数ということを示し、すべての型サポートを得ることができます。

<div class="callout is-important">

<header>Manually create a UMD bundle for your Angular application</header>

Starting with Angular version 13, the [distribution format][GithubAngularAngularIssues38366] no longer includes UMD bundles.

If your use case requires the UMD format, use [`rollup`][RollupjsMain] to manually produce a bundle from the flat ES module files.

1.  Use `npm` to globally install `rollup`

    <code-example language="shell">

    npm i -g rollup

    </code-example>

1.  Output the version of `rollup` and verify the installation was successful

    <code-example language="shell">

    rollup -v

    </code-example>

1.  Create the `rollup.config.js` configuration file for `rollup` to use the global `ng` command to reference all of the Angular framework exports.

    1.  Create a file named `rollup.config.js`
    1.  Copy the following content into `rollup.config.js`

        <code-example language="javascript">

        export default {
          input: 'node_modules/@angular/core/fesm2015/core.js',
          output: {
            file: 'bundle.js',
            format: 'umd',
            name: 'ng'
          }
        }

        </code-example>

1.  Use `rollup` to create the `bundle.js` UMD bundle using settings in `rollup.config.js`

    <code-example language="shell">

    rollup -c rollup.config.js

    </code-example>

The `bundle.js` file contains your UMD bundle.
For an example on GitHub, see [UMD Angular bundle][GithubMgechevAngularUmdBundle].

</div>

### Phone サービスをアップグレードする

最初に Angular へ移行する部分は `Phone` サービスです。それは
`app/core/phone/phone.service.ts` にあり、
コンポーネントが電話の情報をサーバーから読み込むために使われます。
今時点では ngResource を使って実装されており、2つの目的で使っています。

* すべての電話のリストをコンポーネントに読み込む。
* ひとつの電話の詳細をコンポーネントに読み込む。

この実装を Angular のサービスクラスを使い、
コントローラーを AngularJS の世界に置いたまま置き換えることができます。

新しいバージョンでは、`ngResource` の代わりに、Angular の HTTP モジュールをインポートし、`HttpClient` サービスを呼び出します。

`app.module.ts` ファイルを開き、`HttpClientModule` をインポートして、`AppModule` の `imports` 配列に追加します。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="httpclientmodule" header="app.module.ts"></code-example>

Phone サービス自身をアップグレードする用意ができました。`phone.service.ts` にある、
ngResource を使ったサービスを `@Injectable` としてデコレートされた TypeScript のクラスに置き換えましょう。

<code-example path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="classdef" header="app/core/phone/phone.service.ts (skeleton)"></code-example>

`@Injectable` デコレーターは Angular がその依存関係を把握できるように、
依存性の注入のメタデータをクラスに付け足します。
[依存性の注入ガイド][AioGuideDependencyInjection]に記載されているように、
これはクラスが他に Angular のデコレーターを持っていないけれど、
それらの依存性が注入される必要がある際に使うマーカーデコレーターです。

そのクラスのコンストラクターには `HttpClient` サービスが渡されます。
それは注入され、プライベートのフィールドとして保存されます。
そのサービスは2つのインスタンスメソッドで使われます。ひとつはすべての電話のリストを
ロードし、もう1つは特定の電話の詳細を読み込みます。

<code-example path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="fullclass" header="app/core/phone/phone.service.ts"></code-example>

そのメソッドは `PhoneData` と `PhoneData[]` の型の Observable を返します。
これはまだ持っていない型です。簡単なインターフェースを追加します。

<code-example path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="phonedata-interface" header="app/core/phone/phone.service.ts (interface)"></code-example>

`@angular/upgrade/static` は Angular のサービスが AngularJS のコードで使えるように、
`downgradeInjectable` メソッドを持っています。`Phone` サービスをつなぐためにそれを使います。

<code-example path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="downgrade-injectable" header="app/core/phone/phone.service.ts (downgrade)"></code-example>

これがそのサービスの全体、最終的なコードです。

<code-example path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" header="app/core/phone/phone.service.ts"></code-example>

RxJS の `Observable` の `map` 演算子を別にインポートしていることに注意してください。
これを RxJS の演算子すべてに対して行います。

新しい `Phone` サービスは元々の `ngResource` を使ったサービスと同じ機能を持っています。
それは Angular のサービスなので、`NgModule` プロバイダーで登録します。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="phone" header="app.module.ts"></code-example>

SystemJS によって解決されたインポートを通して、`phone.service.ts` をロードすることになりました。
`index.html` からはそのサービスのための **&lt;script&gt; タグ を削除** してください。
これはアップグレードする中ですべてのコンポーネントに対してできることです。AngularJS から Angular への
アップグレードと同時に、スクリプトからモジュールへコードを移行していきます。

この時点で、2つのコンポーネントを古いサービスの代わりに新しいサービスを使うように
切り替えることができます。それをダウングレードした `phone` ファクトリとして `$inject` を
行う一方、それは `Phone` クラスのインスタンスであり、それぞれ型注釈がつきます。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ajs.ts" header="app/phone-list/phone-list.component.ts"></code-example>

<code-example path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.component.ajs.ts" header="app/phone-detail/phone-detail.component.ts"></code-example>

2つの AngularJS のコンポーネントで Angular のサービスを使うようになりました!
事実として、そのサービスは Promise の代わりに Observable を返しますが、
そのコンポーネントではそれは認識される必要はないです。
ともかく、ここで達成したことは、サービスを使っているコンポーネントは
移行することなくそのサービスを Angular に移行したことです。

<div class="alert is-helpful">

そのサービスの中の Observable を Promise に変えるために、
`Observable` の `toPromise` メソッドを使うことができます。
多くの場合、それによってコンポーネントコントローラーへの変更が減ります。

</div>

### Components をアップグレードする

次に、AngularJS のコンポーネントを Angular へアップグレードします。
アプリケーションをハイブリッドモードに保ちつつ、一度に１つのコンポーネントを移行します。
この変換を行う中で、はじめての Angular の *パイプ* を定義します。

まず、電話のリストのコンポーネントをみてください。今は TypeScript のコントローラーの
クラスと、コンポーネントの定義のオブジェクトがあります。これをコントローラーのクラスの名前を
変更し、AngularJS のコンポーネントの定義のオブジェクトを Angular の `@Component` デコレーターへ
変更することで、 Angular のコンポーネントに変えることができます。
そして、そのクラスから静的な `$inject` プロパティを削除できます。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ts" region="initialclass" header="app/phone-list/phone-list.component.ts">
</code-example>

`selecter` 属性はコンポーネントがページのどこに配置されるかを定義する、CSS のセレクターです。
AngularJS では、コンポーネントの名前をもとにマッチさせていましたが、Angular ではセレクターで明示的に指定します。
これは AngularJS のバージョンでやっていたように、
`phone-list` という名前のエレメントとマッチします。

このコンポーネントのテンプレートを Angular の記法に変換しましょう。
検索のコントロールは AngularJS の `$ctrl` 式を Angular の
双方向の `[(ngModel)]` バインディング記法に置き換えます。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.template.html" region="controls" header="app/phone-list/phone-list.template.html (search controls)"></code-example>

[テンプレート記法のページに記載されているように][AioGuideBuiltInDirectives]、リストの `ng-repeat` を `*ngFor` に置き換えます。
イメージタグの `ng-src` をネイティブの `src` プロパティに置き換えます。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.template.html" region="list" header="app/phone-list/phone-list.template.html (phones)"></code-example>

#### Angular には *filter* や *orderBy* フィルターはない

AngularJS の組み込みの  `filter` と `orderBy` フィルターは Angular にはありません。
そのため、フィルタリングとソートは自分で行う必要があります。

コンポーネント内部でフィルタリングとソートのロジックを実装するように、
`filter` と `orderBy` フィルターはコントローラーの `getPhones()` メソッドへのバインディングで置き換えました。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ts" region="getphones" header="app/phone-list/phone-list.component.ts"></code-example>

Angular のコンポーネントを AngularJS で使うために、ダウングレードする必要があります。
コンポーネントを登録する代わりに、ダウングレードしたバージョンの Angular コンポーネントを
`phoneList` *ディレクティブ* として登録します。

`as angular.IDirectiveFactory` によるキャストで TypeScript コンパイラは
`downgradeComponent` メソッドの返り値がディレクティブファクトリであることを認識します。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ts" region="downgrade-component" header="app/phone-list/phone-list.component.ts"></code-example>

新しい `PhoneListComponent` は `FormsModule` にある Angular の `ngModel` ディレクティブを使います。
`FormsModule` を `NgModule` のインポートに追加し、新しい `PhoneListComponent` を宣言してください。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="phonelist" header="app.module.ts"></code-example>

`index.html` から電話リストのコンポーネントの &lt;script&gt; タグを削除してください。

次のように `phone-detail.component.ts` を設定してください。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.component.ts" header="app/phone-detail/phone-detail.component.ts">
</code-example>

これは電話リストのコンポーネントに似ています。
新しい点は `RouteParams` の型アノテーションが `routeParams` の依存を特定することです。

AngularJS のインジェクターは `PhoneDetails` が AngularJS のコントローラーに
あった時に注入されていた、`$routeParams` という AngularJS のルーターの依存を持っています。
それを新しい `PhoneDetailsComponent` に注入しようとしています。

残念なことに、AngularJS の 依存は自動的に Angular のコンポーネントで利用することはできません。
`$routeParams` を Angular で注入できるようにするために、このサービスを [ファクトリプロバイダー][AioGuideUpgradeMakingAngularjsDependenciesInjectableToAngular] を通して、アップグレードしなければなりません。
`ajs-upgraded-providers.ts` という新しいファイルでこれを行い、`app.module.ts` でインポートしましょう。

<code-example path="upgrade-phonecat-2-hybrid/app/ajs-upgraded-providers.ts" header="app/ajs-upgraded-providers.ts"></code-example>

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="routeparams" header="app/app.module.ts ($routeParams)"></code-example>

電話詳細のコンポーネントのテンプレートを、次のように Angular の記法へ変換してください。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.template.html" header="app/phone-detail/phone-detail.template.html">
</code-example>

いくつかの特筆すべき変更があります。

* `$ctrl.` 接頭辞をすべての式から削除しました。

* `ng-src` を標準の `src` プロパティへの
  プロパティバインディングで置き換えました。

* `ng-class` 周りでプロパティバインディング記法を使っています。
  Angular は AngularJS が持っているのと
  [そっくりの `ngClass`][AioGuideBuiltInDirectives] を持っていますが、その値は式として魔法のように評価されません。
  Angular ではアトリビュートの値がプロパティの式のとき、
  文字列のリテラルとは対照的に、必ずテンプレートで指定します。

* `ng-repeat` を `*ngFor` で置き換えました。

* イベントのバインディングと共に、`ng-click` を `click` で置き換えました。

* 電話が表示されている時だけレンダリングされるように、
  `ngIf` の中にすべてのテンプレートをラップしました。
  これはコンポーネントが最初にロードされた時、 まだ `phone` が無く、
  式が存在しない値を参照してしまうからです。AngularJS とは違い、
  Angular の式は未定義のオブジェクトのプロパティを参照しようとした時に黙って失敗しません。
  これが起こるケースを想定しなければなりません。

`PhoneDetailComponent` コンポーネントを `NgModule` の *declarations* に追加します。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="phonedetail" header="app.module.ts">
</code-example>

`index.html` から電話詳細のコンポーネントの &lt;script&gt; タグを削除しましょう。

#### _CheckmarkPipe_ を追加する

その AngularJS のディレクティブには `checkmark` _フィルター_ があります。
それを Angular の **パイプ** に変えましょう。

フィルターをパイプに変換するためのアップグレードのメソッドはありません。
必要ないのです。
フィルターの関数を同等の Pipe クラスへ簡単に変えられます。
実装は以前と同じのまま、`transform` メソッドで再パッケージされます。
Angular の規約に従い、ファイルを `checkmark.pipe.ts` にリネームします。 

<code-example path="upgrade-phonecat-2-hybrid/app/core/checkmark/checkmark.pipe.ts" header="app/core/checkmark/checkmark.pipe.ts"></code-example>

新しく作られたパイプをインポートし、宣言し、
`index.html` からフィルターの &lt;script&gt; タグを削除しましょう。

<code-example path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="checkmarkpipe" header="app.module.ts">
</code-example>

### ハイブリッドアプリケーションを事前コンパイルする

ハイブリッドのアプリケーションで AOT を使うために、他の Angular のアプリケーションと同様、
[事前コンパイラの章 ][AioGuideAotCompiler] にあるようなセットアップが必要です。

それから、AOT コンパイラで生成された `AppComponentFactory` をブートストラップするように、
`main-aot.ts` を変更します。

<code-example path="upgrade-phonecat-2-hybrid/app/main-aot.ts" header="app/main-aot.ts"></code-example>

同様に、`aot/index.html` の `index.html` ですでに使っているすべての AngularJS のファイルを、
ロードする必要があります。

<code-example path="upgrade-phonecat-2-hybrid/aot/index.html" header="aot/index.html"></code-example>

これらのファイルはポリフィルと共にコピーされる必要があります。電話のリストの `.json` ファイルや、
画像ファイルのようにアプリケーションが実行時に必要とするファイルもコピーされる必要があります。

ファイルのコピーをしやすくするために、`npm install fs-extra --save-dev` を使用し、
`fs-extra` をインストールします。そして、次のように `copy-dist-files.js` を変更します。

<code-example path="upgrade-phonecat-2-hybrid/copy-dist-files.js" header="copy-dist-files.js">
</code-example>

アプリケーションのアップグレード中に AOT を使うためにすることは以上です！

### Angular のルーターとブートストラップを追加

この時点で、AngularJS のルーターを通しているものの、
AngularJS のアプリケーションのコンポーネントを Angular の対応するものにすべて置き換えてあります。

#### Angular のルーターを追加

Angular には [まったく新しいルーター][AioGuideRouter] があります。

すべてのルーターと同じように、ルーティングされたビューを表示するために UI に場所が必要です。
Angular ではアプリケーションのコンポーネントツリーの先頭にある、
*ルートコンポーネント* の中の、`<router-outlet>` がそれにあたります。

まだそのようなルートコンポーネントは持っていません。なぜなら、アプリケーションはまだ AngularJS のアプリケーションとして管理されているからです。
次のような `AppComponent` クラスを持った `app.component.ts` ファイルを新しく作成します。

<code-example path="upgrade-phonecat-3-final/app/app.component.ts" header="app/app.component.ts"></code-example>

`<router-outlet>` のみ含んだ、簡素なテンプレートを持っています。
このコンポーネントはアクティブなルートのコンテンツのみレンダリングし、他には何もしません。

そのセレクターはアプリケーションが起動した時にホストの Web ページにある `<phonecat-app>` エレメントに、
このルートコンポーネントを繋ぐよう Angular に指示します。

`index.html` にこの `<phonecat-app>` を追加してください。
古い AngularJS の `ng-view` ディレクティブを置き換えます。

<code-example path="upgrade-phonecat-3-final/index.html" region="appcomponent" header="index.html (body)"></code-example>

#### *Routing Module* を作る
ルーターは AngularJS や Angular、他のどのルーターであっても設定が必要です。

Angular のルーターの設定の詳細に関しては [ルーティングのドキュメント][AioGuideRouter] が一番です。
（_Routing Module_ という）ルーターの設定に関する `NgModule` を、
作ることが推奨されています。

<code-example path="upgrade-phonecat-3-final/app/app-routing.module.ts" header="app/app-routing.module.ts"></code-example>

このモジュールは2つの電話コンポーネントへの2つのルートと、
空のパスのためのデフォルトのパスを持った `routes` オブジェクトを定義します。
`routes` に残りのことを行うための `RouterModule.forRoot` メソッドを渡します。

2つのの追加のプロバイダーを使うことでデフォルトの "push state" 方式の代わりに、
 `#!/phones` のような "ハッシュ" URL によるルーティングが可能となります。

`AppModule` をアップデートしてこの `AppRoutingModule` をインポートし、
ルートの `AppComponent` をブートストラップのコンポーネントとして宣言しましょう。
それにより、Angular はアプリケーションを _ルートの_ `AppComponent` と共にブートストラップし、
ホストの Web ページにそのビューを挿入します。

また、`app.module.ts` にある `ngDoBootstrap()` から AngularJS のモジュールのブートストラップと
`UpgradeModule`　のインポートを削除しなければなりません。

<code-example path="upgrade-phonecat-3-final/app/app.module.ts" header="app/app.module.ts">
</code-example>

`<phone-list>` または `<phone-detail>` タグと共にルーティングのテンプレートを使う代わりに、
`PhoneListComponent` と `PhoneDetailComponent` に直接ルーティングしているため、
Angular のセレクターも使うことができます。

#### 個々の電話のリンクを生成する

電話のリストにある電話詳細へのリンクをハードコードする必要はもうありません。
`routerLink` ディレクティブへの個々の電話の `id` のデータバインディングを生成し、
ディレクティブで `PhoneDetailComponent` への適切な URL を組み立てることができます。

<code-example path="upgrade-phonecat-3-final/app/phone-list/phone-list.template.html" region="list" header="app/phone-list/phone-list.template.html (list with links)"></code-example>

<div class="alert is-helpful">

詳細は [ルーティング][AioGuideRouter] のページを参照してください。

</div>

#### ルートパラメータを使う

Angular のルーターはルートパラメータを異なる方法で渡します。
`PhoneDetail` コンポーネントのコンストラクターを注入された `ActivatedRoute` オブジェクトを受け取るように修正してください。
`ActivatedRoute.snapshot.params` から `phoneId` を抽出し、以前と同じように電話のデータを取得してください。

<code-example path="upgrade-phonecat-3-final/app/phone-detail/phone-detail.component.ts" header="app/phone-detail/phone-detail.component.ts"></code-example>

もう純粋な Angular アプリケーションを動かしています！

### AngularJS に別れを告げる

補助輪を外し、アプリケーションが純粋な、輝かしい Angular アプリケーションとして新しい命を始める時間です。
残っているタスクはコードの削除 - すべてのプログラマーにとって、
もちろんお気に入りの作業です - をするだけです！

アプリケーションはまだハイブリッドのアプリケーションとしてブートストラップされています。
もはやその必要はありません。

アプリケーションのブートストラップ方法を`UpgradeModule` ブートストラップから Angular のやり方に変えます。

<code-example path="upgrade-phonecat-3-final/app/main.ts" header="main.ts"></code-example>

もしまだしていなければ、AngularJS のサービスへのすべての[ファクトリプロバイダー][AioGuideUpgradeMakingAngularjsDependenciesInjectableToAngular] や、
`app/ajs-upgraded-providers.ts` と同じように、
`UpgradeModule` へのすべての参照を  `app.module.ts` から削除してください。

すべての `downgradeInjectable()` や `downgradeComponent()` も
関連する AngularJS のファクトリやディレクティブ宣言と一緒に削除してください。

<code-example path="upgrade-phonecat-3-final/app/app.module.ts" header="app.module.ts">
</code-example>

次のファイルも完全に削除できます。それらは AngularJS のモジュールの設定ファイルなので、
Angular では必要ありません。

* `app/app.module.ajs.ts`
* `app/app.config.ts`
* `app/core/core.module.ts`
* `app/core/phone/phone.module.ts`
* `app/phone-detail/phone-detail.module.ts`
* `app/phone-list/phone-list.module.ts`

AngularJS のための追加の型定義も同様にアンインストールできます.
唯一必要なのは Jasmine と Angular のポリフィルです。
`@angular/upgrade` パッケージと `systemjs.config.js` のマッピングもアンインストールできます。

<code-example language="shell">

npm uninstall @angular/upgrade --save
npm uninstall @types/angular @types/angular-animate @types/angular-cookies @types/angular-mocks @types/angular-resource @types/angular-route @types/angular-sanitize --save-dev

</code-example>

最後に、`index.html` から AngularJS のスクリプトと jQuery へのすべての参照を削除してください。
それが終わった時、このようになっているでしょう。

<code-example path="upgrade-phonecat-3-final/index.html" region="full" header="index.html"></code-example>

これが AngularJS を見る最後です!それは私たちをよく支えてくれましたが、
もうお別れをいう時です。

## 付録: PhoneCat のテストをアップグレードする

テストだけはアップグレードの過程でそのままにしておくことはできません。しかし、
それらはアプリケーションがアップグレードの間で壊れていないことを確認する際に、
価値のある安全対策として使うことができます。E2E テストは特にこの目的で役立ちます。

### E2E テスト

PhoneCat プロジェクトには Protractor による E2E テストと、Karma のユニットテストの両方があります。これら2つのうち、
E2E テストはかなり簡単に扱うことができます。定義によると、
E2E テストはアプリケーションがスクリーンに表示するさまざまな UI の要素に作用することで、
アプリケーションへ *外部* からアクセスします。
E2E テストはアプリケーションのコンポーネントの内部構造を考慮しません。
それは、アップグレードの途中でプロジェクトを少しだけ修正したとしても、
E2E テストは通るべきということを意味します。
ユーザーから見たアプリケーションの振る舞いは変えていないとうことです。

TypeScript への変換の間、E2E テストを動作させ続けるためにすることはありません。
しかし、ハイブリッドのアプリケーションのブートストラップを変える時、
多少の変更をしなければなりません。

`protractor-conf.js` を更新して、ハイブリッドのアプリケーションと同期します。

<code-example language="javascript">

ng12Hybrid: true

</code-example>

コンポーネントとテンプレートを Angular へアップグレードし始めた時、より多くの変更が必要となるでしょう。
なぜなら、E2E テストは AngularJS に特有のマッチャーを持っているからです。
PhoneCat に対しては、Angular で動作させるために次のような変更が必要です。

| Previous code                                               | New code                  | Notes                                                |
|:---                                                         |:---                       |:---                                                  |
| `by.repeater('phone in $ctrl.phones').column('phone.name')` | `by.css('.phones .name')` | The repeater matcher relies on AngularJS `ng-repeat` |
| `by.repeater('phone in $ctrl.phones')`                      | `by.css('.phones li')`    | The repeater matcher relies on AngularJS `ng-repeat` |
| `by.model('$ctrl.query')`                                   | `by.css('input')`         | The model matcher relies on AngularJS `ng-model`     |
| `by.model('$ctrl.orderProp')`                               | `by.css('select')`        | The model matcher relies on AngularJS `ng-model`     |
| `by.binding('$ctrl.phone.name')`                            | `by.css('h1')`            | The binding matcher relies on AngularJS data binding |

ブートストラップのメソッドが `UpgradeModule` のものから純粋な Angular に切り替わった時、
AngularJS はページから完全に存在しなくなります。
この時点で、Protractor が AngularJS のアプリケーションを、
これ以上参照しないようにする必要があります。
代わりに、*Angular apps* を参照させる必要があります。

`protractor-conf.js` で以前追加した `ng12Hybrid` を次のように置き換えてください。

<code-example language="javascript">

useAllAngular2AppRoots: true,

</code-example>

AngularJS の `$location` サービスを使っている PhoneCat のテストコードには、
いくつか Protractor の API を呼び出している箇所があります。
アップグレードの後はサービスはなくなるため、それらの呼び出し箇所を、
WebDriver のジェネリック URL の API で置き換えてください。ひとつ目は、
リダイレクトのテストです。

<code-example path="upgrade-phonecat-3-final/e2e-spec.ts" region="redirect" header="e2e-tests/scenarios.ts"></code-example>

ふたつ目は、電話のリンクのテストです。

<code-example path="upgrade-phonecat-3-final/e2e-spec.ts" region="links" header="e2e-tests/scenarios.ts"></code-example>

### Unit Tests

一方、ユニットテストにはさらなる変換作業が必要です。
本番用のコードと共に、効果的に *アップグレード* される必要があります。

TypeScript への変換において、厳密には何も変更する必要はありません。
しかし、ユニットテストのコードも同様に TypeScript に変換するとよいでしょう。

たとえば、電話詳細のコンポーネントのスペックでは、
アロー関数やブロックスコープの変数のような ES2015 の機能を使ったり、
AngularJS のサービスの型定義の恩恵を得ることができます。

<code-example path="upgrade-phonecat-1-typescript/app/phone-detail/phone-detail.component.spec.ts" header="app/phone-detail/phone-detail.component.spec.ts"></code-example>

一度アップグレード作業を始め、SystemJS を導入したならば、
Karma の設定を変更する必要があります。次のようなシムファイルを使うことで、
SystemJS ですべての新しい Angular のコードを読み込む必要があります。

<code-example path="upgrade-phonecat-2-hybrid/karma-test-shim.1.js" header="karma-test-shim.js"></code-example>

このシムファイルは始めに SystemJS の設定を読み込み、次に Angular のテストサポートライブラリを読み込みます。
そして、自身のアプリケーションのスペックファイルを読み込みます。

それから、Karma の設定を `app` の代わりに、アプリケーションのルートディレクトリを
ベースディレクトリとして使うように変更します。

<code-example path="upgrade-phonecat-2-hybrid/karma.conf.ajs.js" region="basepath" header="karma.conf.js"></code-example>

やり終えたならば。SystemJS や他の依存を読み込むことができるようになります。そして、
アプリケーションファイルの読み込み設定を切り替えることで、Karma がそれらを含め *ない* ようにします。
シムファイルと SystemJS がそれらを読み込むようにします。

<code-example path="upgrade-phonecat-2-hybrid/karma.conf.ajs.js" region="files" header="karma.conf.js"></code-example>

Angular のコンポーネントの HTML テンプレートも同様に読み込まれるため、
Karma が正しいパスへそれらをルーティングできるように手助けをします。

<code-example path="upgrade-phonecat-2-hybrid/karma.conf.ajs.js" region="html" header="karma.conf.js"></code-example>

本番の対応する箇所が Angular に切り替わったら、
ユニットテストのファイル自身も Angular に切り替える必要があります。
何も依存がないため、チェックマークのパイプのスペックがおそらくもっともわかりやすいでしょう。

<code-example path="upgrade-phonecat-2-hybrid/app/core/checkmark/checkmark.pipe.spec.ts" header="app/core/checkmark/checkmark.pipe.spec.ts"></code-example>

電話サービスのユニットテストが少し関係します。モックされた AngularJS の `$httpBackend` を、
Angular の Http バックエンドのモックに切り替える必要があります。

<code-example path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.spec.ts" header="app/core/phone/phone.service.spec.ts"></code-example>

コンポーネントのスペックでは、`Phone` サービス自身をモックし、電話のデータを用意することができます。
Angular のコンポーネントのユニットテスト API を両方のコンポーネントに使います。

<code-example path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.component.spec.ts" header="app/phone-detail/phone-detail.component.spec.ts"></code-example>

<code-example path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.spec.ts" header="app/phone-list/phone-list.component.spec.ts"></code-example>

最後に Angular のルーターに切り替える時に、両方のコンポーネントのテストをもう一度みてみましょう。
電話詳細のコンポーネントには AngularJS の `$routeParams` の代わりに、
モックされた Angular の `ActivatedRoute` オブジェクトを使います。

<code-example path="upgrade-phonecat-3-final/app/phone-detail/phone-detail.component.spec.ts" region="activatedroute" header="app/phone-detail/phone-detail.component.spec.ts"></code-example>

電話リストのコンポーネントには、`RouteLink` ディレクティブが動作するために、
ルーターへ多少の調整を行います。

<code-example path="upgrade-phonecat-3-final/app/phone-list/phone-list.component.spec.ts" region="routestuff" header="app/phone-list/phone-list.component.spec.ts"></code-example>

<!-- links -->

[AioApiCoreNgzone]: api/core/NgZone "NgZone | Core - API | Angular"
[AioApiCoreOnchanges]: api/core/OnChanges "OnChanges | Core - API | Angular"

[AioGuideAnimations]: guide/animations "Introduction to Angular animations | Angular"
[AioGuideAotCompiler]: guide/aot-compiler "Ahead-of-time (AOT) compilation | Angular"
[AioGuideBuiltInDirectives]: guide/built-in-directives "Built-in directives | Angular"
[AioGuideDependencyInjection]: guide/dependency-injection "Dependency injection in Angular | Angular"
[AioGuideDependencyInjectionProvidersFactoryProviders]: guide/dependency-injection-providers#factory-providers "Using factory providers - Dependency providers | Angular"
[AioGuideGlossaryLazyLoading]: guide/glossary#lazy-loading "lazy loading - Glossary | Angular"
[AioGuideHierarchicalDependencyInjection]: guide/hierarchical-dependency-injection "Hierarchical injectors | Angular"
[AioGuideLifecycleHooks]: guide/lifecycle-hooks "Lifecycle hooks | Angular"
[AioGuideNgmodules]: guide/ngmodules "NgModules | Angular"
[AioGuideRouter]: guide/router "Common Routing Tasks | Angular"
[AioGuideTypescriptConfiguration]: guide/typescript-configuration "TypeScript configuration | Angular"
[AioGuideUpgradeBootstrappingHybridApplications]: guide/upgrade#bootstrapping-hybrid-applications "Bootstrapping hybrid applications - Upgrading from AngularJS to Angular | Angular"
[AioGuideUpgradeFollowTheAngularjsStyleGuide]: guide/upgrade#follow-the-angularjs-style-guide "Follow the AngularJS Style Guide - Upgrading from AngularJS to Angular | Angular"
[AioGuideUpgradeMakingAngularjsDependenciesInjectableToAngular]: guide/upgrade#making-angularjs-dependencies-injectable-to-angular "Making AngularJS Dependencies Injectable to Angular - Upgrading from AngularJS to Angular | Angular"
[AioGuideUpgradePreparation]: guide/upgrade#preparation "Preparation - Upgrading from AngularJS to Angular | Angular"
[AioGuideUpgradeUpgradingWithNgupgrade]: guide/upgrade#upgrading-with-ngupgrade "Upgrading with ngUpgrade - Upgrading from AngularJS to Angular | Angular"
[AioGuideUpgradeUsingComponentDirectives]: guide/upgrade#using-component-directives "Using Component Directives - Upgrading from AngularJS to Angular | Angular"
[AioGuideUpgradeSetup]: guide/upgrade-setup "Setup for upgrading from AngularJS | Angular"

<!-- external links -->

[AngularBlogFindingAPathForwardWithAngularjs7e186fdd4429]: https://blog.angular.io/finding-a-path-forward-with-angularjs-7e186fdd4429 "Finding a Path Forward with AngularJS | Angular Blog"

[AngularjsDocsApiNgFunctionAngularBootstrap]: https://docs.angularjs.org/api/ng/function/angular.bootstrap "angular.bootstrap | API | AngularJS"
[AngularjsDocsApiNgTypeAngularModule]: https://docs.angularjs.org/api/ng/type/angular.Module "angular.Module | API | AngularJS"
[AngularjsDocsApiNgTypeAngularModuleComponent]: https://docs.angularjs.org/api/ng/type/angular.Module#component "component(name, options); - angular.Module | API | AngularJS"
[AngularjsDocsApiNgrouteDirectiveNgview]: https://docs.angularjs.org/api/ngRoute/directive/ngView "ngView | API | AngularJS"
[AngularjsDocsApiNgrouteProviderRouteprovider]: https://docs.angularjs.org/api/ngRoute/provider/$routeProvider "$routeProvider | API | AngularJS"
[AngularjsDocsApiNgServiceLocation]: https://docs.angularjs.org/api/ng/service/$location "$location | API | AngularJS"
[AngularjsDocsTutorial]: https://docs.angularjs.org/tutorial "PhoneCat Tutorial App | Tutorial | AngularJS"

[BrowserifyMain]: http://browserify.org "Browserify"

[GithubAngularAngularIssues35989]: https://github.com/angular/angular/issues/35989 "Issue 35989: docs(upgrade): correctly document how to use AOT compilation for hybrid apps | angular/angular | GitHub"
[GithubAngularAngularIssues38366]: https://github.com/angular/angular/issues/38366 " Issue 38366: RFC: Ivy Library Distribution| angular/angular | GitHub"

[GithubAngularAngularPhonecat]: https://github.com/angular/angular-phonecat "angular/angular-phonecat | GitHub"
[GithubAngularAngularPhonecatCommits15Snapshot]: https://github.com/angular/angular-phonecat/commits/1.5-snapshot "angular/angular-phonecat v1.5 | GitHub"

[GithubAngularQuickstart]: https://github.com/angular/quickstart "angular/quickstart | GitHub"

[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMd]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md "Angular 1 Style Guide | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdFoldersByFeatureStructure]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#folders-by-feature-structure "Folders-by-Feature Structure - Angular 1 Style Guide | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdModularity]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#modularity "Modularity - Angular 1 Style Guide | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdOrganizingTests]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#organizing-tests "Organizing Tests - Angular 1 Style Guide | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdSingleResponsibility]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#single-responsibility "Single Responsibility - Angular 1 Style Guide | johnpapa/angular-styleguide | GitHub"

[GithubMgechevAngularUmdBundle]: https://github.com/mgechev/angular-umd-bundle "UMD Angular bundle | mgechev/angular-umd-bundle | GitHub"

[GithubMicrosoftTypescriptWikiWhatsNewInTypescriptSupportForUmdModuleDefinitions]: https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#support-for-umd-module-definitions "Support for UMD module definitions - What's new in TypeScript | microsoft/TypeScript | GitHub"

[GithubSystemjsSystemjs]: https://github.com/systemjs/systemjs "systemjs/systemjs | GitHub"

[GithubWebpackMain]: https://webpack.github.io "webpack module bundler | GitHub"

[NpmjsPackageTypesAngular]: https://www.npmjs.com/package/@types/angular "@types/angular | npm"

[RollupjsMain]: https://rollupjs.org "rollup.js"

<!-- end links -->

@reviewed 2021-11-02
