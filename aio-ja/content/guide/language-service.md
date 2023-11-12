# Angular Language Service

Angular Language ServiceはコードエディタにAngularテンプレート内での補完、エラー、
ヒント、ナビゲーションの機能を提供します。
これらの機能はHTMLファイルとして分割された外部テンプレートやインラインテンプレートに対して動作します。

## Configuring compiler options for the Angular Language Service

To enable the latest Language Service features, set the `strictTemplates` option in `tsconfig.json` by setting `strictTemplates` to `true,` as shown in the following example:

<code-example language="json">

  "angularCompilerOptions": {
    "strictTemplates": true
  }

</code-example>

For more information, see the [Angular compiler options](guide/angular-compiler-options) guide.

## 機能

エディタはAngularファイルを開いていることを自動で検出します。
つづいて、Angular Language Serviceは`tsconfig.json`を読み取り、アプリケーション内に含まれるすべてのテンプレートを探して、
あなたが開く任意のテンプレートに対して言語サービスを提供します。

言語サービスには下記が含まれます：

* 補完候補のリスト表示
* AOTエラーメッセージ
* クイックインフォ
* 定義ジャンプ


### オートコンプリート

入力時に文脈に応じた利用可能なキーワードの候補やヒント情報が提供されるため、
オートコンプリートは開発をスピードアップさせます。
次の例は補間の中でオートコンプリートを表示しています。入力時に
タブを押すと補完候補を確定できます。

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-completion.gif" alt="autocompletion">
</div>

要素内にも補完があります。コンポーネントセレクターとして持っているすべての要素が
補完リストに表示されます。

### エラーチェック

Angular Language Serviceは、コード内の間違いを予告することもできます。
この例では、Angularは`orders`が何であるか、どこから来るのかを知りません。 

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-error.gif" alt="error checking">
</div>

### クイックインフォとナビゲーション

クイックインフォ機能は、コンポーネント、ディレクティブ、モジュールなどがどこから来たのかをホバー表示します。
そこから"Go to definition"をクリックするかF12を押すことによって、定義箇所に直接ジャンプできます。

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-navigation.gif" alt="navigation">
</div>


## エディターにおけるAngular Language Service

