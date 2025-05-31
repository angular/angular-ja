## 階層型インジェクター

Angularのインジェクターには、注入可能なオブジェクトのアプリケーション内での可視性を思いどおりにするために活用できるルールがあります。
これらのルールを理解することで、プロバイダーをアプリケーションレベル、コンポーネント内、またはディレクティブ内で宣言する必要があるかどうかを判断できます。

Angularで構築するアプリケーションは非常に大きくなる可能性があり、この複雑さを管理する1つの方法は、アプリケーションを明確に定義されたコンポーネントツリーに分割することです。

ページのセクションには、アプリケーションの残りの部分とは完全に独立して動作する部分があり、そのセクションに必要なサービスやその他の依存関係のローカルコピーが持つことができます。
これらのアプリケーションセクションが使用するサービスの一部は、アプリケーションの他の部分やコンポーネントツリーの上位にある親コンポーネントと共有される場合がありますが、他の依存関係はプライベートであることを目的としています。

階層型の依存性の注入を使用すると、アプリケーションのセクションを分離してアプリケーションの残りの部分と共有されていない独自のプライベート依存関係を与えるか、親コンポーネントが特定の依存関係を子コンポーネントのみに共有してコンポーネントツリーの残りの部分には共有しないようにできます。階層型の依存性の注入により、必要な場合にのみ、アプリケーションのさまざまな部分間で依存関係を共有できます。

## インジェクター階層のタイプ

Angularには、次の2つのインジェクター階層があります。

| インジェクター階層        | 詳細 |
|:---                         |:---     |
| `EnvironmentInjector` 階層 | `@Injectable()` または `ApplicationConfig` の `providers` 配列を使用して、この階層で `EnvironmentInjector` を構成します。 |
| `ElementInjector` 階層 | 各 DOM 要素で暗黙的に作成されます。 `ElementInjector` は、 `@Directive()` または `@Component()` の `providers` プロパティで構成しない限り、デフォルトでは空です。 |

<docs-callout title="NgModule ベースのアプリケーション">
`NgModule` ベースのアプリケーションの場合、`@NgModule()` または `@Injectable()` アノテーションを使用して、`ModuleInjector` 階層で依存関係を提供できます。
</docs-callout>

### `EnvironmentInjector`

`EnvironmentInjector` は、次のいずれかの方法で構成できます。

* `@Injectable()` の `providedIn` プロパティを使用して `root` または `platform` を参照する
* `ApplicationConfig` の `providers` 配列を使用する

<docs-callout title="ツリーシェイクと @Injectable()">

`@Injectable()` の `providedIn` プロパティを使用することは、 `ApplicationConfig` の `providers` 配列を使用するよりも好ましいです。 `@Injectable()` の `providedIn` を使用すると、最適化ツールはツリーシェイクを実行して、アプリケーションで使用されていないサービスを削除できます。これにより、バンドルサイズが小さくなります。

ツリーシェイクは、特にライブラリにとって有用です。なぜなら、ライブラリを使用するアプリケーションは、ライブラリを注入する必要がない場合があるからです。

</docs-callout>

`EnvironmentInjector` は、 `ApplicationConfig.providers` によって構成されます。

`providedIn` を使用して、次のように `@Injectable()` を使用してサービスを提供します。

<docs-code language="typescript" highlight="[4]">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // <--ルート EnvironmentInjector でこのサービスを提供します
})
export class ItemService {
  name = 'telephone';
}

</docs-code>

`@Injectable()` デコレーターは、サービスクラスを識別します。
`providedIn` プロパティは、特定の `EnvironmentInjector`（ここでは `root`）を構成します。これにより、サービスは `root` `EnvironmentInjector` で使用可能になります。

### ModuleInjector

`NgModule` ベースのアプリケーションの場合、`ModuleInjector` は、次のいずれかの方法で構成できます。

* `@Injectable()` の `providedIn` プロパティを使用して `root` または `platform` を参照する
* `@NgModule()` の `providers` 配列を使用する

`ModuleInjector` は、 `@NgModule.providers` および `NgModule.imports` プロパティによって構成されます。 `ModuleInjector` は、 `NgModule.imports` を再帰的にたどることによって到達できるすべてのプロバイダー配列をフラット化したものです。

子 `ModuleInjector` 階層は、他の `@NgModules` を遅延読み込みするときに作成されます。

### プラットフォームインジェクター

`root` の上にさらに2つのインジェクター、追加の `EnvironmentInjector` と `NullInjector()` があります。

Angularが `main.ts` の次の内容でアプリケーションをブートストラップする方法を検討してください。

<docs-code language="javascript">
bootstrapApplication(AppComponent, appConfig);
</docs-code>

`bootstrapApplication()` メソッドは、 `ApplicationConfig` インスタンスによって構成されたプラットフォームインジェクターの子インジェクターを作成します。
これが `root` `EnvironmentInjector` です。

`platformBrowserDynamic()` メソッドは、プラットフォーム固有の依存関係を含む `PlatformModule` によって構成されたインジェクターを作成します。
これにより、複数のアプリケーションがプラットフォーム構成を共有できます。
たとえば、ブラウザには、実行中のアプリケーションの数にかかわらず、URLバーは1つだけです。
`platformBrowser()` 関数を使用して `extraProviders` を提供することにより、プラットフォームレベルで追加のプラットフォーム固有のプロバイダーを構成できます。

