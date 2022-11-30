# スタンドアロンコンポーネント入門

 **スタンドアロンコンポーネント** は Angular アプリケーションを構築するための簡略化された方法を提供します。スタンドアロンコンポーネント、ディレクティブ、パイプは、 `NgModule` の必要性を減らすことでオーサリングエクスペリエンスを効率化することを目的としています。既存のアプリケーションは、破壊的な変更を行うことなく、新しいスタンドアロンスタイルをオプションで段階的に採用できます。

## スタンドアロンコンポーネントの作成

<iframe width="560" height="315" src="https://www.youtube.com/embed/x5PZwb4XurU" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### `standalone` フラグとコンポーネントの `imports`

コンポーネント、ディレクティブ、パイプは `standalone: true` としてマークすることができるようになりました。スタンドアロンとマークされた Angular クラスは `NgModule` の中で宣言する必要はありません（宣言しようとすると Angular コンパイラはエラーを報告します）。

スタンドアロンコンポーネントは `NgModule` を介して依存関係を取得する代わりに、直接依存関係を指定します。たとえば、 `PhotoGalleryComponent` がスタンドアロンコンポーネントであれば、別のスタンドアロンコンポーネントである `ImageGridComponent` を直接インポートすることができます。


```ts
@Component({
  standalone: true,
  selector: 'photo-gallery',
  imports: [ImageGridComponent],
  template: `
    ... <image-grid [images]="imageList"></image-grid>
  `,
})
export class PhotoGalleryComponent {
  // コンポーネントのロジック
}
```

また、 `imports` はスタンドアロンのディレクティブやパイプを参照するために使用できます。この方法では、テンプレートの依存関係を管理するために `NgModule` を作成することなく、スタンドアロンコンポーネントを作成できます。

### 既存の NgModule をスタンドアロンコンポーネントで使用する

スタンドアロンコンポーネントを作成する場合、コンポーネントのテンプレートで他のコンポーネント、ディレクティブ、パイプを使用したい場合があります。これらの依存関係の一部はスタンドアロンとしてマークされていない可能性がありますが、代わりに既存の `NgModule` によって宣言およびエクスポートされます。この場合、 `NgModule` をスタンドアロンコンポーネントに直接インポートできます。

```ts
@Component({
  standalone: true,
  selector: 'photo-gallery',
  // 既存のモジュールがスタンドアロンコンポーネントに直接インポートされる
  imports: [MatButtonModule],
  template: `
    ...
    <button mat-button>Next Page</button>
  `,
})
export class PhotoGalleryComponent {
  // コンポーネントのロジック
}
```

テンプレート内の既存の `NgModule` ベースのライブラリや依存関係をもつスタンドアロンコンポーネントを使用できます。 スタンドアロンコンポーネントは、 Angular ライブラリの既存のエコシステムを最大限に活用できます。

## NgModule ベースのアプリケーションでスタンドアロンコンポーネントを使用する

スタンドアロンコンポーネントは、既存の NgModules ベースのコンテキストにインポートすることもできます。 これにより、既存のアプリケーション (現在 NgModules を使用している) は、新しいスタンドアロンスタイルのコンポーネントを段階的に採用できます。

`NgModule.imports` を使用して、 `NgModule` と同じように、スタンドアロンコンポーネント (ディレクティブ、パイプ) をインポートできます。

```ts
@NgModule({
  declarations: [AlbumComponent],
  exports: [AlbumComponent], 
  imports: [PhotoGalleryComponent],
})
export class AlbumModule {}
```

## スタンドアロンコンポーネントを使用したアプリケーションのブートストラップ

Angular アプリケーションは、スタンドアロンコンポーネントをアプリケーションのルートコンポーネントとして使用することで、`NgModule` なしでブートストラップできます。 これは `bootstrapApplication` API を使用して行われます。

```ts
// main.ts ファイル内
import {bootstrapApplication} from '@angular/platform-browser';
import {PhotoAppComponent} from './app/photo.app.component';

bootstrapApplication(PhotoAppComponent);
```

### 依存性の注入の構成

