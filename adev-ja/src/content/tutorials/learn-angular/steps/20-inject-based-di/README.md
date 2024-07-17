# インジェクトベースの依存性の注入

注入可能なサービスを作成することは、Angularの依存性の注入 (DI) システムの最初の部分です。サービスをコンポーネントにどのように注入するか？Angularには、適切なコンテキストで使用できる便利な関数 `inject()` があります。

注: 注入コンテキストはこのチュートリアルでは扱いませんが、詳細については [Angular ドキュメント](guide/di/dependency-injection-context) を参照してください。

このアクティビティでは、サービスを注入してコンポーネントで使用する方法を学びます。

<hr>

DIシステムから提供される値でクラスのプロパティを初期化すると、多くの場合役立ちます。例を以下に示します。

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCareDashboardComponent {
    petRosterService = inject(PetRosterService);
}
</docs-code>

<docs-workflow>

<docs-step title="`CarService` を注入する">

`app.component.ts` で、`inject()` 関数を使用して `CarService` を注入し、`carService` という名前のプロパティに割り当てます。

注: プロパティ `carService` とクラス `CarService` の違いに注意してください。

</docs-step>

<docs-step title="`carService` インスタンスを使用する">

`inject(CarService)` を呼び出すと、アプリケーションで使用できる `CarService` のインスタンスが得られます。このインスタンスは `carService` プロパティに格納されます。

`AppComponent` の `constructor` 関数に、次の実装を追加します。

```ts
constructor() {
    this.display = this.carService.getCars().join(' ⭐️ ');
}
```

</docs-step>

<docs-step title="`AppComponent` テンプレートを更新する">

`app.component.ts` のコンポーネントテンプレートを次のコードで更新します。

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

これで、最初のサービスをコンポーネントに注入しました。素晴らしい成果です。このDIに関するセクションを終了する前に、コンポーネントにリソースを注入する別の構文を学びます。
