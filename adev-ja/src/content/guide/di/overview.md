<docs-decorative-header title="Angularの依存性の注入" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
"DI" は、アプリケーションの一部を作成して、それらを必要とするアプリケーションの他の部分に提供するための設計パターンとメカニズムです。
</docs-decorative-header>

Tip: この包括的なガイドに取り組む前に、Angularの [基本概念](essentials/dependency-injection) を確認してください。

モジュールやクラスなどのシステムのより小さな部分を開発する場合、他のクラスの機能を使用する必要がある場合があります。たとえば、バックエンドを呼び出すためにHTTPサービスが必要になる場合があります。依存性の注入 (DI) は、アプリケーションの一部を作成して、それらを必要とするアプリケーションの他の部分に提供するための設計パターンとメカニズムです。Angularはこの設計パターンをサポートしており、アプリケーションでこれを利用することで、柔軟性とモジュール性を高めることができます。

Angularでは、依存関係は通常サービスですが、文字列や関数などの値となることもあります。アプリケーションのインジェクター（ブートストラップ時に自動的に作成されます）は、サービスまたは値の構成されたプロバイダーを使用して、必要に応じて依存関係をインスタンス化します。

## Angular の依存性の注入について学ぶ

<docs-card-container>
  <docs-card title="依存性の注入を理解する" href="/guide/di/dependency-injection">
    Angularの依存性の注入の基本原則を学びます。
  </docs-card>
  <docs-card title="サービスの作成と注入" href="/guide/di/creating-injectable-service">
    サービスを作成し、他のサービスやコンポーネントに注入する方法について説明します。
  </docs-card>
  <docs-card title="依存関係プロバイダーの構成" href="/guide/di/dependency-injection-providers">
    `@Component` および `@NgModule` デコレーターの `providers` フィールドを使用して依存関係を構成する方法について説明します。また、InjectionToken を使用して DI で値を提供および注入する方法についても説明します。これは、クラス以外の値を依存関係として使用する場合に役立ちます。
  </docs-card>
    <docs-card title="注入コンテキスト" href="/guide/di/dependency-injection-context">
    注入コンテキストとは何か、DI システムを必要とする場所にどのように使用するかについて説明します。
  </docs-card>
  <docs-card title="階層型インジェクター" href="/guide/di/hierarchical-dependency-injection">
    階層型 DI を使用すると、必要に応じてのみアプリケーションのさまざまな部分間で依存関係を共有できます。これは高度なトピックです。
  </docs-card>
</docs-card-container>
