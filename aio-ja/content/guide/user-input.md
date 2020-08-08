# ユーザー入力

リンクをクリックしたり、ボタンを押したり、
テキストを入力したりするようなユーザーアクションはDOMイベントを発生させます。
このページでは、Angularのイベントバインディング構文を使用して
コンポーネントのイベントハンドラーにそれらのイベントをバインドする方法を説明します。

<live-example></live-example> を実行してください。


## ユーザー入力イベントにバインドする {@a binding-to-user-input-events}

[Angularイベントバインディング](guide/event-binding)を使用して、
[DOMイベント](https://developer.mozilla.org/en-US/docs/Web/Events)に応答できます。
多くのDOMイベントはユーザー入力によってトリガーされます。 
これらのイベントにバインドすることで、ユーザーからの入力を得ることができます。

DOMイベントにバインドするには、DOMイベント名をカッコで囲み、
クォーテーションの中に[テンプレート文](guide/template-statements)を割り当てます。

次の例は、クリックハンドラーを実装するイベントバインディングを示しています。

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-button" header="src/app/click-me.component.ts"></code-example>

{@a click}

等号の左側の`(click)`は、**バインディングのターゲット**としてボタンのクリックイベントを識別します。 
等号の右側のクォーテーションで囲まれたテキストは、
コンポーネントの`onClickMe`メソッドを呼び出すことによって
clickイベントに応答する**テンプレート文**です。

バインディングを記述するときは、テンプレート文の**実行コンテキスト**に注意してください。
テンプレート文中の識別子は、特定のコンテキストオブジェクトに属します。
それは通常、テンプレートを制御するAngularコンポーネントです。 
上の例はHTMLの1行を示していますが、HTMLはより大きなコンポーネントに属しています。


<code-example path="user-input/src/app/click-me.component.ts" region="click-me-component" header="src/app/click-me.component.ts"></code-example>



ユーザーがボタンをクリックすると、Angularは`ClickMeComponent`の`onClickMeメソッド`を呼び出します。



## $eventオブジェクトからユーザー入力を取得する
DOMイベントは、コンポーネントにとって有益な情報のペイロードを保持します。 
このセクションでは、各キーストローク後に入力ボックスの`keyup`イベントにバインドしてユーザーの入力を取得する方法を示します。

次のコードは、`keyup`イベントをリッスンし、イベントペイロード（`$event`）全体をコンポーネントイベントハンドラーに渡します。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-1-template" header="src/app/keyup.components.ts (template v.1)"></code-example>



ユーザーがキーを押して離すと、`keyup`イベントが発生し、
Angularは対応するDOMイベントオブジェクトをコンポーネントの`onKey()`メソッドに渡される`$event`変数に提供します。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-1-class-no-type" header="src/app/keyup.components.ts (class v.1)"></code-example>



`$event`オブジェクトのプロパティは、DOMイベントのタイプによって異なります。
たとえば、マウスイベントは、入力ボックス編集イベントとは異なる情報を含みます。

すべての[標準DOMイベントオブジェクト](https://developer.mozilla.org/en-US/docs/Web/API/Event)には、
イベントを発生させた要素への参照である`target`プロパティがあります。
この場合、`target`は[`<input>`要素](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)を参照し、
`event.target.value`はその要素の現在の内容を返します。

各呼び出しの後、`onKey()`メソッドは、
入力ボックス値の内容をコンポーネントの`values`プロパティのリストに追加し、
その後に区切り文字（|）を続けます。
[補間](guide/interpolation)は、`values`プロパティからの累積された入力ボックスの変更を表示します。

ユーザーが文字「abc」を入力した後、バックスペースで1つずつ削除するとします。 
UIに表示される内容は次のとおりです。

<code-example>
  a | ab | abc | ab | a | |
</code-example>



<div class="lightbox">
  <img src='generated/images/guide/user-input/keyup1-anim.gif' alt="key up 1">
</div>



<div class="alert is-helpful">



あるいは、`event.key`を`event.target.value`の代わりに代入することによって、
個々のキー自体を累積することができます。この場合、同じユーザー入力は次のようになります。

<code-example>
  a | b | c | backspace | backspace | backspace |

</code-example>



</div>



{@a keyup1}


### _$event_の型

上記の例は`$event`を`any`型としてキャストします。
これは代償のあるコードの簡素化です。
イベントオブジェクトのプロパティを明らかにし、愚かな間違いを防ぐことができる型情報はありません。

次の例では、メソッドを型を使って書き換えます。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-1-class" header="src/app/keyup.components.ts (class v.1 - typed )"></code-example>



`$event`は、特定の`KeyboardEvent`になりました。
すべての要素が`value`プロパティを持っているわけではないので、input要素に`target`をキャストします。
`onKey`メソッドは、テンプレートから期待されるものと、イベントをどのように解釈するかをより明確に表現します。

### _$event_を渡すべきでしょうか？
イベントオブジェクトに型を付けることは、DOMイベント全体をメソッドに渡すことへの重大な反論を生みます。
コンポーネントはテンプレートの詳細を知りすぎています。
これはHTMLの実装以上のことを知らないと情報を取り出せません。
これはテンプレート（_ユーザーが見るもの_）とコンポーネント（_アプリケーションがユーザーデータをどのように処理するか_）の間における関心の分離を壊します。

次のセクションでは、テンプレート参照変数を使用してこの問題に対処する方法を示します。


## テンプレート参照変数からユーザー入力を取得する
ユーザーデータを取得するもう1つの方法は、
Angularの[**テンプレート参照変数**](guide/template-reference-variables)を使用することです。
これらの変数は、テンプレート内から要素への直接アクセスを提供します。
テンプレート参照変数を宣言するには、識別子の前にハッシュ（またはポンド）文字（#）を付けます。

次の例では、テンプレート参照変数を使用して、単純なテンプレートにキーストロークループバックを実装しています。

<code-example path="user-input/src/app/loop-back.component.ts" region="loop-back-component" header="src/app/loop-back.component.ts"></code-example>



`<input>`要素で宣言されたboxという名前のテンプレート参照変数は、`<input>`要素自体を参照します。
このコードでは、`box`変数を使用してinput要素の`value`を取得し、
`<p>`タグ間に補間を使って表示します。

テンプレートは完全に自己完結しています。
コンポーネントにバインドされず、コンポーネントは何もしません。

入力ボックスに何かを入力し、各キーストロークでディスプレイの更新を見てください。


<div class="lightbox">
  <img src='generated/images/guide/user-input/keyup-loop-back-anim.gif' alt="loop back">
</div>



<div class="alert is-helpful">



**これは、イベントにバインドしない限り、まったく動作しません**

Angularは、アプリケーションがキーストロークなどの非同期イベントに応答して何かを行う場合にのみ、
バインディング（つまり画面）を更新します。
この例のコードは、可能な限り最短のテンプレートステートメントである数字0に`keyup`イベントをバインドしています。
このステートメントは何も役に立ちませんが、Angularの要求を満たし、Angularが画面を更新するようにします。

</div>



`$event`オブジェクトを調べるよりも、テンプレート参照変数を使って入力ボックスに行く方が簡単です。
テンプレート参照変数を使用してユーザーの入力を取得する、以前の`keyup`の例を書き直しました。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-2" header="src/app/keyup.components.ts (v2)"></code-example>



このアプローチの素晴らしい点は、コンポーネントがビューからクリーンなデータ値を取得することです。 
`$event`とその構造についての知識はもはや必要ありません。
{@a key-event}


## キーイベントフィルタリング (`key.enter`を使う)
`(keyup)`イベントハンドラーはすべてのキーストロークを拾います。
ユーザーが入力を完了したことを知らせるため、_Enter_キーだけが重要な場合があります。
ノイズを減らす1つの方法は、毎回`$event.keyCode`を調べ、キーが_Enter_の場合にのみアクションを取ることです。

もっと簡単な方法は、Angularの`keyup.enter`疑似イベントにバインドすることです。 
Angularは、ユーザーが_Enter_キーを押したときにのみイベントハンドラーを呼び出します。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-3" header="src/app/keyup.components.ts (v3)"></code-example>



このように動作します。

<div class="lightbox">
  <img src='generated/images/guide/user-input/keyup3-anim.gif' alt="key up 3">
</div>




## blurイベント

前の例では、入力ボックスの現在の状態は、ユーザーが一度も_Enter_キーを押さずにページ上の他の場所にマウスを移動してクリックすると失われます。
コンポーネントの`value`プロパティは、ユーザーが_Enter_キーを押したときにのみ更新されます。

この問題を解決するには、_Enter_キーと_blur_イベントの両方をリッスンします。

<code-example path="user-input/src/app/keyup.components.ts" region="key-up-component-4" header="src/app/keyup.components.ts (v4)"></code-example>




## すべてをまとめましょう
前のページに、[データを表示する](guide/displaying-data)方法を示しました。
このページでは、イベントバインディング手法について説明しました。

それでは、すべてのヒーローのリストを表示し、新しいヒーローをリストに追加できるマイクロアプリにまとめましょう。
ユーザーは、入力ボックスにヒーローの名前を入力して**Add**をクリックすると、ヒーローを追加できます。


<div class="lightbox">
  <img src='generated/images/guide/user-input/little-tour-anim.gif' alt="Little Tour of Heroes">
</div>



以下は「Little Tour of Heroes」のコンポーネントです。


<code-example path="user-input/src/app/little-tour.component.ts" region="little-tour" header="src/app/little-tour.component.ts"></code-example>



### 注目するポイント

* **テンプレート変数を使用して要素を参照する** &mdash;
`newHero`テンプレート変数は`<input>`要素を参照します。 
`<input>`要素の任意の兄弟または子から`newHero`を参照できます。

* **要素ではなく値を渡す** &mdash;
`newHero`をコンポーネントの`addHero`メソッドに渡す代わりに、
入力ボックスの値を取得して`addHero`に渡します。

* **テンプレートステートメントをシンプルに保つ** &mdash;
`(blur)`イベントは、2つのJavaScriptステートメントにバインドされています。
最初の文は`addHero`を呼び出します。 2番目の`newHero.value=''`は、
新しいヒーローがリストに追加された後に入力ボックスをクリアします。



## ソースコード

このページで説明したすべてのコードを示します。

<code-tabs>

  <code-pane header="click-me.component.ts" path="user-input/src/app/click-me.component.ts">

  </code-pane>

  <code-pane header="keyup.components.ts" path="user-input/src/app/keyup.components.ts">

  </code-pane>

  <code-pane header="loop-back.component.ts" path="user-input/src/app/loop-back.component.ts">

  </code-pane>

  <code-pane header="little-tour.component.ts" path="user-input/src/app/little-tour.component.ts">

  </code-pane>

</code-tabs>


Angular also supports passive event listeners. For example, you can use the following steps to make the scroll event passive.

1. Create a file `zone-flags.ts` under `src` directory.
2. Add the following line into this file.

```
(window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];
```

3. In the `src/polyfills.ts` file, before importing zone.js, import the newly created `zone-flags`.

```
import './zone-flags';
import 'zone.js/dist/zone';  // Included with Angular CLI.
```

After those steps, if you add event listeners for the `scroll` event, the listeners will be `passive`.

## まとめ

ユーザー入力とジェスチャーに応答するための基本的なプリミティブをマスターしました。

これらの手法は小規模のデモンストレーションには便利ですが、
大量のユーザー入力を処理する場合は、すぐに煩雑になります。
双方向データバインディングは、データ入力フィールドとモデルプロパティの間で値を移動するための、
よりエレガントでコンパクトな方法です。
次のページ `フォーム` では、`NgModel`を使用して双方向バインディングを作成する方法について説明します。
