# Typed Forms

Angular 14 の時点で、リアクティブフォームはデフォルトで厳密に型指定されています。

<a id="prerequisites"></a>

## 前提条件

このガイドの背景として、すでに [Angular Reactive Forms](guide/reactive-forms "Reactive Forms") に精通している必要があります。

<a id="intro"></a>

## Typed Formsの概要

<div class="video-container">

<iframe src="https://www.youtube.com/embed/L-odCf4MfJc" title="Angular Typed Forms" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

</div>

Angular リアクティブフォームでは、*フォームモデル* を明示的に指定します。 簡単な例として、次の基本的なユーザーログインフォームを考えてみましょう。

```ts
const login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```

Angular は、この `FormGroup` と対話するための多くの API を提供します。 たとえば、`login.value`、`login.controls`、`login.patchValue` などを呼び出すことができます。(完全な API リファレンスについては、[API ドキュメント](api/forms/FormGroup)を参照してください)

以前の Angular バージョンでは、これらの API のほとんどは型のどこかに `any` を含んでおり、コントロールの構造または値自体とのやり取りは型安全ではありませんでした。 たとえば、次の無効なコードを記述できます。

```ts
const emailDomain = login.value.email.domain;
```

厳密に型指定されたリアクティブフォームでは、`email` に `domain` プロパティがないため、上記のコードはコンパイルされません。

追加された安全性に加えて、型により、IDE でのオートコンプリートの改善や、フォーム構造を明示的に指定する方法など、他のさまざまな改善が可能になります。

これらの改善は現在、*リアクティブ* フォームにのみ適用されます ([*テンプレート駆動* のフォーム](guide/forms "Forms Guide")には適用されません)。

<a id="automated-migration"></a>

## 型指定されていないフォームの自動移行

Angular 14 にアップグレードすると、含まれるマイグレーションにより、コード内のすべてのフォームクラスが対応する型指定されていないバージョンに自動的に置き換えられます。 たとえば、上記のスニペットは次のようになります。

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

各 `Untyped` シンボルは、以前の Angular バージョンとまったく同じセマンティクスを持っているため、アプリケーションは以前と同じようにコンパイルし続ける必要があります。 `Untyped` プレフィックスを削除することで、型を段階的に有効にすることができます。

<a id="form-control-inference"></a>

## `FormControl`: はじめる

もっとも単純なフォームは、1 つのコントロールで構成されます。

```ts
const email = new FormControl('angularrox@gmail.com');
```

このコントロールは、`FormControl<string|null>` 型であると自動的に推測されます。 TypeScript は、`email.value`、`email.valueChanges`、`email.setValue(...)` などの [`FormControl` API](api/forms/FormControl) 全体でこの型を自動的に適用します。

### Null可能性 

このコントロールの型に `null` が含まれているのはなぜでしょうか? これは、reset を呼び出すことにより、コントロールがいつでも `null` になる可能性があるためです。

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript は、コントロールが `null` になる可能性を常に処理することを強制します。 このコントロールを null 非許容にしたい場合は、`nonNullable` オプションを使用できます。 これにより、コントロールが `null` ではなく初期値にリセットされます。

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

繰り返しますが、このオプションは `.reset()` が呼び出されたときのフォームの実行時の動作に影響を与えるため、注意して反転する必要があります。

### 明示的な型の指定

推論に頼るのではなく、明示的に型を指定することができます。 `null` に初期化されたコントロールを考えてみましょう。 初期値が `null` であるため、TypeScript は `FormControl<null>` を推測しますが、これは必要以上に狭い型です。

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // エラー!
```

これを防ぐために、型を `string|null` として明示的に指定します。

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

<a id="form-array"></a>

## `FormArray`: 動的で均一なコレクション

`FormArray` には、可変長のコントロールのリストが含まれています。 type パラメーターは、各内部コントロールの型に対応します。

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

この `FormArray` は内部コントロール型 `FormControl<string|null>` を持ちます。

配列内に複数の異なる要素型が必要な場合は、`UntypedFormArray` を使用する必要があります。これは、TypeScript がどの要素型がどの位置に発生するかを推測できないためです。

<a id="form-group-record"></a>

## `FormGroup` と `FormRecord`

Angular は、列挙された一連のキーをもつフォーム用の `FormGroup` 型と、制限のないグループまたは動的グループ用の `FormRecord` と呼ばれる型を提供します。

### 部分的な値

ログインフォームをもう一度考えてみましょう。

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

任意の `FormGroup` で、[コントロールを無効にすることができます](api/forms/FormGroup)。 無効なコントロールはグループの値に表示されません。

結果として、`login.value` のタイプは `Partial<{email: string, password: string}>` になります。 この型の `Partial` は、各メンバーが未定義である可能性があることを意味します。

より具体的には、`login.value.email` のタイプは `string|undefined` であり、TypeScript は `undefined` の可能性がある値を処理することを強制します (`strictNullChecks` が有効になっている場合)。

無効なコントロールを *含む* 値にアクセスし、`undefined` の可能性のあるフィールドをバイパスする場合は、`login.getRawValue()` を使用できます。

### オプションのコントロールと動的グループ

一部のフォームには、実行時に追加および削除できるコントロールが存在する場合と存在しない場合があります。 *オプションのフィールド* を使用して、これらのコントロールを表すことができます。

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

このフォームでは、タイプを明示的に指定します。これにより、`password` コントロールをオプションにすることができます。 TypeScript は、オプションのコントロールのみを追加または削除できるように強制します。

### `FormRecord`

`FormGroup` の使い方によっては、キーが事前にわからないため上記のパターンに適合しません。 `FormRecord` クラスは、その場合のために設計されています。

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

`string|null` 型の任意のコントロールをこの `FormRecord` に追加できます。

動的 (可変長) かつ異種 (コントロールの型が異なる) の両方である `FormGroup` が必要な場合、型の安全性を向上させることはできないため、`UntypedFormGroup` を使用する必要があります。

`FormRecord` は `FormBuilder` を使用して構築することもできます。

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` と `NonNullableFormBuilder`

`FormBuilder` クラスは、上記の例と同じ方法で、新しい型もサポートするようにアップグレードされました。

さらに、`NonNullableFormBuilder` という追加のビルダーを使用できます。 この型は、すべてのコントロールで `{nonNullable: true}` を指定するための省略形であり、null 非許容の大きなフォームからかなりのボイラープレートを取り除くことができます。 `FormBuilder` の `nonNullable` プロパティを使用してアクセスできます。

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
    email: '',
    password: '',
});
```

上記の例では、両方の内部コントロールが null 非許容になります (つまり、`nonNullable` が設定されます)。

`NonNullableFormBuilder` という名前を使用して注入することもできます。

<!-- links -->

<!-- external links -->

[NinjaSquadTypedFormsBlog]: https://blog.ninja-squad.com/2022/04/21/strictly-typed-forms-angular/ "NinjaSquad | Strictly typed forms in Angular"

<!-- end links -->

@reviewed 2022-05-10
