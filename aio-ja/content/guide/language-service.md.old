# Angular Language Service

Angular Language Serviceは、HTMLファイルの外部にあるか、
または文字列内のアノテーション/デコレーターに埋め込まれているかにかかわらず、
Angularテンプレート内で補完、エラー、ヒント、およびナビゲーションを取得する方法です。
Angular Language Serviceは、Angularファイルを開いたことを自動検出し、
`tsconfig.json`ファイルを読み込み、アプリケーションの中のすべてのテンプレートを見つけ、
そして開いたテンプレートにLanguage Serviceを提供します。


## オートコンプリート

オートコンプリートを使用すると、入力時にコンテキスト上の可能性やヒントを提供して開発時間を短縮できます。
この例は、補間でのオートコンプリートを示しています。
あなたがそれを入力すると、タブを押して完了することができます。

<figure>
  <img src="generated/images/guide/language-service/language-completion.gif" alt="autocompletion">
</figure>

要素内に補完もあります。
コンポーネントセレクターとして持っているすべての要素が
補完リストに表示されます。

## エラーチェック

Angular Language Serviceは、コード内の間違いを予告することもできます。
この例では、Angularは`orders`が何であるか、どこから来るのかを知りません。 

<figure>
  <img src="generated/images/guide/language-service/language-error.gif" alt="error checking">
</figure>

## ナビゲーション

ナビゲーションを使用すると、
コンポーネント、ディレクティブ、モジュールなどがどこにあるかを確認し、
F12キーを押してその定義に直接移動できます。

<figure>
  <img src="generated/images/guide/language-service/language-navigation.gif" alt="navigation">
</figure>


## エディタのAngular Language Service

Angular Language Serviceは現在、[Visual Studio Code](https://code.visualstudio.com/)と[WebStorm](https://www.jetbrains.com/webstorm)で利用可能です。

### Visual Studio Code

Visual Studio Codeでは、左側のメニューペインの下のアイコンからアクセスできるストアから
Angular Language Serviceをインストールします。
また、VS Quick Open (⌘+P on Mac, CTRL+P on Windows) を使用して拡張子を検索することもできます。
それを開いたら、次のコマンドを入力してください: 

```sh
ext install Angular.ng-template
```

その後、インストールボタンをクリックして、Angular Language Serviceをインストールします。 


### WebStorm

WebStormでは、Language Serviceをdev依存関係としてインストールする必要があります。 
Angularはこのdev依存関係を見ると、
WebStormの内部でLanguage Serviceを提供します。
WebStormは、Language Serviceに加えて、テンプレート内の色付けとオートコンプリートを提供します。

`package.json`に必要なdev依存関係は次のとおりです:

```json
devDependencies {
	"@angular/language-service": "^6.0.0"
}
```

次にターミナルで、プロジェクトのルートで、
`npm`または`yarn`を使用して`devDependencies`をインストールします: 

```sh
npm install 
```
*または* 

```sh
yarn
```

*または* 

```sh
yarn install
```


### Sublime Text

[Sublime Text](https://www.sublimetext.com/)では、まずTypeScriptを可能にする拡張機能が必要です。
TypeScriptの最新バージョンをローカルの`node_modules`ディレクトリにインストールします:

```sh
npm install --save-dev typescript
```

次に、Angular Language Serviceを同じ場所にインストールします:
```sh
npm install --save-dev @angular/language-service
```

TypeScript 2.3以降、TypeScriptには、Language Serviceが使用できるLanguage Serviceプラグインモデルがあります。 

次に、ユーザーの設定（`Cmd+,` または `Ctrl+,`）で、次を追加します:

```json
"typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"
```


## プロジェクトへのインストール

次の`npm`コマンドを使用して、プロジェクトにAngular Language Serviceをインストールすることもできます。

```sh
npm install --save-dev @angular/language-service
```
さらに、プロジェクトの`tsconfig.json`の`"compilerOptions"`セクションに以下を追加します。

```json
  "plugins": [
      {"name": "@angular/language-service"}
  ]
```
これは、`.ts`ファイル内の診断と補完のみを提供することに注意してください。
HTMLファイルの補完のためにカスタムのsublimeプラグイン（または現在のプラグインの変更）が必要です。


## Language Serviceの仕組み

Language Serviceを備えたエディターを使うときには、
[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)を介して話す
別の言語プロセス/サービスを起動するエディタープロセスがあります。
エディタの中に入力するたびに、他のプロセスに情報を送信してプロジェクトの状態を追跡します。
テンプレート内で補完リストをトリガーすると、エディタプロセスは最初にテンプレートをHTML ASTまたは[抽象構文木](https://en.wikipedia.org/wiki/Abstract_syntax_tree)に解析します。
次に、Angularコンパイラは、テンプレートが含まれているモジュール、現在のスコープ、コンポーネントセレクターを解釈します。
次に、カーソルがテンプレートASTのどこにあるかを調べます。コンテキストを判断すると、子ができることを判断できます。

補間をしている場合はもう少し複雑です。`div`内に`{{data.---}}`の補間があり、`data.---`の後に補完リストが必要な場合、コンパイラはHTML ASTを使用して答えを見つけることはできません。HTML ASTは、文字"`{{data.---}}`"をもつテキストがあることをコンパイラに通知するだけです。テンプレートパーサーがテンプレートAST内にある式ASTを生成します。次に、Angular Language Serviceは、その文脈の中で`data.---`を調べ、TypeScript Language Serviceにデータのメンバーが何であるかを尋ねます。 TypeScriptは可能性のあるリストを返します。


詳細な情報については[Angular Language Service API](https://github.com/angular/angular/blob/master/packages/language-service/src/types.ts)を参照してください。








<hr>

## 詳細な情報

詳細については、[ng-conf](https://www.ng-conf.org/) 2017の
Angular Language Serviceに関する[Chuck Jazdzewskiのプレゼンテーション](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)を参照してください。


