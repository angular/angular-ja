# Zone 汚染の解消

**Zone.js** は、Angular がアプリケーションの状態が変更されたことを検知するために使用するシグナルメカニズムです。`setTimeout`、ネットワークリクエスト、イベントリスナーなどの非同期操作を捕捉します。Angular は Zone.js からのシグナルに基づいて変更検知をスケジュールします。

スケジュールされた[タスク](https://developer.mozilla.org/ja/docs/Web/API/HTML_DOM_API/Microtask_guide#%E3%82%BF%E3%82%B9%E3%82%AF)や[マイクロタスク](https://developer.mozilla.org/ja/docs/Web/API/HTML_DOM_API/Microtask_guide#%E3%83%9E%E3%82%A4%E3%82%AF%E3%83%AD%E3%82%BF%E3%82%B9%E3%82%AF)がデータモデルに変更を加えないため、変更検知の実行が不要になるケースがあります。一般的な例としては、
- `requestAnimationFrame`、 `setTimeout` または `setInterval`
- サードパーティライブラリによるタスクまたはマイクロタスクのスケジューリング

このセクションでは、そのような状態を特定する方法と、不要な変更検知の呼び出しを避けるために Angular zone の外でコードを実行する方法について説明します。

## 不要な変更検知の呼び出しを特定

Angular DevTools を使用すると、不要な変更検知の呼び出しを見つけることができます。多くの場合、それらはプロファイラのタイムライン上に、呼び出し元の `setTimeout`、`setInterval`、`requestAnimationFrame`、またはイベントハンドラーの連続したバーとして表示されます。

<div class="lightbox">
  <img alt="Angular DevTools profiler preview showing Zone pollution" src="generated/images/guide/change-detection/zone-pollution.png">
</div>

上の画像では、ある要素に関連するイベントハンドラーによって引き起こされる一連の変更検知の呼び出しがあります。これは、`NgZone`のデフォルトの動作を変更しない、サードパーティの非ネイティブの Angular コンポーネントを使用する場合によくある課題です。


## NgZone の外でタスクを実行

このような場合、[NgZone](https://angular.io/guide/zone) を使って、特定のコードによってスケジュールされたタスクの変更検知を呼び出さないよう Angular に指示することができます。

```ts
import { Component, NgZone, OnInit } from '@angular/core';
@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
  }
}
```

上記のスニペットは、Angular Zone の外で `setInterval` の呼び出しを実行し、`pollForUpdates` の実行後に変更検知をスキップするよう Angular に指示しています。

サードパーティライブラリは、Zone.js を考慮して作成されていないため、一般的に不要な変更検知サイクルを引き起こします。Angular zone の外でライブラリ API を呼び出すことで、これらの余分なサイクルを避けることができます。

```ts
import { Component, NgZone, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

`runOutsideAngular` 内で `Plotly.newPlot('chart', data);` を実行すると、初期化ロジックによってスケジュールされたタスクの実行後に変更検知を実行しないようフレームワークに指示します。

たとえば、 `Plotly.newPlot('chart', data)` が DOM 要素にイベントリスナーを追加した場合、Angular はそのハンドラーの実行後に変更検知を実行しません。

@reviewed 2022-05-04
