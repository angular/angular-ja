# コンポーネントテストのシナリオ

このガイドでは、一般的なコンポーネントテストのユースケースについて解説します。

## コンポーネントのバインディング {#component-binding}

サンプルアプリケーションでは、`Banner`コンポーネントはHTMLテンプレート内に静的なタイトルテキストを表示します。

いくつかの変更を加えた後、`Banner`コンポーネントは次のようにコンポーネントの`title`プロパティにバインドすることで、動的なタイトルを表示します。

```angular-ts {header="banner.ts"}
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-banner',
  template: '<h1>{{ title() }}</h1>',
  styles: ['h1 { color: green; font-size: 350%}'],
})
export class Banner {
  title = signal('Test Tour of Heroes');
}
```

これは最小限のものですが、コンポーネントが実際に想定した場所に正しいコンテンツを表示していることを確認するためのテストを追加することにします。

### `<h1>`のクエリ {#query-for-the-h1}

_title_プロパティの補間バインディングをラップする`<h1>`要素の値を検査する一連のテストを作成します。

標準的なHTMLの`querySelector`でその要素を見つけ、`h1`変数に割り当てるように`beforeEach`を更新します。

```ts {header: "banner.component.spec.ts"}
let component: Banner;
let fixture: ComponentFixture<Banner>;
let h1: HTMLElement;

beforeEach(() => {
  fixture = TestBed.createComponent(Banner);
  component = fixture.componentInstance; // Banner test instance
  h1 = fixture.nativeElement.querySelector('h1');
});
```

### `createComponent()`はデータをバインドしない {#createcomponent-does-not-bind-data}

最初のテストでは、画面にデフォルトの`title`が表示されることを確認したいと思います。
直感的には、次のように`<h1>`をすぐに検査するテストを書きたくなるでしょう。

```ts
it('should display original title', () => {
  expect(h1.textContent).toContain(component.title());
});
```

_そのテストは失敗し_、次のメッセージが表示されます。

```shell {hideCopy}
expected '' to contain 'Test Tour of Heroes'.
```

バインディングは、Angularが**変更検知**を実行したときに発生します。

本番環境では、例えばAngularがコンポーネントを作成したときや、ユーザーがキー入力したときなどに、変更検知が自動的に開始されます。

`TestBed.createComponent`は同期的に変更検知をトリガーしません。この事実は修正されたテストで確認されています。

```ts
it('no title in the DOM after createComponent()', () => {
  expect(h1.textContent).toEqual('');
});
```

### `whenStable()` {#whenstable}

`await fixture.whenStable()`を使用すると、変更検知が実行されるのを待つように`TestBed`に指示できます。
そうして初めて、`<h1>`は期待されるタイトルを持つようになります。

```ts
it('should display original title', async () => {
  await fixture.whenStable();
  expect(h1.textContent).toContain(component.title());
});
```

遅延された変更検知は意図的なものであり、有用です。
これにより、テスターは_Angularがデータバインディングを開始し、[ライフサイクルフック](guide/components/lifecycle)を呼び出す前に_、コンポーネントの状態を検査および変更する機会を得ることができます。

ここに、`fixture.whenStable()`を呼び出す_前に_コンポーネントの`title`プロパティを変更する別のテストがあります。

```ts
it('should display a different test title', async () => {
  component.title.set('Test Title');
  await fixture.whenStable();
  expect(h1.textContent).toContain('Test Title');
});
```

### シグナルを入力にバインドする {#binding-signals-to-inputs}

入力への変更を反映し、出力をリッスンするために、シグナルを入力に、関数を出力に動的にバインドできます。

```ts
import {inputBinding, outputBinding} from '@angular/core';

const fixture = TestBed.createComponent(ValueDisplay, {
  bindings: [
    inputBinding('value', value),
    outputBinding('valueChange', () =>  (/* ... */) ),
  ],
});
```

### `dispatchEvent()`で入力値を変更する {#change-an-input-value-with-dispatchevent}

ユーザー入力をシミュレートするには、input要素を見つけてその`value`プロパティを設定します。

しかし、不可欠な中間ステップがあります。

Angularは、あなたがinput要素の`value`プロパティを設定したことを知りません。
`dispatchEvent()`を呼び出して要素の`input`イベントを発生させるまで、Angularはそのプロパティを読み取りません。

`TitleCasePipe`を使用するコンポーネントの次の例は、適切な手順を示しています。

