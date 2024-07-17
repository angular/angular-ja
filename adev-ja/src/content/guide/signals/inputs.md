# シグナル入力

シグナル入力を使用すると、親コンポーネントから値をバインドできます。
これらの値は `Signal` を使用して公開され、コンポーネントのライフサイクル中に変化する可能性があります。

HELPFUL: シグナル入力は現在、[開発者プレビュー](/reference/releases#developer-preview)にあります。

Angularは、2種類の入力をサポートしています。

**オプション入力**
`input.required` を使用しない限り、入力はデフォルトでオプショナルです。
明示的な初期値を指定できます。指定しない場合、Angularは暗黙的に `undefined` を使用します。

**必須入力**
必須入力は常に、指定された入力タイプの値を持ちます。
`input.required` 関数を使用して宣言されます。

```typescript
import {Component, input} from '@angular/core';

@Component({...})
export class MyComp {
  // オプション
  firstName = input<string>();         // InputSignal<string|undefined>
  age = input(0);                      // InputSignal<number>

  // 必須
  lastName = input.required<string>(); // InputSignal<string>
}
```

クラスメンバーのイニシャライザーとして `input` または `input.required` 関数を使用すると、Angularは自動的に入力を認識します。

## 入力に別名をつける

Angularは、クラスメンバー名を入力の名前として使用します。
別名を使用すると、公開名を変更できます。

```typescript
class StudentDirective {
  age = input(0, {alias: 'studentAge'});
}
```

これにより、ユーザーは `[studentAge]` を使用して入力にバインドできます。一方、コンポーネント内では `this.age` を使用して入力値にアクセスできます。

## テンプレートでの使用

シグナル入力は、読み取り専用のシグナルです。
`signal()` を使用して宣言されたシグナルと同様に、入力シグナルを呼び出すことで、入力の現在の値にアクセスできます。

```html
<p>First name: {{firstName()}}</p>
<p>Last name: {{lastName()}}</p>
```

この値へのアクセスは、リアクティブなコンテキストでキャプチャされ、入力値が変更されるたびに、Angular自身などのアクティブなコンシューマーに通知できます。

実際には、入力シグナルは、[シグナルガイド](guide/signals)で知られているシグナルの単純な拡張です。

```typescript
export class InputSignal<T> extends Signal<T> { ... }`.
```

## 値の派生

シグナルと同様に、`computed` を使用して入力から値を派生できます。

```typescript
import {Component, input, computed} from '@angular/core';

@Component({...})
export class MyComp {
  age = input(0);

  // 年齢を 2 倍した値。
  ageMultiplied = computed(() => this.age() * 2);
}
```

算出シグナルは、値をメモ化します。
詳細については、[計算されたシグナルに関するセクション](guide/signals#computed-signals)を参照してください。

## 変更の監視

シグナル入力を使用すると、ユーザーは `effect` 関数を利用できます。
この関数は、入力が変更されるたびに実行されます。

次の例を考えてみましょう。
`firstName` 入力が変更されるたびに、新しい値がコンソールに出力されます。

```typescript
import {input, effect} from '@angular/core';

class MyComp {
  firstName = input.required<string>();

  constructor() {
    effect(() => {
      console.log(this.firstName());
    });
  }
}
```

`console.log` 関数は、`firstName` 入力が変更されるたびに呼び出されます。
これは、`firstName` が使用可能になった直後と、`MyComp` のライフサイクル中の後続の変更に対して発生します。

## 値の変換

入力の値を、その意味を変更せずに、強制変換または解析したい場合があります。
変換は、親テンプレートからの生の値を、期待される型に変換します。
変換は、[純粋関数](https://en.wikipedia.org/wiki/Pure_function)である必要があります。

```typescript
class MyComp {
  disabled = input(false, {
    transform: (value: boolean|string) => typeof value === 'string' ? value === '' : value,
  });
}
```

上記の例では、`disabled` という名前の入力を宣言しています。この入力は、`boolean` 型と `string` 型の値を受け入れます。
これは、`transform` オプションの `value` の明示的なパラメーター型によってキャプチャされます。
これらの値は、変換によって `boolean` に解析され、`boolean` になります。

このように、`this.disabled()` を呼び出す際に、コンポーネント内では `boolean` のみを使用できます。一方、コンポーネントのユーザーは、空の文字列を省略記号として渡して、コンポーネントを無効にできます。

```html
<my-custom-comp disabled>
```

IMPORTANT: 入力の意味を変更する場合、または[不純な](https://en.wikipedia.org/wiki/Pure_function#Impure_functions)関数の場合は、変換を使用しないでください。
代わりに、意味が異なる変換には `computed` を、入力が変更されるたびに実行されるべき不純なコードには `effect` を使用してください。

## なぜシグナル入力を使用すべきなのか、`@Input()` を使用すべきではないのか

シグナル入力は、デコレーターベースの `@Input()` のリアクティブな代替手段です。

デコレーターベースの `@Input` と比較して、シグナル入力は多くの利点があります。

1. シグナル入力は、より**型安全**です。
  <br/>• 必須入力は、初期値や、入力に常に値があることをTypeScriptに伝えるためのトリックを必要としません。
  <br/>• 変換は、受け入れられた入力値と一致するように自動的にチェックされます。
2. テンプレートで使用されるシグナル入力は、`OnPush` コンポーネントを**自動的に**ダーティにします。
3. 入力が変更されるたびに、`computed` を使用して簡単に値を**派生**できます。
4. `ngOnChanges` やセッターの代わりに、`effect` を使用することで、入力の監視が簡単になり、より局所的になります。
