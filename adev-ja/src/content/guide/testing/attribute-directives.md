# 属性ディレクティブのテスト

_属性ディレクティブ_は、要素、コンポーネント、または他のディレクティブの動作を変更します。
その名前は、ディレクティブが適用される方法、つまりホスト要素の属性として適用される方法を反映しています。

## `Highlight`ディレクティブのテスト

サンプルアプリケーションの`Highlight`ディレクティブは、データバインドされた色またはデフォルトの色（ライトグレー）に基づいて、要素の背景色を設定します。
また、要素のカスタムプロパティ（`customProperty`）を`true`に設定しますが、これは単に設定できることを示すためです。

```ts
import {Directive, inject, input} from '@angular/core';

/**
 * Set backgroundColor for the attached element to highlight color
 * and set the element's customProperty attribute to true
 */
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'bgColor() || defaultColor',
  },
})
export class Highlight {
  readonly defaultColor = 'rgb(211, 211, 211)'; // lightgray

  readonly bgColor = input('', {alias: 'highlight'});
}
```

これはアプリケーション全体で使用されています。おそらく最も簡単な例は`About`コンポーネントです。

```ts
@Component({
  imports: [Twain, Highlight],
  template: `
    <h2 highlight="skyblue">About</h2>
    <h3>Quote of the day:</h3>
    <twain-quote />
  `,
})
export class About {}
```

`About`コンポーネント内での`Highlight`ディレクティブの特定の使用をテストするには、[Component testing scenarios](guide/testing/components-scenarios)セクションの["Nested component tests"](guide/testing/components-scenarios#nested-component-tests)で説明されているテクニックのみが必要です。

```ts
let fixture: ComponentFixture<About>;

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [TwainService, UserService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  fixture = TestBed.createComponent(About);
  await fixture.whenStable();
});

it('should have skyblue <h2>', () => {
  const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
  const bgColor = h2.style.backgroundColor;
  expect(bgColor).toBe('skyblue');
});

しかし、単一のユースケースをテストしても、ディレクティブの機能のすべてを調べられるとは限りません。
ディレクティブを使用するすべてのコンポーネントを見つけてテストすることは、面倒で壊れやすく、完全なカバレッジを実現する可能性もほとんどありません。

_クラスのみのテスト_は役立つ場合がありますが、このディレクティブのような属性ディレクティブは、DOMを操作する傾向があります。
孤立したユニットテストはDOMに触れないため、ディレクティブの有効性に対する信頼を得られません。

より良い解決策は、ディレクティブのすべての適用方法を示す人工的なテストコンポーネントを作成することです。

```angular-ts
@Component({
  imports: [Highlight],
  template: `
    <h2 highlight="yellow">Something Yellow</h2>
    <h2 highlight>The Default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [highlight]="box.value" value="cyan" />
  `,
})
class Test {}
```

<img alt="HighlightDirective spec in action" src="assets/images/guide/testing/highlight-directive-spec.png">

HELPFUL: `<input>`のケースでは、`Highlight`を、入力ボックス内の色の値の名前とバインドしています。
初期値は単語"cyan"であり、これは入力ボックスの背景色になります。

このコンポーネントのテストをいくつか紹介します。

```ts
let fixture: ComponentFixture<Test>;
let des: DebugElement[]; // the three elements w/ the directive

beforeEach(async () => {
  fixture = TestBed.createComponent(Test);
  await fixture.whenStable();

  // all elements with an attached Highlight
  des = fixture.debugElement.queryAll(By.directive(Highlight));
});

// color tests
it('should have three highlighted elements', () => {
  expect(des.length).toBe(3);
});

it('should color 1st <h2> background "yellow"', () => {
  const bgColor = des[0].nativeElement.style.backgroundColor;
  expect(bgColor).toBe('yellow');
});

it('should color 2nd <h2> background w/ default color', () => {
  const dir = des[1].injector.get(Highlight);
  const bgColor = des[1].nativeElement.style.backgroundColor;
  expect(bgColor).toBe(dir.defaultColor);
});

it('should bind <input> background to value color', async () => {
  // easier to work with nativeElement
  const input = des[2].nativeElement as HTMLInputElement;
  expect(input.style.backgroundColor, 'initial backgroundColor').toBe('cyan');

  input.value = 'green';

  // Dispatch a DOM event so that Angular responds to the input value change.
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();

  expect(input.style.backgroundColor, 'changed backgroundColor').toBe('green');
});

it('bare <h2> should not have a backgroundColor', () => {
  // the h2 without the Highlight directive
  const bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));

  expect(bareH2.styles.backgroundColor).toBeUndefined();
});
```

いくつかのテクニックが注目に値します。

- `By.directive`述語は、_要素の種類が不明な場合_、このディレクティブを持つ要素を取得する優れた方法です。
- `By.css('h2:not([highlight])')`の[`:not`擬似クラス](https://developer.mozilla.org/docs/Web/CSS/:not)は、ディレクティブを持っていない`<h2>`要素を見つけるのに役立ちます。
  `By.css('*:not([highlight])')`は、ディレクティブを持っていない_すべての_要素を見つけます。

- `DebugElement.styles`は、`DebugElement`抽象化のおかげで、実際のブラウザがなくても、要素のスタイルにアクセスできます。
  しかし、抽象化よりも簡単で明確な場合は、`nativeElement`を利用してください。

- Angularは、適用された要素のインジェクターにディレクティブを追加します。
  デフォルトの色に対するテストでは、2番目の`<h2>`のインジェクターを使用して、その`Highlight`インスタンスとその`defaultColor`を取得します。

- `DebugElement.properties`は、ディレクティブによって設定された人工的なカスタムプロパティにアクセスできます。

