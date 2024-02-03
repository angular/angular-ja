# Angular コンパイラオプション {@a angular-compiler-options}

[AOTコンパイル](guide/aot-compiler) を使用する場合、[TypeScript 設定ファイル](guide/typescript-configuration)で *テンプレート* コンパイラオプションを指定することにより、アプリケーションのコンパイル方法を制御できます。

テンプレートオプションオブジェクトの `angularCompilerOptions` は、TypeScript コンパイラに標準オプションを提供する `compilerOptions` オブジェクトに近いものです。

<code-example header="tsconfig.json" path="angular-compiler-options/tsconfig.json" region="angular-compiler-options"></code-example>

<a id="tsconfig-extends"></a>

## 拡張による構成の継承

TypeScript コンパイラと同様に、Angular AOT コンパイラは、TypeScript 構成ファイルの `angularCompilerOptions` セクションで `extends` もサポートしています。
`extends` プロパティはトップレベルにあり、`compilerOptions` および `angularCompilerOptions` と並行しています。

TypeScript 設定は、`extends` プロパティを使用して別のファイルから設定を継承できます。
ベースファイルの設定オプションが最初にロードされ、次に継承する設定ファイルの設定オプションによって上書きされます。

例:

<code-example header="tsconfig.app.json" path="angular-compiler-options/tsconfig.app.json" region="angular-compiler-options-app"></code-example>

詳細については、[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) を参照してください。

## テンプレートオプション

次のオプションは、AOT テンプレートコンパイラの構成に使用できます。

### `annotationsAs`

ツリーシェーキングを改善するために、Angular 固有のアノテーションの出力方法を変更します。
Angular 以外のアノテーションは影響を受けません。
One of `static fields` or `decorators`. The default value is `static fields`. 