```ts
it('should convert hero name to Title Case', async () => {
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## 依存関係を持つコンポーネント {#component-with-a-dependency}

コンポーネントはしばしばサービスの依存関係を持ちます。

`Welcome`コンポーネントは、ログインしているユーザーにウェルカムメッセージを表示します。
注入された`UserAuthentication`のプロパティに基づいて、ユーザーが誰であるかを認識します。

```angular-ts
import {Component, inject, OnInit, signal} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = signal(
    this.userAuth.isLoggedIn() ? `Welcome, ${this.userAuth.user().name}` : 'Please log in.',
  );
}
```

`Welcome`コンポーネントにはサービスと対話する決定ロジックがあり、このロジックがこのコンポーネントをテストする価値のあるものにしています。

### サービスのテストダブルを提供する {#provide-service-test-doubles}

_テスト対象コンポーネント_（component-under-test）に実際のサービスを提供する必要はありません。

実際の`UserAuthentication`を注入するのは難しい場合があります。
実際のサービスは、ユーザーにログイン資格情報を求め、認証サーバーへの接続を試みるかもしれません。
これらの動作を傍受するのは困難な場合があります。テストダブルを使用するとテストの動作が本番環境と異なるものになるため、使用は控えめにすることに注意してください。

### 注入されたサービスを取得する {#get-injected-services}

テストでは、`Welcome`コンポーネントに注入された`UserAuthentication`にアクセスする必要があります。

Angularには階層的な注入システムがあります。
`TestBed`によって作成されたルートインジェクターからコンポーネントツリーの下層に至るまで、複数のレベルにインジェクターが存在する可能性があります。

注入されたサービスを取得する最も安全な方法、つまり**_常に機能する_**方法は、
**_テスト対象コンポーネント_のインジェクターから取得すること**です。
コンポーネントインジェクターは、フィクスチャの`DebugElement`のプロパティです。

```ts
// UserAuthentication actually injected into the component
userAuth = fixture.debugElement.injector.get(UserAuthentication);
```

HELPFUL: これは_通常_必要ありません。サービスは多くの場合、ルートまたはTestBedのオーバーライドで提供され、`TestBed.inject()`を使用してより簡単に取得できます（下記参照）。

### `TestBed.inject()` {#testbedinject}

これは、フィクスチャの`DebugElement`を使用してサービスを取得するよりも覚えやすく、冗長ではありません。

このテストスイートでは、`UserAuthentication`の_唯一の_プロバイダーはルートテストモジュールであるため、次のように`TestBed.inject()`を呼び出しても安全です。

```ts
userAuth = TestBed.inject(UserAuthentication);
```

HELPFUL: `TestBed.inject()`が機能しないユースケースについては、コンポーネントのインジェクターからサービスを取得する必要がある場合とその理由を説明している[_コンポーネントプロバイダーのオーバーライド_](#override-component-providers)セクションを参照してください。

### 最終的なセットアップとテスト {#final-setup-and-tests}

`TestBed.inject()`を使用した完全な`beforeEach()`は次のとおりです。

```ts
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // the TestBed injected service
let el: HTMLElement; // the DOM element with the welcome message

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // UserAuthentication from the root injector
  userAuth = TestBed.inject(UserAuthentication);

  //  get the "welcome" element by CSS selector (e.g., by class name)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

そして、いくつかのテストを以下に示します。

```ts
it('should welcome the user', async () => {
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, '"Welcome ..."').toContain('Welcome');
  expect(content, 'expected name').toContain('Test User');
});

it('should welcome "Bubba"', async () => {
  userAuth.user.set({name: 'Bubba'}); // welcome message hasn't been shown yet
  await fixture.whenStable();

  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', async () => {
  userAuth.isLoggedIn.set(false); // welcome message hasn't been shown yet
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, 'not welcomed').not.toContain('Welcome');
  expect(content, '"log in"').toMatch(/log in/i);
});
```

1つ目はサニティテスト（健全性確認）です。これは`UserAuthentication`が呼び出され、機能していることを確認します。

HELPFUL: `expect`の2番目の引数（たとえば`'expected name'`）は、オプションの失敗ラベルです。
期待値の検証（expectation）が失敗した場合、Vitestはこのラベルを検証失敗メッセージに追加します。
複数の検証を含むスペックでは、何が間違っていたのか、どの検証が失敗したのかを明確にするのに役立ちます。

残りのテストは、サービスが異なる値を返すときのコンポーネントのロジックを確認します。
2番目のテストは、ユーザー名を変更した際の影響を検証します。
3番目のテストは、ログインしているユーザーがいない場合にコンポーネントが適切なメッセージを表示することを確認します。

## 非同期サービスを使用するコンポーネント {#component-with-async-service}

このサンプルでは、`About`コンポーネントテンプレートが`Twain`コンポーネントをホストしています。
`Twain`コンポーネントはマーク・トウェインの名言を表示します。

```angular-html
<p class="twain">
  <i>{{ quote | async }}</i>
</p>
<button type="button" (click)="getQuote()">Next quote</button>
@if (errorMessage()) {
  <p class="error">{{ errorMessage() }}</p>
}
```

HELPFUL: コンポーネントの`quote`プロパティの値は`AsyncPipe`を通過します。
つまり、このプロパティは`Promise`または`Observable`を返します。

この例では、`TwainQuotes.getQuote()`メソッドにより、`quote`プロパティが`Observable`を返すことがわかります。

```ts
getQuote() {
  this.errorMessage.set('');
  this.quote = this.twainQuotes.getQuote().pipe(
    startWith('...'),
    catchError((err: any) => {
      this.errorMessage.set(err.message || err.toString());
      return of('...'); // reset message to placeholder
    }),
  );
}
```

`Twain`コンポーネントは、注入された`TwainQuotes`から名言を取得します。
コンポーネントは、サービスが最初の名言を返す前に、返された`Observable`をプレースホルダー値（`'...'`）で開始します。

`catchError`はサービスエラーを傍受し、エラーメッセージを準備して、成功チャネルでプレースホルダー値を返します。

これらはすべてテストしたい機能です。

### `HttpTestingController`を使用したHTTPリクエストのモックによるテスト {#testing-by-mocking-http-requests-with-the-httptestingcontroller}

コンポーネントをテストする場合、サービスのパブリックAPIのみが重要であるべきです。
一般に、テスト自体がリモートサーバーを呼び出すべきではありません。
テストはそのような呼び出しをエミュレートする必要があります。

非同期サービスがリモートデータをロードするために`HttpClient`に依存している場合、`HttpTestingController`を使用してHTTPレベルでモックレスポンスを返すことを推奨します。

`HttpBackend`のモック作成の詳細については、[専用ガイド](guide/http/testing)を参照してください。

