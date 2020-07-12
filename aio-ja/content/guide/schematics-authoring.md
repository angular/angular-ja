# Schematics の作成

独自の Schematics を作成して、Angular プロジェクトで操作することができます。
ライブラリ開発者は通常、Angular CLI と統合するために、ライブラリと一緒に Schematics をパッケージ化します。
また、スタンドアロンの Schematics を作成することで、開発環境に合わせてカスタマイズし、規格や制約に準拠させる方法として、Angular アプリケーションのファイルや構造を操作することもできます。
Schematics を連鎖させ、他の Schematics を実行して複雑な操作を行うことができます。

アプリケーションのコードを操作することは、非常に強力であり、相応の危険性があります。
たとえば、すでに存在するファイルを作成するとエラーが発生し、そのファイルを直ちに適用した場合、これまでに適用された他のすべての変更が破棄されます。
Angular Schematics ツールは、仮想ファイルシステムを作成することにより、副作用やエラーから保護します。
Schematics は、仮想ファイルシステムに適用できる変換のパイプラインについて記述しています。
Schematics が実行されると、変換はメモリに記録され、有効であることが確認された場合のみ、実際のファイルシステムに適用されます。

## Schematics の概念

Schematics のパブリック API は、基本的な概念を表すクラスを定義します。

* 仮想ファイルシステムは `Tree` で表されます。   `Tree` データ構造には、*ベース* (すでに存在するファイルのセット) と *ステージング領域* (ベースに適用される変更のリスト) が含まれています。
変更を行う場合、実際にはベースを変更するのではなく、それらの変更をステージング領域に追加します。

* `Rule` オブジェクトは、`Tree` を受け取り、変換を適用し、新しい `Tree` を返す関数を定義します。 Schematics のメインファイルである `index.ts` は、Schematics のロジックを実装する一連のルールを定義します。

* 変換は `Action` で表されます。 `Create`、`Rename`、`Overwrite`、`Delete` の4つのアクションタイプがあります。

* 各 Schematics は、`SchematicContext` オブジェクトによって表されるコンテキストで実行されます。

ルールに渡されたコンテキストオブジェクトは、デバッグに役立つロギング API を含め、Schematics で使用する可能性のあるユーティリティ関数とメタデータへのアクセスを提供します。
コンテキストは、ステージングされたツリーからベースツリーに変更をマージする方法を決定する *マージ戦略* も定義します。変更を受け入れるか無視するか、または例外をスローすることができます。

### ルールとアクションの定義

[Schematics CLI](#cli) で新しい空の Schematics を作成すると、生成された入力関数は *rule factory* になります。
`RuleFactory` オブジェクトは、`Rule` を作成する高次関数を定義します。

<code-example language="TypeScript" header="index.ts">
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// 関数をデフォルトとしてエクスポートする必要はありません。
// ファイルごとに複数の rule factory を設定することもできます。
export function helloWorld(_options: any): Rule {
 return (tree: Tree, _context: SchematicContext) => {
   return tree;
 };
}
</code-example>

ルールは、外部ツールを呼び出してロジックを実装することにより、プロジェクトに変更を加えることができます。
たとえば、Schematics のテンプレートをホスティングプロジェクトにマージする方法を定義するルールが必要です。

ルールは `@schematics/angular` パッケージで提供されるユーティリティを利用できます。 モジュール、依存関係、TypeScript、AST、JSON、Angular CLI のワークスペースとプロジェクトなどを操作するためのヘルパー関数を探します。

<code-example language="TypeScript" header="index.ts">

import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '&#64;angular-devkit/core';

</code-example>

### スキーマとインターフェースを使用した入力オプションの定義

ルールは、呼び出し元からオプション値を集約し、それらをテンプレートに挿入できます。
ルールで使用できるオプションとその許容値およびデフォルトは、Schematics の JSON スキーマファイル `<schematic>/schema.json` で定義されています。
TypeScript インターフェースを使用して、スキーマの変数または列挙データ型を定義できます。

スキーマは、Schematics で使用される変数の型とデフォルト値を定義します。
たとえば、以下は架空の "Hello World" Schematics のスキーマの例です。

<code-example language="json" header="src/hello-world/schema.json">

{
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "default": "world"
        },
        "useColor": {
            "type": "boolean"
        }
    }
}
</code-example>


