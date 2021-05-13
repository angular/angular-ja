# Angular コンポーネントの概要 {@a angular-components-overview}

コンポーネントは Angular アプリケーションの主な構成要素です。各コンポーネントは次のように構成されています。

* ページに表示するものを宣言する HTML テンプレート
* 振る舞いを定義する Typescript クラス
* テンプレート内でコンポーネントがどのように使用されるかを定義する CSS セレクター
* オプションで、テンプレートに適用される CSS スタイル

このトピックでは、Angular コンポーネントを作成して設定する方法について説明します。

<div class="alert is-helpful">

このトピックで使用されているサンプルコードを表示またはダウンロードするには、<live-example></live-example> を参照してください。

</div>

## 前提条件 {@a prerequisites}

コンポーネントを作成するには、次の前提条件を満たしていることを確認します。

1. [Angular CLI をインストールします](guide/setup-local#install-the-angular-cli)
1. 初期アプリケーションを備えた[Angular ワークスペースを作成します](guide/setup-local#create-a-workspace-and-initial-application)
   プロジェクトを持っていない場合は、`ng new <project-name>` を使ってプロジェクトを作成することができます。ここで、`<project-name>` は Angular アプリケーションの名前です。

## コンポーネントの作成 {@a creating-a-component}

コンポーネントを作成するもっとも簡単な方法は Angular CLI です。手動でコンポーネントを作成することもできます。

### Angular CLI を使ったコンポーネントの作成 {@a creating-a-component-using-the-angular-cli}

Angular CLI を使ってコンポーネントを作成するには:

1. ターミナルウィンドウから、アプリケーションを含むディレクトリに移動します
1. `ng generate component <component-name>` コマンドを実行します。ここで `<component-name>` は新しいコンポーネントの名前です

デフォルトでは、このコマンドは次のものに作成します。

* コンポーネントの名前のついたフォルダ
* コンポーネントファイル `<component-name>.component.ts`
* テンプレートファイル `<component-name>.component.html`
* CSS ファイル `<component-name>.component.css`
* テスト仕様ファイル `<component-name>.component.spec.ts`

ここで、`<component-name>` はコンポーネントの名前です。

<div class="alert is-helpful">

`ng generate component` が新しいコンポーネントを作成する方法を変更することができます。
詳細は Angular CLI ドキュメントの [ng generate component](cli/generate#component-command) を参照してください。

</div>

### コンポーネントを手動で作成する {@a creating-a-component-manually}

Angular CLI は Angular コンポーネントを作成するもっとも簡単な方法ですが、手動でコンポーネントを作成することもできます。
ここでは、既存の Angular プロジェクト内でコアコンポーネントファイルを作成する方法を説明します。

新しいコンポーネントを手動で作成するには:

1. Angular プロジェクトのディレクトリに移動します
1. 新しいファイル `<component-name>.component.ts` を作成します
1. ファイルの先頭に、次の import 文を追加します

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="import">
   </code-example>

1. `import`  文の後に `@Component` デコレーターを追加します

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="decorator-skeleton">
   </code-example>

1. コンポーネントの CSS セレクターを選択します

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="selector">
   </code-example>

   セレクターの選択については、[コンポーネントのセレクタを指定する](#specifying-a-components-css-selector)を参照してください。

1. コンポーネントが情報を表示するために使用する HTML テンプレートを定義します。
   ほとんどの場合、このテンプレートは別の HTML ファイルです

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="templateUrl">
   </code-example>

   コンポーネントのテンプレートの定義については、[コンポーネントのテンプレートの定義](#defining-a-components-template)を参照してください。

1. コンポーネントのテンプレートのスタイルを選択します。
   ほとんどの場合、コンポーネントのテンプレートのスタイルは別のファイルで定義します

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="decorator">
   </code-example>

1. コンポーネントのコードを含む `class` 文を追加します

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="class">
   </code-example>

## コンポーネントの CSS セレクターの指定 {@a specifying-a-components-css-selector}

すべてのコンポーネントには CSS _セレクタ_ が必要です。セレクターは HTML テンプレートの中で対応するタグを見つけたらどこでも、そのコンポーネントをインスタンス化するように Angular に指示します。たとえば、`hello-world.component.ts` が `app-hello-world` というセレクターを定義しているコンポーネントを考えてみましょう。このセレクターは、テンプレートに `<app-hello-world>` タグが現れるたびに、このコンポーネントのインスタンスを作成するように Angular に指示します。

コンポーネントのセレクターを指定するには、`@Component` デコレーターに `selector` 文を追加します。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.ts"
    region="selector">
</code-example>

## コンポーネントのテンプレートの定義 {@a defining-a-components-template}

テンプレートとは、アプリケーション内でコンポーネントをどのようにレンダリングするかを Angular に指示する HTML のブロックです。
コンポーネントのテンプレートを定義するには、外部ファイルを参照する方法と、コンポーネント内で直接定義する方法の2つの方法があります。

テンプレートを外部ファイルとして定義するには、`@Component` デコレーターに `templateUrl` プロパティを追加します。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.ts"
    region="templateUrl">
</code-example>

コンポーネント内でテンプレートを定義するには、使用したい HTML を含む `@Component` デコレーターに `template` プロパティを追加します。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.1.ts"
    region="template">
</code-example>

テンプレートを複数行にまたがるようにしたい場合は、バックティック (<code> ` </code>) を使うことができます。
たとえば、次のようになります。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.2.ts"
    region="templatebacktick">
</code-example>

<div class="alert is-helpful">

Angular コンポーネントは、`template` または `templateUrl` で定義されたテンプレートを必要とします。コンポーネントの中で両方の記述をもつことはできません。

</div>

## コンポーネントのスタイルの宣言 {@a declaring-a-components-styles}

コンポーネントのスタイルは、外部ファイルを参照するか、コンポーネント内で直接宣言するかの 2 つの方法でテンプレートの使用を宣言することができます。

コンポーネントのスタイルを別のファイルで宣言するには、`@Component` デコレーターに `styleUrls` プロパティを追加します。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.ts"
    region="decorator">
</code-example>

コンポーネント内でスタイルを宣言するには、使用したいスタイルを含む `styles` プロパティを `@Component` デコレーターに追加します。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.3.ts"
    region="styles">
</code-example>

`styles` プロパティは、CSS ルールの宣言を含む文字列の配列を取ります。


## 次のステップ {@a next-steps}

* コンポーネントのアーキテクチャの概要については、[コンポーネントとテンプレート入門](guide/architecture-components)を参照してください
* コンポーネントを作成する際に使用できるその他のオプションについては、API リファレンスの [Component](api/core/Component) を参照してください
* コンポーネントのスタイルについては、[コンポーネントスタイル](guide/component-styles)を参照してください
* テンプレートの詳細については、[テンプレート構文](guide/template-syntax)を参照してください

@reviewed 2021-03-18
