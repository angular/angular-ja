# 階層的インジェクター

Angularのインジェクターには、
アプリケーションで期待とおりのインジェクターブルの可視性を実現するために活用できるルールがあります。
これらのルールを理解することにより、
プロバイダーを宣言する必要があるNgModuleまたはコンポーネントを決定できます。

<div class="alert is-helpful">

**NOTE**:<br />
This topic uses the following pictographs.

| html entities | pictographs |
|:---         |:--- |
| <code>&#x1F33A;</code> | red hibiscus \(`🌺`\)  |
| <code>&#x1F33B;</code> | sunflower \(`🌻`\)     |
| <code>&#x1F33C;</code> | yellow flower \(`🌼`\) |
| <code>&#x1F33F;</code> | fern \(`🌿`\)          |
| <code>&#x1F341;</code> | maple leaf \(`🍁`\)    |
| <code>&#x1F433;</code> | whale \(`🐳`\)         |
| <code>&#x1F436;</code> | dog \(`🐶`\)           |
| <code>&#x1F994;</code> | hedgehog \(`🦔`\)       |

</div>

## ２つのインジェクター階層

Angularには2つのインジェクター階層があります。

1. `ModuleInjector`階層&mdash;
`@NgModule()`または`@Injectable()`アノテーションを使用して、この階層の`ModuleInjector`を設定します。
1. `ElementInjector`階層&mdash;
各DOM要素で暗黙的に作成されます。
`ElementInjector`は、
`@Directive()`または`@Component()`の`providers`プロパティで設定しない限り、デフォルトでは空です。

{@a register-providers-injectable}

### `ModuleInjector`

`ModuleInjector`は、次の2ついずれかの方法で設定できます:

* `@Injectable()`の`providedIn`プロパティを使用して、
`@NgModule()`、または`root`を参照します。
* `@NgModule()`の`providers`配列を使用します。

<div class="callout is-helpful">

<header>ツリーシェイキングと &commat;Injectable()</header>

`@Injectable()`の`providedIn`プロパティを使用することは、
`@NgModule()`の`providers`
配列を使用するよりも望ましい方法です。
なぜなら、`@Injectable()`の`providedIn`を使用することで、
最適化ツールはアプリケーションで使用されていないサービスをツリーシェイキングし、
バンドルサイズをより小さくできるからです。