### サービスのスタブ実装を提供することによるテスト {#testing-by-providing-a-stubbed-implementation-of-a-service}

HTTPレベルでの非同期リクエストのモックが不可能な場合、代替手段としてスパイを活用します。

この`app/twain/twain-quotes.spec.ts`の設定は、その方法の1つを示しています。

```ts {header: "twain.spec.ts"}
class TwainQuotesStub implements TwainQuotes {
  private testQuote = 'Test Quote';

  getQuote() {
    return of(this.testQuote);
  }

  // ... Implement everything to conform to the API
}

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  fixture = TestBed.createComponent(Twain);
  component = fixture.componentInstance;
  await fixture.whenStable();
  quoteEl = fixture.nativeElement.querySelector('.twain');
});
```

スタブ実装がどのように元の実装を置き換えるかに注目してください。

```ts
TestBed.configureTestingModule({
  providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
});
```

スタブは、それを注入するコンポーネントやサービスがスタブ化された実装を受け取るように設計されています。
つまり、`getQuote`への呼び出しはすべて、テスト用の名言を含むObservableを受け取ります。

実際の`getQuote()`メソッドとは異なり、このスパイはサーバーをバイパスし、値が即座に利用可能な同期Observableを返します。

### Vitestのフェイクタイマーを使用した非同期テスト {#async-test-with-a-vitest-fake-timers}

`setTimeout`や`Promise`のような非同期関数をモックするには、Vitestのフェイクタイマーを活用して発火タイミングを制御できます。

```ts
it('should display error when TwainQuotes service fails', async () => {
  class TwainQuotesStub implements TwainQuotes {
    getQuote() {
      return defer(() => {
        return new Promise<string>((_, reject) => {
          setTimeout(() => reject('TwainService test failure'));
        });
      });
    }

    // ... Implement everything to conform to the API
  }

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  vi.useFakeTimers(); // setting up the fake timers
  const fixture = TestBed.createComponent(TwainComponent);

  // rendering isn't async, we need to flush
  await vi.runAllTimersAsync();

  await expect(fixture.nativeElement.querySelector('.error')!.textContent).toMatch(/test failure/);
  expect(fixture.nativeElement.querySelector('.twain')!.textContent).toBe('...');

  vi.useRealTimers(); // resets to regular async execution
});
```

### その他の非同期テスト {#more-async-tests}

スタブされたサービスが非同期Observableを返す場合、テストのほとんども非同期である必要があります。

ここに、実世界で想定されるデータフローを示すテストがあります。

```ts
it('should show quote after getQuote', async () => {
  class MockTwainQuotes implements TwainQuotes {
    private subject = new Subject<string>();

    getQuote() {
      return this.subject.asObservable();
    }

    emit(val: string) {
      this.subject.next(val);
    }
  }

  it('should show quote after getQuote (success)', async () => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [{provide: TwainQuotes, useClass: MockTwainQuotes}],
    });

    const fixture = TestBed.createComponent(TwainComponent);
    const twainQuotes = TestBed.inject(TwainQuotes) as MockTwainQuotes;
    await vi.runAllTimersAsync(); // render before the quote is received

    const quoteEl = fixture.nativeElement.querySelector('.twain');
    expect(quoteEl.textContent).toBe('...');

    twainQuotes.emit('Twain Quote'); // emits the quote
    await vi.runAllTimersAsync(); // render with the quote received

    expect(quoteEl.textContent).toBe('Twain Quote');
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();

    vi.useRealTimers();
  });
});
```

最初のレンダリング時に、名言要素がプレースホルダー値（`'...'`）を表示していることに注目してください。
最初の名言はまだ到着していません。

その後、名言要素が期待されるテキストを表示していることをアサートできます。

### `zone.js`と`fakeAsync`を使用した非同期テスト {#async-tests-with-zonejs-and-fakeasync}

`fakeAsync`ヘルパー関数は、`zone.js`で非同期APIにパッチを当てることに依存するもう1つのモッククロックです。これは`zone.js`ベースのアプリケーションのテストで一般的に使用されていました。`fakeAsync`の使用は現在推奨されていません。

TIP: ネイティブの非同期テスト戦略や、VitestやJasmineなどの他のフェイクタイマー（モッククロックとも呼ばれます）を使用することを推奨します。

IMPORTANT: `fakeAsync`はVitestテストランナーでは使用できません。このランナーには`zone.js`パッチが適用されないためです。

## 入力と出力を持つコンポーネント {#component-with-inputs-and-outputs}

入力と出力を持つコンポーネントは通常、ホストコンポーネントのビューテンプレート内に現れます。
ホストはプロパティバインディングを使用して入力プロパティを設定し、イベントバインディングを使用して出力プロパティによって発生したイベントをリッスンします。

テストの目的は、そのようなバインディングが期待どおりに機能することを確認することです。
テストでは、入力値を設定し、出力イベントをリッスンする必要があります。

`DashboardHero`コンポーネントは、この役割を果たすコンポーネントの小さな例です。
これは、`Dashboard`コンポーネントによって提供される個々のヒーローを表示します。
そのヒーローをクリックすると、ユーザーがそのヒーローを選択したことが`Dashboard`コンポーネントに通知されます。

`DashboardHero`コンポーネントは、次のように`Dashboard`コンポーネントのテンプレートに埋め込まれています。

```angular-html
@for (hero of heroes; track hero) {
  <dashboard-hero class="col-1-4" [hero]="hero" (selected)="gotoDetail($event)" />
}
```

`DashboardHero`コンポーネントは`@for`ブロック内に現れ、各コンポーネントの`hero`入力プロパティをループ値に設定し、コンポーネントの`selected`イベントをリッスンします。