アプリケーションをブートストラップするとき、 Angular の依存性の注入を構成し、アプリケーション全体で使用する設定値やサービスを提供したいことがよくあります。 これらをプロバイダーとして  `bootstrapApplication` に渡すことができます。

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    // ...
  ]
});
```

スタンドアロンのブートストラップオペレーションは、依存性の注入のために `Provider` のリストを明示的に構成することに基づいています。Angularが提供する `provide` プレフィックス付きの関数を使用すると、NgModuleをインポートせずに異なるシステムを構成することができます。たとえば、`provideRouter`はルーターを設定するために `RouterModule.forRoot` の代わりに使用されます。

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    provideRouter([/* app routes */]),
    // ...
  ]
});
```

多くのサードパーティーライブラリも、この `provide` 機能の設定パターンをサポートするように更新されました。もし、ライブラリが DI 構成のために NgModule API だけを提供しているなら、 `importProvidersFrom` ユーティリティを使って、 `bootstrapApplication` や他のスタンドアロンコンテキストで使用することができます。

```ts
import {LibraryModule} from 'ngmodule-based-library';

bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    importProvidersFrom(
      LibraryModule.forRoot()
    ),
  ]
});
```

## ルーティングと遅延読み込み

ルーターAPIは、スタンドアロンコンポーネントを利用するために更新および簡素化されました。多くの一般的な遅延読み込みのシナリオでは、 `NgModule` は不要になりました。

### スタンドアロンコンポーネントの遅延読み込み

どのルートも、 `loadComponent` を使用して、ルーティングされたスタンドアロンコンポーネントを遅延読み込みできます。

```ts
export const ROUTES: Route[] = [
  {path: 'admin', loadComponent: () => import('./admin/panel.component').then(mod => mod.AdminPanelComponent)},
  // ...
];
```

これは、読み込まれたコンポーネントがスタンドアロンである限り機能します。

### 一度に多くのルートを遅延読み込みする

`loadChildren` オペレーションは、ルートを宣言するために `RouterModule.forChild` をインポートして遅延読み込みする `NgModule` を記述しなくても、子 `Route` の新しいセットの読み込みをサポートするようになりました。 これは、この方法で読み込まれたすべてのルートがスタンドアロンコンポーネントを使用している場合に機能します。

```ts
// メインアプリケーションでは:
export const ROUTES: Route[] = [
  {path: 'admin', loadChildren: () => import('./admin/routes').then(mod => mod.ADMIN_ROUTES)},
  // ...
];

// admin/routes.ts では:
export const ADMIN_ROUTES: Route[] = [
  {path: 'home', component: AdminHomeComponent},
  {path: 'users', component: AdminUsersComponent},
  // ...
];
```

### Lazy loading and default exports

When using `loadChildren` and `loadComponent`, the router understands and automatically unwraps dynamic `import()` calls with `default` exports. You can take advantage of this to skip the `.then()` for such lazy loading operations.

```ts
// In the main application:
export const ROUTES: Route[] = [
  {path: 'admin', loadChildren: () => import('./admin/routes')},
  // ...
];

// In admin/routes.ts:
export default [
  {path: 'home', component: AdminHomeComponent},
  {path: 'users', component: AdminUsersComponent},
  // ...
] as Route[];
```


### ルートのサブセットへのサービスの提供

`NgModule` (`loadChildren`) の遅延読み込み API は、ルートの子を遅延読み込みするときに、新しい「モジュール」インジェクターを作成します。この機能は、アプリケーション内のルートのサブセットにのみサービスを提供するのに役立つことがよくありました。 たとえば、 `/admin` の下のすべてのルートが `loadChildren` の境界を使用して範囲指定されている場合、管理者専用サービスはそれらのルートにのみ提供できます。問題のルートの遅延読み込みが不要であったとしても、これを行うには `loadChildren` API を使用する必要がありました。

