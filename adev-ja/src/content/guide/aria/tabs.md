<docs-decorative-header title="タブ">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" title="タブのARIAパターン"/>
  <docs-pill href="/api/aria/tabs/Tabs" title="Tabs APIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

タブは、一度に1つのパネルのみが表示される階層化されたコンテンツセクションを表示します。ユーザーは、タブボタンをクリックするか、矢印キーを使用してタブリストをナビゲートすることで、パネルを切り替えます。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

タブは、ユーザーが異なるビューやカテゴリーを切り替える際に、関連するコンテンツを個別のセクションに整理するのに適しています。

**タブを使用する場合：**

- 関連するコンテンツを個別のセクションに整理する
- 複数のカテゴリーを持つ設定パネルを作成する
- 複数のトピックを持つドキュメントを構築する
- 異なるビューを持つダッシュボードを実装する
- ユーザーがコンテキストを切り替える必要があるコンテンツを表示する

**タブを避ける場合：**

- シーケンシャルなフォームやウィザードを構築する（ステッパーパターンを使用）
- ページ間をナビゲートする（ルーターナビゲーションを使用）
- 単一のコンテンツセクションを表示する（タブは不要）
- 7〜8個以上のタブがある（異なるレイアウトを検討）

## 機能 {#features}

- **選択モード** - フォーカス時にタブを自動的にアクティブにするか、手動でのアクティベーションを要求します
- **キーボードナビゲーション** - 矢印キー、Home、Endキーによる効率的なタブナビゲーション
- **向き** - 水平または垂直のタブリストレイアウト
- **遅延コンテンツ** - タブパネルは最初にアクティブになったときにのみレンダリングされます
- **無効化されたタブ** - フォーカス管理機能付きで個々のタブを無効化します
- **フォーカスモード** - roving tabindexまたはactivedescendantによるフォーカス戦略
- **RTLサポート** - 右から左へ記述する言語のナビゲーション

## 例 {#examples}

### フォーカスに追従する選択 {#selection-follows-focus}

フォーカスに追従する選択では、矢印キーで移動するとタブがすぐにアクティブになります。これにより、即座にフィードバックが得られ、軽量なコンテンツに適しています。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

この動作を有効にするには、タブリストに `[selectionMode]="'follow'"` を設定します。

### 手動でのアクティブ化 {#manual-activation}

手動でのアクティブ化では、矢印キーは選択されたタブを変更せずにタブ間でフォーカスを移動します。ユーザーはSpaceキーまたはEnterキーを押して、フォーカスされたタブをアクティブにします。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

重いコンテンツパネルで不要なレンダリングを避けるには、`[selectionMode]="'explicit'"` を使用します。

### 垂直タブ {#vertical-tabs}

設定パネルやナビゲーションサイドバーのようなインターフェースでは、タブを垂直に配置します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

タブリストに `[orientation]="'vertical'"` を設定します。ナビゲーションは上/下矢印キーに変わります。

### コンテンツの遅延レンダリング {#lazy-content-rendering}

`ng-template` で `ngTabContent` ディレクティブを使用すると、タブパネルが最初に表示されるまでレンダリングを遅延させることができます。

```angular-html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="tab1">Tab 1</li>
    <li ngTab value="tab2">Tab 2</li>
  </ul>

  <div ngTabPanel value="tab1">
    <ng-template ngTabContent>
      <!-- このコンテンツは、タブ1が最初に表示されたときにのみレンダリングされます -->
      <app-heavy-component />
    </ng-template>
  </div>

  <div ngTabPanel value="tab2">
    <ng-template ngTabContent>
      <!-- このコンテンツは、タブ2が最初に表示されたときにのみレンダリングされます -->
      <app-another-component />
    </ng-template>
  </div>
</div>
```

デフォルトでは、パネルが非表示になった後もコンテンツはDOMに残ります。パネルが非アクティブ化されたときにコンテンツを削除するには、`[preserveContent]="false"` を設定します。

### 無効化されたタブ {#disabled-tabs}

特定のタブを無効にして、ユーザーの操作を防ぎます。無効化されたタブがキーボードフォーカスを受け取れるかどうかを制御します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

タブリストで `[softDisabled]="true"` の場合、無効化されたタブはフォーカスを受け取れますが、アクティブにはできません。`[softDisabled]="false"` の場合、無効化されたタブはキーボードナビゲーション中にスキップされます。

## Testing