現状では、Angular Language Serviceは[Visual Studio Code](https://code.visualstudio.com/)、
[WebStorm](https://www.jetbrains.com/webstorm)、[Sublime Text](https://www.sublimetext.com/)、[Eclipse IDE](https://www.eclipse.org/eclipseide/)の拡張機能として利用可能です。

### Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/)では、[Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)から拡張機能をインストールしてください。マーケットプレイスは、左側のメニューペインにおける拡張機能アイコンから開けます。また、VS Quick Open (⌘+P on Mac, CTRL+P on Windows) に"? ext"と入力して開くことも可能です。In the marketplace, search for Angular Language Service extension, and click the **Install** button.

The Visual Studio Code integration with the Angular language service is maintained and distributed by the Angular team.

### Visual Studio

In [Visual Studio](https://visualstudio.microsoft.com/), install the extension from the [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService). You can open the marketplace from the editor selecting Extensions on the top menu pane, and then selecting Manage Extensions. In the marketplace, search for Angular Language Service extension, and click the **Install** button.

The Visual Studio integration with the Angular language service is maintained and distributed by Microsoft with help from the Angular team. Check out the project [here](https://github.com/microsoft/vs-ng-language-service)

### WebStorm

In [WebStorm](https://www.jetbrains.com/webstorm/), enable the plugin [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs).

Since WebStorm 2019.1, the `@angular/language-service` is not required anymore and should be removed from your `package.json`.

### Sublime Text

[Sublime Text](https://www.sublimetext.com/)では、Language Serviceは、プラグインとしてインストールされた場合にインラインテンプレートのみをサポートします。
HTMLファイル内で補完を有効化するには、別のSublimeプラグインが必要です（または本プラグインの改造が必要です）。

インラインテンプレートでLanguage Serviceを利用するには、TypeScriptの拡張機能としてAngular Language Serviceプラグインをインストールする必要があります。TypeScript 2.3から、TypeScriptには言語サービスから利用可能なプラグインモデルが存在しています。

1. ローカルの`node_modules`ディレクトリ内で最新のTypeScriptをインストールしてください：

```sh
npm install --save-dev typescript
```

2. 同じ場所でAngular Language Serviceパッケージをインストールしてください：

```sh
npm install --save-dev @angular/language-service
```

3. パッケージをインストールしたら、下記をプロジェクトの`tsconfig.json`の`"compilerOptions"`セクションに追記してくｄさい。

<code-example language="json" header="tsconfig.json">
  "plugins": [
      {"name": "@angular/language-service"}
  ]
</code-example>

4. エディタのユーザー設定を開き(`Cmd+,` or `Ctrl+,`)、下記を追記してください：

<code-example language="json" header="Sublime Text user preferences">
"typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"
</code-example>

これでAngular Language Serviceがエラーチェックや補完を`.ts`ファイルで提供するようになります。

### Eclipse IDE

Either directly install the "Eclipse IDE for Web and JavaScript developers" package which comes with the Angular Language Server included, or from other Eclipse IDE packages, use Help > Eclipse Marketplace to find and install [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml).

### Neovim

1. [Setup coc.nvim](https://github.com/neoclide/coc.nvim)

2. [Configure the Angular Language Service](https://github.com/iamcco/coc-angular/issues/70#issuecomment-1616340751)

```
{
  "languageserver": {
    "angular": {
      "command": "ngserver",
      "args": [
        "--stdio",
        "--tsProbeLocations",
        "/usr/local/lib/node_modules/typescript/lib",
        "--ngProbeLocations",
        "/usr/local/lib/node_modules/@angular/language-server/bin"
      ],
      "filetypes": ["ts", "typescript", "html"],
      "trace.server.verbosity": "verbose"
    }
  }
}
```

## Language Serviceの仕組み

エディタが言語サービスとともに利用されるとき、エディタは分離された言語サービスのプロセスを起動して、
[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)を通じて、[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)を使って通信します。
あなたがエディタに入力すると、エディタはその情報を言語サービスのプロセスへ送信して
プロジェクトの状態を追跡します。

あなたがテンプレートの中で補完候補のリストを呼び出すとき、まずエディタはテンプレートを
HTML [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree)へパースします。
Angularのコンパイラがパースされた木構造を解析して、テンプレートがどのモジュールに含まれているか、現在のスコープ、コンポーネントのセレクター、カーソルがテンプレートASTのどこにあるのか、といったコンテキスト情報を決定します。

補間の場合はもう少し複雑です。
ある`div`要素内の`{{data.---}}`という補間があり、`data.---`の部分で補完候補が必要な場合、答えを求めるにはHTML ASTは使えません。
このHTML ASTは、ただ"`{{data.---}}`"というテキスト文字列が存在していることをコンパイラへ伝えるだけです。
テンプレートパーサーがテンプレートAST内にあるAngular expression ASTを生成するのはこのときです。
Angular Language Serviceは、このコンテキストにおける`data.---`を見つけて、TypeScriptの言語サービスに`data`のメンバを問い合わせることで、補完可能な候補のリストを返却するのです。

## 詳細な情報

* 実装のより深い詳細については、
[Angular Language Service API](https://github.com/angular/angular/blob/main/packages/language-service/src/types.ts)を参照してください。

* 設計上の考慮事項や意図の詳細については、[デザインドキュメント](https://github.com/angular/vscode-ng-language-service/wiki/Design)を参照してください。

* [ng-conf](https://www.ng-conf.org/) 2017のAngular Language Serviceに関する[Chuck Jazdzewskiのプレゼンテーション](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)も参照してください。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28