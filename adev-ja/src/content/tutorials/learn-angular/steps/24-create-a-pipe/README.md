# カスタムパイプの作成

Angularでデータ変換のニーズに合わせてカスタムパイプを作成できます。

NOTE: 詳しくは、[カスタムパイプの作成についての詳細ガイド](/guide/templates/pipes#creating-custom-pipes)をご覧ください。

このアクティビティでは、カスタムパイプを作成してテンプレートで使用します。

<hr>

パイプは `@Pipe` デコレーターを付けたTypeScriptクラスです。例を挙げます。

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'star',
})
export class StarPipe implements PipeTransform {
  transform(value: string): string {
    return `⭐️ ${value} ⭐️`;
  }
}
```

`StarPipe` は文字列値を受け取り、その文字列を星で囲んだものを返します。以下の点に注意してください。

- `@Pipe` デコレーターの構成の `name` は、テンプレートで使用される名前です。
- `transform` 関数は、ロジックを記述する場所です。

では、実際に試してみましょう。`ReversePipe` を作成します。

<docs-workflow>

<docs-step title="`ReversePipe` の作成">

`reverse.pipe.ts` で `ReversePipe` クラスに `@Pipe` デコレーターを追加し、次の構成を指定します。

```ts
@Pipe({
    name: 'reverse'
})
```

</docs-step>

<docs-step title="`transform` 関数の実装">

これで、`ReversePipe` クラスはパイプになります。`transform` 関数を更新して、反転ロジックを追加します。

<docs-code language="ts" highlight="[3,4,5,6,7,8,9]">
export class ReversePipe implements PipeTransform {
    transform(value: string): string {
        let reverse = '';

        for (let i = value.length - 1; i >= 0; i--) {
            reverse += value[i];
        }

        return reverse;
    }

}
</docs-code>

</docs-step>

<docs-step title="テンプレートで `ReversePipe` を使用する"></docs-step>
パイプロジックを実装したら、最後のステップとしてテンプレートで使用します。`app.ts` でテンプレートにパイプを含め、コンポーネントのインポートに追加します。

<docs-code language="angular-ts" highlight="[3,4]">
@Component({
    ...
    template: `Reverse Machine: {{ word | reverse }}`
    imports: [ReversePipe]
})
</docs-code>

</docs-workflow>

これにて終了です。このアクティビティの完了、おめでとうございます。これでパイプの使い方と、独自のパイプを実装する方法がわかりました。