コンポーネントの完全な定義は次のとおりです。

```angular-ts
@Component({
  selector: 'dashboard-hero',
  imports: [UpperCasePipe],
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero().name | uppercase }}
    </button>
  `,
})
export class DashboardHero {
  readonly hero = input.required<Hero>();
  readonly selected = output<Hero>();

  click() {
    this.selected.emit(this.hero());
  }
}
```

このように単純なコンポーネントをテストすること自体にはあまり価値がありませんが、その方法を知っておくことには価値があります。
次のアプローチのいずれかを使用します。

- `Dashboard`コンポーネントで使用されている状態でテストする
- スタンドアロンコンポーネントとしてテストする
- `Dashboard`コンポーネントの代替で使用されている状態でテストする

当面の目標は`Dashboard`コンポーネントではなく`DashboardHero`コンポーネントをテストすることなので、2番目と3番目のオプションを試します。

### DashboardHeroコンポーネントを単体でテストする {#test-the-dashboardhero-component-standalone}

スペックファイルのセットアップの要点は次のとおりです。

```ts
let fixture: ComponentFixture<DashboardHero>;
let comp: DashboardHero;
let heroDe: DebugElement;
let heroEl: HTMLElement;
let expectedHero: Hero;

beforeEach(async () => {
  fixture = TestBed.createComponent(DashboardHero);
  comp = fixture.componentInstance;

  // find the hero's DebugElement and element
  heroDe = fixture.debugElement.query(By.css('.hero'));
  heroEl = heroDe.nativeElement;

  // mock the hero supplied by the parent component
  expectedHero = {id: 42, name: 'Test Name'};

  // simulate the parent setting the input property with that hero
  fixture.componentRef.setInput('hero', expectedHero);

  // wait for initial data binding
  await fixture.whenStable();
});
```

セットアップコードがテスト用ヒーロー（`expectedHero`）をコンポーネントの`hero`プロパティに割り当てていることに注目してください。これは、`Dashboard`がリピーター内のプロパティバインディングを使用して設定する方法をエミュレートしています。

次のテストは、ヒーロー名がバインディングを使用してテンプレートに伝播されることを検証します。

```ts
it('should display hero name in uppercase', () => {
  const expectedPipedName = expectedHero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});
```

テンプレートはAngularの`UpperCasePipe`を通してヒーロー名を渡すため、テストでは要素の値を大文字の名前に一致させる必要があります。

### クリック {#clicking}

ヒーローをクリックすると、ホストコンポーネント（おそらく`Dashboard`）が検知できる`selected`イベントが発生するはずです。

```ts
it('should raise selected event when clicked (triggerEventHandler)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroDe.triggerEventHandler('click');
  expect(selectedHero).toBe(expectedHero);
});
```

コンポーネントの`selected`プロパティは`EventEmitter`を返します。これはコンシューマーにはRxJSの同期的な`Observable`のように見えます。
テストは、ホストコンポーネントが_暗黙的に_行うのと同様に、_明示的に_それにサブスクライブします。

コンポーネントが期待どおりに動作する場合、ヒーローの要素をクリックすると、コンポーネントの`selected`プロパティに`hero`オブジェクトを発行するように指示するはずです。

テストは、`selected`へのサブスクリプションを通じてそのイベントを検出します。

### `triggerEventHandler` {#triggereventhandler}

前のテストの`heroDe`は、ヒーローの`<div>`を表す`DebugElement`です。

これには、ネイティブ要素との対話を抽象化するAngularのプロパティとメソッドがあります。
このテストは、"click"イベント名を指定して`DebugElement.triggerEventHandler`を呼び出します。
"click"イベントバインディングは、`DashboardHero.click()`を呼び出すことで応答します。

Angularの`DebugElement.triggerEventHandler`は、_イベント名_によって_任意のデータバインドされたイベント_を発生させることができます。
2番目のパラメータは、ハンドラーに渡されるイベントオブジェクトです。

テストは"click"イベントをトリガーしました。

```ts
heroDe.triggerEventHandler('click');
```

この場合、テストは、ランタイムイベントハンドラーであるコンポーネントの`click()`メソッドがイベントオブジェクトを気にしないと正しく想定しています。

HELPFUL: 他のハンドラーはそれほど寛容ではありません。
たとえば、`RouterLink`ディレクティブは、クリック中にどのマウスボタン（もしあれば）が押されたかを識別する`button`プロパティを持つオブジェクトを期待します。
イベントオブジェクトがない場合、`RouterLink`ディレクティブはエラーをスローします。

### 要素をクリックする {#click-the-element}

次のテストの代替案は、ネイティブ要素独自の`click()`メソッドを呼び出します。これは_このコンポーネント_にとっては全く問題ありません。

```ts
it('should raise selected event when clicked (element.click)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroEl.click();
  expect(selectedHero).toBe(expectedHero);
});
```

### `click()`ヘルパー {#click-helper}

ボタン、アンカー、または任意のHTML要素をクリックすることは、一般的なテストタスクです。

次の`click()`関数のようなヘルパーに_クリックトリガー_プロセスをカプセル化することで、それを一貫性のある簡単なものにします。

```ts
/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2},
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left,
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
```

最初のパラメータは_クリックする要素_です。
必要に応じて、2番目のパラメータとしてカスタムイベントオブジェクトを渡します。
デフォルトは、`RouterLink`ディレクティブを含む多くのハンドラーによって受け入れられる部分的な[左ボタンマウスイベントオブジェクト](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)です。

IMPORTANT: `click()`ヘルパー関数は、Angularテストユーティリティの1つでは**ありません**。
これは、_このガイドのサンプルコード_で定義されている関数です。
すべてのサンプルテストでこれを使用しています。
気に入ったら、独自のヘルパーコレクションに追加してください。

クリックヘルパーを使用して書き直した前のテストは次のとおりです。

```ts
it('should raise selected event when clicked (click helper with DebugElement)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  click(heroDe); // click helper with DebugElement

  expect(selectedHero).toBe(expectedHero);
});
```

## テストホスト内のコンポーネント {#component-inside-a-test-host}

以前のテストは、それ自体がホストである`Dashboard`コンポーネントの役割を果たしていました。
しかし、`DashboardHero`コンポーネントは、ホストコンポーネントに適切にデータバインディングされたときに正しく動作するでしょうか？

```angular-ts
@Component({
  imports: [DashboardHero],
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelected($event)" />`,
})
class TestHost {
  hero: Hero = {id: 42, name: 'Test Name'};
  selectedHero: Hero | undefined;

  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}
