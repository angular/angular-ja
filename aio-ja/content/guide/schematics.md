# Schematics を使用したコード生成

Schematics は、複雑なロジックをサポートするテンプレートベースのコードジェネレーターです。
これは、コードを生成または変更してソフトウェアプロジェクトを変換するための一連の命令です。
Schematics は [collections](guide/glossary#collection) にパッケージ化され、npm でインストールします。

Schematic コレクションは、ソフトウェアプロジェクトを作成、変更、維持するための強力なツールですが、組織の特定のニーズに合わせて Angular プロジェクトをカスタマイズする場合に特に役立ちます。
たとえば、Schematics を使用することで、事前に定義されたテンプレートまたはレイアウトを用いて、一般的に使用される UI パターンまたは特定のコンポーネントを生成できます。
Schematics を使用して、アーキテクチャのルールと規則を適用し、プロジェクトの一貫性と相互運用性を実現できます。

## Angular CLI の Schematics

Schematics は Angular エコシステムの一部です。 [Angular CLI](guide/glossary#cli)  は  Schematics を使用して Web アプリケーションプロジェクトを変換します。
Schematics を変更し、新たに定義して、たとえば、依存関係の重大な変更を修正するためにコードを更新したり、既存のプロジェクトに新しいオプションやフレームワークを追加したりすることができます。

`@schematics/angular` コレクションに含まれる Schematics は、デフォルトでは `ng generate` および `ng add` コマンドによって実行されます。
パッケージには、`ng generate component` や `ng generate service` などの `ng generate` サブコマンドの CLI で使用可能なオプションを構成する名前付き Schematics が含まれています。
`ng generate` のサブコマンドは、対応する Schematic の省略形です。長い形式を使用すると、特定の Schematic（または Schematics のコレクション）を指定して生成できます。

<code-example language="bash">
ng generate my-schematic-collection:my-schematic-name
</code-example>

または

<code-example language="bash">
ng generate my-schematic-name --collection collection-name
</code-example>

### CLI Schematics 設定

Schematic に関連付けられた JSON スキーマは、コマンドとサブコマンドで使用できるオプションを Angular CLI に通知し、デフォルトを決定します。
これらのデフォルトは、コマンドラインのオプションに別の値を指定することで上書きできます。
ワークスペースの生成オプションのデフォルトを変更する方法については、[ワークスペースの設定](guide/workspace-config) を参照してください。

CLI がプロジェクトとプロジェクトの一部を生成するために使用するデフォルトの Schematics の JSON スキーマは、パッケージ [`@schematics/angular`](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular) に集約されます。
`--help` の出力に示されているように、スキーマは `ng generate` サブコマンドごとに CLI で使用可能なオプションを記述しています。

## ライブラリの Schematics の開発

ライブラリ開発者は、カスタム Schematics の独自のコレクションを作成して、ライブラリを Angular CLI と統合できます。

* *追加 Schematics* により、開発者は `ng add` を使用して Angular ワークスペースにライブラリをインストールできます。

* *生成 Schematics* は、`ng generate` サブコマンドに、プロジェクトを変更する方法、設定とスクリプトを追加する方法、およびライブラリで定義されているスキャフォールドアーティファクトを指示できます。

* *更新 Schematics* は、`ng update` コマンドにライブラリの依存関係を更新する方法を指示し、新しいバージョンをリリースするときに重大な変更に対する調整を行うことができます。

これらの見え方と作成方法の詳細については、以下を参照してください。
* [Authoring Schematics](guide/schematics-authoring)
* [Schematics for Libraries](guide/schematics-for-libraries)

### 追加 Schematics

追加 Schematics は通常、ライブラリに付属しているため、`ng add` を使用してライブラリを既存のプロジェクトに追加できます。
`add` コマンドはパッケージマネージャーを使用して新しい依存関係をダウンロードし、Schematic として実装されているインストールスクリプトを呼び出します。

たとえば、[`@angular/material`](https://material.angular.io/guide/schematics) Schematic は、Angular Material とテーマをインストールおよび設定し、`ng generate` で作成できる新しいスターターコンポーネントを登録するように `add` コマンドに指示します。
あなたはこれを、自身の追加 Schematic の例およびモデルとして見ることができます。

パートナーライブラリとサードパーティライブラリも、追加 Schematics により Angular CLIをサポートしています。
たとえば、`@ng-bootstrap/schematics` はアプリケーションに [ng-bootstrap](https://ng-bootstrap.github.io/) を追加し、`@clr/angular` は [VMWare から Clarity](https://vmware.github.io/clarity/documentation/v1.0/get-started) をインストールして設定します。

また、追加 Schematic は設定の変更のためにプロジェクトを更新したり、依存関係（ポリフィルなど）を追加したり、スキャフォールドパッケージ固有の初期化コードを追加したりできます。
たとえば、`@angular/pwa` Schematic は、マニフェストとサービスワーカーを追加することでアプリケーションを PWA に変換し、`@angular/elements` Schematic は、Angular Elements の `document-register-element.js` ポリフィルと依存関係を追加します。

### 生成 Schematics

生成 Schematics は、 `ng generate` コマンドの指示です。
文書化されたサブコマンドは、デフォルトの Angular 生成 Schematics を使用しますが、（サブコマンドの代わりに）別の Schematic を指定して、ライブラリで定義されたアーティファクトを生成できます。

たとえば、Angular Material は、それが定義するUIコンポーネントの生成 Schematics を提供します。
次のコマンドは、これらの Schematics の1つを使用して、並べ替えとページネーションのためにデータソースで事前に設定された Angular Material `<mat-table>` をレンダリングします。

<code-example language="bash">
ng generate @angular/material:table <component-name>
</code-example>

### 更新 Schematics

`ng update` コマンドを使用して、ワークスペースのライブラリ依存関係を更新できます。オプションを指定しないか、help オプションを使用すると、コマンドはワークスペースを検査して、更新するライブラリを提案します。

<code-example language="bash">
ng update
    We analyzed your package.json, there are some packages to update:

      Name                               Version                  Command to update
     --------------------------------------------------------------------------------
      @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
      @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
      @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
      @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
      rxjs                               6.3.3 -> 6.4.0           ng update rxjs


    There might be additional packages that are outdated.
    Run "ng update --all" to try to update all at the same time.
</code-example>

更新するライブラリのセット（または `--all` フラグ）をコマンドに渡すと、それらのライブラリ、それらのピア依存関係、およびそれらに依存するピア依存関係が更新されます。

<div class="alert is-helpful">

不整合がある場合（たとえば、ピアの依存関係を単純な [semver](https://semver.io/) 範囲で照合できない場合）、コマンドはエラーを生成し、ワークスペース内の何も変更しません。

デフォルトでは、すべての依存関係の更新を強制しないことをお勧めします。最初に特定の依存関係を更新してください。

`ng update` コマンドの動作の詳細については、[Update Command](https://github.com/angular/angular-cli/blob/master/docs/specifications/update.md) を参照してください。

</div>

重大な変更を引き起こすような、ライブラリの新しいバージョンを作成する場合、*更新 Schematics* を提供して、`ng update` コマンドが更新中のプロジェクトのそのような変更を自動的に解決できるようにすることができます。

たとえば、Angular Material ライブラリを更新するとします。

<code-example language="bash">
ng update @angular/material
</code-example>

このコマンドは、ワークスペースの `package.json` 内の `@angular/material` とその依存関係  `@angular/cdk` の両方を更新します。
いずれかのパッケージに、既存のバージョンから新しいバージョンへの移行をカバーする更新 Schematic が含まれている場合、コマンドはワークスペースでその Schematic を実行します。
