<docs-decorative-header title="アコーディオン">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="アコーディオンARIAパターン"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="アコーディオンAPIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

アコーディオンは、関連するコンテンツを展開・折りたたみ可能なセクションに整理し、ページのスクロールを減らし、ユーザーが関連情報に集中するのを助けます。各セクションには、トリガーボタンとコンテンツパネルがあります。トリガーをクリックすると、関連するパネルの表示/非表示が切り替わります。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## 使い方 {#usage}

アコーディオンは、ユーザーが通常一度に1つのセクションを表示する必要がある場合に、コンテンツを論理的なグループに整理するのに適しています。

**アコーディオンを使用する場合:**

- 複数の質問と回答を持つFAQを表示する
- 長いフォームを管理しやすいセクションに整理する
- コンテンツの多いページでのスクロールを減らす
- 関連情報を段階的に開示する

**アコーディオンを避けるべき場合:**

- ナビゲーションメニューを構築する（代わりに[Menu](guide/aria/menu)コンポーネントを使用してください）
- タブ付きインターフェースを作成する（代わりに[Tabs](guide/aria/tabs)コンポーネントを使用してください）
- 単一の折りたたみ可能なセクションを表示する（代わりにdisclosureパターンを使用してください）
- ユーザーが複数のセクションを同時に見る必要がある（異なるレイアウトを検討してください）

## 機能 {#features}

- **展開モード** - 一度に1つまたは複数のパネルを開けるかどうかを制御します
- **キーボードナビゲーション** - 矢印キー、Home、Endを使用してトリガー間を移動します
- **遅延レンダリング** - コンテンツはパネルが最初に展開されたときにのみ作成され、初期読み込みのパフォーマンスを向上させます
- **無効状態** - グループ全体または個々のトリガーを無効にします
- **フォーカス管理** - 無効化されたアイテムがキーボードフォーカスを受け取れるかどうかを制御します
- **プログラムによる制御** - コンポーネントのコードからパネルを展開、折りたたみ、または切り替えます
- **RTLサポート** - 右から左へ記述する言語を自動的にサポートします

## 例 {#examples}

### 単一展開モード {#single-expansion-mode}

`[multiExpandable]="false"`を設定すると、一度に開けるパネルが1つだけになります。新しいパネルを開くと、以前に開いていたパネルは自動的に閉じます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

このモードは、FAQや、ユーザーに一度に1つの回答に集中してもらいたい場合に適しています。

### 複数展開モード {#multiple-expansion-mode}

`[multiExpandable]="true"`を設定すると、複数のパネルを同時に開くことができます。ユーザーは他のパネルを閉じることなく、必要なだけパネルを展開できます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

このモードは、フォームのセクションや、ユーザーが複数のパネルにわたるコンテンツを比較する必要がある場合に便利です。

NOTE: `multiExpandable`入力はデフォルトで`true`です。単一展開の動作が必要な場合は、明示的に`false`に設定してください。

### 無効化されたアコーディオンアイテム {#disabled-accordion-items}

`disabled`入力を使用して特定のトリガーを無効にします。アコーディオンのグループで`softDisabled`入力を使用し、キーボードナビゲーション中に無効化されたアイテムの動作を制御します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[softDisabled]="true"`（デフォルト）の場合、無効化されたアイテムはフォーカスを受け取れますが、アクティブにはできません。`[softDisabled]="false"`の場合、無効化されたアイテムはキーボードナビゲーション中に完全にスキップされます。

### コンテンツの遅延レンダリング {#lazy-content-rendering}

`ngAccordionContent`ディレクティブを`ng-template`で使用すると、パネルが最初に展開されるまでコンテンツのレンダリングを遅延させることができます。これにより、画像、チャート、または複雑なコンポーネントなどの重いコンテンツを持つアコーディオンのパフォーマンスが向上します。

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger panelId="item-1">
      Trigger Text
    </button>
    <div ngAccordionPanel panelId="item-1">
      <ng-template ngAccordionContent>
        <!-- このコンテンツは、パネルが最初に開かれたときにのみレンダリングされます -->
        <img src="large-image.jpg" alt="Description">
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

デフォルトでは、パネルが折りたたまれた後もコンテンツはDOMに残ります。パネルが閉じたときにDOMからコンテンツを削除するには、`[preserveContent]="false"`を設定します。

## API

### AccordionGroup {#accordiongroup}

アコーディオンアイテムのグループのキーボードナビゲーションと展開動作を管理するコンテナディレクティブです。

#### Inputs {#inputs}

| プロパティ        | 型        | デフォルト | 説明                                                                      |
| ----------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled`        | `boolean` | `false` | グループ内のすべてのトリガーを無効にします                                |
| `multiExpandable` | `boolean` | `true`  | 複数のパネルを同時に展開できるかどうか                                    |
| `softDisabled`    | `boolean` | `true`  | `true`の場合、無効化されたアイテムはフォーカス可能です。`false`の場合、スキップされます |
| `wrap`            | `boolean` | `false` | キーボードナビゲーションが最後のアイテムから最初のアイテムへ、またはその逆にラップするかどうか |

