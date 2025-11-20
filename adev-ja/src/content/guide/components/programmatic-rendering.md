# コンポーネントのプログラマティックレンダリング

TIP: このガイドは、すでに[基本ガイド](essentials)を読んでいることを前提としています。Angularを初めて使う場合は、まずそちらをお読みください。

テンプレートでコンポーネントを直接使用する以外に、コンポーネントをプログラム的に動的にレンダリングできます。
これは、コンポーネントが最初は不明で(したがってテンプレートで直接参照できない)、何らかの条件に依存する
状況に役立ちます。

プログラム的にコンポーネントをレンダリングする主な方法は2つあります: テンプレートで`NgComponentOutlet`を使用する方法と、
TypeScriptコードで`ViewContainerRef`を使用する方法です。

HELPFUL: 遅延読み込みのユースケース(たとえば、重いコンポーネントの読み込みを遅らせたい場合)については、代わりに組み込みの
[`@defer`機能](/guide/templates/defer)の使用を検討してください。`@defer`機能を使用すると、`@defer`ブロック内のコンポーネント、ディレクティブ、パイプのコードが
自動的に別のJavaScriptチャンクに抽出され、設定されたトリガーに基づいて必要な場合にのみ
読み込まれます。

## NgComponentOutletの使用

`NgComponentOutlet`は、テンプレートで指定されたコンポーネントを動的にレンダリングする
構造ディレクティブです。

```angular-ts
@Component({ ... })
export class AdminBio { /* ... */ }

@Component({ ... })
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Profile for {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}
```

ディレクティブの機能の詳細については、[NgComponentOutlet APIリファレンス](api/common/NgComponentOutlet)を
参照してください。

## ViewContainerRefの使用

**ビューコンテナ**は、Angularのコンポーネントツリー内のノードで、コンテンツを含むことができます。任意のコンポーネント
またはディレクティブは`ViewContainerRef`を注入して、DOM内のそのコンポーネントまたはディレクティブの位置に対応する
ビューコンテナへの参照を取得できます。

`ViewContainerRef`の`createComponent`メソッドを使用して、コンポーネントを動的に作成およびレンダリングできます。
`ViewContainerRef`で新しいコンポーネントを作成すると、Angularはそれを、`ViewContainerRef`を注入したコンポーネント
またはディレクティブの次の兄弟としてDOMに追加します。

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `
    This is the leaf content
  `,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>This is the start of the outer container</p>
    <inner-item />
    <p>This is the end of the outer container</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `
    <button (click)="loadContent()">Load content</button>
  `,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

上記の例では、「Load content」ボタンをクリックすると、次のDOM構造になります

```angular-html
<outer-container>
  <p>This is the start of the outer container</p>
  <inner-item>
    <button>Load content</button>
  </inner-item>
  <leaf-content>This is the leaf content</leaf-content>
  <p>This is the end of the outer container</p>
</outer-container>
```

## コンポーネントの遅延読み込み

HELPFUL: コンポーネントを遅延読み込みしたい場合は、代わりに組み込みの[`@defer`機能](/guide/templates/defer)の使用を検討してください。

`@defer`機能でカバーされていないユースケースの場合は、標準のJavaScript [動的インポート](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import)と
一緒に`NgComponentOutlet`または`ViewContainerRef`を使用できます。

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Load advanced settings
        </button>
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: {new(): AdvancedSettings} | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}
```

上記の例では、ボタンクリックを受け取ると`AdvancedSettings`を読み込んで表示します。

## 作成時のインプット、アウトプットのバインディングとホストディレクティブの設定

コンポーネントを動的に作成する場合、手動でインプットを設定し、アウトプットを購読するのはエラーが発生しやすくなります。コンポーネントがインスタンス化された後にバインディングを接続するためだけに、余分なコードを記述する必要があることがよくあります。

これを簡素化するために、`createComponent`と`ViewContainerRef.createComponent`の両方が、`inputBinding()`、`outputBinding()`、`twoWayBinding()`などのヘルパーを使用した`bindings`配列を渡して、インプットとアウトプットを事前に設定できるようにサポートしています。また、ホストディレクティブを適用するための`directives`配列を指定できます。これにより、単一の宣言的な呼び出しで、テンプレートのようなバインディングでコンポーネントをプログラム的に作成できます。

### `ViewContainerRef.createComponent`を使用したホストビュー

`ViewContainerRef.createComponent`はコンポーネントを作成し、そのホストビューとホスト要素をコンテナのビュー階層内のコンテナの位置に自動的に挿入します。動的コンポーネントがコンテナの論理的および視覚的な構造の一部になる場合(たとえば、リストアイテムやインラインUIの追加)に使用します。

対照的に、スタンドアロンの`createComponent` APIは、新しいコンポーネントを既存のビューやDOM位置にアタッチしません。`ComponentRef`を返し、
コンポーネントのホスト要素を配置する場所を明示的に制御できます。

```angular-ts
import { Component, input, model, output } from "@angular/core";

@Component({
  selector: 'app-warning',
  template: `
      @if(isExpanded()) {
        <section>
            <p>Warning: Action needed!</p>
            <button (click)="close.emit(true)">Close</button>
        </section>
      }
  `
})
export class AppWarningComponent {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import { Component, ViewContainerRef, signal, inputBinding, outputBinding, twoWayBinding, inject } from '@angular/core';
import { FocusTrap } from "@angular/cdk/a11y";
import { ThemeDirective } from '../theme.directive';

@Component({
  template: `<ng-container #container />`
})
export class HostComponent {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarningComponent, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        })
      ],
      directives: [
        FocusTrap,
        { type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')] }
      ]
    });
  }
}
```

上記の例では、動的な**AppWarningComponent**は、`canClose`インプットがリアクティブシグナルにバインドされ、`isExpanded`状態で双方向バインディングが行われ、`close`のアウトプットリスナーが設定されて作成されます。`FocusTrap`と`ThemeDirective`は、`directives`を介してホスト要素にアタッチされます。

### `createComponent` + `hostElement`で`document.body`にアタッチされたポップアップ

現在のビュー階層の外側にレンダリングする場合(オーバーレイなど)に使用します。提供された`hostElement`がDOM内のコンポーネントのホストになるため、Angularはセレクターに一致する新しい要素を作成しません。**bindings**を直接設定できます。

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
} from '@angular/core';
import { PopupComponent } from './popup.component';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // ポップアップ用のホスト要素を作成
    const host = document.createElement('popup-host');

    // コンポーネントを作成し、1回の呼び出しでバインド
    const ref = createComponent(PopupComponent, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }),
      ],
    });

    // 変更検知サイクルに参加するようにコンポーネントのビューを登録します。
    this.appRef.attachView(ref.hostView);
    // 提供されたホスト要素をDOM(通常のAngularビュー階層の外側)に挿入します。これにより、ポップアップが画面に表示されます。通常、オーバーレイやモーダルに使用されます。
    document.body.appendChild(host);
  }
}
```

