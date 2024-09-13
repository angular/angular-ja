# テンプレート内の変数

Angularには、テンプレート内で2種類の変数宣言があります。 ローカルテンプレート変数とテンプレート参照変数です。

## `@let` を使ったローカルテンプレート変数

Angularの `@let` 構文を使用すると、ローカル変数を定義し、テンプレート全体で再利用できます。これは、[JavaScriptの`let`構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)に似ています。

IMPORTANT: `@let`構文は現在、[Developer Preview](/reference/releases#developer-preview)にあります。

### `@let` の使用方法

`@let` を使用して、テンプレート式の結果に基づいた値を持つ変数を宣言します。 Angularは、[バインディング](./bindings)と同様に、指定された式を使用して変数の値を自動的に最新の状態に保ちます。

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.1459;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
                      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                      'Ut enim ad minim veniam...';
```

各`@let`ブロックでは、ちょうど1つの変数を宣言できます。コンマを使用して同じブロックに複数の変数の宣言はできません。

### `@let` の値を参照する

`@let` で変数を宣言したら、同じテンプレート内で再利用できます。

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### 代入可能性

`@let` とJavaScriptの `let` の主な違いは、`@let` は宣言後に再代入できないことです。ただし、Angularは指定された式を使用して変数の値を自動的に最新の状態に保ちます。

```angular-html
@let value = 1;

<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```

### 変数のスコープ

`@let` 宣言は、現在のビューとその子孫にスコープされます。 Angularは、コンポーネントの境界と、テンプレートに動的なコンテンツ（制御フローブロック、`@defer`ブロック、または構造ディレクティブなど）が含まれる可能性がある場所に新しいビューを作成します。

`@let` 宣言はホイスティングされないため、親ビューまたは兄弟から**アクセスできません**。

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

{{topLevel}} <!-- Valid -->
{{insideDiv}} <!-- Valid -->

@if (condition) {
  {{topLevel + insideDiv}} <!-- Valid -->

  @let nested = value;

  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- Valid -->
  }
}

<div *ngIf="condition">
  {{topLevel + insideDiv}} <!-- Valid -->

  @let nestedNgIf = value;

  <div *ngIf="condition">
     {{topLevel + insideDiv + nestedNgIf}} <!-- Valid -->
  </div>
</div>

{{nested}} <!-- Error, not hoisted from @if -->
{{nestedNgIf}} <!-- Error, not hoisted from *ngIf -->
```

### 構文全体

`@let`構文は正式には次のように定義されています。

- `@let`キーワード。
- その後に空白が1つ以上続きます（改行は含まれません）。
- その後に、有効なJavaScript名と空白が0個以上続きます。
- その後に `=` 記号と空白が0個以上続きます。
- その後に、複数行になる可能性のあるAngular式が続きます。
- `；`記号で終了します。

## テンプレート参照変数 {#template-reference-variables}

テンプレート参照変数は、テンプレート内の要素の値を参照する変数を宣言する方法です。

テンプレート参照変数は、次を指すことができます。

- テンプレート内のDOM要素（[カスタム要素](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)を含む）
- Angularコンポーネントまたはディレクティブ
- [ng-template](/api/core/ng-template)からの[TemplateRef](/api/core/TemplateRef)

テンプレート参照変数を使用すると、テンプレートの1つの部分から同じテンプレートの別の部分の情報を取得できます。

### テンプレート参照変数を宣言する

テンプレート内の要素に、ハッシュ記号 (`#`) と変数名の後に続く属性を追加することで、変数を宣言できます。

```angular-html
<!-- "taskInput" という名前のテンプレート参照変数を、HTMLInputElementに関連付ける -->
<input #taskInput placeholder="Enter task name">
```

### テンプレート参照変数に値を代入する

Angularは、変数が宣言されている要素に基づいて、テンプレート変数に値を代入します。

変数をAngularコンポーネントに宣言した場合、変数はコンポーネントインスタンスを参照します。

```angular-html
<!-- `startDate` 変数は、`MyDatepicker` のインスタンスに代入されます。 -->
<my-datepicker #startDate />
```

変数を `<ng-template>` 要素に宣言した場合、変数はテンプレートを表すTemplateRefインスタンスを参照します。詳細については、[構造ディレクティブ](/guide/directives/structural-directives)の[Angularがアスタリスク、\*、構文を使用する方法](/guide/directives/structural-directives#asterisk)を参照してください。

```angular-html
<!-- `myFragment` 変数は、このテンプレートフラグメントに対応する `TemplateRef` インスタンスに代入されます。 -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

変数を他の表示されている要素に宣言した場合、変数は `HTMLElement` インスタンスを参照します。

```angular-html
<!-- "taskInput" 変数は、HTMLInputElement インスタンスを参照します。 -->
<input #taskInput placeholder="Enter task name">
```

#### Angularディレクティブへの参照を代入する

Angularディレクティブには、テンプレートでディレクティブを参照できる名前を定義する `exportAs` プロパティがある場合があります。

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }
```

要素にテンプレート変数を宣言する場合、この `exportAs` 名を指定することで、変数にディレクティブインスタンスを代入できます。

```angular-html
<!-- `firstZone` 変数は、`DropZone` ディレクティブインスタンスを参照します。 -->
<section dropZone #firstZone="dropZone"> ... </section>
```

`exportAs` 名を指定していないディレクティブは参照できません。

### クエリでのテンプレート参照変数の使用

テンプレート参照変数は、同じテンプレートの別の部分から値を読み取るだけでなく、[コンポーネントとディレクティブのクエリ](/guide/components/queries)のために要素を「マーク」するためにも使用できます。

テンプレート内の特定の要素をクエリする場合は、その要素にテンプレート変数を宣言し、変数名に基づいて要素をクエリできます。

```angular-html
 <input #description value="Original description">
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // テンプレート変数名に基づいて入力要素をクエリします。
  @ViewChild('description') input: ElementRef | undefined;
}
```

クエリの詳細については、[クエリによる子の参照](/guide/components/queries)を参照してください。
