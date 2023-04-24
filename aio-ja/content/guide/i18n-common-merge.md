# アプリケーションに翻訳をマージ

完成した翻訳をプロジェクトに統合するには、次の操作を行います

1.  [Angular CLI][AioCliMain]を使用して、プロジェクトの配布可能なファイルのコピーをビルドします。
1.  `"localize"`オプションを使って、すべての国際化メッセージを有効な翻訳に置き換え、ローカライズされた variant アプリケーションをビルドします。
    variant アプリケーションは、一つのロケール用に翻訳された、あなたのアプリケーションの配布可能なファイルの完全なコピーとなります。

翻訳をマージした後、サーバーサイドの言語検出または異なるサブディレクトリを使用して、アプリケーションの各配布可能なコピーにサービスを提供します。

<div class="alert is-helpful">

各配布可能なアプリケーションのコピーを提供する方法の詳細については、[複数ロケールのデプロイ][AioGuideI18nCommonDeploy]を参照してください。

</div>

アプリケーションの翻訳のコンパイル時、ビルドプロセスは[事前(AOT)コンパイル][AioGuideGlossaryAheadOfTimeAotCompilation]を使用し、小さく高速ですぐに実行できるアプリケーションを作成します。

<div class="alert is-helpful">

ビルドプロセスの詳細な説明については、[Angularアプリケーションのビルドとサーブ][AioGuideBuild]を参照してください。
ビルドプロセスは、`.xlf`形式の翻訳ファイル、または`.xtb`などAngularが理解できる別の形式の翻訳ファイルに対して機能します。
Angularで使用される翻訳ファイル形式の詳細については、[ソース言語ファイルのフォーマットを変更する][AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]を参照してください。

</div>

