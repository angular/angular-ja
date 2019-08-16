# リアクティブフォーム

*リアクティブフォーム* は、時間とともに入力値が変わるフォームを扱うためのモデル駆動なアプローチを提供します。このガイドでは、シンプルなフォームコントロールの作成と更新から、グループ内の複数コントロールの使用、フォームのバリデーション、高度なフォームの実装の方法を説明します。


{@a toc}

<live-example header="Reactive Forms in Stackblitz">リアクティブフォームのライブサンプル</live-example>をお試しください。

{@a intro}

## リアクティブフォームの紹介

リアクティブフォームは明示的でイミュータブルなアプローチを用い、特定の時点におけるフォームの状態を管理します。フォームの状態への変更の度に、変更間でのモデルの整合性を維持する新しい状態を返します。リアクティブフォームはObservableストリームを中心に構築されており、フォーム入力や値は入力値のストリームとして提供され、同期的にアクセスができます。

またリアクティブフォームでは、リクエストのデータには一貫性があり予測性が保証されているので、テストが簡単に行えます。すべてのストリームの利用者は、データに安全にアクセスし操作することができます。

リアクティブフォームはテンプレート駆動フォームとは明確に異なる点があります。リアクティブフォームは、データモデルへの同期アクセス、Observableオペレーターによる不変性、Observableストリームを通した変更監視により、多くの予測性を提供します。もしテンプレートのデータに直接アクセスして変更する場合、テンプレート駆動フォームはテンプレート内に埋め込まれたディレクティブに依存し、可変データを非同期に変更追跡するためあまり明示的ではありません。ふたつのパラダイムの詳細な比較については、[フォーム概要](guide/forms-overview)を参照してください。

## はじめる

このセクションでは、単一のフォームコントロールを追加する手順を説明します。この例では、ユーザーが入力欄に名前を入力し、その入力値を取り込み、フォームコントロール要素の現在の値を表示します。

### ステップ 1: リアクティブフォームモジュールの登録

リアクティブフォームを使うには、 `ReactiveFormsModule` を `@angular/forms` パッケージからインポートし、 NgModuleの `imports` 配列に追加します。

<code-example path="reactive-forms/src/app/app.module.ts" region="imports" header="src/app/app.module.ts (excerpt)"></code-example>

### ステップ 2: 新しいフォームコントロールの作成とインポート

コントロールのコンポーネントを生成します。

<code-example language="sh" class="code-shell">

  ng generate component NameEditor

</code-example>

`FormControl`クラスはリアクティブフォームを使う上でもっとも基本的な構成要素です。単一のフォームコントロールを登録するには、`FormControl`クラスをコンポーネントにインポートし、クラスプロパティとして保存するフォームコントロールの新しいインスタンスを作成します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control" header="src/app/name-editor/name-editor.component.ts"></code-example>

`FormControl`のコンストラクターを使い、初期値を設定します。この場合は空文字を設定しています。このコントロールをコンポーネントクラスに作ることで、フォーム入力の状態の監視、更新、バリデーションを行うことができます。

### ステップ 3: テンプレートへのコントロールの登録

コンポーネントクラスにコントロールを作成した後は、テンプレート内のフォームコントロール要素へ紐付ける必要があります。 `ReactiveFormsModule`内の`FormControlDirective`が提供する`formControl`バインディングを使い、フォームコントロールとともにテンプレートを更新します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" header="src/app/name-editor/name-editor.component.html"></code-example>

<div class="alert is-helpful">

