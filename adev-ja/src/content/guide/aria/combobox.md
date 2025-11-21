<docs-decorative-header title="コンボボックス">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="コンボボックスARIAパターン"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="コンボボックスAPIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

テキスト入力とポップアップを連携させ、オートコンプリート、セレクト、マルチセレクトのパターンにプリミティブディレクティブを提供するディレクティブです。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts">
      <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts"/>
      <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.html"/>
      <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.ts">
      <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.ts"/>
      <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.html"/>
      <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.ts">
      <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.ts"/>
      <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.html"/>
      <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

コンボボックスは、テキスト入力とポップアップを連携させるプリミティブディレクティブです。オートコンプリート、セレクト、マルチセレクトパターンの基盤を提供します。次のような場合には、コンボボックスを直接使用することを検討してください：

- **カスタムオートコンプリートパターンの構築** - 特殊なフィルタリングやサジェスチョンの動作を作成する
- **カスタム選択コンポーネントの作成** - 独自の要件を持つドロップダウンを開発する
- **入力とポップアップの連携** - テキスト入力をリストボックス、ツリー、またはダイアログコンテンツと組み合わせる
- **特定のフィルターモードの実装** - 手動、自動選択、またはハイライトの動作を使用する

代わりに、次のような場合はドキュメント化されたパターンを使用してください：

- フィルタリング付きの標準的なオートコンプリートが必要な場合 - すぐに使える例については、[Autocompleteパターン](guide/aria/autocomplete)を参照してください
- 単一選択のドロップダウンが必要な場合 - 完全なドロップダウンの実装については、[Selectパターン](guide/aria/select)を参照してください
- 複数選択のドロップダウンが必要な場合 - コンパクトな表示の複数選択については、[Multiselectパターン](guide/aria/multiselect)を参照してください

Note: [Autocomplete](guide/aria/autocomplete)、[Select](guide/aria/select)、[Multiselect](guide/aria/multiselect)のガイドでは、このディレクティブを特定のユースケースのために[Listbox](guide/aria/listbox)と組み合わせた、ドキュメント化されたパターンが示されています。

## 機能 {#features}

Angularのコンボボックスは、完全にアクセシブルな入力とポップアップの連携システムを以下の機能とともに提供します:

- **ポップアップ付きテキスト入力** - 入力フィールドとポップアップコンテンツを連携させます
- **3つのフィルターモード** - 手動、自動選択、またはハイライトの動作
- **キーボードナビゲーション** - 矢印キー、Enter、Escapeキーのハンドリング
- **スクリーンリーダーのサポート** - `role="combobox"`や`aria-expanded`を含む組み込みのARIA属性
- **ポップアップ管理** - ユーザーインタラクションに基づく自動的な表示/非表示
- **シグナルベースのリアクティビティ** - Angularシグナルを使用したリアクティブな状態管理

## 例

### オートコンプリート {#autocomplete}

ユーザーが入力するにつれてオプションをフィルタリングして提案する、アクセシブルな入力フィールドです。リストから値を見つけて選択するのに役立ちます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts">
      <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts"/>
      <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.html"/>
      <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.ts">
      <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.ts"/>
      <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.html"/>
      <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.component.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.ts">
      <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.ts"/>
      <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.html"/>
      <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.component.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`filterMode="manual"`設定は、フィルタリングと選択を完全に制御します。入力は、オプションリストをフィルタリングするシグナルを更新します。ユーザーは矢印キーで移動し、Enterキーまたはクリックで選択します。このモードは、カスタムフィルタリングロジックに最も柔軟性を提供します。完全なフィルタリングパターンと例については、[オートコンプリートガイド](guide/aria/autocomplete)を参照してください。

### 読み取り専用モード {#readonly-mode}

読み取り専用のコンボボックスとリストボックスを組み合わせて、キーボードナビゲーションとスクリーンリーダーをサポートする単一選択のドロップダウンを作成するパターンです。

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

`readonly`属性は、入力フィールドへの入力を防ぎます。ポップアップはクリックまたは矢印キーで開きます。ユーザーはキーボードでオプションを移動し、Enterキーかクリックで選択します。

この設定は、[Select](guide/aria/select)および[Multiselect](guide/aria/multiselect)パターンの基盤を提供します。トリガーとオーバーレイの位置決めを含む完全なドロップダウンの実装については、これらのガイドを参照してください。

### ダイアログポップアップ {#dialog-popup}

