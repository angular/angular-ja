# 注入可能なサービスの作成

サービスとは、アプリケーションが必要とする値、関数、または機能を包括的に表すカテゴリーです。
サービスは、通常、狭く明確に定義された目的を持つクラスです。
コンポーネントは、DIを使用できるクラスの一種です。

Angularは、モジュール性と再利用性を高めるために、コンポーネントとサービスを区別しています。
コンポーネントのビュー関連の機能を他の処理から分離することで、コンポーネントクラスをスリムで効率的にできます。

理想的には、コンポーネントの役割は、ユーザー体験を実現することだけです。
コンポーネントは、データバインディング用のプロパティとメソッドを提供し、ビュー（テンプレートによってレンダリングされる）とアプリケーションロジック（多くの場合、モデルの概念が含まれる）の仲介役を果たすべきです。

コンポーネントは、サーバーからのデータの取得、ユーザー入力の検証、またはコンソールへの直接ログ記録など、特定のタスクをサービスに委譲できます。
このような処理タスクを注入可能サービスクラスで定義することで、これらのタスクをどのコンポーネントからも利用できるようになります。
また、状況に応じて、同じ種類のサービスの異なるプロバイダーを構成することで、アプリケーションをより適応性高くできます。

Angularは、これらの原則を強制しません。
Angularは、アプリケーションロジックをサービスに分解し、それらのサービスをDIを介してコンポーネントに提供することを容易にすることで、これらの原則に従うように支援します。

## サービスの例

ブラウザコンソールにログ記録するサービスクラスの例を以下に示します。

<docs-code header="src/app/logger.service.ts (class)" language="typescript">
export class Logger {
  log(msg: unknown) { console.log(msg); }
  error(msg: unknown) { console.error(msg); }
  warn(msg: unknown) { console.warn(msg); }
}
</docs-code>

サービスは、他のサービスに依存できます。
たとえば、次の`HeroService`は`Logger`サービスに依存し、`BackendService`を使用してヒーローを取得します。
そのサービスは、さらに`HttpClient`サービスに依存して、サーバーからヒーローを非同期に取得する場合があります。

<docs-code header="src/app/hero.service.ts (class)" language="typescript"
           highlight="[5,6,10,12]">
export class HeroService {
  private heroes: Hero[] = [];

  constructor(
    private backend: BackendService,
    private logger: Logger) {}

  async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
</docs-code>

## 注入可能なサービスの作成

Angular CLIは、新しいサービスを作成するためのコマンドを提供します。
次の例では、既存のアプリケーションに新しいサービスを追加します。

`src/app/heroes`フォルダーに新しい`HeroService`クラスを生成するには、次の手順に従います。

1. 次の[Angular CLI](/tools/cli)コマンドを実行します。

<docs-code language="sh">
ng generate service heroes/hero
</docs-code>

このコマンドは、次のデフォルトの`HeroService`を作成します。

<docs-code header="src/app/heroes/hero.service.ts (CLI-generated)" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {}
</docs-code>

`@Injectable()`デコレーターは、AngularがDIシステムでこのクラスを使用できることを指定します。
メタデータ`providedIn: 'root'`は、`HeroService`がアプリケーション全体で提供されることを意味します。

ヒーローのモックデータを取得するために、`mock.heroes.ts`からヒーローを返す`getHeroes()`メソッドを追加します。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript">
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';

@Injectable({
  // このサービスがルートアプリケーションインジェクターによって作成されることを宣言します。
  providedIn: 'root',
})
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
</docs-code>

明確さと保守性の観点から、コンポーネントとサービスは別々のファイルに定義することをお勧めします。

## サービスの注入

コンポーネントにサービスを依存性として注入するには、コンポーネントの`constructor()`を使用し、依存性の型を持つコンストラクター引数を指定します。

次の例では、`HeroListComponent`コンストラクターに`HeroService`を指定しています。
`heroService`の型は`HeroService`です。
`HeroService`クラスはすでに`@Injectable`デコレーターで修飾されているため、Angularは`HeroService`型を依存性として認識します。

<docs-code header="src/app/heroes/hero-list.component (constructor signature)" language="typescript">
  constructor(heroService: HeroService)
</docs-code>

## 他のサービスでのサービスの注入

サービスが別のサービスに依存する場合、コンポーネントへの注入と同じパターンに従います。
次の例では、`HeroService`は`Logger`サービスに依存して、そのアクティビティを報告します。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[3,9,12]">
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Logger } from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(private logger: Logger) {}

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
</docs-code>

この例では、`getHeroes()`メソッドは、ヒーローを取得する際にメッセージをログ記録することで、`Logger`サービスを使用しています。

## 次のステップ

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="依存性プロバイダーの構成"/>
  <docs-pill href="/guide/di/dependency-injection-providers#using-an-injectiontoken-object" title="`InjectionTokens`"/>
</docs-pill-row>