Angular CLI コマンド Schematics のスキーマファイルの例は、[`@schematics/angular`](https://github.com/angular/angular-cli/blob/7.0.x/packages/schematics/angular/application/schema.json) にあります。

### Schematic プロンプト

Schematic *prompts* は、ユーザー操作を Schematics 実行に導入します。
カスタマイズ可能な質問をユーザーに表示するための Schematics オプションを設定できます。
プロンプトは Schematics を実行する前に表示され、Schematics はオプションの値として回答を使用します。
これにより、ユーザーは、利用可能なオプションの全範囲について深い知識を必要とせずに、Schematics の操作を指示できます。

たとえば、"Hello World"　の Schematics は、ユーザーに名前を尋ね、デフォルトの名前 "world" の代わりにその名前を表示することもできます。このようなプロンプトを定義するには、`name` 変数のスキーマに `x-prompt` プロパティを追加します。

同様に、hello アクションの実行時に Schematics で色を使用するかどうかをユーザーが決定できるプロンプトを追加できます。両方のプロンプトのスキーマは次のようになります。

<code-example language="json" header="src/hello-world/schema.json">

{
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "default": "world",
            "x-prompt": "What is your name?"
        },
        "useColor": {
            "type": "boolean",
            "x-prompt": "Would you like the response in color?"
        }
    }
}
</code-example>

#### 短形式のプロンプト構文

これらの例では、質問のテキストのみを提供するプロンプト構文の省略形を使用しています。
ほとんどの場合、これで十分です。
ただし、2つのプロンプトは異なるタイプの入力を想定していることに注意してください。
省略形を使用すると、プロパティのスキーマに基づいて、もっとも適切なタイプが自動的に選択されます。
この例では、`name` プロンプトは文字列プロパティであるため、`input` タイプを使用しています。
`useColor` プロンプトはブール型プロパティであるため、`confirmation` タイプを使用します。
この場合、"yes" は `true` に対応し、"no" は `false` に対応します。

サポートされている入力タイプは3つあります。

| 入力タイプ | 説明 |
| :----------- | :-------------------|
| confirmation | はい、またはいいえの質問。ブールオプションに最適です。 |
| input | テキスト入力。文字列または数値オプションに最適です。 |
| list | 事前定義された許可値のセット。 |

短い形式では、型はプロパティの型と制約から推測されます。

| プロパティスキーマ |	プロンプトタイプ |
| :--------------- | :------------- |
| "type": "boolean" |	confirmation ("yes"=`true`, "no"=`false`) |
| "type": "string"  |	input |
| "type": "number"  |	input (有効な番号のみ許可) |
| "type": "integer" |	input (有効な番号のみ許可) |
| "enum": [...]   	| list 	(列挙型メンバーはリスト選択になります) |

次の例では、プロパティは列挙値を取るため、Schematics は自動的にリストタイプを選択し、可能な値からメニューを作成します。

<code-example language="json" header="schema.json">

    "style": {
      "description": "The file extension or preprocessor to use for style files.",
      "type": "string",
      "default": "css",
      "enum": [
        "css",
        "scss",
        "sass",
        "less",
        "styl"
      ],
      "x-prompt": "Which stylesheet format would you like to use?"
    }

</code-example>

プロンプトランタイムは、JSON スキーマで提供された制約に対して与えられた応答を自動的に検証します。
値が受け入れられない場合、ユーザーは新しい値の入力を求められます。
これにより、Schematics に渡されるすべての値が Schematics の実装の期待値に確実に適合するため、Schematics のコード内に追加のチェックを加える必要はありません。

#### 長形式のプロンプト構文

`x-prompt` フィールド構文は、プロンプトの追加のカスタマイズと制御が必要な場合のために長い形式をサポートします。
この形式では、`x-prompt` フィールドの値は、プロンプトの動作をカスタマイズするサブフィールドをもつ JSON オブジェクトです。

| フィールド |	データ値 |
| :----------- | :------ |
| type    | `confirmation`、`input`、または `list` (短い形式で自動的に選択されます) |
| message |	文字列 (必須) |
| items   |	文字列 および/または ラベル/値 オブジェクトのペア ( `list` タイプでのみ有効) |

