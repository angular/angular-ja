# ルーティング遷移のアニメーション

ルーティングは、ユーザーがアプリケーション内の異なる経路間を移動することを可能にします。

#### 前提

次の概念への基本的な理解:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [再利用可能なアニメーション](guide/reusable-animations)

## Enable routing transition animation

ルーティングを有効にすると、アプリケーション内のさまざまなルーティング間を移動できます。 ユーザーがあるルーティングから別のルーティングにナビゲーションすると、AngularルーターはURLパスを関連するコンポーネントにマップし、そのビューを表示します。 
このルーティングの遷移をアニメーション化することで、ユーザー体験を大幅に向上できます。

Angularルーターには、ルーティングが変更されたときにビュー間の遷移をアニメーションできる、高水準なアニメーション機能が付属しています。 
ルーティングを切り替えるときにアニメーションシーケンスを生成するには、ネストされたアニメーションシーケンスを定義する必要があります。 
ビューをホストする最上位のコンポーネントから始め、埋め込みビューをホストするコンポーネントに追加のアニメーションをネストします。

ルーティング遷移アニメーションを有効にするには、次の手順を実行します:

1.  アプリケーションにルーティングモジュールをインポートし、ルーティング設定を有効にします。
2.  ルーターアウトレットを追加して、アクティブ化されたコンポーネントをDOMのどこに配置するのか、Angularルーターに指示します。
3.  アニメーションを定義します。

`HomeComponent`ビューと`AboutComponent`ビューにそれぞれ関連付けられた2つのルーティング、*Home*と*About*をナビゲーションして、ルーティング遷移アニメーションを説明しましょう。 
これらのコンポーネントビューは両方とも`AppComponent`によってホストされる一番上の子です。 
ユーザーが2つのルーティングを移動するときに新しいビューを左からスライドインさせ、古いビューを右へスライドアウトさせるルーティング遷移アニメーションを実装します。

<div class="lightbox">

<img alt="Animations in action" width="440" src="generated/images/guide/animations/route-animation.gif">

</div>

## ルーティング設定

まず、`RouterModule`クラスのメソッドを使用してルーティングを設定します。 
このルーティング設定は、ルーターにナビゲーションする方法を指示します。

`RouterModule.forRoot`メソッドを使用してルーティングを定義します。 
また、この`RouterModule`をメインモジュールである`AppModule`の`imports`配列に追加します。

<div class="alert is-helpful">

***NOTE**: <br />
ルートモジュールである`AppModule`の`RouterModule.forRoot`メソッドを使用して、トップレベルのアプリケーションルーティングとプロバイダーを登録します。 
その他の細分化された機能ごとのモジュールについては、`RouterModule.forChild`メソッドを代わりに呼び出します。

</div>

次の設定では、アプリケーションのルーティングを定義します。

<code-example path="animations/src/app/app.module.ts" header="src/app/app.module.ts" region="route-animation-data" language="typescript"></code-example>

`home`および`about`パスは、`HomeComponent`および`AboutComponent`ビューに関連付けられます。 
ルーティング設定は、ナビゲーションが対応するパスと一致したときに、`HomeComponent`ビューと`AboutComponent`ビューをインスタンス化するようにAngularルーターに指示します。

The `data` property of each route defines the key animation-specific configuration associated with a route.
ルーティングが変更されると、`data`プロパティの値が`AppComponent`に渡されます。 

<div class="alert is-helpful">

**NOTE**: <br />
使用する `data`プロパティの名前は任意です。 
たとえば、前の例で使用されている名前*animation*は任意の選択肢です。

</div>

## ルーターアウトレット

After configuring the routes, add a `<router-outlet>` inside the root `AppComponent` template. 
The `<router-outlet>` directive tells the Angular router where to render the views when matched with a route.

The `ChildrenOutletContexts` holds information about outlets and activated routes.
The `data` property of each `Route` can be used to animate routing transitions.

