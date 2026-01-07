# コンポーネントテストの基本

コンポーネントは、Angularアプリケーションの他のすべての部分とは異なり、HTMLテンプレートとTypeScriptクラスを組み合わせたものです。
コンポーネントは、実際にはテンプレートとクラスが _連携_ したものです。
コンポーネントを適切にテストするには、意図したとおりに連携して動作することをテストする必要があります。

このようなテストには、Angularと同様にブラウザのDOMにコンポーネントのホスト要素を作成し、そのテンプレートで記述されているように、DOMとのコンポーネントクラスの対話を調査することが必要です。

Angularの `TestBed` は、次のセクションで説明するように、この種類のテストを容易にします。
しかし、多くの場合、_DOM を伴わないコンポーネントクラス単独のテスト_ は、コンポーネントの動作の大部分を、より簡単で明らかな方法で検証できます。

## コンポーネント DOM テスト

コンポーネントは、そのクラスだけではありません。
コンポーネントはDOMと他のコンポーネントと対話します。
クラスだけでは、コンポーネントが正しくレンダリングされるか、ユーザーの入力やジェスチャーに応答するか、親コンポーネントと子コンポーネントと統合されるかを判断できません。

- `Lightswitch.clicked()` はユーザーが呼び出せるように何かとバインドされていますか？
- `Lightswitch.message` は表示されますか？
- ユーザーは `DashboardHero` コンポーネントによって表示されるヒーローを実際に選択できますか？
- ヒーローの名前は期待通り（たとえば、大文字）に表示されますか？
- `Welcome` コンポーネントのテンプレートによってウェルカムメッセージは表示されますか？

これらの質問は、説明した前の簡単なコンポーネントにとっては問題ないかもしれません。
しかし、多くのコンポーネントは、そのテンプレートで記述されているDOM要素との複雑な対話を持ち、コンポーネントの状態が変わるとHTMLが表示および非表示になります。

これらの質問に答えるには、コンポーネントに関連付けられたDOM要素を作成し、DOMを調べて適切なタイミングでコンポーネントの状態が正しく表示されていることを確認します。そしてユーザーが画面と対話するようにシミュレートして、それらの対話がコンポーネントが期待通りに動作するかどうかを判断する必要があります。

これらの種類のテストを書くには、`TestBed` の追加機能と、他のテストヘルパーを使用します。

### CLI で生成されたテスト

CLIは、新しいコンポーネントの生成を要求するときに、デフォルトで初期テストファイルを自動的に生成します。

たとえば、次のCLIコマンドは `app/banner` フォルダーに `Banner` コンポーネントを生成します（インラインテンプレートとスタイル付き）。

```shell
ng generate component banner --inline-template --inline-style
```

また、コンポーネントの初期テストファイル `banner.spec.ts` も生成し、次のようになります。

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Banner} from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Banner],
    }).compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### セットアップの削減

このファイルの最後の3行だけが実際にコンポーネントをテストしており、Angularがコンポーネントを作成できることをアサートするだけです。

ファイルの残りの部分は、コンポーネントが実質的なものへと進化した場合に必要になる _可能性のある_、より高度なテストを予期した定型文のセットアップコードです。

これらの高度なテスト機能については、次のセクションで説明します。
今のところ、このテストファイルをより管理しやすいサイズに大幅に縮小できます。

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

後で `TestBed.configureTestingModule()` を呼び出して、インポート、プロバイダー、その他の宣言を追加して、テストのニーズに合わせて構成します。
オプションの `override` メソッドは、構成の側面をさらに微調整できます。

NOTE: `TestBed.compileComponents` は、テストされるコンポーネントで `@defer` ブロックが使用されている場合にのみ必要です。

### `createComponent()`

`TestBed` を構成したら、その `createComponent()` メソッドを呼び出します。

```ts
const fixture = TestBed.createComponent(Banner);
```

