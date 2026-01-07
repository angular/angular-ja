# コンポーネントハーネスを作成する

## 始める前に {#before-you-start}

TIP: このガイドは、[コンポーネントハーネスの概要ガイド](guide/testing/component-harnesses-overview)をすでに読んでいることを前提としています。コンポーネントハーネスの使用が初めての場合は、まずそちらをお読みください。

### テストハーネスの作成はどのような場合に意味がありますか？ {#when-does-creating-a-test-harness-make-sense}

Angularチームは、多くの場所で使用され、ユーザーインタラクティビティを持つ共有コンポーネントに対して、コンポーネントテストハーネスを作成することを推奨しています。これはウィジェットライブラリや同様の再利用可能なコンポーネントに最も一般的に適用されます。ハーネスは、これらの共有コンポーネントの利用者に、コンポーネントと対話するための十分にサポートされたAPIを提供するため、これらのケースで価値があります。ハーネスを使用するテストは、DOM構造や特定のイベントリスナーなど、これらの共有コンポーネントの信頼性の低い実装詳細に依存することを避けることができます。

アプリケーション内のページなど、1か所にのみ出現するコンポーネントの場合、ハーネスはそれほど多くの利点を提供しません。このような状況では、テストとコンポーネントが同時に更新されるため、コンポーネントのテストは、そのコンポーネントの実装詳細に合理的に依存できます。ただし、ユニットテストとエンドツーエンドテストの両方でハーネスを使用する場合、ハーネスは依然としていくつかの価値を提供します。

### CDKのインストール {#cdk-installation}

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories)は、コンポーネントを構築するための動作プリミティブのセットです。コンポーネントハーネスを使用するには、まずnpmから`@angular/cdk`をインストールします。これは、Angular CLIを使用してターミナルから実行できます。

```shell
ng add @angular/cdk
```

## ComponentHarnessの拡張 {#extending-componentharness}

抽象クラス`ComponentHarness`は、すべてのコンポーネントハーネスの基底クラスです。カスタムコンポーネントハーネスを作成するには、`ComponentHarness`を拡張し、静的プロパティ`hostSelector`を実装します。

`hostSelector`プロパティは、このハーネスサブクラスに一致するDOM内の要素を識別します。ほとんどの場合、`hostSelector`は対応する`Component`または`Directive`のセレクターと同じである必要があります。例えば、シンプルなポップアップコンポーネントを考えてみましょう。

```ts
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{ triggerText() }}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content></ng-content></div>
    }
  `,
})
class MyPopup {
  triggerText = input('');

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((value) => !value);
  }
}
```

この場合、コンポーネントの最小限のハーネスは次のようになります。

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
```

`ComponentHarness`のサブクラスは`hostSelector`プロパティのみを必要としますが、ほとんどのハーネスは`HarnessPredicate`インスタンスを生成するために静的な`with`メソッドも実装する必要があります。[ハーネスのフィルタリングセクション](guide/testing/using-component-harnesses#filtering-harnesses)で、これについて詳しく説明しています。

## コンポーネントのDOM内の要素を見つける {#finding-elements-in-the-component's-dom}

`ComponentHarness`サブクラスの各インスタンスは、対応するコンポーネントの特定のインスタンスを表します。`ComponentHarness`基底クラスの`host()`メソッドを介して、コンポーネントのホスト要素にアクセスできます。

`ComponentHarness`は、コンポーネントのDOM内で要素を見つけるためのいくつかのメソッドも提供します。これらのメソッドは、`locatorFor()`、`locatorForOptional()`、および`locatorForAll()`です。これらのメソッドは要素を見つける関数を作成し、直接要素を見つけるわけではありません。このアプローチにより、古い要素への参照がキャッシュされるのを防ぎます。たとえば、`@if`ブロックが要素を非表示にしてから表示する場合、結果は新しいDOM要素になります。関数を使用することで、テストは常にDOMの現在の状態を参照するようになります。

さまざまな`locatorFor`メソッドの完全な詳細については、[ComponentHarness APIリファレンスページ](/api/cdk/testing/ComponentHarness)を参照してください。

たとえば、上記の`MyPopupHarness`の例では、トリガー要素とコンテンツ要素を取得するメソッドを次のように提供できます。

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  // Gets the trigger element
  getTriggerElement = this.locatorFor('button');

  // Gets the content element.
  getContentElement = this.locatorForOptional('.my-popup-content');
}
```

## TestElementインスタンスの操作 {#working-with-testelement-instances}

`TestElement`は、さまざまなテスト環境（Unit tests, WebDriverなど）で動作するように設計された抽象化です。ハーネスを使用する場合、すべてのDOM操作はこのインターフェースを介して実行する必要があります。`document.querySelector()`のようなDOM要素にアクセスする他の手段は、すべてのテスト環境で機能するわけではありません。

`TestElement`には、`blur()`、`click()`、`getAttribute()`など、基になるDOMと対話するための多数のメソッドがあります。メソッドの完全なリストについては、[TestElement API reference page](/api/cdk/testing/TestElement)を参照してください。

`TestElement`インスタンスをハーネスユーザーに公開しないでください。ただし、コンポーネントのコンシューマーが直接定義する要素（コンポーネントのホスト要素など）である場合は除きます。内部要素に対して`TestElement`インスタンスを公開すると、ユーザーがコンポーネントの内部DOM構造に依存することになります。

代わりに、エンドユーザーが実行する可能性のある特定のアクションや、観察する可能性のある特定の状態に対して、より焦点を絞ったメソッドを提供してください。たとえば、以前のセクションの`MyPopupHarness`は、`toggle`や`isOpen`のようなメソッドを提供できます。

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  protected getTriggerElement = this.locatorFor('button');
  protected getContentElement = this.locatorForOptional('.my-popup-content');

  /** Toggles the open state of the popup. */
  async toggle() {
    const trigger = await this.getTriggerElement();
    return trigger.click();
  }

  /** Checks if the popup us open. */
  async isOpen() {
    const content = await this.getContentElement();
    return !!content;
  }
}
```

