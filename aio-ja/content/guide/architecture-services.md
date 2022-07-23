# サービスと依存性の注入のイントロダクション {@a introduction-to-services-and-dependency-injection}

*サービス*は、アプリケーションが必要とするあらゆる値、関数、機能を含む幅広いカテゴリーです。
サービスは通常、目的が明確な小規模のクラスです。
特定の作業を行い、適切に処理するべきです。

Angular はサービスとコンポーネントを区別してモジュール性と再利用性を高めます。

理想的には、コンポーネントの仕事はユーザー体験だけを可能にすることです。
コンポーネントは、ビューとアプリケーションロジックの間を取りもつデータバインディング用のプロパティとメソッドを提供する必要があります。ビューとはテンプレートがレンダリングするもので、アプリケーションロジックとは *モデル* という概念を含むものです。

コンポーネントは、ビューやアプリケーションロジックに関係しないタスクにサービスを使用する必要があります。このような処理のタスクを*注入可能なサービスクラス*で定義することにより、これらのタスクを任意のコンポーネントで使用できるようにします。
さまざまな状況に応じて同じ種類のサービスの異なるプロバイダーを注入することで、アプリケーションの適応性を高めることもできます。

Angularはこれらの原則を*強制*しません。
代わりに、Angularはアプリケーションロジックをサービスに組み込むことを容易にし、*依存オブジェクトの注入*でコンポーネントからこれらのサービスを利用できるようにすることで、これらの原則に*倣う*のに役立ちます。

## サービスの例

次に、ブラウザコンソールにログを記録するサービスクラスの例を示します。

<code-example header="src/app/logger.service.ts (class)" path="architecture/src/app/logger.service.ts" region="class"></code-example>

サービスは他のサービスに依存することがあります。
たとえば、`HeroService` は `Logger` サービスに依存し、`BackendService` を使ってヒーローを取得します。
そのサービスは、サーバーからヒーローを非同期的に取り出すための `HttpClient` サービスに依存するかもしれません。

<code-example header="src/app/hero.service.ts (class)" path="architecture/src/app/hero.service.ts" region="class"></code-example>

## 依存性の注入 (DI)

<div class="lightbox">

<img alt="Service" class="left" src="generated/images/guide/architecture/dependency-injection.png">

</div>

依存オブジェクトの注入（DI）はAngularフレームワークの一部で、コンポーネントにサービスや他のリソースへのアクセスを提供するものです。
Angularはサービスをコンポーネントに *注入* して、そのコンポーネントがサービスにアクセスできるようにする機能を提供します。

`Injectable()` デコレーターはクラスを Angular のサービスとして定義し、Angular がそのクラスを *依存オブジェクト* としてコンポーネントに注入することを可能にします。
同様に、`@Injectable()`デコレーターは、コンポーネント、クラス、パイプ、NgModuleがサービスに *依存* していることを表します。

*  *インジェクター* は主なメカニズムです。
   Angular はブートストラップ処理中にアプリケーション全体のインジェクターを作成し、必要に応じて追加のインジェクターを作成します。
   インジェクターを作成する必要はありません。

*  インジェクターは依存関係を作成し、可能であれば再利用する依存関係インスタンスの*コンテナ*を保持します。
*  *プロバイダー* は、インジェクターに依存性を取得または作成する方法を伝えるオブジェクトです。

あなたのアプリケーションで必要な依存関係がある場合は、アプリケーションのインジェクターにプロバイダーを登録しなければならず、その結果インジェクターはプロバイダーを使用して新しいインスタンスを作成できます。
サービスの場合、プロバイダーは通常、サービスクラスそのものです。

<div class="alert is-helpful">

依存関係はサービスである必要はありません。たとえば、関数や値などです。

</div>

Angular は、コンポーネントクラスの新しいインスタンスを作成するとき、コンストラクターのパラメータタイプを調べることによってコンポーネントが必要とするサービスやその他の依存関係を判断します。
たとえば、`HeroListComponent` のコンストラクターには　`HeroService` が必要です。

<code-example header="src/app/hero-list.component.ts (constructor)" path="architecture/src/app/hero-list.component.ts" region="ctor"></code-example>

Angular はコンポーネントがサービスに依存していることを検出すると、インジェクターにそのサービスの既存のインスタンスがあるかどうかをまずチェックします。
要求されたサービスインスタンスがまだ存在しない場合、インジェクターは登録されたプロバイダーを使用してインスタンスを作成し、サービスを Angular に返す前にインジェクターに追加します。

要求されたサービスがすべて解決されて返されると、Angular はそれらのサービスを引数としてコンポーネントのコンストラクターを呼び出すことができます。

`HeroService`注入のプロセスは、このようになります。

<div class="lightbox">

<img alt="Service" class="left" src="generated/images/guide/architecture/injector-injects.png">

</div>

### サービスの提供 {@a providing-services}

あなたは、使用しようとしているサービスの*プロバイダー*を少なくとも1つ登録する必要があります。
プロバイダーはサービスをどこからでも利用できるようにサービス自体のメタデータの一部にできるし、もしくは、プロバイダーを特定のモジュールまたはコンポーネントに登録できます。
サービスのメタデータ(`@Injectable()` デコレーター内) または`@NgModule()` や `@Component()` メタデータにプロバイダーを登録します。

*  デフォルトでは Angular CLI コマンド [ng generate service](cli/generate) はプロバイダーのメタデータを `@Injectable()` デコレーターに含めることによって、あなたのサービスのためにプロバイダーをルートインジェクターに登録します。
   このチュートリアルでは、この方法を使用して HeroService クラス定義のプロバイダーを登録します。

   <code-example format="typescript" language="typescript">

   &commat;Injectable({
    providedIn: 'root',
   })

   </code-example>

   ルートレベルでサービスを提供すると、Angularは `HeroService` の共有インスタンスを1つ作成し、
   それを求めるクラスに注入します。
   `@Injectable()` メタデータにプロバイダーを登録することは、サービスが使用されない場合にコンパイルされるアプリケーションからサービスを削除してアプリケーションを最適化することを、
   Angularに許可することにもなります。これは *Tree-Shaking* として知られるプロセスです。

*  プロバイダーを[特定の NgModule](guide/architecture-modules) に登録すると、そのNgModule内のすべてのコンポーネントで同じサービスのインスタンスを使用できます。
   このレベルで登録するには、`@NgModule()` デコレーターの `providers` プロパティを使用します。

    <code-example format="typescript" language="typescript">

    &commat;NgModule({
      providers: [
      BackendService,
      Logger
     ],
     &hellip;
    })

    </code-example>

*  コンポーネントレベルでプロバイダーを登録すると、そのコンポーネントの新しいインスタンスごとに新しいサービスインスタンスが取得されます。
   コンポーネントレベルで `@Component()` メタデータの `providers` プロパティにサービスプロバイダーを登録します。

   <code-example header="src/app/hero-list.component.ts (component providers)" path="architecture/src/app/hero-list.component.ts" region="providers"></code-example>

詳細は、[依存性の注入](guide/dependency-injection)セクションを参照してください.

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
