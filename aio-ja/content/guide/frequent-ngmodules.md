# よく使用されるモジュール

Angularアプリケーションにはルートモジュールとして機能するモジュールが少なくとも1つ必要です。
アプリケーションに機能を追加するときはモジュールとして追加することができます。
次は、
よく使用されるAngularモジュールとその仕様例です:


<table>

 <tr>
   <th style="vertical-align: top">
     NgModule
   </th>

   <th style="vertical-align: top">
     インポート元
   </th>

   <th style="vertical-align: top">
     使用する理由
   </th>
 </tr>

 <tr>
   <td><code>BrowserModule</code></td>
   <td><code>@angular/platform-browser</code></td>
   <td>アプリケーションをブラウザで実行したいとき</td>
 </tr>

 <tr>
   <td><code>CommonModule</code></td>
   <td><code>@angular/common</code></td>
   <td><code>NgIf</code>、 <code>NgFor</code>を使用したいとき</td>
 </tr>

 <tr>
   <td><code>FormsModule</code></td>
   <td><code>@angular/forms</code></td>
   <td>テンプレート駆動のフォームを作成したいとき (<code>NgModel</code>を含みます)</td>
 </tr>

 <tr>
   <td><code>ReactiveFormsModule</code></td>
   <td><code>@angular/forms</code></td>
   <td>リアクティブフォームを作成したいとき</td>
 </tr>

 <tr>
   <td><code>RouterModule</code></td>
   <td><code>@angular/router</code></td>
   <td><code>RouterLink</code>,<code>.forRoot()</code>, and <code>.forChild()</code>を使用したいとき</td>
 </tr>

 <tr>
   <td><code>HttpClientModule</code></td>
   <td><code>@angular/common/http</code></td>
   <td>サーバーと通信したいとき</td>
 </tr>

</table>

## モジュールをインポートする

これらのAngularモジュールを使用するときは、
必要に応じて`AppModule`かフィーチャーモジュールにインポートし、
`@NgModule`の`imports`配列に追加します。
たとえば、[Angular CLI](cli)によって生成された基本的なアプリケーションでは、
`BrowserModule`は`app.module.ts`の`AppModule`のトップに最初のインポートとして登録されています。


```typescript
/* AppModuleがアクセスできるようにモジュールをインポートします */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ /* ここにモジュールを追加してAngularにそれらが使用されていることを知らせます */
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

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

<hr />


## NgModuleについてのさらに詳しい情報

NgModuleについてのさらに詳しい情報については次の記事を参照してください:
* [ブートストラップ](guide/bootstrapping)
* [NgModule](guide/ngmodules)
* [JavaScriptモジュールとNgModule](guide/ngmodule-vs-jsmodule)
