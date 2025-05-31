# プログラムでコンポーネントをレンダリングする

TIP: このガイドでは、[基本概念のガイド](essentials)をすでに読んでいることを前提としています。Angularを初めて使用する場合は、まずこのガイドを読んでください。

コンポーネントはテンプレートで直接使用できるだけでなく、動的にもレンダリングできます。
コンポーネントを動的にレンダリングする主な方法は2つあります。
テンプレートで`NgComponentOutlet`を使用するか、TypeScriptコードで`ViewContainerRef`を使用します。

## NgComponentOutletを使用する

`NgComponentOutlet`は、
テンプレートで指定されたコンポーネントを動的にレンダリングする構造ディレクティブです。

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
    return this.user.isAdmin ? AdminBio : StandardBio;
  }
}
```

ディレクティブの機能の詳細については、
[NgComponentOutlet APIリファレンス](api/common/NgComponentOutlet)を参照してください。

## ViewContainerRefを使用する

**ビューコンテナ**は、Angularのコンポーネントツリー内のコンテンツを含むことができるノードです。
どのコンポーネントまたはディレクティブでも`ViewContainerRef`を注入して、
DOM内のそのコンポーネントまたはディレクティブの場所に対応するビューコンテナへの参照を取得できます。

`ViewContainerRef`の`createComponent`メソッドを使用すると、コンポーネントを動的に作成してレンダリングできます。
`ViewContainerRef`で新しいコンポーネントを作成すると、
Angularはそのコンポーネントを、`ViewContainerRef`を注入したコンポーネントまたはディレクティブの次の兄弟としてDOMに追加します。

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

上記の例では、「コンテンツの読み込み」ボタンをクリックすると、次のDOM構造が生成されます。

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

上記で説明した`NgComponentOutlet`と`ViewContainerRef`の両方の方法を使用して、
標準のJavaScript [動的インポート](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import)で
遅延読み込みされるコンポーネントをレンダリングできます。

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
      <button (click)="loadAdvanced()" *ngIf="!advancedSettings">
        Load advanced settings
      </button>
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

上記の例では、ボタンをクリックすると`AdvancedSettings`が読み込まれて表示されます。