```

テストホストは、コンポーネントの`hero`入力プロパティにテスト用のヒーローを設定します。
コンポーネントの`selected`イベントを自身の`onSelected`ハンドラーにバインドし、発行されたヒーローを自身の`selectedHero`プロパティに記録します。

その後、テストは`selectedHero`を確認して、`DashboardHero.selected`イベントが期待されるヒーローを発行したことを検証できます。

`test-host`テストのセットアップは、スタンドアロンテストのセットアップと似ています。

```ts
beforeEach(async () => {
  // create TestHost instead of DashboardHero
  fixture = TestBed.createComponent(TestHost);
  testHost = fixture.componentInstance;
  heroEl = fixture.nativeElement.querySelector('.hero');

  await fixture.whenStable();
});
```

このテストモジュールの構成には、2つの重要な違いがあります。

- `DashboardHero`の代わりに`TestHost`コンポーネントを*作成*します
- `TestHost`コンポーネントはバインディングを使用して`DashboardHero.hero`を設定します

`createComponent`は、`DashboardHero`のインスタンスではなく、`TestHost`のインスタンスを保持する`fixture`を返します。

`TestHost`を作成すると、後者が前者のテンプレート内に現れるため、副作用として`DashboardHero`が作成されます。
ヒーロー要素（`heroEl`）のクエリは、以前よりも要素ツリーの深い場所にありますが、依然としてテストDOM内でそれを見つけます。

テスト自体は、スタンドアロンバージョンとほぼ同じです。

```ts
it('should display hero name', () => {
  const expectedPipedName = testHost.hero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});

it('should raise selected event when clicked', () => {
  click(heroEl);
  // selected hero should be the same data bound hero
  expect(testHost.selectedHero).toBe(testHost.hero);
});
```

選択イベントのテストのみが異なります。
これは、選択された`DashboardHero`のヒーローが、イベントバインディングを通じてホストコンポーネントまで実際に到達することを確認します。

## ルーティングコンポーネント {#routing-component}

_ルーティングコンポーネント_とは、`Router`に対して別のコンポーネントへナビゲートするよう指示するコンポーネントです。
`Dashboard`コンポーネントは、ユーザーがダッシュボード上の_ヒーローボタン_の1つをクリックすることで`HeroDetail`コンポーネントへナビゲートできるため、_ルーティングコンポーネント_です。

Angularは、ボイラープレートを削減し、`HttpClient`に依存するコードをより効果的にテストするためのテストヘルパーを提供します。`provideRouter`関数は、テストモジュール内で直接使用できます。

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{path: '**', component: Dashboard}]),
      provideHttpClientTesting(),
      HeroService,
    ],
  });
  harness = await RouterTestingHarness.create();
  comp = await harness.navigateByUrl('/', Dashboard);
  TestBed.inject(HttpTestingController).expectOne('api/heroes').flush(getTestHeroes());
});
```

次のテストは、表示されたヒーローをクリックし、期待されるURLへナビゲートすることを確認します。

```ts
it('should tell navigate when hero clicked', async () => {
  // get first <dashboard-hero> DebugElement
  const heroDe = harness.routeDebugElement!.query(By.css('dashboard-hero'));
  heroDe.triggerEventHandler('selected', comp.heroes[0]);

  // expecting to navigate to id of the component's first hero
  const id = comp.heroes[0].id;
  expect(TestBed.inject(Router).url, 'should nav to HeroDetail for first hero').toEqual(
    `/heroes/${id}`,
  );
});
```

## ルーティングされたコンポーネント {#routed-components}

_ルーティングされたコンポーネント_は、`Router`ナビゲーションの宛先です。
特にコンポーネントへのルートに_パラメータが含まれている_場合、テストが難しくなることがあります。
`HeroDetail`は、そのようなルートの宛先となる_ルーティングされたコンポーネント_です。

ユーザーが_ダッシュボード_のヒーローをクリックすると、`Dashboard`は`Router`に`heroes/:id`へナビゲートするように指示します。
`:id`はルートパラメータであり、その値は編集するヒーローの`id`です。

`Router`はそのURLを`HeroDetail`へのルートと照合します。
ルーティング情報を持つ`ActivatedRoute`オブジェクトを作成し、それを`HeroDetail`の新しいインスタンスに注入します。

`HeroDetail`に注入されるサービスは次のとおりです。

```ts
private heroDetailService = inject(HeroDetailService);
private route = inject(ActivatedRoute);
private router = inject(Router);
```

`HeroDetail`コンポーネントは、`HeroDetailService`を使用して対応するヒーローを取得するために`id`パラメータを必要とします。
コンポーネントは、`Observable`である`ActivatedRoute.paramMap`プロパティから`id`を取得する必要があります。

