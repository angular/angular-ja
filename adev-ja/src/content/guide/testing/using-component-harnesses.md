# テストでコンポーネントハーネスを使う

## 始める前に

TIP: このガイドは、すでに[コンポーネントハーネスの概要ガイド](guide/testing/component-harnesses-overview)を読んでいることを前提としています。コンポーネントハーネスの利用が初めての場合は、まずそちらを読んでください。

### CDKのインストール {#cdk-installation}

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories)は、コンポーネントを構築するための動作プリミティブのセットです。コンポーネントハーネスを使用するには、まずnpmから`@angular/cdk`をインストールします。これは、Angular CLIを使用してターミナルから実行できます。

```shell
ng add @angular/cdk
```

## テストハーネス環境とローダー

コンポーネントテストハーネスはさまざまなテスト環境で使用できます。AngularCDKは2つの組み込み環境をサポートしています。

- Angularの`TestBed`を使用した単体テスト
- [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)を使用したエンドツーエンドテスト

各環境は<strong>ハーネスローダー</strong>を提供します。ローダーはテスト全体で使用するハーネスインスタンスを作成します。サポートされているテスト環境に関するより具体的なガイダンスについては、以下を参照してください。

追加のテスト環境にはカスタムバインディングが必要です。詳細については、[追加のテスト環境へのハーネスサポートの追加ガイド](guide/testing/component-harnesses-testing-environments)を参照してください。

### 単体テストでの`TestbedHarnessEnvironment`からのローダーの使用 {#using-the-loader-from-testbedharnessenvironment-for-unit-tests}

単体テストでは、[TestbedHarnessEnvironment](/api/cdk/testing/TestbedHarnessEnvironment)からハーネスローダーを作成できます。この環境は、Angularの`TestBed`によって作成された[コンポーネントフィクスチャ](api/core/testing/ComponentFixture)を使用します。

フィクスチャのルート要素にルートを持つハーネスローダーを作成するには、`loader()`メソッドを使用します。

```ts
const fixture = TestBed.createComponent(MyComponent);

// Create a harness loader from the fixture
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Use the loader to get harness instances
const myComponentHarness = await loader.getHarness(MyComponent);
```

フィクスチャの外部にある要素のハーネス用のハーネスローダーを作成するには、`documentRootLoader()`メソッドを使用します。たとえば、フローティング要素やポップアップを表示するコードは、AngularCDKの`Overlay`サービスのように、DOM要素をドキュメントボディに直接アタッチすることがよくあります。

また、そのフィクスチャのルート要素にあるハーネス用に、`harnessForFixture()`を使用してハーネスローダーを直接作成できます。

### エンドツーエンドテストでの`SeleniumWebDriverHarnessEnvironment`からのローダーの使用 {#using-the-loader-from-seleniumwebdriverharnessenvironment-for-end-to-end-tests}

WebDriverベースのエンドツーエンドテストでは、`SeleniumWebDriverHarnessEnvironment`を使用してハーネスローダーを作成できます。

現在のHTMLドキュメントのハーネスローダーインスタンスを、ドキュメントのルート要素にルートを持つ形で取得するには、`loader()`メソッドを使用します。この環境はWebDriverクライアントを使用します。

```ts
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
```

## ハーネスローダーの使用 {#using-a-harness-loader}

ハーネスローダーインスタンスは特定のDOM要素に対応し、その特定の要素配下の要素に対してコンポーネントハーネスインスタンスを作成するために使用されます。

要素の最初のインスタンスの`ComponentHarness`を取得するには、`getHarness()`メソッドを使用します。すべての`ComponentHarness`インスタンスを取得するには、`getAllHarnesses()`メソッドを使用します。

```ts
// Get harness for first instance of the element
const myComponentHarness = await loader.getHarness(MyComponent);

// Get harnesses for all instances of the element
const myComponentHarnesses = await loader.getHarnesses(MyComponent);
```

`getHarness`と`getAllHarnesses`に加えて、`HarnessLoader`にはハーネスを検索するためのその他の有用なメソッドがいくつかあります。

- `getHarnessAtIndex(...)`: 特定のインデックスで指定された条件に一致するコンポーネントのハーネスを取得します。
- `countHarnesses(...)`: 指定された条件に一致するコンポーネントインスタンスの数をカウントします。
- `hasHarness(...)`: 指定された条件に一致するコンポーネントインスタンスが少なくとも1つ存在するかどうかを確認します。

例として、クリック時にダイアログを開く再利用可能なダイアログボタンコンポーネントを考えます。これには、それぞれに対応するハーネスを持つ以下のコンポーネントが含まれています。

- `MyDialogButton` (`MyButton`と`MyDialog`を便利なAPIで構成)
- `MyButton` (標準のボタンコンポーネント)
- `MyDialog` (`MyDialogButton`によってクリック時に`document.body`に追加されるダイアログ)

以下のテストは、これらの各コンポーネントのハーネスをロードします。

```ts
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
fixture = TestBed.createComponent(MyDialogButton);
loader = TestbedHarnessEnvironment.loader(fixture);
rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
// Load a harness for the bootstrapped component with `harnessForFixture`
dialogButtonHarness =
await TestbedHarnessEnvironment.harnessForFixture(fixture, MyDialogButtonHarness);

// The button element is inside the fixture's root element, so we use `loader`.
const buttonHarness = await loader.getHarness(MyButtonHarness);

// Click the button to open the dialog
await buttonHarness.click();

// The dialog is appended to `document.body`, outside of the fixture's root element,
// so we use `rootLoader` in this case.
const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

// ... make some assertions
});
```

