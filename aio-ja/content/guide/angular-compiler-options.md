# Angular コンパイラオプション

[AOTコンパイル](guide/aot-compiler) を使用する場合、[TypeScript 設定ファイル](guide/typescript-configuration)で *テンプレート* コンパイラオプションを指定することにより、アプリケーションのコンパイル方法を制御できます。

テンプレートオプションオブジェクトの `angularCompilerOptions` は、TypeScript コンパイラに標準オプションを提供する `compilerOptions` オブジェクトに近いものです。

```json
    {
      "compilerOptions": {
        "experimentalDecorators": true,
                  ...
      },
      "angularCompilerOptions": {
        "fullTemplateTypeCheck": true,
        "preserveWhitespaces": true,
                  ...
      }
  }
  ```

{@a tsconfig-extends}
## 拡張による構成の継承

TypeScript コンパイラと同様に、Angular AOT コンパイラは、TypeScript 構成ファイルの `angularCompilerOptions` セクションで `extends` もサポートしています。
`extends` プロパティはトップレベルにあり、`compilerOptions` および `angularCompilerOptions` と並行しています。

TypeScript 設定は、`extends` プロパティを使用して別のファイルから設定を継承できます。
ベースファイルの設定オプションが最初にロードされ、次に継承する設定ファイルの設定オプションによって上書きされます。

