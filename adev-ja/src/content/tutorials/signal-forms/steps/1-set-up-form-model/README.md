# フォームモデルを設定

すべてのシグナルフォームは、データの形状を定義し、フォームデータを格納するシグナルであるフォームデータモデルから始まります。

このレッスンでは、次の方法を学びます:

- フォームデータのTypeScriptインターフェースを定義
- フォーム値を保持するシグナルを作成
- `form()` 関数を使用してシグナルフォームを作成

ログインフォームの基礎を構築しましょう!

<hr />

<docs-workflow>

<docs-step title="LoginDataインターフェースを定義">
ログインフォームデータの構造を定義するTypeScriptインターフェースを作成します。フォームには次のものが含まれます:

- `email` フィールド（文字列）
- `password` フィールド（文字列）
- `rememberMe` フィールド（真偽値）

```ts
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

このインターフェースを `@Component` デコレーターの上に追加します。
</docs-step>

<docs-step title="signalとformをインポート">
`@angular/core` から `signal` 関数を、`@angular/forms/signals` から `form` 関数をインポートします:

```ts
import {Component, signal} from '@angular/core';
import {form} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="フォームモデルシグナルを作成">
コンポーネントクラスで、初期値を持つ `loginModel` シグナルを作成します。型パラメータとして `LoginData` インターフェースを使用します:

```ts
loginModel = signal<LoginData>({
  email: '',
  password: '',
  rememberMe: false,
});
```

初期値は、テキストフィールドには空文字列、チェックボックスには `false` として開始します。
</docs-step>

<docs-step title="フォームを作成">
モデルシグナルを `form()` 関数に渡してフォームを作成します:

```ts
loginForm = form(this.loginModel);
```

`form()` 関数は、モデルからフォームを作成し、フィールドの状態とバリデーションへのアクセスを提供します。
</docs-step>

</docs-workflow>

すばらしい! フォームモデルを設定しました。`loginModel` シグナルがフォームデータを保持し、`loginForm` が型安全性を備えた各フィールドへのアクセスを提供します。

次に、[フォームをテンプレートに接続する方法](/tutorials/signal-forms/2-connect-form-template)を学びます!
