# クイックスタート

良いツールは、あなたが手作業で全てをやるよりも
アプリケーションの開発を素早く、そして保守を簡単にします。

[**Angular CLI**](https://cli.angular.io/) はプロジェクトの作成、ファイルの追加に加え、開発で行うテスト、ビルド、デプロイのタスクを行うための **_コマンドライン・インターフェース・ツール_** です。

このガイドの最終目標は、TypeScriptを用いた簡単なAngularアプリケーションの構築です。
Angular CLIを使うことで、[スタイルガイド](guide/styleguide) に準拠したAngularプロジェクトを生成できます。

この章を読み終える頃には、CLIを使った開発について、そしてドキュメントのサンプルや実際のアプリケーションに対する基礎知識を身につけられるでしょう。

このドキュメントで使うサンプルは<a href="generated/zips/cli-quickstart/cli-quickstart.zip" target="_blank">こちらからダウンロード</a>できます。


<h2 id='devenv'>
  Step 1. 開発環境の構築
</h2>


まずは開発環境を構築するところからはじめましょう。

**[Node.js® と npm](https://nodejs.org/en/download/)** がインストールされていなければ、インストールしてください。

<div class="l-sub-section">


**node `6.9.X` 以上とnpm `3.x.x` 以上がインストールされていることを確認してください。**  
ターミナルまたはコンソールで `node -v` と `npm -v` コマンドを使うことで確認できます。  
古いバージョンをお使いの場合はエラーの原因となりますが、新しいぶんには問題ありません。

</div>


グローバル環境に **[Angular CLI](https://github.com/angular/angular-cli) をインストール**してください。

<code-example language="sh" class="code-shell">
  npm install -g @angular/cli

</code-example>



<h2 id='create-proj'>
  Step 2. 新規プロジェクトを作成する
</h2>


ターミナルを開いてください。

以下のコマンドを実行して、新規プロジェクトと空のアプリケーションを生成してください。

<code-example language="sh" class="code-shell">
  ng new my-app

</code-example>



<div class="l-sub-section">


しばらく待ちましょう。  
新規プロジェクト生成には時間がかかります（待ち時間の大半はnpmでパッケージをインストールする時間です）。


</div>


<h2 id='serve'>
  Step 3: アプリケーションをサーブする
</h2>


プロジェクトのディレクトリに移動して、サーバーを起動してください。

<code-example language="sh" class="code-shell">
  cd my-app
  ng serve --open
</code-example>


`ng serve` コマンドはサーバーを起動します。  
プロジェクトのファイル変更を監視して、変更があれば再度ビルドを行います。

`--open` （または `-o` ）コマンドを使うことで、ブラウザで`http://localhost:4200/` を自動的に開くようにすることもできます。

アプリケーションで以下のような挨拶文が表示されればOKです。

<figure>
  <img src='generated/images/guide/cli-quickstart/app-works.png' alt="The app works!">
</figure>



<h2 id='first-component'>
  Step 4: Angularコンポーネントを編集してみる
</h2>


CLIがあなたのために一つ目のコンポーネントを作成してくれました。
これは _ルートコンポーネント_ で、 `app-root` と名付けられています。  
このファイルは `./src/app/app.component.ts` にあります。

コンポーネントのファイルを開いて、 `title` プロパティを _Welcome to app!!_ から _Welcome to My First Angular App!!_ に変更してみてください。

<code-example path="cli-quickstart/src/app/app.component.ts" region="title" title="src/app/app.component.ts" linenums="false"></code-example>


ブラウザが自動的に更新されて、変更したタイトルになっていますね。
これでも素敵ですが、もっと見た目を良くしましょう。

`src/app/app.component.css` を開いてコンポーネントにスタイルをつけていきましょう。

<code-example path="cli-quickstart/src/app/app.component.css" title="src/app/app.component.css" linenums="false"></code-example>



<figure>
  <img src='generated/images/guide/cli-quickstart/my-first-app.png' alt="クイックスタートアプリの表示結果">
</figure>

見た目がよくなりましたね！


## 次に…
"Hello, World"アプリを使った説明は以上です。

Angularでできるすばらしいことを体験できる
デモアプリケーションを、 [Tour of Heroesのチュートリアル](tutorial) を通して作成する準備ができました。

それとも、もう少しだけ今作ったプロジェクトについて掘り下げて学ぶこともできます。

## プロジェクトファイルについて


Angular CLIプロジェクトは、迅速な実験とエンタープライズソリューションの両方の基礎です。

最初に見るべきファイルは `README.md` です。
このファイルにはCLIコマンドについての基本的な情報が載っています。
ここに書いてあること以外に、もっとAngularCLIについて知りたくなったら
[Angular CLIのリポジトリ](https://github.com/angular/angular-cli) や [Wiki](https://github.com/angular/angular-cli/wiki) を参照してください。

いくつかの生成されたファイルは初めて見るものもあるかもしれませんね。

### `src` フォルダ

あなたのアプリケーションは `src` フォルダの中にあります。
Angularコンポーネント、テンプレート、スタイル、画像などのアプリに必要なものは全てこのフォルダの中に
入っている必要があります。

このフォルダの外にあるファイルは、アプリをビルドするためのものとして捉えてください。

<div class='filetree'>
  <div class='file'>src</div>
  <div class='children'>
    <div class='file'>app</div>
    <div class='children'>
      <div class='file'>app.component.css</div>
      <div class='file'>app.component.html</div>
      <div class="file">app.component.spec.ts</div>
      <div class="file">app.component.ts</div>
      <div class="file">app.module.ts</div>
    </div>
    <div class="file">assets</div>
    <div class='children'>
      <div class="file">.gitkeep</div>
    </div>
    <div class="file">environments</div>
    <div class='children'>
      <div class="file">environment.prod.ts</div>
      <div class="file">environment.ts</div>
    </div>
    <div class="file">favicon.ico</div>
    <div class="file">index.html</div>
    <div class="file">main.ts</div>
    <div class="file">polyfills.ts</div>
    <div class="file">styles.css</div>
    <div class="file">test.ts</div>
    <div class="file">tsconfig.app.json</div>
    <div class="file">tsconfig.spec.json</div>
  </div>
</div>



<style>
  td, th {vertical-align: top}
</style>



<table width="100%">
  <col width="20%">
  </col>
  <col width="80%">
  </col>
  <tr>
    <th>
      File
    </th>
    <th>
      Purpose
    </th>
  </tr>
  <tr>
    <td>

      `app/app.component.{ts,html,css,spec.ts}`

    </td>
    <td>

      HTMLテンプレート、CSSスタイルシート、ユニットテストからなる `AppComponent` を構成します。
      これは成長していく、ネストされたコンポーネントからなるアプリケーションツリーの **根** となるコンポーネントです。

    </td>
  </tr>
  <tr>
    <td>

      `app/app.module.ts`

    </td>
    <td>

      Angularにどのようにアプリを組み立てるかを伝えるための [root モジュール](guide/bootstrapping "AppModule: the root module") である `AppModule` を定義します。
      現時点では `AppComponent` のみ宣言していますが、進めていくうちに他のコンポーネントを宣言するようになります。
      
    </td>
  </tr>
  <tr>
    <td>

      `assets/*`

    </td>
    <td>
      画像など、アプリケーションをビルドするときにまるごとコピーするようなものを入れてください。

    </td>
  </tr>
  <tr>
    <td>

      `environments/*`

    </td>
    <td>
      このフォルダには、環境毎にひとつのファイルを用意してください。
      ビルドをする際に、環境に合ったファイルに動的に置き換えられます。
      例えば、APIのエンドポイントやアナリティクスのトークンなどを開発と本番で分けるような目的に使ってください。
      モックサービスを使うこともあるかもしれません。
      その場合でも、CLIがあなたをサポートします。
      
    </td>
  </tr>
  <tr>
    <td>

      `favicon.ico`

    </td>
    <td>
      どのサイトもブックマークバーではよく見せたいものです。
      あなただけのアイコンを使ってみましょう。

    </td>
  </tr>
  <tr>
    <td>

      `index.html`

    </td>
    <td>

      誰かがあなたのサイトを訪れたときに提供されるHTMLです。
      ほとんどあなたが編集することがありません。
      CLIがビルド時に　`js` や `css` ファイルを追加してくれるので
      `<script>` や `<link>` タグをあなたが手作業で書く必要はありません。      

    </td>
  </tr>
  <tr>
    <td>

      `main.ts`

    </td>
    <td>

      アプリのメインとなるエントリーポイントです。
      アプリケーションを [JITコンパイラ](guide/glossary#jit) でコンパイルし、ブラウザで実行するために
      root モジュール(`AppModule`)を起動します。
      
      ソースコードは何も変えず、 `--aot` フラグを `ng build` や `ng serve` コマンドの後ろにつけるだけで[AOT コンパイラ](guide/aot-compiler)を使用することもできます。

    </td>
  </tr>
  <tr>
    <td>

      `polyfills.ts`

    </td>
    <td>

      ブラウザ毎に使える機能は異なり、サポートされるWeb標準の機能はばらばらです。
      ポリフィルはそれらの差を埋めてくれます。
      `core-js` と `zone.js` でかなり安全になっていますが、 [ブラウザサポートガイド](guide/browser-support) で情報を確認することをおすすめします。

    </td>
  </tr>
  <tr>
    <td>

      `styles.css`

    </td>
    <td>

      グローバルに適用したいスタイルはここに書いてください。
      多くの場合、保守性を高めるためにコンポーネントごとにローカルのスタイルを適用しますが、
      アプリ全体で適用したいものがあればここに書く必要があります。

    </td>
  </tr>
  <tr>
    <td>

      `test.ts`

    </td>
    <td>

      ユニットテストのエントリーポイントです。
      見慣れない設定が多く書かれていますが、あなたがなにか編集する必要はありません。

    </td>
  </tr>
  <tr>
    <td>

      `tsconfig.{app|spec}.json`
    </td>
    <td>

      TSコンパイラ設定ファイルです。Angularアプリには `tsconfig.app.json` を、
      ユニットテストには `tsconfig.spec.json` を使用します。

    </td>
  </tr>
</table>


### ルートフォルダ

`src/` フォルダはプロジェクトのルートフォルダに一つしかないフォルダです。
他のファイルはあなたのアプリのビルド、テスト、保守、ドキュメント作成、デプロイするのを助けるファイルです。
これらのファイルは `src/` と同じくルートフォルダに置かれます。

<div class='filetree'>
  <div class="file">my-app</div>
  <div class='children'>
    <div class="file">e2e</div>
    <div class='children'>
      <div class="file">app.e2e-spec.ts</div>
      <div class="file">app.po.ts</div>
      <div class="file">tsconfig.e2e.json</div>
    </div>
    <div class="file">node_modules/...</div>
    <div class="file">src/...</div>
    <div class="file">.angular-cli.json</div>
    <div class="file">.editorconfig</div>
    <div class="file">.gitignore</div>
    <div class="file">karma.conf.js</div>
    <div class="file">package.json</div>
    <div class="file">protractor.conf.js</div>
    <div class="file">README.md</div>
    <div class="file">tsconfig.json</div>
    <div class="file">tslint.json</div>
  </div>
</div>

<style>
  td, th {vertical-align: top}
</style>



<table width="100%">
  <col width="20%">
  </col>
  <col width="80%">
  </col>
  <tr>
    <th>
      ファイル
    </th>
    <th>
      目的
    </th>
  </tr>
  <tr>
    <td>

      `e2e/`

    </td>
    <td>

      `e2e/` フォルダの中には end-to-endテストが置かれます。
      それらのファイルはあなたのメインアプリをテストするための別のアプリです。
      よって`src/` フォルダの中には置かれるべきではありません。
      また、 `tsconfig.e2e.json` も同じ理由で存在します。

    </td>
  </tr>
  <tr>
    <td>

      `node_modules/`

    </td>
    <td>

      `Node.js` は `package.json` にリストアップされた
      サードパーティのモジュール類をこのフォルダ内に格納します。

    </td>
  </tr>
  <tr>
    <td>

      `.angular-cli.json`

    </td>
    <td>

      Angular CLIのための設定ファイルです。
      このファイルを使っていくつかのデフォルト設定を変更したり、
      ビルド時に含めるファイルを変更することもできます。
      もっと知りたい場合は公式ドキュメントを参照してください。

    </td>
  </tr>
  <tr>
    <td>

      `.editorconfig`

    </td>
    <td>

      あなたのプロジェクトを使う人が全員
      同じエディタの設定を適用できるようにするための設定ファイルです。
      多くのエディタでは `.editorconfig` ファイルをサポートしています。
      詳細は  http://editorconfig.org を参照してください。

    </td>
  </tr>
  <tr>
    <td>

      `.gitignore`

    </td>
    <td>

      ソース管理に自動生成されるファイルを含めないようにするための設定ファイルです。

    </td>
  </tr>
  <tr>
    <td>

      `karma.conf.js`

    </td>
    <td>

      `ng test` で実行できるユニットテスト [Karma test runner](https://karma-runner.github.io) 
      を使うための設定ファイルです。

    </td>
  </tr>
  <tr>
    <td>

      `package.json`

    </td>
    <td>

      あなたのプロジェクトで使う、サードパーティのパッケージを並べた `npm` の設定ファイルです。
      [カスタムスクリプト](https://docs.npmjs.com/misc/scripts) をここに追加することもできます。

    </td>
  </tr>
  <tr>
    <td>

      `protractor.conf.js`

    </td>
    <td>

      `ng e2e` で End-to-endテストを実行する [Protractor](http://www.protractortest.org/) の設定ファイルです。

    </td>
  </tr>
  <tr>
    <td>

      `README.md`

    </td>
    <td>

      あなたのプロジェクトの基本となるドキュメントです。初期状態ではCLIのコマンドについて書かれています。
      他人があなたのリポジトリをチェックアウトした際にアプリをビルドできるように
      アプリと一緒にこのドキュメントも拡張するようにしてください。

    </td>
  </tr>
  <tr>
    <td>

      `tsconfig.json`

    </td>
    <td>

      TypeScriptコンパイラの設定ファイルです。IDEがこのファイルを利用してあなたに便利なツールを提供します。

    </td>
  </tr>
  <tr>
    <td>

      `tslint.json`

    </td>
    <td>

      `ng lint` で[TSLint](https://palantir.github.io/tslint/) と [Codelyzer](http://codelyzer.com/)
      を利用したソースコードのチェック(Lint)を行うための設定ファイルです。
      Lintはコードスタイルに一貫性を持たせるのに役立ちます。

    </td>
  </tr>
</table>

<div class="l-sub-section">

### 次のステップ

Angular初心者であれば、[チュートリアル](tutorial "Tour of Heroes チュートリアル") に進みましょう。  
その際は、すでにAngularCLIを使うための準備は終わっていますので、"セットアップ"の項目は飛ばして構いません。
</div>