ルーターは `Route` 上で追加の `providers` を明示的に指定することをサポートするようになり、遅延読み込みや `NgModule` を使用せずに同じスコープを指定できるようになりました。たとえば、 `/admin` のルート構造でスコープされたサービスは、次のようになります。

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: ADMIN_API_KEY, useValue: '12345'},
    ],
    children: [
      {path: 'users', component: AdminUsersComponent},
      {path: 'teams', component: AdminTeamsComponent},
    ],
  },
  // ... その他のルーティング設定は
  // ADMIN_API_KEY または AdminService へのアクセス権がありません。
];
```

`providers` を追加のルーティング設定の `loadChildren` と組み合わせて、`NgModule` を追加のルートとルートレベルのプロバイダーで遅延読み込みするのと同じ効果を達成することもできます。 この例では、上記と同じプロバイダー/子ルートを構成しますが、遅延読み込みされた境界の後ろにあります。

```ts
// メインアプリケーション:
export const ROUTES: Route[] = {
  // admin ルートを遅延読み込み
  {path: 'admin', loadChildren: () => import('./admin/routes').then(mod => mod.ADMIN_ROUTES)},
  // ... 残りのルート
}

// admin/routes.ts では:
export const ADMIN_ROUTES: Route[] = [{
  path: '',
  pathMatch: 'prefix',
  providers: [
    AdminService,
    {provide: ADMIN_API_KEY, useValue: 12345},
  ],
  children: [
    {path: 'users', component: AdminUsersCmp},
    {path: 'teams', component: AdminTeamsCmp},
  ],
}];
```

すべての子ルート間で共有される `providers` をホストするためには、空のパスルートを使用することに注意してください。

`importProvidersFrom` can be used to import existing NgModule-based DI configuration into route `providers` as well.

## 上級者向けトピック

このセクションでは、より高度な使用パターンにのみ関連する詳細について説明します。スタンドアロンコンポーネント、ディレクティブ、パイプについてはじめて学習する場合は、このセクションをスキップしても問題ありません。

### ライブラリ作成者向けのスタンドアロンコンポーネント

スタンドアロンコンポーネント、ディレクティブ、パイプは、それらをインポートする `NgModule` からエクスポートできます。

```ts
@NgModule({
  imports: [ImageCarouselComponent, ImageSlideComponent],
  exports: [ImageCarouselComponent, ImageSlideComponent],
})
export class CarouselModule {}
```

このパターンは、協調するディレクティブのセットを発行する Angular ライブラリに役立ちます。上記の例では、 `ImageCarouselComponent` と `ImageSlideComponent` の両方が、1つの論理的な「カルーセルウィジェット」を構築するためにテンプレートに存在する必要があります。

`NgModule` を公開する代わりに、ライブラリの作成者は協調するディレクティブの配列をエクスポートしたいと思うかもしれません。

```ts
export const CAROUSEL_DIRECTIVES = [ImageCarouselComponent, ImageSlideComponent] as const;
```

このような配列は、 `NgModule` を使用するアプリケーションによってインポートされ、 `@NgModule.imports` に追加されます。 TypeScript の `as const` 構成の存在に注意してください。これは、適切なコンパイルに必要な追加情報を Angular コンパイラに提供し、推奨される方法です (これにより、エクスポートされた配列が TypeScript の観点からイミュータブルになるため)。

### 依存性の注入とインジェクターの階層

Angular アプリケーションは、利用可能なプロバイダーのセットを指定することで依存性の注入を構成できます。一般的なアプリケーションでは、2つの異なるインジェクタータイプがあります。

*   **モジュール インジェクター** これは `@NgModule.providers` または `@Injectable({providedIn: "..."})` で構成されたプロバイダーを持ちます。これらのアプリケーション全体のプロバイダーは、モジュールインジェクターで構成された他のサービスだけでなく、すべてのコンポーネントにも表示されます。
*   **ノード インジェクター** これは `@Directive.providers` / `@Component.providers` または `@Component.viewProviders` で構成されています。これらのプロバイダーは、特定のコンポーネントとそのすべての子のみに表示されます。

#### 環境インジェクター {@a environment-injectors}

`NgModule` をオプショナルにすると、アプリケーション全体のプロバイダー ([HttpClient](https://angular.io/api/common/http/HttpClient) など) を使用して「モジュール」インジェクターを構成する新しい方法が必要になります。スタンドアロンアプリケーション (`bootstrapApplication` で作成されたアプリケーション) では、`providers` オプションで、ブートストラッププロセス中に「モジュール」プロバイダーを構成できます。

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    {provide: PhotosService, useClass: PhotosService},
    // ...
  ]
});
```

