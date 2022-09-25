# スタンドアロンコンポーネントを使い始める

v14以降では、 **スタンドアロンコンポーネント** は Angular アプリケーションを構築するための簡略化された方法を提供します。スタンドアロンコンポーネント、ディレクティブ、パイプは、 `NgModule`s の必要性を減らすことでオーサリングエクスペリエンスを効率化することを目的としています。既存のアプリケーションは、破壊的な変更を行うことなく、新しいスタンドアロンスタイルをオプションで段階的に採用できます。

<div class="alert is-important">

スタンドアロンコンポーネント機能は、開発者向けプレビューで利用できます。
試していただくことは可能ですが、安定するまでに変更される可能性があります。

</div>

## スタンドアロンコンポーネントの作成

### `standalone` フラグとコンポーネントの `imports`

コンポーネント、ディレクティブ、パイプは `standalone: true` としてマークすることができるようになりました。スタンドアロンとマークされた Angular クラスは `NgModule` の中で宣言する必要はありません（宣言しようとすると Angular コンパイラーはエラーを報告します）。

スタンドアロンコンポーネントは `NgModule`s を介して依存関係を取得する代わりに、直接依存関係を指定します。たとえば、 `PhotoGalleryComponent` がスタンドアロンコンポーネントであれば、別のスタンドアロンコンポーネントである `ImageGridComponent` を直接インポートすることができます:


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
  // コンポーネントロジック
}
```

また、 `imports` はスタンドアロンのディレクティブやパイプを参照するために使用できます。この方法では、テンプレートの依存関係を管理するために `NgModule` を作成することなく、スタンドアロンコンポーネントを作成できます。

### 既存の NgModule をスタンドアロンコンポーネントで使用する

スタンドアロンコンポーネントを作成する場合、コンポーネントのテンプレートで他のコンポーネント、ディレクティブ、またはパイプを使用したい場合があります。これらの依存関係の一部はスタンドアロンとしてマークされていない可能性がありますが、代わりに既存の `NgModule` によって宣言およびエクスポートされます。この場合、 `NgModule` をスタンドアロンコンポーネントに直接インポートできます:

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
  // ロジック
}
```

テンプレート内の既存の `NgModule` ベースのライブラリまたは依存関係をもつスタンドアロンコンポーネントを使用できます。 スタンドアロンコンポーネントは、 Angular ライブラリの既存のエコシステムを最大限に活用できます。

## NgModule ベースのアプリケーションでスタンドアロンコンポーネントを使用する

スタンドアロンコンポーネントは、既存の NgModules ベースのコンテキストにインポートすることもできます。 これにより、既存のアプリケーション (現在 NgModules を使用している) は、新しいスタンドアロン スタイルのコンポーネントを段階的に採用できます。

`NgModule.imports` を使用して、 `NgModule` と同じように、スタンドアロンコンポーネント (またはディレクティブ、またはパイプ) をインポートできます:

```ts
@NgModule({
  declarations: [AlbumComponent],
  exports: [AlbumComponent], 
  imports: [PhotoGalleryComponent],
})
export class AlbumModule {}
```

## スタンドアロンコンポーネントを使用したアプリケーションのブートストラップ

Angular アプリケーションは、スタンドアロンコンポーネントをアプリケーションのルートコンポーネントとして使用することで、`NgModule` なしでブートストラップできます。 これは `bootstrapApplication` API を使用して行われます:

```ts
// main.ts ファイル内
import {bootstrapApplication} from '@angular/platform-browser';
import {PhotoAppComponent} from './app/photo.app.component';

bootstrapApplication(PhotoAppComponent);
```

### 依存性の注入の構成

アプリケーションをブートストラップするとき、 Angular の依存性の注入を構成し、アプリケーション全体で使用する構成値またはサービスを提供したいことがよくあります。 これらをプロバイダーとして  `bootstrapApplication` に渡すことができます:

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    // ...
  ]
});
```

スタンドアロンのブートストラップオペレーションは、依存性の注入のために `Provider` のリストを明示的に構成することに基づいています。 ただし、既存のライブラリは、DI を構成するために `NgModule`s に依存している場合があります。たとえば、Angular のルーターは  `RouterModule.forRoot()` ヘルパーを使用して、アプリケーションでルーティングをセットアップします。 `importProvidersFrom` ユーティリティを介して `bootstrapApplication` でこれらの既存の `NgModule` を使用できます:

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    importProvidersFrom(
      RouterModule.forRoot([/* アプリケーションルート */]),
    ),
    // ...
  ]
});
```