単に`ActivatedRoute.paramMap`の`id`プロパティを参照できません。
コンポーネントは`ActivatedRoute.paramMap` observableを_サブスクライブ_し、そのライフサイクル中に`id`が変更されることに備える必要があります。

```ts
constructor() {
  // get hero when `id` param changes
  this.route.paramMap
    .pipe(takeUntilDestroyed())
    .subscribe((pmap) => this.getHero(pmap.get('id')));
}
```

テストでは、異なるルートにナビゲートすることで、`HeroDetail`が異なる`id`パラメータ値にどのように応答するかを確認できます。

## ネストされたコンポーネントのテスト {#nested-component-tests}

コンポーネントテンプレートには、ネストされたコンポーネントが含まれることがよくあり、そのテンプレートにもさらにコンポーネントが含まれる場合があります。

コンポーネントツリーは非常に深くなることがあり、ネストされたコンポーネントがツリーの最上位にあるコンポーネントのテストにおいて何の役割も果たさない場合があります。

たとえば、`App`コンポーネントは、アンカーとそれらの`RouterLink`ディレクティブを持つナビゲーションバーを表示します。

```angular-html
<app-banner />
<app-welcome />

<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet />
```

ナビゲーションではなくリンクを検証するには、ナビゲートするための`Router`は必要ありませんし、`Router`が*ルーティングされたコンポーネント*を挿入する場所を示すための`<router-outlet>`も必要ありません。

`Banner`および`Welcome`コンポーネント（`<app-banner>`および`<app-welcome>`で示される）も無関係です。

しかし、DOM内に`App`コンポーネントを作成するテストはすべて、これら3つのコンポーネントのインスタンスも作成します。もしそれを許可する場合、それらを作成するように`TestBed`を設定する必要があります。

それらを宣言し忘れると、Angularコンパイラは`App`テンプレート内の`<app-banner>`、`<app-welcome>`、および`<router-outlet>`タグを認識せず、エラーをスローします。

実際のコンポーネントを宣言する場合、*それらの*ネストされたコンポーネントも宣言し、ツリー内の*任意の*コンポーネントに注入される*すべての*サービスを提供する必要があります。

このセクションでは、セットアップを最小限に抑えるための2つのテクニックについて説明します。
プライマリコンポーネントのテストに集中するために、それらを単独で、または組み合わせて使用してください。

### 不要なコンポーネントのスタブ化 {#stubbing-unneeded-components}

最初のテクニックでは、テストにおいてほとんど、あるいはまったく役割を果たさないコンポーネントやディレクティブのスタブバージョンを作成して宣言します。

```ts
@Component({selector: 'app-banner', template: ''})
class BannerStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'app-welcome', template: ''})
class WelcomeStub {}
```

スタブのセレクターは、対応する実際のコンポーネントのセレクターと一致します。
しかし、それらのテンプレートとクラスは空です。

次に、`TestBed.overrideComponent`を使用してコンポーネントの`imports`をオーバーライドすることで、それらを宣言します。

```ts
let comp: App;
let fixture: ComponentFixture<App>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [RouterLink, BannerStub, RouterOutletStub, WelcomeStub],
    },
  });

  fixture = TestBed.createComponent(App);
  comp = fixture.componentInstance;
});
```

HELPFUL: この例の`set`キーは、コンポーネント上の既存のすべてのインポートを置き換えます。スタブだけでなく、すべての依存関係をインポートするようにしてください。あるいは、`remove`/`add`キーを使用して、インポートを選択的に削除および追加できます。

### `NO_ERRORS_SCHEMA` {#noerrorsschema}

2つ目のアプローチでは、コンポーネントのメタデータオーバーライドに`NO_ERRORS_SCHEMA`を追加します。

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [], // resets all imports
      schemas: [NO_ERRORS_SCHEMA],
    },
  });
});
```

`NO_ERRORS_SCHEMA`は、認識されない要素や属性を無視するようにAngularコンパイラに指示します。

コンパイラは、`TestBed`構成で対応する`App`コンポーネントと`RouterLink`を宣言したため、`<app-root>`要素と`routerLink`属性を認識します。

しかし、コンパイラは`<app-banner>`、`<app-welcome>`、または`<router-outlet>`に遭遇してもエラーをスローしません。
単にそれらを空のタグとしてレンダリングし、ブラウザはそれらを無視します。

スタブコンポーネントはもう必要ありません。

### 両方のテクニックを併用する {#use-both-techniques-together}

これらは*浅いコンポーネントテスト（Shallow Component Testing）*のためのテクニックであり、コンポーネントの視覚的な表面を、テストにとって重要なコンポーネントテンプレート内の要素だけに縮小することからそう呼ばれています。

`NO_ERRORS_SCHEMA`アプローチは2つのうち簡単な方ですが、使いすぎないようにしてください。

`NO_ERRORS_SCHEMA`はまた、うっかり省略したりスペルミスしたりした不足しているコンポーネントや属性について、コンパイラが通知するのを防ぎます。
コンパイラなら一瞬で発見できたはずの幻のバグを追いかけるのに、何時間も無駄にする可能性があります。

*スタブコンポーネント*アプローチには別の利点があります。
*この*例のスタブは空でしたが、テストにおいて何らかの方法でそれらと対話する必要がある場合は、機能を削ぎ落としたテンプレートやクラスを与えることができます。

実際には、この例に見られるように、同じセットアップで2つのテクニックを組み合わせることになります。

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    remove: {imports: [RouterOutlet, Welcome]},
    set: {schemas: [NO_ERRORS_SCHEMA]},
  });
});
```

