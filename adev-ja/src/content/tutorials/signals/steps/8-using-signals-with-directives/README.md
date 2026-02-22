# ディレクティブでのシグナルの使用

[サービスでのシグナルの使用](/tutorials/signals/7-using-signals-with-services)を学んだところで、ディレクティブがどのようにシグナルを使用するかを探ってみましょう。**朗報です。シグナルはコンポーネントと同じようにディレクティブでもまったく同じように機能します！**主な違いは、ディレクティブにはテンプレートがないため、ホスト要素をリアクティブに更新するために、主にホストバインディングでシグナルを使用することです。

このアクティビティでは、シグナルがディレクティブでどのようにリアクティブな動作を作成するかを示すハイライトディレクティブを構築します。

<hr />

<docs-workflow>

<docs-step title="コンポーネントと同じようにシグナルを設定する">
シグナル関数をインポートし、リアクティブな状態を作成します。これはコンポーネントとまったく同じように機能します。

```ts
import {Directive, input, signal, computed} from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  // Signal inputs - same as components!
  color = input<string>('yellow');
  intensity = input<number>(0.3);

  // Internal state - same as components!
  private isHovered = signal(false);

  // Computed signals - same as components!
  backgroundStyle = computed(() => {
    const baseColor = this.color();
    const alpha = this.isHovered() ? this.intensity() : this.intensity() * 0.5;

    const colorMap: Record<string, string> = {
      'yellow': `rgba(255, 255, 0, ${alpha})`,
      'blue': `rgba(0, 100, 255, ${alpha})`,
      'green': `rgba(0, 200, 0, ${alpha})`,
      'red': `rgba(255, 0, 0, ${alpha})`,
    };

    return colorMap[baseColor] || colorMap['yellow'];
  });
}
```

これがコンポーネントのパターンとまったく同じであることに注目してください。唯一の違いは、`@Component`ではなく`@Directive`内にいることです。
</docs-step>

<docs-step title="ホストバインディングでシグナルを使用する">
ディレクティブにはテンプレートがないため、ホスト要素をリアクティブに更新するために**ホストバインディング**でシグナルを使用します。`host`設定とイベントハンドラーを追加します。

```ts
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'backgroundStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // ... signals from previous step ...

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
```

シグナルが変更されると、ホストバインディングは自動的に再評価されます。これはコンポーネントのテンプレートバインディングと同じです！`isHovered`が変更されると、`backgroundStyle`の計算済みシグナルが再計算され、ホストバインディングが要素のスタイルを更新します。
</docs-step>

<docs-step title="テンプレートでディレクティブを使用する">
リアクティブなディレクティブをデモンストレーションするために、アプリのテンプレートを更新します。

```angular-html
template: `
<div>
  <h1>Directive with Signals</h1>

  <div highlight color="yellow" [intensity]="0.2">Hover me - Yellow highlight</div>

  <div highlight color="blue" [intensity]="0.4">Hover me - Blue highlight</div>

  <div highlight color="green" [intensity]="0.6">Hover me - Green highlight</div>
</div>
`,
```

ディレクティブは、シグナル入力に基づいてリアクティブなハイライトを自動的に適用します！
</docs-step>

</docs-workflow>

完璧です！これで、シグナルがディレクティブでどのように機能するかを理解しました。このレッスンの主なポイントは次のとおりです。

- **シグナルは普遍的** - すべてのシグナルAPI（`input()`、`signal()`、`computed()`、`effect()`）は、ディレクティブとコンポーネントの両方で同じように機能します
- **ホストバインディングが主要なユースケース** - ディレクティブにはテンプレートがないため、ホスト要素をリアクティブに修正するためにホストバインディングでシグナルを使用します
- **同じリアクティブパターン** - シグナル更新は、コンポーネントテンプレートと同じように、計算済みシグナルとホストバインディングの自動再評価をトリガーします

次のレッスンでは、[シグナルクエリで子要素をクエリする方法](/tutorials/signals/9-query-child-elements-with-signal-queries)を学びます！
