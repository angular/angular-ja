# ルーティングを使ったナビゲーションの追加

Tour of Heroes アプリケーションには新しい要求があります：

* *ダッシュボード*ビューを追加する。
* *ヒーローズ*ビューと*ダッシュボード*ビューの間で行き来できる機能を追加する。
* ユーザーが各ビューでヒーロー名をクリックしたとき、選択されたヒーローの詳細ビューを表示する。
* ユーザーがEメール上で*ディープリンク*をクリックしたとき、特定のヒーローの詳細ビューを開く。

<div class="alert is-helpful">

  For the sample app that this page describes, see the <live-example></live-example>.

</div>

これらの変更が完了したら、ユーザーは図のようにアプリケーションを行き来できるようになるでしょう：

<div class="lightbox">

<img alt="View navigations" src="generated/images/guide/toh/nav-diagram.png">

</div>

## `AppRoutingModule`を追加する

Angularのベストプラクティスは、
ルートの`AppModule`からインポートされるルーティング専用のトップレベルモジュールで、
ルーターをロードして管理することです。

慣例では、そのモジュールのクラス名は`AppRoutingModule`とし、`src/app`フォルダの`app-routing.module.ts`に書きます。

CLIを使って生成することができます。

<code-example format="shell" language="shell">

ng generate module app-routing --flat --module=app

</code-example>

<div class="alert is-helpful">

| Parameter      | Details |
|:---            |:---     |
| `--flat` | 固有のディレクトリの代わりに、`src/app`に生成したファイルを置きます。|
| `--module=app` | `AppModule`の`imports`配列に、生成したモジュールを登録するようCLIに指示します。 |

</div>

`ng generate` は次のようにファイルを作成します。

<code-example header="src/app/app-routing.module.ts (generated)" path="toh-pt5/src/app/app-routing.module.0.ts"></code-example>

次のように置き換えます。

<code-example header="src/app/app-routing.module.ts (updated)" path="toh-pt5/src/app/app-routing.module.1.ts"></code-example>

最初に、 `app-routing.module.ts`ファイルはアプリケーションにルーティング機能を持たせることができる `RouterModule` と `Routes` をインポートします。次のインポートである `HeroesComponent`は、ルートを設定することでルーターに向かう場所を教えます。

`CommonModule` の参照と` declarations`配列は不要なので、 `AppRoutingModule`の一部ではなくなっていることに注意してください。
次のセクションでは、`AppRoutingModule` の残りの部分について詳しく説明します。

### ルート

ファイルの次の部分は、ルートを構成する場所です。
*ルート*は、ユーザーがリンクをクリックしたとき、またはURLをブラウザのアドレスバーに貼り付けたときに、どのビューを表示したらよいかをルーターに伝えます。

`app-routing.module.ts` はすでに `HeroesComponent` をインポートしているため、 `routes` 配列で使用できます。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="heroes-route"></code-example>

典型的なAngularの`Route`はふたつのプロパティを持っています：

| Properties  | Details |
|:---         |:---     |
| `path` | ブラウザのアドレスバーにある URL にマッチする文字列 |
| `component` | そのルートに遷移するときにルーターが作成すべきコンポーネント |

これにより、ルーターはそのURLを `path: 'heroes'` に一致させ、URLが`localhost:4200/heroes`のようなものである場合に`HeroesComponent`を表示します。

### `RouterModule.forRoot()`

`@NgModule`メタデータはルーターを初期化し、ブラウザのロケーションの変更を待機します。

次の行は、 `RouterModule` を `AppRoutingModule` の `imports` 配列に追加し、`RouterModule.forRoot()`を呼び出すことにより、ワンステップで `routes` にそれを設定します:

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="ngmodule-imports"></code-example>

<div class="alert is-helpful">

アプリケーションのルートのレベルでルーターを設定しているので、このメソッドは`forRoot()`と呼ばれています。
この`forRoot()`メソッドは、ルーティングに必要なサービス・プロバイダーとディレクティブを提供し、ブラウザの現在のURLを元に最初の遷移を行います。