#### Methods {#methods}

| メソッド      | パラメータ | 説明                                                             |
| ------------- | ---------- | ---------------------------------------------------------------- |
| `expandAll`   | none       | すべてのパネルを展開します（`multiExpandable`が`true`の場合のみ機能します） |
| `collapseAll` | none       | すべてのパネルを折りたたみます                                     |

### AccordionTrigger {#accordiontrigger}

パネルの表示/非表示を切り替えるボタン要素に適用されるディレクティブです。

#### Inputs {#inputs}

| プロパティ | 型        | デフォルト | 説明                                                           |
| ---------- | --------- | ------- | -------------------------------------------------------------- |
| `id`       | `string`  | auto    | トリガーの一意の識別子                                         |
| `panelId`  | `string`  | —       | **必須。**関連付けられたパネルの`panelId`と一致する必要があります |
| `disabled` | `boolean` | `false` | このトリガーを無効にします                                     |
| `expanded` | `boolean` | `false` | パネルが展開されているかどうか（双方向バインディングをサポート） |

#### シグナル {#signals}

| プロパティ | 型                | 説明                                    |
| -------- | ----------------- | --------------------------------------- |
| `active` | `Signal<boolean>` | トリガーが現在フォーカスを持っているかどうか    |

#### Methods {#methods}

| メソッド   | パラメータ | 説明                              |
| ---------- | ---------- | --------------------------------- |
| `expand`   | none       | 関連付けられたパネルを展開します      |
| `collapse` | none       | 関連付けられたパネルを折りたたみます    |
| `toggle`   | none       | パネルの展開状態を切り替えます        |

### AccordionPanel {#accordionpanel}

折りたたみ可能なコンテンツを含む要素に適用されるディレクティブです。

#### Inputs {#inputs}

| プロパティ        | 型        | デフォルト | 説明                                                             |
| ----------------- | --------- | ------- | ---------------------------------------------------------------- |
| `id`              | `string`  | auto    | パネルの一意の識別子                                             |
| `panelId`         | `string`  | —       | **必須。**関連付けられたトリガーの`panelId`と一致する必要があります |
| `preserveContent` | `boolean` | `true`  | パネルが折りたたまれた後もコンテンツをDOMに保持するかどうか      |

#### シグナル {#signals}

| プロパティ | 型                | 説明                                    |
| --------- | ----------------- | --------------------------------------- |
| `visible` | `Signal<boolean>` | パネルが現在展開されているかどうか        |

#### Methods {#methods}

| メソッド   | パラメータ | 説明                        |
| ---------- | ---------- | --------------------------- |
| `expand`   | none       | このパネルを展開します          |
| `collapse` | none       | このパネルを折りたたみます        |
| `toggle`   | none       | 展開状態を切り替えます          |

### AccordionContent {#accordioncontent}

遅延レンダリングを有効にするために、アコーディオンパネル内の`ng-template`に適用される構造ディレクティブです。

このディレクティブには、input、output、メソッドはありません。`ng-template`要素に適用してください:

```angular-html
<div ngAccordionPanel panelId="item-1">
  <ng-template ngAccordionContent>
    <!-- Content here is lazily rendered -->
  </ng-template>
</div>
```
