# リアクティブフォームの概要

リアクティブフォームは、時間の経過とともに値が変化するフォーム入力の処理に、モデル駆動型のアプローチを提供します。
このガイドでは、基本的なフォームコントロールの作成と更新、複数のコントロールをグループで使用すること、フォーム値の検証、実行時にコントロールを追加または削除できる動的フォームの作成について説明します。

## リアクティブフォームの概要

リアクティブフォームは、特定の時点におけるフォームの状態を管理するために、明示的で不変のアプローチを使用します。
フォーム状態に対する各変更は、新しい状態を返します。この状態は、変更間でモデルの整合性を維持します。
リアクティブフォームは、Observableストリームに基づいて構築されています。フォーム入力と値は入力値のストリームとして提供され、同期的にアクセスできます。

リアクティブフォームは、データが要求時に一貫性があり予測可能であることが保証されるため、テストの簡単な道も提供します。
ストリームのコンシューマーは誰でも、そのデータを安全に操作できます。

リアクティブフォームは、[テンプレート駆動型フォーム](guide/forms/template-driven-forms)とは異なる方法で異なります。
リアクティブフォームは、データモデルへの同期アクセス、Observable演算子を使用した不変性、Observableストリームを使用した変更追跡を提供します。

テンプレート駆動型フォームでは、テンプレート内の直接アクセスを使用してデータを変更できますが、リアクティブフォームほど明示的ではありません。これは、テンプレートに埋め込まれたディレクティブと、変更を非同期的に追跡するミュータブルデータに依存するためです。
2つのパラダイムの詳細な比較については、[フォームの概要](guide/forms)を参照してください。

## 基本的なフォームコントロールの追加 {#adding-a-basic-form-control}

フォームコントロールを使用するには、次の3つの手順があります。

1. Generate a new component and register the reactive forms module. This module declares the reactive-form directives that you need to use reactive forms.
1. Instantiate a new `FormControl`.
1. テンプレートに `FormControl` を登録します。

次に、コンポーネントをテンプレートに追加することで、フォームを表示できます。

次の例では、単一のフォームコントロールを追加する方法を示します。
この例では、ユーザーは入力フィールドに名前を入力し、その入力値をキャプチャし、フォームコントロール要素の現在の値を表示します。

<docs-workflow>

<docs-step title="Generate a new component and import the ReactiveFormsModule">
Use the CLI command `ng generate component` to generate a component in your project and import `ReactiveFormsModule` from the `@angular/forms` package and add it to your Component's `imports` array.

<docs-code header="name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="imports" />
</docs-step>

<docs-step title="Declare a FormControl instance">
Use the constructor of `FormControl` to set its initial value, which in this case is an empty string. By creating these controls in your component class, you get immediate access to listen for, update, and validate the state of the form input.

<docs-code header="name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control"/>
</docs-step>

<docs-step title="テンプレートにコントロールを登録">
コンポーネントクラスでコントロールを作成したら、テンプレートのフォームコントロール要素に関連付ける必要があります。`ReactiveFormsModule` にも含まれている `FormControlDirective` によって提供される `formControl` バインディングを使用して、フォームコントロールをテンプレートのフォームコントロールに関連付けます。

<docs-code header="name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" />

テンプレートバインディング構文を使用することで、フォームコントロールがテンプレートの `name` 入力要素に登録されました。フォームコントロールとDOM要素は相互に通信します。ビューはモデルの変更を反映し、モデルはビューの変更を反映します。
</docs-step>

<docs-step title="コンポーネントを表示">
`name` プロパティに割り当てられた `FormControl` は、`<app-name-editor>` コンポーネントをテンプレートに追加すると表示されます。

<docs-code header="app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-name-editor"/>
</docs-step>
</docs-workflow>

### フォームコントロール値の表示

値は、次の方法で表示できます。

- `valueChanges` Observableを介して、`AsyncPipe` を使用してテンプレートで、または `subscribe()` メソッドを使用してコンポーネントクラスで、フォームの値の変更をリッスンできます。
- `value` プロパティを使用すると、現在の値のスナップショットを取得できます。

次の例では、テンプレートの補間を使用して、現在の値を表示する方法を示します。

<docs-code header="name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value"/>

表示される値は、フォームコントロール要素を更新すると変更されます。

