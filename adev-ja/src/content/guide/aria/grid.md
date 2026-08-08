<docs-decorative-header title="グリッド">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="グリッドARIAパターン"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="グリッドAPIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

グリッドを使用すると、ユーザーは方向矢印キー、Home、End、Page Up/Downを使用して2次元データやインタラクティブな要素をナビゲートできます。グリッドは、データテーブル、カレンダー、スプレッドシート、および関連するインタラクティブな要素をグループ化するレイアウトパターンで機能します。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## 使用法 {#usage}

グリッドは、ユーザーが複数の方向へのキーボードナビゲーションを必要とする、行と列で構成されたデータやインタラクティブな要素に適しています。

**次の場合にグリッドを使用します:**

- 編集可能または選択可能なセルを持つインタラクティブなデータテーブルを構築する場合
- カレンダーや日付ピッカーを作成する場合
- スプレッドシートのようなインターフェースを実装する場合
- ページのタブストップを減らすために、インタラクティブな要素（ボタン、チェックボックス）をグループ化する場合
- 2次元のキーボードナビゲーションを必要とするインターフェースを構築する場合

**次の場合にグリッドの使用を避けます:**

- 単純な読み取り専用のテーブルを表示する場合（代わりにセマンティックなHTMLの`<table>`を使用します）
- 単一列のリストを表示する場合（代わりに[Listbox](guide/aria/listbox)を使用します）
- 階層データを表示する場合（代わりに[Tree](guide/aria/tree)を使用します）
- 表形式のレイアウトではないフォームを構築する場合（標準のフォームコントロールを使用します）

## 機能 {#features}

- **2次元ナビゲーション** - 矢印キーですべての方向にセル間を移動
- **フォーカスモード** - roving tabindexまたはactivedescendantのフォーカス戦略から選択
- **選択のサポート** - 単一または複数選択モードによるオプションのセル選択
- **折り返し動作** - グリッドの端でナビゲーションがどのように折り返すかを設定 (continuous、loop、またはnowrap)
- **範囲選択** - 修飾キーまたはドラッグで複数のセルを選択
- **無効状態** - グリッド全体または個々のセルを無効化
- **RTLサポート** - 右から左へ記述する言語の自動ナビゲーション

## 例 {#examples}

### データテーブルグリッド {#data-table-grid}

ユーザーが矢印キーを使ってセル間を移動する必要があるインタラクティブなテーブルには、グリッドを使用します。この例は、キーボードナビゲーションを備えた基本的なデータテーブルを示しています。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngGrid`ディレクティブをテーブル要素に、`ngGridRow`を各行に、`ngGridCell`を各セルに適用します。

### カレンダーグリッド {#calendar-grid}

カレンダーはグリッドの一般的なユースケースです。この例は、ユーザーが矢印キーを使って日付を移動する月表示を示しています。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

ユーザーは、セルにフォーカスが当たっているときにEnterキーまたはSpaceキーを押すことで、日付をアクティブにできます。

### レイアウトグリッド {#layout-grid}

レイアウトグリッドを使用して、インタラクティブな要素をグループ化し、タブストップを減らします。この例は、ピルボタンのグリッドを示しています。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

各ボタンをタブで移動する代わりに、ユーザーは矢印キーで移動し、1つのボタンのみがタブフォーカスを受け取ります。

### 選択とフォーカスモード {#selection-and-focus-modes}

`[enableSelection]="true"`で選択を有効にし、フォーカスと選択がどのように相互作用するかを設定します。

```angular-html
<table
  ngGrid
  [enableSelection]="true"
  [selectionMode]="'explicit'"
  [multi]="true"
  [focusMode]="'roving'"
>
  <tr ngGridRow>
    <td ngGridCell>Cell 1</td>
    <td ngGridCell>Cell 2</td>
  </tr>
</table>
```

**選択モード:**

- `follow`: フォーカスされたセルが自動的に選択されます
- `explicit`: ユーザーがSpaceキーまたはクリックでセルを選択します

**フォーカスモード:**

- `roving`: `tabindex`を使用してフォーカスがセルに移動します（単純なグリッドに適しています）
- `activedescendant`: フォーカスはグリッドコンテナに留まり、`aria-activedescendant`がアクティブなセルを示します（仮想スクロールに適しています）

## Testing

Angular Aria provides component harnesses for testing grid components.
Here is an example of how to use the harnesses in a component test:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {GridHarness} from '@angular/aria/grid/testing';
import {MyGridComponent} from './my-grid'; // Your component

describe('MyGridComponent', () => {
  let fixture: ComponentFixture<MyGridComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyGridComponent],
    });

    fixture = TestBed.createComponent(MyGridComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should read cell values and focus cells', async () => {
    const grid = await loader.getHarness(GridHarness);

    // Get all cells text in a 2D array organized by rows
    const cellTexts = await grid.getCellTextByIndex();
    expect(cellTexts).toEqual([
      ['Cell 1.1', 'Cell 1.2'],
      ['Cell 2.1', 'Cell 2.2'],
    ]);

    // Get a specific cell by text
    const cells = await grid.getCells({text: 'Cell 1.1'});
    expect(cells.length).toBe(1);
    const cell = cells[0];

    // Verify cell state
    expect(await cell.isSelected()).toBe(true);
    expect(await cell.isActive()).toBe(true);

    // Focus the cell
    await cell.focus();
    expect(await cell.isFocused()).toBe(true);
  });
});
```

## API reference {#api-reference}

詳細なAPIドキュメントについては、以下のAPIリファレンスを参照してください。

- [`Grid`](/api/aria/grid/Grid)
- [`GridRow`](/api/aria/grid/GridRow)
- [`GridCell`](/api/aria/grid/GridCell)
- [`GridCellWidget`](/api/aria/grid/GridCellWidget)