ポップアップには、背景とフォーカストラップを備えたモーダルな動作が必要な場合があります。コンボボックスダイアログディレクティブは、特殊なユースケースのためにこのパターンを提供します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngComboboxDialog`ディレクティブは、ネイティブのdialog要素を使用してモーダルポップアップを作成します。これにより、背景の動作とフォーカストラップが提供されます。選択インターフェースがモーダルなインタラクションを必要とする場合や、ポップアップのコンテンツがフルスクリーンのフォーカスを必要とするほど複雑な場合に、ダイアログポップアップを使用します。

## API {#apis}

### Comboboxディレクティブ {#combobox-directive}

`ngCombobox`ディレクティブは、テキスト入力とポップアップを連携させます。

#### 入力 {#inputs}

| プロパティ       | 型                                             | デフォルト   | 説明                                             |
| ---------------- | ---------------------------------------------- | ---------- | ------------------------------------------------ |
| `filterMode`     | `'manual'` \| `'auto-select'` \| `'highlight'` | `'manual'` | 選択の動作を制御します                           |
| `disabled`       | `boolean`                                      | `false`    | コンボボックスを無効にします                     |
| `readonly`       | `boolean`                                      | `false`    | コンボボックスを読み取り専用にします（Select/Multiselect用） |
| `firstMatch`     | `V`                                            | -          | 自動選択のために、最初に一致した項目の値         |
| `alwaysExpanded` | `boolean`                                      | `false`    | ポップアップを常に開いたままにします             |

**フィルターモード:**

- **`'manual'`** - ユーザーがフィルタリングと選択を明示的に制御します。ポップアップには、あなたのフィルタリングロジックに基づいたオプションが表示されます。ユーザーはEnterキーまたはクリックで選択します。このモードは最も柔軟性があります。
- **`'auto-select'`** - ユーザーが入力すると、入力値は最初に一致したオプションに自動的に更新されます。連携のために`firstMatch`入力が必要です。例については[オートコンプリートガイド](guide/aria/autocomplete#auto-select-mode)を参照してください。
- **`'highlight'`** - 入力値を変更せずに、一致するテキストをハイライトします。ユーザーは矢印キーで移動し、Enterキーで選択します。

#### シグナル {#signals}

| プロパティ | 型                | 説明                            |
| ---------- | ----------------- | ------------------------------- |
| `expanded` | `Signal<boolean>` | ポップアップが現在開いているかどうか |

#### メソッド {#methods}

| メソッド   | パラメータ | 説明                   |
| ---------- | ---------- | ---------------------- |
| `open`     | なし       | コンボボックスを開きます   |
| `close`    | なし       | コンボボックスを閉じます   |
| `expand`   | なし       | コンボボックスを展開します |
| `collapse` | なし       | コンボボックスを折りたたみます |

### ComboboxInputディレクティブ {#comboboxinput-directive}

`ngComboboxInput`ディレクティブは、入力要素をコンボボックスに接続します。

#### モデル {#model}

| プロパティ | 型       | 説明                                     |
| -------- | -------- | ---------------------------------------- |
| `value`  | `string` | `[(value)]`を使用した双方向バインディング可能な値 |

入力要素は、キーボード操作とARIA属性を自動的に受け取ります。

### ComboboxPopupディレクティブ {#comboboxpopup-directive}

`ngComboboxPopup`ディレクティブ（ホストディレクティブ）は、ポップアップの可視性と連携を管理します。通常、`ng-template`内の`ngComboboxPopupContainer`またはCDK Overlayと一緒に使用されます。

### ComboboxPopupContainerディレクティブ {#comboboxpopupcontainer-directive}

`ngComboboxPopupContainer`ディレクティブは、`ng-template`をポップアップのコンテンツとしてマークします。

```html
<ng-template ngComboboxPopupContainer>
  <div ngListbox>...</div>
</ng-template>
```

Popover APIまたはCDK Overlayと一緒に使用して、位置決めします。

### ComboboxDialogディレクティブ {#comboboxdialog-directive}

`ngComboboxDialog`ディレクティブは、モーダルなコンボボックスポップアップを作成します。

```html
<dialog ngComboboxDialog>
  <div ngListbox>...</div>
</dialog>
```

背景とフォーカストラップを備えたモーダルポップアップの動作に使用します。

### 関連するパターンとディレクティブ {#related-patterns-and-directives}

Comboboxは、これらのドキュメント化されたパターンのためのプリミティブディレクティブです:

- **[オートコンプリート](guide/aria/autocomplete)** - フィルタリングと提案のパターン（フィルターモード付きのComboboxを使用）
- **[セレクト](guide/aria/select)** - 単一選択のドロップダウンパターン（`readonly`付きのComboboxを使用）
- **[マルチセレクト](guide/aria/multiselect)** - 複数選択のパターン（`readonly` + 複数選択が有効なListbox付きのComboboxを使用）

Comboboxは通常、以下と組み合わせて使用されます:

- **[Listbox](guide/aria/listbox)** - 最も一般的なポップアップコンテンツ
- **[Tree](guide/aria/tree)** - 階層的なポップアップコンテンツ（例についてはTreeガイドを参照）
