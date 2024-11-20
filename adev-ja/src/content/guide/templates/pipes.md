# パイプ

## 概要

パイプは、Angularテンプレート式で、テンプレート内のデータを宣言的に変換することを可能にする特別な演算子です。パイプを使用すると、変換関数を一度宣言し、その変換を複数のテンプレートで使用できます。Angularのパイプは、[Unixパイプ](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>)に着想を得て、縦棒文字(`|`)を使用します。

Note: Angularのパイプ構文は、縦棒文字を[ビット単位のOR演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)に使用する標準的なJavaScriptとは異なります。Angularテンプレート式では、ビット単位の演算子はサポートされていません。

Angularが提供するいくつかの組み込みパイプを使用した例を以下に示します。

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
       <!-- Transform the company name to title-case and
       transform the purchasedOn date to a locale-formatted string -->
<h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

	    <!-- Transform the amount to a currency-formatted string -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCartComponent {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

Angularがコンポーネントをレンダリングすると、ユーザーのロケールに基づいて適切な日付形式と通貨が保証されます。ユーザーが米国にいる場合、次のようにレンダリングされます。

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

Angularによる値のローカリゼーションの詳細については、[i18nに関する詳細ガイド](/guide/i18n)を参照してください。

### 組み込みパイプ

Angularには、`@angular/common`パッケージに組み込みパイプのセットが含まれています。

| 名前                                          | 説明                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`AsyncPipe`](api/common/AsyncPipe)           | `Promise`またはRxJS`Observable`から値を読み取ります。                                      |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | ロケールルールに従って、数値を通貨文字列に変換します。                                |
| [`DatePipe`](api/common/DatePipe)             | ロケールルールに従って`Date`値をフォーマットします。                                             |
| [`DecimalPipe`](api/common/DecimalPipe)       | ロケールルールに従って、数値を小数点を含む文字列に変換します。                              |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | ロケールルールに従って、値を値の複数形にする文字列にマップします。                          |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | キーを、目的の値を返すカスタムセレクターにマップします。                                  |
| [`JsonPipe`](api/common/JsonPipe)             | デバッグのために、オブジェクトを`JSON.stringify`を使用した文字列表現に変換します。         |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | オブジェクトまたはMapを、キーと値のペアの配列に変換します。                                |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | テキストをすべて小文字に変換します。                                                            |
| [`PercentPipe`](api/common/PercentPipe)       | ロケールルールに従って、数値をパーセンテージ文字列に変換します。                             |
| [`SlicePipe`](api/common/SlicePipe)           | 要素のサブセット（スライス）を含む新しい配列または文字列を作成します。                      |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | テキストをタイトルケースに変換します。                                                                |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | テキストをすべて大文字に変換します。                                                            |

## パイプの使用

Angularのパイプ演算子は、テンプレート式内で縦棒文字(`|`)を使用します。パイプ演算子は二項演算子です。左側のオペランドは変換関数に渡される値であり、右側のオペランドはパイプの名前とその後の追加の引数（下記参照）です。

```angular-html
<p>Total: {{ amount | currency }}</p>
```

この例では、`amount`の値は、パイプ名が`currency`である`CurrencyPipe`に渡されます。その後、ユーザーのロケールに対するデフォルトの通貨がレンダリングされます。

### 同じ式で複数のパイプを組み合わせる

複数のパイプ演算子を使用することで、値に複数の変換を適用できます。Angularはパイプを左から右に実行します。

次の例は、ローカライズされた日付をすべて大文字で表示するために、パイプの組み合わせを示しています。

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### パイプにパラメータを渡す

一部のパイプは、変換を構成するためのパラメータを受け入れます。パラメータを指定するには、パイプ名の後にコロン(`:`)とパラメータ値を付けます。

たとえば、`DatePipe`は、日付を特定の方法でフォーマットするためのパラメータを受け取ることができます。

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm' }}.</p>
```

一部のパイプは、複数のパラメータを受け入れる場合があります。追加のパラメータ値は、コロン文字(`:`)で区切って指定できます。

たとえば、タイムゾーンを制御するために、2番目のオプションのパラメータを渡すこともできます。

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm':'UTC' }}.</p>
```

## パイプの動作