各ロケールに対応した配布可能なアプリケーションのコピーを個別にビルドするには、プロジェクトの[`angular.json`][AioGuideWorkspaceConfig]ワークスペースの[ビルド構成ファイルでロケールを定義します][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。

この方法では、ロケールごとにアプリケーションの完全なビルドを実行する必要がないため、ビルドプロセスが短縮されます。

[ロケールごとに異なるアプリケーションを生成する][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]には、[`angular.json`][AioGuideWorkspaceConfig]で`"localize"`オプションを使用します。
また、[コマンドラインからビルドする][AioGuideI18nCommonMergeBuildFromTheCommandLine]には、[`build`][AioCliBuild] [Angular CLI][AioCliMain]コマンドに`--localize`オプションを付けて使用します。

<div class="alert is-helpful">

オプションで、カスタムロケール設定のために、[1つのロケールだけに特定のビルドオプションを適用する][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]ことができます。

</div>

## ビルド構成ファイルでロケールを定義する {@a define-locales-in-the-build-configuration}

プロジェクトのロケールを定義するには、プロジェクトの[`angular.json`][AioGuideWorkspaceConfig]の`i18n`プロジェクトオプションを使用します。

以下のサブオプションは、ソース言語を特定し、プロジェクトでサポートされている翻訳をどこで見つけるかをコンパイラに指示します。

| サブオプション      | 詳細 |
|:---            |:--- |
| `sourceLocale` | アプリケーションのソースコード内で使用するロケール \(デフォルトは`en-US` \) |
| `locales`      | ロケール識別子と翻訳ファイルとの対応表                             |

### `angular.json`の`en-US`と`fr`の例

例えば、[`angular.json`][AioGuideWorkspaceConfig]の以下の抜粋は、ソースロケールを`en-US`に設定し、フランス語\(`fr`\)ロケールの翻訳ファイルへのパスを提供します。

<code-example header="angular.json" path="i18n/angular.json" region="locale-config"></code-example>

## ロケールごとに異なるアプリケーションを生成する {@a generate-application-variants-for-each-locale}

To use your locale definition in the build configuration, use the `"localize"` option in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file to tell the CLI which locales to generate for the build configuration.

*   Set `"localize"` to `true` for all the locales previously defined in the build configuration.
*   Set `"localize"` to an array of a subset of the previously defined locale identifiers to build only those locale versions.
*   Set `"localize"` to `false` to disable localization and not generate any locale-specific versions.

<div class="alert is-helpful">

**NOTE**: <br />
[Ahead-of-time (AOT) compilation][AioGuideGlossaryAheadOfTimeAotCompilation] is required to localize component templates.

If you changed this setting, set `"aot"` to `true` in order to use AOT.

</div>

<div class="alert is-helpful">

Due to the deployment complexities of i18n and the need to minimize rebuild time, the development server only supports localizing a single locale at a time.
If you set the `"localize"` option to `true`, define more than one locale, and use `ng serve`; then an error occurs.
If you want to develop against a specific locale, set the `"localize"` option to a specific locale.
For example, for French \(`fr`\), specify `"localize": ["fr"]`.

</div>

The CLI loads and registers the locale data, places each generated version in a locale-specific directory to keep it separate from other locale versions, and puts the directories within the configured `outputPath` for the project.
For each application variant the `lang` attribute of the `html` element is set to the locale.
The CLI also adjusts the HTML base HREF for each version of the application by adding the locale to the configured `baseHref`.

Set the `"localize"` property as a shared configuration to effectively inherit for all the configurations.
Also, set the property to override other configurations.

### `angular.json` include all locales from build example

The following example displays the `"localize"` option set to `true` in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file, so that all locales defined in the build configuration are built.

<code-example header="angular.json" path="i18n/angular.json" region="build-localize-true"></code-example>

## コマンドラインからビルドする {@a build-from-the-command-line}

Also, use the `--localize` option with the [`ng build`][AioCliBuild] command and your existing `production` configuration.
The CLI builds all locales defined in the build configuration.
If you set the locales in build configuration, it is similar to when you set the `"localize"` option to `true`.

<div class="alert is-helpful">

For more information about how to set the locales, see [Generate application variants for each locale][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale].

</div>

<code-example path="i18n/doc-files/commands.sh" region="build-localize"></code-example>

## 1つのロケールだけに特定のビルドオプションを適用する {@a apply-specific-build-options-for-just-one-locale}

To apply specific build options to only one locale, specify a single locale to create a custom locale-specific configuration.

<div class="alert is-important">

Use the [Angular CLI][AioCliMain] development server \(`ng serve`\) with only a single locale.

</div>

### build for French example

The following example displays a custom locale-specific configuration using a single locale.

<code-example header="angular.json" path="i18n/angular.json" region="build-single-locale"></code-example>

Pass this configuration to the `ng serve` or `ng build` commands.
The following code example displays how to serve the French language file.

<code-example path="i18n/doc-files/commands.sh" region="serve-french"></code-example>

For production builds, use configuration composition to run both configurations.

<code-example path="i18n/doc-files/commands.sh" region="build-production-french"></code-example>

<code-example header="angular.json" path="i18n/angular.json" region="build-production-french" ></code-example>

## Report missing translations

When a translation is missing, the build succeeds but generates a warning such as `Missing translation for message "{translation_text}"`.
To configure the level of warning that is generated by the Angular compiler, specify one of the following levels.

| Warning level | Details                                              | Output |
|:---           |:---                                                  |:---    |
| `error`       | Throw an error and the build fails                   | n/a                                                    |
| `ignore`      | Do nothing                                           | n/a                                                    |
| `warning`     | Displays the default warning in the console or shell | `Missing translation for message "{translation_text}"` |

Specify the warning level in the `options` section for the `build` target of your [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.

### `angular.json` `error` warning example

The following example displays how to set the warning level to `error`.

<code-example header="angular.json" path="i18n/angular.json" region="missing-translation-error" ></code-example>

<div class="alert is-helpful">

When you compile your Angular project into an Angular application, the instances of the `i18n` attribute are replaced with instances of the [`$localize`][AioApiLocalizeInitLocalize] tagged message string.
This means that your Angular application is translated after compilation.
This also means that you can create localized versions of your Angular application without re-compiling your entire Angular project for each locale.

When you translate your Angular application, the *translation transformation* replaces and reorders the parts \(static strings and expressions\) of the template literal string with strings from a collection of translations.
For more information, see [`$localize`][AioApiLocalizeInitLocalize].

<div class="alert is-helpful">

**tldr;**

Compile once, then translate for each locale.

</div>

</div>

## What's next

*   [Deploy multiple locales][AioGuideI18nCommonDeploy]

<!-- links -->

[AioApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

[AioGuideBuild]: guide/build "Building and serving Angular apps | Angular"

[AioGuideGlossaryAheadOfTimeAotCompilation]: guide/glossary#ahead-of-time-aot-compilation "ahead-of-time (AOT) compilation - Glossary | Angular"

[AioGuideI18nCommonDeploy]: guide/i18n-common-deploy "Deploy multiple locales | Angular"

[AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n-common-merge#apply-specific-build-options-for-just-one-locale "Apply specific build options for just one locale - Merge translations into the application | Angular"
[AioGuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n-common-merge#build-from-the-command-line "Build from the command line - Merge translations into the application | Angular"
[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#define-locales-in-the-build-configuration "Define locales in the build configuration - Merge translations into the application | Angular"
[AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n-common-merge#generate-application-variants-for-each-locale "Generate application variants for each locale - Merge translations into the application | Angular"

[AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n-common-translation-files#change-the-source-language-file-format "Change the source language file format - Work with translation files | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[AngularV8GuideI18nMergeWithTheJitCompiler]: https://v8.angular.io/guide/i18n-common#merge-translations-into-the-app-with-the-jit-compiler "Merge with the JIT compiler - Internationalization (i18n) | Angular v8"

<!-- end links -->

@reviewed 2022-02-28
