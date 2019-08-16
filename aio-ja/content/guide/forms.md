{@a template-driven-forms}
# テンプレート駆動フォーム

フォームはビジネスアプリケーションの根幹です。
フォームを使用してログインし、ヘルプリクエストを送信し、注文し、フライトを予約し、ミーティングをスケジュールし、その他の無数のデータ入力タスクを実行します。

フォームを開発するには、ワークフローを通じて効率的かつ効果的にユーザーを誘導するデータ入力エクスペリエンスを作成することが重要です。

## テンプレート駆動フォームの導入

フォームを開発するには、デザインスキル（このページの対象外）と*双方向データ・バインディング、変更検知、検証、エラー処理*のためのフレームワークサポートが必要です。

このページでは、単純なフォームを最初から作成する方法を示します。ここでは次のことを学びます

* コンポーネントとテンプレートを使ってAngularフォームを作成します。
* `ngModel` を使用して、入力コントロールの値を読み書きするための双方向データバインディングを作成します。
* 状態の変化とフォームコントロールの有効性を追跡します。
* コントロールの状態を追跡する特別なCSSクラスを使用して視覚的フィードバックを提供します。
* 検証エラーをユーザーに表示し、フォームコントロールを有効または無効にします。 
* テンプレート参照変数を使用してHTML要素間で情報を共有します。

Stackblitzで<live-example></live-example>を実行し、そこからコードをダウンロードすることができます。

{@a template-driven}

このページで説明されているフォーム固有のディレクティブとテクニックを使用して、
Angular[テンプレート構文](guide/template-syntax)でテンプレートを記述することにより、フォームを構築できます。

<div class="alert is-helpful">

  リアクティブ（またはモデル駆動型）アプローチを使用してフォームを構築することもできます。
  ただし、このページでは、テンプレート駆動フォームに焦点を当てています。

</div>

ほとんどのフォームは、Angularテンプレートを使って構築することができます&mdash;ログインフォーム、コンタクトフォーム、ほぼすべてのビジネスフォーム。
コントロールを創造的に配置し、データにバインドし、検証ルールを指定し、検証エラーを表示し、特定のコントロールを条件付きで有効または無効にしたり、
ビジュアルフィードバックをトリガーしたりできます。

Angularは、あなた自身が苦労している反復的で定型的なタスクの多くを処理することで、プロセスを簡単にします。

次のようなテンプレート駆動フォームを構築する方法を学びます。

<figure>
  <img src="generated/images/guide/forms/hero-form-1.png" alt="Clean Form">
</figure>

*Hero Employment Agency* はこのフォームを使用してヒーローに関する個人情報を管理しています。
すべてのヒーローは仕事が必要です。適切な英雄と正しい危機を一致させることがこの会社の使命です。

このフォームの3つのフィールドのうち2つが必須です。必要なフィールドには、左側に緑色のバーが表示されます。

ヒーロー名を削除すると、フォームは注意を引いたスタイルで検証エラーを表示します。

<figure>
  <img src="generated/images/guide/forms/hero-form-2.png" alt="Invalid, Name Required">
</figure>

*Submit* ボタンは無効になっており、入力コントロールの左側の"必須"バーが緑色から赤色に変わっていることに注目しましょう。

<div class="alert is-helpful">

  標準のCSSを使用して、"必須"バーの色と位置をカスタマイズできます。

</div>

このフォームは小さな手順で作成します。

1. `Hero` モデルクラスを作成します。 
1. フォームを制御するコンポーネントを作成します。
1. 初期フォームレイアウトのテンプレートを作成します。
1. `ngModel` 双方向データバインディング構文を使用して、各フォームコントロールにデータプロパティをバインドします。 
1. 各フォーム入力コントロールに `name` 属性を追加します。
1. 視覚的なフィードバックを提供するカスタムCSSを追加します。
1. 検証エラーメッセージの表示と非表示を切り替えます。
1. *ngSubmit* でフォームの送信を処理します。
1. フォームが有効になるまで、フォームの *Submit* ボタンを無効にします。

## セットアップ

<code>angular-forms</code>という名前の新しいプロジェクトを作成します。

<code-example language="sh" class="code-shell">

  ng new angular-forms

</code-example>

## ヒーローモデルクラスを作成する

