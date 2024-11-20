# Angular コーディングスタイルガイド

Angularの構文、慣習、およびアプリケーション構造に関する意見のあるガイドを探していますか？
さあ、中へどうぞ。
このスタイルガイドでは、推奨される慣習、そして同様に重要なこととして、その理由について説明します。

## スタイル用語

各ガイドラインは、良い慣行または悪い慣行のいずれかを説明し、すべて一貫した形式で提示されます。

各ガイドラインの表現は、推奨の強さを示しています。

**Do** は、常に従うべきものです。
*常に* は少し強すぎる言葉かもしれません。
文字通り常に従うべきガイドラインは非常にまれです。
一方、*Do* ガイドラインを破るための非常に珍しいケースが必要になります。

**Consider** ガイドラインは、一般的に従うべきです。
ガイドラインの背後にある意味を完全に理解しており、逸脱する正当な理由がある場合は、そうしてください。
一貫性を目指しましょう。

**Avoid** は、ほとんど決して行うべきではないことを示しています。
*避けるべき* コード例には、見間違えようのない赤いヘッダーが付いています。

**Why**? <br />
前の推奨に従う理由を示します。

## ファイル構造の慣習

いくつかのコード例には、1つ以上の類似の名前の付いた付属ファイルを持つファイルが表示されています。
たとえば、`hero.component.ts` と `hero.component.html` です。

このガイドラインでは、これらのさまざまなファイルを表現するために、`hero.component.ts|html|css|spec` という省略記法を使用します。
このショートカットを使用することで、このガイドのファイル構造は読みやすく、簡潔になります。

## 単一責任