新しいブートストラップ API は、 `NgModule` を使用せずに「モジュールインジェクター」を構成する手段を提供します。この意味で、名前の「モジュール」部分はもはや関連性がなく、新しい用語を導入することにしました。それが、「環境インジェクター」です。

環境インジェクターは、次のいずれかを使用して構成できます。

*   `@NgModule.providers` (`NgModule` によるアプリケーションのブートストラップ)
*   `@Injectable({provideIn: "..."})` (NgModule ベースのアプリケーションと「スタンドアロン」アプリケーションの両方)
*   `bootstrapApplication` の呼び出しにおける `providers` オプション (完全な「スタンドアロン」アプリケーションの場合)
*   `Route` 設定における `providers` フィールド

Angular v14 では、この新しい命名を表す新しい TypeScript の型`EnvironmentInjector` が導入されています。付属の `createEnvironmentInjector` API を使用すると、環境インジェクターをプログラムで作成できます。

```ts
import {createEnvironmentInjector} from '@angular/core';

const parentInjector = … // 既存の環境インジェクター
const childInjector = createEnvironmentInjector([{provide: PhotosService, useClass: CustomPhotosService}], parentInjector);
```

環境インジェクターには追加機能が1つあります。環境インジェクターが作成されたときに初期化ロジックを実行できます (モジュールインジェクターが作成されたときに実行される `NgModule` コンストラクターに似ています)。

```ts
import {createEnvironmentInjector, ENVIRONMENT_INITIALIZER} from '@angular/core';

createEnvironmentInjector([
{provide: PhotosService, useClass: CustomPhotosService},
{provide: ENVIRONMENT_INITIALIZER, useValue: () => {
        console.log("This function runs when this EnvironmentInjector gets created");
}}
]);
```

#### スタンドアロンインジェクター

実際には、依存関係インジェクターの階層はスタンドアロンコンポーネントを使用するアプリケーションではもう少し複雑です。次の例を考えてみましょう。

```ts
// NgModule を持つ既存の「datepicker」コンポーネント
@Component({
        selector: 'datepicker',
        template: '...',
})
class DatePickerComponent {
  constructor(private calendar: CalendarService) {}
}

@NgModule({
        declarations: [DatePickerComponent],
        exports: [DatePickerComponent]
        providers: [CalendarService],
})
class DatePickerModule {
}

@Component({
        selector: 'date-modal',
        template: '<datepicker></datepicker>',
        standalone: true,
        imports: [DatePickerModule]
})
class DateModalComponent {
}
```

上記の例では、コンポーネント `DateModalComponent` はスタンドアロンです。直接使用することができ、それを使用するためにインポートする必要がある NgModule はありません。ただし、`DateModalComponent` には、その NgModule (`DatePickerModule`) を介してインポートされる `DatePickerComponent` という依存関係があります。この NgModule は、`DatePickerComponent` が正しく機能するために必要なプロバイダー (この場合は `CalendarService`) を宣言しているかもしれません。

Angular がスタンドアロンコンポーネントを作成するとき、現在のインジェクターが、 NgModules に基づくものを含む、スタンドアロンコンポーネントの依存関係に必要なすべてのサービスを持っていることを知る必要があります。それを保証するために、場合によっては、 Angular は現在の環境インジェクターの子として新しい「スタンドアロンインジェクター」を作成します。現在、これはブートストラップされたすべてのスタンドアロンコンポーネントで発生します。それはルートの環境インジェクターの子になるでしょう。動的に作成された (たとえば、ルーターまたは `ViewContainerRef` API によって) スタンドアロンコンポーネントにも同じ規則が適用されます。

スタンドアロンインジェクターは、スタンドアロンコンポーネントによってインポートされたプロバイダーがアプリケーションの残りの部分から「分離」されることを保証するために作成されます。これにより、スタンドアロンコンポーネントは、実装の詳細をアプリケーションの残りの部分に「漏らす」ことができない、真に自己完結した部分であると考えることができます。
