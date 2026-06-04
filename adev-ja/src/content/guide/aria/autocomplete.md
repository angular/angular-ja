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
- **動的ハイライト動作** - インラインでの候補表示に対する組み込みサポート
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

### Signal Forms Integration {#signal-forms-integration}

Angular Aria integrates seamlessly with the signal-based [Signal Forms](guide/forms/signals/overview) API. You can encapsulate complex inputs into reusable custom control components implementing `FormValueControl`.

The following example demonstrates a country selector component implementing `FormValueControl<string>`, bound to the parent form using `[formField]` and protected by schema validation rules.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.html"/>
  <docs-code header="country-selector.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.ts"/>
  <docs-code header="country-selector.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.html"/>
  <docs-code header="country-selector.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.css"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.css"/>
</docs-code-multifile>

## Testing {#testing}

The autocomplete pattern can be tested using a combination of `ComboboxHarness` and `ListboxHarness` from `@angular/aria/combobox/testing` and `@angular/aria/listbox/testing`.
Here is an example of how to use the harnesses to test an autocomplete component:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyAutocompleteComponent} from './my-autocomplete'; // Your component

describe('MyAutocompleteComponent', () => {
  let fixture: ComponentFixture<MyAutocompleteComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAutocompleteComponent],
    });

    fixture = TestBed.createComponent(MyAutocompleteComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should filter options based on input', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Type in the input to trigger filtering
    await combobox.setValue('ap');
    expect(await combobox.isOpen()).toBe(true);

    // Get the listbox harness from the popup
    const listbox = await combobox.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    // Verify options are filtered (e.g., 'Apple', 'Apricot')
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('Apple');

    // Select the first option
    await options[0].click();

    // Verify the input value is updated and popup is closed
    expect(await combobox.isOpen()).toBe(false);
    expect(await combobox.getValue()).toBe('Apple');
  });
});
```

## API {#apis}

### Comboboxディレクティブ {#combobox-directive}

`ngCombobox`ディレクティブは、編集可能なテキスト`<input>`または`<textarea>`に直接適用され、キーボードトリガーとポップオーバーの状態を管理します。

#### 入力 {#inputs}

| プロパティ         | 型                    | デフォルト  | 説明                                                                   |
| ------------------ | --------------------- | ----------- | ---------------------------------------------------------------------- |
| `disabled`         | `boolean`             | `false`     | コンボボックスを無効にします                                           |
| `softDisabled`     | `boolean`             | `true`      | 無効化されていてもフォーカス可能にします                               |
| `inlineSuggestion` | `string \| undefined` | `undefined` | オートコンプリートモード向けにインライン補完候補を表示します           |

#### モデル {#models}

| プロパティ | 型                     | デフォルト | 説明                                                                              |
| ---------- | ---------------------- | ---------- | --------------------------------------------------------------------------------- |
| `value`    | `ModelSignal<string>`  | `''`       | `[(value)]`を使用した、inputの値の双方向バインディング                            |
| `expanded` | `ModelSignal<boolean>` | `false`    | `[(expanded)]`を使用した、ポップアップの展開状態の双方向バインディング            |

---

### ComboboxPopupディレクティブ {#comboboxpopup-directive}

ポップアップとして使用されるコンテナを示すために`<ng-template>`に適用される構造ディレクティブです。

#### 入力 {#combobox-popup-inputs}

| プロパティ | 型         | 説明                                       |
| ---------- | ---------- | ------------------------------------------ |
| `combobox` | `Combobox` | 親の`Combobox`への必須の参照               |

---

### ComboboxWidgetディレクティブ {#comboboxwidget-directive}

アクティブな子孫要素のフォーカス変更を入力トリガーに橋渡しするため、ポップアップのコンテンツコンテナに適用されます。

#### 入力 {#combobox-widget-inputs}

| プロパティ         | 型                    | 説明                                                                                       |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------ |
| `activeDescendant` | `string \| undefined` | 現在アクティブな子孫要素のID（`listbox.activeDescendant()`にバインド）                     |

---

### Listboxディレクティブ {#listbox-directives}

オートコンプリートの候補リストには、標準のスタンドアロンlistboxディレクティブを使用します。

#### 入力 {#listbox-inputs}

| プロパティ      | 型                                 | デフォルト | 説明                                                                                                            |
| --------------- | ---------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `selectionMode` | `'follow'` \| `'explicit'`         | `'follow'` | manual/explicitモードでは、フォーカス追従ではなくクリックやEnterで明示的に更新を確定します                      |
| `focusMode`     | `'roving'` \| `'activedescendant'` | `'roving'` | `'activedescendant'`に設定すると、ブラウザのフォーカスはトリガー入力に留まります                                |
| `tabIndex`      | `number`                           | `0`        | `-1`に設定すると、キーボードのタブフォーカスがポップアップlistboxコンテナに入るのを防ぎます                     |

#### モデル {#listbox-models}

| プロパティ | 型                   | 説明                                                                |
| ---------- | -------------------- | ------------------------------------------------------------------- |
| `value`    | `ModelSignal<any[]>` | `[(value)]`を使用した、選択された値の配列の双方向バインディング     |

---

### 関連コンポーネント {#related-components}

オートコンプリートは、標準のスタンドアロンの[Listbox](/api/aria/listbox/Listbox)と[Option](/api/aria/listbox/Option)ディレクティブを使用します。高度なオプションについては、[Listboxのドキュメント](/guide/aria/listbox)を参照してください。
