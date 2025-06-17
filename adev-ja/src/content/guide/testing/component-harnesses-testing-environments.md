# テスト環境にハーネスサポートを追加する

## 始める前に {#before-you-start}

TIP: このガイドは、すでに[コンポーネントハーネスの概要ガイド](guide/testing/component-harnesses-overview)を読んでいることを前提としています。コンポーネントハーネスの使用が初めての場合は、まずそちらをお読みください。

### テスト環境のサポートを追加するのはどのような場合ですか？ {#when-does-adding-support-for-a-test-environment-make-sense}

以下の環境でコンポーネントハーネスを使用するには、Angular CDKの2つの組み込み環境を使用できます。

- 単体テスト
- WebDriverエンドツーエンドテスト

サポートされているテスト環境を使用するには、[コンポーネントのハーネスを作成するガイド](guide/testing/creating-component-harnesses)をお読みください。

それ以外の場合、他の環境のサポートを追加するには、DOM要素との対話方法と、その環境でDOMの対話がどのように機能するかを定義する必要があります。詳細については、引き続きお読みください。

### CDKのインストール {#cdk-installation}

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories)は、コンポーネントを構築するための動作プリミティブのセットです。コンポーネントハーネスを使用するには、まずnpmから`@angular/cdk`をインストールします。これは、Angular CLIを使用してターミナルから実行できます。

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

TestElement実装の作成 {#creating-a-testelement-implementation}

すべてのテスト環境は`TestElement`実装を定義する必要があります。`TestElement`インターフェースは、DOM要素の環境に依存しない表現の役割を果たします。これにより、ハーネスは基盤となる環境に関係なくDOM要素と対話できます。一部の環境ではDOM要素との同期的な対話がサポートされていないため（例: WebDriver）、すべての`TestElement`メソッドは非同期であり、操作の結果を`Promise`で返します。

`TestElement`は、`blur()`、`click()`、`getAttribute()`など、基盤であるDOMと対話するための多数のメソッドを提供します。メソッドの完全なリストについては、[TestElement APIリファレンスページ](/api/cdk/testing/TestElement)を参照してください。

`TestElement`インターフェースは、主に`HTMLElement`で利用可能なメソッドに似たメソッドで構成されています。ほとんどのテスト環境には同様のメソッドが存在するため、それらのメソッドの実装は非常に簡単です。ただし、`sendKeys`メソッドを実装する際に注意すべき重要な違いは、`TestKey` enumのキーコードがテスト環境で使用されるキーコードと異なる可能性があることです。環境の作成者は、`TestKey`コードから特定のテスト環境で使用されるコードへのマッピングを維持する必要があります。

Angular CDKの[UnitTestElement](/api/cdk/testing/testbed/UnitTestElement)と[SeleniumWebDriverElement](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverElement)の実装は、このインターフェースの実装の良い例として機能します。

## `HarnessEnvironment`の実装を作成する {#creating-a-harnessenvironment-implementation}

テスト作成者は、テストで使用するコンポーネントハーネスインスタンスを作成するために`HarnessEnvironment`を使用します。`HarnessEnvironment`は、新しい環境のための具象サブクラスを作成するために拡張されなければならない抽象クラスです。新しいテスト環境をサポートする場合、すべての抽象メンバーに具象実装を追加する`HarnessEnvironment`サブクラスを作成します。

`HarnessEnvironment`にはジェネリック型パラメータ`HarnessEnvironment<E>`があります。このパラメータ`E`は、環境の生要素型を表します。例えば、このパラメータは単体テスト環境では`Element`です。

以下は、実装する必要がある抽象メソッドです。

| Method                                                       | Description                                                                                                                                                          |
| :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstract getDocumentRoot(): E`                              | 環境のルート要素（例: `document.body`）を取得します。                                                                                                    |
| `abstract createTestElement(element: E): TestElement`        | 指定された生要素の`TestElement`を作成します。                                                                                                                   |
| `abstract createEnvironment(element: E): HarnessEnvironment` | 指定された生要素をルートとする`HarnessEnvironment`を作成します。                                                                                                      |
| `abstract getAllRawElements(selector: string): Promise<E[]>` | 環境のルート要素の下にある、指定されたセレクターに一致するすべての生要素を取得します。                                                                  |
| `abstract forceStabilize(): Promise<void>`                   | `NgZone`が安定したときに解決する`Promise`を取得します。さらに、該当する場合、`NgZone`に安定化を指示します（例: `fakeAsync`テストで`flush()`を呼び出す）。 |
| `abstract waitForTasksOutsideAngular(): Promise<void>`       | `NgZone`の親ゾーンが安定したときに解決する`Promise`を取得します。                                                                                           |

欠落しているメソッドを実装することに加えて、このクラスはテスト作成者が`ComponentHarness`インスタンスを取得する方法を提供する必要があります。保護されたコンストラクターを定義し、`HarnessLoader`インスタンスを返す`loader`という静的メソッドを提供する必要があります。これにより、テスト作成者は`SomeHarnessEnvironment.loader().getHarness(...)`のようなコードを記述できます。特定の環境のニーズに応じて、クラスはいくつかの異なる静的メソッドを提供したり、引数を渡すことを要求したりする場合があります。（例: `TestbedHarnessEnvironment`の`loader`メソッドは`ComponentFixture`を取り、クラスは`documentRootLoader`と`harnessForFixture`という追加の静的メソッドを提供します）。

Angular CDKの[`TestbedHarnessEnvironment`](/api/cdk/testing/testbed/TestbedHarnessEnvironment)と[SeleniumWebDriverHarnessEnvironment](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverHarnessEnvironment)の実装は、このインターフェースの実装の良い例として役立ちます。

## 自動での変更検知のハンドリング {#handling-auto-change-detection}

`manualChangeDetection`と並列APIをサポートするために、お使いの環境は自動での変更検知ステータス用のハンドラーをインストールする必要があります。

お使いの環境が自動での変更検知ステータスのハンドリングを開始したい場合、`handleAutoChangeDetectionStatus(handler)`を呼び出すことができます。ハンドラー関数は、`isDisabled`と`onDetectChangesNow()`の2つのプロパティを持つ`AutoChangeDetectionStatus`を受け取ります。詳細については、[AutoChangeDetectionStatus APIリファレンスページ](/api/cdk/testing/AutoChangeDetectionStatus)を参照してください。
お使いの環境が自動での変更検知ステータスのハンドリングを停止したい場合、`stopHandlingAutoChangeDetectionStatus()`を呼び出すことができます。
