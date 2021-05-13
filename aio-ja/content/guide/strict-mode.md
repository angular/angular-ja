# strictモード

Angular CLI creates all new workspaces and projects with **strict mode** enabled.

Strict mode improves maintainability and helps you catch bugs ahead of time.
Additionally, strict mode applications are easier to statically analyze and can help the `ng update` command refactor code more safely and precisely when you are updating to future versions of Angular.

具体的に、strictモードは次のことを行います:

* [TypeScriptで`strict`モード](https://www.typescriptlang.org/tsconfig#strict)を有効にします。TypeScriptチームが推奨するその他の厳密フラグも同様で、具体的には`forceConsistentCasingInFileNames`、`noImplicitReturns`、`noFallthroughCasesInSwitch`です。
* Angularコンパイラの厳密フラグをオンにします。[`strictTemplates`](guide/angular-compiler-options#stricttemplates)、[`strictInjectionParameters`](guide/angular-compiler-options#strictinjectionparameters)、[`strictInputAccessModifiers`](guide/template-typecheck#troubleshooting-template-errors)です。
* [バンドルサイズ予算](guide/build#configuring-size-budgets)が最大75％の削減になっています。

これらの設定は、ワークスペースおよびプロジェクトレベルで適用できます。

基本的な `ng new` コマンドを使用して新しいワークスペースとアプリケーションを作成すると、自動的に strict モードが使用されます。

<code-example language="sh">

ng new [project-name]

</code-example>

既存のstrictではないワークスペース内にstrictモードで新しいアプリケーションを作成するには、次のコマンドを実行します:

<code-example language="sh">

ng generate application [project-name] --strict

</code-example>