## ルーティングと遅延読み込み

ルーターAPIは、スタンドアロンコンポーネントを利用するために更新および簡素化されました: 多くの一般的な遅延読み込みシナリオでは、 `NgModule` は不要になりました。

### スタンドアロンコンポーネントの遅延読み込み

どのルートも、 `loadComponent` を使用して、ルーティングされたスタンドアロンコンポーネントを遅延ロードできます:

```ts
export const ROUTES: Route[] = [
  {path: 'admin', loadComponent: () => import('./admin/panel.component').then(mod => mod.AdminPanelComponent)},
  // ...
];
```

これは、ロードされたコンポーネントがスタンドアロンである限り機能します。

### 一度に多くのルートを遅延ロードする

`loadChildren` オペレーションは、ルートを宣言するために `RouterModule.forChild` をインポートして遅延ロードする `NgModule` を記述しなくても、子 `Route` の新しいセットのロードをサポートするようになりました。 これは、この方法でロードされたすべてのルートがスタンドアロンコンポーネントを使用している場合に機能します。

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

### ルートのサブセットへのサービスの提供

`NgModule`s (`loadChildren`) の遅延ロード API は、ルートの遅延ロードされた子をロードするときに、新しい「モジュール」インジェクターを作成します。この機能は、アプリケーション内のルートのサブセットにのみサービスを提供するのに役立つことがよくありました。 たとえば、 `/admin` の下のすべてのルートが `loadChildren` 境界を使用して範囲指定されている場合、管理者専用サービスはそれらのルートにのみ提供できます。問題のルートの遅延読み込みが不要であったとしても、これを行うには `loadChildren` API を使用する必要がありました。

ルーターは `Route` 上で追加の `providers` を明示的に指定することをサポートするようになり、遅延ロードや `NgModule` を使用せずに同じスコープを指定できるようになりました。たとえば、 `/admin` のルート構造でスコープされたサービスは、次のようになります:

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: ADMIN_API_KEY, useValue: '12345'},
    ],
    children: [
      path: 'users', component: AdminUsersComponent,
      path: 'teams', component: AdminTeamsComponent,
    ],
  },
  // ... その他のアプリケーションルートは
  // ADMIN_API_KEY または AdminService へのアクセス権がありません。
];
```

`providers` を追加のルーティング設定の `loadChildren` と組み合わせて、`NgModule` を追加のルートとルートレベルのプロバイダーで遅延ロードするのと同じ効果を達成することもできます。 この例では、上記と同じプロバイダー/子ルートを構成しますが、遅延ロードされた境界の背後にあります。

```ts
// メインアプリケーション:
export const ROUTES: Route[] = {
  // admin ルートを遅延ロード
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

すべての子ルート間で共有される `providers` をホストするための空のパスルートを使用することに注意してください。

## 上級者向けトピック

このセクションでは、より高度な使用パターンにのみ関連する詳細について説明します。スタンドアロンコンポーネント、ディレクティブ、およびパイプについてはじめて学習する場合は、このセクションをスキップしても問題ありません。

### ライブラリ作成者向けのスタンドアロンコンポーネント

スタンドアロンコンポーネント、ディレクティブ、およびパイプは、それらをインポートする NgModule からエクスポートできます:

```ts
@NgModule({
  imports: [ImageCarouselComponent, ImageSlideComponent],
  exports: [ImageCarouselComponent, ImageSlideComponent],
})
export class CarouselModule {}
```

このパターンは、協調するディレクティブのセットを発行する Angular ライブラリに役立ちます。上記の例では、 `ImageCarouselComponent` と `ImageSlideComponent` の両方が、1つの論理的な「カルーセルウィジェット」を構築するためにテンプレートに存在する必要があります。

`NgModule` を発行する代わりに、ライブラリの作成者は協調するディレクティブの配列をエクスポートしたいと思うかもしれません:

```ts
export CAROUSEL_DIRECTIVES = [ImageCarouselComponent, ImageSlideComponent] as const;
```

このような配列は、 `NgModule`s を使用するアプリケーションによってインポートされ、 `@NgModule.imports` に追加されます。 TypeScript の `as const` コンストラクトの存在に注意してください。これは、適切なコンパイルに必要な追加情報を Angular コンパイラに提供し、推奨される方法です (これにより、エクスポートされた配列が TypeScript の観点からイミュータブルになるため)。

### 依存性の注入とインジェクターの階層

Angular アプリケーションは、利用可能なプロバイダーのセットを指定することで依存性の注入を構成できます。一般的なアプリケーションでは、2つの異なるインジェクタータイプがあります:

*   **モジュール インジェクター** これは `@NgModule.providers` または `@Injectable({providedIn: "..."})` で構成されたプロバイダーを持ちます。これらのアプリケーション全体のプロバイダーは、モジュールインジェクターで構成された他のサービスだけでなく、すべてのコンポーネントにも表示されます。
*   **ノード インジェクター** これは`@Directive.providers` / `@Component.providers` または `@Component.viewProviders` で構成されています。これらのプロバイダーは、特定のコンポーネントとそのすべての子のみに表示されます。

#### 環境インジェクター

`NgModule`s をオプションにすると、アプリケーション全体のプロバイダー ([HttpClient](https://angular.io/api/common/http/HttpClient) など) を使用して「モジュール」インジェクターを構成する新しい方法が必要になります。スタンドアロンアプリケーション (`bootstrapApplication` で作成されたアプリケーション) では、`providers` オプションで、ブートストラッププロセス中に「モジュール」プロバイダーを構成できます:

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    {provide: PhotosService, useClass: PhotosService},
    // ...
  ]
});
```

新しいブートストラップ API は、 `NgModule`s を使用せずに「モジュールインジェクター」を構成する手段を提供します。この意味で、名前の「モジュール」部分はもはや関連性がなく、新しい用語を導入することにしました: それが、「環境インジェクター」です。

環境インジェクターは、次のいずれかを使用して構成できます。

*   `@NgModule.providers` (`NgModule` によるアプリケーションのブートストラップ)
*   `@Injectable({provideIn: "..."})` (NgModule ベースのアプリケーションと「スタンドアロン」アプリケーションの両方)
*   `bootstrapApplication` の呼び出しにおける `providers` オプション (完全な「スタンドアロン」アプリケーションの場合)
*   `Route` 設定における `providers` フィールド

Angular v14 では、この新しい命名を表す新しい TypeScript タイプ `EnvironmentInjector` が導入されています。付属の `createEnvironmentInjector` API を使用すると、環境インジェクターをプログラムで作成できます:

```ts
import {createEnvironmentInjector} from '@angular/core';