次の長い形式の例は、CLI が [generate applications](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56) に使用する Schematics のJSONスキーマです。
作成するアプリケーションに使用するスタイルプリプロセッサをユーザーが選択できるプロンプトを定義します。
長い形式を使用することにより、Schematics はメニュー選択の明確なフォーマットを提供できます。

<code-example language="json" header="package/schematics/angular/application/schema.json">

    "style": {
      "description": "The file extension or preprocessor to use for style files.",
      "type": "string",
      "default": "css",
      "enum": [
        "css",
        "scss",
        "sass",
        "less",
        "styl"
      ],
      "x-prompt": {
        "message": "Which stylesheet format would you like to use?",
        "type": "list",
        "items": [
          { "value": "css",  "label": "CSS" },
          { "value": "scss", "label": "SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]" },
          { "value": "sass", "label": "Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]" },
          { "value": "less", "label": "Less   [ http://lesscss.org                                             ]" },
          { "value": "styl", "label": "Stylus [ http://stylus-lang.com                                         ]" }
        ]
      },
    },
</code-example>

#### x-prompt スキーマ

Schematics のオプションを定義する JSON スキーマは、プロンプトとそれらの各動作の宣言的な定義を可能にする拡張機能をサポートしています。
プロンプトをサポートするために、Schematics のコードに追加のロジックや変更は必要ありません。
次の JSON スキーマは、`x-prompt` フィールドの長形式構文の完全な記述です。

<code-example language="json" header="x-prompt schema">

{
    "oneOf": [
        { "type": "string" },
        {
            "type": "object",
            "properties": {
                "type": { "type": "string" },
                "message": { "type": "string" },
                "items": {
                    "type": "array",
                    "items": {
                        "oneOf": [
                            { "type": "string" },
                            {
                                "type": "object",
                                "properties": {
                                    "label": { "type": "string" },
                                    "value": { }
                                },
                                "required": [ "value" ]
                            }
                        ]
                    }
                }
            },
            "required": [ "message" ]
        }
    ]
}

</code-example>

{@a cli}

## Schematics CLI

Schematics には独自のコマンドラインツールが付属しています。
Node 6.9 以降を使用して、Schematics コマンドラインツールをグローバルにインストールします。

<code-example language="bash">
npm install -g @angular-devkit/schematics-cli
</code-example>

これにより、`schematics` 実行可能ファイルがインストールされます。これを使用して、独自のプロジェクトフォルダーに新しい Schematics コレクションを作成したり、既存のコレクションに新しい Schematics を追加したり、既存の Schematics を拡張したりできます。

次のセクションでは、CLI を使用して新しい Schematics コレクションを作成し、ファイルとファイル構造、およびいくつかの基本的な概念を紹介します。

ただし、Schematics のもっとも一般的な使用法は、Angular ライブラリを Angular CLI と統合することです。
これを行うには、Schematics CLI を使用せずに、Angular ワークスペースのライブラリプロジェクト内で Schematics ファイルを直接作成します。
[Schematics for Libraries](guide/schematics-for-libraries) を参照してください。

### Schematics コレクションの作成

次のコマンドは、同じ名前の新しいプロジェクトフォルダーに `hello-world` という名前の新しい Schematics を作成します。

<code-example language="bash">
schematics blank --name=hello-world
</code-example>

`blank` Schematics は Schematics CLI によって提供されます。このコマンドは、新しいプロジェクトフォルダー (コレクションのルートフォルダー) とコレクション内の最初の名前付き Schematics を作成します。

コレクションフォルダーに移動し、npm 依存関係をインストールし、お気に入りのエディターで新しいコレクションを開いて、生成されたファイルを確認します。たとえば、VSCode を使用している場合：

<code-example language="bash">
cd hello-world
npm install
npm run build
code .
</code-example>

最初の Schematics はプロジェクトフォルダーと同じ名前を取得し、`src/hello-world` に生成されます。
このコレクションに関連する Schematics を追加し、生成されたスケルトンコードを変更して、Schematics の機能を定義できます。
各 Schematics 名は、コレクション内で一意である必要があります。

