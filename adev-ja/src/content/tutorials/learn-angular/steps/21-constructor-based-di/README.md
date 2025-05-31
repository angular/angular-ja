# コンストラクターベースの依存性の注入

以前のアクティビティでは、`inject()`関数を用いてリソースをコンポーネントに「提供」することで、リソースをコンポーネントで使用できるようにしていました。`inject()`関数は、依存性の注入のパターンの1つです。コンストラクターベースの依存性の注入という別の注入パターンも存在することを知っておくことは重要です。

コンストラクターベースの依存性の注入では、コンポーネントの`constructor`関数にパラメータとしてリソースを指定します。Angularは、これらのリソースをコンポーネントで使用できるようにします。

NOTE: 詳しくは、[サービスの注入に関する詳細ガイド](/guide/di/creating-injectable-service#injecting-services)をご覧ください。

このアクティビティでは、コンストラクターベースの依存性の注入の使い方を学びます。

<hr>

サービスやその他の注入可能なリソースをコンポーネントに注入するには、以下の構文を使用します。

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCarDashboard {
    constructor(private petCareService: PetCareService) {
        ...
    }
}
</docs-code>

ここで注意すべき点がいくつかあります。

- `private`キーワードを使用します。
- `petCareService`は、クラスで使用できるプロパティになります。
- `PetCareService`クラスは、注入されるクラスです。

それでは、実際に試してみましょう。

<docs-workflow>

<docs-step title="コンストラクタベースのDIを使用するようにコードを更新する">

`app.ts`で、以下のコードに合わせてコンストラクターコードを更新します。

TIP: 詰まってしまった場合は、この演習ページの例を参照してください。

```ts
constructor(private carService: CarService) {
    this.display = this.carService.getCars().join(' ⭐️ ');
}
```

</docs-step>

</docs-workflow>

このアクティビティの完了、おめでとうございます。例となるコードは、`inject`関数を使った場合と同じように動作します。これらの2つのアプローチはほぼ同じですが、このチュートリアルでは説明できない小さな違いがいくつかあります。

<br>

依存性の注入の詳細については、[Angularドキュメント](guide/di)を参照してください。
