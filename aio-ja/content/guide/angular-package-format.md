# Angular パッケージ形式

このドキュメントでは、Angular Package Format (APF) について説明します。
APF は、すべてのファースト パーティの Angular パッケージ \(`@angular/core`、`@angular/material` など\) とほとんどのサード パーティの Angular ライブラリで使用される、npm パッケージの構造と形式に関する Angular 固有の仕様です。

APF を使用すると、Angular を使用する最も一般的なシナリオでパッケージをシームレスに動作させることができます。
APF を使用するパッケージは、Angular チームが提供するツールや、より広い JavaScript エコシステムと互換性があります。
サードパーティのライブラリ開発者は、同じ npm パッケージ形式に従うことをお勧めします。

<div class="alert is-helpful">

APF は Angular の他の部分と一緒にバージョン管理されており、メジャー バージョンごとにパッケージ形式が改善されています。
v13 より前の仕様のバージョンは、この [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) で確認できます。

</div>

## パッケージ形式を指定する理由

今日の JavaScript の状況では、開発者はさまざまなツールチェーン \(Webpack、ロールアップ、esbuild など\) を使用して、さまざまな方法でパッケージを使用しています。
これらのツールは異なる入力を理解し、必要とする場合があります。ツールによっては、最新の ES 言語バージョンを処理できる場合もあれば、古い ES バージョンを直接使用することでメリットが得られる場合もあります。

Angular 配布形式は、一般的に使用されるすべての開発ツールとワークフローをサポートし、最適化に重点を置いて、アプリケーションのペイロード サイズを小さくするか、開発反復サイクル (ビルド時間) を高速化します。