階層の次の親インジェクターは `NullInjector()` で、ツリーのトップです。
ツリーをそこまで上に移動して `NullInjector()` 内でサービスを検索した場合、 `@Optional()` を使用していない限り、エラーが発生します。最終的にはすべて `NullInjector()` で終了し、エラーを返すか、 `@Optional()` の場合、 `null` を返します。
`@Optional()` の詳細については、このガイドの [`@Optional()` セクション](#optional) を参照してください。

次の図は、前の段落で説明したように、 `root` `ModuleInjector` とその親インジェクターの関係を表しています。

```mermaid
stateDiagram-v2
    elementInjector: EnvironmentInjector<br>(configured by Angular)<br>has special things like DomSanitizer => providedIn 'platform'
    rootInjector: root EnvironmentInjector<br>(configured by AppConfig)<br>has things for your app => bootstrapApplication(..., AppConfig)
    nullInjector: NullInjector<br>always throws an error unless<br>you use @Optional()

    direction BT
    rootInjector --> elementInjector
    elementInjector --> nullInjector
```

`root` という名前は特別なエイリアスですが、他の `EnvironmentInjector` 階層にはエイリアスがありません。
動的にロードされたコンポーネントが作成されるたびに `EnvironmentInjector` 階層を作成するオプションがあります。たとえば、ルーターを使用すると、子 `EnvironmentInjector` 階層が作成されます。

`ApplicationConfig` インスタンスを `bootstrapApplication()` メソッドに渡して構成するか、 `root` で独自のサービスにすべてのプロバイダーを登録したかにかかわらず、すべての要求はルートインジェクターに転送されます。

<docs-callout title="@Injectable() vs. ApplicationConfig">

`bootstrapApplication()` の `ApplicationConfig` でアプリケーション全体のプロバイダーを構成すると、 `@Injectable()` メタデータの `root` で構成されたプロバイダーがオーバーライドされます。
これは、複数のアプリケーションで共有されるサービスのデフォルト以外を構成する場合に行うことができます。

コンポーネントルーターの構成にデフォルト以外の [ロケーション戦略](guide/routing#location-strategy) が含まれている場合、 `ApplicationConfig` の `providers` リストにそのプロバイダーをリストすることによって、その例を示します。

```ts
providers: [
  { provide: LocationStrategy, useClass: HashLocationStrategy }
]
```

`NgModule` ベースのアプリケーションの場合、アプリケーション全体のプロバイダーを `AppModule` の `providers` で構成します。

</docs-callout>

### `ElementInjector`

Angularは、各DOM要素に対して `ElementInjector` 階層を暗黙的に作成します。

`@Component()` デコレーターの `providers` または `viewProviders` プロパティを使用してサービスを提供すると、 `ElementInjector` が構成されます。
たとえば、次の `TestComponent` は、次のようにサービスを提供することで `ElementInjector` を構成します。

<docs-code language="typescript" highlight="[3]">
@Component({
  …
  providers: [{ provide: ItemService, useValue: { name: 'lamp' } }]
})
export class TestComponent
</docs-code>

HELPFUL: [解決ルール](#resolution-rules) セクションを参照して、 `EnvironmentInjector` ツリー、 `ModuleInjector`、および `ElementInjector` ツリーの関係を理解してください。

コンポーネントでサービスを提供すると、そのサービスは、そのコンポーネントインスタンスの `ElementInjector` を介して使用可能になります。
[解決ルール](#resolution-rules) セクションで説明されている可視性ルールに基づいて、子コンポーネント/ディレクティブでも可視化される可能性があります。

コンポーネントインスタンスが破棄されると、そのサービスインスタンスも破棄されます。

#### `@Directive()` と `@Component()`

コンポーネントは特殊なタイプのディレクティブであるため、 `@Directive()` に `providers` プロパティがあるように、 `@Component()` にも `providers` プロパティがあります。
つまり、ディレクティブとコンポーネントは、 `providers` プロパティを使用してプロバイダーを構成できます。
`providers` プロパティを使用してコンポーネントまたはディレクティブのプロバイダーを構成すると、そのプロバイダーはそのコンポーネントまたはディレクティブの `ElementInjector` に属します。
同じ要素上のコンポーネントとディレクティブは、インジェクターを共有します。

## 解決ルール {#resolution-rules}

コンポーネント/ディレクティブのトークンを解決する場合、Angularは次の2つのフェーズで解決します。

1. `ElementInjector` 階層の親に対して。
2. `EnvironmentInjector` 階層の親に対して。

コンポーネントが依存関係を宣言すると、Angularはその依存関係を自身の `ElementInjector` で満たそうとします。
コンポーネントのインジェクターにプロバイダーがない場合、そのリクエストを親コンポーネントの `ElementInjector` に渡します。

リクエストは、Angularがリクエストを処理できるインジェクターを見つけるか、祖先 `ElementInjector` 階層を使い果たすまで、転送され続けます。

Angularがいずれの `ElementInjector` 階層でもプロバイダーを見つけられない場合、リクエストが発生した要素に戻り、 `EnvironmentInjector` 階層を調べます。
それでもAngularがプロバイダーを見つけられない場合、エラーをスローします。

同じDIトークンのプロバイダーを異なるレベルで登録した場合、Angularが最初に遭遇するプロバイダーが、依存関係を解決するために使用するプロバイダーです。
たとえば、サービスを必要とするコンポーネントにプロバイダーがローカルに登録されている場合、
Angularは同じサービスの別のプロバイダーを探しません。

HELPFUL: `NgModule` ベースのアプリケーションの場合、Angularは `ElementInjector` 階層でプロバイダーが見つからない場合、 `ModuleInjector` 階層を検索します。

## 解決修飾子

Angular's resolution behavior can be modified with `optional`, `self`, `skipSelf` and `host`.
Import each of them from `@angular/core` and use each in the `inject` configuration when you inject your service.

### 修飾子の種類

解決修飾子は、次の3つのカテゴリーに分類されます。

* What to do if Angular doesn't find what you're looking for, that is `optional`
* Where to start looking, that is `skipSelf`
* Where to stop looking, `host` and `self`

デフォルトでは、Angularは常に現在の `Injector` から始めて、すべてを上に検索し続けます。
修飾子を使用すると、開始位置（または _self_ 位置）と終了位置を変更できます。

さらに、次の修飾子をすべて組み合わせることができます。

* `host` and `self`
* `skipSelf` and `self`.

### `optional`

`optional` allows Angular to consider a service you inject to be optional.
そのため、実行時に解決できない場合、Angularはサービスをエラーをスローするのではなく、 `null` として解決します。
次の例では、サービス `OptionalService` はサービス `ApplicationConfig`や`@NgModule()`、コンポーネントクラスで提供されていないため、アプリケーションのどこにも使用できません。

<docs-code header="src/app/optional/optional.component.ts" language="typescript">
export class OptionalComponent {
  public optional? = inject(OptionalService, {optional: true});
}
</docs-code>

### `self`

Use `self` so that Angular will only look at the `ElementInjector` for the current component or directive.

A good use case for `self` is to inject a service but only if it is available on the current host element.
To avoid errors in this situation, combine `self` with `optional`.

For example, in the following `SelfNoDataComponent`, notice the injected `LeafService` as a property.

<docs-code header="src/app/self-no-data/self-no-data.component.ts" language="typescript"
           highlight="[7]">
@Component({
  selector: 'app-self-no-data',
  templateUrl: './self-no-data.component.html',
  styleUrls: ['./self-no-data.component.css']
})
export class SelfNoDataComponent {
  public leaf = inject(LeafService, {optional: true, self: true});
}
</docs-code>

In this example, there is a parent provider and injecting the service will return the value, however, injecting the service with `self` and `optional` will return `null` because `self` tells the injector to stop searching in the current host element.

別の例では、 `FlowerService` のプロバイダーを備えたコンポーネントクラスを示しています。
この場合、インジェクターは現在の `ElementInjector` より先を見ずに、 `FlowerService` を見つけて、チューリップ <code>&#x1F337;</code> を返します。

<docs-code header="src/app/self/self.component.ts" path="adev/src/content/examples/resolution-modifiers/src/app/self/self.component.ts" visibleRegion="self-component"/>

### `skipSelf`

`skipSelf` is the opposite of `self`.
With `skipSelf`, Angular starts its search for a service in the parent `ElementInjector`, rather than in the current one.
そのため、親 `ElementInjector` が `emoji` にシダ <code>&#x1F33F;</code> 値を使用していたが、コンポーネントの `providers` 配列にカエデの葉 <code>&#x1F341;</code> が含まれている場合、Angular はカエデの葉 <code>&#x1F341;</code> を無視して、シダ <code>&#x1F33F;</code> を使用します。

これをコードで確認するために、親コンポーネントが使用する `emoji` の次の値を想定します。これは、このサービスと同じです。

<docs-code header="src/app/leaf.service.ts" language="typescript">
export class LeafService {
  emoji = '🌿';
}
</docs-code>

子コンポーネントに、異なる値、カエデの葉 <code>&#x1F341;</code> が含まれていると想像してください。ただし、親の値を使用したいとします。
This is when you'd use `skipSelf`:

<docs-code header="src/app/skipself/skipself.component.ts" language="typescript"
           highlight="[[6],[10]]">
@Component({
  selector: 'app-skipself',
  templateUrl: './skipself.component.html',
  styleUrls: ['./skipself.component.css'],
  // Angular はこの LeafService インスタンスを無視します
  providers: [{ provide: LeafService, useValue: { emoji: '🍁' } }]
})
export class SkipselfComponent {
  // Use skipSelf as inject option
  public leaf = inject(LeafService, {skipSelf: true});
}
</docs-code>

この場合、 `emoji` に対して取得する値は、カエデの葉 <code>&#x1F341;</code> ではなく、シダ <code>&#x1F33F;</code> になります。

#### `skipSelf` option with `optional`

Use the `skipSelf` option with `optional` to prevent an error if the value is `null`.

In the following example, the `Person` service is injected during property initialization.
`skipSelf` tells Angular to skip the current injector and `optional` will prevent an error should the `Person` service be `null`.

<docs-code language="typescript">
class Person {
  parent = inject(Person, {optional: true, skipSelf: true})
}
</docs-code>

### `host`

<!-- TODO: Remove ambiguity between host and self. -->

`host` lets you designate a component as the last stop in the injector tree when searching for providers.

Even if there is a service instance further up the tree, Angular won't continue looking.
Use `host` as follows:

<docs-code header="src/app/host/host.component.ts" language="typescript"
           highlight="[[6],[10]]">
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
  //  provide the service
  providers: [{ provide: FlowerService, useValue: { emoji: '🌷' } }]
})
export class HostComponent {
  // use host when injecting the service
  flower = inject(FlowerService, {host: true, optional: true});
}
</docs-code>

Since `HostComponent` has the `host` option , no matter what the parent of `HostComponent` might have as a `flower.emoji` value, the `HostComponent` will use tulip <code>&#x1F337;</code>.

### Modifiers with constructor injection  

Similarly as presented before, the behavior of constructor injection can be modified with `@Optional()`, `@Self()`, `@SkipSelf()` and `@Host()`.

Import each of them from `@angular/core` and use each in the component class constructor when you inject your service.

<docs-code header="src/app/self-no-data/self-no-data.component.ts" language="typescript" highlight="[3]">
export class SelfNoDataComponent {
  constructor(@Self() @Optional() public leaf?: LeafService) { }
}
</docs-code>

## テンプレートの論理構造

コンポーネントクラスでサービスを提供する場合、サービスは、サービスの提供場所と方法に応じて、 `ElementInjector` ツリー内で可視になります。

Angularテンプレートの基になる論理構造を理解すると、サービスの構成と、その可視性の制御のための基礎が得られます。

コンポーネントは、次の例のようにテンプレートで使用されます。

<docs-code language="html">
<app-root>
  <app-child></app-child>;
</app-root>
</docs-code>

HELPFUL: 通常、コンポーネントとそのテンプレートは別々のファイルに宣言します。
注入システムの動作を理解するために、それらを組み合わせた論理ツリーの視点から見ると便利です。
用語 _論理_ は、アプリケーションのDOMツリーであるレンダリングツリーと区別しています。
コンポーネントテンプレートの場所を示すために、このガイドでは `<#VIEW>` 疑似要素を使用します。この疑似要素は、レンダリングツリーには実際に存在せず、メンタルモデルの目的でのみ存在します。

以下は、 `<app-root>` と `<app-child>` のビューツリーを1つの論理ツリーに結合した例です。

<docs-code language="html">
<app-root>
  <#VIEW>
    <app-child>
     <#VIEW>
       …ここにコンテンツが挿入されます…
     </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
</docs-code>

`<#VIEW>` の区切りの考え方を理解することは、特にコンポーネントクラスでサービスを構成する場合に重要です。

## 例： `@Component()` でサービスを提供する

`@Component()`（または `@Directive()`）デコレーターを使用してサービスを提供する方法は、サービスの可視性を決めます。
The following sections demonstrate `providers` and `viewProviders` along with ways to modify service visibility with `skipSelf` and `host`.

コンポーネントクラスでは、次の2つの方法でサービスを提供できます。

| 配列                       | 詳細 |
|:---                          |:---     |
| `providers` 配列を使用する     | `@Component({ providers: [SomeService] })`     |
| `viewProviders` 配列を使用する | `@Component({ viewProviders: [SomeService] })` |

次の例では、Angularアプリケーションの論理ツリーが表示されます。
テンプレートのコンテキストでインジェクターがどのように動作するかを示すために、論理ツリーはアプリケーションのHTML構造を表します。
たとえば、論理ツリーは、 `<child-component>` が `<parent-component>` の直接の子であることを示します。

論理ツリーでは、 `@Provide` 、 `@Inject` 、および `@ApplicationConfig` という特殊な属性が表示されます。
これらは実際の属性ではなく、内部で何が起こっているかを説明するためにここにあります。

| Angular サービス属性                                                                                          | 詳細 |
|:---                                                                                                                |:---     |
| `@Inject(Token)=>Value`     | 論理ツリーのこの場所に `Token` が注入されている場合、その値は `Value` になります。     |
| `@Provide(Token=Value)`     | 論理ツリーのこの場所に `Token` が `Value` で提供されていることを示します。        |
| `@ApplicationConfig` | この場所でフォールバック `EnvironmentInjector` を使用する必要があることを示します。          |

### アプリケーション構造の例

この例では、 `emoji` の値が赤いハイビスカス <code>&#x1F33A;</code> である、 `root` に提供される `FlowerService` があります。

<docs-code header="src/app/flower.service.ts" language="typescript">
@Injectable({
  providedIn: 'root'
})
export class FlowerService {
  emoji = '🌺';
}
</docs-code>

`AppComponent` と `ChildComponent` のみが含まれるアプリケーションを検討してください。
最も基本的なレンダリングされたビューは、次のようなネストされたHTML要素のように見えます。

<docs-code language="html">

<app-root> <!-- AppComponent セレクター -->
  <app-child> <!-- ChildComponent セレクター -->
  </app-child>
</app-root>

</docs-code>

ただし、裏側では、Angularはインジェクションリクエストを解決するときに、次のような論理ビュー表現を使用します。

<docs-code language="html">
<app-root> <!-- AppComponent セレクター -->
  <#VIEW>
    <app-child> <!-- ChildComponent セレクター -->
      <#VIEW>
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
</docs-code>

ここでの `<#VIEW>` は、テンプレートのインスタンスを表しています。
各コンポーネントには、独自の `<#VIEW>` があることに注意してください。

この構造を理解することで、サービスの提供方法と注入方法を把握し、サービスの可視性を完全に制御できます。

次に、 `<app-root>` が `FlowerService` を注入しているとします。

<docs-code header="src/app/app.component.ts" language="typescript">
export class AppComponent  {
  flower = inject(FlowerService);
}
</docs-code>

結果を視覚化するために、 `<app-root>` テンプレートにバインディングを追加します。

<docs-code header="src/app/app.component.html" language="html">
<p>Emoji from FlowerService: {{flower.emoji}}</p>
</docs-code>

ビューに出力されるのは次のとおりです。

<docs-code language="shell">
Emoji from FlowerService: &#x1F33A;
</docs-code>

論理ツリーでは、これは次のように表されます。

<docs-code language="html" highlight="[[1],[2],[4]]">
<app-root @ApplicationConfig
        @Inject(FlowerService) flower=>"&#x1F33A;">
  <#VIEW>
    <p>Emoji from FlowerService: {{flower.emoji}} (&#x1F33A;)</p>
    <app-child>
      <#VIEW>
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

`<app-root>` が `FlowerService` を要求すると、インジェクターは `FlowerService` トークンを解決します。
トークンの解決は次の2つのフェーズで行われます。

1. インジェクターは、論理ツリー内の開始位置と検索の終了位置を決定します。
    インジェクターは開始位置から始めて、論理ツリーの各ビューレベルでトークンを検索します。
    トークンが見つかると、そのトークンが返されます。

1. トークンが見つからない場合、インジェクターはリクエストを委任する最も近い親 `EnvironmentInjector` を検索します。

この例の場合、制約は次のとおりです。

1. `<app-root>` に属する `<#VIEW>` から始めて、 `<app-root>` で終了します。

    * 通常、検索の開始点は注入ポイントです。
        ただし、この場合、 `<app-root>` はコンポーネントです。 `@Component` は特殊で、独自の `viewProviders` も含まれています。そのため、検索は `<app-root>` に属する `<#VIEW>` から開始されます。
        これは、同じ場所に一致するディレクティブでは発生しません。
    * 終了位置は、コンポーネント自体と同じになります。なぜなら、これはこのアプリケーションの最上位コンポーネントだからです。

1. `ApplicationConfig` によって提供される `EnvironmentInjector` は、インジェクショントークンが `ElementInjector` 階層で見つからない場合のフォールバックインジェクターとして機能します。

### `providers` 配列を使用する

次に、 `ChildComponent` クラスで、今後のセクションでより複雑な解決ルールを説明するために、 `FlowerService` のプロバイダーを追加します。

<docs-code header="src/app/child.component.ts" language="typescript"
           highlight="[[5,6],[10]]">
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  // プロバイダー配列を使用してサービスを提供します
  providers: [{ provide: FlowerService, useValue: { emoji: '🌻' } }]
})
export class ChildComponent {
  // サービスを注入します
  flower = inject(FlowerService);
}
</docs-code>

`FlowerService` が `@Component()` デコレーターで提供されるようになったため、 `<app-child>` がサービスを要求すると、インジェクターは `<app-child>` の `ElementInjector` ほど遠くまでしか見なくてもよくなります。
インジェクターは、インジェクターツリーをさらに検索する必要はありません。

次のステップは、 `ChildComponent` テンプレートにバインディングを追加することです。

<docs-code header="src/app/child.component.html" language="html">
<p>Emoji from FlowerService: {{flower.emoji}}</p>
</docs-code>

新しい値をレンダリングするために、ビューにひまわりも表示されるように、 `AppComponent` テンプレートの下部に `<app-child>` を追加します。

<docs-code language="shell">
Child Component
Emoji from FlowerService: &#x1F33B;
</docs-code>

論理ツリーでは、これは次のように表されます。

<docs-code language="html">

<app-root @ApplicationConfig
        @Inject(FlowerService) flower=>"&#x1F33A;">
  <#VIEW>
    <p>Emoji from FlowerService: {{flower.emoji}} (&#x1F33A;)</p>
    <app-child @Provide(FlowerService="&#x1F33B;")
               @Inject(FlowerService)=>"&#x1F33B;"> <!-- 検索はここで終了します -->
      <#VIEW> <!-- 検索はここで開始します -->
        <h2>Child Component</h2>
        <p>Emoji from FlowerService: {{flower.emoji}} (&#x1F33B;)</p>
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

`<app-child>` が `FlowerService` を要求すると、インジェクターは `<app-child>` に属する `<#VIEW>`（`@Component()` から注入されるため `<#VIEW>` が含まれています）から始めて、 `<app-child>` で終了します。
この場合、 `FlowerService` は、 `<app-child>` の `providers` 配列で、ひまわり <code>&#x1F33B;</code> を使用して解決されます。
インジェクターは、インジェクターツリーをさらに検索する必要はありません。
`FlowerService` を見つけるとすぐに停止し、赤いハイビスカス <code>&#x1F33A;</code> は見えません。

### `viewProviders` 配列を使用する

`viewProviders` 配列は、 `@Component()` デコレーターでサービスを提供する別の方法です。
`viewProviders` を使用すると、サービスは `<#VIEW>` で可視になります。

HELPFUL: ステップは `providers` 配列を使用する場合と同じですが、 `viewProviders` 配列を使用する点が異なります。

ステップバイステップの手順については、このセクションを続行してください。
自分で設定できる場合は、[サービスの可用性を変更する](#visibility-of-provided-tokens) に進んでください。

デモのために、 `AnimalService` を作成して、 `viewProviders` を示します。
最初に、 `emoji` プロパティがクジラ <code>&#x1F433;</code> である `AnimalService` を作成します。

<docs-code header="src/app/animal.service.ts" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  emoji = '🐳';
}
</docs-code>

`FlowerService` と同じパターンに従って、 `AppComponent` クラスに `AnimalService` を注入します。

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[4]">
export class AppComponent {
    public flower = inject(FlowerService);
    public animal = inject(AnimalService);
}
</docs-code>

HELPFUL: `FlowerService` に関連するコードはすべてそのままにしておくことができます。これにより、 `AnimalService` との比較が可能になります。

`viewProviders` 配列を追加し、 `<app-child>` クラスにも `AnimalService` を注入しますが、 `emoji` に異なる値を与えます。
ここでは、犬 <code>&#x1F436;</code> の値があります。

<docs-code header="src/app/child.component.ts" language="typescript"
           highlight="[[7],[11]]">
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  // サービスを提供します
  providers: [{ provide: FlowerService, useValue: { emoji: '🌻' } }],
  viewProviders: [{ provide: AnimalService, useValue: { emoji: '🐶' } }]
})
export class ChildComponent {
  // サービスを注入します
  flower = inject(FlowerService); 
  animal = inject(AnimalService)
...
}
</docs-code>

`ChildComponent` と `AppComponent` のテンプレートにバインディングを追加します。
`ChildComponent` テンプレートに、次のバインディングを追加します。

<docs-code header="src/app/child.component.html" language="html">
<p>Emoji from AnimalService: {{animal.emoji}}</p>
</docs-code>

さらに、 `AppComponent` テンプレートにも同じものを追加します。

<docs-code header="src/app/app.component.html" language="html">
<p>Emoji from AnimalService: {{animal.emoji}}</p>s
</docs-code>

これで、ブラウザに両方の値が表示されます。

<docs-code hideCopy language="shell">

AppComponent
Emoji from AnimalService: &#x1F433;

Child Component
Emoji from AnimalService: &#x1F436;

</docs-code>

この `viewProviders` の例の論理ツリーは次のとおりです。

<docs-code language="html">

<app-root @ApplicationConfig
         @Inject(AnimalService) animal=>"&#x1F433;">
  <#VIEW>
    <app-child>
      <#VIEW @Provide(AnimalService="&#x1F436;")
            @Inject(AnimalService=>"&#x1F436;")>
       <!-- ^^viewProviders を使用すると、AnimalService は <#VIEW> で使用可能になります-->
       <p>Emoji from AnimalService: {{animal.emoji}} (&#x1F436;)</p>
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

`FlowerService` の例と同様に、 `AnimalService` は `<app-child>` の `@Component()` デコレーターで提供されています。
つまり、インジェクターは最初にコンポーネントの `ElementInjector` を調べるため、犬 <code>&#x1F436;</code> の `AnimalService` 値が見つかります。
インジェクターは、 `ElementInjector` ツリーをさらに検索する必要も、 `ModuleInjector` を検索する必要もありません。

### `providers` と `viewProviders` の違い

`viewProviders` フィールドは、概念的には `providers` と似ていますが、1つの顕著な違いがあります。
`viewProviders` で構成されたプロバイダーは、コンポーネントの論理的な子になる投影されたコンテンツには可視ではありません。

`providers` と `viewProviders` の違いを確認するために、別のコンポーネントを例に追加して、 `InspectorComponent` と呼びます。
`InspectorComponent` は、 `ChildComponent` の子になります。
In `inspector.component.ts`, inject the `FlowerService` and `AnimalService` during property initialization:

<docs-code header="src/app/inspector/inspector.component.ts" language="typescript">
export class InspectorComponent {
  flower = inject(FlowerService);
  animal = inject(AnimalService);
}
</docs-code>

`providers` または `viewProviders` 配列は必要ありません。
次に、 `inspector.component.html` に、以前のコンポーネントと同じマークアップを追加します。

<docs-code header="src/app/inspector/inspector.component.html" language="html">
<p>Emoji from FlowerService: {{flower.emoji}}</p>
<p>Emoji from AnimalService: {{animal.emoji}}</p>
</docs-code>

`InspectorComponent` を `ChildComponent` の `imports` 配列に追加することを忘れないでください。

<docs-code header="src/app/child/child.component.ts" language="typescript"
           highlight="[3]">
@Component({
  ...
  imports: [InspectorComponent]
})

</docs-code>

次に、 `child.component.html` に次を追加します。

<docs-code header="src/app/child/child.component.html" language="html"
           highlight="[3,9]">
...

<div class="container">
  <h3>Content projection</h3>
  <ng-content></ng-content>
</div>
<h3>Inside the view</h3>

<app-inspector></app-inspector>
</docs-code>

`<ng-content>` を使用するとコンテンツを投影でき、 `ChildComponent` テンプレート内の `<app-inspector>` は、 `InspectorComponent` を `ChildComponent` の子コンポーネントにします。

次に、コンテンツ投影を活用するために、 `app.component.html` に次を追加します。

<docs-code header="src/app/app.component.html" language="html" highlight="[2]">
<app-child>
  <app-inspector></app-inspector>
</app-child>
</docs-code>

これで、ブラウザには、以前の例は省略して、次のものがレンダリングされます。

<docs-code hideCopy language="shell">
...
Content projection

Emoji from FlowerService: &#x1F33B;
Emoji from AnimalService: &#x1F433;

Emoji from FlowerService: &#x1F33B;
Emoji from AnimalService: &#x1F436;

</docs-code>

これらの4つのバインディングは、 `providers` と `viewProviders` の違いを示しています。
犬の絵文字 <code>&#x1F436;</code> は、 `ChildComponent` の `<#VIEW>` 内に宣言され、投影されたコンテンツには可視ではないことを覚えておいてください。
代わりに、投影されたコンテンツには、クジラ <code>&#x1F433;</code> が表示されます。

ただし、次の出力セクションでは `InspectorComponent` は `ChildComponent` の実際の子コンポーネントです。そして `InspectorComponent` は `<#VIEW>` の内側にあるため、 `AnimalService` を要求すると、犬 <code>&#x1F436;</code> が表示されます。

論理ツリー内の `AnimalService` は、次のようになります。

<docs-code language="html">

<app-root @ApplicationConfig
         @Inject(AnimalService) animal=>"&#x1F433;">
  <#VIEW>
    <app-child>
      <#VIEW @Provide(AnimalService="&#x1F436;")
            @Inject(AnimalService=>"&#x1F436;")>
        <!-- ^^viewProviders を使用すると、AnimalService は <#VIEW> で使用可能になります-->
        <p>Emoji from AnimalService: {{animal.emoji}} (&#x1F436;)</p>

        <div class="container">
          <h3>Content projection</h3>
          <app-inspector @Inject(AnimalService) animal=>"&#x1F433;">
            <p>Emoji from AnimalService: {{animal.emoji}} (&#x1F433;)</p>
          </app-inspector>
        </div>

        <app-inspector>
          <#VIEW @Inject(AnimalService) animal=>"&#x1F436;">
            <p>Emoji from AnimalService: {{animal.emoji}} (&#x1F436;)</p>
          </#VIEW>
        </app-inspector>
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

`<app-inspector>` の投影されたコンテンツには、クジラ <code>&#x1F433;</code> が表示され、犬 <code>&#x1F436;</code> は表示されません。これは、犬 <code>&#x1F436;</code> が `<app-child>` の `<#VIEW>` の内側にあるためです。
`<app-inspector>` は、 `<#VIEW>` の内側にある場合にのみ、犬 <code>&#x1F436;</code> を表示できます。

### 提供されたトークンの可視性

可視性デコレーターは、論理ツリー内でインジェクショントークンの検索を開始する場所と終了する場所を制御します。
To do this, place visibility configuration at the point of injection, that is, when invoking `inject()`, rather than at a point of declaration.

To alter where the injector starts looking for `FlowerService`, add `skipSelf` to the `<app-child>` `inject()` invocation where `FlowerService` is injected.
This invocation is a property initializer the `<app-child>` as shown in `child.component.ts`:

<docs-code language="typescript">
flower = inject(FlowerService, { skipSelf: true })
</docs-code>

With `skipSelf`, the `<app-child>` injector doesn't look to itself for the `FlowerService`.
代わりに、インジェクターは `<app-root>` の `ElementInjector` で `FlowerService` の検索を開始し、何も見つかりません。
次に、 `<app-child>` の `ModuleInjector` に戻り、 `<app-child>` と `<app-root>` が同じ `ModuleInjector` を共有しているため、赤いハイビスカス <code>&#x1F33A;</code> 値が見つかります。
UIには次のように表示されます。

<docs-code hideCopy language="shell">

Emoji from FlowerService: &#x1F33A;

</docs-code>

論理ツリーでは、この同じ考え方は次のようになります。

<docs-code language="html">

<app-root @ApplicationConfig
        @Inject(FlowerService) flower=>"&#x1F33A;">
  <#VIEW>
    <app-child @Provide(FlowerService="&#x1F33B;")>
      <#VIEW @Inject(FlowerService, SkipSelf)=>"&#x1F33A;">
        <!-- SkipSelf を使用すると、インジェクターはツリー上の次のインジェクター（app-root）を調べます -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

Though `<app-child>` provides the sunflower <code>&#x1F33B;</code>, the application renders the red hibiscus <code>&#x1F33A;</code> because `skipSelf` causes the current injector (`app-child`) to skip itself and look to its parent.

If you now add `host` (in addition to the `skipSelf`), the result will be `null`.
This is because `host` limits the upper bound of the search to the `app-child` `<#VIEW>`.
論理ツリーでの考え方は次のとおりです。

<docs-code language="html">

<app-root @ApplicationConfig
        @Inject(FlowerService) flower=>"&#x1F33A;">
  <#VIEW> <!-- ここで検索を終了して null を返します-->
    <app-child @Provide(FlowerService="&#x1F33B;")> <!-- ここで検索を開始します -->
      <#VIEW inject(FlowerService, {skipSelf: true, host: true, optional:true})=>null>
      </#VIEW>
      </app-parent>
  </#VIEW>
</app-root>

</docs-code>

Here, the services and their values are the same, but `host` stops the injector from looking any further than the `<#VIEW>` for `FlowerService`, so it doesn't find it and returns `null`.

### `skipSelf` and `viewProviders`

覚えておいてください。 `<app-child>` は、 `viewProviders` 配列で `AnimalService` を提供し、その値は犬 <code>&#x1F436;</code> です。
インジェクターは、 `<app-child>` の `ElementInjector` を `AnimalService` について調べるだけなので、クジラ <code>&#x1F433;</code> は見えません。

As in the `FlowerService` example, if you add `skipSelf` to the `inject()` of `AnimalService`, the injector won't look in the  `ElementInjector` of the current `<app-child>` for the `AnimalService`.
代わりに、インジェクターは `<app-root>` の `ElementInjector` で検索を開始します。

<docs-code language="typescript" highlight="[5]">
@Component({
  selector: 'app-child',
  …
  viewProviders: [
    { provide: AnimalService, useValue: { emoji: '&#x1F436;' } },
  ],
})
</docs-code>

The logical tree looks like this with `skipSelf` in `<app-child>`:

<docs-code language="html">

<app-root @ApplicationConfig
          @Inject(AnimalService=>"&#x1F433;")>
  <#VIEW><!-- 検索はここで開始します -->
    <app-child>
      <#VIEW @Provide(AnimalService="&#x1F436;")
             @Inject(AnimalService, SkipSelf=>"&#x1F433;")>
        <!--Add skipSelf -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

With `skipSelf` in the `<app-child>`, the injector begins its search for the `AnimalService` in the `<app-root>` `ElementInjector` and finds whale <code>&#x1F433;</code>.

### `host` and `viewProviders`

If you just use `host` for the injection of `AnimalService`, the result is dog <code>&#x1F436;</code> because the injector finds the `AnimalService` in the `<app-child>` `<#VIEW>` itself.
The `ChildComponent` configures the `viewProviders` so that the dog emoji is provided as `AnimalService` value.
You can also see `host` the `inject()`:

<docs-code language="typescript" highlight="[[5],[9]]">
@Component({
  selector: 'app-child',
  …
  viewProviders: [
    { provide: AnimalService, useValue: { emoji: '&#x1F436;' } },
  ]
})
export class ChildComponent {
  animal = inject(AnimalService, { host: true })
}
</docs-code>

`host: true` causes the injector to look until it encounters the edge of the `<#VIEW>`.

<docs-code language="html">

<app-root @ApplicationConfig
          @Inject(AnimalService=>"&#x1F433;")>
  <#VIEW>
    <app-child>
      <#VIEW @Provide(AnimalService="&#x1F436;")
             inject(AnimalService, {host: true}=>"&#x1F436;")> <!-- host stops search here -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>

</docs-code>

3番目の動物、ハリネズミ <code>&#x1F994;</code> を含む `viewProviders` 配列を、 `app.component.ts` の `@Component()` メタデータに追加します。

<docs-code language="typescript" highlight="[6]">
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  viewProviders: [
    { provide: AnimalService, useValue: { emoji: '&#x1F994;' } },
  ],
})

</docs-code>

Next, add `skipSelf` along with `host` to the `inject()` for the `AnimalService` injection in `child.component.ts`.
Here are `host` and `skipSelf` in the `animal` property initialization:

<docs-code language="typescript" highlight="[4]">
export class ChildComponent {
  animal = inject(AnimalService, { host: true, skipSelf: true });
}

</docs-code>

<!-- TODO: This requires a rework. It seems not well explained what `viewProviders`/`injectors` is here
  and how `host` works.
 -->

When `host` and `skipSelf` were applied to the `FlowerService`, which is in the `providers` array, the result was `null` because `skipSelf` starts its search in the `<app-child>` injector, but `host` stops searching at `<#VIEW>` —where there is no `FlowerService`
論理ツリーでは、 `FlowerService` は `<app-child>` で可視であり、 `<#VIEW>` では可視ではないことがわかります。

ただし、 `AppComponent` の `viewProviders` 配列で提供されている `AnimalService` は可視です。

論理ツリーの表現は、これが理由を示しています。

<docs-code language="html">

<app-root @ApplicationConfig
        @Inject(AnimalService=>"&#x1F433;")>
  <#VIEW @Provide(AnimalService="&#x1F994;")
         @Inject(AnimalService, @Optional)=>"&#x1F994;">
    <!-- ^^skipSelf starts here,  host stops here^^ -->
    <app-child>
      <#VIEW @Provide(AnimalService="&#x1F436;")
             inject(AnimalService, {skipSelf:true, host: true, optional: true})=>"&#x1F994;">
               <!-- Add skipSelf ^^-->
      </#VIEW>
      </app-child>
  </#VIEW>
</app-root>

</docs-code>

`skipSelf`, causes the injector to start its search for the `AnimalService` at the `<app-root>`, not the `<app-child>`, where the request originates, and `host` stops the search at the `<app-root>` `<#VIEW>`.
`AnimalService` は `viewProviders` 配列を介して提供されるため、インジェクターは `<#VIEW>` でハリネズミ <code>&#x1F994;</code> を見つけます。

## 例： `ElementInjector` のユースケース

さまざまなレベルで1つ以上のプロバイダーを構成する機能により、便利な可能性が開かれます。

### シナリオ：サービスの分離

アーキテクチャ上の理由から、サービスへのアクセスを属するアプリケーションドメインに制限する必要がある場合があります。
たとえば、悪役のリストを表示する `VillainsListComponent` を構築するとします。
この悪役は、 `VillainsService` から取得されます。

`VillainsService` をルートの `AppModule` で提供すると、 `VillainsService` がアプリケーションのすべての場所で可視になります。
後で `VillainsService` を変更した場合、誤ってこのサービスに依存し始めた他のコンポーネントで何かが壊れる可能性があります。

代わりに、次のように `VillainsListComponent` の `providers` メタデータで `VillainsService` を提供する必要があります。

<docs-code header="src/app/villains-list.component.ts (metadata)" language="typescript"
           highlight="[4]">
@Component({
  selector: 'app-villains-list',
  templateUrl: './villains-list.component.html',
  providers: [VillainsService]
})
export class VillainsListComponent {}
</docs-code>

`VillainsService` を `VillainsListComponent` メタデータで提供し、他の場所では提供しないと、サービスは `VillainsListComponent` とそのサブコンポーネントツリーのみに使用可能になります。

`VillainService` は、 `VillainsListComponent` に対してシングルトンです。なぜなら、それが宣言されている場所だからです。
`VillainsListComponent` が破棄されない限り `VillainService` のインスタンスは同じです。ただし `VillainsListComponent` のインスタンスが複数ある場合、 `VillainsListComponent` の各インスタンスには、独自の `VillainService` インスタンスが1つずつあります。

### シナリオ：複数の編集セッション

多くのアプリケーションでは、ユーザーは同時に複数のオープンタスクで作業できます。
たとえば、税務申告の作成アプリケーションでは、作成者は複数の税務申告で作業し、1日を通してそれらを切り替えることができます。

そのシナリオを示すために、スーパーヒーローのリストを表示する `HeroListComponent` を考えてみてください。

ヒーローの税務申告を開くために、作成者はヒーローの名前をクリックすると、その申告を編集するためのコンポーネントが開きます。
選択したヒーローの税務申告は、それぞれ独自のコンポーネントで開き、複数の申告を同時に開くことができます。

各税務申告コンポーネントには、次の機能があります。

* 独自の税務申告の編集セッションを持ちます
* 別のコンポーネントの申告に影響を与えずに税務申告を変更できます
* 税務申告の変更を保存するか、キャンセルする機能があります

`HeroTaxReturnComponent` に、変更を管理および復元するためのロジックがあるとします。
これは、ヒーローの税務申告にとっては簡単なタスクです。
現実世界では、豊富な税務申告データモデルでは、変更管理が複雑になります。
この例のように、この管理をヘルパーサービスに委任できます。

`HeroTaxReturnService` は、単一の `HeroTaxReturn` をキャッシュし、その申告への変更を追跡し、保存または復元できます。
また、注入によって取得したアプリケーション全体のシングルトン `HeroService` に委任します。

<docs-code header="src/app/hero-tax-return.service.ts" language="typescript">
import { Injectable } from '@angular/core';
import { HeroTaxReturn } from './hero';
import { HeroesService } from './heroes.service';

@Injectable()
export class HeroTaxReturnService {
  private currentTaxReturn!: HeroTaxReturn;
  private originalTaxReturn!: HeroTaxReturn;

  private heroService = inject(HeroesService);

  set taxReturn(htr: HeroTaxReturn) {
    this.originalTaxReturn = htr;
    this.currentTaxReturn  = htr.clone();
  }

  get taxReturn(): HeroTaxReturn {
    return this.currentTaxReturn;
  }

  restoreTaxReturn() {
    this.taxReturn = this.originalTaxReturn;
  }

  saveTaxReturn() {
    this.taxReturn = this.currentTaxReturn;
    this.heroService.saveTaxReturn(this.currentTaxReturn).subscribe();
  }
}
</docs-code>

以下は、 `HeroTaxReturnService` を使用する `HeroTaxReturnComponent` です。

<docs-code header="src/app/hero-tax-return.component.ts" language="typescript">
import { Component, EventEmitter, input, output } from '@angular/core';
import { HeroTaxReturn } from './hero';
import { HeroTaxReturnService } from './hero-tax-return.service';

@Component({
  selector: 'app-hero-tax-return',
  templateUrl: './hero-tax-return.component.html',
  styleUrls: [ './hero-tax-return.component.css' ],
  providers: [ HeroTaxReturnService ]
})
export class HeroTaxReturnComponent {
  message = '';

  close = output<void>();

  get taxReturn(): HeroTaxReturn {
    return this.heroTaxReturnService.taxReturn;
  }

  taxReturn = input.required<HeroTaxReturn>();

  constructor() {
    effect(() => {
      this.heroTaxReturnService.taxReturn = this.taxReturn();
    })
  }

  private heroTaxReturnService = inject(HeroTaxReturnService);

  onCanceled()  {
    this.flashMessage('Canceled');
    this.heroTaxReturnService.restoreTaxReturn();
  }

  onClose() { this.close.emit(); }

  onSaved() {
    this.flashMessage('Saved');
    this.heroTaxReturnService.saveTaxReturn();
  }

  flashMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 500);
  }
}
</docs-code>

_編集対象の税務申告_ は、 `input` プロパティを介して到着します。これは、ゲッターとセッターで実装されています。
セッターは、コンポーネント自身の `HeroTaxReturnService` インスタンスを、受信した申告で初期化します。
ゲッターは常に、そのサービスがヒーローの現在の状態であると判断したものを返します。
コンポーネントは、この税務申告を保存および復元することもサービスに要求します。

これは、サービスがアプリケーション全体のシングルトンである場合に機能しません。
すべてのコンポーネントは同じサービスインスタンスを共有し、各コンポーネントは別のヒーローに属する税務申告を上書きします。

これを防ぐために、コンポーネントレベルのインジェクター `HeroTaxReturnComponent` を構成して、コンポーネントメタデータの `providers` プロパティを使用してサービスを提供します。

<docs-code header="src/app/hero-tax-return.component.ts (providers)" language="typescript">
providers: [HeroTaxReturnService]
</docs-code>

`HeroTaxReturnComponent` には、 `HeroTaxReturnService` の独自の提供者がいます。
覚えておいてください。すべてのコンポーネントの _インスタンス_ には、独自のインジェクターがあります。
コンポーネントレベルでサービスを提供すると、コンポーネントの _すべての_ インスタンスは、サービスのプライベートインスタンスを1つずつ取得することが保証されます。これにより、税務申告が上書きされないようにします。

HELPFUL: シナリオコードの残りは、ドキュメントの他の場所で学習できる他のAngular機能とテクニックに依存しています。

### シナリオ：特殊なプロバイダー

別のレベルでサービスを再度提供するもう1つの理由は、コンポーネントツリーのさらに深い場所で、そのサービスの _より特殊な_ 実装を置き換えるためです。

たとえば、タイヤサービスの情報を含み、他のサービスに依存して車の詳細情報を提供する `Car` コンポーネントを検討してください。

ルートインジェクター（(A) とマーク付け）は、 `CarService` と `EngineService` について、_汎用的な_ プロバイダーを使用します。

1. `Car` コンポーネント (A)。コンポーネント (A) は、車のタイヤサービスデータを表示し、車の詳細情報を提供するための汎用サービスを指定します。

2. 子コンポーネント (B)。コンポーネント (B) は、コンポーネント (B) で行われていることに適した特別な機能を持つ、 `CarService` と `EngineService` の独自の _特殊な_ プロバイダーを定義します。

3. コンポーネント (B) の子である子コンポーネント (C)。コンポーネント (C) は、 `CarService` の独自の、さらに _特殊な_ プロバイダーを定義します。

```mermaid
graph TD;
subgraph COMPONENT_A[Component A]
subgraph COMPONENT_B[Component B]
COMPONENT_C[Component C]
end
end

style COMPONENT_A fill:#BDD7EE
style COMPONENT_B fill:#FFE699
style COMPONENT_C fill:#A9D18E,color:#000
classDef noShadow filter:none
class COMPONENT_A,COMPONENT_B,COMPONENT_C noShadow
```

裏側では、各コンポーネントはコンポーネント自体に定義された、0、1または複数のプロバイダーで独自のインジェクターを設定します。

最も深いコンポーネント (C) で `Car` のインスタンスを解決すると、そのインジェクターは次を生成します。

* インジェクター (C) によって解決された `Car` のインスタンス
* インジェクター (B) によって解決された `Engine`
* ルートインジェクター (A) によって解決された `Tires`。

```mermaid
graph BT;

subgraph A[" "]
direction LR
RootInjector["(A) RootInjector"]
ServicesA["CarService, EngineService, TiresService"]
end

subgraph B[" "]
direction LR
ParentInjector["(B) ParentInjector"]
ServicesB["CarService2, EngineService2"]
end

subgraph C[" "]
direction LR
ChildInjector["(C) ChildInjector"]
ServicesC["CarService3"]
end

direction LR
car["(C) Car"]
engine["(B) Engine"]
tires["(A) Tires"]

direction BT
car-->ChildInjector
ChildInjector-->ParentInjector-->RootInjector

class car,engine,tires,RootInjector,ParentInjector,ChildInjector,ServicesA,ServicesB,ServicesC,A,B,C noShadow
style car fill:#A9D18E,color:#000
style ChildInjector fill:#A9D18E,color:#000
style engine fill:#FFE699,color:#000
style ParentInjector fill:#FFE699,color:#000
style tires fill:#BDD7EE,color:#000
style RootInjector fill:#BDD7EE,color:#000
```

## 依存性の注入の詳細

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="DIプロバイダー"/>
</docs-pill-row>
