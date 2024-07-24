# イベントバインディング

イベントバインディングを使用すると、キーストローク、マウスの動き、クリック、タッチなどのユーザーアクションをリスンし、それに応答できます。

## イベントへのバインディング

HELPFUL: プロパティへのバインディングの詳細については、[プロパティバインディング](guide/templates/property-binding)を参照してください。

イベントにバインディングするには、Angularのイベントバインディング構文を使用します。
この構文は、等号の左側に括弧で囲まれたターゲットイベント名、右側に引用符で囲まれたテンプレートステートメントという構成です。

次の例を作成します。ターゲットイベント名は`click`、テンプレートステートメントは`onSave()`です。

<docs-code language="html" header="イベントバインディング構文">
<button (click)="onSave()">Save</button>
</docs-code>

イベントバインディングは、ボタンのクリックイベントをリスンし、クリックが発生するたびにコンポーネントの`onSave()`メソッドを呼び出します。

<img src='assets/images/guide/template-syntax/syntax-diagram.svg' alt="構文図">

### イベントターゲットの特定

イベントターゲットを特定するために、Angularはターゲットイベント名が既知のディレクティブのイベントプロパティと一致するかどうかをチェックします。

次の例を作成します。（Angularは`myClick`がカスタム`ClickDirective`のイベントかどうかをチェックします）

<docs-code path="adev/src/content/examples/event-binding/src/app/app.component.html" visibleRegion="custom-directive" header="src/app/app.component.html"/>

ターゲットイベント名`myClick`が`ClickDirective`の出力プロパティと一致しない場合、Angularは代わりに基になるDOM要素の`myClick`イベントにバインドします。

## キーボードイベントへのバインディング

Angularのバインディング構文を使用して、キーボードイベントにバインドできます。キーボードイベントにバインドするキーまたはコードを指定できます。`key`フィールドと`code`フィールドは、ブラウザのキーボードイベントオブジェクトのネイティブな一部です。デフォルトでは、イベントバインディングはキーボードイベントの`key`フィールドを使用することを前提としています。`code`フィールドも使用できます。

キーの組み合わせは`.`（ピリオド）で区切ることができます。たとえば、`keydown.enter`を使用すると、`enter`キーにイベントをバインドできます。`shift`、`alt`、`control`、Macの`command`キーなどの修飾子キーも使用できます。次の例は、キーボードイベントを`keydown.shift.t`にバインドする方法を示しています。

```angular-html
<input (keydown.shift.t)="onKeydown($event)" />
```

オペレーティングシステムによっては、一部のキーの組み合わせが期待するキーの組み合わせではなく、特殊文字を作成することがあります。たとえばmacOSでは、オプションキーとシフトキーを同時に使用すると特殊文字が作成されます。`keydown.shift.alt.t`にバインドすると、macOSではその組み合わせによって`t`ではなく`ˇ`という文字が生成されます。これはバインディングと一致せず、イベントハンドラーはトリガーされません。macOSで`keydown.shift.alt.t`にバインディングするには、この例に示すように`keydown.code.shiftleft.altleft.keyt`などの`code`キーボードイベントフィールドを使用して、正しい動作を取得します。

```angular-html
<input (keydown.code.shiftleft.altleft.keyt)="onKeydown($event)" />
```

`code`フィールドは`key`フィールドよりも具体的なものです。`key`フィールドは常に`shift`を報告しますが、`code`フィールドは`leftshift`または`rightshift`を指定します。`code`フィールドを使用する場合、必要なすべての動作をキャッチするために、別々のバインディングを追加する必要がある場合があります。`code`フィールドを使用すると、macOSの`shift + option`の動作などのOS固有の動作を処理する必要がなくなります。

詳細については、[key](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values)と[code](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values)の完全なリファレンスを参照してください。

## パッシブイベントへのバインディング

Angularは[パッシブイベント](https://developer.chrome.com/en/docs/lighthouse/best-practices/uses-passive-event-listeners/)リスナーもサポートしています。

これは、ほとんどのアプリケーションでは不要な高度なテクニックです。パフォーマンスの問題を引き起こしている頻繁に発生するイベントの処理を最適化する必要がある場合に役立ちます。

たとえば、スクロールイベントをパッシブにするには、`src/index.html`で特別なzone.jsフラグを設定する必要がある場合があります。

```angular-html
<!doctype html>
<html>
  <head>
    <script>
      window.__zone_symbol__PASSIVE_EVENTS = ['scroll'];
    </script>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

これらの手順の後、`scroll`イベントのイベントリスナーを追加すると、リスナーは`passive`になります。

上記の場合、zone.jsを使用しているアプリケーションのみに適用されることに注意してください。

## 次へ

<docs-pill-row>
  <docs-pill href="guide/templates/event-binding" title="イベントバインディングの仕組み"/>
  <docs-pill href="guide/templates/property-binding" title="プロパティバインディング"/>
  <docs-pill href="guide/templates/interpolation" title="テキスト補間"/>
  <docs-pill href="guide/templates/two-way-binding" title="双方向バインディング"/>
</docs-pill-row>