Angular Aria provides component harnesses for testing tabs components.
Here is an example of how to use the harnesses in a component test:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentHarness, HarnessLoader} from '@angular/cdk/testing';
import {TabsHarness} from '@angular/aria/tabs/testing';
import {MyTabsComponent} from './my-tabs'; // Your component

// A simple harness to help query content inside the tab panel
class TestContentHarness extends ComponentHarness {
  static hostSelector = '.test-content';
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}

describe('MyTabsComponent', () => {
  let fixture: ComponentFixture<MyTabsComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyTabsComponent],
    });

    fixture = TestBed.createComponent(MyTabsComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should switch tabs and scope panel queries', async () => {
    const tabs = await loader.getHarness(TabsHarness);

    // Get all tabs
    const tabItems = await tabs.getTabs();
    expect(tabItems.length).toBe(3);

    // Verify initial selection
    expect(await tabItems[0].isSelected()).toBe(true);
    expect(await tabItems[1].isSelected()).toBe(false);

    // Query content inside the active tab panel
    // TabHarness automatically scopes queries to its associated panel
    const content = await tabItems[0].getHarness(TestContentHarness);
    expect(await content.getText()).toBe('Content 1');

    // Switch to the second tab
    await tabItems[1].select();

    // Verify selection updated
    expect(await tabItems[0].isSelected()).toBe(false);
    expect(await tabItems[1].isSelected()).toBe(true);
  });
});
```

## API

### Tabs {#tabs}

タブリストとパネルを調整するコンテナディレクティブです。

このディレクティブには入力と出力がありません。`ngTabList`、`ngTab`、`ngTabPanel`ディレクティブのルートコンテナとして機能します。

### TabList {#tablist}

選択とキーボードナビゲーションを管理するタブボタンのコンテナです。

#### Inputs {#inputs}

| プロパティ      | 型                           | デフォルト     | 説明                                                               |
| --------------- | ---------------------------- | -------------- | ------------------------------------------------------------------ |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | タブリストのレイアウト方向                                         |
| `wrap`          | `boolean`                    | `false`        | キーボードナビゲーションが最後のタブから最初のタブにラップするかどうか |
| `softDisabled`  | `boolean`                    | `true`         | `true`の場合、無効化されたタブはフォーカス可能ですが、アクティブにはできません |
| `selectionMode` | `'follow' \| 'explicit'`         | `'follow'`     | タブがフォーカス時にアクティブになるか、明示的なアクティベーションが必要か |
| `focusMode`     | `'roving' \| 'activedescendant'` | `'roving'`     | Focus management strategy                                          |
| `selectedTab`   | `any`                            | —              | 現在選択されているタブの値（双方向バインディングをサポート）       |

### Tab {#tab}

個々のタブボタンです。

#### Inputs {#inputs}

| プロパティ   | 型        | デフォルト | 説明                                |
| ---------- | --------- | ------- | ----------------------------------- |
| `value`    | `any`     | —       | **必須。** このタブの一意な値       |
| `disabled` | `boolean` | `false` | このタブを無効化します              |

#### シグナル {#signals}

| プロパティ   | 型                | 説明                                |
| ---------- | ----------------- | ----------------------------------- |
| `selected` | `Signal<boolean>` | タブが現在選択されているかどうか    |
| `active`   | `Signal<boolean>` | タブが現在フォーカスを持っているかどうか |

### TabPanel {#tabpanel}

タブに関連付けられたコンテンツパネルです。

#### Inputs {#inputs}

| プロパティ        | 型        | デフォルト | 説明                                                       |
| ----------------- | --------- | ------- | ---------------------------------------------------------- |
| `value`           | `any`     | —       | **必須。** 関連付けられたタブの`value`と一致する必要があります |
| `preserveContent` | `boolean` | `true`  | 非アクティブ化後もパネルコンテンツをDOMに保持するかどうか    |

#### シグナル {#signals}

| プロパティ | 型                | 説明                           |
| --------- | ----------------- | ------------------------------ |
| `visible` | `Signal<boolean>` | パネルが現在表示されているかどうか |

### TabContent {#tabcontent}

タブパネルのコンテンツを遅延レンダリングするための構造ディレクティブです。

このディレクティブには入力、出力、メソッドはありません。タブパネル内の`ng-template`要素に適用します:

```angular-html
<div ngTabPanel value="tab1">
  <ng-template ngTabContent>
    <!-- ここのコンテンツは遅延レンダリングされます -->
  </ng-template>
</div>
```