<code-example path="animations/src/app/app.component.html" header="src/app/app.component.html" region="route-animations-outlet"></code-example>

`AppComponent`は、ビューがいつ変化するかを検出できるメソッドを定義します。 
このメソッドでは、ルーティング設定の`data`プロパティ値に基づいて、アニメーショントリガー(`@routeAnimation`)にアニメーション状態の値を割り当てます。 
次に、ルーティング変更が発生したことを検出する`AppComponent`のメソッド例を示します。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="get-route-animations-data"></code-example>

ここで、`prepareRoute()`メソッドはアウトレットディレクティブ(`#outlet="outlet"`によって確立されます)の値をとり、アクティブなルーティングのカスタムデータに基づいて、アニメーションの状態を表す文字列値を返します。 
このデータを使用して、各ルーティングに対して実行する遷移を制御できます。

## アニメーション定義

アニメーションは、コンポーネント内で直接定義することができます。 
この例では、別々のファイルでアニメーションを定義しているため、アニメーションを再利用できます。

次のコードスニペットは、`slideInAnimation`という名前の付いた再利用可能なアニメーション定義しています。

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts" region="route-animations" language="typescript"></code-example>

アニメーション定義にはいくつかのことを行います:

* 2つの遷移を定義します。 (1つの`trigger`で複数の状態と遷移を定義できます。)
* 遷移中の相対位置を制御するために、ホストビューと子ビューのスタイルを調整します。
* `query()`を使用して、入力された子ビューとホストビューから離れる子ビューを判別します。

ルーティング変更によりアニメーショントリガーが起動され、状態変化に応じた遷移が適用されます。

<div class="alert is-helpful">

**Note:** 遷移状態は、ルーティング構成で定義された`data`プロパティの値と一致する必要があります。
</div>

再利用可能なアニメーション(`slideInAnimation`)を`AppComponent`の`animations`メタデータに追加して、アプリケーションでアニメーション定義を利用可能にします。

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="define" language="typescript"></code-example>

### ホストコンポーネントと子コンポーネントのスタイル設定

During a transition, a new view is inserted directly after the old one and both elements appear on screen at the same time.
To prevent this behavior, update the host view to use relative positioning.
Then, update the removed and inserted child views to use absolute positioning.
Adding these styles to the views animates the containers in place and prevents one view from affecting the position of the other on the page.

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts (excerpt)" region="style-view" language="typescript"></code-example>

### ビューコンテナのクエリ

`query()`メソッドを使用して、現在のホストコンポーネント内の要素を見つけてアニメートします。 
`query(":enter")`ステートメントは挿入されているビューを返し、`query(":leave")`は削除されているビューを返します。

*Home => About*へ遷移しているとしましょう。

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts (excerpt)" region="query" language="typescript"></code-example>

このアニメーションコードは、ビューをスタイリングした後、次の処理を行います:

* `query(':enter', style({ left: '-100%' }))` は、新たに追加されたビューと一致し、これを一番左に配置することで隠します。
* アニメーションを実行するため、離れるビューで`animateChild()`を呼び出します。
* <code>[group](api/animations/group)()</code>関数を使用して、内部アニメーションを並列に実行します。
* <code>[group](api/animations/group)()</code>関数の中で:
    * 削除されたビューをクエリーし、右にスライドするようにアニメーションします。
    * イージング関数と継続時間でビューをアニメーション化することにより、新しいビューにスライドします。 </br>
    このアニメーションの結果、左から右に向かって`about`ビューがスライドします。
* 新しいアニメーションの`animateChild()`メソッドを呼び出して、メインアニメーションが完了した後にその子アニメーションを実行します。

これで、ビューから別のビューへの遷移をアニメーション化させる、基本的なルーティング遷移のアニメーションが完成しました。

## Angularアニメーションの詳細

あなたは次に興味があるかもしれません:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [複雑なアニメーションシーケンス](guide/complex-animation-sequences)
* [再利用可能なアニメーション](guide/reusable-animations)

@reviewed 2022-10-11
