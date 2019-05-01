# ルーティングと画面遷移

ユーザーがタスクを実行すると、Angularの **`Router`** は [view](guide/glossary#view) を次のviewへと遷移させることができます.

このガイドはルーターの重要な機能をカバーしており、
<live-example>ブラウザで実行可能な</live-example> 小さなアプリケーションを進化させながら、それを説明していきます。

<!-- style for all tables on this page -->
<style>
  td, th {vertical-align: top}
</style>


## 概要

アプリケーションの画面遷移はブラウザと似たような構造をしています。

* アドレスバーにURLを入力すると、ブラウザはそれに対応するページへと遷移させます。
* ページのリンクをクリックすると、新しいページに遷移します。
* ブラウザの進む/戻るボタンをクリックすると、ユーザーの閲覧履歴を使って進んだり戻ったりします。

Angular `Router` (いわゆるルーター) は、これらの構造を取り入れています。
ブラウザのURLを検知して、クライアント側で生成されたページへと遷移させることができます。
任意のパラメータをviewに伝えることで、それに応じた特別なコンテンツを表示させることができます。
ページのリンクにルーターをバインドさせて、クリック時に適切なviewへ遷移させることもできます。
ボタンのクリックやセレクトボックスの選択、その他あらゆる要素から発生するさまざまなイベントに応じて、画面遷移を強行することもできます。
そしてルーターの行動はブラウザ閲覧履歴に残され、進む/戻るボタンが正常に動作するようになります。


{@a basics}


## 基礎

このガイドは、マイルストーンが置かれた段階ごとに進みます。
まずは単純な2ページから始めて、さらに子孫ルートを使ったモジュール式のマルチビューデザインに向けて構築します。

ルーターのいくつかの根本的なコンセプトは、この先の詳細を理解する上で助けになるでしょう。


{@a basics-base-href}


### *&lt;base href>*

ほとんどのルーティング可能なアプリケーションは、`index.html`の`<head>`の最初の子要素として`<base>`要素を追加すべきです。
ルーターに対し、遷移先URLをどのように構成するかを教えるためです。

サンプルアプリケーションと同様に、`app`フォルダがアプリケーションルートなのであれば、
ここに示す`href`の値を *確実に* セットしてください。


<code-example path="router/src/index.html" linenums="false" header="src/index.html (base-href)" region="base-href">

</code-example>



{@a basics-router-imports}


### ルーターのimport

Angular Routerは、与えられたURLに対して特定のコンポーネントを提供するための付属サービスであり、
Angularのコア機能ではありません。ルーターは`@angular/router`という独自ライブラリに入っています。
他のAngularパッケージ同様、使用の際にはライブラリのインポートが必要です。


<code-example path="router/src/app/app.module.1.ts" linenums="false" header="src/app/app.module.ts (import)" region="import-router">

</code-example>



<div class="alert is-helpful">



さらに多くのオプションを知りたいときは [次の章](#browser-url-styles) を参照してください。


</div>



{@a basics-config}



### 設定

ルーターを使ったAngularアプリケーションは *`Router`* サービスをシングルトンインスタンスとして保持します。
ブラウザのURLが変わるとルーターは該当する `Route` を探し出し、表示するコンポーネントを特定することができます。

ルーターはルートの設定がないと動きません。
次の例では5つのルートを定義し、 `RouterModule.forRoot` メソッドでルーターを構成し、それを `AppModule` の `imports` 配列へ追加しています。


<code-example path="router/src/app/app.module.0.ts" linenums="false" header="src/app/app.module.ts (excerpt)">

</code-example>



{@a example-config}

*ルート* の配列である `appRoutes` で遷移方法を表現し、
それを `RouterModule.forRoot` メソッドに渡してモジュールの `imports` に含めることでルーターを構成しています。

個々の `Route` は `path` をコンポーネントにマッピングします。
_path_ に _先頭のスラッシュ_ は入力しません。
ルーターはパースされた完全なURLを提供します。
アプリケーションのview間で遷移する場合は相対パスも絶対パスも利用可能です。

2つ目のルートに現れる `:id` は、ルートパラメーターとして使われます。
`/hero/42` のようなURLの場合、 `id` パラメータが"42"になります。
それにより、対応する `HeroDetailComponent` は`id` が42のヒーローを探して提供することができます。
さらにルートパラメーターについて知りたい場合、このガイドの後半をお読みください。

3つ目のルートに現れる `data` プロパティは、任意のデータを保持し、それを特定のルートに紐付けるために使われます。
dataプロパティは起動されたルート内でアクセス可能であり、
タイトルやパンくずリスト、その他リードオンリーな _静的_ データを利用するためのものです。
_動的_ データをルートで受け取りたい場合、ガイドの後半で説明する [解決ガード](#resolve-guard)  を使ってください。

4つ目のルートに現れる **空のパス** はアプリケーションのデフォルトパスを表現しています。
URL内のパスが空の場合に通るルートであり、通常はここがアプリケーションの起点となります。
このデフォルトルートは `/heroes` というURLに該当するルートへリダイレクトしており、結果的に、このルートでは `HeroesListComponent` が表示されます。

最後のルートに現れる `**` というパスは **ワイルドカード** です。
ルーターがこのルートに繋ぐのは、ルート構成で定義されたパスに該当しないURLがリクエストされたときです。
これは "404 - Not Found" ページを表示したり、別のルートにリダイレクトさせるときに役立ちます。

ここでの **ルートの定義順** は意図的なものです。ルーターは **先勝ち** でルート選択を行うため、
より優先度の高いルートは、優先度の低いルートより上に配置する必要があります。
前に示したルート構成では、静的なパスをもつルートを先に配置し、次にデフォルトルートに繋ぐための空のパスをもつルートを配置しています。
ワイルドカードのルートは _すべてのURL_ にマッチするため、最後に配置します。
もしこれより上に他のルート定義がなければ、_必ず_ このルートを通るようになってしまいます。

画面遷移のライフサイクルの間でどのようにイベントが発火しているかを確認したい場合は、
ルーターのデフォルト定義の1つである **enableTracing** オプションが有効です。
これによって画面遷移ライフサイクルの間で起こるルーターの各イベントをブラウザコンソールに出力することができます。
これは _デバッグ_ の目的でのみ使用してください。
`enableTracing: true` オプションは `RouterModule.forRoot()` メソッドの第二引数にオブジェクトとして設定します。

{@a basics-router-outlet}


### ルーターアウトレット

`RouterOutlet` はルーターライブラリに含まれている、コンポーネントのように使えるディレクティブです。
これはテンプレートの中で、ルーターがそのアウトレットのための
コンポーネントを配置する場所を示すためのプレースホルダーとして機能します。


<code-example language="html">
  &lt;router-outlet>&lt;/router-outlet>
  &lt;!-- Routed components go here -->

</code-example>

前述した構成では、このアプリケーションに対してブラウザのURLが `/heroes` になったとき、
`/heroes` パスを持ったルートにマッチングして `HeroListComponent` を表示します。
`HeroListComponent` は元のコンポーネントのテンプレートに配置した `RouterOutlet` の兄弟要素となります。

{@a basics-router-links}
{@a router-link}


### ルーターリンク

これでルート設定とその設置が終わったわけですが、画面遷移はどうでしょうか？
URLがブラウザのアドレスバーから直接渡されることもあるでしょう。
しかしほとんどの場合、アンカータグをクリックするようなユーザーアクションを伴って画面遷移します。

次のテンプレートについて考えてみましょう。


<code-example path="router/src/app/app.component.1.html" linenums="false" header="src/app/app.component.html">

</code-example>

アンカータグに記述した `RouterLink` ディレクティブは、これらの要素からルーター操作を可能にします。
遷移先のパスは固定であれば、`routerLink` に文字列を割り当てることができます。 (ワンタイムバインディングとなります)

遷移先のパスがもっと動的なものだったら、ルーターリンクパラメーターの配列 (_リンクパラメーター配列_) を返すような
テンプレート式をバインドすることができます。ルーターはその配列を解決して完全なURLにします。


{@a router-link-active}


### ルーターリンクのアクティブ化

`RouterLinkActive` ディレクティブはCSSクラスを切り替え、現在の `RouterState` に基づいて `RouterLink` を紐付けます。

`RouterLinkActive` は `routerLinkActive="..."` のように表しますが、アンカータグにおける使い方の詳細は
[プロパティーバインディング](guide/template-syntax#property-binding)を参照してください。

イコール (=) の右側にはスペース区切りのCSSクラスが含まれており、それによってルーターはいつこのリンクをアクティブにするか
(そしていつリンクを非アクティブにするか) を決定します。
`RouterLinkActive` ディレクティブは `[routerLinkActive]="'active fluffy'"` のようなクラスに設定することもできるし、
そういった文字列を返すようなコンポーネントプロパティに紐付けることもできます。

アクティブなルーターリンクは、ルートツリーの各階層を伝い落ちます。そのため親子のルーターリンクは
同時にアクティブになります。この振る舞いを無効にしたい場合は、 `[routerLinkActiveOptions]` 入力に対して
`{ exact: true }` という式を指定してください。`{ exact: true }` を使うことで、
指定のURLと現在のURLが完全にマッチしたときだけ `RouterLink` をアクティブにすることができます。


{@a basics-router-state}


### ルーターの状態

画面遷移のライフサイクルが完成すると、ルーターは現在の状態を作り上げている `ActivatedRoute` オブジェクトのツリーを組み立てます。
`Router` サービスと `routerState` プロパティを使っていれば、
アプリケーションのどこからでも現在の `RouterState` にアクセス可能です。

`RouterState` に含まれる個々の `ActivatedRoute` は、
ルートツリーの上下関係を飛び越えて、親ルートや子ルート、兄弟ルートの情報を取得可能なメソッドを提供します。

{@a activated-route}


### アクティブ化されたルート

ルートパスやパラメータは、インジェクトされた [ActivatedRoute](api/router/ActivatedRoute) という名の
ルーターサービスを通して利用できます。
そこには次のようにたくさんの役立つ情報が含まれています。

<table>
  <tr>
    <th>
      プロパティ
    </th>

    <th>
      説明
    </th>
  </tr>

  <tr>
    <td>
      <code>url</code>
    </td>
    <td>

    ルートパスの `Observable` です。ルートパスの各パーツの文字列の配列として表されます。

    </td>
  </tr>

  <tr>
    <td>
      <code>data</code>
    </td>
    <td>

    ルートから提供される `data` オブジェクトを含む `Observable` です。
    また、[解決ガード](#resolve-guard) によって解決された値もすべて含みます。

    </td>
  </tr>

  <tr>
    <td>
      <code>paramMap</code>
    </td>
    <td>

    そのルートに固有の、必須または [オプショナルのパラメーター](#optional-route-parameters) の [マップ](api/router/ParamMap) を含む `Observable` です。
    マップは同じパラメーターから単一または複数の値を取り出す機能をサポートしています。

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParamMap</code>
    </td>
    <td>

    すべてのルートで利用可能な [クエリパラメーター](#query-parameters) の [マップ](api/router/ParamMap) を含む `Observable` です。
    マップは同じパラメーターから単一または複数の値を取り出す機能をサポートしています。

    </td>
  </tr>

  <tr>
    <td>
      <code>fragment</code>
    </td>
    <td>

    すべてのルートで利用可能なURLの [フラグメント](#fragment) を含む `Observable` です。

    </td>
  </tr>

  <tr>
    <td>
      <code>outlet</code>
    </td>
    <td>

    ルートを描画するのに使われる `RouterOutlet` の名前です。無名のアウトレットは _primary_ という名前になります。

    </td>
  </tr>

  <tr>
    <td>
      <code>routeConfig</code>
    </td>
    <td>

    オリジンパスを含むルートに使われている設定です。

    </td>
  </tr>

    <tr>
    <td>
      <code>parent</code>
    </td>
    <td>

    このルートが [子ルート](#child-routing-component) の場合、親となる `ActivatedRoute`。

    </td>
  </tr>

  <tr>
    <td>
      <code>firstChild</code>
    </td>
    <td>

    このルートの子ルートの中で最初の `ActivatedRoute`。

    </td>
  </tr>

  <tr>
    <td>
      <code>children</code>
    </td>
    <td>

    現在のルートの配下にある、すべてのアクティブな [子ルート](#child-routing-component)。

    </td>
  </tr>
</table>

<div class="alert is-helpful">

まだ利用可能な古いプロパティが2つありますが、代替品より役に立たず、がっかりするものです。
また、Angularの将来のバージョンにおいて廃止される可能性があります。

**`params`**&mdash;ルート固有の、必須または [オプショナルのパラメーター](#optional-route-parameters) の [マップ](api/router/ParamMap) を含む `Observable` です。代わりに `paramMap` を使ってください。

**`queryParams`**&mdash;すべてのルートで利用可能な [クエリパラメーター](#query-parameters) の [マップ](api/router/ParamMap) を含む `Observable` です。代わりに `queryParamMap` を使ってください。

</div>

### ルーターイベント

個々の画面遷移間で、`Router` は `Router.events` プロパティを通じて画面遷移イベントを発火させます。
遷移の開始、終了、そしてその間の多くのポイントが、このイベントの範囲となります。
画面遷移イベントの完全なリストは、次のテーブルで説明します。

<table>
  <tr>
    <th>
      ルーターイベント
    </th>

    <th>
      説明
    </th>
  </tr>

  <tr>
    <td>
      <code>NavigationStart</code>
    </td>
    <td>

      画面遷移が開始したときに発火する [イベント](api/router/NavigationStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadStart</code>
    </td>
    <td>

      `Router` がルート設定を [遅延ロード](#asynchronous-routing) する前に発火する
      [イベント](api/router/RouteConfigLoadStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadEnd</code>
    </td>
    <td>

      ルートの遅延ロードが完了した後に発火する [イベント](api/router/RouteConfigLoadEnd) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>RoutesRecognized</code>
    </td>
    <td>

      ルーターがURLをパースして認識したときに発火する [イベント](api/router/RoutesRecognized) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckStart</code>
    </td>
    <td>

      ルーターがルーティングにおけるガードフェーズを開始したときに [イベント](api/router/GuardsCheckStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationStart</code>
    </td>
    <td>

      ルーターが子ルートをアクティブにする前に発火する [イベント](api/router/ChildActivationStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationStart</code>
    </td>
    <td>

      ルーターがルートをアクティブにしたときに発火する [イベント](api/router/ActivationStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckEnd</code>
    </td>
    <td>

      ルーターがルーティングにおけるガードフェーズを正常に完了させた後に発火する [イベント](api/router/GuardsCheckEnd) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveStart</code>
    </td>
    <td>

      ルーターがルーティングの解決フェーズを開始したときに発火する [イベント](api/router/ResolveStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveEnd</code>
    </td>
    <td>

      ルーターがルーティングの解決フェーズを正常に完了させたときに発火する　[イベント](api/router/ResolveEnd) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationEnd</code>
    </td>
    <td>

      ルーターが子ルートをアクティブにした後に発火する [イベント](api/router/ChildActivationEnd) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationEnd</code>
    </td>
    <td>

      ルーターがルートをアクティブにした後に発火する [イベント](api/router/ActivationStart) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationEnd</code>
    </td>
    <td>

      画面遷移が正常に完了したときに発火する [イベント](api/router/NavigationEnd) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationCancel</code>
    </td>
    <td>

      画面遷移がキャンセルされたときに発火する [イベント](api/router/NavigationCancel) です。
      画面遷移中に [ルートのガード](#guards) が false を返したときに発生します。

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationError</code>
    </td>
    <td>

      画面遷移が予期せぬエラーで失敗したときに発火する [イベント](api/router/NavigationError) です。

    </td>
  </tr>

  <tr>
    <td>
      <code>Scroll</code>
    </td>
    <td>

      スクロールイベントが発生したときに発火する [イベント](api/router/Scroll) です。

    </td>
  </tr>
</table>

これらのイベントは `enableTracing` オプションを有効にすることでコンソールログに残すことができます。
フィルタリングされたルーターによる画面遷移の例が、[AngularのObservables](guide/observables-in-angular) ガイドにある [ルーターセクション](guide/observables-in-angular#router) に記載されています。

{@a basics-summary}


### まとめ

アプリケーションは設定済みのルーターを持っています。
ルーターによって構築されたビューを表示している場合、シェルコンポーネントは `RouterOutlet` を持っています。
また、クリックによってルーターを介した画面遷移を行っている場合は、`RouterLink` を持っています。

ここにあるのが、主な `Router` の用語とその意味です。

<table>

  <tr>

    <th>
      ルーターの部品
    </th>

    <th>
      意味
    </th>

  </tr>

  <tr>

    <td>
      <code>Router</code>
    </td>

    <td>
      アクティブなURLに対してアプリケーションコンポーネントを表示するものです。
      また、コンポーネントを次のコンポーネントへと画面遷移させられるように管理するものです。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterModule</code>
    </td>

    <td>
      独立したNgModuleで、必要なサービスプロバイダーや、
      アプリケーションのビュー間で画面遷移を行うためのディレクティブを提供するものです。
    </td>

  </tr>

  <tr>

    <td>
      <code>Routes</code>
    </td>

    <td>
      ルートの配列であり、各々がURLパスをコンポーネントに紐付けています。
    </td>

  </tr>

  <tr>

    <td>
      <code>Route</code>
    </td>

    <td>
      URLパターンに基づいたコンポーネントに対し、ルーターがどうやって画面遷移を行うかを定義するものです。
      ほとんどのルートは1つのパスと1つのコンポーネントタイプから構成されます。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterOutlet</code>
    </td>

    <td>
      ルーターがどこにビューを表示するかの目印となるディレクティブ (<code>&lt;router-outlet></code>) です。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLink</code>
    </td>

    <td>
      クリック可能なHTML要素をルートに紐付けるためのディレクティブです。
      <i>文字列</i>や<i>リンクパラメーター配列</i>をもつ<code>routerLink</code>ディレクティブが
      紐付いている要素をクリックすることで、画面遷移を行います。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLinkActive</code>
    </td>

    <td>
      HTML要素上あるいは要素内に関連付けられた<code>routerLink</code>がアクティブ/非アクティブになったときに、
      HTML要素にクラスを追加/削除するためのディレクティブです。
    </td>

  </tr>

  <tr>

    <td>
      <code>ActivatedRoute</code>
    </td>

    <td>
      個々のルートコンポーネントに提供されるサービスです。
      それによってルートコンポーネントは特定の情報 (たとえばルートパラメーターや静的データ、解決データ、グローバルクエリパラメーター、グローバルフラグメント) を保持することになります。
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterState</code>
    </td>

    <td>
      ルートツリーをたどるための便利なメソッドと一緒に、
      現在アクティブになっているツリーを含んでいるルーターの現在の状態です。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>Link parameters array</i></b>
    </td>

    <td>
      ルーティングを指示するためのルーター解釈の配列です。
      この配列は<code>RouterLink</code>に紐付けることもできるし、
      <code>Router.navigate</code>メソッドの引数に指定することもできます。
    </td>

  </tr>

  <tr>

    <td>
      <b><i>Routing component</i></b>
    </td>

    <td>
      ルーターによる画面遷移によって表示を行う<code>RouterOutlet</code>を備えたAngularコンポーネントのことです。
    </td>

  </tr>

</table>




{@a sample-app-intro}


## サンプルアプリケーション

このガイドでは、ルーティングを使ったマルチページのサンプルアプリケーションの開発方法を解説する。
内容として、ルーターの設計上の決定事やキーとなる機能など以下のとおりである:


* アプリケーションの機能をモジュールに統合する
* コンポーネントの解説 (*Heroes*を"Heroes List"にリンクする)
* ルーティング時のパラメータ (ヒーローの`id`を"Hero Detail"に渡す)
* 子ルート (*Crisis Center*自身のもつルートについて)
* `CanActivate`でのガード (ルートへのアクセスのチェック)
* `CanActivateChild`でのガード (子ルートへのアクセスのチェック)
* `CanDeactivate`でのガード (未保存の変更破棄の承認)
* `Resolve`でのガード (ルートデータの事前読み込み)
* 機能モジュール群の遅延読み込み
* `CanLoad`でのガード (機能モジュール読み込み前のチェック)

ガイドではアプリケーションを構築するために必要なマイルストーンを順番にならべてある。
ただしこれはチュートリアルではない。Angularアプリケーション構築の方法をまとめているが、その内容は、ほかの場所でもっと詳細に書かれている。

このアプリケーションの最終版の全ソースは <live-example></live-example> からダウンロードできる。


### 作ろうとしているアプリケーション

_ヒーローを雇用する会社_の運用を手助けするアプリケーションを想像してみる。ヒーローたちは働く必要があり、会社はヒーローたちの助けを必要とする危機をどこからか探さなければならない。

アプリケーションには主として三つの機能領域が必要となる:

1. 危機のリストでヒーローをアサインして管理していく*Crisis Center*
1. 会社に雇われているヒーローのリストであるエリア*Heroes*
1. 危機やヒーローのリストを管理するエリア*Admin*

この <live-example title="Hero Employment Agency Live Example">サンプルリンク</live-example>を試しにクリックしてみてほしい。

アプリケーションが動き始めると、ナビゲーションボタンの列と、*Heroes*がリストで見られるビューがあるだろう。


<figure>
  <img src='generated/images/guide/router/hero-list.png' alt="Hero List">
</figure>



Select one hero and the app takes you to a hero editing screen.
ヒーローを一つ選択すると、アプリケーションはヒーローの編集画面へ移動する。

<figure>
  <img src='generated/images/guide/router/hero-detail.png' alt="Crisis Center Detail">
</figure>



名前を変えてみよう。
"Back"をクリックすると、画面はヒーローリストに戻るが、ヒーローの名前は変更されている。
名前の変更がすぐに行われたことがわかる。

ブラウザの戻るボタンの代わりに"Back"ボタンを押し、さっきのヒーローリストがまた表示された、
Angularアプリケーションの遷移では通常のウェブのナビゲーションと同様に、ブラウザ履歴の更新が行われる。

Now click the *Crisis Center* link for a list of ongoing crises.
リンク*Crisis Center*をクリックし、現在起こっている危機の一覧を見てみよう。


<figure>
  <img src='generated/images/guide/router/crisis-center-list.png' alt="Crisis Center List">
</figure>



どれか危機を選択すると、その編集画面に遷移する。_Crisis Detail_がページ内に子コンポーネントとして現れる。

Alter the name of a crisis.
危機の名前を変えてみよう。
Notice that the corresponding name in the crisis list does _not_ change.
リストにある危機の名前が_変わっていない_ことに気づくだろう。

<figure>
  <img src='generated/images/guide/router/crisis-center-detail.png' alt="Crisis Center Detail">
</figure>



あなたの入力どおりに更新された*Hero Detail*と違い、*Crisis Detail*はSave"か"Cancel"のボタンを押して保存か破棄をしない限り変更されない。
どちらのボタンも*Crisis Center*へ戻り、危機のリストが表示されるようになっている。

***まだどちらのボタンを押してもいけない***.
ブラウザの戻るボタンかリンク"Heroes"をクリックする。
ダイアログボックスが出てくる。

<figure>
  <img src='generated/images/guide/router/confirm-dialog.png' alt="Confirm Dialog">
</figure>



"OK"を押して変更を破棄するか、"Cancel"をクリックして編集を続行できる。

これらの動作はルーターの`CanDeactivate`ガードの機能によるものだ。
このガードは現在のビューから移動する前に、一掃したりユーザに許可を求める機会を与えてくれる。

`Admin`と`Login`のそれぞれのボタンはこのあとで、他のルーター機能を説明するために使います。
その紹介を手短にここで行います。


アプリケーションの最初のマイルストーンに進みましょう。

{@a getting-started}

## マイルストーン1: はじめ

シンプルな、二つの空のビューのあいだでの移動から始める。

<figure>
  <img src='generated/images/guide/router/router-1-anim.gif' alt="App in action">
</figure>

{@a import}

サンプルアプリケーションを以下のウォークスルーで作る。

<code-example language="none" class="code-shell">
  ng new angular-router-sample
</code-example>

### ルートの定義

ルーターはルート定義のリストとして構成される。

それぞれの定義は二つのものを持つオブジェクト[Route](api/router/Route)へと変換される。このルートへのパスを持つ`path`と、そのルートに関連付けられる`component`である。

ブラウザのURLが変更されるか、アプリケーションコードがルータにルートパスに沿って移動するように指示した場合、ルータは定義のレジストリを利用する。


最初のルートのことを簡単に言えば、

* ブラウザのURLがパス`/crisis-center`に一致する形で変更されると、ルーターは`CrisisListComponent`のインスタンスを有効化し、そのビューを表示する。

* アプリケーションがパス`/crisis-center`に移動するように要求すると、ルーターは`CrisisListComponent`のインスタンスを有効化し、そのビューを表示する。さらにブラウザのアドレスと履歴を更新する。

最初の構成では`CrisisListComponent`と`HeroListComponent`へ移動するための二つのルートを定義する。`CrisisList`と`HeroList`が作成される。

<code-example language="none" class="code-shell">
  ng generate component crisis-list
</code-example>

<code-example language="none" class="code-shell">
  ng generate component hero-list
</code-example>

内容を下記のサンプルHTMLにそれぞれ変更する。

<code-tabs>

  <code-pane header="src/app/crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="src/app/hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html" region="template">

  </code-pane>

</code-tabs>

### ルーターとルートの登録

ルーターを使うにはまず、パッケージ`@angular/router`から`Routermodule`を使えるようにしておかなければいけない。`appRoutes`としてルートの配列を定義し、それを`RouterModule.forRoot()`に渡す。サービス`Router`やルーティングライブラリに必要なプロバイダが返ってくる。一度アプリケーションが立ち上がると、`Router`はそのときのブラウザのURLに従って最初の移動を行う。

<div class="alert is-important">

  **Note:** メソッド`RouterModule.forRoot`はアプリケーション全体のプロバイダ登録に使われるパターンである。アプリケーション全体のプロバイダについてはガイド[Singleton services](guide/singleton-services#forroot)を読んでください。

</div>

<code-example path="router/src/app/app.module.1.ts" linenums="false" header="src/app/app.module.ts (first-config)" region="first-config">

</code-example>

<div class="alert is-helpful">

設定の済んだ`RouterModule`を`AppModule`に加えれば、簡単なルート設定ができる。アプリケーションが大きくなる場合は、ファイルを分けて**[Routing Module](#routing-module)**を作り[ルート設定のリファクタリング](#refactor-the-routing-configuration-into-a-routing-module)ができる。**[Routing Module](#routing-module)**は機能モジュールのルーティングを目的とした特別なタイプの`Service Module`である。

</div>

`AppModule`に` RouterModule.forRoot（） `のインポートを入れると、アプリケーションのどこでもサービス` Router`が利用できるようになります。

{@a shell}


### ルーターアウトレットを加える

ルートの`AppComponent`はアプリケーションの骨組みとなる。タイトル、二つのリンクが含まれるナビゲーションバー、それとルーターがページの内外でコンポーネントを切り替えるルーターアウトレットがそこに入っている。ここで得られるのは:

<figure>
  <img src='generated/images/guide/router/shell-and-outlet.png' alt="Shell">
</figure>

ルーティングされたコンポーネントがその下にレンダリングされるとき、ルーターのアウトレットはプレースホルダーとして機能する。

{@a shell-template}

対応するコンポーネントテンプレートは以下のようになる:


<code-example path="router/src/app/app.component.1.html" linenums="false" header="src/app/app.component.html">

</code-example>

{@a wildcard}

### ワイルドカードルートの定義

アプリケーションですでに二つのルートを作っている。一つは`/crisis-center`で、もう一つは`/heroes`へのものだ。ほかのURLへのアクセスは、ルーターにエラーを引き起こさせ、アプリをクラッシュさせる。

**wildcard**のルートを不正なURLへのアクセスをまとめて扱うために追加する。
_ワイルドカード_のルートは、二つのアスタリスクを使ったパスから成る。それは_すべての_URLにマッチする。
ルーターはどのルートにもマッチしない場合_この_ルートを選ぶ。
ワイルドカードルートはカスタムの"404 Not Found"のコンポーネントや、存在するページへの[リダイレクト](#redirect)への移動を提供する。

<div class="alert is-helpful">

ルーターによるルートセレクトは、[_最初に一致した条件_](#example-config)が採用される。
ワイルドカードルートはルートの中で最も特定性が低いルートである。
ルート設定の_最後_に置かれていることを確認しなければならない。

</div>

この機能をテストするには、`HeroListComponent`のテンプレートに` RouterLink`付きのボタンを追加して、リンクを `"/sidekicks"`に設定する。

<code-example path="router/src/app/hero-list/hero-list.component.1.html" linenums="false" header="src/app/hero-list/hero-list.component.html (excerpt)">

</code-example>

追加したボタンをクリックすれば、アプリケーションは例外を出すだろう。まだ`"/sidekicks"`のルートを設定していない。

ルート`"/sidekicks"追加する代わりに、`wildcard`ルートを定義してそれを単純な` PageNotFoundComponent`に移動させる。

<code-example path="router/src/app/app.module.1.ts" linenums="false" header="src/app/app.module.ts (wildcard)" region="wildcard">

</code-example>

ユーザに不正なURLを訪れたことを示すため、`PageNotFoundComponent`を作る。

<code-example language="none" class="code-shell">
  ng generate component page-not-found
</code-example>

<code-example path="router/src/app/page-not-found/page-not-found.component.html" linenums="false" header="src/app/page-not-found.component.html (404 component)">

</code-example>

さあ、`/sidekicks`に、あるいはほかの不正なURLにアクセスしてみれば、ブラウザには"Page not found"が表示される。
ブラウザのアドレスバーは不正なURLが表示されたままだ。

{@a redirect}

### リダイレクトの設定

アプリケーションを立ち上げたとき、ブラウザのアドレスバーに入っている初期URLは下記のようなものだとする:

<code-example>
  localhost:4200
</code-example>

これは設定済みのルートにマッチしない。
つまりルーターはワイルドカードルートにたどり着き、`PageNotFoundComponent`を表示する。

アプリケーションには、正規のページのために**default route**が必要となる。
このアプリのデフォルトのページはヒーローのリストとする。
リンク"Heroes"がクリックされるかアドレスバーに`localhost:4200/heroes`が入力されると、アプリはそこへ移動するものとする。

推奨される解決策は、最初の相対パス(`''`)へのアクセスをルート`redirect`で希望のデフォルトパス（`/heroes`）に移動することだ。
ブラウザのアドレスバーには`.../heroes`が、直接移動したかのように表示される。

ワイルドカードの_前_にデフォルトのルートを加える。
ワイルドカードルートのすぐ前に、このマイルストーンでの最終的な形となる`appRoutes`で以下のように書く。

<code-example path="router/src/app/app-routing.module.1.ts" linenums="false" header="src/app/app-routing.module.ts (appRoutes)" region="appRoutes">
</code-example>


リダイレクトルートには、ルーターにURLをパスにマッチさせるためのプロパティ`pathMatch`が必要である。
それがなければルーターはエラーを出す。
このアプリでは、`HeroListComponent`へのルートが有効になるのは、*entire URL*が`''`に一致した場合のみである。
だから`pathMatch`の値に`'full'`を設定する。


<div class="alert is-helpful">


技術的には、`pathMatch = 'full'`はURLの*残り*の一致しない部分が`''`にマッチしたときにルートヒットになります。
この例では、リダイレクトは最上位ルートにあるため、*残りの* URLと*全体の*URLは同じものです。

The other possible `pathMatch` value is `'prefix'` which tells the router
to match the redirect route when the *remaining* URL ***begins*** with the redirect route's _prefix_ path.

もう1つの`pathMatch`の値として可能なものは``prefix'`で、これは*残りの*URLがリダイレクトルートの_prefix_パスで***始まるとき***に、ルーターにリダイレクトルートの一致を伝える。

ここに書くようなことはしてはならない。
もし`pathMatch`の値が`'prefix'`なら、_すべての_URLが`''`にマッチすることになるだろう。

`'prefix'`に設定してから、ボタン`Go to sidekicks`をクリックしてみる。
これは間違ったURLで、"Page not found"が表示されるはずだ。
でもあなたはまだページ"Heroes"にいます。
ブラウザのアドレスバーに間違ったURLを入力する。
あなたは即座に `/heroes`に転送される。
_すべての_URLは正しいか不正にかかわらず、_この_ルート定義をとおしてマッチされる。

デフォルトのルートはURL全体が`''`にマッチするとき_だけ_`HeroListComponent`にリダイレクトされるべきだ。
リダイレクトを`pathMatch = 'full'`に戻すことを忘れずに。

もっと詳しく知りたければVictor Savkinを参考にしたい。
[post on redirects](http://vsavkin.tumblr.com/post/146722301646/angular-router-empty-paths-componentless-routes).


</div>


### 基本のまとめ

アプリのとても基本的な移動をやった。リンクをクリックすることで二つのビューを切り替えるものだ。

You've learned how to do the following:
ここで以下のことをどうやるか学んだ:

* ルーターのライブラリを読み込む
* Add a nav bar to the shell template with anchor tags, `routerLink`  and `routerLinkActive` directives.
テンプレートにアンカータグでナビゲーションバーを追加し、ディレクティブ`routerLink`と`routerLinkActive`を置いた。
* `router-outlet`をビューが表示されるテンプレートに追加した。
* ルーターモジュールを`RouterModule.forRoot`で設定した。
* HTML5ブラウザのURLを構成するルーターを設定した。
* `ワイルドカード`ルートで不正なルートを処理した。
* アプリ立ち上げ時の空のパスを、デフォルトルートへ移動するようにした。

ここでのアプリの構成は以下のようになる:

<div class='filetree'>

  <div class='file'>
    angular-router-sample
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          crisis-list
        </div>

        <div class='children'>

          <div class='file'>

            crisis-list.component.css

          </div>

          <div class='file'>

            crisis-list.component.html

          </div>

          <div class='file'>

            crisis-list.component.ts

          </div>

        </div>

        <div class='file'>
          hero-list
        </div>

        <div class='children'>

          <div class='file'>

            hero-list.component.css

          </div>

          <div class='file'>

            hero-list.component.html

          </div>

          <div class='file'>

            hero-list.component.ts

          </div>
          
        </div>

        <div class='file'>
          page-not-found
        </div>

        <div class='children'>

          <div class='file'>

            page-not-found.component.css

          </div>

          <div class='file'>

            page-not-found.component.html

          </div>

          <div class='file'>

            page-not-found.component.ts

          </div>
          
        </div>

        <div class='file'>
          app.component.css
        </div>

        <div class='file'>
          app.comファイルについてはml
        </div>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>



これらのファイルについてはこのマイルストーンで取り上げる。

<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.1.html">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.1.ts">

  </code-pane>

  <code-pane header="hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html">

  </code-pane>

  <code-pane header="crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="page-not-found/page-not-found.component.html" path="router/src/app/page-not-found/page-not-found.component.html">

  </code-pane>

  <code-pane header="index.html" path="router/src/index.html">

  </code-pane>

</code-tabs>


{@a routing-module}

## マイルストーン2: *ルーティングモジュール*

In the initial route configuration, you provided a simple setup with two routes used
to configure the application for routing. This is perfectly fine for simple routing.
As the application grows and you make use of more `Router` features, such as guards,
resolvers, and child routing, you'll naturally want to refactor the routing configuration into its own file.
We recommend moving the routing information into a special-purpose module called a *Routing Module*.
最初のルート設定では、2つのルートを使用した簡単な設定を行い、アプリケーションでのルーティングを設定した。
これは単純なルーティングにはまったく問題ない。
アプリケーションが成長して、ガード、リゾルバや子ルーティングなどのもっと多くの`Router`機能を利用するようになると、当然ルーティング設定をファイルに分けてリファクタリングしたくなる。
ルーティング情報を*ルーティングモジュール*という特別な目的のモジュールに移動することをお勧めする。


**ルーティングモジュール**には下記のような特性がある:

* ルーティングの問題を、アプリケーションのほかの問題から切り離す。
* アプリケーションのテスト時に変換や削除を行うモジュールを提供する。
* ガードやリゾルバを含むルーティングサービスプロバイダのためのよく知られた場所を提供する。
* コンポーネントの宣言は行わない。

{@a integrate-routing}

### アプリにルーティングを統合する

You can then use routing in any NgModule that you add to the project or app.
ルーティングサンプルのアプリケーションは、デフォルトではルーティングを含んでいない。
[Angular CLI](cli)を使ってルーティングを使うプロジェクトを作り、オプション`--routing`をプロジェクトかアプリ、あるいはそれぞれのNgModuleにセットする。
新しいプロジェクトを作る(CLIでコマンド[`ng new`](cli/new)を使って)か、新しいアプリを作る(コマンド[`ng generate app`](cli/generate)を使って)ときにオプション`--routing`を加える。これはCLIにnpmパッケージ`@angular/router`を加えさせ、さらにファイル`app-routing.module.ts`も作らせる。
これでプロジェクトやアプリに追加したあらゆるNgModuleでルーティングを使える。

例として、下記のコマンドでルーティングを使えるNgModuleを作れる。

```sh
ng generate module my-module --routing
```

これで`my-module-routing.module.ts`というNgModuleのルートを入れておくファイルを作れる。
ファイルには空のオブジェクト`Routes`が含まれており、ことなるコンポーネントやNgModuleへのルートで埋めることができる。

{@a routing-refactor}


### ルーティング設定を_ルーティングモジュール_へリファクタリングする

ルーティング設定を入れるため、モジュール`AppRouting`をフォルダ`/app`に作る。

<code-example language="none" class="code-shell">
  ng generate module app-routing --module app --flat
</code-example>

`CrisisListComponent`、`HeroListComponent`と`PageNotFoundComponent`を`app.module.ts`でやったようにインポートする。
それから`Router`のインポートと`RouterModule.forRoot`を含むルーティング設定をこのルーティングモジュールに移す。

再び、`RouterModule`を配列`exports`に加えることでエクスポートする。
再び`RouterModule`をエクスポートすることで、`AppModule`で宣言されたコンポーネントは`RouterLink`や`RouterOutlet`のようなルーターディレクティブにアクセスできるようになる。

これらステップののち、ファイルは以下のようになる。

<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts">

</code-example>

次は`app.module.ts`を更新し、配列`imports`にある`RouterModule.forRoot`を削除する。

<code-example path="router/src/app/app.module.2.ts" header="src/app/app.module.ts">

</code-example>



<div class="alert is-helpful">



このガイドのあとで、[複数のルーティングモジュール](#heroes-functionality)を作り、ルーティングモジュールを[正しい順番で](#routing-module-order)でインポートしなければならないことを学ぶ。


</div>



アプリケーションの動作は変わらず、`AppRoutingModule`をルーティング設定の中心として使える。


{@a why-routing-module}


### _ルーティングモジュール_が必要かい?

_ルーティングモジュール_はrootや機能モジュールでのルーティング設定を*置き換える*。
ルーティングモジュールでルートを設定する_か_、モジュール内でルートを設定します。両方では設定しない。

ルーティングモジュールは、構成が複雑でガードやリゾルバが含まれるような場合に最も価値がある設計上の選択である。
実際の設定が単純な場合は、やり過ぎに見えるかもしれない。

設定が単純である場合、開発者の中にはルーティングモジュール（例えば `AppRoutingModule`）をスキップし、ルーティング設定を直接コンパニオンモジュールにマージする人もいる（例えば `AppModule`）。

どちらかを選択して、そのパターンに一貫して従うこと。

ほとんどの開発者は一貫性のために常にルーティングモジュールを実装するべきである。
設定が複雑になってもコードをクリーンに保つ。
機能モジュールのテストが容易になる。
その存在は、モジュールがルーティングされるという事実に注意を促す。
開発者がルーティング設定を見つけて拡張することが期待できる。

{@a heroes-feature}

## マイルストーン 3: ヒーローの機能

ディレクティブ`RouterLink`を使ってナビゲートする方法を見た。
これで、次のことがわかる:

* モジュールを使用して*機能領域*にアプリとルートを整理する。
* あるコンポーネントから別のコンポーネントへと命令的に移動する。
* ルートパラメータで必須およびオプションの情報を渡す。

この例では、[Tour of Heroes tutorial](tutorial/toh-pt4 "Tour of Heroes: Services")の "Services"エピソードのヒーロー機能を再作成する。
そしてコードの大部分を<live-example name="toh-pt4" title="Tour of Heroes: Services example code"></live-example>からコピーすることになる。

ユーザーがこのバージョンのアプリで体験するのは次のとおりです:


<figure>
  <img src='generated/images/guide/router/router-2-anim.gif' alt="App in action">
</figure>



典型的なアプリケーションは複数の*機能領域*を持っており、
それぞれが特定の事業目的に捧げられている。

ファイルをフォルダ`src/app/`に追加し続けることはできるが、
これは非現実的で、最終的には保守できなくなる。
ほとんどの開発者は、各機能領域をそれぞれ独自のフォルダに置くことを好む。

あなたは、それぞれ独自の懸念を持って、異なる*機能モジュール*にアプリを分割しようとしている。
それからメインモジュールにインポートし、それらの間を移動する。


{@a heroes-functionality}


### ヒーロー機能の追加

以下の手順を行う:

* フォルダheroesにルーティングを行う`HeroesModule`を作成し、それをルートの`AppModule`に登録する。これが、あなたが*ヒーロー管理*を実装する場所である。

<code-example language="none" class="code-shell">
  ng generate module heroes/heroes --module app --flat --routing
</code-example>

* `app`にあるプレースホルダのフォルダ`hero-list`をフォルダ`heroes`に移動する。
* <live-example name="toh-pt4" title="Tour of Heroes: Services example code">"Services" tutorial</live-example>にある`heroes/heroes.component.html`の内容をテンプレート`hero-list.component.html`にコピーする。

  * `<h2>`を`<h2>HEROES</h2>`に変更する。
  * コンポーネント`<app-hero-detail>`を削除する。

* live exampleにある`heroes/heroes.component.css`の内容を`hero-list.component.css`にコピーする。
* live exampleにある`heroes/heroes.component.ts`の内容を`hero-list.component.ts`にコピーする。

  * コンポーネントのクラス名を`HeroListComponent`に変更する。
  * `selector`を`app-hero-list`に変更する。
  
<div class="alert is-helpful">

   ページがレンダリングされるときにコンポーネントが動的に挿入されるため、_routed components_にはセレクタは**必須**ではないが、HTML要素ツリーでそれらを識別してターゲットにするのに役立つ。

</div>

* フォルダ`hero-detail`と`hero.ts`、`hero.service.ts`、`mock-heroes.ts`をサブフォルダ`heroes`にコピーする。
* フォルダ`src/app`に`message.service.ts`をコピーする。
* ファイル`hero.service.ts`内の`message.service`への相対パスのインポートを更新する。

次は`HeroesModule`のメタデータを更新する。

  * `HeroDetailComponent`と`HeroListComponent`を`HeroesModule`の配列`declarations`にインポートして加する。

<code-example path="router/src/app/heroes/heroes.module.ts" header="src/app/heroes/heroes.module.ts">

</code-example>



ひととおり終わると、*ヒーロー管理*のファイルは以下のようになる:


<div class='filetree'>

  <div class='file'>
    src/app/heroes
  </div>

  <div class='children'>

    <div class='file'>
      hero-detail
    </div>

      <div class='children'>

        <div class='file'>
          hero-detail.component.css
        </div>

        <div class='file'>
          hero-detail.component.html
        </div>

        <div class='file'>
          hero-detail.component.ts
        </div>

      </div>

    <div class='file'>
      hero-list
    </div>

      <div class='children'>

        <div class='file'>
          hero-list.component.css
        </div>

        <div class='file'>
          hero-list.component.html
        </div>

        <div class='file'>
          hero-list.component.ts
        </div>

      </div>

    <div class='file'>
      hero.service.ts
    </div>    

    <div class='file'>
      hero.ts
    </div>

    <div class='file'>
      heroes-routing.module.ts
    </div>    

    <div class='file'>
      heroes.module.ts
    </div>

    <div class='file'>
      mock-heroes.ts
    </div>

    </div>




  </div>

</div>



{@a hero-routing-requirements}


#### ルーティングに必要な*ヒーロー*機能

ヒーロー機能には、ヒーローリストとヒーローの詳細という2つの相互作用するコンポーネントがある。
リストビューは自給自足です。移動すると、ヒーローの一覧が表示される。

詳細表示は異なる。特定の英雄を表示する。どのヒーローを見せるべきかを自分自身で決めることはできない。
その情報は外部から来なければならない。

ユーザーがリストから主人公を選択すると、アプリは詳細ビューに移動し、そのヒーローを見せる。
ルートのURLに選択したヒーローのIDを含めることで、どのヒーローを表示するかを詳細ビューに指示する。


`src/app/heroes/`フォルダの新しい場所からヒーローコンポーネントをインポートし、2つのヒーロールートを定義する。

これで`Heroes`モジュールへのルートができたので、`Router`を使って`AppRoutingModule`で行った_ような_形で`RouterModule`の設定をする。

小さいながらも重大な違いがある。
`AppRoutingModule`では、スタティックメソッド**`RouterModule.forRoot`**を使ってルートとアプリケーションレベルのサービスプロバイダを登録した。
機能モジュールでは、スタティックメソッド**`forChild`**を使用する。


<div class="alert is-helpful">



rootのAppRoutingModuleでRouterModule.forRootのみを呼び出す
（あるいは、もしあなたがトップレベルのアプリケーションルートを登録する場所であれば `AppModule`）。
他のモジュールでは、追加のルートを登録するためにメソッド**`RouterModule.forChild`**を呼び出す必要がある。

</div>

更新された`HeroesRoutingModule`は以下のようになる:


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts">

</code-example>



<div class="alert is-helpful">


各機能モジュールに独自のルート設定ファイルを指定することを検討する。
フィーチャルートが単純な場合は、早すぎるとやり過ぎに見えるかもしれなり。
しかし、ルートはより複雑になり、パターンの一貫性が徐々に向上していく。


</div>


{@a remove-duplicate-hero-routes}


#### 重複するヒーローのルートを削除する

主人公のルートは現在2つの場所で定義されている： `HeroesRoutingModule`では、
`HeroesModule`で、そして` AppRoutingModule`で。

機能モジュールによって提供されたルートは、ルータによってそれらのインポートされたモジュールのルートにまとめられる。
これにより、メインルート設定を変更せずに、機能モジュールルートの定義を続けることができる。

`app-routing.module.ts`から`HeroListComponent`のインポートとルート`/heroes`を削除する。

**デフォルトとワイルドカードのルートは残す!**
これらはアプリケーションのトップレベルでの重要事である。


<code-example path="router/src/app/app-routing.module.2.ts" linenums="false" header="src/app/app-routing.module.ts (v2)">

</code-example>



{@a merge-hero-routes}


#### ヒーローの宣言を削除する

`HeroesModule`によって現在提供されているので、`AppModule`の `declarations`から`HeroListComponent`を削除する。あなたはより多くのコンポーネントと異なるルートでヒーロー機能を進化させることができる。これは、機能領域ごとに別々のモジュールを作成することの大きな利点である。

これらステップののち、`AppModule`は以下のようになる:

<code-example path="router/src/app/app.module.3.ts" header="src/app/app.module.ts">

</code-example>



{@a routing-module-order}


### モジュールのインポート順について
ヒーローモジュールの配列`imports`を見る。`AppRoutingModule`が_最後_にある。
最も重要なことに、それは `HeroesModule`の_後に_来る。

<code-example path="router/src/app/app.module.3.ts" region="module-imports" header="src/app/app.module.ts (module-imports)" linenums="false">

</code-example>



ルート設定の順序は重要です。
ルーターは、ナビゲーション要求パスと一致する最初のルートを受け入れる。

When all routes were in one `AppRoutingModule`,
you put the default and [wildcard](#wildcard) routes last, after the `/heroes` route,
so that the router had a chance to match a URL to the `/heroes` route _before_
hitting the wildcard route and navigating to "Page not found".
すべてのルートが`AppRoutingModule`に入っていたとき、
ルート`/heroes`の後に、デフォルトのルートと[ワイルドカード]（＃wildcard）ルートを最後に置き、
ルーターがURLを `/heroes`ルートにマッチさせる機会を得た。
ワイルドカードルートにヒットして、"Page not found"に移動する_前に_。

The routes are no longer in one file.
They are distributed across two modules, `AppRoutingModule` and `HeroesRoutingModule`.
ルートはもう一つ以上のファイルに書かれている。
二つのモジュール`AppRoutingModule`と`HeroesRoutingModule`によって使える。

Each routing module augments the route configuration _in the order of import_.
If you list `AppRoutingModule` first, the wildcard route will be registered
_before_ the hero routes.
The wildcard route&mdash;which matches _every_ URL&mdash;will intercept the attempt to navigate to a hero route.
それぞれのルーティングモジュールは、_インポートの順序で_ルート設定を拡張します。
最初に `AppRoutingModule`をリストした場合、ワイルドカードルートがヒーロールートの_前に_登録される。
_すべての_URLに一致するワイルドカードルートは、ヒーロールートへの移動を阻止する。


<div class="alert is-helpful">



ルーティングモジュールの順番を逆にして、ヒーローのリンクをクリックすると"Page not found"という結果になることを確認する。
ランタイムルーターの設定を調べるには、[以下](#inspect-config "Inspect the router config")を参照する。

</div>

### ルートパラメータ

{@a route-def-with-parameter}


#### パラメータでのルート定義

`HeroesRoutingModule`にもどり、ルート定義をもう一度見る。
`HeroDetailComponent`へのルートはひねりがある。

<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" linenums="false" header="src/app/heroes/heroes-routing.module.ts (excerpt)" region="hero-detail-route">

</code-example>



パスの中に`:id`というトークンがあることに気づく。これはパスに**ルートパラメータ**を入れるために使われる。
このケースではヒーローの`id`が挿入される。

ルーターに詳細コンポーネントへ移動し"Magneta"を表示するように指定する。
URLにはヒーローのIDが以下のように入ってくる:


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



もしユーザがブラウザのアドレスバーにURLを入れると、ルーターはパターンを認識し、"Magneta"の詳細ビューへ移動する。


<div class="callout is-helpful">



<header>
  ルーターパラメータ: 必須かオプションか?
</header>



ルートパラメータとしてトークン`:id`をルート定義パスに埋め込むのは、いい選択である。
`id`は`HeroDetailComponent`に*必須*で、値を`15`にすれば"Magneta"へのルートがほかのヒーローへのルートと区別できる。


</div>


{@a route-parameters}


#### 一覧のビューにルートパラメータを設定する

`HeroDetailComponent`への移動を設定したら、次には選択されたヒーローの詳細を見たい。
ここでは二つの情報が必要になる。コンポーネントへのルーティングパスとヒーローの`id`だ。

_リンクパラメータの配列_は*二つ*のアイテムを持つ:  ルーティング_パス_と選択したヒーローの`id`を示す_ルートパラメータ_だ。



<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.ts" linenums="false" header="src/app/heroes/hero-list/hero-list.component.ts (link-parameters-array)" region="link-parameters-array">

</code-example>



ルーターは次のように配列から宛先URLを作成する。
`localhost:4200/hero/15`.



<div class="alert is-helpful">



`HeroDetailComponent`はどうやって`id`を知ることができるか。
URLを解析する必要はない。ルーターにそれをやらせよう。

ルーターはURLからルートパラメータ(`id:15`)を引き出し、`HeroDetailComponent`にサービス`ActivatedRoute`を使って渡す。



</div>

{@a activated-route}

### _有効化されたルート_について

ルーターパッケージから`Router`、`ActivatedRoute`と`ParamMap`をインポートする。


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (activated route)" region="imports">

</code-example>



オペレータ`switchMap`を、あとで`Observable`ルートパラメータを扱うためにインポートする。


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (switchMap operator import)" region="rxjs-operator-import">

</code-example>



{@a hero-detail-ctor}


例によって、コンポーネントに必要なサービスを入れるため、コンストラクタにプライベートな値で参照を書いていく。


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (constructor)" region="ctor">

</code-example>

そのあと、メソッド`ngOnInit`でサービス`ActivatedRoute`を使い、ルートパラメータを引き出せるようにし、ヒーローの`id`をパラメータから引き出してヒーローを表示する。


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit)" region="ngOnInit">

</code-example>

`paramMap`の処理は少しトリッキーだ。マップが変わったとき、パラメータ`id`を`変更されたパラメータからget()`する。

ヒーローの情報を得るため`id`を使って`HeroService`に問い合わせ、リクエスト結果を得る。

Rxjsのオペレータ`map`を使うと思うかもしれないが、`HeroService`は`Observable<Hero>`を返す。
そして代わりに、`switchMap`演算子を使って`Observable`を平坦化する。

オペレータ`switchMap`は以前の実行中のリクエストもキャンセルする。ユーザーがこのルートに再ナビゲートした場合、`HeroService`がまだ古い`id`を検索している間に新しい `id`を使うと、`switchMap`はその古いリクエストを破棄して新しい `id`のヒーローを返す。

追跡可能な `Subscription`は` AsyncPipe`によって処理され、コンポーネントの `hero`プロパティは取得されたヒーローで（再）設定される。

#### _ParamMap_のAPI

`ParamMap`のAPIは[URLSearchParams interface](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)に着想を得ている。
ルートパラメータ(`paramMap`)とクエリパラメータ(`queryParamMap`)のそれぞれがパラメータを扱う方法として提供されている。

<table>
  <tr>
    <th>
      Member
    </th>

    <th>
      Description
    </th>
  </tr>

  <tr>
    <td>
      <code>has(name)</code>
    </td>
    <td>

    Returns `true` if the parameter name is in the map of parameters.

    </td>
  </tr>

  <tr>
    <td>
      <code>get(name)</code>
    </td>
    <td>

    Returns the parameter name value (a `string`) if present, or `null` if the parameter name is not in the map. Returns the _first_ element if the parameter value is actually an array of values.

    </td>
  </tr>

  <tr>
    <td>
      <code>getAll(name)</code>
    </td>
    <td>

    Returns a `string array` of the parameter name value if found, or an empty `array` if the parameter name value is not in the map. Use `getAll` when a single parameter could have multiple values.

    </td>
  </tr>

  <tr>
    <td>
      <code>keys</code>
    </td>
    <td>

    Returns a `string array` of all parameter names in the map.

    </td>
  </tr>
</table>

{@a reuse}

#### オブザーバブルな<i>paramMap</i>とコンポーネントの再利用

この例では、 `Observable`からルートパラメータマップを取得する。
これは、ルートパラメータマップがこのコンポーネントの有効期間中に変更される可能性があることを意味する。

デフォルトでは、ルーターは同じコンポーネントタイプに再ナビゲートするときに、別のコンポーネントにアクセスすることなコンポーネントインスタンスを再利用する。
ルートパラメータは毎回変わる可能性がある。

親コンポーネントのナビゲーションバーに、「進む」ボタンと「戻る」ボタンがあり、ヒーローのリストをスクロールできるとする。
それぞれのクリックは、次のまたは前の `id`を持つ` HeroDetailComponent`に命令的にナビゲートされる。

次の`id`から新しくコンテンツを作り直すためだけに、DOMから現在の` HeroDetailComponent`のインスタンスを削除したくないだろう。
それは目に見えて不快になるかもしれない。
単に同じコンポーネントインスタンスを再利用してパラメータを更新するほうがよい。

残念ながら、 `ngOnInit`はコンポーネントのインスタンス化ごとに一度だけ呼び出される。
同じインスタンス内で、ルートパラメータが_同じインスタンス_からいつ変更されたかを検出する方法が必要である。
オブザーバブルな`paramMap`プロパティはそれを合理的に処理する。

<div class="alert is-helpful">



コンポーネント内のオブザーバブルを購読するときは、ほとんどの場合、コンポーネントが破棄されたときに購読を中止するように手配する。

There are a few exceptional observables where this is not necessary.
The `ActivatedRoute` observables are among the exceptions.
これが必要ではないいくつかの例外的なオブザーバブルがあります。
オブザーバブル`ActivatedRoute`は例外である。

`ActivatedRoute`とそのオブザーバブルは`Router`自身から隔離されている。
`Router`は、ルーティングされたコンポーネントが必要なくなったときにそれを破棄し、注入された` ActivatedRoute`はそれと共に消える。


とにかく購読を中止すること。それは無害であり、決して悪い習慣ではない。


</div>



{@a snapshot}


#### _スナップショット_: _オブザーバブルではない_代替
_This_ application won't re-use the `HeroDetailComponent`.
The user always returns to the hero list to select another hero to view.
There's no way to navigate from one hero detail to another hero detail without visiting the list component in between.
Therefore, the router creates a new `HeroDetailComponent` instance every time.

When you know for certain that a `HeroDetailComponent` instance will *never, never, ever* be re-used, you can simplify the code with the *snapshot*.

The `route.snapshot` provides the initial value of the route parameter map.
You can access the parameters directly without subscribing or adding observable operators.
It's much simpler to write and read:


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.2.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit snapshot)" region="snapshot">

</code-example>



<div class="alert is-helpful">



**Remember:** you only get the _initial_ value of the parameter map with this technique.
Stick with the observable `paramMap` approach if there's even a chance that the router
could re-use the component.
This sample stays with the observable `paramMap` strategy just in case.


</div>



{@a nav-to-list}


### Navigating back to the list component

The `HeroDetailComponent` has a "Back" button wired to its `gotoHeroes` method that navigates imperatively
back to the `HeroListComponent`.

The router `navigate` method takes the same one-item _link parameters array_
that you can bind to a `[routerLink]` directive.
It holds the _path to the `HeroListComponent`_:


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (excerpt)" region="gotoHeroes">

</code-example>


{@a optional-route-parameters}

#### Route Parameters: Required or optional?

Use [*route parameters*](#route-parameters) to specify a *required* parameter value *within* the route URL
as you do when navigating to the `HeroDetailComponent` in order to view the hero with *id* 15:


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



You can also add *optional* information to a route request.
For example, when returning to the hero-detail.component.ts list from the hero detail view,
it would be nice if the viewed hero was preselected in the list.


<figure>
  <img src='generated/images/guide/router/selected-hero.png' alt="Selected hero">
</figure>



You'll implement this feature in a moment by including the viewed hero's `id`
in the URL as an optional parameter when returning from the `HeroDetailComponent`.

Optional information takes other forms. Search criteria are often loosely structured, e.g., `name='wind*'`.
Multiple values are common&mdash;`after='12/31/2015' & before='1/1/2017'`&mdash;in no
particular order&mdash;`before='1/1/2017' & after='12/31/2015'`&mdash; in a
variety of formats&mdash;`during='currentYear'`.

These kinds of parameters don't fit easily in a URL *path*. Even if you could define a suitable URL token scheme,
doing so greatly complicates the pattern matching required to translate an incoming URL to a named route.

Optional parameters are the ideal vehicle for conveying arbitrarily complex information during navigation.
Optional parameters aren't involved in pattern matching and afford flexibility of expression.

The router supports navigation with optional parameters as well as required route parameters.
Define _optional_ parameters in a separate object _after_ you define the required route parameters.

In general, prefer a *required route parameter* when
the value is mandatory (for example, if necessary to distinguish one route path from another);
prefer an *optional parameter* when the value is optional, complex, and/or multivariate.


{@a optionally-selecting}


#### Heroes list: optionally selecting a hero

When navigating to the `HeroDetailComponent` you specified the _required_ `id` of the hero-to-edit in the
*route parameter* and made it the second item of the [_link parameters array_](#link-parameters-array).


<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.ts" linenums="false" header="src/app/heroes/hero-list/hero-list.component.ts (link-parameters-array)" region="link-parameters-array">

</code-example>



The router embedded the `id` value in the navigation URL because you had defined it
as a route parameter with an `:id` placeholder token in the route `path`:


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" linenums="false" header="src/app/heroes/heroes-routing.module.ts (hero-detail-route)" region="hero-detail-route">

</code-example>



When the user clicks the back button, the `HeroDetailComponent` constructs another _link parameters array_
which it uses to navigate back to the `HeroListComponent`.


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (gotoHeroes)" region="gotoHeroes">

</code-example>



This array lacks a route parameter because you had no reason to send information to the `HeroListComponent`.

Now you have a reason. You'd like to send the id of the current hero with the navigation request so that the
`HeroListComponent` can highlight that hero in its list.
This is a _nice-to-have_ feature; the list will display perfectly well without it.

Send the `id` with an object that contains an _optional_ `id` parameter.
For demonstration purposes, there's an extra junk parameter (`foo`) in the object that the `HeroListComponent` should ignore.
Here's the revised navigation statement:


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" linenums="false" header="src/app/heroes/hero-detail/hero-detail.component.ts (go to heroes)" region="gotoHeroes">

</code-example>



The application still works. Clicking "back" returns to the hero list view.

Look at the browser address bar.


It should look something like this, depending on where you run it:


<code-example language="bash">
  localhost:4200/heroes;id=15;foo=foo

</code-example>



The `id` value appears in the URL as (`;id=15;foo=foo`), not in the URL path.
The path for the "Heroes" route doesn't have an `:id` token.

The optional route parameters are not separated by "?" and "&" as they would be in the URL query string.
They are **separated by semicolons ";"**
This is *matrix URL* notation&mdash;something you may not have seen before.


<div class="alert is-helpful">



*Matrix URL* notation is an idea first introduced
in a [1996 proposal](http://www.w3.org/DesignIssues/MatrixURIs.html) by the founder of the web, Tim Berners-Lee.

Although matrix notation never made it into the HTML standard, it is legal and
it became popular among browser routing systems as a way to isolate parameters
belonging to parent and child routes. The Router is such a system and provides
support for the matrix notation across browsers.

The syntax may seem strange to you but users are unlikely to notice or care
as long as the URL can be emailed and pasted into a browser address bar
as this one can.

</div>



{@a route-parameters-activated-route}


### Route parameters in the *ActivatedRoute* service

The list of heroes is unchanged. No hero row is highlighted.


<div class="alert is-helpful">



The <live-example></live-example> *does* highlight the selected
row because it demonstrates the final state of the application which includes the steps you're *about* to cover.
At the moment this guide is describing the state of affairs *prior* to those steps.

</div>



The `HeroListComponent` isn't expecting any parameters at all and wouldn't know what to do with them.
You can change that.

Previously, when navigating from the `HeroListComponent` to the `HeroDetailComponent`,
you subscribed to the route parameter map `Observable` and made it available to the `HeroDetailComponent`
in the `ActivatedRoute` service.
You injected that service in the constructor of the `HeroDetailComponent`.

This time you'll be navigating in the opposite direction, from the `HeroDetailComponent` to the `HeroListComponent`.

First you extend the router import statement to include the `ActivatedRoute` service symbol:


<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" linenums="false" header="src/app/heroes/hero-list/hero-list.component.ts (import)" region="import-router">

</code-example>



Import the `switchMap` operator to perform an operation on the `Observable` of route parameter map.


<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" linenums="false" header="src/app/heroes/hero-list/hero-list.component.ts (rxjs imports)" region="rxjs-imports">

</code-example>



Then you inject the `ActivatedRoute` in the `HeroListComponent` constructor.


<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" linenums="false" header="src/app/heroes/hero-list/hero-list.component.ts (constructor and ngOnInit)" region="ctor">

</code-example>



The `ActivatedRoute.paramMap` property is an `Observable` map of route parameters. The `paramMap` emits a new map of values that includes `id`
when the user navigates to the component. In `ngOnInit` you subscribe to those values, set the `selectedId`, and get the heroes.


Update the template with a [class binding](guide/template-syntax#class-binding).
The binding adds the `selected` CSS class when the comparison returns `true` and removes it when `false`.
Look for it within the repeated `<li>` tag as shown here:


<code-example path="router/src/app/heroes/hero-list/hero-list.component.html" linenums="false" header="src/app/heroes/hero-list/hero-list.component.html">

</code-example>

Add some styles to apply when the list item is selected.

<code-example path="router/src/app/heroes/hero-list/hero-list.component.css" linenums="false" region="selected" header="src/app/heroes/hero-list/hero-list.component.css">

</code-example>



When the user navigates from the heroes list to the "Magneta" hero and back, "Magneta" appears selected:

<figure>
  <img src='generated/images/guide/router/selected-hero.png' alt="Selected List">
</figure>



The optional `foo` route parameter is harmless and continues to be ignored.

### Adding routable animations

{@a route-animation}


#### Adding animations to the routed component
The heroes feature module is almost complete, but what is a feature without some smooth transitions?

This section shows you how to add some [animations](guide/animations) to the `HeroDetailComponent`.

First import the `BrowserAnimationsModule` and add it to the `imports` array:

<code-example path="router/src/app/app.module.ts" linenums="false" header="src/app/app.module.ts (animations-module)" region="animations-module">

</code-example>

Next, add a `data` object to the routes for `HeroListComponent` and `HeroDetailComponent`. Transitions are based on `states` and you'll use the `animation` data from the route to provide a named animation `state` for the transitions.

<code-example path="router/src/app/heroes/heroes-routing.module.2.ts" header="src/app/heroes/heroes-routing.module.ts (animation data)">

</code-example>


Create an `animations.ts` file in the root `src/app/` folder. The contents look like this:

<code-example path="router/src/app/animations.ts" linenums="false" header="src/app/animations.ts (excerpt)">

</code-example>


This file does the following:

* Imports the animation symbols that build the animation triggers, control state, and manage transitions between states.

* Exports a constant named `slideInAnimation` set to an animation trigger named *`routeAnimation`*;

* Defines one *transition* when switching back and forth from the `heroes` and `hero` routes to ease the component in from the left of the screen as it enters the application view (`:enter`), the other to animate the component to the right as it leaves the application view (`:leave`).

You could also create more transitions for other routes. This trigger is sufficient for the current milestone.

Back in the `AppComponent`, import the `RouterOutlet` token from the `@angular/router` package and the `slideInAnimation` from 
`'./animations.ts`.

Add an `animations` array to the `@Component` metadata's that contains the `slideInAnimation`.

<code-example path="router/src/app/app.component.2.ts" linenums="false" header="src/app/app.component.ts (animations)" region="animation-imports">

</code-example>

In order to use the routable animations, you'll need to wrap the `RouterOutlet` inside an element. You'll
use the `@routeAnimation` trigger and bind it to the element.

For the `@routeAnimation` transitions to key off states, you'll need to provide it with the `data` from the `ActivatedRoute`. The `RouterOutlet` is exposed as an `outlet` template variable, so you bind a reference to the router outlet. A variable of `routerOutlet` is an ideal choice.

<code-example path="router/src/app/app.component.2.html" linenums="false" header="src/app/app.component.html (router outlet)">

</code-example>

The `@routeAnimation` property is bound to the `getAnimationData` with the provided `routerOutlet` reference, so you'll need to define that function in the `AppComponent`. The `getAnimationData` function returns the animation property from the `data` provided through the `ActivatedRoute`. The `animation` property matches the `transition` names you used in the `slideDownAnimation` defined in `animations.ts`.

<code-example path="router/src/app/app.component.2.ts" linenums="false" header="src/app/app.component.ts (router outlet)" region="function-binding">

</code-example>

When switching between the two routes, the `HeroDetailComponent` and `HeroListComponent` will ease in from the left when routed to and will slide to the right when navigating away.



{@a milestone-3-wrap-up}


### Milestone 3 wrap up

You've learned how to do the following:

* Organize the app into *feature areas*.
* Navigate imperatively from one component to another.
* Pass information along in route parameters and subscribe to them in the component.
* Import the feature area NgModule into the `AppModule`.
* Applying routable animations based on the page.

After these changes, the folder structure looks like this:


<div class='filetree'>

  <div class='file'>
    angular-router-sample
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          crisis-list
        </div>

          <div class='children'>

            <div class='file'>
              crisis-list.component.css
            </div>

            <div class='file'>
              crisis-list.component.html
            </div>

            <div class='file'>
              crisis-list.component.ts
            </div>

          </div>      

        <div class='file'>
          heroes
        </div>

        <div class='children'>

          <div class='file'>
            hero-detail
          </div>

            <div class='children'>

              <div class='file'>
                hero-detail.component.css
              </div>

              <div class='file'>
                hero-detail.component.html
              </div>

              <div class='file'>
                hero-detail.component.ts
              </div>

            </div>

          <div class='file'>
            hero-list
          </div>

            <div class='children'>

              <div class='file'>
                hero-list.component.css
              </div>

              <div class='file'>
                hero-list.component.html
              </div>

              <div class='file'>
                hero-list.component.ts
              </div>

            </div>

          <div class='file'>
            hero.service.ts
          </div>    

          <div class='file'>
            hero.ts
          </div>

          <div class='file'>
            heroes-routing.module.ts
          </div>    

          <div class='file'>
            heroes.module.ts
          </div>

          <div class='file'>
            mock-heroes.ts
          </div>

        </div>

        <div class='file'>
          page-not-found
        </div>

        <div class='children'>

          <div class='file'>

            page-not-found.component.css

          </div>

          <div class='file'>

            page-not-found.component.html

          </div>

          <div class='file'>

            page-not-found.component.ts

          </div>
          
        </div>

      </div>

      <div class='file'>
        animations.ts
      </div>

      <div class='file'>
        app.component.css
      </div>

      <div class='file'>
        app.component.html
      </div>

      <div class='file'>
        app.component.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

      <div class='file'>
        app-routing.module.ts
      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        message.service.ts
      </div>      

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>

Here are the relevant files for this version of the sample application.

<code-tabs>

  <code-pane header="animations.ts" path="router/src/app/animations.ts">

  </code-pane>  

  <code-pane header="app.component.html" path="router/src/app/app.component.2.html">

  </code-pane>

  <code-pane header="app.component.ts" path="router/src/app/app.component.2.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.3.ts">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.2.ts" region="milestone3">

  </code-pane>

  <code-pane header="hero-list.component.css" path="router/src/app/heroes/hero-list/hero-list.component.css">

  </code-pane>  

  <code-pane header="hero-list.component.html" path="router/src/app/heroes/hero-list/hero-list.component.html">

  </code-pane>  

  <code-pane header="hero-list.component.ts" path="router/src/app/heroes/hero-list/hero-list.component.ts">

  </code-pane>

  <code-pane header="hero-detail.component.html" path="router/src/app/heroes/hero-detail/hero-detail.component.html">

  </code-pane>

  <code-pane header="hero-detail.component.ts" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts">

  </code-pane>

  <code-pane header="hero.service.ts" path="router/src/app/heroes/hero.service.ts">

  </code-pane>

  <code-pane header="heroes.module.ts" path="router/src/app/heroes/heroes.module.ts">

  </code-pane>

  <code-pane header="heroes-routing.module.ts" path="router/src/app/heroes/heroes-routing.module.2.ts">

  </code-pane>

  <code-pane header="message.service.ts" path="router/src/app/message.service.ts">

  </code-pane>  

</code-tabs>



{@a milestone-4}



## Milestone 4: Crisis center feature

It's time to add real features to the app's current placeholder crisis center.

Begin by imitating the heroes feature:

* Create a `crisis-center` subfolder in the `src/app` folder.
* Copy the files and folders from `app/heroes` into the new `crisis-center` folder.
* In the new files, change every mention of "hero" to "crisis", and "heroes" to "crises".
* Rename the NgModule files to `crisis-center.module.ts` and `crisis-center-routing.module.ts`.

You'll use mock crises instead of mock heroes:


<code-example path="router/src/app/crisis-center/mock-crises.ts" header="src/app/crisis-center/mock-crises.ts">

</code-example>


The resulting crisis center is a foundation for introducing a new concept&mdash;**child routing**.
You can leave *Heroes* in its current state as a contrast with the *Crisis Center*
and decide later if the differences are worthwhile.


<div class="alert is-helpful">



In keeping with the
<a href="https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html" title="Separation of Concerns">*Separation of Concerns* principle</a>,
changes to the *Crisis Center* won't affect the `AppModule` or
any other feature's component.

</div>



{@a crisis-child-routes}


### A crisis center with child routes

This section shows you how to organize the crisis center
to conform to the following recommended pattern for Angular applications:

* Each feature area resides in its own folder.
* Each feature has its own Angular feature module.
* Each area has its own area root component.
* Each area root component has its own router outlet and child routes.
* Feature area routes rarely (if ever) cross with routes of other features.

If your app had many feature areas, the app component trees might look like this:


<figure>
  <img src='generated/images/guide/router/component-tree.png' alt="Component Tree">
</figure>



{@a child-routing-component}


### Child routing component

Generate a `CrisisCenter` component in the `crisis-center` folder:

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center
</code-example>

Update the component template to look like this:

<code-example path="router/src/app/crisis-center/crisis-center/crisis-center.component.html" linenums="false" header="src/app/crisis-center/crisis-center/crisis-center.component.html">
</code-example>

The `CrisisCenterComponent` has the following in common with the `AppComponent`:

* It is the *root* of the crisis center area,
just as `AppComponent` is the root of the entire application.
* It is a *shell* for the crisis management feature area,
just as the `AppComponent` is a shell to manage the high-level workflow.

Like most shells, the `CrisisCenterComponent` class is very simple, simpler even than `AppComponent`:
it has no business logic, and its template has no links, just a title and
`<router-outlet>` for the crisis center child component.


{@a child-route-config}


### Child route configuration

As a host page for the "Crisis Center" feature, generate a `CrisisCenterHome` component in the `crisis-center` folder.

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center-home
</code-example>

Update the template with a welcome message to the `Crisis Center`.

<code-example path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html" linenums="false" header="src/app/crisis-center/crisis-center-home/crisis-center-home.component.html">
</code-example>

Update the `crisis-center-routing.module.ts` you renamed after copying it from `heroes-routing.module.ts` file.
This time, you define **child routes** *within* the parent `crisis-center` route.

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" linenums="false" header="src/app/crisis-center/crisis-center-routing.module.ts (Routes)" region="routes">
</code-example>


Notice that the parent `crisis-center` route has a `children` property
with a single route containing the `CrisisListComponent`. The `CrisisListComponent` route
also has a `children` array with two routes.

These two routes navigate to the crisis center child components,
`CrisisCenterHomeComponent` and `CrisisDetailComponent`, respectively.

There are *important differences* in the way the router treats these _child routes_.

The router displays the components of these routes in the `RouterOutlet`
of the `CrisisCenterComponent`, not in the `RouterOutlet` of the `AppComponent` shell.

The `CrisisListComponent` contains the crisis list and a `RouterOutlet` to
display the `Crisis Center Home` and `Crisis Detail` route components.

The `Crisis Detail` route is a child of the `Crisis List`. The router [reuses components](#reuse)
by default, so the `Crisis Detail` component will be re-used as you select different crises.
In contrast, back in the `Hero Detail` route, the component was recreated each time you selected a different hero.

At the top level, paths that begin with `/` refer to the root of the application.
But child routes *extend* the path of the parent route.
With each step down the route tree,
you add a slash followed by the route path, unless the path is _empty_.

Apply that logic to navigation within the crisis center for which the parent path is `/crisis-center`.

* To navigate to the `CrisisCenterHomeComponent`, the full URL is `/crisis-center` (`/crisis-center` + `''` + `''`).

* To navigate to the `CrisisDetailComponent` for a crisis with `id=2`, the full URL is
`/crisis-center/2` (`/crisis-center` + `''` +  `'/2'`).

The absolute URL for the latter example, including the `localhost` origin, is

<code-example>
  localhost:4200/crisis-center/2

</code-example>



Here's the complete `crisis-center-routing.module.ts` file with its imports.


<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" linenums="false" header="src/app/crisis-center/crisis-center-routing.module.ts (excerpt)">

</code-example>



{@a import-crisis-module}


### Import crisis center module into the *AppModule* routes

As with the `HeroesModule`, you must add the `CrisisCenterModule` to the `imports` array of the `AppModule`
_before_ the `AppRoutingModule`:

<code-tabs>

  <code-pane path="router/src/app/crisis-center/crisis-center.module.ts"header="src/app/crisis-center/crisis-center.module.ts">

  </code-pane> 

  <code-pane path="router/src/app/app.module.4.ts" linenums="false" header="src/app/app.module.ts (import CrisisCenterModule)" region="crisis-center-module">

  </code-pane>

</code-tabs>

Remove the initial crisis center route from the `app-routing.module.ts`.
The feature routes are now provided by the `HeroesModule` and the `CrisisCenter` modules.

The `app-routing.module.ts` file retains the top-level application routes such as the default and wildcard routes.


<code-example path="router/src/app/app-routing.module.3.ts" linenums="false" header="src/app/app-routing.module.ts (v3)" region="v3">

</code-example>




{@a relative-navigation}


### Relative navigation

While building out the crisis center feature, you navigated to the
crisis detail route using an **absolute path** that begins with a _slash_.

The router matches such _absolute_ paths to routes starting from the top of the route configuration.

You could continue to use absolute paths like this to navigate inside the *Crisis Center*
feature, but that pins the links to the parent routing structure.
If you changed the parent `/crisis-center` path, you would have to change the link parameters array.

You can free the links from this dependency by defining paths that are **relative** to the current URL segment.
Navigation _within_ the feature area remains intact even if you change the parent route path to the feature.

Here's an example:


<div class="alert is-helpful">



The router supports directory-like syntax in a _link parameters list_ to help guide route name lookup:

`./` or `no leading slash` is relative to the current level.

`../` to go up one level in the route path.

You can combine relative navigation syntax with an ancestor path.
If you must navigate to a sibling route, you could use the `../<sibling>` convention to go up
one level, then over and down the sibling route path.


</div>



To navigate a relative path with the `Router.navigate` method, you must supply the `ActivatedRoute`
to give the router knowledge of where you are in the current route tree.

After the _link parameters array_, add an object with a `relativeTo` property set to the `ActivatedRoute`.
The router then calculates the target URL based on the active route's location.


<div class="alert is-helpful">



**Always** specify the complete _absolute_ path when calling router's `navigateByUrl` method.


</div>



{@a nav-to-crisis}


### Navigate to crisis list with a relative URL

You've already injected the `ActivatedRoute` that you need to compose the relative navigation path.

When using a `RouterLink` to navigate instead of the `Router` service, you'd use the _same_
link parameters array, but you wouldn't provide the object with the `relativeTo` property.
The `ActivatedRoute` is implicit in a `RouterLink` directive.


Update the `gotoCrises` method of the `CrisisDetailComponent` to navigate back to the *Crisis Center* list using relative path navigation.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" linenums="false" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (relative navigation)" region="gotoCrises-navigate">

</code-example>


Notice that the path goes up a level using the `../` syntax.
If the current crisis `id` is `3`, the resulting path back to the crisis list is  `/crisis-center/;id=3;foo=foo`.


{@a named-outlets}



### Displaying multiple routes in named outlets

You decide to give users a way to contact the crisis center.
When a user clicks a "Contact" button, you want to display a message in a popup view.

The popup should stay open, even when switching between pages in the application, until the user closes it
by sending the message or canceling.
Clearly you can't put the popup in the same outlet as the other pages.

Until now, you've defined a single outlet and you've nested child routes
under that outlet to group routes together.
The router only supports one primary _unnamed_ outlet per template.

A template can also have any number of _named_ outlets.
Each named outlet has its own set of routes with their own components.
Multiple outlets can be displaying different content, determined by different routes, all at the same time.

Add an outlet named "popup" in the `AppComponent`, directly below the unnamed outlet.


<code-example path="router/src/app/app.component.4.html" linenums="false" header="src/app/app.component.html (outlets)" region="outlets">

</code-example>



That's where a popup will go, once you learn how to route a popup component to it.


{@a secondary-routes}


#### Secondary routes

Named outlets are the targets of  _secondary routes_.

Secondary routes look like primary routes and you configure them the same way.
They differ in a few key respects.

* They are independent of each other.
* They work in combination with other routes.
* They are displayed in named outlets.

Generate a new component to compose the message.

<code-example language="none" class="code-shell">
  ng generate component compose-message
</code-example>

It displays a simple form with a header, an input box for the message,
and two buttons, "Send" and "Cancel".


<figure>
  <img src='generated/images/guide/router/contact-popup.png' alt="Contact popup">
</figure>



Here's the component, its template and styles:


<code-tabs>

  <code-pane header="src/app/compose-message/compose-message.component.css" path="router/src/app/compose-message/compose-message.component.css">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.html" path="router/src/app/compose-message/compose-message.component.html">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.ts" path="router/src/app/compose-message/compose-message.component.ts">

  </code-pane>

</code-tabs>



It looks about the same as any other component you've seen in this guide.
There are two noteworthy differences.

Note that the `send()` method simulates latency by waiting a second before "sending" the message and closing the popup.

The `closePopup()` method closes the popup view by navigating to the popup outlet with a `null`.
That's a peculiarity covered [below](#clear-secondary-routes).


{@a add-secondary-route}


#### Add a secondary route

Open the `AppRoutingModule` and add a new `compose` route to the `appRoutes`.

<code-example path="router/src/app/app-routing.module.3.ts" linenums="false" header="src/app/app-routing.module.ts (compose route)" region="compose">

</code-example>



The `path` and `component` properties should be familiar.
There's a new property, `outlet`, set to `'popup'`.
This route now targets the popup outlet and the `ComposeMessageComponent` will display there.

The user needs a way to open the popup.
Open the `AppComponent` and add a "Contact" link.

<code-example path="router/src/app/app.component.4.html" linenums="false" header="src/app/app.component.html (contact-link)" region="contact-link">

</code-example>



Although the `compose` route is pinned to the "popup" outlet, that's not sufficient for wiring the route to a `RouterLink` directive.
You have to specify the named outlet in a _link parameters array_ and bind it to the `RouterLink` with a property binding.

The _link parameters array_ contains an object with a single `outlets` property whose value
is another object keyed by one (or more) outlet names.
In this case there is only the "popup" outlet property and its value is another _link parameters array_ that specifies the `compose` route.

You are in effect saying, _when the user clicks this link, display the component associated with the `compose` route in the `popup` outlet_.


<div class="alert is-helpful">



This `outlets` object within an outer object was completely unnecessary
when there was only one route and one _unnamed_ outlet to think about.

The router assumed that your route specification targeted the _unnamed_ primary outlet
and created these objects for you.

Routing to a named outlet has revealed a previously hidden router truth:
you can target multiple outlets with multiple routes in the same `RouterLink` directive.

You're not actually doing that here.
But to target a named outlet, you must use the richer, more verbose syntax.


</div>



{@a secondary-route-navigation}


#### Secondary route navigation: merging routes during navigation
Navigate to the _Crisis Center_ and click "Contact".
you should see something like the following URL in the browser address bar.


<code-example>
  http://.../crisis-center(popup:compose)

</code-example>



The interesting part of the URL follows the `...`:

* The `crisis-center` is the primary navigation.
* Parentheses surround the secondary route.
* The secondary route consists of an outlet name (`popup`), a `colon` separator, and the secondary route path (`compose`).

Click the _Heroes_ link and look at the URL again.


<code-example>
  http://.../heroes(popup:compose)
</code-example>



The primary navigation part has changed; the secondary route is the same.

The router is keeping track of two separate branches in a navigation tree and generating a representation of that tree in the URL.

You can add many more outlets and routes, at the top level and in nested levels, creating a navigation tree with many branches.
The router will generate the URL to go with it.

You can tell the router to navigate an entire tree at once by filling out the `outlets` object mentioned above.
Then pass that object inside a _link parameters array_  to the `router.navigate` method.

Experiment with these possibilities at your leisure.



{@a clear-secondary-routes}


#### Clearing secondary routes
As you've learned, a component in an outlet persists until you navigate away to a new component.
Secondary outlets are no different in this regard.

Each secondary outlet has its own navigation, independent of the navigation driving the primary outlet.
Changing a current route that displays in the primary outlet has no effect on the popup outlet.
That's why the popup stays visible as you navigate among the crises and heroes.

Clicking the "send" or "cancel" buttons _does_ clear the popup view.
To see how, look at the `closePopup()` method again:

<code-example path="router/src/app/compose-message/compose-message.component.ts" linenums="false" header="src/app/compose-message/compose-message.component.ts (closePopup)" region="closePopup">

</code-example>



It navigates imperatively with the `Router.navigate()` method, passing in a [link parameters array](#link-parameters-array).

Like the array bound to the _Contact_ `RouterLink` in the `AppComponent`,
this one includes an object with an `outlets` property.
The `outlets` property value is another object with outlet names for keys.
The only named outlet is `'popup'`.

This time, the value of `'popup'` is `null`. That's not a route, but it is a legitimate value.
Setting the popup `RouterOutlet` to `null` clears the outlet and removes
the secondary popup route from the current URL.

{@a guards}

## Milestone 5: Route guards

At the moment, *any* user can navigate *anywhere* in the application *anytime*.
That's not always the right thing to do.

* Perhaps the user is not authorized to navigate to the target component.
* Maybe the user must login (*authenticate*) first.
* Maybe you should fetch some data before you display the target component.
* You might want to save pending changes before leaving a component.
* You might ask the user if it's OK to discard pending changes rather than save them.

You add _guards_ to the route configuration to handle these scenarios.

A guard's return value controls the router's behavior:

* If it returns `true`, the navigation process continues.
* If it returns `false`, the navigation process stops and the user stays put.
* If it returns a `UrlTree`, the current navigation cancels and a new navigation is initiated to the `UrlTree` returned.


<div class="alert is-helpful">

**Note:** The guard can also tell the router to navigate elsewhere, effectively canceling the current navigation. When
doing so inside a guard, the guard should return `false`;

</div>

The guard *might* return its boolean answer synchronously.
But in many cases, the guard can't produce an answer synchronously.
The guard could ask the user a question, save changes to the server, or fetch fresh data.
These are all asynchronous operations.

Accordingly, a routing guard can return an `Observable<boolean>` or a `Promise<boolean>` and the
router will wait for the observable to resolve to `true` or `false`.

<div class="alert is-critical">

**Note:** The observable provided to the Router _must_ also complete. If the observable does not complete, the navigation will not continue.

</div>

The router supports multiple guard interfaces:

* [`CanActivate`](api/router/CanActivate) to mediate navigation *to* a route.

* [`CanActivateChild`](api/router/CanActivateChild) to mediate navigation *to* a child route.

* [`CanDeactivate`](api/router/CanDeactivate) to mediate navigation *away* from the current route.

* [`Resolve`](api/router/Resolve) to perform route data retrieval *before* route activation.

* [`CanLoad`](api/router/CanLoad) to mediate navigation *to* a feature module loaded _asynchronously_.


You can have multiple guards at every level of a routing hierarchy.
The router checks the `CanDeactivate` and `CanActivateChild` guards first, from the deepest child route to the top.
Then it checks the `CanActivate` guards from the top down to the deepest child route. If the feature module
is loaded asynchronously, the `CanLoad` guard is checked before the module is loaded.
If _any_ guard returns false, pending guards that have not completed will be canceled,
and the entire navigation is canceled.

There are several examples over the next few sections.


{@a can-activate-guard}


### _CanActivate_: requiring authentication

Applications often restrict access to a feature area based on who the user is.
You could permit access only to authenticated users or to users with a specific role.
You might block or limit access until the user's account is activated.

The `CanActivate` guard is the tool to manage these navigation business rules.

#### Add an admin feature module

In this next section, you'll extend the crisis center with some new *administrative* features.
Those features aren't defined yet.
But you can start by adding a new feature module named `AdminModule`.

Generate an `admin` folder with a feature module file and a routing configuration file.

<code-example language="none" class="code-shell">
  ng generate module admin --routing
</code-example>

Next, generate the supporting components.

<code-example language="none" class="code-shell">
  ng generate component admin/admin-dashboard
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/admin
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/manage-crises
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/manage-heroes
</code-example>

The admin feature file structure looks like this:


<div class='filetree'>

  <div class='file'>
    src/app/admin
  </div>

  <div class='children'>

    <div class='file'>
      admin
    </div>

      <div class='children'>

        <div class='file'>
          admin.component.css
        </div>

        <div class='file'>
          admin.component.html
        </div>

        <div class='file'>
          admin.component.ts
        </div>

      </div>

    <div class='file'>
      admin-dashboard
    </div>

      <div class='children'>

        <div class='file'>
          admin-dashboard.component.css
        </div>

        <div class='file'>
          admin-dashboard.component.html
        </div>

        <div class='file'>
          admin-dashboard.component.ts
        </div>

      </div>

    <div class='file'>
      manage-crises
    </div>

      <div class='children'>

        <div class='file'>
          manage-crises.component.css
        </div>

        <div class='file'>
          manage-crises.component.html
        </div>

        <div class='file'>
          manage-crises.component.ts
        </div>

      </div>

    <div class='file'>
      manage-heroes
    </div>

      <div class='children'>

        <div class='file'>
          manage-heroes.component.css
        </div>

        <div class='file'>
          manage-heroes.component.html
        </div>

        <div class='file'>
          manage-heroes.component.ts
        </div>

      </div>

    <div class='file'>
      admin.module.ts
    </div>

    <div class='file'>
      admin-routing.module.ts
    </div>

  </div>

</div>



The admin feature module contains the `AdminComponent` used for routing within the
feature module, a dashboard route and two unfinished components to manage crises and heroes.


<code-tabs>

  <code-pane header="src/app/admin/admin/admin.component.html" linenums="false"  path="router/src/app/admin/admin/admin.component.html">

  </code-pane>

  <code-pane header="src/app/admin/admin-dashboard/admin-dashboard.component.html" linenums="false" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.html">

  </code-pane>

  <code-pane header="src/app/admin/admin.module.ts" path="router/src/app/admin/admin.module.ts">

  </code-pane>

  <code-pane header="src/app/admin/manage-crises/manage-crises.component.html" linenums="false" path="router/src/app/admin/manage-crises/manage-crises.component.html">

  </code-pane>

  <code-pane header="src/app/admin/manage-heroes/manage-heroes.component.html" linenums="false"  path="router/src/app/admin/manage-heroes/manage-heroes.component.html">

  </code-pane>

</code-tabs>



<div class="alert is-helpful">



Although the admin dashboard `RouterLink` only contains a relative slash without an additional URL segment, it
is considered a match to any route within the admin feature area. You only want the `Dashboard` link to be active when the user visits that route. Adding an additional binding to the `Dashboard` routerLink,`[routerLinkActiveOptions]="{ exact: true }"`, marks the `./` link as active when the user navigates to the `/admin` URL and not when navigating to any of the child routes.


</div>


{@a component-less-route}


##### Component-less route: grouping routes without a component

The initial admin routing configuration:


<code-example path="router/src/app/admin/admin-routing.module.1.ts" linenums="false" header="src/app/admin/admin-routing.module.ts (admin routing)" region="admin-routes">

</code-example>

Looking at the child route under the `AdminComponent`, there is a `path` and a `children`
property but it's not using a `component`.
You haven't made a mistake in the configuration.
You've defined a _component-less_ route.

The goal is to group the `Crisis Center` management routes under the `admin` path.
You don't need a component to do it.
A _component-less_ route makes it easier to [guard child routes](#can-activate-child-guard).


Next, import the `AdminModule` into `app.module.ts` and add it to the `imports` array
to register the admin routes.


<code-example path="router/src/app/app.module.4.ts" linenums="false" header="src/app/app.module.ts (admin module)" region="admin-module">

</code-example>



Add an "Admin" link to the `AppComponent` shell so that users can get to this feature.


<code-example path="router/src/app/app.component.5.html" linenums="false" header="src/app/app.component.html (template)">

</code-example>



{@a guard-admin-feature}


#### Guard the admin feature

Currently every route within the *Crisis Center* is open to everyone.
The new *admin* feature should be accessible only to authenticated users.

You could hide the link until the user logs in. But that's tricky and difficult to maintain.

Instead you'll write a `canActivate()` guard method to redirect anonymous users to the
login page when they try to enter the admin area.

This is a general purpose guard&mdash;you can imagine other features
that require authenticated users&mdash;so you generate an
`AuthGuard` in the `auth` folder.

<code-example language="none" class="code-shell">
  ng generate guard auth/auth
</code-example>

At the moment you're interested in seeing how guards work so the first version does nothing useful.
It simply logs to console and `returns` true immediately, allowing navigation to proceed:


<code-example path="router/src/app/auth/auth.guard.1.ts" linenums="false" header="src/app/auth/auth.guard.ts (excerpt)">

</code-example>



Next, open `admin-routing.module.ts `, import the `AuthGuard` class, and
update the admin route with a `canActivate` guard property that references it:


<code-example path="router/src/app/admin/admin-routing.module.2.ts" linenums="false" header="src/app/admin/admin-routing.module.ts (guarded admin route)" region="admin-route">

</code-example>


 
The admin feature is now protected by the guard, albeit protected poorly.


{@a teach-auth}


#### Teach *AuthGuard* to authenticate

Make the `AuthGuard` at least pretend to authenticate.

The `AuthGuard` should call an application service that can login a user and retain information about the current user. Generate a new `AuthService` in the `auth` folder:

<code-example language="none" class="code-shell">
  ng generate service auth/auth
</code-example>

Update the `AuthService` to log in the user:

<code-example path="router/src/app/auth/auth.service.ts" linenums="false" header="src/app/auth/auth.service.ts (excerpt)">

</code-example>



Although it doesn't actually log in, it has what you need for this discussion.
It has an `isLoggedIn` flag to tell you whether the user is authenticated.
Its `login` method simulates an API call to an external service by returning an
observable that resolves successfully after a short pause.
The `redirectUrl` property will store the attempted URL so you can navigate to it after authenticating.

Revise the `AuthGuard` to call it.


<code-example path="router/src/app/auth/auth.guard.2.ts" linenums="false" header="src/app/auth/auth.guard.ts (v2)">

</code-example>



Notice that you *inject* the `AuthService` and the `Router` in the constructor.
You haven't provided the `AuthService` yet but it's good to know that you can inject helpful services into routing guards.

This guard returns a synchronous boolean result.
If the user is logged in, it returns true and the navigation continues.

The `ActivatedRouteSnapshot` contains the _future_ route that will be activated and the `RouterStateSnapshot`
contains the _future_ `RouterState` of the application, should you pass through the guard check.

If the user is not logged in, you store the attempted URL the user came from using the `RouterStateSnapshot.url` and
tell the router to navigate to a login page&mdash;a page you haven't created yet.
This secondary navigation automatically cancels the current navigation; `checkLogin()` returns
`false` just to be clear about that.


{@a add-login-component}


#### Add the *LoginComponent*

You need a `LoginComponent` for the user to log in to the app. After logging in, you'll redirect
to the stored URL if available, or use the default URL.
There is nothing new about this component or the way you wire it into the router configuration.

<code-example language="none" class="code-shell">
  ng generate component auth/login
</code-example>

Register a `/login` route in the `auth/auth-routing.module.ts`. In `app.module.ts`, import and add the `AuthModule` to the `AppModule` imports.


<code-tabs>

  <code-pane header="src/app/app.module.ts" path="router/src/app/app.module.ts" region="auth">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.html" path="router/src/app/auth/login/login.component.html">

  </code-pane>  

  <code-pane header="src/app/auth/login/login.component.ts" path="router/src/app/auth/login/login.component.1.ts">

  </code-pane>

  <code-pane header="src/app/auth/auth.module.ts" path="router/src/app/auth/auth.module.ts">

  </code-pane>

</code-tabs>


{@a can-activate-child-guard}


### _CanActivateChild_: guarding child routes

You can also protect child routes with the `CanActivateChild` guard.
The `CanActivateChild` guard is similar to the `CanActivate` guard.
The key difference is that it runs _before_  any child route is activated.

You protected the admin feature module from unauthorized access.
You should also protect child routes _within_ the feature module.

Extend the `AuthGuard` to protect when navigating between the `admin` routes.
Open `auth.guard.ts` and add the `CanActivateChild` interface to the imported tokens from the router package.

Next, implement the `canActivateChild()` method which takes the same arguments as the `canActivate()` method:
an `ActivatedRouteSnapshot` and `RouterStateSnapshot`.
The `canActivateChild()` method can return an `Observable<boolean>` or `Promise<boolean>` for
async checks and a `boolean` for sync checks.
This one returns a `boolean`:


<code-example path="router/src/app/auth/auth.guard.3.ts" linenums="false" header="src/app/auth/auth.guard.ts (excerpt)" region="can-activate-child">

</code-example>



Add the same `AuthGuard` to the `component-less` admin route to protect all other child routes at one time
instead of adding the `AuthGuard` to each route individually.


<code-example path="router/src/app/admin/admin-routing.module.3.ts" linenums="false" header="src/app/admin/admin-routing.module.ts (excerpt)" region="can-activate-child">

</code-example>



{@a can-deactivate-guard}


### _CanDeactivate_: handling unsaved changes
Back in the "Heroes" workflow, the app accepts every change to a hero immediately without hesitation or validation.

In the real world, you might have to accumulate the users changes.
You might have to validate across fields.
You might have to validate on the server.
You might have to hold changes in a pending state until the user confirms them *as a group* or
cancels and reverts all changes.

What do you do about unapproved, unsaved changes when the user navigates away?
You can't just leave and risk losing the user's changes; that would be a terrible experience.

It's better to pause and let the user decide what to do.
If the user cancels, you'll stay put and allow more changes.
If the user approves, the app can save.

You still might delay navigation until the save succeeds.
If you let the user move to the next screen immediately and
the save were to fail (perhaps the data are ruled invalid), you would lose the context of the error.

You can't block while waiting for the server&mdash;that's not possible in a browser.
You need to stop the navigation while you wait, asynchronously, for the server
to return with its answer.

You need the `CanDeactivate` guard.

{@a cancel-save}


#### Cancel and save

The sample application doesn't talk to a server.
Fortunately, you have another way to demonstrate an asynchronous router hook.

Users update crisis information in the `CrisisDetailComponent`.
Unlike the `HeroDetailComponent`, the user changes do not update the crisis entity immediately.
Instead, the app updates the entity when the user presses the *Save* button and
discards the changes when the user presses the *Cancel* button.

Both buttons navigate back to the crisis list after save or cancel.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" linenums="false" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (cancel and save methods)" region="cancel-save">

</code-example>



What if the user tries to navigate away without saving or canceling?
The user could push the browser back button or click the heroes link.
Both actions trigger a navigation.
Should the app save or cancel automatically?

This demo does neither. Instead, it asks the user to make that choice explicitly
in a confirmation dialog box that *waits asynchronously for the user's
answer*.

<div class="alert is-helpful">



You could wait for the user's answer with synchronous, blocking code.
The app will be more responsive&mdash;and can do other work&mdash;by
waiting for the user's answer asynchronously. Waiting for the user asynchronously
is like waiting for the server asynchronously.

</div>



Generate a `Dialog` service to handle user confirmation.

<code-example language="none" class="code-shell">
  ng generate service dialog
</code-example>

Add a `confirm()` method to the `DialogService` to prompt the user to confirm their intent. The `window.confirm` is a _blocking_ action that displays a modal dialog and waits for user interaction.

<code-example path="router/src/app/dialog.service.ts" header="src/app/dialog.service.ts">

</code-example>

It returns an `Observable` that *resolves* when the user eventually decides what to do: either
to discard changes and navigate away (`true`) or to preserve the pending changes and stay in the crisis editor (`false`).


{@a CanDeactivate}


Generate a _guard_ that checks for the presence of a `canDeactivate()` method in a component&mdash;any component.

<code-example language="none" class="code-shell">
  ng generate guard can-deactivate
</code-example>

The `CrisisDetailComponent` will have this method.
But the guard doesn't have to know that.
The guard shouldn't know the details of any component's deactivation method.
It need only detect that the component has a `canDeactivate()` method and call it.
This approach makes the guard reusable.


<code-example path="router/src/app/can-deactivate.guard.ts" header="src/app/can-deactivate.guard.ts">

</code-example>



Alternatively, you could make a component-specific `CanDeactivate` guard for the `CrisisDetailComponent`.
The `canDeactivate()` method provides you with the current
instance of the `component`, the current `ActivatedRoute`,
and `RouterStateSnapshot` in case you needed to access
some external information. This would be useful if you only
wanted to use this guard for this component and needed to get
the component's properties or confirm whether the router should allow navigation away from it.


<code-example path="router/src/app/can-deactivate.guard.1.ts" linenums="false" header="src/app/can-deactivate.guard.ts (component-specific)">

</code-example>



Looking back at the `CrisisDetailComponent`, it implements the confirmation workflow for unsaved changes.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" linenums="false" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (excerpt)" region="canDeactivate">

</code-example>



Notice that the `canDeactivate()` method *can* return synchronously;
it returns `true` immediately if there is no crisis or there are no pending changes.
But it can also return a `Promise` or an `Observable` and the router will wait for that
to resolve to truthy (navigate) or falsy (stay put).


Add the `Guard` to the crisis detail route in `crisis-center-routing.module.ts` using the `canDeactivate` array property.


<code-example path="router/src/app/crisis-center/crisis-center-routing.module.3.ts" linenums="false" header="src/app/crisis-center/crisis-center-routing.module.ts (can deactivate guard)">

</code-example>


Now you have given the user a safeguard against unsaved changes.
{@a Resolve}

{@a resolve-guard}


### _Resolve_: pre-fetching component data

In the `Hero Detail` and `Crisis Detail`, the app waited until the route was activated to fetch the respective hero or crisis.

This worked well, but there's a better way.
If you were using a real world API, there might be some delay before the data to display is returned from the server.
You don't want to display a blank component while waiting for the data.

It's preferable to pre-fetch data from the server so it's ready the
moment the route is activated. This also allows you to handle errors before routing to the component.
There's no point in navigating to a crisis detail for an `id` that doesn't have a record.
It'd be better to send the user back to the `Crisis List` that shows only valid crisis centers.

In summary, you want to delay rendering the routed component until all necessary data have been fetched.

You need a *resolver*.


{@a fetch-before-navigating}


#### Fetch data before navigating

At the moment, the `CrisisDetailComponent` retrieves the selected crisis.
If the crisis is not found, it navigates back to the crisis list view.

The experience might be better if all of this were handled first, before the route is activated.
A `CrisisDetailResolver` service could retrieve a `Crisis` or navigate away if the `Crisis` does not exist
_before_ activating the route and creating the `CrisisDetailComponent`.

Generate a `CrisisDetailResolver` service file within the `Crisis Center` feature area.

<code-example language="none" class="code-shell">
  ng generate service crisis-center/crisis-detail-resolver
</code-example>


<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.1.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts (generated)">

</code-example>



Take the relevant parts of the crisis retrieval logic in `CrisisDetailComponent.ngOnInit`
and move them into the `CrisisDetailResolverService`.
Import the `Crisis` model, `CrisisService`, and the `Router`
so you can navigate elsewhere if you can't fetch the crisis.

Be explicit. Implement the `Resolve` interface with a type of `Crisis`.

Inject the `CrisisService` and `Router` and implement the `resolve()` method.
That method could return a `Promise`, an `Observable`, or a synchronous return value.

The `CrisisService.getCrisis` method returns an observable, in order to prevent the route from loading until the data is fetched.
The `Router` guards require an observable to `complete`, meaning it has emitted all
of its values. You use the `take` operator with an argument of `1` to ensure that the
Observable completes after retrieving the first value from the Observable returned by the
`getCrisis` method.

If it doesn't return a valid `Crisis`, return an empty `Observable`, canceling the previous in-flight navigation to the `CrisisDetailComponent` and navigate the user back to the `CrisisListComponent`. The update resolver service looks like this:

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts">

</code-example>

Import this resolver in the `crisis-center-routing.module.ts`
and add a `resolve` object to the `CrisisDetailComponent` route configuration.


<code-example path="router/src/app/crisis-center/crisis-center-routing.module.4.ts" linenums="false" header="src/app/crisis-center/crisis-center-routing.module.ts (resolver)">

</code-example>



The `CrisisDetailComponent` should no longer fetch the crisis.
Update the `CrisisDetailComponent` to get the crisis from the  `ActivatedRoute.data.crisis` property instead;
that's where you said it should be when you re-configured the route.
It will be there when the `CrisisDetailComponent` ask for it.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" linenums="false" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (ngOnInit v2)" region="ngOnInit">

</code-example>



**Two critical points**

1. The router's `Resolve` interface is optional.
The `CrisisDetailResolverService` doesn't inherit from a base class.
The router looks for that method and calls it if found.

1. Rely on the router to call the resolver.
Don't worry about all the ways that the user  could navigate away.
That's the router's job. Write this class and let the router take it from there.

The relevant *Crisis Center* code for this milestone follows.


<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.html">

  </code-pane>

  <code-pane header="crisis-center-home.component.html" path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html">

  </code-pane>

  <code-pane header="crisis-center.component.html" path="router/src/app/crisis-center/crisis-center/crisis-center.component.html">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.4.ts">

  </code-pane>

  <code-pane header="crisis-list.component.html" path="router/src/app/crisis-center/crisis-list/crisis-list.component.html">

  </code-pane>

  <code-pane header="crisis-list.component.ts" path="router/src/app/crisis-center/crisis-list/crisis-list.component.ts">

  </code-pane>

  <code-pane header="crisis-detail.component.html" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.html">

  </code-pane>

  <code-pane header="crisis-detail.component.ts" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts">

  </code-pane>

  <code-pane header="crisis-detail-resolver.service.ts" path="router/src/app/crisis-center/crisis-detail-resolver.service.ts">

  </code-pane>

  <code-pane header="crisis.service.ts" path="router/src/app/crisis-center/crisis.service.ts">

  </code-pane>

  <code-pane header="dialog.service.ts" path="router/src/app/dialog.service.ts">

  </code-pane>

</code-tabs>

Guards

<code-tabs>

  <code-pane header="auth.guard.ts" path="router/src/app/auth/auth.guard.3.ts">

  </code-pane>

  <code-pane header="can-deactivate.guard.ts" path="router/src/app/can-deactivate.guard.ts">

  </code-pane>

</code-tabs>



{@a query-parameters}


{@a fragment}


### Query parameters and fragments

In the [route parameters](#optional-route-parameters) example, you only dealt with parameters specific to
the route, but what if you wanted optional parameters available to all routes?
This is where query parameters come into play.

[Fragments](https://en.wikipedia.org/wiki/Fragment_identifier) refer to certain elements on the page
identified with an `id` attribute.

Update the `AuthGuard` to provide a `session_id` query that will remain after navigating to another route.

Add an `anchor` element so you can jump to a certain point on the page.

Add the `NavigationExtras` object to the `router.navigate` method that navigates you to the `/login` route.


<code-example path="router/src/app/auth/auth.guard.4.ts" linenums="false" header="src/app/auth/auth.guard.ts (v3)">

</code-example>



You can also preserve query parameters and fragments across navigations without having to provide them
again when navigating. In the `LoginComponent`, you'll add an *object* as the
second argument in the `router.navigate` function
and provide the `queryParamsHandling` and `preserveFragment` to pass along the current query parameters
and fragment to the next route.


<code-example path="router/src/app/auth/login/login.component.ts" linenums="false" header="src/app/auth/login/login.component.ts (preserve)" region="preserve">

</code-example>

<div class="alert is-helpful">


The `queryParamsHandling` feature also provides a `merge` option, which will preserve and combine the current query parameters with any provided query parameters
when navigating.


</div>



As you'll be navigating to the *Admin Dashboard* route after logging in, you'll update it to handle the
query parameters and fragment.


<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.ts" linenums="false" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (v2)">

</code-example>



*Query parameters* and *fragments* are also available through the `ActivatedRoute` service.
Just like *route parameters*, the query parameters and fragments are provided as an `Observable`.
The updated *Crisis Admin* component feeds the `Observable` directly into the template using the `AsyncPipe`.


Now, you can click on the *Admin* button, which takes you to the *Login*
page with the provided `queryParamMap` and `fragment`. After you click the login button, notice that
you have been redirected to the `Admin Dashboard` page with the query parameters and fragment still intact in the address bar.

You can use these persistent bits of information for things that need to be provided across pages like
authentication tokens or session ids.


<div class="alert is-helpful">



The `query params` and `fragment` can also be preserved using a `RouterLink` with
the `queryParamsHandling` and `preserveFragment` bindings respectively.


</div>


{@a asynchronous-routing}

## Milestone 6: Asynchronous routing

As you've worked through the milestones, the application has naturally gotten larger.
As you continue to build out feature areas, the overall application size will continue to grow.
At some point you'll reach a tipping point where the application takes a long time to load.

How do you combat this problem?  With asynchronous routing, which loads feature modules _lazily_, on request.
Lazy loading has multiple benefits.

* You can load feature areas only when requested by the user.
* You can speed up load time for users that only visit certain areas of the application.
* You can continue expanding lazy loaded feature areas without increasing the size of the initial load bundle.

You're already part of the way there.
By organizing the application into modules&mdash;`AppModule`,
`HeroesModule`, `AdminModule` and `CrisisCenterModule`&mdash;you
have natural candidates for lazy loading.

Some modules, like `AppModule`, must be loaded from the start.
But others can and should be lazy loaded.
The `AdminModule`, for example, is needed by a few authorized users, so
you should only load it when requested by the right people.


{@a lazy-loading-route-config}


### Lazy Loading route configuration

Change the `admin` **path** in the `admin-routing.module.ts` from `'admin'` to an empty string, `''`, the _empty path_.

The `Router` supports  *empty path* routes;
use them to group routes together without adding any additional path segments to the URL.
Users will still visit `/admin` and the `AdminComponent` still serves as the *Routing Component* containing child routes.

Open the `AppRoutingModule` and add a new `admin` route to its `appRoutes` array.

Give it a `loadChildren` property instead of a `children` property, set to the address of the `AdminModule`.
The address is the `AdminModule` file location (relative to the app root),
followed by a `#` separator, followed by the name of the exported module class, `AdminModule`.


<code-example path="router/src/app/app-routing.module.5.ts" region="admin-1" header="app-routing.module.ts (load children)">

</code-example>

<div class="alert is-important">

*Note*: When using absolute paths, the `NgModule` file location must begin with `src/app` in order to resolve correctly. For custom [path mapping with absolute paths](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping), the `baseUrl` and `paths` properties in the project `tsconfig.json` must be configured.

</div>


When the router navigates to this route, it uses the `loadChildren` string to dynamically load the `AdminModule`.
Then it adds the `AdminModule` routes to its current route configuration.
Finally, it loads the requested route to the destination admin component.

The lazy loading and re-configuration happen just once, when the route is _first_ requested;
the module and routes are available immediately for subsequent requests.


<div class="alert is-helpful">



Angular provides a built-in module loader that supports SystemJS to load modules asynchronously. If you were
using another bundling tool, such as Webpack, you would use the Webpack mechanism for asynchronously loading modules.


</div>



Take the final step and detach the admin feature set from the main application.
The root `AppModule` must neither load nor reference the `AdminModule` or its files.

In `app.module.ts`, remove the `AdminModule` import statement from the top of the file
and remove the `AdminModule` from the NgModule's `imports` array.


{@a can-load-guard}


### _CanLoad_ Guard: guarding unauthorized loading of feature modules

You're already protecting the `AdminModule` with a `CanActivate` guard that prevents unauthorized users from
accessing the admin feature area.
It redirects to the  login page if the user is not authorized.

But the router is still loading the `AdminModule` even if the user can't visit any of its components.
Ideally, you'd only load the `AdminModule` if the user is logged in.

Add a **`CanLoad`** guard that only loads the `AdminModule` once the user is logged in _and_ attempts to access the admin feature area.

The existing `AuthGuard` already has the essential logic in
its `checkLogin()` method to support the `CanLoad` guard.

Open `auth.guard.ts`.
Import the `CanLoad` interface from `@angular/router`.
Add it to the `AuthGuard` class's `implements` list.
Then implement `canLoad()` as follows:


<code-example path="router/src/app/auth/auth.guard.ts" linenums="false" header="src/app/auth/auth.guard.ts (CanLoad guard)" region="canLoad">

</code-example>



The router sets the `canLoad()` method's `route` parameter to the intended destination URL.
The `checkLogin()` method redirects to that URL once the user has logged in.

Now import the `AuthGuard` into the `AppRoutingModule` and add the `AuthGuard` to the `canLoad`
array property for the `admin` route.
The completed admin route looks like this:


<code-example path="router/src/app/app-routing.module.5.ts" region="admin" header="app-routing.module.ts (lazy admin route)">

</code-example>



{@a preloading}


### Preloading: background loading of feature areas
You've learned how to load modules on-demand.
You can also load modules asynchronously with _preloading_.

This may seem like what the app has been doing all along. Not quite.
The `AppModule` is loaded when the application starts; that's _eager_ loading.
Now the `AdminModule` loads only when the user clicks on a link; that's _lazy_ loading.

_Preloading_ is something in between.
Consider the _Crisis Center_.
It isn't the first view that a user sees.
By default, the _Heroes_ are the first view.
For the smallest initial payload and fastest launch time,
you should eagerly load the `AppModule` and the `HeroesModule`.

You could lazy load the _Crisis Center_.
But you're almost certain that the user will visit the _Crisis Center_ within minutes of launching the app.
Ideally, the app would launch with just the `AppModule` and the `HeroesModule` loaded
and then, almost immediately, load the `CrisisCenterModule` in the background.
By the time the user navigates to the _Crisis Center_, its module will have been loaded and ready to go.

That's _preloading_.


{@a how-preloading}


#### How preloading works

After each _successful_ navigation, the router looks in its configuration for an unloaded module that it can preload.
Whether it preloads a module, and which modules it preloads, depends upon the *preload strategy*.

The `Router` offers two preloading strategies out of the box:

* No preloading at all which is the default. Lazy loaded feature areas are still loaded on demand.
* Preloading of all lazy loaded feature areas.

Out of the box, the router either never preloads, or preloads every lazy load module.
The `Router` also supports [custom preloading strategies](#custom-preloading) for
fine control over which modules to preload and when.

In this next section, you'll update the `CrisisCenterModule` to load lazily
by default and use the `PreloadAllModules` strategy
to load it (and _all other_ lazy loaded modules) as soon as possible.


{@a lazy-load-crisis-center}


#### Lazy load the _crisis center_

Update the route configuration to lazy load the `CrisisCenterModule`.
Take the same steps you used to configure `AdminModule` for lazy load.

1. Change the `crisis-center` path in the `CrisisCenterRoutingModule` to an empty string.

1. Add a `crisis-center` route to the `AppRoutingModule`.

1. Set the `loadChildren` string to load the `CrisisCenterModule`.

1. Remove all mention of the `CrisisCenterModule` from `app.module.ts`.


Here are the updated modules _before enabling preload_:


<code-tabs>

  <code-pane header="app.module.ts" path="router/src/app/app.module.ts" region="preload">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.6.ts" region="preload-v1">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.ts">

  </code-pane>

</code-tabs>



You could try this now and confirm that the  `CrisisCenterModule` loads after you click the "Crisis Center" button.

To enable preloading of all lazy loaded modules, import the `PreloadAllModules` token from the Angular router package.

The second argument in the `RouterModule.forRoot` method takes an object for additional configuration options.
The `preloadingStrategy` is one of those options.
Add the `PreloadAllModules` token to the `forRoot` call:

<code-example path="router/src/app/app-routing.module.6.ts" linenums="false" header="src/app/app-routing.module.ts (preload all)" region="forRoot">

</code-example>



This tells the `Router` preloader to immediately load _all_ lazy loaded routes (routes with a `loadChildren` property).

When you visit `http://localhost:4200`, the `/heroes` route loads immediately upon launch
and the router starts loading the `CrisisCenterModule` right after the `HeroesModule` loads.

Surprisingly, the `AdminModule` does _not_ preload. Something is blocking it.


{@a preload-canload}


#### CanLoad blocks preload

The `PreloadAllModules` strategy does not load feature areas protected by a [CanLoad](#can-load-guard) guard.
This is by design.

You added a `CanLoad` guard to the route in the `AdminModule` a few steps back
to block loading of that module until the user is authorized.
That `CanLoad` guard takes precedence over the preload strategy.

If you want to preload a module _and_ guard against unauthorized access,
drop the `canLoad()` guard method and rely on the [canActivate()](#can-activate-guard) guard alone.


{@a custom-preloading}


### Custom Preloading Strategy

Preloading every lazy loaded modules works well in many situations,
but it isn't always the right choice, especially on mobile devices and over low bandwidth connections.
You may choose to preload only certain feature modules, based on user metrics and other business and technical factors.

You can control what and how the router preloads with a custom preloading strategy.

In this section, you'll add a custom strategy that _only_ preloads routes whose `data.preload` flag is set to `true`.
Recall that you can add anything to the `data` property of a route.

Set the `data.preload` flag in the `crisis-center` route in the `AppRoutingModule`.


<code-example path="router/src/app/app-routing.module.ts" linenums="false" header="src/app/app-routing.module.ts (route data preload)" region="preload-v2">

</code-example>

Generate a new `SelectivePreloadingStrategy` service.

<code-example language="none" class="code-shell">
  ng generate service selective-preloading-strategy
</code-example>


<code-example path="router/src/app/selective-preloading-strategy.service.ts" linenums="false" header="src/app/selective-preloading-strategy.service.ts (excerpt)">

</code-example>



`SelectivePreloadingStrategyService` implements the `PreloadingStrategy`, which has one method, `preload`.

The router calls the `preload` method with two arguments:

1. The route to consider.
1. A loader function that can load the routed module asynchronously.

An implementation of `preload` must return an `Observable`.
If the route should preload, it returns the observable returned by calling the loader function.
If the route should _not_ preload, it returns an `Observable` of `null`.

In this sample, the  `preload` method loads the route if the route's `data.preload` flag is truthy.

It also has a side-effect.
`SelectivePreloadingStrategyService` logs the `path` of a selected route in its public `preloadedModules` array.

Shortly, you'll extend the `AdminDashboardComponent` to inject this service and display its `preloadedModules` array.

But first, make a few changes to the `AppRoutingModule`.

1. Import `SelectivePreloadingStrategyService` into `AppRoutingModule`.
1. Replace the `PreloadAllModules` strategy in the call to `forRoot` with this `SelectivePreloadingStrategyService`.
1. Add the `SelectivePreloadingStrategyService` strategy to the `AppRoutingModule` providers array so it can be injected
elsewhere in the app.

Now edit the `AdminDashboardComponent` to display the log of preloaded routes.

1. Import the `SelectivePreloadingStrategyService`.
1. Inject it into the dashboard's constructor.
1. Update the template to display the strategy service's `preloadedModules` array.

When you're done it looks like this.


<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.ts" linenums="false" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (preloaded modules)">

</code-example>



Once the application loads the initial route, the `CrisisCenterModule` is preloaded.
Verify this by logging in to the `Admin` feature area and noting that the `crisis-center` is listed in the `Preloaded Modules`.
It's also logged to the browser's console.


{@a redirect-advanced}

## Migrating URLs with Redirects

You've setup the routes for navigating around your application. You've used navigation imperatively and declaratively to many different routes. But like any application, requirements change over time. You've setup links and navigation to `/heroes` and `/hero/:id` from the `HeroListComponent` and `HeroDetailComponent` components. If there was a requirement that links to `heroes` become `superheroes`, you still want the previous URLs to navigate correctly. You also don't want to go and update every link in your application, so redirects makes refactoring routes trivial.


{@a url-refactor}

### Changing /heroes to /superheroes

Let's take the `Hero` routes and migrate them to new URLs. The `Router` checks for redirects in your configuration before navigating, so each redirect is triggered when needed. To support this change, you'll add redirects from the old routes to the new routes in the `heroes-routing.module`.

<code-example path="router/src/app/heroes/heroes-routing.module.ts" linenums="false" header="src/app/heroes/heroes-routing.module.ts (heroes redirects)">

</code-example>


You'll notice two different types of redirects. The first change is from  `/heroes` to `/superheroes` without any parameters. This is a straightforward redirect, unlike the change from `/hero/:id` to `/superhero/:id`, which includes the `:id` route parameter. Router redirects also use powerful pattern matching, so the `Router` inspects the URL and replaces route parameters in the `path` with their appropriate destination. Previously, you navigated to a URL such as `/hero/15` with a route parameter `id` of `15`.

<div class="alert is-helpful">

The `Router` also supports [query parameters](#query-parameters) and the [fragment](#fragment) when using redirects.

* When using absolute redirects, the `Router` will use the query parameters and the fragment from the redirectTo in the route config.
* When using relative redirects, the `Router` use the query params and the fragment from the source URL.

</div>

Before updating the `app-routing.module.ts`, you'll need to consider an important rule. Currently, our empty path route redirects to `/heroes`, which redirects to `/superheroes`. This _won't_ work and is by design as the `Router` handles redirects once at each level of routing configuration. This prevents chaining of redirects, which can lead to endless redirect loops.

So instead, you'll update the empty path route in `app-routing.module.ts` to redirect to `/superheroes`.

<code-example path="router/src/app/app-routing.module.ts" linenums="false" header="src/app/app-routing.module.ts (superheroes redirect)">

</code-example>

`RouterLink`s aren't tied to route configuration, so you'll need to update the associated router links so they remain active when the new route is active. You'll update the `app.component.ts` template for the `/heroes` routerLink.

<code-example path="router/src/app/app.component.html" linenums="false" header="src/app/app.component.html (superheroes active routerLink)">

</code-example>

Update the `goToHeroes()` method in the `hero-detail.component.ts` to navigate back to `/superheroes` with the optional route parameters.

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" linenums="false" region="redirect" header="src/app/heroes/hero-detail/hero-detail.component.ts (goToHeroes)">

</code-example>

With the redirects setup, all previous routes now point to their new destinations and both URLs still function as intended.


{@a inspect-config}



## Inspect the router's configuration

You put a lot of effort into configuring the router in several routing module files
and were careful to list them [in the proper order](#routing-module-order).
Are routes actually evaluated as you planned?
How is the router really configured?

You can inspect the router's current configuration any time by injecting it and
examining its `config` property.
For example, update the `AppModule` as follows and look in the browser console window
to see the finished route configuration.

<code-example path="router/src/app/app.module.7.ts" linenums="false" header="src/app/app.module.ts (inspect the router config)" region="inspect-config">

</code-example>


{@a final-app}


## Wrap up and final app

You've covered a lot of ground in this guide and the application is too big to reprint here.
Please visit the <live-example title="Router Sample in Stackblitz"></live-example>
where you can download the final source code.


{@a appendices}



## Appendices

The balance of this guide is a set of appendices that
elaborate some of the points you covered quickly above.

The appendix material isn't essential. Continued reading is for the curious.


{@a link-parameters-array}



### Appendix: link parameters array

A link parameters array holds the following ingredients for router navigation:

* The *path* of the route to the destination component.
* Required and optional route parameters that go into the route URL.

You can bind the `RouterLink` directive to such an array like this:


<code-example path="router/src/app/app.component.3.ts" linenums="false" header="src/app/app.component.ts (h-anchor)" region="h-anchor">

</code-example>



You've written a two element array when specifying a route parameter like this:


<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" linenums="false" header="src/app/heroes/hero-list/hero-list.component.html (nav-to-detail)" region="nav-to-detail">

</code-example>



You can provide optional route parameters in an object like this:


<code-example path="router/src/app/app.component.3.ts" linenums="false" header="src/app/app.component.ts (cc-query-params)" region="cc-query-params">

</code-example>



These three examples cover the need for an app with one level routing.
The moment you add a child router, such as the crisis center, you create new link array possibilities.

Recall that you specified a default child route for the crisis center so this simple `RouterLink` is fine.


<code-example path="router/src/app/app.component.3.ts" linenums="false" header="src/app/app.component.ts (cc-anchor-w-default)" region="cc-anchor-w-default">

</code-example>



Parse it out.

* The first item in the array identifies the parent route (`/crisis-center`).
* There are no parameters for this parent route so you're done with it.
* There is no default for the child route so you need to pick one.
* You're navigating to the `CrisisListComponent`, whose route path is `/`, but you don't need to explicitly add the slash.
* Voilà! `['/crisis-center']`.

Take it a step further. Consider the following router link that
navigates from the root of the application down to the *Dragon Crisis*:


<code-example path="router/src/app/app.component.3.ts" linenums="false" header="src/app/app.component.ts (Dragon-anchor)" region="Dragon-anchor">

</code-example>



* The first item in the array identifies the parent route (`/crisis-center`).
* There are no parameters for this parent route so you're done with it.
* The second item identifies the child route details about a particular crisis (`/:id`).
* The details child route requires an `id` route parameter.
* You added the `id` of the *Dragon Crisis* as the second item in the array (`1`).
* The resulting path is `/crisis-center/1`.


If you wanted to, you could redefine the `AppComponent` template with *Crisis Center* routes exclusively:


<code-example path="router/src/app/app.component.3.ts" linenums="false" header="src/app/app.component.ts (template)" region="template">

</code-example>



In sum, you can write applications with one, two or more levels of routing.
The link parameters array affords the flexibility to represent any routing depth and
any legal sequence of route paths, (required) router parameters, and (optional) route parameter objects.


{@a browser-url-styles}


{@a location-strategy}



### Appendix: *LocationStrategy* and browser URL styles

When the router navigates to a new component view, it updates the browser's location and history
with a URL for that view.
This is a strictly local URL. The browser shouldn't send this URL to the server
and should not reload the page.

Modern HTML5 browsers support
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState</a>,
a technique that changes a browser's location and history without triggering a server page request.
The router can compose a "natural" URL that is indistinguishable from
one that would otherwise require a page load.

Here's the *Crisis Center* URL in this "HTML5 pushState" style:


<code-example format="nocode">
  localhost:3002/crisis-center/

</code-example>



Older browsers send page requests to the server when the location URL changes
_unless_ the change occurs after a "#" (called the "hash").
Routers can take advantage of this exception by composing in-application route
URLs with hashes.  Here's a "hash URL" that routes to the *Crisis Center*.


<code-example format="nocode">
  localhost:3002/src/#/crisis-center/

</code-example>



The router supports both styles with two `LocationStrategy` providers:

1. `PathLocationStrategy`&mdash;the default "HTML5 pushState" style.
1. `HashLocationStrategy`&mdash;the "hash URL" style.

The `RouterModule.forRoot` function sets the `LocationStrategy` to the `PathLocationStrategy`,
making it the default strategy.
You can switch to the `HashLocationStrategy` with an override during the bootstrapping process if you prefer it.


<div class="alert is-helpful">



Learn about providers and the bootstrap process in the
[Dependency Injection guide](guide/dependency-injection#bootstrap).


</div>



#### Which strategy is best?

You must choose a strategy and you need to make the right call early in the project.
It won't be easy to change later once the application is in production
and there are lots of application URL references in the wild.

Almost all Angular projects should use the default HTML5 style.
It produces URLs that are easier for users to understand.
And it preserves the option to do _server-side rendering_ later.

Rendering critical pages on the server is a technique that can greatly improve
perceived responsiveness when the app first loads.
An app that would otherwise take ten or more seconds to start
could be rendered on the server and delivered to the user's device
in less than a second.

This option is only available if application URLs look like normal web URLs
without hashes (#) in the middle.

Stick with the default unless you have a compelling reason to
resort to hash routes.


#### The *&lt;base href>*

The router uses the browser's
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState</a>
for navigation. Thanks to `pushState`, you can make in-app URL paths look the way you want them to
look, e.g. `localhost:4200/crisis-center`. The in-app URLs can be indistinguishable from server URLs.

Modern HTML5 browsers were the first to support `pushState` which is why many people refer to these URLs as
"HTML5 style" URLs.


<div class="alert is-helpful">



HTML5 style navigation is the router default.
In the [LocationStrategy and browser URL styles](#browser-url-styles) Appendix,
learn why HTML5 style is preferred, how to adjust its behavior, and how to switch to the
older hash (#) style, if necessary.


</div>



You must **add a
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; element</a>**
to the app's `index.html` for `pushState` routing to work.
The browser uses the `<base href>` value to prefix *relative* URLs when referencing
CSS files, scripts, and images.

Add the `<base>` element just after the  `<head>` tag.
If the `app` folder is the application root, as it is for this application,
set the `href` value in **`index.html`** *exactly* as shown here.


<code-example path="router/src/index.html" linenums="false" header="src/index.html (base-href)" region="base-href">

</code-example>

#### HTML5 URLs and the  *&lt;base href>*

While the router uses the
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="Browser history push-state">HTML5 pushState</a>
style by default, you *must* configure that strategy with a **base href**.

The preferred way to configure the strategy is to add a
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">&lt;base href&gt; element</a>
tag in the `<head>` of the `index.html`.


<code-example path="router/src/index.html" linenums="false" header="src/index.html (base-href)" region="base-href">

</code-example>



Without that tag, the browser may not be able to load resources
(images, CSS, scripts) when "deep linking" into the app.
Bad things could happen when someone pastes an application link into the
browser's address bar or clicks such a link in an email.

Some developers may not be able to add the `<base>` element, perhaps because they don't have
access to `<head>` or the `index.html`.

Those developers may still use HTML5 URLs by taking two remedial steps:

1. Provide the router with an appropriate [APP_BASE_HREF][] value.
1. Use _root URLs_ for all web resources: CSS, images, scripts, and template HTML files.

{@a hashlocationstrategy}

#### *HashLocationStrategy*

You can go old-school with the `HashLocationStrategy` by
providing the `useHash: true` in an object as the second argument of the `RouterModule.forRoot`
in the `AppModule`.


<code-example path="router/src/app/app.module.6.ts" linenums="false" header="src/app/app.module.ts (hash URL strategy)">

</code-example>
