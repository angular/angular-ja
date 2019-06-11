# ルーティング

Tour of Heroes アプリケーションには新しい要求があります：

* *ダッシュボード*ビューを追加する。
* *ヒーローズ*ビューと*ダッシュボード*ビューの間で行き来できる機能を追加する。
* ユーザーが各ビューでヒーロー名をクリックしたとき、選択されたヒーローの詳細ビューを表示する。
* ユーザーがEメール上で*ディープリンク*をクリックしたとき、特定のヒーローの詳細ビューを開く。

これらの変更が完了したら、ユーザーは図のようにアプリケーションを行き来できるようになるでしょう：

<figure>

  <img src='generated/images/guide/toh/nav-diagram.png' alt="ビューのナビゲーション">

</figure>

## `AppRoutingModule`を追加する

Angularのベストプラクティスは、
ルートの`AppModule`からインポートされるルーティング専用のトップレベルモジュールで、
ルーターをロードして管理することです。

慣例では、そのモジュールのクラス名は`AppRoutingModule`とし、`src/app`フォルダの`app-routing.module.ts`に書きます。

CLIを使って生成することができます。

<code-example language="sh" class="code-shell">
  ng generate module app-routing --flat --module=app
</code-example>

<div class="alert is-helpful">

`--flat`は、固有のフォルダの代わりに、`src/app`に生成したファイルを置きます。<br>
`--module=app`は、`AppModule`の`imports`配列に、生成したモジュールを登録するようCLIに指示します。
</div>

生成されたファイルはこのようになります：

<code-example path="toh-pt5/src/app/app-routing.module.0.ts" 
  header="src/app/app-routing.module.ts (generated)">
</code-example>

通常、ルーティングモジュールでコンポーネントの宣言はしないので、`@NgModule.declarations`配列と`CommonModule`への参照は削除できます。

`RouterModule`の`Routes`を使ってルーターを管理するので、
`@angular/router`ライブラリからこれらふたつのシンボルをインポートしておきます。

`@NgModule.exports`の配列の中に`RouterModule`を追加します。
`RouterModule`をエクスポートすることで、
ルーターのディレクティブを必要とする`AppModule`コンポーネントで利用できるようになります。

編集後の`AppRoutingModule`はこのようになります：

<code-example path="toh-pt5/src/app/app-routing.module.ts" 
  region="v1"
  header="src/app/app-routing.module.ts (v1)">
</code-example>

### ルートを追加する

*ルート*は、ユーザーがリンクをクリックしたとき、またはURLをブラウザのアドレスバーに貼り付けたときに、
どのビューを表示したらよいかをルーターに伝えます。

典型的なAngularの`Route`はふたつのプロパティを持っています：

1. `path`：ブラウザのアドレスバーにある URL にマッチする文字列
1. `component`：そのルートに遷移するときにルーターが作成すべきコンポーネント

URLが`localhost:4200/heroes`のようであったときに`HeroesComponent`へ遷移させようとしている、とします。

`Route`で`HeroesComponent`を参照できるようにインポートします。
そして、そのコンポーネントへのひとつの`route`としてルートの配列を定義します。

<code-example path="toh-pt5/src/app/app-routing.module.ts" 
  region="heroes-route">
</code-example>

一度このセットアップが完了すると、ルーターはURLを`path: 'heroes'`にマッチして`HeroesComponent`を表示するようになります。

### _RouterModule.forRoot()_

まず始めにルーターの初期化をおこない、ルーターにブラウザのロケーション変化の検知を始めさせます。

次のように、`@NgModule.imports`配列に`RouterModule`を追加して、
`imports`配列の_中で_`RouterModule.forRoot()`を呼び出すことで`routes`を使ってそれを設定します：

<code-example path="toh-pt5/src/app/app-routing.module.ts" 
  region="ngmodule-imports">
</code-example>

<div class="alert is-helpful">

  アプリケーションのルートのレベルでルーターを設定しているので、このメソッドは`forRoot()`と呼ばれています。
  この`forRoot()`メソッドは、ルーティングに必要なサービス・プロバイダーとディレクティブを提供し、
  ブラウザの現在のURLを元に最初の遷移を行います。

</div>

## _RouterOutlet_ を追加する

`AppComponent`テンプレートを開き、`<app-heroes>`要素を`<router-outlet>`で置き換えます。

<code-example path="toh-pt5/src/app/app.component.html" 
  region="outlet"
  header="src/app/app.component.html (router-outlet)">
</code-example>

ユーザーが`HeroesComponent`に来たときに`HeroesComponent`だけを表示したいので、
`<app-heroes>`を削除します。

