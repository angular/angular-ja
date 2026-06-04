# サービスの遅延読み込み

IMPORTANT: 遅延読み込みを機能させるには、読み込むサービスが自動プロバイドされている必要があります。`@Injectable({providedIn: 'root'})`または[`@Service()`](guide/di/creating-and-using-services#using-the-service-decorator)のいずれかで装飾してください。自動プロビジョニングがない場合、Angularは読み込み後にサービスを構築する方法がありません。

Angularの`injectAsync`関数を使用すると、実際に必要な場合にのみ、オンデマンドでサービスを読み込むことができます。これは、サービスが大規模なライブラリやめったに使用されない機能に依存しており、初期ページ読み込み時にそのコストを払いたくない場合に便利です。

`injectAsync`を使用すると、サービスのコードはバンドラーによって個別のJavaScriptチャンクに分割され、インスタンスを初めて要求したときにダウンロードされます。読み込みが完了すると、Angularは通常のDIシステムを通じてサービスを解決するため、他の注入可能に依存し続けることができ、他のシングルトンと同様に動作します。

## サービスの遅延インジェクト {#lazily-injecting-a-service}

重いスプレッドシートライブラリに依存する`ReportExporter`を想像してください。ほとんどのユーザーはレポートを開きますが、**Export**をクリックするのはごく一部です。エクスポーターをオンデマンドでロードします:

```angular-ts
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

`this.exporter()`への最初の呼び出しは動的インポートをトリガーし、DIからサービスを解決します。後続の呼び出しは同じPromiseを再利用するため、チャンクは一度だけフェッチされます。

遅延読み込みされるサービスが[デフォルトエクスポート](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export)である場合、動的インポートを直接渡すと、Angularが自動的に`default`をアンラップします:

```ts {header: report-exporter.ts}
@Service()
export default class ReportExporter {
  /* … */
}
```

```ts {header: report.ts}
private exporter = injectAsync(() => import('./report-exporter'));
```

## 依存関係のプリフェッチ {#prefetching-the-dependency}

デフォルトでは、遅延チャンクは返された関数を呼び出したときにのみフェッチされます。オプションで`prefetch`トリガーを渡すことで、ダウンロードをより早く開始できます。トリガーは`Promise`を返す任意の関数であり、それが解決されると、Angularはローダーを起動します。

Angularには、ブラウザがアイドル状態になるまで待機する組み込みトリガーである`onIdle`が同梱されています:

```ts
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({
  /* … */
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter), {
    prefetch: onIdle,
  });
}
```

また、最大の待機時間を指定して`onIdle`を設定できるため、ビジーなページであっても、プリフェッチは常に一定の期間内に実行されます:

```ts
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

NOTE: プリフェッチはオポチュニスティックです。プリフェッチが発火する前にユーザーが機能を呼び出した場合、Angularは依然として依存関係を即座にロードし、準備ができ次第`await`を解決します。

## カスタムプリフェッチトリガーの提供 {#provide-a-custom-prefetch-trigger}

`PrefetchTrigger`はpromiseを返す単なる関数であり、promiseが解決されるとすぐにローダーが実行されます。ホバーやスケジューラのティックなど、独自のシグナルとプリフェッチを同期させるためにこれを使用します:

```ts
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () =>
    new Promise<void>((resolve) => {
      target.addEventListener('pointerenter', () => resolve(), {once: true});
    });
}
```
