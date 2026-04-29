# Angularアプリケーションのビルド

Angular CLIアプリケーションまたはライブラリは、`ng build`コマンドでビルドできます。
これにより、TypeScriptコードがJavaScriptにコンパイルされ、必要に応じて出力が最適化、バンドル、ミニファイされます。

`ng build`は、`angular.json`で指定されたデフォルトプロジェクトの`build`ターゲットのビルダーのみを実行します。
Angular CLIには、通常`build`ターゲットとして使用される4つのビルダーが含まれています。

| ビルダー                                        | 目的                                                                                                                                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular-devkit/build-angular:application`     | クライアントサイドバンドル、Nodeサーバー、およびビルド時プリレンダリングされたルートを持つアプリケーションを[esbuild](https://esbuild.github.io/)でビルドします。                      |
| `@angular-devkit/build-angular:browser-esbuild` | ブラウザで使用するクライアントサイドアプリケーションを[esbuild](https://esbuild.github.io/)でバンドルします。詳細については、[`browser-esbuild`ドキュメント](tools/cli/build-system-migration#manual-migration-to-the-compatibility-builder)を参照してください。 |
| `@angular-devkit/build-angular:browser`         | ブラウザで使用するクライアントサイドアプリケーションを[webpack](https://webpack.js.org/)でバンドルします。                                                                                   |
| `@angular-devkit/build-angular:ng-packagr`      | [Angular Package Format](tools/libraries/angular-package-format)に準拠したAngularライブラリをビルドします。                                                                           |

`ng new`で生成されたアプリケーションは、デフォルトで`@angular-devkit/build-angular:application`を使用します。
`ng generate library`で生成されたライブラリは、デフォルトで`@angular-devkit/build-angular:ng-packagr`を使用します。

特定のプロジェクトで使用されているビルダーは、そのプロジェクトの`build`ターゲットを調べることで判断できます。

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invokes the Architect target named `build`.
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          …
        },
        "serve": { … }
        "test": { … }
        …
      }
    }
  }
}
```

このページでは、`@angular-devkit/build-angular:application`の使用法とオプションについて説明します。

## 出力ディレクトリ {#output-directory}

このビルドプロセスの結果はディレクトリに出力されます（デフォルトでは`dist/${PROJECT_NAME}`）。

## サイズバジェットの設定 {#configuring-size-budgets}

アプリケーションは機能が増えるにつれて、サイズも大きくなります。
CLIを使用すると、設定でサイズしきい値を設定して、アプリケーションの各部分が定義したサイズ境界内に収まるようにできます。

サイズ境界は、CLI設定ファイル`angular.json`の、各[設定済み環境](tools/cli/environments)の`budgets`セクションで定義します。

```json
{
  …
  "configurations": {
    "production": {
      …
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "250kb",
          "maximumError": "500kb"
        },
      ]
    }
  }
}
```

アプリケーション全体および特定のパーツに対してサイズバジェットを指定できます。
各バジェットエントリは、特定のタイプのバジェットを設定します。
サイズ値は次の形式で指定します。

| サイズ値 | 詳細 |
| :-------------- | :-------------------------------------------------------------------------- |
| `123`または`123b` | バイト単位のサイズ。 |
| `123kb` | キロバイト単位のサイズ。 |
| `123mb` | メガバイト単位のサイズ。 |
| `12%` | ベースラインに対するサイズの割合。(ベースライン値には無効です。) |

バジェットを設定すると、アプリケーションの特定のパーツが設定した境界サイズに達するか超えた場合に、ビルダーが警告またはエラーを報告します。

各バジェットエントリは、次のプロパティを持つJSONオブジェクトです。

| プロパティ | 値 |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type | バジェットのタイプ。次のいずれかです: <table> <thead> <tr> <th> 値 </th> <th> 詳細 </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> 特定のバンドルのサイズ。 </td> </tr> <tr> <td> <code>initial</code> </td> <td> アプリケーションのブートストラップに必要なJavaScriptとCSSのサイズ。デフォルトでは500kbで警告、1mbでエラーになります。 </td> </tr> <tr> <td> <code>allScript</code> </td> <td> すべてのスクリプトのサイズ。 </td> </tr> <tr> <td> <code>all</code> </td> <td> アプリケーション全体のサイズ。 </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> 任意のコンポーネントスタイルシートのサイズ。デフォルトでは2kbで警告、4kbでエラーになります。 </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> 任意のスクリプトのサイズ。 </td> </tr> <tr> <td> <code>any</code> </td> <td> 任意のファイルのサイズ。 </td> </tr> </tbody> </table> |
| name | バンドルの名前 (`type=bundle`の場合)。 |
| baseline | 比較のためのベースラインサイズ。 |
| maximumWarning | ベースラインに対する警告の最大しきい値。 |
| maximumError | ベースラインに対するエラーの最大しきい値。 |
| minimumWarning | ベースラインに対する警告の最小しきい値。 |
| minimumError | ベースラインに対するエラーの最小しきい値。 |
| warning | ベースラインに対する警告のしきい値 (最小および最大)。 |
| error | ベースラインに対するエラーのしきい値 (最小および最大)。 |

