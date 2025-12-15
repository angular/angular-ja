# パイプによるデータのフォーマット

パイプはオプションを渡すことで、さらに使い道を広げることができます。

NOTE: 詳しくは、[パイプによるデータのフォーマットに関する詳細ガイド](/guide/templates/pipes)をご覧ください。

このアクティビティでは、いくつかのパイプとパイプパラメーターについて学びます。

<hr>

パイプにパラメーターを渡すには、`:`構文の後にパラメーター値を記述します。例を以下に示します。

```angular-html
template: `{{ date | date:'medium' }}`;
```

出力は `Jun 15, 2015, 9:43:11 PM` となります。

パイプの出力をカスタマイズしてみましょう。

<docs-workflow>

<docs-step title="`DecimalPipe` を使用して数値をフォーマットする">

`app.ts` のテンプレートを更新して、`decimal` パイプのパラメーターを含めます。

```ts {highlight:[3]}
template: `
  ...
  <li>Number with "decimal" {{ num | number:"3.2-2" }}</li>
`
```

NOTE: このフォーマットは何でしょう？`DecimalPipe` のパラメーターは `digitsInfo` と呼ばれ、`{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}` のフォーマットを使用します。

</docs-step>

<docs-step title="`DatePipe` を使用して日付をフォーマットする">

次に、テンプレートを更新して `date` パイプを使用します。

```ts {highlight:[3]}
template: `
  ...
  <li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
```

さらに楽しくするために、`date` に対してさまざまなパラメーターを試してみてください。詳細については、[Angular ドキュメント](guide/templates/pipes)を参照してください。

</docs-step>

<docs-step title="`CurrencyPipe` を使用して通貨をフォーマットする">

最後の作業として、テンプレートを更新して `currency` パイプを使用します。

```ts {highlight:[3]}
template: `
  ...
  <li>Currency with "currency" {{ cost | currency }}</li>
`
```

`currency` に対してさまざまなパラメーターを試すこともできます。詳細については、[Angular ドキュメント](guide/templates/pipes)を参照してください。

</docs-step>

</docs-workflow>

パイプに関するすばらしい作業です。ここまですばらしい進歩を遂げてきましたね。

アプリケーションで使用できる組み込みのパイプは他にもたくさんあります。[Angular ドキュメント](guide/templates/pipes)でそのリストを見つけることができます。

組み込みのパイプがニーズを満たさない場合は、カスタムパイプの作成もできます。詳細については、次のレッスンをご覧ください。
