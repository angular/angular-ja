# `<ng-content>` による親コンポーネントからのテンプレートのレンダリング

`<ng-content>` は、マークアップまたはテンプレートフラグメントを受け取って、コンポーネントがコンテンツをレンダリングする方法を制御する特殊な要素です。これは、実際のDOM要素をレンダリングしません。

以下は、親からマークアップを受け取る `BaseButton` コンポーネントの例です。

```angular-ts
// ./base-button/base-button.ts
import {Component} from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `<ng-content />`,
})
export class BaseButton {}
```

```angular-ts
// ./app.ts
import {Component} from '@angular/core';
import {BaseButton} from './base-button';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `<button baseButton>Next <span class="icon arrow-right"></span></button>`,
})
export class App {}
```

詳細については、[`<ng-content>` の詳細ガイド](/guide/components/content-projection) で、このパターンを活用する他の方法を確認してください。
