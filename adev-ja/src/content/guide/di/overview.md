<docs-decorative-header title="Angularの依存性の注入" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

依存性の注入 (DI) は、アプリケーション全体でコードを整理し共有するために使用される設計パターンです。
</docs-decorative-header>

TIP: この包括的なガイドに取り組む前に、Angularの [基本ガイド](essentials/dependency-injection) を確認してください。

アプリケーションが成長するにつれて、開発者はコードベースのさまざまな部分で機能を再利用し共有する必要がでてきます。[依存性の注入 (DI)](https://en.wikipedia.org/wiki/Dependency_injection) は、さまざまな部分に機能を「注入」できるようにすることで、アプリケーション全体でコードを整理し共有するために使用される設計パターンです。

依存性の注入は、開発者が次のような一般的な課題に対処できるため、人気のあるパターンです。

- **コードの保守性の向上**: 依存性の注入により、関心事をよりクリーンに分離でき、リファクタリングを容易にし、コードの重複を減らせます。
- **スケーラビリティ**: モジュール化された機能を複数のコンテキストで再利用でき、スケーリングが容易になります。
- **テストの改善**: DIを使用すると、実際の実装を使用することが実用的でない状況で、ユニットテストが簡単に[テストダブル](https://en.wikipedia.org/wiki/Test_double)を使用できるようになります。

## Angularでの依存性の注入の仕組み {#how-does-dependency-injection-work-in-angular}

依存関係とは、クラスが動作するために必要であるが、自分自身では作成しないオブジェクト、値、関数、またはサービスのことです。言い換えれば、依存関係がなければ機能しないため、アプリケーションのさまざまな部分間の関係を作成します。

コードが依存性の注入システムとやり取りする方法は2つあります。

- コードは値を _提供_ (利用可能にする) できます。
- コードは依存関係としてそれらの値を _注入_ (要求) できます。

この文脈での「値」とは、オブジェクトや関数を含む任意のJavaScriptの値です。注入される依存関係の一般的なタイプには次のものがあります。

- **設定値**: 環境固有の定数、API URL、機能フラグなど
- **ファクトリー**: 実行時の条件に基づいてオブジェクトまたは値を作成する関数
- **サービス**: 共通の機能、ビジネスロジック、または状態を提供するクラス

AngularのコンポーネントとディレクティブはDIに自動的に参加します。つまり、依存関係を注入でき、_かつ_ 注入される対象として利用可能になります。

## サービスとは {#what-are-services}

Angular _サービス_ は `@Injectable` で装飾されたTypeScriptクラスで、クラスのインスタンスを依存関係として注入できるようにします。サービスは、アプリケーション全体でデータと機能を共有する最も一般的な方法です。

サービスの一般的なタイプには次のものがあります。

- **データクライアント:** データの取得と変更のためにサーバーへのリクエストを行う詳細を抽象化します
- **状態管理:** 複数のコンポーネントまたはページ間で共有される状態を定義します
- **認証と認可:** ユーザー認証、トークンストレージ、アクセス制御を管理します
- **ロギングとエラー処理:** ユーザーにエラー状態をログ記録または通知するための共通APIを確立します
- **イベント処理とディスパッチ:** 特定のコンポーネントに関連付けられていないイベントや通知を処理したり、[オブザーバーパターン](https://en.wikipedia.org/wiki/Observer_pattern)に従ってコンポーネントにイベントや通知をディスパッチしたりします
- **ユーティリティ関数:** データフォーマット、検証、計算などの再利用可能なユーティリティ関数を提供します

次の例は、`AnalyticsLogger` という名前のサービスを宣言しています。

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString()
    })
  }
}
```

NOTE: `providedIn: 'root'` オプションにより、このサービスはシングルトンとしてアプリケーション全体で利用可能になります。これはほとんどのサービスで推奨されるアプローチです。

## `inject()` による依存性の注入 {#injecting-dependencies-with-inject}

Angularの `inject()` 関数を使用して依存関係を注入できます。

次は、`AnalyticsLogger` とAngularの `Router` サービスを注入して、イベントを追跡しながらユーザーが別のページに移動できるようにするナビゲーションバーの例です。

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsLogger } from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `
    <a href="#" (click)="navigateToDetail($event)">Detail Page</a>
  `,
})
export class NavbarComponent {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### `inject()` はどこで使用できるか {#where-can-inject-be-used}

コンポーネント、ディレクティブ、またはサービスの構築中に依存関係を注入できます。`inject` の呼び出しは、`constructor` またはフィールドイニシャライザーのいずれかに配置できます。一般的な例をいくつか示します。

```ts
@Component({...})
export class MyComponent {
  // ✅ クラスフィールドイニシャライザー内
  private service = inject(MyService);

  // ✅ コンストラクター本体内
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ クラスフィールドイニシャライザー内
  private element = inject(ElementRef);
}
```

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MyService {
  // ✅ サービス内
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ ルートガード内
  const auth = inject(AuthService);
  return auth.isAuthenticated();
}
```

Angularは「注入コンテキスト」という用語を使用して、コード内で `inject` を呼び出せる場所を説明します。コンポーネント、ディレクティブ、サービスの構築が最も一般的ですが、詳細については[注入コンテキスト](/guide/di/dependency-injection-context)を参照してください。

詳細については、[inject APIドキュメント](api/core/inject#usage-notes)を参照してください。

## 次のステップ {#next-steps}

Angularにおける依存性の注入の基本を理解したので、独自のサービスを作成する方法を学ぶ準備ができました。

次のガイド [サービスの作成と使用](guide/di/creating-and-using-services) では、次のことを学びます。

- Angular CLIまたは手動でサービスを作成する方法
- `providedIn: 'root'` パターンの仕組み
- サービスをコンポーネントや他のサービスに注入する方法

これは、Angularアプリケーションでサービスを使用する最も一般的なユースケースをカバーしています。
