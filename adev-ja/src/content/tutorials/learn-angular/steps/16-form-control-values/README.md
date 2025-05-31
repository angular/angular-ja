# フォームコントロールの値を取得する

Angularでフォームをセットアップしたら、次のステップはフォームコントロールから値にアクセスすることです。

NOTE: 詳しくは、[フォームコントロールの追加方法についてのガイド](/guide/forms/reactive-forms#adding-a-basic-form-control) を参照してください。

このアクティビティでは、フォーム入力から値を取得する方法を学びます。

<hr>

<docs-workflow>

<docs-step title="テンプレートに入力フィールドの値を表示する">

テンプレートに入力値を表示するには、コンポーネントの他のクラスプロパティと同様に、補間構文 `{{}}` を使用できます。

<docs-code language="angular-ts" highlight="[5]">
@Component({
  selector: 'app-user',
  template: `
    ...
    <p>フレームワーク: {{ favoriteFramework }}</p>
    <label for="framework">
      お気に入りのフレームワーク:
      <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
    </label>
  `,
})
export class User {
  favoriteFramework = '';
}
</docs-code>

</docs-step>

<docs-step title="入力フィールドの値を取得する">

コンポーネントクラスで入力フィールド値を参照する必要がある場合は、`this` 構文を使用してクラスプロパティにアクセスできます。

<docs-code language="angular-ts" highlight="[15]">
...
@Component({
  selector: 'app-user',
  template: `
    ...
    <button (click)="showFramework()">フレームワークを表示</button>
  `,
  ...
})
export class User {
  favoriteFramework = '';
  ...

  showFramework() {
    alert(this.favoriteFramework);
  }
}
</docs-code>

</docs-step>

</docs-workflow>

テンプレートに入力値を表示し、プログラムでアクセスする方法を学ぶことができました。

Angularを使用したフォーム管理の次の方法、リアクティブフォームに進む時が来ました。テンプレート駆動フォームの詳細については、[Angular フォームドキュメント](guide/forms/template-driven-forms) を参照してください。
