# 組み込み制御フロー

Angularテンプレートは制御フローブロックをサポートしており、要素の表示、非表示、繰り返しを条件付きで行うことができます。

Note: これらは、以前は\*ngIf、\*ngFor、\*ngSwitchディレクティブで実現されました。

## `@if`、`@else-if`、`@else`で条件付きのコンテンツを表示する

`@if` ブロックは、条件式が真の場合に、そのコンテンツを条件付きで表示します。

```angular-html
@if (a > b) {
  <p>{{a}} is greater than {{b}}</p>
}
```

代替コンテンツを表示したい場合は、任意の数の `@else if` ブロックと単一の `@else` ブロックを指定できます。

```angular-html
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
```

### 条件式の結果への参照

`@if`条件式は、ブロック内で再利用できるように、条件式の結果を変数に保存できます。

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

これは、テンプレート内で読みやすく保守しやすいように長い式を参照するのに便利です。

## `@for`ブロックでコンテンツを繰り返す

`@for` ブロックは、コレクションをループし、ブロックのコンテンツを繰り返しレンダリングします。 コレクションは、任意のJavaScriptの[反復可能オブジェクト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)にできますが、Angularは `Array` 値に対して追加のパフォーマンス最適化を行っています。

一般的な `@for` ループは次のようになります。

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

### なぜ `@for` ブロックの `track` は重要なのか？

`track` 式を使用すると、Angularはデータとページ上のDOMノードの関係を維持できます。 これにより、Angularはデータが変更されたときに、必要なDOM操作を最小限に抑えてパフォーマンスを最適化できます。

`track` を効果的に使用すると、データコレクションをループ処理する場合に、アプリケーションのレンダリングパフォーマンスを大幅に向上させることができます。

`track` 式には、コレクション内の各アイテムを一意に識別するプロパティを選択します。 データモデルに一意の識別プロパティ（一般的には `id` または `uuid`）が含まれている場合は、この値を使用します。 データにこのようなフィールドが含まれていない場合は、追加することを強くお勧めします。

変更されない静的なコレクションの場合、`$index` を使用して、コレクション内のインデックスで各アイテムを追跡するようにAngularに指示できます。

他のオプションが利用できない場合は、`identity` を指定できます。 これは、Angularに三重等号演算子 (`===`) を使用して参照の同一性でアイテムを追跡するように指示します。 AngularはどのデータアイテムがどのDOMノードに対応するかをマップする方法がないため、可能な限りこのオプションを避けてください。レンダリングの更新が大幅に遅くなる可能性があります。

### `@for` ブロックのコンテキスト変数

`@for` ブロック内では、常にいくつかの暗黙の変数が使用できます。

| 変数 | 意味                                       |
| -------- | ------------------------------------- |
| `$count` | 反復処理されたコレクション内のアイテム数    |
| `$index` | 現在の行のインデックス                   |
| `$first` | 現在の行が最初の行かどうか                |
| `$last`  | 現在の行が最後の行かどうか                |
| `$even`  | 現在の行インデックスが偶数かどうか         |
| `$odd`   | 現在の行インデックスが奇数かどうか          |

これらの変数は常にこれらの名前で使用できますが、`let` セグメントを使用して別名をつけることができます。

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

別名は、`@for` ブロックをネストする場合に役立ちます。これにより、外側の `@for` ブロックから内側の `@for` ブロックの変数を取得できます。

### `@empty` ブロックを使用した `@for` ブロックのフォールバックの提供

`@for` ブロックのコンテンツの直後に、オプションで `@empty` セクションを含めることができます。 `@empty` ブロックのコンテンツは、アイテムがない場合に表示されます。

```angular-html
@for (item of items; track item.name) {
  <li> {{ item.name }}</li>
} @empty {
  <li aria-hidden="true"> There are no items.</li>
}
```

## `@switch` ブロックを使用して条件付きでコンテンツを表示する

`@if` ブロックはほとんどのシナリオで適していますが、`@switch` ブロックは条件付きでデータをレンダリングするための代替構文を提供します。 構文はJavaScriptの `switch` 文と非常によく似ています。

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer') {
    <app-reviewer-dashboard />
  }
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

条件式値は、三重等号 (`===`) 演算子を使用してケース式と比較されます。

**`@switch` にはフォールスルーはありません**。そのため、ブロックに `break` や `return` ステートメントに相当するものは必要ありません。

オプションで `@default` ブロックを含めることができます。 `@default` ブロックのコンテンツは、前のケース式のいずれもスイッチ値と一致しない場合に表示されます。

`@case` が式と一致せず、`@default` ブロックがない場合は、何も表示されません。
