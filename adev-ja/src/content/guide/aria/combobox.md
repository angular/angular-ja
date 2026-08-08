<docs-decorative-header title="コンボボックス">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="コンボボックスARIAパターン"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="コンボボックスAPIリファレンス"/>
</docs-pill-row>

## 概要 {#overview}

トリガー要素（テキスト入力、ボタン、`div`など）とポップアップを連携させ、オートコンプリート、セレクト、マルチセレクトパターンのプリミティブディレクティブを提供するディレクティブです。

<docs-tab-group>
  <docs-tab label="基本">
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

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## 使い方 {#usage}

コンボボックスは、インタラクティブなトリガー要素（テキスト入力、ボタン、`div`など）とポップアップを連携させるプリミティブディレクティブです。オートコンプリート、セレクト、マルチセレクトパターンの基盤を提供します。次のような場合は、コンボボックスを直接使用することを検討してください:

- **カスタムオートコンプリートパターンの構築** - 特殊なフィルタリングやサジェスチョンの動作を作成する
- **カスタム選択コンポーネントの作成** - 独自の要件を持つドロップダウンを開発する
- **入力とポップアップの連携** - テキスト入力をリストボックス、ツリー、ダイアログコンテンツと組み合わせる
- **カスタムフィルタリングの実装** - ユーザー側で一致するオプションをフィルタリングし、統合する

代わりに、次のような場合はドキュメント化されたパターンを使用してください:

- フィルタリング付きの標準的なオートコンプリートが必要な場合 - すぐに使える例については、[Autocompleteパターン](guide/aria/autocomplete)を参照してください
- 単一選択のドロップダウンが必要な場合 - 完全なドロップダウンの実装については、[Selectパターン](guide/aria/select)を参照してください
- 複数選択のドロップダウンが必要な場合 - コンパクトな表示の複数選択については、[Multiselectパターン](guide/aria/multiselect)を参照してください

NOTE: [Autocomplete](guide/aria/autocomplete)、[Select](guide/aria/select)、[Multiselect](guide/aria/multiselect)のガイドでは、このディレクティブを特定のユースケース向けに[Listbox](guide/aria/listbox)と組み合わせる、ドキュメント化されたパターンを示しています。

## 機能 {#features}

Angularのコンボボックスは、完全にアクセシブルな入力とポップアップの連携システムを以下の機能とともに提供します:

- **ポップアップ付きトリガー要素** - トリガー要素とポップアップコンテンツを連携させます
- **柔軟な連携** - 標準レイアウト（リストボックス、ツリー、グリッド、ダイアログ）とシームレスに統合します
- **キーボードナビゲーション** - 矢印キー、Enter、Escapeキーのハンドリング
- **スクリーンリーダーのサポート** - role="combobox"やaria-expandedを含む組み込みのARIA属性
- **ポップアップ管理** - ユーザーインタラクションに基づく自動的な表示/非表示
- **シグナルベースのリアクティビティ** - Angularシグナルを使用したリアクティブな状態管理

## 例 {#examples}

### オートコンプリート {#autocomplete}

ユーザーが入力するにつれてオプションをフィルタリングして提案する、アクセシブルな入力フィールドです。リストから値を見つけて選択するのに役立ちます。

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

フィルタリングは、オプションリストをリアクティブにフィルタリングするシグナルを更新することで、ユーザー側で管理されます。ユーザーは矢印キーで移動し、Enterキーまたはクリックで選択します。これにより、カスタム選択ロジックを完全に制御でき、最大限の柔軟性が得られます。完全なフィルタリングパターンと例については、[オートコンプリートガイド](guide/aria/autocomplete)を参照してください。

### 読み取り専用モード {#readonly-mode}

読み取り専用のコンボボックスとリストボックスを組み合わせて、キーボードナビゲーションとスクリーンリーダーをサポートする単一選択のドロップダウンを作成するパターンです。

<docs-tab-group>
  <docs-tab label="基本">
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

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

テキスト入力なしでドロップダウンをトリガーするには、ボタンをホストトリガーとして使用するか、入力トリガーにネイティブHTMLの`readonly`属性を適用します。ポップアップはクリックまたは矢印キーで開きます。

この設定は、[Select](guide/aria/select)および[Multiselect](guide/aria/multiselect)パターンの基盤を提供します。トリガーとオーバーレイの位置決めを含む完全なドロップダウン実装については、それらのガイドを参照してください。

### 日付ピッカーグリッド {#datepicker-grid}

コンボボックスは2次元グリッドと連携して、アクセシブルな日付ピッカーを作成できます。ユーザーは方向キーを使用してカレンダーグリッドテーブル内の日付を移動し、クリック、Enterキー、Spaceキーで選択を確定します。

<docs-tab-group>
  <docs-tab label="基本">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### ダイアログポップアップ {#dialog-popup}

ダイアログポップアップは、コンボボックストリガーを標準的なダイアログレイアウトやフォーカストラップ（CDKの`cdkTrapFocus`など）と組み合わせます。オーバーレイがモーダル動作やバックドロップ操作を必要とする場合は、ダイアログポップアップを使用してください。

<docs-tab-group>
  <docs-tab label="基本">
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

  <docs-tab label="レトロ">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## テスト {#testing}

Angular Ariaは、コンボボックスコンポーネントをテストするための`ComboboxHarness`を提供します。
コンポーネントテストでハーネスを使用する例を次に示します:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {MyComboboxComponent} from './my-combobox'; // Your component

describe('MyComboboxComponent', () => {
  let fixture: ComponentFixture<MyComboboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyComboboxComponent],
    });

    fixture = TestBed.createComponent(MyComboboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow opening and closing the popup', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Verify initial state
    expect(await combobox.isOpen()).toBe(false);

    // Open the popup
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);

    // Close the popup
    await combobox.close();
    expect(await combobox.isOpen()).toBe(false);
  });
});
```

## API reference {#api-reference}

詳細なAPIドキュメントについては、以下のAPIリファレンスを参照してください。

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)

### 関連するパターンとディレクティブ {#related-patterns-and-directives}

Comboboxは、これらのドキュメント化されたパターンのためのプリミティブディレクティブです:

- [オートコンプリート](guide/aria/autocomplete) - フィルタリングと提案のパターン（入力タイピングとオプションリストを連携）
- [セレクト](guide/aria/select) - 単一選択のドロップダウンパターン（編集不可のボタントリガーに直接適用）
- [マルチセレクト](guide/aria/multiselect) - 複数選択のパターン（複数選択が有効なListboxを持つ編集不可トリガーに適用）

Comboboxは通常、以下と組み合わせて使用されます:

- [Listbox](guide/aria/listbox) - 最も一般的なポップアップコンテンツ
- [Tree](guide/aria/tree) - 階層的なポップアップコンテンツ（例についてはTreeガイドを参照）