## サブコンポーネントのハーネスのロード {#loading-harnesses-for-subcomponents}

より大きなコンポーネントは、しばしばサブコンポーネントで構成されます。この構造は、コンポーネントのハーネスにも反映できます。`ComponentHarness`の各`locatorFor`メソッドには、要素ではなくサブハーネスを特定するために使用できる代替シグネチャがあります。

異なるlocatorForメソッドの完全なリストについては、[ComponentHarness APIリファレンスページ](/api/cdk/testing/ComponentHarness)を参照してください。

例えば、上記ポップアップを使用して構築されたメニューを考えてみましょう。

```ts
@Directive({
  selector: 'my-menu-item',
})
class MyMenuItem {}

@Component({
  selector: 'my-menu',
  template: `
    <my-popup>
      <ng-content />
    </my-popup>
  `,
})
class MyMenu {
  triggerText = input('');

  @ContentChildren(MyMenuItem) items: QueryList<MyMenuItem>;
}
```

これにより、`MyMenu`のハーネスは、`MyPopup`および`MyMenuItem`の他のハーネスを利用できます。

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Gets the currently shown menu items (empty list if menu is closed). */
  getItems = this.locatorForAll(MyMenuItemHarness);

  /** Toggles open state of the menu. */
  async toggle() {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.toggle();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';
}
```

## HarnessPredicateによるハーネスインスタンスのフィルタリング {#filtering-harness-instances-with-harnesspredicate}

ページに特定のコンポーネントの複数のインスタンスが含まれている場合、特定のコンポーネントインスタンスを取得するために、コンポーネントの何らかのプロパティに基づいてフィルタリングしたい場合があります。例えば、特定のテキストを持つボタンや、特定のIDを持つメニューが必要になるかもしれません。`HarnessPredicate`クラスは、`ComponentHarness`サブクラスに対してこのような条件を捕捉できます。テスト作成者が`HarnessPredicate`インスタンスを手動で構築できますが、`ComponentHarness`サブクラスが一般的なフィルター用の述語を構築するヘルパーメソッドを提供すると、より簡単になります。

各`ComponentHarness`サブクラスに、そのクラスの`HarnessPredicate`を返す静的`with()`メソッドを作成する必要があります。これにより、テスト作成者は`loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`のような、理解しやすいコードを書くことができます。標準セレクターと祖先オプションに加えて、`with`メソッドは、特定のサブクラスに意味のある他のオプションを追加する必要があります。

追加オプションを追加する必要があるハーネスは、`BaseHarnessFilters`インターフェースを拡張し、必要に応じて追加のオプションプロパティを追加する必要があります。`HarnessPredicate`は、オプションを追加するためのいくつかの便利なメソッドを提供します: `stringMatches()`、`addOption()`、および`add()`。詳細については、[HarnessPredicate APIページ](/api/cdk/testing/HarnessPredicate)を参照してください。

例えば、メニューを操作する場合、トリガーテキストに基づいてフィルタリングしたり、メニュー項目をそのテキストに基づいてフィルタリングしたりすると便利です。

```ts
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the trigger text for the menu. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the text of the menu item. */
  text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Creates a `HarnessPredicate` used to locate a particular `MyMenuHarness`. */
  static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
    return new HarnessPredicate(MyMenuHarness, options).addOption(
      'trigger text',
      options.triggerText,
      (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text),
    );
  }

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Gets the text of the menu trigger. */
  async getTriggerText(): Promise<string> {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.getTriggerText();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';

  /** Creates a `HarnessPredicate` used to locate a particular `MyMenuItemHarness`. */
  static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
    return new HarnessPredicate(MyMenuItemHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  /** Gets the text of the menu item. */
  async getText(): Promise<string> {
    const host = await this.host();
    return host.text();
  }
}
```

`HarnessLoader`、`LocatorFactory`、または`ComponentHarness`のいずれかのAPIに、`ComponentHarness`クラスの代わりに`HarnessPredicate`を渡すことができます。これにより、テスト作成者はハーネスインスタンスを作成する際に、特定のコンポーネントインスタンスを簡単にターゲットにできます。また、ハーネス作成者は同じ`HarnessPredicate`を活用して、ハーネスクラスでより強力なAPIを有効にできます。例えば、上記の`MyMenuHarness`の`getItems`メソッドを考えてみましょう。フィルタリングAPIを追加することで、ハーネスのユーザーは特定のメニュー項目を検索できるようになります。

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Gets a list of items in the menu, optionally filtered based on the given criteria. */
  async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
    const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
    return getFilteredItems();
  }
  ...
}
```

## コンテンツプロジェクションを使用する要素のための`HarnessLoader`の作成 {#creating-harnessloader-for-elements-that-use-content-projection}

一部のコンポーネントは、追加のコンテンツをコンポーネントのテンプレートに投影します。詳細については、[コンテンツプロジェクションガイド](guide/components/content-projection)を参照してください。

コンテンツプロジェクションを使用するコンポーネントのハーネスを作成する際には、`<ng-content>`を含む要素にスコープされた`HarnessLoader`インスタンスを追加します。これにより、ハーネスのユーザーは、コンテンツとして渡されたコンポーネントのために追加のハーネスをロードできます。`ComponentHarness`には、このような場合に`HarnessLoader`インスタンスを作成するために使用できるいくつかのメソッドがあります:`harnessLoaderFor()`、`harnessLoaderForOptional()`、`harnessLoaderForAll()`。詳細については、[HarnessLoaderインターフェースAPIリファレンスページ](/api/cdk/testing/HarnessLoader)を参照してください。

例えば、上記の`MyPopupHarness`の例は、コンポーネントの`<ng-content>`内でハーネスをロードするサポートを追加するために、`ContentContainerComponentHarness`を拡張できます。

```ts
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
```

## コンポーネントのホスト要素外の要素へのアクセス {#accessing-elements-outside-of-the-component's-host-element}

コンポーネントハーネスが、対応するコンポーネントのホスト要素外の要素にアクセスする必要がある場合があります。たとえば、フローティング要素やポップアップを表示するコードは、Angular CDKの`Overlay`サービスのように、DOM要素をドキュメントボディに直接アタッチすることがよくあります。

この場合、`ComponentHarness`は、ドキュメントのルート要素の`LocatorFactory`を取得するために使用できるメソッドを提供します。`LocatorFactory`は、`ComponentHarness`基底クラスとほとんど同じAPIをサポートしており、ドキュメントのルート要素を基準にクエリするために使用できます。

上記の`MyPopup`コンポーネントが、自身のテンプレート内の要素ではなく、ポップアップコンテンツにCDKオーバーレイを使用した場合を考えてみましょう。この場合、`MyPopupHarness`は、ドキュメントルートにルートを持つロケーターファクトリを取得する`documentRootLocatorFactory()`メソッドを介してコンテンツ要素にアクセスする必要があります。

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  /** Gets a `HarnessLoader` whose root element is the popup's content element. */
  async getHarnessLoaderForContent(): Promise<HarnessLoader> {
    const rootLocator = this.documentRootLocatorFactory();
    return rootLocator.harnessLoaderFor('my-popup-content');
  }
}
```

## 非同期タスクの待機 {#waiting-for-asynchronous-tasks}

`TestElement`のメソッドは、Angularの変更検知を自動的にトリガーし、`NgZone`内のタスクを待機します。ほとんどの場合、ハーネスの作成者が非同期タスクを待機するために特別な努力は必要ありません。しかし、これが十分でないエッジケースがいくつかあります。

特定の状況下では、Angularアニメーションは、アニメーションイベントが完全にフラッシュされる前に、変更検知の2回目のサイクルとそれに続く`NgZone`の安定化を必要とする場合があります。これが必要な場合、`ComponentHarness`は2回目の処理を行うために呼び出すことができる`forceStabilize()`メソッドを提供します。

`NgZone.runOutsideAngular()`を使用して、NgZone外でタスクをスケジュールできます。自動的に行われないため、`NgZone`外のタスクを明示的に待機する必要がある場合は、対応するハーネスで`waitForTasksOutsideAngular()`メソッドを呼び出してください。