この`<router-outlet>`は、ルーティングされたビューをどこに表示するかをルーターに教えます。

<div class="alert is-helpful">

`RouterModule`をエクスポートした`AppRoutingModule`を`AppModule`がインポートしているので、
この`RouterOutlet`は、この`AppComponent`で利用できるようになったルーターのディレクティブのひとつです。

</div>

#### 試す

こちらのCLIコマンドを使用して実行する必要があります。

<code-example language="sh" class="code-shell">
  ng serve
</code-example>

ブラウザを更新するとアプリのタイトルは表示されますがヒーローのリストは表示されないはずです。

ブラウザのアドレスバーを見てみましょう。
URLが`/`で終わっています。
`HeroesComponent`へのルーターのパスは`/heroes`です。

ブラウザのアドレスバーでURLに`/heroes`を追加します。
おなじみのヒーローのマスター／詳細ビューが見れるはずです。

{@a routerlink}

## ナビゲーションのリンクを追加する (`routerLink`)

ユーザーはブラウザのアドレスバーにルーターのURLを貼り付ける必要はありません。
行き来するためのリンクをクリックできるべきです。

`<nav>`要素を追加して、その中に、クリックされると`HeroesComponent`へ遷移するトリガーになるアンカー要素を追加します。
修正された`AppComponent`テンプレートはこのようになります：

<code-example 
  path="toh-pt5/src/app/app.component.html" 
  region="heroes"
  header="src/app/app.component.html (heroes RouterLink)">
</code-example>

