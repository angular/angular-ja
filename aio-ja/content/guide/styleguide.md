# Angularコーディングスタイルガイド

Angular構文、表記法、およびアプリケーション構造に関する有益なガイドをお探しですか？
心配いりません！
このスタイルガイドで、好ましい規則を提示し、その重要な理由を説明します。

{@a toc}

## スタイルのボキャブラリー {@a style-vocabulary}

個々のガイドラインはよいプラクティスか悪いプラクティスのどちらかを示しており、それらのすべてが一貫した表現を持っています。

個々のガイドラインの表現は、その推奨がどれほど強いかを示しています。

<div class="s-rule do">

**Do** は常に従うべきものです。
_常に_ は少し言葉が強いかもしれません。
常に従うべきガイドラインが出てくることは非常に稀です。
しかし、 *Do* ガイドラインを破るには異例なケースが必要となります。

</div>

<div class="s-rule consider">

**Consider** は一般的に守るべきものです。
このガイドラインの意図を理解した上で、逸脱する理由があるなら守る必要はありません。一貫することを心がけてください。

</div>

<div class="s-rule avoid">

**Avoid** は決してしてはいけないものです。赤色のヘッダが付いているコードブロックは *Avoid* コード例になります。

</div>

<div class="s-why">

**Why?** は推奨事項である理由が書かれます。

</div>

## ファイル構造の規約 {@a file-structure-conventions}

いくつかのコード例は、同様の名前を持った関連したファイルが1つ以上あります。
たとえば、`hero.component.ts` と `hero.component.html` です。

このガイドラインでは、これらのファイルを表すために `hero.component.ts|html|css|spec` であるとします。省略することでこのガイドラインが簡潔になりファイル構造が読み易くなるためです。


{@a single-responsibility}

## 単一責任

すべてのコンポーネント、サービス、およびその他のシンボルに
<a href="https://wikipedia.org/wiki/Single_responsibility_principle"><i>単一責任の原則</i> (SRP)</a>
を適用させます。
これは、アプリをよりきれいにし、読みやすく、維持しやすくし、テストをしやすくするのに役立ちます。

{@a 01-01}

### 単一のルール

#### Style 01-01


<div class="s-rule do">



**Do** サービスやコンポーネントなどは1ファイルにつき1つだけの定義としてください。


</div>



<div class="s-rule consider">



**Consider** ファイルを400行のコードに制限します。


</div>



<div class="s-why">



**Why?** 1ファイルにつき1コンポーネントとすることで、読み取り、保守、および
チーム内でソース管理をする際に衝突の回避がはるかに容易になります。


</div>



<div class="s-why">



**Why?** 1ファイルにつき1コンポーネントとすることで、変数が共有されたり、不要なクロージャが作成されたりといった、ファイル内のコンポーネント結合をする時によく発生する、依存関係との望ましくない結合による隠れたバグを回避できます。


</div>



<div class="s-why-last">



**Why?** 単一のコンポーネントにするとファイルを、ルーターでの遅延ロードを容易にさせるデフォルトエクスポートにすることができるためです。

</div>



重要なことは、コードを再利用しやすく読みやすいものにして、間違いやすさを減らすことです。

次の *negative* な例は、 `AppComponent` を定義し、アプリを自動起動し、 `Hero` モデルオブジェクトを定義し、サーバーからHeroを全件取得することが同じファイルで読み込まれます。
*これはしないでください*。


<code-example path="styleguide/src/01-01/app/heroes/hero.component.avoid.ts" header="app/heroes/hero.component.ts">

</code-example>



コンポーネントやそれをサポートしているクラスを専用のファイルに分割することはよい方針です。


<code-tabs>

  <code-pane header="main.ts" path="styleguide/src/01-01/main.ts">

  </code-pane>

  <code-pane header="app/app.module.ts" path="styleguide/src/01-01/app/app.module.ts">

  </code-pane>

  <code-pane header="app/app.component.ts" path="styleguide/src/01-01/app/app.component.ts">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/01-01/app/heroes/heroes.component.ts">

  </code-pane>

  <code-pane header="app/heroes/shared/hero.service.ts" path="styleguide/src/01-01/app/heroes/shared/hero.service.ts">

  </code-pane>

  <code-pane header="app/heroes/shared/hero.model.ts" path="styleguide/src/01-01/app/heroes/shared/hero.model.ts">

  </code-pane>

  <code-pane header="app/heroes/shared/mock-heroes.ts" path="styleguide/src/01-01/app/heroes/shared/mock-heroes.ts">

  </code-pane>

</code-tabs>



アプリが成長するにつれて、このルールはさらに重要になります。
<a href="#toc">トップに戻る</a>


{@a 01-02}

### 小さな関数

#### Style 01-02


<div class="s-rule do">



**Do** 小さい関数を定義してください。


</div>



<div class="s-rule consider">



**Consider** 最大行数を75行に制限する。


</div>



<div class="s-why">



**Why?** 小さい関数はテストを容易にします。その関数が1つのことを行い、1つの目的を果たす場合は特にです。


</div>



<div class="s-why">



**Why?** 小さい関数は再利用を促進します。


</div>



<div class="s-why">



**Why?** 小さい関数は読み易くなります。


</div>



<div class="s-why">



**Why?** 小さい関数はメンテナンスが容易です。


</div>



<div class="s-why-last">



**Why?** 小さい関数は、外部スコープと変数を共有し、不要なクロージャを作成したり、依存関係との望ましくない結合を引き起こす大きな関数に伴う隠れたバグを回避します。


</div>

<a href="#toc">トップに戻る</a>


{@a naming}
## 命名規則

命名規則は、保守性と可読性にとって非常に重要です。このガイドでは、ファイル名とシンボル名の命名規則を推奨しています。



{@a 02-01}

### 基本的な命名ガイドライン

#### Style 02-01


<div class="s-rule do">



**Do** すべてのシンボルに一貫した名前を使用してください。


</div>



<div class="s-rule do">



**Do** シンボルの特徴を記述し、そのタイプを記述するパターンにしたがってください。推奨されるパターンは `feature.type.ts` です。


</div>



<div class="s-why">



**Why?** 命名規則はコンテンツを一目で見つける一貫した方法を提供します。プロジェクト内の一貫性は非常に重要です。チームとの一貫性は重要です。企業全体の一貫性は非常に効率的です。


</div>



<div class="s-why">



**Why?** 命名規則は、目的のコードをより早く見つけ出し、理解しやすくさせるのに役たちます。


</div>



<div class="s-why-last">



**Why?** フォルダとファイルの名前は、その意図を明確に伝える必要があります。たとえば、 `app/heroes/hero-list.component.ts` にはヒーローのリストを管理するコンポーネントが含まれています。


</div>

<a href="#toc">トップに戻る</a>


{@a 02-02}

### ドットとダッシュによるファイル名分割

#### Style 02-02


<div class="s-rule do">



**Do** 説明的な名前の単語を区切るにはダッシュを使用してください。


</div>



<div class="s-rule do">



**Do** ドットを使用して、説明的な名前とタイプを区切ってください。


</div>



<div class="s-rule do">



**Do** コンポーネントの機能、そのタイプを記述するパターンに続くすべてのコンポーネントに対して、一貫した型名を使用してください。推奨されるパターンは `feature.type.ts` です。


</div>



<div class="s-rule do">