*   デフォルトでは、コンパイラーはデコレーターをクラスの静的フィールドに置き換えます。これにより、[Closure compiler](https://github.com/google/closure-compiler) などの高度なツリーシェーカーが未使用のクラスを削除できます。
*   `decorators` の値はデコレーターをそのままにしておくため、コンパイルが高速になります。
    TypeScript は、`__decorate` ヘルパーへの呼び出しを出力します。
    実行時のリフレクションに `--emitDecoratorMetadata` を使用します。

    <div class="alert is-helpful">

    **NOTE**: <br />
    That the resulting code cannot tree-shake properly.

    </div>

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

`true` の場合、 [Closure Compiler](https://github.com/google/closure-compiler) に必要な [JSDoc](https://jsdoc.app/) コメントを、出力された JavaScript に注釈するために [Tsickle](https://github.com/angular/tsickle) を使用します。
デフォルトは `false` です。

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

Specifies the compilation mode to use.
The following modes are available:

| Modes       | Details |
|:---         |:---     |
| `'full'`    | Generates fully AOT-compiled code according to the version of Angular that is currently being used. |
| `'partial'` | Generates code in a stable, but intermediate form suitable for a published library.                 |

The default value is `'full'`.

### `disableExpressionLowering`

`true` の場合（デフォルト）、Angular テンプレートコンパイラは、アノテーションで使用されている、または使用される可能性があるコードを変換して、テンプレートファクトリモジュールからインポートできるようにします。
詳細については、[メタデータの書き換え](guide/aot-compiler#metadata-rewriting) を参照してください。

このオプションを `false` に設定すると、この書き換えが無効になり、書き換えを手動で行う必要があります。

### `disableTypeScriptVersionCheck`

`true` の場合、このオプションはコンパイラに TypeScript のバージョンをチェックしないように指示します。TypeScript のサポートされていないバージョンが使用されている場合、コンパイラはチェックをスキップし、エラーにはなりません。
このオプションを `true` に設定することは TypeScript のサポートされていないバージョンが未定義の動作をするかもしれないのでお勧めできません。
このオプションはデフォルトでは `false` です。

### `enableI18nLegacyMessageIdFormat`

Instructs the Angular template compiler to generate legacy ids for messages that are tagged in templates by the `i18n` attribute.
See [Mark text for translations][AioGuideI18nCommonPrepareMarkTextInComponentTemplate] for more information about marking messages for localization.

Set this option to `false` unless your project relies upon translations that were previously generated using legacy ids. 
Default is `true`.

The pre-Ivy message extraction tooling generated a variety of legacy formats for extracted message ids.
These message formats have a number of issues, such as whitespace handling and reliance upon information inside the original HTML of a template.

The new message format is more resilient to whitespace changes, is the same across all translation file formats, and can be generated directly from calls to `$localize`.
This allows `$localize` messages in application code to use the same id as identical `i18n` messages in component templates.

### `enableResourceInlining`

`true` の場合、すべての `@Component` デコレーターの `templateUrl` および `styleUrls` プロパティを `template` および `styles` プロパティのインライン化された内容に置き換えるようにコンパイラに指示します。

有効にすると、`ngc` の `.js` 出力には、遅延ロードされた `templateUrl` または `styleUrls` がありません。

For library projects created with the Angular CLI, the development configuration default is `true`.

<a id="enablelegacytemplate"></a>

### `enableLegacyTemplate`

When `true`, enables the deprecated `<template>` element in place of `<ng-template>`.
デフォルトでは `false` です。
このオプションは、一部のサードパーティ Angular ライブラリで必要となる場合があります。

### `flatModuleId`

フラットモジュールのインポートに使用するモジュール ID (`flatModuleOutFile` が `true` の場合) です。
テンプレートコンパイラによって生成された参照は、フラットモジュールからシンボルをインポートするときにこのモジュール名を使用します。
`flatModuleOutFile` が false の場合は無視されます。

### `flatModuleOutFile`

`true` の場合、このオプションは、指定されたファイル名と対応するフラットモジュールメタデータのフラットモジュールインデックスを生成するようにテンプレートコンパイラに指示します。
`@angular/core` および `@angular/common` と同様にパッケージ化されたフラットモジュールを作成するために使用します。
このオプションを使用する場合、ライブラリの`package.json` は、ライブラリインデックスファイルではなく、生成されたフラットモジュールインデックスを参照するようになります。

このオプションを使用すると、ライブラリインデックスからエクスポートされたシンボルに必要なすべてのメタデータを含む1つの `.metadata.json` ファイルのみが生成されます。
生成された `.ngfactory.js` ファイルでは、フラットモジュールインデックスを使用して、ライブラリインデックスからのパブリック API と覆い隠されたシンボルの両方を含むシンボルをインポートします。

デフォルトでは、`files` フィールドに指定された `.ts` ファイルがライブラリインデックスと見なされます。
複数の `.ts` ファイルが指定されている場合は、`libraryIndex` を使用して使用するファイルを選択します。
`libraryIndex` なしで複数の `.ts` ファイルが指定された場合、エラーが発生します。

フラットモジュールインデックス `.d.ts` および `.js` は、ライブラリインデックス `.d.ts` ファイルと同じ場所に、指定された `flatModuleOutFile` 名で作成されます。

たとえば、ライブラリがモジュールのライブラリインデックスとして `public_api.ts` ファイルを使用する場合、`tsconfig.json` `files` フィールドは `["public_api.ts"]` になります。
その後、`flatModuleOutFile` オプションを `"index.js"` に設定すると、`index.d.ts` ファイルと `index.metadata.json` ファイルが生成されます。
ライブラリの `package.json` の `module` フィールドは `"index.js"` になり、`typings` フィールドは `"index.d.ts"` になります。

### `fullTemplateTypeCheck`

推奨値である `true` の場合、テンプレートコンパイラの [binding expression validation](guide/aot-compiler#binding-expression-validation) フェーズを有効にします。このフェーズでは、TypeScriptを使用してバインディング式を検証します。
詳しくは、[テンプレート型チェック](guide/template-typecheck)をご覧ください。

デフォルトは `false` です。ただし、Angular CLI を使ってプロジェクトを作成する場合は、作成したワークスペースの設定で `true` に設定されています。

<div class="alert is-important">

The `fullTemplateTypeCheck` option has been deprecated in Angular 13 in favor of the `strictTemplates` family of compiler options.

</div>

### `generateCodeForLibraries`

When `true`, creates factory files \(`.ngfactory.js` and `.ngstyle.js`\) for `.d.ts` files with a corresponding `.metadata.json` file. The default value is `true`.

このオプションが `false` の場合、ファクトリーファイルは `.ts` ファイルに対してのみ生成されます。
ファクトリーサマリーを使用する場合、このオプションは false に設定するべきです。

### `preserveWhitespaces`

`false` (デフォルト) の場合、コンパイルされたテンプレートから空白のテキストノードを削除するようにコンパイラに指示します。これにより、出力されるテンプレートファクトリモジュールが小さくなります。
空白のテキストノードを保持するには、 `true` に設定します。

<div class="alert is-helpful">

When using hydration, it is recommended that you use `preserveWhitespaces: false`, which is the default value. If you choose to enable preserving whitespaces by adding `preserveWhitespaces: true` to your tsconfig, it is possible you may encounter issues with hydration. This is not yet a fully supported configuration. Ensure this is also consistently set between the server and client tsconfig files. See the [hydration guide](guide/hydration#preserve-whitespaces) for more details.

</div>

### `skipMetadataEmit`

このオプションが `true` の場合、`.metadata.json` ファイルを生成しないようにコンパイラーに指示します。
デフォルトでは `false` です。

`.metadata.json` ファイルには、TypeScript コンパイラによって生成された `.d.ts` ファイルに含まれていない `.ts` ファイルから、テンプレートコンパイラによって必要とされる情報が含まれています。
たとえば、この情報には、TypeScript が `.js` ファイルに出力するが `.d.ts` ファイルには出力しない注釈の内容(コンポーネントのテンプレートなど) が含まれています。

ファクトリーサマリーには `.metadata.json` ファイルにある情報のコピーが含まれているため、ファクトリーサマリーを使用するときにもこのオプションを `true` に設定できます。

TypeScript の `--outFile` オプションを使用している場合は、このオプションを `true` に設定してください。メタデータファイルはこのスタイルの TypeScript 出力には無効です。
The Angular community does not recommend using `--outFile` with Angular.
代わりに、[webpack](https://webpack.js.org/) などのバンドラーを使用してください。

### `skipTemplateCodegen`

このオプションが `true` の場合、`.ngfactory.js` ファイルと `.ngstyle.js` ファイルの出力を抑制するようにコンパイラーに指示します。
設定されると、これはテンプレートコンパイラの大部分をオフにし、テンプレート診断の報告を無効にします。

このオプションは、`npm` に配布できない `.ngfactory.js` および `.ngstyle.js` ファイルの作成を避けながら、`npm` パッケージで配布するための `.metadata.json` ファイルを作成するようにテンプレートコンパイラに指示するために使用できます。

For library projects created with the Angular CLI, the development configuration default is `true`.

### `strictMetadataEmit`

`true` の場合、`"skipMetadataEmit"` が `false` のときに `.metadata.json` ファイルにエラーを報告するようにテンプレートコンパイラに指示します。
このオプションはデフォルトでは `false` です。
これは、`"skipMetadataEmit"` が `false` で `"skipTemplateCodegen"` が `true` の場合にのみ使用します。

このオプションは、`npm` パッケージとのバンドル用に発行された `.metadata.json` ファイルを検証するためのものです。
検証は厳密であり、テンプレートコンパイラで使用されたときにエラーが発生しないようなメタデータに対してエラーを発生させる可能性があります。
シンボルを説明するコメントに `@dynamic` を含めることで、エクスポートされたシンボルに対してこのオプションによって発生するエラーを抑制することを選択できます。

`.metadata.json` ファイルにエラーが含まれていることは正常です。
メタデータを使用してアノテーションの内容を判断すると、テンプレートコンパイラはこれらのエラーを報告します。
メタデータコレクターは、アノテーションで使用するために設計されたシンボルを予測できないため、エクスポートされたシンボルのメタデータにエラーノードを優先的に含めます。
これらのシンボルが使用されている場合、テンプレートコンパイラはエラーノードを使用してエラーを報告できます。

If the client of a library intends to use a symbol in an annotation, the template compiler does not normally report this. It gets reported after the client actually uses the symbol.
このオプションはライブラリのビルド段階でこれらのエラーを検出することを可能にし、たとえば Angular ライブラリ自身を作成する際に使用されます。

Angular CLI で生成されたライブラリプロジェクトの場合、development 構成のデフォルトは `true` です。

### `strictInjectionParameters`

When `true`, reports an error for a supplied parameter whose injection type cannot be determined.
When `false`, constructor parameters of classes marked with `@Injectable` whose type cannot be resolved produce a warning.
The recommended value is `true`, but the default value is `false`.

Angular CLIを使ってプロジェクトを作成する場合、作成したワークスペースの設定で`true`に設定されます。

### `strictTemplates`

`true` の場合、[厳格なテンプレートタイプチェック](guide/template-typecheck#strict-mode) を有効にします。

この厳密性フラグにより、特定のタイプの厳密なテンプレート型チェックをオンまたはオフにすることができます。
[テンプレートエラーのトラブルシューティング](guide/template-typecheck#troubleshooting-template-errors) をご覧ください。

Angular CLIを使ってプロジェクトを作成する場合、作成したワークスペースの設定で`true`に設定されます。

### `trace`

`true` の場合、テンプレートのコンパイル中に追加情報を出力します。
デフォルトは `false` です。

<a id="cli-options"></a>

## Command line options

Most of the time you interact with the Angular Compiler indirectly using Angular CLI. When debugging certain issues, you might find it useful to invoke the Angular Compiler directly.
You can use the `ngc` command provided by the `@angular/compiler-cli` npm package to call the compiler from the command line.

The `ngc` command is just a wrapper around TypeScript's `tsc` compiler command and is primarily configured via the `tsconfig.json` configuration options documented in [the previous sections](#angular-compiler-options).

Besides the configuration file, you can also use [`tsc` command line options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to configure `ngc`.

<!-- links -->

[AioGuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n-common-prepare#mark-text-in-component-template "Mark text in component template - Prepare component for translation | Angular"

<!-- end links -->

@reviewed 2023-10-24