[`routerLink`属性](#routerlink)は、ルーターが`HeroesComponent`へのルートとして一致する文字列である`"/heroes"`に設定されます。
この`routerLink`は、ユーザーのクリックをルーターのナビゲーションへ変換する[`RouterLink`ディレクティブ](#routerlink)のためのセレクターです。
これは、`RouterModule`のもうひとつのパブリックなディレクティブです。

ブラウザを更新するとアプリケーションのタイトルとヒーローのリンクは表示されますが、ヒーローのリストは表示されません。

リンクをクリックしてください。アドレスバーが`/heroes`に更新されて、ヒーローのリストが現れます。

<div class="alert is-helpful">

一番下の[最終的なコードレビュー](#appcomponent)に記載されているように、プライベートなCSSのスタイルを`app.component.css`に追加することで、
このナビゲーションのリンクと今後のナビゲーションのリンクをさらに見栄えのよいものにすることができます。

</div>


## ダッシュボードビューを追加する

ルーティングは、複数のビューがある場合にさらに意味を持ちます。
これまでのところ、ヒーローのビューだけがあります。

CLIを使って`DashboardComponent`を追加します：

<code-example language="sh" class="code-shell">
  ng generate component dashboard
</code-example>

CLIは、`DashboardComponent`のためのファイルを生成し、`AppModule`の中でそれを宣言します。

これら3つのファイルのデフォルトの内容を次のように置き換えてから、少しの間議論に戻りましょう：

<code-tabs>
  <code-pane 
    header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.1.html">
  </code-pane>

  <code-pane 
    header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts">
  </code-pane>

  <code-pane 
    header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css">
  </code-pane>
</code-tabs>

この_template_には、ヒーロー名のリンクのグリッドが表示されます。

* この`*ngFor`リピーターは、コンポーネントの`heroes`配列と同じ数のリンクを作成します。
* このリンクは、`dashboard.component.css`によって色付きのブロックとしてスタイル設定されています。
* このリンクはまだどこにも行きませんが、[すぐにそうなります](#hero-details)。

この_class_は`HeroesComponent`クラスに似ています。
* `heroes`の配列のプロパティを定義します。
* このコンストラクターは、Angular が`HeroService`をプライベートの`heroService`プロパティに注入することを期待しています。
* この`ngOnInit()`ライフサイクル・フックは`getHeroes`を呼び出します。

この`getHeroes`は、ヒーローの配列を1番目と5番目でスライスし、トップヒーローの4つだけ（2番目、3番目、4番目、5番目）を返します。

<code-example path="toh-pt5/src/app/dashboard/dashboard.component.ts" region="getHeroes">
</code-example>

### ダッシュボードのルートを追加する

ダッシュボードに遷移するには、ルーターに適切なルートが必要です。

`AppRoutingModule`で`DashboardComponent`をインポートします。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="import-dashboard" 
  header="src/app/app-routing.module.ts (import DashboardComponent)">
</code-example>

`AppRoutingModule.routes`配列に、` DashboardComponent`へのパスにマッチするルートを追加します。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="dashboard-route">
</code-example>

### デフォルトルートを追加する

アプリケーションが起動すると、ブラウザのアドレスバーはWebサイトのルートを指します。
これは既存のルートと一致しないため、ルーターはどこにも移動しません。
`<router-outlet>`の下のスペースが空白になってしまうのです。

アプリケーションをダッシュボードに自動的に遷移するには、次のルートを
`AppRoutingModule.Routes`配列に追加します。

<code-example path="toh-pt5/src/app/app-routing.module.ts" region="redirect-route">
</code-example>

このルートは、空のパスと完全に一致するURLを、パスが`'/dashboard'`であるルートにリダイレクトします。

ブラウザが更新されると、ルーターは`DashboardComponent`をロードし、
ブラウザのアドレスバーには `/dashboard`の URL が表示されます。

### ダッシュボードのリンクをシェルに追加する

ユーザーは、ページのトップにあるナビゲーション領域のリンクをクリックすることで、
`DashboardComponent`と`HeroesComponent`の間を行き来することができるべきです。

*Heroes*リンクのすぐ上、`AppComponent`シェルテンプレートにダッシュボードのナビゲーションリンクを追加します。。

<code-example path="toh-pt5/src/app/app.component.html" header="src/app/app.component.html">
</code-example>

ブラウザが更新されたら、リンクをクリックすることでふたつのビューの間を自由に遷移できるようになります。

{@a hero-details}
## ヒーローの詳細へ遷移する

`HeroDetailsComponent`は選択されたヒーローの詳細を表示します。
現時点では `HeroDetailsComponent`は`HeroesComponent`の一番下にしか見えません。

ユーザーは3つの方法でこれらの詳細にアクセスできるはずです。

1. ダッシュボードのヒーローをクリックする。
1. ヒーローリストのヒーローをクリックする。
1. 表示するヒーローを識別するブラウザのアドレスバーに"ディープリンク"URLを貼り付ける。

このセクションでは、 `HeroDetailsComponent`への遷移を有効にして、
`HeroesComponent`から解き放ちます。

### `HeroesComponent`から_ヒーローの詳細_を削除する

ユーザーが `HeroesComponent`でひとつのヒーローをクリックすると、
アプリケーションは `HeroDetailComponent`に遷移する必要があり、
ヒーローリストビューをヒーロー詳細ビューに置き換えます。
ヒーローリストビューは、今のようにヒーローの詳細を表示しなくなるはずです。

`HeroesComponent`テンプレート (`heroes/heroes.component.html`) を開き、
`<app-hero-detail>`要素を一番下から削除します。

今はもうヒーローアイテムをクリックしても、何も起こりません。
そこは`HeroDetailComponent`への遷移を有効にした後に、[すぐに修正します](#heroes-component-links)。

### _ヒーロー詳細_ルートを追加する

`~/detail/11`のようなURLは、`id`が`11`のヒーローの*ヒーロー詳細*ビューにナビゲートするための正しいURLになります。

`AppRoutingModule`を開き、`HeroDetailComponent`をインポートします。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="import-herodetail" 
  header="src/app/app-routing.module.ts (import HeroDetailComponent)">
</code-example>

次に、_ヒーロー詳細_ビューへのパスのパターンと一致する_パラメータ付き_ルートを`AppRoutingModule.routes`配列に追加します。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="detail-route">
</code-example>

`path`のコロン (:) は`:id`が特定のヒーローの`id`のプレースホルダーであることを表しています。

この時点で、すべてのアプリケーションルートが配置されています。

<code-example 
  path="toh-pt5/src/app/app-routing.module.ts" 
  region="routes" 
  header="src/app/app-routing.module.ts (all routes)">
</code-example>

### `DashboardComponent`ヒーローのリンク

現時点では`DashboardComponent`ヒーローのリンクは何もしません。

ルーターは `HeroDetailComponent`へのルートを持っているので、
ダッシュボードのヒーローのリンクを修正して、_パラメータ付き_ダッシュボードのルート経由で遷移します。

<code-example 
  path="toh-pt5/src/app/dashboard/dashboard.component.html" 
  region="click" 
  header="src/app/dashboard/dashboard.component.html (hero links)">
</code-example>

`*ngFor`リピーター内でAngularの[補間バインディング](guide/template-syntax#interpolation)を使用していて、
現在の繰り返しの `hero.id`を個々の[`routerLink`](#routerlink)に挿入します。

{@a heroes-component-links}
### `HeroesComponent`ヒーローのリンク

`HeroesComponent`のヒーローのアイテムは、
コンポーネントの onSelect() メソッドにバインドされたクリック・イベントをもつ`<li>`要素です。

<code-example 
  path="toh-pt4/src/app/heroes/heroes.component.html" 
  region="list" 
  header="src/app/heroes/heroes.component.html (list with onSelect)">
</code-example>

この`<li>`を`*ngFor`だけをもつように戻し、
アンカー要素 (`<a>`) でバッジと名前を囲み、
ダッシュボードのテンプレートと同じようにアンカーに`routerLink`要素を追加します。

<code-example 
  path="toh-pt5/src/app/heroes/heroes.component.html" 
  region="list" 
  header="src/app/heroes/heroes.component.html (list with links)">
</code-example>

プライベートなスタイルシート (`heroes.component.css`) を修正して
これまでと同じようにリストが見えるようにすべきです。
修正したスタイルは、このガイドの最後にある[最終コードレビュー](#heroescomponent)にあります。

#### 不要なコードを削除する（オプション）

`HeroesComponent`クラスはまだ動作しますが、
`onSelect()`メソッドと`selectedHero`プロパティはもはや使われません。

きちんと整理するといいですし、あとで自分自身に感謝することでしょう。
これが不要なコードを整理した後のクラスです。

<code-example 
  path="toh-pt5/src/app/heroes/heroes.component.ts"
  region="class" 
  header="src/app/heroes/heroes.component.ts (cleaned up)" linenums="false">
</code-example>

## ルーティング可能な *HeroDetailComponent*

以前は、親の`HeroesComponent`が`HeroDetailComponent.hero`プロパティを設定していて、
`HeroDetailComponent`がヒーローを表示していました。

もう`HeroesComponent`はこれをやりません。
今は、ルーターが `~/detail/11`のような URL に応答して`HeroDetailComponent`を作成します。

`HeroDetailComponent`は_表示するヒーロー_を得るための新しい方法が必要です。

* それを作成したルートを取得し
* ルートから`id`を抽出し
* `HeroService`を介してサーバーからその`id`でヒーローを取得する

次のインポートを追加します：

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" 
  region="added-imports" 
  header="src/app/hero-detail/hero-detail.component.ts">
</code-example>

{@a hero-detail-ctor}

`ActivatedRoute`, ` HeroService`,  `Location`サービスをコンストラクターに注入し、
それらの値をプライベートフィールドに保存します。

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ctor">
</code-example>

[`ActivatedRoute`](api/router/ActivatedRoute)は、この`HeroDetailComponent`のインスタンスへのルートに関する情報を保持します。
このコンポーネントは、URLから抽出されたパラメータが入ったルートのバッグに関心があります。
_"id"_パラメータは、表示するヒーローの`id`です。

[`HeroService`](tutorial/toh-pt4)は、リモートサーバーからヒーローのデータを取得し、
このコンポーネントはそれを使用して_表示するヒーロー_を取得します。

[`location`](api/common/Location)は、ブラウザと対話するためのAngularサービスです。
ここへナビゲートしたビューに戻るために、[後で](#goback)使うことになるでしょう。

### _id_ルートパラメータを抽出する

`ngOnInit()` [ライフサイクルフック](guide/lifecycle-hooks#oninit)で、
`getHero()`を呼び出し、次のように定義します。

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ngOnInit">
</code-example>

`route.snapshot`は、コンポーネントが作成された直後のルート情報の静的イメージです。

`paramMap`は、URL から抽出されたルートパラメータ値の辞書です。
`"id"`キーは、フェッチするヒーローの`id`を返します。

ルートパラメータは常に文字列です。
JavaScript (+) 演算子は文字列を数値に変換します。これがヒーローの`id`の値です。

ブラウザがリフレッシュされ、コンパイラのエラーでアプリケーションがクラッシュします。
`HeroService`は`getHero()`メソッドを持っていません。
今すぐ追加しましょう。

### `HeroService.getHero()`を追加する

`HeroService`を開き、`getHero()`メソッドを追加します。

<code-example 
  path="toh-pt5/src/app/hero.service.ts" 
  region="getHero" 
  header="src/app/hero.service.ts (getHero)">
</code-example>

<div class="alert is-important">

`id` を埋め込むためのJavaScript
[_テンプレートリテラル_](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/template_strings)
を定義するバッククオート ( &#96; ) に注意してください。
</div>

[`getHeroes()`](tutorial/toh-pt4#observable-heroservice)と同様に、
`getHero()`には非同期のシグネチャーがあります。
RxJSの`of()`関数を使って_モックのヒーロー_を `Observable`として返します。

`getHero()`を呼び出す `HeroDetailComponent`を変更することなく、
実際の`Http`リクエストとして `getHero()`を再実装することができます。

#### 試す

ブラウザがリフレッシュされ、アプリは再び動くようになります。
ダッシュボードまたはヒーローリストでヒーローをクリックでき、
そのヒーローの詳細ビューに移動することができます。

`localhost:4200/detail/11`をブラウザのアドレスバーに貼り付けると、
ルーターは、`id:11`つまり "Dr. Nice" というヒーローの詳細ビューに遷移します。

{@a goback}

### 戻る方法を探す

ブラウザの戻るボタンをクリックすると、
詳細ビューに来たときの経路によって、
ヒーローリストまたはダッシュボード画面に戻ることができます。

`HeroDetail`ビュー上にそうできるボタンを持っているといいでしょう。

コンポーネントのテンプレートの最後に*戻る*ボタンを追加し、
コンポーネントの `goBack()`メソッドにバインドします。

<code-example 
  path="toh-pt5/src/app/hero-detail/hero-detail.component.html" 
  region="back-button"
  header="src/app/hero-detail/hero-detail.component.html (back button)">
</code-example>

[先ほど注入した](#hero-detail-ctor)`Location`サービスを使用して、
ブラウザの履歴のひとつ前にナビゲートする`goBack()`メソッドをコンポーネントのクラスに追加します。

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="goBack" header="src/app/hero-detail/hero-detail.component.ts (goBack)">

</code-example>


ブラウザを更新して、クリックしてみましょう。
ユーザーは、ダッシュボードからヒーローの詳細に行って戻ったり、ヒーローリストから小さな詳細へ行き
ヒーローの詳細に行って再びヒーローリストに戻ったりと、アプリケーションのあちこちを行き来することができます。

このページで進めてきたすべてのナビゲーション要件を満たしています。


## 最後のコード・レビュー

このページで解説したコードのファイルは次のとおりで、
アプリは<live-example> </live-example>のようになっているはずです。

{@a approutingmodule}
{@a appmodule}
#### _AppRoutingModule_, _AppModule_, と _HeroService_

<code-tabs>
  <code-pane 
    header="src/app/app-routing.module.ts" 
    path="toh-pt5/src/app/app-routing.module.ts">
  </code-pane>
  <code-pane 
    header="src/app/app.module.ts" 
    path="toh-pt5/src/app/app.module.ts">
  </code-pane>
  <code-pane 
    header="src/app/hero.service.ts" 
    path="toh-pt5/src/app/hero.service.ts">
  </code-pane>
</code-tabs>

{@a appcomponent}
#### _AppComponent_

<code-tabs>
  <code-pane 
    header="src/app/app.component.html"
    path="toh-pt5/src/app/app.component.html">
  </code-pane>

  <code-pane 
    header="src/app/app.component.css"
    path="toh-pt5/src/app/app.component.css">
  </code-pane>
</code-tabs>

{@a dashboardcomponent}
#### _DashboardComponent_

<code-tabs>
  <code-pane 
    header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.html">
  </code-pane>

  <code-pane 
    header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts">
  </code-pane>

  <code-pane 
    header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css">
  </code-pane>
</code-tabs>

{@a heroescomponent}
#### _HeroesComponent_

<code-tabs>
  <code-pane 
    header="src/app/heroes/heroes.component.html" path="toh-pt5/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane 
    header="src/app/heroes/heroes.component.ts" 
    path="toh-pt5/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane 
    header="src/app/heroes/heroes.component.css" 
    path="toh-pt5/src/app/heroes/heroes.component.css">
  </code-pane>
</code-tabs>

{@a herodetailcomponent}
#### _HeroDetailComponent_

<code-tabs>
  <code-pane 
    header="src/app/hero-detail/hero-detail.component.html" path="toh-pt5/src/app/hero-detail/hero-detail.component.html">
  </code-pane>

  <code-pane 
    header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>

  <code-pane 
    header="src/app/hero-detail/hero-detail.component.css" path="toh-pt5/src/app/hero-detail/hero-detail.component.css">
  </code-pane>
</code-tabs>

## まとめ

* さまざまなコンポーネント間を行き来するためにAngularルーターを追加しました。
* `AppComponent`を、`<a>`リンクと`<router-outlet>`をもつナビゲーション・シェルに変更しました。
* `AppRoutingModule`でルーターを設定しました。
* シンプルなルート、リダイレクトするルート、およびパラメータ付きルートを定義しました。
* アンカー要素で`routerLink`ディレクティブを使用しました。
* 密接に結合されたmaster/detailビューをルート化した詳細ビューにリファクタリングしました。
* ユーザーが選択したヒーローの詳細ビューに移動するために、ルーターリンクのパラメータを使用しました。
* 複数のコンポーネント間で`HeroService`を共有しました。
