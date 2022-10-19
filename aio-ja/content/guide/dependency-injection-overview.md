# Angularにおける依存性の注入

モジュールやクラスなど、システムの小さな部分を開発する際には、 他のクラスの機能を使用する必要があるでしょう。たとえば、バックエンドを呼び出すためにHTTPサービスが必要になることがあります。依存性の注入（DI）は、アプリケーションのある部分を作成し、それを必要とするアプリケーションの他の部分に提供するためのデザインパターンとメカニズムです。Angularはこのデザインパターンをサポートしており、アプリケーションでこれを使用することで柔軟性とモジュール性を高めることができます。

Angularでは依存オブジェクトは一般的にサービスですが、文字列や関数のような値であってもかまいません。アプリケーションのインジェクター（ブートストラップ中に自動的に作成される）は、必要なときに、設定されたサービスや値のプロバイダーを使用して依存オブジェクトをインスタンス化します。

<div class="alert is-helpful">

このガイドのコードスニペットを含む動作例については、<live-example name="dependency-injection"></live-example>をご覧ください。

</div>

## 前提知識

Angularアプリケーション全般に慣れていて、コンポーネント、ディレクティブ、NgModuleの基本的な知識があることが必要です。次のチュートリアルを済ませておくことを強くお勧めします。

[Tour of Heroes application and tutorial](tutorial)

## Angularの依存性の注入について学ぶ

<div class="card-container">
  <a href="guide/dependency-injection" class="docs-card" title="依存性の注入を理解する">
    <section>依存性の注入を理解する</section>
    <p>Angularにおける依存性の注入の基本原理を学びます。</p>
    <p class="card-footer">依存性の注入を理解する</p>
  </a>
  <a href="guide/creating-injectable-service" class="docs-card" title="サービスの作成と注入">
    <section>サービスの作成と注入</section>
    <p>サービスを作成し、他のサービスやコンポーネントに注入する方法について説明します。</p>
    <p class="card-footer">注入可能なサービスを作成する</p>
  </a>
  <a href="guide/dependency-injection-providers" class="docs-card" title="依存性プロバイダーの設定">
    <section>依存性プロバイダーの設定</section>
    <p>@Componentデコレータと@NgModuleデコレータのprovidersフィールドを使用して依存オブジェクトを設定する方法について説明します。また、クラス以外の値を依存オブジェクトとして使用したい場合に役立つ、DIで値を提供し注入するためのInjectionTokenの使用方法について説明します。</p>
    <p class="card-footer">依存性プロバイダーの設定</p>
  </a>
  <a href="guide/hierarchical-dependency-injection" class="docs-card" title="階層化インジェクター">
    <section>階層化インジェクター</section>
    <p>階層化されたDIは、必要なときに必要なだけ、アプリケーションの異なる部分間で依存オブジェクトを共有することを可能にします。これは上級者向けのトピックです。</p>
    <p class="card-footer">階層化インジェクター</p>
  </a>
</div>

@reviewed 2022-08-02
