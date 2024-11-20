# フォームの概要

フォームは、多くのアプリケーションで重要な役割を果たします。なぜなら、フォームによってアプリケーションはユーザーからの入力を取得できるようになるからです。Angularにおけるフォームの処理方法について学びましょう。

Angularには、テンプレート駆動型フォームとリアクティブフォームの2つのタイプのフォームがあります。次のいくつかの活動で、両方のフォームについて学びます。

この活動では、テンプレート駆動型アプローチを使用してフォームを設定する方法を学びます。

<hr>

<docs-workflow>

<docs-step title="入力フィールドの作成">

`user.component.ts`で、`id`が`framework`に設定され、`type`が`text`に設定されたテキスト入力を使用してテンプレートを更新します。

```angular-html
<label for="framework">
  好きなフレームワーク:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="`FormsModule`のインポート">

このフォームでフォームにデータバインディングを可能にするAngularの機能を使用するには、`FormsModule`をインポートする必要があります。

`@angular/forms`から`FormsModule`をインポートし、`UserComponent`の`imports`配列に追加します。

<docs-code language="ts" highlight="[2, 7]">
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  ...
  imports:[FormsModule],
})
export class UserComponent {}
</docs-code>

</docs-step>

<docs-step title="入力の値へのバインディングの追加">

`FormsModule`には、`ngModel`と呼ばれるディレクティブがあり、このディレクティブは入力の値をクラスのプロパティにバインドします。

入力で`ngModel`ディレクティブを使用するように更新します。具体的には、`[(ngModel)]="favoriteFramework"`という構文を使用して、`favoriteFramework`プロパティにバインドします。

<docs-code language="html" highlight="[3]">
<label for="framework">
  好きなフレームワーク:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
</docs-code>

変更を加えたら、入力フィールドに値を入力してみてください。画面上でどのように更新されるかを確認してください（はい、非常にクールです）。

注: `[()]`という構文は、「バナナインボックス」として知られていますが、プロパティバインディングとイベントバインディングの2つのバインディングを表します。[Angularのドキュメントの双方向データバインディング](guide/templates/two-way-binding)の詳細については、こちらをご覧ください。

</docs-step>

</docs-workflow>

これで、Angularでフォームを構築するための重要な最初のステップを踏み出しました。

素晴らしいですね。勢いを維持しましょう！
