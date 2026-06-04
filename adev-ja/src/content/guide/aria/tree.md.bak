<docs-decorative-header title="ツリー">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" title="ツリーARIAパターン"/>
  <docs-pill href="/api/aria/tree/Tree" title="ツリーAPIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

ツリーは、アイテムを展開して子を表示したり、折りたたんで非表示にしたりできる階層データを表示します。ユーザーは矢印キーで移動し、ノードを展開・折りたたみ、ナビゲーションやデータ選択のシナリオのためにアイテムを選択できます。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
</docs-code-multifile>

## 使用法 {#usage}

ツリーは、ユーザーがネストされた構造をナビゲートする必要がある階層データを表示するのに適しています。

**ツリーを使用する場合:**

- ファイルシステムのナビゲーションを構築する
- フォルダーとドキュメントの階層を表示する
- ネストされたメニュー構造を作成する
- 組織図を表示する
- 階層データを閲覧する
- ネストされたセクションを持つサイトナビゲーションを実装する

**ツリーを避ける場合:**

- フラットなリストを表示する場合（代わりに[Listbox](guide/aria/listbox)を使用）
- データテーブルを表示する場合（代わりに[Grid](guide/aria/grid)を使用）
- シンプルなドロップダウンを作成する場合（代わりに[Select](guide/aria/select)を使用）
- パンくずナビゲーションを構築する場合（パンくずパターンを使用）

## 機能 {#features}

- **階層ナビゲーション** - 展開・折りたたみ機能付きのネストされたツリー構造
- **選択モード** - 明示的またはフォーカス追従動作による単一選択または複数選択
- **フォーカス追従選択** - フォーカス変更時に任意で自動選択
- **キーボードナビゲーション** - 矢印キー、Home、End、先行入力による検索
- **展開/折りたたみ** - 右/左矢印キーまたはEnterキーで親ノードを切り替え
- **無効化されたアイテム** - フォーカス管理付きで特定のノードを無効化
- **フォーカスモード** - Roving tabindexまたはactivedescendantフォーカス戦略
- **RTLサポート** - 右から左へ記述する言語のナビゲーション

## 例

### ナビゲーションツリー {#navigation-tree}

アイテムを選択するのではなく、クリックすることでアクションをトリガーするナビゲーションにはツリーを使用します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[nav]="true"`を設定してナビゲーションモードを有効にします。これにより、選択の代わりに`aria-current`を使用して現在のページを示します。

### 単一選択 {#single-selection}

ユーザーがツリーから1つのアイテムを選択するシナリオでは、単一選択を有効にします。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

単一選択の場合は、`[multi]="false"`（デフォルト）のままにします。ユーザーはSpaceキーを押してフォーカスされているアイテムを選択します。

### 複数選択 {#multi-selection}

ユーザーがツリーから複数のアイテムを選択できるようにします。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

ツリーに`[multi]="true"`を設定します。ユーザーはSpaceキーで個別にアイテムを選択するか、Shift+矢印キーで範囲を選択します。

### フォーカスに追従する選択 {#selection-follows-focus}

選択がフォーカスに追従する場合、フォーカスされたアイテムは自動的に選択されます。これにより、ナビゲーションシナリオでのインタラクションが簡素化されます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

ツリーに`[selectionMode]="'follow'"`を設定します。ユーザーが矢印キーでナビゲートすると、選択が自動的に更新されます。

### 無効化されたツリーアイテム {#disabled-tree-items}

特定のツリーノードを無効にして、インタラクションを防ぎます。無効化されたアイテムがフォーカスを受け取れるかどうかを制御します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

ツリーで`[softDisabled]="true"`の場合、無効化されたアイテムはフォーカスを受け取ることができますが、アクティブ化または選択できません。`[softDisabled]="false"`の場合、無効化されたアイテムはキーボードナビゲーション中にスキップされます。

## API {#apis}

### Tree {#tree}

階層的なナビゲーションと選択を管理するコンテナディレクティブです。

#### Inputs {#inputs}

| プロパティ      | 型                               | デフォルト   | 説明                                                          |
| --------------- | -------------------------------- | ------------ | ------------------------------------------------------------- |
| `disabled`      | `boolean`                        | `false`      | ツリー全体を無効にします                                      |
| `softDisabled`  | `boolean`                        | `true`       | `true`の場合、無効化されたアイテムはフォーカス可能ですが、インタラクティブではありません |
| `multi`         | `boolean`                        | `false`      | 複数アイテムの選択が可能かどうか                                |
| `selectionMode` | `'explicit' \| 'follow'`         | `'explicit'` | 選択に明示的なアクションが必要か、フォーカスに追従するかどうか  |
| `nav`           | `boolean`                        | `false`      | ツリーがナビゲーションモードであるかどうか（`aria-current`を使用） |
| `wrap`          | `boolean`                        | `true`       | キーボードナビゲーションが最後のアイテムから最初のアイテムにラップするかどうか |
| `focusMode`     | `'roving' \| 'activedescendant'` | `'roving'`   | ツリーで使用されるフォーカス戦略                              |
| `values`        | `any[]`                          | `[]`         | 選択されたアイテムの値（双方向バインディングをサポート）      |

#### メソッド {#methods}

| メソッド         | パラメータ | 説明                                          |
| ---------------- | ---------- | --------------------------------------------- |
| `expandAll`      | none       | すべてのツリーノードを展開します                      |
| `collapseAll`    | none       | すべてのツリーノードを折りたたみます                  |
| `selectAll`      | none       | すべてのアイテムを選択します（複数選択モードのみ）    |
| `clearSelection` | none       | すべての選択をクリアします                            |

### TreeItem {#treeitem}

子ノードを含むことができるツリー内の個々のノードです。

#### Inputs {#inputs}

| プロパティ | 型        | デフォルト | 説明                                                    |
| ---------- | --------- | ------- | ------------------------------------------------------- |
| `value`    | `any`     | —       | **必須。** このツリーアイテムの一意な値                   |
| `disabled` | `boolean` | `false` | このアイテムを無効にします                                |
| `expanded` | `boolean` | `false` | ノードが展開されているかどうか（双方向バインディングをサポート） |

#### シグナル {#signals}

| プロパティ    | 型                | 説明                                 |
| ------------- | ----------------- | ------------------------------------ |
| `selected`    | `Signal<boolean>` | アイテムが選択されているかどうか             |
| `active`      | `Signal<boolean>` | アイテムが現在フォーカスを持っているかどうか   |
| `hasChildren` | `Signal<boolean>` | アイテムが子ノードを持っているかどうか         |

#### メソッド {#methods}

| メソッド   | パラメータ | 説明                        |
| ---------- | ---------- | --------------------------- |
| `expand`   | none       | このノードを展開します            |
| `collapse` | none       | このノードを折りたたみます        |
| `toggle`   | none       | 展開状態を切り替えます            |

### TreeGroup {#treegroup}

子ツリーアイテムのコンテナです。

このディレクティブには、入力、出力、メソッドはありません。子`ngTreeItem`要素を整理するためのコンテナとして機能します:

```angular-html
<li ngTreeItem value="parent">
  Parent Item
  <ul ngTreeGroup>
    <li ngTreeItem value="child1">Child 1</li>
    <li ngTreeItem value="child2">Child 2</li>
  </ul>
</li>
```
