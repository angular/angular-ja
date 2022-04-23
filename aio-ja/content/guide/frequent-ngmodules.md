# よく使用されるモジュール

Angularアプリケーションにはルートモジュールとして機能するモジュールが少なくとも1つ必要です。
アプリケーションに機能を追加するときはモジュールとして追加することができます。
次は、よく使用されるAngularモジュールとその仕様例です:

| NgModule              | インポート元              | 使用する理由 |
|:---                   |:---                         |:---            |
| `BrowserModule`       | `@angular/platform-browser` | アプリケーションをブラウザで実行したいとき |
| `CommonModule`        | `@angular/common`           | <code>NgIf</code>、 <code>NgFor</code>を使用したいとき |
| `FormsModule`         | `@angular/forms`            | テンプレート駆動のフォームを作成したいとき (<code>NgModel</code>を含みます) |
| `ReactiveFormsModule` | `@angular/forms`            | リアクティブフォームを作成したいとき |
| `RouterModule`        | `@angular/router`           | <code>RouterLink</code>,<code>.forRoot()</code>, and <code>.forChild()</code>を使用したいとき  |
| `HttpClientModule`    | `@angular/common/http`      | サーバーとHTTP通信したいとき  |

## モジュールをインポートする

これらのAngularモジュールを使用するときは、必要に応じて`AppModule`かフィーチャーモジュールにインポートし、`@NgModule`の`imports`配列に追加します。
たとえば、[Angular CLI](cli)によって生成された基本的なアプリケーションでは、`BrowserModule`は`app.module.ts`の`AppModule`のトップに最初のインポートとして登録されています。


<code-example format="typescript" language="typescript">

/* import modules so that AppModule can access them */
import { BrowserModule } from '&commat;angular/platform-browser';
import { NgModule } from '&commat;angular/core';

import { AppComponent } from './app.component';

&commat;NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ /* add modules here so Angular knows to use them */
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

</code-example>

1番上にあるインポートの列はJavaScriptのインポート文で、
`@NgModule`内の`imports`配列はAngular固有のものです。
違いについての詳細は[JavaScriptモジュールとNgModule](guide/ngmodule-vs-jsmodule)を参照してください。


## `BrowserModule` と `CommonModule`

`BrowserModule`は
`ngIf`や`ngFor`のような多くの共通で使用されるディレクティブを提供する`CommonModule`をインポートしています。
さらに、`BrowserModule`は`CommonModule`を再エクスポートし、
`BrowserModule`をインポートするすべてのモジュールでそのディレクティブを利用できるようにします。

ブラウザで実行されるアプリケーションの場合、ブラウザアプリケーションを起動して実行するために必要なサービスを提供するためにルートモジュールである`AppModule`に`
BrowserModule`をインポートします。
`BrowserModule`のプロバイダーはアプリケーション全体のためのものなのでフィーチャーモジュールでなくルートモジュールにインポートする必要があります。
フィーチャーモジュールは`CommonModule`
の共通ディレクティブのみを必要とします。
アプリケーション全体のプロバイダーを再インストールする必要はありません。

遅延読み込みされたフィーチャーモジュールに`BrowserModule`をインポートした場合、
Angularは`CommonModule`を代わりに使用するように指示するエラーを返します。

<div class="lightbox">
  <img src="generated/images/guide/frequent-ngmodules/browser-module-error.gif" width=750 alt="BrowserModule error">
</div>


## NgModuleについてのさらに詳しい情報

NgModuleについてのさらに詳しい情報については次の記事を参照してください:
* [ブートストラップ](guide/bootstrapping)
* [NgModule](guide/ngmodules)
* [JavaScriptモジュールとNgModule](guide/ngmodule-vs-jsmodule)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
