# コンポーネントの高度な設定

Tip: このガイドでは、すでに[基本概念のガイド](essentials)を読んでいることを前提としています。Angularを初めて使用する場合は、最初にそちらを読んでください。

## ChangeDetectionStrategy

`@Component` デコレーターは、コンポーネントの**変更検知モード**を制御する `changeDetection` オプションを受け取ります。
変更検知モードには2つのオプションがあります。

**`ChangeDetectionStrategy.Default`** は、名前が示す通り、デフォルトの戦略です。
このモードでは、Angularは、アプリケーション全体で何か活動が行われた可能性があるたびに、
コンポーネントのDOMが更新を必要とするかどうかを確認します。
このチェックをトリガーする活動には、ユーザー操作、ネットワーク応答、タイマーなどがあります。

**`ChangeDetectionStrategy.OnPush`** は、Angularが実行する必要があるチェックの量を減らすオプションのモードです。
このモードでは、フレームワークは、コンポーネントのDOMが更新を必要とするかどうかを次の場合にのみ確認します。

- コンポーネントの入力に、テンプレートのバインディングの結果として変更があった場合、または
- このコンポーネントのイベントリスナーが実行された場合
- コンポーネントが `ChangeDetectorRef.markForCheck` またはそれをラップする何か（`AsyncPipe` など）を介して、明示的にチェックのためにマークされている場合

さらに、OnPushコンポーネントがチェックされると、
Angularはアプリケーションツリーを上向きにたどりながら、すべての祖先コンポーネントもチェックします。

## PreserveWhitespaces

デフォルトでは、Angularはテンプレート内の余分な空白を削除し、折りたたみます。
これは、改行やインデントから最もよく見られます。
この設定は、コンポーネントのメタデータで `preserveWhitespaces` を明示的に `true` に設定することで変更できます。

## カスタム要素スキーマ

デフォルトでは、Angularは未知のHTML要素に出会うとエラーをスローします。
コンポーネントのメタデータの `schemas` プロパティに
`CUSTOM_ELEMENTS_SCHEMA` を含めることで、この動作を無効にできます。

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component></some-unknown-component>'
})
export class ComponentWithCustomElements { }
```

Angularは、現時点で他のスキーマをサポートしていません。