`TestBed.createComponent()` は `Banner` コンポーネントのインスタンスを作成し、対応する要素をテストランナーのDOMに追加し、[`ComponentFixture`](#componentfixture) を返します。

IMPORTANT: `createComponent` を呼び出した後に `TestBed` を再構成しないでください。

`createComponent` メソッドは、現在の `TestBed` 定義を凍結し、さらなる構成を締め切ります。

`configureTestingModule()` や `get()`、`override...` メソッドなど、`TestBed` の構成メソッドをさらに呼び出すことはできません。
呼び出そうとすると、`TestBed` はエラーをスローします。

### `ComponentFixture`

[`ComponentFixture`](api/core/testing/ComponentFixture) は、作成されたコンポーネントとその対応する要素を操作するためのテストハーネスです。

fixtureを介してコンポーネントインスタンスにアクセスし、期待を使用して存在を確認します。

```ts
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### `beforeEach()`

このコンポーネントが進化するにつれて、さらに多くのテストを追加するでしょう。
各テストのために `TestBed` 構成を複製するのではなく、セットアップを `beforeEach()` といくつかのサポート変数にリファクタリングします。

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // necessary to wait for the initial rendering
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

HELPFUL: `beforeEach` で `await fixture.whenStable` を使用して初期レンダリングを待機することで、個別のテストは同期的になります。

次に、fixture.nativeElementからコンポーネントの要素を取得し、期待されるテキストを探すテストを追加します。

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain('banner works!');
});
```

### `setup` 関数の作成

`beforeEach` の代わりに、各テストで呼び出すsetup関数を作成することもできます。
setup関数は、パラメーターを介してカスタマイズできるという利点があります。

setup関数の例を次に示します。

```ts
function setup(providers?: StaticProviders[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

### `nativeElement`

`ComponentFixture.nativeElement` の値は `any` 型です。
後で `DebugElement.nativeElement` に遭遇しますが、これも `any` 型です。

Angularは、コンパイル時に `nativeElement` がどのようなHTML要素であるか、あるいはHTML要素であるかどうかすらを知ることができません。
アプリケーションは、サーバーやNode環境などの _非ブラウザープラットフォーム_ で実行されている可能性があり、その場合、要素のAPIが制限されているか、存在しない可能性があります。

このガイドのテストはブラウザで実行されるように設計されているため、`nativeElement` の値は常に `HTMLElement` またはその派生クラスのいずれかになります。

それが何らかの `HTMLElement` であることを知っているので、標準のHTML `querySelector` を使用して、要素ツリーをさらに深く掘り下げます。

次に、`HTMLElement.querySelector` を呼び出して段落要素を取得し、バナーテキストを探すテストを示します。

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

### `DebugElement`

Angularの _fixture_ は、`fixture.nativeElement` を介してコンポーネントの要素を直接提供します。

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

これは実際には、`fixture.debugElement.nativeElement` として実装された便利なメソッドです。

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

この回りくどい要素へのパスには、正当な理由があります。

`nativeElement` のプロパティは、実行時環境によって異なります。
これらのテストは、DOMがないか、DOMエミュレーションが完全な `HTMLElement` APIをサポートしていない _非ブラウザープラットフォーム_ で実行されている可能性があります。

Angularは、_すべてのサポートされているプラットフォーム_ で安全に動作するために、`DebugElement` 抽象化に依存しています。
AngularはHTML要素ツリーを作成するのではなく、実行時プラットフォームの _ネイティブ要素_ をラップする `DebugElement` ツリーを作成します。
`nativeElement` プロパティは `DebugElement` をラップ解除し、プラットフォーム固有の要素オブジェクトを返します。

このガイドのサンプルテストはブラウザでのみ実行されるように設計されているため、これらのテストの `nativeElement` は常に `HTMLElement` であり、そのおなじみのメソッドとプロパティはテスト内で調べることができます。

次に、`fixture.debugElement.nativeElement` を使用して再実装された前のテストを示します。

```ts
it('should find the <p> with fixture.debugElement.nativeElement', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

`DebugElement` には、このガイドの他の場所で説明されているように、テストで役立つ他のメソッドとプロパティがあります。

Angularコアライブラリから `DebugElement` シンボルをインポートします。

```ts
import {DebugElement} from '@angular/core';
```

### `By.css()`

このガイドのテストはすべてブラウザで実行されますが、一部のアプリケーションは少なくとも一部の時間を別のプラットフォームで実行することがあります。

たとえば、コンポーネントは、接続の悪いデバイスでのアプリケーションの起動を高速化するための戦略の一部として、最初にサーバーでレンダリングされる可能性があります。
サーバー側レンダラーは、完全なHTML要素APIをサポートしていない可能性があります。
`querySelector` をサポートしていない場合、前のテストは失敗する可能性があります。

`DebugElement` は、すべてのサポートされているプラットフォームで動作するクエリメソッドを提供します。
これらのクエリメソッドは、`DebugElement` ツリー内のノードが選択基準に一致した場合に `true` を返す _述語_ 関数を取ります。

実行時プラットフォームのライブラリからインポートされた `By` クラスの助けを借りて _述語_ を作成します。
次に、ブラウザプラットフォームの `By` のインポートを示します。

```ts
import {By} from '@angular/platform-browser';
```

次の例は、`DebugElement.query()` とブラウザの `By.css` メソッドを使用して、前のテストを再実装したものです。

```ts
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

注目すべき観察結果をいくつか紹介します。

- `By.css()` 静的メソッドは、[標準の CSS セレクター](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS セレクター') を持つ `DebugElement` ノードを選択します。
- クエリは、段落の `DebugElement` を返します。
- その結果をラップ解除して、段落要素を取得する必要があります。

CSSセレクターでフィルタリングし、ブラウザの _ネイティブ要素_ のプロパティのみをテストする場合は、`By.css` アプローチはやり過ぎになる可能性があります。

多くの場合、`querySelector()` や `querySelectorAll()` などの標準の `HTMLElement` メソッドを使用してフィルタリングする方が簡単で明確です。
