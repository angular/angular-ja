# テンプレート駆動型フォームの作成

このチュートリアルでは、テンプレート駆動型フォームの作成方法について説明します。フォーム内のコントロール要素は、入力検証を含むデータプロパティにバインドされています。入力検証は、データの整合性を維持し、ユーザー体験を向上させるためのスタイリングに役立ちます。

テンプレート駆動型フォームは、[双方向データバインディング](guide/templates/two-way-binding)を使用して、テンプレートでの変更が加えられたときにコンポーネントのデータモデルを更新し、その逆も同様に行います。

<docs-callout helpful title="テンプレートフォームとリアクティブフォーム">
Angularは、インタラクティブフォームのために2つの設計アプローチをサポートしています。テンプレート駆動型フォームでは、Angularテンプレートでフォーム固有のディレクティブを使用できます。リアクティブフォームは、フォーム構築のためのモデル駆動型アプローチを提供します。

テンプレート駆動型フォームは、小規模または単純なフォームに適していますが、リアクティブフォームはよりスケーラブルで、複雑なフォームに適しています。2つのアプローチの比較については、[アプローチの選択](guide/forms#choosing-an-approach)を参照してください。
</docs-callout>

Angularテンプレートを使用して、ログインフォーム、コンタクトフォーム、ほとんどのビジネスフォームなど、あらゆる種類のフォームを構築できます。
コントロールをクリエイティブにレイアウトし、オブジェクトモデル内のデータにバインドできます。
検証ルールを指定し、検証エラーを表示し、特定のコントロールからの入力を条件付きで許可します。そして、組み込みの視覚的なフィードバックをトリガーし、その他多くのことができます。

## 目標

このチュートリアルでは、次の方法について学びます。

- コンポーネントとテンプレートを使用してAngularフォームを構築する
- `ngModel`を使用して、入力コントロールの値を読み書きするための双方向データバインディングを作成する
- コントロールの状態を追跡する特別なCSSクラスを使用して、視覚的なフィードバックを提供する
- ユーザーに検証エラーを表示し、フォームの状態に基づいてフォームコントロールからの入力を条件付きで許可する
- [テンプレート参照変数](guide/templates/reference-variables)を使用して、HTML要素間で情報を共有する

## テンプレート駆動型フォームの構築

テンプレート駆動型フォームは、`FormsModule`で定義されたディレクティブに依存します。

| ディレクティブ     | 詳細 |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NgModel`      | アタッチされたフォーム要素の値の変更とデータモデルの変更を調整し、入力検証やエラー処理を使用してユーザー入力に対応できるようにします。                                                                                                           |
| `NgForm`       | トップレベルの`FormGroup`インスタンスを作成し、`<form>`要素にバインドして、集計されたフォームの値と検証の状態を追跡します。`FormsModule`をインポートすると、このディレクティブはすべての`<form>`タグでデフォルトでアクティブになります。特別なセレクターを追加する必要はありません。 |
| `NgModelGroup` | DOM要素に`FormGroup`インスタンスを作成してバインドします。                                                                                                                                                                                                                      |

### ステップの概要

このチュートリアルでは、次の手順を使用して、サンプルフォームをデータにバインドし、ユーザー入力を処理します。

1. 基本的なフォームを構築する。
   - サンプルデータモデルを定義する
   - `FormsModule`など、必要なインフラストラクチャを含める
1. `ngModel`ディレクティブと双方向データバインディング構文を使用して、フォームコントロールをデータプロパティにバインドする。
   - `ngModel`がCSSクラスを使用してコントロールの状態を報告する方法を調べる
   - コントロールに名前を付けて、`ngModel`からアクセスできるようにする
1. `ngModel`を使用して、入力の有効性とコントロールの状態を追跡する。
   - 状態に基づいて視覚的なフィードバックを提供するためのカスタムCSSを追加する
   - 検証エラーメッセージを表示および非表示にする
1. モデルデータに追加することで、ネイティブHTMLボタンのクリックイベントに対応する。
1. フォームの[`ngSubmit`](api/forms/NgForm#properties)出力プロパティを使用して、フォームの送信を処理する。
   - フォームが有効になるまで、**Submit**ボタンを無効にする
   - 送信後、ページ上の異なるコンテンツに、完了したフォームを交換する

## フォームの構築

<!-- TODO: プレビューへのリンク -->
<!-- <docs-code live/> -->

1. 提供されたサンプルアプリケーションは、フォームに反映されるデータモデルを定義する`Actor`クラスを作成します。

   <docs-code header="src/app/actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. フォームのレイアウトと詳細は、`ActorFormComponent`クラスで定義されます。

   <docs-code header="src/app/actor-form/actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="v1"/>

   コンポーネントの`selector`値は"app-actor-form"であるため、このフォームを`<app-actor-form>`タグを使用して親テンプレートにドロップできます。

1. 次のコードは、新しいアクターインスタンスを作成し、初期フォームにサンプルアクターを表示します。

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="Marilyn"/>

   このデモでは、`model`と`skills`のダミーデータを使用しています。
   実際のアプリでは、データサービスを注入して実際のデータを取得して保存するか、これらのプロパティを入力と出力として公開します。

1. The component enables the Forms feature by importing the `FormsModule` module.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="imports"/>

1. フォームは、ルートコンポーネントのテンプレートで定義されたアプリケーションレイアウトに表示されます。

   <docs-code header="src/app/app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

   初期テンプレートは、2つのフォームグループと送信ボタンを持つフォームのレイアウトを定義します。
   フォームグループは、Actorデータモデルの2つのプロパティ（名前とスタジオ）に対応します。
   各グループには、ラベルとユーザー入力を得るためのボックスがあります。

   - **名前**`<input>`コントロール要素には、HTML5の`required`属性があります
   - **スタジオ**`<input>`コントロール要素には、`studio`はオプションであるため、属性がありません

   **Submit**ボタンには、スタイリングのためのいくつかのクラスがあります。
   現時点では、フォームのレイアウトはすべてプレーンなHTML5で、バインディングやディレクティブはありません。

1. サンプルフォームは、[Twitter Bootstrap](https://getbootstrap.com/css)の`container`、`form-group`、`form-control`、`btn`といったスタイルクラスを使用しています。
   これらのスタイルを使用するには、アプリケーションのスタイルシートでライブラリをインポートします。

   <docs-code header="src/styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. フォームでは、アクターのスキルを、`ActorFormComponent`で内部的に維持されている事前定義された`skills`リストから選択する必要があります。
   The Angular `@for` loop iterates over the data values to populate the `<select>` element.

   <docs-code header="src/app/actor-form/actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="skills"/>

アプリケーションを今すぐ実行すると、選択コントロールにスキルのリストが表示されます。
入力要素は、まだデータ値やイベントにバインドされていないため、空欄であり、動作しません。

## 入力コントロールをデータプロパティにバインドする

次のステップは、入力コントロールを対応する`Actor`プロパティに双方向データバインディングでバインドすることです。これにより、ユーザー入力がデータモデルを更新し、データのプログラムによる変更がディスプレイを更新します。

`FormsModule`で宣言された`ngModel`ディレクティブを使用すると、テンプレート駆動型フォームのテンプレート内のコントロールを、データモデルのプロパティにバインドできます。
双方向データバインディングの構文`[(ngModel)]="..."`を使用してディレクティブを含めると、Angularはコントロールの値とユーザー操作を追跡し、ビューとモデルを同期させることができます。

1. テンプレートファイル`actor-form.component.html`を編集します。
1. **名前**ラベルの隣の`<input>`タグを探します。
1. `ngModel`ディレクティブを追加し、双方向データバインディング構文`[(ngModel)]="..."`を使用します。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModelName-1"/>

HELPFUL: この例では、各入力タグの後に一時的な診断用補間`{{model.name}}`が追加され、対応するプロパティの現在のデータ値が表示されます。コメントは、双方向データバインディングの動作を観察し終わったら、診断用行を削除するよう思い出させてくれます。

### フォーム全体のステータスにアクセスする

コンポーネントで`FormsModule`をインポートすると、Angularはテンプレートの`<form>`タグに[NgForm](api/forms/NgForm)ディレクティブを自動的に作成してアタッチします（`NgForm`のセレクターは`<form>`要素と一致する`form`だからです）。

`NgForm`とフォーム全体のステータスにアクセスするには、[テンプレート参照変数](guide/templates/reference-variables)を宣言します。

1. テンプレートファイル`actor-form.component.html`を編集します。
1. テンプレート参照変数`#actorForm`を付けて`<form>`タグを更新し、次の値を設定します。

   <docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="template-variable"/>

   `actorForm`テンプレート変数は、フォーム全体を管理する`NgForm`ディレクティブインスタンスへの参照になります。

1. アプリケーションを実行します。
1. **名前**入力ボックスに入力し始めます。

   文字を追加したり削除したりすると、データモデルにも表示および非表示されます。

補間された値を表示する診断用行は、値が実際に入力ボックスからモデルに、そしてモデルから入力ボックスに戻っていることを示しています。

### コントロール要素に名前を付ける

`[(ngModel)]`を要素に使用する場合は、その要素の`name`属性を定義する必要があります。
Angularは、割り当てられた名前を使用して、親`<form>`要素にアタッチされた`NgForm`ディレクティブに要素を登録します。

例では、`<input>`要素に`name`属性を追加し、"name"に設定しました。これは、アクターの名前を表現するのに理にかなっています。
任意のユニークな値で構いませんが、わかりやすい名前を使用すると便利です。

1. **スタジオ**と**スキル**に同様の`[(ngModel)]`バインディングと`name`属性を追加します。
1. 補間された値を表示する診断メッセージを削除できます。
1. アクターモデル全体に双方向データバインディングが機能することを確認するために、コンポーネントのテンプレートの最上部に、[`json`](api/common/JsonPipe)パイプを使用した新しいテキストバインディングを追加します。これは、データを文字列にシリアライズします。

これらの変更を加えた後、フォームテンプレートは次のようになります。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModel-2"/>

次のことに注意してください。

- 各`<input>`要素には`id`プロパティがあります。
   これは、`<label>`要素の`for`属性によって使用され、ラベルを入力コントロールに一致させます。
   これは[標準的なHTML機能](https://developer.mozilla.org/docs/Web/HTML/Element/label)です。

- 各`<input>`要素には、Angularがフォームにコントロールを登録するために使用する必要な`name`プロパティもあります。

効果を確認したら、`{{ model | json }}`テキストバインディングを削除できます。

## フォームの状態を追跡する

Angularは、フォームが送信された後に`form`要素に`ng-submitted`クラスを適用します。このクラスは、フォームが送信された後にフォームのスタイルを変更するために使用できます。

## コントロールの状態を追跡する

コントロールに`NgModel`ディレクティブを追加すると、コントロールの状態を表すクラス名がコントロールに追加されます。
これらのクラスは、コントロールの状態に基づいてコントロールのスタイルを変更するために使用できます。

次の表は、コントロールの状態に基づいてAngularが適用するクラス名を説明しています。

| 状態                           | クラス（真の場合） | クラス（偽の場合） |
| :------------------------------- | :------------ | :------------- |
| コントロールが訪問された。    | `ng-touched`  | `ng-untouched` |
| コントロールの値が変更された。 | `ng-dirty`    | `ng-pristine`  |
| コントロールの値が有効。    | `ng-valid`    | `ng-invalid`   |

Angularは、`form`要素に`ng-submitted`クラスを適用しますが、
`form`要素内のコントロールには適用しません。

これらのCSSクラスを使用して、コントロールの状態に基づいてコントロールのスタイルを定義します。

### コントロールの状態を観察する

フレームワークによるクラスの追加と削除を確認するには、ブラウザの開発者ツールを開き、アクターの名前を表す`<input>`要素を調べます。

1. ブラウザの開発者ツールを使用して、**Name**入力ボックスに対応する`<input>`要素を探します。
   要素には、"form-control"に加えて、複数のCSSクラスがあることがわかります。

1. 最初に表示すると、クラスは、値が有効であり、初期化またはリセット以降値が変更されていないこと、初期化またはリセット以降コントロールが訪問されていないことを示しています。

   <docs-code language="html">

   <input class="form-control ng-untouched ng-pristine ng-valid">;

   </docs-code>

1. **Name** `<input>`ボックスで次のように操作し、表示されるクラスを観察します。

   - 見るだけで触れずにいます。
     クラスは触られていないか、原始状態または有効であることを示しています。

   - 名前のボックスをクリックし、外をクリックします。
     コントロールは訪問されたため、要素には`ng-untouched`クラスではなく`ng-touched`クラスがあります。

   - 名前の最後にスラッシュを追加します。
     これで触れられて、汚れています。

   - 名前を消去します。
     これにより値が無効になるため、`ng-invalid`クラスが`ng-valid`クラスに置き換えられます。

### 状態の視覚的なフィードバックを作成する

`ng-valid`/`ng-invalid`ペアは特に興味深いものです。
なぜなら、値が無効な場合に明確な視覚的な信号を送信したいからです。
また、必須フィールドをマークすることも必要です。

入力ボックスの左側に色の付いたバーを使用して、
必須フィールドと無効なデータを同時にマークできます。

この方法で外観を変更するには、次の手順を実行します。

1. `ng-*` CSSクラスの定義を追加します。
1. これらのクラス定義を新しい`forms.css`ファイルに追加します。
1. 新しいファイルを、`index.html`と同じレベルにプロジェクトに追加します。

<docs-code header="src/assets/forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. `index.html`ファイルで、新しいスタイルシートを含めるように`<head>`タグを更新します。

<docs-code header="src/index.html (styles)" path="adev/src/content/examples/forms/src/index.html" visibleRegion="styles"/>

### 検証エラーメッセージの表示と非表示

**名前**入力ボックスは必須であり、クリアするとバーが赤くなります。
これは何かが間違っていることを示していますが、ユーザーは何が間違っているのか、どうすればいいのかわかりません。
コントロールの状態をチェックして対応することで、役立つメッセージを提供できます。

**スキル**選択ボックスも必須ですが、この種のエラー処理は必要ありません。なぜなら、選択ボックスはすでに選択を有効な値に制限しているからです。

エラーメッセージを適切に定義して表示するには、次の手順を実行します。

<docs-workflow>
<docs-step title="入力へのローカル参照を追加">
テンプレートから入力ボックスのAngularコントロールにアクセスするために使用できるテンプレート参照変数を使用して、`input`タグを拡張します。例では、変数は`#name="ngModel"`です。

テンプレート参照変数（`#name`）は`"ngModel"`に設定されています。なぜなら、それは[`NgModel.exportAs`](api/core/Directive#exportAs)プロパティの値だからです。このプロパティは、Angularに参照変数をディレクティブにどのようにリンクするかを指示します。
</docs-step>

<docs-step title="エラーメッセージを追加">
適切なエラーメッセージを含む`<div>`を追加します。
</docs-step>

<docs-step title="エラーメッセージを条件付きにする">
`name`コントロールのプロパティを、メッセージ`<div>`要素の`hidden`プロパティにバインドすることで、エラーメッセージを表示または非表示にします。
</docs-step>

<docs-code header="src/app/actor-form/actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="hidden-error-msg"/>

<docs-step title="名前への条件付きエラーメッセージを追加">
次の例のように、`name`入力ボックスに条件付きエラーメッセージを追加します。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title=' "原始"状態の例'>

この例では、コントロールが有効あるいは_原始状態_のいずれかの場合にメッセージを非表示にします。
原始状態とは、ユーザーがこのフォームに表示されてから値を変更していないことを意味します。
`pristine`状態を無視すると、値が有効な場合にのみメッセージを非表示にします。
新しい空白のアクターか無効なアクターがこのコンポーネントに表示されると、何も操作する前にエラーメッセージがすぐに表示されます。

メッセージは、ユーザーが無効な変更を加えた場合にのみ表示されるようにしたいかもしれません。
コントロールが`pristine`状態の間にメッセージを非表示にすると、その目的を達成できます。
次のステップで新しいアクターをフォームに追加すると、この選択肢の重要性についてわかります。

</docs-callout>

## 新しいアクターを追加する

この演習では、モデルデータに追加することで、ネイティブHTMLボタンのクリックイベントに対応する方法を示します。
フォームユーザーが新しいアクターを追加できるようにするには、クリックイベントに対応する**New Actor**ボタンを追加します。

1. テンプレートで、フォームの下部に"New Actor"`<button>`要素を配置します。
1. コンポーネントファイルで、アクターデータモデルにアクター作成メソッドを追加します。

   <docs-code header="src/app/actor-form/actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="new-actor"/>

1. ボタンのクリックイベントを、アクター作成メソッド`newActor()`にバインドします。

   <docs-code header="src/app/actor-form/actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-no-reset"/>

1. アプリケーションを再度実行し、**New Actor**ボタンをクリックします。

   フォームがクリアされ、入力ボックスの左側の_必須_バーが赤くなり、`name`と`skill`プロパティが無効であることを示しています。
   エラーメッセージは非表示になっていることに注意してください。
   これは、フォームが原始状態であるためです。まだ何も変更していません。

1. 名前を入力し、**New Actor**を再度クリックします。

   入力ボックスはもはや原始状態ではないため、`名前は必須です`というエラーメッセージが表示されます。
   フォームは、**New Actor**をクリックする前に名前を入力したことを覚えています。

1. フォームコントロールの原始状態を復元するには、`newActor()`メソッドを呼び出した後に、フォームの`reset()`メソッドを呼び出してすべてのフラグを強制的にクリアします。

   <docs-code header="src/app/actor-form/actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-form-reset"/>

   これで、**New Actor**をクリックすると、フォームとそのコントロールフラグの両方がリセットされます。

## `ngSubmit`でフォームを送信する

ユーザーは、フォームに記入したら送信できる必要があります。
フォームの下部にある**Submit**ボタンは、それ自体では何も実行しませんが、`type="submit"`であるため、フォームの送信イベントをトリガーします。

このイベントに対応するには、次の手順を実行します。

<docs-workflow>

<docs-step title="ngOnSubmitを監視する">
フォームの[`ngSubmit`](api/forms/NgForm#properties)イベントプロパティを、アクターフォームコンポーネントの`onSubmit()`メソッドにバインドします。

<docs-code header="src/app/actor-form/actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngSubmit"/>
</docs-step>

<docs-step title="disabledプロパティをバインドする">
テンプレート参照変数`#actorForm`を使用して、**Submit**ボタンを含むフォームにアクセスし、イベントバインディングを作成します。

フォームの全体的な有効性を示すプロパティを、**Submit**ボタンの`disabled`プロパティにバインドします。

<docs-code header="src/app/actor-form/actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submit-button"/>
</docs-step>

<docs-step title="アプリケーションを実行する">
ボタンが有効になっていることに注意してください。まだ何も役に立つことはしていません。
</docs-step>

<docs-step title="名前の値を削除する">
これは"必須"ルールに違反するため、エラーメッセージが表示されます。また、**Submit**ボタンが無効になることにも注意してください。

ボタンの有効状態をフォームの有効性に明示的にワイヤリングする必要はありませんでした。
テンプレート参照変数を拡張されたフォーム要素に定義してから、ボタンコントロールでその変数を参照すると、`FormsModule`がこれを自動的に行いました。
</docs-step>
</docs-workflow>

### フォーム送信に対応する

フォーム送信への応答を表示するには、データ入力領域を非表示にし、代わりに別のものを表示できます。

<docs-workflow>
<docs-step title="フォームをラップする">
フォーム全体を`<div>`でラップし、その`hidden`プロパティを`ActorFormComponent.submitted`プロパティにバインドします。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="edit-div"/>

メインフォームは、`submitted`プロパティがフォームを送信するまでは偽であるため、最初から表示されます。これは、`ActorFormComponent`からの次のフラグメントで示されています。

<docs-code header="src/app/actor-form/actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="submitted"/>

**Submit**ボタンをクリックすると、`submitted`フラグが真になり、フォームが消えます。
</docs-step>

<docs-step title="送信された状態を追加する">
フォームが送信された状態の間に別のものを表示するには、新しい`<div>`ラッパーの下に次のHTMLを追加します。

<docs-code header="src/app/actor-form/actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submitted"/>

この`<div>`は、補間バインディングで読み取り専用の俳優を表示します。これは、コンポーネントが送信された状態の間にのみ表示されます。

代替表示には、_編集_ボタンが含まれます。このボタンのクリックイベントは、`submitted`フラグをクリアする式にバインドされています。
</docs-step>

<docs-step title="編集ボタンをテストする">
*編集*ボタンをクリックして、表示を編集可能なフォームに戻します。
</docs-step>
</docs-workflow>

## まとめ

このページで説明したAngularフォームは、データの修正や検証などをサポートするために、
次のフレームワーク機能を活用しています。

- Angular HTMLフォームテンプレート
- `@Component`デコレーターを含むフォームコンポーネントクラス
- `NgForm.ngSubmit`イベントプロパティにバインドすることで、フォーム送信を処理する
- `#actorForm`や`#name`などのテンプレート参照変数
- 双方向データバインディングのための`[(ngModel)]`構文
- 検証とフォーム要素の変更追跡のための`name`属性の使用
- 入力コントロールの参照変数の`valid`プロパティは、コントロールが有効であるか、エラーメッセージを表示する必要があるかを示します
- `NgForm`の有効性にバインドすることで、**Submit**ボタンの有効状態を制御する
- 有効でないコントロールについてユーザーに視覚的なフィードバックを提供するカスタムCSSクラス

アプリケーションの最終バージョンを示すコードを次に示します。

<docs-code-multifile>
    <docs-code header="actor-form/actor-form.component.ts" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="final"/>
    <docs-code header="actor-form/actor-form.component.html" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="final"/>
    <docs-code header="actor.ts" path="adev/src/content/examples/forms/src/app/actor.ts"/>
    <docs-code header="app.component.html" path="adev/src/content/examples/forms/src/app/app.component.html"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/forms/src/app/app.component.ts"/>
    <docs-code header="main.ts" path="adev/src/content/examples/forms/src/main.ts"/>
    <docs-code header="forms.css" path="adev/src/content/examples/forms/src/assets/forms.css"/>
</docs-code-multifile>
