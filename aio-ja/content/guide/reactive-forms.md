# リアクティブフォーム

_リアクティブフォーム_ は、 _リアクティブ_ スタイルでフォームを作成するためのAngularのテクニックです。
このガイドでは、リアクティブフォームを用いて“ヒーローの詳細を編集する”フォームを作る手順を説明していきます｡


{@a toc}

<live-example stackblitz="final" title="Reactive Forms (final) in Stackblitz">リアクティブフォームの live-example</live-example>もご参照ください。

また、<live-example title="Reactive Forms Demo in Stackblitz">Reactive Forms Demo</live-example>にライブサンプルがあります。
"Demo Picker"から実装途中のステップも参照できます。


{@a intro}


## Reactive Form について

Angularは、フォームを構築するための技術的方法として、 _リアクティブ_ フォーム、 _テンプレート駆動_ フォームという2種類の技術を提供しています。
この2つの技術は、`@angular/forms` ライブラリに属しており、
フォームコントロールクラスの共通セットを共有しています｡

ただし、哲学やプログラミングスタイル、テクニックという観点において、両者はかなり異なるものなので、
`ReactiveFormsModule`と`FormsModule`という独自のモジュールで分かれています。

### リアクティブフォーム
_リアクティブ_ フォームフォームは、
非UIの _データモデル_ （通常はサーバーから取得できるもの）と
UI指向の _フォームモデル_ （画面上のHTMLコントロールの状態と値を保持するもの）との間で
流れるデータの明示的な管理をサポートする
_リアクティブスタイル_ のプログラミングを容易にします。
リアクティブフォームは、リアクティブパターン、テスト、およびバリデーションの使いやすさを提供します。

_リアクティブ_ フォームでは、
コンポーネントクラスのAngularフォームコントロールオブジェクトのツリーを作成し、
このガイドで説明する方法を用いてコンポーネントテンプレートのネイティブフォームコントロールエレメントにバインドします。

フォームクラスコントロールオブジェクトは、直接コンポーネントクラスで作成と操作ができます。
コンポーネントクラスは _データモデル_ とフォームコントロール構造の両方に対して即座にアクセスできるため、
データモデル値をフォームコントロールにプッシュして、
ユーザーが変更した値を取得することができます。
コンポーネントはフォーム制御状態の変化を監視することで、その変化に反応することができます｡

