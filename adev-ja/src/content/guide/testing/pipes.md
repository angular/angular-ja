# パイプのテスト

Angularのテストユーティリティを使わずに[パイプ](guide/templates/pipes)をテストできます。

## `TitleCasePipe`のテスト

パイプクラスには、入力値を変換された出力値に変換する`transform`メソッドが1つあります。
`transform`の実装は、DOMとほとんどやり取りしません。
ほとんどのパイプは、`@Pipe`メタデータとインターフェース以外、Angularに依存していません。

各単語の最初の文字を大文字にする`TitleCasePipe`を考えてみましょう。
正規表現を使った実装を以下に示します。

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Transform to Title Case: uppercase the first letter of the words in a string. */
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ''
      : input.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
  }
}
```

正規表現を使用するものは、徹底的にテストする価値があります。標準的な単体テスト技法を使用して、期待されるケースとエッジケースを調べることができます。

```ts
describe('TitleCasePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new TitleCasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... more tests ...
});
```

## パイプテストをサポートするDOMテストの作成

これらはパイプの_単体_テストです。
これらは、`TitleCasePipe`がアプリケーションコンポーネントに適用されたときに正しく動作しているかどうかを判断できません。

このようなコンポーネントテストを追加することを考えてみましょう。

```ts
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
