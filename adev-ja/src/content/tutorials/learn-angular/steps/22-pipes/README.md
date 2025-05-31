# パイプ

パイプは、テンプレート内のデータを変換するために使用される関数です。一般的に、パイプは副作用を引き起こさない「純粋な」関数です。Angularには、コンポーネントでインポートして使用できる、役立つ組み込みパイプがいくつかあります。カスタムパイプの作成もできます。

NOTE: 詳しくは、[パイプの詳細ガイド](/guide/templates/pipes)をご覧ください。

このアクティビティでは、パイプをインポートしてテンプレートで使用します。

<hr>

テンプレートでパイプを使用するには、補間の式に含めます。次の例をご覧ください。

<docs-code language="angular-ts" highlight="[1,5,6]">
import {UpperCasePipe} from '@angular/common';

@Component({
    ...
    template: `{{ loudMessage | uppercase }}`,
    imports:[UpperCasePipe],
})
class App {
    loudMessage = 'we think you are doing great!'
}
</docs-code>

今度は、実際に試してみましょう。

<docs-workflow>

<docs-step title="`LowerCase` パイプをインポートする">
まず、`@angular/common` から `LowerCasePipe` のファイルレベルのインポートを追加して、`app.ts` を更新します。

```ts
import { LowerCasePipe } from '@angular/common';
```

</docs-step>

<docs-step title="パイプをテンプレートのインポートに追加する">
次に、`@Component()` デコレータの `imports` を更新して、`LowerCasePipe` への参照を含めます。

<docs-code language="ts" highlight="[3]">
@Component({
    ...
    imports: [LowerCasePipe]
})
</docs-code>

</docs-step>

<docs-step title="パイプをテンプレートに追加する">
最後に、`app.ts` のテンプレートを更新して、`lowercase` パイプを含めます。

```ts
template: `{{username | lowercase }}`
```

</docs-step>

</docs-workflow>

パイプは、出力の構成に使用できるパラメーターも受け取れます。次のアクティビティで詳しく説明します。

追伸、あなたは素晴らしいです⭐️
