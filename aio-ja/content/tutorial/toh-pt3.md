# フィーチャーコンポーネントの作成

現時点では、 `HeroesComponent` はヒーローのリストと選択されたヒーローの詳細の両方を表示しています。

1つのコンポーネントにすべての機能を保持しておくと、アプリケーションが成長するにつれて維持できなくなります。
大きなコンポーネントを、特定のタスクやワークフローに焦点を当てた小さなサブコンポーネントに分割したいと思うでしょう。

このページでは、ヒーローの詳細を別の再利用可能な `HeroDetailComponent` に移動させることで、その道への第一歩を踏み出します。

`HeroesComponent` はヒーローのリストのみを表示します。
`HeroDetailComponent` は選択されたヒーローの詳細を表示します。

<div class="alert is-helpful">

  For the sample app that this page describes, see the <live-example></live-example>.

</div>

## `HeroDetailComponent` を作成する

Angular CLIを使用して､ `hero-detail` という名前の新しいコンポーネントを生成します。

<code-example language="sh">
  ng generate component hero-detail
</code-example>

このコマンドは `HeroDetailComponent` ファイルの雛形を生成して、`AppModule` でこのコンポーネントを宣言します。
このコマンドは次の雛形を生成します:

* `src/app/hero-detail` ディレクトリの作成

このディレクトリの中に4つのファイルを生成します:

* コンポーネントスタイルのためのCSSファイル
* コンポーネントテンプレートのためのHTMLファイル
* `HeroDetailComponent` と名付けられたコンポーネントクラスのTypeScriptファイル
* `HeroDetailComponent` クラスのテストファイル

また、このコマンドは `src/app/app.module.ts` ファイルの `@NgModule` デコレーター中に `declarations` として `HeroDetailComponent` を追加します。


### template を記述する

ヒーローの詳細のHTMLを `HeroesComponent` テンプレートの下部から切り取り、 `HeroDetailComponent` テンプレートに生成されたボイラープレートへ貼り付けます。

貼り付けられたHTMLは `selectedHero` を参照しています。
新しい `HeroDetailComponent` は、選択されたヒーローだけでなく、_どんな_ ヒーローも表示することができます。
なので、テンプレート内すべての "selectedHero" を "hero" に置き換えてください。

完了したら、 `HeroDetailComponent` テンプレートは次のようになります。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.html" header="src/app/hero-detail/hero-detail.component.html"></code-example>

### `@Input()` heroプロパティを追加する

`HeroDetailComponent` テンプレートは、 `Hero` 型であるコンポーネントの `hero` プロパティにバインドされます。

`HeroDetailComponent` クラスのファイルを開いて、` Hero` シンボルをインポートします。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" 
region="import-hero" header="src/app/hero-detail/hero-detail.component.ts (import Hero)">
</code-example>

`hero` プロパティは `@Input()` デコレーターで注釈された[ _Input_ プロパティでなければなりません](guide/inputs-outputs "Input and Output properties")。
これは、_外部の_ `HeroesComponent` がこのようにバインドするためです。

<code-example path="toh-pt3/src/app/heroes/heroes.component.html" region="hero-detail-binding">
</code-example>

`Input` シンボルを含めるために、 `@angular/core` のimport文を修正してください。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" region="import-input" header="src/app/hero-detail/hero-detail.component.ts (import Input)"></code-example>

`@Input()` デコレーターが前に付いた `hero` プロパティを追加します。

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" header="src/app/hero-detail/hero-detail.component.ts" region="input-hero"></code-example>

これが `HeroDetailComponent` クラスに行うべき唯一の変更です。
これ以上のプロパティも、表示のためのロジックも必要ありません。
このコンポーネントは `hero` プロパティを通してheroオブジェクトを受け取り、それを表示するだけです。

## `HeroDetailComponent` を表示する

ヒーローの詳細は、テンプレートのその部分を削除する前は`HeroesComponent`自身が表示していました。
このセクションでは、ロジックを `HeroDetailComponent` に委譲する方法を説明します。

2つのコンポーネントには親子関係があります。
ユーザーがリストからヒーローを選択するたびに新しいヒーローを表示するため、
親の `HeroesComponent` はそれを送ることで、子の `HeroDetailComponent` を制御します。

`HeroesComponent` _class_ は変更せず、_template_ を変更します。

{@a heroes-component-template}

### `HeroesComponent` テンプレートを更新する

`HeroDetailComponent` のセレクターは `'app-hero-detail'` です。

ヒーローの詳細ビューがかつて存在した `HeroesComponent` テンプレートの下部に `<app-hero-detail>` 要素を追加してください。

次のように `HeroesComponent.selectedHero` を、この要素の `hero` プロパティにバインドさせます。

<code-example path="toh-pt3/src/app/heroes/heroes.component.html" region="hero-detail-binding" header="heroes.component.html (HeroDetail binding)">

</code-example>

`[hero]="selectedHero"` は、Angularの[プロパティバインディング](guide/property-binding)です。

これは `HeroesComponent` の `selectedHero` プロパティから、ターゲット要素の `hero` プロパティへの単方向データバインディングです。
ここでは、`HeroDetailComponent` の `hero` プロパティがマッピングされています。

ユーザーがリスト内のヒーローをクリックすると、 `selectedHero` が変更されます。
`selectedHero` が変更されると、_property binding_ は `hero` を更新して、
 `HeroDetailComponent` は新しいヒーローを表示します。

修正された `HeroesComponent` テンプレートはこのようになります：

<code-example path="toh-pt3/src/app/heroes/heroes.component.html"
  header="heroes.component.html"></code-example>

ブラウザがリフレッシュされると、以前と同じようにアプリケーションが再び動き始めます。

## 何が変わったのか？

[以前](tutorial/toh-pt2)は、ユーザーがヒーロー名をクリックするたびに、
ヒーローのリストの下にヒーローの詳細が表示されていました。
今では `HeroDetailComponent` が `HeroesComponent` の代わりにそれらの詳細を表示しています。

元の `HeroesComponent` を2つのコンポーネントにリファクタリングすることで、現在も将来も利益が得られます。

1. `HeroesComponent` の責任を減らしました。

1. 親の `HeroesComponent` に触れることなく、`HeroDetailComponent` をリッチなヒーローエディタに進化させることができます。

1. ヒーローの詳細ビューに触れることなく、 `HeroesComponent` を進化させることができます。

1. 将来のコンポーネントのテンプレートで `HeroDetailComponent` を再利用することができます。

## 最終的なコードレビュー

このページで解説したコードファイルは次のとおりです。

<code-tabs>

  <code-pane header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt3/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>

  <code-pane header="src/app/hero-detail/hero-detail.component.html" path="toh-pt3/src/app/hero-detail/hero-detail.component.html">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt3/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/app.module.ts" path="toh-pt3/src/app/app.module.ts">
  </code-pane>

</code-tabs>

## まとめ

* 独立し、再利用可能な `HeroDetailComponent` を作成しました。


* 親の `HeroesComponent` が子の`HeroDetailComponent` を制御できるように、[プロパティバインディング](guide/property-binding)を使用しました。


* 外部の `HeroesComponent` によるバインディングが `hero` プロパティを利用できるように
[`@Input` デコレータ](guide/inputs-outputs)を使用しました。
