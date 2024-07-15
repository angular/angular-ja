<docs-decorative-header title="動的なデータの管理" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
コンポーネントの状態と動作を定義して、動的なデータを管理します。
</docs-decorative-header>

コンポーネントの基本構造を学んだので、コンポーネントのデータ（つまり状態）と動作を定義する方法を学びましょう。

## 状態とは？

コンポーネントを使用すると、アプリケーションの個別部分の責任をきれいにカプセル化できます。たとえば、`SignUpForm`コンポーネントは、ユーザーが特定の操作を実行できるようにする前に、フォームが有効かどうかを追跡する必要がある場合があります。その結果、コンポーネントが追跡する必要があるさまざまなプロパティは、しばしば「状態」と呼ばれます。

## 状態の定義

状態を定義するには、コンポーネント内で[クラスフィールド構文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/Public_class_fields)を使用します。

たとえば、`TodoListItem`コンポーネントを使用して、追跡する2つのプロパティを作成します。

1. `taskTitle` — タスクのタイトル
2. `isComplete` — タスクが完了しているかどうか

```ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;
}
```

## 状態の更新

状態を更新する場合は、通常、コンポーネントクラスでメソッドを定義して、`this`キーワードを使用してさまざまなクラスフィールドにアクセスします。

```ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;

  completeTask() {
    this.isComplete = true;
  }

  updateTitle(newTitle: string) {
    this.taskTitle = newTitle;
  }
}
```

## 次のステップ

動的なデータの宣言と管理方法を学んだので、テンプレート内でそのデータを使用する方法を学ぶ時です。

<docs-pill-row>
  <docs-pill title="動的なテンプレートのレンダリング" href="essentials/rendering-dynamic-templates" />
</docs-pill-row>
