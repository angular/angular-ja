<docs-decorative-header title="リストボックス">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="リストボックスパターン"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="リストボックスAPIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

ユーザーが選択するためのオプションのリストを表示するディレクティブで、キーボードナビゲーション、単一または複数選択、スクリーンリーダーをサポートしています。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

Listboxは、[Select](guide/aria/select)、[Multiselect](guide/aria/multiselect)、[Autocomplete](guide/aria/autocomplete)の各パターンで使用される基本的なディレクティブです。ほとんどのドロップダウンのニーズには、代わりにこれらのドキュメント化されたパターンを使用してください。

次のような場合は、listboxを直接使用することを検討してください:

- **カスタム選択コンポーネントの構築** - 特定の動作を持つ特殊なインターフェースを作成する
- **可視の選択リスト** - 選択可能な項目を（ドロップダウンではなく）ページに直接表示する
- **カスタム統合パターン** - 独自のポップアップやレイアウト要件と統合する

次のような場合は、listboxの使用を避けてください:

- **ナビゲーションメニューが必要な場合** - アクションやコマンドには[Menu](guide/aria/menu)ディレクティブを使用してください

## 機能 {#features}

Angularのリストボックスは、以下の機能を備えた完全にアクセシブルなリスト実装を提供します:

- **キーボードナビゲーション** - 矢印キーでオプションを移動し、EnterキーまたはSpaceキーで選択
- **スクリーンリーダーのサポート** - `role="listbox"`を含む組み込みのARIA属性
- **単一選択または複数選択** - `multi`属性で選択モードを制御
- **水平または垂直** - `orientation`属性でレイアウト方向を指定
- **先行入力による検索** - 文字を入力して一致するオプションにジャンプ
- **シグナルベースのリアクティビティ** - Angularシグナルを使用したリアクティブな状態管理

## 例 {#examples}

### 基本的なリストボックス {#basic-listbox}

アプリケーションでは、ドロップダウンに隠すのではなく、ページ上に直接表示される選択可能なリストが必要になることがあります。スタンドアロンのリストボックスは、これらの表示されるリストインターフェースに対して、キーボードによるナビゲーションと選択機能を提供します。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

`values`モデルシグナルは、選択されたアイテムへの双方向バインディングを提供します。`selectionMode="explicit"`では、ユーザーはSpaceキーまたはEnterキーを押してオプションを選択します。リストボックスとコンボボックス、オーバーレイ配置を組み合わせたドロップダウンパターンについては、[Select](guide/aria/select)パターンを参照してください。

### 水平リストボックス {#horizontal-listbox}

ツールバーのようなインターフェースやタブ形式の選択など、リストは水平方向に配置した方がうまく機能する場合があります。`orientation`属性は、レイアウトとキーボードナビゲーションの方向の両方を変更します。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`orientation="horizontal"`の場合、上下の矢印キーの代わりに、左右の矢印キーでオプション間を移動します。リストボックスは、ナビゲーションの方向を反転させることで、右から左へ記述する言語 (RTL) に自動的に対応します。

### 選択モード {#selection-modes}

リストボックスは、アイテムがいつ選択されるかを制御する2つの選択モードをサポートしています。

`'follow'`モードはフォーカスされたアイテムを自動的に選択し、選択が頻繁に変わる場合により速いインタラクションを提供します。`'explicit'`モードは選択を確定するためにSpaceキーまたはEnterキーが必要で、ナビゲーション中の意図しない変更を防ぎます。ドロップダウンパターンでは、通常、単一選択のために`'follow'`モードが使用されます。

#### Explicit

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.html" />
</docs-code-multifile>

#### Follow

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.html" />
</docs-code-multifile>

| モード       | 説明                                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| `'follow'`   | フォーカスされたアイテムを自動的に選択し、選択が頻繁に変わる場合に、より速いインタラクションを提供します |
| `'explicit'` | 選択を確定するためにSpaceキーまたはEnterキーが必要で、ナビゲーション中の意図しない変更を防ぎます       |

TIP: ドロップダウンパターンでは、通常、単一選択のために`'follow'`モードが使用されます。

