# 依存性の注入を理解する

依存性の注入（DI）は、Angularの基本的な概念の1つです。DIはAngularフレームワークに組み込まれており、コンポーネント、ディレクティブ、パイプ、InjectableなどのAngularデコレーターをもつクラスが必要とする依存オブジェクトを設定できるようにします。

DIシステムには大きく分けて2つの役割が存在します。依存性コンシューマーと依存性プロバイダーです。

Angular は [インジェクター](guide/glossary#injector) と呼ばれる抽象概念を用いて、依存性コンシューマーと依存性プロバイダー間のやりとりを容易にします。依存オブジェクトが要求されると、インジェクターはレジストリをチェックし、そこにすでに利用可能なインスタンスがあるかどうかを確認します。ない場合は、新しいインスタンスが作成され、レジストリに保存されます。Angularはアプリケーションの起動時にアプリケーション全体のインジェクター（「ルート」インジェクターとも呼ばれる）を作成し、必要に応じて他のインジェクターも作成します。ほとんどの場合、手動でインジェクターを作成する必要はありませんが、プロバイダーとコンシューマーを接続するレイヤーがあることを知っておくべきでしょう。

このトピックでは、あるクラスがどのように依存オブジェクトとして機能するかについての基本的なシナリオを説明します。Angular では、関数、オブジェクト、文字列やブール値のようなプリミティブ型、またはその他の型を依存オブジェクトとして使用することもできます。詳細については、[依存性プロバイダー](guide/dependency-injection-providers) を参照してください。

## 依存オブジェクトの提供

HeroServiceというクラスがあり、それがあるコンポーネントで依存オブジェクトとして動作する必要があると想像してください。

まず、@Injectableデコレーターを追加して、クラスが注入可能であることを示します。

<code-example language="typescript">
@Injectable()
class HeroService {}
</code-example>

次のステップは、それを提供することによって、DIで利用できるようにすることです。 依存オブジェクトは、複数の場所で提供することができます。

* コンポーネントレベルでは、 `@Component` デコレーターの `providers` フィールドを使用します。この場合、`HeroService` は、このコンポーネントのすべてのインスタンス、およびテンプレート内で使用されている他のコンポーネントやディレクティブで利用できるようになります。たとえば:

<code-example language="typescript">
@Component({
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
</code-example>

コンポーネントレベルでプロバイダーを登録すると、そのコンポーネントの新しいインスタンスごとに、サービスの新しいインスタンスを取得します。

* NgModule レベルでは、`@NgModule` デコレーターの `providers` フィールドを使用します。このシナリオでは、`HeroService` はこの NgModule で宣言されたすべてのコンポーネント、ディレクティブ、パイプで利用することができます。たとえば:

<code-example language="typescript">
@NgModule({
  declarations: [HeroListComponent]
  providers: [HeroService]
})
class HeroListModule {}
</code-example>

特定のNgModuleにプロバイダーを登録すると、そのNgModule内のすべてのコンポーネントでサービスの同じインスタンスが利用できます。

* アプリケーションのルートレベルでは、アプリケーション内の他のクラスへのインジェクトが可能になります。これは、 `@Injectable` デコレーターに `providedIn: 'root'` フィールドを追加することによって行います。

<code-example language="typescript">
@Injectable({
  providedIn: 'root'
})
class HeroService {}
</code-example>

ルートレベルでサービスを提供すると、Angularは`HeroService`の単一の共有インスタンスを作成し、それを要求するクラスに注入します。また、`@Injectable`メタデータにプロバイダーを登録することで、Angularはコンパイルされたアプリケーションからサービスが使用されない場合、ツリーシェイキングと呼ばれる処理でサービスを削除し、アプリケーションを最適化することができます。

## 依存オブジェクトを注入する

依存オブジェクトを注入するもっとも一般的な方法は、クラスのコンストラクターでそれを宣言することです。Angularがコンポーネント、ディレクティブ、パイプクラスの新しいインスタンスを作成するとき、コンストラクター引数の型を見て、そのクラスがどのサービスや他の依存オブジェクトを必要とするかを決定します。たとえば、`HeroListComponent`が`HeroService`を必要とする場合、コンストラクターは次のようになります。

<code-example language="typescript">
@Component({ … })
class HeroListComponent {
  constructor(private service: HeroService) {}
}
</code-example>

Angularはコンポーネントがあるサービスに依存していることを検出すると、まずインジェクターにそのサービスの既存のインスタンスがあるかどうかをチェックします。要求されたサービスのインスタンスがまだ存在しない場合、 インジェクターは登録されたプロバイダーを使ってインスタンスを作成し、 それをインジェクターに追加してから Angular にサービスを返します。

要求されたサービスがすべて解決されて返されると、Angularはそれらのサービスを引数としてコンポーネントのコンストラクターを呼び出すことができます。

<div class="lightbox">
  <img src="generated/images/guide/architecture/injector-injects.png" alt="Service" class="left">
</div>

## What's next

* [Creating and injecting services](guide/creating-injectable-service)
* [Dependency Injection in Action](guide/dependency-injection-in-action)

@reviewed 2022-08-02