## CommonJS依存関係の設定 {#configuring-commonjs-dependencies}

アプリケーションとその依存関係の全体で、常にネイティブの[ECMAScriptモジュール](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) (ESM) を優先してください。
ESMは、強力な静的解析サポートを備えた完全に規定されたWeb標準およびJavaScript言語機能です。これにより、他のモジュール形式よりもバンドル最適化が強力になります。

Angular CLIは、[CommonJS](https://nodejs.org/api/modules.html)依存関係をプロジェクトにインポートすることもサポートしており、これらの依存関係を自動的にバンドルします。
しかし、CommonJSモジュールは、バンドラーやミニファイアがそれらのモジュールを効果的に最適化するのを妨げ、結果としてバンドルサイズが大きくなる可能性があります。
詳細については、[CommonJSがバンドルを大きくする仕組み](https://web.dev/commonjs-larger-bundles)を参照してください。

Angular CLIは、ブラウザアプリケーションがCommonJSモジュールに依存していることを検出すると、警告を出力します。
CommonJS依存関係に遭遇した場合は、メンテナーにECMAScriptモジュールのサポートを依頼するか、自分でそのサポートに貢献するか、またはニーズを満たす代替の依存関係を使用することを検討してください。
CommonJS依存関係を使用するのが最善の選択肢である場合は、`angular.json`にある`build`オプションの`allowedCommonJsDependencies`オプションにCommonJSモジュール名を追加することで、これらの警告を無効にできます。

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},
```

## ブラウザの互換性を設定する {#configuring-browser-compatibility}

Angular CLIは、異なるブラウザバージョンとの互換性を確保するために[Browserslist](https://github.com/browserslist/browserslist)を使用します。
サポートされているブラウザに応じて、Angularは、ビルドされたアプリケーションがサポートされているブラウザによって実装されていない機能を使用しないように、特定のJavaScriptおよびCSS機能を自動的に変換します。ただし、Angular CLIは、不足しているWeb APIを補うためにポリフィルを自動的に追加しません。`angular.json`の`polyfills`オプションを使用してポリフィルを追加します。

デフォルトでは、Angular CLIは、現在のメジャーバージョンで[Angularがサポートするブラウザに一致する](reference/versions#browser-support)`browserslist`設定を使用します。

内部設定を上書きするには、[`ng generate config browserslist`](cli/generate/config)を実行します。これにより、Angularがサポートするブラウザに一致する`.browserslistrc`設定ファイルがプロジェクトディレクトリに生成されます。

特定のブラウザとバージョンをターゲットにする方法の詳細は、[browserslistリポジトリ](https://github.com/browserslist/browserslist)を参照してください。
このリストをより多くのブラウザに拡張することは避けてください。アプリケーションコードがより広範に互換性がある場合でも、Angular自体はそうではない可能性があります。
このリストのブラウザまたはバージョンのセットは、常に_減らす_べきです。

HELPFUL: [browsersl.ist](https://browsersl.ist)を使用して、`browserslist`クエリの互換性のあるブラウザを表示します。

## Tailwindの設定 {#configuring-tailwind}

Angularは[Tailwind CSS](https://tailwindcss.com/)、ユーティリティファーストのCSSフレームワークをサポートしています。

Tailwind CSSをAngular CLIと統合するには、[AngularでのTailwind CSSの使用](guide/tailwind)を参照してください。

## クリティカルCSSのインライン化 {#critical-css-inlining}

Angularは、[First Contentful Paint (FCP)](https://web.dev/first-contentful-paint)を改善するために、アプリケーションのクリティカルCSS定義をインライン化できます。
このオプションはデフォルトで有効になっています。[`styles`カスタマイズオプション](reference/configs/workspace-config#styles-optimization-options)でこのインライン化を無効にできます。

この最適化は、初期ビューポートのレンダリングに必要なCSSを抽出し、生成されたHTMLに直接インライン化します。これにより、ブラウザは完全なスタイルシートの読み込みを待たずに、より高速にコンテンツを表示できます。残りのCSSはバックグラウンドで非同期に読み込まれます。Angular CLIは、アプリケーションのHTMLとスタイルを分析するために[Beasties](https://github.com/danielroe/beasties)を使用します。
