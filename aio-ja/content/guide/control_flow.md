# 組み込みのフロー制御

Angularテンプレートは*フロー制御ブロック*をサポートしており、
条件付きの要素の表示、非表示、および要素の繰り返しを行うことができます。

<div class="alert is-important">

Angular の組み込みのフロー制御は[developer preview](/guide/releases#developer-preview)に含まれています。
試してみることはできますが、安定する前に変更される可能性があります。 

</div>

## `@if` ブロック: 条件による分岐

`@if`ブロックは、その条件式が真であるとき、その内容を条件付きで表示します：

```html
@if (a > b) {
  {{a}} is greater than {{b}}
}
```

`@if`ブロックは、1つ以上の関連するブランチをもつことができます。
`@if`ブロックの直後には、任意の数の`@else if`ブロックと1つの`@else`ブロックを指定できます:

```html
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
```

### 条件式の結果を参照する

`@if`ブロックの条件式の結果への参照を作成し、
その参照をブロックの内容の中で使用することができます。

```html
@if (users$ | async; as users) {
  {{ users.length }}
}
```

## `@for` ブロック: 繰り返し

`@for` ブロックは、コレクション内の各アイテムに対してその内容を表示します。

```html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

コレクションは任意の
JavaScript [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) であることができますが、
標準の JavaScript `Array` がパフォーマンス上で有利です。

### 2つのコレクションの差分を計算するための `track`

`@for` ブロックは `track` 式を必要とします。
Angular はこの式の値を各アイテムの一意の識別子として使用します。
この識別子により、フレームワークはアイテムが追加、削除、または並べ替えられた後に必要な最小限の DOM 操作を実行できます。

シンプルなケースでは、`track $index` を合理的なデフォルトとして使用できます。

### `$index` およびその他のコンテキスト変数

`@for` 内のコンテンツでは、いくつかの暗黙的な変数が常に利用可能です:

| 変数 | 意味                                       |
|----------|-----------------------------------------------|
| `$count` | 繰り返し処理されるコレクションのアイテム数 |
| `$index` | 現在の行のインデックス                      |
| `$first` | 現在の行が最初の行であるかどうか            |
| `$last`  | 現在の行が最後の行であるかどうか            |
| `$even`  | 現在の行のインデックスが偶数であるかどうか  |
| `$odd`   | 現在の行のインデックスが奇数であるかどうか  |

これらの変数は常にこの名前で利用可能ですが、`let` セグメントによって別名を付けることができます:

```html
@for (item of items; track item.id; let idx = $index, e = $even) {
  Item #{{ idx }}: {{ item.name }}
}
```

エイリアスは、これらの変数の値をより深いブロックで参照できるようにするため、
`@for` ブロックをネストするときに便利です。

### `empty` ブロック

`@for` ブロックの直後に `@empty` セクションをオプションで指定できます。
`@empty` ブロックの内容は、コレクションが空の場合に表示されます:

```html
@for (item of items; track item.name) {
  <li> {{ item.name }}</li>
} @empty {
  <li> There are no items.</li>
}
```

## `@switch` ブロック: 場合分け

`switch` の構文は、JavaScript の `switch` 文に着想を得ており、`if` に似ています:

```html
@switch (condition) {
  @case (caseA) {
    Case A.
  }
  @case (caseB) {
    Case B.
  }
  @default {
    Default case.
  }
}
```

条件式の値は、`===` 演算子を使用してケース式と比較されます。

**`@switch` には fallthrough がありません** そのため、
`break` や `return` に相当するものは必要ありません。

`@default` ブロックはオプションで、省略することができます。
`@case` が式にマッチせず、`@default` ブロックがない場合、何も表示されません。

## 組み込みのフロー制御と `NgIf`、`NgSwitch`、`NgFor` の比較

`@if` ブロックは`*ngIf` を置き換え、UI の条件による分岐を表現します。

`@switch` ブロックは `ngSwitch` を置き換え、大きな利点があります:

* `@switch` ブロックは、
  条件式または各条件付きテンプレートのコンテナ要素を必要としません。
* `@switch` ブロックは、テンプレートの型チェックをサポートしており、各ブランチ内での型の狭まりを含みます。

`@for` ブロックは、繰り返しのための `*ngFor` を置き換え、
前身であるその構造ディレクティブの `NgFor` と比較していくつかの違いがあります:

* `@for` ブロックは、コレクション内の各アイテムを一意に識別するためのトラッキング式を必要とします。
  `NgFor` は `trackBy` _メソッド_ を必要としますが、
  `@for` ブロックは `track` _式_ を受け入れることで、トラッキングを簡素化します。
* コレクションが空の場合に表示するコンテンツを指定できます。
* `@for` ブロックは、コレクションが変更された後に必要な最小限の DOM 操作を決定するための最適化されたアルゴリズムを使用します。
  `NgFor` は開発者がカスタムの `IterableDiffer` 実装を提供できるようにしていましたが、
  `@for` ブロックはカスタムの differ をサポートしていません。

`track` の設定は `NgFor` の `trackBy` 関数の概念を置き換えます。
`@for` は組み込みなので、`trackBy` 関数を渡すよりも優れた体験を提供し、代わりにキーを表す式を直接使用できます。
`trackBy` から `track` への移行は、
`trackBy` 関数を呼び出すことで可能です:

```html
@for (item of items; track itemId($index, item)) {
  {{ item.name }}
}
```

`NgFor` では、`trackBy` を指定しない不変データのループは、
Angular アプリケーション全体でもっとも一般的なパフォーマンスの原因となります。
