# Angular Elements概要

_Angular Elements_ は、 _Custom Elements_ （Web Componentsとも呼ばれます）としてパッケージ化される Angular コンポーネントです。Custom Elements は、フレームワークに依存しない形で新たな HTML 要素を定義するウェブ標準技術です。

<div class="alert is-helpful">

  For the sample app that this page describes, see the <live-example></live-example>.

</div>

[Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) は、現在 Chrome、Edge (Chromium-based)、 Firefox、Opera、Safari でサポートされている機能で、それ以外のブラウザでもポリフィルを通して利用することができます（[Browser Support](#browser-support) 参照）。
Custom Elements は、独自にタグを定義することによって HTML を拡張します。定義したタグの中のコンテンツは、JavaScript のコードで作成し、制御します。
ブラウザは、定義された Custom Elementsの `CustomElementRegistry` を管理します。この `CustomElementRegistry` は、インスタンス化可能な JavaScript のクラスを HTML のタグに関連付けます。

`@angular/elements` パッケージは、`createCustomElement()` API をエクスポートします。この API は、Angular のコンポーネントインターフェースと変更検知機能からあらかじめ組み込まれているビルトイン DOM API へのブリッジを提供します。

コンポーネントを Custom Elements に変換すると、必要なすべての Angular のインフラストラクチャ（基盤）がブラウザで利用できるようになります。
Custom Elements は簡単に作成することができ、Angular の機能を対応するネイティブ HTML にマッピングする際に、変更検知とデータバインディングを自動的にビューとして定義したコンポーネントに結びつけます。

<div class="alert is-helpful">

    他のフレームワークで作られているウェブアプリでも Custom Elements が使用できるように、われわれは開発を進めています。
    Angular フレームワークの最小限の自己完結型バージョンが、コンポーネントの変更検出およびデータバインディング機能をサポートするサービスとしてインジェクトされます。
    開発の方向性についての詳細は、この [ビデオ・プレゼンテーション](https://www.youtube.com/watch?v=Z1gLFPLVJjY&t=4s) をチェックしてください。

</div>

## Custom Elementsを使用する

Custom Elements は自分自身をブートストラップします。つまり、DOM に追加されたタイミングで自動的にブートストラップを開始し、DOM から取り除かれたタイミングで自動的に破棄します。Custom Elements は一度 DOM に追加されると、通常の HTML 要素と同じように表示され、振る舞います。特別な Angular の専門用語や使用方法などは一切必要ありません。

- <b>Angularアプリ内の簡単な動的コンテンツ</b>

  コンテンツを Custom Elements に変換すると、Angular アプリ内にダイナミック HTML コンテンツを容易に作成することができるようになります。Angular アプリ内の DOM に直接追加した HTML コンテンツは、通常 Angular の処理なしで表示されます。もっとも、ご自身で _動的コンポーネント_ を定義して、HTML タグをアプリのデータに結びつけ、変更検知の対象となるようにコードを追加した場合、話は別ですが。Custom Elements を使用すると、これらのすべての処理は自動的に行われるようになります。

- <b>コンテンツリッチなアプリケーション</b>

  もしこのドキュメントのような豊富なコンテンツを持った Angular アプリをお持ちであれば、Custom Elements を使うことで、Angular の知識を必要とすることなく、洗練された Angular の機能をコンテンツに持たせることができます。たとえば、この Angular ガイドは、Angular ナビゲーションツールによって直接 DOM に追加されています。しかしながら、複雑な操作が可能な `<code-snippet>` のような特別な要素を含めることができます。必要なのは、コンテンツプロバイダーにCustom Elements の構文を伝えることだけです。Angular や、コンポーネントのデータ構造、実装ついての知識などは必要ありません。

### 仕組みについて

コンポーネントを、Custom Elements としてブラウザに登録されるクラスに変換するには、`createCustomElement()` 関数を使います。
設定したクラスを、ブラウザの Custom Elements のレジストリに登録すると、あらかじめ組み込まれている HTML 要素のように振る舞う新たな要素が、DOM に直接追加したコンテンツの中で使用することができるようになります。

```
<my-popup message="Use Angular!"></my-popup>
```

Custom Elements がページ上に置かれると、ブラウザは登録されたクラスのインスタンスを作成し、それを DOM に追加します。コンテンツはコンポーネントのテンプレートによって提供され、コンポーネントと DOM データを使ってレンダリングされます。コンポーネントの入力プロパティは、その要素の入力属性に対応します。

<div class="lightbox">
  <img src="generated/images/guide/elements/customElement1.png" alt="Custom element in browser" class="left">
</div>

<hr class="clear">

## コンポーネントをカスタムエレメンツに変換する

Angular は、Angular コンポーネントとその依存関係をカスタム要素に変換する
`createCustomElement()` 関数を提供します。
この関数は、コンポーネントの観測可能なプロパティと、ブラウザがインスタンスを作成および破棄し、
変更を検出して対応するために必要なAngular機能を収集します。

変換処理では、`NgElementConstructor` インターフェースが実装され、
コンポーネントが自分でブートストラップするインスタンスを生成するように設定されたコンストラクタークラスを作成されます。

設定されたコンストラクターとその関連した Custom Elements タグをブラウザの `CustomElementRegistry` に登録するには、
JavaScript の関数 `customElements.define()` を使ってください。
ブラウザは、登録された要素のタグに遭遇した際に、Custom Elements のインスタンスを生成するためにコンストラクターを使用します。

<div class="lightbox">
  <img src="generated/images/guide/elements/createElement.png" alt="Transform a component to a custom element" class="left">
</div>

### マッピング

Custom Elements は Angular コンポーネントを _ホスト_ し、 コンポーネントで定義されるデータやロジックを標準 DOM API に結びつけるブリッジを提供します。コンポーネントのプロパティとロジックは HTML の属性とブラウザのイベントシステムに直接関連付けられます。

- 生成 API は、input プロパティをもつコンポーネントをパースし、Custom Elements のために対応する属性を定義します。その際に、大文字/小文字を区別しない Custom Elements とその属性を対応させるために属性のプロパティ名を変換します。変換の結果として生じる属性名は、ダッシュで区切った小文字が使用されます。たとえば、`@Input('myInputProp') inputProp` を持ったコンポーネントであれば、対応する Custom Elements の属性は `my-input-prop` として定義されます。

- コンポーネントの出力は、出力名にマッチしたカスタムイベント名をもつ HTML の [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) としてディスパッチされます。たとえば、`@Output() valueChanged = new EventEmitter()` を持ったコンポーネントであれば、対応するカスタムイベントは "valueChanged" というイベント名でディスパッチされ、発信されるデータはイベントの `detail` プロパティに格納されます。もしエイリアスを定義していた場合、その値が使用されます。たとえば、`@Output('myClick') clicks = new EventEmitter<string>();` であれば、"myClick" というイベント名でディスパッチされます。

より詳しい情報については、Web Components のドキュメント [Creating custom events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events) を参照してください。
 
{@a browser-support}

## Custom Elementsのブラウザのサポート状況

最近開発された [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) のWebプラットフォーム機能は、現在多くのブラウザでネイティブにサポートされています。

<table>
<tr>
  <th>ブラウザ</th>
  <th>Custom Elements のサポート状況</th>
</tr>
<tr>
  <td>Chrome</td>
  <td>ネイティブサポート済み</td>
</tr>
<tr>
  <td>Edge (Chromium-based)</td>
  <td>ネイティブサポート済み</td>
</tr>
<tr>
  <td>Firefox</td>
  <td>ネイティブサポート済み</td>
</tr>
<tr>
  <td>Opera</td>
  <td>ネイティブサポート済み</td>
</tr>
<tr>
  <td>Safari</td>
  <td>ネイティブサポート済み</td>
</tr>
</table>

Custom Elements をサポートしているブラウザにおいて、Custom Elements を定義するには ES2015 のクラス構文を使うことが仕様として求められています。プロジェクトの [TypeScript 設定ファイル](/guide/typescript-configuration) に `target: "es2015"` プロパティを設定することによって、この仕様を受け入れることができます。Custom Elements と ES2015 はすべてのブラウザで利用可能であるとは限らないので、古いブラウザや ES5 のコードをサポートするために、代わりにポリフィルを使うという選択も可能です。

自動的に正しいポリフィルを使ってプロジェクトを設定するには、[Angular CLI](cli) をお使いください: `ng add @angular/elements --project=*your_project_name*`
- ポリフィルについての詳細は、[polyfill documentation](https://www.webcomponents.org/polyfills) を参照してください。

- Angular のブラウザサポート状況についての詳細は、[Browser Support](guide/browser-support) を参照してください。


## サンプル: ポップアップサービス

以前は、実行時にコンポーネントをアプリケーションに追加する場合、_動的コンポーネント_ を定義する必要がありました。アプリケーションモジュールは、動的コンポーネントを `entryComponents` の下にリストアップする必要があり、アプリケーションは起動時にそれらが存在することを知りません。そして [動的コンポーネントローダー](guide/dynamic-component-loader) で説明されているように、ロードしてDOMの要素にアタッチし、依存関係、変更検知、およびイベント処理について記述する必要がありました。

Angular の Custom Elements を使用すれば、自動的にインフラストラクチャとフレームワークのすべてが提供されるようになり、処理がよりシンプルで、よりわかりやすくなります。&mdash; つまり、必要なイベントハンドリングを定義するだけでよくなります（アプリケーションで使用しない場合は、コンポーネントをコンパイルから除外する必要があります）。

サンプルアプリ（下記）のポップアップ・サービスでは、自動的にロードすることも、Custom Elements に変換することも可能です。

- `popup.component.ts` は、シンプルな pop-up 要素をアニメーションとスタイルとともに定義しています。
- `popup.service.ts` は、動的コンポーネントまたは Custom Elements として PopupComponent を実行する2つの異なる方法を提供する注入可能なサービスを作成しています。動的読み込みの手法のために、どれだけ多くの設定が必要となるかご注意ください。
- `app.module.ts` は、PopupComponent をモジュールの `entryComponents` のリストに追加します。そうすることで、PopupComponent をコンパイルから除外し、スタートアップ時の警告やエラーを防ぐようにしています。
- `app.component.ts` は、アプリのルートコンポーネントを定義しています。このコンポーネントは、PopupService を使用して、実行時に pop-up を DOM に追加します。アプリが起動すると、ルートコンポーネントのコンストラクターは PopupComponent を Custom Elements に変換します。

比較のため、デモでは、両方の手法を使っています。ひとつは動的読み込みの手法を使ってポップアップを追加するボタンです。もうひとつは Custom Elements を使って popup を追加するボタンです。準備の方法が異なるだけで、結果は同じだということが分かるでしょう。

<code-tabs>

  <code-pane header="popup.component.ts" path="elements/src/app/popup.component.ts">

  </code-pane>

  <code-pane header="popup.service.ts" path="elements/src/app/popup.service.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="elements/src/app/app.module.ts">

  </code-pane>

  <code-pane header="app.component.ts" path="elements/src/app/app.component.ts">

  </code-pane>
</code-tabs>


## Custom Elementsの型指定

`document.createElement()` や `document.querySelector()` のような一般的な DOM API は、指定された引数に適切な要素型を返します。たとえば、 `document.createElement('a')` を呼び出すと、 `HTMLAnchorElement` が返されます。これは TypeScript が `href` プロパティをもつと判断するものです。同様に、 `document.createElement('div')` を呼び出すと、 `HTMLDivElement` を返します。これは TypeScript が `href` プロパティを持たないと判断するものです。

カスタム要素の名前（この例では `popup-element`）のような未知の要素を呼び出した場合、 TypeScript は返される要素の正しい型を推論できないため、メソッドは `HTMLELement` のようなジェネリック型を返します。

Angular で作成されたカスタム要素は、（`HTMLElement` を拡張した） `NgElement` を拡張します。さらに、このカスタム要素は対応するコンポーネントの各インプットに対してプロパティを持ちます。たとえば、 `popup-element` には `string` 型の `message` プロパティがあります。

カスタム要素の正しい型を取得するには、いくつかのオプションがあります。次のコンポーネントに基づいて `my-dialog` のカスタム要素を作成するとします。

```ts
@Component(...)
class MyDialog {
  @Input() content: string;
}
```

正確な型を取得するもっとも簡単な方法は、関連するDOMメソッドの戻り値を正しい型にキャストすることです。そのためには、 `NgElement` と `WithProperties` 型（どちらも `@angular/elements` からエクスポートされます）を使うことができます：

```ts
const aDialog = document.createElement('my-dialog') as NgElement & WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123;  // <-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News';  // <-- ERROR: TypeScript knows there is no `body` property on `aDialog`.
```

これは型チェックやオートコンプリートサポートのような、カスタム要素のためのTypeScript機能をすぐに使うにはよい方法です。しかしいくつかの場所でそれを必要とするならば、面倒になる可能性があります。なぜならすべての発生時に戻り値の型をキャストする必要があるからです。

各カスタム要素の型を一度だけ定義する、もうひとつの方法は、 `HTMLElementTagNameMap` を拡張することです。これは（`document.createElement()` や `document.querySelector()` 、その他のようなDOMメソッドのために）タグ名に基づいて返される要素の型を TypeScript が推論するために使います。

```ts
declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    ...
  }
}
```

これで、TypeScript は組み込み要素と同じように正しい型を推論できます：

```ts
document.createElement('div')               //--> HTMLDivElement (built-in element)
document.querySelector('foo')               //--> Element        (unknown element)
document.createElement('my-dialog')         //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element')  //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)
```