## API

### Listboxディレクティブ {#listbox-directive}

`ngListbox`ディレクティブは、選択可能なオプションのアクセシブルなリストを作成します。

#### 入力 {#inputs}

| プロパティ       | 型                                 | デフォルト   | 説明                                         |
| ---------------- | ---------------------------------- | ------------ | -------------------------------------------- |
| `id`             | `string`                           | auto         | リストボックスの一意の識別子                 |
| `multi`          | `boolean`                          | `false`      | 複数選択を有効にします                       |
| `orientation`    | `'vertical'` \| `'horizontal'`     | `'vertical'` | リストのレイアウト方向                       |
| `wrap`           | `boolean`                          | `true`       | リストの端でフォーカスをラップするかどうか     |
| `selectionMode`  | `'follow'` \| `'explicit'`         | `'follow'`   | 選択がどのようにトリガーされるか             |
| `focusMode`      | `'roving'` \| `'activedescendant'` | `'roving'`   | フォーカス管理戦略                           |
| `softDisabled`   | `boolean`                          | `true`       | 無効化されたアイテムがフォーカス可能かどうか   |
| `disabled`       | `boolean`                          | `false`      | リストボックス全体を無効にします             |
| `readonly`       | `boolean`                          | `false`      | リストボックスを読み取り専用にします         |
| `typeaheadDelay` | `number`                           | `500`        | 先行入力の検索がリセットされるまでのミリ秒   |

#### モデル {#model}

| プロパティ | 型    | 説明                                       |
| -------- | ----- | ------------------------------------------ |
| `values` | `V[]` | 選択された値の双方向バインディング可能な配列 |

#### シグナル {#signals}

| プロパティ | 型            | 説明                                  |
| -------- | ------------- | ------------------------------------- |
| `values` | `Signal<V[]>` | 現在選択されている値（シグナルとして）    |

#### メソッド {#methods}

| メソッド                   | パラメータ                        | 説明                                       |
| -------------------------- | --------------------------------- | ------------------------------------------ |
| `scrollActiveItemIntoView` | `options?: ScrollIntoViewOptions` | アクティブなアイテムを表示領域にスクロールします |
| `gotoFirst`                | none                              | リストボックスの最初のアイテムに移動します     |

### Optionディレクティブ {#option-directive}

`ngOption`ディレクティブは、リストボックス内のアイテムをマークします。

#### 入力 {#inputs}

| プロパティ | 型        | デフォルト | 説明                                             |
| ---------- | --------- | ------- | ------------------------------------------------ |
| `id`       | `string`  | auto    | オプションの一意の識別子                         |
| `value`    | `V`       | -       | このオプションに関連付けられた値（必須）         |
| `label`    | `string`  | -       | スクリーンリーダー用のオプションのラベル         |
| `disabled` | `boolean` | `false` | このオプションが無効かどうか                     |

#### シグナル {#signals}

| プロパティ | 型                | 説明                            |
| ---------- | ----------------- | ------------------------------- |
| `selected` | `Signal<boolean>` | このオプションが選択されているかどうか |
| `active`   | `Signal<boolean>` | このオプションにフォーカスがあるかどうか |

### 関連パターン {#related-patterns}

Listboxは、これらのドキュメント化されたドロップダウンパターンで使用されます：

- **[Select](guide/aria/select)** - 読み取り専用のcombobox + listboxを使用した単一選択のドロップダウンパターン
- **[Multiselect](guide/aria/multiselect)** - `multi`を使用した読み取り専用のcombobox + listboxによる複数選択のドロップダウンパターン
- **[Autocomplete](guide/aria/autocomplete)** - combobox + listboxを使用したフィルタリング可能なドロップダウンパターン

トリガー、ポップアップ、オーバーレイの配置を含む完全なドロップダウンパターンについては、listboxを単独で使用するのではなく、それらのパターンガイドを参照してください。

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox ARIA pattern"/>
  <docs-pill href="/api/aria/listbox/Listbox" title="Listbox API Reference"/>
</docs-pill-row>
