<docs-decorative-header title="セレクト">
</docs-decorative-header>

## 概要 {#overview}

読み取り専用コンボボックスとリストボックスを組み合わせて、キーボードナビゲーションとスクリーンリーダーをサポートする単一選択ドロップダウンを作成するパターンです。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="マテリアル">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

selectパターンは、ユーザーがよく知られた選択肢のセットから単一の値を選択する必要がある場合に最適です。

次のような場合にこのパターンの使用を検討してください：

- **選択肢のリストが固定されている場合**（20項目未満）- ユーザーはフィルタリングなしで一覧して選択できます
- **選択肢がよく知られている場合** - ユーザーは検索しなくても選択肢を認識できます
- **フォームに標準的なフィールドが必要な場合** - 国、州、カテゴリー、またはステータスの選択
- **設定と構成** - 設定やオプションのためのドロップダウンメニュー
- **選択肢のラベルが明確な場合** - 各選択肢に、識別しやすく一覧できる名前が付いている

次のような場合はこのパターンを避けてください：

- **リストに20項目以上ある場合** - より良いフィルタリングのために[Autocompleteパターン](guide/aria/autocomplete)を使用してください
- **ユーザーが選択肢を検索する必要がある場合** - [Autocomplete](guide/aria/autocomplete)はテキスト入力とフィルタリングを提供します
- **複数選択が必要な場合** - 代わりに[Multiselectパターン](guide/aria/multiselect)を使用してください
- **選択肢が非常に少ない場合（2〜3個）** - ラジオボタンはすべての選択肢の可視性を高めます

## 機能 {#features}

selectパターンは、[Combobox](guide/aria/combobox)と[Listbox](guide/aria/listbox)ディレクティブを組み合わせて、以下の機能を備えた完全にアクセシブルなドロップダウンを提供します:

- **キーボードナビゲーション** - 矢印キーでオプションを移動し、Enterで選択、Escapeで閉じます
- **スクリーンリーダーのサポート** - 支援技術のための組み込みARIA属性
- **カスタム表示** - 選択された値をアイコン、フォーマット、またはリッチコンテンツで表示します
- **シグナルベースのリアクティビティ** - Angularシグナルを使用したリアクティブな状態管理
- **スマートな配置** - CDK Overlayがビューポートの端やスクロールを処理します
- **双方向テキストのサポート** - 右から左へ記述する言語 (RTL) を自動的に処理します

## 例

### 基本的なセレクト {#basic-select}

ユーザーは、値のリストから選択するために標準的なドロップダウンを必要とします。読み取り専用のコンボボックスとリストボックスを組み合わせることで、完全なアクセシビリティサポートを備えた、使い慣れたセレクト体験を提供します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngCombobox`の`readonly`属性は、キーボードナビゲーションを維持しながらテキスト入力を防ぎます。ユーザーは、ネイティブのselect要素と同じように、矢印キーとEnterキーを使用してドロップダウンを操作します。

### カスタム表示のセレクト {#select-with-custom-display}

オプションには、ユーザーが選択肢をすばやく識別できるように、アイコンやバッジなどの視覚的なインジケーターが必要になることがよくあります。オプション内のカスタムテンプレートを使用すると、アクセシビリティを維持しながらリッチなフォーマットが可能になります。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

各オプションには、ラベルの横にアイコンが表示されます。選択された値は、選択されたオプションのアイコンとテキストを表示するように更新され、明確な視覚的フィードバックを提供します。

### 無効化されたセレクト {#disabled-select}

特定のフォーム条件が満たされていない場合にユーザーの操作を防ぐために、セレクトを無効にできます。無効状態は、視覚的なフィードバックを提供し、キーボード操作を防ぎます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

無効にすると、セレクトは無効の視覚的状態を示し、すべてのユーザー操作をブロックします。スクリーンリーダーは、支援技術のユーザーに無効状態をアナウンスします。

## API

selectパターンは、AngularのAriaライブラリから以下のディレクティブを使用します。詳細なAPIドキュメントについては、リンク先のガイドを参照してください。

### コンボボックスディレクティブ {#combobox-directives}

selectパターンは、キーボードナビゲーションを維持しつつテキスト入力を防ぐために、`readonly`属性を持つ`ngCombobox`を使用します。

#### 入力 {#inputs}

| プロパティ   | 型      | デフォルト | 説明                               |
| ---------- | --------- | ------- | ----------------------------------------- |
| `readonly` | `boolean` | `false` | `true`に設定すると、ドロップダウンの動作になります |
| `disabled` | `boolean` | `false` | select全体を無効にします                |

利用可能なすべての入力とシグナルの詳細については、[コンボボックスAPIドキュメント](guide/aria/combobox#apis)を参照してください。

### リストボックスディレクティブ {#listbox-directives}

selectパターンは、ドロップダウンリストに`ngListbox`を、選択可能な各項目に`ngOption`を使用します。

#### モデル {#model}

| プロパティ | 型    | 説明                                                                  |
| -------- | ------- | ---------------------------------------------------------------------------- |
| `values` | `any[]` | 選択された値の双方向バインディング可能な配列（selectの場合は単一の値を含む） |

リストボックスの設定、選択モード、およびオプションのプロパティに関する完全な詳細については、[リストボックスAPIドキュメント](guide/aria/listbox#apis)を参照してください。

### ポジショニング {#positioning}

selectパターンは、スマートなポジショニングのために[CDK Overlay](api/cdk/overlay/CdkConnectedOverlay)と統合されています。ビューポートの端やスクロールを自動的に処理するには`cdkConnectedOverlay`を使用してください。
