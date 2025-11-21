<docs-decorative-header title="マルチセレクト">
</docs-decorative-header>

## 概要 {#overview}

読み取り専用コンボボックスと複数選択が有効なリストボックスを組み合わせて、キーボードナビゲーションとスクリーンリーダーをサポートする複数選択ドロップダウンを作成するパターンです。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

マルチセレクトパターンは、ユーザーがよく知られた選択肢のセットから複数の関連アイテムを選択する必要がある場合に最も効果的です。

このパターンは次のような場合に使用を検討してください:

- **ユーザーが複数の選択を必要とする** - 複数の選択肢が適用されるタグ、カテゴリー、フィルター、またはラベル
- **オプションリストが固定されている** (20項目未満) - ユーザーは検索なしでオプションを一覧できます
- **コンテンツのフィルタリング** - 複数の基準を同時にアクティブにできます
- **属性の割り当て** - 複数の値が意味を持つラベル、権限、または機能
- **関連する選択肢** - 論理的に連携するオプション (複数のチームメンバーを選択するなど)

このパターンは次のような場合には避けてください:

- **単一選択のみが必要** - よりシンプルな単一選択のドロップダウンには[セレクトパターン](guide/aria/select)を使用してください
- **リストが20項目以上あり、検索が必要** - マルチセレクト機能付きの[オートコンプリートパターン](guide/aria/autocomplete)を使用してください
- **ほとんどまたはすべてのオプションが選択される** - チェックリストパターンの方が視認性が高いです
- **選択肢が独立した二者択一のオプションである** - 個別のチェックボックスの方が選択肢をより明確に伝えます

## 機能 {#features}

マルチセレクトパターンは[Combobox](guide/aria/combobox)と[Listbox](guide/aria/listbox)ディレクティブを組み合わせ、以下の機能を備えた完全にアクセシブルなドロップダウンを提供します:

- **キーボードナビゲーション** - 矢印キーでオプションを移動、Spaceキーで切り替え、Escapeキーで閉じます
- **スクリーンリーダーのサポート** - aria-multiselectableを含む組み込みのARIA属性
- **選択数の表示** - 複数選択時に「アイテム + 他2件」のようなコンパクトなパターンを表示します
- **シグナルベースのリアクティビティ** - Angularのシグナルを使用したリアクティブな状態管理
- **スマートな配置** - CDK Overlayがビューポートの端やスクロールを処理します
- **永続的な選択** - 選択後も、選択されたオプションはチェックマーク付きで表示されたままになります

## 例

### 基本的な複数選択 {#basic-multiselect}

ユーザーはオプションのリストから複数のアイテムを選択する必要があります。読み取り専用のコンボボックスと複数選択が有効なリストボックスを組み合わせることで、完全なアクセシビリティサポートを備えた使い慣れた複数選択の機能を提供します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngListbox`の`multi`属性は複数選択を有効にします。スペースキーを押すとオプションが切り替わり、ポップアップは追加の選択のために開いたままになります。表示には、最初に選択されたアイテムと残りの選択数が表示されます。

### カスタム表示の複数選択 {#multiselect-with-custom-display}

オプションには、ユーザーが選択肢を識別しやすくするために、アイコンや色などの視覚的なインジケーターが必要になることがよくあります。オプション内のカスタムテンプレートを使用すると、リッチなフォーマットが可能になり、表示値にはコンパクトなサマリーが表示されます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

各オプションには、ラベルの横にアイコンが表示されます。表示値は、最初に選択されたアイテムのアイコンとテキスト、その後に続く追加の選択数を表示するように更新されます。選択されたオプションにはチェックマークが表示され、明確な視覚的フィードバックを提供します。

### 制御された選択 {#controlled-selection}

フォームでは、選択数を制限したり、ユーザーの選択を検証したりする必要がある場合があります。選択をプログラムで制御することで、アクセシビリティを維持しながらこれらの制約を有効にできます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

この例では、選択を3つのアイテムに制限しています。制限に達すると、選択されていないオプションは無効になり、追加の選択ができなくなります。メッセージでユーザーに制約を通知します。

## API {#apis}

マルチセレクトパターンは、AngularのAriaライブラリから以下のディレクティブを使用します。詳細なAPIドキュメントについては、リンク先のガイドを参照してください。

### Comboboxディレクティブ {#combobox-directives}

マルチセレクトパターンでは、`ngCombobox`と`readonly`属性を使用して、キーボードナビゲーションを維持しながらテキスト入力を防ぎます。

#### 入力 {#inputs}

| プロパティ   | 型        | デフォルト | 説明                                      |
| ---------- | --------- | ------- | ----------------------------------------- |
| `readonly` | `boolean` | `false` | `true`に設定するとドロップダウンの動作になります |
| `disabled` | `boolean` | `false` | マルチセレクト全体を無効化します          |

利用可能なすべての入力とシグナルの詳細については、[Combobox APIドキュメント](guide/aria/combobox#apis)を参照してください。

### Listboxディレクティブ {#listbox-directives}

マルチセレクトパターンでは、複数選択のために`ngListbox`と`multi`属性を、各選択可能な項目のために`ngOption`を使用します。

#### 入力 {#inputs}

| プロパティ | 型        | デフォルト | 説明                                       |
| -------- | --------- | ------- | ------------------------------------------ |
| `multi`  | `boolean` | `false` | `true`に設定すると複数選択が可能になります |

#### モデル {#model}

| プロパティ | 型      | 説明                                      |
| -------- | ------- | ----------------------------------------- |
| `values` | `any[]` | 選択された値の双方向バインディング可能な配列 |

`multi`がtrueの場合、ユーザーはスペースキーを使用して選択を切り替えることで、複数のオプションを選択できます。ポップアップは選択後も開いたままで、追加の選択が可能です。

リストボックスの設定、選択モード、オプションのプロパティに関する完全な詳細については、[Listbox APIドキュメント](guide/aria/listbox#apis)を参照してください。

### ポジショニング {#positioning}

マルチセレクトパターンは、スマートなポジショニングのために[CDK Overlay](api/cdk/overlay/CdkConnectedOverlay)と統合されています。`cdkConnectedOverlay`を使用すると、ビューポートの端やスクロールを自動的に処理できます。
