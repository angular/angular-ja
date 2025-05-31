# フォームの検証

フォームを扱う際のもう1つの一般的なシナリオは、正しいデータが送信されるように、入力値を検証する必要があることです。

NOTE: 詳しくは、[フォーム入力の検証についての詳細ガイド](/guide/forms/reactive-forms#validating-form-input) をご覧ください。

このアクティビティでは、リアクティブフォームを使用してフォームを検証する方法を学びます。

<hr>

<docs-workflow>

<docs-step title="バリデーターのインポート">

Angularは、一連の検証ツールを提供しています。これらを使用するには、まずコンポーネントを更新して `@angular/forms` から `Validators` をインポートします。

<docs-code language="ts" highlight="[1]">
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class App {}
</docs-code>

</docs-step>

<docs-step title="フォームへの検証の追加">

各 `FormControl` には、`FormControl` 値の検証に使用したい `Validators` を渡すことができます。たとえば、`profileForm` の `name` フィールドを必須にする場合は、`Validators.required` を使用します。
Angularフォームの `email` フィールドでは、空欄ではないこと、および有効なメールアドレス構造に従っていることを確認する必要があります。これは、`Validators.required` と `Validators.email` バリデーターを配列で組み合わせることにより実現できます。
`name` と `email` の `FormControl` を更新します。

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</docs-step>

<docs-step title="テンプレートでのフォーム検証の確認">

フォームが有効かどうかを判断するには、`FormGroup` クラスには `valid` プロパティがあります。
このプロパティを使用して属性を動的にバインドできます。フォームの有効性に基づいて、送信 `button` を有効にするように更新します。

```angular-html
<button type="submit" [disabled]="!profileForm.valid">送信</button>
```

</docs-step>

</docs-workflow>

これで、リアクティブフォームでの検証の仕方の基本を理解しました。

Angularでのフォーム操作に関するこれらの基本的な概念を学ぶのは素晴らしいですね。さらに学びたい場合は、[Angularフォームドキュメント](guide/forms/form-validation) を参照してください。
