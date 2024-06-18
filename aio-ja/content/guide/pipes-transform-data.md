# パラメーターと連鎖されたパイプによるデータの変換

パイプの中には出力を微調整するために_オプショナル_パラメーターをもつものがあります。

たとえば、[`CurrencyPipe`](api/common/CurrencyPipe 'API reference')はパラメータとして国コードを受け取ります。
パラメーターを指定するために、パイプ名(`currency`)の後にコロン(`:`)を置き、続けてパラメーターの値(国コード)を書きます。

テンプレート式`{{ amount | currency:'EUR' }}`はamountを表示しますが、ユーロ記号(€)がプリフィクスになります。

パイプの中には_オプショナル_パラメーターを複数受け取るものもあります。パイプにそれぞれのパラメーターを渡すのですが、コロンで区切ります。

たとえば、`{{ amount | currency:'EUR':'Euros '}}`はユーロ記号の代わりにラベル"Euros"(2つ目のパラメーター)でamountを表示します。

[`SlicePipe`](/api/common/SlicePipe 'API reference for SlicePipe')のように、パイプの中には少なくとも1つのパラメーターを_必須とする_と同時に_オプショナル_ パラメーターを受け取るものがあります。

式`{{ anArray | slice:1:5 }}`は要素`1`で始まり要素`5`で終わる部分集合を含む新しい文字列を表示します。

## 例： 日付の書式を整える

次の例は[`DatePipe`](api/common/DatePipe 'API reference')でヒーローの誕生日の書記を整える方法をデモンストレーションします。

<code-tabs>
    <code-pane header="birthday-formatting.component.html (template)" path="pipes/src/app/birthday-formatting.component.html"></code-pane>
    <code-pane header="birthday-formatting.component.ts (class)" path="pipes/src/app/birthday-formatting.component.ts"></code-pane>
</code-tabs>

テンプレートでは、最初の式では_リテラルの_日付フォーマットのパラメーターである"shortDate"を用いて誕生日を`DatePipe`に渡しています。出力は**04/15/88**です。

2つ目の式では誕生日を_コンポーネントのプロパティーにバインドされた_日付フォーマットパラメーター(`format`)を用いてDatePipeに渡しています。

"Toggle"ボタンをクリックすることで[たくさんの事前に定義されたフォーマット](api/common/DatePipe#pre-defined-format-options)のうち2つである`'mediumDate'`と`'fullDate'`を切り替えることができます。出力は**April 15, 1988**か**Friday, April 15, 1988**です。

ページは指定されたフォーマットで誕生日を表示します。

## 例: 2つのパイプを連結する

１つのパイプの出力が次のパイプの入力になるように、「パイプ連鎖文法」を使うことで複数のパイプをつなぎます。

次の例は誕生日を`DatePipe`に渡してから[`UpperCasePipe`](api/common/UpperCasePipe 'API reference')パイプに「パイプ連鎖文法」を使うことでその結果を送ります。

前回同様、フォーマットパラメーターを_伴う_および_伴わない_場合の両者において`DatePipe`のデモンストレーションをします。両者の結果(**APR 15, 1988**および**FRIDAY, APRIL 15, 1988**)は大文字になることを注意してください。

<code-tabs>
    <code-pane header="birthday-pipe-chaining.component.html (template)" path="pipes/src/app/birthday-pipe-chaining.component.html"></code-pane>
    <code-pane header="birthday-pipe-chaining.component.ts (class)" path="pipes/src/app/birthday-pipe-chaining.component.ts"></code-pane>
</code-tabs>

これが[スタンドアロンコンポーネント](guide/standalone-components)であることを確認するためにクラスファイルに切り替えてください。すべての組み込みパイプの源である`@angular/common`から2つのパイプをインポートしています。

@reviewed 2023-08-14