リアクティブフォームは、各インスタンスに提供されるプロパティとメソッドを介して、特定のコントロールに関する情報にアクセスできます。
基になる [AbstractControl](api/forms/AbstractControl "API リファレンス") クラスのプロパティとメソッドは、フォームの状態を制御し、[入力検証](#validating-form-input "フォーム入力の検証について学ぶ") を処理するときにメッセージを表示するタイミングを判断するために使用されます。

[API リファレンス](api/forms/FormControl "詳細な構文リファレンス") で、他の `FormControl` プロパティとメソッドについて説明します。

### フォームコントロール値の置換

リアクティブフォームには、ユーザーの操作なしに値をプログラムで更新できる、コントロールの値をプログラムで変更するためのメソッドがあります。
フォームコントロールインスタンスは、フォームコントロールの値を更新し、提供された値の構造をコントロールの構造に対して検証する `setValue()` メソッドを提供します。
たとえば、バックエンドAPIまたはサービスからフォームデータを取得する場合は、`setValue()` メソッドを使用してコントロールを新しい値に更新し、古い値を完全に置き換えます。

次の例では、`setValue()` メソッドを使用してコントロールの値を _Nancy_ に更新するメソッドをコンポーネントクラスに追加します。

<docs-code header="name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value"/>

テンプレートに、名前の更新をシミュレートするボタンを追加します。
**名前の更新** ボタンをクリックすると、フォームコントロール要素に入力された値は現在の値として反映されます。

<docs-code header="name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value"/>

フォームモデルはコントロールの真実の源であるため、ボタンをクリックすると、コンポーネントクラス内で入力の値が変更され、現在の値が上書きされます。

HELPFUL: この例では、単一のコントロールを使用しています。
[フォームグループ](#grouping-form-controls) または [フォーム配列](#creating-dynamic-forms) インスタンスで `setValue()` メソッドを使用する場合は、値がグループまたは配列の構造と一致する必要があります。

## フォームコントロールのグループ化 {#grouping-form-controls}

フォームには、通常、いくつかの関連するコントロールが含まれています。
リアクティブフォームは、複数の関連するコントロールを単一の入力フォームにグループ化する2つの方法を提供します。

| フォームグループ | 詳細 |
|:---         |:---     |
| フォームグループ  | 一緒に管理できるコントロールの固定セットを持つフォームを定義します。このセクションでは、フォームグループの基本について説明します。また、[フォームグループのネスト](#creating-nested-form-groups "グループのネストについてさらに学ぶ") を使用して、より複雑なフォームを作成することもできます。      |
| フォーム配列  | 実行時にコントロールを追加および削除できる動的フォームを定義します。また、フォーム配列をネストして、より複雑なフォームを作成することもできます。このオプションの詳細については、[動的フォームの作成](#creating-dynamic-forms)を参照してください。 |

フォームコントロールインスタンスが単一の入力フィールドを制御するのと同じように、フォームグループインスタンスは、フォームコントロールインスタンスのグループ（たとえば、フォーム）のフォーム状態を追跡します。
フォームグループインスタンスの各コントロールは、フォームグループを作成するときに名前で追跡されます。
次の例は、単一のグループで複数のフォームコントロールインスタンスを管理する方法を示します。

`ProfileEditor` コンポーネントを生成し、`@angular/forms` パッケージから `FormGroup` と `FormControl` クラスをインポートします。

```shell
ng generate component ProfileEditor
```

<docs-code header="profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports"/>

このコンポーネントにフォームグループを追加するには、次の手順を実行します。

1. `FormGroup` インスタンスを作成します。
1. `FormGroup` モデルとビューを関連付けます。
1. フォームデータを保存します。

<docs-workflow>

<docs-step title="FormGroup インスタンスの作成">
コンポーネントクラスに `profileForm` という名前のプロパティを作成し、プロパティを新しいフォームグループインスタンスに設定します。フォームグループを初期化するには、コンストラクターに、名前付きキーのオブジェクトを、そのコントロールにマップして渡します。

プロファイルフォームの場合、`firstName` と `lastName` という名前の2つのフォームコントロールインスタンスを追加します

<docs-code header="profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup"/>

個々のフォームコントロールは、グループ内に収集されました。`FormGroup` インスタンスは、グループの各コントロールの値から縮小されたオブジェクトとしてモデル値を提供します。フォームグループインスタンスには、フォームコントロールインスタンスと同じプロパティ（`value` や `untouched` など）とメソッド（`setValue()` など）があります。
</docs-step>

<docs-step title="FormGroup モデルとビューの関連付け">
フォームグループは、その各コントロールのステータスと変更を追跡するため、コントロールのいずれかが変更されると、親コントロールも新しいステータスまたは値の変更を発行します。グループのモデルは、そのメンバーから維持されます。モデルを定義したら、テンプレートを更新して、ビューにモデルを反映する必要があります。

<docs-code header="profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup"/>

Just as a form group contains a group of controls, the _profileForm_ `FormGroup` is bound to the `form` element with the `FormGroup` directive, creating a communication layer between the model and the form containing the inputs. The `formControlName` input provided by the `FormControlName` directive binds each individual input to the form control defined in `FormGroup`. The form controls communicate with their respective elements. They also communicate changes to the form group instance, which provides the source of truth for the model value.
</docs-step>

<docs-step title="フォームデータの保存">
`ProfileEditor` コンポーネントはユーザーからの入力を受け付けますが、実際のシナリオでは、フォーム値をキャプチャして、コンポーネント外部でさらに処理できるようにする必要があります。`FormGroup` ディレクティブは、`form` 要素によって発行された `submit` イベントをリッスンし、`ngSubmit` イベントを発行します。このイベントは、コールバック関数にバインドできます。`onSubmit()` コールバックメソッドを使用して、`form` タグに `ngSubmit` イベントリスナーを追加します。

<docs-code header="profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit"/>

`ProfileEditor` コンポーネントの `onSubmit()` メソッドは、`profileForm` の現在の値をキャプチャします。`EventEmitter` を使用してフォームをカプセル化し、コンポーネント外部にフォーム値を提供します。次の例では、`console.warn` を使用して、ブラウザコンソールにメッセージをログ出力します。

<docs-code header="profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit"/>

`submit` イベントは、組み込みのDOMイベントを使用して `form` タグによって発行されます。`submit` タイプのボタンをクリックすることで、イベントをトリガーします。これにより、ユーザーは **Enter** キーを押して、完了したフォームを送信できます。

`button` 要素を使用して、フォームの最下部にボタンを追加して、フォーム送信をトリガーします。

<docs-code header="profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button"/>

前述のスニペットのボタンにも、`disabled` バインディングが付けられています。これにより、`profileForm` が無効な場合、ボタンが無効になります。まだ検証していないため、ボタンは常に有効になっています。基本的なフォーム検証については、[フォーム入力の検証](#validating-form-input) セクションを参照してください。
</docs-step>

<docs-step title="コンポーネントを表示">
フォームを含む `ProfileEditor` コンポーネントを表示するには、コンポーネントテンプレートに追加します。

<docs-code header="app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-profile-editor"/>

`ProfileEditor` を使用して、フォームグループインスタンス内の `firstName` と `lastName` コントロールのフォームコントロールインスタンスを管理できます。

### ネストされたフォームグループの作成 {#creating-nested-form-groups}

フォームグループは、個々のフォームコントロールインスタンスと、他のフォームグループインスタンスの両方を受け入れることができます。
これにより、複雑なフォームモデルの構成を、維持しやすく、論理的にグループ化できます。

複雑なフォームを構築する場合、情報のさまざまな領域を、より小さなセクションで管理する方が簡単です。
ネストされたフォームグループインスタンスを使用すると、大きなフォームグループを、より小さく、管理しやすいグループに分割できます。

より複雑なフォームを作成するには、次の手順を実行します。

1. ネストされたグループを作成します。
1. テンプレートでネストされたフォームをグループ化します。

情報のいくつかのタイプは、自然と同一のグループに分類されます。
名前と住所は、そのようなネストされたグループの典型的な例であり、次の例で使用されます。

<docs-workflow>
<docs-step title="ネストされたグループの作成">
`profileForm` にネストされたグループを作成するには、フォームグループインスタンスにネストされた `address` 要素を追加します。

<docs-code header="profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup"/>

この例では、`address group` は、現在の `firstName` と `lastName` コントロールを、新しい `street`、`city`、`state`、`zip` コントロールと組み合わせます。フォームグループの `address` 要素は、フォームグループの全体的な `profileForm` 要素の子ですが、ステータスと値の変更に関して同じルールが適用されます。ネストされたフォームグループからのステータスと値の変更は、親フォームグループに伝達され、全体的なモデルと整合性が保たれます。
</docs-step>

<docs-step title="テンプレートでネストされたフォームをグループ化">
コンポーネントクラスでモデルを更新したら、テンプレートを更新して、フォームグループインスタンスとその入力要素を接続します。`ProfileEditor` テンプレートに、`street`、`city`、`state`、`zip` フィールドを含む `address` フォームグループを追加します。

<docs-code header="profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname"/>

`ProfileEditor` フォームは、1つのグループとして表示されますが、モデルはさらに分解されて、論理的なグループ化領域を表します。

`value` プロパティと `JsonPipe` を使用して、コンポーネントテンプレートにフォームグループインスタンスの値を表示します。
</docs-step>
</docs-workflow>

### データモデルの一部を更新する

複数のコントロールを含むフォームグループインスタンスの値を更新する場合は、モデルの一部だけを更新する場合があります。
このセクションでは、フォームコントロールデータモデルの特定の部分を更新する方法について説明します。

モデル値を更新するには、次の2つの方法があります。

| メソッド        | 詳細 |
|:---            |:---     |
| `setValue()`   | 個別のコントロールに新しい値を設定します。`setValue()` メソッドは、フォームグループの構造に厳密に従い、コントロールの値全体を置き換えます。 |
| `patchValue()` | フォームモデルで変更されたオブジェクトに定義されているプロパティを置き換えます。                                                                                     |

`setValue()` メソッドの厳密なチェックは、複雑なフォームのネストエラーを検出するのに役立ちますが、`patchValue()` は、これらのエラーでサイレントに失敗します。

`ProfileEditorComponent` では、次の例を使用して、ユーザーの氏名と住所を更新する `updateProfile` メソッドを使用します。

<docs-code header="profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value"/>

テンプレートにボタンを追加して、オンデマンドでユーザープロファイルを更新することで、更新をシミュレートします。

<docs-code header="profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value"/>

ユーザーがボタンをクリックすると、`profileForm` モデルが、`firstName` と `street` の新しい値で更新されます。`street` は、`address` プロパティ内のオブジェクトで提供されることに注意してください。
これは、`patchValue()` メソッドが、モデル構造に対して更新を適用するためです。
`PatchValue()` は、フォームモデルで定義されているプロパティのみを更新します。

## FormBuilder サービスを使用してコントロールを生成する

複数のフォームを扱う場合は、手動でフォームコントロールインスタンスを作成すると、反復処理になる可能性があります。
`FormBuilder` サービスは、コントロールを生成するための便利なメソッドを提供します。

このサービスを利用するには、次の手順を実行します。

1. `FormBuilder` クラスをインポートします。
1. `FormBuilder` サービスを注入します。
1. フォームの内容を生成します。

次の例では、`FormBuilder` サービスを使用して、フォームコントロールとフォームグループインスタンスを作成し、`ProfileEditor` コンポーネントをリファクタリングする方法を示します。

<docs-workflow>
<docs-step title="FormBuilder クラスのインポート">
`@angular/forms` パッケージから `FormBuilder` クラスをインポートします。

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports"/>

</docs-step>

<docs-step title="FormBuilder サービスの注入">
`FormBuilder` サービスは、リアクティブフォームモジュールで提供される、注入可能なプロバイダーです。`inject()`関数を使ってこの依存関係を注入します。

<docs-code header="profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder"/>

</docs-step>
<docs-step title="フォームコントロールの生成">
`FormBuilder` サービスには、`control()`、`group()`、`array()` の3つのメソッドがあります。これらは、フォームコントロール、フォームグループ、フォーム配列を含む、コンポーネントクラスでインスタンスを生成するためのファクトリメソッドです。`group` メソッドを使用して、`profileForm` コントロールを作成します。

<docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder"/>

前の例では、モデルのプロパティを定義するために、同じオブジェクトを使用して `group()` メソッドを使用しています。各コントロール名の値は、配列に含まれ、初期値を配列の最初の項目として含みます。

TIP: コントロールを初期値だけで定義できますが、コントロールに同期または非同期検証が必要な場合は、配列の2番目と3番目の項目として同期バリデーターと非同期バリデーターを追加します。フォームビルダーの使用を、手動でインスタンスを作成する方法と比較します。

  <docs-code-multifile>
    <docs-code header="profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare"/>
    <docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## フォーム入力の検証 {#validating-form-input}

_フォーム検証_ は、ユーザー入力が完全で正しいことを確認するために使用されます。
このセクションでは、フォームコントロールに単一のバリデーターを追加し、フォーム全体のステータスを表示する方法について説明します。
フォーム検証については、[フォーム検証](guide/forms/form-validation) ガイドで、より詳しく説明しています。

フォーム検証を追加するには、次の手順を実行します。

1. フォームコンポーネントにバリデーター関数をインポートします。
1. フォームのフィールドにバリデーターを追加します。
1. 検証ステータスを処理するロジックを追加します。

最も一般的な検証は、フィールドを必須にすることです。
次の例では、`firstName` コントロールに必須の検証を追加し、検証の結果を表示する方法を示します。

<docs-workflow>
<docs-step title="検証子関数のインポート">
リアクティブフォームには、一般的なユースケース向けの検証子関数のセットが含まれています。これらの関数は、検証するコントロールを受け取り、検証チェックに基づいてエラーオブジェクトまたはnull値を返します。

`@angular/forms` パッケージから `Validators` クラスをインポートします。

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports"/>
</docs-step>

<docs-step title="フィールドを必須にする">
`ProfileEditor` コンポーネントで、`firstName` コントロールの配列の2番目の項目として、`Validators.required` 静的メソッドを追加します。

<docs-code header="profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator"/>
</docs-step>

<docs-step title="フォームステータスの表示">
フォームコントロールに必須フィールドを追加すると、その初期ステータスは無効になります。この無効なステータスは、親フォームグループ要素に伝達され、そのステータスが無効になります。フォームグループインスタンスの現在のステータスには、`status` プロパティを介してアクセスできます。

`profileForm` の現在のステータスを補間を使用して表示します。

<docs-code header="profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status"/>

**Submit** ボタンは無効になっています。これは、必須の `firstName` フォームコントロールのため、`profileForm` が無効になっているためです。`firstName` 入力に値を入力すると、フォームは有効になり、**Submit** ボタンが有効になります。

フォーム検証の詳細については、[フォーム検証](guide/forms/form-validation) ガイドを参照してください。
</docs-step>
</docs-workflow>

## 動的フォームの作成 {#creating-dynamic-forms}

`FormArray` は、名前のないコントロールを任意の数管理するための `FormGroup` の代替手段です。
フォームグループインスタンスと同様に、フォーム配列インスタンスにコントロールを動的に挿入および削除でき、フォーム配列インスタンスの値と検証ステータスは、その子コントロールから計算されます。
ただし、各コントロールのキーを名前で定義する必要がないため、コントロールの数があらかじめわからない場合は、このオプションが適しています。

動的フォームを定義するには、次の手順を実行します。

1. `FormArray` クラスをインポートします。
1. `FormArray` コントロールを定義します。
1. ゲッターメソッドを使用して、`FormArray` コントロールにアクセスします。
1. テンプレートにフォーム配列を表示します。

次の例では、`ProfileEditor` で _エイリアス_ の配列を管理する方法を示します。

<docs-workflow>
<docs-step title="`FormArray` クラスのインポート">
`@angular/forms` から `FormArray` クラスをインポートして、タイプ情報に使用します。`FormBuilder` サービスは、`FormArray` インスタンスを作成する準備ができています。

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports"/>
</docs-step>

<docs-step title="`FormArray` コントロールの定義">
`FormArray` を、任意の数のコントロール（0から多数）で初期化できます。これらは、配列で定義します。`profileForm` のフォームグループインスタンスに `aliases` プロパティを追加して、フォーム配列を定義します。

`FormBuilder.array()` メソッドを使用して配列を定義し、`FormBuilder.control()` メソッドを使用して配列を初期コントロールで設定します。

<docs-code header="profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases"/>

フォームグループインスタンスのエイリアスコントロールは、動的にコントロールを追加するまで、単一のコントロールで設定されます。
</docs-step>

<docs-step title="`FormArray` コントロールにアクセス">
`profileForm.get()` メソッドを繰り返し使用して各インスタンスを取得するのではなく、ゲッターは、フォーム配列インスタンスのエイリアスにアクセスできます。フォーム配列インスタンスは、配列内の未定義数のコントロールを表します。ゲッターを介してコントロールにアクセスするのは便利で、このアプローチは、追加のコントロールに対して簡単に繰り返すことができます。 <br />

ゲッター構文を使用して、`aliases` クラスプロパティを作成し、親フォームグループからエイリアスのフォーム配列コントロールを取得します。

<docs-code header="profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter"/>

返されるコントロールは `AbstractControl` 型であるため、フォーム配列インスタンスのメソッド構文にアクセスするには、明示的な型を指定する必要があります。フォーム配列にエイリアスコントロールを動的に挿入するメソッドを定義します。`FormArray.push()` メソッドは、コントロールを配列の新しい項目として挿入します。また、コントロールの配列をFormArray.push()に渡すと、複数のコントロールを一度に登録できます。

<docs-code header="profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias"/>

テンプレートでは、各コントロールが個別の入力フィールドとして表示されます。

</docs-step>

<docs-step title="テンプレートにフォーム配列を表示">

フォームモデルからエイリアスを添付するには、テンプレートに追加する必要があります。`FormGroupNameDirective` によって提供される `formGroupName` 入力と同様に、`formArrayName` は、フォーム配列インスタンスからの通信を、`FormArrayNameDirective` を使用してテンプレートにバインドします。

次のテンプレートHTMLを、`formGroupName` 要素を閉じる `<div>` の後に追加します。

<docs-code header="profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname"/>

`@for` ブロックは、エイリアスのフォーム配列インスタンスによって提供される各フォームコントロールインスタンスを反復処理します。フォーム配列要素は名前がないため、インデックスを `i` 変数に割り当て、`formControlName` 入力に渡して、各コントロールをバインドします。

新しいエイリアスインスタンスが追加されるたびに、新しいフォーム配列インスタンスに、インデックスに基づいてコントロールが提供されます。これにより、ルートコントロールのステータスと値を計算する際に、各個別のコントロールを追跡できます。

</docs-step>

### トップレベルフォーム配列での `FormArrayDirective` の使用

`FormArrayDirective` を使用して、`FormArray` を `<form>` 要素に直接バインドできます。
これは、フォームがトップレベルの `FormGroup` を使用せず、配列自体が完全なフォームモデルを表す場合に便利です。

```angular-ts
import {Component} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';

@Component({
  selector: 'form-array-example',
  template: `
    <form [formArray]="form">
      @for (control of form.controls; track $index) {
        <input [formControlName]="$index" />
      }
    </form>
  `,
})
export class FormArrayExampleComponent {
  controls = [new FormControl('fish'), new FormControl('cat'), new FormControl('dog')];

  form = new FormArray(this.controls);
}
```

<docs-step title="エイリアスの追加">

最初は、フォームには `Alias` フィールドが1つ含まれています。別のフィールドを追加するには、**エイリアスの追加** ボタンをクリックします。また、テンプレートの下部にある `Form Value` によって表示されるフォームモデルに報告されるエイリアスの配列も検証できます。各エイリアスについて、フォームコントロールインスタンスではなく、追加のフィールドを持つ別のフォームグループインスタンスを構成できます。各項目のコントロールを定義するプロセスは同じです。
</docs-step>

</docs-workflow>

## 統一されたコントロール状態変更イベント {#unified-control-state-change-events}

すべてのフォームコントロールは、`AbstractControl`（`FormControl`、`FormGroup`、`FormArray`、`FormRecord`）の `events` Observableを介して、**コントロール状態変更イベント**の単一の統一されたストリームを公開します。
この統一されたストリームにより、**value**、**status**、**pristine**、**touched**、**reset** の状態変更、および **submit** などの **フォームレベルのアクション** に反応でき、複数のObservableを配線する代わりに、1つのサブスクリプションですべての更新を処理できます。

### イベントタイプ {#event-types}

`events` によって発行される各アイテムは、特定のイベントクラスのインスタンスです。

- **`ValueChangeEvent`** — コントロールの **value** が変更されたとき。
- **`StatusChangeEvent`** — コントロールの **検証ステータス** が `FormControlStatus` 値（`VALID`、`INVALID`、`PENDING`、または `DISABLED`）のいずれかに更新されたとき。
- **`PristineChangeEvent`** — コントロールの **pristine/dirty** 状態が変更されたとき。
- **`TouchedChangeEvent`** — コントロールの **touched/untouched** 状態が変更されたとき。
- **`FormResetEvent`** — `reset()` APIまたはネイティブアクションを介してコントロールまたはフォームがリセットされたとき。
- **`FormSubmittedEvent`** — フォームが送信されたとき。

すべてのイベントクラスは `ControlEvent` を拡張し、変更を発生させた `AbstractControl` への `source` 参照が含まれます。これは大規模なフォームで便利です。

```ts
import {Component} from '@angular/core';
import {
  FormControl,
  ValueChangeEvent,
  StatusChangeEvent,
  PristineChangeEvent,
  TouchedChangeEvent,
  FormResetEvent,
  FormSubmittedEvent,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

@Component({
  /*...*/
})
export class UnifiedEventsBasicComponent {
  form = new FormGroup({
    username: new FormControl(''),
  });

  constructor() {
    this.form.events.subscribe((e) => {
      if (e instanceof ValueChangeEvent) {
        console.log('Value changed to: ', e.value);
      }

      if (e instanceof StatusChangeEvent) {
        console.log('Status changed to: ', e.status);
      }

      if (e instanceof PristineChangeEvent) {
        console.log('Pristine status changed to: ', e.pristine);
      }

      if (e instanceof TouchedChangeEvent) {
        console.log('Touched status changed to: ', e.touched);
      }

      if (e instanceof FormResetEvent) {
        console.log('Form was reset');
      }

      if (e instanceof FormSubmittedEvent) {
        console.log('Form was submitted');
      }
    });
  }
}
```

### 特定のイベントのフィルタリング {#filtering-specific-events}

イベントタイプのサブセットのみが必要な場合は、RxJS演算子を使用します。

```ts
import {filter} from 'rxjs/operators';
import {StatusChangeEvent} from '@angular/forms';

control.events
  .pipe(filter((e) => e instanceof StatusChangeEvent))
  .subscribe((e) => console.log('Status:', e.status));
```

### 複数のサブスクリプションからの統一 {#unifying-from-multiple-subscriptions}

**Before**

```ts
import {combineLatest} from 'rxjs/operators';

combineLatest([control.valueChanges, control.statusChanges]).subscribe(([value, status]) => {
  /* ... */
});
```

**After**

```ts
control.events.subscribe((e) => {
  // Handle ValueChangeEvent, StatusChangeEvent, etc.
});
```

NOTE: 値の変更時、このコントロールの値が更新された直後に発行が発生します。親コントロールの値（たとえば、このFormControlがFormGroupの一部である場合）は後で更新されるため、このイベントのコールバックから親コントロールの値（`value` プロパティを使用）にアクセスすると、まだ更新されていない値を取得する可能性があります。代わりに親コントロールの `events` をサブスクライブしてください。

## フォームコントロール状態の管理

リアクティブフォームは、**touched/untouched** と **pristine/dirty** を通じてコントロールの状態を追跡します。AngularはDOM操作中にこれらを自動的に更新しますが、プログラムで管理もできます。

**[`markAsTouched`](api/forms/FormControl#markAsTouched)** — フォーカスとブラーイベントによってコントロールまたはフォームをtouchedとしてマークし、値は変更されません。デフォルトで親コントロールに伝播します。

```ts
// ユーザーがフィールドから離れた後に検証エラーを表示
onEmailBlur() {
  const email = this.form.get('email');
  email.markAsTouched();
}
```

**[`markAsUntouched`](api/forms/FormControl#markAsUntouched)** — コントロールまたはフォームをuntouchedとしてマークします。すべての子コントロールにカスケードし、すべての親コントロールのtouchedステータスを再計算します。

```ts
// 正常な送信後にフォーム状態をリセット
onSubmitSuccess() {
  this.form.markAsUntouched();
  this.form.markAsPristine();
}
```

**[`markAsDirty`](api/forms/FormControl#markAsDirty)** — コントロールまたはフォームをdirty（値が変更された）としてマークします。デフォルトで親コントロールに伝播します。

```ts
// プログラムで変更された値を変更済みとしてマーク
autofillAddress() {
  const previousAddress = getAddress();
  this.form.patchValue(previousAddress, { emitEvent: false });
  this.form.markAsDirty();
}
```

**[`markAsPristine`](api/forms/FormControl#markAsPristine)** — コントロールまたはフォームをpristineとしてマークします。すべての子コントロールをpristineとしてマークし、すべての親コントロールのpristineステータスを再計算します。

```ts
// 保存後にpristine状態をリセットして新しい変更を追跡
saveForm() {
  this.api.save(this.form.value).subscribe(() => {
    this.form.markAsPristine();
  });
}
```

**[`markAllAsDirty`](api/forms/FormControl#markAllAsDirty)** — コントロールまたはフォームと、そのすべての子孫コントロールをdirtyとしてマークします。

```ts
// インポートされたデータをdirtyとしてマーク
loadData(data: FormData) {
  this.form.patchValue(data);
  this.form.markAllAsDirty();
}
```

**[`markAllAsTouched`](api/forms/FormControl#markAllAsTouched)** — コントロールまたはフォームと、そのすべての子孫コントロールをtouchedとしてマークします。フォーム全体に検証エラーを表示するのに便利です。

```ts
// 送信前にすべての検証エラーを表示
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.saveForm();
}
```

## イベント発行と伝播の制御

フォームコントロールをプログラムで更新する場合、フォーム階層を通じて変更を伝播する方法と、イベントを発行するかどうかを正確に制御できます。

### イベント発行の理解

デフォルトで `emitEvent: true` の場合、コントロールへの変更は `valueChanges` と `statusChanges` Observableを通じてイベントを発行します。`emitEvent: false` を設定すると、これらの発行が抑制されます。これは、自動保存のようなリアクティブな動作をトリガーせずにプログラムで値を設定する場合、コントロール間の循環更新を回避する場合、またはイベントが最後に一度だけ発行されるべき一括更新を実行する場合に便利です。

```ts
@Component({
  /* ... */
})
export class BlogPostEditor {
  postForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  constructor() {
    // ユーザーが入力するたびに下書きを自動保存
    this.postForm.valueChanges.subscribe((formValue) => {
      this.autosaveDraft(formValue);
    });
  }

  loadExistingDraft(savedDraft: {title: string; content: string}) {
    // 自動保存をトリガーせずに下書きを復元
    this.postForm.setValue(savedDraft, {emitEvent: false});
  }
}
```

### 伝播制御の理解

デフォルトで `onlySelf: false` の場合、更新は親コントロールにカスケードし、値と検証ステータスを再計算します。`onlySelf: true` を設定すると、更新が現在のコントロールに分離され、親への通知が防止されます。これは、親の更新を一度だけ手動でトリガーしたいバッチ操作に便利です。

```ts
updatePostalCodeValidator(country: string) {
  const postal = this.addressForm.get('postalCode');

  const validators = country === 'US'
    ? [Validators.maxLength(5)]
    : [Validators.maxLength(7)];

  postal.setValidators(validators);
  postal.updateValueAndValidity({ onlySelf: true, emitEvent: false });
}
```

## フォームコントロールタイプを絞り込むユーティリティ関数 {#utility-functions-for-narrowing-form-control-types}

Angularは、`AbstractControl` の具体的な型を判定するのに役立つ4つのユーティリティ関数を提供します。これらの関数は **型ガード** として機能し、`true` を返すときにコントロールタイプを絞り込むため、同じブロック内でサブタイプ固有のプロパティに安全にアクセスできます。

| ユーティリティ関数 | 詳細                                             |
| :--------------- | :-------------------------------------------------- |
| `isFormControl`  | コントロールが `FormControl` であるときに `true` を返します。 |
| `isFormGroup`    | コントロールが `FormGroup` であるときに `true` を返します    |
| `isFormRecord`   | コントロールが `FormRecord` であるときに `true` を返します   |
| `isFormArray`    | コントロールが `FormArray` であるときに `true` を返します    |

これらのヘルパーは、関数シグネチャが `AbstractControl` を受け取りますが、ロジックが特定のコントロールの種類を対象としている **カスタムバリデーター** で特に便利です。

```ts
import {AbstractControl, isFormArray} from '@angular/forms';

export function positiveValues(control: AbstractControl) {
  if (!isFormArray(control)) {
    return null; // Not a FormArray: validator is not applicable.
  }

  // Safe to access FormArray-specific API after narrowing.
  const hasNegative = control.controls.some((c) => c.value < 0);
  return hasNegative ? {positiveValues: true} : null;
}
```

## リアクティブフォームAPIの概要 {#reactive-forms-api-summary}

次の表は、リアクティブフォームコントロールの作成と管理に使用されるベースクラスとサービスをリストしています。
構文の詳細については、[フォームパッケージ](api#forms "API リファレンス") のAPIリファレンスドキュメントを参照してください。

### クラス

| クラス             | 詳細 |
|:---               |:---     |
| `AbstractControl` | コンクリートフォームコントロールクラス `FormControl`、`FormGroup`、`FormArray` の抽象ベースクラスです。共通の動作とプロパティを提供します。                           |
| `FormControl`     | 個別のフォームコントロールの値と有効性ステータスを管理します。`<input>` や `<select>` などのHTMLフォームコントロールに対応します。                                            |
| `FormGroup`       | `AbstractControl` インスタンスのグループの値と有効性状態を管理します。グループのプロパティには、その子コントロールが含まれます。コンポーネントの最上位フォームは `FormGroup` です。 |
| `FormArray`       | 数値でインデックス付けされた `AbstractControl` インスタンスの配列の値と有効性状態を管理します。                                                                                     |
| `FormBuilder`     | コントロールインスタンスを作成するためのファクトリメソッドを提供する、注入可能なサービスです。                                                                                                     |
| `FormRecord`      | 各々が同じ値タイプを持つ `FormControl` インスタンスのコレクションの値と有効性状態を追跡します。                                                                  |

### ディレクティブ

| ディレクティブ              | 詳細 |
|:---                    |:---     |
| `FormControlDirective` | スタンドアロンの `FormControl` インスタンスをフォームコントロール要素に同期します。                       |
| `FormControlName`      | 既存の `FormGroup` インスタンスの `FormControl` を、名前でフォームコントロール要素に同期します。 |
| `FormGroupDirective`   | 既存の `FormGroup` インスタンスをDOM要素に同期します。                                   |
| `FormGroupName`        | ネストされた `FormGroup` インスタンスをDOM要素に同期します。                                      |
| `FormArrayName`        | ネストされた `FormArray` インスタンスをDOM要素に同期します。                                      |
| `FormArrayDirective`   | スタンドアロンの `FormArray` インスタンスをDOM要素に同期します。                                  |
