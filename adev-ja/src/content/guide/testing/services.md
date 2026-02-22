# サービスのテスト

サービスが意図通りに動作していることを確認するには、サービス専用のテストを作成できます。

サービスは、多くの場合、ユニットテストを実行するのに最もスムーズなファイルです。
以下は、Angularテストユーティリティの助けを借りずに記述された `ValueService` の同期および非同期のユニットテストです。

```ts
describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    // Only works if the service doesn't rely on Angular inject()
    service = new ValueService();
  });

  it('getValue should return real value', () => {
    expect(service.getValue()).toBe('real value');
  });

  it('getObservableValue should return value from observable', async () => {
    const value = await new Promise<string>((resolve) => {
      service.getObservableValue().subscribe(resolve);
    });

    expect(value).toBe('observable value');
  });

  it('getPromiseValue should return value from a promise', async () => {
    const value = await service.getPromiseValue();
    expect(value).toBe('promise value');
  });
});
```

## `TestBed` を使用したサービスのテスト {#testing-services-with-the-testbed}

アプリケーションは、Angularの [依存関係注入 (DI)](guide/di) に依存してサービスを作成します。
サービスが依存サービスを持っている場合、DIはその依存サービスを見つけたり、作成します。
さらに、その依存サービスに独自の依存関係がある場合、DIはそれらも探し出して作成します。

サービスの _消費者_ として、あなたはこれらについて心配する必要はありません。
コンストラクター引数の順序や、それらがどのように作成されるかについて心配する必要はありません。

サービスの _テスター_ として、少なくともサービス依存関係の最初のレベルについて考える必要はありますが、`TestBed` テストユーティリティを使用してサービスを提供して作成し、コンストラクター引数の順序を処理するときは、Angular DIにサービスの作成を任せることができます。

## Angular `TestBed` {#angular-testbed}

`TestBed` は、Angularのテストユーティリティの中で最も重要なものです。
`TestBed` は、Angularの [@NgModule](guide/ngmodules/overview) をエミュレートする、動的に構築されたAngularの _テスト_ モジュールを作成します。

`TestBed.configureTestingModule()` メソッドは、[@NgModule](guide/ngmodules/overview) のほとんどのプロパティを持つことができるメタデータオブジェクトを受け取ります。

サービスをテストするには、テストまたはモックするサービスの配列を `providers` メタデータプロパティに設定します。

```ts
let service: ValueService;
beforeEach(() => {
  TestBed.configureTestingModule({providers: [ValueService]});
});
```

次に、サービスクラスを引数として `TestBed.inject()` を呼び出して、テスト内でサービスを注入します。

```ts
it('should use ValueService', () => {
  service = TestBed.inject(ValueService);
  expect(service.getValue()).toBe('real value');
});
```

または、セットアップの一部としてサービスを注入したい場合は、`beforeEach()` 内で行います。

```ts
beforeEach(() => {
  TestBed.configureTestingModule({providers: [ValueService]});
  service = TestBed.inject(ValueService);
});
```

依存関係のあるサービスをテストする場合は、`providers` 配列にモックを提供します。

次の例では、モックはスパイオブジェクトです。

```ts
let masterService: MainService;
let valueServiceSpy: Mocked<ValueService>;

beforeEach(() => {
  const spy: Mocked<ValueService> = {getValue: vi.fn()};

  TestBed.configureTestingModule({
    providers: [MainService, {provide: ValueService, useValue: spy}],
  });

  masterService = TestBed.inject(MainService);
  valueServiceSpy = TestBed.inject(ValueService) as Mocked<ValueService>;
});
```

テストでは、以前と同じように、そのスパイを使用します。

```ts
it('getValue should return stubbed value from a spy', () => {
  const stubValue = 'stub value';

  valueServiceSpy.getValue.mockReturnValue(stubValue);

  expect(masterService.getValue(), 'service returned stub value').toBe(stubValue);
  expect(valueServiceSpy.getValue, 'spy method was called once').toHaveBeenCalledTimes(1);
  expect(valueServiceSpy.getValue.mock.results.at(-1)?.value).toBe(stubValue);
});
```

## HTTP サービスのテスト {#testing-http-services}

`HttpClient`に依存するサービスのテストについては、[専用ガイド](/guide/http/testing)を参照してください。
