## 型付きフォーム

Angular 14から、リアクティブフォームはデフォルトで厳密に型付けされるようになりました。

このガイドの背景として、[Angular リアクティブフォーム](guide/forms/reactive-forms) に既に精通している必要があります。

## 型付きフォームの概要

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" alt="Angular の型付きフォーム" />

Angularリアクティブフォームでは、*フォームモデル* を明示的に指定します。単純な例として、この基本的なユーザーログインフォームを考えてみましょう。

```ts
const login = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

Angularは、この `FormGroup` と対話するための多くのAPIを提供しています。たとえば `login.value` や `login.controls`、`login.patchValue` などを呼び出せます。（完全なAPIリファレンスについては、[API ドキュメント](api/forms/FormGroup) を参照してください。）

以前のバージョンのAngularでは、これらのAPIのほとんどは、その型の中にどこかで `any` を含んでおり、コントロールの構造や値そのものと対話することが型安全ではありませんでした。たとえば、次のような無効なコードを書けてしまいます。

```ts
const emailDomain = login.value.email.domain;
```

厳密に型付けされたリアクティブフォームでは、上記のコードはコンパイルされません。なぜなら、`email` には `domain` プロパティがないからです。

追加された安全性に加えて、型はIDEでのより良いオートコンプリートや、フォーム構造を明示的に指定する方法など、さまざまな他の改善を可能にします。

これらの改善は、現時点では *リアクティブ* フォーム（[*テンプレート駆動* フォーム](guide/forms/template-driven-forms) ではありません）のみに適用されます。

## 型なしフォーム

型なしフォームは引き続きサポートされており、これまでどおり動作します。それらを使用するには、`@angular/forms` から `Untyped` シンボルをインポートする必要があります。

```ts
const login = new UntypedFormGroup({
  email: new UntypedFormControl(''),
  password: new UntypedFormControl(''),
});
```

各 `Untyped` シンボルは、以前のバージョンのAngularとまったく同じ意味を持ちます。`Untyped` プレフィックスを削除することで、段階的に型を有効にできます。

## `FormControl`: はじめに

最も単純なフォームは、単一のコントロールで構成されます。

```ts
const email = new FormControl('angularrox@gmail.com');
```

このコントロールは、自動的に `FormControl<string|null>` 型であると推測されます。TypeScriptは、`email.value`、`email.valueChanges`、`email.setValue(...)` など、[`FormControl` API](api/forms/FormControl) 全体にわたってこの型を自動的に強制します。

### ヌラビリティ

疑問に思うかもしれません。なぜこのコントロールの型には `null` が含まれているのでしょうか？これは、コントロールがいつでも `reset` を呼び出すことで `null` になる可能性があるためです。

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScriptは、コントロールが `null` になっている可能性を常に処理するように強制します。このコントロールをヌラブルでないものにする場合は、`nonNullable` オプションを使用できます。これにより、コントロールは `null` ではなく、初期値にリセットされます。

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

繰り返しますが、このオプションは `.reset()` が呼び出されたときのフォームのランタイム動作に影響を与え、注意深く切り替える必要があります。

### 明示的な型の指定

推測に頼るのではなく、型を指定できます。初期値が `null` であるコントロールを考えてみましょう。初期値が `null` であるため、TypeScriptは `FormControl<null>` を推測し、これは私たちが望むよりも狭いです。

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // エラー！
```

これを防ぐために、型を `string|null` として明示的に指定します。

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

## `FormArray`: 動的な同種コレクション

`FormArray` は、コントロールのオープンエンドリストを含んでいます。型パラメーターは、各内部コントロールの型に対応します。

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

この `FormArray` は、内部コントロール型 `FormControl<string|null>` を持つことになります。

配列内に複数の異なる要素型を含めたい場合は、`UntypedFormArray` を使用する必要があります。なぜなら、TypeScriptはどの要素型がどの位置に発生するかを推測できないからです。

## `FormGroup` と `FormRecord`

Angularは、列挙されたキーセットを持つフォームに `FormGroup` 型を提供し、オープンエンドまたは動的なグループに `FormRecord` という型を提供します。

### 部分的な値

再びログインフォームを考えてみましょう。

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

すべての `FormGroup` では、[コントロールを無効にすることができます](api/forms/FormGroup)。無効なコントロールは、グループの値に表示されません。

その結果、`login.value` の型は `Partial<{email: string, password: string}>` になります。この型における `Partial` は、各メンバーが `undefined` である可能性があることを意味します。

より具体的には、`login.value.email` の型は `string|undefined` であり、TypeScriptは、`undefined` である可能性のある値を処理するように強制します（`strictNullChecks` を有効にしている場合）。

無効なコントロールを含む値にアクセスしたい場合、つまり `undefined` である可能性のあるフィールドをバイパスしたい場合は、`login.getRawValue()` を使用できます。

### オプションのコントロールと動的グループ

一部のフォームには、存在する可能性がある場合とない場合があるコントロールが含まれており、実行時に追加または削除できます。これらのコントロールは、*オプションフィールド* を使用して表すことができます。

```ts
interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

このフォームでは、型を明示的に指定しているため、`password` コントロールをオプションにできます。TypeScriptは、オプションのコントロールのみを追加または削除できるように強制します。

### `FormRecord`

一部の `FormGroup` の使用方法は、上記の例に当てはまりません。なぜなら、キーが事前にわからないからです。`FormRecord` クラスは、そのケース用に設計されています。

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

`string|null` 型の任意のコントロールを、この `FormRecord` に追加できます。

動的（オープンエンド）でかつ異種（コントロールが異なる型である）な `FormGroup` が必要な場合、型安全性の向上は不可能であり、`UntypedFormGroup` を使用する必要があります。

`FormRecord` は、`FormBuilder` を使用して構築もできます。

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` と `NonNullableFormBuilder`

`FormBuilder` クラスは、上記の例と同じように、新しい型をサポートするようにアップグレードされました。

さらに、追加のビルダー `NonNullableFormBuilder` が使用できます。この型は、すべてのコントロールに `nonNullable: true}` を指定するための省略記号であり、大きなヌラブルでないフォームからかなりのボイラープレートを排除できます。`FormBuilder` の `nonNullable` プロパティを使用してアクセスできます。

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
  email: '',
  password: '',
});
```

上記の例では、両方の内部コントロールはヌラブルではありません（つまり、`nonNullable` が設定されます）。

`NonNullableFormBuilder` という名前を使用した注入もできます。
