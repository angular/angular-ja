<docs-decorative-header title="ツールバー">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" title="ツールバーARIAパターン"/>
  <docs-pill href="/api/aria/toolbar/Toolbar" title="ツールバーAPIリファレンス"/>
</docs-pill-row>

## 概要

キーボードナビゲーションで関連するコントロールとアクションをグループ化するためのコンテナで、一般的にテキストフォーマット、ツールバー、コマンドパネルに使用されます。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

Toolbarは、ユーザーが頻繁にアクセスする関連コントロールをグループ化するのに最適です。次のような場合にToolbarの使用を検討してください:

- **複数の関連アクション** - 関連する機能を持つコントロールが複数ある場合（テキストフォーマットボタンなど）
- **キーボードの効率が重要** - ユーザーが矢印キーによる素早いキーボードナビゲーションの恩恵を受ける場合
- **グループ化されたコントロール** - コントロールをセパレーターで論理的なセクションに整理する必要がある場合
- **頻繁なアクセス** - ワークフロー内でコントロールが繰り返し使用される場合

次のような場合はToolbarの使用を避けてください:

- 単純なボタングループで十分な場合 - 関連性のない2〜3個のアクションには、個別のボタンの方が適しています
- コントロールが関連していない場合 - Toolbarは論理的なグループ化を意味するため、関連性のないコントロールはユーザーを混乱させます
- 複雑なネストされたナビゲーション - 深い階層には、メニューやナビゲーションコンポーネントの方が適しています

## 機能 {#features}

Angularのツールバーは、以下の機能を備えた完全にアクセシブルなツールバーの実装を提供します：

- **Keyboard Navigation** - Navigate widgets with arrow keys, Home, and End using roving tabindex, while controls retain native activation
- **スクリーンリーダーのサポート** - 支援技術のための組み込みARIA属性
- **ウィジェットグループ** - ラジオボタングループやトグルボタングループのような関連ウィジェットを整理します
- **柔軟な向き** - 自動キーボードナビゲーションを備えた水平または垂直レイアウト
- **シグナルベースのリアクティビティ** - Angularシグナルを使用したリアクティブな状態管理
- **双方向テキストのサポート** - 右から左へ記述する言語（RTL）を自動的に処理します
- **設定可能なフォーカス** - ラップアラウンドナビゲーションまたは端でのハードストップを選択できます

## 例

### 基本的な水平ツールバー {#basic-horizontal-toolbar}

水平ツールバーは、テキストエディターやデザインツールで一般的なパターンに合わせて、コントロールを左から右に整理します。矢印キーでウィジェット間を移動し、ユーザーがTabキーを押して次のページ要素に移動するまで、ツールバー内にフォーカスを維持します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 垂直ツールバー {#vertical-toolbar}

垂直ツールバーは、コントロールを上から下に積み重ねるため、サイドパネルや垂直コマンドパレットに便利です。上下の矢印キーでウィジェット間を移動します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### ウィジェットグループ {#widget-groups}

Widget groups organize related controls that work together, such as text alignment options or formatting toggles. Groups maintain roving tabindex navigation while presenting the appropriate semantic structure to assistive technologies.

In the examples above, the alignment buttons are wrapped in `ngToolbarWidgetGroup` with `role="radiogroup"`. Selection is decoupled from the toolbar container, allowing you to manage state using Angular signals or custom directives:

```angular-html
<!-- Mutually exclusive radio group -->
<div ngToolbarWidgetGroup role="radiogroup" aria-label="Alignment">
  <button
    ngToolbarWidget
    role="radio"
    type="button"
    [attr.aria-checked]="alignment() === 'left'"
    (click)="alignment.set('left')"
  >
    Left
  </button>
  <button
    ngToolbarWidget
    role="radio"
    type="button"
    [attr.aria-checked]="alignment() === 'center'"
    (click)="alignment.set('center')"
  >
    Center
  </button>
  <button
    ngToolbarWidget
    role="radio"
    type="button"
    [attr.aria-checked]="alignment() === 'right'"
    (click)="alignment.set('right')"
  >
    Right
  </button>
</div>

<!-- Toggle button group -->
<div class="group" role="group" aria-label="Text styling">
  <button ngToolbarWidget type="button" [attr.aria-pressed]="bold()" (click)="bold.set(!bold())">
    Bold
  </button>
  <button
    ngToolbarWidget
    type="button"
    [attr.aria-pressed]="italic()"
    (click)="italic.set(!italic())"
  >
    Italic
  </button>
</div>
```

### 無効化されたウィジェット {#disabled-widgets}

ツールバーは2つの無効化モードをサポートしています:

1. **ソフト無効化**されたウィジェットはフォーカス可能ですが、視覚的には利用不可であることを示します
2. **ハード無効化**されたウィジェットは、キーボードナビゲーションから完全に削除されます。

デフォルトでは、`softDisabled`は`true`であり、無効化されたウィジェットがフォーカスを受け取ることができます。ハード無効化モードを有効にしたい場合は、ツールバーで`[softDisabled]="false"`を設定します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 右から左 (RTL) のサポート {#right-to-left-rtl-support}

ツールバーは、右から左に記述する言語を自動的にサポートします。ツールバーを`dir="rtl"`を持つコンテナでラップすると、レイアウトとキーボードナビゲーションの方向が逆になります。矢印キーのナビゲーションは自動的に調整され、左矢印キーは次のウィジェットに、右矢印キーは前のウィジェットに移動します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Testing

Angular Aria provides component harnesses for testing toolbar components.
Here is an example of how to use the harnesses in a component test:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ToolbarHarness} from '@angular/aria/toolbar/testing';
import {MyToolbarComponent} from './my-toolbar'; // Your component

describe('MyToolbarComponent', () => {
  let fixture: ComponentFixture<MyToolbarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyToolbarComponent],
    });

    fixture = TestBed.createComponent(MyToolbarComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should have widgets and update toggle state on click', async () => {
    // Load the toolbar harness
    const toolbar = await loader.getHarness(ToolbarHarness);

    // Get all widgets
    const widgets = await toolbar.getWidgets();
    expect(widgets.length).toBe(3);

    // Click the first widget
    await widgets[0].click();

    // Verify pressed state updated via click handler
    expect(await widgets[0].isSelected()).toBe(true);
  });
});
```

## APIリファレンス {#api-reference}

詳細なAPIドキュメントについては、以下のAPIリファレンスを参照してください。

- [`Toolbar`](/api/aria/toolbar/Toolbar)
- [`ToolbarWidget`](/api/aria/toolbar/ToolbarWidget)
- [`ToolbarWidgetGroup`](/api/aria/toolbar/ToolbarWidgetGroup)
