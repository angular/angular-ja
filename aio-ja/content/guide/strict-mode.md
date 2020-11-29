# strictモード

新しいワークスペースやアプリケーションを作成する際に、`--strict`フラグを使ってstrictモードでそれらを作成するオプションがあります。

このフラグを有効にすると、新規のワークスペースやアプリケーションがいくつかの新しい設定で初期化します。これは、保守性を向上させ事前にバグを検知するのに役立つものです。
さらに、これらのより厳格な設定を使うアプリケーションは、静的な分析が簡単です。これにより、あなたがAngularの将来のバージョンに更新する際に、`ng update`コマンドがコードをより安全かつ正確にリファクタリングするのに役立ちます。

具体的に、`strict`フラグは次のことを行います:

* [TypeScriptで`strict`モード](https://www.staging-typescript.org/tsconfig#strict)を有効にします。TypeScriptチームが推奨するその他の厳密フラグも同様で、具体的には`forceConsistentCasingInFileNames`、`noImplicitReturns`、`noFallthroughCasesInSwitch`です。
* Angularコンパイラの厳密フラグをオンにします。[`strictTemplates`](guide/angular-compiler-options#stricttemplates)、[`strictInjectionParameters`](guide/angular-compiler-options#strictinjectionparameters)、[`strictInputAccessModifiers`](guide/template-typecheck#troubleshooting-template-errors)です。
* [バンドルサイズ予算](guide/build#configuring-size-budgets)が最大75％の削減になっています。

これらの設定は、ワークスペースおよびプロジェクトレベルで適用できます。

strictモードを使って新しいワークスペースとアプリケーションを作成するには、次のコマンドを実行します:

<code-example language="sh" class="code-shell">

ng new [project-name] --strict

</code-example>

既存のstrictではないワークスペース内にstrictモードで新しいアプリケーションを作成するには、次のコマンドを実行します:

<code-example language="sh" class="code-shell">

ng generate application [project-name] --strict

</code-example>
