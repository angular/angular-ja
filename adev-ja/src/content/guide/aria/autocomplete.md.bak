<docs-decorative-header title="オートコンプリート">
</docs-decorative-header>

## 概要 {#overview}

ユーザーが入力するにつれてオプションをフィルタリングして提案し、リストから値を見つけて選択するのに役立つ、アクセシブルな入力フィールドです。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使用法 {#usage}

オートコンプリートは、タイピングがスクロールよりも速い大規模なオプションのセットからユーザーが選択する必要がある場合に最適です。次のような場合にオートコンプリートの使用を検討してください:

- **オプションリストが長い** (20項目以上) - タイピングすることで、ドロップダウンをスクロールするよりも速く選択肢を絞り込めます
- **ユーザーが探しているものを知っている** - 期待される値の一部を入力できます (州名、製品名、ユーザー名など)
- **オプションが予測可能なパターンに従っている** - ユーザーが部分一致を推測できます (国コード、メールドメイン、カテゴリーなど)
- **スピードが重要である** - フォームは、広範なナビゲーションなしで迅速に選択できるというメリットがあります

次のような場合はオートコンプリートを避けてください:

- リストのオプションが10個未満の場合 - 通常のドロップダウンやラジオグループの方が視認性が高いためです
- ユーザーがオプションを閲覧する必要がある場合 - 発見が重要である場合は、すべてのオプションを最初から表示します
- オプションが馴染みのないものである場合 - ユーザーはリストに存在することを知らないものを入力できないためです

## 機能 {#features}

Angularのオートコンプリートは、以下の機能を備えた、完全にアクセシブルなコンボボックスの実装を提供します：

- **キーボードナビゲーション** - 矢印キーでオプションを移動し、Enterで選択、Escapeで閉じます
- **スクリーンリーダーのサポート** - 支援技術のための組み込みARIA属性
- **3つのフィルターモード** - 自動選択、手動選択、またはハイライト表示の動作から選択できます
- **シグナルベースのリアクティビティ** - Angularシグナルを使用したリアクティブな状態管理
- **Popover APIとの統合** - ネイティブのHTML Popover APIを活用し、最適な配置を実現します
- **双方向テキストのサポート** - 右から左へ記述する言語（RTL）に自動的に対応します

## 例

### 自動選択モード {#auto-select-mode}

ユーザーがテキストの一部を入力すると、その入力が利用可能なオプションと一致することの即時確認が期待されます。自動選択モードは、ユーザーが入力するにつれて、フィルタリングされた最初のオプションに一致するように入力値を更新し、必要なキーストロークの数を減らし、検索が正しい方向に向かっていることを即座にフィードバックします。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### 手動選択モード {#manual-selection-mode}

手動選択モードでは、ユーザーが候補リストをナビゲートしている間、入力されたテキストは変更されず、自動更新による混乱を防ぎます。入力は、ユーザーがEnterキーまたはクリックで明示的に選択を確定した場合にのみ変更されます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### ハイライトモード {#highlight-mode}

ハイライトモードでは、ユーザーは矢印キーでオプションをナビゲートできますが、Enterキーまたはクリックで明示的に新しいオプションを選択するまで、閲覧中に入力値は変更されません。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## API

### Comboboxディレクティブ {#combobox-directive}

`ngCombobox`ディレクティブは、オートコンプリート機能のためのコンテナを提供します。

#### 入力 {#inputs}

| プロパティ   | 型                                             | デフォルト | 説明                                                 |
| ------------ | ---------------------------------------------- | ---------- | ---------------------------------------------------- |
| `filterMode` | `'auto-select'` \| `'manual'` \| `'highlight'` | `'manual'` | 選択の動作を制御します                               |
| `disabled`   | `boolean`                                      | `false`    | コンボボックスを無効にします                         |
| `firstMatch` | `string`                                       | -          | ポップアップ内で最初に一致したアイテムの値を表します |

#### 出力 {#outputs}

| プロパティ | 型                | 説明                                                 |
| ---------- | ----------------- | ---------------------------------------------------- |
| `expanded` | `Signal<boolean>` | ポップアップが現在開いているかどうかを示すSignalです |

### ComboboxInputディレクティブ {#comboboxinput-directive}

`ngComboboxInput`ディレクティブは、input要素をコンボボックスに接続します。

#### モデル {#model}

| プロパティ | 型       | 説明                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| `value`  | `string` | `[(value)]`を使用した、inputの双方向バインディング可能な文字列値です |

### ComboboxPopupContainerディレクティブ {#comboboxpopupcontainer-directive}

`ngComboboxPopupContainer`ディレクティブは、ポップアップのコンテンツをラップし、その表示を管理します。

popover要素内の`<ng-template>`と共に使用する必要があります。

### 関連コンポーネント {#related-components}

オートコンプリートは、候補リストをレンダリングするために[Listbox](/api/aria/listbox/Listbox)と[Option](/api/aria/listbox/Option)ディレクティブを使用します。追加のカスタマイズオプションについては、[Listboxのドキュメント](/guide/aria/listbox)を参照してください。
