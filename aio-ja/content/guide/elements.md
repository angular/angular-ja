# Angular Elements概要

_Angular elements_ are Angular components packaged as _custom elements_, a web standard for defining new HTML elements in a framework-agnostic way.

_Angular Elements_ は、フレームワークに依存しない形で新しい HTML 要素を定義するためのウェブ標準技術である _Custom Elements_ としてパッケージ化される Anuglar コンポーネントです。

[Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) are a Web Platform feature currently supported by Chrome, Opera, and Safari, and available in other browsers through polyfills (see [Browser Support](#browser-support)).
A custom element extends HTML by allowing you to define a tag whose content is created and controlled by JavaScript code. 
The browser maintains a `CustomElementRegistry` of defined custom elements (also called Web Components), which maps an instantiable JavaScript class to an HTML tag.

[Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) は、現在 Chrome、Opera、Safari でサポートされている機能で、それ以外のブラウザーでもポリフィルを通して利用することができます（[Browser Support](#browser-support)参照）。
Custom Elements は、独自にタグを定義することによって HTML を拡張します。定義したタグの中のコンテンツは、JavaScript のコードで作成し、制御します。
ブラウザーは、定義されたカスタム要素（ Web Components とも呼ばれます）の `CustomElementRegistry` を持ち続けます。この `CustomElementRegistry` は、インスタンス化可能な JavaScript のクラスを HTML のタグに関連付けます。

The `@angular/elements` package exports a `createCustomElement()` API that provides a bridge from Angular's component interface and change detection functionality to the built-in DOM API. 

`@angular/elements` パッケージは、`createCustomElement()` API をエクスポートします。この API は、Angular のコンポーネントインターフェースと変更検知機能から予め組み込まれているビルトイン DOM API へのブリッジを提供します。

Transforming a component to a custom element makes all of the required Angular infrastructure available to the browser. Creating a custom element is simple and straightforward, and automatically connects your component-defined view with change detection and data binding, mapping Angular functionality to the corresponding native HTML equivalents. 

コンポーネントをカスタム要素に変換すると、必要なすべての Angular のインフラストラクチャ（基盤）がブラウザーで利用可能となります。カスタム要素は簡単に作成することができ、変更検知とデータバインディングは、Angular の機能を対応するネイティブ HTML にマッピングする際に、自動的にビューとして定義したコンポーネントに結びつけられます。

<div class="l-sub-section">

    We are working on custom elements that can be used by web apps built on other frameworks. 
    A minimal, self-contained version of the Angular framework will be injected as a service to support the component's change-detection and data-binding functionality. 
    For more about the direction of development, check out this [video presentation](https://www.youtube.com/watch?v=Z1gLFPLVJjY&t=4s).

    他のフレームワークで作られているウェブアプリでもカスタム要素が使用できるように、われわれは開発を進めています。
    Angular フレームワークの必要最小限の機能が備わっているバージョンは、コンポーネントの変更検知とデータバインディング機能をサポートするために Service としてインジェクトされる予定です。
    開発の方向性についての詳細は、この [video presentation](https://www.youtube.com/watch?v=Z1gLFPLVJjY&t=4s) をチェックしてください。

</div>

## Custom Elementsを使用する

Custom elements bootstrap themselves - they start automatically when they are added to the DOM, and are automatically destroyed when removed from the DOM. Once a custom element is added to the DOM for any page, it looks and behaves like any other HTML element, and does not require any special knowledge of Angular terms or usage conventions.  

Custom Elements は自分自身をブートストラップします。つまり、DOM に追加されたタイミングで自動的にブートストラップを開始し、DOM から取り除かれたタイミングで自動的に破棄します。カスタム要素は一度 DOM に追加されると、通常の HTML 要素と同じように表示され、振る舞います。特別な Angular の専門用語や使用方法などは一切必要ありません。

- <b>Easy dynamic content in an Angular app</b>

- <b></b>

  Transforming a component to a custom element provides an easy path to creating dynamic HTML content in your Angular app. HTML content that you add directly to the DOM in an Angular app is normally displayed without Angular processing, unless you define a _dynamic component_, adding your own code to connect the HTML tag to your app data, and participate in change detection. With a custom element, all of that wiring is taken care of automatically.

  コンテンツをカスタム要素に変換すると、Angular アプリ内にダイナミック HTML コンテンツを容易に作成することができるようになります。Angular アプリ内の DOM に直接追加した HTML コンテンツは、通常は Angular の処理なしで表示されます。もっとも、_dynamic component_ を定義して、HTML タグをアプリのデータに結びつけ、変更検知の対象となるためにコードを追加すれば話は別ですが。カスタム要素を使用すると、これらのすべての処理は自動的に行われます。

- <b>Content-rich applications</b>

  If you have a content-rich app, such as the Angular app that presents this documentation, custom elements let you give your content providers sophisticated Angular functionality without requiring knowledge of Angular. For example, an Angular guide like this one is added directly to the DOM by the Angular navigation tools, but can include special elements like `<code-snippet>` that perform complex operations. All you need to tell your content provider is the syntax of your custom element. They don't need to know anything about Angular, or anything about your component's data structures or implementation.

  もしこのドキュメントのような豊富なコンテンツを持った Angular アプリをお持ちであれば、カスタム要素を使うことで、Angular の知識を必要とすることなく、洗練された Angular の機能をコンテンツに持たせることができます。例えば、この Angular ガイドは、Angular ナビゲーションツールによって直接 DOM に追加されていますが、複雑な操作が可能な `<code-snippet>` のような特別な要素を含めることができます。必要なのは、コンテンツプロバイダにカスタム要素の構文を伝えることだけです。Angular や、コンポーネントのデータ構造、実装ついての知識などは必要ありません。

### How it works

Use the `createCustomElement()` function to convert a component into a class that can be registered with the browser as a custom element. 
After you register your configured class with the browser's custom-element registry, you can use the new element just like a built-in HTML element in content that you add directly into the DOM: 

コンポーネントをカスタム要素としてブラウザーに登録されるクラスに変換するには、`createCustomElement()` 関数を使います。
設定したクラスをブラウザーのカスタム要素のレジストリに登録した後に、組み込みの HTML 要素のように振る舞う新しい要素を、DOM に直接追加したコンテンツの中で使用することができるようになります。

```
<my-popup message="Use Angular!"></my-popup>
```

When your custom element is placed on a page, the browser creates an instance of the registered class and adds it to the DOM. The content is provided by the component's template, which  uses Angular template syntax, and is rendered using the component and DOM data. Input properties in the component correspond to input attributes for the element. 

カスタム要素がページ上に置かれると、ブラウザーは登録されたクラスのインスタンスを作成し、それを DOM に追加します。コンテンツはコンポーネントのテンプレートによって提供され、コンポーネントと DOM データを使ってレンダリングされます。コンポーネントの input プロパティは、要素の input 属性に対応します。

<figure>

<img src="generated/images/guide/elements/customElement1.png" alt="Custom element in browser" class="left">

</figure>

<hr class="clear">

## Transforming components to custom elements

Angular provides the `createCustomElement()` function for converting an Angular component, 
together with its dependencies, to a custom element. The function collects the component's 
observable properties, along with the Angular functionality the browser needs to 
create and destroy instances, and to detect and respond to changes. 

Angular では、`createCustomElement()` 関数を使って、Angular コンポーネントをその依存関係を含めてカスタム要素に変換します。この関数は、ブラウザーがインスタンスの作成と破棄を行い、変更に対して検知と応答を行うために必要な Angular の機能に加えて、コンポーネントが観測可能なプロパティをまとめます。

The conversion process implements the `NgElementConstructor` interface, and creates a 
constructor class that is configured to produce a self-bootstrapping instance of your component. 

変換処理は、`NgElementConstructor` インターフェースを実装し、コンポーネントが自分でブートストラップするインスタンスを生成するように設定されたコンストラクタクラスを作成します。

Use a JavaScript function, `customElements.define()`,  to register the configured constructor 
and its associated custom-element tag with the browser's `CustomElementRegistry`. 
When the browser encounters the tag for the registered element, it uses the constructor to create a custom-element instance.

設定されたコンストラクとその関連したカスタム要素タグをブラウザーの `CustomElementRegistry` に登録するために、JavaScript の関数 `customElements.define()` を使ってください。
ブラウザーは、登録された要素のタグに遭遇した際に、カスタム要素のインスタンスを生成するためにコンストラクタを使用します。

<figure>

<img src="generated/images/guide/elements/createElement.png" alt="Transform a component to a custom element" class="left">  

</figure>

### マッピング

A custom element _hosts_ an Angular component, providing a bridge between the data and logic defined in the component and standard DOM APIs. Component properties and logic maps directly into HTML attributes and the browser's event system.

カスタム要素は Angular コンポーネントを _ホスト_ し、 コンポーネントで定義されるデータやロジックを標準 DOM API に結びつけるブリッジを提供します。コンポーネントのプロパティとロジックは HTML の属性とブラウザーのイベントシステムに直接関連付けられます。

- The creation API parses the component looking for input properties, and defines corresponding attributes for the custom element. It transforms the property names to make them compatible with custom elements, which do not recognize case distinctions. The resulting attribute names use dash-separated lowercase. For example, for a component with `@Input('myInputProp') inputProp`, the corresponding custom element defines an attribute `my-input-prop`.

- 生成のためのクリエーション API は、input プロパティを持つコンポーネントをパースし、カスタム要素のために対応する属性を定義します。その際に、その属性を大文字/小文字を区別しないカスタム要素と対応させるためにプロパティ名を変換します。変換の結果として生じる属性名は、ダッシュで区切った小文字が使用されます。例えば、`@Input('myInputProp') inputProp` を持ったコンポーネントであれば、対応するカスタム要素の属性は `my-input-prop` として定義されます。

- Component outputs are dispatched as HTML [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent), with the name of the custom event matching the output name. For example, for a component with `@Output() valueChanged = new EventEmitter()`, the corresponding custom element will dispatch events with the name "valueChanged", and the emitted data will be stored on the event’s `detail` property. If you provide an alias, that value is used; for example, `@Output('myClick') clicks = new EventEmitter<string>();` results in dispatch events with the name "myClick".

- コンポーネントのoutputは、output名にマッチしたカスタムイベント名を持つHTMLの [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) としてディスパッチされます。例えば、`@Output() valueChanged = new EventEmitter()` を持ったコンポーネントであれば、対応するカスタムイベントは "valueChanged" というイベント名でディスパッチされ、emit されるデータは event の `detail` プロパティに格納されます。もしエイリアスを定義していた場合、その値が使用されます。例えば、`@Output('myClick') clicks = new EventEmitter<string>();` であれば、"myClick" というイベント名でディスパッチされます。

For more information, see Web Component documentation for [Creating custom events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events).

より詳しい情報については、Web Components のドキュメント [Creating custom events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events) を見てください。
 
{@a browser-support}

## Browser support for custom elements

The recently-developed [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) Web Platform feature is currently supported natively in a number of browsers. Support is pending or planned in other browsers. 

この新しい機能である [カスタム要素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) のウェブプラットフォームでの機能は、現在多くのブラウザーでネイティブサポートされています。いくつかのブラウザーでは、サまだポートが保留中だったり理計画中だったりします。

<table>
<tr>
  <th>ブラウザー名</th>
  <th>カスタム要素のサポート状況</th>
</tr>
<tr>
  <td>Chrome</td>
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
<tr>
  <td>Firefox</td>
  <td><code>dom.webcomponents.enabled</code> と <code>dom.webcomponents.customelements.enabled</code> の設定項目を true に設定してください。バージョン 60/61 にてデフォルトで使えるようになる予定です。</td>
</tr>
<tr>
  <td>Edge</td>
  <td>実装中<br>    

  </td>
</tr>
</table>

In browsers that support Custom Elements natively, the specification requires developers use ES2015 classes to define Custom Elements - developers can opt-in to this by setting the `target: "es2015"` property in their project's `tsconfig.json`. As Custom Element and ES2015 support may not be available in all browsers, developers can instead choose to use a polyfill to support older browsers and ES5 code.

カスタム要素をサポートしているブラウザーにおいて、カスタム要素を定義するには ES2015 のクラスを使うことを仕様として求められています。プロジェクトの `tsconfig.json` ファイルに `target: "es2015"` プロパティを設定することによって、この仕様を受け入れることができます。カスタム要素と ES2015 はすべてのブラウザーで利用可能であるとは限らないので、古いブラウザーや ES5 のコードをサポートするために、代わりにポリフィルを使うという選択も可能です。

Use the [Angular CLI](https://cli.angular.io/) to automatically set up your project with the correct polyfill: `ng add @angular/elements --name=*your_project_name*`.
- For more information about polyfills, see [polyfill documentation](https://www.webcomponents.org/polyfills). 

- For more information about Angular browser support, see [Browser Support](guide/browser-support).

自動的に正しいポリフィルを使ってプロジェクトを設定するには、[Angular CLI](https://cli.angular.io/) をお使いください。
- ポリフィルについての詳細は、[polyfill documentation](https://www.webcomponents.org/polyfills) を見てくだい。

- Angular のブラウザーサポート状況についての詳細は、[Browser Support](guide/browser-support) を見てください。


## Example: A Popup Service

Previously, when you wanted to add a component to an app at runtime, you had to define a _dynamic component_. The app module would have to list your dynamic component under `entryComponents`, so that the app wouldn't expect it to be present at startup, and then you would have to load it, attach it to an element in the DOM, and wire up all of the dependencies, change detection, and event handling, as described in [Dynamic Component Loader](guide/dynamic-component-loader).

これまでは、ランタイムでアプリにコンポーネントを追加したかったら、_dynamic component_ を定義する必要がありました。アプリはスタートアップ時にコンポーネントが存在していることがわからず、ご自身でコンポーネントをロードし、DOM 内の要素に適用し、[Dynamic Component Loader](guide/dynamic-component-loader) で定義されているように、すべての依存関係、変更検知、イベントハンドリングを解決しなければいけないため、アプリのモジュールの `entryComponents` の部分にダイナミック・コンポーネントを記述する必要がありました。

Using an Angular custom element makes the process much simpler and more transparent, by providing all of the infrastructure and framework automatically&mdash;all you have to do is define the kind of event handling you want. (You do still have to exclude the component from compilation, if you are not going to use it in your app.)

Angular のカスタム要素を使用すれば、自動的にインフラストラクチャとフレームワークのすべてが提供されるようになり、処理がよりシンプルで、よりわかりやすくなります。つまり、必要なイベントハンドリングを定義するだけでよくなります。（もしご自身のアプリで Angular のカスタム要素を使用する予定がないのであれば、ご自身でコンパイルからコンポーネントを除外する必要があります。）

The Popup Service example app defines a component that you can either load dynamically or convert to a custom element. 

サンプルアプリのポップアップ・サービスでは、自動的にロードすることも、カスタム要素に変換することも可能です。

- `popup.component.ts` defines a simple pop-up element that displays an input message, with some animation and styling. 
- `popup.service.ts` creates an injectable service that provides two different ways to invoke the PopupComponent; as a dynamic component, or as a custom element. Notice how much more setup is required for the dynamic-loading method.
- `app.module.ts` adds the PopupComponent in the module's `entryComponents` list, to exclude it from compilation and avoid startup warnings or errors.
- `app.component.ts` defines the app's root component, which uses the PopupService to add the pop-up to the DOM at run time. When the app runs, the root component's constructor converts PopupComponent to a custom element. 

- `popup.component.ts` は、シンプルな pop-up 要素をアニメーションとスタイルとともに定義しています。
- `popup.service.ts` は、ダイナミック・コンポーネントまたはカスタム要素として PopupComponent を実行する2つの異なる方法を提供するインジェクト可能な service を作成しています。dynamic-loading メソッドのために、どれだけ多くの設定が必要となるかご注意ください。
- `app.module.ts` は、PopupComponent をモジュールの `entryComponents` のリストに追加します。そうすることで、PopupComponent をコンパイルから除外し、スタートアップ時の警告やエラーを防ぐようにしています。
- `app.component.ts` は、アプリのルートコンポーネントを定義しています。このコンポーネントは、PopupService を使用して実行時に pop-up を DOM に追加します。アプリが起動すると、ルートコンポーネントのコンストラクタは PopupComponent をカスタム要素に変換します。

For comparison, the demo shows both methods. One button adds the popup using the dynamic-loading method, and the other uses the custom element. You can see that the result is the same; only the preparation is different.

比較のため、デモでは、両方のメソッドを使っています。ひとつは dynamic-loading メソッドを使って popup を追加するボタンです。もうひとつはカスタム要素を使って popup を追加するボタンです。準備の方法が異なるだけで、結果は同じだということがわかるでしょう。

<code-tabs>

  <code-pane title="popup.component.ts" path="elements/src/app/popup.component.ts">

  </code-pane>

  <code-pane title="popup.service.ts" path="elements/src/app/popup.service.ts">

  </code-pane>

  <code-pane title="app.module.ts" path="elements/src/app/app.module.ts">

  </code-pane>

  <code-pane title="app.component.ts" path="elements/src/app/app.component.ts">

  </code-pane>
</code-tabs>
