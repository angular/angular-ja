# CLIのesbuildベースビルドシステム

<div class="alert is-important">

esbuildベースのECMAScriptモジュール(ESM)アプリケーションビルドシステム機能は[開発者プレビュー](/guide/releases#developer-preview)で利用可能です。
試すことはできますが、安定版になる前に変更される可能性があり、本番環境でのビルドはまだお勧めできません。

</div>

v16以降では、新しいビルドシステムによってAngularアプリケーションをビルドできるようになりました。この新しいビルドシステムには以下が含まれます:

- ESMを使用した最新の出力フォーマットで、ダイナミックインポート式を使用し、モジュールの遅延ロードをサポートします。
- 初期ビルドとインクリメンタルリビルドの両方で、ビルド時のパフォーマンスが向上。
- [esbuild](https://esbuild.github.io/)や[Vite](https://vitejs.dev/)などの新しいJavaScriptエコシステムツール。

最小限の設定変更で、アプリケーションごとに新しいビルダーを使用することができます。

## Angular CLIアプリケーションでESMビルドシステムを試す

`browser-esbuild`という新しいビルダーが `@angular-devkit/build-angular` パッケージ内で利用可能です。このビルダーは安定したブラウザアプリケーションのビルドシステムを提供する既存の `browser` ビルダーを置き換えるものです。
新しいビルドシステムは `browser` ビルダーを使用するアプリケーションで試してみることができます。

### アプリケーション設定の変更

新しいビルドシステムは、アプリケーションの移行に必要な変更を最小限にするように実装されました。現在、新しいビルドシステムは代替ビルダー (`browser-esbuild`) を使って提供されています。任意のアプリケーションの `build` ターゲットを更新して、新しいビルドシステムを試すことができます。

アプリケーションの`angular.json`には、通常次のような内容が含まれています:

<code-example language="json" hideCopy="true">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</code-example>

必要な変更は`builder`フィールドの変更だけです。

<code-example language="json" hideCopy="true">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
</code-example>

### ビルドを実行する

アプリケーションの設定を更新したら、以前と同じように `ng build` を使ってビルドを行うことができます。開発者プレビューでまだ実装されていない残りのオプションについては、それぞれ警告が発行され、ビルド中はそのオプションは無視されます。

<code-example language="shell">

ng build

</code-example>

### 開発用サーバーの起動

開発用サーバーは新しいビルドシステムを自動的に検出し、アプリケーションのビルドに使用できます。開発用サーバーを起動するために `dev-server` ビルダー設定やコマンドラインを変更する必要はありません。

<code-example language="shell">

ng serve

</code-example>

これまで開発用サーバーで使用していた[コマンドラインオプション](/cli/serve)を引き続き使用することができます。

<div class="alert is-important">

開発者プレビューでは現在HMRをサポートしておらず、HMR関連のオプションは使用されても無視されます。AngularにフォーカスしたHMR機能は現在計画中で、将来のバージョンで導入される予定です。

</div>

### 未実装のオプションと動作

いくつかのオプションはまだ実装されていませんが、ビルドシステムが安定段階に向かうにつれて、将来的に追加される予定です。もしあなたのアプリケーションがこれらのオプションを使用しているのであれば、それらを削除せずにビルドシステムを試すことができます。未実装のオプションに対しては警告が出されますが、無視されます。しかし、あなたのアプリケーションがこれらのオプションのどれかに依存して動作しているのであれば、試すのを待ったほうがよいかもしれません。

- [Bundle budgets](https://github.com/angular/angular-cli/issues/25100) (`budgets`)
- [Localization](https://github.com/angular/angular-cli/issues/25099) (`localize`/`i18nDuplicateTranslation`/`i18nMissingTranslation`)
- [Web workers](https://github.com/angular/angular-cli/issues/25101) (`webWorkerTsConfig`)
- [WASM imports](https://github.com/angular/angular-cli/issues/25102) -- WASMは[標準ウェブAPI](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running)を介して手動でロードすることができます。

`ng-packagr`を使った新しいビルドシステムでのライブラリのビルドもまだできませんが、ライブラリのビルドサポートは将来のリリースで利用可能になる予定です。

### ESM のデフォルトインポートと名前空間インポートの比較

TypeScriptのデフォルトでは、デフォルトエクスポートを名前空間インポートとしてインポートし、それを呼び出し式で使用することができます。これは残念ながらECMAScriptの仕様から逸脱しています。新しいビルドシステムの基礎となるバンドラー(`esbuild`)は、仕様に準拠したESMコードを期待しています。ビルドシステムは、アプリケーションが不正なタイプのパッケージのインポートを使用した場合に警告を生成するようになりました。しかし、TypeScriptが正しい使い方を認めるようにするには、アプリケーションの`tsconfig`ファイルでTypeScriptオプションを有効にする必要があります。[`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop)オプションを有効にすると、ECMAScriptの仕様との整合性が良くなり、TypeScriptチームもこれを推奨しています。有効にすると、パッケージのインポートをECMAScriptに準拠した形に更新することができます。

[`moment`](https://npmjs.com/package/moment)パッケージを例にとると、次のようなアプリケーションコードは実行時エラーを引き起こします:

```ts
import * as moment from 'moment';

console.log(moment().format());
```

ビルドは、潜在的な問題があることを知らせる警告を生成します。警告は次のようなものです:

<code-example format="shell" language="shell" hideCopy="true">
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

</code-example>

しかし、アプリケーションの `esModuleInterop` TypeScriptオプションを有効にし、importを次のように変更することで、ランタイムエラーと警告を回避できます:

```ts
import moment from 'moment';

console.log(moment().format());
```

## 開発用サーバーとしてのVite

Angular CLIでのViteの使用は、現在のところ_開発用サーバーとしての機能のみ_です。基盤となるViteビルドシステムを使わなくても、Viteはクライアントサイドをサポートしたフル機能の開発サーバーを提供し、依存オブジェクトの少ないnpmパッケージにバンドルされています。このため、包括的な開発用サーバー機能を提供する理想的な候補となります。現在の開発用サーバーのプロセスでは、新しいビルドシステムを使ってアプリケーションの開発用ビルドをメモリ上に生成し、その結果をViteに渡してアプリケーションをサーブします。Viteの使用方法は、Webpackベースの開発サーバーと同様に、Angular CLIの `dev-server` ビルダー内にカプセル化されており、現在のところ直接設定することができません。

## 既知の問題

現在、新しいビルドシステムを試す際に遭遇する可能性のある既知の問題がいくつかあります。このリストは最新のものに更新される予定です。もしこれらの問題のどれかが、現在新しいビルドシステムを試すことを妨げているのであれば、将来それが解決されているかもしれませんので、またチェックしてください。

### 実行時に評価されるダイナミックインポート式

静的な値を含まないダイナミックインポート式は、元の形式のまま保持され、ビルド時に処理されません。これは基礎となるバンドラーの制限ですが、将来実装される[予定](https://github.com/evanw/esbuild/pull/2508)です。多くの場合、アプリケーションコードは、既知の潜在的なファイルに対して `if` や `switch` などの何らかの形式の条件文を使って、インポート式を静的な文字列に変更することで動作させることができます。

未対応:

```ts
return await import(`/abc/${name}.json`);
```

対応済:

```ts
switch (name) {
  case 'x':
    return await import('/abc/x.json');
  case 'y':
    return await import('/abc/y.json');
  case 'z':
    return await import('/abc/z.json');
}
```

### 遅延モジュールにおける順序依存の副作用のあるインポート

特定の順序に依存し、複数の遅延モジュールでも使用されるインポート文は、トップレベルの文が順番に実行されないことがあります。
これは副作用のあるモジュールの使い方に依存するもので、一般的なものではなく、 `polyfills` オプションには当てはまりません。
これは基礎となるバンドラーの [不具合](https://github.com/evanw/esbuild/issues/399) が原因であり、将来のアップデートで対処される予定です。

<div class="alert is-important">

非ローカルな副作用をもつモジュールの使用は（ポリフィル以外では）、使用するビルドシステムに関係なく、可能な限り避けることが推奨され、この特定の問題を回避することができます。非ローカルな副作用をもつモジュールは、アプリケーションのサイズと実行時のパフォーマンスの両方に悪影響を及ぼします。

</div>

### Sassとpnpmまたはyarn PnPを組み合わせて使用した場合の長いビルド時間

pnpm または Yarn PnP パッケージ・マネージャーを使用している場合、Sass 解決の非互換性を回避する必要があるため、アプリケーションのビルド時間が長くなる可能性があります。
これらのパッケージ・マネージャーを使用している場合、パッケージを参照する `@import` ディレクティブまたは `@use` ディレクティブをもつ Sass ファイルがパフォーマンスの問題を引き起こす可能性があります。

ビルド時間の増加を緩和する回避策は現在開発中で、ビルドシステムが安定版になる前に利用可能になる予定です。
node_modules モードの Yarn パッケージマネージャーと `npm` パッケージマネージャーはこの問題の影響を受けません。

## 不具合報告

問題点や機能のリクエストは [GitHub](https://github.com/angular/angular-cli/issues) で報告してください。

チームが問題に対処できるよう、可能な限り最小限の再現例を記載してください。