**Do** `.service`、` .component`、 `.pipe`、` .module`、 `.directive` を含む慣習的な型名を使ってください。
必要であれば他の型名を作成できますが、作りすぎないように注意してください。


</div>



<div class="s-why">



**Why?** 型名は、ファイル内の内容をすばやく識別する一貫した方法を提供してください。


</div>



<div class="s-why">



**Why?** 型名は、エディタやIDEのあいまい検索技術を使用して、特定のファイルタイプを簡単に見つけることができます。


</div>



<div class="s-why">



**Why?** `.service` のような省略されていない型名は説明的であり、明白です。
`.srv`、` .svc`、 `.serv` などの略語は混乱することがあります。


</div>



<div class="s-why-last">



**Why?** 型名は、自動化されたタスクでパターンマッチングする際に使われるためです。


</div>

<a href="#toc">トップに戻る</a>


{@a 02-03}

### シンボルとファイルの名前

#### Style 02-03


<div class="s-rule do">



**Do** すべてのファイル群はそれらを表す名前の後に一貫性のある名前を使用してください。


</div>



<div class="s-rule do">



**Do** クラス名はUpperCamelCaseを使用してください。


</div>



<div class="s-rule do">



**Do** シンボル名とファイル名は一致させてください。


</div>



<div class="s-rule do">



**Do** 慣例的な接尾辞付きのシンボル名（たとえば、 `Component`、
`Directive`、` Module`、 `Pipe`、` Service`など）を指定してください。


</div>



<div class="s-rule do">



**Do** ファイル名に慣例的な接尾辞（たとえば、 `.component.ts`、` .directive.ts`、
`.module.ts`、` .pipe.ts`、または `.service.ts`）を指定してください。

</div>



<div class="s-why">



**Why?** 一貫した規則により、異なるタイプのファイル群から迅速に識別して
参照することが容易になります。


</div>



<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      シンボル名
    </th>

    <th>
      ファイル名
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class AppComponent { }
      </code-example>

    </td>

    <td>


      app.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class HeroesComponent { }
      </code-example>

    </td>

    <td>


      heroes.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class HeroListComponent { }
      </code-example>

    </td>

    <td>


      hero-list.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class HeroDetailComponent { }
      </code-example>

    </td>

    <td>


      hero-detail.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Directive({ ... })
        export class ValidationDirective { }
      </code-example>

    </td>

    <td>


      validation.directive.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class AppModule
      </code-example>

    </td>

    <td>


      app.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Pipe({ name: 'initCaps' })
        export class InitCapsPipe implements PipeTransform { }
      </code-example>

    </td>

    <td>


      init-caps.pipe.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class UserProfileService { }
      </code-example>

    </td>

    <td>


      user-profile.service.ts
    </td>

  </tr>

</table>



<a href="#toc">トップに戻る</a>


{@a 02-04}

### サービスの名前

#### Style 02-04

<div class="s-rule do">



**Do** すべてのサービスは機能名の後に一貫した名前を付けてください。


</div>



<div class="s-rule do">



**Do** サービスクラスは接尾辞に`Service`を付けてください。
たとえば、データやヒーローを取得するものは
`DataService`または`HeroService`と呼ばれるべきです。

短い用語は明白にサービスです。それらは基本的に
「-er」で終わらせることで代理的に示されます。
メッセージをログするサービスは`LoggerService`よりも`Logger`の方がよいでしょう。
この例外がプロジェクトで合意できるかどうかを決定します。
いつものように、一貫性のために努力してください。


</div>



<div class="s-why">



**Why?** サービスを迅速に識別して参照する一貫した方法を提供します。


</div>



<div class="s-why">



**Why?** `Logger`のような明確なサービス名は接尾辞を必要としません。


</div>



<div class="s-why-last">



**Why?** `Credit` などのサービス名は名詞であり、接尾辞を必要とするため、サービスであれ他のものであれ、明示的でない場合は接尾辞を付ける必要があります。


</div>



<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      シンボル名
    </th>

    <th>
      ファイル名
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class HeroDataService { }
      </code-example>

    </td>

    <td>


      hero-data.service.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class CreditService { }
      </code-example>

    </td>

    <td>


      credit.service.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class Logger { }
      </code-example>

    </td>

    <td>


      logger.service.ts
    </td>

  </tr>

</table>

<a href="#toc">トップに戻る</a>

{@a 02-05}

### ブートストラッピング

#### Style 02-05


<div class="s-rule do">

**Do** アプリのブートストラップとプラットフォームのロジックを`main.ts`というファイルに配置します。

</div>

<div class="s-rule do">

**Do** ブートストラップロジックにエラー処理を含めます。

</div>

<div class="s-rule avoid">

**Avoid** アプリのロジックを`main.ts`に入れることは避けましょう。代わりに、コンポーネントまたはサービスに配置することを検討してください。

</div>

<div class="s-why">

**Why?** アプリの起動ロジックに関する一貫した規約に従います。

</div>

<div class="s-why-last">

**Why?** 他のテクノロジープラットフォームからの慣例的な規約に従います。

</div>


<code-example path="styleguide/src/02-05/main.ts" header="main.ts">

</code-example>

<a href="#toc">トップに戻る</a>

{@a 05-02}

### コンポーネントセレクター

#### Style 05-02

<div class="s-rule do">

**Do** コンポーネントの要素セレクターに名前をつけるには、_dashed-case_または_kebab-case_を使います。

</div>

<div class="s-why-last">