const parentInjector = … // 既存の環境インジェクター
const childInjector = createEnvironmentInjector([{provide: PhotosService, useClass: CustomPhotosService}], parentInjector);
```

環境インジェクターには追加機能が1つあります: 環境インジェクターが作成されたときに初期化ロジックを実行できます (モジュールインジェクターが作成されたときに実行される `NgModule` コンストラクターに似ています):

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

実際には、依存関係インジェクターの階層はスタンドアロンコンポーネントを使用するアプリケーションではもう少し複雑です。次の例を考えてみましょう:

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

上記の例では、コンポーネント `DateModalComponent` はスタンドアロンです - 直接使用することができ、それを使用するためにインポートする必要がある NgModule はありません。ただし、`DateModalComponent` には、その NgModule (`DatePickerModule`) を介してインポートされる `DatePickerComponent` という依存関係があります。この NgModule は、`DatePickerComponent` が正しく機能するために必要なプロバイダー (この場合は `CalendarService`) を宣言しているかもしれません。

Angular がスタンドアロンコンポーネントを作成するとき、現在のインジェクターが、 NgModules に基づくものを含む、スタンドアロンコンポーネントの依存関係に必要なすべてのサービスを持っていることを知る必要があります。それを保証するために、場合によっては、 Angular は現在の環境インジェクターの子として新しい「スタンドアロンインジェクター」を作成します。現在、これはブートストラップされたすべてのスタンドアロンコンポーネントで発生します: それはルートの環境インジェクターの子になるでしょう。動的に作成された (たとえば、ルーターまたは `ViewContainerRef` API によって) スタンドアロンコンポーネントにも同じ規則が適用されます。

スタンドアロンコンポーネントによってインポートされたプロバイダーがアプリケーションの残りの部分から「分離」されるように、個別のスタンドアロンインジェクターが作成されます。これにより、スタンドアロンコンポーネントは、実装の詳細をアプリケーションの残りの部分に「漏らす」ことができない、真に自己完結型の部品と考えることができます。