概念的には、パイプは入力値を受け取り、変換された値を返す関数です。

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <main>
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class AppComponent {
  amount = 123.45;
}
```

この例では、次のようになります。

1. `CurrencyPipe`は`@angular/common`からインポートされます
1. `CurrencyPipe`は`imports`配列に追加されます
1. `amount`データは`currency`パイプに渡されます

### パイプ演算子の優先順位

パイプ演算子は、`+`, `-`, `*`, `/`, `%`, `&&`, `||`, `??`などの他の二項演算子よりも優先順位が低くなっています。

```angular-html
<!-- firstName and lastName are concatenated before the result is passed to the uppercase pipe -->
{{ firstName + lastName | uppercase }}
```

パイプ演算子は、条件（三項）演算子よりも優先順位が高くなっています。

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

同じ式を括弧なしで記述した場合:

```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

代わりに次のように解析されます。

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

演算子の優先順位が不明確な場合は、常に式に括弧を使用してください。

### パイプによる変更検知

デフォルトでは、すべてのパイプは`pure`と見なされます。これは、プリミティブ入力値（`String`、`Number`、`Boolean`、`Symbol`など）または変更されたオブジェクト参照（`Array`、`Object`、`Function`、`Date`など）のみが実行されることを意味します。純粋なパイプは、Angularが渡された値が変更されていない場合に、変換関数を呼び出さないようにできるので、パフォーマンス上の利点があります。

その結果、オブジェクトプロパティや配列項目の変更は、オブジェクトまたは配列参照の全体が別のインスタンスに置き換えられない限り検出されません。このレベルの変更検知が必要な場合は、[配列やオブジェクト内の変更の検出](#detecting-change-within-arrays-or-objects)を参照してください。

## カスタムパイプの作成

`@Pipe`デコレーターを使用してTypeScriptクラスを実装することで、カスタムパイプを定義できます。パイプには、次の2つの要素が必要です。

- パイプデコレーターで指定された名前
- 値を変換する`transform`という名前のメソッド

TypeScriptクラスは、さらに`PipeTransform`インターフェースを実装して、パイプの型シグネチャを満たす必要があります。

文字列をケバブケースに変換するカスタムパイプの例を以下に示します。

```angular-ts
// kebab-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### `@Pipe`デコレーターの使用

カスタムパイプを作成する際は、`@angular/core`パッケージから`Pipe`をインポートし、TypeScriptクラスのデコレーターとして使用します。

```angular-ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

`@Pipe` デコレーターは `name` を必要とします。この `name` は、テンプレート内でパイプをどのように使用するかを制御します。

### カスタムパイプの名前付け規則

カスタムパイプの名前付け規則は、次の2つの規則で構成されます。

- `name` - camelCaseが推奨されます。ハイフンは使用しないでください。
- `クラス名` - `name`のPascalCaseバージョンに`Pipe`を追加したもの

### `PipeTransform`インターフェースの実装

`@Pipe`デコレーターに加えて、カスタムパイプは常に`@angular/core`の`PipeTransform`インターフェースを実装する必要があります。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

このインターフェースを実装することで、パイプクラスが正しい構造を持つことが保証されます。

### パイプの値を変換する

すべての変換は、最初の引数が渡される値で、戻り値が変換された値である`transform`メソッドによって呼び出されます。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `My custom transformation of ${value}.`
  }
}
```

### カスタムパイプにパラメータを追加する

`transform`メソッドにadditional parametersを追加することで、変換にパラメータを追加できます。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`

    if (format === 'uppercase') {
      return msg.toUpperCase()
    else {
      return msg
    }
  }
}
```

### 配列またはオブジェクト内の変更を検出する {#detecting-change-within-arrays-or-objects}

パイプで配列またはオブジェクト内の変更を検出する必要がある場合は、`pure`フラグを`false`の値で渡すことで、パイプを不純な関数としてマークする必要があります。

不純なパイプは、本当に必要な場合にのみ作成してください。不純なパイプは、注意深く使用しないと、パフォーマンスに大きな影響を与える可能性があります。

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featuredItemsImpure',
  pure: false,
})
export class FeaturedItemsImpurePipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`

    if (format === 'uppercase') {
      return msg.toUpperCase()
    else {
      return msg
    }
  }
}
```

Angular開発者は、パイプの`name`とクラス名に`Impure`を含めるという慣習を採用して、他の開発者に潜在的なパフォーマンス上の問題を知らせます。