**Why?** [Custom Elements](https://www.w3.org/TR/custom-elements/)の仕様と要素名を一致させます。

</div>

<code-example path="styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>

<code-tabs>

  <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" region="example">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-02/app/app.component.html">

  </code-pane>

</code-tabs>

<a href="#toc">トップに戻る</a>

{@a 02-07}

### コンポーネントのカスタム接頭辞

#### Style 02-07


<div class="s-rule do">

**Do** ハイフンで区切られた小文字の要素セレクター値を使用します（たとえば`admin-users`）。

</div>

<div class="s-rule do">

**Do** コンポーネントセレクターにカスタム接頭辞を使用します。
たとえば、`toh`という接頭辞は**T**our **o**f **H**eroesを表していて、`admin`という接頭辞は管理者用の機能領域を表します。

</div>

<div class="s-rule do">

**Do** 機能領域またはアプリ自体を識別する接頭辞を使用します。

</div>

<div class="s-why">

**Why?** 要素名が他のアプリケーションのコンポーネントおよびネイティブのHTML要素と競合しないようにします。

</div>

<div class="s-why">

**Why?** コンポーネントを宣伝したり他のアプリと共有したりするのが簡単になります。

</div>

<div class="s-why-last">

**Why?** DOMの中でコンポーネントを簡単に識別できます。

</div>

<code-example path="styleguide/src/02-07/app/heroes/hero.component.avoid.ts" region="example" header="app/heroes/hero.component.ts">

</code-example>

<code-example path="styleguide/src/02-07/app/users/users.component.avoid.ts" region="example" header="app/users/users.component.ts">

</code-example>

<code-example path="styleguide/src/02-07/app/heroes/hero.component.ts" region="example" header="app/heroes/hero.component.ts">

</code-example>

<code-example path="styleguide/src/02-07/app/users/users.component.ts" region="example" header="app/users/users.component.ts">

</code-example>

<a href="#toc">トップに戻る</a>

{@a 02-06}

### ディレクティブのセレクター

#### Style 02-06

<div class="s-rule do">

**Do** ディレクティブのセレクター名にはlowerCamelCaseを使用してください。

</div>

<div class="s-why">

**Why?** ビューにバインドされているディレクティブに定義されたプロパティ名を、ビューの属性名と一致させるためです。

</div>

<div class="s-why-last">

**Why?** AngularのHTMLパーサーは大文字・小文字を区別し、また、lowerCamelCaseを認識します。

</div>


<a href="#toc">トップに戻る</a>

{@a 02-08}

### ディレクティブのカスタム接頭辞

#### Style 02-08

<div class="s-rule do">



**Do** ディレクティブのセレクターにはカスタムプレフィクスを付与してください（例： `toh` というプレフィクスは **T**our **o**f **H**eroes に由来します）。


</div>



<div class="s-rule do">



**Do** ネイティブのHTML属性にマッチさせることを意図しない限り、非要素のセレクターはlowerCamelCaseで命名してください。


</div>



<div class="s-why">



**Why?** 名前の衝突を防ぐためです。


</div>



<div class="s-why-last">



**Why?** ディレクティブを容易に識別できます。


</div>



<code-example path="styleguide/src/02-08/app/shared/validate.directive.avoid.ts" region="example" header="app/shared/validate.directive.ts">

</code-example>





<code-example path="styleguide/src/02-08/app/shared/validate.directive.ts" region="example" header="app/shared/validate.directive.ts">

</code-example>



<a href="#toc">トップに戻る</a>


{@a 02-09}

### パイプ名

#### Style 02-09

<div class="s-rule do">



**Do** 機能にちなんで名付けられた、すべてのパイプで一貫性のある名前を使ってください。
The pipe class name should use [UpperCamelCase](guide/glossary#case-types)
(the general convention for class names),
and the corresponding `name` string should use *lowerCamelCase*.
The `name` string cannot use hyphens ("dash-case" or "kebab-case").


</div>



<div class="s-why-last">



**Why?** 一貫した規則により、パイプをすばやく識別して参照することが容易になります。


</div>



<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      シンボル名
    </th>

    <th>
      ファイル名
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Pipe({ name: 'ellipsis' })
        export class EllipsisPipe implements PipeTransform { }
      </code-example>

    </td>

    <td>


      ellipsis.pipe.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Pipe({ name: 'initCaps' })
        export class InitCapsPipe implements PipeTransform { }
      </code-example>

    </td>

    <td>


      init-caps.pipe.ts
    </td>

  </tr>

</table>



<a href="#toc">トップに戻る</a>


{@a 02-10}

### ユニットテストのファイル名

#### Style 02-10

<div class="s-rule do">



**Do** テスト仕様ファイルには、テストするコンポーネントと同じ名前をつけます。


</div>



<div class="s-rule do">



**Do** テスト仕様ファイルには、`.spec` という接尾辞をつけます。


</div>



<div class="s-why">



**Why?** 一貫した規則によりテストをすばやく認識することが容易になります。

</div>



<div class="s-why-last">



**Why?** [karma](http://karma-runner.github.io/) や他のテストランナーでパターンマッチできるようになります。


</div>





<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      テストタイプ
    </th>

    <th>
      ファイル名
    </th>

  </tr>

  <tr style=top>

    <td>


      コンポーネント
    </td>

    <td>


      heroes.component.spec.ts

      hero-list.component.spec.ts

      hero-detail.component.spec.ts
    </td>

  </tr>

  <tr style=top>

    <td>


      サービス
    </td>

    <td>


      logger.service.spec.ts

      hero.service.spec.ts

      filter-text.service.spec.ts
    </td>

  </tr>

  <tr style=top>

    <td>


      パイプ
    </td>

    <td>


      ellipsis.pipe.spec.ts

      init-caps.pipe.spec.ts
    </td>

  </tr>

</table>



<a href="#toc">トップに戻る</a>


{@a 02-11}

### _End-to-End_ (E2E) テストのファイル名

#### Style 02-11

<div class="s-rule do">



**Do** E2Eのテスト仕様ファイルは、機能の後に`.e2e-spec`という接尾辞を付けます。


</div>



<div class="s-why">



**Why?** E2Eのテストを迅速に識別するための一貫した方法を提供します。


</div>



<div class="s-why-last">



**Why?** テストランナーとビルドオートメーションのためのパターンマッチングを提供します。


</div>







<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      Test Type
    </th>

    <th>
      File Names
    </th>

  </tr>

  <tr style=top>

    <td>


      End-to-End Tests
    </td>

    <td>


      app.e2e-spec.ts

      heroes.e2e-spec.ts
    </td>

  </tr>

</table>



<a href="#toc">トップに戻る</a>

{@a 02-12}

### Angularの_NgModule_の名前

#### Style 02-12


<div class="s-rule do">



**Do** シンボル名に`Module`接尾辞を追加します。


</div>



<div class="s-rule do">



**Do** ファイル名に`.module.ts`拡張子を付けます。


</div>



<div class="s-rule do">



**Do** 中に存在する機能とフォルダに基づいてモジュールに名前を付けます。


</div>



<div class="s-why">



**Why?** モジュールを迅速に識別して参照するための一貫した方法を提供します。


</div>



<div class="s-why">



**Why?** UpperCamelCaseは、コンストラクターを使用してインスタンス化できるオブジェクトを識別するため慣例的なものです。


</div>



<div class="s-why-last">



**Why?** 同じ名前の機能のルートとしてモジュールを簡単に識別します。


</div>



<div class="s-rule do">



**Do** _RoutingModule_クラス名に`RoutingModule`接尾辞を付けます。


</div>



<div class="s-rule do">



**Do** _RoutingModule_のファイル名の最後を`-routing.module.ts`にします。


</div>



<div class="s-why-last">



**Why?** `RoutingModule`はAngularルーターの設定専用のモジュールです。
一貫したクラスとファイル名の規則により、これらのモジュールを簡単に見つけて検証できます。

</div>



<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      Symbol Name
    </th>

    <th>
      File Name
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class AppModule { }
      </code-example>

    </td>

    <td>


      app.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class HeroesModule { }
      </code-example>

    </td>

    <td>


      heroes.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class VillainsModule { }
      </code-example>

    </td>

    <td>


      villains.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class AppRoutingModule { }
      </code-example>

    </td>

    <td>


      app-routing.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class HeroesRoutingModule { }
      </code-example>

    </td>

    <td>


      heroes-routing.module.ts
    </td>

  </tr>

</table>


## アプリケーション構造とNgModule

短期的な実装の視点と長期的なビジョンを持ってください。小さく始めますが、アプリがどこへ向かっているのかを意識しておきましょう。

アプリのコードはすべて`src`という名前のフォルダーに入っています。
すべての機能領域は、独自のNgModuleとともに、独自のフォルダにあります。

すべてのコンテンツはファイルごとの1つのアセットです。各コンポーネント、サービス、およびパイプはそれぞれ独自のファイルにあります。
すべてのサードパーティベンダーのスクリプトは、`src`フォルダではなく別のフォルダに格納されています。
あなたはそれらを書いていませんし、`src`を散らかしてほしくもありません。
このガイドにあるファイルの命名規則を使用してください。
<a href="#toc">トップに戻る</a>

{@a 04-01}

### _LIFT_

#### Style 04-01


<div class="s-rule do">



**Do** すぐにコードを見つけられるように（**L**ocate）、
一目でコードを識別できるように（**I**dentify）、
できる限りフラットな（**F**lattest）構造を維持し、
そしてDRYを目指して（**T**ry）アプリを構築してください。


</div>



<div class="s-rule do">



**Do** 重要な順にリストされているこれら4つの基本的なガイドラインに従うように構造を定義して下さい。


</div>



<div class="s-why-last">



**Why?** LIFTは、拡張性に優れ、モジュール化され、コードがすばやく見つかることで開発者の効率が上がりやすい、一貫した構造を提供します。
特定の構造についてあなたの直感を確認するために質問してみましょう：
_すぐにこの機能のためのすべての関連ファイルを開いて仕事を始められますか？_


</div>

<a href="#toc">トップに戻る</a>

{@a 04-02}

### 見つけやすさ（Locate）

#### Style 04-02


<div class="s-rule do">



**Do** コードを直感的に、シンプルに、そして素早く見つけられるようにします。


</div>



<div class="s-why-last">



**Why?** 効率的に作業するには、特にファイル名がわからない（または覚えていない）場合に、
ファイルを素早く見つけることができなければなりません。
関連ファイルを直感的な場所で近くに置いておくと時間を節約できます。
説明的なフォルダ構造は、あなたとあなたの後に来る人の間で、違う世界を作ってしまいます。


</div>

<a href="#toc">トップに戻る</a>

{@a 04-03}

### 識別しやすさ（Identify）

#### Style 04-03


<div class="s-rule do">



**Do** ファイルに何が含まれていて何を表しているのかすぐに分かるような名前を付けます。


</div>



<div class="s-rule do">



**Do** ファイル名を説明にして、ファイルの内容を確実に1つのコンポーネントにします。


</div>



<div class="s-rule avoid">



**Avoid** 複数のコンポーネント、複数のサービス、またはそれらが混在するファイルを避けます。


</div>



<div class="s-why-last">



**Why?** コードを探す時間を短縮し、効率的になります。
より長いファイル名は、_短くて曖昧な_短縮名よりはるかに優れています。


</div>



<div class="alert is-helpful">



複数のファイルよりも1つのファイルとして検出され理解されやすい、
小さくて密接に関連する一連の機能がある場合は、
_1ファイルに1つ_のルールから逸脱することが有利な場合があります。この抜け穴に注意してください。


</div>

<a href="#toc">トップに戻る</a>


{@a 04-04}

### フラット（Flat）

#### Style 04-04

<div class="s-rule do">



**Do** フラットなフォルダー構造をできるだけ維持します。


</div>



<div class="s-rule consider">



**Consider** フォルダのファイルが7つ以上に達したときにサブフォルダを作成します。


</div>



<div class="s-rule consider">



**Consider** 生成された`.js`ファイルや`.js.map`ファイルなど、邪魔になる無関係なファイルを隠すようにIDEを設定します。


</div>



<div class="s-why-last">



**Why?** 7つもの階層のフォルダーを通してファイルを検索したいという人はいません。
フラットな構造はスキャンが簡単です。

一方で、<a href="https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two">心理学者の考え</a>では、
隣接する関心ことの数が9を超えると人間はもがき始めるといいます。
そのため、フォルダに10個以上のファイルがある場合は、
サブフォルダを作成する必要があるでしょう。

あなたの快適さのレベルに基づいて決定を下しましょう。
新しいフォルダを作成することに明らかな価値が生まれるまでは、フラットな構造を使用してください。


</div>

<a href="#toc">トップに戻る</a>


{@a 04-05}

### _T-DRY_ (_DRY_を目指す)

#### Style 04-05

<div class="s-rule do">



**Do** DRY（Don't Repeat Yourself）にします。


</div>



<div class="s-rule avoid">



**Avoid** 読みやすさを犠牲にしてDRYにすることは避けましょう。


</div>



<div class="s-why-last">



**Why?** DRYであることは重要ですが、LIFTの他の要素を犠牲にするのであれば重要ではありません。
それが _T-DRY_ と呼ばれる理由です。
たとえば、テンプレートに `hero-view.component.html` という名前を付けることは、
拡張子が `.html` の場合は明らかにビューであるため冗長です。
しかし、何かがはっきりしていない、あるいは慣習から逸脱している場合は、それを詳しく書きましょう。


</div>

<a href="#toc">トップに戻る</a>


{@a 04-06}

### 全体構造のガイドライン

#### Style 04-06

<div class="s-rule do">



**Do** 小さく始めますが、アプリがどこに向かっているのかは意識しておきます。


</div>



<div class="s-rule do">



**Do** 短期的な実装の視点と長期的なビジョンを持ちます。


</div>



<div class="s-rule do">



**Do** アプリのすべてのコードを `src` という名前のフォルダーに入れます。


</div>



<div class="s-rule consider">



**Consider** 複数の関連するファイル（`.ts`、`.html`、`.css`、および`.spec`）がある場合は、コンポーネント用のフォルダーを作成します。


</div>



<div class="s-why">



**Why?** アプリの構造を小さくし、初期段階で保守しやすくする一方で、アプリが大きくなっても進化しやすくなります。


</div>



<div class="s-why-last">



**Why?** 多くの場合、コンポーネントには4つのファイル（例：`*.html`、`*.css`、`*.ts`、および`*.spec.ts`）があり、フォルダをすばやく整理することができます。


</div>



{@a file-tree}


これは、ガイドを守ったフォルダとファイル構造です。


<div class='filetree'>

  <div class='file'>
    &lt;project root&gt;
  </div>

  <div class='children'>

    <div class='file'>
      src
    </div>

    <div class='children'>

      <div class='file'>
        app
      </div>

      <div class='children'>

        <div class='file'>
          core
        </div>

        <div class='children'>

          <div class='file'>
            exception.service.ts|spec.ts
          </div>

          <div class='file'>
            user-profile.service.ts|spec.ts
          </div>

        </div>

        <div class='file'>
          heroes
        </div>

        <div class='children'>

          <div class='file'>
            hero
          </div>

          <div class='children'>

            <div class='file'>
              hero.component.ts|html|css|spec.ts
            </div>

          </div>

          <div class='file'>
            hero-list
          </div>

          <div class='children'>

            <div class='file'>
              hero-list.component.ts|html|css|spec.ts
            </div>

          </div>

          <div class='file'>
            shared
          </div>

          <div class='children'>

            <div class='file'>
              hero-button.component.ts|html|css|spec.ts
            </div>

            <div class='file'>
              hero.model.ts
            </div>

            <div class='file'>
              hero.service.ts|spec.ts
            </div>

          </div>

          <div class='file'>
            heroes.component.ts|html|css|spec.ts
          </div>

          <div class='file'>
            heroes.module.ts
          </div>

          <div class='file'>
            heroes-routing.module.ts
          </div>

        </div>

        <div class='file'>
          shared
        </div>

        <div class='children'>

          <div class='file'>
            shared.module.ts
          </div>

          <div class='file'>
            init-caps.pipe.ts|spec.ts
          </div>

          <div class='file'>
            filter-text.component.ts|spec.ts
          </div>

          <div class='file'>
            filter-text.service.ts|spec.ts
          </div>

        </div>

        <div class='file'>
          villains
        </div>

        <div class='children'>

          <div class='file'>
            villain
          </div>

          <div class='children'>

            <div class='file'>
              ...
            </div>

          </div>

          <div class='file'>
            villain-list
          </div>

          <div class='children'>

            <div class='file'>
              ...
            </div>

          </div>

          <div class='file'>
            shared
          </div>

          <div class='children'>

            <div class='file'>
              ...
            </div>

          </div>

          <div class='file'>
            villains.component.ts|html|css|spec.ts
          </div>

          <div class='file'>
            villains.module.ts
          </div>

          <div class='file'>
            villains-routing.module.ts
          </div>

        </div>

        <div class='file'>
          app.component.ts|html|css|spec.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

        <div class='file'>
          app-routing.module.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        ...
      </div>

    </div>

    <div class='file'>
      node_modules/...
    </div>

    <div class='file'>
      ...
    </div>

  </div>

</div>





<div class="alert is-helpful">



コンポーネントを専用のフォルダ内に配置することが広く好まれていますが、
小さなアプリのための別の選択肢はコンポーネントをフラットに保つことです（専用のフォルダ内ではありません）。
これにより、既存のフォルダに最大4つのファイルが追加されますが、フォルダのネストも減少します。
どの方法を選んだとしても、一貫性を保ってください。


</div>

<a href="#toc">トップに戻る</a>

{@a 04-07}

### _機能別フォルダー_ 構造

#### Style 04-07


<div class="s-rule do">

**Do** それが表す機能領域ごとに名付けられたフォルダを作成します。

</div>

<div class="s-why">

**Why?** 開発者は一目でコードを見つけ、各ファイルが何を表しているのか識別できます。
構造は可能な限りフラットで、繰り返しや重複する名前はありません。

</div>

<div class="s-why">

**Why?** LIFTのガイドラインはすべて網羅されています。

</div>

<div class="s-why">

**Why?** 中身を整理してLIFTのガイドラインに沿った状態に保つことで、
アプリが雑然とするのを防ぐのに役立ちます。

</div>

<div class="s-why">

**Why?** たとえば10個以上、ファイルが多数ある場合は、
一貫したフォルダ構造を使用するとそれらを見つけやすくなり、
フラット構造の場合は難しくなります。

</div>

<div class="s-rule do">

**Do** 各機能領域にNgModuleを作成します。

</div>

<div class="s-why">

**Why?** NgModuleはルーティング可能な機能を遅延ロードすることを容易にします。

</div>

<div class="s-why-last">

**Why?** NgModuleは機能の分離、テスト、そして再利用をより簡単にします。

</div>

<div>

  詳細は、<a href="#file-tree"> _フォルダーとファイル構造_ の例</a> を参照してください。

</div>

<a href="#toc">Back to top

</a>


{@a 04-08}

### アプリの _ルートモジュール_

#### Style 04-08

<div class="s-rule do">



**Do** アプリのルートフォルダ、
たとえば `/src/app` にNgModuleを作成します。


</div>



<div class="s-why">



**Why?** すべてのアプリには少なくとも1つのルートNgModuleが必要です。


</div>



<div class="s-rule consider">



**Consider** ルートモジュールの名前は `app.module.ts` にします。


</div>



<div class="s-why-last">



**Why?** ルートモジュールを見つけやすくし、識別しやすくします。


</div>



<code-example path="styleguide/src/04-08/app/app.module.ts" region="example" header="app/app.module.ts">

</code-example>



<a href="#toc">トップに戻る</a>


{@a 04-09}

### 機能モジュール

#### Style 04-09


<div class="s-rule do">



**Do** アプリケーション内のすべての異なる機能に対してNgModuleを作成します。
たとえば、`Heroes`の機能です。


</div>



<div class="s-rule do">



**Do** 機能領域と同じ名前のフォルダに機能モジュールを配置します。
たとえば、`app/heroes` です。


</div>



<div class="s-rule do">



**Do** 機能モジュールファイルに機能領域およびフォルダの名前を反映した名前を付けます。
たとえば、`app/heroes/heroes.module.ts`です。


</div>



<div class="s-rule do">



**Do** 機能モジュールシンボルに機能領域、フォルダ、およびファイルの名前を反映した名前を付けます。
たとえば、`app/heroes/heroes.module.ts` は `HeroesModule` を定義します。


</div>



<div class="s-why">



**Why?** 機能モジュールは、その実装を他のモジュールに公開または隠すことができます。


</div>



<div class="s-why">



**Why?** 機能モジュールは、機能領域に関連するコンポーネントのセットを識別します。


</div>



<div class="s-why">



**Why?** 機能モジュールは、即座でも遅延でも簡単にルーティングできます。


</div>



<div class="s-why">



**Why?** 機能モジュールは、特定の機能と他のアプリケーション機能との間の明確な境界を定義します。


</div>



<div class="s-why">



**Why?** 機能モジュールを使用すると、開発の責任を明確にし、異なるチームに簡単に割り当てることができます。


</div>



<div class="s-why-last">



**Why?** 機能モジュールはテスト用に簡単に分離できます。


</div>

<a href="#toc">トップに戻る</a>

{@a 04-10}

### 共有機能モジュール

#### Style 04-10


<div class="s-rule do">



**Do** `shared` フォルダに `SharedModule` という名前の機能モジュールを作成します。
たとえば、`app/shared/shared.module.ts`は`SharedModule`を定義します。


</div>



<div class="s-rule do">



**Do** コンポーネント、ディレクティブ、およびパイプが再利用され、他の機能モジュールで宣言されたコンポーネントによって参照される場合は、
共有モジュールの中で宣言します。


</div>



<div class="s-rule consider">



**Consider** 共有モジュールの内容がアプリケーション全体で参照されている場合は、
`SharedModule`という名前を使用します。


</div>



<div class="s-rule avoid">



**Consider** 共有モジュールではサービスを提供_しません_。
サービスは通常、アプリケーション全体に対して、または特定の機能モジュールに対して1回提供されるシングルトンです。
ただし、例外があります。たとえば、次のサンプルコードでは、`SharedModule`が`FilterTextService`を提供しています。これは、サービスがステートレスであるため、つまりサービスの利用者が新しいインスタンスの影響を受けないため、ここでは受け入れられます。


</div>



<div class="s-rule do">



**Do** `SharedModule`のアセットに必要なすべてのモジュールをインポートします。
たとえば、`CommonModule`や`FormsModule`などです。


</div>



<div class="s-why">



**Why?** `SharedModule`は他の共通モジュールの機能を必要とする
コンポーネント、ディレクティブとパイプを含むことがあります。
たとえば、`CommonModule`の`ngFor`です。


</div>



<div class="s-rule do">



**Do** `SharedModule`内ですべてのコンポーネント、ディレクティブ、およびパイプを宣言します。


</div>



<div class="s-rule do">



**Do** 他の機能モジュールが使用する必要があるすべてのシンボルを`SharedModule`からエクスポートします。


</div>



<div class="s-why">



**Why?** `SharedModule`は、よく使われるコンポーネント、ディレクティブ、およびパイプを他の多くのモジュールのコンポーネントのテンプレートで使用できるようにするために存在します。


</div>



<div class="s-rule avoid">



**Avoid** `SharedModule`でアプリ全体のシングルトンプロバイダーを指定することは避けましょう。意図的なものは問題ありません。注意しましょう。


</div>



<div class="s-why">



**Why?** その共有モジュールをインポートする遅延ロードされた機能モジュールは、サービスのコピーを作成し、望ましくない結果をもたらす可能性があります。


</div>



<div class="s-why-last">



**Why?** 各モジュールに独自のシングルトンサービスの個別のインスタンスを持たせたくはありません。
`SharedModule`がサービスを提供していると、実際にそのような危険が発生します。


</div>



<div class='filetree'>

  <div class='file'>
    src
  </div>

  <div class='children'>

    <div class='file'>
      app
    </div>

    <div class='children'>

      <div class='file'>
        shared
      </div>

      <div class='children'>

        <div class='file'>
          shared.module.ts
        </div>

        <div class='file'>
          init-caps.pipe.ts|spec.ts
        </div>

        <div class='file'>
          filter-text.component.ts|spec.ts
        </div>

        <div class='file'>
          filter-text.service.ts|spec.ts
        </div>

      </div>

      <div class='file'>
        app.component.ts|html|css|spec.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

      <div class='file'>
        app-routing.module.ts
      </div>

    </div>

    <div class='file'>
      main.ts
    </div>

    <div class='file'>
      index.html
    </div>

  </div>

  <div class='file'>
    ...
  </div>

</div>





<code-tabs>

  <code-pane header="app/shared/shared.module.ts" path="styleguide/src/04-10/app/shared/shared.module.ts">

  </code-pane>

  <code-pane header="app/shared/init-caps.pipe.ts" path="styleguide/src/04-10/app/shared/init-caps.pipe.ts">

  </code-pane>

  <code-pane header="app/shared/filter-text/filter-text.component.ts" path="styleguide/src/04-10/app/shared/filter-text/filter-text.component.ts">

  </code-pane>

  <code-pane header="app/shared/filter-text/filter-text.service.ts" path="styleguide/src/04-10/app/shared/filter-text/filter-text.service.ts">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/04-10/app/heroes/heroes.component.ts">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.html" path="styleguide/src/04-10/app/heroes/heroes.component.html">

  </code-pane>

</code-tabs>




<a href="#toc">トップに戻る</a>

{@a 04-11}

### 遅延ロードフォルダ

#### Style 04-11

個別のアプリケーション機能やワークフローを、アプリケーションの起動時ではなく、*遅延ロード*したり、*オンデマンドでロード*したりできます。


<div class="s-rule do">

**Do** 遅延ロードされる機能の内容を*遅延ロードフォルダ*に入れます。
典型的な*遅延ロードフォルダ*は、*ルーティングコンポーネント*とその子コンポーネント、およびそれらに関連するものとモジュールを含みます。

</div>

<div class="s-why-last">

**Why?** フォルダを使用すると、機能の内容を簡単に識別して特定できます。

</div>

<a href="#toc">トップに戻る</a>

{@a 04-12}

### 遅延ロードフォルダを直接インポートしてはいけません

#### Style 04-12


<div class="s-rule avoid">

**Avoid** 兄弟および親フォルダ内のモジュールが*遅延ロード機能*内のモジュールを直接インポートすることを避けましょう。

</div>

<div class="s-why-last">

**Why?** モジュールを直接インポートして使用すると、そのモジュールがオンデマンドでロードされることが意図されていても即座にロードされます。

</div>

<a href="#toc">トップに戻る</a>

## コンポーネント

{@a 05-03}

### 要素としてのコンポーネント

#### Style 05-03

<div class="s-rule do">

**Consider** _属性_または_クラス_セレクターではなく、コンポーネントに_要素_セレクターを与えます。

</div>

<div class="s-why">



**Why?** コンポーネントには、HTMLとオプショナルのAngularテンプレート構文を含んだテンプレートがあります。
これはコンテンツを表示します。
開発者は、ネイティブのHTML要素やWebコンポーネントと同じように、コンポーネントをページに配置します。


</div>



<div class="s-why-last">



**Why?** テンプレートのHTMLを見て、シンボルがコンポーネントであることを認識しやすくなります


</div>

<div class="alert is-helpful">

ビルトイン要素を拡張したい場合など、コンポーネントに属性を指定するケースがいくつかあります。たとえば、[Material Design](https://material.angular.io/components/button/overview)は `<button mat-button>` でこの手法を使用しています。ただし、この方法はカスタム要素には使用しません。

</div>

<code-example path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/05-03/app/app.component.avoid.html" header="app/app.component.html">

</code-example>



<code-tabs>

  <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" region="example">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-03/app/app.component.html">

  </code-pane>

</code-tabs>



<a href="#toc">トップに戻る</a>

{@a 05-04}

### テンプレートとスタイルをファイルから分離しましょう

#### Style 05-04


<div class="s-rule do">



**Do** 3行を超える場合は、テンプレートとスタイルを別々のファイルに取り出します。


</div>



<div class="s-rule do">



**Do** テンプレートファイルの名前を`[component-name].component.html`にします。ここで、[component-name]はコンポーネント名です。


</div>



<div class="s-rule do">



**Do** スタイルファイルの名前を`[component-name].component.css`にします。ここで、[component-name]はコンポーネント名です。


</div>



<div class="s-rule do">



**Do** 接頭辞 `./` を付けて、_コンポーネント相対_ URLを指定します。


</div>



<div class="s-why">



**Why?** 大きなインラインテンプレートとスタイルは、コンポーネントの目的と実装を不明瞭にし、読みやすさと保守性を低下させます。


</div>



<div class="s-why">



**Why?** ほとんどのエディタでは、インラインテンプレートとインラインスタイルを開発するときに構文のヒントやコードスニペットは使用できません。
AngularのTypeScript Language Serviceは、HTMLテンプレートをサポートしているエディターで
このHTMLテンプレートの欠点を克服します。 ただしCSSスタイルには役立ちません。


</div>



<div class="s-why">



**Why?** _コンポーネント相対_ URLは、ファイルがまとめられている限り、コンポーネントファイルを移動しても変更する必要はありません。


</div>



<div class="s-why-last">



**Why?** `./`接頭辞は相対URLの標準的な構文です。その接頭辞なしでのAngularの機能に依存しないでください。



</div>



<code-example path="styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" region="example" header="app/heroes/heroes.component.ts">

</code-example>





<code-tabs>

  <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/05-04/app/heroes/heroes.component.ts" region="example">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.html" path="styleguide/src/05-04/app/heroes/heroes.component.html">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.css" path="styleguide/src/05-04/app/heroes/heroes.component.css">

  </code-pane>

</code-tabs>



<a href="#toc">トップに戻る</a>

{@a 05-12}

### _インプット_と_アウトプット_のプロパティを修飾しましょう {@a decorate-input-and-output-properties}

#### Style 05-12


<div class="s-rule do">



**Do** `@Directive`および`@Component`メタデータの `inputs` および `outputs` プロパティではなく、
`@Input()` および `@Output()` プロパティデコレーターを使用します。


</div>



<div class="s-rule consider">



**Consider** 修飾するプロパティと同じ行に `@Input()` または `@Output()` を配置します。


</div>



<div class="s-why">



**Why?** クラス内のどのプロパティがインプットまたはアウトプットであるかを識別するのが簡単で読みやすくなります。


</div>



<div class="s-why">



**Why?** `@Input()`または`@Output()`に関連付けられているプロパティまたはイベント名を変更する必要がある場合は、
それを一か所で変更できます。


</div>



<div class="s-why">



**Why?** ディレクティブに付与されているメタデータ宣言は短く、読みやすくなります。


</div>



<div class="s-why-last">



**Why?** デコレーターを同じ行に配置すると、_通常は_コードが短くなり、プロパティをインプットまたはアウトプットとして簡単に識別できます。
はっきりと読みやすくする場合は、デコレーターを上の行に置きます。


</div>



<code-example path="styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>



<a href="#toc">トップに戻る</a>


{@a 05-13}

### _インプット_ と _アウトプット_のエイリアスを避けましょう

#### Style 05-13


<div class="s-rule avoid">



**Avoid** 重要な目的がある場合を除いて、_インプット_および_アウトプット_に別名をつけることを避けます。


</div>



<div class="s-why">



**Why?** 同じプロパティに2つの名前（ひとつはプライベート、もうひとつはパブリック）を付けると、本質的に混乱します。


</div>



<div class="s-why-last">



**Why?** ディレクティブ名が _インプット_プロパティでもあり、ディレクティブ名がそのプロパティを表していない場合は、
エイリアスを使用する必要があります。


</div>



<code-example path="styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/05-13/app/app.component.avoid.html" header="app/app.component.html">

</code-example>





<code-tabs>

  <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" region="example">

  </code-pane>

  <code-pane header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-13/app/app.component.html">

  </code-pane>

</code-tabs>



<a href="#toc">トップに戻る</a>

{@a 05-14}

### メンバーの順序

#### Style 05-14


<div class="s-rule do">



**Do** プロパティを上に配置して次にメソッドを配置します。


</div>



<div class="s-rule do">



**Do** パブリックメンバーの後にプライベートメンバーを、アルファベット順に配置します。


</div>



<div class="s-why-last">



**Why?** メンバーを一貫した順序で配置すると、読みやすくなり、
コンポーネントのどのメンバーがどの目的に役立つかを即座に識別できます。


</div>



<code-example path="styleguide/src/05-14/app/shared/toast/toast.component.avoid.ts" region="example" header="app/shared/toast/toast.component.ts">

</code-example>





<code-example path="styleguide/src/05-14/app/shared/toast/toast.component.ts" region="example" header="app/shared/toast/toast.component.ts">

</code-example>



<a href="#toc">トップに戻る</a>

{@a 05-15}

### 複雑なコンポーネントロジックをサービスに委譲しましょう

#### Style 05-15


<div class="s-rule do">



**Do** コンポーネント内のロジックはビューに必要なロジックだけに制限します。他のすべてのロジックはサービスに委譲する必要があります。


</div>



<div class="s-rule do">



**Do** 再利用可能なロジックをサービスに移し、コンポーネントをシンプルに保ち、意図した目的に集中します。


</div>



<div class="s-why">



**Why?** ロジックをサービス内に配置し、関数を介して公開すれば、複数のコンポーネントによって再利用できます。


</div>



<div class="s-why">



**Why?** コンポーネント内でのロジックの呼び出しを簡単にモックしながら、単体テストでサービス内のロジックをより簡単に分離できます。


</div>



<div class="s-why">



**Why?** 依存関係を取り除き、コンポーネントから実装の詳細を隠します。


</div>



<div class="s-why-last">



**Why?** コンポーネントをスリムで、整然として、フォーカスされた状態に保ちます。


</div>



<code-example path="styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>





<code-example path="styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" region="example" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>



<a href="#toc">トップに戻る</a>

{@a 05-16}

### _アウトプット_ プロパティに接頭辞をつけてはいけません

#### Style 05-16


<div class="s-rule do">



**Do** イベントには `on` 接頭辞なしの名前を付けます。


</div>



<div class="s-rule do">



**Do** イベントハンドラーメソッドには `on` 接頭辞にイベント名を続けて名前を付けます。


</div>



<div class="s-why">



**Why?** これは、ボタンクリックなどの組み込みイベントと一致しています。


</div>



<div class="s-why-last">



**Why?** Angularでは、`on-*` という[代替構文](guide/template-syntax#binding-syntax)が使えます。イベント自体に`on`接頭辞が付いていると、`on-onEvent`バインディング式になってしまいます。


</div>



<code-example path="styleguide/src/05-16/app/heroes/hero.component.avoid.ts" region="example" header="app/heroes/hero.component.ts">

</code-example>





<code-example path="styleguide/src/05-16/app/app.component.avoid.html" header="app/app.component.html">

</code-example>





<code-tabs>

  <code-pane header="app/heroes/hero.component.ts" path="styleguide/src/05-16/app/heroes/hero.component.ts" region="example">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-16/app/app.component.html">

  </code-pane>

</code-tabs>



<a href="#toc">トップに戻る</a>

{@a 05-17}

### コンポーネントクラスにプレゼンテーションロジックを置きましょう

#### Style 05-17


<div class="s-rule do">



**Do** プレゼンテーションロジックはテンプレートの中ではなくコンポーネントクラスの中に配置します。


</div>



<div class="s-why">



**Why?** ロジックが二か所に広がらず、一か所（コンポーネントクラス）に含まれます。


</div>



<div class="s-why-last">



**Why?** コンポーネントのプレゼンテーションロジックをテンプレートではなくクラスに残すことで、テスタビリティ、メンテナンス性、および再利用性が向上します。


</div>



<code-example path="styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" region="example" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>





<code-example path="styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" region="example" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>



<a href="#toc">トップに戻る</a>


## ディレクティブ

{@a 06-01}

### 要素を拡張するためにディレクティブを使いましょう

#### Style 06-01


<div class="s-rule do">



**Do** テンプレートのないプレゼンテーションロジックがある場合は、属性ディレクティブを使用します。


</div>



<div class="s-why">



**Why?** 属性ディレクティブにはテンプレートが関連付けられていません。


</div>



<div class="s-why-last">



**Why?** 要素には複数の属性ディレクティブを適用できます。


</div>



<code-example path="styleguide/src/06-01/app/shared/highlight.directive.ts" region="example" header="app/shared/highlight.directive.ts">

</code-example>





<code-example path="styleguide/src/06-01/app/app.component.html" header="app/app.component.html">

</code-example>



<a href="#toc">トップに戻る</a>

{@a 06-03}

### _HostListener_/_HostBinding_ デコレーター と _host_ メタデータ

#### Style 06-03


<div class="s-rule consider">



**Consider** `@Directive` および `@Component` デコレーターの `host` プロパティよりも、
`@HostListener` および `@HostBinding`を推奨します。


</div>



<div class="s-rule do">



**Do** 一貫した選択をおこないます。


</div>



<div class="s-why-last">



**Why?** `@HostBinding`に関連付けられたプロパティ、または`@HostListener`に関連付けられたメソッドは、
ディレクティブのクラス内の1か所だけで変更できます。
`host`メタデータプロパティを使用する場合は、ディレクティブのクラス内のプロパティ/メソッド宣言と、
そのディレクティブに関連付けられているデコレーター内のメタデータの両方を変更する必要があります。


</div>



<code-example path="styleguide/src/06-03/app/shared/validator.directive.ts" header="app/shared/validator.directive.ts">

</code-example>



あまり推奨されない`host`メタデータでの置き換えと比較してください。


<div class="s-why-last">



**Why?** ただひとつの`host`メタデータだけを覚えておけば、追加のESインポートを必要としません。


</div>



<code-example path="styleguide/src/06-03/app/shared/validator2.directive.ts" header="app/shared/validator2.directive.ts">

</code-example>



<a href="#toc">トップに戻る</a>


## サービス

{@a 07-01}

### サービスはシングルトン

#### Style 07-01


<div class="s-rule do">



**Do** 同じインジェクター内でシングルトンとしてサービスを使用します。データや機能を共有するためにそれらを使用します。


</div>



<div class="s-why">



**Why?** サービスは、機能領域やアプリ間でメソッドを共有するのに理想的です。


</div>



<div class="s-why-last">



**Why?** サービスは、ステートフルなメモリ上のデータを共有するのに理想的です。


</div>



<code-example path="styleguide/src/07-01/app/heroes/shared/hero.service.ts" region="example" header="app/heroes/shared/hero.service.ts">

</code-example>



<a href="#toc">トップに戻る</a>

{@a 07-02}

### 単一責任

#### Style 07-02


<div class="s-rule do">



**Do** コンテキストによってカプセル化された単一の責任をもったサービスを作成します。


</div>



<div class="s-rule do">



**Do** サービスがその単一の目的を超え始めたら、新しいサービスを作成します。


</div>



<div class="s-why">



**Why?** サービスに複数の責任があると、テストが困難になります。


</div>



<div class="s-why-last">



**Why?** サービスに複数の責任があると、それを注入するすべてのコンポーネントまたはサービスは、それらすべての重みを負うことになります。


</div>

<a href="#toc">トップに戻る</a>

{@a 07-03}

### サービスの提供

#### Style 07-03


<div class="s-rule do">



**Do** サービスの `@Injectable` デコレーターでアプリルートインジェクターを使用してサービスを提供します。


</div>



<div class="s-why">



**Why?** Angularのインジェクターは階層的です。


</div>



<div class="s-why">



**Why?** サービスをルートインジェクターに提供すると、そのサービスのインスタンスはサービスを必要とするすべてのクラスで共有され、使用可能になります。これは、サービスがメソッドや状態を共有している場合に理想的です。



</div>



<div class="s-why">



**Why?** `@Injectable` デコレーターの中でサービスを登録すると、CLIのプロダクションビルドで使用されるような最適化ツールは、Tree Shakingを実行してアプリケーションで使用されていないサービスを削除したりできます。

</div>



<div class="s-why-last">



**Why?** 2つの異なるコンポーネントが異なるサービスインスタンスを必要とする場合、これは理想的ではありません。この場合は、新しい個別のインスタンスを必要とするコンポーネントレベルでサービスを提供することをお勧めします。


</div>

<code-example path="dependency-injection/src/app/tree-shaking/service.ts" header="src/app/treeshaking/service.ts"></code-example>




<a href="#toc">トップに戻る</a>

{@a 07-04}

### @Injectable()クラスデコレーターを使いましょう

#### Style 07-04


<div class="s-rule do">



**Do** 型をサービスの依存関係のトークンとして使用する場合は、`@Inject`パラメーターデコレーターではなく `@Injectable()` クラスデコレーターを使用します。


</div>



<div class="s-why">



**Why?** Angularの依存性の注入（DI）メカニズムは、宣言されたサービスのコンストラクターパラメーターの型に基づいて、
サービス自身の依存関係を解決します。


</div>



<div class="s-why-last">



**Why?** サービスが型トークンに関連付けられた依存関係のみを受け付ける場合、`@Injectable()`構文は、個々のコンストラクターパラメーターで `@Inject()` を使用する場合と比較して、はるかに冗長度が低くなります。


</div>



<code-example path="styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" region="example" header="app/heroes/shared/hero-arena.service.ts">

</code-example>





<code-example path="styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" region="example" header="app/heroes/shared/hero-arena.service.ts">

</code-example>



<a href="#toc">トップに戻る</a>


## データサービス

{@a 08-01}

### サービスを通してサーバーと対話しましょう

#### Style 08-01


<div class="s-rule do">



**Do** データ操作とインタラクションをサービスとやり取りするようにロジックをリファクタリングします。


</div>



<div class="s-rule do">



**Do** XHR呼び出し、ローカルストレージ、メモリへの保存、その他のデータ操作に対して責任をもつデータサービスを作ります。


</div>



<div class="s-why">



**Why?** コンポーネントの責任は、ビューに対する情報の表示と収集にあります。どのようにしてデータを取得するかに関心をもつべきではありません。だれがそれを取得するのかを知っているだけです。データサービスを分離することで、取得方法に関するロジックがデータサービスへ移動し、コンポーネントをシンプルにしてビューに集中させることができます。


</div>



<div class="s-why">



**Why?** これにより、データサービスを使用するコンポーネントをテストするときに、データ呼び出しのテスト（モックまたは実際のテスト）が簡単になります。


</div>



<div class="s-why-last">



**Why?** ヘッダー、HTTPメソッド、キャッシング、
エラー処理、再試行ロジックなど、データ管理の詳細は、
コンポーネントやその他のデータ利用者には関係ありません。

データサービスはこれらの詳細をカプセル化します。
利用者に影響を与えることなく、サービス内でこれらの詳細を進化させる方が簡単です。
そして、モックサービスの実装を使って利用者をテストする方が簡単です。


</div>

<a href="#toc">トップに戻る</a>


## ライフサイクルフック

ライフサイクルフックを使用して、Angularによって公開される重要なイベントを利用します。

<a href="#toc">トップに戻る</a>

{@a 09-01}

### ライフサイクルフックインターフェースを実装しましょう

#### Style 09-01


<div class="s-rule do">



**Do** ライフサイクルフックインターフェースを実装します。


</div>



<div class="s-why-last">



**Why?** ライフサイクルインターフェースは型付きのメソッドシグネチャーを規定します。
これらのシグネチャーを使用して、スペルミスや構文の誤りを知らせます。


</div>



<code-example path="styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>



<a href="#toc">トップに戻る</a>


## 付録

Angular用の便利なツールとヒント。

<a href="#toc">トップに戻る</a>

{@a A-01}

### Codelyzer

#### Style A-01


<div class="s-rule do">



**Do** [codelyzer](https://www.npmjs.com/package/codelyzer)を使ってこのスタイルガイドに従います。


</div>



<div class="s-rule consider">



**Consider** あなたのニーズに合うようにcodelyzerのルールを調整します。


</div>

<a href="#toc">トップに戻る</a>

{@a A-02}

### ファイルテンプレートとスニペット

#### Style A-02


<div class="s-rule do">



**Do** ファイルテンプレートまたはスニペットを使用して、一貫したスタイルとパターンに従うようにします。ここにいくつかのWeb開発エディタとIDEのためのテンプレートやスニペットを挙げます。


</div>



<div class="s-rule consider">

**Consider** スタイルガイドに従った[Visual Studio Code](https://code.visualstudio.com/)用の[スニペット](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)を使います。

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">
  <img src="generated/images/guide/styleguide/use-extension.gif" alt="Use Extension">
</a>

**Consider** スタイルガイドに従った[Atom](https://atom.io/)用の[スニペット](https://atom.io/packages/angular-2-typescript-snippets) を使います。

**Consider** スタイルガイドに従った[Sublime Text](http://www.sublimetext.com/)用の[スニペット](https://github.com/orizens/sublime-angular2-snippets)を使います。

**Consider** スタイルガイドに従った[Vim](http://www.vim.org/)用の[スニペット](https://github.com/mhartington/vim-angular2-snippets) を使います。


</div>

<a href="#toc">トップに戻る</a>
