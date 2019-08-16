# フィーチャーモジュール

フィーチャーモジュールはコードを整理する目的で用いられるNgModuleです。

この記事で説明されているフィーチャーモジュールを含む最終的なサンプルアプリケーションについては、
<live-example></live-example>を参照してください。

<hr>

あなたのアプリケーションが成長したとしましょう。あなたは個別の機能について関連するコードを整理することができます。
これは機能を明確に分けたいときに役立ちます。フィーチャーモジュールによって、
特定の機能に関連するコードを管理したり、
他のコードから機能を分離することができます。
アプリケーションの領域を線引きすることは、開発者やチーム間でのコラボレーション、
ディレクティブの分離やルートモジュールの調整を行うときの助けになるでしょう。


## フィーチャーモジュールとルートモジュール

フィーチャーモジュールは構造的なベストプラクティスであり、コアAngular APIのコンセプトと対照的です。
フィーチャーモジュールは、ユーザーのワークフロー、ルーティング、フォームなど、
特定のアプリケーションのニーズにフォーカスした一貫した機能のセットを提供します。
ルートモジュール内だけですべてを完結できますが、
フィーチャーモジュールはアプリを集中した領域に分割するのに役立ちます。 
フィーチャーモジュールは、それが提供するサービスや共有するコンポーネント、
ディレクティブ、およびパイプを介して、ルートモジュールおよび他のモジュールと連携します。

## フィーチャーモジュールの作成方法

すでに[Angular CLI](cli)で生成したアプリケーションがある場合は、
次のコマンドをプロジェクトのルートディレクトリで実行してフィーチャーモジュールを生成してください。
`CustomerDashboard`はあなたの好きなモジュール名に置きかえてかまいません。
"Module"接尾辞についてはCLIが付け加えてくれるので省略することができます:

```sh
ng generate module CustomerDashboard

```


結果的に、CLIは次のような内容の`customer-dashboard.module.ts`というファイルを中にもつ`customer-dashboard`フォルダーを作ります:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CustomerDashboardModule { }
```

NgModuleの構造はルートモジュールでもフィーチャーモジュールでも同じです。CLIで生成されたフィーチャーモジュールは、ファイルの先頭に2つのJavaScriptインポート文を持ちます。最初のインポートは`NgModule`です。ルートモジュールと同様に`@NgModule`デコレーターを使用できます。 2つ目は`CommonModule`です。これは`ngIf`や`ngFor`のような多くの一般的なディレクティブを提供します。フィーチャーモジュールでは`BrowserModule`(ルートモジュールで一度だけインポートされる)の代わりに`CommonModule`をインポートします。`CommonModule`にはほとんどのテンプレートで必要とされる`ngIf`や`ngFor`のようなディレクティブの情報しか含まれていません。対して、`BrowserModule`はブラウザ用のAngularアプリケーションが一度だけ行う必要のある設定を行います。

`declarations`配列はこの個別のモジュールにのみ属するコンポーネント、ディレクティブ、およびパイプの宣言を追加するために利用できます。
コンポーネントを追加するには、コマンドラインで次のコマンドを実行してください。`customer-dashboard`は、CLIがフィーチャーモジュールを生成したディレクトリで、`CustomerDashboard`はコンポーネント名です:

```sh
ng generate component customer-dashboard/CustomerDashboard

```

これにより、custom-dashboardフォルダ内に新しいコンポーネントのためのフォルダが生成され、`CustomerDashboardComponent`の情報でフィーチャーモジュールが更新されます:


<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard.module.ts" region="customer-dashboard-component" header="src/app/customer-dashboard/customer-dashboard.module.ts"></code-example>



`CustomerDashboardComponent`はいま、JavaScriptのインポートリストの一番上にインポートされ、さらにAngularに新しいコンポーネントがこのフィーチャーモジュールに関連することを知らせるために`declarations`配列に追加されました。

## フィーチャーモジュールをインポートする

フィーチャーモジュールをアプリケーションに組み込むためには、ルートモジュールである`app.module.ts`にそのモジュールについて知ってもらう必要があります。 `customer-dashboard.module.ts`の最後で`CustomerDashboardModule`がエクスポートされていることに注目してください。これにより他のモジュールがアクセスできるようになります。`AppModule`にインポートするために、`app.module.ts`の`imports`配列に追加してみましょう:

<code-example path="feature-modules/src/app/app.module.ts" region="app-module" header="src/app/app.module.ts"></code-example>


これで`AppModule`はフィーチャーモジュールについて知っている状態になりました。フィーチャーモジュールにサービスプロバイダーを追加した場合、他のフィーチャーモジュールと同様に`AppModule`もそれについて知っている状態になります。ただし、NgModuleは自身のコンポーネントを公開しません。


## フィーチャーモジュールのコンポーネントテンプレートをレンダリングする

CLIがフィーチャーモジュールのために`CustomerDashboardComponent`を生成したとき、それは次のようなマークアップの`customer-dashboard.component.html`テンプレートを含んでいました:

<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html" region="feature-template" header="src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html"></code-example>


`AppComponent`でこのHTMLを見るためには、まず`CustomerDashboardModule`内の`CustomerDashboardComponent`をエクスポートしなければなりません。 `customer-dashboard.module.ts`の`declarations`配列の直下に、 `CustomerDashboardModule`を含む`exports`配列を追加しましょう:

<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard.module.ts" region="component-exports" header="src/app/customer-dashboard/customer-dashboard.module.ts"></code-example>



次に、`AppComponent`、`app.component.html`に`<app-customer-dashboard>`タグを追加します:

<code-example path="feature-modules/src/app/app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>


そして、デフォルトでレンダリングされるタイトルに加えて、 `CustomerDashboardComponent`テンプレートもレンダリングされます:


<figure>
 <img src="generated/images/guide/feature-modules/feature-module.png" alt="feature module component">
</figure>

<hr />

## NgModuleについてのさらに詳しい情報

あなたは次の記事に興味があるかもしれません:
* [Angularルーターによるモジュールの遅延ロード](guide/lazy-loading-ngmodules).
* [プロバイダー](guide/providers).
* [フィーチャーモジュールの種類](guide/module-types).