ツリーシェイキングは特にライブラリで役立ちます。
ライブラリを使用しているアプリケーションにとって注入する必要のないものもあるからです。
詳しくは[サービスと依存性の注入の紹介](guide/architecture-services)
の[ツリーシェイク可能なプロバイダー](guide/architecture-services#providing-services)
のセクションを参照してください。

</div>

`ModuleInjector`は`@NgModule.providers`と
`NgModule.imports`プロパティから設定されます。
追跡している`NgModule.imports`を再帰的に探索して、すべてのプロバイダーを
平坦化します。

子の`ModuleInjector`は他の`@NgModule`が遅延ロードしたときに作成されます。

次のように、`@Injectable()`の`providedIn`プロパティを使用してサービスを提供してください:

```ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // <--このサービスをrootのModuleInjectorで提供する
})
export class ItemService {
  name = 'telephone';
}

```

`@Injectable()`デコレーターはサービスクラスを識別します。
`providedIn`プロパティは指定した`ModuleInjector`を設定します。
ここでは`root`です。これは`root`の`ModuleInjector`内でサービスを有効化します。

#### プラットフォームインジェクター

上で説明した`root`のほかにもう2つのインジェクターが存在します。
`ModuleInjector`と`NullInjector()`です。

Angularが、次の`main.ts`
を使用してどのようにアプリケーションをブートストラップするかを確認してください:

```javascript
platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {...})
```

`bootstrapModule()`メソッドは`AppModule`
によって設定されたプラットフォームインジェクターの子インジェクターを作成します。
これは`root`の`ModuleInjector`です。

`platformBrowserDynamic()`メソッドは、
`PlatformModule`によって設定された、プラットフォーム固有の依存関係を含むインジェクターを作成します。
これにより、
複数のアプリケーションがプラットフォームの設定を共有できます。
たとえば、実行しているアプリケーションの数に関係なく、
ブラウザにはURLバーは1つしかありません。
`platformBrowser()`関数を使用して`extraProviders`を提供することにより、
プラットフォームレベルで追加のプラットフォーム固有のプロバイダーを設定できます。

階層内の次の親インジェクターは、ツリーの最上部である`NullInjector()`です。
サービスのツリー探索が`NullInjector()`まで進んだ場合、
`@Optional()`を使用していない限りエラーが発生します。
最終的にすべてが`NullInjector()`で終わるため、
エラーを返すか、または`@Optional()`を使用している場合は`null`を返します。
`@Optional()`の詳細については、
このガイドの[`@Optional()` セクション](guide/hierarchical-dependency-injection#optional)を参照してください。

次の図は、前の段落で説明したように、
`root`の`ModuleInjector`
とその親インジェクターの関係を表しています。

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection/injectors.svg" alt="NullInjector, ModuleInjector, root injector">
</div>

`root`という名前は特別なエイリアスですが、他の`ModuleInjector`にはエイリアスはありません。
Routerが、子`ModuleInjector`を作成するように、
動的にロードされるコンポーネントが作成されるたびに
`ModuleInjector`を作成するオプションがあります。

`bootstrapModule()`メソッドを使用して設定したか、
各自のサービスですべてのプロバイダーを`root`に登録したかにかかわらず、
すべての要求はルートインジェクターに転送されます。

<div class="callout is-helpful">

<header>&commat;Injectable() vs. &commat;NgModule()</header>

`AppModule`の`@NgModule()`でアプリケーション全体のプロバイダーを設定すると、
`@Injectable()`メタデータで`root`用に設定されたプロバイダーをオーバーライドします。
これを行うと、
複数のアプリケーションで共有されるサービスのデフォルト以外のプロバイダーを設定できます。

コンポーネントのルーターの設定がデフォルト以外の
[LocationStrategy](guide/router#location-strategy)をもつように、
`AppModule`の`providers`
配列にプロバイダーを追加する例は
次のようになります。

<code-example path="dependency-injection-in-action/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)">

</code-example>

</div>

### `ElementInjector`

Angularは、DOM要素ごとに暗黙的に`ElementInjector`を作成します。

`providers`または`viewProviders`プロパティを使用して`@Component()`
デコレーターにサービスを提供すると、`ElementInjector`が設定されます。
たとえば、次の`TestComponent`は、
次のようにサービスを提供することにより
`ElementInjector`を設定します:

```ts
@Component({
  ...
  providers: [{ provide: ItemService, useValue: { name: 'lamp' } }]
})
export class TestComponent

```

<div class="alert is-helpful">

**Note:** `ModuleInjector`ツリーと`ElementInjector`
ツリーの関係を理解するに、
[解決ルール](guide/hierarchical-dependency-injection#resolution-rules)
のセクションを参照してください。

</div>


コンポーネント内でサービスを提供するとき、
そのサービスはそのコンポーネントインスタンスの`ElementInjector`を介して利用できます。
また、[解決ルール](guide/hierarchical-dependency-injection#resolution-rules)のセクションで説明されている可視性のルールにもとづいて、
子コンポーネント/ディレクティブで有効になる場合があります。

コンポーネントインスタンスが破棄されると、そのサービスインスタンスも破棄されます。

#### `@Directive()` と `@Component()`

コンポーネントは特別な型のディレクティブです。
つまり、`@Directive()`が`providers`プロパティを持っているのと同じように、
`@Component()`も持っています。
これは、`providers`プロパティを使用して、
ディレクティブとコンポーネントがプロバイダーを設定できることを意味します。
`providers`プロパティを使用してコンポーネントまたはディレクティブのプロバイダーを設定すると、
そのプロバイダーはそのコンポーネントまたはディレクティブの
`ElementInjector`に属します。
同じ要素のコンポーネントとディレクティブはインジェクターを共有します。


{@a resolution-rules}

## 解決ルール

コンポーネント/ディレクティブのトークンを解決するとき、
Angularは2つのフェーズでトークンを解決します。

1. `ElementInjector`階層(その祖先)をさかのぼる
1. `ModuleInjector`階層(その祖先)をさかのぼる

コンポーネントが依存性を宣言すると、
Angularは各自の`ElementInjector`でその依存関係を満たそうとします。
コンポーネントのインジェクターにプロバイダーがない場合、
親コンポーネントの`ElementInjector`に要求を渡します。

要求は、Angularが要求を処理できるインジェクターを見つけるか、
祖先の`ElementInjector`を使い果たすまで転送を続けます。

Angularが`ElementInjector`でプロバイダーを見つけられない場合、
リクエストが発生した要素に戻り、`ModuleInjector`階層を調べます。
それでもAngularがプロバイダーを見つけられない場合、
エラーをスローします。

異なるレベルで同じDIトークンのプロバイダーを登録した場合、Angularが最初に遭遇したものを
依存関係を解決するために使用するプロバイダーとします。
たとえば、
サービスを必要とするコンポーネント内でプロバイダーがローカルに登録されている場合、
Angularは同じサービスの別のプロバイダーを探しません。


## 解決修飾子

Angularの解決動作は、`@Optional()`、
`@Self()`、`@SkipSelf()`、`@Host()`で変更できます。
`@angular/core`からそれぞれをインポートし、サービスを注入するときにコンポーネントクラスのコンストラクターでそれぞれを使用します。

このセクションがカバーする、解決修飾子を紹介する動作中のアプリケーションについては、
<live-example name="resolution-modifiers">解決修飾子の例</live-example>を参照してください。

### 修飾子のタイプ

解決修飾子は3つのカテゴリーに分類されます。

1. 検索しているものをAngularが見つけられない場合は、
`@Optional()`です
2. 検索を開始する場所は、`@SkipSelf()`です
3. 検索を停止する場所は、`@Host()`および`@Self()`です

デフォルトでは、Angularは常に現在の`Injector`から開始し、
すべてさかのぼるまで検索を続けます。修飾子を使用すると、
開始(自身)または終了の場所を変更できます。

さらに、`@Host()`と`@Self()`、そして`@SkipSelf()`と`@Self()`を除くすべての修飾子を組み合わせることができます。

{@a optional}

### `@Optional()`

`@Optional()`を使用すると、
Angularは注入するサービスをオプショナルと見なすことができます。
この方法では、実行時に解決できない場合、Angularはエラーをスローするのではなく、
単にサービスを`null`として解決します。次の例では、`OptionalService` サービスが、
`@NgModule()`、またはコンポーネントクラスで提供されていないため、
アプリケーションのどこからも利用できません。

<code-example path="resolution-modifiers/src/app/optional/optional.component.ts" header="resolution-modifiers/src/app/optional/optional.component.ts" region="optional-component">

</code-example>


### `@Self()`

`@Self()`を使用すると、Angularが現在のコンポーネントまたはディレクティブの`ElementInjector`のみを参照するようにします。

サービスを注入するが、現在のホスト要素のみで利用できる場合、
`@Self()`の適切なユースケースとなります。
この状況でエラーを回避するには、`@Self()`と`@Optional()`を組み合わせます。

たとえば、次の`SelfComponent`内の
コンストラクターに注入された
`LeafService`に注目してください。

<code-example path="resolution-modifiers/src/app/self-no-data/self-no-data.component.ts" header="resolution-modifiers/src/app/self-no-data/self-no-data.component.ts" region="self-no-data-component">

</code-example>

この例では、親プロバイダーが存在し、サービスを注入することで値が返されます。
しかし、`@Self()`と`@Optional()`
を使用してサービスを注入すると、
`@Self()`はインジェクターに現在のホスト要素で検索を停止するように指示するため、
`null`を返します。

もう1つの例、`FlowerService`のプロバイダーをもつコンポーネントクラスを見てみます。
この場合インジェクターは、`FlowerService`を見つけて黄色の花🌼を返すため、
現在の`ElementInjector`よりも先を探しません。


<code-example path="resolution-modifiers/src/app/self/self.component.ts" header="resolution-modifiers/src/app/self/self.component.ts" region="self-component">

</code-example>

### `@SkipSelf()`

`@SkipSelf()`は`@Self()`の反対です。`@SkipSelf()`を使用すると、
Angularは現在の`ElementInjector`ではなく、親の`ElementInjector`からサービスの検索を開始します。
なので、親の`ElementInjector`が`emoji`の値`🌿`(シダ)を使用していて、
コンポーネントのプロバイダー配列に`🍁`(カエデの葉)が含まれている場合、
Angularは`🍁`(カエデの葉)を無視して`🌿`(シダ)を使用します。

これをコードで確認するために、次のような`emoji`の値のサービスを親コンポーネントが使用していたものと想定します:

<code-example path="resolution-modifiers/src/app/leaf.service.ts" header="resolution-modifiers/src/app/leaf.service.ts" region="leafservice">

</code-example>

子コンポーネントで別の値`🍁`(カエデの葉)を持っているが、代わりに親の値を使用したいとします。`@SkipSelf()`を使用するときです:

<code-example path="resolution-modifiers/src/app/skipself/skipself.component.ts" header="resolution-modifiers/src/app/skipself/skipself.component.ts" region="skipself-component">

</code-example>

このケースでは、`emoji`の値は`🍁` (カエデの葉)ではなく、`🌿` (シダ)になるでしょう。

#### `@SkipSelf()` と `@Optional()` を併用する

`@SkipSelf()`と`@Optional()`を使用して、値が`null`の場合にエラーになるのを防ぎます。次の例では、`Person`サービスがコンストラクターに注入されます。`@SkipSelf()`は、Angularに現在のインジェクターをスキップするように指示し、`@Optional()`は`Person`サービスが`null`の場合にエラーになるのを防ぎます。

``` ts
class Person {
  constructor(@Optional() @SkipSelf() parent?: Person) {}
}
```

### `@Host()`

`@Host()`を使用すると、プロバイダーを検索するときに、コンポーネントをインジェクターツリーの終点として指定できます。ツリーのさらに上にサービスインスタンスがあっても、Angularは検索を続行しません。`@Host()`の使用例は次のようになります:

<code-example path="resolution-modifiers/src/app/host/host.component.ts" header="resolution-modifiers/src/app/host/host.component.ts" region="host-component">

</code-example>


`HostComponent`のコンストラクターに`@Host()`があるため、
`HostComponent`の親が`flower.emoji`値として何を持っているかに関係なく、
`HostComponent`は
`🌼`(黄色の花)を使用します。


## テンプレートの論理構造

コンポーネントクラスでサービスを提供すると、
それらのサービスを提供する場所と方法に関連する
`ElementInjector`ツリー内にサービスが可視化されます。

Angularのテンプレートの根本的な論理構造を理解すると、
サービスを設定し、
その可視性を制御するための基礎が学べます。

次の例のように、コンポーネントはテンプレートで使用されます:

```
<app-root>
    <app-child></app-child>
</app-root>
```

<div class="alert is-helpful">

**Note:** 通常、コンポーネントとそのテンプレートは別々のファイルで宣言します。
注入システムがどのように機能するかを理解するために、
結合された論理ツリーの観点からそれらを見ることが有用です。
論理という用語は、レンダリングツリー
(アプリケーションDOMツリー)と区別します。
コンポーネントテンプレートが配置されている場所をマークするために、
このガイドでは
`<#VIEW>`擬似要素を使用します。
これは実際にはレンダーツリーには存在せず、メンタルモデルの目的でのみ存在します。

</div>

次の例では、`<app-root>`および`<app-child>`ビューツリーがどのように単一の論理ツリーに結合されるかを示します:

```
<app-root>
  <#VIEW>
    <app-child>
     <#VIEW>
       ...content goes here...
     </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
 ```

コンポーネントクラス内でサービスを設定する場合は、`<#VIEW>`境界の概念を理解することが特に重要です。

## `@Component()`内でサービスを提供する {@a providing-services-in-component}

どのように`@Component()`(または`@Directive()`)デコレーターを介してサービスを提供するかによって、
それらの可視性が決まります。
次のセクションでは、`@SkipSelf()`および`@Host()`
を使用してサービスの可視性を変更する方法とともに、`providers`と`viewProviders`を説明します。

コンポーネントクラスは、2つの方法でサービスを提供できます:

1. `providers` 配列を使用する

```typescript=
@Component({
  ...
  providers: [
    {provide: FlowerService, useValue: {emoji: '🌺'}}
  ]
})
```

2. `viewProviders` 配列を使用する

```typescript=
@Component({
  ...
  viewProviders: [
    {provide: AnimalService, useValue: {emoji: '🐶'}}
  ]
})
```

`providers`と`viewProviders`がサービスの可視性にどのように異なる影響を与えるかを理解するために、
次のセクションでは
<live-example name="providers-viewproviders"></live-example>
を順を追って作成し、
コードと論理ツリーでの`providers`と`viewProviders`の使用を比較します。

<div class="alert is-helpful">

**NOTE:** 論理ツリーには、`@Provide`、`@Inject`、および`@NgModule`が表示されます。
これらは実際のHTML属性ではありませんが、
内部で何が行われているかを示すためにここにあります。

| Angular service attribute                                                                                          | Details |
|:---                                                                                                                |:---     |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Inject(Token)=&gt;Value </code-example> | Demonstrates that if `Token` is injected at this location in the logical tree its value would be `Value`.             |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Provide(Token=Value) </code-example>    | Demonstrates that there is a declaration of `Token` provider with value `Value` at this location in the logical tree. |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule(Token) </code-example>         | Demonstrates that a fallback `NgModule` injector should be used at this location.                                     |

</div>

### アプリケーション構造の例

サンプルアプリケーションでは、`🌺`(赤いハイビスカス)
が値の`emoji`をもつ`FlowerService`が`root`で提供されます。

<code-example path="providers-viewproviders/src/app/flower.service.ts" header="providers-viewproviders/src/app/flower.service.ts" region="flowerservice">

</code-example>

`AppComponent`と`ChildComponent`のみをもつシンプルなアプリケーションを考えてください。
もっとも基本的なレンダリングビューは、
次のようなネストされたHTML要素のように見えます:

```
<app-root> <!-- AppComponent selector -->
    <app-child> <!-- ChildComponent selector -->
    </app-child>
</app-root>
```

ただし、バックグラウンドで、
Angularは注入のリクエストを解決するときに次のように論理ビュー表現を使用します:

```
<app-root> <!-- AppComponent selector -->
    <#VIEW>
        <app-child> <!-- ChildComponent selector -->
            <#VIEW>
            </#VIEW>
        </app-child>
    </#VIEW>
</app-root>
 ```

ここでの`<#VIEW>`は、テンプレートのインスタンスを表します。
各コンポーネントには個々の`<#VIEW>`があることに注意してください。

この構造の知識は、サービスを提供および注入する方法を通知し、
サービスの可視性を完全に制御できます。

ここで、`<app-root>`が単に`FlowerService`を注入することを考えてください:


<code-example path="providers-viewproviders/src/app/app.component.1.ts" header="providers-viewproviders/src/app/app.component.ts" region="injection">

</code-example>

`<app-root>`テンプレートにバインディングを追加して、結果を表示します:

<code-example path="providers-viewproviders/src/app/app.component.html" header="providers-viewproviders/src/app/app.component.html" region="binding-flower">

</code-example>


ビュー内のアウトプットは次のようになるでしょう:

```
Emoji from FlowerService: 🌺
```

論理ツリーでは、これは次のように表されます:

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <p>Emoji from FlowerService: {{flower.emoji}} (🌺)</p>
    <app-child>
      <#VIEW>
      </#VIEW>
     </app-child>
  </#VIEW>
</app-root>
```

`<app-root>`が`FlowerService`を要求する場合、
`FlowerService`トークンを解決するのはインジェクターの仕事です。
トークンの解決は2つのフェーズで行われます。

1. インジェクターは、論理ツリーの開始位置と検索の終了位置を決定します。
インジェクターは開始位置から始まり、
論理ツリーの各レベルでトークンを探します。
トークンが見つかった場合は返されます。
2. トークンが見つからない場合、インジェクターはリクエストを委譲するもっとも近い親
`@NgModule()`を探します。

この例での制約は:

1. `<app-root>`に属する`<#VIEW>`で開始し、`<app-root>`で終了します。

  - 通常、検索の開始点は注入した点です。
  ただし、この場合、`<app-root>`の`@Component`は、
  独自の`viewProviders`も含むという点で特別です。
  そのため、`<app-root>`に属する`<#VIEW>`で検索が開始されます。
  (これは、同じ場所で一致したディレクティブの場合ではありません)。
  - 終了位置は、このアプリケーションの最上位のコンポーネントであるため、
  たまたまコンポーネント自体と同じです。

2. `ElementInjector`でインジェクショントークンが見つからない場合、
`AppModule`はフォールバックインジェクターとして機能します。

### `providers` 配列を使用する

次に、`ChildComponent`クラス内で、
今後のセクションでより複雑な解決ルールを説明するために`FlowerService`のプロバイダーを追加します:

<code-example path="providers-viewproviders/src/app/child/child.component.1.ts" header="providers-viewproviders/src/app/child.component.ts" region="flowerservice">

</code-example>

`FlowerService`が`@Component()`デコレーターで提供されるようになったので、
`<app-child>`がサービスを要求すると、インジェクターは
`<app-child>`自身の`ElementInjector`を調べるだけで済みます。
インジェクターツリー全体で検索を続ける必要はありません。

次のステップでは、`ChildComponent`テンプレートにバインディングを追加します。

<code-example path="providers-viewproviders/src/app/child/child.component.html" header="providers-viewproviders/src/app/child.component.html" region="flower-binding">

</code-example>

新しい値をレンダリングするために、`<app-child>`を`AppComponent`
テンプレートの下部に追加して、ビューにひまわりも表示されるようにします:

```
Child Component
Emoji from FlowerService: 🌻
```

論理ツリーでは次のように表されます:

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <p>Emoji from FlowerService: {{flower.emoji}} (🌺)</p>
    <app-child @Provide(FlowerService="🌻")
               @Inject(FlowerService)=>"🌻"> <!-- search ends here -->
      <#VIEW> <!-- search starts here -->
        <h2>Parent Component</h2>
        <p>Emoji from FlowerService: {{flower.emoji}} (🌻)</p>
      </#VIEW>
     </app-child>
  </#VIEW>
</app-root>
```

`<app-child>`が`FlowerService`を要求すると、インジェクターは
`<app-child>`に属する`<#VIEW>`で検索を開始し
(`@Component()`からインジェクトされるため`<#VIEW>`が含まれます)、`<app-child>`で終了します。
このケースでは、`FlowerService`は、
`<app-child>`の`providers`配列のひまわり🌻を使用して解決されます。
インジェクターは、インジェクターツリーをこれ以上調べる必要はありません。
`FlowerService`を見つけるとすぐに停止し、🌺(赤いハイビスカス)が表示されることはありません。


{@a use-view-providers}

### `viewProviders` 配列を使用する

`@Component()`デコレーターでサービスを提供する別の方法として、
`viewProviders`配列を使用します。
`viewProviders`を使用すると、`<#VIEW>`でサービスが可視化されます。

<div class="is-helpful alert">

手順は、代わりに`viewProviders`配列を使用することを除いて、
`providers`配列を使用する場合と同じです。

段階的な手順については、このセクションを進めてください。
自分で設定できる場合は、[サービスの可視性を変更する](guide/hierarchical-dependency-injection#modify-visibility)セクションに進んでください。

</div>


サンプルアプリケーションでは、`viewProviders`を説明するために
`AnimalService`という2つ目のサービスを取り上げます。

最初に、クジラの`emoji`🐳プロパティをもつ`AnimalService`を作成します :

<code-example path="providers-viewproviders/src/app/animal.service.ts" header="providers-viewproviders/src/app/animal.service.ts" region="animal-service">

</code-example>


`FlowerService`と同じパターンにしたがって、
`AppComponent`クラスに`AnimalService`を注入します:

<code-example path="providers-viewproviders/src/app/app.component.ts" header="providers-viewproviders/src/app/app.component.ts" region="inject-animal-service">

</code-example>

<div class="alert is-helpful">

**Note:** `AnimalService`と比較するため、
`FlowerService`に関連するすべてのコードをそのままにしておくことができます。

</div>

`<app-child>`クラスに`viewProviders`配列を追加し、`AnimalService`を注入しますが、
`emoji`には別の値を指定します。
ここでは、値は🐶(子犬)です。


<code-example path="providers-viewproviders/src/app/child/child.component.ts" header="providers-viewproviders/src/app/child.component.ts" region="provide-animal-service">

</code-example>

`ChildComponent`および`AppComponent`テンプレートにバインディングを追加します。
`ChildComponent`テンプレートで、次のバインディングを追加します:

<code-example path="providers-viewproviders/src/app/child/child.component.html" header="providers-viewproviders/src/app/child.component.html" region="animal-binding">

</code-example>

さらに、同じものを`AppComponent`テンプレートに追加します:

<code-example path="providers-viewproviders/src/app/app.component.html" header="providers-viewproviders/src/app/app.component.html" region="binding-animal">

</code-example>

これで、ブラウザに両方の値が表示されるはずです:

```
AppComponent
Emoji from AnimalService: 🐳

Child Component
Emoji from AnimalService: 🐶

```

この`viewProviders`の例の論理ツリーは次のとおりです。:


```
<app-root @NgModule(AppModule)
        @Inject(AnimalService) animal=>"🐳">
  <#VIEW>
    <app-child>
      <#VIEW
       @Provide(AnimalService="🐶")
       @Inject(AnimalService=>"🐶")>
       <!-- ^^using viewProviders means AnimalService is available in <#VIEW>-->
       <p>Emoji from AnimalService: {{animal.emoji}} (🐶)</p>
      </#VIEW>
     </app-child>
  </#VIEW>
</app-root>
```

`FlowerService`の例と同様に、`AnimalService`は`<app-child>`の `@Component()`デコレーターで提供されます。
これは、インジェクターがコンポーネントの`ElementInjector`を最初に見て、その後に
`AnimalService`値🐶(`puppy`)を見つけることを意味します。
`ElementInjector`ツリーを検索し続ける必要も、
`ModuleInjector`を検索する必要もありません。

### `providers` vs. `viewProviders`

`providers`と`viewProviders`の使用の違いを確認するため、例に別のコンポーネントを追加し、
それを`InspectorComponent`と呼びます。
`InspectorComponent`は、`ChildComponent`の子になります。
`inspector.component.ts`で、コンストラクターに
`FlowerService`と`AnimalService`を注入します。


<code-example path="providers-viewproviders/src/app/inspector/inspector.component.ts" header="providers-viewproviders/src/app/inspector/inspector.component.ts" region="injection">

</code-example>

`providers`または`viewProviders`配列は必要ありません。
 次に、`inspector.component.html`で、さきほどのコンポーネントから同じマークアップを追加します

<code-example path="providers-viewproviders/src/app/inspector/inspector.component.html" header="providers-viewproviders/src/app/inspector/inspector.component.html" region="binding">

</code-example>

`InspectorComponent`を`AppModule`の`declarations`配列に忘れずに追加してください。

<code-example path="providers-viewproviders/src/app/app.module.ts" header="providers-viewproviders/src/app/app.module.ts" region="appmodule">

</code-example>


次に、`child.component.html`に次のものが含まれていることを確認します:

<code-example path="providers-viewproviders/src/app/child/child.component.html" header="providers-viewproviders/src/app/child/child.component.html" region="child-component">

</code-example>

バインディングを含む最初の2行は、前のステップからのものです。
新しい部分は`<ng-content>`と`<app-inspector>`です。
`<ng-content>`を使用すると、コンテンツを投影できます。
そして、`ChildComponent`テンプレート内の`<app-inspector>`は、
`InspectorComponent`を`ChildComponent`の子コンポーネントにします。

次に、コンテンツの投影を利用するために`app.component.html`に次のものを追加します。

<code-example path="providers-viewproviders/src/app/app.component.html" header="providers-viewproviders/src/app/app.component.html" region="content-projection">

</code-example>

ブラウザは、次のようにレンダリングします。
簡潔にするために前の例を省略しています:

```

//...Omitting previous examples. The following applies to this section.

Content projection: This is coming from content. Doesn't get to see
puppy because the puppy is declared inside the view only.

Emoji from FlowerService: 🌻
Emoji from AnimalService: 🐳

Emoji from FlowerService: 🌻
Emoji from AnimalService: 🐶

```

これらの4つのバインディングは、`providers`と`viewProviders`の違いを示しています。
🐶 (子犬)は`<#VIEW>`内で宣言されているため、
投影されたコンテンツには可視化されません。
代わりに、投影されたコンテンツには🐳 (クジラ)が表示されます。

ただし、次のセクション(`InspectorComponent`が`ChildComponent`
の子コンポーネントとなっている)では、`InspectorComponent`は`<#VIEW>`内にあるため、
`AnimalService`を要求すると、🐶(子犬)が表示されます。

論理ツリーの`AnimalService`は次のようになります:

```
<app-root @NgModule(AppModule)
        @Inject(AnimalService) animal=>"🐳">
  <#VIEW>
    <app-child>
      <#VIEW
       @Provide(AnimalService="🐶")
       @Inject(AnimalService=>"🐶")>
       <!-- ^^using viewProviders means AnimalService is available in <#VIEW>-->
       <p>Emoji from AnimalService: {{animal.emoji}} (🐶)</p>
       <app-inspector>
        <p>Emoji from AnimalService: {{animal.emoji}} (🐶)</p>
       </app-inspector>
      </#VIEW>
      <app-inspector>
        <#VIEW>
          <p>Emoji from AnimalService: {{animal.emoji}} (🐳)</p>
        </#VIEW>
      </app-inspector>
     </app-child>
  </#VIEW>
</app-root>
```

🐶(子犬)は`<app-child>`の`<#VIEW>`内にあるため、
`<app-inspector>`の投影されたコンテンツには、
🐶(子犬)ではなく🐳,(クジラ)が表示されます。
`<app-inspector>`が`<#VIEW>`
内部にある場合にのみ🐶(子犬)が表示されます。

{@a modify-visibility}

## サービスの可視性を変更する {@a modifying-service-visibility}

このセクションでは、可視性デコレーター`@Host()`、`@Self()`、および
`@SkipSelf()`を使用して、
`ElementInjector`の開始および終了のスコープを制限する方法について説明します。

### 提供されたトークンの可視性

可視性デコレーターは、
インジェクショントークンの検索が論理ツリーのどこで開始、終了するかに影響します。
これを行うために、可視性デコレーターを宣言の場所ではなく、注入する場所、
つまり`constructor()`に配置します。

インジェクターが`FlowerService`の検索を開始する場所を変更するには、
`<app-child>`での`FlowService`の`@Inject`宣言に`@SkipSelf()`を追加します。
この宣言は、`child.component.ts`の
`<app-child>`コンストラクターにあります:

```typescript=
  constructor(@SkipSelf() public flower : FlowerService) { }
```

`@SkipSelf()`を使用すると、`<app-child>`インジェクターは自身からは`FlowerService`を検索しません。
代わりに、インジェクターは`<app-root>`の`ElementInjector`で`FlowerService`の検索を開始しますが、何も見つかりません。
次に、`<app-child>`の`ModuleInjector`に戻り、
🌺(赤いハイビスカス)値を見つけます。
これは、`<app-child>`の`ModuleInjector`と
`<app-root>`の`ModuleInjector`が1つの`ModuleInjector`
に平坦化されているために利用可能です。結果として、UIは次のようにレンダリングします:

```
Emoji from FlowerService: 🌺
```

論理ツリーでは、これと同じ考え方は次のようになります:

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <app-child @Provide(FlowerService="🌻")>
      <#VIEW @Inject(FlowerService, SkipSelf)=>"🌺">
      <!-- With SkipSelf, the injector looks to the next injector up the tree -->
      </#VIEW>
      </app-child>
  </#VIEW>
</app-root>
```

`<app-child>`
は🌻(ヒマワリ)を提供しますが、`@SkipSelf()`
により現在のインジェクターがそれ自体をスキップして親を見るため、
アプリケーションは🌺(赤いハイビスカス)をレンダリングします。

`FlowerService`の`@Inject`に(`@SkipSelf()`に加えて)`@Host()`を追加すると、
結果は`null`になります。
これは、`@Host()`が検索の上限を`<#VIEW>`に制限するためです。
論理ツリーは次のようになります:

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW> <!-- end search here with null-->
    <app-child @Provide(FlowerService="🌻")> <!-- start search here -->
      <#VIEW @Inject(FlowerService, @SkipSelf, @Host, @Optional)=>null>
      </#VIEW>
      </app-parent>
  </#VIEW>
</app-root>
```

ここでは、サービスとその値は同じですが、
`@Host()`はインジェクターが`FlowerService`の`<#VIEW>`
より先を探すことを停止するため、見つからず、`null`を返します。

<div class="alert is-helpful">

**Note:** サンプルアプリケーションは`@Optional()`を使用しているため、
アプリケーションはエラーをスローしませんが、原則は同じです。

</div>

### `@SkipSelf()` と `viewProviders`

`<app-child>`は現在、`viewProviders`配列で🐶(子犬)の値をもつ`AnimalService`を提供します。
インジェクターは、`AnimalService`
を見つけるために`<app-child>`の`ElementInjector`
を見るだけでよいため、🐳(クジラ)は表示されません。

`FlowerService`の例のように、
コンストラクターの`AnimalService`に`@SkipSelf()`を追加した場合、インジェクターは現在の`<app-child>`
の`ElementInjector`の
`AnimalService`を検索しません。

```typescript=
export class ChildComponent {

// add @SkipSelf()
  constructor(@SkipSelf() public animal : AnimalService) { }

}
```

代わりに、インジェクターは`<app-root>`の`ElementInjector`から開始します。
`<app-child>`クラスは、
`viewProviders`配列で🐶(子犬)の値をもつ`AnimalService`
を提供することを忘れないでください:

```ts
@Component({
  selector: 'app-child',
  ...
  viewProviders:
  [{ provide: AnimalService, useValue: { emoji: '🐶' } }]
})
```

`<app-child>`内の`@SkipSelf()`の論理ツリーは次のようになります:

```
  <app-root @NgModule(AppModule)
          @Inject(AnimalService=>"🐳")>
    <#VIEW><!-- search begins here -->
      <app-child>
        <#VIEW
         @Provide(AnimalService="🐶")
         @Inject(AnimalService, SkipSelf=>"🐳")>
         <!--Add @SkipSelf -->
        </#VIEW>
        </app-child>
    </#VIEW>
  </app-root>
```

`<app-child>`内の`@SkipSelf()`によって、インジェクターは
`<app-root>`の`ElementInjector`で`AnimalService`の検索を開始し、
🐳(クジラ)を見つけます。

### `@Host()` と `viewProviders`

コンストラクターの`AnimalService`に`@Host()`を追加すると、
インジェクターは`<app-child>`の`<#VIEW>`で`AnimalService`
を見つけるため、結果は🐶(子犬)になります。
`<app-child>`クラスの`viewProviders`配列とコンストラクター内の`@Host()`は次のようになります:

```typescript=
@Component({
  selector: 'app-child',
  ...
  viewProviders:
  [{ provide: AnimalService, useValue: { emoji: '🐶' } }]

})
export class ChildComponent {
  constructor(@Host() public animal : AnimalService) { }
}
```

`@Host()`により、インジェクターは`<#VIEW>`のエッジに到達するまで検索します。

```
  <app-root @NgModule(AppModule)
          @Inject(AnimalService=>"🐳")>
    <#VIEW>
      <app-child>
        <#VIEW
         @Provide(AnimalService="🐶")
         @Inject(AnimalService, @Host=>"🐶")> <!-- @Host stops search here -->
        </#VIEW>
        </app-child>
    </#VIEW>
  </app-root>
```

`app.component.ts`の`@Component()`メタデータに、
3番目の動物🦔(ハリネズミ)をもつ`viewProviders`配列を追加してください:

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  viewProviders: [{ provide: AnimalService, useValue: { emoji: '🦔' } }]
})
```

次に、`child.component.ts`の`AnimalService`
のコンストラクターに`@Host()`とともに`@SkipSelf()`を追加します。
`<app-child>`コンストラクターの
`@Host()`と`@SkipSelf()`は次のとおりです:

```ts
export class ChildComponent {

  constructor(
  @Host() @SkipSelf() public animal : AnimalService) { }

}
```

`@Host()`と`@SkipSelf()`が`providers`
配列にある`AnimalService`に適用された場合、
`@SkipSelf()`は`<app-child>`インジェクターで検索を開始しますが、
`@Host()`は検索を`<#VIEW>`(には`AnimalService`がありません)で停止するため、結果は`null`になります。
論理ツリーでは、
`AnimalService`が`<#VIEW>`ではなく`<app-child>`内で可視化されていることがわかります。

ただし、`AppComponent`の`viewProviders`
配列で提供される`AnimalService`は可視化されます。

論理ツリー表現でこの理由を説明します:

```html
<app-root @NgModule(AppModule)
        @Inject(AnimalService=>"🐳")>
  <#VIEW @Provide(AnimalService="🦔")
         @Inject(AnimalService, @Optional)=>"🦔">
    <!-- ^^@SkipSelf() starts here,  @Host() stops here^^ -->
    <app-child>
      <#VIEW @Provide(AnimalService="🐶")
             @Inject(AnimalService, @SkipSelf, @Host, @Optional)=>"🦔">
               <!-- Add @SkipSelf ^^-->
      </#VIEW>
      </app-child>
  </#VIEW>
</app-root>
```

`@SkipSelf()`により、インジェクターは、要求が発生した
`<app-child>`ではなく`<app-root>`で`AnimalService`の検索を開始し、
`@Host()`は`<app-root>`の`<#VIEW>`で検索を停止します。
`AnimalService`は`viewProviders`
配列を介して提供されるため、インジェクターは
`<#VIEW>`内で🦔(ハリネズミ)を見つけます。


{@a component-injectors}

## `ElementInjector` ユースケースの例

さまざまなレベルで1つ以上のプロバイダーを設定する機能により、
興味深く有用な可能性が生まれます。
次の複数のシナリオの動作するアプリケーションについては、<live-example>ヒーローのユースケースの例</live-example>を参照してください。

### シナリオ: サービスの隔離

アーキテクチャ上の理由から、サービスへのアクセスをそのサービスが属するアプリケーションドメインに制限したい場合があります。
たとえば、ガイドサンプルには悪役のリストを表示する`VillainsListComponent`というものがあり、
それは悪役たちを`VillainsService`から取得します。

`VillainsService`をルートの`AppModule`
(あなたが`HeroesService`を登録した場所)に提供した場合、
これは_ヒーロー_のワークフローを含め、
`VillainsService`をアプリケーションのすべての場所で利用可能になります。後で`VillainsService`を修正した場合、
どこかのヒーローコンポーネントの中で何かしらを壊す可能性があります。
ルートの`AppModule`にサービスを提供することはその危険性を生み出します。

代わりに、`VillainsListComponent`の`providers`メタデータで`VillainsService`を次のように提供することができます:


<code-example path="hierarchical-dependency-injection/src/app/villains-list.component.ts" header="src/app/villains-list.component.ts (metadata)" region="metadata">

</code-example>

`VillainsListComponent`メタデータで`VillainsService`を提供し、それ以外の場所で提供しないことにより、
サービスは`VillainsListComponent`とそのサブコンポーネントツリーでのみ利用可能になります。

`VillainsService`は、`VillainsListComponent`
に関してシングルトンです。なぜなら、そこで宣言されているからです。 `VillainsListComponent`が破棄されない限り、それは
`VillainsService`の同じインスタンスになりますが、複数の`VillainsListComponent`インスタンスがある場合、
各`VillainsListComponent`インスタンスは
独自の`VillainsService`インスタンスを持ちます。



### シナリオ: 複数の編集セッション

多くのアプリケーションでは、ユーザーは複数開いているタスクを同時に処理できます。
たとえば、納税申告書アプリケーションでは、作成者は複数の納税申告書を作成し、
1日を通して納税申告書を切り替えることができます。

そのシナリオを実証するために、スーパーヒーローのリストを表示する外側の `HeroListComponent` を想像してみましょう。

ヒーローの納税申告書を開くために、作成者はヒーローの名前をクリックします。これにより、その申告書を編集するためのコンポーネントが開きます。
選択された各ヒーローの納税申告書は個々のコンポーネントで開き、かつ複数の申告書を同時に開くことができます。

各納税申告コンポーネントには次の特性があります。

* それぞれが納税申告書の編集セッションを持ちます。
* 他のコンポーネントの申告書に影響を与えずに納税申告書を変更することができます。
* その納税申告書への変更を保存したり、それらをキャンセルすることができます。

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection/hid-heroes-anim.gif" alt="Heroes in action">
</div>

`HeroTaxReturnComponent`には変更を管理し復元するロジックがあるとします。
それはシンプルなヒーローの納税申告書では簡単なタスクでしょう。
現実世界では、リッチな納税申告書のデータモデルを使用しているため、変更管理には注意が必要です。
この例のように、その管理をヘルパーサービスに委任することができます。

`HeroTaxReturnService`は次のようになります。これは単一の`HeroTaxReturn`をキャッシュし、その申告に対する変更を監視し、それを保存または復元することができます。
また、注入によって取得されるアプリケーション全体のシングルトンである`HeroService`に委任します。


<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.service.ts" header="src/app/hero-tax-return.service.ts">

</code-example>

これを使用している`HeroTaxReturnComponent`は次のようになります。


<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" header="src/app/hero-tax-return.component.ts">

</code-example>


_編集中の納税申告書_は、ゲッターとセッターで実装されている入力プロパティを介して到達します。
セッターはコンポーネント自身の`HeroTaxReturnService`インスタンスを収入申告書で初期化します。
ゲッターは常にそのヒーローの最新の状態を返します。
コンポーネントはまた、この納税申告書を保存および復元するようにサービスに要求します。

サービスがアプリケーション全体のシングルトンの場合、これは機能しません。
各コンポーネントは同一のサービスインスタンスを共有し、各コンポーネントは別のヒーローの納税申告書を上書きしてしまいます。

これを防ぐために、コンポーネントメタデータの`providers`プロパティを使って、サービスを提供するように`HeroTaxReturnComponent`のコンポーネントレベルのインジェクターを設定します。



<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" header="src/app/hero-tax-return.component.ts (providers)" region="providers">

</code-example>

`HeroTaxReturnComponent`は自身の`HeroTaxReturnService`のプロバイダーを持ちます。
すべてのコンポーネント_インスタンス_は自身のインジェクターをもつことを思い出してください。
コンポーネントレベルでサービスを提供することで、コンポーネントの_すべて_のインスタンスがそれぞれサービスのプライベートインスタンスを取得し、納税申告書が上書きされることがなくなります。


<div class="alert is-helpful">

シナリオのコードの残りの部分は、ドキュメントの他の部分で学ぶことができる他のAngularの機能とテクニックに依存しています。
<live-example></live-example>から確認し、ダウンロードすることができます。

</div>



### シナリオ: 特殊化したプロバイダー

別のレベルでサービスを再提供するもう1つの理由は、コンポーネントツリーのより深いところでそのサービスを_より特殊化した_実装で置き換えることです。

For example, consider a `Car` component that includes tire service information and depends on other services to provide more details about the car.

The root injector, marked as \(A\), uses *generic* providers for details about `CarService` and `EngineService`.

1. `Car` component \(A\).  Component \(A\) displays tire service data about a car and specifies generic services to provide more information about the car.

2. Child component \(B\). Component \(B\) defines its own, *specialized* providers for `CarService` and `EngineService` that have special capabilities suitable for what's going on in component \(B\).

3. Child component \(C\) as a childe of Component \(B\). Component \(C\) defines its own, even *more specialized* provider for `CarService`.


<div class="lightbox">

  <img src="generated/images/guide/dependency-injection/car-components.png" alt="car components">

</div>

舞台裏では、各コンポーネントは、そのコンポーネント自体に対して定義された0、1、または複数のプロバイダーを使用して各自のインジェクターを設定します。

When you resolve an instance of `Car` at the deepest component \(C\), its injector produces: 

* An instance of `Car` resolved by injector \(C\)
* An `Engine` resolved by injector \(B\)
* Its `Tires` resolved by the root injector \(A\).

<div class="lightbox">

  <img src="generated/images/guide/dependency-injection/injector-tree.png" alt="car injector tree">

</div>

## 依存性の注入の詳細について

Angularの依存性の注入の詳細については、DIプロバイダー[DI プロバイダー](guide/dependency-injection-providers)および[DI イン・アクション](guide/dependency-injection-in-action)ガイドを参照してください。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