ユーザーがフォームデータを入力すると、その変更をキャプチャしてモデルのインスタンスを更新します。
モデルがどのように見えるかを知るまで、フォームをレイアウトすることはできません。

モデルは、アプリケーションが重要視する事実を保持する「プロパティバッグ」のように単純にできます。
これは `Hero` クラスの3つの必須フィールド（ `id` 、 `name` 、 `power` ）と1つのオプションフィールド（ `alterEgo` ）でうまく記述されています。

Angular CLIコマンド [ `ng generate class` ](cli/generate) を使用して、 `Hero` という名前の新しいクラスを生成します。

<code-example language="sh" class="code-shell">

  ng generate class Hero

</code-example>

中身を記述します。

<code-example path="forms/src/app/hero.ts" header="src/app/hero.ts"></code-example>

これは要件が少なく振る舞いもない貧弱なモデルです。このデモには最適です。

TypeScriptコンパイラは、 `public` コンストラクターパラメータごとにパブリックフィールドを生成し、
ヒーローを作成するときにそのフィールドにパラメータの値を自動的に割り当てます。

`alterEgo` はオプションであるため、コンストラクターで省略することができます。  `alterEgo?` の疑問符（?）に注目してください。

このように新しいヒーローを作成することができます。

<code-example path="forms/src/app/hero-form/hero-form.component.ts" region="SkyDog"></code-example>

## フォームコンポーネントを作成する

Angularフォームには、HTMLベースの_テンプレート_と、 
データとユーザー対話をプログラムで処理するコンポーネント _クラス_ の2つの部分があります。
まずはクラスから、簡単にいえば、ヒーローエディターは何ができるのかということから始めましょう。

Angular CLIコマンド [ `ng generate component` ](cli/generate) を使用して、 `HeroForm` という名前の新しいコンポーネントを生成します。

<code-example language="sh" class="code-shell">

  ng generate component HeroForm

</code-example>

中身を記述します。

<code-example path="forms/src/app/hero-form/hero-form.component.ts" header="src/app/hero-form/hero-form.component.ts (v1)" region="v1"></code-example>

このコンポーネントには何も特別なものはありません。フォーム固有のものはありません。
前に書いたコンポーネントと区別するものはありません。

このコンポーネントを理解するには、前のページで説明したAngularの概念のみが必要です。

* コードはAngularコアライブラリと作成した `Hero` モデルをインポートします。
* "hero-form"という `@Component` のセレクター値は、このフォームを `<app-hero-form>` タグによって親テンプレートに配置できることを意味します。
* `templateUrl` プロパティは、テンプレートHTMLのための別のファイルを指します。
* デモにふさわしいダミーデータを `model` と `powers` に定義します。

