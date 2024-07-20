# ローカルテンプレート変数

Angularの `@let` 構文を使用すると、ローカル変数を定義してテンプレート全体で再利用できます。

IMPORTANT: `@let` 構文は現在 [開発者プレビュー](/reference/releases#developer-preview) です。

## 構文

`@let` 宣言は [JavaScript の `let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) に似ており、
その値は有効なAngular式であれば何でもかまいません。
式はテンプレートが実行されるたびに再評価されます。

```html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.1459;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
                      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                      'Ut enim ad minim veniam...';
```

### `@let` の値を参照する

`@let` を宣言したら、テンプレートのどこでも再利用できます。

```html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>

  <button (click)="update(user)">プロファイルの更新</button>
}
```

## 代入可能性

`@let` とJavaScriptの `let` の主な違いは、`@let` はテンプレート内で再代入できないことです。
ただし、Angularが変更検知を実行するときに値が再計算されます。

```html
@let value = 1;

<!-- 無効 -->
<button (click)="value = value + 1">値を増やす</button>
```

## スコープ

`@let` 宣言は、現在のビューとその子孫にスコープされます。
ホイストされないため、親ビューや兄弟ビューからアクセスできません。

```html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

{{topLevel}} <!-- 有効 -->
{{insideDiv}} <!-- 有効 -->

@if (condition) {
  {{topLevel + insideDiv}} <!-- 有効 -->

  @let nested = value;

  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- 有効 -->
  }
}

<div *ngIf="condition">
  {{topLevel + insideDiv}} <!-- 有効 -->

  @let nestedNgIf = value;

  <div *ngIf="condition">
     {{topLevel + insideDiv + nestedNgIf}} <!-- 有効 -->
  </div>
</div>

{{nested}} <!-- エラー、@if からホイストされていない -->
{{nestedNgIf}} <!-- エラー、*ngIf からホイストされていない -->
```

## 構文の定義

`@let` 構文は正式には次のように定義されています。
* `@let` キーワード。
* それに続く1つ以上の空白 (改行は含まない)。
* それに続く有効なJavaScript名と0個以上の空白。
* それに続く `=` 記号と0個以上の空白。
* それに続くAngular式 (複数行にすることも可能)。
* それに続く `;` 記号。
