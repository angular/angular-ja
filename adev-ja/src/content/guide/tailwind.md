# AngularでTailwind CSSを使用する

[Tailwind CSS](https://tailwindcss.com/)は、HTMLを離れることなくモダンなウェブサイトを構築するために使用できる、ユーティリティファーストのCSSフレームワークです。このガイドでは、AngularプロジェクトでTailwind CSSをセットアップする方法を説明します。

## Tailwind CSSのセットアップ {#setting-up-tailwind-css}

### 1. Angularプロジェクトを作成する {#create-an-angular-project}

まず、まだAngularプロジェクトをセットアップしていない場合は、新しいプロジェクトを作成します。

```shell
ng new my-project
cd my-project
```

### 2. Tailwind CSSをインストールする {#install-tailwind-css}

次に、Angularプロジェクトのルートディレクトリでターミナルを開き、次のコマンドを実行してTailwind CSSとそのpeer dependencyをインストールします:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
</docs-code-multifile>

### 3. PostCSSプラグインを設定する {#configure-postcss-plugins}

次に、プロジェクトのファイルルートに`.postcssrc.json`ファイルを追加します。
PostCSSの設定に`@tailwindcss/postcss`プラグインを追加します。

<docs-code language="json" header=".postcssrc.json">
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
</docs-code>

### 4. Tailwind CSSをインポートする {#import-tailwind-css}

Tailwind CSSをインポートする`@import`を`./src/styles.css`に追加します。

<docs-code language="css" header="src/styles.css">
@import "tailwindcss";
</docs-code>

SCSSを使用している場合は、`@use`を`./src/styles.scss`に追加します。

<docs-code language="scss" header="src/styles.scss">
@use "tailwindcss";
</docs-code>

### 5. プロジェクトでTailwindを使い始める {#start-using-tailwind-in-your-project}

これで、コンポーネントのテンプレートでTailwindのユーティリティクラスを使用して、アプリケーションのスタイルを設定できるようになります。

たとえば、次の内容を`app.html`ファイルに追加できます:

<docs-code language="html">
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
</docs-code>

### 6. プロジェクトでTailwindを使い始める {#start-using-tailwind-in-your-project}

`ng serve`でビルドプロセスを実行すると、スタイルが適用された見出しが表示されるはずです。

## その他のリソース {#additional-resources}

- [Tailwind CSSドキュメント](https://tailwindcss.com/docs)