### 異なる環境でのハーネスの動作 {#harness-behavior-in-different-environments}

ハーネスは、すべての環境でまったく同じように動作するとは限りません。実際のユーザーインタラクションと単体テストで生成されるシミュレートされたイベントの間には、避けられない違いがあります。Angular CDKは、可能な限り動作を正規化するために最善を尽くします。

### 子要素とのインタラクション {#interacting-with-child-elements}

このハーネスローダーのルート要素より下位の要素とインタラクトするには、子要素の`HarnessLoader`インスタンスを使用します。子要素の最初のインスタンスには`getChildLoader()`メソッドを、すべての子要素のインスタンスには`getAllChildLoaders()`メソッドを使用します。

```ts
const myComponentHarness = await loader.getHarness(MyComponent);

// Get loader for first instance of child element with '.child' selector
const childLoader = await myComponentHarness.getLoader('.child');

// Get loaders for all instances of child elements with '.child' selector
const allChildLoaders = await myComponentHarness.getAllChildLoaders('.child');
```

### ハーネスのフィルタリング {#filtering-harnesses}

ページに特定のコンポーネントの複数のインスタンスが含まれている場合、特定のコンポーネントインスタンスを取得するために、コンポーネントの何らかのプロパティに基づいてフィルタリングしたい場合があります。これを行うには、<strong>ハーネス述語</strong>を使用できます。これは、`ComponentHarness`クラスを、コンポーネントインスタンスをフィルタリングするために使用できる述語関数と関連付けるために使用されるクラスです。

`HarnessLoader`にハーネスを要求するとき、実際にはHarnessQueryを提供しています。クエリは次の2つのいずれかです。

- ハーネスコンストラクター。これは単にそのハーネスを取得します
- `HarnessPredicate`。これは1つ以上の条件に基づいてフィルタリングされたハーネスを取得します

`HarnessPredicate`は、`ComponentHarness`を拡張するあらゆるものに機能するいくつかの基本フィルター（selector、ancestor）をサポートしています。

```ts
// Example of loading a MyButtonComponentHarness with a harness predicate
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {selector: '[disabled]'});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
```

ただし、ハーネスがコンポーネント固有のフィルタリングオプションを受け入れ、`HarnessPredicate`を返す静的`with()`メソッドを実装することは一般的です。

```ts
// Example of loading a MyButtonComponentHarness with a specific selector
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}))
```

追加のフィルタリングオプションは各ハーネスの実装に固有であるため、詳細については特定のハーネスのドキュメントを参照してください。

## テストハーネスAPIの使用 {#using-test-harness-apis}

各ハーネスは対応するコンポーネントに固有のAPIを定義していますが、それらはすべて共通の基底クラスである[ComponentHarness](/api/cdk/testing/ComponentHarness)を共有しています。この基底クラスは、ハーネスクラスをDOM内のコンポーネントインスタンスに一致させる静的プロパティ`hostSelector`を定義します。

それ以外に、特定のハーネスのAPIは対応するコンポーネントに固有です。特定のハーネスの使用方法については、コンポーネントのドキュメントを参照してください。

例として、[Angular Materialスライダーコンポーネントハーネス](https://material.angular.dev/components/slider/api#MatSliderHarness)を使用するコンポーネントのテストを以下に示します。

```ts
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
```

## Angularの変更検知との連携 {#interop-with-angular-change-detection}

デフォルトでは、テストハーネスはAngularの[変更検知](https://angular.dev/best-practices/runtime-performance)をDOM要素の状態を読み取る前と、DOM要素と対話した後に実行します。

テストで変更検知をより細かく制御する必要がある場合があります。例えば、非同期操作が保留中の間にコンポーネントの状態を確認する場合などです。このような場合は、`manualChangeDetection`関数を使用して、コードブロックの変更検知の自動処理を無効にします。

```ts
it('checks state while async action is in progress', async () => {
  const buttonHarness = loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Check expectations while async click operation is in progress.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Check expectations after async click operation complete.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
```

ほとんどすべてのハーネスメソッドは非同期であり、以下をサポートするために`Promise`を返します。

- 単体テストのサポート
- エンドツーエンドテストのサポート
- 非同期動作の変更からテストを保護

Angularチームは、テストの可読性を向上させるために[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)の使用を推奨しています。`await`を呼び出すと、関連する`Promise`が解決されるまでテストの実行がブロックされます。

場合によっては、複数のアクションを同時に実行し、それぞれのアクションを順次実行するのではなく、すべてが完了するまで待機したい場合があります。例えば、単一コンポーネントの複数のプロパティを読み取る場合などです。このような状況では、`parallel`関数を使用して操作を並列化します。`parallel`関数は`Promise.all`と同様に機能し、変更検知チェックも最適化します。

```ts
it('reads properties in parallel', async () => {
  const checkboxHarness = loader.getHarness(MyCheckboxHarness);
  // Read the checked and intermediate properties simultaneously.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate()
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
```
