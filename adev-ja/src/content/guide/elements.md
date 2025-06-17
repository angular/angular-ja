# Angular elementsの概要

_Angular elements_ はAngularコンポーネントを _カスタム要素_（Web Componentsとも呼ばれる）としてパッケージ化したものです。これは、新しいHTML要素をフレームワークに依存しない方法で定義するためのWeb標準です。

[カスタム要素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements)はWebプラットフォーム機能であり、Angularがサポートするすべてのブラウザで利用できます。
カスタム要素は、コンテンツがJavaScriptコードによって作成および制御されるタグを定義できるようにすることで、HTMLを拡張します。
ブラウザは、定義されたカスタム要素の`CustomElementRegistry`を保持しており、これはインスタンス化可能なJavaScriptクラスをHTMLタグにマッピングします。

`@angular/elements`パッケージは、`createCustomElement()`APIをエクスポートしており、これはAngularのコンポーネントインターフェースと変更検知の機能から組み込みのDOM APIへのブリッジを提供します。

コンポーネントをカスタム要素に変換すると、必要なすべてのAngularインフラストラクチャがブラウザで利用可能になります。
カスタム要素の作成はシンプルで簡単であり、コンポーネントで定義されたビューを自動的に変更検知とデータバインディングに接続し、Angularの機能を対応する組み込みのHTML同等物にマッピングします。

## カスタム要素の使用

カスタム要素は自己ブートストラップされます。DOMに追加されると開始し、DOMから削除されると破棄されます。
カスタム要素が任意のページのDOMに追加されると、他のHTML要素と同じように見え、動作し、Angularの用語や使用規則に関する特別な知識は必要ありません。

ワークスペースに`@angular/elements`パッケージを追加するには、次のコマンドを実行します。

<docs-code language="shell">

npm install @angular/elements --save

</docs-code>

### 仕組み {#how-it-works}

`createCustomElement()`関数は、コンポーネントをブラウザにカスタム要素として登録できるクラスに変換します。
設定したクラスをブラウザのカスタム要素レジストリに登録した後、新しい要素を、DOMに直接追加するコンテンツ内で組み込みのHTML要素と同じように使用します。

<docs-code language="html">

<my-popup message="Use Angular!"></my-popup>

</docs-code>

カスタム要素がページに配置されると、ブラウザは登録されたクラスのインスタンスを作成し、それをDOMに追加します。
コンテンツはコンポーネントのテンプレートによって提供され、Angularテンプレート構文を使用し、コンポーネントとDOMデータを使用してレンダリングされます。
コンポーネントの入力プロパティは、要素の入力属性に対応します。

## コンポーネントをカスタム要素に変換する {#transforming-components-to-custom-elements}

Angularは、Angularコンポーネントとその依存関係をカスタム要素に変換するための`createCustomElement()`関数を提供します。

変換プロセスは`NgElementConstructor`インターフェースを実装し、
コンポーネントの自己ブートストラップインスタンスを生成するように構成されたコンストラクタークラスを作成します。

ブラウザのネイティブな[`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define)関数を使用して、設定されたコンストラクターとその関連するカスタム要素タグをブラウザの[`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry)に登録します。
ブラウザが登録された要素のタグを検出すると、コンストラクターを使用してカスタム要素インスタンスを作成します。

IMPORTANT: コンポーネントのセレクターをカスタム要素のタグ名として使用することは避けてください。
これは、Angularが単一のDOM要素に対して2つのコンポーネントインスタンスを作成するため、予期しない動作につながる可能性があります。
1つは通常のAngularコンポーネント、もう1つはカスタム要素を使用するものです。

### マッピング {#mapping}

カスタム要素はAngularコンポーネントを_ホスト_し、コンポーネントで定義されたデータとロジック、および標準のDOM API間のブリッジを提供します。
コンポーネントのプロパティとロジックは、HTML属性とブラウザのイベントシステムに直接マッピングされます。

* 作成APIは、入力プロパティを探してコンポーネントを解析し、カスタム要素に対応する属性を定義します。
  プロパティ名をカスタム要素と互換性があるように変換します。カスタム要素は大文字と小文字の区別を認識しません。
  結果として得られる属性名は、ダッシュで区切られた小文字を使用します。
  例えば、`inputProp = input({alias: 'myInputProp'})`を持つコンポーネントは、対応するカスタム要素として`my-input-prop`という属性を定義します。

