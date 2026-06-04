# テンプレートでパイプを使用する

パイプを適用するには、次のコード例に示すように、テンプレート式内でパイプ演算子（`|`）を使用します。

<docs-code language="angular-html" header="app.component.html">
<p>ヒーローの誕生日は {{ birthday | date }}</p>
</docs-code>

コンポーネントの `birthday` 値は、パイプ演算子（`|`）を介して、パイプ名が `date` である [`DatePipe`](api/common/DatePipe) に渡されます。
パイプは、**Apr 07, 2023** のようなデフォルト形式で日付をレンダリングします。

<docs-code header="app.component.ts" preview>
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './app.component.html',
  imports: [DatePipe],
})
export class AppComponent {
  birthday = new Date();
}
</docs-code>

## パイプの追加パラメータ

パイプは、変換を構成する追加パラメータを受け取ることができます。パラメータはオプションまたは必須にできます。

たとえば、`date` パイプは、日付の表示形式を制御するオプションのパラメータを受け取ります。
パラメータを指定するには、パイプ名にコロン（`:`）とパラメータ値（形式）を続けます。

<docs-code language="angular-html" header="app.component.html">
<p>ヒーローの誕生日は {{ birthday | date:'yyyy' }}</p>
</docs-code>

パイプは、複数のパラメータを受け取ることができます。コロン（`:`）で区切ることで、複数のパラメータを渡すことができます。
たとえば、`date` パイプは、タイムゾーンを制御するための2つ目のオプションのパラメータを受け取ります。

<docs-code header="app.component.html">
<p>現在の時刻は: {{ currentTime | date:'hh:mm':'UTC' }}</p>
</docs-code>

これにより、`UTC` タイムゾーンの現在時刻（例: `10:53`）が表示されます。

## パイプの連結

複数のパイプを接続して、1つのパイプの出力を出力して、次のパイプの入力にできます。

次の例では、日付を `DatePipe` に渡し、その結果を [`UpperCasePipe`](api/common/UpperCasePipe 'API reference') パイプに転送します。

<docs-code language="angular-html" header="app.component.html">
<p>ヒーローの誕生日は {{ birthday | date }}</p>
<p>ヒーローの誕生日は {{ birthday | date:'yyyy' | uppercase }}</p>
</docs-code>