</div>

次に、`AppRoutingModule` は `RouterModule` をエクスポートし、アプリケーション全体で利用できるようにします。

<code-example header="src/app/app-routing.module.ts (exports array)" path="toh-pt5/src/app/app-routing.module.ts" region="export-routermodule"></code-example>

## `RouterOutlet` を追加する

<!-- markdownlint-disable MD001 -->

`AppComponent`テンプレートを開き、`<app-heroes>`要素を`<router-outlet>`で置き換えます。

<code-example header="src/app/app.component.html (router-outlet)" path="toh-pt5/src/app/app.component.html" region="outlet"></code-example>

ユーザーが遷移したときにアプリケーションは `HeroesComponent`のみを表示するため、`AppComponent`のテンプレートはもう `<app-heroes>`を必要としません。

この`<router-outlet>`は、ルーティングされたビューをどこに表示するかをルーターに教えます。

<div class="alert is-helpful">

`RouterModule`をエクスポートした`AppRoutingModule`を`AppModule`がインポートしているので、
この`RouterOutlet`は、この`AppComponent`で利用できるようになったルーターのディレクティブのひとつです。このチュートリアルのはじめに実行した`ng generate`コマンドで`--module=app`フラグを指定したことで、このインポートが追加されました。
`ng generate` コマンド以外で作成した場合は、`AppRoutingModule`を`app.module.ts`にインポートし、`NgModule`の`imports`配列に追加する必要があります。

</div>

<!-- markdownlint-disable MD024 -->

#### 試す

まだアプリケーションを配信していない場合は、`ng serve`を実行して、ブラウザでアプリケーションを確認します。

ブラウザを更新するとアプリケーションのタイトルは表示されますがヒーローのリストは表示されないはずです。

ブラウザのアドレスバーを見てみましょう。
URLが`/`で終わっています。
`HeroesComponent`へのルーターのパスは`/heroes`です。

ブラウザのアドレスバーでURLに`/heroes`を追加します。
おなじみのヒーローのマスター／詳細ビューが見れるはずです。

ブラウザのアドレスバーに表示されるURLから`/heroes`を削除します。
ブラウザが更新され、アプリケーションのタイトルが表示されますが、ヒーローのリストは表示されません。

<!-- markdownlint-enable MD001 -->
<!-- markdownlint-enable MD024 -->

<a id="routerlink"></a>

## `routerLink` でナビゲーションのリンクを追加する

理想的には、ルートのURLをアドレスバーに貼り付けるのではなく、ユーザーがリンクをクリックして遷移できるようにする必要があります。

`<nav>`要素を追加して、その中に、クリックされると`HeroesComponent`へ遷移するトリガーになるアンカー要素を追加します。
修正された`AppComponent`テンプレートはこのようになります：

<code-example header="src/app/app.component.html (heroes RouterLink)" path="toh-pt5/src/app/app.component.html" region="heroes"></code-example>

