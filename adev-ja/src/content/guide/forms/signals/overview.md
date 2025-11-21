<docs-decorative-header title="Angularシグナルを使ったフォーム" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

CRITICAL: シグナルフォームは[実験的](/reference/releases#experimental)です。APIは将来のリリースで変更される可能性があります。リスクを理解せずに本番アプリケーションで実験的なAPIを使用することは避けてください。

シグナルフォームは、シグナルのリアクティブな基盤の上に構築することで、Angularアプリケーションのフォーム状態を管理できる実験的なライブラリです。自動双方向バインディング、型安全なフィールドアクセス、スキーマベースのバリデーションにより、シグナルフォームは堅牢なフォームの作成を支援します。

TIP: シグナルフォームの簡単な紹介については、[シグナルフォームエッセンシャルガイド](essentials/signal-forms)を参照してください。

## なぜシグナルフォームなのか？ {#why-signal-forms}

Webアプリケーションにおけるフォームの構築には、フィールドの値の追跡、ユーザー入力の検証、エラーステートの処理、UIとデータモデルの同期といった、相互に関連するいくつかの懸念事項の管理が含まれます。これらの懸念事項を個別に管理すると、ボイラープレートコードと複雑さが生じます。

シグナルフォームは、以下の方法でこれらの課題に対処します:

- **状態を自動的に同期** - フォームのデータモデルを、バインドされたフォームフィールドと自動的に同期します
- **型安全性の提供** - UIコントロールとデータモデル間の完全に型安全なスキーマとバインディングをサポートします
- **バリデーションロジックの集約** - バリデーションスキーマを使用して、すべてのバリデーションルールを1か所で定義します

シグナルフォームは、シグナルを使用して構築された新しいアプリケーションで最適に機能します。リアクティブフォームを使用している既存のアプリケーションで作業している場合や、本番環境での安定性の保証が必要な場合は、リアクティブフォームが依然として確実な選択肢です。

<!-- TODO: UNCOMMENT SECTION BELOW WHEN AVAILABLE -->
<!-- NOTE: If you're coming from template or reactive forms, you may be interested in our [comparison guide](guide/forms/signals/comparison). -->

## 前提条件 {#prerequisites}

シグナルフォームには以下が必要です:

- Angular v21以降

## セットアップ {#setup}

シグナルフォームはすでに`@angular/forms`パッケージに含まれています。`@angular/forms/signals`から必要な関数とディレクティブをインポートします:

```ts
import { form, Field, required, email } from '@angular/forms/signals'
```

`Field`ディレクティブは、フォームフィールドをHTML入力にバインドするすべてのコンポーネントにインポートする必要があります:

```ts
@Component({
  // ...
  imports: [Field],
})
```

<!-- TODO: UNCOMMENT SECTION BELOW WHEN AVAILABLE -->
<!-- ## Next steps

To learn more about how Signal Forms work, check out the following guides:

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="Signal forms essentials" />
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
</docs-pill-row> -->
