<docs-decorative-header title="Angular Aria">
</docs-decorative-header>

## Angular Ariaとは？ {#what-is-angular-aria}

アクセシブルなコンポーネントの構築は一見簡単そうですが、W3Cアクセシビリティガイドラインに従って実装するには、多大な労力とアクセシビリティの専門知識が必要です。

Angular Ariaは、一般的なWAI-ARIAパターンを実装する、ヘッドレスでアクセシブルなディレクティブのコレクションです。ディレクティブはキーボードインタラクション、ARIA属性、フォーカス管理、スクリーンリーダーのサポートを処理します。あなたがすべきことは、HTML構造、CSSスタイリング、ビジネスロジックを提供することだけです！

## インストール {#installation}

```shell
npm install @angular/aria
```

## ショーケース {#showcase}

例えば、ツールバーメニューを例に考えてみましょう。特定のロジックに結びついた「単純な」ボタンの列に見えるかもしれませんが、アクセシビリティに不慣れな人にとって、キーボードナビゲーションやスクリーンリーダーは多くの予期せぬ複雑さを加えます。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

この1つのシナリオでは、開発者は次の点を考慮する必要があります：

- **キーボードナビゲーション**。ユーザーはEnterキーまたはSpaceキーでメニューを開き、矢印キーでオプションを移動し、Enterキーで選択し、Escapeキーで閉じる必要があります。
- **スクリーンリーダー**は、メニューの状態、オプションの数、そしてどのオプションにフォーカスが当たっているかを読み上げる必要があります。
- **フォーカス管理**は、トリガーとメニューアイテムの間で論理的に移動する必要があります。
- **右から左へ記述する言語**は、逆方向にナビゲートする機能を必要とします。

## 含まれているもの {#whats-included}

Angular Ariaには、一般的なインタラクティブパターンに対応するディレクティブが含まれています:

| Component                               | 説明                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion)       | 個別に、または排他的に展開できる折りたたみ可能なコンテンツパネル         |
| [Autocomplete](guide/aria/autocomplete) | ユーザーが入力するにつれて表示される、フィルタリングされたサジェスト付きのテキスト入力 |
| [Combobox](guide/aria/combobox)         | テキスト入力とポップアップを連携させるプリミティブなディレクティブ             |
| [Grid](guide/aria/grid)                 | セル単位のキーボードナビゲーションを備えた2次元のデータ表示            |
| [Listbox](guide/aria/listbox)           | キーボードナビゲーション付きの単一選択または複数選択のオプションリスト       |
| [Menu](guide/aria/menu)                 | ネストされたサブメニューとキーボードショートカットを持つドロップダウンメニュー     |
| [Menubar](guide/aria/menubar)           | 永続的なアプリケーションメニュー用の水平ナビゲーションバー            |
| [Multiselect](guide/aria/multiselect)   | コンパクトな表示を持つ複数選択のドロップダウンパターン                   |
| [Select](guide/aria/select)             | キーボードナビゲーション付きの単一選択のドロップダウンパターン             |
| [Tabs](guide/aria/tabs)                 | 自動または手動のアクティベーションモードを持つタブ付きインターフェース         |
| [Toolbar](guide/aria/toolbar)           | 論理的なキーボードナビゲーションを持つ、グループ化されたコントロールのセット     |
| [Tree](guide/aria/tree)                 | 展開/折りたたみ機能を持つ階層的なリスト                                |

各コンポーネントには、包括的なドキュメント、動作するサンプル、およびAPIリファレンスが含まれています。

## Angular Ariaを使用する場面 {#when-to-use-angular-aria}

Angular Ariaは、カスタムスタイリングを施したWCAG準拠のアクセシブルなインタラクティブコンポーネントが必要な場合にうまく機能します。例は次のとおりです:

- **デザインシステムの構築** - チームが、アクセシブルな実装を必要とする特定の視覚的標準を持つコンポーネントライブラリを管理している場合
- **エンタープライズコンポーネントライブラリ** - 組織内の複数のアプリケーション向けに再利用可能なコンポーネントを作成している場合
- **カスタムブランド要件** - インターフェースが、事前にスタイル付けされたコンポーネントライブラリでは容易に対応できない、正確なデザイン仕様に一致する必要がある場合

## Angular Ariaを使用すべきでない場合 {#when-not-to-use-angular-aria}

Angular Ariaはすべてのシナリオに適しているわけではありません:

- **事前にスタイル付けされたコンポーネント** - カスタムスタイルなしで完成された見た目のコンポーネントが必要な場合は、代わりにAngular Materialを使用してください
- **シンプルなフォーム** - `<button>`や`<input type="radio">`のようなネイティブHTMLフォームコントロールは、単純なユースケースに対して組み込みのアクセシビリティを提供します
- **ラピッドプロトタイピング** - コンセプトを迅速に検証する場合、事前にスタイル付けされたコンポーネントライブラリは初期開発の時間を短縮します

## 次のステップ {#next-steps}

コンポーネントガイドを調べて、ニーズに合ったパターンを見つけてください:

**検索と選択**

- Autocomplete - ユーザーの入力に応じてオプションを検索・フィルタリングします
- Listbox - リストから1つまたは複数の項目を選択します
- Select - オプションのリストから1つのオプションを選択します
- Multiselect - オプションのリストから1つのオプションを選択します

**ナビゲーションとCTA**

- Menu - ネスト可能なサブメニューを持つアクションメニュー
- Tabs - 関連するコンテンツパネルを切り替えます
- Toolbar - 関連するコントロールとアクションをグループ化します

**コンテンツの構成**

- Accordion - コンテンツのセクションを表示・非表示にします
- Tree - 階層的なデータ構造を表示します
  データ表示
- Grid - 表形式のデータをナビゲートし、操作します
