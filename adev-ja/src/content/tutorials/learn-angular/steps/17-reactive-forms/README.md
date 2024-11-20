# リアクティブフォーム

テンプレートに頼らずフォームをプログラムで管理する場合、リアクティブフォームが答えとなります。

このアクティビティでは、リアクティブフォームの設定方法を学びます。

<hr>

<docs-workflow>

<docs-step title="`ReactiveForms`モジュールのインポート">

`app.component.ts`で、`@angular/forms`から`ReactiveFormsModule`をインポートし、コンポーネントの`imports`配列に追加します。

```angular-ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <label>Name
        <input type="text" />
      </label>
      <label>Email
        <input type="email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
```

</docs-step>

<docs-step title="`FormGroup`オブジェクトをFormControlsで作成">

リアクティブフォームは、`FormControl`クラスを使用してフォームコントロール（入力など）を表します。Angularは、フォームコントロールを便利なオブジェクトにグループ化し、開発者が大規模なフォームをより簡単に処理できるようにする`FormGroup`クラスを提供します。

`@angular/forms`からのインポートに`FormControl`と`FormGroup`を追加して、各フォームに`FormGroup`を作成し、`name`と`email`のプロパティを`FormControl`として使用します。

```ts
import {ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
...
export class AppComponent {
  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });
}
```

</docs-step>

<docs-step title="`FormGroup`とFormControlsをフォームにリンク">

各`FormGroup`は、`[formGroup]`ディレクティブを使用してフォームにアタッチする必要があります。

さらに、各`FormControl`は`formControlName`ディレクティブでアタッチし、対応するプロパティに割り当てることができます。次のフォームコードを使用してテンプレートを更新します。

```angular-html
<form [formGroup]="profileForm">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
  <button type="submit">Submit</button>
</form>
```

</docs-step>

<docs-step title="フォームの更新を処理">

`FormGroup`からデータにアクセスする必要がある場合は、`FormGroup`の値にアクセスすることで行うことができます。テンプレートを更新してフォームの値を表示します。

```angular-html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="`FormGroup`の値にアクセス">
コンポーネントクラスに、後でフォームの送信処理に使用される`handleSubmit`という新しいメソッドを追加します。
このメソッドはフォームの値を表示します。`FormGroup`から値にアクセスできます。

コンポーネントクラスに、フォームの送信を処理する`handleSubmit()`メソッドを追加します。

<docs-code language="ts">
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
</docs-code>
</docs-step>

<docs-step title="`ngSubmit`をフォームに追加">
フォームの値にアクセスできるようになりました。次は、送信イベントを処理し、`handleSubmit`メソッドを使用します。
Angularには、`ngSubmit`というこの特定の目的に合わせたイベントハンドラーがあります。フォーム要素を更新して、フォームが送信されたときに`handleSubmit`メソッドを呼び出します。

<docs-code language="angular-html" highlight="[3]">
<form
  [formGroup]="profileForm"
  (ngSubmit)="handleSubmit()">
</docs-code>

</docs-step>

</docs-workflow>

このようにして、Angularのリアクティブフォームの使い方を学びました。

このアクティビティは素晴らしいですね。フォームの検証について学ぶために進んでください。
