# インジェクトベースの依存性の注入

注入可能なサービスを作成することは、Angularの依存性の注入 (DI) システムの最初の部分です。サービスをコンポーネントにどのように注入するか？Angularには、適切なコンテキストで使用できる便利な関数 `inject()` があります。

NOTE: 注入コンテキストの詳細はこのチュートリアルの範囲外ですが、詳しくは [依存性の注入 (DI) の基本ガイド](/essentials/dependency-injection) や [DI コンテキストガイド](guide/di/dependency-injection-context) を参照してください。

このアクティビティでは、サービスを注入してコンポーネントで使用する方法を学びます。

<hr>

DIシステムから提供される値でクラスのプロパティを初期化すると、多くの場合役立ちます。例を以下に示します。

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCareDashboard {
    petRosterService = inject(PetRosterService);
}
</docs-code>

<docs-workflow>

<docs-step title="`CarService` を注入する">

`app.ts` で、`inject()` 関数を使用して `CarService` を注入し、`carService` という名前のプロパティに割り当てます。

NOTE: プロパティ `carService` とクラス `CarService` の違いに注意してください。

</docs-step>

<docs-step title="`carService` インスタンスを使用する">

`inject(CarService)` を呼び出すと、アプリケーションで使用できる `CarService` のインスタンスが得られます。このインスタンスは `carService` プロパティに格納されます。

`display` プロパティを次の実装で初期化します。

```ts
display = this.carService.getCars().join(' ⭐️ ');
```

</docs-step>

<docs-step title="`App` テンプレートを更新する">

`app.ts` のコンポーネントテンプレートを次のコードで更新します。

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

初めてサービスをコンポーネントに注入できました。素晴らしい取り組みです。