**注:** `ReactiveFormsModule`が提供するクラスやディレクティブの詳細は、[Reactive forms API](#reactive-forms-api)を参照してください。

</div>

テンプレートバインディング構文を使うことで、フォームコントロールはテンプレート内の`name`入力要素に登録されました。フォームコントロールとDOM要素は相互に作用します。画面にモデルの変更を反映し、画面での変更をモデルに反映します。

#### コンポーネントの表示

`name`が割り当てられたフォームコントロールは、コンポーネントがテンプレートに追加すると表示されます。

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-name-editor" header="src/app/app.component.html (name editor)"></code-example>

<figure>
  <img src="generated/images/guide/reactive-forms/name-editor-1.png" alt="Name Editor">
</figure>

## コントロール値の管理

リアクティブフォームでは、その時点での状態と値へアクセスすることができます。コンポーネントクラスまたはテンプレートを通して現在の状態と値を操作することができます。次の例では、フォームコントロールのインスタンスの値の表示と変更を行います。

{@a display-value}

### フォームコントロール値の表示

次の手順で値の表示を行います:

* テンプレートの`AsyncPipe`またはコンポーネントクラスの`subscribe()`メソッドを使い、`valueChanges`を介してフォームの値の変更を監視することができます。
* `value`プロパティから現在の値のスナップショットを表示します。

次の例では、テンプレートの補間を使ってどのように現在の値を表示するのかを示します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value" header="src/app/name-editor/name-editor.component.html (control value)"></code-example>

フォームコントロール要素を更新することで、表示されている値が変更されます。

リアクティブフォームでは、各インスタンスが提供するプロパティやメソッドからコントロールへの詳細情報にアクセスすることができます。基底となっている[AbstractControl](api/forms/AbstractControl)クラスのプロパティやメソッドは、フォームの状態を制御し、バリデーションのメッセージを表示するタイミングを決めるのに使われています。さらに詳しい情報は、後述の[Simple form validation](#simple-form-validation)を参照してください。

`FormControl`の他のプロパティやメソッドについては、[Reactive forms API](#reactive-forms-api)の項目をご覧ください。

### コントロール値の置き換え

リアクティブフォームには、コントロールの値をプログラムから変更するメソッドがあり、ユーザー操作なしにコントロールの値を柔軟に更新することができます。フォームコントロールのインスタンスは`setValue()`メソッドを提供しており、フォームコントロールの値の更新や、コントロールの構造に対して与えられた値の構造の検証を行います。たとえば、バックエンドのAPIやサービスからフォームのデータを受け取った時、`setValue()`メソッドを使いコントロールを新しい値に更新し、古い値を完全に置き換えます。

次の例では、コンポーネントクラスにメソッドを追加し、`setValue()`メソッドを使ってコントロールの値を*Nancy*へ更新します。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value" header="src/app/name-editor/name-editor.component.ts (値の更新)">

</code-example>

テンプレートを更新して、名前の更新をシミュレートするボタンをつけます。**Update Name** ボタンをクリックすると、フォームコントロール要素に入力されている値が現在の値として反映されます。

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value" header="src/app/name-editor/name-editor.component.html (update value)"></code-example>

フォームモデルはコントロールのデータ源なので、ボタンをクリックするとコンポーネントクラス内で入力の値が変更され、現在の値も上書きされます。

<figure>
  <img src="generated/images/guide/reactive-forms/name-editor-2.png" alt="Name Editor Update">
</figure>

<div class="alert is-helpful">

**注:** この例では、単一のコントロールを扱っています。 `setValue()`メソッドをフォームグループやフォーム配列のインスタンスに使用した場合には、値はグループか配列の構造に合わせる必要があります。

</div>

## フォームコントロールのグループ化

フォームコントロールのインスタンスが単一の入力欄を制御したように、フォームグループのインスタンスはフォームコントロールのインスタンスのグループ（たとえばフォームなど）の状態を管理します。フォームグループインスタンス内の個々のコントロールは、フォームグループを作る時に名前で管理されます。次の例では、どのように複数のフォームコントロールインスタンスをひとつのグループで管理するのかを示します。

`ProfileEditor`コンポーネントを生成し、`FormGroup` と `FormControl`クラスを`@angular/forms`パッケージからインポートします。

<code-example language="sh" class="code-shell">

  ng generate component ProfileEditor

</code-example>

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports" header="src/app/profile-editor/profile-editor.component.ts (imports)">

</code-example>

### ステップ 1: FormGroupインスタンスを作成する

コンポーネントクラス内に`profileForm`という名前でプロパティを作成し、新しいフォームグループのインスタンスを設定します。フォームグループを初期化するには、名前付けされたキーとコントロールがマップされたオブジェクトをコンストラクターに渡します。

プロフィールのフォームには、`firstName` と `lastName`という名前のふたつのフォームコントロールのインスタンスを追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup" header="src/app/profile-editor/profile-editor.component.ts (フォームグループ)">

</code-example>

各コントロールはグループ内にいます。`FormGroup`インスタンスは、グループ内のコントロールの値をまとめたオブジェクトを、自身のモデルの値として提供します。フォームグループのインスタンスはフォームコントロールと同じプロパティ（`value` や `untouched`）、同じメソッド（`setValue()`など）を持っています。

### ステップ 2: FormGroupモデルとビューの紐付け

フォームグループは個々のコントロールの状態と変更を監視しているので、ひとつのコントロールに変更があれば、親のコントロールも新しい状態や値変更を発行します。グループのモデルはメンバーによって維持されています。モデルを定義した後、モデルをビューに反映させるようにテンプレートを更新する必要があります。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup" header="src/app/profile-editor/profile-editor.component.html (template form group)"></code-example>

フォームグループがコントロールのグループをもつように、*profile form* の`FormGroup`は`form`要素の`FormGroup`ディレクティブとバインドされ、モデルとフォームがもつinputとの間に通信レイヤーが作られることに注意してください。 `FormControlName`ディレクティブが提供する`formControlName`は、各inputと `FormGroup`内に定義されたフォームコントロールをバインドします。フォームコントロールは個々の紐付けられた要素と通信します。また、フォームグループのインスタンスへの変更のやりとりも行います。

### フォームデータの保存

`ProfileEditor`コンポーネントはユーザーから入力を受けますが、実際のシナリオでは、フォーム値を受け取りコンポーネントの外で利用したいことがあります。`FormGroup`ディレクティブは、`form`要素が発行した`submit`イベントを監視し、コールバック関数にバインドできる`ngSubmit`イベントを発行します。

`form`タグに`ngSubmit`イベントリスナーを`onSubmit()`コールバックメソッドとあわせて追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit" header="src/app/profile-editor/profile-editor.component.html (submit event)"></code-example>

`ProfileEditor`コンポーネント内の`onSubmit()`メソッドは、現在の`profileForm`の値を取得します。フォームをカプセル化したままコンポーネントの外へフォームの値を提供するには、`EventEmitter`を使用します。次の例では`console.warn`を使い、ブラウザのコンソールにメッソージを記録します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit" header="src/app/profile-editor/profile-editor.component.ts (送信メソッド)">

</code-example>

`submit`イベントはネイティブDOMイベントを使って`form`タグから発行されます。`submit`タイプのボタンをクリックすることでイベントを発火します。**Enter** キーを押して入力完了したフォームを送信することもできます。

`button`要素を使って、フォームの下にボタンを追加してフォーム送信を発火します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button" header="src/app/profile-editor/profile-editor.component.html (submit button)"></code-example>

<div class="alert is-helpful">

**注:** 上のスニペット内のボタンは、`profileForm`が無効なときにボタンを非活性にする`disabled`バインディングが付与されています。まだバリデーションを行っていないので、ボタンは常に活性になっています。単一フォームのバリデーションは、[シンプルフォームバリデーション](#simple-form-validation)のセクションを参照してください。

</div>

#### コンポーネントの表示

フォームを含む`ProfileEditor`コンポーネントを表示するために、コンポーネントテンプレートへ追加します。

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-profile-editor" header="src/app/app.component.html (profile editor)"></code-example>

`ProfileEditor`は、フォームグループインスタンス内の`firstName`と`lastName`のフォームコントロールインスタンスを管理できます。

<figure>
  <img src="generated/images/guide/reactive-forms/profile-editor-1.png" alt="Profile Editor">
</figure>

## ネストしたフォームグループの作成

複雑なフォームを作る場合、異なる分類の情報は小さいセクションに分けた方が簡単であり、いくつかの情報のグループは自然と同じグループにまとまります。ネストしたフォームグループを使うことで、巨大なフォームを小さく管理しやすく分割できます。

### ステップ 1: ネストしたグループを作成する

住所はグループ化する情報として適した例です。フォームグループは、フォームコントロールとフォームグループの両方のインスタンスを子としてもつことができます。これにより複雑なフォームモデルを構築しやすく、論理的なグループにできます。`profileForm`にネストしたグループを作るには、フォームグループインスタンスにネストした`address`要素を追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup" header="src/app/profile-editor/profile-editor.component.ts (nested form group)"></code-example>

この例では、`address group`は、既存の`firstName`と`lastName`のコントロールを、新しく`street`、`city`、 `state`、`zip`のコントロールと組み合わせます。フォームグループ内の`address`要素はフォームグループ内の`profileForm` 要素の子であっても、値や状態変更に同じルールが適用されます。ネストしたグループからの状態や値の変更は親のフォームグループに伝播し、モデル全体の一貫性を維持します。

### ステップ 2: テンプレート内のネストしたフォームのグループ化

コンポーネントクラス内のモデルを更新した後、フォームグループインスタンスと入力要素をつなげるためにテンプレートを更新します。

`street` 、 `city` 、`state` 、 `zip` フィールドを含む`address`フォームグループを`ProfileEditor`テンプレートに追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname" header="src/app/profile-editor/profile-editor.component.html (template nested form group)"></code-example>

`ProfileEditor`フォームはひとつのグループとして表示されますが、モデルは論理グループ領域を表すためにさらに分解されます。

<figure>
  <img src="generated/images/guide/reactive-forms/profile-editor-2.png" alt="Profile Editor Update">
</figure>

<div class="alert is-helpful">

**注:** フォームグループインスンタンスの値をコンポーネントテンプレート内で表示するには、`value` プロパティと `JsonPipe`を使用します。

</div>

## モデルの部分更新

複数のコントロールを含んだフォームグループインスタンスの値を更新する時、モデルの一部分のみを更新することができます。このセクションでは、フォームコントロールのデータモデルの特定部分を更新する方法を説明します。

### モデル値のパッチ

モデルの更新にはふたつの方法があります。

* `setValue()`メソッドを使い、個々のコントロールに新しい値を設定します。`setValue()`メソッドはフォームグループの構造にとても厳格で、コントロールの値全体を置き換えます。

* `patchValue()`メソッドを使い、オブジェクトに定義されているプロパティの中でフォームモデルに変更のあったプロパティを置き換えます。

`setValue()`の厳格なチェックは、複雑なフォーム内のネストしたエラーを捕捉するのに役立ちます。一方、 `patchValue()`はそのエラーがあった場合には静かに失敗します。

`ProfileEditorComponent`では、下の例にある`updateProfile`メソッドを使いfirst nameとstreet addressを更新します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value" header="src/app/profile-editor/profile-editor.component.ts (値のパッチ)">

</code-example>

ユーザープロフィールをオンデマンドで更新するためにテンプレートにボタンを追加して、更新をシミュレートします。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value" header="src/app/profile-editor/profile-editor.component.html (update value)"></code-example>

ユーザーがボタンをクリックすると、`profileForm`モデルは新しい`firstName` と `street`に更新されます。`street`は`address`プロパティ内のオブジェクトとして提供されていることに注意してください。`patchValue()`メソッドはモデル構造に沿って更新が適用されるので、これが必要です。`patchValue()`はフォームモデルに定義されたプロパティのみを更新します。

## FormBuilderを使ったフォームコントロールの作成

フォームコントロールインスタンスを手動で作成するのは、複数のフォームを扱う時は反復的になることがあります。`FormBuilder`サービスはコントロールを作成するのに便利なメソッドを提供します。

次のセクションでは、 フォームビルダーサービスを使ってフォームコントロールとフォームグループのインスタンスを作るように`ProfileEditor`コンポーネントをリファクタします。

### ステップ 1: FormBuilderクラスのインポート

`@angular/forms`パッケージから`FormBuilder`クラスをインポートします。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports" header="src/app/profile-editor/profile-editor.component.ts (インポート)">

</code-example>

### ステップ 2: FormBuilderサービスの注入

`FormBuilder`サービスは、リアクティブフォームモジュールが提供する注入できるプロバイダーです。コンポーネントのコンスタラクターに追加することで依存性を注入します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder" header="src/app/profile-editor/profile-editor.component.ts (コンストラクター)">

</code-example>

### スタップ 3: フォームコントロールの作成

`FormBuilder`は三つのメソッドを提供します: `control()`、`group()`、 `array()`。
これらは、フォームコントロール、フォームグループ、フォーム配列を含むコンポーネントクラスにインスタンスを作成するファクトリメソッドです。

`group`メソッドを使い、`profileForm`コントロールを作成します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder" header="src/app/profile-editor/profile-editor.component.ts (フォームビルダー)">

</code-example>

上記の例では、`group()`メソッドを使いモデル内のプロパティを定義しています。各コントロール名の値は配列になっており、配列の最初が初期値となっています。

<div class="alert is-helpful">

**注:** コントロールを初期値と合わせて定義できますが、コントロールに同期または非同期のバリデーションが必要な場合には、同期または非同期バリデーターを配列の2つ目と3つ目の項目に追加します。

</div>

フォームビルダーを使用する方法と、手動でインスタンスを作成する方法を比較します。

<code-tabs>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (インスタンス)">

  </code-pane>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (フォームビルダー)">

  </code-pane>

</code-tabs>

{@a simple-form-validation}

## シンプルフォームバリデーション

_フォームバリデーション_ は、ユーザー入力を検証し、入力が完了して正しいことを確認するために使います。このセクションでは、フォームコントロールにシングルバリデーターを追加し、フォーム全体の状態を表示を行います。[Form Validation](guide/form-validation)ガイドにて、より詳細なフォームバリデーションについて説明されています。

### ステップ 1: バリデーター関数のインポート

リアクティブフォームは、一般的な用途に使えるバリデーター関数のセットを含んでいます。これらの関数は、コントロールを受けてバリデーションを行い、バリデーション結果に応じてエラーオブジェクトかnullを返します。

`@angular/forms`パッケージから`Validators`クラスをインポートします。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports" header="src/app/profile-editor/profile-editor.component.ts (インポート)">

</code-example>

### Step 2: 必須フィールドを作成する

もっとも一般的なバリデーションは必須フィールドです。このセクションでは、必須バリデーションを`firstName`コントロールへ追加する方法について説明します。

`ProfileEditor`コンポーネント内で、静的な`Validators.required`メソッドを`firstName`コントロールの配列の2つ目の項目に追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator" header="src/app/profile-editor/profile-editor.component.ts (必須バリデーター)">

</code-example>

HTML5には、`required`、`minlength`、`maxlength`などのネイティブバリデーションとして使用できるビルトイン属性があります。これらのオプション属性はフォーム入力要素で使用できます。`required`属性を`firstName`入力要素に追加します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="required-attribute" header="src/app/profile-editor/profile-editor.component.html (required attribute)"></code-example>

<div class="alert is-important">

**注:** これらのHTML5バリデーション属性は、Angularのリアクティブフォームが提供するビルトインバリデーターと*組み合わせて*使用してください。これらを組み合わせて使用することで、テンプレートがチェックされた後に式が変更された時のエラーを防ぐことができます。

</div>

### フォームのステータスを表示する

必須フィールドをフォームコントロールに追加すると、初期ステータスはinvalidになります。invalidステータスは親のフォームグループ要素に伝播し、ステータスがinvalidになります。現在のフォームグループインスタンスのステータスは、`status`プロパティからアクセスします。

補間を使用して現在の`profileForm`のステータスを表示させます。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status" header="src/app/profile-editor/profile-editor.component.html (display status)"></code-example>

<figure>
  <img src="generated/images/guide/reactive-forms/profile-editor-3.png" alt="Profile Editor Validation">
</figure>

`profileForm`が`firstName`フォームコントロールの必須によってinvalidになっているため、**Submit** ボタンは非活性になっています。`firstName`を入力すると、フォームはvalidになり　**Submit** ボタンは活性になります。

フォームバリデーションについて詳細は、[フォームバリデーション](guide/form-validation)ガイドを参照してください。

## 配列を使った動的コントロール

`FormArray`は`FormGroup`で複数の名前のないコントロールを管理するときの代替手段です。フォームグループインスタンスのように、フォーム配列インスタンスへのコントロールを動的に挿入や削除ができ、フォーム配列インスタンスの値とバリデーション状態は子のコントロールから計算されます。しかし、個々のコントロールにキーの名前を定義する必要はなく、事前に子の数がわからない時に最適です。次の例は、`ProfileEditor`内の *aliases* 配列の管理する方法を説明します。

### Step 1: フォーム配列クラスのインポート

`@angular/forms`から`FormArray`クラスをインポートして、型情報として使用します。`FormBuilder`から`FormArray`インスタンスを作成することもできます。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports" header="src/app/profile-editor/profile-editor.component.ts (インポート)">

</code-example>

### Step 2: フォーム配列コントロールを定義する

フォーム配列は、0から多数の任意の数のコントロールを配列内で定義して初期化することができます。フォーム配列を定義するために、`aliases`プロパティを`profileForm`に追加します。

`FormBuilder.array()`メソッドを使い配列を定義し、`FormBuilder.control()`メソッドで配列に初期コントロールを設定します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases" header="src/app/profile-editor/profile-editor.component.ts (エイリアスフォーム配列)">

</code-example>

フォームグループインスタンス内のエイリアスコントロールは、動的に追加されるまでは単一のコントロールが設定されています。

### Step 3: フォーム配列コントロールへのアクセス

`profileForm.get()`メソッドで繰り返し各インスタンスから取得するより、ゲッターを使う方がフォーム配列インスタンス内のエイリアスに簡単にアクセスすることができます。フォーム配列インスタンスは配列内に不特定多数のコントロールを持っています。コントロールにアクセスするにはゲッターが便利です。このアプローチは追加のコントロールについて繰り返すのも簡単です。

ゲッター構文を使用して、親のフォームグループからエイリアスのフォーム配列コントロールを取得する`aliases`クラスプロパティを作ります。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter" header="src/app/profile-editor/profile-editor.component.ts (エイリアス ゲッター)">

</code-example>

<div class="alert is-helpful">

**注:** 返されたコントロールは`AbstractControl`型なので、フォーム配列インスタンスのメソッド構文にアクセスするには、明確な型を指定する必要があります。

</div>

動的にエイリアスコントロールをエイリアスのフォーム配列へ追加するメソッドを定義します。`FormArray.push()`メソッドは、配列へコントロールを新しいアイテムとして挿入します。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias" header="src/app/profile-editor/profile-editor.component.ts (エイリアスの追加)">

</code-example>

テンプレートでは、各コントロールは別々の入力フィールドとして表示されます。

### Step 4: テンプレートにフォーム配列を表示する

フォームモデルからエイリアスを付与するには、テンプレートに追加する必要があります。`FormGroupNameDirective`が提供する`formGroupName`のように、`FormArrayNameDirective`の`formArrayName`でフォーム配列インスタンスとテンプレートへの通信をバインドします。

下のテンプレートHTMLを`formGroupName`要素の`<div>`閉じタグの後に追加してください。

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname" header="src/app/profile-editor/profile-editor.component.html (aliases form array template)"></code-example>

`*ngFor`ディレクティブはエイリアスフォーム配列インスタンス内の各コントロールインスタンスを反復します。フォーム配列要素は名前がついていないため、`i`変数にインデックスを割り当て、各コントロールに渡して`formControlName`にバインドします。

<figure>
  <img src="generated/images/guide/reactive-forms/profile-editor-4.png" alt="Profile Editor Aliases">
</figure>

新しいエイリアスインスタンスが追加される度に、新しいフォーム配列インスタンスがインデックスに応じて制御されます。これにより、ルートコントロールの状態や値を計算する時に、個々のコントロールを追跡することができます。

#### エイリアスを追加する

最初は、フォームにはひとつの`Alias`フィールドのみです。別フィールドを追加するには **Add Alias** ボタンをクリックします。テンプレートの下の`Form Value`に表示されているフォームモデルにあるエイリアス配列のバリデーションもできます。

<div class="alert is-helpful">

**注:** 各エイリアスのフォームコントロールインスタンスの代わりに、追加フィールドをもつ別のフォームグループを作成することもできます。各アイテムのコントロールを定義するプロセスは同じです。

</div>

{@a appendix}

## 付録

{@a reactive-forms-api}

### リアクティブフォーム API

以下が、フォームコントロールの作成と管理に使用する基本クラスとサービスです。

#### クラス

<table>

  <tr>

    <th>
      クラス
    </th>

    <th>
      詳細
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>AbstractControl</code>
    </td>

    <td>

      具象フォームコントロールクラスである`FormControl` と `FormGroup`、`FormArray`の抽象基底クラスです。共通のふるまいやプロパティを提供します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControl</code>
    </td>

    <td>

      各フォームコントロールの値とステータスの有効性を管理します。`<input>` や `<select>`などのHTMLフォームコントロールに対応します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroup</code>
    </td>

    <td>

      `AbstractControl`インスタンスのグーループの値とステータスの有効性を管理します。グループのプロパティは子のコントロールを含んでいます。`FormGroup`がコンポーネントのトップレベルのフォームです。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArray</code>
    </td>

    <td>

    `AbstractControl`インスタンスをインデックスした配列の値とステータスの有効性を管理します。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormBuilder</code>
    </td>

    <td>

      コントロールインスタンスを作成するファクトリーメソッドを提供するインジェクト可能なサービスです。

    </td>

  </tr>  

</table>

#### ディレクティブ

<table>

  <tr>

    <th>
      ディレクティブ
    </th>

    <th>
      詳細
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlDirective</code>
    </td>

    <td>

      スタンドアローンな`FormControl`インスタンスとフォームコントロール要素を同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlName</code>
    </td>

    <td>

      `FormGroup`インスタンス内の`FormControl`とフォームコントロール要素を名前を使って同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupDirective</code>
    </td>

    <td>

      `FormGroup`とDOM要素を同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupName</code>
    </td>

    <td>

      ネストした`FormGroup`インスタンスとDOM要素と同期させます。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArrayName</code>
    </td>

    <td>

      ネストした`FormArray`インスタンスとDOM要素を同期させます。

    </td>

  </tr>

</table>