実際のデータを取得して保存するためのデータサービスを挿入したり、親コンポーネントへのバインドのために、
これらのプロパティを入力と出力として公開することができます（[テンプレート構文ページ](guide/template-syntax)の[入力プロパティと出力プロパティ](guide/template-syntax#inputs-outputs)を参照してください）。
これは今は気にすることではなく、これらの将来の変更はフォームに影響しません。

* `diagnostic` モデルのJSON表現を返すためのプロパティを追加しました。
開発中に何をしているのかを理解するのに役立つので、あとで破棄するためのクリーンアップノートを残しました。

## *app.module.ts*の改訂

`app.module.ts` アプリケーションのルートモジュールを定義します。その中でアプリケーションで使用する外部モジュールを特定し、
`HeroFormComponent` モジュールに属するコンポーネントを宣言します。

テンプレート駆動フォームは専用のモジュールに含まれているので、フォームを使用する前に、アプリケーションモジュールの `imports` 配列に `FormsModule` を追加する必要があります。

次のように更新してください。

<code-example path="forms/src/app/app.module.ts" header="src/app/app.module.ts"></code-example>

<div class="alert is-helpful">

  2つの変更点があります。

  1. `FormsModule` をインポートします。

  1. `@NgModule` デコレーターに定義されている `imports` リストに `FormsModule` を追加します。これにより、
  アプリケーションは `ngModel` を含むすべてのテンプレート駆動フォーム機能にアクセスできます。

</div>

<div class="alert is-important">

  コンポーネント、ディレクティブ、またはパイプが `imports` 配列内のモジュールに属している場合、 `declarations` 配列で再宣言してはいけません。
  それがあなたが記述したもので、モジュールに含める場合は、 `declarations` 配列で宣言してください。

</div>

## *app.component.html*の改訂

`AppComponent` はアプリケーションのルートコンポーネントです。これは新しい `HeroFormComponent` のホストになります。

テンプレートの内容を次のものに置き換えます。

<code-example path="forms/src/app/app.component.html" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

  変更は2つだけです。 `template` は、単にコンポーネントの `selector` プロパティによって識別される新しい要素タグになります。
  これは、アプリケーションコンポーネントがロードされたときにヒーローフォームを表示します。
  クラス本体から `name` フィールドを削除することも忘れないでください。

</div>

## 最初のHTMLフォームテンプレートを作成する

テンプレートファイルを次の内容で更新します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" region="start" header="src/app/hero-form/hero-form.component.html"></code-example>

言語は単なるHTML5です。 `Hero` のフィールド、 `name` と `alterEgo` を表示しており、ユーザー入力のためにそれらを入力ボックスに公開しています。

*Name*の `<input>` コントロールは、HTML5の `required` 属性をもちますが、
*Alter Ego*の `<input>` コントロールはオプションであるためそうではありません。

下部に *Submit* ボタンを追加し、スタイリングのためにいくつかのクラスを追加しました。

*Angularはまだ使用していません* 。バインディングや追加のディレクティブはなく、レイアウトだけです。

<div class="alert is-helpful">

  テンプレート駆動フォームでは、 `FormsModule` をインポートした場合は、 `FormsModule` の用途で `<form>` タグを使用するために何もする必要はありません。
  それがどのように機能するかを確認してください。

</div>

`container` 、 `form-group` 、 `form-control` 、および `btn` クラスは[Twitter Bootstrap](http://getbootstrap.com/css/)由来です。
これらのクラスは純粋に化粧品です。Bootstrapはフォームに小さなスタイルを与えます。

<div class="callout is-important">

  <header>
    Angularフォームにはスタイルライブラリは必要ありません
  </header>

  Angularは `container` 、 `form-group` 、 `form-control` 、および `btn` クラスあるいは任意の外部ライブラリのスタイルを一切使用いたしません。
  AngularアプリはCSSライブラリを使用することも、まったく使用しないこともできます。

</div>

スタイルシートを追加するには `styles.css` を開き、上部に次のインポート行を追加します。

<code-example path="forms/src/styles.1.css" header="src/styles.css"></code-example>

## _*ngFor_ を使って能力を追加する

ヒーローは、エージェンシーが認可した能力のリストから1つの超能力を選択する必要があります。
あなたはそのリストを( `HeroFormComponent` の中で)内部的に維持します。

フォームに `select` を追加し、
以前に[Displaying Data](guide/displaying-data)ページで見た手法である `ngFor` を使用して、オプションをリストにバインドします。

次のHTMLを *Alter Ego* グループの *直下* に追加します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (powers)" region="powers"></code-example>

このコードは、能力のリストの個々の能力ごとに `<option>` タグを繰り返します。
テンプレート入力変数 `pow` は、各繰り返しにおいて異なる能力です。
補間構文を使用して能力の名前を表示します。

{@a ngModel}

## _ngModel_による双方向データバインディング

今すぐアプリケーションを実行してもがっかりするでしょう。

<figure>
  <img src="generated/images/guide/forms/hero-form-3.png" alt="Early form with no binding">
</figure>


まだ `Hero` にバインドしていないので、ヒーローデータは表示されません。
それをおこなう方法はこれまでのページで知っています。
[データの表示は](guide/displaying-data)プロパティのバインディングを教えます。
[ユーザー入力](guide/user-input)は、イベントバインディングを使用してDOMイベントをリッスンする方法、
および表示された値でコンポーネントプロパティを更新する方法を示します。

今度は、表示とリッスン、さらに抽出を同時にする必要があります。

あなたはすでに知っているテクニックを使うことができますが、
代わりに新しい `[(ngModel)]` 構文を使用することで、
フォームをモデルに簡単にバインドすることができます。

*Name* の `<input>` タグを見つけて、次のように更新します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModelName-1"></code-example>

<div class="alert is-helpful">

  入力タグの後に診断用の補間を追加して、
  何をしているのかを確認できます。
  完了したら捨てるためにメモを残しました。

</div>

`[(ngModel)]="..."` というバインディング構文に焦点を当ててください。

データを表示するにはさらに1つの追加が必要です。
フォームのテンプレート変数を宣言します。
次のように `<form>` タグを `#heroForm="ngForm"` を使って更新します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="template-variable"></code-example>

この変数 `heroForm` は `NgForm` というフォーム全体を管理するディレクティブへの参照になりました。

<div class="alert is-helpful">

  {@a ngForm}

  ### _NgForm_ディレクティブ

  `NgForm` とはどのようなディレクティブでしょうか？あなたは[NgForm](api/forms/NgForm)ディレクティブを追加していません。

  Angularがやりました。Angularは自動的に `NgForm` ディレクティブを作成し `<form>` タグに付加します。

  この `NgForm` ディレクティブは `form` 要素に追加の機能を与えます。
  `ngModel` ディレクティブと `name` 属性をもつ要素に対して作成したコントロールを保持し、
  その有効性を含むプロパティを監視します。
  また、それ自身の `valid` プロパティもあります。
  これは、 *含まれているすべてのコントロール* が有効な場合にのみtrueです。

</div>

アプリケーションを実行して、 *Name* の入力ボックスでタイピングを始めて、文字の追加と削除をおこなえば、
補間されたテキストが表示されたり消えてたりする様子が見られます。
ある時点では、次のようになります。

<figure>
  <img src="generated/images/guide/forms/ng-model-in-action.png" alt="ngModel in action">
</figure>

この診断は、値が実際に入力ボックスからモデルに流れて戻ってきたという証拠です

<div class="alert is-helpful">

  これが *双方向データバインディング* です。
  詳細については、[テンプレート構文](guide/template-syntax)ページの[NgModelによる双方向バインディング](guide/template-syntax#ngModel)を参照してください。

</div>

`<input>` タグに `name` 属性を追加し、ヒーローの名前をあらわす"name"に設定することにも注意してください。
一意の値であればなんでもよいですが、わかりやすい名前を使用すると便利です。
フォームと組み合わせて `[(ngModel)]` を使用する場合は、 `name` 属性を定義する必要があります。

<div class="alert is-helpful">

  内部的に、Angularは `FormControl` インスタンスを作成し、
  `<form>` タグにアタッチした `NgForm` ディレクティブとあわせてインスタンスを登録します。
  個々の `FormControl` は、 `name` 属性に割り当てた名前で登録されます。
  詳しくは前のセクション、[NgFormディレクティブ](guide/forms#ngForm)を参照してください。

</div>

同様の `[(ngModel)]` バインディングと属性を *Alter Ego* と *Hero Powers* に追加します。
入力ボックスのバインディングメッセージを捨て、コンポーネントの `diagnostic` プロパティに新しいバインディング（上部）を追加します。
そうすれば、 *ヒーローモデル全体に対して* 双方向データバインディングが機能することを確認できます。

改訂後、フォームのコアは次のようになります。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModel-2"></code-example>

<div class="alert is-helpful">

  * 各入力要素は `id` プロパティをもちます。これはラベルを入力コントロールに一致させるために `label` 要素の `for` 属性によって使用されます。
  * 各入力要素は `name` プロパティをもちます。これはAngularフォームがコントロールを登録するために必要です。

</div>

アプリを実行し、すべてのヒーローモデルのプロパティを変更すると、フォームは次のように表示されるでしょう。

<figure>
  <img src="generated/images/guide/forms/ng-model-in-action-2.png" alt="ngModel in action">
</figure>

フォーム上部の診断では、すべての変更がモデルに反映されていることが確認されます。

目的を果たしたので、一番上の `{{diagnostic}}` バインディングを削除してください。

## _ngModel_ を使用してコントロールの状態と有効性を追跡する

フォームで `ngModel` を使うことで、単なる双方向データバインディング以上のことが可能になります。
ユーザーがコントロールにタッチしたかどうか、値が変更されたかどうか、または値が無効になったかどうかを教えてくれます。

*NgModel* ディレクティブは、状態を追跡するだけではありません。
状態を反映する特殊なAngular CSSクラスでコントロールを更新します。
これらのクラス名を利用して、コントロールの外観を変更することができます。

<table>

  <tr>

    <th>
      状態
    </th>

    <th>
      trueのときのクラス
    </th>

    <th>
      falseのときのクラス
    </th>

  </tr>

  <tr>

    <td>
      コントロールが訪問されました。
    </td>

    <td>
      <code>ng-touched</code>
    </td>

    <td>
      <code>ng-untouched</code>
    </td>

  </tr>

  <tr>

    <td>
      コントロールの値が変更されました。
    </td>

    <td>
      <code>ng-dirty</code>
    </td>

    <td>
      <code>ng-pristine</code>
    </td>

  </tr>

  <tr>

    <td>
      コントロールの値は有効です。
    </td>

    <td>
      <code>ng-valid</code>
    </td>

    <td>
      <code>ng-invalid</code>
    </td>

  </tr>

</table>

一時的に `spy` という名前の[テンプレート参照変数](guide/template-syntax#ref-vars)を _Name_ の `<input>` に追加し、
それを使用して入力のCSSクラスを表示します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="ngModelName-2"></code-example>

アプリケーションを実行し、 _Name_ 入力ボックスを見てください。
次の手順を *正確に* 実行してください。

1. 触らずに見てください
1. 名前ボックスの内側をクリックし、外側をクリックします。
1. 名前の最後にスラッシュを追加します。
1. 名前を消去します。

アクションと効果は次のとおりです。

<figure>
  <img src="generated/images/guide/forms/control-state-transitions-anim.gif" alt="Control State Transition">
</figure>

次の遷移とクラス名が表示されます。

<figure>
  <img src="generated/images/guide/forms/ng-control-class-changes.png" alt="Control state transitions">
</figure>

値が無効であるときに強力なシグナルを送りたいので、 `ng-valid` / `ng-invalid` のペアにもっとも関心があります。
また、必須項目にも印を付けたいです。このような視覚的フィードバックを作成するには、 `ng-*` CSSクラスの定義を追加します。

`#spy` テンプレート参照変数と `TODO` はその目的を果たしたので削除しましょう。

## 視覚的なフィードバックのためにカスタムCSSを追加する

入力ボックスの左側にある色付きのバーを使用して、
必須フィールドと無効なデータを同時にマークすることができます。

<figure>
  <img src="generated/images/guide/forms/validity-required-indicator.png" alt="Invalid Form">
</figure>

この効果は、プロジェクトの `index.html` の隣に追加する新しい `forms.css` ファイルに定義したこれらのクラス定義によって得られます。

<code-example path="forms/src/assets/forms.css" header="src/assets/forms.css"></code-example>

`index.html` の `<head>` を更新してこのスタイルシートを読み込みます。

<code-example path="forms/src/index.html" header="src/index.html (styles)" region="styles"></code-example>

## 検証エラーメッセージの表示と非表示

このフォームは改善できます。 _Name_ の入力ボックスは必須項目で、それをクリアすると、バーが赤色に点灯しています。
何かが間違っていることはわかりますが、ユーザーは *何が* 間違っているのか、何をすべきなのか分かりません。
コントロールの状態を利用して役立つメッセージを表示します。

ユーザーが名前を削除すると、フォームは次のようになります

<figure>
  <img src="generated/images/guide/forms/name-required-error.png" alt="Name required">
</figure>

この効果を得るには、次のように `<input>` タグを拡張します。

* [テンプレートの参照変数](guide/template-syntax#ref-vars)
* コントロールが無効である場合にのみ表示される `<div>` の" *is required* "メッセージ。

次に、 _Name_ 入力ボックスに追加されたエラーメッセージの例を示します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="name-with-error-msg"></code-example>

テンプレート内から入力ボックスのAngularコントロールにアクセスするには、テンプレート参照変数が必要です。
ここでは、 `name` という変数を作成し、それに"ngModel"という値を与えました。

<div class="alert is-helpful">

  なぜ"ngModel"なのでしょうか?
  ディレクティブの[exportAs](api/core/Directive)プロパティは、参照変数をディレクティブにリンクする方法をAngularに指示します。
  `name` を `ngModel` に設定するのは、 `ngModel` ディレクティブの `exportAs` プロパティが "ngModel"であるためです。

</div>

`name` コントロールのプロパティをメッセージ `<div>` 要素の `hidden` プロパティにバインドすることにより、
名前のエラーメッセージの表示を制御します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (hidden-error-msg)" region="hidden-error-msg"></code-example>

この例では、コントロールが有効またはpristineの状態のときにメッセージを非表示にします。
"pristine"とは、ユーザーがこのフォームで表示されて以来、値を変更していないことを意味します。

このユーザー体験は開発者の選択です。開発者によっては、メッセージを常に表示することを望みます。
`pristine` 状態を無視すれば、値が有効な場合にのみメッセージが非表示になります。
このコンポーネントに新しい（空白の）主人公または無効な主人公がいる場合は、何かをする前にすぐにエラーメッセージが表示されます。

開発者によっては、ユーザーが無効な変更を行った場合にのみ、メッセージを表示することを望みます。
コントロールが"pristine"である間はメッセージを非表示にすると、その目標が達成されます。
フォームに新しいヒーローを追加すると、この選択の重要性がわかります。

ヒーローの *Alter Ego* はオプションですので、そのままでもよいでしょう。

ヒーローの *Powwer* の選択は必須です。
必要に応じて同じ種類のエラー処理を `<select>` に追加することができますが、
選択ボックスではすでに有効な値に制限されているため、必須ではありません。

新しいヒーローをこのフォームに追加しましょう。
*New Hero* ボタンをフォームの下部に置き、そのクリックイベントを `newHero` コンポーネントメソッドにバインドします。

<code-example path="forms/src/app/hero-form/hero-form.component.html" region="new-hero-button-no-reset" header="src/app/hero-form/hero-form.component.html (New Hero button)"></code-example>

<code-example path="forms/src/app/hero-form/hero-form.component.ts" region="new-hero" header="src/app/hero-form/hero-form.component.ts (New Hero method)"></code-example>

アプリケーションを再度実行し、 *New Hero* ボタンをクリックすると、フォームがクリアされます。
入力ボックスの左の *required* バーが赤くなり、 `name` と `power` プロパティが無効であることを示します。
これは必須フィールドなので当然です。
エラーメッセージはフォームがまだ何も変えていないpristine状態であるため、非表示になります。

名前を入力し、 *New Hero* をもう一度クリックします。
アプリケーションには、 _Name is required_ というエラーメッセージが表示されます。
新しい（空の）ヒーローを作成したときには、エラーメッセージは表示されてほしくありません。
なぜ今表示されたのでしょうか？

ブラウザのツールで要素を調べると、 *name* の入力ボックスが _pristineになっていない_ ことがわかります。
フォームは、 *New Hero* をクリックする前に名前を入力したことを記憶しています。
ヒーローオブジェクトを置き換えても、フォームコントロールの *pristineの状態は復元されません* でした。

あなたはすべてのフラグを命令的にクリアする必要があります。
`newHero()` メソッドを呼び出した後にフォームの `reset()` メソッドを呼び出すことで実行できます。

<code-example path="forms/src/app/hero-form/hero-form.component.html" region="new-hero-button-form-reset" header="src/app/hero-form/hero-form.component.html (Reset the form)"></code-example>

*New Hero* をクリックすると、フォームとそのコントロールフラグがリセットされます。

## _ngSubmit_ でフォームを送信する

ユーザーはフォームを入力した後にこのフォームを送信することができます。
フォームの下部にある *送信* ボタンは何もしませんが、そのタイプ（ `type="submit"` ）によってフォーム送信をトリガーします。

現時点では、"フォームの送信"は役に立ちません。
これを便利にするには、フォームの `ngSubmit` イベントプロパティを
ヒーローフォームコンポーネントの `onSubmit()` メソッドにバインドします。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (ngSubmit)" region="ngSubmit"></code-example>

すでにテンプレート参照変数 `#heroForm` を定義し、それを値"ngForm"で初期化しています。
さて、この変数を使用して、Submitボタンでフォームにアクセスします。


イベントバインディングを使用し、フォームの全体的な有効性を `heroForm` 変数を介して
ボタンの `disabled` プロパティにバインドします。コードは次のとおりです：

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (submit-button)" region="submit-button"></code-example>

アプリケーションを実行すると、ボタンが有効になっていることがわかります&mdash;が、まだ便利な機能はありません。

名前を削除すると、エラーメッセージに正しく記載されているとおり、 *required* ルールに違反します。
また、 *Submit* ボタンも無効になっています。

感動しませんか？ちょっと考えてみてください。
Angularの助けがなかったらボタンの有効/無効状態をフォームの有効性に結びつけるために何をする必要がありますか？

あなたにとってはこんなに簡単でした。

1. （拡張された）フォーム要素にテンプレート参照変数を定義します。
2. 数行離れたボタンで変数を参照します。

## 2つのフォーム領域を切り替える（追加クレジット）

フォームの送信は現時点ではドラマティックではありません。

<div class="alert is-helpful">

  デモに対する当然の意見です。正直に言って、
  それを誇大にしてもフォームについて新しいことは何も学べません。
  しかし、これはあなたが新たに獲得したバインディングスキルのいくつかを行使する機会です。
  あなたが興味がないなら、このページのまとめにスキップしてください。

</div>

より目立つような視覚効果を得るには、
データ入力領域を非表示にして別のものを表示します。

フォームを `div` にラップし、その `hidden` プロパティを `HeroFormComponent.submitted` プロパティにバインドします。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="edit-div"></code-example>

メインのフォームは最初に表示されます。この `HeroFormComponent` の断片が示すとおり、
フォームを送信するまで `submitted` プロパティがfalseであるためです。

<code-example path="forms/src/app/hero-form/hero-form.component.ts" header="src/app/hero-form/hero-form.component.ts (submitted)" region="submitted"></code-example>

*Submit* ボタンをクリックすると、 `submitted` フラグがtrueになり、計画どおりにフォームが消えます。

フォームが送信された状態になっている間、アプリは別のものを表示する必要があります。
先ほど記述した `<div>` ラッパーの下に次のHTMLを追加します。

<code-example path="forms/src/app/hero-form/hero-form.component.html" header="src/app/hero-form/hero-form.component.html (excerpt)" region="submitted"></code-example>

ヒーローが再び現れ、補間バインディングで読み取り専用で表示されます。
この `<div>` は、コンポーネントが送信された状態のときにのみ表示されます。

HTMLには、 `submitted` フラグをクリアする式にクリックイベントがバインドされた *Edit* ボタンが含まれています。

*Edit* ボタンをクリックすると、このブロックは消え、編集可能なフォームが再び表示されます。

## まとめ

このページで説明したAngularフォームは、データの変更、
検証などのサポートを提供するために、次のフレームワーク機能を利用しています。

* Angular HTMLフォームテンプレート。
* `@Component` デコレーターをもつフォームコンポーネントクラス。
* `NgForm.ngSubmit` イベントプロパティにバインドしてフォームの送信を処理します。
* `#heroForm` や `#name` のようなテンプレート参照変数。
* 双方向データバインディングのための `[(ngModel)]` 構文。
* 検証およびフォーム要素の変更追跡のために `name` 属性を使います。
* コントロールが有効かどうかをチェックし、エラーメッセージを表示/非表示にするための入力コントロールの参照変数の `valid` プロパティ。
* `NgForm` の有効性にバインドすることによって、 *Submit* ボタンの有効な状態を制御します。
* 無効なコントロールについてユーザーに視覚的なフィードバックを提供するカスタムCSSクラス。

アプリケーションの最終バージョンのコードは次のとおりです。

<code-tabs>

  <code-pane header="hero-form/hero-form.component.ts" path="forms/src/app/hero-form/hero-form.component.ts" region="final">

  </code-pane>

  <code-pane header="hero-form/hero-form.component.html" path="forms/src/app/hero-form/hero-form.component.html" region="final">

  </code-pane>

  <code-pane header="hero.ts" path="forms/src/app/hero.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="forms/src/app/app.module.ts">

  </code-pane>

  <code-pane header="app.component.html" path="forms/src/app/app.component.html">

  </code-pane>

  <code-pane header="app.component.ts" path="forms/src/app/app.component.ts">

  </code-pane>

  <code-pane header="main.ts" path="forms/src/main.ts">

  </code-pane>

  <code-pane header="forms.css" path="forms/src/assets/forms.css">

  </code-pane>

</code-tabs>