Angularコンパイラは、`<app-banner>`要素に対して`BannerStub`を作成し、`routerLink`属性を持つアンカーに`RouterLink`を適用しますが、`<app-welcome>`および`<router-outlet>`タグは無視します。

### `By.directive`と注入されたディレクティブ {#bydirective-and-injected-directives}

もう少しセットアップを行うと、初期データバインディングがトリガーされ、ナビゲーションリンクへの参照が取得されます。

```ts
beforeEach(async () => {
  await fixture.whenStable();

  // find DebugElements with an attached RouterLinkStubDirective
  linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));

  // get attached link directive instances
  // using each DebugElement's injector
  routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
});
```

特に興味深い3つのポイント：

- `By.directive`を使用して、ディレクティブがアタッチされたアンカー要素を見つけます
- クエリは、一致する要素をラップした`DebugElement`を返します
- 各`DebugElement`は、その要素にアタッチされたディレクティブの特定のインスタンスを持つ依存性の注入（DI）を公開します

検証する`App`コンポーネントのリンクは次のとおりです。

```angular-html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>
```

これらのリンクが期待どおりに`routerLink`ディレクティブに接続されていることを確認するいくつかのテストを以下に示します。

```ts
it('can get RouterLinks from template', () => {
  expect(routerLinks.length, 'should have 3 routerLinks').toBe(3);
  expect(routerLinks[0].href).toBe('/dashboard');
  expect(routerLinks[1].href).toBe('/heroes');
  expect(routerLinks[2].href).toBe('/about');
});

it('can click Heroes link in template', async () => {
  const heroesLinkDe = linkDes[1]; // heroes link DebugElement

  TestBed.inject(Router).resetConfig([{path: '**', children: []}]);
  heroesLinkDe.triggerEventHandler('click', {button: 0});

  await fixture.whenStable();

  expect(TestBed.inject(Router).url).toBe('/heroes');
});
```

## `page`オブジェクトの使用 {#use-a-page-object}

`HeroDetail`コンポーネントは、タイトル、2つのヒーローフィールド、2つのボタンを持つシンプルなビューです。

しかし、この単純なフォームでさえ、テンプレートには多くの複雑さがあります。

```angular-html
@if (hero) {
  <div>
    <h2>
      <span>{{ hero.name | titlecase }}</span> Details
    </h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="name">name: </label>
      <input id="name" [(ngModel)]="hero.name" placeholder="name" />
    </div>
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
}
```

コンポーネントを検証するテストには以下が必要です…

- DOMに要素が表示される前に、ヒーローが到着するのを待つこと
- タイトルテキストへの参照
- 検査および設定するための名前入力ボックスへの参照
- クリックできるようにするための2つのボタンへの参照

このような小さなフォームでさえ、条件付きセットアップやCSS要素選択が入り組んで混乱を招く可能性があります。

コンポーネントプロパティへのアクセスを処理し、それらを設定するロジックをカプセル化する`Page`クラスを使用して、複雑さを制御します。

以下は、`hero-detail.component.spec.ts`用のそのような`Page`クラスです。

```ts
class Page {
  // getter properties wait to query the DOM until called.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  //// query helpers ////
  private query<T>(selector: string): T {
    return harness.routeNativeElement!.querySelector(selector)! as T;
  }

  private queryAll<T>(selector: string): T[] {
    return harness.routeNativeElement!.querySelectorAll(selector) as any as T[];
  }
}
```

これで、コンポーネントの操作と検査のための重要なフックが整理され、`Page`のインスタンスからアクセスできるようになりました。

`createComponent`メソッドは`page`オブジェクトを作成し、`hero`が到着すると空白を埋めます。

```ts
async function createComponent(id: number) {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${id}`, HeroDetail);
  page = new Page();

  const request = TestBed.inject(HttpTestingController).expectOne(`api/heroes/?id=${id}`);
  const hero = getTestHeroes().find((h) => h.id === Number(id));
  request.flush(hero ? [hero] : []);
  await harness.fixture.whenStable();
}
```

要点を強調するために、さらにいくつかの`HeroDetail`コンポーネントテストを以下に示します。

```ts
it("should display that hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(expectedHero.name);
});

it('should navigate when click cancel', () => {
  click(page.cancelBtn);
  expect(TestBed.inject(Router).url).toEqual(`/heroes/${expectedHero.id}`);
});