### Schematic の実行

名前の付いた Schematics を実行するには、`schematics`　コマンドを使用します。
プロジェクトフォルダーへのパス、Schematics 名、および必須オプションを次の形式で入力します。

<code-example language="bash">
schematics &lt;path-to-schematics-project&gt;:&lt;schematics-name&gt; --&lt;required-option&gt;=&lt;value&gt;
</code-example>

パスは、絶対パスでも、コマンドが実行される現在の作業ディレクトリからの相対パスでもかまいません。
たとえば、生成したばかりの Schematics (必要なオプションはありません) を実行するには、次のコマンドを使用します。

<code-example language="bash">
schematics .:hello-world
</code-example>

### コレクションへの Schematics の追加

Schematics を既存のコレクションに追加するには、新規 Schematics プロジェクトを開始するのと同じコマンドを使用しますが、コマンドはプロジェクトフォルダー内で実行します。

<code-example language="bash">
cd hello-world
schematics blank --name=goodbye-world
</code-example>

このコマンドは、メインの `index.ts` ファイルとそれに関連付けられたテストを使用して、コレクション内に新しい名前の付いた Schematics を生成します。
また、新しい Schematics の名前、説明、ファクトリー関数を、`collection.json` ファイル内のコレクションのスキーマに追加します。

## コレクションの内容

コレクションのルートプロジェクトフォルダーの最上位には、設定ファイル、`node_modules` フォルダー、および `src/` フォルダーが含まれています。
`src/` フォルダーには、コレクション内の名前付き Schematics のサブフォルダーと、集約された Schematics を説明するスキーマ `collection.json` が含まれています。
各 Schematics は、名前、説明、およびファクトリー関数を使用して作成されます。

<code-example language="none">
{
  "$schema":
     "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}
</code-example>

* `$schema` プロパティは、CLI が検証に使用するスキーマを指定します。
* `schematics` プロパティはこのコレクションに属する名前付きの Schematics をリストします。
    各 Schematics にはプレーンテキストの説明があり、メインファイルで生成されたエントリ関数を指します。
* `factory` プロパティは、生成されたエントリ関数を指します。この例では、`helloWorld()` ファクトリー関数を呼び出して、`hello-world` Schematics を起動します
* オプションの `schema` プロパティは、Schematics で使用できるコマンドラインオプションを定義する JSON スキーマファイルを指します。
* オプションの `aliases` 配列は、Schematics を起動するために使用できる1つ以上の文字列を指定します。
   たとえば、Angular CLI の “generate” コマンドの Schematics にはエイリアス “g” があり、コマンド `ng g` を使用できます。

### 名前付き Schematics

Schematics CLI を使用して空の Schematics プロジェクトを作成すると、新しい空の Schematics がコレクションの最初のメンバーになり、コレクションと同じ名前になります。
このコレクションに新しい名前の付いた Schematics を追加すると、自動的に `collection.json` スキーマに追加されます。

名前と説明に加えて、各 Schematics には、Schematics のエントリポイントを識別する `factory` プロパティがあります。
この例では、メインファイル `hello-world/index.ts` の `helloWorld()` 関数を呼び出して、Schematics の定義済み機能を起動します。

<div class="lightbox">
  <img src="generated/images/guide/schematics/collection-files.gif" alt="overview">
</div>

コレクション内の名前付きの各 Schematics には、次の主要な要素があります。

| | |
| :------------- | :-------------------------------------------|
| `index.ts`     | 名前付き Schematics の変換ロジックを定義するコード。  |
| `schema.json`  | Schematic 変数の定義。 |
| `schema.d.ts`  | Schematic 変数。  |
| `files/`       | 複製するオプションの コンポーネント/テンプレート ファイル。 |

追加のテンプレートなしで、Schematics がそのすべてのロジックを `index.ts` ファイルで提供することが可能です。
ただし、スタンドアロンの Angular プロジェクトと同様に、`files/` フォルダーにコンポーネントとテンプレートを提供することで、Angular の動的な Schematics を作成できます。
インデックスファイルのロジックは、データを挿入して変数を変更するルールを定義することにより、これらのテンプレートを構成します。