* コンポーネントの出力はHTMLの[カスタムイベント](https://developer.mozilla.org/docs/Web/API/CustomEvent)としてディスパッチされ、カスタムイベントの名前は出力名と一致します。
    例えば、`valueChanged = output()`を持つコンポーネントの場合、対応するカスタム要素は"valueChanged"という名前のイベントをディスパッチし、出力されたデータはイベントの`detail`プロパティに格納されます。
    エイリアスを提供した場合、その値が使用されます。`clicks = output<string>({alias: 'myClick'});`は"myClick"という名前のディスパッチイベントを生成します。

詳細については、Webコンポーネントのドキュメントの[カスタムイベントの作成](https://developer.mozilla.org/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events)を参照してください。

## 例: Popupサービス {#example-a-popup-service}

以前は、実行時にコンポーネントをアプリケーションに追加したい場合、_動的コンポーネント_を定義し、それをロードしてDOMの要素にアタッチし、すべての依存関係、変更検知、イベント処理を配線する必要がありました。

Angularカスタム要素を使用すると、必要なインフラストラクチャとフレームワークをすべて自動的に提供することで、プロセスがよりシンプルかつ透過的になります。必要なのは、希望するイベント処理の種類を定義することだけです。
(アプリケーションで使用しない場合は、コンポーネントをコンパイルから除外する必要はあります。)

以下のPopupサービス例のアプリケーションは、動的にロードするかカスタム要素に変換できるコンポーネントを定義しています。

| ファイル                 | 詳細                                                                                                                                                                                                                         |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup.component.ts`  | 入力メッセージを表示するシンプルなポップアップ要素を、アニメーションとスタイル付きで定義します。                                                                                                                             |
| `popup.service.ts`    | `PopupComponent`を呼び出す2つの異なる方法を提供する注入可能サービスを作成します。動的コンポーネントとして、またはカスタム要素として。動的読み込み方式には、より多くのセットアップが必要であることに注目してください。        |  |
| `app.component.ts`    | `PopupService`を使用して実行時にDOMにポップアップを追加する、アプリケーションのルートコンポーネントを定義します。アプリケーションの実行時、ルートコンポーネントのコンストラクターは`PopupComponent`をカスタム要素に変換します。 |

比較のため、デモでは両方の方法を示しています。
一方のボタンは動的読み込み方式を使用してポップアップを追加し、もう一方はカスタム要素を使用します。
結果は同じですが、準備が異なります。

<docs-code-multifile>
    <docs-code header="popup.component.ts" path="adev/src/content/examples/elements/src/app/popup.component.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/elements/src/app/app.component.ts"/>
</docs-code-multifile>

## カスタム要素の型定義 {#typings-for-custom-elements}

`document.createElement()`や`document.querySelector()`のような汎用DOM APIは、指定された引数に適した要素型を返します。
例えば、`document.createElement('a')`を呼び出すと`HTMLAnchorElement`が返され、TypeScriptはこれに`href`プロパティがあることを認識しています。
同様に、`document.createElement('div')`は`HTMLDivElement`を返しますが、TypeScriptはこれに`href`プロパティがないことを認識しています。

カスタム要素名（この例では`popup-element`）のような未知の要素で呼び出された場合、TypeScriptが返された要素の正しい型を推論できないため、これらのメソッドは`HTMLElement`のような汎用型を返します。

Angularで作成されたカスタム要素は`NgElement`（これはさらに`HTMLElement`を拡張します）を拡張します。
さらに、これらのカスタム要素は対応するコンポーネントの各入力に対応するプロパティを持ちます。
例えば、`popup-element`は`string`型の`message`プロパティを持ちます。

カスタム要素の正しい型を取得したい場合、いくつかの選択肢があります。
次のコンポーネントに基づいて`my-dialog`カスタム要素を作成すると仮定します。

<docs-code language="typescript">

@Component(…)
class MyDialog {
  content =  input(string);
}

</docs-code>

正確な型定義を取得する最も簡単な方法は、関連するDOMメソッドの戻り値を正しい型にキャストすることです。
そのためには、`NgElement`および`WithProperties`型（両方とも`@angular/elements`からエクスポートされています）を使用します。

<docs-code language="typescript">

const aDialog = document.createElement('my-dialog') as NgElement & WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123;  // <-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News';  // <-- ERROR: TypeScript knows there is no `body` property on `aDialog`.

</docs-code>

これは、カスタム要素に対して型チェックやオートコンプリートサポートなどのTypeScript機能を素早く利用するための良い方法です。
しかし、複数の場所で必要になる場合、すべての出現箇所で戻り値をキャストする必要があるため、煩雑になる可能性があります。

各カスタム要素の型を一度だけ定義すればよい代替方法は、`HTMLElementTagNameMap`を拡張することです。これは、TypeScriptがタグ名に基づいて返された要素の型を推論するために使用するものです（`document.createElement()`、`document.querySelector()`などのDOMメソッドの場合）。

<docs-code language="typescript">

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

</docs-code>

これで、TypeScriptは組み込み要素と同じように正しい型を推論できます。

<docs-code language="typescript">

document.createElement('div')               //--> HTMLDivElement (built-in element)
document.querySelector('foo')               //--> Element        (unknown element)
document.createElement('my-dialog')         //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element')  //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)

</docs-code>

## 制限事項 {#limitations}

`@angular/elements`により作成されたカスタム要素を破棄してから再アタッチする際には、[disconnect()](https://github.com/angular/angular/issues/38778)コールバックに関する問題があるため注意が必要です。この問題に遭遇する可能性のあるケースは以下の通りです。

- AngularJSにおいて`ng-if`または`ng-repeat`内でコンポーネントをレンダリングする場合
- 要素をDOMから手動でデタッチし、再アタッチする場合
