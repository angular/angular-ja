# strictモード

Angular CLI creates all new workspaces and projects with **strict mode** enabled.

Strict mode improves maintainability and helps you catch bugs ahead of time.
Additionally, strict mode applications are easier to statically analyze and can help the `ng update` command refactor code more safely and precisely when you are updating to future versions of Angular.

Specifically, strict mode affects newly generated applications in the following way:

*   [TypeScriptで`strict`モード](https://www.typescriptlang.org/tsconfig#strict)を有効にします。TypeScriptチームが推奨するその他の厳密フラグも同様です。
    具体的には`forceConsistentCasingInFileNames`、`noImplicitReturns`、`noFallthroughCasesInSwitch`です。
*   Angularコンパイラの厳密フラグをオンにします。[`strictTemplates`](guide/angular-compiler-options#stricttemplates)、[`strictInjectionParameters`](guide/angular-compiler-options#strictinjectionparameters)、[`strictInputAccessModifiers`](guide/template-typecheck#troubleshooting-template-errors)です。
*   Reduces the [bundle size budgets](guide/build#configuring-size-budgets) for the `initial` and `anyComponentStyle` budget types by 75% compared to the previous defaults.

これらの設定は、ワークスペースおよびプロジェクトレベルで適用できます。

基本的な `ng new` コマンドを使用して新しいワークスペースとアプリケーションを作成すると、自動的に strict モードが使用されます。

<code-example format="shell" language="shell">

ng new [project-name]

</code-example>

既存のstrictではないワークスペース内にstrictモードで新しいアプリケーションを作成するには、次のコマンドを実行します:

<code-example format="shell" language="shell">

ng generate application [project-name] --strict

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
