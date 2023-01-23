# Angular パッケージ形式

このドキュメントでは、Angular Package Format (APF) について説明します。
APF は、すべてのファーストパーティの Angular パッケージ \(`@angular/core`、`@angular/material` など\)とほとんどのサードパーティの Angular ライブラリで使用される、npm パッケージの構造と形式に関する Angular 固有の仕様です。

APF を使用すると、Angular を使用するもっとも一般的なシナリオでパッケージをシームレスに動作させることができます。
APF を使用するパッケージは、Angular チームが提供するツールや、より広い JavaScript エコシステムと互換性があります。
サードパーティのライブラリ開発者は、同じ npm パッケージ形式に従うことをお勧めします。

<div class="alert is-helpful">

APF は Angular の他の部分と一緒にバージョン管理されており、メジャーバージョンごとにパッケージ形式が改善されています。
v13 より前の仕様のバージョンは、この [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) で確認できます。

</div>

## パッケージ形式を指定する理由

今日の JavaScript の状況では、開発者はさまざまなツールチェーン\(Webpack、ロールアップ、esbuild など\)を使用して、さまざまな方法でパッケージを使用しています。
これらのツールは異なる入力を理解し、必要とする場合があります。ツールによっては、最新の ES 言語バージョンを処理できる場合もあれば、古い ES バージョンを直接使用することでメリットが得られる場合もあります。

Angular 配布形式は、一般的に使用されるすべての開発ツールとワークフローをサポートし、最適化に重点を置いて、アプリケーションのペイロードサイズを小さくするか、開発反復サイクル(ビルド時間)を高速化します。