フォームコントロールオブジェクトを直接操作するメリットの1つとして、
値とバリデーションの更新が[常に同期して制御できる](guide/reactive-forms#async-vs-sync "Async vs sync")ことです。
テンプレート駆動フォームで時々起き得るタイミング問題に遭遇することもありませんし、
ユニットテストも容易になります。

リアクティブパラダイムに則り、
コンポーネントはイミュータブルなデータモデルを保持し、
元の値を純粋なソースとして扱います。
コンポーネントはデータモデルを直接更新するのではなく、
ユーザーの変更を検知して外部コンポーネントまたはサービスに転送します。
これらのコンポーネントまたはサービス側では、何か処理を実行し（たとえば保存など）、
更新されたモデル状態を反映する新しいデータモデルをコンポーネントに返します。

リアクティブフォームディレクティブを使用する場合、
すべてのリアクティブ原則を遵守する必要はありませんが、リアクティブプログラミング手法が容易になります。

### テンプレート駆動フォーム

[テンプレートガイド](guide/forms)で紹介されているテンプレート駆動フォームは、まったく異なるアプローチです。

コンポーネントテンプレートにHTMLフォームコントロール（`<input>`や`<select>`など）を配置し、
`ngModel`などのディレクティブを使用して
コンポーネントの _データモデル_ プロパティにバインドします。

Angularフォームコントロールオブジェクトは作成しないでください。
Angularディレクティブは、データバインディング内の情報を使用して、ディレクティブを作成します。
手動でデータ値のプッシュしたりプルしたりしないでください。
Angularは、`ngModel`を用いて、ユーザーの変更に合わせて _データモデル_ を変更し、更新します。

これらの理由から、`ngModel`ディレクティブは`ReactiveFormsModule`の一部ではありません。

これはコンポーネントクラスのコードが少ないことを意味しますが、
[テンプレート駆動フォームは非同期](guide/reactive-forms#async-vs-sync "Async vs sync")であるため、
より高度なシナリオでは開発が複雑になる可能性があります。


{@a async-vs-sync}


### 非同期 vs 同期

リアクティブフォームは同期的に動きますが、テンプレート駆動フォームは非同期です。

リアクティブフォームでは、フォームコントロールツリー全体をコードで作成します。
すべてのコントロールが常に利用可能であるため、
親フォームの子孫を介して値をすぐに更新したり、ドリルダウンしたりすることができます。

テンプレート駆動型フォームは、フォームコントロールの作成をディレクティブに委譲します。
"_changed after checked_"というエラーを避けるために、
これらのディレクティブはコントロールツリー全体を構築するために複数のサイクルを要します。
つまり、コンポーネントクラス内からコントロールを操作する前に、
ティックを待つ必要があります。

たとえば、フォームコントロールに `@ViewChild(NgForm)`クエリを挿入し、
それを[`ngAfterViewInit` ライフサイクルフック](guide/lifecycle-hooks#afterview "Lifecycle hooks guide: AfterView")で調べると、
子コントロールがないことがわかります。
コントロールから値を取得したり、バリデーションをテストしたり、新しい値を設定したりするには、
まず`setTimeout`を使用してティックを待つ必要があります。

また、テンプレート駆動フォームの非同期性はユニットテストを複雑にします。
テストブロックを `async()`または `fakeAsync()`にラップする必要があります。
まだ存在しないフォームの値を探すのは避けてください。
リアクティブフォームでは、期待どおりのものがすべて利用可能です。

### リアクティブフォームとテンプレート駆動フォームの選び方

リアクティブフォームおよびテンプレート駆動フォームは、
2つの異なるアーキテクチャ上の枠組みであり、
それぞれ長所と短所を持っています。
あなたにとって最適なアプローチを選択してください。
両方のフォームを同一アプリケーションで使用することもできます。

このページの残りの部分では、
リアクティブの枠組みとリアクティブフォームにおけるテクニックの解説に専念しています。
テンプレート駆動フォームの詳細については、[フォーム](guide/forms)のガイドを参照してください。

次のセクションでは、リアクティブフォームのデモ用にプロジェクトをセットアップします。
その後、[Angularのフォームクラス](guide/reactive-forms#essentials)とそれをリアクティブフォームで使用する方法について学習します。



{@a setup}


## セットアップ

<code>angular-reactive-forms</code>という名前のプロジェクトを新しく作成しましょう:

<code-example language="sh" class="code-shell">

  ng new angular-reactive-forms

</code-example>

{@a data-model}


## データモデルを作成する
このガイドでフォーカスするのは、ヒーローを編集するリアクティブフォームコンポーネントです。
あなたは`hero`クラスといくつかのヒーローデータが必要です。

CLIを使用して、`data-model`という名前の新しいクラスを生成します:

<code-example language="sh" class="code-shell">

  ng generate class data-model

</code-example>

そして以下を `data-model.ts`にコピーします:

<code-example path="reactive-forms/src/app/data-model.ts" title="src/app/data-model.ts" linenums="false">

</code-example>

このファイルは、2つのクラスと2つの定数をエクスポートします。
`Address`クラスと`Hero`クラスは、アプリケーションデータモデルを定義します。
`heroes`と`states`定数は、テストデータを提供します。

{@a create-component}


## リアクティブフォーム コンポーネントを作成する

`HeroDetail`という名前のコンポーネントを作成します:

<code-example language="sh" class="code-shell">

  ng generate component HeroDetail

</code-example>

そしてimportします:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-1.component.ts" region="import" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

次に、`HeroDetailComponent`クラスを編集します。
`FormControl`を追加してください。
`FormControl`は、`FormControl`インスタンスを直接作成して管理するためのディレクティブです。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-1.component.ts" region="v1" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

これにより、`name`という名前の`FormControl`が作成されます。
これはテンプレート内でヒーロー名のHTML `<input>`要素にバインドされます。

`FormControl`コンストラクタは3つのオプションの引数を受け取ります:
初期データ値、バリデータの配列、そして非同期バリデータの配列です。


<div class="l-sub-section">

今回作成したシンプルなコントロールには、データ値やバリデータをセットしていませんが、
実際のアプリのフォームコントロールでは、両方をセットすることになると思います。
`Validators`についての詳細な情報については、[フォームバリデーション](guide/form-validation) ガイドを参照してください。

</div>

{@a create-template}

## テンプレートを作成する

次に、コンポーネントのテンプレートを次のマークアップに変更します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-1.component.html" region="simple-control" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

これがクラスの`name` `FormControl`に結びつける入力であることを
Angularに知らせるには、
`<input>`のテンプレートに`[formControl]="name"`が必要です。

<div class="l-sub-section">

`form-control` CSSクラスは無視してください。
これはAngularではなく<a href="http://getbootstrap.com/" title="Bootstrap CSS">Bootstrap CSSライブラリ</a>が持っているフォームのスタイルであり、
Angularのロジックには影響しません。

</div>

{@a import}

## `ReactiveFormsModule` をインポートする

`HeroDetailComponent`テンプレートは、
`ReactiveFormsModule`の`formControlName`ディレクティブを使用します。

`app.module.ts`で次の2つのことを行ってください:

1. `ReactFormsModule`にアクセスするために、
JavaScriptの`import`文を使用します。
1. `AppModule`の`imports`配列の中に`ReactiveFormsModule`を追加します。

<code-example path="reactive-forms/src/app/app.module.ts" region="v1" title="src/app/app.module.ts (excerpt)" linenums="false">

</code-example>

{@a update}

## `HeroDetailComponent` を表示する
`AppComponent`テンプレートを修正して、`HeroDetailComponent`を表示させてください。

<code-example path="reactive-forms/src/app/app.component.1.html" title="src/app/app.component.html" linenums="false">

</code-example>

{@a essentials}

## フォームクラスの基本
このガイドでは、4つの基本的なクラスを使用してリアクティブフォームを作成しています:


<table>

  <tr>

    <th>
      クラス
    </th>

    <th>
      説明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>AbstractControl</code>
    </td>

    <td>

      [`AbstractControl`](api/forms/AbstractControl "API Reference: FormControl") は、3つの具体的なフォームコントロールクラス、
すなわち`FormControl`、`FormGroup`、および`FormArray`の抽象基本クラスです。
共通のプロパティと振る舞いを提供します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControl</code>
    </td>

    <td>

      [`FormControl`](api/forms/FormControl "API Reference: FormControl") は、
個々のフォームコントロールの値とバリデーションの状態をトラッキングします。
これは、`<input>`や`<select>`などのHTMLフォームコントロールと対応します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroup</code>
    </td>

    <td>

      [`FormGroup`](api/forms/FormGroup "API Reference: FormGroup") は、
`AbstractControl`インスタンスのグループの値とバリデーションの状態をトラッキングします。
グループのプロパティには、子コントロールが含まれます。
コンポーネントの最上位フォームは`FormGroup`です。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArray</code>
    </td>

    <td>

      [`FormArray`](api/forms/FormArray "API Reference: FormArray") は、数値的にインデックスされた
`AbstractControl`インスタンス配列の値とバリデーションの状態をトラッキングします。

    </td>

  </tr>

</table>


## アプリにCSSスタイルを適用する

`AppComponent`と`HeroDetailComponent`の両方のテンプレートHTMLにあるBootstrap CSSクラスを使用するには、
`bootstrap` CSSスタイルシートを`styles.css`の先頭に追加します:


<code-example path="reactive-forms/src/styles.1.css" title="styles.css" linenums="false">

</code-example>

これですべての点が線のようにつながりました。アプリを立ち上げてみましょう:

<code-example language="sh" class="code-shell">

  ng serve

</code-example>

ブラウザには次のような内容が表示されます:


<figure>
  <img src="generated/images/guide/reactive-forms/just-formcontrol.png" alt="Single FormControl">
</figure>

{@a formgroup}

## FormGroupを追加する
通常、複数の`FormControl`がある場合は、
それらを親の`FormGroup`内に登録します。
`FormGroup`を追加するには、
`hero-detail.component.ts`のimportsセクションに追加します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

このクラスでは、次のように `FormControl`を`heroForm`という名前の `FormGroup`にラップします:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.ts" region="v2" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

クラスを変更したので、テンプレートにも変更を反映する必要があります。
`hero-detail.component.html`を次のように置き換えて更新してください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.html" region="basic-form" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

単一の `<input>`が `<form>`要素の中にあることに注目してください。

`formGroup`はリアクティブフォームのディレクティブであり、既存の
`FormGroup`インスタンスとHTML要素を関連付けます。
この場合、`heroForm`として保存した`FormGroup`を
`<form>`要素で関連付けています。

クラスに`FormGroup`が追加されたので、`<input>`を
コンポーネントクラスの対応する`FormControl`に関連付けるために
テンプレート構文を更新する必要があります。
親`FormGroup`がなければ、
`[formControl]="name"`はそのディレクティブが単独で実行できる、
つまり`FormGroup`に属さずに動作するため、先ほどは動作しました。
親に`FormGroup`がある場合、
`<input>`という名前はクラスの正しい`FormControl`に関連付けられるように、
`formControlName=name`という構文が必要です。
この構文では、親`FormGroup`（この場合は`heroForm`）を検索し、
そのグループ内で`name`という名前の
`FormControl`を検索するようにAngularに指示します。


{@a json}

## フォームモデルの中身を表示する

ユーザーが`<input>`にデータを入力すると、その値は**_フォームモデル_**に入ります。
フォームモデルを表示するには、
`hero-detail.component.html`の`<form>`の閉じタグの後に、
次の行を追加します:


<code-example path="reactive-forms/src/app/hero-detail/hero-detail-2.component.html" region="form-value-json" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>


`heroForm.value`は _フォームモデル_ を返します。
`JsonPipe`パイプを用いることで、モデルはJSONとしてブラウザ上でレンダリングされます:


<figure>
  <img src="generated/images/guide/reactive-forms/json-output.png" alt="JSON output">
</figure>

最初の `name`プロパティ値は空文字列です。
`<input>`という名前をタイプして、キーストロークに応じてJSONが表示されるのを見てください。

これにより、実アプリではフォームの開発が効率化できます。
`FormBuilder`は、フォームの開発とメンテナンスを容易にします。


{@a formbuilder}

## `FormBuilder` の紹介

`FormBuilder` クラスを用いることで、コントロールの作成の詳細を纏めて処理できます。
これにより、繰り返し作業や実装上の混乱を減らすことができます。

`FormBuilder`を使うには、`hero-detail.component.ts`に`FormBuilder`をインポートします。また、`FormControl`を削除することができます:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3a.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

次の方針で`HeroDetailComponent`をリファクタリングして、
コードの読み書きが容易なものにできます:

* `heroForm`プロパティの型を`FormGroup`と明示的に宣言します。あとでそれを初期化します。
* コンストラクタに `FormBuilder` を注入します。
* `FormBuilder`を使って`heroForm`を定義する新しいメソッド（`createForm()`）を追加します。
* コンストラクタで `createForm()`を呼び出します。

リファクタされた`HeroDetailComponent`は次のようになります:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3a.component.ts" region="v3a" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`FormBuilder.group`は`FormGroup`を作成するファクトリーメソッドです。&nbsp;
`FormBuilder.group`は、キーと値が`FormControl`名とその定義であるオブジェクトを取ります。
この例では、`name`コントロールは初期データ値で定義され、空の文字列です。

単一のオブジェクトにコントロールのグループを定義すると、`new FormControl(...)`ステートメントを繰り返し記述する必要がないため、コードがよりコンパクトで読みやすくなります。

{@a validators}

### `Validators.required`
このガイドではバリデーションに深く解説しませんが、以下はリアクティブフォームで
必須バリデータ（`Validators.required`）を使うのが簡単であることを紹介しています。

まずはじめに、`Validators`シンボルをインポートします。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`name` `FormControl`を必須にするには、
`FormGroup`の`name`プロパティを配列に置き換えます。
最初の項目は`name`の初期値です。
2番目の項目は必要なバリデータ、`Validators.required`です。


<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3.component.ts" region="required" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



<div class="l-sub-section">

リアクティブバリデータはシンプルで構成可能な関数です。
バリデーションの設定はテンプレート駆動フォームの場合と異なり、バリデータをディレクティブでラッピングする必要はありません。

</div>

テンプレートの下部にあるデバッグ用メッセージを更新して、フォームのバリデーションステータスを表示してみましょう。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-3.component.html" region="form-value-json" title="src/app/hero-detail/hero-detail.component.html (excerpt)" linenums="false">

</code-example>

ブラウザには次のように表示されます:

<figure>
  <img src="generated/images/guide/reactive-forms/validators-json-output.png" alt="Single FormControl">
</figure>

`Validators.required`が動作しています。`<input>`に値がないので、ステータスは`INVALID`です。
`<input>`フィールドになにか入力して、ステータスが`INVALID`から`VALID`に変化するのを確認してください。

実際のアプリでは、このデバッグ用メッセージはよりユーザーフレンドリーなメッセージに置き換えください。

`Validators.required`の使用は、残りのガイドではオプションです。
同じ構成の次の各例にとどまります。

Angularフォームのバリデーションについての詳細は、
[フォームバリデーション](guide/form-validation) のガイドを参照ください。

### `FormControl` をもっと知る

ここまではヒーローの名前をフォームにセットしましたが、このセクションでは、住所、スーパーパワー、およびサイドキックという追加の`FormControl`をヒーローフォームに追加してみましょう。

住所は州プロパティを持ちます。ユーザーは`<select>`で州を選択します。
そしてあなたは複数の州について`<option>`要素を配置します。したがって、`data-model.ts`から`states`をインポートしてください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-4.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

`states`プロパティを宣言し、いくつかの住所`FormControls`を`heroForm`に次のように追加してください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-4.component.ts" region="v4" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

次に、対応するマークアップを`hero-detail.component.html`に次のように追加します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-4.component.html" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

<div class="alert is-helpful">

*注意*: マークアップ内で `form-group`、
`form-control`、`center-block`、`checkbox` というクラス名を記述していますが、
これらは _bootstrap_ のCSSクラスであり、Angular自身は無視します。
`[formGroup]`と`formControlName`属性に注意してください。
Angularディレクティブは、HTMLコントロールをコンポーネントクラスの
Angular `FormGroup`および`FormControl`プロパティにバインドします。

</div>

修正されたテンプレートには、さらにテキスト`<input>`要素、`state`のための `<select> `プルダウンメニュー、`power`のためのラジオボタン、
そして`sidekick`の`<checkbox>` が追加されています。

`<option>`のvalueプロパティには`[value]="state"`でバインドする必要があります。
値をバインドしないと、selectにはデータモデルの最初のオプションが表示されます。

コンポーネント_クラス_ は、テンプレート内の表現に関係なくコントロールプロパティを定義します。
`name`コントロールを定義したのと同じ方法で、`state`、`power`、`sidekick`コントロールを定義します。
同様の方法でこれらのコントロールをテンプレートHTML要素に結びつけ、
`FormControlName`ディレクティブで`FormControl`名を指定します。

詳細については、
[radio buttons](api/forms/RadioControlValueAccessor "API: RadioControlValueAccessor")、
[selects](api/forms/SelectControlValueAccessor "API: SelectControlValueAccessor")、
[checkboxes](api/forms/CheckboxControlValueAccessor "API: CheckboxControlValueAccessor")の各APIリファレンスを参照してください。



{@a grouping}


### 入れ子になったFormGroups

肥大化していくフォームをより効率良く管理するために、
関連する`FormControl`のいくつかを`FormGroup`の中にまとめてグループ化するという方法があります。
たとえば、`street`、`city`、`state`、`zip`といったプロパティは、address `FormGroup`としてグループ化するのが理想的です。
このようにグループとコントロールをネストすると、データモデルの階層構造をミラー化し、
関連する一連のコントロールのバリーデションステータスのトラッキングに役立ちます。

`FormBuilder`を使用して、このコンポーネントの`heroForm`という名前の`FormGroup`を作成しました。
これを親の`FormGroup`としましょう。
`FormBuilder`をもう一度使って`address`コントロールをカプセル化した子 `FormGroup`を作ります。
親`FormGroup`の新しい`address`プロパティに結果を代入してください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.ts" region="v5" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



コンポーネントクラスのフォームコントロールの構造を変更すると、
コンポーネントテンプレートに対応する修正を行う必要があります。

`hero-detail.component.html`では、住所関連の`FormControls`を`<div>`にラップします。
`formGroupName`ディレクティブを`div`に追加し、それを`address`でバインドします。
これは、`heroForm`という親の`FormGroup`内にある`address`プロパティ（子`FormGroup`）を指しています。あと、`name` `<input>` が入った`<div>`を切り離しましょう。

この変更を視覚的に明白にするために、先頭に`<h4>`要素を追加して _Secret Lair_ というテキストを付けましょう。
住所が入力できるようになった新しいHTMLは、次のようになります:


<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.html" region="add-group" title="src/app/hero-detail/hero-detail.component.html (excerpt)" linenums="false">

</code-example>


これらの変更によって、ブラウザのJSON出力は、
ネストされた address `FormGroup` を含むフォームモデルが表示されます:

<figure>
  <img src="generated/images/guide/reactive-forms/address-group.png" alt="JSON output">
</figure>

これにより、テンプレートとフォームモデルが
互いに結びついていることが確認できます。

{@a properties}

## `FormControl` プロパティを検証する

フォーム内の個々の`FormControl`をチェックするには、
`get() `メソッドを使ってフォームを抽出します。
これをコンポーネントクラス内で行うこともできますし、
テンプレートの `{{form.value | json}}` インターポレーションの直後に、次のように追加して表示することもできます:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.html" region="inspect-value" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

`FormGroup`内にある`FormControl`の状態を取得するには、ドット記法を使用してコントロールを取得します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-5.component.html" region="inspect-child-control" title="src/app/hero-detail/hero-detail.component.html" linenums="false">

</code-example>

<div class="alert is-helpful">

*注意*: もしあなたがこのガイドを読みながらコーディングしているなら、`FormArray`のセクションを進める前に上記で記述した`address.street`への参照を削除してください。そのセクションでは、コンポーネントクラスのaddressプロパティ名を変更する修正を行うため、このままテンプレート内に残しておくとエラーになります。

</div>

このテクニックを使って、
次のいずれかのような`FormControl`のプロパティを表示することができます:

<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="10%">

  </col>

  <col width="90%">

  </col>

  <tr>

    <th>
      プロパティ
    </th>

    <th>
      説明
    </th>

  </tr>

  <tr>

    <td>
      <code>myControl.value</code>
    </td>

    <td>


      `FormControl`の値。
    </td>

  </tr>

  <tr>

    <td>
      <code>myControl.status</code>
    </td>

    <td>


      `FormControl`のバリデーション状態。 `VALID`、
       `INVALID`、`PENDING`、`DISABLED`のいずれかの値が入ります。
    </td>

  </tr>

  <tr>

    <td>
      <code>myControl.pristine</code>
    </td>

    <td>


      ユーザーがUIの値を変更していない場合は、`true`を返します。
      `myControl.dirty`はこれとは反対の値を返します。
    </td>

  </tr>

  <tr>

    <td>
      <code>myControl.untouched</code>
    </td>

    <td>


      ユーザーがまだ当該HTMLコントロールに入っていない状態でblurイベントがトリガーされた場合に`true`を返します。
      これの反対の動きをするのが`myControl.touched`になります。

    </td>

  </tr>

</table>



他の`FormControl`プロパティについては、
[_AbstractControl_](api/forms/AbstractControl) API リファレンスをご参照ください。

`FormControl`プロパティを検証する一般的な理由の1つとして、
ユーザーが有効な値を入力したことを確認できるためです。
Angular フォームのバリデーションについての詳細については、
[フォームバリデーション](guide/form-validation) ガイドをご覧ください。

{@a data-model-form-model}

## データモデルとフォームモデル

現時点では、フォームは空の値を表示しています。
`HeroDetailComponent`はヒーローの値を表示する必要があります。
ヒーローは、おそらくリモートサーバーから取得したヒーローです。

このアプリでは、`HeroDetailComponent`は親の`HeroListComponent`からヒーローを取得します。

これより、サーバーから受け取った `hero` オブジェクトのことを **_データモデル_** と記しています。
`FormControl` の構造のことを **_フォームモデル_** と記しています。

コンポーネントは、データモデルのヒーロー値をフォームモデルにコピーする必要があります。
これには重要な意味合いが2つあります:

1. 開発者は、データモデルのプロパティがフォームモデルのプロパティにどのように
マッピングされるかを理解する必要があります。

2. ユーザーが行った変更は、DOM要素からフォームモデルに流れます。データモデルには流れません。

フォームコントロールは _データモデル_ を更新しません。

フォームとデータモデル構造は正確に一致する必要はありません。
特定の画面にデータモデルのサブセットを提示することがよくあります。
しかし、フォームモデルの形状がデータモデルの形状に近いと、作業が簡単になります。

この`HeroDetailComponent`では、2つのモデルが非常に近いです。

`data-model.ts`の`Hero`と`Address`の定義は次のとおりです:

<code-example path="reactive-forms/src/app/data-model.ts" region="model-classes" title="src/app/data-model.ts (classes)" linenums="false">

</code-example>

ここでもまた、コンポーネントの`FormGroup`定義があります:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="hero-form-model" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



これらのモデルには2つの大きな違いがあります:

1. `Hero`には`id`があります。フォームモデルは、一般的にユーザーに対してプライマリキーを表示することはありません。

1. `Hero`にはaddressesという配列があります。現時点ではこのフォームモデルは1つの住所しか提示しませんが、
配列を考慮した実装については [`FormArray`](guide/reactive-forms#form-array "Form arrays") のセクションで後述します。

2つのモデルを近い形に保つことで、次のセクションで解説する`patchValue()`と`setValue()`メソッドを使って
データモデルのプロパティをフォームモデルにコピーすることが容易になります。


まず、次のように`address` `FormGroup`定義をリファクタリングしてください:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>


`Hero`クラスと`Address`クラスを参照できるように`data-model`から`import`するように修正してください:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="import-address" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

{@a set-data}

## `setValue()` と `patchValue()` を用いてフォームモデルを作成する

<div class="alert is-helpful">

*注意*: もしいまこの解説を読みながらコーディングしている場合、残りのステップがこのセクションに依存していないため、このセクションはオプションコンテンツです。

</div>

これまでの解説では、コントロールを作成すると同時に値を初期化していましたが、
初期化後に `setValue()`と`patchValue()`メソッドを用いて
値を初期化またはリセットすることもできます。

### `setValue()`
`setValue()`では、すべてのフォーム制御値を一度に割り当てます。
`FormGroup`の背後にあるフォームモデルと完全に一致するプロパティをもつデータオブジェクトを渡します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="set-value" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

`setValue()`メソッドは、フォームコントロールの値を割り当てる前にデータオブジェクトを完全にチェックします。

`FormGroup`構造と一致しないデータオブジェクトを受け入れることも、
グループ内の任意のコントロールの値が欠けていることもあります。このようにして、
タイプミスがあったり、コントロールが正しく入れ子になっていなかった場合は、役に立つエラーメッセージが返されます。
反対に、`patchValue()`は何も発さずに失敗します。

`hero`の構造は、コンポーネントの`FormGroup`の構造と似ているので、
`hero`を`setValue()`の引数としてそのまま使うことができます。

ヒーローの最初の1件目の住所のみを表示することができますが、データオブジェクト引数の `address`プロパティの条件設定のように、`hero`にアドレスがまったく含まれていない可能性を考慮する必要があります:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="set-value-address" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>



### `patchValue()`
**`patchValue()`** を使うと、`FormGroup`内の特定のコントロールに対して、
キーと値のペアのオブジェクトを渡すことで、値をセットすることができます。

次の例では、フォームの`name`コントロールのみをセットします。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="patch-value" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`patchValue()`を使うと、発散するデータやフォームモデルに柔軟に対応できます。
しかし、`patchValue()`はセット時にコントロール値の欠落をチェックできないため、
`setValue()`のように有用なエラーを投げることはありません。


{@a hero-list}

## `HeroListComponent`と`HeroService`を作成する

リアクティブフォームのさらなる使い方とテクニックを知るために、`HeroListComponent`と`HeroService`を追加していきます。リアクティブフォームの便利さは、このサンプルにもっと多くの機能を追加することで感じとれるでしょう。

`HeroDetailComponent`は、 _master/detail_ ビュー内の`HeroListComponent`のネストされたサブコンポーネントです。両者は次のようになっています:


<figure>
  <img src="generated/images/guide/reactive-forms/hero-list.png" alt="HeroListComponent">
</figure>


まず、次のコマンドで`HeroListComponent`を追加します：

<code-example language="sh" class="code-shell">

  ng generate component HeroList

</code-example>

`HeroListComponent` に次の記述を行います:

<code-example path="reactive-forms/src/app/hero-list/hero-list.component.ts" title="hero-list.component.ts" linenums="false">

</code-example>


次に、次のコマンドを実行して`HeroService`を追加します:

<code-example language="sh" class="code-shell">

  ng generate service Hero

</code-example>

そして、次のように記述します:

<code-example path="reactive-forms/src/app/hero.service.ts" title="hero.service.ts" linenums="false">

</code-example>

`HeroListComponent`は、注入された`HeroService`を使ってサーバーからヒーローを取得し、
そのヒーローを一連のボタンとしてユーザーに提示します。
`HeroService`はHTTPサービスをエミュレートしています。
アプリケーションは必然的に非同期の性質があることを視覚的に示すために、
ネットワークのレイテンシーをシミュレートした上で、
短期間で解決するヒーローの`Observable`を返しています。

ユーザーがヒーローをクリックすると、
コンポーネントは `HeroDetailComponent`の`hero` `@Input()`プロパティにバインドされた
`selectedHero`プロパティをセットします。
`HeroDetailComponent`側ではヒーローの変更が検知がなされるため、
そのヒーローのデータ値でフォームをリセットします。

Refreshボタンはヒーローリストと現在選択されているヒーローをクリアしてからヒーロー情報を更新します。

`hero-list.component.ts`は、`Observable`と`finally`をインポートし、`hero.service.ts`は`Observable`、`of`、
`delay`を`rxjs`からインポートします。

残りのHeroListComponentとHeroService実装の詳細については、このチュートリアルで扱う範囲を超えてしまいますが、
関連するテクニックについては _Tour of Heroes_ ドキュメンテーションの
[こちら](tutorial/toh-pt3 "ToH: Multiple Components")や[こちら](tutorial/toh-pt4 "ToH: Services")で解説しています。

`HeroService`を使うには`AppModule`でインポートし、それを`providers`配列に追加します。`HeroListComponent`を使用するには、それをインポートし、宣言してエクスポートします:

<code-example path="reactive-forms/src/app/app.module.ts" region="hero-service-list" title="app.module.ts (excerpts)" linenums="false">

</code-example>


次に、`HeroListComponent`テンプレートを次のように修正します：

<code-example path="reactive-forms/src/app/hero-list/hero-list.component.html" title="hero-list.component.html" linenums="false">

</code-example>

これらの変更は`AppComponent`テンプレートに反映される必要があります。 `app.component.html`の内容を`HeroDetailComponent`の代わりに`HeroListComponent`を使うために更新されたマークアップで置き換えてください:

<code-example path="reactive-forms/src/app/app.component.html" title="app.component.html" linenums="false">

</code-example>


最後に、`HeroDetailComponent`に`@Input()`プロパティを追加すると、
`HeroDetailComponent`は`HeroListComponent`からデータを受け取ることができます。JavaScriptインポートのリストの `@angular/core` `import`文に`Input`シンボルを追加することを忘れないでください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="hero" title="hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

これでヒーローとフォームレンダリングのボタンをクリックできるようになりました。

## いつフォームモデル値（`ngOnChanges`）を設定するか

フォームモデル値をセットするタイミングは、コンポーネントがデータモデル値を取得するタイミングによって異なります。

`HeroListComponent`はヒーロー名をユーザーに表示します。
ユーザーがヒーローをクリックすると、`HeroListComponent`は`hero` `@Input()`プロパティにバインドすることによって、選択されたヒーローを`HeroDetailComponent`に渡します。

<code-example path="reactive-forms/src/app/hero-list/hero-list.component.1.html" title="hero-list.component.html (simplified)" linenums="false">

</code-example>


このアプローチでは、ユーザーが新しいヒーローを選択するたびに、
`HeroDetailComponent`の`hero`の値が変わります。
[ngOnChanges](guide/lifecycle-hooks#onchanges) ライフサイクルフックを使用して`setValue()`を呼び出すことができます。
これで `@Input()` `hero`プロパティが変更されたときに呼び出されます。

### フォームをリセットする

まず`hero-detail.component.ts`に`OnChanges`シンボルをインポートします。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-6.component.ts" region="import-input" title="src/app/hero-detail/hero-detail.component.ts (core imports)" linenums="false">

</code-example>

次に`HeroDetailComponent`が`OnChanges`を実装していることをAngularに知らせます:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="onchanges-implementation" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>


次のように`ngOnChanges`メソッドをクラスに追加します:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="ngOnChanges" title="src/app/hero-detail/hero-detail.component.ts (ngOnchanges)" linenums="false">

</code-example>

`rebuildForm()`を呼び出していることに注目してください。これで値をセットしています。今回は`rebuildForm()`というメソッド名にしましたが、あなたに合ったメソッド名を付けることができます。
これはAngular内部に組み込まれているメソッドではありませんが、`ngOnChanges`ライフサイクルフックを効果的に活用するために作成したメソッドです。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="rebuildForm" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

`rebuildForm()`メソッドは2つのことを行います。ヒーローの名前と住所をリセットします。

{@a form-array}

## _FormArray_ を使用して`FormGroup`の配列を提示する
`FormGroup`は、そのプロパティの値が`FormControl`と他の`FormGroup`で構成される、名前付きオブジェクトです。

場合によっては、任意の数のコントロールやグループを表示する必要があります。
たとえば、ヒーローの住所は、0、1、または任意の数の住所をもつことができます。

`Hero.addresses`プロパティは`Address`インスタンスの配列です。
`address` `FormGroup`は、1つの`Address`を表示することができます。
Angular `FormArray`は、`address` `FormGroup`の配列を表示できます。

`FormArray`クラスにアクセスするには、`hero-detail.component.ts`に`FormArray`クラスをインポートします:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="imports" title="src/app/hero-detail/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

`FormArray`を操作するには、次のようにします:

1. 配列内の項目を定義します。つまり、`FormControl`または`FormGroup`です。

1. データモデル内のデータから作成された項目を使用して、配列を初期化します。

1. ユーザーが必要とするアイテムを追加・削除します。

`Hero.addresses`のために`FormArray`を定義して、
ユーザーが住所を追加したり変更したりできるようにします。

そうなると、`HeroDetailComponent` `createForm()`メソッドでフォームモデルを再定義する必要が生じます。
現在、`address`は`FormGroup`なので、住所は1つしか表示できません:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

### `address` から `secretLairs` に変更する

ユーザーの視点から見ると、ヒーローには _住所_ なんてものはありません。
ヒーローの住所なんて言ってしまうと、ヒーローは死ぬ運命にあるようなものなので、ここでは _隠れ家_ が適切でしょう！
`FormGroup`として定義したaddressを、`secretLairs` `FormArray`定義に置き換えましょう:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="secretLairs-form-array" title="src/app/hero-detail/hero-detail-8.component.ts" linenums="false">

</code-example>

`hero-detail.component.html`では、`formArrayName="address"`を`formArrayName="secretLairs"`に変更します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="form-array-name" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

<div class="alert is-helpful">

フォームコントロール名を `address`から`secretLairs`に変更することは重要なポイントです。
_フォームモデル_ は _データモデル_ と一致させる必要はありません。

明らかに両者の間には関係がないといけません。
しかし、それはアプリケーションドメイン内で意味を成すものであれば何でも構いません。

_プレゼンテーション_ 要件は _データ_ 要件と異なる場合があります。
リファクティブフォームのアプローチは、この区別を強調し容易にします。

</div>

### `secretLairs` _FormArray_ を初期化する

デフォルトのフォームには、住所のない名前のないヒーローが表示されます。

親`HeroListComponent`が`HeroDetailComponent.hero` `@Input()` プロパティを新しい`Hero`にセットするたびに、
`secretLairs`に実際のヒーローの住所をセットする（または再セットする）メソッドが必要です。

次の`setAddresses()`メソッドは`secretLairs` `FormArray`を新しい`FormArray`に置き換えます。
ヒーローアドレス`FormGroup`の配列で初期化されます。これを `HeroDetailComponent`クラスに追加します:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="set-addresses" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

以前の `FormArray`を`setValue()`ではなく`FormGroup.setControl()`メソッドで
置き換えることに注目してください。 
コントロールの _値_ ではなく _コントロール_ 自体を置き換えています。

`secretLairs` FormArrayには`FormGroup`が含まれています。`Addresses`ではありません。

次に、`rebuildForm()`の中から`setAddresses()`を呼び出します:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="rebuildform" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>


### _FormArray_ を取得する
`HeroDetailComponent`は、`secretLairs` `FormArray`からアイテムを表示、追加、および削除することができるはずです。

当該`FormArray`への参照を取得するには、`FormGroup.get()`メソッドを使います。
明快さと再利用性を考慮して、式を`secretLairs`という都合のよいプロパティで囲みます。`HeroDetailComponent`に以下を追加してください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="get-secret-lairs" title="src/app/hero-detail/hero-detail.component.ts (secretLairs property)" linenums="false">

</code-example>

### _FormArray_ を表示する

現在のHTMLテンプレートは、1つの`address` `FormGroup`しか表示できません。
ヒーローの `address` `FormGroup` が複数表示できるように修正していきます。

主な修正としては、これまでマークアップしたテンプレートHTMLの住所にある `<div>`をラップするかたちで、
`<div>`と`*ngFor`を繰り返すことです。

`*ngFor`を書くときには3つのポイントがあります:

1. `<div>`と`*ngFor`を使って、別のラッピング`<div>`を追加し、
`formArrayName`ディレクティブを`secretLairs`にセットしてください。
このステップは、繰り返されるHTMLテンプレート内のフォームコントロールのコンテキストとして`secretLairs` `FormArray`を確立します。

1. 繰り返される項目のソースは、FormArray自体ではなく、`FormArray.controls`です。
各コントロールは `address` `FormGroup`です。これはまさに以前の（今度は繰り返された）テンプレートHTMLが期待しているものです。

1. 繰り返される `FormGroup`は一意の`formGroupName`を必要とします。これは `FormArray`の`FormGroup`のインデックスでなければなりません。
このインデックスを再利用して、各アドレスの一意のラベルを作成します。

HTMLテンプレートの隠れ家セクションの骨組みは次のとおりです:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="form-array-skeleton" title="src/app/hero-detail/hero-detail.component.html (*ngFor)" linenums="false">

</code-example>

ここに隠れ家のセクションの完全なテンプレートがあります。これを`HeroDetailComponent`テンプレートに追加し、`forGroupName=address` `<div>`を置き換えてください:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="form-array" title="src/app/hero-detail/hero-detail.component.html (excerpt)">

</code-example>



### 新しいフォームを _FormArray_ に追加する

`addLair()`メソッドを追加して、`secretLairs` `FormArray`を取得し、新しい`address` `FormGroup`を追加します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="add-lair" title="src/app/hero-detail/hero-detail.component.ts (addLair method)" linenums="false">

</code-example>

フォーム上にボタンを置くと、ユーザーは新しい _secret lair_ を追加し、それをコンポーネントの `addLair()` メソッドに結びつけることができます。これを`secretLairs` `FormArray`の`</div>`の直前に置きます。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.html" region="add-lair" title="src/app/hero-detail/hero-detail.component.html (addLair button)" linenums="false">

</code-example>

<div class="alert is-important">

button要素のtype属性はデフォルト値が "submit" なので、
必ず `type="button"` を追加してください。
type属性を指定せずに、あとでフォーム送信アクションを実装すると、
すべてのボタンが送信アクションをトリガーすることになり、現在の変更を保存するようなことが起こります。
ユーザーが _Add a Secret Lair_ ボタンをクリックしたタイミングでは、ユーザーの変更を保存する必要はありません。

</div>

### 試してみましょう！

ブラウザに戻り、"Magneta"という名前のヒーローを選択します。
フォームの下部にあるデバッグ用JSONに表示されているように、"Magneta"には住所はありません。

<figure>
  <img src="generated/images/guide/reactive-forms/addresses-array.png" alt="JSON output of addresses array">
</figure>


"_Add a Secret Lair_" ボタンをクリックします。
新しいアドレスセクションが表示されましたね。よくできました！

### 隠れ家を削除する

この例では隠れ家の住所を _追加_ できますが、 _削除_ はできません。
これ以上詳説はしませんが、さらに頑張るなら、`removeLair`メソッドを記述し、各address HTML上にボタンを設置します。

{@a observe-control}

## コントロールの変更を監視する

Angularは、ユーザーが親`HeroListComponent`のヒーローを選んだタイミングで`ngOnChanges()`を呼び出します。
ヒーローを選ぶと、`HeroDetailComponent.hero` `@Input() `プロパティが変更されます。

Angularは、ユーザーがヒーローの `name`または`secretLairs`を変更したときに`ngOnChanges()`を呼び出すことはありません。
幸いにも、変更イベントを発生させる`FormControl`プロパティの1つにサブスクライブすることによって、
変更を知ることができます。

これらはRxJS`Observable`を返す`valueChanges`のようなプロパティです。
フォームコントロールの値を監視するためにRxJS`Observable`について多くのことを知る必要はありません。

`name``FormControl`の値に変更を記録するには、次のメソッドを追加します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="log-name-change" title="src/app/hero-detail/hero-detail.component.ts (logNameChange)" linenums="false">

</code-example>

コンストラクタの`createForm()`のあとで呼び出します。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail-8.component.ts" region="ctor" title="src/app/hero-detail/hero-detail.component.ts" linenums="false">

</code-example>

`logNameChange()`メソッドは、名前変更値を `nameChangeLog` 配列にプッシュします。
この`*ngFor`バインディングを使って、コンポーネントテンプレートの最下部に配列を表示してみましょう:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.html" region="name-change-log" title="src/app/hero-detail/hero-detail.component.html (Name change log)" linenums="false">

</code-example>



ブラウザに戻り、ヒーローを選択します。たとえば、Magnetaを選択し、`name` `<input> `への入力を開始します。
各キーストローク後にログに新しい名前が表示されます。

### 使うタイミング

補間バインディングは、名前の変更を表示する簡単な方法です。
観察可能な`FormControl`プロパティをサブスクライブすることは、
コンポーネントクラス内のアプリケーションロジックをトリガするのに便利です。

{@a save}

## フォームデータを保存する

`HeroDetailComponent`はユーザー入力を取得できるようになりましたが、現時点では取得しただけで何もしていません。
実際のアプリでは、ヒーローの変更を保存したり、保存されていない変更を元に戻したり、編集を再開することができるはずです。
このセクションでは、保存と元に戻す機能を実装します。フォームは次のようになります:


<figure>
  <img src="generated/images/guide/reactive-forms/save-revert-buttons.png" alt="Form with save & revert buttons">
</figure>



### 保存
ユーザーがフォームを送信する時、
`HeroDetailComponent`はヒーロー _data model_ のインスタンスを、
注入された`HeroService`のsaveメソッドに渡しますようにします。`HeroDetailComponent`に以下を追加してください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="on-submit" title="src/app/hero-detail/hero-detail.component.ts (onSubmit)" linenums="false">

</code-example>

<!-- TODO: Need to add `private heroService: HeroService` to constructor and import the HeroService. Remove novalidate-->

このオリジナルのヒーローには保存前の値がありました。
ユーザーの変更はまだ _form model_ にあります。
したがって、元のヒーロー値（`hero.id`）と変更されたフォームモデル値のディープコピーの組み合わせから`prepareSaveHero()` ヘルパーを使って新しい ` hero` を作成します。


<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="prepare-save-hero" title="src/app/hero-detail/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

`HeroService`を必ずインポートしてコンストラクタに追加してください:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="import-service" title="src/app/hero-detail/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="ctor" title="src/app/hero-detail/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

<div class="l-sub-section">

**Addressのディープコピー**

`formModel.secretLairs`を`saveHero.addresses`（コメントアウトされた行を参照）に割り当てていれば、
`saveHero.addresses`配列のaddressは、
`formModel.secretLairs`の中の椅子と同じオブジェクトになります。
参照渡しにより、secretLairsへの変更は、「saveHero」のaddress.streetを変更することとなります。

`prepareSaveHero`メソッドは、フォームモデルの`secretLairs`オブジェクトが参照渡しにならないように、コピーを生成しています。


</div>



### 元に戻す（変更のキャンセル）
Revert（元に戻す）ボタンをクリックすると、ユーザーは変更をキャンセルし、フォームを元の状態に戻します。

元に戻すのは簡単です。オリジナルの変更されていない`hero`データモデルからフォームモデルを構築した`rebuildForm()`メソッドを再実行してください。

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.ts" region="revert" title="src/app/hero-detail/hero-detail.component.ts (revert)" linenums="false">

</code-example>



### ボタン
コンポーネントのテンプレートの一番上に "Save" ボタンと "Revert" ボタンを追加します:

<code-example path="reactive-forms/src/app/hero-detail/hero-detail.component.html" region="buttons" title="src/app/hero-detail/hero-detail.component.html (Save and Revert buttons)" linenums="false">

</code-example>



フォームコントロール（ `heroForm.dirty`）のいずれかの値を変更してフォームを "dirty" にするまで、ボタンは無効になっています。

`"submit"` typeが付与されたボタンをクリックすると、コンポーネントの`onSubmit`メソッドを呼び出す`ngSubmit`イベントが呼び出されます。
Revertボタンをクリックすると、コンポーネントの`revert`メソッドが呼び出されます。
これにより、ユーザーは変更を保存または元に戻すことができるようになりました。

ライブサンプル <live-example stackblitz="final" title="Reactive Forms (final) in Stackblitz"></live-example> もご参照ください。

{@a source-code}


最終バージョンのキーとなるファイルは次のとおりです:


<code-tabs>

  <code-pane title="src/app/app.component.html" path="reactive-forms/src/app/app.component.html">

  </code-pane>

  <code-pane title="src/app/app.component.ts" path="reactive-forms/src/app/app.component.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts" path="reactive-forms/src/app/app.module.ts">

  </code-pane>

  <code-pane title="src/app/hero-detail/hero-detail.component.ts" path="reactive-forms/src/app/hero-detail/hero-detail.component.ts">

  </code-pane>

  <code-pane title="src/app/hero-detail/hero-detail.component.html" path="reactive-forms/src/app/hero-detail/hero-detail.component.html">

  </code-pane>

  <code-pane title="src/app/hero-list/hero-list.component.html" path="reactive-forms/src/app/hero-list/hero-list.component.html">

  </code-pane>

  <code-pane title="src/app/hero-list/hero-list.component.ts" path="reactive-forms/src/app/hero-list/hero-list.component.ts">

  </code-pane>

  <code-pane title="src/app/data-model.ts" path="reactive-forms/src/app/data-model.ts">

  </code-pane>

  <code-pane title="src/app/hero.service.ts" path="reactive-forms/src/app/hero.service.ts">

  </code-pane>

</code-tabs>



このガイドで解説した、すべてのステップを含んだ完全なソースをダウンロードできます。
<live-example title="Reactive Forms Demo in Stackblitz">Reactive Forms Demo</live-example> のライブサンプルもご覧ください。
