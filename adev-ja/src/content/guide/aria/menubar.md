<docs-decorative-header title="メニューバー">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="メニューバーARIAパターン"/>
  <docs-pill href="/api/aria/menu/Menu" title="Menu APIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

メニューバーは、アプリケーションメニューへの永続的なアクセスを提供する水平ナビゲーションバーです。メニューバーは、ファイル、編集、表示などの論理的なカテゴリーにコマンドを整理し、ユーザーがキーボードやマウスの操作を通じてアプリケーションの機能を発見し、実行するのに役立ちます。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="マテリアル">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

メニューバーは、アプリケーションのコマンドを永続的で発見しやすいナビゲーションに整理するのに適しています。

**メニューバーを使用する場合:**

- アプリケーションのコマンドバー(ファイル、編集、表示、挿入、フォーマットなど)を構築する場合
- インターフェース全体で表示され続ける永続的なナビゲーションを作成する場合
- コマンドを論理的なトップレベルのカテゴリーに整理する場合
- キーボードサポート付きの水平メニューナビゲーションが必要な場合
- デスクトップスタイルのアプリケーションインターフェースを構築する場合

**メニューバーを避けるべき場合:**

- 個々のアクションのためのドロップダウンメニューを構築する場合(代わりに[トリガー付きMenu](guide/aria/menu)を使用してください)
- コンテキストメニューを作成する場合([Menu](guide/aria/menu)ガイドパターンを使用してください)
- シンプルなスタンドアロンのアクションリストの場合(代わりに[Menu](guide/aria/menu)を使用してください)
- 水平方向のスペースが限られているモバイルインターフェースの場合
- ナビゲーションがサイドバーまたはヘッダーのナビゲーションパターンに属する場合

## 機能 {#features}

- **水平ナビゲーション** - 左右の矢印キーでトップレベルのカテゴリー間を移動
- **永続的な可視性** - 常に表示され、モーダルでも非表示でもない
- **ホバーで開く** - 最初のキーボードまたはクリック操作の後、ホバーでサブメニューが開く
- **ネストされたサブメニュー** - 複数レベルのメニュー深度をサポート
- **キーボードナビゲーション** - 矢印キー、Enter/Space、Escape、および先行入力サーチ
- **無効状態** - メニューバー全体または個々の項目を無効化
- **RTLサポート** - 右から左へ記述する言語のナビゲーションを自動でサポート

## 例 {#examples}

### 基本的なメニューバー {#basic-menubar}

メニューバーは、トップレベルのカテゴリーに整理されたアプリケーションコマンドへの永続的なアクセスを提供します。ユーザーは左/右矢印キーでカテゴリー間を移動し、Enterキーまたは下矢印キーでメニューを開きます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

右矢印キーを押すと、File、Edit、Viewの間を移動します。Enterキーまたは下矢印キーを押すとメニューが開き、上/下矢印キーでサブメニュー項目を操作できます。

### 無効化されたメニューバーアイテム {#disabled-menubar-items}

特定のメニュー項目またはメニューバー全体を無効にして、インタラクションを防ぎます。`softDisabled`入力で、無効化された項目がキーボードフォーカスを受け取れるかどうかを制御します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

メニューバーで`[softDisabled]="true"`の場合、無効化された項目はフォーカスを受け取れますが、アクティブにはできません。`[softDisabled]="false"`の場合、無効化された項目はキーボードナビゲーション中にスキップされます。

### RTLサポート {#rtl-support}

メニューバーは、右から左へ記述する言語（RTL）に自動的に適応します。矢印キーによるナビゲーションの方向は逆になり、サブメニューは左側に配置されます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`dir="rtl"`属性はRTLモードを有効にします。左矢印キーは右に、右矢印キーは左に移動し、RTL言語のユーザーにとって自然なナビゲーションを維持します。

## API {#apis}

メニューバーパターンはAngularのAriaライブラリのディレクティブを使用します。完全なAPIドキュメントについては、[Menuガイド](guide/aria/menu)を参照してください。

### MenuBar {#menubar}

トップレベルのメニューアイテムのための水平コンテナです。

#### Inputs {#inputs}

| プロパティ     | 型        | デフォルト | 説明                                                          |
| -------------- | --------- | ------- | ------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | メニューバー全体を無効にします                                  |
| `wrap`         | `boolean` | `true`  | キーボードナビゲーションが最後のアイテムから最初のアイテムにラップするかどうか |
| `softDisabled` | `boolean` | `true`  | `true`の場合、無効化されたアイテムはフォーカス可能ですが、インタラクティブではありません |

利用可能なすべての入力とシグナルの詳細については、[Menu APIドキュメント](guide/aria/menu#apis)を参照してください。

### MenuItem {#menuitem}

メニューバー内の個々のアイテムです。Menuと同じAPIです - [MenuItem](guide/aria/menu#menuitem)を参照してください。

**メニューバー固有の動作:**

- 左右の矢印キーでメニューバーのアイテム間を移動します（垂直メニューでは上下）
- 最初のキーボード操作またはクリックで、サブメニューのホバーで開く機能が有効になります
- Enterキーまたは下矢印キーでサブメニューを開き、最初のアイテムにフォーカスします
- `aria-haspopup="menu"`はサブメニューを持つアイテムを示します

### MenuTrigger {#menutrigger}

通常メニューバーでは使用されません - MenuItemは関連するサブメニューがある場合、トリガーの動作を直接処理します。スタンドアロンのメニュートリガーパターンについては、[MenuTrigger](guide/aria/menu#menutrigger)を参照してください。