開発者は、Angular CLI と [ng-packagr](https://github.com/ng-packagr/ng-packagr) (Angular CLI が使用するビルドツール)を利用して、Angular パッケージ形式でパッケージを作成できます。
詳細については、[ライブラリの作成](guide/creating-libraries)ガイドを参照してください。

## ファイルのレイアウト

次の例は、パッケージ内の各ファイルの説明とともに、`@angular/core` パッケージのファイルレイアウトの簡略化されたバージョンを示しています。

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

この表は、ファイルとディレクトリの目的を説明するために注釈が付けられた `node_modules/@angular/core` の下のファイルレイアウトを示しています。

| ファイル                                                                                                                                                     | 目的 |
|:---                                                                                                                                                       |:---     |
| `README.md`                                                                                                                                               | npmjs Web UI で使用されるパッケージ README。                                                                                                                                                                          |
| `package.json`                                                                                                                                            | パッケージ自体と、利用可能なすべてのエントリポイントとコード形式を記述するプライマリ `package.json`。 このファイルには、ランタイムとツールがモジュール解決を実行するために使用する「エクスポート」マッピングが含まれています。 |
| `index.d.ts`                                                                                                                                               | プライマリエントリポイント `@angular/core` 用にバンドルされた `.d.ts`。                                                                                                                                                    |
| `esm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `index.mjs` <br /> &nbsp;&nbsp;─ `public_api.mjs`                                         | フラット化されていない ES2020 形式の `@angular/core` ソースのツリー。                                                                                                                                                  |
| `esm2020/testing/`                                                                                                                                        | フラット化されていない ES2020 形式の `@angular/core/testing` エントリポイントのツリー。                                                                                                                                   |
| `fesm2015/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | フラット化された \(FESM\) ES2015 形式のすべてのエントリポイントのコードとソースマップ。                                                                                                                         |
| `fesm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | フラット化された \(FESM\) ES2020 形式のすべてのエントリポイントのコードとソースマップ。                                                                                                                           |
| `testing/`                                                                                                                                                | 「テスト」エントリポイントを表すディレクトリ。                                                                                                                                                               |
| `testing/index.d.ts`                                                                                                                                    | `@angular/core/testing` エントリポイント用にバンドルされた `.d.ts`。                                                                                                                                                     |

## `package.json`

プライマリ `package.json` には、次のような重要なパッケージメタデータが含まれています:

*   パッケージが EcmaScript モジュール \(ESM\) 形式であることを[宣言](#esm-declaration) します。
*   すべてのエントリポイントで利用可能なソースコード形式を定義する [`"exports"` フィールド](#exports) が含まれています。
*   `"exports"` を理解しないツールのために、プライマリ `@angular/core` エントリポイントの利用可能なソースコード形式を定義する[キー](#legacy-resolution-keys)が含まれています。
    これらのキーは非推奨と見なされ、`"exports"` のサポートがエコシステム全体に展開されるにつれて削除される可能性があります。

*   パッケージに[副作用](#side-effects)が含まれているかどうかを宣言します。

### ESM宣言 {@a esm-declaration}

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

主な関心は `"."` と `"./testing"` キーで、`@angular/core` プライマリエントリポイントと `@angular/core/testing` セカンダリエントリポイントで使用可能なコード形式を定義します。 それぞれ。
各エントリポイントで使用できる形式は次のとおりです。

| フォーマット                   | 詳細 |
|:---                       |:---     |
| タイピング \(`.d.ts` ファイル\) | `.d.ts` ファイルは、特定のパッケージに依存するときに TypeScript によって使用されます。                                                                                                           |
| `es2020`                  | ES2020 コードは 1 つのソースファイルにフラット化されています。                                                                                                                                  |
| `es2015`                  | ES2015 コードは 1 つのソースファイルにフラット化されています。                                                                                                                                  |
| `esm2020`                 | フラット化されていないソースファイル内の ES2020 コード(この形式は実験用に含まれています - 詳細については、[デフォルトに関するこの説明](#note-about-the-defaults-in-packagejson)を参照してください)。 |

これらのキーを認識しているツールは、"exports" から望ましいコード形式を優先的に選択する場合があります。
残りの 2 つのキーは、ツールのデフォルトの動作を制御します。

*   `"node"` は、パッケージが Node.js に読み込まれるときにフラット化された ES2015 コードを選択します。

    この形式は、ネイティブの `async`/`await` ES2017 構文をサポートしない `zone.js`の要件により使用されます。
    したがって、Node は ES2015 コードを使用するように指示されます。ここで、`async`/`await` 構造は Promises にダウンレベルされています。

*   `"default"` は、他のすべてのコンシューマーに対してフラット化された ES2020 コードを選択します。

ライブラリは、Sass ミックスインやコンパイル済み CSS などの JavaScript ベースのエントリポイントのエクスポートによってキャプチャされない追加の静的ファイルを公開する必要がある場合があります。

詳細については、[ライブラリ内のアセットの管理](guide/creating-libraries#managing-assets-in-a-library)を参照してください。

### レガシー解決キー {@a legacy-resolution-keys}

`"exports"` に加えて、最上位の `package.json` は、`"exports"` をサポートしないリゾルバーのレガシーモジュール解決キーも定義します。
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

前のコードスニペットに示されているように、モジュールリゾルバーはこれらのキーを使用して、特定のコード形式を読み込むことができます。

<div class="alert is-helpful">

**注意**: <br />
`"default"` の代わりに、`"module"` は Node.js と、特定のキーを使用するように構成されていないツールの両方のための形式を選択します。
`"node"` と同様に、ZoneJS の制約により ES2015 コードが選択されます。

</div>

### 副作用 {@a side-effects}

`package.json` の最後の機能は、パッケージに[副作用](#sideeffects-flag)があるかどうかを宣言することです。

<code-example language="javascript">

{
  "sideEffects": false
}

</code-example>

ほとんどの Angular パッケージはトップレベルの副作用に依存すべきではないため、この宣言を含める必要があります。

## エントリポイントとコード分割

Angular Package Format のパッケージには、1つのプライマリエントリポイントと0個以上のセカンダリエントリポイントが含まれます\(たとえば、`@angular/common/http`\)。
エントリポイントはいくつかの機能を果たします。

1.  これらは、ユーザーがコードをインポートするモジュール指定子を定義します\(たとえば、`@angular/core` および `@angular/core/testing`\)。

    ユーザーは通常、これらのエントリポイントを、目的や機能が異なるシンボルの個別のグループとして認識します。

    特定のエントリポイントは、テストなどの特別な目的にのみ使用できます。
    このような API は、プライマリエントリポイントから分離して、誤ってまたは誤って使用される可能性を減らすことができます。

1.  これらは、コードを遅延ロードできる粒度を定義します。

    最新のビルドツールの多くは、ES モジュールレベルでの「コード分割」\(遅延読み込みとも呼ばれます)のみが可能です。
    Angular Package Format は、主にエントリポイントごとに単一の「フラット」ES モジュールを使用します。これは、ほとんどのビルドツールが、単一のエントリポイントをもつコードを複数の出力チャンクに分割できないことを意味します。

APF パッケージの一般的な規則は、論理的に接続されたコードの可能な限り最小のセットにエントリポイントを使用することです。
たとえば、Angular Material パッケージは、各論理コンポーネントまたはコンポーネントのセットを個別のエントリポイント(Button 用、Tabs 用など)として公開します。
これにより、必要に応じて、各 Material コンポーネントを個別に遅延ロードできます。

すべてのライブラリがこのような粒度を必要とするわけではありません。
単一の論理的な目的をもつほとんどのライブラリは、単一のエントリポイントとして公開する必要があります。
たとえば、`@angular/core` は、ランタイムに単一のエントリポイントを使用します。これは、Angular ランタイムが一般に単一のエンティティとして使用されるためです。

### セカンダリエントリポイントの解決

セカンダリエントリポイントは、パッケージの `package.json` の `"exports"` フィールドを介して解決できます。

## README.md

npm および GitHub でパッケージの説明を表示するために使用される Markdown 形式の README ファイル。

&commat;angular/core パッケージの README コンテンツの例:

<code-example language="html">

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

</code-example>

## 部分コンパイル

Angular Package Format のライブラリは、「部分コンパイル」モードで公開する必要があります。
これは、特定の Angular ランタイムバージョンに関連付けられていないコンパイル済み Angular コードを生成する `ngc` のコンパイルモードです。アプリケーションに使用される完全なコンパイルとは対照的に、Angular コンパイラとランタイムバージョンが正確に一致する必要があります。

Angular コードを部分的にコンパイルするには、`tsconfig.json` の `angularCompilerOptions` プロパティで `compilationMode` フラグを使用します。

<code-example language="javascript">

{
  &hellip;
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}

</code-example>

部分的にコンパイルされたライブラリコードは、アプリケーションのビルドプロセス中に Angular CLI によって完全にコンパイルされたコードに変換されます。

ビルドパイプラインで Angular CLI を使用しない場合は、[Angular CLI 外で部分的な ivy コードを使用する](guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli) ガイドを参照してください。

## 最適化

### ES モジュールの平坦化

Angular Package Format は、コードが「フラット化された」ES モジュール形式で公開されることを指定します。
これにより、Angular アプリケーションのビルド時間と、最終的なアプリケーションバンドルのダウンロードおよび解析時間が大幅に短縮されます。
Nolan Lawson による優れた投稿 ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) をチェックしてください。

Angular コンパイラは、インデックス ES モジュールファイルを生成できます。 Rollup などのツールは、これらのファイルを使用して、フラット化されたモジュールを *Flattened ES Module* (FESM) ファイル形式で生成できます。

FESM は、エントリポイントからアクセス可能なすべての ES モジュールを 1 つの ES モジュールにフラット化することによって作成されるファイル形式です。
これは、パッケージからのすべてのインポートをたどり、そのコードを単一のファイルにコピーすることによって形成されますが、すべてのパブリック ES エクスポートを保持し、すべてのプライベートインポートを削除します。

*phe-som* と発音される省略名 FESM の後には、FESM5 や FESM2015 などの番号を付けることができます。
数値は、モジュール内の JavaScript の言語レベルを表します。
したがって、FESM5 ファイルは ESM+ES5 になり、インポート/エクスポート文と ES5 のソースコードが含まれます。

フラット化された ES Module インデックスファイルを生成するには、tsconfig.json ファイルで次の構成オプションを使用します。

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

#### package.json のデフォルトに関する注意 {@a note-about-the-defaults-in-packagejson}

webpack v4 の時点で、ES モジュールの最適化のフラット化は、webpack ユーザーには必要ありません。 webpack でモジュールをフラット化することなく、コード分割を改善できるはずです。
実際には、フラット化されていないモジュールを webpack v4 の入力として使用すると、サイズの回帰が見られることがあります。
これが、`module` および `es2020` package.json エントリがまだ FESM ファイルを指している理由です。
この問題は調査中です。 サイズ回帰の問題が解決された後、`module`および`es2020`のpackage.json エントリポイントをフラット化されていないファイルに切り替えることが期待されています。
APF には現在、このような将来の変更を検証する目的で、フラット化されていない ESM2020 コードが含まれています。

### "sideEffects" フラグ {@a sideeffects-flag}

デフォルトでは、EcmaScript モジュールは副作用があります。モジュールからインポートすると、そのモジュールの最上位レベルにあるすべてのコードが実行されます。
典型的なモジュールのほとんどの副作用のあるコードは真に副作用があるわけではなく、代わりに特定のシンボルにのみ影響するため、これはしばしば望ましくありません。
これらのシンボルがインポートおよび使用されていない場合は、ツリーシェイキングと呼ばれる最適化プロセスでそれらを削除することが望ましいことが多く、副作用のあるコードによってこれを防ぐことができます。

Webpack などのビルドツールは、モジュールの最上位レベルで副作用のあるコードに依存しないことをパッケージが宣言できるようにするフラグをサポートし、ツールがパッケージからコードをツリーシェイクする自由度を高めます。
これらの最適化の最終結果は、バンドルサイズが小さくなり、コード分割後のバンドルチャンクでのコード分散が改善されるはずです。
この最適化は、ローカルではない副作用が含まれている場合、コードを壊す可能性があります。ただし、これは Angular アプリケーションでは一般的ではなく、通常は設計が悪いことを示しています。
`sideEffects` プロパティを `false` に設定することで、すべてのパッケージが副作用のないステータスを主張し、開発者が [Angular Style Guide](https://angular.io/guide/styleguide) に従うことをお勧めします。これにより、非ローカルな副作用のないコードが自然に得られます。

詳細: [副作用に関する webpack ドキュメント](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### ES2020 言語レベル

ES2020 言語レベルは、Angular CLI やその他のツールで使用されるデフォルトの言語レベルになりました。
Angular CLI は、アプリケーションのビルド時に対象となるすべてのブラウザでサポートされる言語レベルにバンドルをダウンレベルします。

### d.ts バンドル / 型定義の平坦化

APF v8 の時点で、[API Extractor](https://api-extractor.com) を実行して TypeScript 定義をバンドルし、API 全体が 1 つのファイルに表示されるようにすることが推奨されるようになりました。

以前の APF バージョンでは、各エントリポイントには .d.ts エントリポイントの隣に `src` ディレクトリがあり、このディレクトリには元のソースコードの構造に一致する個々の d.ts ファイルが含まれていました。
この配布形式は引き続き許可およびサポートされていますが、不適切なオートコンプリートを提供する IDE などのツールを混乱させ、通常はライブラリまたはパッケージ。

### Tslib

APF v10 では、プライマリエントリポイントの直接の依存関係として tslib を追加することをお勧めします。
これは、tslib のバージョンが、ライブラリのコンパイルに使用される TypeScript のバージョンに関連付けられているためです。

## 例

*   [@angular/core パッケージ](https://unpkg.com/browse/@angular/core@13.0.0-rc.0)
*   [@angular/material パッケージ](https://unpkg.com/browse/@angular/material@13.0.0-rc.0)

## 用語の定義

次の用語は、このドキュメント全体で意図的に使用されています。
このセクションでは、さらに明確にするために、それらすべての定義を示します。

#### パッケージ

NPM にパブリッシュされ、一緒にインストールされるファイルの最小セット (例: `@angular/core`)。
このパッケージには、package.json と呼ばれるマニフェスト、コンパイルされたソースコード、typescript 定義ファイル、ソースマップ、メタデータなどが含まれます。
パッケージは `npm install @angular/core` でインストールされます。

#### シンボル

モジュールに含まれるクラス、関数、定数、または変数であり、オプションでモジュールエクスポートを介して外部の世界に表示されます。

#### モジュール

ECMAScript モジュールの略。
シンボルをインポートおよびエクスポートする文を含むファイル。
これは、ECMAScript 仕様のモジュールの定義と同じです。

#### ESM

ECMAScript モジュールの略 \(上記参照\)。

#### FESM

Flattened ES Modules の略で、エントリポイントからアクセスできるすべての ES Module を 1 つの ES Module にフラット化することによって作成されたファイル形式で構成されます。

#### モジュール ID

import ステートメントで使用されるモジュールの識別子 \(例: `@angular/core`\)。
多くの場合、ID はファイルシステム上のパスに直接マップされますが、さまざまなモジュール解決戦略が原因で、常にそうとは限りません。

#### モジュール指定子

モジュール識別子 \(上記参照\)。

#### モジュール解決戦略

モジュール ID をファイルシステム上のパスに変換するために使用されるアルゴリズム。
Node.js には、明確に指定され、広く使用されているものがあります。 TypeScript は、いくつかのモジュール解決戦略をサポートしています。[Closure Compiler](https://developers.google.com/closure/compiler) にはさらに別の戦略があります。

#### モジュール形式

ファイルからインポートおよびエクスポートするための構文を少なくともカバーするモジュール構文の仕様。
一般的なモジュール形式は、CommonJS \(通常は Node.js アプリケーションに使用される CJS\) または ECMAScript モジュール \(ESM\) です。
モジュールの形式は、個々のモジュールのパッケージ化のみを示しており、モジュールのコンテンツを構成するために使用される JavaScript 言語の機能は示していません。
このため、Angular チームは言語レベル指定子をモジュール形式のサフィックスとして使用することがよくあります \(たとえば、ESM+ES2015 は、モジュールが ESM 形式であり、ES2015 にダウンレベルされたコードを含むことを指定します\)。

#### バンドル

ビルドツール \([Webpack](https://webpack.js.org) や [Rollup](https://rollupjs.org) など\) によって生成される単一の JS ファイルの形式のアーティファクトで、1 つ以上のモジュールに由来するシンボルが含まれています。
バンドルはブラウザ固有の回避策であり、ブラウザが数万ではないにしても数百のファイルのダウンロードを開始した場合に発生するネットワークの負荷を軽減します。
通常、Node.js はバンドルを使用しません。
一般的なバンドル形式は、UMD と System.register です。

#### 言語レベル

コードの言語 \(ES2015 または ES2020\)。
モジュール形式に依存しません。

#### エントリーポイント

ユーザーがインポートすることを意図したモジュール。
一意のモジュール ID によって参照され、そのモジュール ID によって参照されるパブリック API をエクスポートします。
例は `@angular/core` または `@angular/core/testing` です。
どちらのエントリポイントも `@angular/core` パッケージに存在しますが、異なるシンボルをエクスポートします。
パッケージには、多数のエントリポイントを含めることができます。

#### ディープインポート

エントリポイントではないモジュールからシンボルを取得するプロセス。
これらのモジュール ID は、通常、プロジェクトの有効期間中、または特定のパッケージのバンドルの作成中に変更できるプライベート API と見なされます。

#### トップレベルのインポート

エントリポイントからのインポート。
利用可能なトップレベルのインポートは、パブリック API を定義するものであり、 `@angular/core` や `@angular/common` などの「&commat;angular/name」モジュールで公開されます。

#### ツリーシェイク

アプリケーションで使用されていないコードを特定して削除するプロセス。デッドコードの削除とも呼ばれます。
これは、[Rollup](https://rollupjs.org)、[Closure Compiler](https://developers.google.com/closure/compiler)、または [Terser](https://github.com/terser/terser) などのツールを使用してアプリケーションレベルで実行されるグローバルな最適化です。

#### AOT コンパイラ

Angular 用の Ahead of Time コンパイラ。

#### フラット化された型の定義

[API Extractor](https://api-extractor.com) から生成されたバンドルされた TypeScript 定義。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
