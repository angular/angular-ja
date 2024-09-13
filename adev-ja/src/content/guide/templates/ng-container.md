# `<ng-container>` を使用した要素のグループ化

`<ng-container>` はAngularの特別な要素で、複数の要素をグループ化したり、DOMに実際の要素をレンダリングせずにテンプレート内の場所をマークしたりします。

```angular-html
<!-- コンポーネントテンプレート -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- レンダリングされた DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

`<ng-container>` にディレクティブを適用して、テンプレートの一部に動作や設定を追加できます。

Angularは `<ng-container>` に適用されたすべての属性バインディングとイベントリスナー（ディレクティブを介して適用されたものも含む）を無視します。

## `<ng-container>` を使用して動的なコンテンツを表示する

`<ng-container>` は、動的なコンテンツをレンダリングするためのプレースホルダーとして機能できます。

### コンポーネントのレンダリング

Angularの組み込みの `NgComponentOutlet` ディレクティブを使用して、`<ng-container>` の場所にコンポーネントを動的にレンダリングできます。

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => this.isAdmin() ? AdminProfile : BasicUserProfile);
}
```

上記の例では、`NgComponentOutlet` ディレクティブは、`<ng-container>` 要素の場所に `AdminProfile` または `BasicUserProfile` のいずれかを動的にレンダリングします。

### テンプレートフラグメントのレンダリング

Angularの組み込みの `NgTemplateOutlet` ディレクティブを使用して、`<ng-container>` の場所にテンプレートフラグメントを動的にレンダリングできます。

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => this.isAdmin() ? adminTemplate : basicTemplate);
}
```

上記の例では、`ngTemplateOutlet` ディレクティブは、`<ng-container>` 要素の場所に2つのテンプレートフラグメントのいずれかを動的にレンダリングします。

NgTemplateOutletの詳細については、[NgTemplateOutlets API ドキュメントページ](/api/common/NgTemplateOutlet) を参照してください。

## `<ng-container>` を構造ディレクティブで使用

`<ng-container>` 要素に構造ディレクティブを適用できます。この一般的な例として、`ngIf` と `ngFor` があります。

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic></admin-infographic>
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## `<ng-container>` をインジェクションに使用する

Angularの依存性の注入システムの詳細については、依存性の注入ガイドを参照してください。

`<ng-container>` にディレクティブを適用すると、子孫の要素はディレクティブまたはディレクティブが提供するものを注入できます。テンプレートの特定の部分に値を宣言的に提供したい場合に使用します。

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // 'light' または 'dark' を受け取り、デフォルトは 'light' です。
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

上記の例では、`ProfilePic` コンポーネントと `UserBio` コンポーネントは `Theme` ディレクティブを注入し、その `mode` に基づいてスタイルを適用できます。