[*単一責任の原則 (SRP)*](https://wikipedia.org/wiki/Single_responsibility_principle) をすべてのコンポーネント、サービス、およびその他のシンボルに適用します。
これにより、アプリケーションがよりクリーンになり、読みやすく保守しやすくテストしやすくなります。

### ルール・オブ・ワン

#### スタイル 01-01

**Do** ファイルごとに、サービスやコンポーネントなど、1つのものだけを定義します。

**Consider** ファイルを400行のコードに制限します。

**Why**? <br />
ファイルごとに1つのコンポーネントにすることで、読みやすく、保守しやすく、ソース管理でチームとの衝突を回避できます。

**Why**? <br />
ファイルごとに1つのコンポーネントにすることで、コンポーネントを1つのファイルにまとめた場合に発生する可能性のある変数を共有したり、不要なクロージャや依存関係との不要な結合を作成したりする隠れたバグを回避できます。

**Why**? <br />
単一のコンポーネントは、そのファイルのデフォルトのエクスポートにでき、これによりルーターを使用した遅延読み込みが容易になります。

重要なのは、コードをより再利用可能にし、読みやすく、エラーが発生しにくくすることです。

次の*ネガティブ*な例では `AppComponent` を定義し、アプリケーションをブートストラップし、
`Hero` モデルオブジェクトを定義し、すべて同じファイルでサーバーからヒーローを読み込んでいます。
*これは行わないでください*。

<docs-code path="adev/src/content/examples/styleguide/src/01-01/app/heroes/hero.component.avoid.ts" language="typescript" header="app/heroes/hero.component.ts"/>

コンポーネントとそのサポートするクラスを、
それぞれ専用のファイルに歳配置することをお勧めします。

<docs-code-multifile>
    <docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/01-01/main.ts"/>
    <docs-code header="app/app.module.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.module.ts"/>
    <docs-code header="app/app.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/app.component.ts"/>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/heroes.component.ts"/>
    <docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.service.ts"/>
    <docs-code header="app/heroes/shared/hero.model.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/hero.model.ts"/>
    <docs-code header="app/heroes/shared/mock-heroes.ts" path="adev/src/content/examples/styleguide/src/01-01/app/heroes/shared/mock-heroes.ts"/>
</docs-code-multifile>

アプリケーションが成長するにつれて、このルールはさらに重要になります。

## 命名

命名規則は、保守性と可読性に非常に重要です。
このガイドでは、ファイル名とシンボル名の命名規則を推奨しています。

### 一般的な命名ガイドライン

#### スタイル 02-01

**Do** すべてのシンボルに一貫性のある名前を使用します。

**Do** シンボルの機能を最初に、次にタイプを記述するパターンに従います。
推奨されるパターンは `feature.type.ts` です。

**Why**? <br />
命名規則は、一目でコンテンツを見つけるための方法を提供します。
プロジェクト内の一貫性が重要です。
チーム内の一貫性が重要です。
会社全体で一貫性を持たせることで、効率が大幅に向上します。

**Why**? <br />
命名規則は、目的のコードをすばやく見つけ、理解しやすくするのに役立ちます。

**Why**? <br />
フォルダーとファイルの名前は、その意図を明確に伝える必要があります。
たとえば、`app/heroes/hero-list.component.ts` には、ヒーローのリストを管理するコンポーネントが含まれている場合があります。

### ドットとダッシュでファイル名を区切る

#### スタイル 02-02

**Do** ダッシュを使用して、記述的な名前の単語を区切ります。

**Do** ドットを使用して、記述的な名前をタイプと区切ります。

**Do** 機能を最初に、次にタイプを記述するパターンに従い、すべてのコンポーネントに一貫性のあるタイプ名を使用します。
推奨されるパターンは `feature.type.ts` です。

**Do** `.service`、`.component`、`.pipe`、`.module`、`.directive` などの従来のタイプ名を使用します。
必要に応じて追加のタイプ名を考案しますが、あまりにも多くのタイプ名を考案しないように注意してください。

**Why**? <br />
タイプ名は、ファイルの内容をすばやく識別するための方法を提供します。

**Why**? <br />
タイプ名は、エディターや IDE のあいまい検索テクニックを使用して、特定のファイルタイプを簡単に見つけることができます。

**Why**? <br />
`.service` などの省略されていないタイプ名は、記述的であり、あいまいではありません。
`.srv`、`.svc`、`.serv` などの省略形は、混乱する可能性があります。

**Why**? <br />
タイプ名は、自動化されたタスクのすべてのパターンマッチングを提供します。

### シンボルとファイル名

#### スタイル 02-03

**Do** 表現するものを基に名前が付けられたすべての資産に一貫性のある名前を使用します。

**Do** クラス名にはアッパーキャメルケースを使用します。

**Do** シンボルの名前をファイルの名前と一致させます。

**Do** シンボルの名前に、従来のサフィックス（`Component`、`Directive`、`Module`、`Pipe`、`Service` など）を追加して、そのタイプのものを表します。

**Do** ファイル名に、従来のサフィックス（`.component.ts`、`.directive.ts`、`.module.ts`、`.pipe.ts`、`.service.ts` など）を追加して、そのタイプのファイルを表します。

**Why**? <br />
一貫性のある規則により、さまざまなタイプの資産をすばやく識別して参照することが容易になります。

| シンボル名                                                                                                                                                                          | ファイル名 |
|:---                                                                                                                                                                                  |:---       |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class AppComponent { } </docs-code>                             | app.component.ts |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class HeroesComponent { } </docs-code>                          | heroes.component.ts |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class HeroListComponent { } </docs-code>                        | hero-list.component.ts |
| <docs-code hideCopy language="typescript"> @Component({ … }) <br>export class HeroDetailComponent { } </docs-code>                      | hero-detail.component.ts |
| <docs-code hideCopy language="typescript"> @Directive({ … }) <br>export class ValidationDirective { } </docs-code>                      | validation.directive.ts |
| <docs-code hideCopy language="typescript"> @NgModule({ … }) <br>export class AppModule </docs-code>                                     | app.module.ts |
| <docs-code hideCopy language="typescript"> @Pipe({ name: 'initCaps' }) <br>export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class UserProfileService { } </docs-code>                                  | user-profile.service.ts |

### サービス名

#### スタイル 02-04

**Do** すべてのサービスに一貫性のある名前を使用し、機能を基に名前を付けます。

**Do** サービスのクラス名に `Service` を追加します。
たとえば、データまたはヒーローを取得するものは、`DataService` または `HeroService` と呼ばれる必要があります。

いくつかの用語は、紛れもなくサービスです。
これらは通常、"-er" で終わることにより行為を表します。
メッセージをログに記録するサービスを `LoggerService` ではなく `Logger` と呼ぶ方が良い場合があります。
この例外がプロジェクトで受け入れられるかどうかを判断してください。
常に一貫性を目指します。

**Why**? <br />
サービスをすばやく識別して参照するための方法を提供します。

**Why**? <br />
`Logger` などの明確なサービス名は、サフィックスを必要としません。

**Why**? <br />
`Credit` などのサービス名は名詞であり、サフィックスを必要とし、サービスかどうか明らかでない場合は、サフィックスを付けて名前を付ける必要があります。

| シンボル名                                                                                                                                      | ファイル名 |
|:---                                                                                                                                              |:---       |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class HeroDataService { } </docs-code> | hero-data.service.ts |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class CreditService { } </docs-code>   | credit.service.ts    |
| <docs-code hideCopy language="typescript"> @Injectable() <br>export class Logger { } </docs-code>          | logger.service.ts    |

### ブートストラップ

#### スタイル 02-05

**Do** アプリケーションのブートストラップとプラットフォームロジックを `main.ts` という名前のファイルに配置します。

**Do** ブートストラップロジックにエラー処理を含めます。

**Avoid** アプリケーションロジックを `main.ts` に配置します。
代わりに、コンポーネントまたはサービスに配置することを検討してください。

**Why**? <br />
アプリケーションのスタートアップロジックに対する一貫性のある規則に従います。

**Why**? <br />
他のテクノロジープラットフォームの一般的な規則に従います。

<docs-code header="main.ts" path="adev/src/content/examples/styleguide/src/02-05/main.ts"/>

### コンポーネントセレクター {#component-selectors}

#### スタイル 05-02

**Do** コンポーネントの要素セレクターに名前を付ける場合、*ダッシュケース*または*ケバブケース*を使用します。

**Why**? <br />
要素名を、[カスタム要素](https://www.w3.org/TR/custom-elements) の仕様と一貫性を持たせます。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-02/app/app.component.html"/>
</docs-code-multifile>

### コンポーネントのカスタムプレフィックス

#### スタイル 02-07

**Do** ハイフンで区切られた、小文字の要素セレクター値を使用します。たとえば、`admin-users` です。

**Do** 機能領域またはアプリケーション自体を識別するプレフィックスを使用します。

**Why**? <br />
他のアプリケーションのコンポーネントやネイティブの HTML 要素との要素名の衝突を防ぎます。

**Why**? <br />
コンポーネントを他のアプリケーションで簡単にプロモートして共有できます。

**Why**? <br />
コンポーネントは DOM で簡単に識別できます。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/heroes/hero.component.ts" visibleRegion="example"/>

<docs-code header="app/users/users.component.ts" path="adev/src/content/examples/styleguide/src/02-07/app/users/users.component.ts" visibleRegion="example"/>

### ディレクティブセレクター

#### スタイル 02-06

**Do** ディレクティブのセレクターに名前を付ける場合、アッパーキャメルケースを使用します。

**Why**? <br />
ビューにバインドされているディレクティブで定義されているプロパティの名前を、属性名と一貫性を持たせます。

**Why**? <br />
Angular の HTML パーサーは大文字小文字を区別し、アッパーキャメルケースを認識します。

### ディレクティブのカスタムプレフィックス

#### スタイル 02-08

**Do** ネイティブの HTML 属性と一致するセレクターでない限り、要素以外のセレクターをアッパーキャメルケースで記述します。

**Don't** ディレクティブ名を `ng` で始めないでください。このプレフィックスは Angular に予約されており、使用すると、診断が難しいバグが発生する可能性があります。

**Why**? <br />
名前の衝突を防ぎます。

**Why**? <br />
ディレクティブは簡単に識別できます。

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.avoid.ts" visibleRegion="example"/>

<docs-code header="app/shared/validate.directive.ts" path="adev/src/content/examples/styleguide/src/02-08/app/shared/validate.directive.ts" visibleRegion="example"/>

### パイプ名

#### スタイル 02-09

**Do** すべてのパイプに一貫性のある名前を使用し、機能を基に名前を付けます。
パイプのクラス名は `UpperCamelCase`（クラス名の一般的な規則）を使用し、対応する `name` 文字列は *lowerCamelCase* を使用する必要があります。
`name` 文字列は、ハイフン（"ダッシュケース" または "ケバブケース"）を使用できません。

**Why**? <br />
パイプをすばやく識別して参照するための方法を提供します。

| シンボル名                                                                                                                                                                          | ファイル名 |
|:---                                                                                                                                                                                  |:---       |
| <docs-code hideCopy language="typescript"> @Pipe({ name: 'ellipsis' }) <br>export class EllipsisPipe implements PipeTransform { } </docs-code> | ellipsis.pipe.ts  |
| <docs-code hideCopy language="typescript"> @Pipe({ name: 'initCaps' }) <br>export class InitCapsPipe implements PipeTransform { } </docs-code> | init-caps.pipe.ts |

### ユニットテストファイル名

#### スタイル 02-10

**Do** テスト仕様ファイルに、テストするコンポーネントと同じ名前を付けます。

**Do** テスト仕様ファイルに `.spec` のサフィックスを付けます。

**Why**? <br />
テストをすばやく識別するための方法を提供します。

**Why**? <br />
[karma](https://karma-runner.github.io) やその他のテストランナーのパターンマッチングを提供します。

| テストタイプ | ファイル名 |
|:---        |:---        |
| コンポーネント | heroes.component.spec.ts <br /> hero-list.component.spec.ts <br /> hero-detail.component.spec.ts |
| サービス  | logger.service.spec.ts <br /> hero.service.spec.ts <br /> filter-text.service.spec.ts            |
| パイプ     | ellipsis.pipe.spec.ts <br /> init-caps.pipe.spec.ts                                              |

## アプリケーション構造と NgModules

実装の短期的な視点と長期的なビジョンを持ちます。
小さく始めて、アプリケーションの進む方向を念頭に置いておきましょう。

アプリケーションのすべてのコードは `src` という名前のフォルダーに格納されます。
すべての機能領域は、それぞれのフォルダーにあります。

すべてのコンテンツは、ファイルごとに1つの資産です。
各コンポーネント、サービス、およびパイプは、それぞれのファイルにあります。
すべてのサードパーティベンダーのスクリプトは、別のフォルダーに格納され、`src` フォルダーには格納されません。
このガイドのファイルの命名規則を使用します。

### 全体的な構造ガイドライン

#### スタイル 04-06

**Do** 小さく始めて、アプリケーションが将来どのように進むかを念頭に置いておきましょう。

**Do** 実装の短期的な視点と長期的なビジョンを持ちます。

**Do** アプリケーションのすべてのコードを `src` という名前のフォルダーに格納します。

**Consider** コンポーネントに複数の付属ファイル（`.ts`、`.html`、`.css`、`.spec`）がある場合、コンポーネント用のフォルダーを作成します。

**Why**? <br />
初期段階では、アプリケーションの構造を小さく、保守しやすい状態に保つのに役立ち、アプリケーションが成長しても進化が容易になります。

**Why**? <br />
コンポーネントには、多くの場合4つのファイル（たとえば、`*.html`、`*.css`、`*.ts`、`*.spec.ts`）があり、フォルダーをすぐに乱雑にする可能性があります。

以下は、準拠するフォルダーとファイルの構造です。

```markdown
プロジェクトルート
├── src
│ ├── app
│ │ ├── core
│ │ │ └── exception.service.ts|spec.ts
│ │ │ └── user-profile.service.ts|spec.ts
│ │ ├── heroes
│ │ │ ├── hero
│ │ │ │ └── hero.component.ts|html|css|spec.ts
│ │ │ ├── hero-list
│ │ │ │ └── hero-list.component.ts|html|css|spec.ts
│ │ │ ├── shared
│ │ │ │ └── hero-button.component.ts|html|css|spec.ts
│ │ │ │ └── hero.model.ts
│ │ │ │ └── hero.service.ts|spec.ts
│ │ │ └── heroes.component.ts|html|css|spec.ts
│ │ │ └── heroes.routes.ts
│ │ ├── shared
│ │ │ └── init-caps.pipe.ts|spec.ts
│ │ │ └── filter-text.component.ts|spec.ts
│ │ │ └── filter-text.service.ts|spec.ts
│ │ ├── villains
│ │ │ ├── villain
│ │ │ │ └── …
│ │ │ ├── villain-list
│ │ │ │ └── …
│ │ │ ├── shared
│ │ │ │ └── …
│ │ │ └── villains.component.ts|html|css|spec.ts
│ │ │ └── villains.module.ts
│ │ │ └── villains-routing.module.ts
│ │ └── app.component.ts|html|css|spec.ts
│ │ └── app.routes.ts
│ └── main.ts
│ └── index.html
│ └── …
└── node_modules/…
└── …
```

HELPFUL: 専用フォルダーにあるコンポーネントは広く推奨されていますが、小規模なアプリケーションでは、コンポーネントをフラットに（専用フォルダーに置かないで）保持することも別の選択肢です。
これにより、既存のフォルダーに4つのファイルが追加されますが、フォルダーのネストも減少します。
いずれを選択する場合でも、一貫性を保ってください。

### *機能別フォルダー* 構造

#### スタイル 04-07

**Do** 表現する機能領域の名前を付けたフォルダーを作成します。

**Why**? <br />
開発者は、コードを見つけて、各ファイルが何を表しているかを一目で識別できます。
構造は可能な限りフラットで、重複または冗長な名前はありません。

**Why**? <br />
コンテンツを整理することで、アプリケーションが乱雑になるのを防ぐのに役立ちます。

**Why**? <br />
たとえば10個以上のファイルがある場合、一貫性のあるフォルダー構造があれば、ファイルを簡単に見つけることができますが、フラットな構造では難しくなります。

詳細については、[このフォルダーとファイルの構造の例](#全体的な構造ガイドライン) を参照してください。

### アプリケーションの*ルートモジュール*

IMPORTANT: 以下のスタイルガイドの推奨事項は、`NgModule` をベースにしたアプリケーションを対象としています。新しいアプリケーションでは、スタンドアロンコンポーネント、ディレクティブ、およびパイプを使用する必要があります。

#### スタイル 04-08

**Do** アプリケーションのルートフォルダーにNgModuleを作成します。たとえば、`NgModule` ベースのアプリケーションを作成する場合は、`/src/app` に作成します。

**Why**? <br />
すべての `NgModule` ベースのアプリケーションには、少なくとも1つのルートNgModuleが必要です。

**Consider** ルートモジュールに `app.module.ts` という名前を付けます。

**Why**? <br />
ルートモジュールを簡単に特定して識別できます。

<docs-code path="adev/src/content/examples/styleguide/src/04-08/app/app.module.ts" language="typescript" visibleRegion="example" header="app/app.module.ts"/>

### 機能モジュール

#### スタイル 04-09

**Do** アプリケーションのすべての異なる機能にNgModuleを作成します。たとえば、`Heroes` 機能です。

**Do** 機能モジュールを、機能領域と同じ名前のフォルダーに配置します。たとえば、`app/heroes` です。

**Do** 機能モジュールのファイルに、機能領域、フォルダー、ファイルの名前を反映した名前を付けます。たとえば、`app/heroes/heroes.module.ts` は `HeroesModule` を定義します。

**Do** 機能モジュールのシンボルに、機能領域、フォルダー、ファイルの名前を反映した名前を付けます。たとえば、`app/heroes/heroes.module.ts` は `HeroesModule` を定義します。

**Why**? <br />
機能モジュールは、その実装を他のモジュールに対して公開または非公開にできます。

**Why**? <br />
機能モジュールは、機能領域を構成する関連するコンポーネントの異なるセットを識別します。

**Why**? <br />
機能モジュールは、eagerにもlazyにも簡単にルーティングできます。

**Why**? <br />
機能モジュールは、特定の機能と他のアプリケーション機能の間に明確な境界を定義します。

**Why**? <br />
機能モジュールにより、開発の責任を異なるチームに割り当てるのが容易になります。

**Why**? <br />
機能モジュールは、テスト用に簡単に分離できます。

### 共有機能モジュール

#### スタイル 04-10

**Do** `shared` フォルダーに `SharedModule` という名前の機能モジュールを作成します。たとえば、`app/shared/shared.module.ts` は `SharedModule` を定義します。

**Do** コンポーネント、ディレクティブ、およびパイプを、他の機能モジュールで宣言されているコンポーネントによって参照される場合、共有モジュールで宣言します。

**Consider** 共有モジュールのコンテンツがアプリケーション全体で参照される場合は、
`SharedModule` という名前を使用します。

**Consider** サービスを共有モジュールに提供しないようにします。
サービスは、通常、アプリケーション全体または特定の機能モジュールで1回提供されるシングルトンです。
ただし、例外もあります。
たとえば、次のサンプルコードでは、`SharedModule` が `FilterTextService` を提供していることに注意してください。
これは、サービスがステートレスであるため、ここでは許容されます。つまり、サービスのコンシューマーは、新しいインスタンスによって影響を受けません。

**Do** `SharedModule` の資産に必要なすべてのモジュール（たとえば、`CommonModule` と `FormsModule`）をインポートします。

**Why**? <br />
`SharedModule` には、他の共通モジュールの機能を必要とする可能性のあるコンポーネント、ディレクティブ、およびパイプが含まれています。たとえば、`CommonModule` の `ngFor` です。

**Do** すべてのコンポーネント、ディレクティブ、およびパイプを `SharedModule` で宣言します。

**Do** 他の機能モジュールで使用するために必要なすべてのシンボルを `SharedModule` からエクスポートします。

**Why**? <br />
`SharedModule` は、多くの他のモジュールのコンポーネントのテンプレートで使用できる、共通のコンポーネント、ディレクティブ、およびパイプを公開するために存在します。

**Avoid** `SharedModule` で、アプリケーション全体のシングルトンプロバイダーを指定します。
意図的なシングルトンは問題ありません。
注意してください。

**Why**? <br />
その共有モジュールをインポートする遅延読み込みされた機能モジュールは、サービスの独自の複製を作成し、望ましくない結果を招く可能性があります。

**Why**? <br />
各モジュールに、シングルトンサービスの独自の独立したインスタンスを持たせたくありません。
しかし、`SharedModule` がサービスを提供する場合、それは実際に発生する可能性があります。

```markdown
プロジェクトルート
├──src
├──├──app
├──├──├── shared
├──├──├──└── shared.module.ts
├──├──├──└── init-caps.pipe.ts|spec.ts
├──├──├──└── filter-text.component.ts|spec.ts
├──├──├──└── filter-text.service.ts|spec.ts
├──├──└── app.component.ts|html|css|spec.ts
├──├──└── app.module.ts
├──├──└── app-routing.module.ts
├──└── main.ts
├──└── index.html
└── …
```

<docs-code-multifile>
    <docs-code header="app/shared/shared.module.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/shared.module.ts"/>
    <docs-code header="app/shared/init-caps.pipe.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/init-caps.pipe.ts"/>
    <docs-code header="app/shared/filter-text/filter-text.component.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/filter-text/filter-text.component.ts"/>
    <docs-code header="app/shared/filter-text/filter-text.service.ts" path="adev/src/content/examples/styleguide/src/04-10/app/shared/filter-text/filter-text.service.ts"/>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/04-10/app/heroes/heroes.component.ts"/>
    <docs-code header="app/heroes/heroes.component.html" path="adev/src/content/examples/styleguide/src/04-10/app/heroes/heroes.component.html"/>
</docs-code-multifile>

### 遅延読み込みされたフォルダー

#### スタイル 04-11

異なるアプリケーション機能またはワークフローは、アプリケーションの開始時にではなく、*オンデマンド*で*遅延ロード*できます。

**Do** 遅延読み込みされた機能のコンテンツを*遅延ロードされたフォルダー*に配置します。
一般的な*遅延ロードされたフォルダー*には、*ルーティングコンポーネント*、その子コンポーネント、および関連する資産が含まれています。

**Why**? <br />
フォルダーにより、機能のコンテンツを簡単に識別して分離できます。

## コンポーネント

### コンポーネントを要素として

#### スタイル 05-03

**Consider** コンポーネントに*属性*または*クラス*セレクターではなく*要素*セレクターを付与します。

**Why**? <br />
コンポーネントは、HTMLとオプションのAngularテンプレート構文を含むテンプレートを持っています。
コンテンツを表示します。
開発者は、ネイティブのHTML要素やWebコンポーネントと同じように、コンポーネントをページに配置します。

**Why**? <br />
テンプレートのhtmlを見ると、シンボルがコンポーネントであることを認識しやすくなります。

HELPFUL: 属性をコンポーネントに付与する必要があるケースはいくつかあります。たとえば、組み込みの要素を拡張する場合です。
[Material Design](https://material.angular.io/components/button/overview) では、`<button mat-button>` でこのテクニックを使用しています。
ただし、カスタム要素ではこのテクニックを使用しません。

<docs-code header="app/heroes/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-03/app/app.component.html"/>
</docs-code-multifile>

### テンプレートとスタイルをそれぞれのファイルに抽出する

#### スタイル 05-04

**Do** テンプレートとスタイルを、3行を超える場合、別のファイルに抽出します。

**Do** テンプレートファイルに `[component-name].component.html` という名前を付けます。ここで、[component-name]はコンポーネント名です。

**Do** スタイルファイルに `[component-name].component.css` という名前を付けます。ここで、[component-name]はコンポーネント名です。

**Do** `./` で始まる*コンポーネント相対* URLを指定します。

**Why**? <br />
大きく、インライン化されたテンプレートとスタイルは、コンポーネントの目的と実装を隠蔽し、可読性と保守性を低下させます。

**Why**? <br />
ほとんどのエディターでは、インライン化されたテンプレートとスタイルを開発する場合、構文ヒントやコードスニペットは使用できません。
Angular TypeScript Language Serviceは、それをサポートするエディターでは、これらの欠陥をHTMLテンプレートで克服することを約束しています。CSSスタイルには役立ちません。

**Why**? <br />
*コンポーネント相対* URLは、ファイルが一緒に残っている限り、コンポーネントファイルを移動しても変更する必要はありません。

**Why**? <br />
`./` プレフィックスは、相対URLの標準的な構文です。Angularが現在、そのプレフィックスなしで動作することを期待しないでください。

<docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" visibleRegion="example"/>

<docs-code-multifile>
    <docs-code header="app/heroes/heroes.component.ts" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/heroes.component.html" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.html"/>
    <docs-code header="app/heroes/heroes.component.css" path="adev/src/content/examples/styleguide/src/05-04/app/heroes/heroes.component.css"/>
</docs-code-multifile>

### `input` と `output` プロパティを装飾する

#### スタイル 05-12

**Do** `@Directive` と `@Component` メタデータの `inputs` と `outputs` プロパティではなく、`@Input()` と `@Output()` クラスデコレーターを使用します。

**Consider** `@Input()` または `@Output()` を装飾するプロパティと同じ行に配置します。

**Why**? <br />
クラスのプロパティのいずれがインプットまたはアウトプットかを簡単に判別できます。

**Why**? <br />
`@Input()` または `@Output()` に関連付けられているプロパティ名やイベント名を変更する必要がある場合は、1か所で変更できます。

**Why**? <br />
ディレクティブに付加されたメタデータ宣言は短くなり、可読性が高まります。

**Why**? <br />
デコレーターを同じ行に配置すると、通常はコードが短くなり、プロパティがインプットまたはアウトプットとして簡単に識別できます。
明らかに可読性が向上する場合、上の行に配置します。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>

### `inputs` と `outputs` のエイリアスを避ける

#### スタイル 05-13

**Avoid** 重要な目的を果たす場合を除き、`input` と `output` のエイリアスを使用します。

**Why**? <br />
同じプロパティに対する2つの名前（1つはプライベート、もう1つはパブリック）は、本質的に混乱を招きます。

**Why**? <br />
ディレクティブ名が `input` プロパティでもある場合、エイリアスを使用する必要があります。
また、ディレクティブ名はプロパティを記述していません。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
    <docs-code header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="adev/src/content/examples/styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-13/app/app.component.html"/>
</docs-code-multifile>

### 複雑なコンポーネントロジックをサービスに委任する

#### スタイル 05-15

**Do** コンポーネントのロジックを、ビューに必要なものだけに制限します。
その他のすべてのロジックは、サービスに委任する必要があります。

**Do** 再利用可能なロジックをサービスに移動し、コンポーネントをシンプルで、目的のみに集中させます。

**Why**? <br />
ロジックは、サービス内に配置され、関数として公開されている場合、複数のコンポーネントで再利用できます。

**Why**? <br />
サービス内のロジックは、ユニットテストで簡単に分離できます。一方、コンポーネント内の呼び出し側のロジックは、簡単にモック化できます。

**Why**? <br />
依存関係を削除し、コンポーネントから実装の詳細を隠蔽します。

**Why**? <br />
コンポーネントをスリムで、トリミングして、目的のみに集中させます。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>

### `output` プロパティにプレフィックスを付けない

#### スタイル 05-16

**Do** `on` プレフィックスなしでイベントに名前を付けます。

**Do** イベントハンドラーメソッドに、`on` プレフィックスに続いてイベント名を付けた名前を付けます。

**Why**? <br />
これは、ボタンクリックなどの組み込みのイベントと一貫性があります。

**Why**? <br />
Angularは、[代替構文](guide/templates/binding) `on-*` を許可しています。
イベント自体に `on` プレフィックスが付いていた場合、`on-onEvent` バインド式になります。

<docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.avoid.html"/>

<docs-code-multifile>
    <docs-code header="app/heroes/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-16/app/heroes/hero.component.ts" visibleRegion="example"/>
    <docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/05-16/app/app.component.html"/>
</docs-code-multifile>

### プレゼンテーションロジックをコンポーネントクラスに配置する

#### スタイル 05-17

**Do** プレゼンテーションロジックを、テンプレートではなく、コンポーネントクラスに配置します。

**Why**? <br />
ロジックは、テンプレートに分散されるのではなく、1か所（コンポーネントクラス）に含まれます。

**Why**? <br />
コンポーネントのプレゼンテーションロジックをテンプレートではなくクラスに保持することで、テスト容易性、保守性、および再利用性を向上させます。

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/hero-list/hero-list.component.ts" path="adev/src/content/examples/styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" visibleRegion="example"/>
### インプットを初期化する

#### スタイル 05-18

TypeScriptの `--strictPropertyInitialization` コンパイラオプションは、クラスがコンストラクション中にプロパティを初期化するようにします。
有効にすると、このオプションにより、クラスがオプションとして明示的にマークされていないプロパティに値を設定しない場合、TypeScriptコンパイラはエラーを報告します。

設計上、Angularはすべての `@Input` プロパティをオプションとして扱います。
可能な場合は、デフォルト値を提供することで、`--strictPropertyInitialization` を満たす必要があります。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.ts" visibleRegion="example"/>

プロパティにデフォルト値を作成するのが難しい場合は、`?` を使用して、プロパティをオプションとして明示的にマークします。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.optional.ts" visibleRegion="example"/>

必要な `@Input` フィールドが必要になる場合があります。つまり、すべてのコンポーネントユーザーは、その属性を渡す必要があります。
このような場合は、デフォルト値を使用します。
`!` を使用してTypeScriptエラーを抑制するだけでは不十分であり、避けるべきです。これは、入力値が提供されていることを型チェッカーが確認できなくなるためです。

<docs-code header="app/heroes/hero/hero.component.ts" path="adev/src/content/examples/styleguide/src/05-18/app/heroes/hero/hero.component.avoid.ts" visibleRegion="example"/>

## ディレクティブ

### ディレクティブを使用して要素を拡張する

#### スタイル 06-01

**Do** テンプレートのないプレゼンテーションロジックがある場合、属性ディレクティブを使用します。

**Why**? <br />
属性ディレクティブには、関連付けられたテンプレートがありません。

**Why**? <br />
要素には、複数の属性ディレクティブを適用できます。

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/styleguide/src/06-01/app/shared/highlight.directive.ts" visibleRegion="example"/>

<docs-code header="app/app.component.html" path="adev/src/content/examples/styleguide/src/06-01/app/app.component.html"/>

### `HostListener`/`HostBinding` デコレーターと `host` メタデータ

#### スタイル 06-03

**Consider** `@Directive` と `@Component` デコレーターの `host` プロパティよりも、`@HostListener` と `@HostBinding` を優先します。

**Do** 選択肢を常に一貫性を持たせてください。

**Why**? <br />
`@HostBinding` に関連付けられているプロパティまたは `@HostListener` に関連付けられているメソッドは、ディレクティブのクラス内のみで変更できます。
`host` メタデータプロパティを使用する場合は、ディレクティブのクラス内のプロパティ/メソッドの宣言と、ディレクティブに関連付けられているデコレーター内のメタデータを両方とも変更する必要があります。

<docs-code header="app/shared/validator.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator.directive.ts"/>

推奨される `host` メタデータの代替方法と比較してください。

**Why**? <br />
`host` メタデータは、覚えるべき用語が1つだけであり、追加のESインポートは必要ありません。

<docs-code header="app/shared/validator2.directive.ts" path="adev/src/content/examples/styleguide/src/06-03/app/shared/validator2.directive.ts"/>
## サービス

### サービスはシングルトンです

#### スタイル 07-01

**Do** サービスを、同じインジェクター内ではシングルトンとして使用します。
データと機能を共有するために使用します。

**Why**? <br />
サービスは、機能領域またはアプリケーション全体でメソッドを共有するのに最適です。

**Why**? <br />
サービスは、ステートフルなメモリ内データを共有するのに最適です。

<docs-code header="app/heroes/shared/hero.service.ts" path="adev/src/content/examples/styleguide/src/07-01/app/heroes/shared/hero.service.ts" visibleRegion="example"/>

### サービスを提供する

#### スタイル 07-03

**Do** サービスを、サービスの `@Injectable` デコレーター内のアプリケーションルートインジェクターで提供します。

**Why**? <br />
Angularインジェクターは階層構造になっています。

**Why**? <br />
サービスをルートインジェクターに提供すると、そのサービスのインスタンスは共有され、サービスを必要とするすべてのクラスで利用できます。
これは、サービスがメソッドまたは状態を共有している場合に最適です。

**Why**? <br />
サービスをサービスの `@Injectable` デコレーターに登録すると、[Angular CLI](cli) の本番ビルドで使用されるものなどの最適化ツールは、ツリーシェイクを実行し、アプリケーションで使用されていないサービスを削除できます。

**Why**? <br />
これは、2つの異なるコンポーネントがサービスの異なるインスタンスを必要とする場合に最適ではありません。
このシナリオでは、新しい個別のインスタンスを必要とするコンポーネントレベルでサービスを提供する方が良いでしょう。

<docs-code header="src/app/treeshaking/service.ts" path="adev/src/content/examples/dependency-injection/src/app/tree-shaking/service.ts"/>

### `@Injectable()` クラスデコレーターを使用する

#### スタイル 07-04

**Do** サービスの依存関係のトークンとしてタイプを使用する場合、`@Inject` パラメータデコレーターではなく、`@Injectable()` クラスデコレーターを使用します。

**Why**? <br />
Angular Dependency Injection（DI）メカニズムは、
サービスのコンストラクターパラメーターの宣言されたタイプに基づいて、サービス自身の依存関係を解決します。

**Why**? <br />
サービスがタイプトークンに関連付けられた依存関係のみを受け入れる場合、`@Injectable()` 構文は、各コンストラクターパラメーターに `@Inject()` を使用するよりもはるかに簡潔です。

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-arena.service.ts" path="adev/src/content/examples/styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" visibleRegion="example"/>
## データサービス

### サービスを通じてサーバーにアクセスする

#### スタイル 08-01

**Do** データ操作やデータと対話するロジックをサービスにリファクタリングします。

**Do** データサービスを、XHR呼び出し、ローカルストレージ、メモリへのスタッシュ、またはその他のデータ操作の責任にします。

**Why**? <br />
コンポーネントの責任は、プレゼンテーションと、ビューの情報を収集することです。
データの取得方法を気にする必要はありません。誰に尋ねればいいかだけわかっていれば十分です。
データサービスを分離すると、データの取得方法に関するロジックがデータサービスに移され、コンポーネントはよりシンプルになり、ビューに集中できます。

**Why**? <br />
これにより、データサービスを使用するコンポーネントをテストする際に、データ呼び出しを（モックまたは本物で）簡単にテストできます。

**Why**? <br />
ヘッダー、HTTPメソッド、キャッシュ、エラー処理、再試行ロジックなどのデータ管理の詳細情報は、コンポーネントやその他のデータコンシューマーにとって無関係です。

データサービスは、これらの詳細をカプセル化します。
サービス内でこれらの詳細を簡単に進化させることができ、コンシューマーに影響を与えることはありません。
また、モックサービスの実装を使用して、コンシューマーを簡単にテストできます。

## ライフサイクルフック

ライフサイクルフックを使用して、Angularで公開されている重要なイベントを活用します。

### ライフサイクルフックインターフェースを実装する

#### スタイル 09-01

**Do** ライフサイクルフックインターフェースを実装します。

**Why**? <br />
ライフサイクルインターフェースは、型指定されたメソッドシグネチャを規定しています。
これらのシグネチャを使用して、スペルミスや構文ミスを検出します。

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" visibleRegion="example"/>

<docs-code header="app/heroes/shared/hero-button/hero-button.component.ts" path="adev/src/content/examples/styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" visibleRegion="example"/>
## 付録

Angularに役立つツールとヒント。

### ファイルテンプレートとスニペット

#### スタイル A-02

**Do** ファイルテンプレートやスニペットを使用して、一貫性のあるスタイルとパターンに従うようにします。
以下は、いくつかのWeb開発エディターとIDE用のテンプレートまたはスニペットです。

**Consider** これらのスタイルとガイドラインに従う、[Visual Studio Code](https://code.visualstudio.com) 用の[スニペット](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) を使用します。

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">

<img alt="拡張機能を使用する" src="assets/images/guide/styleguide/use-extension.gif">

</a>

**Consider** これらのスタイルとガイドラインに従う、[Sublime Text](https://www.sublimetext.com) 用の[スニペット](https://github.com/orizens/sublime-angular2-snippets) を使用します。

**Consider** これらのスタイルとガイドラインに従う、[Vim](https://www.vim.org) 用の[スニペット](https://github.com/mhartington/vim-angular2-snippets) を使用します。