[`routerLink`属性](#routerlink)は、ルーターが`HeroesComponent`へのルートとして一致する文字列である`"/heroes"`に設定されます。
この`routerLink`は、ユーザーのクリックをルーターのナビゲーションへ変換する[`RouterLink`ディレクティブ](/api/router/RouterLink)のためのセレクターです。
これは、`RouterModule`のもうひとつのパブリックなディレクティブです。

ブラウザを更新するとアプリケーションのタイトルとヒーローのリンクは表示されますが、ヒーローのリストは表示されません。

リンクをクリックしてください。
アドレスバーが`/heroes`に更新されて、ヒーローのリストが現れます。

<div class="alert is-helpful">

一番下の[最終的なコードレビュー](#appcomponent)に記載されているように、プライベートなCSSのスタイルを`app.component.css`に追加することで、このナビゲーションのリンクと今後のナビゲーションのリンクをさらに見栄えのよいものにすることができます。

</div>

## ダッシュボードビューを追加する

ルーティングは、複数のビューがある場合にさらに意味を持ちます。
これまでのところ、ヒーローのビューだけがあります。

`ng generate` を実行して `DashboardComponent`を追加します：

<code-example format="shell" language="shell">

ng generate component dashboard

</code-example>

`ng generate` は、`DashboardComponent`のためのファイルを生成し、`AppModule`の中でそれを宣言します。

これら3つのファイルのデフォルトの内容を次のように置き換えましょう：

<code-tabs>
    <code-pane header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.1.html"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css"></code-pane>
</code-tabs>

この_template_には、ヒーロー名のリンクのグリッドが表示されます。

* この`*ngFor`リピーターは、コンポーネントの`heroes`配列と同じ数のリンクを作成します。
* このリンクは、`dashboard.component.css`によって色付きのブロックとしてスタイル設定されています。
* このリンクはまだどこにも行きません

この_クラス_は`HeroesComponent`クラスに似ています。

* `heroes`の配列のプロパティを定義します。
* このコンストラクターは、Angular が`HeroService`をプライベートの`heroService`プロパティに注入することを期待しています。
* この`ngOnInit()`ライフサイクル・フックは`getHeroes()`を呼び出します。

この`getHeroes()`は、ヒーローの配列を1番目と5番目でスライスし、トップヒーローの4つだけ（2番目、3番目、4番目、5番目）を返します。

<code-example header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts" region="getHeroes"></code-example>

### ダッシュボードのルートを追加する

ダッシュボードに遷移するには、ルーターに適切なルートが必要です。

`app-routing.module.ts`で`DashboardComponent`をインポートします。

<code-example header="src/app/app-routing.module.ts (import DashboardComponent)" path="toh-pt5/src/app/app-routing.module.ts" region="import-dashboard"></code-example>

`routes`配列に、` DashboardComponent`へのパスにマッチするルートを追加します。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="dashboard-route"></code-example>

### デフォルトルートを追加する

アプリケーションが起動すると、ブラウザのアドレスバーはWebサイトのルートを指します。
これは既存のルートと一致しないため、ルーターはどこにも移動しません。
`<router-outlet>`の下のスペースが空白になってしまうのです。

アプリケーションをダッシュボードに自動的に遷移するには、次のルートを`routes`配列に追加します。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="redirect-route"></code-example>

このルートは、空のパスと完全に一致するURLを、パスが`'/dashboard'`であるルートにリダイレクトします。

ブラウザが更新されると、ルーターは`DashboardComponent`をロードし、ブラウザのアドレスバーには `/dashboard`の URL が表示されます。

### ダッシュボードのリンクをシェルに追加する

ユーザーは、ページのトップにあるナビゲーション領域のリンクをクリックすることで、`DashboardComponent`と`HeroesComponent`の間を行き来することができるべきです。

*Heroes*リンクのすぐ上、`AppComponent`シェルテンプレートにダッシュボードのナビゲーションリンクを追加します。。

<code-example header="src/app/app.component.html" path="toh-pt5/src/app/app.component.html"></code-example>

ブラウザが更新されたら、リンクをクリックすることでふたつのビューの間を自由に遷移できるようになります。

<a id="hero-details"></a>

## ヒーローの詳細へ遷移する

`HeroDetailComponent`は選択されたヒーローの詳細を表示します。
現時点では `HeroDetailComponent`は`HeroesComponent`の一番下にしか見えません。

ユーザーは3つの方法でこれらの詳細にアクセスできるはずです。

1. ダッシュボードのヒーローをクリックする。
1. ヒーローリストのヒーローをクリックする。
1. 表示するヒーローを識別するブラウザのアドレスバーに"ディープリンク"URLを貼り付ける。

このセクションでは、 `HeroDetailComponent`への遷移を有効にして、`HeroesComponent`から解き放ちます。

### `HeroesComponent`から_ヒーローの詳細_を削除する

ユーザーが `HeroesComponent`でひとつのヒーローをクリックすると、アプリケーションは `HeroDetailComponent`に遷移する必要があり、ヒーローリストビューをヒーロー詳細ビューに置き換えます。
ヒーローリストビューは、今のようにヒーローの詳細を表示しなくなるはずです。

`HeroesComponent`テンプレート (`heroes/heroes.component.html`) を開き、`<app-hero-detail>`要素を一番下から削除します。

今はもうヒーローアイテムをクリックしても、何も起こりません。
そこは`HeroDetailComponent`への遷移を有効にした後に、[すぐに修正します](#heroes-component-links)。

### _ヒーロー詳細_ルートを追加する

`~/detail/11`のようなURLは、`id`が`11`のヒーローの*ヒーロー詳細*ビューにナビゲートするための正しいURLになります。

`app-routing.module.ts`を開き、`HeroDetailComponent`をインポートします。

<code-example header="src/app/app-routing.module.ts (import HeroDetailComponent)" path="toh-pt5/src/app/app-routing.module.ts" region="import-herodetail"></code-example>

次に、_ヒーロー詳細_ビューへのパスのパターンと一致する_パラメータ付き_ルートを`routes`配列に追加します。

<code-example header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts" region="detail-route"></code-example>

`path`のコロン `:` は`:id`が特定のヒーローの`id`のプレースホルダーであることを表しています。

この時点で、すべてのアプリケーションルートが配置されています。

<code-example header="src/app/app-routing.module.ts (all routes)" path="toh-pt5/src/app/app-routing.module.ts" region="routes"></code-example>

### `DashboardComponent`ヒーローのリンク

現時点では`DashboardComponent`ヒーローのリンクは何もしません。

ルーターは `HeroDetailComponent`へのルートを持っているので、ダッシュボードのヒーローのリンクを修正して、_パラメータ付き_ダッシュボードのルート経由で遷移します。

<code-example header="src/app/dashboard/dashboard.component.html (hero links)" path="toh-pt5/src/app/dashboard/dashboard.component.html" region="click"></code-example>

`*ngFor`リピーター内でAngularの[補間バインディング](guide/interpolation)を使用していて、現在の繰り返しの `hero.id`を個々の[`routerLink`](#routerlink)に挿入します。

<a id="heroes-component-links"></a>

### `HeroesComponent`ヒーローのリンク

`HeroesComponent`のヒーローのアイテムは、コンポーネントの onSelect() メソッドにバインドされたクリック・イベントをもつ`<li>`要素です。

<code-example header="src/app/heroes/heroes.component.html (list with onSelect)" path="toh-pt4/src/app/heroes/heroes.component.html" region="list"></code-example>

`<li>`の内側のHTMLを削除します。
アンカー要素 (`<a>`) でバッジと名前を囲み、
ダッシュボードのテンプレートと同じようにアンカーに`routerLink`要素を追加します。

<code-example header="src/app/heroes/heroes.component.html (list with links)" path="toh-pt5/src/app/heroes/heroes.component.html" region="list"></code-example>

プライベートなスタイルシート (`heroes.component.css`) を修正してこれまでと同じようにリストが見えるようにすべきです。
修正したスタイルは、このガイドの最後にある[最終コードレビュー](#heroescomponent)にあります。

#### 不要なコードを削除する - 任意

`HeroesComponent`クラスはまだ動作しますが、`onSelect()`メソッドと`selectedHero`プロパティはもはや使われません。

きちんと整理するといいですし、あとで自分自身に感謝することでしょう。
これが不要なコードを整理した後のクラスです。

<code-example header="src/app/heroes/heroes.component.ts (cleaned up)" path="toh-pt5/src/app/heroes/heroes.component.ts" region="class"></code-example>

## ルーティング可能な `HeroDetailComponent`

以前は、親の`HeroesComponent`が`HeroDetailComponent.hero`プロパティを設定していて、`HeroDetailComponent`がヒーローを表示していました。

もう`HeroesComponent`はこれをやりません。
今は、ルーターが `~/detail/11`のような URL に応答して`HeroDetailComponent`を作成します。

`HeroDetailComponent`は表示するヒーローを得るための新しい方法が必要です。
このセクションでは、次について説明します。

* それを作成したルートを取得し
* ルートから`id`を抽出し
* `HeroService`を介してサーバーからその`id`でヒーローを取得する

次のインポートを追加します：

<code-example header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="added-imports"></code-example>

<a id="hero-detail-ctor"></a>

`ActivatedRoute`, ` HeroService`,  `Location` サービスをコンストラクターに注入し、それらの値をプライベートフィールドに保存します。

<code-example header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ctor"></code-example>

[`ActivatedRoute`](api/router/ActivatedRoute)は、この`HeroDetailComponent`のインスタンスへのルートに関する情報を保持します。
このコンポーネントは、URLから抽出されたルートのパラメータに関心があります。
"id"パラメータは、表示するヒーローの`id`です。

[`HeroService`](tutorial/tour-of-heroes/toh-pt4)は、リモートサーバーからヒーローのデータを取得し、このコンポーネントはそれを使用して表示するヒーローを取得します。

[`location`](api/common/Location)は、ブラウザと対話するためのAngularサービスです。
これは前のビューに戻ることができるサービスです。

### `id` ルートパラメータを抽出する

`ngOnInit()` [ライフサイクルフック](guide/lifecycle-hooks#oninit)で、`getHero()`を呼び出し、次のように定義します。

<code-example header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="ngOnInit"></code-example>

`route.snapshot`は、コンポーネントが作成された直後のルート情報の静的イメージです。

`paramMap`は、URL から抽出されたルートパラメータ値の辞書です。
`"id"`キーは、フェッチするヒーローの`id`を返します。

ルートパラメータは常に文字列です。
JavaScriptの `Number` 関数は文字列を数値に変換します。
これがヒーローの`id`の値です。

ブラウザがリフレッシュされ、コンパイラのエラーでアプリケーションがクラッシュします。
`HeroService`は`getHero()`メソッドを持っていません。
今すぐ追加しましょう。

### `HeroService.getHero()`を追加する

`HeroService`を開き、`getHeroes()`メソッドの後に`id`とともに次の`getHero()`メソッドを追加します。

<code-example header="src/app/hero.service.ts (getHero)" path="toh-pt5/src/app/hero.service.ts" region="getHero"></code-example>

<div class="alert is-important">

**IMPORTANT**: <br />
`id` を埋め込むためのJavaScriptの[_テンプレートリテラル_](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/template_strings)を定義するバッククオート ( <code>&grave;</code> ) に注意してください。

</div>

[`getHeroes()`](tutorial/tour-of-heroes/toh-pt4#observable-heroservice)と同様に、`getHero()`には非同期のシグネチャーがあります。
RxJSの`of()`関数を使って_モックのヒーロー_を `Observable`として返します。

`getHero()`を呼び出す `HeroDetailComponent`を変更することなく、実際の`Http`リクエストとして `getHero()`を再実装することができます。

<!-- markdownlint-disable MD024 -->

#### 試してみよう

ブラウザがリフレッシュされ、アプリケーションは再び動くようになります。
ダッシュボードまたはヒーローリストでヒーローをクリックでき、そのヒーローの詳細ビューに移動することができます。

`localhost:4200/detail/12`をブラウザのアドレスバーに貼り付けると、ルーターは、`id:12`つまり **Dr. Nice** というヒーローの詳細ビューに遷移します。

<!-- markdownlint-enable MD024 -->

<a id="goback"></a>

### 戻る方法を探す

ブラウザの戻るボタンをクリックすると、詳細ビューに来たときの経路によって、ヒーローリストまたはダッシュボード画面に戻ることができます。

`HeroDetail`ビュー上にそうできるボタンを持っているといいでしょう。

コンポーネントのテンプレートの最後に*戻る*ボタンを追加し、コンポーネントの `goBack()`メソッドにバインドします。

<code-example header="src/app/hero-detail/hero-detail.component.html (back button)" path="toh-pt5/src/app/hero-detail/hero-detail.component.html" region="back-button"></code-example>

[先ほど注入した](#hero-detail-ctor)`Location`サービスを使用して、ブラウザの履歴のひとつ前にナビゲートする`goBack()`メソッドをコンポーネントのクラスに追加します。

<code-example header="src/app/hero-detail/hero-detail.component.ts (goBack)" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="goBack"></code-example>

ブラウザを更新して、クリックしてみましょう。
ユーザーは新しいボタンを使って、アプリケーション内を移動できるようになりました。

次の ["最終コードのレビュー"](#final-code-review) タブのひとつに記載されてるように、独自のCSSスタイルを `hero-detail.component.css` に追加すると、詳細がより美しく表示されます。

## 最終コードのレビュー {@a final-code-review}

<!-- markdownlint-disable MD001 -->

このページで解説したコードのファイルは次のとおりです。

<a id="approutingmodule"></a>
<a id="appmodule"></a>

#### `AppRoutingModule`, `AppModule`, と `HeroService`

<code-tabs>
    <code-pane header="src/app/app.module.ts" path="toh-pt5/src/app/app.module.ts"></code-pane>
    <code-pane header="src/app/app-routing.module.ts" path="toh-pt5/src/app/app-routing.module.ts"></code-pane>
    <code-pane header="src/app/hero.service.ts" path="toh-pt5/src/app/hero.service.ts"></code-pane>
</code-tabs>

<a id="appcomponent"></a>

#### `AppComponent`

<code-tabs>
    <code-pane header="src/app/app.component.html" path="toh-pt5/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/app.component.ts" path="toh-pt5/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.css" path="toh-pt5/src/app/app.component.css"></code-pane>
</code-tabs>

<a id="dashboardcomponent"></a>

#### `DashboardComponent`

<code-tabs>
    <code-pane header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.html"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts"></code-pane>
    <code-pane header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css"></code-pane>
</code-tabs>

<a id="heroescomponent"></a>

#### `HeroesComponent`

<code-tabs>
    <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt5/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt5/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.css" path="toh-pt5/src/app/heroes/heroes.component.css"></code-pane>
</code-tabs>

<a id="herodetailcomponent"></a>

#### `HeroDetailComponent`

<code-tabs>
    <code-pane header="src/app/hero-detail/hero-detail.component.html" path="toh-pt5/src/app/hero-detail/hero-detail.component.html"></code-pane>
    <code-pane header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts"></code-pane>
    <code-pane header="src/app/hero-detail/hero-detail.component.css" path="toh-pt5/src/app/hero-detail/hero-detail.component.css"></code-pane>
</code-tabs>

<!-- markdownlint-enable MD001 -->

## まとめ

* さまざまなコンポーネント間を行き来するためにAngularルーターを追加しました。
* `AppComponent`を、`<a>`リンクと`<router-outlet>`をもつナビゲーション・シェルに変更しました。
* `AppRoutingModule`でルーターを設定しました。
* ルート、リダイレクトするルート、およびパラメータ付きルートを定義しました。
* アンカー要素で`routerLink`ディレクティブを使用しました。
* 密接に結合された main/detail ビューをルート化した詳細ビューにリファクタリングしました。
* ユーザーが選択したヒーローの詳細ビューに移動するために、ルーターリンクのパラメータを使用しました。
* 複数のコンポーネント間で`HeroService`を共有しました。

## Next steps

*  [6. Get data from a server](tutorial/tour-of-heroes/toh-pt6)

@reviewed 2022-02-28
