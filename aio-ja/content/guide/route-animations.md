# ルーティング遷移のアニメーション

#### 前提

次の概念への基本的な理解:

* [Angularアニメーション・イントロダクション](guide/animations)
* [アニメーションの遷移とトリガー](guide/transition-and-triggers)
* [再利用可能なアニメーション](guide/reusable-animations)

<hr>

ルーティングを有効にすると、アプリケーション内のさまざまなルーティング間を移動できます。 ユーザーがあるルーティングから別のルーティングにナビゲーションすると、AngularルーターはURLパスを関連するコンポーネントにマップし、そのビューを表示します。 このルーティングの遷移をアニメーション化することで、ユーザー体験を大幅に向上できます。

Angularルーターには、ルーティングが変更されたときにビュー間の遷移をアニメーションできる、高水準なアニメーション機能が付属しています。 ルーティングを切り替えるときにアニメーションシーケンスを生成するには、ネストされたアニメーションシーケンスを定義する必要があります。 ビューをホストする最上位のコンポーネントから始め、埋め込みビューをホストするコンポーネントに追加のアニメーションをネストします。

ルーティング遷移アニメーションを有効にするには、次の手順を実行します:

1.  アプリケーションにルーティングモジュールをインポートし、ルーティング設定を有効にします。
2.  ルーターアウトレットを追加して、アクティブ化されたコンポーネントをDOMのどこに配置するのか、Angularルーターに指示します。
3.  アニメーションを定義します。


`HomeComponent`ビューと`AboutComponent`ビューにそれぞれ関連付けられた2つのルーティング、*Home*と*About*をナビゲーションして、ルーティング遷移アニメーションを説明しましょう。 これらのコンポーネントビューは両方とも`AppComponent`によってホストされる一番上の子です。 ユーザーが2つのルーティングを移動するときに新しいビューを左からスライドインさせ、古いビューを右へスライドアウトさせるルーティング遷移アニメーションを実装します。

</br>

<div class="lightbox">
  <img src="generated/images/guide/animations/route-animation.gif" alt="Animations in action" width="440">
</div>

## ルーティング設定

まず、`RouterModule`クラスのメソッドを使用してルーティングを設定します。 このルーティング設定は、ルーターにナビゲーションする方法を指示します。

`RouterModule.forRoot`メソッドを使用してルーティングを定義します。 また、この`RouterModule`をメインモジュールである`AppModule`の`imports`配列にインポートします。

<div class="alert is-helpful">

**Note:** ルートモジュールである`AppModule`の`RouterModule.forRoot`メソッドを使用して、トップレベルのアプリケーションルーティングとプロバイダーを登録します。 その他の細分化された機能ごとのモジュールについては、`RouterModule.forChild`メソッドを呼び出して追加のルーティング登録を行います。

</div>

次の設定では、アプリケーションのルーティングを定義します。

<code-example path="animations/src/app/app.module.ts" header="src/app/app.module.ts" region="route-animation-data" language="typescript"></code-example>

`home`および`about`パスは、`HomeComponent`および`AboutComponent`ビューに関連付けられます。 ルーティング設定は、ナビゲーションが対応するパスと一致したときに、`HomeComponent`ビューと`AboutComponent`ビューをインスタンス化するようにAngularルーターに指示します。

`path`と`component`に加えて、各ルーティングの`data`プロパティに、ルーティングと関連付けられたキーのアニメーション固有の設定を定義します。 ルーティングが変更されると、`data`プロパティの値が`AppComponent`に渡されます。 また、アニメーション内で消費される追加のデータをルーティングコンフィグレーションへ渡すこともできます。 dataプロパティの値は`routeAnimation`トリガーで定義された遷移と一致する必要がありますが、これについては後で定義します。

<div class="alert is-helpful">

**Note:** 使用する `data`プロパティの名前は任意です。 たとえば、前の例で使用されている名前*animation*は任意の選択肢です。

</div>

## ルーターアウトレット

ルーティングを設定した後、Angularルーターに、ルーティングと一致するビューをレンダリングする場所を伝えます。 ルートの`AppComponent`テンプレートの中に`<router-outlet>`コンテナを挿入して、ルーターアウトレットを設定することができます。

`<router-outlet>`コンテナには、ルーティング設定で設定した`data`プロパティに基づいて、アクティブなルーティングとその状態に関するデータを含む属性ディレクティブがあります。

<code-example path="animations/src/app/app.component.html" header="src/app/app.component.html" region="route-animations-outlet"></code-example>

`AppComponent`は、ビューがいつ変化するかを検出できるメソッドを定義します。 このメソッドでは、ルーティング設定の`data`プロパティ値に基づいて、アニメーショントリガー(`@routeAnimation`)にアニメーション状態の値を割り当てます。 次に、ルーティング変更が発生したことを検出する`AppComponent`のメソッド例を示します。

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="prepare-router-outlet" language="typescript"></code-example>

ここで、`prepareRoute()`メソッドはアウトレットディレクティブ(`#outlet="outlet"`によって確立されます)の値をとり、アクティブなルーティングのカスタムデータに基づいて、アニメーションの状態を表す文字列値を返します。 このデータを使用して、各ルーティングに対して実行する遷移を制御できます。

## アニメーション定義

アニメーションは、コンポーネント内で直接定義することができます。 この例では、別々のファイルでアニメーションを定義しているため、アニメーションを再利用できます。

次のコードスニペットは、`slideInAnimation`という名前の付いた再利用可能なアニメーション定義しています。


<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts" region="route-animations" language="typescript"></code-example>

アニメーション定義にはいくつかのことを行います:

* 2つの遷移を定義します。 1つのトリガーで複数の状態と遷移を定義できます。
* 遷移中の相対位置を制御するために、ホストビューと子ビューのスタイルを調整します。
* `query()`を使用して、入力された子ビューとホストビューから離れる子ビューを判別します。

ルーティング変更によりアニメーショントリガーが起動され、状態変化に応じた遷移が適用されます。

<div class="alert is-helpful">

**Note:** 遷移状態は、ルーティング構成で定義された`data`プロパティの値と一致する必要があります。
</div>

再利用可能なアニメーション(`slideInAnimation`)を`AppComponent`の`animations`メタデータに追加して、アプリケーションでアニメーション定義を利用可能にします。

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="define" language="typescript"></code-example>

### ホストコンポーネントと子コンポーネントのスタイル設定

遷移中、古いビューの直後に新しいビューが挿入され、同時に両方の要素が画面に表示されます。 これを防ぐには、追加のスタイリングをホストビューに適用し、削除して挿入した子ビューに適用します。 ホストビューは相対位置を使用する必要があり、子ビューは絶対位置を使用する必要があります。 スタイルをビューに追加することで、DOMを動かすことなく、コンテナの位置をアニメーション化できます。

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts" region="style-view" language="typescript"></code-example>

### ビューコンテナのクエリ

`query()`メソッドを使用して、現在のホストコンポーネント内の要素を見つけてアニメートします。 `query(":enter")`ステートメントは挿入されているビューを返し、`query(":leave")`は削除されているビューを返します。

*Home => About*へ遷移しているとしましょう。

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts (Continuation from above)" region="query" language="typescript"></code-example>

このアニメーションコードは、ビューをスタイリングした後、次の処理を行います:

* `query(':enter', [style({ left: '-100％' })])`は、新たに追加されたビューと一致し、これを一番左に配置することで隠します。
* アニメーションを実行するため、離れるビューで`animateChild()`を呼び出します。
* `group()`関数を使用して、内部アニメーションを並列に実行します。
* `group()`関数の中で:
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
