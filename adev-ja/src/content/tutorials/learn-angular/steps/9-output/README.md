# `@Output`を使ったコンポーネント間の通信

コンポーネントを扱う際に、他のコンポーネントに何かが起こったことを通知しなければならない場合があります。ボタンがクリックされた、リストに項目が追加/削除された、またはその他の重要な更新が行われたなどです。このようなシナリオでは、コンポーネントは親コンポーネントと通信する必要があります。

Angularは、`@Output`デコレーターを使用してこのタイプの動作を可能にします。

このアクティビティでは、`@Output`デコレーターと`EventEmitter`を使用してコンポーネント間で通信する方法を学びます。

<hr />

子コンポーネントから親コンポーネントへの通信パスを作成するには、クラスプロパティに`@Output`デコレーターを使用し、`EventEmitter`タイプの値を割り当てます。

<docs-code header="child.component.ts" language="ts">
@Component({...})
class ChildComponent {
    @Output() incrementCountEvent = new EventEmitter<number>();
}
</docs-code>

これで、コンポーネントは、親コンポーネントがリスンできるイベントを生成できます。`emit`メソッドを呼び出すことでイベントをトリガーします。

<docs-code header="child.component.ts" language="ts">
class ChildComponent {
    ...

    onClick() {
        this.count++;
        this.incrementCountEvent.emit(this.count);
    }

}
</docs-code>

emit関数は、`EventEmitter`インスタンスと同じタイプのイベントを生成します。

さあ、実際に試してみましょう。次のタスクに従ってコードを完成させてください。

<docs-workflow>

<docs-step title="`@Output`プロパティを追加する">
`addItemEvent`という出力プロパティを追加することで`child.component.ts`を更新します。`EventEmitter`のタイプを`string`に設定してください。
</docs-step>

<docs-step title="`addItem`メソッドを完成させる">
`child.component.ts`で`addItem`メソッドを更新します。次のコードをロジックとして使用してください。

<docs-code header="child.component.ts" highlight="[2]" language="ts">
addItem() {
  this.addItemEvent.emit('🐢');
}
</docs-code>

</docs-step>

<docs-step title="`AppComponent`テンプレートを更新する">
`app.component.ts`でテンプレートを更新して、次のようなコードを追加することで、発生したイベントを購読します。

```angular-html
<app-child (addItemEvent)="addItem($event)" />
```

これで、「Add Item」ボタンをクリックするたびに、リストに新しいアイテムが追加されます。

</docs-step>

</docs-workflow>

やりましたね、これでコンポーネントの基本を理解できました。素晴らしい👏

さらに学び続けることで、Angularの優れた機能をさらに活用できます。