開発者は、Angular CLI と [ng-packagr](https://github.com/ng-packagr/ng-packagr) (Angular CLI が使用するビルド ツール) を利用して、Angular パッケージ形式でパッケージを作成できます。
詳細については、[ライブラリの作成](guide/creating-libraries) ガイドを参照してください。

## ファイルのレイアウト

次の例は、パッケージ内の各ファイルの説明とともに、`@angular/core` パッケージのファイル レイアウトの簡略化されたバージョンを示しています。

<div class='filetree'>
    <div class='file'>
      node_modules/@angular/core
    </div>
    <div class='children'>
        <div class='file'>
          README.md &nbsp; <!-- // &lt;-- Package README, used by npmjs web UI. -->
        </div>
        <div class='file'>
          package.json &nbsp; <!-- // &lt;-- Primary package.json, describing the package itself as well as all available entrypoints and code formats. This file contains the "exports" mapping used by runtimes and tools to perform module resolution. -->
        </div>
        <div class='file'>
          index.d.ts &nbsp; <!-- // &lt;-- Bundled .d.ts for the primary entrypoint &commat;angular/core. -->
        </div>
        <div class='file'>
          esm2020 &nbsp; <!-- // &lt;-- Tree of &commat;angular/core sources in unflattened ES2020 format. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              index.mjs
            </div>
            <div class='file'>
              public_api.mjs
            </div>
            <div class='file'>
              testing &nbsp; <!-- // &lt;-- Tree of the &commat;angular/core/testing entrypoint in unflattened ES2020 format. -->
            </div>
        </div>
        <div class='file'>
          fesm2015 &nbsp; <!-- // &lt;-- Code for all entrypoints in a flattened \(FESM\) ES2015 format, along with sourcemaps. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              core.mjs.map
            </div>
            <div class='file'>
              testing.mjs
            </div>
            <div class='file'>
              testing.mjs.map
            </div>
        </div>
        <div class='file'>
          fesm2020 &nbsp; <!-- // &lt;-- Code for all entrypoints in flattened \(FESM\) ES2020 format, along with sourcemaps. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              core.mjs.map
            </div>
            <div class='file'>
              testing.mjs
            </div>
            <div class='file'>
              testing.mjs.map
            </div>
        </div>
        <div class='file'>
          testing &nbsp; <!-- // &lt;-- Directory representing the "testing" entrypoint. -->
        </div>
        <div class='children'>
            <div class='file'>
              index.d.ts &nbsp; <!-- // &lt;-- Bundled .d.ts for the &commat;angular/core/testing entrypoint. -->
            </div>
        </div>
    </div>
</div>

この表は、ファイルとディレクトリの目的を説明するために注釈が付けられた `node_modules/@angular/core` の下のファイル レイアウトを示しています。

| ファイル                                                                                                                                                     | 目的 |
|:---                                                                                                                                                       |:---     |
| `README.md`                                                                                                                                               | npmjs Web UI で使用されるパッケージ README。                                                                                                                                                                          |
| `package.json`                                                                                                                                            | パッケージ自体と、利用可能なすべてのエントリポイントとコード形式を記述するプライマリ `package.json`。 このファイルには、ランタイムとツールがモジュール解決を実行するために使用する「エクスポート」マッピングが含まれています。 |
| `index.d.ts`                                                                                                                                               | プライマリ エントリポイント `@angular/core` 用にバンドルされた `.d.ts`。                                                                                                                                                    |
| `esm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `index.mjs` <br /> &nbsp;&nbsp;─ `public_api.mjs`                                         | フラット化されていない ES2020 形式の `@angular/core` ソースのツリー。                                                                                                                                                  |
| `esm2020/testing/`                                                                                                                                        | フラット化されていない ES2020 形式の `@angular/core/testing` エントリポイントのツリー。                                                                                                                                   |
| `fesm2015/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | フラット化された \(FESM\) ES2015 形式のすべてのエントリポイントのコードとソース マップ。                                                                                                                         |
| `fesm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | フラット化された \(FESM\) ES2020 形式のすべてのエントリポイントのコードとソース マップ。                                                                                                                           |
| `testing/`                                                                                                                                                | 「テスト」エントリポイントを表すディレクトリ。                                                                                                                                                               |
| `testing/index.d.ts`                                                                                                                                    | `@angular/core/testing` エントリポイント用にバンドルされた `.d.ts`。                                                                                                                                                     |

## `package.json`

プライマリ `package.json` には、次のような重要なパッケージ メタデータが含まれています:

*   パッケージが EcmaScript モジュール \(ESM\) 形式であることを [宣言](#esm-declaration) します。
*   すべてのエントリポイントで利用可能なソース コード形式を定義する [`"exports"` フィールド](#exports) が含まれています。
*   `"exports"` を理解しないツールのために、プライマリ `@angular/core` エントリポイントの利用可能なソース コード形式を定義する [キー](#legacy-resolution-keys) が含まれています。
    これらのキーは非推奨と見なされ、`"exports"` のサポートがエコシステム全体に展開されるにつれて削除される可能性があります。

*   パッケージに[副作用](#side-effects)が含まれているかどうかを宣言します。

### ESM宣言

最上位の `package.json` には次のキーが含まれています:

<code-example language="javascript">

{
  "type": "module"
}

</code-example>

これにより、パッケージ内のコードが CommonJS モジュールではなく EcmaScript モジュールを使用していることをリゾルバーに通知します。

### `"exports"`

`"exports"` フィールドの構造は次のとおりです。

<code-example language="javascript">

"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./core.d.ts",
    "esm2020": "./esm2020/core.mjs",
    "es2020": "./fesm2020/core.mjs",
    "es2015": "./fesm2015/core.mjs",
    "node": "./fesm2015/core.mjs",
    "default": "./fesm2020/core.mjs"
  },
  "./testing": {
    "types": "./testing/testing.d.ts",
    "esm2020": "./esm2020/testing/testing.mjs",
    "es2020": "./fesm2020/testing.mjs",
    "es2015": "./fesm2015/testing.mjs",
    "node": "./fesm2015/testing.mjs",
    "default": "./fesm2020/testing.mjs"
  }
}

</code-example>

主な関心は `"."` と `"./testing"` キーで、`@angular/core` プライマリ エントリポイントと `@angular/core/testing` セカンダリ エントリポイントで使用可能なコード形式を定義します。 それぞれ。
各エントリポイントで使用できる形式は次のとおりです。

| フォーマット                   | 詳細 |
|:---                       |:---     |
| タイピング \(`.d.ts` ファイル\) | `.d.ts` ファイルは、特定のパッケージに依存するときに TypeScript によって使用されます。                                                                                                           |
| `es2020`                  | ES2020 コードは 1 つのソース ファイルにフラット化されています。                                                                                                                                  |
| `es2015`                  | ES2015 コードは 1 つのソース ファイルにフラット化されています。                                                                                                                                  |
| `esm2020`                 | フラット化されていないソース ファイル内の ES2020 コード (この形式は実験用に含まれています - 詳細については、[デフォルトに関するこの説明](#note-about-the-defaults-in-packagejson)を参照してください)。 |

これらのキーを認識しているツールは、「エクスポート」から望ましいコード形式を優先的に選択する場合があります。
残りの 2 つのキーは、ツールのデフォルトの動作を制御します。

*   `"node"` は、パッケージが Node.js に読み込まれるときにフラット化された ES2015 コードを選択します。

    この形式は、ネイティブの `async`/`awai` ES2017 構文をサポートしない「zone.js」の要件により使用されます。
    したがって、Node は ES2015 コードを使用するように指示されます。ここで、`async`/`await` 構造は Promises にダウンレベルされています。

*   `"default"` は、他のすべてのコンシューマーに対してフラット化された ES2020 コードを選択します。

ライブラリは、Sass ミックスインやコンパイル済み CSS などの JavaScript ベースのエントリポイントのエクスポートによってキャプチャされない追加の静的ファイルを公開する必要がある場合があります。

詳細については、[ライブラリ内のアセットの管理](guide/creating-libraries#managing-assets-in-a-library)を参照してください。

### レガシー解決キー

`"exports"` に加えて、最上位の `package.json` は、`"exports"` をサポートしないリゾルバーのレガシー モジュール解決キーも定義します。
`@angular/core` の場合:

<code-example language="javascript">

{
  "fesm2020": "./fesm2020/core.mjs",
  "fesm2015": "./fesm2015/core.mjs",
  "esm2020": "./esm2020/core.mjs",
  "typings": "./core.d.ts",
  "module": "./fesm2015/core.mjs",
  "es2020": "./fesm2020/core.mjs",
}

</code-example>

前のコード スニペットに示されているように、モジュール リゾルバーはこれらのキーを使用して、特定のコード形式を読み込むことができます。

<div class="alert is-helpful">

**注意**: <br />
`"default"` の代わりに、`"module"` はノードと、特定のキーを使用するように構成されていないツールの両方の形式を選択します。
`"node"` と同様に、ZoneJS の制約により ES2015 コードが選択されます。

</div>

### 副作用

`package.json` の最後の機能は、パッケージに[副作用](#sideeffects-flag)があるかどうかを宣言することです。

<code-example language="javascript">

{
  "sideEffects": false
}

</code-example>

ほとんどの Angular パッケージはトップレベルの副作用に依存すべきではないため、この宣言を含める必要があります。

## エントリポイントとコード分割

Angular Package Format のパッケージには、1 つのプライマリ エントリポイントと 0 個以上のセカンダリ エントリポイントが含まれます \(たとえば、`@angular/common/http`\)。
エントリポイントはいくつかの機能を果たします。

1.  これらは、ユーザーがコードをインポートするモジュール指定子を定義します \(たとえば、`@angular/core` および `@angular/core/testing`\)。

    ユーザーは通常、これらのエントリポイントを、目的や機能が異なるシンボルの個別のグループとして認識します。

    特定のエントリポイントは、テストなどの特別な目的にのみ使用できます。
    このような API は、プライマリエントリポイントから分離して、誤ってまたは誤って使用される可能性を減らすことができます。

1.  これらは、コードを遅延ロードできる粒度を定義します。

    最新のビルド ツールの多くは、ES モジュール レベルでの「コード分割」\(遅延読み込みとも呼ばれます) のみが可能です。
    Angular Package Format は、主にエントリ ポイントごとに単一の「フラット」ES モジュールを使用します。 これは、ほとんどのビルド ツールが、単一のエントリ ポイントを持つコードを複数の出力チャンクに分割できないことを意味します。

APF パッケージの一般的な規則は、論理的に接続されたコードの可能な限り最小のセットにエントリポイントを使用することです。
たとえば、Angular Material パッケージは、各論理コンポーネントまたはコンポーネントのセットを個別のエントリポイント (Button 用、Tabs 用など) として公開します。
これにより、必要に応じて、各 Materiak コンポーネントを個別に遅延ロードできます。

すべてのライブラリがこのような粒度を必要とするわけではありません。
単一の論理的な目的を持つほとんどのライブラリは、単一のエントリポイントとして公開する必要があります。
たとえば、`@angular/core` は、ランタイムに単一のエントリポイントを使用します。これは、Angular ランタイムが一般に単一のエンティティとして使用されるためです。

### 二次エントリ ポイントの解決

セカンダリ エントリポイントは、パッケージの `package.json` の `exports` フィールドを介して解決できます。

## README.md

npm および GitHub でパッケージの説明を表示するために使用される Markdown 形式の README ファイル。

&commat;angular/core パッケージの README コンテンツの例:

<code-example language="html">

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

このパッケージのソースはメインの [Angular](https://github.com/angular/angular) リポジトリにあります。 問題を提出し、そのレポに対してリクエストをプルしてください。

ライセンス: MIT

</code-example>

## 部分コンパイル

Angular Package Format のライブラリは、「部分コンパイル」モードで公開する必要があります。
これは、特定の Angular ランタイム バージョンに関連付けられていないコンパイル済み Angular コードを生成する `ngc` のコンパイル モードです。アプリケーションに使用される完全なコンパイルとは対照的に、Angular コンパイラとランタイム バージョンが正確に一致する必要があります。

Angular コードを部分的にコンパイルするには、`tsconfig.json` の `angularCompilerOptions` プロパティで `compilationMode` フラグを使用します。

<code-example language="javascript">

{
  &hellip;
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}

</code-example>

部分的にコンパイルされたライブラリ コードは、アプリケーションのビルド プロセス中に Angular CLI によって完全にコンパイルされたコードに変換されます。

If your build pipeline does not use the Angular CLI then refer to the [Consuming partial ivy code outside the Angular CLI] guide.
ビルド パイプラインで Angular CLI を使用しない場合は、[Angular CLI 外で部分的な ivy コードを使用する](guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli) ガイドを参照してください。

## 最適化

### ES モジュールの平坦化

Angular Package Format は、コードが「フラット化された」ES モジュール形式で公開されることを指定します。
これにより、Angular アプリケーションのビルド時間と、最終的なアプリケーション バンドルのダウンロードおよび解析時間が大幅に短縮されます。
Nolan Lawson による優れた投稿 ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) をチェックしてください。

Angular コンパイラは、インデックス ES モジュール ファイルを生成できます。 Rollup などのツールは、これらのファイルを使用して、フラット化されたモジュールを *Flattened ES Module* (FESM) ファイル形式で生成できます。

FESM は、エントリポイントからアクセス可能なすべての ES モジュールを 1 つの ES モジュールにフラット化することによって作成されるファイル形式です。
これは、パッケージからのすべてのインポートをたどり、そのコードを単一のファイルにコピーすることによって形成されますが、すべてのパブリック ES エクスポートを保持し、すべてのプライベート インポートを削除します。

*phe-som* と発音される省略名 FESM の後には、FESM5 や FESM2015 などの番号を付けることができます。
数値は、モジュール内の JavaScript の言語レベルを表します。
したがって、FESM5 ファイルは ESM+ES5 になり、インポート/エクスポート ステートメントと ES5 ソース コードが含まれます。

フラット化された ES Module インデックス ファイルを生成するには、tsconfig.json ファイルで次の構成オプションを使用します。

<code-example language="javascript">

{
  "compilerOptions": {
    &hellip;
    "module": "esnext",
    "target": "es2020",
    &hellip;
  },
  "angularCompilerOptions": {
    &hellip;
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}

</code-example>

インデックスファイル\(たとえば、`my-ui-lib.js`\)が ngc によって生成されると、Rollup などのバンドラーとオプティマイザーを使用して、フラット化された ESM ファイルを生成できます。

#### package.json のデフォルトに関する注意

webpack v4 の時点で、ES モジュールの最適化のフラット化は、webpack ユーザーには必要ありません。 webpack でモジュールをフラット化することなく、コード分割を改善できるはずです。
実際には、フラット化されていないモジュールを webpack v4 の入力として使用すると、サイズの回帰が見られることがあります。
これが、`module` および `es2020` package.json エントリがまだ FESM ファイルを指している理由です。
この問題は調査中です。 サイズ回帰の問題が解決された後、「module」および「es2020」package.json エントリ ポイントをフラット化されていないファイルに切り替えることが期待されています。
APF には現在、このような将来の変更を検証する目的で、フラット化されていない ESM2020 コードが含まれています。

### "sideEffects" フラグ

デフォルトでは、EcmaScript モジュールは副作用があります。モジュールからインポートすると、そのモジュールの最上位レベルにあるすべてのコードが実行されます。
典型的なモジュールのほとんどの副作用のあるコードは真に副作用があるわけではなく、代わりに特定のシンボルにのみ影響するため、これはしばしば望ましくありません。
これらのシンボルがインポートおよび使用されていない場合は、ツリー シェイキングと呼ばれる最適化プロセスでそれらを削除することが望ましいことが多く、副作用のあるコードによってこれを防ぐことができます。

Webpack などのビルド ツールは、モジュールの最上位レベルで副作用のあるコードに依存しないことをパッケージが宣言できるようにするフラグをサポートし、ツールがパッケージからコードをツリーシェイクする自由度を高めます。
これらの最適化の最終結果は、バンドル サイズが小さくなり、コード分割後のバンドル チャンクでのコード分散が改善されるはずです。
この最適化は、ローカルではない副作用が含まれている場合、コードを壊す可能性があります。ただし、これは Angular アプリケーションでは一般的ではなく、通常は設計が悪いことを示しています。
`sideEffects` プロパティを `false` に設定することで、すべてのパッケージが副作用のないステータスを主張し、開発者が [Angular Style Guide](https://angular.io/guide/styleguide) に従うことをお勧めします。これにより、非ローカルな副作用のないコードが自然に得られます。

詳細: [副作用に関する webpack ドキュメント](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### ES2020 言語レベル

ES2020 言語レベルは、Angular CLI やその他のツールで使用されるデフォルトの言語レベルになりました。
Angular CLI は、アプリケーションのビルド時に対象となるすべてのブラウザーでサポートされる言語レベルにバンドルをダウンレベルします。

### d.ts バンドル / 型定義の平坦化

APF v8 の時点で、[API Extractor](https://api-extractor.com) を実行して TypeScript 定義をバンドルし、API 全体が 1 つのファイルに表示されるようにすることが推奨されるようになりました。

以前の APF バージョンでは、各エントリ ポイントには .d.ts エントリ ポイントの隣に「src」ディレクトリがあり、このディレクトリには元のソース コードの構造に一致する個々の d.ts ファイルが含まれていました。
この配布形式は引き続き許可およびサポートされていますが、不適切なオートコンプリートを提供する IDE などのツールを混乱させ、通常はライブラリまたは パッケージ。

### Tslib

APF v10 では、プライマリ エントリ ポイントの直接の依存関係として tslib を追加することをお勧めします。
これは、tslib のバージョンが、ライブラリのコンパイルに使用される TypeScript のバージョンに関連付けられているためです。

## 例

*   [@angular/core パッケージ](https://unpkg.com/browse/@angular/core@13.0.0-rc.0)
*   [@angular/material パッケージ](https://unpkg.com/browse/@angular/material@13.0.0-rc.0)

## Definition of terms

The following terms are used throughout this document intentionally.
In this section are the definitions of all of them to provide additional clarity.

#### Package

The smallest set of files that are published to NPM and installed together, for example `@angular/core`.
This package includes a manifest called package.json, compiled source code, typescript definition files, source maps, metadata, etc.
The package is installed with `npm install @angular/core`.

#### Symbol

A class, function, constant, or variable contained in a module and optionally made visible to the external world via a module export.

#### Module

Short for ECMAScript Modules.
A file containing statements that import and export symbols.
This is identical to the definition of modules in the ECMAScript spec.

#### ESM

Short for ECMAScript Modules \(see above\).

#### FESM

Short for Flattened ES Modules and consists of a file format created by flattening all ES Modules accessible from an entry point into a single ES Module.

#### Module ID

The identifier of a module used in the import statements \(for example, `@angular/core`\).
The ID often maps directly to a path on the filesystem, but this is not always the case due to various module resolution strategies.

#### Module specifier

A module identifier \(see above\).

#### Module resolution strategy

Algorithm used to convert Module IDs to paths on the filesystem.
Node.js has one that is well specified and widely used, TypeScript supports several module resolution strategies, [Closure Compiler](https://developers.google.com/closure/compiler) has yet another strategy.

#### Module format

Specification of the module syntax that covers at minimum the syntax for the importing and exporting from a file.
Common module formats are CommonJS \(CJS, typically used for Node.js applications\) or ECMAScript Modules \(ESM\).
The module format indicates only the packaging of the individual modules, but not the JavaScript language features used to make up the module content.
Because of this, the Angular team often uses the language level specifier as a suffix to the module format, \(for example, ESM+ES2015 specifies that the module is in ESM format and contains code down-leveled to ES2015\).

#### Bundle

An artifact in the form of a single JS file, produced by a build tool \(for example, [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org)\) that contains symbols originating in one or more modules.
Bundles are a browser-specific workaround that reduce network strain that would be caused if browsers were to start downloading hundreds if not tens of thousands of files.
Node.js typically doesn't use bundles.
Common bundle formats are UMD and System.register.

#### Language level

The language of the code \(ES2015 or ES2020\).
Independent of the module format.

#### Entry point

A module intended to be imported by the user.
It is referenced by a unique module ID and exports the public API referenced by that module ID.
An example is `@angular/core` or `@angular/core/testing`.
Both entry points exist in the `@angular/core` package, but they export different symbols.
A package can have many entry points.

#### Deep import

A process of retrieving symbols from modules that are not Entry Points.
These module IDs are usually considered to be private APIs that can change over the lifetime of the project or while the bundle for the given package is being created.

#### Top-Level import

An import coming from an entry point.
The available top-level imports are what define the public API and are exposed in "&commat;angular/name" modules, such as `@angular/core` or `@angular/common`.

#### Tree-shaking

The process of identifying and removing code not used by an application - also known as dead code elimination.
This is a global optimization performed at the application level using tools like [Rollup](https://rollupjs.org), [Closure Compiler](https://developers.google.com/closure/compiler), or [Terser](https://github.com/terser/terser).

#### AOT compiler

The Ahead of Time Compiler for Angular.

#### Flattened type definitions

The bundled TypeScript definitions generated from [API Extractor](https://api-extractor.com).

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