it('should save when click save but not navigate immediately', () => {
  click(page.saveBtn);
  expect(TestBed.inject(HttpTestingController).expectOne({method: 'PUT', url: 'api/heroes'}));
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should navigate when click save and save resolves', async () => {
  click(page.saveBtn);
  await harness.fixture.whenStable();
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should convert hero name to Title Case', async () => {
  // get the name's input and display elements from the DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## コンポーネントプロバイダーのオーバーライド {#override-component-providers}

`HeroDetail`は独自の`HeroDetailService`を提供します。

```ts
@Component({
  /* ... */
  providers: [HeroDetailService],
})
export class HeroDetail {
  private heroDetailService = inject(HeroDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
}
```

`TestBed.configureTestingModule`の`providers`でコンポーネントの`HeroDetailService`をスタブできません。
これらは*テストモジュール*のプロバイダーであり、コンポーネントのものではありません。
これらは*フィクスチャレベル*で依存性インジェクターを準備します。

Angularは、フィクスチャインジェクターの*子*である*独自の*インジェクターを使用してコンポーネントを作成します。
コンポーネントのプロバイダー（この場合は`HeroDetailService`）を子インジェクターに登録します。

テストはフィクスチャインジェクターから子インジェクターのサービスにアクセスできません。
また、`TestBed.configureTestingModule`もそれらを設定できません。

Angularはずっと本物の`HeroDetailService`の新しいインスタンスを作成していたのです！

HELPFUL: `HeroDetailService`がリモートサーバーへの独自のXHR呼び出しをする場合、これらのテストは失敗またはタイムアウトする可能性があります。
呼び出すリモートサーバーが存在しないかもしれません。

幸いなことに、`HeroDetailService`はリモートデータアクセスの責任を注入された`HeroService`に委譲しています。

```ts
@Injectable({providedIn: 'root'})
export class HeroDetailService {
  private heroService = inject(HeroService);
}
```

前のテスト構成では、本物の`HeroService`を、サーバーリクエストを傍受してレスポンスを偽装する`TestHeroService`に置き換えています。

もし運が悪かったらどうでしょう。
`HeroService`を偽装するのが難しい場合はどうでしょう？
`HeroDetailService`が独自のサーバーリクエストを行う場合はどうでしょう？

`TestBed.overrideComponent`メソッドを使用すると、次のセットアップのバリエーションに見られるように、コンポーネントの`providers`を管理しやすい*テストダブル*に置き換えることができます。

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {path: 'heroes', component: HeroList},
        {path: 'heroes/:id', component: HeroDetail},
      ]),
      // HeroDetailService at this level is IRRELEVANT!
      {provide: HeroDetailService, useValue: {}},
    ],
  }).overrideComponent(HeroDetail, {
    set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
  });
});
```

`TestBed.configureTestingModule`はもはや偽の`HeroService`を提供していないことに注意してください。なぜなら、それは[必要ない](#provide-a-spy-stub-herodetailservicespy)からです。

### `overrideComponent`メソッド {#the-overridecomponent-method}

`overrideComponent`メソッドに注目してください。

```ts
.overrideComponent(HeroDetail, {
  set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
});
```

これは2つの引数を取ります。オーバーライドするコンポーネント型\(`HeroDetail`\)と、オーバーライドメタデータオブジェクトです。
[オーバーライドメタデータオブジェクト](/guide/testing/utility-apis#testbed-class-summary)は、次のように定義されたジェネリックです。

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

メタデータオーバーライドオブジェクトは、メタデータプロパティ内の要素を追加および削除するか、それらのプロパティを完全にリセットできます。
この例では、コンポーネントの`providers`メタデータをリセットします。

型パラメータ`T`は、`@Component`デコレーターに渡すメタデータの種類です。

```ts
selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…
```

### *スパイスタブ*（`HeroDetailServiceSpy`）を提供する {#provide-a-spy-stub-herodetailservicespy}

この例では、コンポーネントの`providers`配列を、`HeroDetailServiceSpy`を含む新しい配列に完全に置き換えます。

`HeroDetailServiceSpy`は、そのサービスの必要なすべての機能を偽装する、本物の`HeroDetailService`のスタブバージョンです。
これは下位レベルの`HeroService`を注入や委譲をしないため、そのためのテストダブルを提供する必要はありません。

関連する`HeroDetail`コンポーネントのテストは、サービスメソッドをスパイすることで、`HeroDetailService`のメソッドが呼び出されたことをアサートします。
したがって、スタブはそのメソッドをスパイとして実装します。

```ts
import {vi} from 'vitest';

class HeroDetailServiceSpy {
  testHero: Hero = {...testHero};

  /* emit cloned test hero */
  getHero = vi.fn(() => asyncData({...this.testHero}));

  /* emit clone of test hero, with changes merged in */
  saveHero = vi.fn((hero: Hero) => asyncData(Object.assign(this.testHero, hero)));
}
```

### オーバーライドテスト {#the-override-tests}

これでテストは、スパイスタブの`testHero`を操作することでコンポーネントのヒーローを直接制御し、サービスメソッドが呼び出されたことを確認できます。

```ts
let hdsSpy: HeroDetailServiceSpy;

beforeEach(async () => {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${testHero.id}`, HeroDetail);
  page = new Page();
  // get the component's injected HeroDetailServiceSpy
  hdsSpy = harness.routeDebugElement!.injector.get(HeroDetailService) as any;

  harness.detectChanges();
});

it('should have called `getHero`', () => {
  expect(hdsSpy.getHero, 'getHero called once').toHaveBeenCalledTimes(1);
});

it("should display stub hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
});

it('should save stub hero change', async () => {
  const origName = hdsSpy.testHero.name;
  const newName = 'New Name';

  page.nameInput.value = newName;

  page.nameInput.dispatchEvent(new Event('input')); // tell Angular

  expect(component.hero.name, 'component hero has new name').toBe(newName);
  expect(hdsSpy.testHero.name, 'service hero unchanged before save').toBe(origName);

  click(page.saveBtn);
  expect(hdsSpy.saveHero, 'saveHero called once').toHaveBeenCalledTimes(1);

  await harness.fixture.whenStable();
  expect(hdsSpy.testHero.name, 'service hero has new name after save').toBe(newName);
  expect(TestBed.inject(Router).url).toEqual('/heroes');
});
```

### その他のオーバーライド {#more-overrides}

`TestBed.overrideComponent`メソッドは、同じコンポーネントまたは異なるコンポーネントに対して複数回呼び出すことができます。
`TestBed`は、これらの他のクラスの一部を掘り下げて置き換えるための同様の`overrideDirective`、`overrideModule`、および`overridePipe`メソッドを提供します。

独自のオプションと組み合わせを試してみてください。
