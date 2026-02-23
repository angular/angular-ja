<docs-decorative-header title="メニュー">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="メニューARIAパターン"/>
  <docs-pill href="/api/aria/menu/Menu" title="Menu APIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

メニューは、ユーザーにアクションやオプションのリストを提供し、通常はボタンのクリックや右クリックに応じて表示されます。メニューは、矢印キーによるキーボードナビゲーション、サブメニュー、チェックボックス、ラジオボタン、無効化されたアイテムをサポートしています。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

メニューは、ユーザーが選択できるアクションやコマンドのリストを提示するのに適しています。

**メニューを使用する場合:**

- アプリケーションのコマンドメニュー(File、Edit、View)を構築する場合
- コンテキストメニュー(右クリックアクション)を作成する場合
- ドロップダウンのアクションリストを表示する場合
- ツールバーのドロップダウンを実装する場合
- 設定やオプションを整理する場合

**メニューを避けるべき場合:**

- サイトナビゲーションを構築する場合(代わりにナビゲーションランドマークを使用してください)
- フォームのセレクトを作成する場合([Select](guide/aria/select)コンポーネントを使用してください)
- コンテンツパネルを切り替える場合([Tabs](guide/aria/tabs)を使用してください)
- 折りたたみ可能なコンテンツを表示する場合([Accordion](guide/aria/accordion)を使用してください)

## 機能 {#features}

- **キーボードナビゲーション** - 矢印キー、Home/End、文字検索による効率的なナビゲーション
- **サブメニュー** - 自動配置の機能を備えたネストされたメニューのサポート
- **メニュータイプ** - スタンドアロンメニュー、トリガーメニュー、メニューバー
- **チェックボックスとラジオボタン** - トグルおよび選択メニューアイテム
- **無効化されたアイテム** - フォーカス管理を備えたソフトまたはハードな無効状態
- **自動クローズ動作** - 選択時に閉じる設定が可能
- **RTLサポート** - 右から左へ記述する言語のナビゲーション

## 例 {#examples}

### トリガー付きメニュー {#menu-with-trigger}

トリガーボタンとメニューを組み合わせることで、ドロップダウンメニューを作成します。トリガーはメニューを開閉します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

ユーザーがアイテムを選択するかEscapeキーを押すと、メニューは自動的に閉じます。

### コンテキストメニュー {#context-menu}

コンテキストメニューは、ユーザーが要素を右クリックしたときにカーソル位置に表示されます。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.html"/>
</docs-code-multifile>

`contextmenu`イベントの座標を使用してメニューを配置します。

### スタンドアロンメニュー {#standalone-menu}

スタンドアロンメニューはトリガーを必要とせず、インターフェース上で常に表示されたままになります。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

スタンドアロンメニューは、常に表示されるアクションリストやナビゲーションに適しています。

### 無効化されたメニューアイテム {#disabled-menu-items}

`disabled`入力を使用して特定のメニューアイテムを無効にします。`softDisabled`でフォーカスの動作を制御します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[softDisabled]="true"`の場合、無効化されたアイテムはフォーカスを受け取ることができますが、アクティブにできません。`[softDisabled]="false"`の場合、無効化されたアイテムはキーボードナビゲーション中にスキップされます。

## API {#apis}

### Menu {#menu}

メニューアイテムのコンテナディレクティブです。

#### 入力 {#inputs}

| Property       | Type      | Default | Description                                                   |
| -------------- | --------- | ------- | ------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | メニュー内のすべてのアイテムを無効にします |
| `wrap`         | `boolean` | `true`  | キーボードナビゲーションが端で折り返すかどうか |
| `softDisabled` | `boolean` | `true`  | `true`の場合、無効化されたアイテムはフォーカス可能ですが、インタラクティブではありません |

#### メソッド {#methods}

| Method  | Parameters | Description     |
| ------- | ---------- | --------------- |
| `close` | none       | メニューを閉じます |

### MenuBar {#menubar}

複数のメニューを格納する水平コンテナです。

#### 入力 {#inputs}

| Property       | Type      | Default | Description                                                   |
| -------------- | --------- | ------- | ------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | メニューバー全体を無効にします |
| `wrap`         | `boolean` | `true`  | キーボードナビゲーションが端で折り返すかどうか |
| `softDisabled` | `boolean` | `true`  | `true`の場合、無効化されたアイテムはフォーカス可能ですが、インタラクティブではありません |

### MenuItem {#menuitem}

メニュー内の個々のアイテムです。

#### 入力 {#inputs}

| Property     | Type      | Default | Description                                          |
| ------------ | --------- | ------- | ---------------------------------------------------- |
| `value`      | `any`     | —       | **必須。** このアイテムの値です |
| `disabled`   | `boolean` | `false` | このメニューアイテムを無効にします |
| `submenu`    | `Menu`    | —       | サブメニューへの参照です |
| `searchTerm` | `string`  | `''`    | タイプアヘッドの検索語です（双方向バインディングをサポート） |

#### シグナル {#signals}

| Property   | Type              | Description                                |
| ---------- | ----------------- | ------------------------------------------ |
| `active`   | `Signal<boolean>` | アイテムが現在フォーカスを持っているかどうか |
| `expanded` | `Signal<boolean>` | サブメニューが展開されているかどうか |
| `hasPopup` | `Signal<boolean>` | アイテムに関連付けられたサブメニューがあるかどうか |

NOTE: MenuItemはパブリックメソッドを公開しません。`submenu`入力を使用して、サブメニューをメニューアイテムに関連付けます。

### MenuTrigger {#menutrigger}

メニューを開くボタンまたは要素です。

#### 入力 {#inputs}

| Property       | Type      | Default | Description                                |
| -------------- | --------- | ------- | ------------------------------------------ |
| `menu`         | `Menu`    | —       | **必須。** トリガーするメニューです |
| `disabled`     | `boolean` | `false` | トリガーを無効にします |
| `softDisabled` | `boolean` | `true`  | `true`の場合、無効化されたトリガーはフォーカス可能です |

#### シグナル {#signals}

| Property   | Type              | Description                                |
| ---------- | ----------------- | ------------------------------------------ |
| `expanded` | `Signal<boolean>` | メニューが現在開いているかどうか |
| `hasPopup` | `Signal<boolean>` | トリガーに関連付けられたメニューがあるかどうか |

#### メソッド {#methods}

| Method   | Parameters | Description                  |
| -------- | ---------- | ---------------------------- |
| `open`   | none       | メニューを開きます |
| `close`  | none       | メニューを閉じます |
| `toggle` | none       | メニューの開閉を切り替えます |
