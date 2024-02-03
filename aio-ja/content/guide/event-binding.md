# イベントバインディング

イベントバインディングを使えば、キー操作やマウス移動、クリック、タッチなどのイベントをリッスンし、応答することができます。

<div class="alert is-helpful">

このガイドのコードスニペットを含む動作例については、<live-example></live-example>を参照してください。

</div>

## 前提知識

* [コンポーネントの基礎知識](guide/architecture-components)
* [テンプレートの基礎知識](guide/glossary#template)
* [バインディング構文](guide/binding-syntax)
* [テンプレート文](guide/template-statements)

## イベントへのバインディング


<div class="alert is-helpful">

プロパティへのバインディングについては、[イベントバインディング](guide/property-binding)を参照してください。

</div>

イベントにバインドするには、Angularのイベントバインディング構文を使用します。
この構文は、等号の左側のカッコ内にターゲットイベント名、右側にクオートで囲まれたテンプレート文で構成されます。

次の例を作成しましょう。ターゲットイベント名は `click` で、テンプレート文は `onSave()` です。

<code-example language="html" header="イベントバインディングの構文">
&lt;button (click)="onSave()"&gt;Save&lt;/button&gt;
</code-example>

イベントバインディングは、ボタンのクリックイベントをリッスンして、クリックが発生するたびにコンポーネントの `onSave()` メソッドを呼び出します。

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">
</div>

### イベントターゲットの決定

イベントターゲットを決定するために、Angularはターゲットイベントの名前が既知のディレクティブのイベントプロパティと一致するかどうかをチェックします。

次の例を作成しましょう。（Angular は `myClick` が独自の `ClickDirective` のイベントであるかどうかを確認します）

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

ターゲットイベント名である `myClick` が `ClickDirective` の Output プロパティにマッチしない場合、Angular は代わりにベースとなる DOM 要素の `myClick` イベントにバインドします。

## キーボードイベントへのバインディング

Angularのバインディング構文を使って、キーボードイベントにバインドすることができます。キーボードイベントにバインドしたいキーやコードを指定することができます。これらの `key` と `code` フィールドは、ブラウザのキーボードイベントオブジェクトのネイティブな部分です。デフォルトでは、イベントバインディングはキーボードイベントの `key` フィールドを使用することを想定しています。また、`code`フィールドを使用することもできます。

キーのコンビネーションは `.`（ピリオド）で区切ることができます。たとえば、`keydown.enter`とすると、`enter`キーにイベントをバインドすることができます。また、`shift`、`alt`、`control`などの修飾キーや、Macの`command`キーも使用することができます。次の例は、キーボードイベントを `keydown.shift.t` にバインドする方法を示しています。

   ```typescript
   <input (keydown.shift.t)="onKeydown($event)" />
   ```

オペレーティングシステムによっては、期待したキーコンビネーションではなく、特殊な文字が作成される場合があります。たとえばMacOSでは、optionキーとshiftキーを一緒に使うと、特殊な文字が生成されます。macOSで `keydown.shift.alt.t` にバインドすると、この組み合わせでは `t` の代わりに `ˇ` という文字が生成されますが、これはバインドと一致しないためイベントハンドラーは起動しません。macOSで `keydown.shift.alt.t` にバインドするには、`code` キーボードイベントフィールドを使用して、この例に示す `keydown.code.shiftleft.altleft.keyt` のように正しい振る舞いを実現します。
   
   ```typescript
   <input (keydown.code.shiftleft.altleft.keyt)="onKeydown($event)" />
   ```

`code` フィールドは `key` フィールドよりも具体的です。`key` フィールドは常に `shift` を報告しますが、`code` フィールドは `leftshift` または `rightshift` を指定します。`code` フィールドを使用する場合、必要な動作をすべてキャッチするために別のバインディングを追加する必要がある場合があります。`code` フィールドを使用すると、MacOS の `shift + option` 動作のような OS 固有の挙動を避けることができます。

詳しくは、[key](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)と[code](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values)のフルリファレンスを参照すると、イベント文字列を構築するのに役立つでしょう。


## パッシブイベントへのバインディング

Angularは[passive event](https://developer.chrome.com/en/docs/lighthouse/best-practices/uses-passive-event-listeners/)リスナーもサポートしています。 

これは高度なテクニックであり、ほとんどのアプリケーションでは必要ありません。パフォーマンスの問題を引き起こしている頻繁に発生するイベントを最適化したい場合に、この方法が役に立つかもしれません。

Angularはパッシブイベントリスナーもサポートしています。たとえば、次の手順でスクロールイベントをパッシブにします。

1. `src` ディレクトリの下に `zone-flags.ts` というファイルを作成します。
2. このファイルに次の行を追加します。
   ```typescript
   (window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];
   ```
3. `src/polyfills.ts` ファイルで、zone.js をインポートする前に、新しく作成した `zone-flags` をインポートします。
   ```typescript
   import './zone-flags';
   import 'zone.js';  // Included with Angular CLI.
   ```

これらの手順の後、`scroll`イベントのイベントリスナーを追加すると、リスナーは`passive`になります。

## 次のステップ

* イベントバインディングの仕組みの詳細については、[イベントバインディングの仕組み](guide/event-binding-concepts)を参照してください。
* [プロパティバインディング](guide/property-binding)
* [テキスト補間](guide/interpolation)
* [双方向バインディング](guide/two-way-binding)

@reviewed 2023-09-01