例:

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    ...
  },
  "angularCompilerOptions": {
    "fullTemplateTypeCheck": true,
    "preserveWhitespaces": true,
    ...
  }
}
```

詳細については、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) を参照してください。

## テンプレートオプション

次のオプションは、AOT テンプレートコンパイラの構成に使用できます。

### `allowEmptyCodegenFiles`

`true` の場合、空であってもすべての可能なファイルを生成します。デフォルトは false です。 Bazel ルールがファイルの依存関係を追跡する方法を単純化するために、Bazel ビルドルールで使用されます。このオプションは、Bazel ルール以外では使用しないでください。

### `annotationsAs`

ツリーシェーキングを改善するために、Angular 固有のアノテーションの出力方法を変更します。Angular 以外のアノテーションは影響を受けません。`static fields` (デフォルト) または `decorators` のいずれかです。

* デフォルトでは、コンパイラーはデコレーターをクラスの静的フィールドに置き換えます。これにより、[Closure compiler](https://github.com/google/closure-compiler) などの高度なツリーシェーカーが未使用のクラスを削除できます。

* `decorators` の値はデコレーターをそのままにしておくため、コンパイルが高速になります。TypeScript は、`__decorate` ヘルパーへの呼び出しを出力します。実行時のリフレクションに `--emitDecoratorMetadata` を使用します (ただし、結果のコードが適切にツリーシェークされないことに注意してください)。

### `annotateForClosureCompiler`

`true` の場合、 [Closure Compiler](https://github.com/google/closure-compiler) に必要な [JSDoc](http://usejsdoc.org/) コメントを、出力された JavaScript に注釈するために [Tsickle](https://github.com/angular/tsickle) を使用します。
デフォルトは `false` です。

### `disableExpressionLowering`

`true` の場合（デフォルト）、Angular テンプレートコンパイラは、アノテーションで使用されている、または使用される可能性があるコードを変換して、テンプレートファクトリモジュールからインポートできるようにします。詳細については、[メタデータの書き換え](guide/aot-compiler#metadata-rewriting) を参照してください。

このオプションを `false` に設定すると、この書き換えが無効になり、書き換えを手動で行う必要があります。

### `disableTypeScriptVersionCheck`

`true` の場合、このオプションはコンパイラに TypeScript のバージョンをチェックしないように指示します。TypeScript のサポートされていないバージョンが使用されている場合、コンパイラはチェックをスキップし、エラーにはなりません。このオプションを `true` に設定することは TypeScript のサポートされていないバージョンが未定義の動作をするかもしれないのでお勧めできません。このオプションはデフォルトでは `false` です。

### `enableIvy`

[Ivy](guide/ivy) コンパイルおよびレンダリングパイプラインを有効にします。バージョン9では、デフォルトは `true` です。バージョン9では、[Ivy をオプトアウト](guide/ivy#opting-out-of-angular-ivy) して、以前のコンパイラである View Engine を引き続き使用できます。

CLI で生成されたライブラリプロジェクトの場合、バージョン9の `prod` 設定のデフォルトは `false` です。

### `enableResourceInlining`

`true` の場合、すべての `@Component` デコレーターの `templateUrl` および `styleUrls` プロパティを `template` および `styles` プロパティのインライン化された内容に置き換えるようにコンパイラに指示します。

有効にすると、`ngc` の `.js` 出力には、遅延ロードされた `templateUrl` または `styleUrls` がありません。

CLI で生成されたライブラリプロジェクトの場合、dev 構成のデフォルトは `true` です。


{@a enablelegacytemplate}

### `enableLegacyTemplate`

`true` の場合 `<template>` 要素を有効にします。これは同じ名前の DOM の要素との衝突を避ける `<ng-template>` を優先するため、Angular 4.0 から 非推奨になりました。デフォルトでは `false` です。このオプションは、一部のサードパーティ Angular ライブラリで必要となる場合があります。

### `flatModuleId`

フラットモジュールのインポートに使用するモジュール ID (`flatModuleOutFile` が `true` の場合) です。テンプレートコンパイラによって生成された参照は、フラットモジュールからシンボルをインポートするときにこのモジュール名を使用します。
`flatModuleOutFile` が false の場合は無視されます。

### `flatModuleOutFile`

`true` の場合、このオプションは、指定されたファイル名と対応するフラットモジュールメタデータのフラットモジュールインデックスを生成するようにテンプレートコンパイラに指示します。`@angular/core` および `@angular/common` と同様にパッケージ化されたフラットモジュールを作成するために使用します。このオプションを使用する場合、ライブラリの`package.json` は、ライブラリインデックスファイルではなく、
生成されたフラットモジュールインデックスを参照するようになります。

このオプションを使用すると、ライブラリインデックスからエクスポートされたシンボルに必要なすべてのメタデータを含む
1つの `.metadata.json` ファイルのみが生成されます。
生成された `.ngfactory.js` ファイルでは、フラットモジュールインデックスを使用して、
ライブラリインデックスからのパブリック API と覆い隠されたシンボルの両方を含むシンボルをインポートします。

デフォルトでは、`files` フィールドに指定された `.ts` ファイルがライブラリインデックスと見なされます。
複数の `.ts` ファイルが指定されている場合は、`libraryIndex` を使用して使用するファイルを選択します。
`libraryIndex` なしで複数の `.ts` ファイルが指定された場合、エラーが発生します。

フラットモジュールインデックス `.d.ts` および `.js` は、ライブラリインデックス `.d.ts` ファイルと同じ場所に、指定された `flatModuleOutFile` 名で作成されます。

たとえば、ライブラリがモジュールのライブラリインデックスとして `public_api.ts` ファイルを使用する場合、`tsconfig.json` `files` フィールドは `["public_api.ts"]` になります。
その後、`flatModuleOutFile` オプションを `"index.js"` に設定すると、`index.d.ts` ファイルと `index.metadata.json` ファイルが生成されます。
ライブラリの `package.json` の `module` フィールドは `"index.js"` になり、
`typings` フィールドは `"index.d.ts"` になります。

### `fullTemplateTypeCheck`

`true` (推奨) の場合、TypeScript を使用してバインディング式を検証するテンプレートコンパイラの[バインディング式の検証](guide/aot-compiler#binding-expression-validation)フェーズを有効にするようにコンパイラに指示します。 For more information, see [Template type checking](guide/template-typecheck).

デフォルトは `false` ですが、CLI コマンド `ng new` を使用すると、生成されたプロジェクトの設定でデフォルトで `true` に設定されます。

### `generateCodeForLibraries`

`true` (デフォルト) の場合、対応する `.metadata.json` ファイルとともに `.d.ts` ファイル用のファクトリファイル (`.ngfactory.js` および `.ngstyle.js`) を
生成するようにテンプレートコンパイラに指示します。

このオプションが `false` の場合、ファクトリーファイルは `.ts` ファイルに対してのみ生成されます。ファクトリーサマリーを使用する場合、このオプションは false に設定するべきです。


### `preserveWhitespaces`

`false` (デフォルト) の場合、コンパイルされたテンプレートから空白のテキストノードを削除するようにコンパイラに指示します。これにより、出力されるテンプレートファクトリモジュールが小さくなります。空白のテキストノードを保持するには、 `true` に設定します。

### `skipMetadataEmit`

このオプションが `true` の場合、`.metadata.json` ファイルを生成しないようにコンパイラーに指示します。デフォルトでは `false` です。

`.metadata.json` ファイルには、TypeScript コンパイラによって生成された `.d.ts` ファイルに含まれていない `.ts` ファイルから、
テンプレートコンパイラによって必要とされる情報が含まれています。
たとえば、この情報には、TypeScript が `.js` ファイルに出力するが `.d.ts` ファイルには出力しない注釈の内容(コンポーネントのテンプレートなど) が含まれています。

ファクトリーサマリーには `.metadata.json` ファイルにある情報のコピーが含まれているため、
ファクトリーサマリーを使用するときにもこのオプションを `true` に設定できます。

TypeScript の `--outFile` オプションを使用している場合は、このオプションを `true` に設定してください。メタデータファイルはこのスタイルの TypeScript 出力には無効です。Angular で `--outFile` を使用することはお勧めできません。
代わりに、[webpack](https://webpack.js.org/) などのバンドラーを使用してください。

### `skipTemplateCodegen`

このオプションが `true` の場合、`.ngfactory.js` ファイルと `.ngstyle.js` ファイルの出力を抑制するようにコンパイラーに指示します。設定されると、これはテンプレートコンパイラの大部分をオフにし、テンプレート診断の報告を無効にします。

このオプションは、`npm` に配布できない `.ngfactory.js` および `.ngstyle.js` ファイルの作成を避けながら、`npm` パッケージで配布するための `.metadata.json` ファイルを作成するようにテンプレートコンパイラに指示するために使用できます。

CLI で生成されたライブラリプロジェクトの場合、dev 構成のデフォルトは `true` です。

### `strictMetadataEmit`

`true` の場合、`"skipMetadataEmit"` が `false` のときに `.metadata.json` ファイルにエラーを報告するようにテンプレートコンパイラに指示します。
このオプションはデフォルトでは `false` です。これは、`"skipMetadataEmit"` が `false` で `"skipTemplateCodeGen"` が `true` の場合にのみ使用します。

このオプションは、`npm` パッケージとのバンドル用に発行された `.metadata.json` ファイルを検証するためのものです。検証は厳密であり、テンプレートコンパイラで使用されたときにエラーが発生しないようなメタデータに対してエラーを発生させる可能性があります。シンボルを説明するコメントに `@dynamic` を含めることで、エクスポートされたシンボルに対してこのオプションによって発生するエラーを抑制することを選択できます。

`.metadata.json` ファイルにエラーが含まれていることは正常です。
メタデータを使用してアノテーションの内容を判断すると、テンプレートコンパイラはこれらのエラーを報告します。
メタデータコレクターは、アノテーションで使用するために設計されたシンボルを予測できないため、エクスポートされたシンボルのメタデータにエラーノードを優先的に含めます。
これらのシンボルが使用されている場合、テンプレートコンパイラはエラーノードを使用してエラーを報告できます。

ライブラリのクライアントがアノテーションでシンボルを使おうとする場合、テンプレートコンパイラは通常クライアントがシンボルを使うまでこれを報告しません。
このオプションはライブラリのビルド段階でこれらのエラーを検出することを可能にし、
たとえば Angular ライブラリ自身を作成する際に使用されます。

CLI で生成されたライブラリプロジェクトの場合、dev 構成のデフォルトは `true` です。

### `strictInjectionParameters`

`true` (推奨) に設定した場合、このオプションは、インジェクションタイプを判別できない指定されたパラメーターについてエラーを報告するようコンパイラーに指示します。このオプションが提供されていないか `false` (現在はデフォルト) の場合、型を解決できない `@Injectable` でマークされたクラスのコンストラクターパラメータは警告を生成します。

CLI コマンド `ng new` を使用すると、生成されたプロジェクトの設定でデフォルトで `true` に設定されます。

### `strictTemplates`

`true` の場合、Angular バージョン9で [厳格なテンプレートタイプチェック](guide/template-typecheck#strict-mode) を有効にします。厳格モードは [Ivy](guide/ivy) を使用する場合にのみ使用できます。

追加の厳密性フラグを使用すると、特定のタイプの厳密なテンプレートタイプチェックを有効または無効にできます。[テンプレートエラーのトラブルシューティング](guide/template-typecheck#troubleshooting-template-errors) をご覧ください。


### `trace`

`true` の場合、テンプレートのコンパイル中に追加情報を出力します。デフォルトは false です。
